export type TemplateType = 'default' | 'reset-password' | 'new-order';

export interface IEmailJob {
  value:
    | {
        title: string;
        body: string;
      }
    | {
        receiverEmail: string;
        title: string;
        body: string;
        template: TemplateType;
      };
}
