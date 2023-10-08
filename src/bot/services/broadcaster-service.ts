import { apiClient } from '../api-client';

export interface BroadcasterResponse {
  broadcasters: Array<{ id: string; name: string }>;
}

const getBroadcasters = async (): Promise<BroadcasterResponse> => {
  return (await apiClient.get<BroadcasterResponse>('/broadcasters')).data;
};

export default { getBroadcasters };
