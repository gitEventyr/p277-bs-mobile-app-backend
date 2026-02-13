"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasinoApiModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const casino_api_service_1 = require("./casino-api.service");
let CasinoApiModule = class CasinoApiModule {
};
exports.CasinoApiModule = CasinoApiModule;
exports.CasinoApiModule = CasinoApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 3,
            }),
            config_1.ConfigModule,
        ],
        providers: [casino_api_service_1.CasinoApiService],
        exports: [casino_api_service_1.CasinoApiService],
    })
], CasinoApiModule);
//# sourceMappingURL=casino-api.module.js.map