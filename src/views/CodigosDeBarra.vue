<template>
  <v-layout align-start>
    <v-flex>
      <v-dialog v-model="dialog" :fullscreen="true" persistent
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-toolbar
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="closeForm">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg">
            Códigos de Barra / {{empresa}}
          </span>
        </v-toolbar>
        <v-card class="fg">
          <form method="POST" action="upload" enctype="multipart/form-data">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="4" sm="4" class="pt-0 pb-0">
                    <v-text-field
                      v-model="search"
                      clearable
                      :color="temas.forms_titulo_bg"
                      append-icon="search"
                      label="Texto a Buscar"
                      single-line hide-details
                      class="pt-0">
                    </v-text-field>
                  </v-col>
                  <v-col cols="2" sm="2" class="pt-0 pb-0">
                    <v-btn
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="pt-0 white--text"
                      @click="buscarArticulos">
                      Buscar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </form>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="codigo"
            dense
            class="pl-1 pr-3 elevation-3"
            :footer-props="{
              itemsPerPageOptions: [8],
              showFirstLastPage: true,
              showCurrentPage: true,
              nextIcon: 'mdi-arrow-right-drop-circle-outline',
              prevIcon: 'mdi-arrow-left-drop-circle-outline',
            }">
            <template v-slot:item.codigo="{ item }">
              <span class="mini-font">{{ item.codigo }}</span>
            </template>
            <template v-slot:item.nombre="{ item }">
              <span class="mini-font">{{ item.nombre }}</span>
            </template>
            <template v-slot:item.precios[0].nomgru="{ item }">
              <span class="mini-font">{{ item.precios[0].nomgru }}</span>
            </template>
            <template v-slot:item.precios[0].nommar="{ item }">
              <span class="mini-font">{{ item.precios[0].nommar }}</span>
            </template>
            <template v-slot:item.codbar="{ item }">
              <barcode v-if="item.codbar!=null"
                :tag="tag"
                width=1
                height=20
                fontSize=12
                :value="item.codbar">
              </barcode>
            </template>
            <template v-slot:item.accion="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mr-2" fab icon small
                    :color="temas.forms_btn_editar_bg"
                    :dark="temas.forms_btn_editar_dark==true"
                    @click="editar(item)" v-on="on">
                    <v-icon>mdi-stocking</v-icon>
                  </v-btn>
                </template>
                <span>Editar Código de Barra</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-if="item.codbar!=null"
                    class="mr-2" fab icon small
                    :color="temas.forms_btn_editar_bg"
                    :dark="temas.forms_btn_editar_dark==true"
                    @click="borrar(item)" v-on="on">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar Código de Barra</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-dialog>

      <!-- EDICION DE CODBAR-->
      <v-dialog v-model="dialogCodBar" max-width="450px" max-height="350px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="dialogCodBar=false">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="fg">CODIGO DE BARRA</span>
            <v-spacer></v-spacer>
            <v-btn
              v-if="codbar!=''"
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="ma-2 white--text"
              @click="confirmarCodBarHTTP(item)">
              Guardar
            </v-btn>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <span>
                  {{ sayArticulo() }}
                </span>
                <v-card max-width="430"
                  style="height: 330px;" class="overflow-y-auto" max-height="230">
                  <v-sheet class="pa-4">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <barcode
                          :tag="tag"
                          :value="codbar">
                        </barcode>
                        <v-text-field
                          ref="nombre"
                          v-model="codbar"
                          autofocus
                          label="Código de Barra"
                          :color="temas.forms_titulo_bg"
                          required
                          :counter="14"
                          maxlength="14"
                          class="pt-0 pb-0">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </v-card>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN EDICION DEL CODBAR -->

      <Confirmacion v-model='msg.msgAccion'
        :title=this.msg.msgTitle
        :body=this.msg.msgBody
        :visible=this.msg.msgVisible
        :buttons=this.msg.msgButtons
        @click="msgRespuesta">
      </Confirmacion>
    </v-flex>
  </v-layout>
</template>
<script>

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import VueBarcode from 'vue-barcode';
import Confirmacion from "./Forms/confirmacion.vue"

export default {
  components: {
    Confirmacion,
    'barcode': VueBarcode,
  },
  data: () => ({
    tag: 'svg',
    codbar: '',
    dialog: true,
    dialogCodBar: false,
    itemActual: null,
    items: [],
    item: null,
    headers: [],
    search: '',
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    headers: [
      { text: 'CODIGO', value: 'codigo', width: 150, align: 'left' },
      { text: 'NOMBRE', value: 'nombre', width: 500, align: 'left' },
      { text: 'MARCA',  value: 'precios[0].nommar', width: 180, align: 'left' },
      { text: 'GRUPO',  value: 'precios[0].nomgru', width: 180, align: 'left' },
      { text: 'CODIGO DE BARRA',   value: 'codbar',   width: 120, align: 'left' },
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],

  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'vinculosPadres', 'vinculosPadresLic', 'vinculosHijos', 'empresa', 'temas', 'externo', 'codigooid', 'descuentos', 'transition'
    ]),
  },

  watch: {
    //search () {
    //  this.listarHTTP()
    //}
  },

  mounted () {
    this.dialog = true;
    this.listarHTTP();
  },

  methods: {
    closeForm(){
      this.dialog = false;
      router.push('/')
    },

    sayArticulo() {
      return this.itemActual!=null?this.itemActual.nombre+'-('+this.itemActual.codigo+')':''
    },

    editar (item) {
      this.dialogCodBar = true;
      this.codbar = item.codbar;
      this.itemActual = item;
    },

    borrar (item) {
      return HTTP().post('/deletecodbar', {id: item.id }).then(({ data }) => {
        if (data=='ok') {
          this.msg.msgTitle = 'Código de Barra Eliminado'
          let m = '¡El código de barra se ha eliminado!.<br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'codigo de barra existente'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = 'Se ha producido un error en la eliminación del código de barra.<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'codigo de barra error'
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialogCodBar = false;
        this.listarHTTP(false)
      })
    },

    confirmarCodBarHTTP() {
      return HTTP().post('/updatecodbar', {id: this.itemActual.id, codbar: this.codbar }).then(({ data }) => {
        if (data.msg=='ya existe') {
          this.msg.msgTitle = 'Código de Barra Existente'
          let m = '<br>¡El código de barra <b>'
          m += this.codbar + '</b></b> ya existe!.<br><br>'
          m += 'Esta asignado al artículo:<br><br>'
          m += 'Cód: <b>'+data.cod+'</b><br>'
          m += 'Nom: <b>'+data.nom+'</b><br><br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'codigo de barra existente'
          this.msg.msgButtons = ['Aceptar']
        } else if (data!='error') {
          this.mensaje('Se ha asignado correctamente el codigo de barra.', this.temas.forms_titulo_bg, 2000)
        } else {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = 'Se ha producido un error en la asignación del código de barra.<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'codigo de barra error'
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialogCodBar = false;
        this.listarHTTP(false)
      })
    },

    msgRespuesta(op) {
      this.msg.msgVisible = false;
    },

    buscarArticulos() {
      this.listarHTTP()
    },

    listarHTTP() {
      if (this.search==null) this.search = '';
      let s = this.search.length>0 ? this.search.trim() : '';
      return HTTP().post('/articuloz', {
        search: s,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: true, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: 300 }).then(({ data })=>{
        if (data.length>0) {
          this.itemActual = data[0]
          this.items = data;
        } else {
          this.items = []
        }
      })
      .catch(err => {
        console.log(err)
      })
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

  }

}
/* 606 */
</script>

<style scoped lang="scss">
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
</style> 
