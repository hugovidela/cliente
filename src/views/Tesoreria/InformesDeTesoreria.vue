<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        dense
        @click:row="selInforme"
        class="elevation-1"
        hide-default-footer>
        <template v-slot:top>
          <v-toolbar
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              icon @click="closeForm">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <v-toolbar-title class="fg white--text">Informes de Tesoreria</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="450px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="dialog=false">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="fg">{{ informeTitulo }}</span>
                  <v-spacer></v-spacer>
                  <v-btn class="fg85"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    @click="generarInforme">
                    Generar Informe
                  </v-btn>
                </v-toolbar>
                <v-form ref="form">
                  <v-card-text class="fg">
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            autofocus
                            type="date"
                            v-model="fdesde"
                            :color="temas.forms_btn_editar_bg"
                            label="Fecha Desde">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            type="date"
                            v-model="fhasta"
                            :color="temas.forms_btn_editar_bg"
                            label="Fecha Hasta">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row class="pt-0">
                        <v-col cols="6" sm="12">
                          <span class="pl-4 pb-4">
                            <b>Formas de Comercialización a Consultar</b>
                          </span>
                          <v-data-table
                            v-model="selected"
                            :headers="headersFp"
                            :items="forPagItems"
                            :single-select="false"
                            item-key="id"
                            show-select dense
                            class="elevation-1"
                            @item-selected="selArtClick"
                            @toggle-select-all="selectAll"
                            hide-default-footer>
                          </v-data-table>
                        </v-col>
                      </v-row>

                      <v-row class="pt-0 pb-0">
                        <v-radio-group v-model="ie"
                          row class="pt-0 pl-4"
                          @change="selEstadoDeValores()">
                          <v-radio label="Entrantes" value="e"></v-radio>
                          <v-radio label="Salientes" value="s"></v-radio>
                          <v-radio label="Ambas" value="a"></v-radio>
                        </v-radio-group>
                        <v-checkbox class="pt-0 pl-4"
                          :disabled="!selCartera"
                          v-model="enCartera"
                          label="Solo Cheques en Cartera">
                        </v-checkbox>
                        <v-checkbox class="pt-0 pl-4"
                          :disabled="!selCartera"
                          v-model="enviarAExcel"
                          label="Enviar a Excel">
                        </v-checkbox>
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
import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import moment from 'moment';
import Confirmacion from "./../Forms/confirmacion.vue"
import XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  components: {
    Confirmacion,
  },
  data: () => ({
    ie: 'e',
    selCartera: false,
    enCartera: false,
    enviarAExcel: false,
    informeTitulo: '',
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    fdesde: moment().format('YYYY-MM-DD'),
    fhasta: moment().format('YYYY-MM-DD'),
    items: [],
    itemRes: [],
    rows: [],
    forPagItems: [],
    forPagValue: [],
    selected: [],
    op: 0,
    dialog: false,
    headers: [
      { text: 'Informes', value:'informe' },
    ],
    headersFp: [
      { text: 'Abrev', value:'abrev', align: 'left', width: 40 },
      { text: 'Nombre', value:'nombre', align: 'left', width: 100 }
    ],
    headersRes: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 120 },
      { text: 'Total', value:'total', align: 'right', width: 120 }
    ],
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapState(['sucursal','sucursales','empresa','temas', 'transition']),
  },

  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
  },

  created () {
    this.items.push({informe: 'Movimientos de Tesorería'})
      return HTTP().get('/mediosdepagosmenosctacte').then((data) => {
        for (let i=0; i<=data.data.length-1; i++) {
          if (data.data[i].id!=4&&data.data[i].id!=9&&data.data[i].id!=10) {
            this.forPagItems.push({
              id: data.data[i].id,
              abrev: data.data[i].abrev,
              nombre: data.data[i].nombre
            })
          }
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
      this.informeTitulo = 'Movimientos de Tesorería'
      this.op = 1
    },

    selArtClick (item) {
      if (item.item.id==6) {
        this.selCartera = item.value&&(this.ie=='e'||this.ie=='a')
      }
    },

    selEstadoDeValores() {
      this.selCartera = false
      if (this.ie=='e'||this.ie=='a') {
        let pos = this.selected.findIndex(x=>x.id==6)
        if (this.selected.findIndex(x=>x.id==6)!=-1) {
          this.selCartera = true
        }
      } else if (this.ie=='s') {
        this.enCartera = false
      }
    },

    selectAll(event) {
      this.selCartera = event.value&&(this.ie=='e'||this.ie=='a')
    },

    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = 'cheques'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },

    generarInforme(item, row) {
      if (this.informeTitulo=='Movimientos de Tesorería') {
        return HTTP().post('/inftes_movimientos', {
          enCartera:this.enCartera, suc:this.sucursal, fdes: this.fdesde,fhas: this.fhasta,fp: this.selected,es: this.ie
        }).then((data) => {

          //this.dialog = false
          let hoy = moment()
          this.rows = []
          for (let i=0; i<=data.data.length-1; i++) {

            let dest = ''
            if (data.data[i].observaciones!=null) {
              if (data.data[i].tercerodestino==null) {
                dest = data.data[i].observaciones
              } else {
                dest = data.data[i].tercerodestino
              }
            } else {
              dest = data.data[i].tercerodestino
            }

            this.rows.push({
              abrev: data.data[i].abrev,
              cpr: data.data[i].cpr1!=null?data.data[i].cpr1:data.data[i].cpr2,
              fecha: moment(data.data[i].fechafinanciera).format('DD-MM-YYYY'),
              fechasalida: data.data[i].fechasalida!=null?moment(data.data[i].fechasalida).format('DD-MM-YYYY'):null,
              dias: hoy.diff(data.data[i].fechafinanciera, 'days'),
              nrovalor: data.data[i].nrovalor,
              codigo: data.data[i].codigo,
              bannom: data.data[i].bannom,
              cuenta: data.data[i].cuenta,
              ternom: data.data[i].ternom,
              observ: data.data[i].observ,
              origen: data.data[i].terceroorigen,
              destino: dest,
              importe: data.data[i].importe,
            })
          }

          if (this.enviarAExcel) {
            this.exportExcel()
          } else {
            this.print(this.informeTitulo, this.rows )
          }

        })
      }
    },

    print(informeTitulo, item) {
      var doc = new jsPDF('l', 'pt')  // 'p' normal 'l' horizontal ( landscape )
      this.cabecera(informeTitulo, doc, 'l', item)
      this.detalles(doc, 'l', item)
      doc.output ('dataurlnewwindow')
    },

    cabecera(informeTitulo, doc, orientacion, item) {
      let des = moment(this.fdesde).format('DD/MM/YYYY')
      let has = moment(this.fhasta).format('DD/MM/YYYY')
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
      doc.text ( 'Desde: '+des, 180, 67 )
      doc.text ( 'Hasta: '+has, 260, 67 )

    },

    detalles(doc, orientacion, item) {
      let f = 90
      let h = 550
      let totMovs = 0
      doc.setFontSize(8);
      f = this.cp(f, 15, 50, h, doc)
      doc.setFont(undefined,"bold")
      doc.text ( 'MOVIMIENTOS DE TESORERIA', 30, f )
      doc.setFont(undefined,"normal")
      f = this.cp(f, 15, 50, h, doc)
      doc.text ( 'FP', 30, f )
      doc.text ( 'Cpr', 45, f )
      doc.text ( 'Detalles', 100, f )
      doc.text ( 'Origen', 385, f )
      doc.text ( 'Destino', 535, f )
      doc.text ( 'Importe', 741, f );
      f = this.cp(f, 5, 50, h, doc)
      doc.line( 30, f, 770, f);
      f = this.cp(f, 10, 50, h, doc)
      doc.setFontSize(6);
      for (let i=0; i<=item.length-1; i++) {

        if ( item[i].fechasalida!=null) {
          doc.text ( item[i].fechasalida , 635, f )  
        }

        doc.text ( item[i].abrev, 30, f )
        doc.text ( this.kit.cpr(item[i].cpr), 45, f )
        doc.text ( item[i].observ, 100, f )
        doc.text ( item[i].origen||'', 385, f )
        doc.text ( item[i].destino||'', 535, f )

        doc.text ( '$'+this.formatoImporte(item[i].importe), 769, f, 'right' );
        f = this.cp(f, 10, 50, h, doc)
        totMovs += item[i].importe
      }
      f = this.cp(f, -5, 50, h, doc)
      doc.line( 30, f, 770, f);
      f = this.cp(f, 8, 50, h, doc)
      doc.text ( 'Total', 30, f )
      doc.text ( '$'+this.formatoImporte(totMovs), 769, f, 'right' );

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

    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.rows)
      const workbook = XLSX.utils.book_new()
      const filename = 'cheques'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrar(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS')
          this.exportExcel()
      }
      this.msg.msgVisible = false;
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

    /*
    print(informeTitulo, headersRes, itemRes, orientacion ) {
      var doc = new jsPDF(orientacion, 'pt')  // 'p' normal 'l' horizontal ( landscape )
      const totalPagesExp = '{total_pages_count_string}'
      const emp = this.empresa
      const tit = informeTitulo
      const des = this.fdesde.substr(8,2)+'/'+this.fdesde.substr(5,2)+'/'+this.fdesde.substr(0,4)
      const has = this.fhasta.substr(8,2)+'/'+this.fhasta.substr(5,2)+'/'+this.fhasta.substr(0,4)
      // ESTE ANDA PERO NO MUESTRA LA PAGINA
      doc.autoTable(headersRes, itemRes, {
        didDrawPage: function (data) {
          // Footer
          var str = "Página " + doc.internal.getNumberOfPages()
          if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
          }
          doc.setFontSize(14);
          doc.text ( emp, 40, 47 )           // COL, FIL
          doc.setFontSize(16);
          doc.text ( tit, 180, 47 )
          doc.setFontSize(8);
          doc.text ( 'gohu', orientacion == 'p' ? 565 : 785, 15 )
          doc.setFontSize(9);
          doc.text ( 'Desde:'+des, 180, 67 )
          doc.text ( 'Hasta:'+has, 260, 67 )

          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        },
        margin: {top: 100, bottom: 15},
        headStyles: {
          fillColor: [23, 23, 23], fontSize: 8,
        },
        styles: {
          fillColor: [236, 233, 223], fontSize: 8,
        },
        showHeader: true,
        columnStyles: {
          bannom: { cellWidth: 130 },
          cantidad: { halign: 'right', width: 160, },
          precio: { halign: 'right', width: 160, },
          totalitem: { halign: 'right', width: 160, },
          rentabilidad: { halign: 'right', width: 160, },
          total: { halign: 'right', width: 160, },
          importe: { halign: 'right', width: 160, },
          styles: {fillColor: [100, 255, 255], fontSize: 8 },
          columnStyles: { id: {fillColor: 125} },
        },
      });
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      doc.output ('dataurlnewwindow')
    }
    */

  },
};
</script>

<style scoped>
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
// 439