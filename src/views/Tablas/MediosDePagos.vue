<template>
  <v-layout align-start class="fg">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
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
              <v-btn v-if="userId==1"
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

            <v-toolbar-title>Medios de Pagos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="700px"
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

                  <span class="fg">{{ formTitle }}</span>
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
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            ref="abrev"
                            :autofocus="(editedIndex===-1)"
                            v-model="editado.abrev"
                            :color="temas.forms_titulo_bg"
                            label="Abreviado"
                            required
                            :rules="abrevRules"
                            :counter="2"
                            maxlength="2"
                            v-on:keydown.tab="buscoAbrev">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            ref="nombre"
                            :autofocus="(editedIndex===-1)"
                            v-model="editado.nombre"
                            :color="temas.forms_titulo_bg"
                            label="Nombre"
                            required
                            :rules="nombreRules"
                            :counter="40"
                            maxlength="40"
                            v-on:keydown.tab="buscoNombre">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sx="6" mx="4">
                          <v-switch
                            label="Activo"
                            :autofocus="!(editedIndex===-1)"
                            v-model="editado.activo"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="search"
              :color="temas.forms_titulo_bg"
              append-icon="search"
              label="Buscar"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>

        <template v-slot:item.icono="{ item }">
          <v-btn
            class="mr-2" fab dark x-small color="grey-2">
            <v-icon dark>{{item.icono}}</v-icon>
          </v-btn>
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
    modelo: 'mediosdepagos',
    itemActual: null,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    abrevRules: [
      (v) => !!v || 'El código es requerido',
      (v) => v.length <= 15 || 'Ingrese hasta 15 caracteres'
    ],      
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 40 || 'Ingrese hasta 40 caracteres'
    ],      
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    items: [],
    headers: [
      { text: 'ABREV', value:'abrev'},
      { text: 'NOMBRE', value:'nombre'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    editedIndex: -1,
    editado: {
      id: '',
      abrev: '',
      nombre: '',
      activo: true,
    },
    defaultItem: {
      id: '',
      abrev: '',
      nombre: '',
      activo: true,
    },
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapState(['temas','transition']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Medio de Pago' : 'Editar Medio de Pago';
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
      if (this.userId!=1) {
        this.headers.pop()
      }
      return this.listarHTTP()
    }
  },
  /*
  created () {
    this.listarHTTP();
  },
  */
 methods: {
    ...mapMutations(['alert','closeAlert']),
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
    buscoAbrev (event) {
      // who caused it? "event.target.id"
      const abrev = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${abrev}`)
        .then(({ data }) => {
          if(data) {
            this.mensaje('¡El código ingresado ya existe.!', 'black', 1500) 
            this.$refs.abrev.focus()
          }
      });
    },
    buscoNombre (event) {
      // who caused it? "event.target.id"
    	const nom = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${nom}`)
        .then(({ data }) => {
          if(data) {
            this.mensaje('¡El nombre ingresado ya existe.!', 'black', 1500) 
            this.$refs.nombre.focus()
          }
      });
    },
    listarHTTP:function() {
      return HTTP().get('/'+this.modelo).then(({ data }) => {
        this.items = data;
      });
    },
    altaHTTP:function() {
      return HTTP().post('/'+this.modelo, { abrev: this.abrev, nombre: this.nombre, activo: true }).then(({ data }) => {
        if (data.data=='ok') {
          this.mensaje('¡Alta Exitosa!', this.temas.forms_titulo_bg, 2500)
        } else {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 2500)
        }
        this.listarHTTP();
      });
    },
    editarHTTP:function(data) {
      return HTTP().patch(`${this.modelo}/${data.id}`, data).then(() => {
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 2500)
        } else {
          this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 2500)
        }
        this.listarHTTP();
      });       
    },
    borrarHTTP:function(id) {
      return HTTP().delete(`/mediosdepago/${item.id}`).then((data) => {
        if (data.data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 2500)
        } else {
          this.mensaje('¡Se ha eliminado el medio de pago correctamente!', this.temas.forms_titulo_bg, 2500)
        }
        this.listarHTTP();
      }).catch((err)=>{
        this.mensaje('¡Opps, se ha producido un error al intentar eliminar este registro!', this.temas.snack_error_bg, 2500) 
      })
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
    editar (item) {
      this.editedIndex = this.items.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.editado = Object.assign({}, item);
      this.dialog = true;
    },
    preguntoBorrar (item) {
      debugger
      return HTTP().get(`/mediosdepagopuedoborrar/${item.id}`).then((data) => {
        debugger
        this.msg.msgTitle = 'Borrar'
        this.msg.msgVisible = true
        if (data.data=='ok') {
          this.msg.msgBody = 'Confirma borrar '+item.nombre
          this.msg.msgAccion = 'borrar item'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        } else {
          this.msg.msgBody = 'No se puede borrar este medio de pago, esta siendo utilizado por otros usuarios.'
          this.msg.msgAccion = 'error al borrar item'
          this.msg.msgButtons = ['Cancelar']
        }
        this.itemActual = item;
      })
    },
    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHttp(this.items[index].id);
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
      this.abrev = this.editado.abrev;
      this.nombre = this.editado.nombre;
      this.activo = this.editado.activo;
      if (this.editedIndex > -1) { // esta modificando
        this.id = this.editado.id;
        this.editarHTTP(this.editado);
      } else {
        this.mensaje('¡Alta Exitosa!', 'blue', 1500) 
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