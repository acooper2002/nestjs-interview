import { Module, Global } from '@nestjs/common';
import { TodoList } from '../interfaces/todo_list.interface';

@Global()
@Module({
  providers: [
    {
      provide: 'TODO_LISTS',
      useValue: [] as TodoList[],
    }
  ],
  exports: ['TODO_LISTS'],
})
export class SharedModule {} 