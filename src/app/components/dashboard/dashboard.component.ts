// dashboard.component.ts

import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UpdateUser } from 'src/app/user/interfaces/UpdateUser';
import { User } from 'src/app/user/interfaces/User';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  createForm: FormGroup;
  updateForm: FormGroup;

  users: User[]= [];
  showUpdateModal = false;
  selectedUser: User | null = null;
  showCreateModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.updateForm = this.fb.group({
      name: [''],
      email: [''],
      password: ['']
    });

    this.createForm = this.fb.group({
      name: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => this.users = users,
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  onSubmitCreate(): void {
    this.showCreateModal = true;
    this.createForm.patchValue({
      name: "",
      email: "", 
    })
  }

  createUser() {
    if (this.createForm.valid) {
      this.userService.createUser(this.createForm.value).subscribe({
        next: () => {
          Swal.fire('Creado', 'El usuario ha sido creado exitosamente', "success");
          this.getUsers();
          this.showCreateModal = false; 
          this.createForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error?.message || 'Error al crear usuario';
          Swal.fire('Error', errorMessage, 'error');
          console.error('Error creating user:', error);
        }
      });
    }
  }

  onSubmitUpdate(user: User): void {
    this.selectedUser = user;
    this.updateForm.patchValue({
      name: user.name,
      email: user.email,
      password: ''
    });
    this.showUpdateModal = true;
  }

  updatedUser(): void {
    if (this.updateForm.valid) {
      const { name, email, password } = this.updateForm.value;
      const updateData: UpdateUser = {
        id: this.selectedUser!.id,
        ...(name && { name }),
        ...(email && email !== this.selectedUser!.email && { email }),
        ...(password && { password })
      };
  
      this.userService.updateUser(updateData).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Usuario actualizado con éxito', 'success');
          this.getUsers();
          this.showUpdateModal = false;
          this.updateForm.reset()
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error?.message || 'Error al actualizar usuario';
          Swal.fire('Error', errorMessage, 'error');
          console.error('Error updating user:', error);
        }
      });
    }
  }
  

  deleteUser(user: User): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
            this.getUsers();
          },
          error: (error: HttpErrorResponse) => {
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
            console.error('Error al eliminar usuario:', error);
          }
        });
      }
    });
  }
}
