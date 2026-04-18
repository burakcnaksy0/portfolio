package com.portfolio.blog.dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateBlogPostRequest {
    private String title;
    private String content;
    private String summary;
    private String coverImageUrl;
    private Boolean published;
    private List<Long> tagIds;
}
