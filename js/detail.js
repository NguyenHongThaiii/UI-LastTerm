import postApi from './api/postsApi';
import { createElement, registerLightBox } from './utils';
import dayjs from 'dayjs';

// id="goToEditPageLink"
// id="postHeroImage"
// id="postDetailTitle"
// id="postDetailAuthor"
// id="postDetailTimeSpan"
// id="postDetailDescription"
function renderDetailPost(post) {
  if (!post) return;
  //   get & update title element
  //   get & update author element
  //   get & update description element
  createElement(document, '#postDetailTitle', post.title);
  createElement(document, '#postDetailAuthor', post.author);
  createElement(document, '#postDetailDescription', post.description);
  //   get & update link element
  const editPost = document.getElementById('goToEditPageLink');
  if (editPost) {
    editPost.innerHTML = '<i class="fas fa-edit"></i> Edit post';
    editPost.addEventListener('click', () => {
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }
  //   get & update image element
  const imageHero = document.getElementById('postHeroImage');
  if (imageHero) {
    imageHero.style.backgroundImage = `url("${post.imageUrl}")`;
    imageHero.addEventListener('error', () => {
      imageHero.style.backgroundImage = 'https://via.placeholder.com/468x60';
    });
  }
  //   get & update timeSpan element
  const timeSpan = document.getElementById('postDetailTimeSpan');
  if (timeSpan)
    createElement(
      document,
      '#postDetailTimeSpan',
      dayjs(post.updatedAt).format(' - DD/MM/YYYY - HH:mm')
    );
}

(async () => {
  try {
    registerLightBox('modal', 'modalLightbox', 'modalPrevBtn', 'modalNextBtn');
    registerLightBox('modal', 'modalLightbox', 'modalPrevBtn', 'modalNextBtn');
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (!postId) return;

    const data = await postApi.getById(postId);
    renderDetailPost(data);
  } catch (error) {}
})();
