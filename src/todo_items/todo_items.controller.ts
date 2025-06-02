import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { TodoItemsService } from './todo_items.service';
import { CreateTodoItemDto } from './dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo-item.dto';
import { TodoItem } from '../interfaces/todo_item.interface';

@Controller('api/todolists/:todoListId/items')
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  @Post()
  create(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Body() createTodoItemDto: CreateTodoItemDto,
  ): TodoItem {
    return this.todoItemsService.createItemInList(todoListId, createTodoItemDto);
  }

  @Put(':itemId')
  update(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ): TodoItem {
    return this.todoItemsService.updateItemInList(todoListId, itemId, updateTodoItemDto);
  }

  @Put(':itemId/complete')
  complete(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): TodoItem {
    return this.todoItemsService.completeItemInList(todoListId, itemId);
  }

  @Delete(':itemId')
  remove(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): void {
    return this.todoItemsService.removeItemFromList(todoListId, itemId);
  }

  @Get()
  findAll(@Param('todoListId', ParseIntPipe) todoListId: number): TodoItem[] {
    return this.todoItemsService.getItemsInList(todoListId);
  }
} 