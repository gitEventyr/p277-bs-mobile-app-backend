import { EmailTemplate, EmailTemplateType, EmailTemplateData } from '../interfaces/email.interface';
export declare class EmailTemplateService {
    private readonly logger;
    private templates;
    constructor();
    private loadTemplates;
    getTemplate(type: EmailTemplateType): EmailTemplate | undefined;
    renderTemplate(type: EmailTemplateType, data: EmailTemplateData): EmailTemplate | null;
    getAllTemplateTypes(): EmailTemplateType[];
}
