<template>
  <v-layout align-start class="fg">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-3"
        :footer-props="footerProps"
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
              <v-btn
                fab
                :color="temas.forms_btn_add_bg"
                :dark="temas.forms_btn_add_dark==true"
                @click="nuevaLista">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>

            <v-toolbar-title>Listas de Precios</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="1000px"
              :transition="transition==null?'false':transition">
              <template v-slot:activator="{ on }"></template>
              <v-card class="fg">
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelar">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span>{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="cargaOk()"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="confirmar">
                    Confirmar
                  </v-btn>
                </v-toolbar>

                <v-form ref="form" class="fg">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="12" md="12" class="pl-6 pt-6 bt-0">

                        <v-row class="pl-4 pr-4">
                          <v-col cols="6">
                            <v-text-field
                              autofocus
                              ref="descripcion"
                              v-model="editadoLista.nombre"
                              class="text--left"
                              label="Nombre de la Lista"
                              :color="temas.forms_titulo_bg">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2">
                            <v-text-field
                              v-model="editadoLista.desc1"
                              class="text--left"
                              label="% de descuento 1"
                              :color="temas.forms_titulo_bg">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2">
                            <v-text-field
                              v-model="editadoLista.desc2"
                              class="text--left"
                              label="% de descuento 2"
                              :color="temas.forms_titulo_bg">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sx="3" mx="3"
                            class="pt-3 pb-0">
                            <v-switch
                              label="Activa"
                              :color="temas.forms_titulo_bg"
                              v-model="editadoLista.activo">
                            </v-switch>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" class="pl-7 pt-0">
                            <span>
                              <b>Importante</b><br>
                              Los descuentos generales aplicarán a todos los artículos, y
                              los descuentos definidos en Grupos, Marcas y/o Artículos
                              aplicarán a los artículos incluidos en los mismos.
                            </span>
                          </v-col>
                        </v-row>

                        <v-tabs
                          key="pri"
                          :color="temas.forms_titulo_bg"
                          class="fg pt-0 pl-4 pr-2">
                          <v-tab href="#grupos">
                            Grupos
                          </v-tab>
                          <v-tab href="#marcas">
                            Marcas
                          </v-tab>
                          <v-tab href="#articulos">
                            Artículos
                          </v-tab>

                          <v-tab-item value="grupos">

                            <v-data-table
                              :headers="headersGrupos"
                              :items="itemsGrupos"
                              dense
                              class="elevation-1">
                              <template v-slot:top>

                                <v-toolbar flat color="white">

                                  <v-dialog v-model="dialogGrupo" max-width="600px"
                                    :transition="transition==null?'false':transition">

                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        fab @click="nuevoGrupo"
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
                                          icon @click="dialogGrupo=false"
                                          :color="temas.forms_close_bg"
                                          :dark="temas.forms_close_dark==true">
                                          <v-icon>mdi-arrow-left-circle</v-icon>
                                        </v-btn>
                                        <span class="text--right">
                                          {{ formTitleGrupo }}
                                        </span>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                          v-if="(editadoGrupo.nombre&&editadoGrupo.desc1)"
                                          color="teal accent-4" class="ma-2 white--text"
                                          @click="guardarGrupo(editadoGrupo)">
                                          Guardar
                                        </v-btn>
                                      </v-toolbar>

                                      <v-card-text>
                                        <v-container>

                                          <v-card outlined class="pt-1 pb-1">
                                            <span class="pl-2">Grupo</span>
                                            <v-chip
                                              class="ma-2"
                                              @click="clickEnGrupo">
                                              Seleccione Un Grupo
                                            </v-chip>
                                            <span><b>{{ editadoGrupo.nombre }}</b></span>
                                          </v-card>

                                          <v-row>
                                            <v-col cols="6" sm="6" md="6">
                                              <v-text-field
                                                v-model="editadoGrupo.desc1"
                                                label="Descuento 1"
                                                :color="temas.forms_titulo_bg"
                                                required>
                                              </v-text-field>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6">
                                              <v-text-field
                                                v-model="editadoGrupo.desc2"
                                                label="Descuento 2"
                                                :color="temas.forms_titulo_bg"
                                                required>
                                              </v-text-field>
                                            </v-col>
                                          </v-row>
                                        </v-container>
                                      </v-card-text>
                                    </v-card>
                                  </v-dialog>
                                </v-toolbar>
                              </template>
                              <template v-slot:item.desc1="{ item }">
                                <span>%{{ formatoImporte(item.desc1) }}</span>
                              </template>
                              <template v-slot:item.desc2="{ item }">
                                <span>%{{ formatoImporte(item.desc2) }}</span>
                              </template>
                              <template v-slot:item.accion="{item}">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      class="mr-1" fab x-small
                                      :color="temas.forms_btn_add_bg"
                                      :dark="temas.forms_btn_add_dark==true"
                                      @click="borrarGrupo(item)" v-on="on">
                                      <v-icon dark>mdi-delete</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Desafectar Grupo</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      class="mr-1" fab x-small
                                      :color="temas.forms_btn_add_bg"
                                      :dark="temas.forms_btn_add_dark==true"
                                      @click="editarGrupo(item)" v-on="on">
                                      <v-icon dark>mdi-pencil</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Editar Grupo</span>
                                </v-tooltip>
                              </template>
                            </v-data-table>

                          </v-tab-item>

                          <v-tab-item value="marcas">

                            <v-data-table
                              :headers="headersMarcas"
                              :items="itemsMarcas"
                              dense
                              class="elevation-1">
                              <template v-slot:top>

                                <v-toolbar flat color="white">
                                  <v-dialog v-model="dialogMarca" max-width="600px"
                                    :transition="transition==null?'false':transition">

                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        fab @click="nuevaMarca"
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
                                          icon @click="dialogMarca=false"
                                          :color="temas.forms_close_bg"
                                          :dark="temas.forms_close_dark==true">
                                          <v-icon>mdi-arrow-left-circle</v-icon>
                                        </v-btn>
                                        <span class="text--right">
                                          {{ formTitleMarca }}
                                        </span>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                          v-if="(editadoMarca.marca_id&&
                                                editadoMarca.desc1)"
                                          color="teal accent-4" class="ma-2 white--text"
                                          @click="guardarMarca(editadoMarca)">
                                          Guardar
                                        </v-btn>
                                      </v-toolbar>

                                      <v-card-text>
                                        <v-container>
                                          <v-select
                                            label="Marca"
                                            v-model="editadoMarca.marca_id"
                                            :color="temas.forms_titulo_bg"
                                            :items="marItems"
                                            item-value="id"
                                            item-text="nombre"
                                            autocomplete>
                                          </v-select>
                                          <v-row>
                                            <v-col cols="6" sm="6" md="6">
                                              <v-text-field
                                                v-model="editadoMarca.desc1"
                                                label="Descuento 1"
                                                :color="temas.forms_titulo_bg"
                                                required>
                                              </v-text-field>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6">
                                              <v-text-field
                                                v-model="editadoMarca.desc2"
                                                label="Descuento 2"
                                                :color="temas.forms_titulo_bg"
                                                required>
                                              </v-text-field>
                                            </v-col>
                                          </v-row>
                                        </v-container>
                                      </v-card-text>
                                    </v-card>
                                  </v-dialog>
                                </v-toolbar>
                              </template>
                              <template v-slot:item.desc1="{ item }">
                                <span>%{{ formatoImporte(item.desc1) }}</span>
                              </template>
                              <template v-slot:item.desc2="{ item }">
                                <span>%{{ formatoImporte(item.desc2) }}</span>
                              </template>
                              <template v-slot:item.accion="{item}">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      class="mr-1" fab x-small
                                      :color="temas.forms_btn_add_bg"
                                      :dark="temas.forms_btn_add_dark==true"
                                      @click="borrarMarca(item)" v-on="on">
                                      <v-icon dark>mdi-delete</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Desafectar Marca</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      class="mr-1" fab x-small
                                      :color="temas.forms_btn_add_bg"
                                      :dark="temas.forms_btn_add_dark==true"
                                      @click="editarMarca(item)" v-on="on">
                                      <v-icon dark>mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Editar Marca</span>
                                </v-tooltip>
                              </template>
                            </v-data-table>
                          </v-tab-item>

                          <v-tab-item value="articulos">
                            <v-data-table
                              :headers="headersArticulos"
                              :items="itemsArticulos"
                              dense
                              class="elevation-1">
                              <template v-slot:top>

                                <v-toolbar flat color="white">
                                  <v-dialog v-model="dialogArticulo" max-width="600px"
                                    :transition="transition==null?'false':transition">

                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        fab @click="nuevoArticulo"
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
                                          icon @click="dialogArticulo=false"
                                          :color="temas.forms_close_bg"
                                          :dark="temas.forms_close_dark==true">
                                          <v-icon>mdi-arrow-left-circle</v-icon>
                                        </v-btn>
                                        <span class="text--right">
                                          {{ formTitleArticulo }}
                                        </span>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                          v-if="(editadoArticulo.nombre&&
                                                editadoArticulo.desc1)"
                                          color="teal accent-4" class="ma-2 white--text"
                                          @click="guardarArticulo(editadoArticulo)">
                                          Guardar
                                        </v-btn>
                                      </v-toolbar>

                                      <v-card-text>
                                        <v-container>
                                          <v-btn
                                            :color="temas.cen_btns_bg"
                                            :dark="temas.cen_btns_dark==true"
                                            class="ma-2 text-capitalize"
                                            @click="dialogBuscarArticulo=true">
                                            Buscar Artículo
                                          </v-btn>
                                          <span><b>{{ editadoArticulo.nombre }}</b></span>
                                          <v-row>
                                            <v-col cols="6" sm="6" md="6">
                                              <v-text-field
                                                v-model="editadoArticulo.desc1"
                                                label="Descuento 1"
                                                :color="temas.forms_titulo_bg"
                                                required>
                                              </v-text-field>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6">
                                              <v-text-field
                                                v-model="editadoArticulo.desc2"
                                                label="Descuento 2"
                                                :color="temas.forms_titulo_bg"
                                                required>
                                              </v-text-field>
                                            </v-col>
                                          </v-row>
                                        </v-container>
                                      </v-card-text>
                                    </v-card>
                                  </v-dialog>
                                </v-toolbar>
                              </template>
                              <template v-slot:item.desc1="{ item }">
                                <span>%{{ formatoImporte(item.desc1) }}</span>
                              </template>
                              <template v-slot:item.desc2="{ item }">
                                <span>%{{ formatoImporte(item.desc2) }}</span>
                              </template>
                              <template v-slot:item.accion="{item}">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      class="mr-1" fab x-small
                                      :color="temas.forms_btn_add_bg"
                                      :dark="temas.forms_btn_add_dark==true"
                                      @click="borrarArticulo(item)" v-on="on">
                                      <v-icon dark>mdi-delete</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Desafectar Artículo</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      class="mr-1" fab x-small
                                      :color="temas.forms_btn_add_bg"
                                      :dark="temas.forms_btn_add_dark==true"
                                      @click="editarArticulo(item)" v-on="on">
                                      <v-icon dark>mdi-pencil</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Editar Articulo</span>
                                </v-tooltip>
                              </template>
                            </v-data-table>

                          </v-tab-item>
                        </v-tabs>

                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              :color="temas.forms_titulo_bg"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>

        <template v-slot:item.desc1="{ item }">
          <span>%{{ formatoImporte(item.desc1) }}</span>
        </template>
        <template v-slot:item.desc2="{ item }">
          <span>%{{ formatoImporte(item.desc2) }}</span>
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
        <template v-slot:item.accion="{ item }">

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_editar_bg"
                :dark="temas.forms_btn_editar_dark==true"
                @click="editar(item)" v-on="on">
                <v-icon dark>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_borrar_bg"
                :dark="temas.forms_btn_borrar_dark==true"
                @click="preguntoBorrar(item)" v-on="on">
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Borrar Lista</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_add_bg"
                :dark="temas.forms_btn_add_dark==true"
                @click="preguntoBorrar(item)" v-on="on">
                <v-icon dark>mdi-account-multiple</v-icon>
              </v-btn>
            </template>
            <span>Clientes</span>
          </v-tooltip>

        </template>
      </v-data-table>

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
            <span>Seleccione el Grupo</span>
            <v-spacer></v-spacer>
            <v-btn
              @click="aceptarGrupo"
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
                      v-model="selectionGrupo"
                      return-object
                      selectable
                      open-all
                      item-key="id"
                      hoverable activatable dense
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      :items="itemsTreeGrupos"
                      @update:active="aceptarGrupo">
                    </v-treeview>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN SELECCION DE GRUPOS -->

      <!-- BUSCAR ARTICULO -->
      <v-dialog v-model="dialogBuscarArticulo" max-width="900px" max-height="600px"
        :transition="transition==null?'false':transition">
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="dialogBuscarArticulo=false">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span>Buscar Artículo</span>
            <v-spacer></v-spacer>
            <v-btn
              @click="seleccionarArticulo"
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="ma-2 white--text">
              Aceptar
            </v-btn>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-card max-width="900"
                  style="height: 545px;"
                  v-scroll.self="onScroll"
                  class="overflow-y-auto"
                  max-height="600">
                  <v-card-text>

                    <v-data-table
                      :headers="headersArticulos"
                      :items="articulos"
                      :search="searchArticulos"
                      dense
                      item-key="id"
                      class="elevation-1 pt-4"
                      :footer-props="footerProps"
                      @click:row="seleccionarArticulo">

                      <template v-slot:top>
                        <v-row>
                          <!-- Barra de búsqueda -->
                          <v-col cols="6" sm="6" class="pt-4 pb-5 ml-3 mr-6">
                            <v-text-field
                              autofocus
                              v-model="searchArticulos" dense
                              :color="temas.forms_titulo_bg"
                              append-icon="search"
                              label="Buscar"
                              single-line hide-details>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </template>
                    </v-data-table>

                  </v-card-text>
                </v-card>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN SELECCION DE GRUPOS -->

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

/* https://medium.com/js-dojo/how-to-build-a-reusable-vuejs-modal-component-fc8d7f3b4735 */

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from './Forms/confirmacion.vue';

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    modelo: 'listas',
    isLoadingMarcasFil: false,
    entriesMarcasFil: [],
    searchMarcasFil: '',
    nombreDelGrupo: 'Seleccione un Grupo',
    progress: false,
    scrollInvoked: 0,

    rubro: '',
    marca: '',
    grupo: '',
    articulo: '',

    itemActual: null,
    gruItems: [],
    rubItems: [],
    marItems: [],
    gruposValue: [],
    itemsGrupos: [],
    itemsMarcas: [],
    itemsArticulos: [],
    articulos: [],
    items: [],
    itemsTreeGrupos: [],
    selection: [],
    selectionGrupo: [{name:'Sin Grupos'}],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 80 || 'Ingrese hasta 80 caracteres'
    ],
    footerProps: {'items-per-page-options': [10]},
    search: '',
    searchArticulos: '',
    dialog: false,
    dialogGrupo: false,
    dialogGrupos: false,
    dialogMarca: false,
    dialogArticulo: false,
    dialogBuscarArticulo: false,
    
    editadoLista: {
      id: null,
      nombre: null,
      grupos: [],
      marcas: [],
      articulos: [],
      desc1: null,
      desc2: null,
      activo: null,
    },

    editadoDefaultLista: {
      id: null,
      nombre: null,
      grupos: [],
      marcas: [],
      articulos: [],
      desc1: null,
      desc2: null,
      activo: true,
    },

    editadoGrupo: {
      id: null,
      grupo_id: null,
      nombre: null,
      desc1: null,
      desc2: null,
    },

    editadoDefaultGrupo: {
      id: null,
      grupo_id: null,
      nombre: null,
      desc1: null,
      desc2: null,
    },

    editadoMarca: {
      id: null,
      marca_id: null,
      nombre: null,
      desc1: null,
      desc2: null,
    },

    editadoDefaultMarca: {
      id: null,
      marca_id: null,
      nombre: null,
      desc1: null,
      desc2: null,
    },

    editadoArticulo: {
      id: null,
      codigo: null,
      articulo_id: null,
      nombre: null,
      desc1: null,
      desc2: null,
    },

    editadoDefaultArticulo: {
      id: null,
      codigo: null,
      articulo_id: null,
      nombre: null,
      desc1: null,
      desc2: null,
    },

    headers: [
      { text: 'Id', value:'id', width: 70, align: 'right'},
      { text: 'Nombre', value:'nombre', width: 150, align: 'left'},
      { text: 'Desc1', value:'desc1', width: 80, align: 'end'},
      { text: 'Desc2', value:'desc2', width: 80, align: 'end'},
      { text: 'Clientes', value:'usersterceros.length', width: 80, align: 'end'},
      { text: 'Activo', value:'activo', width: 60},
      { text: 'ACCIONES', value:'accion', width: 150, sortable: false },
    ],

    headersGrupos: [
      { text: 'Nombre', value:'nombre', width: 55, align: 'left'},
      { text: '%Desc.1', value:'desc1', width: 55, align: 'end'},
      { text: '%Desc.2', value:'desc2', width: 55, align: 'end'},
      { text: 'ACCIONES', value:'accion', width: 120, sortable: false },
    ],

    headersMarcas: [
      { text: 'Nombre', value:'nombre', width: 55, align: 'left'},
      { text: '%Desc.1', value:'desc1', width: 55, align: 'end'},
      { text: '%Desc.2', value:'desc2', width: 55, align: 'end'},
      { text: 'ACCIONES', value:'accion', width: 120, sortable: false },
    ],

    headersArticulos: [
      { text: 'Id', value:'id', width: 100, align: 'end'},
      { text: 'Código', value:'codigo', width: 120, align: 'left'},
      { text: 'Nombre', value:'nombre', width: 300, align: 'left'},
      { text: '%Desc.1', value:'desc1', width: 55, align: 'right'},
      { text: '%Desc.2', value:'desc2', width: 55, align: 'right'},
    ],

    editedIndex: -1,
    editedIndexGrupo: -1,
    editedIndexMarca: -1,
    editedIndexArticulo: -1,
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
        'vinculosPadres', 'vinculosPadresLic', 'vinculosPadresAll', 'vinculosHijos', 'empresa', 'temas', 'dolar', 'externo', 'tipo', 'codigooid',
        'cttLoadReg', 'descuentos', 'transition'
      ]),
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Lista' : 'Editar Lista';
    },
    formTitleGrupo () {
      return this.editedIndexGrupo === -1 ? 'Nuevo Grupo' : 'Editar Grupo';
    },
    formTitleMarca () {
      return this.editedIndexMarca === -1 ? 'Nueva Marca' : 'Editar Marca';
    },
    formTitleArticulo () {
      return this.editedIndexArticulo === -1 ? 'Nuevo Artículo' : 'Editar Artículo';
    },
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
    dialog (val) {
      val || this.cancelar();
    },
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
    searchArticulos () {
      this.filtrar()
    }
  },

  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
    this.dialog = false;
    this.rubItems = []
    this.marItems = []
    this.gruItems = [{id: 0, nombre: 'Todos'}]
    return HTTP().get('/usersrubros').then(({ data }) => {
      for (let i=0; i<=data.length-1; i++) {
        this.rubItems.push(data[i].rubro)
      }
      this.rubro = this.rubItems[0]
      this.rubro_id = this.rubro.id                    // ver, puede tener mas rubros
      return HTTP().get('/marcasbus').then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          //this.marItems.push(data[i].nombre)
          this.marItems.push(data[i])
        }
        //this.marca = this.marItems[0].id
        return HTTP().get('/grupos').then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            this.gruItems.push(data[i].nombre)
          }
          //this.grupo = this.gruItems[0]
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
            this.listarHTTP();
          });
        });
      });
    });
  },
  
  methods: {
   ...mapMutations(['alert','closeAlert']),
   closeForm(){
     router.push('/')
    },

    listarHTTP:function() {
      debugger
      return HTTP().get('/listas/'+this.userId).then(({ data }) => {
        debugger
        this.items = data;
      });
    },

    editar (item) {

      debugger
      this.itemActual = item
      this.editedIndex = this.items.indexOf(item);
      this.editadoLista.id = item.id;

      this.itemsGrupos = []
      this.itemsMarcas = []
      this.itemsArticulos = []

      for (let i=0; i<=item.grupos.length-1; i++) {
        this.itemsGrupos.push({
          id: item.grupos[i].id,
          grupo_id: item.grupos[i].grupo_id,
          nombre: item.grupos[i].grupo.nombre,
          desc1: item.grupos[i].desc1,
          desc2: item.grupos[i].desc2,
        })
      }

      for (let i=0; i<=item.marcas.length-1; i++) {
        this.itemsMarcas.push({
          id: item.marcas[i].id,
          marca_id: item.marcas[i].marca_id,
          nombre: item.marcas[i].marca.nombre,
          desc1: item.marcas[i].desc1,
          desc2: item.marcas[i].desc2,
        })
      }

      for (let i=0; i<=item.articulos.length-1; i++) {
        this.itemsArticulos.push({
          id:          item.articulos[i].id,
          articulo_id: item.articulos[i].articulo.id,
          codigo:      item.articulos[i].articulo.codigo,
          nombre:      item.articulos[i].articulo.nombre,
          desc1:       item.articulos[i].desc1,
          desc2:       item.articulos[i].desc2,
        })
      }

      this.editadoLista.grupos = item.grupos;
      this.editadoLista.marcas = item.marcas;
      this.editadoLista.articulos = item.articulos;
      this.editadoLista.nombre = item.nombre;
      this.editadoLista.desc1 = this.roundTo(item.desc1,2);
      this.editadoLista.desc2 = this.roundTo(item.desc2,2);
      this.editadoLista.activo = item.activo;

      if (this.editadoLista.grupos) {
        this.editadoLista.grupos.forEach(x => {
          this.selectionGrupo.push(x.nombre)
        })
      }

      this.dialog = true;
    },

    nuevaLista() {
      this.editedIndex = -1;
      this.searchArticulos = '';
      this.itemsGrupos = [];
      this.itemsMarcas = [];
      this.itemsArticulos = [];
      this.nombreDelGrupo = 'Seleccione un Grupo';
      this.dialog = true;
      this.editadoLista = Object.assign({}, this.editadoDefaultLista);
    },

    nuevoGrupo() {
      debugger
      this.dialogGrupo = true;
      this.editedIndexGrupo = -1;
      this.editadoGrupo = Object.assign({}, this.editadoDefaultGrupo);
    },

    nuevaMarca() {
      this.dialogMarca = true;
      this.editedIndexMarca = -1;
      this.editadoMarca = Object.assign({}, this.editadoDefaultMarca);
    },

    nuevoArticulo() {
      this.dialogArticulo = true;
      this.editedIndexArticulo = -1;
      this.editadoArticulo = Object.assign({}, this.editadoDefaultArticulo);
    },

    editarGrupo (item) {
      this.editadoGrupo = Object.assign({}, item);
      this.editedIndexGrupo = this.itemsGrupos.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogGrupo = true;
    },

    editarMarca (item) {
      this.editadoMarca = Object.assign({}, item);
      this.editedIndexMarca = this.itemsMarcas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogMarca = true;
    },

    editarArticulo (item) {
      this.editadoArticulo = Object.assign({}, item);
      this.editedIndexArticulo = this.itemsArticulos.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogArticulo = true;
    },

    borrarGrupo (item) {
      const index = this.itemsGrupos.indexOf(item);
      this.itemsGrupos.splice(index, 1)
    },

    borrarMarca (item) {
      const index = this.itemsMarcas.indexOf(item);
      this.itemsMarcas.splice(index, 1)
    },

    borrarArticulo (item) {
      const index = this.itemsArticulos.indexOf(item);
      this.itemsArticulos.splice(index, 1)
    },

    guardarGrupo(item) {
      debugger
      if (this.editedIndexGrupo > -1) { // esta modificando
        this.itemsGrupos[this.editedIndexGrupo].id = this.editadoGrupo.id;
        this.itemsGrupos[this.editedIndexGrupo].grupo_id = this.editadoGrupo.grupo_id;
        this.itemsGrupos[this.editedIndexGrupo].nombre = this.editadoGrupo.nombre;
        this.itemsGrupos[this.editedIndexGrupo].desc1 = this.editadoGrupo.desc1;
        this.itemsGrupos[this.editedIndexGrupo].desc2 = this.editadoGrupo.desc2;
      } else {
        this.itemsGrupos.push({ 
          id: null, 
          grupo_id: this.editadoGrupo.grupo_id, 
          nombre: this.editadoGrupo.nombre,
          desc1: this.editadoGrupo.desc1,
          desc2: this.editadoGrupo.desc2,
        })
      }
      this.dialogGrupo = false
    },

    guardarMarca(item) {
      debugger
      if (this.editedIndexMarca > -1) { // esta modificando
        this.itemsMarcas[this.editedIndexMarca].id = this.editadoMarca.id;
        this.itemsMarcas[this.editedIndexMarca].marca_id = this.editadoMarca.marca_id;
        this.itemsMarcas[this.editedIndexMarca].nombre = this.editadoMarca.nombre;
        this.itemsMarcas[this.editedIndexMarca].desc1 = this.editadoMarca.desc1;
        this.itemsMarcas[this.editedIndexMarca].desc2 = this.editadoMarca.desc2;
      } else {
        let pos = this.marItems.findIndex(x=>x.id==this.editadoMarca.marca_id)
        this.itemsMarcas.push({ 
          id: null, 
          marca_id: this.editadoMarca.marca_id, 
          nombre: this.marItems[pos].nombre,
          desc1: this.editadoMarca.desc1,
          desc2: this.editadoMarca.desc2,
        })
      }
      this.dialogMarca = false
    },

    guardarArticulo(item) {
      debugger
      if (this.editedIndexArticulo > -1) { // esta modificando
        this.itemsArticulos[this.editedIndexArticulo].id = this.editadoArticulo.id;
        this.itemsArticulos[this.editedIndexArticulo].codigo = this.editadoArticulo.codigo;
        this.itemsArticulos[this.editedIndexArticulo].articulo_id = this.editadoArticulo.articulo_id;
        this.itemsArticulos[this.editedIndexArticulo].nombre = this.editadoArticulo.nombre;
        this.itemsArticulos[this.editedIndexArticulo].desc1 = this.editadoArticulo.desc1;
        this.itemsArticulos[this.editedIndexArticulo].desc2 = this.editadoArticulo.desc2;
      } else {
        //let pos = this.marItems.findIndex(x=>x.id==this.editadoMarca.marca_id)
        this.itemsArticulos.push({ 
          id: null, 
          codigo: this.editadoArticulo.codigo, 
          articulo_id: this.editadoArticulo.articulo_id, 
          nombre: this.editadoArticulo.nombre,
          desc1: this.editadoArticulo.desc1,
          desc2: this.editadoArticulo.desc2,
        })
      }
      this.dialogArticulo = false
    },

    altaHTTP:function() {

      debugger
      return HTTP().post('/'+this.modelo, {
        id: this.editadoLista.id,
        nombre: this.editadoLista.nombre,
        grupos: this.itemsGrupos,
        marcas: this.itemsMarcas,
        articulos: this.itemsArticulos,
        desc1: this.editadoLista.desc1,
        desc2: this.editadoLista.desc2,
        activo: this.editadoLista.activo,
        }).then(({ data }) => {

          debugger
          if (data=='error') {
            this.mensaje('¡Se ha producido un error al crear la lista!', 'black', 1500) 
          } else {
            this.mensaje('¡La lista se ha creado con éxito!', 'black', 1500) 
          }
          this.listarHTTP();
        });
    },

    editarHTTP:function(data) {

      debugger
      data.grupos = this.itemsGrupos;
      data.marcas = this.itemsMarcas;
      data.articulos = this.itemsArticulos;
      return HTTP().patch(`${this.modelo}/${this.itemActual.id}`, data).then((data) => {
        if (data=='error') {
          this.mensaje('¡Se ha producido un error al actualizar la lista!', 'black', 1500) 
        } else {
          this.mensaje('¡Actualización Exitosa!', 'black', 1500) 
        }
        this.listarHTTP();
      });       
    },

    borrarHTTP:function(data) {
      return HTTP().delete(`/${this.modelo}/${data.id}`).then(() => {
        this.listarHTTP();
      });
    },

    preguntoBorrar (item) {
      this.msg.msgTitle = 'Borrar Lista de Precios'

      let m='<br>'
      if (item.usersterceroslistas.length>0) {
        if (item.usersterceroslistas.length==1) {
          m += 'Atención: ¡Esta Lista esta asignada a un Cliente!<br>'
        } else {
          m += 'Atención: ¡Esta Lista esta asignada a '+ item.usersterceroslistas.length + ' Clientes!<br>'
        }
      }
      m += 'Confirmas borrar <b>'+item.nombre+'</b><br><br>'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    confirmar() {
      // NO SE PUEDE CREAR UNA REGLA GLOBAL SI HAY OTRAS ACTIVAS
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      if (this.editedIndex > -1) { // esta modificando
        this.editarHTTP(this.editadoLista);
      } else {
        this.altaHTTP();
      }
      this.cancelar();
    },

    borrar (item) {
      const index = this.items.indexOf(item);
      var r = confirm('¿Está seguro de borrar el registro?');
      this.snackbar = true;
      if (r === true) {
        this.borrarHttp(this.items[index].id);
        this.textSnack = 'Se eliminó el registro.';
      } else {
        this.textSnack = 'Operación cancelada.';
      }
    },

    cancelar() {
      this.dialog = false;
      this.editadoLista = Object.assign({}, this.editadoDefaultLista);
      this.editedIndex = -1;
    },

    cargaOk() {
      let ok = true
      if (this.editadoLista.nombre==''||
          this.editadoLista.desc1=='') {
        ok = false
      }
      return ok
    },

    clickRow(value) {
      if (!this.msg.msgVisible) {
        this.itemActual = value
        this.editar(this.itemActual)
      }
    },

    clickEnGrupo() {
      this.dialogGrupos = true;
    },

    seleccionarArticulo(value) {
      debugger
      this.dialogBuscarArticulo = false
      this.editadoArticulo.articulo_id = value.id
      this.editadoArticulo.codigo = value.codigo
      this.editadoArticulo.nombre = value.nombre
    },

    cancelarDialogGrupos() {
      this.dialogGrupos = false
    },

    aceptarGrupo() {
      debugger
      this.editadoGrupo.id = null
      this.editadoGrupo.grupo_id = this.selectionGrupo[0].id
      this.editadoGrupo.nombre = this.selectionGrupo[0].name
      this.editadoGrupo.desc1 = 0
      this.editadoGrupo.desc2 = 0
      this.dialogGrupos = false
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
      this.nombreDelGrupo = ret.id+'-'+ret.name
      this.editadoLista.grupo_id = ret.id
      this.dialogGrupos = false
    },


    filtrar() {
      //let v = [] // Solo articulos del usuario actual
      let s = this.search ? this.search : ''
      //v.push(this.userId)
      this.progress = true
      debugger
      return HTTP().post('/articuloz', {
        search: s,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: 0, stockProv: false, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: this.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: 300 }).then(({ data })=>{
        debugger

      /*
      return HTTP().post('/articulosx', {
        search: s, vinculos: v, 
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        estricto: false, codigooid: this.$store.state.codigooid, userex: null, dolar: this.$store.state.dolar, ambiente: 'articulos',
        tipo: '', rubro: '', marca: '', grupo: '', proveedor: 0, ancla: false, saySoloArtsPropios: false, activos: true, limit: 300,
        descuentos:[]}).then(({ data })=>{
      */
        if (data) {
          this.articulos = []
          for (let i=0; i<=data.length-1; i++) {
            this.articulos.push({ 
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
        this.progress = false
      })
      .catch(err => {
        console.log(err)
      })
    },

    onScroll () {
      this.scrollInvoked++
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoFecha(value) {
      return moment(String(value)).format('L')
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    getEstado (estado, accion) {
      let c = ''
      let e = ''
      if (estado==='A') {
        e = 'Activa'
        c = 'light-green accent-1'
      } else if (estado==='P') {
        e = 'Inactiva'
        c = 'red lighten-3'
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrarHTTP(this.itemActual)
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

  },

};
</script>

<style scoped>
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
</style>