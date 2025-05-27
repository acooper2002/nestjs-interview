import { Test, TestingModule } from '@nestjs/testing';
import { before } from 'node:test';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';

describe('TodoListsController', () => {
  let todoListService: TodoListsService;
  let todoListsController: TodoListsController;

  beforeEach(async () => {
    todoListService = new TodoListsService([
      { id: 1, name: 'test1', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'test2', createdAt: new Date(), updatedAt: new Date() },
    ]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [{ provide: TodoListsService, useValue: todoListService }],
    }).compile();

    todoListsController = app.get<TodoListsController>(TodoListsController);
  });

  describe('index', () => {
    it('should return the list of todolist', () => {
      const result = todoListsController.index();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        id: 1,
        name: 'test1',
      }));
      expect(result[1]).toEqual(expect.objectContaining({
        id: 2,
        name: 'test2',
      }));
    });
  });

  describe('show', () => {
    it('should return the todolist with the given id', () => {
      expect(todoListsController.show({ todoListId: 1 })).toEqual(
        expect.objectContaining({
          id: 1,
          name: 'test1',
        })
      );
    });
  });

  describe('update', () => {
    it('should update the todolist with the given id', () => {
      expect(
        todoListsController.update({ todoListId: 1 }, { name: 'modified' }),
      ).toEqual(expect.objectContaining({ 
        id: 1, 
        name: 'modified' 
      }));

      expect(todoListService.get(1).name).toEqual('modified');
    });
  });

  describe('create', () => {
    it('should create a new todolist', () => {
      expect(todoListsController.create({ name: 'new' })).toEqual(
        expect.objectContaining({
          id: 3,
          name: 'new',
        })
      );

      expect(todoListService.all().length).toBe(3);
    });
  });

  describe('delete', () => {
    it('should delete the todolist with the given id', () => {
      expect(() => todoListsController.delete({ todoListId: 1 })).not.toThrow();

      expect(todoListService.all().map((x) => x.id)).toEqual([2]);
    });
  });
});
