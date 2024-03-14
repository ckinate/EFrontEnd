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
    BudgetManagerServiceServiceProxy,
    CompanyStructureDto,
    CompanyStructureServiceProxy,
    MultipleBeneficiariesDto,
    MultipleBeneficiaryUsersDto,
    OperatingExpenseServiceServiceProxy,
    PostResultDto,
} from "@shared/service-proxies/service-proxies";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Table } from "primeng/table";
import { finalize } from "rxjs/operators";
import * as XLSX from "xlsx";
import { AppConsts } from "@shared/AppConsts";
import { exit } from "process";
var ittems;
@Component({
    selector: "multipleBeneficiaryModal",
    templateUrl: "./multiplebeneficiarymodal.component.html",
    styleUrls: ["./multiplebeneficiarymodal.component.css"],
})
export class MultiplebeneficiarymodalComponent
    extends AppComponentBase
    implements OnInit {
    @Output("getTotalAmount") getTotalAmount: EventEmitter<
        any
    > = new EventEmitter<any>();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    active = false;

    multiplebeneficiary: MultipleBeneficiariesDto = new MultipleBeneficiariesDto();
    saving = false;

    //  taxtrans:  CreateTaxTransactionDto = new CreateTaxTransactionDto();

    multiplebeneficiaryForm: NgForm;
    multiplebeneficiaryuploadForm: NgForm;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    primengTableHelper = new PrimengTableHelper();
    //taxList: TaxationDto[] = [];
    paytransId: any;
    TransactionAmount: 0;
    totalAmount: number;
    departList: CompanyStructureDto[] = [];
    beneficiaryUsers: MultipleBeneficiaryUsersDto[] = [];

    transtypeId: any;
    requestDate: any;

    storeData: any;
    csvData: any;
    jsonData: any;
    textData: any;
    htmlData: any;
    fileUploaded: File;
    worksheet: any;
    results: any;
    multiBeneficiaryUploaded: any;
    @ViewChild("uploadItem", { static: true }) uploadItem: any;
    documentLoaded = true;
    createMultiBeneficiaryList: MultipleBeneficiariesDto[] = [];
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
        this.multiplebeneficiary.amount = 1;
        this.GetBeneficiaryUsers();
        this.templateUrl =
            AppConsts.appBaseUrl +
            "/assets/Templates/multiBeneficiaryTemplate.xlsx";
    }

    show(id: any, totalamount: any): void {
        this.active = true;
        this.paytransId = id;

        this.loadMultiBeneficiary(this.paytransId);

        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    onShown(): void {}

    save(multiplebeneficiaryForm: NgForm) {
        let cnt = 0;
        
        this._opex
            .getBeneficiaryDetails(3, this.multiplebeneficiary.userName)
            .subscribe((x) => {
                console.log(x);
                if (x.length == 0) {
                    this.multiplebeneficiary.userName = "";
                    this.message.error(
                        "Kindly contact administrator to maintain bank details of the payee",
                        "Missing Bank Details"
                    );

                    exit;
                } else {
                    if (
                        this.TransactionAmount +
                            this.multiplebeneficiary.amount >
                        this.totalAmount
                    ) {
                        let v =
                            this.multiplebeneficiary.amount +
                            this.TransactionAmount;
                        this.message.error(
                            "Amount splitting (" +
                                v.toString() +
                                ") cannot be greater than the total amount" +
                                this.totalAmount.toString(),
                            "Error"
                        );
                    } else {
                        // if (this.bensplitcost.id === 0 || this.bensplitcost.id == null) {
                        this.saving = true;
                        this.multiplebeneficiary.tenantId =
                            abp.session.tenantId;
                        this.multiplebeneficiary.paymentTransactionId = this.paytransId;

                        this._opex
                            .createMultipleBeneficiary(this.multiplebeneficiary)
                            .pipe(
                                finalize(() => {
                                    this.saving = false;
                                })
                            )
                            .subscribe(() => {
                                this.notify.info(this.l("SavedSuccessfully"));
                                this.loadMultiBeneficiary(this.paytransId);
                                this.multiplebeneficiary.amount = 0;
                                this.multiplebeneficiary = new MultipleBeneficiariesDto();
                                //this. loadTaxation();

                                // this.approvalLevel = new CreateApprovalLevelDto();
                            });

                        multiplebeneficiaryForm.resetForm();
                    }
                }
            });
    }

    loadMultiBeneficiary(id?: any) {
        this.primengTableHelper.showLoadingIndicator();
        this._opex
            .getMultiBeneficiary(this.paytransId)
            .pipe(
                finalize(() => this.primengTableHelper.hideLoadingIndicator())
            )
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.length;
                this.primengTableHelper.records = result;
                ittems = result;
                this.primengTableHelper.hideLoadingIndicator();
                //console.log(result)

                result.forEach((p) => {
                    this.TransactionAmount += p.amount;
                });

                var i = result.reduce((i, x) => i + x.amount, 0);

                this.getTotalAmount.emit(i);
            });
    }

    GetBeneficiaryUsers() {
        this._opex.beneficiaryUsers().subscribe((result) => {
            this.beneficiaryUsers = result;
        });
    }

    DeleteItem(id: any) {
        debugger;
        this._opex.removeMultipleBeneficiary(id).subscribe(() => {
            this.notify.success("Item remove successfully", "Item Deletion");
            this.loadMultiBeneficiary(this.paytransId);
        });
    }

     uploadedFile(multiplebeneficiaryuploadForm: NgForm) {
        this.uploadItem;
        this.fileUploaded = this.uploadItem.nativeElement.files[0];
        this.documentLoaded = false;
        if (this.fileUploaded === undefined) {
            this.documentLoaded = true;
        }

         this.readExcel();
        
        this.processTransaction();

        multiplebeneficiaryuploadForm.resetForm();
    }

    processTransaction() {
        if (this.createMultiBeneficiaryList.length > 0) {
            this._opex
                .createMultipleBeneficiaryList(this.createMultiBeneficiaryList)
                .pipe(
                    finalize(() => {
                        this.saving = false;
                    })
                )
                .subscribe((x: PostResultDto) => {
                    this.documentLoaded = true;
                    if (x.responseCode === "00") {
                        this.notify.info(this.l("SavedSuccessfully"));
                        this.message.info(this.l("SavedSuccessfully"));
                        this.loadMultiBeneficiary(this.paytransId);
                    } else {
                        this.message.error(
                            this.l("NotSuccessful") + x.responseDetails
                        );
                    }

                    this.results = "";

                    this.createMultiBeneficiaryList = [];
                });
        }
    }


    readExcel() {
      this.message.confirm(
        this.l("Beneficiary Upload"),
        this.l("AreYouSure"),
        (isConfirmed) => {
            if (isConfirmed) {
              this.documentLoaded = true;
              this.saving = true;
              
              let fileReader = new FileReader();
              fileReader.onload = async (e) => {
                this.storeData = fileReader.result;
                let data = new Uint8Array(this.storeData);
                let arr = new Array();
                for (let i = 0; i !== data.length; ++i) {
                  arr[i] = String.fromCharCode(data[i]);
                }
                let bstr = arr.join("");
                let workbook = XLSX.read(bstr, { type: "binary" });
                //Change sheet here
                let first_sheet_name = workbook.SheetNames[0];
                let worksheet = workbook.Sheets[first_sheet_name];
                this.results = XLSX.utils.sheet_to_json(worksheet, {
                  raw: true,
                });
                
                this.createMultiBeneficiaryList = [];
                let listofAccount = '';
                let valid = true;
                
                await Promise.all(this.results.map(async (a) => {
                  let postItem: MultipleBeneficiariesDto = new MultipleBeneficiariesDto();
                
                  postItem.userName = a["AccountNumber"];
                  postItem.amount = a["Amount"];
                  postItem.paymentTransactionId = this.paytransId;
                  
                  
                  const x = await this._opex.getBeneficiaryDetails(3, postItem.userName).toPromise();
                  if (x.length == 0) {
                    this.multiplebeneficiary.userName = "";
                    listofAccount += postItem.userName + ', ';
                    valid = false;
                  }
                  
                  postItem.tenantId = abp.session.tenantId;
                  
                  this.createMultiBeneficiaryList.push(postItem);
                  
                  return null
                }))
                if (valid) {
                    this.processTransaction();
                } else {

                    this.message.error(
                        "Kindly contact administrator to maintain bank details of the following payee(s) " +
                        listofAccount.slice(0, listofAccount.length-1),
                        "Missing Bank Details"
                        );

                }
               
              };
              
              fileReader.readAsArrayBuffer(this.fileUploaded);
              this.uploadItem.nativeElement.value = null;
              this.saving = false;
            }
        }
      );
    }

    // readExcel() {
    //     this.message.confirm(
    //         this.l("Beneficiary Upload"),
    //         this.l("AreYouSure"),
    //         (isConfirmed) => {
    //             if (isConfirmed) {
    //                 this.documentLoaded = true;
    //                 this.saving = true;

    //                 let fileReader = new FileReader();
    //                 fileReader.onload = (e) => {
    //                     this.storeData = fileReader.result;
    //                     let data = new Uint8Array(this.storeData);
    //                     let arr = new Array();
    //                     for (let i = 0; i !== data.length; ++i) {
    //                         arr[i] = String.fromCharCode(data[i]);
    //                     }
    //                     let bstr = arr.join("");
    //                     let workbook = XLSX.read(bstr, { type: "binary" });
    //                     //Change sheet here
    //                     let first_sheet_name = workbook.SheetNames[2];
    //                     let worksheet = workbook.Sheets[first_sheet_name];
    //                     this.results = XLSX.utils.sheet_to_json(worksheet, {
    //                         raw: true,
    //                     });

    //                     this.createMultiBeneficiaryList = [];

    //                     console.log("1");

    //                     this.results.forEach((a) => {
    //                         let postItem: MultipleBeneficiariesDto = new MultipleBeneficiariesDto();

    //                         postItem.userName = a["AccountNumber"];
    //                         postItem.amount = a["Amount"];
    //                         postItem.paymentTransactionId = this.paytransId;

    //                         console.log(2);
    //                         this._opex
    //                             .getBeneficiaryDetails(3, postItem.userName).
    //                             .t((x) => {
    //                                 if (x.length == 0) {
    //                                     this.multiplebeneficiary.userName = "";
    //                                     this.message.error(
    //                                         "Kindly contact administrator to maintain bank details of the payee " +
    //                                             postItem.userName,
    //                                         "Missing Bank Details"
    //                                     );
    //                                 }

    //                                 postItem.tenantId = abp.session.tenantId;

    //                                 this.createMultiBeneficiaryList.push(
    //                                     postItem
    //                                 );
    //                                 console.log(3);
    //                             });
    //                     });

    //                     console.log(4);
    //                 };

    //                 fileReader.readAsArrayBuffer(this.fileUploaded);
    //                 this.uploadItem.nativeElement.value = null;
    //                 this.saving = false;
    //             }
    //         }
    //     );
    // }
}
