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

                      <v-col cols="12" md="12" class="fg pt-0">
                        <v-row v-if="!encontroElCliente">
                          <v-col cols="12" sm="3" class="fg pt-3">
                            <v-text-field
                              ref="codigocliente"
                              v-model="editado.tercero_id"
                              :color="temas.forms_titulo_bg"
                              label="Ingresa el Código, el Nombre o el CUIT. Utiliza el caracter % para buscar por parecido."
                              autofocus>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" md="1" class="fg pt-6">
                            <v-btn
                              :color="temas.barra_principal_bg"
                              :dark="temas.barra_principal_dark"
                              class="white--text"
                              @click="buscarCliente()">
                              Buscar
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <v-col cols="12" md="1" class="pt-6 pl-2 fg">
                            <v-btn
                              :color="temas.cen_btns_bg"
                              :dark="temas.cen_btns_dark==true"
                              class="mt-0 mr-2 text-capitalize"
                              @click="encontroElCliente=false">
                              Buscar
                            </v-btn>
                          </v-col>
                          <v-col cols="12" md="1" class="pt-3 fg">
                            <v-text-field
                              ref="codigocliente"
                              v-model="editado.tercero_id"
                              label="Código"
                              disabled>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" md="5" class="pt-3 fg">
                            <v-text-field
                              v-model="editado.nombre"
                              label="Nombre del Cliente"
                              disabled>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" md="2" v-if="editadoRet.tercero_id!=null"
                            class="fg pt-6">
                            <span>¿Usa el sistema?{{'\xa0'}}{{'\xa0'}}</span>
                            <v-chip class="ml-0"
                              :color="temas.barra_principal_bg"
                              :dark="temas.barra_principal_dark">
                              <b>{{ usaElSistema?'Sí':'No' }}</b>
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12">
                        <v-data-table
                          :headers="headersValores"
                          :items="valoresPendientes"
                          dense
                          :footer-props="{
                            itemsPerPageOptions: [13],
                            showFirstLastPage: true,
                            showCurrentPage: true,
                            nextIcon: 'mdi-arrow-right-drop-circle-outline',
                            prevIcon: 'mdi-arrow-left-drop-circle-outline',
                          }"
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

            <!-- DIALOG SELECCION DE CLIENTE -->
            <v-dialog
              v-model="dialogSeleccionClientes"
              max-width="750px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogSeleccionClientes=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">{{empresa}} - SELECCION DE CLIENTES</span>
              </v-toolbar>
              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                       <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <v-data-table
                              :headers="headersSeleccionClientes"
                              :items="clientes"
                              dense
                              class="pl-1 pr-3 elevation-1 pt-2"
                              :footer-props="{
                                itemsPerPageOptions: [10],
                                showFirstLastPage: true,
                                showCurrentPage: true,
                                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                                prevIcon: 'mdi-arrow-left-drop-circle-outline',
                              }"
                              @click:row="seleccionDelCliente">
                            </v-data-table>
                          </v-form>
                        </v-col>
                      </v-row>
                     </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG SELECCION DEL CLIENTE -->

            <!-- FORMULARIO DE INGRESO DE VALORES NUS -->
            <v-dialog v-model="dialogAgregarValoresNUS" max-width="500px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card class="fg" height="615px">

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
                </v-toolbar>

                <v-card flat>
                  <v-card-text>

                    <v-row>
                      <v-col cols="12" offset="1" md="10" class="fg100b pt-6 pb-0">
                        {{ editado.tercero_id+' - '+editado.nombre }}
                      </v-col>
                    </v-row>

                    <v-row class="pb-0">
                      <v-col cols="12" offset="1" md="10" class="fg pt-6 pb-0">
                        <v-select
                          label='Sucursal'
                          autofocus
                          :color="temas.forms_titulo_bg"
                          v-model="editadoNUS.sucursal_id"
                          :items="sucursales"
                          item-value="id"
                          item-text="nombre"
                          @change="cargoDatosDeLaSucursal()">
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" offset="1" md="10" class="fg pt-0 pb-0">
                        <v-select
                          label='Como paga el Cliente'
                          :color="temas.forms_titulo_bg"
                          v-model="editadoNUS.lista_id"
                          :items="condicionesDePago"
                          item-value="id"
                          :disabled="yaHayMovimientos"
                          :item-text="condicionesDePago=>
                          `${condicionesDePago.nombre} ($${formatoImporte(condicionesDePago.apagar)} )`"
                          @change="cargoDatosDeLaSucursal()">
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" offset="1" md="10" class="fg pt-0 pb-0">
                        <table style="width:100%">
                          <tr>
                            <td style="text-align:left">Deuda Total</td>
                            <td style="text-align:right">
                              <b>${{ formatoImporte(sayDeudaTotalSucursal) }}</b>
                            </td>
                          </tr>
                          <tr>
                            <td style="text-align:left">Descuentos</td>
                            <td style="text-align:right">
                              <b>${{ formatoImporte(sayDescuentos) }}</b>
                            </td>
                          </tr>
                          <tr>
                            <td style="text-align:left">A Pagar</td>
                            <td style="text-align:right">
                              <b>${{ formatoImporte(sayAPagar) }}</b>
                            </td>
                          </tr>
                          <tr>
                            <td style="text-align:left">Ya Cargado</td>
                            <td style="text-align:right">
                              <b>${{ formatoImporte(sayYaCargado) }}</b>
                            </td>
                          </tr>
                          <tr>
                            <td style="text-align:left">A Cargar</td>
                            <td style="text-align:right">
                              <b>${{ formatoImporte(sayACargar) }}</b>
                            </td>
                          </tr>
                        </table>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" offset="1" md="10" class="fg pt-2 pb-0">
                        <v-select
                          label="Medio"
                          dense filled
                          v-model="editadoNUS.medio_id"
                          :color="temas.forms_titulo_bg"
                          :items="medpaghab"
                          item-value="id"
                          item-text="nombre">
                        </v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" offset="1" md="5" class="fg pt-0 pb-0">
                        <v-text-field
                          v-model="editadoNUS.observ"
                          dense filled
                          :label="sayObserv">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="5" class="fg pt-0 pb-0">
                        <v-text-field
                          v-model="editadoNUS.importe"
                          dense filled
                          label="Importe">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" offset="1" md="10" class="fg pt-0 pb-0">
                        <v-btn v-if="editadoNUS.importe!=0"
                          :color="temas.barra_principal_bg"
                          :dark="temas.barra_principal_dark"
                          class="white--text"
                          @click="guardarActualizarValoresHTTP()">
                          Guardar
                        </v-btn>
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
              :footer-props="{
                itemsPerPageOptions: [10],
                showFirstLastPage: true,
                showCurrentPage: true,
                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                prevIcon: 'mdi-arrow-left-drop-circle-outline',
              }"
              @click:row="recaudacionClick">
              <template v-slot:item.valor.ingresados.cpr="{ item }">
                <span class="fg">{{ item.valor?kit.cpr(item.valor.ingresados.cpr):'Pendiente' }}</span>
              </template>
              <template v-slot:item.importe="{ item }">
                <span class="fg">${{ formatoImporte(item.importe) }}</span>
              </template>
              <template v-slot:item.valor.observ="{ item }">
                <span class="fg85">{{ item.valor?item.valor.observ:item.observ }}</span>
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
    
    condicionDePago: '',
    condicionDePagoOriginal: '',
    condicionesDePago: [],
    sucsItems: [],

    // datos en pantalla maletin
    sayDeudaTotalSucursal: 0,
    sayDescuentos: 0,
    sayAPagar: 0,
    sayYaCargado: 0,
    sayACargar: 0,

    lista_id: 0,

    pendientesMaletin: [],
    clientesPendientesMaletin: [],
    pendientes: [],
    pend: [],
    maletinItems: [],
    yaHayMovimientos: false,

    itemActual: null,
    itemActualValor: null,
    msg: { msgAccion: null, msgVisible: false, msgTitle: '', msgBody: '', msgButtons: [''] },
    search: '',
    dialog: false,
    dialogValores: false,
    dialogClientes: false,
    dialogAgregarValoresNUS: false,
    dialogSeleccionClientes: false,

    usaElSistema: false,

    buscarPor: '',
    userDelTercero: 0,
    searchTerceros: '',

    valoresPendientes: [],
    encontroElCliente: false,

    editado: {
      tercero_id: null, nombre: '', fecha: '', user_id: null, cobrador_id: null, estado: null
    },

    editadoRet: {
      id: null, maletin_id: null, tercero_id: null, sucursal_id: null, recibo_id:null, valor_id: null, medio_id:null, observ: null, estado: null
    },

    editadoNUS: {
      id: null, maletin_id: null, cliente_id: null, sucursal_id: null, medio_id: null, lista_id: null, desc1: null, desc2: null,
      observ: null, importe: null, descuento: null, saldo: null, dias: null,
    },

    editadoNUSDefault: {
      id: null, maletin_id: null, cliente_id: null, sucursal_id: null, medio_id: null, lista_id: null, desc1: null, desc2: null,
      observ: null, importe: null, descuento: null, saldo: null, dias: null,
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
      { text: 'Código', value:'cliente.id', align: 'left', width: 80 },
      { text: 'Cliente', value:'cliente.nombre', align: 'left', width: 190 },
      { text: 'Suc.', value:'sucursal.id', align: 'left', width: 60 },
      { text: 'Recibo', value:'valor.ingresados.cpr', align: 'left', width: 115 },
      { text: 'Medio', value:'medio.abrev', align: 'left', width: 50 },
      { text: 'Detalles', value:'valor.observ', align: 'left', width: 350 },
//    { text: 'Observ', value:'observ', align: 'left', width: 150 },
      { text: 'Importe', value:'importe', align: 'end', width: 120 },
//    { text: 'Chk', value:'estado', align: 'end', width: 60 },
      { text: 'Acciones', value:'accion', align: 'left', width: 90},
    ],

    headersSeleccionClientes: [
    { text: 'ID', value:'id', align: 'end', width: 100 },
    { text: 'Cliente', value:'nombre', align: 'left', width: 250 },
    { text: 'CUIT', value:'cuit', align: 'left', width: 120 },
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

    headersPendientes: [
      { text: 'Cpr', value:'cpr', align: 'left', width: 150 },
      { text: 'Vencimiento', value:'vencimiento', align: 'left', width: 130 },
      { text: 'Pendiente', value:'pendiente', align: 'end', width: 150 },
      { text: 'Descuento', value:'descuentos', align: 'end', width: 150 },
    ],

    headersMaletinItems: [
      { text: 'Medio', value:'nombre', align: 'left', width: 150 },
      { text: 'Observ', value:'observ', align: 'left', width: 150 },
      { text: 'Importe', value:'importe', align: 'end', width: 150 },
      { text: 'Acciones', value:'accion', align: 'left', width: 90},
    ],

    /*ok*/
    headersValores: [
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
      {id:4, nombre: 'CtaCte',           activo: false, tipo:'CTA', total: 0},
      {id:5, nombre: 'Transferencia',    activo: true,  tipo:'TRA', total: 0},
      {id:6, nombre: 'Ch.3ro.',          activo: true,  tipo:'CHE', total: 0},
      {id:7, nombre: 'Ch.Propio',        activo: true,  tipo:'CHE', total: 0},
      {id:8, nombre: 'Mercado Pago',     activo: true,  tipo:'MEP', total: 0},
      {id:9, nombre: 'Todo Pago',        activo: true,  tipo:'TPA', total: 0},
    ],

    medpaghab: [],

    headersCondDePagos: [
      { text: 'Detalles', value:'nombre', align: 'left', width:260},
      { text: 'A Pagar', value:'apagar', align: 'end', width: 120},
    ],

    headersSucursales: [
      { text: 'Nombre', value:'nombre', align: 'left', width:260},
    ],

  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState(['empresa','sucursal', 'sucursales', 'sucursalDemo', 'tema', 'temas', 'centrales', 'operario', 'operarioUserId',
      'operarioEsVendedor', 'operarioTerceroId', 'operarioArea', 'level', 'transition', 'dark' ]),

    sayObserv () {
      if (this.editadoNUS.medio_id==1) {
        return 'Efectivo'
      } else if (this.editadoNUS.medio_id==2||this.editadoNUS.medio_id==3) {
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
      this.listarHTTP(false)
    },
    search(val) {
      this.listarHTTP(false)
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

    debugger
    this.sucsItems = []
    for(let i=0; i<=this.sucursales.length-1; i++) {
      this.sucsItems.push({
        id: this.sucursales[i].id,
        nombre: this.sucursales[i].nombre,
        pagoHabilitado: true,
        selected: false,
      });
    }
    this.sucsItems[0].selected = true

    return HTTP().get('/user/'+this.userId).then(({ data }) => {
      let psuc = data[0].sucursales.map(function(e) { return e.id; }).indexOf(this.sucursal);
      return HTTP().get('/indexter/false/3/false/'+this.operarioTerceroId+'/'+this.operarioUserId+'/null')
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
          this.listarHTTP(true)
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

      this.sayAPagar = 0;
      this.sayACargar = 0;
      this.sayYaCargado = 0;
      this.sayDescuentos = 0;
      this.sayDeudaTotalSucursal = 0;
      this.lista_id = 0
      let yaCargado = 0
      let pos = 0
      this.dialogSeleccionClientes = false
      if (this.editado.tercero_id=='') {
        this.$nextTick(() => {
          const f = this.$refs.codigocliente;
          f.focus();
        });
        return
      }

      this.encontroElCliente = false
      return HTTP().get('/buscartercero/'+this.editado.tercero_id+'/CLI/true/'+this.sucursal).then(({ data }) => {

        debugger
        if (data=='inexistente') {
          this.mensaje('¡Cliente inexistente!', this.temas.snack_error_bg, 1500)
          this.$nextTick(() => {
            const f = this.$refs.codigocliente;
            f.focus();
          });
          return
        }
        
        if (data.t.length>1) {
          this.clientes = []
          for (let i=0; i<=data.t.length-1; i++) {
            this.clientes.push({
              id: data.t[i].tercero.id,
              nombre: data.t[i].tercero.nombre,
              cuit: data.t[i].tercero.cuit
            })
          }
          this.dialogSeleccionClientes = true
          return
        }

        this.encontroElCliente = true
        this.usaElSistema = false
        if (data.t[0].tercero.user!=undefined) {
          this.usaElSistema = data.t[0].tercero.user.usaelsistema
        }
        this.itemActualValor = data.t[0]
        this.userDelTercero = data.t[0].tercero.user!=null ? data.t[0].tercero.user.id : 0
        this.editadoRet.tercero_id = data.t[0].tercero.id;
        this.editadoRet.nombre = data.t[0].tercero.nombre;
        this.valoresPendientes = []

        this.editado.tercero_id = data.t[0].tercero.id
        this.editado.nombre = data.t[0].tercero.nombre

        this.lista_id = data.t[0].lista_id

        return HTTP().get('/datosmaletin/'+this.editadoRet.tercero_id+'/null').then(({ data }) => { 

          debugger
          if (this.usaElSistema) {
            for (let i=0; i<=data.valorespendientes.length-1; i++) {
              this.valoresPendientes.push({
                id: data.valorespendientes[i].id,
                cpr: data.valorespendientes[i].cpr,
                sel: data.valorespendientes[i].maletinitem_id==null?false:true,
                nro: data.valorespendientes[i].nrovalor,
                fecha: data.valorespendientes[i].fecha,
                abrev: data.valorespendientes[i].abrev,
                observ: data.valorespendientes[i].observ,
                importe: data.valorespendientes[i].importe,
                medio_id: data.valorespendientes[i].medio_id,
                sucursal_id: data.valorespendientes[i].sucursal_id,
                medionombre: data.valorespendientes[i].medionombre,
              })
            }
            return
          }

          this.dialogClientes = false

          // cargo los datos en editadoNUS y calculo los importes
          this.editadoNUS.id          = null,
          this.editadoNUS.maletin_id  = this.itemActual.id
          this.editadoNUS.cliente_id  = this.editadoRet.tercero_id
          this.editadoNUS.sucursal_id = null
          this.editadoNUS.medio_id    = null
          this.editadoNUS.lista_id    = null //this.lista_id
          this.editadoNUS.dias        = null
          this.editadoNUS.desc1       = 0
          this.editadoNUS.desc2       = 0
          this.editadoNUS.observ      = ''
          this.editadoNUS.importe     = 0
          this.editadoNUS.descuento   = 0
          this.editadoNUS.estado      = 'P'

          // Cargo los pendientes
          this.pend = []
          this.pendientes = []
          for (let i=0; i<=data.pendientes[0].det.length-1; i++) {
            this.pendientes.push({
              id: data.pendientes[0].det[i].id,
              cpr: data.pendientes[0].det[i].cpr,
              importe: data.pendientes[0].det[i].total,
              vencimiento: moment(data.pendientes[0].det[i].vencimiento).format('YYYY-MM-DD'),
              pendiente: data.pendientes[0].det[i].pendiente,
              descuentos: 0,
              acancelar: 0,
              lista_id: null,
              desc1: 0,
              desc2: 0,
              espejo_id: data.pendientes[0].det[i].espejo_id,
              sucursal_id: data.pendientes[0].det[i].sucursal_id,
            })
          }

          // Cargo las condiciones comerciales
          this.condicionDePago = []
          this.condicionesDePago = []
          for (let i=0; i<=data.condDePagos.length-1; i++) {
            this.condicionesDePago.push({
              id: data.condDePagos[i].id,
              nombre: data.condDePagos[i].nombre,
              desc1: data.condDePagos[i].desc1,
              desc2: data.condDePagos[i].desc2,
              medio_id: data.condDePagos[i].medio_id,
              dias: data.condDePagos[i].dias,
              apagar: 0,
              selected: this.lista_id==data.condDePagos[i].id?true:false,
            })
          }
          this.dialogAgregarValoresNUS = true;

          this.maletinItems = []
          for (let i=0; i<=data.maletinitems.length-1; i++) {
            this.maletinItems.push(data.maletinitems[i])
          }

        })
      })
    },

    cargoDatosDeLaSucursal() {
      debugger

      // sumo lo ya cargado
      this.sayYaCargado = 0
      let lis = 0
      for (let i=0; i<=this.maletinItems.length-1; i++) {
        if (this.maletinItems[i].sucursal_id==this.editadoNUS.sucursal_id) {
          this.yaHayMovimientos = true
          this.sayYaCargado += this.maletinItems[i].importe
          lis = this.maletinItems[i].lista_id
        }
      }
      if (lis!=0) {
        this.editadoNUS.lista_id = lis
      } else {
        if (this.editadoNUS.lista_id == null) {
          this.editadoNUS.lista_id = this.lista_id
        }
      }

      // sumo el total de deuda de la sucursal
      this.yaHayMovimientos = false
      this.sayDeudaTotalSucursal = 0
      for (let i=0; i<=this.pendientes.length-1; i++) {
        if (this.editadoNUS.sucursal_id==this.pendientes[i].sucursal_id) {
          this.sayDeudaTotalSucursal += this.pendientes[i].pendiente
        }
      }

      // calculo los descuentos por cada condicion de pago
      let pos1 = this.condicionesDePago.findIndex(x=>x.id == this.editadoNUS.lista_id)
      this.editadoNUS.lista_id = this.condicionesDePago[pos1].id
      this.editadoNUS.medio_id = this.condicionesDePago[pos1].medio_id
      this.editadoNUS.dias = this.condicionesDePago[pos1].dias
      this.editadoNUS.desc1 = this.condicionesDePago[pos1].desc1
      this.editadoNUS.desc2 = this.condicionesDePago[pos1].desc2
      let aPagar = 0;
      for (let i=0; i<=this.condicionesDePago.length-1; i++) {
        aPagar = this.sayDeudaTotalSucursal - (this.sayDeudaTotalSucursal*(this.condicionesDePago[i].desc1/100))
        aPagar = aPagar - (aPagar*(this.condicionesDePago[i].desc2/100))
        this.condicionesDePago[i].apagar = this.roundTo(aPagar,2)
      }

      aPagar = 0;
//    pos1 = this.condicionesDePago.findIndex(x=>x.id == this.lista_id)
      aPagar = this.condicionesDePago[pos1].apagar;

      // sumo lo ya cargado
      this.sayYaCargado = 0
      for (let i=0; i<=this.maletinItems.length-1; i++) {
        if (this.maletinItems[i].sucursal_id==this.editadoNUS.sucursal_id) {
          this.yaHayMovimientos = true
          this.sayYaCargado += this.maletinItems[i].importe
        }
      }

      this.sayDescuentos = this.sayDeudaTotalSucursal - aPagar;
      this.sayACargar = this.sayDeudaTotalSucursal - ( this.sayYaCargado + this.sayDescuentos );
      this.sayAPagar = this.sayDeudaTotalSucursal - this.sayDescuentos
      this.editadoNUS.importe = this.sayACargar;

      // seteo los medios de pagos habilitados
      this.medpag[0].activo = true;   // efectivo
      this.medpag[1].activo = false;  // Tj Credito
      this.medpag[2].activo = false;  // Tj Debito
      this.medpag[4].activo = false;  // Transferencia
      this.medpag[5].activo = false;  // Ch.3ro
      this.medpag[6].activo = false;  // Ch.Propio
      this.medpag[7].activo = false;  // Mcado.Pago
      this.medpag[8].activo = false;  // Todo Pago

      let pos2 = this.medpag.findIndex(x=>x.id==this.condicionDePago.medio_id);
      if (pos2!=-1) {
        this.medpag[pos2].activo = true
      }

      // SIEMPRE HABILITO EFECTIVO
      // si la lista es de cheques habilito los de terceros los propios y efectivo
      if (this.editadoNUS.medio_id==5||this.editadoNUS.medio_id==6) {
        this.medpag[5].activo = true
        this.medpag[6].activo = true
        this.maxDiasChq = this.editadoNUS.dias
      }

      // HABILITO SOLO LAS QUE CORRESPONDEN SEGUN LISTA SELECCIONADA
      this.medpaghab = []
      for (let i=0; i<=this.medpag.length-1; i++) {
        if (this.medpag[i].activo) {
          this.medpaghab.push(this.medpag[i])
        }
      }

      if (this.editadoNUS.medio_id==0) {
        this.editadoNUS.observ = 'EFECTIVO'
      }

    },

    pagoHabilitado() {
      let pos = this.sucsItems.findIndex(x=>x.selected==true)
      return this.sucsItems[pos].pagoHabilitado
    },

    maletinClick(item, row) {
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
      this.encontroElCliente = false
      this.dialogClientes = true;
    },

    editarRecaudacion(item) {
      debugger
      this.dialogAgregarValoresNUS = true
      this.editadoRet.tercero_id = item.cliente_id
      this.editadoNUS.id = itemid
      this.editadoNUS.sucursal_id = item.sucursal_id
      this.editadoNUS.cliente_id = item.cliente_id
      this.editadoNUS.medio_id = item.medio_id
      this.editadoNUS.lista_id = item.lista_id
      this.editadoNUS.desc1 = item.desc1
      this.editadoNUS.desc2 = item.desc2
      this.editadoNUS.observ = item.observ
      this.editadoNUS.importe = item.importe
      this.editadoNUS.descuento = item.descuento
      this.editadoNUS.saldo = 0

      return HTTP().get('/pendientes/'+item.cliente_id+'/0/V').then(( { data }) => {
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
      this.msg.msgButtons = ['Cancelar','Aceptar']
    },

    desmarcarRecaudacion(item) {
      this.editadoNUS.id = item.id
      debugger
      return HTTP().post('/desmarcarrecaudacion', { id: item.id, maletin_id: item.maletin_id, valor_id: item.valor_id }).then(({ data }) => {
        debugger
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
        } else if (data=='ya chequeado') {
          this.mensaje('¡Valor ya chequeado, no se puede desmarcar!', this.temas.snack_error_bg, 2500)
          this.listarHTTP(false)
        } else {
          return HTTP().post('/actualizototalmaletin', { maletin_id: item.maletin_id }).then(({ data }) => {
            if (data=='error') {
              this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
            } else {
              this.mensaje('¡Movimiento desmarcado con éxito!', this.temas.forms_titulo_bg, 2500)
            }
            this.listarHTTP(false)
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
            this.listarHTTP(false)
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
            this.listarHTTP(false)
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

    setMaletin(item) {
      this.cobrador_id = item.item.cobrador.id
      this.itemActual = item.item
    },

    nuevoMaletin() {
      this.dialog = true
      this.editado.fecha = moment().format('YYYY-MM-DD')
      this.editado.user_id = this.userId
      this.editado.cobrador_id = this.operarioUserId!=null?this.operarioUserId:this.userId
//    this.editado.cobrador_id = this.operarioEsVendedor?this.operarioUserId:this.userId
      this.editado.estado = 'P'
    },

    seleccionDelCliente(value) {
      this.clientes = []
      this.dialogSeleccionClientes = false
      this.editado.tercero_id = value.id
      this.buscarCliente()
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
        this.listarHTTP(true)
      })
    },

    guardarActualizarValoresHTTP() {
      debugger
      return HTTP().post('/actualizovalores', { 

        cliente_id: this.editadoRet.tercero_id, // this.editadoNUS.cliente_id,
        maletin_id: this.itemActual.id,
        valoresPendientes: this.valoresPendientes,
        usaElSistema: this.usaElSistema,
        editadoNUS: this.editadoNUS }).then(({ data }) => {

        if (data=='error') {

          this.msg.msgTitle = 'Error'
          this.msg.msgBody = 'Se ha producido un error en intentar actualizar los valores indicados.<br>Reintente, si el problema persiste consulte con sistemas<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'valores error'
          this.msg.msgButtons = ['Aceptar']
          return
        
        }

        debugger
        return HTTP().post('/actualizototalmaletin', { maletin_id: this.itemActual.id }).then(({ data }) => {

          debugger
          if (data=='error') {

            this.msg.msgTitle = 'Error'
            this.msg.msgBody = 'Se ha producido un error en intentar actualizar los valores indicados.<br>Reintente, si el problema persiste consulte con sistemas<br>'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'valores error'
            this.msg.msgButtons = ['Aceptar']
            return
            
          }

          this.mensaje('¡Valor guardado correctamente!', this.temas.forms_titulo_bg, 2500)

          debugger

          if (this.usaElSistema==false) {

            this.maletinItems.push({
              cliente_id: this.editadoNUS.cliente_id, desc1: this.editadoNUS.desc1, desc2: this.editadoNUS.desc2,
              estado: this.editadoNUS.estado, id: null, importe: Number(this.editadoNUS.importe),
              lista_id: this.editadoNUS.lista_id, maletin_id: this.editadoNUS.maletin_id,
              medio_id: this.editadoNUS.medio_id, nombre: null,
              observ: this.editadoNUS.observ, sucursal_id: this.editadoNUS.sucursal_id,
            })

            this.editadoNUS.id          = null,
            this.editadoNUS.maletin_id  = this.itemActual.id
            this.editadoNUS.cliente_id  = this.editadoRet.tercero_id
            this.editadoNUS.dias        = null
            this.editadoNUS.desc1       = 0
            this.editadoNUS.desc2       = 0
            this.editadoNUS.observ      = ''
            this.editadoNUS.importe     = 0
            this.editadoNUS.descuento   = 0
            this.editadoNUS.estado      = 'P'

            this.cargoDatosDeLaSucursal()

          } else {

            this.encontroElCliente = false
            
          }
          
          this.listarHTTP(false)
          if (this.usaElSistema) {
            this.encontroElCliente = false
          }

        })

      })
    },

    planillaDeRecaudacion(item) {
      if (item==null&&this.items.length>0) { // informe sobre el periodo
        this.$refs.impresion.planillaDeRecaudacion(this.items,'P');
      } else {
        this.$refs.impresion.planillaDeRecaudacion(item,'M');
      }
    },

    selectValor(item) {
      item.sel = !item.sel
    },

    msgRespuesta(op) {
      this.msg.msgVisible = false
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar movimiento') {
          debugger
          return HTTP().post('/eliminarrecaudacion', { id: this.editadoNUS.id, maletin_id: this.editadoNUS.maletin_id }).then(({ data }) => {
            debugger
            if (data=='ya procesado') {
              this.mensaje('¡Maletín ya procesado en Administración, refresque los datos para actualizar!', this.temas.snack_error_bg, 2500)
            } else if (data=='error') {
              this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
            } else {
              this.mensaje('¡Movimiento eliminado con éxito!', this.temas.forms_titulo_bg, 2500)
            }
            this.listarHTTP(false)
          })
        } else if (this.msg.msgAccion=='borrar maletin') {
          return HTTP().post('/eliminarmaletin', { id: this.itemActual.id }).then(({ data }) => {
            if (data=='error') {
              this.mensaje('¡Opps, se ha producido un error, reintente!', this.temas.snack_error_bg, 2500)
            } else {
              this.mensaje('¡Maletín eliminado con éxito!', this.temas.forms_titulo_bg, 2500)
            }
            this.listarHTTP(false)
          })
        }
      }
    },

    listarHTTP(refrescoMeses) {
      if (refrescoMeses) {
        let aa = moment().format('YYYY')
        let mm = moment().format('MMM').substring(0,3)
        let pos1 = this.anios.findIndex(x => x === aa);
        let pos2 = this.meses.findIndex(x => x.toUpperCase() === mm.toUpperCase());
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
      this.listarHTTP(false)
    },

    setAnio(anio) {
      debugger
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
      this.listarHTTP(false)
    },

    async leoAnios() {
      //let tipo = this.operarioEsVendedor?'A':'V'  // si es vendedor leo todos los tipos de comprobantes
      return HTTP().post('anios/', {tipo: 'V'}).then(({ data }) => {
        this.anios = []
        this.meses = []
        this.periodos = []
        let pos = -1
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
        let mesActual = moment().format('MMM').substring(0,3)
        pos = this.meses.findIndex(x => x.toUpperCase() === mesActual.toUpperCase())
        if (pos==-1) {
          // porque aun no hay movimientos en el mes actual, busco en el anterior
          if (this.meses.length>0) {
            this.elMes = this.meses[0]
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
