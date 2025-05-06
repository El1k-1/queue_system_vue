<template>
  <div class="container">
    <div class="d-flex">
      <v-icon class="mr-2">mdi-file-multiple</v-icon>
      <h2>Страницы</h2>
    </div>
    <div class="d-flex">
      <router-link to="/services">Услуги</router-link>
      <router-link to="/services">Список Заявок</router-link>
      <router-link to="/services">Панель менеджера</router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HomeView',

  setup () {
    return {
    }
  }
}
</script>
<style scoped lang="scss">
.container{
  display:flex;
  height: 100%;
  flex-direction: column;
  row-gap: 24px;
  justify-content: center;
  align-items: center;

  a+a{
    margin-left: 4px;
  }
}
</style>
