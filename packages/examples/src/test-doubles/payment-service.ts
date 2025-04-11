/**
 * Example payment service with external dependencies
 * This demonstrates different types of dependencies that can be tested
 * with various test doubles (stubs, mocks, and spies)
 */

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentDetails {
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentGateway {
  processPayment(details: PaymentDetails): Promise<PaymentResult>;
  refundPayment(transactionId: string): Promise<PaymentResult>;
}

export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
}

export interface NotificationService {
  sendPaymentConfirmation(email: string, amount: number, transactionId: string): Promise<boolean>;
  sendPaymentFailure(email: string, amount: number, reason: string): Promise<boolean>;
}

export class PaymentService {
  private paymentGateway: PaymentGateway;
  private logger: Logger;
  private notificationService: NotificationService;
  
  constructor(
    paymentGateway: PaymentGateway,
    logger: Logger,
    notificationService: NotificationService
  ) {
    this.paymentGateway = paymentGateway;
    this.logger = logger;
    this.notificationService = notificationService;
  }
  
  /**
   * Process a payment and send confirmation
   * @param details Payment details
   * @param email Customer email for notification
   * @returns Payment result
   */
  async processPayment(details: PaymentDetails, email: string): Promise<PaymentResult> {
    try {
      this.logger.info('Processing payment', { amount: details.amount });
      
      this.validatePaymentDetails(details);
      
      const result = await this.paymentGateway.processPayment(details);
      
      if (result.success) {
        this.logger.info('Payment successful', { 
          amount: details.amount,
          transactionId: result.transactionId
        });
        
        await this.notificationService.sendPaymentConfirmation(
          email,
          details.amount,
          result.transactionId!
        );
      } else {
        this.logger.error('Payment failed', undefined, {
          amount: details.amount,
          error: result.error
        });
        
        await this.notificationService.sendPaymentFailure(
          email,
          details.amount,
          result.error || 'Unknown error'
        );
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Payment processing error', error instanceof Error ? error : undefined, {
        amount: details.amount
      });
      
      await this.notificationService.sendPaymentFailure(
        email,
        details.amount,
        errorMessage
      );
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  /**
   * Refund a payment
   * @param transactionId Transaction ID to refund
   * @param email Customer email for notification
   * @returns Refund result
   */
  async refundPayment(transactionId: string, email: string): Promise<PaymentResult> {
    try {
      this.logger.info('Processing refund', { transactionId });
      
      const result = await this.paymentGateway.refundPayment(transactionId);
      
      if (result.success) {
        this.logger.info('Refund successful', { transactionId });
      } else {
        this.logger.error('Refund failed', undefined, {
          transactionId,
          error: result.error
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Refund processing error', error instanceof Error ? error : undefined, {
        transactionId
      });
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  /**
   * Validate payment details
   * @param details Payment details to validate
   * @throws Error if validation fails
   */
  private validatePaymentDetails(details: PaymentDetails): void {
    if (details.amount <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }
    
    if (!details.cardNumber || details.cardNumber.length < 15) {
      throw new Error('Invalid card number');
    }
    
    if (!details.expiryDate || !details.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      throw new Error('Invalid expiry date format (MM/YY)');
    }
    
    if (!details.cvv || details.cvv.length < 3) {
      throw new Error('Invalid CVV');
    }
  }
}
