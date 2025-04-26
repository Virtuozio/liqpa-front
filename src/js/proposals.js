import { getPayData } from "../api/pay";
import sendEmail from "../api/emailJsSDK";
import { schema } from "./validationYup";
// Elements
const paymentForm = document.querySelector(".payment-form");
const backLink = document.querySelector(".payment-form__back-link");
const priceTable = document.querySelector(".price-table");
const registrationForm = document.getElementById("registrationForm");
const freeLicenseForm = document.getElementById("freeLicenseForm");
const priceCells = document.querySelectorAll(".price-cell");
const legalForm = document.getElementById("legalForm");
const freeLicenseDataForm = document.getElementById("freeLicenseDataForm");
const periodInput = document.getElementById("periodInput");
const amountInput = document.getElementById("amountInput");
const subtitle = document.querySelector(".payment-form__subtitle");

// Show registration form
const showRegistrationForm = () => {
  priceTable.classList.add("visually-hidden");
  registrationForm.classList.remove("visually-hidden");
  freeLicenseForm.classList.add("visually-hidden");
  backLink.style.display = "inline-block";
};

// Show free license form
const showFreeLicenseForm = () => {
  priceTable.classList.add("visually-hidden");
  registrationForm.classList.add("visually-hidden");
  freeLicenseForm.classList.remove("visually-hidden");
  backLink.style.display = "inline-block";
};

// Show price selection
const showPriceSelection = () => {
  priceTable.classList.remove("visually-hidden");
  registrationForm.classList.add("visually-hidden");
  freeLicenseForm.classList.add("visually-hidden");
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

  // Show appropriate form based on price
  if (price === "0") {
    showFreeLicenseForm();
  } else {
    showRegistrationForm();
  }
};

// Handle free license form submission
const handleFreeLicenseSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(freeLicenseDataForm);
  const data = Object.fromEntries(formData.entries());

  try {
    // Add period and amount for free license
    data.period = "1";
    data.amount = "0";
    await schema.validate(data, { abortEarly: false });
    console.log("✅ Валідація пройшла успішно", formData);
    const status = await sendEmail(data);
    if (status) {
      alert("Дані для отримання безкоштовної ліцензії відправлено на вказаний email");
      showPriceSelection();
      freeLicenseDataForm.reset();
    } else {
      alert("Виникла помилка при відправці. Спробуйте пізніше або зв'яжіться з нами");
    }
  } catch (error) {
    if (error.name === "ValidationError" && error.inner) {
      error.inner.forEach((err) => {
        showError(freeLicenseDataForm, err.path, err.message);
      });
    } else alert("Виникла помилка. Спробуйте пізніше або зв'яжіться з нами");
  }
};

// Handle form submission
const handleSubmit = async (method) => {
  // Get form data
  const formData = new FormData(legalForm);
  const data = Object.fromEntries(formData.entries());
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error.name === "ValidationError" && error.inner) {
      error.inner.forEach((err) => {
        showError(legalForm, err.path, err.message);
      });
    } else alert("Виникла помилка. Спробуйте пізніше або зв'яжіться з нами");
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
      const status = await sendPayStatus({ data: liqpayData, signature: signature });
      console.log("🚀 ~ handleSubmit ~ status:", status);
    } else {
      // Handle invoice generation
      //const status = await sendEmail(data);
      // if (status) {
      //   alert("Рахунок буде відправлено на вказаний email");
      //   showPriceSelection();
      //   legalForm.reset();
      // } else {
      //   //alert("Виникла помилка при відправці. Спробуйте пізніше або зв'яжіться з нами");
      // }
    }
  } catch (error) {}
};

// Event Listeners
backLink.addEventListener("click", handleBack);

// Price cell buttons
priceCells.forEach((cell) => {
  cell.addEventListener("click", () => handlePriceSelect(cell));
});

// Free license form submission
if (freeLicenseDataForm) {
  freeLicenseDataForm.addEventListener("submit", handleFreeLicenseSubmit);
}

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

// Helper functions for form validation
const showError = (formElement, fieldName, errorMessage) => {
  const input = formElement.querySelector(`[name="${fieldName}"]`);
  const errorSpan = formElement.querySelector(`[data-field="${fieldName}"]`);
  if (input && errorSpan) {
    input.classList.add("error");
    errorSpan.textContent = errorMessage;
    errorSpan.classList.add("show");
  }
};

const clearError = (formElement, fieldName) => {
  const input = formElement.querySelector(`[name="${fieldName}"]`);
  const errorSpan = formElement.querySelector(`[data-field="${fieldName}"]`);
  if (input && errorSpan) {
    input.classList.remove("error");
    errorSpan.textContent = "";
    errorSpan.classList.remove("show");
  }
};

const clearAllErrors = (formElement) => {
  const inputs = formElement.querySelectorAll(".form-input");
  const errorSpans = formElement.querySelectorAll(".error-message");
  inputs.forEach((input) => input.classList.remove("error"));
  errorSpans.forEach((span) => {
    span.textContent = "";
    span.classList.remove("show");
  });
};

const addInputValidation = (form) => {
  const inputs = form.querySelectorAll(".form-input");
  inputs.forEach((input) => {
    input.addEventListener("input", async () => {
      const fieldName = input.getAttribute("name");
      const value = input.value;
      try {
        await schema.validateAt(fieldName, { [fieldName]: value });
        clearError(form, fieldName);
      } catch (error) {
        showError(form, fieldName, error.message);
      }
    });
  });
};

if (freeLicenseDataForm) addInputValidation(freeLicenseDataForm);
if (legalForm) addInputValidation(legalForm);
