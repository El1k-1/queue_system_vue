import useNotify from '@/compositions/useNotify.js'

export default {
  name: 'customNotify',
  props: {
    data: Object
  },
  setup () {
    const { hideNotify } = useNotify()
    const status = {
      success: 'Успешно',
      warning: 'Предупреждение',
      error: 'Ошибка',
      info: 'Примечание'
    }
    const statusIcons = {
      success: 'mdi-checkbox-marked-circle',
      warning: 'mdi-alert',
      error: 'mdi-alert-circle',
      info: 'mdi-plus'
    }
    const hideMessage = (id) => {
      window.clearTimeout(id)
      hideNotify(id)
    }

    return {
      hideMessage,
      status,
      statusIcons
    }
  }
}
