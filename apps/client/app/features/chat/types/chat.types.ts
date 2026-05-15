export interface Message {
  id: string;

  content: string;

  createdAt: string;
  parentId?: string | null;

  user: {
    id: string;
    name: string;
  };

  attachments?: Array<{
    id: string;
    file: {
      id: string;
      fileName: string;
      mimeType: string;
      size: number;
      url: string;
    };
  }>;

  reactions?: Array<{
    id: string;
    emoji: string;
    userId: string;
  }>;

  replies?: Array<{
    id: string;
  }>;
}
