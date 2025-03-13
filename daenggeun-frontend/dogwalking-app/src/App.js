"use client";

import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FindFriendPage from "./pages/FindFriendPage";
import CommunityPage from "./pages/CommunityPage";
import CommunityWritePage from "./pages/CommunityWritePage";
import MarketPage from "./pages/MarketPage";
import MarketItemPage from "./pages/MarketItemPage";
import MarketWritePage from "./pages/MarketWritePage";
import ChatPage from "./pages/ChatPage";
import CalendarPage from "./pages/CalendarPage";
import ExhibitionPage from "./pages/ExhibitionPage";
import MyPage from "./pages/MyPage";
import "./styles/App.css";
import { registerUser } from "./utils/api"; // 📌 추가


function App() {
  // 🔹 사용자 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ 컴포넌트 마운트 시 로컬 스토리지에서 사용자 정보 확인 + 백엔드 인증 확인
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      checkAuthStatus(token); // 서버에 토큰 검증 요청
    }
  }, []);

  // ✅ Spring Boot 서버에서 인증 상태 확인
  const checkAuthStatus = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.valid) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        handleLogout(); // 토큰이 유효하지 않으면 로그아웃
      }
    } catch (error) {
      console.error("인증 확인 중 오류 발생:", error);
      handleLogout();
    }
  };

  // ✅ 로그아웃 처리 함수 (백엔드에도 로그아웃 요청)
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("http://localhost:8080/api/auth/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    } finally {
      // 로컬 스토리지에서 사용자 정보 제거
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // ✅ 로그인 처리 함수 (토큰 저장 및 인증 유지)
  const handleLogin = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  return (
    <div className="app">
      {/* 🔹 네비게이션 바에 인증 상태 및 사용자 정보 전달 */}
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />

      <main className="main-content">
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
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
