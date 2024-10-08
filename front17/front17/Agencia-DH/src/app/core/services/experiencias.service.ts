import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environments';

// Define una interfaz para la Experiencia
export interface Experiencia {
  id_Experiencia?: number;
  nom: string;
  descripcion: string;
  costo: number;
  capacidad: number;
  servicios: string[];
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExperienciasService {
  private apiUrl = `${environment.baseUrl}/admin/experiencia`;

  constructor(private http: HttpClient) { }

  // Método para crear una nueva experiencia
  createExperiencia(experienciaData: any): Observable<any> {
    return this.http.post(this.apiUrl, experienciaData)
  }

  // Método para obtener todas las experiencias
  getAllExperiencias(): Observable<any> {
    return this.http.get(`${this.apiUrl}s`);
  }

  // Método para obtener una experiencia por ID
  getExperienciaById(id_Experiencia: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id_Experiencia}`)
  }

  // Método para actualizar una experiencia por ID
  updateExperiencia(contenido_Experiencia: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, contenido_Experiencia)
  }

  // Método para eliminar una experiencia por ID
  deleteExperiencia(id_Experiencia: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_Experiencia}`)
  }

  // Manejo de errores global para todas las peticiones
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error.message);
    return throwError('Ocurrió un error en la solicitud. Inténtalo de nuevo más tarde.');
  }
}
