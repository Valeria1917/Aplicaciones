import { Component, OnInit } from '@angular/core';
import * as Samba from 'samba-bo-sdk';

@Component({
  selector: 'app-videollamada',
  templateUrl: './videollamada.component.html',
  styleUrls: ['./videollamada.component.scss']
})
export class VideollamadaComponent implements OnInit {
  private developerKey: string = 'ghbcIYEuUippyzNzKUuiCQJlBJyiIZlG4QNHZiu8BzuciJQmyVFtxzHgKoeEvYi9';
  private teamId: string = '42e14596-b4ae-435b-a798-05de29ea5897';

  constructor() {}

  ngOnInit(): void {
    this.initializeVideoCall();
  }

  initializeVideoCall() {
    console.log('Inicializando videollamada con la clave de desarrollador:', this.developerKey);
    console.log('Identificación del equipo:', this.teamId);
  }

  startCall() {
    console.log('Iniciando videollamada...');

    try {
      (Samba as any).startCall(this.developerKey, this.teamId)
        .then(() => {
          console.log('Videollamada iniciada con éxito.');
        })
        .catch((error: any) => {
          console.error('Error al iniciar la videollamada:', error);
        });
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  }

  endCall() {
    console.log('Finalizando videollamada...');
    
    (Samba as any).endCall()
      .then(() => {
        console.log('Videollamada finalizada con éxito.');
      })
      .catch((error: any) => {
        console.error('Error al finalizar la videollamada:', error);
      });
  }
}
