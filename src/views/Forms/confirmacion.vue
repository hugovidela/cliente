<template>
  <v-row justify="center">
    <v-dialog v-model="visible" max-height="400" max-width="500">
      <v-card>
        <v-card-title class="fg150b">{{title}}</v-card-title>
        <v-card-text class="fg"><span v-html="body"></span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-show="buttons.indexOf('Anular')>=0"
            color="green" dark autofocus
            class="fg85"
            @click="handleClick('Anular')">
            Anular
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Posponer')>=0"
            color="indigo darken-2" dark autofocus
            class="fg85"
            @click="handleClick('Posponer')">
            Posponer
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Incorporar')>=0"
            color="green" dark autofocus
            class="fg85"
            @click="handleClick('Incorporar')">
            Incorporar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Aceptar')>=0"
            color="indigo darken-2"
            dark autofocus
            class="fg85"
            @click="handleClick('Aceptar')">
            Aceptar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Cancelar')>=0"
            color="grey" dark
            class="fg85"
            @click="handleClick('Cancelar')">
            Cancelar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Ignorar')>=0"
            color="blue" dark
            class="fg85"
            @click="handleClick('Ignorar')">
            Ignorar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Cerrar')>=0"
            color="black" dark
            class="fg85"
            @click="handleClick('Cerrar')">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

/* eslint-disable */
export default {
  props: {
    title: String,
    body: String,
    visible: Boolean,
    buttons: Array,
  },

  data: () => ({
  }),
  methods: {
    handleClick(op) {
      this.$emit('click', op);
    },
  },
};
</script>

<style scoped>
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg100b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    font-weight: bold;
  }
  .fg115b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 115%;
    font-weight: bold;
  }
  .fg135b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 135%;
    font-weight: bold;
  }
  .fg150b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 150%;
    font-weight: bold;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .fg70 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 70%;
  }
</style> 