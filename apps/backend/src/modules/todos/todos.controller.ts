import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { GetUser } from "src/common/decorators/get-user.decorator";
import { User } from "../users/entities/user.entity";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { stringify } from "querystring";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController{

  constructor(private readonly todosService: TodosService){}

  @Post()
  create( @Body() dto: CreateTodoDto, @GetUser() user,) {
      return this.todosService.create(dto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.todosService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return this.todosService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
    @GetUser() user: User,
  ) {
    return this.todosService.update(id, dto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return this.todosService.remove(id, user);
  }

}