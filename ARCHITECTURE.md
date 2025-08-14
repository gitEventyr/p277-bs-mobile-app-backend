# Casino Backend Architecture Documentation

## Overview

This document provides comprehensive architecture documentation for the NestJS-based casino backend application. The system is designed to support a complete casino gaming platform with user management, financial transactions, game sessions, promotional offers, and administrative controls.

## Table of Contents

1. [Database Architecture](#database-architecture)
2. [Application Architecture](#application-architecture)
3. [Feature Implementation Roadmap](#feature-implementation-roadmap)
4. [System Integration Points](#system-integration-points)
5. [Security & Performance](#security--performance)
6. [Implementation Guidelines](#implementation-guidelines)

## Database Architecture

### Core Entity Relationships

The database schema consists of 8 primary entities forming a comprehensive casino management system:

#### Primary Entities

**`players`** - Central user entity
- Comprehensive user tracking with coins balance, level progression
- AppsFlyer attribution integration (pid, c, af_prt, etc.) (just save fields in the database, no need to integrate with AppsFlyer)
- Email and name fields for communication
- Unique visitor_id for device tracking

**`admin_users`** - Administrative access control
- Separate authentication system for backend management
- Role-based access control capabilities (we will only have admin roles for now)

**`devices`** - Device tracking and geo-location
- Multi-device support per user
- IP-based geo-location tracking (country, region, city)
- Device fingerprinting with UDID
- User agent and platform detection

**`coins_balance_changes`** - Financial audit trail
- Complete transaction history
- Balance change tracking with timestamps
- Mode-based categorization (game_win, purchase, etc.)

**`play_history`** - Game session records
- Detailed game session tracking
- Bet amounts, win/loss records
- Integration with balance management

**`in_app_purchases`** - Mobile payment integration
- iOS purchase validation
- Receipt verification and processing
- Revenue tracking and analytics

**`vouchers`** & **`users_vouchers`** - Reward system
- Flexible voucher catalog with expiration dates
- Many-to-many relationship for user redemptions
- Promotional campaign support

**`offers`** - Marketing and promotions
- receiving offers from outside service and not storing them on our end, only display this data in the frontend and/or mobile app

#### Key Relationships

```
players (1) → (N) devices           # Multi-device support
players (1) → (N) coins_balance_changes  # Transaction history
players (1) → (N) play_history      # Game sessions
players (1) → (N) in_app_purchases  # Monetization
players (1) → (N) users_vouchers    # Reward redemptions
vouchers (1) → (N) users_vouchers   # Shared catalog
admin_users → system management     # Administrative control
```

### Data Flow Patterns

1. **User Onboarding Flow**
   ```
   User registers in mobile app (including AppsFlyer attribution data) → Information is sent to backend (we also extract user location from the request's ip) → Backend uses a call to an external API to get visitor_id → information is saved to players table → data returns to app
   ```

2. **Financial Transaction Flow**
   ```
   Mobile app Action → balance_changes → players.coins_balance update → audit trail
   ```

## Application Architecture

### Technology Stack

**Core Framework**: NestJS with TypeScript
**Database**: PostgreSQL with TypeORM (auto-sync enabled)
**Session Management**: Redis with express-session
**Authentication**: Cookie-based sessions with JWT support
**API Documentation**: Swagger UI available at `/api`
**Security**: Helmet, CORS, global validation

### Module Structure

```
src/
├── common/                    # Shared infrastructure
│   ├── filters/              # Global exception filter
│   ├── interceptors/         # Response interceptor
│   ├── guards/               # Authentication guards
│   ├── decorators/           # Custom decorators
│   ├── dto/                  # Base DTOs
│   └── middleware/           # Custom middleware
├── config/                   # Configuration management
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── session.config.ts
│   └── swagger.config.ts
├── auth/                     # Authentication & authorization
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── local-auth.guard.ts
│   │   └── admin-auth.guard.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   └── services/
│       └── auth.service.ts
├── users/                    # Player management
│   ├── entities/
│   │   └── player.entity.ts
│   ├── dto/
│   │   ├── create-player.dto.ts
│   │   ├── update-player.dto.ts
│   │   └── player-response.dto.ts
│   ├── services/
│   │   └── users.service.ts
│   └── controllers/
│       └── users.controller.ts
├── admin/                    # Admin dashboard functionality
│   ├── entities/
│   │   └── admin-user.entity.ts
│   ├── dto/
│   ├── services/
│   │   └── admin.service.ts
│   └── controllers/
│       └── admin.controller.ts
├── devices/                  # Device tracking
│   ├── entities/
│   │   └── device.entity.ts
│   ├── services/
│   │   └── devices.service.ts
│   └── controllers/
│       └── devices.controller.ts
├── games/                    # Game sessions & history
│   ├── entities/
│   │   └── play-history.entity.ts
│   ├── services/
│   │   └── games.service.ts
│   └── controllers/
│       └── games.controller.ts
├── vouchers/                 # Reward system
│   ├── entities/
│   │   ├── voucher.entity.ts
│   │   └── user-voucher.entity.ts
│   ├── services/
│   │   └── vouchers.service.ts
│   └── controllers/
│       └── vouchers.controller.ts
├── purchases/                # In-app purchases
│   ├── entities/
│   │   └── in-app-purchase.entity.ts
│   ├── services/
│   │   └── purchases.service.ts
│   └── controllers/
│       └── purchases.controller.ts
└── external/                 # Third-party integrations
    ├── geolocation/
    │   └── geolocation.service.ts
    └── email/
        └── email.service.ts
```

### Core Entity Definitions

#### Player Entity
```typescript
@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  visitor_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'float', default: 0 })
  coins_balance: number;

  @Column({ default: 1 })
  level: number;

  // AppsFlyer attribution fields
  @Column({ nullable: true })
  pid: string;

  @Column({ nullable: true })
  c: string;

  @Column({ nullable: true })
  af_prt: string;

  @Column({ nullable: true })
  af_siteid: string;

  @Column({ nullable: true })
  af_sub1: string;

  @Column({ nullable: true })
  af_sub2: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relationships
  @OneToMany(() => Device, device => device.user)
  devices: Device[];

  @OneToMany(() => CoinsBalanceChange, change => change.user)
  balanceChanges: CoinsBalanceChange[];

  @OneToMany(() => PlayHistory, play => play.user)
  playHistory: PlayHistory[];

  @OneToMany(() => InAppPurchase, purchase => purchase.user)
  purchases: InAppPurchase[];

  @OneToMany(() => UserVoucher, userVoucher => userVoucher.user)
  userVouchers: UserVoucher[];
}
```

### API Endpoint Structure

#### Authentication Endpoints
```
POST /auth/register              # User registration
POST /auth/login                 # User login
POST /auth/forgot-password       # Password reset initiation
POST /auth/forgot-password/validate # Password reset validation
GET  /auth/me                    # Current user info
POST /auth/logout                # Session termination
```

#### User Management Endpoints
```
GET    /users/profile            # Get user profile
PUT    /users/profile            # Update user profile
GET    /users/level              # Get user level info
PUT    /users/level              # Update user level
GET    /users/balance            # Current balance & scratch cards
POST   /users/increase-balance   # Add funds (wins, purchases)
POST   /users/decrease-balance   # Deduct funds (bets)
GET    /users/history            # Transaction history
GET    /users/history/:id        # Specific transaction details
```

#### Game Endpoints
```
POST   /games/play-session       # Record game session
GET    /games/history            # Player's game history
GET    /games/history/:id        # Specific game session
GET    /games/stats              # Player game statistics
```

#### Admin Endpoints
```
POST   /admin/auth/login         # Admin authentication
GET    /admin/users              # User list with filtering
GET    /admin/users/:id          # Specific user details
PUT    /admin/users/:id          # Update user information
```

#### Voucher & Offer Endpoints
```
GET    /vouchers                 # Available vouchers
POST   /vouchers/:id/redeem      # Redeem voucher
GET    /vouchers/history         # Redemption history
```

## Feature Implementation Roadmap

### Phase 1: Core Infrastructure (Priority: Critical)
**Timeline**: Week 1-2

1. **Database Setup & Entities**
   - Complete TypeORM entity definitions
   - Database migrations and initial schema
   - Seed data for development

2. **Authentication System**
   - JWT strategy implementation
   - Redis session management
   - Password encryption and validation

3. **Authorization System**
   - User authentication guards
   - Admin role-based access control
   - Session validation middleware

4. **Global Infrastructure**
   - Enhanced exception filter
   - Request/response interceptors
   - Input validation pipes
   - Swagger API documentation

**Deliverables**:
- All database entities created and tested
- Authentication flow working end-to-end
- Admin authentication system
- API documentation available

### Phase 2: User Management (Priority: High)
**Timeline**: Week 3-4

1. **Registration & Onboarding**
   - Complete signup flow with validation
   - AppsFlyer attribution data storage (fields only)
   - Email verification system
   - Device fingerprinting and tracking

2. **User Authentication**
   - Login/logout functionality
   - Password recovery with Redis OTP
   - Multi-device session management
   - User profile management

3. **Device Management**
   - Geo-location integration
   - Device tracking and analytics
   - IP-based location detection
   - User agent parsing

**Deliverables**:
- Complete user registration and login
- Password recovery system
- Device tracking functionality
- User profile management

**Dependencies**: Phase 1 completion

### Phase 3: Financial System (Priority: High)
**Timeline**: Week 5-6

1. **Balance Management**
   - Transactional balance updates
   - Concurrent transaction handling
   - Balance validation and constraints
   - Real-time balance synchronization

2. **Transaction System**
   - Complete audit trail implementation
   - Transaction categorization
   - Balance change history

3. **Game Integration**
   - Game session recording (results from mobile app)
   - Balance updates based on game results
   - Play history tracking

**Deliverables**:
- Robust balance management system
- Complete transaction logging
- Game financial integration
- Transaction history API

**Dependencies**: Phase 1-2 completion

### Phase 4: Advanced Features (Priority: Low)
**Timeline**: Week 7-8

1. **Payment Integration**
   - In-app purchase processing
   - Receipt validation (iOS)
   - Payment reconciliation

**Deliverables**:
- Voucher redemption system
- In-app purchase integration

**Dependencies**: Phase 1-3 completion

## System Integration Points

### External Service Integrations

#### Geo-location Service
**Purpose**: IP-based location detection for compliance and analytics
```typescript
@Injectable()
export class GeolocationService {
  async getLocationByIP(ip: string): Promise<LocationData> {
    // Get IP from app requests
    // IP to location conversion
    // Country, region, city detection
    // Timezone determination
  }
}
```

#### Email Service Integration
**Purpose**: User communication and notifications
```typescript
@Injectable()
export class EmailService {
  async sendRegistrationConfirmation(email: string, token: string) {
    // Registration email
  }
  
  async sendPasswordReset(email: string, otp: string) {
    // Password reset email
  }
}
```

#### Mobile Payment Integration
**Purpose**: In-app purchase processing and validation
```typescript
@Injectable()
export class PaymentService {
  async validateIOSReceipt(receiptData: string) {
    // iOS receipt validation
  }
}
```

### Session & Security Management

#### Redis Session Configuration
```typescript
// Session configuration
{
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}
```

#### Authentication Strategy
- **Primary**: Cookie-based sessions for web clients
- **Secondary**: JWT tokens for mobile/API clients
- **Admin**: Separate authentication with elevated permissions
- **Security**: Rate limiting, CORS, input validation

## Security & Performance

### Security Measures

#### Data Protection
- **Password Encryption**: bcrypt with salt rounds
- **JWT Security**: Rotating secrets and expiration
- **Session Security**: Redis TTL and secure cookies
- **Input Validation**: Global validation pipes
- **SQL Injection**: TypeORM query builder protection

#### Access Control
```typescript
// Role-based access control
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  // Admin-only endpoints
}
```

#### Rate Limiting (Recommended Implementation)
```typescript
@Injectable()
export class RateLimitingGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Implement rate limiting logic
    // Redis-based request counting
    // IP and user-based limits
  }
}
```

### Performance Optimization

#### Database Indexing Strategy
```sql
-- Recommended indexes for optimal query performance
CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_players_visitor_id ON players(visitor_id);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_udid ON devices(udid);
CREATE INDEX idx_coins_balance_changes_user_id ON coins_balance_changes(user_id);
CREATE INDEX idx_play_history_user_id ON play_history(user_id);
CREATE INDEX idx_play_history_created_at ON play_history(created_at);
CREATE INDEX idx_in_app_purchases_user_id ON in_app_purchases(user_id);
```

#### Caching Strategy
```typescript
@Injectable()
export class CacheService {
  // User profile caching
  async getUserProfile(userId: number): Promise<Player> {
    const cacheKey = `user:profile:${userId}`;
    let profile = await this.redis.get(cacheKey);
    
    if (!profile) {
      profile = await this.userService.findById(userId);
      await this.redis.setex(cacheKey, 300, JSON.stringify(profile));
    }
    
    return JSON.parse(profile);
  }
  
  // Balance caching with shorter TTL
  async getUserBalance(userId: number): Promise<number> {
    const cacheKey = `user:balance:${userId}`;
    const balance = await this.redis.get(cacheKey);
    
    if (balance !== null) {
      return parseFloat(balance);
    }
    
    const player = await this.playerRepository.findOne({ where: { id: userId } });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    
    await this.redis.setex(cacheKey, 60, player.coins_balance.toString());
    
    return player.coins_balance;
  }
}
```

#### Connection Pooling
```typescript
// TypeORM connection configuration
{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000
  }
}
```

## Implementation Guidelines

### Service Layer Architecture

#### Transactional Services
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(CoinsBalanceChange)
    private balanceChangeRepository: Repository<CoinsBalanceChange>,
    private dataSource: DataSource
  ) {}

  async updateBalance(
    userId: number, 
    amount: number, 
    mode: string,
    description?: string
  ): Promise<Player> {
    return this.dataSource.transaction(async manager => {
      // Lock user record for update
      const player = await manager.findOne(Player, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!player) {
        throw new NotFoundException('Player not found');
      }

      // Validate balance constraints
      if (player.coins_balance + amount < 0) {
        throw new BadRequestException('Insufficient balance');
      }

      // Update balance
      player.coins_balance += amount;
      await manager.save(player);

      // Create audit record
      const balanceChange = this.balanceChangeRepository.create({
        user: player,
        amount,
        mode,
        description,
        balance_after: player.coins_balance
      });
      await manager.save(balanceChange);

      return player;
    });
  }
}
```

#### Error Handling Strategy
```typescript
// Custom business logic exceptions
export class GameSessionException extends BadRequestException {
  constructor(message: string) {
    super({
      success: false,
      statusCode: 400,
      message,
      error: 'GAME_SESSION_ERROR'
    });
  }
}
```

### Testing Strategy

#### Unit Testing
```typescript
describe('UsersService', () => {
  let service: UsersService;
  let mockPlayerRepository: MockRepository<Player>;
  let mockBalanceChangeRepository: MockRepository<CoinsBalanceChange>;
  let mockDataSource: MockDataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Player),
          useClass: MockRepository
        },
        {
          provide: getRepositoryToken(CoinsBalanceChange),
          useClass: MockRepository
        },
        {
          provide: DataSource,
          useClass: MockDataSource
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockPlayerRepository = module.get(getRepositoryToken(Player));
    mockBalanceChangeRepository = module.get(getRepositoryToken(CoinsBalanceChange));
    mockDataSource = module.get(DataSource);
  });

  describe('updateBalance', () => {
    it('should update player balance successfully', async () => {
      // Test implementation
    });

    it('should throw exception for insufficient balance', async () => {
      // Test implementation
    });
  });
});
```

#### Integration Testing
```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('should register new user successfully', () => {
      return request(httpServer)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })
        .expect(201)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user).toBeDefined();
        });
    });
  });
});
```

### Environment Configuration

#### Development Environment
```bash
# .env.development
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=casino_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
SESSION_SECRET=dev-session-secret
JWT_SECRET=dev-jwt-secret

# External Services
EMAIL_SERVICE_API_KEY=dev-email-key
GEOLOCATION_API_KEY=dev-geo-key
```

#### Production Environment
```bash
# .env.production
NODE_ENV=production
PORT=3000

# Database (use environment variables or secrets)
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}

# Redis
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}

# Security (use secrets management)
SESSION_SECRET=${SESSION_SECRET}
JWT_SECRET=${JWT_SECRET}

# External Services
EMAIL_SERVICE_API_KEY=${EMAIL_SERVICE_API_KEY}
GEOLOCATION_API_KEY=${GEOLOCATION_API_KEY}
```

## Monitoring & Logging

### Application Logging
```typescript
@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  logUserAction(userId: number, action: string, details?: any) {
    this.logger.log({
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  logFinancialTransaction(userId: number, amount: number, type: string) {
    this.logger.warn({
      type: 'FINANCIAL_TRANSACTION',
      userId,
      amount,
      transactionType: type,
      timestamp: new Date().toISOString()
    });
  }

  logSecurityEvent(event: string, details: any) {
    this.logger.error({
      type: 'SECURITY_EVENT',
      event,
      details,
      timestamp: new Date().toISOString()
    });
  }
}
```

### Health Checks
```typescript
@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeormHealthIndicator: TypeOrmHealthIndicator,
    private redisHealthIndicator: RedisHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.typeormHealthIndicator.pingCheck('database'),
      () => this.redisHealthIndicator.pingCheck('redis')
    ]);
  }
}
```

## Conclusion

This comprehensive architecture provides a solid foundation for building a scalable, secure, and maintainable casino backend system. The modular design allows for incremental development while maintaining consistency across all components.

Key architectural strengths:
- **Scalable Module Structure**: Clear separation of concerns
- **Robust Financial System**: Transaction integrity and audit trails
- **Security-First Design**: Multiple layers of protection
- **Performance Optimized**: Caching and database optimization
- **Testable Architecture**: Comprehensive testing strategy
- **Production Ready**: Monitoring, logging, and health checks

The implementation roadmap provides a clear path from infrastructure setup to advanced features, with each phase building upon the previous foundation. The system is designed to handle the complex requirements of a casino platform while maintaining the flexibility to evolve with changing business needs.