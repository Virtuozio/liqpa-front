import { getPayData } from "../api/pay";

// Elements
const paymentForm = document.querySelector(".payment-form");
const backLink = document.querySelector(".payment-form__back-link");
const legalPersonButton = document.querySelector(".payment-option__button--legal");
const individualPersonButton = document.querySelector(".payment-option__button--individual");
const personTypeSection = document.querySelector(".payment-form__person-type");
const legalRegistrationSection = document.querySelector(".payment-form__registration--legal");
const individualRegistrationSection = document.querySelector(
  ".payment-form__registration--individual"
);
const legalForm = document.getElementById("legalForm");
const individualForm = document.getElementById("individualForm");

let selectedType = null;
let selectedPeriod = {
  legal: "12",
  individual: "12",
};

// Show registration form
const showRegistrationForm = (type) => {
  personTypeSection.classList.add("visually-hidden");
  if (type === "legal") {
    legalRegistrationSection.classList.remove("visually-hidden");
    individualRegistrationSection.classList.add("visually-hidden");
  } else {
    individualRegistrationSection.classList.remove("visually-hidden");
    legalRegistrationSection.classList.add("visually-hidden");
  }
  backLink.style.display = "inline-block";
};

// Show person type selection
const showPersonTypeSelection = () => {
  personTypeSection.classList.remove("visually-hidden");
  legalRegistrationSection.classList.add("visually-hidden");
  individualRegistrationSection.classList.add("visually-hidden");
  backLink.style.display = "none";
};

// Handle person type selection
const handlePersonTypeSelect = (type) => {
  selectedType = type;
  showRegistrationForm(type);
};

// Handle back button
const handleBack = (e) => {
  e.preventDefault();
  showPersonTypeSelection();
};

// Handle license period selection
const handleLicensePeriodChange = (e) => {
  const type = e.target.name.includes("legal") ? "legal" : "individual";
  selectedPeriod[type] = e.target.value;
};

// Handle payment methods
const handlePayment = async (method, formType) => {
  const form = formType === "legal" ? legalForm : individualForm;
  const formData = new FormData(form);

  const data = {
    type: formType,
    period: selectedPeriod[formType],
    payment_method: method,
    ...Object.fromEntries(formData.entries()),
  };

  if (method === "card") {
    try {
      const { data: liqpayData, signature } = await getPayData(data);
      LiqPayCheckout.init({
        data: liqpayData,
        signature: signature,
        embedTo: "#liqpay_checkout",
        mode: "embed",
      });
    } catch (error) {
      console.error("Error initializing payment:", error);
    }
  } else {
    // Handle invoice generation
    try {
      // Add your invoice generation logic here
      console.log("Generating invoice for:", data);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  }
};

// Event Listeners
backLink.addEventListener("click", handleBack);
legalPersonButton.addEventListener("click", () => handlePersonTypeSelect("legal"));
individualPersonButton.addEventListener("click", () => handlePersonTypeSelect("individual"));

// License period radio buttons
const licenseOptions = document.querySelectorAll(
  'input[name="license-period-legal"], input[name="license-period-individual"]'
);
licenseOptions.forEach((option) => {
  option.addEventListener("change", handleLicensePeriodChange);
});

// Payment buttons
document.querySelectorAll(".payment-method-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const method = button.classList.contains("invoice-btn") ? "invoice" : "card";
    const formType = button.dataset.form;
    handlePayment(method, formType);
  });
});

// Initialize
backLink.style.display = "none";
