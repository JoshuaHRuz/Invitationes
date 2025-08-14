package com.invitationes.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String tokenType;
    private Long userId;
    private String name;
    private String email;
    private String role;
}


