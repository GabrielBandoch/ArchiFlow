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

  static formatCpfCnpj(val: string): string {
    if (!val) return '';
    const clean = this.clean(val);
    if (clean.length <= 11) {
      return this.formatCpf(clean);
    }
    return this.formatCnpj(clean);
  }

  static isValidCpf(cpf: string): boolean {
    const clean = this.clean(cpf);
    if (clean.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(clean)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(clean.charAt(i), 10) * (10 - i);
    }
    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(clean.charAt(9), 10)) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(clean.charAt(i), 10) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    return rest === parseInt(clean.charAt(10), 10);
  }

  static isValidCnpj(cnpj: string): boolean {
    const clean = this.clean(cnpj);
    if (clean.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(clean)) return false;

    const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(clean.charAt(i), 10) * b[i + 1];
    }
    let rest = sum % 11;
    const d1 = rest < 2 ? 0 : 11 - rest;
    if (parseInt(clean.charAt(12), 10) !== d1) return false;

    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(clean.charAt(i), 10) * b[i];
    }
    rest = sum % 11;
    const d2 = rest < 2 ? 0 : 11 - rest;
    return parseInt(clean.charAt(13), 10) === d2;
  }

  static isValidCpfCnpj(val: string): boolean {
    const clean = this.clean(val);
    if (clean.length === 11) return this.isValidCpf(clean);
    if (clean.length === 14) return this.isValidCnpj(clean);
    return false;
  }
}
