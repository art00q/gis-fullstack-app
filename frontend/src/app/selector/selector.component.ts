import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Variant {
  id: string;
  value: string;
  name: string;
}

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
})
export class SelectorComponent {
  public selectedVariant: string | undefined;
  @Output() selected = new EventEmitter<string | undefined>();

  public variants: Variant[] = [
    {
      id: 'A',
      value: 'A',
      name: 'Показать только А',
    },
    {
      id: 'B',
      value: 'B',
      name: 'Показать только В',
    },
    {
      id: 'A&B',
      value: 'A&B',
      name: 'Показать пересечение А и В',
    },
    {
      id: 'A|B',
      value: 'A|B',
      name: 'Показать А и В',
    },
  ];

  constructor() {}

  public onSelected(event: Event) {
    const isChecked: boolean = (<HTMLInputElement>event.target).checked;

    if (isChecked) {
      this.selectedVariant = (event.target as HTMLInputElement).value;
      this.selected.emit(this.selectedVariant);
    }
  }
}
