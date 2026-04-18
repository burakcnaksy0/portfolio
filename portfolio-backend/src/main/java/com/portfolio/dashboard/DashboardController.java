package com.portfolio.dashboard;

import com.portfolio.blog.BlogRepository;
import com.portfolio.certificate.CertificateRepository;
import com.portfolio.common.dto.ApiResponse;
import com.portfolio.experience.ExperienceRepository;
import com.portfolio.message.MessageRepository;
import com.portfolio.project.ProjectRepository;
import com.portfolio.tag.TagRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Admin dashboard statistics")
public class DashboardController {

    private final ProjectRepository    projectRepository;
    private final BlogRepository       blogRepository;
    private final ExperienceRepository experienceRepository;
    private final CertificateRepository certificateRepository;
    private final MessageRepository    messageRepository;
    private final TagRepository        tagRepository;

    @GetMapping("/stats")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get general statistics (admin)")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<DashboardStats>> getStats() {
        DashboardStats stats = DashboardStats.builder()
                .totalProjects(projectRepository.count())
                .totalBlogPosts(blogRepository.count())
                .publishedBlogPosts(blogRepository.countPublished())
                .totalExperiences(experienceRepository.count())
                .totalCertificates(certificateRepository.count())
                .totalMessages(messageRepository.count())
                .unreadMessages(messageRepository.countByReadFalse())
                .totalTags(tagRepository.count())
                .build();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private long totalProjects;
        private long totalBlogPosts;
        private long publishedBlogPosts;
        private long totalExperiences;
        private long totalCertificates;
        private long totalMessages;
        private long unreadMessages;
        private long totalTags;
    }
}
