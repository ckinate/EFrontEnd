import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import {EmailParameters, EmailParametersWithDateRange, MessagingActionDto, MessagingServiceServiceProxy, GeneralOperationsServiceServiceProxy, OperationsDto } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DateTime } from 'luxon';

enum TypeOfIntervals {
  Days = 1,
  Weeks = 2,
  Month = 3,
  Year = 4,
}

@Component({

  templateUrl: './action-notification.component.html',
  styleUrls: ['./action-notification.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class ActionNotificationComponent  extends AppComponentBase implements OnInit {
  fileformatForm: NgForm;
  @ViewChild('docModal', { static: true }) modal: ModalDirective;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  operationList: OperationsDto[] = [];
  actionList: MessagingActionDto[] = [];
  operationId: number;
  blindCopy: string[] = [];
  recieverEmail: string[] = [];
  action: MessagingActionDto = null;
  cc: string[] = [];
  actionProperties: string[] = [];
  blindCopyEmail: string;
  recieveEmail: string;
  copyEmail: string;
  saving = false;
  isReady = false;
  subjectOfMail = "";
  public Editor = ClassicEditor;
  public model = {
    editorData: '<p>Hello, world!</p>'
  };
  escalation = "Escalation";
  intervals = [
    TypeOfIntervals[TypeOfIntervals.Days],
    TypeOfIntervals[TypeOfIntervals.Weeks],
    TypeOfIntervals[TypeOfIntervals.Month],
    TypeOfIntervals[TypeOfIntervals.Year]
  ];
  interval: string;
  numOfPeriod = 1;
  emailMgt: EmailParameters = new EmailParameters();
  public dateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(30), this._dateTimeService.getEndOfDay()];
  propertiesToExclude = ["NumOfPeriod", "Interval", "LastDelivery"];

  constructor(injector: Injector,

    private _general: GeneralOperationsServiceServiceProxy,
    private _msg: MessagingServiceServiceProxy,
    private _dateTimeService: DateTimeService
  ) {
      super(injector);
    }


    clean(s: string): string{
      return s.replace(/([A-Z])/g, ' $1').trim();
    }

    ngOnInit(): void {

      this.load();
    }

    CloseModal() {
      this.modal.hide();
    }

    preview() {
      document.getElementById("wipe").innerHTML = this.model.editorData;
      this.modal.show();
    }

    makeSureItsValid() {
      if (this.numOfPeriod <= 0) {
        this.numOfPeriod = 1
      }

      if (this.numOfPeriod >= 100) {
        this.numOfPeriod = 100;
      }
    }

    validateEmail(email: string): boolean {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    removeReceiver(item: string): void {
      const newReciever = this.recieverEmail.filter(i => {
        return item.toLowerCase() != i.toLowerCase();
      });

      this.recieverEmail = newReciever;
    }

    appendParameters(item: string): void {
      this.model.editorData = this.model.editorData + `{{${item}}}`;
    }

    appendOperationName(): void {
      this.model.editorData = this.model.editorData + `{{OperationName}}`;
    }

    appendSystemGeneratedMessage(): void {
      this.model.editorData = this.model.editorData + `{{System-Generated-Message}}`;
    }

    appendOperationNameHeader(): void {
      this.subjectOfMail = this.subjectOfMail + `{{OperationName}}`;
    }

    appendParametersHeader(item: string):void {
      this.subjectOfMail = this.subjectOfMail + `{{${item}}}`;
    }

    addReciever(): void {
      if (this.validateEmail(this.recieveEmail)) {
        const checkIfEmailExist = this.recieverEmail.filter(i => {
          return i.toLowerCase() == this.recieveEmail.toLowerCase();
        });
        if (checkIfEmailExist.length <= 0) {
          this.recieverEmail.push(this.recieveEmail);
        }
      }
    }

    htmlDecode(input: string): string {
      input = input.replace(/[\<]+/g, '&lt;')
      input = input.replace(/[\>]+/g, '&gt;')
      return input
    }

    removeBlindCopy(item: string): void {
      const newBlindCopy = this.blindCopy.filter(i => {
        return item.toLowerCase() != i.toLowerCase();
      });

      this.blindCopy = newBlindCopy;
    }

    addBlindCopy(): void {
        debugger;
      if (this.validateEmail(this.blindCopyEmail)) {
        const checkIfEmailExist = this.blindCopy.filter(i => {
          return i.toLowerCase() == this.blindCopyEmail.toLowerCase();
        });
        if (checkIfEmailExist.length <= 0) {
          this.blindCopy.push(this.blindCopyEmail);
        }
      }
    }

    removeCopy(item: string): void {
      const newCopy = this.cc.filter(i => {
        return item.toLowerCase() != i.toLowerCase();
      });

      this.cc = newCopy;
    }

    addCopy(): void {
      if (this.validateEmail(this.copyEmail)) {
        const checkIfEmailExist = this.cc.filter(i => {
          return i.toLowerCase() == this.copyEmail.toLowerCase();
        });
        if (checkIfEmailExist.length <= 0) {
          this.cc.push(this.copyEmail);
        }
      }
    }

    changeOperationID(e) {
      this.operationId = e;
      this._msg.getActionListForUser(e, abp.session.tenantId)
      .subscribe(actionList => {
        this.actionList = actionList;
        this.action = null;
      })
    }

    checkIfOpId() {
      return this.operationId > 0
    }

    checkIfActionId() {
      return this.action != null;
    }

    revampActionName(name: string) {
      return String(name).replace('{{OperationName}}', this.getOperation(this.operationId));
    }

    save() {

      this.primengTableHelper.isLoading = true;
      const internalPropertiesString = this.action.internalProperties;
      const internalProperties = JSON.parse(internalPropertiesString);
      const newInternalProperties = internalProperties.map(i => {
        if (i['Blind Copy'] != null){
          return {"Blind Copy" : this.blindCopy}
        }

        if (i['Copy'] != null) {
          return {"Copy" : this.cc}
        }

        if (i['Receiever Email'] != null) {
        return {"Receiever Email": this.recieverEmail};
        }
      });
      this.action.internalProperties = JSON.stringify(newInternalProperties);


      //Escalation
      if(this.action.actionName.includes(this.escalation)){
        const externalPropertiesString = this.action.externalProperties;
        const externalProperties = JSON.parse(externalPropertiesString);
        externalProperties[`${this.propertiesToExclude[1]}`] = this.interval;
        externalProperties[`${this.propertiesToExclude[0]}`] = this.numOfPeriod;
        this.action.externalProperties = JSON.stringify(externalProperties);
      }

      this.action.subject = this.subjectOfMail;
      this.action.operationID = this.operationId;
      this.action.message = this.model.editorData;
      this.action.companyCode = this.getCompanyCode();
      this.action.tenantId = abp.session.tenantId;
      this.action.message = this.htmlDecode(this.action.message);
      this.action.subject = this.htmlDecode(this.action.subject);
      this._msg.createMessageAction(this.action).subscribe(result => {
        this.notify.info("Saved Successfully", `${this.revampActionName(this.action.actionName)}`);
        this.primengTableHelper.isLoading = false;
        /**
         * const obj = new MessagingActionExtra();
        obj.messagingActionDto = this.action;
        obj.operationId = this.operationId;
        obj.receieverMail = [""];
        this._msg.sampleTest(obj).subscribe(result2 => {
          console.log(result2);
        });
         *  */
      });
    }

    onShown() {
      console.log("Here");
    }

    changeActionName(action: MessagingActionDto) {
      this.action = action;
      const internalPropertiesString = this.action.internalProperties;
      const internalProperties = JSON.parse(internalPropertiesString);
      const externalPropertiesString = this.action.externalProperties;
      const externalProperties = JSON.parse(externalPropertiesString);
      internalProperties.forEach(i => {
        if (i['Blind Copy'] != null){
          this.blindCopy = i['Blind Copy']
        }

        if (i['Copy'] != null) {
          this.cc = i['Copy']
        }

        if (i['Receiever Email'] != null) {
          this.recieverEmail = i['Receiever Email'];
        }
      });

      this.actionProperties = this.action.actionName.includes("Escalation") ?
        Object.keys(externalProperties).map(i => i).filter(i => !this.propertiesToExclude.includes(i)) :
        Object.keys(externalProperties).map(i => i);
      this.model.editorData = this.action.message;
      this.subjectOfMail = this.revampActionName(this.action.subject);
      this.action.operationID = this.operationId;

      if(this.action.actionName.includes(this.escalation)){
        this.numOfPeriod = externalProperties[`${this.propertiesToExclude[0]}`];
        this.interval = externalProperties[`${this.propertiesToExclude[1]}`] == TypeOfIntervals.Weeks ?
          TypeOfIntervals[TypeOfIntervals.Weeks] : externalProperties[`${this.propertiesToExclude[1]}`]
      }
    }


    load() {
      this.primengTableHelper.showLoadingIndicator();
      this.primengTableHelper.isLoading = true;
      this._general.getListOperation().subscribe(ops => {
        this._msg.getDefaultActionList()
          .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
          .subscribe(actionList => {
            this.operationList = ops;
            this.actionList = actionList;

            var email = new EmailParametersWithDateRange();
            email.dateRange = this.dateRange;
            email.email = this.emailMgt;
            this._msg.searchEmail(email)
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
              const newResult = result.map(i => {
                return {
                  ...i,
                  bcc: String(i.bcc).split(',').join(', '),
                  cc: String(i.cc).split(',').join(', '),
                  mailTo: String(i.mailTo).split(',').join(', '),
                  dateSent: i.dateSent.day+' 0'+ i.dateSent.month+ ', '+ i.dateSent.year+ ' '+i.dateSent.hour+ ':'+ i.dateSent.minute+':'+ i.dateSent.second
                }
              })
              this.primengTableHelper.records = newResult;
              this.primengTableHelper.isLoading = false;
              this.primengTableHelper.hideLoadingIndicator();
            });
          })
      });
    }

    resetForm() {
      // this.fileformatForm.resetForm();
      this.emailMgt = new EmailParameters();
      this.dateRange = [this._dateTimeService.getStartOfDayMinusDays(30), this._dateTimeService.getEndOfDay()];
      this.search();
    }


    search() {
      var emailMgt = new EmailParametersWithDateRange();
      emailMgt.email = this.emailMgt;
      emailMgt.dateRange = this.dateRange;
      console.log(emailMgt);
      this._msg.searchEmail(emailMgt).subscribe(result => {
        const newResult = result.map(i => {
          return {
            ...i,
            bcc: String(i.bcc).split(',').join(', '),
            cc: String(i.cc).split(',').join(', '),
            mailTo: String(i.mailTo).split(',').join(', '),
            dateSent: i.dateSent.day+' 0'+ i.dateSent.month+ ', '+ i.dateSent.year+ ' '+i.dateSent.hour+ ':'+ i.dateSent.minute+':'+ i.dateSent.second
          }
        })
        this.primengTableHelper.records = newResult;
      });
    }

    getOperation(id): string {
      return this.operationList.filter(x => x.id == id)[0].description;
    }


}
