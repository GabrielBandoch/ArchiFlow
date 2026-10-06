import { Pipe, PipeTransform } from '@angular/core';
import { MaskUtils } from '../utils/mask-utils';

@Pipe({
  name: 'phoneMask',
  standalone: true
})
export class PhoneMaskPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return MaskUtils.formatPhone(value);
  }
}
