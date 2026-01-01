
import { Lead, LeadPlatform, LeadStatus, LeadType } from './types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    username: '@sarah_j',
    platform: LeadPlatform.INSTAGRAM,
    type: LeadType.COMMENT,
    initialMessage: 'I would love to know more about the pricing!',
    status: LeadStatus.NEW,
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messages: [],
    sentiment: 'Positive'
  },
  {
    id: '2',
    name: 'Michael Chen',
    username: 'mchen88',
    platform: LeadPlatform.FACEBOOK,
    type: LeadType.DM,
    initialMessage: 'Hi, do you offer group discounts?',
    status: LeadStatus.CONTACTED,
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messages: [
      { id: 'm1', text: 'Hi, do you offer group discounts?', sender: 'lead', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      { id: 'm2', text: 'Hello Michael! Yes, we do. How many people are in your group?', sender: 'system', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) }
    ],
    sentiment: 'Neutral'
  },
  {
    id: '3',
    name: 'Alex Rivera',
    username: '@arivera_fitness',
    platform: LeadPlatform.INSTAGRAM,
    type: LeadType.FORM,
    initialMessage: 'Lead Form Submission: Interest in Professional Tier',
    status: LeadStatus.CONVERTED,
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    messages: [],
    sentiment: 'Positive'
  }
];

export const DEFAULT_AUTOMATION_SETTINGS = {
  autoReplyEnabled: true,
  replyDelayMinutes: 5,
  template: "Hi {{name}}, thanks for reaching out! We've received your inquiry about '{{message}}'. One of our team members will be with you shortly. In the meantime, you can check our catalog here: https://example.com/catalog",
  keywords: ['price', 'how much', 'info', 'details', 'interested']
};
