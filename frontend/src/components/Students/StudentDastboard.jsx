import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ProgressChart = ({ activeTab, studentData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (activeTab !== "progress" || !canvasRef.current || !studentData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sample data for the chart
    const data = {
      labels: ["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Test 6"],
      datasets: [
        {
          label: "Maths",
          data: [75, 80, 85, 78, 82, 88],
          color: "#3b82f6",
        },
        {
          label: "Science",
          data: [70, 85, 90, 88, 75, 85],
          color: "#ef4444",
        },
        {
          label: "English",
          data: [80, 75, 70, 85, 90, 85],
          color: "#f59e0b",
        },
        {
          label: "History",
          data: [85, 80, 75, 80, 85, 90],
          color: "#10b981",
        },
      ],
    }

    const padding = 60
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Draw grid lines and labels
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748b"

    // Vertical grid lines and x-axis labels
    for (let i = 0; i <= data.labels.length - 1; i++) {
      const x = padding + (i * chartWidth) / (data.labels.length - 1)

      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + chartHeight)
      ctx.stroke()

      // X-axis labels
      ctx.textAlign = "center"
      ctx.fillText(data.labels[i], x, padding + chartHeight + 20)
    }

    // Horizontal grid lines and y-axis labels
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * chartHeight) / 4
      const value = 100 - i * 25

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      // Y-axis labels
      ctx.textAlign = "right"
      ctx.fillText(value + "%", padding - 10, y + 4)
    }

    // Draw data lines
    data.datasets.forEach((dataset) => {
      ctx.strokeStyle = dataset.color
      ctx.lineWidth = 2
      ctx.beginPath()

      dataset.data.forEach((value, index) => {
        const x = padding + (index * chartWidth) / (data.labels.length - 1)
        const y = padding + chartHeight - (value / 100) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw data points
      ctx.fillStyle = dataset.color
      dataset.data.forEach((value, index) => {
        const x = padding + (index * chartWidth) / (data.labels.length - 1)
        const y = padding + chartHeight - (value / 100) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
    })
  }, [activeTab, studentData])

  return <canvas ref={canvasRef} width="800" height="300" className="w-full h-[300px]" />
}

const StudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("progress");
  const [selectedClass, setSelectedClass] = useState("class-1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    student_id: '',
    class_name: 'class-1',
    gender: 'Male',
    guardian_name: '',
    guardian_phone: '',
    health_notes: '',
    face_image: ''
  });

  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const token = getToken();

      if (!token) {
        setError('Please login first. No JWT token found.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/students/class/${selectedClass}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setStudents(response.data.students);
      // Auto-select the first student if none is selected
      if (response.data.students.length > 0 && !currentStudent) {
        setCurrentStudent(response.data.students[0]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view this data.');
      } else {
        setError('Failed to fetch students. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setCurrentStudent(null);
  };

  const handleRefresh = () => {
    fetchStudents();
    setCurrentStudent(null);
  };

  const handleAddStudent = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError('Please login first.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/students', newStudent, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setShowAddModal(false);
        setNewStudent({
          name: '',
          student_id: '',
          class_name: 'class-1',
          gender: 'Male',
          guardian_name: '',
          guardian_phone: '',
          health_notes: '',
          face_image: ''
        });
        fetchStudents(); // Refresh the list
        alert('Student added successfully!');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      alert('Failed to add student: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError('Please login first.');
        return;
      }

      // Since your backend doesn't have a delete endpoint, we'll deactivate the student
      // You might need to add this endpoint to your Flask app
      const response = await axios.delete(`http://localhost:5000/api/students/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        fetchStudents(); // Refresh the list
        setCurrentStudent(null);
        alert('Student deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewStudent({
          ...newStudent,
          face_image: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const circumference = 2 * Math.PI * 40;
  const progressOffset = currentStudent ? circumference - ((currentStudent.progress || 85) / 100) * circumference : 0;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans items-center justify-center">
        <div className="text-center text-gray-600 text-lg">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Add New Student</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Student ID"
                value={newStudent.student_id}
                onChange={(e) => setNewStudent({ ...newStudent, student_id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <select
                value={newStudent.class_name}
                onChange={(e) => setNewStudent({ ...newStudent, class_name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="class-1">Class 1</option>
                <option value="class-2">Class 2</option>
                <option value="class-3">Class 3</option>
                <option value="class-4">Class 4</option>
                <option value="class-5">Class 5</option>
              </select>
              <select
                value={newStudent.gender}
                onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Guardian Name"
                value={newStudent.guardian_name}
                onChange={(e) => setNewStudent({ ...newStudent, guardian_name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Guardian Phone"
                value={newStudent.guardian_phone}
                onChange={(e) => setNewStudent({ ...newStudent, guardian_phone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Health Notes (Optional)"
                value={newStudent.health_notes}
                onChange={(e) => setNewStudent({ ...newStudent, health_notes: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                rows="2"
              />
              <div>
                <label className="block text-sm mb-1">Student Photo (Required for face recognition)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddStudent}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Add Student
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white border-r rounded-2xl border-gray-200 flex flex-col shadow-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Student Portal</h2>
          <div className="flex items-center gap-2">
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="class-1">Class 1</option>
              <option value="class-2">Class 2</option>
              <option value="class-3">Class 3</option>
              <option value="class-4">Class 4</option>
              <option value="class-5">Class 5</option>
            </select>
            <button className="text-gray-500 hover:text-gray-700 transition-colors" onClick={handleRefresh}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for students or ID"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
            {currentStudent && (
              <button
                onClick={() => handleDeleteStudent(currentStudent.id)}
                className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`flex items-center p-4 cursor-pointer transition-all duration-300 rounded-xl mb-2 ${currentStudent && student.id === currentStudent.id
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                : "hover:bg-gray-100 hover:shadow-md"
                }`}
              onClick={() => setCurrentStudent(student)}
            >
              <div className="w-12 h-12 rounded-full mr-4 bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-semibold text-sm mb-1 ${currentStudent && student.id === currentStudent.id ? "text-white" : "text-gray-800"}`}>
                  {student.name}
                </div>
                <div className={`text-xs ${currentStudent && student.id === currentStudent.id ? "text-blue-100" : "text-gray-500"}`}>
                  {student.student_id}
                </div>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${currentStudent && student.id === currentStudent.id ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-700"}`}>
                Class {student.class_name.split('-')[1]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {currentStudent ? (
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
              <p className="text-blue-100 text-sm">Overall Progress</p>
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
                <span className="text-sm font-medium text-gray-800">{currentStudent.gender || "Not specified"}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-xs text-gray-500 mb-2 uppercase font-semibold">Date of Birth: </label>
                <span className="text-sm font-medium text-gray-800">29-04-2004</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-xs text-gray-500 mb-2 uppercase font-semibold">Religion: </label>
                <span className="text-sm font-medium text-gray-800">Christian</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-xs text-gray-500 mb-2 uppercase font-semibold">Blood Group: </label>
                <span className="text-sm font-medium text-gray-800">B+</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl col-span-2 md:col-span-4">
                <label className="text-xs text-gray-500 mb-2 uppercase font-semibold">Address: </label>
                <span className="text-sm font-medium text-gray-800">1962 Harrison Street San Francisco, CA 94103</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <label className="text-xs text-blue-600 mb-2 uppercase font-semibold">Father: </label>
                <div>
                  <div className="text-sm font-medium text-gray-800">{currentStudent.guardian_name}</div>
                  <div className="text-xs text-blue-500">{currentStudent.guardian_phone}</div>
                </div>
              </div>
              <div className="bg-pink-50 p-4 rounded-xl">
                <label className="text-xs text-pink-600 mb-2 uppercase font-semibold">Mother: </label>
                <div>
                  <div className="text-sm font-medium text-gray-800">Maren Berge</div>
                  <div className="text-xs text-pink-500">+1660-687-7027</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              {["progress", "attendance", "fees", "bus"].map((tab) => (
                <button
                  key={tab}
                  className={`px-8 py-4 text-sm font-medium border-b-2 transition-all duration-300 ${activeTab === tab
                    ? "text-blue-600 border-blue-600 bg-blue-50"
                    : "text-gray-500 border-transparent hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "progress" && "Academic Progress"}
                  {tab === "attendance" && "Attendance"}
                  {tab === "fees" && "Fees History"}
                  {tab === "bus" && "Transport"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "progress" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-semibold text-gray-800">Performance Overview</h4>
                    <div className="flex gap-4">
                      <span className="flex items-center text-xs text-gray-500">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Maths
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>Science
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>English
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>History
                      </span>
                    </div>
                  </div>
                  <ProgressChart activeTab={activeTab} studentData={currentStudent} />
                </div>
              )}
              {activeTab === "attendance" && (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Attendance Record</h3>
                  <p className="text-gray-500">95% attendance this semester</p>
                </div>
              )}
              {activeTab === "fees" && (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Fees Status</h3>
                  <p className="text-gray-500">All fees are paid up to date</p>
                </div>
              )}
              {activeTab === "bus" && (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Bus Route #12</h3>
                  <p className="text-gray-500">Pickup: 7:15 AM | Dropoff: 3:30 PM</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-sm">Select a student to view details</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

