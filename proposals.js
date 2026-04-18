// Crie cada proposta como uma nova chave dentro deste objeto.
// A chave e o slug que vai no link final, por exemplo:
// https://seu-projeto.vercel.app/proposta/cliente-acme
window.proposalCatalog = {
  modelo: {},
  "cliente-demo": {
    clientName: "Nome do Cliente",
    companyName: "Empresa do Cliente",
    dates: {
      issueDate: "2026-04-18",
      validityDays: 7,
      startWindow:
        "Primeiras entregas em 72h e implantacao integrada em ate 15 dias",
    },
    values: {
      implementationFee: 3000,
      monthlyFee: 1000,
    },
    whatsappNumber: "5521920194389",
    paymentNotes:
      "Pagamento da implantacao na contratacao. A recorrencia mensal passa a contar a partir do segundo mes, apos a fase inicial de implantacao.",
    adBudgetNote:
      "A verba de anuncios e paga a parte, direto para as plataformas, sem repasse pela Raiz Vendas e Marketing.",
    anchorPrices: {
      landingPage: 1000,
      metaCampaigns: 3000,
      whatsappAutomation: 2000,
      imageCreatives: 600,
      videoCreatives: 2500,
    },
  },
};
