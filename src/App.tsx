import { useState, useEffect } from 'react'
import Register from './Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import UserDashboard from './components/UserDashboard'
import StudentDashboard from './components/StudentDashboard'
import TeacherDashboard from './components/TeacherDashboard'
import './App.css'

function App() {
  const [view, setView] = useState<'login' | 'register' | 'admin_dashboard' | 'student_dashboard' | 'user_dashboard' | 'teacher_dashboard'>('login')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      const user = JSON.parse(userData)
      const roles = user.roles ? user.roles.map((r: any) => r.name) : []
      
      if (roles.includes('ROLE_ADMIN')) {
        setView('admin_dashboard')
      } else if (roles.includes('ROLE_TEACHER')) {
        setView('teacher_dashboard')
      } else if (roles.includes('ROLE_STUDENT')) {
        setView('student_dashboard')
      } else if (roles.includes('ROLE_USER')) {
        setView('user_dashboard')
      }
    }
  }, [])

  return (
    <div className="App">
      {view !== 'admin_dashboard' && view !== 'student_dashboard' && view !== 'user_dashboard' && view !== 'teacher_dashboard' && (
        <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
          <button onClick={() => setView('login')}>Trang Đăng Nhập</button>
          <button onClick={() => setView('register')}>Trang Đăng Ký</button>
        </nav>
      )}

      {view === 'login' && <Login />}
      {view === 'register' && <Register />}
      {view === 'admin_dashboard' && <Dashboard />}
      {view === 'student_dashboard' && <StudentDashboard />}
      {view === 'user_dashboard' && <UserDashboard />}
      {view === 'teacher_dashboard' && <TeacherDashboard />}
    </div>
  )
}

export default App
