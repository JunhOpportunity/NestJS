import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: '1',
    title: 'title1',
    content: 'content1',
    likeCount: 100000,
    commentCount: 100,
  },
  {
    id: 2,
    author: '2',
    title: 'title2',
    content: 'content2',
    likeCount: 100000,
    commentCount: 100,
  },
];
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(){
    return posts;
  }

  @Get(':id')
  getPost(@Param('id') id : string){
    const post = posts.find((post:PostModel) => post.id === +id)

    if(!post) {
      throw new NotFoundException(); 
    }

    return post;
  }
}
