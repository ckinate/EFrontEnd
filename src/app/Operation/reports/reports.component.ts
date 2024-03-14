import { Component, ElementRef, Injector, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CompanyCategoryStructureDto, CompanyStructureDto, UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';


@Pipe({ name: 'finsafe' })
export class FINSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer,

    ) {

    }
  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class ReportsComponent extends AppComponentBase implements OnInit {

  @ViewChild('SampleDateTimePicker', {static: true}) sampleDateTimePicker: ElementRef;
  categoryList: CompanyCategoryStructureDto[] = [];
  listCompanyStructure: CompanyStructureDto[] = [];
  custCodeList: CompanyStructureDto[] = [];
  UserList: UserListDto[] = [];
  public dateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), 
  this._dateTimeService.getStartOfDay()];
  constructor(injector: Injector,
    private _dateTimeService: DateTimeService,
    private _userService: UserServiceProxy,

    ) {
    super(injector); }

  link = '';
  miscode = '0';
  User = '0';
  u: any;
  cancel_associated_session: any;
  sdate: string;
  edate: string;
    user: any;
  ngOnInit(): void {
    this.loadCategories();
    this.getUser();
  }


//   ViewReport() {
//     debugger;
//     console.log(this.ViewReport)
//     this.sdate = this.dateRange[0].toFormat('yyyy-MM-dd');
//     this.edate = this.dateRange[1].toFormat('yyyy-MM-dd');
//    // this.user = this.appSession.user.userName;
//     var url  =  AppConsts.OpexReqreportUrl + "?TypeId=1" + "&sDate="  + this.sdate + "&eDate=" + this.edate +"&user=" + this.User + "&mis=" + this.miscode;
// console.log(url);
//     this.link = url;
//     window.open(url)
//   }

 ViewReport(myURL: string | URL) {
  console.log(this.ViewReport);
    this.sdate = this.dateRange[0].toFormat('yyyy-MM-dd');
    this.edate = this.dateRange[1].toFormat('yyyy-MM-dd');
    // var left = (screen.width - myWidth) / 2;

    // var top = (screen.height - myHeight) / 4;
     myURL = AppConsts.OpexReqreportUrl + '?TypeId=1' + '&sDate='  + this.sdate + '&eDate=' + this.edate + '&user=' + this.User + '&mis=' + this.miscode;
     let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
     window.open(myURL,"_blank", params); 
 }

  getUser() {
    this._userService.getUserList().subscribe(result => {
    this.UserList = result;
    this.u.User = null;
    });
    }
  loadCategories() {
    this._userService.getCoyCategory().subscribe(result => {
    this.categoryList = result;
    });
    }

  getCompanyStructure(val: any) {
    this._userService.getCompanyStructures(val).subscribe(result => {
        this.listCompanyStructure = result;
        this.user.misCode = null;
    });
    }
  mis(val: any) {
        this._userService.getCustCode(val).subscribe(result => {
             this.custCodeList = result;
    });
    }

}
