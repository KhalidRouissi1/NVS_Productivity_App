// todo.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  // Get all tasks
  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.baseUrl}/tasks`);
  }

  // Add a new task
  addTask(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(`${this.baseUrl}/tasks`, task);
  }

  // Update an existing task
  updateTask(id: number, task: ITask): Observable<ITask> {
    return this.http.put<ITask>(`${this.baseUrl}/tasks/${id}`, task);
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }
}
