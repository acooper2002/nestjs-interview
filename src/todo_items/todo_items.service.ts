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

  updateItemInList(listId: number, itemId: number, updateTodoItemDto: UpdateTodoItemDto): TodoItem {
    const list = this.todoLists.find(list => list.id === listId);
    if (!list || !list.items) {
      throw new NotFoundException(`Todo list with ID ${listId} not found`);
    }

    const item = list.items.find(item => item.id === itemId);
    if (!item) {
      throw new NotFoundException(`Todo item with ID ${itemId} not found in list ${listId}`);
    }

    if (updateTodoItemDto.description !== undefined) {
      item.description = updateTodoItemDto.description;
    }
    item.updatedAt = new Date();

    return item;
  }

  completeItemInList(listId: number, itemId: number): TodoItem {
    const list = this.todoLists.find(list => list.id === listId);
    if (!list || !list.items) {
      throw new NotFoundException(`Todo list with ID ${listId} not found`);
    }

    const item = list.items.find(item => item.id === itemId);
    if (!item) {
      throw new NotFoundException(`Todo item with ID ${itemId} not found in list ${listId}`);
    }

    item.completed = true;
    item.updatedAt = new Date();

    return item;
  }

  removeItemFromList(listId: number, itemId: number): void {
    const list = this.todoLists.find(list => list.id === listId);
    if (!list || !list.items) {
      throw new NotFoundException(`Todo list with ID ${listId} not found`);
    }

    const itemIndex = list.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new NotFoundException(`Todo item with ID ${itemId} not found in list ${listId}`);
    }

    list.items.splice(itemIndex, 1);
  }

  getItemsInList(listId: number): TodoItem[] {
    const list = this.todoLists.find(list => list.id === listId);
    if (!list) {
      throw new NotFoundException(`Todo list with ID ${listId} not found`);
    }
    return list.items || [];
  }
} 