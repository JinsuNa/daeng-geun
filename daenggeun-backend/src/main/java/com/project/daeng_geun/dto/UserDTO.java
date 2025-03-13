package com.project.daeng_geun.dto;

import com.project.daeng_geun.entity.Pet;
import com.project.daeng_geun.entity.User;
import jakarta.persistence.Column;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserDTO {
    private Long id;
    private String email;
    private String password;
    private String nickname;
    private String phone;
    private String address;
    private String location;
    private List<PetDTO> pets;


    private static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .address(user.getAddress())
                .location(user.getLocation())
                .pets(user.getPets().stream().map(PetDTO::fromEntity).collect(Collectors.toList()))
                .build();
    }
}
