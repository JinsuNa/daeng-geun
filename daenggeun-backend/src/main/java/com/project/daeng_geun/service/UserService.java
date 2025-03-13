package com.project.daeng_geun.service;

import com.project.daeng_geun.dto.UserDTO;
import com.project.daeng_geun.entity.User;
import com.project.daeng_geun.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * 회원가입 서비스
     */
    public User registerUser(UserDTO userDTO) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // User 엔티티 생성 및 비밀번호 암호화
        User user = User.builder()
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword())) // 비밀번호 암호화
                .nickname(userDTO.getNickname())
                .phone(userDTO.getPhone())
                .address(userDTO.getAddress())
                .location(userDTO.getLocation())
                .build();

        // 저장 후 반환
        return userRepository.save(user);
    }
}
