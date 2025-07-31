package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Attendee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "guest_group_id")
    private GuestGroup guestGroup;

    private String name;
    private String status; // e.g., ATTENDING, NOT_ATTENDING
}