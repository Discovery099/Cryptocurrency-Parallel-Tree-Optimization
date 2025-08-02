import { useQuery } from "@tanstack/react-query";

export function useMiningData() {
  return useQuery({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}
