package com.project.daeng_geun.controller;

import com.project.daeng_geun.dto.LoginRequestDTO;
import com.project.daeng_geun.dto.LoginResponseDTO;
import com.project.daeng_geun.dto.UserDTO;
import com.project.daeng_geun.entity.Pet;
import com.project.daeng_geun.entity.User;
import com.project.daeng_geun.repository.PetRepository;
import com.project.daeng_geun.repository.UserRepository;
import com.project.daeng_geun.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // 🛠️ 회원가입 API (비밀번호 암호화 후 저장)
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 사용 중인 이메일입니다.");
        }

        User user = User.builder()
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword())) // 비밀번호 암호화
                .nickname(userDTO.getNickname())
                .phone(userDTO.getPhone())
                .address(userDTO.getAddress())
                .location(userDTO.getLocation())
                .build();

        userRepository.save(user);

        if (userDTO.getPets() != null && !userDTO.getPets().isEmpty()) {
            List<Pet> pets = userDTO.getPets().stream()
                    .map(petDTO -> Pet.builder()
                            .name(petDTO.getName())
                            .age(petDTO.getAge())
                            .gender(petDTO.getGender())
                            .breed(petDTO.getBreed())
                            .personality(petDTO.getPersonality())
                            .user(user) // User와 관계 설정
                            .build())
                    .collect(Collectors.toList());
//            user.setPets(pets);
            petRepository.saveAll(pets);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공!");
    }

    // 🛠️ 로그인 API (JWT 토큰 발급)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        System.out.println("로그인 요청: " + loginRequest.getEmail()); // 로그 확인

        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            System.out.println("해당 이메일의 사용자가 존재하지 않음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        User user = userOptional.get();
        System.out.println("DB에 저장된 해싱된 비밀번호: " + user.getPassword());

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            System.out.println("비밀번호 불일치");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        System.out.println("Generated Token: " + token);

        return ResponseEntity.ok().body(new LoginResponseDTO(user.getId(), user.getEmail(), user.getNickname(), token));
    }
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
//        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
//
//        if (userOptional.isPresent()) {
//            User user = userOptional.get();
//            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) { // 🔐 비밀번호 검증
//                String token = jwtUtil.generateToken(user.getEmail(), user.getId()); // 🛠️ JWT 생성
//                return ResponseEntity.ok().body(
//                        new LoginResponseDTO(user.getId(), user.getEmail(), user.getNickname(), token)
//                ); // 🔥 사용자 정보 + 토큰 반환
//            }
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 또는 비밀번호가 일치하지 않습니다.");
//    }


    // 모든 사용자 조회
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 특정 사용자 조회
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 사용자 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserDTO updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(updatedUser.getEmail());
            user.setNickname(updatedUser.getNickname());
            user.setPhone(updatedUser.getPhone());
            user.setAddress(updatedUser.getAddress());
            user.setLocation(updatedUser.getLocation());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 사용자 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
