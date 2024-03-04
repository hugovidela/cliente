<template>
  <v-layout align-start>
    <v-flex class="fg">
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        dense
        :footer-props="{
          itemsPerPageOptions: [6],
          showFirstLastPage: true,
          showCurrentPage: true,
          nextIcon: 'mdi-arrow-right-drop-circle-outline',
          prevIcon: 'mdi-arrow-left-drop-circle-outline',
        }"
        @click:row="clickRow"
        class="elevation-1">
        <template v-slot:top>
          <v-toolbar text
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
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="nuevoArticulo(false)" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Nuevo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="pausarActivarOfertas(false)" v-on="on">
                    <v-icon>mdi-pause</v-icon>
                  </v-btn>
                </template>
                <span>Pausar todas las ofertas</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="pausarActivarOfertas(true)" v-on="on">
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
                </template>
                <span>Activar todas las ofertas</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="nuevoArticulo(true)" v-on="on">
                    <v-icon>mdi-vector-arrange-below</v-icon>
                  </v-btn>
                </template>
                <span>Nuevo Combo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="exportarAXLS" v-on="on">
                    <v-icon>mdi-file-excel</v-icon>
                  </v-btn>
                </template>
                <span>Enviar a Excel</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="exportarAPDF" v-on="on">
                    <v-icon>mdi-file-outline</v-icon>
                  </v-btn>
                </template>
                <span>Enviar a PDF</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-switch
                label="Solo Artí­culos Propios y Comprados"
                :color="temas.cen_btns_bg"
                v-model="soloArtComprados"
                @change="listarHTTP()">
              </v-switch>
              <v-switch class="ml-4"
                label="Mostrar Artí­culos Inactivos"
                :color="temas.cen_btns_bg"
                v-model="sayInactivos"
                @change="listarHTTP()">
              </v-switch>
            </template>

            <v-toolbar-title class="fg">
              Mis Artí­culos
              <span v-show="$store.state.vinculosHijos.length">
                <v-icon>mdi-share-variant</v-icon>
                con {{ $store.state.vinculosHijos.length }}
                {{$store.state.vinculosHijos.length>1?' usuarios':' usuario'}}
              </span>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <!--  Modal del diálogo para Alta y Edicion    -->
            <v-dialog v-model="dialog" :fullscreen="true" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <!-- para el EDICION-->
                <v-toolbar text
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelar">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="fg">{{ formTitle }}
                    <b>
                      <v-icon>mdi-share-variant</v-icon>
                      con {{ $store.state.vinculosHijos.length }} usuario/s
                    </b>
                  </span>
                  <v-spacer></v-spacer>
                  <!--<div v-if="elArticuloEsMio || editedIndex===-1">-->
                  <div>
<!--                <v-btn v-if="!(!elArticuloEsMio && editado.escombo==1)"-->
                    <v-btn
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="fg85 ma-2 white--text" @click="guardar(false)">
                      Guardar
                    </v-btn>
                  </div>
                </v-toolbar>
                <v-form ref="form">
                  <v-card-text>
                    <!--<v-container>-->
                      <v-row class="pt-2 pl-2 ml-2 mr-2">
                        <v-col cols="12" sm="1" xs="12" class="fg pt-0 pb-0">
                          <v-text-field
                            disabled
                            v-model="editado.id"
                            label="ID">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="fg pt-0 pb-0">
                          <v-text-field
                            ref="codigo"
                            :color="temas.forms_titulo_bg"
                            :disabled="!elArticuloEsMio"
                            :autofocus="(editedIndex===-1)"
                            v-model="editado.codigo"
                            label="Codigo"
                            required
                            :rules="codigoRules"
                            :counter="15"
                            maxlength="15"
                            v-on:keydown.tab="buscoCodigo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" class="fg pt-0 pb-0">
                          <v-text-field
                            ref="nombre"
                            :disabled="!elArticuloEsMio"
                            v-model="editado.nombre"
                            :autofocus="(editedIndex===0)"
                            label="Nombre"
                            required
                            :color="temas.forms_titulo_bg"
                            :rules="nombreRules"
                            :counter="80"
                            maxlength="80">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" class="fg pt-0 pb-0">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.creador"
                            :color="temas.forms_titulo_bg"
                            label="Creador">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1" class="fg pt-0 pb-0">
                          <v-switch
                            label="Es Combo"
                            disabled
                            :color="temas.forms_titulo_bg"
                            v-model="editado.escombo">
                          </v-switch>
                        </v-col>
                      </v-row>

                      <v-tabs key="pri" :color="temas.forms_titulo_bg" class="fg pt-0 pl-2 pr-2">
                        <v-tab href="#general">
                          Datos Generales
                        </v-tab>
                        <v-tab-item value="general">

                          <v-row no-gutters class="pt-2 pl-2 pr-2">

                            <!-- RUBRO GRUPO ETC -->
                            <v-col cols="12" sm="3">
                              <v-card class="pa-2 pt-0" outlined tile>
                                <v-row align="center" class="pt-2">
                                  <v-col cols="12" sx="12" mx="12" class="fg pt-4 pb-4">
                                    <v-text-field
                                      v-model="fechaPrecio"
                                      label="Precio actualizado el"
                                      disabled
                                      :color="temas.forms_titulo_bg">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row align="center" class="pt-2">
                                  <v-col cols="12" sx="12" mx="12" class="fg pt-0 pb-0">
                                    <v-switch
                                      label="Activo"
                                      :color="temas.forms_titulo_bg"
                                      v-model="editado.activo">
                                    </v-switch>
                                  </v-col>
                                  <v-col cols="12" sm="12" class="fg pt-0 pb-0">
                                    <v-select
                                      v-model="editado.rubro_id"
                                      :items="rubItems"
                                      :color="temas.forms_titulo_bg"
                                      :item-color="temas.forms_titulo_bg"
                                      item-value="id"
                                      item-text="nombre"
                                      label="Rubro"
                                      @change="actualizoGrupos()">
                                    </v-select>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sx="12" mx="12" class="fg pt-0 pb-0">
                                    <v-card outlined>
                                      <span class="fg pl-2">Grupo</span>
                                      <v-chip
                                        class="ma-2"
                                        @click="clickEnGrupo">
                                        {{ nombreDelGrupo }}
                                      </v-chip>
                                    </v-card>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="12" sx="12" mx="12" class="fg pt-4 pb-0">
                                    <v-autocomplete
                                      v-model="precio.marca_id"
                                      :color="temas.forms_titulo_bg"
                                      :items="itemsMarcas"
                                      :loading="isLoadingMarcas"
                                      :search-input.sync="searchMarcas"
                                      item-text="nombre"
                                      item-value="id"
                                      label="Marca"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search">
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete
                                      class="pt-0 pb-0"
                                      v-model="editado.moneda_id"
                                      :disabled="!elArticuloEsMio"
                                      :color="temas.forms_titulo_bg"
                                      :items="itemsMoneda"
                                      :loading="isLoadingMoneda"
                                      :search-input.sync="searchMoneda"
                                      item-text="nombre"
                                      item-value="id"
                                      label="Moneda"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search">
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>

                            <v-col cols="12" sm="3">
                              <v-card class="fg pa-2 pt-0" outlined tile>

                                <v-row class="pt-5">
                                  <v-col cols="6" sm="6">
                                    <v-text-field
                                      ref="nombre"
                                      v-model="editado.codbar"
                                      label="Código de Barra"
                                      :color="temas.forms_titulo_bg"
                                      required
                                      :counter="14"
                                      maxlength="14"
                                      class="pt-0 pb-0">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="6" sm="6" class="pt-0 pb-0">
                                    <barcode
                                      :tag="tag" width=1 height=38 fontSize=14
                                      :value="editado.codbar">
                                    </barcode>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="12" sm="12">
                                    <v-textarea
                                      v-model="editado.descripcion"
                                      :disabled="!elArticuloEsMio"
                                      rows="11"
                                      :color="temas.forms_titulo_bg"
                                      label="Descripción">
                                    </v-textarea>
                                  </v-col>
                                </v-row>
                                <!--
                                <v-row class="fg pt-0 mt-0">
                                  <v-col>
                                    <span>Descuentos por Unidades</span>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="12">
                                    <v-data-table
                                      class="elevation-3 pt-0 pb-0"
                                      :headers="headersUnds"
                                      :color="temas.forms_titulo_bg"
                                      :items="unds"
                                      dense
                                      single-select
                                      @click:row="selArtClick"
                                      :footer-props="{
                                        itemsPerPageOptions: [10],
                                        showFirstLastPage: true,
                                        showCurrentPage: true,
                                        nextIcon: 'mdi-arrow-right-drop-circle-outline',
                                        prevIcon: 'mdi-arrow-left-drop-circle-outline',
                                      }">
                                      <template v-slot:item.accion="{ item }">
                                        <v-menu bottom left
                                          v-if="item.loTengo||item.padre_id==null">
                                          <template v-slot:activator="{ on, attrs }">
                                            <v-btn icon v-bind="attrs" v-on="on">
                                              <v-icon>mdi-18px mdi-dots-vertical</v-icon>
                                            </v-btn>
                                          </template>
                                          <v-list dense>
                                            <v-list-item-group :color="temas.forms_titulo_bg">
                                              <v-list-item
                                                v-for="(item, i) in accionesUnds" :key="i">
                                                <v-list-item-icon>
                                                  <v-icon
                                                    class="font-size: 24px"
                                                    @click="selAccionUnds(item)"
                                                    v-text="item.icon">
                                                  </v-icon>
                                                </v-list-item-icon>
                                                <v-list-item-content>
                                                  <v-list-item-title
                                                    class="caption"
                                                    @click="selAccionUnds(item)">
                                                    {{ item.nombre }}
                                                  </v-list-item-title>
                                                </v-list-item-content>
                                              </v-list-item>
                                            </v-list-item-group>
                                          </v-list>
                                        </v-menu>
                                      </template>

                                    </v-data-table>
                                  </v-col>
                                </v-row>
                                -->
                              </v-card>
                            </v-col>

                            <!-- PRECIOS -->
                            <v-col cols="12" sm="3" class="pt-0">
                              <v-card class="fg pa-2 pt-5 pb-0" outlined tile>

                                <v-row>
                                  <v-col cols="5" sm="5" class="pt-0 pb-0">
                                    <v-switch
                                      v-model="ancladoAlDolar"
                                      label="¿Anclado?"
                                      :disabled="!$store.state.anclarCostos||!elArticuloEsMio"
                                      :color="temas.forms_titulo_bg"
                                      @click="costoAncladoAlDolar">
                                    </v-switch>
                                  </v-col>
                                  <v-col cols="1" sm="1" class="pt-0 pb-0">
                                  </v-col>
                                  <v-col v-if="precio.usd!=0"
                                    cols="6" sm="6">
                                    <v-chip v-if=
                                      "roundTo(costoAnclado,6)<
                                      roundTo(precio.costo,precio.decimales)
                                      &&!desanclarAutomaticamente"
                                      class="pt-0 pb-0"
                                      color="green" dark>
                                      Aplica Ancla
                                    </v-chip>
                                    <v-chip v-else
                                      class="pt-0 pb-0"
                                      color="red" dark>
                                      No Aplica Ancla
                                    </v-chip>
                                  </v-col>
                                </v-row>

                                <v-row v-if="elArticuloEsMio">
                                  <v-col cols="6" sm="6">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="$store.state.dolar"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      type="number"
                                      label="Ultima cotización">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="6" sm="6">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="precio.usd"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      type="number"
                                      label="Precio en Dolares">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row v-else>
                                  <v-col cols="4" sm="4">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="precio.precioPadre"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      type="number"
                                      label="Costo Original">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="4" sm="4">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="precio.desc1"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      type="number"
                                      label="%Des.1">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="4" sm="4">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="precio.desc2"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      type="number"
                                      label="%Des.2">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="6" sm="6">
                                    <v-text-field
                                      class="pt-0 pb-0"
                                      :disabled="!elArticuloEsMio || editado.escombo==1"
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      v-model="precio.costo"
                                      label="Costo"
                                      @click="calpre()"
                                      @change="calpre()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="6" sm="6">
                                    <v-text-field v-if="!editado.escombo==1&&elArticuloEsMio"
                                      class="pt-0 pb-0"
                                      disabled
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      v-model="costoAnclado"
                                      label="Costo Anclado">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="3" sm="3">
                                    <v-text-field class="pt-0 pb-0"
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      v-model="precio.decimales"
                                      label="Decim."
                                      :rules="decimalRule"
                                      @change="calpre()"
                                      @click="calpre()">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="5" sm="5">
                                    <v-text-field v-if="!(editado.escombo==1 && elArticuloEsMio)"
                                      class="pt-0 pb-0"
                                      v-model="precio.porrem"
                                      type="number"
                                      label="%Remarcación"
                                      @click="calpre()"
                                      @change="calpre()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="7" sm="7">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="precio.precio"
                                      :disabled="editado.escombo==1"
                                      :color="temas.forms_titulo_bg"
                                      label="Precio Neto">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="5" sm="5">
                                    <v-autocomplete v-if="!editado.escombo==1"
                                      class="pt-0 pb-0"
                                      v-model="editado.iva_id"
                                      :disabled="!elArticuloEsMio"
                                      :items="itemsAfipIVA"
                                      :loading="isLoadingAfipIVA"
                                      :search-input.sync="searchAfipIVA"
                                      :color="temas.forms_titulo_bg"
                                      item-text="nombre"
                                      item-value="id"
                                      label="IVA"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search"
                                      @change="calpre()">
                                    </v-autocomplete>
                                  </v-col>
                                  <v-col cols="7" sm="7">
                                    <v-text-field
                                      class="pt-0 pb-0 fgb"
                                      v-model="precio.publico"
                                      :disabled="editado.escombo==1"
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      readonly
                                      label="Precio a Revendedor">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                              </v-card>
                            </v-col>

                            <!-- OFERTAS -->
                            <v-col cols="12" sm="3" class="pt-0 pb-0">
                              <v-card class="fg pa-2 pt-5 pb-0" outlined tile>

                                <v-row>
                                  <v-col cols="6" sm="6" class="pt-6 pb-5">
                                    <span>¿Oferta a Revendedor?</span>
                                  </v-col>
                                  <v-col cols="6" sm="6" class="pt-4 pb-5">
                                    <v-chip-group column multiple>
                                      <v-chip v-for="(est, i) in ofeEstados" :key="i"
                                        class="ml-1 ma-1" small
                                        @click="setOferta(i)"
                                        dark
                                        :color=getColorOferta(est.sel)>
                                        {{ est.nombre }}
                                        <v-avatar v-if="est.sel">
                                          <v-icon>mdi-18px mdi-checkbox-marked-circle</v-icon>
                                        </v-avatar>
                                      </v-chip>
                                    </v-chip-group>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="4" sm="4" md="4">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="editado.stock"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      type="number"
                                      label="Stock">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="4" sm="4" md="4">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="precio.ofeunidades"
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      label="Publicados">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="4" sm="4" md="4">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="precio.ofevendidas"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      type="number"
                                      label="Vendidos">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="4" sm="4" md="4">
                                    <v-text-field
                                      class="pt-0 pb-0"
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      v-model="precio.ofetasadescuento"
                                      label="% Desc."
                                      @change="calpre()"
                                      @click="calpre()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="4" sm="4" md="4">
                                    <v-text-field v-if="!editado.escombo==1"
                                    class="pt-0 pb-0"
                                    disabled
                                    :color="temas.forms_titulo_bg"
                                    type="number"
                                    label="Imp.Descuento"
                                    v-model="precio.ofeimportedescuento"
                                    @change="calpre()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="4" sm="4" md="4">
                                    <v-text-field
                                      class="pt-0 pb-0"
                                      v-model="precio.ofeprecio"
                                      :disabled="editado.escombo==1"
                                      :color="temas.forms_titulo_bg"
                                      label="Precio s/IVA">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="6" sm="6" md="6">
                                    <v-text-field
                                      class="pt-0 pb-0"
                                      v-model="calculoRentabilidad"
                                      disabled
                                      label="%Rentabilidad / $Total"
                                      :color="temas.forms_titulo_bg">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="6" sm="6" md="6">
                                    <v-text-field
                                      class="pt-0 pb-0 fgb"
                                      v-model="precio.ofepreciofinal"
                                      readonly
                                      :disabled="editado.escombo==1"
                                      :color="temas.forms_titulo_bg"
                                      label="Oferta a Revendedores">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </v-card>
                              <!-- OFERTAS AL PUBLICO FINAL -->
                              <v-card class="fg pa-2 pt-5 pb-0" outlined tile v-if="distribuidor">
                                <v-row>
                                  <v-col cols="12" sm="7" class="pt-6 pb-5">
                                    <span>¿Oferta al Publico?</span>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="5" sm="5">
                                    <v-text-field
                                      class="pt-0 pb-0 fg"
                                      v-model="precio.porremmi"
                                      :disabled="editado.escombo==1"
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      label="% Rem.Minorista"
                                      @click="calpre()"
                                      @change="calpre()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="7" sm="7">
                                    <v-text-field
                                      class="pt-0 pb-0 fgb"
                                      v-model="precio.publicomi"
                                      :disabled="editado.escombo==1"
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      readonly
                                      label="Precio al Público Minorista">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>


                          </v-row>
                        </v-tab-item>

                        <v-tab href="#comercializacion" v-if="editado.escombo!=1">
                          Compra / Venta / Stock
                        </v-tab>
                        <v-tab-item value="comercializacion" v-if="editado.escombo!=1">

                          <v-row class="fg pt-6">
                            <v-col cols="12" sm="2">
                              <v-switch
                                label="Se compra"
                                :color="temas.forms_titulo_bg"
                                v-model="precio.secompra">
                              </v-switch>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-autocomplete
                                v-model="editado.unidad_id"
                                :disabled="!elArticuloEsMio"
                                :items="itemsUmCompras"
                                :loading="isLoadingUmCompras"
                                :search-input.sync="searchUmCompras"
                                :color="temas.forms_titulo_bg"
                                item-text="nombre"
                                item-value="id"
                                label="Un.Medida en Compras"
                                placeholder="Escriba para buscar"
                                prepend-icon="mdi-database-search">
                              </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="2">
                              <v-text-field
                                type="number"
                                :color="temas.forms_titulo_bg"
                                v-model="editado.undstock"
                                :disabled="!elArticuloEsMio"
                                maxlength="15"
                                label="Unidades a Stock"
                                @click="calpre()"
                                @change="calpre()">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="2">
                              <v-text-field
                                type="number"
                                :color="temas.forms_titulo_bg"
                                v-model="editado.peso"
                                :disabled="!elArticuloEsMio"
                                maxlength="15"
                                label="Peso (en Kgs)">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row class="pt-0">
                            <v-col cols="12" sm="2">
                              <v-switch
                                label="Viene en envase"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.esenvase">
                              </v-switch>
                            </v-col>
                            <v-col cols="12" sm="2" class="pt-0">
                              <v-text-field
                                class="pt-6"
                                type="number"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.undenvase"
                                label="Un/envase o Un. de venta"
                                @mouseover="ayuda(3)">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row class="pt-0">
                            <v-col cols="12" sm="2">
                              <v-switch
                                label="Se vende"
                                :color="temas.forms_titulo_bg"
                                v-model="precio.sevende">
                              </v-switch>
                            </v-col>
                            <v-col cols="12" sm="2" class="pt-0" v-if="dialogPresentacion">
                              <v-text-field
                                class="pt-6"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.presentacion"
                                label="Nombre Presentación"
                                :counter="15"
                                maxlength="15">
                              </v-text-field>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12" sm="2">
                              <v-switch
                                label="Administra Stock"
                                :color="temas.forms_titulo_bg"
                                v-model="precio.admstock">
                              </v-switch>
                            </v-col>
                            <v-col cols="12" sm="2" class="pt-0">
                              <v-text-field
                                class="pt-6"
                                type="number"
                                :color="temas.forms_titulo_bg"
                                v-model="precio.exmin"
                                label="Ex.Mínima">
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-select class="pt-3"
                                v-model="precio.sinstock"
                                :items="arrSinStock"
                                :color="temas.forms_titulo_bg"
                                :item-color="temas.forms_titulo_bg"
                                label="Cuando no hay stock...">
                              </v-select>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-switch
                                label="Es perecedero"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.esperecedero">
                              </v-switch>
                            </v-col>
                          </v-row>

                        </v-tab-item>

                        <!-- COMBOS/COMPONENTES -->
                        <v-tab href="#combo" v-if="editado.escombo==1">
                          Combo
                        </v-tab>
                        <v-tab-item value="combo" v-if="editado.escombo==1">

                          <v-card class="fg">
                            <v-card-text>
                              <v-container fluid>
                                <v-row>
                                  <v-col cols="1" class="pl-0 pr-1 mt-0 pt-0">
                                    <v-text-field
                                      filled dense label="Código"
                                      hint="Código, Desc, TEXTO"
                                      :disabled="editedIndexComp>-1 || !elArticuloEsMio"
                                      ref="buscar"
                                      :color="temas.forms_titulo_bg"
                                      autofocus
                                      v-model="busArt"
                                      @keyup.esc="cancelaLinea()"
                                      @focus="$event.target.select()"
                                      @change="buscarArt(false)">
<!--                                  @blur="buscarArt(false)">-->
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="4" class="pl-0 pr-1 mt-0 pt-0">
                                    <v-text-field
                                      filled dense label="Nombre/Descripción" disabled
                                      v-model="edComp.nombre">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="1" class="pl-0 pr-1 mt-0 pt-0">
                                    <v-text-field
                                      filled dense label="Cantidad" hint="Cantidad"
                                      :disabled="!elArticuloEsMio"
                                      v-model="edComp.cantidad"
                                      ref="cantidad"
                                      @change="cantidadItem()"
                                      @keyup.esc="cancelaLinea()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="2" sm="2" md="2" class="pl-0 pr-1 mt-0 pt-0">
                                    <v-text-field
                                      filled dense label="Precio S/IVA" disabled
                                      v-model="edComp.precio">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="1" class="pl-0 pr-1 mt-0 pt-0">
                                    <v-text-field
                                      filled dense label="% Desc." hint="% de Descuento"
                                      :disabled="!elArticuloEsMio"
                                      v-model="edComp.tasadescuento"
                                      @focus="$event.target.select()"
                                      @change="cantidadItem()"
                                      @blur="guardarItem()"
                                      @keyup.esc="cancelaLinea()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="1" class="pl-0 pr-1 mt-0 pt-0">
                                    <v-text-field
                                      filled dense label="Imp.Descuento" disabled
                                      v-model="edComp.importedescuento">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="2" class="pl-0 pr-1 mt-0 pt-0">
                                    <v-text-field
                                      filled dense label="TOTAL" disabled
                                      v-model="edComp.total">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                                <v-row class="pb-0">
                                  <v-col v-show="seleccionarArticulo == true"
                                    cols="12" sm="12" md="12">
                                    <v-data-table
                                      class="elevation-3 pt-0 pb-0"
                                      :headers="headersSelArt"
                                      :color="temas.forms_titulo_bg"
                                      :items="selArt"
                                      dense
                                      single-select
                                      @click:row="selArtClick"
                                      :footer-props="{
                                        itemsPerPageOptions: [10],
                                        showFirstLastPage: true,
                                        showCurrentPage: true,
                                        nextIcon: 'mdi-arrow-right-drop-circle-outline',
                                        prevIcon: 'mdi-arrow-left-drop-circle-outline',
                                      }">
                                      <template v-slot:item.precio="{ item }">
                                        <span disable
                                          dark>${{ formatoImporte(item.precio) }}
                                        </span>
                                      </template>
                                    </v-data-table>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <div class="pl-0 pr-0">
                                    <v-data-table
                                      :headers="headersArt"
                                      :items="editado.componentes"
                                      dense
                                      class="elevation-1 pr-0 ml-0"
                                      :footer-props="{
                                        itemsPerPageOptions: [6],
                                        showFirstLastPage: true,
                                        showCurrentPage: true,
                                        nextIcon: 'mdi-arrow-right-drop-circle-outline',
                                        prevIcon: 'mdi-arrow-left-drop-circle-outline',
                                      }"
                                      @click:row="editarComponente">
                                      <template #item.componente.nombre="{ value }">
                                        <div
                                          class="text-truncate"
                                          style="max-width: 245px">
                                          {{ value }}
                                        </div>
                                      </template>

                                      <template v-slot:item.cantidad="{ item }">
                                        <span>{{ formatoImporte(item.cantidad) }}</span>
                                      </template>

                                      <template v-slot:item.componente.precios[0].precio="{ item }">
                                        <span>
                                          $ {{ formatoImporte(item.componente.precios[0].precio) }}
                                        </span>
                                      </template>

                                      <template v-slot:item.tasadescuento="{ item }">
                                        <span>%{{ formatoImporte(item.tasadescuento) }}</span>
                                      </template>

                                      <template v-slot:item.importedescuento="{ item }">
                                        <span>${{ comboImporteDescuento(item) }}</span>
                                      </template>

                                      <template v-slot:item.total="{ item }">
                                        <span>${{ comboImporteTotal(item) }}</span>
                                      </template>

                                      <template v-slot:item.accion="{item}">
                                        <v-tooltip bottom v-if="elArticuloEsMio">
                                          <template v-slot:activator="{ on }">
                                            <v-btn
                                              fab x-small
                                              :color="temas.cen_btns_bg"
                                              :dark="temas.cen_btns_dark==true"
                                              class="mr-2"
                                              @click="editarComponente(item)"
                                              v-on="on">
                                              <v-icon dark>mdi-pencil</v-icon>
                                            </v-btn>
                                          </template>
                                          <span>Editar</span>
                                        </v-tooltip>

                                        <v-tooltip bottom  v-if="elArticuloEsMio">
                                          <template v-slot:activator="{ on }">
                                            <v-btn
                                              fab x-small
                                              :color="temas.cen_btns_bg"
                                              :dark="temas.cen_btns_dark==true"
                                              class="mr-2"
                                              @click="borrarItem(item)" v-on="on">
                                              <v-icon dark>mdi-delete</v-icon>
                                            </v-btn>
                                          </template>
                                          <span>Borrar</span>
                                        </v-tooltip>

                                      </template>
                                    </v-data-table>
                                  </div>
                                </v-row>

                                <v-row>
                                  <v-col cols="2" sm="2" md="2" class="pt-4">
                                    <v-text-field
                                      readonly outlined
                                      v-model="computedTotalCostos"
                                      label="Total Costo Combo">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="2" sm="2" md="2" class="pt-4">
                                    <v-text-field
                                      readonly outlined
                                      v-model="computedTotalRemarc"
                                      label="Total Remarcación">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="2" sm="2" md="2" class="pt-4">
                                    <v-text-field
                                      readonly outlined
                                      v-model="computedTotalPrecios"
                                      label="Costo + Remarcación">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="2" sm="2" md="2" class="pt-4">
                                    <v-text-field
                                      readonly outlined
                                      v-model="computedTotalDesc"
                                      label="Total Desc.en Combo">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="2" sm="2" md="2" class="pt-4">
                                    <v-text-field
                                      readonly outlined
                                      v-model="computedTotalItems"
                                      label="Total Combo">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="2" sm="2" md="2" class="pt-4">
                                    <v-text-field
                                      readonly outlined
                                      v-model="computedRemarcFinal"
                                      label="Remarcación Final">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                              </v-container>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>
                      </v-tabs>
                    <!--</v-container>-->
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

            <!-- EDICION DE PRESENTACIONES-->
            <v-dialog v-model="dialogPresentacion" :fullscreen="true"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card class="fg">
                <v-toolbar text
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelarPresentacion">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="fg">
                    ARTICULO PRESENTACION ->
                    {{ itemActual != undefined ? itemActual.codigo : '' }} -
                    {{ itemActual != undefined ? itemActual.nombre : '' }} -
                    {{ itemActual != undefined ? itemActual.presentacion : '' }}
                  </span>
                  <v-spacer></v-spacer>
                  <div>
                    <v-btn
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="guardar(true)">
                      Guardar
                    </v-btn>
                  </div>
                </v-toolbar>
                <v-form ref="form">
                  <v-card-text>
                <!--<v-container>-->
                      <v-row>
                        <v-col cols="12" sm="1">
                          <v-text-field
                            disabled
                            v-model="editado.id"
                            label="ID"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                          <v-text-field
                            disabled
                            v-model="editado.codigo"
                            label="Codigo"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="16" sm="6">
                          <v-text-field
                            ref="nombre"
                            v-model="editado.nombre"
                            :autofocus="(editedIndex===0)"
                            label="Nombre"
                            required
                            :color="temas.forms_titulo_bg"
                            :rules="nombreRules"
                            :counter="80"
                            maxlength="80">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.creador.username"
                            label="Creador">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                          <v-switch
                            label="Activo"
                            :color="temas.forms_titulo_bg"
                            v-model="precio.activo">
                          </v-switch>
                        </v-col>
                      </v-row>

                      <v-tabs background-color="white" :color="temas.forms_titulo_bg" class="fg">
                        <v-tab href="#general">
                          Datos Generales
                        </v-tab>
                        <v-tab-item value="general">
                          <v-row no-gutters>
                            <v-col cols="12" sm="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row class="pt-5">
                                  <v-col cols="6" sm="6">
                                    <v-text-field
                                      ref="nombre"
                                      v-model="editado.codbar"
                                      label="Código de Barra"
                                      :color="temas.forms_titulo_bg"
                                      required
                                      :counter="14"
                                      maxlength="14"
                                      class="pt-0 pb-0">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="6" sm="6" class="pt-0 pb-0">
                                    <barcode
                                      :tag="tag" width=1 height=38 fontSize=14
                                      :value="editado.codbar">
                                    </barcode>
                                  </v-col>
                                </v-row>

                              </v-card>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row>
                                  <v-col cols="12" sm="6">
                                    <v-text-field
                                      type="number"
                                      disabled
                                      v-model="unidadesPadre"
                                      label="Unds.Padre"
                                      :color="temas.forms_titulo_bg"
                                      @change="calpre()"
                                      @mouseover="ayuda(1)">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="8">
                                    <v-autocomplete
                                      v-model="editado.unidad_id"
                                      :items="itemsUmCompras"
                                      :loading="isLoadingUmCompras"
                                      :search-input.sync="searchUmCompras"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      item-text="nombre"
                                      item-value="id"
                                      label="UM Presentación"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search"
                                      @mouseover="ayuda(1)">
                                    </v-autocomplete>
                                  </v-col>
                                  <v-col cols="12" sm="4">
                                    <v-text-field
                                      type="number"
                                      :disabled="!elArticuloEsMio"
                                      v-model="editado.undenvase"
                                      label="Unds.Pres."
                                      :color="temas.forms_titulo_bg"
                                      min="1"
                                      :max="unidadesPadre"
                                      @click="calpre()"
                                      @change="calpre()"
                                      @mouseover="ayuda(1)">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="6">
                                    <v-text-field
                                      disabled
                                      v-model="precio.coef"
                                      label="Coeficiente (desc/stk)"
                                      :color="temas.forms_titulo_bg">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-text-field
                                      disabled
                                      v-model="precioPadre"
                                      label="Precio del Padre S/IVA">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="4">
                                    <v-text-field
                                      type="number"
                                      class="caption"
                                      label="%Remarcación2"
                                      min="1"
                                      v-model="precio.porrem"
                                      @click="calpre()"
                                      @change="calpre()">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-text-field
                                      disabled
                                      v-model="precio.precio"
                                      label="PRECIO NETO">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-text-field
                                      disabled
                                      v-model="precio.publico"
                                      label="PRECIO AL PUBLICO">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-tab-item>
                      </v-tabs>
                <!--</v-container>-->
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>

          <!-- Barra de búsqueda  -->
          <v-container>
            <v-row class="pt-4">
              <v-col cols="12" sm="4">
                <v-select
                  class="fg pt-2"
                  label="Dónde Buscar..."
                  v-model="userArticulosId"
                  :items="articulosPorUser"
                  :color="temas.forms_titulo_bg"
                  :item-color="temas.forms_titulo_bg"
                  item-value="id"
                  item-text="nombre"
                  @change="seleccionoCreador()">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  class="fg pt-2"
                  v-model="search"
                  :color="temas.forms_titulo_bg"
                  append-icon="search"
                  label="Buscar"
                  required clearable counter
                  single-line hide-details
                  @click:clear="limpiarTextoBuscar">
                </v-text-field>
              </v-col>
              <v-col class="pt-5" cols="12" sm="2">
                <v-btn
                  :color="temas.forms_titulo_bg"
                  class="fg85" dark
                  @click="listarHTTP()">
                  Buscar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </template>

        <template v-slot:item.codigo="{ item }">
          <span class="fg">{{ item.codigo }}</span>
          <v-badge v-if=
            "item.codigo.substring(0, item.codigo.indexOf('@'))!=item.codigoprov&&
            item.codigoprov!=null"
            class="pt-3"
            :content="'m'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>

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
          {{ sayStock(item) }}
          <!--<span class="fg">{{ formatoImporte(item.stock) }}</span>-->
        </template>

        <template v-slot:item.creador="{ item }">
          <span class="fg">{{ item.creador }}</span>
        </template>
        <template v-slot:item.nombre="{ item }">
          <span class="fg">{{ item.nombre }}</span>
          <v-badge v-if="item.componentes.length>0"
            class="pt-3"
            :content="'combo'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
          <v-badge v-else-if="item.padre_id!=null"
            class="pt-3"
            :content="'pres'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
          <v-badge v-else-if="item.cttpres!=null"
            class="pt-3"
            :content="item.cttpres+' pres'"
            :value="item.cttpres"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>

        <template v-slot:item.activo="{ item }">
          <v-badge v-if="item.precios[0].ofeestado=='A'"
            class="pt-0"
            :content="'ofe'"
            overlap
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
            <v-chip class="fg"
              :color="getColor(item.activo)"
              dark>{{item.activo?'Sí­':'No'}}
            </v-chip>
          </v-badge>
          <v-chip class="fg" v-else
            :color="getColor(item.activo)"
            dark>{{item.activo?'Sí­':'No'}}
          </v-chip>
        </template>

        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-badge
                :content="item.cttfotos"
                :value="item.cttfotos"
                :color="temas.forms_btn_add_bg"
                :dark="temas.forms_btn_add_bg==true" overlap>
                <span slot="badge">{{item.cttfotos}}</span>
                <v-avatar size="30">
                  <v-btn
                    class="mr-0" fab icon small
                    :color="temas.forms_btn_editar_bg"
                    :dark="temas.forms_btn_editar_dark==true"
                    @click="editarFotos(item)" v-on="on">
                    <v-icon>mdi-camera</v-icon>
                  </v-btn>
                </v-avatar>
              </v-badge>
            </template>
            <span>Fotos</span>
          </v-tooltip>
          <v-menu bottom left v-if="item.loTengo||item.padre_id==null">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="setAcciones(item)">
                <v-icon>mdi-dots-vertical</v-icon>
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

          <!-- BADGE CON ANCHO LARGO
          <v-badge overlap top color="red">
            <span slot="badge">63233</span>
            <v-avatar size="40" color="teal">
              <v-btn flat dark fab icon>
                <v-icon>notifications</v-icon>
              </v-btn>
            </v-avatar>
          </v-badge>
          -->

        </template>
      </v-data-table>

      <!-- EDICION DE FOTOS-->
      <v-dialog v-model="dialogFotos" max-width="1000px" max-height="600px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <!-- para el EDICION-->
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="cancelarEditarFotos">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="fg">
              FOTOS DE:
              {{ itemActual != undefined ? itemActual.nombre + ' - ('+itemActual.codigo+')' : '' }}
            </span>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="11" sm="11" md="11" v-if="itemActual.creador_id==userId">
                    <v-file-input
                      v-model="nuevaFoto"
                      filled dense
                      :color="temas.forms_titulo_bg"
                      prepend-icon="mdi-camera">
                      <v-icon>mdi-plus</v-icon>
                    </v-file-input>
                  </v-col>
                  <v-col cols="1" sm="1" md="1" v-if="itemActual.creador_id==userId">
                    <v-btn v-show="nuevaFoto.length!=0"
                      class="ma-2 white--text"
                      x-small fab
                      :color="temas.cen_btns_bg"
                      @click="agregarFotoHTTP(itemActual)">
                      <v-icon dense dark>mdi-content-save</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-container fluid>
                  <v-row v-if="itemActual!=null">
                    <v-col
                      v-for="(foto, i) in fotos" :key="i">
                      <div class="contenedor-galeria">
                        <v-card class="mx-auto my-12" max-width="250">
                          <v-img height="250"
                            :src="getImg(foto)"
                            class="galeria__img">
                          </v-img>
                          <v-divider class="mx-1"></v-divider>
                          <v-card-text >
                            <v-btn v-if="itemActual.creador_id==userId"
                              class="mr-2" fab x-small
                              :color="temas.cen_btns_bg"
                              :dark="temas.cen_btns_dark==true"
                              @click="borrarFotoHTTP(itemActual, foto)">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-card-text>
                        </v-card>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>

              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN EDICION DE FOTOS -->

      <!-- EDICION DE GRUPOS-->
      <v-dialog v-model="dialogGrupos" max-width="600px" max-height="600px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <!-- para el EDICION-->
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="cancelarDialogGrupos">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="fg">
              GRUPO DE
              {{ itemActual != undefined ? itemActual.nombre + ' - ('+itemActual.codigo+')' : '' }}
            </span>
          </v-toolbar>

          <!--
          <v-card max-width="600"
            style="height: 85px;"
            v-scroll.self="onScroll"
            class="overflow-y-auto"
            max-height="600"> -->
            <v-sheet class="pa-4" :color="temas.forms_titulo_bg">
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="searchGrupo"
                    :color="temas.forms_titulo_bg"
                    :dark="temas.forms_titulo_dark==true"
                    label="Ingrese el grupo a buscar"
                    flat
                    solo-inverted
                    hide-details
                    clearable
                    clear-icon="mdi-close-circle-outline">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-sheet>
          <!--</v-card>-->

          <v-form ref="form">
            <v-card-text>
              <v-container>

                <!--
                <v-card max-width="600"
                  style="height: 545px;"
                  v-scroll.self="onScroll"
                  class="overflow-y-auto"
                  max-height="600">
                  <v-sheet class="pa-4" :color="temas.forms_titulo_bg">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="search"
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true"
                          label="Ingrese el grupo a buscar"
                          flat solo-inverted hide-details clearable
                          clear-icon="mdi-close-circle-outline">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-sheet>
                  <v-card-text>
                  -->
                    <v-treeview
                      class="fg"
                      reurn-object
                      item-key="id"
                      :active="active"
                      hoverable
                      activatable
                      dense
                      open-all
                      :filter="filter"
                      :search="searchGrupo"
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      :items="itemsTreeGrupos"
                      @update:active="aceptarGruposAsigna">
                    </v-treeview>

                    <!--
                    <v-treeview
                      return-object
                      item-key="id"
                      hoverable activatable dense
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      :items="itemsTreeGrupos"
                      :search="search"
                      open-all>
                      <template slot="label" slot-scope="{ item }">
                        <span @click="seleccionoGrupo(item)"
                          color="red">
                          {{ item.id }} {{ item.name }} {{ '#'+ item.ctt }}
                        </span>
                      </template>
                    </v-treeview>
                    -->
                    <!--
                  </v-card-text>
                </v-card>
              -->

              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN EDICION DE GRUPOS -->

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
import VueBarcode from 'vue-barcode';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from './Forms/confirmacion.vue';

export default {
  components: {
    SBar,
    Confirmacion,
    'barcode': VueBarcode,
  },
  data: () => ({
    modelo: 'articulos',
    fechaPrecio: null,
    sayInactivos: 1,
    tasaiva: 0,
    costo: 0,
    costoAnclado: 0,
    elArticuloEsMio: false,
    seleccionarArticulo: false,
    ofeEstados: [
      {estado:'A',nombre:'Sí', sel: false},
      {estado:'I',nombre:'No', sel: true},
//    {estado:'P',nombre:'Pausada', sel: false}
    ],
    rubItems: [],
    itemsTreeGrupos: [],
    nombreDelGrupo: '',
    marItems: [],
    tabObj: [],
    stocks: [],
    acciones: [],
    accionesUnds: [
      {nombre: 'Editar', icon: 'mdi-pencil'},
      {nombre: 'Borrar', icon: 'mdi-delete'}
    ],
    itemActual: {
      user_id: null}
    ,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    articulosPorUser: [],
    userArticulosId: 0,
    grupoSel_id: 0,
    codigoRules: [
      (v) => !!v || 'El código es requerido',
    ],      
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
    ],
    decimalRule: [
      (v) => (v >= 0 && v <= 5) || 'El valor debe estar entre 0 y 5'
    ],
    tag: 'svg',
    busArt: '',
    optBarcode: {
      lineColor: '#ff7069',
      fontSize: 20,
      font: 'Courier',
      width: 2,
      height: 30,
      marginBottom: 30,
      format: 'MSI',
      background: '#ccffff'
    },
    arrSinStock: [ 'Avisar y Bloquear', 'Avisar y Continuar', 'Ignorar' ],
    active: [],
    fotos: [],
    unds: [
      {des:50,has:100,desc:3},
      {des:101,has:200,desc:5},
      {des:201,has:500,desc:7},
    ],
    nuevaFoto: [],
    ivaTasas: [],
    verCargarFoto: false,
    searchUmCompras: '',       // para el cuadro de busqueda de datatables
    searchAfipIVA: '',         // para el cuadro de busqueda de datatables
    searchMarcas: '',          // para el cuadro de busqueda de datatables
    searchMoneda: '',          // para el cuadro de busqueda de datatables
    searchGrupo:  null,
    search: '', 
    snackbar: false,           // para el mensaje del snackbar
    textSnack: 'texto',        // texto que se ve en el snackbar
    dialog: false,
    dialogStk: false,
    dialogPresentacion: false,
    dialogFotos: false,
    dialogGrupos: false,
    
    ////////////////////////////////////
    // PARA EL DATATABLE ///////////////
    ////////////////////////////////////
    items: [],
    componentes: [],
    totalCostos: 0,
    totalRemarc: 0,
    totalDesc: 0,
    totalItems: 0,
    totalPrecios: 0,
    //precioPorcion: 0,
    loading: false,
    pagination: { page: 1 },
    headers: [
      { text: 'CODIGO', value:'codigo', sortable: false, width: 160},
      { text: 'NOMBRE', value:'nombre', sortable: false, width: 620},
//    { text: 'CREADOR', value:'creador', sortable: false, width: 90},
//    { text: 'GRUPO', value:'nomgru', sortable: false, width: 100},
//    { text: 'MARCA', value:'nommar', sortable: false, width: 100},
      { text: 'PR.PUBLICO', value:'final', sortable: false, align: 'end', width: 250},
      { text: 'STOCK', value:'stock', sortable: false, align: 'end', width: 70},
//    { text: 'Modificado hace...', value:'precios[0].updatedAt', sortable: false, align: 'left', width: 110},
      { text: 'ACTIVO', value:'activo', sortable: false, align: 'end', width: 60},
//    { text: 'PUBLICADO', value:'cttpub', sortable: false},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersStk: [
      { text: 'SUCUSRAL', value:'sucursal'},
      { text: 'DEPOSITO', value:'deposito'},
      { text: 'EXISTENCIA', value:'existencia'},
    ],
    /*
    headersComponentes: [
      { text: 'Código',   value:'componente.codigo', align: 'left', width: 150},
      { text: 'Nombre',   value:'componente.nombre', align: 'left', width: 300},
      { text: 'Cantidad', value:'cantidad', sortable: false, align: 'end', width: 120},
      { text: 'Pr.S/IVA', value:'precio', sortable: false, align: 'end', width: 120},
      { text: '%Dto.',    value:'tasadescuento', sortable: false, align: 'end', width: 120},
      { text: 'Imp.Dto.', value:'importedescuento', sortable: false, align: 'end', width: 120},
      { text: 'Total',    value:'total', sortable: false, align: 'end', width: 120},
    ],
    */
    headersArt: [
      { text: 'Código',   value:'componente.codigo', align: 'left', width: 130},
      { text: 'Nombre',   value:'componente.nombre', align: 'left', width: 333},
      { text: 'Cantidad', value:'cantidad', align: 'end', width: 100},
      { text: 'Pr.S/IVA', value:'componente.precios[0].precio', align: 'end', width: 110},
      { text: '%Dto.',    value:'tasadescuento', align: 'end', width: 70},
      { text: 'Imp.Dto.', value:'importedescuento', align: 'end', width: 100},
      { text: 'Total',    value:'total', align: 'end', width: 150},
      { text: 'Acciones', value:'accion', sortable: false },
    ],
    headersSelArt: [
      { text: 'ID', value:'id'},
      { text: 'CODIGO', value:'codigo'},
      { text: 'NOMBRE', value:'nombre'},
      { text: 'PRECIO', value:'precio', align: 'end', width: 100},
    ],
    headersUnds: [
      { text: 'Des', value:'des', align: 'end', width: 60},
      { text: 'Has', value:'has', align: 'end', width: 60},
      { text: '%Desc', value:'desc', align: 'end', width: 60},
      { text: 'Ops', value:'accion', align: 'left', sortable: false, width: 50 },
    ],
    selArt: [],
    editedIndex: -1,
    editedIndexComp: -1,
    editado: {
      id: null,
      codigo: null,
      codbar: null,
      codigoprov: null,
      nombre: null,
      rubro_id: null,
      creador_id: null,
      padre_id: null,
      unidad_id: null,
      moneda_id: null,
      iva_id: null,
      peso: null,
      undstock: null,
      esenvase: null,
      undenvase: null,
      presentacion: null,
      esperecedero: null,
      escombo: null,
      descripcion: null,
      activo: true,
      creador: '',
      componentes: [],
      fotos: [],
      updated_at: null,
      stock: null,
    },
    defaultItem: {
      id: null,
      codigo: null,
      codbar: null,
      codigoprov: null,
      nombre: null,
      rubro_id: null,
      creador_id: null,
      padre_id: null,
      unidad_id: 1,
      moneda_id: 51,
      iva_id: 5,
      peso: 0,
      undstock: 1,
      esenvase: 0,
      undenvase: 1,
      presentacion: '',
      esperecedero: 0,
      escombo: 0,
      descripcion: '',
      activo: true,
      creador: '',
      componentes: [],
      fotos: [],
      updated_at: null,
      stock: null,
    },
    edComp: {
      id: null,
      articulo_id: null,
      componente_id: null,
      codigo: null,
      nombre: null,
      costo: 0,
      porrem: 0,
      precio: 0,
      decimales: 0,
      tasadescuento: 0,
      importedescuento: 0,
      cantidad: 0,
      total: 0,
    },
    edCompDefault: {
      id: null,
      articulo_id: null,
      componente_id: null,
      codigo: null,
      nombre: null,
      costo: 0,
      porrem: 0,
      precio: 0,
      decimales: 0,
      tasadescuento: 0,
      importedescuento: 0,
      cantidad: 0,
      total: 0,
    },
    unidadesPadre: null,
    costoPadre: null,
    precioPadre: null,
    precio: {
      id: 0,
      padre_id: null,
      decimales: 0,
      decimalesViejo: 0,
      coef: 0,
      precioPadre: 0,
      costooriginal: 0,
      desc1: 0,
      desc2: 0,
      costo: 0,
      costoViejo: 0,
      porrem: 0,
      porremmi: 0,
      porremViejo: 0,
      precio: 0,
      publico: 0,
      publicomi: 0,
      secompra: true,
      sevende: true,
      usd: 0,
      grupo_id: 0,
      marca_id: 0,
      admstock: 0,
      exmin: 0,
      sinstock: '',
      activo: '',
      updatedAt: null,

      ofetasadescuento: 0,
      ofeimportedescuento: 0,
      ofeprecio: 0,
      ofepreciofinal: 0,
      ofeunidades: 0,
      ofevendidas: 0,
      ofevencimiento: 0,
      ofeestado: 0,

    },
    descriptionLimit: 60,
    //entriesRubros: [],
    entriesGrupos: [],
    entriesUmCompras: [],
    entriesUmStock: [],
    entriesAfipIVA: [],
    entriesMarcas: [],
    entriesMoneda: [],
    //isLoadingRubros: false,
    isLoadingMarcas: false,
    isLoadingGrupos: false,
    isLoadingUmCompras: false,
    isLoadingAfipIVA: false,
    isLoadingMoneda: false,
    ancladoAlDolar: false,
    itemsArticulos: [],
    origArticulos: [],
    scrollInvoked: 0,

    soloArtComprados: false,

  }),
  /*
  components: {
    'barcode': VueBarcode
  },
  */
  computed: {
    // Dependiendo si es Alta o Edición cambia el título del modal
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert','setTerceros']),
    ...mapState([
      'vinculosPadres', 'vinculosHijos', 'vinculosPadresLic', 'vinculosPadresAll', 'temas', 'sucursalDemo', 'externo',
      'tipo', 'porrev', 'dolar', 'anclarCostos', 'desanclarAutomaticamente', 'codigooid', 'cttLoadReg', 'descuentos',
      'transition', 'distribuidor', 'verSoloArtComprados', 'exclusivoDe'
    ]),

    filter () {
      return undefined 
    },

    formTitle () {
      if (this.editado.escombo==1) {
        return this.editedIndex === -1 ? 'Nuevo Combo' : 'Editar Combo';
      } else {
        return this.editedIndex === -1 ? 'Nuevo Artí­culo' : 'Editar Artí­culo';
      }
    },

    porRem(item) {
      return 'Precio S/IVA ('+item.porrem+'% Rem)'
    },

    formTitleComponentes () {
      return this.editedIndex === -1 ? 'Nuevo Componente' : 'Editar Componente';
    },

    itemsUmCompras () {
      return this.entriesUmCompras.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    itemsAfipIVA () {
      return this.entriesAfipIVA.map(entry => {
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

    itemsMoneda () {
      return this.entriesMoneda.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    computedTotalCostos() {
      return '$'+this.formatoImporte(this.totalCostos)
    },

    computedTotalRemarc() {
      return '$'+this.formatoImporte(this.totalRemarc)
    },

    computedTotalPrecios() {
      return '$'+this.formatoImporte(this.totalPrecios)
    },

    computedTotalDesc() {
      return '$'+this.formatoImporte(this.totalDesc)
    },
    
    computedTotalItems() {
      return '$'+this.formatoImporte(this.totalItems)
    },

    computedRemarcFinal() {
      return '%'+this.formatoImporte(((this.totalItems/this.totalCostos)-1)*100)
    },

    calculoRentabilidad() {
      let a = Number(this.precio.ofeprecio)
      let b = Number(this.precio.costo)
      let c = ((a*100)/b)-100
      let d = this.roundTo((((a-b)))*this.precio.ofeunidades,2)
      return '%'+this.roundTo(c,2)+' / $'+this.formatoImporte(this.roundTo(d,2))
//    return '%'+this.roundTo(c,2)+' / $'+this.formatoImporte(this.roundTo(d,2))
      /*
      if (this.precio.precio!=0&&this.precio.costo!=0) {
        return '%'+this.roundTo(((Number(this.precio.ofeprecio)/Number(this.precio.precio))-1)*100,2)+' / $'+this.formatoImporte(this.roundTo((((Number(this.precio.ofeprecio)-Number(this.precio.costo))-1))*this.precio.ofeunidades,2))
      } else {
        return 0
      }
      */
    }

  },

  watch: {
    searchUmCompras (val) {
      if (this.isLoadingUmCompras) return
      this.isLoadingUmCompras = true
      return HTTP().get('/unidades').then(({ data }) => {
        this.entriesUmCompras = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingUmCompras = false))
    },

    searchAfipIVA (val) {
      if (this.isLoadingAfipIVA) return
      this.isLoadingAfipIVA = true
      return HTTP().get('/afipiva').then(({ data }) => {
        this.entriesAfipIVA = data
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingAfipIVA = false))
    },

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

    searchMoneda (val) {
      if (this.isLoadingMoneda) return
      this.isLoadingMoneda = true
      return HTTP().get('/afipmonedas').then(({ data }) => {
        this.entriesMoneda = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMoneda = false))
    },
  },

  mounted () {
    if (!this.isLoggedIn) {
      return router.push('/login');

    } else {

      return HTTP().get('/afipiva').then(({ data }) => {
        this.ivaTasas = []
        for (let i=0; i<=data.length-1; i++) {
          this.ivaTasas.push(data[i])
        }
        return HTTP().get('/usersrubros').then(({ data }) => {
          this.rubItems = []
          data.forEach(e => {
            this.rubItems.push({id: e.rubro.id, nombre: e.rubro.nombre})
          })

          let v = this.cargoV();
          return HTTP().post('/articulosporusers', {vinculospadres: v}).then(({ data })=>{
            let totart = 0
            this.articulosPorUser = []
            for(let i=0; i<=data.length-1; i++) {
              totart += data[i].articulos
              if (data[i].creador_id == this.userId && data[i].padre_id==null) {
                this.articulosPorUser.push({
                  id: data[i].creador_id, 
                  nombre: 'Mis Artí­culos ('+data[i].articulos+')',
                  articulos: data[i].articulos 
                })
              }
            }
            if (data.length>1) {
              this.articulosPorUser.push({
                id: 0, 
                nombre: 'TODOS ('+totart+')',
                articulos: totart
              })
            }
            for (let i=0; i<=data.length-1; i++) {
              if (this.articulosPorUser.findIndex(x=>x.id==data[i].creador_id) ==-1) {
                this.articulosPorUser.push({
                  id: data[i].creador_id,
                  nombre: data[i].username+' ('+data[i].articulos+')',
                  articulos: data[i].articulos
                })
              }
            }

            // gilgamesh021201
            debugger
            if (this.exclusivoDe.id) {
              this.userArticulosId = this.exclusivoDe.id
            } else {
              if (this.articulosPorUser.length>1) {
                this.userArticulosId = 0
              } else {
                this.userArticulosId = this.userId
              }
            }
            this.headers[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
            this.headers[0].value = this.$store.state.codigooid == 'C'?'codigo':'id'

            debugger
            this.soloArtComprados = this.$store.state.verSoloArtComprados;

            this.listarHTTP()
          })
        })
      })
    }
  },

  methods: {
    closeForm(){
      router.push('/')
    },

    limpiarTextoBuscar() {
      this.search = ''
      this.listarHTTP()
    },

    elAnclaEsMenor(item) {
      let ret = (this.roundTo(this.dolar*item.usd,5) < item.costo)
      ret
    },

    fechadelprecio (fecha) {
      return moment(fecha).fromNow(true);
    },

    setOferta(item) {
      for (let i=0; i<=1; i++) {
        this.ofeEstados[i].sel = i==item?true:false
      }
      if (item==0) {
        this.precio.ofeestado = 'A'
      } else if (item==1) {
        this.precio.ofeestado = 'I'
//    } else if (item==2) {
//      this.precio.ofeestado = 'P'
      }
    },

    getImg(item) {
      return 'images/'+item.foto
    },

    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      if (item.loTengo) {
        this.acciones.push({nombre: 'Editar', icon: 'mdi-pencil'})
      }
      if (this.habDel(item)) {
        this.acciones.push({nombre: 'Borrar', icon: 'mdi-delete'})
      }
      if (this.userId==item.creador_id) {
        this.acciones.push({nombre: item.activo ?'Desactivar':'Activar', icon: 'mdi-checkbox-marked-outline'})
      }
      if (item.padre_id==null) {
        this.acciones.push({nombre: 'Crear Presentación', icon: 'mdi-dice-multiple'})
      }
//    if (item.creador_id!=this.userId && item.loTengo) {
//      this.acciones.push({nombre: 'Asignar/Editar Código Propio', icon: 'mdi-vector-difference-ba'})
//    }
      this.acciones.push({nombre: 'Stock', icon: 'mdi-table-column'})
    },

    increment() {
      this.editado.undenvase ++
    },
    decrement() {
      this.editado.undenvase --
    },

    clickRow(value) {
      if (this.dialogFotos==false) {
        this.itemActual = value
        this.editar(this.itemActual)
      }
    },

    selAccion(item) {
      if (item.nombre=='Editar' || item.nombre=='Ver') {
        this.editar(this.itemActual)
      } else if (item.nombre=='Borrar') {
        this.preguntoBorrar(this.itemActual)
      } else if (item.nombre=='Activar'||item.nombre=='Desactivar') {
        this.activarDesactivar(this.itemActual)
      } else if (item.nombre=='Crear Presentación') {
        this.presentacion(this.itemActual)
      } else if (item.nombre=='Stock') {
        this.verStock(this.itemActual)
      }
    },

    selAccionUnds(item) {
      if (item.nombre=='Editar') {

      } else if (item.nombre=='Borrar') {

      }
    },
  
    habDel(item) {
//    if (item.userid == this.userId) {
      if (item.creador_id == this.userId) {
        return true
      } else {
        return false
      }
    },

    sayEditOrView(item) {
      if (item.creador_id == this.userId) {
        return 'mdi-pencil' 
      } else {
        return 'mdi-glasses'
      }
    },
    
    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },
    
    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',');
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    formatoImporteMoneda(value, moneda) {
      let val = (value/1).toFixed(2).replace('.', ',')
      let x = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      let m = (moneda==51) ? '$ ' : 'us$ '
      return m + x
    },
    
    verStock(item) {
      this.dialogStk = true;
      return HTTP().get('/depositos').then(({ data }) => {
        this.stocks = [];
        for (let i=0; i<=data[0].sucursales.length-1; i++) {
          for (let j=0; j<=data[0].sucursales[i].depositos.length-1; j++) {
            this.stocks.push({
              sucursal: data[0].sucursales[i].nombre,
              deposito: data[0].sucursales[i].depositos[j].nombre,
              deposito_id: data[0].sucursales[i].depositos[j].id,
              existencia: 0
            })
          }
        }
        let id = this.editado.id
        let stockTotal = 0
        if (item) {
          id = item.id
        }
        return HTTP().get('/stocks/'+id).then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            for (let j=0; j<=this.stocks.length-1; j++) {
              if (this.stocks[j].deposito_id===data[i].deposito_id) {
                this.stocks[j].existencia = data[i].stock
                stockTotal += data[i].stock
              }
            }
          }
          if (item) {
            this.msg.msgTitle = 'Stock'
            let msg = 'Artículo: '+item.codigo+'<br>'
            msg += 'Nombre: '+ item.nombre+'<br><br>'
            msg += 'Stock: <b>'+ stockTotal+'</b><br><br>'
            this.msg.msgBody = msg
            this.msg.msgVisible = true
            this.msg.msgAccion = 'Stock'
            this.msg.msgButtons = ['Aceptar']
          }
        })
      }).catch((err)=>{
        console.log(err);
      })
    },

    costoAncladoAlDolar() {
      if (this.ancladoAlDolar) {
        this.precio.usd = this.roundTo(this.precio.costo / this.dolar,6)
//      let dec = (this.precio.costo+"").split(".")[1];
//      this.costoAnclado = this.precio.usd==0 ? 0 : this.roundTo(this.precio.usd * this.dolar,dec.length)
        this.costoAnclado = this.roundTo(this.precio.costo, this.precio.decimales)
      } else {
        this.precio.usd = 0
        this.costoAnclado = 0
      }
    },

    calpre() {
      if (this.editado.escombo==1 && this.elArticuloEsMio) { return }
      if (this.entriesAfipIVA.length>0) { // es porque entro desde ALTA DE UN NUEVO ARTICULO
        let pos = this.entriesAfipIVA.map(function(e) { return e.id; }).indexOf(this.editado.iva_id);
        this.tasaiva = this.itemsAfipIVA[pos].tasa
      } else {
        this.tasaiva = this.editado.tasa
      }
      this.precio.decimales = Number(this.precio.decimales)
      this.precio.coef = this.roundTo(Number(this.editado.undenvase)/Number(this.unidadesPadre),6)
      if (this.dialogPresentacion) {
        this.precio.costo = this.roundTo((this.precioPadre*this.precio.coef), 5)
        this.precio.precio  = this.roundTo(this.precio.costo*(1+(this.precio.porrem/100)), 5)
        this.precio.publico = this.roundTo(this.precio.precio*(1+(this.tasaiva/100)),this.precio.decimales)
      } else {
        //this.precio.costo = this.roundTo((this.costoPadre/this.unidadesPadre)*this.editado.undenvase, 4)
        this.precio.precio  = this.roundTo(this.precio.costo*(1+(this.precio.porrem/100)), 5)
        this.precio.publico = this.roundTo(this.precio.precio*(1+(this.tasaiva/100)),this.precio.decimales)
      }
      if (this.precio.ofetasadescuento) {
        this.precio.ofeimportedescuento = this.roundTo(this.precio.precio*(Number(this.precio.ofetasadescuento)/100),this.precio.decimales)
        this.precio.ofeprecio = this.roundTo(this.precio.precio-this.precio.ofeimportedescuento,this.precio.decimales)
        this.precio.ofepreciofinal = this.roundTo(this.precio.ofeprecio*(1+(this.tasaiva/100)),this.precio.decimales)
      } else {
        this.precio.ofeimportedescuento = 0
        this.precio.ofeprecio = 0
        this.precio.ofepreciofinal = 0
      }
      this.precio.publicomi = 0
      if (this.precio.porremmi!=0) {
        this.precio.publicomi = this.precio.precio*(1+(this.precio.porremmi/100))
        this.precio.publicomi = this.roundTo(this.precio.publicomi * (1+(this.tasaiva/100)),this.precio.decimales)
      }
    },

    seleccionoCreador() {
      this.listarHTTP()
    },
    
    pausarActivarOfertas(activar) {
      return HTTP().post('/activarpausarofertas',  { activar: activar, accion: 'revisar' }).then(({ data }) => { 
        this.msg.msgTitle = 'OFERTAS'
        let ctt = data.ctt[0].ctt
        let avi = activar?'Activar':'Desactivar'
        let acc = activar?'Activar Ofertas':'Desactivar Ofertas'

        if (data.ctt[0].ctt>0) {

          let m = '<br>Vas a ' + avi + ' ' + data.ctt[0].ctt + ' ofertas.<br><br>¿Confirmas?'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = acc
          this.msg.msgButtons = ['Aceptar','Cancelar']

        } else {

          let m = 'No hay Ofertas para '+avi
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'no hay articulos para '+avi
          this.msg.msgButtons = ['Aceptar']

        }

      })
    },

    nuevoArticulo(escombo) {
      this.editedIndex = -1;
      this.dialog = true;
      this.editado = Object.assign({}, this.defaultItem);
      this.editado.activo = true;
      //this.editado.rubros = this.rubItems;

      //ASIGNO AL ART LOS RUBROS AL QUE PERTENECE EL USUARIO
      this.editado.fotos = [];
      this.editado.escombo = escombo;
      this.stocks = [];
      this.dialogStk = false;
      this.costo = 0;
      this.elArticuloEsMio = true;
      this.unidadesPadre = 1;
      this.precioPadre = 0;
      this.costoPadre = 0;
      this.editado.componentes = [];
      this.precio.coef = 1;
    },

    cantidadItem() {
      let desc = 0
      desc = (Number(this.edComp.cantidad)*Number(this.edComp.precio))
      desc = desc * (Number(this.edComp.tasadescuento)/100)
      this.edComp.importedescuento = this.roundTo(desc,2)
      this.edComp.total = this.roundTo((Number(this.edComp.cantidad)*Number(this.edComp.precio))-desc,2)
      return this.edComp.total
    },

    presentacion( item ) {

      debugger
      return HTTP().post('/articuloz', {
        search: this.itemActual.codigo,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: true, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: this.cttLoadReg }).then(({ data })=>{

        debugger
        this.editedIndex = -1
        this.elArticuloEsMio = true //item.userid == this.userId
        this.editado = Object.assign({}, data[0]);
        this.editado.activo = true
        this.editado.codigo = this.editado.codigo.substring(0, this.editado.codigo.indexOf('@'))
        this.editado.undstock = this.editado.undenvase
        this.editado.updated_at = moment(this.editado.updated_at).format('YYYY-MM-DD HH:mm:ss')
        this.dialog = false;
        this.dialogPresentacion = true;
        this.unidadesPadre = this.editado.undenvase
        this.costoPadre = data[0].precios[0].costo
        this.precioPadre = data[0].precios[0].precio

        // CARGO EL PRECIO
        this.cargoPrecios( data )

        // CARGO RUBROS Y PRECIOS DEL ARTICULO
        //this.rubValue = []
        this.stocks = []
        this.dialogStk = false;
        this.fotos = this.editado.fotos;
      })
    },

    cargarFotos(sino) {
      this.verCargarFoto = sino;
    },
    
    agregarFoto() {

      debugger

      this.fotos.push({articulo_id: this.editado.id, foto: this.nuevaFoto.name})
      this.verCargarFoto = false
    },

    async agregarFotoHTTP(item) {
      let formData = new FormData();
      formData.append('file', this.nuevaFoto );
      formData.append('articulo_id', this.itemActual.id );
      await HTTP().post('/agregarfoto', formData).then(({ data }) => { 
        this.progress = false
        if (data=='error') {
          this.msg.msgTitle = 'Error'
          let m = 'Se ha producido un error.<br>Revise si el archivo que intenta subir cumple con las reglas'
          m += 'preestablecidas y vuelva a intentar.'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'aceptar'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.fotos.push({articulo_id: this.itemActual.id, foto: this.nuevaFoto.name})      
          this.nuevaFoto = []
          item.cttfotos ++
        }
      })
    },

    borrarFotoHTTP(itemActual, foto) {

      debugger
      if (foto.foto==undefined) {
        alert('hay un problema')
        return
      }

      return HTTP().post('/borrarfoto', { articulofoto_id: foto.id, file: foto.foto }).then(({ data }) => { 
        this.progress = false
        if (data=='error') {
          this.msg.msgTitle = 'Error'
          let m = 'No se ha podido borrar la foto.<br>'
          m += 'Reintente, y si el error persiste consulte con gohu.'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'aceptar'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.fotos.splice(this.fotos.indexOf(foto), 1);
          itemActual.cttfotos --
        }
      })
      /*
      return HTTP().post('/borrarfoto', 
        { articulofoto_id: foto.id } )
        .then(({ data }) => {
          this.fotos.splice(this.fotos.indexOf(foto), 1);
          itemActual.cttfotos --
        })
      */
    },

    activarDesactivar(item) {
      return HTTP().post('articuloactivardesactivar/',{item: item}).then ((res) => {
        item.activo = res.data ? 1 : 0
      }).catch((err)=>{
        console.log(err);
      })
    },

    /*
    generarPublicacion(item) {
      return HTTP().post('/generopublicacion', {
        articulo_id: item.id,
        preciooriginal: item.precio,
        tasadescuento: 0,
        precio: item.precio,
        envio: 0,
        detalles: '',
        unidades: 1,
        vencimiento: moment().format('YYYY-MM-DD'),
        estado: 'I',
        prioridad: 1,       
        }).then(({ data }) => {
          this.mensaje('¡Se ha generado una publicación para este artículo.!', this.temas.forms_titulo_bg, 1500) 
          this.listarHTTP();
        });
    },
    */

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrar(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          alert('exportando a XLS...')
        } else if (this.msg.msgAccion=='Activar Ofertas'||this.msg.msgAccion=='Desactivar Ofertas') {
          let activar = this.msg.msgAccion=='Activar Ofertas'?true:false
          return HTTP().post('/activarpausarofertas',  { activar: activar, accion: 'post' }).then(({ data }) => {
            let m = ''
            if (data=='error') {
              m = 'Se ha producido un error en Activar Ofertas.<br>'
              this.mensaje(m, this.temas.snack_error_bg, 3000)
            } else if (data.ctt.affectedRows>0) {
              m = 'Has '
              m += activar?'activado ':'desactivado '
              m += data.ctt.affectedRows
              m += ' ofertas.'
              this.mensaje(m, this.temas.forms_titulo_bg, 3000) 
            }
            this.msg.msgVisible = false;
            this.listarHTTP();
          })
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

    getColorOferta (sel) {
      return sel ? this.temas.forms_titulo_bg : this.temas.forms_btn_inactivo_bg
    },

    buscoCodigo (event) {
      // who caused it? "event.target.id"
      const cod = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${cod+'@'+this.userId}`).then(({ data }) => {
        if(data) {
          this.mensaje('¡El código ingresado ya existe.!', this.temas.forms_titulo_bg, 1500) 
          this.$refs.codigo.focus()
        }
      });
    },    

    buscarArt(estricto) {
      if (this.busArt == '') return

      debugger
      return HTTP().post('/articuloz', {
        search: this.busArt,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: true, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: false, limit: this.cttLoadReg }).then(({ data })=>{

        debugger
        if (data.length==1) {
          this.edComp.id = data[0].id;
          this.edComp.articulo_id = this.editado.id;
          this.edComp.componente_id = data[0].id;
          this.edComp.codigo = data[0].codigo;
          this.edComp.nombre = data[0].nombre;
          this.edComp.costo = data[0].precios[0].costo;
          this.edComp.porrem = data[0].precios[0].porrem;
          this.edComp.precio = this.roundTo(data[0].precios[0].precio, data[0].precios[0].decimales);
          this.edComp.decimales = data[0].precios[0].decimales;
          this.edComp.tasadescuento = 0;
          this.edComp.importedescuento = 0;
          this.edComp.cantidad = 1;
          this.edComp.total = this.roundTo(this.edComp.precio*this.edComp.cantidad,this.precio.decimales);
          this.$nextTick(() => {
            const f = this.$refs.cantidad;
            f.focus();
          });
          this.seleccionarArticulo = false
        } else if (data.length>1) {
          this.selArt = []
          //this.busArtSave = this.busArt
          for (let i=0; i<=data.length-1; i++) {
            this.selArt.push({
              id:                data[i].id,
              codigo:            data[i].codigo,
              componente_id:     data[i].id,
              nombre:            data[i].nombre,
              precio:            data[i].precios[0].precio,
              tasaIVA:           data[i].tasa,
              tasadesuento:      0,
              importedescuento:  0,
              total:             0,
            })
          }
          this.seleccionarArticulo = true;
        } else {
          this.mensaje('¡Codigo inexistente!', this.temas.forms_titulo_bg, 1000)
          this.$nextTick(() => {
            const f = this.$refs.buscar;
            f.focus();
          });
          return
        }
      })
    },

    cancelaLinea() {
      this.nuevoArt()
      this.busArt = ''
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },

    nuevoArt() {
      this.editedIndexComp = -1;
      this.busArt = ''
      this.edComp = Object.assign({}, this.edCompDefault);
      this.formTitleArt = 'Nuevo Item'
      this.seleccionarArticulo = false;
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },

    guardarItem(item) {
      if (this.edComp.cantidad == 0) {
        this.$nextTick(() => {
          const f = this.$refs.cantidad;
          f.focus();
        });
        return 
      } else if (this.edComp.codigo == '') {
        this.$nextTick(() => {
          const f = this.$refs.buscar;
          f.focus();
        });
        return 
      }
      let pos = this.editado.componentes.findIndex( x => x.componente_id==this.edComp.componente_id )
      // OJO, SI ES PEDIDO HAGO CONTROL DE PROMOCIONES, SI ES FACTURA DE COMPRA CARGO NORMAL.
      this.actualizoItem(pos)
      this.calculos()
      this.nuevoArt()
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });

    },

    calculos() {
      let dec = 0; let ctt = 0; let item = 0; let desc = 0; let costo = 0; let precio = 0; let tasaiva = 0;
      this.totalItems = 0;
      this.totalCostos = 0;
      this.totalRemarc = 0;
      this.totalDesc = 0;
      this.totalPrecios = 0;
      this.precio.costo = 0;
      this.precio.porrem = 0;
      this.precio.precio = 0;
      this.precio.publico = 0;
      for (let i=0; i<=this.editado.componentes.length-1; i++) {

        // Busco en this.editado.componentes[i].componente.precios la posicion del usuario
        //let pos = this.editado.componentes[i].componente.precios.findIndex(x=>x.user_id==this.userId)
        
        ctt = this.editado.componentes[i].cantidad
        dec = this.editado.componentes[i].componente.precios[0].decimales
        costo = this.editado.componentes[i].componente.precios[0].costo
        precio = this.editado.componentes[i].componente.precios[0].precio
        desc = precio*(this.editado.componentes[i].tasadescuento/100)
//      tasaiva = this.editado.componentes[i].componente.iva.tasa
        
        item = (precio-desc)*ctt
        this.precio.costo   += this.roundTo(((precio-desc)*ctt),5);
        this.precio.precio  += this.roundTo(((precio-desc)*ctt),5);
        this.precio.publico += 0; //this.roundTo(((precio-desc)*ctt)*(1+(tasaiva/100)),dec);
        this.totalItems     += this.roundTo(item,dec);
        this.totalCostos    += costo*ctt;
        this.totalPrecios   += precio*ctt;
        this.totalRemarc    += (precio-costo)*ctt;
        this.totalDesc      += desc*ctt;
      }
      dec = this.editado.precios!=undefined?this.editado.precios[0].decimales:2
      this.precio.costo =  this.roundTo(this.precio.costo, 5);
      this.precio.precio = this.roundTo(this.precio.precio, 5);
      let pos = this.ivaTasas.findIndex(x=>x.id==this.editado.iva_id)
      this.precio.publico = this.roundTo(this.precio.precio*(1+(this.ivaTasas[pos].tasa/100)), dec);

    },

    actualizoItem(pos) {
      if (pos==-1) {
        this.editado.componentes.push({
          id:               0,
          articulo_id:      this.editado.id,
          componente_id:    this.edComp.componente_id,
          cantidad:         this.edComp.cantidad,
          tasadescuento:    this.edComp.tasadescuento,
          componente: {
            codigo: this.edComp.codigo,
            nombre: this.edComp.nombre,
            precios: [{
              costo: this.edComp.costo,
              porrem: this.edComp.porrem,
              decimales: this.edComp.decimales,
              precio: this.edComp.precio,
            }],
          },
        })
      } else {
        this.editado.componentes[pos].cantidad = this.edComp.cantidad
        this.editado.componentes[pos].tasadescuento = this.edComp.tasadescuento
      }
    },

    selArtClick (item, row) {
      this.seleccionarArticulo = false;
      this.busArt = item.codigo
      this.buscarArt(true)
      this.$refs.cantidad.focus()
    },

    editarComponente(item) {
      this.formTitleArt = 'Editar Item'
      this.seleccionarArticulo = false;
      this.editedIndexComp = this.editado.componentes.indexOf(item)
      if (this.editedIndexComp==-1) return
      this.busArt = this.editado.componentes[this.editedIndexComp].componente.codigo

//    this.busArt = this.editado.componentes[this.editado.componentes.indexOf(item)].codigo
//    this.edComp = Object.assign({}, this.editado.componentes[this.editedIndexComp] );

      this.edComp.id = this.editado.componentes[this.editedIndexComp].id
      this.edComp.articulo_id = this.editado.componentes[this.editedIndexComp].articulo_id
      this.edComp.componente_id = this.editado.componentes[this.editedIndexComp].componente_id
      this.edComp.cantidad = this.editado.componentes[this.editedIndexComp].cantidad
      this.edComp.codigo = this.editado.componentes[this.editedIndexComp].componente.codigo
      this.edComp.nombre = this.editado.componentes[this.editedIndexComp].componente.nombre

      // Busco en this.editado.componentes[i].componente.precios la posicion del usuario
      //let pos = this.editado.componentes[i].componente.precios.findIndex(x=>x.user_id==this.userId)

      this.edComp.costo = this.editado.componentes[this.editedIndexComp].componente.precios[0].costo*this.edComp.cantidad
      this.edComp.porrem = this.editado.componentes[this.editedIndexComp].componente.precios[0].porrem
      this.edComp.precio = this.editado.componentes[this.editedIndexComp].componente.precios[0].precio
      this.edComp.decimales = this.editado.componentes[this.editedIndexComp].componente.precios[0].decimales
      this.edComp.tasadescuento = this.editado.componentes[this.editedIndexComp].tasadescuento
      this.edComp.importedescuento = (this.edComp.precio*(this.edComp.tasadescuento/100))*this.edComp.cantidad
      this.edComp.total = (this.edComp.precio*this.edComp.cantidad)-this.edComp.importedescuento
      this.$nextTick(() => {
        const f = this.$refs.cantidad;
        f.focus();
      });

//    this.buscarArt(true)
    },

    borrarItem(item) {
      this.busArt = '';
      let pos = this.editado.componentes.indexOf(item);
      this.editado.componentes.splice(pos,1);
      this.calculos();
    },

    listarHTTP:function() {

      /*
      let aux = [
        { id: 5,  articulo_id: 21, user_id: 48, padre_id: 0,    costo: 5.9, porrem: 40, precio: 8.26, decimales: 2},
        { id: 21, articulo_id: 21, user_id:  2, padre_id: 5,    costo: 0,   porrem: 25, precio: 0, decimales: 0},
        { id: 23, articulo_id: 21, user_id: 46, padre_id: 5,    costo: 0,   porrem: 40, precio: 0, decimales: 0},
        { id: 24, articulo_id: 21, user_id:  3, padre_id: 21,   costo: 0,   porrem: 65, precio: 0, decimales: 0},
        { id: 25, articulo_id: 21, user_id:  6, padre_id: 24,   costo: 0,   porrem: 35, precio: 0, decimales: 0},
        { id: 26, articulo_id: 21, user_id:  8, padre_id: 25,   costo: 0,   porrem: 25, precio: 0, decimales: 0},
      ];
      let res = calculoPrecios(aux,0,aux[0].costo)
      function calculoPrecios(arr, padre, costo) {
        let dec = arr[0].decimales
        for(var i in arr) {
          if(arr[i].padre_id === padre) {
            arr[i].costo = costo
            var power = Math.pow(10, dec);
            arr[i].precio = Math.round(costo*(1+(arr[i].porrem/100))*power)/power;
            calculoPrecios(arr, arr[i].id, arr[i].precio);
          }
        }
        return
      }
      */

      /* HUGUITO */
      debugger
      let x = this.userArticulosId!=0&&this.userArticulosId!=this.userId?this.userArticulosId:0
      let z = this.$store.state.cttLoadReg
      let s = this.search!=null&&this.search.length>0 ? this.search : '';
      let v = this.cargoV()

      debugger
      return HTTP().post('/articuloz', {
        search: s, //[21,61283]
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: x, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: this.soloArtComprados, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: this.sayInactivos, limit: this.cttLoadReg }).then(({ data })=>{

        debugger
        if (data.length>0) {
          this.itemActual = data[0]
          this.items = data;
        } else {
          this.items = []
        }
      })
    },

    editarFotos(item) {
      this.itemActual = item
      this.dialogFotos = true
      this.fotos = item.fotos;
    },

    cancelarEditarFotos() {
      this.dialogFotos = false
    },

    cancelarDialogGrupos() {
      this.dialogGrupos = false
    },

    editarHTTP:function(data) {
      data.vinculosHijos = this.vinculosHijos
      return HTTP().patch(`${this.modelo}/${data.id}`, data).then(({data}) => {
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 2500)
        } else if (data=='block articulo') {
          this.mensaje('¡Registro bloqueado por otro usuario, refresque los datos y reintente!', this.temas.snack_error_bg, 3000)
        } else {
          this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500)
        }
        this.listarHTTP()
      });
    },

    borrarHTTP:function(id) {
      return HTTP().delete(`/${this.modelo}/${id}`).then((data) => {
        if (data=='error') {
          this.mensaje('¡Opps, no se ha podido eliminar este artículo!', this.temas.snack_error_bg, 1500)
        } else {
          this.mensaje('¡Artículo eliminado con éxito!', this.temas.forms_titulo_bg, 1500)
        }
        this.listarHTTP();
      });
    },
    
    preguntoBorrar (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      return HTTP().get('/puedoborrararticulo/'+item.id).then(({ data }) => {
        if (data) {
          this.msg.msgTitle = 'Borrar'
          let q = '¿Confirmas borrar este artículo?<br><br>'
          q += 'ID: <b>'+item.id+'</b><br>'
          q += 'Código: <b>'+item.codigo+'</b><br>'
          q += 'Nombre: <b>'+item.nombre+'</b><br><br>'
          q += '<b>Atención</b><br>¡UNA VEZ BORRADO NO PODRÁ SER RECUPERADO!<br>'
          this.msg.msgBody = q
          this.msg.msgVisible = true
          this.msg.msgAccion = 'borrar item'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        } else {
          this.msg.msgTitle = 'No se puede Borrar'
          this.msg.msgBody = 'Este artículo no se puede borrar, posee movimientos!'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'no se puede borrar'
          this.msg.msgButtons = ['Aceptar']
        }
        this.itemActual = item;
      });
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
    
    editar (item) {

      if (!item.loTengo) return

      debugger
      return HTTP().post('/articuloz', {
        search: this.itemActual.codigo,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: true, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: this.cttLoadReg }).then(({ data })=>{

        debugger
        this.editedIndex = this.items.indexOf(item);
        this.elArticuloEsMio = item.creador_id == this.userId
        data[0].precios = Object.assign({}, data[0].precios)

        this.editado = Object.assign({}, data[0]); //data[0]);
        this.fechaPrecio = moment(data[0].precios[0].updatedAt).format('DD/MM/YYYY HH:mm:ss')
        
        this.editado.stock = data[0].stock

        this.precio.padre_id    = data[0].precios[0].padre_id
        this.precio.ofeunidades = data[0].precios[0].ofeunidades
        this.precio.ofevendidas = data[0].precios[0].ofevendidas
        this.precio.ofetasadescuento = data[0].precios[0].ofetasadescuento
        this.precio.ofepreciofinal = 0

        this.ofeEstados[0].sel = false
        this.ofeEstados[1].sel = false
        //this.ofeEstados[2].sel = false

        if (data[0].precios[0].ofeestado=='A') {
          this.ofeEstados[0].sel = true
        } else if (data[0].precios[0].ofeestado=='I') {
          this.ofeEstados[1].sel = true
      //} else {
      //  this.ofeEstados[1].sel = true
        }

        this.precio.ofeestado = data[0].precios[0].ofeestado==null?'I':data[0].precios[0].ofeestado
        this.precio.ofeimportedescuento = data[0].precios[0].precio*(data[0].precios[0].ofetasadescuento/100)
        // hev021201
        
        // Atencion, Si es COMBO filtro this.editado.componentes[i].componente.precios dejando solo el del usuario actual
        if (this.editado.escombo) {
          for (let i=0; i<=this.editado.componentes.length-1; i++) {
            this.editado.componentes[i].componente.precios = this.editado.componentes[i].componente.precios.filter(x=>x.user_id==this.userId)
          }
        }

        // CARGO EL PRECIO
        this.cargoPrecios( data );

        // RECALCULO POR SI ES UN COMPONENTE
        if (this.elArticuloEsMio && this.editado.escombo) {
          this.calculos()
        }

        this.itemActual = this.editado
        this.precio.coef = this.roundTo(Number(this.editado.undstock)/this.editado.undenvase,6)
        this.ancladoAlDolar = this.precio.usd==0 ? false : true
        this.editado.undstock = 1
        this.unidadesPadre = 1
        this.precio.coef = 1
        this.tasaiva = data[0].tasa
        if (this.editado.padre_id!=null){
          this.dialogPresentacion = true;
          this.precio.coef = this.editado.undenvase/this.editado.undenvasepad
          this.unidadesPadre = data[0].padre.undenvase
          let pos = data[0].padre.precios.findIndex(x=>x.user_id==this.userId)
          let porrempad = data[0].padre.precios[pos].porrem
          this.calpre()
        } else {
          this.dialog = true;
        }

        // CARGO RUBROS Y PRECIOS DEL ARTICULO
        this.stocks = []
        this.dialogStk = false;

        this.fotos = this.editado.fotos;
        //this.presentaciones = this.editado.presentaciones

        if (this.precio.sinstock=='B') {
          this.precio.sinstock = 'Avisar y Bloquear'
        } else if (this.precio.sinstock=='C') {
          this.precio.sinstock = 'Avisar y Continuar'
        } else if (this.precio.sinstock=='I') {
          this.precio.sinstock = 'Ignorar'
        }

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
        })
      })
    },

    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHTTP(this.items[index].id);
      this.snackbar = true;
      this.textSnack = 'Se eliminá el registro.';
    },

    cancelar() {
      this.dialog = false;
      this.dialogPresentacion = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },

    cancelarPresentacion() {
      this.dialogPresentacion = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },

    cancelarComponente() {
      this.edComp = Object.assign({}, this.edCompDefault);
      this.editedIndexComp = -1;
    },

    guardar(presentacion) {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', this.temas.forms_titulo_bg, 1500) 
        return this.dialog = true;
      }

      debugger

      this.editado.precios = this.precio
      this.fotos = this.editado.fotos;
      if (this.precio.sinstock=='Avisar y Bloquear') {
        this.precio.sinstock = 'B'
      } else if (this.precio.sinstock=='Avisar y Continuar') {
        this.precio.sinstock = 'C'
      } else if (this.precio.sinstock=='Ignorar') {
        this.precio.sinstock = 'I'
      }

      // CALCULO LAS UNDADES DE STOCK ( CUANDO PADRE_ID==NULL VA LA QUE INGRESO,
      // SINO EL ENVASE DIVIDIDO LAS UND DE LA PRESENTACION )
      if (this.editado.padre_id!=null) {
        this.editado.undstock = this.precio.coef
      }
      this.editado.dolar = this.$store.state.dolar

//    if ((this.editedIndex>-1) && (!presentacion)) { // esta modificando
      if (this.editedIndex>-1) { // esta modificando
        this.id = this.editado.id;
        this.editarHTTP(this.editado);
      } else {
        if (presentacion) {
          this.precio.costoViejo=this.precio.costo
        }
        this.altaHTTP(presentacion);
      }
      this.cancelar();
    },

    altaHTTP:function(presentacion) {
      let padre = presentacion ? this.itemActual.id : null
      this.editado.codigo = this.editado.codigo+'@'+this.userId
      return HTTP().post('/nuevoarticulo', {
        codigo: this.editado.codigo,
        nombre: this.editado.nombre,
        rubro_id: this.editado.rubro_id,
        creador_id: this.userId,
        padre_id: padre,
        unidad_id: this.editado.unidad_id,
        moneda_id: this.editado.moneda_id,
        iva_id: this.editado.iva_id,
        peso: this.editado.peso,
        undstock: Number(this.editado.undstock),
        esenvase: this.editado.esenvase ? 1 : 0,
        undenvase: Number(this.editado.undenvase),
        presentacion: this.editado.presentacion,
        esperecedero: this.editado.esperecedero ? 1 : 0,
        escombo: this.editado.escombo ? 1 : 0,
        descripcion: this.editado.descripcion,
        activo: this.editado.activo,
        fotos: this.editado.fotos,
        precios: this.editado.precios,
        vinculosHijos: this.vinculosHijos,
        componentes: this.editado.componentes,
        }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error en la grabacion del nuevo artículo!', this.temas.snack_error_bg, 2500)
          } else {
            this.mensaje('¡Artículo creado con éxito!', this.temas.forms_titulo_bg, 1500) 
            this.listarHTTP()
          }
      });
    },

    editarCodigoPropio(){
      this.dialogCodigoPropio = true
      let pos = this.itemActual.codigo.indexOf('@')
      this.editado.id = this.itemActual.id
      this.editado.codigo = this.itemActual.codigo.substring(0, pos)    // mi codigo
      if (!this.itemActual.codigoprov) {
        this.editado.codigoprov = this.editado.codigo
      } else {
        this.editado.codigoprov = this.itemActual.codigoprov
      }
    },

    sayDesc(p) {
      let desc = p.desc1!=0?'-'+p.desc1:''
      if (p.desc2!=0) {
        desc+='+'+p.desc2
      }
      return desc!=''?desc+'% ':''
    },

    calculoPrecio (item) {
      let ret = 0
      if (item.usd>0) {
        if (this.roundTo(this.dolar*item.usd,5) > item.costo) {
          if (this.sucursalDemo) {
            ret = (this.roundTo(this.dolar*item.usd,item.decimales))*(1+((item.porrem/100)))
          } else {
            let a = this.dolar*item.usd
            let b = this.roundTo(a, item.decimales)
            let c = this.roundTo(b * (1+(item.porrem/100)),item.decimales)
            let d = this.roundTo(c * (1+(item.tasa/100)),item.decimales)
            ret = d
          }
        } else {
          ret = this.sucursalDemo?item.precio:item.final
        }
      } else {
        ret = this.sucursalDemo?item.precio:item.final
      }
      return ret
    },
    // 118 Y 119

    cargoPrecios(data){
      this.precio.id = data[0].precios[0].id
      this.precio.decimales = data != null ? Number(data[0].precios[0].decimales) || 0 : 0
      this.precio.decimalesViejo = data != null ? Number(data[0].precios[0].decimales) || 0 : 0

      debugger
      if (data[0].padre) {
        this.precio.costo  = this.editedIndex != -1 ? data[0].precios[0].costo  : data[0].padre.precios[0].costo
        this.precio.precio = this.editedIndex != -1 ? data[0].precios[0].precio : data[0].padre.precios[0].precio
        this.costoPadre    = this.editedIndex === -1 ? data[0].precios[0].costo  : data[0].padre.precios[0].costo
        this.precioPadre   = this.editedIndex === -1 ? data[0].precios[0].precio : data[0].padre.precios[0].precio
        let desc1 = data[0].precios[0].desc1
        let desc2 = data[0].precios[0].desc2
        this.precioPadre = this.precioPadre-(this.precioPadre*(desc1/100))
        this.precioPadre = this.precioPadre-(this.precioPadre*(desc2/100))
      } else {
        this.precio.costo  = this.roundTo(data[0].precios[0].costo,5)
        this.precio.precio = this.roundTo(data[0].precios[0].precio,5)
        this.costoPadre    = this.roundTo(data[0].precios[0].costo,5)
        this.precioPadre   = this.roundTo(data[0].precios[0].precio,5)
      }

      if (data[0].precios[0].usd>0) {
        if (this.roundTo(this.dolar*data[0].precios[0].usd,5) > data[0].precios[0].costo) {
          this.costoAnclado = this.precio.costo
//        this.precio.costo = this.roundTo(this.dolar*data[0].precios[0].usd,data[0].precios[0].decimales)
          this.precio.costo = this.roundTo(this.dolar*data[0].precios[0].usd,6)
        }
      }

      this.precio.porrem = data != null ? data[0].precios[0].porrem || 0 : 0
      this.precio.porremmi = data != null ? data[0].precios[0].porremmi || 0 : 0
      this.precio.precioPadre = data[0].precios[0].precioPadre
      this.precio.costooriginal = data[0].precios[0].precio||0
      this.precio.desc1 = data[0].precios[0].desc1||0
      this.precio.desc2 = data[0].precios[0].desc2||0

      let aux = this.precio.costo
      aux = this.precio.costo/(1-(this.precio.desc2/100))
      aux = (aux/(1-(this.precio.desc1/100)))
      this.precio.costooriginal = aux

      this.precio.ofepreciofinal = 0
      let a = this.precio.precio
      let b = this.precio.ofeprecio
      let c = data[0].precios[0].tasaiva
      let d = this.precio.decimales

      if (this.precio.ofetasadescuento) {
        this.precio.ofeimportedescuento = this.roundTo(this.precio.precio*(Number(this.precio.ofetasadescuento)/100),this.precio.decimales)
        this.precio.ofeprecio = this.roundTo(this.precio.precio-this.precio.ofeimportedescuento,this.precio.decimales)
        this.precio.ofepreciofinal = this.roundTo(this.precio.ofeprecio*(1+(data[0].precios[0].tasaiva/100)),this.precio.decimales)
      } else {
        this.precio.ofeimportedescuento = 0
        this.precio.ofeprecio = 0
        this.precio.ofepreciofinal = 0
      }

      // LOS COMBOS NO TIENEN % DE REMARCACION PARA LOS CREADORES, PARA EL RESTO SI.
      if (this.editado.escombo && this.elArticuloEsMio) { 
        this.precio.porrem = 0
      }
      this.precio.costoViejo = this.precio.costo
      this.precio.porremViejo = this.precio.porrem
      this.precio.publico = 0
      if (this.editado.iva_id != undefined ) {
        this.precio.publico = this.roundTo(this.precio.precio * (1+(this.editado.tasa/100)),this.precio.decimales)
      }
      this.precio.usd = data[0].precios[0].usd
      this.precio.grupo_id = data[0].precios[0].grupo_id
      this.precio.marca_id = data[0].precios[0].marca_id
      this.precio.sevende = data[0].precios[0].sevende
      this.precio.secompra = data[0].precios[0].secompra
      this.precio.admstock = data[0].precios[0].admstock
      this.precio.exmin = data[0].precios[0].exmin
      this.precio.sinstock = data[0].precios[0].sinstock
      this.precio.activo = data[0].precios[0].activo
      this.nombreDelGrupo = ''
      if (data[0].precios[0].grupo_id) {
        this.nombreDelGrupo = data[0].precios[0].nomgru
      }
      this.precio.updatedAt = data[0].precios[0].updatedAt
      if (this.precio.ofetasadescuento) {
        this.precio.ofeimportedescuento = this.roundTo(this.precio.precio*(Number(this.precio.ofetasadescuento)/100),this.precio.decimales)
        this.precio.ofeprecio = this.roundTo(this.precio.precio-this.precio.ofeimportedescuento, this.precio.decimales)
      } else {
        this.precio.ofeimportedescuento = 0
        this.precio.ofeprecio = 0
      }
      this.precio.publicomi = 0
      if (this.precio.porremmi!=0) {
        this.precio.publicomi = this.precio.precio*(1+(this.precio.porremmi/100))
        this.precio.publicomi = this.roundTo(this.precio.publicomi * (1+(this.editado.tasa/100)),this.precio.decimales)
      }
    },

    clickEnGrupo() {
      this.dialogGrupos = true;
    },

    actualizoGrupos() {
      if (this.editedIndex == -1) {
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
        })
      } else {
        return HTTP().get('/gruposrubros/'+this.editado.rubro_id).then(({ data }) => {
          this.entriesGrupos = data[0];
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingGrupos = false))
      }
    },

    seleccionoGrupo(item) {
      if (item) {
        this.precio.grupo_id = item.id
        this.nombreDelGrupo = item.name
        this.dialogGrupos = false
      }
    },

    comboImporteDescuento(item) {
      return (this.formatoImporte(item.cantidad*(item.componente.precios[0].precio*(item.tasadescuento/100))))
    },

    comboImporteTotal(item) {
      let impdes = this.roundTo(item.cantidad*(item.componente.precios[0].precio*(item.tasadescuento/100)),item.componente.precios[0].decimales)
      let tot = this.roundTo((item.cantidad*item.componente.precios[0].precio)-impdes,item.componente.precios[0].decimales)
      return (this.formatoImporte( tot ) )
    },

    aceptarGruposAsigna(value) {
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
      let ret = deepSearch(this.itemsTreeGrupos, value, 'id', 'children');
      if (ret.children) {
        this.mensaje('¡Grupo con Hijos, debes seleccionar un Hijo!', this.temas.forms_titulo_bg, 2500)
      } else {
        this.precio.grupo_id = ret.id
        this.nombreDelGrupo = ret.name
        this.dialogGrupos = false
      }
    },

    cargoV() {
      let v = [];
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
      return v
    },

    sayStock(item) {
      let stk = item.stock||0
      if (typeof stk == "number") {
        return this.formatoImporte(stk)
      } else {
        return stk
      }
    },

    ayuda(cual) {
      if (cual==1) {
        this.mensaje('Unidades que van a integrar esta Presetanción.', this.temas.forms_titulo_bg, 2000)
      } else if (cual==2) {
        this.mensaje('Costo del artículo padre', this.temas.forms_titulo_bg, 2000)
      } else if (cual==3) {
        this.mensaje('Undes.que componen el Envase/Und.mínima de Venta', this.temas.forms_titulo_bg, 2000)
      }
    },

    sayPorRev(p) {
      return p.loTengo?p.porrem:p.porrev;
    },

    colorPorRev(p) {
      return !p.loTengo?this.temas.forms_btn_add_bg:this.temas.forms_btn_xls_bg;
    },

    onScroll () {
      this.scrollInvoked++
    },

    formatoFecha(value) {
      return moment(String(value)).format('L')
    },
  },
}; 
</script>

<style scoped>
  .contenedor-galeria{
    display: flex;
    width: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: auto;
  }
  .galeria__img {
    width: 300px;
    height: 200px;
    margin-bottom: 30px;
    object-fit: cover;
    filter: brightness(100%);
    animation: escalar 1.5s infinite alternate;
  }
  .galeria__img:hover {
    filter: brightness(95%);
  }
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fgb {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 150%;
    font-weight: bold;
  }
  .fg65 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 65%;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .fg80 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 80%;
  }
  .fg120 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 120%;
  }
</style>