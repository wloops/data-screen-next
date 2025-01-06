export interface Tab {
  id: string
  name: string
}

export interface Page {
  id: string
  name: string
  have_tabs: boolean
  tabs?: Tab[] | null
  fecth?: Array<{
    desc: string
    hand: string
    mode: string
    params: Record<string, any>
  }>
}

export interface LayoutConfig {
  project_name: string
  pages: Page[]
  layout: {
    direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    style: {
      margin: string
      gap?: string
      padding?: string
    }
    background: {
      color: string
      image: string
    }
  }
}
