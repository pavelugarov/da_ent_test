import {
  Body,
  Controller,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('/')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Public()
  @Post('signin')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.id, signInDto.password, signInDto.sessionId);
  }

  @Public()
  @Post('signin/new_token')
  signInNewToken(@Body() body: any) {
    return this.authService.signInNewToken(body?.refresh_token);
  }

  @Public()
  @Post('signup')
  signUp(@Body() signInDto: LoginDto) {
    return this.authService.signUp(signInDto.id, signInDto.password);
  }

  @Get('logout')
  logout(@Request() request: any) {
    return this.authService.logout(request.userSession);
  }


  @Get('info')
  async info(@Request() request: any) {
    const user = await this.authService.getUser(request.userSession?.userId);
    return {id: user?.login}
  }
}