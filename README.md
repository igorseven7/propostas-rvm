# Propostas RVM

Este projeto agora funciona melhor como proposta online por link.

## Como funciona

- O template principal continua em `index.html`
- O estilo continua em `styles.css`
- A logica continua em `script.js`
- Os dados de cada cliente ficam em `proposals.js`
- Cada proposta pode ligar ou desligar os servicos incluidos
- A Vercel recebe URLs limpas como `/proposta/cliente-x` via `vercel.json`

## Onde criar o slug

O slug nao e criado na Vercel.

Voce cria o slug dentro de `proposals.js`.

Exemplo:

```js
window.proposalCatalog = {
  modelo: {},
  "cliente-acme-abril-2026": {
    clientName: "Fulano",
    companyName: "ACME",
    dates: {
      issueDate: "2026-04-18",
      validityDays: 7,
      startWindow: "Primeiras entregas em 72h e implantacao integrada em ate 15 dias"
    },
    values: {
      implementationFee: 3000,
      monthlyFee: 1000
    },
    services: {
      commercialStrategy: true,
      landingPage: true,
      metaCampaigns: true,
      whatsappAutomation: true,
      imageCreatives: true,
      videoCreatives: true
    }
  }
};
```

## Regra para slug

Use sempre:

- letras minusculas
- numeros se precisar
- hifen no lugar de espaco

Exemplos bons:

- `cliente-acme`
- `curso-ads-maio-2026`
- `proposta-dr-joao`

## Como testar localmente

Se voce abrir o arquivo direto no navegador, use query string:

```txt
file:///.../index.html?slug=cliente-acme
```

Se estiver publicado na Vercel, use:

```txt
https://seu-projeto.vercel.app/proposta/cliente-acme
```

## Fluxo manual que voce ja usa hoje

### 1. Editar ou criar a proposta

Abra `proposals.js` e:

- copie um bloco existente
- troque o slug
- troque nome, empresa, datas e valores
- ajuste os servicos incluidos em `services`

### 2. Subir para o GitHub

Pode continuar do jeito que voce ja faz.

Se quiser via terminal:

```bash
git init
git add .
git commit -m "Nova proposta"
git branch -M main
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```

### 3. Importar na Vercel

Como voce ja faz:

- entra na Vercel
- clica em `Import`
- escolhe o repositorio
- deixa a configuracao padrao de projeto estatico
- publica

Depois disso, a cada push novo no GitHub a Vercel atualiza automaticamente.

## Link para enviar ao cliente

Depois do deploy, o link fica assim:

```txt
https://seu-projeto.vercel.app/proposta/cliente-acme
```

Voce so troca a ultima parte pelo slug que criou no `proposals.js`.

## Dica pratica

Se quiser evitar links muito faceis de adivinhar, use um slug menos obvio:

- `acme-abril-2026-r7k2`
- `dr-joao-proposta-x91`

## Observacao importante

O painel oculto continua funcionando para editar localmente no navegador com `Ctrl/Cmd + Shift + E`.

Mas para a versao oficial enviada ao cliente, o ideal e salvar os dados no `proposals.js` e publicar de novo, porque o painel usa `localStorage` so no seu navegador.

## Servicos por proposta

Os servicos ficam dentro do objeto `services`.

Quando um servico estiver como `false`, ele some da proposta:

- nas entregas
- no cronograma
- na ancoragem
- na comparacao avulsa

Exemplo:

```js
services: {
  commercialStrategy: true,
  landingPage: true,
  metaCampaigns: true,
  whatsappAutomation: false,
  imageCreatives: true,
  videoCreatives: false
}
```
