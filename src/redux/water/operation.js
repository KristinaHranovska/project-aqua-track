import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const addWater = createAsyncThunk(
  'water/addWater',
  async (newEntry, thunkAPI) => {
    try {
      const response = await axios.post('/water', newEntry);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateWaterAmount = createAsyncThunk(
  'water/updateWaterAmount',
  async ({ waterId, updatedAmount }, thunkAPI) => {
    console.log('Updating water amount for waterId:', waterId); 
    try {
      const response = await axios.patch(`/water/${waterId}/amount`, {
        amount: updatedAmount
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);