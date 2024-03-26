import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@/react-tools/react-query';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { createTag, getTags } from './tags.service';
import { Tag, TagId } from './types';

export const tagKeys = {
  all: ['tags'] as const,
  tag: (id: TagId) => [...tagKeys.all, id] as const,
};

export function useTags<T = Tag[]>({
  select,
  enabled = true,
}: { select?: (tags: Tag[]) => T; enabled?: boolean } = {}) {
  return useQuery(tagKeys.all, () => getTags(), {
    staleTime: 50,
    select,
    enabled,
    ...withError('无法获取标签'),
  });
}

export function useTagsForEnvironment(environmentId: EnvironmentId) {
  const { data: tags, isLoading } = useTags({
    select: (tags) => tags.filter((tag) => tag.Endpoints[environmentId]),
  });

  return { tags, isLoading };
}

export function useCreateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    createTag,
    mutationOptions(
      withError('无法创建标签'),
      withInvalidate(queryClient, [tagKeys.all])
    )
  );
}
