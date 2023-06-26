<template>
  <v-app>
    <Header />
    <v-main>
      <TaskField :fieldData="data" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import TaskField from "./components/TaskField.vue";
import Header from "./components/Header.vue";
import data from "./assets/fieldData"
</script>
