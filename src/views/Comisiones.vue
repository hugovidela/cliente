<template>
  <v-layout align-start class="fg mt-3 ma-0">
    <v-flex>
      <v-row class="pb-2">
        <v-col v-for="(cbt, idx) in vendedores" v-bind:key="idx">
          <v-card class="mx-auto"
            @click="selectVendedor(cbt.tercero_id)"
            tile outlined
            max-width="170">
            <v-app-bar
              :color="cbt.tercero_id==filtroVendedor ? temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.tercero_id==filtroVendedor ? temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title class="fg">{{ cbt!=null ? cbt.nombre : '' }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-list-item-avatar color="grey">
                <v-img height="40" width="40" :src="`/images/${cbt.avatar}`"></v-img>
              </v-list-item-avatar>
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-container>
              <span class="fg85 pt-0 pb-0">
                $ {{ formatoImporte(cbt.total) }}<br>
                Comisión <b>%{{ formatoImporte(cbt.comision) }}</b>
              </span>
              <v-row>
                <v-col cols="3" class="pt-6 pb-3">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon small outlined
                        @click="nuevaliquidacion(cbt)" v-on="on">
                        <v-icon>mdi-18px mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Nueva Liquidación</span>
                  </v-tooltip>
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
        item-key="id"
        class="elevation-3"
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
              v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                <v-icon left>
                  mdi-tie
                </v-icon>
                <b>COMISIONES</b>
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
                class="ml-1"
                @click="setMes(mes)">
                {{ mes }}
              </v-chip>
              <v-progress-circular v-if="progress"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>
            </v-toolbar-title>
            <!-- DIALOG PARA NUEVA COMISION  -->
            <v-dialog v-model="dialog" max-width="1200px">
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
                  {{empresa}} - NUEVA LIQUIDACION DE COMISIONES -
                  {{ vendedor!=null ? vendedor.nombre : '' }}
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="selected.length>0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="generarLiquidacion">
                  Generar Liquidación
                </v-btn>
              </v-toolbar>
              <v-card class="fg">
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                       <v-row>
                        <v-col cols="3" sm="3" md="3">
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="movSel"
                            outlined dense disabled
                            label="Seleccionado">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            v-model="porComision"
                            outlined dense
                            label="% Comisión"
                            required>
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="impCom"
                            outlined dense disabled
                            label="Comisión">
                          </v-text-field>
                        </v-col>
                       </v-row>
                       <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <v-data-table
                              v-model="selected"
                              :headers="headersValores"
                              :items="valores"
                              @toggle-select-all="selectAll"
                              :single-select="false"
                              item-key="id"
                              show-select  dense
                              class="pl-1 pr-3 elevation-1 pt-2"
                              :footer-props="{
                                itemsPerPageOptions: [8],
                                showFirstLastPage: true,
                                showCurrentPage: true,
                                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                                prevIcon: 'mdi-arrow-left-drop-circle-outline',
                              }"
                              @item-selected="clickRow">
                              <template v-slot:item.rec="{ item }">
                                <span>{{ kit.cpr(item.rec) }}</span>
                              </template>
                              <template v-slot:item.cpr="{ item }">
                                <span>{{ kit.cpr(item.cpr) }}</span>
                              </template>
                              <template v-slot:item.importe="{ item }">
                                <span>$ {{ formatoImporte(item.importe) }}</span>
                              </template>
                              <template v-slot:item.fechafinan="{ item }">
                                <span>{{ formatoFechaCorta(item.fechafinan) }}</span>
                              </template>
                            </v-data-table>
                          </v-form>
                        </v-col>
                      </v-row>
                     </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG DE NUEVA COMISION  -->
          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              :color="temas.forms_titulo_bg"
              class="pt-0"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>
        <template v-slot:item.cliente="{ item }">
          <span>{{ item.cliente }}</span>
        </template>
        <template v-slot:item.tipo="{ item }">
          <span>{{ item.tipo }}</span>
        </template>
        <template v-slot:item.nrovalor="{ item }">
          <span>{{ item.nrovalor }}</span>
        </template>
        <template v-slot:item.cpr="{ item }">
          <span>{{ kit.cpr(item.cpr) }}</span>
        </template>
        <template v-slot:item.rec="{ item }">
          <span>{{ kit.cpr(item.rec) }}</span>
        </template>
        <template v-slot:item.fechafinan="{ item }">
          <span>{{
            formatoFechaCorta(item.fechafinan) }}
          </span>
        </template>
      <!--
        <template v-slot:item.importe="{ item }">
          <v-chip label
            :color="getColorTotal(item)" dark>
            $ {{ formatoImporte(item.importe) }}
          </v-chip>
        </template>
      -->
        <template v-slot:item.importe="{ item }">
          <span>${{ formatoImporte(item.importe) }}</span>
        </template>
        <template v-slot:item.tasacomision="{ item }">
          <span>${{ formatoImporte(item.tasacomision) }}</span>
        </template>
        <template v-slot:item.importecomision="{ item }">
          <span>${{ formatoImporte(item.importecomision) }}</span>
        </template>
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
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
import Mail from "./Forms/mail.vue";

export default {
  components: {
    SBar,
    Confirmacion,
    Mail,
    impresiones,
  },
  data: () => ({
    progress: false,
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    acciones: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    loading: true,
    vendedores: [],
    vendedor: null,
    filtroComprobante: [1,6,14],
    filtroVendedor: 0,
    itemActual: null,
    tl: "text-lowercase",
    items: [],
    valores: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    footerProps: {'items-per-page-options': [8]},
    search: '',               // para el cuadro de búsqueda de datatables
    dialog: false,            // para que la ventana de dialogo o modal no aparezca automáticamente
    selected: [],
    movSeleccionados: 0,
    porComision: 0,
    impComision: 0,
    // definimos los headers de la datatables
    headers: [
      { text: 'Cliente', value:'cliente', align: 'left', width: '250' },
      { text: 'Comprobante', value:'cpr', align: 'left', width: '140'},
      { text: 'Recibo', value:'rec', align: 'left', width: '140'},
      { text: 'Tipo', value:'tipo', align: 'left', width: '100'},
      { text: 'NroValor', value:'nrovalor', align: 'end', width: '150'},
      { text: 'Fec.Finan', value:'fechafinan', align: 'left', width: '140'},
      { text: 'Importe', value:'importe', align: 'end', width: '180'},
      { text: '%Comis.', value:'tasacomision', align: 'end', width: '90'},
      { text: 'Imp.Comis.', value:'importecomision', align: 'end', width: '180'},
    ],
    headersValores: [
      { text: 'Cliente', value:'cliente', align: 'left' },
      { text: 'Tipo', value:'tipo', align: 'left'},
      { text: 'NroValor', value:'nrovalor', align: 'end'},
      { text: 'Recibo', value:'rec', align: 'left'},
      { text: 'Comprobante', value:'cpr', align: 'left'},
      { text: 'Fec.Finan', value:'fechafinan', align: 'left'},
      { text: 'Fec.Salida', value:'fechasalida', align: 'left'},
      { text: 'Importe', value:'importe', align: 'end'},
    ],
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalDemo',
      'sucursalFiscal',
      'tema',
      'temas',
      'centrales',
      'notificaciones',
      'caja',
      'vinculosPadres', 
      'vinculosHijos',
      'empresa',
      'datosEmpresa',
      'responsable',
      'cuit',
      'operario',
      'operarioUserId',
      'operarioEsVendedor',
      'operarioTerceroId',
      'level',
    ]),

    movSel() {
      return '$'+this.formatoImporte(this.movSeleccionados)
    },

    impCom() {
      return '$'+this.formatoImporte(this.impComision)
    },

  },

  watch: {
    '$store.state.sucursal' () {
      this.listarHTTP()
    },
  },

  mounted () {
    this.$store.commit('closeAlert')
    moment.locale('es');
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
  },

  created () {
    this.cen_activo_bg   = this.$store.state.temas.cen_card_activo_bg
    this.cen_activo_dark = this.$store.state.temas.cen_card_activo_dark
    debugger
    return HTTP().get('/indexter/false/3/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/%%')
      .then(({ data })=>{

      debugger
      for (let i=0; i<=data.length-1; i++) {
        if (data[i].area=='V') {
          if (data[i].tercero.user!=null) {
            this.vendedores.push({
              id: data[i].tercero.user.id,
              nombre: data[i].tercero.nombre.substring(0,7),
              avatar: data[i].tercero.user.avatar,
              tercero_id: data[i].tercero.id,
              comision: data[i].comision,
              tercero: data[i].tercero,
              total: 0,
            })
          }
        }
      }
      this.leoAnios().then( data => {
        this.filtroVendedor = this.vendedores.length>0 ? this.vendedores[0].tercero_id : null
        this.listarHTTP()
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
      'setOperario',
      'setLevel',
    ]),

    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////
    closeForm(){
      router.push('/')
    },

    setAnio() {
      this.anio = this.anio == null ? moment().format('YYYY') : this.anio
      this.meses = []
      for (let i=0; i<=this.periodos.length-1; i++) {
        if (this.periodos[i].substring(0,4)==this.anio) {
          let pos = Number(this.periodos[i].substring(4))-1
          this.meses.push(this.losMeses[pos])
        }
      }
      this.elMes = this.meses[0]
      this.listarHTTP(false)
    },

    selectVendedor(cual) {
      this.filtroVendedor = cual
      if (this.sucursalDemo) {
        this.filtroComprobante = [125]
      } else {
        this.filtroComprobante = [1,6,14,128,3,8,16,2,7,15]
      }
      //alert('listarHTTP en selectVendedor')
      this.listarHTTP()
    },

    nuevaliquidacion(vendedor) {
      this.vendedor = vendedor
      this.dialog = true
      this.valores = []
      this.selected = []
      this.movSeleccionados = 0
      this.impComision = 0
      this.porComision = vendedor.comision
      for (let i=0; i<=this.items.length-1; i++) {
        if (this.items[i].comision_id==null) {
          this.valores.push(this.items[i])
        }
      }
    },

    generarLiquidacion() {
      this.msg.msgTitle = '¡Generar Liquidación!'
      let m = 'Se va a generar una liquidación a nombre de <b>'+this.vendedor.nombre+'.</b><br>'
      m += 'El comprobante será enviado al módulo Compras para que realices el pago.<br>'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'generar liquidacion'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    generarLiquidacionHTTP() {
      let pos = this.sucursales.findIndex(x=>x.id=this.sucursal)
      return HTTP().post('/generarliquidacion', {
        sucursal: this.sucursales[pos],
        vendedor: this.vendedor,
        valores: this.selected
        }).then(({ data }) => {
        if (data!='error') {
          this.msg.msgTitle = 'Liquidación Generada Correctamente'
          let m = 'Se ha generado una nueva liquidación.<br>'
          m += 'Esta fue enviada al módulo Compras para que puedas realizar el pago.'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'liquidacion ok'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Error en la Liquidación'
          this.msg.msgBody = 'La Liquidación no se ha podido generar<br>Reintente, si el problema persiste consulte con sistemas<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'liquidacion error'
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialog = false
        this.listarHTTP(false)
      })
    },

    selectAll(event) {
      if (event.value) {
        this.selected = this.valores
        this.movSeleccionados = 0
        this.impComision = 0
        for (let i=0; i<=this.selected.length-1; i++) {
          this.selected[i].tasacomision = this.porComision
          this.selected[i].importecomision = this.roundTo(this.selected[i].importe*(this.porComision/100),2)
          this.impComision += this.roundTo(this.selected[i].importe*(this.porComision/100),2)
          this.movSeleccionados+=this.selected[i].importe
        }
      } else {
        this.selected = []
        this.movSeleccionados = 0
        this.impComision = 0
      }
    },

    clickRow(value) {
      if (value.value) {
        value.item.tasacomision = this.porComision
        value.item.importecomision = this.roundTo(value.item.importe*(this.porComision/100),2)
        this.movSeleccionados += value.item.importe
      } else {
        value.item.tasacomision = this.porComision
        value.item.importecomision = 0
        this.movSeleccionados -= value.item.importe
      }
      this.impComision = this.movSeleccionados*(this.porComision/100)
    },

    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      this.acciones.push({nombre: 'Detalles', icon: 'mdi-glasses'})
      this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})
      this.acciones.push({nombre: 'Rastrear', icon: 'mdi-move-resize-variant'})
    },

    async selAccion(item) {
      if (item.nombre=='Detalles') {
      } else if (item.nombre=='WhatApp') {
      } else if (item.nombre=='Imprimir') {
      } else if (item.nombre=='Anular') {
      } else if (item.nombre=='Imputar NDC') {
      }
    },

    listarHTTP() {
      let perfiscal = ''
      if (this.elMes==undefined || this.elMes=='') return
      let m = this.queMesEs(this.elMes)
      perfiscal = this.anio+m
      this.progress = true
      return HTTP().post('/comisiones', {suc:this.sucursal,ope:this.filtroVendedor,perfiscal:perfiscal}).then(({data})=>{
        this.progress = false
        this.items = data.coms
        return HTTP().post('/ventasvendedores', {suc: this.sucursal,per: perfiscal,ope: null }).then(({ data }) => {
          for (let i=0; i<=this.vendedores.length-1; i++) {
            this.vendedores[i].total = 0
          }
          for (let i=0; i<=this.vendedores.length-1; i++) {
            for (let j=0; j<=data.length-1; j++) {
              if (data[j].vendedor_id==this.vendedores[i].tercero_id) {
                this.vendedores[i].total = data[j].total
              }
            }
          }
        })
      }).catch(function (error) {
        console.log(error);
        this.progress = false
      })
    },

    queMesEs(mes) {
      this.elMes = mes
      let p = this.losMeses.indexOf(mes)
      p ++
      p = '0'+p
      p = p.substr(-2)
      this.progress = false
      return p
    },

    setMes(mes) {
      this.elMes = mes
      //alert('listarHTTP en setMes')
      this.listarHTTP()
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
      //alert('listarHTTP en setAnio')
      this.listarHTTP()
    },

    async leoAnios() {
      //alert('en leoAnios')
      return HTTP().post('anios/', {tipo: 'V'}).then(({ data }) => {
        //alert('en leoAnios paso el http')
        this.anios = []
        this.meses = []
        this.periodos = []
        let pos = -1
        // UN CASO ESPECIAL: SI ES VENDEDOR PUEDE ESTAR HACIENDO PEDIDOS POR CUENTA DE SUS CLIENTES
        // PERO SI CAMBIO EL MES Y EL CLIENTE NO HIZO MOVIMIENTOS AUN, NO TENDRA ACTUALIZADO EL PERIDODO
        // POR LO TANTO LO TENGO QUE AGREGAR A MANO.
        if (this.operarioEsVendedor) {
          // PRIMERO CALCULO EL AÑO Y MES ACUAL
          let aniomes = moment().format('YYYYMM')
          if (data[0][0].perfiscal != aniomes) {
            this.anios.push(aniomes.substr(0,4))
            pos = Number(aniomes.substr(5,2))-1
            this.meses.push(this.losMeses[pos])
          }
        }
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

    //////////////////////////////
    // METODOS FUNCIONES VARIAS //
    //////////////////////////////
    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='exportar a PDF') {
        } else if (this.msg.msgAccion=='exportar a XLS') {
        } else if (this.msg.msgAccion=='generar liquidacion') {
          this.generarLiquidacionHTTP()
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

    getColorTotal (item) {
      let tieneNdc = false
      if (item.pendientes!=null) {
        for (let i=0; i<= item.pendientes.length-1; i++) {
          if (item.pendientes[i].cancelaciones!=null) {
            for (let j=0; j<=item.pendientes[i].cancelaciones.length-1; j++) {
              if (item.pendientes[i].cancelaciones[j].cancelador.cpr.substr(0,3)=='NDC') {
                tieneNdc = true
                break
              }
            }
          }
        }
      }
      return (tieneNdc) ? this.temas.forms_btn_inactivo_bg : this.temas.barra_lateral_bg
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoFechaCorta(value) {
      return moment(String(value)).format('YY-MM-DD')
    },

    formatoFechaHaceCuanto(value) {
      return moment(String(value)).fromNow(true)
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