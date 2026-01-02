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

### `@Column({})` property

```tsx
@Column({ update: false })
  createdAt: Date;
```

- length : 입력할 수 있는 글자의 길이
- nullable : null 가능 여부
- update : 업데이트 가능 여부
- select : 데이터를 조회할 때 기본적으로 이 칼럼을 가져올 것인지 결정
- default : 기본값
- unique : PK처럼 중복되는 값이 없도록 하는 것

### enum

```tsx
enum Role {
	USER = 'user',
	ADMIN = 'admin',
}

@Column({
	type: 'enum',
	enum: Role,
	default: Role.USER,
})
role: Role;
```

### Entity Embedding

> 상속과 비슷한 개념. 중복되는 내부 칼럼을 한 번에 작성해서 재사용한다.
이 방법보다는 상속을 많이 사용한다.
> 

이때 재사용 되는 것들을 선언하는 테이블의 경우에는 Entity 라는 키워드를 붙여주지 않는다.

```tsx
// 재사용되는 것들 선언
export class Name{
  @Column()
  first: string;

  @Column()
  last: string;
}

// 사용
  @Column(() => Name)
  name: Name;
```

### 테이블 상속

일반적인 상속과 똑같은 개념과 유사한 로직으로 이루어져있다.

Embedding 과 마찬가지로 @Entity 라는 키워드를 적어주지 않는다.

```tsx
export class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class BookModel extends BaseModel{
  @Column()
  name: string;
}
```

## Relationship

레퍼런스 하는 id 칼럼은 항상 many 입장의 테이블에 들어가게 된다.

둘 중 하나의 테이블은 상대방의 id 칼럼을 갖고 있어야 한다. (`@JoinColumn 사용`)

### One to One Relationship

![image.png](attachment:600cdc20-4d73-4f26-a8b6-d54fbd1329c2:image.png)

`@OneToOne` 키워드를 작성하고 해당 키워드의 프로퍼티에 연결할 칼럼을 명시해주면 된다.

여기서 주의할 점은 한 테이블은 상대방 태이블의 id를 갖고 있어야 한다는 점이다.

이때 이 역할을 명시해 주는 것이 `@JoinColumn()` 키워드이다.

```tsx
// Profile.entity.ts
@Entity()
export class ProfileModel{
  @OneToOne(() => UserModel, (user) => user.profile)
  @JoinColumn()
  user: UserModel;
}

// User.entity.ts
@Entity()
export class UserModel{
  @OneToOne(() => ProfileModel, (profile) => profile.user)
  profile: ProfileModel;
}
```

+) ✋ OneToOne 관계를 생성해서 연결한 뒤에 app.module.ts 의 forFeature 부분에 ProfileModel 도 추가해주어야함.

### One to Many & Many to One Relationship

![image.png](attachment:b3b4116f-23c2-4190-adf4-057e3b19a773:image.png)

Post를 예시로 들었는데, Post의 경우 여러 Post가 한 사람에게 종속되기 때문에 Many는 Post 라는 것을 알 수 있다.

이 관계에서는 `@JoinColumn()` 키워드를 작성할 필요가 없다.

왜냐하면 이 관계에서는 무조건 Many 에 해당하는 테이블에서 id를 들고있게 되기 때문이다. (테이블은 배열 형태, 즉 한 셀에 여러 개의 데이터를 갖고 있을 수 없기 때문)

```tsx
// post.entity.ts
@Entity()
export class PostModel{
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;
}

// user.entity.ts
@Entity()
export class PostModel{
  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
```

여기서 주의할 점이 있다.

Relationship을 수행할 때는 연결된 테이블의 값들이 보여지는 것에 대한 여부가 기본값으로 false 값이기 때문에 보여주고 싶은 데이터가 있다면 추가해주어야한다.

```tsx
  @Get('users')
  getUsers() {
    return this.userRepository.find({
      relations: {
        profile: true,
        posts: true,
      },
    });
  }
```

### Many to Many Relationship

![image.png](attachment:852552f5-b9bf-45a0-aa30-17e87438e4e2:image.png)

서로 여러 개를 Reference 하고 있다.

이 관계도 한 쪽에 Join 테이블을 생성해주어야 한다.

다만 이때는 어디에 작성해주든 상관이 없다.

```tsx
export class PostModel{
  @ManyToMany(() => TagModel, (tag) => tag.posts)
  @JoinTable()
  tags: TagModel[];
}

export class TagModel{
  @ManyToMany(() => PostModel, (post) => post.tags)
  posts: PostModel[];
}
```

![image.png](attachment:594fc91e-eb01-42d8-9fde-b54f4bacc834:image.png)

이때 신기한 점은, 테이블에 추가적으로 칼럼이 하나 생긴 것이 아니라 새 테이블이 하나 생성되었다는 점이다.

각각의 테이블을 reference 하는 테이블을 새로 생성된 것을 확인할 수 있다.

### Relation Options

모든 관계가 같은 옵션을 사용한다.

아래는 일단 OneToOne에 대한 예시

```tsx
@OneToOne(() => ProfileModel, (profile) => profile.user, {
	eager: true,
})
```

- eager (T/F) : find() 실행 할때마다 항상 같이 가져올 것들 결정.
true로 할 경우에 아래 부분에 해당하는 relations 를 직접 적어주지 않아도 됨.
    
    ```tsx
      @Get('users')
      getUsers() {
        return this.userRepository.find({
          relations: {
            profile: true,
            posts: true,
          },
        });
      }
    ```
    
- cascade (T/F) : relation 을 한 번에 같이 저장할지 말지를 결정
- nullable (T/F) : 기본 값은 True.
- onDelete : 관계가 삭제됐을때
    - ‘NO ACITON’: 아무것도 안함
    - ‘CASCADE’ : 참조하는 Row도 같이 삭제
    - ‘SET NULL’ : 참조하는 Row 에서 참조 id를 null로 변경
    - ’SET DEFAULT’ : 기본 세팅으로 설정
    - ‘RESTRICT’: 참조하고 있는 Row가 있는 경우 참조당하는 Row 삭제 불가

### Find Options

```tsx
  @Get('tags')
  getTags() {
    return this.tagRepository.find({
	    select: {
		    id: true,
		    createAt: true,
		    updatedAt: true,
		    version: true
	    },
	    // AND 조건
	    where: {
		    version: 1
	    },
	    // OR 조건
	    where: [
		    {
			    id: 3
		    },
		    {
			    id: Not(1)
		    }
	    ],
	    order: {
		    id: 'ASC'
	    },
	    skip: 1,
	    take: 3
    });
  }
```

- select : select 는 MySQL의 SELECT와 같은 것을 의미한다. 가져올 것들을 정하는데, select 옵션을 사용하는 순간 선택하지 않은 모든 칼럼은 가져오지 않는다.
- where : 필터링을 할 때 사용. 여러 개의 값을 넣을 경우 AND 조건으로 가져온다고 보면 된다. 만약 OR 조건으로 가져오고 싶다면 배열 형태로 가져오면 된다.
- relations : 관계를 가져오는 건데, 위에서 사용한 것 그대로다. 특이한 점은, 여기서 호출한 경우 select나 where에서도 호출이 가능하다는 것이다.
- order : 오름차순(ASC), 내린차순(DESC)
- skip : 처음 몇 개를 제외할지 결정
- take : 몇 개를 가져올지. 처음부터 몇 개를 가져올지 결정
- Not(1) : 1이 아닌 경우 가져오기
- LessThan(30) : 30보다 작은 경우 가져오기
- MoreThan(30) : 30보다 큰 경우 가져오기
- Equal(30) : 30과 같은 경우 가져오기
- Like(’%abc%’) : abc가 중간에 들어가는 문자 가져오기
- ILike(’%aBc%’) : 소문자 대문자 구분 안하고 Like 수행
- Between(10, 15) : 10과 15 사이의 값
- In([1, 3, 5, 7]) : 배열 내부에 해당하는 것들을 모두 가져옴
- IsNull() : Null인 경우 가져옴

### 유용한 메서드

- create: 모델에 해당되는 객체 생성. 데이터베이스에 저장은 하지 않음
저장을 하고 싶다면 기존처럼 save 메서드 사용하면 됨.

```tsx
@Post('sample')
async sample() {
  // 저장은 하지 않음
	const user1 = this.userRepository.create({
		email: 'sample@abc.ai'
	});
	
	// 저장 함
	const user2 = this.userRepository.save({
		email: 'sample@abc.ai'
	});
}
```

- findAndCount : 페이지네이션 할 때 유용. 필터링에 해당하는 데이터들을 가져와서 보여주고, 전체 데이터가 몇 개인지도 보여줌.

```tsx
// 일단 20개의 데이터를 보여주고, 마지막에 전체 데이터의 개수를 보여줌
await this.userRepository.findAndCount('count', {
		take: 20,
})
```

- preload : 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함.
많이 사용하지는 않음.

```tsx
async sample() {
	const user3 = this.userRepository.preload({
		id: 101,
		email: 'sample@abc.ai'
	});
}
```

- delete

```tsx
async sample() {
	await this.userRepository.delete(
		101
	)
}
```

- increment : 해당 값을 특정 값 만큼 증가시킨다.

```tsx
// id가 1인 데이터에서 count 값을 2 증가시킨다
async sample() {
	await this.userRepository.increment({
			id: 1
		}, 'count', 2);
	)
}
```

- decrement: 해당 값을 특정 값 만큼 감소시킨다.

```tsx
// id가 1인 데이터에서 count 값을 3 감소시킨다
async sample() {
	await this.userRepository.decrement({
			id: 1
		}, 'count', 3);
	)
}
```

- count : 특정 값이 들어가있는 데이터의 갯수 카운팅하기

```tsx
async sample() {
	await this.userRepository.count({
		where: {
			email: ILike('%google%')
		}
	})
}
```

- sum : 다 더하는 것

```tsx
// where 조건들에 해당하는 데이터들의 count 값의 총합
await this.userRepository.sum('count', {
	where: {
		email: ILike('%google%')
	}
})
```

- average : 평균
- minimum : 최솟값
- maximum : 최댓값

```tsx
await this.userRepository.average('count', {
		where: {
			email: ILike('%google%')
		}
})
```