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

