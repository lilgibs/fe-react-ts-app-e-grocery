export function formatRupiah(input: number) {
  const number = Number(input);
  return number.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}