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
          itemsPerPageOptions: [10],
          showFirstLastPage: true,
          showCurrentPage: true,
          nextIcon: 'mdi-arrow-right-drop-circle-outline',
          prevIcon: 'mdi-arrow-left-drop-circle-outline',
        }">
        <template v-slot:top>
          <v-toolbar flat
            :color="$store.state.temas.forms_titulo_bg"
            :dark="$store.state.temas.forms_titulo_dark==true">
            <v-btn icon @click="closeForm"
              :color="$store.state.temas.forms_close_bg"
              :dark="$store.state.temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <template v-slot:extension>

              <template>
                <v-btn
                  :color="
                  cual==1?
                  $store.state.temas.forms_btn_xls_bg:
                  $store.state.temas.forms_btn_add_bg"
                  :dark="$store.state.temas.forms_btn_add_dark==true"
                  class="text-capitalize fg78 mr-2"
                  @click="cualesver(1)">
                  Disponibles
                </v-btn>
              </template>

              <template>
                <v-btn
                  :color="
                  cual==2?
                  $store.state.temas.forms_btn_xls_bg:
                  $store.state.temas.forms_btn_add_bg"
                  :dark="$store.state.temas.forms_btn_add_dark==true"
                  class="text-capitalize fg78 mr-2"
                  @click="cualesver(2)">
                  Entregados
                </v-btn>
              </template>

              <template>
                <v-btn
                  :color="
                  cual==3?
                  $store.state.temas.forms_btn_xls_bg:
                  $store.state.temas.forms_btn_add_bg"
                  :dark="$store.state.temas.forms_btn_add_dark==true"
                  class="text-capitalize fg78 mr-2"
                  @click="cualesver(3)">
                  Rechazados
                </v-btn>
              </template>

              <template>
                <v-btn
                  :color="
                  cual==4?
                  $store.state.temas.forms_btn_xls_bg:
                  $store.state.temas.forms_btn_add_bg"
                  :dark="$store.state.temas.forms_btn_add_dark==true"
                  class="text-capitalize fg78 mr-2"
                  @click="cualesver(4)">
                  Vendidos
                </v-btn>
              </template>

              <template>
                <v-btn
                  :color="$store.state.temas.forms_btn_activo_bg"
                  :dark="$store.state.temas.forms_btn_activo_dark==true"
                  class="text-capitalize fg78 mr-2"
                  @click="cambiarValores">
                  Cambiar Cheques
                </v-btn>
              </template>
            </template>

            <v-toolbar-title class="fg">
              {{'Cheques '+cuales+': $'+formatoImporte(total,2)}}
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->

            <!--
              CAMBIO DE CHEQUES
            -->
            <v-dialog v-model="dialogCambio" max-width="1100px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="$store.state.temas.forms_titulo_bg"
                :dark="$store.state.temas.forms_titulo_dark==true">
                <v-btn
                  :color="$store.state.temas.forms_close_bg"
                  :dark="$store.state.temas.forms_close_dark==true"
                  icon @click="cancelar()">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="fg">Cambio de Cheques</span>
                <v-spacer></v-spacer>
                <v-btn class="fg85"
                  v-show="totCheTerSel!=0 && totEfeRecibido!=0 && tercero_id!=0"
                  :color="$store.state.temas.cen_btns_bg"
                  :dark="$store.state.temas.cen_btns_dark==true"
                  @click="guardarCambio(item)">
                  Confirmar
                </v-btn>
              </v-toolbar>
              <v-card>
                <v-form ref="pend">
                  <v-card-text>
                    <v-container fluid>
                      <!-- GRILLA DE CHEQUES DE TERCERO -->
                      <v-row class="fg">
                        <v-col cols="2" class="pt-6 pl-6">
                          <v-btn class="fg"
                            :color="$store.state.temas.cen_btns_bg"
                            :dark="$store.state.temas.cen_btns_dark==true"
                            @click="marcarDesmarcar(1)">
                            Marcar Todos
                          </v-btn>
                        </v-col>
                        <v-col cols="2" class="pt-6 pl-6">
                          <v-btn class="fg"
                            :color="$store.state.temas.cen_btns_bg"
                            :dark="$store.state.temas.cen_btns_dark==true"
                            @click="marcarDesmarcar(2)">
                            Desmarcar Todos
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row class="fg">
                        <v-col cols="12" md="12">
                          <v-data-table
                            v-model="selectedCheque"
                            :headers="headersSel"
                            :items="cartera"
                            dense
                            class="elevation-3"
                            item-key="id"
                            :footer-props="{
                              itemsPerPageOptions: [8],
                              showFirstLastPage: true,
                              showCurrentPage: true,
                              nextIcon: 'mdi-arrow-right-drop-circle-outline',
                              prevIcon: 'mdi-arrow-left-drop-circle-outline',
                            }">
                            <template v-slot:item.importe="{ item }">
                              <span>${{ formatoImporte(item.importe) }}</span>
                            </template>
                            <template v-slot:item.seleccionado="{ item }">
                              <v-chip
                                :color="getColor(item.seleccionado)"
                                dark>{{item.seleccionado?'Sí':'No'}}
                              </v-chip>
                            </template>

                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="item.seleccionado==0?
                                    $store.state.temas.cen_btns_bg:
                                    $store.state.temas.cen_card_activo_bg"
                                    :dark="$store.state.temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="selectCartera(item)" v-on="on">
                                    <v-icon>mdi-checkbox-marked-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Seleccionar</span>
                              </v-tooltip>
                            </template>

                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- PIDO PROVEEDOR1 -->
                      <v-row class="fg">
                        <v-col cols="12" md="6" class="pt-0">
                          <v-autocomplete
                            v-model="tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTerceros"
                            :search-input.sync="searchTerceros"
                            :color="temas.forms_titulo_bg"
                            item-text="nombre"
                            item-value="id"
                            autofocus
                            label="Comprador"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="totCheTerSel"
                            label="Cheques seleccionados">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-text-field
                            dense outlined
                            v-model="porcentaje"
                            label="% Comisión"
                            @change="calculos(1)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-text-field
                            dense outlined
                            v-model="totEfeRecibido"
                            label="Efectivo a Recibir"
                            @change="calculos(2)">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- GRILLA DE CHEQUES DE TERCERO -->
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEL CAMBIO DE CHEQUES -->

            <!--RECHAZO DE CHEQUES -->
            <v-dialog v-model="dialogRechazo" max-width="600px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="$store.state.temas.forms_titulo_bg"
                :dark="$store.state.temas.forms_titulo_dark==true">
                <v-btn
                  :color="$store.state.temas.forms_close_bg"
                  :dark="$store.state.temas.forms_close_dark==true"
                  icon @click="cerrarDevolucion">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="fg text--right">
                  Rechazar Cheque
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  :color="$store.state.temas.barra_principal_bg"
                  :dark="$store.state.temas.barra_principal_dark"
                  @click="guardarRechazo()">
                  Confirmar
                </v-btn>
              </v-toolbar>
              <v-card class="fg">
                <v-form ref="pend">
                  <v-card-text>
                    <v-container>
                      <!-- DATOS DE LA FACTURA POR RECHAZO -->
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-text-field
                            disabled dense outlined
                            v-model="gasto.librador"
                            label="Entrego">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12" class="pt-0">
                          <v-select
                            v-model="gasto.motivo"
                            :items="motivos"
                            outlined
                            dense
                            autofocus
                            item-value="id" item-text="nombre"
                            :color="temas.forms_titulo_bg"
                            label="Motivo"
                            return-object>
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row class="fg">
                        <v-col cols="12">
                          <span>Se emitirá un Comprobante a
                            <b>{{itemActual!=null ? itemActual.origen : ''}}</b>
                            por el total del cheque (${{formatoImporte(itemActual!=null?
                            itemActual.importe : 0)}}) y otro por los gastos que indiques abajo.
                            <br>
                          </span>
                          <span>
                            Además se restaurará la deuda cancelada por el mismo.
                          </span><br><br>
                          <span><b>Gastos del Cheque</b></span>
                          <br>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="3" sx="3" mx="3" class="pt-0">
                          <v-text-field
                            disabled dense outlined
                            v-model="gasto.articulo_id"
                            label="Codigo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="9" sx="9" mx="9" class="pt-0">
                          <v-text-field
                            disabled dense outlined
                            v-model="gasto.nombre"
                            label="Nombre">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="gasto.gravado"
                            label="Gravado"
                            @change="calculoGasto(1)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                        </v-col>
                        <v-col cols="4" sm="4" md="4" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="gasto.tasaiva"
                            label="%IVA"
                            @change="calculoGasto(2)">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="gasto.iva"
                            label="Importe de IVA"
                            @change="calculoGasto(3)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="gasto.total"
                            label="Total"
                            @change="calculoGasto(4)">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- GRILLA DE CHEQUES DE TERCERO -->

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEVOLUCION DE CHEQUES -->

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
        <template v-slot:item.tasadescuento="{ item }">
          {{ formatoImporte(item.tasadescuento) }}%
        </template>
        <template v-slot:item.banco="{ item }">
          {{ item.banco }}
        </template>
        <template v-slot:item.echeq="{ item }">
          {{ item.echeq?'sí':'no' }}
        </template>
        <template v-slot:item.origen="{ item }">
          {{ item.origen==null?'Propio':item.origen }}
        </template>
        <template v-slot:item.entrego="{ item }">
          {{ item.entrego }}
        </template>
        <template v-slot:item.importe="{ item }">
          $ {{ formatoImporte(item.importe,2) }}
          <v-badge v-if="item.arechazar"
            content="z"
            :dark="true"
            icon="mdi-gift"
            :color="$store.state.temas.cen_card_activo_bg">
          </v-badge>
        </template>

        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
              class="mr-0" fab icon x-small
                :color="$store.state.temas.forms_btn_editar_bg"
                :dark="$store.state.temas.forms_btn_editar_dark==true"
                @click="rechazar(item)" v-on="on">
                <v-icon>mdi-18px mdi-subdirectory-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Rechazar</span>
          </v-tooltip>
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
import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import moment from 'moment';
import SBar from './../Forms/snackbar.vue';
import Confirmacion from "./../Forms/confirmacion.vue"
import 'jspdf-autotable'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    cual: 1,
    total: 0,
    itemActual: null,
    acciones: [],
    selectedCheque:[],
    totCheTerSel: 0,
    porcentaje: 0,
    totEfeRecibido: 0,
    cartera: [],
    vendidos: [],
    descriptionLimit: 80,
    tercero_id: 0,
    gasto: {
      articulo_id: 8,
      librador: '',
      nombre: 'GASTOS POR CHEQUE RECHAZADO',
      motivo: 1,
      gravado: 0,
      tasaiva: 21,
      iva: 0,
      total: 0
    },
    cfUser: '',
    entriesTerceros: [],
    tercerosUserId: [],
    isLoadingTerceros: false,
    searchTerceros: '',    // para el cuadro de búsqueda de datatables

    editado: {
      id: '',
      cpr: '',
      fecha: moment().format('YYYY-MM-DD'),
      vencimiento: moment().format('YYYY-MM-DD'),
      perfiscal: '',
      tercero_id: '',
      comprobante_id: '',
      deposito_id: '',
      regstk: 0,
      medio_id: '',
      moneda_id: 51,
      direccion_id: '',
      documento_id: '',
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      tasadescuento: 0,
      importedescuento: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      retib: 0,
      retgan: 0,
      retiva: 0,
      total: 0,
    },
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    motivos: [
      {id: 1, nombre: 'SIN FONDOS'},
      {id: 2, nombre: 'MALA CONFECCION'},
      {id: 3, nombre: 'FUERA DE FECHA'},
    ],
    headersRes: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 120 },
      { text: 'Total', value:'total', align: 'right', width: 120 }
    ],
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogCambio: false, 
    dialogRechazo: false, 
    // definimos los headers de la datatables
    items: [],
    cuales: 'Disponibles',
    headers: [
      { text: 'Librador', value:'librador', width: 250},
      { text: 'Banco', value:'banco', width: 250},
      { text: 'Comprobante', value:'cpr', width: 176},
//    { text: 'Cuenta', value:'cuenta', width: 150},
      { text: 'Número', value:'nrovalor', width: 100},
      { text: 'Fec.Finan', value:'fechafinanciera', width: 110},
      { text: 'Dias', value:'dias', width: 80},
      { text: 'Importe', value:'importe', width: 130, align: 'end'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersSel: [
      { text: 'Librador', value:'librador', width: 250},
      { text: 'Banco', value:'banco', width: 250},
      { text: 'Cuenta', value:'cuenta', width: 140},
      { text: 'Número', value:'nrovalor', width: 100},
      { text: 'Fec.Finan', value:'fechafinanciera', width: 96},
      { text: 'Importe', value:'importe', width: 100, align: 'end'},
      { text: 'Sel', value: 'accion', sortable: false, width: 70 }
    ],
    editedIndex: -1,
    editado: {
      id: '',
      nombre: '',
      activo: true,
    },
    defaultItem: {
      id: '',
      nombre: '',
      activo: true,
    },
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'sucursal', 'sucursalFiscal', 'sucursalDemo', 'empresa', 'tema', 'temas', 'operarioEsVendedor',
      'operarioTerceroId', 'operarioUserId', 'caja','transition']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo' : 'Editar';
    },

    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
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
    '$route.path': function(val, oldVal){
      this.init_component();
    },
   '$store.state.sucursal' () {
      this.init_component()
    },

    searchTerceros (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      // Lazily load input items
      return HTTP().get('/indexter/false/2/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/null')
        .then(({ data }) => {
        this.entriesTerceros = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTerceros.push(data[i].tercero)
//        this.tercerosUserId.push(data[i].id)
          this.tercerosUserId.push(data[i].tercero_id)
        }
        if (val !== null && val !== '') {
          let ipos = 0
          for (let i=0; i<=this.entriesTerceros.length-1; i++) {
            if (this.tercero_id === this.entriesTerceros[i].id) {
              ipos = i
              break
            }
          }
          let valor = this.tercerosUserId[ipos]
          return HTTP().get('/tercero/'+valor+'/2/false/'+this.sucursal).then(({ data }) => {
            this.itemActual = data.t
            this.lisObj = [];
            this.editado.comprobante_id = 128
            this.editado.documento        = data.t[0].tercero.documento.nombre;
            this.editado.documento_id     = data.t[0].tercero.documento.id;
            this.editado.documentoNumero  = data.t[0].tercero.cuit;
            this.editado.responsableAbrev = data.t[0].tercero.responsable.abrev;
            this.dirItems                 = []
            for (let i=0; i<= data.t[0].tercero.direcciones.length-1; i++) {
              this.dirItems.push(data.t[0].tercero.direcciones[i])
            }
            this.editado.direccion_id = this.dirItems[0].id
            this.editado.medio_id = 1
            this.editado.sucursal_id = this.sucursal
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTerceros = false))
    },
  },

  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
  },

  created () {
    this.init_component()
  },
  
  methods: {
    closeForm(){
      router.push('/')
    },

    init_component() {
      this.cualesver(1)
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='cambiar cheques') {
          this.altaHTTP()
        } else if (this.msg.msgAccion=='rechazar cheque') {
          this.rechazarHTTP()
        }
      }
      this.msg.msgVisible = false;
    },

    cualesver(cual) {
      this.cual = cual  // 1 disponibles, 2 entregados, 
      this.headers = []
      if (cual==1) {
        this.headers.push({ text: 'Origen', value:'origen', width: 250})
        this.headers.push({ text: 'Banco', value:'banco', width: 250})
        this.headers.push({ text: 'eCheq', value:'echeq', width: 90})
      } else if (cual==2 || cual==3) {
        this.headers.push({ text: 'Origen', value:'origen', width: 290})
        this.headers.push({ text: 'Entregado a', value:'entrego', width: 290})
        this.headers.push({ text: 'Banco', value:'banco', width: 200})
      } else if (cual==4) {
        this.headers.push({ text: 'Fecha', value:'fecha', width: 96})
        this.headers.push({ text: 'Comprobante', value:'cpr', width: 150})
        this.headers.push({ text: 'Comprador', value:'tercero.nombre', width: 300})
        this.headers.push({ text: '%Desc', value:'tasadescuento', width: 80})
        this.headers.push({ text: 'Importe Desc.', value:'importedescuento', width: 130, align: 'end'})
        this.headers.push({ text: 'Total', value:'total', width: 130, align: 'end'})
      }
      if (cual==1 || cual==2 || cual==3) {
        this.headers.push({ text: 'Comprobante', value:'cpr', width: 176})
        this.headers.push({ text: 'Número', value:'nrovalor', width: 100})
        this.headers.push({ text: 'Fec.Fin', value:'fechafinanciera', width: 96})
        this.headers.push({ text: 'Dias', value:'dias', width: 80})
        this.headers.push({ text: 'Importe', value:'importe', width: 130, align: 'end'})
      }
      if (cual==2||cual==1) {
        this.headers.push({ text: 'ACC', value: 'accion', sortable: false })
      }
      this.listarHTTP(cual)
    },

    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      if (item.tipo!="Z") {
        this.acciones.push({nombre: 'Rechazar', icon: 'mdi-subdirectory-arrow-left'})
      }
    },

    async rechazar(item) {
      if (item.nombre=='Rechazar') {
        if (this.itemActual.userid!=null) {
          this.msg.msgTitle = 'No se puede rechazar este cheque!' 
          this.msg.msgAccion = 'rechazar cheque'
          let msg = 'Este cheque ingreso por una operación vinculada.<br><br>'
          msg += 'Debera informar a '+this.itemActual.entrego+' que realice el rechazo '
          msg += 'o esperar a que ellos lo hagan.<br>'
          msg += 'Cuando el mismo sea realizado le llegara una factura con los gastos correspondientes mas '
          msg += 'el importe del cheque'
          this.msg.msgBody = msg
          this.msg.msgVisible = true
          this.msg.msgButtons = ['Cerrar']
        } else {
          this.rechazar(this.itemActual)
        }
      }
    },

    cerrarCambio(item) {
      this.dialogCambio = false
    },

    cerrarDevolucion(item) {
      this.dialogRechazo = false
    },

    rechazar(item) {
      this.gasto.articulo_id = 8
      this.gasto.librador = item.origen // item.librador
      this.gasto.nombre = 'GASTOS POR CHEQUE RECHAZADO'
      this.gasto.motivo = 1
      this.gasto.gravado = 0
      this.gasto.tasaiva = 21
      this.gasto.iva = 0
      this.gasto.total = 0 
      this.itemActual = item
      this.dialogRechazo = true
    },

    guardarRechazo() {
      this.msg.msgTitle = 'Rechazo de Cheque' 
      this.msg.msgAccion = 'rechazar cheque'
      this.msg.msgBody = '¿Confirmas rechazar este Cheque?'
      this.msg.msgVisible = true
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    altaHTTP() {
      /* 
        Aca el registro es parecido a un pago salvo que no va en cta.cte.. 
        Solo se transfieren cheques y se recibe efectivo.
        Si el tercero esta vinculado tengo que realizar la notificacion correspondiente. 
      */
      return HTTP().post('/ventadecheques', {
        caja:                this.caja,
        fecha:               moment().format('YYYY-MM-DD'),
        perfiscal:           moment().format('YYYY-MM'),
        tipo:                'VE',
        cpr:                 'CIN-X '+this.sucursalFiscal+'-00000000',
        user_id:             this.userId,
        sucursal_id:         this.sucursal,
        tercero_id:          this.tercero_id,
        comprobante_id:      128,
        direccion_id:        this.editado.direccion_id,
        documento_id:        this.editado.documento_id,
        mediodepago_id:      1,
        deposito_id:         null,
        vendedor_id:         null,
        moneda_id:           51,
        tasadescuento:       this.porcentaje,
        importedescuento:    this.roundTo(this.totCheTerSel-this.totEfeRecibido,2),
        retiva:              0,
        retgan:              0,
        retib:               0,
        gravado:             0,
        exento:              0,
        iva:                 0,
        total:               this.totEfeRecibido,
        regstk:              0,
        estado:              'F',
        activo:              true,
        observaciones:       'VENTA DE CHEQUES',
        valores:             this.cartera,
        pendientes:          [],
        notificacion:        0,
        notificaEnBaseAOtro: 0,
        notificaOriginal:    0,
        gasto:               0,
      }).then(({ data }) => {
        this.dialogCambio = false
        this.totCheTerSel = 0
        this.totEfeRecibido = 0
        this.porcentaje = 0
        this.marcarDesmarcar(2)
        this.listarHTTP(this.cual);
      });
    },

    rechazarHTTP:function() {
      /* 
        Aca el registro es parecido a un pago salvo que no va en cta.cte.. 
        Solo se transfieren cheques y se recibe efectivo.
        Si el tercero esta vinculado tengo que realizar la notificacion correspondiente. 
      */
      let electronica = !this.sucursalDemo
      return HTTP().post('/rechazarcheque', { valor_id: this.itemActual.id, gasto: this.gasto, electronica: electronica, sucursalDemo: this.sucursalDemo })
        .then(({ data }) => {
          this.dialogRechazo = false
          this.listarHTTP(this.cual);
        });
    },
    
    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    marcarDesmarcar(accion) {
      this.totCheTerSel = 0
      for (let i=0; i<=this.cartera.length-1; i++) {
        if (accion==1) {  // MARCAR TODOS
          this.cartera[i].seleccionado=1
          this.totCheTerSel += this.cartera[i].importe
        } else {          // DESMARCAR TODOS
          this.cartera[i].seleccionado=0
        }
      }
      this.totCheTerSel = this.roundTo(this.totCheTerSel,2)
      this.calculos(1)
    },

    selectCartera(item) {
      let pos = this.cartera.indexOf(item)
      this.totCheTerSel = 0
      if (pos>=0) {
        this.cartera[pos].seleccionado = this.cartera[pos].seleccionado == 1 ? 0 : 1
      }
      for (let i=0; i<=this.cartera.length-1; i++) {
        if (this.cartera[i].seleccionado==1) {
          this.totCheTerSel += this.cartera[i].importe
        }
      }
      this.totCheTerSel = this.roundTo(this.totCheTerSel,2)
      this.calculos(1)
    },

    listarHTTP(cual) {
      this.cuales = 'Disponibles'
      if (cual==2) {
        this.cuales = 'Entregados'
      } else if (cual==3) {
        this.cuales = 'Rechazados'
      } else if (cual==4) {
        this.cuales = 'Vendidos'
      }
      return HTTP().post('/cheques', { sucursal: this.sucursal, cuales: this.cuales}).then(({ data }) => {
        let d = 0
        let hoy = moment()
        this.items = data;
        this.cartera = [];
        this.vendidos = [];
        this.total = 0
        for (let i=0; i<=this.items.length-1; i++) {
          this.items[i].cpr = this.kit.cpr(this.items[i].cpr)
          if (this.cuales=='Vendidos') {
            this.total += this.items[i].importe
            this.vendidos.push({
              id:      this.items[i].id,
              fecha:   this.items[i].fecha,
              cpr:     this.kit.cpr(this.items[i].cpr),
              tercero: this.items[i].tercero.nombre.substring(0,20),
              echeq:   this.items[i].echeq,
              total:   this.items[i].total,
              cheques: this.items[i].valoresEgresos,
            })
          } else {
            d = hoy.diff(this.items[i].fechafinanciera, 'days')
            let dd = moment(this.items[i].fechafinanciera).diff(hoy, 'days')
            d = dd

            this.items[i].fechafinanciera = moment(this.items[i].fechafinanciera).format('DD/MM/YY')
            this.items[i].dias =  d
            this.total += this.items[i].importe
            this.cartera.push({
              id:              this.items[i].id,
              abrev:           this.items[i].abrev,
              banco:           this.items[i].banco,
              banco_id:        this.items[i].banco_id,
              caja_id:         this.items[i].caja_id,
              cpringreso_id:   this.items[i].cpringreso_id,
              cuenta:          this.items[i].cuenta,
              cuentaorigen_id: this.items[i].cuentaorigen_id,
              fechafinanciera: this.items[i].fechafinanciera,
              id:              this.items[i].id,
              importe:         this.items[i].importe,
              librador:        this.items[i].librador,
              nrovalor:        this.items[i].nrovalor,
              seleccionado:    0,
              user:            this.items[i].userid,
              propio:          this.items[i].propio,
              aRechazar:       this.items[i].arechazar,
            })
          }
          this.searchTerceros = '';
          this.isLoadingTerceros = false;
        }
      });
    },

    guardarCambio(item) {
      this.msg.msgTitle = 'Cambio de Cheques' 
      this.msg.msgAccion = 'cambiar cheques'
      this.msg.msgBody = 'Confirma el Cambio de Cheques?'
      this.msg.msgVisible = true
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },

    cambiarValores() {
      this.dialogCambio = true
      this.listarHTTP(1)
    },

    rechazarValores() {
      this.dialogRechazo = true
      this.listarHTTP(1)
    },

    cancelar() {
      this.dialogCambio = false;
    },

    calculos(cual) {
      if (cual==1) {
        this.totEfeRecibido = this.roundTo(this.totCheTerSel-(this.totCheTerSel*(this.porcentaje/100)),2)
      } else if (cual == 2) {
        this.porcentaje = this.roundTo(100-((this.totEfeRecibido*100)/this.totCheTerSel),2)
      }
    },

    calculoGasto(cual) {
      this.gasto.gravado = Number(this.gasto.gravado)
      this.gasto.tasaiva = Number(this.gasto.tasaiva)
      this.gasto.iva     = Number(this.gasto.iva)
      this.gasto.total   = Number(this.gasto.total)
      if (cual==1 && this.gasto.tasaiva!=0) {
        this.gasto.iva = this.roundTo(this.gasto.gravado*(this.gasto.tasaiva/100),2)
        this.gasto.total = this.roundTo(this.gasto.gravado+this.gasto.iva,2)
      } else if (cual == 2) {
        //this.gasto.gravado = this.roundTo(this.gasto.total/(1+(this.gasto.tasaiva/100)),2)
        this.gasto.iva = this.roundTo(this.gasto.gravado*(this.gasto.tasaiva/100),2)
        this.gasto.total = this.roundTo(this.gasto.gravado+this.gasto.iva,2)
      } else if (cual == 3) {
        this.gasto.tasaiva = this.roundTo((this.gasto.iva/this.gasto.gravado)*100,2)
        this.gasto.total = this.roundTo(this.gasto.gravado*(1+(this.gasto.tasaiva/100)),2)
      } else if (cual == 4) {
        this.gasto.gravado = this.roundTo(this.gasto.total/(1+(this.gasto.tasaiva/100)),2)
        this.gasto.iva = this.roundTo(this.gasto.total-this.gasto.gravado,2)
      }
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoFecha(value) {
      return moment(String(value)).format('L')
    },

    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
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
  .fg78 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 78%;
  }
  // 1502
</style> 