import { createVuetify } from "vuetify";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import customIcons from "../components/icons";


export default createVuetify({
  icons: {
    sets: {
      custom: customIcons
    }
  },
});
