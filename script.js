
const categoryFilter = document.getElementById("categoryFilter");
for (const category of [...new Set(MODELS.map(model => model.category))]) {
  const option = document.createElement("option"); option.value = category; option.textContent = category; categoryFilter.appendChild(option);
}
const searchInput = document.getElementById("searchInput");
const browseModels = document.getElementById("browseModels");
const modelBrowser = document.getElementById("modelBrowser");
const modelList = document.getElementById("modelList");
const modelCount = document.getElementById("modelCount");
const modelName = document.getElementById("modelName");
const modelSummary = document.getElementById("modelSummary");
const learningArea = document.getElementById("learningArea");
const tagList = document.getElementById("tagList");
const tabButtons = document.getElementById("tabButtons");
const sectionSelect = document.getElementById("sectionSelect");
const activeTabTitle = document.getElementById("activeTabTitle");
const sectionContent = document.getElementById("sectionContent");

let filteredModels = [...MODELS];
const requestedModel = new URLSearchParams(window.location.search).get("model");
const initialModel = MODELS.find((model) => model.id === requestedModel) || MODELS[0];
let selectedModelId = initialModel?.id || "";
let activeTab = "Model Overview";

function setBrowserOpen(open) {
  if (!browseModels) return;
  browseModels.setAttribute("aria-expanded", String(open));
  browseModels.textContent = open ? "Hide models and frameworks" : "Browse models and frameworks";
}

function flattenForSearch(value) {
  if (Array.isArray(value)) {
    return value.map(flattenForSearch).join(" ");
  }
  if (value && typeof value === "object") {
    return Object.values(value).map(flattenForSearch).join(" ");
  }
  return value ? String(value) : "";
}

function searchModels(query) {
  const q = query.trim().toLowerCase();
  

  return MODELS.filter((model) => {
    const joined = [
      model.modelName, model.category,
      model.learningArea,
      model.summary,
      ...(model.tags || []),
      flattenForSearch(model.sections || {})
    ].join(" ").toLowerCase();
    return (!categoryFilter.value || model.category === categoryFilter.value) && joined.includes(q);
  });
}

function renderModelList() {
  modelList.innerHTML = "";
  const matchLabel = filteredModels.length === 1 ? "match" : "matches";
  modelCount.textContent = filteredModels.length + " " + ((searchInput.value.trim() || categoryFilter.value) ? matchLabel : "loaded");

  if (filteredModels.length === 0) {
    modelList.innerHTML = '<p class="empty-state">No matching entries.</p>';
    return;
  }

  filteredModels.forEach((model) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "model-button";
    button.dataset.modelId = model.id;
    const title = document.createElement("strong");
    title.textContent = model.modelName;
    const context = document.createElement("span");
    context.textContent = model.learningArea;
    button.append(title, context);
    button.addEventListener("click", () => {
      selectedModelId = model.id;
      activeTab = "Model Overview";
      updateModelSelection();
      renderModel(model);
      setBrowserOpen(false);
      modelName.focus({ preventScroll: true });
      const heading = modelName.getBoundingClientRect();
      if (heading.top < 12 || heading.bottom > window.innerHeight) {
        modelName.scrollIntoView({ block: "start" });
      }
    });
    modelList.appendChild(button);
  });
  updateModelSelection();
}

function updateModelSelection() {
  for (const button of modelList.children) {
    const selected = button.dataset.modelId === selectedModelId;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-current", String(selected));
  }
}

function renderHeader(model) {
  modelName.textContent = model.modelName;
  modelSummary.textContent = model.summary;
  learningArea.textContent = "Category: " + model.category + " · Context: " + model.learningArea;

  tagList.innerHTML = "";
  (model.tags || []).forEach((tag) => {
    const el = document.createElement("span");
    el.className = "tag";
    el.textContent = tag;
    tagList.appendChild(el);
  });
}

function renderTabs(model) {
  tabButtons.innerHTML = "";
  if (sectionSelect) sectionSelect.innerHTML = "";
  const tabs = Object.keys(model.sections || {});
  if (!tabs.includes(activeTab)) {
    activeTab = tabs[0] || "";
  }

  tabs.forEach((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-button";
    button.setAttribute("aria-controls", "sectionContent");
    button.textContent = tab;
    button.addEventListener("click", () => selectSection(model, tab));
    tabButtons.appendChild(button);

    if (sectionSelect) {
      const option = document.createElement("option");
      option.value = tab;
      option.textContent = tab;
      sectionSelect.appendChild(option);
    }
  });
  updateSectionSelection();
}

function updateSectionSelection() {
  for (const button of tabButtons.children) {
    const selected = button.textContent === activeTab;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  }
  if (sectionSelect) sectionSelect.value = activeTab;
}

function selectSection(model, tab) {
  activeTab = tab;
  updateSectionSelection();
  renderSection(model);
}

function renderBlock(block) {
  const wrapper = document.createElement("div");
  wrapper.className = "content-block";

  if (block.title) {
    const title = document.createElement("h4");
    title.className = "block-title";
    title.textContent = block.title;
    wrapper.appendChild(title);
  }

  if (block.type === "paragraph") {
    const p = document.createElement("p");
    p.className = "section-paragraph";
    p.textContent = block.text || "";
    wrapper.appendChild(p);
  }

  if (block.type === "list") {
    const ul = document.createElement("ul");
    ul.className = "section-list";
    (block.items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    wrapper.appendChild(ul);
  }

  if (block.type === "sequence") {
    const ol = document.createElement("ol");
    ol.className = "sequence-list";
    (block.items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ol.appendChild(li);
    });
    wrapper.appendChild(ol);
  }

  if (block.type === "image") {
    const figure = document.createElement("figure");
    figure.className = "figure-frame";
    const img = document.createElement("img");
    img.src = block.src;
    img.alt = block.alt || "Teaching model figure";
    figure.appendChild(img);
    if (block.caption) {
      const cap = document.createElement("figcaption");
      cap.className = "figure-caption";
      cap.textContent = block.caption;
      figure.appendChild(cap);
    }
    wrapper.appendChild(figure);
  }

  if (block.type === "references") {
    const ol = document.createElement("ul");
    ol.className = "reference-list";
    (block.items || []).forEach((item) => {
      const li = document.createElement("li");
      item.segments.forEach(({ text, italic }) => {
        if (italic) {
          const emphasis = document.createElement("em");
          emphasis.textContent = text;
          li.appendChild(emphasis);
        } else {
          li.appendChild(document.createTextNode(text));
        }
      });
      ol.appendChild(li);
    });
    wrapper.appendChild(ol);
  }

  return wrapper;
}

function renderSection(model) {
  activeTabTitle.textContent = activeTab;
  const blocks = model.sections?.[activeTab] || [];

  sectionContent.innerHTML = "";

  if (!blocks.length) {
    sectionContent.innerHTML = '<p class="empty-state">No content yet for this section.</p>';
    return;
  }

  blocks.forEach((block) => {
    sectionContent.appendChild(renderBlock(block));
  });
}

function renderModel(model) {
  renderHeader(model);
  renderTabs(model);
  renderSection(model);
}

function applyFilters() {
  filteredModels = searchModels(searchInput.value);
  let selected = filteredModels.find(model => model.id === selectedModelId) || filteredModels[0];
  selectedModelId = selected?.id || "";
  activeTab = "Model Overview";
  renderModelList();
  modelList.scrollTop = 0;
  if (selected) renderModel(selected);
  else {
    modelName.textContent = "No matching entries";
    modelSummary.textContent = "Try another category or a broader search term.";
    learningArea.textContent = "";
    for (const element of [tagList, tabButtons, sectionSelect, sectionContent]) element.replaceChildren();
    activeTabTitle.textContent = "";
  }
}
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

browseModels?.addEventListener("click", () => {
  const open = browseModels.getAttribute("aria-expanded") !== "true";
  setBrowserOpen(open);
  if (open) searchInput.focus({ preventScroll: true });
});

modelBrowser?.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || browseModels?.getAttribute("aria-expanded") !== "true") return;
  event.preventDefault();
  setBrowserOpen(false);
  browseModels.focus();
});

sectionSelect?.addEventListener("change", (event) => {
  const model = MODELS.find((item) => item.id === selectedModelId);
  if (model) selectSection(model, event.target.value);
});

renderModelList();
if (initialModel) renderModel(initialModel);
