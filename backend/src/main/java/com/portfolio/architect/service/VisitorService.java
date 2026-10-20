package com.portfolio.architect.service;

import com.portfolio.architect.entity.VisitorLog;
import com.portfolio.architect.repository.VisitorLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service layer for visitor tracking logic.
 * Captures visitor email on portfolio landing to enable outreach.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorLogRepository visitorLogRepository;

    /**
     * Logs a visitor's email.
     * De-duplicates: does not log the same email more than once per day.
     *
     * @param email     Visitor's email address.
     * @param ipAddress Request IP address.
     * @param userAgent Request User-Agent header.
     * @param referrer  HTTP Referer header.
     * @return true if a new entry was created, false if already logged today.
     */
    @Transactional
    public boolean logVisitor(String email, String ipAddress, String userAgent, String referrer) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();

        boolean alreadyLoggedToday = visitorLogRepository
                .existsByEmailAndVisitedAtAfter(email, startOfDay);

        if (alreadyLoggedToday) {
            log.debug("Visitor already logged today: {}", email);
            return false;
        }

        VisitorLog log = VisitorLog.builder()
                .email(email)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .referrer(referrer)
                .build();

        visitorLogRepository.save(visitorLog);
        log.info("New visitor logged: {}", email);
        return true;
    }

    /**
     * Returns all distinct visitor emails for the portfolio owner.
     */
    @Transactional(readOnly = true)
    public List<String> getAllVisitorEmails() {
        return visitorLogRepository.findAllDistinctEmails();
    }

    /**
     * Returns the total count of distinct visitors.
     */
    @Transactional(readOnly = true)
    public long getUniqueVisitorCount() {
        return visitorLogRepository.countDistinctEmails();
    }

    /**
     * Returns all visitor logs (for admin dashboard use).
     */
    @Transactional(readOnly = true)
    public List<VisitorLog> getAllVisitorLogs() {
        return visitorLogRepository.findAll();
    }
}
