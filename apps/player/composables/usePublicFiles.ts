export const usePublicFiles = (catalog: string) => {
  return useFetch(`/api/files/${catalog}`)
}
