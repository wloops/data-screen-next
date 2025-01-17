import { useDateFormat } from '@vueuse/core'

interface ProceMap {
  [key: string]: (data: any) => any
}

const formatDate = (dateStr: string) => {
  return useDateFormat(dateStr, 'YYYY-MM-DD HH:mm:ss').value
}

export const useProceResponseData = (funID?: string, data?: any) => {
  const proceMap: ProceMap = {
    tpsTrend: tpsTrend_fn,
    NodeAlarmDetail: NodeAlarmDetail_fn,
    NodeAlarmDetail2: NodeAlarmDetail2_fn,
    tradeProportion: tradeProportion_fn,
    nodeReach: nodeReach_fn,
    Node7DayBusiness: Node7DayBusiness_fn,
    RealTimeBusiness: RealTimeBusiness_fn,
    nodeAchievable: nodeAchievable_fn,
    statusInfo: statusInfo_fn,
    deviceStatus: deviceStatus_fn,
    progressTop: progressTop_fn,
    deciceTypeCount: deciceTypeCount_fn,
    errorInfo: errorInfo_fn,
    deviceNumber: deviceNumber_fn,
    Total12HoursBusiness: Total12HoursBusiness_fn,
    AppTodayBusiness: AppTodayBusiness_fn,
    nodeStatusCard: nodeStatusCard_fn,
  }

  // tps
  function tpsTrend_fn(data: any) {
    let label: string[] = []
    let value: number[] = []

    if (data) {
      data.forEach((element: any) => {
        label.push(element.time)
        value.push(Number(element.tps.toFixed(2)))
      })
    }

    return { label, value }
  }
  function errorInfo_fn(data: any) {
    let r_data: any[] = []
    let header = [
      { name: '时间', param: 'time', width: 4 },
      { name: '错误码', param: 'code', width: 2 },
      { name: '错误描述', param: 'msg', width: 3 },
      { name: '次数', param: 'failNum', width: 1 },
    ]
    if (data) {
      data.forEach((element: any) => {
        let item = {
          time: formatDate(element.time),
          code: element.code,
          msg: element.msg,
          failNum: element.failNum,
        }
        r_data.push(item)
      })
    }
    return { data: r_data, header }
  }
  function NodeAlarmDetail2_fn(data: any) {
    let header = [
      { name: '告警级别', param: 'level', width: 1 },
      { name: '告警信息', param: 'detail', width: 3 },
      { name: '告警时间', param: 'datetime', width: 3 },
    ]
    let r_data = NodeAlarmDetail_fn(data, header)
    return r_data
  }
  function NodeAlarmDetail_fn(wsMsg: any, customHeader?: any) {
    let data: any[] = []
    let header = [
      { name: '告警级别', param: 'level', width: 1 },
      { name: '告警节点', param: 'node', width: 2 },
      { name: '告警信息', param: 'detail', width: 3 },
      { name: '告警时间', param: 'datetime', width: 3 },
    ]
    if (customHeader) {
      header = customHeader
    }
    if (wsMsg) {
      wsMsg = wsMsg.reverse()
      wsMsg.forEach((element: any) => {
        let date = element.inputDate
        let time = element.inputTime
        let datetime = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6) + ' ' + time.slice(0, 2) + ':' + time.slice(2, 4) + ':' + time.slice(4)
        const levelMsg = {
          2: '严重|2',
          1: '重要|1',
          0: '提示|0',
        }
        let item = {
          level: levelMsg[element.alarmLevel as keyof typeof levelMsg],
          node: element.instance,
          detail: element.alarmName,
          datetime: datetime,
        }
        data.push(item)
      })
      // store.SET_DS_RIGHT_DATA_03([{ data, header }])
    }
    // else if (store.DS_RIGHT_DATA_03.length > 0) {
    //   data = store.DS_RIGHT_DATA_03[0].data
    //   header = store.DS_RIGHT_DATA_03[0].header
    // }

    return { data, header }
  }
  function nodeReach_fn(data: any) {
    return data
  }

  function tradeProportion_fn(data: any) {
    let percent = 0
    if (data) {
      percent = ((data.total - data.fail) / data.total) * 100
    }
    console.log('percentBall_fn', percent)
    return { value: percent, label: '成功率' }
  }

  function Node7DayBusiness_fn(data: any) {
    console.log('Node7DayBusiness_fn', data)
    let xdata: string[] = []
    let data1: number[] = []
    let data2: number[] = []
    let data3: number[] = []
    // 根据time排序

    if (data) {
      data.sort((a: any, b: any) => {
        return a.time.localeCompare(b.time)
      })
      data.forEach((element: any) => {
        xdata.push(element.time.substring(4, 6) + '/' + element.time.substring(6))
        data1.push(element.total - element.fail)
        data2.push(element.fail)
        data3.push(Math.floor(100 * ((element.total - element.fail) / element.total) * 100) / 100)
      })
      console.log('Node7DayBusiness_fn', { xdata, data1, data2, data3 })
    }
    return { xdata, data1, data2, data3 }
  }

  function RealTimeBusiness_fn(data: any) {
    console.log('RealTimeBusiness_fn', data)
    return data
  }

  function nodeAchievable_fn(data: any) {
    console.log('nodeAchievable_fn', data)
    const resultData: any[] = []
    if (data) {
      data.forEach((node: any) => {
        const item = {
          name: node.nodeId,
          type: node.status === true ? 3 : 4,
        }
        resultData.push(item)
      })
      console.log('nodeAchievable_fn:resultData', resultData)
      return { data: resultData }
    }
  }

  function statusInfo_fn(data: any) {
    console.log('statusInfo_fn', data)
    data.forEach((item: any) => {
      item.srvUsability = item.srvUsability === 1 ? '正常' : '异常'
    })
    return data
  }

  function deviceStatus_fn(data: any) {
    const resultData: any[] = []
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const node = data[key]
          node.chartData = {
            label: '风险指数',
            value: node.risk || 100,
          }
          resultData.push(node)
        }
      }
      // 如果某一项值是数字的,保留两位小数
      const numKeys = ['cpu', 'disk', 'mem']
      resultData.forEach((item) => {
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const value = item[key]
            if (typeof value === 'number' && numKeys.includes(key)) {
              item[key] = value.toFixed(2)
              // 小数点前面补0
              if (value < 10) {
                item[key] = '0' + item[key]
              }
            }
            if (key === 'chartData') {
              item[key].value = item[key].value.toFixed(2)
            }
          }
        }
      })

      // 排序 chartData.value
      resultData.sort((a, b) => {
        return b.chartData.value - a.chartData.value
      })
    }
    console.log('deviceStatus_fn', resultData)
    return { data: resultData }
  }

  function progressTop_fn(data: any) {
    let r_data: any[] = []
    r_data = deviceStatus_fn(data).data
    console.log('progressTop_fn', r_data)
    r_data.forEach((item) => {
      if (!item.cpu) item.cpu = '0.00'
      if (!item.mem) item.mem = '0.00'
      if (!item.disk) item.disk = '0.00'
    })
    return { data: r_data }
  }

  function deviceNumber_fn(data: any) {
    console.log('deviceNumber_fn', data)
    let r_data = {
      total: 0,
      fail: 0,
    }
    let o_data = deviceStatus_fn(data).data
    r_data.total = o_data.length
    o_data.forEach((item) => {
      if (!item.srvUsability || item.srvUsability === 0) {
        r_data.fail += 1
      }
    })

    return r_data
  }

  function deciceTypeCount_fn(data: any) {
    console.log('deciceTypeCount_fn', data)
    const deciceTypeMap = {
      41: 'KMS服务器',
      21: 'SJJ1310密码机',
      22: 'SRJ1933签名服务器',
      11: '平台节点',
      31: '数据库服务器',
      23: '服务器密码机',
    }
    let o_data = deviceStatus_fn(data).data
    console.log('deciceTypeCount_fn', o_data)
    // 统计各类型设备数量 o_data.nodeType:类型id srvUsability:1 为在线
    let xdata: string[] = [] // 设备类型
    let data1: number[] = [] // 在线数量
    let data2: number[] = [] // 离线数量

    o_data.forEach((item: any) => {
      let name = deciceTypeMap[item.nodeType as keyof typeof deciceTypeMap]
      xdata.push(name)
    })
    // 去重
    xdata = Array.from(new Set(xdata))

    // 统计各类型设备在线数量
    o_data.forEach((item: any) => {
      let name = deciceTypeMap[item.nodeType as keyof typeof deciceTypeMap]
      let index = xdata.indexOf(name)
      if (index !== -1) {
        if (item.srvUsability === 1) {
          data1[index] = data1[index] ? data1[index] + 1 : 1
        } else {
          data2[index] = data2[index] ? data2[index] + 1 : 1
        }
      }
    })
    // 补全空值
    xdata.forEach((item, index) => {
      if (!data1[index]) data1[index] = 0
      if (!data2[index]) data2[index] = 0
    })

    console.log('deciceTypeCount_fn', { xdata, data1, data2 })
    return { xdata, data1, data2 }
  }

  // 业务运行态势(首页)
  function Total12HoursBusiness_fn(data: any) {
    console.log('Total12HoursBusiness_fn', data)
    let r_data: any[] = []
    let label: string[] = []
    let value: number[] = []
    r_data = data.reverse()
    r_data.forEach((element: any) => {
      label.push(element.time.substring(8) + ':00')
      value.push(element.total)
    })
    return { label, value }
  }

  function AppTodayBusiness_fn(data: any) {
    let r_data: any[] = []
    for (let key in data) {
      let item = {
        name: key,
        number: Number(data[key].total),
      }
      r_data.push(item)
    }
    // 排序
    r_data.sort((a, b) => b.number - a.number)
    // 取前5个
    r_data = r_data.slice(0, 5)
    // 计算总数
    const total = r_data.reduce((acc, cur) => acc + cur.number, 0)
    // 计算百分比
    r_data.forEach((item) => {
      item.percent = (item.number / total) * 100
      // 不保留小数点
      item.percent = Number(item.percent)
    })
    console.log('AppTodayBusiness_fn', r_data)
    return { data: r_data }
  }

  function nodeStatusCard_fn(data: any) {
    console.log('nodeStatusCard_fn 调用', data)
    const deciceTypeMap: { [key: number]: string } = {
      41: 'KMS服务器',
      21: 'SJJ1310密码机',
      22: 'SRJ1933签名服务器',
      11: '平台节点',
      31: '数据库服务器',
      23: '服务器密码机',
    }
    // nodeName: `NODE${nodeNum}`,
    //     ip: `172.17.3.${100 + i}`,
    //     port: `${49800 + i}`,
    //     status: statuses[Math.floor(Math.random() * statuses.length)],
    //     region: region[Math.floor(Math.random() * region.length)],
    //     type: types[Math.floor(Math.random() * types.length)],
    //     nodeId: `20160${nodeNum}`
    let o_data = deviceStatus_fn(data).data
    let r_data: any[] = []
    o_data.forEach((item: any, index: number) => {
      r_data.push({
        nodeName: item.deviceId,
        ip: item.ip,
        port: item.port,
        status: item.srvUsability === 1 ? 'online' : 'offline',
        region: item.partition,
        type: deciceTypeMap[item.nodeType],
        nodeId: `${index}_${item.deviceId}`,
      })
    })
    console.log('nodeStatusCard_fn', r_data)
    return { data: r_data }
  }

  let result = {}
  result = funID && proceMap[funID] ? proceMap[funID](data) : data
  return result
}
