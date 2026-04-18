package com.portfolio.blog;

import com.portfolio.blog.dto.BlogPostResponse;
import com.portfolio.blog.dto.CreateBlogPostRequest;
import com.portfolio.blog.dto.UpdateBlogPostRequest;
import com.portfolio.common.dto.ApiResponse;
import com.portfolio.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
@Tag(name = "Blog", description = "Blog post management")
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    @Operation(summary = "Get published blog posts with search/tag filter and pagination")
    public ResponseEntity<ApiResponse<PageResponse<BlogPostResponse>>> getPublished(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        return ResponseEntity.ok(ApiResponse.success(blogService.getPublished(tag, search, pageable)));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get blog post by slug (increments view count)")
    public ResponseEntity<ApiResponse<BlogPostResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(blogService.getBySlug(slug)));
    }

    @GetMapping("/admin/all")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all blog posts including drafts (admin)")
    public ResponseEntity<ApiResponse<PageResponse<BlogPostResponse>>> getAllAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(blogService.getAllAdmin(pageable)));
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create blog post (admin)")
    public ResponseEntity<ApiResponse<BlogPostResponse>> create(
            @Valid @RequestBody CreateBlogPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Blog post created", blogService.create(request)));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update blog post (admin)")
    public ResponseEntity<ApiResponse<BlogPostResponse>> update(
            @PathVariable Long id,
            @RequestBody UpdateBlogPostRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Blog post updated", blogService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete blog post (admin)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Blog post deleted", null));
    }
}
