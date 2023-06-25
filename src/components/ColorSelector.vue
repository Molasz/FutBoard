<template>
  <v-menu offset-y top>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :color="selectedColor"
        :icon="icon || 'mdi-format-color-fill'"
        class="mb-8"
      />
    </template>

    <v-card>
      <v-avatar
        v-for="color in colors"
        :key="color"
        :color="color"
        @click="$emit('update', color)"
        class="ma-2"
      />
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: "ColorSelector",
  props: { selectedColor: String, icon: String },
  computed: {
    colors() {
      return ["black", "red", "yellow", "green", "blue"];
    },
  },
};
</script>
