package com.portfolio.auth;

import com.portfolio.auth.dto.LoginRequest;
import com.portfolio.auth.dto.LoginResponse;
import com.portfolio.user.User;
import com.portfolio.user.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpiryMs;

    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String accessToken  = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        setRefreshTokenCookie(response, refreshToken);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public LoginResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);

        if (refreshToken == null) {
            log.warn("Refresh token cookie not found");
            return null; // Or throw a specialized Auth exception
        }

        String email = jwtService.extractUsername(refreshToken);
        User user = (User) userDetailsService.loadUserByUsername(email);

        if (!jwtService.isTokenValid(refreshToken, user)) {
            log.warn("Invalid refresh token for user: {}", email);
            return null;
        }

        String newAccessToken  = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        setRefreshTokenCookie(response, newRefreshToken);

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in production
        cookie.setPath("/api/auth");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in production (HTTPS)
        cookie.setPath("/api/auth");
        cookie.setMaxAge((int) (refreshExpiryMs / 1000));
        // cookie.setSameSite("Strict"); // available in Java EE 9+
        response.addCookie(cookie);
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "refreshToken".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
