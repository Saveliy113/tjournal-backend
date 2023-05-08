import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3)
  fullName: string;

  @IsEmail(undefined, { message: 'Некорректный email' })
  email: string;

  @Length(6, 32, { message: 'Пароль должен содержать не менее 6 символов' })
  password?: string;
}
