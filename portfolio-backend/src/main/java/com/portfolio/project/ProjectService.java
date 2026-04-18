package com.portfolio.project;

import com.portfolio.common.dto.PageResponse;
import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.common.util.SlugUtils;
import com.portfolio.project.dto.CreateProjectRequest;
import com.portfolio.project.dto.ProjectResponse;
import com.portfolio.project.dto.UpdateProjectRequest;
import com.portfolio.tag.Tag;
import com.portfolio.tag.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public PageResponse<ProjectResponse> getAll(String tagSlug, Pageable pageable) {
        Page<Project> page = projectRepository.findAllWithTagFilter(tagSlug, pageable);
        return PageResponse.of(page.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getFeatured() {
        return projectRepository.findFeaturedProjects().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "slug", slug));
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse create(CreateProjectRequest request) {
        String slug = generateUniqueSlug(request.getTitle());
        Set<Tag> tags = resolveTags(request.getTagIds());

        Project project = Project.builder()
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .githubUrl(request.getGithubUrl())
                .demoUrl(request.getDemoUrl())
                .imageUrls(request.getImageUrls() != null ? request.getImageUrls() : new java.util.ArrayList<>())
                .featured(request.isFeatured())
                .displayOrder(request.getDisplayOrder())
                .tags(tags)
                .build();

        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));

        if (request.getTitle() != null && !request.getTitle().equals(project.getTitle())) {
            project.setTitle(request.getTitle());
            project.setSlug(generateUniqueSlug(request.getTitle()));
        }
        if (request.getDescription() != null)  project.setDescription(request.getDescription());
        if (request.getGithubUrl()   != null)  project.setGithubUrl(request.getGithubUrl());
        if (request.getDemoUrl()     != null)  project.setDemoUrl(request.getDemoUrl());
        if (request.getImageUrls()   != null)  project.setImageUrls(request.getImageUrls());
        if (request.getFeatured()    != null)  project.setFeatured(request.getFeatured());
        if (request.getDisplayOrder()!= null)  project.setDisplayOrder(request.getDisplayOrder());
        if (request.getTagIds()      != null)  project.setTags(resolveTags(request.getTagIds()));

        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", id);
        }
        projectRepository.deleteById(id);
    }

    private String generateUniqueSlug(String title) {
        int attempt = 1;
        String slug;
        do {
            slug = SlugUtils.toUniqueSlug(title, attempt++);
        } while (projectRepository.existsBySlug(slug));
        return slug;
    }

    private Set<Tag> resolveTags(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) return new HashSet<>();
        return new HashSet<>(tagRepository.findAllById(tagIds));
    }

    private ProjectResponse toResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .slug(project.getSlug())
                .description(project.getDescription())
                .githubUrl(project.getGithubUrl())
                .demoUrl(project.getDemoUrl())
                .imageUrls(project.getImageUrls() != null ? project.getImageUrls() : new java.util.ArrayList<>())
                .featured(project.isFeatured())
                .displayOrder(project.getDisplayOrder())
                .tags(project.getTags().stream()
                        .map(t -> ProjectResponse.TagDto.builder()
                                .id(t.getId())
                                .name(t.getName())
                                .slug(t.getSlug())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
