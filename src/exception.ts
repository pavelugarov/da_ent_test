import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class MyExceptionsFilter implements ExceptionFilter {
  constructor() {
  }

  catch(exception, host: ArgumentsHost) {
    const res = host.switchToHttp();
    const response = res.getResponse();
    if (!exception.status)
      response.status(500).json(exception.message);
    else
      response.status(exception.status).json(exception);
  }
}