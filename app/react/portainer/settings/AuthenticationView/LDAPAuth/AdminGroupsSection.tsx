import { PlusIcon } from 'lucide-react';

import { isLimitedToBE } from '@/react/portainer/feature-flags/feature-flags.service';
import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { MultiSelect } from '@@/form-components/PortainerSelect';
import { SwitchField } from '@@/form-components/SwitchField';
import { Button } from '@@/buttons';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { useInputList } from '@@/form-components/InputList/useInputList';
import { Widget, WidgetBody } from '@@/Widget';
import { FormSection } from '@@/form-components/FormSection';
import { FormError } from '@@/form-components/FormError';
import { BEFeatureIndicator } from '@@/BEFeatureIndicator';

import { LDAPGroupSearchSettings } from '../../types';

import { AdminGroupSearchConfigItem } from './AdminGroupSearchConfigItem';

type CEProps = Omit<
  AdminGroupsSectionProps,
  'groups' | 'isFetching' | 'onFetch'
>;

export function AdminGroupsSectionCE({
  searchSettings,
  onSearchSettingsChange,
  autoPopulate,
  onAutoPopulateChange,
  selectedAdminGroups,
  onSelectedAdminGroupsChange,
  limitedFeatureId,
  isLimitedFeatureSelfContained,
}: CEProps) {
  return (
    <AdminGroupsSection
      searchSettings={searchSettings}
      onSearchSettingsChange={onSearchSettingsChange}
      autoPopulate={autoPopulate}
      onAutoPopulateChange={onAutoPopulateChange}
      selectedAdminGroups={selectedAdminGroups}
      onSelectedAdminGroupsChange={onSelectedAdminGroupsChange}
      limitedFeatureId={limitedFeatureId}
      isLimitedFeatureSelfContained={isLimitedFeatureSelfContained}
      groups={null}
      isFetching={false}
      onFetch={noop}
    />
  );
}

interface AdminGroupsSectionProps {
  searchSettings: LDAPGroupSearchSettings[];
  onSearchSettingsChange: (settings: LDAPGroupSearchSettings[]) => void;
  autoPopulate: boolean;
  onAutoPopulateChange: (value: boolean) => void;
  selectedAdminGroups: string[];
  onSelectedAdminGroupsChange: (groups: string[]) => void;
  groups: string[] | null;
  isFetching: boolean;
  onFetch: () => void;
  limitedFeatureId?: FeatureId;
  isLimitedFeatureSelfContained?: boolean;
}

export function AdminGroupsSection({
  searchSettings,
  onSearchSettingsChange,
  autoPopulate,
  onAutoPopulateChange,
  selectedAdminGroups,
  onSelectedAdminGroupsChange,
  groups,
  isFetching,
  onFetch,
  limitedFeatureId,
  isLimitedFeatureSelfContained,
}: AdminGroupsSectionProps) {
  const isLimited = isLimitedToBE(limitedFeatureId);

  const { handleAdd, handleRemoveItem, handleChangeItem } = useInputList({
    value: searchSettings,
    onChange: onSearchSettingsChange,
    itemBuilder: () => ({
      GroupBaseDN: '',
      GroupAttribute: '',
      GroupFilter: '',
    }),
  });

  const enableAssignAdminGroup = groups !== null && groups.length > 0;
  const groupOptions = (groups || []).map((group) => ({
    label: group,
    value: group,
  }));

  return (
    <FormSection
      title={
        <>
          自动填充团队管理员
          {isLimitedFeatureSelfContained && limitedFeatureId && (
            <BEFeatureIndicator featureId={limitedFeatureId} className="ml-2" />
          )}
        </>
      }
    >
      <div className="form-group">
        <span className="col-sm-12 text-muted small">
          如果未添加组搜索配置，自动填充将使用您的默认组搜索配置。
        </span>
      </div>

      <Widget>
        <WidgetBody>
          {searchSettings.map((item, index) => (
            <AdminGroupSearchConfigItem
              key={index}
              value={item}
              index={index}
              count={searchSettings.length}
              isLimited={isLimited}
              onChange={(value) => handleChangeItem(value, index)}
              onRemove={() => handleRemoveItem(index)}
            />
          ))}
        </WidgetBody>
      </Widget>

      <div className="form-group">
        <div className="col-sm-12 mt-2">
          <Button
            color="light"
            size="small"
            disabled={isLimited}
            onClick={handleAdd}
            data-cy="add-group-btn"
            icon={PlusIcon}
          >
            添加组搜索配置
          </Button>
        </div>

        <div className="col-sm-12 vertical-center mt-2">
          <LoadingButton
            color="primary"
            size="medium"
            type="button"
            disabled={isLimited}
            isLoading={isFetching}
            loadingText="获取中..."
            onClick={onFetch}
            className={isLimited ? 'limited-be' : undefined}
            data-cy="ldap-fetch-admin-groups"
          >
            获取管理员组
          </LoadingButton>
          {!!groups && groups.length === 0 && (
            <FormError>未找到组</FormError>
          )}
        </div>
      </div>

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="分配管理员权限给组"
            checked={autoPopulate}
            onChange={onAutoPopulateChange}
            disabled={!enableAssignAdminGroup}
            data-cy="admin-auto-populate"
          />
        </div>
      </div>

      {autoPopulate && enableAssignAdminGroup && (
        <div className="form-group">
          <label
            htmlFor="group-access"
            className="control-label col-sm-2 text-left"
          >
            选择组
          </label>
          <div className="col-sm-8">
            <MultiSelect
              inputId="group-access"
              value={selectedAdminGroups}
              onChange={onSelectedAdminGroupsChange}
              options={groupOptions}
              placeholder="选择一个或多个组"
              data-cy="group-access-selector"
            />
          </div>
        </div>
      )}
    </FormSection>
  );
}

function noop() {
  // CE stub — admin group fetch is a BE-only feature
}
