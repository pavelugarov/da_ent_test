export class CreateFileDto {
  userId?: string;
  filename: string;
  originalname: string;
  extension: string;
  mimetype: string;
  size: number;
  path: string;
}
