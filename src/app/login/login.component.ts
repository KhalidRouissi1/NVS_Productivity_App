// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginFrom = this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required]]

  })
  constructor(private fb:FormBuilder,private auth : AuthService,private router :Router,private snackBar: MatSnackBar){}
  getEmail(){
    return this.loginFrom.controls['email'];
  } 
   getPassword(){
    return this.loginFrom.controls['password'];
  }
  async presentToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000, 
      horizontalPosition: 'center', 
      verticalPosition: 'top' 
    });
  }
  onSubmit() {  
    const {email,password} = this.loginFrom.value;
    this.auth.getUserByEmail(email as string).subscribe(
      response=>{

        if(response.length >0 && response[0].password ==password){
          localStorage.setItem('email',email as string);  
          localStorage.setItem('userId', response[0].id as string);
          this.router.navigate(['todo']);
        }else{
          this.presentToast('Email or Password is wrong');
        }
      },
      error=>{
        this.presentToast('Something Went Wrong');

      }
    )

  } 
}
