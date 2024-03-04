<template>
  <v-layout align-start class="fg">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="fg elevation-3"
        :footer-props="{
          itemsPerPageOptions: [9],
          showFirstLastPage: true,
          showCurrentPage: true,
          nextIcon: 'mdi-arrow-right-drop-circle-outline',
          prevIcon: 'mdi-arrow-left-drop-circle-outline',
        }">
        <template v-slot:top>
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              icon @click="closeForm">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <template v-slot:extension>
              <v-btn
                fab
                :color="temas.forms_btn_xls_bg"
                :dark="temas.forms_btn_xls_dark==true"
                @click='exportarAXLS'>
                <v-icon>mdi-file-excel</v-icon>
              </v-btn>
              <v-btn
                fab
                :color="temas.forms_btn_pdf_bg"
                :dark="temas.forms_btn_pdf_dark==true"
                @click='exportarAPDF'>
                <v-icon>mdi-file-pdf</v-icon>
              </v-btn>
            </template>

            <v-toolbar-title class="fg white--text">Cotización de Monedas</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              :color="temas.forms_titulo_bg"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>

        <template v-slot:item.fecha="{ item }">
          <span>{{ formatoFecha(item.fecha) }}</span>
        </template>
        <template v-slot:item.oficialcompra="{ item }">
          <span>${{ formatoImporte(item.oficialcompra) }}</span>
        </template>
        <template v-slot:item.oficialventa="{ item }">
          <span>${{ formatoImporte(item.oficialventa) }}</span>
        </template>
        <template v-slot:item.nooficialcompra="{ item }">
          <span>${{ formatoImporte(item.nooficialcompra) }}</span>
        </template>
        <template v-slot:item.nooficialventa="{ item }">
          <span>${{ formatoImporte(item.nooficialventa) }}</span>
        </template>


      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>

/* https://medium.com/js-dojo/how-to-build-a-reusable-vuejs-modal-component-fc8d7f3b4735 */

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';

export default {
  data: () => ({
    modelo: 'cotizaciones',
    search: '',
    items: [],
    headers: [
      { text: 'Fecha',        value:'fecha'},
      { text: 'Moneda',       value:'moneda.nombre'},
      { text: 'Of.Compra',    value:'oficialcompra'},
      { text: 'Of.Venta',     value:'oficialventa'},
      { text: 'No Of.Compra', value:'nooficialcompra'},
      { text: 'No Of.Venta',  value:'nooficialventa'},
    ],
    editedIndex: -1,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState(['temas']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Publicación' : 'Editar Publicación';
    },
  },
  watch: {
    dialog (val) {
      val || this.cancelar();
    },
  },
  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      return this.listarHTTP()
    }
  },


  methods: {
    ...mapMutations(['alert','closeAlert']),
    closeForm(){
      router.push('/')
    },


    getColor (activo) {
      return (activo === 1) ? 'green' : 'orange'
    },


    listarHTTP:function() {
      return HTTP().get('/cotizaciones/').then(({ data }) => {
        this.items = data
      });
    },


    exportarAPDF () {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Exportar a PDF'
      this.msg.msgBody = 'Desea exportar los datos a PDF'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a PDF'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },


    exportarAXLS () {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Exportar a XLS'
      this.msg.msgBody = 'Desea exportar los datos a XLS'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a XLS'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },


    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },


    formatoFecha(value) {
      return moment(String(value)).format('L')
    },


    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },
  },
};
</script>

<style scoped>
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
</style>

