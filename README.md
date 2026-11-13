# Saliksik-Gabay — Complete Portal Backup, Reference Revision

Backup date: 13 November 2026 (Philippines)
Revision: references8 — replaces the earlier backup for future uploads.

This is a complete, standalone copy of the latest portal package prepared in this conversation. It consolidates the earlier interface, feedback-link, proposal-builder, and Models and Frameworks updates. No earlier update ZIP is required.

## Included
- Home and introductory instructions
- Models and Frameworks: 58 entries across seven categories (40 teaching entries and 18 additional frameworks/approaches)
- Search, category filters, section navigation, and responsive layouts
- Proposal Writing Process
- Proposal Builder, research tips, browser saving, and Word export code
- Research Management
- Microsoft Forms feedback link
- Shared styles, JavaScript, seals, all model figures, and third-party ZIP component license
- Compatibility page for older research-guide.html links
- Catalogue notes and evaluation wording changes
- SHA256SUMS.txt for file integrity checks

## Restore the portal
1. Keep this ZIP unchanged as your master backup; extract a separate working copy.
2. Upload all extracted portal files and the entire assets folder into the root of the existing saliksik-gabay-portal GitHub repository. Preserve filenames and folder structure. Upload the extracted contents, not the ZIP itself or a containing folder.
3. Replace matching files and commit. No older update packages are needed.
4. Confirm GitHub Pages publishes the branch/folder containing index.html; wait for deployment to finish.
5. Open the portal, refresh the page (Ctrl+F5 if necessary), and check that Models and Frameworks shows 58 entries and seven categories.
6. Verify a new category, Proposal Builder, Word download, and Feedback and Evaluation link.

Existing portal: https://rbperez1701.github.io/saliksik-gabay-portal/
Feedback: https://forms.cloud.microsoft/r/pqEk4NJqM2

## What requires a separate backup
This archive backs up the website files. It does not include Microsoft Forms ownership, the live form definition or responses, users' locally saved proposal drafts, GitHub account settings, or Git commit history. Keep Forms responses exported separately and ask users to download their proposal drafts. Restoring website files cannot recover a browser draft deleted from that device.

This is the latest prepared version from this conversation, not a fresh export of the live GitHub deployment. Creating this backup does not publish or alter the live portal.

## File map
index.html: Home
teaching-models.html: Models and Frameworks (original filename retained for existing links)
models.js: complete catalogue
script.js: catalogue interaction
proposal-process.html: Proposal Writing Process
proposal-builder.html: current Proposal Builder
research-guide.html: compatibility redirect
research-guide-content.js: builder prompts and tips
research-guide.js: builder interaction and local draft storage
research-guide-word.js: Word export
research-zip.min.js and research-zip-LICENSE.md: ZIP support and license
research-management.html: Research Management
styles.css and research-guide.css: presentation
assets/: seals and figures

The builder uses browser storage key saliksik-gabay-research-v1. Preserve that key in future updates to maintain draft compatibility.

## Corrected additional entries
All 18 additions now use the original 11-section outline, with 2–3 sources per entry (39 reference entries across the additions), citations in the body, and explicit distinctions between documented findings, methodological guidance, and proposed local adaptations. The original 40 model entries are unchanged. See REFERENCE_REVIEW.md for the source review and its access limits.

Some frameworks have methodological or policy support rather than direct school-level intervention trials. Do not interpret reference counts as evidence of effectiveness. Microsoft Forms and the live portal are not modified by creating this archive.
