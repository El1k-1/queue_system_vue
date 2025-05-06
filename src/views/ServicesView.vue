<template>
  <div class="services">
    <div class="d-flex flex-column justify-center text-center">
      <h1>Доступные услуги</h1>
      <p class="text--secondary">Выберите услугу чтобы встать в очередь</p>
    </div>
    <v-divider class="my-4"></v-divider>
    <div class="d-flex h-100 justify-center">
      <div v-if="!listLoading" class="services-container">
        <v-btn text class="services-container-item" v-for="service in servises" :key="service.id" @click="choseService(service.id)">
          {{ service.name }}
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
import { onMounted, ref } from 'vue'
import useNotify from '@/compositions/useNotify.js'

export default {
  name: 'ServicesView',
  setup (context) {
    const { showMessage } = useNotify()
    const listLoading = ref(false)
    const servises = ref([
      { id: 1, name: 'Погладить Ам Няма' },
      { id: 2, name: 'Погладить Ам Няма' },
      { id: 3, name: 'Погладить Ам Няма' },
      { id: 4, name: 'Погладить Ам Няма' },
      { id: 5, name: 'Погладить Ам Няма' },
      { id: 6, name: 'Погладить Ам Няма' },
      { id: 7, name: 'Погладить Ам Няма' },
      { id: 8, name: 'Погладить Ам Няма' },
      { id: 9, name: 'Погладить Ам Няма' }
    ])

    const choseService = (id) => {
      showMessage({
        color: 'error',
        content: 'Ам ням уже поглажен',
        timeout: 30000
      })
      console.log('Выбран ', id)
    }

    onMounted(() => {
      listLoading.value = true
      // Запрос листа
      listLoading.value = false
    })
    return {
      servises,
      listLoading,
      choseService
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
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(10, 40px);

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
