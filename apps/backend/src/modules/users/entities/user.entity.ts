import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true, nullable: true
  })
  email: string;

  @Column({ nullable: true })
  password: string;


  @Column()
  username: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt: Date;

  @Column({ unique: true, nullable: true })
  telegramId: string;
}