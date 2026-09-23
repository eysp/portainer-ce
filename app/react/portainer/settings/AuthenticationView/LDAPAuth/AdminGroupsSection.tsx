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
  'groups' | 'is获取中... 'onFetch'
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
      is获取中...alse}
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
  is获取中...oolean;
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
  const isLimited =
    (isLimitedFeatureSelfContained ?? false) || isLimitedToBE(limitedFeatureId);

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
  const groupOptions = (groups ?? []).map((g) => ({ label: g, value: g }));

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
      <div className="space-y-3">
        {searchSettings.map((config, index) => (
          <Widget
            key={index}
            aria-label={`Admin group search configuration ${index + 1}`}
          >
            <WidgetBody>
              {index > 0 && (
                <div className="form-group mt-2">
                  <span className="col-sm-12 text-muted small">
                    Extra search configuration
                  </span>
                </div>
              )}

              <AdminGroupSearchConfigItem
                value={config}
                index={index}
                count={searchSettings.length}
                isLimited={isLimited}
                onChange={(value) => handleChangeItem(index, value)}
                onRemove={() => handleRemoveItem(index, config)}
              />
            </WidgetBody>
          </Widget>
        ))}
      </div>

      <div className="form-group mt-2">
        <div className="col-sm-12">
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
  // CE stub – admin group fetch is a BE-only feature
}
