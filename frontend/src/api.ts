import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export const getParticipants = () => axiosInstance.get('/participants/')

export async function getDailySummariesAxios(participantId: number) {
  const resp = await axiosInstance.get('/summaries/daily/', {
    params: { participant_id: participantId }
  });
  return resp.data;
}
