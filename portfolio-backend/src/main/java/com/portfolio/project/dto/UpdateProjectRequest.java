package com.portfolio.project.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProjectRequest {
    private String title;
    private String description;
    private String githubUrl;
    private String demoUrl;
    private List<String> imageUrls;
    private Boolean featured;
    private Integer displayOrder;
    private List<Long> tagIds;
}
