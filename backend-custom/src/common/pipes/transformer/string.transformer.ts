export function stringTransformer({ value }) {
  return (value + '').trim();
}

export function stringUpperTransformer({ value }) {
  return (value + '').trim().toUpperCase();
}
