import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { BalanceService } from './balance.service';
import { Player } from '../../entities/player.entity';
import { CoinsBalanceChange } from '../../entities/coins-balance-change.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BalanceService', () => {
  let service: BalanceService;
  let playerRepository: any;
  let balanceChangeRepository: any;
  let dataSource: any;
  let queryRunner: any;

  beforeEach(async () => {
    // Mock QueryRunner
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      },
    };

    // Mock DataSource
    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    };

    const playerRepositoryMock = {
      findOne: jest.fn(),
    };

    const balanceChangeRepositoryMock = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: getRepositoryToken(Player),
          useValue: playerRepositoryMock,
        },
        {
          provide: getRepositoryToken(CoinsBalanceChange),
          useValue: balanceChangeRepositoryMock,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    playerRepository = module.get(getRepositoryToken(Player));
    balanceChangeRepository = module.get(getRepositoryToken(CoinsBalanceChange));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should return user balance and scratch cards', async () => {
      const mockPlayer = {
        id: 1,
        coins_balance: 1000,
        scratch_cards: 5,
      };

      playerRepository.findOne.mockResolvedValue(mockPlayer);

      const result = await service.getBalance(1);

      expect(result).toEqual({
        coins_balance: 1000,
        scratch_cards: 5,
      });
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'coins_balance', 'scratch_cards'],
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      playerRepository.findOne.mockResolvedValue(null);

      await expect(service.getBalance(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('increaseBalance', () => {
    it('should throw BadRequestException for non-positive amount', async () => {
      const balanceChangeDto = { amount: 0, mode: 'game_win' };

      await expect(service.increaseBalance(1, balanceChangeDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('decreaseBalance', () => {
    it('should throw BadRequestException for non-positive amount', async () => {
      const balanceChangeDto = { amount: -10, mode: 'bet' };

      await expect(service.decreaseBalance(1, balanceChangeDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getTransactionHistory', () => {
    it('should return paginated transaction history', async () => {
      const mockTransactions = [
        {
          id: 1,
          user_id: 1,
          balance_before: 1000,
          balance_after: 1100,
          amount: 100,
          mode: 'game_win',
          status: 'completed',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      balanceChangeRepository.findAndCount.mockResolvedValue([
        mockTransactions,
        1,
      ]);

      const result = await service.getTransactionHistory(1, 1, 10);

      expect(result).toEqual({
        data: mockTransactions,
        total: 1,
        page: 1,
        limit: 10,
        pages: 1,
      });
    });
  });

  describe('getTransactionById', () => {
    it('should return transaction when found', async () => {
      const mockTransaction = {
        id: 1,
        user_id: 1,
        balance_before: 1000,
        balance_after: 1100,
        amount: 100,
        mode: 'game_win',
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date(),
      };

      balanceChangeRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.getTransactionById(1, 1);

      expect(result).toEqual(mockTransaction);
      expect(balanceChangeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user_id: 1 },
      });
    });

    it('should throw NotFoundException when transaction not found', async () => {
      balanceChangeRepository.findOne.mockResolvedValue(null);

      await expect(service.getTransactionById(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('adminAdjustBalance', () => {
    it('should create proper balance change DTO for positive adjustment', async () => {
      const increaseSpy = jest
        .spyOn(service, 'increaseBalance')
        .mockResolvedValue({} as any);

      await service.adminAdjustBalance(1, 100, 'compensation');

      expect(increaseSpy).toHaveBeenCalledWith(1, {
        amount: 100,
        mode: 'admin_adjustment_increase_compensation',
      });
    });

    it('should create proper balance change DTO for negative adjustment', async () => {
      const decreaseSpy = jest
        .spyOn(service, 'decreaseBalance')
        .mockResolvedValue({} as any);

      await service.adminAdjustBalance(1, -50, 'penalty');

      expect(decreaseSpy).toHaveBeenCalledWith(1, {
        amount: 50,
        mode: 'admin_adjustment_decrease_penalty',
      });
    });
  });
});