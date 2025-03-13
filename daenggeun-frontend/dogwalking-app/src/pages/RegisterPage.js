"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthPages.css";
import { register, checkUsername, checkEmail, uploadFile } from "../utils/api";
import {
  isValidUsername,
  isValidEmail,
  isValidPassword,
  doPasswordsMatch,
  isValidAge,
} from "../utils/validation";

// 주소 검색 모달 컴포넌트
// function AddressModal({ isOpen, onClose, onComplete }) {
//   // const openPostcode = () => {
//   //   new window.daum.Postcode({
//   //     oncomplete: function (data) {
//   //       const fullAddress = data.roadAddress || data.jibunAddress; // 도로명 주소 우선
//   //       const districtMatch = fullAddress.match(/([가-힣]+구)/);
//   //       const district = districtMatch ? districtMatch[1] : "";

//   //       onComplete(fullAddress, district);
//   //       onClose();
//   //     },
//   //   }).open();
//   // };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-backdrop">
//       <div className="modal">
//         <div className="modal-header">
//           <h3 className="modal-title">주소 검색</h3>
//           <button className="modal-close" onClick={onClose}>
//             &times;
//           </button>
//         </div>
//         <div className="modal-body">
//           <p className="form-hint">카카오 우편번호 API로 주소를 검색하세요.</p>
//           <button
//             className="auth-button auth-button-primary"
//             onClick={openPostcode}
//           >
//             주소 검색하기
//           </button>
//         </div>
//         <div className="modal-footer">
//           <button className="auth-button auth-button-outline" onClick={onClose}>
//             닫기
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

function RegisterPage({ onLogin }) {
  const navigate = useNavigate();

  // 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    phone: "",
    address: "",
    location: "",
    pets: [],
  });

  const [petData, setPetData] = useState({
    name: "",
    age: "",
    gender: "Male",
    breed: "",
    personality: "",
  });
  const [validation, setValidation] = useState({
    email: { isChecking: false, isValid: false, isChecked: false, message: "" },
    username: {
      isChecking: false,
      isValid: false,
      isChecked: false,
      message: "",
    },
    password: { isValid: false, message: "" },
    confirmPassword: { isValid: false, message: "" },
    formIsValid: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // 비밀번호 유효성 검사
  useEffect(() => {
    if (formData.password) {
      if (isValidPassword(formData.password)) {
        setValidation((prev) => ({
          ...prev,
          password: { isValid: true, message: "사용 가능한 비밀번호입니다." },
        }));
      } else {
        setValidation((prev) => ({
          ...prev,
          password: {
            isValid: false,
            message: "비밀번호는 6~12자리로 입력해주세요.",
          },
        }));
      }
    } else {
      setValidation((prev) => ({
        ...prev,
        password: { isValid: false, message: "" },
      }));
    }

    // 비밀번호 확인 유효성 검사
    if (formData.confirmPassword) {
      if (doPasswordsMatch(formData.password, formData.confirmPassword)) {
        setValidation((prev) => ({
          ...prev,
          confirmPassword: { isValid: true, message: "비밀번호가 일치합니다." },
        }));
      } else {
        setValidation((prev) => ({
          ...prev,
          confirmPassword: {
            isValid: false,
            message: "비밀번호가 일치하지 않습니다.",
          },
        }));
      }
    } else {
      setValidation((prev) => ({
        ...prev,
        confirmPassword: { isValid: false, message: "" },
      }));
    }
  }, [formData.password, formData.confirmPassword]);

  // 전체 폼 유효성 검사
  useEffect(() => {
    const isFormValid =
      validation.username.isValid &&
      validation.email.isValid &&
      validation.password.isValid &&
      validation.confirmPassword.isValid &&
      formData.petName.trim() !== "" &&
      formData.petAge.trim() !== "" &&
      formData.petBreed.trim() !== "" &&
      formData.address.trim() !== "";

    setValidation((prev) => ({
      ...prev,
      formIsValid: isFormValid,
    }));
  }, [
    validation.username.isValid,
    validation.email.isValid,
    validation.password.isValid,
    validation.confirmPassword.isValid,
    formData.petName,
    formData.petAge,
    formData.petBreed,
    formData.address,
  ]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // 아이디나 이메일 변경 시 중복 확인 상태 초기화
    if (name === "username" || name === "email") {
      setValidation((prev) => ({
        ...prev,
        [name]: {
          isChecking: false,
          isValid: false,
          isChecked: false,
          message: "",
        },
      }));
    }

    // 회원가입 에러 메시지 초기화
    if (registerError) {
      setRegisterError("");
    }
  };

  // 셀렉트 변경 핸들러
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // ✅ 카카오 우편번호 API 자동 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // // ✅ 주소 선택 핸들러
  // const handleAddressComplete = (address, district) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     address: address,
  //     location: district, // 구 정보 자동 설정
  //   }));
  // };
  // ✅ 주소 검색 실행 (버튼 클릭 시 바로 실행)
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.roadAddress || data.jibunAddress;
        const districtMatch = fullAddress.match(/([가-힣]+구)/);
        const district = districtMatch ? districtMatch[1] : "";

        setFormData((prev) => ({
          ...prev,
          address: fullAddress,
          location: district, // 구 정보 자동 설정
        }));
      },
    }).open();
  };

  // 아이디 중복 확인 핸들러
  const handleCheckUsername = async () => {
    if (!formData.username.trim()) {
      setValidation((prev) => ({
        ...prev,
        username: {
          isChecking: false,
          isValid: false,
          isChecked: true,
          message: "아이디를 입력해주세요.",
        },
      }));
      return;
    }

    if (!isValidUsername(formData.username)) {
      setValidation((prev) => ({
        ...prev,
        username: {
          isChecking: false,
          isValid: false,
          isChecked: true,
          message: "아이디는 3~20자의 영문, 숫자, 한글만 가능합니다.",
        },
      }));
      return;
    }

    setValidation((prev) => ({
      ...prev,
      username: {
        isChecking: true,
        isValid: false,
        isChecked: false,
        message: "확인 중...",
      },
    }));

    try {
      // 아이디 중복 확인 API 호출
      const response = await checkUsername(formData.username);

      setValidation((prev) => ({
        ...prev,
        username: {
          isChecking: false,
          isValid: response.available,
          isChecked: true,
          message: response.message,
        },
      }));
    } catch (error) {
      setValidation((prev) => ({
        ...prev,
        username: {
          isChecking: false,
          isValid: false,
          isChecked: true,
          message: "중복 확인 중 오류가 발생했습니다.",
        },
      }));
    }
  };

  // 이메일 중복 확인 핸들러
  const handleCheckEmail = async () => {
    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setValidation((prev) => ({
        ...prev,
        email: {
          isChecking: false,
          isValid: false,
          isChecked: true,
          message: "유효한 이메일을 입력해주세요.",
        },
      }));
      return;
    }

    setValidation((prev) => ({
      ...prev,
      email: {
        isChecking: true,
        isValid: false,
        isChecked: false,
        message: "확인 중...",
      },
    }));

    try {
      // 이메일 중복 확인 API 호출
      const response = await checkEmail(formData.email);

      setValidation((prev) => ({
        ...prev,
        email: {
          isChecking: false,
          isValid: response.available,
          isChecked: true,
          message: response.message,
        },
      }));
    } catch (error) {
      setValidation((prev) => ({
        ...prev,
        email: {
          isChecking: false,
          isValid: false,
          isChecked: true,
          message: "중복 확인 중 오류가 발생했습니다.",
        },
      }));
    }
  };

  // 파일 입력 핸들러
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        // 파일 업로드 API 호출
        const response = await uploadFile(file, "profile");

        setFormData((prev) => ({
          ...prev,
          profilePicture: response.url,
        }));
      } catch (error) {
        console.error("파일 업로드 실패:", error);
        // 에러 처리
      }
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!validation.formIsValid) {
      // 중복 확인이 되지 않은 경우
      if (!validation.username.isChecked) {
        setErrors((prev) => ({
          ...prev,
          username: "아이디 중복 확인을 해주세요.",
        }));
      }

      if (!validation.email.isChecked) {
        setErrors((prev) => ({
          ...prev,
          email: "이메일 중복 확인을 해주세요.",
        }));
      }

      // 비밀번호 유효성 검사
      if (!validation.password.isValid) {
        setErrors((prev) => ({
          ...prev,
          password: "비밀번호는 6~12자리로 입력해주세요.",
        }));
      }

      // 비밀번호 일치 확인
      if (!validation.confirmPassword.isValid) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "비밀번호가 일치하지 않습니다.",
        }));
      }

      // 반려견 정보 확인
      if (!formData.petName) {
        setErrors((prev) => ({
          ...prev,
          petName: "반려견 이름을 입력해주세요.",
        }));
      }

      if (!formData.petAge) {
        setErrors((prev) => ({
          ...prev,
          petAge: "반려견 나이를 입력해주세요.",
        }));
      } else if (!isValidAge(formData.petAge)) {
        setErrors((prev) => ({
          ...prev,
          petAge: "유효한 나이를 입력해주세요.",
        }));
      }

      if (!formData.petBreed) {
        setErrors((prev) => ({
          ...prev,
          petBreed: "견종을 입력해주세요.",
        }));
      }

      // 주소 확인
      if (!formData.address) {
        setErrors((prev) => ({
          ...prev,
          address: "주소를 입력해주세요.",
        }));
      }

      return;
    }

    setIsLoading(true);

    try {
      // 회원가입 API 호출
      const response = await register(formData);

      // 회원가입 성공 시 처리
      if (response.success) {
        // 로컬 스토리지에 사용자 정보 및 토큰 저장
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);

        // 부모 컴포넌트에 로그인 상태 전달
        if (onLogin) {
          onLogin(response.user, response.token);
        }

        // 홈페이지로 이동
        navigate("/");
      }
    } catch (error) {
      // 회원가입 실패 시 에러 메시지 표시
      setRegisterError(
        error.message || "회원가입에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">회원가입</h2>
            <p className="auth-card-description">
              댕근의 새로운 회원이 되어보세요.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-card-content">
              {/* 회원가입 에러 메시지 */}
              {registerError && (
                <div className="auth-alert auth-alert-error">
                  {registerError}
                </div>
              )}
              {/* 이메일 입력 필드 */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  이메일
                </label>
                <div className="address-input-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${
                      validation.email.isChecked &&
                      (validation.email.isValid ? "valid" : "error")
                    }`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading || validation.email.isChecking}
                  />
                  <button
                    type="button"
                    className="address-search-button"
                    onClick={handleCheckEmail}
                    disabled={isLoading || validation.email.isChecking}
                  >
                    {validation.email.isChecking ? "확인 중..." : "중복확인"}
                  </button>
                </div>
                {validation.email.message && (
                  <p
                    className={`${
                      validation.email.isValid ? "form-success" : "form-error"
                    }`}
                  >
                    {validation.email.message}
                  </p>
                )}
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
              {/* 닉네임 입력 필드 */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  닉네임
                </label>
                <div className="address-input-group">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`form-input ${
                      validation.username.isChecked &&
                      (validation.username.isValid ? "valid" : "error")
                    }`}
                    placeholder="사용자 닉네임"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading || validation.username.isChecking}
                  />
                  <button
                    type="button"
                    className="address-search-button"
                    onClick={handleCheckUsername}
                    disabled={isLoading || validation.username.isChecking}
                  >
                    {validation.username.isChecking ? "확인 중..." : "중복확인"}
                  </button>
                </div>
                {validation.username.message && (
                  <p
                    className={`${
                      validation.username.isValid
                        ? "form-success"
                        : "form-error"
                    }`}
                  >
                    {validation.username.message}
                  </p>
                )}
                {errors.username && (
                  <p className="form-error">{errors.username}</p>
                )}
              </div>

              {/* 비밀번호 입력 필드 */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input ${
                    formData.password &&
                    (validation.password.isValid ? "valid" : "error")
                  }`}
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formData.password && (
                  <p
                    className={`${
                      validation.password.isValid
                        ? "form-success"
                        : "form-error"
                    }`}
                  >
                    {validation.password.message}
                  </p>
                )}
                <p className="form-hint">비밀번호는 6~12자리로 입력해주세요.</p>
                {errors.password && (
                  <p className="form-error">{errors.password}</p>
                )}
              </div>

              {/* 비밀번호 확인 필드 */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-input ${
                    formData.confirmPassword &&
                    (validation.confirmPassword.isValid ? "valid" : "error")
                  }`}
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formData.confirmPassword && (
                  <p
                    className={`${
                      validation.confirmPassword.isValid
                        ? "form-success"
                        : "form-error"
                    }`}
                  >
                    {validation.confirmPassword.message}
                  </p>
                )}
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword}</p>
                )}
              </div>

              {/* 주소 입력 필드 */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                주소
              </label>
              <div className="address-input-group">
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-input"
                  placeholder="주소 검색을 클릭하세요"
                  value={formData.address}
                  readOnly
                />
                <button
                  type="button"
                  className="address-search-button"
                  onClick={handleAddressSearch}
                >
                  🔍 검색
                </button>
              </div>
              {formData.location && (
                <p className="form-hint">지역: {formData.location} (자동 설정됨)</p>
              )}
            </div>

              <div className="pet-info-section">
                <h3 className="pet-info-title">반려견 정보</h3>
                {/* 반려견 이미지 업로드 */}
                <div className="form-group">
                  <label htmlFor="profilePicture" className="form-label">
                    반려견 사진
                  </label>
                  <div className="profile-upload">
                    <div className="profile-image-preview">
                      {formData.profilePicture ? (
                        <img
                          src={formData.profilePicture || "/placeholder.svg"}
                          alt="프로필 미리보기"
                          className="profile-image"
                        />
                      ) : (
                        <span className="profile-placeholder">👤</span>
                      )}
                    </div>
                    <div className="profile-upload-input">
                      <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="form-input"
                      />
                      <p className="profile-upload-hint">
                        JPG, PNG 형식의 이미지를 업로드해주세요.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="petName" className="form-label">
                    반려견 이름
                  </label>
                  <input
                    type="text"
                    id="petName"
                    name="petName"
                    className="form-input"
                    placeholder="초코"
                    value={formData.petName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.petName && (
                    <p className="form-error">{errors.petName}</p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="petAge" className="form-label">
                      나이
                    </label>
                    <input
                      type="number"
                      id="petAge"
                      name="petAge"
                      className="form-input"
                      placeholder="3"
                      value={formData.petAge}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.petAge && (
                      <p className="form-error">{errors.petAge}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="petGender" className="form-label">
                      성별
                    </label>
                    <select
                      id="petGender"
                      name="petGender"
                      className="form-input"
                      value={formData.petGender}
                      onChange={(e) =>
                        handleSelectChange("petGender", e.target.value)
                      }
                      disabled={isLoading}
                    >
                      <option value="남아">남아</option>
                      <option value="여아">여아</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="petBreed" className="form-label">
                    견종
                  </label>
                  <input
                    type="text"
                    id="petBreed"
                    name="petBreed"
                    className="form-input"
                    placeholder="포메라니안"
                    value={formData.petBreed}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.petBreed && (
                    <p className="form-error">{errors.petBreed}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="petPersonality" className="form-label">
                    성격
                  </label>
                  <input
                    type="text"
                    id="petPersonality"
                    name="petPersonality"
                    className="form-input"
                    placeholder="활발하고 친절해요"
                    value={formData.petPersonality}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 폼 유효성 상태 표시 */}
              {!validation.formIsValid &&
                formData.username &&
                formData.email &&
                formData.password && (
                  <div className="auth-alert auth-alert-error">
                    회원가입을 완료하려면 모든 필수 정보를 입력하고 중복 확인을
                    완료해주세요.
                  </div>
                )}
            </div>

            <div className="auth-card-footer">
              <button
                type="submit"
                className="auth-button auth-button-primary"
                disabled={isLoading || !validation.formIsValid}
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </button>

              <p className="auth-footer-text">
                이미 계정이 있으신가요?{" "}
                <Link to="/login" className="auth-link">
                  로그인
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* 주소 검색 모달
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onComplete={handleAddressComplete}
      /> */}
    </div>
  );
}

export default RegisterPage;
