export async function copyToClipboard(value: string): Promise<boolean> {
  if (!navigator.clipboard) {
    return false;
  }
  await navigator.clipboard.writeText(value);
  return true;
}
