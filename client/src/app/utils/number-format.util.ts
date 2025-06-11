export function formatMoneyInput(
  inputValue: string,
  currentValue: string
): string {
  let rawValue = inputValue;

  // ตัวอย่าง rawValue === "05" -> rawValue = "5"; แต่ "0." ให้คงไว้
  if (rawValue.startsWith('0') && !rawValue.startsWith('0.')) {
    rawValue = rawValue.replace(/^0+/, '');
  }

  // ตัวอย่าง discount === "0" และ rawValue === "10" -> rawValue = "1"
  if (currentValue === '0' && rawValue[0] !== '0') {
    rawValue = rawValue[0];
  }

  // จำกัดทศนิยม 2 ตำแหน่ง
  let integerPart = rawValue;
  let decimalPart = '';

  if (rawValue.includes('.')) {
    [integerPart, decimalPart] = rawValue.split('.');
    decimalPart = decimalPart.slice(0, 2);
  }

  // ใส่ , ในกรณีที่เลขถึงหลักพัน
  if (integerPart.length > 3) {
    integerPart = integerPart.replace(/,/g, '');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const formatted = decimalPart
    ? `${integerPart}.${decimalPart}`
    : integerPart && rawValue.includes('.')
    ? `${integerPart}.`
    : integerPart
    ? integerPart
    : '0';

  return formatted;
}
