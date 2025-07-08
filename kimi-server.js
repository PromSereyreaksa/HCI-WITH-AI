import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.KIMI_PORT || 3000;

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Kimi API request
    const response = await axios.post(
      process.env.KIMI_API_ENDPOINT || "http://localhost:8000",
      {
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.KIMI_REFRESH_TOKEN}`,
        },
      }
    );

    const botResponse =
      response.data.choices[0]?.message?.content || "No response";
    res.send({ response: botResponse });
  } catch (error) {
    console.error("Error:", error?.response?.data || error);
    res.status(500).send({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Kimi proxy server is running on port ${port}`);
});
