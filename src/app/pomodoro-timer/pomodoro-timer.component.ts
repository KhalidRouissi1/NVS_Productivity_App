import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.scss']
})
export class PomodoroTimerComponent implements OnInit, OnDestroy {
// this 3 for spinner and type 
  // maxTime: number = 120;
  color: string = 'primary';
  // type of spinner 
  mode: ProgressSpinnerMode = 'determinate';  
  
  // first value of progress percentage ("for circle")
  progressPercentage:number=0; 
  // timeIsWork for test if timer start or now
  timeIsWork=false;


 // first value of timer get from <input ty="range">
  value: number =1;
 // get time from <input ty="range"> and fix it by multiplay in 60 (min)
  time: number = this.value * 60;
  // use  Subscription; to handem asynchronous operations and make http request
  timerSubscription!: Subscription;

    ngOnInit() {
    }


    // startTimer() for strat count timer from value to 0
    startTimer() {
      if (!this.timerSubscription || this.timerSubscription.closed) {
        this.timerSubscription = interval(1000).subscribe(() => {
          if (this.time > 0) {
            this.time--;
            // Calculate the progress percentage based on remaining time
            this.progressPercentage = ((this.value * 60 - this.time) / (this.value * 60)) * 100;
          } else {
            this.timerSubscription.unsubscribe();
          }
        });
      }
    }


    // getColor() for change co
    getColor(): string {
      // Implement your logic to determine the color based on the 'color' property
      if (this.color === 'primary') {
        return 'blue'; // Replace 'blue' with the actual color value
      } else if (this.color === 'accent') {
        return 'green'; // Replace 'green' with the actual color value
      } else if (this.color === 'warn') {
        return 'red'; // Replace 'red' with the actual color value
      } else {
        return 'gray'; // Default color or handle additional cases
      }
    }


    // restart time and stop it
    restart(){
      this.progressPercentage = 0;
      this.time = this.value * 60;
      this.timerSubscription.unsubscribe();
      this.timeIsWork=false;
    }



    // stop and run time 
    workTime(){
      if(this.timeIsWork){
        this.timerSubscription.unsubscribe();
        this.timeIsWork= !this.timeIsWork;
      }else{
        this.startTimer();
        this.timeIsWork= !this.timeIsWork;
      }

    }
  // timeChange() for change time using range 

    timeChange($event: any) {
      this.progressPercentage = 0;
      this.time = this.value * 60;
      this.restart();
    
    }


    // retourn true form for time 00:00
    formatTime(): string {
      const minutes: number = Math.floor(this.time / 60);
      const seconds: number = this.time % 60;
      const formattedMinutes: string = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const formattedSeconds: string = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formattedMinutes}:${formattedSeconds}`;
    }
    // when stop 
    ngOnDestroy() {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
    }
}
