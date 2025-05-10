import Timer from '@/components/Timer/timerComponent.vue'
const Popup = {
  name: 'Popup',
  components: {
    Timer
  },
  props: {
    label: String,
    timer: Number
  },
  setup (props, ctx) {
    return {
    }
  }
}
export default Popup
