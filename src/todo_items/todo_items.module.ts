import { Module } from '@nestjs/common';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [TodoItemsController],
  providers: [TodoItemsService],
})
export class TodoItemsModule {} 