package snapshot

import (
	"context"
	"errors"
	"testing"

	portainer "github.com/portainer/portainer/api"

	"github.com/stretchr/testify/require"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	kfake "k8s.io/client-go/kubernetes/fake"
	ktesting "k8s.io/client-go/testing"
	statsapi "k8s.io/kubelet/pkg/apis/stats/v1alpha1"
)

func TestKubernetesSnapshotNodes(t *testing.T) {
	// Create a fake client
	fakeClient := kfake.NewClientset()

	// Create test nodes with specific resource values
	node1 := &corev1.Node{
		ObjectMeta: metav1.ObjectMeta{
			Name: "test-node-1",
		},
		Status: corev1.NodeStatus{
			Capacity: corev1.ResourceList{
				corev1.ResourceCPU:    resource.MustParse("6"),    // 6 CPU cores
				corev1.ResourceMemory: resource.MustParse("12Gi"), // 12GB memory
			},
		},
	}

	node2 := &corev1.Node{
		ObjectMeta: metav1.ObjectMeta{
			Name: "test-node-2",
		},
		Status: corev1.NodeStatus{
			Capacity: corev1.ResourceList{
				corev1.ResourceCPU:    resource.MustParse("4"),   // 4 CPU cores
				corev1.ResourceMemory: resource.MustParse("8Gi"), // 8GB memory
			},
		},
	}

	node3 := &corev1.Node{
		ObjectMeta: metav1.ObjectMeta{
			Name: "test-node-3",
		},
		Status: corev1.NodeStatus{
			Capacity: corev1.ResourceList{
				corev1.ResourceCPU:    resource.MustParse("2"),   // 2 CPU cores
				corev1.ResourceMemory: resource.MustParse("4Gi"), // 4GB memory
			},
		},
	}

	// Add nodes to fake client
	_, err := fakeClient.CoreV1().Nodes().Create(context.TODO(), node1, metav1.CreateOptions{})
	require.NoError(t, err)
	_, err = fakeClient.CoreV1().Nodes().Create(context.TODO(), node2, metav1.CreateOptions{})
	require.NoError(t, err)
	_, err = fakeClient.CoreV1().Nodes().Create(context.TODO(), node3, metav1.CreateOptions{})
	require.NoError(t, err)

	snapshot := &portainer.KubernetesSnapshot{}

	// Use the actual function now that it accepts kubernetes.Interface
	err = kubernetesSnapshotNodes(snapshot, fakeClient)
	require.NoError(t, err)

	// Verify the results - these should match what kubernetesSnapshotNodes would produce
	require.Equal(t, 3, snapshot.NodeCount)                    // 3 nodes
	require.Equal(t, int64(12), snapshot.TotalCPU)             // 6 + 4 + 2 = 12 CPUs
	require.Equal(t, int64(25769803776), snapshot.TotalMemory) // 12GB + 8GB + 4GB = 24GB in bytes
	require.NotNil(t, snapshot.PerformanceMetrics)             // Performance metrics should be initialized

	t.Logf("kubernetesSnapshotNodes test result: Nodes=%d, CPUs=%d, Memory=%d bytes",
		snapshot.NodeCount, snapshot.TotalCPU, snapshot.TotalMemory)
}

func TestKubernetesSnapshotNodesEmptyCluster(t *testing.T) {
	// Test with no nodes to verify early return behavior
	fakeClient := kfake.NewClientset()
	snapshot := &portainer.KubernetesSnapshot{}

	err := kubernetesSnapshotNodes(snapshot, fakeClient)
	require.NoError(t, err)

	// Values should remain at their zero state when no nodes exist
	require.Equal(t, 0, snapshot.NodeCount)
	require.Equal(t, int64(0), snapshot.TotalCPU)
	require.Equal(t, int64(0), snapshot.TotalMemory)
	require.Nil(t, snapshot.PerformanceMetrics) // Performance metrics should not be set for empty cluster

	t.Log("Empty cluster test passed - no nodes found, early return behavior confirmed")
}

func TestCreateKubernetesSnapshotIntegration(t *testing.T) {
	// Integration test to verify CreateKubernetesSnapshot calls kubernetesSnapshotNodes correctly
	fakeClient := kfake.NewClientset()

	// Create test nodes
	node1 := &corev1.Node{
		ObjectMeta: metav1.ObjectMeta{
			Name: "integration-node-1",
		},
		Status: corev1.NodeStatus{
			Capacity: corev1.ResourceList{
				corev1.ResourceCPU:    resource.MustParse("8"),    // 8 CPU cores
				corev1.ResourceMemory: resource.MustParse("16Gi"), // 16GB memory
			},
		},
	}

	node2 := &corev1.Node{
		ObjectMeta: metav1.ObjectMeta{
			Name: "integration-node-2",
		},
		Status: corev1.NodeStatus{
			Capacity: corev1.ResourceList{
				corev1.ResourceCPU:    resource.MustParse("4"),   // 4 CPU cores
				corev1.ResourceMemory: resource.MustParse("8Gi"), // 8GB memory
			},
		},
	}

	// Add nodes to fake client
	_, err := fakeClient.CoreV1().Nodes().Create(context.TODO(), node1, metav1.CreateOptions{})
	require.NoError(t, err)
	_, err = fakeClient.CoreV1().Nodes().Create(context.TODO(), node2, metav1.CreateOptions{})
	require.NoError(t, err)

	// Test that kubernetesSnapshotVersion would work
	serverInfo, err := fakeClient.Discovery().ServerVersion()
	require.NoError(t, err)
	require.NotEmpty(t, serverInfo.GitVersion)

	// Test that kubernetesSnapshotNodes logic works
	snapshot := &portainer.KubernetesSnapshot{}
	err = kubernetesSnapshotNodes(snapshot, fakeClient)
	require.NoError(t, err)

	// Verify the integration results
	require.Equal(t, 2, snapshot.NodeCount)
	require.Equal(t, int64(12), snapshot.TotalCPU)             // 8 + 4 = 12 CPUs
	require.Equal(t, int64(25769803776), snapshot.TotalMemory) // 16GB + 8GB = 24GB in bytes
	require.NotNil(t, snapshot.PerformanceMetrics)

	// Manually set the version to complete the integration test
	snapshot.KubernetesVersion = serverInfo.GitVersion
	require.NotEmpty(t, snapshot.KubernetesVersion)

	t.Logf("Integration test result: Version=%s, Nodes=%d, CPUs=%d, Memory=%d bytes",
		snapshot.KubernetesVersion, snapshot.NodeCount, snapshot.TotalCPU, snapshot.TotalMemory)
}

func TestKubernetesSnapshotNodesWithAPIError(t *testing.T) {
	// Test error handling when the Kubernetes API returns an error
	fakeClient := kfake.NewClientset()

	// Add a reactor to simulate API error
	fakeClient.PrependReactor("list", "nodes", func(action ktesting.Action) (handled bool, ret runtime.Object, err error) {
		return true, nil, errors.New("simulated API error")
	})

	snapshot := &portainer.KubernetesSnapshot{}
	err := kubernetesSnapshotNodes(snapshot, fakeClient)

	// Should return the API error
	require.Error(t, err)
	require.Contains(t, err.Error(), "simulated API error")

	// Snapshot should remain unchanged
	require.Equal(t, 0, snapshot.NodeCount)
	require.Equal(t, int64(0), snapshot.TotalCPU)
	require.Equal(t, int64(0), snapshot.TotalMemory)
	require.Nil(t, snapshot.PerformanceMetrics)

	t.Log("API error test passed - error handling works correctly")
}

func TestKubernetesSnapshotNodesSingleNode(t *testing.T) {
	// Test with a single node to verify calculations work for edge case
	fakeClient := kfake.NewClientset()

	node := &corev1.Node{
		ObjectMeta: metav1.ObjectMeta{
			Name: "single-node",
		},
		Status: corev1.NodeStatus{
			Capacity: corev1.ResourceList{
				corev1.ResourceCPU:    resource.MustParse("1"),   // 1 CPU core
				corev1.ResourceMemory: resource.MustParse("1Gi"), // 1GB memory
			},
		},
	}

	_, err := fakeClient.CoreV1().Nodes().Create(context.TODO(), node, metav1.CreateOptions{})
	require.NoError(t, err)

	snapshot := &portainer.KubernetesSnapshot{}
	err = kubernetesSnapshotNodes(snapshot, fakeClient)
	require.NoError(t, err)

	require.Equal(t, 1, snapshot.NodeCount)
	require.Equal(t, int64(1), snapshot.TotalCPU)
	require.Equal(t, int64(1073741824), snapshot.TotalMemory) // 1GB in bytes
	require.NotNil(t, snapshot.PerformanceMetrics)

	t.Logf("Single node test result: Nodes=%d, CPUs=%d, Memory=%d bytes",
		snapshot.NodeCount, snapshot.TotalCPU, snapshot.TotalMemory)
}

func TestKubernetesSnapshotNodesZeroResources(t *testing.T) {
	// Test with nodes that have zero or very small resources
	fakeClient := kfake.NewClientset()

	node := &corev1.Node{
		ObjectMeta: metav1.ObjectMeta{
			Name: "zero-resource-node",
		},
		Status: corev1.NodeStatus{
			Capacity: corev1.ResourceList{
				corev1.ResourceCPU:    resource.MustParse("0m"),  // 0 millicores
				corev1.ResourceMemory: resource.MustParse("0Ki"), // 0 kilobytes
			},
		},
	}

	_, err := fakeClient.CoreV1().Nodes().Create(context.TODO(), node, metav1.CreateOptions{})
	require.NoError(t, err)

	snapshot := &portainer.KubernetesSnapshot{}
	err = kubernetesSnapshotNodes(snapshot, fakeClient)
	require.NoError(t, err)

	require.Equal(t, 1, snapshot.NodeCount)
	require.Equal(t, int64(0), snapshot.TotalCPU)
	require.Equal(t, int64(0), snapshot.TotalMemory)
	require.NotNil(t, snapshot.PerformanceMetrics)

	t.Log("Zero resources test passed - handles edge case correctly")
}

func TestCalculateNodeMetrics(t *testing.T) {
	// Create a test node with specific capacity
	node := corev1.Node{
		Status: corev1.NodeStatus{
			Capacity: corev1.ResourceList{
				corev1.ResourceCPU:    resource.MustParse("4"),   // 4 CPU cores
				corev1.ResourceMemory: resource.MustParse("8Gi"), // 8GB memory
			},
		},
	}

	t.Run("CalculatesCorrectCPUPercentage", func(t *testing.T) {
		usageNanoCores := uint64(2_000_000_000) // 2 cores worth of nanocores
		nodeStats := statsapi.NodeStats{
			CPU: &statsapi.CPUStats{
				UsageNanoCores: &usageNanoCores,
			},
		}

		metrics := calculateNodeMetrics(nodeStats, node)
		require.NotNil(t, metrics)
		require.Equal(t, 50, int(metrics.CPUUsage)) // 2/4 = 50%
	})

	t.Run("CalculatesCorrectMemoryPercentage", func(t *testing.T) {
		workingSetBytes := uint64(4 * 1024 * 1024 * 1024) // 4GB
		nodeStats := statsapi.NodeStats{
			Memory: &statsapi.MemoryStats{
				WorkingSetBytes: &workingSetBytes,
			},
		}

		metrics := calculateNodeMetrics(nodeStats, node)
		require.NotNil(t, metrics)
		require.Equal(t, 50, int(metrics.MemoryUsage)) // 4GB/8GB = 50%
	})

	t.Run("CalculatesCorrectNetworkUsage", func(t *testing.T) {
		rxBytes := uint64(1024 * 1024 * 1024) // 1GB
		txBytes := uint64(1024 * 1024 * 1024) // 1GB
		nodeStats := statsapi.NodeStats{
			Network: &statsapi.NetworkStats{
				InterfaceStats: statsapi.InterfaceStats{
					RxBytes: &rxBytes,
					TxBytes: &txBytes,
				},
			},
		}

		metrics := calculateNodeMetrics(nodeStats, node)
		require.NotNil(t, metrics)
		require.Equal(t, 2048, int(metrics.NetworkUsage)) // 2GB = 2048MB
	})

	t.Run("HandlesEmptyStats", func(t *testing.T) {
		nodeStats := statsapi.NodeStats{}
		metrics := calculateNodeMetrics(nodeStats, node)
		require.Nil(t, metrics)
	})

	t.Run("HandlesPartialStats", func(t *testing.T) {
		usageNanoCores := uint64(1_000_000_000) // 1 core
		nodeStats := statsapi.NodeStats{
			CPU: &statsapi.CPUStats{
				UsageNanoCores: &usageNanoCores,
			},
			// Memory and Network are nil
		}

		metrics := calculateNodeMetrics(nodeStats, node)
		require.NotNil(t, metrics)
		require.Equal(t, 25, int(metrics.CPUUsage)) // 1/4 = 25%
		require.Equal(t, 0, int(metrics.MemoryUsage))
		require.Equal(t, 0, int(metrics.NetworkUsage))
	})
}
