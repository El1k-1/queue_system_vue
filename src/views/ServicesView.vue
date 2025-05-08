<template>
  <div class="services">
    <div class="d-flex flex-column justify-center text-center">
      <h1>Доступные услуги</h1>
      <p class="text--secondary">Выберите услугу чтобы встать в очередь</p>
    </div>
    <v-divider class="my-4"></v-divider>
    <div class="d-flex h-100 justify-center">
      <div v-if="!listLoading" class="services-container">
        <v-btn text class="services-container-item" height="60px" v-for="service in servises" :key="service.name" @click="choseService(service.name)">
          {{ service.title }}
        </v-btn>
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
  </div>
</template>
<script>
import { onMounted, onUnmounted, ref } from 'vue'
import useNotify from '@/compositions/useNotify.js'
import WebSocketHandler from '@/utils/handlers/webSocketHandler'
import { servises } from '@/utils/constants'

export default {
  name: 'ServicesView',
  setup (context) {
    const { showMessage } = useNotify()
    const listLoading = ref(false)

    const choseService = (serviceName) => {
      ws.send({ type: 'createQuery', data: serviceName })
    }
    const ws = new WebSocketHandler('base', { params: { screen: 'services' } })
    ws.subscribe('createQuery', (data) => {
      if (data === 'success') {
        showMessage({
          color: 'success',
          content: 'Заявка на услугу создана успешно',
          timeout: 3000
        })
      } else {
        showMessage({
          color: 'erroe',
          content: 'Похоже сервер лежит ):',
          timeout: 3000
        })
      }
    })

    onMounted(() => {
      listLoading.value = true
      // Vue.set(servicesList, 'value', servises)
      // Запрос листа
      listLoading.value = false
    })
    onUnmounted(() => {
      ws.destroy()
    })
    return {
      servises,
      listLoading,
      choseService,
      ws
    }
  }
}
</script>
<style scoped lang="scss">
.services{
  display: flex;
  flex-direction: column;
  width: 100%;
  &-container{
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(10, 60px);

    .v-btn {
        &::v-deep{
          font-size: 20px;
          text-transform: none;
        }
      }

    &-item{
      font-size: 24px;
      text-align: center;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;

      &:hover{
        background-color: rgba(150, 150, 150, 0.100);
      }
    }
  }
}
</style>
