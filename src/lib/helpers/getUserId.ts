import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import path from 'path';

export default async function getUserId(
  customId: string,
): Promise<String> {
  try {
    return customId.split('_')[1]
  } catch (error: any) {
    return error
  }
}
