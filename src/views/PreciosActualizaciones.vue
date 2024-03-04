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
            <v-dialog v-model="dialogNuevaActualizacion" max-width="600px" persistent
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
                <v-btn class="fg85" v-if="aProcesar&&!error"
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

                      <!--
                      <v-row class="fg pb-0">
                        <v-col cols="12" sm="12">
                          <v-checkbox
                            v-model="ChkNombresRepetidos"
                            label="Chequear nombres repetidos"
                            hide-details>
                          </v-checkbox>
                        </v-col>
                      </v-row>
                      -->

                      <v-row class="fg">
                        <v-col cols="12" sm="12" class="pt-0">
                          <v-select
                            v-model="usuario_id"
                            :items="itemsUsuarios"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="username"
                            label="Usuario"
                            dense
                            class="pt-2"
                            @change="seleccionoUsuario()">
                          </v-select>
                        </v-col>
                      </v-row>

                      <v-row class="fg pt-0 pb-0">
                        <v-col cols="12" sm="12">
                          <v-textarea
                            v-model="observaciones"
                            :color="temas.forms_titulo_bg"
                            label="Observaciones"
                            auto-grow
                            outlined
                            rows="2"
                            row-height="25"
                            shaped>
                          </v-textarea>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="9" class="pt-2">
                          <v-file-input
                            filled dense
                            :color="temas.forms_titulo_bg"
                            prepend-icon="mdi-file-excel"
                            v-model="nuevoXls"
                            @change="cargarXls">
                            <v-icon>mdi-plus</v-icon>
                          </v-file-input>
                        </v-col>
                        <v-col cols="12" sm="3" class="pt-2"
                          v-if="procesos.length>=1&&!revisado">
                          <v-btn class="text--center"
                            :color="$store.state.temas.cen_btns_bg"
                            :dark="$store.state.temas.cen_btns_dark==true"
                            @click="chequearArt()">
                            Revisar
                          </v-btn>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-data-table
                          :headers="headersProcesos"
                          :items="procesos"
                          dense
                          class="elevation-1"
                          :hide-default-footer="true">
                          <template v-slot:item.accion="{ item }">
                            <v-btn v-if="item.accion"
                              class="mr-2" fab icon small
                              :color="temas.forms_btn_editar_bg"
                              :dark="temas.forms_btn_editar_dark==true"
                              @click="verArticulos(item)">
                              <v-icon>mdi-eye-outline</v-icon>
                            </v-btn>
                          </template>

                        </v-data-table>
                      </v-row>

                      <v-row>
                        <v-progress-linear
                          v-show="progreso>0"
                          :value="progreso"
                          dark
                          :color="temas.forms_titulo_bg"
                          height="25">
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

      <!-- DIALOG VER NUEVOS -->
      <v-dialog v-model="dialogNuevos" max-width="800px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{}"></template>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="dialogNuevos=false">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg">Artículos Nuevos</span>
        </v-toolbar>
        <v-card>
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-data-table
                  :headers="headersNuevos"
                  :items="nuevos"
                  dense
                  class="elevation-1"
                  :footer-props="{
                  itemsPerPageOptions: [12],
                  showFirstLastPage: true,
                  showCurrentPage: true,
                  nextIcon: 'mdi-arrow-right-drop-circle-outline',
                  prevIcon: 'mdi-arrow-left-drop-circle-outline',
                  }">
                </v-data-table>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- FIN VER NUEVOS -->

      <!-- DIALOG VER CAMBIOS -->
      <v-dialog v-model="dialogCambios" max-width="1190px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{}"></template>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="dialogCambios=false">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg">Cambios de Precios</span>
        </v-toolbar>
        <v-card>
          <v-card-text>
            <v-container fluid>
              <v-data-table
                :headers="headersCambios"
                :items="cambios"
                dense
                class="elevation-1"
                :footer-props="{
                itemsPerPageOptions: [12],
                showFirstLastPage: true,
                showCurrentPage: true,
                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                prevIcon: 'mdi-arrow-left-drop-circle-outline',
                }">
                <template v-slot:item.preciodb="{ item }">
                  <span class="mini-font">
                    ${{ formatoImporte(item.preciodb) }}
                  </span>
                </template>
                <template v-slot:item.precioxls="{ item }">
                  <span class="mini-font">
                    ${{ formatoImporte(item.precioxls) }}
                  </span>
                </template>
                <template v-slot:item.porcentaje="{ item }">
                  <span class="mini-font">
                    %{{ formatoImporte(item.porcentaje) }}
                  </span>
                </template>
              </v-data-table>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- FIN VER CAMBIOS -->

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
//import 'jspdf-autotable'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    observaciones: '',
    proveedores: [],
    aProcesar: false,
    revisado: false,
    procesos: [],
    db: [],
    xls: [],
    usuario_id: 0,
    cuit: '',
    nuevoXls: [],
    nuevos: [],
    cambios: [],
    error: false,
    ChkNombresRepetidos: false,
  //uploadPercentage: 0,
    progreso: 0,
    registrosXls: 0,
    aModificarXls: 0,
    sayProceso: '',
    sayRegistro: 0,
    xlsNuevos: 0,
    xlsCargado: false,
    itemsUsuarios: [],
    isLoadingUsuarios: false,
    search: '',
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    dialogNuevaActualizacion: false, 
    dialogArticulos: false,
    dialogNuevos: false,
    dialogCambios: false,
    items: [],
    headers: [
      { text: 'Id', value:'id', width: 70, align: 'end'},
      { text: 'Usuario', value:'user.username', width: 250, align: 'left'},
      { text: 'Fecha', value:'fecha', width: 126, align: 'end'},
      { text: 'Archivo', value:'archivo', width: 300, align: 'left'},
      { text: 'Registros', value:'registros', width: 110, align: 'end'},
      { text: 'Nuevos', value:'nuevos', width: 110, align: 'end'},
      { text: 'Modif.', value:'modificados', width: 110, align: 'end'},
    ],
    headersProcesos: [
      { text: 'Mensaje', value:'mensaje', width: 300, align: 'left'},
      { text: 'Regs', value:'registros', width: 90, align: 'end'},
      { text: 'Ver', value:'accion', width: 160, align: 'left', sortable: false},
    ],
    headersNuevos: [
      { text: 'Codigo', value:'codigo', width: 150, align: 'left'},
      { text: 'Nombre', value:'nombre', width: 600, align: 'left'},
    ],
    headersCambios: [
      { text: 'Codigo', value:'codigo', width: 120, align: 'left'},
      { text: 'Nombre', value:'nombre', width: 350, align: 'left'},
      { text: 'Precio BD', value:'preciodb', width: 120, align: 'end'},
      { text: 'Precio XLS', value:'precioxls', width: 120, align: 'end'},
      { text: '%', value:'porcentaje', width: 120, align: 'end'},
    ],
  }),

  /* 2744 9.545.587,18 --- 186.431,74 */

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
      for (let i=0; i<=data.length-1; i++) {
        this.itemsUsuarios.push({
          id: data[i].id,
          username: data[i].tercero.nombre,
          cuit: data[i].tercero.cuit,
          hoja: data[i].xls_hoja,
          fila: data[i].xls_fila,
          colCodigo: data[i].xls_codigo,
          colNombre: data[i].xls_nombre,
          colPrecio: data[i].xls_precio,
          colIVA: data[i].xls_iva,
          conIVA: data[i].xls_ivainc,
        })
      }

      /*
        liliana
        -------
        Debyferr              ok
        Tauber                ok
        Bermon                ok
        Palacios
        Fox                   ok
        Contigiani            ok
        Radio Electron
        Rubitech
        Chiaretta
        El Galgo
        Cots
        Bremen
        Hamilton
        MiCamp
        Estribos
        Franke
        Anaerobicos
        RR Racing
        Donato
        ProFerretero
        ESur
        Esoporter
        Dilurio
        CC Distribuciones
        Servet
        Mota
        HerraNet
        GEMP
        Berger
        Don Juan
        Don Pedro
        Sunde
        Gulf

        federico
        --------
        M Electricidad        ok
        Ferreteria Central    ok
        Prodel
        MC Herrajes
        Debandi
        Agro-Centro
      */

      this.listarHTTP()
    })
  },

  methods: {
    closeForm(){
      router.push('/')
    },

    nuevaActualizacion() {
      this.dialogNuevaActualizacion = true;
      this.usuario_id = null;
      this.progreso = 0;
      this.sayProceso = '';
      this.sayRegistro = 0;
      this.nuevoXls = null;
      this.xlsCargado = false;
      this.procesos = [];
      this.aProcesar = false;
      this.revisado = false;
      this.observaciones = '';
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

    seleccionoUsuario() {
      debugger
      this.observaciones = 'Sin novedades'
      let pos = this.itemsUsuarios.findIndex(x=>x.id == this.usuario_id);
      if (this.itemsUsuarios[pos].cuit=='20132940011') {
        this.observaciones = 'Se debe copiar el archivo excel a otro nuevo archivo. La API no toma el archivo como viene.'
      }
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
          //const percentage = (progressEvent.loaded / progressEvent.total) * 100;
          //console.log(`Upload progress: ${percentage.toFixed(2)}%`);
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

          debugger
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
          if (data.z==1) {
            m += '¡Un artículo sin cambios!<br>'
          } else if (data.z>1) {
            m += '¡'+ data.z + ' artículos sin cambios!<br>'
          }

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
      this.procesos = []
      this.progreso = 0
      if (this.nuevoXls != undefined) {
        try {
          return HTTP().get('/configarticulosexcel').then(({ data }) => {
            this.cfgExcel = data
            if (data) {
              this.xlsCargado = true;
              let file = this.nuevoXls;
              let reader = new FileReader();
              let pos = this.itemsUsuarios.findIndex(x=>x.id == this.usuario_id);
              this.cuit = this.itemsUsuarios[pos].cuit;
              
              debugger
              let hoja = this.itemsUsuarios[pos].hoja-1;

              reader.onload = async function (e) {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, { type: "array" });
                let worksheet = workbook.Sheets[workbook.SheetNames[hoja]];
                let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//              let dataset = await this.parseFileContent(sheet).then(() => {
//                this.chequearArt()    
//              });
                await this.parseFileContent(sheet);
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

      this.procesos.push({ mensaje: 'Leyendo archivo excel...', registros: 0, accion: false })

      debugger
      this.xls = []
      let pos = this.itemsUsuarios.findIndex(x=>x.id == this.usuario_id)
      this.cuit = this.itemsUsuarios[pos].cuit

      let fila = this.itemsUsuarios[pos].fila;
      let cod = this.itemsUsuarios[pos].colCodigo;
      let nom = this.itemsUsuarios[pos].colNombre;
      let pre  = this.itemsUsuarios[pos].colPrecio;
      let iva  = this.itemsUsuarios[pos].colIVA
      let conIVA = this.itemsUsuarios[pos].conIVA;
      let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let p1 = 0
      let p2 = 0
      let agrego = false

      for (let j=fila; j<=sheet.length-1; j++) {
        let r = sheet[j]
        let codigo = ''
        let nombre = ''
        let precio = 0
        let cIVA = 0
        let tIVA = 21
        agrego = true

        if (cod.includes(':')==true) {
          let c1 = cod.trim()
          let c2 = c1.substring(2,3)
          c1 = c1.substring(0,1)
          p1 = abc.indexOf(c1)
          p2 = abc.indexOf(c2)
          if (r[p1]!=undefined||r[p2]!=undefined) {
            codigo = r[p1].toString().trim()+r[p2].toString().trim()
          } else {
            agrego = false
          }
        } else {
          p1 = abc.indexOf(cod)
          if (r[p1]!=undefined) {
            codigo = r[p1].toString().trim()
          } else {
            agrego = false
          }
        }

        if (this.cuit=='30711526990') { // micam: el codigo viene como (12345)
          debugger
          codigo = codigo.substring(1)
          let pos = codigo.indexOf(')')
          codigo = codigo.substring(0,pos)
        }

        if (nom.includes(':')==true) {
          let n1 = nom.trim()
          let n2 = n1.substring(2,3)
          n1 = n1.substring(0,1)
          p1 = abc.indexOf(n1)
          p2 = abc.indexOf(n2)
          if (r[p1]!=undefined||r[p2]!=undefined) {
            nombre = r[p1].trim()+' '+r[p2].trim()
          } else {
            agrego = false
          }
        } else {
          p1 = abc.indexOf(nom)
          if (r[p1]!=undefined) {
            nombre = r[p1].toString().trim()
          } else {
            agrego = false
          }
        }

        p1 = abc.indexOf(pre)
        if (r[p1]!=undefined) {
          precio = r[p1]
        } else {
          agrego = false
        }

        if (iva!=''&&!iva==null) {
          p1 = abc.indexOf(iva)
          if (r[p1]!=undefined) {
            tIVA = r[p1]
            if (p1!=-1) {
              if (r[p1]==21) {
                cIVA = 5
              } else if (r[p1]==10.5) {
                cIVA = 4
              }
            }
          } else {
            agrego = false
          }
        } else {
          tIVA = 21
          cIVA = 5
        }

        if (conIVA) {
          if (iva==0) {
            precio = precio/(1+(21/100))
          } else {
            precio = precio/(1+(tIVA/100))
          }
        }

        if (agrego) {
          codigo += '@'+this.usuario_id.toString()
          this.xls.push({
            id:null,
            codigo:codigo,
            nombre:nombre,
            miprecio:0,
            precio:this.roundTo(precio,4),
            iva:iva,
            accion: ''
          })
          this.procesos[this.procesos.length-1].registros ++
        }
        this.progreso = (j / sheet.length) * 100;
      }
      this.progreso = 0
    },

    chequearArt() {
      this.progreso = 0
      this.error = false
      this.db = [];
      let errores = [];
      let hayDup = false;
      let hayDupCodigo = '';
      let ctrlCod = []
      let ctrlNom = []

      this.progreso = 10;

      // VEO SI HAY CODIGOS DUPLICADOS
      /*
      for (let i=0; i<=this.xls.length-1; i++) {
        if (ctrlCod.findIndex(x=>x==this.xls[i].codigo)==-1) {
          ctrlCod.push(this.xls[i].codigo)
        } else {
          this.procesos[this.procesos.length-1].registros ++
          errores.push('Código duplicado: '+this.xls[i].codigo+' '+this.xls[i].nombre)
        }
      }
      */
      this.progreso = 20;

      // VEO SI HAY CODIGOS CON EL CARACTER @
      //this.procesos.push({ mensaje: 'Revisando códigos...', registros: 0 })
      for (let i=0; i<=this.xls.length-1; i++) {
//        if (this.xls[i].codigo.toString().indexOf('@')!=-1) {
//          errores.push('Código con caracter @: '+this.xls[i].codigo+' '+this.xls[i].nombre)
//        }
        if (this.xls[i].codigo.length>35) {
          errores.push('Código muy largo (35 max.): '+this.xls[i].codigo+' '+this.xls[i].nombre)
        }
        if (this.xls[i].nombre.length>100) {
          //errores.push('Nombre muy largo (100 max.): '+this.xls[i].codigo+' '+this.xls[i].nombre)
        }
        //this.procesos[this.procesos.length-1].registros ++
      }

      this.progreso = 30;
      /*
      // VEO SI HAY NOMBRES DUPLICADOS
      if (this.ChkNombresRepetidos) {
        this.procesos.push({ mensaje: 'Revisando nombres duplicados...', registros: 0 })
        for (let i=0; i<=this.xls.length-1; i++) {
          if (ctrlNom.findIndex(x=>x==this.xls[i].nombre)==-1) {
            ctrlNom.push(this.xls[i].nombre)
          } else {
            errores.push('Nombre duplicado: '+this.xls[i].nombre)
          }
          this.procesos[this.procesos.length-1].registros ++
        }
      }
      */

      /*
      const hayDuplicados = array =>
        new Set(array).size < array.length
      errDup = hayDuplicados(ctrl)
      */

      let m = ''
      if (errores.length>0) {
        m = '¡Hay errores!<br><br>'
        for (let i=0; i<=errores.length-1; i++) {
//          if (i <= 10) {
          m += errores[i]+'<br>'
//          }
        }
//        if (errores.length>10) {
//          m += 'Y '+ errores.length.toString()+' errores más.'
//        }
        m += '<br>Debes corregir estos registros para poder importar el archivo.'
      }
      this.error = m == ''?false:true

      if (errores.length>0) {

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

        this.procesos.push({ mensaje: 'Artículos actuales...', registros: 0, accion: false })
//      return HTTP().post('/userarticulosmisprecios/',{id:this.usuario_id}).then(({ data }) => {  // ver esto

        this.progreso = 40;

        debugger
        return HTTP().post('/userarticulosimp', {id:this.usuario_id}, {timeout: 50000}).then(({ data }) => {
          
          debugger
          this.progreso = 50;
          if (data) {
            this.procesos[this.procesos.length-1].registros = data.length;
            //this.procesos.push({ mensaje: 'Procesando artículos actuales...', registros: 0 })
            for (let i=0; i<=data.length-1; i++) {
              this.db.push({ id: data[i].id, codigo: data[i].codigo, precio: data[i].meta.costo })
              //this.procesos[this.procesos.length-1].registros ++
            }

            debugger
            this.progreso = 60;
            
            // ORDENO items POR CODIGO
            this.xls.sort(function (a, b) {
              if (a.codigo > b.codigo) { return 1 }
              if (a.codigo < b.codigo) { return -1 }
            return 0 })

            let x = 0
            let y = 0

            // Busco duplicados
            hayDup = false
            let done = true
            while (done) {
              if (x<this.xls.length-1) {
                if (this.xls[x].codigo==this.xls[x+1].codigo) {
                  done = false
                  hayDup = true
                  hayDupCodigo = this.xls[x].codigo
                }
              } else {
                done = false
              }
              x ++
            }

            debugger
            this.progreso = 75;
            this.cambios = [];
            this.nuevos = [];
            x = 0
            y = 0
            done = true

            debugger
            if (this.db.length>0) {
              while (done) {
                let xl = this.xls[x].codigo
                let db = this.db[y].codigo
                if (xl===db) {       // son iguales, controlo el precio
                  if (this.xls[x].precio!=this.db[y].precio) {
                    this.cambios.push({
                      codigo: this.xls[x].codigo,
                      nombre: this.xls[x].nombre,
                      precioxls: this.xls[x].precio,
                      preciodb: this.db[y].precio,
                      porcentaje: ((this.xls[x].precio/this.db[y].precio)-1)*100
                    })
                    this.xls[x].accion = 'M'
                  } else {
                    this.xls[x].accion = '='
                  }
                  x ++
                  y ++
                } else if (xl>db) {  // el de excel es mayor que el de la bd
                  y ++
                } else if (xl<db) {  // el de la bd es mayor

                  this.xls[x].accion = 'N'
                  this.nuevos.push({
                    codigo: this.xls[x].codigo,
                    nombre: this.xls[x].nombre,
                  })
                  x ++

                }
                if (y>this.db.length-1) {
                  y = this.db.length-1
                  //this.xls[x].accion = 'N'
                  x ++
                }
                if (x>this.xls.length-1) {
                  done = false
                }
              }
            } else {
              for (let i=0; i<=this.xls.length-1; i++) {

                this.xls[i].accion = 'N'
                this.nuevos.push({
                  codigo: this.xls[x].codigo,
                  nombre: this.xls[x].nombre,
                })

              }
            }

            debugger
            this.progreso = 85;
            this.procesos.push({ mensaje: 'Artículos a agregar...', registros: 0, accion: true })
            this.procesos.push({ mensaje: 'Precios a modificar...', registros: 0, accion: true })
            this.procesos.push({ mensaje: 'Precios sin cambios...', registros: 0, accion: false })
            x = 0

            debugger
            for (let i=0; i<=this.xls.length-1; i++) {
              if (this.xls[i].accion=='N') {
                this.procesos[this.procesos.length-3].registros ++
              } else if (this.xls[i].accion=='M') {
                this.procesos[this.procesos.length-2].registros ++
              } else {
                this.procesos[this.procesos.length-1].registros ++
              }
            }
            this.aProcesar = this.procesos[this.procesos.length-3].registros>0||this.procesos[this.procesos.length-2].registros>0

            debugger
            /*
            let resultado = this.xls.filter((item) => {
              let ok = false;
              let cod = item.codigo.toString().trim()+'@'+this.usuario_id;
              let pos = this.db.findIndex(x=>x.codigo.toString().trim()==cod)
              this.procesos[this.procesos.length-1].registros ++
              if (pos!=-1) {
                item.id = this.db[pos].id
                item.variacion = this.roundTo(((item.precio/this.db[pos].precio)-1)*100,2)
                item.miprecio = this.roundTo(this.db[pos].precio,4)
                ok = true;
              }
              return ok;
            })
            */

            /*
            this.procesos[this.procesos.length-1].registros = 'ok'
            this.progreso = 80;
            this.procesos.push({ mensaje: 'Buscando artículos nuevos...', registros: 0 })
            this.xlsNuevos = this.xls.reduce((ctt, item) => {
              if (item.id==null) { ctt += 1 }
              return(ctt)
            }, 0)
            */

//            this.procesos[this.procesos.length-1].registros = this.xlsNuevos
//            this.progreso = 90;

            /*
            this.procesos.push({ mensaje: 'Buscando precios a modificar...', registros: 0 })
            this.aModificarXls = this.xls.reduce((ctt, item) => {
              if (item.id!=null&&item.precio!=item.miprecio) { ctt += 1 }
              return(ctt)
            }, 0)
            */
//            this.procesos[this.procesos.length-1].registros = this.aModificarXls
//            this.progreso = 95;

            /*
            let xx = 0
            for (let i=0; i<=this.xls.length-1; i++) {
              if (this.xls[i].precio!=this.xls[i].miprecio) {
              } else {
                xx ++
              }
            }
            */

            /*
            let tmp = []
            for (let i=0; i<=this.xls.length-1; i++) {
              if (this.xls[i].id!=null&&this.xls[i].precio!=this.xls[i].miprecio) {
                tmp.push(this.xls[i])
              }
            }
            */

            this.progreso = 98;
            /*
            this.procesos.push({ mensaje: 'Buscando precios a actualizar 2...', registros: 0 })
            this.xls = this.xls.filter((item) => {
              let ok = false;
              if (item.precio!=item.miprecio) {
                ok = true
              }
              return ok;
            })
            this.procesos[this.procesos.length-1].registros = this.xls.length-1;
            */
          }

          //this.aProcesar = !hayDup

          this.revisado = true
          this.progreso = 100;
          if (!this.aProcesar) {
            this.mensaje('Los datos del archivo seleccionado ya están actualizados en el sistema.',this.temas.snack_error_bg, 3000)
          } else if (hayDup) {
            this.mensaje('El archivo excel tiene códigos duplicados ('+hayDupCodigo+').',this.temas.snack_error_bg, 3000)
            this.aProcesar = false
          }
  
        })
        .catch(err => {
          console.log(err)
        })
      }
    },

    verArticulos(item) {
      this.dialogNuevos = false
      this.dialogCambios = false
      if (item.mensaje=='Artículos a agregar...') {
        this.dialogNuevos = true
      } else if (item.mensaje=='Precios a modificar...') {
        this.dialogCambios = true
      }
      debugger
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    formatoFecha(value) {
      return moment(String(value)).format('L')
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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