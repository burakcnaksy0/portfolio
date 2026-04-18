package com.portfolio.auth;

import com.portfolio.auth.dto.LoginRequest;
import com.portfolio.auth.dto.LoginResponse;
import com.portfolio.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "JWT-based authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login and receive access token")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        LoginResponse loginResponse = authService.login(request, response);
        return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using HttpOnly cookie")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {
        LoginResponse loginResponse = authService.refresh(request, response);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", loginResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and clear refresh token cookie")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}
