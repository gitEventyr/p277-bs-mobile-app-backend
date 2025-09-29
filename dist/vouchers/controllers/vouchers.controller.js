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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VouchersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const voucher_service_1 = require("../services/voucher.service");
const create_voucher_request_dto_1 = require("../dto/create-voucher-request.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const mobile_exception_filter_1 = require("../../common/filters/mobile-exception.filter");
let VouchersController = class VouchersController {
    voucherService;
    constructor(voucherService) {
        this.voucherService = voucherService;
    }
    async findAllVouchers() {
        return this.voucherService.findAllVouchers();
    }
    async createVoucherRequest(user, createVoucherRequestDto) {
        if (!user?.id) {
            throw new common_1.BadRequestException('User not authenticated');
        }
        return this.voucherService.createVoucherRequest(user.id, createVoucherRequestDto.voucher_id);
    }
};
exports.VouchersController = VouchersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available vouchers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of available vouchers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "findAllVouchers", null);
__decorate([
    (0, common_1.Post)('request'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a voucher (purchase with RP)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Voucher request created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Insufficient RP balance or invalid voucher',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_voucher_request_dto_1.CreateVoucherRequestDto]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "createVoucherRequest", null);
exports.VouchersController = VouchersController = __decorate([
    (0, swagger_1.ApiTags)('Mobile Vouchers'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(mobile_exception_filter_1.MobileExceptionFilter),
    (0, common_1.Controller)('vouchers'),
    __metadata("design:paramtypes", [voucher_service_1.VoucherService])
], VouchersController);
//# sourceMappingURL=vouchers.controller.js.map