<template>
  <v-layout align-start>
    <v-flex class="fg">
      <v-dialog v-model="dialog" :fullscreen="true" persistent
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>

        <v-toolbar class="fg"
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="closeForm">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>

          <span class="fg">
            Turnos
          </span>
          <v-btn class="ml-4"
            outlined fab small
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar" class="pl-3">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-btn class="ml-4"
            outlined fab small
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-btn class="ml-4"
            outlined fab small
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            @click="nuevo">
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            outlined fab small class="ml-4"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            @click="setToday">
            Hoy
          </v-btn>
          <v-btn
            fab outlined small class="ml-4"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            @click="cambio('day')">
            Día
          </v-btn>
          <v-btn
            fab outlined small class="ml-4"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            @click="cambio('week')">
            Sem
          </v-btn>
          <v-btn
            fab outlined small class="ml-4"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            @click="cambio('month')">
            Mes
          </v-btn>
        </v-toolbar>
        <v-card class="fg">
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-sheet height="600">
                    <v-calendar
                      ref="calendar" v-model="focus" color="primary"
                      :events="events" :event-color="getEventColor"
                      :type="type"
                      :first-interval=14
                      :interval-minutes=30
                      :interval-count=28
                      :interval-format="intervalFormat"
                      @click:day="nuevo"
                      @click:event="showEvent"
                      @click:more="viewDay"
                      @click:date="viewDay"
                      @change="updateRange">
                      <template v-slot:event="{ event }">
                        <div>
                          {{ formatEventTime(event.end) }}
                          <strong>{{ event.cliente }}</strong><br>
                        </div>
                      </template>
                    </v-calendar>

                    <v-menu
                      v-model="selectedOpen"
                      :close-on-content-click="false"
                      :activator="selectedElement" offset-x offset-y>
                      <v-card class="fg"
                        :min-height="tipoEdit=='N'||tipoEdit=='M'?'350':'350'"
                        min-width="350px" max-width="350px" flat>
                        <v-toolbar
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">
                          <v-btn
                            icon @click="selectedOpen = false">
                            <v-icon>mdi-arrow-left-circle</v-icon>
                          </v-btn>
                          <v-toolbar-title v-if="tipoEdit!=''"
                            class="fg">
                            {{ tipoEdit=='N'?'Nuevo Turno': selectedEvent.cliente }}
                          </v-toolbar-title>
                          <v-toolbar-title v-else
                            class="fg" v-html="selectedEvent.cliente">
                          </v-toolbar-title>
                        </v-toolbar>
<!--
                        <v-card-text v-if="tipoEdit==''">
                          <span><b>{{selectedEvent.hora}} hr.</b></span><br>
                          <span>Código:<b> {{selectedEvent.codigo}}</b></span><br>
                          <span>Nombre:<b> {{selectedEvent.nombre}}</b></span><br>
                          <span>Factura:
                            <b>{{selectedEvent.comprobante?
                              selectedEvent.comprobante:'Pendiente'}}</b>
                          </span><br>
                          <span>Importe:
                            <b>${{formatoImporte(selectedEvent.importe)}}</b>
                          </span><br>
                          <span>Observaciones<br><b> {{selectedEvent.observ}}</b></span>
                          <span>tipoEdit<br><b> {{tipoEdit}}</b></span>
                        </v-card-text>
-->
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" class="pb-0 pt-2">
                              <v-autocomplete v-if="tipoEdit=='N'"
                                ref="cliente"
                                v-model="editado.tercero_id"
                                :items="itemsTerceros"
                                :loading="isLoadingTerceros"
                                :search-input.sync="searchTerceros"
                                item-text="razon_social"
                                item-value="id"
                                autofocus
                                label="Cliente"
                                :color="temas.forms_titulo_bg"
                                placeholder="Escriba para buscar"
                                prepend-icon="mdi-database-search"
                                :disabled="tipoEdit!='N'||editado.comprobante==''"
                                v-on:keydown.tab="buscoSiElTerceroEstaVinculado"
                                @change="elTurnoEstaOk()">
                              </v-autocomplete>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" class="pb-0 pt-0">
                              <v-autocomplete v-if="tipoEdit!=''"
                                ref="servicio"
                                v-model="editado.articulo_id"
                                :items="itemsArticulos"
                                :loading="isLoadingArticulos"
                                :search-input.sync="searchArticulos"
                                item-text="nombre"
                                item-value="id"
                                label="Artículo/Servicio"
                                :color="temas.forms_titulo_bg"
                                placeholder="Escriba para buscar"
                                prepend-icon="mdi-database-search"
                                :disabled="editado.comprobante!=null"
                                @change="elTurnoEstaOk()">
                              </v-autocomplete>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="6" class="pb-0 pt-0">
                              <v-menu
                                ref="menu"
                                v-model="menuFecha"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                :disabled="editado.comprobante!=null">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="editado.fecha"
                                    label="Pres. p/Almanaque"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    :disabled="editado.comprobante!=null"
                                    @change="elTurnoEstaOk() && turnosUsados()">
                                  </v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editado.fecha"
                                  @input="menuFecha=false"
                                  @change="elTurnoEstaOk() && turnosUsados()">
                                </v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="6" class="pb-0 pt-0" v-if="$store.state.turnoslv==''">
                              <v-menu
                                ref="menu"
                                v-model="menu2Hora"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="editado.hora"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                                :disabled="editado.comprobante!=null">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="editado.hora"
                                    label="Pres. p/Reloj"
                                    prepend-icon="mdi-clock-time-four-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    @change="elTurnoEstaOk()">
                                  </v-text-field>
                                </template>
                                <v-time-picker
                                  v-if="menu2Hora"
                                  v-model="editado.hora"
                                  full-width
                                  format="24hr"
                                  @click:minute="$refs.menu.save(editado.hora)"
                                  @change="elTurnoEstaOk()">
                                </v-time-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="6" class="pb-0 pt-0" v-else>
                              <v-select
                                v-model="editado.hora"
                                :color="temas.forms_titulo_bg"
                                :item-color="temas.forms_titulo_bg"
                                :items="tx"
                                label="Hora"
                                @change="elTurnoEstaOk()"
                                :disabled="editado.comprobante!=null">
                              </v-select>
                            </v-col>
                          </v-row>
                          <v-row v-if="editado.comprobante!=null">
                            <v-col>
                              <span>Factura:
                                <b>{{editado.comprobante?
                                  editado.comprobante:'Pendiente'}}</b>
                              </span><br>
                              <span>Importe:
                                <b>${{formatoImporte(editado.total)}}</b>
                              </span><br>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                              <v-textarea
                                v-model="editado.observ"
                                :color="temas.forms_titulo_bg"
                                label="Observaciones"
                                auto-grow
                                outlined
                                rows="2"
                                row-height="20"
                                shaped
                                :disabled="editado.comprobante!=null">
                              </v-textarea>
                            </v-col>
                          </v-row>

                        </v-card-text>
                        <v-card-actions v-if="eteo">
                          <v-tooltip bottom
                            v-if="(tipoEdit=='N' || tipoEdit=='M') && selectedEvent.estado!='F'">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small outlined
                                class="mr-1 ml-1"
                                @click="grabar(selectedEvent)" v-on="on">
                                <v-icon>mdi-content-save-settings</v-icon>
                              </v-btn>
                            </template>
                            <span>Grabar</span>
                          </v-tooltip>
<!--
                          <v-tooltip bottom v-if="tipoEdit=='' && selectedEvent.estado!='F'">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small outlined
                                class="mr-1 ml-1"
                                @click="facturar(selectedEvent)" v-on="on">
                                <v-icon>mdi-note-outline</v-icon>
                              </v-btn>
                            </template>
                            <span>Facturar</span>
                          </v-tooltip>
-->
                          <v-tooltip bottom v-if="tipoEdit=='' && selectedEvent.estado!='F'">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small outlined
                                class="mr-1 ml-1"
                                @click="editar(selectedEvent)" v-on="on">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </template>
                            <span>Editar</span>
                          </v-tooltip>
                          <v-tooltip bottom v-if="tipoEdit=='M' && selectedEvent.estado!='F'">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small outlined
                                class="mr-1 ml-1"
                                @click="borrar(selectedEvent)" v-on="on">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </template>
                            <span>Borrar</span>
                          </v-tooltip>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>

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

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    userArticulosId: 0,
    eteo: false,
    dialog: true,
    tipoEdit: '',
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      '4day': '4 Días',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    nombres: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    editado: {
      id: null, tercero_id: null, cliente: '', start: '', end: '', color: '', timed: false, articulo_id: null, codigo: '',
      nombre: '', observ: '', fecha: '', hora: null, estado: 'P', comprobante: null, total: null,
    },
    msg: { msgAccion: null, msgVisible: false, msgTitle: '', msgBody: '', msgButtons: [''] },
    itemActual: null,
    menuFecha: false,
    menu2Hora: false,
    entriesTerceros: [],
    entriesArticulos: [],
    searchTerceros: '',
    searchArticulos: '',
    isLoadingTerceros: false,
    isLoadingArticulos: false,
    tercerosUserId: [],
    userDelTercero: 0,
    userDelterceroDatos: null,

    tlv: [],
    tsd: [],
    tx: [],

  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState(['sucursal','empresa','tema','temas','logotipo','operarioEsVendedor','operarioTerceroId','operarioUserId',
      'vinculosHijos','vinculosPadres','vinculosPadresLic','vinculosPadresAll','dolar','turnoslv','turnossd','codigooid',
      'descuentos','transition',
    ]),

    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },

    itemsArticulos () {
      return this.entriesArticulos.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },

  },

  watch: {
    '$route.path': function(val, oldVal){
//      this.init_component();
    },
    '$store.state.sucursal' () {
//      this.init_component()
    },

    searchTerceros (val) {
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      this.userDelTercero = 0
      this.userDelterceroDatos = null

      let sea = val==''?'%%':'%'+val+'%'
      debugger
      return HTTP().get('/indexter/false/1/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/'+sea).then(({data})=>{

        debugger
        this.entriesTerceros = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTerceros.push(data[i].tercero)
          this.tercerosUserId.push(data[i].tercero_id)
        }
        if (val !== null && val !== '') {
          let ipos = this.entriesTerceros.findIndex(i => i.id === this.editado.tercero_id);
          let valor = this.tercerosUserId[ipos]
          this.userDelTercero = data[ipos].tercero.user!=null ? data[ipos].tercero.user.id : 0
          return HTTP().get('/tercero/'+valor+'/1/false/'+this.sucursal).then(({ data }) => {
            this.userDelTerceroDatos = data.t           // para cuando es un pedido de un vendedor
            this.lisObj = [];
            let rid = data.t[0].tercero.responsable.id
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTerceros = false))
    },

    searchArticulos (val) {
      if (this.isLoadingArticulos) return
      this.isLoadingArticulos = true
      debugger
      return HTTP().post('/articuloz', {
        search: '',
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: 300 }).then(({ data })=>{

        debugger
        this.entriesArticulos = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesArticulos.push(data[i])
        }
        if (val !== null && val !== '') {
          let ipos = this.entriesArticulos.findIndex(i => i.id === this.editado.articulo_id);
          let valor = this.tercerosUserId[ipos]
          this.userDelTercero = data[ipos].tercero.user!=null ? data[ipos].tercero.user.id : 0
          return HTTP().get('/tercero/'+valor+'/1/false/'+this.sucursal).then(({ data }) => {
            this.userDelTerceroDatos = data.t           // para cuando es un pedido de un vendedor
            this.lisObj = [];
            let rid = data.t[0].tercero.responsable.id
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingArticulos = false))
    },


  },

  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
  },

  created () {
    //this.init_component()
  },
  
  methods: {

    cargoV() {
      let v = [];
      if (this.userArticulosId==this.userId) {
        v.push(this.userId);
      } else if (this.userArticulosId==0) {
        for (let i=0; i<= this.$store.state.vinculosPadres.length-1; i++) {
          v.push(this.$store.state.vinculosPadres[i]);
        }
        v.push(this.userId);
      } else {
        v.push(this.userArticulosId);
      }
      return v
    },

    formatEventTime(date) {
      return new Date(date).toLocaleTimeString('es-ES', {
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: false
      })
    },

    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    
    getEventColor (event) {
      return event.color
    },
    
    setToday () {
      this.focus = ''
    },
    
    prev () {
      this.$refs.calendar.prev()
      //this.itemActual = this.$refs.calendar.date
    },
    
    next () {
      this.$refs.calendar.next()
      //this.itemActual = this.$refs.calendar.date
    },
    
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.tipoEdit = 'M'
        this.editado.id = event.id
        this.editado.tercero_id = event.tercero_id
        this.editado.articulo_id = event.articulo_id
        this.editado.fecha = event.fecha
        this.editado.hora = event.hora
        this.editado.observ = event.observ
        this.editado.comprobante = event.comprobante
        this.editado.total = event.importe
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        this.turnosUsados()  
        this.eteo = this.editado.comprobante==null ? true : false
        requestAnimationFrame(() => requestAnimationFrame(() =>
          this.selectedOpen = true
        ))
      }
      if (this.selectedOpen) {
//      this.tipoEdit = ''
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },

    updateRange ( {start} ) {
      let fec = ''
      //if (start==undefined) {
      //  if (this.itemActual!=null) {
      //    fec = this.itemActual.fecha
      //  } else {
      //    fec = moment().format('YYYY-MM-DD')
      //  }
      //} else {
        fec = start.date
      //}

      const events = []
      return HTTP().get('/turnos/'+this.sucursal+'/'+fec).then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          const first = new Date(data[i].fecha)
          const second = new Date(data[i].fecha)
          events.push({
            id: data[i].id,
            tercero_id: data[i].cliente.id,
            cliente: data[i].cliente.nombre,
            start: first,
            end: second,
            color: data[i].comprobante!=null?this.temas.forms_titulo_bg:this.temas.forms_btn_add_bg,
            timed: true,
            articulo_id: data[i].articulo.id,
            codigo: data[i].articulo.codigo,
            nombre: data[i].articulo.nombre,
            observ: data[i].observ,
            hora: moment(data[i].fecha).format('HH:mm'),
            fecha: moment(data[i].fecha).format('YYYY-MM-DD'),
            estado: data[i].articulo.estado,
            comprobante: data[i].comprobante!=null?data[i].comprobante.cpr:null,
            importe: data[i].comprobante!=null?
              data[i].comprobante.total:
              data[i].articulo.precios[0].precio,
          })
        }
        this.events = events
      })
    },

    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },

    closeForm(){
      router.push('/')
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    getColor (activo) {
      return (activo === 1) ? 'green' : 'orange'
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    closeForm() {
      this.dialog = false;
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },

    cambio(cual) {
      this.type = cual
    },

    facturar(event) {
    },

    nuevo(e) {
//    this.tlv = this.$store.state.turnoslv
//    this.tsd = this.$store.state.turnossd
//    this.tx = this.tlv  // puede ser lv o sd, depende del dia de semana.

      this.selectedOpen = true;
      this.tipoEdit = 'N';
      //this.editado.fecha = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.editado.fecha = e.date<moment().format('YYYY-MM-DD')?moment().format('YYYY-MM-DD'):e.date
      this.editado.tercero_id = null
      this.editado.articulo_id = null
      this.editado.hora = moment().format('hh:mm')
      this.editado.observ = ''
      this.eteo = false
      this.turnosUsados()
    },

    editar(event) {
      this.editado.tercero_id = event.tercero_id
      this.editado.articulo_id = event.articulo_id
      this.editado.fecha = event.fecha
      this.editado.hora = event.hora
      this.editado.observ = event.observ
      this.tipoEdit = 'M'
      this.eteo = true
      this.turnosUsados()
    },

    borrar(event) {
      this.itemActual = event
      this.msg.msgTitle = 'Borrar Turno'
      this.msg.msgBody = '¿Confirma borrar este Turno?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar turno'
      this.msg.msgButtons = ['Aceptar']
    },

    grabar(event) {
      this.selectedOpen = false;
      if (this.tipoEdit=='N') {
        return HTTP().post('/nuevoturno', {
          sucursal: this.sucursal,
          tercero_id: this.editado.tercero_id,
          articulo_id: this.editado.articulo_id,
          fecha: this.editado.fecha,
          hora: this.editado.hora,
          observ: this.editado.observ }).then(({ data }) => {
          if (data) {
            this.mensaje('¡Turno guardado correctamente!', this.temas.forms_titulo_bg, 2500) 
            let imes = moment(this.editado.fecha).startOf('month').format('YYYY-MM-DD');
            let start = {date: imes}
            this.updateRange ({start})
          } else {
            this.mensaje('¡Opps, se ha producido un error en grabar el Turno!', this.temas.forms_titulo_bg, 2500) 
          }
          this.tipoEdit = ''
        })
      } else {
        return HTTP().post('/updateturno', {
          id: this.editado.id,
          sucursal: this.sucursal,
          tercero_id: this.editado.tercero_id,
          articulo_id: this.editado.articulo_id,
          fecha: this.editado.fecha,
          hora: this.editado.hora,
          observ: this.editado.observ }).then(({ data }) => {
          if (data) {
            this.mensaje('¡Turno guardado correctamente!', this.temas.forms_titulo_bg, 2500) 
            let imes = moment(this.editado.fecha).startOf('month').format('YYYY-MM-DD');
            let start = {date: imes}
            this.updateRange ({start})
          } else {
            this.mensaje('¡Opps, se ha producido un error en grabar el Turno!', this.temas.forms_titulo_bg, 2500) 
          }
          this.tipoEdit = ''
        })
      }
    },

    buscoSiElTerceroEstaVinculado() {
      let estaVinculado = false
      if (this.editado.tercero_id!=null) {
        for (let i=0; i<=this.vinculosHijos.length-1; i++) {
          if (this.vinculosHijos[i]==this.userDelTercero) {
            this.msg.msgTitle = 'Cliente Vinculado'
            let msg = 'El cliente esta vinculado, debe pedirle que le realice un '
            msg += this.editado.cpr=='FAC' ? 'pedido.' : 'pago.'
            this.msg.msgBody = msg
            this.msg.msgVisible = true
            this.msg.msgAccion = 'cliente vinculado'
            this.msg.msgButtons = ['Aceptar']
            estaVinculado = true
          } 
        }
        return estaVinculado
      }
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar turno') {
          return HTTP().delete('/borrarturno/'+this.itemActual.id).then((data) => {
            this.msg.msgVisible = false;
            let imes = moment(this.itemActual.fecha).startOf('month').format('YYYY-MM-DD');
            let start = {date: imes}
            this.updateRange ({start})
          });
        }
      }
      this.msg.msgVisible = false;
    },

    elTurnoEstaOk() {
      let hhmm = moment().format('hh:mm')
      if (this.editado.fecha<moment().format('YYYY-MM-DD') ||
          (this.editado.fecha==moment().format('YYYY-MM-DD') && this.editado.hora<=moment().format('hh:mm')) ||
          this.editado.tercero_id==null || this.editado.articulo_id==null || this.editado.comprobante!=null) {
        this.eteo = false
      } else {
        this.eteo = true
      }
    },
    
    turnosUsados() {
      const usados = []
      let ds = moment(this.editado.fecha).isoWeekday()
      if (ds>=6) {
        this.tx = this.$store.state.turnossd.split('-')
      } else {
        this.tx = this.$store.state.turnoslv.split('-')
      }

      return HTTP().get('/turnosusados/'+this.sucursal+'/'+this.editado.fecha).then(({ data }) => {
        for (let i=0; i<=data[0].length-1; i++) {
          if (((this.tipoEdit=='M') && (this.editado.hora!=data[0][i].hora))||(this.tipoEdit=='N')) {
            usados.push(data[0][i].hora)
          }
        }
//      this.tx = this.tx.filter(x => x.indexOf(usados) == -1 )

        let q = this.tx.filter( function (t) {
          return !usados.includes(t)
        });
        this.tx = q

      })
    },

    intervalFormat() {
      const longOptions = { timeZone: 'UTC', hour12: true, hour: '2-digit', minute: '2-digit' }
      const shortOptions = { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: '2-digit' }
      const shortHourOptions = { timeZone: 'UTC', hour12: true, hour: 'numeric' }
      return longOptions
    },

  },


};
</script>

<style scoped lang="scss">
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
</style> 