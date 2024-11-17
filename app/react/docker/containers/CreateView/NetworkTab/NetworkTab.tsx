import { FormikErrors } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { InputList, ItemProps } from '@@/form-components/InputList';
import { InputGroup } from '@@/form-components/InputGroup';
import { FormError } from '@@/form-components/FormError';

import { NetworkSelector } from '../../components/NetworkSelector';

import { CONTAINER_MODE, Values } from './types';
import { ContainerSelector } from './ContainerSelector';

export function NetworkTab({
  values,
  setFieldValue,
  errors,
}: {
  values: Values;
  setFieldValue: (field: string, value: unknown) => void;
  errors?: FormikErrors<Values>;
}) {
  return (
    <div className="mt-3">
      <FormControl label="网络" errors={errors?.networkMode}>
        <NetworkSelector
          value={values.networkMode}
          additionalOptions={[{ label: '容器', value: CONTAINER_MODE }]}
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

      <FormControl label="主机名" errors={errors?.hostname}>
        <Input
          value={values.hostname}
          onChange={(e) => setFieldValue('hostname', e.target.value)}
          placeholder="例如 web01"
        />
      </FormControl>

      <FormControl label="域名" errors={errors?.domain}>
        <Input
          value={values.domain}
          onChange={(e) => setFieldValue('domain', e.target.value)}
          placeholder="例如 example.com"
        />
      </FormControl>

      <FormControl label="MAC 地址" errors={errors?.macAddress}>
        <Input
          value={values.macAddress}
          onChange={(e) => setFieldValue('macAddress', e.target.value)}
          placeholder="例如 12-34-56-78-9a-bc"
        />
      </FormControl>

      <FormControl label="IPv4 地址" errors={errors?.ipv4Address}>
        <Input
          value={values.ipv4Address}
          onChange={(e) => setFieldValue('ipv4Address', e.target.value)}
          placeholder="例如 172.20.0.7"
        />
      </FormControl>

      <FormControl label="IPv6 地址" errors={errors?.ipv6Address}>
        <Input
          value={values.ipv6Address}
          onChange={(e) => setFieldValue('ipv6Address', e.target.value)}
          placeholder="例如 a:b:c:d::1234"
        />
      </FormControl>

      <FormControl label="主 DNS 服务器" errors={errors?.primaryDns}>
        <Input
          value={values.primaryDns}
          onChange={(e) => setFieldValue('primaryDns', e.target.value)}
          placeholder="例如 1.1.1.1, 2606:4700:4700::1111"
        />
      </FormControl>

      <FormControl label="次 DNS 服务器" errors={errors?.secondaryDns}>
        <Input
          value={values.secondaryDns}
          onChange={(e) => setFieldValue('secondaryDns', e.target.value)}
          placeholder="例如 1.0.0.1, 2606:4700:4700::1001"
        />
      </FormControl>

      <InputList
        label="hosts 文件条目"
        value={values.hostsFileEntries}
        onChange={(hostsFileEntries) =>
          setFieldValue('hostsFileEntries', hostsFileEntries)
        }
        errors={errors?.hostsFileEntries}
        item={HostsFileEntryItem}
        itemBuilder={() => ''}
      />
    </div>
  );
}

function HostsFileEntryItem({
  item,
  onChange,
  disabled,
  error,
  readOnly,
}: ItemProps<string>) {
  return (
    <div>
      <InputGroup>
        <InputGroup.Addon>value</InputGroup.Addon>
        <Input
          value={item}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          readOnly={readOnly}
        />
      </InputGroup>

      {error && <FormError>{error}</FormError>}
    </div>
  );
}
