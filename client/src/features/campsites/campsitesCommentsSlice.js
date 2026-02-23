import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { CAMPSITESCOMMENTS } from '../../app/shared/CAMPSITESCOMMENTS';
import { baseUrl } from '../../app/shared/baseUrl';

export const fetchCampsiteComments = createAsyncThunk(
    'campsitescomments/fetchCampsiteComments',
    async () => {
        const response = await fetch (baseUrl + 'campsitescomments');
        if (!response.ok) {
            return Promise.reject('Unable to fetch, status: ' + response.status);
        }
        return await response.json();
    }
);

export const postCampsiteComment = createAsyncThunk(
    'campsitescomments/postCampsiteComment',
    async (comment) => {
        const response = await fetch(baseUrl + 'campsitescomments', {
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

export const deleteCampsiteComment = createAsyncThunk(
    'campsitescomments/deleteCampsiteComment',
    async (id) => {
        const response = await fetch(baseUrl + 'campsitescomments/' + id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            return Promise.reject('Unable to delete comment, status: ' + response.status)
        }
        return id;
    }
)

export const deleteAllCampsitesComments = createAsyncThunk(
    'campsitescomments/deleteAllCampsitesComments',
    async (campsiteId) => {
        const response = await fetch(baseUrl + 'campsitescomments/' + campsiteId, {
            method: 'DELETE'
        });
        if (!response.ok) {
            return Promise.reject('Unable to delete comments, status: ' + response.status)
        }
        return campsiteId;
    }
)

const initialState = {
    campsitesCommentsArray: [],
    isLoading: true,
    errMsg: '',
};

const campsitesCommentsSlice = createSlice({
    name: 'campsitescomments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCampsiteComments.pending, (state) => {
                state.isLoading = true;
                state.errMsg = '';
            })
            .addCase(fetchCampsiteComments.fulfilled, (state, action) => {
                state.isLoading = true;
                state.errMsg = '';
                state.campsitesCommentsArray = action.payload;
            })
            .addCase(fetchCampsiteComments, (state, action) => {
                state.isLoading = true;
                state.errMsg = action.error ? action.error.message : 'Fetch failed'
            })
            .addCase(postCampsiteComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errMsg = '';
                state.campsitesCommentsArray.push(action.payload)
            })
            .addCase(postCampsiteComment.rejected, (state, action) => {
                state.isLoading = false;
                alert(
                    'Your comment could not be posted\nError: ' +
                    (action.error ? action.error.message : 'POST failed')
                );
            })
            .addCase(deleteCampsiteComment.fulfilled, (state, action) => {
                state.campsitesCommentsArray = state.campsitesCommentsArray.filter(
                    (comment) => comment.id !== action.payload
                );
            })
            .addCase(deleteCampsiteComment.rejected, (state, action) => {
                state.isLoading = false;
                alert(
                    'Your comment could not be deleted\nError: ' +
                    (action.error ? action.error.message : 'DELETE failed')
                );
            })
            .addCase(deleteAllCampsitesComments.fulfilled, (state, action) => {
                state.campsitesCommentsArray = state.campsitesCommentsArray.filter(
                    (comment) => comment.campsiteId !== action.payload
                );
            })
    }
});

export const campsitesCommentsReducer = campsitesCommentsSlice.reducer;

export const { addCampComment } = campsitesCommentsSlice.actions;

export const selectCampsitesCommentsbyCampsiteId = (campsiteId) => (state) => {
    return state.campsitescomments.campsitesCommentsArray.filter(
        (comment) => comment.campsiteId === parseInt(campsiteId)
    )
};