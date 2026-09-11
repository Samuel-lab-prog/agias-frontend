# Desempenho da agenda do aluno

Medição local em 11/09/2026, Chromium headless, Vite em desenvolvimento,
com o dashboard real do aluno `reference` (13 disciplinas, 239 aulas e 78 atividades).
O JSON foi obtido da API autenticada e reproduzido no navegador; eventos acadêmicos,
avisos e catálogo de períodos foram substituídos por listas vazias para isolar a agenda.
Os tempos são observações de uma execução antes/depois, não um SLA de produção.

| Medida | Antes | Depois |
| --- | ---: | ---: |
| JSON do dashboard, sem compressão | 428.551 bytes | 197.216 bytes |
| Abertura até o calendário disponível | 8.641 ms | 1.198 ms |
| Maior tarefa bloqueante na abertura | 7.818 ms | 308 ms |
| Navegar para o próximo mês | 18.242 ms | 371 ms |
| Voltar para o mês anterior | 10.780 ms | 226 ms |
| Construções de `Intl.DateTimeFormat` na abertura | 124.880 | 5 |

## Correções

- `dateKey` reutiliza um formatador fixo em `America/Sao_Paulo`.
- `formatAcademicDate` reutiliza formatadores por opções, em um cache limitado a 32 entradas.
- A agenda memoriza os eventos filtrados e o intervalo exibido. Um índice por dia calcula
  as datas de cada evento uma única vez e atende tanto às células quanto à lista detalhada.
- O backend separa o perfil das relações consultadas e envia matrículas, entregas e
  resumos uma única vez. O planejamento seleciona apenas os campos do contrato do aluno.
- O logger reconhece o tipo padrão dos valores JSON retornados pelo Elysia;
  tamanhos de respostas HTTP sem `Content-Length` são desconhecidos (`null`), não zero.

## Regressões cobertas

`calendar.test.ts` verifica fuso horário, eventos que atravessam dias, limites do intervalo
e quantidade de formatações proporcional aos eventos, sem multiplicação por célula.
`e2e/perf/student-calendar.spec.ts` navega e filtra 13 disciplinas, 260 aulas e 78 atividades,
limitando construções de formatadores. O limite de trabalho evita depender da velocidade do CI.
O teste de integração do backend impede relações duplicadas no perfil e limita o JSON
do semestre de referência a 256 KiB, preservando as coleções utilizadas nas telas.

Execute no frontend:

```sh
bun run test:run
bun run test:e2e e2e/student-planning.spec.ts e2e/perf/student-calendar.spec.ts --workers=2
```

Execute no backend:

```sh
bun run test:student-planning
```

O dashboard ainda inclui os detalhes do semestre completo. Para históricos muito maiores,
a evolução é separar os detalhes por disciplina e consultar a agenda por intervalo na API.
