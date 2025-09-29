import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsUUID()
  sessionId?: string;
}