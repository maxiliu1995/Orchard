export interface EmailConfig {
  apiKey: string;
  from: string;
  templates: {
    [key: string]: string;
  };
}

export interface EmailPayload {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
} 