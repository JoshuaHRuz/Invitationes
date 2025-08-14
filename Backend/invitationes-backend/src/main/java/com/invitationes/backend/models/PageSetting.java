package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PageSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String page; // about, services, team, projects, testimonials, faq, pricing

    private String menuTitle; // Título en navbar
    private Integer orderIndex; // Orden en navbar
    private Boolean enabled = true;
}



