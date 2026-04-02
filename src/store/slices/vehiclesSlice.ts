import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '@/domain/entities/vehicle';

interface VehiclesState {
  results: Vehicle[];
  selectedVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
}

const initialState: VehiclesState = {
  results: [],
  selectedVehicle: null,
  loading: false,
  error: null,
};

export const fetchVehiclesThunk = createAsyncThunk<
  Vehicle[],
  void,
  { rejectValue: string }
>(
  'vehicles/fetchVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/vehicles');

      if (!response.ok) {
        throw new Error('Unable to fetch vehicles');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('An error occurred while fetching vehicles');
    }
  }
);

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    selectVehicle(state, action: PayloadAction<Vehicle>) {
      state.selectedVehicle = action.payload;
    },
    setResults(state, action: PayloadAction<Vehicle[]>) {
      state.results = action.payload;
    },
    clearSelectedVehicle(state) {
      state.selectedVehicle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehiclesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehiclesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchVehiclesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { selectVehicle, setResults, clearSelectedVehicle } = vehiclesSlice.actions;

export default vehiclesSlice.reducer;