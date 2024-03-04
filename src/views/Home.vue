<template>
  <div id="app">
    <v-layout class="mt-0" row wrap justify-center>
      <v-flex>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-container fluid v-show="$store.state.activo && $store.state.ofertas">
                <v-card flat>
                  <v-row>
                    <v-col cols="3" sm="3" md="3">
                      <v-card flat class="fg ml-0 mt-0 text-center">
                        <v-row>
                          <v-col cols="1" sm="1" md="1">
                            <v-btn
                              icon
                              @click="closeForm">
                              <v-icon>mdi-arrow-left-circle</v-icon>
                            </v-btn>
                          </v-col>
                          <v-col cols="11" sm="11" md="11">
                            <v-select class="fg pl-2"
                              label="Proveedor"
                              v-model="proveedor_id"
                              :items="proveedoresx"
                              :color="$store.state.temas.forms_titulo_bg"
                              item-value="id"
                              item-text="nombre"
                              @change="cambioProveedor()">
                            </v-select>
                          </v-col>
                        </v-row>
                      </v-card>

                      <v-card flat class="fg ml-0 mt-0 text-center">
                        <v-card-subtitle>
                          <span class="fg120 font-weight-light ml-2">Rubros</span>
                          <div class="text-left">
                            <v-card-text class="pt-0 pb-0 pl-0 text--primary">
                              <div class="text-left" v-if="rubItems.length>0">
                                <v-chip-group column multiple>
                                  <v-chip v-for="(rub, i) in rubItems" :key="i"
                                    class="ml-3 ma-1 fg85" outlined multiple small
                                    @click="filtrar('R',rub)">
                                    {{ rub.nombre }}
                                    <v-avatar v-if="rub.sel">
                                      <v-icon>mdi-18px mdi-checkbox-marked-circle</v-icon>
                                    </v-avatar>
                                  </v-chip>
                                </v-chip-group>
                              </div>
                            </v-card-text>
                          </div>
                        </v-card-subtitle>

                        <v-divider class="mx-1"></v-divider>

                        <v-card-subtitle>
                          <span class="fg120 font-weight-light ml-2">Grupos</span>
                          <div class="text-left">
                            <v-card-text class="pt-0 pb-0 pl-0 text--primary">
                              <div class="text-left" v-if="gruItems.length>0">
                                <v-chip-group column multiple>
                                  <v-chip v-for="(gru, i) in gruItems" :key="i"
                                    class="ml-3 ma-1 fg85" outlined multiple small
                                    :disabled="gru.childs"
                                    @click="filtrar('G',gru)">
                                    {{ gru.name }}
                                    <v-avatar v-if="gru.sel">
                                      <v-icon>mdi-18px mdi-checkbox-marked-circle</v-icon>
                                    </v-avatar>
                                  </v-chip>
                                </v-chip-group>
                              </div>
                            </v-card-text>
                          </div>
                        </v-card-subtitle>

                        <v-card-subtitle>
                          <span class="fg120 font-weight-light ml-2">Marcas</span>
                          <div class="text-left">
                            <v-card-text class="pt-0 pb-0 pl-0 text--primary">
                              <div class="text-left" v-if="marItems.length>0">
                                <v-chip-group column multiple>
                                  <v-chip v-for="(mar, i) in marItems" :key="i"
                                    class="ml-3 ma-1 fg85" outlined multiple
                                    small @click="filtrar('M',mar)">
                                    {{ mar.nombre }}
                                    <v-avatar v-if="mar.sel">
                                      <v-icon>mdi-18px mdi-checkbox-marked-circle</v-icon>
                                    </v-avatar>
                                  </v-chip>
                                </v-chip-group>
                              </div>
                            </v-card-text>
                          </div>
                        </v-card-subtitle>

                      </v-card>
                    </v-col>

                    <!--
                      /////////////
                      OFERTAS
                      /////////////
                    -->
                    <v-col cols="5" sm="5">
                      <v-card flat class="fg ml-0 mt-1 text-center">
                        <v-row class="pt-0">

                          <v-col cols="8" class="mt-2 ml-6">
                            <v-text-field
                              outlined dense small
                              v-model="search" clearable
                              append-icon="search"
                              label="ID, Código, Texto o Cód.de Barra"
                              :color="$store.state.temas.forms_titulo_bg"
                              class="fg pt-0"
                              single-line hide-details>
                            </v-text-field>
                          </v-col>

                          <v-col cols="3" class="mt-2 ml-0">
                            <v-btn
                              outlined @click="filtrar('',null)">
                              Buscar
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>

                      <v-card flat class="pt-0">
                        <v-row v-show="ofertas.length>0">
                          <v-col cols="12" sm="12" md="12">

                            <v-card flat>
                              <v-container fluid class="pt-0">
                                <v-row justify="start">
                                  <v-col
                                    v-for="(item,i) in ofertas" :key="i"
                                    :src="item.src" cols="12" md="6">
                                    <div class="contenedor-galeria">
                                      <v-hover v-slot="{ hover}">
                                        <v-card class="mx-auto my-12" max-width="250"
                                        :elevation="hover ? 12 : 1"
                                        open-delay="200"
                                        :class="{ 'on-hover': hover }">
                                        <template slot="progress"></template>
                                        <v-btn class="mt-2 ml-2"
                                          v-if="item.detalles!=null"
                                          fab x-small icon
                                          @click="verDetallesDeLaPublicacion(item)">
                                          <v-icon>mdi-format-align-justify</v-icon>
                                        </v-btn>
                                        <v-img v-if="item.fotos.length>0" height="100"
                                          :eager="true"
                                          :src=laFoto(item)
                                          class="galeria__img mt-4 mb-4"
                                          @click="verFotos(item)">
                                        </v-img>
                                        <v-img v-else height="100"
                                          :src="`/images/Sin Imagen.jpg`">
                                        </v-img>

                                          <!--
                                            ///////////////
                                            ARTICULO OFERTA
                                            ///////////////
                                          -->

                                          <div v-if="item.estado=='A'">
                                            <v-card-text class="pt-2 pb-2">
                                              <div class="fg">
                                                <v-row>
                                                  <v-col cols="12">
                                                    <v-img
                                                      height="35" width="59"
                                                      :src="
                                                      $store.state.dark?
                                                      '/images/oferta_dark.jpg':
                                                      '/images/oferta.jpg'
                                                      "
                                                      class="galeria__img mt-4 mb-4">
                                                    </v-img>
                                                    ${{elPrecio(item,'original')}}
                                                    <span class="fg80br">
                                                      %{{item.tasadescuento}} Off.
                                                    </span>
                                                    <span class="fg85">
                                                      {{ $store.state.proveedor.preciosconiva?
                                                        'c/IVA':'s/IVA'
                                                      }}
                                                    </span>
                                                  </v-col>
                                                </v-row>
                                              </div>

                                              <div class="fg150b mb-2">
                                                <div>
                                                  ${{ elPrecio(item,'precio') }}
                                                  <v-badge v-if="item.unidades>0"
                                                    class="pl-2 pt-1"
                                                    :content="item.unidades"
                                                    :value="item.unidades"
                                                    :color="$store.state.temas.forms_btn_add_bg"
                                                    :dark="$store.state.temas.forms_btn_add_bg">
                                                  </v-badge>
                                                  <v-badge v-else class="pl-2 pt-0"
                                                    content="s/Stock"
                                                    :color="$store.state.temas.forms_btn_add_bg"
                                                    :dark="$store.state.temas.forms_btn_add_bg">
                                                  </v-badge>
                                                </div>
                                              </div>

                                              <div>
                                                <span class="fg75">
                                                  precio de hace
                                                  {{ fechadelprecio(item.updated_at) }}
                                                </span>
                                              </div>

                                              <div class="fg80br font-weight-bold"
                                                v-if="item.estado=='P'">
                                                {{'Pausada'}}
                                              </div>

                                              <div>
                                                <div class="fg85">
                                                  {{item.nombre}}
                                                  <b>
                                                    ({{ item.codigo }}/{{ item.articulo_id }})
                                                  </b>
                                                </div>
                                              </div>
                                            </v-card-text>

                                            <v-divider class="mx-4"></v-divider>

                                            <v-card-text>
                                              <v-row>
                                                <v-col cols="4" sm="4" md="4" class="pt-4">
                                                  <v-tooltip bottom
                                                    v-if="item.unidades>0
                                                    && $store.state.operarioEsVendedor==false">
                                                    <template v-slot:activator="{ on }">
                                                      <v-btn
                                                        class="ml-0"
                                                        :disabled="item.estado!='A'"
                                                        fab x-small
                                                        @click="loQuiero(item)" v-on="on">
                                                        <v-icon dark>
                                                          {{ item.loquiero==true ?
                                                          'mdi-heart-broken' : 'mdi-heart' }}
                                                        </v-icon>
                                                      </v-btn>
                                                    </template>
                                                    <span>
                                                      {{ !item.loquiero?
                                                      'Lo quiero':
                                                      'Ya no lo quiero'
                                                      }}
                                                    </span>
                                                  </v-tooltip>
                                                </v-col>

                                                <v-col cols="4" sm="4" md="4"
                                                  align="center"
                                                  class="pt-0"
                                                  v-if="item.loquiero">
                                                  <v-text-field
                                                    :disabled="!item.loquiero"
                                                    class="caption" x-small
                                                    v-model="ctt"
                                                    :color="$store.state.temas.forms_titulo_bg"
                                                    type="number" label="Unid" min="0"
                                                    :max="item.unidades">
                                                  </v-text-field>
                                                </v-col>

                                                <v-col cols="4" sm="4" md="4"
                                                  align="center"
                                                  class="pt-4"
                                                  v-if="item.loquiero">
                                                  <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                      <v-btn class="ml-0"
                                                        :disabled="item.estado!='A'||ctt<=0"
                                                        fab x-small
                                                        @click="agregarAlCarrito(item)"
                                                        v-on="on">
                                                        <v-icon dark>mdi-cart</v-icon>
                                                      </v-btn>
                                                    </template>
                                                    <span>Agregar al Carrito</span>
                                                  </v-tooltip>
                                                </v-col>
                                              </v-row>
                                            </v-card-text>

                                          </div>

                                          <!--
                                            ///////////////////
                                            FIN ARTICULO OFERTA
                                            ///////////////////
                                          -->

                                          <!--
                                            ///////////////
                                            ARTICULO NORMAL
                                            ///////////////
                                          -->
                                          <div v-else>

                                            <v-card-text class="pt-2 pb-2">
                                              <div class="fg150b mb-2">
                                                <div>

                                                  <span v-if="item.loTengo"
                                                    :style="{ color: 'green' }">
                                                    <b>
                                                      {{item.simbolo=='PES'?'$':'us$'}}
                                                      {{ elPrecio(item,'precio') }}
                                                    </b>
                                                  </span>
                                                  <span v-else
                                                    :style="{ color: 'black' }">
                                                    <b>
                                                      {{item.simbolo=='PES'?'$':'us$'}}
                                                      {{ elPrecio(item,'precio') }}
                                                    </b>
                                                  </span>

                                                  <span class="fg80br">
                                                    %{{item.tasadescuento}} Off.
                                                  </span>
                                                  <!-- gilgamesh -->
                                                  <span class="fg45">
                                                    {{ $store.state.proveedor.preciosconiva?
                                                      'c/IVA':'s/IVA'
                                                    }}
                                                  </span>

                                                  <br>
                                                  <span v-if="item.desc1" class="fg55"
                                                    :style="{ color: 'green' }">
                                                    <b>{{ sayDesc(item) }}desc.</b>
                                                  </span>

                                                  <v-badge v-if="item.stock>0"
                                                    class="pl-2 pt-0"
                                                    :content="formatoImporte(item.stock)"
                                                    :value="item.stock"
                                                    :color="$store.state.temas.forms_btn_add_bg"
                                                    :dark=
                                                    "$store.state.temas.forms_btn_add_bg==true">
                                                  </v-badge>
                                                  <v-badge v-else-if="item.stock=='hay/stk'"
                                                    class="pl-2 pt-0"
                                                    content="hay stock"
                                                    :color="$store.state.temas.forms_btn_add_bg"
                                                    :dark=
                                                    "$store.state.temas.forms_btn_add_bg==true">
                                                  </v-badge>
                                                  <v-badge v-else class="pl-2 pt-0"
                                                    content="s/Stock"
                                                    :color=
                                                    "$store.state.temas.forms_btn_add_bg"
                                                    :dark=
                                                    "$store.state.temas.forms_btn_add_bg==true">
                                                  </v-badge>
                                                </div>
                                              </div>

                                              <div>
                                                <span class="fg75">
                                                  precio de hace
                                                  {{ fechadelprecio(item.updated_at) }}
                                                </span>
                                              </div>

                                              <div>
                                                <div class="fg85">
                                                  {{item.nombre}}<br>
                                                  <b>
                                                    ({{ item.codigo }}
                                                    / id:{{ item.articulo_id }})
                                                    / Stk: {{ item.stock }}
                                                  </b>
                                                </div>
                                              </div>

                                            </v-card-text>

                                            <v-divider class="mx-4"></v-divider>
                                            <v-card-text>
                                              <v-row>
                                                <v-col cols="4" sm="4" md="4" class="pt-4">
                                                  <v-tooltip bottom
                                                    v-if="item.stock>0||item.stock=='hay/stk'">
                                                    <template v-slot:activator="{ on }">
                                                      <v-btn
                                                        class="ml-0"
                                                        fab x-small
                                                        @click="loQuiero(item)" v-on="on">
                                                        <v-icon dark>
                                                          {{ item.loquiero==true ?
                                                          'mdi-heart-broken' : 'mdi-heart' }}
                                                        </v-icon>
                                                      </v-btn>
                                                    </template>
                                                    <span>
                                                      {{ !item.loquiero?
                                                      'Lo quiero':
                                                      'Ya no lo quiero'
                                                      }}
                                                    </span>
                                                  </v-tooltip>
                                                </v-col>

                                                <v-col cols="4" sm="4" md="4"
                                                  align="center"
                                                  class="pt-0"
                                                  v-if="item.loquiero">
                                                  <v-text-field
                                                    :disabled="!item.loquiero"
                                                    class="caption" x-small v-model="ctt"
                                                    :color="$store.state.temas.forms_titulo_bg"
                                                    type="number" label="Unid" min="0"
                                                    :max="item.stock">
                                                  </v-text-field>
                                                </v-col>

                                                <v-col cols="4" sm="4" md="4"
                                                  align="center"
                                                  class="pt-4"
                                                  v-if="item.loquiero">
                                                  <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                      <v-btn class="ml-0"
                                                        :disabled="item.stock<=0&&
                                                        item.stock!='HAY STOCK'"
                                                        fab x-small color="white"
                                                        @click="agregarAlCarrito(item)"
                                                        v-on="on">
                                                        <v-icon dark>mdi-cart</v-icon>
                                                      </v-btn>
                                                    </template>
                                                    <span>Agregar al Carrito</span>
                                                  </v-tooltip>
                                                </v-col>

                                              </v-row>
                                            </v-card-text>

                                          </div>
                                          <!--
                                            ///////////////////
                                            FIN ARTICULO NORMAL
                                            ///////////////////
                                          -->

                                        </v-card>
                                      </v-hover>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-card>

                          </v-col>
                        </v-row>

                      </v-card>
                    </v-col>

                    <!--
                      ///////////////
                      CARRITO
                      ///////////////
                    -->

                    <v-col cols="4" sm="4" md="4" class="pr-5">

                      <v-card v-if="carro.length>0"
                        class="fg85 pt-0">
                        <v-card-title>
                          <span>Carrito</span>
                        </v-card-title>
                        <v-card-text>
                          <div>
                            <div v-for="(c, i) in carro" :key="i" class="pt-5">
                              <v-row>
                                <v-col cols="4" class="pt-0">
                                  <span class="fg85">{{c.codigo}}/{{ c.articulo_id }}</span>
                                </v-col>
                                <v-col cols="8" class="pt-0">
                                  <span class="fg85">{{c.nombre}}</span>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="3" class="pt-0">
                                  <span class="fg85">{{ formatoImporte(c.ctt) }}/un x</span>
                                </v-col>
                                <v-col cols="3" class="pt-0">
                                  <span class="fg85">${{ formatoImporte(c.precio)}}</span>
                                </v-col>
                                <v-col cols="3" class="pt-0">
                                  <span class="fg85">= ${{ formatoImporte(c.total) }}</span>
                                </v-col>
                                <v-col cols="3" class="pt-0 pb-6">
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-btn
                                        fab x-small
                                        @click="borrarLineaDelCarrito(c)" v-on="on">
                                        <v-icon>mdi-delete</v-icon>
                                      </v-btn>
                                    </template>
                                    <span class="fg">Borrar Linea</span>
                                  </v-tooltip>
                                </v-col>
                              </v-row>
                              <v-divider class="mx-0 pt-3 pb-3"></v-divider>
                            </div>
                            <span>
                              TOTAL{{'\xa0'}}<b>${{formatoImporte(totalCarro)}}</b>
                            </span>
                          </div>

                          <v-row class="pt-0">
                            <v-col cols="4"></v-col>
                            <v-col cols="8" class="mt-0 ml-2" v-if="carro.length>0">
                              <v-btn class="mt-0 ml-0 text-capitalize"
                                :color="$store.state.temas.forms_btn_add_bg"
                                :style="{'color': 'white'}"
                                small
                                @click="generarPedidoOfertas">
                                Generar Pedido
                              </v-btn>
                              <v-btn class="mt-0 ml-2 text-capitalize"
                                :color="$store.state.temas.forms_btn_add_bg"
                                :style="{'color': 'white'}"
                                small
                                @click="vaciarCarrito">
                                Vaciar Carrito
                              </v-btn>
                            </v-col>
                          </v-row>

                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
                <!-- FINALIZA OFERTAS-->
              </v-container>


            </v-col>
          </v-row>
        </v-container>

        <!-- DIALOGO DETALLES DE LA PUBLICACION -->
        <v-dialog v-model="dialogDetalles" max-width="700px" persistent
          :transition="$store.state.transition==null?'false':$store.state.transition"
          v-show="$store.state.activo">
          <template v-slot:activator="{}"></template>
          <v-toolbar flat dark
            :color="$store.state.temas.forms_titulo_bg">
            <v-btn icon
              @click="cerrarDetallesPublicacion"
              :color="$store.state.temas.forms_close_bg"
              :dark="$store.state.temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="text--right">
              Detalles de la Publicación
            </span>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sx="12" mx="12">
                    <v-textarea
                      v-model="detPub"
                      :color="$store.state.temas.forms_titulo_bg"
                      readonly
                      rows="15">
                    </v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- FIN DIALOGO DETALLES DE LA PUBLICACION -->

        <!-- DIALOGO FOTOS DE LA PUBLICACION -->
        <v-dialog v-model="dialogVerFotos" max-width="700px"
          :transition="$store.state.transition==null?'false':$store.state.transition"
          v-show="$store.state.activo">
          <template v-slot:activator="{}"></template>
          <v-toolbar flat dark
            :color="$store.state.temas.forms_titulo_bg">
            <v-btn icon
              @click="cerrarFotosDeLaPublicacion"
              :color="$store.state.temas.forms_close_bg"
              :dark="$store.state.temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="fg">
              Fotos de la Publicación
            </span>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card>
            <v-carousel
              cycle height="550"
              :interval="2000"
              :show-arrows="true"
              :hide-delimiters="false">
              <v-carousel-item
                v-for="(item,i) in fotos" :key="i"
                :src="`/images/${item.foto}`" contain
                :ripple="true"
                reverse-transition="fade-transition"
                transition="fade-transition">
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </v-dialog>
        <!-- FIN DIALOGO FOTOS DE LA PUBLICACION -->

        <!-- toDo y errores -->
        <!--
        <v-container fluid v-show="$store.state.activo && !$store.state.ofertas">
          <v-card flat height="1550" width="1200" class="pt-0">
            <v-card-text class="fg pt-0">
              <div>
                <span>
                  Anotaciones: <br>Cuando se realiza una NDC a un cliente vinculado
                  esta se genera automaticamente en el usuario cliente.
                  Pero si el cliente no ha bajado todavia la factura madre
                  se produce un error, ya que no puede generar la vinculacion
                  de la FAC con la NDC en el Cliente.<br>
                  La mejor sulución sería que cuando el Proveedor factura
                  se haga lo mismo que con las NDC, que tambien se genere
                  el espejo en el Cliente, y que solo notifique al Cliente
                  del nuevo comprobante, en este caso, de compras.<br>
                  Sería utilizar el mismo metodo que cuando es NDD o NDC.
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
        -->

        <!-- MENSAJE INICIAL -->
        <v-container fluid v-show="
          $store.state.inicial && $store.state.activo && !$store.state.ofertas">
          <v-card flat height="1550" max-width class="pt-0">
            <v-card-text class="fg pt-0">
              <div v-if="$store.state.tipo=='CO'||$store.state.tipo=='ME'||$store.state.tipo=='BA'">
                Antes que nada, gracias por confiar en nosotros.<br><br>
                Ahora tienes que terminar de configurar tu cuenta, ¡es fácil!.<br><br>
                <b>gohu</b> ya inicializó algunos datos, creó dos sucursales, una de producción
                y la otra de puebas, ambas con sus respectivos depósitos de stock.<br>
                También se te asignó el cliente CONSUMIDOR FINAL y tu primer proveedor:
                <b>gohu</b>.
                <br><br>
                Ahora vamos a necesitar que completes toda la información necesaria
                para que puedas comenzar a trabajar rapidamente.<br><br>
                Ve a tu perfil: icono
                <v-icon>account_box</v-icon> de la barra principal,
                y define los siguientes datos:<br><br>
                <li> Carga tus certificados digitales de AFIP. Te permitirán realizar comprobantes
                  electrónicos y leer datos de contribuyentes al momento de cargar Clientes y
                  Proveedores. Si quieres podemos realizar esta tarea por ti. Contáctanos y
                  avanzaremos con la creación de tus certificados.<br>
                </li>
                <br>
                <li> Revisa los nombres de las sucursales y depósitos asignados automaticamente,
                puedes agregar los que necesites.</li><br>
                <li> Si vas a utilizar más de una sucursal, define un <i>tema</i> distinto para
                cada una de ellas. ¡Vas a poder identificarlas mas claramente!.</li><br>
                <li>Carga tu avatar y el logo de tu Empresa, estos se imprimirán en los listados
                  y comprobantes que emitas.
                </li><br>
                <li>Revisa tu porcentaje de remarcación global.
                  <b>gohu</b> permite administrar estos porcentajes en forma muy flexible,
                  por Marcas, por Grupos e incluso por cada artículo.<br>
                </li><br>
                <li>Define y asigna tus <i>porcentajes de remarcación sugeridos o de reventa</i>
                  para tus Clientes vinculados.<br>
                  Ellos luego podrán modificarlos.
                </li>
                <br>
                <li>
                  Carga tus cuentas bancarias, tus tarjetas y tus chequeras.
                  Ve a <i>Clientes</i> e ingresa a tu ficha. En la solapa
                  <i>Cuentas Bancarias</i> podrás definir estos datos.<br>
                  Serán necesarios al momento de realizar pagos para luego
                  volcarlos al módulo de Bancos.
                </li><br>
                <li>
                  En <b>gohu</b> ya existen una gran cantidad de CUIT's cargados.
                  Puedes ingresar a Clientes y Proveedores para ver si ellos ya existen en nuestas
                  bases de datos. Utiliza el boton <i>Incluir</i> de la barra principal del
                  formulario correspondiente. Clientes, Proveedores y Transportistas.<br>
                  De todas formas, si necesitas cargar cuentas que aún no estén en
                  <b>gohu</b> el sistema las importa desde AFIP. Solo deberás ingresar el CUIT
                  al momento de la carga. ¡También puedes importarlos!, sigue leyendo.
                </li><br>
                <li>¡Importa tus datos!. Ingresa al menú <i>Configuración</i> >
                  <i>Migración de Datos</i> y revisa la solapa <i>Reglas para importar</i>.
                  Allí esta toda la información que necesitas para que prepares tus archivos Excel.
                  <br><b>gohu</b> te permitirá importar Artículos, Marcas, Grupos, Clientes y
                  Proveedores, con sus saldos inciales de Cuentas Corrientes.<br><br>
                  Muchos usuarios que ya utilizan <b>gohu</b> recurren a las migraciones
                  al momento de cargar grandes cantidades de datos, por ejemplo, un lista
                  de artículos nuevos de un proveedor. Es un proceso mucho mas rápido.<br><br>
                </li>

                <li>¡Organiza tus artículos!<br>
                  Es muy importante que tanto tus códigos como los nombres o descripciones de tus
                  artículos esten cargados según un patrón o un criterio, al momento
                  de buscarlos va a ser mucho mas fácil encontrarlos.<br><br>
                  <b>Plantillas de Grupos y Marcas precargadas</b><br>
                  El sistema incluye una serie de plantillas para grupos y una larga lista de
                  marcas precargadas.<br>
                  Podrás utilizar estos datos para agilizar tu inicio.<br><br>
                  <i>
                    Recuerda que si tienes clientes viculados ellos también agradecerán tu orden!
                  </i>
                  <br><br>
                  El sistema soporta el ingreso de <i>Códigos de Barras</i> para artículos,
                  esto tiene un costo inicial en tiempo de carga pero un beneficio enorme en
                  su aplicación. Revisa en la ayuda el apartado <i>Artículos</i> que explicamos este
                  tema con más detalles.
                  <br>
                </li><br>

                <div>
                  <b>Y lo más importante...</b>
                  <b><a style="color:green">¡Vincúlate!.</a></b><br><br>
                </div>
                <b>gohu</b> está diseñado para que te vincules con tus Clientes y Proveedores.
                Allí radica toda la potencia del sistema.<br>
                Cuando te vinculas con un Proveedor, todos sus Artículos, Precios y Promociones se
                espejarán en tu sistema,<br>y cada actualización o modificación que el Proveedor
                realice se reflajará en forma instantánea en tu sistema.<br>
                <b>¡Estarás actualizado en todo momento.!</b><br><br>
                ¡A mayor cantidad de Proveedores vinculados más se optimiza tu sistema!.<br>
                También te puedes vincular con tus Clientes, y para ellos sucederá exactamente
                lo mismo.<br><br>
                Invita a tus contactos comerciales a utilizar <b>gohu</b> y aprovecha toda la
                potencia de las <i>vinculaciones</i>.<br><br>
                Contactaremos a aquellos Proveedores que no esten interesados en usar el sistema,
                para que nos brinden sus listas de precios periodicamente y nos permitan realizar
                dicha actualización, para que siempre tengas sus precios actualizados.<br><br>

              </div>

              <div v-else-if="$store.state.tipo=='PP'&&$store.state.exclusivoDe.id==null">

                ¡Gracias por confiar en nosotros!
                <br><br>
                Nuestro objetivo es facilitar la operatoria comercial con tus
                Clientes y Proveedores.
                <br><br>
                <b>gohu</b> presenta la posibilidad de que sus usuarios se vinculen entre si.<br>
                Ingresa al icono <v-icon>mdi-share-variant</v-icon> de la barra principal
                y podrás ver a todos los usuarios que estan utilizando el sistema actualmente.
                <br><br>
                Vincularte te permitirá ver los Artículos, Precios y Promociones de tus
                Proveedores y que tus Clientes también vean los tuyos.<br>
                <b>¡Estarás actualizado en todo momento y en forma automática!</b>
                <br><br>
                Podrás realizar pedidos a tus Proveedores y recibir pedidos de tus Clientes.<br>
                Los Usuarios marcados con <b>g</b> son administrados por <b>gohu</b>,
                a ellos no podrás realizarles pedidos.<br>
                Recibimos todos los días las listas de los proveedores <b>g</b> y las procesamos
                para que tengas sus precios actualizados en todo momento.
                <br><br>
                Invita a tus contactos comerciales a ser parte de
                <b>gohu</b>, o envíanos un correo a <b>admin@gohu.com.ar</b> informándonos de
                quiénes son.<br>Los contactaremos y acordaremos para obtener sus listas y así poder
                administrarlas, para que tengas todo el tiempo la información actualizada
                en un solo lugar.
                <br><br>
                <b>Identifícate</b><br>
                Ve a tu perfil y carga tu avatar y el logo de tu Empresa para que te
                puedan identificar mejor.
                <br><br>
                <b>Amplía tus posibilidades</b><br>
                Podrás migrar a una licencia ERP ingresando al menú <i>Cambiar de Licencia</i>
                y seleccionar una de las tres licencias disponibles:
                <li><i>gohu ERP Completo <b>CO</b></i></li>
                <li><i>gohu ERP Medio <b>ME</b></i></li>
                <li><i>gohu ERP Básico <b>BA</b></i></li><br>
                <b>gohu ERP</b> es un completo sistema de gestión comercial dónde todas las
                operaciones entre usuarios vinculados van por sistema, aprovechando al máximo todo
                el poder que brinda esta característica.<br>
                <b> Ahorrarás mucho tiempo de carga y evitarás errores.</b><br><br>
                ¡Y recuerda, comienza a vincularte!<br>

              </div>

              <div v-if="$store.state.tipo=='PP'||$store.state.tipo=='CO'||
                $store.state.tipo=='ME'||$store.state.tipo=='BA'
                &&!$store.state.exclusivoDe.id==null">
                <br>
                <v-btn tile outlined class="text-none" @click="noVerMasElMensajeInicial()">
                  ¡No ver mas este mensaje!
                </v-btn>
                <!--
                <span>
                  {{ $store.state.inicial }}
                  {{ $store.state.activo }}
                  {{ $store.state.ofertas }}
                  {{ $store.state.tipo }}
                  exl de {{ $store.state.exclusivoDe.id==null }}
                </span>
                -->
              </div>
            </v-card-text>
          </v-card>
        </v-container>
        <!-- FIN DIALOGO INICIAL -->

        <!-- USUARIOS UG PERO SIN ACTIVAR PRESENTACION -->
        <v-container fluid v-show="isLoggedIn && !$store.state.activo">
          <v-card width="1270" class="mx-auto">
            <v-img
              class="ml-4"
              height="50"
              width="50"
              src="/images/logoGoHu.jpg">
            </v-img>
            <v-card-title v-show="!estaNotificado" class="fg">
              <span class="fg130" style="margin-right: 5px;">¡Hola</span>
              <span><b>{{ userName }}!</b></span>
            </v-card-title>
            <v-card-subtitle v-show="!estaNotificado" class="fg">
              Ahora vamos a completar tu cuenta.
            </v-card-subtitle>
            <v-card-text class="fg">

              <div v-if="estaNotificado">
                Gohu ya esta notificado de su pedido.<br>
                Nuestra politica es asegurarnos de que solo empresas utilicen el sistema.<br>
                En breve serás contactado por mail para avanzar con el registro y configuración
                de tu cuenta.<br><br>
                Desde ya, muchas gracias por apoyarnos.
              </div>
              <div v-else>
                <div v-if="$store.state.tipo=='UT'">
                  Has decidido utlilizar <b>la tienda de gohu</b>.<br>
                  Podrás encontrar artículos y servicios publicados por una enorme comunidad
                  de empresas y pymes.<br><br><br>
                </div>
                <div v-else-if="$store.state.tipo=='PP'">
                  Has decidido utlilizar la versión <b>Precios y Pedidos</b>.<br>
                  Te podrás vincular con tus Clientes y Proveedores que utilicen <b>gohu</b>.<br>
                  Podrás ingresar tus Artículos al sistema y administrar tus precios y Promociones,
                  para que tus Clientes te puedan realizar Pedidos.<br>
                  <i>Cada acción que realices sobre tus Artículos, Precios y Promociones, se
                  reflejarán automaticaente en todos tus Clientes vinculados.</i><br>
                  De igual manera también podrás ver los Artículos, Precios y Promociones de tus
                  Proveedores vinculados, para que también le puedas realizar Pedidos.
                  <br><br>
                  Recordamos que el acceso <b>Precios y Pedidos</b> a <b>gohu</b> tiene un costo
                  muy acotado, solo una cuota ínfima que nos permite solventar el tráfico de
                  información que vas a generar y que nos cobra nuestro proveedor de Hosting.
                  <br><br><br>
                </div>
                <div v-else>
                  Ingresa tu CUIT (sin guiones) para ver como estan tus registros.<br><br>
                  <div v-if="$store.state.tipo=='UE'">
                    No obstante te invitamos a ver nuestros <b>videos</b>, quizas <b>gohu</b>
                    pueda ser de tu utilidad.<br><br>
                  </div>
                </div>
              </div>

              <div v-if="!estaNotificado && $store.state.tipo!='UT'">
                <v-row>
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <span><b class="fg">Tu identificación</b></span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2" sm="2" md="2" class="pt-0">
                    <v-text-field class="fg"
                      v-model="datosUE.cuit"
                      v-on:keydown.tab="buscoDocumento"
                      :color="$store.state.temas.forms_titulo_bg"
                      label="Tu CUIT (sin guiones)"
                      outlined required clearable autofocus
                      :rules="cuitRules"
                      :counter="11"
                      :maxlength="11"
                      @change="valido() && buscoDocumento()">
                    </v-text-field>
                  </v-col>
                  <!--
                  <v-col cols="3" sm="3" md="3" class="pt-0">
                    <v-file-input class="fg"
                      outlined
                      :color="$store.state.temas.forms_titulo_bg"
                      prepend-icon="mdi-file"
                      v-model="datosUE.crt"
                      label="Archivo CRT">
                      Archivo CRT
                    </v-file-input>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-0">
                    <v-file-input class="fg"
                      outlined
                      :color="$store.state.temas.forms_titulo_bg"
                      prepend-icon="mdi-file"
                      v-model="datosUE.key"
                      label="Archivo KEY">
                      Archivo KEY
                    </v-file-input>
                  </v-col>
                  -->
                  <v-col cols="3" sm="3" md="3" class="pt-4 fg">
                    <span color='warning' v-if="datosUE.dondeEncontreLosDatos!=''">
                      Datos encontrados en
                      <strong class="red--text text--lighten-1">
                        {{ datosUE.dondeEncontreLosDatos }}
                      </strong>
                    </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <v-text-field class="fg"
                      v-model="datosUE.nombre"
                      label="Nombre"
                      required outlined disabled
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="nombreRules"
                      :counter="50" :maxlength="50"
                      @change="valido()"
                      @keyup="escribiendoNombre">
                    </v-text-field>
                  </v-col>
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <v-text-field class="fg"
                      v-model="datosUE.razonsocial"
                      label="Razón Social"
                      outlined disabled
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="razonsocialRules"
                      :counter="80" :maxlength="80"
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="3" sx="3" mx="3" class="pt-0">
                    <v-select class="fg"
                      label="Cond.Fiscal"
                      v-model="datosUE.responsable_id"
                      :items="itemsResponsables"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="responsableRules"
                      outlined disabled
                      item-value="id"
                      item-text="nombre"
                      @change="valido()">
                    </v-select>
                  </v-col>
                  <v-col cols="2" sm="2" md="2" class="pt-0">
                    <v-select class="fg"
                      label="Tipo de Documento"
                      v-model="datosUE.documento_id"
                      :items="itemsDocumentos"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="documentoRules"
                      outlined disabled
                      item-value="id"
                      item-text="nombre"
                      @change="valido()">
                    </v-select>
                  </v-col>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                    <v-text-field class="fg"
                      v-model="datosUE.direccion"
                      label="Dirección"
                      :color="$store.state.temas.forms_titulo_bg"
                      :counter="40"
                      :maxlength="40"
                      outlined disabled
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-0 pb-0">
                    <v-text-field class="fg"
                      v-model="datosUE.postalNombre"
                      label="Ciudad"
                      :color="$store.state.temas.forms_titulo_bg"
                      :counter="40"
                      :maxlength="40"
                      outlined disabled
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12" class="pt-0">
                    <v-select class="fg"
                      v-model="rubValue"
                      :items="rubItems"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="rubrosRules"
                      multiple outlined chips required
                      label="¿A que Rubro o Rubros perteneces?"
                      @change="valido()">
                    </v-select>
                  </v-col>
<!--
                  <v-col cols="4" sx="4" mx="4" class="pt-0">
                    <v-select class="fg"
                      v-model="datosUE.tipodeusuario"
                      :items="tip"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="comercializacionRules"
                      item-value="id"
                      item-text="nombre"
                      label="¿Como comercializas tus productos y/o servicios?"
                      outlined required
                      @change="valido()">
                    </v-select>
                  </v-col>
-->
                </v-row>

                <v-row v-show="$store.state.tipo=='CO'||
                  $store.state.tipo=='ME'||$store.state.tipo=='BA'">
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <span class="fg">
                      <b>Datos de tu Negocio</b><br>
                      Cuando inicializas <b>gohu</b> el sistema genera dos sucursales.
                      Una operativa y la otra de prueba o demo. Ingresa los datos de la sucusal
                      operativa.
                    </span>
                  </v-col>
                </v-row>

                <v-row v-if="$store.state.tipo=='CO'||
                  $store.state.tipo=='ME'||$store.state.tipo=='BA'">
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <v-text-field class="fg"
                      v-model="datosUE.sucursalNombre"
                      label="Nombre de tu Sucursal/Negocio Unico"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="sucursalNombreRules"
                      required outlined
                      :counter="50"
                      :maxlength="50"
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-0">
                    <v-text-field class="fg"
                      v-model="datosUE.sucursalAbreviado"
                      label="Nombre Abreviado"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="sucursalNombreAbreviado"
                      :counter="10"
                      :maxlength="10"
                      required outlined
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-0">
                    <v-text-field class="fg"
                      v-model="datosUE.sucursalFiscal"
                      label="Código Fiscal de AFIP"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="codigoFiscalAfip"
                      :counter="4"
                      :maxlength="4"
                      required outlined
                      @change="nroSucursal() && valido()">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row v-if="$store.state.tipo=='CO'||
                  $store.state.tipo=='ME'||$store.state.tipo=='BA'">
                  <v-col cols="2" sm="2" md="2" class="pt-0">
                    <v-text-field class="fg"
                      type="date"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="inicioDeActividad"
                      v-model="datosUE.sucursalInicioDeActividad"
                      required outlined
                      label="Inicio de Actividades"
                      @change="valido()">>
                    </v-text-field>
                  </v-col>
                  <v-col cols="2" sm="2" md="2" class="pt-0">
                    <v-text-field class="fg"
                      type="number"
                      v-model="datosUE.porRemarcacion"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="porRemarcacion"
                      label="% de Rem.Global"
                      required outlined
                      @change="valido()">>
                    </v-text-field>
                  </v-col>
                  <v-col cols="3" sx="3" mx="3" class="pt-0">
                    <v-text-field class="fg"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="nombreDelDeposito"
                      v-model="datosUE.sucursalDepositoNombre"
                      required outlined
                      label="Nombre del Depósito (Stock)"
                      :counter="30"
                      :maxlength="30"
                      @change="valido()">>
                    </v-text-field>
                  </v-col>
                  <v-col cols="2" sx="2" mx="2" class="pt-0">
                    <v-select class="fg"
                      v-model="datosUE.sucursalTema"
                      :color="$store.state.temas.forms_titulo_bg"
                      :item-color="$store.state.temas.forms_titulo_bg"
                      :items="lostemas"
                      required outlined
                      label="Tema"
                      @change="valido()">>
                    </v-select>
                  </v-col>
                  <v-col cols="3" sx="3" mx="3" class="pt-0">
                    <v-text-field class="fg"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="nombreDelPrefijo"
                      v-model="datosUE.prefijo"
                      required outlined
                      label="Prefijo para tus articulos"
                      :counter="5"
                      :maxlength="5"
                      @change="valido()">>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sx="12" mx="12" class="pt-0">
                    <v-textarea
                      v-model="datosUE.observ"
                      :color="$store.state.temas.forms_titulo_bg"
                      label="Describe brevemente tu empresa, tus formas de comercialización, etc.
                             Lo que aquí escribas es lo que verán el resto de los usuarios en el
                             panel de vinculaciones."
                      auto-grow
                      outlined
                      rows="3"
                      row-height="25"
                      shaped>
                    </v-textarea>
                  </v-col>
                </v-row>

                <div v-show="formOk==true">
                  <v-row>
                    <v-col cols="12" sm="12" class="pt-5">
                      <v-btn
                        class="fg"
                        @click="guardarUsuario">
                        Guardar Datos y enviar Notificación
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <div v-else-if="externo">

                <!--
                  USUARIO TIENDA
                -->
                <v-row>
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <span><b class="fg">Tus datos</b></span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" class="pt-0">
                    <v-text-field class="fg"
                      v-model="datosUE.nombre"
                      label="Nombre"
                      required outlined
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="nombreRules"
                      :counter="50" :maxlength="50"
                      @change="valido()"
                      @keyup="escribiendoNombre">
                    </v-text-field>
                  </v-col>
                  <!--
                  <v-col cols="12" sm="6" class="pt-0">
                    <v-text-field class="fg"
                      v-model="datosUE.razonsocial"
                      label="Razón Social"
                      outlined
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="razonsocialRules"
                      :counter="80" :maxlength="80"
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                  -->
                </v-row>

                <v-row>
                  <v-col cols="12" sm="3" class="pt-0">
                    <v-select class="fg"
                      label="Cond.Fiscal"
                      v-model="datosUE.responsable_id"
                      :items="itemsResponsables"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="responsableRules"
                      outlined
                      item-value="id"
                      item-text="nombre"
                      @change="valido()">
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="2" class="pt-0">
                    <v-select class="fg"
                      label="Tipo de Documento"
                      v-model="datosUE.documento_id"
                      :items="itemsDocumentos"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="documentoRules"
                      outlined
                      item-value="id"
                      item-text="nombre"
                      @change="valido()">
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="2" class="pt-0">
                    <v-text-field class="fg"
                      v-model="datosUE.cuit"
                      v-on:keydown.tab="buscoDocumento"
                      :color="$store.state.temas.forms_titulo_bg"
                      label="CUIT/CUIL/Nro.Doc (Sin guiones)"
                      outlined required clearable autofocus
                      :rules="cuitRules"
                      :counter="11"
                      :maxlength="11"
                      @change="valido() && buscoDocumento()">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="4" class="pt-0 pb-0">
                    <v-text-field class="fg"
                      v-model="datosUE.direccion"
                      label="Dirección"
                      :color="$store.state.temas.forms_titulo_bg"
                      :counter="40"
                      :maxlength="40"
                      outlined
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3" class="pt-0 pb-0">
                    <v-select class="fg"
                      label="Ciudad"
                      v-model="datosUE.postal_id"
                      :items="postales"
                      :color="$store.state.temas.forms_titulo_bg"
                      outlined
                      item-value="id"
                      item-text="nombre"
                      @change="valido()">
                    </v-select>
                  </v-col>
                </v-row>

                <div v-show="formOk==true">
                  <v-row>
                    <v-col cols="12" sx="12" mx="12" class="pt-0">
                      <v-btn
                        class="fg"
                        @click="guardarUE">
                        Guardar Datos
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>

              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
    <impresiones ref="impresion"></impresiones>
    <Confirmacion v-model='msg.msgAccion'
      :title=this.msg.msgTitle
      :body=this.msg.msgBody
      :visible=this.msg.msgVisible
      :buttons=this.msg.msgButtons
      @click="msgRespuesta">
    </Confirmacion>
  </div>
</template>

<script>
 /* eslint-disable */
import HTTP from '../http';
import router from '../router';
import { mapGetters, mapMutations, mapState } from 'vuex';
import SBar from './Forms/snackbar.vue';
import moment from 'moment';
import Confirmacion from "./Forms/confirmacion.vue";
import impresiones from "./Forms/impresiones.vue";

export default {
  components: {
    SBar,
    Confirmacion,
    impresiones,
  },

  data: () => ({
    proveedoresx: [],
    proveedor_id: 0,
    tabInicial: 'general',
    pagina: 1,
    perPage: 10,
    ofertas: [],

    toggle_exclusive: false,
    grupos: [],
    carro: [],
    postales: [],
    totalCarro: 0,
    ctt: 0,
    cuitRules: [
      v => !!v || 'El cuit es requerido',
      v => (v && v.length <= 11) || 'Ingrese hasta 11 caracteres',
    ],
    nombreRules: [
      v => !!v || 'Este dato es requerido',
      v => (v && v.length <= 50) || 'Ingrese hasta 50 caracteres',
    ],
    razonsocialRules: [
      v => !!v || 'Este dato es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],
    responsableRules: [
      v => !!v || 'Seleccione una condición de la lista',
    ],
    documentoRules: [
      v => !!v || 'Seleccione un tipo de documento de la lista',
    ],
    rubrosRules: [
      v => (v && v.length>0) || 'Seleccione un rubro o los que necesite de la lista',
    ],
    comercializacionRules: [
      v => !!v || 'Seleccione un tipo de comercialización',
    ],
    ciudadRules: [
      v => !!v || 'Seleccione una ciudad',
    ],
    sucursalNombreRules: [
      v => !!v || 'Ingrese un nombre para la sucursal/casa central',
    ],
    sucursalNombreAbreviado: [
      v => !!v || 'Ingrese un nombre abreviado para la sucursal/casa central',
    ],
    codigoFiscalAfip: [
      v => !!v || 'Ingrese el código fiscal AFIP para esta sucursal o casa central',
    ],
    inicioDeActividad: [
      v => !!v || 'Ingrese el código fiscal AFIP para esta sucursal o casa central',
    ],
    porRemarcacion: [
      v => !!v || 'Algo tiene que ganar, ingrese que porcentaje',
    ],
    diaDeFacturacion: [
      v => (v>=1 && v<=28) || 'Valores mínimos y máximos ( 1..28 )',
    ],
    nombreDelDeposito: [
      v => !!v || 'Nombre del depósito para administrar sus stocks',
      v => (v && v.length <= 30) || 'Ingrese hasta 30 caracteres',
    ],
    nombreDelPrefijo: [
      v => !!v || 'Prefijo para identificar tus artículos',
      v => (v && v.length === 5) || 'Ingrese 5 caracteres',
      //v => /[A-Z0-9]{3}/.test(v) || 'Ingrese hasta 3 caracteres y/o números',
    ],
    formOk: false,
    lostemas: ['Normal','Noche','Dia','Primavera','Verano','Otoño','Invierno','Pastel','Nieve'],
    detPub: '',
    dialogDetalles: false,
    dialogVerFotos: false,
    direccion: '',
    dir: [],
    timeoutRefreshList: [],
    itemsResponsables: [],
    itemsDocumentos: [],
    rubValue: [],
    rubItems: [],
    rubObj: [],
    marItems: [],
    gruItems: [],
    itemsTreeGrupos: [],
    search: '',

    rubro: null,
    rubro_id: null,
    grupo: null,
    grupo_id: null,
    marca: null,
    marca_id: null,

    fotos: [],
    logotipo: 'Sin Imagen.jpg',
    tipoLicencia: '',
//  selectValue: '',

    datosUE: {
      id: '',
      nombre: '',
      razonsocial: '',
      responsable_id: '',
      documento_id: '',
      cuit: '',
      rubValue: [],
      tipodeusuario: '',
      direccion: '',
      postal_id: '',
      postalNombre: '',
      porRemarcacion: 25,
      sucursalNombre: 'CENTRAL',
      sucursalAbreviado: 'CENTRAL',
      sucursalFiscal: '0000',
      sucursalInicioDeActividad: moment().format('YYYY-MM-DD'),
      sucursalElectronica: 0,
      sucursalRefresco: 120,
      sucursalDepositoNombre: 'CENTRAL',
      sucursalTema: 'Invierno',
      sucursalLogotipo: 'Sin Imagen.jpg',
      crt: { name: '' },
      key: { name: '' },
      estaEnUserTercero: false,
      dondeEncontreLosDatos: '',
      observ: '',
      diaDeFacturacion: 10,
      prefijo: '',
    },
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },

    noti: [],
    estaNotificado: false,
    model: 0,
    dialogFacPed: false,
    headersFactibilidadPed: [
      { text: 'CODIGO', value: 'codigo', align: 'left', width: 120 },
      { text: 'DESCRIPCION', value: 'nombre', align: 'left', width: 420},
      { text: 'CTT.PEDIDA', value: 'ctt', align: 'end', width: 120},
      { text: 'STOCK', value: 'stock', align: 'end', width: 120},
      { text: 'DEFERENCIA', value:'diff', align: 'end', width: 120},
    ],
    factibilidadPedidos: [],
    headersNotas: [
      { text: 'Usuario', value:'userdesde.username'},
      { text: 'Comprobante', value:'comprobante.cpr'},
      { text: 'Total', value:'comprobante.total'},
    ],
    headersCarro: [
      { text: 'Código',   value: 'codigo', width: 110, align: 'left'},
      { text: 'Nombre',   value: 'nombre', width: 200, align: 'left'},
      { text: 'Cantidad', value: 'ctt', align: 'end'},
      { text: 'Precio',   value: 'precio', align: 'end'},
      { text: 'Total',    value: 'total', align: 'end'},
      { text: 'Op', value: 'accion', sortable: false },
    ],
    reglas: [],
    //reglasDelTer: [],
    preciosLicencias: [],

  }),

  created() {
    moment.locale('es');
    if (this.isLoggedIn) {
      return HTTP().get('/gohuestanotificado')
        .then(({ data }) => {
          this.estaNotificado = data;
        })
    } else {
      let a = this.$store.state.datosPanel.ventasDelDia
      this.$store.commit('setSucursal', null, { root: true });
      this.$store.commit('setSucursales', null , { root: true })
      this.$store.commit('setSucursalFiscal', null , { root: true })
      this.$store.commit('setTema', null , { root: true })
      this.$store.commit('setTemas', null , { root: true })
      this.$store.commit('setLogotipo', null , { root: true })
      this.$store.commit('setCaja', null , { root: true })
      this.$store.commit('setEmpresa', null, { root: true })
      this.$store.commit('setRubros', null, { root: true })
      this.$store.commit('setOperario', null, { root: true })
      this.$store.commit('setLevel', null, { root: true })
      this.$store.commit('setResponsable', null, { root: true })
      this.$store.commit('setCuit', null, { root: true })
      this.$store.commit('setActivo', null, { root: true })
      this.$store.commit('setNotificaciones', null, { root: true })
      this.$store.commit('setNotificacionesgohu', null, { root: true })
      this.$store.commit('setVinculosPadres', [], { root: true });
      this.$store.commit('setVinculosHijos', [], { root: true });
      this.$store.commit('setTipo', null , { root: true })
      this.$store.commit('setContadorBloqueado', false, { root: true })
      this.$store.commit('setEnCarrito', false, { root: true })
    }
  },  

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState('authentication', ['loginEmail','loginPassword','loginUserId','loginError'],
      [ 'sucursal', 'sucursales', 'sucursalFiscal', 'proveedor', 'proveedores', 'tema',
        'temas', 'logotipo', 'notificaciones', 'codigooid', 'caja', 'empresa', 'datosEmpresa',
        'operario', 'level', 'tipo', 'activo', 'datosPanel', 'rubros', 'contadorBloqueado',
        'actPublicacion', 'enCarrito', 'publicarpreciosconiva', 'operarioEsVendedor',
        'operarioTerceroId','inicial', 'ofertas', 'exclusivoDe', 'administraGOHU', 'transition',
        'dark'
      ]),
  },

  watch: {
    '$store.state.ofertas' () {
      if (this.$store.state.ofertas) {
        this.cambioProveedor()
      }
    },
  },

  mounted() {
    this.search = "";
    if (!this.isLoggedIn) { return }

    this.$vuetify.theme.dark = this.$store.state.dark;
    this.timeoutRefreshList = []
    for (let i=10; i<=360; i++) {
      this.timeoutRefreshList.push(i)
    }
    this.datosUE.nombre = this.$store.state.empresa
    this.datosUE.razonsocial = this.$store.state.empresa
    this.postales = []

    return HTTP().post('/postales').then(({ data }) => {
      for (let i=0; i<=data.length-1; i++) {
        this.postales.push({
          id: data[i].id,
          nombre: data[i].nombre+' ('+data[i].codigo+')',
        })
      }
      return HTTP().get('/afipresponsables').then(({ data }) => {
        this.itemsResponsables = data;
        return HTTP().get('/afipdocumentos').then(({ data }) => {
          this.itemsDocumentos = data;
          this.preciosLicencias = []
          return HTTP().get('/rubrosall').then(({ data }) => {
            this.rubItems = [];
            this.rubObj = [];
            data.forEach(element => {
              this.rubItems.push(element.nombre)
              this.rubObj.push(element)
            })
            return HTTP().get('/precioslicencias').then(({ data }) => {
              this.preciosLicencias = data

              for (let i=0; i<=data.length-1; i++) {
                this.preciosLicencias[i].precio = this.preciosLicencias[i].usd*this.$store.state.dolar
              }

              this.proveedoresx = []
              for (let i=1; i<=this.$store.state.proveedores.length-1; i++) {
                this.proveedoresx.push(this.$store.state.proveedores[i])
              }
              if (this.proveedoresx.length>0) {
                this.proveedor_id = this.proveedoresx[0].id
              }

            })
          })
        })
      })
    })
  },

  methods: {
    //...mapActions('authentication', ['logout']),
    ...mapMutations([
      'alert', 'closeAlert', 'setAvatar', 'datosPanel', 'setActivo', 'setCaja', 'setCuit', 'setEmpresa',
      'setLevel', 'SetLogotipo', 'setNotificaciones', 'actNotificacion', 'setOperario', 'setOperarioUserId',
      'setPorRem', 'setResponsable', 'setRubros', 'setSucursal', 'setSucursales', 'setSucursalDemo',
      'setSucursalFiscal', 'setTema', 'setTemas', 'setTipo', 'setTercero', 'setVinculosPadres', 'setContadorBloqueado',
      'actDetallesPublicacion', 'setPublicacionLoQuieroOn', 'setPublicacionLoQuieroOff', 'setEnCarrito', 'setPublicaciones',
      'setCttPublicacion', 'setVaciarCarro', 'setInicial', 'setOfertas'
    ]),

    closeForm(){
      this.ofertas = []
      this.$store.commit('setOfertas', false, { root: true });
    },

    cambioProveedor() {
      let cual = null
      let pos = this.proveedoresx.findIndex(x=>x.id==this.proveedor_id)
      if (pos==-1) {
        return
      } else {
        cual = this.proveedoresx[pos]
      }
      if (cual) {

        if (cual.id == 0) {

          this.$store.commit('setProveedor', 0, { root: true });

        } else {

          return HTTP().post('/releoproveedorparaelstate/', {proveedor: cual.id}).then(({ data })=>{

            this.$store.commit('setProveedor', data[0], { root: true });
            this.$store.commit('setGrupoCarrito', 9999999, { root: true });
            this.rubObj = [];
            this.marItems = [{id:0, nombre: 'Todas', sel: true}]
            this.gruItems = [{id:0, name: 'Todos', sel: true}]
            this.rubItems = []

            return HTTP().post('homepanelarticulos', { prov: this.proveedor_id, rub:'' } ).then(({ data }) => {

              for (let i=0; i<=data.rub.length-1; i++) {
                this.rubItems.push({
                  id: data.rub[i].rubro.id,
                  userRubro_id: data.rub[i].id,
                  nombre: data.rub[i].rubro.nombre,
                  sel: false,
                })
                this.rubObj.push(data.rub[i])
              }
              this.rubItems[0].sel = true

              for (let i=0; i<=data.mar.length-1; i++) {
                this.marItems.push({
                  id: data.mar[i].id,
                  nombre: data.mar[i].nombre,
                  sel: false,
                })
              }

              let aux = [];
              for(let i=0; i<=data.gru.length-1; i++) {
                aux.push({
                  id: Number(data.gru[i].id),
                  name: data.gru[i].nombre,
                  activo: data.gru[i].activo,
                  ctt: data.gru[i].ctt,
                  padre:  Number(data.gru[i].grupo_id),
                  state: { disabled: data.gru[i].activo===1 ? false : true }
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

              this.gruItems = getNestedChildren3(this.itemsTreeGrupos)
              function getNestedChildren3(arr) {
                var out = []
                for(var i in arr) {
                  out.push({
                    id: arr[i].id,
                    name: arr[i].name,
                    grupo_id: arr[i].grupo_id,
                    sel: false,
                    childs: arr[i].children!=undefined?true:false
                  })
                  if(arr[i].children) {
                   let aux = getNestedChildren3(arr[i].children);
                   for (let j=0; j<= aux.length-1; j++) {
                    out.push(aux[j])
                   }
                  }
                }
                return out
              }
              this.gruItems.unshift({
                id: 0,
                name: 'Todos',
                grupo_id: null,
                sel: true,
              })

              this.ofertas = []
              return HTTP().post('/articuloz', {
                search: this.search,
                vinculosPadresLic: this.$store.state.vinculosPadresLic,
                vinculosPadresAll: this.$store.state.vinculosPadresAll,
                proveedor: this.proveedor_id, stockProv: true, grupo: '', marca: '', userex: null, soloArtComprados: false, descuentos: this.$store.state.descuentos,
                dolar: this.$store.state.dolar, activos: true, limit: 25 }).then(({ data })=>{
                for (let i=0; i<=data.length-1; i++) {
                  let pre = data[i].precios[0].costo
                  let preori = data[i].precios[0].costo
                  if (data[i].precios[0].ofeestado=='A'&&data[i].precios[0].ofeunidades>0) {
                    pre = pre - (pre*(data[i].precios[0].ofetasadescuento/100))
                  }

                  /*
                  this.articulos.push({ 
                    id: item.items[i].id,
                    articulo_id: item.items[i].articulo_id,
                    codigo: item.items[i].articulo.codigo,
                    codbar: item.items[i].articulo.codbar,
                    nombre: item.items[i].articulo.nombre,
                    deposito_id: this.editado.deposito_id,
                    unidad_id: item.items[i].articulo.unidad_id,
                    moneda_id: item.items[i].articulo.moneda_id,
                    iva_id: item.items[i].articulo.iva_id,
                    cantidad: Number(item.items[i].cantidad),
                    cantidadoriginal: Number(item.items[i].cantidad),
                    stock: Number(item.items[i].cantidad),
                    undstock: item.items[i].undstock,
                    sinstock: item.items[i].sinstock,
                    costo: item.items[i].costo,
                    precio: item.items[i].precio,
                    preciooriginal: item.items[i].precio,
                    tasadescuento: item.items[i].tasadescuento,
                    importedescuento: item.items[i].importedescuento,
                    tasaproprecargo: 0,
                    total: item.items[i].total,
                    texto: item.items[i].texto,
                    vencimiento: item.items[i].vencimiento,
                    adevolver: 0,
                    padre_id: null,
                    undenvase: item.items[i].articulo.undenvase,
                    escombo: item.items[i].articulo.escombo,
                    ofeprecio: 0,
                    ofetasdes: 0,
                    ofeenvio: 0,
                    ofeunidades: 0,
                    ofeestado: '',
                    turno_id: null,
                    decimales: item.items[i].articulo.precios[0].decimales,
                    preciomediocobro: false,
                    loTengo: item.items[i].loTengo,
                    desc1: item.items[i].desc1,
                    desc2: item.items[i].desc2,
                  })
                  */
                  
                  this.ofertas.push({
                    pubid: data[i].precios[0].id,
                    articulo_id: data[i].id,
                    codigo: data[i].codigo,
                    nombre: data[i].nombre,
                    fotos: data[i].fotos,
                    iva_id: data[i].iva_id,
                    envio: null,
                    precio: pre,
                    preciooriginal: preori,
                    estado: data[i].precios[0].ofeestado==null?'I':data[i].precios[0].ofeestado,
                    tasadescuento: data[i].precios[0].ofetasadescuento,
                    unidades: data[i].precios[0].ofeunidades,
                    vendidas: data[i].precios[0].ofevendidas,
                    vencimiento: data[i].precios[0].ofevencimiento,
                    created_at: moment(data[i].precios[0].createdAt).format('YYYY-MM-DD'),
                    updated_at: data[i].precios[0].updatedAt,
                    user_id: data[i].user_id,
                    loquiero: false,
                    loTengo: data[i].loTengo,
                    simbolo: data[i].simbolo,
                    ctt: 0,
                    stock: data[i].stock,
                    desc1: data[i].precios[0].desc1,
                    desc2: data[i].precios[0].desc2,
                  })
                }
              })
            })
          })
        }
      }
    },


    filtrar(cual,arr) {

      let gru = []
      let mar = []
      let ofe = []
      if (cual=='R') {
        for (let i=0; i<=this.rubItems.length-1; i++) {
          this.rubItems[i].sel = false
        }
        for (let i=0; i<=this.rubItems.length-1; i++) {
          if (this.rubItems[i].id==arr.id) {
            this.rubItems[i].sel = !this.rubItems[i].sel
          }
        }
      } else if (cual=='G') {
        for (let i=0; i<=this.gruItems.length-1; i++) {
          this.gruItems[i].sel = false
        }
        for (let i=0; i<=this.gruItems.length-1; i++) {
          if (this.gruItems[i].id==arr.id) {
            this.gruItems[i].sel = !this.gruItems[i].sel
          }
          if (this.gruItems[i].sel&&this.gruItems[i].id!=0) {
            gru.push(this.gruItems[i].id)
          }
        }
      } else if (cual=='M') {
        for (let i=0; i<=this.marItems.length-1; i++) {
          this.marItems[i].sel = false
        }
        for (let i=0; i<=this.marItems.length-1; i++) {
          if (this.marItems[i].id==arr.id) {
            this.marItems[i].sel = !this.marItems[i].sel
          }
          if (this.marItems[i].sel&&this.marItems[i].id!=0) {
            mar.push(this.marItems[i].id)
          }
        }
      }

      let g = ''
      let m = ''
      if (gru.length>0) {
        g = gru
      }
      if (mar.length>0) {
        m = mar
      }

      return HTTP().post('/articuloz', {
        search: this.search,
        vinculosPadresLic: this.$store.state.vinculosPadresLic,
        vinculosPadresAll: this.$store.state.vinculosPadresAll,
        proveedor: this.proveedor_id, stockProv: false, grupo: g, marca: m, userex: null, soloArtComprados: false, descuentos: this.$store.state.descuentos,
        dolar: this.$store.state.dolar, activos: true, limit: 25 }).then(({ data })=>{
        this.ofertas = []
        let ofe = []

        // recalculo los precios de las ofertas si las hay
        for (let i=0; i<=data.length-1; i++) {
          if (data[i].precios[0].estado=='A') {
            ofe.push(data[i].id)
          }
        }

        for (let i=0; i<=data.length-1; i++) {
          let pre = data[i].precios[0].costo
          let preori = data[i].precios[0].costo
          if (data[i].precios[0].ofeestado=='A') {
            pre = pre - (pre*(data[i].precios[0].ofetasadescuento/100))
          }
          this.ofertas.push({
            pubid: data[i].precios[0].id,
            articulo_id: data[i].id,
            codigo: data[i].codigo,
            nombre: data[i].nombre,
            fotos: data[i].fotos,
            iva_id: data[i].iva_id,
            envio: null,
            precio: pre,
            preciooriginal: preori,
            estado: data[i].precios[0].ofeestado==null?'I':data[i].precios[0].ofeestado,
            tasadescuento: data[i].precios[0].ofetasadescuento,
            unidades: data[i].precios[0].ofeunidades,
            vendidas: data[i].precios[0].ofevendidas,
            vencimiento: data[i].precios[0].ofevencimiento,
            created_at: moment(data[i].precios[0].createdAt).format('YYYY-MM-DD'),
            updated_at: data[i].precios[0].updatedAt,
            user_id: data[i].user_id,
            loquiero: false,
            loTengo: data[i].loTengo,
            simbolo: data[i].simbolo,
            ctt: 0,
            stock: data[i].stock,
            desc1: data[i].precios[0].desc1,
            desc2: data[i].precios[0].desc2,
          })
        }
      })

    },

    elPrecio(item, cual) {
      let pre = item.precio
      if (cual=='original') {
        pre = item.preciooriginal
      }
      let p = this.formatoImporte(pre)
      if (this.$store.state.proveedor.preciosconiva) {
        p = this.formatoImporte(pre*(1+(item.articulo.iva.tasa/100)))
      }
      return p
    },

    sayDesc(p) {
      let desc = p.desc1!=0?'-'+p.desc1:''
      if (p.desc2!=0) {
        desc+='+'+p.desc2
      }
      return desc!=''?desc+'% ':''
    },

    valido() {
      this.formOk = true
      if (this.$store.state.tipo=='PP') {
        if (this.datosUE.nombre == '' ||
            this.datosUE.razonsocial == '' ||
            this.datosUE.responsable_id == '' ||
            this.datosUE.documento_id == '' ||
            this.datosUE.cuit == '' ||
            this.datosUE.direccion == '' ||
            this.datosUE.postal_id == '' ) 
            { this.formOk = false }
        return true
      
      } else if (
        this.$store.state.tipo=='CO'||this.$store.state.tipo=='ME'||this.$store.state.tipo=='BA') {

        if (this.datosUE.nombre == '' ||
            this.datosUE.razonsocial == '' ||
            this.datosUE.responsable_id == '' ||
            this.datosUE.documento_id == '' ||
            this.datosUE.cuit == '' ||
            this.datosUE.direccion == '' ||
            this.datosUE.postal_id == '' ||
            (Number(this.datosUE.diaDeFacturacion)<0 || Number(this.datosUE.diaDeFacturacion>28)) ||
            this.datosUE.porRemarcacion == '' ||
            this.datosUE.sucursalNombre == '' ||
            this.datosUE.sucursalAbreviado == '' ||
            this.datosUE.sucursalFiscal == '' ||
            this.datosUE.sucursalInicioDeActividad == '' ||
//          this.datosUE.sucursalElectronica == '' ||
            this.datosUE.sucursalRefresco == '' ||
            this.datosUE.sucursalDepositoNombre == '' ||
            this.datosUE.sucursalTema == '' ||
            this.datosUE.prefijo == ''
            )
            { this.formOk = false }
      }
    },

    getEstadoNota (estado, accion) {
      let c = ''
      let e = ''
      if (estado==='T') {
        e = 'total'
        c = 'green'
      } else if (estado==='P') {
        e = 'Parcial'
        c = 'blue'
      } else if (estado==='N') {
        e = 'Sin Stock'
        c = 'black'
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },

    seleccionoClick() {
      this.datosUE.sucursalLogotipo = this.logotipo.name
    },

    guardarUsuario() {
      this.msg.msgTitle = 'Guardar Datos'
      this.msg.msgBody = '¿Confirmas los datos ingresados?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'confirmar registro'
      this.msg.msgButtons = ['Cancelar','Aceptar']
    },

    guardarUE() {
      this.msg.msgTitle = 'Guardar Datos'
      this.msg.msgBody = '¿Confirmas los datos ingresados?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'confirmar registro ue'
      this.msg.msgButtons = ['Cancelar','Aceptar']
    },

    guardarHTTP() {
      let rub = []
      for (let i=0; i<=this.rubValue.length-1; i++) {
        for(let j=0; j<=this.rubObj.length-1; j++) {
          if (this.rubValue[i]==this.rubObj[j].nombre) {
            rub.push(this.rubObj[j].id)
          }
        }
      }

      // SI ES UN USUARIO PRECIOS Y PEDIDOS, PONGO SU % DE REMARCACION EN CERO.
      // YA QUE SU PERFIL NO PERMITE MODIFICARLOS.
      // ENTONCES SI IMPORTA ARTICULOS DEBERAN SER CON PRECIOS FINALES ( CON O SIN IVA) PERO FINALES.
      if (this.$store.state.tipo=='PP') {
        this.datosUE.porRemarcacion = 0
      }
      return HTTP().post('/nuevousuario/', { tipo: this.$store.state.tipo, datos: this.datosUE, rubros: rub}).then(({ data }) => {
        if (data!='error') {
          return HTTP().get('/user/'+data.creador_id).then(({data}) => {
            let rub = []
            if (data[0].rubros2!=undefined) {
              for (let i=0; i<=data[0].rubros2.length-1; i++) {
                rub.push({id: data[0].rubros2[i].id, nombre: data[0].rubros2[i].nombre})
              }
            }
            this.$store.commit('setRubros', rub, { root: true })
            this.$store.commit('setTipo', data[0].tipo , { root: true })
            this.$store.commit('setPorRem', data[0].porrem , { root: true })
            this.$store.commit('setTimeoutRefresh', data[0].timeout_refresh , { root: true})
            this.$store.commit('setEmpresa', data[0].username, { root: true })
            this.$store.commit('setTercero', data[0].tercero_id, { root: true })
            this.$store.commit('setOperario', 'CEO', { root: true })
            this.$store.commit('setOperarioUserId', data[0].id, { root: true })
            this.$store.commit('setSucursal', data[0].sucursales[0].id, { root: true })
            this.$store.commit('setSucursales', data[0].sucursales, { root: true })
            this.$store.commit('setSucursalDemo', data[0].sucursales[0].sucursaldemo , { root: true })
            this.$store.commit('setSucursalFiscal', data[0].sucursales[0].fiscal, { root: true })
            this.$store.commit('setTema', data[0].sucursales[0].tema, { root: true })
            this.$store.commit('setTemas', data[0].sucursales[0].tema, { root: true })
            this.$store.commit('setLogotipo', data[0].sucursales[0].logotipo, { root: true })
            return HTTP().get('/userscaja/'+data[0].sucursales[0].id).then(({data}) => {
              if (data.length>0) {
                this.$store.commit('setCaja', data[0].id, { root: true });
              } else {
                this.$store.commit('setCaja', data.id, { root: true });
              }
              this.mensaje('¡La operación se ha realizado con éxito!', this.$store.state.temas.forms_titulo_bg, 1500)
              router.push('/login');
            }).catch(() => {
              this.$store.commit('setLoginError', 'Ha ocurrido un error, verifique sus datos.');
            });
          })
        } else {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500)
        }
      }).catch((e) => {
        this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500) 
      })
    },

    guardarUEHTTP() {
      // GUARDO EL USUARIO TIENDA
      return HTTP().post('/nuevousuariotienda/', { tipo: this.$store.state.tipo, datos: this.datosUE}).then(({ data }) => {
        if (data!='error') {
          return HTTP().get('/user/'+data.creador_id).then(({data}) => {
            if (data=='ok') {
              this.$store.commit('setTipo', data[0].tipo , { root: true })
              this.$store.commit('setEmpresa', data[0].username, { root: true })
              this.$store.commit('setTercero', data[0].tercero_id, { root: true })
              this.$store.commit('setTema', data[0].sucursales[0].tema, { root: true })
              this.$store.commit('setTemas', data[0].sucursales[0].tema, { root: true })
              this.mensaje('¡La operación se ha realizado con éxito!', this.$store.state.temas.forms_titulo_bg, 1500)
              router.push('/login');
            } else {
              this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500)
            }
          })
        } else {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500)
        }
      }).catch((e) => {
        this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500) 
      })
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    fecha(f) {
      let a = f.substring(8,10)+'/'+f.substring(5,7)+'/'+f.substring(0,4)+' '+f.substring(11,19)
      return a
    },

    escribiendoNombre() {
      this.datosUE.razonsocial = this.datosUE.nombre
    },

    loQuiero(item) {
      let pos = this.ofertas.findIndex(x=>x.articulo_id == item.articulo_id)
      if (item.loquiero) {
        this.ofertas[pos].loquiero = false
        this.$store.commit('setContadorBloqueado', false, { root: true })
      } else {
        this.ctt = 1
        for (let i=0; i<=this.ofertas.length-1; i++) {
          this.ofertas[i].loquiero = false
        }
        this.ofertas[pos].loquiero = true
        this.$store.commit('setContadorBloqueado', true, { root: true })
      }
    },

    agregarAlCarrito(item) {
      let pos = this.carro.findIndex(x=>x.articulo_id==item.articulo_id)

      debugger
      if (pos == -1) {
        this.carro.push({
          articulo_id: item.articulo_id,
          codigo: item.codigo,
          nombre: item.nombre,
          iva_id: item.iva_id,
          created_at: item.created_at,
          ctt: this.ctt,
          envio: item.ofeenvio,
          estado: item.ofeestado,
          fotos: item.fotos,
          id: item.id,
          loquiero: item.loquiero,
          precio: item.precio,
          preciooriginal: item.precio,
          tasadescuento: item.tasadescuento,
          total: this.ctt*item.precio,
          unidades: item.ofeunidades,
          updated_at: item.updated_at,
          user_id: item.user_id,
          vencimiento: item.ofevencimiento,
          vendidas: item.ofevendidas,
          texto: item.pubid!=undefined?'Promocion':'Lista',
          desc1: item.desc1,
          desc2: item.desc2,
        })
      } else {
        this.carro[pos].ctt = this.ctt
        this.carro[pos].total = this.carro[pos].precio*this.ctt
      }
      this.$store.commit('setCttPublicacion', [{ articulo_id: item.articulo_id, ctt: Number(this.ctt) }], { root: true })
      this.ctt = 0
      this.totalCarro = 0
      for (let i=0; i<=this.carro.length-1; i++) {
        this.totalCarro += this.carro[i].precio * this.carro[i].ctt
      }
      this.loQuiero(item)
      this.$store.commit('setEnCarrito', true, { root: true })
    },

    borrarLineaDelCarrito(item) {
      let pos = this.carro.findIndex(x=>x.articulo_id==item.articulo_id)
      this.carro.splice(pos,1)
      this.ctt = 0
      this.totalCarro = 0
      for (let i=0; i<=this.carro.length-1; i++) {
        this.totalCarro += this.carro[i].precio * this.carro[i].ctt
      }
      this.loQuiero(item)
      this.$store.commit('setEnCarrito', true, { root: true })
    },

    generarPedidoOfertas(){
      let art = []
      for (let i=0; i<=this.carro.length-1; i++) {
        art.push({
          articulo_id: this.carro[i].articulo_id,
          codigo: this.carro[i].codigo,
          nombre: this.carro[i].nombre,
          cantidad: Number(this.carro[i].ctt),
          cantidadMaxima: Number(this.carro[i].ctt),
          stock: 0,
          estado: 'new',
        })
      }
      debugger
      return HTTP().post('nuevopedido', {

        origen: 'carrito',
        userProv_id: this.proveedor_id,
        userClie_id: this.userId,
        vendedor_id: null,
        viaje_id: null,
        recorrido_id: null,
        articulos: this.carro,

        /*
        proveedor: this.proveedor_id, //proveedor: this.$store.state.proveedor.id,
        sucursales: this.$store.state.sucursales,
        sucursal: this.$store.state.sucursal,
        cart: this.carro,
        vendedor: this.$store.state.operarioEsVendedor,
        operarioTerceroId: this.$store.state.operarioTerceroId,
        viaje_id: null,
        recorrido_id: null,
        cliente_id: null,
        */

        }).then(({ data }) => {

          debugger
          this.mensaje(data, this.$store.state.temas.forms_titulo_bg, 5500)
          this.vaciarCarrito()
        })
        .catch((e) => {
          this.mensaje(e, this.$store.state.temas.snack_error_bg, 1500) 
      });

    },

    vaciarCarrito() {
      this.carro = []
      this.$store.commit('setVaciarCarro', false, { root: true })
      this.$store.commit('setEnCarrito', false, { root: true })
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='confirmar registro') {
          this.guardarHTTP()
        } else if (this.msg.msgAccion=='confirmar registro ue') {
          this.guardarUEHTTP()
        }
      } else if (op==='Cancelar') {
      }
      this.msg.msgVisible = false;
    },

    totalNota(nota) {
      if (nota.comprobante.pendientes.length) {
        if (nota.comprobante.pendientes[0].pendiente==0) {
          return this.formatoImporte(nota.comprobante.pendientes[0].importe)
        } else {
          return this.formatoImporte(nota.comprobante.pendientes[0].pendiente)
        }
      } else {
        return this.formatoImporte(nota.comprobante.total)
      }
    },

    afipsuc() {
      this.datosUE.sucursalFiscal = this.datosUE.sucursalFiscal.padStart(4,'0')
    },

    leido(it) {
      return HTTP().post('/borrarnotificacion', { nota: it } ).then(({ data }) => {
        it.estado = 'R'
        let n = []
        for (let i=0; i<= this.$store.state.notificaciones.length-1; i++) {
          if (this.$store.state.notificaciones[i].id!=it.id) {
            n.push(this.$store.state.notificaciones[i])
          }
        }
        this.$store.commit('setNotificaciones', n, { root: true });
        this.mensaje('¡Notificacion borrada!', this.$store.state.temas.forms_titulo_bg, 1500) 
      }).catch((e) => {
        console.log(e)
        this.mensaje('¡La Notificacion no se ha podido eliminar!', this.$store.state.temas.forms_titulo_bg, 1500) 
      })
    },

    verDetallesDeLaPublicacion(item) {
      this.detPub = item.detalles
      this.dialogDetalles = true
    },

    laFoto(item) {
      return "/images/"+item.fotos[0].foto
    },

    verFotos(item) {
      this.fotos = item.fotos
      this.dialogVerFotos = true
    },

    cerrarDetallesPublicacion() {
      this.dialogDetalles = false
    },

    cerrarFotosDeLaPublicacion() {
      this.dialogVerFotos = false
    },

    buscoDocumento () {
      if (this.datosUE.cuit=='') { return }
      return HTTP().get(`/tercerodocumento/${25}/${this.datosUE.cuit}/${1}`).then(({ data }) => {
        if (data=='') { // VACIO ES POR QUE NO ECONTRO NI EN LA BASE DE DATOS NI EN AFIP
          this.msg.msgTitle = 'Cuenta Inexistente en AFIP'
          this.msg.msgBody = 'AFIP no reconoce este CUIT!'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'CUIT Error'
          this.msg.msgButtons = ['Aceptar']
        } else {
          if (data.errorConstancia!=undefined) {  // ECONTRO EN AFIP Y NO EN LA BASE DE DATOS
            this.msg.msgTitle = 'Error en Constancia AFIP '
            let msg = ''
            for (let i=0; i<=data.errorConstancia.error.length-1; i++) {
              msg += data.errorConstancia.error[i]+'<br>'
            }
            this.msg.msgBody = msg
            this.msg.msgVisible = true
            this.msg.msgAccion = 'Error en CUIT'
            this.msg.msgButtons = ['Aceptar']
          } else if (data.datosGenerales==undefined) {           // ECONTRO EN LA BASE DE DATOS
            // CARGO VALORES DESDE LA BASE DE DATOS
            this.datosUE.id = data[0].id
            this.datosUE.nombre = data[0].nombre
            this.datosUE.razonsocial = data[0].razon_social
            this.datosUE.responsable_id = data[0].responsable_id
            this.datosUE.direccion = data[0].direcciones[0].direccion
            this.datosUE.postal_id = data[0].direcciones[0].postal.id
            this.datosUE.postalNombre = data[0].direcciones[0].postal.nombre
            this.datosUE.documento_id = 25
            this.datosUE.estaEnuserTercero = false
            this.datosUE.dondeEncontreLosDatos = 'GOHU'
            return HTTP().get(`/estaenusertercero/${data[0].id}`).then(({ data }) =>{
              if (data) {
                this.datosUE.estaEnUserTercero = true
              }
            })
          } else if (data.datosGenerales!=undefined) {
            // VIENE DESDE LA AFIP
            if (data.datosGenerales.apellido!=undefined) {
              this.datosUE.nombre = data.datosGenerales.apellido+' '+data.datosGenerales.nombre
              this.datosUE.razonsocial = data.datosGenerales.apellido+' '+data.datosGenerales.nombre
            } else if (data.datosGenerales.razonSocial!=undefined) {
              this.datosUE.nombre = data.datosGenerales.razonSocial
              this.datosUE.razonsocial = data.datosGenerales.razonSocial
            }
            this.datosUE.dondeEncontreLosDatos = 'AFIP'
            this.datosUE.documento_id = 25
            if (data.datosMonotributo!=undefined) {
              this.datosUE.responsable_id = 6
            } else {
              this.datosUE.responsable_id = 1
            }
            this.datosUE.direccion = data.datosGenerales.domicilioFiscal.direccion
            let dom=''
            if (data.datosGenerales.domicilioFiscal.localidad!=undefined) {
              dom = data.datosGenerales.domicilioFiscal.localidad
            } else if (data.datosGenerales.domicilioFiscal.descripcionProvincia!=undefined) {
              dom = data.datosGenerales.domicilioFiscal.descripcionProvincia
            }
            return HTTP().post('/buscarocrearpostal', {
              cod: data.datosGenerales.domicilioFiscal.codPostal,
              nom: dom,
              prov: data.datosGenerales.domicilioFiscal.idProvincia })
              .then(({ data }) => {
                this.datosUE.postal_id = data[0].id
                this.datosUE.postalNombre = data[0].nombre
            })
          }
        }
      })
    },

    noVerMasElMensajeInicial() {
      return HTTP().post('/novermaselmensajeinicial',{timeout: 5000}).then(({ data }) => {
        if (data=='ok') {
          this.mensaje('¡Mensaje inicial desactivado!', this.$store.state.temas.forms_titulo_bg, 2500)
          this.$store.commit('setInicial', 0, { root: true });  
        } else {
          this.mensaje('¡Opps, el mensaje inicial no se ha podido desactivar!', this.$store.state.temas.snack_error_bg, 2500)
        }
      })
    },

    nroSucursal() {
      this.datosUE.sucursalFiscal = this.datosUE.sucursalFiscal.padStart(4,'0')
    },

    roundTo(value, places){
      var power = Math.pow(10, places);
      return Math.round(value * power) / power;
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    fechadelprecio (fecha) {
      return moment(fecha).fromNow(true);
    },

  }
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
  @keyframes escalar {
    to {
      transform: scale(1)
    }
    from {
      transform: scale(1.01)
    }
    
  }
  .galeria__img:hover {
    filter: brightness(95%);
  }
  .contenedor-galeria-fuente-articulo {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 400;
  }
  .contenedor-galeria-fuente-importe {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .contenedor-galeria-fuente-descuento {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: red;
  }
  .contenedor-galeria-fuente-descuento-unds {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
    color: red;
  }
  .contenedor-galeria-fuente-ivasiniva {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: gray;
  }
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg50 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 50%;
  }
  .fg100b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    font-weight: bold;
  }
  .fg80br {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 80%;
    font-weight: bold;
    color: red;
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
  .fg250b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 250%;
    font-weight: bold;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .fg75 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 75%;
  }
  .fg65 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 65%;
  }
  .fg55 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 55%;
  }
  .fg45 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 45%;
  }
  table.v-table thead th {
    font-size: 20px !important;
  }
  table.v-table tbody td {
    font-size: 18px !important;
  }

</style>