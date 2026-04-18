package com.portfolio.auth.dto;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    // Refresh token comes via HttpOnly cookie; this DTO is kept for potential body-based approach
    private String refreshToken;
}
