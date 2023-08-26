import { ITokenPayload, IUser } from '@project/shared/app-types';

export function createJWTPayload(user: IUser): ITokenPayload {
  return {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}
