<template>
  <v-layout align-start class="ma-0">
    <v-flex>
      <v-row class="pb-3">
        <v-col v-for="(cbt, idx) in comprobantes" v-bind:key="idx">
          <v-card tile outlined @click="selectTipoDeComprobante(cbt.nombre)" max-width="180">
            <v-app-bar outlined
              :color="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title class="fg">
                {{ cbt!=null ? cbt.nombre : '' }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-container>
              <v-row dense>
                <v-col cols="12" class="fg75">
                  $ {{ formatoImporte(cbt.total) }} ({{ cbt.ctt }})
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-3 fg"
        :footer-props="{
          itemsPerPageOptions: [8],
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

            <v-toolbar-title
              :color="temas.forms_titulo_bg"
              :dark="temas.forms_titulo_dark==true"
              class="fg" v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                <v-icon left>
                  mdi-airplane-takeoff
                </v-icon>
                <b class="fg">LICENCIAS</b>
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="anio in anios"
                :key="anio.id" dense :value="anio.id" label
                :color="anio==elAnio ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="anio==elAnio ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1 meses"
                @click="setAnio(anio)">
                {{ anio.substr(2,2) }}
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="mes in meses"
                :key="mes.id" dense :value="mes.id" label
                :color="mes==elMes ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="mes==elMes ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1 fg"
                @click="setMes(mes)">
                {{ mes }}
              </v-chip>
              <v-progress-circular v-if="progress==true"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>
            </v-toolbar-title>
          </v-toolbar>

          <!-- BARRA DE BUSQUEDA -->
          <v-row class="pt-3 pl-3">
            <v-col cols="5" sm="5">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar"
                :color="temas.forms_titulo_bg"
                class="pt-0"
                single-line hide-details>
              </v-text-field>
            </v-col>
            <v-col cols="7" sm="7" class="pt-4 pb-5 fg">
              <span v-for="(fe, idx) in filtrosEstados" v-bind:key="idx">
                <v-badge
                  class="pt-1 pl-2 pr-1"
                  overlap
                  :content="fe.ctt"
                  :color=
                  "fe.tip==filtroEstadoSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                  :dark=
                  "fe.tip==filtroEstadoSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
                  rigth>
                  <v-chip
                    dense :value="fe" label
                    :color=
                    "fe.tip==filtroEstadoSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                    :dark=
                    "fe.tip==filtroEstadoSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
                    class="ml-2"
                    @click="setFiltroEstado(fe)">
                    <b>{{ fe.tip }}</b>
                  </v-chip>
                </v-badge>
              </span>
            </v-col>
          </v-row>
        </template>
        <template #item.username.razon_social="{ value }">
          <div class="text-truncate" style="max-width: 150px">
            {{ value }}
          </div>
        </template>
        <template v-slot:item.user.username="{ item }">
          <span class="fg90">{{ item.user.username }}</span>
        </template>
        <template v-slot:item.user.diadefacturacion="{ item }">
          <span class="fg90">{{ item.user.diadefacturacion }}</span>
        </template>
        <template v-slot:item.tipo="{ item }">
          <span class="fg90">{{ item.tipo }}</span>
        </template>
        <template v-slot:item.user.externo="{ item }">
          <span class="fg90">{{ item.user.externo?'externo':'gohu' }}</span>
        </template>
        <template v-slot:item.mix_ctt="{ item }">
          <span class="fg90">{{ item.mix_ctt }}</span>
        </template>
        <template v-slot:item.mig_ctt="{ item }">
          <span class="fg90">{{ item.mig_ctt }}</span>
        </template>
        <template v-slot:item.mdx_ctt="{ item }">
          <span class="fg90">{{ item.mdx_ctt }}</span>
        </template>
        <template v-slot:item.mdg_ctt="{ item }">
          <span class="fg90">{{ item.mdg_ctt }}</span>
        </template>
        <template v-slot:item.importe="{ item }">
          <span class="fg90">
            $ {{ formatoImporte(roundTo(item.importe*1.21,0)) }}
          </span>
        </template>
        <template v-slot:item.tot_com="{ item }">
          <span class="fg90">
            $ {{ formatoImporte(roundTo(item.tot_com*1.21,0)) }}
          </span>
        </template>
        <template v-slot:item.total="{ item }">
          <span class="fg90">
            $ {{ formatoImporte(roundTo(item.total*1.21,0)) }}
          </span>
        </template>
        <template v-slot:item.estado="{ item }">
          <span class="fg90">{{ item.estado }}</span>
        </template>
<!--
        <template v-slot:item.estado="{ item }">
          <v-chip
            label
            class="mini-font"
            @mouseover="sayMessage(item, true)"
            @mouseleave="sayMessage(item, false)"
            :color="getEstado(item.estado,'c', item.comprobante )">
            <b>{{ getEstado(item.estado,'e', item.comprobante) }}</b>
          </v-chip>
        </template>
-->
        <template v-slot:item.estado="{ item }">
          <v-chip
            label
            class="fg85"
            :color="getEstado(item.estado,'c', item.comprobante )"
            :dark="getEstado(item.estado,'k', item.comprobante )">
            <b>{{ getEstado(item.estado,'e', item.comprobante) }}</b>
          </v-chip>
        </template>
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"
                @click="setAcciones(item)">
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
          <!-- FIN DE LA BARRA DE BUSQUEDA -->

      </v-data-table>

      <!--FACTURAR-->
      <v-dialog v-model="dialog" max-width="350px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{}"></template>

        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="dialog=false"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">
            Facturar
          </span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.barra_principal_bg"
            :dark="temas.barra_principal_dark"
            class="ma-2 white--text"
            @click="altaHTTP()">
            Confirmar
          </v-btn>
        </v-toolbar>

        <v-card>
          <v-form>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" class="pt-0 pd-0">
                    <span class="fg">
                      Per.Fiscal<br><b>{{ editado.perfiscal }}</b>
                    </span>
                  </v-col>
                  <v-col cols="12" sm="6" class="pt-0 pd-0">
                    <span class="fg">
                      Cuota<br><b>${{ formatoImporte(editado.cuota) }}</b>
                    </span>
                  </v-col>
                  <v-col cols="12" sm="6" class="pt-0 pd-0">
                    <span class="fg">
                      Imp.Desc.<br><b>${{ formatoImporte(editado.importedescuento) }}</b>
                    </span>
                  </v-col>
                  <v-col cols="12" sm="6" class="pt-0 pd-0">
                    <span class="fg">
                      Gravado<br><b>${{ formatoImporte(editado.gravado) }}</b>
                    </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" class="pt-0 pd-0">
                    <span class="fg">
                      IVA<br><b>${{ formatoImporte(editado.iva) }}</b>
                    </span>
                  </v-col>
                  <v-col cols="12" sm="6" class="pt-0 pd-0">
                    <span class="fg">
                      TOTAL<br><b>${{ formatoImporte(editado.total) }}</b>
                    </span>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>

      </v-dialog>
      <!-- FIN DE FACTURAR -->

      <impresiones ref="impresion"></impresiones>
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
import Confirmacion from "./Forms/confirmacion.vue";
import impresiones from "./Forms/impresiones.vue";

export default {
  components: {
    SBar,
    Confirmacion,
    impresiones,
  },
  data: () => ({
    electronica: false,
    items: [],
    itemsAll: [],
    ivas: [],
    asociado: [],
    progress: false,
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    periodos: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    cpr: '',                 // Pedido 
    basadoEnCpr: false,      // si el comprobante actual esta basado en otro comprobante. ( fac/ped, rem/fac, etc)
    notificaEnBaseAOtro: [], // arreglo para realizar la notificacion de comprobantes.
    notificaOriginal: [],    // cuando es notificaEnBaseAOtro, debo marcar el comprobante padre.
    basadoEnOtroCpr: [],     // arreglo para grabar la en que comprobante esta basado el actual
    recargo: 0,              // % de recargo para cuando se selecciona un cobro con recargo, no aplica a cobranzas

    comprobantes: [
      { nombre: 'Usuarios CO', total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Usuarios ME', total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Usuarios BA', total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Usuarios PP', total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Totales CO',  total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Totales ME',  total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Totales BA',  total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Totales PP',  total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Total',       total: 0, ctt: 0, bg: '', dark: '', activo: true },
    ],

    // filtro
    filtroComprobante: [1,6,14],
    filtroComprobanteSel: 'CO',
    coef: 1,  // para signar los comprobantes + o -
    modelo: 'licencias',
    ctacte: false,
    diasvenc: 0,
    formTitle: '',
    itemActual: {cpr:'', tercero: {nombre: ''}},
    tl: "text-lowercase",
    medios: [],
    dirItems: [],
    articulos: [],
    acciones: [],
    depItems: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    //footerProps: {'items-per-page-options': [5, 5, 15, 100]},
    footerProps: {'items-per-page-options': [6] },
    search: '',               // para el cuadro de búsqueda de datatables
    dialog: false,            // para que la ventana de dialogo o modal no aparezca automáticamente

    // definimos los headers de la datatables
    headers: [
      { text:'USUARIO', value:'user.username', align:'left', width: 160},
      { text:'DF', value:'user.diadefacturacion', align:'left', width: 100},
      { text:'Clase', value:'tipo', align:'left', width: 100},
      { text:'CO', value:'co_ctt', align:'end', width: 100},
      { text:'ME', value:'me_ctt', align:'end', width: 100},
      { text:'BA', value:'ba_ctt', align:'end', width: 100},
      { text:'PP', value:'pp_ctt', align:'end', width: 100},
      { text:'CUOTA', value:'importe', align:'end', width: 150},
      { text:'DESC', value:'tot_com', align:'end', width: 150},
      { text:'TOTAL', value:'total', align:'end', width: 150},
      { text:'ESTADO', value:'estado', align:'left', width: 150},
      { text:'ACCION', value:'accion', sortable: false},
    ],
    editedIndex: -1,
    editado: {
      id: '',
      cpr: '',
      fecha: '',
      perfiscal: '',
      tercero_id: '',
      nombre: '',
      comprobante_id: '',
      documento_id: '',
      documentoCodigo: '',
      mediodepago_id: '',
      deposito_id: '',
      vendedor: {id: null, nombre: 'MOSTRADOR'},
      moneda_id: 51,
      direccion_id: '',
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      cuota: 0,
      tasadescuento: 0,
      importedescuento: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      total: 0,
      rentabilidad: 0,
      texto: '',
      estado: '',
      observaciones: '',
    },
    descriptionLimit: 80,
    entriesTerceros: [],
    filtrosEstados: [],
    filtroEstadoSel: 'Todos',
  }),


  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState(['dolar','sucursal','sucursales','sucursalDemo','sucursalFiscal','tema','temas','centrales',
      'notificaciones','caja','vinculosPadres','vinculosHijos','empresa','datosEmpresa','responsable','cuit','level','transition',]),
  },

  search(val) {
    this.listarHTTP(false)
  },

  mounted () {
    this.$store.commit('closeAlert')
    moment.locale('es');
    return HTTP().post('/generolic', {dolar: this.dolar}).then(({ data }) => {
      this.anio = moment().format('YYYY')
      this.leoAnios()
        .then((data) => {
          if (!this.isLoggedIn) {
            return router.push('/login');
          } else {
            this.comprobantes[0].activo = true
            this.comprobantes[1].activo = true
            this.comprobantes[2].activo = true
            this.comprobantes[3].activo = true
            this.comprobantes[4].activo = true
            this.comprobantes[5].activo = true
            this.comprobantes[6].activo = true
            this.comprobantes[7].activo = true
            this.comprobantes[8].activo = true
            this.anio = moment().format('YYYY')
//          this.centrales.ventas_panel = 'MI Externos'
            this.selectTipoDeComprobante('CO')
//          this.search = this.centrales.ventas_buscar
          }
        })
    })
  },

  created () {
    for (let i=0; i<=8; i++) {
      this.comprobantes[i].bg    = this.$store.state.temas.cen_panelcpr_bg
      this.comprobantes[i].dark  = this.$store.state.temas.cen_panelcpr_dark
    }
    return HTTP().get('/tarjetascobros').then(({ data }) => {
      this.medios = []
      for (let i=0; i<=data.length-1; i++) {
        this.medios.push(data[i])
      }
      return HTTP().get('/bancos').then(({ data }) => {
        this.banItems = []
        for (let i=0; i<=data.length-1; i++) {
          this.banItems.push(data[i])
        }
        return HTTP().get('/afipiva').then(({ data }) => {
          this.ivaTasas = []
          for (let i=0; i<=data.length-1; i++) {
            this.ivaTasas.push(data[i])
          }
          return HTTP().get('/afipmonedas').then(({ data }) => {
            this.monItems = data
            // BUSCO LOS DEPOSITOS HABILITADOS EN LA SUCURSAL
            return HTTP().get('/user/'+this.userId).then(({ data }) => {
              let psuc = data[0].sucursales.map(function(e) { return e.id; }).indexOf(this.sucursal);
              for (let i=0; i<= data[0].sucursales[psuc].depositos.length-1; i++) {
                this.depItems.push(data[0].sucursales[psuc].depositos[i])
              }
              // BUSCA A LOS MOROSOS PARA NOTIFICAR
              return HTTP().get('/morosos/'+this.userId).then(({ data }) => {
              })
            })
          })
        })
      })
    })
  },

  methods: {
    ...mapMutations([
      'alert',
      'closeAlert',
      'setSucursal',
      'setSucursales',
      'setCentrales',
      'setTema',
      'setTemas',
      'setNotificaciones',
      'setCaja',
      'setVinculasPadres',
      'setVinculasHijos',
      'setEmpresa',
    ]),

    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////
    closeForm(){
      router.push('/')
    },

    selectTipoDeComprobante(cual) {
      this.filtroComprobanteSel = cual
      this.filtroComprobante = [1]
      this.listarHTTP(true)
    },

    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      if (item.total>0 && item.estado!='F') {
        this.acciones.push({nombre: 'Facturar', icon: 'mdi-file'})
      } else if (item.total<0) {
        this.acciones.push({nombre: 'Pagar', icon: 'mdi-file'})
      }
    },

    async selAccion(item) {
      if (item.nombre=='Facturar') {
        this.facturar(this.itemActual)
      } else if (item.nombre=='Pagar') {
        this.pagar(this.itemActual)
      }
    },

    getEstado (estado, accion, comprobante) {
      let c = ''
      let e = ''
      let d = 0
      let f = false
      if (accion=='k') {   //para el dark
        if (estado==='P') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='T') {
          return this.temas.cen_estado_facturado_dark 
        } else if (estado==='F') {
          e = 'Cobrado'
          c = this.temas.cen_estado_finalizado_dark
        }
      } else {
        if (estado==='P') {
          e = 'p/Facturar'
          c = this.temas.cen_estado_pendiente_bg 
        } else if (estado==='T') {
          e = 'Facturado'
          c = this.temas.cen_estado_facturado_bg 
        } else if (estado==='F') {
          e = 'Finalizado'
          c = this.temas.cen_estado_finalizado_bg
        }
      }
      return accion==='c' ? c : e
    },

    facturar(que) {
      this.recargo = 0
      this.electronica = true
      this.dialog = true;
      this.basadoEnCpr = false;
      this.notificaEnBaseAOtro = [];
      this.notificaOriginal = [];
      this.basadoEnOtroCpr = []

      this.articulos = []
      this.valores = []
      this.editado.fecha = moment().format('YYYY-MM-DD')

      this.formTitle = 'Nueva Factura - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
      this.editado.cpr = 'FAC'
      this.coef = 1
      this.electronica = true

      this.editado.perfiscal = this.itemActual.perfiscal
      this.editado.cuota = this.roundTo(this.itemActual.importe*1.21,0)
      this.editado.importedescuento = this.roundTo(this.itemActual.tot_com*1.21,0)
      this.editado.gravado = this.roundTo((this.editado.cuota-this.editado.importedescuento)/1.21,2)
      this.editado.iva = this.roundTo(this.editado.gravado*0.21,2)
      this.editado.total = this.roundTo(this.editado.gravado + this.editado.iva,2)
      this.editado.id = this.itemActual.id
    },

    pagar(que) {
      this.recargo = 0
      this.electronica = false
      this.cueMiasItems = []
      this.rentabilidad = 0
      if (this.datosEmpresa.cuentas.length>0) {
        for (let i=0; i<=this.datosEmpresa.cuentas.length-1; i++) {
          this.cueMiasItems.push({
            id: this.datosEmpresa.cuentas[i].id,
            banco: this.datosEmpresa.cuentas[i].banco.nombre,
            cuenta: this.datosEmpresa.cuentas[i].cuenta,
            nombre: this.datosEmpresa.cuentas[i].nombre,
          })
        }
      }

      // SI "que" VIENE CON DATOS, ES PORQUE ESTOY HACIENDO UN COMPROBANTE BASADO EN OTRO
      this.dialog = true;
      this.basadoEnCpr = false;         // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
      this.notificaEnBaseAOtro = [];    // LIMPIO NOTIFICACIONES PARA NO TENER PROBLEMAS
      this.notificaOriginal = [];
      this.basadoEnOtroCpr = []

      this.articulos = []
      this.valores = []
      this.editado.fecha = moment().format('YYYY-MM-DD')

      this.formTitle = 'Nueva Factura - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
      this.editado.cpr = 'FAC'
      this.coef = 1
      this.electronica = !this.sucursalDemo
    },

    listarHTTP(refrescoMeses){
      let perfiscal = ''
      let p = this.losMeses.indexOf(this.elMes)
      p ++
      p = p.toString().padStart(2,'0').substring(-2)
      perfiscal = this.anio+p
      if (this.elMes==undefined || this.elMes=='') return

      this.progress = true
      let s = this.search.length>0 ? this.search : 'all'

      return HTTP().post('/'+this.modelo, { perfiscal: perfiscal }).then(({ data }) => {
        for (let i=0; i<=this.comprobantes.length-1; i++) {
          this.comprobantes[i].total = 0
          this.comprobantes[i].ctt = 0
        }
        this.filtrosEstados = []
        for (let i=0; i<=data.length-1; i++) {

          let a = this.getEstado(data[i].estado,'e', data[i].comprobante )
          let b = ''
          if (a=='p/Facturar') {
            b = 'p/Facturar'
          } else if (a=='Facturados') {
            b = 'Facturados'
//          } else if (a=='Finalizado') {
//            b = 'Finalizados'
          } else if (a=='Cobrado') {
            b = 'Cobrados'
          } else if (a=='A Cobrar') {
            b = 'A Cobrar'
          }
          let p = this.filtrosEstados.findIndex(x => x.tip === b);
          if (p==-1) {
            this.filtrosEstados.push({tip: b, ctt: 1})
          } else {
            this.filtrosEstados[p].ctt ++
          }
          data[i].filtroEstado = b
        }
        if (this.filtrosEstados.length>1) {
          this.filtrosEstados.unshift({tip: 'Todos', ctt: data.length})
        }
        if (this.filtrosEstados.length>0) {
          this.filtroEstadoSel = this.filtrosEstados[0].tip
        }

        for (let i=0; i<=data.length-1; i++) {
          if (data[i].tipo=='CO') {
            this.comprobantes[0].ctt   += 1
            this.comprobantes[0].total += data[i].total*1.21
            this.comprobantes[4].ctt   += 1
            this.comprobantes[4].total += data[i].total*1.21
          } else if (data[i].tipo=='ME') {
            this.comprobantes[1].ctt   += 1
            this.comprobantes[1].total += data[i].total*1.21
            this.comprobantes[5].ctt   += 1
            this.comprobantes[5].total += data[i].total*1.21
          } else if (data[i].tipo=='BA') {
            this.comprobantes[2].ctt   += 1
            this.comprobantes[2].total += data[i].total*1.21
            this.comprobantes[6].ctt   += 1
            this.comprobantes[6].total += data[i].total*1.21
          } else if (data[i].tipo=='PP') {
            this.comprobantes[3].ctt   += 1
            this.comprobantes[3].total += data[i].total*1.21
            this.comprobantes[7].ctt   += 1
            this.comprobantes[7].total += data[i].total*1.21
          }
          this.comprobantes[8].ctt   += 1
          this.comprobantes[8].total += data[i].total*1.21
        }
        this.itemsAll = data
        this.items = data
        this.progress = false
      }).catch(function (error) {
        console.log(error);
      })
    },


    setAnio(anio) {
      if (anio) {
        this.anio = anio
      } else {
        this.anio = moment().format('YYYY')
      }
      this.meses = []
      for (let i=0; i<=this.periodos.length-1; i++) {
        if (this.periodos[i].substring(0,4)==this.anio) {
          let pos = Number(this.periodos[i].substring(4))-1
          this.meses.push(this.losMeses[pos])
        }
      }
      this.elMes = this.meses[0]
      this.elAnio = this.anio
      this.filtroEstadoSel = 'Todos'
      this.listarHTTP(false)
    },


    setMes(mes) {
      this.elMes = mes
      this.listarHTTP(false)
      this.filtroEstadoSel = 'Todos'
    },


    setFiltroEstado(fe) {
      if (fe.tip=='Todos') {
        this.items = this.itemsAll
      } else {
        this.items = this.itemsAll.filter(x=>x.filtroEstado==fe.tip)
      }
      this.filtroEstadoSel = fe.tip
    },


    leoAnios() {
      return HTTP().get('/anioslic')
        .then(({ data }) => {
          this.anios = []
          this.meses = []
          this.periodos = []
          let pos = -1

          for (let i=0; i<=data[0].length-1; i++) {
            this.periodos.push(data[0][i].perfiscal)
            pos = this.anios.findIndex( x => x == data[0][i].perfiscal.substring(0,4))
            if (pos==-1) {
              this.anios.push(data[0][i].perfiscal.substring(0,4))
            }
          }
          for (let i=0; i<=this.periodos.length-1; i++) {
            if (this.periodos[i].substring(0,4)==this.anios[0]) {
              pos = Number(data[0][i].perfiscal.substring(4))-1
              this.meses.push(this.losMeses[pos])
            }
          }

          this.anio = this.anios[0]
          this.elAnio = this.anio
          let mesActual = moment().format('MMM').substring(0,3)
          pos = this.meses.findIndex(x => x.toUpperCase() === mesActual.toUpperCase())
          if (pos==-1) {
            // porque aun no hay movimientos en el mes actual, busco en el anterior
            if (this.meses.length>0) {
              this.elMes = this.meses[this.meses.length-1]
            } else {
              this.elMes = ''
            }
          } else {
            this.elMes = this.meses[pos]
          }
        })

    },


    altaHTTP () {

      this.ivas = []
      this.asociado = []
      let espejo = []
      let pf = moment().format('YYYYMM')
      this.coef = 1
      let s = this.sucursalFiscal
      this.editado.estado = 'F'
      let articulo_id = null
      let codigo = ''
      let nombre = ''

      if (this.itemActual.user.tipo=='CO') {
        articulo_id = 17
        codigo = '17@1'
        nombre = 'LICENCIA ERP COMPLETO'
      } else if (this.itemActual.user.tipo=='ME') {
        articulo_id = 18
        codigo = '18@1'
        nombre = 'LICENCIA ERP MEDIO'
      } else if (this.itemActual.user.tipo=='BA') {
        articulo_id = 18
        codigo = '19@1'
        nombre = 'LICENCIA ERP BASICO'
      } else if (this.itemActual.user.tipo=='PP') {
        articulo_id = 19
        codigo = '20@1'
        nombre = 'LICENCIA PRECIOS Y PEDIDOS'
//    } else if (this.itemActual.user.tipo=='TI') {
//      articulo_id = 20
//      codigo = '20@1'
//      nombre = 'LICENCIA TIENDA'
      }

      this.articulos.push({
        articulo_id:      articulo_id,
        codigo:           codigo,
        nombre:           nombre,
        deposito_id:      null,
        unidad_id:        null,
        moneda_id:        null,
        iva_id:           5,
        cantidad:         1,
        cantidadoriginal: 1,
        stock:            0,
        undstock:         0,
        costo:            this.roundTo(this.editado.gravado,2),
        precio:           this.roundTo(this.editado.gravado,2),
        preciooriginal:   this.roundTo(this.editado.gravado,2),
        tasadescuento:    0,
        importedescuento: 0,
        total:            this.roundTo(this.editado.gravado,2),
        texto:            '',
        vencimiento:      null,
        adevolver:        0,
        padre_id:         null,
        undenvase:        1,
        escombo:          false,
      })

      this.ivas.push({
        Id: 5,
        BaseImp: this.roundTo(this.editado.gravado,2),
        Importe: this.roundTo(this.editado.gravado*0.21,2)
      })

      let cpr = this.editado.cpr+'-A '+this.sucursalFiscal+'-'+'00000001'

      debugger
      let ctacte = this.itemActual.user.tercero.ctacte
      
      return HTTP().post('/nuevaventa', {
        fecha:               moment().format('YYYY-MM-DD'),
        perfiscal:           pf,
        vencimiento:         moment(this.editado.fecha).format('YYYY-MM-DD'),
        ctacte:              ctacte,
        cpr:                 cpr,
        user_id:             1,
        sucursal_id:         1,
        tercero_id:          this.itemActual.user.tercero_id,
        comprobante_id:      1,
        direccion_id:        1,
        documento_id:        25,
        documentonumero:     20202836004,
        documentocodigo:     80,
        mediodepago_id:      null,
        deposito_id:         1,
        vendedor:            [],
        moneda_id:           51,
        tasadescuento:       0,
        importedescuento:    this.editado.importedescuento*this.coef,
        recargo:             0,
        gravado:             this.editado.gravado*this.coef,
        exento:              0,
        iva:                 this.editado.iva*this.coef,
        total:               this.editado.total*this.coef,
        rentabilidad:        this.editado.total*this.coef,
        observaciones:       'FACTURA POR USO DE LICENCIA',
        regstk:              false,
        estado:              'F',
        activo:              true,
        articulos:           this.articulos,
        valores:             this.valores,
        notificacion:        0,
        notificaEnBaseAOtro: this.notificaEnBaseAOtro,
        notificaOriginal:    this.notificaOriginal,
        basadoEnOtroCpr:     this.basadoEnOtroCpr,
        anotadorId:          0,
        espejo:              espejo,
        novedad:             null,
        electronica:         this.electronica,
        produccion:          this.datosEmpresa.faeproduccion,
        ivas:                this.ivas,
        asociado:            this.asociado,
        facturasEnRemito:    [],
        licenciaId:          this.editado.id,
        quienpidio:          ''}, { timeout: 15000 }).then(({ data }) => {

        if (!data) {
          this.mensaje('¡Opps!, hubo un problema en la grabación!, consulte con la mesa de ayuda Gohu.', this.temas.cen_card_activo_bg, 3000) 
        } else {
          if ( this.electronica) {
            if (data.cpr==undefined) {
              this.electronicaOk = false
              this.msg.msgTitle = 'Error en el Comprobante Electrónico'
              let msg = ''
              msg  = 'No se puedo realizar el comprobante electrónico. '
              msg += 'Los servidores de AFIP no responden. '
              msg += 'Debera esperar y reintentar luego.<br>'
              msg += '<b>Si urge realizar el comprobante cambie a Manual.</b><br>'
              this.msg.msgBody = msg
              this.msg.msgAccion  = 'Comprobante Electronico Error'
              this.msg.msgButtons = ['Reintetar','Cancelar']
            } else {
              this.electronicaOk = true
              this.msg.msgTitle = 'Comprobante Electrónico'
              let msg = '<br>Se ha generado correctamente un nuevo comprobante electrónico.<br><br>'
              msg += 'Comprobante: '+data.cpr+'<br>'
              msg += 'CAE: '+data.cae+'<br><br>'
              if (this.notificaEnBaseAOtro.length) {
                msg += '¡El comprobante ha sido enviado al cliente y fue notificado!'
              }
              this.msg.msgBody    = msg
              this.msg.msgAccion  = 'Comprobante Electronico'
              this.msg.msgButtons = ['Aceptar']
            }
            this.msg.msgVisible = true
          } else {
            this.mensaje('¡El comprobante se ha registrado con éxito!', this.temas.forms_titulo_bg, 3000) 
          }
        }
        this.dialog = false
        this.listarHTTP(true)
      })
    },


    cancelar() {
      this.dialog = false;
      this.articulos = []
      this.editedIndex = -1;
    },


    //////////////////////////////
    // METODOS FUNCIONES VARIAS //
    //////////////////////////////
    roundTo(value, places){
      var power = Math.pow(10, places);
      return Math.round(value * power) / power;
    },


    msgRespuesta(op) {
      if (op==='Aceptar') {
      }
      this.msg.msgVisible = false;
    },


    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
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
  .fg75 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 75%;
  }
  .fg80 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 80%;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .fg90 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
</style>