export class MaskUtils {
  static clean(val: string): string {
    return val ? val.replace(/\D/g, '') : '';
  }

  static formatCpf(val: string): string {
    if (!val) return '';
    const v = val.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
    if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9, 11)}`;
  }

  static formatCnpj(val: string): string {
    if (!val) return '';
    const v = val.replace(/\D/g, '').slice(0, 14);
    if (v.length <= 2) return v;
    if (v.length <= 5) return `${v.slice(0, 2)}.${v.slice(2)}`;
    if (v.length <= 8) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`;
    if (v.length <= 12) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8)}`;
    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12, 14)}`;
  }

  static formatPhone(val: string): string {
    if (!val) return '';
    const v = val.replace(/\D/g, '').slice(0, 11);
    if (v.length === 0) return '';
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
  }

  static formatCep(val: string): string {
    if (!val) return '';
    const v = val.replace(/\D/g, '').slice(0, 8);
    if (v.length <= 5) return v;
    return `${v.slice(0, 5)}-${v.slice(5, 8)}`;
  }
}
