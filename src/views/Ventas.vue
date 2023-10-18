<template>
  <!-- eslint-disable max-len -->
  <v-layout align-start class="ma-0">
    <v-flex>
      <v-row class="pb-3">
        <v-col v-for="(cbt, idx) in comprobantes" v-bind:key="idx">
          <v-card outlined @click="selectTipoDeComprobante(cbt.nombre, true)"
            :disabled="!cbt.activo" max-width="180">
            <v-app-bar outlined
              :color="cbt.nombre==filtroComprobanteSel ? $store.state.temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.nombre==filtroComprobanteSel ? $store.state.temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title class="fg100b">
                {{ cbt!=null ? cbt.nombre : '' }}
              </v-toolbar-title>
              <v-badge
                v-if="cbt.nombre=='Pedidos' && $store.state.hayPedidos>0 && !$store.state.externo"
                content="nuevos"
                :dark="true"
                icon="mdi-gift"
                :color="temas.cen_card_activo_bg">
              </v-badge>
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-container>
              <v-row class="pt-0 pb-0" dense v-if="cbt.nombre!='Viajes'">
                <v-col cols="12" class="fg78">
                  ${{formatMoney(cbt.total)}}
                </v-col>
              </v-row>
              <v-row class="pt-0 pb-0" dense>
                <v-col cols="12" class="fg78">
                  {{cbt.ctt==0?'Sin':cbt.ctt}} Movs.
                </v-col>
              </v-row>

              <v-row>
                <v-col v-if="cbt.nombre=='Facturas'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon small outlined
                        v-if="operarioEsVendedor==false"
                        @click.stop="nuevo(cbt.nombre)" v-on="on">
                        <v-icon>mdi-18px mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Nuevo</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-if="operarioEsVendedor==false" class="ml-1"
                        icon small outlined
                        :color="getEstadoAnotador($store.state.anotaciones)"
                        @click="nuevoArtNot()" v-on="on">
                        <v-icon
                          :color="getEstadoAnotador($store.state.anotaciones)">
                          {{ $store.state.anotaciones==0
                            ? 'mdi-18px mdi-view-headline'
                            : 'mdi-18px mdi-message-text-outline'
                          }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Anotaciones de Ventas{{$store.state.anotaciones}}</span>
                  </v-tooltip>
                </v-col>

                <v-col v-else-if="cbt.nombre=='Presupuestos'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-if="operarioEsVendedor==false"
                        icon small outlined
                        @click="nuevo(cbt.nombre)" v-on="on">
                        <v-icon>mdi-18px mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Nuevo</span>
                  </v-tooltip>
                </v-col>

                <v-col v-else-if="cbt.nombre=='Remitos'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-if="operarioEsVendedor==false"
                        icon small outlined
                        @click="nuevo(cbt.nombre)" v-on="on">
                        <v-icon>mdi-18px mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Nuevo</span>
                  </v-tooltip>
                </v-col>

                <v-col v-else-if="cbt.nombre=='Pedidos'">
                  <v-tooltip bottom v-if="operarioEsVendedor">
                    <template v-slot:activator="{ on }">
                      <v-btn v-if="operarioEsVendedor"
                        icon small outlined
                        @click.stop="nuevo(cbt.nombre)" v-on="on">
                        <v-icon>mdi-18px mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Nuevo</span>
                  </v-tooltip>
                </v-col>

                <v-col v-else-if="cbt.nombre=='Recibos'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-if="operarioEsVendedor==false"
                        icon small outlined
                        @click="nuevo(cbt.nombre)" v-on="on">
                        <v-icon>mdi-18px mdi-plus</v-icon>
                      </v-btn>
                    </template>
                      <span>Nuevo</span>
                  </v-tooltip>

                  <v-tooltip bottom v-if="totMaletines.length>0">
                    <template v-slot:activator="{ on }">
                      <v-badge
                        :content="totMaletines.length"
                        color="green">
                        <v-btn v-if="totMaletines.length>0"
                          icon small outlined
                          @click="verMaletines('v')" v-on="on">
                          <v-icon color="green">mdi-18px mdi-briefcase-check</v-icon>
                        </v-btn>
                      </v-badge>
                    </template>
                    <span>Ver Maletines Pendientes</span>
                  </v-tooltip>
                </v-col>

                <v-col v-else-if="cbt.nombre=='Retiros'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-if="operarioEsVendedor==false"
                        icon small outlined
                        @click="editarRetiroDeMercaderia()" v-on="on">
                        <v-icon>mdi-18px mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Retiros de Mercadería</span>
                  </v-tooltip>
                </v-col>

              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <!--
      <v-row v-if="!sayGrilla" class="pt-6">
        <v-col cols="5"></v-col>
        <v-col cols="3">
          <v-progress-circular
            class="text-center"
            :size="70"
            :width="12"
            :color="$store.state.temas.cen_panelcpr_bg"
            indeterminate>
          </v-progress-circular>
        </v-col>
      </v-row>
      -->

      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :single-expand="false"
        :expanded.sync="expanded"
        :show-expand="this.filtroComprobanteSel!='Viajes'"
        dense
        class="elevation-3 fg"
        :footer-props="{
          itemsPerPageOptions: [6],
          showFirstLastPage: true,
          showCurrentPage: true,
          nextIcon: 'mdi-arrow-right-drop-circle-outline',
          prevIcon: 'mdi-arrow-left-drop-circle-outline',
        }"
        @item-expanded="cargoItemsComprobante"
        @click:row="selVjeClick">
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
              class="fg" v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                <v-icon left>mdi-airplane-takeoff</v-icon>
                <b class="fg100b">VENTAS</b>
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="anio in anios"
                :key="anio.id" dense :value="anio.id" label
                :color="anio==elAnio ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="anio==elAnio ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1"
                @click="setAnio(anio)">
                <b>{{ anio.substr(2,2) }}</b>
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="mes in meses"
                :key="mes.id" dense :value="mes.id" label
                :color="mes==elMes ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="mes==elMes ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1"
                @click="setMes(mes)">
                <b>{{ mes }}</b>
              </v-chip>
              <v-progress-circular v-if="progress==true"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>
            </v-toolbar-title>

            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="550px" :fullscreen="true" persistent>
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat
                  :dark="temas.forms_titulo_dark==true"
                  :color="temas.forms_titulo_bg">
                  <v-btn
                    icon
                    @click="cancelar"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="fg pl-2 headdline">{{ formTitle }}</span>
                  <span class="fg100b pl-2 headdline" v-if="clienteVinculado">Cliente Vinculado</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="cprBalanceado() && editado.tercero_id && !yaEnviado"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text"
                    @click="confirmarComprobante">
                    {{ confirmarComprobanteMensaje }}
                  </v-btn>
                </v-toolbar>

                <!-- CABECERA DEL COMRPOBANTE -->
                <v-form ref="form" class="pl-0">
                  <v-card-text>
<!--                <v-container>-->
                      <v-row>
                        <v-col cols="12" sm="2"
                          class="fg pt-0">
                          <!--<v-container fluid class="pt-0 pb-0">-->
                            <v-switch class="pt-0 pb-0"
                              :color="temas.forms_titulo_bg"
                              :disabled="editado.cpr=='REM'||editado.cpr=='PRE'||editado.cpr=='PED'"
                              v-model="esManual"
                              label="Manual">
                            </v-switch>
                          <!--</v-container>-->
                        </v-col>
<!--
                        <v-col cols="1" sm="1" md="1" class="fg pt-3 text-center">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                class="pl-0 pr-1"
                                fab small
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                @click="editarArt(item)" v-on="on">
                                <v-icon>mdi-account-plus</v-icon>
                              </v-btn>
                            </template>
                            <span>Nuevo Cliente</span>
                          </v-tooltip>
                        </v-col>
                      -->

                        <v-col cols="12" sm="1" class="fg pt-0">
                          <v-text-field
                            ref="codigocliente"
                            v-model="editado.tercero_id"
                            :color="temas.forms_titulo_bg"
                            label="Código"
                            :disabled="editedIndex!=-1"
                            autofocus
                            @change="buscarCliente">
                          </v-text-field>
                        </v-col>
                        <v-col v-show="basadoEnCpr==false" cols="12" sm="4"
                          class="fg pt-0 pb-0">
                          <v-autocomplete
                            ref="cliente"
                            v-model="editado.tercero_id"
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
                            :disabled="editedIndex!=-1"
                            v-on:blur="buscoSiElTerceroEstaVinculado()">
                          </v-autocomplete>
                        </v-col>
                        <v-col v-show="basadoEnCpr==true" cols="12" sm="4"
                          class="fg pt-0 pb-0">
                          <v-text-field
                            disabled
                            v-model="editado.nombre"
                            label="Cliente">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" class="fd pt-0 pb-0">
                          <v-text-field
                            disabled
                            v-model="editado.letra"
                            label="Letra">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" class="pt-0 pb-0">
                          <v-text-field class="fg"
                            disabled
                            v-model="editado.responsableAbrev"
                            label="Cond.Fiscal">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" md="1" class="pt-0 pb-0">
                          <v-text-field class="fg"
                            disabled
                            v-model="editado.documento"
                            label="Documento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" class="pt-0 pb-0">
                          <v-text-field class="fg85"
                            disabled
                            v-model="editado.documentoNumero"
                            label="Numero">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row class="pa-0 ma-0 ml-3">
                        <v-col cols="12" sm="6" class="fg pt-0 pb-0">
                          <v-select v-if="editedIndex==-1"
                            label='Direccion'
                            :disabled="facRet!=0"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.direccion_id"
                            :items="dirItems"
                            item-value="id"
                            :item-text="dirItems=>
                              `
                              ${dirItems.direccion} (
                              ${dirItems.postal.nombre} ) -
                              ${dirItems.postal.provincia.nombre} -
                              ${dirItems.postal.provincia.pais.nombre}
                              `">
                          </v-select>
                          <v-text-field v-else
                            v-model="laDireccion"
                            disabled>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" class="fg pt-0 pb-0 ml-0 mr-0">
                          <v-select
                            label="Moneda"
                            v-model="editado.moneda_id"
                            :disabled="editedIndex!=-1 || facRet!=0"
                            :color="temas.forms_titulo_bg"
                            :items="monItems" item-value="id" item-text="simbolo" return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="2" class="fg pt-0 pb-0 ml-0 mr-0">
                          <v-text-field
                            disabled
                            v-model="editado.vendedor.nombre"
                            label="Vendedor">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" class="fg pt-0 pb-0 ml-0 mr-0">
                          <v-select
                            :color="temas.forms_titulo_bg"
                            :disabled=
                            "(editado.cpr=='REM' || (editado.cpr=='PRE' && !sucursalDemo)) ||
                            editedIndex!=-1 || facRet!=0"
                            label="Depósito" v-model="editado.deposito_id"
                            :items="depItems" item-value="id" item-text="id" return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="2" class="fg pt-0 pb-0">
                          <v-text-field
                            disabled
                            label="TRN"
                            :color="temas.forms_titulo_bg"
                            v-model="rentabilidad">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!-- BOTON SELECCION DE FACTURAS SOLO PARA REMITOS -->
                      <v-row class="fg pt-0 pb-0">
                        <v-col cols="12" sm="3" class="pt-0 pb-5">
                          <v-btn
                            v-if="editado.cpr=='REM' && editado.tercero_id!=''"
                            small
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            class="mt-0 mr-2 text-capitalize"
                            @click="buscarFacturasParaRemito">
                            Seleccionar Facturas
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="1" class="pt-0 pb-0">
                          <v-text-field v-if="esManual"
                            v-model="sucManual"
                            @change="setSucManual()"
                            label="Sucursal">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-0 pb-0">
                          <v-text-field v-if="esManual"
                            v-model="nroManual"
                            @change="setNroManual()"
                            @blur="busManual()"
                            label="Número">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-0 pb-0">
                          <v-text-field v-if="esManual"
                            type="date"
                            v-model="editado.fecha"
                            label="Fecha">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- FIN DE SELECCION DE FACTURAS SOLO PARA REMITOS -->

                      <!-- ITEMS DEL COMPROBANTE -->
                      <div class="fg150b">
                        Items
                        <v-chip outlined v-show="editadoArt.pubunidades>0">
                          {{promosComputer}}
                        </v-chip>
                      </div>

                      <v-row>

                        <!-- CODIGO -->
                        <v-col cols="12" sm="1" class="mt-3 pt-0 pl-3 pr-0">
                          <v-text-field
                            filled
                            dense
                            :label="$store.state.codigooid=='C'?'Código':'ID'"
                            class="fg text-input-blue"
                            :disabled="editedIndexArt>-1||facRet>0"
                            hint="Código, Desc, TEXTO"
                            :color="temas.forms_titulo_bg"
                            ref="buscar"
                            v-model="busArt"
                            @keyup.esc="cancelaLinea()"
                            @focus="$event.target.select()"
                            @blur="buscarArt(false)">
                          </v-text-field>
                        </v-col>

                        <!-- TEXTO O DESCRIPCION -->
                        <v-col cols="12" sm="5" class="fg mt-3 pt-0 pl-1 pr-0">
                          <v-text-field v-if="esTexto==true"
                            ref="txt"
                            filled
                            dense
                            label="Texto"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.texto">
                          </v-text-field>
                          <v-text-field v-else
                            filled
                            dense
                            label="Descripción"
                            disabled
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.nombre">
                          </v-text-field>
                        </v-col>

                        <!-- PRECIO -->
                        <v-col cols="12" sm="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-text-field
                            filled
                            dense
                            label="Precio"
                            ref="precio"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.precio"
                            :disabled="editadoArt.codigo!='TEXTO'||facRet>0"
                            type="number">
                          </v-text-field>
                        </v-col>

                        <!-- CANTIDAD -->
                        <v-col cols="12" md="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-badge
                            :content="editadoArtStock(editadoArt.stock)"
                            :color="temas.forms_btn_add_bg"
                            :dark="temas.forms_btn_add_bg==true">
                            <v-text-field v-if="editado.cpr.substr(0,3)=='PED'"
                              filled dense label="Cantidad" class="fg"
                              :color="temas.forms_titulo_bg"
                              v-model="editadoArt.cantidad"
                              type="number" ref="cantidad"
                              @focus="$event.target.select()"
                              @change="cantidadItem()"
                              @blur="guardarItem('cantidad')"
                              @keyup.esc="cancelaLinea()">
                            </v-text-field>
                            <v-text-field v-else
                              filled dense label="Cantidad" class="fg"
                              :disabled="facRet!=0"
                              :color="temas.forms_titulo_bg"
                              v-model.number="editadoArt.cantidad"
                              ref="cantidad"
                              @change="cantidadItem()"
                              @blur="guardarItem('cantidad')"
                              @keyup.esc="cancelaLinea()">
                            </v-text-field>
                          </v-badge>
                        </v-col>

                        <!-- DESCUENTO -->
                        <v-col cols="12" md="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-badge v-if="editadoArt.preciomediocobro"
                            content="pmc"
                            :color="temas.forms_btn_add_bg"
                            :dark="temas.forms_btn_add_bg==true">
                            <v-text-field
                              filled
                              dense
                              label="%Desc."
                              class="fg"
                              :color="temas.forms_titulo_bg"
                              v-model="editadoArt.tasadescuento"
                              :disabled="precioOrigen!='Lista'"
                              type="number"
                              ref="tasadescuento"
                              @focus="$event.target.select()"
                              @change="tasaDescuento()">
                            </v-text-field>
                          </v-badge>
                          <v-text-field v-else
                            filled
                            dense
                            label="%Desc."
                            class="fg"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.tasadescuento"
                            :disabled="precioOrigen!='Lista'||facRet>0"
                            type="number"
                            ref="tasadescuento"
                            @focus="$event.target.select()"
                            @change="tasaDescuento()">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-select
                            filled
                            dense
                            label="IVA"
                            class="fg70"
                            :disabled="facRet!=0"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.iva_id"
                            :items="ivaTasas"
                            item-value="id"
                            item-text="nombre"
                            @blur="guardarItem('tasadeiva')">
                          </v-select>
                        </v-col>
                        <v-col cols="12" md="2" class="mt-0 pt-3 pl-1 pr-3 pr-0">
                          <v-text-field
                            filled dense label="TOTAL"
                            :color="temas.forms_titulo_bg"
                            disabled
                            type="number"
                            v-model="editadoArt.total">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col v-show="seleccionarArticulo == true"
                          cols="12" sm="12" md="12">
                          <v-data-table
                            :headers="headersSelArt"
                            :color="$store.state.temas.forms_titulo_bg"
                            :items="selArt" dense class="elevation-1"
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
                        <v-col cols="12" sm="12" class="pt-0 pb-0">
                          <v-data-table
                            :headers="headersArt"
                            :items="articulos"
                            dense
                            class="elevation-1 pr-0 ml-0"
                            @click:row="editarArt">
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.codigo="{ item }">
                              <span class="fg85">{{ item.codigo }}</span>
                              <v-badge
                                inline
                                :content="itemIvaTasa(item.iva_id)"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
                            </template>
                            <template v-slot:item.id="{ item }">
                              <span class="fg85">{{ item.id }}</span>
                              <v-badge
                                inline
                                :content="itemIvaTasa(item.iva_id)"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
                            </template>
                            <template v-slot:item.nombre="{ item }">
                              <span class="fg85">{{ item.nombre }}</span>
                              <v-badge v-if="!item.loTengo"
                                inline
                                content="nlt"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
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
                                content="pub"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
                              <span class="fg85">
                                {{ formatoImporte(item.tasadescuento) }}
                              </span>
                            </template>
                            <template v-slot:item.importedescuento="{ item }">
                              <span class="fg85">
                                ${{ formatoImporte(item.importedescuento) }}
                              </span>
                            </template>
                            <template v-slot:item.total="{ item }">
                              <strong>
                                <span class="fg">${{ formatoImporte(item.total) }}</span>
                              </strong>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <!--
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-if="editado.cpr!='REM' && facRet==0"
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
                              -->
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-if="facRet==0"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="pl-1 pr-1"
                                    @click="borrarArt(item)" v-on="on">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- FIN ITEMS DE COMPROBANTE -->

                      <!-- TOTALES DEL COMPROBANTE -->
                      <v-row>
                        <v-col cols="12" sm="1" class="pt-4 pb-0">
                          <v-text-field class="caption"
                            v-if="editado.cpr!='REM'"
                            dense outlined prefix="$"
                            v-model="recargo"
                            :color="temas.forms_titulo_bg"
                            @change="calculos()"
                            label="$Recargo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" class="pt-4 pb-0">
                          <v-text-field class="caption" v-if="editado.cpr!='REM'"
                            dense outlined prefix="%"
                            v-model="editado.tasadescuento"
                            :color="temas.forms_titulo_bg"
                            @change="calculos()"
                            label="%Bonificación">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-4 pb-0">
                          <v-text-field class="caption" v-if="editado.cpr!='REM'"
                            dense outlined prefix="$"
                            v-model="editado.importedescuento"
                            @change="calculos()"
                            label="$Bonificación">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-4 pb-0">
                          <v-text-field class="fg135b" v-if="editado.cpr!='REM'"
                            readonly dense outlined
                            v-model="editadoGravado"
                            label="Gravado">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-4 pb-0">
                          <v-text-field class="fg135b" v-if="editado.cpr!='REM'"
                            readonly dense outlined
                            v-model="editadoExento"
                            label="Exento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-4 pb-0">
                          <v-text-field class="fg135b" v-if="editado.cpr!='REM'"
                            readonly dense outlined
                            v-model="editadoIva"
                            label="IVA">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-4 pb-0">
                          <v-text-field
                            dense outlined readonly
                            class="fg135b"
                            v-model="editadoTotal"
                            label="TOTAL">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- FIN TOTALES DEL COMPROBANTE -->

                      <!-- BONIFICACION Y CREDITO MAXIMO -->
                      <v-row v-if="editado.cpr.substring(0,3)=='FAC'">
                        <v-col cols="12" sm="2" class="pt-0 pb-0">
                          <v-text-field class="fg115b"
                            readonly dense outlined prefix="%"
                            v-model="bonificacionmaxima"
                            label="% Max.Bonif.">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-0 pb-0">
                          <v-text-field class="fg115b"
                            readonly dense outlined prefix="$"
                            v-model="creditomaximo"
                            label="Crédito Máximo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-0 pb-0">
                          <v-text-field class="fg115b"
                            readonly dense outlined prefix="$"
                            v-model="saldoctacte"
                            label="Saldo Cta.Cte">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-0 pb-0">
                          <v-text-field class="fg115b"
                            readonly dense outlined prefix="$"
                            v-model="valorespendientes"
                            label="Valores pendientes">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-0 pb-0">
                          <v-text-field class="fg115b"
                            readonly dense outlined
                            v-model="saldoDisponible"
                            label="Saldo Disponible">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="pt-0 pb-0">
                          <v-img v-if="electronica"
                            height="40" width="40" :src="`/images/afip.png`"
                            @click="chequearAfip">
                          </v-img>
                        </v-col>
                      </v-row>
                      <!-- BONIFICACION Y CREDITO MAXIMO -->

                      <!-- PAGO DEL COMPROBANTE -->
                      <v-row
                        v-if="(editado.cpr!='PRE' || $store.state.sucursalDemo) &&
                        editado.cpr!='REM' && editado.cpr.substring(0,3)!='PED' && tienesaldo==true">
                        <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
                          <v-btn
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            @click="setComoPaga(2)">
                            Detallar Pago
                          </v-btn>
                        </v-col>
                        <v-col cols="10" sm="10" md="10" class="pt-0 pb-0">
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[0].activo"
                            :color="medpag[0].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            Eftvo. <b>{{ formatoImporte(medpag[0].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[1].activo"
                            :color="medpag[1].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            T.Créd. $<b>{{ formatoImporte(medpag[1].total)}}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[2].activo"
                            :color="medpag[2].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            T.Déb. $<b>{{ formatoImporte(medpag[2].total)}}</b>
                          </v-chip>
                          <v-chip v-if="disponible>0" class="ma-1 caption" label
                            v-show="medpag[3].activo"
                            :color="medpag[3].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            C.Cte. $<b>{{ formatoImporte(medpag[3].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[4].activo"
                            :color="medpag[4].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            Transf. $<b>{{ formatoImporte(medpag[4].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[5].activo"
                            :color="medpag[5].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            Cheque $<b>{{ formatoImporte(medpag[5].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[6].activo"
                            :color="medpag[6].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            M.Pago $<b>{{ formatoImporte(medpag[6].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[7].activo"
                            :color="medpag[7].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            T.Pago $<b>{{ formatoImporte(medpag[7].total) }}</b>
                          </v-chip>
                        </v-col>
                      </v-row>
                      <!-- FIN TOTALES DEL COMPROBANTE -->
<!--                </v-container>  -->
                  </v-card-text>
                </v-form>
                <!-- FIN DE LA CABECERA DEL COMPROBANTE -->
              </v-card>
            </v-dialog>

            <!--// MODIFICACION DE PEDIDOS // -->
            <v-dialog v-model="dialogPed" max-width="550px" :fullscreen="true">
              <template v-slot:activator="{}"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogPed=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{ empresa }} -
                    MODIFICAR PEDIDO
                    {{itemActual.cpr}} - {{itemActual.tercero.nombre}}
                  </span>
                  <v-spacer></v-spacer>
                  <span class="text--right">
                    <v-btn v-show="pedProcesable"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="guardarPed">Guardar
                    </v-btn>
                  </span>
                </v-toolbar>
                <v-form ref="art">
                  <v-card-text class="fg">
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <span class="fg150b">Items del Pedido</span>
                          <v-data-table
                            :headers="headersPed"
                            :items="artPed"
                            dense
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:item.estado="{ item }">
                              <v-chip label dark
                                :color="getEstadoPed(item.estado,'c')">
                                <b>{{ getEstadoPed(item.estado,'e') }}</b>
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="item.stock>0||item.sinstock!='B'" class="mr-2"
                                    fab x-small
                                    :color="$store.state.temas.cen_btns_bg"
                                    :dark="$store.state.temas.cen_btns_dark==true"
                                    @click="sumarRestar(item, 1, false, 'pedidos')" v-on="on">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Sumar</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="item.stock>0||item.sinstock!='B'" class="mr-2"
                                    fab x-small
                                    :color="$store.state.temas.cen_btns_bg"
                                    :dark="$store.state.temas.cen_btns_dark==true"
                                    @click="sumarRestar(item, -1, false, 'pedidos')" v-on="on">
                                    <v-icon>mdi-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{}}Restar</span>
                              </v-tooltip>
                              <v-tooltip bottom v-if="item.cttped>item.stock">
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="item.stock>0" class="mr-2"
                                    fab x-small
                                    :color="$store.state.temas.cen_btns_bg"
                                    :dark="$store.state.temas.cen_btns_dark==true"
                                    @click="sumarRestar(item, -1, false, 'ajustar')" v-on="on">
                                    <v-icon>mdi-format-horizontal-align-left</v-icon>
                                  </v-btn>
                                </template>
                                <span>Ajustar a Stock</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!--// FIN DEL PROCESAMIENTO DE PEDIDOS // -->

            <!--TRANSFERENCIA DE PEDIDO A OTRA SUCURSAL -->
            <v-dialog v-model="dialogTransferirPedido" max-width="1080px">
              <template v-slot:activator="{}"></template>
              <v-card class="fg">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cerrarTransfPed()"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    Transferir Pedido:
                    {{itemActual.cpr}} - {{itemActual.tercero.nombre}}
                  </span>
                  <v-spacer></v-spacer>
                  <span class="text--right">
                    <v-btn v-if="artTransfPorcentaje>0&&artTransfPorcentaje<101"
                      class="ma-2 white--text"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      @click="guardarTransfPedHTTP">
                      Confirmar Transferencia
                    </v-btn>
                  </span>
                </v-toolbar>
                <v-form ref="art">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-select class="body-2"
                            :color="temas.forms_titulo_bg"
                            label="Sucursal destino"
                            v-model="artTransfPedId"
                            :items="artTransfPedSucDes"
                            item-value="id" item-text="nombre"
                            return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <p>
                            La transferencias se pueden realizar solo una vez y no se pueden
                            reversar. Selecciona con cuidado los artículos y las cantidades.
                          </p>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="5" sm="5" md="5" class="pt-0">
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field
                            filled dense label="% a Transferir"
                            type="number"
                            :rules="porcentajeATransferir"
                            :color="temas.forms_titulo_bg"
                            v-model="artTransfPorcentaje"
                            min="0" max="100" @change="porTransferir()"
                            @click="aplicarPorcentajeATransferir()"
                            @keyup="aplicarPorcentajeATransferir()">
                          </v-text-field>
                        </v-col>
                        <v-col cols="5" sm="5" md="5" class="pt-0">
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <span class="fg150b">Items del Pedido</span>
                          <v-data-table
                            :headers="headersTransfPed"
                            :items="artTransfPed"
                            dense
                            class="elevation-3"
                            :footer-props="footerProps10">
                            <template v-slot:item.nombre="{ item }">
                              <span class="fg85">{{ item.nombre.substring(0,60) }}</span>
                            </template>

                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn class="mr-2"
                                    fab x-small
                                    :color="$store.state.temas.cen_btns_bg"
                                    :dark="$store.state.temas.cen_btns_dark==true"
                                    @click="sumarRestar(item, 1, false, 'transfPed')" v-on="on">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Sumar</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn class="mr-2"
                                    fab x-small
                                    :color="$store.state.temas.cen_btns_bg"
                                    :dark="$store.state.temas.cen_btns_dark==true"
                                    @click="sumarRestar(item, -1, false, 'transfPed')" v-on="on">
                                    <v-icon>mdi-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Restar</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn class="mr-2"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="editarTransferirAOtraSucursal(item)" v-on="on">
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>
                            </template>
                            <template v-slot:top>
                              <v-dialog v-model="dialogTransferirItem" max-width="250px">
                                <v-card>
                                  <v-card-title>
                                    <span class="headline">A Transferir</span>
                                  </v-card-title>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                          <v-text-field
                                            autofocus
                                            :color="temas.forms_titulo_bg"
                                            v-model="editadoTransfItem.cttATransferir"
                                            label="A Transferir"
                                            @focus="$event.target.select()">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      :disabled="editadoTransfItem.cttATransferir>editadoTransfItem.cttOriginal"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      @click="guardarTransferirItem(item)">
                                      Guardar
                                    </v-btn>
                                    <v-btn
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      text
                                      @click="cancelarTransferirItem">
                                      Cancelar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE TRANSFERENCIA DE PEDIDO -->

            <!--// SEGUIMIENTO/RASTREO DE COMPROBANTES // -->
            <v-dialog v-model="dialogRas" max-width="1260px">
              <v-card class="fg">
                <template v-slot:activator="{}"></template>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogRas=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Seguimiento del Comprobante: {{editado.cpr}}
                  </span>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card>
                  <v-form ref="art2">
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sx="12" mx="12">
                            <v-data-table
                              :headers="headersRas"
                              :items="rastreo"
                              dense
                              class="elevation-3">
                            </v-data-table>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                  </v-form>
                </v-card>
              </v-card>
            </v-dialog>
            <!-- FIN DEL RASTREO -->

            <!--// TIMELINE // -->
            <v-dialog v-model="dialogTimeLine" max-width="500px">
              <v-card class="fg">
                <template v-slot:activator="{}"></template>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogTimeLine=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Timeline {{editado.cpr}}
                  </span>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card class="mx-auto" max-width="500">
                  <v-card-text class="py-0">
                    <v-timeline align-top dense>
                      <v-timeline-item class="fg"
                        v-for="(tm, idx) in timeLine" v-bind:key="idx"
                        :color="temas.barra_principal_bg" small>
                        <v-card :color="temas.forms_titulo_bg" dark>
                          <v-card-title class="fg pt-1 pb-1">
                            {{tm.novedad}}
                          </v-card-title>
                          <v-card-text class="pt-2 pb-0 fg75 white text--primary">
                            <p>{{ fechaTimeLine(tm.created_at) }}<br>{{ tm.detalles }}</p>
                          </v-card-text>
                        </v-card>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card-text>
                </v-card>
              </v-card>
            </v-dialog>
            <!-- FIN DEL TIMELINE -->

            <!--// ANOTACIONES DE VENTAS // -->
            <v-dialog v-model="dialogNot" max-width="1250px" persistent>
              <v-card>
                <v-toolbar flat
                  :color="$store.state.temas.forms_titulo_bg"
                  :dark="$store.state.temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogNot=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Anotaciones de Ventas
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="articulos.length>0" class="ma-2 white--text"
                    color="teal accent-4"
                    @click="facturarAnotaciones">
                    Facturar Anotaciones
                  </v-btn>
                </v-toolbar>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>

                      <!-- ITEMS DEL ANOTADOR -->
                      <span dense class="headline">Items</span>
                      <v-row>
                        <v-col cols="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-text-field
                            class="text-input-blue"
                            filled dense label="Código"
                            :disabled="editedIndexArt>-1"
                            hint="Código, Desc"
                            :color="temas.forms_titulo_bg"
                            ref="buscar"
                            v-model="busArt"
                            autofocus
                            @keyup.esc="cancelaLinea()"
                            @focus="$event.target.select()"
                            @blur="buscarArt(false)">
                          </v-text-field>
                        </v-col>
                        <v-col  cols="5" class="fg mt-0 pt-3 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Descripción"
                            disabled
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.nombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Cantidad" class="fg"
                            :color="temas.forms_titulo_bg"
                            v-model.number="editadoArt.cantidad"
                            ref="cantidad"
                            @focus="$event.target.select()"
                            @change="cantidadItem()"
                            @blur="guardarArtAnotador(editadoArt)"
                            @keyup.esc="cancelaLinea()">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" class="mt-0 pt-3 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Precio"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.precio"
                            disabled
                            type="number">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="mt-0 pt-3 pl-1 pr-0">
                          <v-select
                            filled dense label="IVA" class="fg70"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.iva_id"
                            disabled
                            :items="ivaTasas" item-value="id"
                            item-text="nombre" return-object>
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
                            :color="$store.state.temas.forms_titulo_bg"
                            :items="selArt" dense class="elevation-1"
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
                            :headers="headersNot"
                            :items="articulos"
                            dense
                            class="elevation-1 pr-0 ml-0"
                            :footer-props="{
                              itemsPerPageOptions: [6],
                              showFirstLastPage: true,
                              showCurrentPage: true,
                              nextIcon: 'mdi-arrow-right-drop-circle-outline',
                              prevIcon: 'mdi-arrow-left-drop-circle-outline',
                            }"
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
                            <template v-slot:item.total="{ item }">
                              <strong>
                                <span class="fg85">${{ formatoImporte(item.total) }}</span>
                              </strong>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn class="mr-2"
                                    fab x-small
                                    :color="$store.state.temas.cen_btns_bg"
                                    :dark="$store.state.temas.cen_btns_dark==true"
                                    @click="sumarRestar(item, 1, true, 'articulos')" v-on="on">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Sumar</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn class="mr-2"
                                    fab x-small
                                    :color="$store.state.temas.cen_btns_bg"
                                    :dark="$store.state.temas.cen_btns_dark==true"
                                    @click="sumarRestar(item, -1, true, 'articulos')" v-on="on">
                                    <v-icon>mdi-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Restar</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn class="mr-2"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="borrarArt(item)" v-on="on">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- FIN ITEMS DEL ANOTADOR -->

                      <!-- TOTALES DEL ANOTADOR -->
                      <v-row>
                        <v-col cols="6" sm="6" md="6">
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="rentabilidad"
                            label="TRN">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="anotadorTotal"
                            label="TOTAL">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- FIN TOTALES ANOTADOR -->

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE ANOTACIONES DE VENTAS -->

             <!--// ENVIOS // -->
            <v-dialog v-model="dialogEnvios" max-width="700px">
              <template v-slot:activator="{}"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogEnvios=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Envíos
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text"
                    @click="confirmarEnvioRetiro('E')">
                    Confirmar Envío
                  </v-btn>
                </v-toolbar>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="8" sm="8" md="8">
                          <v-text-field
                            outlined
                            v-model="envio.quienretira"
                            label="Quien Retira?"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            outlined
                            v-model="envio.documento"
                            label="Documento"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-radio-group v-model="envio.tipodeenvio" row class="pt-0">
                            <v-radio
                              :color="temas.forms_titulo_bg"
                              label="Envío Propio"
                              value="P">
                            </v-radio>
                            <v-radio
                              :color="temas.forms_titulo_bg"
                              label="Envío por Terceros"
                              value="T">
                            </v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-row>
                      <v-row v-show="envio.tipodeenvio=='P'">
                        <v-col cols="12" sm="12" md="12">
                          <v-select
                            label='Direccion de Envío' outlined
                            :color="temas.forms_titulo_bg"
                            v-model="envio.direccion_id"
                            :items="dirItems"
                            item-value="id"
                            :item-text="dirItems=>
                              `
                              ${dirItems.direccion} - (
                              ${dirItems.postal.nombre} ) -
                              ${dirItems.postal.provincia.nombre} -
                              ${dirItems.postal.provincia.pais.nombre}
                              `">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col v-show="envio.tipodeenvio=='T'">
                          <v-autocomplete
                            class="pt-0"
                            label="Transportista"
                            v-model="envio.transporte_id"
                            :items="itemsTercerosTrans"
                            :loading="isLoadingTercerosTrans"
                            :search-input.sync="searchTercerosTrans"
                            item-text="nombre"
                            item-value="id"
                            outlined
                            :color="temas.forms_titulo_bg"
                            placeholder="Escriba para buscar">
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row v-show="envio.tipodeenvio=='T'" class="pt-0">
                        <v-col cols="12" sm="12" md="12">
                          <v-radio-group v-model="envio.adomicilio" row class="pt-0">
                            <v-radio
                              :color="temas.forms_titulo_bg"
                              label="Envía a Domicilio"
                              value="S">
                            </v-radio>
                            <v-radio
                              :color="temas.forms_titulo_bg"
                              label="A otra dirección"
                              value="N">
                            </v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-row>
                      <v-row v-show="envio.tipodeenvio=='T' && envio.adomicilio=='S'">
                        <v-col cols="12" sm="12" md="12">
                          <v-select
                            label='Direccion de Envío' outlined
                            :color="temas.forms_titulo_bg"
                            v-model="envio.direccion_id"
                            :items="dirItems"
                            item-value="id"
                            :item-text="dirItems=>
                              `
                              ${dirItems.direcion} - (
                              ${dirItems.postal.nombre} ) -
                              ${dirItems.postal.provincia.nombre} -
                              ${dirItems.postal.provincia.pais.nombre}
                              `">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row v-show="envio.tipodeenvio=='T' && envio.adomicilio=='N'">
                        <v-col cols="12" sm="12" md="12">
                          <v-autocomplete
                            class="pt-0"
                            label="Punto de Retiro"
                            v-model="envio.puntoderetiro_id"
                            :items="itemsTercerosPdr"
                            :loading="isLoadingTercerosPdr"
                            :search-input.sync="searchTercerosPdr"
                            item-text="nombre"
                            item-value="id"
                            outlined
                            :color="temas.forms_titulo_bg"
                            placeholder="Escriba para buscar"
                            @change="leerDirPdr()">
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row v-show="envio.tipodeenvio=='T' && envio.adomicilio=='N'">
                        <v-col cols="12" sm="12" md="12">
                          <v-select
                            label='Dirección del Punto de Retiro' outlined
                            :color="temas.forms_titulo_bg"
                            v-model="envio.puntoderetirodireccion_id"
                            :items="dirItemsPdrDir"
                            item-value="id"
                            :item-text="dirItemsPdrDir=>
                              `
                              ${dirItemsPdrDir.direccion} (
                              ${dirItemsPdrDir.postal.nombre} ) -
                              ${dirItemsPdrDir.postal.provincia.nombre} -
                              ${dirItemsPdrDir.postal.provincia.pais.nombre}
                              `">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            type="date" outlined
                            v-model="envio.llegada"
                            :color="temas.forms_titulo_bg"
                            label="Fecha de llegada">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sx="4" mx="4">
                          <v-switch
                            :disabled="envio.remitogenerado==true"
                            :label="envio.remito_msg"
                            v-model="envio.generaremito"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" v-show="envio.remitogenerado==true">
                          <v-text-field
                            disabled outlined
                            v-model="envio.remito_numero"
                            :color="temas.forms_titulo_bg"
                            label="Número de Remito">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            outlined
                            v-model="envio.importeflete"
                            label="Total del Flete"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            outlined
                            v-model="envio.bultos"
                            label="Bultos"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="6">
                          <v-text-field
                            outlined disabled
                            v-model="envio.traking"
                            label="Código de Seguimiento"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE ENVIOS -->

            <!-- BULTOS DEL PEDIDO -->
            <v-dialog v-model="dialogBultos" max-width="400px">
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

            <!-- RETIROS DE MERCADERIA YA FACTURADA -->
            <v-dialog v-model="dialogRetiro" max-width="700px">
              <template v-slot:activator="{}"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogRetiroMerc=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Retiro de Mercadería
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text" @click="confirmarRetiroMerc()">
                    Guardar Retiro
                  </v-btn>
                </v-toolbar>

                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="4" sx="4" mx="4">
                          <v-switch
                            :disabled="retiro.remitogenerado==true"
                            :label="retiro.remito_msg"
                            v-model="retiro.generaremito"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            disabled outlined
                            v-model="retiro.remito_numero"
                            :color="temas.forms_titulo_bg"
                            label="Número de Remito">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            outlined
                            v-model="retiro.bultos"
                            label="Bultos"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="8" sm="8" md="8">
                          <v-text-field
                            outlined
                            v-model="retiro.quienretira"
                            label="Quien Retira?"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            outlined
                            v-model="retiro.documento"
                            label="Documento"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE RETIROS -->

            <!--// ADMINISTRACION DE PEDIDOS // -->
            <v-dialog v-model="dialogAdministracionPedidos" :fullscreen="true" persistent>
              <template v-slot:activator="{}"></template>
              <v-card class="fg" height="700px">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogAdministracionPedidos=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Administración de Pedidos
                  </span>
                    <v-chip class="ml-3"
                      :color="temas.barra_lateral_bg"
                      :dark="temas.barra_lateral_dark">
                      Viaje Nro. {{ sayItemActualViaje('id') }}
                    </v-chip>
                    <v-chip class="ml-3"
                      :color="temas.barra_lateral_bg"
                      :dark="temas.barra_lateral_dark">
                      Zona ( {{ sayItemActualViaje('zona') }} )
                    </v-chip>
                    <v-chip v-if="viajeEstado('D')" class="ml-3"
                      :color="temas.barra_lateral_bg"
                      :dark="temas.barra_lateral_dark">
                      {{viajesStaticsSay}} % completado
                    </v-chip>
                    <v-chip class="ml-3"
                      :color="colorEstadoDelViaje()"
                      :dark="temas.barra_lateral_dark">
                      {{viajeEstadoSay()}}
                    </v-chip>
                </v-toolbar>
                <v-card>
                  <v-card-text>
                    <v-row class="fg">

                      <v-col cols="3" sx="3" mx="3" class="pt-5 pb-0">
                        <v-pagination
                          v-model="pagina"
                          :length="itemsRecorrido.length>0?Math.ceil(itemsRecorrido.length/perPage):0"
                          :color="temas.barra_principal_bg"
                          :total-visible="5">
                        </v-pagination>
                      </v-col>

                      <v-col cols="2" sx="2" mx="2" class="mt-0 pt-5 pb-2">
                        <v-text-field
                          outlined dense
                          v-model="search"
                          label="Buscar">
                        </v-text-field>
                      </v-col>

                      <v-col cols="7" sx="7" mx="7" class="mt-0 pt-5 pb-2">
                        <span v-for="(fe, idx) in filtrosEstadosCprs" v-bind:key="idx">
                          <v-badge
                            class="pt-1 pb-0 pl-0 pr-0" overlap :content="fe.ctt"
                            :color="fe.tip==filtroEstadoCprsSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                            :dark="fe.tip==filtroEstadoCprsSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
                            rigth>
                            <v-chip
                              dense :value="fe" label
                              :color="fe.tip==filtroEstadoCprsSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                              :dark="fe.tip==filtroEstadoCprsSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
                              class="ml-2 fg"
                              @click="setFiltroEstadoCprs(fe)">
                              {{ fe.tip }}
                            </v-chip>
                          </v-badge>
                        </span>
                      </v-col>

                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sx="12" mx="12">

                        <v-data-table
                          :headers="headersRecorrido"
                          :items="itemsRecorrido"
                          :footer-props="footerProps3"
                          :search="search"
                          :items-per-page=perPage
                          :page.sync="pagina"
                          :hide-default-footer="true"
                          dense>

                          <template v-slot:item.tercero.razon_social="{ item }">
                            <div class="pt-2 pb-2">
                              <v-card flat>
                                <v-card-text>

                                  <!-- CLIENTE -->
                                  <v-row class="pt-0 pb-0">
                                    <v-col cols="12" class="pt-2 pb-0">
                                      <span class="fg">
                                        <b>{{ item.tercero.id }} - </b>
                                        <b>{{ item.tercero.razon_social.substring(0,20)}}</b>
                                      </span>
                                      <v-badge v-if="terceroUserDefined(item)"
                                        class="pt-1 pl-2"
                                        :content="marcaTercero(item,'m')"
                                        :color="marcaTercero(item,'c')"
                                        :dark="temas.forms_btn_add_bg==true">
                                      </v-badge>
                                    </v-col>
                                  </v-row>

                                  <!-- BOTON ARTICULOS Y PARTICION DEL PEDIDO -->
                                  <v-row class="pt-0 pb-0">
                                    <v-col cols="12">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn class="mr-0 ml-1"
                                            outlined fab x-small
                                            :color="temas.barra_lateral_bg"
                                            @click="articulosDelPedido(item)" v-on="on">
                                            <v-icon>mdi-stocking</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Artículos del Pedido</span>
                                      </v-tooltip>

                                      <v-tooltip bottom
                                        v-if="
                                        (itemActualViaje.estado=='D'||itemActualViaje.estado=='I')&&
                                        (item.cprsB.pedido==null&&item.cprsA.factura.id==null)">
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            class="mr-0 ml-1"
                                            outlined fab x-small
                                            :color="temas.barra_lateral_bg"
                                            @click="chequearTransfPed(item,2)" v-on="on">
                                            <v-icon>mdi-nintendo-switch</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Particionar Pedido
                                        </span>
                                      </v-tooltip>

                                    </v-col>
                                  </v-row>
                                  <!--
                                  <v-row>
                                    <div v-if="item.lista!=null">
                                      Lista
                                      <b>
                                        <span :style="{ color: 'red' }">{{ item.lista }}</span>
                                      </b>
                                    </div>
                                  </v-row>
                                  -->
                                </v-card-text>
                              </v-card>
                            </div>
                          </template>

                          <!-- CPR PEDIDO -->
                          <template v-slot:item.cprsA.pedido.cpr="{ item }">
                            <v-row class="pt-1 pb-2">
                              <v-col cols="12">
                                <v-card flat>
                                  <template slot="progress"></template>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2">
                                    <div class="fg" :color="temas.forms_btn_xls_bg">
                                      <span style="margin-right: 5px;">
                                        <b>{{item.cprsA.pedido.cpr}}</b>
                                      </span>
                                      <v-badge inline dot :color="item.cprsA.demo?'red':'green'"></v-badge>
                                    </div>
                                    <div class="fg85">
                                      Artículos <b><span :style="{ color: 'red' }">{{item.cprsA.pedido.items.length}}</span></b>
                                      <!--
                                      <br>
                                      <div v-if="item.lista!=null">
                                        Lista
                                        <b>
                                          <span :style="{ color: 'red' }">{{ item.lista }}</span>
                                        </b>
                                      </div>
                                      -->
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                            <v-row v-if="item.cprsB.pedido" class="pt-0 mt-0 pb-2">
                              <v-col cols="12">
                                <v-card flat>
                                  <template slot="progress"></template>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2">
                                    <div class="fg" :color="temas.forms_btn_xls_bg">
                                      <span style="margin-right: 5px;">
                                        <b>{{item.cprsB.pedido.cpr}}</b>
                                      </span>
                                      <v-badge inline dot :color="item.cprsB.demo?'red':'green'"></v-badge>
                                    </div>
                                    <div class="fg85">
                                      Artículos <b><span :style="{ color: 'red' }">{{item.cprsB.pedido.items.length}}</span></b>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>

                          <!-- CPR/BOTON FACTURA -->
                          <template v-slot:item.cprsA.factura.cpr="{ item }">
                            <v-row>
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2">
                                    <div v-if="item.cprsA.factura.cpr=='PENDIENTE'" class=" text-center pt-1 pb-1">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn class="mr-0 ml-0 pl-0"
                                            outlined fab x-small
                                            :disabled="tieneAsociado(item,'factura')||viajeEnReparto()"
                                            :color="temas.barra_lateral_bg"
                                            @click="cprDesdeAdminDePedidos(item,'FAC','NODIV')" v-on="on">
                                            <v-icon>mdi-file-document</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>{{item.cprsA.demo?'Presupuestar':'Facturar'}}</span>
                                      </v-tooltip>
                                    </div>
                                    <div v-else class="pt-2 mt-2">
                                      <span style="margin-right: 5px;">
                                        <b>{{item.cprsA.factura.cpr}}</b>
                                      </span><br>
                                      <span :style="{color:'green'}">
                                        ${{kit.redondear(item.cprsA.factura.total,2,2)}}
                                      </span>
                                      <v-btn icon
                                        @click="print(item.cprsA.factura)">
                                        <v-icon>mdi-printer</v-icon>
                                      </v-btn>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                            <v-row v-if="item.cprsB.pedido" class="pt-0 mt-0 pb-2">
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2">
                                    <div v-if="item.cprsB.factura.cpr=='PENDIENTE'"
                                      class=" text-center pt-1 pb-1">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn class="mr-0 ml-0 pl-0"
                                            outlined fab x-small
                                            :disabled="tieneAsociado(item,'facturaB')||viajeEnReparto()"
                                            :color="temas.barra_lateral_bg"
                                            @click="cprDesdeAdminDePedidos(item,'FAC', 'DIV')" v-on="on">
                                            <v-icon>mdi-file</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>{{item.cprsB.demo?'Presupuestar':'Facturar'}}</span>
                                      </v-tooltip>
                                    </div>
                                    <div v-else>
                                      <span style="margin-right: 5px;">
                                        <b>{{item.cprsB.pedido?item.cprsB.factura.cpr:''}}</b>
                                      </span>
                                      <span :style="{color:'green'}">
                                        ${{kit.redondear(item.cprsB.pedido?item.cprsB.factura.total:0,2,2)}}
                                      </span>
                                      <v-btn icon
                                        @click="print(item.cprsB.factura)">
                                        <v-icon>mdi-printer</v-icon>
                                      </v-btn>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>

                          <!-- CPR/BOTON NDD -->
                          <template v-slot:item.cprsA.ndd.cpr="{ item }">
                            <v-row>
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2">
                                    <div v-if="item.cprsA.ndd.cpr=='?'" class=" text-center pt-1 pb-1">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn class="mr-0 ml-0 pl-0"
                                            outlined fab x-small
                                            :disabled="tieneAsociado(item,'ndd')||viajeEnReparto()"
                                            :color="temas.barra_lateral_bg"
                                            @click="cprDesdeAdminDePedidos(item,'NDD', 'NODIV')" v-on="on">
                                            <v-icon>mdi-file-document</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Aplicar NDD</span>
                                      </v-tooltip>
                                    </div>
                                    <div v-else class="fg85">
                                      <span :style="{ color: 'green' }">
                                        ${{kit.redondear(item.cprsA.ndd.total,2,2)}}
                                      </span>
                                      <span style="margin-right: 5px;">
                                        <b>{{item.cprsA.ndd.cpr}}</b>
                                      </span>
                                      <v-btn icon
                                        @click="print(item.cprsA.ndd)">
                                        <v-icon>mdi-printer</v-icon>
                                      </v-btn>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>

                            <v-row v-if="item.cprsB.pedido" class="pt-0 mt-0 pb-2">
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2">
                                    <div
                                      v-if="item.cprsB.pedido" class=" text-center pt-1 pb-1">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            outlined fab x-small
                                            :disabled="tieneAsociado(item,'nddB')||viajeEnReparto()"
                                            :color="temas.barra_lateral_bg"
                                            class="mr-0 ml-0 pl-0"
                                            @click="cprDesdeAdminDePedidos(item,'NDD','DIV')" v-on="on">
                                            <v-icon>mdi-file</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Aplicar NDD</span>
                                      </v-tooltip>
                                    </div>
                                    <div class="fg85"
                                      v-else>
                                      <span style="margin-right: 5px;">
                                        <b>{{item.cprsB.pedido?item.cprsB.ndd.cpr:''}}</b>
                                      </span>
                                      <span :style="{ color: 'green' }">
                                        ${{kit.redondear(item.cprsB.pedido?item.cprsB.ndd.total:0,2,2)}}
                                      </span>
                                      <v-btn icon
                                        @click="print(item.cprsB.ndd)">
                                        <v-icon>mdi-printer</v-icon>
                                      </v-btn>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>

                          <!-- CPR/BOTON NDC -->
                          <template v-slot:item.cprsA.ndc.cpr="{ item }">
                            <v-row>
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2">
                                    <div v-if="item.cprsA.ndc.cpr=='?'"
                                      class=" text-center pt-1 pb-1">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn class="mr-0 ml-0 pl-0"
                                            outlined fab x-small
                                            :disabled="tieneAsociado(item,'ndc')||viajeEnReparto()"
                                            :color="temas.barra_lateral_bg"
                                            @click="cprDesdeAdminDePedidos(item,'NDC','NODIV')" v-on="on">
                                            <v-icon>mdi-file-document</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Aplicar NDC</span>
                                      </v-tooltip>
                                    </div>
                                    <div v-else>
                                      <span style="margin-right: 5px;">
                                        <b>{{item.cprsA.ndc.cpr}}</b>
                                      </span>
                                      <span :style="{ color: 'green' }">
                                        ${{kit.redondear(item.cprsA.ndc.total,2,2)}}
                                      </span>
                                      <v-btn icon
                                        @click="print(item.cprsA.ndc)">
                                        <v-icon>mdi-printer</v-icon>
                                      </v-btn>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                            <v-row v-if="item.cprsB.pedido" class="pt-0 mt-0 pb-2">
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2">
                                    <div v-if="item.cprsB.ndc.cpr=='?'"
                                      class=" text-center pt-1 pb-1">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn class="mr-0 ml-0 pl-0"
                                            outlined fab x-small
                                            :disabled="tieneAsociado(item,'ndcB')||viajeEnReparto()"
                                            :color="temas.barra_lateral_bg"
                                            @click="cprDesdeAdminDePedidos(item,'NDC','DIV')" v-on="on">
                                            <v-icon>mdi-file</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Aplicar NDC</span>
                                      </v-tooltip>
                                    </div>
                                    <div v-else>
                                      <span style="margin-right: 5px;">
                                        <b>{{item.cprsB.pedido?item.cprsB.ndc.cpr:''}}</b>
                                      </span>
                                      <span :style="{ color: 'green' }">
                                        ${{kit.redondear(item.cprsB.pedido?item.cprsB.ndc.total:0,2,2)}}
                                      </span>
                                      <v-btn icon
                                        @click="print(item.cprsB.ndc)">
                                        <v-icon>mdi-printer</v-icon>
                                      </v-btn>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>

                          <!-- CPR/BOTON REMITO -->
                          <template v-slot:item.remito.cpr="{ item }">
                            <v-row>
                              <v-col cols="12">
                                <v-card flat>
                                  <v-card-text class="pt-0 pb-0 pr-2 pl-2">
                                    <div v-if="item.remito.cpr=='PENDIENTE'" class=" text-center pt-1 pb-1">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn class="mr-0 ml-0 pl-0"
                                            outlined fab x-small
                                            :disabled="tieneAsociado(item,'remito')||viajeEnReparto()"
                                            :color="temas.barra_lateral_bg"
                                            @click="cprDesdeAdminDePedidos(item,'REM','NODIV')" v-on="on">
                                            <v-icon>mdi-file-document</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Aplicar Remito</span>
                                      </v-tooltip>
                                    </div>
                                    <div v-else>
                                      <span style="margin-right: 5px;">
                                        <b>{{item.remito.cpr}}</b>
                                      </span>
                                      <v-btn icon
                                        @click="print(item.remito)">
                                        <v-icon>mdi-printer</v-icon>
                                      </v-btn>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>

                          <!-- CPR RECIBO -->
                          <template v-slot:item.cprsA.recibo.cpr="{ item }">
                            <v-row class="pt-0 pb-0">
                              <v-col cols="12">
                                <v-row v-if="item.cprsA.pedido">
                                  <v-col cols="12">
                                    <v-card flat class="pt-0 mt-0">
                                      <v-card-text v-for="(r, idx) in item.cprsA.recibo" v-bind:key="idx"
                                        class="pt-0 pb-0 pr-2 pl-2">
                                        <div class="fg" :color="temas.forms_btn_xls_bg">
                                          <div class="width:300px">
                                            <span class="izq pr-2 pt-1 mt-1"><b>{{r.cpr}}</b></span>
                                            <v-btn icon
                                              @click="print(r)">
                                              <v-icon>mdi-printer</v-icon>
                                            </v-btn>
                                            <span class="der pt-1 mt-1" :style="{ color: (
                                              roundTo(item.cprsA.factura.total+item.cprsA.ndd.total+item.cprsA.ndc.total,2)!=
                                              r.total)?'red':'green' }">
                                              ${{kit.redondear(r.total,2,2)}}
                                            </span><br>
                                          </div>
                                        </div>
                                      </v-card-text>
                                      <v-card-text v-if="faltanRecibos(item,'A')&&viajeEnReparto()">
                                        <div class=" text-center pt-0 pb-0">
                                          <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                              <v-btn class="mr-0 ml-0 pl-0"
                                                outlined fab x-small
                                                :color="temas.barra_lateral_bg"
                                                @click="cprDesdeAdminDePedidos(item,'REC','NODIV')" v-on="on">
                                                <v-icon>mdi-file-document</v-icon>
                                              </v-btn>
                                            </template>
                                            <span>Aplicar Recibo</span>
                                          </v-tooltip>
                                        </div>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>
                                </v-row>

                                <v-row v-if="item.cprsB.pedido" class="pt-0 mt-0 pb-2">
                                  <v-col cols="12">
                                    <v-card flat class="pt-0 mt-0">
                                      <v-card-text v-for="(r, idx) in item.cprsB.recibo" v-bind:key="idx"
                                        class="pt-0 pb-0 pr-2 pl-2">
                                        <div class="fg" :color="temas.forms_btn_xls_bg">
                                          <div class="width:300px">
                                            <span class="izq pr-2 pt-1 mt-1"><b>{{r.cpr}}</b></span>
                                            <v-btn icon
                                              @click="print(r)">
                                              <v-icon>mdi-printer</v-icon>
                                            </v-btn>
                                            <span class="der pt-1 mt-1" :style="{ color: (
                                              roundTo(item.cprsB.factura.total+item.cprsB.ndd.total+item.cprsB.ndc.total,2)!=
                                              r.total)?'red':'green' }">
                                              ${{kit.redondear(r.total,2,2)}}
                                            </span><br>
                                          </div>
                                        </div>
                                      </v-card-text>
                                      <v-card-text v-if="faltanRecibos(item,'B')&&viajeEnReparto()">
                                        <div class=" text-center pt-0 pb-0">
                                          <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                              <v-btn class="mr-0 ml-0 pl-0"
                                                outlined fab x-small
                                                :color="temas.barra_lateral_bg"
                                                @click="cprDesdeAdminDePedidos(item,'REC','DIV')" v-on="on">
                                                <v-icon>mdi-file-document</v-icon>
                                              </v-btn>
                                            </template>
                                            <span>Aplicar Recibo</span>
                                          </v-tooltip>
                                        </div>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>
                                </v-row>

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

            <!-- ARTICULOS DEL PEDIDO -->
            <v-dialog v-model="dialogPedidoArticulos" max-width="1200px">
              <template v-slot:activator="{}"></template>
              <v-card class="fg" height="700px">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogPedidoArticulos=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    Artículos del Pedido {{itemActualPedido!=null?itemActualPedido.cpr:''}}
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
            <!-- FIN ARTICULOS DEL PEDIDO -->

            <!-- ANULAR PEDIDO -->
            <v-dialog v-model="dialogAnularPedido" max-width="700px">
              <template v-slot:activator="{}"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogAnularPedido=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    Anular Pedido de {{itemActual.tercero.nombre}}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text" @click="anularPedidoHTTP()">
                    Confirmar
                  </v-btn>
                </v-toolbar>
                <v-form ref="anuped">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="pt-0">
                          <span><b> Pedido {{itemActual.cpr}}</b></span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            v-model="motivoAnularPedido"
                            :color="temas.forms_titulo_bg"
                            autofocus label="Motivo de la Anulación" auto-grow
                            outlined rows="4" row-height="25" shaped>
                          </v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN ANULAR PEDIDO -->

            <!--REMITO DE UNA FACTURA -->
            <v-dialog v-model="dialogRem" max-width="800px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogRem=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Remito de una Factura: {{editado.cpr}}
                </span>
                <v-spacer></v-spacer>
                <v-btn v-if="!yaEnviado"
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  class="ma-2 white--text"
                  @click="guardarRem()">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="4" sx="4" mx="4" class="body-2">
                          <v-switch
                            autofocus
                            :color="temas.forms_titulo_bg"
                            label="Remito Valorizado"
                            v-model="remitoValorizado">
                          </v-switch>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            label="TOTAL DEL COMRPOBANTE"
                            disabled
                            v-model="editado.total">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            label="CTT DEL ARTICULOS"
                            disabled
                            v-model="remitoItems">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea
                          v-model="remitoTexto"
                          :color="temas.forms_titulo_bg"
                          autofocus
                          label="Texto del Remito"
                          auto-grow outlined rows="4"
                          row-height="25"
                          shaped>
                        </v-textarea>
                      </v-col>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE REMITO DE UNA FACTURA -->

            <!-- DIALOG DE REMITO PARA VARIAS FACTURAS  -->
            <v-dialog v-model="dialogSelFacturas" max-width="700px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogSelFacturas=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - FACTURAS A INCLUIR EN EL REMITO
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="selected.length>0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="confirmarFacturasSeleccionadas">
                  Confirmar Selección
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                       <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <v-data-table
                              v-model="selected"
                              :headers="headersSelFacturas"
                              :items="facturas"
                              @toggle-select-all="selectAll"
                              :single-select="false"
                              item-key="cpr"
                              show-select  dense
                              class="pl-1 pr-3 elevation-1 pt-2"
                              :footer-props="footerProps10">
                              <template v-slot:item.total="{ item }">
                                <span>$ {{ formatoImporte(item.total) }}</span>
                              </template>
                              <template v-slot:item.fecha="{ item }">
                                <span>{{ formatoFecha(item.fecha) }}</span>
                              </template>
                            </v-data-table>
                          </v-form>
                        </v-col>
                      </v-row>
                     </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG DE REMITO PARA VARIAS FACTURAS  -->

            <!-- DIALOG VER MALETINES -->
            <v-dialog v-model="dialogVerSelMaletines" max-width="1000px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogVerSelMaletines=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="pl-3 text--right">
                  Maletines pendientes de Recibos
                </span>
              </v-toolbar>

              <v-card class="fg">
                <v-form ref="art4">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" class="fg" v-if="verOSelMaletines=='V'">
                        <span>Se deben realizar Recibos por los maletines detallados en la grilla.</span>
                      </v-col>
                      <v-col v-else>
                        <span>Selecciona el Maletin sobre el cual hacer el Recibo.</span>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12" class="fg">
                        <v-form ref="art">
                          <v-data-table
                            :headers="headersMaletines"
                            :items="maletines"
                            @click:row="selMaletinClick"
                            dense
                            class="pl-1 pr-3 elevation-0 pt-2"
                            :footer-props="footerProps10">
                            <template v-slot:item.importe="{ item }">
                              <span>$ {{ formatoImporte(item.importe) }}</span>
                            </template>
                          </v-data-table>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG VER MALETINES -->

            <!-- DIALOG DE TURNOS A FACTURAR -->
            <v-dialog v-model="dialogSelTurnos" max-width="1100px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogSelTurnos=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - TURNOS A FACTURAR
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="selected.length>0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="confirmarTurnosSeleccionados">
                  Confirmar Selección
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                       <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <v-data-table
                              v-model="selected"
                              :headers="headersSelTurnos"
                              :items="turnosFacturar"
                              @toggle-select-all="selectAllTurnos"
                              :single-select="false"
                              item-key="fecha"
                              show-select  dense
                              class="pl-1 pr-3 elevation-1 pt-2"
                              :footer-props="footerProps10">
                              <template v-slot:item.precio="{ item }">
                                <span>$ {{ formatoImporteDec(item.precio,3) }}</span>
                              </template>
                            </v-data-table>
                          </v-form>
                        </v-col>
                      </v-row>
                     </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG DE REMITO PARA VARIAS FACTURAS  -->

            <!--NDC DE UNA FACTURA/PRESUPUESTO -->
            <v-dialog v-model="dialogNdcFac" max-width="1200px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarNdc"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - NDC s/ {{editado.cpr}} - ({{editado.nombre}})
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="ndcTotal>0"
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  class="ma-2 white--text"
                  @click="guardarNdc()">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-select
                            label='Motivo'
                            v-model='ndcMotivoSel'
                            autofocus
                            :color="temas.forms_titulo_bg"
                            :items='ndcMotivos' item-value='id' item-text='nombre'
                            @change="selMotivoNdc">
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-show="ndcMotivoSel==1"
                            :color="temas.forms_titulo_bg"
                            v-model="ndcTasaDescuento"
                            @change="calculosNdc(1)"
                            label="%Desc.">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            v-show="ndcMotivoSel==1 || ndcMotivoSel==2"
                            :color="temas.forms_titulo_bg"
                            v-model="ndcTotal"
                            @change="calculosNdc(2)"
                            label="Total NDC">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            label="TOTAL DEL COMPROBANTE"
                            disabled
                            v-model="editado.total">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!--// PROCESAMIENTO DE DEVOLUCION DE ARTICULOS EN NDC // -->
                      <v-row v-show="dialogNdcxDev==true">
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <span dense class="headline">Items a Devolver</span>
                            <v-data-table
                              :headers="headersNdcxDev"
                              :items="articulos"
                              dense
                              class="elevation-3"
                              hide-default-footer>

                              <template v-slot:item.accion="{ item }">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      fab x-small
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      class="mr-2"
                                      @click="sumarRestarNdcDev(item, 1)" v-on="on">
                                      <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Sumar</span>
                                </v-tooltip>

                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      fab x-small
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      class="mr-2"
                                      @click="sumarRestarNdcDev(item, -1)" v-on="on">
                                      <v-icon>mdi-minus</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Restar</span>
                                </v-tooltip>

                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      fab x-small
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      class="mr-2"
                                      @click="sumarRestarNdcDev(item, 999999)" v-on="on">
                                      <v-icon>mdi-checkbox-blank-circle</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Devolver todo</span>
                                </v-tooltip>
                              </template>

                            </v-data-table>
                          </v-form>
                        </v-col>
                      </v-row>
                      <!--// FIN DEL PROCESAMIENTO DE DEVOLUCION DE ARTICULOS EN NDC // -->

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE NDC DE UNA FACTURA -->

            <!--NDD DE UNA FACTURA -->
            <v-dialog v-model="dialogNddFac" max-width="1200px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarNdd"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - NDD s/ {{editado.cpr}} - ({{editado.nombre}})
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  v-show="nddTotal>0 || selected.length>0"
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  class="ma-2 white--text"
                  @click="guardarNdd()">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-select
                            label='Motivo'
                            v-model='nddMotivoSel'
                            autofocus
                            :color="temas.forms_titulo_bg"
                            :items='nddMotivos' item-value='id' item-text='nombre'
                            @change="selMotivoNdd">
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-show="nddMotivoSel==2"
                            :color="temas.forms_titulo_bg"
                            v-model="nddTasaDescuento"
                            @change="calculosNdd(1)"
                            label="% del Total">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            v-show="ndcMotivoSel==1 || ndcMotivoSel==2"
                            :color="temas.forms_titulo_bg"
                            v-model="nddTotal"
                            @change="calculosNdd(2)"
                            label="Total NDD">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            label="TOTAL DEL COMPROBANTE"
                            disabled
                            v-model="editado.total">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!--// PROCESAMIENTO DE DEVOLUCION DE CHEQUES EN NDD // -->
                      <v-row v-show="dialogNddxDev==true">
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <span class="font-weight-medium">
                              Cheques a Devolver
                            </span>
                            <v-data-table
                              v-model="selected"
                              :headers="headersNddxDev"
                              :items="cheques"
                              @toggle-select-all="selectAllChq"
                              :single-select="false"
                              item-key="cpr"
                              show-select dense
                              class="pl-1 pr-3 elevation-1 pt-2"
                              :footer-props="footerProps"
                              @item-selected="clickRow">
                              <template v-slot:item.importe="{ item }">
                                <span>${{ formatoImporte(item.importe) }}</span>
                              </template>
                              <template v-slot:item.fechafinanciera="{ item }">
                                <span>{{ formatoFechaCorta(item.fechafinanciera) }}</span>
                              </template>
                              <template v-slot:item.seleccionado="{ item }">
                                <v-chip fab
                                  :color="getColor(item.seleccionado)"
                                  dark>{{item.seleccionado?'Sí':'No'}}
                                </v-chip>
                              </template>
                            </v-data-table>

                          </v-form>
                        </v-col>
                      </v-row>
                      <!--// FIN DEL PROCESAMIENTO DE DEVOLUCION DE ARTICULOS EN NDC // -->

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE NDD DE UNA FACTURA -->

            <!--RECIBO -->
            <v-dialog v-model="dialogRec" max-width="1300px" persistent>
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogRec=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="fg pl-2 headdline">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                <v-btn v-if="cprBalanceado() && !yaEnviado"
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  @click="confirmarValores()">
                  Confirmar Recibo
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="pend">
                  <v-card-text>
                    <!-- PIDO CLIENTE -->
                    <v-row>
                      <v-col v-show="basadoEnCpr==false" cols="6" sx="6" mx="6" class="pl-4">
                        <v-autocomplete
                          ref="clienterecibo"
                          v-model="editado.tercero_id"
                          :items="itemsTerceros"
                          :loading="isLoadingTercerosRec"
                          :search-input.sync="searchTercerosRec"
                          item-text="nombre"
                          item-value="id"
                          :color="temas.forms_titulo_bg"
                          autofocus
                          label="Nombre del Cliente"
                          placeholder="Escriba para buscar"
                          prepend-icon="mdi-database-search"
                          auto-select-first
                          :disabled="editedIndex!=-1"
                          v-on:keydown.tab="buscoSiElTerceroEstaVinculado">
                        </v-autocomplete>
                      </v-col>
                      <v-col v-show="basadoEnCpr==true" cols="6" sm="6" md="6" class="pl-4">
                        <v-text-field
                          disabled
                          v-model="editado.nombre"
                          label="Cliente">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field
                          :disabled="hayMaletin()"
                          v-model="editado.total"
                          :color="temas.forms_titulo_bg"
                          label="Total Recibo"
                          @change="calculosMed">
                        </v-text-field>
                      </v-col>
                      <v-col cols="3" class="pt-6 pl-6">
                        <v-btn v-show="pend.length>0&&!hayMaletin()"
                          :color="temas.forms_titulo_bg"
                          :dark="temas.cen_btns_dark==true"
                          outlined
                          @click="automaticoPend()">
                          Selección Automática
                        </v-btn>
                      </v-col>
                    </v-row>
                    <!-- FIN PIDO CLIENTE -->

                    <div v-if="hayMaletin()" class="fg mb-5">
                      <span>
                        <b>¡Recibo por Maletín! ({{ maletinesCli.length>0?maletinesCli[0].username:''}})
                          <i>Selecciona los valores EN ROJO recaudados para ir armando el Recibo.</i></b>
                        <br>
                        <v-chip class="mt-2" color='green' dark>
                          {{ maletinesCli.length==1?'1 Maletín Pendiente':maletinesCli.length+' Maletines Pendientes'}}
                        </v-chip>
                        <v-chip
                          class="mt-2 ml-2" :color="colorChipMaletin(idx)" dark
                          @click="clickChipMaletin(idx)"
                          v-for="(mp, idx) in maletinesCli" v-bind:key="idx">
                            {{ mp.medpagnom }}
                            {{'\xa0'}}${{ formatoImporte(mp.importe) }}
                        </v-chip>
                      </span>
                    </div>

                    <!-- PENDIENTES PARA CANCELAR -->
                    <v-row>
                      <v-col cols="12" sx="12" mx="12">
                        <v-data-table
                          :headers="headersPend"
                          :items="pend"
                          dense
                          class="elevation-3">
                          <template v-slot:top>

                            <!-- A CANCELAR -->
                            <v-dialog v-model="dialogPend" max-width="300px">

                              <template v-slot:activator="{}"></template>
                              <v-toolbar flat
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true">
                                <v-btn
                                  icon @click="cancelarPend"
                                  :color="temas.forms_close_bg"
                                  :dark="temas.forms_close_dark==true">
                                  <v-icon>mdi-arrow-left-circle</v-icon>
                                </v-btn>
                                <span class="text--right">
                                  A Cancelar
                                </span>
                                <v-spacer></v-spacer>
                                <v-btn v-if="editadoPend.acancelar<=itemActualPend.pendiente"
                                  :color="temas.barra_principal_bg"
                                  :dark="temas.barra_principal_dark"
                                  @click="guardarPend(editadoPend)">
                                  Aceptar
                                </v-btn>
                              </v-toolbar>

                              <template v-slot:activator="{}">
                                <v-btn small
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true">
                                  Pendientes
                                </v-btn>
                              </template>

                              <v-card>
                                <v-card-text>
                                  <v-container>
                                    <v-row>
                                      <v-col cols="12" sm="12" md="12">
                                        <v-text-field
                                          autofocus
                                          :color="temas.forms_titulo_bg"
                                          v-model="editadoPend.acancelar"
                                          label="A Cancelar">
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-container>
                                </v-card-text>
                              </v-card>
                            </v-dialog>
                            <!-- FIN A CAMCELAR -->
                          </template>

                          <template v-slot:item.cpr="{ item }">
                            <span class="fg">{{ item.cpr }}</span>
                          </template>
                          <template v-slot:item.vencimiento="{ item }">
                            <span class="fg">{{ formatoFecha(item.vencimiento) }}</span>
                          </template>
                          <template v-slot:item.importe="{ item }">
                            <span class="fg">${{ formatoImporte(item.importe) }}</span>
                          </template>
                          <template v-slot:item.pendiente="{ item }">
                            <span class="fg">${{ formatoImporte(item.pendiente) }}</span>
                          </template>
                          <template v-slot:item.acancelar="{ item }">
                            <span class="fg"><b>${{ formatoImporte(item.acancelar) }}</b></span>
                          </template>

                          <template v-slot:item.accion="{item}">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn v-show="!hayMaletin()"
                                  fab x-small class="mr-2"
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  @click="editarPend(item)" v-on="on">
                                  <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                              </template>
                              <span>Editar</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn v-show="reciboDeUnSoloComprobante==false&&!hayMaletin()"
                                  fab x-small class="mr-2"
                                  :color="item.acancelar==0?temas.cen_btns_bg:temas.cen_card_activo_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  @click="selectPend(item)" v-on="on">
                                  <v-icon>mdi-checkbox-marked-outline</v-icon>
                                </v-btn>
                              </template>
                              <span>Seleccionar</span>
                            </v-tooltip>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                    <!-- FIN DE PENDIENTES A CANCELAR -->

                    <!-- MUESTRO TOTAL A COBRAR, SOLO FAC/NDD/NDC -->
                    <v-row v-if="comoPaga=='2'">
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field
                          disabled
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true"
                          v-model="editado.total"
                          label="TOTAL A COBRAR">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <!-- FIN DE MEDIOS DE PAGO SELECCION -->

                    <!-- MEDIOS DE PAGO SELECCION -->
                    <!--
                    <v-row class="pl-2 pb-0">
                      <v-col cols="1">
                        <v-switch class="pt-1 pb-2"
                          label="Vuelto"
                          v-model="vuelto"
                          :color="temas.forms_titulo_bg">
                        </v-switch>
                      </v-col>
                      <v-col cols="11" class="pl-8">
                        <v-radio-group v-model="medioDePagoId" row>
                          <v-radio v-for="item in medpag"
                            :key="item.id" dense :value="item.id"
                            :label="item.nombre"
                            v-show="item.activo==true"
                            :color="temas.forms_titulo_bg"
                            @click="setFP(item.id, null)">
                          </v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    -->

                    <v-row v-if="!hayMaletin()" class="pl-2 pb-0">
                      <v-col cols="1">
                        <v-switch class="pt-1 pb-2"
                          label="Vuelto"
                          v-model="vuelto"
                          :color="temas.forms_titulo_bg">
                        </v-switch>
                      </v-col>
                      <v-col cols="11" class="pl-8">
                        <v-radio-group v-model="medioDePagoId" row>
                          <v-radio v-for="item in medpag"
                            :key="item.id" dense :value="item.id"
                            :label="item.nombre"
                            v-show="item.activo==true"
                            :color="temas.forms_titulo_bg"
                            @click="setFP(item.id, null)">
                          </v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <!-- FIN DE MEDIOS DE PAGO SELECCION -->

                    <!--// DIALOGO INGRESO DE VALORES QUE ENTRAN EN EL RECIBO// -->
                    <v-row class="mt-0 pt-0">
                      <v-col cols="12" sx="12" mx="12">
                        <v-data-table
                          :headers="headersMed"
                          :items="valores"
                          dense
                          class="elevation-3"
                          hide-default-footer>
                          <template v-slot:top>

                            <v-dialog v-model="dialogMed" :max-width="medpagwidth"> <!--1100">-->
                              <v-card>
                                <v-toolbar flat
                                  :color="temas.forms_titulo_bg"
                                  :dark="temas.forms_titulo_dark==true">
                                  <v-btn
                                    icon @click="dialogMed=false"
                                    :color="temas.forms_close_bg"
                                    :dark="temas.forms_close_dark==true">
                                    <v-icon>mdi-arrow-left-circle</v-icon>
                                  </v-btn>
                                  <span class="headdline">{{ medioDePagoNombre }}</span>
                                  <v-spacer></v-spacer>
                                    <v-btn v-if="medioDePagoOk"
                                    @click="guardarMed(editadoMed)"
                                    :color="temas.barra_principal_bg"
                                    :dark="temas.barra_principal_dark">
                                    Guardar
                                  </v-btn>
                                </v-toolbar>

                                <v-card-text>
                                  <v-container>
                                    <!-- GRILLA DE CHEQUES DE TERCERO -->
                                    <v-row v-show="habinhab('cheque de tercero')">
                                      <v-col cols="2" sm="2" md="2">
                                        <v-text-field
                                          ref="cuit"
                                          v-model="editadoMed.cuit"
                                          label="CUIT del Cheque"
                                          autofocus
                                          required
                                          :color="temas.forms_titulo_bg"
                                          :rules="cuitRules"
                                          :counter="11"
                                          :maxlength="11"
                                          @change="buscoCuentasDelCuit"
                                          @blur="elValorEstaOk()">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="3" sm="3" md="3">
                                        <v-switch
                                          label="Propio del Cliente"
                                          v-model="editadoMed.propiodelcliente"
                                          :color="temas.forms_titulo_bg"
                                          @change="propiodelcliente">
                                        </v-switch>
                                      </v-col>
                                      <v-col cols="3" sm="3" md="3">
                                        <v-combobox
                                          ref="cuenta"
                                          v-model="editadoMed.cuenta"
                                          :items="cueItems"
                                          hint="Cuenta del Cheque"
                                          label="Cuenta"
                                          :color="temas.forms_titulo_bg"
                                          @change="buscoCuentaBanco"
                                          v-on:keydown.tab="buscoCuentaBanco"
                                          @blur="elValorEstaOk()">
                                        </v-combobox>
                                      </v-col>
                                      <v-col cols="4" sm="4" md="4">
                                        <v-autocomplete
                                          v-model="editadoMed.banco_id"
                                          :items="itemsBancos"
                                          :loading="isLoadingBancos"
                                          :search-input.sync="searchBancos"
                                          :color="temas.forms_titulo_bg"
                                          item-text="nombre"
                                          item-value="id"
                                          label="Banco"
                                          placeholder="Escriba para buscar"
                                          prepend-icon="mdi-database-search"
                                          v-on:keydown.tab="buscoSiElTerceroEstaVinculado"
                                          @blur="elValorEstaOk()">
                                        </v-autocomplete>
                                      </v-col>
                                    </v-row>

                                    <v-row v-show="habinhab('cheque de tercero')">
                                      <v-col cols="6" sm="6" md="6">
                                        <v-text-field
                                          v-model="editadoMed.nombre"
                                          label="Nombre del Titular"
                                          :color="temas.forms_titulo_bg"
                                          disabled
                                          required
                                          :counter="30"
                                          :maxlength="30"
                                          @blur="elValorEstaOk()">
                                        </v-text-field>
                                      </v-col>

                                      <v-col cols="2" sm="2" md="2">
                                        <v-switch
                                          label="eCheq"
                                          v-model="editadoMed.echeq"
                                          :color="temas.forms_titulo_bg">
                                        </v-switch>
                                      </v-col>

                                      <v-col cols="2" sm="2" md="2">
                                        <v-text-field
                                          ref="numerodecheque"
                                          v-model="editadoMed.nrovalor"
                                          label="Número de Cheque"
                                          :color="temas.forms_titulo_bg"
                                          required
                                          :counter="15"
                                          :maxlength="15"
                                          v-on:keydown.tab="buscoCheque"
                                          @blur="elValorEstaOk()">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="2" sm="2" md="2">
                                        <v-badge
                                          :content="diasDelCheque"
                                          :color="temas.forms_btn_add_bg"
                                          :dark="temas.forms_btn_add_bg==true" left>
                                          <v-text-field
                                            type="date"
                                            v-model="editadoMed.fechafinanciera"
                                            :color="temas.forms_titulo_bg"
                                            label="Fecha del Cheque"
                                            @blur="elValorEstaOk()">
                                          </v-text-field>
                                        </v-badge>
                                      </v-col>
                                    </v-row>

                                    <!-- TARJETA -->
                                    <v-row v-show="habinhab('tarjeta')">
                                      <v-col cols="12" sm="12" md="12">
                                        <v-select
                                          label='Medio de Cobro'
                                          :color="temas.forms_titulo_bg"
                                          v-model="editadoMed.id"
                                          :items="mediosFiltrado"
                                          item-value="id"
                                          :item-text="medios=> sayTarjeta(medios)"
                                          @change="calculoMedioCobro"
                                          @blur="elValorEstaOk()">
                                        </v-select>
                                      </v-col>
                                    </v-row>
                                    <v-row v-show="habinhab('tarjeta')">
                                      <v-col cols="1" sm="1" md="1">
                                        <v-text-field
                                          v-model="editadoMed.nrovalor"
                                          :color="temas.forms_titulo_bg"
                                          label="Cupón"
                                          @blur="elValorEstaOk()">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="1" sm="1" md="1">
                                        <v-text-field
                                          v-model="editadoMed.cuotas"
                                          :color="temas.forms_titulo_bg"
                                          disabled
                                          label="Cuotas">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="1" sm="1" md="1">
                                        <v-text-field
                                          v-model="editadoMed.interes"
                                          :color="temas.forms_titulo_bg"
                                          disabled
                                          label="%Interes">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="1" sm="1" md="1">
                                        <v-text-field
                                          v-model="editadoMed.recargo"
                                          :color="temas.forms_titulo_bg"
                                          disabled
                                          label="%Recargo">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="2" sm="2" md="2">
                                        <v-text-field
                                          v-model="editadoMed.importecuotas"
                                          :color="temas.forms_titulo_bg"
                                          disabled
                                          label="Importe Cuota">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="2" sm="2" md="2">
                                        <v-text-field
                                          v-model="editadoMed.importe"
                                          :color="temas.forms_titulo_bg"
                                          disabled
                                          label="Importe Total">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="4" sm="4" md="4">
                                        <v-text-field
                                          v-model="editadoMed.nombrecuenta"
                                          :color="temas.forms_titulo_bg"
                                          disabled
                                          label="Cuenta">
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                    <!-- TRANSFERENCIA -->
                                    <v-row v-show="habinhab('transferencia')">
                                      <v-col cols="12" sm="12" md="12">
                                        <v-select
                                          label='Cuenta Destino'
                                          :color="temas.forms_titulo_bg"
                                          v-model="editadoMed.cuentadestino_id"
                                          :items="cueMiasItems"
                                          item-value="id"
                                          :item-text="cueMiasItems=>
                                            `
                                            ${cueMiasItems.banco} -Cuenta:
                                            ${cueMiasItems.cuenta} -
                                            ${cueMiasItems.nombre}
                                            `"
                                          @blur="elValorEstaOk()">
                                        </v-select>
                                      </v-col>
                                    </v-row>
                                    <v-row>
                                      <v-col cols="5" sm="5" md="5">
                                        <v-text-field
                                          v-model="editadoMed.importe"
                                          :color="temas.forms_titulo_bg"
                                          :disabled="hayMaletin()"
                                          label="Importe"
                                          @blur="elValorEstaOk()">
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                    <!-- FIN DE LA TRANSFERENCIA -->
                                  </v-container>
                                </v-card-text>
                              </v-card>
                            </v-dialog>
                          </template>

                          <template v-slot:item.vuelto="{item}">
                            <span>{{ item.vuelto?'Sí':'No' }}</span>
                          </template>
                          <template v-slot:item.activo="{ item }">
                            <v-chip
                              :color="getColor(item.activo)"
                              dark>{{item.activo?'Sí':'No'}}
                            </v-chip>
                          </template>
                          <template v-slot:item.accion="{item}">

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab x-small
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  class="mr-2"
                                  @click="agregarMismoMed(item)" v-on="on">
                                  <v-icon>mdi-plus</v-icon>
                                </v-btn>
                              </template>
                              <span>Agregar mismo tipo de valor</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab x-small
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  class="mr-2"
                                  @click="editarMed(item)" v-on="on">
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
                                  class="mr-2"
                                  @click="borrarMed(item)" v-on="on">
                                  <v-icon>mdi-delete</v-icon>
                                </v-btn>
                              </template>
                              <span>Borrar</span>
                            </v-tooltip>

                          </template>

                          <template v-slot:item.importe="{ item }">
                            <span>${{ formatoImporte(item.importe) }}</span>
                          </template>

                        </v-data-table>
                      </v-col>
                    </v-row>
                    <!-- FIN DIALOGO INGRESO DE VALORES -->

                    <!-- PIE CON TOTALES -->
                    <v-row>
                      <v-col cols="12" sx="12" mx="12">
                        <v-row>
                          <v-col cols="6" sm="6" md="6">
                            BALANCE DEL RECIBO
                            <v-chip>
                              {{ balanceDelPago }}
                            </v-chip>
                          </v-col>
                          <v-col cols="2" sm="2" md="2">
                            <v-text-field v-show="editado.cpr=='REC'"
                              disabled dense outlined
                              v-model="totCancelado"
                              label="Cancelado">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2">
                            <v-text-field
                              disabled dense outlined
                              v-model="totValores"
                              label="Valores">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2">
                            <v-text-field
                              disabled dense outlined
                              v-model="valDiferencia"
                              label="Diferencia">
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <!-- PIE CON TOTALES -->
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEL RECIBO -->

            <!--RETIROS DE MERCADERIA A FACTURAR -->
            <v-dialog v-model="dialogRetiroMerc" max-width="1000px" persistent>
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogRetiroMerc=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="fg pl-2 headdline">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                <v-btn v-if="editado.tercero_id!=''&&articulos.length>0 && !yaEnviado"
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  @click="confirmarRetiroDeMercaderia()">
                  Confirmar Retiro
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="pend">
                  <v-card-text>
                    <v-container>

                      <!-- PIDO CLIENTE -->
                      <v-row>
                        <v-col cols="6" sx="6" mx="6">
                          <v-autocomplete
                            ref="clienteretiro"
                            v-model="editado.tercero_id"
                            :disabled="editedIndexRetiroMer!=-1"
                            :items="itemsTerceros"
                            :loading="isLoadingTercerosRetirosMerc"
                            :search-input.sync="searchTercerosRetirosMerc"
                            :color="temas.forms_titulo_bg"
                            item-text="nombre"
                            item-value="id"
                            autofocus
                            label="Cliente"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <!-- FIN PIDO CLIENTE -->

                      <!-- ITEMS DEL COMPROBANTE -->
                      <span dense class="fg150b">Items</span>
                      <v-row>
                        <v-col cols="2" class="mt-3 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Código"
                            class="fg text-input-blue"
                            :disabled="editedIndexArt>-1"
                            hint="Código, Desc, TEXTO"
                            :color="temas.forms_titulo_bg"
                            ref="buscar"
                            autofocus
                            v-model="busArt"
                            @keyup.esc="cancelaLinea()"
                            @focus="$event.target.select()"
                            @blur="buscarArt(false)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="8" class="fg mt-3 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Descripción"
                            disabled
                            :color="temas.forms_titulo_bg"
                            v-model="editadoArt.nombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" class="mt-0 pt-3 pl-1 pr-0">
                          <v-badge
                            :content="editadoArtStock(editadoArt.stock)"
                            :color="temas.forms_btn_add_bg"
                            :dark="temas.forms_btn_add_bg==true" left>
                            <v-text-field
                              filled dense label="Cantidad" class="fg"
                              :color="temas.forms_titulo_bg"
                              v-model.number="editadoArt.cantidad"
                              ref="cantidad"
                              @change="cantidadItem()"
                              @blur="guardarItem('codigo')"
                              @focus="$event.target.select()"
                              @keyup.esc="cancelaLinea()">
                            </v-text-field>
                          </v-badge>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col v-show="seleccionarArticulo == true"
                          cols="12" sm="12" md="12">
                          <v-data-table
                            :headers="headersSelArt"
                            :color="$store.state.temas.forms_titulo_bg"
                            :items="selArt" dense class="elevation-1"
                            single-select
                            @click:row="selArtClick"
                            :footer-props="footerProps10">
                            <template v-slot:item.precio="{ item }">
                              <span>${{ formatoImporteDec(item.precio,3) }}</span>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>

                      <!-- ARTIULOS A RETIRAR -->
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-data-table
                            :headers="headersRetirosMerc"
                            :color="$store.state.temas.forms_titulo_bg"
                            :items="articulos" dense class="elevation-3"
                            single-select
                            @click:row="selArtClick">
                            <template v-slot:top>
                            </template>
                            <template v-slot:item.cantidad="{ item }">
                              <span class="fg">{{ formatoImporte(item.cantidad) }}</span>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small class="mr-2"
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="borrarArt(item)" v-on="on">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- FIN DE ARTICULOS A RETIRAR -->

                      <!-- MUESTRO EL TOTAL DE RETIROS DE MERCADERIA -->
                      <v-row v-if="comoPaga=='2'">
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true"
                            v-model="editado.total"
                            label="TOTAL RETIROS">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE RETIROS DE MERCADERIA -->

            <!-- ERROR EN EL PEDIDO -->
            <v-dialog v-model="dialogError" max-width="1200px" persistent>
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar flat
                  :dark="temas.forms_titulo_dark==true"
                  :color="temas.forms_titulo_bg">
                  <v-btn
                    icon @click="cancelarSelArtPedErr"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">
                    OPPPS! HAY PROBLEMAS CON ESTE PEDIDO
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text"
                    @click="arreglarPedido">ARREGLAR PEDIDO
                  </v-btn>
                </v-toolbar>
                <div>
                  <v-card class="pl-2 pt-2 pb-2 contenedor-galeria-fuente-aviso-pedido">
                    <br>Hay datos inconsistentes en este pedido!<br><br>
                    El proveedor puede haber cambiado precios o varios clientes pueden
                    estar comprando al mismo tiempo disminuyendo asi el stock disponible.<br>
                    En la columna <b>Error</b> se detalla el tipo de problema. Seleccione
                    <b>Arreglar Pedido</b> para que el sistema realice las modificaciones
                    necesarias por Ud.<br>
                    IMPORTANTE: Seran eliminadas las promociones que esten pausadas, o sin
                    unidades disponibles.
                    <br><br>
                    <br>
                    Detalles de los errores
                  </v-card>
                  <v-data-table
                    :headers="headersSelArtPedErr"
                    :items="selArtPedErr"
                    dense
                    class="elevation-3 pl-0">
                    <template #item.nombre="{ value }">
                      <div class="text-truncate" style="max-width: 245px">
                        {{ value }}
                      </div>
                    </template>
                    <template v-slot:item.preped="{ item }">
                      <span>${{ formatoImporte(item.preped) }}</span>
                    </template>
                    <template v-slot:item.preact="{ item }">
                      <span>${{ formatoImporte(item.preact) }}</span>
                    </template>
                    <template v-slot:item.unped="{ item }">
                      <span>{{ formatoImporte(item.unped) }}</span>
                    </template>
                    <template v-slot:item.stock="{ item }">
                      <span>{{ formatoImporte(item.stock) }}</span>
                    </template>
                  </v-data-table>
                </div>
              </v-card>
            </v-dialog>
            <!-- FIN DEL ERROR EN EL PEDIDO -->
          </v-toolbar>

          <!-- BARRA DE BUSQUEDA -->
          <v-row class="pl-3 pb-1 pt-3">
            <v-col cols="3" sm="3">
              <v-text-field
                v-model="search" clearable
                append-icon="search"
                label="Buscar"
                :color="temas.forms_titulo_bg"
                class="pt-0"
                single-line hide-details>
              </v-text-field>
            </v-col>
            <v-col cols="9" sm="9">
              <span v-for="(fe, idx) in filtrosEstados" v-bind:key="idx">
                <v-badge
                  class="pt-1 pl-0 pr-0" overlap :content="fe.ctt"
                  :color="fe.tip==filtroEstadoSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                  :dark="fe.tip==filtroEstadoSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
                  rigth>
                  <v-chip
                    dense :value="fe" label
                    :color="fe.tip==filtroEstadoSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                    :dark="fe.tip==filtroEstadoSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
                    class="ml-2 fg85"
                    @click="setFiltroEstado(fe)">
                    {{ fe.tip }}
                  </v-chip>
                </v-badge>
              </span>
            </v-col>
          </v-row>

          <!-- FIN DE LA BARRA DE BUSQUEDA -->
        </template>
        <template v-slot:expanded-item="{ headers, item }"
          v-if="filtroComprobanteSel!='Viajes'">
          <td :colspan="headers.length">
            <v-data-table
              v-if="filtroComprobanteSel!='Recibos'"
              :headers="headersItems"
              :items="item.items"
              dense>
              <template v-slot:item.articulo.codigo="{ item }">
                <span class="fg">{{ item.articulo.codigo }}</span>
              </template>
              <template v-slot:item.articulo.nombre="{ item }">
                <span class="fg">
                  {{item.articulo.codigo=='1@1' ? item.texto : item.articulo.nombre }}
                </span>
              </template>
              <template v-slot:item.cantidad="{ item }">
                <span class="fg">{{ formatoImporte(item.cantidad) }}</span>
              </template>
              <template v-slot:item.precio="{ item }">
                <span class="fg">${{ formatoImporteDec(item.precio, 3) }}</span>
              </template>
              <template v-slot:item.tasadescuento="{ item }">
                <span class="fg">{{ formatoImporte(item.tasadescuento) }}</span>
              </template>
              <template v-slot:item.importedescuento="{ item }">
                <span class="fg">${{ formatoImporte(item.importedescuento) }}</span>
              </template>
              <template v-slot:item.total="{ item }">
                <span class="fg">${{ formatoImporte(item.total) }}</span>
              </template>
            </v-data-table>

            <v-data-table v-else
              :headers="headersCancelaciones"
              :items="item.cancelaciones"
              dense>
              <template v-slot:item.cancelado.comprobante.cpr="{ item }">
                <span class="fg">{{ item.cancelado.comprobante.cpr }}</span>
              </template>
              <template v-slot:item.concepto="{ item }">
                <span class="fg">{{ item.concepto }}</span>
              </template>
              <template v-slot:item.nombre="{ item }">
                <span class="fg">
                  {{ item.codigo=='1@1' ? item.texto : item.nombre }}
                </span>
              </template>
              <template v-slot:item.cancelado.comprobante.fecha="{ item }">
                <span class="fg">
                  {{ formatoFechaCorta(item.cancelado.comprobante.fecha) }}
                </span>
              </template>
              <template v-slot:item.importe="{ item }">
                <span class="fg">${{ formatoImporte(item.importe) }}</span>
              </template>
              <template v-slot:item.cancelado.pendiente="{ item }">
                <span class="fg">${{ formatoImporte(item.cancelado.pendiente) }}</span>
              </template>
            </v-data-table>

          </td>
        </template>
        <template v-slot:item.tercero.razon_social="{ item }">
          <span class="fg">
            {{item.tercero?item.tercero.razon_social.substring(0,23):null}}
          </span>
          <v-badge v-if="terceroUserDefined(item)"
            class="pt-1 pl-2"
            :content="marcaTercero(item,'m')"
            :color="marcaTercero(item,'c')"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>
        <template v-slot:item.user.tercero.razon_social="{ item }">
          <span class="fg">
            {{item.tercero?item.user.tercero.razon_social.substring(0,23):null}}
          </span>
          <v-badge v-if="item.user.tercero.user!=null"
            class="pt-1 pl-2"
            :content="marcaTercero(item.user,'m')"
            :color="marcaTercero(item.user,'c')"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>
        <template v-slot:item.fecha="{ item }">
          <span class="fg">{{ formatoFechaCorta(item.fecha) }}</span>
        </template>
        <template v-slot:item.cpr="{ item }">
          <span class="fg">{{ kit.cpr(item.cpr) }}</span>
          <v-badge v-if="item.observaciones=='PARTICIONADO'"
            class="pt-2"
            :content="'div'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
        </template>
        <template v-slot:item.rentabilidad="{ item }">
          <span class="fg">$ {{ formatoImporte(item.rentabilidad) }}</span>
        </template>
        <template v-slot:item.importedescuento="{ item }">
          <span class="fg">
            $ {{ formatoImporte(item.importedescuento) }}
          </span>
          <v-badge v-if="descuentoProbable(item)"
            class="pt-2"
            :content="descuentoProbable(item)"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
        </template>
        <template v-slot:item.total="{ item }">
          <v-tooltip v-if="sayMessage(item, true)" bottom color="blue">
            <template v-slot:activator="{ on, attrs }">
              <v-chip label outlined :color="getColorTotal(item)" v-on="on">
                <b class="fg">$ {{ formatoImporte(item.total) }}</b>
              </v-chip>
            </template>
            <span v-html="sayMessage(item, true)"></span>
          </v-tooltip>
          <v-chip v-else label outlined :color="getColorTotal(item)">
            <b class="fg">$ {{ formatoImporte(item.total) }}</b>
          </v-chip>
          <v-badge v-if="tieneRemito(item)"
            class="pt-2"
            :content="'r'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
          <v-badge v-if="item.cae"
            class="pt-2"
            :content="'e'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
        </template>
        <template v-slot:item.pendientes[0].pendiente="{ item }">
          <span class="fg">
            <b>$ {{ formatoImporte(item.pendientes[0] ? item.pendientes[0].pendiente : 0) }}</b>
          </span>
        </template>
        <template v-slot:item.tercero.direcciones[0].zona[0].zonas.nombre="{ item }">
          <span class="fg">
            {{ sayZona(item) }}
          </span>
        </template>
        <template v-slot:item.observaciones="{ item }">
          <span class="fg">
            {{ item.quienpidio=='C' ? 'Cliente' : 'Vendedor' }}
          </span>
        </template>
        <template v-slot:item.estado="{ item }">
          <v-rating v-if="item.rating>=1 && item.rating<=5"
            dense
            v-model="item.rating"
            :color="temas.forms_btn_add_bg"
            background-color="white"
            empty-icon="$ratingFull"
            x-small readonly>
          </v-rating>
          <v-chip v-else
            label
            class="fg85"
            @mouseover="sayMessage(item, true)"
            @mouseleave="sayMessage(item, false)"
            :color="getEstado(item.estado,'c',item.pendientes[0], item)"
            :dark="getEstado(item.estado,'k',item.pendientes[0], item)">
            <b>{{ getEstado(item.estado,'e',item.pendientes[0], item) }}</b>
          </v-chip>
          <v-badge v-if="tieneRemito(item)"
            class="pt-2"
            :content="'r'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
        </template>
        <template v-slot:item.vendido="{ item }">
          <span class="fg">$ {{ formatoImporte(item.vendido) }}</span>
        </template>
        <template v-slot:item.facturas="{ item }">
          <span class="fg">$ {{ formatoImporte(item.facturas) }}</span>
        </template>
        <template v-slot:item.remitos="{ item }">
          <span class="fg">{{ item.remitos }}</span>
        </template>
        <template v-slot:item.ndd="{ item }">
          <span class="fg">$ {{ formatoImporte(item.ndd) }}</span>
        </template>
        <template v-slot:item.ndc="{ item }">
          <span class="fg">$ {{ formatoImporte(item.ndc) }}</span>
        </template>
        <!--
        <template v-slot:item.recibos="{ item }">
          <span class="fg">({{item.valores}}/{{item.rendidos}}) $ {{ formatoImporte(item.recibos) }}</span>
        </template>
        -->
        <template v-slot:item.recibos="{ item }">
          <span class="fg">$ {{ formatoImporte(item.recibos) }}</span>
        </template>
        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-menu bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"
                @click="setAcciones(item)">
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

      <Mail v-model='mail.accion'
        :token=this.mail.token
        :host=this.mail.host
        :username=this.mail.username
        :password=this.mail.password
        :to=this.mail.to
        :from=this.mail.from
        :subject=this.mail.subject
        :body=this.mail.body
        :title=this.mail.title
        :visible=this.mail.visible
        :buttons=this.mail.buttons
        @click="mailRespuesta">
      </Mail>

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
import XLSX from 'xlsx'
import jsPDF from 'jspdf'

export default {
  components: {
    SBar,
    Confirmacion,
    Mail,
    impresiones,
  },
  data: () => ({
    //sayGrilla: true,
    vuelto: false,
    yaEnviado: false,
    tabMaletin: 'aunnorecibidos',
    totMaletines: [], // total de maletines
    maletinesCli: [], // maletines del cliente en recibos
    maletinesCliPos: 0, // Poscion del maletin seleccionado
    totalMaletin: 0,  // importe total de maletines en recibos

    reciboVinculado: false,
    clienteVinculado: false,
    idPagoAAnular: null,
    
    //chkMaletin: [],
    //chkMaletinOk: [],
    maletines: [],

    //maletinesRecep: [],
    //maletinesRecepOk: [],
    
    selectdId: -1,
    buscoPor: 'codigo',
    clickEnBoton: false,
    page: 1,
    mientras: false,
    electronica: false,
    electronicaOk: false,
    

    /*
      para la administracion de pedidos
      sucursalesPosibles: siempre en la posicion 1 va a estar la sucursal fiscal actual, y en la 2 la demo
      y cuando ingresan desde demo la administracion de pedidos no esta habilitada, y este array va vacio, lo uso como bandera
    */
    desdeAdmPedidos: false, // para saber si la operacion se hace desde la administracion de pedidos 
    cambioSucursal: false,
    sucursalesPosibles: [],
    descuentosCli: [],
    facRet: 0,  // si esta facturando un retiro de mercadería, si se carga con un ID es true
    bultos: 0,
    equipo: [], // cargo el equipo del usuario actual, si es empleado va el solo
    pagina: 1,
    perPage: 3,
    zonas: [],
    //viajes: [],
    viajesStatics: { a: { ped: 0,fac: 0, ndc: 0 }, b: { ped: 0,fac: 0, ndc: 0 }, r: 0 },
    viajesStaticsSay: 0,
    ivas: [],
    asociado: [],
    selected: [],
    confirmarComprobanteMensaje: 'CONFIRMAR COMPROBANTE',
    progress: false,
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    periodos: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    esManual: false,
    sucManual: '0000',
    nroManual: '00000000',
    expanded: [],
    expandedPedidos: [],
    expandedRepartos: [],
    totalPedidos: 0,
    facturas: [],
    loading: true,

    cpr: '',                 // Pedido 
    pedProcesable: false,    // Si el pedido es procesable o no ( alguno de los items tiene stock )
    basadoEnCpr: false,      // si el comprobante actual esta basado en otro comprobante. ( fac/ped, rem/fac, etc)
    notificaEnBaseAOtro: [], // arreglo para realizar la notificacion de comprobantes.
    notificaOriginal: [],    // cuando es notificaEnBaseAOtro, debo marcar el comprobante padre.
    basadoEnOtroCpr: [],     // arreglo para grabar la en que comprobante esta basado el actual
    motivoAnularPedido: '¡Lamentamos informarles que nos quedamos sin stock!',
    cfUser: '',
    anotadorId: 0,
    anotadorTotal: 0,
    elCuitEstaba: false,
    laCuentaEstaba: false,
    userDelTercero: 0,
    userDelTerceroDatos: null,
    dondeEstoy: 'F',         // desde donde controlo si el cliente esta vinculado, <F>act o <R>ecibo
    cual: '',                // forma de pago seleccionada
    recargo: 0,              // % de recargo para cuando se selecciona un cobro con recargo, no aplica a cobranzas
    
    // remito
    remitoValorizado: false,
    remitoTexto: '',
    remitoItems: 0,

    // Analisis de Pedidos
    analisisDePedidos: [],

    calificacion: 0,
    puntosDeRetiros: [],
    radios: null,
    reparto: {
      fecha: null,
      zona_id: null,
    },
    repartoNovedad: {
      tercero_id: null,
      tipo: null,
      observ: null,
      importe: null,
    },
    cprDesdeReparto: false,
    envio: {
      tipodeenvio: 'P',
      adomicilio: 'S',
      transporte_id: '',
      puntoderetiro_id: '',
      puntoderetirodireccion_id: '',
      llegada: '',
      generaremito: false,
      remitogenerado: false,
      remito_id : '',
      remito_numero: '',
      remito_msg: '',
      importeflete: '',
      bultos: '',
      traking: '',
      quienretira: '',
      documento: '',
      direccion_id: '',
    },
    retiro: { quienretira:'',documento:'',generaremito:false,remitogenerado:false,remito_id:'',remito_numero:'',remito_msg:'', bultos:''},

    // recibo
    reciboDeUnSoloComprobante: false,
    medioDePagoId: 1,
    medioDePagoOk: false,
    comoPaga: "1",          // 1-> Todo Efectivo, 2-> Otros
    medioDePagoNombre: '',
    anchoDelDialogDeValores: 450,
    totCancelado: 0,
    totValores: 0,
    valDiferencia: 0,
    totCheTerSel: 0,
    rentabilidad: 0,
    medpagwidth: 0,
    medpag: [
      {id:1, nombre: 'Efectivo',         activo: true,  tipo:'CAJ', total: 0, abrev: 'EF'},
      {id:2, nombre: 'Tarj.de Crédito',  activo: true,  tipo:'TDC', total: 0, abrev: 'TC' },
      {id:3, nombre: 'Tarj.de Débito',   activo: true,  tipo:'TDD', total: 0, abrev: 'TD' },
      {id:4, nombre: 'Cuenta Corriente', activo: false, tipo:'CTE', total: 0, abrev: 'CC' },
      {id:5, nombre: 'Transferencia',    activo: true,  tipo:'TRA', total: 0, abrev: 'TR' },
      {id:6, nombre: 'Cheque',           activo: true,  tipo:'CHE', total: 0, abrev: 'CH' },
      {id:7, nombre: 'Mercado Pago',     activo: true,  tipo:'MEP', total: 0, abrev: 'MP' },
      {id:8, nombre: 'Todo Pago',        activo: true,  tipo:'TPA', total: 0, abrev: 'TP' },
      {id:9, nombre: 'Canje',            activo: false, tipo:'CJE', total: 0, abrev: 'CJ' },
    ],

    // ndc
    ndcMotivos: [{id:1, nombre: 'BONIFICACION'}, {id: 2, nombre: 'DEVOLUCION'}, {id: 3, nombre: 'ANULACION'}],
    ndcMotivoSel: 1,
    ndcTasaDescuento: 0,
    ndcTotal: 0,
    ndcItemsDevueltos: [],

    nddMotivos: [{id:1, nombre: 'CHEQUES RECHAZADOS'}, {id: 2, nombre: 'MORA'}, {id: 3, nombre: 'CAMBIO DE PRECIO'}],
    nddMotivoSel: 1,
    nddTasaDescuento: 0,
    nddTotal: 0,
    nddChequesDevueltos: [],

    comprobantes: [
      { nombre: 'Facturas',     total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Débitos',      total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Créditos',     total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Presupuestos', total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Remitos',      total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Pedidos',      total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Recibos',      total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Retiros',      total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Viajes',       total: 0, ctt: 0, bg: '', dark: '', activo: true },
    ],

    // filtro
    filtroComprobante: [1,6,11,51],
    filtroComprobanteSel: '',
    coef: 1,  // para signar los comprobantes + o -
    ctacte: false,
    diasvenc: 0,
    bonificacionmaxima: 0,
    creditomaximo: 0,
    saldoctacte: 0,
    valorespendientes: 0,
    tienesaldo: 0,
    disponible: 0,
    formTitle: '',
    formTitleArt: '',
    formTitleMed: '',
    itemActual: {cpr:'', tercero: {nombre: ''}},
    itemActualArt: null,
    itemActualPend: {pendiente: 0, acancelar: 0},
    itemActualTransfItem: null,
    itemActualReparto: null,
    itemActualPedido: null,
    itemActualViaje: null,
    itemActualCliente: null,
    tl: "text-lowercase",
    banItems: [],
    cueItems: [],
    cueNewItems: [],
    cueMiasItems: [],
    medios: [],
    lisItems: [],
    depItems: [],
    uniItems: [],
    monItems: [],
    ivaTasas: [],
    dirItems: [],
    dirItemsPdrDir: [],
    lisValue: [],
    dirValue: [],
    medValue: [],
    lisObj: [],
    items: [],
    itemsAll: [],
    itemsReparto: [],
    itemsRecorrido: [],
    iRAll: [],
    itemsRepartoPedidoUnds: [],
    itemsRepartoPedidoCual: 'R',
    articulos: [],
    cheques: [],
    artPed: [],
    artTransfPed: [],
    artTransfPedId: 0,
    artTransfPedCtt: 0,
    artTransfPedSucDes: [],
    artTransfPorcentaje: 0,
    valores: [],
    pendientes: [],
    pend: [],
    rastreo: [],
    acciones: [],
    timeLine: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    mail: {
      token: "4a720391-3103-4352-ac74-d48f13f1a13b",
      host: "smtp.gmail.com",
      username: "gohuapp",
      password: "gmail021201",
      to: '',
      from: "gohuapp@gmail.com",
      subject: "",
      body: "",
      accion: null,
      visible: false,
      title: '',
      buttons: ['']
    },
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    cuitRules: [
      v => !!v || 'El cuit es requerido',
      v => (v && v.length <= 11) || 'Debe ingresar 11 números sin los guiones',
    ],
    bultosRules: [
      v => !!v || "Debe ser un valor mayor a cero",
    ],
    porcentajeATransferir: [
      v => (v && v > 0 && v < 101) || 'Debe ingresar entre el 1% al 100%',
    ],
    //footerProps: {'items-per-page-options': [5, 5, 15, 100]},
    footerProps: {'items-per-page-options': [6]},
    footerProps3: {'items-per-page-options': [3]},
    footerProps4: {'items-per-page-options': [4]},
    footerProps10: {'items-per-page-options': [10]},
    busArt: '',
    busArtSave: '',
    search: '',
    searchBancos: '',
    searchTerceros: '',
    searchTercerosRec: '',
    searchTercerosPdr: '',
    searchTercerosEquipo: '',
    searchTercerosTrans: '',
    searchTercerosPrdDir: '',
    searchTercerosRetirosMerc: '',
    esTexto: false,
    dialog: false,
    dialogMed: false,
    dialogPed: false,
    dialogRas: false,
    dialogNot: false,
    dialogRem: false,
    dialogRec: false,
    dialogVal: true,
    dialogPend: false,
    dialogError: false,
    dialogArtNot: false,
    dialogNdcFac: false,
    dialogNddFac: false,
    dialogRetiro: false,
    dialogEnvios: false,
    dialogBultos: false,
    dialogNdcxDev: false,
    dialogNddxDev: false,
    dialogTimeLine: false,
    dialogSelTurnos: false,
    dialogRetiroMerc: false,
    dialogSelFacturas: false,
    dialogAnularPedido: false,
    dialogTransferirItem: false,
    dialogVerSelMaletines: false,
    dialogPedidoArticulos: false,
    dialogTransferirPedido: false,
    dialogAdministracionPedidos: false,
    verOSelMaletines: 'V',
    editadoNombre: '',
    editadoCpr: '',
    headers: [
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 175 },
      { text: 'FECHA', value:'fecha', align: 'left', width: 89 },
      { text: 'CLIENTE', value: 'tercero.razon_social', align: 'left', width: 210 },
      { text: 'DESC', value:'importedescuento', align: 'end', width: 110 },
      { text: 'TRN', value:'rentabilidad', align: 'end', width: 110 },
      { text: 'PENDIENTE', value:'pendientes[0].pendiente', align: 'end', width: 120 },
      { text: 'TOTAL', value:'total', align: 'end', width: 150 },
      { text: 'ESTADO', value:'estado', align: 'left', width: 110 },
      { text: 'ACCIONES', value: 'accion', sortable: false, width: 90 },
    ],
    headersItems: [
      { text: 'Código', value:'articulo.codigo', width: 130, class: 'grey lighten-3'},
      { text: 'Descripción', value:'articulo.nombre', width: 353, class: "grey lighten-3"},
      { text: 'Ctt', value:'cantidad', width: 90, align: 'end', class: "grey lighten-3"},
      { text: 'Precio', value:'precio', width: 100, align: 'end', width: 120, class: "grey lighten-3"},
      { text: '%Des', value:'tasadescuento', width: 80, align: 'end', class: "grey lighten-3"},
      { text: 'Des', value:'importedescuento', width: 110, align: 'end', class: "grey lighten-3"},
      { text: 'Total', value:'total', width: 130, align: 'end', width: 120, class: "grey lighten-3"},
    ],
    headersCancelaciones: [
      { text: 'Cpr', value:'cancelado.comprobante.cpr', align: 'left', width: 150},
      { text: 'Observaciones', value:'concepto', align: 'left', width: 200},
      { text: 'Fecha', value:'cancelado.comprobante.fecha', align: 'end', width: 90},
      { text: 'Cancelado', value:'importe', align: 'end', width: 120},
      { text: 'Pendiente', value:'cancelado.pendiente', align: 'end', width: 120},
    ],
    headersArt: [
      { text: 'Código', value:'codigo', align: 'left', width: 140},
      { text: 'Descripción', value:'nombre', align: 'left', width: 333},
      { text: 'Ctt.', value:'cantidad', align: 'end', width: 90},
      { text: 'Precio', value:'precio', align: 'end', width: 100},
      { text: '%Desc.', value:'tasadescuento', align: 'end', width: 80},
      { text: 'Descuento', value:'importedescuento', align: 'end', width: 90},
      { text: 'TOTAL', value:'total', align: 'end', width: 130},
      { text: 'Acciones', value: 'accion', sortable: false, width: 155 },
    ],
    headersNot: [
      { text: 'CODIGO', value:'codigo', align: 'left', width: 140},
      { text: 'Descripción', value:'nombre', align: 'left', width: 333},
      { text: 'Ctt.', value:'cantidad', align: 'end', width: 90},
      { text: 'Precio', value:'precio', align: 'end', width: 100},
      { text: 'TOTAL', value:'total', align: 'end', width: 130},
      { text: 'Acciones', value: 'accion', sortable: false, align: 'left', width: 130 },
    ],
    headersPedidos: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 120},
      { text: 'Cliente', value:'cliente', align: 'left', width: 210},
      { text: 'Nro.Ped', value:'cpr', align: 'left', width: 155},
      { text: 'Ctt.Ped', value:'cantidad', align: 'end', width: 155},
    ],
    headersSelArt: [
      { text: 'NID', value:'id', align: 'left', width: 50},
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 350},
      { text: 'STOCK', value:'stock', align: 'end', width: 100},
      { text: 'PRECIO', value:'precio', align: 'end', width: 100},
    ],
    headersRas: [
      { text: 'PADRE',     value:'padre_id'}, 
      { text: 'ORIGEN',    value:'cpr1'},
      { text: 'TERCERO 1', value:'nombre1'},
      { text: 'HIJO',      value:'hijo_id'},
      { text: 'DESTINO',   value:'cpr2'},
      { text: 'TERCERO 2', value:'nombre2'}
    ],
    headersPed: [
      { text: 'Código', value:'codigo', align: 'left', width: 120},
      { text: 'Descripción', value:'nombre', align: 'left', width: 440},
      { text: '%Desc', value:'descuento', align: 'end', width: 80},
      { text: 'Ctt.Ori.', value:'cttori', align: 'end', width: 80},
      { text: 'Stock', value:'stock', align: 'end', width: 80},
      { text: 'Ctt.Ped.', value:'cttped', align: 'end', width: 80},
      { text: 'Ctt.Fac.', value:'cttfac', align: 'end', width: 80},
      { text: 'Estado', value:'estado', align: 'center', width: 100},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersSelArtPedErr: [
      { text: 'CODIGO', value:'codigo',       align: 'left', width: 120},
      { text: 'NOMBRE', value:'nombre',       align: 'left', width: 350},
      { text: 'ERROR',  value:'err',          align: 'left', width: 250},
      { text: 'UN.PED', value:'unped',        align: 'end',  width: 100},
      { text: 'STOCK',  value:'stock',        align: 'end',  width: 100},
      { text: 'PREPED', value:'preped',       align: 'end',  width: 100},
      { text: 'PREACT', value:'preact',       align: 'end',  width: 100},
    ],
    headersTransfPed: [
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'DESCRIPCION', value:'nombre', align: 'left', width: 450},
      { text: 'Ctt.Ori.', value:'cttori', align: 'end', width: 80},
      { text: 'Ctt.Fac.', value:'cttfac', align: 'end', width: 80},
      { text: 'Ctt.Transf.', value:'ctttransf', align: 'end', width: 80},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersNdcxDev: [
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'DESCRIPCION', value:'nombre', align: 'left', width: 400},
      { text: 'Facturado', value:'cantidad', align: 'end', width: 90},
      { text: 'A Devolver.', value:'adevolver', align: 'end', width: 90},
      { text: 'ACCIONES', value: 'accion', sortable: false, align: 'end', width: 140 },
    ],
    headersNddxDev: [
      { text: 'BANCO',      value: 'nomban',           align: 'left', width: 140},
      { text: 'CUIT',       value: 'cuitlib',          align: 'left', width: 90},
      { text: 'LIBRADOR',   value: 'nomlib',           align: 'left', width: 150},
      { text: 'NROVALOR',   value: 'nrovalor',         align: 'end',  width: 120},
      { text: 'FEC.FIN.',   value: 'fechafinanciera',  align: 'left', width: 90},
      { text: 'DIAS',       value: 'dias',             align: 'end',  width: 90},
      { text: 'IMPORTE',    value: 'importe',          align: 'end',  width: 120},
    ],
    headersMed: [
      { text: 'MEDIO', value:'medioNombre',    align: 'left', width: 170},
      { text: 'OBSERVACIONES', value:'observ', align: 'left', width: 700},
      { text: 'TOTAL', value:'importe',        align: 'end',  width: 120},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersPend: [
      { text: 'CPR',         value:'cpr'}, 
      { text: 'VENCIMIENTO', value:'vencimiento'},
      { text: 'IMPORTE',     value:'importe', align: 'end'},
      { text: 'PENDIENTE',   value:'pendiente', align: 'end'},
      { text: 'A CANCELAR',  value:'acancelar', align: 'end'},
      { text: 'ACCIONES',    value:'accion', sortable: false },
    ],
    headersRetirosMerc: [
      { text: 'Código', value:'codigo', align: 'left', width: 120},
      { text: 'Descripción', value:'nombre', align: 'left', width: 450},
      { text: 'Cantidad', value:'cantidad', align: 'end', width: 80},
      { text: 'ACC', value: 'accion', sortable: false, width: 90 },
    ],
    headersSelFacturas: [
      { text: 'Factura', value:'cpr', align: 'left', width: 190},
      { text: 'Fecha', value:'fecha', align: 'left', width: 90},
      { text: 'Total', value:'total', align: 'end', width: 90},
    ],
    headersSelTurnos: [
      { text: 'Fecha Hora', value:'fecha', align: 'left', width: 150},
      { text: 'Código', value:'codigo', align: 'left', width: 120},
      { text: 'Nombre', value:'nombre', align: 'left', width: 300},
      { text: 'Precio', value:'precio', align: 'end', width: 120},
    ],
    headersMaletines: [
      { text: 'Equipo', value:'cobrador', align: 'left', width: 100},
      { text: 'Cód.', value:'cliente_id', align: 'end', width: 100},
      { text: 'Cliente', value:'cliente', align: 'left', width: 220},
      { text: 'Medio', value:'mdp', align: 'left', width: 120},
      { text: 'Observ.', value:'observ', align: 'left', width: 120},
      { text: 'Importe', value:'importe', align: 'end', width: 120},
    ],
    headersRecorrido: [
      { text: 'Cliente', value: 'tercero.razon_social', align: 'left', width: 260 },
      { text: 'Pedido', value:'cprsA.pedido.cpr', align: 'left', width: 125 },
      { text: 'Factura', value:'cprsA.factura.cpr', align: 'left', width: 140 },
      { text: 'NDD', value:'cprsA.ndd.cpr', align: 'left', width: 140 },
      { text: 'NDC', value:'cprsA.ndc.cpr', align: 'left', width: 140 },
      { text: 'Remito', value:'remito.cpr', align: 'left', width: 115 },
      { text: 'Recibo/s', value:'cprsA.recibo.cpr', align: 'left', width: 220 },
    ],
    headersRepartoArticulos: [
      { text: 'ID', value:'id', align: 'left', width: 100},
      { text: 'Código', value:'codigo', align: 'left', width: 150},
      { text: 'Descripción', value:'nombre', align: 'left', width: 450},
      { text: 'Cantidad', value:'cantidad', align: 'end', width: 100},
      { text: 'Bultos', value:'bultos', align: 'left', width: 90},
      { text: 'Peso', value:'peso', align: 'left', width: 90},
      { text: 'Kgs', value:'kgs', align: 'left', width: 90},
    ],

    editedIndex: -1,
    editedIndexArt: -1,
    editedIndexMed: -1,
    editedIndexNot: -1,
    editedIndexRetiroMer: -1,
    editado: {
      id: '',
      cpr: '',
      fecha: '',
      tercero_id: '',
      nombre: '',
      comprobante_id: '',
      documento_id: '',
      documentoCodigo: '',
      mediodepago_id: '',
      deposito_id: '',
      vendedor: {id: null, nombre: 'MOSTRADOR'},
      moneda_id: 51,
      direccion_id: '',
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      tasadescuento: 0,
      importedescuento: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      total: 0,
      rentabilidad: 0,
      texto: '',
      estado: '',
      observaciones: '',
      quienpidio: '',
      viaje_id: null,
      hayMaletin: null,
      usaElSistema: false,
    },
    defaultItem: {
      id: '',
      cpr: '',
      fecha: '',
      tercero_id: '',
      nombre: '',
      comprobante_id: '',
      documento_id: '',
      documentoCodigo: '',
      mediodepago_id: '',
      deposito_id: '',
      vendedor: {id: null, nombre: 'MOSTRADOR'},
      moneda_id: 51,
      direccion_id: '',
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      tasadescuento: 0,
      importedescuento: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      total: 0,
      rentabilidad: 0,
      texto: '',
      estado: '',
      observaciones: '',
      quienpidio: '',
      viaje_id: null,
      hayMaletin: null,
      usaElSistema: false,
    },
    editadoArt: {
      id: '', articulo_id: '', codigo: '', codbar: '', nombre: '', deposito_id: '', unidad_id: '', moneda_id: 51, iva_id: '', cantidad: 1,
      cantidadoriginal: 1, stock: 0, costo: 0, precio: 0, preciooriginal: 0, undstock: 0, sinstock: 'C', tasadescuento: 0, importedescuento: 0,
      decimales: 0, total: 0, texto: '', vencimiento: '', ofeprecio: 0, ofetasdes: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '',
      padre_id: null, undenvase: 1, escombo: false, preciomediocobro: false, tasaproprecargo: 0, adevolver: 0, turno_id: null, loTengo: false,
    },
    defaultItemArt: {
      id: '', articulo_id: '', codigo: '', codbar: '', nombre: '', deposito_id: '', unidad_id: '', moneda_id: 51, iva_id: '', cantidad: 1,
      cantidadoriginal: 1, stock: 0, costo: 0, precio: 0, preciooriginal: 0, undstock: 0, sinstock: 'C', tasadescuento: 0, importedescuento: 0,
      decimales: 0, total: 0, texto: '', vencimiento: '', ofeprecio: 0, ofetasdes: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '',
      padre_id: null, undenvase: 1, escombo: false, preciomediocobro: false, tasaproprecargo: 0, adevolver: 0, turno_id: null, loTengo: false,
    },
    editadoPend: {
      acancelar: '',
    },
    editadoTransfItem: {
      cttOriginal: 0,
      cttATransferir: 0,
    },
    editadoMed: {
      id: null,
      caja_id: null,
      medio_id: null,
      cuentaorigen_id: null,
      cuentadestino_id: null,
      cuentacheque_id: null,
      cuentatarjeta_id: null,
      banco_id: null,
      tarjeta_id: null,
      cpringreso_id: null,
      cpregreso_id: null,
      chequera_id: null,
      cheque_id: null,
      echeq: null,
      fechafinanciera: null,
      fechasalida: null,
      importe: null,
      nrovalor: null,
      tipo: null,
      observ: null,
      importe: 0,
      cuenta: null,
      cuit: null,
      nombre: null,
      cuotas: null,
      importecuotas: null,
      interes: null,
      recargo: null,
      nombrecuenta: null,
      propiodelcliente: null,
      domicilioFiscal: [],
      maletinitem_id: null,
    },
    defaultItemMed: {
      id: null,
      caja_id: null,
      medio_id: null,
      cuentaorigen_id: null,
      cuentadestino_id: null,
      cuentacheque_id: null,
      cuentatarjeta_id: null,
      banco_id: null,
      tarjeta_id: null,
      cpringreso_id: null,
      cpregreso_id: null,
      chequera_id: null,
      cheque_id: null,
      echeq: null,
      fechafinanciera: null,
      fechasalida: null,
      importe: null,
      nrovalor: null,
      tipo: null,
      observ: null,
      importe: 0,
      cuenta: null,
      cuit: null,
      nombre: null,
      cuotas: null,
      importecuotas: null,
      interes: null,
      recargo: null,
      nombrecuenta: null,
      propiodelcliente: null,
      domicilioFiscal: [],
      maletinitem_id: null,
    },
    selArt: [],
    seleccionarArticulo: false,
    descriptionLimit: 80,
    entriesBancos: [],
    entriesTerceros: [],
    entriesArticulos: [],
    entriesTercerosTrans: [],
    entriesTercerosPdr: [],
    entriesTercerosPdrDir: [],
    entriesTercerosEquipo: [],
    
    tercerosUserId: [],
    isLoadingTerceros: false,
    isLoadingBancos: false,
    isLoadingTercerosRec: false,
    isLoadingTercerosTrans: false,
    isLoadingTercerosPdr: false,
    isLoadingTercerosPdrDir: false,
    isLoadingTercerosEquipo: false,
    isLoadingTercerosRetirosMerc: false,
    isLoadingArticulos: false,
    selArtPedErr: [],

    filtrosEstados: [],
    filtroEstadoSel: 'Todos',
    filtrosEstadosCprs: [],
    filtroEstadoCprsSel: 'Todos',

    precioOrigen: 'Lista',  // Lista, Promocion: por defecto Lista = precios.precio
    promoDescuento: 0,      // Descuento por Promo ( si hay )
    precioDescuento: 0,     // Descuento de Promocion o de Item ( ingresado en Compras )
    cttMinima: 1,           // Cabtidad minima para aplicar la regla
    turnosFacturar: [],     // Levanta turnos pendientes de facturar

  }),
  
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
      'anotaciones',
      'caja',
      'centrales',
      'codigooid',
      'comprobantesm',
      'cuit',
      'datosEmpresa',
      'descuentos',
      'dolar',
      'empresa',
      'externo',
      'hayPedidos',
      'level',
      'notificaciones',
      'operario',
      'operarioArea',
      'operarioEsVendedor',
      'operarioTerceroId',
      'operarioUserId',
      'pedTransfAVend',
      'responsable',
      'roles',
      'soloArtComprados',
      'sucursal',
      'sucursales',
      'sucursalDemo',
      'sucursalFiscal',
      'sucursalManual',
      'tema',
      'temas',
      'tipo',
      'turnos',
      'vinculosHijos',
      'vinculosPadres', 
      'vinculosPadresAll',
      'vinculosPadresLic',
    ]),

    mediosFiltrado() {
      if (this.cual==2) {           // TARJETAS DE CREDITO
        return this.medios.filter(item => item.debito === 0 )
      } else if (this.cual==3) {    // TARJETAS DE DEBITO
        return this.medios.filter(item => item.debito === 1 )
      }
    },

    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },

    itemsTercerosTrans () {
      return this.entriesTercerosTrans.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },

    itemsTercerosPdr () {
      return this.entriesTercerosPdr.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },

    itemsTercerosEquipo () {
      return this.entriesTercerosEquipo.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },

    itemsBancos () {
      return this.entriesBancos.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
    
    laDireccion () {
      let dir = ''
      if (this.itemActual.user) {
        dir = this.itemActual.user.tercero.direcciones[0].direccion + ' ('
        dir += this.itemActual.user.tercero.direcciones[0].postal.nombre + ') - '
        dir += this.itemActual.user.tercero.direcciones[0].postal.provincia.nombre + ' - '
        dir += this.itemActual.user.tercero.direcciones[0].postal.provincia.pais.nombre
      } else if (this.itemActual.tercero) {
        if (this.itemActual.tercero.direcciones) {
          dir = this.itemActual.tercero.direcciones[0].direccion + ' ('
          dir += this.itemActual.tercero.direcciones[0].postal.nombre + ') - '
          dir += this.itemActual.tercero.direcciones[0].postal.provincia.nombre + ' - '
          dir += this.itemActual.tercero.direcciones[0].postal.provincia.pais.nombre
        }
      }
      return dir
    },
  
    saldoDisponible() {
      return '$'+this.formatoImporte(this.disponible)
    },

    editadoGravado() {
      return '$'+this.formatoImporte(this.editado.gravado)
    },

    editadoExento() {
      return '$'+this.formatoImporte(this.editado.exento)
    },

    editadoIva() {
      return '$'+this.formatoImporte(this.editado.iva)
    },

    editadoTotal() {
      return '$'+this.formatoImporte(this.editado.total)
    },

    diasDelCheque() {
      let f1 =  moment().format('YYYY-MM-DD')
      let f2 =  moment(!this.editadoMed.fechafinanciera?f1:this.editadoMed.fechafinanciera).format('YYYY-MM-DD')
      let hoy = moment(f1)
      let ven = moment(f2)
      let ret = ven.diff(hoy, 'days').toString()
      if (ret=='0') {
        ret = 'Hoy'
      } else if (Number(ret)==1) {
        ret = '1 día '
      } else {
        ret +=' días '
      }
      return ret
    },

    balanceDelPago() {
      let xxx = this.editado.cpr;
      let totPen = 0
      let totVal = 0
      for (let i=0; i<=this.pend.length-1; i++) {
        totPen += Number(this.pend[i].acancelar)
      }
      for (let i=0; i<=this.valores.length-1; i++) {
        totVal += Number(this.valores[i].importe)
      }
      if (totVal==0) {
        return '¡Debes ingresar Valores!'
      } else if (this.valDiferencia==0) {
        return 'Todo OK'
      } else if (this.valDiferencia<0) {
         return '¡Estás cobrando de más!'
      } else if (this.valDiferencia>0) {
        return '¡Estás cobrando de menos!'
      }
    },

    promosComputer() {
      let res = ''
      if (this.editadoArt.ofeprecio!=0) {
        res = 'Promo '+this.editadoArt.ofeunidades+'un/'+this.editadoArt.ofetasdes+'% off '
      }
      return res
    },

  },

  watch: {
    /*
    dialog (val) {
      val || this.cancelar();
    },
    */
    '$store.state.sucursal' () {
      for (let i=0; i<=8; i++) {
        this.comprobantes[i].bg    = this.$store.state.temas.cen_panelcpr_bg
        this.comprobantes[i].dark  = this.$store.state.temas.cen_panelcpr_dark
      }
      if (this.$store.state.tipo=='PP') {
        for (let i=0; i<=this.comprobantes.length-1; i++) {
          this.comprobantes[i].activo = false
        }
        this.comprobantes[5].activo = true
        this.selectTipoDeComprobante('Pedidos', true)
      } else {

        this.comprobantes[0].activo = !this.sucursalDemo
  
        this.comprobantes[1].activo = true
        this.comprobantes[2].activo = true
  
        //this.comprobantes[1].activo = !this.sucursalDemo
        //this.comprobantes[2].activo = !this.sucursalDemo
        if (this.sucursalDemo) {
          if (this.centrales.ventas_panel == 'Facturas' ||
              this.centrales.ventas_panel == 'Créditos' ||
              this.centrales.ventas_panel == 'Débitos') {
            this.selectTipoDeComprobante('Presupuestos', true)
          } else {
            this.selectTipoDeComprobante(this.centrales.ventas_panel, true)
          }
        } else {
          this.selectTipoDeComprobante(this.centrales.ventas_panel, true)
        }
      }
    },

    search(val) {
      this.$store.commit("setCentrales", {ventas_buscar: val||''}, { root: true });
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

      return HTTP().get('/indexter/false/1/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/%'+val+'%').then(({ data })=>{
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
            this.searchTercerosMetodo(valor, true)
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTerceros = false))
    },

    searchTercerosRec (val) {
      if (this.isLoadingTercerosRec || this.editado.cpr!='REC') return
      this.isLoadingTercerosRec = true
      this.dondeEstoy = 'R'
      return HTTP().get('/indexter/false/1/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/%'+val+'%').then(({ data })=>{

        this.entriesTerceros = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTerceros.push(data[i].tercero)
          this.tercerosUserId.push(data[i].tercero_id)
        }
        if (val !== null && val !== '') {

          let ipos = this.entriesTerceros.findIndex(i => i.id === this.editado.tercero_id);
          if (ipos!=-1) {

            this.userDelTercero = data[ipos].tercero.user!=null ? data[ipos].tercero.user.id : 0
            this.clienteVinculado = false
            return HTTP().get('/user/'+this.userDelTercero).then(({ data }) => {
              
              let pos = this.vinculosHijos.findIndex(x=>x==this.userDelTercero)
              if (pos!=-1&&data[0].usaelsistema) {

                this.msg.msgTitle = 'Cliente Vinculado'
                let msg = 'El cliente esta vinculado, debes pedirle que te realice un '
                msg += this.editado.cpr=='FAC'?'pedido.':'pago.'
                this.msg.msgBody = msg
                this.msg.msgVisible = true
                this.msg.msgAccion = 'cliente vinculado'
                this.msg.msgButtons = ['Aceptar']
                this.clienteVinculado = true
                return true

              } else {

                let valor = this.tercerosUserId[ipos]
                //this.userDelTercero = data[ipos].tercero.user!=null ? data[ipos].tercero.user.id : 0
                return HTTP().get('/tercero/'+valor+'/1/false/'+this.sucursal).then(({ data }) => {
                  this.itemActualCliente = data
                  this.maletinesCli = data.maletin==null?[]:data.maletin
                  this.setDatosRecibo(this.hayMaletin()?this.maletinesCli:null)
                })

              }
            })

          }
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTercerosRec = false))
    },

    searchTercerosTrans (val) {
      if (this.isLoadingTercerosTrans) return
      this.isLoadingTercerosTrans = true
      return HTTP().get('/indexter/false/4').then(({ data }) => {
        this.entriesTercerosTrans = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTercerosTrans.push(data[i].tercero)
          this.tercerosUserId.push(data[i].id)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTercerosTrans = false))
    },

    searchTercerosPdr (val) {
      if (this.isLoadingTercerosPdr) return
      this.isLoadingTercerosPdr = true
      return HTTP().get('/indexter/false/5').then(({ data }) => {
        this.entriesTercerosPdr = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTercerosPdr.push(data[i].tercero)
          this.tercerosUserId.push(data[i].id)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTercerosPdr = false))
    },

    searchTercerosEquipo (val) {
      if (this.isLoadingTercerosEquipo) return
      this.isLoadingTercerosEquipo = true
      return HTTP().get('/indexter/false/3/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/%'+val+'%').then(({ data })=>{
        this.entriesTercerosEquipo = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTercerosEquipo.push(data[i].tercero)
          this.tercerosUserId.push(data[i].id)
        }
        if (val !== null && val !== '') {
          let ipos = this.entriesTercerosEquipo.findIndex(i => i.id === this.editadoViaje.tercero_id);
          if (ipos!=-1) {
            let valor = this.tercerosUserId[ipos]
            this.userDelTercero = data[ipos].tercero.user!=null ? data[ipos].tercero.user.id : 0
            //let entro = false;

            this.zonas = []
            return HTTP().post('zonassinviajes', {tercero_id: data[ipos].tercero.id, usertercero_id: valor}).then(({ data }) => {
              if (data.zonasdisponibles.length+data.zcr.length==0) {
                this.msg.msgTitle = 'No hay Zonas definidas'
                this.msg.msgBody = 'Debes defnir zonas para luego asignarlas a tus clientes.'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'error en viaje'
                this.msg.msgButtons = ['Aceptar']
              } else if (data.zonasdisponibles.length<1) {
                this.msg.msgTitle = 'No hay Zonas disponibles'
                let m = 'No hay Zonas disponibles para realizar Viajes<br>'
                m += 'Debes finalizar Viajes para habilitar nuevamente sus zonas.'
                this.msg.msgBody = m
                this.msg.msgVisible = true
                this.msg.msgAccion = 'error en reparto'
                this.msg.msgButtons = ['Aceptar']
              } else {
                for (let i=0; i<=data.zonasdisponibles.length-1; i++) {
                  this.zonas.push({
                    id: data.zonasdisponibles[i].zona.id,
                    nombre: data.zonasdisponibles[i].zona.nombre
                  })
                }
              }
            })
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTercerosEquipo = false))
    },

    searchTercerosRetirosMerc (val) {
      if (this.isLoadingTercerosRetirosMerc || this.editado.cpr.substring(0,3)!='RTV') return
      this.isLoadingTercerosRetirosMerc = true
      this.dondeEstoy = 'R'
      return HTTP().get('/indexter/false/1/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/%'+val+'%').then(({ data })=>{
        this.entriesTerceros = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTerceros.push(data[i].tercero)
          this.tercerosUserId.push(data[i].tercero_id)
        }
        if (val !== null && val !== '') {
          
          let ipos = this.entriesTerceros.findIndex(i => i.id === this.editado.tercero_id);
          if (ipos!=-1) {

            let valor = this.tercerosUserId[ipos]
            this.userDelTercero = data[ipos].tercero.user!=null ? data[ipos].tercero.user.id : 0
            //let entro = false;
            return HTTP().get('/tercero/'+valor+'/1/false/'+this.sucursal).then(({ data }) => {

              let rid = data.t[0].tercero.responsable.id
              if (this.responsable===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO ( VIENE DEL STORE )
                if(rid===1 || rid===2 || rid===6 || rid===9 || rid===11) {
                  this.editado.letra = this.comprobantesm?'M':'A'
                  this.editado.comprobante_id = this.comprobantesm?51:4
                } else {
                  this.editado.letra = 'B'
                  this.editado.comprobante_id = 9
                }
              } else if (this.responsable===6) { //EL USUARIO ES MONOTRIBUTISTA ( VIENE DEL STORE )
                this.editado.letra = 'C'
                this.editado.comprobante_id = 17
              }

              this.editado.documento = data.t[0].tercero.documento.nombre;
              this.editado.documento_id = data.t[0].tercero.documento.id;
              this.editado.documentoCodigo = data.t[0].tercero.documento.codigo;
              this.editado.documentoNumero = data.t[0].tercero.cuit;
              this.editado.responsableAbrev = data.t[0].tercero.responsable.abrev;

              this.dirItems = []
              for (let i=0; i<= data.t[0].tercero.direcciones.length-1; i++) {
                this.dirItems.push(data.t[0].tercero.direcciones[i])
              }
              this.editado.direccion_id = this.dirItems[0].id
            })
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTercerosRetirosMerc = false))
    },

    searchTercerosPdrDir (val) {
      if (this.isLoadingTercerosPdrDir) return
      this.isLoadingTercerosPdrDir = true
      return HTTP().get('/indexter/'+this.envio.direccion_id+'/'+this.envio.puntoderetiro_id).then(({ data }) => {
        this.entriesTercerosPdrDir = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTercerosPdrDir.push(data[i].tercero)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTercerosPdr = false))
    },

    searchBancos (val) {
      if (this.isLoadingBancos) return
      this.isLoadingBancos = true
      return HTTP().get('/bancos').then(({ data }) => {
        this.entriesBancos = []
        data.forEach(e => {
          this.entriesBancos.push(e)
        })
        let ipos = 0
        for (let i=0; i<=this.entriesBancos.length-1; i++) {
          if (this.editadoMed.banco_id === this.entriesBancos[i].id) {
            ipos = i
            break
          }
        }
        if (ipos!=0) {
          this.editadoMed.banco_id = this.entriesBancos[ipos].id;
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingBancos = false))
    },

  },

  mounted () {
    //this.$events.listen('testEvent', eventData => console.log(eventData));
    for (let i=0; i<=8; i++) {
      this.comprobantes[i].bg    = this.$store.state.temas.cen_panelcpr_bg
      this.comprobantes[i].dark  = this.$store.state.temas.cen_panelcpr_dark
    }
    if (this.$store.state.tipo=='PP') {
      for (let i=0; i<=this.comprobantes.length-1; i++) {
        this.comprobantes[i].activo = false
      }
      this.comprobantes[5].activo = true
      this.$store.commit('closeAlert')
      moment.locale('es');
      if (!this.isLoggedIn) {
        return router.push('/login');
      } else {
        this.anio = moment().format('YYYY')
        this.leoAnios().then(data => {
          this.selectTipoDeComprobante('Pedidos', true)
        })
      }
    } else {
      if (this.sucursalDemo) {
        this.comprobantes[0].activo = false
        this.comprobantes[1].activo = false
        this.comprobantes[2].activo = false
      } else {
        this.comprobantes[0].activo = this.rol(5, 'ver')  //0
        this.comprobantes[1].activo = this.rol(6, 'ver')  //1
        this.comprobantes[2].activo = this.rol(7, 'ver')  //2
      }
      this.comprobantes[3].activo = this.rol(8,   'ver')  //3
      this.comprobantes[4].activo = this.rol(9,   'ver')  //4
      this.comprobantes[5].activo = this.rol(10,  'ver')  //5
      this.comprobantes[6].activo = this.rol(11,  'ver')  //6
      this.comprobantes[7].activo = this.rol(104, 'ver')  //7
      this.comprobantes[8].activo = true                  // ver
      //this.comprobantes[7].activo = this.roles[11].acceder

      this.filtrosEstadosCprs = []
      this.filtrosEstadosCprs.push({tip: 'Todos', ctt: '1'})
      this.filtrosEstadosCprs.push({tip: 'Facturas Pendientes', ctt: '0'})
      this.filtrosEstadosCprs.push({tip: 'NDD Pendientes', ctt: '0'})
      this.filtrosEstadosCprs.push({tip: 'NDC Pendientes', ctt: '0'})
      this.filtrosEstadosCprs.push({tip: 'Remitos Pendientes', ctt: '0'})
      this.filtroEstadoCprsSel = 'Todos'

      this.$store.commit('closeAlert')
      moment.locale('es');
      if (!this.isLoggedIn) {
        return router.push('/login');
      } else {
        this.anio = moment().format('YYYY')
        this.leoAnios().then(data => {
          if (this.externo) {
            this.$store.commit("setCentrales", { ventas_panel: 'Pedidos' }, { root: true });
            this.filtroComprobanteSel = 'Pedidos'
            this.selectTipoDeComprobante(this.centrales.ventas_panel, true)
          } else {
            if (this.centrales.ventas_panel=='') {
              this.$store.commit("setCentrales", { ventas_panel: this.sucursalDemo ? 'Presupuestos' : 'Facturas' }, { root: true });
            }
            if (this.sucursalDemo) {
              this.$store.commit("setCentrales", { ventas_panel: 'Presupuestos' }, { root: true });
              this.selectTipoDeComprobante(this.centrales.ventas_panel, true)
            } else {
              let pos = this.comprobantes.findIndex(i => i.nombre === this.centrales.ventas_panel);
              if (this.comprobantes[pos].activo) {
                this.selectTipoDeComprobante(this.centrales.ventas_panel, true)
              } else {
                for ( let i=0; i<= this.comprobantes.length-1; i++) {
                  if (this.comprobantes[i].activo) {
                    this.selectTipoDeComprobante(this.comprobantes[i].nombre, true)
                    break
                  }
                }
              }
            }
          }
          if (this.centrales.ventas_buscar!='') {
            this.search = this.centrales.ventas_buscar
          }
          this.setGrillaPrincipal()
          this.headersItems[0].text = this.$store.state.codigooid  == 'C'?'Código':'ID'
          this.headersItems[0].value = this.$store.state.codigooid == 'C'?'articulo.codigo':'articulo.id'
          this.headersArt[0].text = this.$store.state.codigooid    == 'C'?'Código':'ID'
          this.headersArt[0].value = this.$store.state.codigooid   == 'C'?'codigo':'articulo_id'
          this.headersSelArtPedErr[0].text = this.$store.state.codigooid   == 'C'?'Código':'ID'
          this.headersSelArtPedErr[0].value = this.$store.state.codigooid   == 'C'?'codigo':'art_id'
          this.headersTransfPed[0].text = this.$store.state.codigooid   == 'C'?'Código':'ID'
          this.headersTransfPed[0].value = this.$store.state.codigooid   == 'C'?'codigo':'articulo_id'
          this.headersNdcxDev[0].text = this.$store.state.codigooid   == 'C'?'Código':'ID'
          this.headersNdcxDev[0].value = this.$store.state.codigooid   == 'C'?'cpdigo':'articulo_id'
          // hev021
        })
      }
    }
  },

  created () {
    for (let i=0; i<=8; i++) {
      this.comprobantes[i].bg    = this.$store.state.temas.cen_panelcpr_bg
      this.comprobantes[i].dark  = this.$store.state.temas.cen_panelcpr_dark
    }

    return HTTP().post('/iniventas').then(({ data }) => {

      this.equipo = data.equipo
      this.medios = data.tarjetascobros
      this.banItems = data.bancos
      this.ivaTasas = data.afipiva
      this.monItems = data.afipmonedas

      let psuc = data.sucursales.findIndex(x=>x.id==this.sucursal);
      for (let i=0; i<= data.sucursales[psuc].depositos.length-1; i++) {
        this.depItems.push(data.sucursales[psuc].depositos[i])
      }

      //this.listarHTTP(false);
      // CUANDO ES DEMO sucursalesPosibles VA VACIA, SINO CARGO LA ACTUAL EN [0] Y LA DEMO en [1]. 
      if (this.sucursalDemo) {
        this.sucursalesPosibles = []
      } else {
        this.sucursalesPosibles.push({
          sucursal: this.sucursal,
          sucursalFiscal: this.sucursalFiscal,
          tema: this.tema,
          sucursalDemo: this.sucursalDemo,
        })
        let pos = this.sucursales.findIndex(x=>x.sucursaldemo==1)
        if (pos!=-1) {
          this.sucursalesPosibles.push({
            sucursal: this.sucursales[pos].id,
            sucursalFiscal: this.sucursales[pos].fiscal,
            tema: this.sucursales[pos].tema,
            sucursalDemo: this.sucursales[pos].sucursaldemo,
          })
        }
      }
    })
  },

  methods: {
    ...mapMutations([
      'alert',
      'closeAlert',
      'setSucursal',
      'setSucursales',
      'setSucursalFiscal',
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
      'setHayPedidos',
    ]),

    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////
    closeForm(){
      router.push('/')
    },

    colorChipMaletin(val) {
      return this.maletinesCli[val].sel?'green':'red'
    },

    hayMaletin() {
      return (this.maletinesCli.length>0?true:false)
    },

    maletinDe() {
      return (this.maletinesCli.length>0?this.maletinesCli.username:'')
    },

    clickChipMaletin(val) {
      if (this.maletinesCli[val].sel) {
        this.maletinesCli[val].sel = false
        let pos = this.valores.findIndex(x=>x.maletin_id==val)
        let p = this.valores[pos].medio_id
        this.medpag[p-1].total -= this.valores[pos].importe
        this.valores.splice(pos,1);
        this.calculosMed()
      } else {
        this.medioDePagoOk = true // fuerzo a habilitar el boton de cofirmar el MDP
        this.medioDePagoId = this.maletinesCli[val].medio_id
        this.maletinesCliPos = val
        this.setFP(this.medioDePagoId, val)
      }
    },

    buscarCliente() {
      this.buscoPor = 'codigo'
      this.searchTercerosMetodo(this.editado.tercero_id, true);
    },

    cargoItemsComprobante({item}) {
      let pos = this.items.findIndex(x=>x.id == item.id)
      if (pos==-1) return
      if (this.items[pos].items==undefined||this.items[pos].items.length==0) { //.length==0) {
        if (this.filtroComprobanteSel!='Recibos') {
          return HTTP().post('comprobanteitems', { id: item.id }).then(({ data }) => {
            this.items[pos].items = data.items
          })
        } else {
          return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
            this.items[pos].cancelaciones = data.c.cancelaciones
          })
        }
      }
    },

    searchTercerosMetodo(valor, buscoSiEstaVinculado) {

      return HTTP().get('/tercero/'+valor+'/1/true/'+this.sucursal).then(({ data }) => {

        if (data=='inexistente') {
          this.mensaje('¡Cliente inexistente!', this.temas.snack_error_bg, 1500)
          this.$nextTick(() => {
            const f = this.buscarPor='codigo'?this.$refs.codigocliente:this.$refs.cliente
            f.focus();
          });
        } else {
          if (data.pedPend.id!=null && this.editado.cpr=='PED' &&  this.editedIndex==-1) {
            this.msg.msgTitle = '¡Pedido Abierto!'
            let m = '<br><b>'+data.t[0].tercero.nombre+'</b> tiene un pedido abierto: el '
            m += '<b>'+data.pedPend.cpr+'</b>. '
            m += '¡Revisa sus Artículos y Cantidades!<br><br>'
            m += 'Puedes continuar con este nuevo o puedes solicitarle a <b>'+data.t[0].tercero.nombre+'</b> '
            m += 'que anule su pedido y unifica todo en este nuevo.<br><br>'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'pedido abierto'
            this.msg.msgButtons = ['Aceptar']
            this.seleccionarArticulo = false;
          }

          this.entriesTerceros = []
          this.entriesTerceros.push(data.t[0].tercero)
          this.itemActual = data.t[0]
          this.userDelTercero = this.itemActual.tercero.user!=null ? this.itemActual.tercero.user.id : 0
          this.editado.nombre = this.itemActual.tercero.nombre
          this.userDelTerceroDatos = data.t           // para cuando es un pedido de un vendedor
          this.lisObj = [];
          let rid = data.t[0].tercero.responsable.id
          if (!(this.editado.comprobante_id >= 124 && this.editado.comprobante_id <= 126)) {     // AGREGADO 4/8/21
            if (this.responsable===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO ( VIENE DEL STORE )
              if(rid===1 || rid===2 || rid===6 || rid===9 || rid===11) {
                this.editado.letra = this.comprobantesm?'M':'A'
              } else {
                this.editado.letra = 'B'
              }
            } else if (this.responsable===6) { //EL USUARIO ES MONOTRIBUTISTA ( VIENE DEL STORE )
              this.editado.letra = 'C'
            }
          }
  
          debugger
          this.editado.tercero_id = data.t[0].tercero.id;
          this.editado.nombre = data.t[0].tercero.nombre;
          this.editado.documento = data.t[0].tercero.documento.nombre;
          this.editado.documento_id = data.t[0].tercero.documento.id;
          this.editado.documentoCodigo = data.t[0].tercero.documento.codigo;
          this.editado.documentoNumero = data.t[0].tercero.cuit;
          this.editado.responsableAbrev = data.t[0].tercero.responsable.abrev;

          this.editado.vendedor = {id: null, nombre: 'MOSTRADOR'}
          if (data.t[0].vendedor!=undefined) {
            this.editado.vendedor = data.t[0].vendedor
          }

          this.editado.usaElSistema = false
          if (data.t[0].tercero.user!=undefined) {
            this.editado.usaElSistema = data.t[0].tercero.user.usaelsistema
          }

          this.dirItems = []
          for (let i=0; i<= data.t[0].tercero.direcciones.length-1; i++) {
            this.dirItems.push(data.t[0].tercero.direcciones[i])
          }

          this.editado.direccion_id = this.dirItems[0].id
          this.ctacte = data.t[0].ctacte
          this.diasvenc = data.t[0].diasvenc
          this.bonificacionmaxima = data.t[0].bonificacionmaxima
          this.creditomaximo = data.t[0].creditomaximo

          this.medpag[3].activo = false       // tarjeta de credito desabilitada
          if (this.editado.cpr=='REM') {
          } else if (this.editado.cpr!='REC') {
            this.medpag[3].activo = this.ctacte
          }

          this.editado.mediodepago_id = 1
          this.editado.deposito_id = this.depItems[0].id
          this.cargoSaldosYValoresPendientes(this.editado.tercero_id)
  
          // PEDIDOS: EL CLIENTE DEL VENDEDOR DEBE ESTAR REGISTRADO EN GOHU
          if (this.editado.cpr.substring(0,3)=='PED' &&
              this.editado.vendedor.id!=null && this.userDelTerceroDatos[0].tercero.user==null) {
            this.msg.msgTitle = '¡Cliente no Registrado!'
            let m = '<br>Debes registrar a este Cliente en <b>gohu</b> para que puedas ingresarle pedidos.<br><br>'
            m += 'Invita a '+data.t[0].tercero.razon_social+' a registrarse, '
            m += 'o bien puedes generarle un registro como <b><i>Cliente Exclusivo</i></b> desde la opción <i>Clientes</i>/'
            m += '<i>Menú Acciones</i>/<i>Generar Cuenta Exclusiva en gohu</i>.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'cliente no registrado'
            this.msg.msgButtons = ['Aceptar']
            this.seleccionarArticulo = false;
            this.$nextTick(() => {
              const f = this.$refs.cliente;
              f.focus();
            });
          }
  
          this.turnosFacturar = []
          if (this.$store.state.turnos) {
            if ((!this.sucursalDemo && this.editado.cpr=='FAC') || (this.sucursalDemo && this.editado.cpr=='PRE')) {
              if (this.editado.tercero_id!='') {
                return HTTP().get('/turnosfacturar/'+this.editado.tercero_id).then(({ data }) => {
                  for (let i=0; i<=data.length-1; i++) {
                    this.turnosFacturar.push({
                      id: data[i].id,
                      fecha: moment(data[i].fecha).format('DD-MM-YYYY HH:mm'),
                      articulo_id: data[i].articulo.id,
                      codigo: data[i].articulo.codigo,
                      nombre: data[i].articulo.nombre,
                      costo: data[i].articulo.precios[0].costo,
                      precio: data[i].articulo.precios[0].precio,
                      iva_id: data[i].articulo.iva_id,
                      moneda_id: data[i].articulo.moneda_id,
                    })
                  }
                  this.dialogSelTurnos = this.turnosFacturar.length ? true : false;
                })
              }
            }
          }
        }
      })
    },

    editadoArtStock(stock) {
      return stock==null ? 'Sin Stock' : 'stk '+this.formatoImporte(stock)
    },

    itemIvaTasa(iva) {
      let pos = this.ivaTasas.findIndex(x=>x.id==iva)
      return pos!=-1?this.ivaTasas[pos].tasa+'%':'0'+'%'
    },

    sayTarjeta(inf) {
      let say = ''
      if (inf.tarjetanombre!=null) {
        say = inf.tarjetanombre
      }
      if (inf.banconombre!=null) {
        say += ' ' + inf.banconombre
      }
      if (inf.debito) {
        say += ' con un recargo del ' + this.roundTo(inf.recargo,2) + '%'
      } else {
        say += ' en ' + inf.cuotas + ' cuota/s'
        say += ' y un interés del ' + this.roundTo(inf.interes,2)+'%'
      }
      return say
    },

    buscoSiElTerceroEstaVinculado() {

      this.clienteVinculado = false
      if (this.editado.tercero_id!=null && (this.editado.cpr=='FAC' || this.editado.cpr=='REC')) {

        if (this.editado.vendedor.id!=null && this.editado.cpr=='FAC') {

          /*
          this.msg.msgTitle = 'Cliente con Vendedor'
          let msg = '<b>'+this.editado.nombre+'</b> pertenece al vendedor '+this.editado.vendedor.nombre+'. ';
          if (this.editado.usaElSistema) {
            msg += 'El cliente usa el sistema, él o '+this.editado.vendedor.nombre+' deberán realizar el pedido correspondiente.' 
          } else {
            msg += 'El cliente no usa el sistema, por lo tanto ' 
            msg += this.editado.vendedor.nombre+' deberá realizar el pedido correspondiente.' 
          }
          this.msg.msgBody = msg
          this.msg.msgVisible = true
          this.msg.msgAccion = 'cliente vinculado'
          this.msg.msgButtons = ['Aceptar']
          */

          // SE PUEDEN REALIZAR FACTURAS A CLIENTES VINCULADOS SIN PEDIDOS PREVIOS
          // LA API DA DE ALTA EL PEDIDO Y REALIZA LA VINCULACION DE COMPROBANTES
          this.clienteVinculado = true

        } else {

          return HTTP().get('/user/'+this.userDelTercero).then(({ data }) => {
            let pos = this.vinculosHijos.findIndex(x=>x==this.userDelTercero)
//          if (pos!=-1&&data[0].usaelsistema&&data[0].userexclusivo_id!=this.userId) {
            if (pos!=-1&&data[0].usaelsistema) {
              this.msg.msgTitle = 'Cliente Vinculado'
              let msg = 'El cliente esta vinculado, debes pedirle que te realice un '
              msg += this.editado.cpr=='FAC'?'pedido.':'pago.'
              this.msg.msgBody = msg
              this.msg.msgVisible = true
              this.msg.msgAccion = 'cliente vinculado'
              this.msg.msgButtons = ['Aceptar']
              this.clienteVinculado = true
              return true
            }

          })

        }

      }
    },

    arreglarPedido() {
      this.msg.msgTitle = 'Arreglar Pedido'
      this.msg.msgBody = 'Confirma arreglar el pedido?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'arreglar pedido'
      this.msg.msgButtons = ['Aceptar', 'Cancelar']
    },

    arreglarPedidoHTTP(){
      return HTTP().post('/arreglarpedido', { proveedor: this.itemActual.tercero.user.id, errores: this.selArtPedErr }).then(({ data }) => {
        if (data=='ok') {
          this.msg.msgTitle = 'Pedido arreglado'
          this.msg.msgBody = 'El pedido ha sido arreglado!<br>Puede enviarlo al Proveedor.<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'pedido arreglado'
          this.msg.msgButtons = ['Aceptar']
        } else if (data=='error') {
          this.msg.msgTitle = 'El Pedido no se pudo arreglar'
          this.msg.msgBody = 'El pedido no se ha podido arreglar<br>Reintente, si el problema persiste consulte con sistemas<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'pedido no se pudo arreglar'
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialogError = false
        this.listarHTTP(false)
      })
    },

    finalizarPedido(item) {
      return HTTP().post('/puedeenviarpedido/',{
        id: item.id, dolar:this.dolar, proveedor_id:item.tercero.user.id, vinculos:this.vinculosPadres}).then(({data})=>{
        this.selArtPedErr = []
        for (let i=0; i<=data.length-1; i++) {
          let msg = ''
          if (data[i].stock<0) {
            msg = 'Stock '
          }
          if (data[i].preciopedido!=data[i].precioactual) {
            msg += 'Precios '
          }
          if (data[i].pubestado!='P') {
            msg += 'Pub/pausada'
          }
          if (msg!='') {
            this.selArtPedErr.push({
              art_id: data[i].art_id,
              cpritem_id: data[i].cpritem_id,
              codigo: data[i].codigo,
              nombre: data[i].nombre,
              unped: data[i].unped,
              stock: data[i].unped+data[i].stock,
              preped: data[i].preciopedido,
              preact: data[i].precioactual,
              texto: data[i].texto,
              err: msg
            })
          }
        }
        if (this.selArtPedErr.length>0) {
          this.dialogError = true
        } else {
          return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
            this.preguntoEnvio(data.c) 
          })
        }
      })
    },

    preguntoEnvio (item) {
      this.msg.msgTitle = 'Enviar Pedido'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'finalizar y enviar pedido al proveedor'
      let txt = ''
      if (item.items.length==0) {
        this.msg.msgBody = 'Este pedido no posee items. Agrege items para poder enviar el pedido.'
        this.msg.msgButtons = ['Cerrar']
      } else {
        txt += '<br>El pedido posee '+(item.items.length)+' item/s.<br>'
        if (item.tercero.user) {
          txt += '<br>¿Confirmas enviar el pedido a Administración?<br><br>'
        } else {
          txt += '¿Confirmas enviar el pedido a '+item.tercero.nombre+'?<br><br>'
          txt += 'Y será enviado por correo electrónico en formato Excel.<br>'
        }
        this.msg.msgBody = txt
        this.msg.msgButtons = ['Aceptar','Cancelar']
      }
      this.itemActual = item;
    },

    cargoSaldosYValoresPendientes(tercero) {
      this.saldoctacte = 0
      this.valorespendientes = 0
      this.disponible = 0
      return HTTP().get('/saldo/'+tercero).then(({ data }) => { 

        if (data.saldo.length) {
          this.saldoctacte = data.saldo[0].pendientes
        }
        if (data.valorespendientes.length) {
          this.valorespendientes = data.valorespendientes[0].valorespendientes
        }

        if (this.creditomaximo == null) {
          this.creditomaximo = 999999999999
        }
        this.disponible        = this.roundTo(this.creditomaximo-(this.saldoctacte+this.valorespendientes),2)
        this.creditomaximo     = this.formatoImporte(this.roundTo(this.creditomaximo,2))
        this.saldoctacte       = this.formatoImporte(this.roundTo(this.saldoctacte,2))
        this.valorespendientes = this.formatoImporte(this.roundTo(this.valorespendientes,2))
        this.calculos()
        this.tienesaldo = true
        if (this.editado.texto == 'FACPED' && this.disponible < this.editado.total) {
          this.msg.msgTitle = 'Saldo Insuficiente'
          let msg = 'El cliente no posee saldo suficiente para poder realizar esta operación.<br><br>'
          msg += 'El crédito asignado es: $'+this.creditomaximo+'<br>'
          msg += 'El saldo disponible es: $'+this.formatoImporte(this.disponible)+' * <br>'
          msg += 'Y el total del pedido es: $'+this.formatoImporte(this.editado.total)+'<br>'
          msg += 'Faltan $'+this.formatoImporte(this.editado.total-this.disponible)+' para poder seguir.<br><br>'
          msg += '* La deuda se compone de las facturas con saldos pendientes ($'+this.saldoctacte+') '
          msg += 'mas los valores aún no acreeditados en pagos realizados.<br><br>'
          msg += 'Las alternativas son dos:<br>'
          msg += '1) Incrementar el crédito máximo asignado a este cliente.<br>'
          msg += '2) Pedirle al cliente que cancele deuda por el monto indicado para poder continuar.<br>'
          this.msg.msgBody = msg
          this.msg.msgVisible = true
          this.msg.msgAccion = 'saldo insuficiente'
          this.msg.msgButtons = ['Aceptar']
          this.tienesaldo = false
        }
      })
    },

    leerDirPdr() {
      /*
      VER ESTO YA QUE NO ESTA EL userspuntosderetirosdir en el controlador
      return HTTP().get('/userspuntosderetirosdir/'+this.envio.puntoderetiro_id).then(({ data }) => {
        this.dirItemsPdrDir = []
        for (let i=0; i<= data[0].direcciones.length-1; i++) {
          this.dirItemsPdrDir.push(data[0].direcciones[i])
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTercerosPdr = false))
      */
    },

    sayZona(item) {
      if (item.tercero) {
        if (item.tercero.usersterceros.length>0) {
          if (item.tercero.usersterceros[0].zona.length>0) {
            if (item.tercero.usersterceros[0].zona[0].zona_id!=null) {
              return item.tercero.usersterceros[0].zona[0].zonas.nombre.substring(0,14)
            } else {
              return 'sin zona'
            }
          }            
        }
      }
    },

    sayItemActualViaje(datoSay) {
      if (this.itemActualViaje==null) return ''
      if (datoSay=='id') {
        return this.itemActualViaje.id
      } else if (datoSay=='zona') {
        if (this.itemActualViaje.zona) {
          return this.itemActualViaje.zona.nombre
        } else {
          return ''
        }
      }
    },

    sayMessage(item, open) {
      if (item.cpr==undefined) { return }
      if (item.estado == 'F' && 
        (item.cpr.substring(0,3)=='FAC' || item.cpr.substring(0,3)=='NDD' || item.cpr.substring(0,3)=='NDC')) {
        if (item.pendientes.length) {
          if (item.pendientes[0].cancelaciones.length) {
            return item.pendientes[0].cancelaciones[0].cancelador.cpr+' $'+this.formatoImporte(item.pendientes[0].cancelaciones[0].importe)
          }
        }
      }
    },

    descuentoProbable(item, open) {
      if (item.estado == 'F' && item.importedescuento==0 && (item.cpr.substring(0,3)=='FAC' || item.cpr.substring(0,3)=='PRE')) {
        if (item.pendientes.length&&item.tercero.usersterceros.length) {
          return (item.tercero.usersterceros[0].usermedio_id!=null&&item.pendientes[0].importe==item.pendientes[0].pendiente)?'des?':''
        }
      }
    },

    rol (i, accion) {
      if (this.externo && accion=='acceder') {
        return (i==5) ? true : false
      }
      if (this.sucursalDemo && i < 3) { return false }
      if (this.$store.state.level<=2) { return true }
      const op = this.$store.state.roles.map(el => el.opcion_id);
//    const po = op.indexOf(i+5);
      const po = op.indexOf(i);
      if (po==-1 && accion=='ver') {
        return false
      } else {
        if (accion=='ver' && this.roles[po].acceder) {
          return true
        } else  if (accion=='agregar' && this.roles[po].agregar) {
          return true
        } else if (accion=='editar' && this.roles[po].editar) {
          return true
        } else if (accion=='desactivar' && this.roles[po].desactivar) {
          return true
        }
        return false
      }
    },

    selectTipoDeComprobante(cual, listar) {
      this.filtroComprobanteSel = cual
      this.$store.commit("setCentrales", { ventas_panel: cual }, { root: true });
      if (cual=='Facturas') {
        this.filtroComprobante = [1,6,11,51,128] //128? CIN-X, NO VAN ACA
      } else if (cual=='Débitos') {
        this.filtroComprobante = [2,7,12,52]
      } else if (cual=='Créditos') {
        this.filtroComprobante = [3,8,13,53]
      } else if (cual=='Remitos') {
        this.filtroComprobante = [125]
      } else if (cual=='Pedidos') {
        this.filtroComprobante = [126]   // 129/130
      } else if (cual=='Presupuestos') {
        this.filtroComprobante = [124]
      } else if (cual=='Recibos') {
        if (this.sucursalDemo) {
          this.filtroComprobante = [4,9,15,54] // [127]
        } else {
          this.filtroComprobante = [4,9,15,54]
        }
      } else if (cual=='Retiros') {
        this.filtroComprobante = [134]
      } else if (cual=='Viajes') {
        this.filtroComprobante = []
      }
      this.setGrillaPrincipal()
      if (listar) {
        this.listarHTTP(false)
      }
    },

    setAcciones(item) {
      this.acciones = []
      if (this.$store.state.tipo=='PP') {

        this.acciones.push({nombre: 'Detalles', icon: 'mdi-glasses'})
        this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})

      } else if (this.filtroComprobanteSel=='Viajes') {

        this.itemActualViaje = item
        if (this.itemActualViaje.estado=='P'||this.itemActualViaje.estado=='I'||this.itemActualViaje.estado=='D') {
          this.acciones.push({nombre: 'Administrar', icon: 'mdi-nut'})
          if (this.itemActualViaje.estado=='D') {
            this.acciones.push({nombre: 'Enviar a Reparto', icon: 'mdi-truck-delivery'})
          }
        } else if (this.itemActualViaje.estado=='R') {
          this.acciones.push({nombre: 'Administrar', icon: 'mdi-nut'})
//      } else if (this.itemActualViaje.estado=='F'||!this.itemActualViaje.todocobrado) {
//        this.acciones.push({nombre: 'Recepción de Maletines', icon: 'mdi-18px mdi-briefcase-check'})
        } else {
        } 
        this.acciones.push({nombre: 'Planilla Resúmen', icon: 'mdi-content-paste'})
        this.acciones.push({nombre: 'Planilla de Stock', icon: 'mdi-content-paste'})

      } else {

        this.itemActual = item
        if (!this.operarioEsVendedor) {      
          this.acciones.push({nombre: 'Detalles', icon: 'mdi-glasses'})
          this.acciones.push({nombre: 'WhatsApp', icon: 'mdi-whatsapp'})
          this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})
          this.acciones.push({nombre: 'Rastrear', icon: 'mdi-move-resize-variant'})
        }
        if (item.cpr.substring(0,3)=='RTV') {
          if (item.estado=='P') {
            this.acciones.push({nombre: 'Editar', icon: 'mdi-backup-restore'})
            this.acciones.push({nombre: 'Facturar', icon: 'mdi-file-document'})
          }
        } else if (item.cpr.substring(0,3)=='PED') {
          if (this.operarioEsVendedor) {
            if (item.quienpidio=='V') {
              if (item.estado=='P') {
                this.acciones.push({nombre: 'Artículos', icon: 'mdi-barcode'})
                this.acciones.push({nombre: 'Finalizar Pedido', icon: 'mdi-file-document'})
                this.acciones.push({nombre: 'Anular', icon: 'mdi-backup-restore'})
              }
            } else {
              if(this.pedTransfAVend) {
                this.acciones.push({nombre: 'Tomar Control', icon: 'mdi-file-check'})  
              }
              this.acciones.push({nombre: 'Timeline', icon: 'mdi-filmstrip'})
            }

          } else {
            if (item.rating==null&&item.estado!='I') {

              if (item.quienpidio=='C'||item.observaciones=='PARTICIONADO') {
                if (item.estado=='R') {
                  this.acciones.push({nombre: 'Dar por concluido', icon: 'mdi-file-document'})
                } else if (item.estado!='T' && item.estado!='P' && item.estado!='E' && item.estado!='B') {
                  this.acciones.push({nombre: 'Anular', icon: 'mdi-backup-restore'})
                }
              }
              if (item.estado=='L'||item.estado=='R'||item.estado=='P') {
                this.acciones.push({nombre: 'Modificar Pedido', icon: 'mdi-playlist-check'})
                if (this.sucursales.length>1 && item.observaciones!='PARTICIONADO') {
                  this.acciones.push({nombre: 'Transferir a otra Sucursal', icon: 'mdi-file-document'})
                }
              }
              if (item.estado!='T'&&item.estado!='B') {
                if (this.sucursalDemo) {
                  this.acciones.push({nombre: 'Presupuestar', icon: 'mdi-file-document'})
                } else {
                  this.acciones.push({nombre: 'Facturar', icon: 'mdi-file-document'})
                }
              }
  /*
              if (item.estado!='E'&&item.reparto_id==null&&item.tercero.direcciones[0].zona.length>0) {
                this.acciones.push({nombre: 'A Reparto', icon: 'mdi-truck-delivery'})
              }
  */
 /*
              if (item.estado!='E'&&item.estado!='R'&&item.tercero.direcciones[0].zona.length>0) {
                this.acciones.push({nombre: 'A Reparto', icon: 'mdi-truck-delivery'})
              }
*/
//            if (item.estado=='B'&&item.reparto_id==null) {
              if (item.estado=='T'&&item.reparto_id==null) {
                this.acciones.push({nombre: 'Enviar', icon: 'mdi-truck'})
                this.acciones.push({nombre: 'Retira', icon: 'mdi-account-check'})
              }
            }
 
            this.acciones.push({nombre: 'Timeline', icon: 'mdi-filmstrip'})
          }
        }
        if (item.cae) {
          this.acciones.push({nombre: 'Ver en AFIP', icon: 'mdi-bank'})
        }
        if ((!this.sucursalDemo && item.cpr.substring(0,3)=='FAC') ||
           (this.sucursalDemo && item.cpr.substring(0,3)=='PRE')) {
          if (this.cobrar(item)) {
            this.acciones.push({nombre: 'Cobrar', icon: 'mdi-sticker-emoji'})
            this.acciones.push({nombre: 'Solicitar Pago', icon: 'mdi-email-outline'})
          }
        }
        if (item.cpr.substring(0,3)=='FAC' && item.estado=='F') {
          if (!this.tieneRemito(item)) {
            this.acciones.push({nombre: 'Aplicar Remito', icon: 'mdi-truck'})
          } else {
            this.acciones.push({nombre: 'Ir al Remito', icon: 'mdi-truck'})
          }
        }
        if ((item.cpr.substring(0,3)=='FAC'||(item.cpr.substring(0,3)=='PRE'&&this.sucursalDemo)) && item.estado=='F') {
          if (this.roles.length>0) {
            if (this.roles[6].acceder) {
              this.acciones.push({nombre: 'Aplicar NDC', icon: 'mdi-file-percent'})
            }
            if (this.roles[5].acceder) {
              this.acciones.push({nombre: 'Aplicar NDD', icon: 'mdi-file-plus'})
            }
          } else {
            this.acciones.push({nombre: 'Aplicar NDC', icon: 'mdi-file-percent'})
            this.acciones.push({nombre: 'Aplicar NDD', icon: 'mdi-file-plus'})
          }
        }
        if (item.cpr.substring(0,3)=='NDC' && item.estado=='F') {
          this.acciones.push({nombre: 'Generar FAC', icon: 'mdi-file-document'})
        }
        if (item.cpr.substring(0,3)=='PRE' && (item.estado=='P' && !this.sucursalDemo)) {
          this.acciones.push({nombre: 'Facturar', icon: 'mdi-file-document'})
        }
        if (item.cpr.substring(0,3)=='PRE' && (item.estado=='F' && this.sucursalDemo)) {
          this.acciones.push({nombre: 'Anular', icon: 'mdi-autorenew'})
        }
        if (item.cpr.substring(0,3)=='REC' && item.estado=='F') {
          return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
            this.itemActual = data.c
            this.acciones.push({nombre: 'Anular', icon: 'mdi-backup-restore'})
            let hayCheques = false
            for (let i=0; i<=this.itemActual.valoresIngresos.length-1; i++) {
              if (this.itemActual.valoresIngresos[i].medio_id==6) {
                hayCheques = true
              }
            }
            if (hayCheques) {
              this.acciones.push({nombre: 'Generar NDD', icon: 'mdi-file-plus'})
            }
          })
        }
      }
    },

    async selAccion(item) {
      if (item.nombre=='Administrar') {
        debugger
        this.administracionPedidos(this.itemActualViaje)
      } else if (item.nombre=='Enviar a Reparto') {
        this.viajeListoParaReparto(this.itemActualViaje)
      } else if (item.nombre=='Detalles') {
        this.printDetalles(this.itemActual)
      } else if (item.nombre=='WhatsApp') {
        this.whatsapp(this.itemActual)
      } else if (item.nombre=='Imprimir') {
        this.print(this.itemActual)
      } else if (item.nombre=='Solicitar Pago') {
        this.enviarMail(this.itemActual)
      } else if (item.nombre=='Rastrear') {
        this.rastrear(this.itemActual)
      } else if (item.nombre=='Modificar Pedido') {
        this.chequearArtPed(this.itemActual)
      } else if (item.nombre=='Transferir a otra Sucursal') {
        this.chequearTransfPed(this.itemActual,1)
//    } else if (item.nombre=='A Reparto') {
//      this.aRepartoHTTP(this.itemActual)
      } else if (item.nombre=='Modificar') {
        this.modificarPedido(this.itemActual)
      } else if (item.nombre=='Artículos') {
        this.editarPedido(this.itemActual)
      } else if (item.nombre=='Finalizar Pedido') {
        this.finalizarPedido(this.itemActual)
      } else if (item.nombre=='Enviar') {
        this.prepararEnvioRetiro(this.itemActual, 'E')
      } else if (item.nombre=='Retira') {
        this.prepararEnvioRetiro(this.itemActual, 'R')
      } else if (item.nombre=='Abrir') {
        this.selVjeClick(this.itemActualViaje)
      } else if (item.nombre=='Facturar') {

        return HTTP().post('comprobante', { id: this.itemActual.id }).then(({ data }) => {
          this.itemActual = data.c
          if (!this.sucursalDemo) {
            if (this.itemActual.cpr.substring(0,3)=='PRE') {
              this.nuevo('facpre', this.itemActual)
            } else {
              // OJO ACA, BUSCO LOS DIAS DE VENCIMIENTO EL CLIENTE, VIENE del modelo TerceroUser, el tema
              // es que esa relacion me trae todos los usuarios que estan relacionados a este tercero.
              // por eso el for. La otra seria hacer un get() directamente a TerceroUser
              if (this.itemActual.tercero.users!=null) {
                let pos = this.itemActual.tercero.users.findIndex(x=>x.user_id == this.userId )
                if (pos!=-1) {
                  this.diasvenc = this.itemActual.tercero.users[pos].diasvenc
                }
              }
              this.nuevo(this.itemActual)
            }
          }
        })

      } else if (item.nombre=='Presupuestar') {
        if (this.itemActual.cpr.substring(0,3)=='PED' || this.itemActual.cpr.substring(0,3)=='RTV') {
          this.nuevo(this.itemActual)
        }
      } else if (item.nombre=='Cobrar') {
        this.nuevo('REC',this.itemActual)
      } else if (item.nombre=='Aplicar Remito') {
        this.nuevo('remfac', this.itemActual)
      } else if (item.nombre=='Ir al Remito') {
        this.irAlRemito(this.itemActual)
      } else if (item.nombre=='Anular') {
        if (this.itemActual.cpr.substring(0,3)=='REC') {
          this.anularRecibo(this.itemActual)
        } else if (this.itemActual.cpr.substring(0,3)=='PRE') {
          this.anularPresupuesto(this.itemActual)
        } else if (this.itemActual.cpr.substring(0,3)=='PED') {
          this.anularPedido(this.itemActual)
        }
      } else if (item.nombre=='Aplicar NDC') {

        this.ndcMotivoSel  = 1
        this.dialogNdcxDev = false
        let b = await this.controlNdc(this.itemActual)
        if (!b) {
          this.msg.msgTitle = 'ERROR'
          if (this.sucursalDemo) {
            this.msg.msgBody = 'Este presupuesto no posee saldo ni items para devolver. No podra realizar Notas de Crédito.'
          } else {
            this.msg.msgBody = 'Esta factura no posee saldo ni items para devolver. No podra realizar Notas de Crédito.'
          }
          this.msg.msgVisible = true
          this.msg.msgAccion = 'Saldo insuficiente'
          this.msg.msgButtons = ['Aceptar']
          this.dialogNdcFac = false
          return
        }
        this.nuevo('ndcfac', this.itemActual)

      } else if (item.nombre=='Aplicar NDD') {

        this.dialogNddxDev = false
        if (this.itemActual.cpr.substring(0,3)=='FAC') {
          this.nddMotivos = [
            {id: 2, nombre: 'MORA'}, {id: 3, nombre: 'CAMBIO DE PRECIO'}
          ]
        } else if (this.itemActual.cpr.substring(0,3)=='REC') {
          this.nddMotivos = [
            {id:1, nombre: 'CHEQUES RECHAZADOS'}
          ]
          HTTP().get('/chequesarechazar/'+this.itemActual.id).then(({ data }) =>{
            this.selected = []
            this.cheques = []
            for (let i=0; i<=data.length-1; i++) {
              let d = 0
              let hoy = moment()
              d = hoy.diff(data[i].fechafinanciera, 'days')
              this.cheques.push({
                id:               data[i].id,
                codban:           data[i].codigo,
                nomban:           data[i].nomban==null ? '' : data[i].nomban.substring(0,12),
                cuitlib:          data[i].cuitlib,
                nomlib:           data[i].nomlib==null ? '' : data[i].nomlib.substring(0,12),
                cuenta:           data[i].cuenta,
                nrovalor:         data[i].nrovalor,
                fechafinanciera:  data[i].fechafinanciera,
                dias:             d,
                importe:          data[i].importe,
                cuentaorigen_id:  data[i].cuentaorigen_id,
                cuentadestino_id: data[i].cuentadestino_id,
                banco_id:         data[i].banco_id,
                cheque_id:        data[i].cheque_id,
                observ:           data[i].observ,
                seleccionado:     0,
              })
            }
            this.dialogNddxDev = true
          })
        }
        this.nuevo('nddfac', this.itemActual)
      } else if (item.nombre=='Solicitar Pago') {
        this.solicitarPago(this.itemActual)
      } else if (item.nombre==='Timeline') {
        this.leerTimeLine(this.itemActual)
      } else if (item.nombre==='Ver en AFIP') {
        this.verCprEnAFIPHTTP(this.itemActual)
      } else if (item.nombre==='Editar') {
        this.editarRetiroDeMercaderia(this.itemActual)
      } else if (item.nombre==='Planilla Resúmen') {
        this.printViaje(this.itemActual)
      } else if (item.nombre==='Planilla de Stock') {
        this.printViajeStock(this.itemActual)
      } else if (item.nombre==='Dar por concluido') {
        this.concluirPedido(this.itemActual)
      }
    },

    selVjeClick (item, row) {
      if (this.filtroComprobanteSel=='Viajes') {
        this.itemActualViaje = item
        this.administracionPedidos(item)
      }
    },

    selMaletinClick (item, row) {
      this.dialogVerSelMaletines = false

      debugger
      this.setDatosRecibo(item)
    },

    setDatosRecibo(maletin) {
      //Pueden venir mas de 1 maletin pendiente, ( todos los que tengan valor_id == null )
      let rid = this.itemActualCliente.t[0].tercero.responsable.id
      if (this.responsable===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO ( VIENE DEL STORE )
        if(rid===1 || rid===2 || rid===6 || rid===9 || rid===11) {
          this.editado.letra = this.comprobantesm?'M':'A'
          this.editado.comprobante_id = this.comprobantesm?51:4
        } else {
          this.editado.letra = 'B'
          this.editado.comprobante_id = 9
        }
      } else if (this.responsable===6) { //EL USUARIO ES MONOTRIBUTISTA ( VIENE DEL STORE )
        this.editado.letra = 'C'
        this.editado.comprobante_id = 17
      }
      
      this.itemActual = this.itemActualCliente.t[0]
      this.editado.cpr = 'REC'
      this.editado.tercero_id = this.itemActualCliente.t[0].tercero.id;
      this.editado.nombre = this.itemActualCliente.t[0].tercero.nombre;
      this.editado.documento = this.itemActualCliente.t[0].tercero.documento.nombre;
      this.editado.documento_id = this.itemActualCliente.t[0].tercero.documento.id;
      this.editado.documentoCodigo = this.itemActualCliente.t[0].tercero.documento.codigo;
      this.editado.documentoNumero = this.itemActualCliente.t[0].tercero.cuit;
      this.editado.responsableAbrev = this.itemActualCliente.t[0].tercero.responsable.abrev;
      
      this.dirItems = []
      for (let i=0; i<= this.itemActualCliente.t[0].tercero.direcciones.length-1; i++) {
        this.dirItems.push(this.itemActualCliente.t[0].tercero.direcciones[i])
      }
      this.editado.direccion_id = this.dirItems[0].id
      
      let totACancelar = 0
      let pendMaletin = 0
      let cancelando = 0
      if (this.hayMaletin()) {
        for (let i=0; i<=this.maletinesCli.length-1; i++) {
          this.maletinesCli[i].sel = false
          totACancelar += this.maletinesCli[i].importe
          let pos = this.medpag.findIndex(x=>x.id==this.maletinesCli[i].medio_id)
          this.maletinesCli[i].medpagnom = pos!=-1?this.medpag[pos].abrev:'error'
        }
        pendMaletin = totACancelar
        cancelando = totACancelar
      }

      return HTTP().get('/pendientes/'+this.itemActualCliente.t[0].tercero.id+'/'+this.sucursal).then(( { data }) => {

        this.pend = []
        let totPend = 0
        for ( let i=0; i<= data.length-1; i++) {
          if (this.hayMaletin()) {               // HAY MALETIN
            if (data[i].pendiente>=cancelando) {
              this.pend.push({
                id: data[i].id, cpr: data[i].cpr, importe: data[i].importe,
                vencimiento: moment(data[i].vencimiento).format('YYYY-MM-DD'),
                pendiente: data[i].pendiente, acancelar: cancelando, acciones: '' 
              })
              totPend += cancelando
              break
            } else {
              this.pend.push({
                id: data[i].id, cpr: data[i].cpr, importe: data[i].importe,
                vencimiento: moment(data[i].vencimiento).format('YYYY-MM-DD'),
                pendiente: data[i].pendiente, acancelar: data[i].pendiente, acciones: ''
              })
              totPend += data[i].pendiente
            }
          } else {
            this.pend.push({
              id: data[i].id, cpr: data[i].cpr, importe: data[i].importe,
              vencimiento: moment(data[i].vencimiento).format('YYYY-MM-DD'),
              pendiente: data[i].pendiente, acancelar: 0, acciones: ''
            })
            totPend += data[i].pendiente
          }
          cancelando -= data[i].pendiente
        }

        this.editado.total = this.roundTo(this.hayMaletin()?pendMaletin:totPend,2)
        this.totCancelado = 0
        this.totValores = 0
        this.valDiferencia = this.hayMaletin()?pendMaletin*-1:totPend*-1

        if (this.pend.length==0) {
          this.msg.msgTitle = 'Sin deuda'
          this.msg.msgBody = 'El cliente no posee deuda!'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'cliente sin deuda'
          this.msg.msgButtons = ['Aceptar']
        }

        if (this.hayMaletin()) {
          for (let i=0; i<=this.medpag.length-1; i++) {
            this.medpag[i].activo = false
          }
          for (let i=0; i<=this.maletinesCli.length-1; i++) {
            let pos = this.medpag.findIndex(x=>x.id==maletin[i].medio_id)
            if (pos!=-1) {
              this.medpag[pos].activo = true
            }
          }
        }

      })

    },

    solicitarPago() {
      /*
      La solicitud de pago tiene que venir aca, si el usuario esta vinculado se le envia una notificacion
      Caso contrario se le envia un mail. hev021
      */
      let email = ''
      for (let i=0; i<=this.itemActual.tercero.contactos.length-1; i++) {
        if (this.itemActual.tercero.contactos[i].contacto_tipo_id==1) {     // es un mail
          email = this.itemActual.tercero.contactos[i].observaciones
          break
        }
      }
      if (email=='') {
        this.msg.msgTitle = 'Falta eMail'
        this.msg.msgVisible = true
        this.msg.msgBody = 'Este cliente no tienen correo electrónico definido. Es necesario definir al menos uno.'
        this.msg.msgAccion = 'no hay email'
        this.msg.msgButtons = ['Aceptar']
      } else {
        this.msg.msgTitle = 'Enviar eMail'
        this.msg.msgVisible = true
        this.msg.msgBody = 'Se enviara un correo electrónico por falta de pago.'
        this.msg.msgAccion = 'Confirma enviar correo?'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      }
    },

    enviarMail() {
      /*
      Email.send({
        token: "20b444a2-b3af-4eb8-bae7-911f6097521c",
        Host: "smtp.gmail.com",
        Username: "gohuapp",
        Password: "gmail021201",
        To: 'hev021@gmail.com',
        From: "gohuapp@gmail.com",
        Subject: "This is the subject",
        Body: "And this is the body"
      }).then(
        message => alert(message)
      );
      */

      let body = ''
      this.mail.token = "4a720391-3103-4352-ac74-d48f13f1a13b"
      this.mail.Host = "smtp.gmail.com"
      this.mail.username = "gohuapp"
      this.mail.password = "gmail021201"
      this.mail.to = 'hev021@gmail.com'
      this.mail.from = "gohuapp@gmail.com"
      this.mail.subject = "Solicitud de Pago del comprobante: "+this.itemActual.cpr
      this.mail.title = 'Envío de mail para Solicitud de Pago'
      this.mail.visible = true

      let f1 = moment().format('YYYY-MM-DD')
      let f2 = moment(this.itemActual.pendientes[0].vencimiento).format('YYYY-MM-DD')
      let hoy = moment(f1)
      let ven = moment(f2)
      let d = hoy.diff(ven, 'days')
      let dd = Math.abs(d)
      let dias = Math.abs(d)+' días'
      if (Math.abs(d)<2) {
        dias = Math.abs(d)+' día'
      }
      body  = '\nEstimados Sres:'+this.itemActual.tercero.nombre+'\n\n'
      body += 'Enviamos este correo para informales que el comprobante: '+this.itemActual.cpr+' '
      body += 'por un total de $ '+this.formatoImporte(this.itemActual.total)+'\n'
      body += 'esta '+dias+' vencido ('+moment(this.itemActual.pendientes[0].vencimiento).format('DD/MM/YYYY')+')\n'
      body += 'Lo invitamos a realizar la cancelación del mismo para evitar costos por mora.\n\n'
      body += 'Sin otro particular, aprovechamos para saludarlos muy atte.\n\n'
      body += this.datosEmpresa.razon_social
      body += '\n'
      this.mail.body = body
      this.mail.accion = 'Confirma enviar correo?'
      this.mail.buttons = ['Enviar','Cancelar']
    },

    getEstado (estado, accion, pend, item) {
      let c = ''
      let e = ''
      let d = 0
      let f = false
      let ped = false

      if (this.filtroComprobanteSel=='Viajes') {

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
          e = 'Pendiente'
          c = this.temas.cen_estado_pendiente_bg
        } else if (estado==='L') {
          e = 'p/Reparto'
          c = this.temas.cen_estado_pendiente_bg
        } else if (estado==='I') {
          e = 'En Viaje'
          c = this.temas.cen_estado_enviado_bg
        } else if (estado==='D') {
          e = 'En Admin'
          c = this.temas.cen_estado_pendiente_bg
        } else if (estado==='R') {
          e = 'En Reparto'
          c = this.temas.cen_estado_enviado_bg
        } else if (estado==='F') {
          e = 'Finalizado'
          c = this.temas.cen_estado_finalizado_bg
        } else if (estado==='K') {
          e = 'Fzado.y Chqdo.'
          c = this.temas.cen_estado_finalizado_bg
        } else if (estado==='A') {
          e = 'Anulado'
          c = this.temas.cen_estado_anulado_bg
        }
        return accion==='c'?c:e

      } else {

        if (item!=null) {
          if (item.cpr!=undefined) {
            ped = item.cpr.substring(0,3)=='PED'?true:false
          }
        }
        if (accion=='k') {   //para el dark
          if (estado==='P' || estado=='V') {
            return this.temas.cen_estado_pendiente_dark
          } else if (estado==='T') {
            return this.temas.cen_estado_facturado_dark 
          } else if (estado==='E' && ped) {
            return this.temas.cen_estado_enviado_dark
          } else if (estado==='I') {
            return this.temas.cen_estado_enviado_dark
          } else if (estado==='F' || estado==='R') {
            return this.temas.cen_estado_finalizado_dark
          } else if (estado==='A') {
            return this.temas.cen_estado_anulado_dark
          } else if (estado==='L') {
            return this.temas.cen_estado_pendiente_dark
          } else if (estado==='G') {
            return this.temas.cen_estado_facturado_dark 
          } else {
            return this.temas.cen_estado_pendiente_dark
          }
        }
        if (pend!==null&&pend!=undefined) {       // ctacte
          if (estado==='P') {
            e = 'A Facturar'
            c = this.temas.cen_estado_finalizado_bg
          } else {
            let f1 =  moment().format('YYYY-MM-DD')
            let f2 =  moment(pend.vencimiento).format('YYYY-MM-DD')
            let hoy = moment(f1)
            let ven = moment(f2)
            d = hoy.diff(ven, 'days')
            if (pend.pendiente==0) {
              e = 'Finalizado'
              c = this.temas.cen_estado_finalizado_bg
            } else if (d>0) {
              e = 'Vencido('+d+')'
              c = this.temas.cen_estado_vencido_bg
            } else if (d==0) {
              e = 'Vence Hoy'
              c = this.temas.cen_estado_vencehoy_bg
            } else {
              e = 'A Vencer('+d*-1+')'
              c = this.temas.cen_estado_avencer_bg
            }
          }
        } else if (estado==='A') {
          e = 'Anulado'
          c = this.temas.cen_estado_anulado_bg
        } else if (estado==='F' && !ped) {
          e = 'Finalizado'
          c = this.temas.cen_estado_finalizado_bg
        } else {
          if (estado==='P') {
            if (this.operarioEsVendedor!=null) {
              e = 'Pendiente'
              c = this.temas.cen_estado_pendiente_bg 
            } else {
              e = 'Parcial'
              c = this.temas.cen_estado_pendiente_bg 
            }
          } else if (estado==='T') {
            e = 'Facturado'
            c = this.temas.cen_estado_facturado_bg 
          } else if (estado==='U') {
            e = 'Concluido'
            c = this.temas.cen_estado_anulado_bg 
          } else if (estado==='E') {                                /// ????? no es 'V' ?
            if (ped) {
              e = 'Enviado'
              } else {
              e = 'Envío'
            }
            c = this.temas.cen_estado_enviado_bg 
          } else if (estado==='I') {
            e = 'Retirado'
            c = this.temas.cen_estado_enviado_bg
          } else if (estado==='F') {
            e = 'Finalizado'
            c = this.temas.cen_estado_finalizado_bg
          } else if (estado==='D') {                  // solo para vendedores
            e = 'Pendiente'
            c = this.temas.cen_estado_finalizado_bg   
          } else if (estado==='R') {                  // pedido listo para facturar
            e = 'p/Procesar'
            c = this.temas.cen_estado_finalizado_bg
          } else if (estado==='A') {
            e = 'Anulado'
            c = this.temas.cen_estado_anulado_bg
          } else if (estado==='L') {
            e = 'Parcial'
            c = this.temas.cen_estado_pendiente_bg
          } else if (estado==='V') {
            e = 'En Empresa'
            c = this.temas.cen_estado_pendiente_bg
          } else if (estado==='G') {
            e = 'Entregado'
            c = this.temas.cen_estado_finalizado_bg
          }
        }
        return accion==='c'?c:e
      }
    },

    anularRecibo(item) {
      let hayMaletin = false
      return HTTP().get('/controlanularpagorecibo/'+item.id+'/'+this.sucursal ).then(({ data }) => {
        this.reciboVinculado = false
        if (data=='error') {
          this.mensaje('¡Se ha producido un error al intentar leer el registro!.', this.temas.snack_error_bg, 3500)
        } else if (data[0].medio_id!=-1&&data[0].fechasalida!=null) {
          this.mensaje('¡Este recibo no se puede Anular, posee valores que ya fueron entregados o extraidos del banco electronicamente!.', this.temas.snack_error_bg, 3500)
        } else if (data[0].cerrada==1) {
          this.mensaje('¡La caja nro '+data[0].id+' esta cerrada. Debes reabrir la misma y volver a intentar!.', this.temas.snack_error_bg, 3500)
        } else {

          // que pasa cuando necesito anular un recibo
          // 1) si el cliente no esta vinculado es una anulacion normal
          // 2) si el cliente esta vinculado debo generar la anulacion en ambos lados
          hayMaletin = data[0].maletin
          let pos = this.vinculosHijos.findIndex(x => x = this.itemActual.tercero.user.id)
          this.msg.msgTitle = 'Anular Recibo'
          if (pos!=-1) {
            
            return HTTP().get('/comprobantesrastrear/'+item.id+'/up').then(({ data }) => {
              // VEO SI HAY UN PAGO

              let hayPago = ''
              this.idPagoAAnular = null

              for (let i=1; i<=data.length-1; i++) {
                for (let j=0; j<=data[i].length-1; j++) {
                  if (this.isArray(data[i][j])==false) {
                    if (data[i][j].cpr1.substring(0,3)=='PAG') { 
                      hayPago = data[i][j].cpr1
                      this.idPagoAAnular = data[i][j].padre_id
                    } else if (data[i][j].cpr2.substring(0,3)=='PAG') {
                      hayPago = data[i][j].cpr2
                      this.idPagoAAnular = data[i][j].hijo_id
                    }
                  } else {
                    for (let k=0; k<=data[i][j].length-1; k++) {
                      if (this.isArray(data[i][j][k])==false) {
                        if (data[i][j][k].cpr1.substring(0,3)=='PAG') {
                          hayPago = data[i][j][k].cpr1
                          this.idPagoAAnular = data[i][j][k].hijo_id
                        } else if (data[i][j][k].cpr2.substring(0,3)=='PAG') {
                          hayPago = data[i][j][k].cpr2
                          this.idPagoAAnular = data[i][j][k].hijo_id
                        }
                      } else {
                        for (let l=0; l<=data[i][j][k].length-1; l++) {
                          if (data[i][j][k][l].cpr1.substring(0,3)=='PAG') {
                            hayPago = data[i][j][k][l].cpr1
                            this.idPagoAAnular = data[i][j][k][l].hijo_id
                          } else if (data[i][j][k][l].cpr1.substring(0,3)=='PAG') {
                            hayPago = data[i][j][k][l].cpr2
                            this.idPagoAAnular = data[i][j][k][l].hijo_id
                          }
                        }
                      }
                    }
                  }
                }
              }

              let t = ''
              if (this.idPagoAAnular==null) {
                t += 'Se va a Anular el recibo '+this.itemActual.cpr+'<br><br>'
              } else {
                t += 'Operación con Cliente Vinculado.<br><br>'
                t += 'Se anulará el recibo <b>'+item.cpr+'</b>.<br>'
                t += 'Se va a enviar una notificación a '
                t += '<b>'+this.itemActual.tercero.nombre+'</b> para que anule el pago '
                t += '<b>'+hayPago+'</b>.<br><br>'
                this.reciboVinculado = true
              }

              if (hayMaletin) {
                t += 'También se afectará el maletín Nro. <b>'+hayMaletin+'</b><br><br>'
              }

              t += '¿Confirmas?'
              this.msg.msgBody = t
              this.msg.msgVisible = true
              this.msg.msgAccion = 'anular recibo'
              this.msg.msgButtons = ['Aceptar','Cancelar']
            })
          } else {
            this.msg.msgBody = '¿Confirma anular el Recibo?'+this.itemActual.cpr+' ?'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'anular recibo'
            this.msg.msgButtons = ['Aceptar','Cancelar']
          }
        }
      })
    },


    anularPresupuesto(item) {
      return HTTP().get('/controlanularpresupuesto/'+item.id ).then(({ data }) => {
        if (data=='ok') {
          this.msg.msgTitle = 'Anular Presupuesto'
          this.msg.msgBody = 'Confirma anular el Presupuesto '+item.cpr+' ?'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'anular presupuesto'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        } else {
          this.msg.msgTitle = 'Anular Presupuesto'
          this.msg.msgBody = data
          this.msg.msgVisible = true
          this.msg.msgAccion = 'error anular presupuesto'
          this.msg.msgButtons = ['Aceptar']
          return
        }
      })
    },

    anularPedido(item) {
      this.dialogAnularPedido = true
    },

    anularReciboHTTP(item) {

      // que pasa cuando necesito anular un recibo
      // 1) si el cliente no esta vinculado es una anulacion normal
      // 2) si el cliente esta vinculado debo generar la anulacion en ambos lados
      // primero cargo las fechas de ult actualizacion de cada tabla y las paso a la API
      // para ver si estas han sido modificadas.

      let userClien = this.itemActual.tercero.user!=null?this.itemActual.tercero.user.id:null

      // PARA EL CONTROL DEL BLOCK
      for (let i=0; i<=this.itemActual.valoresIngresos.length-1; i++) {
        this.itemActual.valoresIngresos[i].updated_at = moment(this.itemActual.valoresIngresos[i].updated_at).format('YYYY-MM-DD HH:mm:ss')
      }

      return HTTP().post('/anularrecibo', {
        id: this.itemActual.id,
        comprobante: {id: this.itemActual.id, updated_at: this.itemActual.updated_at},
        cancelaciones: this.itemActual.cancelaciones,
        valores: this.itemActual.valoresIngresos,
        vinculado: this.reciboVinculado,
        userClien: userClien,
        idPagoAAnular:this.idPagoAAnular
        }).then(({ data }) => {

          if (data=='error') {
            this.mensaje('¡Se ha producido un error al intentar anular el Recibo!.', this.temas.snack_error_bg, 3500)
          } else if (data=='block valores') {
            this.mensaje('¡Otro usuario ha modificado algun dato de Valores. Refresque y verifique!.', this.temas.snack_error_bg, 3500)
          } else if (data=='bloqueado') {
            this.mensaje('¡Otro usuario ha modificado algun dato del recibo. Refresque y verifique!.', this.temas.snack_error_bg, 3500)
          } else {
            this.mensaje('¡El Recibo ha sido anulado con exito!', this.temas.forms_titulo_bg, 3500)
          }
          this.listarHTTP(false)
      });
    },

    anularPresupuestoHTTP() {
      return HTTP().post('/anularpresupuesto', { id: this.itemActual.id }).then(({ data }) => {
        this.mensaje('¡El presupuesto ha sido anulado con exito!', this.temas.forms_titulo_bg, 1500)
        this.listarHTTP(false)
      });
    },

    anularPedidoHTTP() {
      return HTTP().post('/anularpedido', {
        itemActual: this.itemActual,
        motivo: this.motivoAnularPedido,
        yadescargo: true,
        }).then(({ data })=>{
        if (data) {
          this.mensaje('¡Pedido anulado correctamente!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Opps, se ha producido un error al anular el pedido!', this.temas.snack_error_bg, 1500)
        }
        this.dialogAnularPedido = false
        this.listarHTTP(false)
      });
    },

    concluirPedido(item) {
      this.msg.msgTitle = 'Concluir Pedido'
      let q = '¿Confirmas concluir el Pedido '+item.cpr+'?<br>'
      q = q + 'ATENCION: ¡No podrás volver a activarlo!'
      this.msg.msgBody = q
      this.msg.msgVisible = true
      this.msg.msgAccion = 'Dar por concluido'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    concluirPedidoHTTP() {
      return HTTP().post('/concluirpedido', {itemActual: this.itemActual}).then(({data})=>{
        if (data) {
          this.mensaje('¡El Pedido ha concluido correctamente!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500)
        }
        this.listarHTTP(false)
      });
    },

    viajeListoParaRepartoHTTP() {
      return HTTP().post('/viajelistoparareparto', {itemActual: this.itemActualViaje}).then(({data})=>{
        if (data) {
          this.mensaje('¡El viaje a quedado listo para Reparto!', this.temas.forms_titulo_bg, 2500)
        } else {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 1500)
        }
        this.listarHTTP(false)
      });
    },

    aEnviarHTTP() {
      return HTTP().post('/enviarpedido', {
        envio: this.envio,part: 'ENV-X '+this.sucursalFiscal+'%',sucursal_id: this.sucursal,itemactual: this.itemActual}).then(({ data }) => {
        if (data) {
          this.dialogEnvios = false
          this.listarHTTP(false)
        }
      })
    },

    aRetirarHTTP() {
      return HTTP().post('/retirarpedido', {
        envio: this.envio,
        part: 'RET-X '+this.sucursalFiscal+'%',
        sucursal_id: this.sucursal,
        itemactual: this.itemActual,
      }).then(({ data }) => {
        if (data) {
          this.dialogRetiro = false
          this.listarHTTP(false)
        }
      })
    },

    enviarPedidoDelVendedor(item) {
      this.editedIndex = this.items.findIndex(x=>x.id==item.id)
      if (this.items[this.editedIndex].tercero.user) { // esta modificando
        // TIENE QUE ENVIAR EL PEDIDO POR SISTEMA
        let novedad = {
          cpr_id: this.items[this.editedIndex].id,
          novedad: 'Envio del Pedido',
          rel_id: null,
          estado: 'N'
        }
        return HTTP().patch('/enviarpedido', {
          id: this.items[this.editedIndex].id,
          novedad: novedad,
          vendedor: true,
          recorrido: null }).then(({ data })=>{
          if (data = 'ok') {
            this.mensaje('¡Pedido enviado correctamente!', this.temas.forms_titulo_bg, 1500)
          } else {
            this.mensaje('¡Ha ocurrido un problema con el envío del pedido!', this.temas.snack_error_bg, 1500)
          }
          this.listarHTTP(false);
        })
      } else  {
        // TIENE QUE ENVIAR EL PEDIDO POR MAIL
      }
    },

    modificarPedido(item) {
      this.editedIndex = this.items.indexOf(item)
      this.cpr = item.cpr
      this.dialog = true
      this.articulos = []
      this.confirmarComprobanteMensaje = 'GUARDAR PEDIDO'
      this.formTitle = 'Modificar el Pedido '+item.cpr+' - ('+item.tercero.nombre+')'
      this.searchTerceros           = ''
      this.isLoadingTerceros        = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
      this.basadoEnCpr              = true;   // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
      this.editado.tercero_id       = item.tercero_id;
      this.editado.nombre           = item.tercero.nombre;
      this.editado.responsableAbrev = item.tercero.responsable.abrev
      this.editado.documento        = item.tercero.documento.nombre
      this.editado.documento_id     = item.documento_id
      this.editado.documentoCodigo  = item.tercero.documento.codigo
      this.editado.mediodepago_id   = item.mediodepago_id
      this.editado.documentoNumero  = item.tercero.cuit
      this.editado.moneda_id        = item.moneda_id
      this.cfUser                   = this.responsable
      this.ctacte = false
      if (item.tercero.usersterceros.length>0) {
        this.ctacte = item.tercero.usersterceros[0].ctacte
        this.diasvenc = item.tercero.usersterceros[0].diasvenc
        this.bonificacionmaxima = item.tercero.usersterceros[0].bonificacionmaxima
        this.creditomaximo = item.tercero.usersterceros[0].creditomaximo
      }
      this.editado.letra = 'P'
      this.dirItems.push(item.tercero.direcciones[0])
      this.editado.direccion_id = this.dirItems[0].id
      this.editado.deposito_id = this.depItems[0].id
      this.editado.texto = this.sucursalDemo ? 'PREPED' : 'FACPED'
      this.editado.comprobante_id = 126
      this.editado.vendedor.id = item.vendedor_id
      this.editado.quienpidio = 'V'
        
      //Cargo los articulos del pepdido, pero primero tengo que ver si ya fueron cargados anteriormente
      //y quedo saldo (estado = 'L')
      //En ese caso tengo que buscar en vinuculados para sacar la diferencia

      // busco comprobantes que imputaron a este pedido.
      this.articulos = [];
      for (let i=0; i<=item.items.length-1; i++) {
        this.articulos.push({ 
          id: item.items[i].id, articulo_id: item.items[i].articulo_id, codigo: item.items[i].articulo.codigo, codbar: item.items[i].articulo.codbar,
          nombre: item.items[i].articulo.nombre, deposito_id: this.editado.deposito_id, unidad_id: item.items[i].articulo.unidad_id,
          moneda_id: item.items[i].articulo.moneda_id, iva_id: item.items[i].articulo.iva_id, cantidad: Number(item.items[i].cantidad),
          cantidadoriginal: Number(item.items[i].cantidad), stock: Number(item.items[i].cantidad), undstock: item.items[i].undstock,
          sinstock: item.items[i].sinstock, costo: item.items[i].costo, precio: item.items[i].precio, preciooriginal: item.items[i].precio,
          tasadescuento: item.items[i].tasadescuento, importedescuento: item.items[i].importedescuento, tasaproprecargo: 0,
          total: item.items[i].total, texto: item.items[i].texto, vencimiento: item.items[i].vencimiento, adevolver: 0, padre_id: null,
          undenvase: item.items[i].articulo.undenvase, escombo: item.items[i].articulo.escombo, ofeprecio: 0, ofetasdes: 0,
          ofeenvio: 0, ofeunidades: 0, ofeestado: '', turno_id: null, decimales: item.items[i].articulo.precios[0].decimales,
          preciomediocobro: false, loTengo: item.items[i].loTengo, 
        })
      }
    },

    enviarPedidoHTTP(item) {
      let novedad = {
        cpr_id: item.id,
        novedad: 'Envío de Pedido',
        rel_id: null,
        estado: 'N'
      }
      return HTTP().post('/pedidoenvio', { pedido: item, novedad: novedad }).then(({ data }) => {
        this.dialogEnvios = false
        if (data) {
          this.listarHTTP(false)
        }
      })
    },

    confirmarEnvioRetiro(como) {
      this.msg.msgTitle   = como == 'E' ? 'ENVIAR PEDIDO' : 'RETIRO DEL PEDIDO'
      this.msg.msgBody    = como == 'E' ? '¿Confirma el envío del pedido?' : '¿Confirma el retiro del pedido?'
      this.msg.msgVisible = true
      this.msg.msgAccion  = como == 'E' ? 'enviar pedido al cliente' : 'retirar pedido'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    confirmarRetiroMerc() {
      this.msg.msgTitle   = 'RETIRO DE MERCADERIA'
      this.msg.msgBody    = '¿Confirma el retiro de Mercarería?'
      this.msg.msgVisible = true
      this.msg.msgAccion  = 'retirar mercaderia'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    editarPedido(item) {
      this.editedIndex = this.items.indexOf(item)
      return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
        item = data.c
        this.dialog = true;
        this.itemActual = item
        this.editado.id = item.id
        this.editado.cpr = item.cpr
        this.editado.fecha = item.fecha

        debugger
        this.editado.tercero_id = item.user.tercero.id
        this.editado.nombre = item.user.tercero.razon_social
        this.editado.comprobante_id = item.comprobante_id
        this.editado.documento_id = item.user.tercero.documento_id
        this.editado.deposito_id = item.deposito_id
        this.editado.vendedor = {id: item.vendedor.id, nombre: item.vendedor.nombre},
        this.editado.moneda_id = item.moneda_id
        this.editado.direccion_id = item.user.tercero.direcciones[0].id
        this.editado.documento = item.user.tercero.documento.nombre
        this.editado.documentoNumero = item.user.tercero.cuit
        this.editado.responsableAbrev = item.user.tercero.responsable.abrev
        this.editado.letra = item.cpr.substring(4,5)
        this.editado.activo = item.activo
        this.editado.tasadescuento = item.tasadescuento
        this.editado.importedescuento = item.importedescuento
        this.editado.gravado = item.exento
        this.editado.exento = item.exento
        this.editado.iva = item.iva
        this.editado.total = item.total
        this.editado.rentabilidad = item.rentabilidad
        //this.texto = item.texto
        this.editado.estado = item.estado
        this.editado.observaciones = item.observaciones
        this.editado.quienpidio = item.quienpidio

        this.confirmarComprobanteMensaje = 'GUARDAR PEDIDO'
        this.formTitle = 'Editar Pedido'
        this.editado.cpr = 'PED'
        this.coef = 1
        this.articulos = []
        for (let i=0; i<=item.items.length-1; i++) {
          this.articulos.push({ 
            id: item.items[i].id, articulo_id: item.items[i].articulo_id, codigo: item.items[i].articulo.codigo, codbar: item.items[i].articulo.codbar,
            nombre: item.items[i].articulo.nombre, deposito_id: item.items[i].deposito_id, unidad_id: item.items[i].articulo.unidad_id,
            moneda_id: item.items[i].articulo.moneda_id, iva_id: item.items[i].articulo.iva_id, cantidad: Number(item.items[i].cantidad),
            cantidadoriginal: Number(item.items[i].cantidad), stock: Number(item.items[i].cantidad), undstock: item.items[i].articulo.undstock,
            sinstock: item.items[i].sinstock, costo: item.items[i].costo, precio: item.items[i].precio, preciooriginal: item.items[i].precio,
            tasadescuento: item.items[i].tasadescuento, importedescuento: item.items[i].importedescuento, tasaproprecargo: 0,
            total: item.items[i].total, texto: item.items[i].texto, vencimiento: item.items[i].vencimiento, adevolver: 0, padre_id: null,
            undenvase: item.items[i].articulo.undenvase, escombo: item.items[i].articulo.escombo, ofeprecio: 0, ofetasdes: 0,
            ofeenvio: 0, ofeunidades: 0, ofeestado: '', turno_id: null, decimales: item.items[i].articulo.precios[0].decimales,
            preciomediocobro: false, loTengo: item.items[i].loTengo,
          })
        }
        this.seleccionarArticulo = false
        this.busArt = ''
        this.$nextTick(() => {
          const f = this.$refs.buscar;
          f.focus();
        });
      })
    },

    editarRetiroDeMercaderia(item) {
      this.yaEnviado = false
      this.formTitle = 'Retiro de Mercadería'
      this.dialog = false
      this.dialogRetiroMerc = true
      this.searchTercerosRetirosMerc = ''
      this.articulos = []

      if (item==undefined) {

        this.editedIndexRetiroMer = -1
        this.editado = Object.assign({}, this.defaultItem)
        this.editado.cpr = 'RTV-X '+this.sucursalFiscal+'-'+'00000001'
        this.editado.comprobante_id = 134
        this.editado.deposito_id = this.depItems[0].id

      } else {

        return HTTP().post('comprobante', { id: this.itemActual.id }).then(({ data }) => {
          this.itemActual = data.c
          this.editedIndexRetiroMer = this.items.findIndex(x => x.id == item.id)
          this.editado.id = data.id
          this.editado.cpr = data.cpr
          this.editado.fecha = data.fecha

          debugger
          this.editado.tercero_id = data.tercero_id
          this.editado.nombre = data.tercero.nombre
          this.editado.comprobante_id = data.comprobante_id
          this.editado.documento_id = data.tercero.documento_id
          this.editado.documentoCodigo = ''
          this.editado.mediodepago_id = data.mediodepago_id
          this.editado.deposito_id = data.deposito_id
          this.editado.vendedor = {id: null, nombre: 'MOSTRADOR'},
          this.editado.moneda_id = data.moneda_id
          this.editado.direccion_id = data.tercero.direcciones[0].id
          this.editado.documento = ''
          this.editado.documentoNumero = ''
          this.editado.responsableAbrev = ''
          this.editado.letra = ''
          this.editado.activo = true
          this.editado.tasadescuento = 0
          this.editado.importedescuento = 0
          this.editado.gravado = 0
          this.editado.exento = 0
          this.editado.iva = 0
          this.editado.total = 0
          this.editado.rentabilidad = 0
          this.editado.texto = data.texto
          this.editado.estado = data.estado
          this.editado.observaciones = data.observaciones
  
          for (let i=0; i<=data.items.length-1; i++) {
            this.articulos.push({ 
              id: data.items[i].id, articulo_id: data.items[i].articulo_id, codigo: data.items[i].articulo.codigo, codbar: data.items[i].articulo.codbar,
              nombre: data.items[i].articulo.nombre, deposito_id: data.items[i].deposito_id, unidad_id: data.items[i].articulo.unidad_id,
              moneda_id: data.items[i].articulo.moneda_id, iva_id: data.items[i].articulo.iva_id, cantidad: Number(data.items[i].cantidad),
              cantidadoriginal: Number(data.items[i].cantidad), stock: Number(data.items[i].cantidad)*-1, undstock: data.items[i].articulo.undstock,
              sinstock: data.items[i].sinstock, costo: data.items[i].costo, precio: data.items[i].precio, preciooriginal: data.items[i].precio,
              tasadescuento: data.items[i].tasadescuento, importedescuento: data.items[i].importedescuento, tasaproprecargo: 0,
              total: data.items[i].total, texto: data.items[i].texto, vencimiento: data.items[i].vencimiento, adevolver: 0, padre_id: null,
              undenvase: data.items[i].articulo.undenvase, escombo: data.items[i].articulo.escombo, ofeprecio: 0, ofetasdes: 0,
              ofeenvio: 0, ofeunidades: 0, ofeestado: '', turno_id: null, decimales: data.items[i].articulo.precios[0].decimales,
              preciomediocobro: false, loTengo: data.items[i].loTengo,
            })
          }
        })
      }
    },

    articulosDelPedido(item) {
      this.itemActualPedido = item
      this.itemsRepartoPedidoUnds = []
      this.itemsRepartoPedidoCual = 'P'
      if (item.cprsA.pedido!=null) {
        for (let j=0; j<=item.cprsA.pedido.items.length-1; j++) {
          let pos = this.itemsRepartoPedidoUnds.findIndex(x=>x.codigo==item.cprsA.pedido.items[j].articulo.codigo)
          if (pos==-1) {
            this.itemsRepartoPedidoUnds.push({
              id: item.cprsA.pedido.items[j].articulo_id,
              codigo: item.cprsA.pedido.items[j].articulo.codigo,
              nombre: item.cprsA.pedido.items[j].articulo.nombre,
              cantidad: item.cprsA.pedido.items[j].cantidad,
              bultos: item.cprsA.pedido.bultos||0,
              peso: item.cprsA.pedido.items[j].articulo.peso,
              kgs: this.roundTo(item.cprsA.pedido.items[j].articulo.peso*item.cprsA.pedido.items[j].cantidad,2),
            })
          } else {
            this.itemsRepartoPedidoUnds[pos].cantidad += item.cprsA.pedido.items[j].cantidad
            this.itemsRepartoPedidoUnds[pos].bultos += item.cprsA.pedido.bultos||0
            this.itemsRepartoPedidoUnds[pos].kgs += this.roundTo(item.cprsA.pedido.items[j].articulo.peso*item.cprsA.pedido.items[j].cantidad,2)
          }
        }
      }
      if (item.cprsB.pedido!=null) {
        for (let j=0; j<=item.cprsB.pedido.items.length-1; j++) {
          let pos = this.itemsRepartoPedidoUnds.findIndex(x=>x.codigo==item.cprsB.pedido.items[j].articulo.codigo)
          if (pos==-1) {
            this.itemsRepartoPedidoUnds.push({
              id: item.cprsB.pedido.items[j].articulo_id,
              codigo: item.cprsB.pedido.items[j].articulo.codigo,
              nombre: item.cprsB.pedido.items[j].articulo.nombre,
              cantidad: item.cprsB.pedido.items[j].cantidad,
              bultos: item.cprsB.pedido.bultos||0,
              peso: item.cprsB.pedido.items[j].articulo.peso,
              kgs: this.roundTo(item.cprsB.pedido.items[j].articulo.peso*item.cprsB.pedido.items[j].cantidad,2),
            })
          } else {
            this.itemsRepartoPedidoUnds[pos].cantidad += item.cprsB.pedido.items[j].cantidad
            this.itemsRepartoPedidoUnds[pos].bultos += item.cprsB.pedido.bultos||0
            this.itemsRepartoPedidoUnds[pos].kgs += this.roundTo(item.cprsB.pedido.items[j].articulo.peso*item.cprsB.pedido.items[j].cantidad,2)
          }
        }
      }
      this.dialogPedidoArticulos = true
    },

    nuevo(que, item) {
      this.clienteVinculado = false
      this.yaEnviado = false
      this.dialog = false
      this.confirmarComprobanteMensaje = 'CONFIRMAR COMPROBANTE'
      this.recargo = 0
      this.facRet = 0
      this.electronica = false
      this.electronicaOk = false
      this.cueMiasItems = []
      this.rentabilidad = 0
      this.facturas = []
      this.turnosFacturar = []
      this.selected = []
      this.maletinesCli = []
      for (let i=0; i<=this.datosEmpresa.cuentas.length-1; i++) {
        this.cueMiasItems.push({
          id: this.datosEmpresa.cuentas[i].id,
          banco: this.datosEmpresa.cuentas[i].banco.nombre,
          cuenta: this.datosEmpresa.cuentas[i].cuenta,
          nombre: this.datosEmpresa.cuentas[i].nombre,
        })
      }

      // SI "que" VIENE CON DATOS, ES PORQUE ESTOY HACIENDO UN COMPROBANTE BASADO EN OTRO
      this.basadoEnCpr = false;         // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
      this.notificaEnBaseAOtro = [];    // LIMPIO NOTIFICACIONES PARA NO TENER PROBLEMAS
      this.notificaOriginal = [];
      this.basadoEnOtroCpr = []

      this.searchTerceros = '';
      this.searchTercerosRec = '';
      this.searchTercerosTrans = '',
      this.isLoadingBancos = false;
      this.isLoadingTerceros = false;
      this.isLoadingTercerosRec = false;
      this.isLoadingTercerosRetirosMerc = false;
      this.sucManual = this.sucursalManual

      // LIMPIO MEDIOS DE PAGO
      for (let i=0; i<=this.medpag.length-1; i++) {
        this.medpag[i].total = 0
        this.medpag[i].recargo = 0
      }

      this.medpag[1].activo = this.sucursalDemo ? false : true
      this.medpag[2].activo = this.sucursalDemo ? false : true
      this.medpag[4].activo = this.sucursalDemo ? false : true
      this.medpag[6].activo = this.sucursalDemo ? false : true
      this.medpag[7].activo = this.sucursalDemo ? false : true
      this.medpag[8].activo = this.sucursalDemo ? false : true

      this.valDiferencia = 0;
      this.comoPaga = "1";
      this.formTitleArt = 'Nuevo Item'
      this.formTitleMed = 'Nuevo Valor'
      this.editadoArt = Object.assign({}, this.defaultItemArt)
      this.articulos = []
      this.pendientes = []
      this.valores = []
      this.esManual = false
      this.editado.fecha = moment().format('YYYY-MM-DD')

      if (que === 'Facturas') {

        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        this.formTitle = 'Nueva Factura - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'FAC'
        this.coef = 1
        this.medpag[1].activo = true
        this.electronica = !this.sucursalDemo
        this.dialog = true;
      
      } else if (que === 'Presupuestos') {
        
        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        this.formTitle = 'Nuevo Presupuesto - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'PRE'
        this.editado.comprobante_id = 124
        this.editado.letra = 'P'
        this.editado.observaciones = 'PRESUPUESTO'
        this.coef = 1
        this.dialog = true;

      } else if (que === 'Remitos') {
        
        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        this.formTitle = 'Nuevo Remito - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'REM'
        this.editado.comprobante_id = 125
        this.editado.letra = 'R'
        this.editado.observaciones = 'REMITO'
        this.coef = 1
        this.dialog = true;

      } else if (que === 'Pedidos') {
  
        // cuando es un pedido es desde un vendedor
        // tengo que simular como que lo esta haciendo el cliente
        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        this.dialog = true;
        this.editedIndex = -1
        this.confirmarComprobanteMensaje = 'GUARDAR PEDIDO'
        this.formTitle = 'Nuevo Pedido'
        this.editado.cpr = 'PED'
        this.coef = 1
        this.editado.letra = 'P'
        this.editado.quienpidio = 'V'
        this.editado.comprobante_id = 126
        this.editado.vendedor.id = this.operarioTerceroId
     
      } else if (que === 'facpre') {

        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        this.dialog = true;
        return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
          this.itemActual = data.c
          item = data.c
          this.formTitle = 'Generar Factura sobre el Presupuesto '+item.cpr+' - ('+item.tercero.nombre+')'
          this.searchTerceros           = ''
          this.isLoadingTerceros        = true   // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
          this.basadoEnCpr              = true   // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
          this.editado.tercero_id       = item.tercero_id
          this.editado.nombre           = item.tercero.nombre
          this.editado.responsableAbrev = item.tercero.responsable.abrev
          this.editado.documento        = item.tercero.documento.nombre
          this.editado.documento_id     = item.documento_id
          this.editado.documentoCodigo  = item.tercero.documento.codigo
          this.editado.mediodepago_id   = item.mediodepago_id

          this.editado.tasadescuento    = item.tasadescuento
          this.editado.importedescuento = item.importedescuento
          this.editado.documentoNumero  = item.tercero.cuit
          this.editado.moneda_id        = item.moneda_id
          let rid                       = item.tercero.responsable.id
          this.cfUser                   = this.responsable

          this.editado.cpr = 'FAC';
          if (this.cfUser===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO
            if(rid===1 || rid===2 || rid===6 || rid===9 || rid===11) {
              this.editado.letra = 'A'
            } else {
              this.editado.letra = 'B'
            }
          } else if (this.cfUser===6) { //EL USUARIO ES MONOTRIBUTISTA
              this.editado.letra = 'C'
          }
          this.dirItems.push(item.tercero.direcciones[0])
          this.editado.direccion_id = this.dirItems[0].id
          this.editado.deposito_id = this.depItems[0].id
          this.electronica = !this.sucursalDemo

          //Cargo los articulos del pedido
          this.articulos = [];
          let arts = [];

          for (let i=0; i<=item.items.length-1; i++) {
            arts.push(item.items[i].articulo_id)
            this.articulos.push({ 
              id: null, articulo_id: item.items[i].articulo_id, codigo: item.items[i].articulo.codigo, codbar: item.items[i].articulo.codbar,
              nombre: item.items[i].articulo.nombre, deposito_id: this.editado.deposito_id, unidad_id: item.items[i].articulo.unidad_id,
              moneda_id: item.items[i].articulo.moneda_id, iva_id: item.items[i].articulo.iva_id, cantidad: Number(item.items[i].cantidad),
              cantidadoriginal: Number(item.items[i].cantidad), stock: Number(item.items[i].cantidad), undstock: item.items[i].articulo.undstock,
              sinstock: item.items[i].sinstock, costo: item.items[i].costo, precio: item.items[i].precio, preciooriginal: item.items[i].precio,
              tasadescuento: item.items[i].tasadescuento, importedescuento: item.items[i].importedescuento, tasaproprecargo: 0,
              total: item.items[i].total, texto: item.items[i].texto, vencimiento: item.items[i].vencimiento, adevolver: 0, padre_id: null,
              undenvase: item.items[i].articulo.undenvase, escombo: item.items[i].articulo.escombo, ofeprecio: 0, ofetasdes: 0,
              ofeenvio: 0, ofeunidades: 0, ofeestado: '', turno_id: null, decimales: item.items[i].articulo.precios[0].decimales,
              preciomediocobro: false, loTengo: item.items[i].loTengo,
            })
          }

          // reviso si hubieron cambios de precios
          return HTTP().post('/revisocostosparafacturar', { arts: arts }).then(({ data }) => {
            //Cargo los articulos del pepdido, pero primero tengo que ver si ya fueron cargados anteriormente y quedo saldo (estado = 'L')
            //En ese caso tengo que buscar en vinuculados para sacar la diferencia
            //busco comprobantes que imputaron a este pedido.
            for (let i=0; i<=this.articulos.length-1; i++) {
              let pos = this.articulos.findIndex(x => x.articulo_id === data[i].articulo_id)
              if (pos!=-1) {
                this.articulos[i].costo = data[pos].costo
                this.articulos[i].precio = data[pos].precio
              }
            }
            this.notificaOriginal = [{
              comprobante_id: item.id,
              estado: 'F'
            }]
            this.calculos()
          })
        })

      } else if (que === 'remfac') {

        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
          this.itemActual = data.c
          item = data.c
          this.formTitle = 'Aplicar Remito sobre la Factura '+item.cpr+' - ('+item.tercero.nombre+')'
          this.coef = 1

          this.valores = []
          this.yaEnviado = false
          this.searchTerceros = ''
          this.dialogRem = true
          this.dialogNdcFac = false
          this.isLoadingTerceros = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
          this.basadoEnCpr = true;      // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
          this.basadoEnOtroCpr.push(item.id)
          this.editado.tercero_id = item.tercero_id
          this.editado.nombre = item.tercero.nombre
          this.editado.responsableAbrev = item.tercero.responsable.abrev
          this.editado.documento = item.tercero.documento.nombre
          this.editado.documento_id = item.documento_id
          this.editado.documentoCodigo  = item.tercero.documento.codigo
          this.editado.deposito_id = item.deposito_id
          this.remitoItems = item.items.length
          this.articulos = item.items
        
          // LOS REMITOS SOBRE FACTURAS NO GENERAN STOCK
          let unidades = 0
          let peso = 0
          for (let i=0; i<=this.articulos.length-1; i++) {
            this.articulos[i].stock = 0
            unidades += this.articulos[i].cantidad
            peso += this.articulos[i].articulo.peso*this.articulos[i].cantidad
          }

          this.editado.direccion_id = item.direccion_id
          this.editado.cpr = item.cpr
          this.editado.total = item.total
          this.editado.rentabilidad = 0
          this.editado.documentoNumero = item.tercero.cuit
          this.editado.moneda_id = item.moneda_id
          this.editado.observaciones = 'REMITO'
          this.editado.mediodepago_id = null
          let rid = item.tercero.responsable.id
          this.cfUser = this.responsable

          this.remitoTexto = 'Artículos: '+this.articulos.length+'\n'
          this.remitoTexto += 'Unidades: '+unidades+'\n'
          if (item.vinculoHijo) {
//          if (item.vinculoHijo[0].padre) {
//            this.remitoTexto += 'Bultos: '+item.vinculoHijo[0].padre.bultos+'\n'
//          }
          }
          this.remitoTexto += 'Peso: '+this.roundTo(peso,2)+' Kgs'
        })

//      } else if (que === 'facnot') {
//        
//        this.formTitle = 'Facturar Anotaciones de Ventas'
//        this.electronica = !this.sucursalDemo

      } else if (que === 'Recibos' ) {

        this.editado = Object.assign({}, this.defaultItem)
        this.basadoEnCpr = false
        this.formTitle = 'Nuevo Recibo - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.reciboDeUnSoloComprobante = false

        if (item==null) {

          this.desdeAdmPedidos = false
          this.maletinesCli = []
          this.searchTercerosRec = ''
          this.dialogRem = false
          this.dialogRec = true
          this.dialogNdcFac = false
          this.esFiscal = false
          this.coef = 1
          this.pend = []
          this.valores = []
          this.totCancelado = 0
          this.totValores = 0
          this.valDiferencia = 0
          this.editado.cpr = 'REC'
          this.medpag[1].activo = false  // para recibos deshabilito tarj de cred.
          this.medpag[3].activo = false  // para recibos deshabilito ctacte
        
        } else {
          
          this.desdeAdmPedidos = true
          this.dialogRec = true
          this.basadoEnCpr = true   // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)

          return HTTP().post('comprobante', { id: item }).then(({ data }) => {
            this.itemActual = data.c
            que = data.c
            this.searchTercerosRec = ''
            this.isLoadingTercerosRec = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
            this.editado.cpr = 'REC'

            debugger
            this.editado.tercero_id = que.tercero_id;
            this.editado.nombre = que.tercero.nombre;
            this.editado.responsableAbrev = que.tercero.responsable.abrev
            this.editado.documento = que.tercero.documento.nombre
            this.editado.documento_id = que.documento_id
            this.editado.documentoCodigo  = que.tercero.documento.codigo
            this.editado.mediodepago_id = que.mediodepago_id
            this.editado.documentoNumero = que.tercero.cuit
            this.editado.moneda_id = que.moneda_id
          })
        }

      } else if (que === 'REC' ) {      //RECIBO DE UN SOLO COMPROBANTE

        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {

          this.itemActual = data.c
          this.maletinesCli = data.m
          this.maletinesCli = data.m==null?[]:data.m
          if (this.hayMaletin()) {

            this.msg.msgTitle = 'Maletín Pendiente'
            let m = ''
            m = 'Este Cliente tiene uno o varios Maltínes pendientes, deberás realizar el recibo '
            m += 'desde el panel de Recibos. '
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'cliente con maletin pendiente'
            this.msg.msgButtons = ['Aceptar']

          } else {

            item = data.c
            this.formTitle                 = 'Cobro del Comprobante '+item.cpr+' - ('+item.tercero.nombre+')'
            this.reciboDeUnSoloComprobante = true
            this.searchTerceros            = ''
            this.dialogRem                 = false
            this.dialogRec                 = true
            this.dialogNdcFac              = false
            this.esFiscal                  = false;
            this.coef                      = 1;
  
            this.afipSuc                   = this.sucursalFiscal;
            this.isLoadingTercerosRec      = true   // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
            this.basadoEnCpr               = true;  // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
            this.basadoEnOtroCpr.push(item.id)
  
            this.editadoCpr                = this.editado.cpr
            this.editadoNombre             = item.tercero.nombre
            this.editado.id                = ''
            this.editado.fecha             = moment().format('YYYY-MM-DD')
            this.editado.perfiscal         = moment().format('YYYY-MM');
            this.editado.cpr               = 'REC-R '+this.sucursalFiscal+'-00000000'
            this.editado.tipo              = 'RC'
            this.editado.user_id           = this.userId
            this.editado.sucursal_id       = this.sucursal

            debugger
            this.editado.tercero_id        = item.tercero_id                           // ver
            this.editado.comprobante_id    = 127
            this.editado.documento_id      = item.documento_id
            this.editado.documentoCodigo   = item.tercero.documento.codigo
            this.editado.nombre            = item.tercero.nombre
            this.editado.documentoNumero   = item.tercero.cuit
            this.editado.mediodepago_id    = 4
            this.editado.deposito_id       = null
          //this.editado.vendedor_id       = item.vendedor_id
            this.editado.moneda_id         = item.moneda_id
            this.editado.direccion_id      = item.direccion_id
            this.editado.tasadescuento     = 0
            this.editado.importedescuento  = 0
            this.editado.retiva            = 0
            this.editado.retgan            = 0
            this.editado.retib             = 0
            this.editado.gravado           = 0
            this.editado.exento            = 0
            this.editado.iva               = 0
            this.editado.total             = item.pendientes[0].pendiente
            this.editado.rentabilidad      = 0
            this.editado.regstk            = 0
            this.editado.estado            = 'F'
            this.editado.carga             = 'M'
            this.editado.cae               = null
            this.editado.cae_vencimiento   = null
            this.editado.cae_codbar        = null
            this.editado.observaciones     = 'COBRO'
            this.editado.activo            = true
            this.editado.items             = []
            this.medpag[1].activo          = false  // para recibos deshabilito tarj de cred.
            this.medpag[3].activo          = false  // para recibos deshabilito ctacte
  
            // TOTALES DEL PAGO
            this.totCancelado  = item.pendientes[0].pendiente
            this.totValores    = item.pendientes[0].pendiente
            this.valDiferencia = 0
  
            this.pend = []
            this.valores = []
            this.cueItems = []
            this.cueNewIems = []
  
            this.pend.push({
              id: item.pendientes[0].id,
              cpr: item.cpr,
              vencimiento: moment(item.pendientes[0].vencimiento).format('YYYY-MM-DD'),
              importe: item.pendientes[0].importe,
              pendiente: item.pendientes[0].pendiente,
              acancelar: item.pendientes[0].pendiente,
              acciones: ''
            })
  
//          if (this.maletinesCli.length==0) {
              this.cargoValorInicialEnValores(item.id, item.pendientes[0].pendiente, 1)
              this.medpag[0].total = item.pendientes[0].pendiente
//          } else {
//            if (this.hayMaletin.efectivo!=0) {
//              this.cargoValorInicialEnValores(item.id, this.hayMaletin.efectivo, 1)
//              this.medpag[0].total = this.hayMaletin.efectivo
//            }
//          }
  
            this.notificaEnBaseAOtro = [{
              user_id_desde: this.userId,
              user_id_hasta: item.tercero_id,
              cpr: item.cpr,     // Esto es para que en la API busque el PEDIDO original del cliente y lo marque como finalizado
              comprobante_id: 0, // En la API debe grabar el venta.id del nuevo comprobante 
              tipo: 'F',
              detalles: 'Pago de Factura',
              estado: 'P'
            }]
            // Como es EnBaseAOtro, debo marcar el comprobnate padre indicando que ya esta procesado
            this.notificaOriginal = [{
              comprobante_id: item.id,
              estado: 'F'
            }]
  
            // AL SER UN COBRO NO NECESITO CARGAR CUENTA ALGUNA
            // NI CHEQUES DE TERCEROS, EN TODO CASO SE INGRESAN
            // LO QUE SI, SE CARGARAN CHEQUES, Y EN ESE MOMENTO
            // TAMBIEN LOS LIBRADORES DE LOS MISMOS.
          }
        })

      } else if (que === 'ndcfac') {

        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
          this.itemActual = data.c
          item = data.c
          if (this.itemActual.pendientes.length>0) {
            if (this.itemActual.pendientes[0].pendiente<=0) {
              this.msg.msgTitle = '¡Comprobante sin Saldo!'
              let msg = 'No se puede imputar Notas de Créditos a este comprobante, '
              msg += 'ya no dispone de saldo imputable.<br>'
              this.msg.msgBody = msg
              this.msg.msgVisible = true
              this.msg.msgAccion = 'comprobante sin saldo'
              this.msg.msgButtons = ['Aceptar']
              this.cuentaYaAsignada = true
              this.dialog = false
              return
            }
          }

          if (this.sucursalDemo) {
            this.formTitle = 'Aplicar Nota de Crédito al Presupuesto'+item.cpr+' - ('+item.tercero.nombre+')'
          } else {
            this.formTitle = 'Aplicar Nota de Crédito a la Factura'+item.cpr+' - ('+item.tercero.nombre+')'
          }
          this.dialogNdcxDev = false
          this.articulos = []
          this.searchTerceros = ''
          this.dialogRem = false
          this.dialogNddFac = false
          this.dialogNdcFac = true
          this.isLoadingTerceros = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
          this.basadoEnCpr = true;      // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
          this.basadoEnOtroCpr.push(item.id)
          this.editado.tercero_id = item.tercero_id
          this.editado.nombre = item.tercero.nombre
          this.editado.responsableAbrev = item.tercero.responsable.abrev
          this.editado.documento = item.tercero.documento.nombre
          this.editado.documento_id = item.documento_id
          this.editado.documentoCodigo  = item.tercero.documento.codigo
          this.editado.deposito_id = item.deposito_id
          this.remitoItems = item.items.length
          this.articulos = item.items
          
          let posiva = 0
          for (let i=0; i<=this.articulos.length-1; i++) {
            this.articulos[i].adevolver = this.articulos[i].cantidad
          }

          this.editado.direccion_id = item.direccion_id
          this.editado.cpr = item.cpr
          this.editado.total = item.total
          this.editado.rentabilidad = this.rentabilidad
          this.editado.documentoNumero = item.tercero.cuit
          this.editado.moneda_id = item.moneda_id
          this.editado.observaciones = 'NDC'
          let rid = item.tercero.responsable.id

          this.cfUser = this.responsable
          //this.cfUser = Number(item.tercero.responsable.codigo)

          this.ndcTasaDescuento = 0
          this.ndcTotal = 0
          this.electronica = !this.sucursalDemo
        
        })

      } else if (que === 'nddfac') {

        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
          this.itemActual = data.c
          item = data.c
          this.formTitle = 'Aplicar Nota de Debito a Factura'+item.cpr+' - ('+item.tercero.nombre+')'
          //this.dialogNddxDev = false
          this.articulos = []
          this.searchTerceros = ''
          this.dialogRem = false
          this.dialogNdcFac = false
          this.dialogNddFac = true
          this.isLoadingTerceros = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
          this.basadoEnCpr = true;      // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
          this.basadoEnOtroCpr.push(item.id)
          this.editado.tercero_id = item.tercero_id
          this.editado.nombre = item.tercero.nombre
          this.editado.responsableAbrev = item.tercero.responsable.abrev
          this.editado.documento = item.tercero.documento.nombre
          this.editado.documento_id = item.documento_id
          this.editado.documentoCodigo  = item.tercero.documento.codigo
          this.editado.deposito_id = item.deposito_id
          this.remitoItems = item.items.length
          this.articulos = []

          this.editado.direccion_id = item.direccion_id
          this.editado.cpr = item.cpr
          this.editado.total = item.total
          this.editado.rentabilidad = this.rentabilidad
          this.editado.documentoNumero = item.tercero.cuit
          this.editado.moneda_id = item.moneda_id
          this.editado.observaciones = 'NDD'
          let rid = item.tercero.responsable.id

          this.cfUser = this.responsable
          //this.cfUser = Number(item.tercero.responsable.codigo)
          this.nddTasaDescuento = 0
          this.nddTotal = 0
          this.electronica = !this.sucursalDemo
        
        })

      } else if ( que.cpr.substring(0,3)=='PED' || que.cpr.substring(0,3)=='RTV' ) {

        this.editado = Object.assign({}, this.defaultItem)
        this.maletinesCli = []
        return HTTP().post('comprobante', { id: que.id }).then(({ data }) => {
          this.itemActual = data.c
          que = data.c

          if (data.c.vendedor!=undefined) {
            this.editado.vendedor = que.vendedor
          }

          // TENGO QE VER SI EL CLIENTE TIENE O NO CUENTA CORRIENTE
          // SI TIENE, LA SUGUIERO COMO PRIORIDAD
          this.electronica = !this.sucursalDemo
          this.formTitle = this.sucursalDemo ? 'Presupuestar' : 'Facturar'
          if (que.cpr.substring(0,3)=='PED') {
            this.formTitle += ' el Pedido '+que.cpr+' - ('+que.tercero.nombre+')'
          } else {
            this.formTitle += ' el Retiro '+que.cpr+' - ('+que.tercero.nombre+')'
            this.facRet = que.id
          }
          this.searchTerceros = ''
          this.isLoadingTerceros = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
          this.basadoEnCpr = true;   // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
          this.editado.tercero_id = que.tercero_id;
          this.editado.nombre = que.tercero.nombre;
          this.editado.responsableAbrev = que.tercero.responsable.abrev
          this.editado.documento = que.tercero.documento.nombre
          this.editado.documento_id = que.documento_id
          this.editado.documentoCodigo  = que.tercero.documento.codigo
          this.editado.mediodepago_id = que.mediodepago_id
          this.editado.documentoNumero = que.tercero.cuit
          this.editado.moneda_id = que.moneda_id
          let rid = que.tercero.responsable.id
          
          //this.cfUser = Number(que.tercero.responsable.codigo)
          
          this.cfUser = this.responsable
          this.ctacte = false
          if (que.tercero.usersterceros.length>0) {
            this.ctacte = que.tercero.usersterceros[0].ctacte
            this.diasvenc = que.tercero.usersterceros[0].diasvenc
            this.bonificacionmaxima = que.tercero.usersterceros[0].bonificacionmaxima
            this.creditomaximo = que.tercero.usersterceros[0].creditomaximo
          }
          this.editado.cpr = this.sucursalDemo ? 'PRE' : 'FAC';
          if (this.cfUser===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO
            if(rid===1 || rid===2 || rid===6 || rid===9 || rid===11) {
              this.editado.letra = this.comprobantesm?'M':'A'
            } else {
              this.editado.letra = 'B'
            }
          } else if (this.cfUser===6) { //EL USUARIO ES MONOTRIBUTISTA
              this.editado.letra = 'C'
          }
          this.dirItems.push(que.tercero.direcciones[0])
          this.editado.direccion_id = this.dirItems[0].id
          this.editado.deposito_id = this.depItems[0].id
          this.editado.texto = this.sucursalDemo ? 'PREPED' : 'FAC'+que.cpr.substring(0,3) // 'FACPED' o 'FACRTV'
          this.editado.comprobante_id = 126

          this.editado.vendedor.id = que.vendedor_id
          this.editado.observaciones = que.observaciones
          this.editado.viaje_id = que.viaje_id
          //Puede que el pedido tenga articulos pero con cantidad en cero, ( transferidos a otra sucursal )
          //Si es asi no lo proceso.
          //Cargo los articulos en un array y los mando a la API para que se actualicen los costos.
          //El pedido viene con el costo del quien lo hizo.
          let arts = []
          let ctt = 0
          for (let i=0; i<=que.items.length-1; i++) {
            arts.push(que.items[i].articulo_id)
            ctt += que.items[i].cantidad
          }

          if (que.items.length>0&&ctt==0) {

            this.msg.msgTitle = 'Comprobante sin Unidades!'
            let msg = '¡Este comprobante no posee unidades en sus items!<br>'
            msg += 'No se puede realizar este comprobante.<br>'
            this.msg.msgBody = msg
            this.msg.msgVisible = true
            this.msg.msgAccion = 'Comprobante sin unidades'
            this.msg.msgButtons = ['Aceptar']
            this.cuentaYaAsignada = true
            this.dialog = false
            return

          } else {

            // huguito
            // actualizo precios si corresponde
            return HTTP().post('/articuloz', {
              search: arts,
              vinculosPadresLic: this.$store.state.vinculosPadresLic,
              vinculosPadresAll: this.$store.state.vinculosPadresAll,
              proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: this.$store.state.soloArtComprados, descuentos: this.descuentos,
              dolar: this.$store.state.dolar, activos: true, limit: 300 }).then(({ data })=>{

              let data1 = data
              let loTengo = false

            //  return HTTP().post('/revisocostosparafacturar', { arts: arts }).then(({ data }) => {

                //Cargo los articulos del pedido, pero primero tengo que ver si ya fueron cargados anteriormente y quedo saldo (estado = 'L')
                //En ese caso tengo que buscar en vinuculados para sacar la diferencia
                //busco comprobantes que imputaron a este pedido.

              this.articulos = [];
              for (let i=0; i<=que.items.length-1; i++) {
                if (que.items[i].cantidad!=0) {
                  let pos = data1.findIndex(x => x.id === que.items[i].articulo_id)
                  if (pos!=-1) {
                    let pre = data1[pos].precios[0].precio
                    let tde = data1[pos].precios[0].ofetasadescuento||0
                    let ctt = que.items[i].cantidad
                    let ide = pre*(tde/100)
                    loTengo = data1[pos].precios[0].loTengo
                    que.items[i].costo = pre
                    que.items[i].precio = pre
                    que.items[i].total = (pre-ide)*(ctt)
                    que.items[i].tasadescuento = tde
                    que.items[i].importedescuento = (ide*ctt)
                  }
                  this.articulos.push({ 
                    id: null,
                    articulo_id: que.items[i].articulo_id,
                    codigo: que.items[i].articulo.codigo,
                    codbar: que.items[i].articulo.codbar,
                    nombre: que.items[i].articulo.nombre,
                    deposito_id: this.editado.deposito_id,
                    unidad_id: que.items[i].articulo.unidad_id,
                    moneda_id: que.items[i].articulo.moneda_id,
                    iva_id: que.items[i].articulo.iva_id,
                    cantidad: Number(que.items[i].cantidad),
                    cantidadoriginal: Number(que.items[i].cantidad), stock: Number(que.items[i].cantidad), undstock: que.items[i].articulo.undstock,
                  //sinstock: que.items[i].articulo.precios[0].sinstock, 
                    costo: que.items[i].costo,
                    precio: que.items[i].precio,
                    preciooriginal: que.items[i].precio,
                    tasadescuento: que.items[i].tasadescuento,
                    importedescuento: que.items[i].importedescuento,
                    tasaproprecargo: 0,
                    total: que.items[i].total,
                    texto: que.items[i].texto,
                    vencimiento: que.items[i].vencimiento,
                    adevolver: 0,
                    padre_id: null,
                    undenvase: que.items[i].articulo.undenvase,
                    escombo: que.items[i].articulo.escombo,
                    ofeprecio: 0,
                    ofetasdes: 0,
                    ofeenvio: 0,
                    ofeunidades: 0,
                    ofeestado: '',
                    turno_id: null,
                    decimales: 2, //que.items[i].articulo.precios[0].decimales,
                    preciomediocobro: false,
                    loTengo: loTengo,
                  })
                }
              }

              return HTTP().get('/buscocomprobantesvinculados/'+que.id ).then(({ data }) => {
                if (data.length>0) {
                  for (let i=0; i<=data.length-1; i++) {
                    for (let j=0; j<=this.articulos.length-1; j++) {
                      if (data[i].articulo_id===this.articulos[j].articulo_id) {
                        this.articulos[j].cantidad+=data[i].stock
                        this.articulos[j].cantidadoriginal+=data[i].stock
                        this.articulos[j].total = this.articulos[j].precio*this.articulos[j].cantidad
                      }
                    }
                  }
                  for (let j=0; j<=this.articulos.length-1; j++) {
                    if (this.articulos[j].cantidad == 0) {
                      this.articulos.splice(j, 1)
                      break
                    }
                  }
                }

                // Como es EnBaseAOtro, dejo listo el array para luego notificarlo, SOLO PEDIDOS
                if (que.cpr.substring(0,3)=='PED') {
                  this.notificaEnBaseAOtro = [{
                    user_id_desde: this.userId,
                    user_id_hasta: que.tercero_id,
                    cpr: que.cpr,       // Esto es para que en la API busque el PEDIDO original del cliente y lo marque como finalizado 
                    comprobante_id: 0,  // En la API debe grabar el venta.id del nuevo comprobante 
                    tipo: 'F',
                    detalles: que.cpr.substring(0,3)=='PED'?'Pedido Facturado':'Retiro Facturado',
                    estado: 'P'
                  }]
                }
                if (que.cpr.substring(0,3)=='PED' || que.cpr.substring(0,3)=='RTV') {
                  // Como es EnBaseAOtro, debo marcar el comprobnate padre indicando que ya esta procesado
                  this.notificaOriginal = [{
                    comprobante_id: que.id,
                    estado: 'F'
                  }]
                }

                this.dialog = true
                this.cargoSaldosYValoresPendientes(que.tercero_id)
                if (this.ctacte) {
                  this.medpag[3].activo = true
                  this.medpag[3].total = this.editado.total
                }
                if (que.cpr.substring(0,3)=='PED' && que.cpr.substring(11,20)=='00000001' && !this.ctacte) { 
                  this.msg.msgTitle   = 'Aviso'
                  let m = 'Vas a Facturar el primer pedido de este Cliente.<br>';
                  m += 'En forma predeterminada el sistema va a realizar una Factura de ';
                  m += 'Contado.<br>';
                  m += 'Si deseas cambiar esta condición debes activar <i>Cuenta Corriente</i>';
                  m += ' en la ficha de este Cliente<br>.';
                  this.msg.msgBody    = m;
                  this.msg.msgVisible = true
                  this.msg.msgAccion  = 'cambiar condicion de venta'
                  this.msg.msgButtons = ['Aceptar']
                }
              })
            })
          }
        })
      }
    },

    administracionPedidos() {
      this.dialogAdministracionPedidos = true

      this.filtrosEstadosCprs[0].ctt = 0  //todos
      this.filtrosEstadosCprs[1].ctt = 0  //facturas
      this.filtrosEstadosCprs[2].ctt = 0  //ndd
      this.filtrosEstadosCprs[3].ctt = 0  //ndc
      this.filtrosEstadosCprs[4].ctt = 0  //rem

      debugger
      return HTTP().post('/viajeadministracion', { viaje_id: this.itemActualViaje.id }).then(({ data }) => {

        debugger

        // pueden haber recorridos sin pedidos, dejo en rec solo los que tuvieron pedidos
        let rec = []
        let cpr = ''
        let anu = false
        let clave1 = ''
        let clave2 = ''
        this.viajesStatics = { 
          a: { ped: 0,fac: 0, ndc: 0 }, 
          b: { ped: 0,fac: 0, ndc: 0 }, 
          r: 0
        }
        this.viajesStaticsSay = 0

        // ordeno por comprobantes
        data.viajes.sort((o1, o2) => {
          if (o1.cpr>o2.cpr) { return 1; }
          else if (o1.cpr<o2.cpr) { return -1; } 
          else { return 0; }
        })

        // agrupo y armo los cprsA y cprsB
        for (let i=0; i<=data.viajes.length-1; i++) {

          let unds = 0
          for (let j=0; j<=data.viajes[i].items.length-1; j++) {
            unds += data.viajes[i].items[j].cantidad
          }
          if (unds!=0) {

            clave1 = data.viajes[i].cpr+data.viajes[i].tercero_id
            let aob = 'a'

            // ¡IMPORTANTE! hay dos maletines, el que se carga para clientes ex/us, via recibos ( recibo: [] )
            // y el que se carga para clientes ex/nus, no tienen recibos y va en maletin[] fuera de recibo: []
            // y solo se carga para cprsA

            if (clave1!=clave2||clave2=='') {

              let lista = null
              if (data.viajes[i].tercero!=null) {
                if (data.viajes[i].tercero.usersterceros!=null) {
                  if (data.viajes[i].tercero.usersterceros.length>0) {
                    if (data.viajes[i].tercero.usersterceros[0].lista_id!=null) {
                      lista = data.viajes[i].tercero.usersterceros[0].lista.desc1
                      if (data.viajes[i].tercero.usersterceros[0].lista.desc2) {
                        lista += '-'+data.viajes[i].tercero.usersterceros[0].lista.desc2
                      }
                      lista += '%'
                    }
                  }
                }
              }

              rec.push({
                tercero: data.viajes[i].tercero,
                usaelsistema: data.viajes[i].tercero.user.usaelsistema,
                remito: { id:null, cpr:'PENDIENTE', total:null },
                lista: lista,
                cprsA: {
                  pedido: data.viajes[i],
                  factura: { id:null, cpr:'PENDIENTE', total:null, pendiente:null },
                  ndc: { id:null, cpr:'?', total:null },
                  ndd: { id:null, cpr:'?', total:null },
                  recibo: [],
                //recibo: { id:null, cpr:'PENDIENTE', total:null, maletin:null },
                //maletin: [0,0,0],
                  demo: data.viajes[i].sucursal.sucursaldemo
                },
                cprsB: {
                  pedido: null,
                  factura: { id:null, cpr:'PENDIENTE', total:null, pendiente:null },
                  ndc: { id:null, cpr:'?', total:null },
                  ndd: { id:null, cpr:'?', total:null },
                  recibo: [],
                //recibo: { id:null, cpr:'PENDIENTE', total:null, maletin:null },
                  demo: false,
                },
              })

              this.viajesStatics.a.ped ++

              clave2 = data.viajes[i].cpr+data.viajes[i].tercero_id

              cpr = rec[rec.length-1].cprsA.pedido.cpr
              cpr = cpr.substring(0,1)+cpr.substring(2,3)+cpr.substring(8,11)+cpr.substring(13,19)
              rec[rec.length-1].cprsA.pedido.cpr = cpr

            } else {

              rec[rec.length-1].cprsB.pedido = data.viajes[i] 
              rec[rec.length-1].cprsB.demo = data.viajes[i].sucursal.sucursaldemo

              cpr = rec[rec.length-1].cprsB.pedido.cpr
              cpr = cpr.substring(0,1)+cpr.substring(2,3)+cpr.substring(8,11)+cpr.substring(13,19)
              rec[rec.length-1].cprsB.pedido.cpr = cpr

              this.viajesStatics.b.ped ++

              aob = 'b'

            }

            // Los maletines para clientes ex/nus se leen desde la tabla viajes_recorridos_maletin
            // y se cargan en rec[i].cprsA.maletin[]
            /*
            if (data.viajes[i].recorrido!=null) {
              if (data.viajes[i].recorrido.maletin[0]!=undefined) {
                rec[rec.length-1].cprsA.maletin[0] = data.viajes[i].recorrido.maletin[0].efectivo+data.viajes[i].recorrido.maletin[0].efectivob
                rec[rec.length-1].cprsA.maletin[1] = data.viajes[i].recorrido.maletin[0].cheques+data.viajes[i].recorrido.maletin[0].chequesb
                rec[rec.length-1].cprsA.maletin[2] = data.viajes[i].recorrido.maletin[0].otros+data.viajes[i].recorrido.maletin[0].otrosb
              }
            }
            */

            for (let z=0; z<=4; z++) {
              this.filtrosEstadosCprs[z].ctt ++
            }

            if (data.viajes[i].vinculoPadre.length>0) {

              let p = rec.length-1
              let cprid = data.viajes[i].vinculoPadre[0].hijo.comprobante_id
              cpr = data.viajes[i].vinculoPadre[0].hijo.cpr
              cpr = cpr.substring(0,1)+cpr.substring(2,3)+cpr.substring(8,11)+cpr.substring(13,19)
              if (aob=='a') {
                rec[p].cprsA.factura.id = data.viajes[i].vinculoPadre[0].hijo.id
                rec[p].cprsA.factura.cpr = cpr
                rec[p].cprsA.factura.total = data.viajes[i].vinculoPadre[0].hijo.total
                rec[p].cprsA.factura.pendiente = data.viajes[i].vinculoPadre[0].hijo.pendientes[0].pendiente
                this.viajesStatics.a.fac ++
                this.filtrosEstadosCprs[1].ctt--
              } else {
                rec[p].cprsB.factura.id = data.viajes[i].vinculoPadre[0].hijo.id
                rec[p].cprsB.factura.cpr = cpr
                rec[p].cprsB.factura.total = data.viajes[i].vinculoPadre[0].hijo.total
                rec[p].cprsB.factura.pendiente = data.viajes[i].vinculoPadre[0].hijo.pendientes[0].pendiente
                this.viajesStatics.b.fac ++
                this.filtrosEstadosCprs[1].ctt--
              }

              if (data.viajes[i].vinculoPadre[0].hijos.length>0) {
                for (let j=0; j<=data.viajes[i].vinculoPadre[0].hijos.length-1; j++) {
                  let cprid = data.viajes[i].vinculoPadre[0].hijos[j].hijo.comprobante_id
                  anu = data.viajes[i].vinculoPadre[0].hijos[j].hijo.estado=='A'?true:false
                  cpr = data.viajes[i].vinculoPadre[0].hijos[j].hijo.cpr
                  cpr = cpr.substring(0,1)+cpr.substring(2,3)+cpr.substring(8,11)+cpr.substring(13,19)

                  if (cprid==125) {
                    rec[p].remito.id = data.viajes[i].vinculoPadre[0].hijos[j].hijo.id
                    rec[p].remito.cpr = cpr
                    rec[p].remito.total = data.viajes[i].vinculoPadre[0].hijos[j].hijo.total
                    this.viajesStatics.r ++
                  } else if (cprid==2||cprid==7||cprid==12||cprid==52) {
                    if (aob=='a') {
                      rec[p].cprsA.ndd.id = data.viajes[i].vinculoPadre[0].hijos[j].hijo.id
                      rec[p].cprsA.ndd.cpr = cpr
                      rec[p].cprsA.ndd.total = data.viajes[i].vinculoPadre[0].hijos[j].hijo.total
                      rec[p].cprsA.ndd.pendiente = data.viajes[i].vinculoPadre[0].hijos[j].hijo.pendientes[0].pendiente
                    } else {
                      rec[p].cprsB.ndd.id = data.viajes[i].vinculoPadre[0].hijos[j].hijo.id
                      rec[p].cprsB.ndd.cpr = cpr
                      rec[p].cprsB.ndd.total = data.viajes[i].vinculoPadre[0].hijos[j].hijo.total
                      rec[p].cprsB.ndd.pendiente = data.viajes[i].vinculoPadre[0].hijos[j].hijo.pendientes[0].pendiente
                    }
                    this.filtrosEstadosCprs[2].ctt--
                  } else if (cprid==3||cprid==8||cprid==13||cprid==53) {
                    if (aob=='a') {
                      rec[p].cprsA.ndc.id = data.viajes[i].vinculoPadre[0].hijos[j].hijo.id
                      rec[p].cprsA.ndc.cpr = cpr
                      rec[p].cprsA.ndc.total = data.viajes[i].vinculoPadre[0].hijos[j].hijo.total
                      rec[p].cprsA.ndc.pendiente = data.viajes[i].vinculoPadre[0].hijos[j].hijo.pendientes[0].pendiente
                      this.viajesStatics.a.ndc ++                      
                    } else {
                      rec[p].cprsB.ndc.id = data.viajes[i].vinculoPadre[0].hijos[j].hijo.id
                      rec[p].cprsB.ndc.cpr = cpr
                      rec[p].cprsB.ndc.total = data.viajes[i].vinculoPadre[0].hijos[j].hijo.total
                      rec[p].cprsB.ndc.pendiente = data.viajes[i].vinculoPadre[0].hijos[j].hijo.pendientes[0].pendiente
                      this.viajesStatics.b.ndc ++
                    }
                    this.filtrosEstadosCprs[3].ctt--

                  } else if ((cprid==4||cprid==9||cprid==15||cprid==54)&&!anu) {

                    let maletin = 0
                    for (let k=0; k<=data.viajes[i].vinculoPadre[0].hijos[j].hijo.valoresIngresos.length-1; k++) {
                      if (data.viajes[i].vinculoPadre[0].hijos[j].hijo.valoresIngresos[k].chequeado) {
                        maletin += data.viajes[i].vinculoPadre[0].hijos[j].hijo.valoresIngresos[k].importe
                      }
                    }
                    if (aob=='a') {
                      rec[p].cprsA.recibo.push({
                        id: data.viajes[i].vinculoPadre[0].hijos[j].hijo.id,
                        cpr: cpr,
                        total: data.viajes[i].vinculoPadre[0].hijos[j].hijo.total,
                        maletin: maletin
                      })
                    } else {
                      rec[p].cprsB.recibo.push({
                        id: data.viajes[i].vinculoPadre[0].hijos[j].hijo.id,
                        cpr: cpr,
                        total: data.viajes[i].vinculoPadre[0].hijos[j].hijo.total,
                        maletin: maletin
                      })
                    }
                  }
                }

                if (aob=='a') {
                  if (rec[p].cprsA.recibo.length>1) {
                    let totRec = 0
                    for (let z=0; z<=rec[p].cprsA.recibo.length-1; z++) {
                      totRec += rec[p].cprsA.recibo[z].total
                    }
                    rec[p].cprsA.recibo.push({ id: null, cpr: 'TOTAL', total: totRec, maletin: null })
                  }
                } else {
                  if (rec[p].cprsB.recibo.length>1) {
                    let totRec = 0
                    for (let z=0; z<=rec[p].cprsB.recibo.length-1; z++) {
                      totRec += rec[p].cprsB.recibo[z].total
                    }
                    rec[p].cprsB.recibo.push({ id: null, cpr: 'TOTAL', total: totRec, maletin: null })
                  }
                }

              }
            }
          }
        }

        // calculo los remitos faltantes, ya que en casos de a y b debe descontar * 2
        for (let i=0; i<=rec.length-1; i++) {
          if (rec[i].remito.id!=null) {
            if (rec[i].cprsA.factura.id!=null) {
              this.filtrosEstadosCprs[4].ctt--
            }
            if (rec[i].cprsB.factura.id!=null) {
              this.filtrosEstadosCprs[4].ctt--
            }
          }
        }
        for (let i=0; i<=4; i++) {
          this.filtrosEstadosCprs[i].ctt=this.filtrosEstadosCprs[i].ctt==0?'0':this.filtrosEstadosCprs[i].ctt
        } 

        let remitos = this.viajesStatics.a.ped>this.viajesStatics.b.ped?this.viajesStatics.a.ped:this.viajesStatics.b.ped
        let aRealizar = this.viajesStatics.a.ped+this.viajesStatics.b.ped+remitos
        let realizado = this.viajesStatics.a.fac+this.viajesStatics.b.fac+this.viajesStatics.r
        this.viajesStaticsSay = this.formatoImporte((realizado*100)/aRealizar);

        this.itemsRecorrido = rec
        this.iRAll = rec
        this.analisisDePedidos = []
        this.totalPedidos = 0

        let pos = this.filtrosEstadosCprs.findIndex(x=>x.tip==this.filtroEstadoCprsSel)
        if (pos!=-1) {
          this.setFiltroEstadoCprs(this.filtrosEstadosCprs[pos])
        }

        debugger
        return HTTP().post('/haystockparalospedidos', { suc: this.sucursal }).then(({ data }) => {

          debugger
          for (let i=0; i<= data.length-1; i++) {
            this.analisisDePedidos.push({
              articulo_id: data[i].articulo_id,
              codigo: data[i].codigo,
              nombre: data[i].nombre,
              cantidad: data[i].pedido,
              stock: data[i].stock,
              total: data[i].total,
              pedidos: data[i].pedidos,
            })
            this.totalPedidos+=data[i].total
          }
        })
      })
    },

    selMaletin(data) {
      this.verOSelMaletines = 'S'
    },

    verMaletines(accion) {
      this.maletines = []
      this.verOSelMaletines = 'V'
      // TENGO QUE VERIFICAR SI TODOS LOS CLIENTES DEL VIAJE TIENEN SU RECIBO CORRESPONDIENTE
      return HTTP().get('maletinespendientes/'+this.sucursal ).then(({data})=>{
        for (let i=0; i<=data.length-1; i++) {
          this.maletines.push({
            id: data[i].id,
            cobrador: data[i].cobrador,
            sucursal: data[i].nomsuc,
            cliente_id: data[i].idcli,
            cliente: data[i].nomcli,
            mdp: data[i].nommdp,
            observ: data[i].observ,
            importe: data[i].importe,
          })
        }
        if (accion=='v') {
          this.dialogVerSelMaletines = true
        }
      })
    },

    viajeEstado(estado) {
      if (this.itemActualViaje==null) {
        return false
      } else  {
        return this.itemActualViaje.estado==estado?true:false
      }
    },

    colorEstadoDelViaje() {
      if (this.itemActualViaje==null) {
        return this.temas.barra_lateral_bg
      } else {
        if (this.itemActualViaje.estado=='A') {
          return 'black'
        } else if (this.itemActualViaje.estado=='P'||this.itemActualViaje.estado=='L') {
          return 'red'
        } else if (this.itemActualViaje.estado=='I'||this.itemActualViaje.estado=='R') {
          return 'green'
        } else if (this.itemActualViaje.estado=='D') {
          return 'blue'
        }
      }
    },

    viajeEstadoSay(estado) {
      if (this.itemActualViaje==null) {
        return false
      } else  {
        if (this.itemActualViaje.estado=='A') {
          return 'Anulado'
        }else if (this.itemActualViaje.estado=='P') {
          return 'A la espera de Viajar'
        } else if (this.itemActualViaje.estado=='I') {
          return 'En Viaje de Ventas'
        } else if (this.itemActualViaje.estado=='D') {
          return 'En Administración'
        } else if (this.itemActualViaje.estado=='L') {
          return 'Listo para Reparto'
        } else if (this.itemActualViaje.estado=='R') {
          return 'En Viaje de Reparto'
        } else if (this.itemActualViaje.estado=='F') {
          return 'Finalizado'
        } else if (this.itemActualViaje.estado=='K') {
          return 'Finalizado y Cobrado'
        }
      }
    },

    viajeListoParaReparto() {
      return HTTP().post('/viajechequeotodofacturado',{ viaje_id: this.itemActualViaje.id }).then(({data})=>{

        debugger
        this.msg.msgTitle   = 'Enviar Viaje a Reparto'
        let m = ''
        let faltan = false
        m += '<br><b>Comprobantes Emitidos</b><br>'
        m += '<b>'+data.ped+'</b> pedidos, <b>'+data.ped+'</b> facturas, <b>'+data.ndd+'</b> Notas de Débito, '
        m += '<b>'+data.ndc+'</b> Notas de Crédito y <b>'+data.rem+'</b> Remitos.<br><br>'
        if (data.ped>data.fac) {
          m += '<b>¡Hay Pedidos sin Facturar!</b><br>'
          m += '<b>ATENCION<br>¡Si no has facturado todos los pedidos podrás hacerlo mas tarde.<br>'
          m += 'Pero es necesario que este todo facturado para que luego el repartidor pueda realizar la cobranza!.</b><br><br>'
          faltan = true
        }
        if (data.ndc<data.lis) {
          m += '<b>¡Hay descuentos no aplicados!</b><br>'
          //faltan = true
          if (data.lis==1) {
            m += data.lis+' cliente tiene descuentos asignados por lista de precios,<br>'
            m += 'pero no hay NDC emitidas.'
          } else {
            m += data.lis+' clientes tienen listas asignadas con descuentos.<br>'
            if (data.ndc<1) {
              m += 'Pero no hay NDCs emitidas.'
            } else {
              m += 'Pero solo hay '+data.ndc+ ' NDCs emitidas.'
            }
          }
          m += '<br>(Esto si utilizas NDCs para realizar descuentos)'
          m += '<br>'
        }
        if (data.rem<data.fac/2) {
          m += '<b>¡Faltan Remitos!</b><br>'
          faltan = true
        }

        if (faltan) {
          m += '<br><b>ATENCION<br></b>¡Faltan comprobantes!.<br>'
          m += 'Es necesario que estén todos los comprobantes emitidos, el repartidor necesitará de ellos para iniciar el viaje.<br>'
          m += 'No obstante puedes dejar el viaje listo para reparto y luego emitir los comprobantes faltantes.<br>'
        }
        if (data.ndc<data.lis) {
          m += '<b>¡Hay descuentos no aplicados!</b><br>'
          //faltan = true
          if (data.lis==1) {
            m += data.lis+' cliente tiene descuentos asignados por lista de precios,<br>'
            m += 'pero no hay NDC emitidas.'
          } else {
            m += data.lis+' clientes tienen listas asignadas con descuentos.<br>'
            if (data.ndc<1) {
              m += 'Pero no hay NDCs emitidas.'
            } else {
              m += 'Pero solo hay '+data.ndc+ ' NDCs emitidas.'
            }
          }
          m += '<br>(Esto si utilizas NDCs para realizar descuentos)'
          m += '<br>'
        }
        if (data.rem<data.fac/2) {
          m += '<b>¡Faltan Remitos!</b><br>'
          faltan = true
        }

        if (faltan) {
          m += '<br><b>ATENCION<br></b>¡Faltan comprobantes!.<br>'
          m += 'Es necesario que estén todos los comprobantes emitidos, el repartidor necesitará de ellos para iniciar el viaje.<br>'
          m += 'No obstante puedes dejar el viaje listo para reparto y luego emitir los comprobantes faltantes.<br>'
        }

        m += '<br>¿Confirmas dejar este viaje listo para su Reparto?<br><br>'
        this.msg.msgBody    = m
        this.msg.msgVisible = true
        this.msg.msgAccion  = 'listo para reparto'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      })
    },

    cprDesdeAdminDePedidos(item, cpr, div) {
      this.cprDesdeReparto = true
      let id = null
      if (cpr=='FAC') {
        id = div=='NODIV' ? item.cprsA.pedido.id : item.cprsB.pedido.id
      } else {
        id = div=='NODIV' ? item.cprsA.factura.id : item.cprsB.factura.id
      }
      this.cambioSucursal = div=='NODIV' ? item.cprsA.demo : item.cprsB.demo
      this.desdeAdmPedidos = true
      if (cpr=='FAC') {
        // BUSCO LOS DIAS DE VENCIMIENTO EL CLIENTE, VIENE del modelo TerceroUser, el tema
        // es que esa relacion me trae todos los usuarios que estan relacionados a este tercero.
        // por eso el for. La otra seria hacer un get() directamente a TerceroUser
        if (this.itemActual.tercero.users!=null) {
          let pos = this.itemActual.tercero.users.findIndex(x=>x.user_id == this.userId )
          if (pos!=-1) {
            this.diasvenc = this.itemActual.tercero.users[pos].diasvenc
          }
        }
      }
      this.activoSucursal(this.cambioSucursal?'setDemo':'setFiscal')
      if (cpr=='FAC') {
        this.nuevo({cpr:'PED', id:id})
      } else if (cpr=='NDD') {
        this.nuevo('nddfac', { id: id} )
      } else if (cpr=='NDC') {
        this.nuevo('ndcfac', { id: id} )
      } else if (cpr=='REM') {
        this.nuevo('remfac', { id: id} )
      } else if (cpr=='REC') {
        //this.nuevo('REC', { id: id} )

        return HTTP().get('/tercero/'+item.tercero.id+'/1/false/'+this.sucursal).then(({ data }) => {
          this.itemActualCliente = data
          this.maletinesCli = data.maletin==null?[]:data.maletin
          
          debugger
          this.setDatosRecibo(this.hayMaletin()?this.maletinesCli:null)
          this.nuevo('Recibos', id )
        })
      }
    },

    tieneAsociado(item,cual) {
      if (cual=='factura'&&item.cprsA.factura.id==null) {
        return false
      } else if (cual=='facturaB'&&item.cprsB.factura.id==null) {
        return false
      } else if (cual=='ndc'&&(item.cprsA.ndc.id==null&&item.cprsA.factura.id!=null&&item.cprsA.factura.pendiente>0)) {
        return false
      } else if (cual=='ndcB'&&(item.cprsB.ndc.id==null&&item.cprsB.factura.id!=null&&item.cprsB.factura.pendiente>0)) {
        return false
      } else if (cual=='ndd'&&(item.cprsA.ndd.id==null&&item.cprsA.factura.id!=null&&item.cprsA.factura.pendiente>0)) {
        return false
      } else if (cual=='nddB'&&(item.cprsB.ndd.id==null&&item.cprsB.factura.id!=null&&item.cprsB.factura.pendiente>0)) {
        return false
      } else if (cual=='remito'&&(item.remito.id==null&&item.cprsA.factura.id!=null)) {
        return false
      } else if (cual=='recibo'&&(item.cprsA.recibo.id==null&&item.cprsA.factura.id!=null)) {
        return false
      } else if (cual=='reciboB'&&(item.cprsB.recibo.id==null&&item.cprsB.factura.id!=null)) {
        return false
      } else {
        return true
      }
    },

    faltanRecibos(item,aob) {
      let totCpr = aob=='A'?item.cprsA.factura.total:item.cprsB.factura.total
      let totRec = 0
      let totNdd = 0
      let totNdc = 0

      if (aob=='A') {
        if (item.cprsA.recibo) {
          for (let i=0; i<=item.cprsA.recibo.length-1; i++) {
            totRec += this.roundTo(item.cprsA.recibo[i].total,2)
          }
        }
        if (item.cprsA.ndd) {
          totNdd += this.roundTo(item.cprsA.ndd.total,2)
        }
        if (item.cprsA.ndc) {
          totNdc += this.roundTo(item.cprsA.ndc.total,2)
        }
      } else {
        if (item.cprsB.recibo) {
          for (let i=0; i<=item.cprsB.recibo.length-1; i++) {
            totRec += this.roundTo(item.cprsB.recibo[i].total,2)
          }
        }
        if (item.cprsB.ndd) {
          totNdd += this.roundTo(item.cprsB.ndd.total,2)
        }
        if (item.cprsB.ndc) {
          totNdc += this.roundTo(item.cprsB.ndc.total,2)
        }
      }
      return (totCpr+totNdd+totNdc)>totRec?true:false
    },

    viajeEnReparto() {
      return this.itemActualViaje.estado=='L'||this.itemActualViaje.estado=='R'?true:false
    },
    
    bultosDelPedidoHTTP() {
      return HTTP().post('/bultosdelpedido', {id: this.itemActualPedido.id, bultos: this.bultos, }).then(({ data }) => {
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
        this.administracionPedidos()
      })
    },

    prepararEnvioRetiro(item, cual) {
      this.dialogEnvios = false
      this.dialogRetiro = false
      if (cual=='E') {
        this.dialogEnvios = true
      } else {
        this.dialogRetiro = true
      }
      return HTTP().get('/tercero/'+item.tercero.id+'/1/false/'+this.sucursal).then(({ data }) => {
        this.dirItems = []
        for (let i=0; i<= data.t[0].tercero.direcciones.length-1; i++) {
          this.dirItems.push(data.t[0].tercero.direcciones[i])
        }
        if (this.dirItems.length>0) {
          this.envio.direccion_id = this.dirItems[0].id
        }
        return HTTP().get('/comprobantesrastrear/'+item.id+'/updown').then(({ data }) => {
          let ras = []
          ras.push(data[0])
          for (let i=1; i<=data.length-1; i++) {
            for (let j=0; j<=data[i].length-1; j++) {
              if (this.isArray(data[i][j])==false) {
                ras.push(data[i][j])
              } else {
                for (let k=0; k<=data[i][j].length-1; k++) {
                  if (this.isArray(data[i][j][k])==false) {
                    ras.push(data[i][j][k])
                  } else {
                    for (let l=0; l<=data[i][j][k].length-1; l++) {
                      ras.push(data[i][j][k][l])
                    }
                  }
                }
              }
            }
          }
          if (cual=='E') {
            this.envio.tipodeenvio = 'P'
            this.envio.transporte_id = null
            this.envio.puntoderetiro_id = null
            this.envio.puntoderetirodireccion_id = null
            this.envio.llegada = moment().format('YYYY-MM-DD')
            this.envio.generaremito = false
            this.envio.remitogenerado = false
            this.envio.remito_id = null
            this.envio.remito_numero = null
            this.envio.remito_msg = 'Genera Remito'
            this.envio.importeflete = 0
            this.envio.bultos = this.itemActual.items.length
            this.envio.traking = null
            this.envio.quienretira = this.itemActual.tercero.nombre
            this.envio.documento = this.itemActual.tercero.cuit
            for (let i=0; i<=ras.length-1; i++) {
              if (ras[i].cpr2.substring(0,3)=='REM') {
                this.envio.remito_id = ras[i].id
                this.envio.remitogenerado = true
                this.envio.remito_msg = 'Remito ya generado'
                this.envio.remito_numero = ras[i].cpr2
                break
              }
            }
            if (this.envio.remito_id!=null) {
              this.envio.generaremito = true
            }
          } else if (cual=='R') {
            this.retiro.tipodeenvio = 'R'
            this.retiro.quienretira = this.itemActual.tercero.nombre
            this.retiro.documento = this.itemActual.tercero.cuit
            this.retiro.generaremito = false
            this.retiro.remitogenerado = false
            this.retiro.remito_id = ''
            this.retiro.remito_numero = ''
            this.retiro.remito_msg = 'Genera Remito'
            this.retiro.bultos = this.itemActual.items.length
            for (let i=0; i<=ras.length-1; i++) {
              if (ras[i].cpr2.substring(0,3)=='REM') {
                this.retiro.remito_id = ras[i].id
                this.retiro.remitogenerado = true
                this.retiro.remito_msg = 'Remito ya generado'
                this.retiro.remito_numero = ras[i].cpr2
                break
              }
            }
            if (this.retiro.remito_id!=null) {
              this.retiro.generaremito = true
            }
          }
        })
      })
    },

    irAlRemito(item) {
      return HTTP().get('/buscoremitovinculado/'+item.id ).then(({ data }) => {
        if (data) {
          this.selectTipoDeComprobante('Remitos', true)
        }
      })
    },

    controlNdc(item) {
      return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
        this.itemActual = data.c
        item = data.c
        return new Promise(function(fullfill, reject) {
          return HTTP().get('/buscondcvinculadas/'+item.id ).then(({ data }) => {
            let disp = []
            if (data.length>0) {
              for (let i=0; i<=data.length-1; i++) {
                disp.push({ articulo_id: data[i].articulo_id, cantidad: data[i].cantidad, total: data[i].total })
              }
            }
            for (let i=0; i<=item.items.length-1; i++) {
              for (let j=0; j<=disp.length-1; j++) {
                if (disp[j].articulo_id == item.items[i].articulo_id) {
                  disp[j].cantidad += item.items[i].cantidad
                }
              }
            }
            // ahora si algun item de disp.cantidad es > 0 puedo hacer ndc.
            let lDone = false
            if (disp.length>0) {
              for (let i=0; i<=disp.length-1; i++) {
                if (disp[i].cantidad > 0) {
                  lDone = true
                }
              }
            } else {
              lDone = true
            }
            fullfill( lDone )
          })
        })
      })

    },

    setComoPaga(cual) {
      if (this.editado.cpr.substring(0,3)=='FAC'&& this.editado.total > Number(this.disponible)&&this.ctacte&&this.medpag[3].total==0) {
        this.medpag[0].total = this.editado.total
      }
      this.dialogRec = true
      this.reciboDeUnSoloComprobante = true
      this.cargoValorInicialEnValores(null, this.editado.total, 1)
      this.cprBalanceado()
    },

    cargoValorInicialEnValores(cpregreso, total, medio) {
      if (this.valores.length==0) {
        let observ   = medio==1 ? 'COBRO EN EFECTIVO' : 'A CUENTA CORRIENTE'
        let medioNom = medio==1 ? 'Efectivo'          : 'Cuenta Corriente'
        this.valores.push({
          caja_id: this.caja, medio_id: medio, cuentaorigen_id: null, cuentadestino_id: null,
          cuentacheque_id: null, cuentatarjeta_id: null, banco_id: null, tarjeta_id: null,
          cpringreso_id: null, cpregreso_id: cpregreso, 
          cheque_id: null, echeq: false, fechafinanciera: null, fechasalida: null,
          importe: total, nrovalor: null, tipo: 'I', observ: observ,
          medioNombre: medioNom, cuenta: null, cuit: null, nombre: null,
          recargo: null, interes: null, domicilioFiscal: [], vuelto: 0, maletin_id: null
        })
      }
    },

    facturarAnotaciones() {
      this.msg.msgTitle   = 'Facturar Anotaciones de Ventas'
      this.msg.msgBody    = 'Confirma la Factura?'
      this.msg.msgVisible = true
      this.msg.msgAccion  = 'facturar anotaciones de ventas'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    listarHTTP(refrescoMeses){  //hev021
      this.itemActual = {cpr:'', tercero: {nombre: '', user: null }}
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

      this.progress = true
      let s = this.search==null||this.search=='' ? '' : this.search
      if (this.filtroComprobanteSel != 'Viajes') {
        return HTTP().post('/ventas', {
          suc: this.sucursal,
          sucdemo: this.sucursalDemo,
          cpr: this.filtroComprobante,
          ope: this.operarioEsVendedor ? this.operarioTerceroId : null,
          perfiscal: perfiscal,
          search: s }).then(({ data }) => {

          this.totMaletines = data.maletines==null?[]:data.maletines
          for (let i=0; i<=this.totMaletines.length-1; i++) { // ASIGNO PROPIEDAD 'sel'
            this.totMaletines[i].sel = false
          }

          for (let i=0; i<=this.comprobantes.length-1; i++) {
            this.comprobantes[i].total = 0
            this.comprobantes[i].ctt = 0
          }

          if (data.venta.length>0) {
            this.itemActual = data.venta[0]
          }

          this.filtrosEstados = []
          for (let i=0; i<=data.venta.length-1; i++) {
            let a = this.getEstado(data.venta[i].estado,'e',data.venta[i].pendientes[0],data.venta[i])
            let b = ''
            if (a=='Finalizado') {
              b = 'Finalizados'
            } else if (a.substring(0,7)=='Vencido') {
              b = 'Vencidos'
            } else if (a.substring(0,8)=='A Vencer') {
              b = 'A Vencer'
            } else if (a=='Vence Hoy') {
              b = 'Vencen Hoy'
            } else if (a=='Facturado') {
              b = 'Facturados'
            } else if (a=='Anulado') {
              b = 'Anulados'
            } else if (a=='p/Procesar') {
              b = 'p/Procesar'
            } else if (a=='Enviado') {
              b = 'Enviados'
            } else if (a=='Retirado') {
              b = 'Retirados'
            } else if (a=='Pendiente') {
              b = 'Pendientes'
            } else if (a=='En Empresa') {
              b = 'En Empresa'
            } else if (a=='Concluido') {
              b = 'Concluidos'
            } else if (a=='Parcial') {
              b = 'Parciales'
            } else if (a=='Entregado') {
              b = 'Entregados'
            }
            let p = this.filtrosEstados.findIndex(x => x.tip === b);
            if (p==-1) {
              this.filtrosEstados.push({tip: b, ctt: 1})
            } else {
              this.filtrosEstados[p].ctt ++
            }
            data.venta[i].filtroEstado = b
          }
          if (this.filtrosEstados.length>1) {
            this.filtrosEstados.unshift({tip: 'Todos', ctt: data.venta.length})
          }
  
          this.itemsAll = data.venta
          if (this.filtrosEstados.length>0) {

            let pos = this.filtrosEstados.findIndex(x=>x.tip==this.filtroEstadoSel)
            if (pos!=-1) {
              this.filtroEstadoSel = this.filtrosEstados[pos].tip
              this.setFiltroEstado(this.filtrosEstados[pos])
            } else {
              this.filtroEstadoSel = this.filtrosEstados[0].tip
              this.setFiltroEstado(this.filtrosEstados[0])
            }

          } else {

            this.items = data.venta

          }
  
          for (let i=0; i<=data.sqlret.length-1; i++) {
            if (data.sqlret[i].id==1 || data.sqlret[i].id==6 || data.sqlret[i].id == 11 || data.sqlret[i].id == 51) {
              this.comprobantes[0].total += data.sqlret[i].total
              this.comprobantes[0].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==2 || data.sqlret[i].id==7 || data.sqlret[i].id == 12 || data.sqlret[i].id == 52) {
              this.comprobantes[1].total += data.sqlret[i].total
              this.comprobantes[1].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==3 || data.sqlret[i].id==8 || data.sqlret[i].id == 13 || data.sqlret[i].id == 53) {
              this.comprobantes[2].total += data.sqlret[i].total
              this.comprobantes[2].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==4 || data.sqlret[i].id==9 || data.sqlret[i].id == 15 || data.sqlret[i].id == 54) {
              this.comprobantes[6].total += data.sqlret[i].total
              this.comprobantes[6].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==124) {
              this.comprobantes[3].total += data.sqlret[i].total
              this.comprobantes[3].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==125) {
              this.comprobantes[4].total += data.sqlret[i].total
              this.comprobantes[4].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==126) {
              this.comprobantes[5].total += data.sqlret[i].total
              this.comprobantes[5].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==134) {
              this.comprobantes[7].total += data.sqlret[i].total
              this.comprobantes[7].ctt   += data.sqlret[i].ctt
            }
          }
          this.progress = false

          //this.sayGrilla = true

        }).catch(function (error) {
          console.log(error);
        })
      
      } else {

        let pf = perfiscal.substring(0,4)+'-'+perfiscal.substring(4,7)

        return HTTP().post('/listarviajes', { area: this.operarioArea, tercero_id: this.operarioTerceroId, perfiscal: pf}).then(({ data }) => {
          this.filtrosEstados = []
          for (let i=0; i<=data.length-1; i++) {
            let a = this.getEstado(data[i].estado,'e')
            let b = ''
            if (a=='Finalizado') {
              b = 'Finalizados'
            } else if (a=='Pendiente') {
              b = 'Pendientes'
            } else if (a=='En Viaje') {
              b = 'En Viaje'
            } else if (a=='En Admin') {
              b = 'En Admin'
            } else if (a=='p/Reparto') {
              b = 'p/Reparto'
            } else if (a=='En Reparto') {
              b = 'En Reparto'
            } else if (a=='Recep.Maletines') {
              b = 'Finalizado'
            } else if (a=='Fzado.y Chqdo.') {
              b = 'Fzado.y Chqdo.'
            }
            let p = this.filtrosEstados.findIndex(x => x.tip === b);
            if (p==-1) {
              this.filtrosEstados.push({tip: b, ctt: 1})
            } else {
              this.filtrosEstados[p].ctt ++
            }
            data[i].filtroEstado = b
            data[i].pendientes = []
            data[i].vendido = 0
            data[i].facturas = 0
            data[i].ndd = 0
            data[i].ndc = 0
            data[i].recibos = 0
            data[i].remitos = 0
            data[i].valores = 0
            data[i].rendidos = 0

            let cprid = 0
            for (let j=0; j<=data[i].recorrido.length-1; j++) {
              if (data[i].recorrido[j].pedido) {
                if (data[i].recorrido[j].pedido.vinculoPadre) {
                  for (let k=0; k<=data[i].recorrido[j].pedido.vinculoPadre.length-1; k++) {
                    if (data[i].recorrido[j].pedido.vinculoPadre[k].hijo) {
                      data[i].facturas += data[i].recorrido[j].pedido.vinculoPadre[k].hijo.total 
                    }
                    if (data[i].recorrido[j].pedido.vinculoPadre[k].hijos) {
                      for (let l=0; l<=data[i].recorrido[j].pedido.vinculoPadre[k].hijos.length-1; l++) {
                        cprid = data[i].recorrido[j].pedido.vinculoPadre[k].hijos[l].hijo.comprobante_id
                        if (cprid==125) {
                          data[i].remitos ++
                        } else if (cprid==2||cprid==7||cprid==12||cprid==52) {
                          data[i].ndd += data[i].recorrido[j].pedido.vinculoPadre[k].hijos[l].hijo.total 
                        } else if (cprid==3||cprid==8||cprid==13||cprid==53) {
                          data[i].ndc += data[i].recorrido[j].pedido.vinculoPadre[k].hijos[l].hijo.total 
                        } else if (cprid==4||cprid==9||cprid==15||cprid==54) {
                          data[i].recibos += data[i].recorrido[j].pedido.vinculoPadre[k].hijos[l].hijo.total
                          data[i].valores += data[i].recorrido[j].pedido.vinculoPadre[k].hijos[l].hijo.meta.valoresEnA||0
                          data[i].rendidos += data[i].recorrido[j].pedido.vinculoPadre[k].hijos[l].hijo.meta.rendidosA||0
                        }
                      }
                    }
                  }
                }
                data[i].vendido += data[i].recorrido[j].pedido.total
              }
              if (data[i].recorrido[j].pedidob) {
                if (data[i].recorrido[j].pedidob.vinculoPadre) {
                  for (let k=0; k<=data[i].recorrido[j].pedidob.vinculoPadre.length-1; k++) {
                    if (data[i].recorrido[j].pedidob.vinculoPadre[k].hijo) {
                      data[i].facturas += data[i].recorrido[j].pedidob.vinculoPadre[k].hijo.total 
                    }
                    if (data[i].recorrido[j].pedidob.vinculoPadre[k].hijos) {
                      for (let l=0; l<=data[i].recorrido[j].pedidob.vinculoPadre[k].hijos.length-1; l++) {
                        cprid = data[i].recorrido[j].pedidob.vinculoPadre[k].hijos[l].hijo.comprobante_id
                        if (cprid==125) {
                          data[i].remitos ++
                        } else if (cprid==2||cprid==7||cprid==12||cprid==52) {
                          data[i].ndd += data[i].recorrido[j].pedidob.vinculoPadre[k].hijos[l].hijo.total 
                        } else if (cprid==3||cprid==8||cprid==13||cprid==53) {
                          data[i].ndc += data[i].recorrido[j].pedidob.vinculoPadre[k].hijos[l].hijo.total 
                        } else if (cprid==4||cprid==9||cprid==15||cprid==54) {
                          data[i].recibos += data[i].recorrido[j].pedidob.vinculoPadre[k].hijos[l].hijo.total 
                          data[i].valores += data[i].recorrido[j].pedidob.vinculoPadre[k].hijos[l].hijo.meta.valoresEnB||0
                          data[i].rendidos += data[i].recorrido[j].pedidob.vinculoPadre[k].hijos[l].hijo.meta.rendidosB||0
                        }
                      }
                    }
                  }
                }
                data[i].vendido += data[i].recorrido[j].pedidob.total
              }
            }
          }
          if (this.filtrosEstados.length>1) {
            this.filtrosEstados.unshift({tip: 'Todos', ctt: data.length})
          }
          if (data.length>0&&this.itemActualViaje==null) {  // carga solo la primera vez
            this.itemActualViaje = data[0]
          }
          this.itemsAll = data
          if (this.filtrosEstados.length>0) {
            let pos = this.filtrosEstados.findIndex(x=>x.tip==this.filtroEstadoSel)
            if (pos!=-1) {
              this.filtroEstadoSel = this.filtrosEstados[pos].tip
              this.setFiltroEstado(this.filtrosEstados[pos])
            } else {
              this.filtroEstadoSel = this.filtrosEstados[0].tip
              this.setFiltroEstado(this.filtrosEstados[0])
            }
          } else {
            this.items = data
          }
          this.progress = false

          //this.sayGrilla = true

        }).catch(function (error) {
          console.log(error);
        })
      }
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
      this.filtroEstadoSel = 'Todos'
      this.listarHTTP(false)
    },

    setMes(mes) {
      this.elMes = mes
      this.listarHTTP(false)
      this.filtroEstadoSel = 'Todos'
    },

    setFiltroEstado(fe) {
      if (fe.tip=='Todos') {
        this.items = this.itemsAll
      } else {
        this.items = this.itemsAll.filter(x=>x.filtroEstado==fe.tip)
      }
      this.filtroEstadoSel = fe.tip
    },

    setFiltroEstadoCprs(fe) {
      if (fe.tip=='Todos') {
        this.itemsRecorrido = this.iRAll
      } else {
        this.itemsRecorrido = []
        if (fe.tip=='Facturas Pendientes') {
          for (let i=0; i<=this.iRAll.length-1; i++) {
            if (this.iRAll[i].cprsA.factura.id==null||
               (this.iRAll[i].cprsB.factura.id==null)&&this.iRAll[i].cprsB.pedido!=null) {
              this.itemsRecorrido.push(this.iRAll[i])
            }
          }
        } else if (fe.tip=='NDD Pendientes') {
          for (let i=0; i<=this.iRAll.length-1; i++) {
            if (((this.iRAll[i].cprsA.factura.id!=null)&&(this.iRAll[i].cprsA.ndd.id==null)&&(this.iRAll[i].cprsA.recibo.id==null))||
               ((this.iRAll[i].cprsB.factura.id!=null)&&(this.iRAll[i].cprsB.ndd.id==null)&&(this.iRAll[i].cprsB.recibo.id==null))) {
              this.itemsRecorrido.push(this.iRAll[i])
            }
          }
        } else if (fe.tip=='NDC Pendientes') {
          for (let i=0; i<=this.iRAll.length-1; i++) {
            if (((this.iRAll[i].cprsA.factura.id!=null)&&(this.iRAll[i].cprsA.ndc.id==null)&&(this.iRAll[i].cprsA.recibo.id==null))||
               ((this.iRAll[i].cprsB.factura.id!=null)&&(this.iRAll[i].cprsB.ndc.id==null)&&(this.iRAll[i].cprsB.recibo.id==null))) {
              this.itemsRecorrido.push(this.iRAll[i])
            }
          }
        } else if (fe.tip=='Remitos Pendientes') {
          for (let i=0; i<=this.iRAll.length-1; i++) {
            if (((this.iRAll[i].cprsA.factura.id!=null)||(this.iRAll[i].cprsB.factura.id!=null))&&
              this.iRAll[i].remito.id==null) {
              this.itemsRecorrido.push(this.iRAll[i])
            }
          }
        } else if (fe.tip=='Recibos Pendientes') {
          for (let i=0; i<=this.iRAll.length-1; i++) {
            if ((this.iRAll[i].cprsA.factura.id!=null)&&(this.iRAll[i].cprsA.recibo.id==null)||
              (this.iRAll[i].cprsB.factura.id!=null)&&(this.iRAll[i].cprsB.recibo.id==null)) {
              this.itemsRecorrido.push(this.iRAll[i])
            }
          }
        }
      }
      this.filtroEstadoCprsSel = fe.tip
    },

    leoAnios() {
      let tipo = this.operarioEsVendedor?'A':'V'  // si es vendedor leo todos los tipos de comprobantes
      return HTTP().post('anios/', {tipo: tipo}).then(({ data }) => {
        
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
            this.anios.push(aniomes.substring(0,4))
            pos = Number(aniomes.substring(5,2))-1
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

    listarAnotaciones() {
      return HTTP().get('/anotadordeventas/'+this.sucursal).then(({ data }) => {
        this.anotadorId = data
        return HTTP().get('/ventasitems/'+this.anotadorId).then(({data})=> {
          this.articulos = []
          this.anotadorTotal = 0
          this.rentabilidad = 0
          for (let i=0; i<=data.length-1; i++) {
            this.articulos.push({ 
              id: null, articulo_id: data[i].articulo_id, codigo: data[i].articulo.codigo, codbar: data[i].articulo.codbar,
              nombre: data[i].articulo.nombre, deposito_id: data[i].deposito_id, unidad_id: data[i].articulo.unidad_id,
              moneda_id: data[i].articulo.moneda_id, iva_id: data[i].articulo.iva_id, cantidad: Number(data[i].cantidad),
              cantidadoriginal: Number(data[i].cantidad), stock: Number(data[i].cantidad), undstock: data[i].articulo.undstock,
              sinstock: data[i].sinstock, costo: data[i].costo, precio: data[i].precio, preciooriginal: data[i].preciooriginal,
              tasadescuento: 0, importedescuento: 0, tasaproprecargo: 0, total: data[i].total, texto: data[i].texto, vencimiento: data[i].vencimiento,
              adevolver: 0, padre_id: null, undenvase: data[i].articulo.undenvase, escombo: data[i].articulo.escombo,
              ofeprecio: 0, ofetasdes: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '', turno_id: null,
              decimales: data[i].articulo.precios.length>0?data[i].articulo.precios[0].decimales:2, preciomediocobro: false,
              loTengo: data[i].loTengo,
            })
          this.anotadorTotal += data[i].total
          this.rentabilidad += (data[i].preciooriginal-data[i].costo)*data[i].cantidad
          }
          this.anotadorTotal = this.roundTo(this.anotadorTotal,2)
          this.rentabilidad = this.roundTo(this.rentabilidad,2)
        })
        .catch(err => {
          console.log(err)
        })
      })
      .catch(err => {
        console.log(err)
      })
    },

    confirmarComprobante() {
      this.yaEnviado = true
      if (this.editedIndex!=-1) { // esta modificando

        return HTTP().patch('/updateitems/'+this.items[this.editedIndex].id, { articulos: this.articulos }).then(({data})=>{
          if (data==true) {
            this.mensaje('¡Pedido actualizado!', this.temas.forms_titulo_bg, 1500)
          } else {
            this.mensaje('¡Opps, hubo en error en la modificación del pedido!', this.temas.snack_error_bg, 2500)
          }
          this.dialog = false
          this.listarHTTP(false);
        })

      } else {

        if (!this.$refs.form.validate()) {
          this.mensaje('¡Debe completar todos los datos!', this.temas.snack_error_bg, 1500) 
          return this.dialog = true;
        }
        for (let i=0; i<=this.articulos.length-1; i++) {
          this.articulos[i].stock = (this.articulos[i].cantidad*(this.coef*-1) )
        }
        // si hay items en cero los elimino
        for (let j=0; j<=this.articulos.length-1; j++) {
          if (this.articulos.cantidad == 0) {
            this.articulos.splice(i, 1)
            break
          }
        }
        if (this.editado.cpr!=='PRE' || this.sucursalDemo) {
          this.valores = this.valores.filter(function(valor) {
            return valor.medio_id != 4
          })
          if (this.medpag[0].total !== 0 && this.valores.length==0) {  // hay efectivo, puede ser todo
            this.valores = []
            this.valores.push({ 
              caja_id: this.caja, medio_id: 1, cuentaorigen_id: null, cuentadestino_id: null,
              cuentacheque_id: null, cuentatarjeta_id: null, banco_id: null, tarjeta_id: null,
              cpringreso_id: null, cpregreso_id: null, 
              cheque_id: null, echeq: false, fechafinanciera: null, fechasalida: null,
              importe: this.medpag[0].total*this.coef, nrovalor: null, tipo: 'I', observ: 'COBRO EN EFECTIVO',
              medioNombre: 'Efectivo', cuenta: null, cuit: null, nombre: null,
              recargo: null, interes: null, domicilioFiscal: [], vuelto: 0, maletin_id: null
            })
          }
          if (this.medpag[3].total !== 0 && (this.editado.cpr!=='PRE' || this.sucursalDemo) && (this.editado.cpr!='REM')) {
            // Si es ctacte agrego en 'pendientes' para que grabe la cuenta corriente
            this.pendientes.push({ 
              comprobante_id: null,
              vencimiento: moment(new Date).add(this.diasvenc, 'd').format('YYYY-MM-DD'),
              importe: this.medpag[3].total*this.coef,
              pendiente: this.medpag[3].total*this.coef,
              concepto: 'EN CUENTA CORRIENTE'
            })
          }
        }
        this.altaHTTP().then((data) => {
          if ((this.electronica && this.electronicaOk)||(!this.electronica)) {
            this.yaEnviado = false
            this.cancelar();
            this.listarHTTP(true);
          }
        })
      }
    },

    activoSucursal(accion) {
      if (accion == 'setFiscal') {
        this.$store.commit('setSucursal',this.sucursalesPosibles[0].sucursal, { root: true })
        this.$store.commit('setSucursalFiscal',this.sucursalesPosibles[0].sucursalFiscal, { root: true })
        this.$store.commit('setTemas',this.sucursalesPosibles[0].tema, { root: true })
        this.$store.commit('setSucursalDemo',this.sucursalesPosibles[0].sucursalDemo, { root: true })
      } else if (accion == 'setDemo') {
        this.$store.commit('setSucursal',this.sucursalesPosibles[1].sucursal, { root: true })
        this.$store.commit('setSucursalFiscal',this.sucursalesPosibles[1].sucursalFiscal, { root: true })
        this.$store.commit('setTemas',this.sucursalesPosibles[1].tema, { root: true })
        this.$store.commit('setSucursalDemo',this.sucursalesPosibles[1].sucursalDemo, { root: true })
      }
    },

    async altaHTTP (que) {
      this.ivas = []
      this.asociado = []
      let espejo = []
      let novedad = null
      let pf = moment().format('YYYYMM');
      this.coef = 1
      let s = this.sucursalFiscal
      this.electronicaOk = false
      this.editado.estado = 'F'
      this.isLoadingTerceros = true       // para que no entre de nuevo en buscar clientes

      // Si el cliente tiene vendedor lo asigno, sino asigno el operario actal
      this.editado.vendedor.id = this.editado.vendedor.id==null?this.operarioTerceroId:this.editado.vendedor.id

      if (que=='remfac') {

        this.valores = []
        this.editado.comprobante_id = 125
        this.editado.cpr = 'REM'
        this.editado.letra = 'R'
        this.editado.observaciones = 'REMITO'

      } else if (this.editado.cpr.substring(0,3)=='PED') {

        this.editado.estado = 'P'

      } else if (this.editado.cpr.substring(0,3)=='REM') {

        this.basadoEnOtroCpr = []
        for (let i=0; i<=this.selected.length-1; i++) {
          this.basadoEnOtroCpr.push(this.selected[i].id)
        }

        // Los remitos no mueven stock
        for (let i=0; i<=this.articulos.length-1; i++) {
          this.articulos[i].stock = 0
        }
        // Tapoco gravado, exento e iva
        this.editado.gravado = 0
        this.editado.exento = 0
        this.editado.iva = 0
        this.editado.rentabilidad = 0
        this.editado.importedescuento = 0
        this.editado.mediodepago_id = null
        this.editado.deposito_id = null

      } else if (this.editado.cpr=='PRE') {

        this.editado.comprobante_id = 124
        this.editado.cpr = 'PRE'
        this.editado.estado = this.sucursalDemo ? 'F' : 'P'
        this.editado.observaciones = 'PRESUPUESTO'
        if (!this.sucursalDemo) {
          for (let i=0; i<=this.articulos.length-1; i++) {
            this.articulos[i].stock = 0
          }
        }
        if (this.editado.texto == 'PREPED') {
          this.notificaOriginal[0].estado = 'T'
          for (let i=0; i<=this.articulos.length-1; i++) {
            if (this.articulos[i].cantidad < this.articulos[i].cantidadoriginal) {
              if (this.notificaOriginal.length>0) {
                this.notificaOriginal[0].estado = 'P'
              }
            }
          }
        }

      } else if (this.editado.cpr=='FAC') {

        this.cargoIvas()
        if (this.editado.letra=='A'||this.editado.letra=='M') { this.editado.comprobante_id = this.comprobantesm?51:1}
        else if (this.editado.letra=='B') { this.editado.comprobante_id = 6 }
        else if (this.editado.letra=='C') { this.editado.comprobante_id = 11 }

        if (this.editado.texto == 'FACPED' || this.editado.texto == 'FACRTV') {
          novedad = {
            cpr_id: this.itemActual.id,
            novedad: this.editado.texto == 'FACPED'?'Pedido Facturado':'Retiro Facturado',
            rel_id: null,
            estado: 'N',
            accion: 'AGREGA',
          }
          this.editado.observaciones = this.editado.texto
          let parcial = false
          if (this.notificaOriginal.length>0) {
            for (let i=0; i<=this.articulos.length-1; i++) {
              if (this.articulos[i].cantidad < this.articulos[i].cantidadoriginal) {
                parcial = true
              }
            }
          }
          this.notificaOriginal[0].estado = parcial ? 'P' : 'T'
        }
       
      } else if (que=='ndcfac') {

        this.coef = -1
        if (this.itemActual.comprobante_id==1||this.itemActual.comprobante_id==124) { this.editado.comprobante_id = 3 } 
        else if (this.itemActual.comprobante_id==6) { this.editado.comprobante_id = 8 } 
        else if (this.itemActual.comprobante_id==11) { this.editado.comprobante_id = 13 }
        else if (this.itemActual.comprobante_id==51) { this.editado.comprobante_id = 53 } 

        //NDC, puede ser por 1-bonif, 2-devol, o 3-anulacion. En todos los casos debe imputar 
        //la cuenta corriente como si fuera un recibo.
        //Tambien se puede dar el caso de una NDC por adelanto de dinero. ( A CUENTA. no imputa )
        //let pend = this.itemActual.pendientes
        if (!this.sucursalDemo) {
          this.asociado = [{
            Tipo: this.itemActual.comprobante_id,
            PtoVta: 10,   // VER DE DONDE LO SACAMOS
            Nro: parseInt(this.itemActual.cpr.substr(12,8),10),
            Cuit: parseInt(this.itemActual.tercero.cuit,10)
          }]
        }

        this.editado.cpr = 'NDC'
        this.editado.letra = this.itemActual.cpr.substr(4,1)
        this.editado.observaciones = this.sucursalDemo?'PRE':'FAC'
        this.editado.sucursal_id = this.itemActual.sucursal_id
        this.editado.direccion_id = this.itemActual.direccion_id
        this.editado.documento_id = this.itemActual.documento_id
        this.editado.documentoCodigo  = this.itemActual.tercero.documento.codigo
        this.editado.mediodepago_id = this.itemActual.mediodepago_id
        this.editado.deposito_id = this.itemActual.deposito_id

        debugger
        this.editado.tercero_id = this.itemActual.tercero_id
        this.editado.vendedor.id = this.itemActual.vendedor_id
        this.editado.moneda_id = this.itemActual.moneda_id

        if (!this.sucursalDemo) {
          this.editado.gravado = this.roundTo(this.ndcTotal/1.21,2)
          this.editado.iva = this.roundTo(this.ndcTotal-this.editado.gravado,2)
        } else {
          this.editado.gravado = 0
          this.editado.iva = 0
        }
        this.editado.rentabilidad = this.roundTo(this.ndcTotal*(this.ndcTotal/this.editado.total),2)*-1
        this.editado.total = this.roundTo(this.ndcTotal,2)
        this.rentabilidad = this.editado.rentabilidad
        
        let articulo_id = 0
        let codigo = ''
        let nombre = ''
        if (this.ndcMotivoSel==1) {           // SE GENERA UN CODIGO DE ARTICULO PREDETERMINADO
          articulo_id = 2
          codigo = '2@1'
          nombre = 'NDC POR BONIFICACION'
          this.articulos = []
          this.articulos.push({
            id: null, articulo_id: articulo_id, codigo: codigo, codbar: null, nombre: nombre, deposito_id: null, unidad_id: null, moneda_id: null,
            iva_id: 5, cantidad: 1, cantidadoriginal: 1, stock: 0, undstock: 0, sinstock: 'C', costo: this.roundTo(this.ndcTotal/1.21,2),
            precio: this.roundTo(this.ndcTotal/1.21,2), preciooriginal: this.roundTo(this.ndcTotal/1.21,2), tasadescuento: 0, importedescuento: 0,
            tasaproprecargo: 0, total: this.roundTo(this.ndcTotal/1.21,2), texto: '', vencimiento: null, adevolver: 0, padre_id: null, undenvase: 1,
            escombo: false, ofeprecio: 0, ofetasdes: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '', turno_id: null,
            decimales: 2, preciomediocobro: false, loTengo: false,
          })
        } else if (this.ndcMotivoSel==2) {    // VIENE articulos[] YA CARGADO
          articulo_id = 3
          codigo = '3@1'
          nombre = 'NDC POR DEVOLUCION'
        } else if (this.ndcMotivoSel==3) {    // VIENE articulos[] YA CARGADO
          articulo_id = 4
          codigo = '4@1'
          nombre = 'NDC POR ANULACION'
        }

        if (this.itemActual.pendientes.length>0) {
          this.pendientes.push({
            comprobante_id: null,
            vencimiento: this.itemActual.pendientes[0].vencimiento.substring(0,10),
            importe: this.ndcTotal,
            pendiente: 0,
            concepto: 'X '+this.ndcMotivos[this.ndcMotivoSel-1].nombre+'@'+this.itemActual.pendientes[0].id
          })
        }

        // EL ESPEJO SOLO VA CUANDO EL CLIENTE TAMBIEN PERTENECE A GOHU
        if (this.itemActual.tercero.user) {
          espejo.push({
            comprobante_id: this.itemActual.id,
            tercero_id: this.itemActual.tercero_id,
            articulo_id: articulo_id,
            codigo: codigo,
            tipo: 'ndcfac'
          })
        }

        this.dialogNdcFac = false
        if (!this.sucursalDemo) {
          this.cargoIvas()
        }

      } else if (que=='nddfac') {

        this.coef = 1
        if (this.itemActual.comprobante_id==1) { this.editado.comprobante_id = 2 } 
        else if (this.itemActual.comprobante_id==6) { this.editado.comprobante_id = 7 } 
        else if (this.itemActual.comprobante_id==11) { this.editado.comprobante_id = 12 }
        else if (this.itemActual.comprobante_id==51) { this.editado.comprobante_id = 52 }

        //NDD, puede ser por 1-cheque rechazado, 2-mora, o 3-cambio de precio. En todos los casos debe imputar 
        //la cuenta corriente como si fuera una factura.
        
        this.editado.cpr = 'NDD'
        this.editado.letra = this.itemActual.cpr.substr(4,1)
        this.editado.observaciones = 'FAC'
        this.editado.sucursal_id = this.itemActual.sucursal_id
        this.editado.direccion_id = this.itemActual.direccion_id
        this.editado.documento_id = this.itemActual.documento_id
        this.editado.documentoCodigo  = this.itemActual.tercero.documento.codigo
        this.editado.mediodepago_id = this.itemActual.mediodepago_id
        this.editado.deposito_id = this.itemActual.deposito_id

        debugger
        this.editado.tercero_id = this.itemActual.tercero_id
        this.editado.moneda_id = this.itemActual.moneda_id
        this.editado.gravado = this.roundTo(this.nddTotal/1.21,2)
        this.editado.iva = this.roundTo(this.nddTotal-this.editado.gravado,2)
        this.editado.total = this.roundTo(this.nddTotal,2)
        this.editado.rentabilidad = 0

        this.asociado = [{
          Tipo: this.itemActual.comprobante_id,
          PtoVta: 10,   // VER DE DONDE LO SACAMOS
          Nro: parseInt(this.itemActual.cpr.substr(12,8),10),
          Cuit: parseInt(this.itemActual.tercero.cuit,10)
        }]
        
        let articulo_id = 0
        let codigo = ''
        let nombre = ''

        if (this.nddMotivoSel==1) {           // SE GENERA UN CODIGO DE ARTICULO PREDETERMINADO
          articulo_id = 7
          codigo = '6@1'
          nombre = 'NDD POR CHEQUE RECHAZADO'
        } else if (this.nddMotivoSel==2) {    // VIENE articulos[] YA CARGADO
          articulo_id = 6
          codigo = '12@1'
          nombre = 'NDD POR MORA'
        } else if (this.nddMotivoSel==3) {    // VIENE articulos[] YA CARGADO
          articulo_id = 5
          codigo = '5@1'
          nombre = 'NDD POR CAMBIO DE PRECIO'
        }
        this.articulos = []
        this.articulos.push({
          id: null, articulo_id: articulo_id, codigo: codigo, codbar: null, nombre: nombre, deposito_id: null, unidad_id: null, moneda_id: null,
          iva_id: 5, cantidad: 1, cantidadoriginal: 1, stock: 0, undstock: 0, sinstock: 'C', costo: this.roundTo(this.editado.gravado,2),
          precio: this.roundTo(this.editado.gravado,2), preciooriginal: this.roundTo(this.editado.gravado,2), tasadescuento: 0, importedescuento: 0,
          tasaproprecargo: 0, total: this.roundTo(this.editado.gravado,2), texto: '', vencimiento: null, adevolver: 0, padre_id: null, undenvase: 1,
          escombo: false, ofeprecio: 0, ofetasdes: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '', turno_id: null, decimales: 2,
          preciomediocobro: false, loTengo: false,
        })

        if (this.itemActual.cpr.substring(0,3)=='REC') {  // NDD EN RECIBO
          if (this.itemActual.cancelaciones.length>0) {
            this.pendientes.push({
              comprobante_id: null,
              vencimiento: this.itemActual.cancelaciones[0].cancelado.vencimiento.substring(0,10),
              importe: this.nddTotal,
              pendiente: this.nddTotal,
              concepto: 'X '+this.nddMotivos[this.nddMotivoSel-1].nombre+'@'+this.itemActual.cancelaciones[0].id
            })
          }

          this.editado.gravado = 0
          this.editado.exento = this.editado.total
          this.editado.iva = 0

        } else {

          if (this.itemActual.pendientes.length>0) {  // NDD EN FACTURA
            let pos = this.nddMotivos.findIndex(x=>x.id==this.nddMotivoSel)
            this.pendientes.push({
              comprobante_id: null,
              vencimiento: this.itemActual.pendientes[0].vencimiento.substring(0,10),
              importe: this.nddTotal,
              pendiente: this.nddTotal,
              concepto: 'X '+this.nddMotivos[pos].nombre+'@'+this.itemActual.pendientes[0].id
            })
          }

        }

        // EL ESPEJO SOLO VA CUANDO EL CLIENTE TAMBIEN PERTENECE A GOHU
        if (this.itemActual.tercero.user) {
          espejo.push({
            comprobante_id: this.itemActual.id,
            tercero_id: this.itemActual.tercero_id,
            articulo_id: articulo_id,
            codigo: codigo,
            tipo: 'nddfac'
          })
        }

        this.dialogNddFac = false
        this.cargoIvas()

      } else if (que=='anotaciones') {

        if (this.$store.state.datosEmpresa.responsable_id==1) {
          this.editado.comprobante_id = 6                 
        } else if (this.$store.state.datosEmpresa.responsable_id==6) {
          this.editado.comprobante_id = 11
        }
        this.editado.sucursal_id = this.sucursal
        this.editado.cpr = 'FAC'
        this.editado.letra = 'B'
        this.editado.tercero_id = 2
        this.editado.documento_id = 25
        this.editado.documentoCodigo  = 80
        this.editado.deposito_id = this.depItems[0].id              // HEV
        this.editado.moneda_id = 51
        this.editado.observaciones = 'ANOTADOR REMITO'
        this.editado.regstk = 1
        this.editado.mediodepago_id = 1
        this.editado.direccion_id = null

        this.notificaEnBaseAOtro = []
        this.notificaOriginal = []
        this.basadoEnOtroCpr = []
        this.valores = []
        this.valores.push({ 
          caja_id: this.caja, medio_id: 1, cuentaorigen_id: null, cuentadestino_id: null,
          cuentacheque_id: null, cuentatarjeta_id: null, banco_id: null, tarjeta_id: null,
          cpringreso_id: null, cpregreso_id: null, 
          cheque_id: null, echeq: false, fechafinanciera: null, fechasalida: null,
          importe: this.editado.total*this.coef, nrovalor: null, tipo: 'I', observ: 'COBRO EN EFECTIVO',
          medioNombre: 'Efectivo', cuenta: null, cuit: null, nombre: null,
          recargo: null, interes: null, domicilioFiscal: [], vuelto: 0, maletin_id: null
        })
        this.pendientes = []
        this.anotadorId =  this.anotadorId

        //Los precios en articulos[] vien finales, tengo que pasarlo a 'sin iva'
        //por compatibilidad
        for (let i=0; i<=this.articulos.length-1; i++) {
          this.articulos[i].precio = this.articulos[i].preciooriginal
          this.articulos[i].total  = this.articulos[i].cantidad*this.articulos[i].precio
        }
        this.calculos()
      
      } else if (que=='recibo') {

        this.coef = -1
        if (this.reciboDeUnSoloComprobante) {

          if (!this.sucursalDemo) {
            if (this.itemActual.comprobante_id==1||this.itemActual.comprobante_id==51) { this.editado.comprobante_id = this.comprobantesm?54:4 } 
            else if (this.itemActual.comprobante_id==6) { this.editado.comprobante_id = 9 } 
            else if (this.itemActual.comprobante_id==11) { this.editado.comprobante_id = 15 }
          } else {
            if (this.itemActual.cpr.substring(0,5)=='PRE-A') { this.editado.comprobante_id = 4 } 
            else if (this.itemActual.cpr.substring(0,5)=='PRE-B') { this.editado.comprobante_id = 9 } 
            else if (this.itemActual.cpr.substring(0,5)=='PRE-C') { this.editado.comprobante_id = 15 }
          }

          this.editado.letra           = this.itemActual.cpr.substr(4,1)
          this.editado.direccion_id    = this.itemActual.direccion_id
          this.editado.documento_id    = this.itemActual.documento_id
          this.editado.documentoCodigo = this.itemActual.tercero.documento.codigo

          debugger
          this.editado.tercero_id      = this.itemActual.tercero_id
          this.editado.moneda_id       = this.itemActual.moneda_id

        } else {
          
          //this.editado.comprobante_id  = this.editado.comprobante_id
          //this.editado.letra           = this.editado.letra
          //this.editado.direccion_id    = this.editado.direccion_id
          //this.editado.documento_id    = this.editado.documento_id
//        this.editado.documentoCodigo = this.itemActual.tercero.documento.codigo
          //this.editado.documentoCodigo = this.editado.documentoCodigo
          //this.editado.tercero_id      = this.editado.tercero_id
          //this.editado.moneda_id       = this.editado.moneda_id
          
        }

        this.editado.fecha          = moment().format('YYYY-MM-DD')
        this.editado.perfiscal      = moment().format('YYYY-MM')
        this.editado.mediodepago_id = 4
        this.editado.sucursal_id    = this.sucursal
        this.editado.sucursalFiscal = this.sucursalFiscal
        this.editado.cpr            = 'REC'
        this.editado.observaciones  = 'REC'
        this.editado.deposito_id    = null
        this.dialogRec              = false
        this.editado.gravado        = 0
        this.editado.iva            = 0
        this.editado.total          = this.roundTo(this.totValores,2)
        this.editado.rentabilidad   = 0
        this.editado.pendientes     = this.pend
        this.editado.valores        = this.valores
        //this.editado.hayMaletin     = this.hayMaletin

        return HTTP().post('/recibo', { editado: this.editado }).then(({ data }) => {

          if (data=='no hay consistencia') {
            this.mensaje('¡DATOS INCONSISTENTES!. Es posible que otro usuario ya haya cancelado algunos de las facturas pendientes.', this.temas.snack_error_bg, 5000) 
          } else if (data=='error') {
            this.mensaje('¡Opss, se ha producido un error. Reintente, si el error persiste consulte con gohu!', this.temas.snack_error_bg, 5000) 
          } else {
            this.mensaje('¡El recibo se ha registrado correctamente!', this.temas.forms_titulo_bg, 1500)
          }

          // Vuelvo la sucursal si la habia cambiado
          if (this.desdeAdmPedidos) {
            this.activoSucursal('setFiscal')
            this.listarHTTP(true)
            this.administracionPedidos()
          } else {
            this.listarHTTP(true)
          }
        });
      }

      // sumo al descuento global todos los descuentos que puedan tener los items.
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.editado.importedescuento += this.articulos[i].importedescuento
      }

      // Si es un pedido y tiene un vendedor, genero como si fuera una compra del cliente, pero con el vendedor
      if (this.editado.cpr.substring(0,3)=='PED' && this.editado.vendedor.id!=null) {

        // busco la sucursal del cliente ( puede tener varias )
        // Puede que el clente no use el sistema, en ese caso no tiene sucursal.
        let laSuc = 0
        let sucFis = ''
        if (this.userDelTerceroDatos[0].tercero.user) {
          for (let i=0; i<= this.userDelTerceroDatos[0].tercero.user.sucursales.length-1; i++) {
            if (this.userDelTerceroDatos[0].tercero.user.sucursales[i].sucursaldemo==0) {
              laSuc = this.userDelTerceroDatos[0].tercero.user.sucursales[i].id
              sucFis = this.userDelTerceroDatos[0].tercero.user.sucursales[i].fiscal
            }
          }
        } else {
          laSuc = this.sucursal
          sucFis = this.sucursalFiscal
        }

        return HTTP().post('/nuevacompra', {
          fecha:               moment().format('YYYY-MM-DD'),
          perfiscal:           moment().format('YYYY-MM'),
          tipo:                'CO',
          cpr:                 this.editado.cpr+'-'+this.editado.letra+' '+sucFis+'-00000000',
          user_id:             this.userDelTerceroDatos[0].tercero.user.id,
          sucursal_id:         laSuc,
          tercero_id:          this.datosEmpresa.id,
          comprobante_id:      126,
          direccion_id:        this.userDelTerceroDatos[0].tercero.direcciones[0].id,
          documento_id:        this.editado.documento_id,
          mediodepago_id:      this.editado.medio_id,
          deposito_id:         this.editado.deposito_id,
          vendedor_id:         this.editado.vendedor.id,
          moneda_id:           this.editado.moneda_id,
          tasadescuento:       this.editado.tasadescuento,
          importedescuento:    this.editado.importedescuento*this.coef,
          retiva:              this.editado.retiva*this.coef,
          retgan:              this.editado.retgan*this.coef,
          retib:               this.editado.retib*this.coef,
          gravado:             this.editado.gravado*this.coef,
          exento:              this.editado.exento*this.coef,
          iva:                 this.editado.iva*this.coef,
          total:               this.editado.total*this.coef,
          regstk:              false,
          estado:              this.editado.estado,
          activo:              true,
          articulos:           this.articulos,
          valores:             [],
          pendientes:          [],
          notificacion:        0,
          notificaEnBaseAOtro: 0,
          notificaOriginal:    0,
          gasto:               null,
          tasasIVA:            [],
          quienpidio:          'V',
        }).then(({ data }) => {
          let msg = ''
          if (data.estado.errno) {
            this.msg.msgTitle = 'Error en la grabación del Pedido'
            msg = 'Código de Error: '+data.estado.code+' ('+data.estado.errno+')<br><br>'
            msg += 'Mensaje: '+data.estado.sqlMessage+'<br>'
            this.msg.msgBody = msg
            this.msg.msgAccion  = 'Error en la grabacion del Pedido'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.msg.msgTitle = 'Grabación Correcta'
            this.msg.msgBody = '¡El pedido se ha registrado correctamente!<br>'
            this.msg.msgAccion  = 'Pedido OK'
            this.msg.msgButtons = ['Aceptar']
          }
          this.msg.msgVisible = true
          this.dialog = false

          // Vuelvo la sucursal si la habia cambiado
          if (this.desdeAdmPedidos==true) {
            this.activoSucursal('setFiscal')
          }
          this.listarHTTP(true)
        });

      } else {

        let cpr = ''
        if (this.esManual||this.sucursalDemo) {
          cpr = this.editado.cpr+'-'+this.editado.letra+' '+this.sucManual+'-'+this.nroManual 
          this.electronica = false
        } else {
          cpr = this.editado.cpr+'-'+this.editado.letra+' '+this.sucursalFiscal+'-'+'00000001'
        }

        return HTTP().post('/nuevaventa', {
          fecha:               moment().format('YYYY-MM-DD'),
          perfiscal:           pf,
          cpr:                 cpr,
          user_id:             this.userId,
          sucursal_id:         this.sucursal,
          tercero_id:          this.editado.tercero_id,
          comprobante_id:      this.editado.comprobante_id,
          direccion_id:        this.editado.direccion_id,
          documento_id:        this.editado.documento_id,
          documentonumero:     this.editado.documentoNumero,
          documentocodigo:     this.editado.documentoCodigo,
          mediodepago_id:      this.editado.mediodepago_id,
          deposito_id:         this.editado.deposito_id,
          vendedor:            this.editado.vendedor,
          moneda_id:           this.editado.moneda_id,
          tasadescuento:       this.editado.tasadescuento,
          importedescuento:    this.editado.importedescuento*this.coef,
          recargo:             this.recargo*this.coef,
          gravado:             this.editado.gravado*this.coef,
          exento:              this.editado.exento*this.coef,
          iva:                 this.editado.iva*this.coef,
          total:               this.editado.total*this.coef,
          rentabilidad:        this.rentabilidad,
          observaciones:       this.editado.observaciones,
          quienpidio:          this.editado.quienpidio,
          regstk:              true,
          estado:              this.editado.estado,
          activo:              true,
          articulos:           this.articulos,
          valores:             this.valores,
          pendientes:          this.pendientes,
          notificacion:        0,
          notificaEnBaseAOtro: this.notificaEnBaseAOtro,
          notificaOriginal:    this.notificaOriginal,
          basadoEnOtroCpr:     this.basadoEnOtroCpr,
          anotadorId:          this.anotadorId,
          espejo:              espejo,
          novedad:             novedad,
          electronica:         this.electronica,
          produccion:          this.datosEmpresa.faeproduccion,
          ivas:                this.ivas,
          asociado:            this.asociado,
          facturasEnRemito:    this.facturas,
          viaje_id:            this.editado.viaje_id,
          clienteVinculado:    this.clienteVinculado,
        }, { timeout: 25000 }).then(({ data }) => {

          // Vuelvo la sucursal si la habia cambiado
          if (this.desdeAdmPedidos==true) {
            this.activoSucursal('setFiscal')
          }

          if (!data) {
            this.mensaje('¡Opps!, hubo un problema en la grabación!, consulte con la mesa de ayuda Gohu.', this.temas.snack_error_bg, 3000) 
          } else {

            if ( this.electronica) {
              if (data.cpr==undefined) {
                this.electronicaOk = false
                this.msg.msgTitle = 'Error en el Comprobante Electrónico'
                let msg = ''
                msg = 'Código de Error: '+data.code+' ('+data.errno+')<br><br>'
                msg += 'No se puedo realizar el comprobante electrónico. '
                msg += 'Los servidores de AFIP no responden. '
                msg += 'Debera esperar y reintentar luego.<br>'
                msg += '<b>Si urge realizar el comprobante cambie a Manual.</b><br>'
                this.msg.msgBody = msg
                this.msg.msgAccion  = 'Comprobante Electronico Error'
                this.msg.msgButtons = ['Reintetar','Cancelar']
              } else {
                this.electronicaOk = true
                this.msg.msgTitle = 'Comprobante Electrónico'
                let msg = '<br>Se ha generado correctamente un nuevo comprobante electrónico.<br><br>'
                msg += 'Comprobante: <b>'+data.cpr+'</b><br>'
                msg += 'CAE: '+data.cae+'<br><br>'
                if (this.notificaEnBaseAOtro.length) {
                  msg += '¡El comprobante ha sido enviado al cliente!'
                }
                this.msg.msgBody    = msg
                this.msg.msgAccion  = 'Comprobante Electronico'
                this.msg.msgButtons = ['Aceptar']
              }
              this.msg.msgVisible = true
            } else {
              this.mensaje('¡El comprobante se ha registrado con éxito!', this.temas.forms_titulo_bg, 3000) 
            }
            if (this.cprDesdeReparto) {
              this.cprDesdeReparto = false
              this.administracionPedidos()
            }
          }
        })
      }
    },

    cargoIvas() {
      let recargo = this.recargo
      let pordes  = Number(this.editado.tasadescuento)
      let totitem = 0
      let impdes  = 0
      let pos     = 0
      let posiva  = 0
      this.ivas   = []

      for (let i=0; i<=this.articulos.length-1; i++) {
        posiva  = this.ivaTasas.map(function(e) { return e.id; }).indexOf(this.articulos[i].iva_id);
        pos     = this.ivas.map(function(e) { return e.Id; }).indexOf(this.articulos[i].iva_id);
        totitem = this.articulos[i].total
        totitem = totitem + (totitem*(this.articulos[i].tasaproprecargo/100))
        impdes  = 0
        if (pordes!=0) {
          impdes = totitem * (pordes/100)
          totitem -= impdes
        }
        totitem += recargo
        recargo = 0
        if (pos>=0) {
          this.ivas[pos].BaseImp += totitem
          this.ivas[pos].Importe += totitem*(this.ivaTasas[posiva].tasa/100)
        } else {
          this.ivas.push({
            Id: this.articulos[i].iva_id,
            BaseImp: totitem,
            Importe: totitem*(this.ivaTasas[posiva].tasa/100)
          })
        }
      }
      for (let i=0; i<=this.ivas.length-1; i++) {
        this.ivas[i].BaseImp = this.roundTo(this.ivas[i].BaseImp,2)
        this.ivas[i].Importe = this.roundTo(this.ivas[i].Importe,2)
      }
    },

    cancelar() {
      // Vuelvo la sucursal si la habia cambiado
      if (this.desdeAdmPedidos==true) {
        this.activoSucursal('setFiscal')
      }
      this.dialog = false;
      this.articulos = []
      this.editado = Object.assign({}, this.defaultItem);
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndex = -1;
    },

    cancelarSelArtPedErr() {
      this.dialogError = false
    },

    nuevoMed() {
      this.editedIndexMed = -1;
      this.dialogMed = true;
      this.cueItems = []
    },

    rastrear(item) {
      return HTTP().get('/comprobantesrastrear/'+item.id+'/updown').then(({ data }) => {
        let ras = []
        ras.push(data[0])
        for (let i=1; i<=data.length-1; i++) {
          for (let j=0; j<=data[i].length-1; j++) {
            if (this.isArray(data[i][j])==false) {
              ras.push(data[i][j])
            } else {
              for (let k=0; k<=data[i][j].length-1; k++) {
                if (this.isArray(data[i][j][k])==false) {
                  ras.push(data[i][j][k])
                } else {
                  for (let l=0; l<=data[i][j][k].length-1; l++) {
                    ras.push(data[i][j][k][l])
                  }
                }
              }
            }
          }
        }
        let r = []
        let lDone = false
        for (let i=0; i<=ras.length-1; i++) {
          lDone = false
          for (let j=0; j<=r.length-1; j++) {
            if (r[j].id == ras[i].id) {
              lDone = true
            }
          } 
          if (!lDone) {
            r.push(ras[i])
          }
        }
        this.rastreo = r
        this.dialogRas = true
      });

      /* esta prueba recursiva funciona, el tema es implementarlo en la API */
      /*
      let rastros = [
        {id:  1,padre:  8, hijo:  9},{id:  2,padre:  9, hijo: 10},{id:  3,padre: 10, hijo: 11},{id:  4,padre: 10, hijo: 12},
        {id:  5,padre: 11, hijo: 13},{id:  6,padre: 10, hijo: 14},{id:  7,padre: 11, hijo: 15},{id:  8,padre: 10, hijo: 16},
        {id:  9,padre: 11, hijo: 17},{id: 10,padre: 21, hijo: 22},{id: 11,padre: 22, hijo: 23},{id: 12,padre: 23, hijo: 24},
        {id: 13,padre: 26, hijo: 27},{id: 14,padre: 27, hijo: 28},{id: 15,padre: 28, hijo: 29},{id: 16,padre: 51, hijo: 52},
        {id: 17,padre: 67, hijo: 68},{id: 18,padre: 67, hijo: 69}]

      function nestedDown(arr, buscar, j) {
        var out = []
        for (let i=j; i<=arr.length-1; i++)  {
          if (arr[i].padre == buscar) {
            out.push(arr[i]);
            var children = nestedDown(arr, arr[i].hijo, i);
            if(children.length) {
              out.push(children); 
            }
          }
        }
        return out
      }

      function nestedUp(arr, buscar, j) {
        var out = []
        let lDone = true
        let i = j
        while (lDone==true) {
          if (arr[i].hijo == buscar) {
            out.push(arr[i]);
            var children = nestedUp(arr, arr[i].padre, i);
            if(children.length) {
              out.push(children); 
            }
          }
          i --
          if (i<0) {
            lDone = false
          }
        }
        return out
      }

      let res = nestedDown(rastros , 10, 0 )
      let ii = 0
      for (let i=0; i<=rastros.length-1; i++) {
        if (rastros[i].id == res[0].id) {
          ii = i
          break
        }
      }
      let resx = nestedUp(rastros , 10, ii )
      console.log(resx)
      */

    },

    leerTimeLine(item) {
      this.timeLine = []
      return HTTP().get('/timeline/'+item.id)
        .then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            this.timeLine.push(data[i])
          }
          this.dialogTimeLine = true
      });
    },

    cerrarNdc() {
      for (let i=0; i<=this.itemActual.items.length-1; i++) {
        this.itemActual.items[i].cantidad = this.itemActual.items[i].cantidadoriginal
      }
      this.dialogNdcFac = false
      if (this.desdeAdmPedidos==true) {
        this.activoSucursal('setFiscal')
      }
    },

    cerrarNdd() {
      this.dialogNddFac = false
      if (this.desdeAdmPedidos==true) {
        this.activoSucursal('setFiscal')
      }
    },

    cerrarTransfPed() {
      this.dialogTransferirPedido = false
      if (this.desdeAdmPedidos==true) {
         this.activoSucursal('setFiscal')
      }
    },

    setFP(cual, posMaletin) {
      // EN BASE A cual, SETEO LA FORMA DE PAGO: EFEC, CHE.CARTERA, BANCO, RETENCION.
      this.editedIndexMed = -1
      this.dialogMed = true
      this.medioDePagoId = cual
      if (cual==1) {
        this.medpagwidth = 400
      } else if (cual==2) {
        this.medpagwidth = 1100
      } else if (cual==3) {
        this.medpagwidth = 1100
      } else if (cual==5) {
        this.medpagwidth = 600
      } else if (cual==6) {
        this.medpagwidth = 1110
      } else if (cual==7 || cual == 8 || cual == 9 ) {
        this.medpagwidth = 500
      }
      this.cual = cual
      this.calculosMed()

      this.editadoMed = Object.assign({}, this.defaultItemMed)
      this.editadoMed.maletin_id = posMaletin
      this.cueItems = []
      if (posMaletin==null) {
        this.editadoMed.importe = this.roundTo(this.editado.total-this.totValores,2)
        this.medioDePagoNombre = this.medpag[cual-1].nombre
        this.editadoMed.maletinitem_id = null
      } else {
        this.editadoMed.importe = this.maletinesCli[posMaletin].importe
        this.medioDePagoNombre = this.medpag[this.maletinesCli[posMaletin].medio_id-1].nombre
        this.editadoMed.nrovalor = this.maletinesCli[posMaletin].observ
        // busco en el maletinitems ( maletinesCli )
        this.editadoMed.maletinitem_id = this.maletinesCli[posMaletin].id
      }
      this.editadoMed.fechafinanciera = moment().format('YYYY-MM-DD')
    },

    cprBalanceado() {
      if (this.editado.cpr.substring(0,3)=='REM') {
        return this.articulos.length==0?false:true
      }
      let valores = 0
      let cancelado = 0
      for (let i=0; i<=this.pend.length-1; i++) {
        cancelado += this.pend[i].acancelar
      }
      cancelado = this.roundTo(cancelado,2)
      if (this.editado.cpr.substring(0,3)!='REC') {
        cancelado = this.editado.total
      }
      for (let i=0; i<=this.medpag.length-1; i++) {
        valores += this.roundTo(this.medpag[i].total,2)
      }
      this.totCancelado = cancelado
      valores = this.roundTo(valores,2)
      cancelado = this.roundTo(cancelado,2)
      this.editado.total = this.roundTo(this.editado.total,2)
      if ((valores<this.editado.total)||this.editado.total==0) {
//    if ((valores!=this.editado.total)||(cancelado!=this.editado.total)||this.editado.total==0) {
        return false
      } else {
        return true
      }
    },

    automaticoPend(item) {
      let tot = this.editado.total
      for (let i=0; i<=this.pend.length-1; i++) {
        this.pend[i].acancelar = 0
      }
      for (let i=0; i<=this.pend.length-1; i++) {
        if (tot >= this.pend[i].pendiente) {
          this.pend[i].acancelar = this.pend[i].pendiente
          tot -= this.pend[i].pendiente
        } else if ( tot > 0 ) {
          this.pend[i].acancelar = tot
          tot = 0
        }
      }
      this.calculosMed()
    },

    editarPend(item) {
      this.itemActualPend = item
      this.editadoPend.acancelar = item.pendiente
      this.dialogPend = true
    },

    editarRet(item) {
      this.itemActual = item
    },

    guardarPend(item) {
      this.itemActualPend.acancelar = item.acancelar
      this.editado.total = item.acancelar
      this.calculosMed()
      this.dialogPend = false
    },

    cancelarPend() {
      this.dialogPend = false;
    },

    selectPend(item) {
      if (item.acancelar==0) {
        item.acancelar = item.pendiente
      } else {
        item.acancelar = 0
      }
      let tot = 0
      for (let i=0; i<=this.pend.length-1; i++) {
        tot += this.pend[i].acancelar
      }
      this.editado.total = this.roundTo(tot,2)
      this.calculosMed()
    },

    habinhab(obj) {
      let retval = false
      let mp = this.medioDePagoId
      if (mp==1) {            //EFECTIVO
        this.anchoDelDialogDeValores = 500
      } else if (mp==2) {     //TARJETA DE CREDITO
        if (obj=='cuenta' || obj=='tarjeta') {
          this.anchoDelDialogDeValores = 850
          retval = true
        }
      } else if (mp==3) {     //TARJETA DE DEBITO
        if (obj=='cuenta' || obj=='tarjeta') {
          this.anchoDelDialogDeValores = 850
          retval = true
        }
      } else if (mp==5) {     //TRANSFERENCIA
        if (obj=='cuenta' || obj=='transferencia') {
          this.anchoDelDialogDeValores = 850
          retval = true
        }
      } else if (mp==6) {     //CHEQUE
        if (obj=='cuenta' || obj=='chequera') {
          this.anchoDelDialogDeValores = 850
          retval = true
        } else if (obj=='cheque de tercero') {
          this.anchoDelDialogDeValores = 1200
          retval = true
        }
      } else if (mp==7) {     //MERCADO PAGO
        this.anchoDelDialogDeValores = 850
      } else if (mp==8) {     //TODO PAGO
        this.anchoDelDialogDeValores = 850
      }
      return retval
    },

    guardarRem() {
      this.yaEnviado = true
      this.altaHTTP('remfac').then((data) => {
        this.dialogRem = false
        this.cancelar();
        this.listarHTTP(true);
      })
    },

    confirmarValores(item) {
      if (this.editado.cpr.substring(0,3)=='REC') {
        this.yaEnviado = true
        let txt = ''
        let cprs = 0
        for (let i=0; i<=this.pend.length-1; i++) {
          if (this.pend[i].acancelar!=0) {
            cprs ++
          }
        }
        // reviso si hay cheques y si corresponden la cantidad
        if (cprs>1) {
          txt += 'Se cancelarán total o parcialmente '+cprs+' comprobantes.'
        } else if (cprs==1) {
          txt += 'Se cancelará total o parcialmente 1 comprobante.'
        } else if (cprs==0) {
          txt += 'Pago Anticipado.'
        }
        this.msg.msgTitle = 'Confirmar el Recibo'
        this.msg.msgBody = txt
        this.msg.msgVisible = true
        this.msg.msgAccion = 'cobrar comprobante'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      } else {
        this.dialogRec = false
      }
    },

    confirmarRetiroDeMercaderia() {
      this.yaEnviado = true
      this.editado.fecha = moment().format('YYYY-MM-DD')
      this.editado.perfiscal = moment().format('YYYYMM')
      return HTTP().post('/retirodemercaderia',{
        editado:this.editado,
        articulos:this.articulos,
        sucursal:this.sucursal}).then(({data})=>{
        this.listarHTTP(false)
        if (data=='error') {
          this.msg.msgTitle = 'Error en grabación'
          this.msg.msgBody    = 'Se ha producido un error en la grabación de este movimiento.'
          this.msg.msgVisible = true
          this.msg.msgAccion  = 'Error en la grabación del Retiro de Mercadería'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Retiro de Mercadería'
          this.msg.msgBody    = '¡La operacion se ha realizado con exito!'
          this.msg.msgVisible = true
          this.msg.msgAccion  = 'retiro de mercaderia ok'
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialogRetiroMerc = false
      })
    },

    guardarNdc() {
      this.dialogRem = false
      if (this.ndcMotivoSel>1) {
        let artTemp = this.articulos
        this.articulos = []
        for ( let i=0; i<= artTemp.length-1; i++) {
          if ( artTemp[i].adevolver != 0 ) {
            artTemp[i].cantidad = artTemp[i].adevolver*-1
            this.articulos.push({
              id: null, articulo_id: artTemp[i].articulo_id, codigo: artTemp[i].codigo, codbar: null, nombre: artTemp[i].nombre,
              deposito_id: artTemp[i].deposito_id, unidad_id: artTemp[i].unidad_id, moneda_id: artTemp[i].moneda_id, iva_id: artTemp[i].iva_id,
              cantidad: Math.abs(artTemp[i].adevolver)*-1, cantidadoriginal: Math.abs(artTemp[i].adevolver)*-1, stock: Math.abs(artTemp[i].adevolver),
              undstock: 1, sinstock: 'C', costo: artTemp[i].costo, precio: artTemp[i].precio, preciooriginal: artTemp[i].precio,
              tasadescuento: artTemp[i].tasadescuento, importedescuento: artTemp[i].importedescuento, tasaproprecargo: 0, total: artTemp[i].total,
              texto: artTemp[i].texto, vencimiento: artTemp[i].vencimiento, adevolver: 0, padre_id: this.itemActual.items[i].articulo.padre_id,
              undenvase: artTemp[i].undenvase, escombo: artTemp[i].escombo, ofeprecio: 0, ofetasdes: 0, ofeenvio: 0,
              ofeunidades: 0, ofeestado: '', turno_id: null, decimales: 2, preciomediocobro: false, loTengo: false,
            })
          }
        }
      }
      this.altaHTTP('ndcfac').then({
      })
    },

    guardarNdd() {
      this.dialognddxDev = false
      if (this.nddMotivoSel<=3) {
        this.altaHTTP('nddfac').then({
        })
      }
    },

    editarMed(item) { //???
    },

    agregarMismoMed(item) {
      this.editedIndexMed = -1
      this.dialogMed = true

      this.calculosMed()
      this.editadoMed = Object.assign({}, this.defaultItemMed)
      this.editadoMed.id                = null
      this.editadoMed.caja_id           = item.caja_id
      this.editadoMed.medio_id          = item.medio_id
      this.editadoMed.cuentaorigen_id   = item.cuentaorigen_id
      this.editadoMed.cuentadestino_id  = item.cuentadestino_id
      this.editadoMed.cuentacheque_id   = item.cuentacheque_id
      this.editadoMed.cuentatarjeta_id  = item.cuentatarjeta_id
      this.editadoMed.banco_id          = item.banco_id
      this.editadoMed.tarjeta_id        = item.tarjeta_id
      this.editadoMed.cpringreso_id     = item.cpringreso_id
      this.editadoMed.cpregreso_id      = item.cpregreso_id
      this.editadoMed.chequera_id       = item.chequera_id
      this.editadoMed.cheque_id         = item.cheque_id
      this.editadoMed.fechafinanciera   = item.fechafinanciera
      this.editadoMed.fechasalida       = item.fechasalida
      this.editadoMed.importe           = item.importe
      this.editadoMed.nrovalor          = Number(item.nrovalor)+1
      this.editadoMed.tipo              = item.tipo
      this.editadoMed.observ            = item.observ
      this.editadoMed.importe           = this.editado.total-this.totValores
      this.editadoMed.cuenta            = item.cuenta
      this.editadoMed.cuit              = item.cuit
      this.editadoMed.nombre            = item.nombre
      this.editadoMed.maletin_id        = item.maletin_id
      this.cueItems = []
      this.medioDePagoNombre = this.medpag[cual-1].nombre
    },

    borrarMed(item) {
      let pos = this.maletinesCli.findIndex(x=>x.id==item.maletinitem_id)
      if (pos!=-1) {
        this.maletinesCli[pos].sel = false
      }
      pos = this.valores.indexOf(item)
      this.medpag[item.medio_id-1].total -= item.importe
      if (item.maletin_id!=null) {
        this.maletinesCli[item.maletin_id].sel = false
      }
      this.valores.splice(pos,1);
      this.calculosMed()
    },

    guardarMed() {
      let txt  = ''
      let xtar = 0
      let xban = -1
      let xcue = 0
      if (this.medioDePagoId==3) {                        // TARJETA
        xtar = this.medios.findIndex(x=>x.id==this.editadoMed.id)
      } else if (this.medioDePagoId==5) {                 // CHEQUE PROPIO
        xcue = this.cueMiasItems.findIndex(x=>x.id == this.editadoMed.cuentadestino_id)
      } else if (this.medioDePagoId==6) {                 // CHEQUE DE TERCERO
        xban = this.banItems.findIndex(x=>x.id == this.editadoMed.banco_id)
      }
      if (this.medioDePagoId==1) {                            // efectivo
        txt = 'Cobro en Efectivo'
      } else if (this.medioDePagoId==3) {                     // tarjeta
        txt = this.medios[xtar].tarjetanombre+' - '
        txt += this.medios[xtar].nombrebanco
      } else if (this.medioDePagoId==4) {                     // cuenta corriente
        txt = 'Cuenta Corriente'
      } else if (this.medioDePagoId==6) {                     // cheque
        txt = this.banItems[xban].nombre+' - '
        txt += 'Cta/' + this.editadoMed.cuenta+' - '
        txt += 'Nro/'+this.editadoMed.nrovalor+'('
        txt += this.editadoMed.echeq?'e) ':'f) - '
        txt += 'Fec/'+moment(this.editadoMed.fechafinanciera).format('DD-MM-YY')
      } else if (this.medioDePagoId==5) {                     // bnaco
        txt = this.cueMiasItems[xcue].nombre+' - '
        txt += 'Cta/' + this.cueMiasItems[xcue].cuenta
      }
      if (this.editedIndexMed == -1) {
        let fecfin = null
        if (this.editadoMed.fechafinanciera!=null) {
          fecfin = moment(this.editadoMed.fechafinanciera).format('DD-MM-YY')
        }

        this.editadoMed.nrovalor=this.editadoMed.nrovalor=='EFECTIVO'?null:Number(this.editadoMed.nrovalor)
        this.valores.push({ 
          caja_id: this.caja,
          medio_id: this.medioDePagoId,
          cuentaorigen_id: this.editadoMed.cuentaorigen_id,
          cuentadestino_id: this.editadoMed.cuentadestino_id,
          cuentacheque_id: null,
          cuentatarjeta_id: this.editadoMed.cuentatarjeta_id,
          banco_id: xban==-1?null:this.banItems[xban].id,
          tarjeta_id: this.editadoMed.tarjeta_id==null ? null : this.editadoMed.tarjeta_id,
          cpregreso_id: null,
          cpringreso_id: null,
          cheque_id: null,
          echeq: this.editadoMed.echeq,
          fechafinanciera: moment(this.editadoMed.fechafinanciera).format('YYYY-MM-DD'),
          fechasalida: null,
          importe: Number(this.editadoMed.importe),
          nrovalor: this.editadoMed.nrovalor,
          tipo: 'I',
          observ: txt,
          medioNombre: this.medioDePagoNombre,
          cuenta: this.editadoMed.cuenta,
          cuit: this.editadoMed.cuit,
          nombre: this.editadoMed.nombre,
          recargo: this.editadoMed.recargo,
          interes: this.editadoMed.interes,
          domicilioFiscal: this.editadoMed.domicilioFiscal,
          vuelto: this.editadoMed.vuelto,
          maletinitem_id: this.editadoMed.maletinitem_id
        })
      }
      let propValor = 0
      let tasaPropValor = 0
      // calculo el total del comprobante sin recargos
      let totalComprobante = this.roundTo(this.totalComprobante(true),2)
      // ahora voy viendo en valores cuanto ingreso de cada uno y si tuvo recargo
      // en tal caso los voy aplicando al total del comprobante y asignando el proporcional en articulos
      for (let i=0; i<=this.valores.length-1; i++) {
        propValor = (this.valores[i].importe * 100) / totalComprobante
        tasaPropValor += propValor * ((this.valores[i].recargo+this.valores[i].interes)/100)
      }
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.articulos[i].tasaproprecargo = tasaPropValor
      }
      totalComprobante = this.roundTo(this.totalComprobante(true),2)
      for (let i=0; i<=this.medpag.length-1; i++) {
        this.medpag[i].total = 0
      }
      // RECORRO TODOS LOS VALORES Y LOS AGREGO EN medpag
      for (let i=0; i<=this.valores.length-1; i++) {
        let pos = this.medpag.findIndex(x=>x.id == this.valores[i].medio_id)
        this.medpag[pos].total += Number(this.valores[i].importe)
      }
      this.calculosMed()
      this.calculos()
      this.dialogMed = false

      // Hay Maletines, marco el .sel
      if (this.hayMaletin()) {
        this.maletinesCli[this.maletinesCliPos].sel = true
      }

    },

    calculosMed() {
      let totPen = 0
      let totVal = 0
      for (let i=0; i<=this.pend.length-1; i++) {
        totPen += Number(this.pend[i].acancelar)
      }
      // SI VIENE DESDE FACTURACION NO TIENE PENDIENTE, TOMO EL TOTAL DEL COMPROBANTE
      if (this.editado.cpr.substring(0,3)!='REC') {
        totPen = this.editado.total
      }
      for (let i=0; i<=this.valores.length-1; i++) {
        totVal += Number(this.valores[i].importe)
      }
      totPen = this.roundTo(totPen,2)
      totVal = this.roundTo(totVal,2)
      this.totValores = this.roundTo(totVal,2)
      this.valDiferencia = this.roundTo((totPen+this.recargo)-totVal,2)
    },

    calculoMedioCobro() {
      if (this.editadoMed.id!=null) {
        let ipos = this.medios.findIndex(x=>x.id == this.editadoMed.id)
        if (ipos!=-1) {
//        this.editadoMed.cuentaorigen_id = this.medios[ipos].cuenta_id
          this.editadoMed.cuentadestino_id = this.medios[ipos].cuenta_id
          if (this.editado.cpr.substring(0,3)=='FAC') {
            this.editadoMed.cuotas = this.medios[ipos].cuotas
            this.editadoMed.interes = this.medios[ipos].interes
            this.editadoMed.recargo = this.medios[ipos].recargo

            // selecciono en el combo de medios. Tengo que ver si tiene intereses o recargos
            // pueden haber otros medios ya cargados con otros recargos o intereses
            // si el medio seleccionado tiene recargo o intereses se calcula el proporcional
            // que representa el monto del medio en el total del comprobante
            // luego se calcula el proporcional de la tasa del medio seleccionado y este valor
            // se guarda en tasaproprecargo en el vector de articulos, para que vaya calculando
            // en base a los nuevos datos.
            
            let totalValor = 0
            let recargoValor = 0
            let propValor = 0
            let tasaPropValor = 0
            let totCprSinRecargos = this.roundTo(this.totalComprobante(false),2)

            // ahora voy viendo en valores cuanto ingreso de cada uno y si tuvo recargo
            // en tal caso los voy aplicando al total del comprobante
            for (let i=0; i<=this.valores.length-1; i++) {
              //valoresIngresados += this.valores[i].importe
              //totCprSinRecargos -= this.valores[i].importe
              totalValor = this.valores[i].importe
              recargoValor = this.roundTo(totalValor * ((this.valores[i].recargo+this.valores[i].interes)/100),2)
              propValor = (totalValor * 100) / totCprSinRecargos
              tasaPropValor += propValor * ((this.valores[i].recargo+this.valores[i].interes)/100)
              // calculo proporcion del importe del valor con respecto al total del comprobante
            }

            // ahora veo el valor actual
            totalValor = this.editadoMed.importe
            recargoValor = this.roundTo(totalValor * ((this.editadoMed.recargo+this.editadoMed.interes)/100),2)
            propValor = (totalValor * 100) / totCprSinRecargos
            tasaPropValor += propValor * ((this.editadoMed.recargo+this.editadoMed.interes)/100)
            this.editadoMed.importe = this.roundTo(totalValor+recargoValor,2)
            // Ahora actualizo el this.articulos con las proporciones de recargos ( si las hay )
            for (let i=0; i<=this.articulos.length-1; i++) {
              this.articulos[i].tasaproprecargo = tasaPropValor
            }
          } else {
            this.editadoMed.recargo = 0
          }
          this.editadoMed.cuotas = this.editadoMed.cuotas == 0?1:this.editadoMed.cuotas
          this.editadoMed.importecuotas = this.roundTo(this.editadoMed.importe/this.editadoMed.cuotas,2)
          this.editadoMed.nombrecuenta = this.medios[ipos].cuenta + ' - ' + this.medios[ipos].nombrebanco
        }
      }
    },

    totalComprobante(conRecargos) { // calculo el total a pagar del comprobante y actualizo todos los edit
      let des = 0, gra = 0,  exe = 0, iva = 0, tas = 0, tot = 0, base = 0, posiva = 0;
      for(let i=0; i<=this.articulos.length-1; i++) {
        if (conRecargos) {
          base = this.roundTo(this.articulos[i].total+(this.articulos[i].total*(this.articulos[i].tasaproprecargo/100)),2)
        } else {
          base = this.roundTo(this.articulos[i].total,2)
        }
        if (this.editado.tasadescuento>0) {
          des = this.roundTo(base*(Number(this.editado.tasadescuento)/100),2)
          base = this.roundTo(base - des,2)
        }
        if (this.articulos[i].iva_id==2) {
          exe = base
        } else {
          gra = base
          tas = 0
          //posiva = this.ivaTasas.map(function(e) { return e.id; }).indexOf(this.articulos[i].iva_id);
          posiva = this.ivaTasas.findIndex(x=>x.id==this.articulos[i].iva_id)
          tas = this.ivaTasas[posiva].tasa
          if (this.articulos[i].iva_id != '') {
            tas = this.ivaTasas[posiva].tasa
          }
          if (this.sucursalDemo) {
            iva = 0
          } else {
            iva = this.roundTo((base*(1+(tas/100)))-base,2)
          }
        }
        tot += exe+gra+iva
      }
      return tot
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
          let tot = this.roundTo(this.articulos[i].cantidad * this.articulos[i].precio,this.articulos[i].decimales||2)
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
            let posiva = this.ivaTasas.findIndex(x=>x.id == this.articulos[i].iva_id)
            //let posiva = this.ivaTasas.map(function(e) { return e.id; }).indexOf(this.articulos[i].iva_id);
            if (posiva!=-1) {
              tas = this.ivaTasas[posiva].tasa
              if (this.articulos[i].iva_id != '') {
                tas = this.ivaTasas[posiva].tasa
              }
              iva = this.sucursalDemo?0:base*(tas/100)
            }
          }
          if (this.editado.cpr.substring(0,3)!='REM') {
            this.rentabilidad += 
              this.roundTo((((this.articulos[i].precio-this.articulos[i].costo)*this.articulos[i].cantidad)-this.articulos[i].importedescuento),2)
          }
          this.editado.importedescuento += (des+desit)
          this.editado.gravado += gra
          this.editado.exento += exe
          this.editado.iva += iva
          this.editado.total += exe+gra+iva
        }
        if (this.editado.cpr.substring(0,3)!='REM') {
          this.rentabilidad -= this.editado.importedescuento
          this.rentabilidad = this.roundTo(this.rentabilidad,2)
        }
        this.editado.importedescuento = this.roundTo(this.editado.importedescuento,2)
        this.editado.gravado = this.roundTo(this.editado.gravado,2)
        this.editado.exento = this.roundTo(this.editado.exento,2)
        this.editado.iva = this.roundTo(this.editado.iva,2)
        this.editado.total = this.roundTo(this.editado.total,2)
      }
      if (this.ctacte && this.disponible>0) {
        this.valores = this.valores.filter(function(valor) { return valor.medio_id != 4 })
        if (this.disponible>this.editado.total) {
          this.medpag[3].total = (this.editado.total-(this.medpag[0].total+val))
          this.cargoValorInicialEnValores(null, this.medpag[3].total, 4)
        } else {
          this.medpag[3].total = this.disponible
          this.cargoValorInicialEnValores(null, this.disponible, 4)
        }
      } else {
        if (this.medpag[0].activo) {
          this.medpag[0].total = (this.editado.total-(this.medpag[3].total+val))  
        }
      }
    },

    propiodelcliente() {
      this.editadoMed.cuit = this.editado.documentoNumero
      this.editadoMed.nombre = this.editado.nombre
      this.buscoCuentasDelCuit()
    },

    buscoCuentasDelCuit () {
      this.elCuitEstaba = false
      return HTTP().get('/tercerocuitcuentas/'+this.editadoMed.cuit ).then(({ data }) => {
        this.cueItems = []
        if (data=='') {
          this.mensaje('¡Este CUIT no existe en AFIP!', this.temas.forms_titulo_bg, 1500)
          this.$nextTick(() => {
            const f = this.$refs.cuit;
            f.focus();
          });
          return
        } else if (data.errorConstancia) {
          this.mensaje('ERROR EN CUIT: '+data.errorConstancia.error[0], this.temas.snack_error_bg, 3500)
          this.$nextTick(() => {
            const f = this.$refs.cuit;
            f.focus();
          });
        } else if (data.datosGenerales) {
          this.elCuitEstaba = false
          this.editadoMed.nombre = data.datosGenerales.razonSocial!=undefined?data.datosGenerales.razonSocial:data.datosGenerales.apellido+' '+data.datosGenerales.nombre
          if (data.datosGenerales.domicilioFiscal!=undefined) {
            this.editadoMed.domicilioFiscal.push(data.datosGenerales.domicilioFiscal)
          } else {
            this.editadoMed.domicilioFiscal = []
          }
        } else if (data.length>0) {
          this.elCuitEstaba = true
          this.editadoMed.nombre = data[0].nombre
          for (let i=0; i<= data[0].cuentas.length-1; i++) {
            this.cueItems.push(data[0].cuentas[i].cuenta)
          }
          for (let i=0; i<=this.cueNewItems.length-1; i++) {
            this.cueItems.push(this.cueNewItems[i])
          }
          if (this.cueItems.length) {
            this.editadoMed.cuenta = this.cueItems[0]
          }
          this.buscoCuentaBanco()
        }
      })
    },

    buscoCuentaBanco() {
      this.laCuentaEstaba = false
      return HTTP().post('/buscocuentabanco', {cuenta: this.editadoMed.cuenta} ).then(({ data }) => {
        if (data.length>0) {
          if (data[0].tercero.cuit!=this.editadoMed.cuit) {
            this.mensaje('¡Esta cuenta corresponde a otro CUIT!', this.temas.snack_error_bg, 1500) 
            this.$nextTick(() => {
              const f = this.$refs.cuenta;
              f.focus();
            });
            return
          }
          this.editadoMed.cuentaorigen_id = data[0].id
          this.editadoMed.banco_id = data[0].banco.id
          this.editadoMed.echeq = false
          this.laCuentaEstaba = true
        } else {
          let pos = this.cueNewItems.findIndex(x=>x.cuenta==this.editadoMed.cuenta)
          if (pos==-1) {
            this.editadoMed.cuentaorigen_id = null
          } else {
            this.editadoMed.banco_id = data[0].banco.id
          }
        }
      })
    },

    buscoCheque() {
      let pos = -1
      for (let i=0; i<=this.valores.length-1; i++) {
        if (this.valores[i].cuentaorigen_id == this.editadoMed.cuentaorigen_id && this.valores[i].nrovalor==this.editadoMed.nrovalor) {
          pos = i
          break
        }
      }
      if (pos !=-1) {
        this.mensaje('¡Este numero de cheque ya existe para esta cuenta!', this.temas.snack_error_bg, 1500)
        this.$nextTick(() => {
          const f = this.$refs.numerodecheque;
          f.focus();
        });
        return
      }
      return HTTP().get('/buscocheque/'+this.editadoMed.cuentaorigen_id+'/'+this.editadoMed.nrovalor ).then(({data})=>{
        if (data.length>0) {
          this.mensaje('¡Este numero de cheque ya existe para esta cuenta!', this.temas.snack_error_bg, 1500)
          this.$nextTick(() => {
            const f = this.$refs.numerodecheque;
            f.focus();
          });
          return
        }
      })
    },

    seleccionoBanco() {
      for (let i=0; i<=this.cueNewItems.length-1; i++) {
        if (this.editadoMed.cuenta==this.cueNewItems[i].cuenta) {
          this.cueNewItems[i].banco_id=this.editadoMed.banco_id
        }
      }
    },

    calculosNdc(cual) {
      if (cual==1) {  //CAMBIO EL %
        this.ndcTotal = this.roundTo(this.editado.total * (this.ndcTasaDescuento/100),2)
      } else {
        this.ndcTasaDescuento = this.roundTo(((this.ndcTotal * 100) / this.editado.total),2)
      }
    },

    calculosNdd(cual) {
      if (cual==1) {          //CAMBIO EL %
        this.nddTotal = this.roundTo(this.editado.total * (this.nddTasaDescuento/100),2)
      } else if (cual==2) {   //CAMBIO EL TOTAL, CALCULO EL %
        this.nddTasaDescuento = this.roundTo(((this.nddTotal/this.editado.total)*100),2)
      }
    },

    selMotivoNdc() {
      this.dialogNdcxDev = false
      if (this.ndcMotivoSel==1) {
        this.ndcTotal = 0
        this.ndcTasaDescuento = 0
        return 
      }
      // Si ya realizo devolucion o anulacion, debo buscar en el/los NDC vinculadas para descontar
      // las cantidades ya devueltas.
      let aRestar = []
      this.articulos = []
      let ndcImputadas = 0
      this.ndcTotal = 0
      return HTTP().get('/buscondcvinculadas/'+this.itemActual.id ).then(({ data }) => {
        if (data.length>0) {
          for (let i=0; i<=data.length-1; i++) {
            aRestar.push({
              articulo_id: data[i].articulo_id,
              cantidad: data[i].cantidad,
              total: data[i].total
            })
            ndcImputadas += data[i].total
          }
        }
        for (let i=0; i<=this.itemActual.items.length-1; i++) {
          for (let j=0; j<=aRestar.length-1; j++) {
            if (aRestar[j].articulo_id == this.itemActual.items[i].articulo_id) {
              this.itemActual.items[i].cantidad -= Math.abs(aRestar[j].cantidad)
            }
          }
          if (this.itemActual.items[i].cantidad != 0) {
            this.articulos.push({
              id: this.itemActual.items[i].id, articulo_id: this.itemActual.items[i].articulo_id, codigo: this.itemActual.items[i].articulo.codigo,
              codbar: this.itemActual.items[i].articulo.codbar, nombre: this.itemActual.items[i].articulo.nombre,
              deposito_id: this.itemActual.items[i].deposito_id, unidad_id: this.itemActual.items[i].unidad_id,
              moneda_id: this.itemActual.items[i].moneda_id, iva_id: this.itemActual.items[i].iva_id, cantidad: Number(this.itemActual.items[i].cantidad),
              cantidadoriginal: Number(this.itemActual.items[i].cantidad), stock: this.itemActual.items[i].stock,
              undstock: this.itemActual.items[i].articulo.undstock, sinstock: this.itemActual.items[i].sinstock,
              costo: this.itemActual.items[i].costo, precio: this.itemActual.items[i].precio, preciooriginal: this.itemActual.items[i].preciooriginal,
              tasadescuento: this.itemActual.items[i].tasadescuento, importedescuento: this.itemActual.items[i].importedescuento, tasaproprecargo: 0,
              total: this.itemActual.items[i].total, texto: '', vencimiento: '', adevolver: 0, padre_id: this.itemActual.items[i].articulo.padre_id,
              undenvase: this.itemActual.items[i].articulo.undenvase, escombo: false, ofeprecio: 0, ofetasdes: 0, ofeenvio: 0,
              ofeunidades: 0, ofeestado: '', turno_id: null, decimales: this.itemActual.items[i].articulo.precios[0].decimales,
              preciomediocobro: false, loTengo: false,
            })
          }
        }
        this.ndcTotal = this.roundTo(this.itemActual.total - Math.abs(this.roundTo(ndcImputadas,2)),2)
        if (this.ndcTotal === 0) {
          // MOSTRAR MENSAJE Y NO INGRESAR
        }
        if (this.ndcMotivoSel==2) {
          this.dialogNdcxDev = true
        }
      })
    },

    selMotivoNdd() {
      this.dialogNddxDev = false
      if (this.itemActual.cpr.substring(0,3)=='FAC') {
      } else if (this.itemActual.cpr.substring(0,3)=='FAC') {
      }
      if (this.nddMotivoSel==1) {
        this.nddTotal = 0
        this.nddTasaDescuento = 0
        return 
      }
    },

    ////////////////////////
    // METODOS DE RECIBOS //
    ////////////////////////
    cobrar(item) {
      let puedeCobrar = true
      if (item.tercero.user) {
        if (item.tercero.user.tipo=='PP'&&item.tercero.user.userexclusivo_id==this.userId&&item.tercero.user.usaelsistema==0) {
          if (item.pendientes[0].pendiente!=0) {
            return true
          } else {
            return false
          }
        } else {
          let user = item.tercero.user.id
          for (let i=0; i<=this.vinculosHijos.length-1; i++) {
            if (user == this.vinculosHijos[i]) {
              puedeCobrar = false
              break
            }
          }
        }
      }
      if (!item.pendientes[0] || !puedeCobrar || (this.userId==1 && item.user.tipo!='PP')) return false
      if (item.pendientes[0].pendiente>0) {
        return true
      } else {
        return false
      }
    },

    tieneRemito(item) {
      if (item.cpr==undefined) {return false}
      if (item.cpr.substring(0,3)=='REM') { return false }
      if (item.observaciones!=null) {
        return item.observaciones.indexOf('REMITO')==-1 ? false : true
      } else {
        return false
      }
    },

    //////////////////////
    // METODOS DE ITEMS //
    //////////////////////
    selArtClick (item) {
      this.seleccionarArticulo = false;
      this.editedIndexArt = this.articulos.indexOf(item)
      this.busArt = this.codigooid=='C'?item.codigo:item.articulo_id.toString()
      this.buscarArt(true)
      this.$nextTick(() => {
        const f = this.$refs.cantidad;
        f.focus();
      });
    },

    tasaDescuentoGlobal() {
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.precio)
      let tde = Number(this.editado.tasadescuento)
      let ide = this.roundTo((ctt*pre),2)*(tde/100)
      this.editadoArt.importedescuento = ide
      this.editadoArt.total = this.roundTo(((ctt*pre)-ide),2)
      return this.editadoArt.total
    },

    chequearArtPed(item) {
      return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
        item = data.c;
        this.itemActual = data.c; // para luego laburar con el cuando seleccione articulos en pedidos
        this.artPed = []
        this.pedProcesable = true
        // Cargo en artPed cada unos de los items que me piden
        for (let i=0; i<=item.items.length-1; i++) {
          let pos = this.artPed.findIndex(x=>x.articulo_id==item.items[i].articulo_id)
          this.artPed.push({
            id: item.items[i].id,
            articulo_id: item.items[i].articulo.id,
            codigo: item.items[i].articulo.codigo,
            nombre: item.items[i].articulo.nombre,
            cttori: item.items[i].cantidadoriginal,
            cttped: item.items[i].cantidad,
            stock: 0,
            cttfac: 0,
            nuevostock: 0,
            estado: 'K',
            descuento: item.items[i].tasadescuento,
            sinstock: item.items[i].articulo.precios[0].sinstock,
            repetido: [],
          })
          if (pos!=-1) {
            this.artPed[pos].repetido.push({
              id: this.artPed[pos].id,
              cttped: this.artPed[pos].cttped,
              descuento: this.artPed[pos].descuento,
            })
            this.artPed[i].repetido.push({
              id: item.items[i].id,
              cttped: item.items[i].cantidad,
              descuento: item.items[i].tasadescuento,
            })
          }
        }
        // Veo los stocks, no se como hacer con el tema sucursales, puede ser general o por cada una
        // Por ahi lo que conviene hacer es mostrar los stocks solo de los depositos de la sucursal
        // actual y trabajar con ellos, que el pedido salga igual si no hay
        // Si maneja demo y tiene stock ahi que luego hagan transferencias y listo.
        let art = []
        let iDep = this.depItems[0].id
        for (let i=0; i<=this.artPed.length-1; i++) {
          art.push(this.artPed[i].articulo_id)
        }
        return HTTP().post('/stock2', { arts: art, dep: iDep }).then(({data}) => {
          let sArts = this.artPed.map(el => el.articulo_id)
          let pos = 0
          for (let i=0; i<=this.artPed.length-1; i++) {
            let ctt = 0
            let dif = 0
            pos = data.findIndex(x=>x.articulo_id==this.artPed[i].articulo_id)
            // si el art esta repetido es por % de bonificaciones distintos
            // sumo las cantidades para controlar el stock
            if (this.artPed[i].repetido.length>0) {
              ctt = this.artPed.reduce((s, v) => (v.articulo_id==this.artPed[i].articulo_id ? s + v.cttped : s), 0);
              dif = data[pos].stock-ctt
            } else {
              ctt = this.artPed[i].cttped
            }
            if (pos!=-1) {
              this.artPed[i].stock = data[pos].stock
              if (this.artPed[i].stock >= ctt) {
                if (this.artPed[i].repetido.length>0) {
                  this.artPed[i].cttfac = this.artPed[i].cttped
                } else {
                  this.artPed[i].cttfac = ctt
                }
                this.artPed[i].estado = 'T'
              } else if (this.artPed[i].stock<ctt&&this.artPed[i].stock>0&&this.artPed[i].sinstock=='B') {
                // tengo que ver si hay repetidos, descontar unidades al menor % de bonificacion
                let p = i
                if (this.artPed[i].repetido.length>0) {
                  for (let j=0; j<=this.artPed.length-1; j++) {
                    if (this.artPed[i].articulo_id==this.artPed[j].articulo_id ) {
                      if (this.artPed[i].repetido[0].descuento <= this.artPed[j].repetido[0].descuento) {
                        p = i
                      } else {
                        p = j
                      }
                    }
                  }
                  if (Math.abs(dif) > this.artPed[p].cttped) {
                    this.artPed[p].cttped = 0
                    this.artPed[p].cttfac = 0
                    this.artPed[p].estado = 'P'
                    this.pedProcesable = this.artPed[p].sinstock=='B'?false:true
                  } else {
                    this.artPed[p].cttped -= Math.abs(dif)
                    this.artPed[p].cttfac = this.artPed[p].cttped
                    this.artPed[p].estado = 'P'
                  }
                } else {
                  this.artPed[i].cttped = this.artPed[i].stock
                  this.artPed[i].cttfac = this.artPed[i].stock
                  this.artPed[i].estado = 'P'
                }
              } else {
                this.artPed[i].cttped = 0
                this.artPed[i].cttfac = 0
                this.artPed[i].estado = 'N'
              }
              this.artPed[i].nuevostock = this.artPed[i].stock - this.artPed[i].cttfac
            } else {
              if (this.artPed[i].sinstock=='B') {
                this.pedProcesable = false
              }
              this.artPed[i].stock = 0
              this.artPed[i].cttped = 0
              this.artPed[i].estado = 'N'
            }
          }
          this.dialogPed = true;
        })
      })
    },

    chequearTransfPed(item, desdeDonde) {
      this.desdeAdmPedidos = false
      let id = 0
      if (desdeDonde==1) {
        id = item.id
      } else {
        id = item.cprsA.pedido.id
        this.desdeAdmPedidos = true
        this.activoSucursal('setFiscal')
      }

      /* desdeDonde: 1=panel de principal, 2=administracion de pedidos*/
      return HTTP().post('/comprobante', { id: id }).then(({ data }) => {
        this.itemActual = data.c
        this.artTransfPed = []
        // Cargo en artPed cada unos de los items que me piden
        for (let i=0; i<=this.itemActual.items.length-1; i++) {
          this.artTransfPed.push({
            id: this.itemActual.items[i].id,
            articulo_id: this.itemActual.items[i].articulo.id,
            codigo: this.itemActual.items[i].articulo.codigo,
            nombre: this.itemActual.items[i].articulo.nombre,
            precio: this.itemActual.items[i].precio,
            cttori: this.itemActual.items[i].cantidadoriginal,
            tasadescuento: this.itemActual.items[i].tasadescuento,
            cttfac: 0,
            ctttransf: 0,
            estado: 'K',
          })
        }

        return HTTP().get('/buscocomprobantesvinculados/'+id ).then(({ data }) => {
          if (data.length>0) {
            for (let i=0; i<=data.length-1; i++) {
              for (let j=0; j<=this.artTransfPed.length-1; j++) {
                if (data[i].articulo_id===this.artTransfPed[j].articulo_id) {
                  this.artTransfPed[j].cttfac+=data[i].cantidad
                }
              }
            }
            for (let j=0; j<=this.artTransfPed.length-1; j++) {
              if (this.artTransfPed[j].cttori == this.artTransfPed[j].cttfac) {
                this.artTransfPed.splice(j, 1)
                break
              } else {
                this.artTransfPed[j].ctttransf = this.artTransfPed[j].cttori-this.artTransfPed[j].cttfac
              }
            }
          }
          this.artTransfPedSucDes = []
          for (let i=0; i<=this.sucursales.length-1; i++) {
            if (this.sucursal != this.sucursales[i].id) {
              this.artTransfPedSucDes.push(this.sucursales[i])
            }
          }
          this.artTransfPedId = this.artTransfPedSucDes[0].id
          this.dialogTransferirPedido = true

          if (this.artTransfPorcentaje!=0) {
            this.aplicarPorcentajeATransferir()
          }

        })
      })
    },

    nuevoArt(texto) {
      this.esTexto = false
      this.busArt = this.busArtSave!='' ? this.busArtSave : ''
      this.editedIndexArt = -1;
      this.dialogArtNot = false;
      this.uniItems = [];
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      if (texto) {
        this.editadoArt.iva_id = 5
        this.editadoArt.moneda_id = 51
      }
      this.seleccionarArticulo = false;
    },

    nuevoArtNot() {
      this.esTexto = false
      this.formTitle = 'ANOTADOR DE VENTAS'
      this.dialogNot = true
      this.dialog = false
      this.busArt = ''
      this.editedIndexArt = -1;
      this.dialogArtNot = true;
      this.uniItems = [];
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.seleccionarArticulo = false;
      this.listarAnotaciones()
    },

    editarArt(item) {
      if (this.facRet!=0||this.clickEnBoton) return
      this.formTitleArt = 'Editar Item'
      this.seleccionarArticulo = false;
      this.editedIndexArt = this.articulos.indexOf(item)
      this.editadoArt = this.articulos[this.editedIndexArt]
      this.busArt = this.codigooid=='C'?this.articulos[this.editedIndexArt].codigo:this.articulos[this.editedIndexArt].articulo_id
      this.articulos = this.articulos.filter( x => x.codigo != this.articulos[this.editedIndexArt].codigo)
      this.$nextTick(() => {
        const f = this.$refs.cantidad;
        f.focus();
      });
    },

    sumarRestar(item, cuanto, api, array) {
      this.clickEnBoton = true
      let k = 0
      if (array=='ajustar') {
        k = this.articulos.indexOf(item)
        if (item.cttped>item.stock) {
          item.cttped = item.stock
        }
      } else if (array=='articulos') {
        k = this.articulos.indexOf(item)
        this.editedIndexArt = k
        if (cuanto==-1 && this.articulos[k].cantidad==0) {
          return
        }
      } else if (array=='pedidos') {
        k = this.artPed.indexOf(item)
        if (cuanto==-1 && this.artPed[k].cttped==0) {
          return
        }
      } else if (array=='transfPed') {
        k = this.artTransfPed.indexOf(item)
        if (cuanto==-1 && this.artTransfPed[k].ctttransf==0) {
          return
        }
      }
      if (api) {
        return HTTP().post('/sumarrestaranotador', {cprid: this.anotadorId,artid: this.articulos[k].articulo_id,cant: cuanto}).then(({ data }) => {
          this.articulos[k].cantidad += cuanto
          this.articulos[k].total = this.articulos[k].precio*this.articulos[k].cantidad
          this.anotadorTotal = 0
          this.rentabilidad = 0
          for (let i=0; i<=this.articulos.length-1; i++) {
            this.anotadorTotal += this.articulos[i].total
            this.rentabilidad += (this.articulos[i].precio-this.articulos[i].costo)*this.articulos[i].cantidad
          }
          this.anotadorTotal = this.roundTo(this.anotadorTotal,2)
          this.rentabilidad = this.roundTo(this.rentabilidad,2)
        })
      } else {
        if (array=='pedidos') {
          this.artPed[k].cttped += cuanto
          if (this.artPed[k].sinstock=='B') {
            if (this.artPed[k].stock < this.artPed[k].cttped) {
              this.artPed[k].cttped -= cuanto
              this.artPed[k].cttfac = this.artPed[k].cttped
              this.artPed[k].estado = 'N'
            }
          } else {
            this.artPed[k].cttfac = this.artPed[k].cttped
            this.artPed[k].estado = 'T'
          }
        } else if (array=='transfPed') {
          if (cuanto==1) {
            if (this.artTransfPed[k].cttori>(this.artTransfPed[k].cttfac)+this.artTransfPed[k].ctttransf) {
              this.artTransfPed[k].ctttransf += cuanto
              this.artTransfPedCtt ++
            }
          } else {
            if (this.artTransfPed[k].ctttransf>0) {
              this.artTransfPed[k].ctttransf += cuanto
              this.artTransfPedCtt --
            }
          }
        }
      }
    },

    editarTransferirAOtraSucursal(item) {
      this.itemActualTransfItem = item
      this.editadoTransfItem.cttOriginal = Number(item.cttori)
      this.editadoTransfItem.cttATransferir = item.ctttransf == 0 ? Number(item.cttori) : Number(item.ctttransf)
      this.dialogTransferirItem = true
    },

    cancelarTransferirItem() {
      this.dialogTransferirItem = false
    },

    guardarTransferirItem(item) {
      this.itemActualTransfItem.ctttransf = Number(this.editadoTransfItem.cttATransferir)
      this.artTransfPedCtt += this.editadoTransfItem.cttATransferir
      this.dialogTransferirItem = false
    },

    sumarRestarNdcDev(item, cuanto) {
      debugger
      this.editedIndexNot = this.articulos.indexOf(item)
      if ((cuanto==-1 && this.articulos[this.editedIndexNot].adevolver==0) ||
       (cuanto==1 && this.articulos[this.editedIndexNot].adevolver>=this.articulos[this.editedIndexNot].cantidad)) 
       { return }
      if (cuanto==999999) {
        this.articulos[this.editedIndexNot].adevolver = this.articulos[this.editedIndexNot].cantidad
      } else {
        this.articulos[this.editedIndexNot].adevolver += cuanto
      }
      this.ndcTotal = 0
      let tasa = 0
      let total = 0
      let posiva = 0
      for (let i=0; i<=this.articulos.length-1; i++) {
        posiva = this.ivaTasas.findIndex(x=>x.id == this.articulos[i].iva_id);
        //posiva = this.ivaTasas.map(function(e) { return e.id; }).indexOf(this.articulos[i].iva_id);
        tasa   = this.ivaTasas[posiva].tasa
        total  = this.articulos[i].precio*(1+(tasa/100))
        this.ndcTotal += this.articulos[i].adevolver*total
      }
      this.ndcTotal = this.roundTo(this.ndcTotal,2)
    },

    buscarArt(estricto) {

      if (this.busArt=='') {
        return
      }

      if (this.busArt=='1'||this.busArt.toUpperCase()=='TEXTO'||this.busArt=='1@1') {
        this.editadoArt.codigo = 'TEXTO'
        this.esTexto = true
        this.$nextTick(() => {
          const f = this.$refs.txt;
          f.focus();
        });
        return
      }

      this.precioOrigen = 'Lista'
      this.precioDescuento = 0
      this.cttMinima = 0

      estricto = this.busArt.indexOf('@')!=-1 ? true : false

      // si es PED es porque es el usuario es un Vendedor, y vinculosPadres viene cargado solo con la empresa del mismo.
      let data1 = null
      return HTTP().post('/articuloz', {
        search: this.busArt,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: this.$store.state.soloArtComprados, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: 300 }).then(({ data })=>{
        data1 = data
        if (data1.length===0) {
          this.mensaje('¡Codigo inexistente!', this.temas.snack_error_bg, 1500)
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
        for (let i=0; i<=data1.length-1; i++) {
          if (data1[i].precios.length>1) {
            ctt = 0; tot = 0; cpp = 0
            for (let j=0; j<=data1[i].precios.length-1; j++) {
              ctt += data1[i].precios[j].cantidad
              tot += data1[i].precios[j].total
            }
            cpp = this.roundTo(tot/ctt,4)
            // BUSCO EL PRECIO MAYOR
            let precioMayor = data1[i].precios.sort((a,b) =>{
              return Number.parseInt(b.precio) - Number.parseInt(a.precio)
            })
            data1[i].precios = []
            data1[i].precios.push(precioMayor[0])
            data1[i].precios[0].costo = cpp
          }
        }

        // INICIALIZO VALORES DE DESCUENTOS Y PRIMERA ASIGNACION. LUEGO CONTROLO X CANTIDAD
        let descual = 'Lista'
        this.precioOrigen = 'Lista'
        this.cttMinima = 1

        if (data1[0].precios[0].ofeestado=='A') {
          data1[0].ofeprecio = data1[0].precios[0].precio-(data1[0].precios[0].precio*(data1[0].precios[0].ofetasadescuento/100))
          data1[0].ofetasdes = data1[0].precios[0].ofetasadescuento
          data1[0].ofeenvio = 0
          data1[0].ofeunidades = data1[0].precios[0].ofeunidades
          data1[0].ofeestado = data1[0].precios[0].ofeestado
        }
        this.promoDescuento = data1[0].ofetasdes ? data1[0].ofetasdes : 0

        // QUE DESUENTO TOMO?, puede ser el de la promo
        if (data1[0].ofeprecio && data1[0].ofeestado=='A' && data1[0].ofeunidades!=0) {
          descual = 'Promocion'
        }

        // CARGO EL DESCUENTO EN pordes
        let pordes = 0
        if (descual=='Promocion') {
          pordes = this.promoDescuento
        }

        if (data1.length==1) {
          let impdes = this.roundTo((data1[0].precios[0].precio*this.editadoArt.cantidad)*(pordes/100),data1[0].precios[0].decimales)

          this.articulos = this.articulos.filter( x => x.codigo != data1[0].codigo)
          this.editadoArt.codigo           = data1[0].codigo;
          this.editadoArt.articulo_id      = data1[0].id;
          this.editadoArt.nombre           = data1[0].nombre;
          this.editadoArt.codbar           = data1[0].precios[0].codbar;
          this.editadoArt.unidad_id        = data1[0].unidad_id
          this.editadoArt.moneda_id        = data1[0].moneda_id
          this.editadoArt.iva_id           = data1[0].iva_id

          this.editadoArt.costoanterior    = this.roundTo(data1[0].precios[0].costo,data1[0].precios[0].decimales)
          this.editadoArt.costo            = this.roundTo(data1[0].precios[0].costo,data1[0].precios[0].decimales)
          this.editadoArt.precio           = this.roundTo(data1[0].precios[0].precio,data1[0].precios[0].decimales)
          this.editadoArt.preciooriginal   = this.roundTo(data1[0].precios[0].precio,data1[0].precios[0].decimales)

          this.editadoArt.decimales        = data1[0].precios[0].decimales
          this.editadoArt.tasadescuento    = pordes
          this.editadoArt.importedescuento = impdes
          this.editadoArt.total            = this.roundTo((this.editadoArt.precio*this.editadoArt.cantidad)-impdes,data1[0].precios[0].decimales)
          this.editadoArt.deposito_id      = this.depItems[0].id
          this.editadoArt.padre_id         = data1[0].padre_id
          this.editadoArt.stock            = data1[0].stock
          this.editadoArt.undstock         = data1[0].undstock //data1[0].undenvasepad?data1[0].undenvase/data1[0].undenvasepad:data1[0].undenvase
          this.editadoArt.sinstock         = data1[0].precios[0].sinstock
          this.editadoArt.texto            = descual
          this.editadoArt.ofeprecio        = 0
          this.editadoArt.ofetasdes        = 0
          this.editadoArt.ofeenvio         = 0
          this.editadoArt.ofeunidades      = 0
          this.editadoArt.ofeestado        = ''
          this.editadoArt.preciomediocobro = data1[0].preciomediocobro
          this.editadoArt.escombo          = data1[0].escombo
          this.editadoArt.loTengo          = data1[0].loTengo

          this.$nextTick(() => {
            const f = this.$refs.cantidad;
            f.focus();
          });
          this.seleccionarArticulo = false

          // busco si aplica promocion para el articulo ingresado
          if (descual=='Promocion') {
            this.editadoArt.ofeprecio        = data1[0].ofeprecio
            this.editadoArt.ofetasdes        = data1[0].ofetasdes
            this.editadoArt.ofeenvio         = data1[0].ofeenvio
            this.editadoArt.ofeunidades      = data1[0].ofeunidades
            this.editadoArt.ofeestado        = data1[0].ofeestado
            this.editadoArt.importedescuento = this.roundTo(data1[0].precios[0].costo-data1[0].ofeprecio,2)
            this.editadoArt.tasadescuento    = data1[0].ofetasdes
            this.editadoArt.costo            = data1[0].ofeprecio
            this.editadoArt.total            = data1[0].ofeprecio
          }

        } else if (data1.length>1) {

          this.selArt = []
          for (let i=0; i<=data1.length-1; i++) {
            this.selArt.push({
              id:                data1[i].id,
              codigo:            data1[i].codigo,
              articulo_id:       data1[i].id,
              nombre:            data1[i].nombre,
              codbar:            data1[i].precios[0].codbar,
              unidad_id:         data1[i].unidad_id,
              moneda_id:         data1[i].moneda_id,
              iva_id:            data1[i].iva_id,
              costo:             data1[i].precios[0].costo,
              precio:            data1[i].precios[0].precio,
              tasadesuento:      0,
              importedescuento:  0,
              deposito_id:       this.depItems[0].id,
              stock:             data1[i].stock == null ? 0 : data1[i].stock,
              undstock:          data1[i].undstock,
              sinstock:          data1[i].sinstock,
            })
          }
          this.seleccionarArticulo = true;
        }
      })
    },

    cantidadItem() {
      // INICIALIZO VALORES
      let descual = 'Lista'
      this.precioOrigen = 'Lista'
      this.cttMinima = 1
      this.promoDescuento = this.editadoArt.ofetasdes
      let pordes = 0

      // QUE DESUENTO TOMO?, veo si tomo el descuento de la promo
      if (this.editadoArt.ofeprecio && this.editadoArt.ofeestado=='A' && this.editadoArt.ofeunidades!=0 &&
          this.editadoArt.ofeunidades>this.editadoArt.cantidad) {
        // CARGO EL DESCUENTO EN pordes
        descual = 'Promocion'
        pordes = this.promoDescuento
      }

      if (!this.esTexto) {
        this.editadoArt.texto = descual
      }
      this.editadoArt.tasadescuento = pordes
      this.editadoArt.importedescuento = (Number(this.editadoArt.cantidad)*(this.roundTo((Number(this.editadoArt.precio)*(this.editadoArt.tasadescuento/100)),2)))
      this.editadoArt.total = this.roundTo(((Number(this.editadoArt.cantidad)*Number(this.editadoArt.precio)))-this.editadoArt.importedescuento,2)
      if (this.$store.state.soloArtComprados==true&&(this.editadoArt.cantidad>this.editadoArt.stock)) {
        if (this.editadoArt.sinstock=='B') {          // avisar y bloquear
          this.mensaje('Atención: Stock insuficiente, no podrá cerrar el comprobante!', this.temas.snack_error_bg, 3000)
        } else if (this.editadoArt.sinstock=='C') {   // avisar y continuar
          this.mensaje('Atención: Stock insuficiente', this.temas.snack_error_bg, 3000)
        }
      }
      return this.editadoArt.total
    },

    tasaDescuento() {
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.precio)
      let tde = Number(this.editadoArt.tasadescuento)
      let ide = this.roundTo((ctt*pre),2)*(tde/100)
      this.editadoArt.importedescuento = ide
      this.editadoArt.total = this.roundTo(((ctt*pre)-ide),2)
      return this.editadoArt.total
    },

    guardarItem(columna) {

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
      this.cttMinima = 1
      this.promoDescuento = this.editadoArt.ofetasdes
      let pordes = this.editadoArt.tasadescuento

      // QUE DESUENTO TOMO?, puede ser el de la regla o el de la promo, el que sea mayor
      if (this.editadoArt.ofeprecio && this.editadoArt.ofeestado=='A' && this.editadoArt.ofeunidades!=0) {
        descual = 'Promocion'
        pordes = this.promoDescuento
      }

      if (!this.esTexto) {
        this.editadoArt.texto = descual
      }
      this.editadoArt.tasadescuento = pordes

      // si el descuento viene distinto de cero es porque tomo una regla
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.precio)
      let txt = this.editadoArt.texto

      // OJO, SI ES PEDIDO HAGO CONTROL DE PROMOCIONES, SI ES FACTURA CARGO NORMAL.
      if (txt=='Promocion') {
        if (ctt > this.editadoArt.pubunidades) {
          this.actualizoItem(this.editadoArt.pubunidades, pre, false)
          this.editadoArt.texto = 'Lista'
          this.editadoArt.tasadescuento = 0
          this.actualizoItem(ctt-this.editadoArt.pubunidades, pre, false)
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
      let txt = !actualizo ? this.editadoArt.texto : this.articulos[this.editedIndexArt].texto
      let pordes = 0
      let impdes = 0
      if (txt=='Promocion') {
        pordes = this.promoDescuento
      } else if (txt=='Lista') {
        pordes = this.editadoArt.tasadescuento
      }
      impdes = this.roundTo(((Number(ctt)*pre) * (pordes/100)),2)

      if (!actualizo) {
        this.articulos.unshift({
          id: 'nuevo'+this.articulos.length+1,
          articulo_id: this.editadoArt.articulo_id,
          codigo: this.editadoArt.codigo,
          codbar: this.editadoArt.codbar,
          nombre: this.editadoArt.codigo=='TEXTO' ? this.editadoArt.texto : this.editadoArt.nombre,
          deposito_id: this.editadoArt.deposito_id,
          unidad_id: this.editadoArt.unidad_id,
          moneda_id: this.editadoArt.moneda_id,
          iva_id: this.editadoArt.iva_id,
          cantidad: Number(ctt),
          cantidadoriginal: Number(ctt),
          stock: Number(ctt*(this.coef*-1)),
          undstock: this.editadoArt.undstock,
          sinstock: this.editadoArt.sinstock,
          costo: this.editadoArt.costo, precio: pre,
          preciooriginal: this.editadoArt.preciooriginal,
          tasadescuento: pordes,
          importedescuento: impdes,
          tasaproprecargo: 0,
          total: (Number(ctt)*pre)-impdes,
          texto: this.editadoArt.texto,
          vencimiento: '',
          adevolver: 0,
          padre_id: this.editadoArt.padre_id,
          undenvase: null,
          escombo: this.editadoArt.escombo,
          ofeprecio: this.editadoArt.ofeprecio,
          ofetasdes: this.editadoArt.ofetasdes,
          ofeenvio: this.editadoArt.ofeenvio,
          ofeunidades: this.editadoArt.ofeunidades,
          ofeestado: this.editadoArt.ofeestado,
          turno_id:  null,
          decimales: this.editadoArt.decimales,
          preciomediocobro: this.editadoArt.preciomediocobro,
          loTengo: this.editadoArt.loTengo,
        })
      } else {
        this.articulos[this.editedIndexArt].cantidad = ctt
        this.articulos[this.editedIndexArt].tasadescuento = pordes
        this.articulos[this.editedIndexArt].importedescuento = impdes
        this.articulos[this.editedIndexArt].total = (Number(ctt)*pre)-impdes
      }
    },

    guardarArtAnotador(item) {
      if (item.articulo_id=="") return
      if (this.esTexto) {
        if (this.editedIndexArt > -1) { // esta modificando  
          this.articulos[this.editedIndexArt].articulo_id = 1
          this.articulos[this.editedIndexArt].codigo = '1@1'
        } else {
          this.articulos.push({ 
            id: 0, articulo_id: 1, codigo: '1@1', codbar: null, nombre: this.editadoArt.texto, deposito_id: null, unidad_id: null,
            moneda_id: this.editadoArt.moneda_id, iva_id: this.editadoArt.iva_id, cantidad: 1, cantidadoriginal: 1, stock: 0, undstock: this.editadoArt.undstock,
            sinstock: this.edotadoArt.sinstock, costo: Number(this.editadoArt.total), precio: Number(this.editadoArt.total),
            preciooriginal: Number(this.editadoArt.total), tasadescuento: 0, importedescuento: 0, tasaproprecargo: 0, total: Number(this.editadoArt.total),
            texto: this.editadoArt.texto, vencimiento: '', adevolver: 0, padre_id: null, undenvase: 1, escombo: false,
            ofeprecio: 0, ofetasdes: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '', turno_id: null, decimales: this.editadoArt.decimales,
            preciomediocobro: false, loTengo: false,
          })
        }
        this.calculos()
        return
      }
      let recno = 0
      if (this.editedIndexArt > -1) { // esta modificando
        recno = this.editedIndexArt
        this.articulos[this.editedIndexArt].articulo_id      = this.editadoArt.articulo_id
        this.articulos[this.editedIndexArt].codigo           = this.editadoArt.codigo
        this.articulos[this.editedIndexArt].nombre           = this.editadoArt.nombre
        this.articulos[this.editedIndexArt].deposito_id      = this.editadoArt.deposito_id
        this.articulos[this.editedIndexArt].unidad_id        = this.editadoArt.unidad_id
        this.articulos[this.editedIndexArt].moneda_id        = this.editadoArt.moneda_id
        this.articulos[this.editedIndexArt].iva_id           = this.editadoArt.iva_id
        this.articulos[this.editedIndexArt].cantidad         = Number(this.editadoArt.cantidad)
        this.articulos[this.editedIndexArt].stock            = Number(this.editadoArt.stock)
        this.articulos[this.editedIndexArt].undstock         = Number(this.editadoArt.undstock)
        this.articulos[this.editedIndexArt].sinstock         = this.editadoArt.sinstock,
        this.articulos[this.editedIndexArt].costo            = Number(this.editadoArt.costo)
        this.articulos[this.editedIndexArt].precio           = Number(this.editadoArt.precio)
        this.articulos[this.editedIndexArt].preciooriginal   = 0
        this.articulos[this.editedIndexArt].tasadescuento    = Number(this.editadoArt.tasadescuento)
        this.articulos[this.editedIndexArt].importedescuento = Number(this.editadoArt.importedescuento)
        this.articulos[this.editedIndexArt].total            = Number(this.editadoArt.total)
        this.articulos[this.editedIndexArt].texto            = ''
        this.articulos[this.editedIndexArt].vencimiento      = ''
        this.articulos[this.editedIndexArt].padre_id         = this.editadoArt.padre_id
        this.articulos[this.editedIndexArt].escombo          = this.editadoArt.escombo
      } else {
        let estaba = false
        for (let i=0; i<=this.articulos.length-1; i++) {
          if (this.articulos[i].articulo_id==this.editadoArt.articulo_id) {
            this.articulos[i].cantidad += this.editadoArt.cantidad
            this.articulos[i].total = this.articulos[i].cantidad*this.articulos[i].precio
            recno = i
            estaba = true
            break
          }
        }
        if (!estaba) {
          this.articulos.push({
            id: 0, articulo_id: this.editadoArt.articulo_id, codigo: this.editadoArt.codigo, codbar: this.editadoArt.codbar,
            nombre: this.editadoArt.nombre, deposito_id: this.editadoArt.deposito_id, unidad_id: this.editadoArt.unidad_id,
            moneda_id: this.editadoArt.moneda_id, iva_id: this.editadoArt.iva_id, cantidad: Number(this.editadoArt.cantidad),
            cantidadoriginal: Number(this.editadoArt.cantidad), stock: this.editadoArt.stock, undstock: Number(this.editadoArt.undstock),
            sinstock: this.editadoArt.sinstock, costo: this.editadoArt.costo, precio: this.editadoArt.precio,
            preciooriginal: this.editadoArt.preciooriginal, tasadescuento: this.editadoArt.tasadescuento, importedescuento: this.editadoArt.importedescuento,
            tasaproprecargo: 0, total: this.editadoArt.total, texto: '', vencimiento: '', adevolver: 0, padre_id: this.editadoArt.padre_id,
            undenvase: this.editadoArt.undenvase, escombo: this.editadoArt.escombo,
            ofeprecio: this.editadoArt.ofeprecio, ofetasdes: this.editadoArt.ofetasdes, ofeenvio: this.editadoArt.ofeenvio,
            ofeunidades: this.editadoArt.ofeunidades, ofeestado: this.editadoArt.ofeestado, turno_id: null, decimales: this.editadoArt.decimales,
            preciomediocobro: false, loTengo: false,
          })
          recno = this.articulos.length-1
        }
      }
      if (!this.dialogArtNot) {
        this.calculos()
      } else {
        const a = HTTP().post('/anotadordeventasitems/'+this.anotadorId, {articulos: this.articulos[recno]}).then(({ data }) => {
          this.calculos()
        })
      }

      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });

      if (this.editedIndexArt == -1) {
        if (this.dialogArtNot) {
          this.nuevoArtNot()
        } else {
          this.nuevoArt()
        }
      }
    },

    borrarArt(item) {
      this.clickEnBoton = true
      this.itemActualArt = item
      if (this.dialogNot) {
        this.editedIndexNot = this.articulos.indexOf(item)
        this.msg.msgTitle = 'Borrar Item del Anotador'
        this.msg.msgBody = 'Desea borrar este Item del Anotador de Ventas?'
      } else {
        this.msg.msgTitle = 'Borrar Item'
        this.msg.msgBody = 'Desea borrar '+this.itemActualArt.nombre+' - ('+this.itemActualArt.codigo+')'
      }
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    borrarLineaComprobante(item) {
      this.articulos = this.articulos.filter( x => x.codigo != item.codigo)
      this.calculos()
    },

    elValorEstaOk() {
      this.medioDePagoOk = true
      if (this.medioDePagoId==1) {          // EFECTIVO
        if (this.editadoMed.importe==0) {
          this.medioDePagoOk = false
        }
      } else if (this.medioDePagoId==2||this.medioDePagoId==3) {   // TARJETA DE DEBITO/CREDITO
      } else if (this.medioDePagoId==5) {   // TRANSFERENCIA
      } else if (this.medioDePagoId==6) {   // CHEQUE DE TERCERO
      } else if (this.medioDePagoId==7) {   // CHEQUE PROPIO
        this.medioDePagoOk = !this.editadoMed.cuit||!this.editadoMed.cuenta||!this.editadoMed.banco_id||!this.editadoMed.nrovalor||!this.editadoMed.fechafinanciera
      } else if (this.medioDePagoId==8) {   // MERCADO PAGO
      } else if (this.medioDePagoId==9) {   // TODO PAGO
      }
    },

    guardarPed(item) {
      return HTTP().post('/actualizopedidoitems/'+this.itemActual.id, { articulos: this.artPed }).then(({ data }) => {
        this.dialogPed = false
        this.listarHTTP(true)
      })
    },

    aplicarPorcentajeATransferir() {
      let atr = 0
      this.artTransfPedCtt = 0
      for (let i=0; i<=this.artTransfPed.length-1; i++) {
        atr = Math.trunc(this.artTransfPed[i].cttori*(this.artTransfPorcentaje/100))
        this.artTransfPed[i].ctttransf = atr
        this.artTransfPedCtt += atr
      }
    },

    guardarTransfPedHTTP(item) {
      return HTTP().post('/transfieropedido/', 
        { sucursal: this.artTransfPedId,
          itemactual: this.itemActual, articulos: this.artTransfPed }).then(({ data }) => {
          if (data=='ok') {
            this.msg.msgTitle = 'Transferencia Realizada'
            this.msg.msgBody = 'Se ha realizado correctamente la tranferencia de este Pedido.'
          } else if (data=='error') {
            this.msg.msgTitle = 'Error'
            this.msg.msgBody = 'Se ha producido un error en la tranferencia de este Pedido.'
          }
          this.msg.msgVisible = true
          this.msg.msgAccion = 'transferencia de pedidos'
          this.msg.msgButtons = ['Aceptar']
          this.dialogTransferirPedido = false
          if (this.desdeAdmPedidos) {
            this.activoSucursal('setFiscal')
            this.administracionPedidos()
          } else {
            this.listarHTTP(false)
          }

        })
    },


    //////////////////////////////
    // METODOS FUNCIONES VARIAS //
    //////////////////////////////
    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        const negativeSign = amount < 0 ? "-" : "";
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : ""); 
      } catch (e) {
        console.log(e)
      }
    },

    roundTo(value, places){
      var power = Math.pow(10, places);
      return Math.round(value * power) / power;
    },

    truncTo(value, places) {
      let multiplier = Math.pow(10, places),
        adjustedNum = value * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
      return truncatedNum / multiplier;      
    },

    msgRespuesta(op) {
      this.clickEnBoton = false
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='listo para reparto') {
          this.viajeListoParaRepartoHTTP()
        } else if (this.msg.msgAccion=='borrar item') {
          if (this.dialogNot) {
            return HTTP().delete('/borraritemanotador/'+this.anotadorId+'/'+this.articulos[this.editedIndexNot].articulo_id).then((data) => {
              this.msg.msgVisible = false;
              this.listarAnotaciones()
            });
          } else {
            this.borrarLineaComprobante(this.itemActualArt)
          }
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          this.exportExcel()
        } else if (this.msg.msgAccion=='facturar anotaciones de ventas') {
          return this.altaHTTP('anotaciones').then((data) => {
            this.articulos = []
            this.msg.msgVisible = false;
          })
        } else if (this.msg.msgAccion=='cobrar comprobante') {
          return this.altaHTTP('recibo').then((data) => {
            this.msg.msgVisible = false;
          })
        } else if (this.msg.msgAccion=='anular recibo') {
          this.anularReciboHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='anular presupuesto') {
          this.anularPresupuestoHTTP('recibo')
        } else if (this.msg.msgAccion=='anular pedido') {
          this.anularPedidoHTTP()
        } else if (this.msg.msgAccion=='cliente vinculado') {
          if (this.dondeEstoy=='F') {
            if (this.buscoPor=='codigo') {
              this.$nextTick(() => {
                const f = this.$refs.codigocliente;
                f.focus();
              });
            } else {
              this.$nextTick(() => {
                const f = this.$refs.cliente;
                f.focus();
              });
            }
          } else if (this.dondeEstoy=='R') {
            this.$nextTick(() => {
              const f = this.$refs.clienterecibo;
              f.focus();
            });
          }
        } else if (this.msg.msgAccion=='saldo insuficiente') {
          this.dialog = false
        } else if (this.msg.msgAccion=='enviar pedido al cliente') {
          this.aEnviarHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='finalizar y enviar pedido al proveedor') {
          this.enviarPedidoDelVendedor(this.itemActual)
        } else if (this.msg.msgAccion=='retirar mercaderia') { //}'retirar pedido') {
          this.aRetirarHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='arreglar pedido') {
          this.arreglarPedidoHTTP()
        } else if (this.msg.msgAccion=='Dar por concluido') {
          this.concluirPedidoHTTP(this.itemActual)
        }
      }
      this.msg.msgVisible = false;
    },

    mailRespuesta(op) {
      this.mail.visible = false
      if (op==='Enviar') { 
        this.msg.msgTitle = 'Envío de correo electrónico'
        this.msg.msgBody = 'El mail ha sido enviado con exito'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'mail enviado'
        this.msg.msgButtons = ['Aceptar']
      }
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
              if (item.pendientes[i].cancelaciones[j].cancelador.cpr.substring(0,3)=='NDC') {
                tieneNdc = true
                break
              }
            }
          }
        }
      }
      return (tieneNdc) ? this.temas.forms_btn_inactivo_bg : this.temas.barra_lateral_bg
    },

    getEstadoPed (estado, accion) {
      let c = ''
      let e = ''
      if (estado==='T') {
        e = 'total'
        c = this.temas.cen_estado_finalizado_bg
      } else if (estado==='P') {
        e = 'Parcial'
        c = this.temas.cen_estado_vencido_bg
      } else if (estado==='N') {
        e = 'Sin Stock'
        c = this.temas.cen_estado_vencehoy_bg 
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
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
          if (item.tercero.user.tipo=='UE') {
            say = estaVinculado!=-1?'u+v':'u'
          } else if (item.tercero.user.tipo=='PP') {
            say = estaVinculado!=-1?'PPv':'PP'
          } else if (item.tercero.user.tipo=='CO') {
            say = estaVinculado!=-1?'COv':'CO'
          } else if (item.tercero.user.tipo=='BA') {
            say = estaVinculado!=-1?'BAv':'BA'
          }
        }

        if (item.lista!=null) {
          say +=' -'+item.lista
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

    getEstadoAnotador ( importe ) {
      return importe==0 ? 'black' : this.temas.barra_principal_botonapp_bg
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoImporteDec(value, dec) {
      let val = (value/1).toFixed(dec).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
//      let signo = value >= 0?1:-1
//      let v = Math.round((value*Math.pow(10,dec))+(signo*.0001))/Math.pow(10,dec).toFixed(dec)
//      return v.toString()
    },

    formatoFecha(value) {
      return moment(String(value)).format('L')
    },

    formatoFechaCorta(value) {
      let a = moment(String(value)).format('dd')
      let b = moment(String(value)).format('DD') 
      return a+' '+b
    },

    formatoFechaReparto(value) {
      return moment(value).format('dd DD, MMM YY')
    },

    fechaTimeLine(value) {
      return moment(String(value)).format('D MMM-YY h:mm a')
    },

    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = 'ventas'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },

    exportarAPDF () {
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

    chequearAfip () {
      return HTTP().post('chequearafip', {cuit: this.datosEmpresa.cuit, produccion: this.datosEmpresa.faeproduccion }).then((res) => {
        this.msg.msgTitle = 'Servicio de AFIP'
        let msg = ''
        if (res.data=='error') {
          msg = 'El servicio de AFIP esta INACTIVO' 
          msg += '<br>Deberá esperar a que se reestablezca o en su defecto realizar '
          msg += 'comprobantes manuales.'
        } else {
          msg += '<br>Los servidores de AFIP estan ACTIVOS y respondieron correctamente.<br><br>'
          msg += 'Si aún así presenta problemas en la emisión o consulta de comprobantes electronicos '
          msg += 'espere y vuelva a intentar<br>'
        }
        this.msg.msgBody    = msg
        this.msg.msgVisible = true
        this.msg.msgAccion  = 'Servicio de AFIP'
        this.msg.msgButtons = ['Aceptar']
      })
    },

    setGrillaPrincipal() {
      if (this.filtroComprobanteSel=='Viajes') {
        this.headers = [
          { text: 'Vje', value: 'id', align: 'end', width: 80 },
          { text: 'Fecha', value:'fecha', align: 'left', width: 90},
          { text: 'Zona', value:'zona.nombre', align: 'left', width: 200},
        //{ text: 'Vendido', value:'vendido', align: 'end', width: 140},
          { text: 'Facturado', value:'facturas', align: 'end', width: 160},
          { text: 'NDDs', value:'ndd', align: 'end', width: 160},
          { text: 'NDCs', value:'ndc', align: 'end', width: 160},
          { text: 'REMs', value:'remitos', align: 'end', width: 90},
          { text: 'Recibos', value:'recibos', align: 'end', width: 220},
        //{ text: 'Val/Ren', value:'valores', align: 'left', width: 100},
          { text: 'Estado', value:'estado', align: 'end',  width: 110},
          { text: 'Ops', value: 'accion', sortable: false },
        ]
      } else {
        this.headers = [
          { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 175 },
          { text: 'FECHA', value:'fecha', align: 'left', width: 90 },
          { text: 'CLIENTE', value: 'tercero.razon_social', align: 'left', width: 230 },
          { text: 'DESC', value:'importedescuento', align: 'end', width: 110 },
          { text: 'TRN', value:'rentabilidad', align: 'end', width: 110 },
          { text: 'PENDIENTE', value:'pendientes[0].pendiente', align: 'end', width: 120 },
          { text: 'TOTAL', value:'total', align: 'end', width: 150 },
          { text: 'ESTADO', value:'estado', align: 'left', width: 110 },
          { text: 'ACC', value: 'accion', sortable: false, width: 50 },
        ]
        if ((this.filtroComprobanteSel=='Facturas'||
             this.filtroComprobanteSel=='Débitos'||
             this.filtroComprobanteSel=='Créditos'||
             this.filtroComprobanteSel=='Remitos')&&this.operarioEsVendedor) {
          this.headers[2].value = 'user.tercero.razon_social'
        }
        if (this.filtroComprobanteSel=='Pedidos') {
          if (this.operarioEsVendedor) {
            this.headers[2].value = 'user.tercero.razon_social'
          } else {
            this.headers[2].value = 'tercero.razon_social'
            this.headers[3].text = 'Viaje'
            this.headers[3].value = 'viaje_id'
            this.headers[4].text = 'Zona'
            this.headers[4].value = 'tercero.direcciones[0].zona[0].zonas.nombre'
            this.headers[4].align ='left'
          }
          this.headers[5].text = 'PEDIDO POR'
          this.headers[5].value = 'observaciones'
        }
      }
    },

    buscarFacturasParaRemito() {
      return HTTP().post('facturaspararemito', { tercero_id: this.editado.tercero_id }).then((data) => {
        this.facturas = []
        if (data.data[0].length>0) {
          this.facturas = data.data[0].filter(item => item.remito === 0 )
          if (this.facturas.length>0) {
            this.dialogSelFacturas = true
          }
        }
      })
    },

    selectAll(event) {
      if (event.value) {
        this.selected = this.facturas
      } else {
        this.selected = []
      }
    },

    selectAllTurnos(event) {
      if (event.value) {
        this.selected = this.turnosFacturar
      } else {
        this.selected = []
      }
    },

    selectAllChq(event) {
      this.nddTotal = 0
      if (event.value) {
        this.selected = this.cheques
        for (let i=0; i<=this.cheques.length-1; i++) {
          this.nddTotal += this.cheques[i].importe
        }
      } else {
        this.selected = []
      }
    },

    confirmarFacturasSeleccionadas() {
      this.articulos = []
      this.dialogSelFacturas = false
      let idFacSel = []
      for (let i=0; i<=this.selected.length-1; i++) {
        idFacSel.push(this.selected[i].id)
      }
      return HTTP().post('cargofacturaspararemito', { idFacSel: idFacSel }).then((item) => {
        for (let i=0; i<=item.data.length-1; i++) {
          let pos = this.articulos.findIndex(x => x.articulo_id === item.data[i].articulo_id);
          if (pos==-1) {
            this.articulos.push({ 
              id: item.data[i].id, articulo_id: item.data[i].articulo_id, codigo: item.data[i].articulo.codigo, codbar: item.data[i].articulo.codbar,
              nombre: item.data[i].articulo.nombre, deposito_id: this.editado.deposito_id, unidad_id: item.data[i].articulo.unidad_id,
              moneda_id: item.data[i].articulo.moneda_id, iva_id: item.data[i].articulo.iva_id, cantidad: Number(item.data[i].cantidad),
              cantidadoriginal: Number(item.data[i].cantidad), stock: 0, undstock: item.data[i].articulo.undstock, sinstock: item.data[i].sinstock,
              costo: item.data[i].costo, precio: item.data[i].precio, preciooriginal: item.data[i].precio, tasadescuento: item.data[i].tasadescuento,
              importedescuento: item.data[i].importedescuento, tasaproprecargo: 0, total: item.data[i].total, texto: item.data[i].texto,
              vencimiento: item.data[i].vencimiento, adevolver: 0, padre_id: null, undenvase: item.data[i].articulo.undenvase,
              escombo: item.data[i].articulo.escombo, ofeprecio: 0, ofetasdes: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '',
              turno_id: null, decimales: item.data[i].articulo.precios[0].decimales, preciomediocobro: false, loTengo: false,
            })
          } else {
            this.articulos[pos].cantidad += Number(item.data[i].cantidad)
            this.articulos[pos].cantidadoriginal += Number(item.data[i].cantidad)
            this.articulos[pos].stock += Number(item.data[i].cantidad)
            this.articulos[pos].total += Number(item.data[i].total)
          }
        }
        this.calculos()
      })
    },

    confirmarTurnosSeleccionados() {
      //this.articulos = []
      this.dialogSelTurnos = false
      let idTurSel = []
      for (let i=0; i<=this.selected.length-1; i++) {
        idTurSel.push(this.selected[i].id)
      }
      for (let i=0; i<=this.selected.length-1; i++) {
        let pos = this.articulos.findIndex(x => x.articulo_id === this.selected[i].articulo_id);
        if (pos==-1) {
          this.articulos.push({ 
            id: this.selected[i].id, articulo_id: this.selected[i].articulo_id, codigo: this.selected[i].codigo, codbar: null,
            nombre: this.selected[i].nombre, deposito_id: this.editado.deposito_id, unidad_id: null, moneda_id: this.selected[i].moneda_id,
            iva_id: this.selected[i].iva_id, cantidad: 1, cantidadoriginal: 1, stock: 0, undstock: 1, sinstock: 'C', costo: this.selected[i].costo,
            precio: this.selected[i].precio, preciooriginal: this.selected[i].precio, tasadescuento: 0, importedescuento: 0, tasaproprecargo: 0,
            total: this.selected[i].precio, texto: 'FACTURACION DE TURNO/S', vencimiento: moment().format('YYYY-MM-DD'), adevolver: 0,
            padre_id: null, undenvase: 1, escombo: false, ofeprecio: 0, ofetasdes: 0, ofeenvio: 0, ofeunidades: 0,
            ofeestado: '', turno_id: this.selected[i].id, decimales: this.selected[i].decimales, preciomediocobro: false, loTengo: false,
          })
        } else {
          this.articulos[pos].cantidad += 1
          this.articulos[pos].cantidadoriginal += 1
          this.articulos[pos].total += Number(this.selected[i].precio)
        }
      }
      this.calculos()
    },

    verCprEnAFIPHTTP() {
      return HTTP().post('vercprenafip', {
        comprobante_id: this.itemActual.comprobante_id,
        sucursal: parseInt(this.itemActual.cpr.substring(6,10)),
        numero: parseInt(this.itemActual.cpr.substring(11,19)),
        cuit: this.datosEmpresa.cuit,
        produccion: this.datosEmpresa.faeproduccion }, { timeout: 25000 }).then((res) => {

        this.msg.msgTitle = 'Informe de Comprobante en AFIP'
        let msg = ''
        if (res.data=='error') {
          msg = 'El servicio de AFIP esta INACTIVO' 
          msg += '<br>Deberá esperar a que mismo se reestablezca.'
        } else {
          msg += '<br>Cbte:<b>'+res.data.CbteDesde+'</b><br>'
          msg += 'CAE:<b>'+res.data.CodAutorizacion+'</b><br>'
          if (res.data.Concepto==1) {
            msg += 'Tipo: <b>Comercializacion de Mercaderias</b><br><br>'
          } else if (data.Concepto==2) {
            msg += 'Tipo: <b>Servicio Prestado</b><br><br>'
          } else {
            msg += 'Tipo: <b>Comercializacion de Mercaderías y Servicio Prestado</b><br><br>'
          }
          msg += 'Importes<br>'
          msg += 'NETO: <b>$'+this.formatoImporte(res.data.ImpNeto)+'</b><br>'
          msg += 'EXENTO: <b>$'+this.formatoImporte(res.data.ImpOpEx)+'</b><br>'
          msg += 'OTROS: <b>$'+this.formatoImporte(res.data.ImpTotConc)+'</b><br>'
          msg += 'IVA: <b>$'+this.formatoImporte(res.data.ImpIVA)+'</b><br>'
          msg += 'TOTAL: <b>$'+this.formatoImporte(res.data.ImpTotal)+'</b><br><br>'
          msg += 'Cantidad de Alicuotas: <b>'+res.data.Iva.AlicIva.length+'</b><br>'
          for (let i=0; i<=res.data.Iva.AlicIva.length-1; i++) {
            msg += 'BaseImp: <b>$'+this.formatoImporte(res.data.Iva.AlicIva[i].BaseImp)+'</b> '
            msg += 'IVA: <b>$'+this.formatoImporte(res.data.Iva.AlicIva[i].Importe)+'</b> '
            msg += 'Codigo: <b>'+res.data.Iva.AlicIva[i].Id+'</b><br>'
          }
          if (res.data.CbtesAsoc!=undefined) {
            msg += '<br>Comprobante Asociado<br>'
            msg += 'Número: <b>'+res.data.CbtesAsoc.CbteAsoc[0].Nro+'</b><br>'
          }
        }
        this.msg.msgBody    = msg
        this.msg.msgVisible = true
        this.msg.msgAccion  = 'Servicio de AFIP'
        this.msg.msgButtons = ['Aceptar']
      })
    },

    isArray(array) {
      if (toString.call(array) === "[object Array]") {
        return true;
      } else if ( typeof array.length === "number" ) {
        return true;
      }
      return false;
    },

    whatsapp(item) {
      let code = '54'
//    let phone = '3584363612' el de la flaca
      let phone = '3584900902'
      let msg = 'Desde el programa!!!'
      /* this is the magic */
      window.open(`https://api.whatsapp.com/send?phone=${code}${phone}&text=${msg}`,"_blank");
    },

    terceroUserDefined(item) {
      if (item.tercero==undefined) {return false}
      return item.tercero.user!=undefined?true:false
    },

    setSucManual() {
      this.sucManual = this.sucManual.padStart(4,'0')
    },

    setNroManual() {
      this.nroManual = this.nroManual.padStart(8,'0')
    },

    busManual() {
      let cpr = this.editado.cpr+'-'+this.editado.letra+' '+this.sucManual+'-'+this.nroManual
      return HTTP().post('existeelcpr', { cpr: cpr }).then((data) => {
        if (data.data[0].length>0) {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = '¡El comprobante '+cpr+' ya existe!</br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'El comprobante ya existe'
          this.msg.msgButtons = ['Aceptar']
        }
      })
    },

    cancelaLinea() {
      if (this.formTitleArt == 'Editar Item') {
        this.articulos.unshift({
          id: this.editadoArt.id, articulo_id: this.editadoArt.articulo_id, codigo: this.editadoArt.codigo, codbar: this.editadoArt.codbar,
          nombre: this.editadoArt.nombre, deposito_id: this.editadoArt.deposito_id, unidad_id: this.editadoArt.unidad_id,
          moneda_id: this.editadoArt.moneda_id, iva_id: this.editadoArt.iva_id, cantidad: this.editadoArt.cantidad,
          cantidadoriginal: this.editadoArt.cantidadoriginal, stock: this.editadoArt.stock, undstock: this.editadoArt.undstock,
          sinstock: this.editadoArt.sinstock, costo: this.editadoArt.costo, precio: this.editadoArt.precio,
          preciooriginal: this.editadoArt.preciooriginal, tasadescuento: this.editadoArt.tasadescuento,
          importedescuento: this.editadoArt.importedescuento, tasaproprecargo: this.editadoArt.tasaproprecargo, total: this.editadoArt.total,
          texto: this.editadoArt.texto, vencimiento: this.editadoArt.vencimiento, adevolver: this.editadoArt.adevolver,
          padre_id: this.editadoArt.padre_id, undenvase: this.editadoArt.undenvase, escombo: this.editadoArt.escombo,
          ofeprecio: this.editadoArt.ofeprecio, ofetasdes: this.editadoArt.ofetasdes,
          ofeenvio: this.editadoArt.ofeenvio, ofeunidades: this.editadoArt.ofeunidades, ofeestado: this.editadoArt.ofeestado,
          turno_id: this.editadoArt.turno_id, decimales: this.editadoArt.decimales, preciomediocobro: this.editadoArt.preciomediocobro,
          loTengo: this.editadoArt.loTengo,
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

    print(item) {
      return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
        this.$refs.impresion.ventasPrint(data.c, 'yo');
      })
    },

    printDetalles(item) {
      return HTTP().post('comprobante', { id: item.id }).then(({ data }) => {
        this.$refs.impresion.ventasPrintDetalles(data.c);
      })
    },

    printViaje(item) {
      this.$refs.impresion.viaje(this.itemActualViaje);
    },

    printViajeStock(item) {

      // tengo que levantar todos los recorridos del viaje para mostrar la informacion
      // de stocks
      debugger
      // hev021
      return HTTP().post('/haystockparaelviaje', { viaje: this.itemActualViaje.id }).then(({ data }) => {
        debugger
        let dat = []
        let art = []
        let ctt = []
        for (let i=0; i<=data.length-1; i++) {
          if (data[i].pedido!=null) {
            for (let j=0; j<=data[i].pedido.items.length-1; j++) {
              let pos = art.findIndex(x=>x==data[i].pedido.items[j].articulo_id)
              if (pos==-1) {
                art.push(data[i].pedido.items[j].articulo_id)
                ctt.push({
                  articulo_id: data[i].pedido.items[j].articulo_id,
                  codigo: data[i].pedido.items[j].articulo.codigo,
                  nombre: data[i].pedido.items[j].articulo.nombre,
                  ctt: data[i].pedido.items[j].cantidad,
                  stk: 0, ofe: 0,
                })
              } else {
                ctt[pos].ctt += data[i].pedido.items[j].cantidad
              }
              pos = dat.findIndex(x=>
                x.tercero_id==data[i].pedido.tercero.id&&
                x.articulo_id==data[i].pedido.items[j].articulo.id
              )
              if (pos==-1) {
                dat.push({
                  tercero_id: data[i].pedido.tercero.id,
                  nombre: data[i].pedido.tercero.nombre,
                  cpr: data[i].pedido.cpr,
                  articulo_id: data[i].pedido.items[j].articulo_id,
                  codigo: data[i].pedido.items[j].articulo.codigo,
                  nomart: data[i].pedido.items[j].articulo.nombre,
                  ctt: data[i].pedido.items[j].cantidad,
                })
              } else {
                dat[pos].ctt += data[i].pedido.items[j].cantidad
                dat[pos].cpr += '/' + data[i].pedido.cpr
              }
            }
          }
          if (data[i].pedidob!=null) {
            for (let j=0; j<=data[i].pedidob.items.length-1; j++) {
              let pos = art.findIndex(x=>x==data[i].pedidob.items[j].articulo_id)
              if (pos==-1) {
                art.push(data[i].pedidob.items[j].articulo_id)
                ctt.push({
                  articulo_id: data[i].pedidob.items[j].articulo_id,
                  codigo: data[i].pedidob.items[j].articulo.codigo,
                  nombre: data[i].pedidob.items[j].articulo.nombre,
                  ctt: data[i].pedidob.items[j].cantidad,
                  stk: 0, ofe: 0,
                })
              } else {
                ctt[pos].ctt += data[i].pedidob.items[j].cantidad
              }
              pos = dat.findIndex(x=>
                x.tercero_id==data[i].pedidob.tercero.id&&
                x.articulo_id==data[i].pedidob.items[j].articulo.id
              )
              if (pos==-1) {
                dat.push({
                  tercero_id: data[i].pedidob.tercero.id,
                  nombre: data[i].pedidob.tercero.nombre,
                  cpr: data[i].pedidob.cpr,
                  articulo_id: data[i].pedidob.items[j].articulo_id,
                  codigo: data[i].pedidob.items[j].articulo.codigo,
                  nomart: data[i].pedidob.items[j].articulo.nombre,
                  ctt: data[i].pedidob.items[j].cantidad,
                })
              } else {
                dat[pos].ctt += data[i].pedidob.items[j].cantidad
                dat[pos].cpr += '/' + data[i].pedidob.cpr
              }
            }
          }
        }

        return HTTP().post('/articuloz', {
          search: art,
          vinculosPadresLic: this.$store.state.vinculosPadresLic,
          vinculosPadresAll: this.$store.state.vinculosPadresAll,
          proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: this.$store.state.soloArtComprados, descuentos: this.descuentos,
          dolar: this.$store.state.dolar, activos: true, limit: 300 }).then(({ data })=>{
          for (let i=0; i<=data.length-1; i++) {
            let pos = ctt.findIndex(x=>x.articulo_id==data[i].id)
            if (pos!=-1) {
              ctt[pos].stk = data[i].stock
              ctt[pos].ofe = data[i].precios[0].ofeunidades
            }
          }
          this.$refs.impresion.viajestock(this.itemActualViaje,dat, ctt);
        })
      })


    },

    clickRow(value) {
      if (value.value) {
        this.nddTotal += value.item.importe
      } else {
        this.nddTotal -= value.item.importe
      }
    },

    porTransferir() {
      if (this.artTransfPorcentaje<0||this.artTransfPorcentaje>100) {
        this.artTransfPorcentaje = 0
      }
    },

  },
};
</script>

<style scoped lang="scss">
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
  .fg95 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 95%;
  }
  .fg90 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
    font-weight: bold;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .fg78 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 78%;
  }
  .fg70 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 70%;
  }
  .fg60 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 60%;
  }
</style> 
<style> 
  tr.v-data-table__selected {
    background: #a5acd2 !important;
  }

  span.izq{
    display: block;
    float: left;
  }

  span.der{
    display: block;
    float: right;
  }

</style>
/* 12480 */