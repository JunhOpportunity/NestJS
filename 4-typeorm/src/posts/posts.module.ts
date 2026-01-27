// import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
// // import { PostsService } from './posts.service';
// // import { PostsController } from './posts.controller';
// import { Type } from 'class-transformer';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from 'src/auth/auth.module';
// import { UsersModule } from 'src/users/users.module';
// import { CommonModule } from 'src/common/common.module';
// import { MulterModule } from '@nestjs/platform-express';
// import { extname } from 'path';
// import * as multer from 'multer';
// import { POST_IMAGE_PATH } from 'src/common/const/path.const';
// import { v4 as uuid } from 'uuid';

// @Module({
//   imports: [
//     // TypeOrmModule.forFeature([PostsModel]),
//     AuthModule,
//     UsersModule,
//     CommonModule,
//     MulterModule.register({
//       limits: {
//         // 바이트 단위로 입력
//         fileSize: 10000000,
//       },
//       fileFilter: (req, file, cb) => {
//         // cb(에러, boolean): 콜백함수
//         // 첫 번째 파라미터는 에러 객체에 대한 정보
//         // 두 번째 파라미터는 파일을 받을지 말지 boolean으로 허용 여부

//         // 파일 확장자 검사
//         // extname을 사용해 xxx.jpg => .jpg 추출
//         const ext = extname(file.originalname);
//         if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
//           return cb(new Error('Only images are allowed'), false);
//         }

//         return cb(null, true);
//       },
//       storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//           cb(null, POST_IMAGE_PATH);
//         },
//         filename: function (req, file, cb) {
//           cb(null, `${uuid()}${extname(file.originalname)}`);
//         },
//       }),
//     }),
//   ],
//   controllers: [PostsController],
//   // providers: [PostsService],
// })
// export class PostsModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply().forRoutes({
//       path: 'posts',
//       method: RequestMethod.ALL
//     });
//   }
// }
