export function VolumesCIFSFormData() {
  this.useCIFS = false;
  this.serverAddress = '';
  this.share = '';
  this.version = 'CIFS v2.0（由Windows Vista / Server 2008使用）';
  this.versions = [
    'CIFS v1.0（由Windows XP / Server 2003及更早版本使用）',
    'CIFS v2.0（由Windows Vista / Server 2008使用）',
    'CIFS v2.1（由Windows 7 / Server 2008 R2使用）',
    'CIFS 3.0（由Windows 8 / Server 2012及更新版本使用）',
  ];
  this.versionsNumber = ['1.0', '2.0', '2.1', '3.0'];
  this.username = '';
  this.password = '';
}
