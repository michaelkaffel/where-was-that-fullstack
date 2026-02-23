import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { SCENICOVERLOOKS } from "../../app/shared/SCENICOVERLOOKS";
import { baseUrl } from "../../app/shared/baseUrl";
import { mapImageURL } from "../../utils/mapImageURL";

export const fetchOverlooks = createAsyncThunk(
    'overlooks/fetchOverlooks',
    async () => {
        const response = await fetch (baseUrl + 'overlooks');
        if (!response.ok) {
            return Promise.reject('Unable to fetch, status: ' + response.status);
        }
        return await response.json()
    }
);

export const postOverlook = createAsyncThunk(
    'overlooks/postOverlook',
    async (overlook) => {
        const response = await fetch(baseUrl + 'overlooks', {
            method: 'POST',
            body: JSON.stringify(overlook),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            return Promise.reject('Unable to post, status: ' + response.status)
        }
        return await response.json()
    }
);

export const deleteOverlook = createAsyncThunk(
    'overlooks/deleteOverlook',
    async (id) => {
        const response = await fetch(baseUrl + 'overlooks/' + id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            return Promise.reject('Unable to delete, status: ' + response.status)
        }
        return id;
    }
);

export const patchFavOverlook = createAsyncThunk(
    'overlooks/patchFavOverlook',
    async (overlook, {dispatch }) => {
        const response = await fetch(baseUrl + 'overlooks/' + overlook.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favorite: !overlook.favorite })
        });
        if (!response.ok) {
            return Promise.reject('Unable to patch, status: ' + response.status)
        }
        const data = await response.json()
        dispatch(toggleFavoriteOverlook(data.id))
        return data;
    }
)

const initialState = {
    overlooksArray: [],
    isLoading: true,
    errMsg: ''
};

const overlooksSlice = createSlice({
    name: 'overlooks',
    initialState,
    reducers: {
        toggleFavoriteOverlook: (state, action) => {
            const overlook = state.overlooksArray.find(
                (overlook) => overlook.id === action.payload
            );
            if (overlook) {
                overlook.favorite = !overlook.favorite
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOverlooks.pending, (state) => {
                state.isLoading = true;
                state.errMsg = '';
            })
            .addCase(fetchOverlooks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errMsg = '';
                state.overlooksArray = mapImageURL(action.payload)
            })
            .addCase(fetchOverlooks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error ? action.error.message : 'Fetch failed'
            })
            .addCase(postOverlook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errMsg = '';
                state.overlooksArray.push(action.payload)
            })
            .addCase(postOverlook.rejected, (state, action) => {
                alert(
                    'Your overlook could not be posted\nError: ' +
                    (action.error ? action.error.message : 'POST failed')
                )
            })
            .addCase(deleteOverlook.fulfilled, (state, action) => {
                state.overlooksArray = state.overlooksArray.filter(
                    (overlook) => overlook.id !== action.payload
                )
            })
            .addCase(deleteOverlook.rejected, (state, action) => {
                alert(
                    'Your overlook could not be deleted\nError: ' +
                    (action.error ? action.error.message : 'DELETE failed')
                )
            })
            .addCase(patchFavOverlook.rejected, (state, action) => {
                alert(
                    'Your overlook could not be favorited\nError: ' +
                    (action.error ? action.error.message : 'PATCH failed')
                )
            })
    }
});

export const overlooksReducer = overlooksSlice.reducer;

export const { toggleFavoriteOverlook } = overlooksSlice.actions;

export const selectAllOverlooks = (state) => {
    return state.overlooks.overlooksArray.toReversed();
};

export const selectOverlooksById = (id) => (state) => {
    return state.overlooks.overlooksArray.find(
        (overlook) => overlook.id === parseInt(id)
    );
};

export const featuredOverlook = (state) => {
    return state.overlooks.overlooksArray.find((overlook) => overlook.featured);
};

export const selectOverlooksByName = (title) => (state) => {
    return state.overlooks.overlooksArray.find(
        (overlook) => overlook.title === title
    )
};

export const selectFavoriteOverlooks = (state) => {
    return state.overlooks.overlooksArray.filter(
        (overlook) => overlook.favorite
    ).toReversed()
}

export const selectRandomOverlook = (state) => {
    return state.overlooks.overlooksArray[
        Math.floor(Math.random() * state.overlooks.overlooksArray.length)
    ]
};
