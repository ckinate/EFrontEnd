import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { ChartofAccountServiceServiceProxy, CreateWorkflowRouteDto, GeneralOperationsServiceServiceProxy, OperationsDto, RoleUserMappingDto, RoutingTableView, UserListDto, UserServiceProxy, WorkflowMappingDto, WorkflowRoleDto, WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'opexWorkflowRouteModal',
  templateUrl: './opexworkflowroutemodal.component.html',
  styleUrls: ['./opexworkflowroutemodal.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]

})
export class OpexworkflowroutemodalComponent extends AppComponentBase implements OnInit {

  opexrouteForm : NgForm;
  saving = false;



  
  roleName: WorkflowRoleDto[]=[];
  paytransactionId: any;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modal' , {static: true}) modal: ModalDirective;

  active = false;
  
  @Output() loadtaxTransaction: EventEmitter<any> = new EventEmitter<any>();

  amount: number = 0;
  rate:number;

  userstoroute:RoleUserMappingDto []=[]
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();

  selectedoperationId :any;
  

  workflowroute : CreateWorkflowRouteDto = new CreateWorkflowRouteDto();
  operationList: OperationsDto[] = [];
 records: RoutingTableView[]=[];
  staffuser: UserListDto[] = [];
  staffreturnbylevel: RoleUserMappingDto[] = [];
  levelfromWorkflowMapping: WorkflowMappingDto[]=[];
 

  isrolealreadyselected = false;
  

  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _workflowService: WorkflowServiceServiceProxy,
    private _operationService: GeneralOperationsServiceServiceProxy,
    private _stafService: UserServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
    ) {

super(injector);
}

  ngOnInit(): void {
    this.getOperation();
   
    this.getStaff();
   // this.getLevels();


    this._activatedRoute.queryParams.subscribe(params =>{
      this.selectedoperationId = params['OPD']
       console.log(this.selectedoperationId)
   
    });
  }

  show(): void {
    this.active = true;
       this._activatedRoute.queryParams.subscribe(params =>{
      this.selectedoperationId = params['OPD']
  
   
    });
       
      this._workflowService.loadLevelsMappedtoOperation( this.selectedoperationId).subscribe(result =>{
        this.levelfromWorkflowMapping = result;
        console.log(this.levelfromWorkflowMapping)
      })


      this.loadworkflowRoute()
  
   
    this.modal.show();
  }
  
  
close(): void {
  this.modal.hide();
  this.active = false;
}

  onShown(): void {

  }

  getStaff() {
  
  
    this._stafService.getUserList()
      .subscribe(items => {
        this.staffuser = items;
        for (let user of this.staffuser) {
          user['custom'] = user.firstName + ' ' + user.lastName;
        }
  
        // console.log(items);
        // console.log(this.staffuser);
      });
  }

  getLevels(id?: number){
     
    id = this.selectedoperationId;
    this._workflowService.loadLevelsMappedtoOperation( id).subscribe(result =>{
      this.levelfromWorkflowMapping = result;
      console.log(this.levelfromWorkflowMapping)
    })

    
  }

  
  getusermappedtolevel( levelId: number,id?:number, ){
    id =  this.selectedoperationId;
    

      this._workflowService.validateifRoleAlreadySelected(levelId,id).subscribe( result=>{
        
        this.isrolealreadyselected = result;

        if(this.isrolealreadyselected == false){
         
          this._workflowService.getUserByLevelId(levelId,id).subscribe(result =>{
          this.staffreturnbylevel = result;
          console.log(this.staffreturnbylevel);
         })
       }
       else{
     this.message.info("Level Already Added to Grid Please select another level");
     this. workflowroute.roleId = null;
      }
      }
      
      )
     
     
    


    
  }
  

  userstoRouteRequest(id: any){
    this._workflowService.loadFirstReportingLineToRouteRequest(id).subscribe(result => {
      this.userstoroute = result;

      //console.log(this.userstoroute);
    })
    this.getRoleName(id);
  }


  getRoleName(id: number){
     

    this._workflowService.getRoleName(id).subscribe(result =>{
      this.roleName = result;
    })

    
  }

  onselect(e){
      console.log(e.target.value);

  }


  save( opexrouteForm: NgForm) {
    
    
    this.saving = true;
    this.workflowroute.tenantId = abp.session.tenantId;
    this.workflowroute.operationId = this.selectedoperationId;
    this._workflowService
    .createRoute(this.workflowroute)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {

        this.notify.info(this.l('SavedSuccessfully'));
        this.workflowroute= new CreateWorkflowRouteDto();
      
       //this.loadPayTransaction();
       this.loadworkflowRoute();
    
        // this.approvalLevel = new CreateApprovalLevelDto();
      });


  
      opexrouteForm.resetForm();

}


loadworkflowRoute(){

  // this._workflowService.getWrkflowRouteforLoginUser().subscribe(result => {

  // })


  this.primengTableHelper.showLoadingIndicator();
  this._workflowService.getWrkflowRouteforLoginUser().pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.length;
       
    this.primengTableHelper.records = result;
    
    this.primengTableHelper.hideLoadingIndicator();
     console.log(result);
  });

//   this._workflowService.getLevelsDefined(id).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
//     this.primengTableHelper.totalRecordsCount = result.length;
   
// this.records = result;

// this.primengTableHelper.hideLoadingIndicator();
//  console.log(this.records);
// });

}

getOperation() {
  
  this._operationService.getListOperation()
    .subscribe(items => {
      this.operationList = items;
     

 
    });
}



}
