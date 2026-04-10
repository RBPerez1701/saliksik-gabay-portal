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

function searchModels(query) {
  const q = query.trim().toLowerCase();

  if (!q) return [...MODELS];

  return MODELS.filter((model) => {
    const joined = [
      model.modelName,
      model.learningArea,
      model.summary,
      ...(model.tags || []),
      ...Object.values(model.sections || {}).flat()
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
      <h3>${model.modelName}</h3>
      <p>${model.learningArea}</p>
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

function renderSection(model) {
  activeTabTitle.textContent = activeTab;
  const items = model.sections?.[activeTab] || [];

  if (!items.length) {
    sectionContent.innerHTML = '<p class="empty-state">No content yet for this section.</p>';
    return;
  }

  const list = document.createElement("ul");
  list.className = "section-list";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  sectionContent.innerHTML = "";
  sectionContent.appendChild(list);
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
