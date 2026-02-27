require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8001;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MyPortfolio';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB: MyPortfolio'))
    .catch(err => console.error('MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, './')));

// Contact Form Route
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    console.log('Received contact form submission:', { name, email, message });

    try {
        const newMessage = new Message({ name, email, message });
        const saved = await newMessage.save();
        console.log('Message saved successfully to DB:', saved._id);

        res.status(200).json({
            success: true,
            message: 'Thank you for your message, Muskan will get back to you soon!'
        });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
