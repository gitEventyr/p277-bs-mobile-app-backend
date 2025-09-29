import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from '../../entities/voucher.entity';
import { VoucherRequest } from '../../entities/voucher-request.entity';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { UpdateVoucherDto } from '../dto/update-voucher.dto';
import { UpdateVoucherRequestDto } from '../dto/update-voucher-request.dto';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    @InjectRepository(VoucherRequest)
    private voucherRequestRepository: Repository<VoucherRequest>,
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
    await this.voucherRepository.delete(id);
  }

  // Voucher Request CRUD operations
  async findAllVoucherRequests(): Promise<VoucherRequest[]> {
    return await this.voucherRequestRepository.find({
      relations: ['user', 'voucher'],
      order: { created_at: 'DESC' },
    });
  }

  async findVoucherRequestById(id: number): Promise<VoucherRequest> {
    const voucherRequest = await this.voucherRequestRepository.findOne({
      where: { id },
      relations: ['user', 'voucher'],
    });
    if (!voucherRequest) {
      throw new NotFoundException(`Voucher request with ID ${id} not found`);
    }
    return voucherRequest;
  }

  async updateVoucherRequest(
    id: number,
    updateVoucherRequestDto: UpdateVoucherRequestDto,
  ): Promise<VoucherRequest> {
    await this.findVoucherRequestById(id); // Check if exists
    await this.voucherRequestRepository.update(id, updateVoucherRequestDto);
    return this.findVoucherRequestById(id);
  }

  async removeVoucherRequest(id: number): Promise<void> {
    await this.findVoucherRequestById(id); // Check if exists
    await this.voucherRequestRepository.delete(id);
  }
}
