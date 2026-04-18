package com.portfolio.message.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendMessageRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank @Email(message = "Valid email is required")
    private String email;

    private String subject;

    @NotBlank(message = "Message body is required")
    private String body;
}
