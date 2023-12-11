// todo.component.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TodoService } from '../services/todo.service';
import { ITask } from '../interfaces/task';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  doneIndex!:number;
  tasksIndex!:number;
  inProgIndex!:number;
  todoForm!: FormGroup;
  tasks: ITask[] = [];
  lastTaskId: number = 0;
  tasksDetector: ITask = {
    id:this.lastTaskId,
    userId:Number(localStorage.getItem("id")),
    description: '',
    done: false,
    task: false,
    inProg: false,
  };
  
  inprogress: ITask[] = [];
  done: ITask[] = [];
  updateIndex!: any;
  isEditEnabled: boolean = false;

  constructor(private fb: FormBuilder, private todoService: TodoService) {
 
  }
  generatePDF() {
    const pdf = new jsPDF();
  
    this.addTasksToPDF(pdf, this.tasks, 'TO DO');
    pdf.addPage(); 
    this.addTasksToPDF(pdf, this.inprogress, 'IN PROGRESS');
    pdf.addPage(); 
    this.addTasksToPDF(pdf, this.done, 'DONE');
  
    pdf.save('liste_taches.pdf');
  }
  
  private addTasksToPDF(pdf: any, tasks: ITask[], title: string) {
    pdf.setFont('Arial', 'normal');
    pdf.setFontSize(18);
    pdf.setTextColor(33, 33, 33);
  
    pdf.text(title, 20, 20);
  
    pdf.setFontSize(12);
    pdf.setTextColor(77, 77, 77);
  
    const columnWidth = 80;
    let yPosition = 30;
  
    tasks.forEach((task, index) => {
      yPosition += 12;
  
      pdf.text(`${index + 1}.`, 20, yPosition);
      pdf.text(task.description, 40 + columnWidth, yPosition);
  
      yPosition += 7;
  
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 10;
      }
    });
  }
  ngOnInit(): void {
    // Initialize the form
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
    });

    // Fetch tasks from the server on component initialization
    this.loadTasks();
  }

  // Add a new task
  addTask() {
    this.todoService.addTask({
      id:this.lastTaskId,
      userId:Number(localStorage.getItem("userId")),
      description: this.todoForm.value.item,
      done: false,
      task: true,
      inProg: false,
    }).subscribe(() => {
      this.loadTasks(); 
      this.todoForm.reset();
    });
  }

  // Edit an existing task
  onEdit(item: ITask, i: number) {
    this.todoForm.controls['item'].setValue(item.description);
    this.updateIndex = i;
    this.isEditEnabled = true;
  }

  // Update an existing task
  // updateTask() {
  //   this.tasks[this.updateIndex].description = this.todoForm.value.item;
  //   this.tasks[this.updateIndex].done = false;
  //   this.todoForm.reset();
  //   this.updateIndex = undefined;
  //   this.isEditEnabled = false;
  // }
  updateTask() {
    const updatedTask: ITask = {
      ...this.tasks[this.updateIndex],
      description: this.todoForm.value.item,
    };
  
    this.todoService.updateTask(updatedTask.id, updatedTask).subscribe(() => {
      this.loadTasks();
      this.todoForm.reset();
      this.updateIndex = undefined;
      this.isEditEnabled = false;
    });
  }
  deleteTask(i: number) {
    this.tasks.splice(i, 1);
  }
  
  deleteInProgressTask(i: number) {
    this.inprogress.splice(i, 1);
  }
  
  deleteDoneTask(i: number) {
    this.done.splice(i, 1); 
  }
  deleteFromDB(id:number) {
    this.todoService.deleteTask(id).subscribe(() => {
      this.loadTasks(); 
      this.todoForm.reset();
    });;
  }
drop(event: CdkDragDrop<ITask[]>, status: string) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    const draggedItemData = event.item.data;
    console.log('Dragged Item Data:', draggedItemData);
    const taskIdToUpdate = draggedItemData?.id;

    if (taskIdToUpdate !== undefined) {
      // Detect place
      if (status === 'done') {
        const taskToUpdate: ITask = {
          ...draggedItemData,
          done: true,
          task: false,
          inProg: false,
        };

        this.todoService.updateTask(taskIdToUpdate, taskToUpdate).subscribe(() => {
          this.loadTasks();
        });
      } else if (status === 'todo') {
        const taskToUpdate: ITask = {
          ...draggedItemData,
          done: false,
          task: true,
          inProg: false,
        };
        this.todoService.updateTask(taskIdToUpdate, taskToUpdate).subscribe(() => {
          this.loadTasks();
        });
      } else {
        const taskToUpdate: ITask = {
          ...draggedItemData,
          done: false,
          task: false,
          inProg: true,
        };
        this.todoService.updateTask(taskIdToUpdate, taskToUpdate).subscribe(() => {
          this.loadTasks();
        });
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}

  private loadTasks() {
    this.done = [];
    this.tasks = [];
    this.inprogress = [];
    if(this.tasks.length >0)
    this.lastTaskId = this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].id + 1 : 0;
    this.todoService.getTasks().subscribe((tasks) => {
      for (let i: number = 0; i < tasks.length; i++) {
        if(tasks[i].userId == Number(localStorage.getItem("userId"))){
          if (tasks[i].done) {
            this.done.push(tasks[i]);
          }
          if (tasks[i].task) {
            this.tasks.push(tasks[i]);
          }
          if (tasks[i].inProg) {
            this.inprogress.push(tasks[i]);
          }
        }
      }
    });
  }
}
