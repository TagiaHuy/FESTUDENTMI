import { useState, useEffect } from 'react'
import Register from './Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login')

  useEffect(() => {
    // Kiểm tra xem đã đăng nhập chưa
    const token = localStorage.getItem('token')
    if (token) {
      setView('dashboard')
    }
  }, [])

  return (
    <div className="App">
      {view !== 'dashboard' && (
        <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
          <button onClick={() => setView('login')}>Trang Đăng Nhập</button>
          <button onClick={() => setView('register')}>Trang Đăng Ký</button>
        </nav>
      )}

      {view === 'login' && <Login />}
      {view === 'register' && <Register />}
      {view === 'dashboard' && <Dashboard />}
    </div>
  )
}

export default App
