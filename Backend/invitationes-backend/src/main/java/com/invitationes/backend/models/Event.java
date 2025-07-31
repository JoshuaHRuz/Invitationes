package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invitation_id")
    private Invitation invitation;

    private String name;
    private String location;
    private String address;
    private String time;
    private String mapUrl;
    private String imageUrl;
    private String imageOrder; // 'left' or 'right'
    // dressCode como embedded o campos separados si es necesario
} 