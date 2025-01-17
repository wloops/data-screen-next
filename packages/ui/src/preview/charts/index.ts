import { getLineOptions } from './options/line'
import { getPieOptions } from './options/pie'
import { getBarOptions } from './options/bar'
// import { scatterOptions } from './options/scatter'
import { getGraphOptions } from './options/graph'
import { getGaugeOptions } from './options/gauge'

export const defaultOptions: any = {
  line: {
    option: getLineOptions,
  },
  bar: {
    option: getBarOptions,
  },
  pie: {
    option: getPieOptions,
  },
  // radar: {
  //   option: getRadarOptions,
  // },
  // scatter: {
  //   option: scatterOptions,
  // },
  graph: {
    option: getGraphOptions,
  },
  gauge: {
    option: getGaugeOptions,
  },
}
