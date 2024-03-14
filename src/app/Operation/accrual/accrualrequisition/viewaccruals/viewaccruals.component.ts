import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { AccrualRequisitionDetailsDto, AccrualServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { AccrualviewdetailsmodalComponent } from './accrualviewdetailsmodal/accrualviewdetailsmodal.component';

@Component({
  selector: 'app-viewaccruals',
  templateUrl: './viewaccruals.component.html',
  styleUrls: ['./viewaccruals.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class ViewaccrualsComponent  extends AppComponentBase implements OnInit, AfterViewInit{


  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  @ViewChild('accrualViewDetailsmodal', { static: true }) accrualViewDetailsmodal: AccrualviewdetailsmodalComponent;
 // accperiod: AccrualPeriodDto[] = [];
 // accreqdetails: AccrualRequisitionDetailsDto[] = [];
  constructor(injector: Injector,


    private _accservice: AccrualServiceServiceProxy,


    ) {

super(injector);
}

  ngOnInit(): void {


 this.viewAccrual();



  }

  ngAfterViewInit(): void {



  }


  viewAccrual(){
    this.primengTableHelper.showLoadingIndicator();
    this._accservice.viewAccrualRequisitionDetails(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();
      console.log(result);
    });

   }

   viewaccrualrequisitiondetails(refNo:any) {
    //let id = 0;



    //this.accrualViewDetailsmodal.show();




   }

}
