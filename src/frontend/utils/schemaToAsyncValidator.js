function getMessage(validity) {
  return Object.keys(validity.children)
    .filter(key => !validity.children[key].valid)
    .map(key => validity.children[key].message)
    .shift() || '';
}

export default function schemaToAsyncValidator(schemaConstructor) {
  return (values, dispatch, props) => {
    const schema = schemaConstructor(props);

    return schema.check(values)
      .then((validity) => {
        if (validity.valid) {
          return;
        }

        throw Object.keys(validity.children)
          .reduce((acc, key) => {
            const child = validity.children[key];

            if (!child.valid) {
              acc[key] = getMessage(child);
            }

            return acc;
          }, {});
      });
  };
}
