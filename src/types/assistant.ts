export type AssistantBlock =
  | { type: 'text'; text: string }
  | { type: 'bullets'; items: string[] }
  | {
      type: 'table';
      caption?: string;
      columns: string[];
      rows: (string | number)[][];
    }
  | {
      type: 'compare';
      caption?: string;
      homeLabel: string;
      awayLabel: string;
      rows: { label: string; home: number; away: number; suffix?: string }[];
    }
  | { type: 'form'; rows: { team: string; results: ('W' | 'D' | 'L')[] }[] }
  | { type: 'callout'; tone: 'info' | 'caution'; text: string };

export interface AssistantReply {
  id: string;
  blocks: AssistantBlock[];
  sources: string[];
  followUps: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  reply?: AssistantReply;
  streaming?: boolean;
}
