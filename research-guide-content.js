const guideSteps = [
  {
    title: "Baseline evidence",
    intro: "Start with what you observed. Enter aggregate counts, scores, or de-identified findings. Leave out learner names, IDs, and individual records.",
    tips: [
      "Use evidence from your own setting. Record the source, date, group, and number assessed so readers can interpret the result.",
      "Name the specific skill or process that needs attention. For example, an item analysis might show that 18 of 30 learners missed both inference items.",
      "Explain why the finding matters in your school or office. If you suggest a cause, identify what additional evidence would help you check it."
    ],
    fields: [
      { key: "group", label: "Group and setting", placeholder: "Grade 7 English, one class" },
      { key: "period", label: "When was the evidence collected?", placeholder: "First term diagnostic assessment" },
      { key: "baselineSource", label: "What is the source of the evidence?", placeholder: "Item analysis, attendance summary, or observation log" },
      { key: "baselineMetric", label: "What skill or outcome did it measure?", placeholder: "Drawing inferences from a short passage" },
      { key: "baseline", label: "What did the evidence show?", hint: "Give the number assessed and the finding, or summarize recurring qualitative observations with their source.", area: true },
      { key: "benchmark", label: "What target or comparison helps interpret the result?", hint: "Name the source of the benchmark. If none applies, describe the comparison you can reasonably make.", area: true }
    ]
  },
  {
    title: "Problem and alignment",
    intro: "Identify the gap your evidence supports, then explain how it relates to your work and a research priority.",
    tips: [
      "Move from the broader context to one specific, timely gap your evidence supports. Name the group affected and why the gap matters.",
      "Explain what you can study or change in your role and how it connects to your actual performance objective and chosen research agenda theme.",
      "Name who could use the findings. Set a realistic scope for the setting, participants, and period, and note any limits of the design."
    ],
    fields: [
      { key: "problem", label: "What specific problem will you study?", hint: "State who is affected and which gap the baseline supports. Identify what still needs to be verified.", area: true },
      { key: "role", label: "Proponent role", placeholder: "e.g., Master Teacher I or Administrative Officer II", hint: "Enter your position or current designation." },
      { key: "standard", label: "Professional standard or indicator", hint: "Use the suggestion as a starting point and confirm the indicator for your role and career stage." },
      { key: "kra", label: "Applicable KRA or performance objective", hint: "Use the wording in your current performance tool." },
      { key: "agenda", label: "DepEd research agenda theme", options: ["Teaching and Learning", "Child Protection", "Human Resource Development", "Governance"], otherLabel: "Specify the research agenda theme" },
      { key: "crossTheme", label: "Cross-cutting theme, if applicable", options: ["Gender and Development", "Disaster Risk Reduction and Management", "Inclusive Education"], otherLabel: "Specify the cross-cutting theme" },
      { key: "roleFit", label: "How can you address this problem in your role?", area: true },
      { key: "significance", label: "Who could benefit and how?", area: true },
      { key: "scope", label: "What will the study cover, and what are its limits?", area: true }
    ]
  },
  {
    title: "Literature review",
    intro: "Summarize the relevant findings from previous studies or available literature. You may add individual source details if useful.",
    tips: [
      "Look for credible studies that examine your problem or a possible response. Check who participated, what was compared, and how the outcome was measured.",
      "Include relevant findings that qualify or challenge the approach. Explain which conditions match your setting and what may need adapting.",
      "Group sources by idea, compare their findings, and end with the gap your study will address. Record enough citation details to find and cite each source again."
    ],
    fields: [
      { key: "literatureSynthesis", label: "What did previous studies or available literature find?", hint: "Summarize the relevant findings and explain what they suggest for your study or proposed response.", area: true }
    ],
    group: "sources"
  },
  {
    title: "Framework and options",
    intro: "Use your baseline and literature to explain why an approach could work in your setting, then compare it with other feasible options.",
    tips: [
      "Anchor your framework in the study objective. Show how the key concepts connect and explain how you will recognize or measure the expected outcome.",
      "For action research, explain why the proposed strategy could address the gap. Describe the actual activities, materials, schedule, and how you will know they were carried out.",
      "Compare options using your evidence and available time, staff, materials, and learner access. For applied research without an intervention, specify the intended output or decision the study will inform."
    ],
    fields: [
      { key: "framework", label: "How do the problem, proposed response, and expected outcome connect?", hint: "For an applied study without an intervention, explain the concepts and relationships you will investigate.", area: true },
      { key: "selection", label: "What approach will you pursue, and why?", hint: "Name your choice and explain why it fits the evidence, participants, and constraints. For an applied study without an intervention, explain the chosen line of inquiry.", area: true },
      { key: "implementation", label: "How will you carry out the approach, if applicable?", hint: "For an intervention, describe the activities, materials, frequency, and duration.", area: true }
    ],
    group: "options"
  },
  {
    title: "Questions and methods",
    intro: "Match each question to the data, instrument, and analysis you need to answer it.",
    tips: [
      "Keep each question tied to the study objective. Check that you can answer it with the participants, records, and time you can realistically access.",
      "For each question, specify the data source, instrument, collection schedule, and analysis. Explain the selection criteria and how you will check that the instrument suits your participants and purpose.",
      "Match the strength of your conclusion to your design. For example, a one-group pretest and posttest can describe change over time, while a claim that the intervention caused it needs stronger evidence."
    ],
    fields: [
      { key: "design", label: "Research design", hint: "Explain why the design fits the question." },
      { key: "participants", label: "Participants or units of analysis" },
      { key: "sampling", label: "How will you select participants or records?", area: true },
      { key: "procedure", label: "How and when will you collect the data?", area: true },
      { key: "hypothesis", label: "Hypothesis, if the design calls for one", area: true }
    ],
    group: "questions"
  },
  {
    title: "Work plan and ethics",
    intro: "Plan the approvals, safeguards, schedule, resources, and use of findings.",
    tips: [
      "Plan for required permissions and applicable consent or assent before collecting new data. Explain who can access the data and how you will store, protect, and dispose of it.",
      "Give each activity a realistic date, person responsible, and expected output. Itemize estimated costs where applicable and check the funding rules in the current call.",
      "Plan how you will share findings with participants and the school, and identify a decision, practice, or resource the results could inform."
    ],
    fields: [
      { key: "ethics", label: "What approvals and participant safeguards apply?", hint: "Consider permissions, informed consent or assent where applicable, voluntary participation, and confidentiality and data handling.", area: true },
      { key: "timeline", label: "Activities, dates, and persons responsible", hint: "Include the schedule for preparation, data collection, analysis, and reporting.", area: true },
      { key: "costs", label: "Estimated costs and funding source, if applicable", area: true },
      { key: "utilization", label: "How will you share and use the findings?", hint: "Identify the audience, the intended use, and a possible venue or schedule.", area: true },
      { key: "appendices", label: "Appendices to prepare", hint: "List the instruments, sample materials, or consent and assent forms that apply.", area: true }
    ]
  },
  {
    title: "Review and download",
    intro: "Preview the proposal and review any items flagged below. Download the Word draft whenever you want to continue editing or share it for technical assistance.",
    tips: [
      "Read the draft from baseline to analysis. Check that the title, objective, research questions, instruments, and intended outputs describe the same study.",
      "Match in-text citations to the reference list and use the citation style specified in the applicable call. Attach the instruments and other supporting documents required for your study.",
      "Ask your research coordinator to review the draft. Confirm the proposal format, endorsements, declarations, and submission instructions for the current call."
    ],
    fields: [
      { key: "format", label: "Proposal format", choices: { actionEn: "Action Research — English", actionFil: "Action Research — Filipino", appliedEn: "Applied Research — English" }, otherLabel: "Specify the proposal format", otherHint: "Word will use a general proposal outline. You can adapt the headings and formatting after download." },
      { key: "title", label: "Working title" },
      { key: "author", label: "Proponent name(s)", hint: "Optional for a working draft." },
      { key: "school", label: "School or office" }
    ]
  }
];

const guideGroups = {
  sources: {
    title: "Individual sources", item: "Source", optional: true,
    fields: [
      { key: "citation", label: "Citation or source details", hint: "Record the author, year, and title." },
      { key: "location", label: "Link, DOI, or publication details" },
      { key: "context", label: "Who or what did the study examine?", hint: "Consider the participants, setting, and design." },
      { key: "finding", label: "What did the study find?", hint: "Record the finding that matters to your problem or possible response.", area: true },
      { key: "support", label: "What does this source say about your possible response?", options: ["Supports it", "Supports it with conditions", "Challenges it", "Informs the problem only", "Evidence is unclear"], otherLabel: "Describe what this source says" },
      { key: "limitations", label: "What limits how well this finding applies to your setting?", area: true },
      { key: "application", label: "What would you use, adapt, or reconsider based on this source?", area: true }
    ]
  },
  options: {
    title: "Options to compare", item: "Option",
    fields: [
      { key: "strategy", label: "Possible strategy or approach" },
      { key: "support", label: "What evidence supports or challenges it?", hint: "Refer to the source or baseline finding.", area: true },
      { key: "feasibility", label: "Can you implement it with the time, resources, and access you have?", area: true }
    ]
  },
  questions: {
    title: "Research question alignment", item: "Question",
    fields: [
      { key: "question", label: "Research question", area: true },
      { key: "data", label: "What data will answer it, and where will it come from?" },
      { key: "instrument", label: "What instrument or collection method will you use?" },
      { key: "analysis", label: "How will you analyze the data?" }
    ]
  }
};

const roleStandards = {
  Teacher: "PPST Strand 5.5 · Use of assessment data to enhance teaching and learning practices and programs",
  "School head": "PPSSH Strand 1.4 · Research and innovation",
  Supervisor: "PPSS Strand 3.3 · Culture of research"
};

function guideFieldValue(record, key) {
  const value = record[key] === "other" ? record[key + "Other"] : record[key];
  return value?.trim() || "";
}

function guideDecisionInputs(draft) {
  const { answers, groups } = draft;
  const keys = [
    "group", "period", "baselineSource", "baselineMetric", "baseline", "benchmark", "problem",
    "role", "standard", "kra", "agenda", "roleFit", "literatureSynthesis", "framework", "selection", "implementation",
    "design", "participants", "sampling", "procedure", "hypothesis"
  ];
  const groupValues = Object.entries(guideGroups).map(([key, group]) =>
    groups[key].map((row) => group.fields.map(({ key: field, otherLabel }) => otherLabel ? guideFieldValue(row, field) : row[field] || "")));
  const format = answers.format === "other" ? guideFieldValue(answers, "format") : answers.format === "appliedEn";
  const decision = [format, keys.map((key) => key === "agenda" ? guideFieldValue(answers, key) : answers[key] || ""), groupValues];
  if (answers.crossTheme === "other") decision.push(guideFieldValue(answers, "crossTheme"));
  return JSON.stringify(decision);
}

function guideReview(draft) {
  const { answers: a, groups: g, reviewed } = draft;
  const issues = [];
  if (!a.group || !a.period || !a.baselineSource || !a.baselineMetric || !a.baseline) {
    issues.push("Add the group, period, source, skill or outcome, and baseline finding.");
  }
  if (!a.problem || !a.role?.trim() || !a.standard || !a.kra || !guideFieldValue(a, "agenda") || !a.roleFit) {
    issues.push("Complete the problem, role, professional standard, performance objective, agenda theme, and role fit.");
  }
  if (!a.literatureSynthesis?.trim()) issues.push("Summarize the findings from previous studies or available literature.");
  if (!a.framework || !a.selection) issues.push("Explain the framework and justify the approach you chose.");
  const isActionResearch = a.format === "actionEn" || a.format === "actionFil";
  if (isActionResearch && !a.implementation) issues.push("Describe how often and for how long you will carry out the intervention.");
  if (isActionResearch && g.options.filter((option) => option.strategy).length < 2) {
    issues.push("Consider an alternative so you can explain why your chosen intervention is feasible.");
  }
  g.options.forEach((option, i) => {
    if (!option.strategy || !option.support || !option.feasibility) issues.push(`Add the strategy, evidence, and feasibility notes for option ${i + 1}.`);
  });
  if (!g.questions.length) issues.push("Add a research question and plan how to answer it.");
  g.questions.forEach((row, i) => {
    if (!row.question || !row.data || !row.instrument || !row.analysis) {
      issues.push(`Question ${i + 1} needs a question, data source, instrument or method, and analysis plan.`);
    }
  });
  if (!a.design || !a.participants || !a.sampling || !a.procedure) issues.push("Review the design, participants or units, selection, and data collection procedure.");
  if (!a.ethics || !a.timeline || !a.utilization) issues.push("Complete the ethics, work plan, and use of findings.");
  if (a.format === "other" && !guideFieldValue(a, "format")) issues.push("Specify the proposal format you plan to use.");
  if (!a.title) issues.push("Give the proposal a working title.");
  if (reviewed && reviewed !== guideDecisionInputs(draft)) {
    issues.unshift("The evidence or design changed after your last review. Recheck how the problem, response, questions, and methods fit together.");
  }
  return issues;
}
