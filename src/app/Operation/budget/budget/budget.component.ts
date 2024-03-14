import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { BudGetDto,  BudgetManagerServiceServiceProxy, ChartOfAccountDto, ChartofAccountServiceServiceProxy, CreateBudGetDto, PostResultDto } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { AppConsts } from '@shared/AppConsts';

@Component({

  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class BudgetComponent  extends AppComponentBase implements OnInit, AfterViewInit {


  
  saving = false;
  chartOfAcct: ChartOfAccountDto[] = [];
 // transactionType: TransactionTypeDto[] = [];
  records: BudGetDto[] = [];

  budgetForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  budget:  CreateBudGetDto = new   CreateBudGetDto();
  createbudget: CreateBudGetDto[] = [];
  maincreatebudget: CreateBudGetDto[] = [];
  @ViewChild('uploadItem', { static: true }) uploadItem: any;

  storeData: any;
    csvData: any;
    jsonData: any;
    textData: any;
    htmlData: any;
    fileUploaded: File;
    worksheet: any;
    results: any;
    Budgetuploaded: any;

    templateUrl: string;
    documentLoaded = true;
    initiateButtonDisable = true;

  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _bugetservice:BudgetManagerServiceServiceProxy
    
    
   
    ) {

super(injector);
}

  ngOnInit(): void {
  //  this. fetchBudgetLevel();
   this.loadBudget();
   this.templateUrl = AppConsts.appBaseUrl + '/assets/Templates/budgetTemplate.xlsx';
    //this.documentLoaded=true;
  }

  ngAfterViewInit(): void {



  }


  uploadedFile(uploadBudget: NgForm) {
   
    debugger;
    this.uploadItem;
    this.fileUploaded = this.uploadItem.nativeElement.files[0];
    this.documentLoaded = false;  
    if (this.fileUploaded === undefined) {
      this.documentLoaded = true; 
    }
  
    this.readExcel();
   
    uploadBudget.resetForm();

  }
 





  readExcel() {
    this.message.confirm(
        this.l("Budget Upload"),
        this.l("AreYouSure"),
        (isConfirmed) => {
            if (isConfirmed) {
                
              this.documentLoaded = true;
             this.saving = true;
                
                 
                  let fileReader = new FileReader();
                  fileReader.onload = (e) => {
                    this.storeData = fileReader.result;
                    let data = new Uint8Array(this.storeData);
                    let arr = new Array();
                    for (let i = 0; i !== data.length; ++i) { 
                      arr[i] = String.fromCharCode(data[i]); 
                    }
                    let bstr = arr.join('');
                    let workbook = XLSX.read(bstr, { type: 'binary' });
                    let first_sheet_name = workbook.SheetNames[0];
                    let worksheet = workbook.Sheets[first_sheet_name];
                    this.results = XLSX.utils.sheet_to_json(worksheet,
                       { raw: true,
                      });

              
                    
                    this.createbudget = [];
                    
                    this.results.forEach(a => {
                      let postItem: CreateBudGetDto = new CreateBudGetDto();
              
                      postItem.budgetAmount = a['BudgetAmount'];
                      postItem.budgetPeriod = a['BudgetPeriod'];
                     
                      postItem.gl= a['GL'];
                      postItem.misCode= a['MisCode'];
                      postItem.activity= a['Activity'];
                     
                      this.createbudget.push(postItem);
                    });
              
              
                      
              
              
                    this._bugetservice.createBudget(this.createbudget)
                    .pipe(
                      finalize(() => 
                      {  this.saving=false })
                      )
                    .subscribe(
                      (x: PostResultDto) => {
                
                        this.documentLoaded = true;
                              if (x.responseCode === '00') {
                              
                                this.notify.info(this.l('SavedSuccessfully'));
                                this.message.info(this.l('SavedSuccessfully'));
                                this.loadBudget();
                          
                                
                                
                        
                              } else {
                                this.message.error(this.l('NotSuccessful') + x.responseDetails);
                                
                        
                              }
                        
                              this.results = "";
                        

                            this.createbudget = [];
                          
                
                      }
                    );
                 
              
                 
                  };
                  
                
                  fileReader.readAsArrayBuffer(this.fileUploaded);
                  this.uploadItem.nativeElement.value = null;
                   
                 
                
                
                
                
            }
        }
    );


   
}



 
    sendForApproval(){
      this.primengTableHelper.isLoading = true;
      this.message.confirm( 'You Want to Send Budget for Approval',    
      this.l('AreYouSure'),
      isConfirmed => {
        if (isConfirmed) {
  
  
      this._bugetservice
        .sendBudgetforApproval()
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe((r) => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.message.info(this.l('Budget Successful Sent For Approval with ') + ' Ref: ' + r );
          this.loadBudget();
          this.budget = new CreateBudGetDto();
   
        
        });
  
      }
    });
  this.primengTableHelper.isLoading =false;
    }


  //  loadBudget(){
     
    
  //   this._bugetservice.getBudget(
  //   ).subscribe(result => {

  //     this.records = result;
      

  //      this.documentLoaded=true;
  //   });
  //  }
   loadBudget(){
     
    this.primengTableHelper.showLoadingIndicator();
    this._bugetservice.getBudget(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
          this.primengTableHelper.totalRecordsCount = result.length;
          if(this.primengTableHelper.totalRecordsCount > 0){
          
             this.initiateButtonDisable = false;
          }else{
          
            this.initiateButtonDisable = true;
          }
      this.primengTableHelper.records = result;
    
      this.primengTableHelper.hideLoadingIndicator();
      this.records = result;
      this.documentLoaded=true;
      // console.log(result);
   
   });
  }


  

  delete(accmap: BudGetDto): void {

    this.message.confirm(
        this.l('Do you want to delete this record?'),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._bugetservice.deleteBudget(accmap.id).subscribe(() => {
                   // this.reloadPage();
                   this. loadBudget()
                    this.notify.success(this.l('Successfully Disabled'));
                    this.budget = new CreateBudGetDto();
                    this.documentLoaded = true;
                    
                });
            }
        }
        
    );
  
  }

  deleteAll(): void {

    this.message.confirm(
        this.l('Do you want to delete all this record?'),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._bugetservice.deleteAllBudget().subscribe(() => {
                   // this.reloadPage();
                   this. loadBudget()
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    this.budget = new CreateBudGetDto();
                    this.documentLoaded = true;
                    
                });

            }
        }
        
    );
  
  }
 


}
