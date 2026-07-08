import { Injectable } from "@nestjs/common";
import { PullDto } from "./dto/pull.dto";
import { User } from "../users/entities/user.entity";
import { PushDto } from "./dto/push.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "../todos/entities/todo.entity";
import { Repository, DataSource } from "typeorm";
import { SyncTodo } from './types/sync-todo.interface';

@Injectable()
export class SyncService {

  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    private readonly dataSource: DataSource
  ){}

  async pull(dto: PullDto, user: User) {

    const syncTimestamp = new Date();

    const since = dto.lastPulledAt
      ? new Date(dto.lastPulledAt)
      : new Date(0);


    const todos = await this.todoRepository.query(
      `
      SELECT *
      FROM todos
      WHERE user_id = $1
        AND updated_at > $2
      `,
      [user.id, since.toISOString()],
    );

    console.log(todos);
    console.log(user.id);
    console.log(dto.lastPulledAt);

    const created: SyncTodo[] = [];
    const updated: SyncTodo[] = [];
    const deleted: SyncTodo[] = [];

    for (const row of todos) {
      const todo: SyncTodo = {
        id: row.id,
        title: row.title,
        description: row.description,
        completed: row.completed,
        deleted: row.deleted,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };

      if (todo.deleted) {
        deleted.push(todo);
      } else if (todo.createdAt.getTime() > since.getTime()) {
        created.push(todo);
      } else {
        updated.push(todo);
      }

    }

    for (const row of todos) {
      console.log(row.created_at);
      console.log(typeof row.created_at);
    }

    return {
      timestamp: syncTimestamp.toISOString(),
      changes: {
        todos: {
          created,
          updated,
          deleted,
        },
      },
    };
  }

  async push(
    dto: PushDto,
    user: User,
  ) {
    await this.dataSource.transaction(async manager => {

      // CREATED
      for (const todo of dto.changes.todos.created) {
        await manager.save(Todo, {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          deleted: false,
          user: {
            id: user.id,
          },
        });
      }


      // UPDATED
      for (const todo of dto.changes.todos.updated) {
        await manager.update(
          Todo,
          {
            id: todo.id,
            user: {
              id: user.id,
            },
          },
          {
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
          },
        );
      }

      // DELETED

      for (const todo of dto.changes.todos.deleted) {
        await manager.update(
          Todo,
          {
            id: todo.id,
            user: {
              id: user.id,
            },
          },
          {
            deleted: true,
          },
        );
      }

    });

    return {
      success: true,
    };
  }

}