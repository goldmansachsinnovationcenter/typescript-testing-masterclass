/**
 * This test file demonstrates the differences between various test doubles
 * (stubs, mocks, and spies) in Vitest with TypeScript.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  PaymentService, 
  PaymentGateway, 
  Logger, 
  NotificationService,
  PaymentDetails,
  PaymentResult
} from './payment-service';

describe('Test Doubles: Stubs vs Mocks vs Spies', () => {
  const validPaymentDetails: PaymentDetails = {
    amount: 100,
    cardNumber: '4111111111111111',
    expiryDate: '12/25',
    cvv: '123'
  };
  
  const customerEmail = 'customer@example.com';
  
  describe('Using Stubs', () => {
    /**
     * STUBS:
     * - Replace real objects with simplified implementations
     * - Return predefined responses
     * - Don't track or verify calls
     * - Used when you only care about the RESULT, not HOW it was achieved
     */
    
    it('should process payment successfully using stubs', async () => {
      const stubGateway: PaymentGateway = {
        processPayment: async () => ({ 
          success: true, 
          transactionId: 'stub-transaction-123' 
        }),
        refundPayment: async () => ({ success: true })
      };
      
      const stubLogger: Logger = {
        info: () => {},
        error: () => {}
      };
      
      const stubNotificationService: NotificationService = {
        sendPaymentConfirmation: async () => true,
        sendPaymentFailure: async () => true
      };
      
      const paymentService = new PaymentService(
        stubGateway,
        stubLogger,
        stubNotificationService
      );
      
      const result = await paymentService.processPayment(validPaymentDetails, customerEmail);
      
      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('stub-transaction-123');
    });
    
    it('should handle payment failure using stubs', async () => {
      const stubGateway: PaymentGateway = {
        processPayment: async () => ({ 
          success: false, 
          error: 'Insufficient funds' 
        }),
        refundPayment: async () => ({ success: true })
      };
      
      const stubLogger: Logger = {
        info: () => {},
        error: () => {}
      };
      
      const stubNotificationService: NotificationService = {
        sendPaymentConfirmation: async () => true,
        sendPaymentFailure: async () => true
      };
      
      const paymentService = new PaymentService(
        stubGateway,
        stubLogger,
        stubNotificationService
      );
      
      const result = await paymentService.processPayment(validPaymentDetails, customerEmail);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient funds');
    });
  });
  
  describe('Using Spies', () => {
    /**
     * SPIES:
     * - Wrap real objects or functions
     * - Track calls and arguments
     * - Don't change behavior (unless configured to)
     * - Used when you want to verify HOW something was called
     * - Good for verifying interactions with real implementations
     */
    
    it('should track calls to dependencies using spies', async () => {
      const gateway: PaymentGateway = {
        processPayment: async () => ({ 
          success: true, 
          transactionId: 'spy-transaction-123' 
        }),
        refundPayment: async () => ({ success: true })
      };
      
      const logger: Logger = {
        info: () => {},
        error: () => {}
      };
      
      const notificationService: NotificationService = {
        sendPaymentConfirmation: async () => true,
        sendPaymentFailure: async () => true
      };
      
      const processPaymentSpy = vi.spyOn(gateway, 'processPayment');
      const loggerInfoSpy = vi.spyOn(logger, 'info');
      const sendConfirmationSpy = vi.spyOn(notificationService, 'sendPaymentConfirmation');
      
      const paymentService = new PaymentService(
        gateway,
        logger,
        notificationService
      );
      
      await paymentService.processPayment(validPaymentDetails, customerEmail);
      
      expect(processPaymentSpy).toHaveBeenCalledTimes(1);
      expect(processPaymentSpy).toHaveBeenCalledWith(validPaymentDetails);
      
      expect(loggerInfoSpy).toHaveBeenCalledTimes(2);
      expect(loggerInfoSpy).toHaveBeenCalledWith('Processing payment', { amount: 100 });
      expect(loggerInfoSpy).toHaveBeenCalledWith('Payment successful', { 
        amount: 100,
        transactionId: 'spy-transaction-123'
      });
      
      expect(sendConfirmationSpy).toHaveBeenCalledTimes(1);
      expect(sendConfirmationSpy).toHaveBeenCalledWith(
        customerEmail,
        100,
        'spy-transaction-123'
      );
    });
    
    it('should allow spies to modify return values', async () => {
      const gateway: PaymentGateway = {
        processPayment: async () => ({ 
          success: true, 
          transactionId: 'original-transaction-123' 
        }),
        refundPayment: async () => ({ success: true })
      };
      
      const logger: Logger = {
        info: () => {},
        error: () => {}
      };
      
      const notificationService: NotificationService = {
        sendPaymentConfirmation: async () => true,
        sendPaymentFailure: async () => true
      };
      
      const processPaymentSpy = vi.spyOn(gateway, 'processPayment');
      processPaymentSpy.mockResolvedValueOnce({
        success: false,
        error: 'Spy modified error'
      });
      
      const paymentService = new PaymentService(
        gateway,
        logger,
        notificationService
      );
      
      const result = await paymentService.processPayment(validPaymentDetails, customerEmail);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Spy modified error');
      expect(processPaymentSpy).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('Using Mocks', () => {
    /**
     * MOCKS:
     * - Completely replace real objects
     * - Have predefined expectations about calls
     * - Track calls, arguments, and can verify expectations
     * - Used when you need to verify complex interactions
     * - Combine aspects of both stubs and spies
     */
    
    let mockGateway: PaymentGateway;
    let mockLogger: Logger;
    let mockNotificationService: NotificationService;
    let paymentService: PaymentService;
    
    beforeEach(() => {
      mockGateway = {
        processPayment: vi.fn(),
        refundPayment: vi.fn()
      };
      
      mockLogger = {
        info: vi.fn(),
        error: vi.fn()
      };
      
      mockNotificationService = {
        sendPaymentConfirmation: vi.fn(),
        sendPaymentFailure: vi.fn()
      };
      
      paymentService = new PaymentService(
        mockGateway,
        mockLogger,
        mockNotificationService
      );
      
      (mockGateway.processPayment as any).mockResolvedValue({
        success: true,
        transactionId: 'mock-transaction-123'
      });
      
      (mockNotificationService.sendPaymentConfirmation as any).mockResolvedValue(true);
      (mockNotificationService.sendPaymentFailure as any).mockResolvedValue(true);
    });
    
    it('should verify the complete payment flow with mocks', async () => {
      const result = await paymentService.processPayment(validPaymentDetails, customerEmail);
      
      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('mock-transaction-123');
      
      expect(mockLogger.info).toHaveBeenCalledWith('Processing payment', { amount: 100 });
      expect(mockGateway.processPayment).toHaveBeenCalledWith(validPaymentDetails);
      expect(mockLogger.info).toHaveBeenCalledWith('Payment successful', { 
        amount: 100,
        transactionId: 'mock-transaction-123'
      });
      expect(mockNotificationService.sendPaymentConfirmation).toHaveBeenCalledWith(
        customerEmail,
        100,
        'mock-transaction-123'
      );
      
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockNotificationService.sendPaymentFailure).not.toHaveBeenCalled();
    });
    
    it('should handle validation errors with mocks', async () => {
      const invalidPaymentDetails: PaymentDetails = {
        ...validPaymentDetails,
        amount: -100 // Invalid amount
      };
      
      const result = await paymentService.processPayment(invalidPaymentDetails, customerEmail);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment amount must be greater than zero');
      
      expect(mockLogger.info).toHaveBeenCalledWith('Processing payment', { amount: -100 });
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Payment processing error',
        expect.any(Error),
        { amount: -100 }
      );
      expect(mockNotificationService.sendPaymentFailure).toHaveBeenCalledWith(
        customerEmail,
        -100,
        'Payment amount must be greater than zero'
      );
      
      expect(mockGateway.processPayment).not.toHaveBeenCalled();
      expect(mockNotificationService.sendPaymentConfirmation).not.toHaveBeenCalled();
    });
    
    it('should handle gateway errors with mocks', async () => {
      (mockGateway.processPayment as any).mockRejectedValueOnce(
        new Error('Network error')
      );
      
      const result = await paymentService.processPayment(validPaymentDetails, customerEmail);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Payment processing error',
        expect.any(Error),
        { amount: 100 }
      );
      expect(mockNotificationService.sendPaymentFailure).toHaveBeenCalledWith(
        customerEmail,
        100,
        'Network error'
      );
    });
  });
  
  describe('Comparing Test Doubles', () => {
    /**
     * This section demonstrates when to use each type of test double
     * and how they compare to each other
     */
    
    it('should demonstrate stub vs mock vs spy usage', async () => {
      const stubGateway: PaymentGateway = {
        processPayment: async () => ({ success: true, transactionId: 'stub-tx' }),
        refundPayment: async () => ({ success: true })
      };
      
      const mockLogger: Logger = {
        info: vi.fn(),
        error: vi.fn()
      };
      
      const realNotificationService: NotificationService = {
        sendPaymentConfirmation: async () => true,
        sendPaymentFailure: async () => true
      };
      const spyOnSendConfirmation = vi.spyOn(realNotificationService, 'sendPaymentConfirmation');
      
      const paymentService = new PaymentService(
        stubGateway,
        mockLogger as Logger,
        realNotificationService
      );
      
      await paymentService.processPayment(validPaymentDetails, customerEmail);
      
      expect(mockLogger.info).toHaveBeenCalledTimes(2);
      
      expect(spyOnSendConfirmation).toHaveBeenCalledTimes(1);
    });
  });
});
