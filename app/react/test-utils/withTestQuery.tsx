import { ComponentType } from 'react';
import { MutationCache, QueryClient } from '@tanstack/react-query';

import { withReactQuery } from '@/react-tools/withReactQuery';

export function withTestQueryProvider<T>(
  WrappedComponent: ComponentType<T & JSX.IntrinsicAttributes>,
  { onMutationError }: { onMutationError?(error: unknown): void } = {}
) {
  const testQueryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
    mutationCache: new MutationCache({
      onError: onMutationError,
    }),
  });

  return withReactQuery(WrappedComponent, testQueryClient);
}
