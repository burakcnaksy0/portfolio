package com.portfolio.profile.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private String fullName;
    private String title;
    private String about;
    private String githubUrl;
    private String linkedinUrl;
    private String gitlabUrl;
    private String twitterUrl;
    private String cvUrl;
    private String publicEmail;
}
