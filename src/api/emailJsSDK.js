import emailjs from '@emailjs/browser';

emailjs.init('yaP1eKHoXygMYY3jM');

const sendEmail = async templateParams => {
  try {
    await emailjs.send('service_v29xffh', 'template_f5alggq', templateParams);

    return true;
  } catch (error) {
    return false;
  }
};

export default sendEmail;
