import { Edit, FileText, Globe, UploadCloud } from 'lucide-react';

import GitIcon from '@/assets/ico/git.svg?c';

import { BoxSelectorOption } from '../types';

export const editor: BoxSelectorOption<'editor'> = {
  id: 'method_editor',
  icon: Edit,
  iconType: 'badge',
  label: 'Web编辑器',
  description: '使用我们的Web编辑器',
  value: 'editor',
};

export const upload: BoxSelectorOption<'upload'> = {
  id: 'method_upload',
  icon: UploadCloud,
  iconType: 'badge',
  label: '上传',
  description: '从您的计算机上传',
  value: 'upload',
};

export const git: BoxSelectorOption<'repository'> = {
  id: 'method_repository',
  icon: GitIcon,
  iconType: 'logo',
  label: '代码仓库',
  description: '使用Git仓库',
  value: 'repository',
};

export const edgeStackTemplate: BoxSelectorOption<'template'> = {
  id: 'method_template',
  icon: FileText,
  iconType: 'badge',
  label: '模板',
  description: '使用Edge堆栈模板',
  value: 'template',
};

export const customTemplate: BoxSelectorOption<'template'> = {
  id: 'method_template',
  icon: FileText,
  iconType: 'badge',
  label: '自定义模板',
  description: '使用自定义模板',
  value: 'template',
};

export const url: BoxSelectorOption<'url'> = {
  id: 'method_url',
  icon: Globe,
  iconType: 'badge',
  label: '网址',
  description: '指定文件的URL',
  value: 'url',
};
