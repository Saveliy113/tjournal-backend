import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { AppDataSource as appDataSource } from 'src/data-source';

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

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
