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
            <v-dialog v-model="dialog" max-width="900px"
              :transition="transition==null?'false':transition">
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
            <v-dialog v-model="dialogMovimiento" max-width="500px"
              :transition="transition==null?'false':transition">
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
            <v-dialog v-model="dialogMovDet" max-width="900px"
              :transition="transition==null?'false':transition">
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
    rows: [],
    movs: [],
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
    saldoAnterior: 0,
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
      banmov_id: 0,
      observ: '',
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
    ...mapState(['temas', 'sucursal', 'empresa', 'datosPanel','caja', 'logotipo', 'transition']),
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

      debugger
      return HTTP().get('/tercerocuentas/'+this.$store.state.tercero).then(({ data }) => {
        debugger
        this.cueItems = []
        for (let i=0; i<=data.tercero[0].cuentas.length-1; i++) {
          this.cueItems.push(data.tercero[0].cuentas[i])
        }
        if (this.cueItems.length>0) {
          this.caj.cuentaorigen_id = this.cueItems[0].id
        }
//      this.saldoCuenta()
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
      debugger
      return HTTP().get('/cajas/'+this.userId+'/'+this.sucursal).then(({ data }) => {
        debugger
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
        return HTTP().post('/caja_detalles', {
          sucursal: this.sucursal,
          fechadesde: moment(item.fechadesde).format('YYYY-MM-DD'),
          fechahasta: item.fechahasta==null ? moment().format('YYYY-MM-DD') : moment(item.fechahasta).format('YYYY-MM-DD'),
          caja: item.id }).then((data) => {
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
      this.rows = []
      this.totalcaja = 0
      let fdes = moment(item.fechadesde).format('YYYY-MM-DD')
      let fhas = moment(item.fechahasta).format('YYYY-MM-DD')
      if (item.fechahasta==null) {
        fhas = moment().format('YYYY-MM-DD')
      }
      debugger
      return HTTP().post('/caja_detallada', {fechadesde:fdes,fechahasta:fhas,sucursal:this.sucursal,caja_id:item.id}).then((data) => {

        debugger
        this.rows = data.data.res
  
        /* tengo que agrupar por tipos de comprobantes en ingresos.porventas e ingresos.porcobranzas */
        let dat = [
          { tipo: 'PG', datos: [] },
          { tipo: 'RE', datos: [] },
          { tipo: 'VE', datos: [] },
        ]
        let aux = []
        let imp = 0;
        let efec = 0;
        let tarj = 0;
        let ccte = 0;
        let elec = 0;
        let cheq = 0;
        let total = 0;
        let totGral = 0;
        if (this.rows.length>0) {
          for (let i=0; i<=dat.length-1; i++) {
            totGral = 0;
            aux = []
            for (let j=0; j<=this.rows.length-1; j++) {
              if (this.rows[j].tipo==dat[i].tipo) {
                efec = 0; tarj = 0; ccte = 0; elec = 0; cheq = 0; total = 0;

                imp = this.rows[j].importe
                if (this.rows[j].cpr.substring(0,3)=='NDC') {
                  imp = imp * -1
                }

                let mp = this.rows[j].mdpId
                if (mp==1) {                       // efectivo
                  efec = this.roundTo(imp,2)
                } else if (mp==2||mp==3) {         // tarjetas
                  tarj = this.roundTo(imp,2)
                } else if (mp==4) {                // cta.cte.
                  ccte = this.roundTo(imp,2)
                } else if (mp==5||mp==7||mp==8) {  // transferencia
                  elec = this.roundTo(imp,2)
                } else if (mp==6) {                // cheque
                  cheq = this.roundTo(imp,2)
                }
                
                total = this.roundTo(efec+tarj+ccte+elec+cheq,2)
                totGral += this.roundTo(efec+tarj+ccte+elec+cheq,2)
                
                let parDesde = this.rows[j].cpr.substring(0,5)
                let pos = aux.findIndex(x=>x.cprdesde.substring(0,5)==parDesde)
                if (pos==-1) {
                  aux.push({
                    cprs: '',
                    cprdesde: this.rows[j].cpr,
                    cprhasta: this.rows[j].cpr,
                    ctt: 1, efec:efec, tarj:tarj, ccte:ccte, elec:elec, cheq:cheq, total:total
                  })
                } else {
                  aux[pos].cprhasta = this.rows[j].cpr,
                  aux[pos].ctt += 1
                  aux[pos].efec += efec
                  aux[pos].tarj += tarj
                  aux[pos].ccte += ccte
                  aux[pos].elec += elec
                  aux[pos].cheq += cheq
                  aux[pos].total += efec+tarj+ccte+elec+cheq
                }
              }
            }
            dat[i].datos.push(aux);
          }
        } 
        // Acomodo los desde y hasta
        for (let i=0; i<=dat.length-1; i++) {
          for (let j=0; j<=dat[i].datos[0].length-1; j++) {
            dat[i].datos[0][j].cprs = this.kit.cpr(dat[i].datos[0][j].cprdesde)+'/'+dat[i].datos[0][j].cprhasta.substring(13)
          }
        }

        this.movs = {
          ingresos: {
            porventas: [],
            porcobranzas:  [],
            otrosingresos: { comprobantes:[], ctt:0, efectivo:0, tarjetas:0, cheques:0, electro:0, ctactes:0, total:0 },
          },
          egresos: {
            porcompras:    { comprobantes:[], ctt:0, efectivo:0, tarjetas:0, cheques:0, electro:0, ctactes:0, total:0 },
            porpagos:      [],
            otrosingresos: { comprobantes:[], ctt:0, efectivo:0, tarjetas:0, cheques:0, electro:0, ctactes:0, total:0 },
          },
        }

        this.movs.ingresos.porventas = dat[2].datos[0];
        this.movs.ingresos.porcobranzas = dat[1].datos[0];
        this.movs.egresos.porpagos = dat[0].datos[0];

        let cprDesde = '';
        let tipDesde = '';

        if (this.rows.length>0) {
          cprDesde = this.rows[0].cpr
          for (let i=0; i<=this.rows.length-1; i++) {

            tipDesde = this.rows[i].tipo
            let mp = this.rows[i].mdpId
            if (tipDesde=='CO'||tipDesde=='GS'||tipDesde=='BE') {

              this.movs.egresos.porcompras.comprobantes.push({
                cpr: this.kit.cpr(this.rows[i].cpr),
              })
              this.movs.egresos.porcompras.ctt ++
              if (mp==1) {                                                      // efectivo
                this.movs.egresos.porcompras.efectivo += this.rows[i].importe
              } else if (mp==2||mp==3) {                                        // tarjetas
                this.movs.egresos.porcompras.tarjetas += this.rows[i].importe
              } else if (mp==4) {                                               // cta.cte.
                this.movs.egresos.porcompras.ctasctes += this.rows[i].importe
              } else if (mp==5||mp==7||mp==8) {                                 // transferencia
                this.movs.egresos.porcompras.electro += this.rows[i].importe
              } else if (mp==6) {                                               // cheque
                this.movs.egresos.porcompras.cheques += this.rows[i].importe
              }
              this.movs.egresos.porcompras.total += this.rows[i].importe

            } else if (tipDesde=='BI') {

              this.movs.ingresos.porventas.comprobantes.push({cpr: this.kit.cpr(cprDesde), })
              this.movs.ingresos.porventas.ctt ++
              if (mp==1) {                                                      // efectivo
                this.movs.ingresos.porventas.efectivo += this.rows[i].importe
              } else if (mp==2||mp==3) {                                        // tarjetas
                this.movs.ingresos.porventas.tarjetas += this.rows[i].importe
              } else if (mp==4) {                                               // cta.cte.
                this.movs.ingresos.porventas.ctasctes += this.rows[i].importe
              } else if (mp==5||mp==7||mp==8) {                                 // transferencia
                this.movs.ingresos.porventas.electro += this.rows[i].importe
              } else if (mp==6) {                                               // cheque
                this.movs.ingresos.porventas.cheques += this.rows[i].importe
              }
              this.movs.ingresos.porventas.total += this.rows[i].importe
            }

          }
        }
        //this.movs = data.data.result
        this.saldoAnterior = data.data.saldoAnterior
        this.print('Detalles de Caja', item)
      })
    },

    print(informeTitulo, item) {
      var doc = new jsPDF('l', 'pt')  // 'p' normal 'l' horizontal ( landscape )
      this.cabecera(informeTitulo, doc, 'p', item)
      this.detalles(doc, 'l', item)
      doc.output ('dataurlnewwindow')
    },

    cabecera(informeTitulo, doc, orientacion, item) {
      let des = moment(item.fechadesde).format('DD-MM-YYYY')
      let has = moment().format('DD-MM-YYYY')
      if (item.cerrada) {
        has = moment(item.fechahasta).format('DD-MM-YYYY')
      }

      if (this.logotipo!=null) {
        let av = 'images/'+this.logotipo
        var img = new Image()
        img.src = av
        doc.addImage(img, 'jpg', 40, 28, 122, 45)
      }

      doc.setFontSize(8);
      doc.text ( 'Fecha: '+moment().format('L'), 30, 90 )
      doc.setFontSize(15);
      doc.text ( informeTitulo, 180, 45 )

      doc.setFontSize(9);
      doc.text ( 'Desde:'+des, 180, 67 )
      doc.text ( 'Hasta:'+has, 260, 67 )

    },

    detalles(doc, orientacion) {

      let f = 115
      let h = 750
      doc.text ( 'Ingresos', 30, f )
      f = this.cp(f, 10, 50, h, doc)
      doc.line( 30, f, 70, f)
      f = this.cp(f, 15, 50, h, doc)

      let totEfec = 0; let totTarj = 0; let totCheq = 0; let totElec = 0; let totCcte = 0; let totGral = 0;

      ////////////
      // VENTAS //
      ////////////
      if (this.movs.ingresos.porventas.length>0) {
        doc.text ( '   Por Ventas', 30, f )
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( '     comprobantes                                       ctt.                          Efectivo                          Tarjetas                         Cheques                            Electro                        Cta.Ctes.                               Total', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( '     ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 30, f);
        f = this.cp(f, 10, 50, h, doc)

        let efec = 0; let tarj = 0; let cheq = 0; let elec = 0; let ccte = 0; let total = 0;
        for (let i=0; i<=this.movs.ingresos.porventas.length-1; i++) {
          doc.text ( this.movs.ingresos.porventas[i].cprs, 42, f);
          doc.text ( this.movs.ingresos.porventas[i].ctt.toString(), 203, f);
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porventas[i].efec),  306, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porventas[i].tarj),  404, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porventas[i].cheq),  502, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porventas[i].elec),  600, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porventas[i].ccte),  698, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porventas[i].total), 796, f, 'right' );
          f = this.cp(f, 10, 50, h, doc)
          efec += this.movs.ingresos.porventas[i].efec
          tarj += this.movs.ingresos.porventas[i].tarj
          cheq += this.movs.ingresos.porventas[i].cheq
          elec += this.movs.ingresos.porventas[i].elec
          ccte += this.movs.ingresos.porventas[i].ccte
          total += this.movs.ingresos.porventas[i].total

          totEfec += this.movs.ingresos.porventas[i].efec
          totTarj += this.movs.ingresos.porventas[i].tarj
          totCheq += this.movs.ingresos.porventas[i].cheq
          totElec += this.movs.ingresos.porventas[i].elec
          totCcte += this.movs.ingresos.porventas[i].ccte
          totGral += this.movs.ingresos.porventas[i].total
          
        }
        doc.text ( '     ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( '$'+this.formatoImporte(efec),  306, f, 'right' );
        doc.text ( '$'+this.formatoImporte(tarj),  404, f, 'right' );
        doc.text ( '$'+this.formatoImporte(cheq),  502, f, 'right' );
        doc.text ( '$'+this.formatoImporte(elec),  600, f, 'right' );
        doc.text ( '$'+this.formatoImporte(ccte),  698, f, 'right' );
        doc.text ( '$'+this.formatoImporte(total), 796, f, 'right' );
        f = this.cp(f, 15, 50, h, doc)

      }

      ///////////////
      // COBRANZAS //
      ///////////////
      if (this.movs.ingresos.porcobranzas.length>0) {
        doc.text ( '   Por Cobranzas', 30, f )
        f = this.cp(f, 10, 54, h, doc)
        doc.text ( '     comprobantes                                       ctt.                          Efectivo                          Tarjetas                         Cheques                            Electro                        Cta.Ctes.                               Total', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( '     ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        let efec = 0; let tarj = 0; let cheq = 0; let elec = 0; let ccte = 0; let total = 0;
        for (let i=0; i<=this.movs.ingresos.porcobranzas.length-1; i++) {
          doc.text ( this.movs.ingresos.porcobranzas[i].cprs, 42, f);
          doc.text ( this.movs.ingresos.porcobranzas[i].ctt.toString(), 203, f);
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porcobranzas[i].efec),  306, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porcobranzas[i].tarj),  404, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porcobranzas[i].cheq),  502, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porcobranzas[i].elec),  600, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porcobranzas[i].ccte),  698, f, 'right' );
          doc.text ( '$'+this.formatoImporte(this.movs.ingresos.porcobranzas[i].total), 796, f, 'right' );
          f = this.cp(f, 10, 50, h, doc)
          efec += this.movs.ingresos.porcobranzas[i].efec
          tarj += this.movs.ingresos.porcobranzas[i].tarj
          cheq += this.movs.ingresos.porcobranzas[i].cheq
          elec += this.movs.ingresos.porcobranzas[i].elec
          ccte += this.movs.ingresos.porcobranzas[i].ccte
          total += this.movs.ingresos.porcobranzas[i].total

          totEfec += this.movs.ingresos.porcobranzas[i].efec
          totTarj += this.movs.ingresos.porcobranzas[i].tarj
          totCheq += this.movs.ingresos.porcobranzas[i].cheq
          totElec += this.movs.ingresos.porcobranzas[i].elec
          totCcte += this.movs.ingresos.porcobranzas[i].ccte
          totGral += this.movs.ingresos.porcobranzas[i].total

        }
        doc.text ( '     ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( '$'+this.formatoImporte(efec),  306, f, 'right' );
        doc.text ( '$'+this.formatoImporte(tarj),  404, f, 'right' );
        doc.text ( '$'+this.formatoImporte(cheq),  502, f, 'right' );
        doc.text ( '$'+this.formatoImporte(elec),  600, f, 'right' );
        doc.text ( '$'+this.formatoImporte(ccte),  698, f, 'right' );
        doc.text ( '$'+this.formatoImporte(total), 796, f, 'right' );
        f = this.cp(f, 15, 50, h, doc)
      }

      ////////////////////
      // OTROS INGRESOS //
      ////////////////////
      if (this.movs.ingresos.otrosingresos.total) {
        doc.text ( '   Por Otros Ingresos', 30, f )
        f = this.cp(f, 10, 59, h, doc)
        doc.text ( '     comprobantes                                       ctt.                          Efectivo                          Tarjetas                         Cheques                            Electro                        Cta.Ctes.                               Total', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( '     ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( this.movs.ingresos.otrosingresos.comprobantes[0].cpr, 42, f);
        doc.text ( this.movs.ingresos.otrosingresos.ctt.toString(), 203, f);
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.ingresos.otrosingresos.efectivo)*-1), 306, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.ingresos.otrosingresos.tarjetas)*-1), 404, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.ingresos.otrosingresos.cheques)*-1),  502, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.ingresos.otrosingresos.electro)*-1),  600, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.ingresos.otrosingresos.ctactes)*-1),  698, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.ingresos.otrosingresos.total)*-1),    796, f, 'right' );

        totEfec += this.movs.ingresos.otrosingresos[i].efectivo
        totTarj += this.movs.ingresos.otrosingresos[i].tarjetas
        totCheq += this.movs.ingresos.otrosingresos[i].cheques
        totElec += this.movs.ingresos.otrosingresos[i].electro
        totCcte += this.movs.ingresos.otrosingresos[i].ctactes
        totGral += this.movs.ingresos.otrosingresos[i].total

        f = this.cp(f, 15, 50, h, doc)
      }

      f = this.cp(f, 5, 50, h, doc)
      doc.text ( 'Egresos', 30, f )
      f = this.cp(f, 10, 50, h, doc)
      doc.line( 30, f, 70, f)
      f = this.cp(f, 15, 50, h, doc)

      //////////////////////
      // COMPRAS Y GASTOS //
      //////////////////////
      if (this.movs.egresos.porcompras.total) {
        doc.text ( '   Por Compras/Gastos', 30, f )
        f = this.cp(f, 10, 59, h, doc)
        doc.text ( '     comprobantes                                       ctt.                          Efectivo                          Tarjetas                         Cheques                            Electro                        Cta.Ctes.                               Total', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( '     ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( this.movs.egresos.porcompras.comprobantes[0].cpr, 42, f);
        doc.text ( this.movs.egresos.porcompras.ctt.toString(), 203, f);
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porcompras.efectivo)*-1), 306, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porcompras.tarjetas)*-1), 404, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porcompras.cheques)*-1),  502, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porcompras.electro)*-1),  600, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porcompras.ctactes)*-1),  698, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porcompras.total)*-1),    796, f, 'right' );

        totEfec -= Math.abs(this.movs.egresos.porcompras.efectivo)
        totTarj -= Math.abs(this.movs.egresos.porcompras.tarjetas)
        totCheq -= Math.abs(this.movs.egresos.porcompras.cheques)
        totElec -= Math.abs(this.movs.egresos.porcompras.electro)
        totCcte -= Math.abs(this.movs.egresos.porcompras.ctactes)
        totGral -= Math.abs(this.movs.egresos.porcompras.total)

        f = this.cp(f, 15, 50, h, doc)
      }

      ///////////
      // PAGOS //
      ///////////
      if (this.movs.egresos.porpagos.length>0) {
        doc.text ( '   Por Pagos', 30, f )
        f = this.cp(f, 10, 54, h, doc)
        doc.text ( '     comprobantes                                       ctt.                          Efectivo                          Tarjetas                         Cheques                            Electro                        Cta.Ctes.                               Total', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( '     ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        let efec = 0; let tarj = 0; let cheq = 0; let elec = 0; let ccte = 0; let total = 0;
        for (let i=0; i<=this.movs.egresos.porpagos.length-1; i++) {
          doc.text ( this.movs.egresos.porpagos[i].cprs, 42, f);
          doc.text ( this.movs.egresos.porpagos[i].ctt.toString(), 203, f);
          doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porpagos[i].efec)*-1),  306, f, 'right' );
          doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porpagos[i].tarj)*-1),  404, f, 'right' );
          doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porpagos[i].cheq)*-1),  502, f, 'right' );
          doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porpagos[i].elec)*-1),  600, f, 'right' );
          doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porpagos[i].ccte)*-1),  698, f, 'right' );
          doc.text ( '$'+this.formatoImporte(Math.abs(this.movs.egresos.porpagos[i].total)*-1), 796, f, 'right' );
          f = this.cp(f, 10, 50, h, doc)
          efec += this.movs.egresos.porpagos[i].efec
          tarj += this.movs.egresos.porpagos[i].tarj
          cheq += this.movs.egresos.porpagos[i].cheq
          elec += this.movs.egresos.porpagos[i].elec
          ccte += this.movs.egresos.porpagos[i].ccte
          total += this.movs.egresos.porpagos[i].total

          totEfec -= Math.abs(this.movs.egresos.porpagos[i].efec)
          totTarj -= Math.abs(this.movs.egresos.porpagos[i].tarj)
          totCheq -= Math.abs(this.movs.egresos.porpagos[i].cheq)
          totElec -= Math.abs(this.movs.egresos.porpagos[i].elec)
          totCcte -= Math.abs(this.movs.egresos.porpagos[i].ccte)
          totGral -= Math.abs(this.movs.egresos.porpagos[i].total)

        }
        doc.text ( '     ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', 30, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.text ( '$'+this.formatoImporte(Math.abs(efec)*-1),  306, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(tarj)*-1),  404, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(cheq)*-1),  502, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(elec)*-1),  600, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(ccte)*-1),  698, f, 'right' );
        doc.text ( '$'+this.formatoImporte(Math.abs(total)*-1), 796, f, 'right' );
        f = this.cp(f, 15, 50, h, doc)
      }

      f = this.cp(f, 5, 50, h, doc)
      doc.text ( 'Totales', 30, f )
      f = this.cp(f, 10, 50, h, doc)
      doc.line( 30, f, 70, f)
      f = this.cp(f, 15, 50, h, doc)
      doc.text ( '$'+this.formatoImporte(totEfec),  306, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totTarj),  404, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totCheq),  502, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totElec),  600, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totCcte),  698, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totGral), 796, f, 'right' );
      f = this.cp(f, 15, 50, h, doc)

      f = this.cp(f, 15, 50, h, doc)
      doc.text ( 'Efectivo Anterior', 30, f )
      doc.text ( '$'+this.formatoImporte(this.saldoAnterior), 190, f, 'right' );

      f = this.cp(f, 15, 50, h, doc)
      doc.text ( 'Movimientos por', 30, f )
      doc.text ( '$'+this.formatoImporte(totEfec), 190, f, 'right' );

      f = this.cp(f, 15, 50, h, doc)
      doc.text ( 'Efectivo Final', 30, f )
      doc.text ( '$'+this.formatoImporte(totEfec+this.saldoAnterior), 190, f, 'right' );

    },
    
    detalles2(doc, orientacion) {

      let totCtt = 0;
      let totEfe = 0;
      let totTar = 0;
      let totChe = 0;
      let totBan = 0;
      let totCC = 0;
      let f = 115
      let h = 750
      for (let z=0; z<=4; z++) {
        for (let i=0; i<=this.rows[z].sucFis.length-1; i++) {
          for (let j=0; j<=this.rows[z].sucFis[i].op.length-1; j++) {
            let coef = 1
            if (z==2||z==3||z==4) {
              coef = -1
            }
            totEfe += this.rows[z].sucFis[i].op[j].efectivo*coef
          }
        }
      }
      for (let z=0; z<=this.movs.length-1; z++) {
        if (this.movs[z].cpr==null&&this.movs[z].abrev=='EF'&&this.movs[z].cuenta!=null) {
          totEfe += this.movs[z].importe
        }
      }

      doc.text ( 'Efectivo Anterior', 30, f )
      doc.text ( '$'+this.formatoImporte(this.saldoAnterior), 190, f, 'right' );

      f = this.cp(f, 15, 50, h, doc)
      doc.text ( 'Movimientos por', 30, f )
      doc.text ( '$'+this.formatoImporte(totEfe), 190, f, 'right' );

      f = this.cp(f, 15, 50, h, doc)
      doc.text ( 'Efectivo Final', 30, f )
      doc.text ( '$'+this.formatoImporte(totEfe+this.saldoAnterior), 190, f, 'right' );

      doc.setFont(undefined,"normal")
      totEfe = 0
      f = this.cp(f, 30, 50, h, doc)
      doc.text ( 'Area', 30, f )
      f = this.cp(f, 10, 50, h, doc)
      doc.line( 30, f, 70, f)
      f = this.cp(f, 15, 50, h, doc)

      doc.text ( 'Comprobantes', 30, f )
      doc.text ( 'Ctt.', 148, f )
      doc.text ( 'Efectivo', 218, f )
      doc.text ( 'Tarjetas', 295, f )
      doc.text ( 'Cheques', 369, f )
      doc.text ( 'Bancos', 453, f )
      doc.text ( 'Cta.Ctes.', 530, f );
      
      f = this.cp(f, 5, 50, h, doc)
      doc.line( 30, f, 570, f);
      f = this.cp(f, 15, 50, h, doc)
      for (let z=0; z<=5; z++) {                  // 4, 5 incluye a bancos
        doc.setFont(undefined,"bold")
        doc.text ( this.rows[z].grupo, 30, f );
        doc.setFont(undefined,"normal")
        f = this.cp(f, 15, 50, h, doc)
        let subCtt = 0; let subEfe = 0; let subTar = 0; let subChe = 0; let subBan = 0; let subCC = 0;
        for (let i=0; i<=this.rows[z].sucFis.length-1; i++) {
          for (let j=0; j<=this.rows[z].sucFis[i].op.length-1; j++) {
            doc.text ( this.kit.cpr(this.rows[z].sucFis[i].op[j].desde), 30, f )
            if (z==0||z==1||z==2) {
              doc.text ( '/ '+this.rows[z].sucFis[i].op[j].hasta.substring(14,20), 100, f )
            }
            let coef = 1
            if (z==2||z==3||z==4) {
              coef = -1
            }
            doc.text ( this.rows[z].sucFis[i].op[j].cttcprs.toString(), 160, f, 'right' );
            doc.text ( '$'+this.formatoImporte(this.rows[z].sucFis[i].op[j].efectivo*coef), 250, f, 'right' );
            doc.text ( '$'+this.formatoImporte(this.rows[z].sucFis[i].op[j].tarjetas*coef), 328, f, 'right' );
            doc.text ( '$'+this.formatoImporte(this.rows[z].sucFis[i].op[j].cheques*coef),  406, f, 'right' );
            doc.text ( '$'+this.formatoImporte(this.rows[z].sucFis[i].op[j].bancos*coef),   484, f, 'right' );
            doc.text ( '$'+this.formatoImporte(this.rows[z].sucFis[i].op[j].ctacte*coef),   569, f, 'right' );
            
            f = this.cp(f, 15, 50, h, doc)
            
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

        f = this.cp(f, -5, 50, h, doc)
        doc.line( 108, f, 570, f);
        f = this.cp(f, 15, 50, h, doc)
        
        doc.text ( 'Subtotal', 108, f )
        doc.text ( subCtt.toString(), 160, f, 'right' );
        doc.text ( '$'+this.formatoImporte(subEfe), 250, f, 'right' );
        doc.text ( '$'+this.formatoImporte(subTar), 328, f, 'right' );
        doc.text ( '$'+this.formatoImporte(subChe), 406, f, 'right' );
        doc.text ( '$'+this.formatoImporte(subBan), 484, f, 'right' );
        doc.text ( '$'+this.formatoImporte(subCC), 569, f, 'right' );
        
        f = this.cp(f, 15, 50, h, doc)
      
      }

      doc.setFont(undefined,"bold")
      doc.line( 108, f-5, 570, f-5);
      
      f = this.cp(f, 15, 50, h, doc)
      
      doc.text ( 'Totales', 108, f )
      doc.text ( totCtt.toString(), 160, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totEfe), 250, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totTar), 328, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totChe), 406, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totBan), 484, f, 'right' );
      doc.text ( '$'+this.formatoImporte(totCC), 569, f, 'right' );

      let totEfeIng = 0
      let totEfeEgr = 0
      let totCheIng = 0
      let totCheEgr = 0
      let totTraIng = 0
      let totTraEgr = 0
      let totTarIng = 0
      let totTarEgr = 0

      let hayEfeIng = false
      let hayEfeEgr = false
      let hayCheIng = false
      let hayCheEgr = false
      let hayTraIng = false
      let hayTraEgr = false
      let hayTarIng = false
      let hayTarEgr = false
      for (let i=0; i<=this.movs.length-1; i++) {
        if (this.movs[i].abrev=='EF') {
          if (this.movs[i].tipo=='egreso') {
            hayEfeEgr = true
          } else if (this.movs[i].tipo=='ingreso') {
            hayEfeIng = true
          }
        } else if (this.movs[i].abrev=='CH') {
          if (this.movs[i].tipo=='egreso') {
            hayCheEgr = true
          } else if (this.movs[i].tipo=='ingreso') {
            hayCheIng = true
          }
        } else if (this.movs[i].abrev=='TR') {
          if (this.movs[i].tipo=='egreso') {
            hayTraEgr = true
          } else if (this.movs[i].tipo=='ingreso') {
            hayTraIng = true
          }
        } else if (this.movs[i].abrev=='TJ') {
          if (this.movs[i].tipo=='egreso') {
            hayTarEgr = true
          } else if (this.movs[i].tipo=='ingreso') {
            hayTarIng = true
          }
        }
      }

      doc.setFontSize(8);
      f = this.cp(f, 35, 50, h, doc)

      //////////////////////////
      /// EFECTIVO INGRESOS  ///
      //////////////////////////
      doc.setFontSize(8);
      if (hayEfeIng) {
        f = this.cp(f, 15, 50, h, doc)
        doc.setFont(undefined,"bold")
        doc.text ( 'EFECTIVO INGRESADO', 30, f )
        doc.setFont(undefined,"normal")
        f = this.cp(f, 15, 50, h, doc)
        doc.text ( 'Cpr', 30, f )
        doc.text ( 'Importe', 541, f );
        f = this.cp(f, 5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.setFontSize(6);
        for (let i=0; i<=this.movs.length-1; i++) {
          if (this.movs[i].abrev=='EF') {
            if (this.movs[i].tipo=='ingreso') {
              if (this.movs[i].cpr!=null) {
                doc.text ( this.kit.cpr(this.movs[i].cpr)+' '+this.movs[i].cliente, 30, f )
              } else {
                doc.text ( this.movs[i].observ+' '+this.movs[i].banco+' '+this.movs[i].cuenta, 30, f )
              }
              doc.text ( '$'+this.formatoImporte(this.movs[i].importe), 569, f, 'right' );
              f = this.cp(f, 10, 50, h, doc)
              totEfeIng += this.movs[i].importe
            }
          }
        }
        f = this.cp(f, -5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 8, 50, h, doc)
        doc.text ( 'Total', 30, f )
        doc.text ( '$'+this.formatoImporte(totEfeIng), 569, f, 'right' );

      }


      /////////////////////////
      /// EFECTIVO EGRESOS  ///
      /////////////////////////
      doc.setFontSize(8);
      if (hayEfeEgr) {

        f = this.cp(f, 15, 50, h, doc)
        doc.setFont(undefined,"bold")
        doc.text ( 'EFECTIVO EGRESADO', 30, f )
        doc.setFont(undefined,"normal")
        f = this.cp(f, 15, 50, h, doc)
        doc.text ( 'Cpr', 30, f )
        doc.text ( 'Importe', 541, f );
        f = this.cp(f, 5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.setFontSize(6);

        for (let i=0; i<=this.movs.length-1; i++) {
          if (this.movs[i].abrev=='EF') {
            if (this.movs[i].tipo=='egreso') {
              let imp = Math.abs(this.movs[i].importe)*-1
              if (this.movs[i].cpr!=null) {
                doc.text ( this.kit.cpr(this.movs[i].cpr+' '+this.movs[i].proveedor), 30, f )
              } else {
                doc.text ( this.movs[i].observ+' '+this.movs[i].banco+' '+this.movs[i].cuenta, 30, f )
              }
              doc.text ( '$'+this.formatoImporte(imp), 569, f, 'right' );
              f = this.cp(f, 10, 50, h, doc)
              totEfeEgr += imp
            }
          }
        }
        f = this.cp(f, -5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 8, 50, h, doc)
        doc.text ( 'Total', 30, f )
        doc.text ( '$'+this.formatoImporte(totEfeEgr), 569, f, 'right' );
      }


      ////////////////////////
      /// CHEQUES EGRESOS  ///
      ////////////////////////
      if (hayCheEgr) {
        doc.setFontSize(8);
        f = this.cp(f, 15, 50, h, doc)
        doc.setFont(undefined,"bold")
        doc.text ( 'CHEQUES EGRESADOS', 30, f )
        doc.setFont(undefined,"normal")
        f = this.cp(f, 15, 50, h, doc)
        doc.text ( 'Cpr', 30, f )
        doc.text ( 'Detalles', 90, f )
        doc.text ( 'Librador', 365, f )
        doc.text ( 'Importe', 541, f );
        f = this.cp(f, 5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.setFontSize(6);
        for (let i=0; i<=this.movs.length-1; i++) {
          if (this.movs[i].abrev=='CH') {
            if (this.movs[i].tipo=='egreso') {
              doc.text ( this.kit.cpr(this.movs[i].cpr), 30, f )
              doc.text ( this.movs[i].observ+' '+this.movs[i].banco+' '+this.movs[i].cuenta, 90, f )
              doc.text ( this.movs[i].librador, 365, f )
              doc.text ( '$'+this.formatoImporte(this.movs[i].importe), 569, f, 'right' );
              f = this.cp(f, 10, 50, h, doc)
              totCheEgr += this.movs[i].importe
            }
          }
        }
        f = this.cp(f, -5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 8, 50, h, doc)
        doc.text ( 'Total', 30, f )
        doc.text ( '$'+this.formatoImporte(totCheEgr), 569, f, 'right' );
      }


      ////////////////////////
      /// CHEQUES INGRESOS ///
      ////////////////////////
      if (hayCheIng) {
        doc.setFontSize(8);
        f = this.cp(f, 15, 50, h, doc)
        doc.setFont(undefined,"bold")
        doc.text ( 'CHEQUES INGRESADOS', 30, f )
        doc.setFont(undefined,"normal")
        f = this.cp(f, 15, 50, h, doc)

        doc.text ( 'Cpr', 30, f )
        doc.text ( 'Detalles', 90, f )
        doc.text ( 'Librador', 415, f )
        doc.text ( 'Importe', 541, f );

        f = this.cp(f, 5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.setFontSize(6);

        for (let i=0; i<=this.movs.length-1; i++) {
          if (this.movs[i].abrev=='CH') {
            if (this.movs[i].tipo=='ingreso') {
              doc.text ( this.kit.cpr(this.movs[i].cpr), 30, f )
              doc.text ( this.movs[i].observ+' '+this.movs[i].banco+' '+this.movs[i].cuenta, 90, f )
              doc.text ( this.movs[i].librador, 415, f )
              doc.text ( '$'+this.formatoImporte(this.movs[i].importe), 569, f, 'right' );
              f = this.cp(f, 10, 50, h, doc)
              totCheIng += this.movs[i].importe
            }
          }
        }
        f = this.cp(f, -5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 8, 50, h, doc)
        doc.text ( 'Total', 30, f )
        doc.text ( '$'+this.formatoImporte(totCheIng), 569, f, 'right' );
      }


      ////////////////////////////////
      /// TRANSFERENCIAS INGRESOS  ///
      ////////////////////////////////
      if (hayTraIng) {
        doc.setFontSize(8);
        f = this.cp(f, 15, 50, h, doc)
        doc.setFont(undefined,"bold")
        doc.text ( 'TRANSFERENCIAS INGRESADAS', 30, f )
        doc.setFont(undefined,"normal")
        f = this.cp(f, 15, 50, h, doc)
        doc.text ( 'Cpr', 30, f )
        doc.text ( 'Detalles', 90, f )
        doc.text ( 'Importe', 541, f );
        f = this.cp(f, 5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.setFontSize(6);

        for (let i=0; i<=this.movs.length-1; i++) {
          if (this.movs[i].abrev=='TR') {
            if (this.movs[i].tipo=='ingreso') {
              doc.text ( this.kit.cpr(this.movs[i].cpr), 30, f )

              let txt = this.movs[i].observ
              if (this.movs[i].banco!=null) {
                txt += ' - '+this.movs[i].banco
              }
              if (this.movs[i].cuenta!=null) {
                txt += ' - '+this.movs[i].cuenta
              }

              doc.text ( txt, 90, f )
              doc.text ( '$'+this.formatoImporte(this.movs[i].importe), 569, f, 'right' );
              f = this.cp(f, 10, 50, h, doc)
              totTraIng += this.movs[i].importe
            }
          }
        }
        f = this.cp(f, -5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 8, 50, h, doc)
        doc.text ( 'Total', 30, f )
        doc.text ( '$'+this.formatoImporte(totTraIng), 569, f, 'right' );
      }


      ///////////////////////////////
      /// TRANSFERENCIAS EGRESOS  ///
      ///////////////////////////////
      if (hayTraEgr) {
        doc.setFontSize(8);
        f = this.cp(f, 15, 50, h, doc)
        doc.setFont(undefined,"bold")
        doc.text ( 'TRANSFERENCIAS EGRESADAS', 30, f )
        doc.setFont(undefined,"normal")
        f = this.cp(f, 15, 50, h, doc)
        doc.text ( 'Cpr', 30, f )
        doc.text ( 'Detalles', 90, f )
        doc.text ( 'Importe', 541, f );
        f = this.cp(f, 5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.setFontSize(6);

        for (let i=0; i<=this.movs.length-1; i++) {
          if (this.movs[i].abrev=='TR') {
            if (this.movs[i].tipo=='egreso') {
              doc.text ( this.kit.cpr(this.movs[i].cpr), 30, f )
              doc.text ( this.movs[i].observ+' '+this.movs[i].banco+' '+this.movs[i].cuenta, 90, f )
              doc.text ( '$'+this.formatoImporte(this.movs[i].importe), 569, f, 'right' );
              f = this.cp(f, 10, 50, h, doc)
              totTraEgr += this.movs[i].importe
            }
          }
        }
        f = this.cp(f, -5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 8, 50, h, doc)
        doc.text ( 'Total', 30, f )
        doc.text ( '$'+this.formatoImporte(totTraEgr), 569, f, 'right' );
      }


      //////////////////////////
      /// TARJETAS INGRESOS  ///
      //////////////////////////
      if (hayTarIng) {
        doc.setFontSize(8);
        f = this.cp(f, 15, 50, h, doc)
        doc.setFont(undefined,"bold")
        doc.text ( 'TARJETAS INGRESADAS', 30, f )
        doc.setFont(undefined,"normal")
        f = this.cp(f, 15, 50, h, doc)
        doc.text ( 'Cpr', 30, f )
        doc.text ( 'Detalles', 90, f )
        doc.text ( 'Importe', 541, f );
        f = this.cp(f, 5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.setFontSize(6);

        for (let i=0; i<=this.movs.length-1; i++) {
          if (this.movs[i].abrev=='TC') {
            if (this.movs[i].tipo=='ingreso') {
              doc.text ( this.kit.cpr(this.movs[i].cpr), 30, f )
              doc.text ( this.movs[i].observ+' '+this.movs[i].banco+' '+this.movs[i].cuenta, 90, f )
              doc.text ( '$'+this.formatoImporte(this.movs[i].importe), 569, f, 'right' );
              f = this.cp(f, 10, 50, h, doc)
              totTarIng += this.movs[i].importe
            }
          }
        }
        f = this.cp(f, -5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 8, 50, h, doc)
        doc.text ( 'Total', 30, f )
        doc.text ( '$'+this.formatoImporte(totTarIng), 569, f, 'right' );
      }


      /////////////////////////
      /// TARJETAS EGRESOS  ///
      /////////////////////////
      if (hayTarEgr) {
        doc.setFontSize(8);
        f = this.cp(f, 15, 50, h, doc)
        doc.setFont(undefined,"bold")
        doc.text ( 'TARJETAS EGRESADAS', 30, f )
        doc.setFont(undefined,"normal")
        f = this.cp(f, 15, 50, h, doc)
        doc.text ( 'Cpr', 30, f )
        doc.text ( 'Detalles', 90, f )
        doc.text ( 'Importe', 541, f );
        f = this.cp(f, 5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 10, 50, h, doc)
        doc.setFontSize(6);

        for (let i=0; i<=this.movs.length-1; i++) {
          if (this.movs[i].abrev=='TC') {
            if (this.movs[i].tipo=='egreso') {
              doc.text ( this.kit.cpr(this.movs[i].cpr), 30, f )
              doc.text ( this.movs[i].observ+' '+this.movs[i].banco+' '+this.movs[i].cuenta, 90, f )
              doc.text ( '$'+this.formatoImporte(this.movs[i].importe), 569, f, 'right' );
              f = this.cp(f, 10, 50, h, doc)
              totTarEgr += this.movs[i].importe
            }
          }
        }
        f = this.cp(f, -5, 50, h, doc)
        doc.line( 30, f, 570, f);
        f = this.cp(f, 8, 50, h, doc)
        doc.text ( 'Total', 30, f )
        doc.text ( '$'+this.formatoImporte(totTarEgr), 569, f, 'right' );
      }

    },

    cp(f, s, i, t, d) {
      // f = fila
      // s = a sumar
      // i = fila inicial ante nueva pagina
      // t = tope de lineas
      // d = documento
      if ((f+s)>t) {
        d.addPage()
        f = i
        return f
      }
      f += s
      return f
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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