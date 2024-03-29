import { Component, Injector, OnInit, Input, AfterViewInit } from '@angular/core';
import { ThemesLayoutBaseComponent } from '../themes/themes-layout-base.component';
import { LinkedUserDto, OperatingExpenseServiceServiceProxy, ProfileServiceProxy, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';
import { AbpMultiTenancyService, AbpSessionService } from 'abp-ng2-module';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { AppConsts } from '@shared/AppConsts';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { Console } from 'console';
import { XmlHttpRequestHelper } from '@shared/helpers/XmlHttpRequestHelper';

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html'
})
export class UserMenuComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    @Input() iconOnly = false;

    @Input() togglerCssClass = 'btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2';
    @Input() textCssClass = 'text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3';
    @Input() symbolCssClass = 'symbol symbol-35 symbol-light-success';
    @Input() symbolTextCssClass = 'symbol-label font-size-h5 font-weight-bold';

    usernameFirstLetter = '';

    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    shownLoginName = '';
    tenancyName = '';
    userName = '';

    recentlyLinkedUsers: LinkedUserDto[];
    isImpersonatedLogin = false;
    isMultiTenancyEnabled = false;

    mQuickUserOffcanvas: any;

    public constructor(
        injector: Injector,
        private _linkedAccountService: LinkedAccountService,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        private _profileServiceProxy: ProfileServiceProxy,
        private _userLinkServiceProxy: UserLinkServiceProxy,
        private _authService: AppAuthService,
        private _impersonationService: ImpersonationService,
        private _abpSessionService: AbpSessionService,
        _dateTimeService: DateTimeService,
        private _localStorate: LocalStorageService,
        private _opex: OperatingExpenseServiceServiceProxy
    ) {
        super(injector, _dateTimeService);
    }

    ngOnInit(): void {
        this.isImpersonatedLogin = this._abpSessionService.impersonatorUserId > 0;
        this.isMultiTenancyEnabled = this._abpMultiTenancyService.isEnabled;
        this.setCurrentLoginInformations();
        this.getProfilePicture();
        this.getRecentlyLinkedUsers();
        this.registerToEvents();
        this.usernameFirstLetter = this.appSession.user.userName.substring(0, 1).toUpperCase();

    }

    ngAfterViewInit(): void {
        this.mQuickUserOffcanvas = new KTOffcanvas('kt_quick_user', {
            overlay: true,
            baseClass: 'offcanvas',
            placement: 'right',
            closeBy: 'kt_demo_panel_close',
            toggleBy: 'kt_quick_user_toggle'
        });

        this.mQuickUserOffcanvas.events.push({
            name: 'beforeShow',
            handler: () => {
                abp.event.trigger('app.show.quickUserPanel');
            }
        });
    }

    setCurrentLoginInformations(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
        this.tenancyName = this.appSession.tenancyName;
        this.userName = this.appSession.user.userName;
    }

    getShownUserName(linkedUser: LinkedUserDto): string {
        if (!this._abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
    }

    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    getRecentlyLinkedUsers(): void {
        this._userLinkServiceProxy.getRecentlyUsedLinkedUsers().subscribe(result => {
            this.recentlyLinkedUsers = result.items;
        });
    }


    showLoginAttempts(): void {
        abp.event.trigger('app.show.loginAttemptsModal');
    }

    showLinkedAccounts(): void {
        abp.event.trigger('app.show.linkedAccountsModal');
    }

    showUserDelegations(): void {
        abp.event.trigger('app.show.userDelegationsModal');
    }

    changePassword(): void {
        abp.event.trigger('app.show.changePasswordModal');
    }

    changeProfilePicture(): void {
        abp.event.trigger('app.show.changeProfilePictureModal');
    }

    changeMySettings(): void {
        abp.event.trigger('app.show.mySettingsModal');
    }

    registerToEvents() {
        abp.event.on('profilePictureChanged', () => {
            this.getProfilePicture();
        });

        abp.event.on('app.getRecentlyLinkedUsers', () => {
            this.getRecentlyLinkedUsers();
        });

        abp.event.on('app.onMySettingsModalSaved', () => {
            this.onMySettingsModalSaved();
        });
    }

    logout(): void {
        this._authService.logout();
    }
    BackToHome(): void {

    this._opex.logItemLogout(AppConsts.ClientId).subscribe((x) =>
    {

        this._authService.backhomeLogout();
    //     abp.auth.clearToken();
    //     abp.auth.clearRefreshToken();
    //     sessionStorage.clear();
    //     localStorage.clear();
    //     localStorage.removeItem(AppConsts.authorization.encrptedAuthTokenName);


    //  document.location.href = AppConsts.identityServerURL;
    });
    }

    onMySettingsModalSaved(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    backToMyAccount(): void {
        this._impersonationService.backToImpersonator();
    }

    switchToLinkedUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    downloadCollectedData(): void {
        this._profileServiceProxy.prepareCollectedData().subscribe(() => {
            this.message.success(this.l('GdprDataPrepareStartedNotification'));
        });
    }
}
