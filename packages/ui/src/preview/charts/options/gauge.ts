// import * as echarts from 'echarts'

const getGaugeOptions = (data: any, chartID: string) => {
  // let option
  let highlight = '#072F70'

  let demoData: any = [
    {
      name: '仪表盘1',
      value: 30,
      unit: '%',
      pos: ['55%', '60%'],
      range: [0, 100],
      // splitNum: 9,
    },
  ]
  if (data && chartID === 'default-gauge-1') {
    demoData[0].value = data?.value || 0
    demoData[0].name = data?.label || '仪表盘1'
  }

  let value = 0
  let name = '统计'
  if (data && chartID === 'default-gauge-2') {
    console.log('default-gauge-2:', data)
    value = data.value
    name = data.label
  }

  const item = demoData[0]

  const gaugeOptions = [
    {
      // backgroundColor: '#222939',
      chartID: 'default-gauge-1',
      series: [
        // 内侧指针、数值显示
        {
          name: item.name,
          type: 'gauge',
          center: item.pos,
          radius: '83%',
          startAngle: 225,
          endAngle: -45,
          min: item.range[0],
          max: item.range[1],
          axisLine: {
            show: true,
            lineStyle: {
              width: 5,
              color: [
                [0.3, '#00CDA5'],
                [0.7, '#0085F4'],
                [0.9, '#FD760D'],
                [1, '#D03050'],
              ],
            },
          },
          pointer: {
            show: true,
            length: '70%',
            itemStyle: {
              color: 'auto',
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: 0,
          },
          axisLabel: {
            show: 0,
          },
          detail: {
            show: true,
            offsetCenter: [0, '65%'],
            // textStyle: {
            fontSize: 20,
            color: 'inherit',
            // },
            // formatter: ['{value} ' + (item.unit || ''), '{name|' + item.name + '}'].join('\n'),
            rich: {
              name: {
                fontSize: 14,
                lineHeight: 25,
                color: '#ddd',
              },
            },
          },
          itemStyle: {
            // normal: {
            color: highlight,
            // },
          },
          title: {
            //标题
            show: true,
            offsetCenter: [0, 76], // x, y，单位px
            textStyle: {
              color: '#ddd',
              fontSize: 12, //表盘上的标题文字大小
              fontWeight: 400,
              fontFamily: 'PingFangSC',
            },
          },
          data: [
            {
              value: item.value,
              name: item.name,
            },
          ],
        },
        // 外围刻度
        {
          type: 'gauge',
          center: item.pos,
          radius: '50.33%', // 1行3个
          splitNumber: item.splitNum || 10,
          min: item.range[0],
          max: item.range[1],
          startAngle: 225,
          endAngle: -45,
          axisLine: {
            show: true,
            lineStyle: {
              width: 2,
              shadowBlur: 0,
              color: [
                [0.3, '#00CDA5'],
                [0.7, '#0085F4'],
                [0.9, '#FD760D'],
                [1, '#D03050'],
              ],
            },
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: highlight,
              width: 1,
            },
            length: 0,
            splitNumber: 10,
          },
          splitLine: {
            show: false,
            length: -14,
            lineStyle: {
              color: highlight,
            },
          },
          axisLabel: {
            distance: -20,
            // textStyle: {
            color: 'inherit',
            fontSize: '10',
            fontWeight: 'bold',
            // },
          },
          pointer: {
            show: 0,
          },
          detail: {
            show: 0,
          },
        },
      ],
    },
    {
      chartID: 'default-gauge-2',
      // backgroundColor: '#061740',
      title: {
        // text: '{a|' + value + '}{c|%}',
        text: '{a|' + value + '%}{c|\n' + name + '}',
        x: 'center',
        y: 'center',
        textStyle: {
          rich: {
            a: {
              fontSize: 20,
              color: '#29EEF3',
            },

            c: {
              fontSize: 12,
              color: '#fff',
              // padding: [5,0]
            },
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: '外圆环',
          radius: ['61%', '63%'],
          hoverAnimation: false,
          clockWise: false,
          itemStyle: {
            normal: {
              color: '#304867',
            },
          },
          label: {
            show: false,
          },
          data: [100],
        },
        {
          name: '吃猪肉频率',
          type: 'pie',
          radius: ['58%', '45%'],
          silent: true,
          clockwise: true,
          startAngle: 90,
          z: 0,
          zlevel: 0,
          label: {
            normal: {
              position: 'center',
            },
          },
          data: [
            {
              value: value,
              name: '',
              itemStyle: {
                normal: {
                  color: '#E74032',
                },
              },
            },
            {
              value: 100 - value,
              name: '',
              label: {
                normal: {
                  show: false,
                },
              },
              itemStyle: {
                normal: {
                  color: '#173164',
                },
              },
            },
          ],
        },
        {
          name: '',
          type: 'gauge',
          radius: '58%',
          center: ['50%', '50%'],
          startAngle: 0,
          endAngle: 359.9,
          splitNumber: 60,
          hoverAnimation: true,
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 60,
            lineStyle: {
              width: 15,
              color: '#061740',
            },
          },
          axisLabel: {
            show: false,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              opacity: 0,
            },
          },
          detail: {
            show: false,
          },
          data: [
            {
              value: 0,
              name: '',
            },
          ],
        },
        {
          type: 'pie',
          name: '内环',
          radius: ['40%', '42%'],
          hoverAnimation: false,
          clockWise: false,
          itemStyle: {
            normal: {
              color: '#304867',
            },
          },
          label: {
            show: false,
          },
          data: [100],
        },
      ],
    },
  ]

  return gaugeOptions
}

export { getGaugeOptions }
