import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../app/shared/baseUrl';

export const userSignup = createAsyncThunk(
    'user/signup',
    async (userData, { rejectWithValue }) => {
        const response = await fetch(baseUrl + 'users/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Signup failed');
        }

        return await response.json();

    }
);

export const userLogin = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        const response = await fetch(baseUrl + 'users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const err = await response.json();
            return rejectWithValue(err.message || 'Login failed');
        }
        return await response.json()
    }
);

export const validateLogin = createAsyncThunk(
    'user/validateLogin',
    async(_, { getState, rejectWithValue }) => {
        const token = getState().user.token;

        if (!token) return rejectWithValue('No token found');

        const response = await fetch(baseUrl + 'users/me', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        if (!response.ok) {
            return rejectWithValue('Token invalid or expired');
        }

        return await response.json();
    }
)

const initialState = {
    isLoading: false,
    isAuthenticated: localStorage.getItem('token') ? true : false,
    token: localStorage.getItem('token'),
    currentUser: null,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        loginWithOAuthToken: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload;
            state.error = null;
            localStorage.setItem('token', action.payload)
        },
        clearCurrentUser: (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            state.token = null;
            state.currentUser = null;
            state.error = null;
            localStorage.removeItem('token')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userSignup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(userSignup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;
                state.error = null
                localStorage.setItem('token', action.payload.token)
            })
            .addCase(userSignup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(userLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;
                state.error = null;
                localStorage.setItem('token', action.payload.token)
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(validateLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(validateLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.currentUser = action.payload;
                state.error = null;
            })
            .addCase(validateLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.currentUser = null;
                state.error = action.payload || action.error.message;
                localStorage.removeItem('token');
            })
    }
});

export const userReducer = userSlice.reducer;
export const { setCurrentUser, clearCurrentUser, loginWithOAuthToken } = userSlice.actions;

export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectToken = (state) => state.user.token;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;