import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { TodoItemsController } from '../todo_items/todo_items.controller';
import { TodoItemsService } from '../todo_items/todo_items.service';
import { TodoList } from '../interfaces/todo_list.interface';

@Module({
  imports: [],
  controllers: [TodoListsController, TodoItemsController],
  providers: [
    TodoListsService,
    TodoItemsService,
    {
      provide: 'TODO_LISTS',
      useValue: [] as TodoList[],
    },
  ],
})
export class TodoListsModule {}
