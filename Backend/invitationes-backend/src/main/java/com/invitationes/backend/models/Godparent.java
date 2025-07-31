package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Godparent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invitation_id")
    private Invitation invitation;

    private String type;
    private String icon;
    @ElementCollection
    private List<String> names;
} 