# Output contract

## Folder and filenames

Create one folder per review:

```text
deliverables/<project_slug>_comparison_<YYYY-MM-DD>/
  01_market_assumption_gap_report.md
  02_project_owner_question_list.docx
```

Use a short ASCII project slug with underscores. Reuse the same folder when correcting the same review; use a new date for a new information vintage.

Keep system files in `deliverables/_comparison_system/`. Keep temporary work in `deliverables/_comparison_system/.work/<run_id>/` and delete it after final QA.

## Gap report structure

Use these sections in this order:

1. Title and review metadata
2. Executive conclusion and overall status
3. Project assumptions extracted
4. Dashboard comparison summary
5. Detailed gap matrix
6. Route-to-market and market-structure findings
7. Bankability / equity-value implications
8. Required downside cases
9. Prioritised close-out actions
10. Other equity-investor diligence issues
11. Sources and review limitations

For each material gap, state:

- project assumption and source reference;
- dashboard view and source reference;
- why they differ;
- whether the difference is fact, scope, definition, timing, case selection, or missing evidence;
- value/bankability impact;
- RAG status; and
- required action.

## Question-list rules

Create a simple first-round investment discussion guide in Word. Include:

- project and review metadata;
- one sentence explaining that detailed document diligence follows in the VDR round; and
- one numbered table with columns for number, investment theme, and strategic question.

Ask 6 to 10 questions and never exceed 10. Lead with why to invest in the market and region. Then cover the opportunity's distinctive advantage, duration/design logic, revenue model, return profile, delivery path, partner role, scalability, and downside. Keep the list conceptual and suitable for a first management conversation.

Do not use priorities, response protocols, evidence columns, exhaustive diligence sections, internal dashboard terminology, or internal conclusions. Do not ask the owner to provide, confirm, verify, substantiate, or attach documents, calculations, permits, contracts, or other evidence. Reserve those requests for the gap report's close-out actions or a later VDR round.

## Builder JSON schema

```json
{
  "project_title": "Project name",
  "document_title": "First-Round Investment Discussion Questions",
  "review_date": "7 August 2026",
  "source_materials": "Project materials supplied 7 August 2026",
  "purpose": "First-round discussion of the investment thesis",
  "confidentiality": "Confidential - diligence use only",
  "discussion_note": "This first discussion focuses on the market, regional and investment logic. Detailed document review can follow through the VDR.",
  "questions": [
    {
      "id": "1",
      "theme": "Market thesis",
      "question": "What structural change makes this an attractive BESS market now, and why should the opportunity persist as storage deployment increases?"
    }
  ]
}
```

## Source hierarchy

Use this order of authority:

1. Signed project agreement, official award, permit, connection offer, vendor warranty, or binding quote
2. Current system-operator, regulator, government, auction-body, or exchange publication
3. Named third-party report or licensed index with vintage and methodology
4. Project model calculation with traceable inputs
5. Dashboard calculation or analyst scenario
6. Illustrative seed or unsupported narrative

Do not present a lower-authority source as confirmation of a higher-authority claim.

## Final QA

- Recalculate every quoted variance.
- Verify all project references and local links.
- Verify that the Word list contains 6 to 10 questions and starts with the market and regional thesis.
- Verify that every question tests the investment logic and that none requests evidence or document verification.
- Render and inspect every Word page at 100% zoom.
- Deliver only the Markdown and DOCX project outputs.
