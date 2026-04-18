package com.portfolio.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateBlogPostRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String summary;
    private String coverImageUrl;
    private boolean published;
    private List<Long> tagIds;
}
