import { Gauge } from 'lucide-react';

import { stripProtocol } from '@/react/common/string-utils';
import { useTagsForEnvironment } from '@/portainer/tags/queries';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useEnvironment } from '@/react/portainer/environments/queries';

import { Widget, WidgetTitle, WidgetBody } from '@@/Widget';

export function EnvironmentInfo() {
  const environmentId = useEnvironmentId();
  const { data: environmentData, ...environmentQuery } =
    useEnvironment(environmentId);
  const tagsQuery = useTagsForEnvironment(environmentId);
  const tagNames = tagsQuery.tags?.map((tag) => tag.Name).join(', ') || '-';

  return (
    <Widget>
      <WidgetTitle icon={Gauge} title="环境信息" />
      <WidgetBody loading={environmentQuery.isLoading}>
        {environmentQuery.isError && <div>加载环境失败</div>}
        {environmentData && (
          <table className="table">
            <tbody>
              <tr>
                <td className="!border-none">环境</td>
                <td
                  className="!border-none"
                  data-cy="dashboard-environmentName"
                >
                  {environmentData.Name}
                </td>
              </tr>
              <tr>
                <td className="!border-t">URL</td>
                <td className="!border-t" data-cy="dashboard-environmenturl">
                  {stripProtocol(environmentData.URL) || '-'}
                </td>
              </tr>
              <tr>
                <td>标签</td>
                <td data-cy="dashboard-environmentTags">{tagNames}</td>
              </tr>
            </tbody>
          </table>
        )}
      </WidgetBody>
    </Widget>
  );
}
