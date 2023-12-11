import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { TodoComponent } from './todo/todo.component';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatCardModule} from '@angular/material/card'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatButtonModule} from '@angular/material/button';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import {MatTabsModule} from '@angular/material/tabs';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {MatRadioButton, MatRadioModule} from '@angular/material/radio';
import { RegisterComponent } from './register/register.component';
import { PomodoroTimerComponent } from './pomodoro-timer/pomodoro-timer.component';
import { BarsComponent } from './bars/bars.component';
import { Erro404Component } from './erro404/erro404.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TodoComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    PomodoroTimerComponent,
    BarsComponent,
    Erro404Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    DragDropModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    MatTabsModule,
    MatCardModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatRadioModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
