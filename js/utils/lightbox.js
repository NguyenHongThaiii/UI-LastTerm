import { showModal } from './common';

export function registerLightBox(modalId, imgSelector, prevBtnSelector, nextBtnSelector) {
  const modal = document.getElementById(modalId);
  const prevBtn = document.querySelector(`#${prevBtnSelector}`);
  const nextBtn = document.querySelector(`#${nextBtnSelector}`);
  if (!modal || Boolean(modal.dataset.registerLightBox)) return;

  let albumList = [];
  let index = 0;
  let currentIndex = 0;
  function setSrcLightBox(index) {
    const modalLightbox = document.getElementById(imgSelector);
    if (!modalLightbox) return;

    modalLightbox.src = albumList[index].src;
    currentIndex = index;
  }
  document.addEventListener('click', (event) => {
    if (event.target.tagName !== 'IMG' || !event.target.dataset.album) return;

    albumList = document.querySelectorAll(`img[data-album="${event.target.dataset.album}"]`);
    index = [...albumList].findIndex((album) => album === event.target);

    setSrcLightBox(index);
    showModal(modalId);
  });

  // handel next

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % albumList.length;
    setSrcLightBox(currentIndex);
  });

  // handle prev

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + albumList.length - 1) % albumList.length;
    setSrcLightBox(currentIndex);
  });

  modal.dataset.registerLightBox = 'true';
}
