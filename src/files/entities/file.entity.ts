import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Category } from '../enums/category.enum';
import { Language } from '../enums/language.enum';
import { Provider } from '../enums/provider.enum';
import { Role } from '../enums/role.enum';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 1000 })
  description: string;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Column({ type: 'enum', enum: Language })
  language: Language;

  @Column({ type: 'enum', enum: Provider })
  provider: Provider;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column()
  fileUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  viewCount: number;

  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;
}
