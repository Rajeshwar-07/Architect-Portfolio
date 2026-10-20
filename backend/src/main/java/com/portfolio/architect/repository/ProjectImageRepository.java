package com.portfolio.architect.repository;

import com.portfolio.architect.entity.ProjectImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA repository for project images.
 */
@Repository
public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {

    List<ProjectImage> findByProjectIdOrderBySortOrderAsc(Long projectId);

    void deleteByProjectId(Long projectId);
}
