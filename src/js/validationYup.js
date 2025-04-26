import * as yup from "yup";

export const schema = yup.object().shape({
  edrpou: yup
    .string()
    .matches(/^\d{8,10}$/, "Невірний код ЄДРПОУ")
    .required("Код ЄДРПОУ обов'язковий"),
  company: yup
    .string()
    .max(100, "Назва не повинна перевищувати 100 символів")
    .required("Назва підприємства обов'язкова"),
  email: yup.string().email("Невірний формат email").required("Email обов'язковий"),
  phone: yup
    .string()
    .matches(/^\+?\d{10,15}$/, "Невірний формат телефону")
    .required("Телефон обов'язковий"),
  period: yup.string().required("Період обов'язковий"),
  amount: yup.number().positive("Сума має бути додатною").required("Сума обов'язкова"),
});
