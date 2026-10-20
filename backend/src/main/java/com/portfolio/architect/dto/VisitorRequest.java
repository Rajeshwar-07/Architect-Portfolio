package com.portfolio.architect.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

/**
 * Request DTO for capturing a visitor's email.
 */
@Data
public class VisitorRequest {

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Must be a valid email address")
    private String email;
}
