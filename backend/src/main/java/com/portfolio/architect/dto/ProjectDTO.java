package com.portfolio.architect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for a portfolio project.
 * Used in API responses to avoid exposing JPA entity internals.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String location;
    private Integer year;
    private Boolean isFeatured;
    private List<ProjectImageDTO> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectImageDTO {
        private Long id;
        private String fileName;
        private String filePath;    // Relative URL path e.g. /uploads/filename.jpg
        private String altText;
        private Integer sortOrder;
    }
}
