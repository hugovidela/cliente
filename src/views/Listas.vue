<template>
  <v-layout align-start class="fg">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-3"
        :footer-props="{
          itemsPerPageOptions: [10],
          showFirstLastPage: true,
          showCurrentPage: true,
          nextIcon: 'mdi-arrow-right-drop-circle-outline',
          prevIcon: 'mdi-arrow-left-drop-circle-outline',
        }"
        >
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
                :color="temas.forms_btn_add_bg"
                :dark="temas.forms_btn_add_dark==true"
                @click="nuevaLista">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>

            <v-toolbar-title>Listas de Precios</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="600px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card class="fg">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelar">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span>{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="cargaOk()"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="confirmar">
                    Confirmar
                  </v-btn>
                </v-toolbar>

                <v-form ref="form" class="fg">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="12" md="12" class="pl-6 pt-6 bt-0">

                        <v-row class="pl-4 pr-4">
                          <v-col cols="12" sm="12">
                            <v-text-field
                              autofocus
                              ref="descripcion"
                              v-model="editadoLista.nombre"
                              class="text--left"
                              label="Nombre de la Lista"
                              :color="temas.forms_titulo_bg">
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row class="pl-4 pr-4">
                          <v-col cols="12" sm="4">
                            <v-text-field
                              v-model="editadoLista.desc1"
                              class="text--left"
                              label="% de descuento 1"
                              :color="temas.forms_titulo_bg">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-text-field
                              v-model="editadoLista.desc2"
                              class="text--left"
                              label="% de descuento 2"
                              :color="temas.forms_titulo_bg">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4"
                            class="pt-3 pb-0">
                            <v-switch
                              label="Activa"
                              :color="temas.forms_titulo_bg"
                              v-model="editadoLista.activo">
                            </v-switch>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" md="8" class="pl-7 pt-0">
                            <v-select
                              label="Medio de Pago"
                              v-model="editadoLista.medio_id"
                              :color="temas.forms_titulo_bg"
                              :items="medItems"
                              item-value="id"
                              item-text="nombre"
                              autocomplete>
                            </v-select>
                          </v-col>
                          <v-col cols="12" md="4" class="pl-7 pt-0">
                            <v-text-field
                              v-model="editadoLista.dias"
                              type="number"
                              class="text--left"
                              label="Días"
                              :color="temas.forms_titulo_bg">
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

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

        <template v-slot:item.desc1="{ item }">
          <span>%{{ formatoImporte(item.desc1) }}</span>
        </template>
        <template v-slot:item.desc2="{ item }">
          <span>%{{ formatoImporte(item.desc2) }}</span>
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip
            :color="getColor(item.activo)"
            :dark="item.activo
            ?temas.forms_btn_activo_dark==true
            :temas.forms_btn_inactivo_dark==true">
            {{item.activo?'Sí':'No'}}
          </v-chip>
        </template>
        <template v-slot:item.accion="{ item }">

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_editar_bg"
                :dark="temas.forms_btn_editar_dark==true"
                @click="editar(item)" v-on="on">
                <v-icon dark>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_borrar_bg"
                :dark="temas.forms_btn_borrar_dark==true"
                @click="preguntoBorrar(item)" v-on="on">
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Borrar Lista</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_add_bg"
                :dark="temas.forms_btn_add_dark==true"
                @click="clientesqueusanlalista(item)" v-on="on">
                <v-icon dark>mdi-account-multiple</v-icon>
              </v-btn>
            </template>
            <span>Clientes</span>
          </v-tooltip>

        </template>
      </v-data-table>

      <!-- AGREGAR Y QUITAR CLIENTES A LA LISTA -->
      <v-dialog v-model="dialogClientes" max-width="900px" max-height="600px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="dialogClientes=false">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span>
              Agregar y Quitar Clientes a ->
              {{ itemActual!=null?itemActual.id+' '+itemActual.nombre:'' }}
            </span>
            <v-spacer></v-spacer>
            <v-btn
              @click="aplicarCambiosListas"
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="ma-2 white--text">
              Aplicar Cambios
            </v-btn>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-card max-width="900"
                  style="height: 545px;"
                  v-scroll.self="onScroll"
                  class="overflow-y-auto"
                  max-height="600">
                  <v-card-text>
                    <v-data-table
                      v-model="selected"
                      :headers="headersClientes"
                      :items="clientes"
                      :search="searchClientes"
                      dense
                      :single-select="false"
                      item-key="id"
                      show-select
                      :footer-props="{
                        itemsPerPageOptions: [13],
                        showFirstLastPage: true,
                        showCurrentPage: true,
                        nextIcon: 'mdi-arrow-right-drop-circle-outline',
                        prevIcon: 'mdi-arrow-left-drop-circle-outline',
                      }"
                      @toggle-select-all="selectAll">
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN DIALOG BUSCAR ARTICULOS -->


      <SBar></SBar>
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

/* https://medium.com/js-dojo/how-to-build-a-reusable-vuejs-modal-component-fc8d7f3b4735 */

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from './Forms/confirmacion.vue';

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    modelo: 'listas',
    progress: false,
    scrollInvoked: 0,

    itemActual: null,
    selected: [],
    clientes: [],
    medItems: [],
    items: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 80 || 'Ingrese hasta 80 caracteres'
    ],
    search: '',
    searchClientes: '',
    dialog: false,
    dialogClientes: false,
    
    editadoLista: {
      id: null, nombre: null, medio_id: null, dias: null, desc1: null, desc2: null, activo: null,
    },

    editadoDefaultLista: {
      id: null, nombre: null, medio_id: null, dias: null, desc1: null, desc2: null, activo: true,
    },

    headers: [
      { text: 'Id', value:'id', width: 70, align: 'right'},
      { text: 'Nombre', value:'nombre', width: 150, align: 'left'},
      { text: 'Desc1', value:'desc1', width: 80, align: 'end'},
      { text: 'Desc2', value:'desc2', width: 80, align: 'end'},
      { text: 'Clientes', value:'usersterceros.length', width: 80, align: 'end'},
      { text: 'Activo', value:'activo', width: 60},
      { text: 'ACCIONES', value:'accion', width: 150, sortable: false },
    ],

    headersClientes: [
      { text: 'Id', value:'id', width: 50, align: 'end'},
      { text: 'Nombre', value:'nombre', width: 300, align: 'left'},
    ],
    editedIndex: -1,
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
        'vinculosPadres', 'vinculosPadresLic', 'vinculosPadresAll', 'vinculosHijos', 'empresa', 'temas', 'dolar', 'externo', 'tipo', 'codigooid',
        'cttLoadReg', 'descuentos', 'transition'
      ]),
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Lista' : 'Editar Lista';
    },
  },

  watch: {
    dialog (val) {
      val || this.cancelar();
    },
    searchClientes() {
      this.filtrarClientes()
    }
  },

  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
    this.dialog = false;
    return HTTP().get('/mediosdepagosmenosctacte').then(({ data }) => {
      this.medItems = data
      this.listarHTTP();
    });
  },
  
  methods: {
   ...mapMutations(['alert','closeAlert']),
   closeForm(){
     router.push('/')
    },

    listarHTTP:function() {
      debugger
      return HTTP().get('/listas/'+this.userId).then(({ data }) => {
        debugger
        this.items = data;
      });
    },

    editar (item) {
      this.itemActual = item
      this.editedIndex = this.items.indexOf(item);
      this.editadoLista.id = item.id;
      this.editadoLista.medio_id = item.medio_id
      this.editadoLista.dias = item.dias
      this.editadoLista.nombre = item.nombre;
      this.editadoLista.desc1 = this.roundTo(item.desc1,2);
      this.editadoLista.desc2 = this.roundTo(item.desc2,2);
      this.editadoLista.activo = item.activo;
      this.dialog = true;
    },

    nuevaLista() {
      this.editedIndex = -1;
      this.searchArticulos = '';
      this.dialog = true;
      this.editadoLista = Object.assign({}, this.editadoDefaultLista);
    },

    altaHTTP:function() {
      return HTTP().post('/'+this.modelo, {
        id: this.editadoLista.id,
        nombre: this.editadoLista.nombre,
        medio_id: this.editadoLista.medio_id,
        dias: this.editadoLista.dias,
        desc1: this.editadoLista.desc1,
        desc2: this.editadoLista.desc2,
        activo: this.editadoLista.activo,
        }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Se ha producido un error al crear la lista!', 'black', 1500) 
          } else {
            this.mensaje('¡La lista se ha creado con éxito!', 'black', 1500) 
          }
          this.listarHTTP();
        });
    },

    editarHTTP:function(data) {
      return HTTP().patch(`${this.modelo}/${this.itemActual.id}`, data).then((data) => {
        if (data=='error') {
          this.mensaje('¡Se ha producido un error al actualizar la lista!', 'black', 1500) 
        } else {
          this.mensaje('¡Actualización Exitosa!', 'black', 1500) 
        }
        this.listarHTTP();
      });       
    },

    borrarHTTP:function(data) {
      debugger
      return HTTP().delete(`/${this.modelo}/${data.id}`).then((data) => {
        debugger
        if (data.data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 2500)
        } else {
          this.mensaje('¡Se ha eliminado la lista de precios correctamente!', this.temas.forms_titulo_bg, 2500)
        }
        this.listarHTTP();
      }).catch((err)=>{
        this.mensaje('¡Opps, se ha producido un error al intentar eliminar este registro!', this.temas.snack_error_bg, 2500) 
      })
    },

    preguntoBorrar (item) {
      this.msg.msgTitle = 'Borrar Lista de Precios'
      let m='<br>'
      if (item.usersterceros.length>0) {
        if (item.usersterceros.length==1) {
          m += 'Atención: ¡Esta Lista esta asignada a un Cliente!<br>'
        } else {
          m += 'Atención: ¡Esta Lista esta asignada a '+ item.usersterceros.length + ' Clientes!<br>'
        }
      }
      m += 'Confirmas borrar <b>'+item.nombre+'</b><br><br>'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    selectAll(event) {
      if (event.value) {
        this.selected = this.clientes
      } else {
        this.selected = []
      }
    },

    clientesqueusanlalista (item) {
      this.itemActual = item
      return HTTP().get('/clienteslistasdeprecios/'+item.id).then(({data})=>{
        debugger
        this.clientes = data
        this.selected = []
        for (let i=0; i<=data.length-1; i++) {
          if (data[i].lista) {
            this.selected.push(data[i])
          }
        }
        this.dialogClientes = true
      })
      .catch(err => {
        console.log(err)
      })
    },

    aplicarCambiosListas() {
      debugger
      return HTTP().post('/clienteslistasdepreciosagregarquitar', { lista: this.itemActual.id, selected: this.selected }).then(({ data })=>{
        debugger
        if (data.data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 2500)
        } else {
          this.mensaje('¡Se han actualizado las lista para los clientes seleccionados!', this.temas.forms_titulo_bg, 2500)
        }
        this.dialogClientes = false
        this.listarHTTP();
      }).catch((err)=>{
        this.mensaje('¡Opps, se ha producido un error al intentar eliminar este registro!', this.temas.snack_error_bg, 2500) 
      })

    },

    confirmar() {
      // NO SE PUEDE CREAR UNA REGLA GLOBAL SI HAY OTRAS ACTIVAS
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      if (this.editedIndex > -1) { // esta modificando
        this.editarHTTP(this.editadoLista);
      } else {
        this.altaHTTP();
      }
      this.cancelar();
    },

    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHttp(this.items[index].id);
    },

    cancelar() {
      this.dialog = false;
      this.editadoLista = Object.assign({}, this.editadoDefaultLista);
      this.editedIndex = -1;
    },

    cargaOk() {
      let ok = true
      if (this.editadoLista.nombre==''||
          this.editadoLista.desc1=='') {
        ok = false
      }
      return ok
    },

    clickRow(value) {
      if (!this.msg.msgVisible) {
        this.itemActual = value
        this.editar(this.itemActual)
      }
    },

    filtrarClientes() {
    },

    onScroll () {
      this.scrollInvoked++
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    getEstado (estado, accion) {
      let c = ''
      let e = ''
      if (estado==='A') {
        e = 'Activa'
        c = 'light-green accent-1'
      } else if (estado==='P') {
        e = 'Inactiva'
        c = 'red lighten-3'
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrarHTTP(this.itemActual)
        }
      }
      this.msg.msgVisible = false;
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },

  },

};
</script>

<style scoped>
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
</style>
// 1556