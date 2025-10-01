import { Controller, Get, Param, ParseIntPipe, Query, Post, HttpCode, HttpStatus, Body, Put, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import type { Post as PostInterface } from './interfaces/post.interface';

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
  create(@Body() createPostData: Omit<PostInterface, 'id' | 'createdAt' | 'updatedAt'>): PostInterface {
    return this.postsService.create(createPostData);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostData: Partial<Omit<PostInterface, 'id' | 'createdAt' | 'updatedAt'>>): PostInterface {
    return this.postsService.update(id, updatePostData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.postsService.remove(id);
  }

}
