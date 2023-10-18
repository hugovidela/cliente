<template>
  <v-layout align-start class="fg">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        dense
        class="elevation-1"
        :footer-props="{
          itemsPerPageOptions: [9],
          showFirstLastPage: true,
          showCurrentPage: true,
          nextIcon: 'mdi-arrow-right-drop-circle-outline',
          prevIcon: 'mdi-arrow-left-drop-circle-outline',
        }"
        @click:row="clickRow">
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
              <v-tooltip bottom v-if="tipo!='PP'">
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="nuevoTercero" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Nuevo</span>
              </v-tooltip>
              <v-tooltip bottom v-if="tipo!='PP'">
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
                <span class="fg">Enviar a Excel</span>
              </v-tooltip>
              <v-tooltip bottom v-if="tipo!='PP'">
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_pdf_bg"
                    :dark="temas.forms_btn_pdf_dark==true"
                    class="mr-2"
                    @click="exportarAPDF" v-on="on">
                    <v-icon>mdi-file-outline</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Enviar a PDF</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="agregarTerceros" v-on="on">
                    <v-icon>mdi-account-multiple-plus</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Incluir {{tipoTerPlurales}}</span>
              </v-tooltip>

              <v-switch class="pt-3 pl-5"
                label="Ver Cuentas Inactivas"
                :color="temas.forms_titulo_bg"
                v-model="verCuentasInactivas"
                @click="listarHTTP()">
              </v-switch>

              <!--
              <v-tooltip bottom v-if="tipo!='PP'">
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="agregarTerceros" v-on="on">
                    <v-icon>mdi-account-multiple-plus</v-icon>
                  </v-btn>
                </template>
                <span class="fg">Incluir {{tipoTerPlurales}}</span>
              </v-tooltip>
              -->
            </template>

            <v-toolbar-title v-if="tipo!='PP'">
              {{ $store.state.formTercerosTitulo=='Equipo' ? 'Mi' : 'Mis'}}
              {{ $store.state.formTercerosTitulo }}
            </v-toolbar-title>
            <v-toolbar-title v-else>
              Mis {{ tipoTerPlurales }}
            </v-toolbar-title>
            <v-divider class="mx-5" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!--
            <span class="fg70 mt-6">
              <v-badge content="co" inline :color="temas.forms_btn_add_bg"></v-badge>
              co (completo)<br>
              <v-badge content="ba" inline :color="temas.forms_btn_add_bg"></v-badge>
              ba (básico)<br>
              <v-badge content="pp" inline color="black"></v-badge>
              pp (precios y pedidos)<br>
              <v-badge content="x" inline color="red"></v-badge>
              x (exclusivo)<br>
              <v-badge content="v" inline :color="temas.forms_btn_add_bg"></v-badge>
              esta vinculado<br>
            </span>
            -->
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="800px" :fullscreen="true" persistent>
              <template v-slot:activator="{ on }"></template>
              <v-card class="fg">

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cancelar"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="fg" v-if="edicionRestringida">
                    {{ formTitle }} (<b>Edición Restringida</b> - Cuenta creada por otro Usuario)
                  </span>
                  <span v-else>
                    {{ formTitle }}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="cuentaYaAsignada==false"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="fg85" @click="guardar">Guardar
                  </v-btn>
                </v-toolbar>
                <!-- para el EDICION-->
                <v-form ref="form">
                  <v-card-text>
                    <!--<v-container>-->
                      <v-row class="mx-4 my-2">
                        <v-col cols="1" xl="1" lg="1" md="6" sm="12" xs="12">
                          <v-text-field
                            :color="temas.forms_titulo_bg"
                            v-model="editado.tercero_id"
                            disabled
                            label='id'>
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" xl="1" lg="1" md="6" sm="12" xs="12">
                          <v-select
                            label="Tipo de Docum."
                            autofocus
                            :disabled="!puedeEditar"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.documento_id"
                            :items="itemsDocumentos"
                            item-value="id"
                            item-text="nombre"
                            autocomplete>
                          </v-select>
                        </v-col>
                        <v-col cols="2" xl="2" lg="2" md="6" sm="12" xs="12">
                          <v-text-field
                            ref="cuit"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.cuit"
                            :disabled="!puedeEditar"
                            v-on:keydown.tab="buscoDocumento"
                            label="Número"
                            required
                            :rules="cuitRules"
                            :counter="11"
                            :maxlength="11">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" xl="4" lg="4" md="6" sm="6" xs="12">
                          <v-text-field
                            ref="nombre"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.nombre"
                            :disabled="!puedeEditar"
                            label="Apellidos y Nombres"
                            required
                            :rules="nombreRules"
                            :counter="50"
                            :maxlength="50"
                            v-on:keydown.tab="buscoNombre"
                            @keyup="escribiendoNombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" xl="1" lg="1" md="6" sm="6" xs="12">
                          <v-text-field
                            :color="temas.forms_titulo_bg"
                            v-model="editado.creador.username"
                            disabled
                            label="Creador">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" xl="3" lg="3" md="6" sm="6" xs="12">
                          <v-switch v-if="esExclusivo()"
                            class="pt-0 pb-0"
                            label="¿El Cliente utiliza el Sistema?"
                            v-model="editado.user.usaelsistema"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                          <v-switch v-else-if="userId==1"
                            class="pt-0 pb-0"
                            label="¿Administra GOHU?"
                            v-model="editado.user.administraGohu"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                      </v-row>

                      <v-tabs
                        key="pri"
                        background-color="white"
                        :color="temas.forms_titulo_bg"
                        v-model="tabInicial"
                        xl="12" lg="12" md="12" sm="1" xs="1">
                        <v-tab href="#general">
                          Datos Generales
                        </v-tab>
                        <v-tab-item value="general">
                          <v-row class="mt-2">
                            <v-col cols="6" xl="6" lg="6" md="2" sm="12" xs="12">
                              <v-text-field
                                v-model="editado.razon_social"
                                :disabled="!puedeEditar"
                                :color="temas.forms_titulo_bg"
                                label="Razón Social"
                                required
                                :rules="razon_socialRules"
                                :counter="80"
                                :maxlength="80">
                              </v-text-field>
                            </v-col>
                            <v-col cols="6" xl="6" lg="6" md="2" sm="12" xs="12">
                              <v-select
                                label="Cond.Fiscal"
                                :color="temas.forms_titulo_bg"
                                v-model="editado.responsable_id"
                                :disabled="!puedeEditar"
                                :items="itemsResponsables"
                                item-value="id"
                                item-text="nombre"
                                autocomplete>
                              </v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" xl="4" lg="4" md="2" sm="12" xs="12" class="pt-0">
                              <v-textarea
                                v-model="editado.observaciones"
                                :color="temas.forms_titulo_bg"
                                label="Observaciones"
                                auto-grow
                                outlined
                                rows="4"
                                row-height="25"
                                shaped>
                              </v-textarea>
                            </v-col>
                            <v-col cols="4" xl="4" lg="4" md="2" sm="12" xs="12" class="pt-0"
                              v-if="tipoTer==='Cliente'">
                              <v-combobox
                                outlined
                                v-model="tagsValue"
                                :color="temas.forms_titulo_bg"
                                :items="tagsItems"
                                chips label="Tags" multiple>
                                <template v-slot:selection="{ attrs,item,select,selected}">
                                  <v-chip
                                    v-bind="attrs"
                                    :input-value="selected"
                                    close
                                    @click="select"
                                    @click:close="removeTag(item)">
                                    <strong>{{ item }}</strong>&nbsp;
                                  </v-chip>
                                </template>
                              </v-combobox>
                            </v-col>
                            <v-col cols="4" xl="4" lg="4" md="2" sm="12" xs="12" class="pt-0"
                              v-if="tipoTer==='Cliente'&& listas.length>0&&esUsuarioGohu">
                              <v-row>
                                <v-col cols="9" sm="8">
                                  <span>
                                    <b>Lista de Precios</b>
                                    A tus precios sin IVA se le aplicará los descuentos definidos en
                                    la lista seleccionada.<br>
                                  </span>
                                </v-col>
                                <v-col cols="3" xl="3" lg="3" md="2" sm="12" xs="12" class="pt-0">
                                  <v-btn class="fg"
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="leerMasSobrePrecios()">
                                    Leer más
                                  </v-btn>
                                </v-col>
                              </v-row>
                              <v-select
                                v-model="editado.lista_id"
                                clearable
                                :items="listas"
                                item-text="nombre"
                                item-value="id"
                                label="Lista de Precios"
                                persistent-hint
                                single-line>
                              </v-select>
                            </v-col>
                          </v-row>
                          <v-card flat>
                            <v-card-text>
                              <!-- huguito -->
                              <v-row v-if="cual==2">
                                <v-col cols="2">
                                  <v-text-field
                                    :disabled="operarioEsVendedor"
                                    v-model="editado.porrevuser"
                                    :color="temas.forms_titulo_bg"
                                    label="% Gral.de Rem.p/sus Productos">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                              <v-row class="fg mb-0 pb-0 pt-0"
                                v-if="cual!=3&&editado.user.id!=userId">
                                <v-col cols="2" xl="2" lg="2" md="6" sm="12" xs="12"
                                  class="fg mb-0 pb-0 pt-0">
                                  <v-switch v-show="cual==1"
                                    :disabled="operarioEsVendedor"
                                    label="Cuenta Corriente"
                                    v-model="editado.ctacte"
                                    :color="temas.forms_titulo_bg">
                                  </v-switch>
                                </v-col>
                                <v-col cols="1" xl="1" lg="1" md="6" sm="12" xs="12"
                                  class="fg mb-0 pb-0 pt-0">
                                  <v-text-field v-show="cual==1"
                                    :disabled="operarioEsVendedor"
                                    v-model="editado.diasvenc"
                                    :color="temas.forms_titulo_bg"
                                    label="Días de Vencim.">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="1" xl="1" lg="1" md="6" sm="12" xs="12"
                                  class="fg mb-0 pb-0 pt-0">
                                  <v-text-field v-show="cual==1"
                                    :disabled="operarioEsVendedor"
                                    v-model="editado.bonificacionmaxima"
                                    :color="temas.forms_titulo_bg"
                                    label="% de Bonif.Máxima">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="2" xl="2" lg="2" md="6" sm="12" xs="12"
                                  class="fg mb-0 pb-0 pt-0">
                                  <v-text-field v-show="cual==1"
                                    :disabled="operarioEsVendedor"
                                    v-model="editado.creditomaximo"
                                    :color="temas.forms_titulo_bg"
                                    label="Crédito Máximo">
                                  </v-text-field>
                                  <p v-show="cual==1">
                                    En el Crédito Máximo está incluidos los Cheques
                                    aún no acreditados.
                                  </p>
                                </v-col>
                                <v-col cols="2" xl="2" lg="2" md="6" sm="12" xs="12"
                                  class="fg mb-0 pb-0 pt-0">
                                  <v-text-field v-show="cual==1"
                                    :disabled="operarioEsVendedor"
                                    v-model="editado.maxdiaschq"
                                    :color="temas.forms_titulo_bg"
                                    label="Máx.d/días de cheq.en Pagos">
                                  </v-text-field>
                                </v-col>
                                <!--
                                  % de remarcacion solo se puede activar cuando:
                                  es un ciente,
                                  no es la cuenta del usuario,
                                -->
                                <v-col v-if="tipoTer=='Cliente'"
                                  v-show="porRemActivos()"
                                  cols="3" sx="12" mx="12" class="fg">
                                  <v-row>
                                    <v-col cols="12">
                                      Porcentaje de Remarcación Sugerido
                                    </v-col>
                                  </v-row>
                                  <v-row class="gf pt-0 mt-0">
                                    <v-radio-group v-model="editado.porrev"
                                      row
                                      outlined
                                      class="pl-2">
                                      <v-radio
                                        :color="temas.forms_titulo_bg"
                                        :label="'('+porrev[0]+'%)'" value="1">
                                      </v-radio>
                                      <v-radio
                                        :color="temas.forms_titulo_bg"
                                        :label="'('+porrev[1]+'%)'" value="2">
                                      </v-radio>
                                      <v-radio
                                        :color="temas.forms_titulo_bg"
                                        :label="'('+porrev[2]+'%)'" value="3">
                                      </v-radio>
                                    </v-radio-group>
                                  </v-row>
                                </v-col>
                                <v-col cols="1" xl="1" lg="1" md="1" sm="1" xs="1"
                                  class="fg mb-0 pb-0 pt-0">
                                  <v-text-field
                                    v-show="tipoTer=='Cliente'&&
                                    exclusivoDe!=''"
                                    disabled
                                    v-model="editado.user.codigo"
                                    :color="temas.forms_titulo_bg"
                                    label="Código d/Ingreso">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>

                          <v-row v-show="cual==3">
                            <v-col cols="3" xl="3" lg="3" md="6" sm="12" xs="12" class="pt-0">
                              <v-select
                                label="Area Laboral"
                                autofocus
                                :disabled="!puedeEditar"
                                :color="temas.forms_titulo_bg"
                                v-model="editado.area"
                                :items="areas"
                                item-value="id"
                                item-text="nombre"
                                autocomplete
                                @change="setAreaLaboral()">
                              </v-select>
                            </v-col>
                            <v-col cols="1" xl="1" lg="1" md="6" sm="12" xs="12" class="pt-0">
                              <v-text-field v-show="editado.area=='V'"
                                v-model="editado.comision"
                                :color="temas.forms_titulo_bg"
                                label="% de Comisión">
                              </v-text-field>
                            </v-col>
                          </v-row>

                          <v-row v-show="cual==3">
                            <v-col cols="3" xl="3" lg="3" md="6" sm="12" xs="12" class="pt-0">
                              <v-switch v-show="editado.area=='V'||editado.area=='X'"
                                label="Pagar comisiones sobre pedidos realizados por Clientes"
                                :color="temas.cen_btns_bg"
                                v-model="editado.cobcompedcli">
                              </v-switch>
                            </v-col>
                            <v-col cols="3" xl="3" lg="3" md="6" sm="12" xs="12" class="pt-0">
                              <v-switch v-show="editado.area=='V'||editado.area=='X'"
                                label=
                                "Pedidos y Vendedores: Permitir a este Vendedor
                                poder tomar el control de los pedidos realizados
                                por sus Cientes."
                                :color="temas.cen_btns_bg"
                                v-model="editado.pedtransfavend">
                              </v-switch>
                            </v-col>

                          </v-row>
                        </v-tab-item>

                        <v-tab href="#direccion">
                          direcciones
                        </v-tab>
                        <v-tab-item value="direccion">

                          <v-data-table
                            :headers="headersDir"
                            :items="direcciones"
                            dense
                            class="elevation-3"
                            @click:row="locateGeoLocation">
                            <template v-slot:top>
                              <v-toolbar flat color="white">

                                <v-dialog v-model="dialogDir" max-width="500px">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-show="puedeEditar"
                                      fab @click="nuevaDireccion"
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
                                        icon @click="cancelarDir"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span class="text--right">
                                        {{ formTitleDir }}
                                      </span>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        v-if="(editadoDir.direccion &&
                                               editadoDir.postal_id)"
                                        color="teal accent-4" class="ma-2 white--text"
                                        @click="guardarDir(editadoDir)">
                                        Guardar
                                      </v-btn>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                              v-model="editadoDir.direccion"
                                              :color="temas.forms_titulo_bg"
                                              label="Dirección"
                                              required>
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-autocomplete
                                              ref="postal"
                                              v-model="editadoDir.postal_id"
                                              :color="temas.forms_titulo_bg"
                                              :items="itemsPostales"
                                              :loading="isLoadingPostales"
                                              :search-input.sync="searchPostales"
                                              item-text="nombre"
                                              item-value="id"
                                              label="Ciudad"
                                              placeholder="Escriba para buscar"
                                              prepend-icon="mdi-database-search">
                                            </v-autocomplete>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="6" sm="6" md="6">
                                            <v-select
                                              v-show="tipoTer=='Cliente'"
                                              label="Zona"
                                              :color="temas.forms_titulo_bg"
                                              v-model="editadoDir.lazona.zona_id"
                                              :items="itemsZonas"
                                              item-value="id"
                                              item-text="nombre"
                                              clearable
                                              autocomplete>
                                            </v-select>
                                          </v-col>
                                        </v-row>
                                      </v-container>
                                    </v-card-text>
                                  </v-card>
                                </v-dialog>
                              </v-toolbar>
                            </template>
                            <template v-slot:item.postal.nombre="{ item }">
                              <span>
                                {{ item.postal.nombre }} - (
                                {{ item.postal.codigo}}) -
                                {{ item.postal.provincia.nombre}} -
                                {{ item.postal.provincia.pais.nombre}}
                              </span>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true">
                                {{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true"
                                @click="editarDir(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.forms_btn_activar_bg"
                                :dark="temas.forms_btn_activar_dark==true"
                                @click="activarDesactivarDir(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>

                          <!-- MAPA -->
                          <div>
<!--
                            <div>
                              <h2>Agrege dirección</h2>
                              <label>

                                <gmap-autocomplete
                                  @place_changed="initMarker"
                                  :options="{fields: ['geometry']}">
                                </gmap-autocomplete>
                                <gmap-autocomplete
                                  @place_changed="initMarker">
                                </gmap-autocomplete>
                                <button @click="addLocationMarker">Add</button>
                              </label>
                              <br/>
                            </div>
                            <br>
-->
                            <gmap-map
                              :zoom="15"
                              :center="center"
                              style="width:100%; height: 600px;">
                              <gmap-marker
                                :key="index"
                                v-for="(m, index) in locationMarkers"
                                :position="m.position"
                                @click="center=m.position">
                              </gmap-marker>
                            </gmap-map>

                          </div>
                          <!--<AddGoogleMap />-->
                        </v-tab-item>

                        <!-- CONTACTOS -->
                        <v-tab href="#contacto">contactos</v-tab>
                        <v-tab-item value="contacto">
                          <v-data-table
                            :headers="headersCon"
                            :items="contactos"
                            dense
                            class="elevation-3">
                            <template v-slot:top>

                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogCon" max-width="600px">

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
                            <template v-slot:item.icono="{ item }">
                              <v-btn
                                class="mr-2" fab x-small>
                                <v-icon dark>{{item.icono}}</v-icon>
                              </v-btn>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true"
                                @click="editarCon(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true"
                                @click="preguntoBorrarCon(item)">
                                <v-icon dark>mdi-delete</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.forms_btn_activar_bg"
                                :dark="temas.forms_btn_activar_dark==true"
                                @click="activarDesactivarCon(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-tab-item>

                        <v-tab href="#cuentasbancarias">Cuentas Bancarias</v-tab>
                        <v-tab-item value="cuentasbancarias">
                          <v-data-table
                            :headers="headersCuentas"
                            :items="cuentas"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">

                                <!-- CUENTAS -->
                                <v-dialog v-model="dialogCuenta" max-width="500px">

                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-show="puedeEditar"
                                      fab @click="nuevaCuentaBancaria()"
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
                                        icon @click="cancelarCuenta"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span class="text--right">
                                        {{ formTitleCuenta }}
                                      </span>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        v-if="(editadoCuenta.banco_id &&
                                               editadoCuenta.nombre &&
                                               editadoCuenta.cuenta &&
                                               editadoCuenta.cbu)"
                                        color="teal accent-4" class="ma-2 white--text"
                                        @click="guardarCuenta(editadoCuenta)">
                                        Guardar
                                      </v-btn>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-select
                                              ref="banco"
                                              label="Banco"
                                              v-model="editadoCuenta.banco_id"
                                              :color="temas.forms_titulo_bg"
                                              :items="itemsBancos" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
                                            </v-select>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="8" sm="8" md="8">
                                            <v-text-field
                                              v-model="editadoCuenta.nombre"
                                              :color="temas.forms_titulo_bg"
                                              label="Nombre de la Cuenta"
                                              required :counter="30" :maxlength="30">
                                            </v-text-field>
                                          </v-col>
                                          <v-col cols="4" sm="4" md="4">
                                            <v-text-field
                                              v-model="editadoCuenta.abrev"
                                              :color="temas.forms_titulo_bg"
                                              label="Descripción"
                                              required :counter="5" :maxlength="5">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                              v-model="editadoCuenta.cuenta"
                                              :color="temas.forms_titulo_bg"
                                              label="Nro de Cuenta"
                                              required :counter="20" :maxlength="20">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                              v-model="editadoCuenta.cbu"
                                              :color="temas.forms_titulo_bg"
                                              label="CBU"
                                              required :counter="30" :maxlength="30">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-switch
                                              label="Cuenta predeterminada"
                                              v-model="editadoCuenta.predeterminada"
                                              :color="temas.forms_titulo_bg">
                                            </v-switch>
                                          </v-col>
                                        </v-row>

                                      </v-container>
                                    </v-card-text>

                                  </v-card>
                                </v-dialog>
                                <!-- CUENTAS -->

                                <!-- CHEQUERAS -->
                                <v-dialog v-model="dialogChequera" max-width="900px">
                                  <v-card class="fg">

                                    <v-toolbar flat
                                      :color="temas.forms_titulo_bg"
                                      :dark="temas.forms_titulo_dark==true">
                                      <v-btn
                                        icon @click="cerrarChequeras"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span>
                                        Chequeras de la cuenta:
                                        {{ editedIndexCuenta!=-1 ?
                                          cuentas[editedIndexCuenta].nombre : ''
                                        }}
                                      </span>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-data-table
                                              :headers="headersChequeras"
                                              :items="chequeras"
                                              dense
                                              class="elevation-3">
                                              <template v-slot:top>
                                                <v-toolbar flat color="white">
                                                  <v-dialog
                                                    v-model="dialogChequeraEdit" max-width="1050px">
                                                    <template v-slot:activator="{ on, attrs }">
                                                      <v-btn v-show="puedeEditar"
                                                        fab @click="nuevaChequera"
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
                                                          icon @click="cancelarChequeraEdit"
                                                          :color="temas.forms_close_bg"
                                                          :dark="temas.forms_close_dark==true">
                                                          <v-icon>mdi-arrow-left-circle</v-icon>
                                                        </v-btn>
                                                        <span class="text--right">
                                                          {{ formTitleChequera }}
                                                        </span>
                                                        <v-spacer></v-spacer>
                                                        <v-btn
                                                          v-if="(editadoChequera.nombre &&
                                                                editadoChequera.primer_numero &&
                                                                ((cttcheques>0)||
                                                                editadoChequera.echeq))"
                                                          color="teal accent-4"
                                                          class="ma-2 white--text"
                                                          @click="guardarChequera(editadoChequera)">
                                                          Guardar
                                                        </v-btn>
                                                      </v-toolbar>

                                                      <v-card-text>
                                                        <v-container>
                                                          <v-row class="pt-2">
                                                            <v-col cols="5" sm="5" md="5">
                                                              <v-text-field
                                                                v-model=
                                                                "editadoChequera.nombre"
                                                                label="Nombre"
                                                                dense required
                                                                autofocus
                                                                :color="temas.forms_titulo_bg"
                                                                :counter="40" :maxlength="40"
                                                                :disabled="editedIndexChequera!=-1">
                                                              </v-text-field>
                                                            </v-col>
                                                            <v-col cols="2" sm="2" md="2"
                                                              class="pt-0">
                                                              <v-checkbox
                                                                v-model=
                                                                "editadoChequera.echeq"
                                                                :color="temas.forms_titulo_bg"
                                                                label="Electrónica">
                                                              </v-checkbox>
                                                            </v-col>
                                                            <v-col cols="2" sm="2" md="2">
                                                              <v-text-field
                                                                v-model=
                                                                "editadoChequera.primer_numero"
                                                                label="Primer Número"
                                                                :color="temas.forms_titulo_bg"
                                                                dense required
                                                                :counter="8" :maxlength="8"
                                                                :disabled="editedIndexChequera!=-1">
                                                              </v-text-field>
                                                            </v-col>
                                                            <v-col cols="2" sm="2" md="2">
                                                              <v-text-field
                                                                v-if="!editadoChequera.echeq"
                                                                v-model="cttcheques"
                                                                label="Cantidad"
                                                                :color="temas.forms_titulo_bg"
                                                                dense required
                                                                :counter="8" :maxlength="8"
                                                                :disabled="editedIndexChequera!=-1">
                                                              </v-text-field>
                                                            </v-col>
                                                          </v-row>
                                                          <v-row>
                                                            <v-col cols="12" sm="12" md="12">
                                                              <v-data-table
                                                                :headers="headersCheques"
                                                                :items="loscheques"
                                                                :footer-props="footerPropsCheques"
                                                                dense
                                                                class="elevation-3">
                                                              </v-data-table>
                                                            </v-col>
                                                          </v-row>
                                                        </v-container>
                                                      </v-card-text>
                                                    </v-card>

                                                  </v-dialog>
                                                </v-toolbar>
                                              </template>
                                              <template v-slot:item.echeq="{ item }">
                                                <v-chip
                                                  :color="getColor(item.echeq)"
                                                  dark>{{item.echeq?'Sí':'No'}}
                                                </v-chip>
                                              </template>
                                              <template v-slot:item.activo="{ item }">
                                                <v-chip
                                                  :color="getColor(item.activo)"
                                                  dark>{{item.activo?'Sí':'No'}}
                                                </v-chip>
                                              </template>
                                              <template v-slot:item.accion="{item}">
                                                <v-btn v-show="puedeEditar"
                                                  class="mr-2" fab x-small
                                                  :color="temas.cen_btns_bg"
                                                  :dark="item.activo
                                                  ?temas.forms_btn_activo_dark==true
                                                  :temas.forms_btn_inactivo_dark==true"
                                                  @click="editarChequera(item)">
                                                  <v-icon dark>mdi-pencil</v-icon>
                                                </v-btn>
                                                <v-btn v-show="puedeEditar"
                                                  class="mr-2" fab x-small color="white"
                                                  @click="activarDesactivarChequera(item)">
                                                  <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                                </v-btn>
                                              </template>
                                            </v-data-table>

                                          </v-col>
                                        </v-row>

                                      </v-container>
                                    </v-card-text>

                                  </v-card>
                                </v-dialog>
                                <!-- FIN CHEQUERAS -->

                                <!-- TARJETAS -->
                                <v-dialog v-model="dialogTarjeta" max-width="900px">
                                  <v-card class="fg">

                                    <v-toolbar flat
                                      :color="temas.forms_titulo_bg"
                                      :dark="temas.forms_titulo_dark==true">
                                      <v-btn
                                        icon @click="cerrarTarjetas"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span
                                        class="text--right">Tarjetas de la cuenta:
                                        {{ editedIndexCuenta!=-1 ?
                                          cuentas[editedIndexCuenta].nombre : ''
                                        }}
                                      </span>
                                      <v-spacer></v-spacer>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-data-table
                                              :headers="headersTarjetas"
                                              :items="tarjetas"
                                              dense
                                              class="elevation-3">
                                              <template v-slot:top>
                                                <v-toolbar flat color="white">
                                                  <v-dialog
                                                    v-model="dialogTarjetaEdit" max-width="500px">

                                                    <template v-slot:activator="{ on, attrs }">
                                                      <v-btn v-show="puedeEditar"
                                                        fab @click="nuevaTarjeta"
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
                                                          icon @click="cancelarTarjetaEdit"
                                                          :color="temas.forms_close_bg"
                                                          :dark="temas.forms_close_dark==true">
                                                          <v-icon>mdi-arrow-left-circle</v-icon>
                                                        </v-btn>
                                                        <span class="text--right">
                                                          {{ formTitleTarjeta }}
                                                        </span>
                                                        <v-spacer></v-spacer>
                                                        <v-btn
                                                          v-if="(editadoTarjeta.tarjeta_id &&
                                                               editadoTarjeta.tarjeta_numero &&
                                                               editadoTarjeta.tarjeta_vencimiento)"
                                                          color="teal accent-4"
                                                          class="ma-2 white--text"
                                                          @click=
                                                          "guardarTarjeta(editadoTarjeta)">
                                                          Guardar
                                                        </v-btn>
                                                      </v-toolbar>

                                                      <v-card-text>
                                                        <v-container>
                                                          <v-row>
                                                            <v-col cols="12" sm="12" md="12">
                                                              <v-select
                                                                ref="tarjeta"
                                                                label="Tarjeta"
                                                                :color="temas.forms_titulo_bg"
                                                                v-model="editadoTarjeta.tarjeta_id"
                                                                :items="itemsTarjetas"
                                                                item-value="id"
                                                                item-text="nombre"
                                                                autocomplete
                                                                return-object>
                                                              </v-select>
                                                            </v-col>
                                                          </v-row>
                                                          <v-row>
                                                            <v-col cols="7" sm="7" md="7">
                                                              <v-text-field
                                                                v-model=
                                                                "editadoTarjeta.tarjeta_numero"
                                                                label="Numero"
                                                                :color="temas.forms_titulo_bg"
                                                                required>
                                                              </v-text-field>
                                                            </v-col>
                                                          </v-row>
                                                          <v-row>
                                                            <v-col cols="9" sm="9" md="9">
                                                              <v-text-field
                                                                type="month"
                                                                dense
                                                                v-model=
                                                                "editadoTarjeta.tarjeta_vencimiento"
                                                                :color="temas.forms_titulo_bg"
                                                                label="Vencimiento">
                                                              </v-text-field>
                                                            </v-col>
                                                          </v-row>
                                                          <v-row>
                                                            <v-switch
                                                              label="Es tarjeta de Débito"
                                                              :color="temas.forms_titulo_bg"
                                                              dense
                                                              v-model=
                                                              "editadoTarjeta.debito">
                                                            </v-switch>
                                                          </v-row>
                                                        </v-container>
                                                      </v-card-text>
<!--
                                                      <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn v-show="puedeEditar
                                                          && editedIndexTarjeta==-1"
                                                          :color="temas.cen_btns_bg"
                                                          :dark="temas.cen_btns_dark==true"
                                                          text
                                                          @click="cancelarTarjetaEdit">
                                                          Cancelar
                                                        </v-btn>
                                                        <v-btn v-show="puedeEditar
                                                          && editedIndexTarjeta==-1"
                                                          :color="temas.cen_btns_bg"
                                                          :dark="temas.cen_btns_dark==true"
                                                          text
                                                          @click="guardarTarjeta(editadoTarjeta)">
                                                          Guardar
                                                        </v-btn>
                                                        <v-btn v-show="puedeEditar
                                                          && editedIndexTarjeta!=-1"
                                                          :color="temas.cen_btns_bg"
                                                          :dark="temas.cen_btns_dark==true"
                                                          text
                                                          @click="cancelarTarjetaEdit">
                                                          Cerrar
                                                        </v-btn>
                                                      </v-card-actions>
-->
                                                    </v-card>
                                                  </v-dialog>
                                                </v-toolbar>
                                              </template>
                                              <template v-slot:item.activo="{ item }">
                                                <v-chip
                                                  :color="getColor(item.activo)"
                                                  dark>{{item.activo?'Sí':'No'}}
                                                </v-chip>
                                              </template>
                                              <template v-slot:item.debito="{ item }">
                                                <v-chip
                                                  dark>{{item.debito?'De débito':'De crédito'}}
                                                </v-chip>
                                              </template>
                                              <template v-slot:item.accion="{item}">
                                                <v-btn v-show="puedeEditar"
                                                  class="mr-2" fab x-small
                                                  :color="temas.cen_btns_bg"
                                                  :dark="temas.cen_btns_dark==true"
                                                  @click="editarTarjeta(item)">
                                                  <v-icon dark>mdi-pencil</v-icon>
                                                </v-btn>
                                                <v-btn v-show="puedeEditar"
                                                  class="mr-2" fab x-small color="white"
                                                  @click="activarDesactivarChequera(item)">
                                                  <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                                </v-btn>
                                              </template>
                                            </v-data-table>
                                          </v-col>
                                        </v-row>

                                      </v-container>
                                    </v-card-text>
                                  </v-card>
                                </v-dialog>
                                <!-- FIN TARJETAS -->

                              </v-toolbar>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.predeterminada="{ item }">
                              <v-chip
                                :color="getColor(item.predeterminada)"
                                dark>{{item.predeterminada?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="puedeEditar"
                                    class="mr-2" fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="editarCuenta(item)" v-on="on">
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="puedeEditar"
                                    class="mr-2" fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="cargoChequeras(item)" v-on="on">
                                    <v-icon>mdi-bank</v-icon>
                                  </v-btn>
                                </template>
                                <span>Chequeras</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="puedeEditar"
                                    class="mr-2" fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="cargoTarjetas(item)" v-on="on">
                                    <v-icon>mdi-credit-card</v-icon>
                                  </v-btn>
                                </template>
                                <span>Tarjetas</span>
                              </v-tooltip>

                              <!--
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="puedeEditar"
                                    class="mr-2" fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="preguntoBorrarCuenta(item)" v-on="on">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar</span>
                              </v-tooltip>
                              -->

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="puedeEditar"
                                    class="mr-2" fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="activarDesactivarCuenta(item)" v-on="on">
                                    <v-icon>mdi-checkbox-marked-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Activar/Desactivar</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-tab-item>
                        <!--
                        <v-tab href="#mediosdepago" v-show="cual==1">
                          Medios de Pago ( en construcción )
                        </v-tab>
                        <v-tab-item value="mediosdepago">
                          <v-data-table
                            :headers="headersPromo"
                            :items="promo"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogPromo" max-width="700px">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      fab @click="nuevaPromo"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      x-small>
                                      <v-icon>mdi-18px mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-card class="fg">
                                    <v-card-title>
                                      <span>{{ formTitlePromo }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-select
                                              ref="promo"
                                              label="Promo"
                                              :color="temas.forms_titulo_bg"
                                              v-model="editadoPromo.user_promo_id"
                                              :items="itemsPromos" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
                                            </v-select>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="3" sm="3" md="3">
                                            <v-text-field
                                              v-model="editadoPromo.porrem"
                                              label="% de Remarcación"
                                              :color="temas.forms_titulo_bg"
                                              required>
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                      </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        :color="temas.cen_btns_bg"
                                        :dark="temas.cen_btns_dark==true"
                                        text
                                        @click="cancelarPromo">
                                        Cancelar
                                      </v-btn>
                                      <v-btn
                                        :color="temas.cen_btns_bg"
                                        :dark="temas.cen_btns_dark==true"
                                        text
                                        @click="guardarPromo(editadoPromo)">
                                        Guardar
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-toolbar>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true">
                                {{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn
                                class="mr-2" fab dark x-small color="cyan"
                                @click="editarPromo(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab x-small color="white"
                                @click="activarDesactivarPromo(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-tab-item>
                        -->

                        <!-- ESTE TAB SE ACTIVA SI ESTOY EN VENDEDORES Y NO ES INSERT -->
                        <v-tab href="#acceso" v-show="cual==3 && editedIndex!=-1">
                          Accesos
                        </v-tab>
                        <v-tab-item value="acceso">
                        </v-tab-item>

                        <v-tab-item value="acceso">
                          <v-row>
                            <v-col cols="4" sm="4" md="4" v-show="terUser.username==null">
                              <v-btn
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                class="ma-2 white--text" @click="generaracceso()">
                                Generar Acceso al Sistema
                              </v-btn>
                            </v-col>
                            <v-col cols="4" sm="4" md="4" v-show="!terUser.username==null">
                              <v-btn
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                class="ma-2 white--text" @click="roles()">
                                Roles del Usuario
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" sm="4" md="4" v-show="dialogAcceso">
                              <v-text-field
                                ref="mail"
                                v-model="terUser.email"
                                v-on:keydown.tab="buscoMail"
                                label="Email"
                                placeholder="Email"
                                :counter="40"
                                :maxlength="40"
                                :rules="emailRules">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" sm="4" md="4" v-show="dialogAcceso">
                              <v-text-field
                                v-model="terUser.password"
                                :append-icon="show ? 'visibility' : 'visibility_off'"
                                :type="show ? 'text' : 'password'"
                                :rules="emailRules"
                                label="Contraseña"
                                hint="Hasta 15 caracteres"
                                counter required :maxlength="15"
                                @click:append="show = !show">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" sm="4" md="4"
                              v-show="terUser.username==null&&terUser.email!=null&&
                              terUser.password!=null">
                              <v-btn
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                class="ma-2 white--text" @click="guardaracceso()">
                                Confirmar Acceso al Sistema
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row justify="center" v-show="terUser.username!=null">
                            <v-col cols="6" sm="6" md="6">
                              <v-card max-width="1000"
                                style="height: 410px;"
                                v-scroll.self="onScroll"
                                :elevation=0
                                class="overflow-y-auto"
                                max-height="600">
                                <v-card-text>
                                  <v-treeview
                                    return-object
                                    item-key="id"
                                    hoverable activatable dense
                                    :color="temas.forms_titulo_bg"
                                    :item-color="temas.forms_titulo_bg"
                                    :items="opTree">

                                    <template slot="label" slot-scope="{ item }">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            class="mr-2" fab x-small
                                            :color="item.acceder ? temas.forms_titulo_bg :
                                            temas.forms_titulo_bg"
                                            :dark="item.acceder ? temas.forms_titulo_dark : false"
                                            @click="rol(item, 'acceder')">
                                            <v-icon dark>mdi-arrow-right-box</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Acceder</span>
                                      </v-tooltip>

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-btn
                                            v-show="item.tipo!='M'&&item.tipo!='I'&&item.tipo=='A'"
                                            class="mr-2" fab x-small
                                            :color="item.agregar ? temas.forms_titulo_bg :
                                            temas.forms_titulo_bg"
                                            :dark="item.agregar ? temas.forms_titulo_dark : false"
                                            @click="rol(item,'agregar')">
                                            <v-icon dark>mdi-plus</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Agregar</span>
                                      </v-tooltip>

                                      <v-btn
                                        v-show="item.tipo!='M' && item.tipo!='I' && item.tipo=='A'"
                                        class="mr-2" fab x-small
                                        :color="item.editar ? temas.forms_titulo_bg :
                                        temas.forms_titulo_bg"
                                        :dark="item.editar ? temas.forms_titulo_dark : false"
                                        @click="rol(item,'editar')">
                                        <v-icon dark>mdi-pencil</v-icon>
                                      </v-btn>
                                      <v-btn
                                        v-show="item.tipo!='M' && item.tipo!='I' && item.tipo=='A'"
                                        class="mr-2" fab x-small
                                        :color="item.desactivar ? temas.forms_titulo_bg :
                                        temas.forms_titulo_bg"
                                        :dark="item.desactivar ? temas.forms_titulo_dark : false"
                                        @click="rol(item,'desactivar')">
                                        <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                      </v-btn>

                                      <span>
                                        {{item.nombre}}
                                      </span>

                                    </template>
                                  </v-treeview>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                              <v-card flat>
                                <v-form ref="form">
                                  <v-card-title class="pl-7 pb-0">
                                    <p>Sucursales</p>
                                  </v-card-title>
                                  <v-card-subtitle class="pl-7 mt-0 pb-0">
                                    <p>
                                      Por configuración inicial los operarios pueden ingresar a
                                      todas las sucursales, aquí puedes darles acceso solo a las
                                      que necesites que ingresen.
                                    </p>
                                  </v-card-subtitle>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">

                                          <v-combobox
                                            outlined
                                            v-model="sucsValue"
                                            :color="temas.forms_titulo_bg"
                                            :items="sucsItems"
                                            chips label="Sucursales a la que Ingresa este Operario"
                                            multiple>
                                            <template
                                              v-slot:selection="{ attrs,item,select,selected}">
                                              <v-chip
                                                v-bind="attrs"
                                                :input-value="selected"
                                                close
                                                @click="select"
                                                @click:close="removeSuc(item)">
                                                <strong>{{ item }}</strong>&nbsp;
                                              </v-chip>
                                            </template>
                                          </v-combobox>

                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                </v-form>
                              </v-card>
                            </v-col>

                            <!--
-->
                          </v-row>
                        </v-tab-item>

                        <!-- ESTE TAB SE ACTIVA SI ESTOY EN VENDEDORES Y NO ES INSERT -->
                        <v-tab href="#zonas" v-show="cual==3 && editedIndex!=-1">
                          Zonas
                        </v-tab>
                        <v-tab-item value="zonas">
                          <v-data-table
                            :headers="headersZonas"
                            :items="tercerosZonas"
                            dense
                            :single-expand="singleExpand"
                            :expanded.sync="expanded"
                            show-expand
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <!-- ZONAS -->
                                <v-dialog v-model="dialogZona" max-width="500px">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-show="puedeEditar"
                                      fab @click="nuevaZona()"
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
                                        icon @click="cancelarZona"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span class="text--right">
                                        {{ formTitleZona }}
                                      </span>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        v-if="editadoZona.zona_id"
                                        color="teal accent-4" class="ma-2 white--text"
                                        @click="guardarZona(editadoZona)">
                                        Guardar
                                      </v-btn>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-select
                                              ref="zona"
                                              label="Zona"
                                              v-model="editadoZona.zona_id"
                                              :color="temas.forms_titulo_bg"
                                              :items="itemsZonasFil" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
                                            </v-select>
                                          </v-col>
                                        </v-row>
                                      </v-container>
                                    </v-card-text>
                                  </v-card>
                                </v-dialog>
                                <!-- ZONAS -->

                              </v-toolbar>
                            </template>

                            <!-- EL EXPAND DE LAS CLIENTES DE CADA ZONA -->
                            <template v-slot:expanded-item="{ headers, item }">
                              <td :colspan="headers.length">
                                <v-data-table
                                  :headers="headersClieXZonas"
                                  :items="item.clientes"
                                  :footer-props="footerProps"
                                  dense>
                                  <template v-slot:item.usertercero.tercero.nombre="{ item }">
                                    <span disable dark> {{
                                      item.usertercero.tercero.nombre
                                    }}</span>
                                  </template>
                                  <template v-slot:item.tercerodireccion.direccion="{ item }">
                                    <span>
                                      {{ item.tercerodireccion.direccion }}
                                    </span>
                                  </template>
                                  <template v-slot:item.tercerodireccion.postal.nombre="{ item }">
                                    <span>
                                      {{ item.tercerodireccion.postal.nombre }} (
                                      {{ item.tercerodireccion.postal.codigo }}) -
                                      {{ item.tercerodireccion.postal.provincia.nombre}}
                                    </span>
                                  </template>
                                </v-data-table>
                              </td>
                            </template>
                            <!-- FIN DEL EXPAND DE LOS CLIENTES POR CADA ZONA -->

                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="editarZona(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="preguntoBorrarZona(item)">
                                <v-icon dark>mdi-delete</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small color="white"
                                @click="activarDesactivarCuenta(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-tab-item>
                      </v-tabs>
                    <!--</v-container>-->
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

            <!-- LEER MAS SOBRE PRECIOS -->
            <v-dialog v-model="dialogLeerMasSobrePrecios" max-width="700px">
              <v-card class="fg">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogLeerMasSobrePrecios=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span
                    class="text--right">Sobre los precios...
                  </span>
                  <v-spacer></v-spacer>
                </v-toolbar>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                      <b>gohu</b> permite administrar un solo precio por Artículo.
                        <br>Pero a veces es necesario asignar descuentos a ciertos Clientes, por
                        como pagan, por el costo del flete, etc.<br>
                        Aquí te damos la posibilidad de que administres estos descuentos.<br>
                        Sino seleccionas ninguno, ellos seguirán viendo tus
                        <i>Precios de Lista</i>.<br>
                        Puedes asignar y/o quitar estos descuentos las veces que los creas
                        necesario. Para quitarlo, debe presionar en la X del seleccionador.
                        Pero si has definido distintos descuentos en base a formas de
                        comercialización, aqui puedes asignarlas a tus clientes.<br><br>
                        IMPORTANTE: <b>Estos precios con descuentos no influirán en pedidos.</b>
                        ni en Facturación. Luego podrás realizar descuentos por NDC's o n la
                        misma Factura.
                        <br><br>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- LEER MAS SOBRE PRECIOS -->

          </v-toolbar>
          <v-row>
<!--
            <v-col cols="6" sm="6" class="pl-6">
              <v-text-field
                v-model="search"
                append-icon="search"
                :color="temas.forms_titulo_bg"
                label="Buscar"
                single-line hide-details>
              </v-text-field>
            </v-col>
-->
            <v-col cols="5" sm="4">
              <v-text-field
                class="fg pt-4 pl-2"
                v-model="search"
                :color="temas.forms_titulo_bg"
                append-icon="search"
                label="Buscar"
                required clearable counter
                single-line hide-details
                @click:clear="limpiarTextoBuscar">
              </v-text-field>
            </v-col>

            <v-col class="pt-5" cols="2" sm="2">
              <v-btn
                :color="temas.forms_titulo_bg"
                class="fg85" dark
                @click="listarHTTP()">
                Buscar
              </v-btn>
            </v-col>

            <v-col cols="6" sm="6" class="pt-5 pr-5">
              <v-combobox
                v-model="tagsValue"
                :color="temas.forms_titulo_bg"
                :items="tagsItems"
                clearable
                @change="seleccionoTag()"
                label="Filtar por Tag">
              </v-combobox>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.tercero.nombre="{ item }"
          name="tr-fade" is="transition-group">
          <span>{{ item.tercero.nombre}}</span>
          <span>
            <b>
              {{ item.tercero.user!=null&&$store.state.formTercerosTitulo=='Proveedores'?
                '('+item.tercero.user.prefijo+')':''
              }}
            </b>
          </span>
          <v-badge v-if="item.tercero.user!=null&&$store.state.formTercerosTitulo!='Equipo'"
            class="pt-1 pl-2"
            :content="marcaTercero(item,'m')"
            :color="marcaTercero(item,'c')"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>
        <template v-slot:item.ctacte="{ item }">
          <v-chip
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            {{item.ctacte?'Sí':'No'}}
          </v-chip>
        </template>
        <template v-slot:item.tercero.user.activo="{ item }">
          <v-chip
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            {{bloqueado(item)}}
          </v-chip>
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip
            :color="getColor(item.activo)"
            :dark="item.activo
            ?temas.forms_btn_activo_dark==true
            :temas.forms_btn_inactivo_dark==true">
            {{item.activo?'Sí':'No'}}
          </v-chip>
        </template>
        <template v-slot:item.area="{ item }">
          <v-chip
            :color="getColor(item.activo)"
            :dark="item.activo
            ?temas.forms_btn_activo_dark==true
            :temas.forms_btn_inactivo_dark==true">
            {{getArea(item.area)}}
          </v-chip>
        </template>

        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
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
        </template>
      </v-data-table>

      <!-- INCLUSION DE TERCEROS -->
      <v-dialog v-model="dialogAgregarTerceros" max-width="900px" persistent>
        <template v-slot:activator="{}"></template>
        <v-card class="fg">
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              icon @click="dialogAgregarTerceros=false"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="text--right">
              Incluir {{ tipoTerPlurales }}
            </span>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <span class="text--right">
              <v-btn v-show="tercerosSeleccionados.length"
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="ma-2 white--text"
                @click="asignarNuevosTerceros">
                Confirmar {{ tipoTerPlurales }}
                <v-badge
                  :content='tercerosSeleccionados.length'
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
                      v-model="tercerosSeleccionados"
                      :headers="headersTerceros"
                      :search="searchNuevosClientes"
                      :items="terceros"
                      :single-select="false"
                      item-key="id"
                      show-select dense
                      class="elevation-1"
                      @toggle-select-all="selectAll">
                      <template v-slot:top>
                        <v-text-field class="pl-5 pt-5 pb-5"
                          v-model="searchNuevosClientes"
                          append-icon="search"
                          :color="temas.forms_titulo_bg"
                          label="Buscar"
                          clearable
                          single-line hide-details>
                        </v-text-field>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- ASIGNAR TERCEROS -->

      <!-- REGISTRAR CLIENTE EN GOHU -->
      <v-dialog v-model="dialogRegistroEnGohu" max-width="700px" persistent>
        <template v-slot:activator="{}"></template>
        <v-card class="fg">
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              icon @click="dialogRegistroEnGohu=false"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="text--right">
              Generar Cuenta Exclusiva en gohu
            </span>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <span class="text--right">
              <v-btn v-if="mailRegistro&&passRegistro"
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="ma-2 white--text" @click="generarClienteGohuHTTP(itemActual)">
                Generar
              </v-btn>
            </span>
          </v-toolbar>

          <v-form ref="art">
            <v-card-text class="fg">
              <v-container>
                <v-row>
                  <v-col cols="12" sx="12" mx="12">
                      Vas a generar una cuenta en gohu para el cliente
                      <b>{{itemActual!=null?itemActual.tercero.nombre:''}}.</b><br><br>
                      Esta cuenta será propia de él y totalmente independiente a la tuya.<br>
                      El tipo de Licencia que vas a generar será <i>Precios y Pedidos Exlusivo</i>,
                      es decir que no se podrá vincular con le resto de los usuarios <b>gohu</b>,
                      solo contigo, y cabe aclarar que esta licencia <i>no tiene costo</i>.<br><br>
                      Indica a continuación si el Cliente utilizará el sistema, esto para saber
                      quien ingresará los Pagos por Compras, el Cliente o tú.
                      <v-switch
                        class="pt-0 pb-0"
                        label="El Cliente va a utilizar su Cuenta"
                        v-model="editado.user.usaelsistema"
                        :color="temas.forms_titulo_bg">
                      </v-switch>
<!--
                      Ni bien confirmes la cuenta,
                      <b>{{itemActual!=null?itemActual.tercero.nombre:''}}</b> podrá empezar a
                      realizarte pedidos, ya que el sistema la preconfigura y la deja lista
                      para ser usada.<br><br>
-->
                      Los datos para que <b>{{itemActual!=null?itemActual.tercero.nombre:''}}</b>
                      ingrese al sistema serán enviados a la casilla de correo
                      que selecciones abajo.<br><br><b>gohu</b> generó una contraseña aleatoria
                      numérica de 6 dígitos, que luego el Cliente deberá ingresar para iniciar
                      sesión.<br>
                      Tú y el Cliente tendrán la posibilidad de cambiar la contraseña de esta
                      cuenta, siempre y cuando el Cliente permanezca bajo la licencia de usuario
                      exclusivo.
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="7" sx="7" mx="7">
                    <v-select
                      outlined
                      v-model="mailRegistro"
                      :color="temas.forms_titulo_bg"
                      :items="mailsRegistro"
                      label="Mail">
                    </v-select>
                  </v-col>
                  <v-col cols="5" sx="5" mx="5">
                    <v-text-field
                      outlined
                      v-model="passRegistro"
                      :append-icon="show ? 'visibility' : 'visibility_off'"
                      :type="show ? 'text' : 'password'"
                      label="Contraseña"
                      hint="Hasta 6 caracteres"
                      counter required maxlength="6"
                      @click:append="show = !show">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN GENERAR CUENTA EN GOHU -->

      <!-- CAMBIAR PASSWORD CLIENTE EXCLUSIVO -->
      <v-dialog v-model="dialogPasswordUserExclusivo" max-width="400px" persistent>
        <template v-slot:activator="{}"></template>
        <v-card class="fg">
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              icon @click="dialogPasswordUserExclusivo=false"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="text--right">
              Cambiar password de Cliente Exclusivo
            </span>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <span class="text--right">
              <v-btn v-show="passRegistro.length>0"
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="ma-2 white--text" @click="asignarNuevoPasswordClienteHTTP(itemActual)">
                Confirmar
              </v-btn>
            </span>
          </v-toolbar>

          <v-form>
            <v-card-text class="fg">
              <v-container>
                <v-row>
                  <v-col cols="12" sx="12" mx="12">
                    <v-text-field
                      outlined disabled
                      v-model="mailRegistro"
                      :color="temas.forms_titulo_bg"
                      readonly
                      label="Mail">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sx="12" mx="12">
                    <v-text-field
                      outlined
                      v-model="passRegistro"
                      :append-icon="show ? 'visibility' : 'visibility_off'"
                      :type="show ? 'text' : 'password'"
                      :color="temas.forms_titulo_bg"
                      readonly
                      label="Contraseña"
                      hint="Hasta 6 caracteres"
                      counter required maxlength="6"
                      @click:append="show = !show">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN CAMBIAR PASSWORD CLIENTE EXCLUSIVO -->

      <!-- INICIO SALDOS ESPEJADOS -->
      <v-dialog v-model="dialogSaldosEspejados" max-width="390px" persistent>
        <template v-slot:activator="{}"></template>
        <v-card class="fg">
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              icon @click="dialogSaldosEspejados=false"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="text--right">
              Control de Saldos Espejados
            </span>
          </v-toolbar>

          <v-form ref="art">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6" sx="6" mx="12">
                    <span>Saldo Propio</span>
                  </v-col>
                  <v-col cols="6" sx="6" mx="12" class="text-right">
                    <b>{{formatoImporte(saldoEspejoPropio)}}</b>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" sx="6" mx="12">
                    <span>Saldo del {{tipoTer}}</span>
                  </v-col>
                  <v-col cols="6" sx="6" mx="12" class="text-right">
                    <b>{{formatoImporte(saldoEspejoTercero)}}</b>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" sx="6" mx="12">
                    <span>Diferencia</span>
                  </v-col>
                  <v-col cols="6" sx="6" mx="12" class="text-right">
                    <b>{{formatoImporte(saldoEspejoPropio-saldoEspejoTercero)}}</b>
                  </v-col>
                </v-row>
                <v-row v-if="saldoEspejoPropio-saldoEspejoTercero!=0">
                  <v-col cols="12" sx="12" mx="12">
                    <span>Hay diferencia entre tu saldo y esta cuenta.</span><br>
                    <span>! Revisa si en notificaciones no tienes algún pago para anular. ¡</span>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN SALDOS ESPEJADOS -->

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

/* https://medium.com/js-dojo/how-to-build-a-reusable-vuejs-modal-component-fc8d7f3b4735 */

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import XLSX from 'xlsx'
import jsPDF from 'jspdf'
//import AddGoogleMap from "./../components/AddGoogleMap";
import Confirmacion from "./Forms/confirmacion.vue";
import Mail from "./Forms/mail.vue";

const home = { lat: -33.111680, lng: -64.332395};
export default {
  components: {
    SBar,
    Confirmacion,
    Mail,
    //AddGoogleMap,
  },
  data: () => ({

    porRevUserPos: null, // posicion del proveedor en la tabla vinculos, donde esta guardado el porRev
    edicionRestringida: false,
    preciosLicencias: [],
    elMailExiste: true,

    saldoEspejoTercero: 0,
    saldoEspejoPropio: 0,

    userterceroid: null,
    verCuentasInactivas: false,

    // para el mapa
    center: home,
    locationMarkers: [],
    currentLocation : { lat : 0, lng : 0},

    reg: {
      mail: '',
      pass: '12345',
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
    esUsuarioGohu: false,
    tercerosSeleccionados: [],
    cuentaYaAsignada: false,
    scrollInvoked: 0,
    show: false,
    opcion: '',
    opcion_id: '',
    opItems: [],
    opTree: [],
    cual: 1,
    tipoTer: '', // Cliente, Proveedor, Vendedor, Librador y que otros?
    tipoTerPlurales: '',
    terUser: {
      id: null,
      username: null,
      email: null,
      password: null,
    },
    tabInicial: 'pri',
    terceroAIncorporar: '',
    itemActual: null,
    cttcheques: 0,
    acciones: [],
    puedeEditar: true,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 50) || 'Ingrese hasta 50 caracteres',
    ],      
    razon_socialRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],
    cuitRules: [
      v => !!v || 'El cuit es requerido',
      v => (v && v.length <= 11) || 'Ingrese hasta 11 caracteres',
    ],
    emailRules: [
      v => !!v || 'E-mail es requerido',
      v => /.+@.+\..+/.test(v) || 'E-mail debe ser válido',
    ],
    passRules: {
      required: value => !!value || 'Requerido',
      min: v => v.length >= 3 || 'Míninmo 3 caracters',
    },
    usernameRules: [
      v => !!v || 'El nopmbre es requerido',
      v => (v && v.length <= 40) || 'Hasta 40 caraceres',
    ],
    searchPostales: '',       // para el cuadro de búsqueda de datatables
    searchBancos: '',         // para el cuadro de búsqueda de datatables
    searchPromos: '',         // para el cuadro de búsqueda de datatables
    loading: false,
    searchTag: '',
    terceroTipoSeleccionado: [],
    tercerosTipos: [],
    cuentas: [],
    contactos: [],
    contactosTipos: [],
    tagsItems: [],
    tagsValue: [],
    tagsObj: [],
    sucsValue: [],
    sucsItems: [],
    sucsObj: [],
    expanded: [],
    listas: [],
    areas: [
      {id: 'A', nombre: 'Administrativo'}, 
      {id: 'V', nombre: 'Vendedor'},
      {id: 'R', nombre: 'Repartidor'},
      {id: 'X', nombre: 'Vendedor y Repartidor'}],
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    footerPropsCheques: {'items-per-page-options': [5]},
    search: '',         // para el cuadro de búsqueda de datatables  
    searchNuevosClientes: '',
    dialog: false,      // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogDir: false,
    dialogCon: false,
    dialogZona: false,
    dialogPromo: false,
    dialogCuenta: false,
    dialogAcceso: false,
    dialogTarjeta: false,
    dialogChequera: false, 
    dialogTarjetaEdit: false,
    dialogChequeraEdit: false,
    dialogRegistroEnGohu: false,
    dialogSaldosEspejados: false,
    dialogAgregarTerceros: false,
    dialogLeerMasSobrePrecios: false,
    dialogPasswordUserExclusivo: false,
    mailRegistro: '',
    mailsRegistro: [],
    passRegistro: '',
    singleExpand: false,
    items: [],
    itemsAll: [],
    promo: [],
    userPromos: [],
    chequeras: [],
    tarjetas: [],
    loscheques: [],
    terceros: [],
    headers: [
      { text: 'Código', value: 'tercero.id', width: 90, align: 'right', sortable: false },
      { text: 'Nombre', value:'tercero.nombre', width: 500},
      { text: 'Fiscal', value:'tercero.responsable.abrev', width: 50},
      { text: 'Doc', value:'tercero.documento.nombre', width: 60},
      { text: 'Nro', value:'tercero.cuit', width: 60},
      { text: 'Zona', value:'tercero.direcciones[0].zona[0].zonas.nombre.substring(0,20)', width: 290},
      { text: 'CtaCte', value:'ctacte', width: 90},
      { text: 'Activo', value:'activo', width: 70},
      { text: 'Op', value: 'accion', sortable: false },
    ],
    headersDir: [
      { text: 'DIRECCION', value:'direccion', width: 250},
      { text: 'CIUDAD', value:'postal.nombre', width: 450},
      { text: 'ACTIVO', value:'activo'},
      { text: 'Op', value: 'accion', sortable: false },
    ],
    headersCon: [
      { text: 'ICONO', value:'icono'},
      { text: 'OBSERVACIONES', value:'observaciones'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'Op', value: 'accion', sortable: false },
    ],
    headersPromo: [
      { text: 'NOMBRE', value:'promo.nombre'},
      { text: '% REM', value:'porrem'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'Op', value: 'accion', sortable: false },
    ],
    headersCuentas: [
      { text: 'BANCO', value:'banco.nombre', align: 'left', width: 250},
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 150},
      { text: 'CUENTA', value:'cuenta'},
      { text: 'CBU', value:'cbu'},
      { text: 'PREDET.', value:'predeterminada'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'Op', value: 'accion', sortable: false },
    ],
    headersZonas: [
      { text: 'ZONA', value:'nombre', align: 'left', width: 350},
      { text: 'CLIENTES', value:'clientes.length', align: 'end'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'Op', value: 'accion', sortable: false },
    ],
    headersChequeras: [
      { text: 'Nombre', value:'nombre'},
      { text: '1er.Núm', value: 'primer_numero'},
      { text: 'echeq', value: 'echeq'},
      { text: 'Ctt.Cheques', value: 'loscheques.length'},
      { text: 'Disponibles', value: 'libres'},
      { text: 'Activo', value: 'activo'},
      { text: 'Op', value: 'accion', sortable: false },
    ],
    headersCheques: [
      { text: 'NUMERO', value: 'numero', align: 'right', width: 50},
      { text: 'COMPROBANTE', value:'comprobante.cpr', align: 'left', width: 120},
      { text: 'ENTREGADO A', value:'comprobante.tercero.nombre', align: 'left', width: 210},
      { text: 'ESTADO', value:'estado', align: 'left', width: 50},
      { text: 'OBSERV.', value:'observaciones', align: 'left', width: 100},
    ],
    headersTarjetas: [
      { text: 'TARJETA', value:'tarjeta.nombre'},
      { text: 'NUMERO', value:'tarjeta_numero'},
      { text: 'VENCIM', value:'tarjeta_vencimiento'},
      { text: 'DEBITO', value:'debito'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'Op', value: 'accion', sortable: false },
    ],
    headersTerceros: [
      { text: 'NOMBRE', value:'nombre', width: 320},
      { text: 'DOCUMENTO', value:'doc', width: 120},
    ],
    headersClieXZonas: [
      { text: 'ID', value:'usertercero.tercero.id', width: 50},
      { text: 'NOMBRE', value:'usertercero.tercero.nombre', width: 180},
      { text: 'DIRECCION', value:'tercerodireccion.direccion', width: 240},
      { text: 'CIUDAD', value:'tercerodireccion.postal.nombre', width: 240},
//      { text: 'ALTURA', value:'tercerodireccion.numero', width: 40},
    ],

    editedIndex: -1,
    editedIndexDir: -1,
    editedIndexCon: -1,
    editedIndexPromo: -1,
    editedIndexCuenta: -1,
    editedIndexChequera: -1,
    editedIndexTarjeta: -1,
    editedIndexZona: -1,
    direcciones: {
      id: null,
      direccion: null,
      postal_id: null,
      activo: null,
    },
    editadoDir: {
      id: null,
      direccion: null,
      postal_id: null,
      activo: null,
      lazona: { 
        id: null, 
        tercerodireccion_id: null,
        usertercero_id: null,
        zona_id: null,
        zonas: {
          id: null,
          nombre: null } },      
      activo: null,
    },
    defaultItemDir: {
      id: null,
      direccion: null,
      postal_id: null,
      activo: null,
      lazona: { 
        id: null, 
        tercerodireccion_id: null,
        usertercero_id: null,
        zona_id: null,
        zonas: {
          id: null,
          nombre: null } },      
      activo: null,
    },
    con: {
      tipo_id: null,
      icono: null,
      observaciones: null,
      activo: null,
    },
    editadoCon: {
      tipo_id: null,
      icono: null,
      observaciones: null,
      activo: null,
    },
    defaultItemCon: {
      tipo_id: null,
      icono: null,
      observaciones: null,
      activo: null,
    },
    editadoPromo: {
      activo: null,
      id: null,
      nombre: null,
      porrem: null,
      user_tercero_id: null,
      user_id: null,
    },
    defaultItemPromo: {
      activo: null,
      id: null,
      nombre: null,
      porrem: null,
      user_tercero_id: null,
      user_id: null,
    },    
    editadoCuenta: {
      id: null,
      tercero_id: null,
      banco_id: null,
      nombre: null,
      abrev: null,
      cuenta: null,
      cbu: null,
      predeterminada: null,
      activo: true,
    },
    defaultItemCuenta: {
      id: null,
      tercero_id: null,
      banco_id: null,
      nombre: null,
      abrev: null,
      cuenta: null,
      cbu: null,
      predeterminada: null,
      activo: true,
    },
    editadoChequera: {
      activo: true,
      cheques: 0,
      loscheques: [],
      id: null,
      echeq: false,
      nombre: null,
      primer_numero: null,
      tercerocuenta_id: null,
    },
    defaultChequera: {
      activo: true,
      cheques: 0,
      loscheques: [],
      id: null,
      echeq: false,
      nombre: null,
      primer_numero: null,
      tercerocuenta_id: null,
    },
    editadoTarjeta: {
      activo: true,
      id: null,
      tarjeta_id: null,
      tarjeta_numero: null,
      tarjeta_vencimiento: null,
      tercerocuenta_id: null,
    },
    defaultTarjeta: {
      activo: true,
      id: null,
      tarjeta_id: null,
      tarjeta_numero: null,
      tarjeta_vencimiento: null,
      tercerocuenta_id: null,
    },
    editado: {
      id: null,
      tercero_id: null,
      nombre: null,
      razon_social: null,
      responsable_id: 5,
      documento_id: 25,
      cuit: null,
      observaciones: null,
      lista_id: null,
      ctacte: 0,
      diasvenc: 0,
      creditomaximo: 0,
      bonificacionmaxima: 0,
      maxdiaschq: 0,
      porrev: 0,
      comision: 0,
      cobcompedcli: 0,
      pedtransfavend: 0,
      creador: { username: '', id: null },
      activo: true,
      area: '',
      user: {
        id: null,
        username: null,
        codigo: null,
        usaelsistema: null,
        administraGohu: null,
      },
      cuentas: [],
      porrevuser: null,
      porrevuserid: null,
    },
    defaultItem: {
      id: null,
      nombre: null,
      razon_social: null,
      responsable_id: 5,
      documento_id: 25,
      cuit: null,
      observaciones: null,
      lista_id: null,
      ctacte: false,
      diasvenc: 0,
      creditomaximo: 0,
      bonificacionmaxima: 0,
      maxdiaschq: 0,
      porrev: '',
      comision: 0,
      cobcompedcli: 0,
      creador: { username: '' },
      activo: true,
      area: '',
      user: {
        id: null,
        username: null,
        codigo: null,
        usaelsistema: null,
        administraGohu: null,
      },
      cuentas: [],
      porrevuser: null,
      porrevuserid: null,
    },
    editadoZona: {
      id: null,
      nombre: null,
      activo: null,
    },
    defaultItemZona: {
      id: null,
      nombre: null,
      activo: null,
    },
    descriptionLimit: 60,
    entriesPostales: [],
    isLoadingPostales: false,

    itemsBancos: [],
    itemsTarjetas: [],
    itemsResponsables: [],
    itemsDocumentos: [],
    itemsPromos: [],
    itemsZonas: [],
    itemsZonasFil: [],
    tercerosZonas: [],
    //viajesConfig: [],
    //viajesConfigAll: [],
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId' ]),
    ...mapMutations(['alert','closeAlert','setTerceros','setDatosEmpresaCuentas']),
    ...mapState([
      'exclusivoDe',
      'dolar',
      'porrev',
      'temas',
      'datosEmpresa',
      'externo',
      'tipo',
      'level',
      'sucursal',
      'sucursales',
      'operario',
      'operarioUserId',
      'operarioEsVendedor',
      'operarioTerceroId',
      'vinculosHijos',
      'vinculosPadres',
      'vinculosPadresLic',
      ]),

    formTitle () {
      if (this.editedIndex != -1) {
        let exl = this.itemActual.tercero.user!=null?this.itemActual.tercero.user.userexclusivo_id:0
        let ret = 'Editar '
        ret += this.tipoTer+' '
        if (exl==this.userId&&this.$store.state.formTercerosTitulo=='Clientes') {
          ret += '(Exclusivo)'
        }
        return ret;
      } else {
        return 'Nuevo '+this.tipoTer;
      }
    },
    formTitleDir () {
      return this.editedIndexDir === -1 ? 'Nueva Direccion' : 'Editar Dirección';
    },
    formTitleCon () {
      return this.editedIndexCon === -1 ? 'Nuevo Contacto' : 'Editar Contacto';
    },
    formTitlePromo () {
      return this.editedIndexPromo === -1 ? 'Asignar Promoción' : 'Editar Promoción';
    },
    formTitleCuenta () {
      return this.editedIndexCuenta === -1 ? 'Nueva Cuenta Bancaria' : 'Editar Cuenta Bancaria';
    },
    formTitleZona () {
      return this.editedIndexZona === -1 ? 'Nueva Zona' : 'Editar Zona';
    },
    formTitleChequera () {
      return this.editedIndexChequera === -1 ? 'Nueva Chequera' : 'Editar Chequera';
    },
    formTitleTarjeta () {
      return this.editedIndexTarjeta === -1 ? 'Nueva Tarjeta' : 'Editar Tarjeta';
    },
    itemsPostales () {
      return this.entriesPostales.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre+' ('+entry.codigo+') -'+entry.provincia.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
  },
  watch: {
    // ESTE WATCH ES PARA RE-INICIALIZAR EL MISMO FORMULARIO YA CARGADO
    '$route.path': function(val, oldVal){
      this.init_component();
    },

//  '$store.state.sucursal' () {
//  },

    dialogDir (val) {
      val || this.cancelarDir();
    },
    dialogCon (val) {
      val || this.cancelarCon();
    },
    dialogPromo (val) {
      val || this.cancelarPromo();
    },
    dialogCuenta (val) {
      val || this.cancelarCuenta();
    },
    dialogZona (val) {
      val || this.cancelarZona();
    },
    dialogChequeraEdit (val) {
      val || this.cancelarChequeraEdit();
    },

    searchPostales (val) {
      if (this.isLoadingPostales) return
      this.isLoadingPostales = true
      if (val==null && this.editadoDir.postal_id!=null) {
        val = this.editadoDir.postal.nombre
      } else {
      }
      return HTTP().post('/postales', {bus: val})
        .then(({ data }) => {
          this.entriesPostales = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingPostales = false))
    },
  },

  mounted () {
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      this.tagsItems = []
      this.tagsValue = []
      return HTTP().get('/inicialtercero').then(({ data }) => {

        this.tercerosTipos = data.tipos;
        this.contactosTipos = data.contactos;
        this.itemsBancos = data.bancos;
        this.itemsTarjetas = data.tarjetas;
        this.itemsResponsables = data.afipresponsables;
        this.itemsDocumentos = data.afipdocumentos;
        this.listas = data.listas;
        this.itemsZonas = data.zonas;
        //this.viajesConfigAll = data.viajesconfig
        
        this.preciosLicencias = data.precioslicencias
        data.tagsterceros.forEach(el => { this.tagsItems.push(el.nombre) });
        data.tagsterceros.forEach(el => { this.tagsObj.push(el)});

      })
    }
  },

  created () {
    this.init_component()
    if (this.cual==3) {
      this.opcion_id = 0
      return HTTP().get('/opciones').then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          this.opItems.push ( {
            id:         data[i].id,
            nombre:     data[i].nombre,
            tipo:       data[i].tipo,
            activo:     data[i].activo,
            opcion_id:  data[i].opcion_id,
            acceder:    false,
            agregar:    false,
            editar:     false,
            desactivar: false,
            state:      false, 
          })
          if (this.opcion_id==0) {
            this.opcion_id = data[0].opcion_id
          }
        }
      })
    }
  },

  methods: {
    porRemActivos() {
      if (this.tipoTer=='Cliente') {
        if (this.editado.user.id!=this.userId) {
//          if (this.$store.state.tipo!='PP') {
            if (this.esUsuarioGohu) {
              if (!this.operarioEsVendedor) {
                return true       
              }
            }
//          }
        }
      }
      return false

/*      
      if (this.tipoTer=='Cliente'&&this.editado.user.id!=this.userId&&
        !this.$store.state.tipo=='PP'&&
        this.esUsuarioGohu &&
        !this.operarioEsVendedor) {
          return true 
        } else {
          return false
        }
*/
    },

    esExclusivo() {
      if (this.tipoTer!='Cliente') return false
      if (this.itemActual==null) return false
      if (this.itemActual.tercero==null) return false
      if (this.itemActual.tercero.user==null) return false
      if (this.itemActual.tercero.user.userexclusivo_id&&this.itemActual.tercero.user.id!=this.userId) {
        return true
      } else {
        return false
      }
    },

    /*
    initMarker(loc) {
      this.existingPlace = loc;
    },
    */

    /*
    addLocationMarker() {
      if (this.existingPlace) {
        const marker = {
          lat: this.existingPlace.geometry.location.lat(),
          lng: this.existingPlace.geometry.location.lng()
        };
        this.locationMarkers.push({ position: marker });
        this.locPlaces.push(this.existingPlace);
        this.center = marker;
        this.existingPlace = null;
      }
    },
    */
    
    locateGeoLocation: function(value) {
      debugger
      let dir = '';
      if (value!=undefined) {
        dir = value.direccion+' '+value.postal.nombre+' '+value.postal.provincia.nombre+' '+value.postal.provincia.pais.nombre
      } else {
        if (this.direcciones.length>0) {
          dir = this.direcciones[0].direccion+' '+this.direcciones[0].postal.nombre+' '+this.direcciones[0].postal.provincia.nombre+' '+this.direcciones[0].postal.provincia.pais.nombre
        } else {
          return 
        }
      }
      if (typeof google != "undefined") {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': dir}, (results, status) => {
          if (status === 'OK') {
            this.currentLocation.lat = results[0].geometry.location.lat();
            this.currentLocation.lng = results[0].geometry.location.lng();
  /*
            const marker = {
              lat: this.existingPlace.geometry.location.lat(),
              lng: this.existingPlace.geometry.location.lng()
            };
            this.locationMarkers.push({ position: marker });
            this.locPlaces.push(this.existingPlace);
            this.center = marker;
            this.existingPlace = null;
  */
            const marker = {
              lat: this.currentLocation.lat,
              lng: this.currentLocation.lng,
            };
  
            this.locationMarkers = [
              { position: this.currentLocation },
            ]
            this.center = marker;
          }
        });
        navigator.geolocation.getCurrentPosition(res => {
          this.center = {
            lat: res.coords.latitude,
            lng: res.coords.longitude
            };
        });
      }
    },

    closeForm(){
      router.push('/')
    },

    onScroll () {
      this.scrollInvoked++
    },

    limpiarTextoBuscar() {
      this.search = ''
      this.listarHTTP()
    },

    init_component() {
      this.headersDir = [
        { text: 'DIRECCION', value:'direccion', width: 250},
        { text: 'CIUDAD', value:'postal.nombre', width: 450},
        { text: 'ACTIVO', value:'activo'},
        { text: 'Op', value: 'accion', sortable: false },
      ]
      let a = this.$store.state.route.fullPath.substring(1,this.$store.state.route.fullPath.length)
      if (a==='usersclientes') {
        this.tipoTer = 'Cliente'
        this.tipoTerPlurales = 'Clientes'
        this.cual = 1
        this.headersDir = [
          { text: 'DIRECCION', value:'direccion', width: 250},
          { text: 'CIUDAD', value:'postal.nombre', width: 450},
          { text: 'ZONA', value:'lazona.zonas.nombre'},
          { text: 'ACTIVO', value:'activo'},
          { text: 'Op', value: 'accion', sortable: false },
        ]
      } else if (a==='usersproveedores') {
        this.tipoTer = 'Proveedor'
        this.tipoTerPlurales = 'Proveedores'
        this.cual = 2
      } else if (a==='usersequipo') {
        this.tipoTer = 'Equipo'
        this.tipoTerPlurales = 'Equipo'
        this.cual = 3
      } else if (a==='userstransportistas') {
        this.tipoTer = 'Transportista'
        this.tipoTerPlurales = 'Transportistas'
        this.cual = 4
      } else if (a==='userspuntosderetiros') {
        this.tipoTer = 'Puntos de Retiro'
        this.tipoTerPlurales = 'Puntos de Retiros'
        this.cual = 6
      } else if (a==='userstercerosgastos') {
        this.tipoTer = 'Terceros Estado/Servicios/Otros'
        this.tipoTerPlurales = 'Terceros Estado/Servicios/Otros'
        this.cual = 7
      }

      if (this.cual==3) { // vendedores
        this.headers = [
          { text: 'Código', value: 'tercero.id', width: 90, align: 'right', sortable: false },
          { text: 'Nombre', value:'tercero.nombre', width: 300},
          { text: 'Fiscal', value:'tercero.responsable.abrev', width: 90},
          { text: 'Doc', value:'tercero.documento.nombre', width: 160},
          { text: 'Nro', value:'tercero.cuit', width: 90},
          { text: 'Zona', value:'tercero.direcciones[0].zona[0].zonas.nombre', width: 220},
          { text: 'Area', value:'area', width: 90},
          { text: 'Activo', value:'activo', width: 100},
          { text: 'Op', value: 'accion', sortable: false },
        ]
      } else {
        this.headers = [
          { text: 'Código', value: 'tercero.id', width: 90, align: 'right', sortable: false },
          { text: 'Nombre', value:'tercero.nombre', width: 550},
          { text: 'Fiscal', value:'tercero.responsable.abrev', width: 60},
          { text: 'Doc', value:'tercero.documento.nombre', width: 160},
          { text: 'Nro', value:'tercero.cuit', width: 90},
          { text: 'Zona', value:'tercero.direcciones[0].zona[0].zonas.nombre', width: 200},
          { text: 'CtaCte', value:'ctacte', width: 100},
          { text: 'Activo', value:'activo', width: 100},
        ]
        if (this.cual==2||this.cual==4||this.cual==6||this.cual==7||this.userId==1) {
          this.headers.splice(5,1)
        }
        if (this.userId==1) {
          this.headers.push({ text: 'Bloq.', value: 'tercero.user.activo', width: 110 })
        }
        this.headers.push(
          { text: 'Op', value: 'accion', sortable: false }
        )
      }
      this.listarHTTP();
    },

    clickRow(value) {
      if (value.tercero_id==2) {  // CONSUMIDOR FINAL, CUENTA GENERAL, NO SE MODIFICA
        return
      }
      this.itemActual = value
      this.puedeEditar = false
      if ((this.itemActual.tercero.creador.id == this.userId)||
          (this.itemActual.tercero.user.id==this.userId)||
          (this.tipo=='PP'&&this.exclusivoDe.id==this.userId)) {
        this.puedeEditar = true
      }
      this.editar(this.itemActual)
    },

    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      this.puedeEditar = false
      // Puede editar cuando el usuario del tercero es = al usuario actual
      if (this.itemActual.tercero.creador.id == this.userId && this.itemActual.tercero.id!=2) {
        this.puedeEditar = true
      }
      debugger
      if (this.itemActual.tercero.id!=2) {
        this.acciones.push({nombre: 'Editar', icon: 'mdi-pencil'})
        if (this.itemActual.activo) {
          this.acciones.push({nombre: 'Desactivar', icon: 'mdi-thumb-down-outline'})
        } else {
          this.acciones.push({nombre: 'Activar', icon: 'mdi-thumb-up-outline'})
        }
      }
      if (this.tipoTer === 'Cliente' && !this.itemActual.tercero.user && this.itemActual.tercero.id!=2) {
        this.acciones.push({nombre: 'Invitar a usar GOHU', icon: 'mdi-gift'})
      }
//    if (this.tipoTer === 'Cliente' && !this.itemActual.tercero.user && this.itemActual.tercero.id!=2 && this.tipo=='PP') {
      if (this.tipoTer === 'Cliente' && !this.itemActual.tercero.user && this.itemActual.tercero.id!=2) {
        this.acciones.push({nombre: 'Generar Cuenta Exclusiva en GOHU', icon: 'mdi-account-check'})
      }
      this.acciones.push({nombre: 'Datos Fiscales', icon: 'mdi-television-guide'})
      if (this.tipoTer === 'Cliente' && this.userId==1) {
        if (moment(this.itemActual.tercero.user.vencimiento).format('YYYY-MM-DD')<moment().format('YYYY-MM-DD')) {
          this.acciones.push({nombre: 'Desbloquear Licencia', icon: 'mdi-thumb-up-outline'})
        } else {
          this.acciones.push({nombre: 'Bloquear Licencia', icon: 'mdi-thumb-down-outline'})
        }
      }
      if (this.itemActual.tercero.user!=undefined) {
        if (this.itemActual.tercero.user.userexclusivo_id==this.userId) {
          this.acciones.push({nombre: 'Cambiar su Password', icon: 'fingerprint'})
        }
      }
      debugger
      if (this.itemActual.tercero.user && this.itemActual.tercero.id!=2) {
        this.acciones.push({nombre: '¿Saldos Espejados?', icon: 'mdi-code-equal'})
      }
    },

    selAccion(item) {
      debugger
      if (item.nombre=='Editar' || item.nombre=='Ver') {
        this.editar(this.itemActual)
      } else if (item.nombre=='Activar') {
        this.activarDesactivarTerceroHTTP(this.itemActual,1)
      } else if (item.nombre=='Desactivar') {
        this.desactivarTercero(this.itemActual)
      } else if (item.nombre=='Invitar a usar GOHU') {
        this.invitar()
      } else if (item.nombre=='Generar Cuenta Exclusiva en GOHU') {
        this.registrarEnGohu(this.itemActual)
      } else if (item.nombre=='Datos Fiscales') {
        return HTTP().post('/datosfiscales/', { id: this.itemActual.tercero_id }, { timeout: 25000 }).then(( data ) => {

          this.msg.msgTitle = 'Datos Fiscales'
          let d = ''
          if (data.data.datosGenerales==undefined) {

            d = '¡No hay datos fiscales!<br>'
            d += 'Puede deberse a problemas con AFIP o con e CUIT asignado '
            d += 'para consultas de padrones.'

          } else {

            d =  '<table>'
            d += '<tr><td style="text-align:left">Tipo de Persona</td>'
            d += '<td style="text-align:left"><b>'
            d += '\xa0\xa0'+data.data.datosGenerales.tipoPersona+'</td></b></tr>'
  
            d += '<tr><td style="text-align:left">Razón Social</td>'
            d += '<td style="text-align:left"><b>'
            if (data.data.datosGenerales.tipoPersona=='FISICA') {
              d += '\xa0\xa0'+data.data.datosGenerales.nombre
            } else if (data.data.datosGenerales.tipoPersona=='JURIDICA') {
              d += '\xa0\xa0'+data.data.datosGenerales.razonSocial
            }
            d += '</td></b></tr>'

            d += '<tr><td style="text-align:left">CUIT</td>'
            d += '<td style="text-align:left"><b>'
            d += '\xa0\xa0'+data.data.datosGenerales.idPersona
            d += '</td></b></tr>'

            let responsable = 'RESPONSABLE INSCRIPTO'
            if (data.data.datosMonotributo!=undefined) {
              responsable = 'MONOTRIBUTO'
            } else {
              if (data.data.datosRegimenGeneral!=undefined) {
                if (data.data.datosRegimenGeneral.impuesto) {
                  for (let x=0; x<=data.data.datosRegimenGeneral.impuesto.length-1; x++) {
                    if (data.data.datosRegimenGeneral.impuesto[x].descripcionImpuesto=='IVA EXENTO') {
                      responsable = 'EXENTO'
                      break
                    }
                    if (data.data.datosRegimenGeneral.impuesto[x].descripcionImpuesto=='IVA') {
                      responsable = 'RESPONSABLE INSCRIPTO'
                      break
                    }
                  }
                }
              }
            }
            d += '<tr><td style="text-align:left">Cond.IVA</td>'
            d += '<td style="text-align:left"><b>'
            d += '\xa0\xa0'+responsable+'</td></b></tr>'
  
            d += '<tr><td style="text-align:left">Estado en AFIP</td>'
            d += '<td style="text-align:left"><b>'
            d += '\xa0\xa0'+data.data.datosGenerales.estadoClave+'</td></b></tr>'
  
            d += '<tr><td style="text-align:left">Domicilio</td>'
            d += '<td style="text-align:left"><b>'
            d += '\xa0\xa0'+data.data.datosGenerales.domicilioFiscal.direccion+'</td></b></tr>'
  
            d += '<tr><td style="text-align:left">Cod.Postal</td>'
            d += '<td style="text-align:left"><b>'
            d += '\xa0\xa0'+data.data.datosGenerales.domicilioFiscal.codPostal+'</td></b></tr>'
  
            d += '<tr><td style="text-align:left">Localidad</td>'
            d += '<td style="text-align:left"><b>'
            d += '\xa0\xa0'+data.data.datosGenerales.domicilioFiscal.localidad+'</td></b></tr>'
  
            d += '<tr><td style="text-align:left">Provincia</td>'
            d += '<td style="text-align:left"><b>'
            d += '\xa0\xa0'+data.data.datosGenerales.domicilioFiscal.descripcionProvincia
            d += '</b></td></tr></table>'
          }

          this.msg.msgBody = d
          this.msg.msgVisible = true
          this.msg.msgAccion = 'datos fiscales'
          this.msg.msgButtons = ['Cerrar']
        });
      } else if (item.nombre=='Bloquear Licencia') {
        this.bloquear(this.itemActual)
      } else if (item.nombre=='Desbloquear Licencia') {
        this.desbloquear(this.itemActual)
      } else if (item.nombre=='Cambiar su Password') {
        this.mailRegistro = this.itemActual.tercero.user.email
        this.passRegistro = ''
        this.dialogPasswordUserExclusivo = true
      } else if (item.nombre=='¿Saldos Espejados?') {
        return HTTP().get('/controlespejo/'+this.itemActual.tercero.user.id, { timeout: 2500 }).then(( data ) => {
          this.saldoEspejoPropio = data.data.saldoPropio
          this.saldoEspejoTercero = data.data.saldoTercero
          this.dialogSaldosEspejados = true
        })
      }
    },

    generaracceso() {
      this.dialogAcceso = true
      this.$refs.mail.focus()
    },

    guardaracceso() {
      this.msg.msgTitle = 'Confirmar Acceso'
      this.msg.msgBody = '¿Confirmas la cuenta en <b>gohu</b> para el usuario <b>'+this.editado.nombre+'</b>?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'confirmar acceso'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    roles() {
    },

    cargoChequeras(item) {
      this.dialogChequera = true
      this.editedIndexCuenta = this.cuentas.indexOf(item);
      this.chequeras = [];
      let che = item.chequeras;
      let lib = 0
      for (let i=0; i<=che.length-1; i++) {
        lib = 0
        for (let j=0; j<=che[i].loscheques.length-1; j++) {
          if (che[i].loscheques[j].comprobante_id==null) {
            lib ++
          }
        }
        this.chequeras.push({
          id: che[i].id,
          echeq: che[i].echeq,
          activo: che[i].activo,
          nombre: che[i].nombre,
          libres: che[i].echeq?0:lib,
          cheques: che[i].cheques,
          loscheques: che[i].loscheques,
          primer_numero: che[i].primer_numero,
          tercerocuenta_id: che[i].tercerocuenta_id,
        })
      }
    },

    veoChequeras(item) {
      this.dialogChequera = true
      this.editedIndexChequera = this.chequeras.indexOf(item)
      this.chequeras = [];
      let che = item.chequeras;
      let lib = 0
      for (let i=0; i<=che.length-1; i++) {
        lib = 0
        for (let j=0; j<=che[i].loscheques.length-1; j++) {
          if (che[i].loscheques[j].comprobante_id==null) {
            lib ++
          }
        }
        this.chequeras.push({
          id: che[i].id,
          echeq: che[i].echeq,
          activo: che[i].activo,
          nombre: che[i].nombre,
          libres: che[i].echeq?0:lib,
          cheques: che[i].cheques,
          loscheques: che[i].loscheques,
          primer_numero: che[i].primer_numero,
          tercerocuenta_id: che[i].tercerocuenta_id,
        })
      }
    },

    cargoTarjetas(item) {
      this.dialogTarjeta = true
      this.editedIndexCuenta = this.cuentas.indexOf(item);
      this.tarjetas = item.tarjetas;
    },

    chequeraEdit(item) {
      this.dialogChequeraEdit = true
    },

    nuevoTercero() {
      this.tabInicial = 'pri';
      this.editedIndex = -1;
      this.editado = Object.assign({}, this.defaultItem);
      this.dialog = true;
      this.puedeEditar = true;
      this.direcciones = [];
      this.con = [];
      this.cuentas = [];
      this.terceroTipoSeleccionado = [];
      this.contactos = [];
    },

    nuevaDireccion() {
      this.dialogDir = true;
      //this.editadoDir = this.defaultItemDir;
      this.editadoDir = Object.assign({}, this.defaultItemDir);
    },

    nuevoContacto() {
      this.dialogCon = true;
      this.editadoCon = Object.assign({}, this.defaultItemCon);
    },

    nuevaPromo() {
      this.dialogPromo = true;
      this.editadoPromo = Object.assign({}, this.defaultItemPromo);
    },

    nuevaChequera() {
      this.editedIndexChequera = -1;
      this.dialogChequeraEdit = true;
      this.editadoChequera = Object.assign({}, this.defaultChequera);
      this.loscheques = []
    },

    nuevaTarjeta() {
      this.editedIndexTarjeta = -1;
      this.dialogTarjetaEdit = true;
      this.editadoTarjeta = Object.assign({}, this.defaultTarjeta);
      this.tarjetas = []
    },

    escribiendoNombre() {
      if (this.editedIndex===-1) {
        this.editado.razon_social = this.editado.nombre
      }
    },

    activarTercero(item) {
      debugger
      return HTTP().post('activardesactivar', {usertercero_id: item.id, tipo_id: this.cual, valor: item}).then ((data) => {
        if (data.data=='error') {
          this.mensaje('¡Opps, se ha producido un error en el desactivacion de esta cuenta!', this.temas.snack_error_bg, 2500) 
        } else {
          this.mensaje('¡Cuenta '+item==1?'Activada':'Desactivada'+' exitosamente!', this.temas.forms_titulo_bg, 1500) 
          this.listarHTTP()
        }
      }).catch((err)=>{
        this.mensaje('¡Opps, se ha producido un error en el desactivacion de esta cuenta!', this.temas.snack_error_bg, 2500) 
      })

    },

    desactivarTercero(item) {
      debugger
      return HTTP().post('userterceropuededesactivar', {tercero_id: item.tercero_id}).then ((data) => {
        let m = ''
        if (data.data!=0) {
          this.msg.msgTitle = 'Error al Desactivar Cuenta'
          m = 'Esta cuenta posee un saldo de $'+this.formatoImporte(data.data)+' en Cuenta Corriente.<br>'
          m += 'Debe cancelarlos para poder desactivarla<br>'
          this.msg.msgAccion = 'error al desactivar tercero'
          this.msg.msgButtons = ['Aceptar']
        } else if (data.data==0) {
          this.msg.msgTitle = 'Desactivar Cuenta'
          m = '¿Confirmas desactivar a '+item.tercero.razon_social+'?<br><br>'
          m += 'Solo permanecerá invisible. En cualquier momento podrás volver a activarla'
          this.msg.msgAccion = 'desactivar tercero'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        }
        this.msg.msgBody = m
        this.msg.msgVisible = true
      })
    },
    
    bloquear(item) {
      this.msg.msgTitle = 'Bloquear Cuenta'
      this.msg.msgAccion = 'bloquear cuenta'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.msg.msgBody = '¿Confirma bloquear a '+item.tercero.razon_social+'?<br><br>'
      this.msg.msgVisible = true
    },

    desbloquear(item) {
      this.msg.msgTitle = 'Desbloquear Cuenta'
      this.msg.msgAccion = 'desbloquear cuenta'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.msg.msgBody = '¿Confirma desbloquear a '+item.tercero.razon_social+'?<br><br>'
      this.msg.msgVisible = true
    },

    bloquearCuentaHTTP(item) {
      HTTP().post('bloqueardesbloquearcuenta', {user_id: item.tercero.user.id, bloquear: true})
        .then ((data) => {
          if (data.data=='error') {
            this.mensaje('¡Opps, se ha producido un error en el bloqueo de esta cuenta!', this.temas.snack_error_bg, 2500) 
          } else {
            this.mensaje('¡Cuenta bloqueada exitosamente!', this.temas.forms_titulo_bg, 1500) 
            this.listarHTTP()
          }
        }).catch((err)=>{
          this.mensaje('¡Opps, se ha producido un error en el bloqueo de esta cuenta!', this.temas.snack_error_bg, 2500) 
        })
    },

    desbloquearCuentaHTTP(item) {
      HTTP().post('bloqueardesbloquearcuenta', {user_id: item.tercero.user.id, bloquear: false})
        .then ((data) => {
          if (data.data=='error') {
            this.mensaje('¡Opps, se ha producido un error al desbloquear esta cuenta!', this.temas.snack_error_bg, 2500) 
          } else {
            this.mensaje('¡Cuenta desbloqueada exitosamente!', this.temas.forms_titulo_bg, 1500) 
            this.listarHTTP()
          }
        }).catch((err)=>{
          this.mensaje('¡Opps, se ha producido un error en desbloquear esta cuenta!', this.temas.snack_error_bg, 2500) 
        })
    },

    activarDesactivarTerceroHTTP(item, valor) {
      debugger
      return HTTP().post('activardesactivar', {usertercero_id: item.id, tipo_id: this.cual, valor:valor}).then ((data) => {
        debugger
        if (data.data=='error') {
          let m = '¡Opps, se ha producido un error en '
          m += valor==1?'activar':'desactivar'
          m += ' esta cuenta!'
          this.mensaje(m, this.temas.snack_error_bg, 2500) 
        } else {
          let m = '¡Cuenta '
          m += valor==1?'activada':'desactivada'
          m += ' exitosamente!'
          this.mensaje(m, this.temas.forms_titulo_bg, 1500) 
          this.listarHTTP()
        }
      }).catch((err)=>{
        this.mensaje('¡Opps, se ha producido un error en el desactivacion de esta cuenta!', this.temas.snack_error_bg, 2500) 
      })
    },

    activarDesactivarCuenta(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    bloqueado(item) {
      if (item.tercero.user!=null) {
        let a = item.tercero.user.vencimiento.substring(0,10)
        let b = moment().format('YYYY-MM-DD')
        return a<b?'Sí':'No'
      } else {
        return 'No'
      }
    },

    activarDesactivarPromo(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    activarDesactivarDir(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    activarDesactivarCon(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    activarDesactivarChequera(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    msgRespuesta(op) {
      if (op==='Aceptar' || op==='Incorporar') {
        if (this.msg.msgAccion=='borrar direccion') {
          this.borrarDireccion(this.itemActual)
        } else if (this.msg.msgAccion=='borrar contacto') {
          this.borrarContacto(this.itemActual)
        } else if (this.msg.msgAccion=='borrar zona') {
          this.borrarZona(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          alert('exportando a XLS...')
        } else if (this.msg.msgAccion=='activar tercero') {
          this.activarDesactivarTerceroHTTP(this.itemActual,1)
        } else if (this.msg.msgAccion=='desactivar tercero') {
          this.activarDesactivarTerceroHTTP(this.itemActual,0)
        } else if (this.msg.msgAccion=='bloquear cuenta') {
          this.bloquearCuentaHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='desbloquear cuenta') { 
          this.desbloquearCuentaHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='Incorporar cuenta') {

          let tip = ''
          if (this.tipoTer === 'Cliente') {
            tip = '1'
          } else if (this.tipoTer === 'Proveedor') {
            tip = '2'
          } else if (this.tipoTer === 'Equipo') {
            tip = '3'
          } else if (this.tipoTer === 'Transportista') {
            tip = '4'
          } else if (this.tipoTer === 'Puntos de Retiro') {
            tip = '6'
          } else if (this.tipoTer === 'Terceros Estado/Servicios/Otros') {
            tip = '7'
          }

          debugger
          // REALIZA LA INCORPORACION
          return HTTP().post('/agregotercerodesdegohu', {
            user_id: this.userId,
            tercero_id: this.terceroAIncorporar, tipo_id: tip })
            .then(({data}) => {
              debugger
              if (data=='ok') {
                this.mensaje('¡Incorporación Exitosa!', this.temas.forms_titulo_bg, 2500) 
              } else if (data=='error') {
                this.mensaje('¡Opps!, Se ha producido un error!', this.temas.snack_error_bg, 2500);
              }
              this.msg.msgVisible = false;
              this.cancelar();
              this.listarHTTP();
            });
        } else if (this.msg.msgAccion=='confirmar acceso') {
          this.guardarAccesoHTTP(this.itemActual)
        }

      } else if (op==='Cancelar') {
        if (this.msg.msgAccion=='incorporar cuenta') {
          this.cancelar();
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

    getArea (area) {
      if (area==='V') {
        return 'Vendedor'
      } else if (area==='A') {
        return 'Adminisración'
      } else if (area==='R') {
        return 'Repartidor'
      } else if (area=='X') {
        return 'Vendedor y Repartidor'
      }
    },

    setAreaLaboral() {
      /*
      this.viajesConfig = []
      for (let i=0; i<=this.viajesConfigAll.length-1; i++) {
        if (this.editado.area=='L' && this.viajesConfigAll[i].repartos) {
          this.viajesConfig.push(this.viajesConfigAll[i])
        } else if (this.editado.area=='V' && this.viajesConfigAll[i].ventas) {
          this.viajesConfig.push(this.viajesConfigAll[i])
        } else if (this.editado.area=='A') {
          //this.viajesConfig.push(this.viajesConfigAll[i])
        }
      }
      */
    },

    buscoNombre(event) {
      debugger
      const nom = event.target.value
      return HTTP().get(`/indexter/exists/${nom}`).then(({ data }) => {
        debugger
        if(data.length>0) {
          this.mensaje('¡El nombre ingresado ya existe.!', this.temas.forms_titulo_bg, 1500) 
          this.$refs.nombre.focus()
        }
      });
    },
        
    listarHTTP() {
      let sea = this.search==''?'%%':'%'+this.search+'%'
      return HTTP().get('/indexter/'+this.verCuentasInactivas+'/'+this.cual+'/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/'+sea)
        .then(({data})=>{
          debugger
          this.items = data;
          this.itemsAll = data;
      });
    },

    seleccionoTag() {
      if (this.tagsValue==undefined) {
        this.items = this.itemsAll
      } else {
        this.items = []
        for (let i=0; i<=this.itemsAll.length-1; i++) {
          let pos = this.itemsAll[i].tags.findIndex(x => x.nombre == this.tagsValue)
          if (pos!=-1) {
            this.items.push(this.itemsAll[i])
          }
        }
      }
    },

    altaHTTP() {
      let tipo = 0
      if (     this.tipoTer === 'Cliente')          { tipo = 1 }
      else if (this.tipoTer === 'Proveedor')        { tipo = 2 }
      else if (this.tipoTer === 'Equipo')           { tipo = 3 }
      else if (this.tipoTer === 'Transportista')    { tipo = 4 }
      else if (this.tipoTer === 'Puntos de Retiro') { tipo = 6 }
      else if (this.tipoTer === 'Terceros Estado/Servicios/Otros')  { tipo = 7 }

      return HTTP().post('/indexter', {
        nombre: this.editado.nombre,
        razon_social: this.editado.razon_social,
        responsable_id: this.editado.responsable_id,
        documento_id: this.editado.documento_id,
        cuit: this.editado.cuit,
        observaciones: this.editado.observaciones,
        ctacte: this.editado.ctacte,
        diasvenc: this.editado.diasvenc,
        bonificacionmaxima: this.editado.bonificacionmaxima,
        creditomaximo: this.editado.creditomaximo,
        maxdiaschq: this.editado.maxdiaschq,
        porrev: this.editado.porrev.toString(),
        comision: this.editado.comision,
        cobcompedcli: this.editado.cobcompedcli,
        pedtransfavend: this.editado.pedtransfavend,
        creador_id: this.userId,
        activo: true,
        tipo: tipo,
        area: this.editado.area,
        direcciones: this.direcciones,
        contactos: this.contactos,
        cuentas: this.cuentas,
        tags: this.editado.tags,
        }).then(({ data }) => {
          if (data.error!=undefined) {
            this.mensaje(data.error, this.temas.forms_titulo_bg, 2500) 
          } else {
            this.mensaje('¡Alta Exitosa!', this.temas.forms_titulo_bg, 2500) 
              // vuelvo a cargar los tags por si agrego alguno
            return HTTP().get('/tagsterceros').then(({ data }) => {
              this.tagsItems = []
              this.tagsValue = []
              data.forEach(el => { this.tagsItems.push(el.nombre) });
              data.forEach(el => { this.tagsObj.push(el)});
              this.listarHTTP();
            })
          }  
        });
    },

    editarHTTP:function(data) {

      let porRevUser = data.porrevuser
      // actualizo datosEmpresa.cuentas, por si agrego alguna cuenta y se tenga que reflejar en pagos.
      this.$store.commit('setDatosEmpresaCuentas'  , data.cuentas, { root: true} )
      return HTTP().patch(`/indexter/${data.tercero_id}`, data).then(( data ) => {
        this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500) 
        // vuelvo a cargar los tags por si agrego alguno
        return HTTP().get('/tagsterceros').then(({ data }) => {
          this.tagsItems = []
          this.tagsValue = []
          data.forEach(el => { this.tagsItems.push(el.nombre) });
          data.forEach(el => { this.tagsObj.push(el)});
          if (this.porRevUserPos!=-1) {
            let aux = []  // solo puedo modificar el store con un commmit
            for (let i=0; i<=this.vinculosPadresLic.length-1; i++) {
              aux.push(this.vinculosPadresLic[i])
            }
            if (this.porRevUserPos!=null) {
              aux[this.porRevUserPos].porrev = porRevUser
              this.$store.commit('setVinculosPadresLic', aux, { root: true });
            }
          }
          this.listarHTTP();
        })
      });
    },

    borrarHTTP:function(id) {
      return HTTP().delete(`/indexter/${id}`).then(() => {
        this.listarHTTP();
      });
    },

    guardarAccesoHTTP() {
      return HTTP().post('/generaraccesogohu', {
        username: this.editado.nombre,
        email: this.terUser.email,
        password: '123', //this.terUser.password,
        tercero_id: this.editado.tercero_id,
        user_id: this.userId,
        level: 3,
        tipo: this.tipo,
        activo: 1,
        sucursales: this.sucursales,
        }).then(({ data }) => {
          this.dialogAcceso = false
          this.terUser.id = null
          this.terUser.username = this.editado.nombre
          this.terUser.email = this.terUser.email
          this.terUser.password = null
        });
    },

    generarClienteGohuHTTP ( item ) {
      return HTTP().post('/generaraccesogohu', {
        username: item.tercero.nombre,
        email: this.mailRegistro,
        password: this.passRegistro,
        tercero_id: item.tercero.id,
        user_id: null,
        level: 2,
        usaelsistema: this.editado.user.usaelsistema,
        activo: 1,
        sucursales: [],
        }).then(({ data }) => {
          if (data=='ya existe') {
            this.mensaje('Usuario ya registrado. Verifique en Vinculaciones!', this.temas.forms_titulo_bg, 2500);
          } else if (data=='error') {
            this.mensaje('¡Opps!, Se ha producido un error!', this.temas.snack_error_bg, 2500);
          } else {
            this.mensaje('¡La Cuenta se ha creado con éxito!', this.temas.forms_titulo_bg, 1500);
            this.dialogRegistroEnGohu = false;
            this.listarHTTP();
          }
        })
    },

    asignarNuevoPasswordClienteHTTP(item) {
      return HTTP().post('/cambiarpasswordclienteexclusivo', {
        user_id: item.tercero.user.id,
        password: this.passRegistro,
        }).then(({ data }) => {
          if (data=='ok') {
            this.mensaje('La contraseña asignada a este Cliente ha cambiado correctamente!', this.temas.forms_titulo_bg, 2500);
          } else if (data=='error') {
            this.mensaje('¡Opps!, Se ha producido un error!', this.temas.snack_error_bg, 2500);
          }
          this.dialogPasswordUserExclusivo = false
        })
    },

    editar (item) {

      debugger
      this.editado.porrevuser = null
      this.editado.porrevuserid = null
      if (item.tercero.user!=null) {

        this.porRevUserPos = this.vinculosPadresLic.findIndex(x=>x.user_id==item.tercero.user.id)
        if (this.porRevUserPos!=-1) {
          this.editado.porrevuser = this.vinculosPadresLic[this.porRevUserPos].porrev
          this.editado.porrevuserid = this.vinculosPadresLic[this.porRevUserPos].vinculo_id
        }
      }
      this.editedIndex = this.items.indexOf(item);    // si this.editIndex es = -1 es una alta.
      this.editado.id = item.id
      this.editado.tercero_id = item.tercero_id
      this.editado.nombre = item.tercero.nombre
      this.editado.razon_social = item.tercero.razon_social
      this.editado.responsable_id = item.tercero.responsable_id
      this.editado.documento_id = item.tercero.documento_id
      this.editado.cuit = item.tercero.cuit
      this.editado.observaciones = item.observaciones
      this.editado.ctacte = item.ctacte
      this.editado.diasvenc = item.diasvenc
      this.editado.creditomaximo = item.creditomaximo
      this.editado.bonificacionmaxima = item.bonificacionmaxima
      this.editado.maxdiaschq = item.maxdiaschq
      this.editado.porrev = item.porrev==null?'1':item.porrev.toString()
      this.editado.comision = item.comision
      this.editado.cobcompedcli = item.cobcompedcli
      this.editado.pedtransfavend = item.pedtransfavend
      this.editado.creador.username = item.tercero.creador?item.tercero.creador.username:''
      this.editado.creador.id = item.tercero.creador?item.tercero.creador.id:null
      this.editado.activo = item.activo
      this.editado.area = item.area
      this.editado.lista_id = item.lista_id
      this.editado.cuentas = item.tercero.cuentas;

      if(item.tercero.user) {
        this.editado.user.id = item.tercero.user.id
        this.editado.user.username = item.tercero.user.username
        this.editado.user.codigo = item.tercero.user.codigo
        this.editado.user.usaelsistema = item.tercero.user.usaelsistema
        this.editado.user.administraGohu = item.tercero.user.administragohu
      }
      this.tagsValue = []
      item.tags.forEach(el => { this.tagsValue.push(el.nombre) });

      this.esUsuarioGohu = item.tercero.user ? true : false
      this.tercerosZonas = []

      debugger
      for (let i=0; i<=item.zonas.length-1; i++) {
        this.tercerosZonas.push({
          id:             item.zonas[i].id,
          usertercero_id: item.zonas[i].usertercero_id,
          zona_id:        item.zonas[i].zona.id,
          nombre:         item.zonas[i].zona.nombre,
          activo:         item.zonas[i].activo,
          clientes:       item.zonas[i].clientes,
        })
      }
      this.userterceroid = item.id
      this.dialog = true
      this.terceroTipoSeleccionado = item.terceroTipos
      this.cuentas = item.tercero.cuentas
      this.terUser.id       = null
      this.terUser.username = null
      this.terUser.email    = null
      this.terUser.password = null

      this.edicionRestringida = false
//    if (item.tercero.creador.id!=this.userId&&this.userId!=item.user.id) {
      if (item.tercero.creador.id!=this.userId&&this.userId!=item.tercero.user_id) {
        this.edicionRestringida = item.tercero.creador.id!=this.userId;
      }

      if (item.tercero.user) {
        this.terUser.id         = item.tercero.user.id
        this.terUser.username   = item.tercero.user.username
        this.terUser.email      = item.tercero.user.email
        this.terUser.password   = item.tercero.user.password
      }

      return HTTP().get('/usertercero_dirconsuc/'+this.editado.tercero_id+'/'+item.id).then(({ data }) => {
        this.sucsItems = [];
        this.sucsObj = [];
        this.sucsValue = [];
        this.tabsValue = [];
        this.contactos = [];
        this.direcciones = data.direcciones
        for(let i=0; i<=this.sucursales.length-1; i++) {
          this.sucsItems.push(this.sucursales[i].nombre)
          //this.sucsValue.push(this.sucursales[i].nombre)
        }
        for (let i=0; i<=data.sucursales.length-1; i++) {
          this.sucsValue.push(data.sucursales[i].sucursal.nombre)
          this.sucsObj.push({
            id: data.sucursales[i].id,
            sucursal_id: data.sucursales[i].sucursal_id,
            nombre: data.sucursales[i].sucursal.nombre,
            usertercero_id: data.sucursales[i].usertercero_id,
            created_at: data.sucursales[i].created_at,
            updated_at: data.sucursales[i].updated_at,
          })
        }
        for(let i=0; i<=data.contactos.length-1; i++) {
          this.contactos.push({
            tipo_id: data.contactos[i].contacto_tipo_id, 
            observaciones: data.contactos[i].observaciones,
            icono: data.contactos[i].contactoTipo.icono,
            activo: data.contactos[i].activo
          })
        }
        if (this.cual==3 && this.editado.user!=null) {
          return HTTP().post('/roles',{user: this.editado.user.id,sucursal: this.sucursal}).then(({ data }) => {
            for (let j=0; j<=this.opItems.length-1; j++) {
              this.opItems[j].acceder = false
              this.opItems[j].agregar = false
              this.opItems[j].editar = false
              this.opItems[j].desactivar = false
            }
            for (let i=0; i<=data.length-1; i++) {
              for (let j=0; j<=this.opItems.length-1; j++) {
                if (data[i].opcion_id == this.opItems[j].id) {
                  this.opItems[j].acceder = data[i].acceder
                  this.opItems[j].agregar = data[i].agregar
                  this.opItems[j].editar = data[i].editar
                  this.opItems[j].desactivar = data[i].desactivar
                  break
                }
              }
            }
            this.setAreaLaboral()
            this.fetchOpciones()
          })
        }
        this.locateGeoLocation();
      })
    },

    editarDir (item) {
      this.editedIndexDir = this.direcciones.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.editadoDir = Object.assign({}, item);
      this.editadoDir.lazona = {
        id:null,tercerodireccion_id:null,usertercero_id:null,zona_id:null,zonas:{id:null,nombre:null}
      }
      if (item.lazona&&this.editedIndexDir!=-1) {
        this.editadoDir.lazona.zona_id = item.lazona.zona_id
      }
      this.dialogDir = true;
    },

    editarCon (item) {
      this.editadoCon = Object.assign({}, item);
      this.editedIndexCon = this.contactos.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogCon = true;
    },

    editarPromo (item) {
      this.editadoPromo = Object.assign({}, item);
      this.editedIndexPromo = this.lis.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogPromo = true;
    },

    editarCuenta (item) {
      this.editadoCuenta = Object.assign({}, item);
      this.editedIndexCuenta = this.cuentas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogCuenta = true;
    },

    editarZona (item) {
      this.editadoZona = Object.assign({}, item);
      this.editedIndexZona = this.tercerosZonas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogZona = true;
    },

    nuevaZona() {
      this.editedIndexZona = -1
      this.itemsZonasFil = []
      return HTTP().post('/zonasocupadas',{area: this.editado.area }).then(({ data }) => {
        for (let i=0; i<=this.itemsZonas.length-1; i++) {
          if (data.findIndex(x=>x.zona_id==this.itemsZonas[i].id)==-1) {
            this.itemsZonasFil.push(this.itemsZonas[i]);
          }
        }
        this.dialogZona = true
      })
    },

    editarTarjeta (item) {
      this.editadoTarjeta = Object.assign({}, item);
      this.editedIndexTarjeta = this.tarjetas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogTarjetaEdit = true;
    },

    editarChequera (item) {
      this.editadoChequera = Object.assign({}, item);
      this.editedIndexChequera = this.chequeras.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogChequeraEdit = true;
      this.loscheques = item.loscheques
    },

    preguntoBorrarCon (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.editedIndexCon = this.contactos.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.contactos[this.editedIndexCon].observaciones
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar contacto'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    /*
    preguntoBorrarCuenta (item) {
      this.editedIndexCuenta = this.cuentas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.cuentas[this.editedIndexCuenta].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      //this.itemActual = item;
    },
    */

    preguntoBorrarZona (item) {
      this.editedIndexZona = this.tercerosZonas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar la zona '+this.tercerosZonas[this.editedIndexZona].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar zona'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    exportarAPDF () {
      this.msg.msgTitle = 'Exportar a PDF'
      this.msg.msgBody = 'Desea exportar los datos a PDF'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a PDF'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    exportarAXLS () {
      return HTTP().get('/revisocuits', { timeout: 33333000 })  // SACAR ESTO, ES SOLO PARA IMPORTAR CUITS ALEATORIOS
        .then(({ data }) => {
          let dat = []
          for (let i=0; i<=data.length-1; i++) {
            if (data[i].cuit.datosGenerales) {
              dat.push({
                cuit:      data[i].cuit.datosGenerales.idPersona,
                nombre:    data[i].cuit.datosGenerales.razonSocial,
                direccion: data[i].cuit.datosGenerales.domicilioFiscal.direccion,
                codpostal: data[i].cuit.datosGenerales.domicilioFiscal.codPostal,
                provincia: data[i].cuit.datosGenerales.domicilioFiscal.idProvincia,
              })
            } else if (data[i].cuit.errorConstancia) {
//              dat.push({
//                cuit:      data[i].cuit.errorConstancia.idPersona,
//                nombre:    data[i].cuit.errorConstancia.error[0],
//                direccion: null,
//                codpostal: null,
//                provincia: null,
//              })
            }
          }
          let d = XLSX.utils.json_to_sheet(dat)
          const workbook = XLSX.utils.book_new()
          const filename = 'clientes'
          XLSX.utils.book_append_sheet(workbook, d, filename)
          XLSX.writeFile(workbook, `${filename}.xlsx`)
        })

/*
      let datos = []
      for (let i=0; i<=this.items.length-1; i++) {
        datos.push({
          id: this.items[i].tercero_id,
          nombre: this.items[i].tercero.nombre,
          documento: this.items[i].tercero.cuit,
          ctacte: this.items[i].ctacte==1 ? 'Si' : 'No',
          credito: this.items[i].creditomaximo,
          diasVen: this.items[i].diasvenc,
          direccion: this.items[i].tercero.direcciones[0].direccion,
//        ciudad: this.items[i].tercero.direcciones[0].postal.nombre,
        })
      }

      let data = XLSX.utils.json_to_sheet(datos)
      const workbook = XLSX.utils.book_new()
      const filename = 'clientes'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)


//      this.msg.msgTitle = 'Exportar a XLS'
//      this.msg.msgBody = 'Desea exportar los datos a XLS'
//      this.msg.msgVisible = true
//      this.msg.msgAccion = 'exportar a XLS'
//      this.msg.msgButtons = ['Aceptar','Cancelar']
  
  */
    
    },

    agregarTerceros() {
      this.dialogAgregarTerceros = true
      return HTTP().get('/todoslosterceros/'+this.cual).then(({ data }) => {
        this.terceros = data;
      })
    },

    asignarNuevosTerceros() {
      return HTTP().post('/asignarnuevosterceros', {nuevos: this.tercerosSeleccionados,tipo_id: this.cual}).then(({data})=>{
        this.dialogAgregarTerceros = false
        this.tercerosSeleccionados = []
        if (data=='error') {
          this.mensaje('¡Opps!, Se ha producido un error!', this.temas.snack_error_bg, 2500) 
        } else {
          this.mensaje('¡La operación se ha realizado con éxito!', this.temas.forms_titulo_bg, 1500) 
          this.listarHTTP()
        }
      })
    },

    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHTTP(this.items[index].id);
      this.mensaje('¡Se eliminó el registro.!', this.temas.forms_titulo_bg, 1500) 
    },

    borrarDireccion (item) {
      const index = this.direcciones.indexOf(item);
      this.direcciones.splice(index, 1)
    },

    borrarContacto (item) {
      const index = this.contactos.indexOf(item);
      this.contactos.splice(index, 1)
    },

    borrarZona (item) {
      const index = this.tercerosZonas.indexOf(item);
      this.tercerosZonas.splice(index, 1)
    },

    cancelar() {
      this.dialog = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },

    cancelarDir() {
      this.dialogDir = false;
      this.editadoDir = Object.assign({}, this.defaultItemDir);
      this.editedIndexDir = -1;
    },

    cancelarPromo() {
      this.dialogPromo = false;
      this.editadoPromo = Object.assign({}, this.defaultItemPromo);
      this.editedIndexPromo = -1;
    },

    cancelarCon() {
      this.dialogCon = false;
      this.editadoCon = Object.assign({}, this.defaultItemCon);
      this.editedIndexCon = -1;
    },

    cancelarCuenta() {
      this.dialogCuenta = false;
      this.editadoCuenta = Object.assign({}, this.defaultItemCuenta);
      this.editedIndexCuenta = -1;
    },

    cancelarChequeraEdit() {
      this.dialogChequeraEdit = false
    },

    cancelarTarjetaEdit() {
      this.dialogTarjetaEdit = false
    },

    cancelarZona() {
      this.dialogZona = false;
      this.editadoZona = Object.assign({}, this.defaultItemZona);
      this.editedIndexZona = -1;
    },

    leerMasSobrePrecios() {
      this.dialogLeerMasSobrePrecios = true
    },

    guardar() {
      if (this.editado.user) {
        if (this.editado.user.id == this.userId) {
          let hayCuentaPredeterminada = false
          if (this.cuentas.length>0) {
            for (let i=0; i<=this.cuentas.length-1; i++) {
              if (this.cuentas[i].predeterminada) {
                hayCuentaPredeterminada = true
              }
            }
            if (!hayCuentaPredeterminada) {
              this.msg.msgTitle = 'Atención!'
              this.msg.msgBody = 'Debe especificar una cuenta bancaria como predeterminada!.<br>Para que sus clientes sepan con que cuenta operar.'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'Cuenta Bancaria Predeterminada'
              this.msg.msgButtons = ['Aceptar']
              this.dialog = true
              return
            }
          } else {
            this.mensaje('¡Debes ingresar Cuentas Bancarias si quiere que sus clientes la utilicen para realizarle pagos!', this.temas.forms_titulo_bg, 3500) 
          }
        }
      }
      this.editado.responsable_id = this.editado.responsable_id;
      this.editado.documento_id = this.editado.documento_id;
      this.editado.tipos = this.terceroTipoSeleccionado;
      this.editado.direcciones = this.direcciones;
      this.editado.contactos = this.contactos;
      this.editado.cuentas = this.cuentas;
      this.editado.promos = this.promos;
      this.editado.tercerosZonas = this.tercerosZonas;
      this.editado.usertercero_id = this.userterceroid;

      // AGREGO LOS TAGS
      let aux = [];
      for(let i=0; i<=this.tagsValue.length-1; i++ ) {
        let nuevo = true
        for(let j=0; j<=this.tagsObj.length-1; j++) {
          if(this.tagsValue[i]===this.tagsObj[j].nombre) {
            nuevo = false
            aux.push(this.tagsObj[j])
            break
          }
        }
        if (nuevo) {
          aux.push({
            id: null,
            nombre: this.tagsValue[i],
            user_id: this.userId,
            created_at: moment().format('YYYY-MM-DD'),
            updated_at: moment().format('YYYY-MM-DD'),
          })
        }
      }
      this.editado.tags = aux;

      // AGREGO LAS SUCURSALES
      aux = []
      for(let i=0; i<=this.sucsValue.length-1; i++ ) {
        let nuevo = true
        for(let j=0; j<=this.sucsObj.length-1; j++) {
          if(this.sucsValue[i]===this.sucsObj[j].nombre) {
            nuevo = false
            aux.push(this.sucsObj[j])
            break
          }
        }
        if (nuevo) {
          let pos = this.sucursales.findIndex(x=>x.nombre==this.sucsValue[i])
          aux.push({ 
            id: null, 
            sucursal_id: this.sucursales[pos].id, 
            nombre: this.sucsValue[i], 
            usertercero_id: null, 
            created_at: moment().format('YYYY-MM-DD'),
            updated_at: moment().format('YYYY-MM-DD'),
          })
        }
      }
      this.editado.sucursales = aux;

      if (this.editedIndex > -1) { // esta modificando
        this.id = this.editado.id;
        this.editarHTTP(this.editado);
      } else {
        this.altaHTTP();
      }
      this.cancelar();
    },

    guardarDir(item) {
      let zon = this.itemsZonas.find(e => e.id == item.lazona.zona_id);
      if (zon == undefined) {
        zon = {id: null, nombre: null}
      }
      if (this.editedIndexDir > -1) { // esta modificando
        this.direcciones[this.editedIndexDir].direccion = this.editadoDir.direccion;
        this.direcciones[this.editedIndexDir].postal_id = this.$refs.postal.selectedItem.id;
        if (this.direcciones[this.editedIndexDir].lazona==null) {
          this.direcciones[this.editedIndexDir].lazona = {
            lazona: { 
              id: null,
              tercerodireccion_id: null,
              usertercero_id: null,
              zona_id: this.tipoTer !='Vendedor' ? this.editadoDir.lazona.zona_id : null,
              zonas: {
                id: this.tipoTer !='Vendedor' ? zon.id : null,
                nombre: this.tipoTer !='Vendedor' ? zon.nombre : null
              }
            }
          }
        } else {
          this.direcciones[this.editedIndexDir].lazona.zona_id = this.editadoDir.lazona.zona_id
        }
        let z = null 
        let tipoEquipo = this.getArea(this.editado.area)
        if (tipoEquipo!='Vendedor' && zon!=undefined) {
          z = { 
            id: null,
            tercerodireccion_id: this.direcciones[this.editedIndexDir].id,
            usertercero_id: null,
            zona_id: tipoEquipo!='Vendedor' ? this.editadoDir.lazona.zona_id : null,
            zonas: {
              id: tipoEquipo!='Vendedor' ? zon.id : '',
              nombre: tipoEquipo!='Vendedor' ? zon.nombre : '' 
            }
          }
        } else {
          z = {id:null,tercerodireccion_id:null,usertercero_id:null,zona_id:null,zonas:{id:null,nombre:null }}
        }
        this.direcciones[this.editedIndexDir].lazona = z
      } else {
        let tipoEquipo = this.getArea(this.editado.area)
        this.direcciones.push({ 
          id: 0,
          direccion: this.editadoDir.direccion,
          postal: this.$refs.postal.selectedItem,
          postal_id: this.editadoDir.postal_id,
          activo: 1,
          zona_id: this.tipoTer !='Vendedor' ? this.editadoDir.lazona.zona_id : null,
          lazona: { 
            id: null,
            tercerodireccion_id: null,
            usertercero_id: null,
            zona_id: this.tipoTer !='Vendedor' ? this.editadoDir.lazona.zona_id : null,
            zonas: {
              id: this.tipoTer !='Vendedor' ? zon.id : null,
              nombre: this.tipoTer !='Vendedor' ? zon.nombre : null
            }
          },
        })
      }
      this.cancelarDir();
    },

    guardarCon(item) {
      let c = this.contactosTipos.find(e => e.id == this.editadoCon.tipo_id);
      if (this.editedIndexCon > -1) { // esta modificando
        this.contactos[this.editedIndexCon].tipo_id = this.editadoCon.tipo_id;
        this.contactos[this.editedIndexCon].icono = c.icono;
        this.contactos[this.editedIndexCon].observaciones = this.editadoCon.observaciones;
      } else {
        this.contactos.push({ 
          tipo_id: this.editadoCon.tipo_id, 
          observaciones: this.editadoCon.observaciones,
          icono: c.icono,
          activo: 1 
        })
      }
      this.dialogCon = false
    },

    guardarPromo(item) {
      let mUserTerceroId = 0
      if (this.editedIndex>=0) {
        mUserTerceroId = this.items[this.editedIndex].id;  
      }
      if (this.editedIndexPromo > -1) { // esta modificando
        this.promo[this.editedIndexPromo].nombre = this.editadoPromo.user_id;
      } else {
        this.promo.push({ 
          activo: 1,
          porrem: this.editadoPromo.porrem,
          user_id: this.editadoPromo.user_id,
          user_tercero_id: mUserTerceroId,
        })
      }
      this.dialogPromo = false;
    },

    nuevaCuentaBancaria() {
      this.dialogCuenta = true;
      this.editadoCuenta.nombre = 'CUENTA CORRIENTE';
      this.editadoCuenta.abrev = 'CC'
      this.editadoCuenta.predeterminada = true
    },

    guardarCuenta(item) {
      let mTerceroId = 0
      if (this.editedIndex>=0) {
        mTerceroId = this.items[this.editedIndex].tercero_id;
      }
      if (this.editedIndexCuenta > -1) { // esta modificando
        if (this.editadoCuenta.predeterminada) {
          for (let i=0; i<=this.cuentas.length-1; i++) {
            this.cuentas[i].predeterminada = 0
          }
        }
        this.cuentas[this.editedIndexCuenta].banco          = this.editadoCuenta.banco
        this.cuentas[this.editedIndexCuenta].nombre         = this.editadoCuenta.nombre
        this.cuentas[this.editedIndexCuenta].abrev          = this.editadoCuenta.abrev
        this.cuentas[this.editedIndexCuenta].banco_id       = this.editadoCuenta.banco_id
        this.cuentas[this.editedIndexCuenta].cuenta         = this.editadoCuenta.cuenta
        this.cuentas[this.editedIndexCuenta].cbu            = this.editadoCuenta.cbu
        this.cuentas[this.editedIndexCuenta].predeterminada = this.editadoCuenta.predeterminada
      } else {
        this.cuentas.push({ 
          id:             null,
          tercero_id:     mTerceroId,
          banco_id:       this.editadoCuenta.banco_id.id,
          nombre:         this.editadoCuenta.nombre,
          abrev:          this.editadoCuenta.abrev,
          cuenta:         this.editadoCuenta.cuenta,
          cbu:            this.editadoCuenta.cbu,
          predeterminada: this.editadoCuenta.predeterminada,
          activo:         1,
          banco:          this.editadoCuenta.banco_id,
          created_at:     null,
          updated_at:     null,
          chequeras:      [],
        })
      }
      this.dialogCuenta = false;
      this.editadoCuenta = Object.assign({}, this.defaultItemCuenta);
      this.editedIndexCuenta = -1;
    },

    guardarChequera(item) {
      let ch = []
      if (this.editedIndexChequera==-1) {
        this.editedIndexChequera = this.chequeras.length
        this.cuentas[this.editedIndexCuenta].chequeras.push({
          activo: true,
          cheques: 0,
          loscheques: [],
          id: null,
          nombre: null,
          echeq: false,
          primer_numero: null,
          tercero_id: null,
        })
        for (let i=Number(item.primer_numero); i<(Number(item.primer_numero)+Number(this.cttcheques)); i++) {
          ch.push({
            activo: 1,
            chequera_id: this.editedIndexChequera,
            comprobante_id: null,
            numero: i,
          })
        }
      } else {
        ch = this.cuentas[this.editedIndexCuenta].chequeras[this.editedIndexChequera].cheques
      }
      let x = this.editedIndexCuenta
      let y = this.editedIndexChequera
      this.cuentas[x].chequeras[y].id = null
      this.cuentas[x].chequeras[y].echeq = item.echeq
      this.cuentas[x].chequeras[y].activo = item.activo
      this.cuentas[x].chequeras[y].nombre = item.nombre
      this.cuentas[x].chequeras[y].cheques = ch.length
      this.cuentas[x].chequeras[y].loscheques = ch
      this.cuentas[x].chequeras[y].primer_numero = item.primer_numero
      this.chequeras = this.cuentas[x].chequeras
      this.dialogChequeraEdit = false
    },

    guardarTarjeta(item) {
      if (this.editedIndexTarjeta==-1) {
        this.editedIndexTarjeta = this.cuentas[this.editedIndexCuenta].tarjetas.length
        this.cuentas[this.editedIndexCuenta].tarjetas.push({
          activo: null,
          debito: null,
          id: null,
          tarjeta: null,
          tarjeta_id: null,
          tarjeta_numero: null,
          tarjeta_vencimiento: null,
          tercerocuenta_id: null,
        })
      }
      let x = this.editedIndexCuenta
      let y = this.editedIndexTarjeta
      this.cuentas[x].tarjetas[y].activo              = item.activo
      this.cuentas[x].tarjetas[y].debito              = item.debito
      this.cuentas[x].tarjetas[y].id                  = item.id
      this.cuentas[x].tarjetas[y].tarjeta_id          = item.tarjeta_id.id
      this.cuentas[x].tarjetas[y].tarjeta             = item.tarjeta_id
      this.cuentas[x].tarjetas[y].tarjeta_numero      = item.tarjeta_numero
      this.cuentas[x].tarjetas[y].tarjeta_vencimiento = item.tarjeta_vencimiento
      this.cuentas[x].tarjetas[y].tercerocuenta_id    = item.tercerocuenta_id
      this.tarjetas = this.cuentas[x].tarjetas
      this.dialogTarjetaEdit = false
    },

    guardarZona(item) {
      let mUserTerceroId = 0
      if (this.editedIndex>=0) {
        mUserTerceroId = this.items[this.editedIndex].id;
      }
      if (this.editedIndexZona > -1) { // esta modificando
        this.tercerosZonas[this.editedIndexZona].zona_id = this.editadoZona.zona_id.id
        this.tercerosZonas[this.editedIndexZona].nombre = this.editadoZona.zona_id.nombre
      } else {
        this.tercerosZonas.push({ 
          id:             null,
          usertercero_id: mUserTerceroId,
          zona_id:        this.editadoZona.zona_id.id,
          nombre:         this.editadoZona.zona_id.nombre,
          activo:         1,
        })
      }
      this.dialogZona = false;
      this.editadoZona = Object.assign({}, this.defaultItemZona);
      this.editedIndexZona = -1;
    },

    cerrarChequeras() {
      this.dialogChequera = false
      this.editadoChequera = Object.assign({}, this.defaultChequera);
      this.editedIndexChequera = -1;
      this.editado.cuentas[this.editedIndexCuenta].chequeras = this.chequeras
    },

    cerrarTarjetas() {
      this.dialogTarjeta = false
      this.editadoTarjeta = Object.assign({}, this.defaultTarjeta);
      this.editedIndexTarjeta = -1;
      this.editado.cuentas[this.editedIndexCuenta].tarjetas = this.tarjetas
    },

//  guardarChequeras(item) {
//    this.dialogChequera = false
//  },

    buscoDocumento (event) {
      this.cuentaYaAsignada = false
      if (this.editedIndex===-1) {  // SOLO SI ES UNA ALTA, VER QUE PASA SI CAMBIO EL DOCUMENTO
        const doc = event.target.value;
        if (doc=='') { return }
        return HTTP().get(`/tercerodocumento/${this.editado.documento_id}/${doc}/${this.cual}`, { timeout: 25000 }).then(( {data} )=>{
          if (data=='error') {
            this.terceroAIncorporar = null
            this.msg.msgTitle = 'Atención'
            this.msg.msgBody = '¡Si ingreso un CUIT es posible o que no tenga señal de internet o que su certificado de AFIP haya expirado.!'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'Error desconocido'
            this.msg.msgButtons = ['Aceptar']
            this.cuentaYaAsignada = true
            this.$refs.cuit.focus()
          } else  if (data=='existe'&&data.length>0) {
            this.terceroAIncorporar = null
            this.msg.msgTitle = 'Atención'
            this.msg.msgBody = '¡Ya tiene activa esta cuenta!<br>Ingrese su nombre o CUIT en <i>Buscar</i> del fomulario principal para encontrarla.'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'La cuenta ya existe'
            this.msg.msgButtons = ['Aceptar']
            this.cuentaYaAsignada = true
            this.$refs.cuit.focus()
          } else {
            if (this.editado.documento_id==25 || this.editado.documento_id==26) { // CUIT O CUIL
              // BUSCO EN AFIP Y NO ESTA!
              if (data=='') {
                this.terceroAIncorporar = null
                this.msg.msgTitle = 'Cuenta Inexistente en AFIP'
                this.msg.msgBody = 'AFIP no reconoce este CUIT!'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'CUIT Error'
                this.msg.msgButtons = ['Aceptar']
                //this.cuentaYaAsignada = true
                this.$refs.cuit.focus()
              } else {
                if (data.errorConstancia!=undefined) {
                  this.terceroAIncorporar = null
                  this.msg.msgTitle = 'Error en Constancia AFIP '
                  let msg = data.errorConstancia.apellido+','+data.errorConstancia.apellido+'<br>'
                  msg += data.errorConstancia.error[0]
                  this.msg.msgBody = msg
                  this.msg.msgVisible = true
                  this.msg.msgAccion = 'Cuenta ya incorporada'
                  this.msg.msgButtons = ['Aceptar']
                  //this.cuentaYaAsignada = true
                } else if (data.datosGenerales==undefined) {           // ECONTRO EN LA BASE DE DATOS
                  this.terceroAIncorporar = data[0].id
                  return HTTP().get(`/estaenusertercero/${data.id}`).then(({ data }) =>{
                    if (data) {
                      this.terceroAIncorporar = null
                      this.msg.msgTitle = 'Cuenta existente'
                      this.msg.msgBody = 'Esta cuenta ya esta incorporada en su base de datos!'
                      this.msg.msgVisible = true
                      this.msg.msgAccion = 'Cuenta ya incorporada'
                      this.msg.msgButtons = ['Aceptar']
                      this.cuentaYaAsignada = true
                    } else {
                      this.msg.msgTitle = 'Cuenta existente'
                      this.msg.msgBody = 'Esta cuenta ya existe en la base de datos.<br>Desea incorporarla?'
                      this.msg.msgVisible = true
                      this.msg.msgAccion = 'Incorporar cuenta'
                      this.msg.msgButtons = ['Incorporar','Cancelar']
                      this.cuentaYaAsignada = true
                    }
                  })
                } else if (data.datosGenerales!=undefined) {
                  // VIENE DESDE LA AFIP
                  if (data.datosGenerales.apellido!=undefined) {
                    this.editado.nombre = data.datosGenerales.apellido+' '+data.datosGenerales.nombre
                  } else if (data.datosGenerales.razonSocial!=undefined) {
                    this.editado.nombre = data.datosGenerales.razonSocial
                  }
                  this.editado.razon_social = this.editado.nombre
                  this.editado.documento_id = 25
                  if (data.datosMonotributo!=undefined) {
                    this.editado.responsable_id = 6
                  } else {
                    // ASIGNO RI POR DEFECTO
                    this.editado.responsable_id = 1
                    if (data.datosRegimenGeneral!=undefined) {
                      if (data.datosRegimenGeneral.impuesto) {
                        for (let x=0; x<=data.datosRegimenGeneral.impuesto.length-1; x++) {
                          if (data.datosRegimenGeneral.impuesto[x].descripcionImpuesto=='IVA EXENTO') {
                            this.editado.responsable_id = 4
                            break
                          }
                          if (data.datosRegimenGeneral.impuesto[x].descripcionImpuesto=='IVA') {
                            this.editado.responsable_id = 1
                            break
                          }
                        }
                      }
                    }
                  }
                  let dire = data.datosGenerales.domicilioFiscal.direccion
                  return HTTP().post('/buscarocrearpostal', {
                    cod: data.datosGenerales.domicilioFiscal.codPostal,
                    nom: data.datosGenerales.domicilioFiscal.localidad, //descripcionProvincia,
                    prov: data.datosGenerales.domicilioFiscal.idProvincia
                  }).then(({ data }) => {
                    let pos = this.direcciones.findIndex(x=>x.direccion==dire)
                    if (pos==-1) {
                      this.direcciones.push({
                        id: 0,
                        direccion: dire,
                        postal: data[0],
                        postal_id: data[0].id,
                        activo: 1,
                        zona_id: null,
                        zona: { id: null, tercerodireccion_id: null, usertercero_id: null, zona_id: null, zonas: { id: null, nombre: null } },
                        lazona: { id: null, tercerodireccion_id: null, usertercero_id: null, zona_id: null, zonas: { id: null, nombre: null } },
                      })
                    }
                  })
                }
              }
            }
          }
        })
      }
    },

    buscoMail (event) {
      const correo = event.target.value;
      if (correo=='') { return }
      const a = HTTP().get(`/terceromail/${correo}`).then(({ data }) => {
        if(data) {
          this.$refs.mail.focus()
          this.msg.msgTitle = 'Este correo electronico ya existe '
          this.msg.msgBody = 'Este correo electronico ya existe en la base de datos!'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'Correo ya existe'
          this.msg.msgButtons = ['Aceptar']
        }
      });
    },

    async fetchOpciones() {
      let aux = [];
      for (let i=0; i<=this.opItems.length-1; i++) {
        aux.push({
          id:         this.opItems[i].id,
          nombre:     this.opItems[i].nombre,
          tipo:       this.opItems[i].tipo,
          activo:     this.opItems[i].activo,
          opcion_id:  this.opItems[i].opcion_id,
          acceder:    this.opItems[i].acceder,
          agregar:    this.opItems[i].agregar,
          editar:     this.opItems[i].editar,
          desactivar: this.opItems[i].desactivar,
          state:  { disabled: this.opItems[i].activo===1 ? false : true }
        })
      }

      function getNestedChildren2(arr, opcion_id) {
        var out = []
        for(var i in arr) {
          if(arr[i].opcion_id === opcion_id) {
            var children = getNestedChildren2(arr, arr[i].id);
              if(children.length) {
                arr[i].children = children;
              }
              out.push(arr[i]);
            }
          }
          return out
        }
      this.opTree = getNestedChildren2(aux,0)
      return
    },

    selectAll(event) {
      if (event.value) {
        this.tercerosSeleccionados = this.terceros
      } else {
        this.tercerosSeleccionados = []
      }
    },

    invitar() {
      for (let i=0; i<= this.itemActual.tercero.contactos.length-1; i++) {
        if (this.itemActual.tercero.contactos[i].contacto_tipo_id == 1) {
          this.mailsRegistro.push(this.itemActual.tercero.contactos[i].observaciones)
          if (this.mailRegistro=='') {
            this.mailRegistro = this.itemActual.tercero.contactos[i].observaciones
          }
        }
      }
      if (this.mailRegistro=='') {

        this.msg.msgTitle = 'Atención!'
        let m = '<br>¡Este Cliente no posee un mail registrado en sus Contactos!.<br><br>'
        m += 'Define un mail en la solapa <i>Contactos</i> para poder enviar la invitación.<br><br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'mail del cliente'
        this.msg.msgButtons = ['Aceptar']

      } else {

        let body = ''
        this.mail.token = "4a720391-3103-4352-ac74-d48f13f1a13b"
        this.mail.Host = "smtp.gmail.com"
        this.mail.username = "gohuapp"
        this.mail.password = "gmail021201"
        this.mail.to = this.mailRegistro
        this.mail.from = "gohuapp@gmail.com"
        this.mail.subject = '¡Usa GOHU y conectate con nosotros!'
        this.mail.title = 'Invitación para usar GOHU'
        this.mail.visible = true

        body  = '\nEstimado '+this.itemActual.tercero.nombre+'\n\n'
        body += 'Te invitamos a registrarte en GOHU. Para ello debes ingresar a www.gohu.com.ar'+'\n\n'
        body += 'Podrás hacernos pedidos desde ahí y estar siempre actualizados con nuestros precios y promociones.\n'
        body += 'Regístrate, vincúlate y aprovecha las ventajas de estar ¡siempre actualizado!\n\n'
        body += 'Desde ya, un gran abrazo, '+this.datosEmpresa.razon_social
        body += '\n'

        this.mail.body = body
        this.mail.accion = 'Confirma enviar correo?'
        this.mail.buttons = ['Enviar','Cancelar']
      }
    },

    registrarEnGohu(item) {
      if (item.tercero.creador.id!=this.userId) {
        this.msg.msgTitle = 'Atención!'
        let m = '<br>¡Este Cliente ha sido creado por <b>'+item.tercero.creador.username+'</b>, '
        m += 'por lo tanto no es posible crear una cuenta <b>Cliente Exclusivo</b>.<br>'
        m += 'La solución es que invites a este cliente a que se registre en <b>gohu</b>,'
        m += 'como mínimo con una licencia <b>Precios y Pedidos</b><br>'
        m += 'Una vez que el usuario realice este registro te podrás vincular con él.</i> '
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'mail del cliente'
        this.msg.msgButtons = ['Aceptar']
        return
      }

      this.passRegistro = Math.floor(Math.random() * (999999 - 100 + 1) + 100).toString();
      this.mailRegistro = ''
      this.mailsRegistro = []
      this.editado.user.usaelsistema = true
      this.dialogRegistroEnGohu = false;
      for (let i=0; i<= this.itemActual.tercero.contactos.length-1; i++) {
        if (this.itemActual.tercero.contactos[i].contacto_tipo_id == 1) {
          this.mailsRegistro.push(this.itemActual.tercero.contactos[i].observaciones)
          if (this.mailRegistro=='') {
            this.mailRegistro = this.itemActual.tercero.contactos[i].observaciones
          }
        }
      }
      if (this.mailRegistro=='') {

        this.msg.msgTitle = 'Atención!'
        let m = '<br>¡Este Cliente no posee un mail registrado en sus Contactos!.<br><br>'
        m += 'Para poder generar una cuenta en GOHU es necesario que el Cliente '
        m += 'tenga registrado al menos un mail.<br><br>'
        m += 'Debes ingresar a la Ficha del Cliente, y en la solapa <i>Contactos</i> '
        m += 'definir su mail.<br><br>'
        m += 'Nota: este mail es el que usará el Ciente para logearse al sistema.<br>'

        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'mail del cliente'
        this.msg.msgButtons = ['Aceptar']
      } else {
        this.dialogRegistroEnGohu = true;
      }
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

    rol (item, accion) {
      if (accion=='acceder') {
        item.acceder = !item.acceder
      } else if (accion=='agregar') {
        item.agregar = !item.agregar
      } else if (accion=='editar') {
        item.editar = !item.editar
      } else if (accion=='desactivar') {
        item.desactivar = !item.desactivar
      }
      return HTTP().post('/rol', {
        item:item,
        accion:accion,
        tercero:this.itemActual.tercero_id,
        sucursal:this.sucursal
      }).then(({data})=>{
        this.mensaje('¡Operación Exitosa!', this.temas.forms_titulo_bg, 1500) 
      });
    },

    removeTag(item) {
      this.tagsValue.splice(this.tagsValue.indexOf(item), 1);
      this.tagsValue = [...this.tagsValue];
    },

    removeSuc(item) {
      this.sucsValue.splice(this.sucsValue.indexOf(item), 1);
      this.sucsValue = [...this.sucsValue];
    },

    marcaTercero(item, accion) {
      let vin = [];
      let estaVinculado = false;
      let esExclMio = false
      let usaApp = ''
      if (this.$store.state.formTercerosTitulo=='Clientes') {
        vin = this.vinculosHijos;
      } else if (this.$store.state.formTercerosTitulo=='Proveedores') {
        vin = this.vinculosPadres;
      } else {
        vin.push(this.userId)
      }
      if (item.tercero.user) {
        estaVinculado = vin.findIndex(x=>x==item.tercero.user.id)
      }
      if (item.tercero.user.userexclusivo_id!=null) {
        if (item.tercero.user.userexclusivo_id==this.userId) {
          esExclMio = true
        }
        usaApp = item.tercero.user.usaelsistema?'/us':'/nus'
      }
      let say = ''
      if (accion=='m'&&this.$store.state.formTercerosTitulo!='Equipo') {
        if (item.tercero.user.tipo=='UE') {
          say = estaVinculado!=-1?'u+v':'u'
        } else if (item.tercero.user.tipo=='PP') {
          say = estaVinculado!=-1?'PPv':'PP'
        } else if (item.tercero.user.tipo=='CO') {
          say = estaVinculado!=-1?'COv':'CO'
        } else if (item.tercero.user.tipo=='BA') {
          say = estaVinculado!=-1?'BAv':'BA'
        }
        if (esExclMio) {
          say = 'ex'
        }
        say += usaApp
        return say
      } else if (accion=='c') {
        if (item.tercero.user.tipo=='UE') {
          return 'red'
        } else if (item.tercero.user.tipo=='PP') {
          if (esExclMio) {
            return usaApp=='/us'?'green':'red'
          } else {
            return usaApp=='/nus'?'green':'red'
          }
        } else {
          return this.temas.forms_btn_add_bg
        }
      }
    },

    verificoElMail(mail) {
      this.elMailExiste = this.editadoCon.tipo_id==1?true:false;
      if (this.editadoCon.tipo_id==1) {
        return HTTP().post('/existeelmail', {mail:mail, donde:'contactos' }).then(({ data }) => {
          if (data) {
            this.msg.msgTitle = 'Existe el Mail'
            this.msg.msgBody = 'El mail ingresado ya existe en gohu!<br>'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'existe el mail'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.elMailExiste = false
          }
        })
      }
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  }
};
</script>

<style scoped lang="scss">
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg70 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 70%;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .fg135 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 135%;
  }
</style>
