import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // 1. Replace underscores and hyphens with spaces
    let temporary = value.replace(/[_-]/g, ' ');

    // 2. Add space between lower-case followed by upper-case letters (camelCase / PascalCase)
    if (!value.includes(' ')) {
      temporary = temporary.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    // 3. Capitalize first letter of each word, lowercase the rest
    const capitalized = temporary
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return capitalized;
  }
}
