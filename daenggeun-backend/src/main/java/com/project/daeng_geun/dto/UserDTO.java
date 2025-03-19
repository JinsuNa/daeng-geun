package com.project.daeng_geun.dto;

import com.project.daeng_geun.entity.User;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserDTO {
    private Long id;
    private String email;
    private String password;
    private String repeatPassword;
    private String username;
    private String phone;
    private String address;
    private String location;
    private String petName;
    private String petBreed;
    private Integer petAge;
    private String petGender;
    private String petPersonality;
    private String image;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .username(user.getNickname())
                .address(user.getAddress())
                .location(user.getLocation())
                .petName(user.getPetName())
                .petBreed(user.getPetBreed())
                .petAge(user.getPetAge())
                .petGender(user.getPetGender())
                .petPersonality(user.getPetPersonality())
                .build();
    }

    //    Dto -> entity 변환
    public User toEntity() {
        return User.builder()
                .email(this.email)
                .password(this.password)
                .nickname(this.username)
                .address(this.address)
                .location(this.location)
                .petName(this.petName)
                .petBreed(this.petBreed)
                .petAge(this.petAge)
                .petGender(this.petGender)
                .petPersonality(this.petPersonality)
                .build();
    }
}
