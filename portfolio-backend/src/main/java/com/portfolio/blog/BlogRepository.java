package com.portfolio.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlugAndPublishedTrue(String slug);
    Optional<BlogPost> findBySlug(String slug);
    boolean existsBySlug(String slug);

    @Query(value = "SELECT DISTINCT b FROM BlogPost b LEFT JOIN FETCH b.tags WHERE b.published = true AND " +
            "(cast(:tagSlug as string) IS NULL OR EXISTS (SELECT t FROM b.tags t WHERE t.slug = :tagSlug)) AND " +
            "(cast(:search as string) IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) OR " +
            "LOWER(b.summary) LIKE LOWER(CONCAT('%', cast(:search as string), '%')))",
            countQuery = "SELECT COUNT(DISTINCT b) FROM BlogPost b LEFT JOIN b.tags t WHERE b.published = true AND " +
                    "(cast(:tagSlug as string) IS NULL OR t.slug = :tagSlug) AND " +
                    "(cast(:search as string) IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) OR " +
                    "LOWER(b.summary) LIKE LOWER(CONCAT('%', cast(:search as string), '%')))")
    Page<BlogPost> findPublishedWithFilters(
            @Param("tagSlug") String tagSlug,
            @Param("search") String search,
            Pageable pageable);

    Page<BlogPost> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Modifying
    @Query("UPDATE BlogPost b SET b.viewCount = b.viewCount + 1 WHERE b.id = :id")
    void incrementViewCount(@Param("id") Long id);

    @Query("SELECT COUNT(b) FROM BlogPost b WHERE b.published = true")
    long countPublished();
}
