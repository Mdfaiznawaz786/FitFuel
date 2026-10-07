/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';

@Injectable()
export class CartService {
  constructor(private readonly databaservice: SupabaseService) {}

  async createOrder(orderData: any): Promise<any> {
    try {
      // Extract data from the orderData
      const transactionData = orderData.orderSummary;

      const deliveryDetails = orderData.customerDetails;

      // Step 1: Create transaction
      const transactionResult = await this.createTransaction(transactionData);
      if (!transactionResult.success) {
        return transactionResult; // Return error response
      }

      // Step 2: Create delivery entry
      const deliveryResult = await this.createDelivery(deliveryDetails);
      if (!deliveryResult.success) {
        return deliveryResult; // Return error response
      }

      // Step 3: Create cart entry
      const cartData = orderData.items;
      cartData.transactionId = transactionResult.id;
      cartData.deliveryId = deliveryResult.id;

      const cartResult = await this.createCartEntry(cartData);
      if (!cartResult.success) {
        return cartResult; // Return error response
      }

      // Return success with all IDs
      return {
        success: true,
        message: 'Order created successfully',
        data: {
          transactionId: transactionResult.id,
          deliveryId: deliveryResult.id,
          cartId: cartResult.id,
        },
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  /**
   * Creates a transaction record in the database
   */
  private async createTransaction(transactionData: any): Promise<any> {
    try {
      const { data: transaction, error } = await this.databaservice
        .getClient()
        .from('transactions')
        .insert([transactionData])
        .select('id');

      if (error) {
        console.error('Transaction insert error:', error);
        return {
          success: false,
          message: 'Failed to create transaction record',
          error: error.message,
        };
      }

      if (!transaction || transaction.length === 0) {
        return {
          success: false,
          message: 'Transaction data is null or empty',
        };
      }

      return {
        success: true,
        id: transaction[0].id,
      };
    } catch (error) {
      console.error('Error in createTransaction:', error);
      return {
        success: false,
        message: 'Failed to create transaction',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  /**
   * Creates a delivery record in the database
   */
  private async createDelivery(deliveryDetails: any): Promise<any> {
    try {
      const { data: delivery, error } = await this.databaservice
        .getClient()
        .from('deliveryDetails')
        .insert([deliveryDetails])
        .select('id');

      if (error) {
        console.error('Delivery insert error:', error);
        return {
          success: false,
          message: 'Failed to create delivery record',
          error: error.message,
        };
      }

      if (!delivery || delivery.length === 0) {
        return {
          success: false,
          message: 'Delivery data is null or empty',
        };
      }

      return {
        success: true,
        id: delivery[0].id,
      };
    } catch (error) {
      console.error('Error in createDelivery:', error);
      return {
        success: false,
        message: 'Failed to create delivery record',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  /**
   * Creates a cart entry in the database
   */
  private async createCartEntry(cartData: any): Promise<any> {
    try {
      const { data: cart, error } = await this.databaservice
        .getClient()
        .from('cart')
        .insert([cartData])
        .select('id');

      if (error) {
        console.error('Cart insert error:', error);
        return {
          success: false,
          message: 'Failed to create cart record',
          error: error.message,
        };
      }

      if (!cart || cart.length === 0) {
        return {
          success: false,
          message: 'Cart data is null or empty',
        };
      }

      return {
        success: true,
        id: cart[0].id,
      };
    } catch (error) {
      console.error('Error in createCartEntry:', error);
      return {
        success: false,
        message: 'Failed to create cart record',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  async getUpcomingDeliveries(userId: string): Promise<any> {
    try {
      const { data, error } = await this.databaservice
        .getClient()
        .rpc('upcomingdeliveries', {
          userid: userId,
        });
      if (!data) {
        return {
          success: false,
          message: 'No upcoming deliveries found',
        };
      }

      if (error) {
        console.error('Error fetching upcoming deliveries:', error);
        return {
          success: false,
          message: 'Failed to fetch upcoming deliveries',
          error: error.message,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Error in getUpcomingDeliveries:', error);
      return {
        success: false,
        message: 'Failed to fetch upcoming deliveries',
        error: error.message || 'Unknown error occurred',
      };
    }
  }
}
