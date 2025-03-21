package com.project.daeng_geun.dto;

import com.project.daeng_geun.entity.Match;
import com.project.daeng_geun.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ChatDTO {
    private Long id;
    private User senderId;
    private User receiverId;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    public static ChatDTO from(Match match) {
        return ChatDTO.builder()
                .senderId(match.getSender())
                .receiverId(match.getReceiver())
                .build();
    }

}