// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../shared/passwordMatch.directive';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPass : ['', Validators.required],
  },{
    validators: passwordMatchValidator
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,

    
    ) {}

  getusernameControl() {
    return this.registerForm.get('username');
  }

  getemailControl() {
    return this.registerForm.get('email');
  }

  getpasswordControl() {
    return this.registerForm.get('password');
  }
  
  getConfiPassword() {
    return this.registerForm.get('confirmPass');
  }

  async presentToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,  // Adjust the duration as needed
      horizontalPosition: 'center', // You can also use 'start', 'end', 'left', 'right'
      verticalPosition: 'top' // You can also use 'bottom'
    });
  }
  

  onSubmit() {
    const postData = { ...this.registerForm.value };
    delete postData.confirmPass;

    this.authService.registerUser(postData as User).subscribe(
      response => {
        this.presentToast('Registration successful');
        this.router.navigate(['/']);
      },
      err => {
        this.presentToast('Something went wrong');
      }
    );
  }
}
