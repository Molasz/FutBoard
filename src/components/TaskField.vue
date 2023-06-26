<template>
  <section class="d-flex flex-column">
    <div class="d-flex flex-column align-self-center" style="max-width: 1200px">
      <!-- Buttons -->
      <div class="d-flex justify-space-between align-center">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
              <v-icon size="30" icon="mdi-soccer-field" class="mr-2" />
              Select Field
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="setTaskField('white')">
              White Board
            </v-list-item>
            <v-list-item @click="setTaskField('football')">
              FootBall Full
            </v-list-item>
            <v-list-item @click="setTaskField('half_football')">
              FootBall Half
            </v-list-item>
            <v-list-item @click="setTaskField('futsal')">
              Futsal Full
            </v-list-item>
            <v-list-item @click="setTaskField('half_futsal')">
              Futsal Half
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn @click="resetDialog = true" class="ml-4">
          <v-icon size="25" icon="mdi-reload" class="mr-2" />
          Reset
        </v-btn>
      </div>

      <div class="d-flex align-center justify-space-around my-2">
        <!-- Tool box -->
        <div
          class="tool-box d-flex flex-column align-center justify-space-around pa-2"
        >
          <div :class="{ 'tool-selected': tool === 'players' }" class="pa-1">
            <Player :color="iconColor" :size="40" @click="setTool('players')" />
          </div>
          <div
            v-for="[type, icon] in iconsEntries"
            :key="type"
            class="pa-2"
            :class="{ 'tool-selected': tool === type }"
          >
            <v-icon
              :icon="icon"
              :style="{ fill: 'black' }"
              size="30"
              color="black"
              @click="setTool(type)"
            />
          </div>
          <div
            @click="setTool('lines')"
            :class="{ 'tool-selected': tool === 'lines' }"
            class="pa-2"
          >
            <svg height="30" width="30">
              <line
                x1="0"
                y1="0"
                x2="30"
                y2="30"
                style="stroke-width: 2; stroke: black"
              />
            </svg>
          </div>
          <div
            @click="setTool('dashed')"
            :class="{ 'tool-selected': tool === 'dashed' }"
            class="pa-2"
          >
            <svg height="30" width="30">
              <line
                x1="0"
                y1="0"
                x2="5"
                y2="5"
                style="stroke-width: 2; stroke: black"
              />
              <line
                x1="10"
                y1="10"
                x2="20"
                y2="20"
                style="stroke-width: 2; stroke: black"
              />
              <line
                x1="25"
                y1="25"
                x2="30"
                y2="30"
                style="stroke-width: 2; stroke: black"
              />
            </svg>
          </div>
        </div>
        <!-- Field -->
        <div
          class="field pa-2 mx-4"
          ref="field"
          @click="clickField"
          @mousemove="mouseMove"
        >
          <div
            v-for="(player, index) in taskField.players"
            :key="`Player ${index}`"
            class="icon pa-4 rounded-circle"
            :class="playersClass[index]"
            :style="playersStyle[index]"
            @click.stop="onSelect(player, 'players', index)"
          >
            <Player :color="player.color" :size="player.size" />
          </div>

          <div
            v-for="[type, iconsList] in Object.entries(taskField.icons)"
            :key="type"
          >
            <div
              v-for="(icon, index) in iconsList"
              :key="`${type} ${index}`"
              class="icon pa-2 rounded-circle"
              :class="iconsClass[type][index]"
              :style="iconsStyle[type][index]"
              @click.stop="onSelect(icon, type, index, true)"
            >
              <v-icon
                :color="icon.color || 'black'"
                :size="icon.size || 40"
                :icon="icons[type]"
              />
            </div>
          </div>

          <span
            v-for="(item, index) in taskField.texts"
            :key="`Text ${index}`"
            class="text pa-4 rounded-circle"
            :class="textsClass[index]"
            :style="textsStyle[index]"
            @click.stop="onSelect(item, 'texts', index)"
          >
            {{ item.text }}
          </span>

          <div
            v-for="(line, index) in taskField.lines"
            :key="`Line ${index}`"
            class="line pa-2"
            :class="linesClass[index]"
            :style="linesStyle[index]"
            @mousemove="mouseMove"
            @click.stop="onSelect(line, 'lines', index)"
          >
            <div
              style="height: 0"
              :style="`border-top: 3px ${line.dashed ? 'dashed' : 'solid'} ${
                line.color || 'black'
              }`"
            />
          </div>

          <div
            class="line pa-2"
            v-if="tempLine"
            :style="{
              left: `${tempLine.x}%`,
              top: `${tempLine.y}%`,
              width: `${tempLine.length}px`,
              transform: `rotate(${tempLine.angle}rad)`,
              '-webkit-transform': `rotate(${tempLine.angle}rad)` /* WebKit */,
              '-moz-transform': `rotate(${tempLine.angle}rad)` /* Mozilla */,
              '-o-transform': `rotate(${tempLine.angle}rad)` /* Opera */,
              '-ms-transform': `rotate(${tempLine.angle}rad)` /* IE */,
            }"
          >
            <div
              :style="`border-top: 3px ${
                tempLine.dashed ? 'dashed' : 'solid'
              } ${tempLine.color || 'black'}`"
            />
          </div>

          <div
            v-for="(square, index) in taskField.squares"
            :key="`Square ${index}`"
            class="square pa-2"
            :class="squaresClass[index]"
            :style="squaresStyle[index]"
            @click.stop="onSelect(square, 'squares', index)"
            @mousemove="mouseMove"
          >
            <div
              :style="{
                'background-color':
                  !square.color || square.color === 'black'
                    ? 'white'
                    : square.color,
                border: `2px solid ${square.borderColor || 'black'}`,
              }"
              style="width: 100%; height: 100%; opacity: 0.9"
            />
          </div>

          <div
            class="square pa-2"
            v-if="tempSquare"
            :style="{
              ...tempSquare,
              transform: 'translate(-8px, -8px)',
            }"
          >
            <div
              :style="{
                'background-color': iconColor === 'black' ? 'white' : iconColor,
                border: `2px solid ${borderColor}`,
              }"
              style="width: 100%; height: 100%; opacity: 0.9"
            />
          </div>

          <div v-if="showOverlay()" class="overlay" />

          <v-img
            v-if="taskField.field !== 'white'"
            :src="taskFieldBackground"
            width="840"
            height="600"
            contain
          />

          <div v-else style="width: 840px; height: 600px" />
        </div>
        <!-- Tool box -->
        <div
          class="tool-box d-flex flex-column align-center justify-center pa-1"
        >
          <ColorSelector @update="onUpdateColor" :selectedColor="iconColor" />

          <div v-show="selected && selected.type === 'squares'">
            <ColorSelector
              @update="onUpdateBorderColor"
              :selectedColor="borderColor"
              icon="mdi-border-color"
            />
          </div>
          <v-btn
            icon="mdi-cursor-move"
            color="green"
            class="mb-8"
            v-show="selected && selected.type !== 'squares'"
            @click="prepareMove"
          >
          </v-btn>

          <v-btn
            icon="mdi-rotate-left"
            color="yellow"
            class="mb-8"
            v-show="
              selected &&
              selected.type !== 'lines' &&
              selected.type !== 'squares'
            "
            @click="prepareRotate"
          />

          <v-btn
            icon="mdi-plus"
            color="blue"
            class="mb-8"
            v-show="
              selected &&
              selected.type !== 'lines' &&
              selected.type !== 'squares'
            "
            @click="updateSize(3)"
          />

          <v-btn
            icon="mdi-minus"
            color="blue"
            class="mb-8"
            v-show="
              selected &&
              selected.type !== 'lines' &&
              selected.type !== 'squares'
            "
            @click="updateSize(-3)"
          />

          <v-btn
            icon="mdi-format-title"
            color="purple"
            class="mb-8"
            v-show="selected && selected.type === 'texts'"
            @click="updateText"
          />

          <v-btn
            icon="mdi-delete"
            color="red"
            class="mb-8"
            v-show="selected"
            @click="onDeleteSelected"
          />
        </div>
      </div>
    </div>

    <v-dialog v-model="textDialog" max-width="500">
      <v-card class="pa-4 d-flex flex-column" v-if="text">
        <v-text-field v-model="text.text" id="field.text" autofocus />
        <v-btn dark @click="onWrite">Write</v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-model="resetDialog" max-width="500" persistent>
      <v-card class="pa-4 d-flex flex-column">
        <div class="d-flex justify-center mb-4">
          <h2>Are you sure to delete all data?</h2>
        </div>
        <div class="d-flex justify-space-around">
          <v-btn dark @click="resetDialog = false" color="warning">Cancel</v-btn
          ><v-btn dark @click="resetData" color="red">Delete</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import interact from "interactjs";

import Player from "./Player.vue";
import ColorSelector from "./ColorSelector.vue";

import football from "../assets/futbol.jpeg";
import futsal from "../assets/futsal.jpeg";
import half_football from "../assets/half_futbol.jpeg";
import half_futsal from "../assets/half_futsal.jpeg";

const fieldBackground = { football, futsal, half_football, half_futsal };

const icons = {
  balls: "mdi-soccer",
  cones: "custom:cone",
  tinyCones: "custom:tinyCone",
  goals: "custom:goal",
  picks: "custom:pitch",
  fences: "custom:fence",
  circles: "mdi-circle-outline",
  squares: "mdi-square-outline",
  texts: "mdi-text-recognition",
};

export default {
  name: "TaskField",
  components: { Player, ColorSelector },
  props: {
    fieldData: Object,
  },
  data: () => ({
    taskField: {
      field: "white",
      texts: [],
      players: [],
      lines: [],
      squares: [],
      icons: {
        circles: [],
        balls: [],
        cones: [],
        tinyCones: [],
        goals: [],
        picks: [],
        fences: [],
      },
    },

    tool: null,
    selected: null,

    text: null,
    line: null,
    square: null,

    tempLine: null,
    tempSquare: null,

    moving: null,
    rotate: null,

    iconColor: "black",
    borderColor: "black",

    textDialog: false,
    resetDialog: false,
    firstDraw: false,
  }),
  watch: {
    tool() {
      if (this.tool) {
        this.selected = null;
        this.line = null;
        this.tempLine = null;
        this.square = null;
        this.tempSquare = null;
        this.moving = null;
        this.rotate = null;
      }
    },
  },
  methods: {
    updateFieldData() {
      if (this.fieldData && !this.firstDraw) {
        const taskField = { ...this.taskField, ...this.fieldData };

        taskField.players = taskField.players.map((player) => ({ ...player }));

        const entries = Object.entries(taskField.icons);
        taskField.icons = entries.reduce((acc, [key, list]) => {
          const result = list.map((icon) => ({ ...icon }));
          return { ...acc, [key]: result };
        }, {});

        taskField.texts = taskField.texts.map((text) => ({ ...text }));
        taskField.lines = taskField.lines.map((line) => ({ ...line }));

        this.taskField = taskField;
        this.firstDraw = true;
      }
    },
    setTaskField(field) {
      this.taskField.field = field;
    },
    setTool(tool) {
      this.tool = this.tool !== tool ? tool : null;
    },
    onSelect(item, type, index, isIcon) {
      if (this.moving || this.rotate) return;
      this.selected = { item, type, index, isIcon };
      this.iconColor = item.color || "black";
      if (type === "squares" && item.borderColor)
        this.borderColor = item.borderColor;
      this.tool = null;
    },
    getSelectedItem() {
      let item;
      if (this.selected.isIcon)
        item = this.taskField.icons[this.selected.type][this.selected.index];
      else item = this.taskField[this.selected.type][this.selected.index];

      return item;
    },
    isSelected(type, index) {
      return this.selected?.index === index && this.selected?.type === type;
    },
    clickField(event) {
      this.moving = null;
      this.rotate = null;
      this.selected = null;

      if (this.tool) {
        const toolUtil = {
          players: this.placePlayer,
          texts: this.placeText,
          squares: this.square ? this.endSquare : this.startSquare,
          lines: this.line ? this.endLine : this.startLine,
          dashed: this.line ? this.endLine : this.startLine,
        };
        (toolUtil[this.tool] || this.placeIcon)(event);
      }
    },
    getItem({ clientX, clientY }, size) {
      const rect = this.$refs.field.getBoundingClientRect();

      const distancePxX = clientX - rect.left;
      const distancePxY = clientY - rect.top;

      const x = (distancePxX * 100) / 864;
      const y = (distancePxY * 100) / 624;

      return { x, y, color: this.iconColor, size: size || 40 };
    },
    placePlayer(event) {
      const newPlayer = this.getItem(event);

      const players = [...this.taskField.players, newPlayer];

      this.taskField.players = players;
      this.onSelect(newPlayer, "players", players.length - 1);
    },
    placeIcon(event) {
      const newIcon = this.getItem(event);

      const icons = [...this.taskField.icons[this.tool], newIcon];

      this.taskField.icons[this.tool] = icons;
      this.onSelect(newIcon, this.tool, icons.length - 1, true);
    },
    placeText(event) {
      const newText = this.getItem(event, 18);
      newText.text = "";

      this.text = newText;
      this.textDialog = true;
    },
    onWrite() {
      if (this.text?.x) {
        const texts = [...this.taskField.texts, this.text];
        this.taskField.texts = texts;
        this.onSelect(this.text, "texts", texts.length - 1);
      } else {
        const text = this.getSelectedItem();
        text.text = this.text.text;
      }

      this.textDialog = false;
      this.text = null;
    },
    mouseMove({ layerX, layerY, clientX, clientY }) {
      if (this.line)
        this.tempLine = this.calcLine(this.line.x, this.line.y, layerX, layerY);
      else if (this.square) {
        const square = this.calcSquare(clientX, clientY);
        this.tempSquare = {
          left: `${square.left}%`,
          top: `${square.top}%`,
          right: `${square.right}%`,
          bottom: `${square.bottom}%`,
        };
      }
    },
    startSquare({ clientX, clientY }) {
      const rect = this.$refs.field.getBoundingClientRect();

      const distancePxX = clientX - rect.left;
      const distancePxY = clientY - rect.top;

      const x = (distancePxX * 100) / 864;
      const y = (distancePxY * 100) / 624;
      this.square = { x, y };
    },
    endSquare({ clientX, clientY }) {
      const newSquare = this.calcSquare(clientX, clientY);

      let squares = [];
      if (this.taskField.squares)
        squares = [...this.taskField.squares, newSquare];
      else squares = [newSquare];

      this.taskField.squares = squares;

      this.onSelect(newSquare, "squares", squares.length - 1);

      this.square = null;
      this.tempSquare = null;
    },
    calcSquare(clientX, clientY) {
      const rect = this.$refs.field.getBoundingClientRect();

      const distancePxX = clientX - rect.left;
      const distancePxY = clientY - rect.top;

      const x = (distancePxX * 100) / 864;
      const y = (distancePxY * 100) / 624;

      const x1 = Math.min(this.square.x, x);
      const y1 = Math.min(this.square.y, y);
      const x2 = 100 - Math.max(this.square.x, x);
      const y2 = 100 - Math.max(this.square.y, y);

      return {
        left: x1,
        top: y1,
        right: x2,
        bottom: y2,
        color: this.iconColor,
        borderColor: this.borderColor,
      };
    },
    startLine({ layerX, layerY }) {
      this.line = { x: layerX, y: layerY };
    },
    endLine({ layerX, layerY }) {
      const { x, y } = this.line;

      const newLine = this.calcLine(x, y, layerX, layerY);

      const lines = [...this.taskField.lines, newLine];
      this.taskField.lines = lines;
      this.onSelect(lines, "lines", lines.length - 1);

      this.tempLine = null;
      this.line = null;
    },
    calcLine(x1, y1, x2, y2) {
      const diffX = x1 - x2 - 8;
      const diffY = y1 - y2 - 8;
      const length = Math.sqrt(diffX ** 2 + diffY ** 2);

      const sx = (x1 + x2) / 2;
      const sy = (y1 + y2) / 2;

      const x = sx - length / 2;
      const y = sy;

      const positionX = (x * 100) / 864;
      const positionY = (y * 100) / 624;

      const angle = Math.PI - Math.atan2(-diffY, diffX);

      const dashed = this.tool === "dashed";

      const newLine = {
        x: positionX,
        y: positionY,
        length,
        angle,
        dashed,
        color: this.iconColor,
      };
      return newLine;
    },
    onDeleteSelected() {
      const selectedType = this.selected.type;

      let list;
      if (this.selected.isIcon) list = this.taskField.icons[selectedType];
      else
        list =
          this.taskField[selectedType === "dashed" ? "lines" : selectedType];

      const result = list.filter(
        (item, index) => index !== this.selected.index
      );

      if (this.selected.isIcon) this.taskField.icons[selectedType] = result;
      else this.taskField[selectedType] = result;

      this.selected = null;
    },
    prepareMove() {
      this.moving = { x: 0, y: 0 };
      this.rotate = null;
    },
    onDragMove({ dx, dy }) {
      this.moving = { x: this.moving.x + dx, y: this.moving.y + dy };
    },
    onDragEnd() {
      const { x, y } = this.moving;

      const distanceX = (x * 100) / 864;
      const distanceY = (y * 100) / 624;

      const icon = this.getSelectedItem();

      icon.x += distanceX;
      icon.y += distanceY;

      this.moving = null;
    },
    prepareRotate() {
      this.rotate = 0;
      this.moving = null;
    },
    onRotateMove({ clientX, clientY }) {
      const rect = this.$refs.field.getBoundingClientRect();

      const pxPlayerX = (this.selected.item.x * 864) / 100;
      const pxPlayerY = (this.selected.item.y * 624) / 100;
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const angle =
        (Math.atan2(pxPlayerY - mouseY, pxPlayerX - mouseX) * 180) / Math.PI;

      this.rotate = angle + 90;
    },
    onRotateEnd() {
      const selectedItem = this.getSelectedItem();
      selectedItem.angle = this.rotate;
      this.rotate = null;
    },
    resetData() {
      this.taskField = {
        field: "white",
        texts: [],
        players: [],
        lines: [],
        squares: [],
        icons: {
          circles: [],
          balls: [],
          cones: [],
          tinyCones: [],
          goals: [],
          picks: [],
          fences: [],
        },
      };

      this.tool = null;
      this.selected = null;
      this.moving = null;
      this.rotate = null;
      this.iconColor = "black";
      this.resetDialog = false;
    },
    updateSize(number) {
      const item = this.getSelectedItem();
      const defaultItem = this.selected.type === "texts" ? 18 : 40;
      const size = (item.size || defaultItem) + number;

      const selected = this.getSelectedItem();
      selected.size = size;
    },
    updateText() {
      this.textDialog = true;
      this.text = { text: this.selected.item.text };
    },
    onUpdateColor(color) {
      this.iconColor = color;
      if (this.selected) {
        const selected = this.getSelectedItem();
        selected.color = color;
      }
    },
    onUpdateBorderColor(color) {
      this.borderColor = color;
      if (this.selected) {
        const selected = this.getSelectedItem();
        selected.borderColor = color;
      }
    },
    getDefaultStyles(item, type, index) {
      let angle = item.angle || 0;

      let translateX = -16 - (item.size ? item.size / 4 : 10);
      let translateY = -16 - (item.size ? item.size / 4 : 10);

      const selected = this.isSelected(type, index);
      if (selected) {
        if (this.moving) {
          translateX += this.moving.x;
          translateY += this.moving.y;
        }

        if (this.rotate !== null) angle += this.rotate;
      }

      const transform = `translate(${translateX}px, ${translateY}px) rotate(${angle}deg)`;

      return {
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: transform,
        "-webkit-transform": transform /* WebKit */,
        "-moz-transform": transform /* Mozilla */,
        "-o-transform": transform /* Opera */,
        "-ms-transform": transform /* IE */,
      };
    },
    getIconClass(type, index) {
      const selected = this.isSelected(type, index);
      return {
        "icon-selected": selected,
        "icon-move": this.moving && selected,
        "icon-rotate": this.rotate !== null && selected,
        "hover-select": true, // !this.selected
      };
    },
    showOverlay() {
      return !!this.moving || !!this.tool || !!this.line || !!this.square;
    },
  },
  computed: {
    icons() {
      return icons;
    },
    iconsEntries() {
      return Object.entries(this.icons);
    },
    playersStyle() {
      return this.taskField.players.map((player, index) =>
        this.getDefaultStyles(player, "players", index)
      );
    },
    playersClass() {
      return this.taskField.players.map((player, index) =>
        this.getIconClass("players", index)
      );
    },
    iconsStyle() {
      const entries = Object.entries(this.taskField.icons);
      return entries.reduce((acc, [key, value]) => {
        const icons = value.map((icon, index) => ({
          ...this.getDefaultStyles(icon, key, index),
          fill: icon.color || "black",
        }));

        return { ...acc, [key]: icons };
      }, {});
    },
    iconsClass() {
      const entries = Object.entries(this.taskField.icons);
      return entries.reduce((acc, [key, value]) => {
        const list = value.map((icon, index) => this.getIconClass(key, index));
        return { ...acc, [key]: list };
      }, {});
    },
    textsStyle() {
      return this.taskField.texts.map((text, index) => ({
        ...this.getDefaultStyles(text, "texts", index),
        "font-size": `${text.size || 18}px`,
        color: text.color || "black",
      }));
    },
    textsClass() {
      return this.taskField.texts.map((text, index) =>
        this.getIconClass("texts", index)
      );
    },
    squaresStyle() {
      return this.taskField.squares.map((square, index) => {
        let translateX = -8;
        let translateY = -8;

        const selected = this.isSelected("squares", index);

        if (selected) {
          if (this.moving) {
            translateX += this.moving.x;
            translateY += this.moving.y;
          }
        }

        const transform = `translate(${translateX}px, ${translateY}px)`;

        return {
          left: `${square.left}%`,
          top: `${square.top}%`,
          right: `${square.right}%`,
          bottom: `${square.bottom}%`,
          transform: transform,
          "-webkit-transform": transform /* WebKit */,
          "-moz-transform": transform /* Mozilla */,
          "-o-transform": transform /* Opera */,
          "-ms-transform": transform /* IE */,
        };
      });
    },
    squaresClass() {
      return this.taskField.squares.map((square, index) =>
        this.getIconClass("squares", index)
      );
    },
    linesStyle() {
      return this.taskField.lines.map((line, index) => {
        let translateX = -8;
        let translateY = -8;

        if (this.moving && this.isSelected("lines", index)) {
          translateX += this.moving.x;
          translateY += this.moving.y;
        }

        const transform = `translate(${translateX}px, ${translateY}px) rotate(${line.angle}rad)`;

        return {
          left: `${line.x}%`,
          top: `${line.y}%`,
          width: `${line.length}px`,
          transform: transform,
          "-webkit-transform": transform /* WebKit */,
          "-moz-transform": transform /* Mozilla */,
          "-o-transform": transform /* Opera */,
          "-ms-transform": transform /* IE */,
        };
      });
    },
    linesClass() {
      return this.taskField.lines.map((line, index) =>
        this.getIconClass("lines", index)
      );
    },
    taskFieldBackground() {
      return fieldBackground[this.taskField.field];
    },
  },
  mounted() {
    if(this.fieldData) this.updateFieldData();

    interact(".icon-move").draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: this.$refs.field,
        }),
      ],
      autoScroll: true,
      listeners: {
        move: this.onDragMove,
        end: this.onDragEnd,
      },
    });

    interact(".icon-rotate").draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: this.$refs.field,
          endOnly: true,
        }),
      ],
      autoScroll: true,
      listeners: {
        move: this.onRotateMove,
        end: this.onRotateEnd,
      },
    });
  },
};
</script>

<style lang="sass" scoped>
.field
  border: solid 4px black
  background-color: white
  position: relative
  overflow: hidden

.overlay
  position: absolute
  z-index: 10
  background-color: lightgray
  opacity: 0.8
  width: 100%
  height: 100%
  transform: translate(-8px, -8px)

.text
  position: absolute
  color: black
  z-index: 6

.icon
  position: absolute
  z-index: 5

.line
  position: absolute
  z-index: 4

.square
  position: absolute
  z-index: 3

.drawing
  z-index: 11 !important

.icon-move
  background-color: lightgreen !important
  z-index: 11 !important

.icon-rotate
  background-color: yellow !important
  z-index: 11 !important

.icon-selected
  background-color: lightblue
  opacity: 0.9

.tool-selected
  background-color: lightblue
  border-radius: 10px

.tool-box
  background-color: white
  border: 3px solid black
  min-height: 624px

.hover-select:hover
  background-color: lightblue
  opacity: 0.8
</style>
