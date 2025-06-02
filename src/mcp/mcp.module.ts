import { Module } from '@nestjs/common';
import { TodoMcpServer } from './mcp-server';
import { TodoListsModule } from '../todo_lists/todo_lists.module';
import { TodoItemsModule } from '../todo_items/todo_items.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule, TodoListsModule, TodoItemsModule],
  providers: [TodoMcpServer],
  exports: [TodoMcpServer],
})
export class McpModule {} 