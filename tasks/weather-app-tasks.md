# Backlog de Tarefas — Weather App

**Fonte da verdade:** `plans/weather-app-plan.md` e `specs/weather-app-spec.md`
**Data:** 2026-09-02
**Status:** Pronto para implementação

Tarefas organizadas por entrega e ordenadas por dependência. Cada tarefa é uma
unidade pequena, testável isoladamente e mapeada a requisitos da spec.

## Índice de entregas

1. [Infra e Setup](#entrega-1--infra-e-setup)
2. [Tipos e Contratos](#entrega-2--tipos-e-contratos)
3. [UI Base (Layout e Tema)](#entrega-3--ui-base-layout-e-tema)
4. [Busca de Cidade e Sugestões](#entrega-4--busca-de-cidade-e-sugestões)
5. [Integração com API de Previsão](#entrega-5--integração-com-api-de-previsão)
6. [Exibição do Clima Atual e Previsão de 5 Dias](#entrega-6--exibição-do-clima-atual-e-previsão-de-5-dias)
7. [Conversão de Unidade](#entrega-7--conversão-de-unidade)
8. [Cache e Resiliência](#entrega-8--cache-e-resiliência)
9. [Hardening (Erros, Acessibilidade, Responsividade)](#entrega-9--hardening-erros-acessibilidade-responsividade)
10. [Testes E2E](#entrega-10--testes-e2e)

---

## Entrega 1 — Infra e Setup

### T-01 — Configurar estrutura de pastas do projeto

- **Descrição:** Criar as pastas `src/components/`, `src/hooks/`,
  `src/services/`, `src/types/`, `src/utils/`, `tests/unit/` e `tests/e2e/`
  conforme a estrutura definida no plano.
- **Critérios de aceite:**
  - Todas as pastas existem, ainda que vazias (com `.gitkeep` se necessário).
  - `pnpm build` continua funcionando sem erros.
- **Dependências:** nenhuma.
- **Arquivos:** `src/components/`, `src/hooks/`, `src/services/`,
  `src/types/`, `src/utils/`, `tests/unit/`, `tests/e2e/`.
- **Tipo:** Infra.

### T-02 — Configurar Tailwind com tema escuro glassmorphism

- **Descrição:** Ajustar `tailwind.config.js` e `src/index.css` para o tema
  escuro com glassmorphism (cores, blur, transparência) descrito na spec.
- **Critérios de aceite:**
  - `pnpm build` gera CSS sem erros.
  - Paleta escura aplicada por padrão (sem toggle de tema claro/escuro).
- **Dependências:** T-01.
- **Arquivos:** `tailwind.config.js`, `src/index.css`.
- **Tipo:** Infra.

### T-03 — Configurar Vitest e Testing Library

- **Descrição:** Garantir configuração de testes unitários (`vitest.config.ts`
  ou config no `vite.config.ts`) com ambiente `jsdom` e setup do Testing
  Library.
- **Critérios de aceite:**
  - `pnpm test` executa um teste de exemplo com sucesso.
  - Ambiente `jsdom` configurado corretamente.
- **Dependências:** T-01.
- **Arquivos:** `vite.config.ts`, `tests/unit/setup.ts` (se necessário).
- **Tipo:** Infra.

### T-04 — Configurar Playwright

- **Descrição:** Validar/ajustar `playwright.config.ts` para rodar nos
  projetos Chromium, Firefox e WebKit, com viewports mobile e desktop.
- **Critérios de aceite:**
  - `pnpm exec playwright test` executa (mesmo sem specs ainda) sem erro de
    configuração.
  - Projetos Chromium, Firefox e WebKit configurados.
- **Dependências:** T-01.
- **Arquivos:** `playwright.config.ts`.
- **Tipo:** Infra.

---

## Entrega 2 — Tipos e Contratos

### T-05 — Definir tipos compartilhados de domínio

- **Descrição:** Criar `src/types/weather.ts` com todos os tipos do Data
  Model do plano: `TemperatureUnit`, `CitySuggestion`, `WeatherLocation`,
  `CurrentWeather`, `DailyForecast`, `WeatherCondition`, `WeatherReport`,
  `CachedWeatherReport`, `WeatherViewStatus`.
- **Critérios de aceite:**
  - `tsc` compila sem erros de tipo.
  - Todos os campos opcionais estão marcados corretamente (`null` ou `?`).
- **Dependências:** T-01.
- **Arquivos:** `src/types/weather.ts`.
- **Tipo:** Data.

---

## Entrega 3 — UI Base (Layout e Tema)

### T-06 — Criar componente `App` com layout base e região de status

- **Descrição:** Estruturar `App.tsx` com o layout principal (cabeçalho,
  área de busca, área de conteúdo) e uma região `role="status"`/`aria-live`
  para anúncios de mudanças de estado.
- **Critérios de aceite:**
  - Layout renderiza sem erros com placeholders de seção.
  - Região de status existe e está associada a atualizações futuras de
    estado (FR-11, US-07).
- **Dependências:** T-02, T-05.
- **Arquivos:** `src/App.tsx`, `src/main.tsx`.
- **Tipo:** UI.

### T-07 — Criar componente `WeatherStatus` (estados de feedback)

- **Descrição:** Componente que renderiza estados distintos: idle,
  carregando, entrada inválida, vazio, erro de rede, timeout, rate limit,
  resposta inválida e cache, cada um com mensagem e, quando aplicável,
  botão "Tentar novamente".
- **Critérios de aceite:**
  - Cada `WeatherViewStatus` tem uma renderização visualmente distinta.
  - Estados de erro renderizam botão "Tentar novamente" com nome acessível
    quando a ação for possível (FR-11, FR-14).
- **Dependências:** T-05, T-06.
- **Arquivos:** `src/components/WeatherStatus.tsx`.
- **Tipo:** UI.

---

## Entrega 4 — Busca de Cidade e Sugestões

### T-08 — Implementar `openMeteoClient` (cliente HTTP base)

- **Descrição:** Criar `src/services/openMeteoClient.ts` com função genérica
  de fetch aplicando timeout de 10s via `AbortController` e normalizando
  erros HTTP/rede/JSON inválido em categorias de erro de domínio.
- **Critérios de aceite:**
  - Requisição que excede 10s é abortada e retorna erro de timeout.
  - Erros de rede, HTTP e parse JSON são normalizados em tipos de erro
    distintos, sem expor detalhes internos (NFR de segurança).
- **Dependências:** T-05.
- **Arquivos:** `src/services/openMeteoClient.ts`.
- **Tipo:** Data.

### T-09 — Testes unitários do `openMeteoClient`

- **Descrição:** Testar timeout, erro de rede, erro HTTP e JSON inválido com
  mocks de `fetch`.
- **Critérios de aceite:**
  - Cobre timeout, falha de rede, status HTTP de erro e resposta malformada.
  - Nenhum teste depende da Open-Meteo real.
- **Dependências:** T-08.
- **Arquivos:** `tests/unit/services/openMeteoClient.test.ts`.
- **Tipo:** Test.

### T-10 — Implementar service de geocoding (sugestões de cidade)

- **Descrição:** Criar função em `src/services/weatherService.ts` que chama
  o endpoint de geocoding com `name`, `count=5`, `language=pt`, `format=json`
  e mapeia a resposta para `CitySuggestion[]`, tratando ausência de
  `results` como lista vazia.
- **Critérios de aceite:**
  - Retorna no máximo 5 sugestões mapeadas para `CitySuggestion` (FR-02).
  - Ausência de `results` retorna lista vazia sem erro (FR-02, edge case).
  - Mapeamento de campos segue a tabela do plano (`id`, `name`, `country`,
    `countryCode`, `region`, `latitude`, `longitude`, `timezone`).
- **Dependências:** T-08, T-05.
- **Arquivos:** `src/services/weatherService.ts`.
- **Tipo:** Data.

### T-11 — Testes unitários do service de geocoding

- **Descrição:** Testar mapeamento de campos, limite de 5 resultados,
  ausência de `results` e resposta com campos opcionais ausentes.
- **Critérios de aceite:**
  - Cobre resposta completa, resposta sem `admin1`/`country_code` e resposta
    sem `results`.
- **Dependências:** T-10.
- **Arquivos:** `tests/unit/services/weatherService.geocoding.test.ts`.
- **Tipo:** Test.

### T-12 — Implementar validação de input de busca

- **Descrição:** Criar função pura de validação (trim, limites 2–80
  caracteres) reutilizável pelo hook e pela UI.
- **Critérios de aceite:**
  - Entradas vazias, só com espaços, <2 ou >80 caracteres são inválidas
    (FR-01).
  - Aceita acentos, cedilha, hífen e apóstrofo (FR-04).
- **Dependências:** T-05.
- **Arquivos:** `src/utils/validation.ts`.
- **Tipo:** Data.

### T-13 — Testes unitários de validação de input

- **Descrição:** Testar limites de tamanho, trim e caracteres especiais.
- **Critérios de aceite:**
  - Casos de 1, 2, 80 e 81 caracteres cobertos.
  - Casos com acentos, cedilha, hífen e apóstrofo cobertos (FR-04).
- **Dependências:** T-12.
- **Arquivos:** `tests/unit/utils/validation.test.ts`.
- **Tipo:** Test.

### T-14 — Implementar hook `useWeatherSearch` (parte de sugestões)

- **Descrição:** Criar `src/hooks/useWeatherSearch.ts` com estado `query`,
  `suggestions`, `status`, debounce de 300ms e cancelamento via
  `AbortController` de consultas obsoletas de geocoding.
- **Critérios de aceite:**
  - Sugestões só são buscadas após 2 caracteres e 300ms sem digitação
    (FR-02).
  - Resposta de consulta cancelada não substitui sugestões mais recentes
    (FR-02, FR-12).
- **Dependências:** T-10, T-12.
- **Arquivos:** `src/hooks/useWeatherSearch.ts`.
- **Tipo:** Data.

### T-15 — Testes unitários do hook `useWeatherSearch` (sugestões)

- **Descrição:** Testar debounce, cancelamento de requisições obsoletas e
  transição de estados de carregamento/vazio/erro para sugestões.
- **Critérios de aceite:**
  - Mock de `weatherService`; nenhuma chamada real à Open-Meteo.
  - Cobre debounce, abort de requisição antiga e resultado vazio.
- **Dependências:** T-14.
- **Arquivos:** `tests/unit/hooks/useWeatherSearch.suggestions.test.ts`.
- **Tipo:** Test.

### T-16 — Criar componente `SearchForm`

- **Descrição:** Campo de busca com botão e suporte a Enter, ligado ao hook
  `useWeatherSearch`, com nome acessível e mensagens de validação.
- **Critérios de aceite:**
  - Busca inicia por clique no botão ou tecla Enter (FR-01).
  - Entrada inválida exibe mensagem e não dispara consulta.
  - Campo e botão têm nome acessível e operação por teclado (US-07).
- **Dependências:** T-14, T-07.
- **Arquivos:** `src/components/SearchForm.tsx`.
- **Tipo:** UI.

### T-17 — Criar componente `SearchSuggestions`

- **Descrição:** Lista de até 5 sugestões exibindo cidade, país e região,
  navegável por teclado, com seleção que atualiza `selectedCity`.
- **Critérios de aceite:**
  - Cada item mostra cidade, país e região quando disponível (FR-03).
  - Lista navegável e selecionável via teclado (US-07).
  - Seleção de uma sugestão dispara a busca de previsão.
- **Dependências:** T-14, T-16.
- **Arquivos:** `src/components/SearchSuggestions.tsx`.
- **Tipo:** UI.

### T-18 — Testes unitários e de componente de busca e sugestões

- **Descrição:** Testar `SearchForm` e `SearchSuggestions` com Testing
  Library: validação de input, exibição de sugestões, seleção por teclado.
- **Critérios de aceite:**
  - Cobre validação de entrada, renderização de sugestões e seleção via
    teclado/mouse.
  - Verifica nomes acessíveis dos controles.
- **Dependências:** T-16, T-17.
- **Arquivos:** `tests/unit/components/SearchForm.test.tsx`,
  `tests/unit/components/SearchSuggestions.test.tsx`.
- **Tipo:** Test.

---

## Entrega 5 — Integração com API de Previsão

### T-19 — Implementar service de forecast

- **Descrição:** Adicionar em `src/services/weatherService.ts` função que
  chama o endpoint de forecast com os parâmetros definidos no plano
  (`latitude`, `longitude`, `timezone`, `forecast_days=5`, `current`,
  `daily`, unidades) e retorna a resposta bruta tipada.
- **Critérios de aceite:**
  - Requisição usa timeout de 10s do `openMeteoClient` (FR-05, NFR
    performance).
  - Parâmetros da URL conferem exatamente com os definidos no plano.
- **Dependências:** T-08, T-05.
- **Arquivos:** `src/services/weatherService.ts`.
- **Tipo:** Data.

### T-20 — Implementar mapeamento de código climático (`weatherCode`)

- **Descrição:** Criar `src/utils/weatherCode.ts` mapeando `weather_code`
  para `label` e `iconAlt` acessível.
- **Critérios de aceite:**
  - Cobre os códigos usados nos exemplos do plano (0, 1, 2, 3, 61, etc.).
  - Código desconhecido retorna um fallback textual, sem quebrar a UI.
- **Dependências:** T-05.
- **Arquivos:** `src/utils/weatherCode.ts`.
- **Tipo:** Data.

### T-21 — Implementar utilitário de direção do vento (`wind`)

- **Descrição:** Criar `src/utils/wind.ts` convertendo graus em ponto
  cardeal (`windDirectionCardinal`).
- **Critérios de aceite:**
  - Mapeamento correto para os 8/16 pontos cardeais a partir de graus 0–360.
  - Entrada `null`/ausente retorna `null`.
- **Dependências:** T-05.
- **Arquivos:** `src/utils/wind.ts`.
- **Tipo:** Data.

### T-22 — Implementar utilitário de data/hora (`dateTime`)

- **Descrição:** Criar `src/utils/dateTime.ts` com funções para formatar
  datas/horas ISO em pt-BR usando o timezone da cidade, e calcular idade do
  cache em horas e minutos.
- **Critérios de aceite:**
  - Formata `measuredAtLocal`, `sunriseLocal`, `sunsetLocal` e `dateLocal`
    em pt-BR (FR-05, FR-07).
  - Calcula idade do cache em horas e minutos a partir de `cachedAt`
    (FR-10, FR-15).
- **Dependências:** T-05.
- **Arquivos:** `src/utils/dateTime.ts`.
- **Tipo:** Data.

### T-23 — Implementar utilitário de temperatura (`temperature`)

- **Descrição:** Criar `src/utils/temperature.ts` com conversão
  Celsius↔Fahrenheit e arredondamento para uma casa decimal.
- **Critérios de aceite:**
  - Conversão correta e arredondada para 1 casa decimal (FR-08).
  - Entrada `null` retorna `null`.
- **Dependências:** T-05.
- **Arquivos:** `src/utils/temperature.ts`.
- **Tipo:** Data.

### T-24 — Testes unitários dos utilitários (`weatherCode`, `wind`, `dateTime`, `temperature`)

- **Descrição:** Cobrir os casos de conversão, mapeamento e formatação
  descritos na Testing Strategy do plano.
- **Critérios de aceite:**
  - Cobre mapeamento de código climático, direção do vento, formatação de
    data/hora, idade de cache e conversão de temperatura com 1 casa decimal.
- **Dependências:** T-20, T-21, T-22, T-23.
- **Arquivos:** `tests/unit/utils/weatherCode.test.ts`,
  `tests/unit/utils/wind.test.ts`, `tests/unit/utils/dateTime.test.ts`,
  `tests/unit/utils/temperature.test.ts`.
- **Tipo:** Test.

### T-25 — Implementar adaptador de normalização (`WeatherReport`)

- **Descrição:** Criar função adaptadora (em `src/services/weatherService.ts`
  ou módulo próprio) que transforma a resposta bruta de forecast em
  `WeatherReport`, usando os utilitários de T-20 a T-23, selecionando
  exatamente 5 dias e marcando campos ausentes como `null`.
- **Critérios de aceite:**
  - Resultado tem exatamente 5 itens em `daily` (hoje + 4 dias) (FR-06).
  - Resposta com menos de 5 dias válidos é tratada como inválida
    (`invalid-response-error`).
  - Campos opcionais ausentes (ex.: `uv_index`, sunrise/sunset) viram `null`
    sem quebrar os demais campos (FR-07, FR-15).
- **Dependências:** T-19, T-20, T-21, T-22, T-23.
- **Arquivos:** `src/services/weatherService.ts`.
- **Tipo:** Data.

### T-26 — Testes unitários do adaptador de normalização

- **Descrição:** Testar normalização com resposta completa, resposta com
  campos opcionais ausentes e resposta inválida (menos de 5 dias).
- **Critérios de aceite:**
  - Cobre resposta completa, campos ausentes (`uv_index`, `sunrise`,
    `sunset`) e resposta com menos de 5 dias válidos.
- **Dependências:** T-25.
- **Arquivos:** `tests/unit/services/weatherService.forecast.test.ts`.
- **Tipo:** Test.

### T-27 — Estender hook `useWeatherSearch` para buscar previsão

- **Descrição:** Adicionar ao hook estado `selectedCity`, `report`, `status`
  e `error` para o fluxo de forecast: chamada ao service, cancelamento de
  respostas obsoletas via `AbortController` e substituição da tela apenas
  após validação (FR-12).
- **Critérios de aceite:**
  - Seleção de sugestão dispara busca de forecast para a cidade selecionada.
  - Resposta obsoleta (de seleção anterior) não substitui dados mais
    recentes (FR-12).
  - Estado `report` só é atualizado após validação bem-sucedida.
- **Dependências:** T-14, T-25.
- **Arquivos:** `src/hooks/useWeatherSearch.ts`.
- **Tipo:** Data.

### T-28 — Testes unitários do hook `useWeatherSearch` (previsão)

- **Descrição:** Testar fluxo de seleção de cidade, cancelamento de
  respostas obsoletas e não substituição de dados válidos por erro.
- **Critérios de aceite:**
  - Mock de `weatherService`; cobre seleção válida, seleção cancelada por
    nova seleção e falha após dado válido existente.
- **Dependências:** T-27.
- **Arquivos:** `tests/unit/hooks/useWeatherSearch.forecast.test.ts`.
- **Tipo:** Test.

---

## Entrega 6 — Exibição do Clima Atual e Previsão de 5 Dias

### T-29 — Criar componente `CurrentWeatherCard`

- **Descrição:** Exibir temperatura atual, condição, precipitação 24h,
  umidade, vento (velocidade/direção), sensação térmica, índice UV, data/hora
  local, fonte e última atualização.
- **Critérios de aceite:**
  - Todos os campos de FR-05 são exibidos quando disponíveis.
  - Campos ausentes (ex.: UV) mostram “Não disponível” sem ocultar os
    demais (FR-15).
  - Fonte e timestamp visíveis (FR-05, FR-15).
- **Dependências:** T-25, T-27, T-07.
- **Arquivos:** `src/components/CurrentWeatherCard.tsx`.
- **Tipo:** UI.

### T-30 — Criar componentes `ForecastList` e `ForecastDayCard`

- **Descrição:** Exibir exatamente 5 dias com mín/máx (1 casa decimal),
  condição, texto alternativo do ícone, probabilidade de chuva,
  precipitação e horários de nascer/pôr do sol.
- **Critérios de aceite:**
  - Exatamente 5 cartões renderizados (FR-06).
  - Campos ausentes mostram “Não disponível” (FR-07).
  - Ícone tem texto alternativo acessível.
- **Dependências:** T-25, T-27.
- **Arquivos:** `src/components/ForecastList.tsx`,
  `src/components/ForecastDayCard.tsx`.
- **Tipo:** UI.

### T-31 — Testes unitários e de componente de `CurrentWeatherCard` e `ForecastList`

- **Descrição:** Testar renderização com dados completos, campos opcionais
  ausentes e exatamente 5 dias.
- **Critérios de aceite:**
  - Cobre presença de todos os campos obrigatórios e mensagem “Não
    disponível” para campos ausentes.
  - Verifica quantidade de 5 cartões de previsão.
- **Dependências:** T-29, T-30.
- **Arquivos:** `tests/unit/components/CurrentWeatherCard.test.tsx`,
  `tests/unit/components/ForecastList.test.tsx`.
- **Tipo:** Test.

### T-32 — Integrar `App` com fluxo completo de busca → sugestões → previsão

- **Descrição:** Conectar `SearchForm`, `SearchSuggestions`,
  `CurrentWeatherCard`, `ForecastList` e `WeatherStatus` via
  `useWeatherSearch` no componente `App`.
- **Critérios de aceite:**
  - Fluxo completo funcional: digitar, ver sugestões, selecionar, ver
    clima atual e previsão de 5 dias (US-01, US-03, US-04).
  - Estados de carregamento e erro exibidos corretamente durante o fluxo.
- **Dependências:** T-16, T-17, T-29, T-30.
- **Arquivos:** `src/App.tsx`.
- **Tipo:** UI.

---

## Entrega 7 — Conversão de Unidade

### T-33 — Implementar `storageService` para preferência de unidade

- **Descrição:** Criar `src/services/storageService.ts` com funções para
  ler/gravar `weather.temperatureUnit` no `localStorage`, com fallback
  seguro para Celsius em caso de falha ou valor inválido.
- **Critérios de aceite:**
  - Valor inválido ou ausente retorna `celsius` (FR-09).
  - Falha de `localStorage` (ex.: exceção) não quebra a aplicação.
- **Dependências:** T-05.
- **Arquivos:** `src/services/storageService.ts`.
- **Tipo:** Data.

### T-34 — Testes unitários do `storageService` (unidade)

- **Descrição:** Testar leitura/gravação válida, valor inválido e falha
  simulada de `localStorage`.
- **Critérios de aceite:**
  - Cobre leitura válida, valor corrompido e exceção de `localStorage`.
- **Dependências:** T-33.
- **Arquivos:** `tests/unit/services/storageService.unit.test.ts`.
- **Tipo:** Test.

### T-35 — Implementar hook `useTemperatureUnit`

- **Descrição:** Criar `src/hooks/useTemperatureUnit.ts` com estado da
  unidade atual, leitura inicial via `storageService` e função de
  alternância que persiste a escolha.
- **Critérios de aceite:**
  - Unidade inicial é Celsius quando não há preferência válida (FR-09).
  - Alternância atualiza estado e tenta persistir sem recarregar a página
    (FR-08).
- **Dependências:** T-33.
- **Arquivos:** `src/hooks/useTemperatureUnit.ts`.
- **Tipo:** Data.

### T-36 — Testes unitários do hook `useTemperatureUnit`

- **Descrição:** Testar unidade inicial, alternância e persistência
  simulada.
- **Critérios de aceite:**
  - Cobre inicialização com/sem preferência salva e alternância.
- **Dependências:** T-35.
- **Arquivos:** `tests/unit/hooks/useTemperatureUnit.test.ts`.
- **Tipo:** Test.

### T-37 — Criar componente `UnitToggle`

- **Descrição:** Controle acessível para alternar entre Celsius e
  Fahrenheit, ligado ao `useTemperatureUnit`.
- **Critérios de aceite:**
  - Alternância visível e operável por teclado (US-07).
  - Estado atual anunciado na região de status (FR-11).
- **Dependências:** T-35, T-06.
- **Arquivos:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI.

### T-38 — Integrar conversão de unidade em `CurrentWeatherCard` e `ForecastList`

- **Descrição:** Aplicar `utils/temperature.ts` para converter e exibir
  todos os valores de temperatura conforme a unidade selecionada.
- **Critérios de aceite:**
  - Todos os valores de temperatura visíveis mudam ao alternar unidade,
    sem recarregar a página (FR-08, US-05).
  - Sufixo “°C”/“°F” exibido corretamente com 1 casa decimal.
- **Dependências:** T-23, T-29, T-30, T-37.
- **Arquivos:** `src/components/CurrentWeatherCard.tsx`,
  `src/components/ForecastList.tsx`, `src/components/ForecastDayCard.tsx`.
- **Tipo:** UI.

---

## Entrega 8 — Cache e Resiliência

### T-39 — Implementar cache de previsão no `storageService`

- **Descrição:** Adicionar funções para ler/gravar `weather.lastReport`
  (`CachedWeatherReport`) com expiração de 24 horas.
- **Critérios de aceite:**
  - Cache com menos de 24h é retornado como válido; com mais de 24h é
    descartado (FR-10).
  - Falha de `localStorage` não interrompe o fluxo principal.
- **Dependências:** T-33, T-05.
- **Arquivos:** `src/services/storageService.ts`.
- **Tipo:** Data.

### T-40 — Testes unitários do cache de previsão

- **Descrição:** Testar gravação, leitura válida, expiração após 24h e
  falha de `localStorage`.
- **Critérios de aceite:**
  - Cobre cache válido, cache expirado (>24h) e exceção de storage.
- **Dependências:** T-39.
- **Arquivos:** `tests/unit/services/storageService.cache.test.ts`.
- **Tipo:** Test.

### T-41 — Integrar fallback de cache no hook `useWeatherSearch`

- **Descrição:** Ao falhar uma busca de forecast, tentar carregar cache
  válido; com cache válido, exibir com indicação de desatualização e idade;
  sem cache válido, exibir estado de erro com “Tentar novamente”.
- **Critérios de aceite:**
  - Falha de rede com cache válido exibe última previsão com idade em
    horas/minutos (US-06).
  - Falha de rede sem cache válido exibe erro e “Tentar novamente” (US-06).
  - Nova previsão validada com sucesso grava novo cache (FR-10).
- **Dependências:** T-27, T-39, T-22.
- **Arquivos:** `src/hooks/useWeatherSearch.ts`.
- **Tipo:** Data.

### T-42 — Testes unitários do fallback de cache no hook

- **Descrição:** Testar os três cenários: falha com cache válido, falha sem
  cache e sucesso gravando novo cache.
- **Critérios de aceite:**
  - Cobre os três cenários acima com mocks de `weatherService` e
    `storageService`.
- **Dependências:** T-41.
- **Arquivos:** `tests/unit/hooks/useWeatherSearch.cache.test.ts`.
- **Tipo:** Test.

### T-43 — Implementar botão "Tentar novamente"

- **Descrição:** Conectar a ação de retry do `WeatherStatus` ao hook,
  repetindo a consulta da cidade selecionada sem recarregar a página.
- **Critérios de aceite:**
  - Clique em "Tentar novamente" repete a última consulta (FR-14).
  - Ação disponível apenas quando há cidade selecionada ou consulta
    repetível.
- **Dependências:** T-07, T-27, T-41.
- **Arquivos:** `src/components/WeatherStatus.tsx`,
  `src/hooks/useWeatherSearch.ts`.
- **Tipo:** UI.

---

## Entrega 9 — Hardening (Erros, Acessibilidade, Responsividade)

### T-44 — Registrar erros relevantes via `console.error`

- **Descrição:** Adicionar logging de erros de rede, timeout e resposta
  inválida com contexto mínimo (cidade, categoria, status), sem dados
  sensíveis.
- **Critérios de aceite:**
  - Erros relevantes geram `console.error` com contexto mínimo, sem
    credenciais ou dados sensíveis (NFR operação/segurança).
- **Dependências:** T-25, T-27.
- **Arquivos:** `src/services/weatherService.ts`,
  `src/hooks/useWeatherSearch.ts`.
- **Tipo:** Infra.

### T-45 — Auditoria de acessibilidade (WCAG 2.1 AA)

- **Descrição:** Revisar nomes acessíveis, foco visível, ordem lógica de
  foco, contraste (4,5:1 texto comum, 3:1 componentes/foco) e suporte a
  zoom 200% em todos os componentes.
- **Critérios de aceite:**
  - Nenhuma violação crítica identificada nos fluxos de busca, seleção e
    consulta (US-07, NFR acessibilidade).
  - Contraste e foco visível conferem com os mínimos definidos na spec.
- **Dependências:** T-32, T-38, T-43.
- **Arquivos:** `src/components/*.tsx`, `src/index.css`.
- **Tipo:** UI.

### T-46 — Revisão de responsividade (320–1440 px)

- **Descrição:** Ajustar layout e alvos de toque (mín. 44×44 px) para
  funcionar sem overflow horizontal ou sobreposição em 320, 360, 768 e
  1440 px.
- **Critérios de aceite:**
  - Sem overflow horizontal ou sobreposição nas larguras testadas
    (FR-13).
  - Alvos de toque com pelo menos 44×44 px.
- **Dependências:** T-32, T-38, T-43.
- **Arquivos:** `src/components/*.tsx`, `src/index.css`,
  `tailwind.config.js`.
- **Tipo:** UI.

### T-47 — Revisão de segurança de entrada e saída de dados

- **Descrição:** Confirmar que entradas do usuário são tratadas como dados
  (sem `dangerouslySetInnerHTML` ou interpolação insegura) e que respostas
  de erro da fonte não expõem detalhes internos na UI.
- **Critérios de aceite:**
  - Nenhuma renderização de conteúdo do usuário como HTML/executável
    (NFR segurança).
  - Mensagens de erro exibidas ao usuário não contêm stack traces ou
    detalhes internos da API.
- **Dependências:** T-16, T-17, T-07.
- **Arquivos:** `src/components/*.tsx`.
- **Tipo:** Infra.

---

## Entrega 10 — Testes E2E

### T-48 — E2E: busca válida, seleção e exibição da previsão completa

- **Descrição:** Interceptar geocoding e forecast com `page.route`;
  buscar cidade válida, selecionar sugestão e validar clima atual + 5 dias.
- **Critérios de aceite:**
  - Fluxo completo passa em Chromium, Firefox e WebKit (US-01, US-03,
    US-04).
- **Dependências:** T-32, T-38.
- **Arquivos:** `tests/e2e/search-and-forecast.spec.ts`.
- **Tipo:** Test.

### T-49 — E2E: desambiguação de cidade homônima

- **Descrição:** Simular resposta de geocoding com cidades homônimas e
  validar exibição de cidade, país e região nas sugestões.
- **Critérios de aceite:**
  - Sugestões exibem país e região; seleção correta carrega a previsão da
    cidade escolhida (US-02).
- **Dependências:** T-48.
- **Arquivos:** `tests/e2e/city-disambiguation.spec.ts`.
- **Tipo:** Test.

### T-50 — E2E: entrada inválida não dispara consulta

- **Descrição:** Testar campo vazio, com espaços, 1 caractere e 81
  caracteres, validando que nenhuma requisição é disparada.
- **Critérios de aceite:**
  - Nenhuma chamada de rede ocorre para entradas inválidas; validação é
    exibida (FR-01, US-01).
- **Dependências:** T-48.
- **Arquivos:** `tests/e2e/invalid-input.spec.ts`.
- **Tipo:** Test.

### T-51 — E2E: alternância de unidade com persistência

- **Descrição:** Alternar para Fahrenheit, validar conversão sem reload e
  confirmar persistência após recarregar a página.
- **Critérios de aceite:**
  - Conversão ocorre sem reload; unidade persiste após reload (US-05).
- **Dependências:** T-48, T-38.
- **Arquivos:** `tests/e2e/unit-toggle.spec.ts`.
- **Tipo:** Test.

### T-52 — E2E: falha de rede com e sem cache válido

- **Descrição:** Simular falha de rede após uma consulta válida (cache
  disponível) e falha de rede sem consulta anterior (sem cache).
- **Critérios de aceite:**
  - Com cache válido, exibe última previsão com idade do cache (US-06).
  - Sem cache, exibe erro e botão "Tentar novamente" (US-06).
- **Dependências:** T-48, T-41, T-43.
- **Arquivos:** `tests/e2e/network-failure-cache.spec.ts`.
- **Tipo:** Test.

### T-53 — E2E: responsividade em múltiplos viewports

- **Descrição:** Executar o fluxo principal nos viewports 320, 360, 768 e
  1440 px validando ausência de overflow horizontal e sobreposição.
- **Critérios de aceite:**
  - Nenhum overflow horizontal ou sobreposição detectado nas 4 larguras
    (FR-13).
- **Dependências:** T-48, T-46.
- **Arquivos:** `tests/e2e/responsive-viewports.spec.ts`.
- **Tipo:** Test.
