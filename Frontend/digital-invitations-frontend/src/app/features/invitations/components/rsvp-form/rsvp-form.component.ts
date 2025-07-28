import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData, Attendee } from '../../../../core/models/invitation.model';

@Component({
  selector: 'app-rsvp-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.scss']
})
export class RsvpFormComponent implements OnInit {
  rsvpForm: FormGroup;
  invitationTo?: string;
  invitationData?: InvitationData;
  eventDate?: { dayOfWeek: string, dayOfMonth: string, month: string, year: string };

  constructor(
    private fb: FormBuilder,
    private invitationDataService: InvitationDataService
  ) {
    this.rsvpForm = this.fb.group({
      guests: this.fb.array([]),
      message: ['']
    });
  }

  ngOnInit(): void {
    this.invitationData = this.invitationDataService.getInvitationData();
    this.invitationTo = this.invitationData.guestGroup.groupName;
    this.formatEventDate(this.invitationData.date);

    // Generar los campos de invitado desde el servicio
    this.invitationData.guestGroup.attendees.forEach(attendee => {
      this.addGuest(attendee);
    });
  }

  private formatEventDate(dateString: string): void {
    const date = new Date(dateString);
    this.eventDate = {
      dayOfWeek: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      dayOfMonth: date.toLocaleDateString('es-ES', { day: '2-digit' }),
      month: date.toLocaleDateString('es-ES', { month: 'short' }),
      year: date.getFullYear().toString()
    };
  }

  get guests() {
    return this.rsvpForm.get('guests') as FormArray;
  }

  addGuest(attendee: Attendee): void {
    const guestGroup = this.fb.group({
      name: [{ value: attendee.name, disabled: !attendee.isEditable }],
      attendance: ['attending', Validators.required],
      isEditable: [attendee.isEditable]
    });
    this.guests.push(guestGroup);
  }

  onSubmit(): void {
    if (this.rsvpForm.valid) {
      console.log(this.rsvpForm.value);
    }
  }
} 