package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ContentBlock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Página a la que pertenece el bloque: home, about, services, team, projects, testimonials, pricing, contact
    private String page;

    // Tipo de bloque: hero, textImage, features, faq, cta, stats, plainHtml
    private String blockType;

    private String title;
    private String subtitle;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String contentHtml;

    private String imageUrl;
    private String imageSide; // left | right

    @Lob
    @Column(columnDefinition = "TEXT")
    private String dataJson; // JSON libre para listas (features, faq, etc.)

    private Integer orderIndex;
    private Boolean active = true;
}



