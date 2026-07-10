import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class DeviceGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const deviceId =
      request.headers['x-device-id'];

    if (!deviceId) {
      throw new UnauthorizedException(
        'Device ID is required.',
      );
    }

    if (user.currentDeviceId !== deviceId) {
      throw new UnauthorizedException(
        'This account is active on another device.',
      );
    }

    return true;
  }
}