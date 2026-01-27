// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { NextFunction } from "express";

// @Injectable()
// export class LogMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     const now = new Date();
//     console.log(`[${now.toLocaleString('kr')}] ${req.method} ${req.originalUrl}`);
//     next();
//   }
// }