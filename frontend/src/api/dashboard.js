import axios from 'axios';

const backendBaseUrl = 'http://localhost:5000';

// Helper to get token dynamically
const getToken = () => localStorage.getItem('access_token') || '';

export async function fetchGenderData(className, includeAttendance = false, attendanceData = []) {
    console.log(Date.now);
    try {
        const token = getToken();
        //console.log("Token from env: ", token);
        const response = await axios.get(`${backendBaseUrl}/api/students/class/${className}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        //console.log("students info response: ", response);
        const students = response.data.students || [];

        // Optionally merge attendance status into students by student_id:
        let mergedStudents = students;
        if (includeAttendance && attendanceData.length) {
            const attendanceMap = attendanceData.reduce((map, record) => {
                map[record.student_id] = record.status; // e.g., "present" or "absent"
                return map;
            }, {});
            mergedStudents = students.map((s) => ({
                ...s,
                status: attendanceMap[s.student_id] || "absent", // default absent if no record
            }));
        }

        // Count students by gender depending on includeAttendance flag:
        const genderCounts = mergedStudents.reduce((acc, student) => {
            if (!includeAttendance || student.status === "present") {
                const gender = student.gender || "Unknown";
                acc[gender] = (acc[gender] || 0) + 1;
            }
            return acc;
        }, {});

        // Format for chart:
        return Object.entries(genderCounts).map(([gender, count]) => ({
            label: gender,
            value: count,
        }));

    } catch (error) {
        console.error("Error fetching gender data:", error);
        throw error;
    }
}


export async function getTotalStudents() {
    try {
        const token = getToken();
        //console.log("Token from env: ", token);
        const response = await axios.get(`${backendBaseUrl}/api/students/school/summary`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        //console.log("students info response: ", response);
        //console.log("Total students response: ", response);
        const totalStudents = response.data.total_students;
        const perClassCountsArr = response.data.per_class_counts;
        let maxCounts = -999;
        let maxClass;
        for (let i = 0; i < perClassCountsArr.length; i++) {
            if (perClassCountsArr[i].count > maxCounts) {
                maxCounts = perClassCountsArr[i].count;
                maxClass = perClassCountsArr[i].class_name;
            }
        }
        // console.log("Total students recieved: ", totalStudents);
        // return totalStudents;

        return {
            "totalStudents": totalStudents,
            "maxClassName": maxClass
        };

    } catch (error) {
        console.error("Error fetching total Students:", error);
        throw error;
    }
}

export async function todayAttendanceTotals() {
    try {
        const token = getToken();
        const today = new Date().toISOString().split("T")[0];
        const response = await axios.get(`${backendBaseUrl}/api/reports/daily/${today}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const records = response.data.records || [];
        let present = 0, absent = 0;
        records.forEach(r => {
            if (r.status === "present") present++;
            else absent++;
        });
        return [
            { label: "Present", value: present, color: "#3b82f6" },
            { label: "Absent", value: absent, color: "#ef4444" },
        ];
    } catch (error) {
        console.error("Error fetching today attendance totals:", error);
        return [];
    }
}

export async function attendanceByClass() {
    try {
        const token = getToken();
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        const response = await axios.get(`${backendBaseUrl}/api/reports/daily/${today}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const records = response.data.records || [];

        const groupedByClass = {};

        records.forEach(({ class_name, status }) => {
            if (!groupedByClass[class_name]) {
                groupedByClass[class_name] = { total: 0, present: 0 };
            }
            groupedByClass[class_name].total += 1;
            if (status === "present") {
                groupedByClass[class_name].present += 1;
            }
        });

        const attendanceByClassData = Object.entries(groupedByClass).map(
            ([className, counts]) => ({
                class_name: className,
                attendance: Math.round((counts.present / counts.total) * 100),
            })
        );

        return attendanceByClassData;
    } catch (error) {
        console.error("Error fetching attendance by class data:", error);
        return [];
    }
}

export async function avgAttendanceAndBestClass() {
    try {
        const token = getToken(); // Your token getter function
        const response = await axios.get(`${backendBaseUrl}/api/analytics/school`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const stats = response.data?.overall_stats || {};
        return {
            averageAttendance: stats.average_attendance ?? 0,
            bestClass: stats.best_performing_class ?? "-",
        };
    } catch (err) {
        console.error("Error fetching school analytics:", err);
        return { averageAttendance: 0, bestClass: "-" };
    }
}

export async function fetchPresentToday() {
    try {
        const token = getToken();
        const today = new Date().toISOString().split("T")[0];
        const resAttend = await axios.get(`${backendBaseUrl}/api/reports/daily/${today}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const records = resAttend.data?.records || [];
        const presentCount = records.filter(r => r.status === "present").length;

        // For percent, fetch total students
        const resTotal = await axios.get(`${backendBaseUrl}/api/students/school/summary`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const totalStudents = resTotal.data?.total_students || 1;
        const percentToday = Math.round((presentCount / totalStudents) * 100);
        return { presentCount, percentToday };
    } catch (err) {
        console.error("Error fetching present today count:", err);
        return { presentCount: 0, percentToday: 0 };
    }
}

export async function fetchAttendanceAreaChartData(rangeDays = 7) {
    //console.log("range days accepted in api call function: ", rangeDays);
    try {
        const token = getToken();
        const today = new Date();
        const endDate = today.toISOString().split("T")[0];
        today.setDate(today.getDate() - rangeDays + 1);
        const startDate = today.toISOString().split("T")[0];

        const response = await axios.get(`${backendBaseUrl}/api/analytics/school?start_date=${startDate}&end_date=${endDate}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Extract and format data for Area Chart
        return (response.data.daily_attendance || []).map(day => ({
            date: day.date,
            present: day.present_count,
            absent: day.total_count - day.present_count,
            total: day.total_count
        }));
    } catch (error) {
        console.error("Error fetching area chart data:", error);
        return [];
    }
}

export async function fetchLowAttendanceWatchlist(threshold = 75, days = 30, className = "") {
    try {
        const token = getToken();
        let url = `${backendBaseUrl}/api/attendance/watchlist?threshold=${threshold}&days=${days}`;
        if (className) url += `&class_name=${encodeURIComponent(className)}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.watchlist || [];
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        return [];
    }
}