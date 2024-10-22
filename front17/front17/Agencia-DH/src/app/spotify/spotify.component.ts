import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss']
})
export class SpotifyComponent implements OnInit {
  clientId = 'a8d4d3ea48af47c29030ec74c8fd013f';
  clientSecret = '2dff5974137349b291e60dfa7fcf1750';
  token: string = '';
  searchQuery: string = '';
  tracks: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getSpotifyToken();
  }
  

  // Obtiene el token de acceso desde Spotify API
  async getSpotifyToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const headers = {
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', params, { headers });
      this.token = response.data.access_token;
    } catch (error) {
      console.error('Error al obtener el token de Spotify', error);
    }
  }

  // Busca canciones en Spotify
  async searchTracks() {
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?q=${this.searchQuery}&type=track`, { headers });
      this.tracks = response.data.tracks.items;
    } catch (error) {
      console.error('Error al buscar canciones en Spotify', error);
    }
  }

  // Método para redirigir a Inicio
  irInicio() {
    // Aquí colocas tu lógica de navegación a Inicio
  }
}
