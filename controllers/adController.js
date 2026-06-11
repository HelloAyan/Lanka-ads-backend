import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const createAd = createAsyncThunk(
    "ads/createAd",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/ads", formData);

            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create ad"
            );
        }
    }
);

export const getMyAds = createAsyncThunk(
    "ads/getMyAds",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/ads/my-ads");

            return res.data.ads;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to get ads"
            );
        }
    }
);

export const deleteAd = createAsyncThunk(
    "ads/deleteAd",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/ads/${id}`);

            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to delete ad"
            );
        }
    }
);

const adSlice = createSlice({
    name: "ads",
    initialState: {
        ads: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAdError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAd.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload?.ad) {
                    state.ads.unshift(action.payload.ad);
                }
            })
            .addCase(createAd.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getMyAds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyAds.fulfilled, (state, action) => {
                state.loading = false;
                state.ads = action.payload || [];
            })
            .addCase(getMyAds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteAd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAd.fulfilled, (state, action) => {
                state.loading = false;
                state.ads = state.ads.filter(
                    (ad) => ad._id !== action.payload
                );
            })
            .addCase(deleteAd.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAdError } = adSlice.actions;

export default adSlice.reducer;