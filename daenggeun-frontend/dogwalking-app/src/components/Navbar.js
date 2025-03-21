"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"

function Navbar({ isAuthenticated,onLogout }) {
  // 현재 경로 가져오기
  const location = useLocation()

  // 모바일 메뉴 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null);
  // 알림 관련 상태 관리
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 로그인을 하면 로컬스토리지에 회원정보가 jwt토근으로 받아 json으로 변환해주는 코드
  useEffect(() => {
    const storedUser = localStorage.getItem("nickname"); // ✅ 닉네임 가져오기
    if (storedUser) {
      setUser(storedUser);
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   if (!userId) {
  //     navigate("/login"); // 🚀 로그인 안 했으면 로그인 페이지로 이동
  //   }
  // }, [userId, navigate]);

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }


  // 알림 읽음 표시 함수
  const markAsRead = (id) => {
    // 실제 구현 시에는 백엔드에 알림 읽음 상태 업데이트 API 호출
    // 예시:
    /*
    const updateNotificationStatus = async (id) => {
      try {
        await axios.put(`http://localhost:8080/api/notifications/${id}/read`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // 상태 업데이트
        setNotifications(prev =>
          prev.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('알림 상태 업데이트 실패:', error);
      }
    };
    
    updateNotificationStatus(id);
    */

    // 임시 구현 (백엔드 연동 전까지만 사용)
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  // 모든 알림 읽음 표시 함수
  const markAllAsRead = () => {
    // 실제 구현 시에는 백엔드에 모든 알림 읽음 상태 업데이트 API 호출
    // 예시:
    /*
    const markAllNotificationsAsRead = async () => {
      try {
        await axios.put('http://localhost:8080/api/notifications/read-all', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // 상태 업데이트
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      } catch (error) {
        console.error('모든 알림 상태 업데이트 실패:', error);
      }
    };
    
    markAllNotificationsAsRead();
    */

    // 임시 구현 (백엔드 연동 전까지만 사용)
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  // 알림 패널 토글 함수
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen)
  }

  // 네비게이션 항목 정의
  const navItems = [
    { name: "Home", path: "/" },
    { name: "댕근찾기", path: "/find-friend" },
    { name: "댕근마켓", path: "/market" },
    { name: "커뮤니티", path: "/community" },
    { name: "마이페이지", path: "/mypage" },
  ]

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* 로고 */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.svg" alt="댕근 로고" className="logo-image" />
        </Link>

        {/* 모바일 메뉴 버튼 */}
        <button className="menu-button" onClick={toggleMenu}>
          {isMenuOpen ? <span className="menu-icon">✕</span> : <span className="menu-icon">☰</span>}
        </button>

        {/* 데스크탑 네비게이션 */}
        <nav className={`navbar-nav ${isMenuOpen ? "active" : ""}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              
              </li>
            ))}
          </ul>

          {/* 로그인/로그아웃 버튼 */}
          <div className="auth-buttons">
            {isAuthenticated ? (
              <>
                <span className="user-name">{user || "사용자"}님</span>

                {/* 알림 버튼 */}
                <button className="notification-button" onClick={toggleNotification}>
                  <span className="notification-icon">🔔</span>
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>

                <button className="logout-button" onClick={onLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/login" className="login-button" onClick={() => setIsMenuOpen(false)}>
                로그인
              </Link>
            )}
          </div>
        </nav>

        {/* 알림 패널 */}
        {isNotificationOpen && (
          <div className="notification-panel">
            <div className="notification-header">
              <h3>알림</h3>
              {unreadCount > 0 && (
                <button className="mark-all-read" onClick={markAllAsRead}>
                  모두 읽음 표시
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.link}
                    className={`notification-item ${!notification.read ? "unread" : ""}`}
                    onClick={() => {
                      markAsRead(notification.id)
                      setIsNotificationOpen(false)
                    }}
                  >
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <p className="notification-time">{notification.time}</p>
                    </div>
                    {!notification.read && <div className="unread-indicator"></div>}
                  </Link>
                ))
              ) : (
                <div className="no-notifications">알림이 없습니다</div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar

