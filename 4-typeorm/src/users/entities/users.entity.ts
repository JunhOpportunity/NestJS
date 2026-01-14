import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostModel } from 'src/entity/post.entity';
import { BaseModel } from 'src/entity/inheritance.entity';
import { IsEmail, IsString, Length } from 'class-validator';

@Entity()
export class UsersModel extends BaseModel  {
  @Column({
    length: 20,
    unique: true,
  })
  @IsString()
  @Length(1, 20)
  nickname: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  @Length(3, 8)
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
