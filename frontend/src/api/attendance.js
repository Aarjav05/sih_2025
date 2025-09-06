import axios from 'axios';

const backendBaseUrl = 'http://localhost:5000';

// Helper to get token dynamically
const getToken = () => import.meta.env.VITE_REACT_APP_ACCESS_TOKEN || '';

// Use this function to include token in headers dynamically
export const captureAttendance = async (className, imageData) => {
    const token = getToken();
    console.log("Token from env: " + token);
    const response = await axios.post(`${backendBaseUrl}/api/attendance/capture`, {
        class_name: className,
        image_data: imageData,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export async function confirmAttendance(sessionId, confirmations) {
    const token = getToken();  // reuse your token getter if needed
    try {
        const response = await axios.post(
            `${backendBaseUrl}/api/attendance/confirm`,
            {
                session_id: sessionId,
                confirmations
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error confirming attendance:", error);
        throw new Error('Failed to confirm attendance');
    }
}