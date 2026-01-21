import { IsIn, IsNumber, IsOptional } from "class-validator";

export class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  // 이전 마지막 데이터의 ID
  // 이 프로퍼티에 입력된 ID 보다 높은 ID 부터 값 가져오기
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number; // 아무것도 없으면 0이라는 가정.

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  // 정렬
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt?: 'ASC' | 'DESC' = 'ASC';

  // 몇 개의 데이터를 응답으로 가져올지
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
