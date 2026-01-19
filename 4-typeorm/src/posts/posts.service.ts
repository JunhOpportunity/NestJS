import { Injectable } from '@nestjs/common';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { MoreThan, Repository } from 'typeorm';
import { create } from 'domain';
import { InjectRepository } from '@nestjs/typeorm';

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
