import useNotify from '@/compositions/useNotify.js'
import customNotify from './customNotify/customNotify.vue'

export default {
  name: 'Notifies-List',
  components: {
    customNotify
  },
  setup () {
    const { notifiesList, hideNotify } = useNotify()
    const hideMessage = () => {
      hideNotify()
    }
    return {
      notifiesList,
      hideMessage
    }
  }
}
