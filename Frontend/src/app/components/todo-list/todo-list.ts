import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true, // 👈 important for Angular standalone components
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css']
})
export class TodoList implements OnInit {
  todos: Todo[] = [];
  newTodo: Partial<Todo> = { title: '', description: '', completed: false };
  editingTodo: Todo | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => this.todos = data,
      error: (err) => console.error('Error loading todos:', err)
    });
  }

  addTodo(): void {
    if (!this.newTodo.title?.trim()) return;
    this.todoService.addTodo(this.newTodo).subscribe({
      next: (todo) => {
        this.todos.push(todo);
        this.newTodo = { title: '', description: '', completed: false };
      },
      error: (err) => console.error('Error adding todo:', err)
    });
  }

  editTodo(todo: Todo): void {
    this.editingTodo = { ...todo };
  }

  updateTodo(): void {
    if (!this.editingTodo) return;
    this.todoService.updateTodo(this.editingTodo.id!, this.editingTodo).subscribe({
      next: (updated) => {
        const index = this.todos.findIndex(t => t.id === updated.id);
        if (index !== -1) this.todos[index] = updated;
        this.editingTodo = null;
      },
      error: (err) => console.error('Error updating todo:', err)
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.todos = this.todos.filter(t => t.id !== id),
      error: (err) => console.error('Error deleting todo:', err)
    });
  }

  toggleComplete(todo: Todo): void {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo.id!, { completed: todo.completed }).subscribe();
  }

  cancelEdit(): void {
    this.editingTodo = null;
  }
}
