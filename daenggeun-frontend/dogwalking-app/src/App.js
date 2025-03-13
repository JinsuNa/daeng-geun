"use client"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import FindFriendPage from "./pages/FindFriendPage"
import CommunityPage from "./pages/CommunityPage"
import CommunityWritePage from "./pages/CommunityWritePage"
import MarketPage from "./pages/MarketPage"
import MarketItemPage from "./pages/MarketItemPage"
import MarketWritePage from "./pages/MarketWritePage"
import ChatPage from "./pages/ChatPage"
import CalendarPage from "./pages/CalendarPage"
import ExhibitionPage from "./pages/ExhibitionPage"
import MyPage from "./pages/MyPage"
import "./styles/App.css"

function App() {
  // 사용자 인증 상태 관리

  
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  // 컴포넌트 마운트 시 로컬 스토리지에서 사용자 정보 확인
  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      // 사용자 정보가 있으면 인증 상태로 설정
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
    }

    // 실제 구현 시에는 여기서 토큰 유효성을 백엔드에 확인하는 로직 추가
    // 예시:
    /*
    const checkAuthStatus = async () => {
      try {
        // Spring Security에서 제공하는 토큰 검증 API 호출
        const response = await axios.get('http://localhost:8080/api/auth/validate', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.valid) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          // 토큰이 유효하지 않으면 로그아웃 처리
          handleLogout();
        }
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
        handleLogout();
      }
    };
    
    checkAuthStatus();
    */
  }, [])

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // 로컬 스토리지에서 사용자 정보 및 토큰 제거
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    // 인증 상태 초기화
    setIsAuthenticated(false)
    setUser(null)

    // 실제 구현 시에는 백엔드에 로그아웃 요청을 보내는 로직 추가
    // 예시:
    /*
    const logout = async () => {
      try {
        await axios.post('http://localhost:8080/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // 로컬 스토리지 정리 및 상태 초기화
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
      }
    };
    
    logout();
    */
  }

  // 로그인 처리 함수
  const handleLogin = (userData, token) => {
    // 로컬 스토리지에 사용자 정보 및 토큰 저장
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token)

    // 인증 상태 업데이트
    setIsAuthenticated(true)
    setUser(userData)
  }

  return (
    <div className="app">
      {/* 네비게이션 바 컴포넌트에 인증 상태 및 사용자 정보 전달 */}
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />

      <main className="main-content">
        {/* 라우트 설정 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/find-friend" element={<FindFriendPage isAuthenticated={isAuthenticated} />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/write" element={<CommunityWritePage isAuthenticated={isAuthenticated} />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/market/:id" element={<MarketItemPage />} />
          <Route path="/market/write" element={<MarketWritePage isAuthenticated={isAuthenticated} />} />
          <Route path="/chat" element={<ChatPage isAuthenticated={isAuthenticated} />} />
          <Route path="/calendar" element={<CalendarPage isAuthenticated={isAuthenticated} />} />
          <Route path="/exhibition" element={<ExhibitionPage />} />
          <Route path="/mypage" element={<MyPage isAuthenticated={isAuthenticated} user={user} />} />
          {/* 404 페이지 또는 기타 경로에 대한 처리 추가 가능 */}
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App

