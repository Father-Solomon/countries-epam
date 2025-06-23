import {Component, computed, inject, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {CountryService} from '../data-access/country.service';
import {Country} from '../interfaces/country';

@Component({
  selector: 'app-countries',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './countries.html',
  standalone: true,
  styleUrl: './countries.scss'
})
export class Countries {
  private service = inject(CountryService);

  countries = signal<Country[]>([]);
  selectedRegion = signal<string | null>(null);
  offset = signal(0);
  total = signal(999);
  isLoading = signal(false);

  @ViewChild('regionSelect') regionSelectRef?: MatSelect;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const panel = document.querySelector('.mat-select-panel') as HTMLElement;
      if (panel) {
        panel.addEventListener('scroll', () => {
          const nearBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 20;
          if (nearBottom && !this.isLoading()) {
            this.loadNextChunk();
          }
        });
      }
    });
  }

  regions = computed(() => {
    const set = new Set<string>();
    for (const c of this.countries()) {
      if (c.region) set.add(c.region);
    }
    return Array.from(set).sort();
  });

  constructor() {
    this.loadNextChunk();
  }

  loadNextChunk() {
    if (this.countries().length >= this.total()) return;
    this.isLoading.set(true);
    this.service.getCountriesChunk(this.offset()).subscribe(response => {
      this.total.set(response.total);
      this.countries.update(c => [...c, ...response.countries]);
      this.offset.update(n => n + 100);
      this.isLoading.set(false);
    });
  }
}
