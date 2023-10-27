<template>
  <v-layout align-start>
    <v-flex>
      <v-dialog v-model="dialog" :fullscreen="true" persistent
        :transition="transition==null?'false':transition">

        <template v-slot:activator="{ on }"></template>
        <v-toolbar
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="closeForm">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg">
            Consulta de Precios / {{empresa}} - Dolar ${{formatoImporte($store.state.dolar)}}
          </span>
        </v-toolbar>

        <v-card class="fg">
          <v-card-text>
            <v-container fluid>
              <v-row class="fg">
                <v-col cols="3" sm="3" md="3">
                  <v-text-field
                    label="Código, ID, Descripción o Código de Barra"
                    :color="temas.forms_titulo_bg"
                    autofocus
                    clear-icon="mdi-close-circle"
                    clearable
                    @click:clear="limpiarTextoBuscar()"
                    v-model="busArt">
                  </v-text-field>
                </v-col>
                <v-col cols="1" sm="1" class="pt-5" >
                  <v-btn
                    :color="temas.forms_titulo_bg"
                    class="fg" dark
                    @click="buscarArt(true)">
                    Buscar
                  </v-btn>
                </v-col>
                <v-col cols="7" sm="7" md="7">
                  <div class="text-center" v-if="proveedoresPreferidos.length>0">
                    <v-chip-group column v-if="proveedoresPreferidos.length>1">
                      <draggable
                        v-model="proveedoresPreferidos"
                        group="people"
                        @start="drag=true"
                        @end="drag=false">
<!--
                        <v-chip v-for="(pp, i) in proveedoresPreferidos" :key="i"
                          class="fg ml-3 ma-2" multiple
                          :color="pp.sel==1?temas.cen_card_activo_bg:temas.barra_principal_bg"
                          :dark="pp.sel==1?temas.cen_card_activo_dark:temas.barra_principal_dark"
                          @click="filtrarProveedorPreferido(pp)">
                          {{ pp.prefijo }}
                        </v-chip>
-->
                        <span v-for="(pp, i) in proveedoresPreferidos" :key="i">
<!--
                          <v-badge
                            class="pt-1 pl-0 pr-0" overlap :content="pp.hay"
                            :color="pp.sel==1?temas.cen_card_activo_bg:temas.barra_principal_bg"
                            :dark="pp.sel==1?temas.cen_card_activo_dark:temas.barra_principal_dark"
                            rigth>
-->
                            <v-chip
                              dense :value="pp" label
                              :outlined="pp.hay==0"
                              @click="filtrarProveedorPreferido(pp)">
                              {{ pp.prefijo }}
                            </v-chip>
<!--                        </v-badge>  -->
                        </span>

<!--
                        <v-chip v-for="(pp, i) in proveedoresPreferidos" :key="i"
                          class="fg ml-3 ma-2" outlined multiple
                          :color="pp.sel==1?'green':'wite'"
                          @click="filtrarProveedorPreferido(pp)">
                          {{ pp.prefijo }}
                          <v-badge v-if="pp.hay==1"
                            class="pr-1" dot
                            color='green'>
                          </v-badge>
                        </v-chip>
-->
                      </draggable>
                    </v-chip-group>
                  </div>
                </v-col>

                <v-col cols="1">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn fab small dense
                        @click="sayOnOffFecDeAct"
                        v-on="on">
                        <v-icon medium
                          :color="temas.forms_close_bg">
                          {{ sayOnOffFechasDeActualizacion?
                             'mdi-arrow-up-circle':
                             'mdi-arrow-down-circle' }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span class="fg">Precios Actualizados por GOHU</span>
                  </v-tooltip>
                </v-col>
              </v-row>

              <v-row v-if="sayOnOffFechasDeActualizacion">
                <v-col>
                  <span>Precios Act/por GOHU</span>
                  <span v-for="(pp, i) in vinculosPadresLic" :key="i">
                    <v-chip class="ml-2" v-if="pp.administragohu"
                      dense label outlined>
                      {{ sayDatAdmGohu(pp) }}
                    </v-chip>
                  </span>
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12" sm="12" md="12">
                  <v-data-table
                    :headers="headersArt"
                    :items="selArt" dense
                    flat
                    class="elevation-1"
                    :footer-props="{
                      itemsPerPageOptions: [6],
                      showFirstLastPage: true,
                      showCurrentPage: true,
                      nextIcon: 'mdi-arrow-right-drop-circle-outline',
                      prevIcon: 'mdi-arrow-left-drop-circle-outline',
                    }">
                    <template v-slot:item.id="{ item }">
                      <span>{{item.id}}</span>
                    </template>
                    <template v-slot:item.codigo="{ item }">
                      <span>{{item.codigo}}</span>
                    </template>
                    <template v-slot:item.username="{ item }">
                      <span>{{ item.username }} </span>
                    </template>
                    <template v-slot:item.nombre="{ item }">
                      <span>{{ item.nombre }} </span>
                    </template>

                    <!--
                    <template v-slot:item.final="{ item }">
                      <v-card v-for="(p) in item.precios" :key="p.id" flat>
                        <template slot="progress"></template>
                        <v-card-text class="pt-0 pb-0 pr-0 pl-0">
                          <div class="fg120" :color="temas.forms_btn_xls_bg">
                            <span style="margin-right: 5px;">
                              <b>{{!p.esmio?p.prefijo:''}}</b>
                            </span>
                            <span v-if="!p.loTengo" class="fg80">
                              rev.{{!p.esmio?p.porrev:''}}%
                            </span>
                            <span
                              v-if="p.loTengo" :style="{ color: 'green' }">
                              <b>${{kit.redondear(p.final,p.decimales, p.decimales)}}</b>
                            </span>
                            <span v-else :style="{ color: 'red' }">
                              ${{kit.redondear(p.final,p.decimales, p.decimales)}}
                            </span>
                          </div>
                          <div class="fg">
                            <span class="fg80" :style="{ color: 'green' }"
                              x-small v-if="!p.esmio&&p.desmedpag!=null">
                              <b >{{p.desmedpag.desc}}%des</b>,
                            </span>
                            <span class="fg80">
                              <b>{{ fechadelprecio(p.updatedAt) }}</b>
                            </span>
                            <span class="fg80" v-if="p.aplicaAncla==true">
                              <b>, Aplica Ancla</b>
                            </span><br>
                          </div>
                        </v-card-text>
                      </v-card>
                    </template>
                    -->

                    <template v-slot:item.final="{ item }">
                      <v-card v-for="(p) in item.precios" :key="p.id" flat>
                        <template slot="progress"></template>
                        <v-card-text class="pt-0 pb-0 pr-0 pl-0">
                          <div class="fg120" :color="temas.forms_btn_xls_bg">
                            <span style="margin-right: 5px;">
                              <b>{{!p.esmio?p.prefijo:''}}</b>
                            </span>
                            <span v-if="!p.loTengo" class="fg80">
                              rev.{{!p.esmio?p.porrev:''}}%
                            </span>
                            <span v-if="p.loTengo" :style="{ color: 'green' }">
                              <b>
                                {{item.simbolo=='PES'?'$':'us$'}}
                                {{kit.redondear(p.final,p.decimales, p.decimales)}}
                              </b>
                            </span>
                            <span v-else :style="{ color: 'red' }">
                              <b>
                                {{item.simbolo=='PES'?'$':'us$'}}
                                {{kit.redondear(p.final,p.decimales, p.decimales)}}
                              </b>
                            </span>
                          </div>
                          <div class="fg">
                            <span v-if="p.desc1" class="fg80" :style="{ color: 'green' }">
                              <b>{{ sayDesc(p) }}</b>
                            </span>
                            <span class="fg80">
                              <b>{{ fechadelprecio(p.updatedAt) }}</b>
                            </span>
                            <span class="fg80" v-if="p.usd!=0">
                              <v-icon>mdi-18px mdi-anchor</v-icon>
                            </span><br>
                          </div>
                        </v-card-text>
                      </v-card>
                    </template>

                    <template v-slot:item.stock="{ item }">
                      <span>{{ formatoImporte(item.stock) }}</span>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<script>

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import Confirmacion from "./Forms/confirmacion.vue";
import draggable from 'vuedraggable';

export default {
  components: {
    Confirmacion,
    draggable,
  },
  data: () => ({
    dialog: true,
    footerProps: {'items-per-page-options': [8]},
    proveedoresPreferidos: [],
    sayOnOffFechasDeActualizacion: false,
    selArt: [],
    expanded: [],
    busArt: '',
    userArticulosId: 0,
    // definimos los headers de la datatables
    headersArt: [
      { text: 'Código', value:'codigo', align: 'left', width: 90},
      { text: 'Descripción', value:'nombre', align: 'left', width: 350},
      { text: 'Pr.Publico', value:'final', sortable: false, align: 'end', width: 220},      
      { text: 'Stock', value:'stock', align: 'end', width: 100},
    ],
    headersMediosCobro: [
      { text: 'Observaciones', value:'observ', align: 'end', width: 690},
      { text: 'Precio', value:'precio', align: 'end', width: 160},
      { text: 'Desc.', value:'descuento', align: 'end', width: 100},
    ],
  }),
  
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'vinculosPadres', 'vinculosPadresLic', 'vinculosPadresAll', 'vinculosHijos', 
      'empresa', 'tipo', 'temas', 'dolar', 'codigooid', 'cttLoadReg', 'descuentos', 'exclusivoDe', 'transition'
    ]),
  },

  mounted() {
    this.headersArt[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
    this.headersArt[0].value = this.$store.state.codigooid == 'C'?'codigo':'id'
    return HTTP().post('/cargoprefijos', { vinculosPadres:this.vinculosPadres}).then(({ data })=>{
      if (data.length>0) {
        let totReg = 0
        let regMios = 0
        for (let i=0; i<=data.length-1; i++) {
          if (data[i].user_id==this.userId) {
            regMios = data[i].articulos
          }
          totReg += data[i].articulos
        }
        this.proveedoresPreferidos.push({user_id: null, tercero_id: null, prefijo: 'Todos', sel: 1, articulos: totReg})
        this.proveedoresPreferidos.push({user_id: this.userId, tercero_id: null, prefijo: 'Mios', sel: 0, articulos: regMios })
        for (let i=0; i<=data.length-1; i++) {
          if (data[i].user_id!=this.userId) {
            this.proveedoresPreferidos.push({
              user_id: data[i].user_id,
              tercero_id: data[i].tercero_id,
              prefijo: data[i].prefijo,
              articulos: data[i].articulos,
              sel: 0,
              hay: false,
              })
          }
        }
      }
    })
  },

  methods: {
    closeForm(){
      this.dialog = false;
      if (this.tipo=='UE') {
        router.push('/ue')
      } else {
        router.push('/')
      }
    },

    sayOnOffFecDeAct() {
      this.sayOnOffFechasDeActualizacion = !this.sayOnOffFechasDeActualizacion
    },

    limpiarTextoBuscar() {
      this.busArt = ''
      this.buscarArt(true)
    },

    sayDesc(p) {
      let desc = p.desc1!=0?'-'+p.desc1:''
      if (p.desc2!=0) {
        desc+='+'+p.desc2
      }
      return desc!=''?desc+'% ':''
    },

    sayDatAdmGohu(pp) {
      return pp.username+', '+moment(pp.ultfecimpart).fromNow(true)
    },

    buscarArt(asignoDots) {
      if (this.busArt==null) this.busArt = '';
      let s = this.busArt.length>0 ? this.busArt : '';

      if (asignoDots) {
        for (let i=0; i<=this.proveedoresPreferidos.length-1; i++) {
          this.proveedoresPreferidos[i].hay = 0
        }
      }

      let v = [];
      let todos = false
      let mios = false
      if (this.proveedoresPreferidos.length>0) {
        if (this.proveedoresPreferidos[0].sel==1) {
          todos = true
        } else if (this.proveedoresPreferidos[1].sel==1) {
          mios = true
        }
      } else {
        mios = true
      }
      if (mios) {
        v.push(this.userId);
      } else if (todos) {
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
      } else {
        let pos = this.proveedoresPreferidos.findIndex(x=>x.sel == 1)
        v.push(this.proveedoresPreferidos[pos].user_id);
      }

      debugger
      // Si el usuario es exclusivo de otro, asigno a ese otro como filtro de articulos
      let proveedor = this.$store.state.exclusivoDe.id==null?0:this.$store.state.exclusivoDe.id
      return HTTP().post('/articuloz', {
        search: s,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: proveedor, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: this.cttLoadReg }).then(({ data })=>{

      debugger
      
      /*
      return HTTP().post('/articulosx', {
        search: s, vinculos: v,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        estricto: false, codigooid: this.$store.state.codigooid, userex: null, dolar: this.$store.state.dolar, ambiente: 'consulta', tipo: '',
        rubro: '', marca: '', grupo: '', proveedor: 0, ancla: '', saySoloArtsPropios: true, activos: true, limit: this.cttLoadReg,
        descuentos: this.descuentos }).then(({ data })=>{
        */

        debugger
        this.selArt = []
        for (let i=0; i<=data.length-1; i++) {
          this.selArt.push({
            id: data[i].id,
            codigo: data[i].codigo,
            nombre: data[i].nombre,
            stock: data[i].stock,
            descuento: data[i].descuento,
            medioscobro: data[i].medioscobro,
            simbolo: data[i].simbolo,
            precios: data[i].precios,
          })
          if (asignoDots) {
            for (let j=0; j<=data[i].precios.length-1; j++) {
              let pos = this.proveedoresPreferidos.findIndex(x=>x.user_id==data[i].precios[j].user_id)
              if (pos!=-1) {
                this.proveedoresPreferidos[pos].hay = 1
//                if (data[i].precios[j].user_id == this.userId) {
//                  this.proveedoresPreferidos[1].hay = 1
//                }
//                this.proveedoresPreferidos[pos].hay = 1
              }
            }
          }
        }
      })
    },

    filtrarProveedorPreferido(cual) {
      debugger
      let pos = this.proveedoresPreferidos.findIndex(x=>x.prefijo == cual.prefijo)
      if (this.proveedoresPreferidos[pos].sel==1) return
      for (let i=0; i<=this.proveedoresPreferidos.length-1; i++) {
        this.proveedoresPreferidos[i].sel = 0
      }
      this.proveedoresPreferidos[pos].sel = 1
      this.buscarArt(false)
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    
    fechadelprecio(fecha) {
      return moment(fecha).fromNow(true);
    },

  }
}
</script>

<style scoped lang="scss">
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg120 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 120%;
  }
  .fg80 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 80%;
  }

  .app { margin: 40px; }
  .draggable-flex {
    display: inherit;
    flex-direction: inherit;
  }

</style> 