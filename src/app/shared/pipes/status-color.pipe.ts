import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true,
})
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'ready':
      case 'en-ruta':
        return 'bg-green-100 text-green-700';
      case 'programado':
        return 'bg-blue-100 text-blue-700';
      case 'retrasado':
      case 'warning':
        return 'bg-amber-100 text-amber-700';
      case 'critico':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
