package com.portfolio.profile;

import com.portfolio.profile.dto.ProfileRequest;
import com.portfolio.profile.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    private Profile getOrCreateProfile() {
        return profileRepository.findById(1L).orElseGet(() -> {
            Profile p = new Profile();
            p.setId(1L);
            return p;
        });
    }

    public ProfileResponse getProfile() {
        Profile p = getOrCreateProfile();
        return ProfileResponse.builder()
                .fullName(p.getFullName())
                .title(p.getTitle())
                .about(p.getAbout())
                .githubUrl(p.getGithubUrl())
                .linkedinUrl(p.getLinkedinUrl())
                .gitlabUrl(p.getGitlabUrl())
                .twitterUrl(p.getTwitterUrl())
                .cvUrl(p.getCvUrl())
                .publicEmail(p.getPublicEmail())
                .build();
    }

    @Transactional
    public ProfileResponse updateProfile(ProfileRequest req) {
        Profile p = getOrCreateProfile();
        p.setFullName(req.getFullName());
        p.setTitle(req.getTitle());
        p.setAbout(req.getAbout());
        p.setGithubUrl(req.getGithubUrl());
        p.setLinkedinUrl(req.getLinkedinUrl());
        p.setGitlabUrl(req.getGitlabUrl());
        p.setTwitterUrl(req.getTwitterUrl());
        p.setCvUrl(req.getCvUrl());
        p.setPublicEmail(req.getPublicEmail());
        
        profileRepository.save(p);
        return getProfile();
    }
}
