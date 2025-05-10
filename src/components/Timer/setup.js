import { onMounted, ref } from 'vue'

const Timer = {
  name: 'Timer',
  props: {
    time: Number
  },
  setup (props, ctx) {
    const currentOstTime = ref(props.time / 1000)

    onMounted(() => {
      setInterval(() => {
        if (!currentOstTime.value) {
          ctx.emit('timeEnd')
        } else {
          currentOstTime.value--
        }
      }, 1000)
    })
    return {
      currentOstTime
    }
  }
}
export default Timer
