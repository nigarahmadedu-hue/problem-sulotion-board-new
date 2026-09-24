import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Profile } from '../profiles/profile.entity';
import { Idea } from '../ideas/idea.entity';
import { Comment } from '../comments/comment.entity';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  author_id: string;

  @ManyToOne(() => Profile, profile => profile.problems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Profile;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  category: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  full_description: any;

  @Column({ type: 'text' })
  stage: string;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  who_faces_it: any;

  @Column({ type: 'int', default: 0 })
  evidence_references: number;

  @Column({ type: 'int', default: 0 })
  evidence_images: number;

  @Column({ type: 'int', default: 0 })
  evidence_solutions: number;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  looking_for_roles: any;

  @Column({ type: 'int', default: 0 })
  votes_count: number;

  @Column('text', { array: true, default: '{}' })
  evidence_image_urls: string[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Idea, idea => idea.problem)
  ideas: Idea[];

  @OneToMany(() => Comment, comment => comment.problem)
  comments: Comment[];
}
