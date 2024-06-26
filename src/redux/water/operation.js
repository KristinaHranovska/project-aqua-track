import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
  requestAddWater,
  requestUpdateWater,
  requestDeleteWater,
  requestGetWaterDay,
  requestGetWaterMonth,
  requestGetWaterStats,
} from './services';

export const apiDeleteWater = createAsyncThunk(
  'water/deleteWater',
  async (recordId, thunkAPI) => {
    try {
      const response = await requestDeleteWater(recordId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const apiGetWaterDay = createAsyncThunk(
  'water/getWaterDay',
  async (day, thunkAPI) => {
    try {
      const response = await requestGetWaterDay(day);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const apiGetWaterMonth = createAsyncThunk(
  'water/getWaterMonth',
  async (date, thunkAPI) => {
    try {
      const response = await requestGetWaterMonth(date);
      return response.daysInMonth;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const apiGetWaterStats = createAsyncThunk(
  'water/getWaterStats',
  async (_, thunkAPI) => {
    try {
      const response = await requestGetWaterStats();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addWater = createAsyncThunk(
  'water/addWater',
  async (newEntry, thunkAPI) => {
    try {
      const response = await requestAddWater(newEntry);
      toast.success(response.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateWaterAmount = createAsyncThunk(
  'water/updateWaterAmount',
  async (newEntry, thunkAPI) => {
    try {
      const response = await requestUpdateWater(newEntry);
      console.log(response);
      toast.success(response.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
