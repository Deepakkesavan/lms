import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { NgceIconModule } from '@clarium/ngce-icon';
import { NgceComponentsModule } from '@clarium/ngce-components';
type DropdownDirection = 'top' | 'bottom' | 'left' | 'right';
type Appearance = 'outline' | 'text';
@Component({
  selector: 'lms-menu',
  standalone: true,
  imports: [CommonModule, NgceComponentsModule, NgceIconModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnDestroy {
  dropdownData = input<any[]>(); // required by default
  menuStyles = input<Record<string, string>>({});
  itemStyles = input<Record<string, string>>({});
  iconName = input<string>('ngce-ellipsis-vert');
  iconSize = input<string>('18px');
  iconColor = input<string>('black');
  appearence = input<Appearance>('outline');
  toolTipMessage = input<string>('Filter Status');

  direction = signal<DropdownDirection>('left');
  handleClick = output<string>();

  isOpen = signal(false);

  constructor(private elementRef: ElementRef) {
    document.addEventListener('click', this.onOutsideClick);
  }

  getAppearence = computed(() => {
    const layout = this.appearence();
    return layout;
  });

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) this.setDropdownDirection();
  }

  selectItem(item: string) {
    this.handleClick.emit(item);
    this.isOpen.set(false);
  }

  private onOutsideClick = (event: MouseEvent) => {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  };

  style = {
    padding: '.335rem .275rem',
    'border-radius': '.25rem',
    display: 'inline-flex',
    'justify-content': 'center',
    'align-items': 'center',
    background: 'transparent',
    border: '1px solid var(--btn-color)',
  };

  private setDropdownDirection() {
    const iconEl = this.elementRef.nativeElement.querySelector('menu-icon-btn');
    const rect = iconEl?.getBoundingClientRect();

    if (!rect) return;

    const buffer = 150; // estimated dropdown width

    const spaceTop = rect.top;
    const spaceBottom = window.innerHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = window.innerWidth - rect.right;

    if (spaceRight < buffer && spaceLeft > buffer) {
      this.direction.set('left');
    } else if (spaceLeft < buffer && spaceRight > buffer) {
      this.direction.set('right');
    } else if (spaceBottom > spaceTop) {
      this.direction.set('bottom');
    } else {
      this.direction.set('top');
    }
  }
  ngOnDestroy(): void {
    document.removeEventListener('click', this.onOutsideClick);
  }
}
