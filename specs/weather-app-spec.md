# Especificação de Produto — Weather App

**Data:** 2026-09-02  
**Versão:** 2.0  
**Status:** Aprovada para planejamento do MVP

## Overview

O Weather App é uma aplicação web pública de previsão do tempo, com experiência
mobile-first, que permite consultar rapidamente as condições atuais e a
previsão dos próximos cinco dias para uma cidade. O produto atende pessoas que
planejam atividades, viajam ou trabalham em locais com conectividade limitada.

### Objetivos

- Permitir uma consulta meteorológica clara, rápida e acessível.
- Apresentar informações suficientes para decisões do dia a dia e planejamento
  da semana.
- Oferecer uma experiência confiável em dispositivos móveis e conexões lentas.
- Reduzir a dependência de conectividade contínua exibindo a última consulta
  disponível quando não houver novos dados.

### Público-alvo

- **Planejadores semanais:** precisam comparar os próximos dias antes de marcar
  atividades.
- **Turistas casuais:** querem descobrir rapidamente o clima de hoje e amanhã.
- **Profissionais em campo:** precisam consultar dados recentes em áreas com
  internet instável.

### Escopo do MVP

O MVP será uma aplicação web responsiva, sem login, com interface em português
do Brasil e tema visual escuro. Open-Meteo será a fonte meteorológica do MVP,
sujeita à validação operacional antes do lançamento. A aplicação deverá
identificar a fonte e o horário dos dados exibidos.

## Functional Requirements

### FR-01 — Busca de cidade

O usuário deve poder informar de 2 a 80 caracteres, desconsiderando espaços nas
extremidades, e iniciar uma busca meteorológica por botão ou pela tecla Enter.
Entradas vazias, menores que 2 ou maiores que 80 caracteres não devem ser
enviadas.

### FR-02 — Sugestões de busca

Após o usuário digitar pelo menos 2 caracteres, o produto deve apresentar no
máximo 5 sugestões compatíveis. A consulta de sugestões deve ser cancelada ou
ignorada quando uma nova consulta for iniciada antes da resposta anterior.

### FR-03 — Desambiguação de cidades

Cada sugestão deve informar nome da cidade, país e, quando disponível, região.
O usuário deve selecionar uma sugestão para carregar a previsão; texto que não
corresponda a uma sugestão não deve ser tratado como coordenada válida.

### FR-04 — Busca com caracteres especiais

O produto deve aceitar acentos, cedilha, hífen, apóstrofo e capitalização
variada. A busca deve ser case-insensitive e preservar a grafia oficial no
resultado exibido.

### FR-05 — Exibição do clima atual

Após uma busca válida, o produto deve exibir, para a cidade selecionada:

- temperatura atual;
- condição do céu;
- precipitação acumulada nas últimas 24 horas, em milímetros;
- umidade;
- velocidade do vento, em km/h, e direção em graus e ponto cardeal;
- sensação térmica;
- índice UV, quando disponível;
- data e hora local da medição;
- fonte dos dados e horário da última atualização.

### FR-06 — Previsão para cinco dias

O produto deve exibir exatamente 5 dias, contando o dia atual e os 4 dias
seguintes no fuso horário da cidade selecionada.

### FR-07 — Dados diários da previsão

Cada dia deve informar temperatura mínima e máxima em uma casa decimal,
condição meteorológica, texto alternativo do ícone, probabilidade de chuva em
percentual, precipitação acumulada em milímetros e horários de nascer e pôr do
sol no fuso local. Campos não fornecidos pela fonte devem exibir “Não
disponível”.

### FR-08 — Alternância de unidade

O usuário deve poder alternar entre Celsius e Fahrenheit. A unidade inicial deve
ser Celsius. Temperaturas devem ser exibidas com uma casa decimal e o sufixo
“°C” ou “°F”.

### FR-09 — Persistência da preferência

A unidade escolhida deve permanecer definida no mesmo dispositivo e navegador,
sem exigir login. Se a preferência não puder ser lida ou gravada, a aplicação
deve continuar funcionando e usar Celsius.

### FR-10 — Cache da última consulta

O produto deve manter localmente a última previsão consultada, sua cidade e o
horário da consulta, por no máximo 24 horas, para visualização quando uma nova
consulta falhar. O cache deve ser descartado após esse prazo.

### FR-11 — Estados de carregamento, vazio e erro

O produto deve apresentar estados distintos para: início sem consulta,
carregamento, entrada inválida, nenhum resultado, erro de rede, timeout,
resposta inválida e dados de cache. Cada erro deve oferecer a ação “Tentar
novamente” quando uma nova requisição for possível.

### FR-12 — Atualização de uma cidade por vez

O produto deve apresentar uma cidade por vez e substituir a consulta anterior
somente após a nova previsão ser validada. Uma resposta antiga não pode
substituir dados de uma busca mais recente.

### FR-13 — Uso em dispositivos móveis

Todas as funções do MVP devem estar disponíveis em telas de 320 px a 1440 px de
largura, com alvos de toque de pelo menos 44 por 44 px, sem zoom obrigatório,
overflow horizontal ou sobreposição de conteúdo.

### FR-14 — Nova tentativa

Após erro de rede, timeout, rate limiting ou resposta inválida, o usuário deve
poder acionar “Tentar novamente”. A ação deve repetir a consulta da cidade
selecionada sem recarregar a aplicação.

### FR-15 — Metadados e dados indisponíveis

O produto deve exibir a origem e o timestamp dos dados atuais ou armazenados. A
idade do cache deve ser exibida em horas e minutos. Dados opcionais ausentes
devem ser marcados como “Não disponível”, sem impedir a exibição dos demais
campos.

## User Stories

### US-01 — Consulta rápida

Como turista casual, quero buscar uma cidade pelo nome para saber rapidamente
como está o tempo no local que estou visitando.

### US-02 — Escolha do local correto

Como usuário que pesquisa uma cidade com homônimos, quero ver país e região nas
sugestões para selecionar o destino correto.

### US-03 — Planejamento do dia

Como usuário que planeja atividades diárias, quero consultar o clima atual e
seus principais indicadores para decidir o que fazer e o que vestir.

### US-04 — Planejamento da semana

Como planejadora de semana, quero visualizar cinco dias de previsão para
escolher os melhores dias para minhas atividades.

### US-05 — Preferência de unidade

Como usuário internacional, quero alternar entre Celsius e Fahrenheit para
interpretar a temperatura na unidade que conheço.

### US-06 — Consulta com conectividade limitada

Como profissional em campo, quero ver a última previsão consultada quando a
internet estiver indisponível para não perder acesso aos dados recentes.

### US-07 — Consulta acessível

Como usuário com necessidade de acessibilidade, quero navegar e compreender os
dados usando teclado ou leitor de tela para consultar o clima com autonomia.

## Acceptance Criteria

### Critérios da US-01

- Dado que o usuário informa um nome de cidade válido, quando inicia a busca,
  então o produto exibe a cidade selecionada e uma previsão válida.
- Dado que o campo contém menos de 2 ou mais de 80 caracteres, quando o usuário
  tenta buscar, então a aplicação exibe validação e não envia a consulta.

### Critérios da US-02

- Dado que a busca retorna cidades homônimas, quando as sugestões são exibidas,
  então cada opção mostra nome da cidade, país e região quando disponível, com
  no máximo 5 opções.
- Dado que o usuário seleciona uma sugestão, quando a seleção é concluída,
  então a previsão exibida corresponde ao local escolhido.

### Critérios da US-03

- Dado que existe uma cidade selecionada, quando a previsão é carregada, então
  a tela exibe todos os campos obrigatórios de FR-05, com as unidades definidas.
- Dado que o índice UV está disponível, quando a previsão é carregada, então o
  índice UV é exibido junto às informações atuais.
- Dado que a cidade possui fuso horário conhecido, quando os dados são exibidos,
  então a data e hora local da medição são exibidas junto da fonte e da última
  atualização.

### Critérios da US-04

- Dado que existe uma cidade selecionada, quando a previsão é carregada, então
  são exibidos exatamente cinco dias calculados no fuso da cidade: hoje e os
  quatro dias seguintes.
- Para cada dia, são exibidos mínima e máxima com uma casa decimal, condição,
  texto alternativo do ícone, probabilidade percentual e precipitação em mm.
- Quando um campo opcional não é fornecido, o respectivo valor é “Não disponível”
  e os demais dados continuam visíveis.

### Critérios da US-05

- Dado que a unidade atual é Celsius, quando o usuário seleciona Fahrenheit,
  então todos os valores de temperatura visíveis são convertidos e identificados
  como Fahrenheit sem recarregar a página.
- Dado que o usuário selecionou Fahrenheit, quando retorna ao produto no mesmo
  dispositivo e navegador, então Fahrenheit permanece selecionado.
- Dado que nenhuma preferência foi registrada ou ela é inválida, então a unidade
  apresentada é Celsius.

### Critérios da US-06

- Dado que existe uma previsão previamente consultada, quando uma nova tentativa
  de atualização falha por indisponibilidade de rede, então a última previsão é
  exibida com indicação de que pode estar desatualizada.
- Dado que não existe previsão armazenada, quando a rede falha, então o produto
  exibe o estado de erro e o controle “Tentar novamente”.
- Dado que há cache com mais de 24 horas, quando a rede falha, então o cache não
  é exibido como previsão válida.

### Critérios da US-07

- Todos os controles e resultados relevantes possuem nome acessível e podem ser
  alcançados e operados pelo teclado.
- Alterações de carregamento, erro, cidade selecionada e unidade são anunciadas
  por uma região de status para tecnologias assistivas.
- O contraste de texto comum é de pelo menos 4,5:1 e o de componentes gráficos
  e foco visível é de pelo menos 3:1.

### Matriz de cobertura dos requisitos funcionais

| Requisito | Critério de aceite verificável |
| --- | --- |
| FR-01 | Entradas de 2 a 80 caracteres são pesquisáveis; entradas fora do limite não são enviadas. |
| FR-02 | Após 2 caracteres, são exibidas no máximo 5 sugestões; respostas obsoletas não substituem as atuais. |
| FR-03 | Sugestões homônimas exibem cidade, país e região quando disponível. |
| FR-04 | Casos com acentos, cedilha, hífen, apóstrofo e capitalização variada retornam a cidade quando disponível. |
| FR-05 | Uma consulta válida exibe os campos obrigatórios com as unidades definidas. |
| FR-06 | São exibidos exatamente 5 dias no fuso da cidade selecionada. |
| FR-07 | Cada dia exibe os campos definidos; campos ausentes mostram “Não disponível”. |
| FR-08 | A troca de unidade converte temperaturas com uma casa decimal sem recarregar a página. |
| FR-09 | A unidade escolhida é restaurada no mesmo navegador; falha de persistência usa Celsius. |
| FR-10 | Cache de até 24 horas é exibido em falha de rede com sua idade; cache mais antigo é descartado. |
| FR-11 | Os estados inicial, carregamento, validação, nenhum resultado, erro e cache são distinguíveis. |
| FR-12 | Uma nova previsão validada substitui a anterior; uma resposta obsoleta não altera a tela. |
| FR-13 | Em 320 px de largura, não há overflow horizontal, sobreposição ou alvo de toque menor que 44 px. |
| FR-14 | “Tentar novamente” repete a consulta da cidade selecionada sem recarregar a aplicação. |
| FR-15 | A tela exibe fonte, timestamp e “Não disponível” para campos opcionais ausentes. |

## Non-Functional Requirements

### Performance

- Em uma execução de produção sem cache, o carregamento inicial deve ter LCP
  menor que 3 segundos no percentil 75, emulação de rede 3G e viewport de 360 x
  800 px.
- Após a resposta válida dos dados, a atualização da interface deve ocorrer em
  até 200 ms no percentil 95.
- A busca de cidade e a previsão devem usar o timeout máximo de 10 segundos;
  o tempo de espera da fonte externa deve ser medido separadamente do tempo de
  renderização da interface.

### Acessibilidade

- O produto deve atender, no mínimo, à WCAG 2.1 nível AA, sem violações
  críticas nos fluxos de busca, seleção e consulta.
- Todos os controles devem ter nome acessível, foco visível, ordem de foco
  lógica e operação completa por teclado.
- Texto comum deve ter contraste mínimo de 4,5:1; texto grande e componentes
  gráficos, de 3:1.
- O conteúdo deve permanecer utilizável com zoom de 200%, sem perda de função
  ou rolagem horizontal nos fluxos principais.

### Responsividade e compatibilidade

- A experiência deve ser mobile-first e funcionar nas larguras de 320, 360,
  768 e 1440 px.
- O aceite deve cobrir as duas versões mais recentes de Chrome, Firefox, Edge e
  Safari, além de Safari no iOS 15+ e Chrome no Android 8+.
- A interface deve funcionar com toque, sem depender de gestos complexos; alvos
  interativos devem medir pelo menos 44 por 44 px.

### Confiabilidade e disponibilidade

- A aplicação deve atingir disponibilidade mensal de 99%, excluindo falhas
  comprovadas da fonte externa; a disponibilidade da fonte deve ser reportada
  separadamente.
- Falhas externas, respostas inválidas e timeouts devem resultar em um estado
  de erro ou cache, nunca em tela vazia sem orientação.
- O cache válido deve permitir a leitura da última previsão durante uma falha
  de rede.

### Segurança e privacidade

- O produto deve ser servido exclusivamente por HTTPS em produção.
- Não deve coletar nem armazenar dados sensíveis, identificadores de usuário ou
  localização do dispositivo, e não deve exigir autenticação.
- Entradas do usuário devem ser tratadas como dados e renderizadas sem
  interpretação de conteúdo executável.
- Consultas repetitivas devem ser limitadas no cliente e respostas de erro da
  fonte não devem expor credenciais ou detalhes internos.

### Operação e suporte

- Erros relevantes devem gerar registros suficientes para diagnóstico, sem
  incluir dados sensíveis.
- A documentação do produto e do código deve ser mantida em português do Brasil.

## Edge Cases

- Campo de busca vazio, composto apenas por espaços ou com texto muito curto.
- Cidade inexistente, grafada incorretamente ou sem cobertura da fonte de dados.
- Cidade com o mesmo nome em vários países ou regiões.
- Nome com acentos, cedilha, hífen, apóstrofo ou caracteres não latinos.
- Nenhuma sugestão retornada durante a digitação.
- Usuário seleciona uma sugestão e imediatamente inicia outra busca.
- Resposta da fonte meteorológica incompleta, inconsistente ou com campo opcional
  ausente, como índice UV ou horários solares.
- Fonte meteorológica indisponível, com rate limiting, resposta inválida ou
  demora superior a 10 segundos.
- Dispositivo sem conexão na primeira consulta, sem cache anterior.
- Dispositivo sem conexão após existir uma consulta armazenada.
- Cache existente com dados antigos; o produto deve deixar sua condição de
  atualização clara ao usuário.
- Preferência de unidade ausente, inválida ou incompatível com as opções
  disponíveis.
- Permissões, armazenamento local ou recursos do navegador indisponíveis; o
  produto deve continuar utilizável sem persistência, quando possível.
- Tela estreita, orientação alterada, fonte ampliada ou conteúdo muito extenso
  sem sobreposição ou perda de informação.
- Usuário navega apenas por teclado ou utiliza leitor de tela.

## Assumptions

- Open-Meteo é a fonte meteorológica do MVP, sem necessidade de chave de API;
  cobertura, termos e disponibilidade devem ser verificados antes do lançamento.
- A aplicação será pública e não terá login, contas ou sincronização entre
  dispositivos no MVP.
- A busca será manual; geolocalização automática por GPS ou IP não fará parte
  da primeira versão.
- A interface do MVP será em português do Brasil e usará tema escuro.
- Celsius será a unidade inicial; Fahrenheit será uma alternativa selecionável.
- A preferência de unidade e a última previsão poderão ser preservadas apenas
  no dispositivo e navegador do usuário.
- O escopo temporal será de cinco dias, contando hoje e os quatro dias seguintes.
- A consulta exibirá uma cidade por vez e usará o fuso horário do local
  selecionado.
- O produto será entregue como web responsiva. A instalação como PWA não é
  requisito do MVP; o cache deve funcionar nos navegadores suportados.
- O produto será gratuito e não terá monetização, anúncios ou analytics na
  primeira versão.
- O tráfego inicial esperado é inferior a 10 mil usuários por mês.
- A entrega do MVP está estimada em dois a quatro sprints.

## Risks

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Indisponibilidade ou limitação da fonte meteorológica | Alto | Usar cache, fallback da última consulta, timeout e monitoramento de erros. |
| Experiência degradada em conexão lenta ou offline | Médio | Priorizar carregamento leve e disponibilizar a última previsão armazenada. |
| Seleção incorreta de cidade homônima | Médio | Exibir país e região nas sugestões e confirmar o local selecionado. |
| Cobertura ou qualidade insuficiente dos dados | Alto | Validar a fonte antes do lançamento e tratar campos ausentes de forma explícita. |
| Inconsistência entre navegadores e dispositivos | Médio | Testar em navegadores e tamanhos de tela representativos. |
| Crescimento de tráfego acima do previsto | Alto | Monitorar volume, limitar consultas repetitivas e planejar CDN e capacidade adicional. |
| Falhas de acessibilidade ou contraste | Médio | Validar com ferramentas automatizadas e testes manuais de teclado e leitor de tela. |
| Armazenamento local indisponível ou limpo pelo usuário | Baixo | Manter o fluxo principal utilizável sem persistência e comunicar a ausência do cache. |

## Out of Scope

- Aplicativos nativos para iOS ou Android.
- Login, cadastro, perfis ou sincronização de preferências entre dispositivos.
- Previsões históricas ou dados meteorológicos passados.
- Previsão além de cinco dias, previsão horária e séries meteorológicas avançadas.
- Detecção automática por GPS, IP ou outra forma de geolocalização.
- Alertas meteorológicos, notificações push e avisos de condições extremas.
- Compartilhamento de previsões por URL, redes sociais ou outros canais.
- Favoritos e histórico completo de cidades, enquanto não houver decisão de
  produto sobre essa funcionalidade.
- Internacionalização da interface além de português do Brasil.
- Analytics, publicidade, assinatura, monetização ou integrações corporativas.
- Integração com sistemas legados ou banco de dados próprio.
- Garantia de funcionamento quando a fonte externa estiver indisponível e não
  houver dados previamente armazenados.

## Open Questions

As questões abaixo orientam versões futuras. As decisões necessárias para o MVP
já estão registradas em Overview, Functional Requirements e Assumptions; a
validação operacional da fonte de dados permanece um gate de lançamento, não uma
questão de escopo.

1. Favoritos e histórico devem entrar em uma versão posterior? Qual prioridade
   e limite de cidades seriam esperados?
2. O produto deverá evoluir para previsão de 7, 10 ou 14 dias ou para previsão
   por hora?
3. Alertas de tempestades e notificações push serão requisitos da próxima
   versão?
4. A interface deverá incluir inglês ou outros idiomas para atender usuários
   internacionais?
5. O SLA de 99% é suficiente para produção ou será necessário um objetivo de
   99,9%?
6. Deve haver coleta de analytics com abordagem privacy-first após o MVP?
7. Haverá modelo de monetização ou integração corporativa no roadmap?
