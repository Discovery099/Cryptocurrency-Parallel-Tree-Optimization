import { useQuery } from "@tanstack/react-query";

export function useGPUData() {
  return useQuery({
    queryKey: ['/api/gpus'],
    refetchInterval: 3000, // Refetch every 3 seconds for real-time GPU monitoring
  });
}
