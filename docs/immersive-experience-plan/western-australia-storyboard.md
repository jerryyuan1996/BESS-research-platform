# Western Australia: Six-Chapter Storyboard

Pack: BESS-IX-2026-10-30, version 1.1  
Status: script, interaction and evidence brief anchored to the WA play; not an implemented or fully verified story  
Navigation: [Master plan](README.md) | [Narrative method](market-narratives.md) | [Evidence specification](evidence-and-content-specification.md) | [Page design](experience-and-page-design.md)

## 1. Scope, argument and reading route

The pilot covers **WEM/SWIS**, not every electricity system in Western Australia. The story argues for one conclusion: the platform's WA call and play as the briefing publishes them (REPO-12). The briefing's thesis is capacity-led: the capacity mechanism pays for long duration, capacity is most of the revenue, and a fund enters as a minority stake behind a strategic sponsor once Capacity Credits are assigned, building seven hours because the eighth is capital the market does not pay for. Every chapter is a step in that argument. If the briefing changes the call, the play or the thesis, this storyboard is due for review ([evidence specification §7](evidence-and-content-specification.md#7-dynamic-update-and-review-policy)).

Scenes are fixed-view isometric SVG drawn from the shared symbol kit. They show a real system context with simplified topology, not a load-flow model, an engineering layout or project advice.

Thirteen active shots (`wa-00` to `wa-14`, with `wa-12` and `wa-13` retired) make about five minutes of reading. Chapter links and ordinary scrolling work throughout, and nothing waits for an animation.

| Chapter | Shots | What the reader can explain afterwards |
| --- | --- | --- |
| Opening | wa-00 | The call and the play, in one line |
| Origins | wa-01, wa-02 | Why an island grid must build its own backup, and how rooftop solar changed the pattern |
| Historical choices | wa-03, wa-04 | Why WA pays for capacity when the NEM does not, and why owning a battery is not the same as being paid |
| Today's tensions | wa-05, wa-06, wa-07 | The midday surplus, the long evening window, and why fast response is a separate, smaller line in this play |
| Add a battery | wa-08, wa-09 | Why seven hours rather than four or eight, and what the investor owns |
| Who pays | wa-10, wa-11 | Capacity first, energy and services after, and why one battery cannot promise everything |
| The investment | wa-14, then links | What could weaken the value, and where the numbers live (Bankable case, Revenue, Execution, Downside) |

### Rules for every shot

- **Figures.** Calls, durations and revenue shares in page copy come through `‹bound: …›` fields that the existing play card and market sections already read. No figure is typed into copy.
- **Controls.** Teaching controls change only teaching state: era, time of day, battery preset, hotspot or service. The story has no underwriting controls. "Go to the investment case" links to the market page, which already hands the case to the Investment Lab.
- **Navigation.** Chapter and shot changes are history entries. Back, refresh, a language switch and opening or closing evidence keep the reader's place (`WP-04`).
- **Evidence.** Each shot shows one marker (Strong, Fair or Thin) and one "What would change it" line. The **Authoring check** row is for writers and reviewers and never appears on the page. Scenarios and future assets are dashed; teaching values are tagged "Example".

## 2. Opening

### wa-00 — The call (new in v1.1)

| Item | Shot specification |
| --- | --- |
| User question | What is the call here, and why should I read on? |
| Page copy | The existing play card: ‹bound: call›, ‹bound: play name›, ‹bound: the figures the card already shows›, ‹bound: next action›. One line beneath it: "Five minutes on why: an island grid, a choice made in 2006, and a long evening." |
| Scene | Small isometric SWIS thumbnail; no animation |
| Control | "Start the story" and "Go to the investment case" (the market page's `#bankable` section) |
| Feedback | None; this shot is the conclusion |
| Evidence and chart | Briefing model and play card (REPO-12); no new values |
| Investment meaning | The reader starts with the answer; the story explains it |
| Marker now | Inherits the play's evidence strength from the briefing |
| Authoring check | Never restate the call or a figure in prose; a re-graded call must update this shot by itself |
| Mobile | Play card full width; two buttons |
| Status | New; uses existing components. The "2006" line waits on CL-WA-06 |

## 3. Origins

### wa-01 — An island grid

| Item | Shot specification |
| --- | --- |
| User question | Which system is this, and what is unusual about it? |
| Page copy | "Perth's grid is an island. The South West system has no link to the rest of Australia, so all its backup has to be built inside it." |
| Scene | WA outline with the SWIS extent highlighted; a small inset of the NEM's linked regions for contrast; fixed view |
| Control | "Story system" or "Whole state" |
| Feedback | Boundary and legend change together; the caption sits outside the drawing |
| Evidence and chart | CL-WA-01 / SRC-WA-01 (the WEM serves the SWIS); the no-link claim needs its locator (CL-WA-05); boundary geometry and licence pending (ASSET-SWIS-BOUNDARY) |
| Investment meaning | An island holds its own reserve margin, which is why reliability is paid for separately (wa-03) |
| Marker now | Fair. What would change it: an AEMO locator for the no-link claim and licensed boundary geometry (to Strong) |
| Authoring check | Do not colour the whole state as WEM; dots are not investment sites |
| Mobile | Same map; two large buttons |
| Status | Scope verified; geometry and CL-WA-05 pending |

### wa-02 — Built for one-way supply

| Item | Shot specification |
| --- | --- |
| User question | What was the network built to do? |
| Page copy | "The grid was built for big plants sending power one way. Rooftop solar now pushes power back from the edges of the network." |
| Scene | Generator, transmission line, substation, homes and industry; the toggle adds rooftops in the same frame |
| Control | "Earlier pattern" or "With rooftop solar" |
| Feedback | Rooftops appear; one direction marker reverses on the distribution side |
| Evidence and chart | CL-WA-02 / SRC-WA-02, p. 1; WA-specific asset history pending |
| Investment meaning | The old fleet still runs, but the system now needs flexibility it did not need before |
| Marker now | Fair. What would change it: dated WA asset history from a primary source |
| Authoring check | Arrows are schematic, not measured flows; no generation shares without data |
| Mobile | Two aligned panels with the same labels |
| Status | Foundation verified; local detail pending |

## 4. Historical choices

### wa-03 — The choice that shapes the market

| Item | Shot specification |
| --- | --- |
| User question | Why does WA pay batteries for capacity when the NEM does not? |
| Page copy | "When the WEM started in 2006, Western Australia chose to pay for capacity as well as energy. An island cannot import in a shortage, so it buys reliability years ahead. The NEM chose energy-only." |
| Scene | Same grid frame with a five-node timeline; selecting a node changes one layer |
| Control | Select a node; expand "constraint / choice / what remains / effect today" |
| Feedback | Only the selected layer changes; the 2026 outlook node is dashed |
| Evidence and chart | Candidate nodes: the WEM's start with a Reserve Capacity Mechanism (CL-WA-06, source to collect); the decision to retire state coal generation (CL-WA-08, source to collect); the 1 October 2023 reform (CL-WA-03, verified); storage accreditation in the capacity mechanism (CL-WA-07, source to collect); the 2026 ESOO outlook (CL-WA-04, scenario) |
| Investment meaning | The capacity mechanism is why capacity is most of a WA battery's revenue (‹bound: secured share›) |
| Marker now | Thin until CL-WA-06 is sourced. What would change it: a WEM rule-history locator (to Fair), then the user's review of the causal reading (to Strong) |
| Authoring check | Keep the event (the 2006 start with a capacity mechanism) and the interpretation (an island buys reliability ahead) as separate claims; no invented dates; planned retirements never drawn as complete |
| Mobile | Vertical node list; one diagram |
| Status | Rewritten in v1.1. The 2006 node is the story's hinge and the first claim to source |

### wa-04 — Owning a battery is not being paid

| Item | Shot specification |
| --- | --- |
| User question | If I own a capable battery, am I paid for capacity? |
| Page copy | "Not yet. New market rules began on 1 October 2023, but capacity is paid only after AEMO certifies the battery and Capacity Credits are assigned for a capacity year." |
| Scene | Physical layer fixed; a rule overlay shows certification, then credits, then obligations |
| Control | "Physical system" or "Market rules" |
| Feedback | Assets stay put while the overlay changes; the reform date and the date the rules were checked appear separately |
| Evidence and chart | CL-WA-03 / SRC-WA-03; SRC-WA-05 (certification is a separate process); SRC-WA-07 (procedures); effective clauses pending |
| Investment meaning | This is why the fund commits only once credits are assigned (‹bound: next action›) |
| Marker now | Fair. What would change it: the effective certification clauses (to Strong) |
| Authoring check | The 2023 start does not certify a 2026 project; capability, qualification and an award are different things |
| Mobile | Two layers plus a three-step checklist |
| Status | Copy revised in v1.1 |

## 5. Today's tensions

### wa-05 — Midday: plenty of solar, little left for the grid

| Item | Shot specification |
| --- | --- |
| User question | What happens on a sunny midday? |
| Page copy | "On sunny middays rooftop solar leaves little demand for the grid's own plants. That is when a battery charges, and when the operator works hardest to keep the system stable." |
| Scene | Daylight; rooftops lit; grid plants dimmed; a diagram splits total use, rooftop supply and operational demand |
| Control | Midday preset |
| Feedback | Diagram and scene change together; the vertical scale stays qualitative until a trace is approved |
| Evidence and chart | CL-WA-02 / SRC-WA-02; representative day trace pending (GAP-WA-DAY) |
| Investment meaning | Midday is charging time; its cost and access depend on prices and the connection |
| Marker now | Fair. What would change it: an approved observed day trace (to Strong) |
| Authoring check | Operational demand is not total consumption; low demand is not automatically free energy |
| Mobile | Three labelled bands and a midday button |
| Status | Qualitative until GAP-WA-DAY closes |

### wa-06 — The long evening (signature chart)

| Item | Shot specification |
| --- | --- |
| User question | Why does WA pay for long batteries? |
| Page copy | "After sunset, demand stays high for hours with no solar. The capacity mechanism pays storage for the hours it can cover that window, which is why this play is ‹bound: play duration› hours, not four." |
| Scene | Same grid at dusk with the evening window shaded |
| Control | "Midday" or "Evening"; "Show the window the mechanism counts" |
| Feedback | Signature chart: the evening demand profile with the counted window, and four-hour and seven-hour batteries overlaid |
| Evidence and chart | Chart-WA-EVENING needs the obligation duration and intervals for the play's capacity years (CL-WA-07, GAP-WA-RCM; SRC-WA-05/07), a representative evening trace (GAP-WA-DAY) and the duration result from the briefing (REPO-12) |
| Investment meaning | The rules, not engineering preference, set the duration; the play's last hour defends the credit |
| Marker now | Thin until GAP-WA-RCM closes. What would change it: the effective obligation-duration clause (to Fair), plus an observed evening trace (to Strong) |
| Authoring check | No guaranteed evening premium; seven hours does not cover the whole night |
| Mobile | Chart full width; midday and evening buttons |
| Status | Rewritten in v1.1; WA's signature chart |

### wa-07 — Fast response is a different job

| Item | Shot specification |
| --- | --- |
| User question | Is moving energy the same as responding to a fault? |
| Page copy | "No. Responding to a disturbance is a separate service, paid for readiness rather than hours. In this play it is a top-up, not the case." |
| Scene | Day and night paused; a response ladder (seconds, minutes, hours) beside the battery and other resources |
| Control | "Energy over hours" or "Response in seconds" |
| Feedback | Timescale and required capability change together |
| Evidence and chart | SRC-WA-06/07 (essential system services and accreditation); product terms pending |
| Investment meaning | Services use headroom and add revenue only where they fit around capacity obligations (wa-11) |
| Marker now | Fair. What would change it: the product terms for each service |
| Authoring check | No precise frequency curve without an event source; not every inverter provides every service |
| Mobile | Static ladder with expandable service cards |
| Status | Copy revised in v1.1 |

## 6. Add a battery

### wa-08 — Seven hours, not four or eight

| Item | Shot specification |
| --- | --- |
| User question | Why this duration? |
| Page copy | "A battery moves midday energy into the evening. ‹bound: play duration› hours covers the window the capacity mechanism pays for; one more hour is capital the market does not pay for." |
| Scene | One generic station at an illustrative node; the SOC meter and power label sit in HTML beside the drawing |
| Control | Presets for four hours, ‹bound: play duration› hours and eight hours; charge, discharge and empty |
| Feedback | Energy bands and the covered share of the evening window change; the eight-hour preset shows its extra hour outside the paid window |
| Evidence and chart | Teaching unit: 100 MW × ‹bound: play duration› hours, before losses and limits, tagged Example; the duration result from the platform's design-fit sweep (REPO-12); the window from wa-06 |
| Investment meaning | Duration is a capital decision, and the design-fit result shows where extra hours stop paying |
| Marker now | Fair. What would change it: the obligation-duration clause behind the window (GAP-WA-RCM) |
| Authoring check | The teaching node is not a site recommendation; no drag-to-improve-IRR control |
| Mobile | Three preset cards with numeric SOC |
| Status | Rewritten in v1.1: the teaching battery uses the play's duration instead of a generic four hours |

### wa-09 — What the investor owns

| Item | Shot specification |
| --- | --- |
| User question | What sits behind the word "battery"? |
| Page copy | "Battery modules, power conversion, transformers, controls, safety systems and the grid connection make one asset. In WA the valuable rights are the connection and the certified capacity." |
| Scene | Exploded isometric cutaway as SVG layers, with fixed hotspots: battery, PCS, transformer, connection, controls and safety, site works |
| Control | Hotspot list; "Equipment" or "Rights and obligations" |
| Feedback | The selected part is highlighted with its function, cost category where the model exposes one, operating limit and evidence status |
| Evidence and chart | Equipment and function table; cost categories only where the model exposes them, otherwise "Breakdown not available" |
| Investment meaning | Development rights, ready-to-build projects, operating assets and contracted assets are different things to buy; this play's entry route is ‹bound: entry route› |
| Marker now | Fair for generic equipment; project specifics withheld |
| Authoring check | Generic geometry is not a site drawing, fire design or equipment list; no confidential project detail in drawings or labels |
| Mobile | Static cutaway with a vertical hotspot list |
| Status | Kept; drawn as SVG layers |

## 7. Who pays

### wa-10 — Capacity first

| Item | Shot specification |
| --- | --- |
| User question | Who pays this battery, and for what? |
| Page copy | "Capacity first. Once certified and credited, the battery is paid for being available in the evening window, which is most of this play's revenue (‹bound: capacity share›). Energy trading and system services make up the rest." |
| Scene | The scene recedes; 2D payment paths for capacity (certification, Capacity Credits, availability obligations, settlement), energy (market, dispatch, settlement) and services (accreditation, enablement, settlement) |
| Control | Select a route |
| Feedback | Payer, unit, period, obligation and evidence status for the selected route |
| Evidence and chart | SRC-WA-05/06/07 with effective clauses pending; revenue shares from the market page's Revenue section (REPO-05, REPO-13) |
| Investment meaning | The capacity line, priced by the mechanism and credited each capacity year, carries this play; merchant spreads do not |
| Marker now | Fair. What would change it: the effective clauses for each route |
| Authoring check | Capacity payments are not unlimited and do not guarantee debt service; modelled revenue is not a signed contract |
| Mobile | One route at a time as stacked steps |
| Status | Rewritten in v1.1 to follow the play's revenue mix |

### wa-11 — One battery cannot promise everything

| Item | Shot specification |
| --- | --- |
| User question | Can the battery collect every line at once? |
| Page copy | "No. The same megawatts and stored energy cannot be promised twice. In this example, evening capacity obligations come first and services and trading use what is left." |
| Scene | A 2D allocation board linked to the station, with time across and power and energy up |
| Control | Choose illustrative commitments; see the remaining headroom or a conflict |
| Feedback | The teaching board shows the conflict; project feasibility shows "unknown" unless constraints exist |
| Evidence and chart | REPO-06 stack feasibility; teaching values need a calculation record |
| Investment meaning | Only compatible revenue belongs in the cash flow, which is how the model treats it |
| Marker now | Fair for the principle; project constraints unknown |
| Authoring check | Never add standalone maxima; in the experience model, `svcY` is a service cost, not ancillary revenue |
| Mobile | Commitment cards and a short conflict explanation |
| Status | Kept |

## 8. The investment

### wa-12 and wa-13 — retired in v1.1

v1.0's delivery-to-receipt timeline (`wa-12`) and revenue-to-equity view (`wa-13`) duplicated the market page's Execution, Bankable case and Revenue sections. The story now links to those sections from `wa-14` and from every chapter's "Go to the investment case" link. The IDs are not reused. The v1.0 requirements (commercial operation is not first settlement; dated payments preserved; all-equity and levered returns labelled) remain the job of the existing sections, and the v1.0 text is in commit `db158b9`.

### wa-14 — What could weaken it

| Item | Shot specification |
| --- | --- |
| User question | What would make this play less attractive? |
| Page copy | "The risk is the rule. If the capacity mechanism pays for fewer hours, or the capacity price falls as storage fills the evening, the play's last hour stops earning." Then ‹bound: next action›. |
| Scene | Calm overview; competing storage drawn dashed in the evening window |
| Control | Choose a factor: rule change, more storage, credits delayed, costs |
| Feedback | Each factor names the line it affects and links to the matching Downside input where the model has one; otherwise it shows a research gap |
| Evidence and chart | Existing downside definitions (REPO-05); rule and price-curve sources pending (GAP-WA-RCM) |
| Investment meaning | Watch the rules and the credit assignment, not the weather |
| Marker now | Fair. What would change it: the price-curve rules and the obligation-duration clause |
| Authoring check | A need for storage does not guarantee this project; a downside case is not a probability |
| Mobile | Four factor cards, then the links |
| Status | Rewritten in v1.1. Exits: Bankable case, Revenue, Execution and Downside on the market page; compare with the NEM's energy-only choice, Germany or Finland |

## 9. Readiness

Before any quantitative label goes live, close its claim or data gap. The hinge items for this story, in order:

1. CL-WA-06, the 2006 start with a capacity mechanism, which wa-00 and wa-03 depend on.
2. GAP-WA-RCM and CL-WA-07, the obligation duration behind the seven-hour design (wa-06, wa-08, wa-14).
3. GAP-WA-DAY, a representative day trace (wa-05, wa-06).
4. CL-WA-05, the locator for the no-link claim (wa-01).

Before publishing, every central claim has a reviewed source or an Example or scenario style, every figure is bound, and the user signs off the script (`G-1`). Production notes such as layout anchors and symbol IDs can be added later without changing a shot's question or meaning.
