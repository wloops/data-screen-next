import { defaultOptions } from '../preview/charts' // 默认option
import * as echarts from 'echarts'
// lodash-es 深拷贝
import { cloneDeep } from 'lodash-es'

export function useCommonChart() {
  let chartOption = {}
  async function getOption(type: string, chartID: string, data: any, myOption?: any) {
    // 读取默认配置文件，根据type来选择对应的配置项
    const chartOptions = myOption ? myOption : defaultOptions[type].option(data, chartID)
    // console.log('chartOptions::', chartOptions)
    // 深拷贝配置项
    const newOption = cloneDeep(chartOptions)
    if (!chartID) {
      chartOption = newOption[0]
      return chartOption
    }
    // 根据chartID读取数据
    newOption.forEach((option: any) => {
      if (option.chartID === chartID) {
        chartOption = option
      }
    })

    return chartOption
  }

  async function init(dom: any, type: string, chartID: string, data: any, myOption?: any) {
    // getLayerBgs()

    // 初始化echarts实例
    const chart = echarts.init(dom)
    // 获取配置项
    const option = await getOption(type, chartID, data, myOption)
    // console.log('data类型::', typeof data)
    // const otherType = ['gauge']
    // if (data) {
    //   const { value, label } = data
    //   if (!otherType.includes(type)) {
    //     option.series[0].data = value
    //     option.xAxis[0].data = label
    //   } else {
    //     option.series[0].data[0].value = value
    //     option.series[0].data[0].name = label
    //   }
    // }
    console.log('option new data::', data)
    console.log('option new::', chartID, option)
    // 合并配置项
    // option = { ...option, series: [] }
    // 绘制图表
    console.log('chart::', chart)
    option && chart.setOption(option, true)
    // 图表自适应宽度
    window.addEventListener('resize', function () {
      chart.resize()
    })
    // return chart
  }

  // function determineIfDataIsAvailable(data: any) {
  //   // 判断data是object还是数组,分开判断
  //   if (typeof data === 'object') {
  //     return data.value && data.label && data.value.length > 0 && data.label.length > 0
  //   } else if (Array.isArray(data)) {
  //     return data.length > 0 && data[0].value && data[0].label && data[0].value.length > 0 && data[0].label.length > 0
  //   }
  // }

  return { chartOption, getOption, init }
}
const getLayerBgs = function () {}
