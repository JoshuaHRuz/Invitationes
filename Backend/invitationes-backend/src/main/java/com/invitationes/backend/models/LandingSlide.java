package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class LandingSlide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String subtitle;
    private String imageUrl;
    private String backgroundColor;

    private Integer orderIndex;
    private Boolean active = true;

    // Overlay configurable para mejorar legibilidad del texto
    private Boolean overlayEnabled = false;
    private Double overlayOpacity = 0.35; // 0.0 - 1.0
}



