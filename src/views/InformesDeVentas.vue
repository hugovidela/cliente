<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        dense
        @click:row="selInforme"
        hide-default-footer
        class="elevation-1">
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
            <v-toolbar-title class="body-1 white--text">Informes de Ventas</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="950px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">

                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cerrarDialog">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>

                  <span class="headdline">{{ informeTitulo }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    @click="generarInforme">
                    Generar Informe
                  </v-btn>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-container>

                      <v-row>
                        <v-col cols="3" sm="3" md="3"
                          v-show="op==1 || op==3 || op==4 || op==5 || op==6 || op==7">
                          <v-text-field
                            autofocus
                            type="date"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.fdesde"
                            label="Fecha Desde">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3"
                          v-show="op==1 || op==3 || op==4 || op==5 || op==6 || op==7">
                          <v-text-field
                            type="date"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.fhasta"
                            label="Fecha Hasta">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3" v-show="op==2">
                          <v-text-field
                            type="month"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.perdesde"
                            label="Período Desde">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3" v-show="op==2">
                          <v-text-field
                            type="month"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.perhasta"
                            label="Período Hasta">
                          </v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6">
                          <v-select
                            v-model="sucSel"
                            :color="temas.forms_titulo_bg"
                            :items="sucLis"
                            filled chips label="Sucursales" multiple
                            return-object>
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
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
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    editado: {
      fdesde: moment().format('YYYY-MM-DD'),
      fhasta: moment().format('YYYY-MM-DD'),
      perdesde: moment().format('YYYY-MM'),
      perhasta: moment().format('YYYY-MM'),
    },
    page: 0,
    pages: 0,
    items: [],
    itemRes: [],
    sucLis: [],
    sucSel: [],
    rows: [],
    op: 0,
    informeTitulo: '',
    footerProps: {'items-per-page-options': [19]},
    headers: [
      { text: 'INFORME', value:'informe' },
    ],

    headersRes: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 120 },
      { text: 'Total', value:'total', align: 'right', width: 120 }
    ],

    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    editedIndex: -1,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapState(['sucursal','sucursales','temas','avatar','empresa','logotipo','codigooid','transition']),
  },
  watch: {
    //dialog (val) {
    //  val || this.cancelar();
    //},
  },
  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
  },
  created () {
    this.items.push(
      {informe: 'VENTAS TOTALES POR DIA Y SUCURSAL'},
      {informe: 'VENTAS TOTALES POR MES Y SUCURSAL'},
      {informe: 'VENTAS TOTALES POR COMPROBANTE'},
      {informe: 'VENTAS DETALLADAS POR COMPROBANTES'},
      {informe: 'VENTAS TOTALES POR ARTICULOS'},
      {informe: 'VENTAS TOTALES POR CLIENTES'},
      {informe: 'RENTABILIDAD BRUTA'},
      {informe: 'TOTALES POR ZONAS'},
      {informe: 'TOTALES POR DIA DE SEMANA'},
      {informe: 'TOTALES POR VENDEDOR ( RESUMIDO )'},
      {informe: 'TOTALES POR VENDEDOR ( DETALLADO )'},
      {informe: 'SEGUIMIENTO DE VENTAS POR CLIENTE'},
//    {informe: 'ESTADISTICAS DE IMPORTES POR MES Y VENDEDORES'},
//    {informe: 'CANTIDAD DE CODIGOS DE ARTICULOS POR CLIENTE'},
//    {informe: 'REMITOS PENDIENTES DE FACTURAR'},
//    {informe: 'INFORME DE COMISIONES PAGAS'},
//    {informe: 'INFORME DE COMISIONES A PAGAR'},
//    {informe: 'LIQUIDACIONES DE PAGOS DE COMISIONES EMITIDAS'},
      )
    this.sucLis = []
    this.sucSel = []
    this.sucursales.forEach(element => {
      this.sucLis.push(element.nombre)
      if (element.id == this.sucursal) {
        this.sucSel.push(element.nombre)
      }
    })
  },

  methods: {
    ...mapMutations(['alert','closeAlert']),
    closeForm(){
      router.push('/')
    },

    selInforme(item, row) {
      this.informeTitulo = item.informe
      this.dialog = true
      if (this.informeTitulo=='VENTAS TOTALES POR DIA Y SUCURSAL') { this.op = 1 }
      else if (this.informeTitulo=='VENTAS TOTALES POR MES Y SUCURSAL') { this.op = 2 }
      else if (this.informeTitulo=='VENTAS TOTALES POR COMPROBANTE') { this.op = 3 }
      else if (this.informeTitulo=='VENTAS DETALLADAS POR COMPROBANTES') { this.op = 4 }
      else if (this.informeTitulo=='VENTAS TOTALES POR ARTICULOS') { this.op = 5 }
      else if (this.informeTitulo=='VENTAS TOTALES POR CLIENTES') { this.op = 6 }
      else if (this.informeTitulo=='RENTABILIDAD BRUTA') { this.op = 7 }
    },

    cerrarDialog() {
      this.dialog = false
    },

    generarInforme(item, row) {
      if (this.informeTitulo=='VENTAS TOTALES POR DIA Y SUCURSAL') {
        return HTTP().post('/infven_totalespordiasucursal', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          let total = 0
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              fecha: moment(data.data[i].fecha).format('DD-MM-YYYY'), 
              sucursal_id: data.data[i].sucursal_id, 
              sucnombre: data.data[i].sucnombre, 
              total: '$'+this.formatoImporte(data.data[i].total),
            })
            total += data.data[i].total
          }
          this.rows.push({fecha: 'TOTAL', sucursal_id: '', sucnombre: '', total: '$'+this.formatoImporte(total) })
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='VENTAS TOTALES POR MES Y SUCURSAL') {

        this.editado.fdesde = this.editado.perdesde+'-01'
        this.editado.fhasta = moment(this.editado.perhasta+'-01').endOf('month').format('YYYY-MM-DD');
        return HTTP().post('/infven_totalespormessucursal', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          let total = 0
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              periodo: moment(data.data[i].per).format('MM-YYYY'), 
              sucursal_id: data.data[i].sucursal_id, 
              sucnombre: data.data[i].sucnombre, 
              total: '$'+this.formatoImporte(data.data[i].total),
            })
            total += data.data[i].total
          }
          this.rows.push({ periodo: 'TOTAL', sucursal_id: '', sucnombre: '', total: '$'+this.formatoImporte(total), })
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='VENTAS TOTALES POR COMPROBANTE') {

        return HTTP().post('/infven_totalesporcomprobantes', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          let total = 0
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              fecha: moment(data.data[i].fecha).format('DD-MM-YYYY'), 
              cpr: data.data[i].cpr,
              tercero_id: data.data[i].tercero_id,
              nombre: data.data[i].nombre,
              total: '$'+this.formatoImporte(data.data[i].total)
            })
            total += data.data[i].total
          }
          this.rows.push({fecha:'TOTAL', cpr:'', tercero_id:'', nombre:'', total:'$'+this.formatoImporte(total)})
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='VENTAS DETALLADAS POR COMPROBANTES') {

        return HTTP().post('/infven_totalesporcomprobantesdetallado', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          let total = 0
          let cpr = ''
          let elCpr = ''
          for (let i=0; i<=data.data.length-1; i++) {
            if (cpr!='') {
              if (data.data[i].cpr == cpr) {
                elCpr = ''
              } else {
                elCpr = data.data[i].cpr
              }
            } else {
              elCpr = data.data[i].cpr
            }
            this.rows.push({
              fecha: moment(data.data[i].fecha).format('DD-MM-YYYY'),
              cpr: elCpr,
              codigo: this.codigooid=='C'?data.data[i].codigo:data.data[i].articulo_id,
              descripcion: data.data[i].descripcion,
              cantidad: data.data[i].cantidad,
              precio: '$'+this.formatoImporte(data.data[i].precio),
              totalitem: '$'+this.formatoImporte(data.data[i].totitem)
            })
            cpr = data.data[i].cpr
            total += data.data[i].totitem
          }
          this.rows.push({fecha:'TOTAL', cpr:'', codigo:'', descripcion:'', cantidad: '', precio: '', totalitem:'$'+this.formatoImporte(total)})
          this.print(this.informeTitulo, this.headersRes, this.rows, 'l' )
        })

      } else if (this.informeTitulo=='VENTAS TOTALES POR ARTICULOS') {

        return HTTP().post('/infven_totalesporarticulos', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              codigo: this.codigooid=='C'?data.data[i].codigo:data.data[i].articulo_id,
              nombre: data.data[i].nombre,
              cantidad: this.formatoImporte(data.data[i].cantidad)
            })
          }
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='VENTAS TOTALES POR CLIENTES') {

        let total = 0
        return HTTP().post('/infven_totalesporclientes', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              codigo: data.data[i].id,
              nombre: data.data[i].nombre,
              total: '$'+this.formatoImporte(data.data[i].total)
            })
            total += data.data[i].total
          }
          this.rows.push({codigo:'TOTAL', nombre:'', total:'$'+this.formatoImporte(total)})
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='RENTABILIDAD BRUTA') {

        let total = 0
        return HTTP().post('/infven_rentabilidadbrutapordia', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              fecha: moment(data.data[i].fecha).format('DD-MM-YYYY'),
              rentabilidad: '$'+this.formatoImporte(data.data[i].rentabilidad)
            })
            total += data.data[i].rentabilidad
          }
          this.rows.push({fecha:'TOTAL', rentabilidad:'$'+this.formatoImporte(total)})
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='TOTALES POR ZONAS') {
      } else if (this.informeTitulo=='TOTALES POR DIA DE SEMANA') {
      } else if (this.informeTitulo=='TOTALES POR VENDEDOR ( RESUMIDO )') {
      } else if (this.informeTitulo=='TOTALES POR VENDEDOR ( DETALLADO )') {
      } else if (this.informeTitulo=='SEGUIMIENTO DE VENTAS POR CLIENTE') {
      }
    },


    print(informeTitulo, headersRes, itemRes, orientacion ) {
      var doc = new jsPDF(orientacion, 'pt')  // 'p' normal 'l' horizontal ( landscape )
      this.page = 1
      this.pages = Math.trunc(this.rows.length/44)+1
      this.cabecera(informeTitulo, doc, orientacion)
      this.detalles(informeTitulo, doc, orientacion)
      
      debugger
      doc.output ('dataurlnewwindow')
    },

    cabecera(informeTitulo, doc, orientacion) {
      const des = this.editado.fdesde.substr(8,2)+'/'+this.editado.fdesde.substr(5,2)+'/'+this.editado.fdesde.substr(0,4)
      const has = this.editado.fhasta.substr(8,2)+'/'+this.editado.fhasta.substr(5,2)+'/'+this.editado.fhasta.substr(0,4)
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

      if (informeTitulo=='VENTAS TOTALES POR DIA Y SUCURSAL') {
        doc.text ( 'Fecha', 40, 115 )
        doc.text ( 'Sucursal', 95, 115 )
        doc.text ( 'Total', 550, 115 )
        doc.line( 40, 121, 570, 121)
      } else if (informeTitulo=='VENTAS TOTALES POR MES Y SUCURSAL') {
        doc.text ( 'Período', 40, 115 )
        doc.text ( 'Sucursal', 95, 115 )
        doc.text ( 'Total', 550, 115 )
        doc.line( 40, 121, 570, 121)
      } else if (informeTitulo=='VENTAS TOTALES POR COMPROBANTE') {
        doc.text ( 'Fecha', 40, 115 )
        doc.text ( 'Comprobante', 95, 115 )
        doc.text ( 'Cliente', 200, 115 )
        doc.text ( 'Nombre', 240, 115 )
        doc.text ( 'Total', 550, 115 )
        doc.line( 40, 121, 570, 121)
      } else if (informeTitulo=='VENTAS DETALLADAS POR COMPROBANTES') {
        doc.text ( 'Fecha', 40, 115 )
        doc.text ( 'Comprobante', 100, 115 ) //40 
        doc.text ( this.codigooid=='C'?'Código':'ID', 205, 115 ) //150
        doc.text ( 'Descripción', 280, 115 )  // 250
        doc.text ( 'Cantidad', 570, 115 )
        doc.text ( 'Precio', 675, 115 )
        doc.text ( 'Total', 780, 115 )
        doc.line( 40, 121, 800, 121)
      } else if (informeTitulo=='VENTAS TOTALES POR ARTICULOS') {
        doc.text ( this.codigooid=='C'?'Código':'ID', 40, 115 )
        doc.text ( 'Nombre', 140, 115 )
        doc.text ( 'Cantidad', 532, 115 )
        doc.line( 40, 121, 570, 121)
      } else if (this.informeTitulo=='VENTAS TOTALES POR CLIENTES') {
        doc.text ( this.codigooid=='C'?'Código':'ID', 40, 115 )
        doc.text ( 'Nombre', 120, 115 )
        doc.text ( 'Total', 550, 115 )
        doc.line( 40, 121, 570, 121)
      } else if (this.informeTitulo=='RENTABILIDAD BRUTA') {
        doc.text ( 'Fecha', 40, 115 )
        doc.text ( 'Rentabilidad', 520, 115 )
        doc.line( 40, 121, 570, 121)
      }

    },


    detalles(informeTitulo, doc, orientacion) {
      let f = 135
      let topDown = orientacion == 'p' ? 780 : 540
      let topWidth = orientacion == 'p' ? 570 : 800
      for (let i=0; i<=this.rows.length-1; i++) {
        if (i==this.rows.length-1) {
          doc.line( 40, f-8, topWidth, f-8)
          f+=5
        }
        if (informeTitulo=='VENTAS TOTALES POR DIA Y SUCURSAL') {
          doc.text ( this.rows[i].fecha, 40, f )
          doc.text ( this.rows[i].sucursal_id.toString(), 130, f, 'right' )
          doc.text ( this.rows[i].sucnombre, 180, f, 'right' )
          doc.text (this.rows[i].total.toString(), 570, f, 'right' )
        } else if (informeTitulo=='VENTAS TOTALES POR MES Y SUCURSAL') {
          doc.text ( this.rows[i].periodo, 40, f )
          doc.text ( this.rows[i].sucursal_id.toString(), 130, f, 'right' )
          doc.text ( this.rows[i].sucnombre, 180, f, 'right' )
          doc.text (this.rows[i].total.toString(), 570, f, 'right' )
        } else if (informeTitulo=='VENTAS TOTALES POR COMPROBANTE') {
          doc.text ( this.rows[i].fecha, 40, f )
          doc.text ( this.rows[i].cpr, 95, f )
          doc.text (this.rows[i].tercero_id.toString(), 229, f, 'right')
          doc.text (this.rows[i].nombre, 240, f )
          doc.text (this.rows[i].total.toString(), 570, f, 'right' )
        } else if (informeTitulo=='VENTAS DETALLADAS POR COMPROBANTES') {
          doc.text ( this.rows[i].fecha, 40, f )  //40
          doc.text ( this.rows[i].cpr, 100, f )  //40
          debugger
          doc.text (this.rows[i].codigo.toString(), 205, f )  //155
          doc.text (this.rows[i].descripcion, 280, f) //250
          doc.text (this.rows[i].cantidad.toString(), 605, f, 'right' )
          doc.text (this.rows[i].precio.toString(), 700, f, 'right' )
          doc.text (this.rows[i].totalitem.toString(), 800, f, 'right' )
        } else if (informeTitulo=='VENTAS TOTALES POR ARTICULOS') {
          doc.text (this.rows[i].codigo.toString(), 40, f )
          doc.text (this.rows[i].nombre, 140, f )
          doc.text (this.rows[i].cantidad.toString(), 570, f, 'right' )
        } else if (this.informeTitulo=='VENTAS TOTALES POR CLIENTES') {
          doc.text (this.rows[i].codigo.toString(), 40, f )
          doc.text (this.rows[i].nombre, 120, f )
          doc.text (this.rows[i].total.toString(), 570, f, 'right' )
        } else if (this.informeTitulo=='RENTABILIDAD BRUTA') {
          doc.text (this.rows[i].fecha, 40, f )
          doc.text (this.rows[i].rentabilidad.toString(), 570, f, 'right' )
        }
        f+=15
        if (f>topDown && i<this.rows.length-1) {
          doc.addPage()
          this.page ++
          this.cabecera(informeTitulo, doc, orientacion)
          f=135
        }
      }
    },

    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = this.modelo
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
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

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

  },
};
</script>
