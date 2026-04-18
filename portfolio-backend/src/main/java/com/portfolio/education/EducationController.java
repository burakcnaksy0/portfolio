package com.portfolio.education;

import com.portfolio.common.dto.ApiResponse;
import com.portfolio.education.dto.EducationRequest;
import com.portfolio.education.dto.EducationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/education")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EducationResponse>>> getAllEducation() {
        return ResponseEntity.ok(ApiResponse.success("Education records fetched", educationService.getAllEducation()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EducationResponse>> createEducation(@RequestBody EducationRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Education record created", educationService.createEducation(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EducationResponse>> updateEducation(@PathVariable Long id, @RequestBody EducationRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Education record updated", educationService.updateEducation(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        educationService.deleteEducation(id);
        return ResponseEntity.noContent().build();
    }
}
