import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { BikesModule } from './bikes/bikes.module';
import { ReservationsModule } from './reservations/reservation.module';
import { Bike } from './bikes/bikes.entity';
import { Reservation } from './reservations/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Bike, Reservation],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    BikesModule,
    ReservationsModule,
  ],
})
export class AppModule {}
