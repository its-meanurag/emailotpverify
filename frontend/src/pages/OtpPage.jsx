import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './OtpPage.css'

const OtpPage = () => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      navigate('/')
      return
    }
    setUserEmail(email)
  }, [navigate])

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verifyEmail`,
        { code: otp }
      )

      if (response.data.success) {
        setSuccess('Email verified successfully!')
        localStorage.removeItem('userEmail')
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    // In a real app, you'd implement resend OTP functionality
    setError('Resend OTP feature not implemented yet')
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-header">
          <h2 className="otp-title">Verify Your Email</h2>
          <p className="otp-subtitle">
            We've sent a 6-digit verification code to
          </p>
          <p className="user-email">{userEmail}</p>
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="form-group">
            <label htmlFor="otp" className="form-label">
              Verification Code
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleChange}
              className="otp-input"
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="verify-button"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="otp-footer">
          <p className="footer-text">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              className="resend-button"
            >
              Resend OTP
            </button>
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="back-button"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default OtpPage
