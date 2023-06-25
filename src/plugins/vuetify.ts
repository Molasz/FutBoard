import { createVuetify } from "vuetify";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import customIcons from "../components/icons";


export default createVuetify({
  theme: {
    defaultTheme: 'dark'
  },
  icons: {
    sets: {
      custom: customIcons
    }
  },
});
