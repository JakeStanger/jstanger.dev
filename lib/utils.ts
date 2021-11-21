export function css(...classes: any[]) {
  return classes.filter(c => c).join(' ');
}