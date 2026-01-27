import { Injectable } from '@nestjs/common';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { create } from 'domain';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ConfigService } from '@nestjs/config';
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from 'src/common/const/env-keys.const';

// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectRepository(PostsModel)
//     private readonly postsRepository: Repository<PostsModel>,
//     private readonly commonService: CommonService,
//     private readonly configService: ConfigService,
//   ) {}

//   getAllPosts() {
//     return `This action returns all posts`;
//   }

//   async paginatePosts(dto: PaginatePostDto) {
//     return this.commonService.paginate(dto, this.postsRepository, {}, 'posts');
//     // if (dto.page) {
//     //   return this.pagePaginatePosts(dto);
//     // } else {
//     //   return this.cursorPaginatePosts(dto);
//     // }
//   }

//   async pagePaginatePosts(dto: PaginatePostDto) {
//     const [posts, count] = await this.postsRepository.findAndCount({
//       order: {
//         createdAt: dto.order__createdAt,
//       },
//       skip: (dto.page - 1) * dto.take,
//       take: dto.take,
//     });

//     return {
//       data: posts,
//       total: count,
//     };
//   }

//   async cursorPaginatePosts(dto: PaginatePostDto) {
//     const where: FindOptionsWhere<PostsModel> = {};

//     if (dto.where__id__less_than) {
//       where.id = LessThan(dto.where__id__less_than);
//     } else if (dto.where__id__more_than) {
//       where.id = MoreThan(dto.where__id__more_than);
//     }

//     const posts = await this.postsRepository.find({
//       where: {
//         // 더 크다, 더 많다
//         id: MoreThan(dto.where__id__more_than ?? 0),
//       },
//       order: {
//         createdAt: dto.order__createdAt,
//       },
//       take: dto.take,
//     });

//     // 해당되는 포스트가 0개 이상이면
//     // 마지막 포스트를 가져오고
//     // 아니면 null을 반환
//     const lastItem =
//       posts.length > 0 && posts.length === dto.take
//         ? posts[posts.length - 1]
//         : null;

//     const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY);
//     const host = this.configService.get<string>(ENV_HOST_KEY);

//     const nextUrl = lastItem && new URL(`${protocol}://${host}/posts`);

//     if (nextUrl) {
//       /**
//        * dto의 키들을 순회하면서
//        * 키값에 해당되는 값이 존재하면
//        * 쿼리 파라미터로 추가한다.
//        *
//        * 단, where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
//        */
//       for (const key of Object.keys(dto)) {
//         if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
//           nextUrl.searchParams.append(key, dto[key]);
//         }
//       }

//       let key = null;

//       if (dto.order__createdAt === 'ASC') {
//         key = 'where__id_more_than';
//       } else {
//         key = 'where__id_less_than';
//       }

//       nextUrl.searchParams.append(
//         'where__id_more_than',
//         lastItem.id.toString(),
//       );
//     }

//     return {
//       data: posts,
//       cursor: {
//         after: lastItem?.id,
//       },
//       count: posts.length,
//       next: nextUrl?.toString(),
//     };
//   }

//   async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
//     // 1) create -> 저장할 객체를 생성한다.
//     // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
//     const repository = this.getRepository(qr);

//     const post = repository.create({
//       author: {
//         id: authorId,
//       },
//       ...postDto,
//       images: [],
//       likeCount: 0,
//       commentCount: 0,
//     });

//     const newPost = await repository.save(post);

//     return newPost;
//   }

//   async generatePosts(userId: number) {
//     for (let i = 0; i < 100; i++) {
//       await this.createPosts(userId, {
//         title: `제목 ${i}`,
//         content: `내용 ${i}`,
//       });
//     }
//   }
// }
