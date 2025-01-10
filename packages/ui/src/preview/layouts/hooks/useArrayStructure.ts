export function useArrayStructure(data: any) {
  const currentAlarm = []
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const ele = data[key]
      for (const key2 in ele) {
        if (Object.hasOwnProperty.call(ele, key2)) {
          const elec = ele[key2]
          currentAlarm.push({ key, ...elec })
        }
      }
    }
  }
  return currentAlarm
}
