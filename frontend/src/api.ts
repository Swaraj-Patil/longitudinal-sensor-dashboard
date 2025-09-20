import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 5000,
});

export const getParticipants = () => axiosInstance.get('/participants/')

export async function getDailySummariesAxios(participantId: number) {
  const resp = await axiosInstance.get('/summaries/daily/', {
    params: { participant_id: participantId }
  });
  return resp.data;
}
