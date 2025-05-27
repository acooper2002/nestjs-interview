import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoItem } from '../interfaces/todo_item.interface';
import { NotFoundException } from '@nestjs/common';

describe('TodoItemsController', () => {
  let todoItemsController: TodoItemsController;
  let todoItemsService: TodoItemsService;
  let mockTodoLists: TodoList[];

  beforeEach(async () => {
    // Create a mock todo list with some items
    const mockItem1: TodoItem = {
      id: 1,
      description: 'Test item 1',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockItem2: TodoItem = {
      id: 2,
      description: 'Test item 2',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTodoLists = [
      {
        id: 1,
        name: 'Test List 1',
        items: [mockItem1, mockItem2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Test List 2',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    todoItemsService = new TodoItemsService(mockTodoLists);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemsController],
      providers: [
        {
          provide: TodoItemsService,
          useValue: todoItemsService,
        },
      ],
    }).compile();

    todoItemsController = module.get<TodoItemsController>(TodoItemsController);
  });

  describe('findAll', () => {
    it('should return all items in a todo list', () => {
      const result = todoItemsController.findAll(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        id: 1,
        description: 'Test item 1',
        completed: false,
      }));
      expect(result[1]).toEqual(expect.objectContaining({
        id: 2,
        description: 'Test item 2',
        completed: true,
      }));
    });

    it('should return empty array for list with no items', () => {
      const result = todoItemsController.findAll(2);
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException for non-existent list', () => {
      expect(() => todoItemsController.findAll(999)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new todo item in a list', () => {
      const newItem = { description: 'New test item' };
      const result = todoItemsController.create(1, newItem);

      expect(result).toEqual(expect.objectContaining({
        description: 'New test item',
        completed: false,
      }));
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      // Verify the item was added to the list
      const listItems = todoItemsService.getItemsInList(1);
      expect(listItems).toHaveLength(3);
      expect(listItems[2].description).toBe('New test item');
    });

    it('should throw NotFoundException when creating item in non-existent list', () => {
      const newItem = { description: 'New test item' };
      expect(() => todoItemsController.create(999, newItem)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing todo item', () => {
      const updateData = { description: 'Updated description' };
      const result = todoItemsController.update(1, 1, updateData);

      expect(result).toEqual(expect.objectContaining({
        id: 1,
        description: 'Updated description',
        completed: false,
      }));
      expect(result.updatedAt).toBeDefined();
    });

    it('should throw NotFoundException when updating item in non-existent list', () => {
      const updateData = { description: 'Updated description' };
      expect(() => todoItemsController.update(999, 1, updateData)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when updating non-existent item', () => {
      const updateData = { description: 'Updated description' };
      expect(() => todoItemsController.update(1, 999, updateData)).toThrow(NotFoundException);
    });
  });

  describe('complete', () => {
    it('should mark a todo item as completed', () => {
      const result = todoItemsController.complete(1, 1);

      expect(result).toEqual(expect.objectContaining({
        id: 1,
        description: 'Test item 1',
        completed: true,
      }));
      expect(result.updatedAt).toBeDefined();
    });

    it('should throw NotFoundException when completing item in non-existent list', () => {
      expect(() => todoItemsController.complete(999, 1)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when completing non-existent item', () => {
      expect(() => todoItemsController.complete(1, 999)).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a todo item from a list', () => {
      expect(() => todoItemsController.remove(1, 1)).not.toThrow();
      
      // Verify the item was removed
      const listItems = todoItemsService.getItemsInList(1);
      expect(listItems).toHaveLength(1);
      expect(listItems[0].id).toBe(2);
    });

    it('should throw NotFoundException when removing item from non-existent list', () => {
      expect(() => todoItemsController.remove(999, 1)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when removing non-existent item', () => {
      expect(() => todoItemsController.remove(1, 999)).toThrow(NotFoundException);
    });
  });
}); 