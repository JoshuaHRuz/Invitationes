package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ItineraryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invitation_id")
    private Invitation invitation;

    private String time;
    private String title;
    private String icon;
} 