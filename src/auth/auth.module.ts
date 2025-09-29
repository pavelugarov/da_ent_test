import { forwardRef, Module, Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Repository, Service } from 'src/enums';
import { AuthRepository } from 'src/db/repositories/auth.repository';
import { DbModule } from 'src/db/db.module';


export const authProvider: Provider = {
  provide: Service.AUTH,
  useClass: AuthService,
};

@Module({
  imports: [
    DbModule,
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: Repository.AUTH,
      useClass: AuthRepository,
    },
    authProvider
  ],
  controllers: [AuthController],
  exports: [authProvider],
})
export class AuthModule { }