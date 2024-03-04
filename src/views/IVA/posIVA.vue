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

      <v-card flat>
        <v-card-text>
          <span>
            Estado:
          </span>
        </v-card-text>
      </v-card>

      <v-tabs
        key="ventas"
        :color="temas.forms_titulo_bg"
        v-model="tabInicial"
        xl="12" lg="12" md="12" sm="1" xs="1">
        <v-tab
          href="#ventas"
          @click="setTab(0)">
          Ventas
        </v-tab>
        <v-tab href="#compras"
          @click="setTab(1)">
          Compras
        </v-tab>
        <v-tab href="#posicion"
          @click="setTab(2)">
          Posición Fiscal
        </v-tab>
        <v-tab href="#afip"
          @click="setTab(3)">
          AFIP
        </v-tab>

        <v-tab-item value="ventas">

          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            dense
            class="fg elevation-1 mt-4"
            :footer-props="{
              itemsPerPageOptions: [8],
              showFirstLastPage: true,
              showCurrentPage: true,
              nextIcon: 'mdi-arrow-right-drop-circle-outline',
              prevIcon: 'mdi-arrow-left-drop-circle-outline',
            }">
            <template v-slot:top>
              <v-toolbar flat>
                <v-dialog max-width="600px"
                  :transition="transition==null?'false':transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-row class="mt-6 mb-4">
                      <v-col cols="6">
                        <v-btn
                          @click="masInformacion()"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="text-capitalize ml-4">
                          <span>Más datos</span>
                        </v-btn>
                        <v-btn
                          @click="generarCITI()"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="text-capitalize ml-4">
                          <span>{{ comprasventas[0].citi?'Regenerar CITI':'Generar CITI' }}</span>
                        </v-btn>
                        <v-btn v-if ="comprasventas[0].citi"
                          @click="descargarCITI('V')"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="text-capitalize ml-4">
                          <span>Descargar CITI</span>
                        </v-btn>
                        <v-btn
                          @click="compararVentasAFIP()"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="text-capitalize ml-4">
                          <span>Comparar desde AFIP</span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </template>
                </v-dialog>
              </v-toolbar>
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

          <v-row class="pt-6 pb-4">
            <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
            </v-col>
            <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
              <v-text-field class="fg115b text--right"
                readonly dense outlined prefix="$"
                v-model="venPieGravado"
                label="Gravado">
              </v-text-field>
            </v-col>
            <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
              <v-text-field class="fg115b"
                readonly dense outlined prefix="$"
                v-model="venPieExento"
                label="Exento">
              </v-text-field>
            </v-col>
            <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
              <v-text-field class="fg115b"
                readonly dense outlined prefix="$"
                v-model="venPieIVA"
                label="IVA">
              </v-text-field>
            </v-col>
            <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
              <v-text-field class="fg115b"
                readonly dense outlined prefix="$"
                v-model="venPieTotal"
                label="TOTAL">
              </v-text-field>
            </v-col>
          </v-row>

        </v-tab-item>

        <v-tab-item value="compras">

          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            dense
            class="fg elevation-1 mt-4"
            :footer-props="{
              itemsPerPageOptions: [8],
              showFirstLastPage: true,
              showCurrentPage: true,
              pageText: 'Páginas',
              nextIcon: 'mdi-arrow-right-drop-circle-outline',
              prevIcon: 'mdi-arrow-left-drop-circle-outline' }">
            <template v-slot:top>
              <v-toolbar flat>
                <v-dialog max-width="600px"
                  :transition="transition==null?'false':transition">
                  <template v-slot:activator="{ on, attrs }">

                    <v-row class="mt-6 mb-4">
                      <v-col cols="7">
                        <v-btn
                          @click="masInformacion()"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="text-capitalize ml-4">
                          <span>Más datos</span>
                        </v-btn>
                        <v-btn
                          @click="generarCITI()"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="text-capitalize ml-4">
                          <span>{{ comprasventas[1].citi?'Regenerar CITI':'Generar CITI' }}</span>
                        </v-btn>
                        <v-btn v-if ="comprasventas[1].citi"
                          @click="descargarCITI('C')"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="text-capitalize ml-4">
                          <span>Descargar CITI</span>
                        </v-btn>
                        <v-btn
                          @click="compararComprasAFIP()"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="text-capitalize ml-4">
                          <span>Comparar y Generar desde AFIP</span>
                        </v-btn>
                      </v-col>
                      <v-col cols="5">
                        <v-card flat>
                          <v-card-text>
                            <span class="pt-0 mt-0">
                              Estado <b>{{comprasventas[1].cerrado?'Cerrado':'Abierto'}}</b>
                            </span>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  class="text-capitalize mr-4 ml-4 pt-0 mt-0"
                                  fab x-small outlined
                                  dense v-on="on"
                                  @click="abrirCerrar()">
                                  <v-icon>
                                    {{comprasventas[1].cerrado?
                                    'mdi-lock-outline':'mdi-lock-open-outline'}}
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span class="fg">
                              {{perEstado=='abierto'?'Cerrar Compras':'Abrir Compras'}}</span>
                            </v-tooltip>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>

                  </template>

                </v-dialog>
              </v-toolbar>
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

          <v-row class="pt-6 pb-4">
            <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
            </v-col>
            <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
              <v-text-field class="fg115b text--right"
                readonly dense outlined prefix="$"
                v-model="comPieGravado"
                label="Gravado">
              </v-text-field>
            </v-col>
            <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
              <v-text-field class="fg115b"
                readonly dense outlined prefix="$"
                v-model="comPieExento"
                label="Exento">
              </v-text-field>
            </v-col>
            <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
              <v-text-field class="fg115b"
                readonly dense outlined prefix="$"
                v-model="comPieIVA"
                label="IVA">
              </v-text-field>
            </v-col>
            <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
              <v-text-field class="fg115b"
                readonly dense outlined prefix="$"
                v-model="comPieTotal"
                label="TOTAL">
              </v-text-field>
            </v-col>
          </v-row>

        </v-tab-item>

        <v-tab-item value="posicion">

          <v-data-table
            :headers="headersPos"
            :items="posicion"
            :search="search"
            dense
            class="fg elevation-1 mt-4"
            :hide-default-footer="true">
            <template v-slot:item.gravado="{ item }">
              <span>$ {{ formatoImporte(item.gravado) }}</span>
            </template>
            <template v-slot:item.noGravado="{ item }">
              <span>$ {{ formatoImporte(item.noGravado) }}</span>
            </template>
            <template v-slot:item.exento="{ item }">
              <span>$ {{ formatoImporte(item.exento) }}</span>
            </template>
            <template v-slot:item.iva="{ item }">
              <span>$ {{ formatoImporte(item.iva) }}</span>
            </template>
            <template v-slot:item.retGan="{ item }">
              <span>$ {{ formatoImporte(item.retGan) }}</span>
            </template>
            <template v-slot:item.perIB="{ item }">
              <span>$ {{ formatoImporte(item.perIB) }}</span>
            </template>
            <template v-slot:item.perIVA="{ item }">
              <span>$ {{ formatoImporte(item.perIVA) }}</span>
            </template>
            <template v-slot:item.impMun="{ item }">
              <span>$ {{ formatoImporte(item.impMun) }}</span>
            </template>
            <template v-slot:item.impInt="{ item }">
              <span>$ {{ formatoImporte(item.impInt) }}</span>
            </template>
            <template v-slot:item.otrTrib="{ item }">
              <span>$ {{ formatoImporte(item.otrTrib) }}</span>
            </template>
            <template v-slot:item.total="{ item }">
              <span>$ {{ formatoImporte(item.total) }}</span>
            </template>

          </v-data-table>

        </v-tab-item>

        <v-tab-item value="afip">

          <v-row class="mt-6 mb-4">
            <v-col cols="5">
              <v-btn
                @click="generarPresentacion()"
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="text-capitalize ml-4">
                <span>Generar Presentación</span>
              </v-btn>
              <v-btn
                @click="informarPago()"
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="text-capitalize ml-4">
                <span>Informar Pago</span>
              </v-btn>
            </v-col>
          </v-row>

        </v-tab-item>
      </v-tabs>

      <!-- DATOS DEL PERIODO -->
      <v-dialog v-model="dialogMasInfo" max-width="360px" persistent
        :transition="transition==null?'false':transition">
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
              Más datos sobre el Período
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

      <!-- COMPARAR Y GENERAR COMPRAS DESDE AFIP -->
      <v-dialog v-model="dialogCompararCompras" max-width="1400px" persistent
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar flat
            :dark="temas.forms_titulo_dark==true"
            :color="temas.forms_titulo_bg">
            <v-btn
              icon @click="dialogCompararCompras=false"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="headdline">
              Comparar y generar compras desde AFIP
              ( Solo se podrán importar movimientos de aquellos Proveedores <b>no Vinculados</b>)
            </span>
          </v-toolbar>
          <v-card-text>

            <v-row class="pt-4">
              <v-col cols="7" sm="7" md="7">
                <v-file-input
                  filled dense
                  :color="temas.forms_titulo_bg"
                  prepend-icon="mdi-file-excel"
                  v-model="nuevoXls"
                  @change="cargarXls">
                  <v-icon>mdi-plus</v-icon>
                </v-file-input>
              </v-col>
              <v-col cols="1" sm="1" md="1">
                <v-text-field
                  disabled
                  v-show="xlsCargado"
                  class="caption"
                  v-model="registrosXls"
                  label="Registros">
                </v-text-field>
              </v-col>
              <v-col cols="1" sm="1" md="1">
                <v-text-field
                  disabled
                  v-show="xlsCargado"
                  class="caption"
                  v-model="encontradosXls"
                  label="Encontrados">
                </v-text-field>
              </v-col>
              <v-col cols="1" sm="1" md="1">
                <v-text-field
                  disabled
                  v-show="xlsCargado"
                  class="caption"
                  v-model="selected.length"
                  label="A Modificar">
                </v-text-field>
              </v-col>
              <v-col cols="2" sm="2" md="2">
                <v-btn v-show="selected.length>0"
                  :color="temas.forms_titulo_bg"
                  :dark="temas.cen_btns_dark==true"
                  class="ma-2"
                  @click="cpAplicar()">
                  Revisar
                </v-btn>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headersComImp"
              :items="importadosAFIP"
              dense
              class="fg elevation-1 mt-4"
              :footer-props="{
                itemsPerPageOptions: [8],
                showFirstLastPage: true,
                showCurrentPage: true,
                pageText: 'Páginas',
                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                prevIcon: 'mdi-arrow-left-drop-circle-outline',
              }">
              <template v-slot:item.loTengo="{ item }">
                <span>{{ item.loTengo?'Sí':'No' }}</span>
              </template>
              <template v-slot:item.hayDif="{ item }">
                <span>{{ item.hayDif?'Sí':'No' }}</span>
              </template>
              <template v-slot:item.fecha="{ item }">
                <span>{{ item.fecha }}</span>
              </template>
              <template v-slot:item.cpr="{ item }">
                <!--<span>{{ kit.cpr(item.cpr) }}</span>-->
                <span>{{ item.cpr }}</span>
              </template>
              <template v-slot:item.nombre="{ item }">
                <span>{{ item.nombre.substring(0,20) }}</span>
              </template>
              <template v-slot:item.totGravado="{ item }">
                <span>$ {{ formatoImporte(item.totGravado) }}</span>
              </template>
              <template v-slot:item.totIVA="{ item }">
                <span>$ {{ formatoImporte(item.totIVA) }}</span>
              </template>
              <template v-slot:item.impExento="{ item }">
                <span>$ {{ formatoImporte(item.impExento) }}</span>
              </template>
              <template v-slot:item.impTotal="{ item }">
                <span>$ {{ formatoImporte(item.impTotal) }}</span>
              </template>
              <template v-slot:item.accion="{ item }">
                <v-tooltip bottom v-if="!item.loTengo&&!item.vinculado">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      fab x-small
                      @click="nuevoMovimientoDeCompras(item)" v-on="on">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Agregar Movimiento</span>
                </v-tooltip>
              </template>
            </v-data-table>

          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- FIN DEL ERROR EN EL PEDIDO -->

      <!-- CUIT FALTANTES -->
      <v-dialog v-model="dialogCUITFaltantes" max-width="960px" persistent
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <v-toolbar flat
            :dark="temas.forms_titulo_dark==true"
            :color="temas.forms_titulo_bg">
            <v-btn
              icon @click="dialogCUITFaltantes=false"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="headdline">
              CUIT FALTANTES EN ESTA PLANILLA DE IVA
            </span>
          </v-toolbar>
          <div>
            <v-data-table
              :headers="headersCUITFaltantes"
              :items="CUITFaltantes"
              dense
              class="fg elevation-3 pl-0"
              :hide-default-footer="true"
              :items-per-page="25">
              <template v-slot:item.estado="{ item }">
                <span>{{ item.estado=='P'?'A Importar':'Importado' }}</span>
              </template>
              <template v-slot:item.accion="{item}">
                <v-tooltip bottom v-if="item.estado!='I'">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      fab x-small
                      @click="importarCUIT(item,2)" v-on="on">
                      <v-icon>mdi-account</v-icon>
                    </v-btn>
                  </template>
                  <span>Importar como Proveedor</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.estado!='I'">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      fab x-small
                      @click="importarCUIT(item,7)" v-on="on">
                      <v-icon>mdi-bank</v-icon>
                    </v-btn>
                  </template>
                  <span>Importar como Servicio/Estado</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </div>
        </v-card>
      </v-dialog>
      <!-- FIN CUIT FALTANTES -->

      <!-- NUEVA COMPRA -->
      <v-dialog v-model="dialogNuevaCompra" max-width="450px" persistent
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <v-toolbar flat
            :dark="temas.forms_titulo_dark==true"
            :color="temas.forms_titulo_bg">
            <v-btn
              icon @click="dialogNuevaCompra=false"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="fg">Importación de Movimiento</span>
            <v-spacer></v-spacer>
            <v-btn
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="pb-0 pt-0 ma-2"
              @click="importarMovimiento">
              Importar
            </v-btn>
          </v-toolbar>
          <div>
            <v-card>
              <v-card-text class="fg pt-6">
                <v-row>
                  <v-col cols="12">Fecha: <b>{{ editado.fecha }}</b></v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">Comprobante: <b>{{ editado.cpr }}</b></v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">Proveedor: <b>{{ editado.nombre }}</b></v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">Total: <b>${{ formatoImporte(editado.total) }}</b></v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-select v-if="asociados.length>0"
                      label="Cbte Asociado"
                      v-model="editado.asociado_id"
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      :items="asociados"
                      item-value="id"
                      :item-text="asociados=>
                        `${asociados.cpr} (${'$'+formatoImporte(asociados.total)} )`"
                      autocomplete
                      clearable
                      >
                    </v-select>
                  </v-col>
                </v-row>
                <!--
                <v-row>
                  <v-col cols="12">
                    <v-switch
                      label="En Cuenta Corriente"
                      v-model="ctacte"
                      autofocus
                      :color="temas.forms_titulo_bg"
                      outlined dense>
                    </v-switch>
                  </v-col>
                </v-row>
                -->
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      autofocus
                      type="date"
                      :color="temas.forms_titulo_bg"
                      v-model="editado.vencimiento"
                      label="Vencimiento">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
        </v-card>
      </v-dialog>
      <!-- FIN NUEVA COMPRA -->

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
    ctacte: false,
    editado: { fecha: '', vencimiento: '', nombre: '', cpr: '', gravado: 0, exento: 0, iva: 0, total: 0, asociado_id: null},
    asociado: [],
    asociados: [],
    selected: [],
    xlsCargado: false,
    nuevoXls: '',
    encontradosXls: 0,
    tabInicial: 'ventas',
    registrosXls: 0,    
    tabActivo: 0,
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    items: [],
    importadosAFIP: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
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
    tl: "text-lowercase",
    posicion: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    search: '',                     // para el cuadro de búsqueda de datatables
    dialogMasInfo: false,           // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogCompararCompras: false,
    dialogCompararVentas: false,
    dialogCUITFaltantes: false,
    dialogNuevaCompra: false,
    CUITFaltantes: [],
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
    headersCUITFaltantes: [
      { text: 'CUIT', value:'cuit', align: 'left', width: 100 },
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 500 },
      { text: 'Importar Desde', value:'importar', align: 'left', width: 90 },
      { text: 'Estado', value:'estado', align: 'left', width: 110 },
      { text: 'Accion', value:'accion' },
    ],
    headersComImp: [
      { text: 'Lo Tengo', value:'loTengo', align: 'left', width: 100 },
      { text: 'Hay Dif', value:'hayDif', align: 'left', width: 90 },
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 165 },
      { text: 'Agreg', value:'accion', align: 'center', width: 80 },
      { text: 'FECHA', value:'fecha', align: 'left', width: 89 },
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 200 },
      { text: 'GRAVADO', value:'totGravado', align: 'end', width: 120 },
      { text: 'EXENTO', value:'impExento', align: 'end', width: 120 },
      { text: 'IVA', value:'totIVA', align: 'end', width: 120 },
      { text: 'TOTAL', value:'impTotal', align: 'end', width: 120 },
    ],
    headersPos: [
      { text: 'Tip', value:'t', align: 'left', width: 60 },
      { text: 'Gravado', value:'gravado', align: 'end', width: 120 },
      { text: 'No Gravado', value:'noGravado', align: 'end', width: 120 },
      { text: 'Exento', value:'exento', align: 'end', width: 120 },
      { text: 'IVA', value:'iva', align: 'end', width: 120 },
      { text: 'Ret.Gan.', value:'retGan', align: 'end', width: 120 },
      { text: 'Per.IB', value:'perIB', align: 'end', width: 120 },
      { text: 'Per.IVA', value:'perIVA', align: 'end', width: 120 },
      { text: 'Imp.Muni.', value:'impMun', align: 'end', width: 100 },
      { text: 'Imp.Int', value:'impInt', align: 'end', width: 100 },
      { text: 'Otros Imp.', value:'otrTrib', align: 'end', width: 120 },
      { text: 'TOTAL', value:'total', align: 'end', width: 120 },
    ],
    headersMasInfo: [
      { text: 'Item', value:'item', align: 'left', class: 'grey lighten-3', width: 100},
      { text: 'importe', value:'importe', align: 'end', class: "grey lighten-3", width: 100},
    ],
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalDemo',
      'sucursalFiscal',
      'vinculosPadres',
      'tema',
      'temas',
      'centrales',
      'empresa',
      'datosEmpresa',
      'responsable',
      'cuit',
      'transition',
    ]),

    venPieGravado() { return this.kit.redondear(this.comprasventas[0].det[0].total,2,2) },
    venPieExento()  { return this.kit.redondear(this.comprasventas[0].det[1].total,2,2) },
    venPieIVA()     { return this.kit.redondear(this.comprasventas[0].det[2].total,2,2) },
    venPieTotal()   { return this.kit.redondear(this.comprasventas[0].det[3].total,2,2) },
    comPieGravado() { return this.kit.redondear(this.comprasventas[1].det[0].total,2,2) },
    comPieExento()  { return this.kit.redondear(this.comprasventas[1].det[1].total,2,2) },
    comPieIVA()     { return this.kit.redondear(this.comprasventas[1].det[2].total,2,2) },
    comPieTotal()   { return this.kit.redondear(this.comprasventas[1].det[3].total,2,2) },
    posPieGravado() { return this.kit.redondear(this.comprasventas[0].det[0].total-this.comprasventas[1].det[0].total,2,2) },
    posPieExento()  { return this.kit.redondear(this.comprasventas[0].det[1].total-this.comprasventas[1].det[1].total,2,2) },
    posPieIVA()     { return this.kit.redondear(this.comprasventas[0].det[2].total-this.comprasventas[1].det[2].total,2,2) },
    posPieTotal()   { return this.kit.redondear(this.comprasventas[0].det[3].total-this.comprasventas[1].det[3].total,2,2) },
    
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
      this.filtroComprasVentasSel = cual
      if (cual=='POSICION') return
      if (cual=='COMPRAS') {
        this.filtroComprasVentas = ['CO','GS']
      } else if (cual=='VENTAS') {
        this.filtroComprasVentas = ['VE']
      }
      this.listarHTTP()
    },

    nuevoMovimientoDeCompras(item) {
      this.editado.nombre = item.nombre
      this.editado.fecha = item.fecha
      let fe = item.fecha.substring(3,5)+'-'+item.fecha.substring(0,2)+'-'+item.fecha.substring(6,8)
      this.editado.vencimiento = moment(fe).format('YYYY-MM-DD')
      this.editado.cpr = item.cpr
      this.editado.gravado = item.totGravado
      this.editado.exento = item.impExento
      this.editado.iva = item.totIVA
      this.editado.total = item.impTotal
      this.asociados = []
      this.asociado = []

      if (item.tercero_id==null) {
        let m = ''
        this.msg.msgTitle = 'No existe el Proveedor'
        m  = '<br>Este movimiento no se puede importar ya que no existe el proveedor.<br>'
        m += 'Debes importarlo dede la planilla anterior o cargarlo.'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'sin proveedor'
        this.msg.msgButtons = ['Aceptar']
      } else {
        return HTTP().get('/importarcompraasociados/'+item.tercero_id).then(({data})=>{
          if (data[0].length>0) {
            for (let i=0; i<=data[0].length-1; i++) {
              this.asociados.push({id: data[0][i].id, cpr: data[0][i].cpr, total: data[0][i].total })
            }
          }
          this.dialogNuevaCompra = true
        })
      }
    },

    importarMovimiento(item) {
      let m = ''
      this.msg.msgTitle = 'Importar Movimiento'
      m  = '<br>¿Confirmas importar este movimiento?'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'importar movimiento'
      this.msg.msgButtons = ['Aceptar','Cancelar']
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

        if (this.tabActivo!=3) {
          this.perEstado = this.comprasventas[this.tabActivo].cerrado ? 'cerrado' : 'abierto'
          this.perAccion = this.comprasventas[this.tabActivo].cerrado ? 'abrir'   : 'cerrar'
        }
        this.perModulo = this.comprasventas[this.tabActivo].nombre
        this.posicion  = [
          {t:'Ven',gravado: 0, noGravado: 0, exento: 0, iva: 0, retGan: 0, perIB: 0, perIVA: 0, impMun: 0, impInt: 0, otrTrib: 0, total: 0},
          {t:'Com',gravado: 0, noGravado: 0, exento: 0, iva: 0, retGan: 0, perIB: 0, perIVA: 0, impMun: 0, impInt: 0, otrTrib: 0, total: 0},
          {t:'Pos',gravado: 0, noGravado: 0, exento: 0, iva: 0, retGan: 0, perIB: 0, perIVA: 0, impMun: 0, impInt: 0, otrTrib: 0, total: 0},
        ]

        for (let i=0; i<=data.length-1; i++) {
          if ((this.filtroComprasVentasSel=='VENTAS' && data[i].tipo=='VE')||
              (this.filtroComprasVentasSel=='COMPRAS' && (data[i].tipo=='CO' || data[i].tipo=='GS'))) {
            this.items.push(data[i])
          }
          if (data[i].tipo=='VE') {

            this.posicion[0].gravado += data[i].gravado
            this.posicion[0].exento += data[i].exento
            this.posicion[0].iva += data[i].iva
            this.posicion[0].total += data[i].total

            this.posicion[2].gravado += data[i].gravado
            this.posicion[2].exento += data[i].exento
            this.posicion[2].iva += data[i].iva
            this.posicion[2].total += data[i].total

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

          } else if (data[i].tipo=='CO'||data[i].tipo=='GS') {

            this.posicion[1].gravado += data[i].gravado
            this.posicion[1].exento += data[i].exento
            this.posicion[1].iva += data[i].iva
            this.posicion[1].total += data[i].total

            this.posicion[2].gravado -= data[i].gravado
            this.posicion[2].exento -= data[i].exento
            this.posicion[2].iva -= data[i].iva
            this.posicion[2].total -= data[i].total

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
          }1
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

    formatoFechaCorta2(value) {
      let a = moment(String(value)).format('dd')
      let b = moment(String(value)).format('DD') 
      return a+' '+b
    },

    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },

    setTab(cual){
      this.tabActivo = cual
      if (cual==0) {
        this.filtroComprasVentasSel='VENTAS'
      } else if (cual==1) {
        this.filtroComprasVentasSel='COMPRAS'
      } else if (cual==2) {
        this.filtroComprasVentasSel='POSICION'
      } else {
        this.filtroComprasVentasSel='AFIP'
      }
      this.listarHTTP()
    },

    abrirCerrar(cbt) {
      this.perEstado = this.comprasventas[this.tabActivo].cerrado ? 'cerrado' : 'abierto'
      this.perAccion = this.comprasventas[this.tabActivo].cerrado ? 'abrir'   : 'cerrar'
      this.perModulo = this.comprasventas[this.tabActivo].nombre
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
    },

    generarCITI() {
      if (this.perEstado=='Abierto') {
        this.msg.msgTitle = 'El periodo esta Abierto'
        this.msg.msgBody = 'El período debe estar cerrado para poder generar el CITI'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'periodo abierto'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      } else {
        this.file = this.userId+'_'+this.perFiscal+'_CITI'+this.comprasventas[this.tabActivo].nombre
        this.perModulo = this.comprasventas[this.tabActivo].nombre
        let m = ''
        this.msg.msgTitle = 'Generar archivo CITI'
        m = '<br>Confirmas generar el CITI </b>' + this.comprasventas[this.tabActivo].nombre
        m += '<br>para el período <b>'+this.perFiscal.substring(4,6)+'/'+this.perFiscal.substring(0,4)+'</b>.<br><br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'generar citi'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      }
    },

    compararComprasAFIP() {
      this.dialogCompararCompras = true;
      this.importadosAFIP = []
      this.nuevoXls = ''  //huguito
    },

    compararVentasAFIP() {
      this.dialogCompararVentas = true;
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

    informarPago() {
      if (this.comprasventas[1].cerrado) {
        this.msg.msgTitle = 'El periodo esta Abierto'
        this.msg.msgBody = 'El período debe estar cerrado para poder generar el CITI'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'periodo abierto'
        this.msg.msgButtons = ['Aceptar','Cancelar']
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

                //alert(this.comprasventas[1].cerrado)
                //this.comprasventas[1].cerrado = !this.comprasventas[1].cerrado
                //alert(this.comprasventas[1].cerrado)

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

          await HTTP().post('/generarciti', { file: this.file, cab: cab, det: det, periodo: this.perFiscal, modulo: this.perModulo}).then((data)=> {
            if (data) {

              //this.msg.msgTitle = 'Atención'
              //this.msg.msgBody = '¡Archivo CITI generado correctamente!'
              //this.msg.msgVisible = true
              //this.msg.msgAccion = 'CITI ok'
              //this.msg.msgButtons = ['Aceptar']

              this.mensaje('¡CITI GENERADO CORRECTAMENTE!', this.temas.forms_titulo_bg, 2500) 

            } else if (data=='error') {

              //this.msg.msgTitle = 'Error'
              //this.msg.msgBody = '¡Se ha producido un error al generar el archivo CITI!'
              //this.msg.msgVisible = true
              //this.msg.msgAccion = 'CITI Error'
              //this.msg.msgButtons = ['Aceptar']

              this.mensaje('¡Opps!, ERROR EN GENERAR EL CITI.', this.temas.forms_titulo_bg, 2500) 

            }
            //this.listarHTTP()
          })
        
        } else if (this.msg.msgAccion=='importar movimiento') {

          let pos = this.importadosAFIP.findIndex(x=>x.cpr==this.editado.cpr)
          await HTTP().post('/importarcompraafip', {
            sucursal_id: this.sucursal, asociado: this.asociado, editado: this.importadosAFIP[pos]}).then((data)=> {
            if (data.data=='ok') {
              this.importadosAFIP[pos].loTengo = true
            }
            this.dialogNuevaCompra = false
          })
        }
      }
      this.msg.msgVisible = false;
    },

    async descargarCITI(cual) {
      this.file = this.userId+'_'+this.perFiscal+'_CITI'+this.comprasventas[this.tabActivo].nombre+'_CAB.txt'
      await HTTP().get('/descargarciti/'+this.file).then(( response ) => { 
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', this.file);
        document.body.appendChild(fileLink);
        fileLink.click();
      })
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

    masInformacion() {
      this.msg.msgTitle = 'Mas información: '+this.comprasventas[this.tabActivo].nombre+' - '+this.elMes+'/'+this.elAnio
      let p = this.comprasventas[this.tabActivo].nombre == 'VENTAS' ? 0 : 1
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

    cargarXls() {
      if (this.nuevoXls.name != undefined) {
        try {
          this.xlsCargado = true;
          let file = this.nuevoXls;
          let reader = new FileReader();
          reader.onload = async function (e) {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: "array" });
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            let dataset = await this.parseFileContent(sheet);
          }.bind(this);
          reader.readAsArrayBuffer(file);
          this.chequearCompras()
        } 
        catch (exception) {
          console.log('error')
        }
      } else {
        this.xlsCargado = false;
      }
    },

    parseFileContent(sheet) {
      this.importadosAFIP = []
      let cpr = ''
      let suc = ''
      let nro = ''
      let fec = ''
      let pro = []
      for (let j=1; j<=sheet.length-1; j++) {

        if (sheet[j][1]==1) {
          cpr = 'FAC-A '
        } else if (sheet[j][1]==2) {
          cpr = 'NDD-A '
        } else if (sheet[j][1]==3) {
          cpr = 'NDC-A '
        } else if (sheet[j][1]==6) {
          cpr = 'FAC-B '
        } else if (sheet[j][1]==7) {
          cpr = 'NDD-B '
        } else if (sheet[j][1]==8) {
          cpr = 'NDC-B '
        } else if (sheet[j][1]==11) {
          cpr = 'FAC-C '
        } else if (sheet[j][1]==12) {
          cpr = 'NDD-C '
        } else if (sheet[j][1]==13) {
          cpr = 'NDC-C '
        } else if (sheet[j][1]==51) {
          cpr = 'FAC-M '
        } else if (sheet[j][1]==52) {
          cpr = 'NDD-M '
        } else if (sheet[j][1]==53) {
          cpr = 'NDC-M '
        } else if (sheet[j][1]==81) {
          cpr = 'TKT-A '
        } else if (sheet[j][1]==82) {
          cpr = 'TKT-B '
        } else if (sheet[j][1]==111) {
          cpr = 'TKT-C '
        } else if (sheet[j][1]==112) {
          cpr = 'TNC-A '
        } else if (sheet[j][1]==113) {
          cpr = 'TNC-B '
        } else if (sheet[j][1]==114) {
          cpr = 'TNC-C '
        } else if (sheet[j][1]==115) {
          cpr = 'TND-A '
        } else if (sheet[j][1]==116) {
          cpr = 'TNC-B '
        } else if (sheet[j][1]==117) {
          cpr = 'TNC-C '
        } else if (sheet[j][1]==118) {
          cpr = 'TKF-M '
        } else if (sheet[j][1]==119) {
          cpr = 'TNC-M '
        } else if (sheet[j][1]==120) {
          cpr = 'TND-M '
        }

        suc = sheet[j][2].toString()
        nro = sheet[j][3].toString()
        suc = suc.padStart(4,'0')
        nro = nro.padStart(8,'0')
        cpr += suc
        cpr += '-'
        cpr += nro

        fec = new Date((sheet[j][0]-(25567+2))*86400*1000)
        fec = moment(fec).format('DD-MM-YY')

        this.importadosAFIP.push({
          tercero_id: null,
          fecha: fec,
          cpr: cpr,
          tipDoc: sheet[j][4],
          nroDoc: sheet[j][5],
          nombre: sheet[j][6].substring(0,30),
          impTotal: sheet[j][7]||0,
          moneda: sheet[j][8]||0,
          tipCambio: sheet[j][9]||0,
          impNoGravado: sheet[j][10]||0,
          impExento: sheet[j][11]||0,
          creFiscalComputable: sheet[j][12]||0,
          perOtrImpNac: sheet[j][13]||0,
          perIB: sheet[j][14]||0,
          impMun: sheet[j][15]||0,
          perIVA: sheet[j][16]||0,
          impInt: sheet[j][17]||0,
          otrTrib: sheet[j][18]||0,
          gra0: sheet[j][19]||0,
          gra25: sheet[j][20]||0,
          iva25: sheet[j][21]||0,
          gra5: sheet[j][22]||0,
          iva5: sheet[j][23]||0,
          gra105: sheet[j][24]||0,
          iva105: sheet[j][25]||0,
          gra21: sheet[j][26]||0,
          iva21: sheet[j][27]||0,
          gra27: sheet[j][28]||0,
          iva27: sheet[j][29]||0,
          totGravado: sheet[j][30]||0,
          totIVA: sheet[j][31]||0,
          loTengo: false,
          hayDif: false,
          vinculado: false,
        })
      }
      this.registrosXls = sheet.length-1;

      // veo como estan los datos, reviso importadosAFIP con items
      for (let i=0; i<=this.importadosAFIP.length-1; i++) {
        let pos = this.items.findIndex(x=>x.cpr==this.importadosAFIP[i].cpr)
        if (pos!=-1) {
          this.importadosAFIP[i].loTengo = true
          if (this.importadosAFIP[i].impTotal!=this.items[pos].total) {
            this.importadosAFIP[i].hayDif = true
          }
        }
        pos = pro.findIndex(x=>x==this.importadosAFIP[i].nroDoc)
        if (pos==-1) {
          pro.push(this.importadosAFIP[i].nroDoc)
        }
      }

      HTTP().post('/buscocuits', { proveedores: pro, vinculados: this.vinculosPadres}).then((data)=> {
        this.CUITFaltantes = []
        this.dialogCUITFaltantes = false
        for (let i=0; i<=data.data.length-1; i++) {
          let pos = this.importadosAFIP.findIndex(x=>x.nroDoc==data.data[i].cuit)
          if (pos!=-1) {
            if (!data.data[i].enuser) {
              this.CUITFaltantes.push({
                cuit: this.importadosAFIP[pos].nroDoc,
                nombre: this.importadosAFIP[pos].nombre,
                importar: data.data[i].engohu?'gohu':'AFIP',
                tercero_id: data.data[i].tercero_id,
                estado: 'P'
              })
              this.dialogCUITFaltantes = true
            }
          }
        }
        // ASIGNO LOS TERCEROS
        for (let i=0; i<=data.data.length-1; i++) {
          for (let j=0; j<=this.importadosAFIP.length-1; j++) {
            if (data.data[i].cuit==this.importadosAFIP[j].nroDoc) {
              this.importadosAFIP[j].tercero_id = data.data[i].tercero_id
              this.importadosAFIP[j].vinculado =  data.data[i].vinculado
            }
          }
        }

        // ordeno por proveedores
        this.importadosAFIP.sort((o1, o2) => {
          if (o1.tercero_id>o2.tercero_id) { return 1; }
          else if (o1.tercero_id<o2.tercero_id) { return -1; } 
          else { return 0; }
        })

      })
    },
  
    importarCUIT(item, como) {
      if (item.importar=='gohu') {
        return HTTP().post('/agregotercerodesdegohu', {user_id: this.userId, tercero_id: item.tercero_id, tipo_id: como}).then(({data})=>{
          if (data=='ok') {
            this.mensaje('¡La operación se ha realizado con éxito!', this.temas.forms_titulo_bg, 1500) 
            item.estado = 'I'
          } else {
            this.mensaje('¡Opps!, Se ha producido un error!', this.temas.forms_titulo_bg, 2500) 
          }
        })
      } else {
        return HTTP().post('/agregotercerodesdeafip', {cuit: item.cuit, como: como}).then(({data})=>{
          if (data=='ok') {
            this.mensaje('¡La operación se ha realizado con éxito!', this.temas.forms_titulo_bg, 1500) 
            item.estado = 'I'
          } else {
            this.mensaje('¡Opps!, Se ha producido un error!', this.temas.forms_titulo_bg, 2500) 
          }
        })
      }
    },
  
    chequearCompras() {
      this.mios = [];
      this.encontradosXls = 0;
      // ver de poner el rubro, por ahora van todos.
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
</style>