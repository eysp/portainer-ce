import _ from 'lodash-es';

const ROOT_PATH = '/host';

export class HostBrowserController {
  /* @ngInject */
  constructor($async, HostBrowserService, Notifications, FileSaver, ModalService) {
    Object.assign(this, { $async, HostBrowserService, Notifications, FileSaver, ModalService });

    this.state = {
      path: ROOT_PATH,
    };

    this.goToParent = this.goToParent.bind(this);
    this.browse = this.browse.bind(this);
    this.confirmDeleteFile = this.confirmDeleteFile.bind(this);
    this.isRoot = this.isRoot.bind(this);
    this.getRelativePath = this.getRelativePath.bind(this);
    this.getFilesForPath = this.getFilesForPath.bind(this);
    this.getFilesForPathAsync = this.getFilesForPathAsync.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.downloadFileAsync = this.downloadFileAsync.bind(this);
    this.renameFile = this.renameFile.bind(this);
    this.renameFileAsync = this.renameFileAsync.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.deleteFileAsync = this.deleteFileAsync.bind(this);
    this.onFileSelectedForUpload = this.onFileSelectedForUpload.bind(this);
    this.onFileSelectedForUploadAsync = this.onFileSelectedForUploadAsync.bind(this);
  }

  getRelativePath(path) {
    path = path || this.state.path;
    const rootPathRegex = new RegExp(`^${ROOT_PATH}/?`);
    const relativePath = path.replace(rootPathRegex, '/');
    return relativePath;
  }

  goToParent() {
    this.getFilesForPath(this.parentPath(this.state.path));
  }

  isRoot() {
    return this.state.path === ROOT_PATH;
  }

  browse(folder) {
    this.getFilesForPath(this.buildPath(this.state.path, folder));
  }

  getFilesForPath(path) {
    return this.$async(this.getFilesForPathAsync, path);
  }
  async getFilesForPathAsync(path) {
    try {
      const files = await this.HostBrowserService.ls(path);
      this.state.path = path;
      this.files = files;
    } catch (err) {
      this.Notifications.error('失败', err, '无法浏览');
    }
  }

  renameFile(name, newName) {
    return this.$async(this.renameFileAsync, name, newName);
  }
  async renameFileAsync(name, newName) {
    const filePath = this.buildPath(this.state.path, name);
    const newFilePath = this.buildPath(this.state.path, newName);
    try {
      await this.HostBrowserService.rename(filePath, newFilePath);
      this.Notifications.success('文件成功重命名', this.getRelativePath(newFilePath));
      const files = await this.HostBrowserService.ls(this.state.path);
      this.files = files;
    } catch (err) {
      this.Notifications.error('失败', err, '无法重命名文件');
    }
  }

  downloadFile(fileName) {
    return this.$async(this.downloadFileAsync, fileName);
  }
  async downloadFileAsync(fileName) {
    const filePath = this.buildPath(this.state.path, fileName);
    try {
      const { file } = await this.HostBrowserService.get(filePath);
      const downloadData = new Blob([file], {
        type: 'text/plain;charset=utf-8',
      });
      this.FileSaver.saveAs(downloadData, fileName);
    } catch (err) {
      this.Notifications.error('失败', err, '无法下载文件');
    }
  }

  confirmDeleteFile(name) {
    const filePath = this.buildPath(this.state.path, name);

    this.ModalService.confirmDeletion(`是否确实要删除 ${this.getRelativePath(filePath)} ?`, (confirmed) => {
      if (!confirmed) {
        return;
      }
      return this.deleteFile(filePath);
    });
  }

  deleteFile(path) {
    this.$async(this.deleteFileAsync, path);
  }
  async deleteFileAsync(path) {
    try {
      await this.HostBrowserService.delete(path);
      this.Notifications.success('文件已成功删除', this.getRelativePath(path));
      const files = await this.HostBrowserService.ls(this.state.path);
      this.files = files;
    } catch (err) {
      this.Notifications.error('失败', err, '无法删除文件');
    }
  }

  $onInit() {
    this.getFilesForPath(ROOT_PATH);
  }

  parentPath(path) {
    if (path === ROOT_PATH) {
      return ROOT_PATH;
    }

    const split = _.split(path, '/');
    return _.join(_.slice(split, 0, split.length - 1), '/');
  }

  buildPath(parent, file) {
    if (parent.lastIndexOf('/') === parent.length - 1) {
      return parent + file;
    }
    return parent + '/' + file;
  }

  onFileSelectedForUpload(file) {
    return this.$async(this.onFileSelectedForUploadAsync, file);
  }
  async onFileSelectedForUploadAsync(file) {
    if (!this.endpointId) {
      throw new Error('缺少端点ID');
    }
    try {
      await this.HostBrowserService.upload(this.endpointId, this.state.path, file);
      this.onFileUploaded();
    } catch (err) {
      this.Notifications.error('失败', err, '无法上传文件');
    }
  }

  onFileUploaded() {
    this.refreshList();
  }

  refreshList() {
    this.getFilesForPath(this.state.path);
  }
}
