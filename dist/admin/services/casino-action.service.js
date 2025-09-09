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
exports.CasinoActionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const casino_action_entity_1 = require("../../entities/casino-action.entity");
const casino_entity_1 = require("../../entities/casino.entity");
const player_entity_1 = require("../../entities/player.entity");
const casino_api_service_1 = require("../../external/casino/casino-api.service");
let CasinoActionService = class CasinoActionService {
    casinoActionRepository;
    casinoRepository;
    playerRepository;
    casinoApiService;
    constructor(casinoActionRepository, casinoRepository, playerRepository, casinoApiService) {
        this.casinoActionRepository = casinoActionRepository;
        this.casinoRepository = casinoRepository;
        this.playerRepository = playerRepository;
        this.casinoApiService = casinoApiService;
    }
    async findAll(options) {
        const { page, limit, search, casinoName, registration, deposit, sortBy } = options;
        const skip = (page - 1) * limit;
        const whereConditions = {};
        if (search) {
            whereConditions.visitor_id = (0, typeorm_2.Like)(`%${search}%`);
        }
        if (casinoName) {
            whereConditions.casino_name = casinoName;
        }
        if (registration === 'true') {
            whereConditions.registration = true;
        }
        else if (registration === 'false') {
            whereConditions.registration = false;
        }
        if (deposit === 'true') {
            whereConditions.deposit = true;
        }
        else if (deposit === 'false') {
            whereConditions.deposit = false;
        }
        const order = {};
        order[sortBy] = 'DESC';
        const [data, total] = await this.casinoActionRepository.findAndCount({
            where: whereConditions,
            order,
            skip,
            take: limit,
            relations: ['casino', 'player'],
        });
        const totalPages = Math.ceil(total / limit);
        const from = (page - 1) * limit + 1;
        const to = Math.min(page * limit, total);
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push({
                number: i,
                active: i === page,
            });
        }
        return {
            data,
            pagination: {
                total,
                from,
                to,
                currentPage: page,
                totalPages,
                hasPages: totalPages > 1,
                hasPrev: page > 1,
                hasNext: page < totalPages,
                prevPage: page - 1,
                nextPage: page + 1,
                pages,
            },
        };
    }
    async findById(id) {
        return await this.casinoActionRepository.findOne({
            where: { id },
            relations: ['casino', 'player'],
        });
    }
    async create(createData) {
        const casinoAction = this.casinoActionRepository.create(createData);
        return await this.casinoActionRepository.save(casinoAction);
    }
    async update(id, updateData) {
        await this.casinoActionRepository.update(id, updateData);
        const casinoAction = await this.findById(id);
        if (!casinoAction) {
            throw new Error('Casino action not found after update');
        }
        return casinoAction;
    }
    async delete(id) {
        await this.casinoActionRepository.delete(id);
    }
    async count() {
        return await this.casinoActionRepository.count();
    }
    async countByCasino(casinoName) {
        return await this.casinoActionRepository.count({
            where: { casino_name: casinoName },
        });
    }
    async countByType(type) {
        const where = type === 'registration' ? { registration: true } : { deposit: true };
        return await this.casinoActionRepository.count({ where });
    }
    async bulkCreateFromCSV(csvContent, options) {
        const lines = csvContent.trim().split('\n');
        if (lines.length < 2) {
            throw new common_1.BadRequestException('CSV file must contain headers and at least one data row');
        }
        const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
        const expectedHeaders = [
            'casino_name',
            'visitor_id',
            'date_of_action',
            'registration',
            'deposit',
        ];
        const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
        if (missingHeaders.length > 0) {
            throw new common_1.BadRequestException(`Missing required headers: ${missingHeaders.join(', ')}`);
        }
        const results = {
            totalRows: lines.length - 1,
            successfulRows: 0,
            errorRows: 0,
            skippedRows: 0,
            errors: [],
            createdCasinos: 0,
            createdPlayers: 0,
        };
        const createdCasinoNames = new Set();
        const createdPlayerIds = new Set();
        let externalCasinos = null;
        const fetchExternalCasinos = async () => {
            if (externalCasinos === null && this.casinoApiService.isConfigured()) {
                try {
                    externalCasinos = await this.casinoApiService.getCasinos();
                }
                catch (error) {
                    console.warn('Failed to fetch external casinos:', error.message);
                    externalCasinos = [];
                }
            }
            return externalCasinos || [];
        };
        for (let i = 1; i < lines.length; i++) {
            try {
                const rowData = this.parseCSVRow(lines[i]);
                if (rowData.length !== headers.length) {
                    throw new Error(`Row has ${rowData.length} columns but expected ${headers.length}`);
                }
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = rowData[index];
                });
                const casinoActionData = await this.validateAndParseCSVRow(row, i + 1);
                let existingCasino = await this.casinoRepository.findOne({
                    where: { casino_name: casinoActionData.casino_name },
                });
                if (!existingCasino &&
                    !createdCasinoNames.has(casinoActionData.casino_name)) {
                    if (options.createMissingCasinos) {
                        const externalCasinosList = await fetchExternalCasinos();
                        const matchingExternalCasino = externalCasinosList.find((external) => {
                            if (external.admin_name === casinoActionData.casino_name) {
                                return true;
                            }
                            if (external.admin_name.toLowerCase() ===
                                casinoActionData.casino_name.toLowerCase()) {
                                return true;
                            }
                            const normalizeString = (str) => {
                                return str
                                    .toLowerCase()
                                    .replace(/[–-]/g, '-')
                                    .replace(/\s*–\s*bns!?/gi, '')
                                    .replace(/\s*-\s*bns!?/gi, '')
                                    .replace(/\s*bns!?$/gi, '')
                                    .replace(/\s*-\s*(fr|ca|en)\s*$/gi, '')
                                    .replace(/\s+/g, ' ')
                                    .trim();
                            };
                            const normalizedExternal = normalizeString(external.admin_name);
                            const normalizedCsv = normalizeString(casinoActionData.casino_name);
                            if (normalizedExternal === normalizedCsv) {
                                return true;
                            }
                            if (normalizedExternal.includes(normalizedCsv) ||
                                normalizedCsv.includes(normalizedExternal)) {
                                const shorterLength = Math.min(normalizedExternal.length, normalizedCsv.length);
                                return shorterLength >= 5;
                            }
                            return false;
                        });
                        if (matchingExternalCasino) {
                            const duplicateByExternalId = await this.casinoRepository.findOne({
                                where: { casino_id: matchingExternalCasino.id.toString() },
                            });
                            if (duplicateByExternalId) {
                                console.log(`✓ Found existing casino with casino_id '${matchingExternalCasino.id}': '${duplicateByExternalId.casino_name}'. Using existing casino for CSV name '${casinoActionData.casino_name}'.`);
                                existingCasino = duplicateByExternalId;
                            }
                            else {
                                existingCasino = await this.casinoRepository.save({
                                    casino_name: matchingExternalCasino.admin_name,
                                    casino_id: matchingExternalCasino.id.toString(),
                                });
                                createdCasinoNames.add(matchingExternalCasino.admin_name);
                                results.createdCasinos++;
                                console.log(`✓ Created new casino '${matchingExternalCasino.admin_name}' (was '${casinoActionData.casino_name}' in CSV) with external ID: ${matchingExternalCasino.id}`);
                            }
                        }
                        else {
                            console.log(`✗ No match found for '${casinoActionData.casino_name}'`);
                            console.log(`Available external casinos: ${externalCasinosList
                                .slice(0, 10)
                                .map((c) => `'${c.admin_name}'`)
                                .join(', ')}${externalCasinosList.length > 10 ? ` ... (and ${externalCasinosList.length - 10} more)` : ''}`);
                            throw new Error(`Casino '${casinoActionData.casino_name}' not found in internal system or external API`);
                        }
                    }
                    else {
                        throw new Error(`Casino '${casinoActionData.casino_name}' does not exist`);
                    }
                }
                let playerExists = false;
                if (options.createMissingPlayers) {
                    const existingPlayer = await this.playerRepository.findOne({
                        where: { visitor_id: casinoActionData.visitor_id },
                    });
                    if (!existingPlayer &&
                        !createdPlayerIds.has(casinoActionData.visitor_id)) {
                        await this.playerRepository.save({
                            visitor_id: casinoActionData.visitor_id,
                        });
                        createdPlayerIds.add(casinoActionData.visitor_id);
                        results.createdPlayers++;
                        playerExists = true;
                    }
                    else if (existingPlayer ||
                        createdPlayerIds.has(casinoActionData.visitor_id)) {
                        playerExists = true;
                    }
                }
                else {
                    const existingPlayer = await this.playerRepository.findOne({
                        where: { visitor_id: casinoActionData.visitor_id },
                    });
                    playerExists = !!existingPlayer;
                }
                if (!playerExists) {
                    throw new Error(`Player with visitor_id '${casinoActionData.visitor_id}' does not exist`);
                }
                await this.create({
                    ...casinoActionData,
                    casino_name: existingCasino.casino_name,
                });
                results.successfulRows++;
            }
            catch (error) {
                if (error.message.includes('not found in internal system or external API')) {
                    results.skippedRows++;
                    results.errors.push({
                        row: i + 1,
                        message: `Skipped: ${error.message}`,
                    });
                    continue;
                }
                results.errorRows++;
                results.errors.push({
                    row: i + 1,
                    message: error.message,
                });
                if (!options.skipErrors) {
                    throw new common_1.BadRequestException(`Error on row ${i + 1}: ${error.message}`);
                }
            }
        }
        return results;
    }
    parseCSVRow(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                }
                else {
                    inQuotes = !inQuotes;
                }
            }
            else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            }
            else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }
    async validateAndParseCSVRow(row, rowNumber) {
        if (!row.casino_name || row.casino_name.trim() === '') {
            throw new Error('casino_name is required');
        }
        if (!row.visitor_id || row.visitor_id.trim() === '') {
            throw new Error('visitor_id is required');
        }
        let dateOfAction;
        try {
            dateOfAction = new Date(row.date_of_action);
            if (isNaN(dateOfAction.getTime())) {
                throw new Error('Invalid date format');
            }
        }
        catch (error) {
            throw new Error('date_of_action must be a valid date (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)');
        }
        const registration = this.parseBoolean(row.registration, 'registration');
        const deposit = this.parseBoolean(row.deposit, 'deposit');
        return {
            casino_name: row.casino_name.trim(),
            visitor_id: row.visitor_id.trim(),
            date_of_action: dateOfAction,
            registration,
            deposit,
        };
    }
    parseBoolean(value, fieldName) {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            const lowerValue = value.toLowerCase().trim();
            if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
                return true;
            }
            if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') {
                return false;
            }
        }
        throw new Error(`${fieldName} must be a boolean value (true/false, 1/0, yes/no)`);
    }
};
exports.CasinoActionService = CasinoActionService;
exports.CasinoActionService = CasinoActionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(casino_action_entity_1.CasinoAction)),
    __param(1, (0, typeorm_1.InjectRepository)(casino_entity_1.Casino)),
    __param(2, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        casino_api_service_1.CasinoApiService])
], CasinoActionService);
//# sourceMappingURL=casino-action.service.js.map