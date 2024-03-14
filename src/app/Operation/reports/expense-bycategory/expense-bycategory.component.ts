import { Component, Injector, OnInit, ViewEncapsulation } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { DateTime } from "luxon";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DateTimeService } from "@app/shared/common/timing/date-time.service";
import { AppConsts } from "@shared/AppConsts";
import {
    CompanyCategoryStructureDto,
    CompanyStructureDto,
    UserServiceProxy,
} from "@shared/service-proxies/service-proxies";

@Component({
    selector: "app-expense-bycategory",
    templateUrl: "./expense-bycategory.component.html",
    styleUrls: ["./expense-bycategory.component.css"],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class ExpenseBycategoryComponent
    extends AppComponentBase
    implements OnInit {
    public dateRange: DateTime[] = [
        this._dateTimeService.getStartOfDayMinusDays(7),
        this._dateTimeService.getStartOfDay(),
    ];
    miscode = "";
    reportType = 0;
    categoryList: CompanyCategoryStructureDto[] = [];
    listCompanyStructure: CompanyStructureDto[] = [];
    user: any;
    Tid:number;
    custCodeList: CompanyStructureDto[] = [];

    constructor(
        injector: Injector,
        private _dateTimeService: DateTimeService,
        private _userService: UserServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    onValueChange(event) {}

    ViewReport() {
        let ss =
            AppConsts.reportUrl +
            "?TypeId=51" +
            "&ReportType=" +
            this.reportType +
            "&StartDate=" +
            this.dateRange[0].toSQLDate() +
            "&EndDate=" +
            this.dateRange[1].toSQLDate()
            + '&companyMis=NIBSS001' + '&TID=0';
        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
        window.open(ss, "_blank", params);
        console.log(ss);
    }

    loadCategories() {
        this._userService.getCoyCategory().subscribe((result) => {
            this.categoryList = result;
        });
    }

    getCompanyStructure(val: any) {
        this._userService.getCompanyStructures(val).subscribe((result) => {
            this.listCompanyStructure = result;
            this.user.misCode = null;
        });
    }

    mis(val: any) {
        this._userService.getCustCode(val).subscribe((result) => {
            this.custCodeList = result;
        });
    }
}
