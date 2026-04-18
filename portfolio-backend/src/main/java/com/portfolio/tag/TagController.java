package com.portfolio.tag;

import com.portfolio.common.dto.ApiResponse;
import com.portfolio.common.exception.ConflictException;
import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.common.util.SlugUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Tag(name = "Tags", description = "Tag management")
public class TagController {

    private final TagRepository tagRepository;

    @GetMapping
    @Operation(summary = "Get all tags")
    public ResponseEntity<ApiResponse<List<com.portfolio.tag.Tag>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(tagRepository.findAll()));
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a tag (admin)")
    @Transactional
    public ResponseEntity<ApiResponse<com.portfolio.tag.Tag>> create(
            @Valid @RequestBody TagRequest request) {
        if (tagRepository.existsByName(request.getName())) {
            throw new ConflictException("Tag already exists: " + request.getName());
        }
        String slug = SlugUtils.toSlug(request.getName());
        com.portfolio.tag.Tag tag = com.portfolio.tag.Tag.builder()
                .name(request.getName())
                .slug(slug)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tag created", tagRepository.save(tag)));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a tag (admin)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!tagRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tag", id);
        }
        tagRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Tag deleted", null));
    }

    @Data
    public static class TagRequest {
        @NotBlank(message = "Tag name is required")
        private String name;
    }
}
