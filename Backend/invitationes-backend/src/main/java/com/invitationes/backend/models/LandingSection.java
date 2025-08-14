package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class LandingSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(length = 4000)
    private String contentHtml;
    private String imageUrl;
    private String imageSide; // 'left' or 'right'
    private Integer orderIndex;
    private Boolean active = true;
}



