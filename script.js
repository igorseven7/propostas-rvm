const defaultProposalData = {
  clientName: "Nome do Cliente",
  companyName: "Empresa do Cliente",
  dates: {
    issueDate: "2026-04-18",
    validityDays: 7,
    implementationDays: 15,
    startWindow: "Primeiras entregas em 72h e implantação integrada em até 15 dias",
  },
  values: {
    implementationFee: 3000,
    monthlyFee: 1000,
  },
  whatsappNumber: "5521920194389",
  paymentNotes:
    "Pagamento da implantação na contratação. A recorrência mensal passa a contar a partir do segundo mês, após a fase inicial de implantação.",
  adBudgetNote:
    "A verba de anúncios é paga à parte, direto para as plataformas, sem repasse pela Raiz Vendas e Marketing.",
  authorityMetrics: {
    years: "6 anos",
    clients: "+50 clientes",
    revenue: "+R$ 10 milhões gerados",
    adSpend: "+R$ 500 mil investidos",
  },
  anchorPrices: {
    landingPage: 1000,
    metaCampaigns: 3000,
    whatsappAutomation: 2000,
    imageCreatives: 600,
    videoCreatives: 2500,
  },
};

const DEFAULT_SLUG = "modelo";
const proposalCatalog = window.proposalCatalog || {};
const currentSlug = resolveCurrentSlug();
const baseProposalData = buildBaseProposalData(currentSlug);
const STORAGE_KEY = `rvm-proposal-data-v3:${currentSlug}`;
const proposalData = mergeDeep(cloneData(baseProposalData), loadStoredData());

window.proposalData = proposalData;
window.currentProposalSlug = currentSlug;
Object.defineProperty(window, "anchorPrices", {
  get() {
    return proposalData.anchorPrices;
  },
});
Object.defineProperty(window, "authorityMetrics", {
  get() {
    return proposalData.authorityMetrics;
  },
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const form = document.querySelector("#proposalForm");
const controlPanel = document.querySelector("#controlPanel");
const panelBackdrop = document.querySelector("#panelBackdrop");
const panelHotspot = document.querySelector("#panelHotspot");
const panelClose = document.querySelector("#panelClose");
const closeButton = document.querySelector("#closeButton");
const resetButton = document.querySelector("#resetButton");
const whatsappCta = document.querySelector("#whatsappCta");

document.addEventListener("DOMContentLoaded", () => {
  syncForm();
  renderProposal();
  bindEvents();
});

function bindEvents() {
  form.addEventListener("input", handleFieldChange);
  panelHotspot.addEventListener("click", () => togglePanel(true));
  panelBackdrop.addEventListener("click", () => togglePanel(false));
  panelClose.addEventListener("click", () => togglePanel(false));
  closeButton.addEventListener("click", () => togglePanel(false));
  resetButton.addEventListener("click", handleReset);

  document.addEventListener("keydown", (event) => {
    const isShortcut =
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      event.key.toLowerCase() === "e";

    if (isShortcut) {
      event.preventDefault();
      togglePanel(controlPanel.hidden);
    }

    if (event.key === "Escape" && !controlPanel.hidden) {
      togglePanel(false);
    }
  });
}

function handleFieldChange(event) {
  const input = event.target;
  const path = input.dataset.inputPath;

  if (!path) {
    return;
  }

  let value = input.value;

  if (input.type === "number") {
    value = Number(value || 0);
  }

  setByPath(proposalData, path, value);
  persistData();
  renderProposal();
}

function handleReset() {
  Object.keys(proposalData).forEach((key) => {
    delete proposalData[key];
  });

  mergeDeep(proposalData, cloneData(baseProposalData));
  persistData();
  syncForm();
  renderProposal();
}

function renderProposal() {
  renderTextBindings();
  renderMoneyBindings();
  renderDateBindings();
  renderComputedBindings();
  updateWhatsAppCTA();
  document.title = `Proposta Comercial | ${proposalData.companyName} | ${currentSlug}`;
}

function renderTextBindings() {
  document.querySelectorAll("[data-bind]").forEach((element) => {
    const path = element.dataset.bind;
    const value = getByPath(proposalData, path);
    element.textContent = value ?? "";
  });
}

function renderMoneyBindings() {
  document.querySelectorAll("[data-money]").forEach((element) => {
    const path = element.dataset.money;
    const value = Number(getByPath(proposalData, path) || 0);
    element.textContent = currencyFormatter.format(value);
  });
}

function renderDateBindings() {
  document.querySelectorAll("[data-date]").forEach((element) => {
    const path = element.dataset.date;
    const value = getByPath(proposalData, path);
    element.textContent = formatDisplayDate(value);
  });
}

function renderComputedBindings() {
  document.querySelectorAll("[data-money-computed]").forEach((element) => {
    const key = element.dataset.moneyComputed;
    const value = getComputedValue(key);
    element.textContent = currencyFormatter.format(Number(value || 0));
  });

  document.querySelectorAll("[data-computed]").forEach((element) => {
    const key = element.dataset.computed;
    element.textContent = getComputedValue(key);
  });
}

function getComputedValue(key) {
  switch (key) {
    case "anchorTotal":
      return Object.values(proposalData.anchorPrices).reduce(
        (total, price) => total + Number(price || 0),
        0,
      );
    case "implementationGap":
      return Math.max(
        0,
        getComputedValue("anchorTotal") -
          Number(proposalData.values.implementationFee || 0),
      );
    case "validUntil":
      return formatDisplayDate(getValidityDate());
    case "whatsappMessagePreview":
      return buildWhatsAppMessage();
    default:
      return "";
  }
}

function updateWhatsAppCTA() {
  whatsappCta.href = buildWhatsAppLink();
}

function buildWhatsAppLink() {
  const digits = String(proposalData.whatsappNumber || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
}

function buildWhatsAppMessage() {
  return [
    `Olá, equipe Raiz Vendas e Marketing.`,
    `Confirmo o aceite da proposta comercial de assessoria de resultado para ${proposalData.companyName}.`,
    `Podemos seguir com a implantação de ${currencyFormatter.format(proposalData.values.implementationFee)} e recorrência de ${currencyFormatter.format(proposalData.values.monthlyFee)}/mês a partir do segundo mês.`,
  ].join(" ");
}

function getValidityDate() {
  const issueDate = new Date(`${proposalData.dates.issueDate}T12:00:00`);
  issueDate.setDate(issueDate.getDate() + Number(proposalData.dates.validityDays || 0));
  return issueDate.toISOString().slice(0, 10);
}

function formatDisplayDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function syncForm() {
  document.querySelectorAll("[data-input-path]").forEach((input) => {
    const path = input.dataset.inputPath;
    const value = getByPath(proposalData, path);
    input.value = value ?? "";
  });
}

function togglePanel(shouldOpen) {
  controlPanel.hidden = !shouldOpen;
  panelBackdrop.hidden = !shouldOpen;
  controlPanel.setAttribute("aria-hidden", String(!shouldOpen));
  document.body.classList.toggle("body-panel-open", shouldOpen);

  if (shouldOpen) {
    const firstInput = controlPanel.querySelector("input, textarea");
    firstInput?.focus();
  }
}

function persistData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposalData));
}

function loadStoredData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch (error) {
    return null;
  }
}

function getByPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function setByPath(object, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const parent = keys.reduce((cursor, key) => cursor[key], object);
  parent[lastKey] = value;
}

function mergeDeep(target, source) {
  if (!source || typeof source !== "object") {
    return target;
  }

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (isObject(targetValue) && isObject(sourceValue)) {
      mergeDeep(targetValue, sourceValue);
      return;
    }

    target[key] = sourceValue;
  });

  return target;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function resolveCurrentSlug() {
  const querySlug = new URLSearchParams(window.location.search).get("slug");

  if (querySlug) {
    return normalizeSlug(querySlug);
  }

  const pathname = window.location.pathname || "";
  const match = pathname.match(/\/proposta\/([^/?#]+)/i);

  if (match) {
    return normalizeSlug(match[1]);
  }

  return DEFAULT_SLUG;
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function buildBaseProposalData(slug) {
  const catalogData = proposalCatalog[slug] || proposalCatalog[DEFAULT_SLUG] || {};
  return mergeDeep(cloneData(defaultProposalData), cloneData(catalogData));
}
