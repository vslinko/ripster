export function fieldError(form, key) {
  return form.validationMessagesVisible
    && form.validation.children[key].message
    || '';
}

export function formData(form) {
  const fieldsData = Object.keys(form.form)
    .reduce((acc, key) => (
      acc[`${key}Error`] = fieldError(form, key),
      acc
    ), {});

  return {
    ...form.form,
    ...form,
    ...fieldsData,
  };
}
