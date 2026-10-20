package com.portfolio.architect.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * Represents a visitor who accessed the portfolio site.
 * Email is captured when the visitor lands on the site.
 */
@Entity
@Table(name = "visitor_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisitorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "referrer")
    private String referrer;

    @Column(name = "visited_at", nullable = false)
    private LocalDateTime visitedAt;

    @PrePersist
    protected void onPersist() {
        if (this.visitedAt == null) {
            this.visitedAt = LocalDateTime.now();
        }
    }
}
