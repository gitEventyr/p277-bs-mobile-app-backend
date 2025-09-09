"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CasinoApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasinoApiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let CasinoApiService = CasinoApiService_1 = class CasinoApiService {
    configService;
    httpService;
    logger = new common_1.Logger(CasinoApiService_1.name);
    casinoApiUrl;
    casinoBearerToken;
    casinoAppId;
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.casinoApiUrl = this.configService.get('CASINO_API_URL');
        this.casinoBearerToken = this.configService.get('CASINO_API_BEARER_TOKEN');
        this.casinoAppId = this.configService.get('CASINO_API_APP_ID');
        if (!this.casinoApiUrl || !this.casinoBearerToken || !this.casinoAppId) {
            this.logger.warn('Casino API configuration is incomplete. External registration will be disabled.');
        }
    }
    async registerUser(registerDto, ipAddress) {
        if (!this.casinoApiUrl || !this.casinoBearerToken || !this.casinoAppId) {
            throw new common_1.BadRequestException('Casino API is not configured');
        }
        const registerPayload = {
            firstname: registerDto.name || '',
            email: registerDto.email || '',
            device_udid: registerDto.deviceUDID || '',
            subscription_agreement: registerDto.subscription_agreement || false,
            tnc_agreement: registerDto.tnc_agreement || false,
            os: registerDto.os || '',
            device: registerDto.device || '',
            ipaddress: ipAddress,
            appsflyer: {
                pid: registerDto.appsflyer?.pid || '',
                c: registerDto.appsflyer?.c || '',
                af_channel: registerDto.appsflyer?.af_channel || '',
                af_adset: registerDto.appsflyer?.af_adset || '',
                af_ad: registerDto.appsflyer?.af_ad || '',
                af_keywords: registerDto.appsflyer?.af_keywords || '',
                is_retargeting: registerDto.appsflyer?.is_retargeting || false,
                af_click_lookback: registerDto.appsflyer?.af_click_lookback?.toString() || '',
                af_viewthrough_lookback: registerDto.appsflyer?.af_viewthrough_lookback?.toString() || '',
                af_sub1: registerDto.appsflyer?.af_sub1 || '',
                af_sub2: registerDto.appsflyer?.af_sub2 || '',
                af_sub3: registerDto.appsflyer?.af_sub3 || '',
                af_sub4: registerDto.appsflyer?.af_sub4 || '',
                af_sub5: registerDto.appsflyer?.af_sub5 || '',
            },
        };
        const url = `${this.casinoApiUrl}/api/mobile/v1/${this.casinoAppId}/register`;
        try {
            this.logger.debug(`Calling casino API: ${url}`, registerPayload);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, registerPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.casinoBearerToken}`,
                },
                timeout: 10000,
            }));
            const responseData = response.data;
            const visitorId = responseData?.visitor_id || responseData?.user?.visitor_id;
            if (!visitorId) {
                throw new common_1.BadRequestException('Invalid response from casino API: missing visitor_id');
            }
            this.logger.log(`Successfully registered user with casino API. Visitor ID: ${visitorId}`);
            return visitorId;
        }
        catch (error) {
            this.logger.error('Failed to register user with casino API', {
                error: error.message,
                url,
                payload: registerPayload,
                response: error.response?.data,
            });
            if (error.response?.status >= 400 && error.response?.status < 500) {
                throw new common_1.BadRequestException(`Casino API error: ${error.response?.data?.message || error.message}`);
            }
            throw new common_1.BadRequestException('Unable to complete registration. Please try again later.');
        }
    }
    isConfigured() {
        return !!(this.casinoApiUrl && this.casinoBearerToken && this.casinoAppId);
    }
};
exports.CasinoApiService = CasinoApiService;
exports.CasinoApiService = CasinoApiService = CasinoApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], CasinoApiService);
//# sourceMappingURL=casino-api.service.js.map