import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../app/shared/baseUrl';

const getAuthHeader = (token) => ({
    Authorization: 'Bearer ' + token
})

export const fetchPlaces = createAsyncThunk(
    'places/fetchPlaces',
    async (_, { getState, rejectWithValue }) => {
        const token = getState().user.token;
        const response = await fetch(baseUrl + 'places', {
            headers: getAuthHeader(token)
        });
        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Failed to fetch places');
        }
        return await response.json();
    }
);

export const fetchPlaceById = createAsyncThunk(
    'places/fetchPlaceById',
    async (placeId, { getState, rejectWithValue }) => {
        const token = getState().user.token;
        const response = await fetch(baseUrl + 'places/' + placeId, {
            headers: getAuthHeader(token)
        });
        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Failed to fetch place');
        }
        return await response.json();
    }
);

export const postPlace = createAsyncThunk(
    'places/postPlace',
    async (formData, { getState, rejectWithValue }) => {
        const token = getState().user.token;
        const response = await fetch(baseUrl + 'places', {
            method: 'POST',
            headers: getAuthHeader(token),
            body: formData
        });
        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Failed to create place');
        }
        return await response.json();
    }
);

export const patchFavorite = createAsyncThunk(
    'places/patchFavorite',
    async ({ placeId, favorite }, { getState, rejectWithValue }) => {
        const token = getState().user.token;
        const response = await fetch(baseUrl + 'places/' + placeId, {
            method: 'PATCH',
            headers: {
                ...getAuthHeader(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ favorite })
        });
        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Failed to update favorite');
        }
        return await response.json();
    }
);

export const deletePlace = createAsyncThunk(
    'places/deletePlace',
    async (placeId, { getState, rejectWithValue }) => {
        const token = getState().user.token;
        const response = await fetch(baseUrl + 'places/' + placeId, {
            method: 'DELETE',
            headers: getAuthHeader(token)
        });
        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Failed to delete place');
        }
        return placeId;
    }
);

export const postNote = createAsyncThunk(
    'places/postNote',
    async ({ placeId, noteData }, { getState, rejectWithValue }) => {
        const token = getState().user.token;
        const response = await fetch(baseUrl + 'places/' + placeId + '/notes', {
            method: 'POST',
            headers: {
                ...getAuthHeader(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });
        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Failed to create note');
        }
        const updated = await response.json();
        return { placeId, notes: updated.notes };
    }
);

export const patchNote = createAsyncThunk(
    'places/patchNote',
    async ({ placeId, noteId, text }, { getState, rejectWithValue }) => {
        const token = getState().user.token;
        const response = await fetch(
            baseUrl + 'places/' + placeId + '/notes/' + noteId,
            {
                method: 'PATCH',
                headers: {
                    ...getAuthHeader(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            }
        );
        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Failed to update note');
        }
        const updated = await response.json();
        return { placeId, notes: updated.notes }
    }
);

export const deleteNote = createAsyncThunk(
    'places/deleteNote',
    async ({ placeId, noteId }, { getState, rejectWithValue }) => {
        const token = getState().user.token;
        const response = await fetch(
            baseUrl + 'places/' + placeId + '/notes/' + noteId,
            {
                method: 'DELETE',
                headers: getAuthHeader(token)
            }
        );
        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Failed to delete note');
        }
        return { placeId, noteId }
    }
);

export const deleteAllNotes = createAsyncThunk(
    'places/deleteAllNotes',
    async (placeId, { getState, rejectWithValue }) => {
        const token = getState().user.token;
        const response = await fetch(
            baseUrl + 'places/' + placeId + '/notes',
            {
                method: 'DELETE',
                headers: getAuthHeader(token)
            }
        );
        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Failed to delete notes');
        }
        return placeId;
    }
);



const initialState = {
    items: [],
    selectedPlaceId: null,
    filters: {
        favoritesOnly: false,
        placeType: null
    },
    loading: false,
    error: null
};

const placesSlice = createSlice({
    name: 'places',
    initialState,
    reducers: {
        setSelectedPlace: (state, action) => {
            state.selectedPlaceId = action.payload;
        },
        clearSelectedPlace: (state) => {
            state.selectedPlaceId = null;
        },
        setFilterFavoritesOnly: (state, action) => {
            state.filters.favoritesOnly = action.payload;
        },
        setFilterPlaceType: (state, action) => {
            state.filters.placeType = action.payload;
        },
        clearFilters: (state) => {
            state.filters.favoritesOnly = false;
            state.filters.placeType = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlaces.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPlaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // .addCase(fetchPlaceById.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            .addCase(fetchPlaceById.fulfilled, (state, action) => {
                const index = state.items.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload)
                }
            })
            .addCase(fetchPlaceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(postPlace.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postPlace.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(postPlace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(patchFavorite.pending, (state, action) => {
                state.loading = true,
                state.error = null
            })
            .addCase(patchFavorite.fulfilled, (state, action) => {
                const index = state.items.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index].favorite = action.payload.favorite;
                }
            })
            .addCase(patchFavorite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(deletePlace.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(deletePlace.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p.id !== action.payload);
            })
            .addCase(deletePlace.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            })
            .addCase(postNote.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postNote.fulfilled, (state, action) => {
                const place = state.items.find(p => p.id === action.payload.placeId);
                if (place) place.notes = action.payload.notes
            })
            .addCase(postNote.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            })
            .addCase(patchNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(patchNote.fulfilled, (state, action) => {
                const place = state.items.find(p => p.id === action.payload.placeId);
                if (place) place.notes = action.payload.notes
            })
            .addCase(patchNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(deleteNote.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                const place = state.items.find(p => p.id === action.payload.placeId);
                if (place) {
                    place.notes = place.notes.filter(n => n.id !== action.payload.noteId);
                }
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(deleteAllNotes.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(deleteAllNotes.fulfilled, (state, action) => {
                const place = state.items.find(p => p.id === action.payload);
                if (place) place.notes = [];
            })
            .addCase(deleteAllNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            }) 
    }
});

export const placesReducer = placesSlice.reducer;
export const {
    setSelectedPlace,
    clearSelectedPlace,
    setFilterFavoritesOnly,
    setFilterPlaceType,
    clearFilters
} = placesSlice.actions;

export const selectAllPlaces = (state) => state.places.items;
export const selectPlacesLoading = (state) => state.places.loading;
export const selectPlacesError = (state) => state.places.error;
export const selectSelectedPlaceId = (state) => state.places.selectedPlaceId;
export const selectFilters = (state) => state.places.filters;

export const selectPlaceById = (id) => (state) => 
    state.places.items.find(p => p.id === id);

export const selectPlacesByType = (type) => (state) => 
    state.places.items.filter(p => p.kindOfPlace === type);

export const selectFavoritePlaces = (state) => 
    state.places.items.filter(p => p.favorite);

export const selectFavoritePlacesByType = (type) => (state) => 
    state.places.items.filter(p => p.kindOfPlace === type && p.favorite);

export const selectNotesByPlaceId = (placeId) => (state) => {
    const place = state.places.items.find(p => p.id === placeId);
    return place ? place.notes : [];
}