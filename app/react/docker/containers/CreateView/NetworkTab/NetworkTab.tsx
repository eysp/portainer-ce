import { FormikErrors } from 'formik';

import { useIsPodman } from '@/react/portainer/environments/queries/useIsPodman';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { NetworkSelector } from '../../components/NetworkSelector';

import { CONTAINER_MODE, Values } from './types';
import { ContainerSelector } from './ContainerSelector';
import { HostsFileEntries } from './HostsFileEntries';
import { HostnameField } from './HostnameField';

export function NetworkTab({
  values,
  setFieldValue,
  errors,
}: {
  values: Values;
  setFieldValue: (field: string, value: unknown) => void;
  errors?: FormikErrors<Values>;
}) {
  const envId = useEnvironmentId();
  const isPodman = useIsPodman(envId);
  const additionalOptions = getAdditionalOptions(isPodman);
  return (
    <div className="mt-3">
      <FormControl label="网络" errors={errors?.networkMode}>
        <NetworkSelector
          value={values.networkMode}
          additionalOptions={additionalOptions}
          onChange={(networkMode) => setFieldValue('networkMode', networkMode)}
        />
      </FormControl>

      {values.networkMode === CONTAINER_MODE && (
        <FormControl label="容器" errors={errors?.container}>
          <ContainerSelector
            value={values.container}
            onChange={(container) => setFieldValue('container', container)}
          />
        </FormControl>
      )}

      <HostnameField
        value={values.hostname}
        onChange={(value) => setFieldValue('hostname', value)}
      />

      <FormControl label="域名" errors={errors?.domain}>
        <Input
          value={values.domain}
          onChange={(e) => setFieldValue('domain', e.target.value)}
          placeholder="例如 example.com"
          data-cy="docker-container-domain-input"
        />
      </FormControl>

      <FormControl label="MAC 地址" errors={errors?.macAddress}>
        <Input
          value={values.macAddress}
          onChange={(e) => setFieldValue('macAddress', e.target.value)}
          placeholder="例如 12-34-56-78-9a-bc"
          data-cy="docker-container-mac-address-input"
        />
      </FormControl>

      <FormControl label="IPv4 地址" errors={errors?.ipv4Address}>
        <Input
          value={values.ipv4Address}
          onChange={(e) => setFieldValue('ipv4Address', e.target.value)}
          placeholder="例如 172.20.0.7"
          data-cy="docker-container-ipv4-address-input"
        />
      </FormControl>

      <FormControl label="IPv6 地址" errors={errors?.ipv6Address}>
        <Input
          value={values.ipv6Address}
          onChange={(e) => setFieldValue('ipv6Address', e.target.value)}
          placeholder="例如 a:b:c:d::1234"
          data-cy="docker-container-ipv6-address-input"
        />
      </FormControl>

      <FormControl label="主 DNS 服务器" errors={errors?.primaryDns}>
        <Input
          value={values.primaryDns}
          onChange={(e) => setFieldValue('primaryDns', e.target.value)}
          placeholder="例如 1.1.1.1, 2606:4700:4700::1111"
          data-cy="docker-container-primary-dns-input"
        />
      </FormControl>

      <FormControl label="副 DNS 服务器" errors={errors?.secondaryDns}>
        <Input
          value={values.secondaryDns}
          onChange={(e) => setFieldValue('secondaryDns', e.target.value)}
          placeholder="例如 1.0.0.1, 2606:4700:4700::1001"
          data-cy="docker-container-secondary-dns-input"
        />
      </FormControl>

      <HostsFileEntries
        values={values.hostsFileEntries}
        onChange={(v) => setFieldValue('hostsFileEntries', v)}
        errors={errors?.hostsFileEntries}
      />
    </div>
  );
}

function getAdditionalOptions(isPodman?: boolean) {
  if (isPodman) {
    return [];
  }
  return [{ label: '容器', value: CONTAINER_MODE }];
}
