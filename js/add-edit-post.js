import postApi from './api/postsApi';
import { initFormValue } from './utils';
import { toastify } from './utils';

function removeUnUseCode(formValue) {
  const formData = { ...formValue };
  //  delete key image
  if (formData.imageSource === 'picsum') delete formData.image;
  else delete formData.imageUrl;
  // delete key imageSource
  delete formData.imageSource;
  // delete key id when it undefined
  if (!formData.id) delete formData.id;

  return formData;
}

function jsonToFormData(formValue) {
  const formData = new FormData();
  for (const key in formValue) {
    formData.set(key, formValue[key]);
  }
  return formData;
}

async function handelFilterChange(formValue) {
  const payload = removeUnUseCode(formValue);
  const formData = jsonToFormData(payload);
  console.log(formData.get('title'));
  try {
    const savedForm = formValue.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);
    toastify.success('Success post ui');
    // setTimeout(() => {
    //   window.location.assign(`/post-detail.html?id=${savedForm.id}`);
    // }, 1000);
  } catch (error) {
    console.log('Fail to update/add post ', error);
    toastify.error(`Error is: ${error.message}`);
  }
}

(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    const defaultValue = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };

    initFormValue({
      postId: 'postForm',
      defaultValue,
      onSubmit: handelFilterChange,
    });
  } catch (error) {
    console.log('fail to fetch post by id ', error);
  }
})();
