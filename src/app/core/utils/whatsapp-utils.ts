export class WhatsAppUtils {
  static getNomeEmpresa(): string {
    if (typeof window === 'undefined') return '';
    try {
      const nomeDireto = localStorage.getItem('nomeEscritorio');
      if (nomeDireto?.trim()) return nomeDireto.trim();

      for (const key of ['archiflow_config_proposta_v2', 'configuracaoProposta']) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.nomeEscritorio?.trim()) return parsed.nomeEscritorio.trim();
        }
      }

      const host = window.location.hostname;
      const parts = host.split('.');
      if (parts.length > 2 && !['www', 'app', 'staging', 'api'].includes(parts[0])) {
        const tenant = parts[0];
        return tenant.charAt(0).toUpperCase() + tenant.slice(1);
      }
    } catch {}
    return '';
  }

  static getMensagemContato(nome?: string | null, tipo: 'projeto' | 'parceria' = 'projeto'): string {
    const nomeDestino = nome?.trim() ? `Olá ${nome.trim()}! ` : 'Olá! ';
    const nomeEmpresa = this.getNomeEmpresa();
    const sufixoEmpresa = nomeEmpresa ? ` na ${nomeEmpresa}` : '';

    if (tipo === 'parceria') {
      return `${nomeDestino}Entro em contato sobre uma parceria de projeto${sufixoEmpresa}.`;
    }
    return `${nomeDestino}Entro em contato sobre o seu projeto${sufixoEmpresa}.`;
  }

  static getWhatsAppUrl(telefone: string | null | undefined, mensagem?: string): string {
    if (!telefone) return '';
    const limpo = telefone.replace(/\D/g, '');
    if (!limpo) return '';
    const ddi = limpo.length === 10 || limpo.length === 11 ? `55${limpo}` : limpo;
    const msgFinal = mensagem || this.getMensagemContato();
    return `https://wa.me/${ddi}?text=${encodeURIComponent(msgFinal)}`;
  }

  static abrirWhatsApp(telefone: string | null | undefined, mensagem?: string, event?: Event): void {
    event?.stopPropagation();
    const url = this.getWhatsAppUrl(telefone, mensagem);
    if (url && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
