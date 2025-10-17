"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
const player_entity_1 = require("../../entities/player.entity");
const admin_user_entity_1 = require("../../entities/admin-user.entity");
const casino_action_entity_1 = require("../../entities/casino-action.entity");
let AuthService = class AuthService {
    playerRepository;
    adminRepository;
    casinoActionRepository;
    jwtService;
    constructor(playerRepository, adminRepository, casinoActionRepository, jwtService) {
        this.playerRepository = playerRepository;
        this.adminRepository = adminRepository;
        this.casinoActionRepository = casinoActionRepository;
        this.jwtService = jwtService;
    }
    async generateJwtToken(payload) {
        return this.jwtService.sign(payload);
    }
    async verifyJwtToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    async comparePasswords(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    generateResetToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
    generateResetCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async validateUser(payload) {
        if (payload.type === 'user') {
            const userId = typeof payload.sub === 'string' ? parseInt(payload.sub) : payload.sub;
            return this.validatePlayer(userId, payload.token_version);
        }
        else if (payload.type === 'admin') {
            const adminId = typeof payload.sub === 'number' ? payload.sub.toString() : payload.sub;
            return this.validateAdmin(adminId);
        }
        return null;
    }
    async validatePlayer(playerId, tokenVersion) {
        const player = await this.playerRepository.findOne({
            where: { id: playerId, is_deleted: false },
            select: [
                'id',
                'email',
                'name',
                'visitor_id',
                'coins_balance',
                'level',
                'scratch_cards',
                'is_deleted',
                'avatar',
                'token_version',
            ],
        });
        if (!player || player.is_deleted) {
            return null;
        }
        if (tokenVersion !== undefined &&
            player.token_version !== undefined &&
            tokenVersion !== player.token_version) {
            return null;
        }
        return {
            id: typeof player.id === 'string' ? parseInt(player.id) : player.id,
            email: player.email,
            name: player.name,
            visitor_id: player.visitor_id,
            coins_balance: player.coins_balance,
            level: player.level,
            scratch_cards: player.scratch_cards,
            avatar: player.avatar,
        };
    }
    async validateAdmin(adminId) {
        const admin = await this.adminRepository.findOne({
            where: { id: adminId, is_active: true },
            select: ['id', 'email', 'display_name', 'is_active'],
        });
        if (!admin) {
            return null;
        }
        await this.adminRepository.update(adminId, {
            last_login_at: new Date(),
        });
        return {
            id: admin.id,
            email: admin.email,
            display_name: admin.display_name,
            is_active: admin.is_active,
        };
    }
    createSessionUser(user, type) {
        return {
            userId: typeof user.id === 'string' ? parseInt(user.id) : user.id,
            email: user.email,
            type,
        };
    }
    async softDeleteAccount(userId) {
        try {
            const user = await this.playerRepository.findOne({
                where: { id: userId, is_deleted: false },
                select: [
                    'id',
                    'email',
                    'name',
                    'phone',
                    'visitor_id',
                    'device_udid',
                    'auth_user_id',
                    'avatar',
                ],
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found or already deleted');
            }
            const timestamp = new Date().getTime();
            const anonymizedId = this.generateAnonymizedString(12);
            const updateData = {
                is_deleted: true,
                deleted_at: new Date(),
                deletion_reason: 'Mobile app account deletion',
                name: `deleted_user_${anonymizedId}`,
                email: user.email ? `deleted_${anonymizedId}@deleted.local` : null,
                phone: user.phone ? `+00000${anonymizedId.substring(0, 8)}` : null,
                password: null,
                device_udid: null,
                auth_user_id: null,
                avatar: null,
                pid: null,
                c: null,
                af_channel: null,
                af_adset: null,
                af_ad: null,
                af_keywords: null,
                is_retargeting: null,
                af_click_lookback: null,
                af_viewthrough_lookback: null,
                af_sub1: null,
                af_sub2: null,
                af_sub3: null,
                af_sub4: null,
                af_sub5: null,
                updated_at: new Date(),
            };
            await this.playerRepository.update({ id: userId }, updateData);
        }
        catch (error) {
            console.error('Error during soft delete:', error);
            throw new common_1.BadRequestException('Database operation failed');
        }
    }
    generateAnonymizedString(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async logout() {
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(1, (0, typeorm_1.InjectRepository)(admin_user_entity_1.AdminUser)),
    __param(2, (0, typeorm_1.InjectRepository)(casino_action_entity_1.CasinoAction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map