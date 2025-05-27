import { IsString, IsOptional } from 'class-validator';

export class UpdateTodoItemDto {
  @IsString()
  @IsOptional()
  description?: string;
} 