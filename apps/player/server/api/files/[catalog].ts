import { getPublicFiles } from '../utils/getPublicFiles'

export default defineEventHandler(async (event) => {
  const catalog = getRouterParam(event, 'catalog')
  if (!catalog) throw createError({ statusCode: 400, message: '缺少 catalog 参数' })
  return await getPublicFiles(catalog)
})
