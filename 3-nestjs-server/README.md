# Nest 기본

### 응답 설정 : `src/app.controller.ts`

컨트롤러 내부에서 @Get, @Post 등으로 먼저 지정한 뒤에 응답 함수를 작성한다.

```sql
  @Get('test') // 파라미터는 경로를 의미
  getHello() {
    return 'Home Page';
  }
```

```sql
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return 'Home Page';
  }

  @Get('post')
  getPost() {
    return 'Post Page';
  }

  @Get('user')
  getUser() {
    return 'User Page';
  }
}
```

### 요청 라이프 사이클

> 요청이 보내진 다음에 응답으로 돌아오는 것 까지의 과정
> 

Middleware, Guard, Interceptor, Pipe 는 필수 사항이 아니다.

하지만 요청 로직을 처리하는 부분인 Controller, Service, Repository는 필수사항이다.

그 후에 Exception Filter와 Interceptor을 거쳐서 응답이 반환된다.

### 응답 보내기

아래와 같은 경우 @Controller 에서 엔드 포인트인 a, @Get 에서 엔드 포인트인 b 를 설정해주었으므로 아래의 getPost 요청을 보내기 위해서는 domain/a/b 경로로 요청을 보내야 한다.

+) 실제로 프로젝트를 구현할 때는 app.controller.ts 에 이것들을 적지 않는다. interface 별로 모듈을 만들어서 구현한다.

```sql
@Controller('a')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('b')
  getPost(): Post {
    return {
      author: 'author',
      title: 'title',
      content: 'content',
      likeCount: 100000,
      commentCount: 100,
    };
  }
}
```

### 모듈 생성하기

Nest는 CLI를 통해 편리하고 빠르게 모듈을 생성할 수 있다.

```sql
$ nest g resource
$ 모듈 이름
$ REST API
$ No
```

## REST API

> GET 요청은 Query를 사용하고 나머지는 전부 Body를 사용한다.
> 
- [GET] http://localhost:3000/posts ⇒ 다수의 posts를 가져온다.
- [GET] http://localhost:3000/posts/11 ⇒ 11이라는 ID를 갖고 있는 post 하나를 가져온다.
- [POST] http://localhost:3000/posts ⇒ 새로운 post를 생성한다.
- [PATCH] http://localhost:3000/posts/8 ⇒ 8이라는 ID를 갖고 있는 post를 부분 변경한다. (변경하고 싶은 부분만 Body에 넣어준다.)
- [PUT] http://localhost:3000/posts/8 ⇒ 8이라는 ID를 갖고 있는 post를 변경하거나 생성한다. (없으면 생성하기 때문에 전체를 모두 Body에 넣어야 한다.)
- [DELETE] http://localhost:3000/posts/3 ⇒ 3이라는 ID를 갖고 있는 post를 삭제한다.

### 특정 ID에 대한 요청

특정 ID에 대한 요청인 경우에는 `/posts/:id` 이렇게 작성한다.

```sql
@Get(':id')
getPost(@Param('id') id : string){
  return posts.find((post:PostModel) => post.id === +id)
}
```

### Not Found (기본으로 제공되는 Exception 사용하면 된다.)

```sql
if(!post) {
  throw new NotFoundException(); 
}
```

### POST 구현

바디에서 입력받은 데이터들을 새 포스트로 입력해야 하므로 @Body 를 사용해서 변수로 만든다.

```tsx
@Post()
postPosts(
  @Body('author') author: string,
  @Body('title') title: string,
  @Body('content') content: string,
) {
  const post: PostModel = {
    id: posts[posts.length - 1].id + 1,
    author,
    title,
    content,
    likeCount: 0,
    commentCount: 0,
  };
  posts = [...posts, post];
  return post;
}
```

### PUT 구현

```tsx
@Put(':id')
putPost(
  @Param('id') id: string,
  @Body('author') author?: string,
  @Body('title') title?: string,
  @Body('content') content?: string,
) {
  const post = posts.find((post) => post.id == +id);
  if (!post) {
    throw new NotFoundException();
  }
  if (author) {
    post.author = author;
  }
  if (title) {
    post.title = title;
  }
  if (content) {
    post.content = content;
  }
  posts = posts.map((prevPost) => (prevPost.id === +id ? post : prevPost));
  return post;
 }
```

### DELETE 구현

```tsx
@Delete(':id')
deletePost(@Param('id') id: string) {
  const post = posts.find((post: PostModel) => post.id === +id);
  if (!post) {
    throw new NotFoundException();
  }
  posts = posts.filter((post) => post.id !== +id);
  return id;
}
```

## Service

지금까지는 모든 코드를 controller.ts 파일에 작성했다.

하지만 현재는 프로젝트가 커지고 코드가 많아지게 되면 굉장히 관리하기 힘든 구조이기 때문에 각 엔드포인트에 해당하는 코드들을 service.ts에 함수로 만들어 저장하고 이를 호출해서 사용하는 방식으로 코드를 변경해야 한다.

이때 중요한 것이 의존성 주입과 제어의 역전이다.

직접 PostsService 라는 클래스를 생성하지 않았는데 `constructor(private readonly postsService: PostsService) {}` 이 코드만으로 컨트롤러와 서비스를 연결하였다.

## 의존성

### 의존성 주입

아래와 같은 경우 A는 B가 존재할 때만 생성할 수 있으므로 의존하고 있다고 볼 수 있다.

즉, B는 A가 생성될 때 주입된다.

```tsx
class A {
	constructor(instance: B)
}

class B {
}
```

주입을 시켜야 하는 클래스들을 모두 module.ts 파일의 providers 안에 넣어주면 된다.

이때 클래스 자체를 넣는다. 괄호를 붙이면 인스턴스가 된다는 것에 주의해야 한다.

코드를 보면서 이해를 해보자.

`posts.controller.ts` 의 @Controller(’posts’) 아래에 보면 다음과 같은 코드가 자동으로 작성되어져있다.

> constructor(private readonly postsService: PostsService) {}
> 

이 코드가 바로 Nest에서 자동으로 의존성을 주입해주는 부분이다.

이제 `posts.moudle.ts`에 가보면 controllers와 porivders가 존재한다.

```tsx
// posts.moudle.ts

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

여기서 Nest가 자동으로 의존성을 주입해주는 것들을 providers 에 넣어주면 자동으로 연결이 되는 것이다.

이제 이 개념이 posts 폴더 뿐만 아니라 전체에 적용된다고 보면 된다.

최상단에 존재하는 `app.module.ts` 파일에서는 `imports` 키워드도 확인할 수 있는데, 이때 imports 부분에서 posts 모듈을 연결한다고 보면 된다.

```tsx
// app.module.ts

@Module({
	imports: [PostsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

그리고 최종적으로 main.ts 파일에서 앱을 생성할 때 AppModule을 실행하게 된다.

```tsx
// main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
```

## Docker

실행 : `$ docker-compose up`
