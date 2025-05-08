<template>
  <div class="requests">
    <div class="d-flex flex-column justify-center text-center">
      <h1>Панель сотрудника</h1>
      <p class="text--secondary">Список ожидающих заявок на услуги</p>
    </div>
    <v-divider class="my-4"></v-divider>
    <div class="d-flex h-100 justify-center">
      <div v-if="!listLoading" class="requests-container">
        <div class="requests-wrapper"
          v-for="query in queriesList" :key="query.id">
          <v-btn :disabled="query.status !== 'В ожидании'" color="error" text height="58" @click="choseService('Отклонен', query.id)">Отклонить</v-btn>
          <div class="requests-item" :style="{
            backgroundColor: `color-mix(in oklab,var(--v-${queryStatuses?.[query.status]?.color}-base) 10%,white)`,
          }">
            <div>
              <h4>{{ query.id }}</h4>
            </div>
            <div class="d-flex align-center" :style="{
              color: `color-mix(in oklab,var(--v-${queryStatuses?.[query.status]?.color}-base) 90%,white)`,
            }">
              {{ query.status }}
              <v-icon :color="queryStatuses[query.status].color" class="ml-2">{{ queryStatuses?.[query.status]?.icon }}</v-icon>
            </div>
          </div>
          <v-btn :disabled="query.status !== 'В ожидании'" color="success" text height="58" @click="choseService('В работе', query.id)">Принять</v-btn>
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
          <div>{{selectedQuery.id}}</div>
          <div>{{ servises.find((x) => x.name === selectedQuery.service).title }}</div>
        </div>
        <div class="text--secondary"> По завершению оказания услуги нажмите кнопку 'Завершить'</div>
      </div>
      <v-divider class="my-2"></v-divider>
      <div>
        <v-btn color="warning" text @click="choseService('Завершено', selectedQuery.id)">Завершить</v-btn>
      </div>
    </Popup>
  </div>
</template>
<script>
import Vue, { onMounted, onUnmounted, ref } from 'vue'
// import useNotify from '@/compositions/useNotify.js'
import WebSocketHandler from '@/utils/handlers/webSocketHandler'
import Popup from '@/components/Popup/popupComponent.vue'
import { servises, queryStatuses } from '@/utils/constants'

export default {
  name: 'RequestsView',
  components: {
    Popup
  },
  setup (context) {
    // const { showMessage } = useNotify()
    const listLoading = ref(false)
    const selectedQuery = ref({})
    const queriesList = ref([])

    const choseService = (status, id) => {
      ws.send({
        type: 'updateList',
        data: {
          id, status
        }
      })
      if (status === 'В работе') {
        selectedQuery.value = queriesList.value.find((x) => x.id === id)
      }
      if (status === 'Завершено') {
        selectedQuery.value = {}
      }
    }
    const ws = new WebSocketHandler('base', { params: { screen: 'employee' } })

    ws.subscribe('getLists', (data) => {
      if (data.rows) {
        Vue.set(queriesList, 'value', data.rows)
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
    onMounted(() => {
      listLoading.value = true

      listLoading.value = false
    })
    onUnmounted(() => {
      ws.destroy()
    })
    return {
      servises,
      listLoading,
      choseService,
      selectedQuery,
      queriesList,
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
