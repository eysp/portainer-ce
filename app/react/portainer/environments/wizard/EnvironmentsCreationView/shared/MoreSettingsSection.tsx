import { PropsWithChildren } from 'react';

import { FormSection } from '@@/form-components/FormSection';

import { MetadataFieldset } from './MetadataFieldset';

export function MoreSettingsSection({ children }: PropsWithChildren<unknown>) {
  return (
    <FormSection title="更多设置" className="ml-0" isFoldable>
      <div className="ml-8">
        {children}

        <MetadataFieldset />
      </div>
    </FormSection>
  );
}
