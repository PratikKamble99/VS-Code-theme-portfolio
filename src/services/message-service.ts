/**
 * Message Service - Handle sending messages from the terminal
 * 
 * Features:
 * - Rate limiting to prevent spam
 * - Message validation
 * - EmailJS integration for sending emails
 * - Fallback webhook support
 */

interface MessageResult {
  success: boolean;
  message: string;
  error?: string;
}

interface MessageServiceConfig {
  cooldownMs: number;
  minMessageLength: number;
  maxMessageLength: number;
  emailjsServiceId?: string;
  emailjsTemplateId?: string;
  emailjsPublicKey?: string;
  webhookUrl?: string;
  webhookSecret?: string;
}

class MessageService {
  private lastMessageTime: number = 0;
  private config: MessageServiceConfig;

  constructor(config: MessageServiceConfig) {
    this.config = config;
  }

  /**
   * Check if a message can be sent (not rate limited)
   */
  canSendMessage(): boolean {
    const now = Date.now();
    return (now - this.lastMessageTime) >= this.config.cooldownMs;
  }

  /**
   * Get the cooldown period in seconds
   */
  getCooldownPeriod(): number {
    return Math.ceil(this.config.cooldownMs / 1000);
  }

  /**
   * Get remaining cooldown time in seconds
   */
  getRemainingCooldown(): number {
    const now = Date.now();
    const elapsed = now - this.lastMessageTime;
    const remaining = this.config.cooldownMs - elapsed;
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  /**
   * Validate message content
   */
  private validateMessage(message: string): { valid: boolean; error?: string } {
    if (!message || typeof message !== 'string') {
      return { valid: false, error: 'Message is required' };
    }

    const trimmed = message.trim();
    
    if (trimmed.length < this.config.minMessageLength) {
      return { 
        valid: false, 
        error: `Message must be at least ${this.config.minMessageLength} characters long` 
      };
    }

    if (trimmed.length > this.config.maxMessageLength) {
      return { 
        valid: false, 
        error: `Message must be no more than ${this.config.maxMessageLength} characters long` 
      };
    }

    return { valid: true };
  }

  /**
   * Send message via EmailJS
   */
  private async sendViaEmailJS(message: string): Promise<MessageResult> {
    try {
      // Dynamic import to avoid SSR issues
      const emailjs = await import('@emailjs/browser');
      
      if (!this.config.emailjsServiceId || !this.config.emailjsTemplateId || !this.config.emailjsPublicKey) {
        throw new Error('EmailJS configuration is incomplete');
      }

      const templateParams = {
        message: message,
        from_name: 'Portfolio Visitor',
        timestamp: new Date().toISOString(),
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
      };

      await emailjs.send(
        this.config.emailjsServiceId,
        this.config.emailjsTemplateId,
        templateParams,
        this.config.emailjsPublicKey
      );

      return {
        success: true,
        message: '✓ Message sent successfully via email!'
      };
    } catch (error) {
      console.error('EmailJS error:', error);
      return {
        success: false,
        message: '✗ Failed to send message via email',
        error: error instanceof Error ? error.message : 'Unknown EmailJS error'
      };
    }
  }

  /**
   * Send message via webhook
   */
  private async sendViaWebhook(message: string): Promise<MessageResult> {
    try {
      if (!this.config.webhookUrl) {
        throw new Error('Webhook URL not configured');
      }

      const payload = {
        message: message,
        timestamp: new Date().toISOString(),
        source: 'portfolio-terminal',
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.config.webhookSecret) {
        headers['Authorization'] = `Bearer ${this.config.webhookSecret}`;
      }

      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      return {
        success: true,
        message: '✓ Message sent successfully via webhook!'
      };
    } catch (error) {
      console.error('Webhook error:', error);
      return {
        success: false,
        message: '✗ Failed to send message via webhook',
        error: error instanceof Error ? error.message : 'Unknown webhook error'
      };
    }
  }

  /**
   * Send a message using the configured method
   */
  async sendMessage(message: string): Promise<MessageResult> {
    // Check rate limiting
    if (!this.canSendMessage()) {
      const remaining = this.getRemainingCooldown();
      return {
        success: false,
        message: `⏱ Please wait ${remaining} seconds before sending another message`,
        error: 'Rate limited'
      };
    }

    // Validate message
    const validation = this.validateMessage(message);
    if (!validation.valid) {
      return {
        success: false,
        message: `✗ ${validation.error}`,
        error: validation.error
      };
    }

    // Update rate limiting timestamp
    this.lastMessageTime = Date.now();

    // Try EmailJS first, then webhook as fallback
    if (this.config.emailjsServiceId && this.config.emailjsTemplateId && this.config.emailjsPublicKey) {
      const emailResult = await this.sendViaEmailJS(message);
      if (emailResult.success) {
        return emailResult;
      }
      
      // If EmailJS fails and webhook is available, try webhook
      if (this.config.webhookUrl) {
        console.warn('EmailJS failed, trying webhook fallback');
        return await this.sendViaWebhook(message);
      }
      
      return emailResult;
    } else if (this.config.webhookUrl) {
      return await this.sendViaWebhook(message);
    } else {
      return {
        success: false,
        message: '✗ No message delivery method configured',
        error: 'No EmailJS or webhook configuration found'
      };
    }
  }
}

// Create and export singleton instance
let messageServiceInstance: MessageService | null = null;

export function getMessageService(): MessageService {
  if (!messageServiceInstance) {
    const config: MessageServiceConfig = {
      cooldownMs: parseInt(process.env.NEXT_PUBLIC_MESSAGE_COOLDOWN_MS || '60000', 10),
      minMessageLength: 10,
      maxMessageLength: 1000,
      emailjsServiceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      emailjsTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      emailjsPublicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL,
      webhookSecret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET
    };

    messageServiceInstance = new MessageService(config);
  }

  return messageServiceInstance;
}

export default MessageService;