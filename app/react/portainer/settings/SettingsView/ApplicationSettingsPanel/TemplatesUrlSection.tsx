import { useField, Field } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { Input } from '@@/form-components/Input';

export function TemplatesUrlSection() {
  const [{ name }, { error }] = useField<string>('templatesUrl');
  return (
    <FormSection title="应用模板">
    <div className="form-group">
        <span className="col-sm-12 text-muted small">
            在此处可以指定您自己的模板定义文件的 URL。
            更多详细信息请参阅{' '}
            <a
                href="https://docs.portainer.io/advanced/app-templates/build"
                target="_blank"
                rel="noreferrer"
            >
                Portainer 文档
            </a>
            。
        </span>
    </div>

    <FormControl label="URL" inputId="templates_url" required errors={error}>
        <Field
            as={Input}
            id="templates_url"
            placeholder="https://myserver.mydomain/templates.json"
            required
            data-cy="settings-templateUrl"
            name={name}
        />
    </FormControl>
</FormSection>
  );
}
