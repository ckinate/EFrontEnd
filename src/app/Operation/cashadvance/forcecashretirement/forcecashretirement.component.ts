import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
//import { ChartofAccountServiceServiceProxy,CreatePaymentTransactionDto, GeneralOperationsServiceServiceProxy, CashRetirementServiceServiceProxy, OperatingExpenseServiceServiceProxy, OperationsDto, TransactionTypeDto,  GetAdvanceDto, WorkflowMappingDto,PayeeNameViewDto,PaymentTransactionDto, WorkflowServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import { ChartofAccountServiceServiceProxy,CreatePaymentTransactionDto, GeneralOperationsServiceServiceProxy, CashRetirementServiceServiceProxy, OperatingExpenseServiceServiceProxy, OperationsDto, TransactionTypeDto, WorkflowMappingDto,PayeeNameViewDto,PaymentTransactionDto, WorkflowServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';

//import { CashAdvanceworkflowroutemodalComponent } from './cashadvanceworkflowroutemodal/cashadvanceworkflowroutemodal.component';
//import { CASplitcostmodalComponent } from './casplitcostmodal/casplitcostmodal.component';
//import { TaxtransactionmodalComponent } from './taxtransactionmodal/taxtransactionmodal.component';
//import { FileuploadComponent } from '@app/admin/fileupload/fileupload.component';
import { result } from 'lodash';
import { SplitcostmodalComponent } from '@app/operation/opex/paymenttransaction/splitcostmodal/splitcostmodal.component';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';



@Component({

  templateUrl: './forcecashretirement.component.html',
  styleUrls: ['./forcecashretirement.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class ForceCashRetirementComponent extends AppComponentBase implements OnInit, AfterViewInit {



  payftransForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();

 paytrans:  CreatePaymentTransactionDto = new CreatePaymentTransactionDto();

  records:  PaymentTransactionDto[] = [];
  operationList: OperationsDto[] = [];
  catransactionTypeList: TransactionTypeDto[] = [];

  saving = false;
  startdate: moment.Moment;
  hasDate = false;
  mindate : Date;
  defBenid=abp.session.userId.toString();
  attachId:string;



  //payeetypelist: PayeeTypeDto[]=[];

  payeenamelist: PayeeNameViewDto[]=[];

  //cashadvlist:GetAdvanceDto[]=[];
  cashadvlist:PaymentTransactionDto[]=[];
  amtadvanced=0;
  sAmount=0;
  cAmount=0;
  aAmount=0;
  advno="";

  //casetupnum: CreateCASetupDto=new CreateCASetupDto;


 // @ViewChild('taxTransactionModal', { static: true }) taxTransactionModal: TaxtransactionmodalComponent;

  @ViewChild('splitCostModal', { static: true }) splitCostModal: SplitcostmodalComponent

  //@ViewChild('cashadvanceWorkflowRouteModal', { static: true }) cashadvanceWorkflowRouteModal: CashAdvanceworkflowroutemodalComponent;

  totalAmount: any = 0;
  cashadvanceDto= new PaymentTransactionDto();

 @ViewChild('fileUpload', { static: true}) fileUpload: FileuploadComponent
// @ViewChild('appdocuments', { static: true}) appdocuments: DocumentsComponent
taxtransprimengTableHelper = new PrimengTableHelper();
  isReady = false;

  splitcostprimengTableHelper = new PrimengTableHelper();

  saveButtonDisabled = false;
  initiateButtonDisable = true;
  levelfromWorkflowMapping: WorkflowMappingDto[]=[];
  selectedoperationId :any;

  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _cashAdvance: CashRetirementServiceServiceProxy,
    private _operationService: GeneralOperationsServiceServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _workflowService: WorkflowServiceServiceProxy,
    private _opex:OperatingExpenseServiceServiceProxy,
    private _router: Router
    ) {

super(injector);
}

  ngOnInit(): void {

    this.primengTableHelper.isLoading = true;
    // this. loadCARetirement();
    // //this.getNumofDays();
   ////  this.getOperation();
     //this.getcatransactionType();
  //this. getCaRTotalAmount();
  //this.getCNamee();
  this.getCAdvance();
  this.getNamee();
  this.checkLocalstorage();


////this.paytrans.payeeName=abp.session.userId.toString();


  this._router.navigate([], {
    relativeTo: this._activatedRoute,
    queryParams: {
      OPD: 21
    },
    queryParamsHandling: 'merge',
    // preserve the existing query params in the route
    //skipLocationChange: true
    // do not trigger navigation
  });

  this.primengTableHelper.isLoading = false;


  }

  ngAfterViewInit(): void {

    this.checkLocalstorage();

  }

  getNamee(){
    this._cashAdvance.fetchAllStaff().subscribe(result =>{
      this.payeenamelist = result;
    })
  }

// showDocument(id: any){
// console.log(id);
//   this.appdocuments.ShowAttachmentByRef(id,26);
//  }
 fileDocument(id: any){
  this.fileUpload.ShowAttachment(id,26);
 }
  getOperation() {

    this._operationService.getListOperation()
      .subscribe(items => {
        this.operationList = items;



      });
  }
getDetailswithIntFull(){
  //this.getDetailswithInt();
  this.getFCAdvance();
}

  getCNamee(){
    let refNo =this.paytrans.requestNumber;
    console.log(refNo);
    this._cashAdvance.fetchCARPayeeName(refNo).subscribe(result =>{
      this.cashadvanceDto=result;
      this.paytrans.payeeName = this.cashadvanceDto.payeeName;
      console.log(this.paytrans.payeeName);
    })
  }
  getCAdvance(){
    this._cashAdvance.fetchAdvance().subscribe(result=>{
      this.cashadvlist=result;
      console.log(this.cashadvlist);
    })
  }
  getFCAdvance(){
    this._cashAdvance.fetchForceRAdvance(this.paytrans.payeeName).subscribe(result=>{
      this.cashadvlist=result;
      console.log(this.cashadvlist);
    })
  }

  // disabledsave(paytransForm: NgForm){
  //   debugger;

  //     if(this.records == null ){
  //       paytransForm.form.valid == true;
  //     }else{
  //       paytransForm.form.valid == false;
  //     }
  // }

  getcatransactionType() {

    this._opex.getTransactionType()
      .subscribe(items => {
        this.catransactionTypeList = items;




      });

      if(this.catransactionTypeList != null){
         this.saveButtonDisabled = true;
      }
  }


  save( payftransForm: NgForm) {


    this.showMainSpinner();

    this.primengTableHelper.isLoading = true;
    if (this.paytrans.id==""|| this.paytrans.id == null) {
      this.saving = true;
      this.paytrans.tenantId = abp.session.tenantId;
      this.paytrans.attachId = this.attachId;
      this.paytrans.operationId = 26;
     //this.paytranslist.push(this.paytrans);
      this.varAmtCal();
      this._cashAdvance
        .createForceCashRetirement(this.paytrans)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {

          this.notify.info(this.l('SavedSuccessfully'));
         // this.message.info(this.l('SavedSuccessfully') + ' Ref: ' + r + ' and' + 'Sent For Approval');
          this.paytrans = new CreatePaymentTransactionDto();
        
        // this.initiateRequest();
        this.loadCARetirement();
         this.varAmtCal();
         this.paytrans.amount=this.totalAmount;
         this.paytrans.requestNumber=this.advno;
        
        });
      }
      else{
        this._cashAdvance
        .updateCashRetirement(this.paytrans)
        .subscribe(() => {

          this.notify.info('Updated Successfully');
          this.paytrans = new CreatePaymentTransactionDto();
          // this.paytranslist = [];
          this.loadCARetirement();
          this.varAmtCal();
          this.paytrans.amount=this.totalAmount;
          this.paytrans.requestNumber=this.advno;
          this.getDetails();
        });
      }
        this.hideMainSpinner();

        this.primengTableHelper.isLoading = false;
        payftransForm.resetForm();

  }

  getDetails(){
   this.getCDet();
  this.getCNamee();
  this.advno=this.paytrans.requestNumber;
  this. loadCARetirement();
  this.varAmtCal();
  }
  getCDet(){
    let ref =this.paytrans.requestNumber;
    //console.log(ref);
    this._cashAdvance.getAdvAmount(ref)
    .subscribe(items => {
      this.aAmount = items;
    console.log(this.aAmount);
  });

  }

  getDetailswithInt(){
    this._cashAdvance.getForceAdvAmountbyBen(this.paytrans.payeeName).subscribe(result=>{
      this.amtadvanced=result;
     })
  }
  getDetailswithRef(){
    this._cashAdvance.getForceAdvAmountbyRef(this.paytrans.requestNumber).subscribe(result=>{
      this.amtadvanced=result;
     })
  }

  loadCARetirement() {
    this.primengTableHelper.showLoadingIndicator();
    this._cashAdvance.getCashRetirement(this.advno
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
          this.primengTableHelper.totalRecordsCount = result.length;
          if(this.primengTableHelper.totalRecordsCount > 0){
             this.saveButtonDisabled  = true;
             this.initiateButtonDisable = false;
          }else{
             this.saveButtonDisabled =false;
            this.initiateButtonDisable = true;
          }
      this.primengTableHelper.records = result;
      this.records = result;
      //this.varAmtCal();
      this.primengTableHelper.hideLoadingIndicator();
       console.log(result);
    });



  }
  varAmtCal(){
    this._cashAdvance.sumARetired(this.paytrans.requestNumber).subscribe(result=>{
      this.totalAmount=result;
      if (this.aAmount>this.totalAmount){
        this.cAmount=this.aAmount-this.totalAmount;
        this.sAmount=0;
      }else{
          this.sAmount=this.totalAmount-this.aAmount;
          this.cAmount=0;
        }
      
    })



  }


  varAmtCalevt($event){
    debugger;
    this._cashAdvance.sumARetired(this.paytrans.requestNumber).subscribe(result=>{
      this.totalAmount=result;
      var eventAmt = +$event.target.value+this.totalAmount;
      if (this.aAmount>eventAmt){
        this.cAmount=this.aAmount-eventAmt;
        this.sAmount=0;
      }else{
          this.sAmount=eventAmt-this.aAmount;
          this.cAmount=0;
        }
        this.totalAmount=eventAmt;

      })
  }

  getAttach(){
    var getJSON = localStorage.getItem('attachId');
    if (getJSON){
        this.attachId = JSON.parse(getJSON)
    }
  }

  checkLocalstorage(){
    this.getAttach();
   if (this.attachId=== null ||this.attachId===undefined) {

     this._cashAdvance.getAttachId().subscribe( x => {
      var sendJSON = JSON.stringify(x);
this.attachId = x;
      localStorage.setItem('attachId',sendJSON)

    });


    }
    this.paytrans.attachId=this.attachId;
    
  
  
  }

  //To validate maximum amount
  checkmaxamount(){}

  //To Disable save button if payeetypeid and payeename are different vendors
  checkifvaluematched(requestNumber: string, payeeName: string, transactionTypeId: number){

     this._cashAdvance.checkSameTransType(requestNumber, payeeName,transactionTypeId).subscribe(result =>{
       let resultvalue = result
   

      if(  resultvalue == true ){
        this.saveButtonDisabled  = false;

        return this.saveButtonDisabled;


     }
      if(  resultvalue ==false  ){

            this._cashAdvance.isrecordexistforuser().subscribe(result => {

              let vvv = result

              if(vvv == false){
                this.saveButtonDisabled = false;
               
              }else{
                this.saveButtonDisabled = true;
                
              }
            })
            
     } 
  
     })
  }



  add(id?: any) {
    
  
  }



  addsplitcost(id?: any, amt?: number,transactiontypeid?:any,period?:any) {
    //let id = 0;
    debugger;
   this.splitCostModal.show(id, amt,transactiontypeid,period );


    this.splitcostprimengTableHelper.showLoadingIndicator();
    
      this._opex.getsplitcostList(id
        ).pipe(finalize(() => this.splitcostprimengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.splitcostprimengTableHelper.records = result;

      this.splitcostprimengTableHelper.hideLoadingIndicator();
       console.log(result);

    });

   }


   addworkflowroute(){





     //this.cashadvanceWorkflowRouteModal.show();
   }




  edit(f:CreatePaymentTransactionDto): void {

    this.paytrans.madeBy = f.madeBy;
    this.paytrans.id = f.id;
    this.paytrans.tenantId = f.tenantId;
    this.paytrans.narration = f.narration;
    this.paytrans.operationId = f.operationId;
    this.paytrans.payeeName = f.payeeName;
    this.paytrans.payeeTypeId = f.payeeTypeId;
    this.paytrans.requestDate = f.requestDate;
    this.paytrans.requestNumber = f.requestNumber;
    this.paytrans.taxAmount = f.taxAmount;
    this.paytrans.transactionTypeId = f.transactionTypeId;
    this.paytrans.whtAmount = f.whtAmount;
  }



}
