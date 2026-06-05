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
        title="自动创建 Edge 环境"
        breadcrumbs={[
          { label: '环境', link: 'portainer.endpoints' },
          'Automatic Edge Environment Creation',
        ]}
        reload
      />

      <div className="mx-3">
        <AutomaticEdgeEnvCreation />
      </div>
    </>
  );
}
