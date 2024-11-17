import { Edit, FileText, Globe, UploadCloud } from 'lucide-react';

import GitIcon from '@/assets/ico/git.svg?c';
import Helm from '@/assets/ico/helm.svg?c';

import { BoxSelectorOption } from '../types';

export const editor: BoxSelectorOption<'editor'> = {
  id: 'method_editor',
  icon: Edit,
  iconType: 'badge',
  label: '网页编辑器',
  value: 'editor',
};

export const upload: BoxSelectorOption<'upload'> = {
  id: 'method_upload',
  icon: UploadCloud,
  iconType: 'badge',
  label: '上传',
  value: 'upload',
};

export const git: BoxSelectorOption<'repository'> = {
  id: 'method_repository',
  icon: GitIcon,
  iconType: 'logo',
  label: '代码仓库',
  value: 'repository',
};

export const edgeStackTemplate: BoxSelectorOption<'template'> = {
  id: 'method_template',
  icon: FileText,
  iconType: 'badge',
  label: '模板',
  description: '使用边缘堆栈应用或自定义模板',
  value: 'template',
};

export const customTemplate: BoxSelectorOption<'template'> = {
  id: 'method_template',
  icon: FileText,
  iconType: 'badge',
  label: '自定义模板',
  value: 'template',
};

export const helm: BoxSelectorOption<'helm'> = {
  id: 'method_helm',
  icon: Helm,
  label: 'Helm 图表',
  value: 'helm',
  iconClass: '!text-[#0f1689] th-dark:!text-white th-highcontrast:!text-white',
};

export const url: BoxSelectorOption<'url'> = {
  id: 'method_url',
  icon: Globe,
  iconType: 'badge',
  label: '网址',
  value: 'url',
};
