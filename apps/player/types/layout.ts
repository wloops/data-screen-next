export interface Page {
  name: string
  id: string
  have_tabs?: boolean
  tabs?: Tab[]
  fecth?: any[]
}

export interface Tab {
  id: string
  name: string
}

export interface LayoutConfig {
  project_name: string
  layout: {
    direction: string
    style: {
      margin: string
      gap: string
      padding: string
    }
    background: {
      color: string
      image: string
    }
  }
  pages: Page[]
  fecth?: any
}
