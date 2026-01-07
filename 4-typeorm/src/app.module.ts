import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { StudentModel, TeacherModel } from './entity/person.entity';
import { BookModel, CarModel } from './entity/inheritance.entity';
import { ProfileModel } from './entity/profile.entitiy';
import { PostsModule } from './posts/posts.module';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserModel,
      ProfileModel,
      PostModel,
      TagModel,
      UsersModel,
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'typeormstudy',
      entities: [
        UserModel,
        StudentModel,
        TeacherModel,
        BookModel,
        CarModel,
        ProfileModel,
        PostModel,
        TagModel,
        UsersModel,
      ],
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
