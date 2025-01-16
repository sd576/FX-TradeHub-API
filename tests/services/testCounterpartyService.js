import {
  getAllCounterparties,
  getCounterpartyById,
  addCounterparty,
  updateCounterparty,
  deleteCounterparty,
} from "../../services/counterpartyService.js";

const testCounterparties = async () => {
  try {
    console.log("Fetching all counterparties:");
    console.log(await getAllCounterparties());

    console.log("Fetching counterparty by ID 'COUNTERPARTY-001':");
    console.log(await getCounterpartyById("COUNTERPARTY-001"));

    console.log("Adding a new counterparty:");
    console.log(
      await addCounterparty({
        id: "COUNTERPARTY-003",
        name: "Counterparty 3",
        city: "City 3",
        country: "Country 3",
        currency: "Currency 3",
        accountNumber: "Account Number 3",
        swiftCode: "Swift Code 3",
        contactPerson: "Contact Person 3",
        email: "Email 3",
        phone: "Phone 3",
      })
    );

    console.log("Updating counterparty with ID 'COUNTERPARTY-003':");
    console.log(
      await updateCounterparty("COUNTERPARTY-003", {
        name: "Updated Counterparty 3",
        city: "Updated City 3",
        country: "Updated Country 3",
        currency: "Updated Currency 3",
        accountNumber: "Updated Account Number 3",
        swiftCode: "Updated Swift Code 3",
        contactPerson: "Updated Contact Person 3",
        email: "Updated Email 3",
        phone: "Updated Phone 3",
      })
    );

    console.log("Deleting counterparty with ID 'COUNTERPARTY-003':");
    console.log(await deleteCounterparty("COUNTERPARTY-003"));
  } catch (err) {
    console.error("Error testing counterparties:", err.message);
  }
};

testCounterparties();
