import React, { useState, useRef } from "react";

const AttendanceChart = ({ activeTab }) => {
    const canvasRef = useRef(null);

    React.useEffect(() => {
        if (activeTab !== "attendance-graph" || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const data = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: "Attendance %",
                    data: [85, 92, 78, 95, 88, 75, 90, 86, 93, 89, 82, 96],
                    color: "#3b82f6",
                }
            ],
        }

        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#64748b";

        for (let i = 0; i <= data.labels.length - 1; i++) {
            const x = padding + (i * chartWidth) / (data.labels.length - 1);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
            ctx.textAlign = "center";
            ctx.fillText(data.labels[i], x, padding + chartHeight + 20);
        }

        for (let i = 0; i <= 4; i++) {
            const y = padding + (i * chartHeight) / 4;
            const value = 100 - i * 25;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
            ctx.textAlign = "right";
            ctx.fillText(value + "%", padding - 10, y + 4);
        }

        ctx.strokeStyle = data.datasets[0].color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        data.datasets[0].data.forEach((value, index) => {
            const x = padding + (index * chartWidth) / (data.labels.length - 1);
            const y = padding + chartHeight - (value / 100) * chartHeight;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        ctx.fillStyle = data.datasets[0].color;
        data.datasets[0].data.forEach((value, index) => {
            const x = padding + (index * chartWidth) / (data.labels.length - 1);
            const y = padding + chartHeight - (value / 100) * chartHeight;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#374151";
            ctx.textAlign = "center";
            ctx.fillText(value + "%", x, y - 10);
        });
    }, [activeTab]);

    return <canvas ref={canvasRef} width="800" height="300" className="w-full h-[300px]" />;
};

const staticAttendanceData = [
    { date: "2025-09-10", status: "present" },
    { date: "2025-09-11", status: "present" },
    { date: "2025-09-12", status: "absent" },
    { date: "2025-09-13", status: "absent" },
    { date: "2025-09-14", status: "present" },
    { date: "2025-09-15", status: "absent" },
    { date: "2025-09-16", status: "absent" },
];

const feesHistoryData = [
    { month: "January 2024", amount: 5000, status: "paid", paymentDate: "2024-01-05" },
    { month: "February 2024", amount: 5000, status: "paid", paymentDate: "2024-02-03" },
    { month: "March 2024", amount: 5000, status: "paid", paymentDate: "2024-03-02" },
    { month: "April 2024", amount: 5000, status: "pending", dueDate: "2024-04-10" },
    { month: "May 2024", amount: 5000, status: "pending", dueDate: "2024-05-10" },
];

const StaticStudent = () => {
    const [activeTab, setActiveTab] = useState("monthly-attendance");

    // Static student info
    const currentStudent = {
        id: "1",
        name: "Ahmad Ansari",
        student_id: "STU013",
        class_name: "class-2",
        gender: "Male",
        guardian_name: "Ansari",
        guardian_phone: "+917385494050",
        progress: 85,
        religion: "Christian",
        mother_name: "Maren Berge",
        mother_phone: "+91-9123456780",
        address: "1962 Harrison Street San Francisco, CA 94103",
        blood_group: "B+",
        photo: "",
    };

    const circumference = 2 * Math.PI * 40;
    const progressOffset = circumference - ((currentStudent.progress || 85) / 100) * circumference;

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Main Content Only */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
                {/* Student Header */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white flex justify-between items-center mb-8 shadow-xl">
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full mr-6 bg-white/20 flex items-center justify-center overflow-hidden">
                                {currentStudent.photo ? (
                                    <img
                                        src={currentStudent.photo}
                                        alt={currentStudent.name}
                                        className="w-full h-full object-cover border-4 border-white/30 shadow-xl"
                                    />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-5 bg-green-400 border-2 border-white rounded-full w-5 h-5"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{currentStudent.name}</h1>
                            <p className="text-blue-100 opacity-90">
                                Class {currentStudent.class_name.split('-')[1].toUpperCase()} | Student ID: {currentStudent.student_id}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="relative flex items-center justify-center mb-2">
                            <svg width="100" height="100" className="transform -rotate-90">
                                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="#4ade80"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={progressOffset}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="absolute text-white text-lg font-bold">{currentStudent.progress || 85}%</span>
                        </div>
                        <p className="text-blue-100 text-sm">Overall Attendance</p>
                    </div>
                </div>

                {/* Basic Details Section */}
                <div className="bg-white rounded-2xl p-6 mb-8 shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Basic Details</h3>
                        <button className="text-gray-500 hover:text-gray-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <label className="text-xs text-gray-500 mb-2 uppercase font-semibold">Gender: </label>
                            <span className="text-sm font-medium text-gray-800">{currentStudent.gender}</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <label className="text-xs text-gray-500 mb-2 uppercase font-semibold">Date of Birth: </label>
                            <span className="text-sm font-medium text-gray-800">29-04-2004</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <label className="text-xs text-gray-500 mb-2 uppercase font-semibold">Religion: </label>
                            <span className="text-sm font-medium text-gray-800">Islam</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <label className="text-xs text-gray-500 mb-2 uppercase font-semibold">Blood Group: </label>
                            <span className="text-sm font-medium text-gray-800">O+</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl col-span-2 md:col-span-4">
                            <label className="text-xs text-gray-500 mb-2 uppercase font-semibold">Address: </label>
                            <span className="text-sm font-medium text-gray-800">22 Park Road, Lucknow, UP</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <label className="text-xs text-blue-600 mb-2 uppercase font-semibold">Father: </label>
                            <div>
                                <div className="text-sm font-medium text-gray-800">Imran Ansari</div>
                                <div className="text-xs text-blue-500">{currentStudent.guardian_phone}</div>
                            </div>
                        </div>
                        <div className="bg-pink-50 p-4 rounded-xl">
                            <label className="text-xs text-pink-600 mb-2 uppercase font-semibold">Mother: </label>
                            <div>
                                <div className="text-sm font-medium text-gray-800">Shabana Ansari</div>
                                <div className="text-xs text-pink-500">+91-9123456780</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        {["monthly-attendance", "attendance-graph", "fees-history"].map((tab) => (
                            <button
                                key={tab}
                                className={`px-8 py-4 text-sm font-medium border-b-2 transition-all duration-300 ${activeTab === tab
                                    ? "text-blue-600 border-blue-600 bg-blue-50"
                                    : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-gray-50"
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "monthly-attendance" && "Monthly Attendance"}
                                {tab === "attendance-graph" && "Attendance Graph"}
                                {tab === "fees-history" && "Fees History"}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === "monthly-attendance" && (
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Attendance Records - Past Week</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {staticAttendanceData.map((record, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.status === 'present'
                                                            ? 'bg-green-100 text-green-800'
                                                            : record.status === 'absent'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {record.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "attendance-graph" && (
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Monthly Attendance Overview</h4>
                                <AttendanceChart activeTab={activeTab} />
                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="bg-green-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-green-600">85%</div>
                                        <div className="text-sm text-green-700">Average Attendance</div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-blue-600">22</div>
                                        <div className="text-sm text-blue-700">Present Days</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-red-600">3</div>
                                        <div className="text-sm text-red-700">Absent Days</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "fees-history" && (
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Fees Payment History</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {feesHistoryData.map((fee, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.month}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{fee.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${fee.status === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {fee.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {fee.status === 'paid' ? fee.paymentDate : `Due: ${fee.dueDate}`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <h5 className="font-semibold text-blue-800 mb-2">Total Outstanding: ₹10,000</h5>
                                    <p className="text-sm text-blue-600">Next due date: April 10, 2024</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaticStudent;