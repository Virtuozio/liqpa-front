import phoneNumberValidation from './phoneNumberValidation';
import sendEmail from '../api/emailJsSDK';
import { getPayData } from '../api/pay';

// elements
const html = document.querySelector('html');
const backdrop = document.querySelector('.backdrop');
const footer = document.querySelector('.footer');
const program = document.querySelector('#program');
const proposals = document.querySelector('#proposals');
const formModalWindow = document.querySelector('.modal-form');
const form = document.querySelector('#orderForm');
const closeBtn = document.querySelector('.modal-form__close-btn');
const modalContent = document.querySelector('.modal-form-content-wrapper');
const afterText = document.querySelector('.after-submit-text');
const spinner = document.querySelector('#spinner');

let isOpenAfterText = false;
let status = false;

// HANDLE SUBMIT
const handleSubmit = async event => {
  event.preventDefault();

  const program = localStorage.getItem('program');
  const { name, phone, amount } = event.currentTarget;

  // phone validation
  const isValide = phoneNumberValidation();
  if (!isValide) {
    return;
  }

  const clientData = {
    name: name.value,
    phone: phone.value,
    program,
    amount: amount.value,
  };

  spinner.classList.toggle('disabled');

  // pay redirect
  if (event.submitter.id === 'pay') {
    try {
      const { data, signature } = await getPayData(clientData);
      spinner.classList.toggle('disabled');
      location = `https://www.liqpay.ua/api/3/checkout?data=${data}&signature=${signature}`;
      return;
    } catch (error) {
      status = false;
    }
  } else {
    status = await sendEmail(clientData);
  }

  // order feedback

  form.reset();

  spinner.classList.toggle('disabled');
  modalContent.classList.toggle('visually-hidden');
  afterText.classList.toggle('visually-hidden');

  status
    ? (afterText.textContent = 'Ми скоро з тобою зв’яжемось. До зустрічі!')
    : (afterText.textContent = `Вибачте, при відправці заявки виникла помилка, спробуйте зв'язатись з нами за контактами внизу сторінки.`);

  isOpenAfterText = true;
};

// close btn
const closeModalForm = () => {
  if (isOpenAfterText) {
    modalContent.classList.toggle('visually-hidden');
    afterText.classList.toggle('visually-hidden');
  }
  backdrop.classList.toggle('visually-hidden');

  // blur for iphone
  footer.classList.toggle('blur');
  proposals.classList.toggle('blur');
  program.classList.toggle('blur');

  formModalWindow.classList.toggle('visually-hidden');
  html.classList.toggle('scrollBlock');
};

// listeners
form.addEventListener('submit', handleSubmit);
closeBtn.addEventListener('click', closeModalForm);
