import { join } from 'path';

export const PROJECT_ROOT_PATH = process.cwd();

export const PUBLIC_FOLDER_NAME = 'public';

export const POSTS_FOLDER_NAME = 'posts';

// 실제 공개폴더의 절대경로
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// 포스트 이미지를 저장할 폴더
export const POST_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);

// 절대경로 x
export const POST_PUBLIC_IMAGE_PATH = join(
  PUBLIC_FOLDER_NAME,
  POSTS_FOLDER_NAME,
);
