<template>
  <!-- eslint-disable max-len -->
  <v-layout align-start class="fg ma-0">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :single-expand="false"
        :expanded.sync="expanded"
        show-expand
        dense
        class="elevation-1 fg"
        :footer-props="{
          itemsPerPageOptions: [13],
          showFirstLastPage: true,
          showCurrentPage: true,
          nextIcon: 'mdi-arrow-right-drop-circle-outline',
          prevIcon: 'mdi-arrow-left-drop-circle-outline',
        }"
        @item-expanded="setMaletin"
        @click:row="maletinClick">
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
            <template v-slot:extension>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="nuevoMaletin" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Nuevo Maletín</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="planillaDeRecaudacion(item)" v-on="on">
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Planilla Mensual</span>
              </v-tooltip>
            </template>

            <v-toolbar-title
              :color="temas.forms_titulo_bg"
              :dark="temas.forms_titulo_dark==true"
              v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                <v-icon left>
                  mdi-briefcase
                </v-icon>
                <b>Maletines</b>
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

            <!-- DIALOG NUEVO MALETIN -->
            <v-dialog v-model="dialog" max-width="500px" :transition="transition==null?'false':transition">
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
                  Nuevo Maletín de {{ operario }}
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="editado.user_id!=null&&editado.fecha!=null"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarMaletinHTTP()">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card class="fg">
                <v-form ref="art3">
                  <v-card-text>
                    <v-row>
                      <v-col cols="2" offset="4" sm="4" md="4" class="pt-6 pb-6">
                        <v-text-field
                          ref="fecha"
                          type="date"
                          autofocus
                          v-model="editado.fecha"
                          label="Fecha"
                          @change="fechavalida()">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG NUEVO MALETIN -->

            <!-- RECAUDACION DE VALORES -->
            <v-dialog v-model="dialogClientes" max-width="1390px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card class="fg" height="700px">

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cerrarNUS()"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span>
                    Nuevo Retiro de Valores - Maletín Número
                    {{ itemActual!=null?itemActual.id:0 }}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="valoresHabilitados()"
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text"
                    @click="guardarActualizarValoresHTTP()">
                    Guardar
                  </v-btn>
                </v-toolbar>

                <v-card flat>
                  <v-card-text>
                    <v-row>

                      <v-col cols="6" sm="6" md="6"
                        class="fg pt-0 pb-0">
                        <v-autocomplete
                          ref="cliente"
                          v-model="editadoRet.tercero_id"
                          autofocus
                          :items="itemsTerceros"
                          :loading="isLoadingTerceros"
                          :search-input.sync="searchTerceros"
                          item-text="razon_social"
                          item-value="id"
                          label="Nombre del Cliente"
                          :color="temas.forms_titulo_bg"
                          placeholder="Escriba para buscar"
                          prepend-icon="mdi-database-search"
                          auto-select-first
                          clearable
                          v-on:keydown.tab="buscoSiElTerceroEstaVinculado">
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="2" sm="2" md="2"
                        class="fg pt-3">
                        <v-btn
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          @click="verClientesPendientesHTTP()">
                          Ver Pendientes
                        </v-btn>
                      </v-col>

                      <v-col cols="2" sm="2" md="2" v-if="editadoRet.tercero_id!=null"
                        class="fg pt-5">
                        <span>Usa el sistema{{'\xa0'}}{{'\xa0'}}</span>
                        <v-chip class="ml-0" label
                          :color="temas.barra_principal_bg"
                          :dark="temas.barra_principal_dark">
                          <b>{{ usaElSistema?'Sí':'No' }}</b>
                        </v-chip>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12">
                        <v-data-table
                          :headers="headersValores"
                          :items="valoresPendientes"
                          dense
                          class="elevation-1">
                          <template v-slot:item.cpr="{ item }">
                            <span class="fg">{{ kit.cpr(item.cpr) }}</span>
                          </template>
                          <template v-slot:item.fecha="{ item }">
                            <span class="fg">{{ formatoFecha(item.fecha) }}</span>
                          </template>
                          <template v-slot:item.importe="{ item }">
                            <span class="fg">${{ formatoImporte(item.importe) }}</span>
                          </template>
                          <template v-slot:item.accion="{item}">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab x-small class="mr-2"
                                  :color="item.sel?temas.cen_btns_bg:temas.cen_card_activo_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  @click="selectValor(item)" v-on="on">
                                  <v-icon>mdi-checkbox-marked-outline</v-icon>
                                </v-btn>
                              </template>
                              <span>Seleccionar</span>
                            </v-tooltip>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card>
            </v-dialog>
            <!-- FIN RECAUDACION DE VALORES -->

            <!-- SELECCION DE CLIENTES -->
            <v-dialog v-model="dialogSeleccionCliente" max-width="970px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card class="fg">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogSeleccionCliente=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span>Clientes Pendientes</span>
                </v-toolbar>
                <v-card flat>
                  <v-card-text>
                    <v-row>
                      <v-data-table
                        :headers="headersClientesPendientes"
                        :items="clientesPendientesMaletin"
                        dense
                        class="elevation-1"
                        :footer-props="{
                          itemsPerPageOptions: [13],
                          showFirstLastPage: true,
                          showCurrentPage: true,
                          nextIcon: 'mdi-arrow-right-drop-circle-outline',
                          prevIcon: 'mdi-arrow-left-drop-circle-outline',
                        }">
                        <template v-slot:top></template>
                        <template v-slot:item.cpr="{ item }">
                          <span class="fg"> {{ kit.cpr(item.cpr) }} </span>
                        </template>
                        <template v-slot:item.accion="{ item }">
                          <v-tooltip v-if="!item.cargado">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small
                                :color="item.cargado?'red':'green'"
                                :dark="temas.cen_btns_dark==true"
                                class="mr-2"
                                @click="seleccionarCliente(item)" v-on="on">
                                <v-icon>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                            <span>Seleccionar</span>
                          </v-tooltip>
                        </template>
                      </v-data-table>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card>
            </v-dialog>
            <!-- FIN SELECCION CLIENTES -->


            <!-- FORMULARIO DE INGRESO DE VALORES NUS -->
            <v-dialog v-model="dialogAgregarValoresNUS" max-width="450px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card class="fg" height="450px">

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogAgregarValoresNUS=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span>Valor Entregado</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="valoresHabilitados()"
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text"
                    @click="guardarActualizarValoresHTTP()">
                    Guardar
                  </v-btn>
                </v-toolbar>

                <v-card flat>
                  <v-card-text>

                    <v-row>
                      <v-col cols="8" offset="2" sm="8" md="8"
                        class="fg pt-6">
                        <v-select
                          label='Sucursal'
                          autofocus
                          :color="temas.forms_titulo_bg"
                          v-model="editadoNUS.sucursal_id"
                          :items="sucursales"
                          item-value="id"
                          item-text="nombre"
                          @change="valoresHabilitados()">
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="8" offset="2" sm="8" md="8"
                        class="fg pt-0">
                        <v-select
                          label="Medio"
                          v-model="editadoNUS.medio_id"
                          :color="temas.forms_titulo_bg"
                          :items="medpag"
                          item-value="id"
                          item-text="nombre"
                          @change="valoresHabilitados()">
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-row v-if="editadoNUS.medio_id!=1">
                      <v-col cols="8" offset="2" sm="8" md="8"
                        class="fg pt-0">
                        <v-text-field
                          v-model="editadoNUS.observ"
                          :label="sayObserv">
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="4" offset="2" sm="4" md="4"
                        class="fg pt-6">
                        <v-text-field
                          v-model="editadoNUS.saldo"
                          disabled
                          label="Saldo">
                        </v-text-field>
                      </v-col>

                      <v-col cols="4" sm="4" md="4"
                        class="fg pt-6">
                        <v-text-field
                          v-model="editadoNUS.importe"
                          label="Importe"
                          @change="valoresHabilitados()">
                        </v-text-field>
                      </v-col>
                    </v-row>

                  </v-card-text>
                </v-card>
              </v-card>
            </v-dialog>
            <!-- FIN FORMULARIO DE INGRESO DE VALORES NUS -->
          </v-toolbar>

          <v-row class="pt-2 pl-2">
            <v-col cols="6" sm="6">  <!-- Barra de búsqueda  -->
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar"
                :color="temas.forms_titulo_bg"
                class="pt-0"
                single-line hide-details>
              </v-text-field>
            </v-col>
          </v-row>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table
              :headers="headersClientes"
              :items="item.clientes"
              dense
              @click:row="recaudacionClick">
              <template v-slot:item.valor.ingresados.cpr="{ item }">
                <span class="fg">{{ item.valor?kit.cpr(item.valor.ingresados.cpr):'Pendiente' }}</span>
              </template>
              <template v-slot:item.importe="{ item }">
                <span class="fg">${{ formatoImporte(item.importe) }}</span>
              </template>
              <template v-slot:item.valor.observ="{ item }">
                <span class="fg">{{ item.valor?item.valor.observ:item.observ }}</span>
              </template>
              <template v-slot:item.accion="{ item }">

                <v-tooltip bottom v-if="!item.valor&&operarioUserId==cobrador_id">
                  <template v-slot:activator="{ on }">
                    <v-btn icon small outlined
                      @click.stop="editarRecaudacion(item)" v-on="on">
                      <v-icon>mdi-18px mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>

                <v-tooltip bottom v-if="!item.valor&&operarioUserId==cobrador_id">
                  <template v-slot:activator="{ on }">
                    <v-btn icon small outlined
                      @click.stop="borrarRecaudacion(item)" v-on="on">
                      <v-icon>mdi-18px mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Borrar</span>
                </v-tooltip>

                <v-tooltip bottom
                  v-if="item.valor!=null&&operarioUserId==cobrador_id&&item.estado!='K'">
                  <template v-slot:activator="{ on }">
                    <v-btn icon small outlined
                      @click.stop="desmarcarRecaudacion(item)" v-on="on">
                      <v-icon>mdi-18px mdi-cancel</v-icon>
                    </v-btn>
                  </template>
                  <span>Desmarcar</span>
                </v-tooltip>

                <v-tooltip bottom v-if="operarioArea=='A'||operario=='CEO'">
                  <template v-slot:activator="{ on }">
                    <v-btn icon small outlined
                      @click.stop="chequear(item)" v-on="on">
                      <v-icon>{{ item.estado=='K'?'mdi-18px mdi-check':'mdi-close'}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ item.estado=='P'?'Chequear':'Quitar Chequeo'}}</span>
                </v-tooltip>

              </template>
            </v-data-table>
          </td>
        </template>

        <!-- BOTONES DE LA GRID PRINCIPA  L-->
        <template v-slot:item.accion="{ item }">
          <v-tooltip bottom v-if="item.estado=='P'&&item.cobrador.id==operarioUserId">
            <template v-slot:activator="{ on }">
              <v-btn icon small outlined
                @click.stop="nuevaRecaudacion(item)" v-on="on">
                <v-icon>mdi-18px mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Nuevo Retiro de Valores</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon small outlined
                @click.stop="planillaDeRecaudacion(item)" v-on="on">
                <v-icon>mdi-18px mdi-printer</v-icon>
              </v-btn>
            </template>
            <span>Planilla</span>
          </v-tooltip>
          <v-tooltip bottom v-if="item.estado=='P'&&item.importe==0">
            <template v-slot:activator="{ on }">
              <v-btn icon small outlined
                @click.stop="borrarMaletin(item)" v-on="on">
                <v-icon>mdi-18px mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Borrar Maletín</span>
          </v-tooltip>

          <v-tooltip bottom v-if="operarioArea=='A'||operario=='CEO'">
            <template v-slot:activator="{ on }">
              <v-btn icon small outlined
                @click.stop="marcarTodos(item)" v-on="on">
                <v-icon>{{ item.estado=='K'?'mdi-18px mdi-thumb-up':'mdi-18px mdi-thumb-down'}}</v-icon>
              </v-btn>
            </template>
            <span>
              {{ item.estado=='K'?
              'Marcar a todos como no recibidos':
              'Marcar a todos como recibidos'}}
            </span>
          </v-tooltip>

        </template>

        <template v-slot:item.importe="{ item }">
          <span class="fg">
            $ {{ formatoImporte(item.importe) }}
          </span>
        </template>

        <template v-slot:item.estado="{ item }">
          <v-chip
            fab
            class="fg85"
            :color="getEstado(item.estado,'c')"
            :dark="getEstado(item.estado,'k')">
            <b>{{ getEstado(item.estado,'e') }}</b>
          </v-chip>
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
import { runInThisContext } from 'vm';

export default {
  components: {
    SBar,
    Confirmacion,
    Mail,
    impresiones,
  },
  data: () => ({
    agregando: false,
    color: { 10: 'purple', 40: 'blue', 30: 'green' },
    expanded: [],
    progress: false,
    cobrador_id: null,
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    cliente: null,
    acciones: [],
    equipo: [],
    clientes: [],
    items: [],

    clientesPendientesMaletin: [],

    itemActual: null,
    itemActualValor: null,
    msg: { msgAccion: null, msgVisible: false, msgTitle: '', msgBody: '', msgButtons: [''] },
    search: '',
    dialog: false,
    dialogValores: false,
    dialogClientes: false,
    dialogAgregarValoresNUS: false,
    dialogSeleccionCliente: false,

    usaElSistema: false,

    buscarPor: '',
    isLoadingTerceros: false,
    entriesTerceros: [],
    userDelTercero: 0,
    userDelTerceroDatos: null,
    searchTerceros: '',

    valoresPendientes: [],

    saldoctacte: 0,
    disponible: 0,
    creditomaximo: 0,
    tienesaldo: 0,

    editado: {
      fecha: '', user_id: null, cobrador_id: null, estado: null
    },

    editadoRet: {
      id: null, maletin_id: null, tercero_id: null, sucursal_id: null, recibo_id:null, valor_id: null, medio_id:null, observ: null, estado: null
    },

    editadoNUS: {
      id: null, maletin_id: null, cliente_id: null, sucursal_id: null, medio_id: null, observ: null, importe: null, saldo: null
    },

    editadoNUSDefault: {
      id: null, maletin_id: null, cliente_id: null, sucursal_id: null, medio_id: null, observ: null, importe: null
    },

    editadoValor: [],

    editadoRetDefault: {
      id: null, maletin_id: null, tercero_id: null, sucursal_id: null, recibo_id:null, valor_id: null, medio_id:null, observ: null, estado: null
    },

    /*ok*/
    headers: [
      { text: 'Id', value:'id', align: 'end', width: 70},
      { text: 'Fecha', value:'fecha', align: 'left', width: 110},
      { text: 'Cobrador', value:'cobrador.username', align: 'left', width: 150},
      { text: 'Estado', value:'estado', align: 'left', width: 200},
      { text: 'TOTAL MALETIN', value:'importe', align: 'end', width: 100},
      { text: 'Opciones', value:'accion', align: 'left', width: 100},
    ],

    /*ok*/
    headersClientes: [
      { text: 'Cliente', value:'cliente.nombre', align: 'left', width: 190 },
      { text: 'Sucsal', value:'sucursal.id', align: 'left', width: 60 },
      { text: 'Recibo', value:'valor.ingresados.cpr', align: 'left', width: 115 },
      { text: 'Medio', value:'medio.abrev', align: 'left', width: 50 },
      { text: 'Detalles', value:'valor.observ', align: 'left', width: 430 },
//    { text: 'Observ', value:'observ', align: 'left', width: 150 },
      { text: 'Importe', value:'importe', align: 'end', width: 120 },
//    { text: 'Chk', value:'estado', align: 'end', width: 60 },
      { text: 'Acciones', value:'accion', align: 'left', width: 90},
    ],

    /*ok*/
    headersClientesPendientes: [
      { text: 'ID', value:'id', align: 'end', width: 90 },
      { text: 'Nombre', value:'nombre', align: 'left', width: 350 },
      { text: 'Cpr', value:'cpr', align: 'left', width: 150 },
      { text: 'Vencimiento', value:'vencimiento', align: 'left', width: 130 },
      { text: 'Pendiente', value:'pendiente', align: 'end', width: 150 },
      { text: 'Sel', value:'accion', align: 'left', width: 80},
    ],

    /*ok*/
    headersValores: [
//    { text: 'Id', value:'id', align: 'left', width: 80 },
      { text: 'Fecha', value:'fecha', align: 'left', width: 98 },
      { text: 'Cpr', value:'cpr', align: 'left', width: 98 },
      { text: 'MP', value:'abrev', align: 'left', width: 40 },
      { text: 'Observ', value:'observ', align: 'left', width: 400 },
      { text: 'Importe', value:'importe', align: 'end', width: 120 },
      { text: 'Acciones', value:'accion', align: 'left', width: 80},
    ],

    medpag: [
      {id:1, nombre: 'Efectivo',         activo: true,  tipo:'CAJ', total: 0},
      {id:2, nombre: 'Tarj.de Crédito',  activo: true,  tipo:'TDC', total: 0},
      {id:3, nombre: 'Tarj.de Débito',   activo: true,  tipo:'TDD', total: 0},
//    {id:4, nombre: 'Cuenta Corriente', activo: false, tipo:'CTE', total: 0},
      {id:5, nombre: 'Transferencia',    activo: true,  tipo:'TRA', total: 0},
      {id:6, nombre: 'Cheque',           activo: true,  tipo:'CHE', total: 0},
      {id:7, nombre: 'Mercado Pago',     activo: true,  tipo:'MEP', total: 0},
      {id:8, nombre: 'Todo Pago',        activo: true,  tipo:'TPA', total: 0},
//    {id:9, nombre: 'Canje',            activo: false, tipo:'CJE', total: 0},
    ],

  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState(['empresa','sucursal', 'sucursales', 'sucursalDemo', 'tema', 'temas', 'centrales', 'operario', 'operarioUserId',
      'operarioEsVendedor', 'operarioTerceroId', 'operarioArea', 'level', 'transition' ]),

    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    sayObserv () {
      if (this.editadoNUS.medio_id==2||this.editadoNUS.medio_id==3) {
        return 'Nro Cupón'
      } else if (this.editadoNUS.medio_id==5||this.editadoNUS.medio_id==7||this.editadoNUS.medio_id==8) {
        return 'Nro Transf'
      } else if (this.editadoNUS.medio_id==6) {
        return 'Nro Cheque'
      }
    },

  },

  watch: {
    '$store.state.sucursal' () {
      this.listarHTTP()
    },
    search(val) {
      this.listarHTTP(false)
    },

    searchTerceros (val) {
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      this.userDelTercero = 0
      this.userDelterceroDatos = null
      this.dondeEstoy = 'F'
      this.dialogSelFacturas = false  //para remitos
      this.buscoPor = 'nombre'

      return HTTP().get('/indexter/false/1/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/%'+val+'%')
        .then(({ data })=>{
        this.entriesTerceros = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTerceros.push(data[i].tercero)
          this.tercerosUserId.push(data[i].tercero_id)
        }
        if (val !== null && val !== '') {
          let ipos = this.entriesTerceros.findIndex(i => i.nombre == val || i.id == val );
          if (ipos!=-1) {
            let valor = this.tercerosUserId[ipos]
            this.userDelTercero = data[ipos].tercero.user!=null ? data[ipos].tercero.user.id : 0
            this.editado.tercero_id = data[ipos].tercero.id
            this.searchTercerosMetodo(this.editado.tercero_id)
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTerceros = false))
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
    return HTTP().get('/user/'+this.userId).then(({ data }) => {
      let psuc = data[0].sucursales.map(function(e) { return e.id; }).indexOf(this.sucursal);
      return HTTP().get('/indexter/false/3/false/'+this.operarioTerceroId+'/'+this.operarioUserId+'/%%')
        .then(({ data })=>{
        for (let i=0; i<=data.length-1; i++) {
          if (data[i].area=='V') {
            if (data[i].tercero.user!=null) {
              if ((this.operarioEsVendedor&&this.operarioUserId==data[i].tercero.user.id)||!this.operarioEsVendedor) {
                this.equipo.push({
                  id: data[i].tercero.user.id,
                  nombre: data[i].tercero.nombre.substr(0,7),
                  avatar: data[i].tercero.user.avatar,
                  tercero_id: data[i].tercero.id,
                  comision: data[i].comision,
                  tercero: data[i].tercero,
                  total: 0,
                })
              }
            }
          }
        }
        this.leoAnios().then( data => {
          this.listarHTTP()
         })
      })
    })
  },

  methods: {
    ...mapMutations([ 'alert', 'closeAlert', ]),

    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////
    closeForm(){
      router.push('/')
    },

    cerrarNUS() {
      this.dialogAgregarValoresNUS = false;
      this.dialogClientes = false;
    },

    buscarCliente() {
      this.buscoPor = 'codigo'
      this.searchTercerosMetodo(this.editadoRet.tercero_id);
    },

    searchTercerosMetodo(valor) {
      let yaCargado = 0
      return HTTP().get('/tercero/'+valor+'/1/true/'+this.sucursal).then(({ data }) => {
        if (data=='inexistente') {
          this.mensaje('¡Cliente inexistente!', this.temas.forms_titulo_bg, 1500)
          this.$nextTick(() => {
            const f = this.buscarPor='codigo'?this.$refs.codigocliente:this.$refs.cliente
            f.focus();
          });
        } else {
          this.usaElSistema = false
          if (data.t[0].tercero.user!=undefined) {
            this.usaElSistema = data.t[0].tercero.user.usaelsistema
          }
          this.entriesTerceros = []
          this.entriesTerceros.push(data.t[0].tercero)
          this.itemActualValor = data.t[0]
          this.userDelTercero = data.t[0].tercero.user!=null ? data.t[0].tercero.user.id : 0
          this.userDelTerceroDatos = data.t           // para cuando es un pedido de un vendedor
          this.editadoRet.tercero_id = data.t[0].tercero.id;
          this.editadoRet.nombre = data.t[0].tercero.nombre;
          this.valoresPendientes = []

          debugger
          return HTTP().get('/valorespendientes/'+this.editadoRet.tercero_id).then(({ data }) => { 

            debugger
            for (let i=0; i<=data.length-1; i++) {
              this.valoresPendientes.push({
                id: data[i].id,
                cpr: data[i].cpr,
                sel: data[i].maletinitem_id==null?false:true,
                nro: data[i].nrovalor,
                fecha: data[i].fecha,
                abrev: data[i].abrev,
                observ: data[i].observ,
                importe: data[i].importe,
                medio_id: data[i].medio_id,
                sucursal_id: data[i].sucursal_id,
                medionombre: data[i].medionombre,
              })
            }

            if (!this.usaElSistema) {
              return HTTP().get('/maletinescargadosdelcliente/'+this.editadoRet.tercero_id).then(( { data }) => {
                yaCargado = data[0].cargado
                this.editadoNUS.id = null // null es alta, !=null es edicion
                this.editadoNUS.maletin_id = this.itemActual.id
                this.editadoNUS.cliente_id = this.editadoRet.tercero_id
                this.editadoNUS.sucursal_id = this.sucursales[0].id
                this.editadoNUS.medio_id = 6
                this.editadoNUS.importe = 0
                this.editadoNUS.saldo = 0
                this.dialogAgregarValoresNUS = true
                return HTTP().get('/pendientes/'+this.editadoRet.tercero_id+'/0').then(( { data }) => {
                  for ( let i=0; i<= data.length-1; i++) {
                    this.editadoNUS.saldo += data[i].pendiente
                  }
                  this.editadoNUS.importe = this.editadoNUS.saldo - yaCargado
                })
              })

            } else {

              if (this.valoresPendientes.length==0) {
                this.msg.msgTitle = 'Sin Recibos'
                this.msg.msgBody = 'No hay Recibos pendientes para este Cliente'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'sin recibos'
                this.msg.msgButtons = ['Aceptar']
              }
            }
          })
        }
      })
    },

    buscoSiElTerceroEstaVinculado() {
      let estaVinculado = false
      if (this.editado.tercero_id!=null && (this.editado.cpr=='FAC' || this.editado.cpr=='REC')) {
        if (this.editado.vendedor.id!=null && this.editado.cpr=='FAC') {
          this.msg.msgTitle = 'Cliente con Vendedor'
          let msg = 'El cliente pertenece al vendedor '+this.editado.vendedor.nombre+'<br>';
          msg += 'El vendedor debera realizar un pedido para luego ser imputado a una Factura.';
          this.msg.msgBody = msg
          this.msg.msgVisible = true
          this.msg.msgAccion = 'cliente vinculado'
          this.msg.msgButtons = ['Aceptar']
          estaVinculado = true
        } else {
          return HTTP().get('/user/'+this.userDelTercero).then(({ data }) => {
            let pos = this.vinculosHijos.findIndex(x=>x==this.userDelTercero)
            if (pos!=-1&&data[0].usaelsistema&&data[0].userexclusivo_id!=this.userId) {
              this.msg.msgTitle = 'Cliente Vinculado'
              let msg = 'El cliente esta vinculado, debes pedirle que te realice un '
              msg += this.editado.cpr=='FAC' ? 'pedido.' : 'pago.'
              this.msg.msgBody = msg
              this.msg.msgVisible = true
              this.msg.msgAccion = 'cliente vinculado'
              this.msg.msgButtons = ['Aceptar']
              estaVinculado = true
              return estaVinculado
            }
          })
        }
      }
    },

    maletinClick(item, row) {
//    debugger
//    this.editarRecaudacion(item)
    },

    recaudacionClick(item, row) {
      if (item.estado!='K') { // Si el valor ya esta chequeado no lo puedo editar
        this.editarRecaudacion(item)
      }
    },

    nuevaRecaudacion(item) {
      this.itemActual = item
      this.editadoRet.tercero_id = null
      this.valoresPendientes = []
      this.dialogClientes = true;
    },

    verClientesPendientesHTTP() {
      this.clientesPendientesMaletin = []
      return HTTP().get('/clientespendientesmaletin/'+this.sucursal ).then(({ data }) => {
        let pmaletin = this.items.findIndex(x=>x.id==this.itemActual.id)
        for (let i=0; i<=data.qexe1.length-1; i++) {
          if (data.qexe1[i].pendiente_id!=null) {
            let pos = this.items[pmaletin].clientes.findIndex(x=>x.cliente_id == data.qexe1[i].terid)
            this.clientesPendientesMaletin.push({
              id: data.qexe1[i].cpid,
              terId: data.qexe1[i].terid,
              nombre: data.qexe1[i].ternom,
              cpr: data.qexe1[i].cpr,
              cargado: pos==-1?false:true,
              pendiente: data.qexe1[i].pendiente,
              vencimiento: moment(data.qexe1[i].vencimiento).format('DD/MM/YY'),
            })
          }
        }
        for (let i=0; i<=data.qexe2.length-1; i++) {
          this.clientesPendientesMaletin.push({
            id: data.qexe2[i].vid,
            terId: data.qexe2[i].id,
            nombre: data.qexe2[i].nombre,
            cpr: null,
            pendiente_id: null,
          })
        }
        this.dialogSeleccionCliente = true
      })
    },

    planillaDeRecaudacion(item) {
      if (item==null&&this.items.length>0) { // informe sobre el periodo
        this.$refs.impresion.planillaDeRecaudacion(this.items,'P');
      } else {
        this.$refs.impresion.planillaDeRecaudacion(item,'M');
      }
    },

    editarRecaudacion(item) {
      debugger
      this.agregando = false
      this.dialogAgregarValoresNUS = true
      this.editadoRet.tercero_id = item.cliente_id
      this.editadoNUS.id = item.id
      this.editadoNUS.sucursal_id = item.sucursal_id
      this.editadoNUS.cliente_id = item.cliente_id
      this.editadoNUS.medio_id = item.medio_id
      this.editadoNUS.observ = item.observ
      this.editadoNUS.importe = item.importe
      this.editadoNUS.saldo = 0
      return HTTP().get('/pendientes/'+item.cliente_id+'/0').then(( { data }) => {
        for ( let i=0; i<= data.length-1; i++) {
          this.editadoNUS.saldo += data[i].pendiente
        }
      })
    },

    borrarRecaudacion(item) {
      this.editadoNUS.id = item.id
      this.editadoNUS.maletin_id = item.maletin_id
      this.editadoNUS.sucursal_id = item.sucursal_id
      this.editadoNUS.cliente_id = item.cliente_id
      this.editadoNUS.medio_id = item.medio_id
      this.editadoNUS.observ = item.observ
      this.editadoNUS.importe = item.importe
      this.msg.msgTitle = 'Borrar Movimiento'
      this.msg.msgBody = '¿Confirmas que quieres eliminar este movimiento?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar movimiento'
      this.msg.msgButtons = ['Aceptar']
    },

    borrarMaletin(item) {
      this.itemActual = item
      this.msg.msgTitle = 'Borrar Maletín'
      this.msg.msgBody = '¿Confirmas que quieres eliminar este maletín?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar maletin'
      this.msg.msgButtons = ['Aceptar']
    },

    desmarcarRecaudacion(item) {
      this.editadoNUS.id = item.id
      debugger
      return HTTP().post('/desmarcarrecaudacion', { id: item.id, maletin_id: item.maletin_id, valor_id: item.valor_id }).then(({ data }) => {
        debugger
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
        } else if (data=='ya chequeado') {
          this.mensaje('¡Valor ya chequeado, imposible desmarcar!', this.temas.snack_error_bg, 2500)
          this.listarHTTP()
        } else {
          return HTTP().post('/actualizototalmaletin', { maletin_id: item.maletin_id }).then(({ data }) => {
            if (data=='error') {
              this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
            } else {
              this.mensaje('¡Movimiento desmarcado con éxito!', this.temas.forms_titulo_bg, 2500)
            }
            this.listarHTTP()
          })
        }
      })
    },

    chequear(item) {
      return HTTP().post('/chequearrecaudacion', { id: item.id, estado: item.estado }).then(({ data }) => {
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
        } else {
          return HTTP().post('/todochequeado', { maletin_id: item.maletin_id }).then(({ data }) => {
            this.mensaje('¡Movimiento chequeado con éxito!', this.temas.forms_titulo_bg, 2500)
            this.listarHTTP()
          })
        }
      })
    },

    marcarTodos(item) {
      return HTTP().post('/chequeartodos', { item }).then(({ data }) => {
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
        } else {
          return HTTP().post('/todochequeado', { maletin_id: item.id }).then(({ data }) => {
            if (data=='ok') {
              this.mensaje('¡Movimientos actualizados con éxito!', this.temas.forms_titulo_bg, 2500)
            } else {
              this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
            }
            this.listarHTTP()
          })
        }
      })
    },

    valoresHabilitados() {
      if (!this.usaElSistema) {
        if (this.editadoNUS.medio_id==1) {
          this.editadoNUS.observ = 'EFECTIVO'
        }
        if (this.editadoNUS.sucursal_id!=null&&this.editadoNUS.medio_id&&this.editadoNUS.importe<=0) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
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
      this.listarHTTP()
    },

    setMaletin(item) {
      this.cobrador_id = item.item.cobrador.id
      this.itemActual = item.item
    },

    nuevoMaletin() {
      this.agregando = true
      this.dialog = true
      this.editado.fecha = moment().format('YYYY-MM-DD')
      this.editado.user_id = this.userId
      this.editado.cobrador_id = this.operarioUserId!=null?this.operarioUserId:this.userId
//    this.editado.cobrador_id = this.operarioEsVendedor?this.operarioUserId:this.userId
      this.editado.estado = 'P'
    },

    guardarMaletinHTTP() {
      // ordeno los recorridos
      let pos = this.sucursales.findIndex(x=>x.id=this.sucursal)
      this.editado.recorrido = this.clientes;
      return HTTP().post('/nuevomaletin', { editado: this.editado }).then(({ data }) => {
        if (data!='error') {
          this.msg.msgTitle = 'Nuevo Maletin'
          let m = '¡Maletín generado correctamente!<br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'maletin ok'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = 'Se ha producido un error en intentar generar un nuevo Maletín.<br>Reintente, si el problema persiste consulte con sistemas<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'maletin error'
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialog = false
        this.listarHTTP()
      })
    },

    guardarActualizarValoresHTTP() {
      let alta = this.editadoNUS.id==null
      let aaa = this.editadoRet.tercero_id
      return HTTP().post('/actualizovalores', { 
        cliente_id: this.editadoRet.tercero_id, // this.editadoNUS.cliente_id,
        maletin_id: this.itemActual.id,
        valoresPendientes: this.valoresPendientes,
        usaElSistema: this.usaElSistema,
        editadoNUS: this.editadoNUS }).then(({ data }) => {
        if (data!='error') {
          return HTTP().post('/actualizototalmaletin', { maletin_id: this.itemActual.id }).then(({ data }) => {
            if (data!='error') {
              this.mensaje('¡Valor guardado correctamente!', this.temas.forms_titulo_bg, 2500)
            } else {
              this.msg.msgTitle = 'Error'
              this.msg.msgBody = 'Se ha producido un error en intentar actualizar los valores indicados.<br>Reintente, si el problema persiste consulte con sistemas<br>'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'valores error'
              this.msg.msgButtons = ['Aceptar']
            }
            this.dialogClientes = false
            this.listarHTTP()
            if (!alta) {
              this.dialogAgregarValoresNUS = false
            }
          })

        } else {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = 'Se ha producido un error en intentar actualizar los valores indicados.<br>Reintente, si el problema persiste consulte con sistemas<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'valores error'
          this.msg.msgButtons = ['Aceptar']
        }
        //this.dialogClientes = false
        //this.valoresPendientes = []
        //this.editadoRet.tercero_id = null
        if (!this.agregando) {
          this.dialogAgregarValoresNUS = false
        }
        this.listarHTTP()
      })
    },

    seleccionarCliente(item)  {
      this.editadoRet.tercero_id = item.terId
      this.dialogSeleccionCliente = false
      this.$nextTick(() => {
        const f = this.$refs.codigocliente;
        f.focus();
      });
      this.searchTercerosMetodo(item.terId)
    },

    selectValor(item) {
      item.sel = !item.sel
    },

    msgRespuesta(op) {
      this.msg.msgVisible = false
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar movimiento') {
          return HTTP().post('/eliminarrecaudacion', { id: this.editadoNUS.id, maletin_id: this.editadoNUS.maletin_id }).then(({ data }) => {
            if (data=='error') {
              this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
            } else {
              this.mensaje('¡Movimiento eliminado con éxito!', this.temas.forms_titulo_bg, 2500)
            }
            this.listarHTTP()
          })
        } else if (this.msg.msgAccion=='borrar maletin') {
          return HTTP().post('/eliminarmaletin', { id: this.itemActual.id }).then(({ data }) => {
            if (data=='error') {
              this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
            } else {
              this.mensaje('¡Maletín eliminado con éxito!', this.temas.forms_titulo_bg, 2500)
            }
            this.listarHTTP()
          })
        }
      }
    },

    listarHTTP() {
      let refrescoMeses = true
      if (refrescoMeses) {
        let aa = moment().format('YYYY')
        let mm = moment().format('MMM')
        let pos1 = this.anios.findIndex(x => x === aa);
        let pos2 = this.meses.findIndex(x => x === mm);
        if (pos1==-1 || pos2==-1) {
          this.leoAnios()
        }
      }
      let p = this.losMeses.indexOf(this.elMes)
      p ++
      p = p.toString().padStart(2,'0').substring(-2)
      if (this.elMes==undefined||this.elMes=='') return
      let periodo = ''
      let m = this.queMesEs(this.elMes)
      periodo = this.anio+'-'+m

      return HTTP().post('/maletines',{ perfiscal: periodo, usuario: this.operarioUserId, area: this.operarioArea }).then(({data})=>{
        this.items = []
        for (let i=0; i<=data.length-1; i++) {
          this.items.push({
            id: data[i].id,
            fecha: moment(data[i].fecha).format('YYYY-MM-DD'),
            cobrador: data[i].cobrador,
            importe: data[i].importe,
            estado: data[i].estado,
            clientes: data[i].items,
          })
        }
      }).catch(function (error) {
        console.log(error);
      })
    },

    queMesEs(mes) {
      this.elMes = mes
      let p = this.losMeses.indexOf(mes)
      p ++
      p = '0'+p
      p = p.substr(-2)
      //this.progress = false
      return p
    },

    setMes(mes) {
      this.elMes = mes
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
      this.listarHTTP()
    },

    async leoAnios() {
      return HTTP().post('anios/', {tipo: 'V'}).then(({ data }) => {
        this.anios = []
        this.meses = []
        this.periodos = []
        let pos = -1
        if (this.operarioEsVendedor) {
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
        let elMes = (this.elMes==null||this.elMes=='')?moment().format('MMM').substring(0,3):this.elMes
        pos = this.meses.findIndex(x => x.toUpperCase() === elMes.toUpperCase())
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

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    getEstado (estado, accion) {
      let c = ''
      let e = ''
      if (accion=='k') {   //para el dark
        if (estado==='P') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='K') {
          return this.temas.cen_estado_finalizado_dark
        }
      }
      if (estado==='P') {
        e = 'Pendiente de Chequear'
        c = this.temas.cen_estado_pendiente_bg
      } else if (estado==='K') {
        e = 'Chequeado'
        c = this.temas.cen_estado_enviado_bg
      }
      return accion==='c'?c:e
    },

    fechavalida() {
      if (moment(this.editado.fecha).format('YYYY-MM-DD')<moment().format('YYYY-MM-DD')) {
        this.mensaje('¡La fecha no puede ser anterior al dia de hoy!', this.temas.forms_titulo_bg, 1500)
        this.$nextTick(() => {
          const f = this.$refs.fecha;
          f.focus();
        });
      }
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoFecha(value) {
      if (value!=undefined) {
        return moment(String(value)).format('DD-MM-YY')
      } else {
        return moment().format('DD-MM-YY')
      }
    },

  },
};

</script>
<style scoped>
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg90 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
 .fg75 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 75%;
  }
  .fg100b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    font-weight: bold;
  }
</style>
