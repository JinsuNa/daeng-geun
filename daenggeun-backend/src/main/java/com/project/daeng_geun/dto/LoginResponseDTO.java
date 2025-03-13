package com.project.daeng_geun.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDTO {
    private Long userId;
    private String email;
    private String nickname;
    private String token;
}
