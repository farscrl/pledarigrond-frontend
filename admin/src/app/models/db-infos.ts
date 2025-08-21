export class DbInfos {
  numberOfEntries: number = 0;
  numberOfVersions: number = 0;
  numberOfSuggestions: number = 0;
  numberOfApproved: number = 0;
}

export class BackupInfos {
  infos: BackupFile[] = [];
  backupLocation: string = "";
  backupNumber: string = "";
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
  lastUpdated: number = 0;
  inflectionCount: InflectionCount = new InflectionCount();
}

export class InflectionCount {
  VERB?: number = 0;
  ADJECTIVE?: number = 0;
  NOUN?: number = 0;
  OTHER?: number = 0;
  PRONOUN?: number = 0;
}
