import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";

import Cone from "../components/icons/cone.vue";
import Goal from "../components/icons/goal.vue";
import TinyCone from "../components/icons/tinyCone.vue";
import Pitch from "../components/icons/pitch.vue";
import Fence from "../components/icons/fence.vue";

export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          WSSblue: "#000439",
          WSSpink: "#EF2AC1",
          primary: "#000000",
        },
      },
      dark: {
        colors: {
          WSSblue: "#000439",
          WSSpink: "#EF2AC1",
          primary: "#ffffff",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    sets: {
      cone: { component: Cone },
      tinyCone: { component: TinyCone },
      goal: { component: Goal },
      pitch: { component: Pitch },
      fence: { component: Fence },
    },
  },
});
