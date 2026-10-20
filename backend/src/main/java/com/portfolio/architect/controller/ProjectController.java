package com.portfolio.architect.controller;

import com.portfolio.architect.dto.ApiResponse;
import com.portfolio.architect.dto.ProjectDTO;
import com.portfolio.architect.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * REST controller for managing portfolio projects.
 * Supports CRUD operations and image uploads.
 */
@Slf4j
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // -------------------------------------------------------------------------
    // Public endpoints (visible to all visitors)
    // -------------------------------------------------------------------------

    /**
     * GET /api/projects
     * Returns all projects (newest first).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    /**
     * GET /api/projects/{id}
     * Returns a single project with all its images.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProject(@PathVariable Long id) {
        ProjectDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    /**
     * GET /api/projects/featured
     * Returns only featured projects (used on the home page).
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getFeaturedProjects() {
        List<ProjectDTO> projects = projectService.getFeaturedProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    /**
     * GET /api/projects/category/{category}
     * Returns projects filtered by category.
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getByCategory(
            @PathVariable String category) {
        List<ProjectDTO> projects = projectService.getProjectsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    // -------------------------------------------------------------------------
    // Admin endpoints (for the portfolio owner to manage content)
    // Note: In production, protect these with Spring Security
    // -------------------------------------------------------------------------

    /**
     * POST /api/projects
     * Creates a new project with optional image files.
     * Uses multipart/form-data to support file uploads.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "isFeatured", defaultValue = "false") Boolean isFeatured,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {

        ProjectDTO created = projectService.createProject(
                title, description, category, location, year, isFeatured, images);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully.", created));
    }

    /**
     * PUT /api/projects/{id}
     * Updates project metadata (not images).
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> updateProject(
            @PathVariable Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "isFeatured", required = false) Boolean isFeatured
    ) {
        ProjectDTO updated = projectService.updateProject(
                id, title, description, category, location, year, isFeatured);
        return ResponseEntity.ok(ApiResponse.success("Project updated.", updated));
    }

    /**
     * POST /api/projects/{id}/images
     * Adds images to an existing project.
     */
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProjectDTO>> addImages(
            @PathVariable Long id,
            @RequestPart("images") List<MultipartFile> images
    ) throws IOException {
        ProjectDTO updated = projectService.addImagesToProject(id, images);
        return ResponseEntity.ok(ApiResponse.success("Images added.", updated));
    }

    /**
     * DELETE /api/projects/{id}
     * Deletes a project and all its associated images.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted.", null));
    }
}
