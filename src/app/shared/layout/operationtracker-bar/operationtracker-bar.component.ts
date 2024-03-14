import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, HostListener, Injector, Input, NgZone, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
  BlockUserInput,
  ChatSide,
  ChatServiceProxy,
  CommonLookupServiceProxy,
  CreateFriendshipRequestByUserNameInput,
  CreateFriendshipRequestInput,
  FindUsersInput,
  FriendDto,
  FriendshipState,
  FriendshipServiceProxy,
  MarkAllUnreadMessagesOfUserAsReadInput,
  NameValueDto,
  ProfileServiceProxy,
  UnblockUserInput,
  UserLoginInfoDto,
  ChatMessageReadState,
  NotificationServiceProxy,
  UserNotification,
  OperationsTrackerServiceServiceProxy,
  OperationTrackerDto
} from '@shared/service-proxies/service-proxies';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { filter as _filter, map as _map, forEach as _forEach, min as _min, reduce as _reduce } from 'lodash-es';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { CommonLookupModalComponent } from '@app/shared/common/lookup/common-lookup-modal.component';
import { ChatFriendDto } from '../chat/ChatFriendDto';
import { AppConsts } from '@shared/AppConsts';
import { FileUpload, LazyLoadEvent, Paginator, Table } from 'primeng';
import { ChatSignalrService } from '../chat/chat-signalr.service';
import { HttpClient } from '@microsoft/signalr';
import { finalize } from 'rxjs/operators';
import { DomHelper } from '@shared/helpers/DomHelper';
import { IFormattedUserNotification, UserNotificationHelper } from '../notifications/UserNotificationHelper';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { OperationtrackerbarmodalComponent } from './operationtrackerbarmodal/operationtrackerbarmodal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'operationtracker-bar',
  templateUrl: './operationtracker-bar.component.html',
  styleUrls: ['./operationtracker-bar.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class OperationtrackerBarComponent extends AppComponentBase implements OnInit {

    notifications: IFormattedUserNotification[] = [];
    unreadNotificationCount = 0;
    @Input() isDropup = false;
    @Input() customStyle = 'btn btn-icon btn-dropdown btn-clean btn-lg mr-1';
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    primengTableHelper = new PrimengTableHelper();
    @Input()filter:any;
    @Input() item = '';
    mQuickSidebarOffcanvas: any;
    _isOpen: boolean;
    _pinned = false;
    sampleDate: DateTime;
    records:OperationTrackerDto[]=[];
    _selectedUser: ChatFriendDto = new ChatFriendDto();
    advancedFiltersAreShown = false;
    filterText = " ";
    refFilter = '';
    initiatorFilter = '';
    descriptionFilter = '';
    statusFilter = '';
    operationNameFilter = '';
    parentRef='';
    dateTimeFilter = DateTime;
    appBaseUrl = AppConsts.appBaseUrl;
    
    @ViewChild('operationtrackerbarmodal', {static:true}) operationtrackerbarmodal:OperationtrackerbarmodalComponent;

    currentItem = "";

    get isOpen(): boolean {
        return this._isOpen;
    }
    set isOpen(newValue: boolean) {
        if (newValue === this._isOpen) {
            return;
        }

        this._localStorageService.setItem('app.chat.isOpen', newValue);
        this._isOpen = newValue;

        // if (newValue) {
        //     this.markAllUnreadMessagesOfUserAsRead(this.selectedUser);
        // }
    }

    set pinned(newValue: boolean) {
        if (newValue === this._pinned) {
            return;
        }

        this._pinned = newValue;
        this._localStorageService.setItem('app.chat.pinned', newValue);
    }
    get pinned(): boolean {
        return this._pinned;
    }


    set selectedUser(newValue: ChatFriendDto) {
        if (newValue === this._selectedUser) {
            return;
        }

        this._selectedUser = newValue;

        //NOTE: this is a fix for localForage is not able to store user with messages array filled
        if (newValue.messages) {
            newValue.messages = [];
            newValue.messagesLoaded = false;
        }
        this._localStorageService.setItem('app.chat.selectedUser', newValue);
    }
    get selectedUser(): ChatFriendDto {
        return this._selectedUser;
    }


    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy,
        private _userNotificationHelper: UserNotificationHelper,
        public _zone: NgZone,
        public _oprstrackerservice:OperationsTrackerServiceServiceProxy,
        private _localStorageService: LocalStorageService,
        private router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //this.trackRequest(this.filter,7)
        // this.loadNotifications();
        //this.registerToEvents();
    }
    reversePinned(): void {
        this.pinned = !this.pinned;
    }

    quickSideBarBackClick(): void {
        this.selectedUser = new ChatFriendDto();
    }


    
    ngAfterViewInit(): void {
        this.mQuickSidebarOffcanvas = new KTOffcanvas('kt_tracker_sidebar', {
            overlay: true,
            baseClass: 'offcanvas',
            placement: 'right',
            closeBy: 'kt_tracker_sidebar_closes',
            toggleBy: 'kt_tracker_sidebar_toggle'
        });

        this.mQuickSidebarOffcanvas.events.push({
            name: 'afterHide',
            handler: () => {
                this.isOpen = this._pinned;
            }
        }, {
            name: 'afterShow',
            handler: () => {
                this.isOpen = true;
            }
        });

      
    }

  

  


      
   

       filterTracker(event?: LazyLoadEvent) {
        // if (this.primengTableHelper.shouldResetPaging(event)) {
        //     this.paginator.changePage(0);

        //     return;
        // }

        this.primengTableHelper.showLoadingIndicator();

        this._oprstrackerservice.getAllTracker(
            this.filterText.replace(/\s/g, ""),
            this.refFilter.replace(/\s/g, ""),
            this.initiatorFilter.replace(/\s/g, ""),
            this.descriptionFilter.replace(/\s/g, ""),
           
            this.statusFilter.replace(/\s/g, ""),
            this.operationNameFilter.replace(/\s/g, ""),
            this.parentRef.replace(/\s/g, "")
           
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
           // this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.records = result
           console.log(this.records)
            this.primengTableHelper.hideLoadingIndicator();
        });
    }


  
    gotoUrl(url): void {
        if (url) {
            location.href = url;
        }
    }

    openModal(){
        this.router.navigateByUrl('/operationtrackerbarmodal');
        //this.operationtrackerbarmodal.show();
    }
}
