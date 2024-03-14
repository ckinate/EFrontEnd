import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CustomService } from '@app/shared/services/CustomService.Service';
import { FileManagerDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'appdocviewer',
  templateUrl: './docviewer.component.html',
  styles: [
    './docviewer.component.css'
  ],
})
export class DocviewerComponent implements OnInit {
  @ViewChild('docModal', { static: true }) modal: ModalDirective;
  viewer = 'google';  
  selectedType = 'docx';
  DemoDoc: SafeResourceUrl;
  title = "";
  DemoType: string;
  NormalFile = false;
  DocumentFiles = false;
  loadDelay = false;
  savedSpace = false;

  constructor( private _pService: CustomService, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  getFileContentType(url: FileManagerDto): string
        {
            var pngContentType = "image/png";
            var jpegContentType = "image/jpeg";
            var docxContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            var xlsxContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            var pdfContentType = "application/pdf";
            var xlsContentType = "application/vnd.ms-excel";
            var docContentType = "application/msword";
            var txtContentType = "text/plain";
            var htmlContentTYpe = "text/html";
            var zipContentType = "application/zip";
            var rarContentType = "application/rar";

            var fileContentType = ".png" == url.extentionType.toLocaleUpperCase() ? pngContentType :
                ".jpg" == url.extentionType.toLocaleUpperCase() ? jpegContentType :
                ".docx" == url.extentionType.toLocaleUpperCase() ? docxContentType :
                ".xlsx" == url.extentionType.toLocaleUpperCase() ? xlsxContentType :
                ".pdf" == url.extentionType.toLocaleUpperCase() ? pdfContentType :
                ".xls" == url.extentionType.toLocaleUpperCase() ? xlsContentType :
                ".doc" == url.extentionType.toLocaleUpperCase() ? docContentType :
                ".html" == url.extentionType.toLocaleUpperCase() ? htmlContentTYpe:
                ".htm" == url.extentionType.toLocaleUpperCase()? htmlContentTYpe:
                ".zip" == url.extentionType.toLocaleUpperCase()? zipContentType:
                ".rar" == url.extentionType.toLocaleUpperCase()? rarContentType:
                txtContentType;
            return fileContentType;
  }

  ViewAppDocument(id: any, ext: string, cb = () => {}) {
    this.title = id.fileName;
    this.loadDelay = false;

    if (ext.toLowerCase() == 'zip' || ext.toLowerCase() == 'rar') {
      alert("Cannot View a File");
      return;
    }

    this.selectedType = ext;
    this.modal.show();

    this._pService.getFileUrl(id.id).subscribe((x) => {
      this.DemoDoc = this.sanitizer.bypassSecurityTrustResourceUrl(x['result']);
      if (
          ext.toLowerCase() == 'pdf' || ext.toLowerCase() == 'doc' || ext.toLowerCase() == 'xls' ||
          ext.toLowerCase() == 'xlsx' || ext.toLowerCase() == 'docx'
        ) {
          this.DocumentFiles = true;
          this.NormalFile = false;
          if (ext.toLowerCase().includes('doc') || ext.toLowerCase().includes('xls')) {
            id.extentionType = '.pdf';
          }
          this.DemoType = this.getFileContentType(id);
      } else {
        this.DocumentFiles = false;
        this.NormalFile = true;
      }
      this.loadDelay = true;
      cb();
    })
    }


    onShown() {

    }
    CloseModal() {
      this.modal.hide();
    }


}
