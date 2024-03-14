import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { CompanyStructureServiceProxy, MisDeactivationDurationDto } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mis-deactivation-criteria',
  templateUrl: './mis-deactivation-criteria.component.html',
  styleUrls: ['./mis-deactivation-criteria.component.css']
})
export class MisDeactivationCriteriaComponent extends AppComponentBase implements OnInit, AfterViewInit {

  deactivateForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
 saving = false;
//defautcurrencydto: DefaultCurrencyDto = new DefaultCurrencyDto();

record: MisDeactivationDurationDto[] = [];
itemToInsert: MisDeactivationDurationDto = new MisDeactivationDurationDto();

  constructor(injector: Injector,

    private _compnaystructureServie: CompanyStructureServiceProxy


    ) {

super(injector);
}


ngOnInit(): void {
this.loadMisDurationDropdown();
 this.loadMisDeactivationDuration() ;
}

ngAfterViewInit(): void {



}



loadMisDurationDropdown() {
  
  this.primengTableHelper.showLoadingIndicator();
  this._compnaystructureServie.getMisDurationDropdown(
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.record = result;
    this.primengTableHelper.hideLoadingIndicator();



  });
}

edit(f:MisDeactivationDurationDto): void {

  this.itemToInsert.description= f.description;
  this.itemToInsert.id = f.id;
  this.itemToInsert.conditionNumber = f.conditionNumber;
  this.itemToInsert.duration = f.duration;


}
save(currencyForm: NgForm) {
   

    this.saving = true;
    //this.currencydto.tenantId = abp.session.tenantId;
    this._compnaystructureServie
      .misDeactivationCriteria(this.itemToInsert)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {

        this.notify.info(this.l('SavedSuccessfully'));
        this.loadMisDurationDropdown();
     this.loadMisDeactivationDuration() ;
        this.itemToInsert = new MisDeactivationDurationDto();
        
      });


 
      this.deactivateForm.resetForm();

}


loadMisDeactivationDuration() {


  this.primengTableHelper.showLoadingIndicator();
  this._compnaystructureServie.getMisDeactivationDurationList(
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.primengTableHelper.records = result;
    
    this.primengTableHelper.hideLoadingIndicator();


  });
}







activate(br:MisDeactivationDurationDto) {
  this.message.confirm(
      this.l('Activate'),
      this.l('Are You Sure'),
      isConfirmed => {
          if (isConfirmed) {

              this._compnaystructureServie.activateMisDeactivationCriteria(br).subscribe(() => {
                  this.notify.success(this.l('Successfully Activated'));
                  this.loadMisDurationDropdown();
                  this.loadMisDeactivationDuration() ;

              });
          }
      }
  );

}
delete(br:MisDeactivationDurationDto) {
  this.message.confirm(
      this.l('Deactivate'),
      this.l('Are You Sure'),
      isConfirmed => {
          if (isConfirmed) {

              this._compnaystructureServie.deactivateMisDeactivationCriteria(br).subscribe(() => {
                  this.notify.success('Successfully Deactivated');
                  this.loadMisDurationDropdown();
                 this.loadMisDeactivationDuration() ;

              });
          }
      }
  );

}






}

