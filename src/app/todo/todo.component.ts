// todo.component.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TodoService } from '../services/todo.service';
import { ITask } from '../interfaces/task';

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
  updateTask() {
    this.tasks[this.updateIndex].description = this.todoForm.value.item;
    this.tasks[this.updateIndex].done = false;
    this.todoForm.reset();
    this.updateIndex = undefined;
    this.isEditEnabled = false;
  }

  // Delete a task from the "TO DO" list
  deleteTask(i: number) {
    this.tasks.splice(i, 1);
  }

  // Delete a task from the "IN PROGRESS" list
  deleteInProgressTask(i: number) {
    this.inprogress.splice(i, 1);
  }

  // Delete a task from the "DONE" list
  deleteDoneTask(i: number) {
    this.inprogress.splice(i, 1);
  }

  // To Delete From Database
  deleteFromDB(id:number) {
    this.todoService.deleteTask(id).subscribe(() => {
      this.loadTasks(); 
      this.todoForm.reset();
    });;
  }
// Handle task dragging and dropping
drop(event: CdkDragDrop<ITask[]>, status: string) {
  if (event.previousContainer === event.container) {
    // Move within the same list
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    const draggedItemData = event.item.data;
    console.log('Dragged Item Data:', draggedItemData); // Add this line
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
          // Assuming you want to reload tasks after updating
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
          // Assuming you want to reload tasks after updating
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
          // Assuming you want to reload tasks after updating
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

// load and handle tasks from the server 
private loadTasks() {
  this.done = [];
  this.tasks = [];
  this.inprogress = [];

  if (this.tasks.length > 0) {
    this.lastTaskId = this.tasks[this.tasks.length - 1].id + 1;
  }

  this.todoService.getTasks().subscribe((response) => {
    console.log(response);

    // Vérifier si la réponse est une chaîne
    const tasks = typeof response === 'string' ? JSON.parse(response) : response;

    // Utiliser Object.keys pour parcourir chaque clé (ID)
    Object.keys(tasks).forEach((taskId) => {
      const task = tasks[taskId];
      task.id = Number(taskId); // Convertir la clé en un nombre (ID)

      if (task.done) {
        this.done.push(task);
      }
      if (task.task) {
        this.tasks.push(task);
      }
      if (task.inProg) {
        this.inprogress.push(task);
      }
    });
  });
}

}
