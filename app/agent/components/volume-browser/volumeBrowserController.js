import _ from 'lodash-es';
import { confirmDelete } from '@@/modals/confirm';

export class VolumeBrowserController {
  /* @ngInject */
  constructor($async, HttpRequestHelper, VolumeBrowserService, FileSaver, Blob, Notifications) {
    Object.assign(this, { $async, HttpRequestHelper, VolumeBrowserService, FileSaver, Blob, Notifications });
    this.state = {
      path: '/',
    };

    this.rename = this.rename.bind(this);
    this.renameAsync = this.renameAsync.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.download = this.download.bind(this);
    this.downloadAsync = this.downloadAsync.bind(this);
    this.up = this.up.bind(this);
    this.browse = this.browse.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.deleteFileAsync = this.deleteFileAsync.bind(this);
    this.getFilesForPath = this.getFilesForPath.bind(this);
    this.getFilesForPathAsync = this.getFilesForPathAsync.bind(this);
    this.onFileSelectedForUpload = this.onFileSelectedForUpload.bind(this);
    this.onFileSelectedForUploadAsync = this.onFileSelectedForUploadAsync.bind(this);
    this.parentPath = this.parentPath.bind(this);
    this.buildPath = this.buildPath.bind(this);
    this.$onInit = this.$onInit.bind(this);
    this.onFileUploaded = this.onFileUploaded.bind(this);
    this.refreshList = this.refreshList.bind(this);
  }

  rename(file, newName) {
    return this.$async(this.renameAsync, file, newName);
  }
  async renameAsync(file, newName) {
    const filePath = this.state.path === '/' ? file : `${this.state.path}/${file}`;
    const newFilePath = this.state.path === '/' ? newName : `${this.state.path}/${newName}`;

    try {
      await this.VolumeBrowserService.rename(this.endpointId, this.volumeId, filePath, newFilePath);
      this.Notifications.success('文件重命名成功', newFilePath);
      this.files = await this.VolumeBrowserService.ls(this.endpointId, this.volumeId, this.state.path);
    } catch (err) {
      this.Notifications.error('失败', err, '无法重命名文件');
    }
  }

  confirmDelete(file) {
    const filePath = this.state.path === '/' ? file : `${this.state.path}/${file}`;

    confirmDelete(`您确定要删除 ${filePath} 吗？`).then((confirmed) => {
      if (!confirmed) {
        return;
      }
      this.deleteFile(filePath);
    });
  }

  download(file) {
    return this.$async(this.downloadAsync, file);
  }
  async downloadAsync(file) {
    const filePath = this.state.path === '/' ? file : `${this.state.path}/${file}`;

    try {
      const data = await this.VolumeBrowserService.get(this.endpointId, this.volumeId, filePath);
      const downloadData = new Blob([data.file]);
      this.FileSaver.saveAs(downloadData, file);
    } catch (err) {
      this.Notifications.error('失败', err, '无法下载文件');
    }
  }

  up() {
    const parentFolder = this.parentPath(this.state.path);
    this.getFilesForPath(parentFolder);
  }

  browse(folder) {
    const path = this.buildPath(this.state.path, folder);
    this.getFilesForPath(path);
  }

  deleteFile(file) {
    return this.$async(this.deleteFileAsync, file);
  }
  async deleteFileAsync(file) {
    try {
      await this.VolumeBrowserService.delete(this.endpointId, this.volumeId, file);
      this.Notifications.success('文件删除成功', file);
      this.files = await this.VolumeBrowserService.ls(this.endpointId, this.volumeId, this.state.path);
    } catch (err) {
      this.Notifications.error('失败', err, '无法删除文件');
    }
  }

  getFilesForPath(path) {
    return this.$async(this.getFilesForPathAsync, path);
  }
  async getFilesForPathAsync(path) {
    try {
      const files = await this.VolumeBrowserService.ls(this.endpointId, this.volumeId, path);
      this.state.path = path;
      this.files = files;
    } catch (err) {
      this.Notifications.error('失败', err, '无法浏览卷');
    }
  }

  onFileSelectedForUpload(file) {
    return this.$async(this.onFileSelectedForUploadAsync, file);
  }
  async onFileSelectedForUploadAsync(file) {
    try {
      await this.VolumeBrowserService.upload(this.endpointId, this.state.path, file, this.volumeId);
      this.onFileUploaded();
    } catch (err) {
      this.Notifications.error('失败', err, '无法上传文件');
    }
  }

  parentPath(path) {
    if (path.lastIndexOf('/') === 0) {
      return '/';
    }

    const split = _.split(path, '/');
    return _.join(_.slice(split, 0, split.length - 1), '/');
  }

  buildPath(parent, file) {
    if (parent === '/') {
      return parent + file;
    }
    return `${parent}/${file}`;
  }

  onFileUploaded() {
    this.refreshList();
  }

  refreshList() {
    this.getFilesForPath(this.state.path);
  }

  async $onInit() {
    this.HttpRequestHelper.setPortainerAgentTargetHeader(this.nodeName);
    try {
      this.files = await this.VolumeBrowserService.ls(this.endpointId, this.volumeId, this.state.path);
    } catch (err) {
      this.Notifications.error('失败', err, '无法浏览卷');
    }
  }
}
