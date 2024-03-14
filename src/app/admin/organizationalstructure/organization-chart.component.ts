import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CompanyStructureServiceProxy, ListResultDtoOfCompanyStructureDto } from '@shared/service-proxies/service-proxies';
import { ArrayToTreeConverterService } from '@shared/utils/array-to-tree-converter.service';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import { TreeNode, MenuItem } from 'primeng/api';
import { CreateOrEditCompanyModalComponent } from './create-or-edit-company-modal.component';
import { IBasicOrganizationalStructureInfo } from './IBasicOrganizationalStructureInfo';

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.css']
})
export class OrganizationChartComponent extends AppComponentBase implements OnInit {

  
  @Output() ouSelected = new EventEmitter<IBasicOrganizationalStructureInfo>();
  @ViewChild('createOrEditCompanyModalComponent', { static: true }) createOrEditCompanyModalComponent: CreateOrEditCompanyModalComponent;
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


}
