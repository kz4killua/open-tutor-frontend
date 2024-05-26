export interface Document {
  id: number;
  name: string;
  file: string;
  created: string;
  size: number;
  page_count: number;
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

export interface Flashcard {
  id: number;
  referenced_page_number: number;
  front: string;
  back: string;
}