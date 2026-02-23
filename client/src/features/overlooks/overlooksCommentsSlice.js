import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { OVERLOOKSCOMMENTS } from '../../app/shared/OVERLOOKSCOMMENTS';
import { baseUrl } from '../../app/shared/baseUrl';

export const fetchOverlookComments = createAsyncThunk(
    'overlookscomments/fetchOverlookComments',
    async () => {
        const response = await fetch(baseUrl + 'overlookscomments');
        if (!response.ok) {
            return Promise.reject('Unable to fetch, status: ' + response.status)
        }
        return await response.json()
    }
)

export const postOverlookComment = createAsyncThunk(
    'overlookscomments/postOverlookComment',
    async (comment) => {
        const response = await fetch (baseUrl + 'overlookscomments', {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            return Promise.reject('Unable to post, status: ', response.status);
        }
        return await response.json();
    }
);

export const deleteOverlookComment = createAsyncThunk(
    'overlookscomments/deleteOverlookComment',
    async (id) => {
        const response = await fetch(baseUrl + 'overlookscomments/' + id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            return Promise.reject('Unable to delete, status: ', response.status);
        }
        return id
    }
);

export const deleteAllOverlooksComments = createAsyncThunk(
    'overlookscomments/deleteAllOverlooksComments',
    async (campsiteId) => {
        const response = await fetch(baseUrl + 'overlookscomments/ + overlookId', {
            method: 'DELETE'
        });
        if (!response.ok) {
            return Promise.reject('Unable to delete comments')
        }
        return campsiteId;  
    }
)


const initialState = {
    overlooksCommentsArray: [],
    isLoading: true,
    errMsg: ''
};

const overlooksCommentsSlice = createSlice({
    name: 'overlookscomments',
    initialState,
    reducers: {
        addOverlookComment: (state, action) => {
            const newOverlookComment = {
                id: state.overlooksCommentsArray.length + 1,
                ...action.payload
            };
            state.overlooksCommentsArray.push(newOverlookComment)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOverlookComments.pending, (state) => {
                state.isLoading = true;
                state.errMsg = '';
            })
            .addCase(fetchOverlookComments.fulfilled, (state, action) => {
                state.isLoading = true;
                state.errMsg = '';
                state.overlooksCommentsArray = action.payload;
            })
            .addCase(fetchOverlookComments.rejected, (state, action) => {
                state.isLoading = true;
                state.errMsg = action.error ? action.error.message : 'Fetch failed';
            })
            .addCase(postOverlookComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errMsg = '';
                state.overlooksCommentsArray.push(action.payload);
            })
            .addCase(postOverlookComment.rejected, (state, action) => {
                state.isLoading = false;
                alert(
                    'Your comment could not be posted\nError: ' +
                    (action.error ? action.error.message : 'POST failed')
                );
            })
            .addCase(deleteOverlookComment.fulfilled, (state, action) => {
                state.overlooksCommentsArray = state.overlooksCommentsArray.filter(
                    (comment) => comment.id !== action.payload
                );
            })
            .addCase(deleteOverlookComment.rejected, (state, action) => {
                alert(
                    'Your comment could not be deleted\nError: ' +
                    (action.error ? action.error.message : 'DELETE failed')
                );
            })
            .addCase(deleteAllOverlooksComments.fulfilled, (state, action) => {
                state.overlooksCommentsArray = state.overlooksCommentsArray.filter(
                    (comment) => comment.overlookId !== action.payload
                );
            })

    }
});

export const overlooksCommentsReducer = overlooksCommentsSlice.reducer;

export const { addOverlookComment } = overlooksCommentsSlice.actions;

export const selectOverlooksCommentsByOverlookId = (overlookId) => (state) => {
    return state.overlookscomments.overlooksCommentsArray.filter(
        (comment) => comment.overlookId === parseInt(overlookId)
    )
};