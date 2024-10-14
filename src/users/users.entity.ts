import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  Manager = 'manager',
  User = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: Role.User })
  role: string;
  reservations: any;
}
