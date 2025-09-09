import React, { useState, useEffect } from 'react';
import StudentDashboard from './components/Students/StudentDastboard';
import Login from './components/Login/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for a better UX
    const timer = setTimeout(() => {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    setToken(storedToken);
    setIsLoggedIn(true);
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken('');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <svg className="h-12 w-12 text-indigo-600 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Loading School Portal</h2>
          <p className="mt-2 text-gray-500">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {isLoggedIn ? (
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900">School Management System</h1>
                    <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Admin'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 hidden md:block">
                    <span className="text-sm text-gray-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow">
            <StudentDashboard />
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">© 2023 School Management System. All rights reserved.</p>
                <div className="flex space-x-6 mt-2 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
                    Privacy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
                    Terms
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
                    Support
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* Header for login page */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900">School Management System</h1>
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="text-sm text-gray-500">Secure access for authorized personnel only</span>
                </div>
              </div>
            </div>
          </header>

          {/* Login Content */}
          <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 animate-fade-in">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Access the school management portal
                </p>
              </div>
              <Login onLogin={handleLogin} />
            </div>
          </div>

          {/* Footer for login page */}
          <footer className="bg-white border-t border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm text-gray-500">© 2023 School Management System. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
      
      {/* Custom styles using style tag for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;