import { Column, CreateDateColumn, Entity, Generated, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { ProfileModel } from "./profile.entitiy";
import { PostModel } from "./post.entity";

@Entity()
export class UserModel{
  //ID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 제목
  // @Column()
  // title: string;

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

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  profile: ProfileModel;

  @Column()
  email: string;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}