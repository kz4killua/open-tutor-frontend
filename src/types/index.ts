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

export interface UserInput {
  query: string;
  quote: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export interface Highlight {
  id: number;
  page_number: number;
  text: string;
  client_rects: HighlightRect[]
}


export interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}