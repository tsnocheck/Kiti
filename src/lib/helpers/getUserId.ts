export default async function getUserId(
  customId: string,
): Promise<String> {
  try {
    return customId.split('_')[1]
  } catch (error: any) {
    return error
  }
}
