import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { RoleListDto, RoleServiceProxy, PermissionServiceProxy, FlatPermissionDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { CreateOrEditRoleModalComponent } from './create-or-edit-role-modal.component';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import { filter as _filter } from 'lodash-es';
import { finalize } from 'rxjs/operators';
import { PermissionTreeModalComponent } from '../shared/permission-tree-modal.component';
import { ViewRolePermissionComponent } from './view-role-permission/view-role-permission.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { WorkflowRoleMetricsComponent } from './workflow-role-metrics/workflow-role-metrics.component';
@Component({
    templateUrl: './roles.component.html',
    animations: [appModuleAnimation()]
})
export class RolesComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditRoleModal', { static: true }) createOrEditRoleModal: CreateOrEditRoleModalComponent;
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('permissionFilterTreeModal', { static: true }) permissionFilterTreeModal: PermissionTreeModalComponent;
    @ViewChild('viewRoleModal', { static: true }) viewRoleModal: ViewRolePermissionComponent;
    @ViewChild('workflowRoleMetrics', { static: true }) workflowRoleMetrics: WorkflowRoleMetricsComponent;

    _entityTypeFullName = 'FinTrakERP.Authorization.Roles.Role';
    entityHistoryEnabled = false;
user = '';
roleId = 0;
    constructor(
        injector: Injector,
        private _roleService: RoleServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _userService: UserServiceProxy,
    ) {
        super(injector);
    }
    getAllUsers(){

        
        this._userService.getUserForEdit(this.appSession.user.id).subscribe((result)=>{
            this.roleId = result.roles.filter(x => x.isAssigned)[0].roleId;
console.log(this.roleId);

           
        })
    }
    ngOnInit(): void {
        this.user = this.appSession.user.userName;
        this.setIsEntityHistoryEnabled();
        this.getAllUsers();

    }

    private setIsEntityHistoryEnabled(): void {
        let customSettings = (abp as any).custom;
        this.entityHistoryEnabled = customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    getRoles(): void {
        this.primengTableHelper.showLoadingIndicator();
        let selectedPermissions = this.permissionFilterTreeModal.getSelectedPermissions();

        this._roleService.getRoles(selectedPermissions)
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.items.length;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    createRole(): void {
        this.createOrEditRoleModal.show();
    }

    showHistory(role: RoleListDto): void {
        this.entityTypeHistoryModal.show({
            entityId: role.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: role.displayName
        });
    }

    showWorkflowMetrics(id){
        this.workflowRoleMetrics.show(id);
    }
    
    deleteRole(role: RoleListDto): void {
        let self = this;
        self.message.confirm(
            self.l('RoleDeleteWarningMessage', role.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._roleService.deleteRole(role.id).subscribe(() => {
                        this.getRoles();
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    exportToExcel(): void {
        this._roleService.getRoleToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}
