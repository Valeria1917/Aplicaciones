import { Component, OnInit } from '@angular/core';
import axios from 'axios'; // Para realizar solicitudes HTTP

declare global {
  interface Window {
    DailyIframe: any; // Declaración para DailyIframe en window
  }
}

@Component({
  selector: 'app-videollamada',
  templateUrl: './videollamada.component.html',
  styleUrls: ['./videollamada.component.scss']
})
export class VideollamadaComponent implements OnInit {

  dailyCallFrame: any;

  constructor() {}

  ngOnInit(): void {
    this.createRoomAndInitializeCall();
  }

  async createRoomAndInitializeCall(): Promise<void> {
    try {
      // Clave de API de Daily.co - Expón esta clave con mucho cuidado
      const apiKey = 'e591ed754c784dd13523b9264ce0aecdd26df78a1159def847d731eb8c1b3505'; 

      // Solicitud a la API de Daily.co para crear una sala
      const response = await axios.post('https://api.daily.co/v1/rooms', {
        properties: {
          exp: Math.round(Date.now() / 1000) + 3600, // Expiración de la sala (1 hora)
          enable_knocking: true // Permitir que los usuarios "toquen la puerta" antes de entrar
        }
      }, {
        headers: {
          Authorization: `Bearer ${apiKey}`, // Autenticación con API Key
          'Content-Type': 'application/json'
        }
      });

      const roomUrl = response.data.url; // URL de la sala generada

      // Inicializar el iframe de Daily.co
      this.dailyCallFrame = window.DailyIframe.createFrame({
        showLeaveButton: true, // Botón para salir de la llamada
        iframeStyle: {
          position: 'relative',
          width: '100%',
          height: '100%',
          border: '0',
        },
      });

      // Unirse a la sala creada
      this.dailyCallFrame.join({ url: roomUrl });

      // Insertar el iframe de Daily.co en el contenedor del HTML
      const videoContainer = document.getElementById('video-container');
      videoContainer?.appendChild(this.dailyCallFrame.iframe());

    } catch (error) {
      console.error('Error al crear la sala:', error);
    }
  }

  // Método para salir de la videollamada
  leaveCall(): void {
    this.dailyCallFrame.leave();
  }
}

