<template>
  <div
    class="playerIcon"
    :style="{
      width: `${size}px`,
      height: `${size / 2}px`,
      'border-top-left-radius': `${size + 2}px`,
      'border-top-right-radius': `${size + 2}px`,
      border: `solid ${borderColor} ${size > 30 ? 2 : 1}px`,
    }"
  >
    <div
      class="playerIcon__color"
      :style="{
        'background-color': color,
        border: `solid ${borderColor} ${size > 30 ? 2 : 1}px`,
        width: `${size / 2}px`,
        height: `${size / 2}px`,
        'margin-left': `${size / 5 + size / 50}px`,
        'margin-top': `-${size > 30 ? 2 : 1}px`,
      }"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: "Player",
  props: {
    color: {
      type: String,
      default: "white",
    },
    borderColor: {
      type: String,
      default: "black",
    },
    size: {
      type: Number,
      default: 50,
    },
  },
};
</script>

<style lang="sass" scoped>
.playerIcon
  border-bottom: 0 !important

  .playerIcon__color
    border-radius: 50%,
</style>
