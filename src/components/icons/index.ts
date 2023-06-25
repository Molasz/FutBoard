import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";

import cone from "./cone.vue";
import fence from "./fence.vue";
import goal from "./goal.vue";
import pitch from "./pitch.vue";
import tinyCone from "./tinyCone.vue";

const customSvgNameToComponent: any = {
  cone,
  fence,
  goal,
  pitch,
  tinyCone,
};

const customSVGs: IconSet = {
  component: (props: IconProps) => h(customSvgNameToComponent[props.icon as string]),
};

export default customSVGs;