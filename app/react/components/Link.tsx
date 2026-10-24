import { PropsWithChildren, AnchorHTMLAttributes, useMemo } from 'react';
import { UISrefProps, useSref, useRouter } from '@uirouter/react';

import { getCurrentState } from '@/react-tools/withUIRouter';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  'data-cy': string;
}

export function Link({
  children,
  'data-cy': dataCy,
  to,
  params,
  options,
  title,
  ...props
}: PropsWithChildren<Props> & UISrefProps) {
  const router = useRouter();

  const resolvedTo = useMemo(() => {
    if (typeof to === 'string' && to.startsWith('.') && router) {
      const currentState = getCurrentState(router);
      if (currentState?.name) {
        try {
          const target = router.stateRegistry.get(to, currentState.name);
          if (target?.name) {
            return target.name;
          }
        } catch {
          // fallback to to
        }
      }
    }
    return to;
  }, [to, router]);

  const { onClick, href } = useSref(resolvedTo, params, options);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <a onClick={onClick} href={href} data-cy={dataCy} title={title} {...props}>
      {children}
    </a>
  );
}
