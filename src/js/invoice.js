// src/js/invoice.js
import { initInvoicePage } from "../api/pay";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".invoice-wrapper");
  if (!container) return;

  // Get order_id from URL
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id");
  if (!orderId) {
    container.innerHTML = "<div>Не знайдено номер рахунку.</div>";
    return;
  }

  // Show loader
  container.innerHTML = "<div>Завантаження рахунку...</div>";

  try {
    // Use your API method
    const res = await initInvoicePage(orderId);
    // Axios puts the data in res.data
    const payment = res.data.payment;

    // Render invoice HTML (reuse your previous template, but fill with payment data)
    container.innerHTML = `
      <div class="invoice-actions no-print">
        <button onclick="window.print()">Роздрукувати</button>
        ${
          payment.liqpayUrl
            ? `<a href="${payment.liqpayUrl}" class="pay-btn" target="_blank">Сплатити карткою</a>`
            : ""
        }
        <button onclick="saveAsPDF()">Зберегти в PDF</button>
        <button onclick="window.location.href='/'">Ще один рахунок</button>
      </div>
      <div class="invoice-warning">${payment.organisation?.tax_comment || ""}</div>
      <div class="invoice-container">
      <h1 class="invoice-title">
        Рахунок на оплату № ${payment.order_id || ""} від ${
      payment.date ? new Date(payment.date).toLocaleDateString("uk-UA") : ""
    } р.
      </h1>
      
      <div class="invoice-supplier-buyer">
        <div class="supplier">
          <b>ПОСТАЧАЛЬНИК:</b><br />
          ${payment.organisation?.name || ""}<br />
          sonatazvit.com.ua<br />
          ЄДРПОУ: ${payment.organisation?.edrpou || ""}<br />
          IBAN: ${payment.organisation?.iban || ""}, ${
      payment.organisation?.contract_bank || ""
    }<br />
          ${payment.organisation?.address || ""}<br />
          Тел.: ${payment.organisation?.phone || ""}<br />
          Поштова адреса: ${payment.organisation?.post_address || ""}<br />
          ${payment.organisation?.tax_comment || ""}
        </div>
        <div class="buyer">
          <b>ПОКУПЕЦЬ:</b><br />
          ${payment.partner?.name || ""}<br />
          ${payment.partner?.edrpou ? "ЄДРПОУ: " + payment.partner.edrpou : ""}
        </div>
      </div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Товари(роботи, послуги)</th>
            <th>Кіль-ть</th>
            <th>Ціна</th>
            <th>Сума</th>
          </tr>
        </thead>
        <tbody>
          ${
            Array.isArray(payment.products)
              ? payment.products
                  .map(
                    (item, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${item.product?.full_name || ""}</td>
              <td>${item.qty || ""} ${item.product?.unit || ""}</td>
              <td>${item.price?.toFixed(2) || ""}</td>
              <td>${item.total?.toFixed(2) || ""}</td>
            </tr>
          `
                  )
                  .join("")
              : ""
          }
        </tbody>
      </table>
      <div class="invoice-total">
        <b>Разом: ${
          payment.products?.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2) || "0.00"
        } грн</b>
      </div>
      <div class="invoice-note">
        Всього до сплати: ${payment.products?.[0]?.total_words || ""}. Без ПДВ.<br />
        Послуга включає ліцензійну версію програми СОНАТА
      </div>
      <div class="invoice-footer">
        <div class="invoice-license-warning no-print">
          Ліцензія вступає в дію після надходження коштів на рахунок або, за наявності чинної ліцензії, з моменту її закінчення.<br />
          Обов'язково вкажіть номер рахунку "${
            payment.order_id || ""
          }" або свій ІПН/ЄДРПОУ у призначенні платежу.
        </div>
        <div class="invoice-sign">
          Виписав: <span class="sign-line">${payment.organisation?.signer_short || ""}</span>
        </div>
      </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="color:red;">${err.message}</div>`;
  }
});
