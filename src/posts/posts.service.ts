import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {

  private posts: Post[] = [
    {
      id: 1,
      title: 'First Post',
      content: 'This is the content of the first post.',
      authorName: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    const singlePost = await this.postsRepository.findOneBy({id});
    if(!singlePost){
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return singlePost;
  }

  async create(createPostData: CreatePostDto): Promise<Post> {
    const newPost = this.postsRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      authorName: createPostData.authorName,
    });
    return this.postsRepository.save(newPost);
  }

  private getNextId(): number {
    return this.posts.length > 0 ? Math.max(...this.posts.map(post => post.id)) + 1 : 1;
  }

  async update(id: number, updatePostData: UpdatePostDto): Promise<Post> {
    const currentPost = await this.postsRepository.findOneBy({id});
    if(!currentPost){
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const updatedPost = {
      ...currentPost,
      ...updatePostData,
      updatedAt: new Date(),
    };

    return this.postsRepository.save(updatedPost);

  }

  async remove(id: number): Promise<void> {
    const currentPost = await this.postsRepository.findOneBy({id});
    if(!currentPost){
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    await this.postsRepository.remove(currentPost);
  }
}
