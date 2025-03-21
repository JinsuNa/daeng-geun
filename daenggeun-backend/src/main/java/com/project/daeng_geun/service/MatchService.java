package com.project.daeng_geun.service;

import com.project.daeng_geun.dto.ChatDTO;
import com.project.daeng_geun.dto.MatchDTO;
import com.project.daeng_geun.dto.MatchRequestDTO;
import com.project.daeng_geun.dto.SenderReceiverDTO;
import com.project.daeng_geun.entity.Match;
import com.project.daeng_geun.entity.User;
import com.project.daeng_geun.repository.MatchRepository;
import com.project.daeng_geun.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;
    private final Set<Long> previousUserIds = new HashSet<>();

    //    user db에서 랜덤한 사용자 2명 가져오기
    @Transactional
    public List<MatchDTO> getRandomUsers() {

        List<User> selectedUsers = userRepository.findRandomUsers();

        selectedUsers = selectedUsers.stream()
                .filter(user -> !previousUserIds.contains(user.getId()))
                .collect(Collectors.toList());

        if (selectedUsers.size() < 2) {
            previousUserIds.clear();
            selectedUsers = userRepository.findRandomUsers();
        }

        selectedUsers.forEach(user -> previousUserIds.add(user.getId()));

        return selectedUsers.stream()
                .map(MatchDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    //    선택한 강아지 like 증가
    public MatchDTO likeCount(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("아이디를 찾을 수 없습니다."));
        if (user.getLikeCount() == null) {
            user.setLikeCount(0L);
        }

        user.setLikeCount(user.getLikeCount() + 1);
        userRepository.save(user);
        return MatchDTO.fromEntity(user);
    }

    //    강아지 like 조회
    public MatchDTO getLike(Long id) {
        return userRepository.findById(id)
                .map(MatchDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("아이디를 찾을 수 없습니다"));
    }

    //    top3 강아지 추출
    public List<MatchDTO> getTopLikeCount() {
        List<User> topDogs = userRepository.topLikeCount();
        return topDogs.stream()
                .map(MatchDTO::fromEntity)
                .collect(Collectors.toList());
    }

    //    매칭된 댕댕이 리스트 보기
    public List<SenderReceiverDTO> getMatch(Long senderId) {
        User user = userRepository.findById(senderId).orElseThrow((() -> new RuntimeException("사용자를 찾을 수 없습니다.")));
        List<Match> matches = matchRepository.findBySenderOrReceiver(user);

        return matches.stream()
                .map(match -> {
                    if (match.getSender().equals(user)) {
                        return SenderReceiverDTO.fromEntity(match.getReceiver());
                    } else {
                        return SenderReceiverDTO.fromEntity(match.getSender());
                    }
                })
                .collect(Collectors.toList());

    }

    //    매칭 신청하기
    @Transactional
    public ChatDTO createMatch(MatchRequestDTO matchRequestDto) {
        // sender와 receiver를 DB에서 찾기
        User sender = userRepository.findById(matchRequestDto.getSenderId())
                .orElseThrow(() -> new EntityNotFoundException("Sender not found"));
        User receiver = userRepository.findById(matchRequestDto.getReceiverId())
                .orElseThrow(() -> new EntityNotFoundException("Receiver not found"));

        // Match 객체 생성 및 저장
        Match match = Match.builder()
                .sender(sender)
                .receiver(receiver)
                .status("SENT") // 기본 상태 설정
                .build();

        Match savedMatch = matchRepository.save(match);

        return ChatDTO.from(savedMatch);
    }

    //    삭제 기능
    public void deleteMatch(Long senderId, Long receiverId) {
        List<Match> matches = matchRepository.findMatchByUsers(senderId, receiverId);
        if (matches.isEmpty()) {
            throw new RuntimeException("해당 매칭을 찾을 수 없습니다.");
        }

        matchRepository.deleteAll(matches);

    }
}


