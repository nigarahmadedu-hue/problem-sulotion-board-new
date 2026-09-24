import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Profile } from '../profiles/profile.entity';
import { Problem } from '../problems/problem.entity';
import { Comment } from '../comments/comment.entity';
import { Vote } from '../votes/vote.entity';

@Entity('ideas')
export class Idea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  problem_id: string;

  @ManyToOne(() => Problem, problem => problem.ideas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @Column({ type: 'uuid' })
  author_id: string;

  @ManyToOne(() => Profile, profile => profile.ideas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Profile;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  who_would_use: string;

  @Column({ type: 'text', nullable: true })
  needed_to_build: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Comment, comment => comment.idea)
  comments: Comment[];

  @OneToMany(() => Vote, vote => vote.idea)
  votes: Vote[];
}
