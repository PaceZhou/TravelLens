import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('mango_moments')
export class MangoMoment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  destination: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  images: string[];

  @Column()
  date: string;

  @CreateDateColumn()
  createdAt: Date;
}
