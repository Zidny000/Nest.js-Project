import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    const singlePost = await this.postsRepository.findOne({
      where: {id},
      relations : ['authorName']
    });
    if(!singlePost){
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return singlePost;
  }

  async create(createPostData: CreatePostDto, authorName: User): Promise<Post> {
    const newPost = this.postsRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      authorName
    });
    return this.postsRepository.save(newPost);
  }


  async update(id: number, updatePostData: UpdatePostDto): Promise<Post> {
    const currentPost = await this.postsRepository.findOneBy({id});
    if(!currentPost){
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (updatePostData.title) {
      currentPost.title = updatePostData.title;
}
    if (updatePostData.content) {
      currentPost.content = updatePostData.content;
    }

    return this.postsRepository.save(currentPost);

  }

  async remove(id: number): Promise<void> {
    const currentPost = await this.postsRepository.findOneBy({id});
    if(!currentPost){
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    await this.postsRepository.remove(currentPost);
  }
}
