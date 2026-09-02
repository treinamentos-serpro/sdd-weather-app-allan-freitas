# Plano Técnico — Weather App

**Fonte da verdade:** `specs/weather-app-spec.md`  
**Data:** 2026-09-02  
**Status:** Pronto para quebra em tarefas

## Architecture

O MVP será uma aplicação web client-side, responsiva e sem autenticação,
construída com React + Vite. A arquitetura será organizada em camadas simples:

```mermaid
flowchart TD
    UI["UI React<br/>(components/)"]
    Hooks["Hooks de estado e orquestração<br/>(hooks/)"]
    Services["Services<br/>(services/)"]
    Adapters["Adaptadores de normalização<br/>(utils/)"]
    Geocoding[("Open-Meteo<br/>Geocoding API")]
    Forecast[("Open-Meteo<br/>Forecast API")]
    Storage[("localStorage")]

    UI -->|evento de busca / seleção| Hooks
    Hooks -->|estado validado| UI
    Hooks --> Services
    Services --> Adapters
    Adapters -->|WeatherReport normalizado| Hooks
    Services --> Geocoding
    Services --> Forecast
    Services --> Storage
```

Responsabilidades principais:

- **Componentes de UI:** renderizam busca, sugestões, clima atual, previsão de
  cinco dias, alternância de unidade e estados de feedback. Atendem FR-01,
  FR-02, FR-03, FR-05, FR-06, FR-07, FR-08, FR-11, FR-13 e US-07.
- **Hooks:** concentram estado da tela, controle de requisições concorrentes,
  retry, seleção de cidade e conversão de unidade. Atendem FR-09, FR-10,
  FR-12 e FR-14.
- **Services:** encapsulam chamadas HTTP, timeout de 10 segundos, parse das
  respostas e acesso resiliente ao `localStorage`. Atendem FR-02, FR-10,
  FR-15 e requisitos não funcionais de confiabilidade.
- **Adaptadores:** traduzem respostas da Open-Meteo para um modelo interno
  estável, marcam campos ausentes como opcionais e mapeiam códigos climáticos
  para texto e ícone acessível. Atendem FR-04, FR-05, FR-07 e FR-15.

A aplicação exibirá uma cidade por vez. Dados da tela só serão substituídos
depois que a nova previsão for validada, evitando que respostas antigas
sobrescrevam uma busca mais recente.

## Tech Stack

- **TypeScript strict:** reduz erros de contrato em respostas externas e
  estados de UI.
- **React + Vite:** entrega leve para SPA pública, com bom ciclo de
  desenvolvimento e build simples.
- **Tailwind CSS:** implementação mobile-first do tema escuro com glassmorphism,
  mantendo consistência visual do projeto.
- **Open-Meteo Geocoding API:** sugestões de cidades sem chave de API.
- **Open-Meteo Forecast API:** clima atual, previsão diária e timezone local.
- **localStorage:** preferência de unidade e cache da última consulta no mesmo
  navegador, sem backend.
- **Vitest + Testing Library:** testes unitários de services, adaptadores, hooks
  e comportamento acessível dos componentes.
- **Playwright:** testes E2E dos fluxos críticos em viewport mobile e desktop.
- **Biome:** lint e formatação conforme configuração do repositório.

Não haverá backend, banco de dados, autenticação, analytics ou service worker no
MVP, pois esses itens estão fora do escopo ou seriam over-engineering para a
primeira versão.

## Project Structure

Estrutura proposta para a implementação:

```text
src/
  components/
    SearchForm.tsx
    SearchSuggestions.tsx
    UnitToggle.tsx
    CurrentWeatherCard.tsx
    ForecastList.tsx
    ForecastDayCard.tsx
    WeatherStatus.tsx
  hooks/
    useWeatherSearch.ts
    useTemperatureUnit.ts
  services/
    openMeteoClient.ts
    weatherService.ts
    storageService.ts
  types/
    weather.ts
  utils/
    temperature.ts
    wind.ts
    weatherCode.ts
    dateTime.ts
  App.tsx
  main.tsx
  index.css
tests/
  unit/
  e2e/
```

Responsabilidades:

- `components/`: apenas apresentação, eventos de usuário e acessibilidade.
- `hooks/`: coordenação de estado, abort/ignore de respostas obsoletas e retry.
- `services/`: I/O externo, timeout, cache e normalização de erros.
- `types/`: contratos compartilhados entre services, hooks e UI.
- `utils/`: funções puras de conversão, formatação e mapeamento.
- `tests/`: cobertura unitária e E2E derivada dos critérios de aceite.

## Data Model

Contratos internos previstos, sem implementação final:

```ts
type TemperatureUnit = 'celsius' | 'fahrenheit';

interface CitySuggestion {
  id: number;
  name: string;
  country: string;
  countryCode?: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface WeatherLocation {
  city: CitySuggestion;
  displayName: string;
}

interface CurrentWeather {
  temperatureCelsius: number;
  apparentTemperatureCelsius: number;
  condition: WeatherCondition;
  precipitationLast24hMm: number | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  windDirectionDegrees: number | null;
  windDirectionCardinal: string | null;
  uvIndex: number | null;
  measuredAtLocal: string;
}

interface DailyForecast {
  dateLocal: string;
  minTemperatureCelsius: number | null;
  maxTemperatureCelsius: number | null;
  condition: WeatherCondition;
  rainProbabilityPercent: number | null;
  precipitationMm: number | null;
  sunriseLocal: string | null;
  sunsetLocal: string | null;
}

interface WeatherCondition {
  code: number | null;
  label: string;
  iconAlt: string;
}

interface WeatherReport {
  location: WeatherLocation;
  current: CurrentWeather;
  daily: DailyForecast[];
  source: 'Open-Meteo';
  fetchedAt: string;
  timezone: string;
}

interface CachedWeatherReport {
  report: WeatherReport;
  cachedAt: string;
  expiresAt: string;
}

type WeatherViewStatus =
  | 'idle'
  | 'validating'
  | 'loading-suggestions'
  | 'loading-weather'
  | 'invalid-input'
  | 'empty-results'
  | 'network-error'
  | 'timeout-error'
  | 'rate-limit-error'
  | 'invalid-response-error'
  | 'cached-data';
```

Decisões de modelo:

- Temperaturas serão armazenadas internamente em Celsius e convertidas para
  Fahrenheit apenas na apresentação.
- Campos opcionais ou ausentes da fonte serão `null` no modelo interno e
  renderizados como “Não disponível”.
- `daily` deve conter exatamente cinco itens após normalização; resposta com
  menos dias válidos será tratada como resposta inválida.
- Horários serão preservados como strings ISO/localizadas da fonte e formatados
  para pt-BR na UI, usando o timezone da cidade.

## Data Flow

Fluxo de sugestões:

1. Usuário digita no campo de busca.
2. Entrada é trimada e validada entre 2 e 80 caracteres.
3. Após 2 caracteres, o hook solicita sugestões ao service de geocoding.
4. Cada nova consulta cancela ou invalida a anterior via `AbortController` ou
   identificador incremental.
5. A UI exibe até cinco sugestões com cidade, país e região quando disponível.
6. Nenhum resultado gera estado específico de vazio, sem tentar tratar texto
   livre como coordenada.

Fluxo de previsão:

1. Usuário seleciona uma sugestão válida.
2. O hook solicita forecast para latitude, longitude e timezone da cidade.
3. O service aplica timeout de 10 segundos e normaliza a resposta.
4. Adaptadores validam dados mínimos, selecionam hoje + quatro dias no fuso da
   cidade e mapeiam condições climáticas.
5. Se a resposta for válida, a tela substitui a previsão anterior, registra
   `fetchedAt` e salva cache por até 24 horas.
6. Se a resposta falhar, o hook tenta carregar cache válido da última consulta.
7. Com cache válido, a UI exibe os dados com indicação de desatualização e idade
   em horas/minutos; sem cache, exibe erro com “Tentar novamente”.

Fluxo de unidade:

1. A aplicação inicia em Celsius ou lê a preferência persistida.
2. Preferência inválida ou falha de leitura usa Celsius.
3. A alternância atualiza o estado local e tenta persistir a escolha.
4. Valores visíveis são convertidos sem recarregar a página.

## External APIs

### Open-Meteo Geocoding API

Endpoint:

```text
GET https://geocoding-api.open-meteo.com/v1/search
```

Parâmetros previstos:

- `name`: texto informado pelo usuário, trimado.
- `count=5`: limite de sugestões exibidas.
- `language=pt`: preferir nomes/localização em português quando disponível.
- `format=json`: formato da resposta.

Campos relevantes da resposta:

- `id`
- `name`
- `country`
- `country_code`
- `admin1`
- `latitude`
- `longitude`
- `timezone`

### Open-Meteo Forecast API

Endpoint:

```text
GET https://api.open-meteo.com/v1/forecast
```

Parâmetros previstos:

- `latitude` e `longitude`: coordenadas da sugestão selecionada.
- `timezone`: timezone da cidade quando disponível, ou `auto` como fallback
  controlado.
- `forecast_days=5`: hoje e quatro dias seguintes.
- `current`: temperatura, sensação térmica, precipitação, umidade, vento,
  direção do vento, código climático e índice UV quando suportado.
- `daily`: mínima, máxima, código climático, probabilidade de precipitação,
  precipitação acumulada, nascer e pôr do sol.
- `wind_speed_unit=kmh`: vento em km/h.
- `temperature_unit=celsius`: base única para normalização e conversão local.
- `precipitation_unit=mm`: precipitação em milímetros.

Observações:

- A disponibilidade exata de alguns campos atuais, como UV e precipitação nas
  últimas 24 horas, deve ser validada operacionalmente contra a Open-Meteo antes
  do lançamento.
- Caso um campo opcional não venha na resposta, o adaptador deve preservar os
  demais dados e marcar o campo como indisponível.
- Rate limiting, timeout, erro HTTP e JSON inválido serão normalizados em erros
  de domínio para a UI.

## State Management

Estado local com React será suficiente para o MVP.

Estados previstos:

- `query`: texto digitado.
- `suggestions`: lista atual de até cinco cidades.
- `selectedCity`: cidade selecionada para previsão e retry.
- `report`: previsão validada exibida na tela.
- `temperatureUnit`: Celsius ou Fahrenheit.
- `status`: estado discriminado da tela.
- `error`: erro normalizado, quando houver.
- `isShowingCache`: indica que a previsão exibida veio do cache.
- `lastRequestId` ou `AbortController`: proteção contra respostas obsoletas.

Persistência local:

- `weather.temperatureUnit`: `celsius` ou `fahrenheit`.
- `weather.lastReport`: `CachedWeatherReport`, com expiração de 24 horas.

Decisões:

- Não usar Redux, Zustand ou React Query no MVP; a complexidade de estado é
  pequena e concentrada.
- Requisições concorrentes serão controladas no hook, mantendo components mais
  simples e testáveis.
- A previsão anterior permanece visível até que a nova previsão seja validada,
  conforme FR-12.

## Error Handling

Estratégia geral:

- Validar entrada antes de chamar APIs: vazio, menos de 2 caracteres ou mais de
  80 caracteres geram `invalid-input`.
- Aplicar timeout de 10 segundos em geocoding e forecast.
- Cancelar ou ignorar respostas antigas quando uma nova consulta começar.
- Normalizar falhas em categorias exibíveis: rede, timeout, rate limiting,
  resposta inválida, nenhum resultado e cache.
- Oferecer “Tentar novamente” quando houver cidade selecionada ou consulta
  repetível.
- Preservar dados válidos existentes até que uma nova previsão seja confirmada.

Fallback por cache:

- Cache válido: até 24 horas desde `cachedAt`.
- Cache expirado: descartar e não exibir como previsão válida.
- Quando usado, exibir origem, timestamp original e idade do cache em horas e
  minutos.
- Se `localStorage` falhar, continuar o fluxo principal sem persistência.

Mensagens e acessibilidade:

- Estados de carregamento, erro, cidade selecionada e unidade devem ser
  anunciados por região de status para tecnologias assistivas.
- Controles devem ter nome acessível, foco visível e operação por teclado.
- Dados indisponíveis devem aparecer como “Não disponível”, sem bloquear o
  restante da previsão.

## Testing Strategy

Testes unitários com Vitest + Testing Library:

- Validação do input: trim, limites 2-80 e caracteres especiais.
- Conversão Celsius/Fahrenheit com uma casa decimal.
- Mapeamento de direção do vento em graus para ponto cardeal.
- Mapeamento de códigos climáticos para texto e `iconAlt`.
- Normalização da Open-Meteo para `WeatherReport` com exatamente cinco dias.
- Tratamento de campos opcionais ausentes como `null` / “Não disponível”.
- Expiração do cache após 24 horas e tolerância a falhas de `localStorage`.
- Cancelamento/ignorar respostas obsoletas em sugestões e previsão.
- Estados de UI: inicial, carregamento, vazio, erro, cache e retry.
- Acessibilidade básica: nomes acessíveis, roles/status e navegação por teclado.

Testes E2E com Playwright:

- Buscar cidade válida, selecionar sugestão e ver clima atual + cinco dias.
- Cidade homônima exibindo cidade, país e região.
- Entrada inválida não dispara consulta e mostra validação.
- Alternância para Fahrenheit converte dados sem recarregar e persiste após
  reload.
- Falha de rede com cache válido exibe última previsão e idade do cache.
- Falha de rede sem cache exibe erro e botão “Tentar novamente”.
- Viewports 320, 360, 768 e 1440 px sem overflow horizontal nem sobreposição.

Validações finais antes de concluir tarefas:

```text
pnpm lint
pnpm build
pnpm test
```

## Risks & Trade-offs

| Risco / trade-off | Impacto | Decisão / mitigação |
| --- | --- | --- |
| Dependência da Open-Meteo | Alto | Usar timeout, cache de última consulta, erros claros e validação operacional antes do lançamento. |
| Campos da API diferentes do esperado | Alto | Adaptadores isolados, dados opcionais como `null` e testes com fixtures de resposta. |
| Precipitação das últimas 24h ou UV indisponíveis no endpoint escolhido | Médio | Tratar como opcional quando a fonte não fornecer; validar possibilidade de compor via dados horários antes do lançamento. |
| Conexão lenta em dispositivos móveis | Médio | Bundle simples, sem backend próprio, UI leve e feedback de carregamento. |
| Respostas obsoletas sobrescrevendo dados recentes | Médio | `AbortController` e/ou `requestId` no hook de orquestração. |
| `localStorage` indisponível | Baixo | Falha silenciosa controlada, Celsius como padrão e app funcional sem persistência. |
| Acessibilidade em tema escuro glassmorphism | Médio | Contraste mínimo, foco visível, testes automatizados e revisão manual de teclado. |
| Crescimento de tráfego acima do previsto | Médio | Limitar consultas repetitivas no cliente e reavaliar cache/CDN/backend em versão futura. |
| Simplicidade sem biblioteca de cache HTTP | Baixo | Estado local reduz dependências; se os fluxos crescerem, React Query pode ser reavaliado depois do MVP. |

Itens fora do plano do MVP:

- Login, favoritos, histórico completo, geolocalização automática, notificações,
  analytics, PWA/service worker, backend próprio e previsão além de cinco dias.