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
          itemsPerPageOptions: [13],
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
            <v-toolbar-title class="fg white--text">Cajas</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="900px">
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelar">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="fg">Cierre de Caja</span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="lchequeo"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="confirmarCierre">
                    Grabar Caja
                  </v-btn>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text class="fg">
                    <v-container fluid>
                      <v-row>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            disabled
                            v-model="editadoCaja.numero"
                            label="Numero"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            type="date"
                            disabled
                            v-model="editadoCaja.fechadesde"
                            label="Fecha desde"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            type="date"
                            autofocus
                            v-model="editadoCaja.fechahasta"
                            label="Fecha Hasta"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3" v-show="editadoCaja.fechahasta">
                          <v-btn
                            class="ma-2 white--text"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            @click="chequear">Chequear
                          </v-btn>
                        </v-col>
                      </v-row>

                      <div v-show="lchequeo">
                        <v-row dense>
                          <v-col
                            cols="12" sm="12" md="12">
                            <div class="text-center"><b>RESUMEN DE CAJA</b>
                            </div>
                          </v-col>
                        </v-row>

                        <v-row dense>
                          <v-col cols="2" sm="2" md="2"></v-col>
                          <v-col cols="5" sm="5" md="5">
                            <div>Saldo Anterior</div>
                          </v-col>
                          <v-col cols="3" sm="3" md="3">
                            <div class="text-lg-right"><b>
                              ${{ formatoImporte(totalcajaanterior) }}</b>
                            </div>
                          </v-col>
                          <v-col cols="2" sm="2" md="2"></v-col>
                        </v-row>

                        <v-row dense>
                          <v-col cols="2" sm="2" md="2"></v-col>
                          <v-col cols="5" sm="5" md="5"><div><b>Ventas</b></div></v-col>
                          <v-col cols="2" sm="2" md="2"></v-col>
                        </v-row>
                        <v-row dense v-for="(row, idx) in ventas" v-bind:key="idx">
                          <v-col cols="2" sm="2" md="2"></v-col>
                          <v-col cols="5" sm="5" md="5">
                            <div>{{ row.descripcion }}</div>
                          </v-col>
                          <v-col cols="3" sm="3" md="3">
                            <div class="text-lg-right"><b>{{ row.total }}</b></div>
                          </v-col>
                          <v-col cols="2" sm="2" md="2"></v-col>
                        </v-row>

                        <v-row dense><v-col cols="12" sm="12" md="12"></v-col></v-row>

                        <v-row dense>
                          <v-col cols="2" sm="2" md="2"></v-col>
                          <v-col cols="5" sm="5" md="5"><div>
                            <b>Compras, Gastos y Pagos</b></div>
                          </v-col>
                          <v-col cols="2" sm="2" md="2"></v-col>
                        </v-row>

                        <v-row dense><v-col cols="12" sm="12" md="12"></v-col></v-row>

                        <v-row dense v-for="(row, idx) in compras" v-bind:key="idx">
                          <v-col cols="2" sm="2" md="2"></v-col>
                          <v-col cols="5" sm="5" md="5">
                            <div>{{ row.descripcion }}</div>
                          </v-col>
                          <v-col cols="3" sm="3" md="3">
                            <div class="text-lg-right">
                              <b>{{ row.total }}</b>
                            </div>
                          </v-col>
                          <v-col cols="2" sm="2" md="2"></v-col>
                        </v-row>

                        <v-row dense><v-col cols="12" sm="12" md="12"></v-col></v-row>

                        <v-row dense>
                          <v-col cols="2" sm="2" md="2"></v-col>
                          <v-col cols="5" sm="5" md="5">
                            <div><b>TOTAL EFECTIVO EN CAJA</b></div>
                          </v-col>
                          <v-col cols="3" sm="3" md="3">
                            <div class="text-lg-right">
                              <b>${{ formatoImporte(totalcajaanterior+totalcaja) }}</b>
                            </div>
                          </v-col>
                          <v-col cols="2" sm="2" md="2"></v-col>
                        </v-row>
                      </div>
<!--
                      <v-row>
                        <v-col cols="12" sm="12" md="12" v-show="lchequeo">
                          <v-data-table
                            :headers="headersChequeo"
                            :items="chequeo"
                            dense
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:item.total="{ item }">
                              <span disable dark>${{ formatoImporte(item.total) }}</span>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
-->
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

            <!--NUEVO MOVIMIENTO -->
            <v-dialog v-model="dialogMovimiento" max-width="500px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true"
                  icon @click="cerrarMovimiento">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="fg">
                  Nuevo Movimiento de Caja
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="caj.total!=0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarMovimiento(item)">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card class="fg">
                <v-form ref="pend">
                  <v-card-text>
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12" class="pt-0">
                          <v-select
                            v-model="caj.codmov_id"
                            :items="cajcodmovs"
                            outlined dense autofocus
                            item-value="id" item-text="nombre"
                            :color="temas.forms_titulo_bg"
                            label="Código de Movimiento de Caja"
                            @change="setNewMovCaj">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="caj.observ"
                            label="Observaciones">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sx="6" mx="6" class="pt-0">
                          <v-switch class="pt-0"
                            label="Imputa en Bancos"
                            v-model="caj.muevebancos"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="caj.total"
                            label="Total">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12">
                          <v-select class="pr-2" v-show="caj.muevebancos==true"
                            v-model="caj.cuentaorigen_id"
                            :items="cueItems"
                            dense
                            outlined
                            item-value="id"
                            :item-text="cueItems=>
                              `
                              ${cueItems.banco.nombre} -
                              ${cueItems.cuenta}
                              `"
                            :color="temas.forms_titulo_bg"
                            label="Cuenta">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sx="6" mx="6" class="pt-0">
                        </v-col>
                        <v-col cols="6" sx="6" mx="6" class="pt-0">
                          <v-text-field v-show="caj.muevebancos==true"
                            outlined dense
                            v-model="caj.numero"
                            label="Nro de Boleta"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!--FIN NUEVO MOVIMIENTO -->

            <!--DETALLE DE MOVIMIENTOS -->
            <v-dialog v-model="dialogMovDet" max-width="900px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true"
                  icon @click="cerrarMovDet">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="fg text--right">
                  Detalles de Caja
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card class="fg">
                <v-form ref="pend">
                  <v-card-text>
                    <v-container fluid>
                      <v-card-actions>
                        <v-col cols="12" sm="12">
                          <v-data-table
                            :headers="headersMovDetalles"
                            :items="movdetalles"
                            dense
                            class="elevation-3"
                            :footer-props="{
                              itemsPerPageOptions: [9,12,15,20],
                              showFirstLastPage: true,
                              showCurrentPage: true,
                              nextIcon: 'mdi-arrow-right-drop-circle-outline',
                              prevIcon: 'mdi-arrow-left-drop-circle-outline',
                            }">
                            <template v-slot:item.fecha="{ item }">
                              <span disable dark>{{ formatoFechaCorta(item.fecha) }}</span>
                            </template>
                            <template v-slot:item.observaciones="{ item }">
                              <span class="caption" disable dark>{{ item.observaciones }}</span>
                            </template>
                            <template v-slot:item.importe="{ item }">
                              <span disable dark>${{ formatoImporte(item.importe) }}</span>
                            </template>
                            <template v-slot:item.caja="{ item }">
                              <span disable dark>${{ verONoVer(item) }}</span>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-card-actions>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

          </v-toolbar>

          <v-col cols="12" sm="12">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              :color="temas.forms_titulo_bg"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>
        <template v-slot:item.cerrada="{ item }">
          <v-chip :color="getColor(item.cerrada)" dark>{{ item.cerrada ? 'Sí' : 'No' }}</v-chip>
        </template>
        <template v-slot:item.fechadesde="{ item }">
          <span disable dark>{{ formatoFecha(item.fechadesde) }}</span>
        </template>
        <template v-slot:item.fechahasta="{ item }">
          <span disable dark>{{ formatoFecha(item.fechahasta ? item.fechahasta : '') }}</span>
        </template>
        <template v-slot:item.saldo="{ item }">
          <span disable dark>$ {{ formatoImporte(item.saldo) }}</span>
        </template>

        <template v-slot:item.accion="{ item }">
          <v-menu bottom left v-if="cual=2">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="setAcciones(item)">
                <v-icon>mdi-18px mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item-group :color="temas.forms_titulo_bg">
                <v-list-item
                  v-for="(item, i) in acciones" :key="i">
                  <v-list-item-icon>
                    <v-icon
                      class="font-size: 24px"
                      @click="selAccion(item)" v-text="item.icon">
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      class="caption" @click="selAccion(item)">{{ item.nombre }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
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
import moment from 'moment';
import SBar from '../Forms/snackbar.vue';
import Confirmacion from '../Forms/confirmacion.vue';
import XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'


export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    page: 1,
    pages: 1,
    chequeo: [],
    ventas: [],
    compras: [],
    acciones: [],
    cueItems: [],
    movdet: [],
    movdetalles: [],
    totalcaja: 0,
    totalcajaanterior: 0,
    dialogMovimiento: false,
    dialogMovDet: false,
    lchequeo: false,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    caj: {
      codmov_id: 0,
      caja_id: 0,
      medio_id: 0,
      cuentaorigen_id: 0,
//    cuentadestino_id: 0,
//    cuentacheque_id: 0,
//    cuentatarjeta_id: 0,
//    banco_id: 0,
//    tarjeta_id: 0,
//    cpringreso_id: 0,
//    cpregreso_id: 0,
      banmov_id: 0,
//    cheque_id: 0,
//    fechafinanciera: '',
//    fechasalida: '',
//    importe: 0,
//    nrovalor: 0,
//    tipo: '',
      observ: '',
//    gravado: 0,
//    iva: 0,
//    tasaiva: 0,
      total: 0,
      numero: 0,
      muevebancos: 0,
    },
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    items: [],
    cajcodmovs: [
      {id: 1, nombre: 'RETIRO DE EFECTIVO',  coef: -1},
      {id: 2, nombre: 'APORTE DE DINERO',    coef:  1},
      {id: 3, nombre: 'ADELANTO DE SUELDOS', coef: -1},
      {id: 4, nombre: 'GASTOS VARIOS',       coef: -1},
      {id: 5, nombre: 'OTROS INGRESOS',      coef:  1},
      {id: 6, nombre: 'OTROS EGRESOS',       coef: -1},
    ],
    editadoCaja: {
      id: '',
      numero: '',
      fechadesde: '',
      fechahasta: '',
      cerrada: '',
    },
    movimientos: {
      valoresIngresados: [
        {id: 1, nombre: 'Efectivo',            total: 0},
        {id: 2, nombre: 'Cuentas Corrientes',  total: 0},
        {id: 3, nombre: 'Cheques',             total: 0},
        {id: 4, nombre: 'Tarjetas',            total: 0},
        {id: 5, nombre: 'Transferencias',      total: 0},
      ],
      valoresEgresados: [
        {id: 1, nombre: 'Efectivo',            total: 0},
        {id: 2, nombre: 'Cuentas Corrientes',  total: 0},
        {id: 3, nombre: 'Cheques Propios',     total: 0},
        {id: 4, nombre: 'Cheques de Terceros', total: 0},
        {id: 5, nombre: 'Tarjetas',            total: 0},
        {id: 6, nombre: 'Transferencias',      total: 0},
      ],
    },
    headers: [
      { text: 'ID',          value: 'id'},
      { text: 'NUMERO',      value: 'nrocaja'},
      { text: 'FECHA DESDE', value: 'fechadesde'},
      { text: 'FECHA HASTA', value: 'fechahasta'},
      { text: 'SALDO',       value: 'saldo'},
      { text: 'CERRADA',     value: 'cerrada'},
      { text: 'ACCIONES',    value: 'accion', sortable: false },
    ],
    headersChequeo: [
      { text: 'Fecha',       value: 'fecha'},
      { text: 'Descripcion', value: 'descripcion'},
      { text: 'Importe',     value: 'importe'},
      { text: 'TOTAL',       value: 'total'},
    ],
    headersMovDet: [
      { text: 'Fecha',         value: 'fecha', width: 89},
      { text: 'Medio',         value: 'medio', width: 39},
      { text: 'Descripcion',   value: 'descripcion', width: 220},
      { text: 'Observaciones', value: 'observaciones', width: 220},
      { text: 'Importe',       value: 'importe', align: 'end', width: 120},
      { text: 'Caja',          value: 'caja', align: 'end', width: 120},
    ],
    headersMovDetalles: [
      { text: 'Fecha',         value: 'fecha', width: 96},
      { text: 'Observaciones', value: 'observ', width: 450},
      { text: 'Importe',       value: 'importe', align: 'end', width: 120},
      { text: 'Caja',          value: 'caja', align: 'end', width: 120},
    ],

  }),


  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState(['temas', 'sucursal', 'empresa', 'datosPanel','caja', 'logotipo']),
  },

  
  watch: {
    '$store.state.sucursal' () {
      this.listarHTTP()
    },
  },


  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {

      return HTTP().get('/tercerocuentas/'+this.$store.state.tercero)
        .then(({ data }) => {
          this.cueItems = []
          for (let i=0; i<=data[0].cuentas.length-1; i++) {
            this.cueItems.push(data[0].cuentas[i])
          }
          if (this.cueItems.length>0) {
            this.caj.cuentaorigen_id = this.cueItems[0].id
          }
//        this.saldoCuenta()
          return this.listarHTTP()
      })

    }
  },
  methods: {
    ...mapMutations(['alert','closeAlert','setCaja']),
    closeForm(){
      router.push('/')
    },


    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          alert('exportando a XLS...')
        } else if (this.msg.msgAccion=='movimiento de caja') {
          this.nuevoMovimientoDeCajaHTTP()
        }
      }
      this.msg.msgVisible = false;
    },


    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },


    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      if (item.id == this.caja) {
        this.acciones.push({nombre: 'Cerrar Caja', icon: 'mdi-close'})
        this.acciones.push({nombre: 'Agregar Movimiento', icon: 'mdi-plus'})
      }
      this.acciones.push({nombre: 'Ver Movimientos', icon: 'mdi-glasses'})
      this.acciones.push({nombre: 'Enviar a Excel', icon: 'mdi-file-excel'})
      this.acciones.push({nombre: 'Imprimir', icon: 'mdi-file-pdf-box'})
    },


    selAccion(item) {
      if (item.nombre == 'Cerrar Caja') {
        this.cerrarCaja(this.itemActual) 
      } else if (item.nombre == 'Agregar Movimiento') {
        this.caj.codmov_id       = 1
        this.caj.caja_id         = this.caja
        this.caj.medio_id        = 0
        this.caj.numero          = 0
        this.caj.cuentaorigen_id = 0
        this.caj.banmov_id       = 0
        this.caj.observ          = this.cajcodmovs[this.caj.codmov_id-1].nombre
        this.caj.total           = 0
        this.caj.muevebancos     = 0
        this.dialogMovimiento    = true
      } else if (item.nombre == 'Ver Movimientos') {
        this.verMovimientos(this.itemActual)
      } else if (item.nombre == 'Enviar a Excel') {
        this.exportarAXLS()
      } else if (item.nombre == 'Imprimir') {
        this.imprimirCaja(this.itemActual)
      }
    },


    setNewMovCaj(item) {
      if (this.caj.observ=='') {
        this.caj.observ = this.cajcodmovs[this.caj.codmov_id-1].nombre
      }
    },


    cerrarMovimiento() {
      this.dialogMovimiento = false
    },


    cerrarMovDet() {
      this.dialogMovDet = false
    },


    guardarMovimiento(item) {
      this.msg.msgTitle = 'Movimiento de Caja' 
      this.msg.msgAccion = 'movimiento de caja'
      this.msg.msgBody = 'Confirma el movimiento de Caja?'
      this.msg.msgVisible = true
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },


    listarHTTP:function() {
      return HTTP().get('/cajas/'+this.userId+'/'+this.sucursal)
        .then(({ data }) => {
          this.items = data;
      });
    },


    verONoVer(item) {
      if (!item.ctacte) {
        return this.formatoImporte(item.caja)
      } else {
        return this.formatoImporte(0) 
      }
    },

    verMovimientos(item) {
      this.movdet = []
      this.movdetalles = []
      this.dialogMovDet = true
      let caja = 0
      return HTTP().get('/caja_anterior/'+this.userId+'/'+this.sucursal+'/'+item.nrocaja).then(({ data }) => {
        if (data.length) {
          this.movdet.push({
            fecha: data[0].fechahasta,
            medio: 'EF',
            descripcion: 'SALDO CAJA ANTERIOR',
            observaciones: 'Caja del '+moment(data[0].fechadesde).format('DD/MM/YY') +' al ' +moment(data[0].fechahasta).format('DD/MM/YY'),
            importe: data[0].saldo,
            caja: data[0].saldo,
            tipo: data[0].saldo > 0 ? 'I' : 'E'
          })
          caja = data[0].saldo
          this.movdetalles.push({
            fecha: moment().format('YYYY-MM-DD'),
            cpr: '',
            observ: 'SALDO DE CAJA ANTERIOR ('+moment(data[0].fechadesde).format('DD/MM/YY') +' al ' +moment(data[0].fechahasta).format('DD/MM/YY')+')',
            importe: data[0].saldo,
            caja: data[0].saldo,
          })

        } else {
          this.movdet.push({
            fecha: null,
            medio: 'EF',
            descripcion: 'NO HAY CAJA ANTERIOR',
            observaciones: '',
            importe: 0,
            caja: 0,
            tipo: 'I',
          })
          this.movdetalles.push({
            fecha: moment().format('YYYY-MM-DD'),
            cpr: '',
            observ:
            'SALDO DE CAJA ANTERIOR',
            importe: 0,
            caja: 0
          })
        }

        debugger
        return HTTP().post('/caja_detalles', {
          sucursal: this.sucursal,
          fechadesde: moment(item.fechadesde).format('YYYY-MM-DD'),
          fechahasta: item.fechahasta==null ? moment().format('YYYY-MM-DD') : moment(item.fechahasta).format('YYYY-MM-DD'),
          caja: item.id }).then((data) => {

          debugger
          if (data.data.length>0) {
            for (let i=0; i<=data.data.length-1; i++) {
              for (let j=0; j<=data.data[i].medio.length-1; j++) {
                let o = data.data[i].medio[j].ie=='I' ? 'Ingreso ' : 'Egreso '
                o += ' ' + data.data[i].cpr + ' '
                if (data.data[i].medio[j].forma==1) {
                  o += 'Efectivo '
                  if (data.data[i].medio[j].ie=='I') {
                    caja += data.data[i].medio[j].importe
                  } else {
                    caja -= data.data[i].medio[j].importe
                  }
                } else if (data.data[i].medio[j].forma==2) {
                  o += 'Tarjeta de Crédito ' 
                } else if (data.data[i].medio[j].forma==3) {
                  o += 'Tarjeta de Débito ' 
                } else if (data.data[i].medio[j].forma==4) {
                  o += 'a Cuenta Corriente ' 
                } else if (data.data[i].medio[j].forma==5) {
                  o += 'Transferencia ' 
                } else if (data.data[i].medio[j].forma==6) {
                  o += 'Cheque ' 
                } else if (data.data[i].medio[j].forma==7) {
                  o += 'Mercado Pago ' 
                } else if (data.data[i].medio[j].forma==8) {
                  o += 'Todo Pago ' 
                }
                if (data.data[i].medio[j].forma==6) {
                  o += ' - ' + data.data[i].medio[0].obs
                }
                this.movdetalles.push({
                  fecha: data.data[i].fecha,
                  cpr: data.data[i].cpr,
                  observ: o,
                  importe: data.data[i].medio[j].importe,
                  ctacte: data.data[i].medio[j].forma==4 ? true : false,
                  caja: caja,
                })
              }
            }
          } else {
            this.movdetalles.push({ fecha: moment().format('YYYY-MM-DD'), obs: 'SIN MOVIMIENTOS', importe: 0, })
          }
        })
      })
    },

    nuevoMovimientoDeCajaHTTP() {
      this.caj.caja_id = this.caja
      return HTTP().post('/cajanuevomovimiento', { caj: this.caj }).then(({ data }) => {
        this.dialogMovimiento = false
      });
    },


    altaHTTP:function() {
      let fechanuevacaja = moment(this.editadoCaja.fechahasta,'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')
      return HTTP().post('/caja_cerrar', {
        id:         this.editadoCaja.id,
        sucursal:   this.sucursal,
        fechadesde: moment(this.editadoCaja.fechadesde).format('YYYY-MM-DD'),
        fechahasta: moment(this.editadoCaja.fechahasta).format('YYYY-MM-DD'),
        fechanueva: fechanuevacaja,
        nrocaja:    this.editadoCaja.numero+1,
        saldo:      this.roundTo(this.totalcaja+this.totalcajaanterior,2)
        }).then(({ data }) => {
          this.$store.commit('setCaja', data.id, { root: true });
          this.lchequeo = false
          this.listarHTTP();
        });
    },


    exportarAXLS () {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Exportar a XLS'
      this.msg.msgBody = 'Desea exportar los datos a XLS'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a XLS'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },


    cerrarCaja(item) {
      if( this.$store.state.datosPanel.anotador ) {
        this.msg.msgTitle = 'Hay Anotaciones de Ventas'
        this.msg.msgBody = 'ATENCION! Hay anotaciones de ventas cargadas!.'
        this.msg.msgBody += 'Antes de continuar con el cierre de caja debe facturarlas!.'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'continuar'
        this.msg.msgButtons = ['Aceptar']
      } else {
        return HTTP().get('/caja_anterior/'+this.userId+'/'+this.sucursal+'/'+item.nrocaja).then(({ data }) => {
          this.dialog = true;
          this.editadoCaja.id = item.id
          this.editadoCaja.numero = item.nrocaja
          this.editadoCaja.fechadesde = moment(item.fechadesde).format('YYYY-MM-DD')
          this.editadoCaja.fechahasta = moment().format('YYYY-MM-DD')
          this.totalcajaanterior = 0
          if (data.length>0) {
            this.totalcajaanterior = data[0].saldo
          }
        });
      }
    },



    chequear(item) {

      /*
      SELECT mdp.nombre, sum(importe) as totalingresos FROM valores
      left join comprobantes as c on c.id = cpringreso_id
      left join medios_de_pagos as mdp on mdp.id = valores.medio_id
      where c.fecha >= '2020-01-01' and fecha <= '2021-12-31'
      and c.user_id = 4
      group by medio_id

      SELECT substr(cpr,1,3) as cpr, SUM(total) as tot FROM `gohu`.`comprobantes`
      where user_id = 4 and tipo in ('VE','RE')
      and (fecha >= '2020-09-27' and fecha<= '2021-12-31')
      and sucursal_id = 5
      and substr(cpr,1,3) in ('FAC', 'NDD', 'NDC', 'REC')
      group by substr(cpr,1,3)
      */

//      this.verMovimientos(this.itemActual)

      this.ventas = []
      this.compras = []
      this.totalcaja = 0

      return HTTP().post('/caja_resumenpormedios', {
        sucursal:   this.sucursal,
        fechadesde: this.editadoCaja.fechadesde,
        fechahasta: this.editadoCaja.fechahasta })
        .then((data) => {
          let total = 0
          if (data.data.length>0) {
            for (let i=0; i<=data.data.length-1; i++) {
              if (data.data[i].nombre=='Efectivo') {
                if (data.data[i].tipo=='I' || data.data[i].tipo=='D') {
                  this.totalcaja += data.data[i].total
                  this.ventas.push({
                    descripcion: data.data[i].tipo=='D'?'Por Ventas de Cheques':data.data[i].nombre,
                    total: '$'+this.formatoImporte(data.data[i].total),
                  })
                  total += data.data[i].total
                } else if (data.data[i].tipo=='E') {
                  this.totalcaja -= data.data[i].total
                  this.compras.push({
                    descripcion: data.data[i].nombre,
                    total: '$'+this.formatoImporte(data.data[i].total),
                  })
                  total -= data.data[i].total
                }
              }
            }
          }
          if (this.ventas.length==0) {
            this.ventas.push({ descripcion: 'Efectivo', total: '$ 0.00' })
          }
          if (this.compras.length==0) {
            this.compras.push({ descripcion: 'Efectivo', total: '$ 0.00' })
          }
          this.lchequeo = true
      })

    },


    cancelar() {
      this.dialog = false;
      this.lchequeo = false;
    },


    confirmarCierre() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', this.temas.forms_titulo_bg, 1500) 
        return this.dialog = true;
      }
      this.altaHTTP();
      this.mensaje('¡Alta Exitosa!', this.temas.forms_titulo_bg, 1500) 
      this.cancelar();
    },

    imprimirCaja(item) {
      /*
      SELECT mdp.nombre, sum(importe) as totalingresos FROM valores
      left join comprobantes as c on c.id = cpringreso_id
      left join medios_de_pagos as mdp on mdp.id = valores.medio_id
      where c.fecha >= '2020-01-01' and fecha <= '2021-12-31'
      and c.user_id = 4
      group by medio_id

      SELECT substr(cpr,1,3) as cpr, SUM(total) as tot FROM `gohu`.`comprobantes`
      where user_id = 4 and tipo in ('VE','RE')
      and (fecha >= '2020-09-27' and fecha<= '2021-12-31')
      and sucursal_id = 5
      and substr(cpr,1,3) in ('FAC', 'NDD', 'NDC', 'REC')
      group by substr(cpr,1,3)
      */
      this.rows = []
      this.totalcaja = 0
      let fdes = moment(item.fechadesde).format('YYYY-MM-DD')
      let fhas = moment(item.fechahasta).format('YYYY-MM-DD')
      if (item.fechahasta==null) {
        fhas = moment().format('YYYY-MM-DD')
      }
      return HTTP().post('/caja_detallada', {fechadesde:fdes,fechahasta:fhas,sucursal:this.sucursal}).then((data) => {
        debugger
        this.rows = data.data.res
        this.print('Detalles de Caja', item)
      })
    },

    print(informeTitulo, item) {
      var doc = new jsPDF('p', 'pt')  // 'p' normal 'l' horizontal ( landscape )
      this.page = 1
      this.pages = Math.trunc(this.rows.length/44)+1
      this.cabecera(informeTitulo, doc, 'p', item)
      this.detalles(informeTitulo, doc, 'p', item)
      doc.output ('dataurlnewwindow')
    },

    cabecera(informeTitulo, doc, orientacion, item) {
      let des = moment(item.fechadesde).format('YYYY-MM-DD')
      let has = moment().format('YYYY-MM-DD')
      let topDown = orientacion == 'p' ? 810 : 580
      let topWidth = orientacion == 'p' ? 527 : 777

      if (this.logotipo!=null) {
        let av = 'images/'+this.logotipo
        var img = new Image()
        img.src = av
        doc.addImage(img, 'jpg', 40, 28, 122, 45)
      }

      doc.setFontSize(8);
      doc.text ( 'Fecha: '+moment().format('L'), 40, 90 )
      doc.setFontSize(15);
      doc.text ( informeTitulo, 180, 45 )

      doc.setFontSize(9);
      doc.text ( 'Desde:'+des, 180, 67 )
      doc.text ( 'Hasta:'+has, 260, 67 )
      doc.text ( 'Página '+this.page.toString()+'/'+this.pages.toString(), topWidth, topDown)

      doc.text ( 'Area', 30, 115 )
      doc.line( 30, 121, 70, 121)

    },

    detalles(informeTitulo, doc, orientacion) {
      let f = 135
      let topDown = orientacion == 'p' ? 780 : 540
      let topWidth = orientacion == 'p' ? 570 : 800

      doc.text ( 'Comprobantes', 30, f )
      doc.text ( 'Ctt.', 168, f )
      doc.text ( 'Efectivo', 218, f )
      doc.text ( 'Tarjetas', 295, f )
      doc.text ( 'Cheques', 369, f )
      doc.text ( 'Bancos', 453, f )
      doc.text ( 'Cta.Ctes.', 530, f ); f+=5;
      doc.line( 30, f, 570, f);f+=5;

      let totCtt = 0;
      let totEfe = 0;
      let totTar = 0;
      let totChe = 0;
      let totBan = 0;
      let totCC = 0;

      f+=10;
      for (let z=0; z<=4; z++) {
        doc.setFont(undefined,"bold")
        doc.text ( this.rows[z].grupo, 30, f );
        doc.setFont(undefined,"normal")
        f+=15;
        let subCtt = 0; let subEfe = 0; let subTar = 0; let subChe = 0; let subBan = 0; let subCC = 0;
        for (let i=0; i<=this.rows[z].sucFis.length-1; i++) {
          for (let j=0; j<=this.rows[z].sucFis[i].op.length-1; j++) {
            doc.text ( this.rows[z].sucFis[i].op[j].desde, 30, f )
            if (z==0||z==1||z==2) {
              doc.text ( '/ '+this.rows[z].sucFis[i].op[j].hasta.substring(14,20), 125, f )
            }
            let coef = 1
            if (z==2||z==3||z==4) {
              coef = -1
            }
            doc.text ( this.rows[z].sucFis[i].op[j].cttcprs.toString(), 180, f, 'right' );
            doc.text ( '$'+this.formatMoney(this.rows[z].sucFis[i].op[j].efectivo*coef), 250, f, 'right' );
            doc.text ( '$'+this.formatMoney(this.rows[z].sucFis[i].op[j].tarjetas*coef), 328, f, 'right' );
            doc.text ( '$'+this.formatMoney(this.rows[z].sucFis[i].op[j].cheques*coef),  406, f, 'right' );
            doc.text ( '$'+this.formatMoney(this.rows[z].sucFis[i].op[j].bancos*coef),   484, f, 'right' );
            doc.text ( '$'+this.formatMoney(this.rows[z].sucFis[i].op[j].ctacte*coef),   569, f, 'right' ); f+=15;
            
            subCtt += this.rows[z].sucFis[i].op[j].cttcprs
            subEfe += this.rows[z].sucFis[i].op[j].efectivo*coef
            subTar += this.rows[z].sucFis[i].op[j].tarjetas*coef
            subChe += this.rows[z].sucFis[i].op[j].cheques*coef
            subBan += this.rows[z].sucFis[i].op[j].bancos*coef
            subCC += this.rows[z].sucFis[i].op[j].ctacte*coef

            totCtt += this.rows[z].sucFis[i].op[j].cttcprs
            totEfe += this.rows[z].sucFis[i].op[j].efectivo*coef
            totTar += this.rows[z].sucFis[i].op[j].tarjetas*coef
            totChe += this.rows[z].sucFis[i].op[j].cheques*coef
            totBan += this.rows[z].sucFis[i].op[j].bancos*coef
            totCC += this.rows[z].sucFis[i].op[j].ctacte*coef

          }
        }
        f-=5;
        doc.line( 128, f, 570, f);f+=15;
        doc.text ( 'Subtotal', 128, f )
        doc.text ( subCtt.toString(), 180, f, 'right' );
        doc.text ( '$'+this.formatMoney(subEfe), 250, f, 'right' );
        doc.text ( '$'+this.formatMoney(subTar), 328, f, 'right' );
        doc.text ( '$'+this.formatMoney(subChe), 406, f, 'right' );
        doc.text ( '$'+this.formatMoney(subBan), 484, f, 'right' );
        doc.text ( '$'+this.formatMoney(subCC), 569, f, 'right' ); f+=5;
        f+=10;
      }

      doc.setFont(undefined,"bold")
      doc.line( 128, f, 570, f);f+=15;
      doc.text ( 'Totales', 128, f )
      doc.text ( totCtt.toString(), 180, f, 'right' );
      doc.text ( '$'+this.formatMoney(totEfe), 250, f, 'right' );
      doc.text ( '$'+this.formatMoney(totTar), 328, f, 'right' );
      doc.text ( '$'+this.formatMoney(totChe), 406, f, 'right' );
      doc.text ( '$'+this.formatMoney(totBan), 484, f, 'right' );
      doc.text ( '$'+this.formatMoney(totCC), 569, f, 'right' ); f+=5;
      doc.setFont(undefined,"normal")
      f+=10;
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        const negativeSign = amount < 0 ? "-" : "";
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
      } catch (e) {
        console.log(e)
      }
    },

    formatoFecha(value) {
      return moment(String(value)).format('DD-MM-YYYY')
    },

    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },
  },
};
</script>

<style scoped lang="scss">
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