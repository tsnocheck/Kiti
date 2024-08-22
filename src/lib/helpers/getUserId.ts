export default function getUserId(
  customId: string,
): string {
  return customId.split('_')?.[1];
}
