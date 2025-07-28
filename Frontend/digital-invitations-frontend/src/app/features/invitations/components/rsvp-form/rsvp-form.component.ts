import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';

@Component({
  selector: 'app-rsvp-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.scss']
})
export class RsvpFormComponent implements OnInit {
  rsvpForm: FormGroup;
  invitationTo = 'Familia Hernández';
  invitationData?: InvitationData;

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

    // Simulación de datos de invitados
    this.addGuest('Joshua Hernandez', true);
    this.addGuest('Acompañante 1', true);
    this.addGuest('Acompañante 2', false);
    this.addGuest('Acompañante 3', false);
  }

  get guests() {
    return this.rsvpForm.get('guests') as FormArray;
  }

  addGuest(name: string, isEditable: boolean): void {
    const guestGroup = this.fb.group({
      name: [{ value: name, disabled: !isEditable }],
      attendance: ['attending', Validators.required],
      isEditable: [isEditable]
    });
    this.guests.push(guestGroup);
  }

  onSubmit(): void {
    if (this.rsvpForm.valid) {
      console.log(this.rsvpForm.value);
    }
  }
} 