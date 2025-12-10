import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Employees from './pages/Employees'
import Login from './pages/Login'

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth') === 'true')

    const handleLogin = () => {
        setIsAuthenticated(true)
        localStorage.setItem('auth', 'true')
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem('auth')
    }

    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />

            <Route path="/" element={isAuthenticated ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="employees" element={<Employees />} />
            </Route>
        </Routes>
    )
}
