import * as yup from "yup";
import "yup-phone";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const schema = yup.object().shape({
  edrpou: yup
    .string()
    .matches(/^\d{8,10}$/, "Код повинен складатися з 8, 9 або 10 цифр")
    .required("Код ЄДРПОУ обов'язковий"),
  company: yup
    .string()
    .max(100, "Назва не повинна перевищувати 100 символів")
    .required("Назва підприємства обов'язкова"),
  email: yup
    .string()
    .email("Формат email не відповідає lastname@example.com")
    .required("Email обов'язковий"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Невірний формат телефону")
    .required("Телефон обов'язковий"),
  period: yup.string().required("Період обов'язковий"),
  amount: yup.number().positive("Сума має бути додатною").required("Сума обов'язкова"),
});
