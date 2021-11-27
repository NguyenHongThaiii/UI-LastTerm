import { applyValue, applyImage, createElement, randomNumber } from './common';
import * as yup from 'yup';

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function setValueDefaultForm(form, defaultValue) {
  applyValue(form, 'input[name="title"]', defaultValue.title);
  applyValue(form, 'input[name="author"]', defaultValue.author);
  applyValue(form, 'textarea[name="description"]', defaultValue.description);

  applyValue(form, 'input[name="imageUrl"]', defaultValue.imageUrl);
  applyImage(document, '#postHeroImage', defaultValue.imageUrl);
}

function getFormValues(form) {
  if (!form) return;

  const formValues = {};
  // S1: get value using array
  //   ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name="${name}"]`);
  //     if (field) formValues[name] = field.value;
  //   });

  // S2: get value using new FormData
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  console.log('data', { data, formValues });

  return formValues;
}

function getFormYup() {
  return yup.object().shape({
    title: yup.string().required('Please enter field title'),
    author: yup
      .string()
      .required('Please enter field author')
      .test(
        'Should at least at two word',
        'The title at least two word',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please enter field image url')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup.string().required('Please achieved field imageUrl').url('This field is url'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required field imageUrl', 'Invalid image upload', (value) => Boolean(value?.name))
        .test('required valid size file', 'Size your file is large(3MB)', (value) => {
          const MAX_SIZE = 3 * 1024 * 1024;
          return value.size <= MAX_SIZE;
        }),
    }),
  });
}
function setFormValueValidate(form, name, error) {
  if (!form) return;

  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    createElement(element.parentElement, '.invalid-feedback', error);
  }
}

async function initValidateOnChange(form) {
  ['title', 'author'].forEach((name) => {
    const filed = form.querySelector(`[name="${name}"]`);
    if (filed) {
      filed.addEventListener('input', (e) =>
        validateElement(form, { [name]: e.target.value }, name)
      );
    }
  });
}

async function validateElement(form, formValues, name) {
  try {
    setFormValueValidate(form, name, '');
    const schema = getFormYup();
    console.log('formValues', formValues);
    await schema.validateAt(name, formValues);
    console.log('success');
  } catch (error) {
    console.log(error);
    setFormValueValidate(form, name, error.message);
  }

  const field = document.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}
async function initFormValidate(form, formValues) {
  try {
    // reset prev error
    ['title', 'author', 'imageUrl', 'image'].forEach((name) =>
      setFormValueValidate(form, name, '')
    );
    const schema = getFormYup();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      const errorLog = {};
      for (const validate of error.inner) {
        const name = validate.path;
        if (errorLog[name]) continue;

        setFormValueValidate(form, name, validate.message);
        errorLog[name] = true;
      }
    }
  }

  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function showLoading() {
  const buttonSave = document.getElementById('btnSave');
  if (buttonSave) {
    buttonSave.disabled = true;
    buttonSave.textContent = 'Saving...';
  }
}

function hideLoading() {
  const buttonSave = document.getElementById('btnSave');
  if (buttonSave) {
    buttonSave.disabled = false;
    buttonSave.textContent = 'Save';
  }
}

function randomImage(form) {
  const randomBtn = document.getElementById('postChangeImage');
  if (!randomBtn) return;

  randomBtn.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;
    applyValue(form, 'input[name="imageUrl"]', imageUrl);
    applyImage(document, '#postHeroImage', imageUrl);
  });
}

function renderImageSource(form, selector, value) {
  const imageSourceList = form.querySelectorAll(`[data-id="${selector}"]`);
  if (!imageSourceList) return;
  imageSourceList.forEach((item) => {
    item.hidden = item.dataset.value !== value;
  });
}

function initImageSource(form) {
  const controlList = form.querySelectorAll('[name="imageSource"]');
  if (!controlList) return;

  controlList.forEach((control) => {
    control.addEventListener('change', (event) => {
      renderImageSource(form, 'imageSource', event.target.value);
    });
  });
}

function initPreviewImage(form) {
  const inputFile = form.querySelector('#inputUploadImage');
  if (inputFile) {
    inputFile.addEventListener('change', (event) => {
      const file = URL.createObjectURL(event.target.files[0]);
      applyImage(document, '#postHeroImage', file);
      validateElement(
        form,
        { imageSource: ImageSource.UPLOAD, image: event.target.files[0] },
        'image'
      );
    });
  }
}

export function initFormValue({ postId, defaultValue, onSubmit }) {
  const postForm = document.getElementById(postId);
  if (!postForm) return;
  let saving = false;
  // set default value
  setValueDefaultForm(postForm, defaultValue);
  randomImage(postForm);
  initImageSource(postForm);
  initPreviewImage(postForm);
  initValidateOnChange(postForm);
  // handel onSubmit
  postForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (saving) return;
    showLoading();
    saving = true;
    const formValues = getFormValues(postForm);
    formValues.id = defaultValue.id;
    const isValid = await initFormValidate(postForm, formValues);
    if (isValid) await onSubmit?.(formValues);

    hideLoading();
    saving = false;
  });
}
