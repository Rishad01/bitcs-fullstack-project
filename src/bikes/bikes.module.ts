import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikesController } from './bikes.controller';
import { BikesService } from './bikes.service';
import { Bike } from './bikes.entity';
import { Reservation } from 'src/reservations/reservation.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ReservationsModule } from 'src/reservations/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bike, Reservation]),
    AuthModule,
    forwardRef(() => ReservationsModule),
  ],
  controllers: [BikesController],
  providers: [BikesService, JwtService],
  exports: [BikesService],
})
export class BikesModule {}
