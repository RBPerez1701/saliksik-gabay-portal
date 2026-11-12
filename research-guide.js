const guideStorageKey = "saliksik-gabay-research-v1";
const guideForm = document.getElementById("guideForm");
const stepTitle = document.getElementById("stepTitle");
const stepIntro = document.getElementById("stepIntro");
const stepCount = document.getElementById("stepCount");
const stepSelect = document.getElementById("stepSelect");
const desktopSteps = document.getElementById("desktopSteps");
const saveStatus = document.getElementById("saveStatus");
const previousStep = document.getElementById("previousStep");
const nextStep = document.getElementById("nextStep");

function emptyDraft() {
  return { step: 0, answers: { format: "actionEn" }, groups: { sources: [], options: [], questions: [] }, reviewed: "" };
}

function savedFields(fields, record) {
  const keys = fields.flatMap(({ key, otherLabel }) => otherLabel ? [key, key + "Other"] : [key]);
  return Object.fromEntries(keys.filter((key) => typeof record?.[key] === "string").map((key) => [key, record[key]]));
}

function loadDraft() {
  const initial = emptyDraft();
  try {
    const raw = JSON.parse(localStorage.getItem(guideStorageKey));
    if (!raw || typeof raw !== "object") return initial;
    if (Number.isInteger(raw.step) && guideSteps[raw.step]) initial.step = raw.step;
    for (const step of guideSteps) {
      Object.assign(initial.answers, savedFields(step.fields, raw.answers));
    }
    for (const [key, group] of Object.entries(guideGroups)) {
      if (!Array.isArray(raw.groups?.[key])) continue;
      initial.groups[key] = raw.groups[key].filter((row) => row && typeof row === "object").map((row) =>
        savedFields(group.fields, row));
    }
    if (typeof raw.reviewed === "string") initial.reviewed = raw.reviewed;
  } catch {
    saveStatus.textContent = "Browser storage is unavailable. Download your work before closing this page.";
  }
  return initial;
}

let draft = loadDraft();
let modelQuery = "";

function saveDraft() {
  try {
    localStorage.setItem(guideStorageKey, JSON.stringify(draft));
    const message = "Draft saved in this browser.";
    if (saveStatus.textContent !== message) saveStatus.textContent = message;
  } catch {
    saveStatus.textContent = "Browser storage is unavailable. Download your work before closing this page.";
  }
}

function node(tag, content, className) {
  const element = document.createElement(tag);
  if (content) element.textContent = content;
  if (className) element.className = className;
  return element;
}

function button(label, handler, className = "") {
  const control = node("button", label, `guide-button ${className}`);
  control.type = "button";
  control.addEventListener("click", handler);
  return control;
}

function link(label, url) {
  const anchor = node("a", label);
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  return anchor;
}

function fieldGrid(fields, data, prefix = "") {
  const grid = node("div", "", "guide-form-grid");
  for (const field of fields) {
    const { key, label, hint, placeholder, area, choices, options, otherLabel, otherHint } = field;
    const id = prefix + key;
    const wrapper = node("div", "", area ? "guide-field wide" : "guide-field");
    const caption = node("label", label);
    caption.htmlFor = id;
    const entries = choices || (options && Object.fromEntries(options.map((value) => [value, value])));
    const control = node(entries ? "select" : area ? "textarea" : "input");
    control.id = id;
    if (entries) {
      if (!choices) control.add(new Option("Choose an option", ""));
      for (const [value, description] of Object.entries(entries)) control.add(new Option(description, value));
      if (otherLabel) control.add(new Option("Other (specify)", "other"));
    }
    if (placeholder) control.placeholder = placeholder;
    if (area) control.rows = 3;
    control.value = data[key] || "";
    control.addEventListener(entries ? "change" : "input", () => {
      data[key] = control.value;
      saveDraft();
      if (!prefix && key === "role") renderStandardSuggestion();
      if (!prefix && (key === "format" || key === "title")) renderReview();
    });
    wrapper.append(caption, control);
    if (hint) {
      const helper = node("small", hint);
      helper.id = id + "-hint";
      control.setAttribute("aria-describedby", helper.id);
      wrapper.append(helper);
    }
    if (entries && otherLabel) {
      const otherKey = key + "Other";
      const other = node("div", "", "guide-field");
      const otherCaption = node("label", otherLabel);
      const input = node("input");
      input.id = id + "-other";
      input.value = data[otherKey] || "";
      otherCaption.htmlFor = input.id;
      other.append(otherCaption, input);
      if (otherHint) {
        const helper = node("small", otherHint);
        helper.id = input.id + "-hint";
        input.setAttribute("aria-describedby", helper.id);
        other.append(helper);
      }
      other.hidden = control.value !== "other";
      control.addEventListener("change", () => { other.hidden = control.value !== "other"; });
      input.addEventListener("input", () => {
        data[otherKey] = input.value;
        saveDraft();
        if (!prefix && key === "format") renderReview();
      });
      wrapper.append(other);
    }
    grid.append(wrapper);
  }
  return grid;
}

function callout(content) {
  return node("p", content, "guide-callout");
}

function renderStandardSuggestion() {
  const container = document.getElementById("standardSuggestion");
  if (!container) return;
  const role = draft.answers.role?.trim() || "";
  const roleTypes = [
    [/\b(?:school head|principal)\b/i, "School head"],
    [/\bsupervisor\b/i, "Supervisor"],
    [/^(?:(?:master|special science|senior high school|substitute)\s+)?teacher\b/i, "Teacher"]
  ];
  const type = roleTypes.find(([pattern]) => pattern.test(role))?.[1];
  const suggestion = roleStandards[type];
  container.replaceChildren();
  container.hidden = !suggestion;
  if (!suggestion) return;
  container.append(callout(suggestion), button("Use suggested standard", () => {
    draft.answers.standard = suggestion;
    const standard = document.getElementById("standard");
    standard.value = suggestion;
    standard.focus();
    saveDraft();
  }));
}

function renderGroup(key) {
  const { title, item, fields, optional } = guideGroups[key];
  const rows = draft.groups[key];
  const section = node("section", "", "guide-group");
  section.id = key + "Group";
  const heading = node("h3", title);
  heading.id = key + "-heading";
  section.setAttribute("aria-labelledby", heading.id);
  section.append(heading);
  rows.forEach((row, index) => {
    const fieldset = node("fieldset");
    const prefix = `${key}-${index}-`;
    const remove = button(`Remove ${item.toLowerCase()} ${index + 1}`, () => {
      rows.splice(index, 1);
      saveDraft();
      section.replaceWith(renderGroup(key));
      const target = document.getElementById(prefix + fields[0].key) || document.getElementById(key + "Add");
      target.focus();
    }, "guide-text-button");
    fieldset.append(node("legend", `${item} ${index + 1}`), fieldGrid(fields, row, prefix), remove);
    section.append(fieldset);
  });
  const add = button(`Add ${item === "Option" ? "an" : "a"} ${item.toLowerCase()}${optional ? " (optional)" : ""}`, () => {
    rows.push({});
    saveDraft();
    section.replaceWith(renderGroup(key));
    document.getElementById(`${key}-${rows.length - 1}-${fields[0].key}`).focus();
  });
  add.id = key + "Add";
  section.append(add);
  return section;
}

function modelFinder() {
  const section = node("section", "", "guide-model-search");
  const caption = node("label", "Search models and frameworks for possible approaches");
  caption.htmlFor = "guideModelQuery";
  const search = node("input");
  search.type = "search";
  search.id = caption.htmlFor;
  search.placeholder = "Try reading, leadership, finance, or DRRM";
  search.value = modelQuery;
  const results = node("ul");
  const status = node("p", "", "guide-muted");
  status.setAttribute("role", "status");

  function showModels() {
    modelQuery = search.value;
    results.replaceChildren();
    const words = modelQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) {
      status.textContent = "Open a model to examine its evidence before deciding whether it fits.";
      return;
    }
    const matches = MODELS.filter((model) => {
      const index = [model.modelName, model.summary, model.category, model.learningArea, ...(model.tags || [])].join(" ").toLowerCase();
      return words.every((word) => index.includes(word));
    });
    status.textContent = matches.length
      ? `Showing ${Math.min(5, matches.length)} of ${matches.length} matching entries.`
      : "No matching entry. Try a broader term or enter your own approach below.";
    for (const model of matches.slice(0, 5)) {
      const row = node("li");
      row.append(link(model.modelName, `teaching-models.html?model=${encodeURIComponent(model.id)}`), node("span", model.summary, "guide-muted"));
      row.append(button("Add as an option", () => {
        const options = draft.groups.options;
        let index = options.findIndex((option) => option.strategy === model.modelName);
        if (index < 0) {
          options.push({ strategy: model.modelName });
          index = options.length - 1;
          saveDraft();
          document.getElementById("optionsGroup").replaceWith(renderGroup("options"));
        }
        document.getElementById(`options-${index}-strategy`).focus();
      }));
      results.append(row);
    }
  }

  search.addEventListener("input", showModels);
  section.append(caption, search, status, results);
  showModels();
  return section;
}

async function downloadDraft(control, status) {
  control.disabled = true;
  status.textContent = "Preparing your Word draft…";
  try {
    const bytes = await createProposalWord(draft, new JSZip());
    const url = URL.createObjectURL(new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }));
    const download = node("a");
    download.href = url;
    const filename = draft.answers.title?.trim().replace(/[^\p{L}\p{N} -]/gu, "").slice(0, 70).trim().replace(/\s+/g, "-");
    download.download = (filename || "Saliksik-Gabay-Proposal-Draft") + ".docx";
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = "Word draft downloaded. Update the table of contents in Word before submission.";
  } catch {
    status.textContent = "The draft could not be downloaded. Please try again.";
  } finally {
    control.disabled = false;
  }
}

function renderReview() {
  const review = document.getElementById("draftReview");
  review.replaceChildren();
  const status = node("p", "", "guide-muted");
  status.setAttribute("role", "status");
  const download = button("Download Word draft", () => downloadDraft(download, status), "guide-primary");
  review.append(download, status);
  const issues = guideReview(draft);
  const check = node("div", "", "guide-callout");
  const checkTitle = node("h3", issues.length ? "Items to review" : "Your draft has the main planning details");
  checkTitle.id = "reviewHeading";
  checkTitle.tabIndex = -1;
  check.append(checkTitle);
  if (issues.length) {
    const list = node("ul");
    issues.forEach((issue) => list.append(node("li", issue)));
    check.append(list);
  }
  const reviewed = button("Mark alignment reviewed", () => {
    draft.reviewed = guideDecisionInputs(draft);
    saveDraft();
    renderReview();
    document.getElementById("reviewHeading").focus();
  });
  reviewed.id = "alignmentReviewed";
  const needsReview = draft.reviewed !== guideDecisionInputs(draft);
  reviewed.hidden = !needsReview;
  if (needsReview) check.append(node("p", "Review whether the evidence, problem, approach, and methods fit together before marking alignment reviewed.", "guide-muted"));
  else check.append(node("p", "Alignment marked as reviewed.", "guide-muted"));
  review.append(check, reviewed);
  const preview = node("details");
  preview.append(node("summary", "Preview proposal sections"));
  if (draft.answers.title) preview.append(node("h3", draft.answers.title));
  for (const { heading, paragraphs, level } of proposalSections(draft)) {
    preview.append(node(level === 1 ? "h3" : "h4", heading));
    paragraphs.forEach((value) => preview.append(node("p", value)));
  }
  const submission = node("details");
  submission.append(node("summary", "Bulacan submission checklist"));
  const call = node("p", "Confirm the forms and routing in the applicable call. The 2026 screening memo lists the following items. ", "guide-muted");
  call.append(link("Bulacan DM 170, s. 2026", "https://bulacandeped.com.ph/wp-content/uploads/2026/04/DIVISION-MEMORANDUM-NO-170-S-2026.pdf"));
  const submissionItems = node("ul");
  for (const item of [
    "Completed proposal and Research Proposal Application Form",
    "Letter of intent endorsed by the immediate supervisor and the applicable certificate of endorsement",
    "Signed declarations of anti-plagiarism and absence of conflict of interest",
    "Accomplished screening checklist and evidence of technical assistance and prior evaluation"
  ]) submissionItems.append(node("li", item));
  submission.append(call, submissionItems);
  review.append(preview, submission);
}

function showStep(index, moveFocus = true) {
  const step = guideSteps[index];
  if (!step) return;
  draft.step = index;
  stepCount.textContent = `Step ${index + 1} of ${guideSteps.length}`;
  stepTitle.textContent = step.title;
  stepIntro.textContent = step.intro;
  const tips = document.getElementById("researchTips");
  const tipsList = document.getElementById("researchTipsList");
  if (tips && tipsList) {
    const items = step.tips || [];
    tips.open = false;
    tips.hidden = !items.length;
    tipsList.replaceChildren(...items.map((tip) => node("li", tip)));
  }
  stepSelect.value = index;
  [...desktopSteps.querySelectorAll("button")].forEach((control, stepIndex) => {
    if (stepIndex === index) control.setAttribute("aria-current", "step");
    else control.removeAttribute("aria-current");
  });
  guideForm.replaceChildren();

  if (index > 0 && index < guideSteps.length - 1) {
    const problem = draft.answers.problem?.trim();
    const baseline = draft.answers.baseline?.trim();
    const context = problem || baseline;
    if (context) guideForm.append(callout(context.length > 220 ? context.slice(0, 217) + "…" : context));
  }
  const fields = fieldGrid(step.fields, draft.answers);
  if (step.group === "sources") {
    const resources = node("p", "Search for completed DepEd studies in ", "guide-muted");
    resources.append(link("E-Saliksik", "https://e-saliksik.deped.gov.ph/"), document.createTextNode(" or use a research database or journal you can access."));
    guideForm.append(fields, resources, renderGroup(step.group));
  } else {
    guideForm.append(fields);
    if (step.group === "options") guideForm.append(modelFinder());
    if (step.group) guideForm.append(renderGroup(step.group));
  }

  if (index === 1) {
    const standard = node("div", "", "guide-group");
    standard.id = "standardSuggestion";
    guideForm.append(standard);
    renderStandardSuggestion();
  }
  if (index === guideSteps.length - 1) {
    const review = node("section", "", "guide-review");
    review.id = "draftReview";
    guideForm.append(review);
    if (!draft.reviewed) draft.reviewed = guideDecisionInputs(draft);
    renderReview();
  }
  previousStep.disabled = index === 0;
  nextStep.hidden = index === guideSteps.length - 1;
  if (moveFocus) {
    saveDraft();
    stepTitle.focus({ preventScroll: true });
    stepTitle.scrollIntoView({ block: "start" });
  }
}

const stepList = node("ol");
guideSteps.forEach(({ title }, index) => {
  stepSelect.add(new Option(`${index + 1}. ${title}`, index));
  const item = node("li");
  item.append(button(`${index + 1}. ${title}`, () => showStep(index)));
  stepList.append(item);
});
desktopSteps.append(stepList);
stepSelect.addEventListener("change", () => showStep(Number(stepSelect.value)));
guideForm.addEventListener("submit", (event) => event.preventDefault());
previousStep.addEventListener("click", () => showStep(draft.step - 1));
nextStep.addEventListener("click", () => showStep(draft.step + 1));
document.getElementById("clearDraft").addEventListener("click", () => {
  if (!window.confirm("Clear your saved research draft from this browser?")) return;
  draft = emptyDraft();
  modelQuery = "";
  showStep(0);
  saveStatus.textContent = "Draft cleared from this browser.";
});
if (!saveStatus.textContent) saveStatus.textContent = "Entries are saved in this browser as you work.";
showStep(draft.step, false);
