package com.portfolio.architect.repository;

import com.portfolio.architect.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA repository for portfolio projects.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    /**
     * Get all featured projects.
     */
    List<Project> findByIsFeaturedTrueOrderByCreatedAtDesc();

    /**
     * Get projects by category.
     */
    List<Project> findByCategoryOrderByCreatedAtDesc(String category);

    /**
     * Get all projects ordered by creation date (newest first).
     */
    List<Project> findAllByOrderByCreatedAtDesc();
}
