import { useRouter } from '@uirouter/react';

import { Button, CopyButton } from '@@/buttons';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { TextTip } from '@@/Tip/TextTip';

export function DisplayUserAccessToken({ apikey }: { apikey: string }) {
  const router = useRouter();
  return (
    <>
      <FormSectionTitle>新访问令牌</FormSectionTitle>
      <TextTip>
        请复制新的访问令牌。您将无法再次查看该令牌。
      </TextTip>
      <div className="pt-5">
        <div className="inline-flex">
          <div className="">{apikey}</div>
          <div>
            <CopyButton copyText={apikey} color="link" />
          </div>
        </div>
        <hr />
      </div>
      <Button
        type="button"
        onClick={() => router.stateService.go('portainer.account')}
      >
        完成
      </Button>
    </>
  );
}
