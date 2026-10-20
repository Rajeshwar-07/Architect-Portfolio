package com.portfolio.architect.repository;

import com.portfolio.architect.entity.ContactInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, Long> {

    /** All inquiries, newest first */
    List<ContactInquiry> findAllByOrderByCreatedAtDesc();

    /** Unread inquiries only */
    List<ContactInquiry> findByIsReadFalseOrderByCreatedAtDesc();
}
