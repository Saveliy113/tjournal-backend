import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { AppDataSource as appDataSource } from 'src/data-source';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService {
  private readonly userRepository = appDataSource.getRepository(UserEntity);

  create(dto: CreateUserDto) {
    return this.userRepository.save(dto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findById(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  findByCond(cond: LoginUserDto) {
    return this.userRepository.findOne({
      where: {
        email: cond.email,
        password: cond.password,
      },
    });
  }

  async search(dto: SearchUserDto) {
    const qb = this.userRepository.createQueryBuilder('u');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.fullName) {
      qb.andWhere(`u.fullName ILIKE :fullName`);
    }

    if (dto.email) {
      qb.andWhere(`u.email ILIKE :email`);
    }

    qb.setParameters({
      fullName: `%${dto.fullName}%`,
      email: `%${dto.email}%`,
    });

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
