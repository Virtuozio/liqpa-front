import { getPayData } from "../api/pay";
import sendEmail from "../api/emailJsSDK";

// Elements
const paymentForm = document.querySelector(".payment-form");
const backLink = document.querySelector(".payment-form__back-link");
const priceTable = document.querySelector(".price-table");
const registrationForm = document.getElementById("registrationForm");
const priceCells = document.querySelectorAll(".price-cell");
const legalForm = document.getElementById("legalForm");
const periodInput = document.getElementById("periodInput");
const amountInput = document.getElementById("amountInput");
const subtitle = document.querySelector(".payment-form__subtitle");

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
  // Reset subtitle text when going back
  subtitle.textContent = "Оберіть тип ліцензії:";
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

  // Update subtitle text based on selection
  let subtitleText = "";
  if (price === "1590") {
    subtitleText = "Супровід ПЗ Соната 1590 грн юридична особа - 12 місяців";
  } else if (price === "590") {
    subtitleText = "Супровід ПЗ Соната 590 грн ФОП - 12 місяців";
  } else if (price === "1190") {
    subtitleText = "Супровід ПЗ Соната 1190 грн юридична особа - 6 місяців";
  } else if (price === "790") {
    subtitleText = "Супровід ПЗ Соната 790 грн юридична особа - 3 місяці";
  } else if (price === "0") {
    subtitleText = "Супровід ПЗ Соната БЕЗКОШТОВНО демо - 1 місяць";
  }

  if (subtitle) {
    subtitle.textContent = subtitleText;
  }

  showRegistrationForm();
};

// Phone validation function
const phoneNumberValidation = (phoneNumber) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phoneNumber);
};

// Handle form submission
const handleSubmit = async (method) => {
  // Get form data
  const formData = new FormData(legalForm);
  const data = Object.fromEntries(formData.entries());

  // Validate phone
  if (!phoneNumberValidation(data.phone)) {
    alert("Будь ласка, введіть коректний номер телефону");
    return;
  }

  try {
    if (method === "card") {
      // Hide payment form content
      const paymentFormContent = document.querySelector(".payment-form__content");
      if (paymentFormContent) {
        paymentFormContent.classList.add("visually-hidden");
      }

      // Handle card payment
      const { data: liqpayData, signature } = await getPayData(data);
      LiqPayCheckout.init({
        data: liqpayData,
        signature: signature,
        embedTo: "#liqpay_checkout",
        mode: "embed",
      });
    } else {
      // Handle invoice generation
      const status = await sendEmail(data);
      if (status) {
        alert("Рахунок буде відправлено на вказаний email");
        showPriceSelection();
        legalForm.reset();
      } else {
        alert("Виникла помилка при відправці. Спробуйте пізніше або зв'яжіться з нами");
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    alert("Виникла помилка. Спробуйте пізніше або зв'яжіться з нами");
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
  invoiceBtn.addEventListener("click", () => handleSubmit("invoice"));
}

if (cardBtn) {
  cardBtn.addEventListener("click", () => handleSubmit("card"));
}

// Initialize
backLink.style.display = "none";
