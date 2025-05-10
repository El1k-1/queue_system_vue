<template>
  <div class="d-flex w-100 justify-center align-center">
    <div v-if="!isAutorized">
      <div v-if="authStage === 1">
        <div>
          <h3>Авторизация</h3>
          <v-text-field
            v-model.trim="formData['login']"
            :label="'Логин'"
          ></v-text-field>
          <v-text-field
            v-model.trim="formData['password']"
            :label="'Пароль'"
          ></v-text-field>
          <v-btn text color="info" @click="auth">Авторизоваться</v-btn>
        </div>
      </div>
      <div v-if="authStage === 2 && userData">
        <div class="d-flex w-100 align-center">
          <v-btn icon class="mr-2" @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h3>Выберете окно</h3>
        </div>
        <v-autocomplete
          v-model="formData['window']"
          :items="windows"
          :item-text="'name'"
          :item-value="'id'"

          :label="'Окно'"
        ></v-autocomplete>

        <v-btn text color="info" @click="choseWindow">Выбрать</v-btn>
      </div>
    </div>
    <div v-else class="requests">
      <div class="d-flex flex-column justify-center text-center">
        <h1>
          <v-btn icon @click="userExit">
            <v-icon>mdi-account-off</v-icon>
          </v-btn>
           Панель сотрудника
          </h1>
        <p class="text--secondary">Список ожидающих заявок на услуги</p>
      </div>
      <v-divider class="my-4"></v-divider>
      <div class="d-flex h-100 justify-center">
        <div v-if="!listLoading" class="requests-container">
          <div class="requests-wrapper"
            v-for="query in queriesList" :key="query.id">
            <v-btn color="error" text height="58" @click="choseService('close', query.id)">Отклонить</v-btn>
            <div class="requests-item" :style="{
              backgroundColor: `color-mix(in oklab,var(--v-${queryStatuses?.[query.status]?.color}-base) 10%,white)`,
            }">
              <div>
                <h4>{{ query.code }}</h4>
              </div>
              <div class="d-flex align-center" :style="{
                color: `color-mix(in oklab,var(--v-${queryStatuses?.[query.status]?.color}-base) 90%,white)`,
              }">
                {{ queryStatuses[query.status].title }}
                <v-icon :color="queryStatuses[query.status].color" class="ml-2">{{ queryStatuses?.[query.status]?.icon }}</v-icon>
              </div>
            </div>
            <v-btn color="success" text height="58" @click="choseService('accept', query.id)">Принять</v-btn>
          </div>
        </div>
        <div v-else class="loading">
          <v-progress-circular
            v-if="listLoading"
            :size="60"
            :width="3"
            color="primary"
            indeterminate
          />
        </div>
      </div>
      <Popup v-if="selectedQuery.id" :label="'Работа с заявкой'">
        <div class="popup-content">
          <div>
            <div>{{selectedQuery.code}}</div>
            <div>{{ servises.find((x) => x.name === selectedQuery.type).title }}</div>
          </div>
          <div class="text--secondary"> По завершению оказания услуги нажмите кнопку 'Завершить'</div>
        </div>
        <v-divider class="my-2"></v-divider>
        <div>
          <v-btn color="warning" text @click="choseService('close', selectedQuery.id)">Завершить</v-btn>
        </div>
      </Popup>
    </div>
  </div>
</template>
<script>
import Vue, { onMounted, onUnmounted, ref, reactive, watch } from 'vue'
import useNotify from '@/compositions/useNotify.js'
import WebSocketHandler from '@/utils/handlers/webSocketHandler'
import Popup from '@/components/Popup/popupComponent.vue'
import { servises, queryStatuses } from '@/utils/constants'
import useApi from '@/compositions/api.js'

export default {
  name: 'RequestsView',
  components: {
    Popup
  },
  setup (context) {
    const { showMessage } = useNotify()
    const listLoading = ref(false)
    const selectedQuery = ref({})
    const queriesList = ref([])
    const isAutorized = ref(false)
    const userData = ref({})
    const authStage = ref(1)
    const windows = ref([])
    // eslint-disable-next-line no-unused-vars
    let activeWindow = 0

    const formData = reactive({
      login: '',
      password: '',
      window: 0
    })

    const { postQuery, getQuery } = useApi()

    const auth = async () => {
      const result = await postQuery('/api/auth/login', {
        login: formData.login,
        password: formData.password
      })
      if (result.data?.id) {
        Object.entries(result.data).forEach(([key, value]) => {
          userData.value[key] = value
        })
        sessionStorage.setItem('userData', JSON.stringify(userData.value))
        authStage.value++
        // isAutorized.value = true
      }
    }

    const chooseWindow = async () => {
      activeWindow = formData.window
      if (formData.window) {
        const result = await postQuery('/api/window/join', {
          userId: userData.value.id,
          windowId: formData.window
        })
        if (result.data?.id) {
          Object.entries(result.data).forEach(([key, value]) => {
            userData.value[key] = value
          })
          sessionStorage.setItem('userData', JSON.stringify(userData.value))
          authStage.value++
          isAutorized.value = true
        } else {
          showMessage({
            color: 'error',
            content: 'Ошибка авторизации',
            timeout: 3000
          })
        }
      } else {
        showMessage({
          color: 'error',
          content: 'Окно не выбрано',
          timeout: 3000
        })
      }
    }

    const goBack = () => {
      authStage.value = 1
      userData.value = {}
      sessionStorage.removeItem('userData')
    }

    const userExit = async () => {
      sessionStorage.removeItem('userData')
      await postQuery('/api/window/quit', { userId: userData.value.id, windowId: formData.window })
      formData.window = 0
      isAutorized.value = false
      authStage.value = 1
    }

    const choseService = (status, id) => {
      ws.send({
        type: status,
        data: {
          userId: userData.value.id,
          appealId: id
        }
      })
      if (status === 'accept') {
        selectedQuery.value = queriesList.value.find((x) => x.id === id)
      }
      if (status === 'close') {
        selectedQuery.value = {}
      }
    }
    let ws = {}
    onMounted(() => {
      watch(isAutorized, () => {
        if (isAutorized.value) {
          ws = new WebSocketHandler('base', { params: { screen: 'employee' } })

          ws.subscribe('all', (data) => {
            if (data) {
              Vue.set(queriesList, 'value', data)
            }
          })

          ws.subscribe('updateList', (data) => {
            if (data.type === 'add') {
              queriesList.value.push(data.row)
            }
            if (data.type === 'update') {
              const item = queriesList.value.find((x) => x.id === data.row.id)
              item.status = data.row.status
            }
            if (data.type === 'delete') {
              const index = queriesList.value.findIndex((x) => x.id === data.row.id)
              queriesList.value.splice(index, 1)
            }
          })

          setTimeout(() => {
            ws.send({
              type: 'all',
              data: {
                types: userData.value.userPermission,
                status: 'open'
              }
            })
          }, 200)
        }
      })
      watch(authStage, async () => {
        if (authStage.value === 2) {
          const result = await getQuery('/api/window/all')
          Vue.set(windows, 'value', result.data)
        }
      })
      const _userData = JSON.parse(sessionStorage.getItem('userData'))
      if (_userData) {
        authStage.value = 2
        Vue.set(userData, 'value', _userData)
      }
      listLoading.value = true
      listLoading.value = false
    })
    onUnmounted(() => {
      ws.destroy()
    })
    return {
      servises,
      formData,
      userExit,
      goBack,
      listLoading,
      choseService,
      windows,
      choseWindow: chooseWindow,
      selectedQuery,
      queriesList,
      userData,
      isAutorized,
      auth,
      authStage,
      queryStatuses
    }
  }
}
</script>
<style scoped lang="scss">
.requests{
  display: flex;
  flex-direction: column;
  width: 100%;

  &-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 12px;
    width: 100%;
  }
  &-wrapper{
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    column-gap: 12px;
    width: 100%;
  }
  &-item{
    display: flex;
    width: 70%;
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    justify-content: space-between;
    text-align: center;
    align-items: center;
  }
}

.popup-content{
  display: flex;
  height: 100px;
  flex-flow: column nowrap;
  justify-content: space-between;
}
</style>
