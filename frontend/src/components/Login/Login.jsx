import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Context/AuthContext"
import axios from "axios"
import { Eye, EyeOff, Mail, Lock, LogIn, GraduationCap } from "lucide-react"

import { useTranslation } from 'react-i18next';


export default function Login() {

  const { t } = useTranslation();


  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      // Adjust backend URL as needed
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password })
      if (res.data && res.data.access_token) {
        // Optionally: fetch user profile here if backend provides it
        const userObject = { email, role: res.data.role } // You may want to replace this with real user info
        login(userObject, res.data.access_token)
        localStorage.setItem("user_role", res.data.role)
        navigate("/dashboard")
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError("Login failed.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen pb-2 flex flex-col lg:flex-row overflow-hidden">
      {/* Left section: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-[3px_12px_5px_0px_rgba(0,0,0,0.35)] p-8 flex flex-col gap-6">
          <div className="flex flex-col justify-center items-center gap-1 mb-0.5">
            <img src="/attendance.png" className="w-12 h-12" alt="" />
            <span className="text-3xl font-bold text-black">Markr</span>
          </div>
          <hr className="h-0.5 bg-gray-600 w-4/5 mx-auto" />
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
          <p className="mb-2 text-gray-500 text-center">
            Continue with your email to access your attendance dashboard.
          </p>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block font-semibold mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                {showPassword ? (
                  <EyeOff
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#22225B] hover:bg-[#18183C] py-3 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:from-indigo-700 hover:to-sky-800 transition"
            >
              <LogIn size={20} />
              {loading ? "Signing In..." : "Sign In"}
            </button>
            {error && (
              <p className="text-center text-red-500 font-semibold mt-2">{error}</p>
            )}
          </form>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
          <div className="text-center mt-2 text-xs text-gray-400">© 2025 Markr. All rights reserved.</div>
        </div>
      </div>
      {/* Right section: Responsive Image */}
      <div className="hidden lg:block flex-1 h-screen items-center">
        <img
          src="/login.jpg" // Replace with your actual image path
          alt="Classroom"
          className="w-full h-full object-cover object-center rounded-2xl"
        />
      </div>
    </div>
  )
}