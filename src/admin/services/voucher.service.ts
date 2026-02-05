import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from '../../entities/voucher.entity';
import { VoucherRequest, VoucherRequestStatus } from '../../entities/voucher-request.entity';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { UpdateVoucherDto } from '../dto/update-voucher.dto';
import { UpdateVoucherRequestDto } from '../dto/update-voucher-request.dto';
import { OneSignalService } from '../../external/onesignal/onesignal.service';

@Injectable()
export class VoucherService {
  private readonly logger = new Logger(VoucherService.name);

  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    @InjectRepository(VoucherRequest)
    private voucherRequestRepository: Repository<VoucherRequest>,
    private readonly oneSignalService: OneSignalService,
  ) {}

  // Voucher CRUD operations
  async createVoucher(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    const voucher = this.voucherRepository.create(createVoucherDto);
    return await this.voucherRepository.save(voucher);
  }

  async findAllVouchers(): Promise<Voucher[]> {
    return await this.voucherRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findVoucherById(id: number): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({ where: { id } });
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
    return voucher;
  }

  async updateVoucher(
    id: number,
    updateVoucherDto: UpdateVoucherDto,
  ): Promise<Voucher> {
    await this.findVoucherById(id); // Check if exists
    await this.voucherRepository.update(id, updateVoucherDto);
    return this.findVoucherById(id);
  }

  async removeVoucher(id: number): Promise<void> {
    await this.findVoucherById(id); // Check if exists

    // Check if voucher has any associated requests
    const requestCount = await this.voucherRequestRepository.count({
      where: { voucher_id: id },
    });

    if (requestCount > 0) {
      throw new BadRequestException(
        `Cannot delete voucher with ID ${id} because it has ${requestCount} associated voucher request(s). Please delete or reassign the requests first.`,
      );
    }

    await this.voucherRepository.delete(id);
  }

  // Voucher Request CRUD operations
  async findAllVoucherRequests(status?: string): Promise<VoucherRequest[]> {
    let query = this.voucherRequestRepository
      .createQueryBuilder('voucherRequest')
      .leftJoinAndSelect('voucherRequest.user', 'user')
      .leftJoinAndSelect('voucherRequest.voucher', 'voucher')
      .select([
        'voucherRequest.id',
        'voucherRequest.user_id',
        'voucherRequest.voucher_id',
        'voucherRequest.request_date',
        'voucherRequest.status',
        'voucherRequest.created_at',
        'voucherRequest.updated_at',
        'user.id',
        'user.name',
        'user.email',
        'user.visitor_id',
        'voucher.id',
        'voucher.name',
        'voucher.type',
        'voucher.rp_price',
        'voucher.amazon_vouchers_equivalent',
      ]);

    // Filter by status if provided
    if (status) {
      query = query.where('voucherRequest.status = :status', { status });
    }

    return await query.orderBy('voucherRequest.created_at', 'DESC').getMany();
  }

  async findVoucherRequestById(id: number): Promise<VoucherRequest> {
    const voucherRequest = await this.voucherRequestRepository
      .createQueryBuilder('voucherRequest')
      .leftJoinAndSelect('voucherRequest.user', 'user')
      .leftJoinAndSelect('voucherRequest.voucher', 'voucher')
      .select([
        'voucherRequest.id',
        'voucherRequest.user_id',
        'voucherRequest.voucher_id',
        'voucherRequest.request_date',
        'voucherRequest.status',
        'voucherRequest.created_at',
        'voucherRequest.updated_at',
        'user.id',
        'user.name',
        'user.email',
        'user.visitor_id',
        'voucher.id',
        'voucher.name',
        'voucher.type',
        'voucher.rp_price',
        'voucher.amazon_vouchers_equivalent',
      ])
      .where('voucherRequest.id = :id', { id })
      .getOne();

    if (!voucherRequest) {
      throw new NotFoundException(`Voucher request with ID ${id} not found`);
    }
    return voucherRequest;
  }

  async updateVoucherRequest(
    id: number,
    updateVoucherRequestDto: UpdateVoucherRequestDto,
  ): Promise<VoucherRequest> {
    const existingRequest = await this.findVoucherRequestById(id); // Check if exists
    await this.voucherRequestRepository.update(id, updateVoucherRequestDto);
    const updatedRequest = await this.findVoucherRequestById(id);

    // Send OneSignal tags if voucher is marked as SENT
    if (
      updateVoucherRequestDto.status === VoucherRequestStatus.SENT &&
      existingRequest.status !== VoucherRequestStatus.SENT
    ) {
      await this.sendVoucherSentTags(updatedRequest);
    }

    return updatedRequest;
  }

  /**
   * Send OneSignal tags when voucher is marked as sent
   */
  private async sendVoucherSentTags(
    voucherRequest: VoucherRequest,
  ): Promise<void> {
    try {
      const visitorId = voucherRequest.user?.visitor_id;
      if (!visitorId) {
        this.logger.warn(
          `Cannot send voucher tags: visitor_id not found for user ${voucherRequest.user_id}`,
        );
        return;
      }

      // Count previous SENT vouchers for this user to determine N
      const previousSentCount = await this.voucherRequestRepository.count({
        where: {
          user_id: voucherRequest.user_id,
          status: VoucherRequestStatus.SENT,
        },
      });

      const voucherNumber = previousSentCount; // This is the Nth voucher (1, 2, 3, etc.)

      // Get voucher details
      const realValue =
        voucherRequest.voucher?.amazon_vouchers_equivalent?.toString() || '0';
      const voucherType = voucherRequest.voucher?.type || 'Unknown';

      // Prepare tags
      const tags: Record<string, string> = {
        [`voucher_${voucherNumber}_date`]: new Date().toISOString(),
        [`voucher_${voucherNumber}_Real_Value`]: realValue,
        [`voucher_${voucherNumber}_Type`]: voucherType,
      };

      this.logger.log(
        `Sending voucher tags for user ${voucherRequest.user_id} (visitor: ${visitorId}): voucher #${voucherNumber}`,
      );

      await this.oneSignalService.updateUserTags(visitorId, tags);
    } catch (error) {
      this.logger.error(
        `Failed to send voucher tags for request ${voucherRequest.id}`,
        error,
      );
    }
  }

  async removeVoucherRequest(id: number): Promise<void> {
    await this.findVoucherRequestById(id); // Check if exists
    await this.voucherRequestRepository.delete(id);
  }
}
