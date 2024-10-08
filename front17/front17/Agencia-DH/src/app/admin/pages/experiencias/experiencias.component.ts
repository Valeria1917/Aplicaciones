import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ExperienciasService } from '../../../core/services/experiencias.service';

@Component({
  selector: 'app-admin-experiencias',
  templateUrl: './experiencias.component.html',
  styleUrls: ['./experiencias.component.scss']
})
export class AdminExperienciasComponent implements OnInit {
  experienciasForm: FormGroup;
  experiencias: any[] = [];
  isEditing = false;
  editingExperienciaId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private experienciasService: ExperienciasService,
    public dialog: MatDialog
  ) {
    this.experienciasForm = this.fb.group({
      nom: ['', Validators.required],
      descripcion: [''],
      costo: [''],
      capacidad: [''],
      servicios: [''],
      tipo: ['']
    });
  }

  ngOnInit(): void {
    this.loadExperiencias();
  }

  loadExperiencias(): void {
    this.experienciasService.getAllExperiencias().subscribe(
      (data) => {
        this.experiencias = data;
      },
      (error) => {
        console.error('Error loading experiencias:', error); // Agregar log para depuración
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar las experiencias.",
          icon: "error"
        });
      }
    );
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateExperiencia();
    } else {
      this.createExperiencia();
    }
  }

  createExperiencia(): void {
    if (this.experienciasForm.valid) {
      console.log('Creando experiencia con datos:', this.experienciasForm.value); // Agregar log
      this.experienciasService.createExperiencia(this.experienciasForm.value).subscribe(
        () => {
          this.loadExperiencias();
          this.experienciasForm.reset();
          Swal.fire({
            title: "¡Hecho!",
            text: "Registro exitoso.",
            icon: "success"
          });
        },
        (error) => {
          console.error('Error creando experiencia:', error); // Agregar log
          Swal.fire({
            title: "Error",
            text: "No se pudo crear la experiencia.",
            icon: "error"
          });
        }
      );
    }
  }

  editExperiencia(experiencia: any): void {
    this.isEditing = true;
    this.editingExperienciaId = experiencia.id_Experiencia;
    this.experienciasForm.setValue({
      nom: experiencia.nom,
      descripcion: experiencia.descripcion,
      costo: experiencia.costo,
      capacidad: experiencia.capacidad,
      servicios: experiencia.servicios,
      tipo: experiencia.tipo
    });
  }

  updateExperiencia(): void {
    if (this.experienciasForm.valid && this.editingExperienciaId !== null) {
      const updatedExperiencia = { ...this.experienciasForm.value, id_Experiencia: this.editingExperienciaId };
      this.experienciasService.updateExperiencia(updatedExperiencia).subscribe(
        () => {
          this.loadExperiencias();
          console.log(this.loadExperiencias)
          this.experienciasForm.reset();
          this.isEditing = false;
          this.editingExperienciaId = null;
          Swal.fire({
            title: "¡Actualizado!",
            text: "Registro actualizado exitosamente.",
            icon: "success"
          });
        },
        (error) => {
          console.error('Error actualizando experiencia:', error); // Agregar log
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar la experiencia.",
            icon: "error"
          });
        }
      );
    }
  }

  deleteExperiencia(id_Experiencia: number): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No serás capaz de revertir está acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "!Borrado!",
          text: "Tu registro ha sido borrado.",
          icon: "success"
        });
        this.experienciasService.deleteExperiencia(id_Experiencia).subscribe(() => {
          this.loadExperiencias();
        });
      }
    });
  }
}
