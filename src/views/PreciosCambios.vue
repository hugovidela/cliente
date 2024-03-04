4<template>
  <v-layout align-start>
    <v-flex>
      <v-dialog v-model="dialog" :fullscreen="true" persistent
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="closeForm">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <v-row class="fg">
            <v-col cols="4" class="pt-6 pb-7">
              <span>Actualización de Precios / {{empresa}}</span>
            </v-col>
            <v-col cols="6">
              <v-progress-linear v-if="progress==true"
                class="mt-2"
                height="10"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-linear>
            </v-col>
            <v-col cols="2">
              <v-btn v-show="((selected.length>0||todosLosArts)&&
                (porcentaje!=0||tipoDeCambio=='anclajes'))"
                :color="temas.forms_btn_add_bg"
                class="ma-2 white--text"
                @click="aplicarCamPre(false)">
                Aplicar
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>

        <v-card class="fg">
          <form method="POST" action="upload" enctype="multipart/form-data">
            <v-card-text class="pt-1 pb-0">
<!--          <v-container class="pt-1 pb-0">   -->
                <v-tabs :color="temas.forms_titulo_bg">
                  <v-tab href="#manual" @click="setTab('manual')">
                    Precios
                  </v-tab>
                  <v-tab-item value="manual">
                    <v-row>
                      <v-col cols="6" sm="6" class="pt-2 pb-0 pl-4">
                        <v-radio-group dense
                          v-model="tipoDeCambio" row>
                          <v-radio v-if="!externo"
                            :color="temas.forms_titulo_bg"
                            label="Cambiar Precios"
                            value="campre"
                            @click="setTab('manual')">
                          </v-radio>
                          <v-radio
                            :color="temas.forms_titulo_bg"
                            label="Reasignar Porcentajes de Remarcación"
                            value="campor"
                            @click="setTab('manual')">
                          </v-radio>
                          <v-radio
                            :color="temas.forms_titulo_bg"
                            label="Anclajes"
                            value="anclajes">
                          </v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="1" sm="1" md="1" class="pt-4 pb-0 pl-6">
                        <v-text-field v-if="!todosLosArts"
                          type="number"
                          outlined dense
                          v-model="limit"
                          min="25"
                          label="A Leer">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1" class="pt-4 pb-0 pl-0">
                        <v-text-field v-if="!todosLosArts"
                          disabled outlined dense
                          v-model="selected.length"
                          label="Selecc">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" sx="1" mx="1" class="pt-2 pb-0"
                        v-show="tipoDeCambio!='anclajes'">
                        <v-text-field
                          type="number"
                          :label="tipoDeCambio=='campre' ?
                          '% a Aplicar' : '% Remarcación a Asignar'"
                          :color="temas.forms_titulo_bg"
                          outlined dense
                          v-model="porcentaje"
                          class="pt-2">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-2 pb-0"
                        v-show="tipoDeCambio=='campre'">
                        <v-switch
                          label="Aumentar"
                          v-model="aumentar"
                          :color="temas.forms_titulo_bg"
                          outlined dense>
                        </v-switch>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-2 pb-0"
                        v-show="tipoDeCambio=='anclajes'">
                        <v-switch
                          label="Anclar costos al Dolar"
                          v-model="anclar"
                          :color="temas.forms_titulo_bg"
                          outlined dense
                          @click="anclarDesanclar()">
                        </v-switch>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="2" sm="2" class="pt-1 pb-0 pl-5">
                        <v-switch
                          label="Todos los Artículos"
                          v-model="todosLosArts"
                          :color="temas.forms_titulo_bg"
                          outlined dense>
                        </v-switch>
                      </v-col>
                      <v-col cols="2" sm="2" class="pt-2 pb-0">
                        <v-select v-if="!todosLosArts"
                          v-model="rubro"
                          :items="rubItems"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :disabled="tipoDeCambio=='campor'"
                          item-value="id"
                          item-text="nombre"
                          label="Rubro..."
                          outlined dense return-object multiselects
                          class="pt-2"
                          @change="filtrar()">
                        </v-select>
                      </v-col>
                      <v-col cols="2" sm="2" class="pt-2 pb-0">
                        <v-select v-if="!todosLosArts"
                          v-model="prov"
                          :items="provItems"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :disabled="tipoDeCambio=='campre'"
                          item-value="id"
                          item-text="nombre"
                          label="Proveedor"
                          outlined dense
                          class="pt-2"
                          @change="filtrar()">
                        </v-select>
                      </v-col>
                      <v-col cols="2" sm="2" class="pt-2 pb-0">
                        <v-autocomplete v-if="!todosLosArts"
                          class="pt-2 body-2"
                          v-model="marca"
                          :color="temas.forms_titulo_bg"
                          :items="itemsMarcasFil"
                          :loading="isLoadingMarcasFil"
                          :search-input.sync="searchMarcasFil"
                          item-text="nombre"
                          item-value="id"
                          label="Marca"
                          outlined dense clearable
                          @change="filtrar()"
                          placeholder="Escriba para buscar">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="4" sm="4" class="pt-4 pb-0" v-if="!todosLosArts">
                        <v-card outlined class="pt-1 pb-1">
                          <span class="pl-2">Grupos</span>
                          <v-chip small
                            class="ma-2"
                            @click="clickEnGrupo">
                            {{ nombreDelGrupo }}
                          </v-chip>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <v-tab href="#importacion" @click="setTab('importacion')"
                    v-if="!externo">
                    Excel
                  </v-tab>
                  <v-tab-item value="importacion">
                    <v-row>
                      <v-col cols="4">
                        <v-radio-group
                          v-model="excelOperacion" column>
                          <div>Tipo de Acción</div>
                          <v-radio label="Generar Archivo Excel para cambios de precios"
                            value="G"
                            :color="temas.forms_titulo_bg"
                            class="pl-6 pt-2">
                          </v-radio>
                          <v-radio label="Actualizar en base a Archivo Excel"
                            value="A"
                            :color="temas.forms_titulo_bg"
                            class="pl-6">
                          </v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="8">
                        <v-row class="pt-10" v-if="excelOperacion=='A'">
                          <v-col cols="6" sm="6" md="6">
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
                              label="Registros XLS">
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
                          <v-col cols="3" sm="3" md="3">
                            <v-btn v-show="selected.length>0"
                              :color="temas.forms_titulo_bg"
                              :dark="temas.cen_btns_dark==true"
                              class="ma-2 white--text"
                              @click="cpAplicar()">
                              Actualizar Precios
                            </v-btn>
                          </v-col>
                        </v-row>

                        <v-row class="pt-8" v-if="excelOperacion=='G'">
                          <v-col cols="3" sm="3" md="3">
                            <v-btn
                              :color="temas.forms_titulo_bg"
                              :dark="temas.cen_btns_dark==true"
                              class="ma-2 white--text"
                              @click="cpGenerar()">
                              Generar
                            </v-btn>
                          </v-col>
                        </v-row>

                      </v-col>
                    </v-row>
                    <v-row class="pt-4">
                    </v-row>
                  </v-tab-item>

                  <v-tab href="#cambios" @click="setTab('cambios')"
                    v-if="!externo">
                    Precios Modificados por Compras
                  </v-tab>

                  <v-tab href="#backups" @click="setTab('backups')">
                    Copias
                  </v-tab>
                  <v-tab-item value="backups">
                  </v-tab-item>
                </v-tabs>
<!--          </v-container>  -->
            </v-card-text>
          </form>

          <v-data-table v-if="enCualTabEstoy=='importacion'"
            v-model="selected"
            :headers="headers"
            :items="items"
            @toggle-select-all="selectAll"
            :single-select="false"
            item-key="codigo"
            show-select dense
            :footer-props="{
              itemsPerPageOptions: [10],
              showFirstLastPage: true,
              showCurrentPage: true,
              nextIcon: 'mdi-arrow-right-drop-circle-outline',
              prevIcon: 'mdi-arrow-left-drop-circle-outline',
            }"
            class="pl-1 pr-3 elevation-1 pt-2">
            <template v-slot:top>
              <v-row>
                <v-col cols="4" sm="4" class="pt-0 pb-5 ml-3">  <!-- Barra de búsqueda  -->
                  <v-text-field
                    v-model="search" dense
                    :color="temas.forms_titulo_bg"
                    append-icon="search"
                    label="Buscar"
                    single-line hide-details>
                  </v-text-field>
                </v-col>
              </v-row>
            </template>
            <template #item.nombre="{ value }">
              <div class="fg85 text-truncate" style="max-width: 260px">
                {{ value }}
              </div>
            </template>
            <template v-slot:item.codigo="{ item }" class="fg85">
              <span class="fg85">{{item.codigo}}</span>
            </template>
            <template v-slot:item.miprecio="{ item }" class="fg85">
              <span class="fg85">${{ formatoImporteDec(item.miprecio, 2) }}</span>
            </template>
            <template v-slot:item.precio="{ item }" class="fg85">
              <span class="fg85">${{ formatoImporteDec(item.precio, 2) }}</span>
            </template>
            <template v-slot:item.variacion="{ item }">
              <span class="fg85">% {{ formatoImporteDec(item.variacion, 2) }}</span>
            </template>
          </v-data-table>

          <v-data-table v-else-if="!todosLosArts&&enCualTabEstoy!='backups'"
            v-model="selected"
            :headers="headers"
            :items="items"
            @toggle-select-all="selectAll"
            :single-select="false"
            item-key="codigo"
            show-select dense
            :footer-props="{
              itemsPerPageOptions: [10],
              showFirstLastPage: true,
              showCurrentPage: true,
              nextIcon: 'mdi-arrow-right-drop-circle-outline',
              prevIcon: 'mdi-arrow-left-drop-circle-outline',
            }"
            class="pl-1 pr-3 elevation-1 pt-2">
            <template v-slot:top>
              <v-row>
                <v-col cols="4" sm="4" class="pt-5 pb-5 ml-3">  <!-- Barra de búsqueda  -->
                  <v-text-field dense
                    v-model="search"
                    :color="temas.forms_titulo_bg"
                    append-icon="search"
                    label="Código, ID, Descripción o Código de Barra"
                    clearable
                    @click:clear="limpiarTextoBuscar()"
                    single-line hide-details>
                  </v-text-field>
                </v-col>
                <v-col cols="1" sm="1" class="pt-4" >
                  <v-btn
                    :color="temas.forms_titulo_bg"
                    class="fg" dark
                    @click="filtrar()">
                    Buscar
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="2" v-if="enCualTabEstoy=='cambios'">
                  <v-btn v-show="selected.length>0"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 mt-1" @click="cpBorrar">
                    Borrar Seleccionados
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="2" v-if="enCualTabEstoy=='cambios'">
                  <v-btn v-show="selected.length>0"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 mt-1" @click="cpAplicar()">
                    Aplicar Cambios
                  </v-btn>
                </v-col>

              </v-row>
            </template>
            <template #item.nombre="{ value }">
              <div class="fg85 text-truncate" style="max-width: 260px">
                {{ value }}
              </div>
            </template>
            <template v-slot:item.id="{ item }" class="fg85">
              <span class="fg85">{{item.id}}</span>
            </template>
            <template v-slot:item.codigo="{ item }" class="fg85">
              <span class="fg85">{{item.codigo}}</span>
            </template>
            <template v-slot:item.nommar="{ item }" class="fg85">
              <span class="fg85">{{item.nommar.substring(0,9)}}</span>
            </template>
            <template v-slot:item.nomgru="{ item }" class="fg85">
              <span class="fg85">{{item.nomgru.substring(0,9)}}</span>
            </template>
            <template v-slot:item.cpr="{ item }" class="fg85">
              <span class="fg85">{{kit.cpr(item.cpr)}}</span>
            </template>
            <template v-slot:item.costo="{ item }" class="fg85">
              <span class="fg85" v-if="enCualTabEstoy!='importacion'">
                ${{ formatoImporteDec(item.precios[0].costo, 3) }}
              </span>
            </template>
            <template v-slot:item.porrem="{ item }">
              <span class="fg85" v-if="enCualTabEstoy!='importacion'">
                %{{ formatoImporte(item.precios[0].porrem) }}
              </span>
            </template>
            <template v-slot:item.precio="{ item }">
              <span class="fg85" v-if="enCualTabEstoy!='importacion'">
                ${{ formatoImporteDec(item.precios[0].precio, 3) }}
              </span>
              <v-badge v-if="enCualTabEstoy!='importacion'"
                class="pt-2 fg60"
                :content="itemtasaiva(item)"
                :color="temas.forms_btn_add_bg"
                :dark="temas.forms_btn_add_bg==true">
              </v-badge>
            </template>
            <template v-slot:item.variacion="{ item }">
              <span class="fg85">% {{ formatoImporteDec(item.variacion, 2) }}</span>
            </template>
            <template v-slot:item.fechadelprecio="{ item }">
              <span class="fg85">{{ item.fechadelprecio }}</span>
            </template>
            <template v-slot:item.final="{ item }">
              <span class="fg85">
                $ {{ formatoImporteDec(item.precios[0].final, 3) }}
              </span>
              <v-badge v-if="item.pbe!=null"
                class="fg75 pt-2"
                :content="'p'"
                :color="item.pbe=='P' ? temas.forms_btn_add_bg : black"
                :dark="temas.forms_btn_add_bg==true">
              </v-badge>
            </template>
            <template v-slot:item.costo_anterior="{ item }">
              <span class="fg85">
                ${{ formatoImporteDec(item.costo_anterior, 5) }}
              </span>
            </template>
            <template v-slot:item.costo_nuevo="{ item }">
              <span class="fg85">
                ${{ formatoImporteDec(item.costo_nuevo, 5) }}
              </span>
            </template>
            <template v-slot:item.seleccionado="{ item }">
              <v-chip
                :color="getColor(item.seleccionado)"
                dark>{{item.seleccionado?'Sí':'No'}}
              </v-chip>
            </template>

            <template v-slot:item.accion="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab x-small class="mr-2"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    @click="editarPrecio(item)" v-on="on">
                    <v-icon dark>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
            </template>
          </v-data-table>

          <div bottom v-if="enCualTabEstoy=='backups'" class="pl-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab x-small
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_dark==true"
                  @click="nuevaCopia" v-on="on">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span class="fg">Nueva Copia</span>
            </v-tooltip>
          </div>

          <v-data-table v-if="enCualTabEstoy=='backups'"
            :headers="headersCopias"
            :items="copias"
            dense
            :footer-props="{
              itemsPerPageOptions: [10],
              showFirstLastPage: true,
              showCurrentPage: true,
              nextIcon: 'mdi-arrow-right-drop-circle-outline',
              prevIcon: 'mdi-arrow-left-drop-circle-outline',
            }"
            class="pl-1 pr-3 elevation-1 pt-2">
            <template v-slot:item.created_at="{ item }">
              <span class="fg">{{ formatoFechaYHora(item.created_at) }}</span>
            </template>
            <template v-slot:item.accion="{item}">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mr-2" fab x-small
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    @click="recuperarCopia(item)" v-on="on">
                    <v-icon>mdi-backup-restore</v-icon>
                  </v-btn>
                </template>
                <span>Recuperar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mr-2" fab x-small
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    @click="preguntoBorrarCopia(item)" v-on="on">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Borrar</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-dialog>

      <!-- EDITAR PRECIO -->
      <v-dialog v-model="dialogEditarPrecio" max-width="400px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn icon
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              @click="cancelarEditarPrecio">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="headdline">Editar Precio</span>
            <v-spacer></v-spacer>
            <v-btn
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="pb-0 pt-0 ma-2 white--text"
              @click="guardarPrecio">
              Aplicar
            </v-btn>
          </v-toolbar>

          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                    <div class="pb-4">
                      <span v-if="edPre.pbe=='U'">
                        <b>El artículo esta publicado pero en pausa</b>
                      </span>
                      <span v-else-if="edPre.pbe=='P'">
                        <b>El artículo Publicado y Activo</b>
                      </span>
                      <span v-else-if="edPre.pbe=='I'">
                        <b>El artículo esta publicado pero invisible</b>
                      </span>
                      <span v-else>
                        <b>El artículo no esta publicado</b>
                      </span>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="8" sm="8" md="8" class="pt-0 pb-0">
                    <v-text-field
                      autofocus
                      v-model="edPre.costo"
                      :disabled="edPre.uid!=userId"
                      :color="temas.forms_titulo_bg"
                      label="Costo"
                      @change="calculoPrecio(1)">
                    </v-text-field>
                  </v-col>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                    <v-text-field
                      autofocus
                      v-model="edPre.porrem"
                      :color="temas.forms_titulo_bg"
                      label="% Remarcación"
                      @change="calculoPrecio(2)">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="8" sm="8" md="8" class="pt-0 pb-0">
                    <v-text-field
                      v-model="edPre.neto"
                      :color="temas.forms_titulo_bg"
                      label="Precio"
                      @change="calculoPrecio(3)">
                    </v-text-field>
                  </v-col>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                    <v-text-field
                      v-model="edPre.tasaiva"
                      disabled
                      :color="temas.forms_titulo_bg"
                      label="%IVA">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                  </v-col>
                  <v-col cols="8" sm="8" md="8" class="pt-0 pb-0">
                    <v-text-field
                      v-model="edPre.precio"
                      :color="temas.forms_titulo_bg"
                      label="Precio Final"
                      @change="calculoPrecio(4)">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
<!--
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="pb-0 pt-0 ma-2 white--text"
                @click="guardarPrecio">
                Guardar
              </v-btn>
            </v-card-actions>
-->
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN EDITAR PRECIO -->

      <!-- NUEVA COPIA -->
      <v-dialog v-model="dialogNuevaCopia" max-width="600px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn icon
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              @click="dialogNuevaCopia=false">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="headdline">Nueva Copia</span>
            <v-spacer></v-spacer>
            <v-btn
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="pb-0 pt-0 ma-2 white--text"
              @click="generarNuevaCopia">
              Generar
            </v-btn>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                    <v-text-field
                      autofocus
                      v-model="descripcion"
                      :color="temas.forms_titulo_bg"
                      label="Descripción">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- SELECCION DE GRUPOS-->
      <v-dialog v-model="dialogGrupos" max-width="600px" max-height="600px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="cancelarDialogGrupos">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span>Seleccione los Grupos</span>
            <v-spacer></v-spacer>
            <v-btn
              @click="aceptarGrupos"
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="ma-2 white--text">
              Aceptar
            </v-btn>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-card max-width="600"
                  style="height: 545px;"
                  v-scroll.self="onScroll"
                  class="overflow-y-auto"
                  max-height="600">
                  <v-card-text>
                    <v-treeview
                      v-model="selection"
                      return-object
                      selectable
                      open-all
                      item-key="id"
                      hoverable activatable dense
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      :items="itemsTreeGrupos">
                    </v-treeview>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN SELECCION DE GRUPOS -->

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
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import Confirmacion from "./Forms/confirmacion.vue"
import SBar from './Forms/snackbar.vue';

export default {
  components: {
    Confirmacion,
    SBar,
  },
  data: () => ({
    idCopia: -1,
    todosLosArts: false,
    scrollInvoked: 0,
    tipoDeCambio: 'campre',
    progress: false,
    cfgExcel: [],
    cpSel: 0,
    desdeExcel: false,
    dialog: true,
    dialogEditarPrecio: false,
    dialogNuevaCopia: false,
    isLoadingMarcasFil: false,
    //filtroListo: false,
    limit: 100,
    rubro: '',
    marca: '',
    grupo: '',
    prov: 0,
    rubro_id: 0,
    //queVer: 0,
    nuevoXls: [],
    xlsCargado: false,
    camPreCargado: false,
    registrosXls: 0,
    registrosCamPre: 0,
    encontradosXls: 0,
    aModificarXls: 0,
    soloCambios: 0,
    selected: [],
    rubItems: [],
    provItems: [],
    marItems: [],
    gruItems: [],
    items: [],
    mios: [],
    itemActual: null,
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente
    // definimos los headers de la datatables
    descripcion: '',
    copias: [],
    headers: [],

    headersCopias: [
      { text: 'Fecha', value:'created_at', width: 150 },
      { text: 'Descripción', value:'descripcion', width: 600 },
      { text: 'Acciones', value: 'accion', sortable: false },
    ],
    excelOperacion: 'G',
    aumentar: true,
    anclar: true,
    porcentaje: 0,
    edPre: {
      costo: 0,
      porrem: 0,
      porremOri: 0,
      neto: 0,
      tasaiva: 0,
      precio: 0,
      uid: 0,
      pbe: 0,
    },
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    entriesMarcasFil: [],
    searchMarcasFil: '',
    selection: [],
    nombreDelGrupo: 'Sel.grupos',
    itemsTreeGrupos: [],
    dialogGrupos: false,
    enCualTabEstoy: '',
  }),
  
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'vinculosPadres', 'vinculosPadresLic', 'vinculosPadresLic', 'vinculosHijos', 'empresa', 'temas', 'dolar', 'externo', 'tipo',
      'codigooid', 'cttLoadReg', 'descuentos', 'transition'
    ]),

    itemsMarcasFil () {
      return this.entriesMarcasFil.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

  },
 
  watch: {
    searchMarcasFil (val) {
      if (this.isLoadingMarcasFil) return
      return HTTP().get('/marcasbus').then(({ data }) => {
        this.entriesMarcasFil = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMarcasFil = false))
    },
//    search () {
//      this.filtrar()
//    },
  },

  mounted () {
    this.dialog = true;
    this.limit = this.$store.state.cttLoadReg||25
    this.rubItems = []
    this.provItems = []
    this.marItems = [{id: 0, nombre: 'Todas'}]
    this.gruItems = [{id: 0, nombre: 'Todos'}]
    if (this.externo) {
      this.tipoDeCambio = 'campor'
    }
    return HTTP().get('/usersrubros').then(({ data }) => {
      for (let i=0; i<=data.length-1; i++) {
        this.rubItems.push(data[i].rubro)
      }
      this.rubro = this.rubItems[0]
      this.rubro_id = this.rubro.id                    // ver, puede tener mas rubros
      return HTTP().get('/marcasbus').then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          this.marItems.push(data[i])
        }
        this.marca = this.marItems[0].id
        return HTTP().get('/grupos').then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            this.gruItems.push(data[i])
          }
          this.grupo = this.gruItems[0]
          for (let i=0; i<=this.$store.state.proveedores.length-1; i++) {
            if (!(this.$store.state.externo&&i==0)) {
              this.provItems.push(this.$store.state.proveedores[i])
            }
          }
          this.prov = this.provItems[0].id;
          this.setTab('manual');
          return HTTP().get('/gruposrubros/'+this.rubItems[0].id).then(({ data }) => {
            let aux = [];
            for(let i in data[0]) {
              aux.push({
                id: Number(data[0][i].id),
                name: data[0][i].nombre,
                activo: data[0][i].activo,
                ctt: data[0][i].ctt,
                padre: Number(data[0][i].grupo_id),
                state: { disabled: data[0][i].activo===1 ? false : true }
              });
            };
            this.itemsTreeGrupos = getNestedChildren2(aux,0);
            function getNestedChildren2(arr, padre) {
              var out = [];
              for(var i in arr) {
                if(arr[i].padre === padre) {
                  var children = getNestedChildren2(arr, arr[i].id);
                  if(children.length) {
                    arr[i].children = children;
                  };
                  out.push(arr[i]);
                };
              };
              return out;
            };
          });
        });
      });
    });
  },

  methods: {
    selectAll(event) {
      if (event.value) {
        debugger
        this.selected = this.items
      } else {
        this.selected = []
      }
    },

    closeForm(){
      this.dialog = false;
      router.push('/')
    },

    limpiarTextoBuscar() {
      this.search = ''
      this.filtrar()
    },

    generarNuevaCopia() {
      this.dialogNuevaCopia = false
      this.msg.msgTitle = '¡Nueva copia de Precios!'
      this.msg.msgBody = '¿Confirmas realizar una nueva copia de precios?<br><br>'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'nueva copia de precios'
      this.msg.msgButtons = ['Aceptar', 'Cancelar']
    },

    guardarPrecio(cual) {
      this.itemActual.costo = this.edPre.costo
      this.itemActual.porrem = this.edPre.porrem
      this.itemActual.precio = this.edPre.neto
      this.itemActual.final = this.edPre.precio
      this.selected.push(this.itemActual)
      this.dialogEditarPrecio = false
      this.msg.msgAccion = 'Aplicar Cambio de Precios'
      this.tipoDeCambio = 'camone'
      this.msgRespuesta('Aceptar')
     },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar copia') {
          return HTTP().post('/borrarcopiadeprecios/', { id: this.idCopia },{ timeout: 20000 }).then(({ data }) => {
            if (data=='error') {
              this.msg.title = '¡ERROR!'
              this.msg.msgBody = 'Se ha producido un error al intentar borrar esta copia de precios!.'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'error'
              this.msg.msgButtons = ['Aceptar']
            } else {
              this.msg.title = '¡MENSAJE!'
              this.msg.msgBody = '¡Se ha eliminado la copia de precios correctamente!.'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'ok'
              this.msg.msgButtons = ['Aceptar']
            }
            this.filtrar()
          })

        } else if (this.msg.msgAccion=='recuperar copia') {

          return HTTP().post('/recuperarcopiadeprecios/', { id: this.idCopia },{ timeout: 20000 }).then(({ data }) => {
            if (data=='error') {
              this.msg.title = '¡ERROR!'
              this.msg.msgBody = 'Se ha producido un error al intentar borrar esta copia de precios!.'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'error'
              this.msg.msgButtons = ['Aceptar']
            } else {
              this.msg.title = '¡MENSAJE!'
              this.msg.msgBody = '¡Se ha recuperado la copia de precios correctamente!.'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'ok'
              this.msg.msgButtons = ['Aceptar']
            }
            this.filtrar()
          })

        } else if (this.msg.msgAccion=='Aplicar Cambio de Precios') {

          let s = this.search ? this.search : 'all'
          let v = []
          if (this.tipoDeCambio=='campre'||
              this.tipoDeCambio=='camone'||
              this.tipoDeCambio=='campor'||
              this.tipoDeCambio=='anclajes') {
            v = this.$store.state.vinculosHijos
          } else {
            v.push(this.userId)
          }
          this.progress = true
          if (this.tipoDeCambio=='camone') {
            if (this.edPre.porremOri!=this.selected[0].porrem) {
              this.porcentaje = this.selected[0].porrem
              this.tipoDeCambio = 'campor'
            }
          }

          debugger
          return HTTP().post('/userarticuloscambiosdeprecios/', {
            rub: this.rubro.id, vin: v, sel: this.selected,
            pje: this.porcentaje,
            aum: this.aumentar,
            tip: this.tipoDeCambio,
            xls: this.desdeExcel,
            one: this.edPre,
            usd: this.dolar,
            anc: this.anclar,
            all: this.todosLosArts },
            { timeout: 20000, limit: 50 }).then(({ data }) => {

            debugger

            if (data=='error') {
              this.progress = false
              this.msg.msgTitle = '¡Opps, se ha producido un error!'
              let m = 'Se ha producido un error en la actualización de precios<br><br>'
              m += '¡Los precios no fueron modificados!'
              this.msg.msgBody = m
              this.msg.msgVisible = true
              this.msg.msgAccion = 'Error'
              this.msg.msgButtons = ['Aceptar']
            } else {

              this.items = []
              this.selected = []
              this.progress = false

              let msg = ''
              if (data>0) {
                if (this.tipoDeCambio=='campre') {
                  msg = data==1?'¡Precio modificado!':'¡Precios modificados!'
                } else if (this.tipoDeCambio=='camone'||this.tipoDeCambio=='campor') {
                  msg = data==1?'¡Remarcación modificada!':'¡Remarcaciones modificadas!'
                } else {
                  msg = data==1?'¡Cambio de anclas OK':'¡Cambios de anclas Ok!'
                }
                if (this.$store.state.vinculosHijos.length>0) {
                  msg += 'Tambien fueron modificados los precios de '+this.$store.state.vinculosHijos.length+' '
                  msg += 'clientes vinculados.'
                }
                this.mensaje(msg, this.temas.forms_titulo_bg, 1500)
              } else {
                this.mensaje('¡No se han modificado precios!.', this.temas.forms_titulo_bg, 1500)
              }
              this.msg.msgVisible = false
              this.filtrar()
            }
          })
        
//        } else if (this.msg.msgAccion=='Precios Modificados') {
          
  //        this.msg.msgVisible = false
    //      this.filtrar()
        
        } else if (this.msg.msgAccion=='Borrar Cambios de Precios') {
          
          this.cpBorrarHTTP()
        
        } else if (this.msg.msgAccion=='eliminacion de cambios de precios') {
          
          this.msg.msgVisible = false
          this.cpSel = 0
        
        } else if (this.msg.msgAccion=='No hay precios seleccionados') {
          
          this.msg.msgVisible = false
          this.cpSel = 0
        
        } else if (this.msg.msgAccion=='Aplicar precio seleccionado' || this.msg.msgAccion=='Aplicar precios seleccionados') {
          
          this.cpAplicarCambiosHTTP()

        } else if (this.msg.msgAccion=='Generar Archivo Excel') {
          
          this.cpGenerarExcelHTTP()
        
        } else if (this.msg.msgAccion=='cambios de precios aplicados') {
          
          this.msg.msgVisible = false
          this.cpSel = 0
          this.filtrar()

        } else if (this.msg.msgAccion=='Error') {

          this.msg.msgVisible = false

        } else if (this.msg.msgAccion=='nueva copia de precios') {

          debugger
          return HTTP().post('/generarcopiadeprecios/', { des: this.descripcion },{ timeout: 20000 }).then(({ data }) => {

            debugger
            if (data=='error') {
              this.msg.title = '¡ERROR!'
              this.msg.msgBody = 'Se ha producido un error al intentar relizar la copia de precios!.'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'error'
              this.msg.msgButtons = ['Aceptar']
            } else {
              this.msg.title = '¡MENSAJE!'
              this.msg.msgBody = 'Se ha generado una nueva copia de precios correctamente!.'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'ok'
              this.msg.msgButtons = ['Aceptar']
            }
            this.filtrar()

          })

        } else {

          this.msg.msgVisible = false;  

        }
      
      } else if (op==='Cancelar') {
        
        this.msg.msgVisible = false;
      
      }

    },

    anclarDesanclar() {
      this.selected = []
      this.filtrar()
    },

    filtrar() {
      if (this.enCualTabEstoy=='importacion') {
        return
      }
      this.items = []
      this.copias = []

      debugger
      if (this.enCualTabEstoy=='backups') {
        return HTTP().get('/precioscopias').then(({data})=>{
          debugger
          this.copias = data
        })
      } else if (this.enCualTabEstoy=='cambios') {
        return HTTP().get('/precioscambios').then(({data})=>{
          if (data) {
            for (let i=0; i<=data.length-1; i++) {
              this.items.push({ 
                id: data[i].id,
                articulo_id: data[i].aid,
                codigo: data[i].codigo,
                nombre: data[i].nombre,
                cpr: data[i].cpr,
                costo_anterior: data[i].costo_anterior,
                costo_nuevo: data[i].costo_nuevo,
                procesado: data[i].procesado,
                seleccionado: false,
              })
            }
          }
        })
      
      } else {
      
        let grusel = []
        for (let i=0; i<=this.selection.length-1; i++) {
          grusel.push(this.selection[i].id)
        }
        if (grusel.length==0) { grusel='' }

        //let v = [] // Solo articulos del usuario actual
        //let s = this.search ? this.search : ''
        //
        //if (this.tipoDeCambio=='campre') {          // SOLO LOS ARTICULOS PROPIOS DEL USUARIO
        //  v.push(this.userId)
        //} else {
        //  if (this.prov==0) {
        //    v.push(this.userId)
        //    for (let i=0; i<=this.vinculosPadres.length-1; i++) {
        //      if (this.prov==0) {
        //        v.push(this.vinculosPadres[i])
        //      } else if (this.prov==this.vinculosPadres[i]) {
        //        v.push(this.vinculosPadres[i])
        //      }
        //    }
        //  } else {
        //    v.push(this.prov)
        //  }
        //}
        if (this.marca==undefined) {
          this.marca = ''
        }
        this.progress = true
        return HTTP().post('/articuloz', {
          search: this.search,
          vinculosPadresLic: this.$store.state.vinculosPadresLic,
          vinculosPadresAll: this.$store.state.vinculosPadresAll,
          proveedor: this.prov, stockProv: false, grupo: grusel, marca: this.marca, userex: null, soloArtComprados: true, descuentos: this.descuentos,
          dolar: this.$store.state.dolar, activos: true, limit: this.limit }).then(({ data })=>{
          for (let i=0; i<=data.length-1; i++) {
            this.items.push({
              id: data[i].id,
              codigo: data[i].codigo,
              nombre: data[i].nombre,
              nomgru: data[i].precios[0].nomgru,
              nommar: data[i].precios[0].nommar,
              tasaiva: data[i].tasa,
              estado: '',
              pbe: data[i].pbe,
              precios: data[i].precios,
              fechadelprecio: moment(data[i].precios[0].updatedAt).fromNow(true),
              seleccionado: false,
            })
          }

          this.progress = false
          if (this.items.length==0) {
            this.mensaje('No se encontraron precios para actualizar.', this.temas.snack_error_bg, 1500)
          }
        })
        .catch(err => {
          console.log(err)
        })
      }
    },

    cargarXls() {
      this.encontradosXls = 0;
      if (this.nuevoXls != undefined) {
        try {
          // Levanto desde la tabla precios los precios actuales
          return HTTP().post('/articulox', {}).then(({ data })=>{
            this.mios = [];
            let p = 0;
            for (let i=0; i<=data.length-1; i++) {
              p = i+2
              this.mios.push([
                data[i].id,
                data[i].codigo,
                data[i].nombre,
                data[i].costo,
                data[i].porrem,
                {t:"n",f:"D"+p.toString()+"*(1+(E"+p.toString()+"/100))"},
                data[i].tasaiva,
                {t:"n",f:"F"+p.toString()+"*(1+(G"+p.toString()+"/100))"}
              ]);
            }
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
//          this.chequearArt()
          })
        } catch (exception) {
        }
      } else {
        this.xlsCargado = false;
      }
    },

    parseFileContent(sheet) {
      this.encontradosXls = 0;
      this.selected = []
      this.items = []

      // apareo los dos arrays de objetos, 
      let x = 1 // sheet
      let y = 0 // mios
      let done = true
      while (done) {
        let r = sheet[x]
        let xl = r[1]
        let db = this.mios[y][1]
        if (xl===db) {       // son iguales, controlo el precio

          if (r[5]!=this.mios[y][3]) {
            let x = this.roundTo(((r[3]/this.mios[y][3])-1)*100,4)
            this.items.push({
              id:r[0],
              codigo:r[1],
              nombre:r[2],
              miprecio:this.mios[y][3],
              precio:r[3], //5
              variacion:x,
              estado: 'N'
            })
            this.encontradosXls ++;
          }
          x ++
          y ++
        } else if (xl>db) {  // el de excel es mayor que el de la bd
          y ++
        } else if (xl<db) {  // el de la bd es mayor
          x ++
        }
        if (y>sheet.length-1) {
          y = sheet.length-1
          x ++
        }
        if (x>this.mios.length-1) {
          done = false
        }
      }

      /*
      for (let i=1; i<=sheet.length-1; i++) {
        let r = sheet[i]
        if (r[0]!=undefined && r[3]!=undefined && !isNaN(r[3])) {
          for (let j=0; j<=this.mios.length-1; j++) {
            if (this.mios[j][1]==r[1]&&this.mios[j][3]!=r[3]) { 
              this.items.push({
                id:r[0], codigo:r[1], nombre:r[2], miprecio:this.mios[j].precio, precio:r[3], variacion: 0, estado: 'N'
              })
              this.encontradosXls ++;
              break
            }
          }
        }
      }
      */
      if (this.encontradosXls == 0) {
        this.mensaje('No se encontraron precios para actualizar.',this.temas.snack_error_bg, 2500)
      }
      this.registrosXls = sheet.length;
    },

    chequearArt() {
      this.mios = [];
      this.encontradosXls = 0;
      // ver de poner el rubro, por ahora van todos.
      return HTTP().post('/articuloz', {
        search: '',
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: 100000 }, {timeout: 50000}).then(({ data })=>{
        this.items = data
        return HTTP().post('/userarticulosmisprecios/', {id:this.userId}).then(({ data }) => {  // ver esto
          if (data) {
            for (let i=0; i<=data.length-1; i++) {
              this.mios.push({ id: data[i].id, codigo: data[i].codigo, precio: data[i].meta.costo })
            }

            // ORDENO items POR CODIGO
            this.items.sort(function (a, b) {
              if (a.codigo > b.codigo) { return 1 }
              if (a.codigo < b.codigo) { return -1 }
            return 0 })

            this.encontradosXls = resultado.length
            this.aModificarXls = resultado.length
            this.items = resultado

          }
          if (this.encontradosXls == 0) {
            this.mensaje('No se encontraron precios para actualizar.',this.temas.snack_error_bg, 2500)
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoImporteDec(value, dec) {
      let val = (value/1).toFixed(dec).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{dec})+(?!\d))/g, ".")
    },

    aplicarCamPre(val) {
      this.desdeExcel = val
      let msg = ''
      debugger
      //este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      if (this.tipoDeCambio=='campre') {
        this.msg.msgTitle = 'Cambios de Precios'
        if (this.todosLosArts) {
          msg =  '<br>Se modificará el precio de todos los Artículos propios'
        } else if (this.selected.length==1) {
          msg = 'Se va a modificar un precio. ¿Confirma la operación?'
        } else {
          if (this.selected.length==1) {
            msg =  '<br>Se modificará el precio de <b>'+this.selected.length + '</b> artículo propio'
          } else {
            msg =  '<br>Se modificarán los precios de <b>'+this.selected.length + '</b> artículos propios'
          }
          msg += '<br><br>¿Confirma la operación?'
        }
      } else if (this.tipoDeCambio=='anclajes') {
        if (this.anclar) {
          this.msg.msgTitle = 'Anclar'
          if (this.todosLosArts) {
            msg = 'Todos los precios serán anclados. ¿Confirma la operación?'
          } else if (this.selected.length==1) {
            msg = 'Un artículo será anclado. ¿Confirma la operación?'
          } else {
            msg =  '<br>Se anclarán '+this.selected.length + ' artículos.<br><br>'
            msg += 'Este proceso puede demorar. Dependerá de la cantidad de registros incluidos '
            msg += 'y de la cantidad de clientes vinculados.<br><br>'
            msg += '¿Confirma la operación?'
          }
        } else {
          this.msg.msgTitle = 'Desanclar'
          if (this.todosLosArts) {
            msg = 'Todos los precios serán desanclados. ¿Confirma la operación?' 
          } else if (this.selected.length==1) {
            msg = 'Un artículo será desanclado. ¿Confirma la operación?'
          } else {
            msg =  '<br>Se desanclarán '+this.selected.length + ' artículos.<br><br>'
            msg += 'Este proceso puede demorar. Dependerá de la cantidad de registros incluidos '
            msg += 'y de la cantidad de clientes vinculados.<br><br>'
            msg += '¿Confirma la operación?'
          }
        }
      } else {
        this.msg.msgTitle = 'Cambios en Porcentajes de Remarcación'
        if (this.todosLosArts) {
          msg = 'Será modificado el porcentaje de remarcación de todos los Artículos. ¿Confirma la operación?' 
        } else if (this.selected.length==1) {
          msg = 'Un porcentaje será modificado. ¿Confirma la operación?'
        } else {
          msg =  '<br>Se modificará el porcentaje de remarcacion en '+this.selected.length + ' artículos.<br><br>'
          msg += '¿Confirma la operación?'
        }
      }
      this.msg.msgBody = msg
      this.msg.msgVisible = true
      this.msg.msgAccion = 'Aplicar Cambio de Precios'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    editarPrecio(item) {
      this.itemActual = item
      this.dialogEditarPrecio = true;
      this.edPre.costo       = item.precios[0].costo
      this.edPre.porrem      = item.precios[0].porrem
      this.edPre.porremOri   = item.precios[0].porrem
      this.edPre.neto        = item.precios[0].precio
      this.edPre.tasaiva     = item.tasaiva
      this.edPre.precio      = item.precios[0].final
      this.edPre.uid         = item.precios[0].id
//    this.edPre.uid         = item.uid
      this.edPre.pbe         = item.pbe
    },

    calculoPrecio(cual) {
      if (cual==1) {        // costo
        this.edPre.neto   = this.roundTo(this.edPre.costo*(1+(this.edPre.porrem/100)),2)
        this.edPre.precio = this.roundTo(this.edPre.neto*(1+(this.edPre.tasaiva/100)),2)
      } else if (cual==2) { // porrem
        this.edPre.neto = this.roundTo(this.edPre.costo*(1+(this.edPre.porrem/100)),2)
        this.edPre.precio = this.roundTo(this.edPre.neto*(1+(this.edPre.tasaiva/100)),2)
      } else if (cual==3) { // neto
        this.edPre.porrem = this.roundTo(((this.edPre.neto/this.edPre.costo)-1)*100,2)
        this.edPre.precio = this.roundTo(this.edPre.neto*(1+(this.edPre.tasaiva/100)),2)
      } else {              // precio
        this.edPre.neto   = this.roundTo((this.edPre.precio/(1+(this.edPre.tasaiva/100))),2)
        this.edPre.porrem = this.roundTo(((this.edPre.neto/this.edPre.costo)-1)*100,2)
      }
    },

    cancelarEditarPrecio() {
      this.dialogEditarPrecio = false;
    },

    nuevaCopia() {
      this.descripcion = 'Copia de Precios correspondiente al '+moment().format('LLL')
      this.dialogNuevaCopia = true
    },

    setTab(cual) {
      this.enCualTabEstoy = cual
      this.items = []
      if (cual=='manual') {
        this.headers = [
          //{ text: 'ID', value: 'id', width: 100, align: 'left' },
          { text: 'Código',   value: 'codigo', width: 90, align: 'left' },
          { text: 'Nombre',   value: 'nombre', width: 260, align: 'left' },
          { text: 'Marca',    value: 'nommar', width: 102,  align: 'left' },
          { text: 'Grupo',    value: 'nomgru', width: 102,  align: 'left' },
          { text: 'FecPre',   value: 'fechadelprecio', width: 60,  align: 'right' },
          { text: 'Costo',    value: 'costo',  width: 110, align: 'end' },
          { text: '%Rem',     value: 'porrem', width: 40,  align: 'end' },
          { text: 'Precio',   value: 'precio', width: 110, align: 'end' },
          { text: 'Final',    value: 'final',  width: 110, align: 'end' },
          { text: 'Editar',   value: 'accion', width: 50,  align: 'right' },
        ]
        this.headers[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
        this.headers[0].value = this.$store.state.codigooid == 'C'?'codigo':'id'
        this.filtrar()
      } else if (cual=='importacion') {
        this.headers = [
          { text: 'ID', value: 'id', width: 80 },
          { text: 'CODIGO', value: 'codigo', width: 110 },
          { text: 'NOMBRE', value:'nombre', width: 550 },
          { text: 'MI PRECIO', value:'miprecio', width: 130, align: 'end'},
          { text: 'PRECIO XLS', value:'precio', width: 130, align: 'end'},
          { text: 'VARIACION', value:'variacion', width: 50, align: 'end'},
//        { text: 'ESTADO', value:'estado', width: 50, align: 'right'},
        ]
//      this.headers[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
//      this.headers[0].value = this.$store.state.codigooid == 'C'?'codigo':'articulo_id'
      } else if (cual=='cambios') {
        this.headers = [
          { text: 'CODIGO', value: 'codigo', width: 110 },
          { text: 'NOMBRE', value:'nombre', width: 350 },
          { text: 'COMPROBANTE', value:'cpr', width: 130 },
          { text: 'COSTO ANTERIOR', value:'costo_anterior', width: 150, align: 'right'},
          { text: 'NUEVO COSTO', value:'costo_nuevo', width: 150, align: 'right'},
        ]
        this.headers[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
        this.headers[0].value = this.$store.state.codigooid == 'C'?'codigo':'articulo_id'
        this.filtrar()
      } else if (cual=='backups') {
        this.filtrar()
      }
    },

    cpBorrar() {
      this.msg.msgTitle = 'Eliminar Cambios de Precios'
      this.msg.msgBody = 'Se eliminarán los cambios de precios seleccionados?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'Borrar Cambios de Precios'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    cpBorrarHTTP() {
      let s = []
      for (let i=0; i<=this.items.length-1; i++) {
        if (this.items[i].seleccionado) {
          s.push(this.items[i].id)
        }
      }
      return HTTP().post('/borrarpreciosseleccionados/', { s } ).then(({ data }) => {
        this.items = []
        this.msg.msgVisible = false
        if (data) {
          this.msg.msgTitle = 'Cambios de Precios Borrados'
          this.msg.msgBody = 'Los precios seleccionados fueron borrados!'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'eliminacion de cambios de precios'
          this.msg.msgButtons = ['Aceptar']
        }
      })
    },

    cpAplicar() {
      this.msg.msgTitle = 'Aplicar Cambios'
      if (this.selected.length==0) {
        this.msg.msgBody    = 'No se han seleccionado precios para modificar!'
        this.msg.msgAccion  = 'No hay precios seleccionados'
        this.msg.msgButtons = ['Aceptar']
      } else if (this.selected.length==1) {
        this.msg.msgBody    = 'Confirmas aplicar el nuevo precio seleccionado?'
        this.msg.msgAccion  = 'Aplicar precio seleccionado'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      } else if (this.selected.length>1) {
        this.msg.msgBody    = 'Confirmas aplicar los nuevos precios seleccionados?'
        this.msg.msgAccion  = 'Aplicar precios seleccionados'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      }
      this.msg.msgVisible = true
    },

    cpGenerar() {
      this.msg.msgTitle = 'Generar Archivo de Precios'
      let m = 'Vas a generar un archivo en formato Excel con todos tus precios. '
      m += 'En él vas a poder modificarlos y luego volcarlos al sistema.<br>'
      m += 'IMPORTANTE: Recuerda que solo deberás cambiar la columna <b>COSTO</b> '
      m += 'de la planilla. Este es el dato que impactará en la actualización.<br>'
      this.msg.msgBody = m
      this.msg.msgAccion  = 'Generar Archivo Excel'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.msg.msgVisible = true
    },

    cpGenerarExcelHTTP() {
      this.msg.msgVisible = false
      return HTTP().post('/articulox', {}).then(({ data })=>{
        if (data.length>0) {
          let p = 0
          this.items = []
          this.items.push(['ID','CODIGO','NOMBRE','COSTO','PORREM','PRECIO','IVA','FINAL']);
          for (let i=0; i<=data.length-1; i++) {
            p = i+2
            this.items.push([
              data[i].id,
              data[i].codigo,
              data[i].nombre,
              data[i].costo,
              data[i].porrem,
              {t:"n",f:"D"+p.toString()+"*(1+(E"+p.toString()+"/100))"},
              data[i].tasaiva,
              {t:"n",f:"F"+p.toString()+"*(1+(G"+p.toString()+"/100))"}
            ]);
          }
        }
        this.msg.msgVisible = false
        const filename = 'planila de actualizacion'
        var ws = XLSX.utils.aoa_to_sheet(this.items);
        const generate = () => {
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
          XLSX.writeFile(wb, `${filename}.xlsx`)
        };
        let xl = generate();
        this.items = []

        this.msg.msgTitle = '¡Archivo Generado!'
        let m = '¡Se ha generado el archivo <b>'+`${filename}.xlsx`+' </b>!.<br>'
        m += 'Revisa la carpeta <b>Descargas</b> en tu navegador.'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'archivo generado'
        this.msg.msgButtons = ['Aceptar']

      })
    },

    cpAplicarCambiosHTTP() {

      debugger
      let s = []
      for (let i=0; i<=this.selected.length-1; i++) {
        s.push( {
          id: this.selected[i].id,
          articulo_id: this.selected[i].articulo_id,
          precio: this.selected[i].costo_nuevo
        })
      }

      debugger
      return HTTP().post('/aplicarcambiosdepreciosseleccionados/', { s } ).then(({data})=>{

        debugger

        this.items = []
        this.selected = []
        this.msg.msgVisible = false
        let m = ''
        
        if (data=='error') {
          this.msg.msgTitle = '¡ERROR!'
          this.msg.msgBody = '¡Se ha producido un error al intentar actualizar estos precios!.'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'error'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.msg.msgTitle = 'Cambios de Precios Aplicados'
          m =  (data==1) ? 'Un precio fue modificado<br>' : data + ' precios fueron modificados.<br>'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'cambios de precios aplicados'
          this.msg.msgButtons = ['Aceptar']
        }
      })
    },

    getColor (activo) {
      return (activo) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    clickEnGrupo() {
      this.dialogGrupos = true;
    },

    cancelarDialogGrupos() {
      this.dialogGrupos = false
    },

    onScroll () {
      this.scrollInvoked++
    },

    preguntoBorrarCopia (item) {
      this.idCopia = item.id
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = '¿Confirma borrar esta Copia?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar copia'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    recuperarCopia (item) {
      this.idCopia = item.id
      this.msg.msgTitle = 'Recuperar Copia de Precios'
      let m = '<br><b>¡ATENCION!</b><br><br>'
      m += 'Este es un proceso sensible, vas a reemplazar todos los precios actuales por los de la copia.'
      m += '<br><br>¿Estas seguro?'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'recuperar copia'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    aceptarGrupos() {
      this.dialogGrupos = false
      // hev021
      this.nombreDelGrupo = 'Sel.grupos';
      if (this.selection.length>0) {
        this.nombreDelGrupo = '';
        for (let i=0; i<=this.selection.length-1; i++) {
          this.nombreDelGrupo += this.selection[i].name+','
        }
        this.nombreDelGrupo = this.nombreDelGrupo.substring(0,this.nombreDelGrupo.length-1)
      }
      this.filtrar()
    },

    formatoFechaYHora(fec) {
      return moment(fec).format('DD/MM/YYYY HH:mm')
    },

    itemtasaiva(item) {
      return item.tasaiva+'%'
    },

  }
}
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
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .fg70 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 70%;
  }
  .fg60 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 60%;
  }
  // 10986
</style> 
