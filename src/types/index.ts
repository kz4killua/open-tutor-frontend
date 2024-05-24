export interface Document {
  id: number;
  name: string;
  file: string;
  created: string;
  size: number;
}

export interface DocumentMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  quote?: string;
  created: string;
}

export interface DocumentSelection {
  text: string;
  boundingClientRect: DOMRect;
}