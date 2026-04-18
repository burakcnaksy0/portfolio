package com.portfolio.blog;

import com.portfolio.blog.dto.BlogPostResponse;
import com.portfolio.blog.dto.CreateBlogPostRequest;
import com.portfolio.blog.dto.UpdateBlogPostRequest;
import com.portfolio.common.dto.PageResponse;
import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.common.util.SlugUtils;
import com.portfolio.tag.Tag;
import com.portfolio.tag.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public PageResponse<BlogPostResponse> getPublished(String tagSlug, String search, Pageable pageable) {
        String tagParam    = (tagSlug != null && !tagSlug.isBlank()) ? tagSlug : null;
        String searchParam = (search  != null && !search.isBlank())  ? search  : null;
        Page<BlogPost> page = blogRepository.findPublishedWithFilters(tagParam, searchParam, pageable);
        return PageResponse.of(page.map(this::toResponse));
    }

    @Transactional
    public BlogPostResponse getBySlug(String slug) {
        BlogPost post = blogRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post", "slug", slug));
        blogRepository.incrementViewCount(post.getId());
        post.setViewCount(post.getViewCount() + 1);
        return toResponse(post);
    }

    @Transactional(readOnly = true)
    public PageResponse<BlogPostResponse> getAllAdmin(Pageable pageable) {
        Page<BlogPost> page = blogRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.of(page.map(this::toResponse));
    }

    @Transactional
    public BlogPostResponse create(CreateBlogPostRequest request) {
        String slug = generateUniqueSlug(request.getTitle());
        Set<Tag> tags = resolveTags(request.getTagIds());
        LocalDateTime publishedAt = request.isPublished() ? LocalDateTime.now() : null;

        BlogPost post = BlogPost.builder()
                .title(request.getTitle())
                .slug(slug)
                .summary(request.getSummary())
                .content(request.getContent())
                .coverImageUrl(request.getCoverImageUrl())
                .published(request.isPublished())
                .publishedAt(publishedAt)
                .tags(tags)
                .build();

        return toResponse(blogRepository.save(post));
    }

    @Transactional
    public BlogPostResponse update(Long id, UpdateBlogPostRequest request) {
        BlogPost post = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post", id));

        if (request.getTitle() != null && !request.getTitle().equals(post.getTitle())) {
            post.setTitle(request.getTitle());
            post.setSlug(generateUniqueSlug(request.getTitle()));
        }
        if (request.getContent()       != null) post.setContent(request.getContent());
        if (request.getSummary()       != null) post.setSummary(request.getSummary());
        if (request.getCoverImageUrl() != null) post.setCoverImageUrl(request.getCoverImageUrl());
        if (request.getTagIds()        != null) post.setTags(resolveTags(request.getTagIds()));
        if (request.getPublished()     != null) {
            post.setPublished(request.getPublished());
            if (request.getPublished() && post.getPublishedAt() == null) {
                post.setPublishedAt(LocalDateTime.now());
            }
        }

        return toResponse(blogRepository.save(post));
    }

    @Transactional
    public void delete(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog post", id);
        }
        blogRepository.deleteById(id);
    }

    private String generateUniqueSlug(String title) {
        int attempt = 1;
        String slug;
        do {
            slug = SlugUtils.toUniqueSlug(title, attempt++);
        } while (blogRepository.existsBySlug(slug));
        return slug;
    }

    private Set<Tag> resolveTags(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) return new HashSet<>();
        return new HashSet<>(tagRepository.findAllById(tagIds));
    }

    BlogPostResponse toResponse(BlogPost post) {
        return BlogPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .summary(post.getSummary())
                .content(post.getContent())
                .coverImageUrl(post.getCoverImageUrl())
                .viewCount(post.getViewCount())
                .published(post.isPublished())
                .publishedAt(post.getPublishedAt())
                .tags(post.getTags().stream()
                        .map(t -> BlogPostResponse.TagDto.builder()
                                .id(t.getId())
                                .name(t.getName())
                                .slug(t.getSlug())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
