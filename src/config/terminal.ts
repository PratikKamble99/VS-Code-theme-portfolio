// Terminal configuration

export const terminalConfig = {
  // EmailJS configuration
  emailjs: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  },
  
  // Webhook configuration (alternative to EmailJS)
  webhook: {
    url: process.env.NEXT_PUBLIC_WEBHOOK_URL || '',
    secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET || '',
  },
  
  // Rate limiting
  rateLimiting: {
    cooldownMs: parseInt(process.env.NEXT_PUBLIC_MESSAGE_COOLDOWN_MS || '60000', 10),
  },
  
  // Terminal settings
  terminal: {
    maxHistoryEntries: 100,
    maxCommandHistory: 50,
    defaultHeight: 300,
    minHeight: 200,
    maxHeight: 600,
    animationDuration: 300,
  },
  
  // Command settings
  commands: {
    autocompleteTrigger: 'Tab',
    historySuggestionLimit: 5,
    levenshteinThreshold: 2,
  },
  
  // Check if EmailJS is configured
  isEmailJSConfigured(): boolean {
    return !!(
      this.emailjs.serviceId &&
      this.emailjs.templateId &&
      this.emailjs.publicKey
    );
  },
  
  // Check if webhook is configured
  isWebhookConfigured(): boolean {
    return !!(this.webhook.url && this.webhook.secret);
  },
  
  // Check if any message service is configured
  isMessageServiceConfigured(): boolean {
    return this.isEmailJSConfigured() || this.isWebhookConfigured();
  },
};

export default terminalConfig;
