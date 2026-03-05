import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../app/shared/baseUrl';

export const userSignup = createAsyncThunk(
    'user/signup',
    async (userData) => {
        const response = await fetch(baseUrl + 'users/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Signup failed');
        }

        return await response.json();
    }
);

export const userLogin = createAsyncThunk(
    'user/login',
    async (credentials) => {
        const response = await fetch(baseUrl + 'users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }
        return await response.json()
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
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;

                localStorage.setItem('token', action.payload.token)
            })
            .addCase(userSignup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error ? action.error.message : 'Error encountered during signup'
            })
            .addCase(userLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;

                localStorage.setItem('token', action.payload.token)
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error ? action.error.message : 'Error encountered during login'
            })
    }
});

export const userReducer = userSlice.reducer