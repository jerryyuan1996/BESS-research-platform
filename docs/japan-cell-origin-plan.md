# Japan: the cell-origin rule in the long-term auction — plan for sign-off

Drafted 2026-10-23 for `jp_tokyo`, `jp_kyushu` and `jp_hokkaido`. No code or view file has changed.
Approved edits go through `scripts/view/writer.mjs`.

## The answer

The rule is not the one in the brief.
- **Round 3's 30% limit capped awards, not projects.** Each project was classed by its largest cell
  country, and clearing dropped a country's highest bids once that country reached 30% of
  lithium-ion awards.
- **Round 4 replaces that limit for lithium-ion.** Projects using cells from makers certified under
  the Economic Security Promotion Act now clear first, inside a hard 400 MW lithium-ion cap.
  Everyone else wins only the room they leave.
- **No Chinese maker is certified.** The reference build, on HiTHIUM cells, is therefore a
  residual-only bidder from Round 4.

**Recommend:**
- Take `supplyChainOrigin` from **3 to 2** in all three markets, with a sourced reason.
- Keep HiTHIUM as the archetype's price, and open gate **G45** on what a certified-cell DC block
  costs. The ceiling leaves room for up to about **3.6×** HiTHIUM's block before a certified build
  is priced out.
- Keep the fund plays and calls: operating awards predate the rule.
- Condition the strategic call on certified cells. Move Tokyo's and Kyushu's developer and
  first-timer calls, and Hokkaido's strategic call, to **Opportunistic**.
- Record the balancing market's 2026 changes from EPRX's own notice, keep the balancing seeds, and
  open gate **G47**. The brief's figures were off here too: the cap is per ΔkW per 30 minutes, and
  it fell twice, ¥19.51 → ¥15 on 14 March and → ¥10 on 1 September 2026 (§4).

## What the rule is (primary sources, all opened 2026-10-23)

| Source | What it says | Where |
|---|---|---|
| OCCTO, 長期脱炭素電源オークション募集要綱 (FY2025, Round 3), 3 Sep 2025 | For lithium-ion, the awarded capacity per cell country other than Japan must be under 30% of all lithium-ion awards. The same applies to other chemistries. Clearing removes the offending country's projects, highest bid first, until the rule holds | p. 10 §2(1)ア ※2; pp. 32–34, steps オ–キ |
| Same | A battery registers its cell country, and with mixed cells the country of the largest share. It cannot change it after registration | p. 25; p. 26 ※7 |
| METI 006_s02_00, 電力安定供給WG 参考資料2, August 2026 | Round 3 spread production across countries, but makers from one country own plants in many, so their cells still made up the bulk. Round 4 clears first the projects using cells from makers with a certified battery supply-assurance plan, including subsidiaries more than 50% owned. Lithium-ion only, and the 30% rule no longer applies to lithium-ion | p. 36 §(d), notes 37–38 |
| Same | Round 4 caps lithium-ion batteries at 400 MW, with **no award beyond the cap**. Round 3 capped two categories at 400 MW each but allowed up to twice the cap, so 1,700 MW was awarded | p. 11 §(c) |
| OCCTO, 募集要綱 (FY2026, Round 4), 2 Sep 2026 | Certified lithium-ion projects clear before non-certified ones. A non-certified project can win only if the cap is unfilled once every certified project has been judged | pp. 35–36, step ア |
| Same | Only cells made in the maker's own plants count; OEM cells do not. After results, a project may switch only to another certified maker. **A unit may not combine cells from several makers**, so a "≤30% Chinese" cell mix is not allowed | p. 28 ※10–11; p. 60, form 4 ※1 |
| Same | A battery bid must attach a valid quotation for the storage system from its maker, with model, unit price, quantity and total | p. 59, form 4 |
| Same | The BMS must carry a JC-STAR conformity label number (a security requirement on the control system, not an origin rule) | p. 60 |
| METI, 蓄電池 supply-assurance certifications page | 45 plans issued and 3 revoked (Resonac 17 Feb 2026, Denka 4 Apr 2025, Nissan 9 May 2025), so **42 are in force**. They include materials makers: Ube Maxell's plan (2023-1), for example, is for separators. No Chinese maker is listed | meti.go.jp/policy/economy/economic_security/battery/ |
| METI plan summaries | **Two plans name stationary lithium-ion cells, both GS Yuasa's.** With Honda (2023-2): automotive and stationary, supply from April 2027, 20 GWh/yr. Alone (2025-6, certified 17 Feb 2026): stationary, supply from **October 2028**, 2 GWh/yr, about ¥70.3bn with up to ¥24.8bn of subsidy | `battery_2_2r.pdf`, `battery_38_1.pdf` |

Panasonic Energy's and Toyota's summaries were not read: METI's server refused repeat downloads on
2026-10-23. Toyota describes its 2024 plan as next-generation vehicle batteries (release, 6 Sep 2024).

The site should cite these documents and not the BNEF report (licence; `local-data/bnef-esmo-1h-2026.md`
§4.1). BNEF's "45 approved plans" counts the three revoked ones.

`src/markets/jp/national.js` and `data.js` already state the Round 4 rule. The grade, verdicts and
plays have not caught up.

## 1. The grade: 3 → 2, all three markets

Anchor 2 (`src/governance/investability.js`) reads: "an origin or security rule conditions a main
revenue route". The award is 96% of first-year revenue (the revenue-certainty reason), and from
Round 4 a project's cell maker decides whether it clears first or only from the residual. Anchor 3
does not fit: that is a rule that reduces support in proportion. Anchor 1 does not fit either:
nothing bars non-certified cells from connecting or trading.

Proposed reason (Chinese to be drafted with it):
> From Round 4, lithium-ion projects using cells from makers certified under the Economic Security
> Promotion Act clear first inside a 400 MW cap; projects on other cells, including every Chinese
> maker's, win only what certified projects leave.

Evidence: two new source entries, OCCTO Round 4 guidelines (2 Sep 2026) and METI 006_s02_00. Basis:
`official`.

What the change does to each investor's reading of the grade (`src/governance/archetypes.js`, grade 3 → 2):
strategic 70 → 40, infrastructure fund 70 → 45, first-timer 70 → 40, developer 75 → 55. None
reaches a knock-out; the strategic investor's knock-out is grade 1.

Recomputed with `fit()` on today's grades, each investor's score falls 0.4–1.2 points:

| Investor | Tokyo | Kyushu | Hokkaido |
|---|---|---|---|
| Strategic | 74.0 → 72.8 | 66.4 → 65.2 | **60.3 → 59.1** |
| Infrastructure fund | 73.7 → 73.2 | 69.5 → 69.0 | 66.0 → 65.5 |
| First-timer | 69.2 → 68.2 | 66.2 → 65.2 | 64.0 → 62.9 |
| Developer | 66.4 → 66.0 | 63.5 → 63.1 | 58.4 → 58.0 |

One score changes band: Hokkaido's strategic score drops below 60, out of the Build position band
and into the Opportunistic band (§3).

## 2. A certified-cell capex case: gate G45

No certified maker publishes a grid-scale DC-block price, so the case stays a gate. What can be
derived is the price at which a certified build stops being able to bid its cost.

The bid is a cost bid at METI's 4.5% cap (`ltdaCostReflectiveBid` in `src/markets/jp/regions.js`),
so extra capex passes into the bid until it reaches the ceiling:

- 20-year annuity at 4.5%: 0.045 / (1 − 1.045⁻²⁰) = 0.045 / 0.58536 = **0.07688**
- Bid per installed kW per ¥ of capex: 0.07688 × (1 + 5% × 0.41464 decommissioning) + 0.7% fixed-asset
  tax = **0.08547**
- Tokyo today: **¥37,000** per awarded kW. Lowest area ceiling: **¥71,140**. Headroom: ¥34,140 per
  awarded kW × 0.907 factor = ¥30,965 per installed kW
- Capex that headroom carries: 30,965 / 0.08547 = **¥362,300/kW**. At 9h that is
  ¥362.3m ÷ 9,000 kWh = **¥40,255/kWh** on an owner-furnished block
- So a certified block can cost up to 15,561 + 40,255 = **¥55,800/kWh at the meter, about 3.6× the
  landed HiTHIUM block** (¥15,561), before the cost bid passes the lowest ceiling
- Kyushu (¥36,000 award) and Hokkaido (¥35,000) have more room: 3.7× and 3.9× at the same ceiling.
  Tokyo against the band's low end is the tightest case. Every figure here was recomputed from
  `src/markets/jp/regions.js` on 2026-10-23

What does not move: under a cost bid the hold IRR stays near 3% at any capex. The G43 table showed
3.0% at ¥32.5k, 3.0% at ¥60k and 3.1% at ¥69k/kWh. Value at the fund's yields falls roughly in
proportion to capex. **The rule decides who can win, not whether a fund can hold a new build.** It
cannot either way.

| Gate | What | Close when |
|---|---|---|
| **G45** | Price of a certified maker's grid-scale DC block, and whether GS Yuasa's lines (with Honda from April 2027; alone from October 2028) will quote to third-party bidders | A quotation, or a disclosed Round 4 award on certified cells. Every certified Round 4 bidder already holds one: form 4 requires the maker's quotation at registration |
| **G46** | Certified bid volume in Round 4 against the 400 MW cap | Round 4 results (about May 2027). If certified bids fill 400 MW, a HiTHIUM build wins nothing |

## 3. Which verdicts and plays move

| Investor | Today | Proposed | Why |
|---|---|---|---|
| Infrastructure fund ×3 | Opportunistic, operating awarded | **Unchanged** | Round 1–3 awards keep their terms. Round 3's limit acted at clearing, so it binds no operating asset |
| Strategic, Tokyo and Kyushu | Build position, greenfield | **Build position**, with *where* "a new build bid on a certified maker's cells", and the rule added to *despite* | A utility can buy certified cells and pass their cost into the bid below the ceiling |
| Strategic, Hokkaido | Build position, greenfield | **Opportunistic**, with the same *where* | Its score falls to 59.1, into the Opportunistic band. Its connection is non-firm (charging control), and the build now also needs certified cells. With this change, Hokkaido reads Opportunistic for all four investors |
| Developer, Tokyo and Kyushu | Build position | **Opportunistic** | A ready-to-build project sells only to a bidder that wins. The lithium-ion pool falls to a hard 400 MW, against 1,700 MW awarded across the two Round 3 categories, and certified projects take it first |
| First-timer, Tokyo and Kyushu | Build position, ready-to-build | **Opportunistic**, *where* "a project holding a certified maker's quotation" | Without a certified supplier it bids for the residual only |
| Developer and first-timer, Hokkaido | Opportunistic | Unchanged call; the rule added to *despite* | Already opportunistic on connection grounds |

**No proposed call raises the disagreement flag.** `checkVerdict` flags a call two or more bands
from its score. Every call here is at most one band away:
- The Tokyo and Kyushu developer and first-timer calls sit one band below their scores
  (developer 66.0 and 63.1, first-timer 68.2 and 65.2). Their *despite* lines carry the reason.
- Kept at Build position instead, Hokkaido's strategic call would sit one band above its score.

**Plays.** The three `jp-*-ltda-6h` plays are operating, awarded assets, so none moves. Their *why*
lines may add "awards from Rounds 1–3 predate the certified-cell rule". No new play is proposed until
G45 gives a certified price.

**Triggers.** Each area's Round 4 trigger label adds "certified-cell projects clear first inside 400 MW".
The trigger watches `supplyChainOrigin` as well as `revenueCertainty`.

## 4. The balancing market since March 2026

All three changes are confirmed, but the switch came on 14 March, not 1 April. The cap has also been
cut a second time since.

| Change | From (delivery date) | Source |
|---|---|---|
| 一次, 二次①, 二次② and 三次① (four of five products) move from week-ahead to day-ahead trading. Their trading unit goes from three hours to **30 minutes**. 三次② was already day-ahead | Trading 13 Mar, delivery **14 Mar 2026** | METI 001_08_00 (13 May 2026) pp. 3–4; METI 110_04_00 (23 Jan 2026) p. 2 note 1 |
| Price cap on 一次, 二次① and the composite product: ¥19.51 → **¥15.00** per ΔkW per 30 minutes | 14 Mar 2026 | EPRX, 需給調整市場のΔkW上限価格について, 30 Jul 2026 |
| Same three products: ¥15.00 → **¥10.00**, "for the time being" | **1 Sep 2026** | Same notice; decided at METI's 電力安定供給WG on 14 Jul 2026 (004_06_00 p. 22) |
| 二次② and 三次① stay at ¥7.21; 三次② has no cap | — | Same notice |
| Procurement volume for 一次 and 二次①: 3σ → **1σ** equivalent | 14 Mar 2026 | METI 110_04_00 p. 6; 001_08_00 p. 3 |

**The brief's "¥38.4 → ¥30/kWh" restates the cap per hour.** ¥15 per 30 minutes is ¥30 per
ΔkW-hour. But the old cap was ¥39.02 per hour (2 × 19.51), not ¥38.4. And the September cut to ¥20
per hour is missing. The cap has fallen **48.7%** in six months (10 / 19.51 = 0.513).

**What batteries did** (METI 004_06_00 p. 8, from EPRX data, composite product):
- Average battery bid: **¥11.35** per ΔkW per 30 minutes before the switch.
- Over the four four-week periods from 14 March to 3 July 2026: **¥8.45, ¥8.72, ¥9.70, ¥9.47**.
- Battery bid volume: 6.2 → 10.3 million ΔkW-hours a day (+66%).
- In June–July, 5.7% of all composite bid volume sat above ¥10 (p. 10).

So the ¥10 cap sits 3–6% above batteries' average bid (10 / 9.70 and 10 / 9.47). It trims the
tail, not the middle. The market is pay-as-bid, so a battery clearing at ¥9.5 is paid ¥9.5.

**What it means for the site:**
- **Text, now.** `national.js`'s EPRX row still says "Weekly / daily procurement". Since 14 March
  2026 every product is day-ahead, in 30-minute units. Add the two caps and the 1σ volume, citing
  a new source entry for EPRX's 30 July notice.
- **The award case barely moves.** 90% of other-market revenue is returned.
  - For a new bid, the lost 10% is recovered in the cost bid.
  - For an operating award, the bid is fixed. The most it loses in Tokyo is ¥117k/MW-yr
    (10% × 48.7% × ¥2.4m), and only if every ΔkW had sold at the cap.
- **The Capacity Market and merchant routes carry the whole balancing seed.** That is `regionEcon`
  in `src/markets/jp/regions.js`: Tokyo ¥2.4m, Kyushu ¥2.0m, Hokkaido ¥1.5m per MW-yr.
  - Scaling the seeds by the cap would cut them 48.7%. That overstates the cut, because batteries
    already bid under ¥10.
  - The larger unknown is the volume cut to 1σ. No public per-MW series prices it.

| Gate | What | Close when |
|---|---|---|
| **G47** | Per-MW balancing revenue for a battery since day-ahead trading began on 14 Mar 2026 | A series built from EPRX's published trading results, or an operator's disclosure. Then re-seed `services` in each area |

## Signed off by Jerry, 2026-10-23

The analyst's new evidence: **HiTHIUM has received METI's battery supply-assurance plan
certification** under the Economic Security Promotion Act, covering the plant that makes the
quoted cells. This is practitioner evidence on the same footing as the HiTHIUM quote. METI's public
list did not show it on 2026-10-23, so add the official entry as a source once it appears. The
rulings below supersede the recommendations underneath them where they differ.

1. **Grade `supplyChainOrigin` 3 → 2 in all three markets: approved.** The rule still conditions
   the main revenue route, for every project. The reason should add that the reference build's
   supplier is certified.
2. **Capex stays on the HiTHIUM quote.** No certified-cell premium. G45 closes for the reference
   build; it stays open only for a build on another maker's cells.
3. **Verdicts re-evaluated on HiTHIUM's figures, so the reference build clears first inside the
   400 MW cap:**
   - Strategic, all three areas: **Build position**, *where* "a new build on a certified maker's cells".
     Hokkaido sits one band above its new score of 59.1. The score falls only through the grade,
     and the reference build passes that rule.
   - Developer and first-timer, Tokyo and Kyushu: **keep Build position**. This reverses §3, whose
     premise was a residual-only HiTHIUM bid.
   - Developer and first-timer, Hokkaido; infrastructure fund ×3; the three plays: unchanged.
   - Every *despite* adds: the lithium-ion pool is now a hard 400 MW against 1,700 MW awarded in
     Round 3, so certified bidders compete on cost for less room.
4. **Balancing: record the rules, keep the seeds, open G47: approved.**

**As built, 2026-10-23 (not committed).**
- **Thirteen view changes** went through `scripts/view/writer.mjs apply`:
  - `supplyChainOrigin` 3 → 2 in all three markets. Basis is `official`. Evidence is the OCCTO Round 4
    guidelines, METI 006_s02_00 and the analyst's HiTHIUM certification.
  - Strategic ×3: *where* added, and the 400 MW clause added to *despite*.
  - Developer and first-timer, Tokyo and Kyushu: the 400 MW clause added to *despite*.
  - The three Round 4 triggers: new label, and they now also watch `supplyChainOrigin`.
- **Sources** (`src/markets/jp/sources.js`): `occtoLtda2026` now points at the Round 3 results annex.
  Five new entries: `occtoLtdaRound4Guidelines`, `meti006s02`, `hithiumEspaCertification`,
  `eprxPriceCap` and `metiBalancing202605`. The certification is exempt from the URL check
  (`src/governance/sourceUrls.js`) until METI publishes it.
- **Text:** `national.js`'s EPRX row now carries day-ahead trading, 30-minute units, both cap cuts
  and the 1σ volume.
- **Gates:** G45, G46 and G47 are in `docs/external-view.md`.
- **Checks:** `npm test` 874/874; `npm run test:current` 84/84, so no published return moved; the
  build is clean.

## Decisions for you (as proposed, before sign-off)

1. **Grade `supplyChainOrigin` 3 → 2 in all three markets**, with the reason above and the two new
   official sources. **Recommended.**
2. **Certified-cell capex as gate G45, not a number.** The archetype stays on HiTHIUM; the plan
   records the ¥55,800/kWh (3.6×) ceiling break-even. The alternative is a placeholder premium now,
   which would publish a price no one has quoted. **Recommended: the gate.**
3. **Verdicts as in the table in §3.**
   - Strategic keeps Build position on certified cells in Tokyo and Kyushu.
   - Hokkaido's strategic call goes to Opportunistic. You could instead keep it at Build position,
     one band above its new score.
   - The Tokyo and Kyushu developer and first-timer calls go to Opportunistic.
   - The fund calls and plays do not move.
   - **Recommended.**
4. **Balancing: record the rules now, keep the seeds, open G47.** The text change cites EPRX's
   30 July notice and METI's papers. Re-seeding waits for a per-MW series, because batteries
   already clear under the cap. The alternative is to cut the seeds by the cap's 48.7% now, which
   would overstate the fall. **Recommended.**

## Found in passing (not part of this change)

- `occtoLtda2026` in `src/markets/jp/sources.js` is labelled "Round 3 results, 13 May 2026", but its
  URL is the July 2026 consultation page for the Round 4 guidelines.
- Round 4 lets a battery ask for an award term of up to 40 years (Round 4 guidelines p. 10 §2(2)).
  The site models 20.
