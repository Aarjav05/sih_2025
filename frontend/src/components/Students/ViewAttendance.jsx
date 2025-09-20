import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

import { useTranslation } from "react-i18next";

const ViewAttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('class-1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [classes] = useState(['class-1', 'class-2', 'class-3', 'class-4', 'class-5']);
  const { getToken } = useAuth();


  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');

      const token = getToken();
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      console.log('Fetching attendance for:', selectedDate, 'class:', selectedClass);

      const response = await axios.get(`http://localhost:5000/api/reports/daily/${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data);

      // Filter by selected class and sort by student ID in ascending order
      const classData = response.data.records
        .filter(record => record.class_name === selectedClass)
        .sort((a, b) => {
          // Extract numeric part of student ID for proper sorting (e.g., "STU001" -> 1)
          const extractNumber = (id) => {
            const num = id.replace(/\D/g, ''); // Remove non-digit characters
            return num ? parseInt(num) : 0;
          };

          return extractNumber(a.student_id) - extractNumber(b.student_id);
        });

      console.log('Filtered and sorted data:', classData);
      setAttendanceData(classData);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to fetch attendance data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedClass, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const getStatusIcon = (status) => {
    if (status === 'present') {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center w-20 justify-center">
          <svg className="w-3 h-3 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
          </svg>
          Present
        </span>
      );
    } else {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center w-20 justify-center">
          <svg className="w-3 h-3 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          Absent
        </span>
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Attendance</h1>
          <p className="text-gray-600">View and manage student attendance records</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>
                    Class {cls.split('-')[1]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <button
                onClick={fetchAttendance}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceData.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 01118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {attendanceData.filter(student => student.status === 'present').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {attendanceData.filter(student => student.status === 'absent').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Table with Student ID */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.length > 0 ? (
                  attendanceData.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.student_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-blue-800">
                              {student.student_name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.student_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Class {student.class_name.split('-')[1]}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusIcon(student.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      {loading ? (
                        <div className="flex justify-center">
                          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
                          <p className="mt-1 text-sm text-gray-500">No attendance data found for {selectedDate} in {selectedClass}.</p>
                          <p className="mt-1 text-sm text-gray-500">Try selecting a different date or check if attendance was recorded.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendancePage;