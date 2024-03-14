import {
    Component,
    EventEmitter,
    Injector,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import {
    CreateBeneficiarySplitCostDto,
    OperatingExpenseServiceServiceProxy,
    CompanyStructureServiceProxy,
    CompanyStructureDto,
    BudgetManagerServiceServiceProxy,
    CalculateSpiltCostBudgetDto,
    PostResultDto,
    UnitViewDto,
    PayeeNameViewDto,
} from "@shared/service-proxies/service-proxies";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Table } from "primeng";
import { finalize } from "rxjs/operators";
import * as XLSX from 'xlsx';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: "splitCostModal",
    templateUrl: "./splitcostmodal.component.html",
    styleUrls: ["./splitcostmodal.component.css"],
})
export class SplitcostmodalComponent
    extends AppComponentBase
    implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    active = false;

    bensplitcost: CreateBeneficiarySplitCostDto = new CreateBeneficiarySplitCostDto();
    saving = false;
    unitDetail = new UnitViewDto();
    unitDetails: UnitViewDto[] = [];
    //  taxtrans:  CreateTaxTransactionDto = new CreateTaxTransactionDto();

    splitcostForm: NgForm;
    splitcostUploadForm: NgForm;
    @ViewChild("splitcostdataTable", { static: true })
    splitcostdataTable: Table;
    splitcostprimengTableHelper = new PrimengTableHelper();
    //taxList: TaxationDto[] = [];
    paytransId: any;
    TransactionAmount: 0;
    totalAmount: number;
    departList: CompanyStructureDto[] = [];

    calculatebuget = new CalculateSpiltCostBudgetDto();
    transtypeId: any;
    requestDate: any;
    percentaageAmount:any;

    storeData: any;
    csvData: any;
    jsonData: any;
    textData: any;
    htmlData: any;
    fileUploaded: File;
    worksheet: any;
    results: any;
    splitCostuploaded: any;
    @ViewChild('uploadItem', { static: true }) uploadItem: any;
    documentLoaded = true;
    createSplitCostList: CreateBeneficiarySplitCostDto[] = [];
    templateUrl: string;

    constructor(
        injector: Injector,
        private _opex: OperatingExpenseServiceServiceProxy,
        private _department: CompanyStructureServiceProxy,
        private _bugetservice: BudgetManagerServiceServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.bensplitcost.amount = 1;
        this.getDepartments("");
        this.templateUrl = AppConsts.appBaseUrl + '/assets/Templates/splitCostTemplate.xlsx';
    }

    show(id: any, amt: number, transactiontypeid: any, period: any, rate: number = 1): void {
        this.active = true;
        this.paytransId = id;

        this.totalAmount = amt * rate;
        this.transtypeId = transactiontypeid;
        this.requestDate = period;
        //this.loadRole(id);
        this.loadSplitCost(this.paytransId);

        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    onShown(): void {}

    getDepartments(search: any) {
        console.log(search);
        // this._department.getAllBusinessUnits(search).subscribe((s) => {
        //     this.departList = s.;
        // });
            this._department.companyStructureList().subscribe((s) => {
            this.departList = s;
        });
    }
    selectDepartment(dept: any) {
        this.bensplitcost.department = dept;
        this.bensplitcost.amount = 0;
        //let budamount=  event.tar.value;
        this.CalculateBudgetUsed(dept);
    }

    getAmount(event){

        this.bensplitcost.amount=  (Number(event)/100)* Number(this.totalAmount);
    }

    getPercentage(event){
        this.percentaageAmount=(Number(event)/ Number(this.totalAmount))*100
    }

    CalculateBudgetUsed(miscode: any) {
        this._opex
            .checkBudgetUpload(
                this.transtypeId,
                this.requestDate,
                miscode,
                this.paytransId
            )
            .subscribe((result) => {
                this.calculatebuget = result;
            });

    }

    DeleteItem(id: any) {
        this._opex.removeBeneficiarySplitCost(id).subscribe(() => {
            this.notify.success("Item remove successfully", "Item Deletion");
            this.loadSplitCost(this.paytransId);
        });
    }

    save(splitcostForm: NgForm) {
        //department
        this.departList = this.departList.filter(
            proj => proj.customCode === this.bensplitcost.department);
            this.departList.forEach(i => {
                this.unitDetail.id = i.id;
                this.unitDetail.name = i.customCode;
        });

            let i: UnitViewDto[] = [];
            i.push(this.unitDetail);
            this._opex.checkforUnitrestriction(i).subscribe((s) => {
                if (s == true) {
                    this.message.error(this.l('This Staff with MIS Code'+' '+ this.unitDetail.name+ ' ' + 'has been restricted! Kindly contact the Administrator'));
                    i = [];
                    this.getDepartments("");
                    return;
                } else {
                    this.saveSplitcosts(splitcostForm);
                    this.getDepartments("");
                }
            }, (error)=>{
                this.saving = false;
                this.getDepartments("");
            });

    }

    saveSplitcosts(splitcostForm){
        let transamount: number = Number(this.TransactionAmount.toString());
        let beneamount: number = +this.bensplitcost.amount;

        if (beneamount == 0) {
            this.message.error("Amount cannot be zero", "Error");
            return;
        }

        if (transamount + beneamount > this.totalAmount) {
            let v = transamount + beneamount;
            this.message.error(
                "Amount splitting ( " +
                    v.toString() +
                    " ) cannot be greater than the total amount " +
                    this.totalAmount.toString(),
                "Error"
            );
            return;
        }
        // if (this.bensplitcost.id === 0 || this.bensplitcost.id == null) {
        this.saving = true;
        this.bensplitcost.tenantId = abp.session.tenantId;
        this.bensplitcost.paymentId = this.paytransId;
        this.bensplitcost.budgetTotalAmount = this.calculatebuget.budgetTotalAmount;
        this.bensplitcost.budgetUsedAmount = this.calculatebuget.budgetUsedAmount;
        this.bensplitcost.availableBudget = this.calculatebuget.availableBudgetAmount;
        this.bensplitcost.budgetInUse=this.calculatebuget.budgetInUse;
        this.bensplitcost.percent =  this.percentaageAmount;
      

        this._opex
            .createBeneficiarySplitCost(this.bensplitcost)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.loadSplitCost(this.paytransId);
                this.bensplitcost.amount = 0;
            });

        splitcostForm.resetForm();
        this.loadSplitCost(this.paytransId);
    }


    loadSplitCost(id?: any) {
        // if (this.primengTableHelper.shouldResetPaging(event)) {
        //     this.paginator.changePage(0);

        //     return;
        // }
        this.splitcostprimengTableHelper.showLoadingIndicator();
        this._opex
            .getsplitcostList(this.paytransId)
            .pipe(
                finalize(() =>
                    this.splitcostprimengTableHelper.hideLoadingIndicator()
                )
            )
            .subscribe((result) => {
                this.splitcostprimengTableHelper.records = result;
                this.splitcostprimengTableHelper.hideLoadingIndicator();
                this.TransactionAmount = 0;
                result.forEach((p) => {
                    this.TransactionAmount += p.amount;
                });
            });

        this.bensplitcost.amount = 0;
    }



    uploadedFile(splitcostUploadForm: NgForm) {

        debugger;
        this.uploadItem;
        this.fileUploaded = this.uploadItem.nativeElement.files[0];
        this.documentLoaded = false;
        if (this.fileUploaded === undefined) {
          this.documentLoaded = true;
        }

        this.readExcel();

        splitcostUploadForm.resetForm();

      }






      readExcel() {
        this.message.confirm(
            this.l("Cost Sharing Upload"),
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



                        this.createSplitCostList = [];

                        this.results.forEach(a => {
                          let postItem: CreateBeneficiarySplitCostDto = new CreateBeneficiarySplitCostDto();

                          postItem.department = a['MIS'];
                          postItem.amount = a['Amount'];
                          postItem.paymentId=this.paytransId;

                          let n: UnitViewDto = new UnitViewDto();
                          n.name = a['MIS'];
                          this.unitDetails.push(n);
                          postItem.tenantId=abp.session.tenantId;

                          this.createSplitCostList.push(postItem);


                        });

                        this._opex.checkforUnitrestriction(this.unitDetails).subscribe((s) => {
                            if (s == true) {
                                this.message.error(this.l('Some of the Staffs has been restricted! Kindly contact the Administrator'));
                                this.unitDetails = [];
                                return;
                            } else {
                                this._opex.createBeneficiarySplitCostList(this.createSplitCostList)
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
                                            this.loadSplitCost(this.paytransId);




                                          } else {
                                            this.message.error(this.l('NotSuccessful') + x.responseDetails);


                                          }

                                          this.results = "";


                                        this.createSplitCostList = [];


                                  }
                                );
                            }
                        });

                      };


                      fileReader.readAsArrayBuffer(this.fileUploaded);
                      this.uploadItem.nativeElement.value = null;






                }
            }
        );



    }

}
