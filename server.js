require('dotenv').config(); // Load .env variables FIRST
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();

// 1. Initialize OpenAI SDK but point it to Groq's Endpoint
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Welcome Route
app.get('/', (req, res) => {
    res.send("Digital Avatar AI Server is running! Use POST /chat to communicate.");
});

// 4. The Chat Route (now powered by OpenAI)
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ reply: "I didn't receive a message." });
        }

        console.log("User said:", userMessage);

        // Call Groq API via OpenAI SDK
        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful digital avatar AI assistant. Be friendly, concise, and informative."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            max_tokens: 500,
        });

        const botReply = completion.choices[0].message.content;
        console.log("AI replied:", botReply);

        res.json({ reply: botReply });

    } catch (error) {
        console.error("Server Error:", error.message);

        // Friendly error if API key is missing or invalid
        if (error.status === 401) {
            return res.status(500).json({ reply: "⚠️ Invalid or missing OpenAI API key. Please check your .env file." });
        }

        res.status(500).json({ reply: "Internal server error. Please try again." });
    }
});

// 5. Start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log("-----------------------------------------");
    console.log(`✅ Digital Avatar AI Server (Groq Edition) is live!`);
    console.log(`🚀 Running on: http://localhost:${PORT}`);
    console.log(`🔑 Groq API Key loaded: ${process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌"}`);
    console.log("-----------------------------------------");
});