import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity()
export class UserModel{
  //ID
  @PrimaryGeneratedColumn('uuid')
  id: string;

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