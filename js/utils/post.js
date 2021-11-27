import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createElement } from './common';
dayjs.extend(relativeTime);

export function createPostElement(post) {
  if (!post) return;
  // find template element
  const templateElement = document.getElementById('postItemTemplate');
  if (!templateElement) return;
  // clone post element & update
  const postElement = templateElement.content.firstElementChild.cloneNode(true);
  if (!postElement) return;
  postElement.id = post.id;
  createElement(postElement, '[data-id="description"]', post.description);
  createElement(postElement, '[data-id="title"]', post.title);
  createElement(postElement, '[data-id="author"]', post.author);
  createElement(postElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`);
  const thumbnailElement = postElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/468x60';
    });
  }
  // Click to detail page
  const divElement = postElement.firstElementChild;

  divElement.addEventListener('click', (event) => {
    const menu = divElement.querySelector('[data-id="menu"]');
    if (menu && menu.contains(event.target)) return;

    window.location.assign(`/post-detail.html?id=${post.id}`);
  });

  // Click to add/edit page
  const editElement = postElement.querySelector('[data-id="edit"]');

  editElement.addEventListener('click', () => {
    window.location.assign(`/add-edit-post.html?id=${post.id}`);
  });

  // Click to remove item
  const removeBtn = postElement.querySelector(`[data-id="remove"]`);
  removeBtn.addEventListener('click', (e) => {
    console.log({ 1: e.target, 2: post.id });
    const customEvent = new CustomEvent('post-remove', {
      bubbles: true,
      detail: post,
    });

    removeBtn.dispatchEvent(customEvent);
  });

  return postElement;
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;
  // find postList
  const postListElement = document.getElementById(elementId);
  if (!postListElement) return;

  postListElement.textContent = '';
  postList.forEach((post) => {
    const postElement = createPostElement(post);
    postListElement.appendChild(postElement);
  });
}
