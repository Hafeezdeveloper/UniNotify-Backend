import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import * as morgan from 'morgan';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly morganMiddleware: any;

  constructor() {
    this.morganMiddleware = morgan('dev'); // or any other format like 'tiny', 'short', etc.
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.morganMiddleware(req, res, next);
  }
}
