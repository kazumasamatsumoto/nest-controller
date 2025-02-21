export class File {
  id: number;
  originalName: string;
  fileName: string;
  description?: string;
  path: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}
