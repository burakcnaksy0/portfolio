package com.portfolio.certificate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CertificateRequest {
    @NotBlank private String title;
    @NotBlank private String issuer;
    private LocalDate issueDate;
    private String credentialUrl;
    private String imageUrl;
    private int displayOrder;
}
