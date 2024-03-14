import { Component, ElementRef, Injector, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CompanyCategoryStructureDto, CompanyStructureDto, UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';

@Pipe({ name: 'finsafe' })
export class FINSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer,

    ) {

    }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-calloverreport',
  templateUrl: './calloverreport.component.html',
  styleUrls: ['./calloverreport.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class CalloverreportComponent extends AppComponentBase implements OnInit {

  @ViewChild('SampleDateTimePicker', {static: true}) sampleDateTimePicker: ElementRef;
  categoryList: CompanyCategoryStructureDto[] = [];
  listCompanyStructure: CompanyStructureDto[] = [];
  custCodeList: CompanyStructureDto[] = [];
  UserList: UserListDto[] = [];
  public dateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getStartOfDay()];
  user: any;
  constructor(injector: Injector,
    private _dateTimeService: DateTimeService,
    private _userService: UserServiceProxy,
    ) {
    super(injector); }
    miscode = '0';
    User = '0';
    u: any;
  link = '';
  startdate: string;
  endDate: string;
  opId: any;
  ngOnInit(): void {
    this.loadCategories();
    this.getUser();
  }

  ViewReport(myURL: string | URL) {
     this.startdate = this.dateRange[0].toFormat('yyyy-MM-dd');
     this.endDate = this.dateRange[1].toFormat('yyyy-MM-dd');

     myURL =  AppConsts.AmortReport + '?TypeId=1' + '&startDate='  + this.startdate + '&endDate=' + this.endDate ;
     let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
     window.open(myURL, '_blank', params);
     this.link = myURL;
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
    console.log(result);
    console.log(this.categoryList);
    });
    }
  getCompanyStructure(val: any) {

    this._userService.getCompanyStructures(val).subscribe(result => {
        this.listCompanyStructure = result;
        console.log(this.listCompanyStructure);
        this.user.misCode = null;
    });
    }


    mis(val: any) {
        this._userService.getCustCode(val).subscribe(result => {
             this.custCodeList = result;
             console.log(this.custCodeList);
    });
    }
}
