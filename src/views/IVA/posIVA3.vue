<template>
  <v-layout align-start class="fg">
    <v-flex>

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
          class="fgb" v-model="sucursal">
          <v-chip class="ml-0" label
            :color="temas.barra_principal_bg"
            :dark="temas.barra_principal_dark">
            POSICIONES DE IVA
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

      <v-tabs
        key="ventas"
        background-color="white"
        :color="temas.forms_titulo_bg"
        v-model="tabInicial"
        xl="12" lg="12" md="12" sm="1" xs="1">
        <v-tab href="#ventas">
          Ventas
        </v-tab>
        <v-tab href="#compras">
          Compras
        </v-tab>
        <v-tab href="#posicion">
          Posición Fiscal
        </v-tab>
        <v-tab href="#posicion">
          AFIP
        </v-tab>
        <v-tab-item value="ventas">

          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            dense
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            show-expand
            class="fg elevation-3"
            :footer-props="footerProps">
            <template v-slot:top>

              <v-toolbar flat color="white">
                <v-dialog max-width="600px" :transition="transition==null?'false':transition">

                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-show="puedeEditar"
                      fab @click="nuevoContacto"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      x-small>
                      <v-icon>mdi-18px mdi-plus</v-icon>
                    </v-btn>
                  </template>

                  <v-card class="fg">
                    <v-toolbar flat
                      :color="temas.forms_titulo_bg"
                      :dark="temas.forms_titulo_dark==true">
                      <v-btn
                        icon @click="cancelarCon"
                        :color="temas.forms_close_bg"
                        :dark="temas.forms_close_dark==true">
                        <v-icon>mdi-arrow-left-circle</v-icon>
                      </v-btn>
                      <span class="text--right">
                        {{ formTitleCon }}
                      </span>
                      <v-spacer></v-spacer>
                      <v-btn
                        v-if="(editadoCon.tipo_id &&
                                editadoCon.observaciones&&!elMailExiste)"
                        color="teal accent-4" class="ma-2 white--text"
                        @click="guardarCon(editadoCon)">
                        Guardar
                      </v-btn>
                    </v-toolbar>

                    <v-card-text>
                      <v-container>
                        <v-select
                          label="Tipo de Contacto"
                          v-model="editadoCon.tipo_id"
                          :color="temas.forms_titulo_bg"
                          :items="contactosTipos"
                          item-value="id"
                          item-text="nombre"
                          autocomplete>
                        </v-select>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="editadoCon.observaciones"
                              label="Observaciones"
                              :color="temas.forms_titulo_bg"
                              required
                              :counter="60"
                              :maxlength="60"
                              @blur="verificoElMail(editadoCon.observaciones)">
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-toolbar>

            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-data-table
                  :headers="headersItems"
                  :items="item.items"
                  dense
                  hide-default-footer>
                  <template v-slot:item.nombre="{ item }">
                    <span> {{ item.codigo=='1@1' ? item.texto : item.nombre }}</span>
                  </template>
                  <template v-slot:item.precio="{ item }">
                    <span>${{ formatoImporte(item.precio) }}</span>
                  </template>
                  <template v-slot:item.total="{ item }">
                    <span>${{ formatoImporte(item.total) }}</span>
                  </template>
                </v-data-table>
              </td>
            </template>

            <template #item.nombre="{ value }">
              <div class="text-truncate" style="max-width: 170px">
                {{ value }}
              </div>
            </template>
            <template v-slot:item.fecha="{ item }">
              <span>{{ formatoFechaCorta(item.fecha) }}</span>
            </template>
            <template v-slot:item.gravado="{ item }">
              <span>$ {{ formatoImporte(item.gravado) }}</span>
            </template>
            <template v-slot:item.exento="{ item }">
              <span>$ {{ formatoImporte(item.exento) }}</span>
            </template>
            <template v-slot:item.iva="{ item }">
              <span>$ {{ formatoImporte(item.iva) }}</span>
            </template>
            <template v-slot:item.total="{ item }">
              <span>$ {{ formatoImporte(item.total) }}</span>
            </template>
          </v-data-table>

        </v-tab-item>
        <v-tab-item value="compras">

          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            dense
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            show-expand
            class="fg elevation-3"
            :footer-props="footerProps">
            <template v-slot:top>
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
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-data-table
                  :headers="headersItems"
                  :items="item.items"
                  dense
                  hide-default-footer>
                  <template v-slot:item.nombre="{ item }">
                    <span> {{ item.codigo=='1@1' ? item.texto : item.nombre }}</span>
                  </template>
                  <template v-slot:item.precio="{ item }">
                    <span>${{ formatoImporte(item.precio) }}</span>
                  </template>
                  <template v-slot:item.total="{ item }">
                    <span>${{ formatoImporte(item.total) }}</span>
                  </template>
                </v-data-table>
              </td>
            </template>

            <template #item.nombre="{ value }">
              <div class="text-truncate" style="max-width: 170px">
                {{ value }}
              </div>
            </template>
            <template v-slot:item.fecha="{ item }">
              <span>{{ formatoFechaCorta(item.fecha) }}</span>
            </template>
            <template v-slot:item.gravado="{ item }">
              <span>$ {{ formatoImporte(item.gravado) }}</span>
            </template>
            <template v-slot:item.exento="{ item }">
              <span>$ {{ formatoImporte(item.exento) }}</span>
            </template>
            <template v-slot:item.iva="{ item }">
              <span>$ {{ formatoImporte(item.iva) }}</span>
            </template>
            <template v-slot:item.total="{ item }">
              <span>$ {{ formatoImporte(item.total) }}</span>
            </template>
          </v-data-table>

        </v-tab-item>
        <v-tab-item value="posicion">
        </v-tab-item>
        <v-tab-item value="afip">
        </v-tab-item>
      </v-tabs>


      <!--
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        class="fg elevation-3"
        :footer-props="footerProps">
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
              class="fgb" v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                POSICIONES DE IVA
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

          <v-col cols="12" sm="12">
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
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table
              :headers="headersItems"
              :items="item.items"
              dense
              hide-default-footer>
              <template v-slot:item.nombre="{ item }">
                <span> {{ item.codigo=='1@1' ? item.texto : item.nombre }}</span>
              </template>
              <template v-slot:item.precio="{ item }">
                <span>${{ formatoImporte(item.precio) }}</span>
              </template>
              <template v-slot:item.total="{ item }">
                <span>${{ formatoImporte(item.total) }}</span>
              </template>
            </v-data-table>
          </td>
        </template>

        <template #item.nombre="{ value }">
          <div class="text-truncate" style="max-width: 170px">
            {{ value }}
          </div>
        </template>
        <template v-slot:item.fecha="{ item }">
          <span>{{ formatoFechaCorta(item.fecha) }}</span>
        </template>
        <template v-slot:item.gravado="{ item }">
          <span>$ {{ formatoImporte(item.gravado) }}</span>
        </template>
        <template v-slot:item.exento="{ item }">
          <span>$ {{ formatoImporte(item.exento) }}</span>
        </template>
        <template v-slot:item.iva="{ item }">
          <span>$ {{ formatoImporte(item.iva) }}</span>
        </template>
        <template v-slot:item.total="{ item }">
          <span>$ {{ formatoImporte(item.total) }}</span>
        </template>
      </v-data-table>
      -->

      <v-row class="pt-2 fg">
        <v-col v-for="(cbt, idx) in comprasventas" v-bind:key="idx">
          <v-card @click="selectCompraVenta(cbt.nombre)"
            max-width="300" class="fg mx-auto">
            <v-app-bar
              :color="cbt.nombre==filtroComprasVentasSel ? temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.nombre==filtroComprasVentasSel ? temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title
                v-if="cbt.nombre!='POSICION'">
                <v-icon>
                  {{cbt.nombre=='VENTAS'?'mdi-airplane-takeoff':'mdi-airplane-landing'}}
                </v-icon>
              </v-toolbar-title>
              <v-toolbar-title class="fg"
                v-else>
                <span>
                  Posición Fiscal
                </span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="text-capitalize ml-4"
                    v-show="cbt.nombre!='POSICION'"
                    fab small outlined
                    dense v-on="on"
                    @click="masInformacion(cbt)">
                    <span>DJ</span>
                  </v-btn>
                </template>
                <span class="fg">Declaración Jurada</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="text-capitalize mr-4 ml-4"
                    v-show="cbt.nombre!='POSICION'"
                    fab small outlined
                    dense v-on="on"
                    @click="generarCITI(cbt)">
                    <span>IDig</span>
                  </v-btn>
                </template>
                <span class="fg">Generar Iva Digital</span>
              </v-tooltip>

<!--
              <v-btn fab outlined x-small v-show="cbt.nombre!='POSICION'"
                class="mt-1"
                @click="masInformacion(cbt)">
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>
-->
<!--
              <v-spacer></v-spacer>
              <v-chip class="ml-0" label v-if="cbt.cerrado"
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark"
                @click="generarCITI(cbt)">
                <b>{{ accion(cbt, 'citi') }}</b><br>
              <br>
              </v-chip>
-->
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-show="cbt.nombre=='COMPRAS'"
                    class="text-capitalize mr-4 ml-4"
                    fab small outlined
                    dense v-on="on"
                    @click="abrirCerrar(cbt)">
                    <v-icon>{{cbt.cerrado?'mdi-lock-outline':'mdi-lock-open-outline'}}</v-icon>
                  </v-btn>
                </template>
                <span class="fg">
                  {{cbt.cerrado?'Abrir compras':'Cerrar compras'}}</span>
              </v-tooltip>
<!--
              <v-chip class="ml-0" label v-show="cbt.nombre!='COMPRAS'"
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark"
                @click="abrirCerrar(cbt)">
                <b>{{ accion(cbt,'iva') }}</b>
              </v-chip>
-->
            </v-app-bar>
            <v-container>
              <v-simple-table dense>
                <template v-slot:default>
                  <tbody>
                    <tr v-for="(d, idz) in cbt.det" v-bind:key="idz">
                      <td>{{d.nombre}}</td>
                      <td class="fgb right">$ {{ formatoImporte(d.total) }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
          </v-card>
        </v-col>

        <v-col>
          <v-card
            max-width="300" class="fg">
            <v-app-bar>
              <v-toolbar-title
                class="fg">AFIP
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom v-if="listoParaPresentar()">
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="text-capitalize mr-4 ml-4"
                    fab small outlined dense v-on="on"
                    @click="generarPresentacion(cbt)">
                    <v-icon>mdi-file-outline</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Generar Comprobante para Pago</span>
              </v-tooltip>
<!--
              <v-chip class="ml-0" label
                v-if="perFiscalListo(cbt)"
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark"
                @click="generarPresentacion(cbt)">
                <b>Presentar</b><br>
                <br>
              </v-chip>
-->
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-container>
              <v-simple-table dense>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <td>Presentado</td>
                      <td class="fgb right">{{presentacion.presentado ? 'Sí' : 'No'}}</td>
                    </tr>
                    <tr>
                      <td>Fecha</td>
                      <td class="fgb right">{{formatoFechaCorta(presentacion.fecha)}}</td>
                    </tr>
                    <tr>
                      <td>Importe</td>
                      <td class="fgb right">$ {{ formatoImporte(presentacion.importe) }}</td>
                    </tr>
                    <tr>
                      <td>Cpr</td>
                      <td class="fgb right">
                        {{presentacion.comprobante?presentacion.comprobante.cpr:'Pendiente'}}
                      </td>
                    </tr>
                    <tr>
                      <td>Pago</td>
                      <td class="fgb right">
                        {{presentacion.pago?presentacion.pago.cpr:'Pendiente'}}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <!-- DATOS DEL PERIODO -->
      <v-dialog v-model="dialogMasInfo" max-width="450px" persistent :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <v-toolbar flat
            :dark="temas.forms_titulo_dark==true"
            :color="temas.forms_titulo_bg">
            <v-btn
              icon @click="dialogMasInfo=false"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="headdline">
              MAS DATOS SOBRE EL PERIODO
            </span>
          </v-toolbar>
          <div>
            <v-data-table
              :headers="headersMasInfo"
              :items="masInfo"
              dense
              class="fg elevation-3 pl-0"
              :hide-default-footer="true"
              :items-per-page="25">
              <template v-slot:item.importe="{ item }">
                <span>${{ formatoImporte(item.importe) }}</span>
              </template>
            </v-data-table>
          </div>
        </v-card>
      </v-dialog>
      <!-- FIN DEL ERROR EN EL PEDIDO -->

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

import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import moment from 'moment';
import SBar from './../Forms/snackbar.vue';
import Confirmacion from "./../Forms/confirmacion.vue"
import XLSX from 'xlsx'
import jsPDF from 'jspdf'
import impresiones from "./../Forms/impresiones.vue";

export default {
  components: {
    SBar,
    Confirmacion,
    impresiones,
  },
  data: () => ({
    tabInicial: 'ventas',
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    items: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    expanded: [],
    singleExpand: false,
    progress: false,
    cen_activo_bg: '',
    cen_activo_color: '',
    cen_activo_dark: '',
    periodos: [],
    comprasventas: [
      { nombre: 'VENTAS', 
        det: [{ nombre: 'Gravado', total: 0 }, 
              { nombre: 'Exento',  total: 0 },
              { nombre: 'IVA',     total: 0 },
              { nombre: 'Total',   total: 0 }],
        masDet: [{ nombre: 'No Gravado', total: 0 },
                 { nombre: 'Ret.IVA', total: 0},
                 { nombre: 'Ret.Gan', total: 0},
                 { nombre: 'Ret.IIBB', total: 0},
                 { nombre: 'Imp.Interno', total: 0}],
        alicuotas: [{}],
        bg: '', dark: '', activo: true, cerrado: false, citi: false },
      { nombre: 'COMPRAS',
        det: [{ nombre: 'Gravado', total: 0 }, 
              { nombre: 'Exento',  total: 0 },
              { nombre: 'IVA',     total: 0 },
              { nombre: 'Total',   total: 0 }],
        masDet: [{ nombre: 'No Gravado', total: 0 },
                 { nombre: 'Ret.IVA', total: 0},
                 { nombre: 'Ret.Gan', total: 0},
                 { nombre: 'Ret.IIBB', total: 0},
                 { nombre: 'Imp.Interno', total: 0}],
        alicuotas: [{}],
        bg: '', dark: '', activo: true, cerrado: false, citi: false },
      { nombre: 'POSICION',
        det: [{ nombre: 'Gravado', total: 0 }, 
              { nombre: 'Exento',  total: 0 },
              { nombre: 'IVA',     total: 0 },
              { nombre: 'Total',   total: 0 }],
        masDet: [{ nombre: 'No Gravado', total: 0 },
                 { nombre: 'Ret.IVA', total: 0},
                 { nombre: 'Ret.Gan', total: 0},
                 { nombre: 'Ret.IIBB', total: 0},
                 { nombre: 'Imp.Interno', total: 0}],
        alicuotas: [{}],
        bg: '', dark: '', activo: true, cerrado: false },
    ],
    presentacion: {
      presentado: false,
      fecha: moment().format('L'),
      importe: 0,
      comprobante: null,
      pago: null,
    },
    filtroComprasVentasSel: 'VENTAS',
    formTitle: '',
    formTitleArt: '',
    formTitleMed: '',
    itemActual: null,
    tl: "text-lowercase",
    articulos: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    footerProps: {'items-per-page-options': [6]},
    search: '',               // para el cuadro de búsqueda de datatables
    dialogMasInfo: false,     // para que la ventana de dialogo o modal no aparezca automáticamente
    masInfo: [],

    perEstado: '',
    perAccion: '',
    perModulo: '',
    perFiscal: '',

    file: '',
    uploadPercentage: 0,

    // definimos los headers de la datatables
    headers: [
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 175 },
      { text: 'FECHA', value:'fecha', align: 'left', width: 89 },
      { text: 'NOMBRE', value:'tercero.nombre', align: 'left', width: 300 },
      { text: 'GRAVADO', value:'gravado', align: 'end', width: 120 },
      { text: 'EXENTO', value:'exento', align: 'end', width: 120 },
      { text: 'IVA', value:'iva', align: 'end', width: 120 },
      { text: 'TOTAL', value:'total', align: 'end', width: 120 },
    ],
    headersItems: [
      { text: 'Código', value:'articulo.codigo', class: 'grey lighten-3'},
      { text: 'Descripción', value:'articulo.nombre', class: "grey lighten-3"},
      { text: 'Ctt', value:'cantidad', align: 'end', class: "grey lighten-3"},
      { text: 'Precio', value:'precio', align: 'end', width: 120, class: "grey lighten-3"},
      { text: 'IVA', value:'iva.nombre', align: 'end', width: 120, class: "grey lighten-3"},
      { text: 'Total', value:'total', align: 'end', width: 120, class: "grey lighten-3"},
    ],
    headersMasInfo: [
      { text: 'Item', value:'item', class: 'grey lighten-3'},
      { text: 'importe', value:'importe', class: "grey lighten-3"},
    ],
   
    editedIndex: -1,
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
      'empresa',
      'datosEmpresa',
      'responsable',
      'cuit',
    ]),
  },

  watch: {
    '$store.state.sucursal' () {
      for (let i=0; i<=3; i++) {
        this.comprasventas[i].bg    = this.$store.state.temas.cen_panelcpr_bg
        this.comprasventas[i].dark  = this.$store.state.temas.cen_panelcpr_dark
      }
      this.comprasventas[0].activo = !this.sucursalDemo
      this.comprasventas[1].activo = !this.sucursalDemo
      this.comprasventas[2].activo = !this.sucursalDemo
    },

    search(val) {
      this.$store.commit("setCentrales", {ventas_buscar: val}, { root: true });
      this.listarHTTP()
    },

  },

  mounted () {
    //this.$events.listen('testEvent', eventData => console.log(eventData));
    if (this.sucursalDemo) {
      this.comprasventas[0].activo = false
      this.comprasventas[1].activo = false
      this.comprasventas[2].activo = false
    } else {
      this.comprasventas[0].activo = true
      this.comprasventas[1].activo = true
      this.comprasventas[2].activo = true
    }
    this.$store.commit('closeAlert')
    moment.locale('es');
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      this.leoAnios().then(data => {
        this.listarHTTP()
      })
    }
  },

  created () {
    this.cen_activo_bg          = this.$store.state.temas.cen_card_activo_bg
    this.cen_activo_dark        = this.$store.state.temas.cen_card_activo_dark
    for (let i=0; i<=2; i++) {
      this.comprasventas[i].bg    = this.$store.state.temas.cen_panelcpr_bg
      this.comprasventas[i].dark  = this.$store.state.temas.cen_panelcpr_dark
    }
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

    selectCompraVenta(cual) {
      if (cual=='POSICION') return
      this.filtroComprasVentasSel = cual
      if (cual=='COMPRAS') {
        this.filtroComprasVentas = ['CO','GS']
      } else if (cual=='VENTAS') {
        this.filtroComprasVentas = ['VE']
      }
      this.listarHTTP()
    },

    listarHTTP() {
      this.perFiscal = ''
      if (this.elMes==undefined || this.elMes=='') return
      let m = this.queMesEs(this.elMes)
      this.perFiscal = this.anio+m
      this.progress = true
      return HTTP().post('/posicionfiscal', {suc:this.sucursal,fil:this.filtroComprasVentasSel,per:this.perFiscal}).then(({data})=>{
        this.items = []
        this.progress = false
        for (let i=0; i<=this.comprasventas.length-1; i++) {
          for (let j=0; j<=this.comprasventas[i].det.length-1; j++) {
            this.comprasventas[i].det[j].total = 0
          }
          for (let j=0; j<=this.comprasventas[i].masDet.length-1; j++) {
            this.comprasventas[i].masDet[j].total = 0
          }
          this.comprasventas[i].alicuotas = []
        }
        for (let i=0; i<=data.length-1; i++) {
          if (this.filtroComprasVentasSel=='VENTAS' && data[i].tipo=='VE') {
            this.items.push(data[i])
          } else if (this.filtroComprasVentasSel=='COMPRAS' && (data[i].tipo=='CO' || data[i].tipo=='GS')) {
            this.items.push(data[i])
          }
          if (data[i].tipo=='VE') {

            this.comprasventas[0].det[0].total += data[i].gravado
            this.comprasventas[0].det[1].total += data[i].exento
            this.comprasventas[0].det[2].total += data[i].iva
            this.comprasventas[0].det[3].total += data[i].total

            this.comprasventas[0].masDet[0].total += data[i].nogravado
            this.comprasventas[0].masDet[1].total += data[i].retiva
            this.comprasventas[0].masDet[2].total += data[i].retgan
            this.comprasventas[0].masDet[3].total += data[i].retib
            this.comprasventas[0].masDet[4].total += data[i].impint

            this.comprasventas[2].det[0].total += data[i].gravado
            this.comprasventas[2].det[1].total += data[i].exento
            this.comprasventas[2].det[2].total += data[i].iva
            this.comprasventas[2].det[3].total += data[i].total

            for (let y=0; y<=data[i].afipiva.length-1; y++) {
              let pos = this.comprasventas[0].alicuotas.findIndex(x => x.tasa === data[i].afipiva[y].afipiva.tasa)
              if (pos==-1) {
                this.comprasventas[0].alicuotas.push({
                  tasa: data[i].afipiva[y].afipiva.tasa,
                  gravado: data[i].afipiva[y].base,
                  iva: data[i].afipiva[y].iva
                })
              } else {
                this.comprasventas[0].alicuotas[pos].gravado += data[i].afipiva[y].base;
                this.comprasventas[0].alicuotas[pos].iva += data[i].afipiva[y].iva;
              }
            }

          } else {

            this.comprasventas[1].det[0].total += data[i].gravado
            this.comprasventas[1].det[1].total += data[i].exento
            this.comprasventas[1].det[2].total += data[i].iva
            this.comprasventas[1].det[3].total += data[i].total

            this.comprasventas[1].masDet[0].total += data[i].nogravado
            this.comprasventas[1].masDet[1].total += data[i].retiva
            this.comprasventas[1].masDet[2].total += data[i].retgan
            this.comprasventas[1].masDet[3].total += data[i].retib
            this.comprasventas[1].masDet[4].total += data[i].impint

            this.comprasventas[2].det[0].total -= data[i].gravado
            this.comprasventas[2].det[1].total -= data[i].exento
            this.comprasventas[2].det[2].total -= data[i].iva
            this.comprasventas[2].det[3].total -= data[i].total

            for (let y=0; y<=data[i].afipiva.length-1; y++) {
              let pos = this.comprasventas[1].alicuotas.findIndex(x => x.tasa === data[i].afipiva[y].afipiva.tasa)
              if (pos==-1) {
                this.comprasventas[1].alicuotas.push({
                  tasa: data[i].afipiva[y].afipiva.tasa,
                  gravado: data[i].afipiva[y].base,
                  iva: data[i].afipiva[y].iva
                })
              } else {
                this.comprasventas[1].alicuotas[pos].gravado += data[i].afipiva[y].base;
                this.comprasventas[1].alicuotas[pos].iva += data[i].afipiva[y].iva;
              }
            }

          }
        }

        let pos = this.periodos.find(p => p.perfiscal == this.perFiscal)
        if (pos) {
          
          this.comprasventas[0].cerrado = pos.vencerrado
          this.comprasventas[1].cerrado = pos.comcerrado
          
          this.comprasventas[0].citi = pos.venciti
          this.comprasventas[1].citi = pos.comciti
        
        } else {
          
          this.comprasventas[0].cerrado = false
          this.comprasventas[1].cerrado = false
          
          this.comprasventas[0].citi = false
          this.comprasventas[1].citi = false
        
        }

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
      return p
    },

    leoAnios() {
      return HTTP().post('anios/', {tipo: 'A'}).then(({ data }) => {
        this.anios = []
        this.meses = []
        this.periodos = []
        let per = []
        let pos = -1
        for (let i=0; i<=data[0].length-1; i++) {
          per.push(data[0][i].perfiscal)
          pos = this.anios.findIndex( x => x == data[0][i].perfiscal.substring(0,4))
          if (pos==-1) {
            this.anios.push(data[0][i].perfiscal.substring(0,4))
          }
        }
        for (let i=0; i<=per.length-1; i++) {
          if (per[i].substring(0,4)==this.anios[0]) {
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
        return HTTP().post('/periodos/').then(({ data }) => {
          if (data) {
            this.periodos = data
            this.presentacion.presentado  = data[0].presentado
            this.presentacion.fecha       = data[0].fecha
            this.presentacion.importe     = data[0].importe
            this.presentacion.comprobante = data[0].comprobante
            this.presentacion.pago        = data[0].pago
            this.anio = this.anios[0]
            this.elAnio = this.anio
            this.elMes = this.meses[0]
          }
        })
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
        if (this.periodos[i].perfiscal.substring(0,4)==this.anio) {
          let pos = Number(this.periodos[i].perfiscal.substring(4))-1
          this.meses.push(this.losMeses[pos])
        }
      }
      this.elMes = this.meses[0]
      this.elAnio = this.anio
      this.listarHTTP(false)
    },

    setMes(mes) {
      this.elMes = mes
      this.listarHTTP()
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
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

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },

    print(item) {
      this.$refs.impresion.ventasPrint(item, 'yo');
    },

    accion(cbt, cual) {
      let ret = ''
      if (cbt!=null) {
        if (cbt.nombre=='POSICION') {
          return
        } else if (cbt.nombre=='VENTAS') {
          if (cual=='iva') {
            if (cbt.cerrado) {
              ret = 'Abrir'
            } else {
              ret = 'Cerrar'
            }
          } else if (cual=='citi') {
            if (cbt.citi) {
              ret = 'Ver CITI'
            } else {
              ret = 'Generar CITI'
            }
          }
        } else if (cbt.nombre=='COMPRAS') {
          if (cual=='iva') {
            if (cbt.cerrado) {
              ret = 'Abrir'
            } else {
              ret = 'Cerrar'
            }
          } else if (cual=='citi') {
            if (cbt.citi) {
              ret = 'Ver CITI'
            } else {
              ret = 'Generar CITI'
            }
          }
        }
        return ret
      }
    },

    abrirCerrar(cbt) {
      this.perEstado = cbt.cerrado ? 'cerrado' : 'abierto'
      this.perAccion = cbt.cerrado ? 'abrir'   : 'cerrar'
      this.perModulo = cbt.nombre
      let m = ''
      this.msg.msgTitle = 'Cambiar estado del Período'
      m  = '<br>El período esta <b>' + this.perEstado + '</b> para el módulo <b>' + this.perModulo + '</b>.<br><br>'
      m += 'IMPORTANTE: Cuando el módulo este cerrado ninguna operación podrá ser ingresada '
      m += 'o modificada para el período especificado.<br>'
      m += 'No obstante puede abrir o cerrar el módulo cuando lo crea necesario,'
      m += 'siempre y cuando el mismo no este PRESENTADO.<br><br>'
      m += 'Confirma ' + this.perAccion + ' el módulo seleccionado?<br><br>'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'cambiar estado'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = cbt
    },

    generarCITI(cbt) {
      if (this.perEstado=='Abierto') {
        this.msg.msgTitle = 'El periodo esta Abierto'
        this.msg.msgBody = 'El período debe estar cerrado para poder generar el CITI'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'periodo abierto'
        this.msg.msgButtons = ['Aceptar','Cancelar']
        this.itemActual = item
      } else {
        this.file = this.userId+'_'+this.perFiscal+'_CITI'+cbt.nombre
        this.perModulo = cbt.nombre
        let m = ''
        this.msg.msgTitle = 'Generar archivo CITI'
        m  = '<br>Confirma generar el CITI </b>' + cbt.nombre + ' para el período '+this.perFiscal+'</b>.<br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'generar citi'
        this.msg.msgButtons = ['Aceptar','Cancelar']
        this.itemActual = cbt
      }
    },

    perFiscalListo(cbt) {
      return this.perFiscal<moment().format('YYYYMM')
    },

    listoParaPresentar()  {
      if (this.presentacion.comprobante==null && this.comprasventas[2].det[2].total>0) {
        return true
      } else {
        return false
      }
      //return (this.presentacion.comprobante==null)&&(this.comprasventas[2].det[2].total>0)?false:true
    },

    generarPresentacion(cbt) {
      if (this.perEstado=='Abierto') {
        this.msg.msgTitle = 'El periodo esta Abierto'
        this.msg.msgBody = 'El período debe estar cerrado para poder generar el CITI'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'periodo abierto'
        this.msg.msgButtons = ['Aceptar','Cancelar']
        this.itemActual = item
      }
    },

    async msgRespuesta(op) {

      if (op==='Aceptar') {
        
        if (this.msg.msgAccion=='cambiar estado') {
          this.comprasventas[0].det[0].total = this.roundTo(this.comprasventas[0].det[0].total,2)
          this.comprasventas[0].det[1].total = this.roundTo(this.comprasventas[0].det[1].total,2)
          this.comprasventas[0].det[2].total = this.roundTo(this.comprasventas[0].det[2].total,2)
          this.comprasventas[0].det[3].total = this.roundTo(this.comprasventas[0].det[3].total,2)

          this.comprasventas[1].det[0].total = this.roundTo(this.comprasventas[1].det[0].total,2)
          this.comprasventas[1].det[1].total = this.roundTo(this.comprasventas[1].det[1].total,2)
          this.comprasventas[1].det[2].total = this.roundTo(this.comprasventas[1].det[2].total,2)
          this.comprasventas[1].det[3].total = this.roundTo(this.comprasventas[1].det[3].total,2)

          this.comprasventas[2].det[0].total = this.roundTo(this.comprasventas[2].det[0].total,2)
          this.comprasventas[2].det[1].total = this.roundTo(this.comprasventas[2].det[1].total,2)
          this.comprasventas[2].det[2].total = this.roundTo(this.comprasventas[2].det[2].total,2)
          this.comprasventas[2].det[3].total = this.roundTo(this.comprasventas[2].det[3].total,2)

          return HTTP().post('/posicionfiscalcambiarestado/', {
            periodo: this.perFiscal,
            estado: this.perEstado,
            accion: this.perAccion,
            modulo: this.perModulo,
            datos: this.comprasventas, }).then(({ data }) => {

            this.comprasventas[0].cerrado = data.vencerrado
            this.comprasventas[1].cerrado = data.comcerrado
            this.msg.msgVisible = false;

            return HTTP().post('/periodos/').then(({ data }) => {
              if (data) {
                this.periodos = data
                this.presentacion.presentado  = data[0].presentado
                this.presentacion.fecha       = data[0].fecha
                this.presentacion.importe     = data[0].importe
                this.presentacion.comprobante = data[0].comprobante
                this.presentacion.pago        = data[0].pago
              }
            })

          })

        } else if (this.msg.msgAccion=='generar citi') {

          let cab = ''
          let det = ''
          let tmp = ''
          let ali = []
          for (let i=0; i<=this.items.length-1; i++) {

            if (this.perModulo == 'VENTAS') {

              cab += moment(this.items[i].fecha).format('YYYYMMDD')
              cab += this.items[i].comprobante.codigo
              cab += '0'+this.items[i].cpr.substr(6,4)
              cab += '000000000000'+this.items[i].cpr.substr(11,8)
              cab += '000000000000'+this.items[i].cpr.substr(11,8)
              cab += this.items[i].documento.codigo
              
              tmp = '00000000000000000000'+this.items[i].tercero.cuit.trim()
              tmp = tmp.substring(tmp.length-20,tmp.length)
              cab += tmp
  
              tmp = this.items[i].tercero.nombre.trim()
              tmp += '                              '
              tmp = tmp.substring(0,30)                       // nommbre
              cab += tmp
              cab += this.importe(this.items[i].total,15)     // total
              cab += '000000000000000'                        // conceptos que no integran el precio neto gravado
              cab += '000000000000000'                        // percepcion a no categorizados
              cab += this.importe(this.items[i].exento,15)    // exento
              cab += '000000000000000'                        // percepciones o pagos a cuenta de impuestos nacionales
              cab += '000000000000000'                        // percepciones de ingresos brutos
              cab += '000000000000000'                        // percepciones de impuestos municipales
              cab += '000000000000000'                        // impuestos internos
              cab += this.items[i].moneda.codigo
              cab += '0001000000'                             // tipo de cambio, va fijo
  
              ali = []
              for (let j=0; j<=this.items[i].items.length-1; j++) {
                if (ali.indexOf(this.items[i].items[j].iva_id)==-1) {
                  ali.push(this.items[i].items[j].iva_id)
                }
                det += this.items[i].comprobante.codigo
                det += '0'+this.items[i].cpr.substr(6,4)
                det += '000000000000'+this.items[i].cpr.substr(11,8)
                det += this.importe(this.items[i].items[j].total,15)   // total
                det += this.importe(this.items[i].items[j].iva.tasa,4) // alicuota de iva
                det += this.importe(this.items[i].items[j].total*(1+(this.items[i].items[j].iva.tasa/100)),15) // impuesto liquidado
                det += "\n"
              }
  
              cab +=  ali.length                              // cantidad de alicuotas de iva
              if (this.items[i].exento!=0) {
                cab += 'E'
              } else {
                cab += '1'
              }
  
              cab += '000000000000000'                        // Otros tributos
              cab += moment(this.items[i].fecha).format('YYYYMMDD')
              cab += "\n"

            } else {    // COMPRAS

              cab += moment(this.items[i].fecha).format('YYYYMMDD')
              cab += this.items[i].comprobante.codigo
              cab += '0'+this.items[i].cpr.substr(6,4)
              cab += '000000000000'+this.items[i].cpr.substr(11,8)
              cab += '                '
              cab += this.items[i].documento.codigo
              tmp = '00000000000000000000'+this.items[i].tercero.cuit.trim()
              tmp = tmp.substring(tmp.length-20,tmp.length)
              cab += tmp
  
              tmp = this.items[i].tercero.nombre.trim()
              tmp += '                              '
              tmp = tmp.substring(0,30)                       // nommbre
              cab += tmp
              cab += this.importe(this.items[i].total,15)     // total
              cab += '000000000000000'                        // conceptos que no integran el precio neto gravado
              cab += this.importe(this.items[i].exento,15)    // exento
              cab += '000000000000000'                        // percepciones o pagos a cuenta del IVA
              cab += '000000000000000'                        // percepciones o pagos a cuenta de impuestos nacionales
              cab += '000000000000000'                        // percepciones de ingresos brutos
              cab += '000000000000000'                        // percepciones de impuestos municipales
              cab += '000000000000000'                        // impuestos internos
  
              cab += this.items[i].moneda.codigo              // codigo de moneda
              cab += '0001000000'                             // tipo de cambio, va fijo
  
              ali = []
              for (let j=0; j<=this.items[i].items.length-1; j++) {
                if (ali.indexOf(this.items[i].items[j].iva_id)==-1) {
                  ali.push(this.items[i].items[j].iva_id)
                }

                det += this.items[i].comprobante.codigo
                det += '0'+this.items[i].cpr.substr(6,4)
                det += '000000000000'+this.items[i].cpr.substr(11,8)
                det += this.items[i].documento.codigo

                tmp = '00000000000000000000'+this.items[i].tercero.cuit.trim()
                tmp = tmp.substring(tmp.length-20,tmp.length)
                det += tmp

                det += this.importe(this.items[i].items[j].total,15)   // total
                det += this.importe(this.items[i].items[j].iva.tasa,4) // alicuota de iva
                det += this.importe(this.items[i].items[j].total*((this.items[i].items[j].iva.tasa/100)),15) // impuesto liquidado
                det += "\n"

              }
  
              cab +=  ali.length                              // cantidad de alicuotas de iva
              if (this.items[i].exento!=0) {
                cab += 'E'
              } else {
                cab += '1'
              }
              cab += '000000000000000'                        // credito fiscal computable
              cab += '000000000000000'                        // Otros tributos
              cab += '00000000000'                            // cuit emisor
              cab += '                              '         // nombre del emisor
              cab += '000000000000000'                        // iva comision
              cab += "\n"
            }
          }

          await HTTP().post('/generarciti', { 
            file: this.file,
            cab: cab,
            det: det,
            periodo: this.perFiscal,
            modulo: this.perModulo,
            })
            .then((data)=> {
              if (data) {
                this.msg.msgTitle = 'Atención'
                this.msg.msgBody = '¡Archivo CITI generado correctamente!'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'CITI ok'
                this.msg.msgButtons = ['Aceptar']
                this.itemActual = item
              } else if (data=='error') {
                this.msg.msgTitle = 'Error'
                this.msg.msgBody = '¡Se ha producido un error al generar el archivo CITI!'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'CITI Error'
                this.msg.msgButtons = ['Aceptar']
                this.itemActual = item
              }
              this.listarHTTP()
            })
        }
      }
      this.msg.msgVisible = false;
    },

    importe(i,l) {
      let imp = ''
      let tmp = ''
      imp = this.roundTo(i,2)
      imp = this.roundTo(Math.abs(imp)*100,2)
      if (l==15) {
        tmp = '000000000000000'+imp
      } else {
        tmp = '0000'+imp
      }
      //tmp = tmp.substring(tmp.length-l)
      tmp = tmp.substring(tmp.length-l,tmp.length)
      return tmp
    },

    masInformacion(cbt) {
      this.msg.msgTitle = 'Mas información: '+cbt.nombre+' - '+this.elMes+'/'+this.elAnio
      let p = cbt.nombre == 'VENTAS' ? 0 : 1
      this.masInfo = []
      this.masInfo.push({item: 'No Gravado',       importe: this.comprasventas[p].masDet[0].total})
      this.masInfo.push({item: 'Ret.IVA',          importe: this.comprasventas[p].masDet[1].total})
      this.masInfo.push({item: 'Ret.de Ganancias', importe: this.comprasventas[p].masDet[2].total})
      this.masInfo.push({item: 'Ret.de IIBB',      importe: this.comprasventas[p].masDet[3].total})
      this.masInfo.push({item: 'Imp.Internos',     importe: this.comprasventas[p].masDet[4].total})
      this.masInfo.push({item: 'Gravado',          importe: this.comprasventas[p].det[0].total})
      for (let i=0; i<=this.comprasventas[p].alicuotas.length-1; i++) {
        this.masInfo.push({
          item: '...al '+this.comprasventas[p].alicuotas[i].tasa+'%',
          importe: this.comprasventas[p].alicuotas[i].gravado},
        )
      }
      this.masInfo.push({item: 'Exento',           importe: this.comprasventas[p].det[1].total})
      this.masInfo.push({item: 'IVA',              importe: this.comprasventas[p].det[2].total})
      for (let i=0; i<=this.comprasventas[p].alicuotas.length-1; i++) {
        this.masInfo.push({
          item: '...al '+this.comprasventas[p].alicuotas[i].tasa+'%',
          importe: this.comprasventas[p].alicuotas[i].iva},
        )
      }
      this.masInfo.push({item: 'TOTAL',            importe: this.comprasventas[p].det[3].total})
      this.dialogMasInfo = true
    },
  },
};

</script>
<style scoped>
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fgb {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
    font-weight: bold;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .right {
    text-align: right;
    margin-right: 1em;
  }
</style>