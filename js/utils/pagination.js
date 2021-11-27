export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;
  const { _page, _limit, _totalRows } = pagination;
  // calc total pages
  const totalPages = Math.ceil(_totalRows / _limit);
  // save page & total pages to ul Pagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;
  // handel disabled btn prev & next
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  // handel click number page

  ulPagination.addEventListener('click', (event) => {
    event.preventDefault();
    // const { target } = event.target;
    if (!event.target.dataset.pageNumber) return;
    console.log(event.target);

    const page = Number.parseInt(event.target.dataset.pageNumber);
    onChange(page);
  });

  // handel click prev button
  const prevBtn = ulPagination.firstElementChild.firstElementChild;
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const page = Number.parseInt(ulPagination.dataset.page);

    if (page > 1) onChange(page - 1);
  });
  // handel click next button

  const nextBtn = ulPagination.lastElementChild.lastElementChild;
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const page = Number.parseInt(ulPagination.dataset.page);
    const totalPages = ulPagination.dataset.totalPages;

    if (page < totalPages) onChange(page + 1);
  });
}
