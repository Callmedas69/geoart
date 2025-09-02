import { useQuery } from '@tanstack/react-query'
import { resolveBasename, getBasenameAvatar } from '../utils/resolver'

export function useBasename(address: `0x${string}` | undefined) {
  return useQuery({
    queryKey: ['basename', address],
    queryFn: async () => {
      if (!address) return null
      
      const basename = await resolveBasename(address)
      if (!basename) return null
      
      const avatar = await getBasenameAvatar(basename)
      
      return {
        basename,
        avatar
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })
}