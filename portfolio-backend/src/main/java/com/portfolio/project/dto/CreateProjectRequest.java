package com.portfolio.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateProjectRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String githubUrl;
    private String demoUrl;
    private List<String> imageUrls;
    private boolean featured;
    private int displayOrder;
    private List<Long> tagIds;
}
