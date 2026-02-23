import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { HIKESCOMMENTS } from '../../app/shared/HIKESCOMMENTS';
import { baseUrl } from '../../app/shared/baseUrl';

export const fetchHikeComments = createAsyncThunk(
    'hikescomments/fetchHikeComments',
    async () => {
        const response = await fetch(baseUrl + 'hikescomments');
        if (!response.ok) {
            return Promise.reject('Unable to fetch, status: ' + response.status)
        }
        return await response.json()
    }
);

export const postHikeComment = createAsyncThunk(
    'hikescomments/postHikeComments',
    async (comment) => {
        const response = await fetch(baseUrl + 'hikescomments', {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            return Promise.reject('Unable to post, status: ' + response.status)
        }
        return await response.json();
    }
);

export const deleteHikeComment = createAsyncThunk(
    'hikescomments/deleteHikeComment',
    async (id) => {
        const response = await fetch(baseUrl + 'hikescomments/' + id, {
            method: 'DELETE',
        });
        if (!response.ok) {
            return Promise.reject('Unable to delete, status: ' + response.status)
        }
        return id;
    }
)

export const deleteAllHikesComments = createAsyncThunk(
    'hikescomments/deleteAllHikesComments',
    async (campsiteId) => {
        const response = await fetch(baseUrl + 'hikescomments/' + campsiteId, {
            method: 'DELETE'
        });
        if (!response.ok) {
            return Promise.reject('Unable to delete, status: ' + response.status);
        }
        return campsiteId
    }
)


const initialState = {
    hikesCommentsArray: [],
    isLoading: true,
    errMsg: ''
};

const hikesCommentsSlice = createSlice({
    name: 'hikescomments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHikeComments.pending, (state) => {
                state.isLoading = true;
                state.errMsg = ''
            })
            .addCase(fetchHikeComments.fulfilled, (state,action) => {
                state.isLoading = true;
                state.errMsg = '';
                state.hikesCommentsArray = action.payload;
            })
            .addCase(fetchHikeComments.rejected, (state, action) => {
                state.isLoading = true;
                state.errMsg = action.error ? action.error.message : 'Fetch failed'
            })
            .addCase(postHikeComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errMsg = '';
                state.hikesCommentsArray.push(action.payload);
            })
            .addCase(postHikeComment, (state, action) => {
                state.isLoading = false;
                alert(
                    'Your comment could not be posted\nError: ' +
                    (action.error ? action.error.message : 'POST failed')
                )
            })
            .addCase(deleteHikeComment.fulfilled, (state, action) => {
                state.hikesCommentsArray = state.hikesCommentsArray.filter(
                    (overlook) => overlook.id !== action.payload
                )
            })
            .addCase(deleteHikeComment.rejected, (state, action) => {
                state.isLoading = false;
                alert(
                    'Your comment could not be deleted\nError: ' +
                    (action.error ? action.error.message : 'DELETE failed')
                )
            })
            .addCase(deleteAllHikesComments.fulfilled, (state, action) => {
                state.hikesCommentsArray = state.hikesCommentsArray.filter(
                    (comment) => comment.campsiteId !== action.payload
                )
            })
    }
});

export const hikesCommentsReducer = hikesCommentsSlice.reducer;

export const selectHikesCommentsByHikesId = (hikeId) => (state) => {
    return state.hikescomments.hikesCommentsArray.filter(
        (comment) => comment.hikeId === parseInt(hikeId)
    )
};