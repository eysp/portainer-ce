import { Button, CopyButton } from '@@/buttons';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { TextTip } from '@@/Tip/TextTip';
import { Link } from '@@/Link';

export function DisplayUserAccessToken({ apikey }: { apikey: string }) {
  return (
    <>
      <FormSectionTitle>新访问令牌</FormSectionTitle>
      <TextTip>
        请复制新的访问令牌。您将无法再次
        查看此令牌。
      </TextTip>
      <div className="pt-5">
        <div className="inline-flex">
          <div className="">{apikey}</div>
          <div>
            <CopyButton
              copyText={apikey}
              color="link"
              data-cy="create-access-token-copy-button"
            />
          </div>
        </div>
        <hr />
      </div>
      <Button
        as={Link}
        props={{
          to: 'portainer.account',
        }}
        data-cy="create-access-token-done-button"
      >
        完成
      </Button>
    </>
  );
}
