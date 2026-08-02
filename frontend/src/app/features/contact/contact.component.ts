import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map?: L.Map;
  readonly coords: L.LatLngTuple = [36.81225, 10.166917];
  
  form: FormGroup;
  submitting = false;
  submitted = false;
  errorKey = '';
  serverErrorMsg = '';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  private initMap(): void {

    if (this.map) return;

    this.map = L.map(this.mapContainer.nativeElement).setView(this.coords, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    const marker = L.circleMarker(this.coords, {
      radius: 10,
      color: '#185FA5',
      fillColor: '#185FA5',
      fillOpacity: 0.9,
      weight: 3,
    }).addTo(this.map);

    this.translate.get('CONTACT.MAP_POPUP').subscribe((text: string) => {
      marker.bindPopup(text).openPopup();
    });

    setTimeout(() => this.map?.invalidateSize(), 150);
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorKey = '';
    this.serverErrorMsg = '';
    this.submitted = false;

    this.messageService.sendMessage(this.form.value).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        this.form.reset();
      },
      error: (err) => {
        this.submitting = false;
        if (err?.error?.message) {
          this.serverErrorMsg = err.error.message;
        } else {
          this.errorKey = 'CONTACT.ERROR_GENERIC';
        }
      },
    });
  }

  dismissError(): void {
    this.errorKey = '';
    this.serverErrorMsg = '';
  }

  dismissSuccess(): void {
    this.submitted = false;
  }
}
