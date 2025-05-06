import { ref } from 'vue'
const notifiesList = ref([])

export default function useNotify () {
  const showMessage = (
    { content, color, timeout, component, data, icon, subtitle }
  ) => {
    let timeoutHandler = 0
    if (timeout) {
      timeoutHandler = setTimeout(() => {
        hideNotify(timeoutHandler)
      }, timeout)
    } else {
      timeoutHandler = setTimeout(() => {
        hideNotify(timeoutHandler)
      }, 3000)
    }
    if (content || component) {
      notifiesList.value.push({
        id: timeoutHandler,
        content,
        color,
        timeout,
        component,
        isShow: true,
        data,
        icon,
        subtitle
      })
    }
  }

  const hideNotify = (id) => {
    const index = notifiesList.value.findIndex((x) => x.id === id)
    notifiesList.value.splice(index, 1)
  }
  return {
    notifiesList, hideNotify, showMessage
  }
}
