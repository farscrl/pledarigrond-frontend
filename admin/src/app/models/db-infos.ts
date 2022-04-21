export class DbInfos {
  numberOfLemmata: number = 0;
  numberOfEntries: number = 0;
  numberOfSuggestions: number = 0;
  numberOfApproved: number = 0;
  numberOfDeleted: number = 0;
  numberOfUndefined: number = 0;
  numberOfOutdated: number = 0;
}

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
  inflectionCount: InflectionCount = new InflectionCount();
}

export class InflectionCount {
  V?: number = 0;
}
