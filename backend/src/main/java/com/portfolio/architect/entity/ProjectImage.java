package com.portfolio.architect.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Represents an image associated with a portfolio project.
 */
@Entity
@Table(name = "project_images")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "original_name")
    private String originalName;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
}
