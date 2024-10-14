import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { Role } from '../common/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string, role: Role): Promise<User> {
    const newUser = this.usersRepository.create({ email, password, role });
    return this.usersRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async doesManagerExist(): Promise<boolean> {
    const manager = await this.usersRepository.findOne({ where: { role: Role.Manager } });
    return !!manager;
  }
}