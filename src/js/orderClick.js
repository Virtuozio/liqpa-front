const html = document.querySelector('html');
const orderButtons = document.querySelectorAll('.service__button');
const backdrop = document.querySelector('.backdrop');
const footer = document.querySelector('.footer');
const program = document.querySelector('#program');
const proposals = document.querySelector('#proposals');

// FORM OBJECTS
const modalForm = document.querySelector('.modal-form');
const liqPayButtonText = document.querySelector('.privat-button-text');
const amountInput = document.querySelector('#amountInput');

// OPENING ORDER FORM
const openModalForm = e => {
  switch (e.currentTarget.id) {
    case 'test':
      localStorage.setItem('program', 'test');
      liqPayButtonText.textContent = 'Сплатити 700 UAH';
      amountInput.value = 700;

      break;

    case 'standard':
      localStorage.setItem('program', 'standard');
      liqPayButtonText.textContent = 'Сплатити 4000 UAH';
      amountInput.value = 4000;
      break;

    case 'vip':
      localStorage.setItem('program', 'vip');
      liqPayButtonText.textContent = 'Сплатити 7000 UAH';
      amountInput.value = 7000;
      break;
  }

  backdrop.classList.toggle('visually-hidden');

  // blur for iphone
  footer.classList.toggle('blur');
  proposals.classList.toggle('blur');
  program.classList.toggle('blur');

  modalForm.classList.toggle('visually-hidden');
  html.classList.toggle('scrollBlock');
};

orderButtons.forEach(btn => {
  btn.addEventListener('click', openModalForm);
});
