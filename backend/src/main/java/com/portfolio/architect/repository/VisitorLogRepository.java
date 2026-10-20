package com.portfolio.architect.repository;

import com.portfolio.architect.entity.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * JPA repository for visitor log persistence.
 */
@Repository
public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {

    /**
     * Check if email was already logged today (avoid duplicate entries per day).
     */
    boolean existsByEmailAndVisitedAtAfter(String email, LocalDateTime since);

    /**
     * Count unique emails (distinct visitors).
     */
    @Query("SELECT COUNT(DISTINCT v.email) FROM VisitorLog v")
    long countDistinctEmails();

    /**
     * Get all visitors within a date range.
     */
    List<VisitorLog> findByVisitedAtBetween(LocalDateTime from, LocalDateTime to);

    /**
     * Get all unique emails — for export.
     */
    @Query("SELECT DISTINCT v.email FROM VisitorLog v ORDER BY v.email ASC")
    List<String> findAllDistinctEmails();
}
