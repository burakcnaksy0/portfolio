package com.portfolio.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Message> findByReadFalseOrderByCreatedAtDesc(Pageable pageable);
    long countByReadFalse();
}
