import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";

configDotenv();

const genAI = new GoogleGenerativeAI(process.env.GEN_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generateResponse = async (prompt) => {
    const result = await model.generateContent(prompt);
    return result.response.text();
};

export { generateResponse };