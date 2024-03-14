import { Component, Injector, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { FileUploader, FileUploaderOptions, FileItem, ParsedResponseHeaders, FileLikeObject } from 'ng2-file-upload';
import { AppComponentBase } from "@shared/common/app-component-base";
import { ProfileServiceProxy, DocumentServiceProxy } from "@shared/service-proxies/service-proxies";
import { IAjaxResponse, TokenService } from "@node_modules/abp-ng2-module";
import { AppConsts } from "@shared/AppConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DocviewerComponent } from './docviewer.component';
import { Console } from 'console';


@Component({
  selector: 'appfileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],

  animations: [appModuleAnimation()]
})
export class FileuploadComponent extends AppComponentBase implements OnInit {
  @ViewChild('fileUp') myInputVariable: ElementRef;

  @ViewChild('docView', { static: true }) modal: ModalDirective;

  @ViewChild('appdocviewer', { static: true }) appdocviewer: DocviewerComponent;
   @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
   totalNumberUploadItem:number;
  uniqueID: any;
  OPID: number;
  NotViewOnly = true;

  public uploader: FileUploader;
  private _uploaderOptions: FileUploaderOptions = {};
  description: string;
  progressAction: any;
  itemName: any;
  refNumber = '';
  attachedList = [];
  fileTypeList=  [];
  allowableFileType = '';
  remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
  isGeneratingView = false;


  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  constructor(
    injector: Injector,
    private _profileService: ProfileServiceProxy,
    private _tokenService: TokenService, private _service: DocumentServiceProxy
  ) {
    super(injector);
  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  files: any = [];

 @Input() pid: number; //Operation id
 @Input() ID: any; // Ref or UniqueID
 @Input() viewOnly: boolean; // View type (Upload or Just View)


  ngOnInit() {


    this.getFileTypes();
    this.initFileUploader();
    this.getFiles();
    this.getFilesByRefOnly();



     if(this.viewOnly.toString() == "true")
     {


   this.ShowAttachment(this.ID, this.pid);


     }
     else{
      this.ShowAttachmentByRef(this.ID,this.pid);


     }


  }

  getTransactionDate(e){
    const c = e?.c;
    return `${c?.year}-${c?.month}-${c?.day} ${c?.hour}:${c?.minute}:${c?.second}`;
  }


  ShowAttachment(id: any, OPID: number) {
   // this.getFileTypes();
   this.viewOnly = true;
    this.uniqueID = id;
    this.OPID = OPID;
    this.getFiles();
  // this.getAllFileUploaded(id,OPID);
  // this.initFileUploader();

    this.modal.show();
  }

  getAllFileUploaded(id: any, OPID: number){
    this.attachedList = [];

    this._service.getFilesByUniqueIDAndOPID(id, OPID, 2).subscribe(x => {
      this.attachedList = x;

    });
  }

  getFileTypes()
  {
    this._service.getFileExtentionType().subscribe(x => {
    this.fileTypeList = x;
    this.allowableFileType = 'File type: ' + JSON.stringify(x).replace("]","").replace("[","");

    });

  }

  ShowAttachmentforquery(id: any, OPID: number) {
    this.uniqueID = id;
    this.OPID = OPID;
    this.getFilesByRef();

  }

  ShowAttachmentByRef(id: any, OPID: number) {
    this.viewOnly = false;
    this.uniqueID = id;
    this.OPID = OPID;
   // this.getFilesByRef();
    this.getFiles(2);
    this.NotViewOnly = false;
    this.modal.show();
  }
  ShowAttachmentByRefOnly(id: any){
    this.viewOnly = false;
    this.uniqueID = id;
    this.getFilesByRefOnly();
    this.NotViewOnly = false;

    this.modal.show();
  }
  ShowAttachmentByParentRef(id: any){
      console.log("The Parent Ref is", id);

    this.viewOnly = false;
    this.uniqueID = id;
    this.getFilesByParentRef();
    this.NotViewOnly = false;

    this.modal.show();
  }


  onShown() {

  }
  CloseModal() {
    this.NotViewOnly = true;
    
    this.modalSave.emit(this.totalNumberUploadItem);
    this.modal.hide();

  }
  DeleteItem(id: number) {

    this.message.confirm(this.l('DeleteDocument'),
      this.l('AreYouSure'),
      isConfirmed => {
        if (isConfirmed) {
          this._service.deleteDocument(id).subscribe(x => {
            this.getFiles();
          });

        }
      });

  }

  DocView(id: any) {

    var ext = id.extentionType;
    var nextt = ext.replace(".", "");
    console.log(this.appdocviewer);
   this.appdocviewer.ViewAppDocument(id, nextt, () => {   });
  }
  getFiles(id: number =1) {
    this.attachedList = [];

    this.showMainSpinner();
    this._service.getFilesByUniqueIDAndOPID(this.uniqueID, this.OPID, id).subscribe(x => {
      this.attachedList = x;
      this.totalNumberUploadItem=x.length;
      this.hideMainSpinner();

    });

  }
  getFilesViewOnly() {
    this.attachedList = [];
    this.showMainSpinner();
    this._service.getFilesByUniqueIDAndOPID(this.uniqueID, this.OPID, 2).subscribe(x => {
      this.attachedList = x;
      this.hideMainSpinner();

    });

  }

  getFilesByRef() {
    this.attachedList = [];

    this.showMainSpinner();
    this._service.getFilesByUniqueIDAndOPID(this.uniqueID, this.OPID, 2).subscribe(x => {
      this.attachedList = x;
      this.hideMainSpinner();

    });

  }
  getFilesByRefOnly(){
    this.attachedList = [];
    this.showMainSpinner();
    this._service.getFilesByRefOnly(this.uniqueID).subscribe(x=>{
      this.attachedList = x;
      this.hideMainSpinner();

    })
  }
  getFilesByParentRef(){
    this.attachedList = [];
    this.showMainSpinner();
    this._service.getFilesByParentRef(this.uniqueID).subscribe(x=>{
        this.attachedList = x;
        this.hideMainSpinner();
    })

  }


  initFileUploader(): void {
    this.uploader = new FileUploader({ url: this.remoteServiceBaseUrl + '/FileUpload/UploadFile' });
    this._uploaderOptions.autoUpload = true;
    this._uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
    this._uploaderOptions.removeAfterUpload = true;

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    if (this.description === '' || this.description === undefined) {
     this.description =  this.itemName;
    }
    this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
      form.append('Remarks', this.description);
      form.append('OperationID', this.OPID);
      form.append('TenantId', this.appSession.tenantId);
      form.append('CompanyCode', this.appSession.companyCode);
      form.append('UniqueID', this.uniqueID);
      form.append('RefNumber', this.refNumber);
    };
    this.uploader.onWhenAddingFileFailed = (item, f, o ) => this.onWhenAddingFileFailed(item, f, o);
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);



    this.uploader.onProgressItem = (item, progress) => {

      this.progressAction = progress;
      this.itemName = item.file.name;
    }

    this.uploader.setOptions(this._uploaderOptions);


    this.uploader.onCompleteAll = () => {
      this.reset();

    };

  }

  save(): void {
    this.files = [];
    this.uploader.uploadAll();
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter:any, options:any) {
    console.log(options);
    console.log(filter);
    this.notify.error('Unable to upload file name ' + item.name + '. Reason: ' + filter.name);
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    //let idata = JSON.parse(response); //success server response
   // this.notify.error(item.file.name + ' ----> ' + idata['result'],'Success');
}
onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {

  console.log(response);
  let ierror = JSON.parse(response); //error server response


      this.notify.error(item.file.name + ' ----> ' + ierror['result'],'Error', {"timer":6000,"animation":true });


}

  fileChangeEvent(event: any): void {


    this.uploader.clearQueue();

    this.uploader.addToQueue(event.target.files);
    this.uploader.uploadAll();


  }

  reset() {

    this.uploader.destroy();
    this.getFiles();
    this.myInputVariable.nativeElement.value = '';
    this.description = '';

  }
}
