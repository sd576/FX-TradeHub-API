let counterpartyData = [];
let nostroData = [];

// Static params array
const counterpartyFields = [
  "id",
  "name",
  "city",
  "country",
  "currency",
  "accountNumber",
  "swiftCode",
  "contactPerson",
  "email",
  "phone",
  "nostroAccounts",
];

// Validation function for counterparty data
const validateCounterparty = (counterparty) => {
  const requiredFields = [
    "id",
    "name",
    "city",
    "country",
    "currency",
    "accountNumber",
    "swiftCode",
    "contactPerson",
    "email",
    "phone",
    "nostroAccounts",
  ];
  requiredFields.forEach((field) => {
    if (!counterparty[field]) {
      throw new Error(
        `Missing required field: ${field} in counterparty ${JSON.stringify(
          counterparty
        )}`
      );
    }
  });
};

// New data to overwrite the existing counterpartyData
const initialCounterpartyData = [
  // London Banks
  {
    id: "001",
    name: "Barclays Bank",
    city: "London",
    country: "United Kingdom",
    currency: "GBP",
    accountNumber: "12345678",
    swiftCode: "BARCGB22",
    contactPerson: "John Smith",
    email: "john.smith@barclays.co.uk",
    phone: "+44 20 7116 1000",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "002",
    name: "HSBC Bank",
    city: "London",
    country: "United Kingdom",
    currency: "GBP",
    accountNumber: "22334455",
    swiftCode: "HBUKGB4B",
    contactPerson: "Jane Doe",
    email: "jane.doe@hsbc.co.uk",
    phone: "+44 20 7991 8888",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "003",
    name: "Lloyds Bank",
    city: "London",
    country: "United Kingdom",
    currency: "GBP",
    accountNumber: "33334444",
    swiftCode: "LOYDGB2L",
    contactPerson: "Richard Miles",
    email: "richard.miles@lloydsbank.co.uk",
    phone: "+44 20 7626 1500",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "004",
    name: "NatWest Bank",
    city: "London",
    country: "United Kingdom",
    currency: "GBP",
    accountNumber: "11223344",
    swiftCode: "NWBKGB2L",
    contactPerson: "Emily White",
    email: "emily.white@natwest.com",
    phone: "+44 20 7930 4000",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "005",
    name: "Standard Chartered Bank",
    city: "London",
    country: "United Kingdom",
    currency: "GBP",
    accountNumber: "77889900",
    swiftCode: "SCBLGB2L",
    contactPerson: "Michael Brown",
    email: "michael.brown@sc.com",
    phone: "+44 20 7885 8888",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  // New York Banks
  {
    id: "006",
    name: "JPMorgan Chase",
    city: "New York",
    country: "United States",
    currency: "USD",
    accountNumber: "123456789",
    swiftCode: "CHASUS33",
    contactPerson: "Amanda Lee",
    email: "amanda.lee@jpmorgan.com",
    phone: "+1 212 270 6000",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "007",
    name: "Citibank",
    city: "New York",
    country: "United States",
    currency: "USD",
    accountNumber: "987654321",
    swiftCode: "CITIUS33",
    contactPerson: "James Harris",
    email: "james.harris@citi.com",
    phone: "+1 212 559 1000",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "008",
    name: "Goldman Sachs",
    city: "New York",
    country: "United States",
    currency: "USD",
    accountNumber: "56781234",
    swiftCode: "GSCMUS33",
    contactPerson: "Sophia Turner",
    email: "sophia.turner@goldmansachs.com",
    phone: "+1 212 902 1000",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "009",
    name: "Morgan Stanley",
    city: "New York",
    country: "United States",
    currency: "USD",
    accountNumber: "87654321",
    swiftCode: "MSNYUS33",
    contactPerson: "Brian Carter",
    email: "brian.carter@morganstanley.com",
    phone: "+1 212 761 4000",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "010",
    name: "Bank of America",
    city: "New York",
    country: "United States",
    currency: "USD",
    accountNumber: "43211234",
    swiftCode: "BOFAUS3N",
    contactPerson: "Liam Bennett",
    email: "liam.bennett@bankofamerica.com",
    phone: "+1 704 386 5681",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  // Paris Banks
  {
    id: "011",
    name: "BNP Paribas",
    city: "Paris",
    country: "France",
    currency: "EUR",
    accountNumber: "98761234",
    swiftCode: "BNPAFRPP",
    contactPerson: "Alice Martin",
    email: "alice.martin@bnpparibas.com",
    phone: "+33 1 42 98 12 34",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "012",
    name: "Société Générale",
    city: "Paris",
    country: "France",
    currency: "EUR",
    accountNumber: "12348765",
    swiftCode: "SOGEFRPP",
    contactPerson: "Charlotte Dupont",
    email: "charlotte.dupont@socgen.com",
    phone: "+33 1 42 14 20 00",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "013",
    name: "Crédit Agricole",
    city: "Paris",
    country: "France",
    currency: "EUR",
    accountNumber: "11224433",
    swiftCode: "AGRIFRPP",
    contactPerson: "Julien Laurent",
    email: "julien.laurent@creditagricole.fr",
    phone: "+33 1 43 23 56 78",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "014",
    name: "Natixis",
    city: "Paris",
    country: "France",
    currency: "EUR",
    accountNumber: "33445566",
    swiftCode: "NATXFRPP",
    contactPerson: "Amelie Rousseau",
    email: "amelie.rousseau@natixis.com",
    phone: "+33 1 42 14 67 89",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "015",
    name: "La Banque Postale",
    city: "Paris",
    country: "France",
    currency: "EUR",
    accountNumber: "55667788",
    swiftCode: "PSSTFRPP",
    contactPerson: "Louis Martin",
    email: "louis.martin@labanquepostale.fr",
    phone: "+33 1 44 45 56 67",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  // Frankfurt Banks
  {
    id: "016",
    name: "Deutsche Bank",
    city: "Frankfurt",
    country: "Germany",
    currency: "EUR",
    accountNumber: "99887766",
    swiftCode: "DEUTDEFF",
    contactPerson: "Hans Müller",
    email: "hans.mueller@db.com",
    phone: "+49 69 910 1000",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "017",
    name: "Commerzbank",
    city: "Frankfurt",
    country: "Germany",
    currency: "EUR",
    accountNumber: "88997766",
    swiftCode: "COBADEFF",
    contactPerson: "Katrin Fischer",
    email: "katrin.fischer@commerzbank.com",
    phone: "+49 69 136 2000",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "018",
    name: "KfW Bank",
    city: "Frankfurt",
    country: "Germany",
    currency: "EUR",
    accountNumber: "11223344",
    swiftCode: "KFWIDEFF",
    contactPerson: "Stefan Weber",
    email: "stefan.weber@kfw.de",
    phone: "+49 69 7431 0",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "019",
    name: "DZ Bank",
    city: "Frankfurt",
    country: "Germany",
    currency: "EUR",
    accountNumber: "22334455",
    swiftCode: "GENODEFF",
    contactPerson: "Laura Klein",
    email: "laura.klein@dzbank.de",
    phone: "+49 69 7447 01",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "020",
    name: "Helaba (Landesbank Hessen-Thüringen)",
    city: "Frankfurt",
    country: "Germany",
    currency: "EUR",
    accountNumber: "33445566",
    swiftCode: "WELADEFF",
    contactPerson: "Maximilian Bauer",
    email: "max.bauer@helaba.de",
    phone: "+49 69 9132 01",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  // Amsterdam Banks
  {
    id: "021",
    name: "ABN AMRO",
    city: "Amsterdam",
    country: "Netherlands",
    currency: "EUR",
    accountNumber: "11224455",
    swiftCode: "ABNANL2A",
    contactPerson: "Sanne de Vries",
    email: "sanne.vries@abnamro.nl",
    phone: "+31 20 628 9393",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "022",
    name: "ING Bank",
    city: "Amsterdam",
    country: "Netherlands",
    currency: "EUR",
    accountNumber: "55667788",
    swiftCode: "INGBNL2A",
    contactPerson: "Jeroen Bos",
    email: "jeroen.bos@ing.nl",
    phone: "+31 20 563 9111",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "023",
    name: "Rabobank",
    city: "Amsterdam",
    country: "Netherlands",
    currency: "EUR",
    accountNumber: "66778899",
    swiftCode: "RABONL2U",
    contactPerson: "Anouk Visser",
    email: "anouk.visser@rabobank.nl",
    phone: "+31 30 216 0000",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "024",
    name: "Bunq",
    city: "Amsterdam",
    country: "Netherlands",
    currency: "EUR",
    accountNumber: "77889900",
    swiftCode: "BUNQNL2A",
    contactPerson: "Tom Groen",
    email: "tom.groen@bunq.com",
    phone: "+31 20 240 0650",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "025",
    name: "Van Lanschot Kempen",
    city: "Amsterdam",
    country: "Netherlands",
    currency: "EUR",
    accountNumber: "88990011",
    swiftCode: "FVLBNL22",
    contactPerson: "Maaike van der Berg",
    email: "maaike.berg@vanlanschot.com",
    phone: "+31 20 354 4500",
    nostroAccounts: {
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  // Sydney Banks
  {
    id: "026",
    name: "Commonwealth Bank of Australia",
    city: "Sydney",
    country: "Australia",
    currency: "AUD",
    accountNumber: "56781234",
    swiftCode: "CTBAAU2S",
    contactPerson: "Sarah Johnson",
    email: "sarah.johnson@commbank.com.au",
    phone: "+61 2 9374 2000",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "027",
    name: "Westpac Banking Corporation",
    city: "Sydney",
    country: "Australia",
    currency: "AUD",
    accountNumber: "77889900",
    swiftCode: "WPACAU2S",
    contactPerson: "James Wilson",
    email: "james.wilson@westpac.com.au",
    phone: "+61 2 8253 0888",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "028",
    name: "National Australia Bank (NAB)",
    city: "Sydney",
    country: "Australia",
    currency: "AUD",
    accountNumber: "88990011",
    swiftCode: "NATAAU33",
    contactPerson: "Emily Davis",
    email: "emily.davis@nab.com.au",
    phone: "+61 3 8641 9083",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "029",
    name: "ANZ Banking Group",
    city: "Sydney",
    country: "Australia",
    currency: "AUD",
    accountNumber: "99887766",
    swiftCode: "ANZBAU3M",
    contactPerson: "Daniel Brown",
    email: "daniel.brown@anz.com",
    phone: "+61 3 9273 5555",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "030",
    name: "Macquarie Bank",
    city: "Sydney",
    country: "Australia",
    currency: "AUD",
    accountNumber: "33445566",
    swiftCode: "MACQAU2S",
    contactPerson: "Isabella Taylor",
    email: "isabella.taylor@macquarie.com",
    phone: "+61 2 8232 3333",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  // Wellington Banks
  {
    id: "031",
    name: "Bank of New Zealand (BNZ)",
    city: "Wellington",
    country: "New Zealand",
    currency: "NZD",
    accountNumber: "22334455",
    swiftCode: "BKNZNZ22",
    contactPerson: "Oliver Moore",
    email: "oliver.moore@bnz.co.nz",
    phone: "+64 4 474 6747",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "032",
    name: "ANZ Bank New Zealand",
    city: "Wellington",
    country: "New Zealand",
    currency: "NZD",
    accountNumber: "55667788",
    swiftCode: "ANZBNZ22",
    contactPerson: "Charlotte Evans",
    email: "charlotte.evans@anz.co.nz",
    phone: "+64 4 496 7000",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "033",
    name: "Kiwibank",
    city: "Wellington",
    country: "New Zealand",
    currency: "NZD",
    accountNumber: "66778899",
    swiftCode: "KIWINZ22",
    contactPerson: "Jacob Roberts",
    email: "jacob.roberts@kiwibank.co.nz",
    phone: "+64 4 473 1133",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "034",
    name: "Westpac New Zealand",
    city: "Wellington",
    country: "New Zealand",
    currency: "NZD",
    accountNumber: "77889900",
    swiftCode: "WPACNZ22",
    contactPerson: "Sophia Green",
    email: "sophia.green@westpac.co.nz",
    phone: "+64 4 496 2000",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "035",
    name: "ASB Bank",
    city: "Wellington",
    country: "New Zealand",
    currency: "NZD",
    accountNumber: "98765432",
    swiftCode: "ASBBNZ22",
    contactPerson: "Emma Thompson",
    email: "emma.thompson@asbbank.co.nz",
    phone: "+64 4 472 0029",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "036",
    name: "Mizuho Bank",
    city: "Tokyo",
    country: "Japan",
    currency: "JPY",
    accountNumber: "11223344",
    swiftCode: "MHCBJPJT",
    contactPerson: "Hiroshi Tanaka",
    email: "hiroshi.tanaka@mizuhobank.co.jp",
    phone: "+81 3 3242 1111",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
  {
    id: "037",
    name: "Royal Bank of Canada",
    city: "Ontario",
    country: "Canada",
    currency: "CAD",
    accountNumber: "44556677",
    swiftCode: "ROYCCAT2",
    contactPerson: "Sarah Johnson",
    email: "sarah.johnson@rbc.com",
    phone: "+1 416 974 5151",
    nostroAccounts: {
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      GBP: "001", // Barclays Bank, London
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
    },
  },
  {
    id: "999", // Unique ID for your bank
    name: "Global Trade Bank",
    city: "London",
    country: "United Kingdom",
    currency: "GBP",
    accountNumber: "99999999",
    swiftCode: "GTBUKGBX",
    contactPerson: "Your Name",
    email: "info@globaltradebank.co.uk",
    phone: "+44 20 1234 5678",
    nostroAccounts: {
      GBP: "001", // Barclays Bank, London
      EUR: "016", // Deutsche Bank, Frankfurt
      USD: "010", // Bank of America, New York
      JPY: "036", // Mizuho Bank, Tokyo
      AUD: "026", // Commonwealth Bank of Australia, Sydney
      NZD: "034", // Westpac New Zealand, Wellington
      CAD: "037", // Royal Bank of Canada, Ontario
    },
  },
];

// Function to populate counterpartyData with validation
const populateCounterpartyTable = () => {
  counterpartyData = initialCounterpartyData
    .map((counterparty) => {
      try {
        validateCounterparty(counterparty); // Validate before adding
        return counterparty;
      } catch (err) {
        console.error(`Validation failed: ${err.message}`);
        return null; // Skip invalid records
      }
    })
    .filter(Boolean); // Remove null records
  console.log("Counterparty data populated and validated.");
};

// Populate the counterpartyData array
populateCounterpartyTable();

// Function to populate nostroData
const populateNostroData = () => {
  counterpartyData.forEach((cp) => {
    Object.entries(cp.nostroAccounts).forEach(([currency, nostroCode]) => {
      nostroData.push({
        currency,
        nostroCode, // The nostro account's unique identifier
        counterpartyId: cp.id, // The counterparty that owns this nostro account
        managedById: nostroCode, // Assume nostroCode is valid
      });
    });
  });

  console.log("Nostro data populated.");
};

// Populate the nostroData array
populateNostroData();

// Export both counterpartyData and nostroData
export { counterpartyData, counterpartyFields, nostroData };
