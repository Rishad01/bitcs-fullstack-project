import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string): Promise<any> {
    // Check if there is any manager in the system
    const managerExists = await this.usersService.doesManagerExist();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // If no manager, assign role 'manager', else 'user'
    const role = managerExists ? Role.User : Role.Manager;

    // Create and save the user
    const user = await this.usersService.createUser(
      email,
      hashedPassword,
      role,
    );

    // Generate JWT token
    const payload = { email: user.email, role: user.role, id: user.id };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, role: user.role, id: user.id };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }
}
