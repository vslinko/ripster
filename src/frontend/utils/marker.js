export default function marker(value) {
  if (process.env.NODE_ENV !== 'production') {
    return {
      'data-marker': value,
    };
  }

  return {};
}

export function createMarker(prefix) {
  return (suffix) => marker(`${prefix}-${suffix}`);
}
