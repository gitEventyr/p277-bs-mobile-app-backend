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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const player_entity_1 = require("../../entities/player.entity");
const casino_action_entity_1 = require("../../entities/casino-action.entity");
const casino_entity_1 = require("../../entities/casino.entity");
const casino_api_service_1 = require("../../external/casino/casino-api.service");
let UsersService = class UsersService {
    playerRepository;
    casinoActionRepository;
    casinoRepository;
    casinoApiService;
    constructor(playerRepository, casinoActionRepository, casinoRepository, casinoApiService) {
        this.playerRepository = playerRepository;
        this.casinoActionRepository = casinoActionRepository;
        this.casinoRepository = casinoRepository;
        this.casinoApiService = casinoApiService;
    }
    async getProfile(userId) {
        const player = await this.playerRepository.findOne({
            where: { id: userId, is_deleted: false },
        });
        if (!player) {
            throw new common_1.NotFoundException('User not found');
        }
        const profile = {
            id: player.id,
            visitor_id: player.visitor_id,
            name: player.name,
            email: player.email,
            phone: player.phone,
            coins_balance: player.coins_balance,
            rp_balance: player.rp_balance,
            level: player.level,
            scratch_cards: player.scratch_cards,
            device_udid: player.device_udid,
            subscription_agreement: player.subscription_agreement,
            tnc_agreement: player.tnc_agreement,
            os: player.os,
            device: player.device,
            created_at: player.created_at,
            updated_at: player.updated_at,
            pid: player.pid,
            c: player.c,
            af_channel: player.af_channel,
            af_adset: player.af_adset,
            af_ad: player.af_ad,
            af_keywords: player.af_keywords,
            is_retargeting: player.is_retargeting,
            af_click_lookback: player.af_click_lookback,
            af_viewthrough_lookback: player.af_viewthrough_lookback,
            af_sub1: player.af_sub1,
            af_sub2: player.af_sub2,
            af_sub3: player.af_sub3,
            af_sub4: player.af_sub4,
            af_sub5: player.af_sub5,
            email_verified: player.email_verified,
            email_verified_at: player.email_verified_at,
            phone_verified: player.phone_verified,
            phone_verified_at: player.phone_verified_at,
        };
        return profile;
    }
    async getMobileProfile(userId) {
        const fullProfile = await this.getProfile(userId);
        const registrationOffers = await this.getRegistrationOffers(fullProfile.visitor_id);
        const depositConfirmed = await this.getDepositConfirmed(fullProfile.visitor_id);
        const mobileProfile = {
            id: fullProfile.id,
            visitor_id: fullProfile.visitor_id,
            name: fullProfile.name,
            email: fullProfile.email,
            phone: fullProfile.phone,
            coins_balance: fullProfile.coins_balance,
            rp_balance: fullProfile.rp_balance,
            level: fullProfile.level,
            scratch_cards: fullProfile.scratch_cards,
            email_verified: fullProfile.email_verified,
            email_verified_at: fullProfile.email_verified_at,
            phone_verified: fullProfile.phone_verified,
            phone_verified_at: fullProfile.phone_verified_at,
            registration_offers: registrationOffers,
            deposit_confirmed: depositConfirmed,
        };
        return mobileProfile;
    }
    async updateProfile(userId, updateProfileDto) {
        const player = await this.playerRepository.findOne({
            where: { id: userId, is_deleted: false },
        });
        if (!player) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateProfileDto.name !== undefined) {
            player.name = updateProfileDto.name;
        }
        if (updateProfileDto.email !== undefined) {
            if (updateProfileDto.email && updateProfileDto.email.trim()) {
                const trimmedEmail = updateProfileDto.email.trim();
                if (trimmedEmail !== player.email) {
                    const existingUser = await this.playerRepository.findOne({
                        where: { email: trimmedEmail, is_deleted: false },
                    });
                    if (existingUser && existingUser.id !== userId) {
                        throw new common_1.BadRequestException('This email address is already in use');
                    }
                }
            }
            player.email = updateProfileDto.email;
        }
        if (updateProfileDto.phone !== undefined) {
            if (updateProfileDto.phone && updateProfileDto.phone.trim()) {
                const trimmedPhone = updateProfileDto.phone.trim();
                if (trimmedPhone !== player.phone) {
                    const existingUser = await this.playerRepository.findOne({
                        where: { phone: trimmedPhone, is_deleted: false },
                    });
                    if (existingUser && existingUser.id !== userId) {
                        throw new common_1.BadRequestException('This phone number is already in use');
                    }
                }
            }
            player.phone = updateProfileDto.phone;
        }
        if (updateProfileDto.deviceUDID !== undefined) {
            player.device_udid = updateProfileDto.deviceUDID;
        }
        if (updateProfileDto.os !== undefined) {
            player.os = updateProfileDto.os;
        }
        if (updateProfileDto.device !== undefined) {
            player.device = updateProfileDto.device;
        }
        if (updateProfileDto.level !== undefined) {
            player.level = updateProfileDto.level;
        }
        if (updateProfileDto.scratch_cards !== undefined) {
            player.scratch_cards = updateProfileDto.scratch_cards;
        }
        const updatedPlayer = await this.playerRepository.save(player);
        return this.getProfile(updatedPlayer.id);
    }
    async findById(userId) {
        return await this.playerRepository.findOne({
            where: { id: userId, is_deleted: false },
        });
    }
    async getTotalUsersCount() {
        return await this.playerRepository.count({ where: { is_deleted: false } });
    }
    async getActiveUsersCount() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return await this.playerRepository
            .createQueryBuilder('player')
            .where('player.is_deleted = false')
            .andWhere('player.updated_at >= :thirtyDaysAgo', { thirtyDaysAgo })
            .getCount();
    }
    async getTotalBalance() {
        const result = await this.playerRepository
            .createQueryBuilder('player')
            .select('SUM(player.coins_balance)', 'total')
            .where('player.is_deleted = false')
            .getRawOne();
        return parseInt(result?.total || '0');
    }
    async getNewRegistrationsCount() {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        return await this.playerRepository
            .createQueryBuilder('player')
            .where('player.is_deleted = false')
            .andWhere('player.created_at >= :twentyFourHoursAgo', {
            twentyFourHoursAgo,
        })
            .getCount();
    }
    async findUsersForAdmin(options) {
        const { page, limit, search, status, sortBy, email_verified, phone_verified } = options;
        const skip = (page - 1) * limit;
        let query = this.playerRepository
            .createQueryBuilder('player')
            .where('player.is_deleted = false');
        if (search) {
            query = query.andWhere('(player.name ILIKE :search OR player.email ILIKE :search OR player.phone ILIKE :search OR player.visitor_id ILIKE :search)', { search: `%${search}%` });
        }
        if (status === 'active') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            query = query.andWhere('player.updated_at >= :thirtyDaysAgo', {
                thirtyDaysAgo,
            });
        }
        else if (status === 'inactive') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            query = query.andWhere('player.updated_at < :thirtyDaysAgo', {
                thirtyDaysAgo,
            });
        }
        if (email_verified === 'true') {
            query = query.andWhere('player.email_verified = true');
        }
        else if (email_verified === 'false') {
            query = query.andWhere('player.email_verified = false');
        }
        if (phone_verified === 'true') {
            query = query.andWhere('player.phone_verified = true');
        }
        else if (phone_verified === 'false') {
            query = query.andWhere('player.phone_verified = false');
        }
        const sortField = sortBy === 'name'
            ? 'player.name'
            : sortBy === 'email'
                ? 'player.email'
                : sortBy === 'coins_balance'
                    ? 'player.coins_balance'
                    : sortBy === 'rp_balance'
                        ? 'player.rp_balance'
                        : 'player.created_at';
        query = query.orderBy(sortField, 'DESC');
        const total = await query.getCount();
        const data = await query.skip(skip).take(limit).getMany();
        return { data, total };
    }
    async findByEmail(email) {
        return await this.playerRepository.findOne({
            where: { email, is_deleted: false },
        });
    }
    async createUser(createData) {
        const { name, email, phone, password } = createData;
        let visitorId;
        let attempts = 0;
        do {
            visitorId = this.generateVisitorId();
            attempts++;
            if (attempts > 10) {
                throw new common_1.BadRequestException('Unable to generate unique visitor ID');
            }
        } while (await this.playerRepository.findOne({
            where: { visitor_id: visitorId, is_deleted: false },
        }));
        const hashedPassword = await this.hashPassword(password);
        const player = this.playerRepository.create({
            visitor_id: visitorId,
            name,
            email,
            phone,
            password: hashedPassword,
            coins_balance: 10000,
            rp_balance: 0,
            level: 1,
            scratch_cards: 0,
        });
        const savedPlayer = await this.playerRepository.save(player);
        return this.getProfile(savedPlayer.id);
    }
    generateVisitorId() {
        return ('visitor_' +
            Math.random().toString(36).substr(2, 9) +
            Date.now().toString(36));
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }
    async getRegistrationOffers(visitorId) {
        try {
            const registeredActions = await this.casinoActionRepository.find({
                where: {
                    visitor_id: visitorId,
                    registration: true,
                },
                relations: ['casino'],
            });
            const depositActions = await this.casinoActionRepository.find({
                where: {
                    visitor_id: visitorId,
                    deposit: true,
                },
                relations: ['casino'],
            });
            const depositedCasinoNames = new Set(depositActions.map((action) => action.casino_name));
            const registeredOnlyCasinos = registeredActions.filter((action) => !depositedCasinoNames.has(action.casino_name));
            const casinoIds = [];
            for (const action of registeredOnlyCasinos) {
                const casino = await this.casinoRepository.findOne({
                    where: { casino_name: action.casino_name },
                });
                if (casino && casino.casino_id) {
                    const casinoIdNumber = parseInt(casino.casino_id);
                    if (!isNaN(casinoIdNumber) && !casinoIds.includes(casinoIdNumber)) {
                        casinoIds.push(casinoIdNumber);
                    }
                }
            }
            if (casinoIds.length === 0) {
                return [];
            }
            const casinoDetails = await this.casinoApiService.getCasinoDetails(visitorId, casinoIds);
            const registrationOffers = casinoDetails
                .filter((offer) => offer.is_active === true)
                .map((offer) => ({
                logo_url: offer.logo_url,
                id: offer.id,
                public_name: offer.public_name,
                offer_preheading: offer.offer_preheading,
                offer_heading: offer.offer_heading,
                offer_subheading: offer.offer_subheading,
                terms_and_conditions: offer.terms_and_conditions,
                offer_link: offer.offer_link,
                is_active: offer.is_active,
            }));
            return registrationOffers;
        }
        catch (error) {
            console.error('Error fetching registration offers:', error);
            return [];
        }
    }
    async getDepositConfirmed(visitorId) {
        try {
            const depositActions = await this.casinoActionRepository
                .createQueryBuilder('ca')
                .where('ca.visitor_id = :visitorId', { visitorId })
                .andWhere('ca.deposit = true')
                .orderBy('ca.date_of_action', 'ASC')
                .getMany();
            const casinoDepositsMap = new Map();
            depositActions.forEach((action) => {
                if (!casinoDepositsMap.has(action.casino_name)) {
                    casinoDepositsMap.set(action.casino_name, action);
                }
                else {
                    const existing = casinoDepositsMap.get(action.casino_name);
                    if (action.date_of_action > existing.date_of_action) {
                        casinoDepositsMap.set(action.casino_name, action);
                    }
                }
            });
            const casinoIds = [];
            const casinoIdToNameMap = new Map();
            for (const [casinoName] of casinoDepositsMap) {
                const casino = await this.casinoRepository.findOne({
                    where: { casino_name: casinoName },
                });
                if (casino && casino.casino_id) {
                    const casinoIdNumber = parseInt(casino.casino_id);
                    if (!isNaN(casinoIdNumber)) {
                        casinoIds.push(casinoIdNumber);
                        casinoIdToNameMap.set(casinoIdNumber, casinoName);
                    }
                }
            }
            if (casinoIds.length === 0) {
                return [];
            }
            const casinoDetails = await this.casinoApiService.getCasinoDetails(visitorId, casinoIds);
            const firstDepositDate = Math.min(...depositActions.map((action) => action.date_of_action.getTime()));
            const depositConfirmed = [];
            for (const offer of casinoDetails) {
                const casinoName = casinoIdToNameMap.get(offer.id);
                if (casinoName) {
                    const depositAction = casinoDepositsMap.get(casinoName);
                    if (depositAction) {
                        const isFirstDeposit = depositAction.date_of_action.getTime() === firstDepositDate;
                        depositConfirmed.push({
                            public_name: offer.public_name,
                            action_date: depositAction.date_of_action,
                            rp_value: isFirstDeposit ? 2000 : 1000,
                        });
                    }
                }
            }
            return depositConfirmed;
        }
        catch (error) {
            console.error('Error fetching deposit confirmed data:', error);
            return [];
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(1, (0, typeorm_1.InjectRepository)(casino_action_entity_1.CasinoAction)),
    __param(2, (0, typeorm_1.InjectRepository)(casino_entity_1.Casino)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        casino_api_service_1.CasinoApiService])
], UsersService);
//# sourceMappingURL=users.service.js.map