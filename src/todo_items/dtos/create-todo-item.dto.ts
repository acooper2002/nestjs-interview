import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTodoItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;
} 