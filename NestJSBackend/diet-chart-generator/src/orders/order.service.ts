/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';

@Injectable()
export class OrderService {
  constructor(private readonly databaservice: SupabaseService) {}

  async getOrderConfirmation(orderId: string): Promise<any> {
    try {
      // Fetch order details from the database using the order ID
      const { data: cartData, error } = await this.databaservice
        .getClient()
        .from('cart')
        .select('*')
        .eq('id', orderId)
        .single();

      console.log('Cart Data:', cartData);

      if (error) {
        throw new Error(`Error fetching order: ${error.message}`);
      }

      // Check if we need to auto-update the order status based on dates
      if (cartData.endDate) {
        const currentDate = new Date();
        const endDate = new Date(cartData.endDate);

        console.log('Current date:', currentDate);
        console.log('End date:', endDate);

        // Only update to "Delivered" if:
        // 1. Current date is after end date
        // 2. Order is not already in "Cancelled" state
        // 3. Order is not already in "Delivered" state
        if (
          currentDate > endDate &&
          cartData.status !== 'Cancelled' &&
          cartData.status !== 'Delivered'
        ) {
          console.log(
            'Order end date has passed. Auto-updating status to Delivered',
          );

          // Update the order status to Delivered
          const { error: updateError } = await this.databaservice
            .getClient()
            .from('cart')
            .update({ status: 'Delivered' })
            .eq('id', orderId);

          if (updateError) {
            console.error('Error updating order status:', updateError);
          } else {
            // Update the cartData with the new status for the response
            cartData.status = 'Delivered';
          }
        }
      }

      const { data: deliveryData, error: deliveryError } =
        await this.databaservice
          .getClient()
          .from('deliveryDetails')
          .select('*')
          .eq('id', cartData.deliveryId)
          .single();

      const { data: transactionData, error: transactionError } =
        await this.databaservice
          .getClient()
          .from('transactions')
          .select('*')
          .eq('id', cartData.transactionId)
          .single();

      if (deliveryError) {
        throw new Error(
          `Error fetching delivery details: ${deliveryError.message}`,
        );
      }

      if (transactionError) {
        throw new Error(
          `Error fetching transaction details: ${transactionError.message}`,
        );
      }

      const responseData = {
        cartData: cartData,
        deliveryData: deliveryData,
        transactionData: transactionData,
      };

      return {
        success: true,
        message: 'Order fetched successfully',
        data: responseData,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        message: 'Failed to fetch order',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  async getOrderHistory(userId: string): Promise<any> {
    try {
      const { data, error } = await this.databaservice
        .getClient()
        .rpc('diethistorytabledata', {
          userid: userId,
        });
      console.log('Data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      return {
        success: false,
        message: 'Failed to fetch order history',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      // Update order status in the database
      const { data, error } = await this.databaservice
        .getClient()
        .from('cart')
        .update({ status })
        .eq('id', orderId);
      if (error) {
        throw new Error(`Error updating order status: ${error.message}`);
      }
      return {
        success: true,
        message: 'Order status updated successfully',
        data: data,
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        message: 'Failed to update order status',
        error: error.message || 'Unknown error occurred',
      };
    }
  }
}
