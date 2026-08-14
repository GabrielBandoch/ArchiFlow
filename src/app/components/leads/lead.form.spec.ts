import { FormBuilder } from '@angular/forms';
import { LeadForm } from './lead.form';

describe('LeadForm', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  describe('createLead', () => {
    it('should require nome and email', () => {
      const form = LeadForm.createLead(fb);
      expect(form.valid).toBeFalse();
      expect(form.get('nome')?.hasError('required')).toBeTrue();
      expect(form.get('email')?.hasError('required')).toBeTrue();
    });
  });

  describe('createMotivoPerda', () => {
    it('should require motivoPerda', () => {
      const form = LeadForm.createMotivoPerda(fb);
      expect(form.valid).toBeFalse();
      expect(form.get('motivoPerda')?.hasError('required')).toBeTrue();

      form.patchValue({ motivoPerda: 'Cliente optou por outro escritório' });
      expect(form.valid).toBeTrue();
    });
  });

  describe('convertLead', () => {
    it('should initialize with optional address controls', () => {
      const form = LeadForm.convertLead(fb);
      expect(form.valid).toBeTrue();
      expect(form.get('cpfCnpj')).toBeTruthy();
      expect(form.get('cep')).toBeTruthy();
    });
  });
});
