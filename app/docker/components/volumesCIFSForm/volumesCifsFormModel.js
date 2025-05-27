export function VolumesCIFSFormData() {
  this.useCIFS = false;
  this.serverAddress = '';
  this.share = '';
  this.version = 'CIFS v2.0 (用于 Windows Vista / Server 2008)';
  this.versions = [
    'CIFS v1.0（用于 Windows XP / Server 2003 及更早版本）',
    'CIFS v2.0（用于 Windows Vista / Server 2008）',
    'CIFS v2.1（用于 Windows 7 / Server 2008 R2）',
    'CIFS 3.0（用于 Windows 8 / Server 2012 及更新版本）',
  ];
  this.versionsNumber = ['1.0', '2.0', '2.1', '3.0'];
  this.username = '';
  this.password = '';
}
