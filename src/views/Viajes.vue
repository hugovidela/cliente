<template>
  <!-- eslint-disable max-len -->
  <v-layout align-start class="fg ma-0">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        item-key="id"
        class="elevation-1"
        :footer-props="footerProps"
        @click:row="listarViajeHTTP">
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
                    :disabled="operarioArea!='V'"
                    class="mr-2"
                    @click="nuevoViaje" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Nuevo Viaje</span>
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
                  mdi-wallet-travel
                </v-icon>
                <b>Viajes</b>
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

            <!-- DIALOG PARA NUEVO VIAJE -->
            <v-dialog v-model="dialog" max-width="500px"
              :transition="transition==null?'false':transition">
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
                  {{empresa}} - NUEVO VIAJE
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="editado.user_id!=null&&editado.zona_id!=null&&editado.fecha!=null&&clientes.length>0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarViajeHTTP">
                  Guardar Viaje
                </v-btn>
              </v-toolbar>

              <v-card class="fg">
                <v-form ref="art3">
                  <v-card-text>
                    <v-row>
                      <v-col cols="6" offset="3" sm="6" md="6" class="pt-6 pb-0">
                        <v-text-field
                          ref="fecha"
                          type="date"
                          autofocus
                          v-model="editado.fecha"
                          label="Fecha del Viaje"
                          @change="fechavalida()">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="10" offset="1" sm="10" md="10" class="pt-0 pb-0">
                        <v-select
                          label="Equipo"
                          v-model="editado.user_id"
                          :disabled="editedIndex!=-1||operarioEsVendedor||equipo.length==1"
                          :color="temas.forms_titulo_bg"
                          :items="equipo"
                          item-value="id"
                          item-text="nombre"
                          @change="seleccionoZona()">
                        </v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="10" offset="1" sm="10" md="10" class="pt-0 pb-6">
                        <v-select
                          label="Zona"
                          v-model="editado.zona_id"
                          :disabled="editedIndex!=-1"
                          :color="temas.forms_titulo_bg"
                          :items="zonas" item-value="id" item-text="nombre"
                          @change="cargoClientesDeLaZona()">
                        </v-select>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG DEL NUEVO VIAJE -->

            <!--// ADMINISTRACION DE PEDIDOS // -->
            <v-dialog v-model="dialogAdministracionPedidos" :fullscreen="true" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>

              <v-card class="fg" height="700px">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cerrarViajes"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} / {{operario}} / Administración de Pedidos
                  </span>
                  <v-chip class="ml-3"
                    :color="temas.barra_lateral_bg"
                    :dark="temas.barra_lateral_dark">
                    Viaje Nro.
                    {{viaje_id }}
                  </v-chip>
                  <v-chip class="ml-3"
                    :color="temas.barra_lateral_bg"
                    :dark="temas.barra_lateral_dark">
                    Zona ( {{ zonaNombre }} )
                  </v-chip>
                  <v-chip class="ml-3"
                    :color="colorEstadoDelViaje()"
                    :dark="temas.barra_lateral_dark">
                    {{viajeEstadoSay()}}
                  </v-chip>
                  <v-chip v-if="viajeEstado('D')" class="ml-3"
                    :color="temas.barra_lateral_bg"
                    :dark="temas.barra_lateral_dark">
                    {{viajesStaticsSay}} % completado
                  </v-chip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-0 ml-5"
                        fab x-small
                        :color="temas.barra_lateral_bg"
                        @click="verStockConsolidado()" v-on="on">
                        <v-icon>mdi-barcode</v-icon>
                      </v-btn>
                    </template>
                    <span>Consultar Stocks Consolidados</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="mr-0 ml-5"
                        fab x-small
                        :color="temas.barra_lateral_bg"
                        @click="refrescarViaje()" v-on="on">
                        <v-icon>mdi-refresh</v-icon>
                      </v-btn>
                    </template>
                    <span>Refrescar datos del Viaje</span>
                  </v-tooltip>
                  <v-switch class="pl-6 pt-6"
                    :label=sayFiltro
                    :color="temas.cen_btns_bg"
                    v-model="filtroClientes">
                  </v-switch>
                </v-toolbar>

                <v-row class="fg pt-4 pb-4 pl-4">

                  <v-col cols="3" sx="2" mx="2" class="pt-2 pb-0">
                    <v-pagination
                      v-model="pagina"
                      :length="clientes.length>0?Math.ceil(clientes.length/perPage):0"
                      :color="temas.barra_principal_bg"
                      :total-visible="5"
                      dense>
                    </v-pagination>
                  </v-col>

                  <v-col cols="2" sm="2">  <!-- Barra de búsqueda  -->
                    <v-text-field
                      v-model="search"
                      outlined dense
                      append-icon="search"
                      label="Buscar"
                      :color="temas.forms_titulo_bg"
                      class="pt-0"
                      single-line hide-details>
                    </v-text-field>
                  </v-col>

                  <v-col cols="7" sx="7" mx="7" class="mt-5 pt-0 pl-6 pr-0">
                    <p>
                      <v-chip>Pedidos<b>{{'\xa0'}}${{ kit.redondear(totalPedidos,2,2) }}</b></v-chip>
                      <v-chip>Facturas<b>{{'\xa0'}}${{ kit.redondear(totalDebitos+totalCreditos,2,2) }}</b></v-chip>
                      <v-chip>Recibos<b>{{'\xa0'}}${{ kit.redondear(totalRecibos,2,2) }}</b></v-chip>
                  <!--<v-chip>A Recaudar<b>{{'\xa0'}}${{ kit.redondear(totalRecibos,2,2) }}</b></v-chip>-->
                  <!--<v-chip>totalDebitos<b>{{'\xa0'}}${{ kit.redondear(totalDebitos,2,2) }}</b></v-chip>-->
                  <!--<v-chip>totalCreditos<b>{{'\xa0'}}${{ kit.redondear(totalCreditos,2,2) }}</b></v-chip>-->
                    </p>
                  </v-col>

                </v-row>

                <v-card>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sx="12" mx="12">

                        <v-data-table
                          :headers="headersClientes"
                          :items="clientesFiltrados"
                          :footer-props="footerProps4"
                          :search="search"
                          :items-per-page=perPage
                          :page.sync="pagina"
                          :hide-default-footer="true"
                          dense>
                          <template v-slot:item.nombre="{ item }">
                            <div class="pt-2 pb-2">
                              <v-card flat>
                                <v-card-text>

                                  <v-row class="pt-0 pb-0">
                                    <v-col cols="12" class="pt-2 pb-0">
                                      <span class="fg">
                                        <b>{{item.cliente_id}} - {{ item.nombre.substr(0,22)}}</b>
                                      </span>
                                      <v-badge v-if="terceroUserDefined(item)"
                                        class="pt-1 pl-2"
                                        :content="marcaTercero(item,'m')"
                                        :color="marcaTercero(item,'c')"
                                        :dark="temas.forms_btn_add_bg==true">
                                      </v-badge>
                                      <v-badge v-else
                                        class="pt-1 pl-2"
                                        content="registrar"
                                        color="blue"
                                        :dark="temas.forms_btn_add_bg==true">
                                      </v-badge>

                                    </v-col>
                                  </v-row>

                                  <v-row class="pt-0 pb-0" v-if="!viajeEstado('A')">
                                    <v-col cols="12">
                                      <v-tooltip>
                                        <template v-slot:activator="{ on }">
                                          <v-btn v-if="viajeEstado('L')&&item.pedido_id!=null" class="mr-0 ml-1"
                                            fab x-small outlined
                                            :color="temas.barra_lateral_bg"
                                            @click="cambiarBultosDelPedido(item)" v-on="on">
                                            <v-badge
                                              :content="item.bultos.toString()"
                                              :color="temas.forms_btn_add_bg"
                                              :dark="temas.forms_btn_add_bg==true" overlap>
                                              <v-icon medium class="ml-0 mr-2">
                                                mdi-widgets
                                              </v-icon>
                                            </v-badge>
                                          </v-btn>
                                        </template>
                                        <span class="fg">Bultos-{{ item.bultos }}</span>
                                      </v-tooltip>

                                      <v-tooltip bottom v-if="item.cpr!='Sin Pedido'">
                                        <template v-slot:activator="{ on }">
                                          <v-btn  v-if="item.tercero.user!=undefined" class="mr-0 ml-1"
                                            outlined fab x-small
                                            :color="temas.barra_lateral_bg"
                                            @click="articulosDelPedido(item)" v-on="on">
                                            <v-icon>mdi-stocking</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Ver Artículos</span>
                                      </v-tooltip>

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-badge v-if="item.tercero.user!=undefined"
                                            dot :color="item.observ==null?'red':'green'">
                                            <v-btn v-if="item.tercero.user!=undefined" class="mr-0 ml-1"
                                              outlined fab x-small
                                              :color="temas.barra_lateral_bg"
                                              @click="observacion(item)" v-on="on">
                                              <v-icon>mdi-format-align-justify</v-icon>
                                            </v-btn>
                                          </v-badge>
                                        </template>
                                        <span>
                                          {{ item.observ!=null?item.observ:'Observaciones'}}
                                        </span>
                                      </v-tooltip>

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn v-if="item.tercero.user!=undefined" class="mr-0 ml-1"
                                            outlined fab x-small
                                            :color="temas.barra_lateral_bg"
                                            @click="verPedidosAnteriores(item)" v-on="on">
                                            <v-icon>mdi-glasses</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Ver Pedidos Anteriores</span>
                                      </v-tooltip>

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            v-if="iconoVariable('A','F',item)"
                                            class="mr-0 ml-1" fab x-small outlined
                                            :color="iconoVariable('A','O',item)"
                                            @click="iconoVariable('A','C',item)" v-on="on">
                                            <v-icon> {{ iconoVariable('A','I',item) }} </v-icon>
                                          </v-btn>
                                        </template>
                                        <span>{{ iconoVariable('A', 'T', item) }}</span>
                                      </v-tooltip>

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            v-show="iconoVariable('T','F',item)"
                                            class="mr-0 ml-1" fab x-small outlined
                                            :color="iconoVariable('T','O',item)"
                                            @click="iconoVariable('T','C',item)" v-on="on">
                                            <v-icon>{{ iconoVariable('T','I',item) }}</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>{{ iconoVariable('T','T',item) }}</span>
                                      </v-tooltip>

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            v-if="((viajeEstado('I')&&(operarioArea=='V'||operarioArea=='X'))||
                                            (viajeEstado('R')&&(operarioArea=='R'||operarioArea=='X')))"
                                            class="mr-0 ml-1"
                                            outlined fab x-small
                                            :color="temas.barra_lateral_bg"
                                            @click="saySaldo(item)" v-on="on">
                                            <v-icon>mdi-currency-usd</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Saldo</span>
                                      </v-tooltip>

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            v-if="((viajeEstado('I')&&(operarioArea=='V'||operarioArea=='X'))||
                                            (viajeEstado('R')&&(operarioArea=='R'||operarioArea=='X')))&&
                                            item.cpr!='Sin Pedido'"
                                            class="mr-0 ml-1"
                                            outlined fab x-small
                                            :color="colorDescargado(item)"
                                            @click="descargarMercaderia(item)" v-on="on">
                                            <v-icon>
                                              {{!item.descargado?
                                              'mdi-arrow-down-drop-circle':'mdi-arrow-up-drop-circle'}}
                                            </v-icon>
                                          </v-btn>
                                        </template>
                                        <span>
                                          {{item.descargado?'Mercadería Descargada':'Descargar Mercadería'}}
                                        </span>
                                      </v-tooltip>

                                    </v-col>
                                  </v-row>
                                </v-card-text>
                              </v-card>
                            </div>
                          </template>

                          <template v-slot:item.ped="{ item }">
                            <v-row>
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2 fg90">
                                    <div v-if="item.ped.length>0" class="text-center pt-1 pb-1">
                                      <div v-for="(item, i) in item.ped" :key="i">
                                        <span>{{item.cpr}}</span><br>
                                        <span><b>${{kit.redondear(item.importe,2,2)}}</b></span>
                                      </div>
                                    </div>
                                    <div v-else>
                                      <span>Pendiente</span>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>

                          <template v-slot:item.fac="{ item }">
                            <v-row>
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2 fg90">
                                    <div v-if="item.fac.length>0">
                                      <div v-for="(item, i) in item.fac" :key="i">
                                        <span>{{item.cpr}}</span><br>
                                        <span><b>${{kit.redondear(item.importe,2,2)}}</b></span>
                                      </div>
                                    </div>
                                    <div v-else>
                                      <span>Pendiente</span>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>

                          <template v-slot:item.nddndc="{ item }">
                            <v-row>
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2 fg90">
                                    <div v-if="item.nddndc.length>0">
                                      <div v-for="(item, i) in item.nddndc" :key="i">
                                        <span>{{item.cpr}}</span><br>
                                        <span><b>${{kit.redondear(item.importe,2,2)}}</b></span>
                                      </div>
                                    </div>
                                    <div v-else>
                                      <span>Pendiente</span>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>

                          <template v-slot:item.rem="{ item }">
                            <v-row>
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2 fg90">
                                    <div v-if="item.rem.length>0" class=" text-center pt-1 pb-1">
                                      <span>{{item.rem[0].cpr}}</span>
                                    </div>
                                    <div v-else>
                                      <span>Pendiente</span>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>

                          <template v-slot:item.rec="{ item }">
                            <v-row>
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2 fg90">
                                    <div v-if="item.rec.length>0">
                                      <div v-for="(item, i) in item.rec" :key="i">
                                        <span>{{item.cpr}}</span><br>
                                        <b>${{kit.redondear(item.importe,2,2)}}</b>
                                        <span v-if="item.hayMaletin">
                                          <v-badge class="ml-2"
                                            :content="item.hayMaletin?'m':''"
                                            :color="temas.forms_btn_add_bg"
                                            :dark="temas.forms_btn_add_bg==true">
                                          </v-badge>
                                        </span>
                                      </div>
                                    </div>
                                    <div v-else>
                                      <span>Pendiente</span>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>
                        </v-data-table>

                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card>
            </v-dialog>
            <!-- FIN ADMINISTRACION DE PEDIDOS -->

            <!-- BULTOS DEL PEDIDO -->
            <v-dialog v-model="dialogBultos" max-width="400px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogBultos=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right pl-5">
                    Editar Bultos
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="bultos>0"
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text"
                    @click="bultosDelPedidoHTTP()">
                    Confirmar
                  </v-btn>
                </v-toolbar>
                <v-form ref="bultos">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6" sx="6" mx="6" offset="3">
                          <v-text-field
                            dense type="number"
                            autofocus
                            v-model="bultos"
                            :rules="bultosRules"
                            label="Bultos">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN INGRESO DE BULTOS -->

            <!-- INICIAR REPARTO -->
            <v-dialog v-model="dialogIniciarReparto" max-width="500px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogIniciarReparto=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="fg text--right pl-5">
                    Iniciar Reparto
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text"
                    @click="viajeIniciarRepartoHTTP()">
                    Confirmar
                  </v-btn>
                </v-toolbar>
                <v-form ref="bultos">
                  <v-card-text>
                    <!--<v-container>-->
                      <v-row class="fg pt-4">
                        <v-col cols="12" sx="12" mx="12">
                          <!-- HEV021 -->
                          <span>
                            Vas a iniciar el Reparto para la zona
                            <b>{{itemActual!=null?itemActual.zona:''}}</b>.<br>
                            Todos los Clientes del recorrido serán notificados.<br><br>
                            <span v-if="usaMaletines">
                              Si vas a realizar cobranzas quizás sea un buen<br>
                              momento para crear un Maletín.<br>
                            </span>
                          </span>
                          <v-switch class="pl-6 pt-6" v-if="usaMaletines"
                            label="Crear un nuevo Maletín para este Reparto"
                            :color="temas.cen_btns_bg"
                            v-model="crearNuevoMaletin">
                          </v-switch>
                        </v-col>
                      </v-row>
                    <!--</v-container>-->
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG INICIAR REPARTO -->

            <!-- ARTICULOS DEL REPARTO / PEDIDO -->
            <v-dialog v-model="dialogRepartoPedidoArticulos" max-width="1200px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card class="fg" height="700px">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogRepartoPedidoArticulos=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    Artículos del Pedido {{itemActualCliente!=null?itemActualCliente.cpr:''}}
                  </span>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-container class="px-0">
                    <v-row class="px-0">
                      <v-col cols="12" sx="12" mx="12">
                        <v-data-table
                          :headers="headersRepartoArticulos"
                          :items="itemsRepartoPedidoUnds"
                          dense
                          class="elevation-1">
                          <template v-slot:item.codigo="{ item }">
                            <span>{{ item.codigo }}</span>
                          </template>
                          <template v-slot:item.nomart="{ item }">
                            <span>{{ item.nombre }}</span>
                          </template>
                          <template v-slot:item.cantidad="{ item }">
                            <span>{{ formatoImporte(item.cantidad) }}</span>
                          </template>
                          <template v-slot:item.kgs="{ item }">
                            <span>{{ formatoImporte(item.kgs||0) }}</span>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- FIN ARTICULOS DEL REPARTO / PEDIDO -->

            <!-- SALDOS -->
            <v-dialog v-model="dialogSaldo" max-width="520px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card class="fg" height="700px">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogSaldo=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right fg">
                    Saldo del Cliente {{itemActualCliente!=null?itemActualCliente.tercero.nombre:''}}
                  </span>
                </v-toolbar>
                <v-card-text>
                  <v-container class="px-0">
                    <v-row class="px-0">
                      <v-col cols="12" sx="12" mx="12">
                        <v-data-table
                          :headers="headersSaldo"
                          :items="itemsSaldo"
                          dense class="elevation-1">
                          <template v-slot:item.cpr="{ item }">
                            <span>{{ kit.cpr(item.cpr) }}</span>
                          </template>
                          <template v-slot:item.vencimiento="{ item }">
                            <span>{{ item.vencimiento }}</span>
                          </template>
                          <template v-slot:item.pendiente="{ item }">
                            <span>${{ formatoImporte(item.pendiente) }}</span>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- FIN SALDOS -->

            <!-- STOCKS CONSOLIDADOS -->
            <v-dialog v-model="dialogStocksConsolidados" max-width="800px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogStocksConsolidados=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">Ver Stocks Consolidados</span>
              </v-toolbar>
              <v-card class="fg">
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6" offset="3" class="mt-3 pt-0 pl-1 pr-0">
                          <v-text-field
                            ref="busartstk"
                            outlined :label="$store.state.codigooid=='C'?'Ingrese le Código':'Ingrese el ID'"
                            autofocus
                            class="fg text-input-blue"
                            :color="temas.forms_titulo_bg"
                            v-model="busArt"
                            @focus="$event.target.select()"
                            @blur="buscarArtStock()">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row v-if="seleccionarArticulo">
                        <v-col cols="12">

                          <v-data-table
                            :headers="headersStocksConsolidados"
                            :items="selArt"
                            :color="temas.forms_titulo_bg"
                            dense class="elevation-1"
                            single-select
                            @click:row="selArtStockClick"
                            :footer-props="footerProps10">
                            <template v-slot:item.precio="{ item }">
                              <span>${{ formatoImporteDec(item.precio,3) }}</span>
                            </template>
                            <template v-slot:item.nomart="{ item }">
                              <span>{{ item.nombre }}</span>
                            </template>
                          </v-data-table>

                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" class="fg mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            outlined label="Descripción"
                            disabled
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.nombre">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="3" class="mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            outlined label="Stock Físico" class="fg"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.stockfisico"
                            disabled type="number">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" class="mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            outlined label="Pedidos Confirmados"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.stockpedcon"
                            disabled type="number">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" class="mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            outlined label="Pedidos aún no Confirmados"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.stockpednocon"
                            disabled type="number">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" class="mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            outlined label="Stock Total"
                            :color="temas.forms_titulo_bg"
                            v-model="stockTotal"
                            disabled type="number">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN STOCKS CONSOLIDADOS -->

            <!-- MOSTRAR MAPA DEL REPARTO -->
            <v-dialog v-model="dialogMostrarMapaDelReparto" max-width="1100px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogMostrarMapaDelReparto=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">Mapa del Recorrido</span>
              </v-toolbar>
              <v-card class="fg">

                <gmap-map
                  :zoom="15"
                  :center="center"
                  style="width:100%;  height: 600px;">
                  <gmap-marker
                    :key="index"
                    v-for="(m, index) in locationMarkers"
                    :position="m.position"
                    @click="center=m.position">
                  </gmap-marker>
                </gmap-map>

              </v-card>
            </v-dialog>
            <!-- FIN MOSTRAR MAPA DEL REPARTO -->


            <!-- OBSERVACION PARA EL CLIENTE -->
            <v-dialog v-model="dialogObservacion" max-width="800px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
              :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogObservacion=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  Observacion para <b>{{itemActualCliente!=null?itemActualCliente.tercero.nombre:''}}</b>
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="observ"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardoObservHTTP">
                  Guardar Observación
                </v-btn>

              </v-toolbar>
              <v-card class="fg">
                <v-form ref="art3">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" class="pt-3 pl-6 pr-0">
                        <v-text-field
                          ref="busartstk"
                          label='Observación'
                          autofocus
                          class="fg text-input-blue"
                          :color="temas.forms_titulo_bg"
                          v-model="observ"
                          @focus="$event.target.select()">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN OBSERVACION PARA EL CLIENTE -->

            <!-- INCLUSION DE NUEVOS CLIENTES AL RECORRIDO -->
            <v-dialog v-model="dialogClientesNuevos" max-width="900px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card class="fg">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogClientesNuevos=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    Nuevos Clientes para este Viaje
                  </span>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <span class="text--right">
                    <v-btn v-show="nuevosSeleccionados.length"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="agregarClientesNuevosAlRecorridoHTTP">
                      Confirmar
                      <v-badge
                        :content='nuevosSeleccionados.length'
                        :color="temas.forms_btn_add_bg"
                        :dark="temas.forms_btn_add_bg==true">
                      </v-badge>
                    </v-btn>
                  </span>
                </v-toolbar>

                <v-form ref="art">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-data-table
                            v-model="nuevosSeleccionados"
                            :headers="headersTerceros"
                            :items="nuevos"
                            :single-select="false"
                            item-key="id"
                            show-select dense
                            class="elevation-1"
                            @toggle-select-all="selectAll">
                          </v-data-table>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN INCLUSION DE CLIENTES AL NUEVO RECORRIDO -->

            <!-- ADMINISTRACION DE ARTICULOS DEL PEDIDO -->
            <v-dialog v-model="dialogArticulos" max-width="1200px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogArticulos=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="fg text--right">
                  AGREGAR ITEMS -
                  {{ itemActualCliente!=null ? itemActualCliente.nombre : '' }} -
                  Total Pedido <b>$ {{ formatoImporte(totalPedido) }}</b>
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="articulos.length>0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarArticulosHTTP">
                  Guardar Items
                </v-btn>
              </v-toolbar>
              <v-card class="fg">
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>

                      <v-row>
                        <v-col cols="2" v-show="editadoArt.ofeunidades>0">
                          <v-chip outlined>
                            <strong>{{promosComputer}}</strong>
                          </v-chip>
                        </v-col>
                      </v-row>

                      <!-- ITEMS DEL COMPROBANTE -->
                      <span dense class="fg150b">Items</span>
                      <v-row>
                        <v-col cols="1" class="mt-3 pt-0 pl-1 pr-0">
                          <v-text-field
                            ref="buscar"
                            filled dense :label="$store.state.codigooid=='C'?'Código':'ID'"
                            autofocus
                            class="fg text-input-blue"
                            :color="temas.forms_titulo_bg"
                            v-model="busArt"
                            @keyup.esc="cancelaLinea()"
                            @focus="$event.target.select()"
                            @blur="buscarArt(false)">
                          </v-text-field>
                        </v-col>
                        <v-col  cols="4" class="fg mt-3 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Descripción"
                            disabled
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.nombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-badge
                            :content="editadoArtStock(editadoArt.stock)"
                            :color="temas.forms_btn_add_bg"
                            :dark="temas.forms_btn_add_bg==true">
                            <v-text-field
                              filled dense label="Cantidad" class="fg"
                              :color="temas.forms_titulo_bg"
                              v-model="editadoArt.cantidad"
                              type="number" ref="cantidad"
                              @focus="$event.target.select()"
                              @change="cantidadItem()"
                              @blur="guardarItem('cantidad')"
                              @keyup.esc="cancelaLinea()">
                            </v-text-field>
                          </v-badge>
                        </v-col>

                        <!--
                          HUGUITOOOOOOOOOOOOOOOO
                        -->

                        <v-col cols="2" class="mt-0 pt-3 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Precio"
                            ref="precio"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.precio"
                            :disabled="editadoArt.codigo!='TEXTO'"
                            type="number">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-badge v-if="editadoArt.preciomediocobro"
                            content="pmc"
                            :color="temas.forms_btn_add_bg"
                            :dark="temas.forms_btn_add_bg==true">
                            <v-text-field
                              filled dense label="%Desc." class="fg"
                              :color="temas.forms_titulo_bg"
                              v-model="editadoArt.tasadescuento"
                              :disabled="precioOrigen!='Lista'"
                              type="number" ref="tasadescuento"
                              @focus="$event.target.select()"
                              @change="tasaDescuento()">
                            </v-text-field>
                          </v-badge>
                          <v-text-field v-else
                            filled dense label="%Desc." class="fg"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.tasadescuento"
                            :disabled="precioOrigen!='Lista'"
                            type="number" ref="tasadescuento"
                            @focus="$event.target.select()"
                            @change="tasaDescuento()">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-select
                            filled dense label="IVA" class="fg70"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.iva_id"
                            :items="ivaTasas" item-value="id"
                            item-text="nombre" return-object
                            @blur="guardarItem('tasadeiva')">
                          </v-select>
                        </v-col>
                        <v-col cols="2" class="mt-0 pt-3 pl-1 pr-0">
                          <v-text-field
                            filled dense label="TOTAL"
                            :color="temas.forms_titulo_bg"
                            disabled type="number"
                            v-model="editadoArt.total">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col v-show="seleccionarArticulo == true"
                          cols="12" sm="12" md="12">
                          <v-data-table
                            :headers="headersSelArt"
                            :color="temas.forms_titulo_bg"
                            :items="selArt"
                            dense
                            class="elevation-1"
                            single-select
                            @click:row="selArtClick"
                            :footer-props="footerProps10">
                            <template v-slot:item.precio="{ item }">
                              <span>${{ formatoImporteDec(item.precio,3) }}</span>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0">
                          <v-data-table
                            :headers="headersArt"
                            :items="articulos"
                            dense
                            item-key='index'
                            class="elevation-1 pr-0 ml-0"
                            @click:row="editarArt">
                            <template v-slot:item.codigo="{ item }">
                              <span class="fg85">{{ item.codigo }}</span>
                              <v-badge
                                inline
                                :content="itemIvaTasa(item.iva_id)"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
                            </template>
                            <template v-slot:item.nombre="{ item }">
                              <span class="fg85">{{ item.nombre }}</span>
                            </template>
                            <template v-slot:item.cantidad="{ item }">
                              <span
                                class="fg85">{{ formatoImporte(item.cantidad) }}
                              </span>
                            </template>
                            <template v-slot:item.precio="{ item }">
                              <span
                                class="fg85">${{ formatoImporteDec(item.precio,3) }}
                              </span>
                            </template>
                            <template v-slot:item.tasadescuento="{ item }">
                              <v-badge v-if="item.texto=='Promocion'"
                                class="pt-5 pl-0 pr-0"
                                overlap
                                content="ofe"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
                              <span class="fg85">
                                {{ formatoImporte(item.tasadescuento) }}
                              </span>
                            </template>
                            <template v-slot:item.importedescuento="{ item }">
                              <span
                                class="fg85">${{ formatoImporte(item.importedescuento) }}
                              </span>
                            </template>
                            <template v-slot:item.total="{ item }">
                              <strong>
                                <span class="fg100">${{ formatoImporte(item.total) }}</span>
                              </strong>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    class="pl-1 pr-1"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="editarArt(item)" v-on="on">
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="pl-1 pr-1"
                                    @click.stop="borrarItem(item)" v-on="on">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar Item</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- FIN ITEMS DE COMPROBANTE -->

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN ADMINISTRACION DE ARTICULOS DEL PEDIDO -->

            <!-- DIALOG DIA Y HORA DE VISITA  -->
            <!--
            <v-dialog v-model="dialogEditarRecorrido" max-width="600px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogEditarRecorrido=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  EDITAR RECORRIDO
                  {{ itemActualCliente!=null ? itemActualCliente.nombre : '' }}
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarRecorridoHTTP">
                  Guardar
                </v-btn>
              </v-toolbar>
              <v-card class="fg">
                <v-form ref="art4">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6" sx="6" mx="6">
                          <v-text-field
                            label="Fecha"
                            autofocus
                            v-model="editadoRecorrido.fecha"
                            outlined type="date"
                            :color="temas.cen_btns_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="12" lg="12" md="6" sm="4" xs="4">
                          <v-textarea
                            v-model="editadoRecorrido.observ"
                            :color="temas.forms_titulo_bg"
                            label="Observaciones"
                            auto-grow
                            outlined
                            rows="4"
                            row-height="25"
                            shaped>
                          </v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            -->
            <!-- FIN DIALOG DIA Y HORA DE VISITA  -->

            <!-- DIALOG PEDIDOS ANTERIORES  -->
            <v-dialog v-model="dialogPedidosAnteriores" max-width="1200px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogPedidosAnteriores=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  Pedidos Anteriores de
                  {{ itemActualCliente!=null ? itemActualCliente.nombre : '' }}
                </span>
              </v-toolbar>
              <v-card class="fg">
                <v-form ref="art4">
                  <v-card-text>
                    <v-container>
                      <v-data-table
                        :headers="headersPedidosAnteriores"
                        :items="pedidosAnteriores"
                        dense
                        :footer-props="footerProps7">
                        <template v-slot:item.fecha="{ item }">
                          <span>{{ formatoFechaCorta(item.fecha) }}</span>
                        </template>
                        <template v-slot:item.cpr="{ item }">
                          <span>{{ kit.cpr(item.cpr) }}</span>
                        </template>
                        <template v-slot:item.cantidad="{ item }">
                          <span>{{ kit.redondear(item.cantidad,2,2) }}</span>
                        </template>
                      </v-data-table>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG PEDIDOS ANTERIORES  -->
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
        <!--
        <template v-slot:item.user.username="{ item }">
          <span>{{ item.user.username }}</span>
        </template>
        -->
        <template v-slot:item.fecha="{ item }">
          <v-badge
            :content="diasDelViaje(item)">
            <span>{{ formatoFechaCorta(item.fecha) }}</span>
          </v-badge>
        </template>
        <!--
          <template v-slot:item.vendido="{ item }">
            <span>$ {{ formatoImporte(item.vendido) }}</span>
          </template>
        -->
        <template v-slot:item.estado="{ item }">
          <v-chip
            fab
            class="fg85"
            :color="getEstado(item.estado,'c')"
            :dark="getEstado(item.estado,'k')">
            <b>{{ getEstado(item.estado,'e') }}</b>
          </v-chip>
        </template>

        <!--
        <template v-slot:item.todocobrado="{ item }">
          <v-chip
            :color="getColor(item.todocobrado)"
            dark>{{ item.todocobrado ? 'Sí' : 'No' }}
          </v-chip>
        </template>
        -->

        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="setAcciones(item)">
                <v-icon>mdi-18px mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item-group :color="temas.forms_titulo_bg">
                <v-list-item
                  v-for="(item, i) in acciones" :key="i">
                  <v-list-item-icon>
                    <v-icon
                      class="font-size: 24px"
                      @click="selAccion(item)" v-text="item.icon">
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      class="caption" @click="selAccion(item)">{{ item.nombre }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
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

const home = { lat: -33.111680, lng: -64.332395};

export default {
  components: {
    SBar,
    Confirmacion,
    Mail,
    impresiones,
  },
  data: () => ({
    color: { 10: 'purple', 40: 'blue', 30: 'green' },
    mercaderiaEntregada: false,
    sayFiltro: "Solo clientes sin pedidos",
    viaje_id: null,
    zonaNombre: null,
    estadoDelViaje: null,
    usaelsistema: false,
    observ: null,
    descuentosCli: [],
    clientesDelRecorrido: 0,
    filtroClientes: 0,
    formTitleArt: '',
    busArt: '',
    busArtSave: '',
    pagina: 1,
    perPage: 4,
    seleccionarArticulo: false,
    progress: false,
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    cliente: null,
    acciones: [],
    accionesRecorrido: [],
    equipo: [],
    articulos: [],
    pedidosAnteriores: [],
    zonas: [],
    selArt: [],
    clientes: [],
    ivaTasas: [],
    depItems: [],
    ivaTasas: [],
    valores: [],
    items: [],
    itemsRecorrido: [],
    itemsSaldo: [],
    itemsRepartoPedidoUnds: [],
    expandedPedidos: [],
    itemActual: null,
    itemActualCliente: null,
    viculosPadresDelCliente: [],
    vinculosPadresLicDelCliente: [],
    rentabilidad: 0,
    totalPedido: 0,
    totalPedidos: 0,
    totalDebitos: 0,
    totalCreditos: 0,
    totalRecibos: 0,
    cantidadPedidos: 0,
    msg: { msgAccion: null, msgVisible: false, msgTitle: '', msgBody: '', msgButtons: [''] },
    editedIndex: 0,
    editedIndexArt: 0,
    editedIndexVje: 0,
    footerProps: {'items-per-page-options': [8]},
    footerProps4: {'items-per-page-options': [4]},
    footerProps7: {'items-per-page-options': [7]},
    footerProps10: {'items-per-page-options': [10]},
    search: '',
    dialog: false,
    dialogSaldo: false,
    dialogBultos: false,
    dialogArticulos: false,
    dialogObservacion: false,
    dialogClientesNuevos: false,
    dialogIniciarReparto: false,
    dialogEditarRecorrido: false,
    dialogPedidosAnteriores: false,
    dialogStocksConsolidados: false,
    dialogMostrarMapaDelReparto: false,
    dialogAdministracionPedidos: false,
    dialogRepartoPedidoArticulos: false,
    viajesStaticsSay: 0,

    crearNuevoMaletin: 0,

    bultos: 0,
    bultosRules: [
      v => !!v || "Debe ser un valor mayor a cero",
    ],

    // para el mapa
    center: home,
    locationMarkers: [],
    currentLocation : { lat : 0, lng : 0},

    editadoArt: {
      id: '', articulo_id: '', codigo: '', codbar: '', nombre: '', deposito_id: '', unidad_id: '', moneda_id: 51, iva_id: '', cantidad: 1,
      cantidadoriginal: 1, stock: 0, costo: 0, precio: 0, preciooriginal: 0, undstock: 0, sinstock: 'C', tasadescuento: 0, importedescuento: 0,
      decimales: 0, total: 0, texto: '', vencimiento: '', ofeprecio: 0, ofetasadescuento: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '', padre_id: null,
      undenvase: 1, escombo: false, preciomediocobro: false, tasaproprecargo: 0, adevolver: 0, turno_id: null, stockfisico: 0, stockpedcon: 0,
      stockpednocon: 0,
    },
    defaultItemArt: {
      id: '', articulo_id: '', codigo: '', codbar: '', nombre: '', deposito_id: '', unidad_id: '', moneda_id: 51, iva_id: '', cantidad: 1,
      cantidadoriginal: 1, stock: 0, costo: 0, precio: 0, preciooriginal: 0, undstock: 0, sinstock: 'C', tasadescuento: 0, importedescuento: 0,
      decimales: 0, total: 0, texto: '', vencimiento: '', ofeprecio: 0, ofetasadescuento: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '', padre_id: null,
      undenvase: 1, escombo: false, preciomediocobro: false, tasaproprecargo: 0, adevolver: 0, turno_id: null, stockfisico: 0, stockpedcon: 0,
      stockpednocon: 0,
    },
    editado: {
      fecha: '', tercero_id: null, user_id: null, zona_id: null, viaticos: 0, observ: '', recorrido: []
    },

    /*
    editadoRecorrido: {
      id: null, viaje_id: null, cliente_id: null, orden: null, fecha: null, observ: null, comprobante_id: null, estado: null
    },
    */

    nuevos: [],               // clientes nuevos para un viaje cargado con anterioridad
    nuevosSeleccionados: [],  // clientes nuevos seleccionados
    precioOrigen: 'Lista',    // Lista o Promocion, por defecto Lista = precios.precio
    promoDescuento: 0,        // Descuento por Promo ( si hay )
    precioDescuento: 0,       // Descuento de Promocion o de Item ( ingresado en Compras )

    /*ok*/
    headers: [
      { text: 'NºVje', value:'id', align: 'end', width: 70},
      { text: 'Fecha', value:'fecha', align: 'left', width: 100},
      { text: 'Zona', value:'zona', align: 'left', width: 250},
      { text: 'Estado', value:'estado', align: 'left', width: 100},
//    { text: 'Todo Cobrado', value:'todocobrado', align: 'left', width: 100},
      { text: 'Acciones', value:'accion', align: 'left', width: 100},
    ],

    /*ok*/
    headersClientes: [
      { text: 'Recorrido', value:'nombre', align: 'left', width: 272 },
      { text: 'Pedido', value:'ped', align: 'left', width: 113 },
      { text: 'Factura', value:'fac', align: 'left', width: 113 },
      { text: 'Ndd/Ndc', value:'nddndc', align: 'left', width: 113 },
      { text: 'Remito', value:'rem', align: 'left', width: 113 },
      { text: 'Recibo', value:'rec', align: 'left', width: 113 },
    ],

    /*ok*/
    headersRepartoArticulos: [
      { text: 'ID', align: 'left', width: 100},
      { text: 'Código', value:'codigo', align: 'left', width: 150},
      { text: 'Descripción', value:'nombre', align: 'left', width: 450},
      { text: 'Cantidad', value:'cantidad', align: 'end', width: 100},
      { text: 'Bultos', value:'bultos', align: 'left', width: 90},
      { text: 'Peso', value:'peso', align: 'left', width: 90},
      { text: 'Kgs', value:'kgs', align: 'left', width: 90},
    ],

    /*ok*/
    headersSaldo: [
      { text: 'Comprobante', value:'cpr', align: 'left', width: 150},
      { text: 'Vencimiento', value:'vencimiento', align: 'left', width: 150},
      { text: 'Pendiente', value:'pendiente', align: 'end', width: 150},
    ],

    /*ok*/
    headersStocksConsolidados: [
      { text: 'ID', value:'id', align: 'left', width: 100},
      { text: 'Código', value:'codigo', align: 'left', width: 150},
      { text: 'Descripción', value:'nombre', align: 'left', width: 450},
    ],

    /*ok*/
    headersSelArt: [
      { text: 'ID', value:'id', align: 'left', width: 50},
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 350},
      { text: 'STOCK', value:'stock', align: 'end', width: 100},
      { text: 'PRECIO', value:'precio', align: 'end', width: 100},
    ],

    /*ok*/
    headersArt: [
      { text: 'Código', value:'codigo', align: 'left', width: 140},
      { text: 'Descripción', value:'nombre', align: 'left', width: 300},
      { text: 'Ctt.', value:'cantidad', align: 'end', width: 120},
      { text: 'Precio', value:'precio', align: 'end', width: 120},
      { text: '%Des.', value:'tasadescuento', align: 'end', width: 100},
      { text: 'Desc.', value:'importedescuento', align: 'end', width: 90},
      { text: 'TOTAL', value:'total', align: 'end', width: 130},
      { text: 'Acciones', value: 'accion', sortable: false, width: 100 },
    ],

    /*ok*/
    headersPedidosAnteriores: [
      { text: 'NºVje', value:'viaje_id', align: 'end', width: 80},
      { text: 'Fecha', value:'fecha', align: 'left', width: 130},
      { text: 'Pedido', value:'cpr', align: 'left', width: 130},
      { text: 'Artículo', value:'codigooid', align: 'left', width: 120},
      { text: 'Descripcion', value:'nombre', align: 'left', width: 400},
      { text: 'Cantidad', value:'cantidad', align: 'end', width: 150},
    ],

    /* Ok */
    headersTerceros: [
      { text: 'Id', value:'id', width: 120},
      { text: 'Nombre', value:'nombre', width: 320},
    ],

    medpag: [
      {id:1, nombre: 'Efectivo',         activo: true,  tipo:'CAJ', total: 0},
      {id:2, nombre: 'Tarj.de Crédito',  activo: true,  tipo:'TDC', total: 0},
      {id:3, nombre: 'Tarj.de Débito',   activo: true,  tipo:'TDD', total: 0},
      {id:4, nombre: 'Cuenta Corriente', activo: false, tipo:'CTE', total: 0},
      {id:5, nombre: 'Transferencia',    activo: true,  tipo:'TRA', total: 0},
      {id:6, nombre: 'Cheque',           activo: true,  tipo:'CHE', total: 0},
      {id:7, nombre: 'Mercado Pago',     activo: true,  tipo:'MEP', total: 0},
      {id:8, nombre: 'Todo Pago',        activo: true,  tipo:'TPA', total: 0},
      {id:9, nombre: 'Canje',            activo: false, tipo:'CJE', total: 0},
    ],

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
      'notificaciones',
      'caja',
      'vinculosPadres', 
      'vinculosPadresLic',
      'vinculosPadresAll',
      'vinculosHijos',
      'empresa',
      'datosEmpresa',
      'responsable',
      'cuit',
      'operario',
      'operarioUserId',
      'operarioEsVendedor',
      'operarioTerceroId',
      'operarioArea',
      'level',
      'codigooid',
      'pedTransfAVend',
      'descuentos',
      'usaMaletines',
      'dolar', 'transition',
    ]),

    promosComputer() {
      let res = ''
      if (this.editadoArt.ofeprecio!=0) {
        res = 'Promo '+this.editadoArt.ofeunidades+'un/'+this.editadoArt.ofetasadescuento+'% off '
      }
      return res
    },

    stockTotal () {
      return this.editadoArt.stockfisico-this.editadoArt.stockpednocon-this.editadoArt.stockpedcon 
    },

    clientesFiltrados() {
      if (this.estadoDelViaje=='V') {
        this.sayFiltro = "Solo clientes sin pedidos"
        if (this.filtroClientes) {
          return this.clientes.filter(x => x.pedido.length==0 )
        } else {
          return this.clientes
        }
      } else if (this.estadoDelViaje=='R') {
        this.sayFiltro = "Clientes ya visitados"
        if (this.filtroClientes) {
          return this.clientes.filter(x => x.descargado==true )
        } else {
          return this.clientes
        }
      } else {
        this.sayFiltro = "Todos los Clientes"
        return this.clientes
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
  },

  mounted () {
    this.$store.commit('closeAlert')
    moment.locale('es');
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      this.headersArt[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
      this.headersArt[0].value = this.$store.state.codigooid == 'C'?'codigo':'articulo_id'
      this.headersRepartoArticulos[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
      this.headersRepartoArticulos[0].value = this.$store.state.codigooid == 'C'?'codigo':'id'
    }
  },

  created () {
    this.cen_activo_bg   = this.$store.state.temas.cen_card_activo_bg
    this.cen_activo_dark = this.$store.state.temas.cen_card_activo_dark

    debugger
    return HTTP().get('/user/'+this.userId).then(({ data }) => {
      
      debugger
      let psuc = data[0].sucursales.map(function(e) { return e.id; }).indexOf(this.sucursal);
      for (let i=0; i<= data[0].sucursales[psuc].depositos.length-1; i++) {
        this.depItems.push(data[0].sucursales[psuc].depositos[i])
      }
      return HTTP().get('/afipiva').then(({ data }) => {
        this.ivaTasas = []
        for (let i=0; i<=data.length-1; i++) {
          this.ivaTasas.push(data[i])
        }
        
        return HTTP().get('/indexter/false/3/false/'+this.operarioTerceroId+'/'+this.operarioUserId+'/%%').then(({ data })=>{
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
                    zonas: data[i].zonas,
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
    })
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

    cerrarViajes() {
      this.dialogAdministracionPedidos=false
    },

    sucursalActiva(cual) {
      if (this.itemActualCliente==null) return false
      let le = this.itemActualCliente.fac.length
      if (cual==1) {
        if (this.itemActualCliente.salAntA>0) {
          return true
        } else if (le>0) {
          return ((!this.itemActualCliente.fac[0].demo&&cual==1)||this.itemActualCliente.salAntA>0)?true:false
        }
      } else if (le>1||this.itemActualCliente.salAntB>0) {
        if (this.itemActualCliente.salAntB>0) {
          return true
        } else {
          return (this.itemActualCliente.fac[1].demo&&cual==2)?true:false
        }
      } else {
        return false
      }
    },

    iconoVariable(icono,cual,item) {
      // icono: 'A'->Agregar 'T'->Transferir
      // acc: 'F'->If, 'O'->Color, 'C'->Click, 'I'->Icono, 'T'->Tooltip
      if (icono=='A') {
        if (cual=='F') {
          if ((!this.viajeEstado('F')&&!this.viajeEstado('R')&&!this.viajeEstado('L')&&!this.viajeEstado('D'))
            &&(this.operarioArea=='V'||this.operarioArea=='X')&&item.estado!='E') {
            return true
          } else {
            return false
          }
        } else if (cual=='O') {
          return (item.estado=='E')?'green':this.temas.barra_lateral_bg
        } else if (cual=='C') {
          if (item.quienpidio=='C'&&this.pedTransfAVend) {           //tomar el control
            this.tomarControlDelPedido(item)
          } else if (item.quienpidio=='V') {    //agregar items
            this.agregarArticulos(item)
          }
        } else if (cual=='I') {
          if (item.tercero.user==null) {
            return 'mdi-help'
          } else {
            if (item.quienpidio=='C') {
              return this.pedTransfAVend?'mdi-file-check':'mdi-close'
            } else {
              return item.estado=='E'?'mdi-file-check':'mdi-plus'
            }
          }
        } else if (cual=='T') {
          if (item.tercero.user==null) {
            return 'Requiere Registro'
          } else {
            if (item.estado=='E') {
              return 'Pedido Transferido a Administración'
            } else {
              if (item.quienpidio=='V') {
                return 'Agregar Artículos'
              } else if (item.quienpidio=='C') {
                return this.pedTransfAVend?'Tomar Control':'No puedes tomar el Control'
              }
            }
          }
        }
      } else if (icono=='T') {  // icono transferencias de pedidos
        if (cual=='F') {
          if ((item.artped>0)&&
             (!this.viajeEstado('F')&&!this.viajeEstado('R')&&!this.viajeEstado('L')&&(this.operarioArea=='V'||this.operarioArea=='X'))) {
            return true
          } else {
            return false
          }
        } else if (cual=='O') {
          return (item.estado=='E')?'green':this.temas.barra_lateral_bg
        } else if (cual=='C') {
          if (item.tercero.user==null) {
            this.mensaje('¡Se requiere registro!', this.temas.forms_titulo_bg, 1500)
          } else if (item.artped==0) {
            this.mensaje('¡Pedido sin Artículos!', this.temas.forms_titulo_bg, 1500)
          } else if (item.estado=='E') {
            this.mensaje('¡Pedido transferido a Administración!', this.temas.forms_titulo_bg, 1500)
          } else {
            if (item.estado!='E'&&item.artped>0) {
              this.finalizarYEnviarAAdministracion(item)
            }
          }
        } else if (cual=='I') {
          return (item.estado!='E'&&item.artped>0)?'mdi-send':'mdi-stop'
        } else if (cual=='T') {
          if (item.tercero.user==null) {
            return 'Requiere Registro'
          } else {
            if (item.estado=='E') {
              return 'Pedido ya Trasferido a Administración'
            } else if (item.artped==0) {
              return 'Pedido sin Artículos'
            } else {
              return 'Transferir Pedido a Administración'
            }
          }
        }
      }
    },

    itemIvaTasa(iva) {
      let pos = this.ivaTasas.findIndex(x=>x.id==iva)
      return this.ivaTasas[pos].tasa+'%'
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

    seleccionoZona() {
      this.zonas = []
      this.clientes = []
      let pos = this.equipo.findIndex(x=>x.tercero.user.id == this.editado.user_id)
      return HTTP().post('zonassinviajes',{user_id:this.equipo[pos].tercero.user.id}).then(({data})=>{
        for (let i=0; i<=data.zonasdisponibles.length-1; i++) {
          this.zonas.push({
            id: data.zonasdisponibles[i].zona.id,
            nombre: data.zonasdisponibles[i].zona.nombre
          })
        }
      })
    },

    mostrarMapaDelReparto() {

      this.dialogMostrarMapaDelReparto = true

      debugger
      let dir = this.itemActual.direcciones;
      if (typeof google != "undefined") {
        
        let geocoder = new google.maps.Geocoder();

        for (let i=0; i<=dir.length-1; i++) {
          geocoder.geocode({'address': dir[i]}, (results, status) => {
            debugger
            if (status === 'OK') {
              this.currentLocation.lat = results[0].geometry.location.lat();
              this.currentLocation.lng = results[0].geometry.location.lng();
              const marker = {
                lat: this.currentLocation.lat,
                lng: this.currentLocation.lng,
              };
              new google.maps.Marker({
                position: new google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng)
              })
              
              //this.locationMarkers = [
              //  { position: this.currentLocation },
              //]
              
              this.center = marker;
            }
          });
        }

        navigator.geolocation.getCurrentPosition(res => {
          this.center = {
            lat: res.coords.latitude,
            lng: res.coords.longitude
            };
        });

      }

      /*
      var addresses = [
        '1600 Amphitheatre Parkway, Mountain View, CA',
        'One Microsoft Way, Redmond, WA',
        '4 Yawkey Way, Boston, MA'
      ];

      // Inicializar el geocodificador
      var geocoder = new google.maps.Geocoder();

      // Función para manejar el resultado de la geocodificación
      function geocodeAddress(address) {
        geocoder.geocode({ 'address': address }, function (results, status) {
          if (status == 'OK') {
            var location = results[0].geometry.location;
            console.log('Dirección:', address);
            console.log('Latitud:', location.lat());
            console.log('Longitud:', location.lng());
            console.log('---');
          } else {
            console.log('Error al geocodificar la dirección:', address);
          }
        });
      }

      // Iterar sobre las direcciones y geocodificar cada una
      for (var i = 0; i < addresses.length; i++) {
        geocodeAddress(addresses[i]);
      }
      */

    },

    cargoClientesDeLaZona() {
      this.clientes = []
      return HTTP().post('clientesdelazona',{zona_id:this.editado.zona_id}).then(({data})=>{
        if (data.length==0) {

          this.msg.msgTitle = 'Zona sin Clientes'
          this.msg.msgBody = 'No se puede generar un Viaje a esta zona ya que no posee Clientes.<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'zona sin clientes'
          this.msg.msgButtons = ['Aceptar']

        } else {

          for (let i=0; i<=data.length-1; i++) {
  
            let dir = data[i].usertercero.tercero.direcciones[0].direccion+' ('
            dir += data[i].usertercero.tercero.direcciones[0].postal.nombre + ') - '
            dir += data[i].usertercero.tercero.direcciones[0].postal.provincia.nombre + ' - '
            dir += data[i].usertercero.tercero.direcciones[0].postal.provincia.pais.nombre
  
            this.clientes.push({
              id: data[i].usertercero.tercero.id,
              nombre: data[i].usertercero.tercero.nombre,
              direccion: dir,
              orden: data[i].usertercero.orden
            })
          }
        }
      })
    },

    nuevoViaje() {
      this.dialog = true
      this.editedIndex = -1
      this.editado.fecha = moment().format('YYYY-MM-DD')
      this.editado.user_id = this.operarioEsVendedor?this.operarioUserId:null
      this.editado.zona_id = null
      this.editado.viaticos = 0
      this.editado.observ = ''
      this.editado.recorrido = []
      this.editado.equipo_id = this.equipo.length>0?this.equipo[0].id:null
      this.seleccionoZona()
    },

    colorDescargado(item) {
      if (item.descargado) {
        return 'green'
      } else {
        return 'red'
      }
    },

    descargarMercaderia(item) {
      return HTTP().post('/descargarmercaderia', { item: item }).then(({ data }) => {
        if (data=='ok') {
          item.descargado = !item.descargado
        }
      })
    },

    cambiarBultosDelPedido(item) {
      this.itemActualCliente = item
      this.dialogBultos = true
    },

    bultosDelPedidoHTTP() {
      return HTTP().post('/bultosdelpedido', {id: this.itemActualCliente.pedido_id, bultos: this.bultos, }).then(({ data }) => {
        if (data.errno) {
          this.msg.msgTitle = 'Error en la grabación de Bultos'
          msg = 'Código de Error: '+data.estado.code+' ('+data.estado.errno+')<br><br>'
          msg += 'Mensaje: '+data.estado.sqlMessage+'<br>'
          this.msg.msgBody = msg
          this.msg.msgAccion  = 'Error en la grabación de Bultos'
          this.msg.msgButtons = ['Aceptar']
          this.msg.msgVisible = true
        }
        this.dialogBultos = false
        this.itemActualCliente.bultos = this.bultos
        //this.administracionPedidos()
      })
    },
    
    saySaldo(item) {
      this.itemsSaldo = []
      this.itemActualCliente = item
      return HTTP().get('/pendientes/'+item.tercero.id+'/0').then(( { data }) => {
        let saldo = []
        let totPend = 0
        for ( let i=0; i<= data.length-1; i++) {
          saldo.push({
            cpr: data[i].cpr,
            importe: data[i].importe,
            vencimiento: moment(data[i].vencimiento).format('DD-MM-YYYY'),
            pendiente: data[i].pendiente,
          })
          totPend += data[i].pendiente
        }
        if (saldo.length==0) {
          this.msg.msgTitle = 'Sin deuda'
          this.msg.msgBody = 'El cliente no posee deuda!'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'cliente sin deuda'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.itemsSaldo = saldo;
          this.dialogSaldo = true
        }
      })
    },

    agregarArticulos(item) {

      debugger
      let existeUnPedido = false
      if (item.tercero.user==null) {

        this.msg.msgTitle = 'Se Requiere Registro'
        let m = 'Este Cliente pertenece a tus Zonas de Ventas.<br>'
        m += 'Por lo tanto es condición necesaria que tenga una cuenta generada en '
        m += '<b>gohu</b> para que puedas ingresarles pedidos.<br>'
        m += 'Recuerda que desde la ficha de clientes puedes generarle una Cuenta Exclusiva.<br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'cliente sin registro'
        this.msg.msgButtons = ['Aceptar']
      
      } else {

        // releo el recorrido por si ya hizo algun pedido y aun no se refresco en la lectura actual
        return HTTP().post('releorecorrido', {recorrido: item.id} ).then(({ data }) => {

          debugger
//        let pos1 = this.items.findIndex(x=>x.id==this.itemActual.id)
//        let pos2 = this.items[pos1].clientes.findIndex(x=>x.id==item.id)

          if (item.artped==0) { // NO TENIA PEDIDO ABIERTO, PERO REFRESCAMOS Y REVISO DE NUEVO.
            existeUnPedido = (data[0].pedido_id!=null||data[0].pedidob_id!=null)?true:false
          }

          return HTTP().get('/tercero/'+item.tercero.id+'/1/true/'+this.sucursal).then(({ data }) => {
  
            debugger
            this.itemActualCliente = item;
            this.dialogArticulos = true;
            if (item.pedido.length==0) {
              this.editedIndexArt = -1;
              this.articulos = [];
            } else {
              this.editedIndexArt = 0

              debugger
              // AGREGO LA PROPIEDAD index
              this.articulos = item.pedido;
              for (let i=0; i<=this.articulos.length-1; i++) {
                this.articulos[i].index = i
                this.articulos[i].itemId = item.pedido[i].id
              }
              debugger

              for (let i=0; i<=item.pedido.length-1; i++) {
                item.pedido[i].precio = item.pedido[i].costo
              }
            }
            this.totalPedido = 0
            for (let i=0; i<=this.articulos.length-1; i++) {
              this.totalPedido += this.articulos[i].total
            }
            this.editado.cpr = 'PED';

            return HTTP().post('vinculospadreslicdelcliente', {user_id: item.tercero.user.id,tercero_id: item.tercero.id}).then(({ data }) => {
              debugger
              this.vinculosPadresLicDelCliente = data.userVinPadresLic;
              this.descuentosCli = data.descuentos;
            })

          })
        })
      }
    },

    guardarViajeHTTP() {
      debugger
      let pos = this.sucursales.findIndex(x=>x.id=this.sucursal)
      // ordeno los recorridos
      this.clientes.sort(function(a, b) {
        if (a.orden > b.orden) {
          return 1
        } else if (a.orden < b.orden ) {
          return -1
        } else {
          return 0
        }
      })
      let nro = 1
      // busco cual es el orden mas alto
      for (let i=0; i<=this.clientes.length-1; i++) {
        nro = this.clientes[i].orden>nro?this.clientes[i].orden:nro
      }
      for (let i=0; i<=this.clientes.length-1; i++) {
        if (this.clientes[i].orden<nro) {
          this.clientes[i].orden = nro
          nro ++
        }
      }
      debugger
      this.editado.recorrido = this.clientes;
      return HTTP().post('/nuevoviaje', { editado: this.editado }).then(({ data }) => {
        debugger
        if (data!='error') {
          this.msg.msgTitle = 'Nuevo Viaje'
          let m = '¡Viaje generado correctamente!<br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'viaje ok'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = 'Se ha producido un error en intentar generar un nuevo viaje.<br>Reintente, si el problema persiste consulte con sistemas<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'viaje error'
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialog = false
        this.listarHTTP()
      })
    },

    /*
    guardarRecorridoHTTP() {
      return HTTP().post('/editarrecorrido', { recorrido: this.editadoRecorrido }).then(({ data }) => {
        if (data!='error') {
          this.msg.msgTitle = 'Recorrido'
          let m = 'El recorrido se ha actualizado correctamente.<br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'recorrido ok'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = 'Se ha producido un error al intentar actualizar este recorrido.<br>Reintente y si el problema persiste consulte con sistemas<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'recorrido error'
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialogEditarRecorrido = false
        this.listarViajeHTTP()
      })

    },
    */

    guardoObservHTTP() {
      this.itemActualCliente.observ = this.observ
      return HTTP().post('/guardoobserv', { recorrido: this.itemActualCliente }).then(({ data }) => {
        if (data=='ok') {
          this.mensaje('¡La observación se ha registrado correctamente.!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = 'Se ha producido un error al intentar actualizar este recorrido.<br>Reintente y si el problema persiste consulte con sistemas<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'recorrido error'
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialogObservacion = false
      })
    },

    terceroUserDefined(item) {
      if (item.tercero==undefined) {return false}
      return item.tercero.user!=undefined?true:false
    },

    setAcciones(item) {

      debugger
      this.itemActual = item
      this.acciones = []

      // estados de los viajes
      // P -> Viaje pendiente
      // I -> En Viaje
      // D -> Viaje finalizado y en Administracion
      // L -> Viaje listo para Reparto
      // R -> Viaje en Reparto
      // F -> Viaje Finalizado

      let hayPedidos = false
      for (let i=0; i<=this.itemActual.clientes.length-1; i++) {
        if (this.itemActual.clientes[i].pedido_id!=null||this.itemActual.clientes[i].pedidob_id!=null) {
          hayPedidos = true
          break
        }
      }
      if (item.estado=='P') {
        this.acciones.push({nombre: 'Iniciar Viaje', icon: 'mdi-play'})
      }
      if (!hayPedidos) {
        this.acciones.push({nombre: 'Anular', icon: 'mdi-delete'})
      }
      if (item.estado=='I'&&(this.operarioArea=='X'||this.operarioArea=='V')) {
        this.acciones.push({nombre: 'Novedades', icon: 'mdi-pencil'})
        this.acciones.push({nombre: 'Finalizar Viaje', icon: 'mdi-checkbox-marked-circle'})
      }
      if (item.estado=='P'||item.estado=='I') {
        this.acciones.push({nombre: 'Revisar si hay Clientes Nuevos', icon: 'mdi-account-plus'})
      }
      debugger
      if (((this.operarioArea=='X'||this.operarioArea=='R')&&(item.estado=='R'))||
          (this.operarioArea=='X'||this.operarioArea=='V')&&(item.estado=='P'||item.estado=='V'||item.estado=='I')) {
        this.acciones.push({nombre: 'Ingresar al Viaje', icon: 'mdi-nut'})
      }
      if (((this.operarioArea=='X'||this.operarioArea=='R')&&(item.estado=='R'))||
          (this.operarioArea=='X'||this.operarioArea=='V')&&(item.estado=='P'||item.estado=='V')) {
        this.acciones.push({nombre: 'Ver Mapa del Reparto', icon: 'mdi-map-marker'})
      }
      if (((this.operarioArea=='X'||this.operarioArea=='R')&&(item.estado=='R'))||
          (this.operarioArea=='X'||this.operarioArea=='V')&&(item.estado=='P'||item.estado=='V')) {
        this.acciones.push({nombre: 'Ver Mapa del Reparto', icon: 'mdi-map-marker'})
      }
      //if (item.estado=='D') {
      //  this.acciones.push({nombre: 'Viaje en Administración', icon: 'mdi-close'})
      //}
      this.acciones.push({nombre: 'Refrescar', icon: 'mdi-refresh'})
      if (item.estado=='L'&&(this.operarioArea=='X'||this.operarioArea=='R')) {
        this.acciones.push({nombre: 'Iniciar Reparto', icon: 'mdi-truck-delivery'})
      }
      if (item.estado=='R'&&(this.operarioArea=='R'||this.operarioArea=='X')) {
        this.acciones.push({nombre: 'Finalizar Reparto', icon: 'mdi-checkbox-marked-circle'})
      }
      //this.acciones.push({nombre: 'Mapa', icon: 'mdi-earth'})
      //this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})

    },

    async selAccion(item) {
      if (item.nombre=='Ingresar al Viaje') {
        
        this.listarViajeHTTP()
        this.dialogAdministracionPedidos = true
      
      } else if (item.nombre=='Anular') {

        debugger
        let hayPedidos = false
        for (let i=0; i<=this.itemActual.clientes.length-1; i++) {
          if (this.itemActual.clientes[i].pedido_id!=null||this.itemActual.clientes[i].pedidob_id!=null) {
            hayPedidos = true
            break
          }
        }
        if (hayPedidos) {
          this.msg.msgTitle = 'Imposible Anular este Viaje'
          let m = '<br>Tiene pedidos cargados.<br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'imposible anular'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Anular Viaje'
          this.msg.msgBody = '<br>¿Confirmas Anular este Viaje?'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'anular viaje'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        }
        
      } else if (item.nombre=='Iniciar Viaje') {
        
        this.msg.msgTitle = 'Iniciar Viaje/Recorrido!'
        let m = '<br>Vas a iniciar este viaje.<br>'
        m += 'Todos los Clientes incluidos serán notificados.<br><br>'
        m += '¡Estate atento a las observaciones asignadas a cada Cliente!.<br><br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'iniciar viaje'
        this.msg.msgButtons = ['Aceptar','Cancelar']

      } else if (item.nombre=='Finalizar Viaje') {

        // hev021201
        debugger
        let hayPedidos = false
        for (let i=0; i<=this.itemActual.clientes.length-1; i++) {
          if (this.itemActual.clientes[i].pedido_id!=null||this.itemActual.clientes[i].pedidob_id!=null) {
            hayPedidos = true
            break
          }
        }
        if (!hayPedidos) {
          this.msg.msgTitle = 'Imposible Finalizar este Viaje'
          let m = '<br>No tiene pedidos cargados.<br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'imposible finalizar'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Finalizar Viaje'
          let m = '<br>¡Vas a finalizar este Viaje!.<br><br>'
          m += 'Todos los Pedidos aún no enviados serán transferidos a Administración para su procesamiento.<br><br>'
          m += '<b>¡Importante!</b><br>Una vez finalizado el viaje no vas a poder agregar o modificar pedidos.<br>'
          m += 'No obstante, si Clientes de esta zona realizan nuevos pedidos y no hay un Viaje abierto, sus pedidos serán transferidos '
          m += 'a Administración a la espera de la apertura de un nuevo Viaje.<br><br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'finalizar viaje'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        }

      } else if (item.nombre=='Finalizar Reparto') {
        
        this.itemActual = this.itemActual

        debugger
        this.listarViajeHTTP(this.itemActual,false).then( data => {

          /* huguito */
          debugger
          let fac = 0
          let des = 0
          for (let i=0; i<=this.clientes.length-1; i++) {
            if (this.clientes[i].fac.length) {
              fac ++
            }
            if (this.clientes[i].descargado) {
              des ++
            }
          }
  
          this.msg.msgTitle = 'Finalizar Reparto'
          let m = '<br>¡Vas a finalizar este Reparto!.<br><br>'
          m += 'Clientes:\xa0<b>'+fac+'</b>\xa0\xa0Pedidos Descargados:\xa0<b>'+des+'</b><br>'
          
//          if (saldo==0) {
//            m += '<br><b>¡TODO COBRADO!</b><br><br>'
//          } else if (saldo<0) {
//            m += '<br><b>¡HAS COBRADO DE MAS POR $'+this.kit.redondear(Math.abs(this.totalRecibos),2,2)+'!</b><br><br>'
//          } else {
//            m += '<br>Cobranza Faltante:\xa0<b>$'+this.kit.redondear(this.totalRecibos,2,2)+'</b><br><br>'
//          }
          m += 'Recuerda haber revisado los valores y/o comprobantes físicos recibidos '
          m += 'con lo ingresado en los maletines, ya que deberás rendirlos en Administación.<br><br>'
          m += '<b>¡Importante!</b> Una vez finalizado el reparto ya no podrás realizar modificaciones sobre él.<br>'
//        m += 'Si te han pagado de más o de menos, los saldos de dichos clientes quedarán deudores o acreedores '
//        m += 'según corresponda.<br><br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'finalizar reparto'
          this.msg.msgButtons = ['Aceptar','Cancelar']

        })

      } else if (item.nombre=='Iniciar Reparto') {
        this.viajeIniciarReparto(this.itemActual)
      } else if (item.nombre=='Revisar si hay Clientes Nuevos') {
        this.revisarSiHayClientesNuevos()
      } else if (item.nombre=='Ver Mapa del Reparto') {
        this.mostrarMapaDelReparto()
      }
    },

    revisarSiHayClientesNuevos() {
      this.listarViajeHTTP(null, false)
      this.nuevos = []
      return HTTP().post('clientesdelazona',{zona_id:this.itemActual.zona_id}).then(({data})=>{
        for (let i=0; i<=data.length-1; i++) {
          //hev021201
          let pos = this.clientes.findIndex(x=>x.cliente_id==data[i].usertercero.tercero_id)
          if (pos==-1) {
            this.nuevos.push({
              id: data[i].usertercero.tercero_id,
              nombre: data[i].usertercero.tercero.nombre
            })
          }
        }
        if (this.nuevos.length>0) {
          this.dialogClientesNuevos = true
        } else {
          this.msg.msgTitle = 'Clientes Nuevos'
          this.msg.msgBody = '<br>¡No hay Clientes nuevos para esta Zona!<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'error'
          this.msg.msgButtons = ['Aceptar']
        }
      })
    },

    agregarClientesNuevosAlRecorridoHTTP() {
      return HTTP().post('/agregarclientesalrecorrido', { clientes: this.nuevosSeleccionados, viaje_id: this.itemActual.id}).then(({data})=>{
        this.listarViajeHTTP()
        this.dialogClientesNuevos = false
        this.nuevos = []
        this.nuevosSeleccionados = []
      })
    },

    refrescarViaje() {
      this.listarViajeHTTP()
      this.mensaje('¡Viaje refrescado!', this.temas.forms_titulo_bg, 1500)
    },

    articulosDelPedido(item) {
      this.itemActualCliente = item
      this.itemsRepartoPedidoUnds = []
      if (item.pedido!=null) {
        for (let j=0; j<=item.pedido.length-1; j++) {
          let pos = this.itemsRepartoPedidoUnds.findIndex(x=>x.codigo==item.pedido[j].codigo)
          if (pos==-1) {
            this.itemsRepartoPedidoUnds.push({
              id: item.pedido[j].articulo_id,
              codigo: item.pedido[j].codigo,
              nombre: item.pedido[j].nombre,
              cantidad: item.pedido[j].cantidad,
              bultos: item.pedido.bultos||0,
              peso: item.pedido[j].peso,
              kgs: this.roundTo(item.pedido[j].peso*item.pedido[j].cantidad,2),
            })
          } else {
            this.itemsRepartoPedidoUnds[pos].cantidad += item.pedido[j].cantidad
            this.itemsRepartoPedidoUnds[pos].bultos += item.pedido.bultos||0
            this.itemsRepartoPedidoUnds[pos].kgs += this.roundTo(item.pedido[j].peso*item.pedido[j].cantidad,2)
          }
        }
      }
      if (item.pedidob!=null) {
        for (let j=0; j<=item.pedidob.length-1; j++) {
          let pos = this.itemsRepartoPedidoUnds.findIndex(x=>x.codigo==item.pedidob[j].codigo)
          if (pos==-1) {
            this.itemsRepartoPedidoUnds.push({
              id: item.pedidob[j].articulo_id,
              codigo: item.pedidob[j].codigo,
              nombre: item.pedidob[j].nombre,
              cantidad: item.pedidob[j].cantidad,
              bultos: item.pedidob.bultos||0,
              peso: item.pedidob[j].peso,
              kgs: this.roundTo(item.pedidob[j].peso*item.pedidob[j].cantidad,2),
            })
          } else {
            this.itemsRepartoPedidoUnds[pos].cantidad += item.pedidob[j].cantidad
            this.itemsRepartoPedidoUnds[pos].bultos += item.pedidob.bultos||0
            this.itemsRepartoPedidoUnds[pos].kgs += this.roundTo(item.pedidob[j].articulo.peso*item.pedidob[j].cantidad,2)
          }
        }
      }
      this.dialogRepartoPedidoArticulos = true
    },

    msgRespuesta(op) {
      this.msg.msgVisible = false
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='anular viaje') {
         this.anularViajeHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='finalizar viaje') {
          this.finalizarViajeHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='finalizar reparto') {
          this.finalizarRepartoHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='tomar control del pedido') {
          this.tomarControlDelPedidoHTTP()
        } else if (this.msg.msgAccion=='iniciar viaje') {
            return HTTP().post('iniciarviaje', { tipo: 'I', viaje_id: this.itemActual.id }).then(({data})=>{
              if (data=='ok') {
                this.mensaje('¡Viaje/Recorrido iniciado correctamente!', this.temas.forms_titulo_bg, 1500)
              } else {
                this.mensaje('¡Opps, hubo en error en el inicio del Viaje/Recorrido!', this.temas.snack_error_bg, 2500)
              }
              this.listarHTTP()
            })
//        } else if (this.msg.msgAccion=='iniciar reparto') {
//          this.viajeIniciarRepartoHTTP()
        } else if (this.msg.msgAccion=='finalizar y enviar pedido a administracion') {
          this.finalizarYEnviarPedidoAAdministracionHTTP()
        }
      }
      this.msg.msgVisible = false;
    },

    observacion(item) {
      this.observ = item.observ
      this.dialogObservacion = true
      this.itemActualCliente = item
    },

    verPedidosAnteriores(item) {
      this.itemActualCliente = item
      this.dialogPedidosAnteriores = false
      return HTTP().post('/verpedidosanteriores', { tercero_id: item.cliente_id }).then(({data})=>{
        if (data=='error') {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = '<br>¡Se ha producido un error!.<br><br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'error'
          this.msg.msgButtons = ['Aceptar']
        } else if (data.length==0) {
          this.msg.msgTitle = 'Sin Pedidos Anteriores'
          this.msg.msgBody = '<br>¡Este Cliente no posee pedidos anteriores!.<br><br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'sin pedidos anteriores'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.pedidosAnteriores = []
          for (let i=0; i<=data.length-1; i++) {
            this.pedidosAnteriores.push({
              viaje_id: data[i].viaje_id,
              cpr: data[i].cpr,
              fecha: data[i].fecha,
              codigooid: this.codigooid=='C'?data[i].codigo:data[i].articulo_id,
              nombre: data[i].nombre,
              cantidad: data[i].cantidad,
            })
          }
          this.dialogPedidosAnteriores = true
        }
      })
    },

    finalizarYEnviarAAdministracion(item) {
      this.itemActualCliente = item
      this.msg.msgTitle = 'Enviar Pedido a Administración'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      let m = 'Vas a finalizar y enviar a Administración el pedido<br> <b>'+this.itemActualCliente.cpr+'</b> '
      m += 'correspondiente a <b><br>'+this.itemActualCliente.tercero.nombre+'</b><br><br>'
      m += '<b>Atención:</b> No podrás realizar más modificaciones sobre él.'
      m += '<br><br>¿Confirmas?'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'finalizar y enviar pedido a administracion'
    },

    viajeIniciarReparto(item) {
      this.dialogIniciarReparto = true
      /*
      this.msg.msgTitle = 'Iniciar Reparto'
      let m = 'Vas a iniciar el Reparto para la zona<br>'
      m += '<b>'+item.zona+'</b><br><br>'
      m += '¡Todos los Clientes van a ser notificados!.'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'iniciar reparto'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      */
    },

    viajeIniciarRepartoHTTP() {
      debugger // hev021
      return HTTP().post('iniciarviaje', {
        tipo: 'R', viaje_id: this.itemActual.id, crearNuevoMaletin: this.crearNuevoMaletin, operario: this.operarioUserId}).then(({data})=>{
        if (data=='ok') {
          this.mensaje('¡El viaje a Iniciado su Reparto!', this.temas.forms_titulo_bg, 2500)
        } else {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 1500)
        }
        this.dialogIniciarReparto = false
        this.listarHTTP(false)
      });
    },

    finalizarYEnviarPedidoAAdministracionHTTP() {
      let novedad = {
        cpr_id: this.itemActualCliente.pedido_id,
        novedad: 'Envio del Pedido',
        rel_id: null,
        estado: 'N'
      }
      return HTTP().patch('/enviarpedido', {
        id: this.itemActualCliente.pedido_id,
        novedad: novedad,
        vendedor: true,
        recorrido:this.itemActualCliente.id }).then(({ data })=>{
        if (data = 'ok') {
          this.mensaje('¡Pedido enviado correctamente!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Ha ocurrido un problema con el envío del pedido!', this.temas.forms_titulo_bg, 1500)
        }
        this.listarViajeHTTP();
      })
    },

    tomarControlDelPedido(item) {
      //this.itemActual = item
      debugger
      this.itemActualCliente = item
      this.msg.msgTitle = 'Tomar Control de este Pedido'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      let m = 'Vas a tomar el control de este Pedido.<br>'
      m += 'Esto te va a permitir administrar sus artículos.<br><br>¿Confirmas?'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'tomar control del pedido'
    },

    cambiarOrdenDeVisita(accion, item) {
      this.itemActual = item
      return HTTP().post('/cambiarordendevisita', { accion:accion, item:this.itemActual}).then(({data})=>{
        this.listarViajeHTTP()
      })
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
      let perfiscal = ''
      let p = this.losMeses.indexOf(this.elMes)
      p ++
      p = p.toString().padStart(2,'0').substring(-2)
      perfiscal = this.anio+p
      if (this.elMes==undefined || this.elMes=='') return
      let periodo = ''
      let m = this.queMesEs(this.elMes)
      periodo = this.anio+'-'+m

      debugger
      return HTTP().post('/viajes',{ perfiscal: periodo, area: this.operarioArea, tercero_id: this.operarioTerceroId }).then(({data})=>{

        debugger
        let dirs = []  // direcciones
        this.items = [] // los viajes
        for (let i=0; i<=data.length-1; i++) {

          for (let j=0; j<=data[i].recorrido.length-1; j++) {
            let dir = ''
            if (data[i].recorrido[j].cliente!=null) {
              if (data[i].recorrido[j].cliente.direcciones.length>0) {
                for (let k=0; k<=data[i].recorrido[j].cliente.direcciones.length-1; k++) {
                  if (data[i].recorrido[j].cliente.direcciones[k].postal!=null) {
                    if (data[i].recorrido[j].cliente.direcciones[k].postal.provincia!=null) {
                      if (data[i].recorrido[j].cliente.direcciones[k].postal.provincia.pais!=null) {
                        dir = data[i].recorrido[j].cliente.direcciones[k].direccion
                        dir += ' '
                        dir += data[i].recorrido[j].cliente.direcciones[k].postal.nombre
                        dir += ' '
                        dir += data[i].recorrido[j].cliente.direcciones[k].postal.provincia.nombre
                        dir += ' '
                        dir += data[i].recorrido[j].cliente.direcciones[k].postal.provincia.pais.nombre
                        dirs.push(dir)
                      }
                    }
                  }
                }
              }
            }
          }

          this.items.push({
            id: data[i].id,
            fecha: moment(data[i].fecha).format('YYYY-MM-DD'),
            zona: data[i].zona.nombre,
            zona_id: data[i].zona.id,
            viaticos: data[i].viaticos,
            vendido: 0,
            estado: data[i].estado,
            todocobrado: data[i].todocobrado,
            clientes: data[i].recorrido,
            pedidos: 0,
            direcciones: dirs,
          })

        }
      }).catch(function (error) {
        console.log(error);
      })
    },

    async listarViajeHTTP (item, say) {

      debugger
      say = say==undefined?true:say
      if (item) { this.itemActual = item } else { item = this.itemActual }
      if (((this.operarioArea=='A'||this.operarioArea=='X'||this.operarioArea=='R')&&(item.estado=='R'||item.estado=='F'||item.estado=='L'||item.estado=='K'))||
        ((this.operarioArea=='A'||this.operarioArea=='X'||this.operarioArea=='V')&&(item.estado=='P'||item.estado=='D'||item.estado=='I'||item.estado=='F'||item.estado=='K'))||
        this.operarioArea==null) {

        return HTTP().post('/viaje',{ id:item.id, estado:item.estado }).then(({data})=>{

          debugger
          data.res.recorrido.sort(function(a, b) {
            if (a.orden > b.orden) {
              return 1
            } else if (a.orden < b.orden ) {
              return -1
            } else {
              return 0
            }
          })
          for (let j=0; j<=data.res.recorrido.length-1; j++) {
            data.res.recorrido[j].orden = j+1
          }
          //let vendido = 0
          this.clientes = []
          this.totalPedidos = 0;
          this.totalDebitos = 0;
          this.totalCreditos = 0;
          this.totalRecibos = 0;
          this.cantidadPedidos = 0;
          this.viaje_id = data.res.id;
          this.zonaNombre = data.res.zona.nombre;
          this.estadoDelViaje = data.res.estado;
          
          for (let j=0; j<=data.res.recorrido.length-1; j++) {
            
            let sayEstado = ''
            if (data.res.recorrido[j].estado=='E') {
              sayEstado = 'Enviado a Administración'
            } else {
              sayEstado = data.res.recorrido[j].cliente.user?'Agregar Artículos':'Se requiere registro'
            }
            let bultos = data.res.recorrido[j].pedido!=null?data.res.recorrido[j].pedido.bultos||0:0

            let fac = 0
            let ndd = 0
            let ndc = 0
            let rec = 0
            let pos = 0
            let salAntA = 0
            let salAntB = 0
            pos = data.salant.findIndex(x=>x.tercero_id==data.res.recorrido[j].cliente_id&&x.sucursaldemo==0)
            salAntA = pos!=-1?data.salant[pos].saldo:0
            pos = data.salant.findIndex(x=>x.tercero_id==data.res.recorrido[j].cliente_id&&x.sucursaldemo==1)
            salAntB = pos!=-1?data.salant[pos].saldo:0
            // SALDOS DE LA CUENTA, LA CONSULTA TRAE EL SALDO TOTAL, INCLUIDAS LAS FAC,NDD Y NDC DE ESTE VIAJE
            // SI ES QUE EXISTEN, DEBO CALCULAR EL SALDO ANTERIOR REAL
            if (salAntA!=0) {
              if (data.res.recorrido[j].pedido!=null) {
                if (data.res.recorrido[j].pedido.vinculoPadre.length>0) {
                  if (data.res.recorrido[j].pedido.vinculoPadre[0].hijo) {
                    fac = data.res.recorrido[j].pedido.vinculoPadre[0].hijo.total
                    if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos.length>0) {
                      for (let k=0; k<=data.res.recorrido[j].pedido.vinculoPadre[0].hijos.length-1; k++) {
                        if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.cpr.substring(0,3)=='REC') {
                          rec = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.total
                        } else if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.cpr.substring(0,3)=='NDD') {
                          ndd = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.total
                        } else if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.cpr.substring(0,3)=='NDC') {
                          ndc = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.total
                        }
                      }
                    }
                  }
                }
              }
              if (fac>=rec) {
                salAntA -= (fac+(rec*-1)+ndd+ndc) 
              }
            }

            if (salAntB!=0) {
              fac = 0; ndd = 0; ndc = 0; rec = 0;
              if (data.res.recorrido[j].pedidob!=null) {
                if (data.res.recorrido[j].pedidob.vinculoPadre.length>0) {
                  if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijo) {
                    fac = data.res.recorrido[j].pedidob.vinculoPadre[0].hijo.total
                    if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos.length>0) {
                      for (let k=0; k<=data.res.recorrido[j].pedidob.vinculoPadre[0].hijos.length-1; k++) {
                        if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.cpr.substring(0,3)=='REC') {
                          rec = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.total
                        } else if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.cpr.substring(0,3)=='NDD') {
                          ndd = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.total
                        } else if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.cpr.substring(0,3)=='NDC') {
                          ndc = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.total
                        }
                      }
                    }
                  }
                }
              }
              if (fac>=rec) {
                salAntB -= this.roundTo((fac+(rec*-1)+ndd+ndc),2)
              }
            }

            this.clientes.push({
              id: data.res.recorrido[j].id,
              cliente_id: data.res.recorrido[j].cliente_id,
              nombre: data.res.recorrido[j].cliente.nombre,
              cpr: data.res.recorrido[j].pedido!=null?data.res.recorrido[j].pedido.cpr:'Sin Pedido',
              fecha: data.res.recorrido[j].fecha,
              total: data.res.recorrido[j].pedido!=null?data.res.recorrido[j].pedido.total:0,
              salAntA: salAntA,
              salAntB: salAntB,
              observ: data.res.recorrido[j].observ,
              estado: data.res.recorrido[j].estado,
              orden: data.res.recorrido[j].orden,
              descargado: data.res.recorrido[j].descargado,
//            orden: data.res.recorrido[j].cliente.usersterceros[0].orden==null?j:data.res.recorrido[j].orden,
              externo: data.res.recorrido[j].cliente.usersterceros[0].user.externo,
              user_id: data.res.recorrido[j].cliente.usersterceros[0].user.id,
              viaje_id: data.id,
              recorrido_id: data.res.recorrido[j].id,
              comprobante_id: data.res.recorrido[j].comprobante_id,
              pedido_id: data.res.recorrido[j].pedido_id,
              quienpidio: data.res.recorrido[j].pedido?data.res.recorrido[j].pedido.quienpidio:'V',
              pedido: [],
              ped: [],
              fac: [],
              nddndc: [],
              ndc: [],
              rem: [],
              rec: [],
              pedidoParticionado: data.res.recorrido[j].pedidob!=null?true:false,
              tercero: data.res.recorrido[j].cliente,
              tooltip: sayEstado,
              artped: 0,
              bultos: bultos,
              usaelsistema: data.res.recorrido[j].cliente.user?data.res.recorrido[j].cliente.user.usaelsistema:false
            })

            if (data.res.recorrido[j].pedido!=null) {
              this.totalPedidos += data.res.recorrido[j].pedido.total
              this.clientes[j].artped = data.res.recorrido[j].pedido.items.length
              this.cantidadPedidos ++
              if (this.clientes[j].quienpidio=='C') {
                if (this.pedTransfAVend) {
                  this.clientes[j].tooltip='Tomar el Control'
                } else {
                  this.clientes[j].tooltip='No se pueden agregar Artículos'
                }
              }
              let cpr = data.res.recorrido[j].pedido.cpr
              let importe = data.res.recorrido[j].pedido.total
              this.clientes[j].ped.push({cpr: this.kit.cpr(cpr), importe: importe})

              if (data.res.recorrido[j].pedido.vinculoPadre.length>0) {

                if (data.res.recorrido[j].pedido.vinculoPadre[0].hijo) {
                  let cpr = data.res.recorrido[j].pedido.vinculoPadre[0].hijo.cpr
                  let demo = data.res.recorrido[j].pedido.vinculoPadre[0].hijo.sucursal.sucursaldemo
                  let importe = this.roundTo(data.res.recorrido[j].pedido.vinculoPadre[0].hijo.total,2)
                  this.clientes[j].fac.push({cpr: this.kit.cpr(cpr),demo: demo,importe: importe})
                  this.totalDebitos += importe
                }

                if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos.length>0) {

                  for (let k=0; k<=data.res.recorrido[j].pedido.vinculoPadre[0].hijos.length-1; k++) {

                    let cpr = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.cpr
                    let tcpr = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.cpr.substring(0,3)
                    let demo = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.sucursal.sucursaldemo
                    let importe = this.roundTo(data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.total,2)
                    let estado = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.estado

                    if (tcpr=='REC'&&estado!='A') {

                      // a
                      this.clientes[j].rec.push({cpr: this.kit.cpr(cpr), demo: demo, importe: importe, valores: [], hayMaletin: false })
                      let observ = ''
                      if (data.res.recorrido[j].cliente.user!=null) {

                        // usa el sistema, tengo que recorrer los valores del recibo y cargarlos en .rec.valores
                        this.totalRecibos += importe
                        let pos = this.clientes[j].rec.length-1 // posicion del rec, 0 o 1
                        for (let l=0; l<=data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos.length-1; l++) {

                          observ = ''
                          let idValor = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].id
                          let medioNombre = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio.abrev
                          let importeValor = this.roundTo(data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].importe,2)
                          let cheqValor = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].chequeado
                          let hayMaletin = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].maletinitem_id

                          if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 1) {          // efectivo
                            observ = 'Efectivo'
                          } else if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 2 ||
                                      data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 3) {   // tarjetas
                            observ = 'Cupón Nro'+data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].nrovalor
                          } else if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 5) {   // transferencia
                            observ = 'Transferencia'
                          } else if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 6) {   // cheque
                            observ = data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].banco.nombre+' - '
                            observ += 'Nro '+data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].nrovalor+' - '
                            observ += 'Fecha '+moment(data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].fechafinanciera).format('DD/MM/YYYY')
                          } else if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 7) {   // Mercado Pago
                            observ = 'Mercado Pago'
                          } else if (data.res.recorrido[j].pedido.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 8) {   // Todo Pago
                            observ = 'Todo Pago'
                          }
                          this.clientes[j].rec[0].hayMaletin = hayMaletin

                          this.clientes[j].rec[0].valores.push({
                            id: idValor,
                            medioNombre: medioNombre,
                            observ: observ,
                            importe: importeValor,
                            chequeado: cheqValor,
                          })

                        }

                      } else {

                        this.totalRecibos += importe

                      }

                    } else if (tcpr=='NDD'||tcpr=='NDC') {

                      this.clientes[j].nddndc.push({ cpr: this.kit.cpr(cpr), demo: demo, importe: importe })
                      if (tcpr=='NDD') {
                        this.totalDebitos += importe
                      } else {
                        this.totalCreditos += importe
                      }

                    } else if (tcpr=='REM') {
                      this.clientes[j].rem.push({ cpr: this.kit.cpr(cpr), demo: demo, importe: importe })
                    }
                  }
                }
              }

              for (let k=0; k<=data.res.recorrido[j].pedido.items.length-1; k++) {
                this.clientes[j].pedido.push({
                  id:               data.res.recorrido[j].pedido.items[k].id,
                  articulo_id:      data.res.recorrido[j].pedido.items[k].articulo_id,
                  codigo:           data.res.recorrido[j].pedido.items[k].articulo.codigo,
                  codbar:           data.res.recorrido[j].pedido.items[k].articulo.precios[0].codbar,
                  nombre:           data.res.recorrido[j].pedido.items[k].articulo.nombre,
                  deposito_id:      data.res.recorrido[j].pedido.items[k].deposito_id,
                  unidad_id:        data.res.recorrido[j].pedido.items[k].articulo.unidad_id,
                  moneda_id:        data.res.recorrido[j].pedido.items[k].articulo.moneda_id,
                  iva_id:           data.res.recorrido[j].pedido.items[k].articulo.iva_id,
                  cantidad:         data.res.recorrido[j].pedido.items[k].cantidad,
                  cantidadoriginal: data.res.recorrido[j].pedido.items[k].cantidad,
                  stock:            data.res.recorrido[j].pedido.items[k].stock,
                  undstock:         data.res.recorrido[j].pedido.items[k].articulo.undstock,
                  sinstock:         data.res.recorrido[j].pedido.items[k].articulo.precios[0].sinstock,
                  costo:            data.res.recorrido[j].pedido.items[k].costo,
                  precio:           data.res.recorrido[j].pedido.items[k].precio,
                  preciooriginal:   data.res.recorrido[j].pedido.items[k].precio,
                  tasadescuento:    data.res.recorrido[j].pedido.items[k].tasadescuento,
                  importedescuento: data.res.recorrido[j].pedido.items[k].importedescuento,
                  tasaproprecargo:  0, 
                  total:            data.res.recorrido[j].pedido.items[k].total,
                  texto:            data.res.recorrido[j].pedido.items[k].texto,
                  vencimiento:      data.res.recorrido[j].pedido.items[k].vencimiento,
                  adevolver:        0,
                  padre_id:         null,
                  undenvase:        data.res.recorrido[j].pedido.items[k].articulo.undenvase,
                  escombo:          data.res.recorrido[j].pedido.items[k].articulo.escombo,
                  ofeprecio:        0,
                  ofetasadescuento: 0,
                  ofeenvio:         0,
                  ofeunidades:      0,
                  ofeestado:        '',
                  turno_id:         null,
                  decimales:        data.res.recorrido[j].pedido.items[k].articulo.precios[0].decimales,
                  preciomediocobro: false,
                  peso:             data.res.recorrido[j].pedido.items[k].articulo.peso,
                })
              }
              
              if (data.res.recorrido[j].pedidob!=null) {

                this.totalPedidos += data.res.recorrido[j].pedidob.total

                let cpr = data.res.recorrido[j].pedidob.cpr
                let importe = this.roundTo(data.res.recorrido[j].pedidob.total,2)
                this.clientes[j].ped.push({cpr: this.kit.cpr(cpr), importe: importe})

                for (let k=0; k<=data.res.recorrido[j].pedidob.items.length-1; k++) {
                  let pos = this.clientes[j].pedido.findIndex(x=>x.articulo_id==data.res.recorrido[j].pedidob.items[k].articulo_id)
                  if (pos==-1) {
                    this.clientes[j].pedido.push({
                      id: data.res.recorrido[j].pedidob.items[k].id,
                      articulo_id: data.res.recorrido[j].pedidob.items[k].articulo_id,
                      codigo: data.res.recorrido[j].pedidob.items[k].articulo.codigo,
                      nombre: data.res.recorrido[j].pedidob.items[k].articulo.nombre,
                      cantidad: data.res.recorrido[j].pedidob.items[k].cantidad,
                      peso: data.res.recorrido[j].pedidob.items[k].articulo.peso,
                      bultos: data.res.recorrido[j].pedidob.bultos,
                    })
                  } else {
                    this.clientes[j].pedido[pos].cantidad += data.res.recorrido[j].pedidob.items[k].cantidad
                    this.clientes[j].pedido[pos].bultos += data.res.recorrido[j].pedidob.items[k].bultos
                  }
                }

                if (data.res.recorrido[j].pedidob.vinculoPadre.length>0) {

                  if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijo) {
                    let cpr = data.res.recorrido[j].pedidob.vinculoPadre[0].hijo.cpr
                    let demo = data.res.recorrido[j].pedidob.vinculoPadre[0].hijo.sucursal.sucursaldemo
                    let importe = this.roundTo(data.res.recorrido[j].pedidob.vinculoPadre[0].hijo.total,2)
                    this.clientes[j].fac.push({cpr: this.kit.cpr(cpr),demo: demo,importe: importe})
                    this.totalDebitos += importe
                  }

                  if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos.length>0) {
                    
                    for (let k=0; k<=data.res.recorrido[j].pedidob.vinculoPadre[0].hijos.length-1; k++) {

                      let cpr = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.cpr
                      let tcpr = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.cpr.substring(0,3)
                      let demo = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.sucursal.sucursaldemo
                      let importe = this.roundTo(data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.total,2)
                      let estado = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.estado

                      if (tcpr=='REC'&&estado!='A') {
                        // b

                        this.clientes[j].rec.push({cpr: this.kit.cpr(cpr), demo: demo, importe: importe, valores: [], hayMaletin: false })
                        let observ = ''
                        if (data.res.recorrido[j].cliente.user!=null) {
                        
                          // usa el sistema, tengo que recorrer los valores del recibo y cargarlos en .rec.valores
                          this.totalRecibos += importe
                          let pos = this.clientes[j].rec.length-1 // posicion del rec, 0 o 1
                          for (let l=0; l<=data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos.length-1; l++) {

                            observ = ''
                            let idValor = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].id
                            let medioNombre = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio.abrev
                            let importeValor = this.roundTo(data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].importe,2)
                            let cheqValor = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].chequeado
                            let hayMaletin = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].maletinitem_id

                            if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 1) {          // efectivo
                              observ = 'Efectivo'
                            } else if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 2 ||
                                        data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 3) {   // tarjetas
                              observ = 'Cupón Nro'+data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].nrovalor
                            } else if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 5) {   // transferencia
                              observ = 'Transferencia'
                            } else if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 6) {   // cheque
                              observ = data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].banco.nombre+' - '
                              observ += 'Nro '+data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].nrovalor+' - '
                              observ += 'Fecha '+moment(data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].fechafinanciera).format('DD/MM/YYYY')
                            } else if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 7) {   // Mercado Pago
                              observ = 'Mercado Pago'
                            } else if (data.res.recorrido[j].pedidob.vinculoPadre[0].hijos[k].hijo.valoresIngresos[l].medio_id == 8) {   // Todo Pago
                              observ = 'Todo Pago'
                            }

                            debugger
                            this.clientes[j].rec[pos].hayMaletin = hayMaletin

                            this.clientes[j].rec[pos].valores.push({
                              id: idValor,
                              medioNombre: medioNombre,
                              observ: observ,
                              importe: importeValor,
                              chequeado: cheqValor,
                            })

                          }

                        } else {

                          this.totalRecibos += importe

                        }

                      } else if (tcpr=='NDD'||tcpr=='NDC') {

                        this.clientes[j].nddndc.push({ cpr: this.kit.cpr(cpr), demo: demo, importe: importe })
                        if (tcpr=='NDD') {
                          this.totalDebitos += importe
                        } else {
                          this.totalCreditos += importe
                        }

                      } else if (tcpr=='REM') {
                        this.clientes[j].rem.push({ cpr: this.kit.cpr(cpr), demo: demo, importe: importe })
                      }
                    }
                  }
                }
              }
            }
          }
          if (say) {
            this.dialogAdministracionPedidos = true
          }
        })
      }
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
        //alert('en leoAnios paso el http')
        this.anios = []
        this.meses = []
        this.periodos = []
        let pos = -1
        // UN CASO ESPECIAL: SI ES VENDEDOR PUEDE ESTAR HACIENDO PEDIDOS POR CUENTA DE SUS CLIENTES
        // PERO SI CAMBIO EL MES Y EL CLIENTE NO HIZO MOVIMIENTOS AUN, NO TENDRA ACTUALIZADO EL PERIDODO
        // POR LO TANTO LO TENGO QUE AGREGAR A MANO.
        if (this.operarioEsVendedor) {
          // PRIMERO CALCULO EL AÑO Y MES ACUAL
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

    guardarArticulosHTTP() {
      let prov = this.$store.state.proveedor.id==0?this.userId:this.$store.state.proveedor.id
      debugger

      debugger
      if (this.itemActualCliente.pedido_id==null) {

        return HTTP().post('/generarpedido', {
          proveedor: prov,
          sucursales: this.$store.state.sucursales,
          sucursal: this.$store.state.sucursal,
          cart: this.articulos,
          vendedor: this.operarioEsVendedor,
          operarioTerceroId: this.operarioTerceroId,
          viaje_id: this.itemActual.id,
          recorrido_id: this.itemActualCliente.id,
          cliente_id: this.itemActualCliente.tercero.id}).then(({data})=>{

          debugger

          this.dialogArticulos = false
          this.listarViajeHTTP()
          if (data!='error') {
            this.mensaje('¡Pedio generado correctamente!', this.temas.forms_titulo_bg, 1500)
          } else {
            this.msg.msgTitle = 'Error en el Pedido'
            this.msg.msgBody = 'El Pedido no se ha podido generar<br>Reintente, si el problema persiste consulte con sistemas<br>'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'pedido error'
            this.msg.msgButtons = ['Aceptar']
          }
        })
      } else {

        debugger
        return HTTP().patch('/updateitems/'+this.itemActualCliente.pedido_id, { articulos: this.articulos }).then(({data})=>{

          debugger
          if (data==true) {
            this.mensaje('¡Pedio actualizado!', this.temas.forms_titulo_bg, 1500)
          } else {
            this.mensaje('¡Opps, hubo en error en la modificación del pedido!', this.temas.snack_error_bg, 2500)
          }
          this.dialogArticulos = false
          
          this.listarViajeHTTP()
        })
      }
    },

    buscarArt(estricto) {

      this.precioOrigen = 'Lista'
      this.precioDescuento = 0
      if (this.busArt == '') return
      estricto = this.busArt.indexOf('@')!=-1 ? true : false

//      let v = []
//      for (let i=0; i<=this.$store.state.vinculosPadres.length-1; i++) {
//        v.push(this.$store.state.vinculosPadres[i])  
//      }
//      v.push(this.userId)
//      let proveedor = this.userId
//      let vpa = [66, 2, 48, 49, 50, 51, 204 ]
//      let vpl = [ { user_id: 2, tipo: 'CO', vinculo_id: 1758, porrev: 30} ]
//      v = [ 2 ]

      /*
      for (let i=0; i<=this.$store.state.vinculosPadresAll.length-1; i++) {
        if (i==0) {
          vpa.push(2)
        } else {
          vpa.push(this.$store.state.vinculosPadresAll[i])
        }
      }
      */
     //let elUserDelCliente = this.itemActualCliente.tercero.user.id;
     let elUserActual = this.$store.state.operarioUserId;
     let vinPadAll = JSON.parse(JSON.stringify(this.$store.state.vinculosPadresAll));
     let pos = vinPadAll.findIndex(x=>x==elUserActual)
     vinPadAll.splice(pos,1);
     vinPadAll.unshift(this.itemActualCliente.tercero.user.id);
     //vinPadAll = [24,2,4,7,46,201,202,205,48,49,50,51,204,210]
     
     let des = []
     for (let i=0; i<=this.descuentos.length-1; i++) {
       des.push(this.descuentos[i])
      }
      if (this.descuentosCli.length>0) {
        des.push(this.descuentosCli[0])
      }
      
      debugger
      /*
      des = []
      des.push(
        {articulos:[], desc1:21, desc2: 0, grupos:[], id: 921, marcas:[], tercero_id:38, user_ha:17, user_id:4},
        {articulos:[], desc1:21, desc2: 0, grupos:[], id: 922, marcas:[], tercero_id:64, user_ha:25, user_id:4},
        {articulos:[], desc1:15, desc2: 0, grupos:[], id: 312, marcas:[], tercero_id: 4, user_ha: 3, user_id:4},
        {articulos:[], desc1:15, desc2: 0, grupos:[], id: 918, marcas:[], tercero_id:63, user_ha:24, user_id:4},
        {articulos:[], desc1:25, desc2: 0, grupos:[], id: 317, marcas:[], tercero_id: 3, user_ha: 2, user_id:49},
        {articulos:[], desc1:27, desc2: 0, grupos:[], id: 313, marcas:[], tercero_id: 4, user_ha: 3, user_id:2},
        {articulos:[], desc1:27, desc2: 0, grupos:[], id: 350, marcas:[], tercero_id: 63, user_ha: 24, user_id:2},
        {articulos:[], desc1:27, desc2: 0, grupos:[], id: 425, marcas:[], tercero_id: 136, user_ha: 67, user_id:2},
        {articulos:[], desc1:27, desc2: 0, grupos:[], id: 237, marcas:[], tercero_id: 237, user_ha: 136, user_id:2},
        {articulos:[], desc1:16, desc2: 3, grupos:[], id: 319, marcas:[], tercero_id: 3, user_ha: 2, user_id:48},
        {articulos:[], desc1:21, desc2: 0, grupos:[], id: 915, marcas:[], tercero_id: 3, user_ha: 2, user_id:204},
        {articulos:[], desc1:15, desc2: 0, grupos:[], id: 337, marcas:[], tercero_id: 3, user_ha: 2, user_id:51},
      )
      */

      debugger
      return HTTP().post('/articuloz', {
        search: this.busArt,
        vinculosPadresLic: this.vinculosPadresLicDelCliente,
        vinculosPadresAll: vinPadAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: des,
//      proveedor: 2, stockProv: false, grupo: '', marca: '', userex: this.userId, soloArtComprados: false, descuentos: des,
        dolar: this.$store.state.dolar, activos: true, limit: this.cttLoadReg }).then(({ data })=>{

        debugger
        if (data.length===0) {
          this.mensaje('¡Codigo inexistente!', this.temas.forms_titulo_bg, 1000)
          this.$nextTick(() => {
            const f = this.$refs.buscar;
            f.focus();
          });
          return
        }

        // VEO EL TEMA DE PRECIOS, SI .PRECIOS > 1 ES PORQUE ENCONTRO MAS DE UN PRECIO DEL ARTICULO
        // Y EN ESE CASO DEJO SOLO EL PRECIO MAYOR CON EL COSTO PROMEDIO PONDERADO
        let ctt = 0
        let tot = 0
        let cpp = 0
        for (let i=0; i<=data.length-1; i++) {
          if (data[i].precios.length>1) {
            ctt = 0; tot = 0; cpp = 0
            for (let j=0; j<=data[i].precios.length-1; j++) {
              ctt += data[i].precios[j].cantidad
              tot += data[i].precios[j].total
            }
            cpp = this.roundTo(tot/ctt,4)
            // BUSCO EL PRECIO MAYOR
            let precioMayor = data[i].precios.sort((a,b) =>{
              return Number.parseInt(b.precio) - Number.parseInt(a.precio)
            })
            data[i].precios = []
            data[i].precios.push(precioMayor[0])
            data[i].precios[0].costo = cpp
          }
        }

        debugger

        // INICIALIZO VALORES DE DESCUENTOS Y PRIMERA ASIGNACION. LUEGO CONTROLO X CANTIDAD
        let descual = 'Lista'
        this.precioOrigen = 'Lista'
        this.promoDescuento = 0
        
        if (data[0].precios[0].ofeestado=='A'&&data[0].precios[0].ofeunidades>0) {
          this.promoDescuento = data[0].precios[0].ofetasadescuento
        }

        // Veo si tomo el descuento de la promo
        if (this.promoDescuento>0) {
          descual = 'Promocion'
        }

        if (data.length==1) {
          debugger
          let impdes = this.roundTo((data[0].precios[0].precio*this.editadoArt.cantidad)*(this.promoDescuento/100),data[0].precios[0].decimales)
          let pre = this.roundTo(data[0].precios[0].precio, data[0].precios[0].decimales) //data[0].precios[0].precio
          //let pre = data[0].precios[0].costo //data[0].precios[0].precio
          this.articulos = this.articulos.filter( x => x.codigo != data[0].codigo)
          this.editadoArt.codigo      = data[0].codigo;
          this.editadoArt.articulo_id = data[0].id;
          this.editadoArt.nombre      = data[0].nombre;
          this.editadoArt.codbar      = data[0].precios[0].codbar;
          this.editadoArt.unidad_id   = data[0].unidad_id
          this.editadoArt.moneda_id   = data[0].moneda_id
          this.editadoArt.iva_id      = data[0].iva_id

          this.editadoArt.costoanterior    = this.roundTo(data[0].precios[0].precio, data[0].precios[0].decimales),
          this.editadoArt.costo            = this.roundTo(pre, data[0].precios[0].decimales),
          this.editadoArt.precio           = this.roundTo(pre, data[0].precios[0].decimales),
          this.editadoArt.preciooriginal   = this.roundTo(data[0].preciooriginal, data[0].decimales),

          this.editadoArt.decimales        = data[0].precios[0].decimales
          this.editadoArt.tasadescuento    = this.promoDescuento
          this.editadoArt.importedescuento = impdes
          this.editadoArt.total            = this.roundTo((this.editadoArt.precio*this.editadoArt.cantidad)-impdes,data[0].precios[0].decimales)
          this.editadoArt.deposito_id      = this.depItems[0].id
          this.editadoArt.padre_id         = data[0].padre_id
          this.editadoArt.stock            = data[0].stock
          this.editadoArt.undstock         = data[0].undenvasepad?data[0].undenvase/data[0].undenvasepad:data[0].undenvase
          this.editadoArt.sinstock         = data[0].precios[0].sinstock
          this.editadoArt.texto            = descual
          this.editadoArt.ofeprecioori     = 0
          this.editadoArt.ofeprecio        = 0
          this.editadoArt.ofetasadescuento = 0
          this.editadoArt.ofeenvio         = 0
          this.editadoArt.ofeunidades      = 0
          this.editadoArt.ofeestado        = ''
          this.editadoArt.preciomediocobro = data[0].preciomediocobro
          this.editadoArt.escombo          = data[0].escombo
             
          this.$refs.cantidad.focus()
          this.seleccionarArticulo = false
  
          // busco si aplica promocion para el articulo ingresado
          if (descual=='Promocion') {
            this.editadoArt.ofeprecioori     = data[0].precios[0].precio
            this.editadoArt.ofeprecio        = data[0].precios[0].precio
            this.editadoArt.ofetasadescuento = data[0].precios[0].ofetasadescuento
            this.editadoArt.ofeunidades      = data[0].precios[0].ofeunidades
            this.editadoArt.ofeestado        = data[0].precios[0].ofeestado
            this.editadoArt.importedescuento = this.roundTo(data[0].precios[0].precio*(data[0].precios[0].ofetasadescuento/100),data[0].precios[0].decimales)
            this.editadoArt.tasadescuento    = data[0].precios[0].ofetasadescuento
            this.editadoArt.costo            = data[0].precios[0].costo
            this.editadoArt.precio           = this.roundTo(data[0].precios[0].precio,data[0].precios[0].decimales)
            this.editadoArt.total            = data[0].precios[0].total
          }
  
        } else if (data.length>1) {
  
          this.selArt = []
          for (let i=0; i<=data.length-1; i++) {
            this.selArt.push({
              id:                data[i].id,
              codigo:            data[i].codigo,
              articulo_id:       data[i].id,
              nombre:            data[i].nombre,
              codbar:            data[i].precios[0].codbar,
              unidad_id:         data[i].unidad_id,
              moneda_id:         data[i].moneda_id,
              iva_id:            data[i].iva_id,
              costo:             data[i].precios[0].costo,
              precio:            data[i].precios[0].precio,
              tasadesuento:      0,
              importedescuento:  0,
              deposito_id:       this.depItems[0].id,
              stock:             data[i].stock == null ? 0 : data[i].stock,
              undstock:          data[i].undstock,
              sinstock:          data[i].sinstock,
            })
          }
          this.seleccionarArticulo = true;
        }
      })
    },

    buscarArtStock() {
      if (this.busArt == '') return
      let des = []
      for (let i=0; i<=this.descuentos.length-1; i++) {
        des.push(this.descuentos[i])
      }
      if (this.descuentosCli.length>0) {
        des.push(this.descuentosCli[0])
      }

      let elUserActual = this.$store.state.operarioUserId;
      let vinPadAll = JSON.parse(JSON.stringify(this.$store.state.vinculosPadresAll));
      let pos = vinPadAll.findIndex(x=>x==elUserActual)
      vinPadAll.splice(pos,1);
    //vinPadAll.unshift(199);

      debugger
      return HTTP().post('/articuloz', {
        search: this.busArt,
        vinculosPadresLic: this.vinculosPadresLicDelCliente,
        vinculosPadresAll: vinPadAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: this.userId, soloArtComprados: false, descuentos: des,
        dolar: this.$store.state.dolar, activos: true, limit: this.cttLoadReg }).then(({ data })=>{

        debugger
        if (data.length===0) {
          this.mensaje('¡Codigo inexistente!', this.temas.forms_titulo_bg, 1000)
          this.$nextTick(() => {
            const f = this.$refs.busartstk;
            f.focus();
          });
          return
        }
        if (data.length==1) {
          this.articulos = this.articulos.filter( x => x.codigo != data[0].codigo)
          this.editadoArt.codigo      = data[0].codigo;
          this.editadoArt.articulo_id = data[0].id;
          this.editadoArt.nombre      = data[0].nombre;
          this.editadoArt.codbar      = data[0].precios[0].codbar;
          this.editadoArt.stockfisico = data[0].stock
          return HTTP().post('/stockarticuloenpedidos', { articulo_id: data[0].id}).then(({data})=>{
            this.editadoArt.stockpedcon = data.stockpedcon
            this.editadoArt.stockpednocon = data.stockpednocon
            this.seleccionarArticulo = false
          })
        } else if (data.length>1) {
          this.selArt = []
          for (let i=0; i<=data.length-1; i++) {
            this.selArt.push({ id: data[i].id, codigo: data[i].codigo, articulo_id: data[i].id, nombre: data[i].nombre })
          }
          this.seleccionarArticulo = true;
        }
      })
    },

    cantidadItem() {
      // INICIALIZO VALORES
      let descual = 'Lista'
      this.precioOrigen = 'Lista'
      this.promoDescuento = this.editadoArt.ofetasadescuento

      debugger
      // Veo si tomo el descuento de la promo
      if (this.editadoArt.ofeprecio && this.editadoArt.ofeestado=='A' && this.editadoArt.ofeunidades!=0 &&
          this.editadoArt.ofeunidades>this.editadoArt.cantidad) {
        descual = 'Promocion'
      }

      // CARGO EL DESCUENTO EN pordes
      let pordes = 0
      if (descual=='Promocion') {
        pordes = this.promoDescuento
      }

      this.editadoArt.texto = descual
      this.editadoArt.tasadescuento = pordes
      this.editadoArt.importedescuento = (Number(this.editadoArt.cantidad)*(this.roundTo((Number(this.editadoArt.precio)*(this.editadoArt.tasadescuento/100)),2)))
      this.editadoArt.total = this.roundTo(((Number(this.editadoArt.cantidad)*Number(this.editadoArt.precio)))-this.editadoArt.importedescuento,2)
      if (this.editadoArt.cantidad>this.editadoArt.stock) {
        if (this.editadoArt.sinstock=='B') {          // avisar y bloquear
          this.mensaje('Atención: Stock insuficiente, no podrá cerrar el comprobante!', 'red', 3000)
        } else if (this.editadoArt.sinstock=='C') {   // avisar y continuar
          this.mensaje('Atención: Stock insuficiente', this.temas.forms_titulo_bg, 3000)
        }
      }
      return this.editadoArt.total
    },

    guardarItem(columna) {

      this.totalPedido = 0
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.totalPedido += this.articulos[i].total
      }
      this.totalPedido += this.editadoArt.total

      if (this.editadoArt.cantidad == 0) {
        this.$nextTick(() => {
          const f = this.$refs.cantidad;
          f.focus();
        });
        return 
      } else if (this.editadoArt.codigo == '') {
        this.$nextTick(() => {
          const f = this.$refs.buscar;
          f.focus();
        });
        return 
      } else if (this.precioOrigen=='Lista' && columna=='cantidad') {
        this.$nextTick(() => {
          const f = this.$refs.tasadescuento;
          f.focus();
        });
        return 
      }

      // INICIALIZO VALORES
      let descual = 'Lista'
      this.precioOrigen = 'Lista'
      this.promoDescuento = this.editadoArt.ofetasadescuento

      // QUE DESCUENTO TOMO?, puede ser el de la promo
      if (this.editadoArt.ofeprecio && this.editadoArt.ofeestado=='A' && this.editadoArt.ofeunidades!=0) {
        descual = 'Promocion'
      }

      // CARGO EL DESCUENTO EN pordes
      let pordes = this.editadoArt.tasadescuento
      if (descual=='Promocion') {
        pordes = this.promoDescuento
      }

      this.editadoArt.texto = descual
      this.editadoArt.tasadescuento = pordes

      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.precio)
      let txt = this.editadoArt.texto

      // OJO, SI ES PEDIDO HAGO CONTROL DE PROMOCIONES, SI ES FACTURA CARGO NORMAL.
      if (txt=='Promocion') {
        if ((ctt > this.editadoArt.ofeunidades) && (this.editadoArt.ofeunidades>0)) {
          this.actualizoItem(this.editadoArt.ofeunidades, pre, false)
          this.editadoArt.texto = 'Lista'
          this.editadoArt.tasadescuento = 0
          this.actualizoItem(ctt-this.editadoArt.ofeunidades, pre, false)
        } else {
          // hay promocion y alcanza el stock
          this.actualizoItem(ctt, pre, false)
        }
      } else {
        this.actualizoItem(ctt, pre, false)
      }

      this.calculos()
      this.nuevoArt()
      if (this.editadoArt.codigo!='TEXTO') {
        this.$nextTick(() => {
          const f = this.$refs.buscar;
          f.focus();
        });
      }
    },

    actualizoItem(ctt, pre, actualizo) {
      // tengo que ver si las unidades ingresadas impactan en algun descuento

      debugger
      let txt = !actualizo ? this.editadoArt.texto : this.articulos[this.editedIndexArt].texto
      let pordes = 0
      let impdes = 0
      if (txt=='Promocion') {
        pordes = this.promoDescuento
      } else if (txt=='Lista') {
        pordes = 0                                  // ver que pasa cuando ingresan un descuento en la linea
        pordes = this.editadoArt.tasadescuento
      }
      impdes = this.roundTo(((Number(ctt)*pre) * (pordes/100)),2)

      debugger
      let proxId = 1
       if (this.articulos.length>0) {
        let cods = this.articulos.map(o => o.index)
        proxId = Math.max(cods);
        proxId = proxId + 1
      }

      debugger

      if (!actualizo) {
        this.articulos.unshift({
          index:            proxId,
          id:               'nuevo'+proxId,
          articulo_id:      this.editadoArt.articulo_id,
          codigo:           this.editadoArt.codigo,
          codbar:           this.editadoArt.codbar,
          nombre:           this.editadoArt.codigo=='TEXTO' ? this.editadoArt.texto : this.editadoArt.nombre,
          deposito_id:      this.editadoArt.deposito_id,
          unidad_id:        this.editadoArt.unidad_id,
          moneda_id:        this.editadoArt.moneda_id,
          iva_id:           this.editadoArt.iva_id,
          cantidad:         Number(ctt),
          cantidadoriginal: Number(ctt),
//        stock:            (ctt*this.editadoArt.undstock*(this.coef*-1)),
          stock:            this.editadoArt.stock,
          undstock:         this.editadoArt.undstock,
          sinstock:         this.editadoArt.sinstock,
          costo:            this.editadoArt.costo,
          precio:           pre,
          preciooriginal:   this.editadoArt.preciooriginal,
          tasadescuento:    pordes,
          importedescuento: impdes,
          tasaproprecargo:  0,
          total:            (Number(ctt)*pre)-impdes,
          texto:            this.editadoArt.texto,
          vencimiento:      '',
          adevolver:        0,
          padre_id:         this.editadoArt.padre_id,
          undenvase:        null,
          escombo:          this.editadoArt.escombo,
          ofeprecio:        this.editadoArt.ofeprecio,
          ofetasadescuento: this.editadoArt.ofetasadescuento,
          ofeenvio:         this.editadoArt.ofeenvio,
          ofeunidades:      this.editadoArt.ofeunidades,
          ofeestado:        this.editadoArt.ofeestado,
          turno_id:         null,
          decimales:        this.editadoArt.decimales,
          preciomediocobro: this.editadoArt.preciomediocobro,
        })
      } else {
        this.articulos[this.editedIndexArt].cantidad = ctt
        this.articulos[this.editedIndexArt].tasadescuento = pordes
        this.articulos[this.editedIndexArt].importedescuento = impdes
        this.articulos[this.editedIndexArt].total = (Number(ctt)*pre)-impdes
      }
    },

    cancelaLinea() {
      debugger
      if (this.formTitleArt == 'Editar Item') {
        this.articulos.unshift({
          id:               this.editadoArt.id,
          articulo_id:      this.editadoArt.articulo_id,
          codigo:           this.editadoArt.codigo,
          codbar:           this.editadoArt.codbar,
          nombre:           this.editadoArt.nombre,
          deposito_id:      this.editadoArt.deposito_id,
          unidad_id:        this.editadoArt.unidad_id,
          moneda_id:        this.editadoArt.moneda_id,
          iva_id:           this.editadoArt.iva_id,
          cantidad:         this.editadoArt.cantidad,
          cantidadoriginal: this.editadoArt.cantidadoriginal,
          stock:            this.editadoArt.stock,
          undstock:         this.editadoArt.undstock,
          sinstock:         this.editadoArt.sinstock,
          costo:            this.editadoArt.costo,
          precio:           this.editadoArt.precio,
          preciooriginal:   this.editadoArt.preciooriginal,
          tasadescuento:    this.editadoArt.tasadescuento,
          importedescuento: this.editadoArt.importedescuento,
          tasaproprecargo:  this.editadoArt.tasaproprecargo,
          total:            this.editadoArt.total-this.editadoArt.importedescuento,
          texto:            this.editadoArt.texto,
          vencimiento:      this.editadoArt.vencimiento,
          adevolver:        this.editadoArt.adevolver,
          padre_id:         this.editadoArt.padre_id,
          undenvase:        this.editadoArt.undenvase,
          escombo:          this.editadoArt.escombo,
          ofeprecio:        this.editadoArt.ofeprecio,
          ofetasadescuento: this.editadoArt.ofetasadescuento,
          ofeenvio:         this.editadoArt.ofeenvio,
          ofeunidades:      this.editadoArt.ofeunidades,
          ofeestado:        this.editadoArt.ofeestado,
          turno_id:         this.editadoArt.turno_id,
          decimales:        this.editadoArt.decimales,
          preciomediocobro: this.editadoArt.preciomediocobro,
        })
        this.editadoArt = Object.assign({}, this.defaultItemArt)
      } else {
        this.nuevoArt()
      }
      this.busArt = ''
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },

    calculos() {
      let gra = 0; let exe = 0; let iva = 0; let tas = 0; let des = 0; let posiva = 0; let desit = 0;
      let val = this.medpag[1].total+this.medpag[2].total+this.medpag[4].total+this.medpag[5].total+this.medpag[6].total+this.medpag[7].total
      if (this.articulos.length>0) {
        this.editado.importedescuento = 0
        this.editado.gravado = 0
        this.editado.exento = 0
        this.editado.iva = 0
        this.editado.total = 0
        this.rentabilidad = 0
        let base = 0
        let recargo = 0
        for(let i=0; i<=this.articulos.length-1; i++) {
          let tot = this.roundTo(this.articulos[i].cantidad * this.articulos[i].precio,this.articulos[i].decimales)
          recargo = tot*(this.articulos[i].tasaproprecargo/100)
          base = tot+recargo
          des = 0;
          desit = 0; 
          if (this.editado.tasadescuento>0) {
            des = this.roundTo(base*(Number(this.editado.tasadescuento)/100),2)
          }
          if (this.articulos[i].tasadescuento>0) {
            desit = this.roundTo(base*(Number(this.articulos[i].tasadescuento)/100),2)
          }
          base = this.roundTo(base - (des+desit),2)
          if (this.articulos[i].iva_id==2) {
            exe = base
          } else {
            gra = base
            tas = 0
            let posiva = this.ivaTasas.map(function(e) { return e.id; }).indexOf(this.articulos[i].iva_id);
            tas = this.ivaTasas[posiva].tasa
            if (this.articulos[i].iva_id != '') {
              tas = this.ivaTasas[posiva].tasa
            }
            if (this.sucursalDemo) {
              iva = 0
            } else {
              iva = base*(tas/100)
            }
          }
          this.rentabilidad += 
            this.roundTo((((this.articulos[i].precio-this.articulos[i].costo)*this.articulos[i].cantidad)-this.articulos[i].importedescuento),2)
          this.editado.importedescuento += (des+desit)
          this.editado.gravado += gra
          this.editado.exento += exe
          this.editado.iva += iva
          this.editado.total += exe+gra+iva
        }
        this.rentabilidad -= this.editado.importedescuento
        this.rentabilidad = this.roundTo(this.rentabilidad,2)
        this.editado.importedescuento = this.roundTo(this.editado.importedescuento,2)
        this.editado.gravado = this.roundTo(this.editado.gravado,2)
        this.editado.exento = this.roundTo(this.editado.exento,2)
        this.editado.iva = this.roundTo(this.editado.iva,2)
        this.editado.total = this.roundTo(this.editado.total,2)
      }
      this.medpag[3].total = (this.editado.total-(this.medpag[0].total+val))
      this.cargoValorInicialEnValores(this.caja, null, this.medpag[3].total, 4)
    },

    cargoValorInicialEnValores(caja, cpregreso, total, medio) {
      if (this.valores.length==0) {
        let observ   = medio==1 ? 'COBRO EN EFECTIVO' : 'A CUENTA CORRIENTE'
        let medioNom = medio==1 ? 'Efectivo'          : 'Cuenta Corriente'
        this.valores.push({
          caja_id: caja, medio_id: medio,
          cuentaorigen_id: null, cuentadestino_id: null, cuentacheque_id: null, cuentatarjeta_id: null,
          banco_id: null, tarjeta_id: null, cpringreso_id: null, cpregreso_id: cpregreso, 
          cheque_id: null, fechafinanciera: null, fechasalida: null, importe: total,
          nrovalor: null, tipo: 'I', observ: observ, medioNombre: medioNom, cuenta: null, cuit: null,
          nombre: null, recargo: null, interes: null, domicilioFiscal: [],
        })
      }
    },

    nuevoArt() {
      this.editedIndexArt = -1;
      this.dialogEditArt = true;
      this.busArt = ''
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.formTitleArt = 'Nuevo Item'
      this.seleccionarArticulo = false;
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },

    editarArt(item) {
      // huguito
      debugger
      this.formTitleArt = 'Editar Item'
      this.seleccionarArticulo = false;
      this.editedIndexArt = this.articulos.indexOf(item)
      if (this.editedIndexArt==-1) {
        return
      } else {
        this.editadoArt = this.articulos[this.editedIndexArt]
        this.busArt = this.$store.state.codigooid=='C'?item.codigo:item.articulo_id.toString()
        this.$store.state.codigooid=='C'?this.articulos[this.editedIndexArt].codigo:this.articulos[this.editedIndexArt].articulo_id.toString()
        this.articulos = this.articulos.filter( x => x.codigo != this.articulos[this.editedIndexArt].codigo)
        this.$nextTick(() => {
          const f = this.$refs.cantidad;
          f.focus();
        });
      }
    },

    selArtClick (item, row) {
      debugger
      this.seleccionarArticulo = false;
      this.editedIndexArt = this.articulos.indexOf(item)
      this.busArt = this.$store.state.codigooid=='C'?item.codigo:item.articulo_id.toString()
      this.buscarArt(true)
      this.$nextTick(() => {
        const f = this.$refs.cantidad;
        f.focus();
      });
    },

    selArtStockClick (item, row) {
      this.seleccionarArticulo = false;
      this.busArt = this.$store.state.codigooid=='C'?item.codigo:item.articulo_id.toString()
      this.buscarArtStock()
      this.$nextTick(() => {
        const f = this.$refs.busartstk;
        f.focus();
      });
    },

    borrarItem(item) {
      let pos = this.articulos.indexOf(item)
      this.articulos.splice(pos,1);
      this.editadoArt = Object.assign({}, this.defaultItemArt)
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },

    tomarControlDelPedidoHTTP() {
      debugger
      return HTTP().post('/tomarcontroldelpedido', {itemActual: this.itemActualCliente}).then(({data})=>{
        debugger
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 1500)
        } else {
          this.mensaje('¡Has tomado el control del pedido!', this.temas.forms_titulo_bg, 2500)
        }
        this.listarViajeHTTP(false)
      });
    },

    finalizarViaje() {
      this.msg.msgTitle = 'Finalizar Viaje'
      this.msg.msgBody = '¿Confirmas finalizar este viaje?.<br>Todos sus pedidos serán transferidos a Administración.'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'pedido ok'
      this.msg.msgButtons = ['Aceptar']
    },

    anularViajeHTTP() {
      return HTTP().post('/anularviaje', { viaje: this.itemActual.id }).then(({data})=>{
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error al intentar anular este viaje!', this.temas.snack_error_bg, 1500)
        } else {
          this.mensaje('¡El viaje ha sido anulado correctamente!', this.temas.forms_titulo_bg, 2500)
        }
        this.listarHTTP(false)
      });
    },

    finalizarViajeHTTP() {
      return HTTP().post('/finalizarviaje', { viaje: this.itemActual.id }).then(({data})=>{
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error al intentar finalizar este viaje!', this.temas.snack_error_bg, 1500)
        } else {
          if (data==0) {
            this.mensaje('¡El viaje ha finalizado correctamente!', this.temas.forms_titulo_bg, 2500)
          } else if (data==1) {
            this.mensaje('¡El viaje ha finalizado correctamente y 1 pedido ha sido transferido!', this.temas.forms_titulo_bg, 2500)
          } else {
            this.mensaje('¡El viaje ha finalizado correctamente y '+data+' pedidos ha sido transferidos!', this.temas.forms_titulo_bg, 2500)
          }
        }
        this.listarHTTP(false)
      });
    },

    finalizarRepartoHTTP() {
      debugger
      return HTTP().post('/finalizarreparto', { viaje: this.itemActual.id }).then(({data})=>{
        debugger
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error al intentar finalizar este reparto!', this.temas.snack_error_bg, 1500)
        } else {
          this.mensaje('¡El Reparto ha finalizado correctamente!', this.temas.forms_titulo_bg, 2500)
        }
        this.listarHTTP(false)
      });
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

    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },

    getColorTotal (item) {
      let tieneNdc = false
      if (item.pendientes!=null) {
        for (let i=0; i<= item.pendientes.length-1; i++) {
          if (item.pendientes[i].cancelaciones!=null) {
            for (let j=0; j<=item.pendientes[i].cancelaciones.length-1; j++) {
              if (item.pendientes[i].cancelaciones[j].cancelador.cpr.substr(0,3)=='NDC') {
                tieneNdc = true
                break
              }
            }
          }
        }
      }
      return (tieneNdc) ? this.temas.forms_btn_inactivo_bg : this.temas.barra_lateral_bg
    },

    editadoArtStock(stock) {
      return stock==null ? 'Sin Stock' : 'stk '+this.formatoImporte(stock)
    },

    getEstado (estado, accion) {
      let c = ''
      let e = ''
      if (accion=='k') {   //para el dark
        if (estado==='P') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='L') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='I') {
          return this.temas.cen_estado_enviado_dark
        } else if (estado==='D') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='R') {
          return this.temas.cen_estado_enviado_dark
        } else if (estado==='F') {
          return this.temas.cen_estado_finalizado_dark
        } else if (estado==='A') {
          return this.temas.cen_estado_anulado_dark
        } else if (estado==='T') {
          return this.temas.cen_estado_facturado_dark 
        } else if (estado==='K') {
          return this.temas.cen_estado_finalizado_dark
        }
      }
      if (estado==='P') {
        e = 'A la espera de Viajar'
        c = this.temas.cen_estado_pendiente_bg
      } else if (estado==='I') {
        e = 'En Viaje de Ventas'
        c = this.temas.cen_estado_enviado_bg
      } else if (estado==='D') {
        e = 'En Administración'
        c = this.temas.cen_estado_pendiente_bg
      } else if (estado==='L') {
        e = 'Listo para Reparto'
        c = this.temas.cen_estado_pendiente_bg
      } else if (estado==='R') {
        e = 'En Viaje de Reparto'
        c = this.temas.cen_estado_enviado_bg
      } else if (estado==='F') {
        e = 'Finalizado'
        c = this.temas.cen_estado_finalizado_bg
      } else if (estado==='A') {
        e = 'Anulado'
        c = this.temas.cen_estado_anulado_bg
      } else if (estado==='K') {
        e = 'Fnzdo.y Chqdo.'
        c = this.temas.cen_estado_finalizado_bg
      }
      return accion==='c'?c:e
    },

    marcaTercero(item, accion) {
      let vin = this.vinculosHijos;
      let estaVinculado = false;
      let esExclMio = false
      let usaApp = ''
      if (item.tercero.user) {
        estaVinculado = vin.findIndex(x=>x==item.tercero.user.id)
        if (item.tercero.user.userexclusivo_id!=null) {
          if (item.tercero.user.userexclusivo_id==this.userId) {
            esExclMio = true
          }
        }
        if (item.tercero.user.userexclusivo_id!=null) {
          if (item.tercero.user.userexclusivo_id==this.userId) {
            esExclMio = true
          }
          usaApp = item.tercero.user.usaelsistema?'/us':'/nus'
        }
      }
      let say = ''
      if (accion=='m') { //&&this.$store.state.formTercerosTitulo!='Equipo') {
        if (esExclMio) {
          say = 'ex'+usaApp
        } else {
          if (item.tercero.user) {
            if (item.tercero.user.tipo=='UE') {
              say = estaVinculado!=-1?'u+v':'u'
            } else if (item.tercero.user.tipo=='PP') {
              say = estaVinculado!=-1?'PPv':'PP'
            } else if (item.tercero.user.tipo=='CO') {
              say = estaVinculado!=-1?'COv':'CO'
            } else if (item.tercero.user.tipo=='ME') {
              say = estaVinculado!=-1?'MEv':'ME'
            } else if (item.tercero.user.tipo=='BA') {
              say = estaVinculado!=-1?'BAv':'BA'
            }
          }
        }
        return say
      } else if (accion=='c') {
        if (item.tercero.user) {
          if (item.tercero.user.tipo=='UE') {
            return 'red'
          } else if (item.tercero.user.tipo=='PP') {
            if (esExclMio) {
              return usaApp=='/us'?'green':'red'
            }
          } else {
            return this.temas.forms_btn_add_bg
          }
        } else {
          return this.temas.forms_btn_add_bg
        }
      }
    },

    viajeEstado(estado) {
      if (this.estadoDelViaje==null) {
        return false
      } else  {
        return this.estadoDelViaje==estado?true:false
      }
    },

    selectAll(event) {
      if (event.value) {
        this.nuevosSeleccionados = this.nuevos
      } else {
        this.nuevosSeleccionados = []
      }
    },


    colorEstadoDelViaje() {
      if (this.estadoDelViaje==null) {
        return this.temas.barra_lateral_bg
      } else {
        if (this.estadoDelViaje=='A') {
          return 'black'
        } else if (this.estadoDelViaje=='P'||this.estadoDelViaje=='L') {
          return 'red'
        } else if (this.estadoDelViaje=='I'||this.estadoDelViaje=='R') {
          return 'green'
        } else if (this.estadoDelViaje=='D') {
          return 'blue'
        } else if (this.estadoDelViaje=='F') {
          return 'grey'
        }
      }
    },

    viajeEstadoSay() {
      if (this.estadoDelViaje==null) {
        return false
      } else  {
        if (this.estadoDelViaje=='A') {
          return 'Anulado'
        }else if (this.estadoDelViaje=='P') {
          return 'A la espera de Viajar'
        } else if (this.estadoDelViaje=='I') {
          return 'En Viaje de Ventas'
        } else if (this.estadoDelViaje=='D') {
          return 'En Administración'
        } else if (this.estadoDelViaje=='L') {
          return 'Listo para Reparto'
        } else if (this.estadoDelViaje=='R') {
          return 'En Viaje de Reparto'
        } else if (this.estadoDelViaje=='F') {
          return 'Finalizado'
        } else if (this.estadoDelViaje=='K') {
          return 'Finalizado y Cobrado'
        }
      }
    },

    verStockConsolidado() {
      this.dialogStocksConsolidados = true
    },

    elOrden(item, accion) {
      if (accion=='m') {
        return item.orden
      } else if (accion=='c') {
        return this.temas.forms_btn_add_bg
      }
    },

    diasDelViaje(item) {
      let f1 = moment().format('YYYY-MM-DD')
      let f2 = moment(item.fecha).format('YYYY-MM-DD')
      f1 = moment(f1)
      f2 = moment(f2)
      let d = f1.diff(f2, 'days')
      if (d==0) {
        return 'hoy'
      } else if (d==1) {
        return 'ayer'
      } else {
        return d + ' días'
      } 
    },

    fechavalida() {
      if (moment(this.editado.fecha).format('YYYY-MM-DD')<moment().format('YYYY-MM-DD')) {
        this.mensaje('¡La fecha del viaje no puede ser anterior al dia de hoy!', this.temas.forms_titulo_bg, 1500)
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

    formatoImporteDec(valor, dec) {
      let signo = valor >= 0?1:-1
      let v = Math.round((valor*Math.pow(10,dec))+(signo*.0001))/Math.pow(10,dec).toFixed(dec)
      return v.toString()
    },

    formatoFechaCorta(value) {
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
  .black {
  background-color: black !important;
  }
  .red {
    background-color: red !important;
  }
  .green {
    background-color: green !important;
  }

</style>
//5109