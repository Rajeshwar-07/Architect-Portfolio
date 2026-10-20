package com.portfolio.architect.controller;

import com.portfolio.architect.dto.ApiResponse;
import com.portfolio.architect.dto.ContactRequest;
import com.portfolio.architect.entity.ContactInquiry;
import com.portfolio.architect.service.ContactService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for contact form submissions.
 */
@Slf4j
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /**
     * POST /api/contact
     * Saves a contact form inquiry to the database.
     * Called by the Contact page when visitor submits the form.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submitContact(
            @Valid @RequestBody ContactRequest request) {

        contactService.saveInquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message received. Thank you!", null));
    }

    /**
     * GET /api/contact/inquiries
     * Returns all contact inquiries (admin use).
     */
    @GetMapping("/inquiries")
    public ResponseEntity<ApiResponse<List<ContactInquiry>>> getAllInquiries() {
        List<ContactInquiry> inquiries = contactService.getAllInquiries();
        return ResponseEntity.ok(ApiResponse.success(inquiries));
    }

    /**
     * GET /api/contact/inquiries/unread
     * Returns only unread inquiries (admin use).
     */
    @GetMapping("/inquiries/unread")
    public ResponseEntity<ApiResponse<List<ContactInquiry>>> getUnreadInquiries() {
        List<ContactInquiry> inquiries = contactService.getUnreadInquiries();
        return ResponseEntity.ok(ApiResponse.success(inquiries));
    }

    /**
     * PATCH /api/contact/inquiries/{id}/read
     * Marks an inquiry as read (admin use).
     */
    @PatchMapping("/inquiries/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        contactService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read.", null));
    }
}
