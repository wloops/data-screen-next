import * as echarts from 'echarts'

const getBarOptions = (data: any) => {
  console.log('getBarOptions', data)
  let legendData = ['成功笔数', '失败笔数', '成功趋势']
  let yAxisData = { leftName: '交易次数', rightName: '百分比(%)' }
  let others: any = {}
  if (data && data.other) {
    others = data.other
  }
  if (others && others.legendData) {
    legendData = others.legendData
  }
  if (others && others.yAxisData) {
    yAxisData = others.yAxisData
  }

  let xdata = data?.xdata || []
  let data1 = data?.data1 || []
  let data2 = data?.data2 || []
  let data3 = data?.data3 || []
  // let xdata = data?.xdata || ['8/1', '8/2', '8/3', '8/4', '8/5', '8/6', '8/7']
  // let data1 = data?.data1 || [10000, 20000, 30000, 40000, 50000, 60000, 70000]
  // let data2 = data?.data2 || [2000, 4000, 6000, 8000, 10000, 12000, 14000]
  // let data3 = data?.data3 || [80, 85, 90, 95, 100, 105, 110]
  const options = [
    {
      chartID: 'default-bar-1',
      // title: {
      //   show: true,
      //   text: '2019年销售水量和主营业务收入对比',
      //   textStyle: {
      //     align: 'center',
      //     color: '#fff',
      //     fontSize: 20,
      //   },
      //   top: '3%',
      //   left: '10%',
      // },
      // backgroundColor: '#0f375f',
      grid: {
        top: '35%',
        bottom: '10%', //也可设置left和right设置距离来控制图表的大小
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
          },
        },
      },
      legend: {
        data: legendData,
        top: '15%',
        itemGap: 10,
        itemWidth: 15,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
          color: '#ffffff',
        },
      },
      xAxis: {
        data: xdata,
        axisLine: {
          show: true, //隐藏X轴轴线
          lineStyle: {
            color: '#4DAAFF',
          },
        },
        axisTick: {
          show: true, //隐藏X轴刻度
        },
        axisLabel: {
          show: true,
          fontSize: 14,
          // textStyle: {
          color: '#fff', //X轴文字颜色
          // },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: yAxisData.leftName || '',
          nameTextStyle: {
            color: '#fff',
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#FFFFFF',
            },
          },
          axisLabel: {
            show: true,
            fontSize: 12,
            formatter: (value: number) => {
              if (value >= 100000000) {
                return Number((value / 100000000).toFixed(2)) + '亿'
              } else if (value >= 10000000) {
                return Number((value / 10000000).toFixed(2)) + '千万'
              } else if (value >= 1000000) {
                return Number((value / 1000000).toFixed(2)) + '百万'
              } else if (value >= 100000) {
                return Number((value / 100000).toFixed(2)) + '十万'
              } else if (value >= 10000) {
                return Number((value / 10000).toFixed(2)) + '万'
              } else {
                return value
              }
            },
            // textStyle: {
            color: '#fff',
            // },
          },
        },
        {
          type: 'value',
          name: yAxisData.rightName || '',
          nameTextStyle: {
            color: '#fff',
          },
          position: 'right',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            formatter: `{value}`, //右侧Y轴文字显示
            // textStyle: {
            color: '#fff',
            // },
          },
        },
        {
          type: 'value',
          gridIndex: 0,
          min: 50,
          max: 100,
          splitNumber: 8,
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitArea: {
            show: false,
            areaStyle: {
              color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)'],
            },
          },
        },
      ],
      series: [
        {
          name: legendData[0],
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            // normal: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#008BFF',
              },
              {
                offset: 1,
                color: '#4693EC',
              },
            ]),
            // },
          },
          data: data1,
        },
        {
          name: legendData[1],
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            // normal: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#FD740D',
              },
              {
                offset: 1,
                color: '#B78063',
              },
            ]),
            // },
          },
          data: data2,
        },
        {
          name: legendData[2],
          type: 'line',
          yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
          smooth: false, //平滑曲线显示
          showAllSymbol: true, //显示所有图形。
          symbol: 'circle', //标记的图形为实心圆
          symbolSize: 8, //标记的大小
          itemStyle: {
            //折线拐点标志的样式
            color: '#009B8D',
          },
          lineStyle: {
            color: '#009B8D',
          },
          areaStyle: {
            color: 'rgba(5,140,255, 0.2)',
          },
          data: data3,
        },
      ],
    },
    {
      chartID: 'default-bar-2',
      // title: {
      //   show: true,
      //   text: '2019年销售水量和主营业务收入对比',
      //   textStyle: {
      //     align: 'center',
      //     color: '#fff',
      //     fontSize: 20,
      //   },
      //   top: '3%',
      //   left: '10%',
      // },
      // backgroundColor: '#0f375f',
      grid: {
        top: '35%',
        bottom: '10%', //也可设置left和right设置距离来控制图表的大小
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
          },
        },
      },
      legend: {
        data: legendData,
        top: '15%',
        itemGap: 10,
        itemWidth: 15,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
          color: '#ffffff',
        },
      },
      xAxis: {
        data: xdata,
        axisLine: {
          show: true, //隐藏X轴轴线
          lineStyle: {
            color: '#4DAAFF',
          },
        },
        axisTick: {
          show: true, //隐藏X轴刻度
        },
        axisLabel: {
          show: true,
          fontSize: 14,
          // textStyle: {
          color: '#fff', //X轴文字颜色
          // },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: yAxisData.leftName || '',
          nameTextStyle: {
            color: '#fff',
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#FFFFFF',
            },
          },
          axisLabel: {
            show: true,
            fontSize: 12,
            formatter: (value: number) => {
              if (value >= 100000000) {
                return Number((value / 100000000).toFixed(2)) + '亿'
              } else if (value >= 10000000) {
                return Number((value / 10000000).toFixed(2)) + '千万'
              } else if (value >= 1000000) {
                return Number((value / 1000000).toFixed(2)) + '百万'
              } else if (value >= 100000) {
                return Number((value / 100000).toFixed(2)) + '十万'
              } else if (value >= 10000) {
                return Number((value / 10000).toFixed(2)) + '万'
              } else {
                return value
              }
            },
            // textStyle: {
            color: '#fff',
            // },
          },
        },
        {
          type: 'value',
          name: yAxisData.rightName || '',
          nameTextStyle: {
            color: '#fff',
          },
          position: 'right',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            formatter: `{value}`, //右侧Y轴文字显示
            // textStyle: {
            color: '#fff',
            // },
          },
        },
        {
          type: 'value',
          gridIndex: 0,
          min: 50,
          max: 100,
          splitNumber: 8,
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitArea: {
            show: false,
            areaStyle: {
              color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)'],
            },
          },
        },
      ],
      series: [
        {
          name: legendData[0],
          type: 'bar',
          barWidth: 15,
          itemStyle: {
            // normal: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#008BFF',
              },
              {
                offset: 1,
                color: '#4693EC',
              },
            ]),
            // },
          },
          data: data1,
        },
        {
          name: legendData[1],
          type: 'bar',
          barWidth: 15,
          itemStyle: {
            // normal: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#FD740D',
              },
              {
                offset: 1,
                color: '#B78063',
              },
            ]),
            // },
          },
          data: data2,
        },
      ],
    },
  ]
  return options
}

export { getBarOptions }
