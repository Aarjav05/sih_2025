import axios from "axios";

const backendBaseUrl = 'http://localhost:5000';
const getToken = () => localStorage.getItem('access_token') || '';

export async function fetchSchoolAnalytics(startDate, endDate) {
    const token = getToken();
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const res = await axios.get(`${backendBaseUrl}/api/analytics/school`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return res.data;
}

export async function fetchDistrictOverview() {
    const token = getToken();
    const res = await axios.get(`${backendBaseUrl}/api/district/overview`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// /api/schools / <int:school_id>/classes

export async function fetchSchoolClasses(schoolId) {
    //console.log("School ID is: ", schoolId);
    const token = getToken();
    const res = await axios.get(`${backendBaseUrl}/api/schools/${schoolId}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function fetchSchoolClassStudents(schoolId, className) {
    const token = getToken();
    const res = await axios.get(
        `${backendBaseUrl}/api/schools/${schoolId}/classes/${encodeURIComponent(className)}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}