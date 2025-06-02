export function emailTransform({ value }) {
  return (value + '').trim().toLowerCase();
}
