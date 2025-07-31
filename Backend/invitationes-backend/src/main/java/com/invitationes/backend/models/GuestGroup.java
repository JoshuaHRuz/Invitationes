package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(exclude = {"attendees"})
public class GuestGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invitation_id")
    private Invitation invitation;

    private String groupName;
    private String whatsappNumber;
    private int allowedPasses;
    private String status; // e.g., PENDING, CONFIRMED

    @OneToMany(mappedBy = "guestGroup")
    private List<Attendee> attendees;
}