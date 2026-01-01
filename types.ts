
export enum LeadPlatform {
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook'
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  FOLLOWED_UP = 'Followed Up',
  CONVERTED = 'Converted',
  CLOSED = 'Closed'
}

export enum LeadType {
  DM = 'DM',
  COMMENT = 'Comment',
  FORM = 'Lead Form'
}

export interface Message {
  id: string;
  text: string;
  sender: 'system' | 'user' | 'lead';
  timestamp: Date;
}

export interface Lead {
  id: string;
  name: string;
  username: string;
  platform: LeadPlatform;
  type: LeadType;
  initialMessage: string;
  status: LeadStatus;
  capturedAt: Date;
  messages: Message[];
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
}

export interface AutomationSettings {
  autoReplyEnabled: boolean;
  replyDelayMinutes: number;
  template: string;
  keywords: string[];
}

export interface DashboardStats {
  totalLeads: number;
  igLeads: number;
  fbLeads: number;
  conversionRate: number;
  newLeadsToday: number;
}
