import * as echarts from 'echarts'

const getLineOptions = (data: any) => {
  // let label = data?.label || []
  // let value = data?.value || []
  let label = data?.label || ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
  let value = data?.value || ['233', 233, 200, 180, 199, 233, 210, 180]
  const options = [
    {
      chartID: 'default-line-1',
      // backgroundColor: '#101e44',
      grid: {
        top: 50,
        left: 20,
        right: 20,
        bottom: 10,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255,255,255,0)', // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: 'rgba(255,255,255,1)', // 100% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(255,255,255,0)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          // lineStyle: {
          // },
        },
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            formatter: '{value}',
            fontSize: 14,
            margin: 20,
            // textStyle: {
            color: '#7ec7ff',
            // },
          },
          axisLine: {
            color: '#243753',
            // lineStyle: {
            // },
          },
          splitLine: {
            show: false,
            color: '#243753',
            // lineStyle: {
            // },
          },
          axisTick: {
            show: false,
          },
          data: label,
        },
      ],
      yAxis: [
        {
          boundaryGap: false,
          type: 'value',
          name: '交易次数',
          axisLabel: {
            // textStyle: {
            color: '#7ec7ff',
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
            // },
          },
          nameTextStyle: {
            color: '#7ec7ff',
            fontSize: 12,
            lineHeight: 20,
          },
          splitLine: {
            show: false,
            color: '#243753',
            // lineStyle: {
            // },
          },
          axisLine: {
            show: true,
            color: '#283352',
            // lineStyle: {
            // },
          },
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '',
          type: 'line',
          smooth: true,
          showSymbol: false,
          symbolSize: 5,
          zlevel: 3,
          itemStyle: {
            color: '#19a3df',
            borderColor: '#a3c8d8',
          },
          normal: {
            width: 3,
            color: '#19a3df',
          },
          // lineStyle: {
          // },
          areaStyle: {
            // normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(88,255,255,0.2)',
                },
                {
                  offset: 0.8,
                  color: 'rgba(88,255,255,0)',
                },
              ],
              false
            ),
            // },
          },
          data: value,
        },
      ],
    },
  ]

  return options
}

export { getLineOptions }
