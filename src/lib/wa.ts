import axios from 'axios';
import { connectToDatabase } from './db';
import WaInit from '@/models/waInit';

export default async function waSend(phone: string, msg: string) {
  try {
    await connectToDatabase();
    const waInit = await WaInit.findOne();
    if (!waInit) {
      console.log('WhatsApp credentials not configured in DB.');
      return { data: { success: false, message: 'Not configured' } };
    }

    const { instance_id, access_token } = waInit;
    const api = 'https://taykom.com/api';

    const cleanPhone = phone.replace(/\D/g, '');

    const { data } = await axios.post(`${api}/send`, {
      number: cleanPhone,
      type: 'text',
      message: msg,
      instance_id,
      access_token,
    });

    return { data };
  } catch (error: any) {
    console.error('WhatsApp Send Error:', error?.message);
    return { data: { error: error?.message } };
  }
}
