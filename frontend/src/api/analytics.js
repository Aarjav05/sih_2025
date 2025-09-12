import axios from "axios";

const API_URL = "http://localhost:5000/api";

export async function fetchSchoolAnalytics(token, startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const res = await axios.get(`${API_URL}/analytics/school`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return res.data;
}

export async function fetchDistrictOverview(token) {
    const res = await axios.get(`${API_URL}/district/overview`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}