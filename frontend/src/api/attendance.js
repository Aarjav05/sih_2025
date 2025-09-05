import axios from 'axios';

/**
 * Calls backend to capture attendance by processing uploaded class photo.
 * @param {string} className - Selected class name
 * @param {string} imageData - Base64 encoded class photo
 * @returns {Promise} response with matches, unmatched, present and absent students, session_id
 */
export const captureAttendance = async (className, imageData) => {
    const response = await axios.post('/api/attendance/capture', {
        class_name: className,
        image_data: imageData,
    });
    return response.data;
};

/**
 * Confirms attendance for a session by sending confirmed student statuses.
 * @param {string} sessionId - ID of the attendance session
 * @param {Array} confirmations - Array of {student_id, status} objects
 * @returns {Promise} response from backend
 */
export const confirmAttendance = async (sessionId, confirmations) => {
    const response = await axios.post('/api/attendance/confirm', {
        session_id: sessionId,
        confirmations,
    });
    return response.data;
};