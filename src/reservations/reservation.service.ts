import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import {
  CreateReservationDto,
  //RateReservationDto,
} from './dto/create-reservation.dto';
import { User } from '../users/users.entity';
import { Bike } from '../bikes/bikes.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    user: User,
    bike: Bike,
  ): Promise<Reservation> {
    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      user,
      bike,
      status: 'active',
    });
    //console.log(reservation);
    return await this.reservationsRepository.save(reservation);
  }

  //   async rateReservation(
  //     id: number,
  //     rateReservationDto: RateReservationDto,
  //   ): Promise<Reservation> {
  //     await this.reservationsRepository.update(id, rateReservationDto);
  //     return this.reservationsRepository.findOne(id);
  //   }

  async findUserReservations(userId: number): Promise<Reservation[]> {
    return await this.reservationsRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findAll(): Promise<Reservation[]> {
    return await this.reservationsRepository.find();
  }

  async cancelReservation(
    reservationId: number,
    user: User,
  ): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id: reservationId },
      relations: ['user'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to cancel this reservation',
      );
    }

    if (reservation.status === 'cancelled') {
      throw new BadRequestException(
        'This reservation has already been canceled',
      );
    }

    reservation.status = 'cancelled';
    return this.reservationsRepository.save(reservation);
  }
}
