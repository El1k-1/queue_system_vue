<template>
  <div class="notifies">
    <TransitionGroup name="notify" tag="ul" class="container-group">
      <customNotify
        v-for="item in notifiesList"
        :key="item.id"
        :data="item"
      ></customNotify>
    </TransitionGroup>
  </div>
</template>

<script src="./setup.js"></script>
<style scoped lang="scss" src="./style.scss"></style>
