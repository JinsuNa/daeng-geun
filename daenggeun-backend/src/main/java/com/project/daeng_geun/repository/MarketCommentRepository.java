package com.project.daeng_geun.repository;

import com.project.daeng_geun.entity.MarketComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketCommentRepository extends JpaRepository<MarketComment, Long> {
    List<MarketComment> findByProductIdOrderByCreatedAtAsc(Long productId);
}
