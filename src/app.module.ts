import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';

@Module({
  imports: [PostsModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pgsql',
    database: 'nestjs-project',
    entities: [Post], //Array of entities or entity classes
    synchronize: true, // In production, consider using migrations instead
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
