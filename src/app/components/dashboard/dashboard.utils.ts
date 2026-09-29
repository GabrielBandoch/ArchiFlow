export function formatarMoeda(valor?: number | null): string {
  const v = valor || 0;
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatarMoedaInteiro(valor?: number | null): string {
  const v = valor || 0;
  return `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
}
