package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ThemeSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String primaryColor;
    private String secondaryColor;
    private String backgroundColor;
    private String textColor;

    private String primaryFont;      // e.g., 'Poppins'
    private String headingsFont;     // e.g., 'Playfair Display'
    private String baseFontSize;     // e.g., '16px'

    private String headingsTextColor;       // optional; fallback to primaryColor
    private String buttonPrimaryTextColor;  // optional; fallback to #ffffff
}


