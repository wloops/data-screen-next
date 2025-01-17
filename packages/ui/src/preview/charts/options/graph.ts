// timer = setInterval(draw, 200);
function getGraphOptions(data: any) {
  console.log('getGraphOptions', data?.data)
  let color = ['#ffffff', 'rgb( 54, 255, 246, .8)', 'rgb(252, 198, 41, .8)', 'rgb(51, 224, 115, .8)', 'rgb(232, 64, 51, .8)']
  let oneArr = [
    {
      // name: '数据统一平台',
      type: 0,
      symbol: 'path://M2 22h32v-8H2Zm8-5h14v2H10Zm-4 0h2v2H6Z M32 4H4a2 2 0 0 0-2 2v6h32V6a2 2 0 0 0-2-2M8 9H6V7h2Zm16 0H10V7h14Z M2 30a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-6H2Zm8-3h14v2H10Zm-4 0h2v2H6Z',
      symbolSize: 85,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#28B5CF', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#4AAAFF', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    },
  ]
  let erArr = data?.data ? data?.data : []
  // [
  //     {
  //       name: '数据库01',
  //       type: 1,
  //     },
  //     {
  //       name: '数据库02',
  //       type: 3,
  //     },
  //     {
  //       name: '密码机01',
  //       type: 3,
  //     },
  //     {
  //       name: '密码机02',
  //       type: 1,
  //     },
  //     {
  //       name: '服务器01',
  //       type: 4,
  //     },
  //     {
  //       name: '服务器02',
  //       type: 2,
  //     },
  //   ]
  console.log('erArr:', data?.data)
  // 合并array

  // let allArr =  oneArr.concat(erArr);
  let allArr = [...oneArr, ...erArr]
  console.log('allArr:', allArr)
  let dataArr: any = []
  // 点
  allArr.forEach((el, ind) => {
    if (el.type > 0) {
      el.symbolSize = 25
      el.symbol =
        'path://M33.91 18.47L30.78 8.41A2 2 0 0 0 28.87 7H7.13a2 2 0 0 0-1.91 1.41L2.09 18.48a2 2 0 0 0-.09.59V27a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-7.94a2 2 0 0 0-.09-.59M8.92 25h-1.8v-3h1.8Zm5 0h-1.8v-3h1.8Zm5 0h-1.8v-3h1.8Zm5 0H22.1v-3h1.8Zm5 0H27.1v-3h1.8ZM31 19.4H5V18h26Z'
      el.itemStyle = {
        color: color[el.type],
      }
    }
    el.label = {
      normal: {
        show: true,
        position: 'bottom',
        distance: 10,
        color: color[el.type],
      },
    }
  })

  // 圆形分区
  function group(arr: any, r: number) {
    const newArray: any = []
    const { length: arLen } = arr
    arr.forEach((e: any, ind: number) => {
      // 按角度均匀分布
      const ang = 90 - Number((360 / arLen).toFixed(2)) * (ind + 1)
      const x = Number(Math.cos((ang * Math.PI) / 180).toFixed(2)) * r
      const y = Number(Math.sin((ang * Math.PI) / 180).toFixed(2)) * r
      const x1 = Number(Math.cos((ang * Math.PI) / 180).toFixed(2)) * (r - 5)
      const y1 = Number(Math.sin((ang * Math.PI) / 180).toFixed(2)) * (r - 5)
      const x0 = Number(Math.cos((ang * Math.PI) / 180).toFixed(2)) * (r - 30)
      const y0 = Number(Math.sin((ang * Math.PI) / 180).toFixed(2)) * (r - 30)
      e.value = [x.toFixed(2), y.toFixed(2)]
      e.twoPoint = [
        [x1.toFixed(2), y1.toFixed(2)],
        [x0.toFixed(2), y0.toFixed(2)],
      ]
      newArray.push(e)
    })
    return newArray
  }

  // 线配置
  function linesConfig(arr: any) {
    const [dataArr, targetCoord]: any = [[], [0, 0]]
    arr.forEach((el: any) => {
      function getFormatItem(start: number, end: number) {
        let item = [
          { coord: el.twoPoint[start] }, // 起点
          {
            coord: el.twoPoint[end],
            lineStyle: {
              color: color[el.type],
              curveness: el.type === 3 ? 0.1 : 0,
            },
            effect: {
              color: color[el.type],
            },
          }, // 终点
        ]
        return item
      }
      switch (el.type) {
        case 0:
          dataArr.push(getFormatItem(0, 0))
          break
        case 1:
          // dataArr.push(getFormatItem(0, 1));
          dataArr.push(getFormatItem(1, 0))
          break
        case 2:
          dataArr.push(getFormatItem(1, 0))
          break
        case 3:
          dataArr.push(getFormatItem(0, 1))
          dataArr.push(getFormatItem(1, 0))
          break
        case 4:
          dataArr.push(getFormatItem(1, 0))
          break
      }
    })
    return dataArr
  }

  // 点分布
  oneArr = group(oneArr, 0)
  erArr = group(erArr, 40)
  // twoArr = group(twoArr, -50);

  allArr = [...oneArr, ...erArr]
  // 线坐标和配置
  dataArr = linesConfig(allArr)

  function generateData(totalNum: number, bigvalue: number, smallvalue: number, color: string) {
    let dataArr: any = []
    for (var i = 0; i < totalNum; i++) {
      if (i % 2 === 0) {
        dataArr.push({
          name: (i + 1).toString(),
          value: bigvalue,
          itemStyle: {
            normal: {
              color: color,
              borderWidth: 0,
            },
          },
        })
      } else {
        dataArr.push({
          name: (i + 1).toString(),
          value: smallvalue,
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)',
              borderWidth: 0,
            },
          },
        })
      }
    }
    return dataArr
  }

  let dolitData = generateData(100, 25, 20, 'rgb(126,190,255,.5)')
  // let threeData = generateData(6, 40, 10, '#2dc0c9');
  // const disruptionsX = 'path://M128 24a104 104 0 0 0 0 208a8 8 0 0 0 5-14.23c-1.12-.91-20.88-17.32-31.06-49.77h26a8 8 0 0 0 0-16H98.08a140.2 140.2 0 0 1 0-48h59.88a138 138 0 0 1 2.04 24a8 8 0 0 0 16 0a155 155 0 0 0-1.84-24h38.51a87.6 87.6 0 0 1 3.33 24a8 8 0 0 0 16 0A104.11 104.11 0 0 0 128 24m-20.41 18.4A135.3 135.3 0 0 0 85.29 88H49.63a88.29 88.29 0 0 1 57.96-45.6m0 171.2a88.29 88.29 0 0 1-58-45.6h35.7a135.3 135.3 0 0 0 22.3 45.6M81.84 152H43.33a88.15 88.15 0 0 1 0-48h38.51a157.4 157.4 0 0 0 0 48M102 88a115.1 115.1 0 0 1 26-45a115.3 115.3 0 0 1 26 45Zm68.75 0a135.3 135.3 0 0 0-22.3-45.6a88.29 88.29 0 0 1 58 45.6Zm50.95 85.66L203.31 192l18.35 18.34a8 8 0 0 1-11.32 11.32L192 203.31l-18.34 18.35a8 8 0 0 1-11.32-11.32L180.69 192l-18.35-18.34a8 8 0 0 1 11.32-11.32L192 180.69l18.34-18.35a8 8 0 0 1 11.32 11.32Z'

  function formatData() {}

  function getOption(startAngle: number, radius: number) {
    let option = {
      // backgroundColor: '#081c47',
      // title: {
      //     text: '数据统一管理平台',
      //     left: 'center',
      //     textStyle: {
      //         color: '#fff'
      //     }
      // },
      xAxis: {
        show: false,
        type: 'value',
        max: 50,
        min: -51,
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
      yAxis: {
        show: false,
        type: 'value',
        max: 50,
        min: -50,
      },
      series: [
        {
          name: '节点',
          type: 'graph',
          silent: false,
          hoverAnimation: false, // 鼠标悬浮高亮
          cursor: 'default',
          coordinateSystem: 'cartesian2d',
          z: 3,
          itemStyle: {
            normal: {
              shadowColor: 'none',
            },
          },
          emphasis: {
            scale: false,
          },
          data: allArr,
        },
        {
          name: '线图',
          type: 'lines',
          hoverAnimation: false,
          silent: false,
          cursor: 'default',
          coordinateSystem: 'cartesian2d',
          polyline: false, // 多线段
          z: 1,
          lineStyle: {
            width: 2,
            type: 'dashed',
            curveness: 0,
          },
          effect: {
            show: true,
            period: 4, //箭头指向速度，值越小速度越快
            trailLength: 0, //特效尾迹长度[0,1]值越大，尾迹越长重
            symbol: 'arrow', //箭头图标
            symbolSize: 8,
          },
          emphasis: {
            lineStyle: {
              type: 'dashed',
            },
          },
          data: dataArr,
        },
        {
          name: '不动外圆',
          type: 'pie',
          zlevel: 10,
          silent: true,
          radius: ['35%', '40%'],
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: dolitData,
        },
        // {
        //     type: 'pie',
        //     name: '旋转圆',
        //     zlevel: 20,
        //     silent: true,
        //     radius: ['40%', '39%'],//圆的大小
        //     hoverAnimation: false,
        //     startAngle: startAngle,
        //     data: threeData,
        //     label: {
        //         normal: {
        //             show: false
        //         },
        //     },
        //     labelLine: {
        //         normal: {
        //             show: false
        //         }
        //     },
        // },
        // {
        //     name: '缩放圆',
        //     type: 'pie',
        //     zlevel: 4,
        //     silent: true,
        //     radius: [(radius + 1) + '%', radius + '%'],
        //     label: {
        //         normal: {
        //             show: false
        //         },
        //     },
        //     labelLine: {
        //         normal: {
        //             show: false
        //         }
        //     },
        //     data: dolitData
        // },
      ],
    }
    console.log(option)
    return option
  }

  let startAngle = 50 // 初始旋转角度
  let [minradius, radius, maxradius] = [24, 24, 28] // 初始缩放尺寸
  let isBig = true // 缩放动画 标识

  function draw() {
    startAngle = startAngle - 5
    if (isBig) {
      radius = radius + 0.5
      if (radius > maxradius) {
        isBig = false
      }
    } else {
      radius = radius - 0.5
      if (radius < minradius) {
        isBig = true
      }
    }
    let option = getOption(startAngle, radius)
    // myChart.setOption(option, true);
    return option
  }
  const option: any = draw()
  option.chartID = 'default-graph-1'
  console.log('getGraphOptions option', [option])
  return [option]
}
export { getGraphOptions }
