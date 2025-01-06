
import fs from "fs";
import path from "path";

// Initially empty placeholder
let swapTradeData = [];

// Fields for validation
const swapTradeDataFields = [
  "tradeId",
  "tradeDate",
  "tradeType",
  "counterpartyId",
  "settlementDate",
  "buyCurrency",
  "sellCurrency",
  "buyAmount",
  "sellAmount",
  "exchangeRate",
  "buyNostroAccount",
  "sellNostroAccount",
];

// Hardcoded initial data
const initialswapTradeData = [
  {
    "tradeId": "SWAP-002-001",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "HSBC Bank, London",
    "counterpartyId": "002",
    "counterpartyName": "HSBC Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-002-001-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "002",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-003-002",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Lloyds Bank, London",
    "counterpartyId": "003",
    "counterpartyName": "Lloyds Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Lloyds Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-003-002-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "003",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Lloyds Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-004-003",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "NatWest Bank, London",
    "counterpartyId": "004",
    "counterpartyName": "NatWest Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "NatWest Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-004-003-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "004",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "NatWest Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-005-004",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Standard Chartered Bank, London",
    "counterpartyId": "005",
    "counterpartyName": "Standard Chartered Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "034",
      "description": "Standard Chartered Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-005-004-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "005",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "034",
        "description": "Standard Chartered Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-006-005",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "JPMorgan Chase, New York",
    "counterpartyId": "006",
    "counterpartyName": "JPMorgan Chase",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "016",
      "description": "JPMorgan Chase, New York"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-006-005-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "006",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "016",
        "description": "JPMorgan Chase, New York"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-007-006",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Citibank, New York",
    "counterpartyId": "007",
    "counterpartyName": "Citibank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Citibank, New York"
    },
    "farLeg": {
      "tradeId": "SWAP-007-006-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "007",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Citibank, New York"
      }
    }
  },
  {
    "tradeId": "SWAP-008-007",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Goldman Sachs, New York",
    "counterpartyId": "008",
    "counterpartyName": "Goldman Sachs",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "Goldman Sachs, New York"
    },
    "farLeg": {
      "tradeId": "SWAP-008-007-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "008",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "037",
        "description": "Goldman Sachs, New York"
      }
    }
  },
  {
    "tradeId": "SWAP-009-008",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Morgan Stanley, New York",
    "counterpartyId": "009",
    "counterpartyName": "Morgan Stanley",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "016",
      "description": "Morgan Stanley, New York"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-009-008-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "009",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "016",
        "description": "Morgan Stanley, New York"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-010-009",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Bank of America, New York",
    "counterpartyId": "010",
    "counterpartyName": "Bank of America",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-010-009-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "010",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-011-010",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "BNP Paribas, Paris",
    "counterpartyId": "011",
    "counterpartyName": "BNP Paribas",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "BNP Paribas, Paris"
    },
    "farLeg": {
      "tradeId": "SWAP-011-010-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "011",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "BNP Paribas, Paris"
      }
    }
  },
  {
    "tradeId": "SWAP-012-011",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Société Générale, Paris",
    "counterpartyId": "012",
    "counterpartyName": "Société Générale",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Société Générale, Paris"
    },
    "farLeg": {
      "tradeId": "SWAP-012-011-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "012",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Société Générale, Paris"
      }
    }
  },
  {
    "tradeId": "SWAP-013-012",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Crédit Agricole, Paris",
    "counterpartyId": "013",
    "counterpartyName": "Crédit Agricole",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Crédit Agricole, Paris"
    },
    "farLeg": {
      "tradeId": "SWAP-013-012-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "013",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Crédit Agricole, Paris"
      }
    }
  },
  {
    "tradeId": "SWAP-014-013",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Natixis, Paris",
    "counterpartyId": "014",
    "counterpartyName": "Natixis",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Natixis, Paris"
    },
    "farLeg": {
      "tradeId": "SWAP-014-013-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "014",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Natixis, Paris"
      }
    }
  },
  {
    "tradeId": "SWAP-015-014",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "La Banque Postale, Paris",
    "counterpartyId": "015",
    "counterpartyName": "La Banque Postale",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "La Banque Postale, Paris"
    },
    "farLeg": {
      "tradeId": "SWAP-015-014-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "015",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "La Banque Postale, Paris"
      }
    }
  },
  {
    "tradeId": "SWAP-016-015",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Deutsche Bank, Frankfurt",
    "counterpartyId": "016",
    "counterpartyName": "Deutsche Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "010",
      "description": "Deutsche Bank, Frankfurt"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-016-015-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "016",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "010",
        "description": "Deutsche Bank, Frankfurt"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-017-016",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Commerzbank, Frankfurt",
    "counterpartyId": "017",
    "counterpartyName": "Commerzbank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-017-016-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "017",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-018-017",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "KfW Bank, Frankfurt",
    "counterpartyId": "018",
    "counterpartyName": "KfW Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "KfW Bank, Frankfurt"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-018-017-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "018",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "KfW Bank, Frankfurt"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-019-018",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "DZ Bank, Frankfurt",
    "counterpartyId": "019",
    "counterpartyName": "DZ Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "DZ Bank, Frankfurt"
    },
    "farLeg": {
      "tradeId": "SWAP-019-018-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "019",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "DZ Bank, Frankfurt"
      }
    }
  },
  {
    "tradeId": "SWAP-020-019",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Helaba (Landesbank Hessen-Thüringen), Frankfurt",
    "counterpartyId": "020",
    "counterpartyName": "Helaba (Landesbank Hessen-Thüringen)",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Helaba (Landesbank Hessen-Thüringen), Frankfurt"
    },
    "farLeg": {
      "tradeId": "SWAP-020-019-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "020",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Helaba (Landesbank Hessen-Thüringen), Frankfurt"
      }
    }
  },
  {
    "tradeId": "SWAP-021-020",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "ABN AMRO, Amsterdam",
    "counterpartyId": "021",
    "counterpartyName": "ABN AMRO",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "034",
      "description": "ABN AMRO, Amsterdam"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-021-020-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "021",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "034",
        "description": "ABN AMRO, Amsterdam"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-022-021",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "ING Bank, Amsterdam",
    "counterpartyId": "022",
    "counterpartyName": "ING Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "ING Bank, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-022-021-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "022",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "ING Bank, Amsterdam"
      }
    }
  },
  {
    "tradeId": "SWAP-023-022",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Rabobank, Amsterdam",
    "counterpartyId": "023",
    "counterpartyName": "Rabobank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Rabobank, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-023-022-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "023",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Rabobank, Amsterdam"
      }
    }
  },
  {
    "tradeId": "SWAP-024-023",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Bunq, Amsterdam",
    "counterpartyId": "024",
    "counterpartyName": "Bunq",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "Bunq, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-024-023-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "024",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "037",
        "description": "Bunq, Amsterdam"
      }
    }
  },
  {
    "tradeId": "SWAP-025-024",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Van Lanschot Kempen, Amsterdam",
    "counterpartyId": "025",
    "counterpartyName": "Van Lanschot Kempen",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Van Lanschot Kempen, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-025-024-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "025",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Van Lanschot Kempen, Amsterdam"
      }
    }
  },
  {
    "tradeId": "SWAP-026-025",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Commonwealth Bank of Australia, Sydney",
    "counterpartyId": "026",
    "counterpartyName": "Commonwealth Bank of Australia",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Commonwealth Bank of Australia, Sydney"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-026-025-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "026",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Commonwealth Bank of Australia, Sydney"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-027-026",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Westpac Banking Corporation, Sydney",
    "counterpartyId": "027",
    "counterpartyName": "Westpac Banking Corporation",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Westpac Banking Corporation, Sydney"
    },
    "farLeg": {
      "tradeId": "SWAP-027-026-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "027",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Westpac Banking Corporation, Sydney"
      }
    }
  },
  {
    "tradeId": "SWAP-028-027",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "National Australia Bank (NAB), Sydney",
    "counterpartyId": "028",
    "counterpartyName": "National Australia Bank (NAB)",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "National Australia Bank (NAB), Sydney"
    },
    "farLeg": {
      "tradeId": "SWAP-028-027-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "028",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "National Australia Bank (NAB), Sydney"
      }
    }
  },
  {
    "tradeId": "SWAP-029-028",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "ANZ Banking Group, Sydney",
    "counterpartyId": "029",
    "counterpartyName": "ANZ Banking Group",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "ANZ Banking Group, Sydney"
    },
    "farLeg": {
      "tradeId": "SWAP-029-028-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "029",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "ANZ Banking Group, Sydney"
      }
    }
  },
  {
    "tradeId": "SWAP-030-029",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Macquarie Bank, Sydney",
    "counterpartyId": "030",
    "counterpartyName": "Macquarie Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "Deutsche Bank, Frankfurt",
      "description": "Macquarie Bank, Sydney"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-030-029-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "030",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "Deutsche Bank, Frankfurt",
        "description": "Macquarie Bank, Sydney"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-031-030",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Bank of New Zealand (BNZ), Wellington",
    "counterpartyId": "031",
    "counterpartyName": "Bank of New Zealand (BNZ)",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Bank of New Zealand (BNZ), Wellington"
    },
    "farLeg": {
      "tradeId": "SWAP-031-030-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "031",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Bank of New Zealand (BNZ), Wellington"
      }
    }
  },
  {
    "tradeId": "SWAP-032-031",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "ANZ Bank New Zealand, Wellington",
    "counterpartyId": "032",
    "counterpartyName": "ANZ Bank New Zealand",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "010",
      "description": "ANZ Bank New Zealand, Wellington"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-032-031-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "032",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "010",
        "description": "ANZ Bank New Zealand, Wellington"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-033-032",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Kiwibank, Wellington",
    "counterpartyId": "033",
    "counterpartyName": "Kiwibank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Kiwibank, Wellington"
    },
    "farLeg": {
      "tradeId": "SWAP-033-032-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "033",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Kiwibank, Wellington"
      }
    }
  },
  {
    "tradeId": "SWAP-034-033",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Westpac New Zealand, Wellington",
    "counterpartyId": "034",
    "counterpartyName": "Westpac New Zealand",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Westpac New Zealand, Wellington"
    },
    "farLeg": {
      "tradeId": "SWAP-034-033-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "034",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Westpac New Zealand, Wellington"
      }
    }
  },
  {
    "tradeId": "SWAP-035-034",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "ASB Bank, Wellington",
    "counterpartyId": "035",
    "counterpartyName": "ASB Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "ASB Bank, Wellington"
    },
    "farLeg": {
      "tradeId": "SWAP-035-034-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "035",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "ASB Bank, Wellington"
      }
    }
  },
  {
    "tradeId": "SWAP-036-035",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Mizuho Bank, Tokyo",
    "counterpartyId": "036",
    "counterpartyName": "Mizuho Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "026",
      "description": "Mizuho Bank, Tokyo"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-036-035-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "036",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "026",
        "description": "Mizuho Bank, Tokyo"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-037-036",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Royal Bank of Canada, Ontario",
    "counterpartyId": "037",
    "counterpartyName": "Royal Bank of Canada",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Royal Bank of Canada, Ontario"
    },
    "farLeg": {
      "tradeId": "SWAP-037-036-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "037",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Royal Bank of Canada, Ontario"
      }
    }
  },
  {
    "tradeId": "SWAP-999-037",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Global Trade Bank, London",
    "counterpartyId": "999",
    "counterpartyName": "Global Trade Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "016",
      "description": "Global Trade Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-999-037-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "999",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "016",
        "description": "Global Trade Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-001-038",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Barclays Bank, London",
    "counterpartyId": "001",
    "counterpartyName": "Barclays Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-001-038-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "001",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-002-039",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "HSBC Bank, London",
    "counterpartyId": "002",
    "counterpartyName": "HSBC Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "010",
      "description": "HSBC Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-002-039-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "002",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "010",
        "description": "HSBC Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-003-040",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Lloyds Bank, London",
    "counterpartyId": "003",
    "counterpartyName": "Lloyds Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "016",
      "description": "Lloyds Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-003-040-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "003",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "016",
        "description": "Lloyds Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-004-041",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "NatWest Bank, London",
    "counterpartyId": "004",
    "counterpartyName": "NatWest Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-004-041-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "004",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-005-042",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Standard Chartered Bank, London",
    "counterpartyId": "005",
    "counterpartyName": "Standard Chartered Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Standard Chartered Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-005-042-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "005",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Standard Chartered Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-006-043",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "JPMorgan Chase, New York",
    "counterpartyId": "006",
    "counterpartyName": "JPMorgan Chase",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "026",
      "description": "JPMorgan Chase, New York"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-006-043-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "006",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "026",
        "description": "JPMorgan Chase, New York"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-007-044",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Citibank, New York",
    "counterpartyId": "007",
    "counterpartyName": "Citibank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "034",
      "description": "Citibank, New York"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-007-044-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "007",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "034",
        "description": "Citibank, New York"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-008-045",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Goldman Sachs, New York",
    "counterpartyId": "008",
    "counterpartyName": "Goldman Sachs",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "016",
      "description": "Goldman Sachs, New York"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-008-045-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "008",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "016",
        "description": "Goldman Sachs, New York"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-009-046",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Morgan Stanley, New York",
    "counterpartyId": "009",
    "counterpartyName": "Morgan Stanley",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Morgan Stanley, New York"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-009-046-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "009",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Morgan Stanley, New York"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-010-047",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Bank of America, New York",
    "counterpartyId": "010",
    "counterpartyName": "Bank of America",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "Bank of America, New York"
    },
    "farLeg": {
      "tradeId": "SWAP-010-047-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "010",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "037",
        "description": "Bank of America, New York"
      }
    }
  },
  {
    "tradeId": "SWAP-011-048",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "BNP Paribas, Paris",
    "counterpartyId": "011",
    "counterpartyName": "BNP Paribas",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-011-048-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "011",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-012-049",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Société Générale, Paris",
    "counterpartyId": "012",
    "counterpartyName": "Société Générale",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Société Générale, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-012-049-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "012",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Société Générale, Paris"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-013-050",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Crédit Agricole, Paris",
    "counterpartyId": "013",
    "counterpartyName": "Crédit Agricole",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "010",
      "description": "Crédit Agricole, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-013-050-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "013",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "010",
        "description": "Crédit Agricole, Paris"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-014-051",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Natixis, Paris",
    "counterpartyId": "014",
    "counterpartyName": "Natixis",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "026",
      "description": "Natixis, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-014-051-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "014",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "026",
        "description": "Natixis, Paris"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-015-052",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "La Banque Postale, Paris",
    "counterpartyId": "015",
    "counterpartyName": "La Banque Postale",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "La Banque Postale, Paris"
    },
    "farLeg": {
      "tradeId": "SWAP-015-052-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "015",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "La Banque Postale, Paris"
      }
    }
  },
  {
    "tradeId": "SWAP-016-053",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Deutsche Bank, Frankfurt",
    "counterpartyId": "016",
    "counterpartyName": "Deutsche Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Deutsche Bank, Frankfurt"
    },
    "farLeg": {
      "tradeId": "SWAP-016-053-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "016",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Deutsche Bank, Frankfurt"
      }
    }
  },
  {
    "tradeId": "SWAP-017-054",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Commerzbank, Frankfurt",
    "counterpartyId": "017",
    "counterpartyName": "Commerzbank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Commerzbank, Frankfurt"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-017-054-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "017",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Commerzbank, Frankfurt"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-018-055",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "KfW Bank, Frankfurt",
    "counterpartyId": "018",
    "counterpartyName": "KfW Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "010",
      "description": "KfW Bank, Frankfurt"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-018-055-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "018",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "010",
        "description": "KfW Bank, Frankfurt"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-019-056",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "DZ Bank, Frankfurt",
    "counterpartyId": "019",
    "counterpartyName": "DZ Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "DZ Bank, Frankfurt"
    },
    "farLeg": {
      "tradeId": "SWAP-019-056-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "019",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "DZ Bank, Frankfurt"
      }
    }
  },
  {
    "tradeId": "SWAP-020-057",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Helaba (Landesbank Hessen-Thüringen), Frankfurt",
    "counterpartyId": "020",
    "counterpartyName": "Helaba (Landesbank Hessen-Thüringen)",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Helaba (Landesbank Hessen-Thüringen), Frankfurt"
    },
    "farLeg": {
      "tradeId": "SWAP-020-057-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "020",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Helaba (Landesbank Hessen-Thüringen), Frankfurt"
      }
    }
  },
  {
    "tradeId": "SWAP-021-058",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "ABN AMRO, Amsterdam",
    "counterpartyId": "021",
    "counterpartyName": "ABN AMRO",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "ABN AMRO, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-021-058-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "021",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "ABN AMRO, Amsterdam"
      }
    }
  },
  {
    "tradeId": "SWAP-022-059",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "ING Bank, Amsterdam",
    "counterpartyId": "022",
    "counterpartyName": "ING Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "ING Bank, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-022-059-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "022",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "ING Bank, Amsterdam"
      }
    }
  },
  {
    "tradeId": "SWAP-023-060",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Rabobank, Amsterdam",
    "counterpartyId": "023",
    "counterpartyName": "Rabobank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "034",
      "description": "Rabobank, Amsterdam"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-023-060-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "023",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "034",
        "description": "Rabobank, Amsterdam"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-024-061",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Bunq, Amsterdam",
    "counterpartyId": "024",
    "counterpartyName": "Bunq",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Bunq, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-024-061-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "024",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Bunq, Amsterdam"
      }
    }
  },
  {
    "tradeId": "SWAP-025-062",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Van Lanschot Kempen, Amsterdam",
    "counterpartyId": "025",
    "counterpartyName": "Van Lanschot Kempen",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Van Lanschot Kempen, Amsterdam"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-025-062-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "025",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Van Lanschot Kempen, Amsterdam"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-026-063",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Commonwealth Bank of Australia, Sydney",
    "counterpartyId": "026",
    "counterpartyName": "Commonwealth Bank of Australia",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "Commonwealth Bank of Australia, Sydney"
    },
    "farLeg": {
      "tradeId": "SWAP-026-063-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "026",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "037",
        "description": "Commonwealth Bank of Australia, Sydney"
      }
    }
  },
  {
    "tradeId": "SWAP-027-064",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Westpac Banking Corporation, Sydney",
    "counterpartyId": "027",
    "counterpartyName": "Westpac Banking Corporation",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Westpac Banking Corporation, Sydney"
    },
    "farLeg": {
      "tradeId": "SWAP-027-064-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "027",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Westpac Banking Corporation, Sydney"
      }
    }
  },
  {
    "tradeId": "SWAP-028-065",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "National Australia Bank (NAB), Sydney",
    "counterpartyId": "028",
    "counterpartyName": "National Australia Bank (NAB)",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "National Australia Bank (NAB), Sydney"
    },
    "farLeg": {
      "tradeId": "SWAP-028-065-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "028",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "National Australia Bank (NAB), Sydney"
      }
    }
  },
  {
    "tradeId": "SWAP-029-066",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "ANZ Banking Group, Sydney",
    "counterpartyId": "029",
    "counterpartyName": "ANZ Banking Group",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "ANZ Banking Group, Sydney"
    },
    "farLeg": {
      "tradeId": "SWAP-029-066-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "029",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "ANZ Banking Group, Sydney"
      }
    }
  },
  {
    "tradeId": "SWAP-030-067",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Macquarie Bank, Sydney",
    "counterpartyId": "030",
    "counterpartyName": "Macquarie Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Macquarie Bank, Sydney"
    },
    "farLeg": {
      "tradeId": "SWAP-030-067-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "030",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Macquarie Bank, Sydney"
      }
    }
  },
  {
    "tradeId": "SWAP-031-068",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Bank of New Zealand (BNZ), Wellington",
    "counterpartyId": "031",
    "counterpartyName": "Bank of New Zealand (BNZ)",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-031-068-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "031",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-032-069",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "ANZ Bank New Zealand, Wellington",
    "counterpartyId": "032",
    "counterpartyName": "ANZ Bank New Zealand",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "Deutsche Bank, Frankfurt",
      "description": "ANZ Bank New Zealand, Wellington"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-032-069-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "032",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "Deutsche Bank, Frankfurt",
        "description": "ANZ Bank New Zealand, Wellington"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-033-070",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Kiwibank, Wellington",
    "counterpartyId": "033",
    "counterpartyName": "Kiwibank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Kiwibank, Wellington"
    },
    "farLeg": {
      "tradeId": "SWAP-033-070-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "033",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Kiwibank, Wellington"
      }
    }
  },
  {
    "tradeId": "SWAP-034-071",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Westpac New Zealand, Wellington",
    "counterpartyId": "034",
    "counterpartyName": "Westpac New Zealand",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "010",
      "description": "Westpac New Zealand, Wellington"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-034-071-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "034",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "010",
        "description": "Westpac New Zealand, Wellington"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-035-072",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "ASB Bank, Wellington",
    "counterpartyId": "035",
    "counterpartyName": "ASB Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "Deutsche Bank, Frankfurt",
      "description": "ASB Bank, Wellington"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-035-072-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "035",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "Deutsche Bank, Frankfurt",
        "description": "ASB Bank, Wellington"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-036-073",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Mizuho Bank, Tokyo",
    "counterpartyId": "036",
    "counterpartyName": "Mizuho Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Mizuho Bank, Tokyo"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-036-073-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "036",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Mizuho Bank, Tokyo"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-037-074",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Royal Bank of Canada, Ontario",
    "counterpartyId": "037",
    "counterpartyName": "Royal Bank of Canada",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Royal Bank of Canada, Ontario"
    },
    "farLeg": {
      "tradeId": "SWAP-037-074-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "037",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Royal Bank of Canada, Ontario"
      }
    }
  },
  {
    "tradeId": "SWAP-999-075",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Global Trade Bank, London",
    "counterpartyId": "999",
    "counterpartyName": "Global Trade Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Global Trade Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-999-075-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "999",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Global Trade Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-001-076",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Barclays Bank, London",
    "counterpartyId": "001",
    "counterpartyName": "Barclays Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-001-076-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "001",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-002-077",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "HSBC Bank, London",
    "counterpartyId": "002",
    "counterpartyName": "HSBC Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-002-077-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "002",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-003-078",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Lloyds Bank, London",
    "counterpartyId": "003",
    "counterpartyName": "Lloyds Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Lloyds Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-003-078-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "003",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Lloyds Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-004-079",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "NatWest Bank, London",
    "counterpartyId": "004",
    "counterpartyName": "NatWest Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "NatWest Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-004-079-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "004",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "037",
        "description": "NatWest Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-005-080",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Standard Chartered Bank, London",
    "counterpartyId": "005",
    "counterpartyName": "Standard Chartered Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "016",
      "description": "Standard Chartered Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-005-080-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "005",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "016",
        "description": "Standard Chartered Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-006-081",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "JPMorgan Chase, New York",
    "counterpartyId": "006",
    "counterpartyName": "JPMorgan Chase",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-006-081-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "006",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-007-082",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Citibank, New York",
    "counterpartyId": "007",
    "counterpartyName": "Citibank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Citibank, New York"
    },
    "farLeg": {
      "tradeId": "SWAP-007-082-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "007",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Citibank, New York"
      }
    }
  },
  {
    "tradeId": "SWAP-008-083",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Goldman Sachs, New York",
    "counterpartyId": "008",
    "counterpartyName": "Goldman Sachs",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "026",
      "description": "Goldman Sachs, New York"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-008-083-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "008",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "026",
        "description": "Goldman Sachs, New York"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-009-084",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Morgan Stanley, New York",
    "counterpartyId": "009",
    "counterpartyName": "Morgan Stanley",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "034",
      "description": "Morgan Stanley, New York"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-009-084-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "009",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "034",
        "description": "Morgan Stanley, New York"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-010-085",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Bank of America, New York",
    "counterpartyId": "010",
    "counterpartyName": "Bank of America",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Bank of America, New York"
    },
    "farLeg": {
      "tradeId": "SWAP-010-085-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "010",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Bank of America, New York"
      }
    }
  },
  {
    "tradeId": "SWAP-011-086",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "BNP Paribas, Paris",
    "counterpartyId": "011",
    "counterpartyName": "BNP Paribas",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "BNP Paribas, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-011-086-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "011",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "BNP Paribas, Paris"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-012-087",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Société Générale, Paris",
    "counterpartyId": "012",
    "counterpartyName": "Société Générale",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "010",
      "description": "Société Générale, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-012-087-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "012",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "010",
        "description": "Société Générale, Paris"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-013-088",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Crédit Agricole, Paris",
    "counterpartyId": "013",
    "counterpartyName": "Crédit Agricole",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-013-088-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "013",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-014-089",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Natixis, Paris",
    "counterpartyId": "014",
    "counterpartyName": "Natixis",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "Natixis, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-014-089-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "014",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "Natixis, Paris"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-015-090",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "La Banque Postale, Paris",
    "counterpartyId": "015",
    "counterpartyName": "La Banque Postale",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "La Banque Postale, Paris"
    },
    "farLeg": {
      "tradeId": "SWAP-015-090-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "015",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "La Banque Postale, Paris"
      }
    }
  },
  {
    "tradeId": "SWAP-016-091",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Deutsche Bank, Frankfurt",
    "counterpartyId": "016",
    "counterpartyName": "Deutsche Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Deutsche Bank, Frankfurt"
    },
    "farLeg": {
      "tradeId": "SWAP-016-091-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "016",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Deutsche Bank, Frankfurt"
      }
    }
  },
  {
    "tradeId": "SWAP-017-092",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "Commerzbank, Frankfurt",
    "counterpartyId": "017",
    "counterpartyName": "Commerzbank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "034",
      "description": "Commerzbank, Frankfurt"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-017-092-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "017",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "034",
        "description": "Commerzbank, Frankfurt"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-018-093",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "KfW Bank, Frankfurt",
    "counterpartyId": "018",
    "counterpartyName": "KfW Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "GBP",
    "buyAmount": 1000000,
    "sellAmount": 865400,
    "exchangeRate": "0.8654",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-018-093-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "018",
      "settlementDate": "2025-03-01",
      "buyCurrency": "GBP",
      "sellCurrency": "EUR",
      "buyAmount": 865600,
      "sellAmount": 1000000,
      "exchangeRate": "0.8656",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-019-094",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "DZ Bank, Frankfurt",
    "counterpartyId": "019",
    "counterpartyName": "DZ Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 185125000,
    "exchangeRate": "185.1250",
    "buyNostroAccount": {
      "id": "001",
      "description": "DZ Bank, Frankfurt"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-019-094-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "019",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "GBP",
      "buyAmount": 185130000,
      "sellAmount": 1000000,
      "exchangeRate": "185.1300",
      "buyNostroAccount": {
        "id": "001",
        "description": "DZ Bank, Frankfurt"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-020-095",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Helaba (Landesbank Hessen-Thüringen), Frankfurt",
    "counterpartyId": "020",
    "counterpartyName": "Helaba (Landesbank Hessen-Thüringen)",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "CAD",
    "buyAmount": 1000000,
    "sellAmount": 1347800,
    "exchangeRate": "1.3478",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "Helaba (Landesbank Hessen-Thüringen), Frankfurt"
    },
    "farLeg": {
      "tradeId": "SWAP-020-095-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "020",
      "settlementDate": "2025-03-01",
      "buyCurrency": "CAD",
      "sellCurrency": "USD",
      "buyAmount": 1348100,
      "sellAmount": 1000000,
      "exchangeRate": "1.3481",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "037",
        "description": "Helaba (Landesbank Hessen-Thüringen), Frankfurt"
      }
    }
  },
  {
    "tradeId": "SWAP-021-096",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "ABN AMRO, Amsterdam",
    "counterpartyId": "021",
    "counterpartyName": "ABN AMRO",
    "settlementDate": "2025-01-31",
    "buyCurrency": "EUR",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1093400,
    "exchangeRate": "1.0934",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-021-096-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "021",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "EUR",
      "buyAmount": 1093600,
      "sellAmount": 1000000,
      "exchangeRate": "1.0936",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-022-097",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we buy",
    "counterpartyDescription": "ING Bank, Amsterdam",
    "counterpartyId": "022",
    "counterpartyName": "ING Bank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "GBP",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 1262000,
    "exchangeRate": "1.2620",
    "buyNostroAccount": {
      "id": "001",
      "description": "ING Bank, Amsterdam"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "farLeg": {
      "tradeId": "SWAP-022-097-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "022",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "GBP",
      "buyAmount": 1262300,
      "sellAmount": 1000000,
      "exchangeRate": "1.2623",
      "buyNostroAccount": {
        "id": "001",
        "description": "ING Bank, Amsterdam"
      },
      "sellNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      }
    }
  },
  {
    "tradeId": "SWAP-023-098",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Rabobank, Amsterdam",
    "counterpartyId": "023",
    "counterpartyName": "Rabobank",
    "settlementDate": "2025-01-31",
    "buyCurrency": "USD",
    "sellCurrency": "JPY",
    "buyAmount": 1000000,
    "sellAmount": 147220000,
    "exchangeRate": "147.2200",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Rabobank, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-023-098-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "023",
      "settlementDate": "2025-03-01",
      "buyCurrency": "JPY",
      "sellCurrency": "USD",
      "buyAmount": 147225000,
      "sellAmount": 1000000,
      "exchangeRate": "147.2250",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "036",
        "description": "Rabobank, Amsterdam"
      }
    }
  },
  {
    "tradeId": "SWAP-024-099",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Bunq, Amsterdam",
    "counterpartyId": "024",
    "counterpartyName": "Bunq",
    "settlementDate": "2025-01-31",
    "buyCurrency": "AUD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 639000,
    "exchangeRate": "0.6390",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Bunq, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-024-099-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "024",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "AUD",
      "buyAmount": 639300,
      "sellAmount": 1000000,
      "exchangeRate": "0.6393",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Bunq, Amsterdam"
      }
    }
  },
  {
    "tradeId": "SWAP-025-100",
    "tradeDate": "2025-01-01",
    "tradeType": "SWAP",
    "weBuyWeSell": "we sell",
    "counterpartyDescription": "Van Lanschot Kempen, Amsterdam",
    "counterpartyId": "025",
    "counterpartyName": "Van Lanschot Kempen",
    "settlementDate": "2025-01-31",
    "buyCurrency": "NZD",
    "sellCurrency": "USD",
    "buyAmount": 1000000,
    "sellAmount": 593500,
    "exchangeRate": "0.5935",
    "buyNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Van Lanschot Kempen, Amsterdam"
    },
    "farLeg": {
      "tradeId": "SWAP-025-100-FAR",
      "tradeDate": "2025-01-01",
      "tradeType": "SWAP",
      "counterpartyId": "025",
      "settlementDate": "2025-03-01",
      "buyCurrency": "USD",
      "sellCurrency": "NZD",
      "buyAmount": 593800,
      "sellAmount": 1000000,
      "exchangeRate": "0.5938",
      "buyNostroAccount": {
        "id": "001",
        "description": "Barclays Bank, London"
      },
      "sellNostroAccount": {
        "id": "010",
        "description": "Van Lanschot Kempen, Amsterdam"
      }
    }
  }
];

// Overwrite function
const overwriteData = () => {
  swapTradeData = initialswapTradeData;
  console.log("Data has been overwritten with the default records.");

  // Save as JSON file
  const filePath = path.resolve("./swapTradeData.json");
  fs.writeFileSync(filePath, JSON.stringify(swapTradeData, null, 2), "utf-8");
  console.log(`Updated data saved to '${filePath}'.`);
};

// Execute overwrite function
overwriteData();

export { swapTradeData, swapTradeDataFields };
