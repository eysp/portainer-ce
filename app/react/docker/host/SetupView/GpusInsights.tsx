import { InsightsBox } from '@@/InsightsBox';

export function GpusInsights() {
  return (
      <InsightsBox
          content={
              <>
                  <p>
                      从 2.18 版本开始，将 Docker Standalone 环境中可用的 GPU 设置从“添加环境”和“环境详情”转移到“主机 -&gt; 设置”，以与其他设置保持一致。
                  </p>
                  <p>
                      引入了一个开关，用于在 Portainer UI 中启用/禁用 GPU 设置管理，以减轻显示这些设置的性能影响。
                  </p>
                  <p>
                      更新了 UI，以澄清 GPU 设置支持仅适用于 Docker Standalone（不适用于从未在 UI 中支持的 Docker Swarm）。
                  </p>
              </>
          }
          header="GPU 设置更新"
          insightCloseId="gpu-settings-update-closed"
      />
  );
}
