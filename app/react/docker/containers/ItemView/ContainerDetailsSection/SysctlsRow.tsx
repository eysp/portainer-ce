import { DetailsTable } from '@@/DetailsTable';

interface SysctlsRowProps {
  sysctls?: Record<string, string>;
}

export function SysctlsRow({ sysctls }: SysctlsRowProps) {
  if (!sysctls || Object.keys(sysctls).length === 0) {
    return null;
  }

  return (
    <DetailsTable.Row label="系统参数">
      <table className="table table-bordered table-condensed !m-0">
        <tbody>
          {Object.entries(sysctls).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DetailsTable.Row>
  );
}
