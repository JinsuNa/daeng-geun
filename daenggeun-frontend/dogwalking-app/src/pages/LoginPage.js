"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../styles/AuthPages.css"
import { login } from "../utils/api"

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()

  // 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  // URL 해시에 따라 초기 탭 설정
  useEffect(() => {
    if (location.hash === "#signup") {
      setActiveTab("signup")
    }
  }, [location])

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }

    // 로그인 에러 메시지 초기화
    if (loginError) {
      setLoginError("")
    }
  }

  // 로그인 요청 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      const response = await login(formData.email, formData.password)

      // 로그인 성공 시 로컬 스토리지에 사용자 정보 및 토큰 저장
      localStorage.setItem("token", response.token)
      localStorage.setItem("userId", response.userId)
      localStorage.setItem("email", response.email)
      localStorage.setItem("nickname", response.nickname)

      // 부모 컴포넌트에 로그인 상태 전달
      if (onLogin) {
        onLogin(response.user, response.token)
      }

      // 로그인 성공 후 대시보드로 이동
      navigate("/dashboard")
    } catch (error) {
      setLoginError(error.message || "로그인에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-tabs">
          <div className="auth-tabs-list">
            <div
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              로그인
            </div>
            <div
              className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => navigate("/register")}
            >
              회원가입
            </div>
          </div>
        </div>

        <div className={`auth-tab-content ${activeTab === "login" ? "active" : ""}`}>
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-card-title">로그인</h2>
              <p className="auth-card-description">댕근 서비스를 이용하려면 로그인해주세요.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-card-content">
                {loginError && <div className="auth-alert auth-alert-error">{loginError}</div>}

                {/* 이메일 입력 */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">이메일</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${errors.email ? "error" : ""}`}
                    placeholder="이메일"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                {/* 비밀번호 입력 */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">비밀번호</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-input ${errors.password ? "error" : ""}`}
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.password && <p className="form-error">{errors.password}</p>}
                </div>
              </div>

              <div className="auth-card-footer">
                <button type="submit" className="auth-button auth-button-primary" disabled={isLoading}>
                  {isLoading ? "로그인 중..." : "로그인"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
