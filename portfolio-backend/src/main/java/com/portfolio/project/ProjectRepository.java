package com.portfolio.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.tags WHERE p.featured = true ORDER BY p.displayOrder ASC")
    java.util.List<Project> findFeaturedProjects();

    @Query(value = "SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.tags WHERE " +
            "(cast(:tagSlug as string) IS NULL OR EXISTS (SELECT t FROM p.tags t WHERE t.slug = :tagSlug))",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Project p LEFT JOIN p.tags t WHERE " +
                    "(cast(:tagSlug as string) IS NULL OR t.slug = :tagSlug)")
    Page<Project> findAllWithTagFilter(@Param("tagSlug") String tagSlug, Pageable pageable);
}
