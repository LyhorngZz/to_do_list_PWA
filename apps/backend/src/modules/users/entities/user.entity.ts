import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
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


  // ==========================

  @Column({
    type: 'varchar',
    nullable: true,
  })
  currentDeviceId: string | null;

  @Column({
    default: false,
  })
  isLoggedIn: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastSeen: Date | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  pin: string | null;

  

}