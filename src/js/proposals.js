import { getPayData } from "../api/pay";

// Elements
const paymentForm = document.querySelector(".payment-form");
const backLink = document.querySelector(".payment-form__back-link");
const priceTable = document.querySelector(".price-table");
const registrationForm = document.getElementById("registrationForm");
const priceCells = document.querySelectorAll(".price-cell");
const legalForm = document.getElementById("legalForm");
const periodInput = document.getElementById("periodInput");
const amountInput = document.getElementById("amountInput");

// Show registration form
const showRegistrationForm = () => {
  priceTable.classList.add("visually-hidden");
  registrationForm.classList.remove("visually-hidden");
  backLink.style.display = "inline-block";
};

// Show price selection
const showPriceSelection = () => {
  priceTable.classList.remove("visually-hidden");
  registrationForm.classList.add("visually-hidden");
  backLink.style.display = "none";
};

// Handle back button
const handleBack = (e) => {
  e.preventDefault();
  showPriceSelection();
};

// Handle price selection
const handlePriceSelect = (cell) => {
  const period = cell.dataset.period;
  const price = cell.dataset.price;

  // Update hidden inputs
  if (periodInput) periodInput.value = period;
  if (amountInput) amountInput.value = price;

  showRegistrationForm();
};

// Handle payment methods
const handlePayment = async (method) => {
  const formData = new FormData(legalForm);

  const data = {
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
      console.log("Generating invoice for:", data);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  }
};

// Event Listeners
backLink.addEventListener("click", handleBack);

// Price cell buttons
priceCells.forEach((cell) => {
  cell.addEventListener("click", () => handlePriceSelect(cell));
});

// Payment buttons
const invoiceBtn = document.querySelector(".invoice-btn");
const cardBtn = document.querySelector(".card-btn");

if (invoiceBtn) {
  invoiceBtn.addEventListener("click", () => handlePayment("invoice"));
}

if (cardBtn) {
  cardBtn.addEventListener("click", () => handlePayment("card"));
}

// Initialize
backLink.style.display = "none";
