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
exports.VoucherController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const voucher_service_1 = require("../services/voucher.service");
const create_voucher_dto_1 = require("../dto/create-voucher.dto");
const update_voucher_dto_1 = require("../dto/update-voucher.dto");
const update_voucher_request_dto_1 = require("../dto/update-voucher-request.dto");
let VoucherController = class VoucherController {
    voucherService;
    constructor(voucherService) {
        this.voucherService = voucherService;
    }
    createVoucher(createVoucherDto) {
        return this.voucherService.createVoucher(createVoucherDto);
    }
    findAllVouchers() {
        return this.voucherService.findAllVouchers();
    }
    findVoucherById(id) {
        return this.voucherService.findVoucherById(id);
    }
    updateVoucher(id, updateVoucherDto) {
        return this.voucherService.updateVoucher(id, updateVoucherDto);
    }
    removeVoucher(id) {
        return this.voucherService.removeVoucher(id);
    }
    findAllVoucherRequests() {
        return this.voucherService.findAllVoucherRequests();
    }
    findVoucherRequestById(id) {
        return this.voucherService.findVoucherRequestById(id);
    }
    updateVoucherRequest(id, updateVoucherRequestDto) {
        return this.voucherService.updateVoucherRequest(id, updateVoucherRequestDto);
    }
    removeVoucherRequest(id) {
        return this.voucherService.removeVoucherRequest(id);
    }
};
exports.VoucherController = VoucherController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new voucher' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Voucher created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_voucher_dto_1.CreateVoucherDto]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "createVoucher", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vouchers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all vouchers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "findAllVouchers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get voucher by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Voucher not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "findVoucherById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update voucher by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Voucher not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_voucher_dto_1.UpdateVoucherDto]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "updateVoucher", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete voucher by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Voucher not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "removeVoucher", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all voucher requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all voucher requests' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "findAllVoucherRequests", null);
__decorate([
    (0, common_1.Get)('requests/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get voucher request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher request details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Voucher request not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "findVoucherRequestById", null);
__decorate([
    (0, common_1.Patch)('requests/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update voucher request status by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher request status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Voucher request not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_voucher_request_dto_1.UpdateVoucherRequestDto]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "updateVoucherRequest", null);
__decorate([
    (0, common_1.Delete)('requests/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete voucher request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher request deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Voucher request not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "removeVoucherRequest", null);
exports.VoucherController = VoucherController = __decorate([
    (0, swagger_1.ApiTags)('Admin Vouchers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('admin/vouchers'),
    __metadata("design:paramtypes", [voucher_service_1.VoucherService])
], VoucherController);
//# sourceMappingURL=voucher.controller.js.map