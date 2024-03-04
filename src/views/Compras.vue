<template>
  <v-layout align-start>
    <v-flex>
      <v-row class="pb-2">
        <v-col v-for="(cbt, idx) in comprobantes" v-bind:key="idx">
          <v-card outlined @click="selectTipoDeComprobante(cbt.nombre)"
            :disabled="!cbt.activo" max-width="170">
            <v-app-bar outlined
              :color="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title class="fg110">
                {{cbt.nombre}}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-container>
              <v-row dense>
                <v-col cols="12" class="fg85">
                  ${{ formatoImporte(cbt.total) }}
                </v-col>
              </v-row>
              <v-row class="pt-0 pb-0" dense>
                <v-col cols="12" class="fg85">
                  {{cbt.ctt==0?'Sin':cbt.ctt}} Movs.
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3"
                  v-if="(cbt.nombre!='Créditos'&&cbt.nombre!='Débitos')"
                  class="pt-6 pb-2">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon small outlined
                        :disabled="tipo=='PP'&&(cbt.nombre!='Pedidos'&&cbt.nombre!='Pagos')"
                        @click="nuevo(cbt.nombre)" v-on="on">
                        <v-icon>mdi-18px mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>{{cbt.nombre=='Facturas' ? 'Factura c/Stock' : 'Nuevo'}}</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="2" class="pt-6 pb-2"
                  v-show="cbt.nombre=='Facturas'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        :disabled="tipo=='PP'"
                        @click="importarDesde('Excel')" v-on="on">
                        <v-icon>
                          mdi-18px mdi-file-excel-box
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Importar comprobante desde Excel</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="2" class="pt-6 pb-2 pl-5" v-show="cbt.nombre=='Facturas'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        :disabled="tipo=='PP'"
                        @click="importarDesde('PDF')" v-on="on">
                        <v-icon>
                          mdi-18px mdi-file-pdf-box
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Importar comprobante PDF</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="2" class="pt-6 pb-2" v-show="cbt.nombre=='Pedidos'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        :disabled="tipo=='PP'"
                        @click="verFaltantes(true)" v-on="on">
                        <v-icon>
                          mdi-18px mdi-notebook
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Ver Pedidos Faltantes</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="2" class="pt-6 pb-2" v-show="cbt.nombre=='Gastos'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        :disabled="tipo=='PP'"
                        @click="verGastos()" v-on="on">
                        <v-icon>
                          mdi-18px mdi-calendar
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Gastos Programados</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        :show-expand="filtroComprobanteSel!='Pagos'"
        dense
        class="elevation-1 fg110"
        :footer-props="footProps(6)">
        <template v-slot:top>
          <v-toolbar flat :color="temas.forms_titulo_bg">
            <v-btn icon @click="closeForm"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <v-toolbar-title
              :color="temas.forms_titulo_bg"
              :dark="temas.forms_titulo_dark==true"
              class="fg"
              v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                <v-icon left>mdi-airplane-landing</v-icon>
                <b class="fg110">COMPRAS</b>
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="anio in anios"
                :key="anio.id" dense :value="anio.id" label
                :color="anio==elAnio ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="anio==elAnio ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1"
                @click="setAnio(anio)">
                {{ anio.substr(2,2) }}
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <span v-for="mes in meses" :key="mes.id">
                <v-chip
                  dense :value="mes.id" label
                  :color="mes==elMes ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                  :dark="mes==elMes ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                  class="ml-1 mr-0"
                  @click="setMes(mes)">
                  {{ mes }}
                  <v-avatar>
                    <v-icon>{{estadoDelMes(mes)}}</v-icon>
                  </v-avatar>
                </v-chip>
              </span>
              <v-progress-circular v-if="progress==true"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>
            </v-toolbar-title>

            <!-- DIALOGO DE LA CABECERA -->
            <v-dialog v-model="dialogCab" max-width="550px" :fullscreen="true" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cancelar"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="fg">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="compraOk"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="fg85 ma-2 white--text"
                    @click="guardar">Guardar
                  </v-btn>
                </v-toolbar>

                <!--// CABECERA DE LA COMPRA // -->
                <v-form ref="form">
                  <v-card-text>
                    <v-row class="pt-4">
                      <v-col cols="12" md="5" class="fg pt-0">
                        <v-row v-if="!encontroElProveedor">
                          <v-col cols="12" sm="12" class="fg pt-0">
                            <v-text-field
                              ref="codigoproveedor"
                              v-model="editado.tercero_id"
                              :color="temas.forms_titulo_bg"
                              label=
                              "Ingresa el Código, el Nombre o el CUIT. Utiliza el caracter % para
                              buscar por parecido."
                              :disabled="editedIndex!=-1"
                              autofocus
                              v-on:blur="buscarProveedor()">
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <v-col cols="12" sm="2" class="pt-3 pl-2 fg">
                            <v-btn
                              :color="temas.cen_btns_bg"
                              :dark="temas.cen_btns_dark==true"
                              class="mt-0 mr-2 text-capitalize"
                              @click="encontroElProveedor=false"
                              :disabled="basadoEnCpr">
                              Buscar
                            </v-btn>
                          </v-col>
                          <v-col cols="12" sm="2" class="pt-0 fg">
                            <v-text-field
                              ref="codigoproveedor"
                              v-model="editado.tercero_id"
                              label="Código"
                              disabled>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="8" class="pt-0 fg">
                            <v-text-field
                              v-model="editado.nombre"
                              label="Nombre del Proveedor"
                              disabled>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="2"
                        xl="12" lg="2" md="2" sm="6" xs="6"
                        class="fg pt-0">
                        <v-select class="pt-0"
                          label="Comprobante" v-model="editado.comprobante_id"
                          :color="temas.forms_titulo_bg"
                          :disabled="editedIndex!=-1 || editado.cpr.substring(0,3)=='PED'"
                          :items="cprItems"
                          item-value="id"
                          item-text="abrev"
                          autocomplete>
                        </v-select>
                      </v-col>
                      <v-col cols="1" xs="12" sm="1" md="1" class="fg pt-0">
                        <v-text-field class="pt-0"
                          :disabled="editedIndex!=-1 || editado.cpr.substring(0,3)=='PED'"
                          v-model="afipSuc"
                          @change="afipsuc()"
                          label="Suc">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" xs="12" sm="1" md="1" class="fg pt-0">
                        <v-text-field class="pt-0"
                          ref="afipNro"
                          :disabled="editado.cpr.substr(0,3)=='PED'"
                          :color="temas.forms_titulo_bg"
                          v-model="afipNro"
                          label="Numero"
                          @change="buscarCpr()">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" xs="12" sm="2" md="2" class="fg pt-0">
                        <v-text-field class="pt-0"
                          type="date"
                          :disabled="editado.cpr.substr(0,3)=='PED'"
                          :color="temas.forms_titulo_bg"
                          v-model="editado.fecha"
                          label="Fecha">
                        </v-text-field>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="1" xs="12" sm="1" md="1" class="fg pt-0">
                        <v-select class="pt-0"
                          :disabled="editado.cpr.substring(0,3)=='PED'"
                          label="Per.Fiscal"
                          v-model="editado.perfiscal"
                          :color="temas.forms_titulo_bg"
                          :items="periodosAbiertos">
                        </v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="1" xs="12" sm="1" md="1" class="fg pt-0">
                        <v-text-field class="caption pt-0"
                          disabled
                          v-model="editado.responsableAbrev"
                          label="Cond.Fiscal">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1" class="fg pt-0">
                        <v-text-field class="caption pt-0"
                          disabled
                          v-model="editado.documento"
                          label="Documento">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1" class="fg pt-0">
                        <v-text-field class="caption pt-0"
                          disabled
                          v-model="editado.documentoNumero"
                          label="Numero">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4" class="fg pt-0">
                        <v-select  class="pt-0"
                          label='Direccion'
                          v-model="editado.direccion_id"
                          :items="dirItems"
                          :color="temas.forms_titulo_bg"
                          item-value="id"
                          :item-text="dirItems=>
                            `${dirItems.direccion} - ( ${dirItems.postal.codigo} )
                            ${dirItems.postal.nombre} - ${dirItems.postal.provincia.nombre} -
                            ${dirItems.postal.provincia.pais.nombre}`">
                        </v-select>

                      </v-col>
                      <v-col cols="2" sm="2" md="2"
                        v-show="esCIN==false && esFiscal==true"
                        class="pt-0 fg">
                        <v-select class="pt-0"
                          label="Depósito"
                          v-model="editado.deposito_id"
                          :disabled="!editado.regstk"
                          :items="depItems" item-value="id" item-text="nombre"
                          :color="temas.forms_titulo_bg"
                          autocomplete
                          return-object>
                        </v-select>
                      </v-col>
                      <v-col cols="1" sm="1" md="1" class="fg pt-0">
                        <v-select v-show="esFiscal == true" class="pt-0"
                          label="Moneda"
                          v-model="editado.moneda_id"
                          :color="temas.forms_titulo_bg"
                          :items="monItems"
                          item-value="id"
                          item-text="simbolo"
                          return-object>
                        </v-select>
                      </v-col>
                        <v-col cols="2" sm="2" md="2" class="fg pt-0">
                        <v-text-field v-show="esCIN==false && esFiscal==true" class="pt-0"
                          type="date"
                          :disabled="!ctacte"
                          :color="temas.forms_titulo_bg"
                          v-model="editado.vencimiento"
                          label="Vencimiento de Cta.Cte.">
                        </v-text-field>
                        </v-col>
                    </v-row>

                    <!--// DETALLES DEL IVA // -->
                    <v-row v-show="esFiscal == true || esCIN == true">
                      <v-col v-for="(item, i) in tasasIVA" :key="i" cols="2" sm="2" md="2">
                        <v-card outlined tile class="mt-0 mp-0">
                          <v-card-title class="fg150b mt-0 mp-0">
                            <span>{{item.nombre}}</span>
                          </v-card-title>
                          <v-card-text>
                            <v-text-field class="pt-0 pb-0"
                              :disabled="i==2"
                              v-model="item.base"
                              :color="temas.forms_titulo_bg"
                              label="Gravado"
                              prefix="$"
                              @change="calculoIVA('g',i)">
                            </v-text-field>
                            <v-text-field class="pt-0 pb-0"
                              :disabled="i==2"
                              v-model="item.iva"
                              :color="temas.forms_titulo_bg"
                              label="IVA"
                              prefix="$"
                              @change="calculoIVA('i',i)">
                            </v-text-field>
                            <v-text-field class="pt-0 pb-0"
                              :disabled="i==2"
                              v-model="item.total"
                              :color="temas.forms_titulo_bg"
                              label="Total"
                              prefix="$"
                              @change="calculoIVA('t',i)">
                            </v-text-field>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>

                    <!--// TOTALES DEL COMPROBANTE // -->
                    <v-row v-show="esFiscal == true || esCIN == true">
                      <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                        <v-row>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-3 pt-0">
                            <v-text-field class="pt-0 fg135b"
                              v-model="editado.exento" outlined dense
                              :color="temas.forms_titulo_bg"
                              label="Exento"
                              prefix="$"
                              @change="calculoIVA('exento')">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-3 pb-0">
                            <v-text-field class="pt-0 fg135b"
                              v-model="editado.nogravado" outlined dense
                              :color="temas.forms_titulo_bg"
                              label="No Gravado"
                              prefix="$"
                              @change="calculoIVA('nogravado')">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-3 pb-0">
                            <v-text-field class="pt-0 fg135b"
                              v-model="editado.retib" outlined dense
                              :color="temas.forms_titulo_bg"
                              label="Ret.Ing.Brutos"
                              prefix="$"
                              @change="calculoIVA('retib')">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-3 pb-0">
                            <v-text-field class="pt-0 fg135b"
                              v-model="editado.retgan" outlined dense
                              :color="temas.forms_titulo_bg"
                              label="Ret.Ganancias"
                              prefix="$"
                              @change="calculoIVA('retgan')">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-3 pb-0">
                            <v-text-field class="pt-0 fg135b"
                              v-model="editado.retiva" outlined dense
                              :color="temas.forms_titulo_bg"
                              label="Ret.IVA"
                              prefix="$"
                              @change="calculoIVA('retiva')">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-3 pb-0">
                            <v-text-field class="pt-0 fg135b"
                              v-model="editado.impint" outlined dense
                              :color="temas.forms_titulo_bg"
                              label="Imp.Internos"
                              prefix="$"
                              @change="calculoIVA('impint')">
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <!--// PIE DEL FORMULARIO CABECERA // -->
                    <v-row v-show="esFiscal == true || esCIN == true">
                      <v-col cols="12" sx="12" mx="12">
                        <v-row v-if="(editado.cpr!='PRE' || sucursalDemo) && editado.cpr!='REM'">
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                            class="pt-0 pb-0">
                            <v-text-field class="pt-0 pb-0 fg135b"
                              v-model="itemsCargadosGravadoComputer" disabled outlined dense
                              :color="temas.forms_titulo_bg"
                              label="Gravado Items Cargados">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                            class="pt-0 pb-0">
                            <v-text-field class="pt-0 pb-0 fg135b"
                              v-model="itemsCargadosIVAComputer" disabled outlined dense
                              :color="temas.forms_titulo_bg"
                              label="IVA Items Cargados">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                            class="pt-0 pb-0">
                            <v-text-field class="pt-0 pb-0 fg135b"
                              v-model="editado.tasadescuento" outlined dense
                              :color="temas.forms_titulo_bg"
                              label="% de Descuento"
                              @change="calculoIVA('tasadescuento')">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                            class="pt-0 pb-0">
                            <v-text-field class="pt-0 pb-0 fg135b"
                              v-model="editado.importedescuento" outlined dense
                              :color="temas.forms_titulo_bg"
                              label="Importe de Descuento"
                              @change="calculoIVA('importedescuento')">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                            class="pt-0 pb-0">
                            <v-text-field class="pt-0 pb-0 fg135b"
                              v-model="editado.flete" outlined dense
                              :color="temas.forms_titulo_bg"
                              label="Flete"
                              prefix="$"
                              @change="calculoIVA('flete')">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                            class="pt-0 pb-0">
                            <v-text-field class="pt-0 pb-0 fg135b"
                              v-model="editado.poradcosto" disabled outlined dense
                              :color="temas.forms_titulo_bg"
                              prefix="%"
                              label="% a Adicionar en Costos">
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-if="(editado.cpr!='PRE' || sucursalDemo) && editado.cpr!='REM'">
                          <v-col cols="2" sm="2" md="2"
                            v-show="esCIN==false && editado.tipo!='GS'" class="pt-0 pb-0">
                            <v-text-field outlined class="pt-0 pb-0 fg135b"
                              v-model="gravadoDiffComputer"
                              disabled
                              :color="temas.forms_titulo_bg"
                              label="Gravado Diferencia">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2"
                            v-show="esCIN==false && editado.tipo!='GS'" class="pt-0 pb-0">
                            <v-text-field outlined class="pt-0 pb-0 fg135b"
                              v-model="ivaDiffComputer"
                              disabled
                              :color="temas.forms_titulo_bg"
                              label="IVA Diferencia">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-0 pb-0">
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-0 pb-0">
                            <v-text-field outlined class="pt-0 pb-0 fg135b"
                              v-model="editadoGravado" disabled
                              :color="temas.forms_titulo_bg"
                              label="Total Gravado">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-0 pb-0">
                            <v-text-field outlined class="pt-0 pb-0 fg135b"
                              v-model="editadoIva" disabled
                              :color="temas.forms_titulo_bg"
                              label="Total IVA">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
                            <v-text-field outlined class="pt-0 pb-0 fg135b"
                              v-model="editadoTotal" disabled
                              :color="temas.forms_titulo_bg"
                              label="Total del Comprobante">
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <!-- FIN TOTALES DEL COMPROBANTE -->
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!--// FIN DE LA CABECERA DE LA COMPRA // -->

            <!-- INGRESO DE ITEMS -->
            <v-dialog v-model="dialogArt" max-width="1350px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar flat
                  :dark="temas.forms_titulo_dark==true"
                  :color="temas.forms_titulo_bg">
                  <v-btn
                    icon @click="cancelarArt"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">
                    {{empresa}} - Artículos del Comprobante: {{cpr}}
                    - Total de Artículos ingresados $
                    {{ formatoImporte(totalItems) }}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="editarItems==true && articulos.length>0"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text"
                    @click="guardarArt">GUARDAR
                  </v-btn>
                </v-toolbar>

                <!-- ITEMS DEL COMPROBANTE -->
                <v-card flat>
                  <v-card-text>
                    <v-row>
                      <v-col cols="2" v-show="editadoArt.ofeunidades>0">
                        <v-chip outlined>
                          <strong>{{promosComputer}}</strong>
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-row class="pt-2" v-show="editarItems==true">
                      <v-col cols="1" class="mt-0 pt-0 pl-1 pr-0">
                        <v-text-field
                          filled dense label="Código"
                          class="mt-0 pt-0"
                          :disabled="editedIndexArt>-1"
                          :color="temas.forms_titulo_bg"
                          ref="buscar"
                          autofocus
                          v-model="busArt"
                          @keyup.esc="cancelaLinea()"
                          @focus="$event.target.select()"
                          @blur="buscarArt">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" class="fg75 mt-0 pt-0 pl-1 pr-0">
                        <v-text-field
                          filled dense label="Descripción"
                          disabled
                          class="mt-0 pt-0"
                          v-model="editadoArt.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" class="fg95 mt-0 pt-0 pl-1 pr-0">
                        <v-text-field v-if="editado.cpr.substring(0,3)=='PED'"
                          filled dense label="Cantidad"
                          class="mt-0 pt-0"
                          v-model="editadoArt.cantidad"
                          type="number"
                          ref="cantidad"
                          @focus="$event.target.select()"
                          @change="guardarItem()"
                          @blur="guardarItem()"
                          @keyup.esc="cancelaLinea()">
                        </v-text-field>
                        <v-text-field v-else
                          filled dense label="Cantidad"
                          class="mt-0 pt-0"
                          v-model.number="editadoArt.cantidad"
                          type="number"
                          ref="cantidad"
                          @change="cantidadItem()"
                          @keyup.esc="cancelaLinea()">
                        </v-text-field>
                      </v-col>
                      <v-col v-if="editado.cpr.substring(0,3)=='PED'"
                        cols="2" class="fg95 mt-0 pt-0 pl-1 pr-0">
                        <v-text-field
                          filled dense label="Precio"
                          class="mt-0 pt-0"
                          disabled
                          type="number"
                          v-model="editadoArt.precio"
                          @change="precioItem('precio')">
                        </v-text-field>
                      </v-col>
                      <v-col v-else
                        cols="2" class="fg95 mt-0 pt-0 pl-1 pr-0">
                        <v-text-field
                          filled dense label="Precio"
                          class="mt-0 pt-0"
                          type="number"
                          v-model="editadoArt.costo"
                          @change="precioItem('costo')">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" class="fg95 mt-0 pt-0 pl-1 pr-0">
                        <v-text-field
                          filled dense label="% Desc."
                          class="mt-0 pt-0"
                          :disabled="editado.cpr.substring(0,3)=='PED'"
                          type="number"
                          v-model="editadoArt.tasadescuento">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" class="fg95 mt-0 pt-0 pl-1 pr-0">
                        <v-text-field
                          filled dense label="Desc."
                          class="mt-0 pt-0"
                          :disabled="editado.cpr.substring(0,3)=='PED'"
                          type="number"
                          @blur="guardarItem()"
                          v-model="editadoArt.importedescuento">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" class="fg95 mt-0 pt-0 pl-1 pr-0">
                        <v-text-field
                          filled dense label="TOTAL"
                          class="mt-0 pt-0" disabled
                          type="number"
                          v-model="editadoArt.total">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="pb-0">
                      <v-col v-show="seleccionarArticulo == true"
                        cols="12" sm="12" md="12">
                        <v-data-table
                          class="elevation-1 pt-0 pb-0"
                          :headers="headersSelArt"
                          :color="temas.forms_titulo_bg"
                          :items="selArt"
                          dense
                          single-select
                          @click:row="selArtClick"
                          :footer-props="footProps(10)">
                          <template v-slot:item.costo="{ item }">
                            <span>${{ formatoImporteDec(item.costo,3) }}</span>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                    <v-row>
                      <div class="pl-3 pr-0">
                        <v-data-table
                          :headers="headersArt"
                          :items="articulos"
                          dense
                          item-key='index'
                          class="elevation-1 pr-0 ml-0"
                          @click:row="editarArt"
                          :footer-props="footProps(10)">
                          <template v-slot:item.activo="{ item }">
                            <v-chip
                              :color="getColor(item.activo)"
                              dark>{{item.activo?'Sí':'No'}}
                            </v-chip>
                          </template>
                          <template v-slot:item.codigo="{ item }">
                            <span>{{ item.codigo }}</span>
                            <v-badge
                              inline
                              :content="item.ivatasa"
                              :color="temas.forms_btn_add_bg"
                              :dark="temas.forms_btn_add_bg==true" left>
                            </v-badge>
                          </template>
                          <template v-slot:item.nombre="{ item }">
                            <span class="fg75">{{ item.nombre }}</span>
                          </template>
                          <template v-slot:item.precio="{ item }">
                            <span class="fg">${{ formatoImporteDec(item.precio,4) }}</span>
                          </template>
                          <template v-slot:item.costo="{ item }">
                            <span class="fg">${{ formatoImporteDec(item.costo,5) }}</span>
                          </template>
                          <template v-slot:item.cantidad="{ item }">
                            <span class="fg">{{ formatoImporte(item.cantidad) }}</span>
                          </template>
                          <template v-slot:item.total="{ item }">
                            <span class="fg">${{ formatoImporte(item.total) }}</span>
                          </template>
                          <template v-slot:item.tasadescuento="{ item }">
                            <v-badge v-if="item.texto=='Promocion'"
                              class="pt-3 pl-0 pr-0"
                              content="ofe"
                              :color="temas.forms_btn_add_bg"
                              :dark="temas.forms_btn_add_bg==true" left>
                            </v-badge>
                            <span>{{ formatoImporte(item.tasadescuento) }}</span>
                          </template>
                          <template v-slot:item.importedescuento="{ item }">
                            <span class="fg">
                              ${{ formatoImporte(item.importedescuento) }}
                            </span>
                          </template>
                          <template v-slot:item.accion="{item}">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab x-small
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  class="mr-2"
                                  @click="editarArt(itemActualItem)" v-on="on">
                                  <v-icon dark>mdi-pencil</v-icon>
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
                                  @click="borrarItem(item)" v-on="on">
                                  <v-icon dark>mdi-delete</v-icon>
                                </v-btn>
                              </template>
                              <span>Borrar Linea</span>
                            </v-tooltip>
                          </template>
                        </v-data-table>
                      </div>
                    </v-row>
                    <v-row v-show="editarItems==true" class="mt-6 pb-0">
                      <v-col cols="9" class="mt-0 pt-0">
                      </v-col>
                      <v-col cols="1" class="mt-0 pt-0">
                        <span>Total Items</span>
                      </v-col>
                      <v-col cols="2" class="mt-0 pt-0">
                        <span><b>${{ formatoImporte(totalItems) }}</b>
                        </span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card>
            </v-dialog>
            <!-- FIN INGRESO DE ITEMS -->

            <!--// IMPORTAR COMPROBANTE DESDE // -->
            <v-dialog v-model="dialogImportarDesde" :fullscreen="true" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat dark :color="temas.forms_titulo_bg">
                <v-btn icon @click="dialogImportarDesde=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Importar Factura de Compra desde {{importarDesdeFormato}}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card>
                <v-form>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-autocomplete
                            ref="proveedor"
                            v-model="editado.tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTerceros"
                            :search-input.sync="searchTerceros"
                            :color="temas.forms_titulo_bg"
                            item-text="nombre"
                            item-value="id"
                            :disabled="editedIndex!=-1"
                            autofocus
                            label="Proveedor"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="6" sx="6" mx="6" class="pt-0">
                          <v-file-input
                            v-model="excel"
                            :label="importarDesdeFormato=='Archivo Excel'
                              ?'Archivo Excel'
                              :'Archivo PDF'"
                            :prepend-icon="importarDesdeFormato=='Excel'
                              ?'mdi-file-excel-box'
                              :'mdi-file-pdf-box'"
                            :color="temas.forms_titulo_bg"
                            @change="cargarXls">
                            <template v-slot:selection="{ text }">
                              {{ excel.name ? excel.name : excel }}
                            </template>
                          </v-file-input>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="compraExcel.cuit"
                            :color="temas.forms_titulo_bg"
                            label="CUIT">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            type="date"
                            v-model="compraExcel.fecha"
                            :color="temas.forms_titulo_bg"
                            label="Fecha">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-select class="pt-0"
                            label="Per.Fiscal"
                            v-model="compraExcel.perfiscal"
                            :color="temas.forms_titulo_bg"
                            :items="periodosAbiertos">
                          </v-select>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            v-model="compraExcel.tipcpr"
                            :color="temas.forms_titulo_bg"
                            label="Cpr">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            v-model="compraExcel.succpr"
                            :color="temas.forms_titulo_bg"
                            label="Suc">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="compraExcel.nrocpr"
                            :color="temas.forms_titulo_bg"
                            label="Número">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            v-model="compraExcel.moneda"
                            :color="temas.forms_titulo_bg"
                            label="Moneda">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-data-table
                          :headers="headersArtExcel"
                          :items="compraExcel.items"
                          dense
                          class="elevation-3 pl-0"
                          @click:row="editarArt"
                          :footer-props="footProps(10)">
                          <template v-slot:item.activo="{ item }">
                            <v-chip
                              :color="getColor(item.activo)"
                              dark>{{item.activo?'Sí':'No'}}
                            </v-chip>
                          </template>
                          <template #item.nombre="{ value }">
                            <div class="text-truncate" style="max-width: 245px">
                              {{ value }}
                            </div>
                          </template>
                          <template v-slot:item.precio="{ item }">
                            <span class="fg">${{ formatoImporte(item.precio) }}</span>
                          </template>
                          <template v-slot:item.costo="{ item }">
                            <span class="fg">{{ formatoImporte(item.costo) }}</span>
                          </template>
                          <template v-slot:item.cantidad="{ item }">
                            <span class="fg">{{ formatoImporte(item.cantidad) }}</span>
                          </template>
                          <template v-slot:item.total="{ item }">
                            <span class="fg">${{ formatoImporte(item.total) }}</span>
                          </template>
                          <template v-slot:item.tasdes="{ item }">
                            <span class="fg">%{{ formatoImporte(item.tasdes) }}</span>
                          </template>
                          <template v-slot:item.impdes="{ item }">
                            <span class="fg">${{ formatoImporte(item.impdes) }}</span>
                          </template>
                          <template v-slot:item.accion="{item}">
                            <v-menu bottom left>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on"
                                  @click="setAccionesItems(item)">
                                  <v-icon>mdi-18px mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>
                              <v-list dense>
                                <v-list-item-group :color="temas.forms_titulo_bg">
                                  <v-list-item
                                    v-for="(item, i) in accionesItems" :key="i">
                                    <v-list-item-icon>
                                      <v-icon
                                        class="font-size: 24px"
                                        @click="selAccionItem(item)" v-text="item.icon">
                                      </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                      <v-list-item-title
                                        class="caption"
                                        @click="selAccionItem(item)">{{ item.nombre }}
                                      </v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list-item-group>
                              </v-list>
                            </v-menu>
                          </template>
                        </v-data-table>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN IMPORTAR COMPROBANTE DESDE EXCEL -->

            <!-- ANULACION DE PAGOS // -->
            <v-dialog v-model="dialogPagAnula" max-width="510px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat dark :color="temas.forms_titulo_bg">
                <v-btn icon @click="dialogPagAnula=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Anular Pago
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card class="fg">
                <v-form ref="anupag">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <span class="fg110" v-if="pagoVinculado">
                            Vas a anular el pago <b>{{ itemActual.cpr }}</b><br><br>
                            <b>PAGO VINCULADO{{idNotificacionAnulacionPago}}</b><br>
                            <span v-if="idNotificacionAnulacionPago!=null">
                              <span v-if="idNotificacionTipo=='R'">
                                ¡El Proveedor ha rechazado el pago!
                              </span>
                              <span v-else>
                                ¡El Proveedor aún no descargo el pago, se eliminará
                                la notificación para que no lo descargue!
                              </span>
                            </span>
                            <span v-else>
                              Se enviará una notificación a <b>
                                {{itemActual.tercero!=null?itemActual.tercero.nombre:''}}
                              </b><br> para avisar de la anulación de este Pago.
                              <span v-if="hayRecibo!=''">
                                <span v-if="reciboAAnularEstado=='A'">
                                  <br><br>El ya anuló su recibo <b>{{ hayRecibo }}</b>
                                  , por lo tanto si anulas este pago la transacción quedará
                                  espejada.
                                  <br><br>
                                </span>
                                <span v-else>
                                  <br><br>El ya emitió el recibo <b>{{ hayRecibo }}</b>, que deberá
                                  anular para que ambas cuentas queden espejadas.<br><br>
                                </span>
                              </span>
                            </span>
                          </span>
                          <div v-if="cttChePropEnPago>0">
                            <span class="fg110">
                              Este Pago posee <b>{{cttChePropEnPago}}</b>
                            </span>
                            <span class="fg110" v-if="cttChePropEnPago==1">
                              cheque propio y ya fue marcado en la chequera como utilizado.<br>
                              Si quieres volver a utilizarlo marca en la casilla mas abajo.
                            </span>
                            <span class="fg110" v-else>
                              cheques propios utilizados que fueron marcados en la chequera como
                              utilizados.<br>
                              Si quieres volver a utilizarlos marca en la casilla mas abajo.
                            </span><br>
                            <v-checkbox class="fg110"
                              v-model="chePropEnPagoMantener"
                              :label="cttChePropEnPago==1?
                              'Volver a utilizar este cheque':'Volver a utilizar estos cheques'">
                            </v-checkbox>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="3"></v-col>
                        <v-col cols="5">
                          <v-btn class="text--center"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            @click="anularPagoHTTP()">
                            Confirmar Anulación
                          </v-btn>
                        </v-col>
                        <v-col cols="3"></v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN ANULACION DE PAGOS -->

            <!--// TIMELINE // -->
            <v-dialog v-model="dialogTimeLine" max-width="500px" persistent
              :transition="transition==null?'false':transition">
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
                  Seguimiento del comprobante
                  {{ itemActual != null ? itemActual.cpr : '' }}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card class="mx-auto" max-width="500">
                <v-card-text class="py-0">
                  <v-timeline align-top dense>
                    <v-timeline-item
                      v-for="(tm, idx) in timeLine" v-bind:key="idx"
                      :color="temas.barra_principal_bg" small>
                        <v-card class="caption" :color="temas.forms_titulo_bg" dark>
                          <v-card-title class="pt-1 pb-1 subtitle-2">
                            {{tm.novedad}}
                          </v-card-title>
                          <v-card-text class="pt-2 pb-0 caption white text--primary">
                            <p>{{ fechaTimeLine(tm.created_at) }}<br>{{ tm.detalles }}</p>
                          </v-card-text>
                        </v-card>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- FIN DEL TIMELINE -->

            <!--// EDITAR PERIODO FISCAL Y VENCIMIENTO // -->
            <v-dialog v-model="dialogCambiarPeriodoFiscal" max-width="400px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogCambiarPeriodoFiscal=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  Editar comprobante
                  {{ itemActual != null ? itemActual.cpr : '' }}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card class="mx-auto" max-width="400px">
                <v-card-text class="py-0">
                  <v-row v-if="!importada(itemActual)">
                    <v-col cols="12" sm="5"
                      class="fg pt-6">
                      <v-select class="pt-0"
                        label="Comprobante"
                        v-model="editado.comprobante_id"
                        :color="temas.forms_titulo_bg"
                        :disabled="editedIndex!=-1 || editado.cpr.substring(0,3)=='PED'"
                        :items="cprItems"
                        item-value="id"
                        item-text="abrev"
                        autocomplete>
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="3"
                      class="fg pt-6">
                      <v-text-field class="pt-0"
                        v-model="afipSuc"
                        :disabled="editedIndex!=-1 || editado.cpr.substring(0,3)=='PED'"
                        @change="afipsuc()"
                        label="Suc">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4"
                      class="fg pt-6">
                      <v-text-field class="pt-0"
                        v-model="afipNro"
                        :disabled="editado.cpr.substring(0,3)=='PED'"
                        :color="temas.forms_titulo_bg"
                        label="Numero"
                        @change="buscarCpr()">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="pt-0 pb-0">
                    <v-col cols="6" sm="6">
                      <v-select
                        label="Per.Fiscal"
                        v-model="editado.perfiscal"
                        :color="temas.forms_titulo_bg"
                        :items="periodosAbiertos">
                      </v-select>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        type="date"
                        :disabled="editado.cpr.substring(0,3)=='PED'"
                        :color="temas.forms_titulo_bg"
                        v-model="editado.vencimiento"
                        label="Vencimiento">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3" sm="3" md="3" class="pt-6 pb-6"></v-col>
                    <v-col cols="6" sm="6" md="6" class="pt-6 pb-6">
                      <v-btn v-show="valDiferencia==0" class="text--center"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="confirmarCambioDePeriodo">
                        Confirmar
                      </v-btn>
                    </v-col>
                    <v-col cols="3" sm="3" md="3" class="pt-6 pb-6">
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- FIN DEL CAMNBIO PERIODO FISCAL -->

            <!--PAGO -->
            <v-dialog v-model="dialogPag" max-width="1300px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true"
                  icon @click="dialogPag=false">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="fg text--right">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                <v-btn
                  v-show="totValores>0"
                  class="fg85"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarPag()">
                  Confirmar Pago
                </v-btn>
              </v-toolbar>
              <v-card>
                <v-form ref="pend">
                  <v-card-text>
                    <v-container>
                      <!-- PIDO PROVEEDOR -->
                      <v-row class="fg" v-show="pagoDeUnSoloComprobante==false">
                        <v-col cols="12" md="7" class="fg pt-6">
                          <v-row v-if="!encontroElProveedor">
                            <v-col cols="12" sm="12" class="fg pt-0">
                              <v-text-field
                                ref="codigoproveedor"
                                v-model="editado.tercero_id"
                                :color="temas.forms_titulo_bg"
                                label=
                                "Ingresa el Código, el Nombre o el CUIT. Utiliza el caracter % para
                                buscar por parecido."
                                :disabled="editedIndex!=-1"
                                autofocus
                                v-on:blur="buscarProveedor()">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-else>
                            <v-col cols="12" sm="2" class="pt-3 pl-2 fg">
                              <v-btn
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                class="mt-0 mr-2 text-capitalize"
                                @click="encontroElProveedor=false"
                                :disabled="basadoEnCpr">
                                Buscar
                              </v-btn>
                            </v-col>
                            <v-col cols="12" sm="2" class="pt-0 fg">
                              <v-text-field
                                ref="codigoproveedor"
                                v-model="editado.tercero_id"
                                label="Código"
                                disabled>
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="8" class="pt-0 fg">
                              <v-text-field
                                v-model="editado.nombre"
                                label="Nombre del Proveedor"
                                disabled>
                              </v-text-field>
                            </v-col>
                          </v-row>

                          <!-- PENDIENTES PARA CANCELAR -->
                          <v-row>
                            <v-col cols="12" md="12">
                              <span class="fg"><b>Movimientos pendientes de pago</b></span>
                              <v-data-table
                                :headers="headersPend"
                                :items="pend"
                                dense
                                class="elevation-3"
                                :footer-props="footProps(10)"                                >
                                <template v-slot:item.cpr="{ item }">
                                  <span class="fg">{{ item.cpr }}</span>
                                </template>
                                <template v-slot:item.vencimiento="{ item }">
                                  <span class="fg">{{ formatoFecha(item.vencimiento) }}</span>
                                </template>
                                <template v-slot:item.pendiente="{ item }">
                                  <span class="fg">${{ formatoImporte(item.pendiente) }}</span>
                                </template>
                                <template v-slot:item.descuentos="{ item }">
                                  <span class="fg">${{ formatoImporte(item.descuentos) }}</span>
                                </template>
                              </v-data-table>
                            </v-col>
                          </v-row>

                          <!-- SELECCION DE MEDIOS DE PAGO -->
                          <v-row class="fg ml-1">
                            <v-col cols="2">
                              <v-switch class="pt-1 pb-2"
                                label="Vuelto"
                                v-model="vuelto"
                                :color="temas.forms_titulo_bg">
                              </v-switch>
                            </v-col>
                            <v-col cols="10" class="pl-8">
                              <v-radio-group v-model="medioDePagoId" row>
                                <v-radio v-for="item in medpag"
                                  :key="item.id" dense
                                  :value="item.id"
                                  :label="item.nombre"
                                  v-show="item.activo==true"
                                  :color="temas.forms_titulo_bg"
                                  @click="setFP(item.id)">
                                </v-radio>
                              </v-radio-group>
                            </v-col>
                          </v-row>
                          <!-- FIN DE SELECCION DE MEDIOS DE PAGO -->

                        </v-col>
                        <v-col cols="12" sm="5">
                          <v-row><v-col><span></span></v-col></v-row>
                          <v-row>
                            <v-col cols="12" md="12" class="fg">
                              <span class="fg"><b>Selecciona como quieres pagar</b></span>
                              <v-data-table
                                :headers="headersCondDePagos"
                                :items="condicionesDePago"
                                item-key="id"
                                dense class="elevation-3"
                                @click:row="onRowClick"
                                :footer-props="footProps(10)">
                                <template v-slot:item.nombre="{ item }">
                                  <span :style="getCellStyles(item)">
                                    {{ item.nombre }}
                                  </span>
                                </template>
                                <template v-slot:item.apagar="{ item }">
                                  <span :style="getCellStyles(item)">
                                    ${{ formatoImporte(item.apagar) }}
                                  </span>
                                </template>
                              </v-data-table>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <!-- FIN DE PENDIENTES A CANCELAR -->

                      <!--// DIALOGO SELECCION DE VALORES QUE SALEN EN EL PAGO// -->
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <span class="fg"><b>Valores ingresados</b></span>
                          <v-data-table
                            :headers="headersMed"
                            :items="valores"
                            dense
                            class="elevation-3"
                            :footer-props="footProps(6)">
                            <template v-slot:top>
                              <v-dialog v-model="dialogMed" :max-width="medpagwidth" persistent
                                :transition="transition==null?'false':transition">
                                <v-card class="fg">
                                  <v-toolbar flat
                                    :color="temas.forms_titulo_bg"
                                    :dark="temas.forms_titulo_dark==true">
                                    <v-btn
                                      icon @click="cancelarMed"
                                      :color="temas.forms_close_bg"
                                      :dark="temas.forms_close_dark==true">
                                      <v-icon>mdi-arrow-left-circle</v-icon>
                                    </v-btn>
                                    <div v-if="tipo=='PP'">
                                      <span
                                        v-if="medioDePagoNombre.substring(0,3)=='Ch.'">
                                        {{ medioDePagoNombre }}
                                        (Máximo {{maxDiasChq}} días).
                                      </span>
                                      <span v-else class="fg">
                                        {{ medioDePagoNombre }}
                                      </span>
                                    </div>
                                    <div v-else>
                                      <span v-if="medioDePagoNombre.substring(0,3)=='Ch.'">
                                        Carga de Cheques de Terceros
                                        (Máximo {{maxDiasChq}} días).
                                      </span>
                                      <span v-else class="fg">
                                        {{ medioDePagoNombre }}
                                      </span>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <v-btn v-if="elMedioEstaOk"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      @click="guardarMed()">
                                      Confirmar Selección
                                    </v-btn>
                                  </v-toolbar>

                                  <v-card-text>
                                    <!-- MEDIOS DE PAGO -->
                                    <!-- GRILLA DE CHEQUES DE TERCERO -->
                                    <v-row v-show="habinhab('cheque de tercero')"
                                      class="pt-6">
                                      <v-col cols="12" sm="12" md="12">
                                        <!-- tipo!='PP' SELECCION DE CHEQUES DE TERCEROS -->
                                        <v-row v-if="tipo!='PP'">
                                          <v-col cols="12" sm="12" md="12">
                                            <v-data-table
                                              v-model="selectedCheque"
                                              :headers="headersCartera"
                                              :items="cartera"
                                              dense
                                              class="elevation-1"
                                              item-key="id"
                                              :footer-props="footProps(10)">
                                              <template v-slot:item.importe="{ item }">
                                                <span>${{ formatoImporte(item.importe) }}</span>
                                              </template>
                                              <template v-slot:item.fechafinanciera="{ item }">
                                                <span>
                                                  {{ formatoFechaCorta(item.fechafinanciera) }}
                                                </span>
                                              </template>
                                              <template v-slot:item.accion="{item}">
                                                <v-tooltip bottom>
                                                  <template v-slot:activator="{ on }">
                                                    <v-btn
                                                      fab x-small
                                                      :color="item.seleccionado==0?
                                                      temas.cen_btns_bg:
                                                      temas.cen_card_activo_bg"
                                                      :dark="temas.cen_btns_dark==true"
                                                      class="mr-2"
                                                      @click="selectCartera(item)" v-on="on">
                                                      <v-icon>
                                                        mdi-checkbox-marked-outline
                                                      </v-icon>
                                                    </v-btn>
                                                  </template>
                                                  <span class="fg">Seleccionar</span>
                                                </v-tooltip>
                                              </template>
                                            </v-data-table>
                                            <v-row v-show="habinhab('cheque de tercero')"
                                              class="pt-4">
                                              <v-col cols="3" sm="3" md="3">
                                                <v-btn
                                                  :color="temas.cen_btns_bg"
                                                  :dark="temas.cen_btns_dark==true"
                                                  @click="seleccionAutomatica">
                                                  Selección Automática
                                                </v-btn>
                                              </v-col>
                                              <v-col cols="3" sm="3" md="3">
                                                <v-btn
                                                  :color="temas.cen_btns_bg"
                                                  :dark="temas.cen_btns_dark==true"
                                                  @click="limpiarSeleccion">
                                                  Limpiar Selección
                                                </v-btn>
                                              </v-col>
                                              <v-col cols="2" sm="2" md="2">
                                                <v-text-field
                                                  disabled dense outlined
                                                  v-model="importeTotalDelPago"
                                                  label="A seleccionar">
                                                </v-text-field>
                                              </v-col>
                                              <v-col cols="2" sm="2" md="2">
                                                <v-text-field
                                                  disabled dense outlined
                                                  v-model="totCheTerSelecc"
                                                  label="Total cheques seleccionados">
                                                </v-text-field>
                                              </v-col>
                                              <v-col cols="2" sm="2" md="2">
                                                <v-text-field
                                                  disabled dense outlined
                                                  v-model="totCheTerDiff"
                                                  label="Falta">
                                                </v-text-field>
                                              </v-col>
                                            </v-row>
                                          </v-col>
                                        </v-row>

                                        <!-- tipo=='PP' CARGA DE CHEQUES DE TERCEROS -->
                                        <v-row v-else>
                                          <v-row class="pt-4">
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
                                                @blur="elMedioEsOk()">
                                              </v-text-field>
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
                                                @blur="elMedioEsOk()">
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
                                                @blur="elMedioEsOk()">
                                              </v-autocomplete>
                                            </v-col>
                                          </v-row>
                                          <v-row>
                                            <v-col cols="6" sm="6" md="6">
                                              <v-text-field
                                                v-model="editadoMed.nombre"
                                                label="Nombre del Titular"
                                                :color="temas.forms_titulo_bg"
                                                disabled
                                                required
                                                :counter="30"
                                                :maxlength="30"
                                                @blur="elMedioEsOk()">
                                              </v-text-field>
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
                                                @blur="elMedioEsOk()">
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
                                                  @click:prepend-inner="verificoFechaDelCheque()"
                                                  @change.stop="verificoFechaDelCheque()"
                                                  @blur="elMedioEsOk()">
                                                </v-text-field>
                                              </v-badge>
                                            </v-col>
                                            <v-col cols="2" sm="2" md="2">
                                              <v-text-field
                                                v-model="editadoMed.importe"
                                                :color="temas.forms_titulo_bg"
                                                label="Importe del Cheque"
                                                @blur="guardarMed()">
                                              </v-text-field>
                                            </v-col>
                                          </v-row>
                                          <v-row v-show="habinhab('cheque de tercero')">
                                            <v-col cols="2" sm="2" md="2">
                                              <v-text-field
                                                disabled dense outlined
                                                v-model="importeTotalDelPago"
                                                label="A cargar">
                                              </v-text-field>
                                            </v-col>
                                            <v-col cols="2" sm="2" md="2">
                                              <v-text-field
                                                disabled dense outlined
                                                v-model="totCheTerSelecc"
                                                label="Total cheques cargados">
                                              </v-text-field>
                                            </v-col>
                                            <v-col cols="2" sm="2" md="2">
                                              <v-text-field
                                                disabled dense outlined
                                                v-model="totCheTerDiff"
                                                label="Falta">
                                              </v-text-field>
                                            </v-col>
                                          </v-row>
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                    <!-- GRILLA DE CHEQUES DE TERCERO -->

                                    <!-- TARJETA -->
                                    <v-row v-show="habinhab('tarjeta')">
                                      <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                                        <v-select
                                          label='Tarjeta'
                                          v-model="editadoMed.tarjeta_id"
                                          :color="temas.forms_titulo_bg"
                                          :items="tarItems"
                                          item-value="id"
                                          @change="elMedioEsOk()"
                                          :item-text="tarItems=>
                                            `${tarItems.nombre} -
                                            ${tarItems.debito ? ' Débito ' : ' Crédito '} -
                                            Nro: ${tarItems.numero} - Ven: ${tarItems.vencimiento}
                                            `">
                                        </v-select>
                                      </v-col>
                                    </v-row>

                                    <!-- CHEQUE PROPIO -->
                                    <v-row v-show="habinhab('cuenta origen')">
                                      <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                                        <v-select
                                          label='Cuenta Origen'
                                          v-model="editadoMed.cuentaorigen_id"
                                          :color="temas.forms_titulo_bg"
                                          :items="cueItems"
                                          item-value="id"
                                          :item-text="cueItems=>
                                            `${cueItems.banco.nombre} -Cuenta:
                                            ${cueItems.cuenta} - ${cueItems.nombre}`"
                                            @change="selCuenta() || elMedioEsOk()">
                                        </v-select>
                                      </v-col>
                                    </v-row>
                                    <v-row v-show="habinhab('cheque propio')">
                                      <v-col cols="5" sm="5" md="5" class="pt-0 pb-0">
                                        <v-select
                                          label="Chequera"
                                          v-model="editadoMed.chequera_id"
                                          :color="temas.forms_titulo_bg"
                                          :items="chraItems"
                                          item-value="id"
                                          :item-text="cueItems=>
                                          `${cueItems.nombre}
                                          (${cueItems.echeq?'echeqs':'físicos'})`"
                                          autocomplete
                                          @change="selChequera()||elMedioEsOk()"
                                          return-object>
                                        </v-select>
                                      </v-col>
                                      <v-col cols="3" sm="3" md="3" class="pt-0 pb-0">
                                        <v-select v-if="!echeq"
                                          label="Cheque"
                                          v-model="editadoMed.cheque_id"
                                          :color="temas.forms_titulo_bg"
                                          :items="cheItems"
                                          item-value="id"
                                          item-text="numero"
                                          autocomplete
                                          @change="elMedioEsOk()"
                                          return-object>
                                        </v-select>
                                        <v-text-field v-else
                                          v-model="editadoMed.nrovalor"
                                          label="Nro de eCheq">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="3" sm="3" md="3" class="pt-0 pb-0">
                                        <v-badge
                                          :content="diasDelCheque"
                                          :color="temas.forms_btn_add_bg"
                                          :dark="temas.forms_btn_add_bg==true" left>
                                          <v-text-field
                                            type="date"
                                            v-model="editadoMed.fechafinanciera"
                                            :color="temas.forms_titulo_bg"
                                            label="Fecha del Cheque"
                                            @input="verificoFechaDelCheque()"
                                            @change="verificoFechaDelCheque()"
                                            @blur="elMedioEsOk()">
                                          </v-text-field>
                                        </v-badge>
                                      </v-col>
                                    </v-row>

                                    <!-- TRANSFERENCIAS -->
                                    <v-row v-show="habinhab('transferencia')||habinhab('tarjeta')">
                                      <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                                        <v-select
                                          label='Cuenta Destino'
                                          v-model="editadoMed.cuentadestino_id"
                                          :color="temas.forms_titulo_bg"
                                          :items="cueProvItems"
                                          item-value="id"
                                          @change="elMedioEsOk()"
                                          :item-text="cueProvItems=>
                                            `${cueProvItems.banco.nombre} -Cuenta:
                                            ${cueProvItems.cuenta} - ${cueProvItems.nombre}`">
                                        </v-select>
                                      </v-col>
                                    </v-row>

                                    <!-- FOTO -->
                                    <v-row v-show="habinhab('transferencia')">
                                      <v-col cols="6" sm="6" align="center" class="pt-0 pb-0">
                                        <v-file-input
                                          v-model="foto"
                                          label="Foto del valor"
                                          prepend-icon="mdi-camera"
                                          :color="temas.forms_titulo_bg"
                                          @change="fotoClick">
                                          <template v-slot:selection="{ text }">
                                            {{ foto.name?foto.name:foto }}
                                          </template>
                                        </v-file-input>
                                      </v-col>
                                      <v-col cols="6" sm="6" align="center" class="pt-0 pb-0">
                                        <v-img
                                          :src="`/images/${foto.name ? foto.name : foto}`"
                                          aspect-ratio="1.4" contain
                                          class="pb-0">
                                        </v-img>
                                      </v-col>
                                    </v-row>
                                    <!-- FOTO -->

                                    <v-row>
                                      <v-col v-show="
                                        habinhab('transferencia') ||
                                        habinhab('tarjeta')"
                                        cols="6" sm="6" md="6" class="pt-0 pb-0">
                                        <v-text-field
                                          v-model="editadoMed.nrovalor"
                                          @keyup="elMedioEsOk()"
                                          :color="temas.forms_titulo_bg"
                                          label="Nro Referencia">
                                        </v-text-field>
                                      </v-col>
                                      <v-col v-show="
                                        habinhab('transferencia') ||
                                        habinhab('efectivo') ||
                                        habinhab('tarjeta') ||
                                        habinhab('cheque propio') ||
                                        habinhab('chequera')"
                                        cols="6" sm="6" md="6" class="pt-0 pb-0">
                                        <v-text-field
                                          v-model="editadoMed.importe"
                                          @keyup="elMedioEsOk()"
                                          :color="temas.forms_titulo_bg"
                                          label="Importe">
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                    <!-- FIN MEDIOS DE PAGO -->
                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip label
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.vuelto="{item}">
                              <span>{{ item.vuelto?'Sí':'No' }}</span>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    class="mr-2"
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="borrarMed(item)" v-on="on">
                                    <v-icon dark>mdi-delete</v-icon>
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
                      <!-- FIN DIALOGO SELECCION/CARGA DE VALORES -->

                      <!-- PIE CON TOTALES -->
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                              BALANCE DEL PAGO
                              <v-chip
                                :color="valDiferencia==0?'green':'red'"
                                :dark="!temas.forms_close_dark">
                                {{ balanceDelPago }}
                              </v-chip>
                            </v-col>
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                disabled dense outlined
                                v-model="totAPagar"
                                label="A Pagar">
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

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEL PAGO -->

            <!--// ADMINISTRACION DE GASTOS // -->
            <v-dialog v-model="dialogGas" max-width="1260px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-data-table
                :headers="headersGas"
                :items="gastos"
                :search="search"
                dense
                class="fg elevation-3"
                :footer-props="footProps(10)">
                <template v-slot:top>
                  <v-toolbar flat
                    :color="temas.forms_titulo_bg"
                    :dark="temas.forms_titulo_dark==true">
                    <v-btn icon @click="dialogGas=false"
                      :color="temas.forms_close_bg"
                      :dark="temas.forms_close_dark==true">
                      <v-icon>mdi-arrow-left-circle</v-icon>
                    </v-btn>
                    <template v-slot:extension>
                      <v-btn fab
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="nuevoGasto">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <v-toolbar-title class="fg">
                      Gastos Programados
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <!-- Modal del diálogo para Alta y Edicion -->
                    <v-dialog v-model="dialogGasEdit" max-width="600px" persistent
                      :transition="transition==null?'false':transition">
                      <template v-slot:activator="{ on }"></template>
                      <v-card>
                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">
                          <v-btn icon
                            :color="temas.forms_close_bg"
                            :dark="temas.forms_close_dark==true"
                            @click="cancelarGas">
                            <v-icon>mdi-arrow-left-circle</v-icon>
                          </v-btn>
                          <span class="fg">{{ formTitleGas }}</span>
                          <v-spacer></v-spacer>
                          <v-btn v-show="gastoOk"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            class="ma-2 white--text" @click="guardarGas">Guardar
                          </v-btn>
                        </v-toolbar>
                        <v-form ref="form">
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col cols="12" md="5" class="fg pt-0">
                                  <v-row v-if="!encontroElProveedor">
                                    <v-col cols="12" sm="12" class="fg pt-0">
                                      <v-text-field
                                        ref="codigoproveedor"
                                        v-model="editado.tercero_id"
                                        :color="temas.forms_titulo_bg"
                                        label=
                                        "Ingresa el Código, el Nombre o el CUIT.
                                        Utiliza el caracter % para buscar por parecido."
                                        :disabled="editedIndex!=-1"
                                        autofocus
                                        v-on:blur="buscarProveedor()">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row v-else>
                                    <v-col cols="12" sm="2" class="pt-3 pl-2 fg">
                                      <v-btn
                                        :color="temas.cen_btns_bg"
                                        :dark="temas.cen_btns_dark==true"
                                        class="mt-0 mr-2 text-capitalize"
                                        @click="encontroElProveedor=false">
                                        Buscar
                                      </v-btn>
                                    </v-col>
                                    <v-col cols="12" sm="2" class="pt-0 fg">
                                      <v-text-field
                                        ref="codigoproveedor"
                                        v-model="editado.tercero_id"
                                        label="Código"
                                        disabled>
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="8" class="pt-0 fg">
                                      <v-text-field
                                        v-model="editado.nombre"
                                        label="Nombre del Proveedor"
                                        disabled>
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="5" sm="5" md="5" class="pt-0">
                                  <v-text-field
                                    ref="refvencimiento"
                                    type="date"
                                    v-model="editadoGas.vencimiento"
                                    :color="temas.forms_titulo_bg"
                                    label="Vencimiento"
                                    @change="cambioElVencimiento() && estaElGastoOk()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="5" sm="5" md="5" class="pt-0">
                                  <v-text-field
                                    type="date"
                                    v-model="editadoGas.proximovencimiento"
                                    :color="temas.forms_titulo_bg"
                                    label="Próximo Vencimiento">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="2" sm="2" md="2" class="pt-0">
                                  <v-select
                                    label="Per.Fiscal" v-model="editadoGas.periodo"
                                    :color="temas.forms_titulo_bg"
                                    :items="periodosAbiertos">
                                  </v-select>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-text-field
                                    v-model="editadoGas.gravado"
                                    :color="temas.forms_titulo_bg"
                                    label="Gravado"
                                    @change="calculoElGasto() && estaElGastoOk()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-select v-show="esFiscal == true"
                                    label="Tasa de IVA"
                                    v-model="editadoGas.iva_id"
                                    :color="temas.forms_titulo_bg"
                                    :items="tasasIVA"
                                    item-value="afipiva_id"
                                    item-text="nombre"
                                    autocomplete
                                    return-object
                                    @change="calculoElGasto() && estaElGastoOk()">
                                  </v-select>
                                </v-col>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-text-field
                                    v-model="editadoGas.iva"
                                    :color="temas.forms_titulo_bg"
                                    label="IVA"
                                    @change="calculoElGasto() && estaElGastoOk()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-text-field
                                    v-model="editadoGas.total"
                                    :color="temas.forms_titulo_bg"
                                    label="Total"
                                    @change="estaElGastoOk()">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="7" sm="7" md="7" class="pt-0">
                                  <v-container fluid>
                                    <v-radio-group class="pt-0"
                                      v-model="editadoGas.fiscal" row>
                                      <v-radio value="1"
                                        :color="temas.forms_titulo_bg">
                                        <template v-slot:label>
                                          <div>
                                            <strong class="success--text">Fiscal</strong>
                                          </div>
                                        </template>
                                      </v-radio>
                                      <v-radio value="0"
                                        :color="temas.forms_titulo_bg">
                                        <template v-slot:label>
                                          <div>
                                            <strong class="primary--text">No Fiscal</strong>
                                          </div>
                                        </template>
                                      </v-radio>
                                    </v-radio-group>
                                  </v-container>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="3" sx="3" mx="3" class="pt-0">
                                  <v-text-field
                                    type="number"
                                    v-model="editadoGas.cuota"
                                    :color="temas.forms_titulo_bg"
                                    label="Cuota"
                                    @click="calculoCuotas()"
                                    @change="calculoCuotas()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-text-field
                                    type="number"
                                    v-model="editadoGas.cuotas"
                                    :color="temas.forms_titulo_bg"
                                    label="Cuotas Anuales"
                                    @click="calculoCuotas()"
                                    @change="calculoCuotas()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="6" sm="6" md="6" class="pt-0">
                                  <v-text-field
                                    :disabled="editadoGas.cuota>0 || editadoGas.cuotas>0"
                                    v-model="editadoGas.observ"
                                    :color="temas.forms_titulo_bg"
                                    label="Observaciones"
                                    counter maxlength="18"
                                    @chage="estaElGastoOk()">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="5" sx="5" mx="5" class="pt-0">
                                  <v-text-field
                                    v-model="editadoGas.cpr"
                                    :color="temas.forms_titulo_bg"
                                    label="Comprobante"
                                    counter
                                    maxlength="19">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-form>

                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="search"
                      clearable
                      append-icon="search"
                      label="Buscar"
                      :color="temas.forms_titulo_bg"
                      class="pt-0"
                      single-line hide-details>
                    </v-text-field>
                  </v-col>

                </template>
                <template v-slot:item.vencimiento="{ item }">
                  <span class="fg">{{ formatoFechaCorta(item.vencimiento) }}</span>
                </template>
                <template v-slot:item.proximovencimiento="{ item }">
                  <span class="fg">{{ formatoFechaCorta(item.proximovencimiento) }}</span>
                </template>
                <template v-slot:item.total="{ item }">
                  <span class="fg">{{ formatoImporte(item.total) }}</span>
                </template>
                <template v-slot:item.fiscal="{ item }">
                  <v-chip
                    :color="getColor(item.fiscal)" dark>{{item.fiscal?'Sí':'No'}}
                  </v-chip>
                </template>
                <template v-slot:item.accion="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="editarGas(item)" v-on="on">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="preguntoBorrarGasto(item)" v-on="on">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Borrar</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="gastoAgregarPeriodo(item)" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Agregar Cuota/Igual Gasto</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="preguntoProcesarGasto(item)" v-on="on">
                        <v-icon>
                          mdi-playlist-check
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Generar Comprobante</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-dialog>
            <!-- FIN DE GASTOS -->

            <!--// ADMINISTRACION DE FALTANTES DE PEDIDOS // -->
            <v-dialog v-model="dialogFaltantes" max-width="1260px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-data-table
                :headers="headersFaltantes"
                :items="faltantes"
                :search="search"
                dense
                class="elevation-3"
                :footer-props="footProps(10)">
                <template v-slot:item.seleccionado="{ item }">
                  <v-chip label
                    :color="getColor(item.seleccionado)"
                    dark>{{item.seleccionado?'Sí':'No'}}
                  </v-chip>
                </template>
                <template v-slot:top>
                  <v-toolbar flat
                    :color="temas.forms_titulo_bg"
                    :dark="temas.forms_titulo_dark==true">
                    <v-btn icon @click="dialogFaltantes=false"
                      :color="temas.forms_close_bg"
                      :dark="temas.forms_close_dark==true">
                      <v-icon>mdi-arrow-left-circle</v-icon>
                    </v-btn>
                    <template v-slot:extension>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            fab class="mr-2"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            @click="generarCompra(item)" v-on="on">
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                          </v-btn>
                        </template>
                        <span>Generar Compra</span>
                      </v-tooltip>
                    </template>

                    <v-toolbar-title class="body-1 white--text">
                      Artículos pedidos y que no fueron vendidos por falta de stock
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>

                  </v-toolbar>
                </template>
                <template v-slot:item.fecha="{ item }">
                  <span class="fg">{{ formatoFechaCorta(item.fecha) }}</span>
                </template>
                <template v-slot:item.faltante="{ item }">
                  <span class="fg">{{ formatoImporte(item.faltante) }}</span>
                </template>
                <template v-slot:item.accion="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="preguntoBorrarFaltante(item)" v-on="on">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Borrar</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="seleccionarFaltante(item)" v-on="on">
                        <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Seleccionar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-dialog>
            <!-- FIN DE FALTANTES PEDIDOS -->

            <!-- ERROR EN EL PEDIDO -->
            <v-dialog v-model="dialogError" max-width="1200px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card class="fg">
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
                    ¡HAY PROBLEMAS CON ESTE PEDIDO!
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
                    El proveedor puede haber precios o varios clientes pueden
                    estar comprando al mismo tiempo disminuyendo asi el stock disponible.<br>
                    En la columna <b>Error</b> se detalla el tipo de problema. Seleccione
                    <b>Arreglar Pedido</b> para que el sistema realice las modificaciones
                    necesarias por Ud.<br>
                    IMPORTANTE: Seran eliminadas las promociones que esten pausadas, o sin
                    unidades disponibles.
                    <br>
                    Otra opcion es que edites el pedido y realices las modificaciones en los
                    artículos indicados.
                    <br>
                    <br>
                    Detalles de los errores
                  </v-card>
                  <v-data-table
                    :headers="headersSelArtPedErr"
                    :items="selArtPedErr"
                    dense
                    class="elevation-3 pl-0"
                    :footer-props="footProps(10)">
                    <template #item.nombre="{ value }">
                      <div class="text-truncate" style="max-width: 245px">
                        {{ value }}
                      </div>
                    </template>
                    <template v-slot:item.preped="{ item }">
                      <span class="fg">${{ formatoImporteDec(item.preped,4) }}</span>
                    </template>
                    <template v-slot:item.preact="{ item }">
                      <span class="fg">${{ formatoImporteDec(item.preact,4) }}</span>
                    </template>
                    <template v-slot:item.unped="{ item }">
                      <span class="fg">{{ formatoImporte(item.unped) }}</span>
                    </template>
                  </v-data-table>
                </div>
              </v-card>
            </v-dialog>
            <!-- FIN DEL ERROR EN EL PEDIDO -->

            <!--// RECEPCION DE PEDIDOS // -->
            <v-dialog v-model="dialogRecepcion" max-width="640px" persistent
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialogRecepcion=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    Recepción del pedido
                    {{ itemActual != null ? itemActual.cpr : ''}}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text" @click="confirmarRecepcionHTTP">
                    Confirmar Recepción
                  </v-btn>
                </v-toolbar>

                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="2" sm="4" md="2"></v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            type="date" outlined disabled
                            v-model="recepcion.fechaenvio"
                            :color="temas.forms_titulo_bg"
                            label="Fecha de envío">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            autofocus
                            type="date" outlined
                            v-model="recepcion.fechallegada"
                            :color="temas.forms_titulo_bg"
                            label="Fecha de llegada">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2"></v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-select
                            label='¿Como califica al pedido?' outlined
                            :color="temas.forms_titulo_bg"
                            v-model="recepcion.respuesta"
                            :items="recepcionRespuestas"
                            @change="setRespuestaRecepcion">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row v-show="recepcion.respuesta=='Informar otro problema'">
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            v-model="recepcion.observaciones"
                            :color="temas.forms_titulo_bg"
                            label="Observaciones"
                            auto-grow
                            counter
                            clearable
                            outlined
                            rows="3"
                            row-height="25">
                          </v-textarea>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sm="6" md="6">
                          <span>Como califica la operación?</span>
                          <v-rating
                            v-model="recepcion.calificacion"
                            :color="temas.barra_principal_bg"
                            background-color="white"
                            empty-icon="$ratingFull"
                            half-increments
                            hover
                            label="Como califica la operacion?">
                          </v-rating>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE RECEPCION DE PEDIDOS -->

            <!-- DIALOG SELECCION DE PROVEEDOR -->
            <v-dialog v-model="dialogProveedores" max-width="750px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogProveedores=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - SELECCION DE PROVEEDORES / SERVICIOS
                </span>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                       <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <v-data-table
                              :headers="headersProveedores"
                              :items="itemsProveedores"
                              dense
                              class="pl-1 pr-3 elevation-1 pt-2"
                              :footer-props="footProps(10)"
                              @click:row="seleccionDelProveedor">
                            </v-data-table>
                          </v-form>
                        </v-col>
                      </v-row>
                     </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG SELECCION DEL PROVEEDOR -->

          </v-toolbar>

          <!-- BARRA DE BUSQUEDA -->
          <v-row class="pl-3 pb-2 pt-2">
            <v-col cols="3" sm="3">
              <v-text-field
                v-model="search"
                clearable
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
                  class="pt-1 pl-0 pr-0"
                  overlap
                  :content="fe.ctt"
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true" rigth>
                  <v-chip
                    dense :value="fe" label
                    :color=
                    "fe.tip==filtroEstadoSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                    :dark=
                    "fe.tip==filtroEstadoSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
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
        <template v-slot:expanded-item="{ headers, item }">
          <!--
          <th v-for="header in props.headers" :key="header.text"
            :class="{ 'white--text': $vuetify.theme.dark }">
            {{ header.text }}
          </th>
          <th v-for="header in props.headers" :key="header.text"
            :class="header.headerClass">
            {{ header.text }}
          </th>
          -->

          <td
            :colspan="headers.length">
            <v-data-table v-if="filtroComprobanteSel!='Pagos'"
              :headers="headersItems"
              :items="item.items"
              dense
              :footer-props="footProps(200)">
              <template v-slot:item.articulo.codigo="{ item }">
                <span class="fg">{{ item.articulo.codigo }}</span>
                <v-badge
                  inline
                  :content="item.articulo.iva.nombre"
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true" left>
                </v-badge>
              </template>
              <template v-slot:item.articulo.id="{ item }">
                <span class="fg">{{ item.articulo.id }}</span>
                <v-badge
                  inline
                  :content="item.articulo.iva.nombre"
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true" left>
                </v-badge>
              </template>
              <template v-slot:item.articulo.nombre="{ item }">
                <span class="fg"> {{
                  item.articulo.codigo=='1@1' ? item.texto : item.articulo.nombre
                }}</span>
              </template>
              <template v-slot:item.cantidad="{ item }">
                <span class="fg">{{ formatoImporte(item.cantidad) }}</span>
              </template>
              <template v-slot:item.precio="{ item }">
                <v-badge v-if="item.texto=='Promocion'"
                  class="pt-2"
                  :content="'ofe'"
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true" left>
                </v-badge>
                <span class="fg">${{ kit.redondear(item.precio,4) }}</span>
              </template>
              <template v-slot:item.tasadescuento="{ item }">
                <span class="fg">{{ formatoImporte(item.tasadescuento) }}</span>
              </template>
              <template v-slot:item.importedescuento="{ item }">
                <span class="fg">${{ formatoImporte(item.importedescuento) }}</span>
              </template>
              <template v-slot:item.total="{ item }">
                <span class="fg">${{ kit.redondear(item.total,4) }}</span>
              </template>
            </v-data-table>
          </td>
        </template>

        <template v-slot:item.tercero.nombre="{ item }">
          <span class="fg">{{ item.tercero.nombre.substring(0,30)}}</span>
          <v-badge v-if="item.tercero.user!=null"
            class="pt-1 pl-2"
            :content="item.tercero.user.externo ? 'x' : 'g'"
            :color="item.tercero.user.externo ? 'black' : temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>

        <template v-slot:item.observaciones="{ item }">
          <span class="fg">
            {{item.quienpidio=='C' ? 'Nosotros' : 'El Vendedor' }}
          </span>
        </template>
        <template v-slot:item.cpr="{ item }">
          <span class="fg">{{ kit.cpr(item.cpr) }}</span>
        </template>
        <template v-slot:item.perfiscal="{ item }">
          <span class="fg">{{ item.perfiscal }}</span>
        </template>
        <template v-slot:item.fecha="{ item }">
          <span class="fg">{{ formatoFechaCorta(item.fecha) }}</span>
        </template>

        <template v-slot:item.ctacte="{ item }">
          <v-chip
            :color="item.ctacte?temas.forms_titulo_bg:temas.barra_lateral_bg"
            :dark="temas.forms_titulo_dark==true">
            {{item.ctacte?'Sí':'No'}}
          </v-chip>
        </template>

        <template v-slot:item.total="{ item }">
          <v-chip outlined label :color="getColorTotal(item)">
            <b class="fg">$ {{ formatoImporte(item.total) }}</b>
          </v-chip>
          <v-badge v-if="importada(item)"
            class="pt-2"
            :content="'i'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
        </template>

        <template v-slot:item.estado="{ item }">
          <v-rating v-if="item.rating>=1 && item.rating<=5"
            dense
            v-model="item.rating"
            :color="temas.barra_principal_bg"
            background-color="white"
            empty-icon="$ratingFull"
            x-small readonly>
          </v-rating>
          <v-chip v-else
            label class="fg85"
            @mouseover="sayMessage(item, true)"
            @mouseleave="sayMessage(item, false)"
            :color="getEstado(item.estado,'c',item.carga, item)"
            :dark="getEstado(item.estado,'k',item.carga, item)">
            <b>{{ getEstado(item.estado,'e',item.carga, item) }}</b>
          </v-chip>
        </template>

        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon v-bind="attrs" v-on="on"
                @click="setAcciones(item)">
                <v-icon>
                  mdi-18px mdi-dots-vertical
                </v-icon>
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
      <confirmacion v-model='msg.msgAccion'
        :title=this.msg.msgTitle
        :body=this.msg.msgBody
        :visible=this.msg.msgVisible
        :buttons=this.msg.msgButtons
        @click="msgRespuesta">
      </confirmacion>
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
import confirmacion from "./Forms/confirmacion.vue";
import impresiones from "./Forms/impresiones.vue";
import XLSX from 'xlsx';
import jsPDF from 'jspdf';

export default {
  components: {
    SBar,
    confirmacion,
    impresiones,
  },

  data: () => ({
    encontroElProveedor: false,
    idReciboAAnular: null,
    reciboAAnularEstado: null,
    hayRecibo: '',
    vuelto: false,
    echeq: false,
    borrarItemClick: false,
    proveedorVinculado: 0,
    compraOk: false,
    gastoOk: false,
    progress: false,
    cprActual: null,  // para cuando esta modificando y no detecte que ya existe
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    singleExpand: false,
    cambioElPrecio: 0,
    basadoEnCpr: false,      // si el comprobante actual esta basado en otro comprobante. ( fac/ped, rem/fac, etc)
    notificaEnBaseAOtro: [], // arreglo para realizar la notificacion de comprobantes.
    notificaOriginal: [],    // cuando es notificaEnBaseAOtro, debo marcar el comprobante padre.
    basadoEnOtroCpr: [],     // arreglo para grabar la en que comprobante esta basado el actual
    fecha: moment().format('YYYY-MM-DD'),
    vencimiento: moment().format('YYYY-MM-DD'),
    cfUser: '',
    coef: 1,  // para signar los comprobantes + o -
    esFiscal: true,
    esCIN: false,
    ctacte: false,
    formTitle: '',
    formTitleArt: '',
    formTitleMed: '',
    formTitleGas: '',
    itemActual: null,
    itemActualItem: null,
    itemActualPend: null,
    itemActualGasto: null,
    foto: [],
    excel: [],
    xlsCargado: false,
    compraExcel: {cuit:null,fecha:null,perfiscal:null,tipcpr:null,succpr:null,nrocpr:null,moneda:null,totalitems:null,
      tasades: null,impdes:null,retiva:null,retgan:null,retib:null,impint:null,nogravado:null,flete:null,gravado:null,exento:null,iva:null,total:null,
      items:[{
        codigo:null,micodigo:null,nombre:null,precio:0,tasdes:0,impdes:0,subtot:0,cantidad:0,total:0,tasaIVA:0
      }]
    },
    cuitRules: [
      v => !!v || 'El cuit es requerido',
      v => (v && v.length <= 11) || 'Debe ingresar 11 números sin los guiones',
    ],
    codigos: [],
    elMedioEstaOk: false,
    comprobantes: [
      { nombre: 'Facturas', total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 29 },
      { nombre: 'Débitos',  total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 30 },
      { nombre: 'Créditos', total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 31 },
      { nombre: 'Presup.',  total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 32 },
      { nombre: 'Remitos',  total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 33 },
      { nombre: 'Pedidos',  total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 34 },
      { nombre: 'Gastos',   total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 35 },
      { nombre: 'Pagos',    total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 36 },
    ],
    recepcion: {
      respuesta: '¡El pedido está correcto!',
      fechaenvio: '',
      fechallegada: '',
      observaciones: '¡El pedido está correcto!',
      calificacion: 5,
    },
    recepcionRespuestas: [
      '¡El pedido está correcto!',
      '¡Pedido correcto pero con demora!',
      '¡Productos rotos o mal embalados!',
      '¡No son los productos que compre!',
      'Informar otro problema'
    ],

    // filtro
    filtro: '',
    filtroComprobante: [1,6,14,51,128],
    filtroComprobanteSel: 'Facturas',
    filtroTercero_id: null,

    //pago
    condicionDePago: '',
    condicionDePagoOriginal: '',
    pagoDeUnSoloComprobante: false,
    medioDePagoId: 1,
    medioDePagoNombre: '',
    totAPagar: 0,
    totValores: 0,
    valDiferencia: 0,
    totCheTerSel: 0,
    medpagwidth: 0,
    cttChePropEnPago: 0,
    idNotificacionAnulacionPago: null,  // para saber cuando anula un pago si el usuario esta vinculado y aun no lo descargo
    idNotificacionTipo: '',             // para informar: si es 'R', es porque el pago ha sido rechazado
    chePropEnPagoMantener: false,
    pagoVinculado: false,
    medpag: [
      {id:1, nombre: 'Efectivo',         activo: true,  tipo:'CAJ', total: 0, idmdp: 1},
      {id:2, nombre: 'Tj.Crédito',       activo: true,  tipo:'TDC', total: 0, idmdp: 2},
      {id:3, nombre: 'Tj.Débito',        activo: true,  tipo:'TDD', total: 0, idmdp: 3},
      {id:4, nombre: 'Cuenta Corriente', activo: false, tipo:'CTE', total: 0, idmdp: 4},
      {id:5, nombre: 'Transferencia',    activo: true,  tipo:'TRA', total: 0, idmdp: 5},
      {id:6, nombre: 'Ch.3ro',           activo: true,  tipo:'CHE', total: 0, idmdp: 6},
      {id:7, nombre: 'Ch.Propio',        activo: true,  tipo:'CHE', total: 0, idmdp: 6},
      {id:8, nombre: 'Mcado.Pago',       activo: true,  tipo:'MEP', total: 0, idmdp: 7},
      {id:9, nombre: 'Todo Pago',        activo: true,  tipo:'TPA', total: 0, idmdp: 8},
      {id:10, nombre: 'Canje',           activo: false, tipo:'CJE', total: 0, idmdp: 9},
    ],
    footerProps: {
      itemsPerPageOptions: [0],
      showFirstLastPage:true,
      showCurrentPage:true,
      pageText:'Páginas',
      nextIcon:'mdi-arrow-right-drop-circle-outline',
      prevIcon:'mdi-arrow-left-drop-circle-outline',
    },
    cpr: '',
    tl: "text-lowercase",
    cprItems: [],
    depItems: [],
    monItems: [],
    ivaItems: [],
    ivaTasas: [],
    dirItems: [],
    expanded: [],
    periodosAbiertos: [],
    cueItems: [],
    cueNewItems: [],
    cueProvItems: [],
    condicionesDePago: [],
    facturasDescuentosOriginales: [],
    chraItems: [],
    cheItems: [],
    tarItems: [],
    lisValue: [],
    dirValue: [],
    medValue: [],
    lisObj: [],
    items: [],
    itemsAll: [],
    tasasIVA: [],
    articulos: [],
    valores: [],
    cartera: [],
    pendientes: [],
    pend: [],
    gastos: [],
    selectedCondDePago: [],
    selectedCheque:[],
    acciones: [],
    faltantes: [],
    timeLine: [],
    selArtPedErr: [],
    accionesItems: [],
    itemsProveedores: [],
    //descuentosEnPagos: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    imp: {
      tipcpr: '',
      items: [],
    },
    max25chars: v => v.length <= 25 || 'Input too long!',
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    busArt: '',
    search: '',
    searchTerceros: '',
    searchTercerosGas: '',
  //searchTercerosPag: '',
    searchBancos: '',
    dialogCab: false,
    dialogArt: false,
    dialogPag: false,
    dialogMed: false,
    dialogGas: false,
    dialogPend: false,
    dialogError: false,
    dialogEditArt: false,
    dialogTasaArt: false,
    dialogGasEdit: false,
    dialogCheDisp: false,
    dialogTimeLine: false,
    dialogPagAnula: false,
    dialogFaltantes: false,
    dialogRecepcion: false,
    dialogProveedores: false,
    dialogImportarDesde: false,
    dialogCambiarPeriodoFiscal: false,
    importarDesdeFormato: '',
    gastoAgregaPeriodo: false, // Si agrega periodo a un gasto 
    totalCabecera: 0,
    totalArticulos: 0,
    diferencia: 0,
    editedIndex: -1,
    editedIndexArt: -1,
    editedIndexMed: -1,
    editedIndexGas: -1,
    afipSuc: '',
    afipNro: '',
    editado: {
      id: '', fecha: moment().format('YYYY-MM-DD'), perfiscal: '', cpr: '', tipo: '', tercero_id: '', nombre: '', comprobante_id: '',
      documento_id: '', medio_id: '', deposito_id: '', vendedor: {id: null, nombre: 'MOSTRADOR'}, moneda_id: 51, direccion_id: '',
      tasadescuento: 0, importedescuento: 0, retiva: 0, retgan: 0, retib: 0, impint: 0, nogravado: 0, flete: 0, gravado: 0, exento: 0,
      iva: 0, total: 0, poradcosto: 0, regstk: 0, vencimiento: moment().format('YYYY-MM-DD'), documento: '', documentoNumero: '',
      responsableAbrev: '', letra: '', activo: true, observaciones: '', quienpidio: '',
    },
    defaultItem: {
      id: '', fecha: moment().format('YYYY-MM-DD'), perfiscal: '', cpr: '', tipo: '', tercero_id: '', nombre: '', comprobante_id: '',
      documento_id: '', medio_id: '', deposito_id: '', vendedor: {id: null, nombre: 'MOSTRADOR'}, moneda_id: 51, direccion_id: '',
      tasadescuento: 0, importedescuento: 0, retiva: 0, retgan: 0, retib: 0, impint: 0, nogravado: 0, flete: 0, gravado: 0, exento: 0,
      iva: 0, total: 0, poradcosto: 0, regstk: 0, vencimiento: moment().format('YYYY-MM-DD'), documento: '', documentoNumero: '',
      responsableAbrev: '', letra: '', activo: true, observaciones: '', quienpidio: '',
    },
    editadoGas: {
      id: null, tercero_id: null, observ: null, cuota: 0, cuotas: 0, periodo: null, vencimiento: null, proximovencimiento: null,
      gravado: 0, afipiva_id: 5, iva: 0, total: 0, pagado: 0, fiscal: 0, comprobante_id: null, fijo: false, cpr: '',
    },
    defaultItemGas: {
      id: null, tercero_id: null, observ: null, cuota: 0, cuotas: 0, periodo: null, vencimiento: null, proximovencimiento: null,
      gravado: 0, afipiva_id: 5, iva: 0, total: 0, pagado: 0, fiscal: 0, comprobante_id: null, fijo: false, cpr: ''
    },
    editadoArt: {
      id: '', articulo_id: '', codigo: '', codbar: '', nombre: '', deposito_id: '', unidad_id: '', unidadNombre: '', moneda_id: '',
      monedaNombre: '', iva_id: '', ivaNombre: '', cantidad: 1, stock: 1, undstock: 1, costo: 0, costoanterior: 0, precio: 0,
      preciooriginal: 0, tasadescuento: 0, importedescuento: 0, decimales: 0, total: 0, texto: '', vencimiento: '', ofeprecio: 0,
      ofetasdes: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '', desc1: 0, desc2: 0,
    },
    defaultItemArt: {
      id: '', articulo_id: '', codigo: '', codbar: '', nombre: '', deposito_id: '', unidad_id: '', unidadNombre: '', moneda_id: '',
      monedaNombre: '', iva_id: '', ivaNombre: '', cantidad: 1, stock: 1, undstock: 1, costo: 0, costoanterior: 0, precio: 0,
      preciooriginal: 0, tasadescuento: 0, importedescuento: 0, decimales: 0, total: 0, texto: '', vencimiento: '', ofeprecio: 0,
      ofetasdes: 0, ofeenvio: 0, ofeunidades: 0, ofeestado: '', desc1: 0, desc2: 0,
    },
    editadoPend: {
      acancelar: '',
    },
    editadoMed: {
      id: null, cuit: null, caja_id: null, medio_id: null, cuentaorigen_id: null, cuentadestino_id: null, cuentacheque_id: null,
      cuentatarjeta_id: null, banco_id: null, tarjeta_id: null, cpringreso_id: null, cpregreso_id: null, chequera_id: null, cheque_id: null,
      fechafinanciera: null, fechasalida: null, importe: null, nrovalor: null, tipo: null, observ: null, foto: null, importe: 0,
    },
    defaultItemMed: {
      id: null, cuit: null, caja_id: null, medio_id: null, cuentaorigen_id: null, cuentadestino_id: null, cuentacheque_id: null,
      cuentatarjeta_id: null, banco_id: null, tarjeta_id: null, cpringreso_id: null, cpregreso_id: null, chequera_id: null, cheque_id: null,
      fechafinanciera: null, fechasalida: null, importe: null, nrovalor: null, tipo: null, observ: null, foto: null, importe: 0,
    },
    seleccionarArticulo: false,
    descriptionLimit: 80,
    selArt: [],
    entriesTerceros: [],
    entriesTercerosPag: [],
    entriesArticulos: [],
    entriesMedios: [],
    entriesBancos: [],
    tercerosUserId: [],
    isLoadingTerceros: false,
    isLoadingArticulos: false,
    isLoadingMedios: false,
    isLoadingBancos: false,
    totalItems: 0,
    itemsCargadosGravado: 0,
    itemsCargadosIVA: 0,
    gravadoDiff: 0,
    ivaDiff: 0,
    editarItems: false,
    maxDiasChq: -1,
    laFechaDelChequeEstaOk: false,

    filtrosEstados: [],
    filtroEstadoSel: 'Todos',

    precioOrigen: 'Lista',  // Lista O Promocion, por defecto Lista = precios.precio
    promoDescuento: 0,      // Descuento por Promo ( si hay )
    precioDescuento: 0,     // Descuento de Promocion o de Item ( ingresado en Comrpas )
    yaMonto: false,

    // definimos los headers de la datatables
    headers: [],
    headersNor: [
      //{ text: 'ID', value:'id', align: 'left', width: 70},
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 175},
      { text: 'FECHA', value:'fecha', align: 'left', width: 92},
      { text: 'PFiscal', value:'perfiscal', align: 'left', width: 92},
      { text: 'PROVEEDOR', value:'tercero.nombre', align: 'left', width: 380},
      { text: 'CTACTE', value:'ctacte', align: 'end', width: 110 },
      { text: 'TOTAL', value:'total', align: 'end', width: 150},
      { text: 'ESTADO', value:'estado', align: 'left', width: 120},
      { text: 'OP', value: 'accion', sortable: false },
    ],
    headersPed: [
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 180},
      { text: 'FECHA', value:'fecha', align: 'left', width: 92},
      { text: 'PROVEEDOR', value:'tercero.nombre', align: 'left', width: 300},
      { text: 'TOTAL', value:'total', align: 'end', width: 150},
      { text: 'PEDIDO POR', value:'observaciones', align: 'left', width: 150},
      { text: 'ESTADO', value:'estado', align: 'left', width: 130},
      { text: 'OP', value: 'accion', sortable: false },
    ],
    headersItems: [
      { text: 'Código', value:'articulo.codigo'},
      { text: 'Descripción', value:'articulo.nombre'},
      { text: 'Ctt', value:'cantidad', align: 'end'},
      { text: 'Precio', value:'precio', align: 'end', width: 120},
      { text: '%Des', value:'tasadescuento', align: 'end'},
      { text: 'Des', value:'importedescuento', align: 'end'},
      { text: 'Total', value:'total', align: 'end', width: 120},
    ],
    headersGas: [
      { text: 'Empresa',    value: 'tercero.nombre',     align: 'left', width: 300},
      { text: 'Período',    value: 'periodo',            align: 'left', width: 105},
      { text: 'Observ',     value: 'observ',             align: 'left', width: 170},
      { text: 'Vencim,',    value: 'vencimiento',        align: 'left', width: 130},
      { text: 'Prox.Venc.', value: 'proximovencimiento', align: 'left', width: 130},
      { text: 'TOTAL',      value: 'total',              align: 'end',  width: 130},
      { text: 'FISCAL',     value: 'fiscal',             align: 'left', width: 100},
      { text: 'OP',    value: 'accion', sortable: false },
    ],
    headersFaltantes: [
      { text: 'COMPROBANTE',      value: 'cpr',                align: 'left', width: 180},
      { text: 'FECHA',            value: 'fecha',              align: 'left', width: 96},
      { text: 'CLIENTE',          value: 'cliente',            align: 'left', width: 230},
      { text: 'ARTICULO',         value: 'articulo',           align: 'left', width: 420},
      { text: 'FALTARON VENDER',  value: 'faltante',           align: 'end',  width: 130},
      { text: 'Sel',              value: 'seleccionado',       align: 'end',  width: 30},
      { text: 'OP',               value: 'accion', sortable: false },
    ],
    headersTasasDeIVA: [
      { text: 'TASA', value:'tasa', align: 'left', width: 90},
      { text: 'BASE', value:'base', align: 'right', width: 60},
      { text: 'IVA', value:'iva', align: 'right', width: 60},
    ],
    headersArt: [
      { text: 'Código',      value:'codigo', align: 'left', width: 150},
      { text: 'Descripción', value:'nombre', align: 'left', width: 390},
      { text: 'Ctt',         value:'cantidad', align: 'end', width: 110},
      { text: 'Precio',      value:'precio', align: 'end', width: 120},
      { text: '%Desc.',      value:'tasadescuento', align: 'end', width: 110},
      { text: 'Descuento',   value:'importedescuento', align: 'end', width: 120},
      { text: 'TOTAL',       value:'total', align: 'end', width: 150},
      { text: 'OP',          value: 'accion', sortable: false, width: 115 },
    ],
    headersArtExcel: [
      { text: 'Cód.Prov',    value:'codigo', align: 'left', width: 110},
      { text: 'Mi Cód.',     value:'micodigo', align: 'left', width: 110},
      { text: 'Descripción', value:'nombre', align: 'left', width: 300},
      { text: 'Ctt',         value:'cantidad', align: 'end', width: 100},
      { text: '%Desc.',      value:'tasdes', align: 'end', width: 90},
      { text: 'Descuento',   value:'impdes', align: 'end', width: 120},
      { text: 'Precio',      value:'precio', align: 'end', width: 120},
      { text: 'TOTAL',       value:'total', align: 'end', width: 150},
      { text: 'OP',          value:'accion', sortable: false },
    ],
    headersCartera: [
      { text: 'Sel',        value: 'accion',           sortable: false },
      { text: 'Banco',      value: 'nomban',           align: 'left', width: 240},
      { text: 'CUIT',       value: 'cuitlib',          align: 'left', width: 90},
      { text: 'Librador',   value: 'nomlib',           align: 'left', width: 240},
      { text: 'NroValor',   value: 'nrovalor',         align: 'end',  width: 120},
      { text: 'Fec.Fin.',   value: 'fechafinanciera',  align: 'left', width: 98},
      { text: 'Días',       value: 'dias',             align: 'end',  width: 90},
      { text: 'Importe',    value: 'importe',          align: 'end',  width: 150},
    ],
    headersMed: [
      { text: 'VUELTO', value:'vuelto', align: 'left', width: 100},
      { text: 'MEDIO', value:'medioNombre', align: 'left', width: 170},
      { text: 'OBSERVACIONES', value:'observ', align: 'left', width: 640},
      { text: 'TOTAL', value:'importe', align: 'end',  width: 120},
      { text: 'OP', value: 'accion', sortable: false },
    ],
    headersSelArt: [
      { text: 'ID', value:'id'},
      { text: 'CODIGO', value:'codigo'},
      { text: 'NOMBRE', value:'nombre'},
      { text: 'STOCK', value:'stock'},
      { text: 'PRECIO', value:'costo', align: 'end', width: 100},
    ],
    headersPend: [
      { text: 'CPR',         value:'cpr'}, 
      { text: 'VENCIMIENTO', value:'vencimiento'},
//    { text: 'IMPORTE',     value:'importe', align: 'end'},
      { text: 'PENDIENTE',   value:'pendiente', align: 'end'},
      { text: 'DESCUENTO X NDC',   value:'descuentos', align: 'end'},
//    { text: 'A PAGAR',     value:'acancelar', align: 'end'},
//    { text: 'OP',    value: 'accion', sortable: false },
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
    headersProveedores: [
      { text: 'Id', value:'id', align: 'left', width: 90},
      { text: 'Nombre', value:'nombre', align: 'left', width: 250},
      { text: 'CUIT', value:'cuit', align: 'left', width: 110},
    ],
    headersCondDePagos: [
      { text: 'Detalles', value:'nombre', align: 'left', width:260},
      { text: 'A Pagar', value:'apagar', align: 'end', width: 120},
    ],

  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    //...mapMutations(['alert','closeAlert']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalDemo',
      'sucursalFiscal',
      'exclusivoDe',
      'proveedor',
      'proveedores',
      'tipo',
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
      'tercero',
      'responsable',
      'cuit',
      'operario',
      'operarioEsVendedor',
      'operarioTerceroId',
      'operarioUserId',
      'level',
      'roles',
      'externo',
      'dolar',
      'codigooid',
      'descuentos',
      'transition',
      'dark',
    ]),

    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    itemsMedios () {
      return this.entriesMedios.map(entry => {
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

    importeTotalDelPago() {
      if (this.tipo=='PP') {
        return '$'+this.formatoImporte(this.editado.total)
      } else {
        return '$'+this.formatoImporte(this.editadoMed.importe)
      }
    },

    totCheTerSelecc() {
      return '$'+this.formatoImporte(this.totCheTerSel)
    },

    totCheTerDiff() {
      if (this.tipo=='PP') {
        return '$'+this.formatoImporte(this.editado.total-this.totCheTerSel)
      } else {
        return '$'+this.formatoImporte(this.editadoMed.importe-this.totCheTerSel)
      }
    },

    editadoTotal() {
      return '$'+this.formatoImporte(this.editado.total)
    },

    editadoGravado() {
      return '$'+this.formatoImporte(this.editado.gravado)
    },

    editadoIva() {
      return '$'+this.formatoImporte(this.editado.iva)
    },

    itemsCargadosGravadoComputer() {
      return '$'+this.formatoImporte(this.itemsCargadosGravado)
    },

    itemsCargadosIVAComputer() {
      return '$'+this.formatoImporte(this.itemsCargadosIVA)
    },

    gravadoDiffComputer() {
      return '$'+this.formatoImporte(this.gravadoDiff)
    },

    ivaDiffComputer() {
      return '$'+this.formatoImporte(this.ivaDiff)
    },

    balanceDelPago() {
      if (this.valores==undefined) return
      let totPen = 0
      let totVal = 0
      for (let i=0; i<=this.pend.length-1; i++) {
        totPen += Number(this.pend[i].pendiente)
      }
      for (let i=0; i<=this.valores.length-1; i++) {
        totVal += Number(this.valores[i].importe)
      }
      if (totVal==0) {
        return '¡Debes ingresar Valores!'
      } else if (this.valDiferencia==0) {
        return 'OK'
      } else if (this.valDiferencia<0) {
         return '¡Estás pagando de más!'
      } else if (this.valDiferencia>0) {
        return '¡Estás pagando de menos!'
      }
    },

    promosComputer() {
      let res = ''
      if (this.editadoArt.ofeprecio!=0) {
        res = 'Promo '+this.editadoArt.ofeunidades+'un/'+this.editadoArt.ofetasdes+'% off '
      }
      return res
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
    }
  },

  watch: {
    '$store.state.sucursal' () {
      debugger
      for (let i=0; i<=7; i++) {
        this.comprobantes[0].activo = true
        this.comprobantes[i].bg = this.$store.state.temas.cen_panelcpr_bg
        this.comprobantes[i].dark = this.$store.state.temas.cen_panelcpr_dark
      }
      this.comprobantes[0].activo = !this.sucursalDemo
      this.comprobantes[1].activo = !this.sucursalDemo
      this.comprobantes[2].activo = !this.sucursalDemo
      this.comprobantes[3].activo = this.sucursalDemo
      if (this.sucursalDemo) {
        if (this.centrales.compras_panel == 'Facturas' || this.centrales.compras_panel == 'Créditos' || this.centrales.compras_panel == 'Débitos') {
          this.selectTipoDeComprobante('Presup.')
        }
      } else {
        this.selectTipoDeComprobante('Facturas')
      }
    },

    searchTerceros (val) {
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      this.proveedorVinculado = 0
      let tipoProv = 0

      val = this.exclusivoDe.id!=null?this.exclusivoDe.tercero_id:val

      debugger
      if (this.centrales.compras_panel=='Gastos') {
        tipoProv = 7    // PROVEEDOR GASTOS/IMPUESTOS
      } else {
        if (this.editado.cpr=='NDD'||this.editado.cpr=='NDC') {
          tipoProv = 'PAG'
        } else {
          tipoProv = 2    // PROVEEDOR MERCADERIAS
        }
      }
      
      return HTTP().get('/indexter/false/'+tipoProv+'/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/'+val)
        .then(({ data }) => {

        this.entriesTerceros = []
        this.tercerosUserId = []

        let p = 0
        let us = 0
        let vi = false
        let ok = false
        let licPP = false
        for (let i=0; i<= data.length-1; i++) {

          //SI ES UN PEDIDO   TIENE QUE SER UN PROVEEDOR VINCULADO
          //SI ES FAC/NDD/NDC TIENE QUE SER DE UN PROVEEDOR NO VINCULADO O VINCULADO PERO CON TIPO = 'PP'
          //ELSE LO CARGA

          ok = true
          us = data[i].tercero.user?data[i].tercero.user.id:0
          vi = this.vinculosPadres.findIndex(x=>x==us)!=-1?true:false
          p = this.vinculosPadresLic.findIndex(x=>x.user_id==us)
          if (p!=-1) {
            licPP = this.vinculosPadresLic[p].tipo=='PP'?true:false
          }
          if ((this.editado.cpr=='PED'&&!vi)||
             ((this.editado.cpr=='FAC'||this.editado.cpr=='NDD'||this.editado.cpr=='NDC')&&vi&&!licPP)) {
            ok = false
          }
          if (ok) {
            this.entriesTerceros.push(data[i].tercero)
            this.tercerosUserId.push(data[i].tercero_id)
          }

        }
        
        if (val !== null && val !== '') {

          if (this.exclusivoDe.id!=null) {
            this.editado.tercero_id = val
            this.entriesTerceros.findIndex(x=>x.id==val)
          }

          let ipos = this.entriesTerceros.findIndex( x => x.id == this.editado.tercero_id)
          let valor = this.tercerosUserId[ipos]

          return HTTP().get('/tercero/'+valor+'/'+tipoProv+'/false/'+this.sucursal).then(({ data }) => {

            this.itemActual = data.t
            this.lisObj = [];
            let rid = data.t[0].tercero.responsable.id
            if (this.cfUser===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO
              if (rid===1 || rid===2 || rid===9 || rid===11) {
                this.editado.letra = 'A'
                if (this.editado.cpr=='FAC') {
                  this.editado.comprobante_id = 1
                } else if (this.editado.cpr=='NDD') {
                  this.editado.comprobante_id = 2
                } else if (this.editado.cpr=='NDC') {
                  this.editado.comprobante_id = 3
                } else if (this.editado.cpr=='REC') {
                  this.editado.comprobante_id = 4 }
              } else {
                this.editado.letra = 'B'
                if (this.editado.cpr=='FAC') {
                  this.editado.comprobante_id = 6
                } else if (this.editado.cpr=='NDD') {
                  this.editado.comprobante_id = 7
                } else if (this.editado.cpr=='NDC') {
                  this.editado.comprobante_id = 8
                } else if (this.editado.cpr=='REC') {
                  this.editado.comprobante_id = 9
                }
              }
            } else if (this.cfUser===6) { //EL USUARIO ES MONOTRIBUTISTA
              this.editado.letra = 'C'
              if (this.editado.cpr=='FAC') {
                this.editado.comprobante_id = 11
              } else if (this.editado.cpr=='NDD') {
                this.editado.comprobante_id = 12
              } else if (this.editado.cpr=='NDC') {
                this.editado.comprobante_id = 13
              } else if (this.editado.cpr=='REC') {
                this.editado.comprobante_id = 15
              }
            }
            if (this.editado.cpr=='REM') {
              this.editado.letra = 'R'
              this.editado.comprobante_id = 125
            } else if (this.editado.cpr=='PED') {
              this.editado.letra = 'P'
              this.editado.comprobante_id = 126
            } else if (this.editado.cpr=='PAG') {
              this.editado.letra = 'P'
              this.editado.comprobante_id = 127
            }

            this.editado.nombre           = data.t[0].tercero.nombre;
            this.editado.documento        = data.t[0].tercero.documento.nombre;
            this.editado.documento_id     = data.t[0].tercero.documento.id;
            this.editado.documentoNumero  = data.t[0].tercero.cuit;
            this.editado.responsableAbrev = data.t[0].tercero.responsable.abrev;
            this.dirItems = []
            for (let i=0; i<= data.t[0].tercero.direcciones.length-1; i++) {
              this.dirItems.push(data.t[0].tercero.direcciones[i])
            }
            this.editado.direccion_id = this.dirItems[0].id
            this.ctacte = false
            if (this.editado.cpr=='FAC') {
              this.ctacte = true
            } else {
              this.ctacte = data.t[0].ctacte
            }
            return HTTP().get('/comprabuscoelvendedor/'+valor).then(({ data }) => {
              if (data.id !=null) {
                this.editado.vendedor = data
              }
              if (this.editado.cpr!=='PED') {
                this.medpag[3].activo    = this.editado.cpr=='PAG'?false:this.ctacte
                this.editado.medio_id    = this.ctacte ? 4 : 1
                this.editado.deposito_id = this.depItems[0].id
                return HTTP().get('/comprabuscosucursalproveedor/'+this.editado.tercero_id).then(({ data }) => {
                  this.afipSuc = data
                })
              } else {
                return HTTP().get('/haypedidoabierto/'+this.itemActual[0].tercero.id).then(({data})=>{
                  if (data.length!=0) {
                    this.msg.msgTitle = 'Hay un pedido pendiente'
                    let m = 'El pedido '+data[0].cpr+' esta pendiente de finalizar.<br>'
                    m +=  'Utilice este pedido para agregar items</b>.'
                    this.msg.msgBody = m
                    this.msg.msgVisible = true
                    this.msg.msgAccion = 'ninguna'
                    this.msg.msgButtons = ['Aceptar']
                    this.compraOk = false
                  }
                })
              }
            })
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTerceros = false))
    },

    searchTercerosGas (val) {
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      return HTTP().get('/indexter/false/7/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/'+val)
        .then(({data})=>{
        this.entriesTerceros = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTerceros.push(data[i].tercero)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTerceros = false))
    },

    searchMedios (val) {
      if (this.isLoadingMedios) return
      this.isLoadingMedios = true
      return HTTP().get('/medios').then(({ data }) => {
        this.entriesMedios = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMedios = false))
    },

    searchBancos (val) {
      if (this.isLoadingBancos) return
      this.isLoadingBancos = true
      return HTTP().get('/bancos').then(({ data }) => {
        this.entriesBancos = []
        data.forEach(e => {
          this.entriesBancos.push(e)
        })
        let ipos = this.entriesBancos.findIndex(x=>x.id==this.editadoMed.banco_id)
        if (ipos!=-1) {
          this.editadoMed.banco_id = this.entriesBancos[ipos].id;
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingBancos = false))
    },

    search(val) {
      this.$store.commit("setCentrales", { compras_buscar: val }, { root: true });
      this.listarHTTP(false)
    }
  },

  beforeMount () {
    this.yaMonto = false
  },

  mounted () {
    //this.$events.listen('testEvent', eventData => console.log(eventData));
    debugger
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      this.anio = moment().format('YYYY')
      this.leoAnios().then(data => {
        if (this.sucursalDemo) {
          this.comprobantes[0].activo = false
          this.comprobantes[1].activo = false
          this.comprobantes[2].activo = false
          this.comprobantes[3].activo = this.exclusivoDe.id!=null
//        this.comprobantes[3].activo = this.rol(31, 'ver')||this.exclusivoDe.id!=null
        } else {
          this.comprobantes[0].activo = this.rol(29, 'ver')   // FACTURAS
          this.comprobantes[1].activo = this.rol(30, 'ver')   // DEBITOS
          this.comprobantes[2].activo = this.rol(31, 'ver')   // CREDITOS
          this.comprobantes[3].activo = this.rol(32, 'ver')   // PRESUPUESTOS
          this.comprobantes[4].activo = this.rol(33, 'ver')   // REMITOS
          this.comprobantes[5].activo = this.rol(34, 'ver')   // PEDIDOS
          this.comprobantes[6].activo = this.rol(35, 'ver')   // GASTOS
          this.comprobantes[7].activo = this.rol(36, 'ver')   // PAGOS
        }
        this.$store.commit('closeAlert')
        moment.locale('es');
        if (this.tipo=='PP') {
            this.$store.commit("setCentrales", { ventas_panel: 'Pedidos' }, { root: true });
            this.filtroComprobanteSel = 'Pedidos'
            this.selectTipoDeComprobante(this.filtroComprobanteSel)
        } else {
          debugger
          if (this.centrales.compras_filtro!='') {
            this.filtro = this.centrales.compras_filtro
          }
          if (this.centrales.compras_panel=='') {
            this.selectTipoDeComprobante(this.filtroComprobanteSel)
          } else {
            this.selectTipoDeComprobante(this.centrales.compras_panel)
          }
        }
        if (this.centrales.compras_buscar!='') {
          this.search = this.centrales.compras_buscar
        }
        return HTTP().get('/afipcomprobantes').then(({ data }) => {
          data.forEach(element => {
            this.cprItems.push(element)
          })
          this.yaMonto = true
          this.cargoChequesDeTerceros()
          return HTTP().get('/cargoperiodosabiertoscompras').then(({ data }) => {
            this.periodosAbiertos = []
            for (let i=0; i<=data.length-1; i++) {
              this.periodosAbiertos.push(data[i].substring(2,4)+data[i].substring(4,6))
            }
            if (this.periodosAbiertos.length==0) {
              this.periodosAbiertos.push(moment().format('YYMM'))
            }
            let per = this.periodosAbiertos[0]
            for (let i=0; i<=11; i++) {
              per = moment(per,'YYMM').add(1, 'M').format('YYMM')
              this.periodosAbiertos.push(per)
            }
            this.periodosAbiertos.sort()

            this.headersItems[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
            this.headersItems[0].value = this.$store.state.codigooid == 'C'?'articulo.codigo':'articulo.id'

            this.headersArt[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
            this.headersArt[0].value = this.$store.state.codigooid == 'C'?'codigo':'articulo_id'

            this.headersSelArtPedErr[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
            this.headersSelArtPedErr[0].value = this.$store.state.codigooid == 'C'?'codigo':'art_id'

          })
        })
      })
    }
  },


  created () {
    this.cen_activo_bg = this.$store.state.temas.cen_card_activo_bg
    this.cen_activo_dark = this.$store.state.temas.cen_card_activo_dark
    for (let i=0; i<=7; i++) {
      this.comprobantes[i].bg = this.$store.state.temas.cen_panelcpr_bg
      this.comprobantes[i].dark = this.$store.state.temas.cen_panelcpr_dark
    }

    return HTTP().get('/afipiva').then(({ data }) => {
      this.ivaTasas = []
      for (let i=0; i<=data.length-1; i++) {
        this.ivaTasas.push(data[i])
      }
      return HTTP().get('/afipmonedas').then(({ data }) => {
        this.monItems = []
        for (let i=0; i<=data.length-1; i++) {
          if (data[i].simbolo!=null) {
            this.monItems.push(data[i])
          }
        }
        this.tasasIVA = []
        this.tasasIVA.push({nombre: '21%', tasa:21, total: 0, base: 0, iva: 0, afipiva_id: 5})
        this.tasasIVA.push({nombre: '10.5%', tasa:10.5, total: 0, base: 0, iva: 0, afipiva_id: 4})
        this.tasasIVA.push({nombre: '0% (Ex/No Gr)',tasa:0, total: 0, base: 0, iva: 0, afipiva_id: 2})
        this.tasasIVA.push({nombre: '2.5%', tasa:2.5, total: 0, base: 0, iva: 0, afipiva_id: 8})
        this.tasasIVA.push({nombre: '5%', tasa:5, total: 0, base: 0, iva: 0, afipiva_id: 7})
        this.tasasIVA.push({nombre: '27%', tasa:27, total: 0, base: 0, iva: 0, afipiva_id: 6})
        this.cargoCuentasDelUsuario()
        this.yaMonto = true
        this.listarHTTP()
      })
    })
  },


  methods: {
    ...mapMutations([
      'alert', 'closeAlert', 'setSucursal', 'setSucursales', 'setCentrales', 'setTema', 'setTemas',
      'setNotificaciones', 'setCaja', 'setVinculasPadres', 'setVinculasHijos', 'setEmpresa', 'setOperario', 'setLevel',
    ]),
    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////

    footProps(lineas) {
      this.footerProps.itemsPerPageOptions[0] = lineas;
      this.footerProps.showFirstLastPage = true
      this.footerProps.showCurrentPage = true
      this.footerProps.pageText = 'Páginas'
      this.footerProps. nextIcon = 'mdi-arrow-right-drop-circle-outline'
      this.footerProps.prevIcon = 'mdi-arrow-left-drop-circle-outline'
      return this.footerProps;
    },

    closeForm(){
      router.push('/')
    },

    seleccionDelProveedor(value) {
      debugger
      this.itemsProveedores = []
      this.dialogProveedores = false
      this.editado.tercero_id = value.id
      this.buscarProveedor()
    },

    buscarProveedor() {
      this.dialogProveedores = false
      let p = 0
      let us = 0
      let vi = false
      let ok = false
      let licPP = false
      let facturasDescuentos = []
      if (this.editado.tercero_id=='') {

        this.$nextTick(() => {
          const f = this.$refs.codigoproveedor;
          f.focus();
        });
    
      } else {

        // hev021201
        let cual = ''
        if (this.editado.tipo=='CO') {
          cual = 'COM'
        } else if (this.editado.tipo=='GS') {
          cual = 'GAS'
        }

        this.encontroElProveedor = false
        return HTTP().get('/buscartercero/'+this.editado.tercero_id+'/'+cual+'/true/'+this.sucursal).then(({data}) => {
          if (data=='inexistente') {
            this.mensaje('¡Proveedor inexistente!', this.temas.snack_error_bg, 1500)
            this.$nextTick(() => {
              const f = this.$refs.codigoproveedor
              f.focus();
            });

          } else {

            //SI ES UN PEDIDO   TIENE QUE SER UN PROVEEDOR VINCULADO
            //SI ES FAC/NDD/NDC TIENE QUE SER DE UN PROVEEDOR NO VINCULADO O VINCULADO PERO CON TIPO = 'PP'
            //ELSE LO CARGA
            if (data.t.length>1) {

              this.itemsProveedores = []
              for (let i=0; i<=data.t.length-1; i++) {
                ok = true
                us = data.t[i].tercero.user?data.t[i].tercero.user.id:0
                vi = this.vinculosPadres.findIndex(x=>x==us)!=-1?true:false
                p = this.vinculosPadresLic.findIndex(x=>x.user_id==us)
                if (p!=-1) {
                  licPP = this.vinculosPadresLic[p].tipo=='PP'?true:false
                }
                if ((this.editado.cpr=='PED'&&!vi)||
                   ((this.editado.cpr=='FAC'||this.editado.cpr=='NDD'||this.editado.cpr=='NDC')&&vi&&!licPP)) {
                  ok = false
                }
                if (ok) {
                  this.itemsProveedores.push({
                    id: data.t[i].tercero.id,
                    nombre: data.t[i].tercero.nombre,
                    cuit: data.t[i].tercero.cuit
                  })
                }
              }
              if (this.itemsProveedores.length>0) {
                this.dialogProveedores = true
              } else {
                this.mensaje('¡Proveedor inexistente!', this.temas.snack_error_bg, 2500)
                this.$nextTick(() => {
                  const f = this.$refs.codigoproveedor
                  f.focus();
                });
              }

            } else {

              this.proveedorVinculado = 0
              ok = true
              us = data.t[0].tercero.user?data.t[0].tercero.user.id:0
              vi = this.vinculosPadres.findIndex(x=>x==us)!=-1?true:false
              p = this.vinculosPadresLic.findIndex(x=>x.user_id==us)

              if (p!=-1) {
                licPP = this.vinculosPadresLic[p].tipo=='PP'?true:false
              }

              if ((this.editado.cpr=='PED'&&!vi)||
                 ((this.editado.cpr=='FAC'||this.editado.cpr=='NDD'||this.editado.cpr=='NDC')&&vi&&!licPP)) {
                ok = false
              }

              if (!ok) {

                this.mensaje('¡Proveedor vinculado! No esta habilitado para esta operación.', this.temas.snack_error_bg, 2500)
                this.$nextTick(() => {
                  const f = this.$refs.codigoproveedor
                  f.focus();
                });

              } else {

                this.encontroElProveedor = true
                this.itemActual = data.t[0]
                this.lisObj = [];
                let rid = data.t[0].tercero.responsable.id
                if (this.cfUser===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO
                  if (rid===1 || rid===2 || rid===9 || rid===11) {
                    this.editado.letra = 'A'
                    if (this.editado.cpr=='FAC') { this.editado.comprobante_id = 1 }
                    else if (this.editado.cpr=='NDD') { this.editado.comprobante_id = 2 }
                    else if (this.editado.cpr=='NDC') { this.editado.comprobante_id = 3 }
                    else if (this.editado.cpr=='REC') { this.editado.comprobante_id = 4 }
                  } else {
                    this.editado.letra = 'B'
                    if (this.editado.cpr=='FAC') { this.editado.comprobante_id = 6 }
                    else if (this.editado.cpr=='NDD') { this.editado.comprobante_id = 7 }
                    else if (this.editado.cpr=='NDC') { this.editado.comprobante_id = 8 }
                    else if (this.editado.cpr=='REC') { this.editado.comprobante_id = 9 }
                  }
                } else if (this.cfUser===6) { //EL USUARIO ES MONOTRIBUTISTA
                  this.editado.letra = 'C'
                  if (this.editado.cpr=='FAC') { this.editado.comprobante_id = 11 }
                  else if (this.editado.cpr=='NDD') { this.editado.comprobante_id = 12 }
                  else if (this.editado.cpr=='NDC') { this.editado.comprobante_id = 13 }
                  else if (this.editado.cpr=='REC') { this.editado.comprobante_id = 15 }
                }
                
                if (this.editado.cpr=='REM') {
                  this.editado.letra = 'R'
                  this.editado.comprobante_id = 125
                } else if (this.editado.cpr=='PED') {
                  this.editado.letra = 'P'
                  this.editado.comprobante_id = 126
                } else if (this.editado.cpr=='PAG') {
                  this.editado.letra = 'P'
                  this.editado.comprobante_id = 127
                }
    
                this.editado.tercero_id       = data.t[0].tercero.id
                this.editado.nombre           = data.t[0].tercero.nombre;
                this.editado.documento        = data.t[0].tercero.documento.nombre;
                this.editado.documento_id     = data.t[0].tercero.documento.id;
                this.editado.documentoNumero  = data.t[0].tercero.cuit;
                this.editado.responsableAbrev = data.t[0].tercero.responsable.abrev;
                this.dirItems = []
                for (let i=0; i<= data.t[0].tercero.direcciones.length-1; i++) {
                  this.dirItems.push(data.t[0].tercero.direcciones[i])
                }
                this.editado.direccion_id = this.dirItems[0].id
                this.ctacte = false
                if (this.editado.cpr=='FAC') {
                  this.ctacte = true
                } else {
                  this.ctacte = data.t[0].ctacte
                }

                if (this.editado.cpr=='PAG') {    // ES UN PAGO

                  this.ctacte = true
                  this.maxDiasChq = 999999
                  let user = data.t[0].tercero.user ? data.t[0].tercero.user.id : null
                  let tercero = data.t[0].tercero.id

                  return HTTP().get('/pendientes/'+data.t[0].tercero.id+'/'+this.sucursal+'/P').then(( { data }) => {

                    debugger
                    this.pend = []
                    facturasDescuentos = []
                    //let totPend = 0
                    if (data[0]!=undefined) {

                      for ( let i=0; i<= data[0].det.length-1; i++) {
  
                        // si es una factura la agrego en facSinCancelar
                        // que es a las que se les aplican los descuentos si hay
                        if (data[0].det[i].cpr!='DESCUENTOS PENDIENTES') {
                          if (data[0].det[i].cpr.substring(0,3)=='FAC'||data[0].det[i].cpr.substring(0,3)=='PRE') {
                            facturasDescuentos.push({
                              id: data[0].det[i].id,
                              pendiente: data[0].det[i].pendiente
                            })
                          }
    
                          debugger
                          this.pend.push({
                            id:          data[0].det[i].id,
                            cpr:         data[0].det[i].cpr,
                            importe:     data[0].det[i].total,
                            vencimiento: moment(data[0].det[i].vencimiento).format('YYYY-MM-DD'),
                            pendiente:   data[0].det[i].pendiente,
                            descuentos:  data[0].det[i].cpr.substring(0,3)=='DES'?data[0].det[i].pendiente:0,
                            acancelar:   0,
                            lista_id:    null,
                            desc1:       0,
                            desc2:       0,
                            espejo_id:   data[0].det[i].espejo_id,
                          })
                        }
                      }
                    }

                    this.totAPagar     = 0
                    this.totValores    = 0
                    this.valDiferencia = 0
                    
                    debugger
                    return HTTP().get('/tercerocuentas/'+tercero).then(({ data }) =>{

                      debugger
                      for (let i=0; i<=data.tercero[0].cuentas.length-1; i++) {
                        this.cueProvItems.push(data.tercero[0].cuentas[i])
                      }

                      debugger
                      let totSinDescuentos = 0
                      let aPagar = 0
                      for (let i=0; i<=this.pend.length-1; i++) {
                        totSinDescuentos += this.pend[i].pendiente
                      }

                      // calculo el total sin descuentos
                      this.condicionDePago = []
                      this.condicionesDePago = []
                      for (let i=0; i<=data.condpagos.length-1; i++) {
                        aPagar = totSinDescuentos - (totSinDescuentos*(data.condpagos[i].desc1/100))
                        aPagar = aPagar - (aPagar*(data.condpagos[i].desc2/100))
                        this.condicionesDePago.push({
                          id: data.condpagos[i].id,
                          nombre: data.condpagos[i].nombre,
                          desc1: data.condpagos[i].desc1,
                          desc2: data.condpagos[i].desc2,
                          medio_id: data.condpagos[i].medio_id,
                          dias: data.condpagos[i].dias,
                          apagar: this.roundTo(aPagar,2),
                          selected: data.condasignada==data.condpagos[i].id?true:false,
                        })
                      }
                  
                      debugger
                      let pos = this.condicionesDePago.findIndex(x=>x.id==data.condasignada)
                      if (pos!=-1) {
                        this.condicionDePago = this.condicionesDePago[pos]
                        this.condicionDePagoOriginal = this.condicionDePago
                        this.selectedCondDePago.push(this.condicionDePago)
                      }

                      debugger
                      return HTTP().post('/buscodescuentosenfacturas/', {facturasDescuentos}).then(({data}) => {
                        this.facturasDescuentosOriginales = data
                        this.asignoDescuentosEnFacturasParaElPago()
                      })
                    })
                  })

                } else {                      // ES UNA COMPRA O UN PEDIDO

                  return HTTP().get('/comprabuscoelvendedor/'+this.editado.tercero_id).then(({ data }) => {
                    if (data.id !=null) {
                      this.editado.vendedor = data
                    }
                    if (this.editado.cpr!=='PED') {
                      this.medpag[3].activo    = this.editado.cpr=='PAG'?false:this.ctacte
                      this.editado.medio_id    = this.ctacte ? 4 : 1
                      this.editado.deposito_id = this.depItems[0].id
                      return HTTP().get('/comprabuscosucursalproveedor/'+this.editado.tercero_id).then(({ data }) => {
                        this.afipSuc = data
                      })
      
                    } else {
      
                      return HTTP().get('/haypedidoabierto/'+this.editado.tercero_id).then(({data})=>{
                        if (data.length!=0) {
                          this.msg.msgTitle = 'Hay un pedido pendiente'
                          let m = 'El pedido '+data[0].cpr+' esta pendiente de finalizar.<br>'
                          m +=  'Utilice este pedido para agregar items</b>.'
                          this.msg.msgBody = m
                          this.msg.msgVisible = true
                          this.msg.msgAccion = 'ninguna'
                          this.msg.msgButtons = ['Aceptar']
                          this.compraOk = false
                        }
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

    onRowClick(item, row) {
      debugger
      if (this.valores.length==0) {
        this.asignoDescuentosEnFacturasParaElPago(item, row);
      }
    },

    asignoDescuentosEnFacturasParaElPago(item, row) {
      
      debugger
      if (this.condicionesDePago.length>0) {

        if (item!=undefined) {
          for (let i=0; i<=this.condicionesDePago.length-1; i++) {
            this.condicionesDePago[i].selected = false
          }
          this.condicionDePago = item
          let pos = this.condicionesDePago.findIndex(x=>x.id==this.condicionDePago.id)
          if (pos!=-1) {
            this.condicionesDePago[pos].selected = true
          }
        }

        let descuento = 0
        this.totAPagar = 0

        if (this.condicionDePago == this.condicionDePagoOriginal) {

          for (let i=0; i<=this.pend.length-1; i++) {

            if (this.pend[i].cpr.substring(0,3)=='DES') {
              descuento = this.pend[i].pendiente
            }

            let facConDesc = 0
            if (this.pend[i].cpr.substring(0,3)=='FAC'||this.pend[i].cpr.substring(0,3)=='PRE') {
              let aux = this.pend[i].pendiente
              if (this.condicionDePago.desc1!=undefined) {
                facConDesc = (aux-(aux*(this.condicionDePago.desc1/100)))
                facConDesc = this.roundTo((facConDesc-(aux*(this.condicionDePago.desc2/100))),2)
              }
            }
            this.pend[i].descuentos = this.roundTo(this.pend[i].pendiente - facConDesc,6)
            this.pend[i].acancelar = facConDesc==0?this.pend[i].pendiente:facConDesc
            this.pend[i].lista_id = this.condicionDePago.id
            this.pend[i].desc1 = this.condicionDePago.desc1
            this.pend[i].desc2 = this.condicionDePago.desc2
            this.totAPagar += facConDesc==0?this.pend[i].pendiente:facConDesc

          }

        } else {

          debugger
          for (let i=0; i<=this.pend.length-1; i++) {
            if (this.pend[i].cpr.substring(0,3)=='DES') {
              descuento = this.pend[i].pendiente
            } 
            let facConDesc = 0
            if (this.pend[i].cpr.substring(0,3)=='FAC'||this.pend[i].cpr.substring(0,3)=='PRE') {
              let aux = this.pend[i].pendiente
              facConDesc = (aux-(aux*(this.condicionDePago.desc1/100)))
              facConDesc = this.roundTo((facConDesc-(aux*(this.condicionDePago.desc2/100))),2)
            }
            this.pend[i].descuentos = this.pend[i].pendiente - facConDesc
            this.pend[i].acancelar = facConDesc
            this.pend[i].lista_id = this.condicionDePago.id
            this.pend[i].desc1 = this.condicionDePago.desc1
            this.pend[i].desc2 = this.condicionDePago.desc2
            this.totAPagar += facConDesc
          }

        }

        this.totAPagar -= Math.abs(descuento)

        this.medpag[0].activo = true;   // 1 - efectivo
        this.medpag[1].activo = false;  // 2 - Tj Credito
        this.medpag[2].activo = false;  // 3 - Tj Debito
        this.medpag[4].activo = false;  // 5 - Transferencia
        this.medpag[5].activo = false;  // 6 - Ch.3ro
        this.medpag[6].activo = false;  // 7 - Ch.Propio
        this.medpag[7].activo = false;  // 8 - Mcado.Pago
        this.medpag[8].activo = false;  // 9 - Todo Pago

        let pos = this.medpag.findIndex(x=>x.id==this.condicionDePago.medio_id);
        if (pos!=-1) {
          this.medpag[pos].activo = true
        }

        // si la lista es de cheques habilito los de terceros y los propios
        debugger
        if (this.condicionDePago.medio_id==5||this.condicionDePago.medio_id==6) {
          this.medpag[5].activo = true
          this.medpag[6].activo = true
          this.maxDiasChq = this.condicionDePago.dias
        }
    
        this.totAPagar = this.roundTo(this.totAPagar,2)
        this.editado.total = this.roundTo(this.totAPagar,2)
        this.valDiferencia = this.roundTo(this.totAPagar,2)*-1

      } else {

        this.medpag[0].activo = true;   // 1 - efectivo
        this.medpag[1].activo = true;  // 2 - Tj Credito
        this.medpag[2].activo = true;  // 3 - Tj Debito
        this.medpag[4].activo = true;  // 5 - Transferencia
        this.medpag[5].activo = true;  // 6 - Ch.3ro
        this.medpag[6].activo = true;  // 7 - Ch.Propio
        this.medpag[7].activo = true;  // 8 - Mcado.Pago
        this.medpag[8].activo = true;  // 9 - Todo Pago

        for (let i=0; i<=this.pend.length-1; i++) {
          this.pend[i].descuentos = 0
          this.pend[i].acancelar = this.pend[i].pendiente
          this.pend[i].lista_id = null
          this.pend[i].desc1 = 0
          this.pend[i].desc2 = 0
          this.totAPagar += this.pend[i].pendiente
        }

        this.totAPagar = this.roundTo(this.totAPagar,2)
        this.editado.total = this.roundTo(this.totAPagar,2)
        this.valDiferencia = this.roundTo(this.totAPagar,2)*-1

      }

    },

    sayMessage(item, open) {
      if (item.estado == 'E') {
        if (open) {
          this.mensaje('Llega el '+ this.fechaTimeLine(item.enviollegada), this.temas.forms_titulo_bg, 13000, false)
        } else {
          this.$store.commit('closeAlert')
        }
      }
    },

    queMesEs(mes) {
      this.elMes = mes
      let p = this.losMeses.indexOf(mes)
      p ++
      p = '0'+p
      p = p.substr(-2)
      return p
    },

    setAnio(anio) {
      if (anio) {
        this.anio = anio
      } else {
        this.anio = this.anio == null ? moment().format('YYYY') : this.anio
      }
      this.elAnio = this.anio
      this.meses = []
      for (let i=0; i<=this.periodos.length-1; i++) {
        if (this.periodos[i].per.substring(0,4)==this.anio) {
          let pos = Number(this.periodos[i].per.substring(4))-1
          this.meses.push(this.losMeses[pos])
        }
      }
      this.elMes = this.meses[0]
      this.elAnio = this.anio
      this.filtroEstadoSel = 'Todos'
      if (this.yaMonto) {
        this.listarHTTP(false)
      }
    },

    setMes(mes) {
      this.elMes = mes
      if (this.yaMonto) {
        this.listarHTTP()
      }
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

    leoAnios() {
      return HTTP().post('anios/', {tipo: 'C'}).then(({ data }) => {
        this.anios = []
        this.meses = []
        this.periodos = []
        let pos = -1
        if (data[0].length==0) {
          this.periodos.push({per:moment().format('YYYYMM'), cerrado: false})
          this.anios.push(moment().format('YYYY'))
          for (let i=0; i<=this.periodos.length-1; i++) {
            if (this.periodos[i].per.substring(0,4)==this.anios[0]) {
              pos = Number(this.periodos[i].per.substring(4))-1
              this.meses.push(this.losMeses[pos])
            }
          }
        } else {
          for (let i=0; i<=data[0].length-1; i++) {
            this.periodos.push({per:data[0][i].perfiscal, cerrado: data[0][i].comcerrado})
            pos = this.anios.findIndex( x => x == data[0][i].perfiscal.substring(0,4))
            if (pos==-1) {
              this.anios.push(data[0][i].perfiscal.substring(0,4))
            }
          }
          for (let i=0; i<=this.periodos.length-1; i++) {
            if (this.periodos[i].per.substring(0,4)==this.anios[0]) {
              pos = Number(data[0][i].perfiscal.substring(4))-1
              this.meses.push(this.losMeses[pos])
            }
          }
        }
        this.anio = this.anios[0]
        this.elAnio = this.anio
        let mesActual = moment().format('MMM').substring(0,3)
        pos = this.meses.findIndex(x => x.toUpperCase() === mesActual.toUpperCase())
        if (pos==-1) {
          // porque aun no hay movimientos en el mes actual, busco en el anterior
          if (this.meses.length>0) {
            //this.elMes = this.meses[this.meses.length-1]
            this.elMes = this.meses[0]
          } else {
            this.elMes = ''
          }
        } else {
          this.elMes = this.meses[pos]
        }
      })
    },

    setRespuestaRecepcion() {
      this.recepcion.observaciones=this.recepcion.respuesta
      if (this.recepcion.respuesta=='¡El pedido está correcto!') {
        this.recepcion.calificacion = 5
      } else if (this.recepcion.respuesta=='¡Pedido correcto pero con demora!') {
        this.recepcion.calificacion = 4
      } else if (this.recepcion.respuesta=='¡Productos rotos o mal embalados!') {
        this.recepcion.calificacion = 3
      } else if (this.recepcion.respuesta=='¡No son los productos que compre!') {
        this.recepcion.calificacion = 2
      } else if (this.recepcion.respuesta=='Informar otro problema') {
        this.recepcion.calificacion = 1
      }
    },

    rol (i, accion) {
      if (this.tipo=='PP' && accion=='acceder') {
        return (i==0||i==1||i==2||i==3||i==5||i==6||i==7) ? true : false
//      return (i==0||i==1||i==2||(i==3&&this.exclusivoDe.id!=null)||i==5||i==7) ? true : false
      }
      if ((this.sucursalDemo && i<3) || (!this.sucursalDemo && i==3)) { 
        return false
      }
      if (this.$store.state.level==2) { return true }
      const op = this.$store.state.roles.map(el => el.opcion_id);
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

    confirmarRecepcionHTTP() {
      return HTTP().post('/pedidorecepcion', { pedido: this.itemActual, calificacion: this.recepcion.calificacion }).then(({ data })=>{
        this.dialogRecepcion = false
        if (data) {
          this.listarHTTP()
        }
      })
    },

    cargoChequesDeTerceros() {
      return HTTP().get('/chequesencartera/'+this.userId+'/'+this.sucursal).then(({ data }) =>{
        for (let i=0; i<=data.length-1; i++) {

          let d = 0
          let hoy = moment()
          d = hoy.diff(data[i].fechafinanciera, 'days')

          this.cartera.push({
            id:               data[i].id,
            codban:           data[i].codigo,
            nomban:           data[i].nomban==null ? '' : data[i].nomban.substr(0,24),
            cuitlib:          data[i].cuitlib,
            nomlib:           data[i].nomlib==null ? '' : data[i].nomlib.substr(0,24),
            cuenta:           data[i].cuenta,
            nrovalor:         data[i].nrovalor,
            fechafinanciera:  data[i].fechafinanciera,
            dias:             d,
            importe:          data[i].importe,
            cuentaorigen_id:  data[i].cuentaorigen_id,
            cuentadestino_id: data[i].cuentadestino_id,
            banco_id:         data[i].banco_id,
            cheque_id:        data[i].cheque_id,
            echeq:            data[i].echeq,
            observ:           data[i].observ,
            seleccionado:     0,
            updated_at:       moment(data[i].updated_at).format('YYYY-MM-DD HH:mm:ss')
          })
        }
      })
    },

    cargoCuentasDelUsuario() {

      debugger
      return HTTP().get('/user/'+this.userId).then(({ data }) => {

        debugger
        this.depItems = []
        let psuc = data[0].sucursales.findIndex( x => x.id == this.sucursal)
        for (let i=0; i<= data[0].sucursales[psuc].depositos.length-1; i++) {
          this.depItems.push(data[0].sucursales[psuc].depositos[i])
        }
        this.editado.deposito_id = this.depItems[0].id
        this.cfUser = Number(data[0].tercero.responsable.codigo)
        // CARGO LAS CUENTAS BANCARIAS DEL USUARIO, DESPUES DESMENUSO EN EL PAGO
        // TARJETAS, CHEQUERAS, ETC. SEGUN SELECCIONE
        this.cueItems = []
        for (let i=0; i<=data[0].tercero.cuentas.length-1; i++) {
          if (data[0].tercero.cuentas[i].activo) {
            this.cueItems.push(data[0].tercero.cuentas[i])
          }
        }
      })
    },



    selectTipoDeComprobante(cual) {
      debugger
      this.filtroComprobanteSel = cual
      this.$store.commit("setCentrales", { compras_panel: cual }, { root: true });
      if (cual=='Facturas') {
        this.filtroComprobante = [1,6,11,51]   // [1,6,14,128]
      } else if (cual=='Débitos') {
        this.filtroComprobante = [2,7,12,52]
      } else if (cual=='Créditos') {
        this.filtroComprobante = [3,8,13,53]
      } else if (cual=='Presup.') {
        this.filtroComprobante = [124]
      } else if (cual=='Remitos') {
        this.filtroComprobante = [125]
      } else if (cual=='Pedidos') {
        this.filtroComprobante = [126]
      } else if (cual=='Gastos') {
        this.filtroComprobante = [1,6,11,51,128]
      } else if (cual=='Pagos') {
        this.filtroComprobante = [127]
      }
      if (cual=='Pedidos') {
        this.headers = this.headersPed
      } else {
        this.headers = this.headersNor
      }
      if (this.yaMonto) {
        this.listarHTTP()
      }
    },


    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      if (item.cpr.substring(0,3)=='PED') {
        if (item.estado=='P') { //&& item.regstk==1) {
          if (item.quienpidio=='V' && this.operarioEsVendedor) {
            this.acciones.push({nombre: 'Finalizar', icon: 'mdi-check-circle'})
            this.acciones.push({nombre: 'Anular Pedido', icon: 'mdi-backup-restore'})
          }
          this.acciones.push({nombre: 'Artículos', icon: 'mdi-barcode'})
          if (item.quienpidio=='C' && !this.operarioEsVendedor) {
            this.acciones.push({nombre: 'Enviar al Proveedor', icon: 'mdi-file-send'})
            this.acciones.push({nombre: 'Anular Pedido', icon: 'mdi-backup-restore'})
          }
        }
        if (item.estado=='F') {
          this.acciones.push({nombre: 'Iniciar un reclamo', icon: 'mdi-file-send'})
        }
        if (item.estado=='E') {
          this.acciones.push({nombre: 'Recepción', icon: 'mdi-star'})
        }
        if (item.estado=='I') {
          this.acciones.push({nombre: 'Calificar', icon: 'mdi-star'})
        }
//      if (item.estado=='T' && this.tipo=='PP') {
//        this.acciones.push({nombre: 'Ver Factura', icon: 'mdi-file-document'})
//      }
        this.acciones.push({nombre: 'Rastrear', icon: 'mdi-filmstrip'})
      }

      if (item.cpr.substring(0,3)=='FAC') {
        if (item.estado=='F') { //&& item.tercero.user==null) {
//        this.acciones.push({nombre: 'Imputar NDC', icon: 'mdi-file-percent'})
//        this.acciones.push({nombre: 'Imputar NDD', icon: 'mdi-file-plus'})
        } else if (item.estado=='P') {
          this.acciones.push({nombre: 'Editar', icon: 'mdi-pencil'})
          if (item.tipo!='GS') {
            this.acciones.push({nombre: 'Artículos', icon: 'mdi-barcode'})
          }
        }
      }

      if ((item.cpr.substring(0,3)=='FAC'||item.cpr.substring(0,3)=='NDD'||item.cpr.substring(0,3)=='NDC'||item.cpr.substring(0,3)=='CIN')
            &&(item.estado!='A')&&(item.estado!='P')) {
        if (this.importada(item)) {
          this.acciones.push({nombre: 'Editar (Período Fiscal)', icon: 'mdi-calendar'}) 
        } else {
          this.acciones.push({nombre: 'Editar (Cpr/Período/Vencimiento)', icon: 'mdi-calendar'}) 
        }

        // SOLO HABILITAR ESTAS DOS OPCIONES PARA PROVEEDORES NO VINCULADOS
        // O HABILITAR EL + EN NDC Y NDD, Y AHI HACER EL CONTROL DE VINCULADOS
        this.acciones.push({nombre: 'Imputar NDC', icon: 'mdi-file-percent'})
        this.acciones.push({nombre: 'Imputar NDD', icon: 'mdi-file-plus'})
      }
      if (item.estado=='P' && item.cpr.substring(0,3)!='PED') {
        this.acciones.push({nombre: 'Finalizar', icon: 'mdi-check-circle'})
      }
      if (item.cpr.substring(0,3)=='PAG') {
        if (item.estado=='F' && item.cpr.substring(0,3)=='PAG') {
          this.acciones.push({nombre: 'Anular Pago', icon: 'mdi-backup-restore'})
        }
      }
      this.acciones.push({nombre: 'Detalles', icon: 'mdi-glasses'})
      this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})
      this.acciones.push({nombre: 'Rastrear', icon: 'mdi-move-resize-variant'})
      if (item.tercero.user==null &&
         (item.observaciones==='COMPRA DESCARGADA'||item.observaciones=='FACTURA DE COMPRA'||item.observaciones=='GASTO'))  {
        // NO ES UN PROVEEDOR VINCULADO ( CONTROL PARA MINORISTAS )
        this.acciones.push({nombre: 'Borrar', icon: 'mdi-delete'})
        this.acciones.push({nombre: 'Anular Comprobante', icon: 'mdi-backup-restore'})
      }
    },


    selAccion(item) {

      return HTTP().post('comprobantecompra', { id: this.itemActual.id }).then(({ data }) => {
        this.itemActual = data.c
        if (item.nombre=='Detalles') {
          this.printDetalles(this.itemActual)
        } else if (item.nombre=='Imprimir') {
          this.print(this.itemActual)
        } else if (item.nombre=='Rastrear') {
          this.rastrear(this.itemActual)
        } else if (item.nombre=='Editar') {
          this.editar(this.itemActual)
        } else if (item.nombre=='Borrar') {
          this.borrar(this.itemActual)
        } else if (item.nombre=='Artículos') {
          if (this.itemActual.cpr.substring(0,3)=='PED') {
            this.cargarArtPed(this.itemActual)
          } else {
            this.cargarArtCom(this.itemActual)
          }
        } else if (item.nombre=='Finalizar') {
          this.finalizar(this.itemActual)
        } else if (item.nombre=='Enviar al Proveedor') {
          this.puedoEnviarPedido(this.itemActual)
        } else if (item.nombre=='Anular Pago') {
          this.preguntoAnularPago(this.itemActual) 
        } else if (item.nombre=='Anular Pedido') {
          this.preguntoAnularPedido(this.itemActual) 
        } else if (item.nombre=='Anular Comprobante') {
          this.preguntoAnularComprobante(this.itemActual) 
        } else if (item.nombre==='Recepción') {
          this.recepcionPedido(this.itemActual)
        } else if (item.nombre==='Calificar') {
          this.recepcionPedido(this.itemActual)
        } else if (item.nombre==='Editar (Período Fiscal)'||item.nombre==='Editar (Cpr/Período/Vencimiento)') {
          this.cambiarPeriodoFiscal(this.itemActual)
        }
      })
    },

    setAccionesItems(item) {
      this.itemActualItem = item
      this.accionesItems = []
      this.accionesItems.push({nombre: 'Editar', icon: 'mdi-pencil'})
      this.accionesItems.push({nombre: 'Borrar', icon: 'mdi-delete'})
    },

    async selAccionItem(item) {
      if (item.nombre=='Editar' && item.texto!='Promocion') {
        this.editarArt(this.itemActualItem)
      } else if (item.nombre=='Borrar') {
        this.preguntoBorrarItem(this.itemActualItem) 
      }
    },

    preguntoBorrarItem(item) {
      this.itemActual = item
      this.msg.msgTitle = 'Borrar Item'
      this.msg.msgBody = 'Desea borrar este Item?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    leerTimeLine(item) {
      this.timeLine = []
      return HTTP().get('/timeline/'+item.id).then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          this.timeLine.push(data[i])
        }
        this.dialogTimeLine = true
      });
    },

    cambiarPeriodoFiscal(item) {
      this.editado.id = item.id
      this.editado.perfiscal = item.perfiscal.substring(2,4)+item.perfiscal.substring(4,6)
      this.editado.vencimiento = moment(item.vencimiento).format('YYYY-MM-DD')
      this.editado.comprobante_id = item.comprobante_id
      this.afipSuc = item.cpr.substring(6,10)
      this.afipNro = item.cpr.substring(11)
      this.dialogCambiarPeriodoFiscal = true
    },

    confirmarCambioDePeriodo() {
      let pos = this.cprItems.findIndex(x=>x.id===this.editado.comprobante_id)
      if (pos!=-1) {
        this.editado.cpr = this.cprItems[pos].abrev+' '+this.afipSuc+'-'+this.afipNro
        return HTTP().post('/cambiarperiododelcomprobante', { editado: this.editado }).then(({ data }) => {
          this.dialogCambiarPeriodoFiscal = false
          if (data) {
            this.mensaje('¡El período fiscal ha sido cambiado con éxito!', this.temas.forms_titulo_bg, 2000, false)
            this.leoAnios().then(data => {
              this.listarHTTP();
            })
          } else {
            this.mensaje('¡Se ha producido un error al intentar cambiar el período fiscal indicado.!', this.temas.forms_titulo_bg, 2000, false)
          }
        })
      } else {
        this.mensaje('¡Se ha producido un error al intentar cambiar el período fiscal indicado.!', this.temas.forms_titulo_bg, 2000, false)
      }
    },

    nuevo(que, item) {
      this.condicionDePago = ''
      this.condicionesDePago = []
      this.encontroElProveedor = false
      this.compraOk = false
      //this.$store.commit("setCentrales", { compras_panel: que }, { root: true });      
      for (let i=0; i<=this.medpag.length-1; i++) {
        this.medpag[i].total = 0 
      }
      for (let i=0; i<=this.tasasIVA.length-1; i++) {
        this.tasasIVA[i].total = 0
        this.tasasIVA[i].base = 0 
        this.tasasIVA[i].iva = 0 
      }
      this.medpag[1].activo = this.sucursalDemo ? false : true
      this.medpag[2].activo = this.sucursalDemo ? false : true
      this.medpag[4].activo = this.sucursalDemo ? false : true
      this.medpag[6].activo = this.sucursalDemo ? false : true
      this.medpag[7].activo = this.sucursalDemo ? false : true
      this.medpag[8].activo = this.sucursalDemo ? false : true
      
      this.dialogCab = true; //this.exclusivoDe.id==null?true:false;
      
      this.dialogArt = false;
      this.dialogEditArt = false;
      this.editedIndex = -1
      this.basadoEnCpr = false;         // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PAG, etc)
      this.notificaEnBaseAOtro = [];    // LIMPIO NOTIFICACIONES PARA NO TENER PROBLEMAS
      this.notificaOriginal = [];
      this.basadoEnOtroCpr = []
      this.searchTerceros = '';
      this.isLoadingTerceros = false;
      this.valDiferencia = 0;
      this.formTitleArt = 'Nuevo Item';
      this.formTitleMed = 'Nuevo Valor';
      this.formTitleGas = 'Nuevo Gasto';
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editado = Object.assign({}, this.defaultItem);
      this.afipSuc = ''
      this.afipNro = '00000000'
      this.editado.tipo = 'CO'
      this.editado.deposito_id = this.depItems[0].id
      this.editado.comprobante_id = null
      this.editado.fecha     = moment().format('YYYY-MM-DD');
      this.editado.perfiscal = moment().format('YYMM');
      this.esFiscal          = true;

      if (que === 'Facturas' || que === 'Gastos') {

        let deQue = que==='Facturas' ? 'STOCK' : 'GASTO'
        this.formTitle   = 'Nuevo Comprobante de '+ deQue+ ' - Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'FAC';
        this.coef        = 1;
        if (que==='Gastos') {
          this.editado.regstk        = 0
          this.editado.observaciones = 'GASTO'
          this.editado.tipo          = 'GS'
          this.editado.deposito_id   = null
        } else {
          this.editado.regstk        = 1
          this.editado.observaciones = 'FACTURA DE COMPRA'
        }

      } else if (que === 'Créditos') {

        this.formTitle = 'Nueva NOTA DE CREDITO - Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'NDC';
        this.editado.observaciones = 'NOTA DE CREDITO'
        this.coef = -1;
        this.editado.regstk = 1

      } else if (que === 'Débitos') {

        this.formTitle = 'Nueva NOTA DE DEBITO - Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'NDD';
        this.editado.observaciones = 'NOTA DE DEBITO'
        this.coef = 1;
        this.editado.regstk = 1
      
      } else if (que === 'Presup.') {

        this.formTitle = 'Nuevo PRESUPUESTO Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'PRE';
        this.editado.observaciones = 'PRESUPUESTO'
        this.editado.comprobante_id = 124
        this.editado.regstk = this.sucursalDemo == 1 ? 1 : 0
        this.esFiscal = false;
        this.coef = 1;
        if (this.sucursalDemo) {
          this.medpag[1].activo = false
          this.medpag[2].activo = false
          this.medpag[4].activo = false
          this.medpag[7].activo = false
          this.medpag[8].activo = false
        }

      } else if (que === 'Remitos') {

        this.formTitle = 'Nuevo REMITO Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'REM';
        this.editado.observaciones = 'REMITO'
        this.coef = 1;
        this.esFiscal = false

      } else if (que === 'Pedidos') {

        this.formTitle = 'Nuevo PEDIDO '+this.empresa+' Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'PED';
        this.coef = 1;
        this.esFiscal = false;
        this.editado.comprobante_id = 126
        this.afipSuc = this.sucursalFiscal;
        this.editado.regstk = 1
        this.editado.quienpidio = 'C'
        this.compraOk = true

      } else if (que === 'Pagos') {

        if (this.cueItems.length==0&&!this.sucursalDemo) {
          this.msg.msgTitle = 'Cuentas Bancarias'
          let m = 'No tienes cuentas bancarias definidas.<br>'
          m +=  'Si vas a realizar pagos quizás debas definir tus cuentas bancarias.<br>'
          m +=  'Estas se definen en tu ficha de <b>Clientes</b> solapa <b>Cuentas Bancarias</b>.'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'ninguna'
          this.msg.msgButtons = ['Aceptar']
        }

        let tercero  = 0
        this.totCheTerSel = 0
        this.cartera = []
        this.valores = []
        this.pend = []
        this.cargoChequesDeTerceros()
        this.cargoCuentasDelUsuario()
        
        if (que === 'Pagos') {
          tercero = this.tercero_id
          this.formTitle                = 'Nuevo Pago '
          this.editado.cpr              = 'PAG';
          this.editado.observaciones    = 'PAGO'
          this.pagoDeUnSoloComprobante  = false
          this.coef                     = 1;
          this.esFiscal                 = false;
          this.editado.comprobante_id   = 127
          this.afipSuc                  = this.sucursalFiscal;
          this.editado.regstk           = 0
          this.searchTerceros           = ''
          this.valDiferencia            = 0
          this.dialogCab                = false
          this.dialog                   = false
          this.dialogPag                = true
        }
      }
    },

    editar(item) {
      this.compraOk = true
      this.itemsCargadosGravado = 0
      this.itemsCargadosIVA = 0
      for (let i=0; i<=item.items.length-1; i++) {
        this.itemsCargadosGravado += item.items[i].total
        this.itemsCargadosIVA += (item.items[i].total*(item.items[i].articulo.iva.tasa/100))
      }
      this.itemsCargadosGravado = this.roundTo(this.itemsCargadosGravado,2)
      this.itemsCargadosIVA = this.roundTo(this.itemsCargadosIVA,2)
      this.dialogCab = true;
      this.dialogArt = false;
      this.dialogEditArt = false;

      this.editedIndex = this.items.findIndex(x=>x.id==item.id)
      this.valDiferencia = 0;
      this.editado = Object.assign({}, item);
      this.editado.vencimiento = moment(this.editado.vencimiento).format('YYYY-MM-DD')
      this.editado.perfiscal = this.editado.perfiscal.substring(2,6)
      this.afipSuc = this.editado.cpr.substring(7,4)
      this.afipNro = this.editado.cpr.substring(12,8)
      this.cprActual = this.editado.cpr
      
      this.valores = this.editado.valoresEgresos                  // VER ESTO
      for (let i=0; i<=this.tasasIVA.length-1; i++) {
        this.tasasIVA[i].total = 0
        this.tasasIVA[i].base = 0
        this.tasasIVA[i].iva = 0
      }

      if (this.editado.afipiva.length>0) {
        for (let i=0; i<=this.editado.afipiva.length-1; i++) {
          let pos = this.tasasIVA.findIndex(x=>x.afipiva_id==this.editado.afipiva[i].afipiva_id)
          if (pos!=-1) {{
            this.tasasIVA[pos].total = this.editado.afipiva[i].base+this.editado.afipiva[i].iva
            this.tasasIVA[pos].base = this.editado.afipiva[i].base
            this.tasasIVA[pos].iva = this.editado.afipiva[i].iva
          }}
        }
      }
      for (let i=0; i <= this.valores.length-1; i++) {
        this.medpag[this.valores[i].medio_id-1].total += this.valores[i].importe
      }

      let tcpr = this.editado.cpr.substring(0,3)
      this.formTitleArt = 'Nuevo Item';
      this.formTitleMed = 'Nuevo Valor';  //2020-09
      this.esFiscal = tcpr === 'FAC' || tcpr === 'NDD' || tcpr === 'NDC' || (tcpr === 'PRE' && this.sucursalDemo) ? true : false
      this.esCIN = tcpr === 'CIN'
      if (tcpr === 'FAC' || tcpr === 'NDD' || tcpr === 'NDC' || tcpr === 'REM' || tcpr === 'CIN' || tcpr === 'PRE') {
        this.coef = tcpr == 'NDC' ? -1: 1;
        if (this.editado.regstk==1) {
          this.formTitle = 'Editar Comprobante Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        } else {
          this.formTitle = 'Editar Gasto Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        }
        if (tcpr === 'REM') {
          this.formTitle = 'Editar Remito Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        }
      } else if (tcpr === 'PAG') {
        this.formTitle = 'Nuevo Pedido '+this.empresa+' Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'PED';
        this.coef = 1;
      }
      let pos = this.cprItems.findIndex( x => x.id === this.editado.comprobante_id )
      this.editado.comprobante_id = this.cprItems[pos].id
      this.afipSuc = this.editado.cpr.substr(6,4)
      this.afipNro = this.editado.cpr.substr(11,8)
      this.editado.fecha = moment(this.editado.fecha).format('YYYY-MM-DD');
      this.editado.letra = this.editado.cpr.substring(4,5)
      this.editado.cpr = this.editado.cpr.substring(0,3)
      this.searchTerceros = this.editado.tercero.nombre
      this.isLoadingTerceros = false
    },

    borrar(item) {
      this.msg.msgTitle = 'Borrar Comprobante'
      this.msg.msgBody = 'Confirmas Borrar el Comprobante?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar comprobante'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },

    cancelar() {
      this.dialogCab = false;
      this.valores = []
      this.articulos = []
      this.editado = Object.assign({}, this.defaultItem);
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndex = -1;
    },

    guardarPag() {
      if (this.editado.cpr.substring(0,3)=='PAG') {
        this.msg.msgTitle = 'Confirmar el Pago' 
        this.msg.msgAccion = 'pagar comprobante'
        
        // puede pagar de menos, de mas, o el total de la deuda ( si tiene )
        let totPen = 0
        let totDes = 0
        let totVal = 0  // aca se determina el total del pago
        let totalPago = 0
        let dif = 0     // pago de mas o de menos
        let ndc = 0     // importe de la NDC
        let deMas = 0   // paga de mas o es anticipo
        let totNDC = 0

        //gilgamesh021201
        this.pendientes = []
        for (let i=0; i<=this.pend.length-1; i++) {
          this.pendientes.push({
            acancelar: this.pend[i].acancelar,
            cpr: this.pend[i].cpr,
            desc1:this.pend[i].desc1,
            desc2:this.pend[i].desc2,
            descuentos:this.pend[i].descuentos,
            espejo_id:this.pend[i].espejo_id,
            id:this.pend[i].id,
            importe:this.pend[i].importe,
            imputa:this.pend[i].imputa,
            lista_id:this.pend[i].lista_id,
            pendiente:this.pend[i].pendiente,
            vencimiento:this.pend[i].vencimiento
          })
        }

        debugger

        for (let i=0; i<=this.pendientes.length-1; i++) {
          this.pendientes[i].imputa = false
          totPen += Number(this.pendientes[i].pendiente)
          totDes += Number(this.pendientes[i].descuentos)
        }

        // sumo el total de los valores ingresados
        for (let i=0; i<=this.valores.length-1; i++) {
          totVal += Number(this.valores[i].importe)
        }
        totalPago = totVal
        if (this.pendientes.length==0) {
          deMas = totalPago
        }

        // 1) el pago puede ser mayor, menor o igual a la deuda
        // 2) pueden ser varias facturas
        // 3) tengo que calcular el monto del descuento (ndc) de cada factura

        // recorro pendientes y voy descontando totVal hasta que quede en cero
        let totValAux = totVal
        for (let i=0; i<=this.pendientes.length-1; i++) {

          let pen = this.pendientes[i].pendiente
          let des = this.pendientes[i].descuentos
          let aca = this.pendientes[i].acancelar

          // si el total del pago es igual al pendiente - el descuento
          this.pendientes[i].imputa = true
          let aux = this.pendientes[i].pendiente-this.pendientes[i].descuentos
          if (totValAux==aca) {                         // SE PAGA EL TOTAL DE LA DEUDA NO CALCULO NADA Y SALGO
            totNDC += des
            break
          } else if (totValAux < (pen-des)) {           // PAGO PARCIAL ( DE MENOS ) CALCULO NDC Y SALGO
            ndc = this.roundTo(totValAux*(des/aca),2)
            this.pendientes[i].descuentos = ndc
            this.pendientes[i].acancelar = totValAux
            totNDC += ndc
            break
          } else {                                      // EL TOTAL DE VALORES ES MAYOR AL COMPROBANTE ACTUAL
            ndc += this.roundTo(aux*(des/aca),2)
            totNDC += this.roundTo(aux*(des/aca),2)
            this.pendientes[i].descuentos = this.roundTo(aux*(des/aca),2)
            this.pendientes[i].acancelar = this.pendientes[i].pendiente-this.pendientes[i].descuentos
            totValAux -= aca 
          }
        }
        this.valDiferencia = dif

        let m = ''
        if (this.condicionesDePago.length>0) {
          m += 'Total del Pago: <b>$'+this.formatoImporte(totalPago)+'</b><br>'
          m += 'Deuda a Imputar: <b>$'+this.formatoImporte(totalPago+totNDC)+'</b><br>'
          if (totNDC!=0) {
            m += 'Se envía una Orden de NDC por <b>$'+this.formatoImporte(totNDC)+'</b><br>'
            m += 'a <b>'+this.editado.nombre+'</b><br>'
            m += 'para que complete el total de tu pago.<br><br>'
          }
        }
        if (this.valDiferencia>0) {
          m += '¡Te faltan cancelar <b>$'+this.kit.redondear(Math.abs(this.valDiferencia),2,2)+'</b>!<br>'
        } else if (this.valDiferencia<0) {
          m += '¡Van a quedar a tu Favor <b>$'+this.kit.redondear(Math.abs(this.valDiferencia),2,2)+'</b>!<br>'
        }
        m += '<br>¿Confirmas el Pago?'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgButtons = ['Aceptar','Cancelar']

      } else {

        this.dialogPag = false
      }

    },

    guardar() {
      let elCompraId = this.editedIndex != -1 ? this.editado.id : null
      if (Number(this.medpag[0].total) !== 0) {
        if (this.valores.length==0) {
          this.valores.push({
            id: null, caja_id: this.caja, medio_id: 1, cuentaorigen_id: null, cuentadestino_id: null, cuentacheque_id: null,
            cuentatarjeta_id: null, banco_id: null, tarjeta_id: null, cpringreso_id: null, cpregreso_id: elCompraId, cheque_id: null, echeq: false,
            fechafinanciera: null, fechasalida: null, importe: (this.editado.total-this.medpag[3].total)*this.coef, nrovalor: null, tipo: 'D', 
            observ: 'PAGO EN EFECTIVO', foto: null, medioNombre: null, cuenta: null, cuit: null, nombre: null, vuelto: false, updated_at: null,
          })
        } else {
          this.valores[0].id                = null 
          this.valores[0].caja_id           = this.caja
          this.valores[0].medio_id          = 1
          this.valores[0].cuentaorigen_id   = null
          this.valores[0].cuentadestino_id  = null
          this.valores[0].cuentacheque_id   = null
          this.valores[0].cuentatarjeta_id  = null
          this.valores[0].cpringreso_id     = null
          this.valores[0].cpregreso_id      = elCompraId
          this.valores[0].cheque_id         = null
          this.valores[0].fechafinanciera   = null
          this.valores[0].fechasalida       = null
          this.valores[0].importe           = (this.editado.total-this.medpag[3].total)*this.coef
          this.valores[0].nrovalor          = null
          this.valores[0].tipo              = 'D'
          this.valores[0].observ            = 'PAGO EN EFECTIVO'
        }
      } else {
        this.valores = []
      }
      if (this.editedIndex > -1) { // esta modificando
        this.id                 = this.editado.id;
        this.editado.valores    = this.valores
        this.editado.tasasIVA   = this.tasasIVA
        this.editado.cpr        = this.editado.cpr+'-'+this.editado.letra+' '+this.afipSuc+'-'+this.afipNro
        this.editarHTTP(this.editado);
      } else {
        this.altaHTTP();
      }
      this.cancelar();
    },

    listarHTTP:function(suc) {
      let perfiscal = ''
      if (this.elMes==undefined || this.elMes=='') return
      let m = this.queMesEs(this.elMes)
      perfiscal = this.anio+m
      this.progress = true
      let s = this.search==null||this.search=='' ? '' : this.search

      return HTTP().post('/compras', {
        suc: this.sucursal, 
        cpr: this.filtroComprobante, 
        tip: this.filtroComprobanteSel,
        pro: this.filtroTercero_id,
        perfiscal: perfiscal,
        search: s,
        vendedor: null }).then(({ data }) => {

          debugger
          this.filtrosEstados = []
          for (let i=0; i<=data.length-1; i++) {
            let a = this.getEstado(data[i].estado,'e',data[i].carga, data[i])
            let b = ''
            if (a=='Facturado') {
              b = 'Facturados'
            } else if (a=='Anulado') {
              b = 'Anulados'
            } else if (a=='Enviado') {
              b = 'Enviados'
            } else if (a=='Retirado') {
              b = 'Retirados'
            } else if (a=='Finalizado') {
              b = 'Finalizados'
            } else if (a=='Pendiente') {
              b = 'Pendientes'
            } else if (a=='En Embalaje') {
              b = 'En Ambalaje'
            } else if (a=='Embalado') {
              b = 'Embalados'
            } else if (a=='En camino') {
              b = 'En Camino'
            } else if (a=='A Favor') {
              b = 'A Favor'
            }
            let p = this.filtrosEstados.findIndex(x => x.tip === b);
            if (p==-1) {
              this.filtrosEstados.push({tip: b, ctt: 1})
            } else {
              this.filtrosEstados[p].ctt ++
            }
            data[i].filtroEstado = b
          }
          if (this.filtrosEstados.length>1) {
            this.filtrosEstados.unshift({tip: 'Todos', ctt: data.length})
          }

          this.itemsAll = data
          if (this.filtrosEstados.length>0) { // hev021
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

          return HTTP().post('/comprasresumen', {
            suc:this.sucursal,
            cli:this.filtroTercero_id,
            per:perfiscal,
            search: s,}).then(({data})=>{
            for (let i=0; i<=this.comprobantes.length-1; i++) {
              this.comprobantes[i].total = 0
              this.comprobantes[i].ctt = 0
            }
            for (let i=0; i<=data.length-1; i++) {
              if (data[i].id==1 || data[i].id==6 || data[i].id == 11 || data[i].id == 51 || data[i].id == 128) {
                if (data[i].tipo=='GS') {
                  this.comprobantes[6].total += data[i].total
                  this.comprobantes[6].ctt   += data[i].ctt
                } else {
                  this.comprobantes[0].total += data[i].total
                  this.comprobantes[0].ctt   += data[i].ctt
                }
              } else if (data[i].id==2 || data[i].id==7 || data[i].id == 12 || data[i].id == 52) {
                if (data[i].tipo=='GS') {
                  this.comprobantes[6].total += data[i].total
                  this.comprobantes[6].ctt   += data[i].ctt
                } else {
                  this.comprobantes[1].total += data[i].total
                  this.comprobantes[1].ctt   += data[i].ctt
                }
              } else if (data[i].id==3 || data[i].id==8 || data[i].id == 13 || data[i].id == 53) {
                if (data[i].tipo=='GS') {
                  this.comprobantes[6].total += data[i].total
                  this.comprobantes[6].ctt   += data[i].ctt
                } else {
                  this.comprobantes[2].total += data[i].total
                  this.comprobantes[2].ctt   += data[i].ctt
                }
              } else if (data[i].id==124) {
                this.comprobantes[3].total += data[i].total
                this.comprobantes[3].ctt   += data[i].ctt
              } else if (data[i].id==125) {
                this.comprobantes[4].total += data[i].total
                this.comprobantes[4].ctt   += data[i].ctt
              } else if (data[i].id==126) {
                this.comprobantes[5].total += data[i].total
                this.comprobantes[5].ctt   += data[i].ctt
              } else if (data[i].id==127) {
                this.comprobantes[7].total += data[i].total
                this.comprobantes[7].ctt   += data[i].ctt
              }
            }
            this.progress = false
          })
        })
    },

    editarHTTP:function(data) {
      data.perfiscal = '20'+data.perfiscal
      data.perfiscal = data.perfiscal.substring(0,4)+'-'+data.perfiscal.substring(4,6)
      return HTTP().patch(`compras/${data.id}`, data).then((data) => {
        if (data.data=='error') {
          this.mensaje('¡Opps, se ha producido un error!, el comprobante no se ha grabado.', this.temas.snack_error_bg, 2500) 
        } else {
          this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500) 
        }
        this.listarHTTP()
      });
    },

    nuevoPagoHTTP:function(data) {
      let totVal = 0
      let totDes = 0
      // sumo el total de los valores ingresados
      for (let i=0; i<=this.pendientes.length-1; i++) {
        if (this.pendientes[i].imputa) {
          totDes += this.pendientes[i].descuentos
        }
      }
      for (let i=0; i<=this.valores.length-1; i++) {
        totVal += Number(this.valores[i].importe)
      }
      data.perfiscal           = '20'+data.perfiscal
      data.perfiscal           = data.perfiscal.substring(0,4)+'-'+data.perfiscal.substring(4,6)
      data.valores             = this.valores
      data.pendientes          = this.pendientes
      data.cpr                 = 'PAG-P '+this.sucursalFiscal+'-'+'00000000'
      data.observaciones       = 'PAGO'
      data.notificacion        = 0,
      data.sucursal_id         = this.sucursal
      data.comprobante_id      = 127
      data.deposito_id         = null
      data.tipo                = 'PG'
      data.user_id             = this.userId
      data.mediodepago_id      = 4
      data.vendedor_id         = null
      data.estado              = 'F'
      data.carga               = 'M'
      data.notificaEnBaseAOtro = this.notificaEnBaseAOtro,
      data.notificaOriginal    = this.notificaOriginal,
      data.basadoEnOtroCpr     = this.basadoEnOtroCpr,
      data.condicionDePagoId   = this.condicionDePago.id;
      data.desc1               = this.condicionDePago.desc1;
      data.desc2               = this.condicionDePago.desc2;
      data.total               = this.roundTo(totVal,2);
      this.dialogPag           = false
      return HTTP().post('nuevopago', data).then(({data}) => {
        if (data.substring(0,5)=='block') {
          this.msg.msgTitle = 'Datos Modificados'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'block'
          let m = ''
          if (data == 'block pendientes') {
            m = '<br>¡Otro usuario ha modificado los pendientes de este comprobante!<br>'
          } else if (data == 'block valores') {
            m = '<br>¡Otro usuario ha operado sobre los valores de este comprobante!<br>'
          }
          m += 'Refresca los datos y verifica nuevamente!<br>.'
          this.msg.msgBody = m
          this.msg.msgButtons = ['Cerrar']
        } else if (data=='error') {
          this.mensaje('¡Ha ocurrido un problema con el Pago!', this.temas.snack_error_bg, 2500)
        } else {
          this.mensaje('¡Pago realizado correctamente!', this.temas.forms_titulo_bg, 2500)
          return HTTP().get('/user/'+this.userId).then(({data}) => {
            if (data[0].tercero != null) {
              this.$store.commit('setDatosEmpresa', data[0], { root: true} )
            }
            this.listarHTTP();
          })
        }
      });
    },

    borrarHTTP:function(data) {
      return HTTP().delete(`compras/${data.id}`, data).then(() => {
        this.listarHTTP()
      });
    },

    anularPagoHTTP:function() {
      // PASO VALORES A FORMATO MOMENT() PARA COMPATIBILIDAD EN LOS CONTROLES DE BLOQUEOS
      for (let i=0; i<=this.itemActual.valoresEgresos.length-1; i++) {
        this.itemActual.valoresEgresos[i].updated_at = moment(this.itemActual.valoresEgresos[i].updated_at).format('YYYY-MM-DD HH:mm:ss')
      }
      let userProv = this.itemActual.tercero.user!=null?this.itemActual.tercero.user.id:null
      return HTTP().post('anularpago', {
        id: this.itemActual.id,
        comprobante: {id: this.itemActual.id, updated_at: this.itemActual.updated_at},
        cancelaciones: this.itemActual.cancelaciones,
        valores: this.itemActual.valoresEgresos,
        vinculado:this.pagoVinculado,
        reutilizacheques: this.chePropEnPagoMantener,
        userprov: userProv,
        notificacion: this.reciboAAnularEstado=='A'?true:false,
        idNotificacionAnulacionPago: this.idNotificacionAnulacionPago }).then(({data}) => {
        if (data=='error') {
          this.mensaje('¡Se ha producido un error al intentar anular el Pago!.', this.temas.snack_error_bg, 3500)
        } else if (data=='block comprobante') {
          this.mensaje('¡Otro usuario ha modificado algun dato del pago. Refresque y verifique!.', this.temas.snack_error_bg, 3500)
        } else if (data=='block cancelaciones') {
          this.mensaje('¡Otro usuario ha modificado algun dato de cancelaciones. Refresque y verifique!.', this.temas.snack_error_bg, 3500)
        } else if (data=='block valores') {
          this.mensaje('¡Otro usuario ha modificado algun dato de valores. Refresque y verifique!.', this.temas.snack_error_bg, 3500)
        } else {
          this.mensaje('¡El Pago ha sido anulado con exito!', this.temas.forms_titulo_bg, 3500)
        }
        this.dialogPagAnula=false;
        this.listarHTTP();
      });
    },

    anularPedidoHTTP:function(data) {
      return HTTP().patch(`anulapedidoelcliente/${data.id}`).then(({data}) => {
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 1500) 
        } else {
          this.mensaje('¡El comprobante se ha Anulado con éxito!', this.temas.forms_titulo_bg, 1500) 
        }
        this.listarHTTP()
      });
    },

    anularComprobanteHTTP(data) {
      if (data.observaciones=='LIQUIDACION X COMISIONES') {
        return HTTP().patch(`anularliquidacion/${data.id}`).then(({data}) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 2500)
          } else {
            this.mensaje('¡La liquidacion ha sido anulada con éxito!', this.temas.forms_titulo_bg, 2500) 
          }
          this.listarHTTP()
        });
      } else {
        return HTTP().patch(`anularcomprobante/${data.id}`).then(({data}) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 2500) 
          } else {
            this.mensaje('¡El comprobante ha sido anulado con éxito!', this.temas.forms_titulo_bg, 2500) 
          }
          this.listarHTTP()
        });
      }
    },

    altaHTTP:function() {
      let fechaParaBarraDeAniosYMeses = this.editado.perfiscal+'-01'
      this.editado.estado = 'P'
      if (this.editado.cpr==='PED') {

        // CUANDO ES UN PEDIDO, NO ENVIO LOS ITEMS, SOLO LA CABECERA, LOS ITEMS SON ENVIADOS LUEGO DE SER CARGADOS
        return HTTP().post('/nuevopedido', {
          origen: 'compras',
          userProv_id: this.itemActual.tercero.user.id,
          userClie_id: this.userId,
          vendedor_id: null,
          viaje_id: null,
          recorrido_id: null,
          articulos: [] }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 1500) 
          } else {
            this.mensaje('¡Alta Exitosa!', this.temas.forms_titulo_bg, 1500) 
          }
          this.listarHTTP();
        })

      } else {

        this.editado.perfiscal = '20'+this.editado.perfiscal.substring(0,2)+'-'+this.editado.perfiscal.substring(2,4)
        return HTTP().post('/nuevacompra', {
          fecha:               this.editado.fecha,
          perfiscal:           this.editado.perfiscal,
          ctacte:              true,
          vencimiento:         moment(this.editado.vencimiento).format('YYYY-MM-DD'),
          tipo:                this.editado.tipo,
          cpr:                 this.editado.cpr+'-'+this.editado.letra+' '+this.afipSuc+'-'+this.afipNro,
          user_id:             this.userId,
          sucursal_id:         this.sucursal,
          tercero_id:          this.editado.tercero_id,
          comprobante_id:      this.editado.comprobante_id,
          direccion_id:        this.editado.direccion_id,
          documento_id:        this.editado.documento_id,
          mediodepago_id:      4,
          deposito_id:         this.editado.deposito_id,
          vendedor_id:         this.editado.vendedor.id,  //null, //this.editado.tercero_id,  021201
          moneda_id:           this.editado.moneda_id,
          tasadescuento:       this.editado.tasadescuento,
          importedescuento:    this.editado.importedescuento*this.coef,
          retiva:              this.editado.retiva*this.coef,
          retgan:              this.editado.retgan*this.coef,
          retib:               this.editado.retib*this.coef,
          gravado:             this.editado.gravado*this.coef,
          exento:              this.editado.exento*this.coef,
          iva:                 this.editado.iva*this.coef,
          impint:              this.editado.impint*this.coef,
          nogravado:           this.editado.nogravado*this.coef,
          flete:               this.editado.flete*this.coef,
          poradcosto:          this.editado.poradcosto*this.coef,
          total:               this.editado.total*this.coef,
          regstk:              this.editado.regstk,
          estado:              this.editado.estado,
          activo:              true,
          articulos:           this.articulos,
          observaciones:       this.editado.observaciones,
          valores:             this.valores,
          notificacion:        0,
          gasto:               this.itemActualGasto,
          tasasIVA:            this.tasasIVA,
          idProv:              null
          }).then(({ data }) => {
          
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error!', this.temas.snack_error_bg, 1500) 
          } else {
            this.mensaje('¡Alta Exitosa!', this.temas.forms_titulo_bg, 1500) 
          }
          return HTTP().get('/user/'+this.userId).then(({data}) => {
            if (data[0].tercero != null) {
              this.$store.commit('setDatosEmpresa', data[0], { root: true} )
            }
            let a = moment(fechaParaBarraDeAniosYMeses).format('YYYY')
            let m = moment(fechaParaBarraDeAniosYMeses).format('MMM')
            let pos1 = this.anios.findIndex(x => x === a);
            let pos2 = this.meses.findIndex(x => x === m);
            if (pos1==-1 || pos2==-1) {
              this.leoAnios().then(data => {
                this.listarHTTP();
              })
            } else {
              this.listarHTTP();
            }
          })
        });
      }
    },

    enviarPedidoHTTP(item) {
      this.editedIndex = this.items.findIndex(x=>x.id == item.id)
      if (this.items[this.editedIndex].tercero.user) {
        
        // TIENE QUE ENVIAR EL PEDIDO POR SISTEMA, SI HAY UN VIAJE ACTIVO NO ENVIA Y AVISA QUE HAY UN VIAJE
        return HTTP().patch('/enviarpedido', {
          id:this.items[this.editedIndex].id,
          vendedor: false,
          recorrido: null }).then(({data})=>{
          if (data = 'ok') {
            this.mensaje('¡Pedido enviado correctamente!', this.temas.forms_titulo_bg, 1500)
          } else {
            this.mensaje('¡Ha ocurrido un problema con el envío del pedido!', this.temas.forms_titulo_bg, 1500)
          }
          this.listarHTTP();
        })
      } else  {
        // TIENE QUE ENVIAR EL PEDIDO POR MAIL
      }
    },

    afipsuc() {
      this.afipSuc = this.afipSuc.padStart(4,'0')
    },

    afipnro() {
      this.afipNro = this.afipNro.padStart(8,'0')
    },

    finalizar(item) {

      debugger
      this.editedIndex = this.items.findIndex(x=>x.id==item.id)
      return HTTP().get('/comprachkfinalizar/'+item.id+'/'+this.sucursalDemo).then(({ data }) => {

        this.msg.msgTitle = 'Chequeo del Comprobante'
        // si hay descuentos recalculo el gravado y el iva
        let gra = 0
        let iva = 0
        let agr = 0
        let fle = 0
        let destas = 0
        let desimp = 0

        if (item.tipo=='GS') {
//        gra = item.gravado
//        iva = item.iva
        } else {
          gra = data[0].itemssiniva||0
          iva = data[0].itemsconiva-data[0].itemssiniva||0
          agr = data[0].agr
          fle = data[0].fle
          destas = data[0].tas
          desimp = data[0].des
          gra -= gra*(data[0].tas/100)
          iva -= iva*(data[0].tas/100)
        }

        // si ingreso flete (que es sin iva) recalculo el gravado y el iva
        let poradcosto = this.roundTo(((agr+fle)/gra)*100,6)||0
        gra += gra*(poradcosto/100)
        iva += iva*(poradcosto/100)

        let div = item.regstk==1 ? 3 : 2
        
        let con = (data[0].total+ gra+iva +data[0].valores)/div
        let txt = '<table><tr><td> &nbsp </td><td> &nbsp </td></tr>'
        if (div == 3) {
          txt += '<tr><td style="text-align:left">Total items ingresados</td>'
          txt += '<td style="text-align:right"><b>$'+this.formatoImporte(gra+iva)+'</b></td></tr>'
        }
        txt += '<td style="text-align:left">Total del Comprobante</td>'
        txt += '<td style="text-align:right"><b>$'+this.formatoImporte(data[0].total)+'</b></td></tr>'
        txt += '<tr><td style="text-align:left">> Flete</td>'
        txt += '<td style="text-align:right">$'+this.formatoImporte(fle)+'</td></tr>'
        txt += '<tr><td style="text-align:left">> Descuento ('+this.formatoImporte(destas)+'%)</td>'
        txt += '<td style="text-align:right">$'+this.formatoImporte(desimp)+'</td></tr>'
//      txt += '<tr><td style="text-align:left">                            </td>'
//      txt += '<td style="text-align:right"><b>'+'-----------------------'+'</b></td></tr>'
//      txt += '<tr><td style="text-align:left">Total Items</td>'
//      txt += '<td style="text-align:right"><b>$'+this.formatoImporte(gra+iva+agr+fle)+'</b></td></tr>'
        txt += '<tr><td style="text-align:left">Total Formas de Pago</td>'
        txt += '<td style="text-align:right"><b>$'+this.formatoImporte(data[0].valores)+'</b></td></tr>'
        txt += '<tr><td> &nbsp </td><td> &nbsp </td></tr>'
        if (div == 3 && poradcosto!=0) {
          txt += '<b>HAY RECARGO DE COSTOS</b><br>'
          txt += 'Se le aplicará un <b>%'+this.formatoImporte(poradcosto)+'</b> adicional '
          txt += 'al costo de cada item correspondiente a conceptos por <b>$'+this.formatoImporte(agr+fle)+'</b> que no forman parte de los '
          txt += 'mismos, pero que son parte del total del Comprobante.<br>'
          if (data[0].artcamcos>0) {
            txt += 'Esto implica que <b>'+data[0].artcamcos+' artículo/s cambiarán sus costos. </b><br>'
            txt += 'Para confirmarlos ingrese en el módulo <i>Artículos</i>, opción <i>Cambios de Precios</i>, '
            txt += 'solapa <i>Precios Modificados por Compras</i><br><br>'
          }
        } else if (data[0].artcamcos>0) {
          // AVISO QUE HUBO CAMBIOS EN LOS COSTOS
          txt += '<br><b>HAY CAMBIOS DE COSTOS</b><br>'
          if (data[0].artcamcos==1) {
            txt += '<b>'+data[0].artcamcos+' artículo ha cambiado su costo. </b><br>'
          } else {
            txt += '<b>'+data[0].artcamcos+' artículos cambiaron sus costos. </b><br>'
          }
          txt += '<br>¡La actualización no es automática!.<br><br>'
          txt += 'Para confirmarlos ingrese en el módulo <i>Artículos</i>, opción <i>Cambios de Precios</i>, '
          txt += 'solapa <i>Precios Modificados por Compras</i><br><br>'
        }

        let aaa = this.roundTo(con,2)
        let bbb = this.roundTo(data[0].total,2)
        if (aaa != bbb) {
          txt += '<tr><td style="color:red">¡EL COMPROBANTE NO BALANCEA!<br>'
          this.msg.msgButtons = ['Cancelar']
        } else {
          //txt += '<tr><td style="{color: `green´}">¡EL COMPROBANTE BALANCEA!<br>¿Lo finaliza?</td></tr>'
          txt += '<tr><td style="color:green">¡EL COMPROBANTE BALANCEA!<br>'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        }
        txt += '</table>'
        this.msg.msgBody = txt
        this.msg.msgVisible = true
        this.msg.msgAccion = 'finalizar comprobante'
        this.itemActual = item;
      });
    },

    finalizaCompra() {
      let fal = []
      return HTTP().get('/pedidossinstock/'+this.sucursalDemo).then(({ data }) => {
        let ids = this.itemActual.items.map(el => el.articulo_id)
        let pos = 0
        for (let i=0; i<=data.length-1; i++) {
          let rec = 0
          pos = ids.indexOf(data[i].artid)
          if (pos>=0) {
            rec = this.itemActual.items[pos].cantidad
          }
          fal.push({
            artid: data[i].artid,
            articulo: data[i].articulo.substr(0,35)+' ('+data[i].codigo+')',
            cliente: data[i].cliente_id,
            cpr: data[i].cpr,
            cprid: data[i].cprid,
            faltante: data[i].faltante,
            recibido: rec,
          })
        }
        return HTTP().patch('/comprafinalizar',{itemActual: this.itemActual, faltantes: fal}).then(({data})=>{
          if (data=='error') {
            this.mensaje('¡Se ha producido un error al intentar grabar este comprobante!', this.temas.snack_error_bg, 2500)
          } else {
            this.mensaje('¡El comprobante ha finalizado con éxito!', this.temas.forms_titulo_bg, 1500) 
          }
          this.listarHTTP();
        })
      })
    },

    tasaDescuentoGlobal() {
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.costo)
      let tde = Number(this.editado.tasadescuento)
      let ide = this.roundTo((ctt*pre),2)*(tde/100)
      this.editadoArt.importedescuento = ide
      this.editadoArt.total = this.roundTo(((ctt*pre)-ide),2)
      return this.editadoArt.total
    },

    calculoIVA(cual, pos) {
      this.editado.gravado    = 0
      this.editado.iva        = 0
      this.editado.retib      = Number(this.editado.retib)
      this.editado.retgan     = Number(this.editado.retgan)
      this.editado.retiva     = Number(this.editado.retiva)
      this.editado.impint     = Number(this.editado.impint)
      this.editado.exento     = Number(this.editado.exento)
      this.editado.nogravado  = Number(this.editado.nogravado)
      this.editado.flete      = Number(this.editado.flete)
      this.editado.poradcosto = Number(this.editado.poradcosto)
      for (let i=0; i<=this.tasasIVA.length-1; i++) {
        this.tasasIVA[i].total = Number(this.tasasIVA[i].total)
        this.tasasIVA[i].base = Number(this.tasasIVA[i].base)
        this.tasasIVA[i].iva  = Number(this.tasasIVA[i].iva)
      }
      if (cual=='t') {
        this.tasasIVA[pos].base = this.roundTo(this.tasasIVA[pos].total/(1+(this.tasasIVA[pos].tasa/100)),2)
        this.tasasIVA[pos].iva = this.roundTo(this.tasasIVA[pos].total-this.tasasIVA[pos].base,2)
        this.tasasIVA[pos].total = this.roundTo(this.tasasIVA[pos].base+this.tasasIVA[pos].iva,2)
      } else if (cual=='g') {
        if (cual==2) {
          this.tasasIVA[pos].iva = 0
        } else {
          this.tasasIVA[pos].iva = this.roundTo(this.tasasIVA[pos].base*(this.tasasIVA[pos].tasa/100),2)
        }
        this.tasasIVA[pos].total = this.roundTo(this.tasasIVA[pos].base+this.tasasIVA[pos].iva,2)
      } else if (cual=='i') {
        this.tasasIVA[pos].base = this.roundTo((100*this.tasasIVA[pos].iva)/(this.tasasIVA[pos].tasa),2)
        this.tasasIVA[pos].total = this.roundTo(this.tasasIVA[pos].base+this.tasasIVA[pos].iva,2)
      }
      for (let i=0; i<=this.tasasIVA.length-1; i++) {
        if (i==2) {
          this.tasasIVA[i].base = this.editado.nogravado+this.editado.exento
        } else {
          this.editado.gravado += this.tasasIVA[i].base
          this.editado.iva += this.tasasIVA[i].iva
        }
      }
      this.gravadoDiff = this.itemsCargadosGravado-this.editado.gravado
      this.ivaDiff = this.itemsCargadosIVA-this.editado.iva
      if (cual=='tasadescuento') {
        this.editado.importedescuento = this.roundTo(this.editado.gravado*(this.editado.tasadescuento/100),2)
      } else if (cual=='importedescuento') {
        this.editado.tasadescuento = this.roundTo((this.editado.importedescuento*100)/this.editado.gravado,2)
      }

      // si hay descuentos recalculo el gravado y el iva
      this.editado.gravado -= this.editado.gravado*(this.editado.tasadescuento/100)
      this.editado.iva -= this.editado.iva*(this.editado.tasadescuento/100)

      // si ingreso flete (que es sin iva) recalculo el gravado y el iva
      if (this.editado.gravado!=0) {
        this.editado.poradcosto = this.roundTo(((this.editado.flete)/this.editado.gravado)*100,6)
      }
      this.editado.gravado += this.editado.gravado*(this.editado.poradcosto/100)
      this.editado.iva += this.editado.iva*(this.editado.poradcosto/100)
      this.editado.total = this.roundTo(
        this.editado.retiva+
        this.editado.retgan+
        this.editado.retib+
        this.editado.impint+
        this.editado.nogravado+
        this.editado.gravado+
        this.editado.exento+
        this.editado.iva,2)
      this.calculos()
    },

    calculos(cual) {
      let totpag = 0
      if (this.ctacte) {
        for (let i=0; i<=this.medpag.length-1; i++) {
          if (i!=3) {
            totpag += this.medpag[i].total
          }
        }
        this.medpag[3].total = this.roundTo((Number(this.editado.total) - Number(totpag)),2)
      } else {
        for (let i=0; i<=this.medpag.length-1; i++) {
          if (i!=0) {
            totpag += this.medpag[i].total
          }
        }
        this.medpag[0].total = this.roundTo((Number(this.editado.total) - Number(totpag)),2)
      }
      this.totalItems = 0
      debugger
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.totalItems += this.articulos[i].total
      }
    },

    puedoEnviarPedido(item) {
      let arts = [] // cargo los articulos para la consulta articuloz
      for (let i=0; i<=item.items.length-1; i++) {
        arts.push(item.items[i].articulo_id)
      }
      if (arts.length==0) {

          let m = 'El pedido no tiene items.<br>'
          m += 'Ingresa a la opción <i>Artículos</i> del menú de linea del pedido<br>'
          m += 'para agregar Items.'
          this.msg.msgTitle = 'No se puede enviar el Pedido'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'pedido sin items'
          this.msg.msgButtons = ['Aceptar']

      } else {

        return HTTP().post('/puedeenviarpedido/',{ id: item.id}).then(({data})=>{
          if (data == 'En Viaje') {
            this.msg.msgTitle = 'Viaje en Proceso'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'viaje en proceso'
            let m = '<br>¡Tenemos una viaje en proceso para tu Zona!<br>'
            m += 'Nuestro vendedor ya tiene tu pedido.<br>El tomará el control y te visitará pronto.<br><br>'
            m += 'Revisa en la barra principal si tienes Notificaciones.<br>'
            this.msg.msgBody = m
            this.msg.msgButtons = ['Cerrar']
            return
          } else {
            return HTTP().post('/articuloz', {
              search: arts,
              vinculosPadresLic: this.$store.state.vinculosPadresLic,
              vinculosPadresAll: this.$store.state.vinculosPadresAll,
              proveedor: item.tercero.user.id, stockProv: true, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: this.descuentos,
              dolar: this.$store.state.dolar, activos: true, limit: 300 }).then(({ data })=>{
              // CONTROLO QUE TODO ESTE BIEN
              this.selArtPedErr = []
              for (let i=0; i<=data.length-1; i++) {
                let msg = ''
                let pos = item.items.findIndex(x=>x.articulo_id==data[i].id)
                let costoArt = this.roundTo(data[i].precios[0].costo,data[i].precios[0].decimales)
                let stk = data[i].stock-item.items[pos].cantidad
                if (stk<0||data[i].stock=='sin stock') {
                  //msg = 'Stock '
                }
                if (data[i].precios[0].ofeestado=='P') {
                  msg += 'Ofe/pausada'
                }
                if (msg!='') {
                  let stk = 0
                  if (data[i].stock=='HAY STOCK') {
                    stk = 'HAY STOCK'
                  } else {
                    stk = data[i].stock
                  }
                  this.selArtPedErr.push({
                    art_id: data[i].id, cpritem_id: data[i].cpritem_id, codigo: data[i].codigo,
                    nombre: data[i].nombre, unped: item.items[pos].cantidad, stock: stk,
                    preped: item.items[pos].costo, preact: costoArt, texto: '', err: msg
                  })
                }
              }
              if (this.selArtPedErr.length>0) {
                this.dialogError = true
              } else {
                this.msg.msgTitle = 'Enviar Pedido'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'Enviar Pedido'
                let txt = ''
                if (arts.length==0) {
                  this.msg.msgBody = '¡Este pedido no posee items!<br>Agrege items desde la opción <i>Artículos</i> para poder enviar el pedido.'
                  this.msg.msgButtons = ['Cerrar']
                } else {
                  if (item.tercero.user) {
                    txt = '¿Confirmas enviar el pedido a <b>'+item.tercero.user.username +'</b>?<br><br> El pedido posee '+(arts.length)+' item/s. '
                    txt += 'y será enviado por sistema.<br>'
                    txt += 'Cuando aceptes le llegará automaticamente a '+item.tercero.user.username+'.<br><br>'
                    txt += 'Cada acción que él realice te será notificada.<br>'
                    txt += '¡Estate atento al botón de notificaciones!'
                  } else {
                    txt = '¿Confirmas enviar el pedido a '+item.tercero.nombre+'?<br> El pedido posee '+(arts.length)+' item/s.'
                    txt = txt + 'El pedido será enviado por correo electrónico en formato Excel.'
                  }
                  this.msg.msgBody = txt
                  this.msg.msgButtons = ['Aceptar','Cancelar']
                }
                this.itemActual = item;
              }
            })
          }
        })
      }
    },

    arreglarPedido(){
      this.msg.msgTitle = 'Arreglar Pedido'
      this.msg.msgBody = 'Confirmas arreglar el pedido?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'arreglar pedido'
      this.msg.msgButtons = ['Aceptar', 'Cancelar']
    },

    arreglarPedidoHTTP (){
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
        this.listarHTTP()
      })
    },

    recepcionPedido (item) {
      this.itemActual = item;
      this.recepcion.respuesta = '¡El pedido está correcto!'
      this.recepcion.observaciones = '¡El pedido está correcto!'
      this.recepcion.fechaenvio = moment(item.enviollegada).format('YYYY-MM-DD')
      this.recepcion.fechallegada = moment().format('YYYY-MM-DD')
      this.recepcion.calificacion = 5
      this.dialogRecepcion = true
    },

    preguntoAnularPago(item) {
      // veo si se usaron cheques propios para anular el pago.
      // esto para preguntar si se reutilizan los numeros de los cheques utilizados.
      this.itemActual = item
      this.pagoVinculado = item.tercero.user!=null?true:false
      this.idNotificacionAnulacionPago = null
      return HTTP().post('puedoanularpago', {id: item.id, vinculado:this.pagoVinculado}).then(({data}) => {
        this.idNotificacionAnulacionPago = data.notificacion
        this.idNotificacionTipo = data.tipo
        if (!data.ok) { // NO PUEDE ANULAR EL PAGO, ES VINCUALDO Y EL PROVEEDOR YA USO LOS VALORES
          this.msg.msgTitle = 'No se puede Anular este Pago'
          this.msg.msgBody = data.aviso
          this.msg.msgVisible = true
          this.msg.msgAccion = 'imposible anular pago'
          this.msg.msgButtons = ['Aceptar']
        } else {

          return HTTP().get('/comprobantesrastrear/'+item.id+'/up').then(({ data }) => {
            // VEO SI HAY UN RECIBO
            this.hayRecibo = ''
            this.idReciboAAnular = null
            this.reciboAAnularEstado = null
            for (let i=1; i<=data.length-1; i++) {
              for (let j=0; j<=data[i].length-1; j++) {
                if (this.isArray(data[i][j])==false) {
                  if (data[i][j].cpr1.substring(0,3)=='REC'&&data[i][j].estado1!='A') { 
                    this.hayRecibo = data[i][j].cpr1
                    this.idReciboAAnular = data[i][j].padre_id
                    this.reciboAAnularEstado = data[i][j].estado1
                  } else if (data[i][j].cpr2.substring(0,3)=='REC'&&data[i][j].estado2!='A') {
                    this.hayRecibo = data[i][j].cpr2
                    this.idReciboAAnular = data[i][j].hijo_id
                    this.reciboAAnularEstado = data[i][j].estado2
                  }
                } else {
                  for (let k=0; k<=data[i][j].length-1; k++) {
                    if (this.isArray(data[i][j][k])==false) {
                      if (data[i][j][k].cpr1.substring(0,3)=='REC'&&data[i][j][k].estado1!='A') {
                        this.hayRecibo = data[i][j][k].cpr1
                        this.idReciboAAnular = data[i][j][k].hijo_id
                        this.reciboAAnularEstado = data[i][j][k].estado1
                      } else if (data[i][j][k].cpr2.substring(0,3)=='REC'&&data[i][j][k].estado2!='A') {
                        this.hayRecibo = data[i][j][k].cpr2
                        this.idReciboAAnular = data[i][j][k].hijo_id
                        this.reciboAAnularEstado = data[i][j][k].estado2
                      }
                    } else {
                      for (let l=0; l<=data[i][j][k].length-1; l++) {
                        if (data[i][j][k][l].cpr1.substring(0,3)=='REC'&&data[i][j][k][l].estado1!='A') {
                          this.hayRecibo = data[i][j][k][l].cpr1
                          this.idReciboAAnular = data[i][j][k][l].hijo_id
                          this.reciboAAnularEstado = data[i][j][k][l].estado1
                        } else if (data[i][j][k][l].cpr1.substring(0,3)=='REC'&&data[i][j][k][l].estado2!='A') {
                          this.hayRecibo = data[i][j][k][l].cpr2
                          this.idReciboAAnular = data[i][j][k][l].hijo_id
                          this.reciboAAnularEstado = data[i][j][k][l].estado2
                        }
                      }
                    }
                  }
                }
              }
            }
            this.cttChePropEnPago = 0
            for (let i=0; i<=item.valoresEgresos.length-1; i++) {
              if (item.valoresEgresos[i].cheque_id!=null) {
                this.cttChePropEnPago ++
              }
            }
            this.dialogPagAnula = true
          })
        };
      });
    },

    preguntoAnularComprobante() {
      this.msg.msgTitle = 'Anular Comprobante'
      this.msg.msgBody = '¿Confirmas Anular el Comprobante?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'anular comprobante'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    preguntoAnularPedido() {
      this.msg.msgTitle = 'Anular Pedido'
      this.msg.msgBody = '¿Confirmas Anular el Pedido?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'anular pedido'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    setFP(cual) {
      // EN BASE A cual, SETEO LA FORMA DE PAGO: EFEC, CHE.CARTERA, BANCO, RETENCION.
      //let valo = this.valores;
      this.editadoMed = Object.assign({}, this.defaultItemMed)
      // veo si el proveedor esta vinculado

      let vinculado = false
      let userId = this.itemActual.tercero.user!=undefined?this.itemActual.tercero.user.id:null
      if (userId!=null) {
        vinculado = this.vinculosPadresAll.findIndex(x=>x==userId)
      }
      if (vinculado && this.cueProvItems.length==0 && (cual==2 || cual==3 || cual==5)) {
        this.msg.msgTitle = '¡No hay cuenta!'
        let m = 'No hay cuentas bancarias definidas en el Proveedor<br>'
        m += 'Se debe definir al menos una cuenta para que los valores '
        m += 'ingresados aquí imputen en la misma.<br>'
        m += 'Si Ud. tiene acceso a estas cuentas definala, caso '
        m += 'contrario comuniquese con el proveedor para que la defina<br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'no hay cuenta bancaria en el proveedor'
        this.msg.msgButtons = ['Aceptar']
        //this.itemActual = item
      } else {
        for (let i=0; i<=this.cueProvItems.length-1; i++) {
          if (this.cueProvItems[i].predeterminada) {
            this.editadoMed.cuentadestino_id = this.cueProvItems[0].id
          }
        }
      }
      this.editedIndexMed = -1
      this.medioDePagoId = cual
      if (cual==1) {
        this.medpagwidth = 400    //efectivo
        this.dialogMed = true
      } else if (cual==2 || cual==3) {
        // filtro de las cuentas definidas las tarjetas de crédito
        this.medpagwidth = 700    //tarjeta de debito o credito ( filtro )
        this.tarItems = []
        for (let i=0; i<=this.cueItems.length-1; i++) {
          for (let j=0; j<=this.cueItems[i].tarjetas.length-1; j++) {
            if ((cual==2 && !this.cueItems[i].tarjetas[j].debito) ||
                 cual==3 && this.cueItems[i].tarjetas[j].debito) {
              this.tarItems.push({
                id:          this.cueItems[i].tarjetas[j].id,
                numero:      this.cueItems[i].tarjetas[j].tarjeta_numero,
                vencimiento: this.cueItems[i].tarjetas[j].tarjeta_vencimiento,
                debito:      this.cueItems[i].tarjetas[j].debito,
                nombre:      this.cueItems[i].tarjetas[j].tarjeta.nombre,
                cuenta_id:   this.cueItems[i].id,
                banco_id:    this.cueItems[i].banco_id,
                pos:         i,
              })
              this.editadoMed.tarjeta_id = this.tarItems[0].id
            }
          }
        }
        this.dialogMed = true
      } else if (cual==5) {
        this.medpagwidth = 800    //transferencia
        for (let i=0; i<=this.cueItems.length-1; i++) {
          if (this.cueItems[i].predeterminada) {
            this.editadoMed.cuentaorigen_id = this.cueItems[0].id
          }
        }
        this.dialogMed = true
      } else if (cual==6) {
        this.medpagwidth = 1210   //cheques en cartera
        this.dialogMed = true
        // Si es PP se habilita Cargar Cheques que no son propios, else, selecciona cheques ya cargados
      } else if (cual==7) {         
        this.medpagwidth = 910    //cheque propio
        let hayChequeras = false
        for (let i=0; i<=this.cueItems.length-1; i++) {
          if (this.cueItems[i].chequeras.length!=0) {
            hayChequeras = true
            break
          }
        }
        if (!hayChequeras) {
          this.msg.msgTitle = '¡No hay Chequeras cargadas!'
          let m = '<br>Para utilizar cheques propios es necesario que definas tus chequeras.<br><br>'
          m += 'Ve a tu ficha en <b>Clientes</b>, y en la solapa <b>Cuentas Bancarias</b> '
          m += 'podrás definirlas.<br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'no hay chequeras definidas'
          this.msg.msgButtons = ['Aceptar']
          this.dialogMed = false
          return
        }
        if (this.tipo=='PP') {  // SI ES CARGA DE CHEQUES DEBO SUMAR LOS CARGADOS EN valores[]
          this.totCheTerSel = 0
          for(let i=0; i<=this.valores.length-1;i++) {
            if (this.valores[i].medio_id==6) {
              this.totCheTerSel += this.valores[i].importe
            }
          }
        } else {
          this.dialogMed = true
        }
        this.dialogMed = true
      } else if (cual==8) {
        this.medpagwidth = 500
      } else if (cual==9) {
        this.medpagwidth = 500
      } else if (cual==10) {
        this.medpagwidth = 500
      }
      this.calculosMed()
      this.editadoMed.importe = this.valDiferencia
      this.editadoMed.fechafinanciera = moment().format('YYYY-MM-DD')
      this.laFechaDelChequeEstaOk = true
      this.medioDePagoNombre = this.medpag[cual-1].nombre
      this.elMedioEsOk()
    },

    elMedioEsOk() {
      this.elMedioEstaOk = true
      if (Number(this.editadoMed.importe)==0) {
        this.elMedioEstaOk = false
      }
      if (this.medioDePagoId==2 && this.editadoMed.tarjeta_id==null) {
        this.elMedioEstaOk = false
      }
      if (this.medioDePagoId==3 && this.editadoMed.tarjeta_id==null) {
        this.elMedioEstaOk = false
      }
      if (this.medioDePagoId==5 &&
        (this.editadoMed.cuentaorigen_id==null || this.editadoMed.cuentadestino_id==null)) {
        this.elMedioEstaOk = false
      }
      if (this.medioDePagoId==6) {
        if (this.editadoMed.importe < this.totCheTerSel) {
          this.elMedioEstaOk = false
        }
      }
      if (this.medioDePagoId==7) {
        if (this.editadoMed.cuentaorigen_id==null ||
            (this.editadoMed.chequera_id==null) ||
            (this.editadoMed.cheque_id==null&&this.editadoMed.chequera_id.echeq==0) ||
            (this.editadoMed.chequera_id.echeq==1&&this.editadoMed.nrovalor==null) ||
            this.editadoMed.fechafinanciera==null ||
            !this.laFechaDelChequeEstaOk ) {
          this.elMedioEstaOk = false
        }
      }
      if (this.medioDePagoId==8) {
      }
      if (this.medioDePagoId==9) {
      }
      if (this.medioDePagoId==10) {
      }
    },

    cargoValorInicialEnValores(caja, cpregreso, total, medio) {
      // puede ser cta cte o efectivo
      this.medpag[medio-1].total = this.editado.total
      let observ   = medio==1 ? 'PAGO EN EFECTIVO' : 'A CUENTA CORRIENTE'
      let medioNom = medio==1 ? 'Efectivo'         : 'Cuenta Corriente'
      this.valores.push({ 
        id: null, caja_id: caja, medio_id: medio, cuentaorigen_id: null, cuentadestino_id: null, cuentacheque_id: null, cuentatarjeta_id: null,
        banco_id: null, tarjeta_id: null, cpringreso_id: null, cpregreso_id: cpregreso, cheque_id: null, echeq: false, fechafinanciera: null,
        fechasalida: null, importe: total, nrovalor: null, tipo: 'D', observ: observ, foto: null, medioNombre: medioNom, cuenta: null,
        cuit: null, nombre: null, vuelto: false, updated_at: null
      })
    },

    activerow (item) {
      this.$set(item, 'selected', true)
    },

    selCheTer (item) {
      this.item
    },

    verificoFechaDelCheque() {
      this.laFechaDelChequeEstaOk = true
      let f1 = moment().format('YYYY-MM-DD')
      let f2 = moment(this.editadoMed.fechafinanciera).format('YYYY-MM-DD')
      if (f2=='Fecha inválida') {
        this.laFechaDelChequeEstaOk = false
          this.mensaje('¡Fecha inválida!', this.temas.snack_error_bg, 1500)
        return false
      } else {
        let hoy = moment(f1)
        let ven = moment(f2)
        let d = hoy.diff(ven, 'days')
        if (this.maxDiasChq!=999999) {
          if (d<0 && (Math.abs(d) > this.maxDiasChq)) {
            this.sayMensajeErrorFechaDelCheque(this.editado.nombre, d)
            this.laFechaDelChequeEstaOk = false
            return false
          }
        }
      }
    },

    selectCartera(item) {
      this.laFechaDelChequeEstaOk = true
      if (this.maxDiasChq!=999999) {
        if (item.dias>0 && (Math.abs(item.dias) > this.maxDiasChq)) {
          this.sayMensajeErrorFechaDelCheque(this.itemActual.tercero.nombre, item.dias)
          this.laFechaDelChequeEstaOk = false
          return
        }
      }
      let pos = this.cartera.indexOf(item)
      this.totCheTerSel = 0
      if (pos>=0) {
        this.cartera[pos].seleccionado = this.cartera[pos].seleccionado == 1 ? 0 : 1
      }
      for (let i=0; i<=this.cartera.length-1; i++) {
        if (this.cartera[i].seleccionado==1) {
          this.totCheTerSel += this.roundTo(this.cartera[i].importe,2)
        }
      }
      this.elMedioEsOk()
      this.calculosMed()
    },

    sayMensajeErrorFechaDelCheque(tercero, dias) {
      let m = ''
      let d = Math.abs(dias) - this.maxDiasChq
      this.msg.msgTitle = 'Error en los días del cheque!'
      m = 'El valor seleccionado se excede en '
      m += d
      m += d==1 ? ' día ' : ' días. <br>'
      m += '<i>'+tercero+'</i> recibe cheques de hasta '+this.maxDiasChq
      m += ' días.'
      m += ' Lamentamos las molestias.'
      this.msg.msgBody  = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'error en los dias del cheque'
      this.msg.msgButtons = ['Aceptar']
    },

    seleccionAutomatica() {
      this.totCheTerSel = 0
      let sel = 0
      for (let i=0; i<=this.cartera.length-1; i++) {
        this.cartera[i].seleccionado = 0
      }
      this.cartera.sort(function (a, b) {
        if (moment(a.fechafinanciera).format('YYYYMMDD') > moment(b.fechafinanciera).format('YYYYMMDD')) {
          return 1;
        }
        if (moment(a.fechafinanciera).format('YYYYMMDD') < moment(b.fechafinanciera).format('YYYYMMDD')) {
          return -1;
        }
        return 0;
      });
      for (let i=0; i<=this.cartera.length-1; i++) {
        if (sel+this.cartera[i].importe < this.editado.total) {
          if (this.cartera[i].dias>=0 && (Math.abs(this.cartera[i].dias) <= this.maxDiasChq)) {
            sel += this.cartera[i].importe
            this.cartera[i].seleccionado = 1
          }
        }
      }
      this.totCheTerSel = this.roundTo(sel,2)
      this.calculosMed()
    },

    limpiarSeleccion() {
      this.totCheTerSel = 0
      for (let i=0; i<=this.cartera.length-1; i++) {
        this.cartera[i].seleccionado = 0
      }
      this.elMedioEsOk()
      this.calculosMed()
    },

    habinhab(obj) {
      let retval = false
      let mp = this.medioDePagoId
      if (mp==1) {            //EFECTIVO
        if (obj=='efectivo') { retval = true }
      } else if (mp==2) {     //TARJETA DE CREDITO
        if (obj=='tarjeta') { retval = true }
      } else if (mp==3) {     //TARJETA DE DEBITO
        if (obj=='tarjeta') { retval = true }
      } else if (mp==5) {     //TRANSFERENCIA
        if (obj=='transferencia' || obj=='cuenta origen') { retval = true }
      } else if (mp==6) {     //CHEQUE DE TERCERO
        if (obj=='cheque de tercero') { retval = true }
      } else if (mp==7) {     //CHEQUE PROPIO
        if (obj=='cheque propio' || obj=='cuenta origen') { retval = true }
      }
      return retval
    },

    nuevoMed() {
      this.editedIndexMed = -1
      this.dialogMed = true
    },

    editarPend(item) {
      this.itemActualPend = item
      this.editadoPend.acancelar = item.acancelar
      this.dialogPend = true
    },

    borrarMed(item) {
      debugger
      let i = this.valores.indexOf(item)
      if (this.valores[i].medio_id==6) {
        let j = this.cartera.findIndex( x => x.id == this.valores[i].id)
        if (j!=-1) {
          this.cartera[j].seleccionado = 0
          this.totCheTerSel -= this.cartera[j].importe
        }
      } else if (this.valores[i].medio_id==7) {
        // debo desmarcar la chequera
        if (this.valores[i].cuentaorigen_id!=null) {     
          let xcue1 = this.cueItems.findIndex( x => x.id == this.valores[i].cuentaorigen_id)
          // desmarco el cheque para que se pueda usar de nuevo
          for (let i=0; i<=this.cueItems[xcue1].chequeras.length-1; i++) {
            for (let j=0; j<=this.cueItems[xcue1].chequeras[i].loscheques.length-1; j++) {
              if (this.cueItems[xcue1].chequeras[i].loscheques[j].numero==this.valores[i].nrovalor) {
                this.cueItems[xcue1].chequeras[i].loscheques[j].comprobante_id = null
                break
              }
            }
          }
        }
      }
      this.valores.splice(i,1);
      this.calculosMed()
    },

    calculosMed() {
      let totPen = 0
      let totVal = 0
      for (let i=0; i<=this.pend.length-1; i++) {
        totPen += Number(this.pend[i].acancelar)
      }
      for (let i=0; i<=this.valores.length-1; i++) {
        totVal += Number(this.valores[i].importe)
      }
      this.totAPagar = this.roundTo(totPen,2)
      this.totValores = this.roundTo(totVal,2)
      this.valDiferencia = this.roundTo(totPen-totVal,2)
    },

    selCuenta() {
      this.chraItems = []
      let xpos = this.cueItems.findIndex( x => x.id == this.editadoMed.cuentaorigen_id)
      if (this.cueItems[xpos].chequeras!=undefined) {
        for (let i=0; i<=this.cueItems[xpos].chequeras.length-1; i++) {
          this.chraItems.push({
            id:      this.cueItems[xpos].chequeras[i].id,
            nombre:  this.cueItems[xpos].chequeras[i].nombre,
            echeq:   this.cueItems[xpos].chequeras[i].echeq,
            cheques: this.cueItems[xpos].chequeras[i].loscheques
          })
        }
      }
    },

    selChequera() {
      this.echeq = false
      if (this.editadoMed.chequera_id.echeq==1) {
        this.echeq = true
        return
      }
      let xpos = this.chraItems.findIndex( x => x.id == this.editadoMed.chequera_id.id)
      this.cheItems = []
      for (let i=0; i<=this.chraItems[xpos].cheques.length-1; i++) {
        if (this.chraItems[xpos].cheques[i].comprobante_id == null) {
          this.cheItems.push({
            id:     this.chraItems[xpos].cheques[i].id,
            numero: this.chraItems[xpos].cheques[i].numero
          })
        }
      }
    },

    guardarMed() {
      debugger
      let elCompraId = this.editado.id != null ? this.editado.id : null
      let txt = ''
      let xcue1 = 0
      let xcue2 = 0
      let xtar = 0
      this.totCheTerSel = 0
      if (this.tipo=='PP') {  // SI ES CARGA DE CHEQUES DEBO SUMAR LOS CARGADOS EN valores[]
        for(let i=0; i<=this.valores.length-1;i++) {
          if (this.valores[i].medio_id==6) {
            this.totCheTerSel += this.valores[i].importe
          }
        }
      }
      // MUEVE BANCOS ?
      if (this.editadoMed.cuentadestino_id!=null) {     
        xcue2 = this.cueProvItems.findIndex( x => x.id == this.editadoMed.cuentadestino_id)
      }
      if (this.editadoMed.cuentaorigen_id!=null) {     
        xcue1 = this.cueItems.findIndex( x => x.id == this.editadoMed.cuentaorigen_id)
        if (xcue1!=-1) {
          this.editadoMed.banco_id = this.cueItems[xcue1].banco.id
        }
      } else if (this.editadoMed.tarjeta_id!=null) {
        xtar = this.tarItems.findIndex( x => x.id == this.editadoMed.tarjeta_id)
        if (xtar!=-1) {
          // en tarItems[x].pos guardo la posicion del objeto en this.cueItems
          xcue1 = this.tarItems[xtar].pos
          this.editadoMed.cuentaorigen_id = this.cueItems[xcue1].id
          this.editadoMed.cuentatarjeta_id = this.cueItems[xcue1].id
          this.editadoMed.banco_id = this.cueItems[xcue1].banco.id
        }
      }
      if (this.medioDePagoId==1 ) {   // EFECTIVO) 
        txt = 'PAGO EN EFECTIVO'
      } else if (this.medioDePagoId==6) {
        // Debo borrar primero todos los cheques del array y luego egregar los de cartera.
        if (this.tipo!='PP') {
          for (let i=0; i<=this.valores.length-1; i++) {
            if (this.valores[i].medio_id==6) {
              this.valores.splice(i--,1)
            }
          }
          for (let i=0; i<=this.cartera.length-1; i++) {
            if (this.cartera[i].seleccionado==1) {
              this.valores.push({ 
                id:                this.cartera[i].id,
                caja_id:           this.caja,
                medio_id:          6,
                cuentaorigen_id:   this.cartera[i].cuentaorigen_id,
                cuentadestino_id:  this.cartera[i].cuentadestino_id,
                cuentacheque_id:   null,
                cuentatarjeta_id:  null,
                banco_id:          this.cartera[i].banco_id,
                tarjeta_id:        null,
                cpregreso_id:      elCompraId,
                cpringreso_id:     null,
                cheque_id:         this.cartera[i].cheque_id,
                echeq:             this.cartera[i].echeq,
                fechafinanciera:   moment(this.cartera[i].fechafinanciera).format('YYYY-MM-DD'),
                fechasalida:       moment().format('YYYY-MM-DD'),
                importe:           this.cartera[i].importe,
                nrovalor:          this.cartera[i].nrovalor,
                tipo:              'D',
                observ:            this.cartera[i].observ,
                foto:              null,
                medioNombre:       this.medioDePagoNombre,
                cuenta:            null,
                cuit:              null,
                nombre:            null,
                vuelto:            false,
                updated_at:        this.cartera[i].updated_at,
              })
            }
          }
        } else {
          let posban = this.itemsBancos.findIndex(x=>x.id==this.editadoMed.banco_id)
          txt = this.itemsBancos[posban].nombre+' - '
          txt += 'Cta:' + this.editadoMed.cuenta+' - '
          txt += 'Nro:'+this.editadoMed.nrovalor+' - '
          txt += 'FecFin:'+moment(this.editadoMed.fechafinanciera).format('DD-MM-YYYY')
          this.valores.push({
            id:                this.valores.length+1,
            caja_id:           this.caja,
            medio_id:          6,
            cuentaorigen_id:   this.editadoMed.cuentaorigen_id,
            cuentadestino_id:  this.editadoMed.cuentadestino_id,
            cuentacheque_id:   null,
            cuentatarjeta_id:  null,
            banco_id:          this.editadoMed.banco_id,
            tarjeta_id:        null,
            cpregreso_id:      elCompraId,
            cpringreso_id:     null,
            cheque_id:         this.editadoMed.chequera_id.echeq==1?null:this.editadoMed.cheque_id,
            echeq:             this.editadoMed.chequera_id.echeq==1?true:false,
            fechafinanciera:   moment(this.editadoMed.fechafinanciera).format('YYYY-MM-DD'),
            fechasalida:       moment().format('YYYY-MM-DD'),
            importe:           this.editadoMed.importe,
            nrovalor:          this.editadoMed.nrovalor,
            tipo:              'I',         // --> MARCA PARA INDICAR QUE ES UNA CARGA DE CHEQUES
            observ:            txt,
            foto:              null,
            medioNombre:       this.medioDePagoNombre,
            cuenta:            null,
            cuit:              null,
            nombre:            null,
            vuelto:            false,
            updated_at:        null,
          })
        }
      } else if (this.medioDePagoId==2 || this.medioDePagoId==3) {   // TARJETA CRE Y DEB
        txt =  'Tar:'+this.cueItems[xcue1].tarjetas[xtar].tarjeta_numero+' - '
        txt += this.cueItems[xcue1].tarjetas[xtar].tarjeta.nombre+' ('
        txt += this.cueItems[xcue1].tarjetas[xtar].debito==1 ? 'Débito) - ' : 'Crédito) - '
        txt += this.cueItems[xcue1].banco.nombre.substring(0,15)+' - '
        txt += 'Cta:' + this.cueItems[xcue1].cuenta
      } else  if (this.medioDePagoId==5 ) {   // TRANSFERENCIA
        txt = 'Transf.desde:' + this.cueItems[xcue1].cuenta
        txt += ' hasta/' + this.cueProvItems[xcue2].cuenta
      } else  if (this.medioDePagoId==7 ) {   // CHEQUE PROPIO
        txt = this.cueItems[xcue1].banco.nombre+' - '
        txt += 'CheqProp - '
        txt += 'Cta:' + this.cueItems[xcue1].cuenta+' - '
        if (this.editadoMed.chequera_id.echeq==1) {
          txt += 'eCheq Nro:'+this.editadoMed.nrovalor+' - '
        } else {
          txt += 'Nro:'+this.editadoMed.cheque_id.numero+' - '
        }
        //txt += 'Nro/'+this.editadoMed.chequera_id.echeq==1?this.editadoMed.nrovalor:this.editadoMed.cheque_id.numero+' - '
        txt += 'FecFin:'+moment(this.editadoMed.fechafinanciera).format('DD-MM-YYYY')

        // marco el cheque para que quede como usado
        if (this.editadoMed.chequera_id.echeq==0) {
          let idChequera = this.editadoMed.chequera_id.id
          for (let i=0; i<=this.cueItems[xcue1].chequeras.length-1; i++) {
            for (let j=0; j<=this.cueItems[xcue1].chequeras[i].loscheques.length-1; j++) {
              if (this.cueItems[xcue1].chequeras[i].loscheques[j].numero==this.editadoMed.cheque_id.numero) {
                this.cueItems[xcue1].chequeras[i].loscheques[j].comprobante_id = j
                break
              }
            }
          }
        }

      }
      if (this.editedIndexMed == -1 && this.medioDePagoId!=6) {
        let fecfin = null
        if (this.editadoMed.fechafinanciera!=null) {
          fecfin = moment(this.editadoMed.fechafinanciera).format('YYYY-MM-DD')
        }
        let xNroValor = null
        if (this.editadoMed.chequera_id!=null) {
          if (this.editadoMed.chequera_id.echeq==1) {
            xNroValor = this.editadoMed.nrovalor
          } else {
            xNroValor = this.editadoMed.cheque_id==null?null:this.editadoMed.cheque_id.numero
          }
        }
        this.valores.push({ 
          id:                null,
          caja_id:           this.caja,
          medio_id:          this.medioDePagoId-1,
          cuentaorigen_id:   this.editadoMed.cuentaorigen_id,
          cuentadestino_id:  this.editadoMed.cuentadestino_id,
          cuentacheque_id:   null,
          cuentatarjeta_id:  null,
          banco_id:          this.editadoMed.banco_id,
          tarjeta_id:        this.editadoMed.tarjeta_id==null ? null : this.editadoMed.tarjeta_id,
          cpregreso_id:      elCompraId,
          cpringreso_id:     null,
          cheque_id:         this.editadoMed.cheque_id==null ? null : this.editadoMed.cheque_id.id,
          echeq:             this.editadoMed.cheque_id==null ? true : false,
          fechafinanciera:   fecfin,
          fechasalida:       moment().format('YYYY-MM-DD'),
          importe:           this.editadoMed.importe,
          nrovalor:          xNroValor, // puede ser otro: ejem, nro de transaccion o b.de depos.
          tipo:              'D',
          observ:            txt,
          foto:              null,
          medioNombre:       this.medioDePagoNombre,
          cuenta:            null,
          cuit:              null,
          nombre:            null,
          vuelto:            false,
          updated_at:        null,
        })
      }
      this.calculosMed()
      this.dialogMed = false
    },

    buscoCuentasDelCuit () {
      this.elCuitEstaba = false
      return HTTP().get('/tercerocuitcuentas/'+this.editadoMed.cuit ).then(({ data }) => {
        this.cueItems = []
        if (data=='') {
          this.mensaje('¡Este CUIT no existe en AFIP!', this.temas.forms_titulo_bg, 1500)
          this.$refs.cuit.focus()
          return
        } else if (data.errorConstancia) {
          this.mensaje('ERROR EN CUIT: '+data.errorConstancia.error[0], this.temas.forms_titulo_bg, 3500)
          this.$refs.cuit.focus()
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
            this.mensaje('¡Esta cuenta corresponde a otro CUIT!', this.temas.forms_titulo_bg, 1500) 
            this.$refs.cuenta.focus()
            return
          }
          this.editadoMed.cuentaorigen_id = data[0].id
          this.editadoMed.banco_id = data[0].banco.id
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
        this.mensaje('¡Este numero de cheque ya existe para esta cuenta!', this.temas.forms_titulo_bg, 1500)
        this.$refs.numerodecheque.focus()
        return
      }
      return HTTP().get('/buscocheque/'+this.editadoMed.cuentaorigen_id+'/'+this.editadoMed.nrovalor ).then(({data})=>{
        if (data.length>0) {
          this.mensaje('¡Este numero de cheque ya existe para esta cuenta!', this.temas.forms_titulo_bg, 1500)
          this.$refs.numerodecheque.focus()
          return
        }
      })
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

    cancelarSelArtPedErr() {
      this.dialogError = false
    },

    cancelarMed() {
      for (let i = 0; i<=this.cartera.length-1; i++) {
        this.cartera[i].seleccionado = 0
      }
      this.totCheTerSel = 0
      this.dialogMed = false;
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
        this.timeLine = []
        this.dialogTimeLine = true
        for (let i=0; i<=r.length-1; i++) {
          if (r[i].user1==this.userId&&r[i].user2==this.userId) {
            let pos = this.timeLine.findIndex(x=>x.detalles==r[i].cpr2)
            if (pos==-1) {
              this.timeLine.push({ created_at: r[i].fecha2, detalles: r[i].cpr2, novedad: r[i].cpr2 })
            }
            pos = this.timeLine.findIndex(x=>x.detalles==r[i].cpr1)
            if (pos==-1) {
              this.timeLine.push({ created_at: r[i].fecha1, detalles: r[i].cpr1, novedad: r[i].cpr1 })
            }
          }
        }
      });
    },

    isArray(array) {
      if (toString.call(array) === "[object Array]") {
        return true;
      } else if ( typeof array.length === "number" ) {
        return true;
      }
      return false;
    },

    buscarCpr() {
      this.compraOk = false
      this.afipNro = this.afipNro.padStart(8,'0')
      let pos = this.cprItems.findIndex( x => x.id === this.editado.comprobante_id )
      if (pos!=-1) {
        let cpr = this.cprItems[pos].abrev+' '+this.afipSuc+'-'+this.afipNro
        return HTTP().post('/compraexisteelcomprobante', { tercero_id: this.editado.tercero_id, cpr: cpr }).then(({data})=>{
          if ((this.editedIndex==-1 && data) || (this.editedIndex!=-1 && cpr!=this.cprActual)) {
            this.msg.msgTitle = 'El comprobante ya existe!'
            this.msg.msgBody  = 'El comprobante '+cpr+' ya fue ingresado.' 
            this.msg.msgVisible = true
            this.msg.msgAccion = 'el comprobante ya existe'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.compraOk = true
            this.editado.cpr = cpr.substring(0,3)
          }
        });
      }
    },

    verGastos() {
      return HTTP().get('/usersgastos').then(({ data }) => {
        this.gastos = data
        this.dialogGas = true
      });
    },

    verFaltantes(dialog) {
      return HTTP().get('/pedidossinstock/'+this.sucursalDemo).then(({ data }) => {
        this.faltantes = []
        for (let i=0; i<=data.length-1; i++) {
          this.faltantes.push({
            articulo: data[i].articulo.substr(0,35)+' ('+data[i].codigo+')',
            artid: data[i].artid,
            cliente: data[i].cliente.substr(0,25),
            codigo: data[i].codigo,
            cpr: data[i].cpr,
            faltante: data[i].faltante,
            fecha: data[i].fecha,
            seleccionado: false,
          })
        }
        if (dialog) {
          this.dialogFaltantes = true
        }
      });
    },

    generarCompra(item) {
    },

    seleccionarFaltante(item) {
      let pos = this.faltantes.indexOf(item)
      if (pos>=0) {
        this.faltantes[pos].seleccionado = this.faltantes[pos].seleccionado == 1 ? 0 : 1
      }
    },

    nuevoGasto() {
      this.editedIndex = -1;
      this.editadoGas                    = Object.assign({}, this.defaultItemGas);
      this.editadoGas.tercero_id         = null
      this.editadoGas.vencimiento        = moment().format('YYYY-MM-DD')
      this.editadoGas.proximovencimiento = moment().format('YYYY-MM-DD')
      this.editadoGas.observ             = null
      this.editadoGas.periodo            = moment().format('YYMM')
      this.editadoGas.iva_id             = 5
      this.editadoGas.gravado            = 0
      this.editadoGas.iva                = 0
      this.editadoGas.total              = 0
      this.editadoGas.pagado             = 0
      this.editadoGas.fiscal             = '1'
      this.editadoGas.comprobante_id     = null
      this.editadoGas.cpr                = ''
      this.dialogGasEdit                 = true
      this.gastoAgregaPeriodo            = false
      this.formTitleGas                  = 'Nuevo Gasto'
      this.gastoOk                       = false
    },

    gastoAgregarPeriodo(item) {
      return HTTP().get('/ultimacuota/'+item.tercero_id).then(({ data }) => {
        this.editedIndexGas = -1;
        let ven     = moment(data[0].vencimiento)
        let venprox = moment(data[0].proximovencimiento)
        let fec     = moment(data[0].proximovencimiento).format('YYYY-MM-DD')
        let dias    = venprox.diff(ven, 'days')
        let proxi   = moment(data[0].proximovencimiento,'YYYY-MM-DD').add(dias, 'day').format('YYYY-MM-DD')
        let cuota   = 0
        let cuotas  = 0
        this.editadoGas.tercero_id = item.tercero_id
        this.editadoGas.vencimiento = data[0].proximovencimiento.substr(0,10)
        this.editadoGas.proximovencimiento = proxi
        this.editadoGas.periodo = moment(fec).format('YYMM')
        if (this.periodosAbiertos.findIndex(x=>x==this.editadoGas.periodo) == -1) {
          this.editadoGas.periodo = this.periodosAbiertos[0]
        }

        if (data[0].observ!= null) {
          if (data[0].observ.substr(0,5) == 'CUOTA') {
            cuota  = Number(data[0].observ.substr(6,3))  //CUOTA  001/012 2020
            cuotas = Number(data[0].observ.substr(10,3)) //CUOTAS 001/012 2020
            cuota ++
            if (cuota>cuotas) {
              cuota = 1
            }
            this.editadoGas.cuota  = cuota
            this.editadoGas.cuotas = cuotas
            this.calculoCuotas()
          } else {
            this.editadoGas.observ = data[0].observ
          }
        }
        this.editadoGas.iva_id         = data[0].iva_id
        this.editadoGas.gravado        = data[0].gravado
        this.editadoGas.iva            = data[0].iva
        this.editadoGas.total          = data[0].total
        this.editadoGas.pagado         = 0
        this.editadoGas.fiscal         = data[0].fiscal.toString()
        this.editadoGas.comprobante_id = null
        this.editadoGas.cpr            = ''
        this.dialogGasEdit             = true
        this.gastoAgregaPeriodo        = true
        this.formTitleGas              = 'Nuevo Gasto'
        this.gastoOk = true
        this.$nextTick(() => {
          const f = this.$refs.refvencimiento;
          f.focus();
        });
      })
    },

    listarGasHTTP:function() {
      const a = HTTP().get('/usersgastos').then(({ data }) => {
        this.gastos = data;
      });
    },

    altaGasHTTP:function() {
      let per = '20'+this.editadoGas.periodo.substr(0,2)+this.editadoGas.periodo.substr(2,4)
      return HTTP().post('/usersgastos', {
        tercero_id: this.editadoGas.tercero_id,
        periodo: per,
        fiscal: this.editadoGas.fiscal == '1' ? 1 : 0,
        observ: this.editadoGas.observ,
        cpr: this.editadoGas.cpr,
        vencimiento: this.editadoGas.vencimiento,
        proximovencimiento: this.editadoGas.proximovencimiento,
        iva_id: this.editadoGas.iva_id,
        gravado: this.editadoGas.gravado,
        iva: this.editadoGas.iva,
        total: this.editadoGas.total }).then(({ data }) => {
        if (data=='duplicado') {
          this.msg.msgTitle = '¡Periodo Duplicado!'
          this.msg.msgBody  = 'Ya esta generado el período para este movimiento.' 
          this.msg.msgVisible = true
          this.msg.msgAccion = 'periodo duplicado'
          this.msg.msgButtons = ['Aceptar']
        } else if (data=='error') {
          this.mensaje('¡Se ha producido un error en la grabación del movimiento!', this.temas.forms_titulo_bg, 1500) 
        } else {
          this.mensaje('¡Alta Exitosa!', this.temas.forms_titulo_bg, 1500) 
        }
        this.listarGasHTTP();
      });
    },

    editarGasHTTP:function(data) {
      return HTTP().patch(`usersgastos/${data.id}`, data).then(() => {
        this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500) 
        this.listarGasHTTP();
      });       
    },

    borrarGasHTTP:function(id) {
      return HTTP().delete(`/usersgastos/${id}`).then(() => {
        this.listarGasHTTP();
      });
    },

    editarGas (item) {
      this.formTitleGas      = 'Editar Gasto'
      this.editedIndexGas    = this.gastos.indexOf(item)  // si this.editIndex es = -1 es una alta.
      this.editadoGas.cuota  = 0
      this.editadoGas.cuotas = 0
      if (item.observ.substr(0,5)=='CUOTA') {
        this.editadoGas.cuota  = Number(item.observ.substr(6,3))
        this.editadoGas.cuotas = Number(item.observ.substr(10,3))
      }
      this.editadoGas.id                 = item.id
      this.editadoGas.tercero_id         = item.tercero_id
      this.editadoGas.periodo            = item.periodo.substr(0,4)+item.periodo.substr(4,2)
      this.editadoGas.observ             = item.observ
      this.editadoGas.vencimiento        = moment(item.vencimiento).format('YYYY-MM-DD')
      this.editadoGas.proximovencimiento = moment(item.proximovencimiento).format('YYYY-MM-DD')
      this.editadoGas.fiscal             = item.fiscal.toString()
      this.editadoGas.iva_id             = item.iva_id
      this.editadoGas.gravado            = item.gravado
      this.editadoGas.iva                = item.iva
      this.editadoGas.total              = item.total
      this.editadoGas.cpr                = item.cpr
      this.dialogGasEdit                 = true
      this.gastoOk                       = true
    },

    preguntoBorrarGasto (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirmas borrar '+item.tercero.nombre+' ?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar gasto'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    preguntoBorrarFaltante (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Borra este aviso de faltante?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar faltante'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    preguntoProcesarGasto (item) {
      this.itemActualGasto = item
      this.msg.msgTitle = 'Generar Comprobante'
      let msg = '<br>Se generará un Comprobante para el Gasto<br><br>'
      msg += item.tercero.nombre+' '+item.observ+'<br><br>'
      msg += '¿Confirmas?<br><br>'
      this.msg.msgBody = msg
      this.msg.msgVisible = true
      this.msg.msgAccion = 'procesar gasto'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    borrarGasto (item) {
      const index = this.gastos.indexOf(item);
      this.borrarGasHTTP(this.gastos[index].id);
      this.mensaje('¡Se eliminó el registro.!', this.temas.forms_titulo_bg, 1500) 
    },

    cancelarGas() {
      this.dialogGasEdit  = false;
      this.editadoGas     = Object.assign({}, this.defaultItemGas);
      this.editedIndexGas = -1;
    },

    guardarGas() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', this.temas.forms_titulo_bg, 1500) 
        return this.dialogGasEdit = true;
      }
      if (this.editedIndexGas > -1) { // esta modificando
        this.id = this.editadoGas.id;
        this.editarGasHTTP(this.editadoGas);
      } else {
        this.altaGasHTTP();
      }
      this.cancelarGas();
    },

    calculoCuotas() {
      let observ = ''
      let cuota = this.editadoGas.cuota
      let cuotas = this.editadoGas.cuotas
      if ( Number(this.editadoGas.cuota)+Number(this.editadoGas.cuotas) > 0) {
        cuota  = '000'+cuota
        cuota  = cuota.slice(-3)
        cuotas = '000'+cuotas
        cuotas = cuotas.slice(-3)
        observ = 'CUOTA '+cuota+'/'+cuotas+' '
        observ += this.editadoGas.periodo.substr(0,4)
        //observ += this.editadoGas.periodo.substr(5,2)
      }
      this.editadoGas.observ = observ
    },

    procesarGastoHTTP(item) {
      let gravado     = 0
      let exento      = 0
      let iva         = 0
      let total       = item.total
      this.valores    = []
      this.articulos  = []
      let cpr         = ''
      let cpr_id      = 0
      if (item.fiscal==0) {
        if (item.cpr=='') {
          cpr = 'CIN-X'+' '+this.sucursalFiscal+'-'+'00000000'
        } else {
          cpr = item.cpr
        }
        cpr_id = 128
        exento = item.total
      } else {
        gravado = this.roundTo(total/1.21,2)
        iva = total - gravado
        if (item.cpr=='') {
          if (item.tercero.responsable_id == 1) {
            cpr = 'FAC-A'+' '+this.sucursalFiscal+'-'+'00000000'
            cpr_id = 1
          } else if (item.tercero.responsable_id == 6) {
            cpr = 'FAC-C'+' '+this.sucursalFiscal+'-'+'00000000'
            cpr_id = 14
          }
        } else {
          cpr = item.cpr
          if (item.cpr.substring(0,5)==='FAC-A') {
            cpr_id = 1
          } else if (item.cpr.substring(0,5)==='FAC-B') {
            cpr_id = 6
          } else if (item.cpr.substring(0,5)==='FAC-C') {
            cpr_id = 14
          }
        }
      }

      let per = item.periodo.substring(0,4)+'-'+item.periodo.substring(4,6)
      return HTTP().post('/nuevacompra', {
        fecha: moment(item.vencimiento).format('YYYY-MM-DD'),
        perfiscal: per,
        ctacte: true,
        vencimieto: moment(item.vencimiento).format('YYYY-MM-DD'),
        tipo: 'GS',
        cpr: cpr,
        user_id: this.userId,
        sucursal_id: this.sucursal,
        tercero_id: item.tercero_id,
        comprobante_id: cpr_id,
        direccion_id: item.tercero.direccion_id,
        documento_id: item.tercero.documento_id,
        mediodepago_id: 4,
        deposito_id: null,
        vendedor_id: null,
        moneda_id: this.editado.moneda_id,
        tasadescuento: 0,
        importedescuento: 0,
        retiva: 0,
        retgan: 0,
        retib: 0,
        gravado: gravado,
        exento: exento,
        iva: iva,
        impint: 0,
        nogravado: 0,
        flete: 0,
        poradcosto: 0,
        total: total,
        regstk: 0,
        estado: 'F',
        activo: true,
        articulos: this.articulos,
        observaciones: 'GASTO '+item.observ,
        valores: this.valores,
        notificacion: 0,
        gasto: this.itemActualGasto,
        tasasIVA: this.tasasIVA,
        idProv: null,
      }).then(({ data }) => {
        this.listarGasHTTP();
        this.listarHTTP();
      });
    },

    //////////////////////
    // METODOS DE ITEMS //
    //////////////////////
    nuevoArt() {
      this.editedIndexArt = -1;
      this.dialogEditArt = true;
      //this.busArt = this.busArtSave!='' ? this.busArtSave : ''
      this.busArt = ''
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.formTitleArt = 'Nuevo Item'
      this.seleccionarArticulo = false;
      //this.$refs.buscar.focus()
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },

    editarArt(item) {
      if (this.borrarItemClick) {
        this.borrarItemClick = false
        return
      }
      this.formTitleArt = 'Editar Item'
      this.seleccionarArticulo = false;
      this.editedIndexArt = this.articulos.indexOf(item)
      this.dialogEditArt = true
      this.busArt = ''
      debugger
      if (this.articulos.indexOf(item)!=-1) {
        if (this.codigooid=='I') {
          this.busArt = this.articulos[this.articulos.indexOf(item)].articulo_id.toString()
        } else {
          this.busArt = this.articulos[this.articulos.indexOf(item)].codigo
        }
      }
      // ACA ESTA EL MOCO, articulos{} deberia ser igual que editadoArt{}
      this.editadoArt.id               = this.articulos[this.editedIndexArt].id
      this.editadoArt.articulo_id      = this.articulos[this.editedIndexArt].articulo_id
      this.editadoArt.codigo           = this.articulos[this.editedIndexArt].codigo
      this.editadoArt.nombre           = this.articulos[this.editedIndexArt].nombre
      this.editadoArt.deposito_id      = this.articulos[this.editedIndexArt].deposito_id
      this.editadoArt.unidad_id        = this.articulos[this.editedIndexArt].unidad_id
      this.editadoArt.moneda_id        = this.articulos[this.editedIndexArt].moneda_id
      this.editadoArt.iva_id           = this.articulos[this.editedIndexArt].iva_id
      this.editadoArt.cantidad         = this.articulos[this.editedIndexArt].cantidad
      this.editadoArt.stock            = this.articulos[this.editedIndexArt].stock
      this.editadoArt.undstock         = this.articulos[this.editedIndexArt].undstock
      this.editadoArt.costo            = this.articulos[this.editedIndexArt].costo
      this.editadoArt.costoanterior    = this.articulos[this.editedIndexArt].costoanterior
      this.editadoArt.precio           = this.articulos[this.editedIndexArt].precio
      this.editadoArt.preciooriginal   = this.articulos[this.editedIndexArt].preciooriginal
      this.editadoArt.tasadescuento    = this.articulos[this.editedIndexArt].tasadescuento
      this.editadoArt.importedescuento = this.articulos[this.editedIndexArt].importedescuento
      this.editadoArt.total            = this.articulos[this.editedIndexArt].total
      this.editadoArt.texto            = this.articulos[this.editedIndexArt].texto
      this.editadoArt.desc1            = this.articulos[this.editedIndexArt].desc1
      this.editadoArt.desc2            = this.articulos[this.editedIndexArt].desc2
      this.buscarArt()
    },

    sumarRestar(item, cuanto) {
      this.editedIndexArt = this.articulos.indexOf(item)
      if (cuanto==-1 && this.articulos[this.editedIndexArt].cantidad==0) {
        return
      }
      let valor = Number(this.articulos[this.editedIndexArt].cantidad)
      valor += cuanto
      this.articulos[this.editedIndexArt].cantidad = valor
      if (this.editado.cpr.substring(0,3)=='PED') {
        this.articulos[this.editedIndexArt].total = this.articulos[this.editedIndexArt].precio*this.articulos[this.editedIndexArt].cantidad
      } else {
        this.articulos[this.editedIndexArt].total = this.articulos[this.editedIndexArt].costo*this.articulos[this.editedIndexArt].cantidad
      }
      this.calculosArt()
    },

    guardarArt(items) { // CONFIRMA EL GUARDADO EN LA BASE DE DATOS
      this.dialogArt = false;
      debugger
      return HTTP().patch('/updateitems/'+this.items[this.editedIndex].id, { articulos: this.articulos }).then(({ data }) => {
        if (data=='error') {
          this.mensaje('¡Se ha producido un error en la grabación de los items!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Items acutalizados correctamente!', this.temas.forms_titulo_bg, 1500)
        }
        this.listarHTTP();
      });
    },

    cancelarArt() {
      this.dialogArt = false;
      this.articulos = []
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndexArt = -1;
    },

    cancelarEditArt() {
      this.dialogEditArt = false;
      this.editedIndexArt = -1;
    },

    calculosArt() {
      this.totalItems = 0
      for (let i=0; i<=this.articulos.length-1; i++) {
        let ctt = this.articulos[i].cantidad
        let costo = this.articulos[i].costo
        let decimales = this.articulos[i].decimales
        let precio = this.articulos[i].precio
        let tasdes = this.articulos[i].tasadescuento
        let impdes = (precio*(tasdes/100))
        precio = this.roundTo(precio,5)
        impdes = this.roundTo(impdes,5)
        if (this.editado.cpr.substring(0,3)=='PED') {
          this.totalItems += this.roundTo((precio-impdes)*ctt,2)
        } else {
          this.totalItems += this.roundTo((costo-impdes)*ctt,2)
        }
      }
      this.diferencia = this.roundTo(this.totalCabecera - this.totalItems,2)
    },

    cargarArtPed(item) {
      this.isLoadingTerceros = true
      if (item.tercero.user==null) {
        this.proveedorVinculado = this.userId //0
      } else {
        this.proveedorVinculado = item.tercero.user.id          // ver que viene
      }
      this.headersArt[3].text  = 'Precio'
      this.headersArt[3].value = 'precio'
      this.editedIndex = this.items.findIndex(x=>x.id==item.id)
      this.editado = this.items[this.editedIndex]
      this.totalCabecera = item.gravado+item.exento
      this.cpr = item.cpr
      this.dialogArt = true;
      this.articulos = [];
      this.editarItems = true

      // OJO, debo buscar el proveedor para sacar los precios, pero si es mayorista, el proveedor es el mismo
      let proveedor = item.tercero.user ? item.tercero.user.id : this.userId

      // CARGO LOS items en un array para buscarlos en articuloz
      let arts = []
      for (let i=0; i<=item.items.length-1; i++) {
        arts.push(item.items[i].articulo_id)
      }

      return HTTP().post('/articuloz', {
        search: arts,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: proveedor, stockProv: true, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: this.$store.state.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: 300 }).then(({ data })=>{
        this.totalItems = 0

        debugger
        for (let i=0; i<=item.items.length-1; i++) {

          // el proveedor puede haber cambiado el precio
          // la consulta trae el preload de articulos y precios ( siempre actualizados )
          // por ello cuando edito el pedido cargo estos precios reemplazando los de la base de datos.

          let max = data[i].precios[0].ofeunidades
          let pos = data.findIndex(x=>x.id==item.items[i].articulo_id)
          let ctt = item.items[i].cantidad
          let costo = 0
          let precio = 0
          let tasdes = 0
          let impdes = 0

          costo = data[pos].precios[0].costo
          precio = data[pos].precios[0].costo //precio
          tasdes = data[pos].precios[0].ofetasadescuento
          impdes = (precio*(tasdes/100))

          let decimales = data[pos].precios[0].decimales
          let total = 0
          precio = this.roundTo(precio,decimales)
          impdes = this.roundTo(impdes,decimales)
          total = this.roundTo((precio-impdes)*ctt,decimales)
          impdes = this.roundTo(impdes*ctt,decimales)

          this.articulos.push({ 
            index: i,
            id: data[i].id,
            itemId: item.items[i].id,
            comprobante_id: item.comprobante_id,
            articulo_id: item.items[i].articulo_id,
            codigo: item.items[i].articulo.codigo,
            nombre: item.items[i].articulo.nombre,
            deposito_id: item.items[i].deposito_id,
            unidad_id: item.items[i].unidad_id,
            moneda_id: item.items[i].moneda_id,
            iva_id: item.items[i].iva_id,
            ivatasa: item.items[i].articulo.iva.nombre,
            cantidad: Number(item.items[i].cantidad),
            stock: Number(item.items[i].stock),
            costoanterior: this.roundTo(item.items[i].costoanterior,5),
            costo: this.roundTo(costo,5),
            precio: precio,
            preciooriginal: precio,
            tasadescuento: tasdes,
            importedescuento: impdes,
            total: total,
            decimales: decimales,
            texto: item.items[i].texto,
            vencimiento: '',
            esPromocion: item.items[i].texto=='Promocion' ? true : false,
            cantidadMaxima: max,
            cantidadCarrito: max,
            estado: 'edit',
            undstock: item.items[i].articulo.undstock,
            desc1: data[pos].precios[0].desc1,
            desc2: data[pos].precios[0].desc2,
          })
        }
        if (this.itemActual.tercero.user!=undefined) {
          return HTTP().get('/leoelusertercero/'+this.itemActual.tercero.user.id+'/'+this.datosEmpresa.id).then(({ data }) => {
            if (data!=0) {
              this.calculosArt()
            }
          })
        } else {
          this.calculosArt()
        }
      })
    },

    cargarArtCom(item) {
      debugger
      this.isLoadingTerceros = true
      if (item.tercero.user==null) {
        this.proveedorVinculado = this.userId //0
      } else {
        this.proveedorVinculado = item.tercero.user.id          // ver que viene
      }
      this.headersArt[3].text  = 'Costo'
      this.headersArt[3].value = 'costo'
      this.editedIndex = this.items.findIndex(x=>x.id==item.id)
      this.editado = this.items[this.editedIndex]
      this.totalCabecera = item.gravado+item.exento
      this.cpr = item.cpr
      this.dialogArt = true;
      this.articulos = [];
      this.editarItems = true

      for (let i=0; i<=item.items.length-1; i++) {

        // EL usuario esta cargando un comprobante de Compras fisico, en papel.
        // Por lo tanto no hago ningun calculo, solo levanto lo que el usuario cargo.
        let ctt = item.items[i].cantidad
        debugger
        let decimales = item.items[i].articulo.precios[0].decimales
        this.articulos.push({ 
          index:            i,
          id:               item.items[i].id,
          itemId:           item.items[i].id,
          comprobante_id:   item.comprobante_id,
          articulo_id:      item.items[i].articulo_id,
          codigo:           item.items[i].articulo.codigo,
          nombre:           item.items[i].articulo.nombre,
          deposito_id:      item.items[i].deposito_id,
          unidad_id:        item.items[i].unidad_id,
          moneda_id:        item.items[i].moneda_id,
          iva_id:           item.items[i].iva_id,
          ivatasa:          item.items[i].articulo.iva.nombre,
          cantidad:         Number(item.items[i].cantidad),
          stock:            Number(item.items[i].stock),
          costoanterior:    this.roundTo(item.items[i].costoanterior,5),
          costo:            this.roundTo(item.items[i].costo,5),
          precio:           this.roundTo(item.items[i].precio,5),
          preciooriginal:   this.roundTo(item.items[i].precio,5),
          tasadescuento:    item.items[i].tasadescuento,
          importedescuento: item.items[i].importedescuento,
          total:            item.items[i].total,
          decimales:        decimales,
          texto:            item.items[i].texto,
          vencimiento:      '',
          esPromocion:      false,
          cantidadMaxima:   0,
          cantidadCarrito:  0,
          estado:           'edit',
          undstock:         item.items[i].articulo.undstock,
          desc1:            item.items[i].desc1,
          desc2:            item.items[i].desc2,
        })
        debugger
        //this.totalItems += item.items[i].total
      }
      this.calculosArt()
    },

    buscarArt() {
      if (this.busArt == '') return
      this.precioOrigen = 'Lista'
      this.precioDescuento = 0
      let ambiente = 'compras'
      let ofeprecio = 0
      let ofetasdes = 0
      let ofeenvio = 0
      let ofeunidades = 0
      let ofeestado = 0
      let proveedor = this.itemActual.tercero.user ? this.itemActual.tercero.user.id : this.userId
      return HTTP().post('/articuloz', {
        search: this.busArt,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: proveedor, stockProv: true, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: this.cttLoadReg }).then(({ data })=>{
        let data1 = data
        if (data1.length===0) {
          this.mensaje('¡Codigo inexistente!', this.temas.forms_titulo_bg, 1000)
          this.$nextTick(() => {
            const f = this.$refs.buscar;
            f.focus();
          });
          return
        }
        // INICIALIZO VALORES DE DESCUENTOS Y PRIMERA ASIGNACION. LUEGO CONTROLO X CANTIDAD
        if (data1.length==1) {
          let pos = this.articulos.findIndex(x=>x.codigo==data1[0].codigo)
          let pre = 0      // SI ES PEDIDO, precio = precio ELSE precio = costo
          let ofe = false  // BANDERA PARA SABER SI ENCONTRO OFERTAS
          if (this.editado.cpr.substring(0,3)=='PED') {
            if (data1[0].precios[0].ofeestado=='A') {
              ofe = true
              ofeprecio = data1[0].precios[0].costo
              ofetasdes = data1[0].precios[0].ofetasadescuento
              ofeenvio = 0
              ofeunidades = data1[0].precios[0].ofeunidades
              ofeestado = data1[0].precios[0].ofeestado
              pre = ofeprecio
            }
            if (!ofe) {
              pre = pos==-1 ? data1[0].precios[0].costo : this.articulos[pos].costo
              if (data1[0].precios[0].ofetasadescuento!=0) {
                pre = data1[0].precios[0].costo
              }
            }
          }
          if (!ofe) {
            pre = pos==-1 ? data1[0].precios[0].costo : this.articulos[pos].costo
          }
          let ctt = pos==-1 ? 1 : this.articulos[pos].cantidad
          let datos = {
            codigo:           data1[0].codigo,
            articulo_id:      data1[0].id,
            cantidad:         ctt,
            nombre:           data1[0].nombre,
            codbar:           data1[0].precios[0].codbar,
            unidad_id:        data1[0].unidad_id,
            moneda_id:        data1[0].moneda_id,
            iva_id:           data1[0].iva_id,
            monedaNombre:     data1[0].simbolo,
            unidadNombre:     data1[0].unimed,
            ivaNombre:        data1[0].tasa+'%',
            costoanterior:    this.roundTo(data1[0].precios[0].precio, 5),
            costo:            this.roundTo(pre, 5),
            precio:           this.roundTo(pre, data1[0].precios[0].decimales),
            preciooriginal:   this.roundTo(data1[0].preciooriginal, data1[0].decimales),
            decimales:        data1[0].precios[0].decimales,
            tasadescuento:    0,
            importedescuento: 0,
            total:            this.roundTo(pre*ctt,data1[0].precios[0].decimales),
            deposito_id:      this.depItems[0].id,
            stock:            data1[0].stock,
            undstock:         data1[0].undstock,
            texto:            '',
            ofeprecio:        ofeprecio,
            ofetasdes:        ofetasdes,
            ofeenvio:         ofeenvio,
            ofeunidades:      ofeunidades,
            ofeestado:        ofeestado,
            desc1:            data1[0].precios[0].desc1,
            desc2:            data1[0].precios[0].desc2,
          }
          this.setItem('inicia', datos)
        } else if (data1.length>1) {
          this.selArt = []
          for (let i=0; i<=data1.length-1; i++) {
            let costo = (this.editado.cpr.substring(0,3)=='PED') ? data1[i].precios[0].costo : data1[i].precios[0].costo
            // al costo tengo que restarle el poradcosto
            if (this.editado.poradcosto>0) {
              costo = this.roundTo(( costo / (1+(this.editado.poradcosto/100)) ),4)
            }
            costo = this.roundTo(costo, data1[i].precios[0].decimales)
            this.selArt.push({
              id:                data1[i].id,
              codigo:            data1[i].codigo,
              articulo_id:       data1[i].id,
              nombre:            data1[i].nombre,
              codbar:            data1[i].precios[0].codbar,
              unidad_id:         data1[i].unidad_id,
              moneda_id:         data1[i].moneda_id,
              iva_id:            data1[i].iva_id,
              monedaNombre:      data1[i].simbolo,
              unidadNombre:      data1[i].unimed,
              ivaNombre:         data1[i].tasa+'%',
              costo:             costo,
              precio:            data1[i].precios[0].precio,
              tasadesuento:      0,
              importedescuento:  0,
              deposito_id:       this.depItems[0].id,
              stock:             data1[i].stock == null ? 0 : data1[i].stock,
              undstock:          data1[i].undstock
            })
          }
          this.seleccionarArticulo = true;
        }
        this.cambioElPrecio = ''
        return HTTP().post('/cambioelprecio', { id: data1[0].id } ).then(({ data }) => {
          if (data>0) {
            this.cambioElPrecio = data
          }
        })
      })
    },

    setItem(accion, dat) {
      // ESTE METODO SETEA Y ACTUALIZA EL ITEM.
      // INICIALIZO VALORES DE DESCUENTOS Y PRIMERA ASIGNACION. LUEGO CONTROLO X CANTIDAD
      debugger
      let cualDesc = [
        {descual: 'Lista', pordes: 0},
        {descual: 'Promocion', pordes: 0},
      ]
      let descual = 'Lista'
      this.precioOrigen = 'Lista'
      this.promoDescuento = dat.ofetasdes ? dat.ofetasdes : 0
      // QUE DESUENTO TOMO?, puede ser el de la promo
      if (dat.ofeprecio && dat.ofeestado=='A' && dat.ofeunidades>0 && this.editado.cpr.substring(0,3)=='PED') {
        descual = 'Promocion'
      }
      let pordes = 0
      if (descual=='Promocion') {
        pordes = this.promoDescuento
      } else if (descual=='Lista') {
        pordes = Number(this.editadoArt.tasadescuento)
      }
      let impdes = 0
      // al costo tengo que restarle el poradcosto
      let costo = this.roundTo(dat.precio, dat.decimales) // costo
      if (this.editado.poradcosto>0) {
        costo = this.roundTo(( costo / (1+(this.editado.poradcosto/100)) ),4)
      }
      if (accion=='inicia') {
        impdes = this.roundTo((dat.precio*dat.cantidad)*(pordes/100),dat.decimales)
        this.articulos = this.articulos.filter( x => x.codigo != dat.codigo)
        this.editadoArt.codigo           = dat.codigo;
        this.editadoArt.articulo_id      = dat.articulo_id;
        this.editadoArt.cantidad         = dat.cantidad;
        this.editadoArt.nombre           = dat.nombre;
        this.editadoArt.codbar           = dat.codbar;
        this.editadoArt.unidad_id        = dat.unidad_id
        this.editadoArt.moneda_id        = dat.moneda_id
        this.editadoArt.iva_id           = dat.iva_id
        this.editadoArt.monedaNombre     = dat.simbolo
        this.editadoArt.unidadNombre     = dat.unimed
        this.editadoArt.ivaNombre        = dat.ivaNombre
        this.editadoArt.costoanterior    = this.roundTo(dat.precio, 5)
        this.editadoArt.costo            = this.roundTo(dat.costo, 5)
        this.editadoArt.precio           = this.roundTo(dat.precio, dat.decimales)
        this.editadoArt.preciooriginal   = this.roundTo(dat.preciooriginal, dat.decimales)
        this.editadoArt.decimales        = dat.decimales
        this.editadoArt.tasadescuento    = pordes
        this.editadoArt.importedescuento = impdes
        this.editadoArt.total            = this.roundTo((dat.precio*dat.cantidad)-impdes,dat.decimales)
        this.editadoArt.deposito_id      = this.depItems[0].id
        this.editadoArt.stock            = dat.stock
        this.editadoArt.undstock         = dat.undstock
        this.editadoArt.texto            = descual
        this.editadoArt.ofeprecio        = dat.ofeprecio
        this.editadoArt.ofetasdes        = dat.ofetasdes    // hev021
        this.editadoArt.ofeenvio         = dat.ofeenvio
        this.editadoArt.ofeunidades      = dat.ofeunidades
        this.editadoArt.ofeestado        = dat.ofeestado
        this.editadoArt.desc1            = dat.desc1
        this.editadoArt.desc2            = dat.desc2

        // busco si aplica promocion para el articulo ingresado
        if (descual=='Promocion') {
          this.editadoArt.ofeprecio        = dat.ofeprecio
          this.editadoArt.ofetasdes        = dat.ofetasdes
          this.editadoArt.ofeenvio         = dat.ofeenvio
          this.editadoArt.ofeunidades      = dat.ofeunidades
          this.editadoArt.ofeestado        = dat.ofeestado
          this.editadoArt.importedescuento = impdes
          this.editadoArt.tasadescuento    = dat.ofetasdes
          this.editadoArt.costo            = dat.ofeprecio
          this.editadoArt.total            = dat.ofeprecio
        }

        this.$refs.cantidad.focus()
        this.seleccionarArticulo = false

      } else if (accion=='guardar') {

        this.editadoArt.texto = descual
        //this.editadoArt.tasadescuento = pordes

        let ctt = Number(dat.cantidad)
        let pre = this.editado.cpr.substring(0,3)==='PED' ? Number(dat.precio) : Number(dat.costo)
        let txt = dat.texto

        // COMO TOMO LOS PRECIOS?
        // En 'texto' viene que precio leyo: 'Lista' o 'Promocion'
        // Puede ser una Compra normal o un pedido, compra normal tomo lista.
        // en pedidos tomo lista y promociones.

        // OJO, SI ES PEDIDO HAGO CONTROL DE PROMOCIONES, SI ES FACTURA DE COMPRA CARGO NORMAL.
        if (this.editado.cpr.substring(0,3)==='PED') {
          if (txt=='Promocion') {
            if ((ctt > dat.ofeunidades) && (dat.ofeunidades>0)) {
              this.actualizoItem(dat.ofeunidades, pre, true)
              dat.texto = 'Lista'
              this.editadoArt.tasadescuento = 0
              this.actualizoItem(ctt-dat.ofeunidades, pre, false)  
            } else {
              this.actualizoItem(ctt, pre, true)
            }
          } else {
            this.actualizoItem(ctt, pre, false)
          }
        } else {
          this.actualizoItem(ctt, pre, false)
        }
      }
    },

    guardarItem() {
      debugger
      if (this.editadoArt.cantidad == 0) {
        this.$nextTick(() => {
          const f = this.$refs.cant;
          f.focus();
        });
        return 
      } else if (this.editadoArt.codigo == '') {
        this.$nextTick(() => {
          const f = this.$refs.buscar;
          f.focus();
        });
        return 
      }

      this.setItem('guardar', this.editadoArt)
      this.calculos()
      this.nuevoArt()
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },


    actualizoItem(ctt, pre, promo) {
      let pordes = 0
      let impdes = 0
      if (this.editadoArt.texto=='Promocion'&&promo) {
        pordes = this.promoDescuento
      } else if (this.editadoArt.texto=='Lista'&&!promo) {
        pordes = Number(this.editadoArt.tasadescuento)
      }
      impdes = (Number(ctt)*pre) * (pordes/100)
      // busco el proximo id para que sea unico
      let proxId = 1
      if (this.articulos.length) {
        proxId = Math.max.apply(Math, this.articulos.map(o => o.index))+1;
      }
      this.articulos.unshift({
        index:            proxId,
        id:               'nuevo'+proxId,
        itemId:           'nuevo'+proxId,
        comprobante_id:   null,
        articulo_id:      this.editadoArt.articulo_id,
        codigo:           this.editadoArt.codigo,
        nombre:           this.editadoArt.nombre,
        deposito_id:      this.editadoArt.deposito_id,
        unidad_id:        this.editadoArt.unidad_id,
        moneda_id:        this.editadoArt.moneda_id,
        iva_id:           this.editadoArt.iva_id,
        ivatasa:          this.editadoArt.ivaNombre,
        cantidad:         Number(ctt),
        stock:            Number(ctt),
        costoanterior:    this.editadoArt.costoanterior,
        costo:            pre, //this.editadoArt.costo,
        precio:           pre,
        preciooriginal:   this.editadoArt.preciooriginal,
        tasadescuento:    pordes,
        importedescuento: impdes,
        total:            (Number(ctt)*pre)-impdes,
        texto:            this.editadoArt.texto,
        vencimiento:      '',
        esPromocion:      promo,
        cantidadMaxima:   0,
        cantidadCarrito:  0,
        estado:           'new',
        undstock:         this.editadoArt.undstock,
        desc1:            this.editadoArt.desc1,
        desc2:            this.editadoArt.desc2,
      })
    },

    sayCambioElPrecio() {
      this.msg.msgTitle = 'Cambio el Precio'
      let msg = 'Este artículo cambio de precio pero todavía no fue procesado.<br><br>'
      msg += 'Ingrese a la opción "Cambios de Precios" del menú "Artículos"<br>'
      msg += 'para procesar dicho cambio o continúe con el precio indicado.'
      this.msg.msgBody = msg
      this.msg.msgVisible = true
      this.msg.msgAccion = 'cambio el precio'
      this.msg.msgButtons = ['Aceptar']
    },

    selArtClick (item, row) {
      this.seleccionarArticulo = false;
      this.busArt = item.codigo
      this.buscarArt(true)
      this.$refs.cantidad.focus()
    },

    borrarItem(item) {
      this.borrarItemClick = true
      this.busArt = ''
      let pos = this.articulos.indexOf(item)
      this.articulos.splice(pos,1);
      this.calculosArt()
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },

    borrarArt(item) {
      this.msg.msgTitle = 'Borrar Item'
      this.msg.msgBody = 'Desea borrar el item actual?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },

    buscoPrecio(idArt) {
      return HTTP().get('/precios/'+idArt+'/'+idLis)
        .then(({ data }) => {
          return data.precio
      })
    },

    cantidadItem() {
      // aca viene solo cuando es carga de compras, tomo el costo
      this.editadoArt.stock = Number(this.editadoArt.cantidad)
      this.editadoArt.undstock = Number(this.editadoArt.cantidad)*Number(this.editadoArt.undstock)
      this.editadoArt.importedescuento = (Number(this.editadoArt.cantidad)*(this.roundTo((Number(this.editadoArt.preciooriginal)-Number(this.editadoArt.costo)),2)))
      this.editadoArt.total = this.roundTo((Number(this.editadoArt.cantidad)*Number(this.editadoArt.costo)),2)
      return this.editadoArt.total
    },

    precioItem(cual) {
      let valor = cual=='costo' ? Number(this.editadoArt.costo) : Number(this.editadoArt.precio)
      this.editadoArt.stock = Number(this.editadoArt.cantidad)
      this.editadoArt.undstock = Number(this.editadoArt.cantidad)*Number(this.editadoArt.undstock)
      this.editadoArt.total = this.roundTo((Number(this.editadoArt.cantidad)*valor),2)
      return this.editadoArt.total
    },

    tasaDescuento() {
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.costo)
      let tde = Number(this.editadoArt.tasadescuento)
      let ide = this.roundTo((ctt*pre),2)*(tde/100)
      this.editadoArt.importedescuento = ide
      this.editadoArt.total = this.roundTo(((ctt*pre)-ide),2)
      return this.editadoArt.total
    },

    importeDescuento() {
      let tde = this.roundTo((Number(this.editadoArt.importedescuento)/Number(this.editadoArt.total))*100,2)
      let tot = this.roundTo(Number(this.editadoArt.total)-Number(this.editadoArt.importedescuento),2)
      debugger
      this.editadoArt.tasadescuento = tde
      this.editadoArt.total = tot
      return this.editadoArt.total
    },

    descuentoCabecera(cual) {
      if (cual=='tasa') {
        this.editado.importedescuento = this.roundTo(this.editado.gravado*(this.editado.tasadescuento/100),2)
      } else {
        this.editado.tasadescuento = this.roundTo((this.editado.importedescuento*100)/this.editado.gravado,2)
      }
    },

    importarDesde(donde) {
      this.importarDesdeFormato = donde
      this.dialogImportarDesde = true
    },

    cargarXls() {
      if (this.importarDesdeFormato=='Excel') {
        if (this.excel.name != undefined) {
          try {
            this.progress = true
            this.xlsCargado = true;
            let file = this.excel;
            let reader = new FileReader();
  
            this.codigos = []
            this.compraExcel = []
            reader.onload = async function (e) {
              let data = new Uint8Array(e.target.result);
              let workbook = XLSX.read(data, { type: "array" });
              let worksheet = workbook.Sheets[workbook.SheetNames[0]];
              let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              let dataset = await this.parseFileContent(sheet);
            }.bind(this);
            reader.readAsArrayBuffer(file);
  
            return HTTP().post('compraexcelitems/', { items: this.compraExcel.items }).then(({ data }) => {
              if (data=='error') {
              } else {
                return HTTP().post('compraexcelitems/', { items: this.compraExcel.items }).then(({data}) => {
                  this.codigos = data
                  for (let i=0; i<=this.codigos.length-1; i++) {
                    this.compraExcel.items[i].micodigo = this.codigos[i].micodigo
                  }
                  this.progress = false
                })
              }
            })
          } catch (exception) {
          }
        } else {
          this.xlsCargado = false;
        }
      } else if (this.importarDesdeFormato=='PDF') {
        if (this.excel.name != undefined) {
          try {
            this.progress = true
            this.xlsCargado = true;
            let doc = new jsPDF(this.excel)
            let content = doc.output()
            content = content.replace(/\s+/g, " ");
            console.log(content)
          } catch (exception) {
          }
        }
      }
    },

    async parseFileContent(sheet) {
      let r = sheet[0]
      this.compraExcel.cuit       = sheet[0][1]
      this.compraExcel.fecha      = moment(sheet[1[1]]).format('YYYY/MM/DD')
      this.compraExcel.perfiscal  = sheet[2][1]
      this.compraExcel.tipcpr     = sheet[3][1]
      this.compraExcel.succpr     = sheet[4][1]
      this.compraExcel.nrocpr     = sheet[5][1]
      this.compraExcel.moneda     = sheet[6][1]
      this.compraExcel.totalitems = sheet[7][1]
      this.compraExcel.tasades    = sheet[8][1]
      this.compraExcel.impdes     = sheet[9][1]
      this.compraExcel.retiva     = sheet[10][1]
      this.compraExcel.retgan     = sheet[11][1]
      this.compraExcel.retib      = sheet[12][1]
      this.compraExcel.impint     = sheet[13][1]
      this.compraExcel.nogravado  = sheet[14][1]
      this.compraExcel.flete      = sheet[15][1]
      this.compraExcel.gravado    = sheet[16][1]
      this.compraExcel.exento     = sheet[17][1]
      this.compraExcel.iva        = sheet[18][1]
      this.compraExcel.total      = sheet[19][1]
      this.compraExcel.items      = []

      let lDone = true
      let i = 1
      while (lDone) {
        if (sheet[i][3]!=undefined) {
          this.compraExcel.items.push({
            codigo:   sheet[i][3],
            micodigo: sheet[i][3],
            nombre:   sheet[i][4],
            precio:   this.roundTo(sheet[i][5],2),
            tasdes:   this.roundTo(sheet[i][6],2),
            impdes:   this.roundTo(sheet[i][7],2),
            subtot:   this.roundTo(sheet[i][8],2),
            cantidad: this.roundTo(sheet[i][9],2),
            total:    this.roundTo(sheet[i][10],2),
            tasaIVA:  sheet[i][11]
          })
          i ++
        } else {
          lDone = false
        }
      }
    },

    //////////////////////////////
    // METODOS FUNCIONES VARIAS //
    //////////////////////////////
    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },

    getColorTotal (item) {
     return this.temas.barra_lateral_bg
    },

    getEstado (estado, accion, carga, item) {
      let c = ''
      let e = ''
      if (accion=='k') {
        if (estado==='P') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='T') {
          return this.temas.cen_estado_facturado_dark 
        } else if (estado==='H') {
          return this.temas.cen_estado_enembalaje_dark
        } else if (estado==='B') {
          return this.temas.cen_estado_embalado_dark
        } else if (estado==='E' && item.cpr.substr(0,3)=='PED') {
          return this.temas.cen_estado_enviado_dark
        } else if (estado==='F') {
          return this.temas.cen_estado_finalizado_dark
        } else if (estado==='A') {
          return this.temas.cen_estado_anulado_dark
        } else if (estado==='L') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='V') {
          return this.temas.cen_estado_enviado_dark
        } else {
          return this.temas.cen_estado_pendiente_dark
        }
      }
      if (estado==='P') {
        e = 'Pendiente'
        c = this.temas.cen_estado_pendiente_bg
      } else if (estado==='T') {
        e = 'Facturado'
        c = this.temas.cen_estado_facturado_bg
      } else if (estado==='E') {
        e = 'En camino'
        c = this.temas.cen_estado_enviado_bg
      } else if (estado==='I') {
        e = 'Retirado'
        c = this.temas.cen_estado_enviado_bg
      } else if (estado==='F') {
        e = 'Finalizado'
        c = this.temas.cen_estado_finalizado_bg
      } else if (estado==='V') {
        e = 'Enviado'
        c = this.temas.cen_estado_enviado_bg
      } else if (estado==='A') {
        e = 'Anulado'
        c = this.temas.cen_estado_anulado_bg
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoImporteDec(valor, dec) {
      let val = (valor/1).toFixed(dec).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{dec})+(?!\d))/g, ".")
    },

    formatoFecha(value) {
      return moment(String(value)).format('L')
    },

    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },

    fechaTimeLine(value) {
      return moment(String(value)).format('D MMM-YY h:mm a')
    },

    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = 'compras'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrarItem(this.itemActual)
        } else if (this.msg.msgAccion=='borrar gasto') {
          this.borrarGasto(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          this.exportExcel() 
        } else if (this.msg.msgAccion=='Enviar Pedido') {
          this.enviarPedidoHTTP(this.itemActual) 
        } else if (this.msg.msgAccion=='finalizar comprobante') {
          this.finalizaCompra(this.itemActual) 
        } else if (this.msg.msgAccion=='Comprobante Finalizado') {
          this.listarHTTP()
        } else if (this.msg.msgAccion=='el comprobante ya existe') {
          this.$refs.afipNro.focus()
        } else if (this.msg.msgAccion=='pagar comprobante') {
          this.nuevoPagoHTTP(this.editado) 
        } else if (this.msg.msgAccion=='confirmar valores') {
          this.dialogPag = false
        } else if (this.msg.msgAccion=='procesar gasto') {
          this.procesarGastoHTTP(this.itemActualGasto) 
        } else if (this.msg.msgAccion=='proveedor vinculado') {
          this.$refs.proveedor.focus()
        } else if (this.msg.msgAccion=='borrar comprobante') {
          this.borrarHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='anular pago') {
          this.anularPagoHTTP()
        } else if (this.msg.msgAccion=='anular pedido') {
          this.anularPedidoHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='anular comprobante') {
          this.anularComprobanteHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='arreglar pedido') {
          this.arreglarPedidoHTTP()
        }
      }
      this.msg.msgVisible = false;
    },

    fotoClick() {
      this.foto = this.foto.name == undefined ? this.foto.name : this.foto
    },

    importada(item) {
      if (item==undefined) return false
      if (item==null) return false
      return item.observaciones=='COMPROBANTE DESCARGADO' ? true : false
    },

    estaElGastoOk() {
      this.gastoOk = true
      if (!this.editadoGas.tercero_id || !this.editadoGas.vencimiento || this.editadoGas.total<=0) {
        this.gastoOk = false
      }
    },

    calculoElGasto() {
      let p = this.editadoGas.iva_id.afipiva_id!=undefined ? this.editadoGas.iva_id.afipiva_id : this.editadoGas.iva_id
      let pos = this.tasasIVA.findIndex( x => x.afipiva_id == p)
      this.editadoGas.iva = this.roundTo(Number(this.editadoGas.gravado)*((this.tasasIVA[pos].tasa)/100),2)
      this.editadoGas.total = this.roundTo(Number(this.editadoGas.gravado) + Number(this.editadoGas.iva),2)
      this.estaElGastoOk()
    },

    cambioElVencimiento() {
      this.editadoGas.periodo = moment(this.editadoGas.vencimiento).format('YYMM')
    },

    cancelaLinea() {
      this.nuevoArt()
      this.busArt = ''
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },

    estadoDelMes(value) {
      let pos = this.losMeses.findIndex(x=>x==value)+1
      let mes = pos.toString().padStart(2,'0')
      let per = this.anio+mes
      pos = this.periodos.findIndex(x=>x.per==per)
      return this.periodos[pos].cerrado?'mdi-18px mdi-lock-outline':'mdi-18px mdi-lock-open-outline'
    },

    mensaje(mensaje, color, tiempo, button) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    exportarAPDF() {
      this.msg.msgTitle = 'Exportar a PDF'
      this.msg.msgBody = 'Desea exportar los datos a PDF'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a PDF'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    exportarAXLS () {
      this.msg.msgTitle = 'Exportar a XLS'
      this.msg.msgBody = 'Desea exportar los datos a XLS'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a XLS'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    print(item) {
      this.$refs.impresion.comprasPrint(item, 'yo');  // estaba 'desdeCompras'
    },

    printDetalles(item) {
      this.$refs.impresion.comprasPrintDetalles(item);
    },

    getCellStyles(value) {
      let color = this.dark?'white':'black'; // Puedes cambiar esto según tus necesidades
      let fontWeight = 'normal'; // Puedes cambiar esto según tus necesidades
      if (value.selected) { color = 'green'; fontWeight = 'bold'; }
      return { align: 'end', color: color, fontWeight: fontWeight, };
    },

  },
};
</script>

<style scoped>
  /*.v-select__selections input { display: none; } */
  /*.select { min-width: 95px; max-width: 95px; } */
  /*.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content { box-shadow: none; } */
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg110 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 110%;
  }
  .fg135b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 115%;
    font-weight: bold;
  }
  .fg95 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 95%;
    float:left;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .fg75 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 75%;
  }
  /* .text-green input { color: green !important; } */
  /* /.text-white input { color: white !important; } */
  /*9257*/
</style>