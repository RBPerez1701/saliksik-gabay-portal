
const searchInput = document.getElementById("searchInput");
const modelList = document.getElementById("modelList");
const modelCount = document.getElementById("modelCount");
const modelName = document.getElementById("modelName");
const modelSummary = document.getElementById("modelSummary");
const learningArea = document.getElementById("learningArea");
const tagList = document.getElementById("tagList");
const tabButtons = document.getElementById("tabButtons");
const activeTabTitle = document.getElementById("activeTabTitle");
const sectionContent = document.getElementById("sectionContent");

let filteredModels = [...MODELS];
let selectedModelId = MODELS[0]?.id || "";
let activeTab = "Model Overview";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
  if (!q) return [...MODELS];

  return MODELS.filter((model) => {
    const joined = [
      model.modelName,
      model.learningArea,
      model.summary,
      ...(model.tags || []),
      flattenForSearch(model.sections || {})
    ].join(" ").toLowerCase();
    return joined.includes(q);
  });
}

function renderModelList() {
  modelList.innerHTML = "";
  modelCount.textContent = filteredModels.length + " loaded";

  if (filteredModels.length === 0) {
    modelList.innerHTML = '<p class="empty-state">No matching model found.</p>';
    return;
  }

  filteredModels.forEach((model) => {
    const button = document.createElement("button");
    button.className = "model-button" + (model.id === selectedModelId ? " active" : "");
    button.innerHTML = `
      <h3>${escapeHtml(model.modelName)}</h3>
      <p>${escapeHtml(model.learningArea)}</p>
    `;
    button.addEventListener("click", () => {
      selectedModelId = model.id;
      activeTab = "Model Overview";
      renderAll();
    });
    modelList.appendChild(button);
  });
}

function renderHeader(model) {
  modelName.textContent = model.modelName;
  modelSummary.textContent = model.summary;
  learningArea.textContent = "Learning area or use context: " + model.learningArea;

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
  const tabs = Object.keys(model.sections || {});
  if (!tabs.includes(activeTab)) {
    activeTab = tabs[0] || "";
  }

  tabs.forEach((tab) => {
    const button = document.createElement("button");
    button.className = "tab-button" + (tab === activeTab ? " active" : "");
    button.textContent = tab;
    button.addEventListener("click", () => {
      activeTab = tab;
      renderSection(model);
      renderTabs(model);
    });
    tabButtons.appendChild(button);
  });
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
    const ol = document.createElement("ol");
    ol.className = "reference-list";
    (block.items || []).forEach((item) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = item.text || "";
      li.appendChild(span);
      if (item.url) {
        li.appendChild(document.createTextNode(" "));
        const a = document.createElement("a");
        a.href = item.url;
        a.textContent = item.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        li.appendChild(a);
      }
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

function renderAll() {
  if (filteredModels.length === 0) {
    modelName.textContent = "No teaching model selected";
    modelSummary.textContent = "";
    learningArea.textContent = "";
    tagList.innerHTML = "";
    tabButtons.innerHTML = "";
    activeTabTitle.textContent = "Results";
    sectionContent.innerHTML = '<p class="empty-state">Try another search term.</p>';
    renderModelList();
    return;
  }

  if (!filteredModels.some((m) => m.id === selectedModelId)) {
    selectedModelId = filteredModels[0].id;
  }

  const model = filteredModels.find((m) => m.id === selectedModelId);
  renderModelList();
  renderHeader(model);
  renderTabs(model);
  renderSection(model);
}

searchInput.addEventListener("input", (event) => {
  filteredModels = searchModels(event.target.value);
  renderAll();
});

renderAll();
