import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { QueryFailedError } from 'typeorm';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GlobalExceptionFilter],
    }).compile();

    filter = moduleRef.get<GlobalExceptionFilter>(GlobalExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HTTP exceptions correctly', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockRequest = {
      method: 'GET',
      url: '/test',
    };

    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };

    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Test error',
    });
  });

  it('should handle database duplicate key errors', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockRequest = {
      method: 'POST',
      url: '/test',
    };

    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };

    // Mock QueryFailedError with duplicate key message
    const dbError = new QueryFailedError(
      '',
      '',
      new Error('duplicate key email'),
    );
    Object.assign(dbError, { message: 'duplicate key email' });

    filter.catch(dbError, mockHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Email already exists',
    });
  });
});
