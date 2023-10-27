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

            <v-btn icon
              @click="closeForm"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <v-toolbar-title class="body-1 white--text">Informes de Stocks</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="1250px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">

                  <v-btn icon
                    @click="cerrarDialog"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>

                  <span class="headdline">{{ informeTitulo }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="teal accent-4"
                    class="ma-2 white--text"
                    @click="generarInforme">
                    Generar Informe
                  </v-btn>
                  <v-progress-linear v-if="progress==true"
                    class="mt-2"
                    height="10"
                    indeterminate
                    :color="temas.barra_principal_bg">
                  </v-progress-linear>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="3" sm="3" md="3" v-show="op==1">
                          <v-text-field
                            autofocus
                            type="date"
                            v-model="editado.fdesde"
                            label="Fecha Desde">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==1">
                          <v-text-field
                            type="date"
                            v-model="editado.fhasta"
                            label="Fecha Hasta">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==3">
                          <v-text-field
                            type="month"
                            v-model="editado.perdesde"
                            label="Período Desde">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==3">
                          <v-text-field
                            type="month"
                            v-model="editado.perhasta"
                            label="Período Hasta">
                          </v-text-field>
                        </v-col>

                        <v-col cols="6" sm="6" class="pt-0 pb-0">
                          <v-select
                            v-model="sucSel"
                            :items="sucLis"
                            filled chips label="Sucursales" multiple
                            return-object>
                          </v-select>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="2" sm="2" class="pt-0 pb-0">
                          <v-select
                            v-model="rubro"
                            :items="rubItems"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="nombre"
                            label="Rubro..."
                            outlined return-object multiselects
                            class="pt-2"
                            @change="filtrar()">
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" class="pt-0 pb-0">
                          <v-select
                            v-model="prov"
                            :items="provItems"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="nombre"
                            label="Proveedor"
                            outlined
                            class="pt-2"
                            @change="filtrar()">
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" class="pt-0 pb-0">
                          <v-autocomplete
                            class="pt-2 body-2"
                            v-model="marca"
                            :color="temas.forms_titulo_bg"
                            :items="itemsMarcasFil"
                            :loading="isLoadingMarcasFil"
                            :search-input.sync="searchMarcasFil"
                            item-text="nombre"
                            item-value="id"
                            label="Marca"
                            outlined
                            clearable
                            @change="filtrar()"
                            placeholder="Escriba para buscar">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="6" sm="6" class="pt-2 pb-0">
                          <v-card outlined class="pt-2 pb-1">
                            <span class="pl-2">Grupos</span>
                            <v-chip
                              class="ma-1"
                              @click="clickEnGrupo">
                              {{ nombreDelGrupo }}
                            </v-chip>
                          </v-card>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="12" class="pt-0 pb-0">
                          <v-data-table
                            v-model="selected"
                            :headers="headersArt"
                            :items="articulos"
                            @toggle-select-all="selectAll"
                            :single-select="false"
                            :search="search"
                            item-key="codigo"
                            show-select
                            dense
                            :footer-props="footerProps"
                            class="pl-1 pr-3 elevation-1 pt-2">
                            <template v-slot:top>
                              <v-text-field
                                v-model="search"
                                :color="temas.forms_titulo_bg"
                                append-icon="search"
                                label="Buscar"
                                single-line hide-details>
                              </v-text-field>
                            </template>
                            <template #item.nombre="{ value }">
                              <div class="text-truncate" style="max-width: 320px">
                                {{ value }}
                              </div>
                            </template>
                            <template v-slot:item.seleccionado="{ item }">
                              <v-chip
                                :color="getColor(item.seleccionado)"
                                dark>{{item.seleccionado?'Sí':'No'}}
                              </v-chip>
                            </template>
                          </v-data-table>
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

      <!-- SELECCION DE GRUPOS-->
      <v-dialog v-model="dialogGrupos" max-width="600px" max-height="600px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="cancelarDialogGrupos">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span>Seleccione los Grupos</span>
            <v-spacer></v-spacer>
            <v-btn
              @click="aceptarGrupos"
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="ma-2 white--text">
              Aceptar
            </v-btn>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-card max-width="600"
                  style="height: 545px;"
                  v-scroll.self="onScroll"
                  class="overflow-y-auto"
                  max-height="600">
                  <v-card-text>
                    <v-treeview
                      v-model="selection"
                      return-object
                      selectable
                      open-all
                      item-key="id"
                      hoverable activatable dense
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      :items="itemsTreeGrupos">
                    </v-treeview>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN SELECCION DE GRUPOS -->

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
    scrollInvoked: 0,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    editado: {
      fdesde: moment().format('YYYY-MM-DD'),
      fhasta: moment().format('YYYY-MM-DD'),
      perdesde: moment().format('YYYY-MM'),
      perhasta: moment().format('YYYY-MM'),
    },
    artConMovs: [],
    items: [],
    itemRes: [],
    sucLis: [],
    sucSel: [],
    rows: [],
    articulos: [],
    rubItems: [],
    provItems: [],
    marItems: [],
    gruItems: [],
    rubro: '',
    marca: '',
    prov: '',
    selection: [],
    selected: [],
    nombreDelGrupo: 'Sel.grupos',
    itemsTreeGrupos: [],
    dialogGrupos: false,
    entriesMarcasFil: [],
    searchMarcasFil: '',
    isLoadingMarcasFil: false,
    search: '',
    progress: false,

    op: 0,
    footerProps: {'items-per-page-options': [7]},
    headers: [
      { text: 'INFORME', value:'informe' },
    ],

    headersArt: [
      { text: 'Código', value: 'codigo', width: 100, align: 'left' },
      { text: 'Nombre', value: 'nombre', width: 320, align: 'left' },
      { text: 'Marca',  value: 'nommar', width: 90,  align: 'left' },
      { text: 'Grupo',  value: 'nomgru', width: 90,  align: 'left' },
    ],

    headersRes: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 120 },
      { text: 'Total', value:'total', align: 'right', width: 120 }
    ],

    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    editedIndex: -1,
    informeTitulo: '',
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapState([
      'sucursal',
      'sucursales',
      'temas',
      'empresa',
      'logotipo',
      'dolar',
      'vinculosPadres',
      'vinculosPadresLic',
      'vinculosPadresAll',
      'soloArtComprados',
      'codigooid',
      'descuentos',
      'transition'
    ]),

    itemsMarcasFil () {
      return this.entriesMarcasFil.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

//    formTitle () { 
//      return this.editedIndex === -1 ? 'Nueva Marca' : 'Editar Marca';
//    },
  },
  watch: {
    //dialog (val) {
    //  val || this.cancelar();
    //},

    searchMarcasFil (val) {
      if (this.isLoadingMarcasFil) return
      return HTTP().get('/marcasbus').then(({ data }) => {
        this.entriesMarcasFil = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMarcasFil = false))
    },

    search () {
      this.filtrar()
    }

  },
  mounted () {
    this.rubItems = []
    this.provItems = []
    this.marItems = [{id: 0, nombre: 'Todas'}]
    this.gruItems = [{id: 0, nombre: 'Todos'}]
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      return HTTP().get('/usersrubros').then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          this.rubItems.push(data[i].rubro)
        }
        this.rubro = this.rubItems[0]
        this.rubro_id = this.rubro.id                    // ver, puede tener mas rubros
        return HTTP().get('/marcasbus').then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            this.marItems.push(data[i])
          }
          this.marca = this.marItems[0].id
          return HTTP().get('/grupos').then(({ data }) => {
            for (let i=0; i<=data.length-1; i++) {
              this.gruItems.push(data[i])
            }
            this.grupo = this.gruItems[0]
            this.provItems = this.$store.state.proveedores
            return HTTP().get('/gruposrubros/'+this.rubItems[0].id).then(({ data }) => {
              let aux = [];
              for(let i in data[0]) {
                aux.push({
                  id:     Number(data[0][i].id),
                  name:   data[0][i].nombre,
                  activo: data[0][i].activo,
                  ctt:    data[0][i].ctt,
                  padre:  Number(data[0][i].grupo_id),
                  state:  { disabled: data[0][i].activo===1 ? false : true }
                })
              }
              this.itemsTreeGrupos = getNestedChildren2(aux,0)
              function getNestedChildren2(arr, padre) {
                var out = []
                for(var i in arr) {
                  if(arr[i].padre === padre) {
                    var children = getNestedChildren2(arr, arr[i].id);
                    if(children.length) {
                      arr[i].children = children;
                    }
                    out.push(arr[i]);
                  }
                }
                return out
              }

              return HTTP().post('articulosmovidos', { userId: this.userId }).then(( {data} ) => {

                debugger
                this.artConMovs = []
                for (let i=0; i<=data.length-1; i++) {
                  this.artConMovs.push(data[i].articulo_id)
                }

                this.headersArt[0].text = this.$store.state.codigooid  == 'C'?'Código':'ID'
                this.headersArt[0].value = this.$store.state.codigooid == 'C'?'codigo':'id'

                this.filtrar();
              
              });
            });
          });
        });
      });
    }
  },
  created () {
    this.items.push(
      {informe: 'MOVIMIENTOS DE STOCK DETALLADO'},
      {informe: 'VALORIZACION DE STOCK'},
      {informe: 'ARTICULOS BAJO EXISTENCIA MINIMA'},
      )
      this.progress = false
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

    onScroll () {
      this.scrollInvoked++
    },

    selectAll(event) {
      if (event.value) {
        this.selected = this.articulos
      } else {
        this.selected = []
      }
    },

    aceptarGrupos() {
      this.dialogGrupos = false
      // hev021
      this.nombreDelGrupo = 'Sel.grupos';
      if (this.selection.length>0) {
        this.nombreDelGrupo = '';
        for (let i=0; i<=this.selection.length-1; i++) {
          this.nombreDelGrupo += this.selection[i].name+','
        }
        this.nombreDelGrupo = this.nombreDelGrupo.substring(0,this.nombreDelGrupo.length-1)
      }
      this.filtrar()
    },
    
    selInforme(item, row) {
      this.informeTitulo = item.informe
      this.dialog = true
      if (this.informeTitulo=='MOVIMIENTOS DE STOCK DETALLADO') { this.op = 1 }
      else if (this.informeTitulo=='VALORIZACION DE STOCK') { this.op = 2 }
      else if (this.informeTitulo=='VALORIZACION DE STOCK') { this.op = 3 }
    },

    filtrar() {

      debugger
      this.articulos = []
      this.selected = []
      let grusel = []
      for (let i=0; i<=this.selection.length-1; i++) {
        grusel.push(this.selection[i].id)
      }

      this.marca = this.marca==undefined?'':this.marca
      if (grusel.length==0) { grusel = '' }
      if (this.marca==undefined) { this.marca = '' }
      this.prov = this.prov==''?0:this.prov

      this.progress = true

      debugger
      return HTTP().post('/articuloz', {
        search: this.artConMovs,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: this.prov, stockProv: false, grupo: grusel, marca: this.marca, userex: null, soloArtComprados: true, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: this.artConMovs.length }).then(({ data })=>{
        debugger

      /*
      return HTTP().post('/articulosx', {
        search: this.artConMovs, vinculos: v,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        estricto: false, codigooid: this.$store.state.codigooid, userex: null, dolar: this.$store.state.dolar, ambiente: '',
        tipo: 'consulta', rubro: this.rubro.id, marca: this.marca, grupo: grusel, proveedor: this.prov, ancla: false, saySoloArtsPropios: false,
        activos: true, limit: this.artConMovs.length, descuentos: this.descuentos}) .then(({ data }) => {
      */
        debugger
          
        // campor
        if (data.length>0) {
          for (let i=0; i<=data.length-1; i++) {
            this.articulos.push({
              id:      data[i].id,
              codigo:  data[i].codigo,
              nombre:  data[i].nombre,
              nomgru:  data[i].precios[0].nomgru,
              nommar:  data[i].precios[0].nommar,
              creador: data[i].precios[0].creador_id,
              estado:  '',
              seleccionado: false,
            })
          }
          this.progress = false
        } else{
          this.progress = false
          this.mensaje('No se encontraron precios para consultar.',this.temas.forms_titulo_bg, 1500)
        }
      })
      .catch(err => {
        this.progress = false;
      })
    },

    cerrarDialog() {
      this.dialog = false
    },

    generarInforme(item, row) {

      debugger
      if (this.informeTitulo=='MOVIMIENTOS DE STOCK DETALLADO') {

        return HTTP().post('/infart_detalladoporarticulos', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursal: this.sucursal, arts: this.selected }).then((data) => {
          this.rows = []
          debugger
          for (let i=0; i<=data.data.length-1; i++) {
            let pos = -1
            if (this.$store.state.codigooid=='C') {
              pos =  this.rows.findIndex(x=>x.codigo==data.data[i].codigo)
            } else {
              pos =  this.rows.findIndex(x=>x.id==data.data[i].articulo_id)
            }
            if (pos==-1) {
              this.rows.push({
                id: data.data[i].articulo_id,
                codigo: data.data[i].codigo,
                nombre: data.data[i].nombre,
                tercero: '',
                cpr: '',
                deposito_id: '',
                fecha: '',
                regstk: '',
                stock: '',
                stockanterior: data.data[i].stockanterior,
                tipo: '',
              })
            }
            this.rows.push({
              id: data.data[i].articulo_id,
              codigo: '',
              nombre: '',
              tercero: data.data[i].tercero,
              cpr: data.data[i].cpr,
              deposito_id: data.data[i].deposito_id,
              fecha: moment(data.data[i].fecha).format('DD-MM-YYYY'),
              regstk: data.data[i].regstk,
              stock: data.data[i].stock,
              stockanterior: '',
              tipo: data.data[i].tipo,
            })
          }
          this.print(this.informeTitulo, 'l' )
        })

      } else if (this.informeTitulo=='VALORIZACION DE STOCK' || this.informeTitulo=='ARTICULOS BAJO EXISTENCIA MINIMA') {

        let sel = []
        for (let i=0; i<=this.selected.length-1; i++) {
          sel.push(this.selected[i].id)
        }
        if (sel.length==0) sel = ''

        return HTTP().post('/articuloz', {
          search: sel,
          vinculosPadresLic: this.$store.state.vinculosPadresLic,
          vinculosPadresAll: this.$store.state.vinculosPadresAll,
          proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: this.descuentos,
          dolar: this.$store.state.dolar, activos: true, limit: this.artConMovs.length }).then(({ data })=>{
          debugger

          this.rows = []
          let agrego = true
          let totalValorizacion = 0
          for (let i=0; i<=data.length-1; i++) {
            agrego =  (data[i].stock!=0 &&
                      ((this.informeTitulo=='ARTICULOS BAJO EXISTENCIA MINIMA' && data[i].stock<data[i].exmin) ||
                       (this.informeTitulo=='VALORIZACION DE STOCK')) && data[i].padre_id==null)

            if (agrego) {
              this.rows.push({
                id: data[i].id, 
                codigo: data[i].codigo, 
                nombre: data[i].nombre,
                stock: this.kit.redondear(data[i].stock,4),
                exmin: this.formatoImporte(data[i].precios[0].exmin),
                costo: '$'+this.formatoImporte(data[i].precios[0].costo, data[i].precios[0].decimales),
                precio: '$'+this.formatoImporte(data[i].precios[0].precio, data[i].precios[0].decimales),
                total: '$'+this.formatoImporte((this.roundTo(data[i].precios[0].precio,data[i].precios[0].decimales))*data[i].stock)
              })
            totalValorizacion += (this.roundTo(data[i].precios[0].precio,data[i].precios[0].decimales)*data[i].stock)
            }
          }
          debugger
          if (this.informeTitulo=='VALORIZACION DE STOCK') {
            this.rows.push({id:'TOTAL',codigo:'TOTAL',nombre:'',stock:'',exmin:'',costo:'',precio:'',total:'$'+this.formatoImporte(totalValorizacion)})
          }
          this.print(this.informeTitulo, this.informeTitulo=='VALORIZACION DE STOCK'?'l':'p' )
        })
      }
    },

    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = this.modelo
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },

    clickEnGrupo() {
      this.dialogGrupos = true;
    },

    cancelarDialogGrupos() {
      this.dialogGrupos = false
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

    formatoImporte(value, dec=2) {
      let val = (value/1).toFixed(dec).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    print(informeTitulo, orientacion ) {
      var doc = new jsPDF(orientacion, 'pt')  // 'p' normal 'l' horizontal ( landscape )
      let lpp = orientacion =='l'?28:44
      this.page = 1

      let r = this.rows.length
      if (this.informeTitulo=='MOVIMIENTOS DE STOCK DETALLADO') {
        this.pages = Math.trunc(this.rows.length/44)+1
        for (let i=0; i<=this.rows.length-1; i++) {
          if (this.rows[i].cpr=='') {
            r += 1
          }
        }
      }
      this.pages = Math.trunc(r/lpp)+1

      this.cabecera(informeTitulo, doc, orientacion)
      this.detalles(informeTitulo, doc, orientacion)
      doc.output ('dataurlnewwindow')
    },

    cabecera(informeTitulo, doc, orientacion) {
      const des = this.editado.fdesde.substr(8,2)+'/'+this.editado.fdesde.substr(5,2)+'/'+this.editado.fdesde.substr(0,4)
      const has = this.editado.fhasta.substr(8,2)+'/'+this.editado.fhasta.substr(5,2)+'/'+this.editado.fhasta.substr(0,4)
      let topDown = orientacion == 'p' ? 810 : 580
      let topWidth = orientacion == 'p' ? 527 : 777

      if (this.logotipo!=null) {
        let av    = 'images/'+this.logotipo
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
      if (this.informeTitulo=='MOVIMIENTOS DE STOCK DETALLADO') {
        doc.text ( this.$store.state.codigooid=='C'?'Código':'ID', 40, 115 )
        doc.text ( 'Fecha', 120, 115 )
        doc.text ( 'Comprobante', 180, 115 )
        doc.text ( 'Tipo', 285, 115 )
        doc.text ( 'Tercero', 315, 115 )
        doc.text ( 'Egresos', 535, 115 )
        doc.text ( 'Ingresos', 635, 115 )
        doc.text ( 'Stock', 747, 115 )
        doc.line( 40, 121, 800, 121)
      } else if (this.informeTitulo=='VALORIZACION DE STOCK') {
        doc.text ( this.$store.state.codigooid=='C'?'Código':'ID', 40, 115 )
        doc.text ( 'Descripcion', 120, 115 )
        doc.text ( 'Stock', 550, 115, 'right' )
        doc.text ( 'Costo', 630, 115 , 'right' )
        doc.text ( 'Precio', 710, 115 , 'right' )
        doc.text ( 'Total', 800, 115 , 'right' )
        doc.line( 40, 121, 800, 121)
      } else if (this.informeTitulo=='ARTICULOS BAJO EXISTENCIA MINIMA') {
        doc.text ( this.$store.state.codigooid=='C'?'Código':'ID', 40, 115 )
        doc.text ( 'Descripcion', 120, 115 )
        doc.text ( 'Ex.Mínima', 470, 115 , 'right' )
        doc.text ( 'Stock', 570, 115, 'right' )
        doc.line( 40, 121, 570, 121)
      }
    },

    detalles(informeTitulo, doc, orientacion) {
      let f = 135
      let acum = 0
      let subtotal = 0
      let topDown = orientacion == 'p' ? 780 : 540
      let topWidth = orientacion == 'p' ? 570 : 800

      if (this.informeTitulo=='MOVIMIENTOS DE STOCK DETALLADO') {
        
        debugger
        for (let i=0; i<=this.rows.length-1; i++) {
          
          if (i==this.rows.length-1) {
            doc.line( 40, f+25, topWidth, f+25)
            //f+=5
          }
          if (this.rows[i].cpr=='') {
            if (i>0) {
              //doc.text ( 'Stock', 650, f, 'left' )
              //doc.setFont(undefined,"bold");
              //doc.text ( this.formatoImporte(subtotal), 770, f, 'right' )
              //doc.setFont(undefined,"normal");
              f+=18
              subtotal = 0
              acum = 0
            }
            //doc.setFont(undefined,"italic");
            acum = this.rows[i].stockanterior
            doc.setFont(undefined,"bold");
            doc.text ( this.$store.state.codigooid=='C'?this.rows[i].codigo:this.rows[i].id.toString(), 40, f )
            doc.text ( this.rows[i].nombre.substring(0,60), 120, f )
            doc.setFont(undefined,"normal");
            doc.text ( 'Stock Anterior', 650, f )
            doc.text ( this.formatoImporte(this.rows[i].stockanterior), 770, f, 'right' )
            subtotal = Number(this.rows[i].stockanterior)
          } else {
            acum += this.rows[i].stock
            doc.text ( this.rows[i].fecha, 120, f )
            doc.text ( this.rows[i].cpr, 180, f )
            doc.text ( this.rows[i].tipo, 285, f )
            doc.text ( this.rows[i].tercero.substring(0,25), 315, f )
            if (this.rows[i].stock<0) {
              doc.text ( this.kit.redondear(this.rows[i].stock, 4), 570, f, 'right' )
            } else {
              doc.text ( this.kit.redondear(this.rows[i].stock, 4), 670, f, 'right' )
            }
            doc.text ( this.kit.redondear(acum, 4), 770, f, 'right' )
            subtotal += Number(this.rows[i].stock)
          }
          f+=15
          if (f>topDown && i<this.rows.length-1) {
            doc.addPage()
            this.page ++
            this.cabecera(informeTitulo, doc, orientacion)
            f=135
          }
        }
        doc.text ( 'Stock', 450, f, 'left' )
        doc.setFont(undefined,"bold");
        doc.text ( this.formatoImporte(subtotal), 570, f, 'right' )
        doc.setFont(undefined,"normal");

      } else if (this.informeTitulo=='VALORIZACION DE STOCK' || this.informeTitulo=='ARTICULOS BAJO EXISTENCIA MINIMA') {
        
        for (let i=0; i<=this.rows.length-1; i++) {
          if (i==this.rows.length-1) {
            doc.line( 40, f+8, topWidth, f+8)
          }

          doc.text ( this.$store.state.codigooid=='C'?this.rows[i].codigo:this.rows[i].id.toString(), 40, f )  //155
          if (this.informeTitulo=='VALORIZACION DE STOCK') {
            doc.text ( this.rows[i].nombre.substring(0,65), 120, f )  //40
            doc.text ( this.rows[i].stock.toString(), 550, f, 'right' )
            doc.text ( this.rows[i].costo.toString(), 630, f, 'right' )
            doc.text ( this.rows[i].precio.toString(), 710, f, 'right' )
            doc.text ( this.rows[i].total.toString(), 800, f, 'right' )
          } else {
            doc.text ( this.rows[i].nombre, 120, f )  //40
            doc.text ( this.rows[i].exmin.toString(), 470, f, 'right' )
            doc.text ( this.rows[i].stock.toString(), 570, f, 'right' )
          }

          f+=15
          if (f>topDown && i<this.rows.length-1) {
            doc.addPage()
            this.page ++
            this.cabecera(informeTitulo, doc, orientacion)
            f=135
          }
        }
      }
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

  },
};
</script>
