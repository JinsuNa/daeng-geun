/**
 * 마이페이지 컴포넌트
 *
 * 사용자의 닉네임, 프로필 이미지, 반려견 정보를 관리할 수 있는 기능을 제공합니다.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/mypage.css";

const BASE_URL = "http://localhost:8080/api/mypage";

function MyPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // ✅ 상태 관리
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("/placeholder.svg");

  // ✅ formData 초기 상태
  const [formData, setFormData] = useState({
    username: "",
    petName: "",
    petBreed: "",
    petAge: "",
    petGender: "",
    petPersonality: "",
  });

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    axios
      .get(`${BASE_URL}/${userId}`)
      .then((response) => {
        setUser(response.data);
        setFormData({
          username: response.data.username || "",
          petName: response.data.petName || "",
          petBreed: response.data.petBreed || "",
          petAge: response.data.petAge || "",
          petGender: response.data.petGender || "",
          petPersonality: response.data.petPersonality || "",
        });
        if (response.data.image) {
          setImagePreview(response.data.image);
        }
        
      })
      .catch((error) => console.error("사용자 정보 가져오기 실패:", error))
      .finally(() => setIsLoading(false));
  }, [userId, navigate]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 백엔드에 파일 업로드 요청
      const response = await axios.post(
        "http://localhost:8080/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // S3에서 반환된 이미지 URL
      const uploadedImageUrl = response.data;
      console.log("✅ 업로드된 이미지 URL:", uploadedImageUrl); // 디버깅용

      // ✅ 미리보기 및 상태 업데이트
      setImagePreview(uploadedImageUrl);
      setUser((prevUser) => ({ ...prevUser, image: uploadedImageUrl }));

      // 사용자 데이터 업데이트
      await axios.put(`${BASE_URL}/${userId}`, { image: uploadedImageUrl });

      alert("이미지가 성공적으로 업로드되었습니다.");
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 사용자 정보 업데이트
  const handleUserUpdate = async () => {
    setIsSubmitting(true);
    try {
      await axios.put(`${BASE_URL}/${userId}`, {
        username: formData.username,
        image: imagePreview,
      });

      setUser((prevUser) => ({ ...prevUser, username: formData.username }));
      localStorage.setItem("nickname",formData.username)
      window.location.reload()
      alert("사용자 정보가 업데이트되었습니다.");
    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
      alert("업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 반려견 정보 업데이트
  const handlePetUpdate = async () => {
    setIsSubmitting(true);
    try {
      await axios.put(`${BASE_URL}/${userId}/pet`, {
        petName: formData.petName,
        petBreed: formData.petBreed,
        petAge: formData.petAge,
        petGender: formData.petGender,
        petPersonality: formData.petPersonality,
      });

      alert("반려견 정보가 업데이트되었습니다.");
    } catch (error) {
      console.error("반려견 정보 업데이트 실패:", error);
      alert("업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      {/* 🌟 마이페이지 제목 */}
      <div className="mypage-header">
        <h1 className="mypage-title">마이페이지</h1>
      </div>

      {/* 🌟 프로필 및 반려견 정보 전체 컨테이너 */}
      <div className="mypage-content">
        {/* 🌟 프로필 정보 */}
        <div className="card profile-section">
          <h2 className="card-title">👤 프로필</h2>
          <div className="profile-content">
            <div className="profile-image-container">
              <img
                src={imagePreview}
                alt="프로필 이미지"
                className="profile-image"
              />
            </div>
            <label>닉네임</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isSubmitting}
          />
          <button
            onClick={handleUserUpdate}
            className="btn-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "사용자 정보 수정"}
          </button>
        </div>

        {/* 🌟 반려견 정보 */}
        <div className="card pet-section">
          <h2 className="card-title">🐶 반려견 정보</h2>
          <label>이름</label>
          <input
            type="text"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
          />

          <label>견종</label>
          <input
            type="text"
            name="petBreed"
            value={formData.petBreed}
            onChange={handleChange}
          />

          <label>나이</label>
          <input
            type="number"
            name="petAge"
            value={formData.petAge}
            onChange={handleChange}
          />

          <label>성별</label>
          <select
            name="petGender"
            value={formData.petGender}
            onChange={handleChange}
          >
            <option value="">성별 선택</option>
            <option value="남아">남아</option>
            <option value="여아">여아</option>
          </select>

          <label>성격</label>
          <input
            type="text"
            name="petPersonality"
            value={formData.petPersonality}
            onChange={handleChange}
          />

          <button
            onClick={handlePetUpdate}
            className="btn-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "반려견 정보 수정"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
