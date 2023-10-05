import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import ormconfig from 'ormconfig';

@Module({
  imports: [BookModule, UserModule, TypeOrmModule.forRoot(ormconfig), ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, Repository],
})
export class AppModule {}
