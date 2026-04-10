import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from './models/task';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private taskService = inject(TaskService);

  tasks = signal<Task[]>([]);
  newTaskTitle = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks.set(data),
      error: (err) => console.error('Erreur chargement tâches :', err)
    });
  }

  addTask(): void {
    const title = this.newTaskTitle.trim();

    if (!title) return;

    this.taskService.addTask(title).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.loadTasks();
      },
      error: (err) => console.error('Erreur ajout tâche :', err)
    });
  }

  toggleTask(task: Task): void {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed
    };

    this.taskService.updateTask(updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur modification tâche :', err)
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur suppression tâche :', err)
    });
  }
}