import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayHistory } from '../entities/play-history.entity';
import { Player } from '../entities/player.entity';
import { GamesService } from './services/games.service';
import { GamesController } from './controllers/games.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayHistory, Player]),
    UsersModule, // Import UsersModule to access BalanceService
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
