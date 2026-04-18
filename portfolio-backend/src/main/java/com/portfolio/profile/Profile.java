package com.portfolio.profile;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {
    @Id
    private Long id;

    private String fullName;
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String about;
    
    private String githubUrl;
    private String linkedinUrl;
    private String gitlabUrl;
    private String twitterUrl;
    private String cvUrl;
    private String publicEmail;
}
