const proposalHeadings = {
  actionEn: ["Context and Rationale", "Research Questions", "Hypothesis", "Significance of the Study", "Scope and Limitations", "Method", "Type of Research", "Participants", "Sampling Method", "Proposed Innovation / Intervention / Strategy", "Instruments and Data Sources", "Data Collection Procedure", "Ethical Considerations", "Data Analysis", "Work Plan and Timelines", "Cost Estimates", "Plan for Dissemination and Utilization", "References", "Appendices"],
  actionFil: ["Rasyonal", "Paglalahad ng Suliranin", "Hinuha", "Kahalagahan ng Pag-aaral", "Saklaw at Limitasyon", "Metodolohiya", "Disenyo ng Pananaliksik", "Mga Kalahok", "Pamamaraan ng Pagpili ng mga Kalahok", "Mungkahing Interbensyon o Estratehiya", "Mga Instrumento at Pinagmumulan ng Datos", "Pamamaraan ng Pangangalap ng Datos", "Etikal na Pagsasaalang-alang", "Pagsusuri ng mga Datos", "Plano ng mga Gawain at Takdang Panahon", "Tinatayang Gastusin", "Plano ng Pamamahagi at Paggamit", "Mga Sanggunian", "Mga Apendiks"]
};

function proposalSections(draft) {
  const { answers: a, groups: g } = draft;
  const isFilipino = a.format === "actionFil";
  const isApplied = a.format === "appliedEn";
  const [rationale, questions, hypothesis, significance, scope, method, design, participants, sampling, intervention, instruments, collection, ethics, analysis, timeline, costs, utilization, references, appendices] =
    proposalHeadings[isFilipino ? "actionFil" : "actionEn"];
  const section = (heading, paragraphs, level = 1) => ({ heading, paragraphs: paragraphs.filter(Boolean), level });
  const label = (name, value) => value ? name + ": " + value : "";
  const baseline = [
    label(isFilipino ? "Pangkat at konteksto" : "Group and setting", [a.group, a.period].filter(Boolean).join(" · ")),
    label(isFilipino ? "Batayang datos" : "Baseline evidence", a.baseline),
    label(isFilipino ? "Pinagmulan at sinukat" : "Source and measure", [a.baselineSource, a.baselineMetric].filter(Boolean).join(" · ")),
    label(isFilipino ? "Batayan ng paghahambing" : "Benchmark or comparison", a.benchmark),
    label(isFilipino ? "Suliranin" : "Problem", a.problem),
    label(isFilipino ? "Pamantayan at tungkulin" : "Professional alignment", [a.role, a.standard, a.kra, a.roleFit].filter(Boolean).join(" · ")),
    label(isFilipino ? "Adyenda ng pananaliksik" : "Research agenda", [a.agenda, a.crossTheme].filter(Boolean).join(" · "))
  ];
  const literature = [
    a.literatureSynthesis,
    ...g.sources.map((row) => [row.citation, row.context, row.finding, row.support, row.limitations, row.application].filter(Boolean).join(" — "))
  ];
  const optionNotes = g.options.map((row) => [row.strategy, row.support, row.feasibility].filter(Boolean).join(" — "));
  const aligned = (key) => g.questions.flatMap((row, index) => row[key] ? [`${index + 1}. ${row[key]}`] : []);
  const opening = isApplied
    ? [section("Introduction", baseline), section("Review of Related Literature and Studies", literature, 2), section("Conceptual Framework", [a.framework, a.selection, ...optionNotes], 2)]
    : [section(rationale, [...baseline, label(isFilipino ? "Sintesis ng literatura" : "Literature synthesis", literature[0]), ...literature.slice(1), label(isFilipino ? "Konseptuwal na balangkas" : "Conceptual framework", a.framework)])];
  const sections = [
    ...opening,
    section(questions, aligned("question")),
    ...(a.hypothesis ? [section(hypothesis, [a.hypothesis])] : []),
    section(significance, [a.significance]),
    section(scope, [a.scope]),
    section(method, []),
    section(design, [a.design], 2),
    section(participants, [a.participants], 2),
    section(sampling, [a.sampling], 2),
    ...(isApplied ? [section("Sources of Data", aligned("data"), 2)] : [section(intervention, [a.selection, a.implementation, ...optionNotes], 2)]),
    section(isApplied ? "Instruments" : instruments, isApplied ? aligned("instrument") : g.questions.flatMap((row, index) => {
      const items = [row.data, row.instrument].filter(Boolean);
      return items.length ? [`${index + 1}. ${items.join(" — ")}`] : [];
    }), 2),
    section(collection, isApplied ? [a.implementation, a.procedure] : [a.procedure], 2),
    section(ethics, [a.ethics], 2),
    section(analysis, aligned("analysis"), 2),
    section(isApplied ? "Timetable / Gantt Chart" : timeline, [a.timeline]),
    ...(a.costs ? [section(costs, [a.costs])] : []),
    section(isApplied ? "Plan for Dissemination and Advocacy" : utilization, [a.utilization]),
    section(references, g.sources.map((row) => [row.citation, row.location].filter(Boolean).join(" "))),
    section(appendices, [a.appendices])
  ];
  return sections.map((entry) => ({
    ...entry,
    paragraphs: entry.paragraphs.length || entry.heading === method ? entry.paragraphs : [isFilipino ? "[Kumpletuhin ang bahaging ito.]" : "[Complete this section.]"]
  }));
}

function createProposalWord(draft, zip) {
  const xml = (value) => String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
  })[char]);
  const run = (value) => String(value).split(/\r\n|\n|\r/).map((line) => `<w:r><w:t xml:space="preserve">${xml(line)}</w:t></w:r>`).join("<w:r><w:br/></w:r>");
  const paragraph = (value, style = "Normal") => `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr>${run(value)}</w:p>`;
  const pageBreak = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
  const declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const rel = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const packRel = "http://schemas.openxmlformats.org/package/2006/relationships";
  const phil = draft.answers.format === "actionFil";
  const a = draft.answers;
  const contents = '<w:p><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-2" \\h \\z \\u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r>' +
    run(phil ? "I-update ang talaan sa Word bago isumite." : "Update this table in Word before submission.") +
    '<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>';
  const body = [
    paragraph(a.title || (phil ? "Pamagat ng Panukala" : "Working Proposal Title"), "Title"),
    paragraph(phil ? "Burador ng Panukalang Pananaliksik" : "Research Proposal Draft", "Subtitle"),
    ...(a.author ? [paragraph(a.author, "Subtitle")] : []),
    ...(a.school ? [paragraph(a.school, "Subtitle")] : []),
    pageBreak,
    paragraph(phil ? "Talaan ng Nilalaman" : "Table of Contents", "Title"),
    contents,
    pageBreak,
    ...proposalSections(draft).flatMap((entry) => [
      paragraph(entry.heading, `Heading${entry.level}`),
      ...entry.paragraphs.map((line) => paragraph(line))
    ])
  ].join("");
  zip.file("[Content_Types].xml", declaration + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>');
  zip.file("_rels/.rels", declaration + `<Relationships xmlns="${packRel}"><Relationship Id="rId1" Type="${rel}/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.file("word/_rels/document.xml.rels", declaration + `<Relationships xmlns="${packRel}"><Relationship Id="rId1" Type="${rel}/styles" Target="styles.xml"/></Relationships>`);
  zip.file("word/document.xml", declaration + `<w:document xmlns:w="${ns}"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`);
  zip.file("word/styles.xml", declaration + `<w:styles xmlns:w="${ns}">
    <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="480" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
    <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
    <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:jc w:val="center"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/></w:rPr></w:style>
    <w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:pPr><w:jc w:val="center"/></w:pPr></w:style>
    <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/></w:rPr></w:style>
    <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/></w:rPr></w:style>
  </w:styles>`);
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}
