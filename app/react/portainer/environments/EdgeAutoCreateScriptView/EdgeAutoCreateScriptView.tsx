import { withLimitToBE } from '@/react/hooks/useLimitToBE';

import { PageHeader } from '@@/PageHeader';

import { AutomaticEdgeEnvCreation } from './AutomaticEdgeEnvCreation';

export const EdgeAutoCreateScriptViewWrapper = withLimitToBE(
  EdgeAutoCreateScriptView
);

function EdgeAutoCreateScriptView() {
  return (
    <>
      <PageHeader
        title="自动边缘环境创建"
        breadcrumbs={[
          { label: '环境', link: 'portainer.endpoints' },
          '自动边缘环境创建',
        ]}
        reload
      />

      <div className="mx-3">
        <AutomaticEdgeEnvCreation />
      </div>
    </>
  );
}
