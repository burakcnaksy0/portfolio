package com.portfolio.profile;

import com.portfolio.common.dto.ApiResponse;
import com.portfolio.profile.dto.ProfileRequest;
import com.portfolio.profile.dto.ProfileResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Personal Profile & Social Links")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "Get public profile data")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {
        return ResponseEntity.ok(ApiResponse.success(profileService.getProfile()));
    }

    @PutMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update profile data (admin)")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@RequestBody ProfileRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", profileService.updateProfile(req)));
    }
}
