package librand

import (
	"testing"

	"github.com/portainer/portainer/pkg/fips"
)

func init() {
	fips.InitFIPS(false)
}

func TestIntn(t *testing.T) {
	i := Intn(10)

	if i >= 10 || i < 0 {
		t.Fatalf("random number %d wasn't within interval", i)
	}
}

func TestInternalIntn(t *testing.T) {
	testCases := []struct {
		name string
		max  int
		fips bool
	}{
		{
			name: "non-fips mode",
			max:  10,
			fips: false,
		},
		{
			name: "fips mode",
			max:  10,
			fips: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			i := intn(tc.max, tc.fips)

			if i >= tc.max || i < 0 {
				t.Fatalf("random number %d wasn't within interval", i)
			}
		})
	}
}

func TestFloat64(t *testing.T) {
	f := Float64()

	if f >= 1 || f < 0 {
		t.Fatalf("random float %v wasn't within interval", f)
	}
}

func TestInternalFloat64(t *testing.T) {
	testCases := []struct {
		name string
		fips bool
	}{
		{
			name: "non-fips mode",
			fips: false,
		},
		{
			name: "fips mode",
			fips: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			f := randomFloat64(tc.fips)
			if f >= 1 || f < 0 {
				t.Fatalf("random float %v wasn't within interval", f)
			}
		})
	}
}
