import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { FileModule } from './file/file.module';

@Module({
  imports: [AuthModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
