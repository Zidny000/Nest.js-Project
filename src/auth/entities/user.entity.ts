import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Post } from "../../posts/entities/post.entity";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50})
    name: string;

    @Column({unique : true})
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @OneToMany(() => Post, post => post.authorName)
    posts: Post[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}