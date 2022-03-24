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

export class IndexInfos {
  numberOfEntries: number = 0;
  approvedEntries: number = 0;
  unverifiedEntries: number = 0;
  unknown: number = 0;
  lastUpdated: number = 0;
  overlayCount: any;
}
