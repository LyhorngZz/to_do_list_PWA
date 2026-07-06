import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { User } from '../users/entities/user.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
    ) {}


  async create(
      dto: CreateTodoDto,
      user: User,
  ) {
      const todo = this.todoRepository.create({
          ...dto,
          user,
      });

      return this.todoRepository.save(todo);
  }


  async findAll(user: User) {
    return this.todoRepository.find({
      where: {
        user: {
          id: user.id,
        },
        deleted: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }


  async findOne(id: string, user: User) {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
        deleted: false,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(
    id: string,
    dto: UpdateTodoDto,
    user: User,
  ) {
    const todo = await this.findOne(id, user);

    Object.assign(todo, dto);

    return this.todoRepository.save(todo);
  }


  async remove(
    id: string,
    user: User,
  ) {
    const todo = await this.findOne(id, user);

    todo.deleted = true;

    await this.todoRepository.save(todo);

    return {
      message: 'Todo deleted successfully',
    };
  }

}