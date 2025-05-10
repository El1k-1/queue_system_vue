<template>
  <v-app>
    <div class="header w-100 space-between">
      <div>
        <h2>Социальный центр</h2>
      </div>
    </div>
    <v-main>
      <div class="content">
        <router-view />
      </div>
    </v-main>
    <div class="footer">
      <div>
        <p class="text--secondary">Служебная информация: 8 (800) 555-35-35</p>
      </div>
      <div></div>
    </div>
    <Notifies></Notifies>
  </v-app>
</template>

<script>
import Notifies from '@/components/Notifies/notifyItem.vue'
export default {
  name: 'App',
  components: {
    Notifies
  },

  setup (props) {
    return {
    }
  }
}
</script>
<style scoped lang="scss">
@import url(./assets/main.scss);

.content{
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 24px;
}

.header{
  display: flex;
  padding: 12px 24px;
}
.footer{
  display: flex;
  padding: 12px 24px;
}

</style>
