import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ReservationsService } from './reservation.service';
import {
  CreateReservationDto,
  //RateReservationDto,
} from './dto/create-reservation.dto';
import { Reservation } from './reservation.entity';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/role.enum';
import { GetUser } from 'src/common/get-user.decorator';
import { User } from 'src/users/users.entity';
import { BikesService } from 'src/bikes/bikes.service';
import { AuthRoleGuard } from 'src/auth/auth-role.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly bikesService: BikesService,
  ) {}

  @UseGuards(AuthRoleGuard)
  @Roles(Role.User)
  @Post(':bikeId')
  async create(
    @Param('bikeId') bikeId: number,
    @Body() createReservationDto: CreateReservationDto,
    @GetUser() user: User,
  ): Promise<Reservation> {
    //console.log(user.role);
    const bike = await this.bikesService.findOne(bikeId);
    return this.reservationsService.create(createReservationDto, user, bike);
  }

  //   @Patch(':id/rate')
  //   rate(
  //     @Param('id') id: number,
  //     @Body() rateReservationDto: RateReservationDto,
  //   ): Promise<Reservation> {
  //     return this.reservationsService.rateReservation(id, rateReservationDto);
  //   }

  @Get('user/:userId')
  findUserReservations(
    @Param('userId') userId: number,
  ): Promise<Reservation[]> {
    return this.reservationsService.findUserReservations(userId);
  }

  @Get()
  findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
  }

  @UseGuards(AuthRoleGuard)
  @Roles(Role.User)
  @Patch(':reservationId/cancel')
  async cancelReservation(
    @Param('reservationId') reservationId: number,
    @GetUser() user: User,
  ): Promise<Reservation> {
    return this.reservationsService.cancelReservation(reservationId, user);
  }
}
