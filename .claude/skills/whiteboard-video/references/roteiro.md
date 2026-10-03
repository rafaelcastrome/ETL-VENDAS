# Roteiro, narração e publicação

## Tom do perfil Caderno Amarelo (padrão)

O perfil é de **curiosidades e assuntos do dia a dia, leves e com humor**: "explico no papel o que ninguém te explicou". Política, finanças sérias e notícias entram só quando o usuário pedir.

- **Temas que funcionam:** perguntas que todo mundo já se fez ("por que a fila do lado anda mais rápido?"), contas surpreendentes do cotidiano (tempo de vida no trânsito, R$ 1 por dia), paradoxos simples (aniversário, espera do ônibus) e "mitos" testados com uma conta.
- **Humor:**
  - um exagero ou comparação absurda no meio ("isso dá 3 anos da sua vida olhando pro semáforo");
  - um personagem que se dá mal na história (o João que sempre escolhe a fila errada);
  - uma piada curta no fim, antes do CTA.
  - Sem humor que ofenda grupos ou pessoas reais.
- **Ritmo:** curiosidade em segundos, gancho em forma de pergunta e a resposta guardada para a "virada". Frases curtas, linguagem de conversa ("olha só", "e aqui vem o pulo do gato").
- **Visual:** mais bonecos, carinhas, balões e objetos rabiscados (relógio, ônibus, celular). Use gráficos só quando a conta pedir.

## Estrutura que prende no TikTok, Reels e Shorts

Duração padrão: 30–60 s para curiosidades leves e 45–90 s para explicações mais densas (6–9 cenas de 5–15 s). **Se o usuário pedir uma duração, ela manda.** Cada cena tem uma ideia e um desenho.

**Orçamento de fala:** a voz Kokoro (pm_alex, speed 1.1) fala cerca de **18 caracteres por segundo** (≈ 3 palavras/s); a edge-tts Antonio +10% fala num ritmo parecido. Para um vídeo de N segundos:
- total de caracteres das falas ≈ (N − soma das pausas) × 18;
- 50 s com ~6 s de pausas → ~800 caracteres.

Confira depois de gerar o áudio (`timeline.json` → `total`) e ajuste o texto se passar do pedido.

**Vídeos curtos (até ~50 s):** o CTA falado das redes custa ~5 s. Junte o "resumo" com a "virada", deixe a história em 1 cena e a moral + CTA em 1 cena.

1. **Gancho (cena 1, até ~5 s):** uma pergunta ou afirmação que contrarie o senso comum, por exemplo "Existe mesmo voto útil no primeiro turno?" ou "Seu cartão de crédito te cobra 400% ao ano?". Na tela vai o título sublinhado e um desenho simbólico. Nada de apresentação ("Oi, eu sou...").
2. **Base (1–2 cenas):** a regra ou o conceito mínimo necessário, por exemplo "para ganhar no 1º turno precisa de 50%+1".
3. **Exemplo concreto com números (2–3 cenas):** números redondos e fáceis de somar. A mão constrói o raciocínio na frente da pessoa com gráfico, setas e contas.
4. **Virada / revelação (1 cena):** o "olha o que acontece" com X vermelho, círculo e destaque.
5. **Resumo em uma frase (1 cena):** uma caixa com a conclusão, que funciona como print compartilhável.
6. **História curta (opcional, recomendada):** um personagem com nome comum (João, Maria) vivendo a situação. Use um boneco, balão de pensamento e um "resultado" carimbado. Histórias aumentam a retenção no fim do vídeo.
7. **Moral + CTA:** a moral em 2 linhas e "Gostou? Me segue!" com as redes (`WB.ctaRedes`). Na narração: "Me segue no Instagram, arroba ..., e no TikTok, arroba ...".

Texto da fala: frases curtas, voz ativa, segunda pessoa ("você"). Evite parênteses e listas longas, porque a voz lê tudo.

## Fala ≠ texto na tela

O campo `fala` do `projeto.json` é o que a voz pronuncia. Escreva-o **como se fala**:
- **Números e símbolos por extenso:** "quarenta e três por cento", "cinquenta por cento mais um", "R$ 1.200" → "mil e duzentos reais".
- **Siglas soletradas:** "INSS" → "i ene esse esse".
- **Redes e @:** "Instagram" → `Instagrã`; "TikTok" → `Tic Tóc`; "@nome_sobrenome" → `arroba nome ânderláin sobrenome`. Separe palavras coladas (`cadernoamarelo` → `caderno amarelo`); quando o @ é igual nas duas redes, fale uma vez só ("Me segue no Instagrã e no Tic Tóc: arroba caderno ânderláin amarelo") e evite letras soltas ("ê" é lido como "e circunflexo").
- Para conferir a pronúncia da voz Kokoro antes de gerar: `python3 -c "from kokoro_onnx import Kokoro; import os; d=os.path.expanduser('~/.cache/whiteboard-video/kokoro'); k=Kokoro(d+'/kokoro-v1.0.onnx', d+'/voices-v1.0.bin'); print(k.tokenizer.phonemize('TEXTO', 'pt-br'))"`. Fonemas brasileiros têm "tʃ" em "ti" e "ʊ" no final de "-o".

Na tela, sempre use a grafia correta (`@caderno_amarelo`, `50%+1`).

## Fatos e fontes (vale para todo vídeo, principalmente curiosidades)

O perfil vive de credibilidade: um número inventado, quando alguém desmente nos comentários, contamina todos os vídeos. Regras:

1. **Liste os fatos antes de escrever.** Todo número, recorde, data, comparação ("o maior do mundo") ou afirmação científica do roteiro é um fato a verificar.
2. **Cada fato precisa de fonte concreta**, de preferência primária:
   - órgãos oficiais (IBGE, OMS, Ministério da Saúde, Banco Central, NASA);
   - pesquisas publicadas e relatórios conhecidos (relatórios anuais de institutos e consultorias de pesquisa);
   - enciclopédias e veículos jornalísticos sérios.
   Use WebSearch/WebFetch quando disponíveis e abra a página para confirmar o número; não confie só no resumo da busca.
3. **Contas são fatos derivados.** Se a conta parte de um dado com fonte (ex.: 5 h/dia de celular), mostre a conta; o resultado herda a fonte. Arredonde para baixo ou use "mais de", "quase".
4. **Sem fonte:**
   - o fato sai do roteiro, ou
   - vira **suposição declarada** na fala e na tela ("imagine 20 minutos por dia…", "se você…"), nunca "estudos mostram".
5. **Mitos populares** ("usamos só 10% do cérebro", "a Muralha da China é vista do espaço") só entram para serem **desmentidos**, com fonte.
6. **Registre** em `projeto.json`:
   ```json
   "fontes": [
     { "fato": "<o fato exatamente como aparece no vídeo>", "fonte": "<instituição, publicação, ano>", "url": "<link da página consultada>" }
   ]
   ```
   O motor ignora esse campo, que serve para conferência e para a entrega.
7. **Sem acesso à internet** para verificar: diga isso ao usuário antes de renderizar e peça a fonte, ou a autorização para usar os números como suposição. Nunca preencha a lacuna com "conhecimento geral" apresentado como fato.
8. **Na entrega:** passe as fontes em formato curto para a legenda ou para um comentário fixado ("📚 Fontes: IBGE (2022), OMS (2023)").

## Temas sensíveis (política, saúde, finanças)

- **Política:** seja neutro. Use candidatos/partidos fictícios ("Candidato A"), não recomende voto em ninguém e centre o vídeo na regra ou na matemática. Isso protege o perfil de denúncias e alcança todos os lados.
- **Números reais** (pesquisas, taxas, leis): seguem "Fatos e fontes" acima. Regras estáveis e conhecidas (ex.: "50% + 1 dos votos válidos" no 1º turno) também levam a fonte oficial (Constituição, TSE).

## Legenda para postar (entregue junto com o vídeo)

```
<Pergunta-gancho igual ou parecida com a do vídeo> 🤔<emoji do tema>

<1 linha de curiosidade: "Fiz a conta no papel e o resultado surpreende 👀">
<"Assiste até o final: <gancho da história> 😅">

👇 Comenta aqui:
<pergunta fácil de responder, sim/não ou A/B>

📌 <Urgência/contexto se houver (ex.: "Amanhã é dia de votar!")> Salva e manda pra quem <situação>.

#<tema> #<tema2> #<subtema> #aprendanotiktok #educação #fyp #foryou
```
Inclua mais 2 variações curtas. Dicas de publicação:
- Na capa, um texto curto em maiúsculas com a pergunta.
- Fixe um comentário próprio com uma pergunta.
- Responda os primeiros comentários.
- Poste no horário de pico (18h–21h).

## Música de fundo (recomendação para o usuário aplicar no app)

O vídeo sai só com a narração. Recomende adicionar a música no próprio TikTok:
- **Estilos:** lo-fi/chill sem letra, pizzicato "curious" ou violão leve.
- **Volume:** música entre 5% e 15% e som original em 100%.
- **Evite** músicas com letra, funk, trap ou trilha dramática.
- **Contas comerciais** só podem usar a Biblioteca de Música Comercial.
