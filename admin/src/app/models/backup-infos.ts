export class BackupInfos {
  infos: BackupFile[] = [];
  backupLocation: string = "";
  backupNums: string = "";
  triggerTime: string = "";
}

export class BackupFile {
  absolutePath: string = "";
  parent: string = "";
  name: string = "";
  size: string = "";
  creationDate: string = "";
  lastModified: string = "";
}
