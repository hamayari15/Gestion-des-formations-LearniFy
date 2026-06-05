import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit {
  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAplE21NH9rOujeelgoORlRXnz2KunK2IY`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.initMap();
    document.head.appendChild(script);
  }

  initMap() {
    const location = { lat: 36.8065, lng: 10.1815 };

    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        zoom: 15,
        center: location,
      }
    );

    new google.maps.Marker({
      position: location,
      map: map,
      title: 'Société CNI',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });
  }
}
