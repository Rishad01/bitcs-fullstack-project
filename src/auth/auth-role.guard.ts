import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Role } from '../common/role.enum';
import { ROLES_KEY } from '../common/roles.decorator';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('No token found');
    }
    //console.log(token);
    //console.log(this.jwtService.verify(token));
    try {
      const decoded = this.jwtService.verify(token, { secret: 'secretKey' });
      request.user = decoded;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new ForbiddenException('Invalid token');
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles defined, proceed
    }

    if (!requiredRoles.includes(request.user.role)) {
      throw new ForbiddenException(
        `Role ${request.user.role} does not have access`,
      );
    }

    return true;
  }
}
