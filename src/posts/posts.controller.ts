import { Controller, Get, Param, ParseIntPipe, Query, Post, ValidationPipe, HttpCode, HttpStatus, Body, Put, Delete, UsePipes } from '@nestjs/common';
import { PostsService } from './posts.service';
import type { Post as PostInterface } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('search') search? : string): PostInterface[] {
    const extractAllPosts = this.postsService.findAll();
    if(search){
      return extractAllPosts.filter(singlePost => singlePost.title.toLowerCase().includes(search.toLowerCase()) )
    }
    return extractAllPosts;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): PostInterface {
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
  create(@Body() createPostData: CreatePostDto): PostInterface {
    return this.postsService.create(createPostData);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostData: UpdatePostDto): PostInterface {
    return this.postsService.update(id, updatePostData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.postsService.remove(id);
  }

}
