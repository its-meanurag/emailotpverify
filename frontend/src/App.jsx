import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import OtpPage from './pages/OtpPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
