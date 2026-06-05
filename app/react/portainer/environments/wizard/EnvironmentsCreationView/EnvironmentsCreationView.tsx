import { useCurrentStateAndParams, useRouter } from '@uirouter/react';
import { useState } from 'react';
import _ from 'lodash';
import { Wand2 } from 'lucide-react';

import { notifyError } from '@/portainer/services/notifications';
import {
  Environment,
  EnvironmentId,
} from '@/react/portainer/environments/types';

import { Stepper } from '@@/Stepper/Stepper';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { PageHeader } from '@@/PageHeader';
import { Button } from '@@/buttons';
import { FormSection } from '@@/form-components/FormSection';
import { Alert } from '@@/Alert';
import { StickyFooter } from '@@/StickyFooter/StickyFooter';

import {
  EnvironmentOptionValue,
  environmentTypes,
  formTitles,
  EnvironmentOption,
} from '../EnvironmentTypeSelectView/environment-types';

import { WizardDocker } from './WizardDocker';
import { WizardAzure } from './WizardAzure';
import { WizardKubernetes } from './WizardKubernetes';
import { AnalyticsState, AnalyticsStateKey } from './types';
import styles from './EnvironmentsCreationView.module.css';
import { WizardEndpointsList } from './WizardEndpointsList';
import { WizardPodman } from './WizardPodman';

export function EnvironmentCreationView() {
  const {
    params: { localEndpointId: localEndpointIdParam, referrer },
  } = useCurrentStateAndParams();

  const [environmentIds, setEnvironmentIds] = useState<EnvironmentId[]>(() => {
    const localEndpointId = parseInt(localEndpointIdParam, 10);

    if (!localEndpointId || Number.isNaN(localEndpointId)) {
      return [];
    }

    return [localEndpointId];
  });

  const envTypes = useParamEnvironmentTypes();
  const router = useRouter();
  const steps = _.compact(
    envTypes.map((id) => environmentTypes.find((eType) => eType.id === id))
  );
  const { setAnalytics } = useAnalyticsState();

  const {
    currentStep,
    onNextClick,
    onPreviousClick,
    onStepClick,
    currentStepIndex,
    Component,
    isFirstStep,
    isLastStep,
  } = useStepper(steps, handleFinish);

  const isDockerStandalone = currentStep.id === 'dockerStandalone';

  return (
    <div className="pb-20">
      <PageHeader
        title="快速设置"
        breadcrumbs={[{ label: '环境向导' }]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Stepper
            steps={steps}
            currentStepIndex={currentStepIndex}
            onStepClick={onStepClick}
          />
        </div>
      </div>
      <div className={styles.wizardWrapper}>
        <Widget>
          <WidgetTitle icon={Wand2} title="环境向导" />
          <WidgetBody>
            <FormSection title={formTitles[currentStep.id]}>
              {currentStep.id === 'kaas' && (
                <Alert color="warn" title="已弃用功能" className="mb-2">
                  从 Portainer 配置 KaaS 环境已弃用，并将在未来版本中删除。您仍然可以使用通过此方法配置的 Kubernetes 集群，但将无法访问任何 KaaS 特定的管理功能。
                </Alert>
              )}
              <Component
                onCreate={handleCreateEnvironment}
                isDockerStandalone={isDockerStandalone}
              />
            </FormSection>
          </WidgetBody>
        </Widget>
        <div>
          <WizardEndpointsList environmentIds={environmentIds} />
        </div>
      </div>

      <StickyFooter className="justify-end gap-4">
        <Button
          color="default"
          onClick={onPreviousClick}
          disabled={isFirstStep}
          data-cy="environment-wizard-back-button"
          size="medium"
        >
          返回
        </Button>
        <Button
          color="primary"
          onClick={onNextClick}
          data-cy="environment-wizard-continue-button"
          size="medium"
        >
          {isLastStep ? '关闭' : '继续'}
        </Button>
      </StickyFooter>
    </div>
  );

  function handleCreateEnvironment(
    environment: Environment,
    analytics: AnalyticsStateKey
  ) {
    setEnvironmentIds((prev) => [...prev, environment.Id]);
    setAnalytics(analytics);
  }

  function handleFinish() {
    if (referrer === 'environments') {
      router.stateService.go('portainer.endpoints');
      return;
    }
    router.stateService.go('portainer.home');
  }
}

function useParamEnvironmentTypes(): EnvironmentOptionValue[] {
  const {
    params: { envType },
  } = useCurrentStateAndParams();
  const router = useRouter();

  if (!envType) {
    notifyError('未提供环境类型');
    router.stateService.go('portainer.wizard.endpoints');
    return [];
  }

  return Array.isArray(envType) ? envType : [envType];
}

function useStepper(
  steps: EnvironmentOption[][number][],
  onFinish: () => void
) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const currentStep = steps[currentStepIndex];

  return {
    currentStep,
    onNextClick,
    onPreviousClick,
    onStepClick,
    isFirstStep,
    isLastStep,
    currentStepIndex,
    Component: getComponent(currentStep.id),
  };

  function onNextClick() {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
      return;
    }

    onFinish();
  }

  function onPreviousClick() {
    setCurrentStepIndex(currentStepIndex - 1);
  }

  function onStepClick(stepIndex: number) {
    setCurrentStepIndex(stepIndex);
  }

  function getComponent(id: EnvironmentOptionValue) {
    switch (id) {
      case 'dockerStandalone':
      case 'dockerSwarm':
        return WizardDocker;
      case 'podman':
        return WizardPodman;
      case 'aci':
        return WizardAzure;
      case 'kubernetes':
        return WizardKubernetes;
      default:
        throw new Error(`未知环境类型 ${id}`);
    }
  }
}

function useAnalyticsState() {
  const [analytics, setAnalyticsState] = useState<AnalyticsState>({
    dockerAgent: 0,
    dockerApi: 0,
    dockerEdgeAgentAsync: 0,
    dockerEdgeAgentStandard: 0,
    podmanAgent: 0,
    podmanEdgeAgentAsync: 0,
    podmanEdgeAgentStandard: 0,
    podmanLocalEnvironment: 0,
    kubernetesAgent: 0,
    kubernetesEdgeAgentAsync: 0,
    kubernetesEdgeAgentStandard: 0,
    kaasAgent: 0,
    aciApi: 0,
    localEndpoint: 0,
  });

  return { analytics, setAnalytics };

  function setAnalytics(key: AnalyticsStateKey) {
    setAnalyticsState((prevState) => ({
      ...prevState,
      [key]: prevState[key] + 1,
    }));
  }
}
