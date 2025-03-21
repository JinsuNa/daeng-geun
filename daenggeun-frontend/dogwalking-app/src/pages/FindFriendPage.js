"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "../styles/find-friend.css"

const BASE_URL = "http://localhost:8080/api/match"

const FindFriendPage = () => {
  const [currentProfiles, setCurrentProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [matchedCount, setMatchedCount] = useState(3) // 매칭된 댕댕이 수
  const [showMatchedDogs, setShowMatchedDogs] = useState(false)
  const [matchedDogs, setMatchedDogs] = useState([
    { id: 1, name: "멍멍이1", location: "서울", image: "/placeholder.svg" },
    { id: 2, name: "멍멍이2", location: "부산", image: "/placeholder.svg" },
    { id: 3, name: "멍멍이3", location: "대구", image: "/placeholder.svg" },
  ])

  // 상태 관리 부분에 selectedDog 상태 추가
  const [selectedDog, setSelectedDog] = useState(null)
  const [showDogPopup, setShowDogPopup] = useState(false)

  useEffect(() => {
    fetchRandomUsers()
  }, [])

  const fetchRandomUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/random`)
      setCurrentProfiles(response.data)
    } catch (error) {
      console.error("랜덤 사용자 가져오기 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMatchedDogsClick = () => {
    setShowMatchedDogs(!showMatchedDogs)
  }

  // 강아지 상세 정보 보기 핸들러 추가
  const handleViewDogDetails = (dog) => {
    setSelectedDog(dog)
    setShowDogPopup(true)
  }

  // 팝업 닫기 핸들러 추가
  const handleClosePopup = () => {
    setShowDogPopup(false)
  }

  //   선택하기 버튼 클릭 시 like +1 db 저장
  const handleSelect = async (id) => {
    if (!id) {
      await fetchRandomUsers()
    }
    try {
      await axios.post(`${BASE_URL}/like/${id}`)
      await fetchRandomUsers()
    } catch (error) {
      console.log("좋아요 증가 실패: ", error)
    }
  }

  const handleChat = (dogId) => {
    // 실제 구현 시에는 채팅 페이지로 이동
    alert(`${currentProfiles[0]?.name}와 채팅을 시작합니다.`)
  }

  const handleReject = (dogId) => {
    // 실제 구현 시에는 매칭 해제 API 호출
    alert(`${currentProfiles[0]?.name}와의 매칭을 해제합니다.`)
  }

  return (
    <div className="find-friend-page">
      <h1 className="find-friend-title">댕근찾기</h1>
      <p className="find-friend-description">마음에 드는 친구를 선택하세요!</p>

      {loading ? (
        <p>랜덤 강아지를 불러오는 중...</p>
      ) : (
        <div className="profiles-container">
          <div className="profile-card">
            <h2>{currentProfiles[0]?.userName}</h2>
            <img
              src={currentProfiles[0]?.image || "/placeholder.svg"}
              alt={currentProfiles[0]?.userName}
              className="profile-find-image"
            />
            <div className="profile-details">
              <p>견종: {currentProfiles[0]?.petBreed}</p>
              <p>나이: {currentProfiles[0]?.petAge}살</p>
              <p>성별: {currentProfiles[0]?.petGender}</p>
              <p>{currentProfiles[0]?.petPersonality}</p>
              <p>📍 {currentProfiles[0]?.location}</p>
            </div>
            <button className="select-button" onClick={() => handleSelect(currentProfiles[0]?.id)}>
              선택하기
            </button>
          </div>

          {/* 중앙 버튼 영역 - 카드들 사이에 위치 */}
          <div className="center-buttons">
            <button className="skip-button" onClick={fetchRandomUsers}>
              둘 다 선택 안함
            </button>
            <button className="matched-count-button" onClick={handleMatchedDogsClick}>
              ↩ 매칭된 댕댕이 ({matchedCount})
            </button>
            {showMatchedDogs && (
              <div className="matched-dogs-modal" onClick={() => setShowMatchedDogs(false)}>
                <div className="matched-dogs-container" onClick={(e) => e.stopPropagation()}>
                  <div className="matched-dogs-header">
                    <h3 className="matched-dogs-title">매칭된 댕댕이 ({matchedCount})</h3>
                    <button className="matched-dogs-close" onClick={() => setShowMatchedDogs(false)}>
                      ×
                    </button>
                  </div>
                  <div className="matched-dogs-list">
                    {matchedDogs.map((dog) => (
                      <div key={dog.id} className="matched-dog-item" onClick={() => handleViewDogDetails(dog)}>
                        <div className="matched-dog-info">
                          <img src={dog.image || "/placeholder.svg"} alt={dog.name} className="matched-dog-image" />
                          <div className="matched-dog-details">
                            <span className="matched-dog-name">{dog.name}</span>
                            <span className="matched-dog-location">📍 {dog.location}</span>
                          </div>
                        </div>
                        <div className="matched-dog-actions">
                          <button
                            className="chat-button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleChat(dog.id)
                            }}
                          >
                            채팅
                          </button>
                          <button
                            className="reject-button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReject(dog.id)
                            }}
                          >
                            거절
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-card">
            <h2>{currentProfiles[1]?.userName}</h2>
            <img
              src={currentProfiles[1]?.image || "/placeholder.svg"}
              alt={currentProfiles[1]?.userName}
              className="profile-find-image"
            />
            <div className="profile-details">
              <p>견종: {currentProfiles[1]?.petBreed}</p>
              <p>나이: {currentProfiles[1]?.petAge}살</p>
              <p>성별: {currentProfiles[1]?.petGender}</p>
              <p>{currentProfiles[1]?.petPersonality}</p>
              <p>📍 {currentProfiles[1]?.location}</p>
            </div>
            <button className="select-button" onClick={() => handleSelect(currentProfiles[1]?.id)}>
              선택하기
            </button>
          </div>
        </div>
      )}
      {showDogPopup && selectedDog && (
        <div className="dog-popup-backdrop" onClick={handleClosePopup}>
          <div className="dog-popup" onClick={(e) => e.stopPropagation()}>
            <button className="dog-popup-close" onClick={handleClosePopup}>
              ×
            </button>
            <div className="dog-popup-content">
              <div className="dog-popup-image-container">
                <img src={selectedDog.image || "/placeholder.svg"} alt={selectedDog.name} className="dog-popup-image" />
              </div>
              <div className="dog-popup-info">
                <h3 className="dog-popup-name">{selectedDog.name}</h3>
                <p className="dog-popup-location">📍 {selectedDog.location}</p>
                <div className="dog-popup-actions">
                  <button className="dog-popup-chat" onClick={() => handleChat(selectedDog.id)}>
                    채팅하기
                  </button>
                  <button className="dog-popup-reject" onClick={() => handleReject(selectedDog.id)}>
                    거절하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindFriendPage

