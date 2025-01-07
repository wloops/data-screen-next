export interface Page {
  name: string
  id: string
  have_tabs?: boolean
  style?: {
    icon?: string
    color?: string
  }
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
    main: {
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
    header: {
      background: {
        color: string
        image: string
      }
    }
  }
  pages: Page[]
  fecth?: any
}
