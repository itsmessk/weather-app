import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';
  errors: string[] = [];
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  successMessage: string = '';

  constructor(private api: ApiService) {}

  submit(): void {
    this.errors = [];
    this.submitSuccess = false;
    
    if (this.name.length === 0) {
      this.errors.push('Name is required');
    }
    if (this.email.length === 0) {
      this.errors.push('Email is required');
    } else if (!this.validateEmail(this.email)) {
      this.errors.push('Please enter a valid email address');
    }
    if (this.subject.length === 0) {
      this.errors.push('Subject is required');
    }
    if (this.message.length === 0) {
      this.errors.push('Message is required');
    }

    if (this.errors.length === 0) {
      this.isSubmitting = true;
      this.api.addEnquiry({
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message
      }).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.successMessage = response.message || 'Thank you for your message. We will get back to you soon!';
          this.resetForm();
          console.log('Enquiry submitted', response);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errors.push('Failed to submit enquiry. Please try again later.');
          console.error('Error submitting enquiry', err);
        }
      });
    }
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }
}
