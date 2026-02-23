import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { HIKINGTRAILS } from '../../app/shared/HIKINGTRAILS';
import { baseUrl } from '../../app/shared/baseUrl';
import { mapImageURL } from '../../utils/mapImageURL';

export const fetchHikes = createAsyncThunk(
    'hikes/fetchHikes',
    async () => {
        const response = await fetch(baseUrl + 'hikes');
        if (!response.ok) {
            return Promise.reject('Unabe to fetch, status: ' + response.status);
        }
        return await response.json()

    }
);

export const postHike = createAsyncThunk(
    'hikes/postHike',
    async (hike) => {
        const response = await fetch(baseUrl + 'hikes', {
            method: 'POST',
            body: JSON.stringify(hike),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            return Promise.reject('Unable to post: status: ' + response.status)
        }
        return await response.json()
    }
);

export const deleteHike = createAsyncThunk(
    'hikes/deleteHike',
    async (id) => {
        const response = await fetch(baseUrl + 'hikes/' + id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            return Promise.reject('Unable to delete, status: ' + response.status);
        }
        return id;
    }
);

export const patchFavHike = createAsyncThunk(
    'hikes/patchFavHike',
    async (hike, { dispatch }) => {
        const response = await fetch(baseUrl + 'hikes/' + hike.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favorite: !hike.favorite })
        });
        if (!response.ok) {
            return Promise.reject('Unable to patch, status: ' + response.status);
        }
        const data = await response.json();
        dispatch(toggleFavoriteHike(data.id));
        return data;
    }
)

const initialState = {
    hikesArray: [],
    isLoading: true,
    errMsg: ''
}

const hikesSlice = createSlice({
    name: 'hikes',
    initialState,
    reducers: {
        toggleFavoriteHike: (state, action) => {
            const hike = state.hikesArray.find(
                (hike) => hike.id === action.payload
            );
            if (hike) {
                hike.favorite = !hike.favorite
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHikes.pending, (state) => {
                state.isLoading = true;
                state.errMsg = '';
            })
            .addCase(fetchHikes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errMsg = '';
                state.hikesArray = mapImageURL(action.payload);
            })
            .addCase(fetchHikes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error ? action.error.message : 'Fetch failed'
            })
            .addCase(postHike.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errMsg = '';
                state.hikesArray.push(action.payload)
            })
            .addCase(postHike.rejected, (state, action) => {
                alert(
                    'Your hike could not be posted\nError: ' +
                    (action.error ? action.error.message : 'POST failed')
                )
            })
            .addCase(deleteHike.fulfilled, (state, action) => {
                state.hikesArray = state.hikesArray.filter(
                    (hike) => hike.id !== action.payload
                )
            })
            .addCase(deleteHike.rejected, (state, action) => {
                alert(
                    'Your hike could not be deleted\nError: ' +
                    (action.error ? action.error.message : 'DELETE failed')
                )
            })
            .addCase(patchFavHike.rejected, (state, action) => {
                alert(
                    'Your hike could not be favorited\nError: ' +
                    (action.error ? action.error.message : 'PATCH failed')
                )
            })
    }
});

export const hikesReducer = hikesSlice.reducer;

export const { toggleFavoriteHike } = hikesSlice.actions;

export const selectAllHikes = (state) => {
    return state.hikes.hikesArray.toReversed();
};

export const selectHikeById = (id) => (state) => {
    return state.hikes.hikesArray.find(
        (hike) => hike.id === parseInt(id)
    );
};

export const featuredHike = (state) => {
    return state.hikes.hikesArray.find((hike) => hike.featured);
};

export const selectFavoriteHikes = (state) => {
    return state.hikes.hikesArray.filter((hike) => hike.favorite).toReversed()
}

export const selectRandomHike = (state) => {
    return state.hikes.hikesArray[
        Math.floor(Math.random() * state.hikes.hikesArray.length)
    ]
}