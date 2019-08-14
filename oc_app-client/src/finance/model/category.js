export default class Category {

  static CONFIG = {
    "pension-pioneer": {
      name: "Penze - Pioneer Investment",
      isValid(tx) {
        return /^2120710073\/2700$/.test(tx.account) && tx.vc === "2300013088"
      }
    },
    "pension-state": {
      name: "Penze - státní podpora",
      isValid(tx) {
        return /^3033\/2700$/.test(tx.account) && tx.vc === "3001296185"
      }
    },
    "insurance-life-aegon": {
      name: "Životní pojištění Aegon",
      state: "closed",
      isValid(tx) {
        return /^2043980407\/2600$/.test(tx.account) && tx.vc === "3300725783"
      }
    },
    "insurance-accident-allegro": {
      name: "Úrazové pojištění Allegro",
      state: "closed",
      isValid(tx) {
        return /^100001\/2700$/.test(tx.account) && tx.vc === "9644079507"
      }
    },
    "insurance-okdouble-family": {
      name: "Životní pojištění OK Double",
      state: "closed",
      isValid(tx) {
        return /^700135002\/0800$/.test(tx.account) && tx.vc === "7313432852"
      }
    },
    "insurance-generali": {
      name: "Životní pojištění Generali",
      isValid(tx) {
        return /^100001\/2700$/.test(tx.account) && tx.vc === "9200424111"
      }
    },
    "investment-cpp-taxes": {
      name: "Životní pojištění, investice + daně",
      isValid(tx) {
        return /^700135002\/0800$/.test(tx.account) && tx.vc === "7319783282"
      }
    },
    "investment-investika-5": {
      name: "Investice Investika - 5let",
      state: "closed",
      isValid(tx) {
        return /^500002432\/0800$/.test(tx.account) && tx.vc === "1015004414"
      }
    },
    "investment-conseq-10": {
      name: "Investice Conseq - 10let",
      state: "closed",
      isValid(tx) {
        return /^666777-9701349863\/2700$/.test(tx.account) && tx.vc === "9701349863"
      }
    },
    "investment-conseq-31": {
      name: "Investice Conseq - 31let",
      isValid(tx) {
        return /^666777-9605117392\/2700$/.test(tx.account)
      }
    },
    "insurance-okdouble-lenka": {
      name: "Životní pojištění Lenka",
      state: "closed",
      isValid(tx) {
        return /^2108889277\/2700$/.test(tx.account) && tx.vc === "6700052140"
      }
    },
    "insurance-okdouble-ondra": {
      name: "Životní pojištění Ondra",
      state: "closed",
      isValid(tx) {
        return /^2108889277\/2700$/.test(tx.account) && tx.vc === "6700052129"
      }
    },
    "flat-caslav-hypothec": {
      name: "Hypotéka bytu v Čáslavi",
      isValid(tx) {
        return !tx.account && /^PL:.*00002168-998$/.test(tx.details.replace("\n", ""))
      }
    },
    "flat-prague-hypothec": {
      name: "Hypotéka bytu v Praze",
      isValid(tx) {
        return !tx.account && (/^PL:.*00002192-350$/.test(tx.details.replace("\n", "")) || /^SPRÁVA ÚVĚRU/.test(tx.details))
      }
    },
    "flat-prague-fees": {
      name: "Poplatky za byt v Praze",
      isValid(tx) {
        return /^188828116\/0?300$/.test(tx.account) && tx.vc === "401031006"
      }
    },
    "flat-prague-el": {
      name: "Elektrika v bytě v Praze",
      isValid(tx) {
        return /^19-2784000277\/0?100$/.test(tx.account) && tx.vc === "21234618"
      }
    },
    "flat-prague-gas": {
      name: "Plyn v bytě v Praze",
      isValid(tx) {
        return /^19-2784000277\/0?100$/.test(tx.account) && tx.vc === "70006610"
      }
    },
    "flat-prague-net": {
      name: "Internet v bytě v Praze",
      isValid(tx) {
        return (/^3983815\/0?300$/.test(tx.account) && tx.vc === "49887991") || /^UPC/.test(tx.accountName)
      }
    },
    "flat-prague-rent": {
      name: "Pronájem bytu v Praze",
      isValid(tx) {
        return tx.value === 18000 && (/VS:31310/.test(tx.details) || tx.vc === "31310")
      }
    },
    "flat-kh-hypothec": {
      name: "Hypotéka bytu v Kutné Hoře",
      isValid(tx) {
        return !tx.account && /^PL:.*07942384-007$/.test(tx.details.replace("\n", ""))
      }
    },
    "flat-kh-el": {
      name: "Elektrika v domě v KH",
      isValid(tx) {
        return /^7770227\/0?100$/.test(tx.account) && tx.vc === "7385551500"
      }
    },
    "flat-kh-gas": {
      name: "Plyn v domě v KH",
      isValid(tx) {
        return /^7770227\/0?100$/.test(tx.account) && tx.vc === "7385370500"
      }
    },
    "flat-kh-water": {
      name: "Vodné v domě v KH",
      isValid(tx) {
        return /^17701161\/0?100$/.test(tx.account) && tx.vc === "216160620"
      }
    },
    "flat-kh-net": {
      name: "Internet v domě v KH",
      isValid(tx) {
        return (/^2700027000\/2700$/.test(tx.account) && tx.vc === "128282373") ||
          (/^107290482\/0?800$/.test(tx.account) && tx.vc === "128332550")
      }
    },
    "flat-kh-rent": {
      name: "Pronájem bytu v KH (Benešova)",
      isValid(tx) {
        return /^115-402470267\/0?100$/.test(tx.account) && tx.vc === "39103"
      }
    },
    "salary-vigour": {
      name: "Plat ve Vigour",
      isValid(tx) {
        return /^35-2151040287\/0?100$/.test(tx.account)
      }
    },
    "salary-ucl": {
      name: "Plat v UCL",
      isValid(tx) {
        return /^35-2147930287\/0?100$/.test(tx.account)
      }
    },
    "salary-uso": {
      name: "Plat v USO",
      isValid(tx) {
        return /^51-441400237\/0?100$/.test(tx.account)
      }
    },
    "mobile-tariff-mom": {
      name: "Tarif mamka",
      isValid(tx) {
        return /^19-6302630267\/0?100$/.test(tx.account) && tx.value === 150
      }
    },
    "mobile-tariff-dad": {
      name: "Tarif taťka",
      isValid(tx) {
        return /^284032222\/0?300$/.test(tx.account) && tx.value === 149
      }
    },
    "mobile-tariff-petra": {
      name: "Tarif Petra",
      isValid(tx) {
        return /^107-2704330277\/0?100$/.test(tx.account) && (tx.value === 299 || tx.value === 550)
      }
    },
    "mobile-tariff-ales": {
      name: "Tarif Aleš",
      isValid(tx) {
        return /^214354146\/0?600$/.test(tx.account) && (tx.value === 299 || tx.value === 550)
      }
    },
    "mobile-tariff-david": {
      name: "Tarif David",
      isValid(tx) {
        return /^2862765073\/0?800$/.test(tx.account) && (tx.value === 129 || tx.value === 149)
      }
    },
    "mobile-tariff-jana": {
      name: "Tarif Jana",
      isValid(tx) {
        return /^933401113\/0?800$/.test(tx.account) && (tx.value === 129 || tx.value === 149)
      }
    },
    "car-fabia-credit": {
      name: "Úvěr Fabia",
      isValid(tx) {
        return /^3683572\/0?800$/.test(tx.account) && (tx.vc === "1910005754")
      }
    }
  };

  static get(tx) {
    let category = null;
    for (let cat in this.CONFIG) {
      if (this.CONFIG[cat].isValid(tx)) {
        category = cat;
        break;
      }
    }
    return category;
  }
}
