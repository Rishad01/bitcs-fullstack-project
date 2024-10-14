import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';
import { Bike } from '../bikes/bikes.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Bike, (bike) => bike.reservations)
  bike: Bike;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  status: 'active' | 'cancelled';

  @Column({ nullable: true })
  review: string;

  @Column({ nullable: true })
  rating: number;
}
