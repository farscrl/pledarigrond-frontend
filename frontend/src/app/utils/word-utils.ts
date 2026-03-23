export function formatFormVariants(input?: string): string {
  if (!input) {
    return '';
  }
  return input.split(/[,|\n]/).map(e => e.trim()).join('<br>');
}
