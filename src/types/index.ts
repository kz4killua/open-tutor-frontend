export interface Document {
  id: number;
  name: string;
  file: string;
  created: string;
}


export interface DocumentMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}