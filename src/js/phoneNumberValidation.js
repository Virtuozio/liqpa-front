const phoneInput = document.querySelector('#phone_number');
const phoneRegex = /^\+380\d{9}$/;

const validateNumber = () => {
  const phone = phoneInput.value.trim();
  const isValid = phoneRegex.test(phone);
  const warningElement = document.querySelector('.modal-form__phone-warning');

  if (!isValid) {
    phoneInput.classList.add('invalid');
    if (!warningElement) {
      const warning = document.createElement('p');
      warning.textContent =
        'Введіть дійсний номер телефону у форматі +380XXXXXXXXX';
      warning.classList.add('modal-form__phone-warning');
      phoneInput.parentNode.insertBefore(warning, phoneInput.nextSibling);
    }
    return false;
  } else {
    phoneInput.classList.remove('invalid');
    if (warningElement) {
      warningElement.parentNode.removeChild(warningElement);
    }
  }

  return true;
};

export default validateNumber;
