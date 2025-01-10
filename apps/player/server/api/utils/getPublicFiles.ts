import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

export const getPublicFiles = async (catalog: string) => {
  const pagesDir = join(process.cwd(), `public/${catalog}`)
  try {
    const files = await readdir(pagesDir)
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => ({
        id: file.replace('.json', ''),
        path: `/${catalog}/${file}`,
      }))
  } catch (err) {
    console.error('读取页面配置失败:', err)
    return []
  }
}
