import { TextTip } from '@@/Tip/TextTip';

export function SetupTokenTextTip() {
  return (
    <TextTip color="blue">
      在 Portainer 服务端日志中可找到此令牌。查看相关{' '}
      <a
        href="https://docs.portainer.io/faqs/installing/setup-token"
        target="_blank"
        rel="noreferrer"
      >
        设置令牌常见问题 (FAQ)
      </a>{' '}
      获取更多信息。
    </TextTip>
  );
}
