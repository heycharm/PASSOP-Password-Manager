const express = require('express');
const dotenv = require('dotenv');
const { connectDb } = require('./utlis/db');
const authRoutes = require('./router/auth-router');
const passwordRoutes = require('./router/password-routes');
const session = require('express-session');
const cors = require('cors');

dotenv.config();

const app = express();

// CORS Options
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

// Start server and connect to DB
connectDb()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode.`);
        });
    })
    .catch(err => {
        console.error("Failed to connect to the database", err);
    });
