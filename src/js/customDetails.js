const accordionItemHeaders = document.querySelectorAll(
  '.accordion-item-header'
);

accordionItemHeaders.forEach(accordionItemHeader => {
  accordionItemHeader.addEventListener('click', e => {
    accordionItemHeader.classList.toggle('active');
    accordionItemHeader.lastElementChild.classList.toggle('open');

    const accordionItemBody = accordionItemHeader.nextElementSibling;

    if (accordionItemHeader.classList.contains('active')) {
      accordionItemBody.style.minHeight = accordionItemBody.scrollHeight + 'px';
    } else {
      accordionItemBody.style.minHeight = 0;
      accordionItemBody.style.maxHeight = 0;
    }
  });
});
