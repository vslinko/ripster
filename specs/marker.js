export default function marker(value) {
  return `[data-marker="${value}"]`;
}

export function createMarker(prefix) {
  return (suffix) => marker(`${prefix}-${suffix}`);
}
