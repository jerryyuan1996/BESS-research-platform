# Manual strategy review

Observation is automatic. Analysis is explicitly started by the analyst in a local assistant session. Decisions and publication are separate acts. These tools make no model or network requests and never turn a daily price move into a strategy update.

## Local workflow

1. On a committed checkout, run `npm run review:packet -- --markets nem,jp_tokyo`. This reads tracked public data and strategy records. It pins the data commit, file hashes and each market's latest analyst changelog id. The packet lives in ignored `etl/out/strategy-review/<id>/packet.json`; the blank review is in `docs/strategy-reviews/<id>/review.json`. Do not pass private source documents to this flow.
2. Give the packet to the assistant session you choose. No API key is needed. Fill the report contract below. A proposed model assumption is only a proposal, not a view-store write.
3. Run `npm run review:check -- <id>`. It validates citations and proposed changes without applying them, and generates the impact figures and `report.md`. Do not type model figures into section D. Rejected or deferred analysis cannot be silently rewritten; prepare a fresh review when the evidence changes.
4. Decide by explicit ids, for example `npm run review:decide -- <id> --approve p1 --reject p2 --defer p3`. There is no approve-all. Only approved view proposals pass through the analyst writer, as one fully validated batch. Assumption proposals are recorded for the existing written-plan and separate sign-off process; no source file is changed. A data difference blocks approval and prints a fingerprint: inspect the changed data before supplying that exact value with `--acknowledge-data`. A changed strategy or engine always requires a new packet.
5. Review the full report, the decision log and the actual view diff. Run the repository checks and confidentiality scans before committing, then use the normal PR, approval and scanned deployment pipeline. Mark the log's release column with the verified release only after deployment. A local approval or apply is not publication.

`npm run review:status` shows observation date, last analysed snapshot, current approved strategy version and last approved change per market. No field is inferred from the absence of a report.

## Assistant protocol

Use only evidence items in the packet. Cite exact item ids as `[evidence:<id>]` in narrative and list ids in each proposal's `evidence`. Never invent observations, assume that an unknown policy date is current, or infer award, contract or project eligibility from a market-wide notice. Separate fact, model result, interpretation and unresolved evidence. A short-term price move alone does not justify a strategy proposal. State a causal mechanism, persistence and materiality, and what evidence would reverse the conclusion.

The `sections` object contains all five nonempty strings:

- **A — Observed evidence:** changes since the approved baseline, dates, provenance and missing coverage.
- **B — Investment interpretation:** causal implications and counter-evidence; separate observations from assumptions.
- **C — Classified proposals:** use Maintain, Further evidence, Consider adjustment or Material review.
- **D — Computed impact:** qualitative explanation only, with no typed numerical figures. The checker appends reproducible before/after outputs from the current briefing engine's in-memory view overlay. These outputs do not simulate unapproved methodology changes.
- **E — What would change the conclusion:** explicit follow-up evidence, conditions and limits.

Every proposal has a unique safe `id`, a packet `market`, `classification`, `rationale`, `reconsiderWhen`, at least one valid `evidence` id and `kind` (`none`, `view` or `assumption`). Maintain and Further evidence have kind none. A view proposal additionally has `changes`, each a valid existing analyst-writer change with bilingual reason, same market, and `author.kind = analyst`. The checker validates the entire proposed batch before a decision. Assumption proposals must describe the written plan needed in their rationale and have no changes array.

Full `report.md` and `review.json` are intended for the repository's public `docs/` after scanning. Do not include private commentary, deal names, credentials or licence-restricted extracts. The packet is reproducible and stays ignored. Discovery metadata held only in Actions artifacts is explicitly outside a tracked-only packet; lack of a packet policy record never establishes that no policy was published.

## Recovery and audit

The decide command records a pending intent before applying any view changes. If execution is interrupted, `pending-decision.json` blocks another application. Reconcile the recorded proposal changes and changelog ids before recovery; never blindly retry a possibly applied action. The repository-wide review lock serializes checking and deciding before either reads the report, preventing a slow check from overwriting a decision. If an earlier approved proposal changed the strategy, a later approval needs a new packet; rejection and deferral of remaining proposals may still be recorded. Existing model weights, discount rates, NPV screen, FX calculation and historical records are unchanged.

### Immutable snapshot verification

A packet checksum detects accidental edits; it is not approval or proof of authenticity. Every check and decision verifies its full commit SHA and commit timestamp, the complete public-input manifest and byte hashes against Git blobs, then deterministically rebuilds the packet (including figures, baselines, rules and policy) for comparison. Rehashing edited evidence or derived results cannot create a valid packet. Git trees and blob batches are read with bounded output, and non-regular public inputs are rejected. No private key or confidential input is used.

Packet creation still requires the checkout to match its committed public inputs. Read-only verification rebuilds from that original snapshot, so later observations may still be explicitly acknowledged using their exact fingerprint; this never permits changing strategy or model inputs. Review status dates are ordered by their actual timestamp, not their local timezone spelling.
