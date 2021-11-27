import postApi from './api/postsApi';
import {
  initPagination,
  initSearch,
  renderPagination,
  renderPostList,
  showModal,
  toastify,
} from './utils';
// to use func fromNow

async function handelFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);
  if (filterName) url.searchParams.set(filterName, filterValue);
  if (filterName === 'title_like') url.searchParams.set('_page', 1);
  history.pushState({}, '', url);

  try {
    // fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);
    // re-render post list
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('error', error);
  }
}

// function handelClick() {
//   const agree = document.querySelector('[data-modal="agree"]');
//   let count = 0;
//   agree.addEventListener('click', async () => {
//     console.log('Remove');
//     count++;
//     console.log('count: ' + count);
//   });
// }

function registerRemoveItem() {
  try {
    document.addEventListener('post-remove', async (event) => {
      // const agree = document.querySelector('[data-modal="agree"]');
      // const noAgree = document.querySelector('[data-modal="noAgree"]');
      const post = event.detail;
      if (window.confirm()) {
        await postApi.remove(post.id);
        await handelFilterChange();
        toastify.success('Remove successfully');
      }

      // console.log('Post-remove', event.detail);
      // // Show modal
      showModal('modal');
      // // Choose option remove item

      // // Choose option cancel remove item

      // noAgree.addEventListener('click', () => {
      //   agree.removeEventListener('click', handelClick);
      // });
    });
  } catch (error) {
    console.log('Error remove item is: ', error.message);
  }
}

(async () => {
  // set default query params
  const url = new URL(window.location);

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12);

  history.pushState({}, '', url);
  const queryParams = url.searchParams;

  registerRemoveItem();
  // handel search title
  initSearch({
    elementId: 'searchInput',
    defaultParams: queryParams,
    onChange: (value) => handelFilterChange('title_like', value),
  });
  // handel init pagination
  initPagination({
    elementId: 'pagination',
    defaultParams: queryParams,
    onChange: (page) => handelFilterChange('_page', page),
  });
  // attach to detail page

  try {
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('Fail to fetch all post', error);
  }
})();
