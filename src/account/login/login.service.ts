import {
    TokenService,
    LogService,
    MessageService,
    LocalizationService,
} from 'abp-ng2-module';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import {
    AuthenticateModel,
    AuthenticateResultModel,
    ExternalAuthenticateModel,
    ExternalAuthenticateResultModel,
    ExternalLoginProviderInfoModel,
    TokenAuthServiceProxy,
    TwitterServiceProxy
} from '@shared/service-proxies/service-proxies';
import { ScriptLoaderService } from '@shared/utils/script-loader.service';
import { map as _map, filter as _filter } from 'lodash-es';
import { finalize } from 'rxjs/operators';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

import * as AuthenticationContext from 'adal-angular/lib/adal';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAgentApplication, AuthResponse } from 'msal';
import { LocalStorageService } from '@shared/utils/local-storage.service';

declare const FB: any; // Facebook API
declare const gapi: any; // Facebook API

export class ExternalLoginProvider extends ExternalLoginProviderInfoModel {
    static readonly FACEBOOK: string = 'Facebook';
    static readonly GOOGLE: string = 'Google';
    static readonly MICROSOFT: string = 'Microsoft';
    static readonly OPENID: string = 'OpenIdConnect';
    static readonly WSFEDERATION: string = 'WsFederation';
    static readonly TWITTER: string = 'Twitter';

    icon: string;
    initialized = false;

    constructor(providerInfo: ExternalLoginProviderInfoModel) {
        super();

        this.name = providerInfo.name;
        this.clientId = providerInfo.clientId;
        this.additionalParams = providerInfo.additionalParams;
        this.icon = providerInfo.name.toLowerCase();


    }
}

@Injectable()
export class LoginService {
    static readonly twoFactorRememberClientTokenName =
        'TwoFactorRememberClientToken';

    MSAL: UserAgentApplication; // Microsoft API
    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    externalLoginProviders: ExternalLoginProvider[] = [];
    rememberMe: boolean;

    wsFederationAuthenticationContext: any;
    localizationSourceName =
        AppConsts.localization.defaultLocalizationSourceName;

    localization: LocalizationService;

    loginProvider: any;

    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private _messageService: MessageService,
        private _tokenService: TokenService,
        private _logService: LogService,
        private oauthService: OAuthService,
        private spinnerService: NgxSpinnerService,
        private _localStorageService: LocalStorageService,
        private _twitterService: TwitterServiceProxy
    ) {
        this.clear();

        this.configureSSO();
    }

    authenticate(
        finallyCallback?: () => void,
        redirectUrl?: string,
        captchaResponse?: string
    ): void {
        finallyCallback =
            finallyCallback ||
            (() => {
                this.spinnerService.hide();
            });

        const self = this;
        this._localStorageService.getItem(
            LoginService.twoFactorRememberClientTokenName,
            function (err, value) {
                self.authenticateModel.twoFactorRememberClientToken =
                    value?.token;
                self.authenticateModel.singleSignIn = UrlHelper.getSingleSignIn();
                self.authenticateModel.returnUrl = UrlHelper.getReturnUrl();
                self.authenticateModel.captchaResponse = captchaResponse;

                self._tokenAuthService
                    .authenticate(self.authenticateModel)
                    .subscribe({
                        next: (result: AuthenticateResultModel) => {
                            self.processAuthenticateResult(result, redirectUrl);
                            finallyCallback();
                        },
                        error: (err: any) => {
                            finallyCallback();
                        },
                    });
            }
        );
    }

    externalAuthenticate(provider: ExternalLoginProvider): void {
        this.ensureExternalLoginProviderInitialized(provider, () => {
            if (provider.name === ExternalLoginProvider.FACEBOOK) {
                FB.login(
                    (response) => {
                        this.facebookLoginStatusChangeCallback(response);
                    },
                    { scope: 'email' }
                );
            } else if (provider.name === ExternalLoginProvider.GOOGLE) {
                gapi.auth2
                    .getAuthInstance()
                    .signIn()
                    .then(() => {
                        this.googleLoginStatusChangeCallback(
                            gapi.auth2.getAuthInstance().isSignedIn.get()
                        );
                    });
            } else if (provider.name === ExternalLoginProvider.MICROSOFT) {
                let scopes = ['user.read'];
                this.spinnerService.show();
                this.MSAL.loginPopup({
                    scopes: scopes,
                }).then((idTokenResponse: AuthResponse) => {
                    this.MSAL.acquireTokenSilent({ scopes: scopes })
                        .then((accessTokenResponse: AuthResponse) => {
                            this.microsoftLoginCallback(accessTokenResponse);
                            this.spinnerService.hide();
                        })
                        .catch((error) => {
                            abp.log.error(error);
                            abp.message.error(
                                this.localization.localize(
                                    'CouldNotValidateExternalUser',
                                    this.localizationSourceName
                                )
                            );
                        });
                });
            } else if (provider.name === ExternalLoginProvider.TWITTER) {
                this.startTwitterLogin();
            }
        });
    }

    init(): void {
        this.initExternalLoginProviders();
this.checkp();

    }

    private processAuthenticateResult(
        authenticateResult: AuthenticateResultModel,
        redirectUrl?: string
    ) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.shouldResetPassword) {
            // Password reset

            this._router.navigate(['account/reset-password'], {
                queryParams: {
                    userId: authenticateResult.userId,
                    tenantId: abp.session.tenantId,
                    resetCode: authenticateResult.passwordResetCode,
                },
            });

            this.clear();
        } else if (authenticateResult.requiresTwoFactorVerification) {
            // Two factor authentication

            this._router.navigate(['account/send-code']);
        } else if (authenticateResult.accessToken) {
            // Successfully logged in

            if (authenticateResult.returnUrl && !redirectUrl) {
                redirectUrl = authenticateResult.returnUrl;
            }

            this.login(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                authenticateResult.refreshToken,
                authenticateResult.refreshTokenExpireInSeconds,
                this.rememberMe,
                authenticateResult.twoFactorRememberClientToken,
                redirectUrl
            );
        } else {
            // Unexpected result!

            this._logService.warn('Unexpected authenticateResult!');
            this._router.navigate(['account/login']);
        }
    }

    private login(
        accessToken: string,
        encryptedAccessToken: string,
        expireInSeconds: number,
        refreshToken: string,
        refreshTokenExpireInSeconds: number,
        rememberMe?: boolean,
        twoFactorRememberClientToken?: string,
        redirectUrl?: string
    ): void {
        let tokenExpireDate = rememberMe
            ? new Date(new Date().getTime() + 1000 * expireInSeconds)
            : undefined;

        this._tokenService.setToken(accessToken, tokenExpireDate);

        if (refreshToken && rememberMe) {
            let refreshTokenExpireDate = rememberMe
                ? new Date(
                    new Date().getTime() + 1000 * refreshTokenExpireInSeconds
                )
                : undefined;
            this._tokenService.setRefreshToken(
                refreshToken,
                refreshTokenExpireDate
            );
        }

        this._localStorageService.setItem(
            AppConsts.authorization.encrptedAuthTokenName,
            {
                token: encryptedAccessToken,
                expireDate: tokenExpireDate,
            }
        );

        if (twoFactorRememberClientToken) {
            this._localStorageService.setItem(
                LoginService.twoFactorRememberClientTokenName,
                {
                    token: twoFactorRememberClientToken,
                    expireDate: new Date(new Date().getTime() + 365 * 86400000), // 1 year
                }
            );
        }

        if (redirectUrl) {
            location.href = redirectUrl;
        } else {
            let initialUrl = UrlHelper.initialUrl;

            if (initialUrl.indexOf('/account') > 0) {
                initialUrl = AppConsts.appBaseUrl;
            }

            location.href = initialUrl;
        }
    }

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
       // this.oauthService.loadDiscoveryDocument();
    }

    private initExternalLoginProviders(callback?: any) {
        this._tokenAuthService
            .getExternalAuthenticationProviders()
            .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
                this.externalLoginProviders = _map(
                    providers,
                    (p) => new ExternalLoginProvider(p)
                );
                if (callback) {
                    callback();
                }
            });
    }

    ensureExternalLoginProviderInitialized(
        loginProvider: ExternalLoginProvider,
        callback: () => void
    ) {
        if (loginProvider.initialized) {
            callback();
            return;
        }

        if (loginProvider.name === ExternalLoginProvider.FACEBOOK) {
            new ScriptLoaderService()
                .load('//connect.facebook.net/en_US/sdk.js')
                .then(() => {
                    FB.init({
                        appId: loginProvider.clientId,
                        cookie: false,
                        xfbml: true,
                        version: 'v2.5',
                    });

                    FB.getLoginStatus((response) => {
                        this.facebookLoginStatusChangeCallback(response);
                        if (response.status !== 'connected') {
                            callback();
                        }
                    });
                });
        } else if (loginProvider.name === ExternalLoginProvider.GOOGLE) {
            new ScriptLoaderService()
                .load('https://apis.google.com/js/api.js')
                .then(() => {
                    gapi.load('client:auth2', () => {
                        gapi.client
                            .init({
                                clientId: loginProvider.clientId,
                                scope: 'openid profile email',
                            })
                            .then(() => {
                                callback();
                            });
                    });
                });
        } else if (loginProvider.name === ExternalLoginProvider.MICROSOFT) {
            this.MSAL = new UserAgentApplication({
                auth: {
                    clientId: loginProvider.clientId,
                    redirectUri: AppConsts.appBaseUrl,
                },
            });
            callback();
        } else if (loginProvider.name === ExternalLoginProvider.OPENID) {
            const authConfig = this.getOpenIdConnectConfig(loginProvider);
            this.oauthService.configure(authConfig);

            this.oauthService.tokenValidationHandler = new JwksValidationHandler();
           // this.oauthService.loadDiscoveryDocument();
            this.oauthService.initImplicitFlow('OpenIdConnect=1');
        } else if (loginProvider.name === ExternalLoginProvider.WSFEDERATION) {
            let config = this.getWsFederationConnectConfig(loginProvider);
            this.wsFederationAuthenticationContext = new AuthenticationContext(
                config
            );
            this.wsFederationAuthenticationContext.login();
        } else if (loginProvider.name === ExternalLoginProvider.TWITTER) {
            callback();
        }
    }

    private getWsFederationConnectConfig(
        loginProvider: ExternalLoginProvider
    ): any {
        let config = {
            clientId: loginProvider.clientId,
            popUp: true,
            callback: this.wsFederationLoginStatusChangeCallback.bind(this),
        } as any;

        if (loginProvider.additionalParams['Tenant']) {
            config.tenant = loginProvider.additionalParams['Tenant'];
        }

        return config;
    }

    initiateImplicitFlow(){
        this.oauthService.initImplicitFlow('openIdConnect=1');
    }
    configureSSO() {

        this.initExternalLoginProviders(() => {
            let openIdProvider = _filter(this.externalLoginProviders, {
                name: 'OpenIdConnect',
            })[0];


        this.loginProvider = openIdProvider;
        let authConfig = this.getOpenIdConnectConfig(openIdProvider)
        this.oauthService.configure(authConfig);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
       this.oauthService.loadDiscoveryDocument();

        });
        //this.oauthService.initImplicitFlow("openIdConnect=1");
    }

    private getOpenIdConnectConfig(
        loginProvider: ExternalLoginProvider
    ): AuthConfig {
        let authConfig = new AuthConfig();
        authConfig.loginUrl = loginProvider.additionalParams['LoginUrl'];
        authConfig.issuer = loginProvider.additionalParams['Authority'];
        authConfig.skipIssuerCheck = loginProvider.additionalParams['ValidateIssuer'] === 'false';
        authConfig.clientId = AppConsts.ClientId;
        authConfig.responseType = 'id_token';
        authConfig.redirectUri = AppConsts.appBaseUrl + '/account/login';
        authConfig.scope = 'openid profile email';
        authConfig.requestAccessToken = false;
        return authConfig;
    }


    private facebookLoginStatusChangeCallback(resp) {
        if (resp.status === 'connected') {
            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.FACEBOOK;
            model.providerAccessCode = resp.authResponse.accessToken;
            model.providerKey = resp.authResponse.userID;
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();

            this._tokenAuthService
                .externalAuthenticate(model)
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info(
                            'You have successfully registered. Waiting for activation!'
                        );
                        return;
                    }

                    this.login(
                        result.accessToken,
                        result.encryptedAccessToken,
                        result.expireInSeconds,
                        result.refreshToken,
                        result.refreshTokenExpireInSeconds,
                        false,
                        '',
                        result.returnUrl
                    );
                });
        }
    }


    checkp() {

        // this.initExternalLoginProviders(() => {
        //     let openIdProvider = _filter(this.externalLoginProviders, {
        //         name: 'OpenIdConnect',
        //     })[0];
        // let authConfig = this.getOpenIdConnectConfig(openIdProvider);
        // this.oauthService.configure(authConfig);
        // this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        // this.oauthService.loadDiscoveryDocumentAndTryLogin();

        // });
    }

    public openIdConnectLoginCallback(resp) {


        this.initExternalLoginProviders(() => {
            let openIdProvider = _filter(this.externalLoginProviders, {
                name: 'OpenIdConnect',
            })[0];
            let authConfig = this.getOpenIdConnectConfig(openIdProvider);
            this.oauthService.configure(authConfig);
            this.oauthService.tokenValidationHandler = new JwksValidationHandler();
           // this.oauthService.loadDiscoveryDocumentAndTryLogin();
        this.spinnerService.show();
        this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
            let claims = this.oauthService.getIdentityClaims();

            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.OPENID;
            model.providerAccessCode = this.oauthService.getIdToken();
            model.providerKey = claims['sub'];
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();

            this._tokenAuthService
                .externalAuthenticate(model)
                .pipe(
                    finalize(() => {
                        this.spinnerService.hide();
                    })
                )
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info(
                            'You have successfully registered. Waiting for activation!'
                        );
                        return;
                    }

                    this.login(
                        result.accessToken,
                        result.encryptedAccessToken,
                        result.expireInSeconds,
                        result.refreshToken,
                        result.refreshTokenExpireInSeconds,
                        false,
                        '',
                        result.returnUrl
                    );
                });
        });
    });
    }

    private startTwitterLogin() {
        this.spinnerService.show();
        this._twitterService.getRequestToken()
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe(result => {
                if (result.confirmed) {
                    window.location.href = result.redirectUrl;
                } else {
                    this._messageService.error('Couldn\'t get twitter request token !');
                }
            });
    }

    public twitterLoginCallback(token: string, verifier: string) {
        this.spinnerService.show();

        this._twitterService.getAccessToken(token, verifier).subscribe(response => {
            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.TWITTER;
            model.providerAccessCode = response.accessToken + '&' + response.accessTokenSecret;
            model.providerKey = response.userId;
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();

            this._tokenAuthService
                .externalAuthenticate(model)
                .pipe(
                    finalize(() => {
                        this.spinnerService.hide();
                    })
                )
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info(
                            'You have successfully registered. Waiting for activation!'
                        );
                        return;
                    }

                    this.login(
                        result.accessToken,
                        result.encryptedAccessToken,
                        result.expireInSeconds,
                        result.refreshToken,
                        result.refreshTokenExpireInSeconds,
                        false,
                        '',
                        result.returnUrl
                    );
                });
        });
    }

    private googleLoginStatusChangeCallback(isSignedIn) {
        if (isSignedIn) {
            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.GOOGLE;
            model.providerAccessCode = gapi.auth2
                .getAuthInstance()
                .currentUser.get()
                .getAuthResponse().access_token;
            model.providerKey = gapi.auth2
                .getAuthInstance()
                .currentUser.get()
                .getBasicProfile()
                .getId();
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();

            this._tokenAuthService
                .externalAuthenticate(model)
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info(
                            'You have successfully registered. Waiting for activation!'
                        );
                        return;
                    }

                    this.login(
                        result.accessToken,
                        result.encryptedAccessToken,
                        result.expireInSeconds,
                        result.refreshToken,
                        result.refreshTokenExpireInSeconds,
                        false,
                        '',
                        result.returnUrl
                    );
                });
        }
    }

    public wsFederationLoginStatusChangeCallback(
        errorDesc,
        token,
        error,
        tokenType
    ) {
        let user = this.wsFederationAuthenticationContext.getCachedUser();

        const model = new ExternalAuthenticateModel();
        model.authProvider = ExternalLoginProvider.WSFEDERATION;
        model.providerAccessCode = token;
        model.providerKey = user.profile.sub;
        model.singleSignIn = UrlHelper.getSingleSignIn();
        model.returnUrl = UrlHelper.getReturnUrl();

        this._tokenAuthService
            .externalAuthenticate(model)
            .subscribe((result: ExternalAuthenticateResultModel) => {
                if (result.waitingForActivation) {
                    this._messageService.info(
                        'You have successfully registered. Waiting for activation!'
                    );
                    this._router.navigate(['account/login']);
                    return;
                }

                this.login(
                    result.accessToken,
                    result.encryptedAccessToken,
                    result.expireInSeconds,
                    result.refreshToken,
                    result.refreshTokenExpireInSeconds,
                    false,
                    '',
                    result.returnUrl
                );
            });
    }

    /**
     * Microsoft login is not completed yet, because of an error thrown by zone.js: https://github.com/angular/zone.js/issues/290
     */
    private microsoftLoginCallback(response: AuthResponse) {
        const model = new ExternalAuthenticateModel();
        model.authProvider = ExternalLoginProvider.MICROSOFT;
        model.providerAccessCode = response.accessToken;
        // remove dashes and starting 0 characters from objectId
        // 000-000-111-222 will be converted to 111222
        model.providerKey = response.idToken.objectId
            .replace(new RegExp('-', 'gm'), '')
            .replace(/^0*/g, '');
        model.singleSignIn = UrlHelper.getSingleSignIn();
        model.returnUrl = UrlHelper.getReturnUrl();

        this.spinnerService.show();

        this._tokenAuthService
            .externalAuthenticate(model)
            .subscribe((result: ExternalAuthenticateResultModel) => {
                if (result.waitingForActivation) {
                    this._messageService.info(
                        'You have successfully registered. Waiting for activation!'
                    );
                    return;
                }

                this.login(
                    result.accessToken,
                    result.encryptedAccessToken,
                    result.expireInSeconds,
                    result.refreshToken,
                    result.refreshTokenExpireInSeconds,
                    false,
                    '',
                    result.returnUrl
                );
                this.spinnerService.hide();
            });
    }
}
