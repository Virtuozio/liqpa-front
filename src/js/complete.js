import { getEmailData } from "../api/pay.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".complete-container");
  if (!container) return;

  // Get order_id from URL
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id");

  // Show loader
  container.innerHTML = "<div class='loader'>Завантаження...</div>";

  try {
    // Fetch email data using the API
    const response = await getEmailData(orderId);
    const emailData = response.data;

    // Render complete page content
    container.innerHTML = `
      <h1>Дякуємо за замовлення</h1>
      <div class="info">
        На email <span class="email">${
          emailData.email || "Н/Д"
        }</span> скоро буде надіслано лист з результатом
        активації
      </div>
      <div class="warning">
        <span class="warning-icon">&#9888;</span>
        <span
          >Якщо ви не отримали лист від нас протягом 5 хвилин, можливо він потрапив до папки
          <b>Спам</b> чи <b>Промоакції</b> (для gmail) та перевірте правильність написання
          email</span
        >
      </div>
      <div class="info">
        Якщо у Вас ще не встановлена програма Соната, то зараз Ви можете
        <a href="https://sonatazvit.com.ua/download" target="_blank">завантажити</a> і встановити її
        на свій комп'ютер і створити профіль Вашого підприємства.
      </div>
      
      ${
        orderId
          ? `
      <div class="order-details">
        <h2>Деталі замовлення</h2>
        <p>Номер замовлення: ${orderId}</p>
        ${emailData.status ? `<p>Статус: ${emailData.status}</p>` : ""}
        ${emailData.additionalInfo ? `<p>${emailData.additionalInfo}</p>` : ""}
      </div>
      `
          : ""
      }
      
      <div class="section-title">Як створити перший профіль підприємства:</div>
      <iframe
        class="video"
        src="https://www.youtube.com/embed/2v6QwQwQw0w"
        frameborder="0"
        allowfullscreen
      ></iframe>
      <div class="section-title">Питання та відповіді</div>
      <div class="faq">
        <div class="faq-question">Як і коли активується ліцензія?</div>
        <div class="faq-answer">
          Активація ліцензії відбувається автоматично після відправлення форми з контактними даними,
          про це ви отримаєте повідомлення на вказаний email на протязі 20 хвилин. Якщо ви не
          отримали повідомлення, то можливо, ви невірно вказали email або перевірте папку зі спамом.
        </div>
        <div class="faq-question">Як завантажити ліцензію в Сонату?</div>
        <div class="faq-answer">
          Зазвичай додаткових дій по активації ліцензії в програмі не потрібно. Ліцензія
          перевіряється при запуску Сонати. Також ви можете перейти в "Налаштування профілю", на
          закладку "Ліцензія" і натиснути кнопку "Оновити інформацію про ліцензію".
        </div>
        <div class="faq-question">Виникли труднощі з активацією?</div>
        <div class="faq-answer">
          Якщо у вас виникли труднощі з активацією програми, зв'яжіться з нами по телефону
          <a href="tel:0672181917">0672181917</a> або напишіть на <a href="mailto:email">email</a>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="error-message">
        <h1>Дякуємо за замовлення</h1>
        <div class="info">
          На email <span class="email" id="userEmail"></span> скоро буде надіслано лист з результатом
          активації
        </div>
        <div class="warning">
          <span class="warning-icon">&#9888;</span>
          <span
            >Якщо ви не отримали лист від нас протягом 5 хвилин, можливо він потрапив до папки
            <b>Спам</b> чи <b>Промоакції</b> (для gmail) та перевірте правильність написання
            email</span
          >
        </div>
        <div class="info">
          Якщо у Вас ще не встановлена програма Соната, то зараз Ви можете
          <a href="https://sonatazvit.com.ua/download" target="_blank">завантажити</a> і встановити її
          на свій комп'ютер і створити профіль Вашого підприємства.
        </div>
        ${
          orderId
            ? `
        <div class="order-details">
          <h2>Деталі замовлення</h2>
          <p>Номер замовлення: ${orderId}</p>
        </div>
        `
            : ""
        }
        <div class="section-title">Як створити перший профіль підприємства:</div>
        <iframe
          class="video"
          src="https://www.youtube.com/embed/2v6QwQwQw0w"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <div class="section-title">Питання та відповіді</div>
        <div class="faq">
          <div class="faq-question">Як і коли активується ліцензія?</div>
          <div class="faq-answer">
            Активація ліцензії відбувається автоматично після відправлення форми з контактними даними,
            про це ви отримаєте повідомлення на вказаний email на протязі 20 хвилин. Якщо ви не
            отримали повідомлення, то можливо, ви невірно вказали email або перевірте папку зі спамом.
          </div>
          <div class="faq-question">Як завантажити ліцензію в Сонату?</div>
          <div class="faq-answer">
            Зазвичай додаткових дій по активації ліцензії в програмі не потрібно. Ліцензія
            перевіряється при запуску Сонати. Також ви можете перейти в "Налаштування профілю", на
            закладку "Ліцензія" і натиснути кнопку "Оновити інформацію про ліцензію".
          </div>
          <div class="faq-question">Виникли труднощі з активацією?</div>
          <div class="faq-answer">
            Якщо у вас виникли труднощі з активацією програми, зв'яжіться з нами по телефону
            <a href="tel:0672181917">0672181917</a> або напишіть на <a href="mailto:email">email</a>
          </div>
        </div>
    `;

    // Fallback to localStorage data if API fails
    const invoiceData = JSON.parse(localStorage.getItem("invoiceData") || "{}");
    const emailElement = document.getElementById("userEmail");
    if (emailElement && invoiceData.email) {
      emailElement.textContent = invoiceData.email;
    }

    // Clear the invoice data from localStorage after displaying
    localStorage.removeItem("invoiceData");
  }
});
