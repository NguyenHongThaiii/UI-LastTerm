export function createElement(element, selector, content) {
  if (!element) return;

  const newElement = element.querySelector(selector);
  if (newElement) newElement.textContent = content;
}
export function applyValue(element, selector, value) {
  if (!element) return;

  const newElement = element.querySelector(selector);
  if (newElement) newElement.value = value;
}

export function applyImage(element, selector, value) {
  if (!element) return;

  const newElement = element.querySelector(selector);
  if (newElement) newElement.style.backgroundImage = `url("${value}")`;
}

export function randomNumber(n) {
  return Math.round(Math.random() * n);
}
export function showModal(modalId) {
  const myModal = new bootstrap.Modal(document.getElementById(modalId));

  myModal.show();
}
