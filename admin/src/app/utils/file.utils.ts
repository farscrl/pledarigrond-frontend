import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class FileUtils {

  getFileNameFromContentDispositionHeader(headers: HttpHeaders, fallback: string) {
    const cdHeader = headers.get('content-disposition');

    if (!cdHeader) {
      return fallback;
    }

    const fileName = cdHeader.split(';')[1].split('=')[1].replace(/\"/g, '');

    if (!fileName || fileName === "") {
      return fallback
    }
    return fileName
  }

  downloadFile(data: HttpResponse<Blob>, fileName: string) {
    const a = document.createElement('a')
    const objectUrl = URL.createObjectURL(data.body!)
    a.href = objectUrl
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}
