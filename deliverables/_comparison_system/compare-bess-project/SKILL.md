---
name: compare-bess-project
description: "Compare a BESS teaser, financial model, project introduction, investment memorandum, or diligence pack with the live BESS research dashboard. Use whenever project materials are dropped into the BESS research platform or the user asks to compare, screen, diligence, cross-check, or identify gaps in a BESS opportunity. Always create two final outputs under deliverables: a market-assumption gap report in Markdown and a project-owner question list in Word from an equity-investor perspective."
---

# Compare BESS Project

Create a repeatable project-versus-dashboard diligence pack without changing the dashboard or the source materials.

## Non-negotiable output contract

- Store all comparison system files under `deliverables/_comparison_system/`.
- Store each review under `deliverables/<project_slug>_comparison_<YYYY-MM-DD>/`.
- Deliver exactly:
  - `01_market_assumption_gap_report.md`
  - `02_project_owner_question_list.docx`
- Keep temporary conversions, renders, and extraction files under `deliverables/_comparison_system/.work/<run_id>/`; remove them after QA.
- Do not modify, rename, or overwrite the source project material or any dashboard code/data.
- Preserve unrelated and pre-existing deliverables.

Read [references/output_contract.md](references/output_contract.md) before starting every comparison.

## Workflow

### 1. Establish the review perimeter

Identify the project, jurisdiction, source files, source dates, transaction stage, selected model case, and requested review language. Infer a missing label conservatively and mark it as inferred.

Use the relevant file skill for each source type. Open spreadsheets read-only, preserve formulas, and record sheet/cell references. Record page or slide references for documents and presentations. For `.xlsb`, use read-only Excel automation when needed; never save over the source.

### 2. Discover the live dashboard view

Search the repository at review time. Start with:

- `src/markets/<market_code>/`
- `src/economics/`
- `src/derive/`
- related methodology and source-registry files

Do not rely on a static dashboard snapshot. Distinguish official observations, third-party/vendor data, dashboard calculations, analyst scenarios, and illustrative seeds.

Verify drift-prone market facts with current primary sources. Prefer system operator, regulator, government, auction body, exchange, or named counterparty publications. If a current primary source differs from the dashboard, show both and flag the dashboard for refresh; do not silently replace it.

### 3. Build the project assumption register

Extract explicit assumptions and identify assumptions embedded in pasted curves or unexplained formulas. Cover every applicable category in [references/comparison_standard.md](references/comparison_standard.md).

For a financial model, also check:

- selected case/scenario and case labels;
- revenue stacking, timing, units, indexation, and real/nominal basis;
- route-to-market fee bases and contract dates;
- contracted versus forecast/unawarded revenue;
- degradation, RTE, availability, cycles, usable energy, and augmentation;
- network charges, losses, and import/export treatment;
- debt classification and coverage treatment; and
- cached formula errors and existing model checks.

Do not mistake a passing model check for evidence that a market or contract assumption is correct.

### 4. Compare with the dashboard

Create a side-by-side matrix with project assumption, dashboard view, variance, evidence quality, investment impact, status, and required action.

Use the rubric in [references/comparison_standard.md](references/comparison_standard.md). Treat a numerical match as non-independent when definitions, vendors, vintages, or transformations overlap. Separate a genuine disagreement from a scope, unit, timing, or definition mismatch.

### 5. Write the gap report

Create `01_market_assumption_gap_report.md` using the mandatory structure in [references/output_contract.md](references/output_contract.md).

Lead with the investment conclusion and the three to five issues that can change value, bankability, or deal structure. Cite project evidence with sheet/cell, page, or slide references. Link dashboard files and current primary sources. State review limitations.

### 6. Draft the first-round owner question list

Read [references/equity_question_framework.md](references/equity_question_framework.md). Ask only questions that remain unanswered after reviewing all supplied materials.

Create a short strategic discussion guide for the project owner. Use it to test why an equity investor should invest in the market, the region, and the opportunity before opening detailed VDR diligence.

Hard rules:

- remove internal dashboard terminology;
- ask 6 to 10 questions and never exceed 10;
- lead with the market thesis and regional thesis, then move to project advantage, revenue logic, returns, delivery, partnership, scalability, and downside;
- keep questions conceptual and suitable for a first management conversation;
- do not ask the owner to provide, confirm, verify, substantiate, or attach documents, calculations, permits, contracts, or other evidence;
- do not use priorities, evidence columns, response protocols, or exhaustive diligence categories; and
- reserve detailed evidence requests and project verification for a later VDR round or the gap report's close-out actions.

Project-specific questions are allowed only when they help explain the investment thesis or a major execution assumption. Prefer one strong question per theme over several narrow questions.

Create the Word document with `scripts/build_owner_questions_docx.py`. Use the document skill's `rfi_response` preset, render every page to PNG, inspect every page, fix defects, and re-render until clean.

### 7. Run final QA

Confirm:

- exactly two project deliverables exist;
- both use the same project name and review date;
- the Word document contains no more than 10 questions;
- the opening questions address why to invest in the market and region;
- every question tests investment logic, strategic fit, return potential, execution credibility, partnership, scalability, or downside;
- detailed evidence and verification requests remain in the gap report or a later VDR round, not the first-round owner list;
- the Word document contains no internal notes, dashboard jargon, placeholder text, or unsupported claims;
- the gap report differentiates source fact, dashboard view, calculation, inference, and recommendation;
- local links resolve and external links are direct; and
- temporary work files are removed.

## Word builder

Prepare a temporary JSON file using the schema in [references/output_contract.md](references/output_contract.md), then run:

```powershell
python scripts/build_owner_questions_docx.py --input-json <questions.json> --output-docx <02_project_owner_question_list.docx>
```

Use the bundled workspace Python runtime. Test the script after any change.
