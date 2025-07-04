import { formatMoneyInput, unformatMoneyString } from './number-format.util';

describe('formatMoneyInput', () => {
  it('คืนเลขที่พิมพ์ ในกรณีที่พิมพ์เลขหลังค่าเริ่มต้นที่เป็น 0', () => {
    expect(formatMoneyInput('05', '0')).toBe('5');
  });

  it('คืนทศนิยม ในกรณีที่พิมพ์จุดทศนิยมหลังค่าเริ่มต้นที่เป็น 0', () => {
    expect(formatMoneyInput('0.', '0')).toBe('0.');
  });

  it('คืนเลขที่พิมพ์ ในกรณีที่พิมพ์เลขหน้าค่าเริ่มต้นที่เป็น 0', () => {
    expect(formatMoneyInput('10', '0')).toBe('1');
  });

  it('คืนเลขทศนิยม 2 ตำแหน่งในกรณีที่พิมพ์เลขทศนิยมเกิน 2 ตำแหน่ง', () => {
    expect(formatMoneyInput('1234.5678', '1234.5678')).toBe('1,234.56');
  });

  it('คืนเลขที่มี , ในกรณีที่เลขถึงหลักพัน', () => {
    expect(formatMoneyInput('1000000', '1000000')).toBe('1,000,000');
  });

  it('คืนเลขที่ถูกต้องในกรณีที่เลขเกินหลักพันและมีทศนิยม', () => {
    expect(formatMoneyInput('1000000.55', '1000000.55')).toBe('1,000,000.55');
  });

  it('คืนเลข 0 ในกรณีที่ลบทุกอย่างใน input', () => {
    expect(formatMoneyInput('', '')).toBe('0');
  });
});

describe('unformatMoneyString', () => {
  it('แปลงเลขมี comma เป็นตัวเลข', () => {
    expect(unformatMoneyString('1,234')).toBe(1234);
  });

  it('แปลงเลขมี comma และจุดทศนิยม', () => {
    expect(unformatMoneyString('1,234.56')).toBe(1234.56);
  });

  it('คืน 0 ถ้าเป็น string ว่าง', () => {
    expect(unformatMoneyString('')).toBe(0);
  });

  it('คืน 0 ถ้าไม่ใช่ตัวเลข', () => {
    expect(unformatMoneyString('abc')).toBe(0);
  });
});
