// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { map, Observable, tap } from 'rxjs';

// @Injectable()
// export class LogInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     // 요청이 들어올 때 REQ 요청이 들어온 타임스탬프를 찍는다.
//     // [REQ] {요청 path} {요청 시간}

//     const now = Date.now();

//     const req = context.switchToHttp().getRequest();

//     const path = req.originalUrl;

//     console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

//     // 여기부터는 라우트의 로직이 전부 실행되고 응답이 observable로 반환된다.
//     // 즉, 윗 부분은 로직이 실행되기 전에 요청 부분에서 실행하는 부분.
//     // 리턴 부분은 응답 값을 실행하는 부분.
//     return next.handle().pipe(
//       // 요청이 끝났을 때 (응답이 나갈 때) 다시 타임스탬프를 찍는다.
//       // [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
//       tap((observable) =>
//         console.log(
//           `[RES] ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds('kr')}ms`,
//         ),
//       ),
//     );
//   }
// }
