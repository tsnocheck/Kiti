import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import path from 'path';

export default async function uploadImage(
  imageUrl: string,
  clientId: string = 'f23df31387ccf2c',
  title: string = 'Simple upload',
  description: string = 'This is a simple image upload in Imgur'
): Promise<void> {
  try {
    const response: AxiosResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const imageStream = response.data;

    const form = new FormData();
    form.append('image', imageStream, path.basename(imageUrl));
    form.append('title', title);
    form.append('description', description);

    const config = {
      method: 'post' as const,
      url: 'https://api.imgur.com/3/image',
      headers: {
        'Authorization': `Client-ID ${clientId}`,
        ...form.getHeaders()
      },
      data: form,
      maxBodyLength: Infinity
    };

    const uploadResponse: AxiosResponse = await axios(config);
    return uploadResponse.data.data.link
  } catch (error: any) {
    return error
  }
}
