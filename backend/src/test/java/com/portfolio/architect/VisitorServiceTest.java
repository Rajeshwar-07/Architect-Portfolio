package com.portfolio.architect;

import com.portfolio.architect.entity.VisitorLog;
import com.portfolio.architect.repository.VisitorLogRepository;
import com.portfolio.architect.service.VisitorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for VisitorService.
 */
class VisitorServiceTest {

    @Mock
    private VisitorLogRepository visitorLogRepository;

    @InjectMocks
    private VisitorService visitorService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLogVisitor_NewVisitor_ReturnsTrueAndSaves() {
        // Given
        when(visitorLogRepository.existsByEmailAndVisitedAtAfter(anyString(), any(LocalDateTime.class)))
                .thenReturn(false);
        when(visitorLogRepository.save(any(VisitorLog.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        boolean result = visitorService.logVisitor(
                "test@example.com", "127.0.0.1", "Mozilla/5.0", null);

        // Then
        assertTrue(result, "Should return true for a new visitor");
        verify(visitorLogRepository, times(1)).save(any(VisitorLog.class));
    }

    @Test
    void testLogVisitor_ExistingVisitorToday_ReturnsFalseAndDoesNotSave() {
        // Given
        when(visitorLogRepository.existsByEmailAndVisitedAtAfter(anyString(), any(LocalDateTime.class)))
                .thenReturn(true);

        // When
        boolean result = visitorService.logVisitor(
                "existing@example.com", "127.0.0.1", "Mozilla/5.0", null);

        // Then
        assertFalse(result, "Should return false for already-logged visitor today");
        verify(visitorLogRepository, never()).save(any(VisitorLog.class));
    }

    @Test
    void testGetUniqueVisitorCount() {
        // Given
        when(visitorLogRepository.countDistinctEmails()).thenReturn(42L);

        // When
        long count = visitorService.getUniqueVisitorCount();

        // Then
        assertEquals(42L, count);
    }
}
