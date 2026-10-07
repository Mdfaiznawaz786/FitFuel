/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';

@Injectable()
export class UserSpecificationService {
  private readonly logger = new Logger(UserSpecificationService.name);

  constructor(private readonly databaseService: SupabaseService) {}

  async createUserSpecification(diet: string, body: any) {
    try {
      //console.log(body.profile)
      // Validate required fields
      const requiredFields = [
        'height',
        'weight',
        'goal',
        'gender',
        'activityLevel',
      ];
      for (const field of requiredFields) {
        if (body[field] === undefined) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: `Missing required field: ${field}`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const {
        height,
        weight,
        goal,
        gender,
        activityLevel,
        age,
        diseases,
        otherDisease,
      } = body;

      const supabase = this.databaseService.getClient();

      const { data, error } = await supabase
        .from('User Specifications')
        .insert([
          {
            height,
            weight,
            goal,
            gender,
            activityLevel,
            age,
            diseases,
            otherDisease,
            diet,
          },
        ])
        .select();

      if (error) {
        this.logger.error(
          `Database error creating user specification: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to create user specification: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User specification created successfully',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error creating user specification: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserSpecificationByDietId(dietId: string) {
    try {
      const supabase = this.databaseService.getClient();
      const { data, error } = await supabase
        .from('User Specifications')
        .select('*')
        .eq('diet', dietId)
        .single();

      if (error) {
        this.logger.error(
          `Database error fetching user specification: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to fetch user specification: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User specification not found',
          data: null,
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User specification retrieved successfully',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error fetching user specification: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserSpecification(dietId: string, body: any) {
    try {
      const supabase = this.databaseService.getClient();
      const { height, weight, goal, gender, activityLevel, age, diseases, otherDisease } = body;
      const changes = { height, weight, goal, gender, activityLevel, age, diseases, otherDisease };
      const { data, error } = await supabase
        .from('User Specifications')
        .update(changes)
        .eq('diet', dietId)
        .select();

      if (error) {
        this.logger.error(
          `Database error updating user specification: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to update user specification: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data || data.length === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User specification not found',
          data: null,
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User specification updated successfully',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error updating user specification: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUserSpecification(dietId: string) {
    try {
      const supabase = this.databaseService.getClient();
      const { data, error } = await supabase
        .from('User Specifications')
        .delete()
        .eq('diet', dietId)
        .select();

      if (error) {
        this.logger.error(
          `Database error deleting user specification: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to delete user specification: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data || data.length === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User specification not found',
          data: null,
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User specification deleted successfully',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error deleting user specification: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
