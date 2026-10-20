package com.portfolio.architect.service;

import com.portfolio.architect.dto.ContactRequest;
import com.portfolio.architect.entity.ContactInquiry;
import com.portfolio.architect.repository.ContactInquiryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for handling contact form submissions.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactInquiryRepository contactInquiryRepository;

    /**
     * Saves a new contact inquiry to the database.
     */
    @Transactional
    public ContactInquiry saveInquiry(ContactRequest request) {
        ContactInquiry inquiry = ContactInquiry.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .message(request.getMessage())
                .isRead(false)
                .build();

        ContactInquiry saved = contactInquiryRepository.save(inquiry);
        log.info("New contact inquiry saved: id={}, from={}", saved.getId(), saved.getEmail());
        return saved;
    }

    /**
     * Returns all inquiries (admin use), newest first.
     */
    @Transactional(readOnly = true)
    public List<ContactInquiry> getAllInquiries() {
        return contactInquiryRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Returns only unread inquiries.
     */
    @Transactional(readOnly = true)
    public List<ContactInquiry> getUnreadInquiries() {
        return contactInquiryRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }

    /**
     * Marks an inquiry as read.
     */
    @Transactional
    public void markAsRead(Long id) {
        contactInquiryRepository.findById(id).ifPresent(inquiry -> {
            inquiry.setIsRead(true);
            contactInquiryRepository.save(inquiry);
        });
    }
}
