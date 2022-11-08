import { Component } from '@angular/core';

interface IFile extends File {
  progress: number;
  lastModifiedDate: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {

  fileContent: string = '';
  files: IFile[] = [];

  /**
   * on file drop handler
   */
  onFileDropped(files: IFile[]) {
    this.prepareFilesList(files);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: Event) {
    const target = event.target as HTMLInputElement;
    const files: any = target.files;
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress === 100) {
      this.files.splice(index, 1);
      this.fileContent = '';
    }
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 10);
      }
    });
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: IFile[]) {
    for (const item of files) {
      if (item.type === 'text/plain') {
        item.progress = 0;
        this.files.push(item);
      } else {
        alert('File type of "' + item.name + '" is not allowed.')
      }
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number | undefined, decimals: number = 0) {
    if (!bytes) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  showFile(file: IFile) {
    let fileReader: FileReader = new FileReader();
    let self: any = this;
    fileReader.onloadend = function(x) {
      self.fileContent = fileReader.result;
    }
    fileReader.readAsText(file);
  }
}
