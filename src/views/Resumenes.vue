<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="items"
        @toggle-select-all="selectAll"
        :single-select="false"
        :search="search"
        item-key="tercero_id"
        show-select
        dense
        class="fg pl-1 pr-3 elevation-1 pt-2"
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
                    :color="tipoDeDeuda=='T'?'blue':temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="queTipoDeDeudaVer('T')" v-on="on">
                    <v-icon>mdi-emoticon-neutral</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Todas las cuentas</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="tipoDeDeuda=='S'?'blue':temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="queTipoDeDeudaVer('S')" v-on="on">
                    <v-icon>mdi-emoticon</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Solo con Saldos</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="tipoDeDeuda=='V'?'blue':temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="queTipoDeDeudaVer('V')" v-on="on">
                    <v-icon>mdi-emoticon-sad</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Saldos Vencidos</span>
              </v-tooltip>
              <v-tooltip bottom v-if="selected.length">
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="cualInforme='1'; dialog=true" v-on="on">
                    <v-icon>mdi-format-list-bulleted</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Informes</span>
              </v-tooltip>
            </template>
            <v-toolbar-title class="white--text">{{tituloResumen}}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- DIALOGO DE FECHAS -->
            <v-dialog v-model="dialog" max-width="500px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card class="fg">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cualInforme='0'; dialog=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    Resúmen de Cuentas
                  </span>
                  <v-spacer></v-spacer>
                  <span class="text--right">
                    <v-btn v-if="(fechaDesde<=fechaHasta || cualInforme==='1')"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="print()">
                      Confirmar
                    </v-btn>
                  </span>
                </v-toolbar>
                <v-form>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12">
                          <v-radio-group
                            v-model="cualInforme">
                            <v-radio
                              label="Solo pendientes" value='1'>
                            </v-radio>
                            <v-radio
                              label="Todos los Movimientos" value='2'>
                            </v-radio>
                            <!--
                            <v-radio
                              label="Detallado Valores" value='3'>
                            </v-radio>
                            -->
                          </v-radio-group>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            outlined autofocus type="date"
                            :disabled="cualInforme=='1'"
                            :color="temas.cen_btns_bg"
                            v-model="fechaDesde"
                            label="Fecha Desde">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            outlined type="date"
                            :disabled="cualInforme=='1'"
                            :color="temas.cen_btns_bg"
                            v-model="fechaHasta"
                            label="Fecha Hasta">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- ASIGNAR TERCEROS -->

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
        <template v-slot:item.activo="{ item }">
          <v-chip :color="getColor(item.activo)" dark>{{ item.activo ? 'Sí' : 'No' }}</v-chip>
        </template>
        <template v-slot:item.saldo="{ item }">
          $ {{ formatoImporte(item.saldo,2) }}
        </template>
        <template v-slot:item.vencido="{ item }">
          $ {{ formatoImporte(item.vencido,2) }}
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
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    fechaDesde: moment().format('YYYY-MM-DD'),
    fechaHasta: moment().format('YYYY-MM-DD'),
    selected: [],
    modelo: '',
    cualInforme: '1',
    cual: '',
    tituloResumen: '',
    tipoDeDeuda: 'T',
    acciones: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    items: [],
    headers: [
      { text: 'CLIENTE', value:'tercero_id', width: 110},
      { text: 'NOMBRE', value:'nombre', width: 500},
//    { text: 'SUCURSAL', value:'sucnom', width: 200},
      { text: 'SALDO', value:'saldo', width: 160, align: 'end'},
    ],
    formTitle: '',
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState(['sucursal','empresa', 'tema', 'temas', 'logotipo','transition']),
  },
  watch: {
    '$route.path': function(val, oldVal){
      this.init_component();
    },
    '$store.state.sucursal' () {
      this.init_component()
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
      let a = this.$store.state.route.fullPath.substring(1,this.$store.state.route.fullPath.length)
      if (a=='resumenesclientes') {
        this.cual = 'C'
        this.tituloResumen = 'Resúmen de Cuentas Clientes'
        this.headers[0].text = 'Cliente'
      } else {
        this.cual = 'P'
        this.tituloResumen = 'Resúmen de Cuentas Proveedores'
        this.headers[0].text = 'Proveedor'
      }
      this.modelo = a;
      this.listarHTTP();
    },

    queTipoDeDeudaVer(cual) {
      this.tipoDeDeuda = cual

      if (cual=='T'||cual=='S') {
        this.headers = [
          { text: 'CLIENTE', value:'tercero_id', width: 110},
          { text: 'NOMBRE', value:'nombre', width: 500},
//          { text: 'SUCURSAL', value:'sucnom', width: 200},
          { text: 'SALDO', value:'saldo', width: 160, align: 'end'},
        ]
      } else {
        this.headers = [
          { text: 'CLIENTE', value:'tercero_id', width: 110},
          { text: 'NOMBRE', value:'nombre', width: 500},
//        { text: 'SUCURSAL', value:'sucnom', width: 200},
          { text: 'SALDO', value:'saldo', width: 160, align: 'end'},
          { text: 'VENCIDO', value:'vencido', width: 160, align: 'end'},
        ]
      }
      this.listarHTTP();
    },

    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = this.modelo
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },

    print() {
      
      let rangoDeFechas = [{fecha: this.fechaDesde}, {fecha: this.fechaHasta}]
      let detallado = false
      let tipodeuda = 'T'

      debugger
      if (this.cualInforme=='0') {
        if (this.cual==1) {
          rangoDeFechas[0].fecha = '1900-12-31'
          rangoDeFechas[1].fecha = '2200-12-31'
        } 
      }
      if (this.cualInforme=='1') {         // solo pendientes
        rangoDeFechas[0].fecha = '1900-12-31'
        rangoDeFechas[1].fecha = '2200-12-31'
        detallado = true
        tipodeuda = 'S'
      } else if (this.cualInforme=='2') {  // todos los movimientos
        rangoDeFechas[0].fecha = moment(this.fechaDesde).format('YYYY-MM-DD')
        rangoDeFechas[1].fecha = moment(this.fechaHasta).format('YYYY-MM-DD')
        detallado = true
        tipodeuda = 'T'
      } 

      debugger
      return HTTP().post('/infven_cuentascorrientes', {
        tipinf: this.cualInforme,
        terceros:this.selected,
        clipro:this.cual,
        sucursal:this.sucursal,
        fec:rangoDeFechas,
        tipodeuda:tipodeuda,
        detallado:detallado }).then((data) => {
        
        debugger
        if (data.data.length) {
          let orientacion = 'p'
          let informeTitulo = ''
          if (this.cual == 'C') {
            informeTitulo = 'Cuenta Corriente Clientes'
          } else {
            informeTitulo = 'Cuenta Corriente Proveedores'
          }
          let doc = new jsPDF(orientacion, 'pt')  // 'p' normal 'l' horizontal ( landscape )
          this.page = 1
          this.pages = Math.trunc(this.items.length/44)+1
          this.cabecera(this.cualInforme, informeTitulo, doc, orientacion)
          this.detalles(this.cualInforme, informeTitulo, doc, orientacion, data.data)
          doc.output ('dataurlnewwindow')
        } else {
          this.mensaje('¡No hay movimientos en el período especificado!', this.temas.forms_titulo_bg, 2500)
        }
      })
    },

    cabecera(tipInf, informeTitulo, doc, orientacion) {
      debugger
      let topDown = orientacion == 'p' ? 810 : 580
      let topWidth = orientacion == 'p' ? 527 : 777
      let av = ''
      if (this.logotipo==null) {
        av = '../images/Sin Imagen.jpg'
      } else {
        av = '../images/'+this.logotipo
      }
      var img = new Image()
      img.src = av
      doc.addImage(img, 'jpg', 40, 28, 122, 45)
      doc.setFontSize(8);
      doc.text ( 'gohu', 550, 14 )
      doc.setFontSize(8);
      doc.text ( 'Fecha: '+moment().format('L'), 40, 90 )
      doc.setFontSize(15);
      doc.text ( informeTitulo, 180, 45 )
      doc.setFontSize(9);
      doc.text ( 'Desde:'+moment(this.fechaDesde).format('DD/MM/YYYY'), 180, 67 )
      doc.text ( 'Hasta:'+moment(this.fechaHasta).format('DD/MM/YYYY'), 260, 67 )
      doc.text ( 'Página '+this.page.toString()+'/'+this.pages.toString(), topWidth, topDown )
      
      if (tipInf==='1') {

        doc.setFontSize(12);
        doc.text ( 'PENDIENTES', 180, 90 )
        doc.setFontSize(8);

        doc.text ( 'Cuenta', 40, 115 )
        doc.text ( 'Vencimiento', 80, 115 )
        doc.text ( 'Comprobante', 145, 115 )
        doc.text ( 'Pendiente', 440, 115 )
        doc.text ( 'Saldo', 545, 115 )
        doc.line( 40, 121, 570, 121)

      } else if (tipInf==='2') {

        doc.setFontSize(12);
        doc.text ( 'TODOS LOS MOVIMIENTOS', 180, 90 )
        doc.setFontSize(8);

        doc.text ( 'Cuenta', 40, 115 )
        doc.text ( 'Nombre', 80, 115 )
        doc.text ( 'Fecha', 81, 130 )
        doc.text ( 'Comprobante', 145, 130 )
        doc.text ( 'Debe', 347, 132 )
        doc.text ( 'Haber', 445, 132 )
        doc.text ( 'Saldo', 549, 132 )
        doc.line( 40, 121, 570, 121)
      }
    },

    detalles(tipInf, informeTitulo, doc, orientacion, data) {
      
      debugger
      let f = tipInf==1?135:145;
      let topDown = orientacion == 'p' ? 780 : 540
      let saldo = 0
      let total = 0
      let general = 0

      debugger
      if (tipInf==1||tipInf==2) {      // SOLO PENDIENTES O TODOS CON SALDO ANTERIOR
        for (let i=0; i<=data.length-1; i++) {
          
          saldo = 0;
          
          doc.setFontSize(9);
          doc.setFont(undefined, 'bold')
          doc.text ( data[i].tercero_id.toString(), 70, f, 'right' )
          doc.text ( data[i].nombre, 80, f, 'left' )
          if (tipInf==2) {
            doc.text ( this.formatoImporte(data[i].saldoanterior.toString()), 570, f, 'right' )
            saldo = data[i].saldoanterior
          }
          doc.setFontSize(9);
          doc.setFont(undefined, 'normal');
          f += 5;

          if (tipInf==1) {
            data[i].det.sort((o1, o2) => {
              if (o1.vencimiento>o2.vencimiento) { return 1; }
              else if (o1.vencimiento<o2.vencimiento) { return -1; } 
              else { return 0; }
            })
          } else {
            data[i].det.sort((o1, o2) => {
              if (o1.fecha>o2.fecha) { return 1; }
              else if (o1.fecha<o2.fecha) { return -1; } 
              else { return 0; }
            })
          }

          if (tipInf==2) {
            total = data[i].saldoanterior
            general += data[i].saldoanterior
          }

          for (let j=0; j<=data[i].det.length-1; j++) {

            if (tipInf==1) {

              // solo pendientes
              if (data[i].det[j].pendiente!=0) {
                f+=10
                doc.text ( moment(data[i].det[j].vencimiento.substring(0,10)).format('DD/MM/YYYY'), 80, f, 'left' )
                doc.text ( data[i].det[j].cpr, 145, f )
                doc.text ( this.formatoImporte(data[i].det[j].pendiente.toString()), 480, f, 'right' )
                saldo += (data[i].det[j].pendiente)
                total += (data[i].det[j].pendiente)
                general += Math.abs(data[i].det[j].pendiente)
                doc.text ( this.formatoImporte(saldo.toString()), 570, f, 'right' )
                f+=4
                if (f>topDown && i<data[i].det.length-1) {
                  doc.addPage()
                  this.page ++
                  this.cabecera(tipInf, informeTitulo, doc, orientacion)
                  f=135
                }
              }

            } else {
              
              // detallado
              f+=10
              doc.text ( moment(data[i].det[j].fecha.substring(0,10)).format('DD/MM/YYYY'), 80, f, 'left' )
              doc.text ( data[i].det[j].cpr, 145, f )
              if (data[i].det[j].debe!=0) {
                doc.text ( this.formatoImporte(data[i].det[j].debe.toString()), 367, f, 'right' )
              } else {
                doc.text ( this.formatoImporte(data[i].det[j].haber.toString()), 467, f, 'right' )
              }
              saldo += (Math.abs(data[i].det[j].debe)-Math.abs(data[i].det[j].haber))
              total += (Math.abs(data[i].det[j].debe)-Math.abs(data[i].det[j].haber))
              general += (Math.abs(data[i].det[j].debe)-Math.abs(data[i].det[j].haber))
              doc.text ( this.formatoImporte(saldo.toString()), 570, f, 'right' )
              f+=4
              if (f>topDown && i<data[i].det.length-1) {
                doc.addPage()
                this.page ++
                this.cabecera(tipInf, informeTitulo, doc, orientacion)
                f=135
              }

            }

          }
          f += 15
        }
        f += 5
        doc.line( 40, f, 570, f)
        f += 15
        doc.text ( 'TOTAL', 452, f )
        doc.setFont(undefined, 'bold')
        doc.text ( this.formatoImporte(general.toString()), 570, f, 'right' )
        doc.setFont(undefined, 'normal')
      }
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS')
          this.exportExcel()
      }
      this.msg.msgVisible = false;
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    getColor (activo) {
      return (activo === 1) ? 'green' : 'orange'
    },

    listarHTTP:function() {

      // las fechas
      let fecDes = '1990-01-01'
      let fecHas = '2190-12-31'
      /*
      if (this.tipoDeDeuda=='T' || this.tipoDeDeuda=='S') {
        fecHas = '2190-12-31'
      } else if (this.tipoDeDeuda=='V') {
        fecHas  = moment().subtract(1, 'days').format('YYYY-MM-DD')
      }
      */
      let rangoDeFechas = [{fecha: fecDes}, {fecha: fecHas}]

      this.selected = []

      /*
        this.tipoDeDeuda
        'T' Todas las cuentas
        'S' Solo con saldos
        'V' Saldos vencidos
      */

      debugger
      return HTTP().post('/'+this.modelo, {
        terceros: [],                               // id del tercero o [] todos
        clipro:this.cual,                           // clipro 'C' clientes, 'P' proveedores
        sucursal:this.sucursal,
        fec:rangoDeFechas,
        tipodeuda: this.tipoDeDeuda,
        detallado: false }).then(({data})=>{

        debugger
        this.items = data;
        let saldo = 0
        for (let i=0; i<=data.length-1; i++) {
          saldo += data[i].saldo
        }
        if (this.cual == 'C') {
          this.tituloResumen = 'Resúmen de Cuentas Clientes - Saldo total:  $'+this.formatoImporte(saldo,2)
        } else {
          this.tituloResumen = 'Resúmen de Cuentas Proveedores - Saldo Total:  $'+this.formatoImporte(saldo,2)
        }
      });
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

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    selectAll(event) {
      if (event.value) {
        this.selected = this.items
      } else {
        this.selected = []
      }
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