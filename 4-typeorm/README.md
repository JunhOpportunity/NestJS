# TypeOrm 실전

## 세팅

```tsx
// 1. NestJS 세팅
$ nest new _프로젝트이름_

// 2. TypeOrm 설치
$ npm i @nestjs/typeorm typeorm pg

// 3. Docker 세팅
docker-compose.yaml 파일 작성
postgres-data 폴더 생성

services:
  postgres:
    image: postgres:15
    restart: always
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: typeormstudy

// 4. TypeOrm 세팅
app.module.ts 파일에서 imports 수정

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'typeormstudy',
      entities: [UserModel],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

// 5. Docker 실행
$ docker-compose up

// 6. Nest 실행
$ npm run start:dev

// 7. entity 생성
src/entity/user.entity.ts 파일 생성

@Entity()
export class UserModel{
  //ID
  @PrimaryGeneratedColumn()
  id: number;

  // 제목
  @Column()
  title: string;

  // 데이터 생성 일자
  @CreateDateColumn()
  createdAt: Date;

  // 데이터 업데이트 일자
  @UpdateDateColumn()
  updatedAt: Date;

  // 버전관리
  @VersionColumn()
  version: number;

  @Column()
  @Generated('increment')
  additionalId: number;
}

// 8. Entity 적용
app.module.ts 파일에서 entites 부분에 엔티티 이름 추가

// 9. app.controller.ts 수정
app.controller.ts 에서 요청 처리 함수 작성
```

## Entity Annotation

- `@PrimaryGeneratedColumn()` : PK, 자동으로 ID를 생성
- `@PrimaryGeneratedColumn('uuid')` : 128비트 짜리 문자열을 생성
- `@PrimaryColumn()` : generated 가 아니기 때문에 무조건 직접 값을 넣어주어야 한다.
- `@Column()` : 칼럼 생성
- `@CreateDateColumn()` : 데이터 생성 날짜와 시간 자동으로 생성
- `@UpdateDateColumn()` : 데이터가 업데이트되는 날짜와 시간 자동으로 생성
- `@VersionColumn()` : 데이터가 업데이트 될 때마다 1씩 올라감 (처음 생성시 값은 1) 정확하게는 save() 함수가 몇 번 불렸는지 기억함
- `@Column()`
`@Generated(’increment’)` : 자동으로 1씩 증가하는 데이터

여기서 신경써야할 점이 있다. uuid 를 설정할 때는 number 타입이 아닌 string 타입으로 선언해주어야 한다는 것이다.

이렇게 하지 않으면 에러가 발생한다.