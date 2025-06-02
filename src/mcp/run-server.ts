import { NestFactory } from '@nestjs/core';
import { McpModule } from './mcp.module';
import { TodoMcpServer } from './mcp-server';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(McpModule);
  
  const mcpServer = app.get(TodoMcpServer);
  
  try {
    await mcpServer.run();
    console.error('MCP server started successfully');
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

bootstrap(); 