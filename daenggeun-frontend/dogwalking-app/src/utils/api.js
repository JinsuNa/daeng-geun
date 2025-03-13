/**
 * API 호출 유틸리티
 *
 * 이 파일은 백엔드 API와의 통신을 담당하는 함수들을 제공합니다.
 * 실제 구현 시에는 Spring Boot 백엔드 API 엔드포인트에 맞게 수정해야 합니다.
 */

import axios from "axios"

// API 기본 URL 설정 (실제 배포 시 환경에 맞게 변경)
const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = "/api" // 프록시 설정 시

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터 설정 - 모든 요청에 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 설정 - 인증 오류 처리
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 401 Unauthorized 오류 시 로그아웃 처리
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

/**
 * 인증 관련 API 함수들
 */

// 로그인 API
export const login = async (email, password) => {
  try {
      const response = await fetch("http://localhost:8080/api/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          throw new Error("로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.");
      }

      const data = await response.json();
      return data; // { userId, email, nickname, token }
  } catch (error) {
      throw error;
  }
};

// 회원가입 API
export const register = async (userData) => {
  try {
      const response = await fetch("http://localhost:8080/api/register", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
      });

      if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "회원가입에 실패했습니다.");
      }

      return await response.text(); // 회원가입 성공 메시지 반환
  } catch (error) {
      throw error;
  }
};

// 비밀번호 찾기 API
export const forgotPassword = async (username, email) => {
  try {
    // 실제 구현 시에는 아래 주석 해제
    /*
    const response = await api.post('/auth/forgot-password', {
      username,
      email,
    });
    return response.data;
    */

    // 임시 구현 (백엔드 연동 전까지만 사용)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
          success: true,
        })
      }, 1000)
    })
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

// 비밀번호 재설정 API
export const resetPassword = async (password, token) => {
  try {
    // 실제 구현 시에는 아래 주석 해제
    /*
    const response = await api.post('/auth/reset-password', {
      password,
      token,
    });
    return response.data;
    */

    // 임시 구현 (백엔드 연동 전까지만 사용)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "비밀번호가 성공적으로 변경되었습니다.",
          success: true,
        })
      }, 1000)
    })
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

// 로그아웃 API
export const logout = async () => {
  try {
    // 실제 구현 시에는 아래 주석 해제
    /*
    const response = await api.post('/auth/logout');
    return response.data;
    */

    // 임시 구현 (백엔드 연동 전까지만 사용)
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        resolve({
          message: "로그아웃 되었습니다.",
          success: true,
        })
      }, 500)
    })
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

// 사용자 정보 가져오기 API
export const getUserProfile = async () => {
  try {
    // 실제 구현 시에는 아래 주석 해제
    /*
    const response = await api.get('/users/profile');
    return response.data;
    */

    // 임시 구현 (백엔드 연동 전까지만 사용)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = localStorage.getItem("user")

        if (user) {
          resolve({
            user: JSON.parse(user),
            success: true,
          })
        } else {
          reject({
            message: "사용자 정보를 찾을 수 없습니다.",
            success: false,
          })
        }
      }, 500)
    })
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

// 사용자 이름 중복 확인 API
export const checkUsername = async (username) => {
  try {
    // 실제 구현 시에는 아래 주석 해제
    /*
    const response = await api.get(`/auth/check-username?username=${username}`);
    return response.data;
    */

    // 임시 구현 (백엔드 연동 전까지만 사용)
    return new Promise((resolve) => {
      setTimeout(() => {
        // 테스트용: admin과 user는 이미 사용 중인 아이디로 가정
        const isAvailable = !["admin", "user"].includes(username)

        resolve({
          available: isAvailable,
          message: isAvailable ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.",
          success: true,
        })
      }, 800)
    })
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

// 이메일 중복 확인 API
export const checkEmail = async (email) => {
  try {
    // 실제 구현 시에는 아래 주석 해제
    /*
    const response = await api.get(`/auth/check-email?email=${email}`);
    return response.data;
    */

    // 임시 구현 (백엔드 연동 전까지만 사용)
    return new Promise((resolve) => {
      setTimeout(() => {
        // 테스트용: admin@example.com과 user@example.com은 이미 사용 중인 이메일로 가정
        const isAvailable = !["admin@example.com", "user@example.com"].includes(email)

        resolve({
          available: isAvailable,
          message: isAvailable ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.",
          success: true,
        })
      }, 800)
    })
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

/**
 * 기타 API 함수들
 */

// 파일 업로드 API
export const uploadFile = async (file, type = "image") => {
  try {
    // 실제 구현 시에는 아래 주석 해제
    /*
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
    */

    // 임시 구현 (백엔드 연동 전까지만 사용)
    return new Promise((resolve) => {
      setTimeout(() => {
        // 파일을 Base64로 변환하여 반환
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve({
            url: reader.result,
            success: true,
          })
        }
        reader.readAsDataURL(file)
      }, 1000)
    })
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

export default api

