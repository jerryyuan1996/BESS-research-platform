# Japan — ETL gates

**Read this before quoting any Japanese IRR, MOIC or revenue figure from this platform.**

The Japan build mixes two classes of value. The structural facts are anchored to cited public
sources. The economics are not — they are illustrative seed, derived by stated rules, and they are
what stands between this build and an investable model.

---

## What is anchored

Verified against the source cited in `src/markets/jp/sources.js`.

| Fact | Value | Source |
|---|---|---|
| Capacity Market area price, DY2029 — Hokkaido | ¥14,972/kW/yr | OCCTO 2029 main auction |
| Capacity Market area price, DY2029 — Tokyo | ¥15,111/kW/yr | OCCTO 2029 main auction |
| Capacity Market area price, DY2029 — Kyushu | ¥15,112/kW/yr | OCCTO 2029 main auction |
| Contracted capacity, DY2029 | 5,461,594 / 52,376,601 / 18,363,521 kW | OCCTO 2029 main auction |
| Concurrent connection-study cap, from 1 Aug 2026 | Tokyo 11 · Kyushu 8 · Hokkaido 5 | TEPCO PG · Kyushu T&D · HEPCO Network |
| Verified output control, Tokyo | 5 + 6 + 9 = 20 days, Mar–May 2026 | OCCTO |
| Verified output control, Kyushu | 12 + 14 + 24 = 50 days, Jan–Mar 2026 | OCCTO |
| Verified output control, Hokkaido | 7 + 11 + 18 = 36 days, Mar–May 2026 | OCCTO |
| Hokkaido–Honshu interconnection | 0.9 GW today → 1.2 GW approved by FY2027-end | OCCTO wide-area plan |
| Hokkaido BESS balancing registration | >0.2 GW expected FY2026 | HEPCO Network, 30 Mar 2026 |
| Hokkaido BESS connection-contract applications | ~2 GW | HEPCO Network, 30 Mar 2026 |
| HEPCO charging-control early connection | 27 specified systems as of 10 Apr 2026 | HEPCO Network |
| Kyushu expanded transfer-trip system | In operation from 1 Apr 2026 | Kyushu T&D |
| TEPCO battery connection deposit / first contribution | 10% deposit, ≥50% first contribution, from 1 Apr 2026 | TEPCO PG |
| EPRX balancing rule vintage | Effective 1 Jul 2026 | EPRX |
| FY2026 LTDA | In consultation 21 Jul – 3 Aug 2026 — draft, not final | OCCTO |

These are the values that differentiate the three regions structurally, which is why **the ranking
this dashboard produces is more trustworthy than the IRRs it produces.**

---

## What is seed — the gates

Eight inputs are illustrative. Each must be replaced before the Japan markets can be called
investable rather than indicative.

### G1 — JPY/USD FX
Currently `0.0064`, seeded 2026-07-28 in `src/comparison/assumptions.js`.
**Required:** a dated rate at the model date. Never label it live unless it is actually retrieved live.

### G2 — Capex per MW
Currently ¥45,000/kWh × 4 h = ¥180m/MW.
**Required:** reconciliation against a real Japanese 4-hour build — battery, PCS, BOS, civil, grid
connection works, developer margin. Japanese balance-of-plant and civil costs do not map cleanly
from European benchmarks.

### G3 — Fixed O&M
Currently ¥1.8m/MW/yr.
**Required:** vendor quote or operating benchmark.

### G4 — Merchant margin by area
Currently ¥11.5m / ¥13.4m / ¥12.1m per MW/yr for Tokyo / Kyushu / Hokkaido.

**Required:** a 12-month optimised dispatch backtest against **30-minute JEPX Area Price**, per
region, constrained by:

```
export MW · import MW · usable MWh · SOC min/max · RTE · availability ·
cycling/degradation · headroom reserved for balancing
```

```
merchant margin = optimised discharge receipts
                − charging energy cost
                − RTE loss value
                − cycling / degradation variable cost
```

**Never substitute the System Price for an Area Price.** That single substitution would erase the
market-splitting effect, which is the main thing that differentiates Hokkaido and Kyushu from Tokyo.

If the backtest already nets the optimiser fee, set `merchantNetOfFee: true` and `feePct: 0` on that
market's economics. The engine honours the flag; deducting twice is otherwise very easy.

### G5 — Incremental balancing value
Currently ¥2.4m / ¥2.0m / ¥1.5m per MW/yr.

**Required:**

```
incremental value = balancing gross payment
                  − JEPX opportunity cost on reserved headroom
                  − SOC / headroom reservation cost
                  − additional degradation
                  − market fees and performance penalties
```

Only the incremental figure belongs in `economics.services`. Stand-alone balancing revenue
double-counts against the arbitrage cycle.

### G6 — Expected-capacity factor
Currently `0.70` for a 4-hour asset, applied identically in all three areas.

**This is the single highest-leverage open input in the Japan build.** It multiplies the capacity
area price directly, and the formula is national — so it does not differentiate the regions, it
scales all three together.

**Required:** the factor from the current rule vintage, by duration, with the vintage recorded.

### G7 — Auction-renewal curve
Currently a linear decline from 90% of the secured payment in year 2 to 60% in year 15.

**Required:** a documented scenario with stated drivers — storage entering the auction, requirement
growth, de-rating revisions. The curve materially drives exit value because renewal years are
discounted at the market yield.

### G8 — Composite, connection and duration scores
All three scorecards in `src/markets/jp/regions.js` are seed.
**Required:** re-scored against evidence, factor by factor. The weights are already fixed and
published in the dashboard; only the 0–3 and 0–100 scores need replacing.

---

## Why the markets are `engineReady: true` anyway

Every market on this platform is seed-derived — WA, GB, IE, RO and PL included. Japan is not held
to a different standard; it is held to the same one, and the platform's convention is
seed values plus explicit quality badges rather than empty columns.

Setting `engineReady: false` would remove Japan from every comparison, which would misrepresent the
state of the work in the other direction: the structural analysis *is* done, and the ranking it
produces is meaningful.

What is published instead:

- every economic value carries `illus`, and the seed warning appears on the Overview tab
- the Data & Methodology tab lists all eleven inputs with anchored/seed status
- `src/markets/jp/regions.js` documents the provenance split at the top of the file
- this document

**Read the ordering, not the IRRs.** That instruction appears in the dashboard itself.

---

## Turning a gate off

There is no flag to flip. Replace the value in `src/markets/jp/regions.js`, change its badge from
`illus` to `calc` or `official` in the affected blocks, move the row in the Data & Methodology
gate table, and delete the corresponding section here. When all eight are gone, delete this file
and the seed warning with it.
