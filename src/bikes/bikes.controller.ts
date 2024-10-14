import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { Bike } from './bikes.entity';
import { AuthRoleGuard } from 'src/auth/auth-role.guard';
import { GetUser } from 'src/common/get-user.decorator';
import { User } from 'src/users/users.entity';
import { Reservation } from 'src/reservations/reservation.entity';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Get(':id/reservations')
  async getReservationsByBikeId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Reservation[]> {
    return await this.bikesService.findReservationsByBikeId(id);
  }
  @UseGuards(AuthRoleGuard)
  @Get('search')
  async findFilteredBikes(
    @GetUser() user: User,
    @Query('color') color?: string,
    @Query('model') model?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userRole = user.role; // Fetch the role from the user object
    const filters = { color, model, fromDate, toDate };
    console.log(filters);
    return this.bikesService.findFilteredBikesWithoutJoin(
      filters,
      page,
      limit,
      userRole,
    );
  }

  @Post()
  create(@Body() createBikeDto: CreateBikeDto): Promise<Bike> {
    return this.bikesService.create(createBikeDto);
  }

  @Get()
  findAll(): Promise<Bike[]> {
    return this.bikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Bike> {
    return this.bikesService.findOne(id);
  }

  @Put('edit/:id')
  update(
    @Param('id') id: number,
    @Body() updateBikeDto: Partial<CreateBikeDto>,
  ): Promise<Bike> {
    return this.bikesService.update(id, updateBikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.bikesService.remove(id);
  }
}

// async findFilteredBikes(
//   filters: any,
//   page: number,
//   limit: number,
//   userRole: string,
// ): Promise<{ bikes: Bike[]; totalPages: number }> {
//   const { color, model, fromDate, toDate } = filters;
//   console.log('hello');

//   const query = this.bikesRepository
//     .createQueryBuilder('bike')
//     .leftJoinAndSelect('bike.reservations', 'reservation');

//   if (color) {
//     query.andWhere('bike.color = :color', { color });
//   }

//   if (model) {
//     query.andWhere('bike.model = :model', { model });
//   }

//   if (fromDate && toDate) {
//     const from = new Date(fromDate);
//     const to = new Date(toDate);

//     query.andWhere(
//       'NOT EXISTS (SELECT * FROM reservation WHERE reservation.bikeId = bike.id AND ' +
//         '((reservation.startDate BETWEEN :from AND :to) OR (reservation.endDate BETWEEN :from AND :to)))',
//       { from, to },
//     );
//   }

//   if (userRole === 'user') {
//     query.andWhere('reservation IS NULL OR reservation.status = :status', {
//       status: 'cancelled',
//     });
//   }
//   query.skip((page - 1) * limit).take(limit);

//   const [bikes, total] = await query.getManyAndCount();

//   return {
//     bikes,
//     totalPages: Math.ceil(total / limit),
//   };
// }
