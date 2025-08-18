export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailTemplateData {
  [key: string]: any;
}

export interface EmailProvider {
  sendEmail(options: EmailOptions): Promise<void>;
  verifyConnection(): Promise<boolean>;
}

export enum EmailTemplateType {
  WELCOME = 'welcome',
  EMAIL_VERIFICATION = 'email-verification',
  PASSWORD_RESET = 'password-reset',
  ACCOUNT_LOCKED = 'account-locked',
  PROMOTIONAL = 'promotional',
}