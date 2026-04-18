package com.portfolio.upload;

import com.portfolio.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Tag(name = "Upload", description = "File upload via Cloudinary")
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Upload image to Cloudinary (admin)")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file) throws IOException {

        validateImageFile(file);
        String url = cloudinaryService.uploadImage(file);
        return ResponseEntity.ok(ApiResponse.success(Map.of("url", url)));
    }

    @PostMapping(value = "/cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Upload CV/PDF to Cloudinary (admin)")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadCv(
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) throw new IllegalArgumentException("File cannot be empty");
        if (!isPdf(file)) throw new IllegalArgumentException("Only PDF files are allowed");

        String url = cloudinaryService.uploadPdf(file);
        return ResponseEntity.ok(ApiResponse.success(Map.of("url", url)));
    }

    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) throw new IllegalArgumentException("File cannot be empty");
        String ct = file.getContentType();
        if (ct == null || !ct.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }
    }

    private boolean isPdf(MultipartFile file) {
        String ct = file.getContentType();
        return "application/pdf".equals(ct);
    }
}
