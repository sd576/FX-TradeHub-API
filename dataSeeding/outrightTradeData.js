
import fs from "fs";
import path from "path";

// Initially empty placeholder
let outrightTradeData = [];

// Fields for validation
const outrightTradeDataFields = [
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
const initialoutrightTradeData = [
  {
    "tradeId": "FWD-002-001",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "010",
      "description": "HSBC Bank, London"
    }
  },
  {
    "tradeId": "FWD-003-002",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "010",
      "description": "Lloyds Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-004-003",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-005-004",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Standard Chartered Bank, London"
    }
  },
  {
    "tradeId": "FWD-006-005",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "JPMorgan Chase, New York"
    }
  },
  {
    "tradeId": "FWD-007-006",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-008-007",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-009-008",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-010-009",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "description": "Bank of America, New York"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-011-010",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "010",
      "description": "BNP Paribas, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-012-011",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "026",
      "description": "Société Générale, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-013-012",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "034",
      "description": "Crédit Agricole, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-014-013",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-015-014",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-016-015",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "Deutsche Bank, Frankfurt"
    }
  },
  {
    "tradeId": "FWD-017-016",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-018-017",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-019-018",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "010",
      "description": "DZ Bank, Frankfurt"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-020-019",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-021-020",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "ABN AMRO, Amsterdam"
    }
  },
  {
    "tradeId": "FWD-022-021",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-023-022",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-024-023",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-025-024",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-026-025",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-027-026",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-028-027",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-029-028",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-030-029",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Macquarie Bank, Sydney"
    }
  },
  {
    "tradeId": "FWD-031-030",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-032-031",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-033-032",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-034-033",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-035-034",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "010",
      "description": "ASB Bank, Wellington"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-036-035",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Mizuho Bank, Tokyo"
    }
  },
  {
    "tradeId": "FWD-037-036",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-999-037",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-001-038",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-002-039",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "HSBC Bank, London"
    }
  },
  {
    "tradeId": "FWD-003-040",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Lloyds Bank, London"
    }
  },
  {
    "tradeId": "FWD-004-041",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-005-042",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "010",
      "description": "Standard Chartered Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-006-043",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-007-044",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-008-045",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Goldman Sachs, New York"
    }
  },
  {
    "tradeId": "FWD-009-046",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-010-047",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-011-048",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-012-049",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Société Générale, Paris"
    }
  },
  {
    "tradeId": "FWD-013-050",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Crédit Agricole, Paris"
    }
  },
  {
    "tradeId": "FWD-014-051",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-015-052",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "034",
      "description": "La Banque Postale, Paris"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-016-053",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-017-054",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Commerzbank, Frankfurt"
    }
  },
  {
    "tradeId": "FWD-018-055",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "KfW Bank, Frankfurt"
    }
  },
  {
    "tradeId": "FWD-019-056",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-020-057",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-021-058",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-022-059",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-023-060",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-024-061",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-025-062",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "Van Lanschot Kempen, Amsterdam"
    }
  },
  {
    "tradeId": "FWD-026-063",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "010",
      "description": "Commonwealth Bank of Australia, Sydney"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-027-064",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-028-065",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-029-066",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-030-067",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-031-068",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-032-069",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "ANZ Bank New Zealand, Wellington"
    }
  },
  {
    "tradeId": "FWD-033-070",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "description": "Kiwibank, Wellington"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-034-071",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "037",
      "description": "Westpac New Zealand, Wellington"
    }
  },
  {
    "tradeId": "FWD-035-072",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-036-073",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-037-074",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "010",
      "description": "Royal Bank of Canada, Ontario"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-999-075",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "026",
      "description": "Global Trade Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-001-076",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "034",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-002-077",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "016",
      "description": "HSBC Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-003-078",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-004-079",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "010",
      "description": "NatWest Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-005-080",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-006-081",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-007-082",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-008-083",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-009-084",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-010-085",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-011-086",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-012-087",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-013-088",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "010",
      "description": "Crédit Agricole, Paris"
    }
  },
  {
    "tradeId": "FWD-014-089",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Natixis, Paris"
    }
  },
  {
    "tradeId": "FWD-015-090",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-016-091",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-017-092",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "001",
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "010",
      "description": "Commerzbank, Frankfurt"
    }
  },
  {
    "tradeId": "FWD-018-093",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "description": "KfW Bank, Frankfurt"
    }
  },
  {
    "tradeId": "FWD-019-094",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "description": "Barclays Bank, London"
    },
    "sellNostroAccount": {
      "id": "036",
      "description": "DZ Bank, Frankfurt"
    }
  },
  {
    "tradeId": "FWD-020-095",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-021-096",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we sell",
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
      "id": "010",
      "description": "ABN AMRO, Amsterdam"
    }
  },
  {
    "tradeId": "FWD-022-097",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  },
  {
    "tradeId": "FWD-023-098",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "010",
      "description": "Rabobank, Amsterdam"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-024-099",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
    "weBuyWeSell": "we buy",
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
      "id": "026",
      "description": "Bunq, Amsterdam"
    },
    "sellNostroAccount": {
      "id": "001",
      "description": "Barclays Bank, London"
    }
  },
  {
    "tradeId": "FWD-025-100",
    "tradeDate": "2025-01-01",
    "tradeType": "FWD",
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
    }
  }
];

// Overwrite function
const overwriteData = () => {
  outrightTradeData = initialoutrightTradeData;
  console.log("Data has been overwritten with the default records.");

  // Save as JSON file
  const filePath = path.resolve("./outrightTradeData.json");
  fs.writeFileSync(filePath, JSON.stringify(outrightTradeData, null, 2), "utf-8");
  console.log(`Updated data saved to '${filePath}'.`);
};

// Execute overwrite function
overwriteData();

export { outrightTradeData, outrightTradeDataFields };
