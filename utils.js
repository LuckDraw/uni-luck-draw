export const rpx2px = (value) => {
  if (typeof value === 'string') value = Number(value.replace(/[a-z]*/g, ''))
  return uni.getSystemInfoSync().windowWidth / 750 * value
}

export const changeUnits = (value) => {
  return Number(value.replace(/^(\-*[0-9.]*)([a-z%]*)$/, (value, num, unit) => {
    switch (unit) {
      case 'px':
        num *= 1
        break
      case 'rpx':
        num = rpx2px(num)
        break
      default:
        num *= 1
        break
    }
    return num
  }))
}

let fsm
// #ifdef MP
fsm = wx.getFileSystemManager()
// #endif
let tempImageFlag = 0
export const base64src = function(base64data) {
  return new Promise((resolve, reject) => {
    // 如果不是base64就直接返回路径
    if (!/^data:image\/([a-z]+);base64,/.test(base64data)) return resolve(base64data)
    const [, format, bodyData] = /data:image\/([a-z]+);base64,(.*)/.exec(base64data) || []
    if (!format) return resolve(base64data)
    const filePath = `${wx.env.USER_DATA_PATH}/lucky_${Date.now()}${tempImageFlag++}.${format}`
    const buffer = wx.base64ToArrayBuffer(bodyData)
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success: () => resolve(filePath),
      fail: () => reject(new Error('base64图片缓存失败'))
    })
  })
}

export const cacheImage = (arr) => {
  return new Promise((resolve, reject) => {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return reject('cacheImage => arr type error')
    }
    arr.forEach((item) => {
      if (!item.imgs) return
      item.imgs.forEach(async (img) => {
        img.src = await base64src(img.src)
      })
    })
    resolve(arr)
  })
}
