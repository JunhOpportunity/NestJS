import { Column, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { POST_IMAGE_PATH } from '../const/path.const';
import { join } from 'path';
import { PostModel } from 'src/entity/post.entity';
// import { PostsModel } from 'src/posts/entities/posts.entity';

export enum ImageModelType {
  PROFILE_IMAGE = 'PROFILE',
  POST_IMAGE = 'POST',
}

export class ImageModel extends BaseModel {
  @Column({
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order: number;

  // 사용자 프로필 이미지, 포스트 이미지에 대한 타입
  @Column({
    enum: ImageModelType,
  })
  @IsEnum(ImageModelType)
  @IsString()
  type: ImageModelType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === ImageModelType.PROFILE_IMAGE) {
      return join(POST_IMAGE_PATH, value);
    } else {
      return value;
    }
  })
  path: string;

  // @ManyToOne((type) => PostsModel, (post) => post)
  // post?: PostsModel
}
