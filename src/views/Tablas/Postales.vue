<template>
  <v-layout align-start class="fg">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        sort-by="id"
        dense
        class="elevation-3"
        :footer-props="{
          itemsPerPageOptions: [9],
          showFirstLastPage: true,
          showCurrentPage: true,
          nextIcon: 'mdi-arrow-right-drop-circle-outline',
          prevIcon: 'mdi-arrow-left-drop-circle-outline',
        }">
        <template v-slot:top>
          <v-toolbar
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
                @click="dialog = !dialog">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
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
                <v-icon>mdi-file-pdf-box</v-icon>
              </v-btn>
            </template>
            <v-toolbar-title>Códigos Postales</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="400px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card class="fg">

                <v-toolbar
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelar">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>

                  <span class="headdline">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="guardar">Guardar
                  </v-btn>

                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            :disabled="!(editedIndex===-1)"
                            :autofocus="(editedIndex===-1)"
                            ref="codigo"
                            v-model="editado.codigo"
                            :color="temas.forms_titulo_bg"
                            label="Codigo"
                            required
                            :rules="codigoRules"
                            :counter="10"
                            maxlength="10"
                            v-on:keydown.tab="buscoCodigo">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            v-model="editado.nombre"
                            :color="temas.forms_titulo_bg"
                            :autofocus="!(editedIndex===-1)"
                            label="Nombre"
                            required
                            :rules="nombreRules"
                            :counter="40"
                            :maxlength="40">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-autocomplete
                            class="body-2"
                            v-model="editado.provincia_id"
                            :color="temas.forms_titulo_bg"
                            :items="itemsProvincias"
                            :loading="isLoadingProvincias"
                            :search-input.sync="searchProvincias"
                            item-text="nombre"
                            item-value="id"
                            label="Provincia"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sx="6" mx="4">
                          <v-switch
                            label="Activo"
                            v-model="editado.activo"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                      </v-row>
<!--
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-file-input
                            filled dense
                            prepend-icon="mdi-file-excel"
                            v-model="nuevoXls"
                            :color="temas.forms_titulo_bg">
                            <v-icon>mdi-plus</v-icon>
                          </v-file-input>
                        </v-col>
                      </v-row>
-->
                    </v-container>
                  </v-card-text>
                </v-form>

              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              :color="temas.forms_titulo_bg"
              append-icon="search"
              label="Buscar"
              single-line hide-details
              @change="listarHTTP()">
            </v-text-field>
          </v-col>
        </template>

        <template v-slot:item.activo="{ item }">
          <v-chip :color="getColor(item.activo)" dark>{{ item.activo ? 'Sí' : 'No' }}</v-chip>
        </template>

        <template v-slot:item.accion="{ item }">
          <v-btn v-if="userId==1"
            class="mr-2" fab x-small
            :color="temas.forms_btn_editar_bg"
            :dark="temas.forms_btn_editar_dark==true"
            @click="editar(item)">
            <v-icon dark>mdi-pencil</v-icon>
          </v-btn>

          <v-btn v-if="userId==1"
            class="mr-2" fab x-small
            :color="temas.forms_btn_borrar_bg"
            :dark="temas.forms_btn_borrar_dark==true"
            @click="preguntoBorrar(item)">
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>

          <v-btn v-if="userId==1"
            class="mr-2" fab x-small
            :color="temas.forms_btn_activar_bg"
            :dark="temas.forms_btn_activar_dark==true"
            @click="activarDesactivar(item)">
            <v-icon dark>mdi-checkbox-marked-outline</v-icon>
          </v-btn>

        </template>
      </v-data-table>
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
import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import SBar from './../Forms/snackbar.vue';
import Confirmacion from "./../Forms/confirmacion.vue"

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    nuevoXls: '',
    uploadPercentage: 0,
    modelo: 'postales',
    itemActual: null,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    codigoRules: [
      (v) => !!v || 'El código es requerido',
      (v) => v.length <= 10 || 'Ingrese hasta 10 caracteres'
    ],      
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 40 || 'Ingrese hasta 40 caracteres'
    ],
    searchProvincias: '',     // para el cuadro de búsqueda de datatables
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '',  // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    items: [],
    headers: [
      { text: 'ID', value: 'id', width: "100", align: 'end' },
      { text: 'CODIGO', value:'codigo', width: "100", align: 'end'},
      { text: 'NOMBRE', value:'nombre', width: "500", align: 'left'},
      { text: 'PROVINCIA', value:'provincia.nombre', width: "300", align: 'left'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    editedIndex: -1,
    editado: {
      id: '',
      codigo: '',
      nombre: '',
      provincia_id: '',
      activo: true,
    },
    defaultItem: {
      id: '',
      codigo: '',
      nombre: '',
      provincia_id: '',
      activo: true,
    },
    descriptionLimit: 60,
    entriesProvincias: [],
    isLoadingProvincias: false,

  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapState(['temas','transition']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Código Postal' : 'Editar Código Postal';
    },
    itemsProvincias () {
      return this.entriesProvincias.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },    
  },
  
  watch: {
    
    dialog (val) {
      val || this.cancelar();
    },

    searchProvincias (val) {
      // Items have already been loaded
      // if (this.items.length > 0) return
      // Items have already been requested
      if (this.isLoadingProvincias) return
      this.isLoadingProvincias = true
      // Lazily load input items
      return HTTP().get('/provincias').then(({ data }) => {
        this.entriesProvincias = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingProvincias = false))
    },
  },
  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      if (this.userId!=1) {
        this.headers.pop()
      }
      return this.listarHTTP()
    }
  },
  methods: {
    ...mapMutations(['alert','closeAlert','SET_SNACK']),
    closeForm(){
      router.push('/')
    },
    activarDesactivar(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
      HTTP().patch(`${this.modelo}/${item.id}`,{activo: valor}).then ((res) => {
        console.log(res);
      }).catch((err)=>{
        console.log(err);
      })
    },
    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrar(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS')
          alert('exportando a XLS...')
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
    buscoCodigo (event) {
      // who caused it? "event.target.id"
    	const cod = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${cod}`).then(({ data }) => {
        if(data) {
          this.mensaje('¡El código ingresado ya existe.!', 'black', 1500) 
          this.$refs.codigo.focus()
        }
      });
    },
    listarHTTP:function() {
      return HTTP().post('/'+this.modelo, {bus: this.search}).then(({ data }) => {
        this.items = data;
      });
    },
    async altaHTTP() {
      return HTTP().post('/postalescreate', {codigo: this.codigo,nombre: this.nombre,provincia_id: this.provincia_id,activo: true,}).then(({ data }) => {
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Nuevo registro agregado!', this.temas.forms_titulo_bg, 1500)
        }
        this.listarHTTP();
      });
    },


    editarHTTP:function(data) {
      return HTTP().patch(`${this.modelo}/${data.id}`, data).then(() => {
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500)
        }
        this.listarHTTP();
      });       
    },
    borrarHTTP:function(id) {
      return HTTP().delete(`/${this.modelo}/${id}`).then(({data}) => {
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Eliminación Exitosa!', this.temas.forms_titulo_bg, 1500)
        }
        this.listarHTTP();
      });
    },
    editar (item) {
      this.editedIndex = this.items.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.editado = Object.assign({}, item);
      this.dialog = true;
    },
    preguntoBorrar (item) {
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+item.nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },
    exportarAPDF () {
      this.msg.msgTitle = 'Exportar a PDF'
      this.msg.msgBody = 'Desea exportar los datos a PDF'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a PDF'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },
    exportarAXLS () {
      this.msg.msgTitle = 'Exportar a XLS'
      this.msg.msgBody = 'Desea exportar los datos a XLS'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a XLS'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },
    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHTTP(this.items[index].id);
    },
    cancelar() {
      this.dialog = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    guardar() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      this.codigo = this.editado.codigo;
      this.nombre = this.editado.nombre;
      this.provincia_id = this.editado.provincia_id;
      this.activo = this.editado.activo;
      if (this.editedIndex > -1) { // esta modificando
        this.id = this.editado.id;
        this.editarHTTP(this.editado);
      } else {
        this.altaHTTP();
      }
      this.cancelar();
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