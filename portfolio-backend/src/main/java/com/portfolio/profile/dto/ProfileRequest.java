package com.portfolio.profile.dto;

import lombok.Data;

@Data
public class ProfileRequest {
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
