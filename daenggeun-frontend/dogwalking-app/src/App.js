"use client";

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
import EditProductPage from "./pages/EditProductPage";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [navKey, setNavKey] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("nickname");
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  // 로그인 처리 함수
  const handleLogin = (userData) => {
    localStorage.setItem("nickname", userData.nickname); // 저장
    setIsAuthenticated(true);
    setUser(userData.nickname);
  };

  // 로그아웃 처리 함수
  const onLogout = () => {
    setIsAuthenticated(false);
    setUser(null);

    // 모든 로그인 정보 삭제
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("nickname");
    localStorage.removeItem("token");

    // 로그아웃 후 로그인 페이지로 이동
    navigate("/login");
  };

  return (
    <div className="app">
      {/* 🔹 네비게이션 바에 인증 상태 및 사용자 정보 전달 */}
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<RegisterPage onLogin={handleLogin} />}
          />
          <Route
            path="/find-friend"
            element={<FindFriendPage isAuthenticated={isAuthenticated} />}
          />
          <Route path="/community" element={<CommunityPage />} />
          <Route
            path="/community/write"
            element={<CommunityWritePage isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/market/write"
            element={<MarketWritePage isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/market/write"
            element={<MarketWritePage isAuthenticated={isAuthenticated} />}
          />
          <Route path="/market/edit/:id" element={<EditProductPage />} />
          <Route path="/market/:id" element={<MarketItemPage />} />
          <Route path="/market" element={<MarketPage />} />

          <Route
            path="/chat"
            element={<ChatPage isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/calendar"
            element={<CalendarPage isAuthenticated={isAuthenticated} />}
          />
          <Route path="/exhibition" element={<ExhibitionPage />} />
          <Route
            path="/mypage"
            element={<MyPage isAuthenticated={isAuthenticated} user={user} />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
