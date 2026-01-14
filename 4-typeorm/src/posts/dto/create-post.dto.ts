import { PickType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { PostModel } from "src/entity/post.entity";

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}

// export class CreatePostDto extends PickType(PostModel, ['title', 'content']) {}
