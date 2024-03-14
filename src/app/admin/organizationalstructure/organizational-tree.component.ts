import { CompanyStructureDto, PagedResultDtoOfAuditLogListDto } from './../../../shared/service-proxies/service-proxies';
import { IBasicOrganizationalStructureInfo } from './IBasicOrganizationalStructureInfo';
import { Component, OnInit, EventEmitter, Output, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TreeNode, MenuItem } from 'primeng/api';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import { ArrayToTreeConverterService } from '@shared/utils/array-to-tree-converter.service';
import { CompanyStructureServiceProxy, ListResultDtoOfCompanyStructureDto } from '@shared/service-proxies/service-proxies';
import { CreateOrEditCompanyModalComponent } from './create-or-edit-company-modal.component';
import * as _ from 'lodash';

@Component({
  selector: 'organizational-tree',
  templateUrl: './organizational-tree.component.html'
})
export class OrganizationalTreeComponent extends AppComponentBase implements OnInit {

  @Output() ouSelected = new EventEmitter<IBasicOrganizationalStructureInfo>();
  @ViewChild('createOrEditCompanyModalComponent', { static: true }) createOrEditCompanyModalComponent: CreateOrEditCompanyModalComponent;
  @Output() organstruct: EventEmitter<CompanyStructureDto> = new EventEmitter<CompanyStructureDto>();

  treeData: any;
  selectedOu: TreeNode;
  ouContextMenuItems: MenuItem[];
  canManageOrganizationUnits = true;

  constructor(   injector: Injector,
    private _organizationUnitService: CompanyStructureServiceProxy,
    private _arrayToTreeConverterService: ArrayToTreeConverterService,
    private _treeDataHelperService: TreeDataHelperService) {
      super(injector);
    }

    totalUnitCount = 0;
  ngOnInit(): void {
    this.getTreeDataFromServer();
    this.ouContextMenuItems = this.getContextMenuItems();
  }

  reload(): void {
    this.getTreeDataFromServer();
}


  private getTreeDataFromServer(): void {
    let self = this;
    this._organizationUnitService.getCompanyStructure().subscribe((result: ListResultDtoOfCompanyStructureDto) => {
        this.totalUnitCount = result.items.length;
        this.treeData = this._arrayToTreeConverterService.createTree(result.items,
            'parentId',
            'id',
            0,
            'children',
            [

                {
                    target: 'expanded',
                    value: false
                },
                {
                    target: 'label',
                    targetFunction(item) {
                        return item.displayName;
                    }
                }, {
                    target: 'expandedIcon',
                    value: 'fa fa-folder-open m--font-warning'
                },
                {
                    target: 'collapsedIcon',
                    value: 'fa fa-folder m--font-warning'
                },
                {
                    target: 'selectable',
                    value: true
                },
                {
                    target: 'customCode',
                    targetFunction(item) {
                        return item.customCode;
                    }
                },
                {
                    target: 'unitTypeId',
                    targetFunction(item) {
                        return item.unitTypeId;
                    }
                },
                {
                    target: 'headUser',
                    targetFunction(item) {
                        return item.headUser;
                    }
                }
            ]);
    });
}

private getContextMenuItems(): any[] {

  const canManageOrganizationTree = true;  //this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');
  const disabled = true;
  const custCode = true;

  let items = [
      {

          label: "Edit/Enable" ,
          disabled: !this.isGranted('Pages.Administration.CompanyStructure.Edit'),
          command: (event) => {
              console.log(this.selectedOu);
              this.createOrEditCompanyModalComponent.show({
                  id: this.selectedOu.data.id,
                  displayName: this.selectedOu.data.displayName,
                  customCode: this.selectedOu.data.customCode,
                  unitTypeId:  this.selectedOu.data.unitTypeId,
                  headUser: this.selectedOu.data.headUser,
                  maximumAmount:this.selectedOu.data.maximumAmount,
                  minimumAmount:this.selectedOu.data.minimumAmount,
                  status:this.selectedOu.data.status,
                  parentId:this.selectedOu.data.parentId,

              },  true,false
              );
          }
      },
      {
          label: this.l('AddSubUnit'),
          disabled: !this.isGranted('Pages.Administration.CompanyStructure.CreateSubUnit'),
          command: () => {
              this.addUnit(this.selectedOu.data.id,this.selectedOu.data.unitTypeId, true);
          }
      },
      {
          label: this.l('Disable'),
          disabled: !this.isGranted('Pages.Administration.CompanyStructure.Delete'),
          command: () => {
              this.message.confirm(
                  this.l('OrganizationUnitDeleteWarningMessage', this.selectedOu.data.displayName),
                  this.l('AreYouSure'),
                  isConfirmed => {
                      if (isConfirmed) {
                          this._organizationUnitService.deleteCompanyStructure(this.selectedOu.data.id).subscribe(() => {
                             this.deleteUnit(this.selectedOu.data.id);
                             this.organstruct.emit(null);
                              this.notify.success(this.l('SuccessfullyDisable'));
                              this.selectedOu = null;
                              this.reload();
                          });
                      }
                  }
              );
          }
      }
  ];

  // if (this.isEntityHistoryEnabled()) {
  //     items.push({
  //         label: this.l('History'),
  //         disabled: false,
  //         command: (event) => {
  //             this.entityTypeHistoryModal.show({
  //                 entityId: this.selectedOu.data.id.toString(),
  //                 entityTypeFullName: this._entityTypeFullName,
  //                 entityTypeDescription: this.selectedOu.data.displayName
  //             });
  //         }
  //     });
  //}

  return items;
}


addUnit(parentId?: number,unitTypeid?:any, changecode? :any): void {
    let disable = false;
    debugger;
    if(unitTypeid==4){
      disable = true;
    }

    this.createOrEditCompanyModalComponent.show({
        parentId: parentId
    },disable,changecode);
}

unitCreated(ou: CompanyStructureDto): void {
    if (ou.parentId) {
        let unit = this._treeDataHelperService.findNode(this.treeData, { data: { id: ou.parentId } });
        if (!unit) {
            return;
        }

        unit.children.push({
            label: ou.displayName,
            customCode: ou.customCode,
            unitTypeId: ou.unitTypeId,
            headUser: ou.headUser,
            expandedIcon: 'fa fa-folder-open m--font-warning',
            collapsedIcon: 'fa fa-folder m--font-warning',
            selected: true,
            children: [],
            data: ou
        });
    } else {
        this.treeData.push({
            label: ou.displayName,
            customCode: ou.customCode,
            unitTypeId: ou.unitTypeId,
            headUser: ou.headUser,
            expandedIcon: 'fa fa-folder-open m--font-warning',
            collapsedIcon: 'fa fa-folder m--font-warning',
            selected: true,
            children: [],
            data: ou
        });
    }

    this.totalUnitCount += 1;
}

deleteUnit(id) {
    let node = this._treeDataHelperService.findNode(this.treeData, { data: { id: id } });
    if (!node) {
        return;
    }

    if (!node.data.parentId) {
        _.remove(this.treeData, {
            data: {
                id: id
            }
        });
    }

    let parentNode = this._treeDataHelperService.findNode(this.treeData, { data: { id: node.data.parentId } });
    if (!parentNode) {
        return;
    }

    _.remove(parentNode.children, {
        data: {
            id: id
        }
    });
}

unitUpdated(ou: CompanyStructureDto): void {


    let item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ou.id } });
    if (!item) {
        return;
    }

    console.log('Events');
    console.log(item);
    console.log(ou);

    //item.data.displayName = ou.displayName;
    //item.label = ou.displayName;
    //item.data.customCode = ou.customCode;
    //item.customCode = ou.customCode;
    //item.headUser = ou.headUser;
    //item.minimumAmount = ou.minimumAmount;
    //item.maximumAmount =ou.maximumAmount;
    //item.active = ou.status;

    this.getTreeDataFromServer();

}



}
