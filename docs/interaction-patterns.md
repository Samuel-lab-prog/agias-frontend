# Interações do frontend

As durações, curvas, keyframes e estados compartilhados ficam em `src/core/themes/motion.ts`.

- `NavigationPageShell` aplica a entrada da página. Não envolva a mesma tela em outra animação de entrada.
- Use `getStaggeredEntryAnimationStyle(index)` para listas de cartões. O atraso total é limitado para não atrasar a leitura.
- Use `Surface interactive asChild` para um cartão que contém um link de navegação. Mantenha ações secundárias fora desse link.
- Use `interactiveStyles.row`, `field` ou `day` no `css` do componente correspondente. O foco deve estar no elemento que recebe teclado.
- Use `BaseButton` para ações. Ele centraliza hover, foco, pressão, estado desabilitado e tamanho mínimo em telas de toque.
- Hovers reforçam ações já visíveis. Informações e ações essenciais também devem aparecer sem mouse.
- O tema e os padrões respeitam `prefers-reduced-motion`. Novas animações em JavaScript também devem respeitar essa preferência.

Os testes em `e2e/student-planning.spec.ts` cobrem busca e limpeza de filtros, preservação do período, hover, movimento reduzido, teclado, menu móvel e ausência de rolagem horizontal.
