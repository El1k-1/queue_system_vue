const wsUrl = process.env.VUE_APP_WS_URL_BASE

const connectionsMap = {}

/** Промежуточная функция обработччик входящих сообщений */
function globalWSInterseptor (query, events) {
  const _query = JSON.parse(query.data)
  if (_query?.type && events?.[_query?.type]) {
    events[_query?.type](_query.data)
  }
}

/** Обработчик ошибок */
function globalWSErrorHandler (err) {
  console.error(err)
}

/** Промежуточный класс наследующий `WebSocket`
 * Экземпляры которого хранят `#events` события исполняемые `.onmessage` `WS`
 */
class WebSocketModified extends WebSocket {
  #events
  constructor (url) {
    super(url)
    this.#events = {}
    this.onerror = globalWSErrorHandler
    this.onclose = () => {
      // console.log('Connection refused')
    }
  }

  subscribe (event, callback) {
    this.#events[event] = callback
    this.onmessage = (query) => {
      globalWSInterseptor(query, this.#events)
    }
  }
}
export default class WebSocketHandler {
  #socket
  #socketName
  /** Класс экземпляры которого ищят или создают
   *  при иницилизации новое ws соеденение
   * @param {string} [socketName='base']  default = `base`
   * @param {object} options Дополнительный настройки
   * @param {string} options.envPathName Указывает какой путь брать из `.env` файла default = `VUE_APP_WS_URL_BASE`
   * @param {object} options.params Добавляет query парамтры к подключению
   */
  constructor (socketName = 'base', options) {
    // const token = localStorage.getItem('token')
    this.#socketName = socketName
    if (socketName && !connectionsMap?.[socketName]) {
      let _wsUrl = wsUrl
      let paramsString = ''
      if (options?.envPathName) {
        _wsUrl = process.env[options?.envPathName]
      }
      if (options?.params) {
        paramsString = '?'
        for (const param in options?.params) {
          paramsString = paramsString.concat(`${param}=${options?.params[param]}`)
        }
      }
      if (!_wsUrl) return
      try {
        const ws = new WebSocketModified(_wsUrl + paramsString)
        this.#socket = ws
        connectionsMap[socketName] = ws
      } catch (err) {
        console.log(err)
      }
    } else {
      this.#socket = connectionsMap?.[socketName]
    }
  }

  /** Оправляет сообщение
   * @param {any} message Данные сообщения
   */
  send (message) {
    this.#socket.send(JSON.stringify(message))
  }

  /** Добавляет слушатель события типа `event`
   * @param {string} event Название типа события, которое мы будем прослушивать
   * @param {function} callback Функция, которая будет срабатывать при сообщении с типом `event`
   */
  subscribe (event, callback) {
    if (this.#socket) {
      this.#socket.subscribe(event, callback)
    } else {
      console.error(
        `Can\`t subscribe, because socket "${this.#socketName}" is not exists`
      )
    }
  }

  /** Закрывает канал соединения, очищает класс */
  destroy () {
    this.#socket.close()
    this.#socket = null
    delete connectionsMap?.[this.#socketName]
  }
}

export { connectionsMap }
