export default function wrapValidate(validate) {
  return (data) => {
    const validity = validate(data);

    return Object.keys(validity.children)
      .reduce((acc, key) => {
        const child = validity.children[key];

        if (!child.valid) {
          acc[key] = child.message;
        }

        return acc;
      }, {});
  };
}
