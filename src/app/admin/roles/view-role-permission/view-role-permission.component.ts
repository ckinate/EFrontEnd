import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateRoleInput, RoleEditDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view-role-permission',
  templateUrl: './view-role-permission.component.html',
  styleUrls: ['./view-role-permission.component.css']
})
export class ViewRolePermissionComponent extends AppComponentBase implements OnInit {

    @ViewChild('viewModal', {static: true}) modal: ModalDirective;
    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    role: RoleEditDto = new RoleEditDto();

  constructor(injector: Injector, private _roleService: RoleServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
  }

  show(roleId?: number): void {
    const self = this;
    self.active = true;

    self._roleService.getRoleForEdit(roleId).subscribe(result => {
        self.role = result.role;
        this.permissionTree.editData = result;

        self.modal.show();
    });
}
onShown(): void {
    document.getElementById('RoleDisplayName').focus();
}
save(): void {
    const self = this;

    const input = new CreateOrUpdateRoleInput();
    input.role = self.role;
    input.grantedPermissionNames = self.permissionTree.getGrantedPermissionNames();

    this.saving = true;
    this._roleService.createOrUpdateRole(input)
        .pipe(finalize(() => this.saving = false))
        .subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
}
close(): void {
    this.active = false;
    this.modal.hide();
}

}
