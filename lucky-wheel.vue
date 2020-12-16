<template>
  <view v-if="isShow" class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas id="lucky-wheel" canvas-id="lucky-wheel" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"></canvas>
    <view class="lucky-wheel-btn" @click="toPlay" :style="{ width: btnWidth + 'px', height: btnHeight + 'px' }"></view>
    <div class="lucky-imgs">
      <div v-for="(prize, index) in prizes" :key="index">
        <span v-if="prize.imgs">
          <image v-for="(img, i) in prize.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'prizes', index, i)"></image>
        </span>
      </div>
    </div>
    <div class="lucky-imgs">
      <div v-for="(btn, index) in buttons" :key="index">
        <span v-if="btn.imgs">
          <image v-for="(img, i) in btn.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'buttons', index, i)"></image>
        </span>
      </div>
    </div>
  </view>
</template>

<script>
  import { changeUnits, base64src } from './utils.js'
  import { LuckyWheel } from '../lucky-canvas'
  export default {
    name: 'lucky-wheel',
    data () {
      return {
        isShow: false,
        boxWidth: 100,
        boxHeight: 100,
        btnWidth: 0,
        btnHeight: 0,
      }
    },
    props: {
      width: {
        type: String,
        default: '600rpx'
      },
      height: {
        type: String,
        default: '600rpx'
      },
      blocks: {
        type: Array,
        default: () => []
      },
      prizes: {
        type: Array,
        default: () => []
      },
      buttons: {
        type: Array,
        default: () => []
      },
      defaultConfig: {
        type: Object,
        default: () => {
          return {}
        }
      },
      defaultStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    mounted () {
      this.init()
    },
    watch: {
      prizes: {
        handler (newData, oldData) {
          this.$lucky && (this.$lucky.prizes = newData)
        },
        deep: true
      },
      buttons: {
        handler (newData, oldData) {
          this.$lucky && (this.$lucky.buttons = newData)
        },
        deep: true
      }
    },
    methods: {
      async imgBindload (res, name, index, i) {
        const img = this[name][index].imgs[i]
        if (img && img.$resolve) {
          const path = await base64src(img.src)
          img.$resolve({ ...res.detail, path })
        }
      },
      init () {
        this.boxWidth = changeUnits(this.width)
        this.boxHeight = changeUnits(this.height)
        this.isShow = true
        this.$nextTick(() => {
          this.draw()
        })
      },
      draw () {
        this.ctx = uni.createCanvasContext('lucky-wheel', this)
        this.dpr = uni.getSystemInfoSync().pixelRatio
        const $lucky = this.$lucky = new LuckyWheel({
          // #ifdef H5
          flag: 'UNI-H5',
          // #endif
          // #ifdef MP
          flag: 'UNI-MINI-WX',
          // #endif
          ctx: this.ctx,
          dpr: this.dpr,
          width: this.width,
          height: this.height,
          setTimeout: setTimeout,
          clearTimeout: clearTimeout,
          setInterval: setInterval,
          clearInterval: clearInterval,
        }, {
          ...this.$props,
          start: (...rest) => {
            this.$emit('start', ...rest)
          },
          end: (...rest) => {
            this.$emit('end', ...rest)
          },
        })
        // 动态设置按钮大小
        this.btnWidth = $lucky.maxBtnRadius * 2
        this.btnHeight = $lucky.maxBtnRadius * 2
      },
      toPlay (e) {
        this.$lucky.startCallback()
      },
      play (...rest) {
        this.$lucky.play(...rest)
      },
      stop (...rest) {
        this.$lucky.stop(...rest)
      },
    },
  }
</script>

<style scoped>
  .lucky-box {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
  }
  .lucky-box canvas {
    position: absolute;
  }
  .lucky-wheel-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0);
    border-radius: 50%;
  }
  .lucky-imgs {
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
