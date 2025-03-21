package com.project.daeng_geun.service;

import com.project.daeng_geun.dto.UserDTO;
import com.project.daeng_geun.entity.User;
import com.project.daeng_geun.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ 내 프로필 조회
    @Transactional(readOnly = true)
    public UserDTO getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return UserDTO.fromEntity(user);
    }

    // ✅ 마이페이지 정보 업데이트
    @Transactional
    public UserDTO updateMyProfile(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        updateUserFields(user, userDTO);
        userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    // ✅ 반려견 정보 업데이트
    @Transactional
    public UserDTO updatePetInfo(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        updatePetFields(user, userDTO);
        userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    // 🔹 사용자 정보 업데이트 (null 값 체크)
    private void updateUserFields(User user, UserDTO userDTO) {
        if (userDTO.getNickname() != null) user.setNickname(userDTO.getNickname());
        if (userDTO.getImage() != null) user.setImage(userDTO.getImage());
    }

    // 🔹 반려견 정보 업데이트 (null 값 체크)
    private void updatePetFields(User user, UserDTO userDTO) {
        if (userDTO.getPetName() != null) user.setPetName(userDTO.getPetName());
        if (userDTO.getPetBreed() != null) user.setPetBreed(userDTO.getPetBreed());
        if (userDTO.getPetAge() != null) user.setPetAge(userDTO.getPetAge());
        if (userDTO.getPetGender() != null) user.setPetGender(userDTO.getPetGender());
        if (userDTO.getPetPersonality() != null) user.setPetPersonality(userDTO.getPetPersonality());
    }
}
