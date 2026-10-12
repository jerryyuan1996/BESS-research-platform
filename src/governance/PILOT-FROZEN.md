# The claim system, frozen after three markets

Western Australia, PJM and Finland are complete. **7 supported claims out of 150
analytical sections.** Everything below is fixed and must not be renegotiated per
market; a market that does not fit brings its case here rather than bending the
schema locally.

The three were chosen to fail differently, and did. WA is a market with good
official evidence behind a paywall of access refusals. PJM is a market with
excellent published evidence and dead third-party links. Finland is a market
whose central number nobody publishes. What survived all three is frozen.

---

## 1. Schema

`READINESS` — `supported` · `incomplete` · `blocked` · `none`

- **supported** — publishes. Requires text, affirmative evidence, no gap record,
  no record flagged for re-verification.
- **incomplete** — may hold a drafted sentence that is NOT published, or no draft
  at all when nothing could be written. Either way it records why.
- **blocked** — no text ever. Must name gap records and state what would unblock
  it.
- **none** — deliberate absence. `data` and `portfolio` only.

`CLAIM_BASIS` — `measured` · `forecast` · `policy` · `modelled` · `reported`

`AUTHORITY` — `official` · `third-party` · `developer-reported` ·
`counterparty-reported` · `internal` · `unclassified`

**Three axes that never collapse into each other.** Basis is what kind of
assertion the sentence makes. Authority is who stands behind the record.
Attribution is whose name the reader sees. A claim can be `reported` from an
official publisher, or `measured` from a third party. Each was conflated at least
once during the pilot and each conflation produced a wrong page.

**Affirmative support and deficiency never share a field.** `evidence` holds
records that can support; `gaps` holds declared coverage-gap records. Without the
separation a claim can cite the absence of evidence as evidence and pass every
check.

**A gap must be a record.** Finland declared its withheld reserve line on the
comparison object, where no claim could cite it — invisible to the one mechanism
built to stop a section arguing past it. A withheld line is a source register
entry with `authority: internal` and `verification: requires-reverification`.

---

## 2. Vocabulary

- **Claim** — one sentence saying what a section ARGUES, not what it contains.
- **Caveat** — the limitation, rendered inside the same block, never relocated.
- **Evidence** — a record capable of supporting the claim.
- **Gap** — a declared absence. Never evidence.
- **Disposition** — the decision for a section, published or not.

House style for claim text, enforced mechanically:

- Exactly one sentence. A decimal point is not a sentence boundary; a terminator
  followed by whitespace is, and so is a semicolon.
- No dotted abbreviations (`US`, not `U.S.`) — indistinguishable from a break.
- Chinese ends in a full-width stop.
- This is a **house-style guard, not a sentence parser.** It does not understand
  English.

---

## 3. Evidence review format

One record per source in `<market>/sourceReview.js`, imported by tests only.

Required: `reviewedAt`, `access`, and for anything opened — `confirmedTitle`,
`confirmedPublisher`, `confirmedDate`, `locator`, `establishes`,
`doesNotEstablish`.

`ACCESS` — `publisher` · `landing-page` · `archive` · `inaccessible`

Rules that carried the pilot:

- **A source that could not be opened may not establish anything.** Enforced.
- **`doesNotEstablish` is mandatory for anything opened.** The recurring failure
  is not a false statement but a true one stretched a clause too far.
- **A locator is mandatory** — the review must be repeatable by someone else.
- **403 is not 404.** Automation-blocked is almost certainly fine for a human;
  removal is the only thing worth acting on quickly.
- **A healthy link is not evidence.** Two Finland records returned 200 and
  reached nothing. Only opening a source establishes that it exists.
- **A publisher is not a developer.** Name both when they differ.
- Excerpts capped at 300 characters. This is not an archive.

---

## 4. Bundle boundary

| file | contents | imported by |
|---|---|---|
| `<market>/claims.js` | supported claims only | the market dashboard |
| `<market>/dispositions.js` | blocked, incomplete, none | tests only |

`DISPOSITIONS = { ...CLAIMS, ...UNPUBLISHED }` is the full set; coverage counts
read it.

Registration happens in the market dashboard so prose travels in that market's
lazy chunk, never the shared bundle. Lookup is keyed by market id, never by
whatever registered last.

The rule exists because Finland's chunk went over budget carrying bilingual
paragraphs for seven sections that render nothing. WA and PJM had the same defect
with enough headroom to hide it. **Do not let a passing budget stand in for a
correct boundary.**

---

## 5. Review checklist, per section

1. Read the section's complete rendered argument, including caveats and gap
   notices. The claim must represent THAT argument.
2. Open the actual material. A title, filename or status label is not evidence.
3. Record publisher, date, locator, what it establishes, what it does not.
4. Decide basis and authority explicitly. Never infer either from a title, a
   domain or an availability label.
5. Check the claim against the section's own caveat. If the section denies it,
   the claim is wrong — this caught two overreaching drafts.
6. **Refuse a true but peripheral sentence.** If the honest answer is blocked,
   a supported claim about something adjacent is worse than nothing.
7. Third-party, developer-reported and counterparty-reported evidence requires
   visible attribution.
8. Ask what the claim sits above. A supported badge over unverified headline
   figures lends them credibility it does not have.
9. `home` last. It must never synthesise an opportunity from structural facts
   the sections beneath it cannot support.

**Point 8 is a judgement, not a validator, and is deliberately not encoded.** A
narrowly scoped claim may coexist with unrelated gaps when the scope is explicit
and the separation is visible. Six Finland sections are incomplete because there
the unverified figures ARE the section's headline argument, so no honest scoping
separates them. A global rule would forbid the good case with the bad.

---

## What the pilot cost, and what it caught

Each of these shipped or nearly shipped, and each is now a test:

- A prepared PJM wording said the auction "cleared within its bounds". Every
  price cleared AT the cap. Having the sentence ready before opening the document
  is how that would have shipped.
- A WA claim asserted a revenue floor the section's own caveat denies.
- `"Public-source compilation"` was pattern-matched to `official` by a prefix.
- The one-sentence validator rejected `$325.00`.
- A static claim import map put every market's prose in the shared bundle.
- Finland's forecast note named the one fast product that falls and omitted the
  two that rise.
- Claim attribution concatenated a bilingual pair into one line in both languages.
- All ten Finland sections rendered no heading, which silently swallowed a claim
  that was registered, validated and correctly gated.

The last two were found only by opening a browser. **Passing tests are not
verification that something renders.**

## Scaling from here

Twelve markets remain. Per market: evidence review first and completely, all
eight dispositions returned for acceptance before anything is wired, then wiring,
then rendering verified in a browser at desktop and mobile widths.

Expect roughly one to three supported claims per market. A market returning eight
has not been reviewed carefully.

---

## Amended 2026-10: a section is no longer a tab

The pilot counted 150 sections as fifteen markets by ten tabs. Dashboards now
carry seven tabs, and a tab may hold several sections. The ten analytical section
ids are unchanged, claims and dispositions remain keyed by section id, and the
count remains 150. A claim is placed on its own section's heading inside
whichever tab holds it. Investment Case and Entry are not analytical sections and
carry no claim: their content is governed by the view store. Nothing in §1 to §5
changes.
