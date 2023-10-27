<template>
  <v-layout align-start>
    <v-flex>
      <v-dialog v-model="dialog" :fullscreen="true" persistent
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>

        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="closeForm">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <v-row class="fg">
            <v-col cols="4" class="pt-6 pb-7">
              <span>Cambios Masivos de Artículos / {{empresa}}</span>
            </v-col>
            <v-col cols="6">
              <v-progress-linear v-if="progress==true"
                class="mt-2"
                height="10"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-linear>
            </v-col>
            <v-col cols="2">
              <v-btn v-show="selected.length>0"
                :color="temas.forms_btn_add_bg"
                class="ma-2 white--text"
                @click="aplicarCambios">
                Aplicar
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-card class="fg">
          <form method="POST" action="upload" enctype="multipart/form-data">
            <v-card-text>
              <v-row class="pt-0">
                <v-col cols="2" sm="2" class="pt-0 pb-0">
                  <v-select
                    v-model="rubro"
                    :items="rubItems"
                    :color="temas.forms_titulo_bg"
                    :item-color="temas.forms_titulo_bg"
                    item-value="id"
                    item-text="nombre"
                    label="Rubro..."
                    outlined
                    dense
                    return-object
                    @change="filtrar()"
                    class="pt-2">
                  </v-select>
                </v-col>
                <v-col cols="3" sm="3" class="pt-0 pb-0">
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
                    dense
                    @change="filtrar()"
                    placeholder="Escriba para buscar">
                  </v-autocomplete>
                </v-col>
                <v-col cols="3" sm="3" md="3" class="pt-2 pb-0">
                  <v-card outlined class="pt-1 pb-1">
                    <span class="pl-2">Grupos</span>
                    <v-chip
                      class="ma-2"
                      small
                      @click="clickEnGrupo">
                      {{ nombreDelGrupo }}
                    </v-chip>
                  </v-card>
                </v-col>
                <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                  <v-select
                    v-model="opcion"
                    :items="opciones"
                    :color="temas.forms_titulo_bg"
                    :item-color="temas.forms_titulo_bg"
                    item-value="id"
                    item-text="nombre"
                    label="Opciones..."
                    @change="setopcion"
                    outlined dense
                    class="pt-2">
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3" sm="3" class="pt-0 pb-0">
                  <v-text-field
                    v-model="search"
                    clearable dense
                    outlined
                    :color="temas.forms_titulo_bg"
                    append-icon="search"
                    label="Texto a Buscar"
                    single-line hide-details
                    class="pt-0">
                  </v-text-field>
                </v-col>
                <v-col cols="1" sm="1" class="pt-0 pb-0 pl-0">
                  <v-btn
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="pt-0 white--text text-capitalize"
                    @click="buscarArticulos">
                    Buscar
                  </v-btn>
                </v-col>
                <v-col cols="1" sm="1" class="pt-0 pb-0 pl-0">
                  <v-btn
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="pt-0 white--text text-capitalize"
                    @click="leo_gruposXArt()">
                    Gr.Asig.
                  </v-btn>
                </v-col>
                <v-col cols="1" sm="1" class="pt-0 pb-0 pl-0">
                  <v-btn
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="pt-0 white--text text-capitalize"
                    @click="leo_marcasXArt()">
                    Mar.Asig.
                  </v-btn>
                </v-col>
                <v-col cols="1" sm="1" md="1" class="pt-0 pb-0 pl-0">
                  <v-text-field
                    disabled
                    outlined dense
                    v-model="selected.length"
                    label="Art.Sel."
                    class="pt-0">
                  </v-text-field>
                </v-col>
                <v-col cols="1" sm="1" md="1" class="pt-0 pb-0 pl-0">
                  <v-text-field
                    outlined dense
                    type="number"
                    v-model="limit"
                    label="R/a Leer"
                    class="pt-0">
                  </v-text-field>
                </v-col>
                <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                  <v-autocomplete v-show="opcion==4"
                    class="body-2 pt-0"
                    v-model="marcaSel_id"
                    :color="temas.forms_titulo_bg"
                    :items="itemsMarcas"
                    :loading="isLoadingMarcas"
                    :search-input.sync="searchMarcas"
                    item-text="nombre"
                    item-value="id"
                    label="Marca a Asignar"
                    outlined dense
                    placeholder="Escriba para buscar">
                  </v-autocomplete>

                  <v-card outlined class="pt-1 pb-1" v-show="opcion==5">
                    <span class="pl-2">Grupo</span>
                    <v-chip
                      class="ma-2"
                      small
                      @click="clickEnGrupoAsigna">
                      {{ nombreDelGrupoAsigna }}
                    </v-chip>
                  </v-card>
                  <v-text-field v-show="opcion==7"
                    outlined dense
                    v-model="decimales"
                    label="Decimales"
                    class="pt-0">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </form>

          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            @toggle-select-all="selectAll"
            :single-select="false"
            item-key="codigo"
            show-select
            dense
            class="pl-3 pr-3 elevation-3"
            :footer-props="footerProps">
            <template v-slot:item.codigo="{ item }">
              <span class="mini-font">{{ item.codigo }}</span>
            </template>
            <template v-slot:item.nombre="{ item }">
              <span class="mini-font">{{ item.nombre }}</span>
            </template>
            <template v-slot:item.nomgru="{ item }">
              <span class="mini-font">{{ item.nomgru }}</span>
            </template>
            <template v-slot:item.nommar="{ item }">
              <span class="mini-font">{{ item.nommar }}</span>
            </template>
          </v-data-table>
        </v-card>
      </v-dialog>

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
              icon @click="dialogGrupos=false">
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

      <!-- SELECCION DE GRUPOS ASIGNACION -->
      <v-dialog v-model="dialogGruposAsigna" max-width="600px" max-height="600px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="dialogGruposAsigna=false">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span>Seleccione el Grupo</span>
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
                      :active="active"
                      activatable
                      dense
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      :items="itemsTreeGrupos"
                      @update:active="aceptarGruposAsigna">
                    </v-treeview>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- MARCAS POR ARTICULO -->
      <v-dialog v-model="dialogMarcasXArt" max-width="600px" max-height="300px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="dialogMarcasXArt=false">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span>Artículos Por Marca</span>
          </v-toolbar>
          <v-data-table
            :headers="headersMarcasXArt"
            :items="marcasXArt"
            :single-select="false"
            item-key="id"
            dense
            class="pl-3 pr-3 elevation-3"
            :footer-props="footerProps">
          </v-data-table>
        </v-card>
      </v-dialog>
      <!-- FINALIZA LA EDICION DE PRESENTACIONES-->

      <!-- GRUPOS POR ARTICULO -->
      <v-dialog v-model="dialogGruposXArt" max-width="600px" max-height="300px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="dialogGruposXArt=false">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span>Artículos Por Grupos</span>
          </v-toolbar>
          <v-data-table
            :headers="headersGruposXArt"
            :items="gruposXArt"
            :single-select="false"
            item-key="id"
            dense
            class="pl-3 pr-3 elevation-3"
            :footer-props="footerProps">
          </v-data-table>
        </v-card>
      </v-dialog>
      <!-- FINALIZA LA EDICION DE PRESENTACIONES-->

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
import SBar from './Forms/snackbar.vue';
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import Confirmacion from "./Forms/confirmacion.vue"

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    scrollInvoked: 0,
    progress: false,
    dialog: true,
    dialogMarcasXArt: false,
    dialogGruposXArt: false,
    dialogGrupos: false,
    dialogGruposAsigna: false,
    marcasXArt: [],
    gruposXArt: [],
    active: [],
    isLoadingMarcas: false,
    isLoadingMarcasFil: false,
    isLoadingGrupos: false,
    isLoadingGruposFil: false,
    searchMarcas: '',
    searchMarcasFil: '',
    searchGrupos: '',
    searchGruposFil: '',
    entriesMarcas: [],
    entriesMarcasFil: [],
    entriesGrupos: [],
    entriesGruposFil: [],
    rubro: '',
    marca: 0,
    grupo: '',
    rubro_id: 0,
    marcaSel_id: 0,
    grupoSel_id: 0,
    decimales: 0,
    grupo1Seleccionado: 'Todos',
    grupo2Seleccionado: 'Todos',
    cualGrupo: 0,
    pagination: { sortBy: 'codigo' },
    nuevoXls: '',
    xlsCargado: false,
    registrosXls: 0,
    registrosCamPre: 0,
    encontradosXls: 0,
    aModificarXls: 0,
    soloCambios: 0,
    rubItems: [],
    marItems: [],
    gruItems: [],
    items: [],
    selected: [],
    opciones: [
      {id: 1, nombre: 'Pasar el nombre del artículo a mayúsculas'},
      {id: 2, nombre: 'Pasar el nombre del artículo a minúsculas'},
      {id: 3, nombre: 'Dejar un solo espacio en blanco entre palabra y palabra'},
      {id: 4, nombre: 'Asignar nueva marca a artículos'},
      {id: 5, nombre: 'Asignar nuevo grupo a artículos'},
      {id: 6, nombre: 'Asignar nuevo código de IVA'},
      {id: 7, nombre: 'Asignar decimales en precios'},
      {id: 8, nombre: 'Asignar nueva unidad de medida para ventas'},
      {id: 9, nombre: 'Asignar nueva unidad para ventas'},
      {id:10, nombre: 'Asignar nueva unidad de medida para compras'},
      {id:11, nombre: 'Asignar nueva unidad para compras'},
      {id:12, nombre: 'Asignar nueva condición <Se Compra>'},
      {id:13, nombre: 'Asignar nueva condición <Se Vende>'},
      {id:14, nombre: 'Asignar nueva condición <Controla Stock>'},
      {id:15, nombre: 'Asignar nueva condición <Activar/Desactivar>'},
      {id:16, nombre: 'Asignar nueva Moneda'},
//    {id:5, nombre: 'Cambiar Tasa de IVA'},
//    {id:6, nombre: 'Cambiar Moneda'},
    ],
    opcion: 1,
    mios: [],
    footerProps: {'items-per-page-options': [12 ]},
    search: '',
    dialog: false,
    items: [],
    headers: [],
    headersMarcasXArt: [
      { text: 'ID', value: 'id', width: 70, align: 'left' },
      { text: 'NOMBRE', value: 'nombre', width: 150, align: 'left' },
      { text: 'CTT',  value: 'ctt', width: 100, align: 'left' },
    ],
    headersGruposXArt: [
      { text: 'ID', value: 'id', width: 70, align: 'left' },
      { text: 'NOMBRE', value: 'nombre', width: 150, align: 'left' },
      { text: 'CTT',  value: 'ctt', width: 100, align: 'left' },
    ],
    aumentar: true,
    porcentaje: 0,
    limit: 300,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    selection: [],
    nombreDelGrupo: 'Seleccione Grupos',
    nombreDelGrupoAsigna: 'Seleccione el Grupo',
    itemsTreeGrupos: [],
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'vinculosPadres', 'vinculosPadresLic', 'vinculosHijos', 'vinculosPadresAll',
      'empresa', 'temas', 'externo', 'codigooid', 'descuentos', 'transition'
    ]),

    itemsMarcasFil () {
      return this.entriesMarcasFil.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    itemsGruposFil () {
      return this.entriesGruposFil.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    itemsMarcas () {
      return this.entriesMarcas.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },
    
    itemsGrupos () {
      return this.entriesGrupos.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },
  },

  watch: {
    searchMarcas (val) {
      if (this.isLoadingMarcas) return
      this.isLoadingMarcas = true
      return HTTP().get('/marcasbus').then(({ data }) => {
        this.entriesMarcas = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMarcas = false))
    },

    searchGrupos (val) {
      if (this.isLoadingGrupos) return
      this.isLoadingGrupos = true
      return HTTP().get('/grupos').then(({ data }) => {
        this.entriesGrupos = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingGrupos = false))
    },

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

    searchGruposFil (val) {
      if (this.isLoadingGruposFil) return
      return HTTP().get('/grupos').then(({ data }) => {
        this.entriesGruposFil = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingGruposFil = false))
    },

    search () {
      this.filtrar()
    }
  },

  mounted () {
    this.dialog = true;
    this.rubItems    = []
    this.marItems    = [{id: 0, nombre: 'Todas'}]
    this.gruItems    = [{id: 0, nombre: 'Todos'}]
    return HTTP().get('/usersrubros').then(({ data }) => {
      for (let i=0; i<=data.length-1; i++) {
        this.rubItems.push(data[i].rubro)
      }
      this.rubro = this.rubItems[0]
      this.rubro_id = this.rubro ? this.rubro.id : null   // ver, puede tener mas rubros
      return HTTP().get('/marcasbus').then(({ data }) => {
        this.marItems = []
        for (let i=0; i<=data.length-1; i++) {
          this.marItems.push(data[i])
        }
        return HTTP().get('/gruposrubros/'+this.rubItems[0].id).then(({ data }) => {
          let aux = [];
          debugger
          for(let i in data[0]) {
            aux.push({
              id: Number(data[0][i].id),
              name: data[0][i].nombre,
              activo: data[0][i].activo,
              ctt: data[0][i].ctt,
              padre:  Number(data[0][i].grupo_id),
              state: { disabled: data[0][i].activo===1 ? false : true }
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
          this.filtrar()
        })
      });
    });
//});
  },

  methods: {
  
    closeForm(){
      this.dialog = false;
      router.push('/')
    },

    selectAll(event) {
      if (event.value) {
        this.selected = this.items
      } else {
        this.selected = []
      }
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='Aplicar Cambios masivos') {
          let s = this.search ? this.search : 'all'
          let v = this.$store.state.vinculosHijos

          return HTTP().post(`/userarticuloscambiosmasivos`, {
            op: this.opcion,
            rub: this.rubro.id,
            mar: this.marca,
            gru: this.grupo,
            sel: this.selected,
            newmar: this.marcaSel_id,
            newgru: this.grupoSel_id,
            decimales: this.decimales,
          })
            .then(({ data }) => {
              this.msg.msgVisible = false
              if (data==1) {
                this.mensaje('¡Se ha modificado un artículo!', this.temas.forms_titulo_bg, 2500)
              } else if (data>1) {
                this.mensaje('¡Se han modificado '+data+' artículos!', this.temas.forms_titulo_bg, 2500)
              } else {
                this.mensaje('¡No se han modificado artículos!', this.temas.forms_titulo_bg, 2500)
              }
              this.selected = []
              this.filtrar()
            })
        } else if (this.msg.msgAccion=='Precios Modificados') {
          this.msg.msgVisible = false
          this.filtrar()
        }
      } else if (op==='Cancelar') {
      }
      this.msg.msgVisible = false;
    },

    buscarArticulos() {
      this.filtrar()
    },

    leo_marcasXArt() {
      this.marcasXArt = []
      return HTTP().get('/marcasporarticulos').then(({ data }) => {
        debugger
        this.marcasXArt = data
        this.dialogMarcasXArt = true
      })
    },

    leo_gruposXArt() {
      debugger
      this.gruposXArt = []
      return HTTP().get('/gruposporarticulos').then(({ data }) => {
        debugger
        this.gruposXArt = data
        this.dialogGruposXArt = true
      })
    },

    setopcion() {
      this.opcion = this.opcion
    },

    filtrar() {

      debugger
      let grusel = []
      for (let i=0; i<=this.selection.length-1; i++) {
        grusel.push(this.selection[i].id)
        if (grusel.findIndex(x=>x==this.selection[i].padre)==-1) {
          grusel.push(this.selection[i].padre)
        }
        if (this.selection[i].name=='GENERAL') {
          grusel.push('null')
        }
      }
      this.selected = []
      this.headers = [
        { text: 'CODIGO', value: 'codigo', width: 120, align: 'left' },
        { text: 'NOMBRE', value: 'nombre', width: 500, align: 'left' },
        { text: 'MARCA',  value: 'nommar', width: 120, align: 'left' },
        { text: 'GRUPO',  value: 'nomgru', width: 120, align: 'left' },
      ]

      this.headers[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
      this.headers[0].value = this.$store.state.codigooid == 'C'?'codigo':'id'

      this.marca = this.marca | '';
      if (grusel.length==0) grusel = ''
      this.progress = true
      return HTTP().post('/articuloz', {
        search: this.search,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: 0, stockProv: false, grupo: grusel, marca: this.marca, userex: null, soloArtComprados: true, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: this.limit }).then(({ data })=>{
        debugger

      /*
      return HTTP().post('/articulosx', {
        search: s, vinculos: v,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        estricto: null, codigooid: this.$store.state.codigooid, userex: null, dolar: this.$store.state.dolar, ambiente: 'ventas', tipo:t,
        rubro: this.rubro.id, marca: this.marca, grupo: grusel, proveedor: 0, ancla: '', saySoloArtsPropios: false, activos: true,
        limit: this.limit, descuentos:this.descuentos}).then(({ data }) => {
      */

        this.progress = false
        this.items = []
        if (data.length) {
          for (let i=0; i<=data.length-1; i++) {
            this.items.push({ 
              id:     data[i].id,
              preid:  data[i].precios[0].id,
              codigo: data[i].codigo,
              nombre: data[i].nombre,
              nomgru: data[i].precios[0].nomgru,
              nommar: data[i].precios[0].nommar,
            })
          }
          debugger
        }
      })
      .catch(err => {
        console.log(err)
      })
    },

    aplicarCambios() {
      this.msg.msgTitle = 'Cambio masivo de datos'
      let msg = ''
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      if (this.selected.length==1) {
        msg += 'Un artículo sera modificado. ¿Confirma la operación?'
      } else {
        msg += 'Se modificarán '+this.selected.length + ' artículos. ¿Confirma la operación?'
      }
      this.msg.msgBody = msg
      this.msg.msgVisible = true
      this.msg.msgAccion = 'Aplicar Cambios masivos'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    clickEnGrupo() {
      this.dialogGrupos = true;
    },

    clickEnGrupoAsigna() {
      this.dialogGruposAsigna = true;
    },

    onScroll () {
      this.scrollInvoked++
    },

    aceptarGrupos() {
      this.dialogGrupos = false
      this.filtrar()
    },

    aceptarGruposAsigna(value) {
      debugger
      const deepSearch = (data, value, key = 'title', sub = 'children', tempObj = {}) => {
        if (value && data) {
          data.find((node) => {
            if (node[key] == value) {
              tempObj.found = node;
              return node;
            }
            return deepSearch(node[sub], value, key, sub, tempObj);
          });
          if (tempObj.found) {
            return tempObj.found;
          }
        }
        return false;
      }
      debugger
      let ret = deepSearch(this.itemsTreeGrupos, value, 'id', 'children');
      if (ret.children) {
        this.mensaje('¡Grupo con Hijos, debes seleccionar un Hijo!', this.temas.forms_titulo_bg, 2500)
      } else {
        this.nombreDelGrupoAsigna = ret.name
        this.grupoSel_id = ret.id
        this.dialogGruposAsigna = false
      }
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',');
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

  }

}

</script>
<style scoped lang="scss">
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
</style> 
