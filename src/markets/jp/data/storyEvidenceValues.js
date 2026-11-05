/* Analyst-entered fixed-vintage facts. No ETL feed and no model inputs. */
export const JP_STORY_VALUES = {
  "checkedOn": "2026-11-05",
  "national": {
    "eastFrequency": 50,
    "westFrequency": 60,
    "converterYear": 2027,
    "converterCurrentMW": 2100,
    "converterPlannedMW": 3000,
    "h01Year": 2016,
    "earthquakeDate": "2011-03-11",
    "outageDate": "2011-03-14",
    "earthquakeMonth": "2011-03",
    "earthquakeYear": 2011,
    "reformStep1": "2015-04",
    "reformStep2": "2016-04",
    "reformStep3": "2020-04",
    "capacityMarketYear": 2020,
    "ltdaYear": 2023,
    "supplyCrunchDate": "2022-03",
    "supplyCrunchYear": 2022,
    "awardTerm": 20,
    "obligationHours": 6,
    "clawbackShare": [
      "nine-tenths",
      "九成"
    ],
    "nextRound": [
      "Round 4",
      "第四轮"
    ],
    "lithiumIonPoolMW": 400,
    "bidOpenDate": "2027-01-27",
    "bidCloseDate": "2027-02-03",
    "fitDate": "2012-07",
    "suspensionDate": "2014-09-25",
    "firstCurtailmentDate": "2018-10-13",
    "transferTripDate": "2026-04-01",
    "blackoutDate": "2018-09-06",
    "blackoutMonth": "2018-09",
    "newKitahonYear": 2019,
    "linkYear": 2027,
    "linkCurrentMW": 900,
    "linkPlannedMW": 1200,
    "chargingControlSystems": 27,
    "chargingControlNotice": "2026-04-10",
    "researchCheckDate": "2026-11-05"
  },
  "regional": {
    "tokyo": {
      "studyCap": 11,
      "studyCapDate": "2026-08-01",
      "outputControl": {
        "window": [
          "2026-03",
          "2026-05"
        ],
        "months": [
          {
            "month": "2026-03",
            "days": 5
          },
          {
            "month": "2026-04",
            "days": 6
          },
          {
            "month": "2026-05",
            "days": 9
          }
        ]
      }
    },
    "kyushu": {
      "studyCap": 8,
      "studyCapDate": "2026-08-01",
      "outputControl": {
        "window": [
          "2026-01",
          "2026-03"
        ],
        "months": [
          {
            "month": "2026-01",
            "days": 12
          },
          {
            "month": "2026-02",
            "days": 14
          },
          {
            "month": "2026-03",
            "days": 24
          }
        ]
      }
    },
    "hokkaido": {
      "studyCap": 5,
      "studyCapDate": "2026-08-01",
      "outputControl": {
        "window": [
          "2026-03",
          "2026-05"
        ],
        "months": [
          {
            "month": "2026-03",
            "days": 7
          },
          {
            "month": "2026-04",
            "days": 11
          },
          {
            "month": "2026-05",
            "days": 18
          }
        ]
      }
    }
  },
  "history": {
    "H-JP-01": "2016-04",
    "H-JP-02": "2011-03-11",
    "H-JP-03": [
      "2015-04",
      "2016-04",
      "2020-04"
    ],
    "H-JP-04": [
      2020,
      2023
    ],
    "H-JP-05": "2022-03",
    "H-JP-06": [
      "2027-01-27",
      "2027-02-03"
    ],
    "H-JP-TK-01": "2026-08-01",
    "H-JP-KY-01": [
      "2012-07",
      "2014-09-25",
      "2018-10-13"
    ],
    "H-JP-KY-02": "2026-04-01",
    "H-JP-HK-02": "2026-04-10",
    "H-JP-HK-01": {
      "blackoutDate": "2018-09-06",
      "newLinkDate": "2019-03"
    }
  },
  "gaps": {
    "buildCost": true,
    "funding": false,
    "chargingWindows": true,
    "converter2011": true,
    "awardAreas": true,
    "dailyOutputControl": true,
    "operatingTerm": true,
    "certification": true,
    "regulatedReturn": true,
    "reformRationale": true
  }
};
