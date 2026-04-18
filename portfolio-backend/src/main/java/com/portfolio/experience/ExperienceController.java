package com.portfolio.experience;

import com.portfolio.common.dto.ApiResponse;
import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.experience.dto.ExperienceRequest;
import com.portfolio.experience.dto.ExperienceResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/experiences")
@RequiredArgsConstructor
@Tag(name = "Experiences", description = "Work experience management")
public class ExperienceController {

    private final ExperienceRepository experienceRepository;

    @GetMapping
    @Operation(summary = "Get all experiences (public)")
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> getAll() {
        List<ExperienceResponse> list = experienceRepository
                .findAllByOrderByDisplayOrderAscStartDateDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create experience (admin)")
    @Transactional
    public ResponseEntity<ApiResponse<ExperienceResponse>> create(
            @Valid @RequestBody ExperienceRequest request) {
        Experience exp = from(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Experience created", toResponse(experienceRepository.save(exp))));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update experience (admin)")
    @Transactional
    public ResponseEntity<ApiResponse<ExperienceResponse>> update(
            @PathVariable Long id, @Valid @RequestBody ExperienceRequest request) {
        Experience exp = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", id));
        updateFrom(exp, request);
        return ResponseEntity.ok(ApiResponse.success("Updated", toResponse(experienceRepository.save(exp))));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete experience (admin)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!experienceRepository.existsById(id)) throw new ResourceNotFoundException("Experience", id);
        experienceRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    private Experience from(ExperienceRequest r) {
        return Experience.builder()
                .company(r.getCompany()).position(r.getPosition())
                .description(r.getDescription()).startDate(r.getStartDate())
                .endDate(r.getEndDate()).current(r.isCurrent())
                .location(r.getLocation()).companyLogoUrl(r.getCompanyLogoUrl())
                .displayOrder(r.getDisplayOrder()).build();
    }

    private void updateFrom(Experience exp, ExperienceRequest r) {
        exp.setCompany(r.getCompany()); exp.setPosition(r.getPosition());
        exp.setDescription(r.getDescription()); exp.setStartDate(r.getStartDate());
        exp.setEndDate(r.getEndDate()); exp.setCurrent(r.isCurrent());
        exp.setLocation(r.getLocation()); exp.setCompanyLogoUrl(r.getCompanyLogoUrl());
        exp.setDisplayOrder(r.getDisplayOrder());
    }

    private ExperienceResponse toResponse(Experience exp) {
        return ExperienceResponse.builder()
                .id(exp.getId()).company(exp.getCompany()).position(exp.getPosition())
                .description(exp.getDescription()).startDate(exp.getStartDate())
                .endDate(exp.getEndDate()).current(exp.isCurrent())
                .location(exp.getLocation()).companyLogoUrl(exp.getCompanyLogoUrl())
                .displayOrder(exp.getDisplayOrder()).build();
    }
}
