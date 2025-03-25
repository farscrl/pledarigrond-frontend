import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'thousandSeparator',
    standalone: false
})
export class ThousandSeparatorPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value === null || value === undefined) return '';

    // Convert the number to a string and replace thousands with a '
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }
}
