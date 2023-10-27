<template>
  <v-layout align-start class="fg">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        dense
        @click:row="selInforme"
        hide-default-footer
        class="elevation-1">
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
            <v-toolbar-title class="fg">Informes de Artículos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="500px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card class="fg">
                <v-toolbar
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
                        <v-col cols="6" offset="3" sm="6" class="pt-1 pb-0 pl-5">
                          <v-switch
                            label="Todos los Arts"
                            v-model="todosLosArts"
                            :color="temas.forms_titulo_bg"
                            outlined dense>
                          </v-switch>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="10" offset="1" sm="10" class="pt-2 pb-0">
                          <v-select v-if="!todosLosArts"
                            v-model="rubro"
                            :items="rubItems"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="nombre"
                            label="Rubro..."
                            outlined dense return-object multiselects
                            class="pt-2"
                            @change="fetchGrupos">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="10" offset="1" sm="10" class="pt-2 pb-0">
                          <v-autocomplete v-if="!todosLosArts"
                            class="pt-2 body-2"
                            v-model="marca"
                            :color="temas.forms_titulo_bg"
                            :items="itemsMarcasFil"
                            :loading="isLoadingMarcasFil"
                            :search-input.sync="searchMarcasFil"
                            item-text="nombre"
                            item-value="id"
                            label="Marca"
                            outlined dense clearable
                            placeholder="Escriba para buscar">
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="10" offset="1" sm="10" class="pb-8 pb-0" v-if="!todosLosArts">
                          <v-card outlined class="pt-1 pb-1">
                            <span class="pl-2">Grupos</span>
                            <v-chip small
                              class="ma-2"
                              @click="clickEnGrupo">
                              {{ nombreDelGrupo }}
                            </v-chip>
                          </v-card>
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
    Confirmacion,
    SBar,
  },
  data: () => ({
    scrollInvoked: 0,
    informeTitulo: '',
    nombreDelGrupo: 'Sel.grupos',
    rubItems: [],
    rubro: '',
    marca: '',
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
    },
    todosLosArts: false,
    page: 0,
    pages: 0,
    items: [],
    itemRes: [],
    marItems: [],
    gruItems: [],
    sucLis: [],
    sucSel: [],
    rows: [],
    entriesMarcasFil: [],
    provItems: [],
    selection: [],
    searchMarcasFil: '',
    itemsTreeGrupos: [],
    isLoadingMarcasFil: false,
    dialogGrupos: false,
    op: 0,
    sayInf: false,    
    sayInf2: false,
    footerProps: {'items-per-page-options': [19]},
    headers: [ { text: 'INFORME', value:'informe' } ],
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    editedIndex: -1,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapState(['sucursal','sucursales','empresa','temas','codigooid','logotipo','transition']),

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
  },

  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }

    this.rubItems = []
    this.provItems = []
    this.marItems = [{id: 0, nombre: 'Todas'}]
    this.gruItems = [{id: 0, nombre: 'Todos'}]

    return HTTP().get('/usersrubros').then(({ data }) => {
      debugger
      for (let i=0; i<=data.length-1; i++) {
        this.rubItems.push(data[i].rubro)
      }
      this.rubro = this.rubItems[0]
      this.rubro_id = this.rubro.id                    // ver, puede tener mas rubros
      return HTTP().get('/marcasbus').then(({ data }) => {
        debugger
        for (let i=0; i<=data.length-1; i++) {
          this.marItems.push(data[i])
        }
        this.marca = this.marItems[0].id
        return HTTP().get('/grupos').then(({ data }) => {
          debugger
          for (let i=0; i<=data.length-1; i++) {
            this.gruItems.push(data[i])
          }
          this.grupo = this.gruItems[0]
          for (let i=0; i<=this.$store.state.proveedores.length-1; i++) {
            if (!(this.$store.state.externo&&i==0)) {
              this.provItems.push(this.$store.state.proveedores[i])
            }
          }
          this.prov = this.provItems[0].id;
          return HTTP().get('/gruposrubros/'+this.rubItems[0].id).then(({ data }) => {
            debugger
            let aux = [];
            for(let i in data[0]) {
              aux.push({
                id:     Number(data[0][i].id),
                name:   data[0][i].nombre,
                activo: data[0][i].activo,
                ctt:    data[0][i].ctt,
                padre:  Number(data[0][i].grupo_id),
                state:  { disabled: data[0][i].activo===1 ? false : true }
              });
            };
            this.itemsTreeGrupos = getNestedChildren2(aux,0);
            function getNestedChildren2(arr, padre) {
              var out = [];
              for(var i in arr) {
                if(arr[i].padre === padre) {
                  var children = getNestedChildren2(arr, arr[i].id);
                  if(children.length) {
                    arr[i].children = children;
                  };
                  out.push(arr[i]);
                };
              };
              return out;
            };
          });
        });
      });
    });

  },
  
  created () {
    this.items.push(
      {informe: 'Artículos Datos Principales'},
      {informe: 'Artículos por Marca'},
      {informe: 'Artículos por Grupos'},
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

    onScroll () {
      this.scrollInvoked++
    },

    clickEnGrupo() {
      this.dialogGrupos = true;
    },

    cancelarDialogGrupos() {
      this.dialogGrupos = false
    },

    async fetchGrupos(item) {
        debugger
        this.rubro_id = item.id
        return HTTP().get('/gruposrubros/'+item.id).then(response => {
          debugger
          let aux = [];
          for(var i in response.data[0]) {
            aux.push({
              id:     Number(response.data[0][i].id),
              name:   response.data[0][i].nombre,
              activo: response.data[0][i].activo,
              ctt:    response.data[0][i].ctt,
              padre:  Number(response.data[0][i].grupo_id),
              state:  { disabled: response.data[0][i].activo===1 ? false : true }
            })
          }
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
          this.itemsTreeGrupos = getNestedChildren2(aux,0);
          return
        })
      },

    selInforme(item, row) {
      this.informeTitulo = item.informe
      this.dialog = true
      if (this.informeTitulo=='Artículos Datos Principales') {
        this.op = 1
      } else if (this.informeTitulo=='Artículos por Marcas') {
        this.op = 2
      } else if (this.informeTitulo=='Artículos por Grupos') {
        this.op = 3
      }
    },
    
    cerrarDialog() {
      this.dialog = false
    },
    
    generarInforme() {
      if (this.informeTitulo=='Artículos Datos Principales') {
        //this.sayInf = true
        let v = this.$store.state.vinculosPadres

        debugger
        return HTTP().post('/infart_datosprincipales', { vinculos: v }).then((data) => {

          debugger
          this.rows = []
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              id: data.data[i].meta.aid,
              codigo: data.data[i].codigo,
              nombre: data.data[i].nombre,
            })
          }
          this.print('p' )
        })

      } else if (this.informeTitulo=='Artículos por Grupos') {

        let v = this.$store.state.vinculosPadres
        debugger
        let g = []
        for (let i=0; i<=this.selection.length-1; i++) {
          g.push(this.selection[i].id)
        }

        return HTTP().post('/infart_porgrupos', { vinculos: v, grupos: g }).then((data) => {
          debugger
          this.rows = []
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              id: data.data[i].meta.aid,
              gid: data.data[i].meta.gid,
              codigo: data.data[i].codigo,
              nombre: data.data[i].nombre,
              nommar: data.data[i].meta.nommar,
            })
          }
          this.print('p' )
        })

      }
    },

    aceptarGrupos() {
      this.dialogGrupos = false
      this.nombreDelGrupo = 'Sel.grupos';
      if (this.selection.length>0) {
        this.nombreDelGrupo = '';
        for (let i=0; i<=this.selection.length-1; i++) {
          this.nombreDelGrupo += this.selection[i].name+','
        }
        this.nombreDelGrupo = this.nombreDelGrupo.substring(0,this.nombreDelGrupo.length-1)
      }
    },

    print(orientacion) {
      var doc = new jsPDF(orientacion, 'pt')  // 'p' normal 'l' horizontal ( landscape )
      this.page = 1
      this.pages = Math.trunc(this.rows.length/44)+1
      this.cabecera(doc, orientacion)
      this.detalles(doc, orientacion)
      doc.output ('dataurlnewwindow')
    },
    
    cabecera(doc, orientacion) {
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
      doc.text ( this.informeTitulo, 180, 45 )
      doc.setFontSize(9);
      doc.text ( 'Página '+this.page.toString()+'/'+this.pages.toString(), topWidth, topDown)
      if (this.informeTitulo=='Artículos Datos Principales') {
        doc.text ( this.codigooid=='C'?'Código':'ID', 40,115)
        doc.text ( 'Nombre', 115, 115 )
        doc.line( 40, 121, 570, 121)
      } else if (this.informeTitulo=='Artículos por Marcas') {
        doc.text ( 'MARCA', 40, 115 )
        doc.text ( this.codigooid=='C'?'Código':'ID', 40,130)
        doc.text ( 'Nombre', 115, 130 )
        doc.line( 40, 136, 570, 136)
      } else if (this.informeTitulo=='Artículos por Grupos') {
        doc.text ( 'GRUPO', 40, 115 )
        doc.text ( this.codigooid=='C'?'Código':'ID', 40,130)
        doc.text ( 'Nombre', 115, 130 )
        doc.text ( 'Marca', 415, 130 )
        doc.line( 40, 136, 570, 136)
      }
    },
    
    detalles(doc, orientacion) {

      let f = 135
      let topDown = orientacion == 'p' ? 780 : 540
      let topWidth = orientacion == 'p' ? 570 : 800

      if (this.informeTitulo=='Artículos Datos Principales') {
        for (let i=0; i<=this.rows.length-1; i++) {
          if (i==this.rows.length-1) {
            doc.line( 40, f-8, topWidth, f-8)
            f+=5
          }
          doc.text ( this.codigooid=='C'?this.rows[i].codigo:this.rows[i].id.toString(), 40, f )
          doc.text ( this.rows[i].nombre, 115, f )
          f+=15
          if (f>topDown && i<this.rows.length-1) {
            doc.addPage()
            this.page ++
            this.cabecera(doc, orientacion)
            f=135
          }
        }

      } else if (this.informeTitulo=='Artículos por Grupos') {

        let newTree = JSON.parse(JSON.stringify(this.itemsTreeGrupos[0]))
        function asignoNombresArbol(nodo, nivel = 0, nombre = '') {
          let sep = nivel == 0?'':' > '
          nombre+=sep+nodo.name
          nodo.name = nombre
          if (nodo.children!=undefined) {
            nodo.children.forEach((children) => {
              asignoNombresArbol(children, nivel + 1, nombre);
            });
          }
        }
        asignoNombresArbol(newTree, 0, '');

        debugger

        let r = this.rows;

        f = 155
        let pag = 1
        let coi = this.codigooid

        function imprimirArbol(nodo, nivel = 0, doc, coi, sel, rows) {

          let s = sel.findIndex(x=>x.id == nodo.id)
          debugger
          if (s!=-1||nodo.padre==0) {

            debugger
            if (nodo.padre!=0) {
              f +=15
            }

            doc.setFontSize(12);
            doc.text ( nodo.name, 40, f )
            doc.setFontSize(8);
            f += 20

            let artsGrupo = rows.filter(x=>x.gid==nodo.id)
            for (let i=0; i<=artsGrupo.length-1; i++) {
              doc.text ( artsGrupo[i].codigo, 40, f )
              doc.text ( artsGrupo[i].nombre, 115, f )
              doc.text ( artsGrupo[i].nommar, 415, f )
              f += 15

              if (f>790) {
                debugger
                doc.addPage()
                pag ++
                doc.text ( 'GRUPO', 40, 40 )
                doc.text ( coi=='C'?'Código':'ID', 40,55)
                doc.text ( 'Nombre', 115, 55 )
                doc.text ( 'Marca', 415, 55 )
                doc.line( 40, 61, 570, 61)
                f=80
              }

            } 
  
            if (f>790) {
              debugger
              doc.addPage()
              pag ++

              doc.text ( 'GRUPO', 40, 40 )
              doc.text ( coi=='C'?'Código':'ID', 40,55)
              doc.text ( 'Nombre', 115, 55 )
              doc.text ( 'Marca', 415, 55 )              
              doc.line( 40, 61, 570, 61)

              f=80
            }

          }
  
          if (nodo.children!=undefined) {
            nodo.children.forEach((children) => {
              imprimirArbol(children, nivel + 1, doc, coi, sel, rows);
            });
          }

        }

        imprimirArbol(newTree, 0, doc, coi, this.selection, this.rows);

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

  },
};
</script>

<style scoped lang="scss">
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
</style> 
