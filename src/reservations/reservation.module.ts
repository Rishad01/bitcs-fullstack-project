import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservation.controller';
import { ReservationsService } from './reservation.service';
import { Reservation } from './reservation.entity';
import { Bike } from '../bikes/bikes.entity';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { BikesModule } from 'src/bikes/bikes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Bike, User]),
    AuthModule,
    forwardRef(() => BikesModule),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, JwtService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
