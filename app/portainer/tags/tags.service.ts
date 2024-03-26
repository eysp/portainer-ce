import axios, { parseAxiosError } from '../services/axios';

import { Tag, TagId } from './types';

export async function getTags() {
  try {
    const { data } = await axios.get<Tag[]>(buildUrl());
    return data;
  } catch (err) {
    throw parseAxiosError(err as Error, '无法获取标签');
  }
}

export async function createTag(name: string) {
  try {
    const { data: tag } = await axios.post<Tag>(buildUrl(), { name });
    return tag;
  } catch (err) {
    throw parseAxiosError(err as Error, '无法创建标签');
  }
}

export async function deleteTag(id: TagId) {
  try {
    await axios.delete(buildUrl(id));
  } catch (err) {
    throw parseAxiosError(err as Error, '无法删除标签');
  }
}

function buildUrl(id?: TagId) {
  let url = '/tags';
  if (id) {
    url += `/${id}`;
  }

  return url;
}
