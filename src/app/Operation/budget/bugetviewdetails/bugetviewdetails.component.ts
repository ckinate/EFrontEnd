import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { BudgetManagerServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { BudgetviewdetailsmodalComponent } from './budgetviewdetailsmodal/budgetviewdetailsmodal.component';

@Component({
  selector: 'app-bugetviewdetails',
  templateUrl: './bugetviewdetails.component.html',
  styleUrls: ['./bugetviewdetails.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class BugetviewdetailsComponent  extends AppComponentBase implements OnInit, AfterViewInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  @ViewChild('budgetViewDetailsModal', { static: true }) budgetViewDetailsModal: BudgetviewdetailsmodalComponent;
  constructor(injector: Injector,
    

    private _bugetservice:BudgetManagerServiceServiceProxy
    
    
    ) {

super(injector);
}

  ngOnInit(): void {

    
 //this.viewbudget();


     
  }

  ngAfterViewInit(): void {



  }


  viewbudget(){
    this.primengTableHelper.showLoadingIndicator();
    this._bugetservice.viewApprovedBudget(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();
       console.log(result);
    });
    
   }

   viewabudgetdetails(refNo:any) {
    //let id = 0;

   
 
    this.budgetViewDetailsModal.show(refNo);
  
     
  
  
   }

}
