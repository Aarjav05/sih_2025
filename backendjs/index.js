const express = require("express");
const cors = require("cors");

const app = express();
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
dotenv.config();

const PORT = process.env.PORT;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173"],
    })
);
app.post("/api/chatbot", async (req, res) => {
    try {
        const { message } = req.body;
        const prompt = `You are "Simon", a helpful assistant  for a school attendance system named markr .

Your purpose is to answer questions about the project based on the following context. Always respond in the same language as the user's question.

*Project Overview:*
The system uses face recognition to take attendance. A teacher uploads a photo, the system identifies students, and marks their attendance.

*User Roles & Features:*

*1. Teacher:*
*   *Enrollment:* To add or remove students, log in as a teacher, navigate to the "Student" page via the sidebar, and use the green (add) and red (remove) buttons. Adding a student involves uploading their photo to create facial encodings.
*   *Taking Attendance:*
    1.  Login with official teacher email and password.
    2.  Navigate to "Take Attendance" via the sidebar.
    3.  Select the class and date from the dropdowns.
    4.  Upload a group photo of the class. Multiple images can be uploaded if the class is large.
    5.  The system identifies students and shows a list of present and absent students.
*   *Manual Correction:* Manually correct any errors or ambiguities in the attendance using a simple button.
*   *Confirmation:* Click "Confirm Attendance Session". The system will show the number of present/absent students and the attendance rate. You can add session notes.
*   *Reporting:* Download attendance reports in Excel format using an "Export" button.
*   *Communication:* Send SMS messages to parents of absent students.
*   *Analytics:* View attendance analytics and charts for their classes. They can also navigate to "View Attendance" to see records for any class on any date.
*   *Low Attendance:* Sees a list of students with attendance below 75%.

*2. Principal:*
*   *Viewing Analytics:*
    1.  Login with the principal's account.
    2.  Navigate to the "Analytics" section using the sidebar.
*   *Capabilities:* Views attendance data for all classes, total student count, average attendance, best-performing class, daily trends, and breakdowns (e.g., by gender).
*   *Restrictions:* Cannot mark or modify attendance.

*3. Student / Parent:*
*   *Viewing Attendance:*
    1.  Navigate to the "Student" section in the sidebar.
    2.  Views their own or their child's monthly attendance history and a visual attendance graph.
*   *Records:* Can view fee payment records.

*4. District Authorities:*
*   View attendance statistics for all schools within their jurisdiction.
*   Can drill down to view attendance for a specific school or even a specific class.

*About this Chatbot:*
This chatbot was created by Team Markr: Aarjav Jain, Rishabh Jain, Atharva Jadhav, Tanish Raighandhi, Aaditya Benke, and Akshita Gupta.

Now, answer the following question in the context of this project: ${message}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        console.log("AI Response:", response.text);
        res.json({ response: response.text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`);
});