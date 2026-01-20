import { Injectable } from '@nestjs/common';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { create } from 'domain';
import { InjectRepository } from '@nestjs/typeorm';
import { HOST, PROTOCOL } from 'src/common/const/env.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  getAllPosts() {
    return `This action returns all posts`;
  }

  async paginatePosts(dto: PaginatePostDto) {
    const where: FindOptionsWhere<PostsModel> = {};

    if(dto.where__id_less_than) {
      where.id = LessThan(dto.where__id_less_than);
    } else if(dto.where__id_more_than) {
      where.id = MoreThan(dto.where__id_more_than);
    }

    const posts = await this.postsRepository.find({
      where: {
        // 더 크다, 더 많다
        id: MoreThan(dto.where__id_more_than ?? 0),
      },
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    // 해당되는 포스트가 0개 이상이면
    // 마지막 포스트를 가져오고
    // 아니면 null을 반환
    const lastItem = posts.length > 0 && posts.length === dto.take ? posts[posts.length - 1] : null;

    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);

    if (nextUrl) {
      /**
       * dto의 키들을 순회하면서
       * 키값에 해당되는 값이 존재하면
       * 쿼리 파라미터로 추가한다.
       *
       * 단, where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
       */
      for (const key of Object.keys(dto)) {
        if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
          nextUrl.searchParams.append(key, dto[key]);
        }
      }

      let key = null;

      if(dto.order__createdAt === 'ASC') {
        key = 'where__id_more_than';
      } else {
        key = 'where__id_less_than';
      }

      nextUrl.searchParams.append(
        'where__id_more_than',
        lastItem.id.toString(),
      );
    }

    return {
      data: posts,
      cursor: {
        after: lastItem?.id,
      },
      count: posts.length,
      next: nextUrl?.toString(),
    };
  }

  async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
    const repository = this.getRepository(qr);

    const post = repository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      images: [],
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await repository.save(post);

    return newPost;
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPosts(userId, {
        title: `제목 ${i}`,
        content: `내용 ${i}`,
      });
    }
  }
}
