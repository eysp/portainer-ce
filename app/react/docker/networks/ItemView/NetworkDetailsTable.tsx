import { Fragment } from 'react';
import { Network } from 'lucide-react';

import DockerNetworkHelper from '@/docker/helpers/networkHelper';
import { Authorized } from '@/react/hooks/useUser';

import { TableContainer, TableTitle } from '@@/datatables';
import { DetailsTable } from '@@/DetailsTable';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { isSystemNetwork } from '../network.helper';
import { DockerNetwork, IPConfig } from '../types';

interface Props {
  network: DockerNetwork;
  onRemoveNetworkClicked: () => void;
}

export function NetworkDetailsTable({
  network,
  onRemoveNetworkClicked,
}: Props) {
  const allowRemoveNetwork = !isSystemNetwork(network.Name);
  const ipv4Configs: IPConfig[] = DockerNetworkHelper.getIPV4Configs(
    network.IPAM?.Config
  );
  const ipv6Configs: IPConfig[] = DockerNetworkHelper.getIPV6Configs(
    network.IPAM?.Config
  );

  return (
    <TableContainer>
      <TableTitle label="网络详情" icon={Network} />
      <DetailsTable dataCy="networkDetails-detailsTable">
        {/* networkRowContent */}
        <DetailsTable.Row label="名称">{network.Name}</DetailsTable.Row>
        <DetailsTable.Row label="Id">
          {network.Id}
          {allowRemoveNetwork && (
            <span className="ml-2">
              <Authorized authorizations="DockerNetworkDelete">
                <DeleteButton
                  data-cy="networkDetails-deleteNetwork"
                  size="xsmall"
                  onConfirmed={onRemoveNetworkClicked}
                  confirmMessage="您确定要删除该网络吗？"
                >
                  删除此网络
                </DeleteButton>
              </Authorized>
            </span>
          )}
        </DetailsTable.Row>
        <DetailsTable.Row label="驱动">{network.Driver}</DetailsTable.Row>
        <DetailsTable.Row label="作用域">{network.Scope}</DetailsTable.Row>
        <DetailsTable.Row label="可附加">
          {String(network.Attachable)}
        </DetailsTable.Row>
        <DetailsTable.Row label="内部">
          {String(network.Internal)}
        </DetailsTable.Row>

        {/* IPV4 ConfigRowContent */}
        {ipv4Configs.map((config) => (
          <Fragment key={config.Subnet}>
            <DetailsTable.Row
              label={`IPV4 子网${getConfigDetails(config.Subnet)}`}
            >
              {`IPV4 网关${getConfigDetails(config.Gateway)}`}
            </DetailsTable.Row>
            <DetailsTable.Row
              label={`IPV4 IP 范围${getConfigDetails(config.IPRange)}`}
            >
              {`IPV4 排除的 IP${getAuxiliaryAddresses(
                config.AuxiliaryAddresses
              )}`}
            </DetailsTable.Row>
          </Fragment>
        ))}

        {/* IPV6 ConfigRowContent */}
        {ipv6Configs.map((config) => (
          <Fragment key={config.Subnet}>
            <DetailsTable.Row
              label={`IPV6 子网${getConfigDetails(config.Subnet)}`}
            >
              {`IPV6 网关${getConfigDetails(config.Gateway)}`}
            </DetailsTable.Row>
            <DetailsTable.Row
              label={`IPV6 IP 范围${getConfigDetails(config.IPRange)}`}
            >
              {`IPV6 排除的 IP${getAuxiliaryAddresses(
                config.AuxiliaryAddresses
              )}`}
            </DetailsTable.Row>
          </Fragment>
        ))}
      </DetailsTable>
    </TableContainer>
  );

  function getConfigDetails(configValue?: string) {
    return configValue ? ` - ${configValue}` : '';
  }

  function getAuxiliaryAddresses(auxiliaryAddresses?: object) {
    return auxiliaryAddresses
      ? ` - ${Object.values(auxiliaryAddresses).join(' - ')}`
      : '';
  }
}
