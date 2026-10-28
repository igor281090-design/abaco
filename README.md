# Módulo de Esclerometria — ContLAB

Recriação independente em HTML, CSS e JavaScript do módulo descrito no dossiê `esclerometria.md`.

Abra `index.html` em um navegador moderno. Não há instalação ou servidor.

## Recursos

- Cadastro e exclusão de ensaios, armazenados no `localStorage`.
- Cabeçalho e rastreabilidade conforme o fluxo da NBR 7584.
- Zonas com 16 impactos, salvamento automático e captura por voz.
- Mediana, descarte de valores a mais de ±10, Im, correção angular, IE efetivo, fck estimado, faixa e conformidade.
- Prévia, edição, download HTML e impressão/salvamento em PDF do relatório.
- Ábaco vinculado aos ensaios: coleta automaticamente o IE corrigido de cada zona, projeta todos os resultados na curva central digitalizada da fotografia e estima o fck visual sem aplicar a fórmula matemática do módulo.

Fórmula reproduzida: `fck (MPa) = 1,05 × (0,01078 × IE² + 0,904 × IE − 12,91)`.

Os dados ficam somente no navegador, na chave `contlab-sclerometry-v1`. A versão não possui autenticação ou Supabase. O resultado é estimativo e não substitui avaliação técnica.
