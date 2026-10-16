# Japan: the award re-priced on the auction's own rules — plan for sign-off

Drafted 2026-10-16 on gate G43. It follows `docs/japan-ltda-floor-plan.md` (PR #38). The derivations
come first and nothing is built. The engine, the view store and every published number stay as they
are until you sign off.

## The answer

Japan's long-term auction award (LTDA) **does not clear a fund's yields on any sourced input set**.
Today's positive value comes entirely from the engine's 8% bid return, and METI does not let a battery
bidder price it.

Re-priced on the auction's own rules, a 9h build is worth −$491k to −$495k/MW at the engine's capex,
with a 3.0% hold IRR. Those rules are:
- a 4.5% pre-tax return;
- payment on awarded kW;
- METI's battery opex.

At the one disclosed winner's capex the 9h build is still −$271k. At the battery lines trade press
reports (¥13,000–25,000 per awarded kW) it is −$0.6m to −$3.1m.

A long-term award is a regulated ~4.5% asset that winners carry on ~95% debt. That is a utility's
trade, not an unlevered fund's.

**Recommend:**
- Move Japan's archetype to **9h**, priced at its own regulated cost bid.
- Take the three fund calls from **Build position to Opportunistic**: an operating, awarded asset
  bought at a price that clears the hurdle. This is the precedent you set for the NEM and CAISO on
  2026-10-16.
- Keep the engine's capex, and open gate **G44** on what winners actually spend.

## What G43 established

Sources, all opened: METI 006_s02_00 (Round 4, August 2026); OCCTO 制度詳細 (September 2025); the
SMBC release of 27 May 2025.

| Input | Engine today | On the rules | Source |
|---|---|---|---|
| Return a battery bid may include | 8% (`LTDA_REQUIRED_RETURN`) | **4.5% pre-tax WACC**, Round 4 (4% in Rounds 1–3). The market-surveillance commission strips costs that are not allowed, and the award is re-corrected for interest rates every year | METI 006_s02_00, tables 17 and 29; 制度詳細 p. 53 |
| kW the award is paid on | installed kW | **Awarded kW = installed × 6h adjustment factor**, fixed for 20 years: Tokyo 0.907, Kyushu 0.933, Hokkaido 0.946 | 制度詳細 pp. 49–50; METI table 30 |
| Opex | ¥1.8m/MW-yr | **¥7,000/kW-yr O&M + ¥900/kW-yr generation-side charge + 1.4% fixed-asset tax**; decommissioning at 5% of the build | METI table 31 |
| Capex at 6h | ¥360m/MW market (¥60k/kWh); the sponsor pays 90% | METI's official average is ¥416,000/kW (¥69k/kWh). One winner, FMS at Nishigo (40 MW / 200 MWh, BYD cells), cost about ¥6.5bn all-in, which is **¥32.5k/kWh**, financed on ¥6.2bn of 20-year debt | METI table 31; SMBC release |
| Battery ceiling, FY2026 | ¥70,675–74,417 (table 29) | ¥71,140–74,906 by area (table 30) | METI tables 29–30 |

G42 found that trade press put the battery line at about ¥25,000 per awarded kW in Round 1 and
¥12,000–13,000 for 3–6h batteries in Round 2. At FMS-level capex and the 4.5% cap, a 9h cost bid comes
to about ¥21,000–33,000 per awarded kW: roughly ¥21,000 with the engine's opex, ¥33,000 with METI's.
**So cheap capex, the capped return, high gearing and the awarded-kW basis together explain the
clearing levels.**

## Derivations

`node scripts/derive/japan-ltda-repricing.mjs` prints the full table from the repository's own data.
It is read-only.

- The design is a 9h build, which holds 6.13h in year 20 against the 6h floor.
- Values are USD per MW at the platform's exit yields (7.5% secured, 11.5% merchant); IRRs are
  unlevered.
- Hold IRR reads the platform's fifteen-year window of a twenty-year award, so it sits below the 4.5%
  the bid recovers over twenty years.
- Fixed-asset tax is taken at 1.4% of half the build (average book value), and decommissioning at the
  end of the window.

Tokyo is shown below. Kyushu and Hokkaido are within $50k of it on every row, because the award is
national.

| Capex | Inputs | Award, per awarded kW | Value/MW | Hold IRR | Exit IRR (yr 5) |
|---|---|---|---|---|---|
| Engine stack (¥60k/kWh at 6h) | Today: 8% bid, engine opex | ¥53,970 | **+$149k** | 7.4% | 8.0% |
| Engine stack | **The rules: 4.5% bid, METI opex** | ¥53,191 | **−$492k** | 3.0% | 1.4% |
| Engine stack | Market line, METI opex | ¥25,000 | −$2,014k | — | −22.5% |
| Engine stack | Market line, METI opex | ¥13,000 | −$2,661k | — | −58.3% |
| METI average (¥69k/kWh) | The rules | ¥60,090 | −$567k | 3.1% | 1.4% |
| METI average | Market line ¥25,000 | ¥25,000 | −$2,461k | — | −25.6% |
| FMS-like (¥32.5k/kWh) | The rules | ¥32,863 | −$271k | 3.0% | 1.3% |
| FMS-like | Market line ¥25,000 | ¥25,000 | −$695k | −3.1% | −8.7% |
| FMS-like | Market line ¥13,000 | ¥13,000 | −$1,343k | — | −39.6% |

What the table says:

1. **The return cap decides it.** Moving 8% → 4.5% takes the engine-capex case from +$149k to
   −$492k, and no capex level reverses that. A bid that recovers capex at 4.5% over twenty years cannot
   be worth par at a 7.5% secured yield.
2. **The kW basis matters only against market prices.** For a cost bid the factor cancels: the bid
   per awarded kW rises by 1/factor and the payment per installed kW is unchanged. Against
   trade-press lines, which are per awarded kW, it widens the gap by 5–9%.
3. **METI's opex is about four times the engine's.** It adds about ¥10,000/kW-yr to every cost bid.
   METI's O&M figure is an average across subsidy projects and may overstate what a winner pays. G44
   asks.
4. **Our sponsor's cost bid would not win.** At ¥53,000 per awarded kW against lines of
   ¥13,000–25,000, a project built at the engine's capex is outbid. Even at FMS capex the rule-based bid
   (¥32,900) sits above the Round 1 line.

## Decisions for you

1. **Bid return: 8% → 4.5%.** The Round 4 cap moves into `economics.ltda.bidReturn`, declared per
   round. **Recommended:** it is the rule, and bids above it are cut back.
2. **Pay on awarded kW.** Each area carries its 6h adjustment factor, and the payment per installed kW
   is the bid per awarded kW times the factor. The design-fit sweep keeps the factor fixed across
   durations, as OCCTO fixes it for twenty years. **Recommended.**
3. **Japan's opex: METI table 31.**
   - The new figure is ¥7,000/kW-yr O&M, scaled with energy at the existing 50% share, plus
     ¥900/kW-yr charge, plus 1.4% fixed-asset tax.
   - Decommissioning at 5% of the build is carried through the engine's existing
     `decommissioningPerMW`.
   - This applies to every Japanese route, so the Capacity Market and merchant cases move as well.
   - Your 2026-10-12 ruling holds: warranty extension and LTSA paid annually, no augmentation. Their
     cost sits inside this O&M figure.
   - **Recommended.**
4. **Capex: keep the engine's stack (¥60k/kWh at 6h)** and open **G44** on what LTDA winners spend.
   The two sourced points straddle the engine (¥69k official, ¥32.5k for one winner), and one
   disclosure does not set a market. **Recommended.**
5. **Archetype: 6h → 9h.** The 9h build is the smallest declared build that holds the floor to year
   20. Its award is its own regulated cost bid (decision 1), and other durations hold that award
   (kW-paid; the market reading of 2026-10-16). This is decision 7 of the floor plan. **Recommended.**
6. **The fund calls: Build position → Opportunistic**, for Tokyo, Kyushu and Hokkaido.
   - The situation is an operating, awarded asset bought at a price that clears the hurdle.
   - "Despite" becomes: the award is a regulated ~4.5% return.
   - Changes-if: gate G44, and Round 4's battery line.
   - The other three investors' calls are not touched.
   - **Recommended:** every row of the derivation is negative for an unlevered fund.
7. **The Round 4 trigger label** drops the ¥46,500 break-even. It now reads: "battery awards have
   cleared at about ¥13,000–25,000 per awarded kW (trade press)". **Recommended.**
8. **The ceiling band** moves to table 30's area figures (¥71,140–74,906). It is context, not an
   input. **Recommended.**

## What moves once you sign off

- **Published numbers** (`npm run test:current`, regenerated with the diff justified):
  - Japan's three archetypes move from 6h at 7.4% hold to 9h at about 3.0%.
  - Japan's Capacity Market and merchant cases move with the opex.
  - No other market moves.
- **The briefing.**
  - Japan leaves Prepare for Situational.
  - The ⚑ clears, because call and economics agree.
  - The shortlist line becomes "Prepare in Ireland".
- **Grades.**
  - Japan's asset-return rank falls: a 3.0% hold sits near CAISO, NEM and PJM.
  - Its revenue-certainty reason re-quotes the secured share.
  - Both come as a change file for your sign-off, like GB's.
- **Content** (through the writer, signed off with this plan): the three fund calls (decision 6), the
  three Round 4 triggers (decision 7), and the plays' "why" lines quoting the regulated return.
- **Code**:
  - `src/markets/jp/regions.js`: the bid return, area factors, opex, decommissioning, the archetype at
    9h and the ceiling band.
  - `src/comparison/designFit.js`: hold an awarded-kW factor fixed across durations.
  - Tests: design-fit parity at the new archetype; the bid reproduces ¥53,191 per awarded kW for
    Tokyo; the 4.5% rule is read from the economics, not hard-coded.
- **Docs:** G43 closed and G44 opened in `docs/external-view.md`, and the floor plan's ruling updated.

## Research gate

| Gate | What | Why |
|---|---|---|
| **G44** | What LTDA battery winners spend: capex per kWh at 6h+ and annual O&M | One disclosure (FMS, ¥32.5k/kWh) against METI's ¥69k/kWh average. Capex sets the cost bid and therefore whether a sponsor can win at all. Close when a second awarded project discloses its total cost |
