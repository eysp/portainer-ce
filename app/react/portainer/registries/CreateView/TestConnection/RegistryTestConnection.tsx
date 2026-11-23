import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeftRight, CheckCircle } from 'lucide-react';

import { LoadingButton } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';

import { RegistryTypes } from '../../types/registry';

import { useCheckRegistryConnectionMutation } from './useCheckRegistryConnectionMutation';

interface Props {
  values: {
    Username: string;
    Password: string;
  };
  onTestSuccess: () => void;
  disabled?: boolean;
  isConnectionTested?: boolean;
}

export function RegistryTestConnection({
  values,
  onTestSuccess,
  isConnectionTested,
  disabled,
}: Props) {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isConnectionTested) {
      setTestResult({
        success: false,
        message: '尚未测试连接。',
      });
    }
  }, [isConnectionTested]);

  const pingMutation = useCheckRegistryConnectionMutation();

  return (
    <div className="flex flex-row items-center gap-3">
      <LoadingButton
        size="small"
        color="default"
        className="!ml-0 w-min"
        isLoading={pingMutation.isLoading}
        icon={ArrowLeftRight}
        loadingText="正在测试连接..."
        onClick={handleTestConnection}
        disabled={disabled || !values.Username || !values.Password}
        type="button"
        data-cy="registry-test-connection-button"
      >
        测试连接
      </LoadingButton>

      {testResult && (
        <TextTip
          className="!items-start [&>svg]:mt-0.5"
          icon={testResult.success ? CheckCircle : AlertCircle}
          color={testResult.success ? 'green' : 'red'}
        >
          {testResult.message}
        </TextTip>
      )}
    </div>
  );

  async function handleTestConnection() {
    if (!values.Username || !values.Password) {
      setTestResult({
        success: false,
        message: '在测试连接前，请先填写所有必填字段。',
      });
      return;
    }

    setTestResult(null);

    const testPayload = {
      Username: values.Username,
      Password: values.Password,
      Type: RegistryTypes.DOCKERHUB, // DockerHub registry type
    };

    pingMutation.mutate(testPayload, {
      onSuccess(response) {
        if (response.success) {
          setTestResult({
            success: true,
            message:
              response.message ||
              '镜像仓库连接成功！您现在可以保存该仓库。',
          });
          onTestSuccess();
        } else {
          setTestResult({
            success: false,
            message:
              response.message ||
              '连接到镜像仓库失败，请检查您的凭据。',
          });
        }
      },
      onError() {
        setTestResult({
          success: false,
          message: '测试仓库连接失败，请稍后重试。',
        });
      },
    });
  }
}
