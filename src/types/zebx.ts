export type ZebxRole = 'user' | 'assistant';

export interface ZebxHistoryMessage {
  role: ZebxRole;
  content: string;
}

export interface ZebxChatRequest {
  message: string;
  history: ZebxHistoryMessage[];
}

export interface ZebxChatResponse {
  message: string;
}
