<template>
  <div class="requests">
    <div class="d-flex flex-column justify-center text-center">
      <h1>Очередь оказания услуг</h1>
      <p class="text--secondary">Дождитесь рассмотрения вашей заявки</p>
    </div>
    <v-divider class="my-4"></v-divider>
    <div class="d-flex h-100 justify-center">
      <div v-if="!listLoading" class="requests-container">
        <div class="requests-item" :style="{
            backgroundColor: `color-mix(in oklab,var(--v-${queryStatuses[query.status].color}-base) 10%,white)`,
          }"
          v-for="query in queriesList" :key="query.id">
          <h4>{{ query.code }}</h4>
          <h4>{{ query.window?.[0]?.name }}</h4>
          <div class="d-flex align-center" :style="{
            color: `color-mix(in oklab,var(--v-${queryStatuses[query.status].color}-base) 90%,white)`,
          }">
            {{ queryStatuses[query.status].title }}
            <v-icon :color="queryStatuses[query.status].color" class="ml-2">{{ queryStatuses[query.status].icon }}</v-icon>
          </div>
        </div>
      </div>
      <Popup v-if="acceptedQuery.id" :label="'Заявка на рассмотрении'" :timer="5000" @closePopup="() => acceptedQuery = {}">
        <div class="popup-content">
          <div>
            <div>{{acceptedQuery.code}}</div>
            <div>{{ servises.find((x) => x.name === acceptedQuery.type).title }}</div>
          </div>
          <div class="d-flex align-center"> <span class="text--secondary">Подойдите к окну</span> <h2 class="ml-2">{{ acceptedQuery.window[0].name }}</h2></div>
        </div>
        <v-divider class="my-2"></v-divider>
      </Popup>
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
  </div>
</template>
<script>
import Vue, { onMounted, onUnmounted, ref } from 'vue'
import useNotify from '@/compositions/useNotify.js'
import WebSocketHandler from '@/utils/handlers/webSocketHandler'
import Popup from '@/components/Popup/popupComponent.vue'
import { servises, queryStatuses } from '@/utils/constants'

export default {
  name: 'RequestsView',
  components: {
    Popup
  },
  setup (context) {
    const { showMessage } = useNotify()
    const listLoading = ref(false)
    const acceptedQuery = ref({})

    const choseService = (id) => {
      showMessage({
        color: 'error',
        content: 'Ам ням уже поглажен',
        timeout: 3000
      })
      console.log('Выбран ', id)
    }
    const queriesList = ref([])
    const ws = new WebSocketHandler('base', { params: { screen: 'requests' } })

    ws.subscribe('all', (data) => {
      if (data) {
        Vue.set(queriesList, 'value', data)
      }
      console.log(queriesList, data)
    })

    ws.subscribe('updateList', (data) => {
      if (data.type === 'add') {
        queriesList.value.push(data.row)
      }
      if (data.type === 'update') {
        const item = queriesList.value.find((x) => x.id === data.row.id)
        Vue.set(item, 'window', data.row.window)
        item.status = data.row.status
        Vue.set(acceptedQuery, 'value', data.row)
      }
      if (data.type === 'delete') {
        const index = queriesList.value.findIndex((x) => x.id === data.row.id)
        queriesList.value.splice(index, 1)
      }
    })
    onMounted(() => {
      listLoading.value = true
      setTimeout(() => {
        ws.send({
          type: 'all',
          data: {
            status: 'open'
          }
        })
      }, 200)
      listLoading.value = false
    })
    onUnmounted(() => {
      ws.destroy()
    })
    return {
      listLoading,
      choseService,
      servises,
      queriesList,
      acceptedQuery,
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
</style>
