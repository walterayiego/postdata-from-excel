const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const XLSX = require("xlsx");

// Load the Excel file
const workbook = XLSX.readFile("./RATES.xlsx");

// Assuming the first sheet is the one you want to read
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert the sheet to an array of objects
const data = XLSX.utils.sheet_to_json(sheet);
// console.log(data);

const loginUrl = "https://admin.revenue.co.ke/login";
const postUrl = "https://admin.revenue.co.ke/property-rates/create";

// Function to make the authenticated POST request
async function postData(sessionCookie, formData) {
  try {
    const postResponse = await axios.post(
      postUrl,
      qs.stringify({
        lrNumber: formData["BLOCK NO"],
        plotNo: formData["PLOT NO"],
        postalAddress: formData["PO BOX"],
        location: formData.LOCATION,
        physicalLocation: formData.LOCATION,
        documentNumber: formData["ASSET ID"],
        valuationModeValue: formData["RATES PAYABLE"],
        arrearsAmount: formData.OUTSTANDING,
        zone: 16,
        documentType: "CERTIFICATE_OF_LEASE",
        measurementUnit: 1,
        unitArea: 0,
        postalTown: "KAKAMEGA",
        place_id: "",
        serviceCategoryId: 428,
        serviceId: 3956,
        siteValue: 0,
        valuationMode: "FIXED",
        authorityReference: "VALUATION ROLE",
        ownerType: "GOVERNMENT_PROPERTY",
        propertyUse: "COMMERCIAL",
        interestType: "LEASE_HOLD",
        subCounty: 36,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: sessionCookie,
        },
      }
    );

    console.log("Post response:", postResponse.data);
  } catch (error) {
    console.error("Post request failed:", error.response.data);
    throw error;
  }
}

// Main function to perform login and post data
async function main(data) {
  const sessionCookie = `JSESSIONID=<SESSION_ID>`;
  data.map(async (formData) => {
    await postData(sessionCookie, formData);
  });
}

// Run the main function
main(data);
