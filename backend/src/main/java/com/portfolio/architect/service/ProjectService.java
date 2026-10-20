package com.portfolio.architect.service;

import com.portfolio.architect.dto.ProjectDTO;
import com.portfolio.architect.entity.Project;
import com.portfolio.architect.entity.ProjectImage;
import com.portfolio.architect.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for portfolio project management.
 * Handles CRUD operations and image uploads for architecture projects.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final FileStorageService fileStorageService;

    // -------------------------------------------------------------------------
    // Read operations
    // -------------------------------------------------------------------------

    /**
     * Returns all projects ordered by most recently created.
     */
    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns a single project by ID.
     */
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long id) {
        Project project = findProjectOrThrow(id);
        return toDTO(project);
    }

    /**
     * Returns all featured projects.
     */
    @Transactional(readOnly = true)
    public List<ProjectDTO> getFeaturedProjects() {
        return projectRepository.findByIsFeaturedTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns all projects in a given category.
     */
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByCategory(String category) {
        return projectRepository.findByCategoryOrderByCreatedAtDesc(category)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------------
    // Write operations
    // -------------------------------------------------------------------------

    /**
     * Creates a new project with optional initial images.
     */
    @Transactional
    public ProjectDTO createProject(String title,
                                    String description,
                                    String category,
                                    String location,
                                    Integer year,
                                    Boolean isFeatured,
                                    List<MultipartFile> images) throws IOException {

        Project project = Project.builder()
                .title(title)
                .description(description)
                .category(category)
                .location(location)
                .year(year)
                .isFeatured(isFeatured != null ? isFeatured : false)
                .images(new ArrayList<>())
                .build();

        project = projectRepository.save(project);

        if (images != null && !images.isEmpty()) {
            storeImages(project, images);
            project = projectRepository.save(project);
        }

        log.info("Project created: id={}, title={}", project.getId(), project.getTitle());
        return toDTO(project);
    }

    /**
     * Updates an existing project's metadata.
     */
    @Transactional
    public ProjectDTO updateProject(Long id,
                                    String title,
                                    String description,
                                    String category,
                                    String location,
                                    Integer year,
                                    Boolean isFeatured) {

        Project project = findProjectOrThrow(id);

        if (title != null && !title.isEmpty()) project.setTitle(title);
        if (description != null) project.setDescription(description);
        if (category != null) project.setCategory(category);
        if (location != null) project.setLocation(location);
        if (year != null) project.setYear(year);
        if (isFeatured != null) project.setIsFeatured(isFeatured);

        project = projectRepository.save(project);
        log.info("Project updated: id={}", id);
        return toDTO(project);
    }

    /**
     * Adds images to an existing project.
     */
    @Transactional
    public ProjectDTO addImagesToProject(Long projectId, List<MultipartFile> files) throws IOException {
        Project project = findProjectOrThrow(projectId);
        storeImages(project, files);
        project = projectRepository.save(project);
        return toDTO(project);
    }

    /**
     * Deletes a project and all its associated images from disk.
     */
    @Transactional
    public void deleteProject(Long id) {
        Project project = findProjectOrThrow(id);

        // Remove image files from disk
        project.getImages().forEach(img -> fileStorageService.delete(img.getFilePath()));

        projectRepository.delete(project);
        log.info("Project deleted: id={}", id);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private Project findProjectOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    private void storeImages(Project project, List<MultipartFile> files) throws IOException {
        int sortOrder = project.getImages().size();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String filePath = fileStorageService.store(file, "projects/" + project.getId());

                ProjectImage image = ProjectImage.builder()
                        .project(project)
                        .fileName(file.getOriginalFilename())
                        .filePath(filePath)
                        .originalName(file.getOriginalFilename())
                        .altText(project.getTitle())
                        .sortOrder(sortOrder++)
                        .build();

                project.getImages().add(image);
            }
        }
    }

    private ProjectDTO toDTO(Project project) {
        List<ProjectDTO.ProjectImageDTO> imageDTOs = project.getImages().stream()
                .map(img -> ProjectDTO.ProjectImageDTO.builder()
                        .id(img.getId())
                        .fileName(img.getFileName())
                        .filePath(img.getFilePath())
                        .altText(img.getAltText())
                        .sortOrder(img.getSortOrder())
                        .build())
                .collect(Collectors.toList());

        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .category(project.getCategory())
                .location(project.getLocation())
                .year(project.getYear())
                .isFeatured(project.getIsFeatured())
                .images(imageDTOs)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
