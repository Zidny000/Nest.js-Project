import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

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

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post{
    const singlePost = this.posts.find(post => post.id === id);
    if(!singlePost){
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return singlePost;
  }

  create(createPostData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
    const newPost: Post = {
      id: this.getNextId(),
      ...createPostData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.posts.push(newPost);
    return newPost;
  }

  private getNextId(): number {
    return this.posts.length > 0 ? Math.max(...this.posts.map(post => post.id)) + 1 : 1;
  }

  update(id: number, updatePostData: Partial<Omit<Post, 'id' | 'createdAt'>>): Post {
    const currentPostIndex = this.posts.findIndex(post=> post.id === id);
    if(currentPostIndex === -1){
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.posts[currentPostIndex] = {
      ...this.posts[currentPostIndex],
      ...updatePostData,
      updatedAt: new Date(),
    };
    return this.posts[currentPostIndex];
  }

  remove(id: number): {message: string} {
    const currentPostIndexToDelete = this.posts.findIndex(post=> post.id === id);
    if(currentPostIndexToDelete === -1){
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.posts.splice(currentPostIndexToDelete, 1);
    return {message: `Post with ID ${id} deleted successfully`};
  }
}
