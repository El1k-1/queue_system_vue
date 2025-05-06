<template>
  <div
    class="notify pa-3 mb-3"
    :name="`notify-${data.color}`"
    :style="{
      backgroundColor: `color-mix(in oklab,var(--v-${data.color}-base) 10%,white)`,
    }"
  >
    <div class="left-content">
      <v-icon :color="data.color" size="16">{{
        data.icon ?? statusIcons[data.color]
      }}</v-icon>
      <p class="pt-1"
        :style="`color: var(--v-${data.color}-base)`"
        v-if="data.content"
        v-html="data.content"
      ></p>
      <component
        v-if="data.component"
        :data="data.data"
        :is="data.component"
      ></component>
    </div>
    <v-btn small icon @click="hideMessage(data.id)">
      <v-icon size="16">mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script src="./setup.js"></script>
<style scoped lang="scss" src="./style.scss"></style>
