package com.portfolio.certificate;

import com.portfolio.certificate.dto.CertificateRequest;
import com.portfolio.common.dto.ApiResponse;
import com.portfolio.common.exception.ResourceNotFoundException;
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

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Tag(name = "Certificates", description = "Certificate management")
public class CertificateController {

    private final CertificateRepository certRepo;

    @GetMapping
    @Operation(summary = "Get all certificates (public)")
    public ResponseEntity<ApiResponse<List<Certificate>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(certRepo.findAllByOrderByDisplayOrderAsc()));
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Transactional
    public ResponseEntity<ApiResponse<Certificate>> create(@Valid @RequestBody CertificateRequest r) {
        Certificate cert = Certificate.builder()
                .title(r.getTitle()).issuer(r.getIssuer()).issueDate(r.getIssueDate())
                .credentialUrl(r.getCredentialUrl()).imageUrl(r.getImageUrl())
                .displayOrder(r.getDisplayOrder()).build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certificate created", certRepo.save(cert)));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Transactional
    public ResponseEntity<ApiResponse<Certificate>> update(
            @PathVariable Long id, @Valid @RequestBody CertificateRequest r) {
        Certificate cert = certRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", id));
        cert.setTitle(r.getTitle()); cert.setIssuer(r.getIssuer());
        cert.setIssueDate(r.getIssueDate()); cert.setCredentialUrl(r.getCredentialUrl());
        cert.setImageUrl(r.getImageUrl()); cert.setDisplayOrder(r.getDisplayOrder());
        return ResponseEntity.ok(ApiResponse.success("Updated", certRepo.save(cert)));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!certRepo.existsById(id)) throw new ResourceNotFoundException("Certificate", id);
        certRepo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
