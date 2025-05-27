import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { TodoItem } from '../interfaces/todo_item.interface';
import { CreateTodoItemDto } from './dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo-item.dto';
import { TodoList } from '../interfaces/todo_list.interface';

@Injectable()
export class TodoItemsService {
  private nextItemId = 1;

  constructor(@Inject('TODO_LISTS') private todoLists: TodoList[]) {}

  createItemInList(listId: number, createTodoItemDto: CreateTodoItemDto): TodoItem {
    const list = this.todoLists.find(list => list.id === listId);
    if (!list) {
      throw new NotFoundException(`Todo list with ID ${listId} not found`);
    }

    const newItem: TodoItem = {
      id: this.nextItemId++,
      description: createTodoItemDto.description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!list.items) {
      list.items = [];
    }
    list.items.push(newItem);
    return newItem;
  }


} 