package com.portfolio.architect.controller;

import com.portfolio.architect.dto.ApiResponse;
import com.portfolio.architect.dto.VisitorRequest;
import com.portfolio.architect.service.VisitorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for visitor tracking.
 * Called by the frontend when a visitor lands on the portfolio site.
 */
@Slf4j
@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
public class VisitorController {

    private final VisitorService visitorService;

    /**
     * POST /api/visitors/track
     * Logs a visitor's email when they land on the site.
     * The React frontend calls this after the visitor provides their email.
     */
    @PostMapping("/track")
    public ResponseEntity<ApiResponse<String>> trackVisitor(
            @Valid @RequestBody VisitorRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = extractClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        String referrer = httpRequest.getHeader("Referer");

        boolean isNew = visitorService.logVisitor(
                request.getEmail(), ipAddress, userAgent, referrer);

        String message = isNew
                ? "Welcome! Your visit has been noted."
                : "Welcome back!";

        return ResponseEntity.ok(ApiResponse.success(message, request.getEmail()));
    }

    /**
     * GET /api/visitors/emails
     * Returns all unique visitor emails (for the portfolio owner).
     * In production, secure this endpoint with authentication.
     */
    @GetMapping("/emails")
    public ResponseEntity<ApiResponse<List<String>>> getVisitorEmails() {
        List<String> emails = visitorService.getAllVisitorEmails();
        return ResponseEntity.ok(ApiResponse.success("Visitor emails retrieved.", emails));
    }

    /**
     * GET /api/visitors/stats
     * Returns visitor statistics summary.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("uniqueVisitors", visitorService.getUniqueVisitorCount());
        return ResponseEntity.ok(ApiResponse.success("Stats retrieved.", stats));
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Extracts real client IP from forwarded headers (for proxy/load-balancer scenarios).
     */
    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
