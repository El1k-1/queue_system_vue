<template>
  <div
    :class="['v-popup']"
    @click.prevent="options.closeOutsideClick && $emit('close')"
  >
    <div class="v-popup-wrap" id="popup">
      <div
        @click.stop
        class="v-popup-container"
      >
        <div class="v-popup-header">
          <h3>{{ label }}</h3>
        </div>
        <v-divider class="my-2"></v-divider>
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./setup.js"></script>
<style lang="scss" scoped src="./style.scss"></style>
