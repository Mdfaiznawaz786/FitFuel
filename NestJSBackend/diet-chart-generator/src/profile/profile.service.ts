/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: SupabaseService) {}

  async updateProfile(profileData: any, userId: string) {
    try {
      // The form does not edit every column accepted by updateprofile. Preserve those values.
      const { data: current, error: lookupError } = await this.databaseService
        .getClient()
        .from('users')
        .select('name, email, phoneNumber, age, goal, gender, height, weight, bloodpressure, heartrate, bloodsugar, medicalconditions, medications, dietaryrestrictions, allergies, dietarypreferences, dateofbirth')
        .eq('id', userId)
        .single();

      if (lookupError || !current) {
        throw new Error(lookupError?.message || 'Profile not found');
      }

      // Extract medical conditions from conditions array
      const medicalConditions = Array.isArray(profileData.conditions)
        ? profileData.conditions.map((condition) => typeof condition === 'string' ? condition : JSON.stringify(condition))
        : current.medicalconditions;

      // Extract medication names from medications array
      const medications = Array.isArray(profileData.medications)
        ? profileData.medications.map((medication) => typeof medication === 'string' ? medication : JSON.stringify(medication))
        : current.medications;

      // The current form submits an array; accept the older checkbox object as well.
      const dietaryRestrictions = Array.isArray(profileData.dietaryRestrictions)
        ? profileData.dietaryRestrictions.filter((item) => typeof item === 'string')
        : profileData.dietaryRestrictions
        ? Object.entries(profileData.dietaryRestrictions)
            .filter(([key, value]) => value === true && key !== 'other')
            .map(([key]) => {
              switch (key) {
                case 'noSugar':
                  return 'No Sugar';
                case 'lowSodium':
                  return 'Low Sodium';
                case 'glutenFree':
                  return 'Gluten Free';
                case 'dairyFree':
                  return 'Dairy Free';
                case 'vegetarian':
                  return 'Vegetarian';
                case 'vegan':
                  return 'Vegan';
                default:
                  return key;
              }
            })
        : current.dietaryrestrictions;

      // Add "other" value if provided
      if (!Array.isArray(profileData.dietaryRestrictions) && profileData.dietaryRestrictions?.other) {
        if (dietaryRestrictions) {
          dietaryRestrictions.push(profileData.dietaryRestrictions.other);
        }
      }

      // Format date properly if it's a string
      let dateOfBirth = profileData.dateOfBirth ?? current.dateofbirth;
      if (dateOfBirth && typeof dateOfBirth === 'string') {
        dateOfBirth = dateOfBirth.split('T')[0]; // Extract YYYY-MM-DD part
      }

      const { data, error } = await this.databaseService
        .getClient()
        .rpc('updateprofile', {
          userid: userId,
          name: profileData.fullName ?? current.name,
          email: profileData.email ?? current.email,
          phoneNumber: profileData.phone ?? current.phoneNumber,
          age: profileData.age ?? current.age,
          goal: profileData.goal ?? current.goal,
          gender: profileData.gender ?? current.gender,
          height: profileData.height ?? current.height,
          weight: profileData.weight ?? current.weight,
          bloodpressure: profileData.bloodPressure ?? current.bloodpressure,
          heartrate: profileData.heartRate ?? current.heartrate,
          bloodsugar: profileData.bloodSugar ?? current.bloodsugar,
          medicalconditions: medicalConditions,
          medications: medications,
          dietaryrestrictions: dietaryRestrictions,
          allergies: profileData.allergies === undefined
            ? current.allergies
            : this.toTextArray(profileData.allergies),
          dietarypreferences: profileData.dietaryPreferences === undefined
            ? current.dietarypreferences
            : this.toTextArray(profileData.dietaryPreferences),
          dateofbirth: dateOfBirth,
        });

      if (error) {
        console.error('Profile update error:', error);
        throw new Error(`Error updating profile: ${error.message}`);
      }

      return {
        success: true,
        message: 'Profile updated successfully',
        data: data,
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  private toTextArray(value: unknown): string[] {
    const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
    return items.filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async getProfile(userId: string) {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw new Error(`Error fetching profile: ${error.message}`);
      }

      if (!data) {
        throw new Error(`No user found with ID: ${userId}`);
      }
      //return data;
      // Parse medical conditions from stringified JSON
      const parsedConditions = data.medicalconditions
        ? data.medicalconditions.map((condition) => {
            if (typeof condition === 'string') {
              try {
                return JSON.parse(condition);
              } catch (e) {
                console.error('Error parsing condition:', e);
                return {
                  name: condition,
                  diagnosed: null,
                  severity: null,
                  controlled: null,
                };
              }
            }
            return condition;
          })
        : [];

      // Parse medications from stringified JSON
      const parsedMedications = data.medications
        ? data.medications.map((medication) => {
            if (typeof medication === 'string') {
              try {
                return JSON.parse(medication);
              } catch (e) {
                console.error('Error parsing medication:', e);
                return {
                  name: medication,
                  dosage: null,
                  frequency: null,
                  startDate: null,
                };
              }
            }
            return medication;
          })
        : [];

      // Format the data according to the required structure
      const formattedData = {
        user: {
          name: data.name,
          age: data.age,
          gender: data.gender,
          email: data.email,
        },
        vitals: {
          height: data.height,
          weight: data.weight,
          bmi:
            data.height && data.weight
              ? Number((data.weight / (data.height / 100) ** 2).toFixed(1))
              : null,
          bloodPressure: data.bloodpressure,
          heartRate: data.heartrate,
          bloodSugar: data.bloodsugar,
        },
        conditions: parsedConditions,
        weightHistory: data.weightHistory || [],
        medications: parsedMedications,
        dietaryRestrictions: data.dietaryrestrictions || [],
        allergies: data.allergies || [],
        dietaryPreferences: data.dietarypreferences || [],
        dateOfBirth: data.dateofbirth || null,
      };

      return {
        success: true,
        message: 'Profile fetched successfully',
        data: formattedData,
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        message: 'Failed to fetch profile',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  async getWeightHistory(userId: string) {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .rpc('weighthistory', {
          userid: userId,
        });

      if (error) {
        console.error('Error fetching weight history:', error);
        throw new Error(`Error fetching weight history: ${error.message}`);
      }

      return {
        success: true,
        message: 'Weight history fetched successfully',
        data: data,
      };
    } catch (error) {
      console.error('Error fetching weight history:', error);
      return {
        success: false,
        message: 'Failed to fetch weight history',
        error: error.message || 'Unknown error occurred',
      };
    }
  }
}
