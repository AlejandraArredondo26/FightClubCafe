import { Component, OnInit } from '@angular/core';
import { Personajes } from 'src/app/services/personajes';
import { Hero } from 'src/app/interfaces/interfaces';

interface GaleriaItem {
  src: string;
  name: string;
  tag: 'jugable' | 'npc' | 'enemigo' | 'jefe' | 'otro';
  desc?: string;
}

@Component({
  standalone: false,
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {
  tags: Array<{ key: GaleriaItem['tag'] | 'todos'; label: string }> = [
    { key: 'todos', label: 'Todos' },
    { key: 'jugable', label: 'Jugables' },
    { key: 'npc', label: 'NPCs' },
    { key: 'enemigo', label: 'Enemigos' },
    { key: 'jefe', label: 'Jefes' },
    { key: 'otro', label: 'Otros' },
  ];

  items: GaleriaItem[] = [];
  selectedTag: GaleriaItem['tag'] | 'todos' = 'todos';
  filtered: GaleriaItem[] = [];

  // Visor modal
  viewerOpen = false;
  current?: GaleriaItem;

  constructor(private personajes: Personajes) {}

  ngOnInit() {
    // this.personajes.getHeroes(40).subscribe({
    //   next: (heroes: Hero[]) => {
    //     this.items = heroes.map((h) => ({
    //       src: h.images?.md || h.images?.sm || h.images?.xs || 'assets/images/tavern.jpeg',
    //       name: h.name,
    //       tag: this.mapTag(h),
    //       desc: h.biography?.fullName,
    //     }));
    //     this.applyFilter('todos');
    //   },
    //   error: () => {
    //     this.items = [];
    //     this.applyFilter('todos');
    //   },
    // });
  }

  applyFilter(tag: GaleriaItem['tag'] | 'todos') {
    this.selectedTag = tag;
    this.filtered = tag === 'todos' ? this.items : this.items.filter((i) => i.tag === tag);
  }

  openViewer(item: GaleriaItem) {
    this.current = item;
    this.viewerOpen = true;
  }

  closeViewer() {
    this.viewerOpen = false;
    this.current = undefined;
  }

  trackBySrc = (_: number, item: GaleriaItem) => item.src;

  private mapTag(h: Hero): GaleriaItem['tag'] {
    const pub = (h.biography?.publisher || '').toLowerCase();
    if (pub.includes('marvel')) return 'jugable';
    if (pub.includes('dc')) return 'enemigo';
    return 'npc';
  }
}

