<template>
  <v-menu offset-y top>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" fab :color="selectedColor" class="mb-8">
        <v-icon :color="selectedColor === 'black' ? 'white' : 'black'">
          {{ icon || "mdi-format-color-fill" }}
        </v-icon>
      </v-btn>
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

<script>
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