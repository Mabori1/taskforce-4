import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, ITokenPayload, UserRole } from '@project/shared/app-types';
import dayjs from 'dayjs';
import {
  AUTH_USER_EXISTS,
  AUTH_USER_NOT_FOUND,
  AUTH_USER_PASSWORD_WRONG,
} from './authentication.constant';
import { BlogUserEntity } from '../blog-user/blog-user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { BlogUserRepository } from '../blog-user/blog-user.repository';
import { JwtService } from '@nestjs/jwt';
import { UpdateBlogUserDto } from '../blog-user/dto/update-blog-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService
  ) {}

  public async register(dto: CreateUserDto) {
    const { email, dateBirth, name, city, about, role, password, avatar } = dto;

    const taskUser = {
      email,
      name,
      about: about || '',
      city,
      role: role || UserRole.Customer,
      avatar: avatar || '',
      dateBirth: dayjs(dateBirth).toDate(),
      passwordHash: '',

      taskCount: 0,
      newCount: 0,
      rating: 0,
      doneCount: 0,
      failedCount: 0,
      specialization: [''],
      ranking: 0,
      registrationDate: dayjs().toDate(),
    };

    const existUser = await this.blogUserRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(AUTH_USER_EXISTS);
    }

    const userEntity = await new BlogUserEntity(taskUser).setPassword(password);

    return await this.blogUserRepository.create(userEntity);
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;

    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    const blogUserEntity = new BlogUserEntity(existUser);

    if (!(await blogUserEntity.comparePassword(password))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    return blogUserEntity.toObject();
  }

  public async getUser(id: string) {
    const existUser = await this.blogUserRepository.findById(id);

    console.log(id);

    if (!existUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
    return existUser;
  }

  public async changePassword(dto: ChangePasswordDto) {
    const { email, password, newPassword } = dto;
    const blogUser = await this.verifyUser({ email, password });
    const userEntity = await new BlogUserEntity(blogUser).setPassword(
      newPassword
    );
    return this.blogUserRepository.update(userEntity.id, userEntity);
  }

  public async createUserToken(user: IUser) {
    const payload: ITokenPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async update(id: string, dto: UpdateBlogUserDto) {
    const existUser = await this.blogUserRepository.findById(id);

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    const userEntity = new BlogUserEntity({ ...existUser, ...dto });
    return await this.blogUserRepository.update(id, userEntity);
  }
}
