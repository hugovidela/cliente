<template>
  <v-layout align-start class="fg">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-1"
        :footer-props="{
          itemsPerPageOptions: [12],
          showFirstLastPage: true,
          showCurrentPage: true,
          nextIcon: 'mdi-arrow-right-drop-circle-outline',
          prevIcon: 'mdi-arrow-left-drop-circle-outline',
        }">
        <template v-slot:top>

          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn icon @click="closeForm"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <template v-slot:extension>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="nuevaActualizacion" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Nueva Actualización</span>
              </v-tooltip>

            </template>

            <v-toolbar-title class="fg">
              Actualización de Precios
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!--NUEVA ACTUALIZACION -->
            <v-dialog v-model="dialogNuevaActualizacion" max-width="800px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true"
                  icon @click="cerrarCambio()">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="fg">Nueva Actualización</span>
                <v-spacer></v-spacer>
                <v-btn class="fg85" v-if="xlsNuevos>0||aModificarXls>0&&!error"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarActualizacion()">
                  Confirmar
                </v-btn>
              </v-toolbar>
              <v-card>

                <form method="POST" action="upload" enctype="multipart/form-data">

                  <v-card-text>
                    <v-container fluid>

                      <!-- PIDO USUARIO -->
                      <v-row class="fg">

                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-select
                            v-model="usuario_id"
                            :items="itemsUsuarios"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="username"
                            label="Usuario"
                            dense
                            class="pt-2">
                          </v-select>
                        </v-col>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <span>
                            <p>
                              <b>¡IMPORTANTE!</b>
                              El costo y el precio serán los mismos
                              para los usuarios administrados por gouh,
                              y el % de remarcación irá en cero.</p>
                          </span>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="pt-2">
                          <v-file-input
                            filled dense
                            :color="temas.forms_titulo_bg"
                            prepend-icon="mdi-file-excel"
                            v-model="nuevoXls"
                            @change="cargarXls">
                            <v-icon>mdi-plus</v-icon>
                          </v-file-input>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="4" sm="4" md="4" class="pt-0">
                          <v-text-field
                            disabled
                            v-show="xlsCargado"
                            class="caption"
                            v-model="registrosXls"
                            label="Registros XLS">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" class="pt-0">
                          <v-text-field
                            disabled
                            v-show="xlsCargado"
                            class="caption"
                            v-model="aModificarXls"
                            label="A Modificar">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" class="pt-0">
                          <v-text-field
                            disabled
                            v-show="xlsCargado"
                            class="caption"
                            v-model="xlsNuevos"
                            label="Nuevos">
                          </v-text-field>
                        </v-col>
                        <!--
                        <v-col cols="3" sm="3" md="3">
                          <v-btn v-show="selected.length>0"
                            :color="temas.forms_titulo_bg"
                            :dark="temas.cen_btns_dark==true"
                            class="ma-2 white--text"
                            @click="cpAplicar()">
                            Actualizar Precios
                          </v-btn>
                        </v-col>
                        -->
                      </v-row>
                      <v-row>
                        <v-progress-linear
                          v-show="progreso>0"
                          :value="progreso"
                          dark
                          :color="temas.forms_titulo_bg"
                          height="25">
                          <!--<strong>{{ progreso }}%</strong>-->
                          <template v-slot:default="{ value }">
                            <strong>{{ Math.ceil(value) }}%</strong>
                          </template>
                        </v-progress-linear>
                      </v-row>
                      <v-row></v-row>

                    </v-container>
                  </v-card-text>
                </form>
              </v-card>
            </v-dialog>
            <!-- FIN DE NUEVA ACTUALIZACION -->

          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>

        <template v-slot:item.fecha="{ item }">
          {{ formatoFecha(item.fecha) }}
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

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue"
import XLSX from 'xlsx'
import 'jspdf-autotable'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    itemActual: null,
    acciones: [],
    selected: [],
    mios: [],
    arts: [],
    descriptionLimit: 80,
    usuario_id: 0,
    cuit: '',
    nuevoXls: [],
    error: false,

  //uploadPercentage: 0,
    progreso: 0,

    marca: '',

    registrosXls: 0,
    registrosCamPre: 0,
    aModificarXls: 0,
    xlsNuevos: 0,

    xlsCargado: false,
    entriesUsuarios: [],
    entriesMarcasFil: [],
    itemsUsuarios: [],
    isLoadingUsuarios: false,
    isLoadingMarcasFil: false,
    search: '',
    searchUsuarios: '',    // para el cuadro de búsqueda de datatables
    searchMarcasFil: '',
    editado: {
      id: '',
      user_id: '',
      fecha: moment().format('YYYY-MM-DD'),
      archivo: '',
      registros: 0,
      modificados: 0,
      nuevos: 0,
    },
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    dialogNuevaActualizacion: false, 
    items: [],
    headers: [
      { text: 'Id', value:'id', width: 70, align: 'end'},
      { text: 'Usuario', value:'user.username', width: 250, align: 'left'},
      { text: 'Fecha', value:'fecha', width: 126, align: 'end'},
      { text: 'Archivo', value:'archivo', width: 300, align: 'left'},
      { text: 'Registros', value:'registros', width: 110, align: 'end'},
      { text: 'Nuevos', value:'nuevos', width: 110, align: 'end'},
      { text: 'Modif.', value:'modificados', width: 110, align: 'end'},
//    { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState(['sucursal','sucursalFiscal','sucursalDemo','empresa','tema','temas','operarioEsVendedor','operarioTerceroId',
    'operarioUserId','caja','transition']),
  },

  watch: {
  },

  mounted () {
    this.isLoadingUsuarios = false
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
    return HTTP().get('/usuariosqueadministragohu').then(({ data }) => {
      this.itemsUsuarios = data
      this.listarHTTP()
    })
  },

  methods: {
    closeForm(){
      router.push('/')
    },

    nuevaActualizacion() {
      this.dialogNuevaActualizacion = true
      this.usuario_id = null
      this.progreso = 0
    },

    filtrar() {
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='actualizar') {
          this.actualizarPreciosHTTP()
        }
      }
      this.msg.msgVisible = false;
    },

    cerrarCambio() {
      this.dialogNuevaActualizacion = false
    },

    actualizarPreciosHTTP() {

      let formData = new FormData();
      formData.append('file', this.nuevoXls );
      formData.append('user', this.usuario_id );
      formData.append('cuit', this.cuit );
      this.progreso = 0
      return HTTP().post('/importarartadmingohu',  
        formData, {
          onUploadProgress: function( progressEvent ) {
            this.progreso = (progressEvent.loaded / progressEvent.total) * 100;
//            const percentage = (progressEvent.loaded / progressEvent.total) * 100;
//            console.log(`Upload progress: ${percentage.toFixed(2)}%`);
            //console.log(`Upload progress: ${this.progreso.toFixed(2)}%`);
            //this.uploadPercentage = parseInt(Math.round((progressEvent.loaded/progressEvent.total))*100);
          }.bind(this)
        }).then(({ data }) => { 
          
        debugger
        this.progreso = 0
        if (data.errno) {
          this.msg.msgTitle = 'Error'
          let m = '¡Se ha producido un error!.<br>'
          m += data.sqlMessage+'<br>'
          m += '<br>Revise si el archivo excel cumple con los requerimientos '
          m += 'de importación y vuelva a intentar.'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'aceptar'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = '¡PERFECTO!'

          let m = ''
          if (data.r==1) {
            m = '¡Se ha agregado un nuevo artículo!<br>'
          } else if (data.r>1) {
            m = '¡Se han agregado '+data.r+' nuevos artículos!<br>'
          }
          if (data.u==1) {
            m += '¡Se ha actualizado un artículo!<br>'
          } else if (data.u>1) {
            m += '¡Se han actualizado '+data.u+' artículos!<br>'
          }
          m += 'Puedes consultarlo en <b>Artículos</b> para verlo.<br><br>'
          this.itemsExcel = []
          this.usuario_id = null
          this.nuevoXls = []
          this.dialogNuevaActualizacion = false
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'aceptar'
          this.msg.msgButtons = ['Aceptar']
          this.listarHTTP();
        }
      })
      .catch(function(e){
        console.log(e, 'FAILURE!!');
      });

      /*
      let s = []
      for (let i=0; i<=this.selected.length-1; i++) {
        s.push( {
          id: this.selected[i].id,
          precio: this.selected[i].precio
        })
      }
      return HTTP().post('/aplicarcambiosdepreciosseleccionados/', { s } ).then(({data})=>{

        this.items = []
        this.selected = []
        this.msg.msgVisible = false
        let m = ''
        if (data) {
          this.msg.msgTitle = 'Cambios de Precios Aplicados'
          m =  (data.r==1) ? 'Un precio fue modificado<br>' : data.r + ' precios fueron modificados.<br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'cambios de precios aplicados'
          this.msg.msgButtons = ['Aceptar']
        }
      })
      */
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    listarHTTP() {
      return HTTP().get('/preciosactualizaciones').then(({ data }) => {
        this.items = data;
        this.isLoadingUsuarios = false;
      });
    },

    guardarActualizacion() {
      this.msg.msgTitle = 'Actualización de Precios' 
      this.msg.msgAccion = 'actualizar'
      this.msg.msgBody = '¿Confirmas actualizar los precios?'
      this.msg.msgVisible = true
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    cargarXls() {

      this.progreso = 0
      if (this.nuevoXls != undefined) {
        try {
          return HTTP().get('/configarticulosexcel').then(({ data }) => {
            this.cfgExcel = data
            if (data) {
              this.xlsCargado = true;
              let file = this.nuevoXls;
              let reader = new FileReader();
              reader.onload = async function (e) {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, { type: "array" });
                let worksheet = workbook.Sheets[workbook.SheetNames[0]];
                let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                let dataset = await this.parseFileContent(sheet).then(() => {
                  this.chequearArt()    
                });
              }.bind(this);
              reader.readAsArrayBuffer(file);
              //this.chequearArt()
            }
          })
        } catch (exception) {
        }
      } else {
        this.xlsCargado = false;
      }
    },

    async parseFileContent(sheet) {

      this.arts = []
      let pos = this.itemsUsuarios.findIndex(x=>x.id == this.usuario_id)
      this.cuit = this.itemsUsuarios[pos].tercero.cuit

      // HEV021
      this.progreso = 0
      debugger
      if (this.cuit=='30714408565') {         // DEBY-FERR
        // FILA 2
        // CODIGO(A), NOMBRE(B), PRECIO(D - SINIVA), IVA(NULL)
        // SALTOS DE LINEA: NO
        for (let j=1; j<=sheet.length-1; j++) {
          let r = sheet[j]
          if (r[0]!=undefined && r[3]!=undefined && !isNaN(r[3])) {
            this.arts.push({
              id:null, codigo:r[0].toString().trim(), nombre:r[1], miprecio:0, precio:this.roundTo(r[3],4), iva: null, variacion: 0, estado: 'N'
            })
          }
          this.progreso = (j / sheet.length) * 100;
        }
      } else if (this.cuit=='30716176254') {  // MC HERRAJES
        // FILA 12
        // CODIGO(A), NOMBRE(B), PRECIO(E - SINIVA), IVA(D)
        // SALTOS DE LINEAS: SI, 1 o > 1
        for (let j=11; j<=sheet.length-1; j++) {
          let r = sheet[j]
          if (r[0]!=undefined && r[4]!=undefined && !isNaN(r[4])) {
            this.arts.push({
              id:null, codigo:r[0].toString().trim(), nombre:r[1], miprecio:0, precio:this.roundTo(r[4],4), iva: r[3], variacion: 0, estado: 'N'
            })
          }
          this.progreso = (j / sheet.length) * 100;
        }
      } else if (this.cuit=='30714208175') {  // FOX
        // FILA 4
        // CODIGO(A), NOMBRE(B), PRECIO(G - SINIVA)
        // SALTOS DE LINEAS: NO
        for (let j=3; j<=sheet.length-1; j++) {
          let r = sheet[j]
          if (r[0]!=undefined && r[6]!=undefined && !isNaN(r[6])) {
            this.arts.push({
              id:null, codigo:r[0].toString().trim(), nombre:r[1], miprecio:0, precio:this.roundTo(r[6],4), iva: null, variacion: 0, estado: 'N'
            })
          }
          this.progreso = (j / sheet.length) * 100;
        }
      } else if (this.cuit=='20068185395') {  //TAUBER
        // FILA 8
        // CODIGO(A), NOMBRE(B), PRECIO(C - SINIVA)
        // SALTOS DE LINEAS: NO
        for (let j=7; j<=sheet.length-1; j++) {
          let r = sheet[j]
          if (r[0]!=undefined && r[2]!=undefined && !isNaN(r[2])) {
            this.arts.push({
              id:null, codigo:r[0].toString().trim(), nombre:r[1], miprecio:0, precio:this.roundTo(r[2],4), iva: null, variacion: 0, estado: 'N'
            })
          }
          this.progreso = (j / sheet.length) * 100;
        }
      } else if (this.cuit=='30716534916') {  //BERMON
        // FILA 13
        // CODIGO(A), NOMBRE(B), PRECIO(C - SINIVA), IVA(G)
        // SALTOS DE LINEAS: NO
        for (let j=12; j<=sheet.length-1; j++) {
          let r = sheet[j]
          if (r[0]!=undefined && r[2]!=undefined && !isNaN(r[2])) {
            this.arts.push({
              id:null, codigo:r[0].toString().trim(), nombre:r[1], miprecio:0, precio:this.roundTo(r[2],4), iva: r[6], variacion: 0, estado: 'N'
            })
          }
          this.progreso = (j / sheet.length) * 100;
        }
      } else if (this.cuit=='30564346132') {  //CONTIGIANI
        // FILA 9
        // CODIGO(A), NOMBRE(C), PRECIO(D - CONIVA)
        // SALTOS DE LINEAS: NO
        for (let j=1; j<=sheet.length-1; j++) {
          let r = sheet[j]
          if (r[0]!=undefined && r[3]!=undefined && !isNaN(r[3])) {
            this.arts.push({
              id:null, codigo:r[0].toString().trim(), nombre:r[2], miprecio:0, precio:this.roundTo(r[3]/1.21,4), iva: r[6], variacion: 0, estado: 'N'
            })
          }
          this.progreso = (j / sheet.length) * 100;
        }
      } else if (this.cuit=='33502734259') {  //ERPA SACIF ( SUPRABOND )
        // FILA 9
        // CODIGO(A), NOMBRE(I), PRECIO(J - SINIVA)
        // SALTOS DE LINEAS: NO
        for (let j=1; j<=sheet.length-1; j++) {
          let r = sheet[j]
          if (r[0]!=undefined && r[9]!=undefined && !isNaN(r[9])) {
            this.arts.push({
              id:null, codigo:r[0].toString().trim(), nombre:r[8], miprecio:0, precio:this.roundTo(r[9],4), iva: 5, variacion: 0, estado: 'N'
            })
          }
          this.progreso = (j / sheet.length) * 100;
        }
      } else if (this.cuit=='30715148850') {  //CHIARETTA )
        // FILA 9
        // CODIGO(A), NOMBRE(B), PRECIO(C - SINIVA)
        // SALTOS DE LINEAS: SI
        for (let j=1; j<=sheet.length-1; j++) {
          let r = sheet[j]
          if (r[0]!=undefined && r[2]!=undefined && !isNaN(r[2])) {
            this.arts.push({
              id:null, codigo:r[0].toString().trim(), nombre:r[1], miprecio:0, precio:this.roundTo(r[2],4), iva: 5, variacion: 0, estado: 'N'
            })
          }
          this.progreso = (j / sheet.length) * 100;
        }
      } else if (this.cuit=='30708175907') {  //M ELECTRICIDAD )
        // FILA 2
        // CODIGO(A), NOMBRE(B), PRECIO(C - SINIVA)
        // SALTOS DE LINEAS: SI
        debugger
        for (let j=1; j<=sheet.length-1; j++) {
          let r = sheet[j]
          if (r[0]!=undefined && r[5]!=undefined && !isNaN(r[5])) {
            let cod = r[0].toString().trim()
            cod += r[1].toString().trim()
            this.arts.push({
              id:null, codigo:cod, nombre:r[2], miprecio:0, precio:this.roundTo(r[5],4), iva: 5, variacion: 0, estado: 'N'
            })
          }
          this.progreso = (j / sheet.length) * 100;
        }
      }
      this.registrosXls = this.arts.length;
      //alert(this.progreso)
      //this.progreso = 0;
    },

    chequearArt() {

      this.progreso = 0
      this.error = false
      this.mios = [];
      let errDup = false;
      let errCodMax = false;
      let errCod = false;
      let errNom = false;

      // VEO SI HAY CODIGOS DUPLICADOS
      let ctrl = []
      for (let i=0; i<=this.arts.length-1; i++) {
        ctrl.push(this.arts[i].codigo)
      }
      const hayDuplicados = array =>
        new Set(array).size < array.length
      errDup = hayDuplicados(ctrl)

      this.progreso = 10;

      debugger
      // VEO SI LOS CODIGOS SON COMPATIBLES !=@ && length<=35
      for (let i=0; i<=this.arts.length-1; i++) {
        if (this.arts[i].codigo.toString().indexOf('@')!=-1) {
          errCod = true
          break
        } else if (this.arts[i].codigo.length>35) {
          errCodMax = true
          break
        }
      }

      this.progreso = 20;

      // VEO SI LOS NOMBRES SON COMPATIBLES !=%
      for (let i=0; i<=this.arts.length-1; i++) {
        if (this.arts[i].nombre.toString().indexOf('%')!=-1) {
          errNom = false
          break
        }
      }

      this.progreso = 30;

      let m = ''
      if (errDup) {
        m = 'Hay códigos Duplicados'
      } else if (errCod) {
        m = 'Hay códigos con el caracter @'
      } else if (errCodMax) {
        m = 'Hay códigos muy largos'
      } else if (errNom) {
        m = 'Hay nombres con el caracter %'
      }

      this.error = m == ''?false:true

      if (errDup||errCod||errCodMax||errNom) {

        this.msg.msgTitle = '¡ERROR!'
        this.itemsExcel = []
        this.usuario_id = null
        this.nuevoXls = []
        this.dialogNuevaActualizacion = false
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'aceptar'
        this.msg.msgButtons = ['Aceptar']

        this.progreso = 0

      } else {

        debugger
        return HTTP().post('/userarticulosmisprecios/',{id:this.usuario_id}).then(({ data }) => {  // ver esto
  
          this.progreso = 50;

          debugger
          if (data) {

            debugger

            for (let i=0; i<=data.length-1; i++) {
              this.mios.push({ id: data[i].id, codigo: data[i].codigo, precio: data[i].meta.costo })
            }

            this.progreso = 60;

            debugger
  
            // ORDENO items POR CODIGO
            this.arts.sort(function (a, b) {
              if (a.codigo > b.codigo) { return 1 }
              if (a.codigo < b.codigo) { return -1 }
            return 0 })

            this.progreso = 70;

            debugger
  
            let resultado = this.arts.filter((item) => {
              let ok = false;
              let cod = item.codigo.toString().trim()+'@'+this.usuario_id;
              let pos = this.mios.findIndex(x=>x.codigo.toString().trim()==cod)
              if (pos!=-1) {
                item.id = this.mios[pos].id
                item.variacion = this.roundTo(((item.precio/this.mios[pos].precio)-1)*100,2)
                item.miprecio = this.roundTo(this.mios[pos].precio,4)
                ok = true;
              }
              return ok;
            })

            this.progreso = 80;

            debugger
  
            this.xlsNuevos = this.arts.reduce((ctt, item) => {
              if (item.id==null) { ctt += 1 }
              return(ctt)
            }, 0)
  
            this.progreso = 90;

            debugger

            this.aModificarXls = this.arts.reduce((ctt, item) => {
              if (item.id!=null&&item.precio!=item.miprecio) { ctt += 1 }
              return(ctt)
            }, 0)

            debugger

            this.progreso = 95;

            /*
            let xx = 0
            for (let i=0; i<=this.arts.length-1; i++) {
              if (this.arts[i].precio!=this.arts[i].miprecio) {
              } else {
                xx ++
              }
            }
            debugger
            */

            let tmp = []
            for (let i=0; i<=this.arts.length-1; i++) {
              if (this.arts[i].id!=null&&this.arts[i].precio!=this.arts[i].miprecio) {
                tmp.push(this.arts[i])
              }
            }
            this.progreso = 98;
            debugger
            this.arts = this.arts.filter((item) => {
              let ok = false;
              if (item.precio!=item.miprecio) {
                ok = true
              }
              return ok;
            })
  
          }

          this.progreso = 100;
          if (this.aModificarXls+this.xlsNuevos == 0) {
            this.mensaje('Los datos del archivo seleccionado ya están actualizados en el sistema.',this.temas.snack_error_bg, 3000)
          }
  
        })
        .catch(err => {
          console.log(err)
        })
      }
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    formatoFecha(value) {
      return moment(String(value)).format('L')
    },

  },
};
</script>

<style scoped lang="scss">
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  // 1246
</style> 