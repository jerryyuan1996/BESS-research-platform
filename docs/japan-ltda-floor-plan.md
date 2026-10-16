# Japan: pricing the build that holds the award floor — plan for sign-off

Drafted 2026-10-16 as PR 8 of the guided-experience plan (`docs/guided-experience-plan.md`), and
built the same day on the ruling below.

## Ruled (2026-10-16)

You approved decisions 1 and 3–7, then gate G42 reported before any code was written. Battery award
prices are confidential in every round, and trade-press estimates put the winning line at about
¥25,000/kW-year in Round 1 and ¥12,000–13,000 for 3–6h batteries in Round 2. Both are below even
the engine's ¥37,000 at 6h. Decision 2 was therefore replaced by the **market reading**:

- **The award stays the engine's 6h bid at every duration.** That is reading (a) in D3. It needs no
  new engine code, because a kW-paid award already holds flat across durations.
- **Japan's grid reaches 9h and 10h** on JEPX capture (0.61 and 0.48), so the award route prices
  the build that holds the floor. That build is 9h, at **−$554k to −$563k/MW** (3.2% hold).
- **The three calls stay at Build position** (decision 5). They stay flagged on the desk, because a
  compliant design is now priced and its value is negative. You will re-rule them once gate
  **G43** has re-sourced Japan's ¥360m/MW capex and 8% bid return. Winning bidders evidently build
  or finance well below both.
- **The drafted plays move to 9h** (decision 6). The Round 4 trigger carries the 9h build's
  break-even award, about ¥46,500/kW-year, which trade press reports even though OCCTO does not
  (decision 5).
- **Decisions 3, 4 and 7 stand as written.** Under the market reading, decision 3 holds with no
  code: every build gets the same award.

The plan as drafted follows, unchanged, for the derivations.

## The answer

Price Japan's long-term auction award (LTDA) at **9h installed**. That is the smallest declared build
whose six-hour floor still holds in year 20 (6.13h) after 2%/yr fade. The award is **re-bid at that
build's own cost, ¥49,000/kW/yr**: the same cost-reflective rule that gives today's ¥37,000 at 6h.

On that reading the floor-holding build earns about what the 6h archetype shows today:

| Area | Value/MW | Hold IRR | Exit IRR (yr 5) |
|---|---|---|---|
| Tokyo | +$152k | 7.4% | 8.0% |
| Kyushu | +$160k | 7.5% | 8.1% |
| Hokkaido | +$152k | 7.4% | 8.0% |

The difference is that the 9h build is compliant and the 6h one is not. The briefing's "not compliant"
flag on Japan clears.

The reading turns on the award level. If batteries clear below about **¥46,500/kW/yr**, the 9h build
loses value at the platform's yields. If they clear at the 6h level, it loses about $560k/MW.

Round 3 was pay-as-bid and its battery prices are not public. So: keep all three areas at
**Build position**. Open gate **G42** on the award level, and make Round 4's results the trigger for
moving Tokyo back to Enter now.

## What is settled

These need no decision.

- **The floor.** A battery must run six hours continuously at its contracted kW. The declared capacity
  is "deemed to have every operational risk built in", and the form names "capacity decline due to
  degradation". Shortfalls are penalised every 30-minute slot, every delivery year, for 20 years.
  (OCCTO 募集要綱 FY2025 and FY2026; gate DG-5, closed 2026-10-15 in
  `docs/duration-and-route-fit-research-gates.md`.)
- **Fade.** The fade seed is 2%/yr with no augmentation (your ruling of 2026-10-12). The year-20 factor
  is 0.98¹⁹ = 0.6812, so a 6h build holds **4.09h** and the floor needs **8.81h** per contracted kW.
  `termCheck` in `src/comparison/designFit.js` already computes both.
- **The payment basis.** The award pays ¥/kW/yr on contracted kW. Energy is not paid
  (`paymentBasis: 'kW'`).
- **Today's award.**
  - The engine's bid is cost-reflective: market capex of ¥360m/MW at 6h, recovered at 8% over 20
    years, plus opex, less the 10% of market profit the award lets the owner keep. That gives
    **¥37,000/kW/yr** (`src/markets/jp/regions.js`).
  - The sponsor pays 90% of market cost (`OEM_CAPEX_MULTIPLIER`), which is why the archetype shows
    positive value.
  - The FY2026 battery ceiling is ¥70,675–74,417.
- **Round 3** (results 13 May 2026):
  - The auction was pay-as-bid.
  - About 1.25 GW of batteries were awarded.
  - Battery clearing prices were not disclosed.
  - Totals are public only for decarbonised sources as a whole: ¥474.8bn/yr on 4.26 GW.
  - Sources: [Greenberg Traurig](https://www.gtlaw.com/en/insights/2026/6/bess-and-the-japan-power-market-the-current-state-of-play-at-ltda-auction-round-3), [Withers](https://www.withersworldwide.com/en-gb/insight/read/japan%E2%80%99s-third-long-term-decarbonized-power-source-auction-%28ltda%29-results).

## Derivations

Every table below is printed by `node scripts/derive/japan-ltda-floor.mjs`, from the repository's own
data. The script is read-only, and its extension past 8h exists only inside the script.

### D1. Capture past 8h, read from JEPX

Japan's declared grid stops at 8h, and the sweep never extrapolates. JEPX can price the next hours by
the method of `docs/duration-and-route-fit-plan.md` §3.3:
- `meanDailyExecutableSpread`;
- contiguous charge and discharge windows;
- one cycle a day;
- Tokyo days;
- the twelve months 15 October 2025 to 16 October 2026.

| Hours | Tokyo | Kyushu | Hokkaido | Mean | Declared today |
|---|---|---|---|---|---|
| 6 | 0.866 | 0.888 | 0.872 | 0.875 | 0.85 |
| 8 | 0.718 | 0.728 | 0.728 | 0.725 | 0.72 |
| 9 | 0.614 | 0.595 | 0.618 | **0.609** | — |
| 10 | 0.505 | 0.449 | 0.479 | **0.478** | — |

The 6h and 8h rows reproduce §3.3 and the declared seed. Past 8h the spread falls fast: a 10h cycle
uses 20 of the day's 24 hours. Under the award, 90% of market profit goes back to OCCTO, so these
figures move the award route by about $5k/MW. They matter for the merchant route.

### D2. Two ways to hold the floor

DG-5 found that a bidder can hold the floor in either of two ways:

- **(A) Oversize the energy.** Build about 8.8h per contracted kW, or 9h on a declared grid.
- **(B) Contract fewer kW.** Build 6h and contract 68% of nameplate, the share that still runs six
  hours in year 20.

Per contracted MW, (A) costs ¥427m (9h, sponsor basis) and (B) costs ¥324m ÷ 0.681 = ¥476m. (A) adds
only energy; (B) buys power and energy it never gets paid for. (A) is the cheaper of the two whenever
power-related capex is above zero, which it always is. **Report (B), do not price it.** Its row
below is −$582k to −$591k.

### D3. What the award pays the floor-holding build

There are three readings:

- **(a) The 6h award held** (¥37,000). This treats the award as a price the market sets with 6h
  costs.
- **(b) Re-bid at the build's own cost** (¥49,000 at 9h). The archetype's own rule, applied to the
  build that complies.
- **(c) The ceiling.** Not used. In a pay-as-bid round a ceiling bid clears only when the round is
  undersubscribed.

**Recommend (b).** Every compliant battery bidder carries the same requirement: the declared capacity
must already allow for degradation. So the cost a compliant bid has to recover is the floor-holding
build's cost. (a) assumes rivals can hold the floor more cheaply. They might, through planned
augmentation, cheaper cells or a lower required return, and that is what gate G42 tests.

### D4. Hours beyond the floor keep the floor build's bid

A pay-as-bid auction ranks bids by price. A 10h build bidding its own cost (¥53,000) would rank below
a 9h build at ¥49,000, so a 10h build is priced at the 9h bid.

Without this rule the sweep would reward capex and drift to the longest declared build. The reason:
the sponsor buys at 90% of the market cost the bid recovers, so every added yen of capex adds margin.

### D5. The results

Values are USD per MW at the platform's exit yields (7.5% secured, 11.5% merchant). IRRs are unlevered.

| Area | Design | Capex ¥m/MW | Award ¥/kW/yr | Value/MW | Hold IRR | Exit IRR (yr 5) | Hours per contracted kW, year 20 |
|---|---|---|---|---|---|---|---|
| Tokyo | 6h, as modelled today | 324 | 37,000 | +$112k | 7.4% | 8.0% | 4.09h (fails) |
| Tokyo | **9h, re-bid at its own cost** | 427 | **49,000** | **+$152k** | 7.4% | 8.0% | 6.13h |
| Tokyo | 9h, the 6h award held | 427 | 37,000 | −$562k | 3.2% | 0.7% | 6.13h |
| Tokyo | 10h, at the 9h bid | 461 | 49,000 | −$81k | 6.1% | 5.8% | 6.81h |
| Tokyo | 6h, 68% of kW contracted | 324 | 37,000 on 68% | −$590k | 1.8% | −1.8% | 6.00h |
| Kyushu | 6h, as modelled today | 324 | 37,000 | +$120k | 7.5% | 8.1% | 4.09h (fails) |
| Kyushu | **9h, re-bid at its own cost** | 427 | **49,000** | **+$160k** | 7.5% | 8.1% | 6.13h |
| Kyushu | 9h, the 6h award held | 427 | 37,000 | −$554k | 3.2% | 0.8% | 6.13h |
| Kyushu | 10h, at the 9h bid | 461 | 49,000 | −$75k | 6.2% | 5.9% | 6.81h |
| Kyushu | 6h, 68% of kW contracted | 324 | 37,000 on 68% | −$582k | 1.8% | −1.6% | 6.00h |
| Hokkaido | 6h, as modelled today | 324 | 37,000 | +$111k | 7.4% | 8.0% | 4.09h (fails) |
| Hokkaido | **9h, re-bid at its own cost** | 427 | **49,000** | **+$152k** | 7.4% | 8.0% | 6.13h |
| Hokkaido | 9h, the 6h award held | 427 | 37,000 | −$563k | 3.2% | 0.7% | 6.13h |
| Hokkaido | 10h, at the 9h bid | 461 | 49,000 | −$82k | 6.1% | 5.8% | 6.81h |
| Hokkaido | 6h, 68% of kW contracted | 324 | 37,000 on 68% | −$591k | 1.7% | −1.8% | 6.00h |

**Break-even award for the 9h build** at the platform's yields: ¥46,400–46,500/kW/yr. That is 62–66%
of the FY2026 battery ceiling and ¥2,500 below the 9h cost bid.

The three areas land within $10k of each other because the award is national. As the theses say,
what separates them is charging access, curtailment and execution.

## The three calls, re-checked

| Area | Fund call (ruled 2026-10-16) | What the fund sees once 9h is priced | Recommendation |
|---|---|---|---|
| Tokyo | Build position (from Enter now) | Compliant: +$152k, 8.0% exit, 96% secured for 15 years | **Keep Build position.** Return to Enter now if Round 4 batteries clear at or above ¥46,500/kW/yr |
| Kyushu | Build position | +$160k, 8.1% exit | **Keep Build position** |
| Hokkaido | Build position | +$152k, 8.0% exit | **Keep Build position** |

All three stay in Prepare and lose the ⚑. The call-versus-economics rule no longer fires, because a
compliant design is priced at positive value. Tokyo went down on 2026-10-16 because no compliant design
was priced. That reason is gone, but positive value now rests on an award level no one has published.

## What changes once you sign off (PR 8 code)

1. **Japan's grid.**
   - Where: `JP_DURATION_RESPONSE` in `src/markets/jp/regions.js`.
   - Hours become [1, 2, 4, 6, 8, **9, 10**].
   - Capture adds **0.61 and 0.48**, the JEPX three-area means, with basis `observed` for those two
     hours and `seed` for the rest.
2. **The award at a floor-holding build.**
   - Where: `src/comparison/designFit.js`.
   - A new route-rule leaf on Japan's `ltda`: the payment at any design that holds the floor is the
     cost bid of the smallest declared build that holds it (D3, D4).
   - The bid reads its rate and term from `economics.ltda` (8%, 20 years; today they are constants
     in `regions.js`).
   - It reads market cost by undoing `OEM_CAPEX_MULTIPLIER`, which `applySponsorAssumptions` would
     record on the economics.
   - It is neutral for every other market, because no other route declares the leaf. The archetype
     keeps its own award, so parity at the archetype holds.
3. **The Brief's line** becomes, computed: "Tokyo: long-term auction award at 9h, +$152k/MW." The
   tabs follow through `designAnswer.js` (PR 7).
4. **Plays** (analyst content, through the writer, signed off separately):
   - `jp-tokyo-ltda-6h`, `jp-kyushu-ltda-6h` and `jp-hokkaido-ltda-6h` move to `hours: 9`.
   - Their labels read "Long-term auction award · 9h installed, holding the 6h floor · awarded".
   - Ids are kept, so the changelog stays continuous.
5. **Triggers** (content). Each area's Round 4 trigger gains the ¥46,500/kW/yr threshold in its text.
6. **Tests.**
   - `tests/design-fit.test.js`:
     - 9h is eligible on the award route, and 6h and 8h are not;
     - 10h is paid the 9h bid;
     - the best on the award route is 9h;
     - parity at the 6h archetype is unchanged.
   - `tests/deep-layer.test.js` stays green.
   - `npm run test:current` stays unchanged: it reads the archetype, and the archetype keeps its own award.
7. **Docs.** The JP row of the duration plan's §15 table, gate **G42** in `docs/external-view.md`, and
   the as-built note.

**Not in this PR: the archetype.** Japan's league-table case stays at 6h, and moving it is your
decision, as 4h → 6h was. The /returns league table and the asset-return grade read the archetype,
not the plays, so they keep showing a build that fails the floor. Moving the archetype to 9h is
decision 7 below. It would move published numbers only slightly (hold IRR 7.4% either way), and it
would go through the change-review process with its own diff.

## Research gate

| Gate | What | Why | Where |
|---|---|---|---|
| **G42** | The level at which compliant batteries clear in the long-term auction | (b) holds only if compliant bids clear at or above about ¥46,500/kW/yr. Round 3's battery prices are not public (pay-as-bid) | OCCTO, 長期脱炭素電源オークション約定結果 (FY2025, published 13 May 2026: totals by source type, if broken out); Round 4 results in 2027; awarded developers' disclosures |

## Decisions for you

1. Extend Japan's grid to 9h and 10h on JEPX capture (0.61, 0.48). **Recommended.**
2. Pay the floor-holding build its own cost bid (b), not the 6h award (a). **Recommended.**
3. Builds longer than the floor keep the floor build's bid. **Recommended.**
4. Contracting fewer kW (B) is reported, not priced. **Recommended.**
5. Keep all three areas at Build position. The Round 4 trigger gains the ¥46,500 threshold.
   **Recommended.**
6. Move the three plays to 9h, with ids unchanged. **Recommended.**
7. Move Japan's archetype from 6h to 9h in a follow-up through change review. **Recommended**, because
   a non-compliant archetype in the league table is the contradiction PR 7 removed everywhere else.
