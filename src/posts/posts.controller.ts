import { Controller, Get, Param, ParseIntPipe, Query, Post, ValidationPipe, HttpCode, HttpStatus, Body, Put, Delete, UsePipes } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './pipes/post-exists.pipe';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(): Promise<PostEntity[]> {
    const extractAllPosts = await this.postsService.findAll();
    return extractAllPosts;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe, PostExistsPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UsePipes(
  //   new ValidationPipe({
  //     whitelist: true, // Strip properties that do not have any decorators
  //     forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present 
  //   })
  // )
  async create(@Body() createPostData: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostData);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe, PostExistsPipe) id: number, @Body() updatePostData: UpdatePostDto): Promise<PostEntity> {
    return this.postsService.update(id, updatePostData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe, PostExistsPipe) id: number): Promise<void> {
    this.postsService.remove(id);
  }

}
