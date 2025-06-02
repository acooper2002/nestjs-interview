import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
  TextContent
} from '@modelcontextprotocol/sdk/types.js';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { TodoItemsService } from '../todo_items/todo_items.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoMcpServer {
  private server: Server;
  private todoListsService: TodoListsService;
  private todoItemsService: TodoItemsService;

  constructor(todoListsService: TodoListsService, todoItemsService: TodoItemsService) {
    this.server = new Server(
      {
        name: 'todo-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.todoListsService = todoListsService;
    this.todoItemsService = todoItemsService;
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getAvailableTools()
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        switch (name) {
          case 'create_todo_list':
            return await this.createTodoList(args);
          
          case 'get_todo_lists':
            return await this.getTodoLists(args);
          
          case 'get_todo_list':
            return await this.getTodoList(args);
          
          case 'update_todo_list':
            return await this.updateTodoList(args);
          
          case 'delete_todo_list':
            return await this.deleteTodoList(args);
          
          case 'create_todo_item':
            return await this.createTodoItem(args);
          
          case 'get_todo_items':
            return await this.getTodoItems(args);
          
          case 'update_todo_item':
            return await this.updateTodoItem(args);
          
          case 'complete_todo_item':
            return await this.completeTodoItem(args);
          
          case 'delete_todo_item':
            return await this.deleteTodoItem(args);
          
          case 'find_list_by_name':
            return await this.findListByName(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`
            } as TextContent
          ],
          isError: true
        } as CallToolResult;
      }
    });
  }

  private getAvailableTools(): Tool[] {
    return [
      {
        name: 'create_todo_list',
        description: 'Create a new todo list',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the todo list'
            }
          },
          required: ['name']
        }
      },
      {
        name: 'get_todo_lists',
        description: 'Get all todo lists',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_todo_list',
        description: 'Get a specific todo list by ID',
        inputSchema: {
          type: 'object',
          properties: {
            listId: {
              type: 'number',
              description: 'ID of the todo list'
            }
          },
          required: ['listId']
        }
      },
      {
        name: 'update_todo_list',
        description: 'Update the name of a todo list',
        inputSchema: {
          type: 'object',
          properties: {
            listId: {
              type: 'number',
              description: 'ID of the todo list'
            },
            name: {
              type: 'string',
              description: 'New list name'
            }
          },
          required: ['listId', 'name']
        }
      },
      {
        name: 'delete_todo_list',
        description: 'Delete a todo list',
        inputSchema: {
          type: 'object',
          properties: {
            listId: {
              type: 'number',
              description: 'ID of the todo list to delete'
            }
          },
          required: ['listId']
        }
      },
      {
        name: 'create_todo_item',
        description: 'Create a new item in a todo list. Can find the list by name if ID is not provided.',
        inputSchema: {
          type: 'object',
          properties: {
            listId: {
              type: 'number',
              description: 'ID of the todo list (optional if listName is provided)'
            },
            listName: {
              type: 'string',
              description: 'Name of the todo list (alternative to ID)'
            },
            description: {
              type: 'string',
              description: 'Description of the todo item'
            }
          },
          required: ['description']
        }
      },
      {
        name: 'get_todo_items',
        description: 'Get all items for a todo list',
        inputSchema: {
          type: 'object',
          properties: {
            listId: {
              type: 'number',
              description: 'ID of the todo list'
            },
            listName: {
              type: 'string',
              description: 'Name of the todo list (alternative to ID)'
            }
          }
        }
      },
      {
        name: 'update_todo_item',
        description: 'Update the description of a todo item',
        inputSchema: {
          type: 'object',
          properties: {
            listId: {
              type: 'number',
              description: 'ID of the todo list'
            },
            itemId: {
              type: 'number',
              description: 'ID of the todo item'
            },
            description: {
              type: 'string',
              description: 'New item description'
            }
          },
          required: ['listId', 'itemId', 'description']
        }
      },
      {
        name: 'complete_todo_item',
        description: 'Mark a todo item as completed',
        inputSchema: {
          type: 'object',
          properties: {
            listId: {
              type: 'number',
              description: 'ID of the todo list'
            },
            itemId: {
              type: 'number',
              description: 'ID of the todo item'
            }
          },
          required: ['listId', 'itemId']
        }
      },
      {
        name: 'delete_todo_item',
        description: 'Delete a todo item',
        inputSchema: {
          type: 'object',
          properties: {
            listId: {
              type: 'number',
              description: 'ID of the todo list'
            },
            itemId: {
              type: 'number',
              description: 'ID of the todo item to delete'
            }
          },
          required: ['listId', 'itemId']
        }
      },
      {
        name: 'find_list_by_name',
        description: 'Find a todo list by name',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the list to find'
            }
          },
          required: ['name']
        }
      }
    ];
  }

  private async createTodoList(args: any): Promise<CallToolResult> {
    const result = this.todoListsService.create({ name: args.name });
    return {
      content: [
        {
          type: 'text',
          text: `Todo list created successfully:\n- ID: ${result.id}\n- Name: ${result.name}\n- Created: ${result.createdAt}`
        } as TextContent
      ]
    };
  }

  private async getTodoLists(args: any): Promise<CallToolResult> {
    const lists = this.todoListsService.all();
    const listText = lists.map(list => 
      `- ID: ${list.id}, Name: "${list.name}", Items: ${list.items?.length || 0}`
    ).join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `Available todo lists (${lists.length}):\n${listText}`
        } as TextContent
      ]
    };
  }

  private async getTodoList(args: any): Promise<CallToolResult> {
    const list = this.todoListsService.get(+args.listId);
    if (!list) {
      throw new Error(`Todo list with ID ${args.listId} not found`);
    }
    // Fetch items using the items service
    const items = this.todoItemsService.getItemsInList(+args.listId);
    list.items = items; // Attach items for the response
    const itemsText = list.items?.map(item => 
      `  - [${item.completed ? '✓' : ' '}] ${item.description} (ID: ${item.id})`
    ).join('\n') || '  (no items)';

    return {
      content: [
        {
          type: 'text',
          text: `Todo list "${list.name}" (ID: ${list.id}):\n${itemsText}`
        } as TextContent
      ]
    };
  }

  private async updateTodoList(args: any): Promise<CallToolResult> {
    const result = this.todoListsService.update(+args.listId, { name: args.name });
    if (!result) {
       throw new Error(`Todo list with ID ${args.listId} not found`);
    }
    return {
      content: [
        {
          type: 'text',
          text: `List updated successfully:\n- ID: ${result.id}\n- New name: ${result.name}`
        } as TextContent
      ]
    };
  }

  private async deleteTodoList(args: any): Promise<CallToolResult> {
    this.todoListsService.delete(+args.listId);
     // Assuming delete does not return a boolean based on the service code
    return {
      content: [
        {
          type: 'text',
          text: `Todo list with ID ${args.listId} deleted successfully`
        } as TextContent
      ]
    };
  }

  private async createTodoItem(args: any): Promise<CallToolResult> {
    let listId = args.listId;
    
    if (!listId && args.listName) {
      const list = this.todoListsService.all().find(l => l.name.toLowerCase() === args.listName.toLowerCase());
      if (!list) {
        throw new Error(`No list found with name "${args.listName}"`);
      }
      listId = list.id;
    }
    
    if (!listId) {
      throw new Error('Must provide either listId or listName');
    }

    const item = this.todoItemsService.createItemInList(+listId, { description: args.description });
    return {
      content: [
        {
          type: 'text',
          text: `Item created successfully in list ${listId}:\n- ID: ${item.id}\n- Description: ${item.description}\n- Completed: ${item.completed}`
        } as TextContent
      ]
    };
  }

  private async getTodoItems(args: any): Promise<CallToolResult> {
    let listId = args.listId;
    
    if (!listId && args.listName) {
      const list = this.todoListsService.all().find(l => l.name.toLowerCase() === args.listName.toLowerCase());
      if (!list) {
        throw new Error(`No list found with name "${args.listName}"`);
      }
      listId = list.id;
    }
    
    if (!listId) {
      throw new Error('Must provide either listId or listName');
    }

    const items = this.todoItemsService.getItemsInList(+listId);
    const itemsText = items.map(item => 
      `- [${item.completed ? '✓' : ' '}] ${item.description} (ID: ${item.id})`
    ).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Items in list ${listId} (${items.length} items):\n${itemsText || '(no items)'}`
        } as TextContent
      ]
    };
  }

  private async updateTodoItem(args: any): Promise<CallToolResult> {
    if (!args.listId || !args.itemId || !args.description) {
        throw new Error('Must provide listId, itemId, and description to update item');
    }
    const item = this.todoItemsService.updateItemInList(+args.listId, +args.itemId, { description: args.description });
    if (!item) {
       throw new Error(`Todo item with ID ${args.itemId} not found in list ${args.listId}`);
    }
    return {
      content: [
        {
          type: 'text',
          text: `Item updated successfully:\n- ID: ${item.id}\n- New description: ${item.description}`
        } as TextContent
      ]
    };
  }

  private async completeTodoItem(args: any): Promise<CallToolResult> {
     if (!args.listId || !args.itemId) {
        throw new Error('Must provide listId and itemId to complete item');
     }
    const item = this.todoItemsService.completeItemInList(+args.listId, +args.itemId);
    if (!item) {
       throw new Error(`Todo item with ID ${args.itemId} not found in list ${args.listId}`);
    }
    return {
      content: [
        {
          type: 'text',
          text: `Item marked as completed:\n- ID: ${item.id}\n- Description: ${item.description}\n- ✓ Completed`
        } as TextContent
      ]
    };
  }

  private async deleteTodoItem(args: any): Promise<CallToolResult> {
     if (!args.listId || !args.itemId) {
        throw new Error('Must provide listId and itemId to delete item');
     }
    this.todoItemsService.removeItemFromList(+args.listId, +args.itemId);
    return {
      content: [
        {
          type: 'text',
          text: `Item with ID ${args.itemId} deleted successfully from list ${args.listId}`
        } as TextContent
      ]
    };
  }

  private async findListByName(args: any): Promise<CallToolResult> {
    if (!args.name) {
        throw new Error('Must provide name to find list');
    }
    const lists = this.todoListsService.all();
    const list = lists.find(l => l.name.toLowerCase() === args.name.toLowerCase());
    if (!list) {
      return {
        content: [
          {
            type: 'text',
            text: `No list found with name "${args.name}"`
          } as TextContent
        ]
      };
    }
    const items = this.todoItemsService.getItemsInList(+list.id);
    list.items = items; 

    return {
      content: [
        {
          type: 'text',
          text: `List found:\n- ID: ${list.id}\n- Name: ${list.name}\n- Items: ${list.items?.length || 0}`
        } as TextContent
      ]
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Todo MCP server started on stdin/stdout');
  }
}