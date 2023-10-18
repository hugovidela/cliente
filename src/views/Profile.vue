<template>
  <v-layout align-start>
    <v-flex class="fg">

      <!-- Modal del diálogo para Alta y Edicion -->
      <v-dialog v-model="dialog" max-width="800px" :fullscreen="true" persistent>
        <template v-slot:activator="{ on }"></template>
        <v-card class="fg">

          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              icon @click="closeForm">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>

            <span class="fg">Mi Perfil / {{!accesoCEO ? operario : empresa}}</span>
            <v-spacer></v-spacer>

            <v-btn
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="ma-2 white--text" @click="guardar">
              Guardar
            </v-btn>

          </v-toolbar>

          <v-form ref="form">
            <v-card-text>
              <v-container fluid>
                <v-tabs :color="temas.forms_titulo_bg">
                  <v-tab href="#general" v-if="accesoCEO">
                    General
                  </v-tab>
                  <v-tab href="#operario" v-if="!accesoCEO">
                    Operario
                  </v-tab>
                  <v-tab href="#sucursales" v-if="accesoCEO && !externo">
                    Sucursales
                  </v-tab>
                  <v-tab href="#usuarios" v-if="accesoCEO && !externo">
                    Equipo
                  </v-tab>
                  <v-tab href="#tarjetascobros" v-if="accesoCEO && !externo">
                    Tarjetas
                  </v-tab>
                  <v-tab href="#password">
                    Contraseña
                  </v-tab>
                  <v-tab href="#cprs" v-if="accesoCEO && !externo">
                    Comprobantes
                  </v-tab>
                  <v-tab href="#importaciones" v-if="accesoCEO && !externo">
                    Importaciones
                  </v-tab>
                  <v-tab href="#impuestos" v-if="accesoCEO && !externo">
                    Impuestos
                  </v-tab>

                  <!--
                    TAB GENERAL
                  -->
                  <v-tab-item value="general">
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          ref="username"
                          disabled
                          v-model="editado.username"
                          label="Razón Social"
                          required
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          v-model="editado.email"
                          label="Correo Electrónico"
                          disabled
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row align="center">
                      <v-col cols="8" sm="8">
                        <v-select
                          v-model="rubValue"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :items="rubItems"
                          autofocus
                          disabled
                          chips
                          label="Rubros a los cuales pertenece el usuario"
                          multiple
                          outlined>
                        </v-select>
                      </v-col>

                      <v-col cols="3" sm="3" align="center" class="pt-6 md-6">
                        <v-file-input
                          v-model="logotipo1"
                          outlined
                          label="Avatar"
                          prepend-icon="mdi-camera"
                          :color="temas.forms_titulo_bg"
                          @change="avatarClick(1)">
                          <template v-slot:selection="{ text }">
                            {{ logotipo1.name }}
                          </template>
                        </v-file-input>
                      </v-col>
                      <v-col cols="1" sm="1" align="center" class="pb-7">
                        <v-avatar size="60px" class="mt-0">
                          <img alt="Avatar"
                          :src="`/images/${logotipo1.name}`">
                        </v-avatar>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="4" sx="4" mx="4">
                        <v-autocomplete
                          v-model="editado.tercero_id"
                          :color="temas.forms_titulo_bg"
                          :items="itemsTerceros"
                          :loading="isLoadingTerceros"
                          :search-input.sync="searchTerceros"
                          :disabled="externo"
                          item-text="nombre"
                          item-value="id"
                          label="Tercero al cual esta ligado el usuario"
                          placeholder="Escriba para buscar"
                          prepend-icon="mdi-database-search">
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="4" sx="4" mx="4">
                        <v-select
                          v-model="editado.tipo"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :items="tipLicencia"
                          disabled
                          item-value="id"
                          item-text="nombre"
                          label="Tipo de Licencia"
                          outlined>
                        </v-select>
                      </v-col>
                      <v-col cols="3" sm="3" align="center" class="md-6">
                        <v-file-input
                          v-model="logotipo2"
                          outlined
                          label="Logotipo"
                          prepend-icon="mdi-camera"
                          :color="temas.forms_titulo_bg"
                          @change="avatarClick(2)">
                          <template v-slot:selection="{ text }">
                            {{ logotipo2.name }}
                          </template>
                        </v-file-input>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field v-if="!externo"
                          disabled
                          ref="porrem"
                          outlined
                          v-model="editado.porrem"
                          :color="temas.forms_titulo_bg"
                          label="% de Remarcación Global"
                          min="0" max="100">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pl-0">
                        <v-text-field v-if="!externo"
                          ref="Prefijo Artículos"
                          outlined
                          v-model="editado.prefijo"
                          :color="temas.forms_titulo_bg"
                          label="Prefijo para Artículos"
                          required
                          :counter="5"
                          :maxlength="5">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pl-0">
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pl-0">
                        <v-select v-if="!externo"
                          v-model="editado.timeout_refresh"
                          :disabled="externo"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :items="timeoutRefreshList"
                          item-value="id"
                          item-text="segundos"
                          label="Seg p/refrescar Notificaciones"
                          outlined>
                        </v-select>
                      </v-col>
                      <v-col class="pl-9 pb-4" cols="2" sm="2" align="center">
                        <v-img
                          :aspect-ratio="16/9"
                          :width="100"
                          :src="`/images/${logotipo2.name}`">
                        </v-img>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="2" sx="2" mx="2" class="pt-0" v-show="!externo">
                        <v-radio-group
                          v-model="editado.faeproduccion" column outlined>
                          <div>Facturación Electrónica</div>
                          <v-radio label="Producción"   value="P"
                            :color="temas.forms_titulo_bg"
                            class="pl-6 pt-2">
                          </v-radio>
                          <v-radio label="Homologación" value="H"
                            :color="temas.forms_titulo_bg"
                            class="pl-6"></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-12 pl-6" v-show="!externo">
                        <v-text-field
                          v-model="editado.faevencimiento"
                          outlined
                          type="date"
                          disabled
                          :color="temas.forms_titulo_bg"
                          label="Vencimiento del Certificado">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-12 pl-6" v-show="!externo">
                        <v-text-field
                          v-model="editado.faearchivocrt"
                          outlined
                          disabled
                          :color="temas.forms_titulo_bg"
                          label="Archivo CRT">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-12 pl-6" v-show="!externo">
                        <v-text-field
                          v-model="editado.faearchivokey"
                          outlined
                          disabled
                          :color="temas.forms_titulo_bg"
                          label="Archivo KEY">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-12 pl-6" v-show="!externo">
                        <v-btn
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text" @click="actCertificado">
                          Actualizar CRT&KEY
                        </v-btn>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-12 pl-6" v-show="!externo">
                        <v-btn
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text" @click="chequearAfip">
                          Chequear AFIP
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row class="pt-0 pb-0 pl-3" v-if="!externo">
                      <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0">
                        <v-switch class="pt-0 pb-0"
                          label=
                          "¿Realizas comprobantes M?, Por diferentes motivos AFIP
                          anula a sus contribuyentes la posibilidad de realizar comprobantes A,
                          en su lugar estos son reemplazados por comprobantes M."
                          v-model="editado.comprobantesm"
                          :color="temas.forms_titulo_bg">
                        </v-switch>
                      </v-col>
                    </v-row>
                    <v-row class="pt-0 pb-0 pl-3" v-if="!externo">
                      <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0">
                        <v-switch class="pt-0 pb-0"
                          label=
                          "¿Habilitas Turnos?, Característia utilizada por aquellas empresas
                          que principalmente comercializan servicios y necesitan administrar
                          sus Turnos."
                          v-model="editado.turnos"
                          :color="temas.forms_titulo_bg">
                        </v-switch>
                      </v-col>
                    </v-row>
                    <v-row v-if="editado.turnos && !externo">
                      <v-col cols="12" sm="12" md="12">
                        <v-combobox
                          outlined
                          v-model="editado.turnoslv"
                          :color="temas.forms_titulo_bg"
                          :items="turnosHorasLV"
                          chips label=
                          "Escala de Turnos de Lunes a Viernes (ingrese hh:mm / hh y
                          luego presione el tabulador) Si no especificas escalas de turnos
                          podrás ingresarlos en forma arbitraria."
                          multiple
                          @change="checkHora('lv')">
                          <template v-slot:selection="{ attrs,item,select,selected}">
                            <v-chip
                              v-bind="attrs"
                              :input-value="selected"
                              close
                              @click="select"
                              @click:close="removeTurnosLV(item)">
                              <strong>{{ item }}</strong>&nbsp;
                            </v-chip>
                          </template>
                        </v-combobox>
                      </v-col>
                    </v-row>
                    <v-row v-if="editado.turnos">
                      <v-col cols="12" sm="12" md="12">
                        <v-combobox
                          outlined
                          v-model="editado.turnossd"
                          :color="temas.forms_titulo_bg"
                          :items="turnosHorasSD"
                          chips label=
                          "Escala de Turnos para Sábados y Domingos (ingrese hh:mm / hh y
                          luego presione el tabulador) Si no especificas escalas de turnos
                          podrás ingresarlos en forma arbitraria."
                          multiple
                          @change="checkHora('sd')">
                          <template v-slot:selection="{ attrs,item,select,selected}">
                            <v-chip
                              v-bind="attrs"
                              :input-value="selected"
                              close
                              @click="select"
                              @click:close="removeTurnosSD(item)">
                              <strong>{{ item }}</strong>&nbsp;
                            </v-chip>
                          </template>
                        </v-combobox>
                      </v-col>
                    </v-row>
                    <v-row class="pt-0 pb-0 pl-3" v-if="!externo">
                      <v-col cols="4" sx="4" mx="4" class="pt-0 pb-0">
                        <v-switch  class="pt-0 pb-0"
                          label="Informar precios con IVA en el Carro de Compras"
                          v-model="editado.preciosconiva"
                          :color="temas.forms_titulo_bg">
                        </v-switch>
                      </v-col>
                      <v-col cols="4" sx="4" mx="4" class="pt-0 pb-0">
                        <v-switch  class="pt-0 pb-0"
                          label="Bonificaciones en Compras ¿Las aplicas a tus Costos?"
                          v-model="editado.aplicarBonifDeProvEnVtas"
                          :color="temas.forms_titulo_bg">
                        </v-switch>
                      </v-col>
<!--
                      <v-col cols="2" sx="2" mx="2" class="pt-0 pb-0 pl-0" v-show="!externo">
                        <v-btn
                          fab x-small
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="mt-5 white--text" @click="dialogCostosBonificados=true">
                          <v-icon dark>mdi-help</v-icon>
                        </v-btn>
                      </v-col>
-->
                      <v-col cols="2" sx="2" mx="2" class="pt-0 pb-0 pl-0" v-show="!externo">
                        <v-btn
                          fab x-small
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="mt-5 white--text" @click="dialogCostosBonificados=true"
                          link :to="{name: 'ayuda', params: {id: 2}}">
                          <v-icon dark>mdi-help</v-icon>
                        </v-btn>
                      </v-col>

                    </v-row>
                    <v-row class="pt-0 pb-0 pl-3">
                      <v-col cols="5" sx="5" mx="5" class="pt-0 pb-0 pr-0" v-show="!externo">
                        <v-switch
                          :label="`¿Anclar Precios al Dolar? (${cttArticulosAnclados}
                          Artículos/Anclados)`"
                          :disabled="cttArticulosAnclados>0"
                          :color="temas.cen_btns_bg"
                          v-model="editado.anclarcostos">
                        </v-switch>
                      </v-col>
                      <v-col cols="5" sx="5" mx="5" class="pt-0 pb-0 pl-0" v-show="!externo">
                        <v-switch
                          label=
                          "Utilizar el costo anclado solo cuando sea mayor al último costo
                          cargado."
                          :disabled="!editado.anclarcostos"
                          :color="temas.cen_btns_bg"
                          v-model="editado.desanclarautomaticamente">
                        </v-switch>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-0 pb-0 pl-0" v-show="!externo">
                        <v-btn
                          fab x-small
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="mt-5 white--text" @click="dialogAnclarUsd=true">
                          <v-icon dark>mdi-help</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row class="fg115 pt-0 pb-0 pl-3" v-if="exclusivoDe.id==null">
                      <v-col cols="4" sm="4" md="4">
                        <p>
                          Porcentajes de remarcaciones generales
                          para asignar precios sugeridos a tus clientes.
                        </p>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field class="pt-0 pb-0"
                          v-model="editado.porrev1"
                          :color="temas.cen_btns_bg"
                          label="%Rem.1" type="number" min="0" max="500" @change="porRev('1')">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1" class="fg">
                        <v-text-field class="pt-0 pb-0"
                          v-model="editado.porrev2"
                          :color="temas.cen_btns_bg"
                          label="%Rem.2" type="number" min="0" max="500" @change="porRev('2')">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field class="pt-0 pb-0"
                          v-model="editado.porrev3"
                          :color="temas.cen_btns_bg"
                          label="%Rem.3" type="number" min="0" max="500" @change="porRev('3')">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-0 pb-0 pl-0" v-show="!externo">
                        <v-btn
                          fab x-small
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="mt-5 white--text" @click="dialogPreciosSugeridos=true">
                          <v-icon dark>mdi-help</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="3" sx="2" mx="2" class="pt-0 pb-0 pl-6" v-show="!externo">
                        <v-switch
                          label=
                          "Facturar solo los artículos comprados."
                          :color="temas.cen_btns_bg"
                          v-model="editado.soloartcomprados">
                        </v-switch>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-0 pb-2 pl-0" v-show="!externo">
                        <v-btn
                          fab x-small
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="mt-5 white--text" @click="dialogSoloArtConPrecios=true">
                          <v-icon dark>mdi-help</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-row v-show="tipo!='PP'">
                      <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0 pl-6">
                        <v-radio-group v-model="editado.comoinfstock" row outlined>
                          <div class="pr-3">
                            ¿Como quieres que tus clientes vean tu Stock?
                          </div>
                          <v-radio
                            :color="temas.forms_titulo_bg"
                            label="mostrar Unidades" value="U">
                          </v-radio>
                          <v-radio
                            :color="temas.forms_titulo_bg"
                            label="mostrar el Texto: ( Hay Stock, Sin Stock )" value="T">
                          </v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>

                    <v-row v-show="tipo!='PP'">
                      <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0 pl-6">
                        <v-radio-group v-model="editado.codigooid" row outlined>
                          <div class="pr-3">
                            ¿Mostrar y buscar Artículos por sus ID's o por sus Códigos?
                          </div>
                          <v-radio
                            :color="temas.forms_titulo_bg"
                            label="por Códigos" value="C">
                          </v-radio>
                          <v-radio
                            :color="temas.forms_titulo_bg"
                            label="por ID's" value="I">
                          </v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>

                    <v-row class="fg115 pt-0 pb-0 pl-3">
                      <v-col cols="7" sm="7" md="7">
                        <p>
                          Cantidad de Artículos a cargar desde el servidor en Búsquedas.<br>
                          Si tu servicio de internet no es el óptimo, baja este número para
                          que tus búsquedas sean mas rápidas.<br>
                          Los valores permitidos son entre 10 y 300.
                        </p>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field class="pt-0 pb-0"
                          v-model="editado.cttloadreg"
                          type="number"
                          :color="temas.cen_btns_bg"
                          label="Ctt" min="10" max="300"
                          @change="cttRegLoad">
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <!--
                    <v-row class="pt-0 pb-0 pl-3" v-show="tipo!='PP'">
                      <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0">
                        <v-switch
                          label=
                          "¿Usas el sistema?. Si dehabilitas esta opción gohu tomará el control
                          de tu cuenta, siempre y cuando tu lo autorices.
                          Este control es solo a los efectos de poder actualizar tus precios con
                          la información que nos brindes a medida de que lo creas necesario. Asi
                          tus clientes podrán permanecer actualizados."
                          :color="temas.cen_btns_bg"
                          v-model="editado.administragohu">
                        </v-switch>
                      </v-col>
                    </v-row>
                    -->

                    <v-row class="pt-0 pb-0 pl-3" v-show="tipo!='PP'">
                      <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0">
                        <v-switch
                          label=
                          "¿Usas Maletines?. Puede ser útil si tu estructura de ventas es zonal,
                          con personal que se encargan de entregar mercadería y recolectar valores.
                          Para mas información revisa la ayuda en el apartado Maletines."
                          :color="temas.cen_btns_bg"
                          v-model="editado.usamaletines">
                        </v-switch>
                      </v-col>
                    </v-row>

                    <v-row class="pt-0 pb-0 pl-3" v-show="tipo!='PP'">
                      <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0">
                        <v-switch
                          label=
                          "¿Quieres ser invisible para el resto de los usuarios?
                          (No aparecerás en el módulo de vinculaciones, y las que ya tengas
                          permanecerán activas)"
                          :color="temas.cen_btns_bg"
                          v-model="editado.invisible">
                        </v-switch>
                      </v-col>
                    </v-row>

                    <v-row class="pt-0">
                      <v-dialog v-model="dialogPreciosSugeridos" max-width="800px">
                        <v-card class="fg">
                          <v-toolbar flat
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true">
                            <v-btn
                              icon @click="dialogPreciosSugeridos=false"
                              :color="temas.forms_close_bg"
                              :dark="temas.forms_close_dark==true">
                              <v-icon>mdi-arrow-left-circle</v-icon>
                            </v-btn>
                            <span class="text--right">
                              Porcentajes de Remarcación para Precios Sugueridos
                            </span>
                            <v-spacer></v-spacer>
                          </v-toolbar>
                          <v-card-text class="fg">
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <span>
                                    Cuando te vinculas con tus clientes les transfieres
                                    automaticamente todos tus artículos y precios (sin IVA),
                                    lo que para ellos representarán sus costos.<br>
                                    Lo que no le transfieres son los porcentajes de remarcación
                                    que estos deberán utilizar al momento de la venta y/o consulta.
                                    <br>
                                    Entonces aquí puedes suguerir que porcentajes aplicar a tus
                                    precios de venta.<br>
                                    Puedes configurar hasta tres porcentajes globales.<br>
                                    Luego también puedes indicarlos en cada artículo en
                                    particular si así lo crees necesario.<br>
                                    Si reasignas porcentajes en articulos, estos tendrán
                                    prioridad por sobre los aqui especificados.<br>
                                    Luego y finalmente, deberás indicar a cada cliente cual
                                    de estos tres porcentajes leerá.<br><br>
                                    <b>IMPORTANTE</b> A medida que un cliente te vaya realizando
                                    compras, los artículos involucrados en la misma pasarán a ser
                                    'configurables' para el cliente, es decir que el cliente podrá
                                    agruparlos, asignarles una marca, y entre otas,
                                    asignarle un nuevo porcentaje de remarcación más adecuado,
                                    o simplemente dejar el que le asignaste como suguerido.
                                    <br><br>
                                  </span>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-row>

                    <v-row class="pt-0">
                      <v-dialog v-model="dialogSoloArtConPrecios" max-width="800px">
                        <v-card class="fg">
                          <v-toolbar flat
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true">
                            <v-btn
                              icon @click="dialogSoloArtConPrecios=false"
                              :color="temas.forms_close_bg"
                              :dark="temas.forms_close_dark==true">
                              <v-icon>mdi-arrow-left-circle</v-icon>
                            </v-btn>
                            <span class="text--right">
                              Facturar Artículos no comprados de Proveedores Vinculados
                            </span>
                            <v-spacer></v-spacer>
                          </v-toolbar>
                          <v-card-text class="fg">
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <span>
                                    <b>Habilitando esta opción podrás facturar artículos de tus
                                      proveedores sin que los hayas comprado.
                                    </b>
                                    <br><br>
                                    Cuando te vinculas con un Proveedor este te transfiere
                                    todos sus artículos quedando estos a tu disposición, <i>pero
                                    inicialmente para Consultas</i>.<br>
                                    A medida que vas realizando compras, los artículos
                                    incluidos en la mismas se van agregando a tu sistema,
                                    quedando habilitados para ser facturados y <i>visibilizados
                                    para tus clientes vinculados.</i>
                                    <br><br>

                                    <b>Importante:</b> Sobre los artículos comprados podrás
                                    redefinir Grupos, Marcas, % de remarcación, etc.
                                    <i><b>menos el costo que siempre lo define tu Proveedor.</b>
                                    </i><br>
                                    Es decir, que estos artículos ya forman parte de tu inventario
                                    como si fueran propios.<br>
                                    <i>Es importante que sepas que tus clientes vinculados solo
                                    podrán ver tu artículos propios y tu artículos comprados.</i>
                                    <br><br>
                                    En todo sistema comercial, para que puedas vender un bien de
                                    cambio primero tienes que haberlo comprado.
                                    De esta forma es posible administrar su stock, tus compras,
                                    impuestos, etc.<br>
                                    No obstante puede que no quieras adimistrar el stock de tus
                                    productos, por eso dejamos abierta esta posibilidad.
                                    <br><br>
                                  </span>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-row>

                    <v-row class="pt-0">
                      <v-dialog v-model="dialogCostosBonificados" max-width="800px">
                        <v-card class="fg">
                          <v-toolbar flat
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true">
                            <v-btn
                              icon @click="dialogCostosBonificados=false"
                              :color="temas.forms_close_bg"
                              :dark="temas.forms_close_dark==true">
                              <v-icon>mdi-arrow-left-circle</v-icon>
                            </v-btn>
                            <span class="text--right">
                              Bonificaciones en Costos
                            </span>
                            <v-spacer></v-spacer>
                          </v-toolbar>
                          <v-card-text class="fg">
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <span>
                                    Si activas esta funcionalidad cada vez que ingreses una compra
                                    y esta posea bonificaciones en sus Artículos, estas se
                                    aplicarán a sus costos.
                                    <br><br>
                                    Te recordamos que cuando un costo es modificado no se aplica
                                    directamente en tus precios, sino que se almacenan en un archivo
                                    temporal para que luego los confirmes. Esto desde el módulo
                                    <i>Artículos</i> / <i>Cambios de Precios</i> /
                                    <i>Precios Modificados por Compras
                                    </i>
                                    <br><br>
                                  </span>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-row>

                    <v-row class="pt-0">
                      <v-dialog v-model="dialogAnclarUsd" max-width="800px">
                        <v-card class="fg">
                          <v-toolbar flat
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true">
                            <v-btn
                              icon @click="dialogAnclarUsd=false"
                              :color="temas.forms_close_bg"
                              :dark="temas.forms_close_dark==true">
                              <v-icon>mdi-arrow-left-circle</v-icon>
                            </v-btn>
                            <span class="text--right">
                              Anclar costos al precio del Dolar
                            </span>
                            <v-spacer></v-spacer>
                          </v-toolbar>
                          <v-card-text class="fg">
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <span>
                                    <i>Esta característica funciona solo para aquellos artículos
                                    con moneda Pesos.</i><br><br>
                                    Esta funcionalidad te permitirá anclar tus costos
                                    al valor del dolar blue vendedor.<br><br>
                                    Cuando inicias este proceso sobre un artículo, el sistema
                                    toma el costo actual, lo divide por el valor
                                    del dolar del momento y lo almacena en la base de datos.
                                    Este valor permanecera fijo y, cada vez que se requiera
                                    el artículo, lo multiplicará por la cotizacion leída desde
                                    <i>wwww.dolarsi.com</i>.
                                    <br>
                                    El valor del dolar se actualiza todos los dias desde
                                    www.dolarsi.com entre las 10 y 15 hrs, y lo hace cada 15
                                    minutos, para asegurarnos de que siempre este actualizado.
                                    <br><br>
                                    Es común que un costo en pesos supere al incremento del dolar.
                                    <br>
                                    Para ello podrás configurar que <i>el costo anclado solo se
                                    utilice si el costo del artículo es menor.</i>
                                    Entonces, si actualizas un costo y este resulta mayor al
                                    calculado por el ancla, se tomara el nuevo costo que
                                    ingresaste.
                                    <br><br>
                                    Veamos un pequeño ejemplo: <br>
                                    Supongamos que un artículo tiene un costo de $ 700.00, y la
                                    cotización del dolar es de $ 100.00.<br>Entonces el costo
                                    anclado en dolares será de usd 7.00.<br>
                                    De ahora en más el costo del artículo será: 7.00 * la
                                    cotización del dolar blue del momento, <i>siempre y cuando
                                    el costo actual en pesos no haya superado
                                    dicho valor y este activada la opción
                                    'Utilizar costo anclado solo cuando sea mayor al último
                                    costo anclado'</i><br><br>
                                    NOTA: <b>Es muy importante que tengas actualizado el costo del
                                    artículo al momento de anclarlo.</b><br>
                                    <br>
                                  </span>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-row>

                    <v-row class="pt-0">
                      <v-dialog v-model="dialogActCertificado" max-width="800px">
                        <v-card class="fg">
                          <v-toolbar flat
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true">
                            <v-btn
                              icon @click="dialogActCertificado=false"
                              :color="temas.forms_close_bg"
                              :dark="temas.forms_close_dark==true">
                              <v-icon>mdi-arrow-left-circle</v-icon>
                            </v-btn>
                            <span class="text--right">
                              Actualización de Certificados Digitales AFIP
                            </span>
                            <v-spacer></v-spacer>
                            <v-btn v-if="nuevoCRT&&nuevoKEY"
                              :color="temas.cen_btns_bg"
                              :dark="temas.cen_btns_dark==true"
                              class="ma-2 white--text"
                              @click="uploadCrtAndKey()">
                              Subir Archivos al Servidor
                            </v-btn>

                          </v-toolbar>
                          <v-card-text class="fg">
                            <v-container>
                              <v-row>
                                <v-col cols="2" class="pt-7">
                                  <span>
                                    Archivo CRT
                                  </span>
                                </v-col>
                                <v-col cols="10" sm="10" class="pt-5">
                                  <v-file-input
                                    filled dense
                                    show-size
                                    :color="temas.forms_titulo_bg"
                                    prepend-icon="mdi-file-check"
                                    v-model="nuevoCRT">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-file-input>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="2" class="pt-5">
                                  <span>
                                    Archivo KEY
                                  </span>
                                </v-col>
                                <v-col cols="10" sm="10" class="pt-2">
                                  <v-file-input
                                    filled dense
                                    show-size
                                    :color="temas.forms_titulo_bg"
                                    prepend-icon="mdi-file-check"
                                    v-model="nuevoKEY">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-file-input>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-row>

                    <v-row v-if="!externo">
                      <v-col cols="12" sx="12" mx="12">
                        <v-textarea
                          v-model="editado.observ"
                          :color="temas.forms_titulo_bg"
                          label="Describe tu empresa, tus formas de comercialización, etc.
                          Para que tus clientes sepan quién eres y como trabajas"
                          auto-grow
                          outlined
                          rows="3"
                          row-height="25"
                          shaped>
                        </v-textarea>
                      </v-col>
                    </v-row>

                  </v-tab-item>
                  <!--
                    TAB OPERADORES
                  -->
                  <v-tab-item value="operario">
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          ref="username"
                          disabled
                          v-model="editado.username"
                          label="Razón Social"
                          required
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          v-model="editado.email"
                          label="Correo Electrónico"
                          disabled
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row align="center">
                      <v-col cols="6" sx="6" mx="6">
                        <v-autocomplete
                          v-model="editado.tercero_id"
                          disabled
                          :color="temas.forms_titulo_bg"
                          :items="itemsTerceros"
                          :loading="isLoadingTerceros"
                          :search-input.sync="searchTerceros"
                          item-text="nombre"
                          item-value="id"
                          label="Tercero al cual esta ligado el usuario"
                          placeholder="Escriba para buscar"
                          prepend-icon="mdi-database-search">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="3" sm="3" align="center" class="md-6">
                        <v-file-input
                          v-model="logotipo1"
                          outlined
                          label="Avatar"
                          prepend-icon="mdi-camera"
                          :color="temas.forms_titulo_bg"
                          @change="avatarClick(1)">
                          <template v-slot:selection="{ text }">
                            {{ logotipo1.name }}
                          </template>
                        </v-file-input>
                      </v-col>
                      <v-col cols="1" sm="1" align="center">
                        <v-avatar size="60px" class="mt-0">
                          <img alt="Avatar"
                          :src="`/images/${logotipo1.name}`">
                        </v-avatar>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <!--
                    TAB SUCURSALES
                  -->
                  <v-tab-item value="sucursales">
                    <v-data-table
                      :headers="headersSuc"
                      :items="suc"
                      dense
                      class="elevation-3 mt-3">
                      <template v-slot:top>
                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">
                          <v-dialog v-model="dialogSuc" max-width="800px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="nuevaSucursal">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                              <v-toolbar-title class="white--text pl-4">
                                Sucursales
                              </v-toolbar-title>
                            </template>
                            <v-card class="fg">
                              <v-toolbar flat
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true">
                                <v-btn
                                  icon @click="cancelarSuc"
                                  :color="temas.forms_close_bg"
                                  :dark="temas.forms_close_dark==true">
                                  <v-icon>mdi-arrow-left-circle</v-icon>
                                </v-btn>
                                <span class="text--right">
                                  {{ formTitleSuc }}
                                </span>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="teal accent-4" class="ma-2 white--text"
                                  @click="guardarSuc(editadoSuc)">
                                  Guardar
                                </v-btn>
                              </v-toolbar>

                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="7" sm="7" md="7">
                                      <v-text-field
                                        v-model="editadoSuc.nombre"
                                        :color="temas.forms_titulo_bg"
                                        label="Nombre"
                                        autofocus
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="3" sm="3" md="3">
                                      <v-text-field
                                        v-model="editadoSuc.abreviado"
                                        :color="temas.forms_titulo_bg"
                                        label="Abreviado"
                                        required
                                        :counter="10"
                                        :maxlength="10">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="2" sm="2" md="2">
                                      <v-text-field
                                        v-model="editadoSuc.fiscal"
                                        @change="sucFiscal()"
                                        :color="temas.forms_titulo_bg"
                                        label="Fiscal"
                                        required
                                        :counter="4"
                                        :maxlength="4">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="2" sm="2" md="2">
                                      <v-text-field
                                        v-model="editadoSuc.manual"
                                        @change="sucManual()"
                                        :color="temas.forms_titulo_bg"
                                        label="Manual"
                                        required
                                        :counter="4"
                                        :maxlength="4">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="5" sx="5" mx="5">
                                      <v-switch
                                        label="Activa Facturación Electrónica"
                                        v-model="editadoSuc.electronica"
                                        :color="temas.forms_titulo_bg">
                                      </v-switch>
                                    </v-col>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-switch
                                        label="Es Sucursal Demo"
                                        v-model="editadoSuc.sucursaldemo"
                                        :color="temas.forms_titulo_bg">
                                      </v-switch>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sx="12" mx="12">
                                      <span class="fg">Depósitos</span>
                                      <v-data-table
                                        :headers="headersDep"
                                        :items="dep"
                                        dense
                                        class="elevation-3"
                                        hide-default-footer>
                                        <template v-slot:top>
                                          <v-toolbar flat
                                            :color="temas.forms_titulo_bg"
                                            :dark="temas.forms_titulo_dark==true">
                                            <v-dialog v-model="dialogDep" max-width="450px">
                                              <template v-slot:activator="{ on, attrs }">
                                                <v-btn fab x-small
                                                  :color="temas.cen_btns_bg"
                                                  :dark="temas.cen_btns_dark==true"
                                                  @click="nuevoDeposito">
                                                  <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                              </template>
                                              <v-card class="fg">
                                                <v-card-title>
                                                  <span class="fg">{{ formTitleDep }}</span>
                                                </v-card-title>
                                                <v-card-text>
                                                  <v-container>
                                                    <v-row>
                                                      <v-col cols="12" sm="12" md="12">
                                                        <v-text-field
                                                          v-model="editadoDep.nombre"
                                                          :color="temas.forms_titulo_bg"
                                                          label="Nombre"
                                                          required
                                                          :counter="30"
                                                          :maxlength="30">
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
                                                    @click="cancelarDep">
                                                    Cancelar
                                                  </v-btn>
                                                  <v-btn
                                                    :color="temas.cen_btns_bg"
                                                    :dark="temas.cen_btns_dark==true"
                                                    text
                                                    @click="guardarDep(editadoDep)">
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
                                            dark>{{item.activo?'Sí':'No'}}
                                          </v-chip>
                                        </template>
                                        <template v-slot:item.accion="{item}">
                                          <v-btn
                                            class="mr-2" fab x-small
                                            :color="temas.forms_btn_editar_bg"
                                            :dark="temas.forms_btn_editar_dark==true"
                                            @click="editarDep(item)">
                                            <v-icon dark>mdi-pencil</v-icon>
                                          </v-btn>
                                          <v-btn
                                            class="mr-2" fab x-small
                                            :color="temas.forms_btn_activar_bg"
                                            :dark="temas.forms_btn_activar_dark==true"
                                            @click="activarDesactivarDep(item)">
                                            <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                          </v-btn>
                                        </template>
                                      </v-data-table>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="6" sm="6" md="6">
                                      <v-select
                                        v-model="editadoSuc.tema"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="lostemas"
                                        dense
                                        label="Tema"
                                        outlined
                                        class="pt-3">
                                      </v-select>
                                    </v-col>
                                  </v-row>

                                </v-container>
                              </v-card-text>
                            </v-card>
                          </v-dialog>
                        </v-toolbar>
                      </template>
                      <template v-slot:item.electronica="{ item }">
                        <v-chip
                          :color="getColor(item.electronica)"
                          dark>{{item.electronica?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.activo="{ item }">
                        <v-chip
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.sucursaldemo="{ item }">
                        <v-chip
                          :color="getColor(item.sucursaldemo)"
                          dark>{{item.sucursaldemo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.accion="{item}">
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_editar_bg"
                          :dark="temas.forms_btn_editar_dark==true"
                          @click="editarSuc(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_activar_bg"
                          :dark="temas.forms_btn_activar_dark==true"
                          @click="activarDesactivarSuc(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                  <!--
                    TAB USUARIOS
                  -->
                  <v-tab-item value="usuarios">
                    <v-data-table
                      :headers="headersUsr"
                      :items="usr"
                      dense
                      class="elevation-3 pt-3">
                      <template v-slot:top>
                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">
                          <v-dialog v-model="dialogUsr" max-width="700px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="nuevoUsuario">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                              <v-toolbar-title class="white--text pl-4">
                                Equipo
                              </v-toolbar-title>
                            </template>
                            <v-card class="fg">
                              <v-toolbar flat
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true">
                                <v-btn
                                  icon @click="cancelarUsr"
                                  :color="temas.forms_close_bg"
                                  :dark="temas.forms_close_dark==true">
                                  <v-icon>mdi-arrow-left-circle</v-icon>
                                </v-btn>
                                <span class="text--right">
                                  {{ formTitleUsr }}
                                </span>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="teal accent-4" class="ma-2 white--text"
                                  @click="guardarUsr(editadoUsr)">
                                  Guardar
                                </v-btn>
                              </v-toolbar>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field
                                        v-model="editadoUsr.username"
                                        :color="temas.forms_titulo_bg"
                                        label="Nombre"
                                        autofocus
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field
                                        v-model="editadoUsr.email"
                                        :color="temas.forms_titulo_bg"
                                        :rules="emailRules"
                                        label="correo"
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col v-show="editedIndexUsr<0" cols="12" sm="12" md="12">
                                      <v-text-field
                                        v-model="editadoUsr.password"
                                        :color="temas.forms_titulo_bg"
                                        label="Password Inicial"
                                        type="password"
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-select
                                        label="Nivel"
                                        v-model="editadoUsr.level"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="niveles"
                                        item-value="level"
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
                        </v-toolbar>
                      </template>
                      <template v-slot:item.activo="{ item }">
                        <v-chip
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.accion="{item}">
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_editar_bg"
                          :dark="temas.forms_btn_editar_dark==true"
                          @click="editarUsr(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_activar_bg"
                          :dark="temas.forms_btn_activar_dark==true"
                          @click="activarDesactivarUsr(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                  <!--
                    TAB TARJETAS COBROS
                  -->
                  <v-tab-item value="tarjetascobros">
                    <div>
                      <v-row>
                        <v-col cols="3" sx="3" mx="3">
                          <v-text-field
                            :color="temas.forms_titulo_bg"
                            type="number"
                            v-model="editado.maxdiaschq"
                            label="Máximo de días de cheques en pagos"
                            required>
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </div>
                    <v-data-table
                      :headers="headersTarjetasCobros"
                      :items="tarjetasCobros"
                      dense
                      class="elevation-3 pt-3">
                      <template v-slot:top>
                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">

                          <v-dialog v-model="dialogTarjetaCobro" max-width="700px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="nuevoTarjetaCobro">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                              <v-toolbar-title class="white--text pl-4">
                                Tarjetas para Cobros
                              </v-toolbar-title>
                            </template>
                            <v-card tile class="fg">
                              <v-toolbar flat
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true">
                                <v-btn
                                  icon @click="cancelarTarjetaCobro"
                                  :color="temas.forms_close_bg"
                                  :dark="temas.forms_close_dark==true">
                                  <v-icon>mdi-arrow-left-circle</v-icon>
                                </v-btn>
                                <span class="text--right">
                                  {{ formTitleTarjetaCobro }}
                                </span>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="teal accent-4" class="ma-2 white--text"
                                  @click="guardarTarjetaCobro(editadoTarjetaCobro)">
                                  Guardar
                                </v-btn>
                              </v-toolbar>

                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12" class="pt-0">
                                      <v-select
                                        label="Tarjeta"
                                        v-model="editadoTarjetaCobro.tarjeta_id"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="tarjetas"
                                        item-value="id"
                                        item-text="nombre"
                                        autocomplete
                                        return-object>
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12" class="pt-0">
                                      <v-select
                                        label="Cuenta"
                                        v-model="editadoTarjetaCobro.cuenta_id"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="cueItems"
                                        item-value="id"
                                        :item-text="cueItems=>
                                          `
                                          ${cueItems.banco.nombre} -Cuenta:
                                          ${cueItems.cuenta} -
                                          ${cueItems.nombre}
                                          `"
                                        autocomplete
                                        return-object>
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-switch
                                        label="Débito"
                                        v-model="editadoTarjetaCobro.debito"
                                        :color="temas.forms_titulo_bg"
                                        @click="setDebitoCredito()">
                                      </v-switch>
                                    </v-col>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-text-field
                                        label="Cuotas"
                                        type="number"
                                        v-model="editadoTarjetaCobro.cuotas"
                                        :disabled="editadoTarjetaCobro.debito"
                                        :color="temas.forms_titulo_bg">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-text-field
                                        label="% de Interés"
                                        v-model="editadoTarjetaCobro.interes"
                                        :disabled="editadoTarjetaCobro.debito"
                                        :color="temas.forms_titulo_bg">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-text-field
                                        label="% de Recargo"
                                        v-model="editadoTarjetaCobro.recargo"
                                        :disabled="!editadoTarjetaCobro.debito"
                                        :color="temas.forms_titulo_bg">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                            </v-card>
                          </v-dialog>
                        </v-toolbar>
                      </template>
                      <template v-slot:item.activo="{ item }">
                        <v-chip
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.debito="{ item }">
                        <v-chip
                          :color="getColor(item.debito)" dark>{{item.debito?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.interes="{ item }">
                          %{{ formatoImporte(item.interes) }}
                      </template>
                      <template v-slot:item.recargo="{ item }">
                          %{{ formatoImporte(item.recargo) }}
                      </template>
                      <template v-slot:item.accion="{item}">
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_editar_bg"
                          :dark="temas.forms_btn_editar_dark==true"
                          @click="editarTarjetaCobro(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_activar_bg"
                          :dark="temas.forms_btn_activar_dark==true"
                          @click="activarDesactivarTarjetaCobro(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                  <!--
                    TAB PASSWORD
                  -->
                  <v-tab-item value="password">
                    <v-row class="pt-3">
                      <v-col cols="3" sm="3">
                        <v-btn
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text" @click="cambiarPassword">
                          Cambiar Contraseña
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-dialog v-model="dialogPassword" max-width="400px">
                        <v-card class="fg">
                          <v-toolbar flat
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true">
                            <v-btn
                              icon @click="dialogPassword=false"
                              :color="temas.forms_close_bg"
                              :dark="temas.forms_close_dark==true">
                              <v-icon>mdi-arrow-left-circle</v-icon>
                            </v-btn>
                            <span class="text--right">
                              Cambiar Contraseña
                            </span>
                            <v-spacer></v-spacer>
                            <v-btn v-if="datosParaCambiarContraseniaOk()"
                              color="teal accent-4" class="ma-2 white--text"
                              @click="confirmarCambiarPassword">
                              Confirmar
                            </v-btn>
                          </v-toolbar>
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12" md="12" class="pt-6">
                                  <v-text-field
                                    :append-icon="show1 ? 'visibility' : 'visibility_off'"
                                    v-model="ope.password0"
                                    autofocus
                                    label="Contraseña Anterior"
                                    hint="Hasta 15 caracteres"
                                    counter
                                    required
                                    :type="show1 ? 'text' : 'password'"
                                    @click:append="show1 = !show1"
                                    :maxlength="15">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <v-text-field
                                    :append-icon="show2 ? 'visibility' : 'visibility_off'"
                                    v-model="ope.password1"
                                    label="Nueva Contraseña"
                                    hint="Hasta 15 caracteres"
                                    counter
                                    required
                                    :type="show2 ? 'text' : 'password'"
                                    @click:append="show2 = !show2"
                                    :maxlength="15">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <v-text-field
                                    :append-icon="show3 ? 'visibility' : 'visibility_off'"
                                    v-model="ope.password2"
                                    label="De nuevo la nueva contraseña para verfificar"
                                    hint="Hasta 15 caracteres"
                                    counter
                                    required
                                    :type="show3 ? 'text' : 'password'"
                                    @click:append="show3 = !show3"
                                    :maxlength="15">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-row>
                  </v-tab-item>
                  <!--
                    TAB COMPROBANTES
                  -->
                  <v-tab-item value="cprs">
                    <v-container fluid>
                      <v-row justify="start">
                        <v-col v-for="(cd, i) in cprsDefs" v-bind:key="i" cols="6">
                          <v-card
                            tile outlined
                            class="fg pt-0 pb-0">
                            <v-card-title class="pt-1 pb-0">
                              {{ cd.nombre }}
                            </v-card-title>
                            <v-card-text>
                              <v-container>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12" class="pl-0 pr-0">
                                    <v-textarea
                                      v-model="cd.mje"
                                      outlined
                                      label="Texto al pie del comprobante">
                                    </v-textarea>
                                  </v-col>
                                </v-row>
                                <v-row class="pt-0">
                                  <p><b>Textos especiales</b></p>
                                </v-row>
                                <v-row>
                                  <tbody>
                                    <tr v-for="(not, i2) in cd.notas" v-bind:key="i2"
                                      class="pt-0">
                                      <td class="pt-0">{{not.mje}}</td>
                                      <td>
                                        % {{ formatoImporte(not.pje) }}
                                      </td>
                                    </tr>
                                  </tbody>
                                </v-row>
                              </v-container>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-tab-item>
                  <!--
                    TAB IMPORTACIONES
                  -->
                  <v-tab-item value="importaciones">
                    <v-container fluid>
                      <v-row justify="start">
                        <v-data-table
                          :headers="headersJSONArt"
                          :items="JSONArt"
                          dense
                          class="elevation-3 pt-3">
                          <template v-slot:top>
                            <v-toolbar flat
                              :color="temas.forms_titulo_bg"
                              :dark="temas.forms_titulo_dark==true">
                              <v-dialog v-model="dialogJSONArt" max-width="800px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="nuevoJSONArt">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                  <v-toolbar-title class="pl-4">
                                    Importaciones
                                  </v-toolbar-title>
                                </template>
                                <v-card class="fg">
                                  <v-toolbar flat
                                    :color="temas.forms_titulo_bg"
                                    :dark="temas.forms_titulo_dark==true">
                                    <v-btn
                                      icon @click="cancelarJSONArt"
                                      :color="temas.forms_close_bg"
                                      :dark="temas.forms_close_dark==true">
                                      <v-icon>mdi-arrow-left-circle</v-icon>
                                    </v-btn>
                                    <span class="text--right">
                                      {{ formTitleJSONArt }}
                                    </span>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="teal accent-4" class="ma-2 white--text"
                                      @click="guardarJSONArt(JSONArt)">
                                      Guardar
                                    </v-btn>
                                  </v-toolbar>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.comienza"
                                            label="Fila en la que comienzan los datos"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.codigo"
                                            label="Columna en donde esta el código"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.nombre"
                                            label="Columna en donde esta el nombre"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.precio"
                                            label="Columna en donde esta el precio"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.tasaiva"
                                            label="Columna en donde esta la tasa de IVA"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.marca"
                                            label="Columna en donde esta la Marca"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <!--
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.grupo"
                                            label="Columna en donde esta el Grupo"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        -->
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.moneda"
                                            label="Columna en donde esta la Moneda"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-switch
                                            label="Precios con IVA"
                                            v-model="editadoJSONArt.coniva"
                                            :color="temas.forms_titulo_bg">
                                          </v-switch>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                            </v-toolbar>
                          </template>
                          <template v-slot:item.accion="{item}">
                            <v-btn
                              class="mr-2" fab x-small
                              :color="temas.forms_btn_editar_bg"
                              :dark="temas.forms_btn_editar_dark==true"
                              @click="editarJSONArt(item)">
                              <v-icon dark>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                        </v-data-table>
                      </v-row>
                    </v-container>
                  </v-tab-item>
                  <!--
                    TAB IMPUESTOS
                  -->
                  <v-tab-item value="impuestos">
                    <v-container fluid>
                      <v-row justify="start">
                        <v-col cols="6" sx="6" mx="6">
                          <v-switch
                            label="¿Eres Agente de Percepción de IVA? (RG 3337)
                            Se incluirá el item en cada facturas que realices"
                            v-model="editado.haceperiva"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2">
                          <v-text-field
                            v-model="editado.porperiva"
                            :color="temas.forms_titulo_bg"
                            :enabled="editado.haceperiva"
                            label="% de Per.IVA">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row justify="start">
                        <v-col cols="6" sx="6" mx="6">
                          <v-switch
                            label="¿Eres Agente de Percepción de IIBB?
                            Se incluirá el item en cada facturas que realices"
                            v-model="editado.haceperiibb"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2">
                          <v-text-field
                            v-model="editado.nroiibb"
                            :color="temas.forms_titulo_bg"
                            :enabled="editado.haceperiva"
                            label="Nr.Ag.Ret.IIBB">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-select
                            label="Cód.Actividad"
                            v-model="editado.codactiibb_id"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            :items="ibItems"
                            item-value="id"
                            item-text="nombre">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row justify="start">
                        <v-col cols="6" sx="6" mx="6">
                          <v-switch
                            label="¿Eres Agente de Retencion de Ganancias?
                            Se incluirá el item en cada pago que realices"
                            v-model="editado.esageretgan"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-tab-item>
                </v-tabs>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
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
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import router from '../router';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue"
import moment from 'moment';

// import Register from ' ./views/Register';

export default {
  components: {
    SBar,
    Confirmacion,
  },

  data: () => ({
    show1: false, // ver pass orig
    show2: false, // ver pass nue
    show3: false, // ver pass nue verificacion
    accesoCEO: false,
    dialogPassword: false,
    cttArticulosAnclados: 0,
    searchRub: '',
    rubDisp: [],
    selected: [],
    eltema: '',
    lostemas: ['Normal','Noche','Dia','Primavera','Verano','Otoño','Invierno','Pastel','Nieve'],
    usernameRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],      
    emailRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],      
    email: 
      value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
    
    footerProps15: {'items-per-page-options': [15]},
    comprobantes: [],
    cueItems: [],
    ibItems: [],
    medItems: [],
    ganItems: [],
    tarjetas: [],
    bancos: [],
    rubItems: [],
    tarjetasCobros: [],
    rubValue: [],
    rubObj: [],
    ope: {
      password0: '',
      password1: '',
      password2: '',
    },
    suc: [],
    dep: [],
    usr: [],
    vin: [],
    cprs: [],
    cprsError: false,
    seleccionaPorcentaje: false,
    cprsDefs: [
      {id: 'FAC', nombre: 'Facturas',     mje: '', notas: []},
      {id: 'NDD', nombre: 'N.de Debito',  mje: '', notas: []},
      {id: 'NDC', nombre: 'N.de Crédito', mje: '', notas: []},
      {id: 'REM', nombre: 'Remitos',      mje: '', notas: []},
      {id: 'PRE', nombre: 'Presupuestos', mje: '', notas: []},
      {id: 'PED', nombre: 'Pedidos',      mje: '', notas: []},
      {id: 'PAG', nombre: 'Pagos',        mje: '', notas: []},
      {id: 'REC', nombre: 'Recibos',      mje: '', notas: []}],
    cprsDef: [
      {id: 'FAC', nombre: 'FACTURAS'},
      {id: 'NDD', nombre: 'NOTAS DE DEBITO'},
      {id: 'NDC', nombre: 'NOTAS DE CREDITO'},
      {id: 'REM', nombre: 'REMITOS'},
      {id: 'PRE', nombre: 'PRESUPUESTOS'},
      {id: 'PED', nombre: 'PEDIDOS'},
      {id: 'PAG', nombre: 'PAGOS'},
      {id: 'REC', nombre: 'RECIBOS'}],
    registros: 0,
    tipLicencia: [
      {id:'CO', nombre:'ERP completo'},
      {id:'BA', nombre:'ERP basico'},
      {id:'PP', nombre:'Precios y Pedidos'},
      {id:'TI', nombre:'Tienda'}
    ],
    niveles: [
      {level: 2, nombre: 'Administrativo'},
      {level: 3, nombre: 'Vendedor'},
      ],
    headersUsr: [
      { text: 'NOMBRE', value:'username'},
      { text: 'MAIL', value: 'email'},
      { text: 'NIVEL', value: 'level'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersTarjetasCobros: [
      { text: 'Tarjeta', value:'tarjetanombre'},
      { text: 'Banco', value:'banconombre'},
      { text: 'Débito', value:'debito'},
      { text: 'Cuotas', value:'cuotas'},
      { text: '%Interés', value:'interes'},
      { text: '%Recargo', value:'recargo'},
      { text: 'Activo', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersSuc: [
      { text: 'NOMBRE', value:'nombre'},
      { text: 'ABREV', value:'abreviado'},
      { text: 'SUC.', value:'fiscal'},
      { text: 'MANUAL', value:'manual'},
      { text: 'ELECTRONICA', value:'electronica'},
      { text: 'DEMO', value:'sucursaldemo'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersDep: [
      { text: 'NOMBRE', value:'nombre'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersCprs: [
      { text: 'ID',          value:'id',         align: 'end',  width: 75},
      { text: 'Comprobante', value:'cpr',        align: 'left', width: 125},
      { text: 'Tipo',        value:'tipoNombre', align: 'left', width: 255},
      { text: 'Observ',      value:'observ',     align: 'left', width: 275},
      { text: '%',           value:'porcentaje', align: 'end',  width: 75},
      { text: 'ACTIVO',      value:'activo'},
      { text: 'ACCIONES',    value:'accion',     sortable: false },
    ],
    headersJSONArt: [
      { text: 'Comienza', value:'comienza', align: 'end',  width: 105},
      { text: 'Codigo',   value:'codigo',   align: 'left', width: 105},
      { text: 'Nombre',   value:'nombre',   align: 'left', width: 105},
      { text: 'Precio',   value:'precio',   align: 'left', width: 105},
      { text: 'TasaIva',  value:'tasaiva',  align: 'left', width: 105},
      { text: 'Marca',    value:'marca',    align: 'left', width: 105},
//    { text: 'Grupo',    value:'grupo',    align: 'left', width: 105},
      { text: 'Moneda',   value:'moneda',   align: 'left', width: 105},
      { text: 'C/IVA',    value:'coniva',   align: 'left', width: 105},
      { text: 'ACCIONES', value:'accion',   sortable: false },
    ],

    timeoutRefreshList: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nuevoCRT: [],
    nuevoKEY: [],
    editedIndexUsr: -1,
    editedIndexTarjetaCobro: -1,
    editedIndexSuc: -1,
    editedIndexDep: -1,
    editedIndexVin: -1,
    editedIndexCpr: -1,
    editedIndexJSONArt: -1,
    loading: false,
    searchTerceros: '',     // para el cuadro de búsqueda de datatables
    dialog: true,
    dialogUsr: false,
    dialogTarjetaCobro: false,
    dialogSuc: false,
    dialogDep: false,
    dialogCue: false,
    dialogCpr: false,
    dialogJSONArt: false,
    dialogAnclarUsd: false,
    dialogPreciosSugeridos: false,
    dialogCostosBonificados: false,
    dialogSoloArtConPrecios: false,
    dialogActCertificado: false,
    editedIndex: -1,
    editado: {
      id: null,
      username: null,
      email: null,
      tercero_id: null,
      tipo: null,
      porrem: null,
      prefijo: null,
      cttloadreg: null,
      avatar: [],
      timeout_refresh: null,
      preciosconiva: false,
      aplicarBonifDeProvEnVtas: false,
      faeproduccion: null,
      faevencimiento: null,
      faearchivocrt: null,
      faearchivokey: null,
      observ: null,
      maxdiaschq: null,
      invisible: 0,
      soloartcomprados: 0,
      anclarcostos: 0,
      desanclarautomaticamente: 0,
      haceperiva: null,
      porperiva: null,
      haceperiibb: null,
      codactiibb_id: null,
      nroiibb: null,
      esageretgan: null,
      conceptogan_id: null,
      turnos: null,
      turnoslv: '',
      turnossd: '',
      porrev1: '',
      porrev2: '',
      porrev3: '',
      comoinfstock: 'U',
      codigooid: 'C',
      comprobantesm: false,
      administragohu: false,
      usamaletines: false,
    },
    editadoUsr: {
      id: null,
      activo: null,
      username: null,
      password: null,
      email: null,
      level: null,
      user_id: null
    },
    defaultItemUsr: {
      id: null,
      activo: null,
      username: null,
      password: null,
      email: null,
      level: null,
      user_id: null
    },
    editadoTarjetaCobro: {
      activo: 1,
      cuenta_id: null,
      cuotas: 0,
      debito: 0,
      id: 0,
      interes: 0,
      recargo: 0,
      tarjeta_id: null,
      banconombre: null,
      tarjetanombre: null,
      user_id: 0,
    },
    defaultItemTarjetaCobro: {
      activo: 1,
      cuenta_id: null,
      cuotas: 0,
      debito: 0,
      id: 0,
      interes: 0,
      recargo: 0,
      tarjeta_id: null,
      tarjetanombre: null,
      user_id: 0,
    },
    logotipo1: [],
    logotipo2: [],
    turnosHorasLV: [],
    turnosHorasSD: [],
    editadoSuc: {
      abreviado: null,
      color: null,
      electronica: null,
      fiscal: null,
      manual: null,
      iniactividad: null,
      nombre: null,
      sucursaldemo: null,
      user_id: null,
      activo: null,
      depositos: [],
      logotipo: ['Sin Imagen.jpg'],
      tema: '',
    },
    defaultItemSuc: {
      abreviado: null,
      color: null,
      electronica: null,
      fiscal: null,
      manual: null,
      iniactividad: null,
      nombre: null,
      sucursaldemo: null,
      user_id: null,
      activo: null,
      depositos: [],
      logotipo: 'Sin Imagen.jpg',
      tema: '',
    },
    editadoDep: {
      nombre: null,
      activo: null,
    },
    defaultItemDep: {
      nombre: null,
      activo: null,
    },
    editadoCpr: {
      id: null,
      user_id: null,
      cpr: null,
      tipo: null,
      observ: null,
      porcentaje: null,
      activo: null,
    },
    defaultItemTip: {
      id: null,
      user_id: null,
      cpr: null,
      tipo: null,
      observ: null,
      porcentaje: null,
    },
    activo: null,
    editadoJSONArt: { comienza:1, codigo:'A', nombre:'B', precio:'C', tasaiva:'D', marca:'E', moneda:'G', coniva:0 },
    defaultJSONArt: { comienza:1, codigo:'A', nombre:'B', precio:'C', tasaiva:'D', marca:'E', moneda:'G', coniva:0 },
    JSONArt: [],
    descriptionLimit: 60,
    entriesTerceros: [],
    isLoadingTerceros: false,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
      'authentication',
      'sucursal',
      'sucursales',
      'sucursalFiscal',
      'sucursalManual',
      'exclusivoDe',
      'temas',
      'notificaciones',
      'caja',
      'vinculosPadres', 
      'vinculosHijos',
      'tipo',
      'externo',
      'empresa',
      'datosEmpresa',
      'operario',
      'operarioTerceroId',
      'operarioUserId',
      'operarioEsVendedor',
      'tercero',
      'level',
      'porRem',
      'timeoutRefresh'
    ]),    

    formTitle () {
      return 'Mi Perfil';
    },
    formTitleUsr () {
      return this.editedIndexUsr === -1 ? 'Nuevo Usuario' : 'Editar Usuario';
    },
    formTitleCpr () {
      return this.editedIndexCpr === -1 ? 'Nuevo Mensaje en Comprobante' : 'Editar Mensaje en Comprobante';
    },
    formTitleTarjetaCobro () {
      return this.editedIndexTarjetaCobro === -1 ? 'Nueva Tarjeta para Cobros' : 'Editar Tarjeta para Cobros';
    },
    formTitleSuc () {
      return this.editedIndexSuc === -1 ? 'Nueva Sucursal' : 'Editar Sucursal';
    },
    formTitleDep () {
      return this.editedIndexDep === -1 ? 'Nuevo Depósito' : 'Editar Depósito';
    },
    formTitleJSONArt () {
      return this.editedIndexJSONArt === -1 ? 'Nueva Fila' : 'Editar Fila';
    },
    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },    
  },

  watch: {
    searchTerceros (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      // Lazily load input items
      return HTTP().get('/terceros')
        .then(({ data }) => {
          this.entriesTerceros = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (
          this.isLoadingTerceros = false
        ))
    },

  },
    
  mounted() {

    debugger
    let a1 = this.operario;
    let a2 = this.operarioTerceroId;
    let a3 = this.operarioUserId;
    let a4 = this.operarioEsVendedor;
    let a5 = this.level;

    if (!this.isLoggedIn) {
      return router.push('/login');
    }

    this.accesoCEO = this.$store.state.level<3,
    this.dialog = true;  
    this.timeoutRefreshList = []
    for (let i=120; i<=360; i++) {
      this.timeoutRefreshList.push(i)
    }
    if (!this.accesoCEO) {
      return HTTP().get('/user/'+this.operarioUserId).then(({ data }) => {
        this.editado   = data[0]
        this.logotipo1.name = data[0].avatar
      })

    } else {
      
      debugger
      return HTTP().get('/user/'+this.userId).then(({ data }) => {

        debugger

        this.editado = data[0]
        this.editado.turnoslv = this.editado.turnoslv ? this.editado.turnoslv.split('-') : ''
        this.editado.turnossd = this.editado.turnossd ? this.editado.turnossd.split('-') : ''
        this.logotipo1.name = data[0].avatar
        this.logotipo2.name = data[0].logotipo
        this.value = []
        this.usr = data[0].users
        this.suc = data[0].sucursales
        this.cprs = data[0].cprs

        for (let i=0; i<=data[0].cprs.length-1; i++) {
          let pos = this.cprsDefs.findIndex(x=>x.id == data[0].cprs[i].cpr)
          if (data[0].cprs[i].tipo=='M') {
            this.cprsDefs[pos].mje = data[0].cprs[i].observ
          } else {
            this.cprsDefs[pos].notas.push({
              id: data[0].cprs[i].id, 
              mje: data[0].cprs[i].observ, 
              pje: data[0].cprs[i].porcentaje
            })
          }
        }

        for (let i=0; i<= this.cprs.length-1; i++) {
          if (this.cprs[i].tipo == 'D') {
            this.cprs[i].tipoNombre = 'Mensaje sobre Descuentos'
          } else if (this.cprs[i].tipo == 'M') {
            this.cprs[i].tipoNombre = 'Mensaje al pie del comprobante'
          }
        }

        this.rubValue = []
        data[0].usersrubros.forEach(element => {
          this.rubValue.push(element.rubro.nombre)
        });

        this.vin       = data[0].vinculos
        for (let i=0; i<= this.vin.length-1; i++) {
          this.vin[i].estabaVinculado = this.vin[i].vinculado
        }

        this.editado.faevencimiento = this.editado.faevencimiento==null?
          moment('2099-12-31').format('YYYY-MM-DD'):
          moment(this.editado.faevencimiento).format('YYYY-MM-DD')
        this.editado.faearchivocrt = this.userId+'.crt'
        this.editado.faearchivokey = this.userId+'.key'
        this.editado.faeproduccion = this.editado.faeproduccion==1 ? 'P' : 'H'

        for (let i=0; i<= this.vin.length-1; i++) {
          //this.vin[i].vinculadooriginal = this.vin[i].vinculado
          this.vin[i].registros = 0
        }

        let desde = 0
        if (this.vin.length>0) {
          desde = this.vin[0].user_id_desde
        }

        return HTTP().post(`articulosavincular`, { usrdes: desde, usrhas: null, }).then ((res) => {
          this.registros = res.data.cttreg

          return HTTP().get('/rubrosall').then(({ data }) => {
            this.rubItems = [];
            this.rubObj = [];
            data.forEach(element => {
              this.rubItems.push(element.nombre)
              this.rubObj.push(element)
            })

            return HTTP().get('/mediosdepagosmenosctacte').then(({ data }) => {
              this.medItems = []
              data.forEach(e => {
                this.medItems.push({id: e.id, nombre: e.nombre})
              })
              return HTTP().get('/tarjetascobros').then(({ data }) => {
                this.tarjetasCobros = []
                for (let i=0; i<=data.length-1; i++) {
                  this.tarjetasCobros.push(data[i])
                }
                return HTTP().get('/tarjetas').then(({ data }) => {
                  this.tarjetas = []
                  for (let i=0; i<=data.length-1; i++) {
                    this.tarjetas.push(data[i])
                  }
                  return HTTP().get('/bancos').then(({ data }) => {
                    this.bancos = []
                    for (let i=0; i<=data.length-1; i++) {
                      this.bancos.push(data[i])
                    }
                    return HTTP().get('/tercerocuentas/'+this.$store.state.tercero).then(({ data }) => {
                      for (let i=0; i<=data[0].cuentas.length-1; i++) {
                        this.cueItems.push(data[0].cuentas[i])
                      }
                      return HTTP().get('/codactiibb').then(({data}) => {
                        this.ibItems = []
                        for (let i=0; i<=data.length-1; i++) {
                          this.ibItems.push({id: data[i].id, nombre: data[i].nombre})
                        }
                        return HTTP().get('/afipcomprobantes/').then(({ data }) => {
                          for (let i=0; i<=data.length-1; i++) {
                            this.comprobantes.push({id: data[i].id, nombre: data[i].nombre})
                          }
                          return HTTP().get('/configarticulosexcel/').then(({ data }) => {
                            this.JSONArt = []
                            for (let i=0; i<=data.length-1; i++) {
                              this.JSONArt.push({
                                comienza: data[i].comienza,
                                codigo: data[i].codigo,
                                nombre: data[i].nombre,
                                precio: data[i].precio,
                                tasaiva: data[i].tasaiva,
                                marca: data[i].marca,
                                grupo: data[i].grupo,
                                moneda: data[i].moneda,
                                coniva: data[i].coniva
                              })
                            }
                            return HTTP().post('/articulosanclados').then(({ data }) => {
                              this.cttArticulosAnclados = data[0].anclados
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    }
  },

  methods: {
    ...mapActions('authentication', ['logout']),
    ...mapMutations([
      'setSucursal',
      'setSucursales',
      'setSucursalManual',
      'setNotificaciones',
      'setCaja',
      'setVinculasPadres',
      'setVinculasHijos',
      'setEmpresa',
      'setOperario',
      'setLevel',
      'setPorRem',
      'setTimeoutRefresh',
      'setProveedor',
      'setProveedores',
    ]),
    
    closeForm() {
      this.dialog = false;
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },

    datosParaCambiarContraseniaOk() {
      let resp = true
      debugger
      if (this.ope.password==''||this.ope.passowrd1==''||this.ope.password2=='') {
        resp = false
      }
      if (this.$store.state.authentication.loginPassword!=this.ope.password0) {
        //this.mensaje('¡Opss, esta contraseña no es la actual!', this.temas.snack_error_bg, 2500) 
        resp = false
      }
      if (this.ope.password1!=this.ope.password2) {
        //this.mensaje('¡Opss, la nueva contraseña no valida y la repetición no son iguales!', this.temas.snack_error_bg, 2500) 
        resp = false
      }
      return resp
    },

    avatarClick(cual) {
      if (cual==1) {
        //this.logotipo1.name = this.logotipo1.name
      } else if (cual==2) {
        //this.logotipo2.name = this.logotipo2.name
      }
    },

    uploadCrtAndKey() {
      let formData = new FormData();
      formData.append('filecrt', this.nuevoCRT );
      formData.append('filekey', this.nuevoKEY );
      return HTTP().post('/descargarcrtykey', formData).then(({ data }) => { 
        debugger
        this.progress = false
        let m = ''
        if (data=='error') {
          this.msg.msgTitle = 'Error'
          m = 'Se ha producido un error al intentar enviar los archivos al Servidor.'
        } else {
          this.msg.msgTitle = 'PERFECTO'
          m = 'Los archivos se han enviado correctamente al Servidor.'
          this.editado.faevencimiento = moment().add({years:2}).format('YYYY-MM-DD')
        }
        this.dialogActCertificado = false
        // huguito
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'aceptar'
        this.msg.msgButtons = ['Aceptar']
      })

    },

    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },

    cttRegLoad () {
      if (this.editado.cttloadreg<10||this.editado.cttloadreg>300) {
        this.editado.cttloadreg = 300
      }
    },

    porRev(cual) {
      if (cual=='1') {
        if (this.editado.porrev1<0||this.editado.porrev1>=500) {
          this.editado.porrev1 = 30
        }
      } else if (cual=='2') {
        if (this.editado.porrev2<0||this.editado.porrev2>=500) {
          this.editado.porrev2 = 40
        }
      } else if (cual=='3') {
        if (this.editado.porrev3<0||this.editado.porrev3>=500) {
          this.editado.porrev3 = 50
        }
      }
    },

    cancelarUsr() {
      this.dialogUsr = false;
      this.editadoUsr = Object.assign({}, this.defaultItemUsr);
      this.editedIndexUsr = -1;
    },

    cancelarCpr() {
      this.dialogCpr = false;
      this.editadoCpr = Object.assign({}, this.defaultItemCpr);
      this.editedIndexCpr = -1;
    },

    cancelarJSONArt() {
      this.dialogJSONArt = false;
      this.editadoJSONArt = Object.assign({}, this.defaultJSONArt);
      this.editedIndexJSONArt = -1;
    },

    cancelarTarjetaCobro() {
      this.dialogTarjetaCobro = false;
      this.editadoTarjetaCobro = Object.assign({}, this.defaultItemTarjetaCobro);
      this.editedIndexTarjetaCobro = -1;
    },

    cambiarPassword() {
      this.dialogPassword = true
    },

    confirmarCambiarPassword() {
      this.dialogPassword = false
      return HTTP().post(`auth/changepassword`, {
        oldpwd: this.ope.password0,
        newpwd: this.ope.password1,
        uid: this.userId
      }).then((data) => {
        if (data.data==false) {
          this.mensaje('¡Opss, se ha producido un error al intentar cambiar la contraseña', this.temas.snack_error_bg, 2500) 
        } else {
          this.mensaje('¡Contraseña actualizada con exito!', this.temas.forms_titulo_bg, 1500) 
        }
      })
    },

    cancelarCue() {
      this.dialogCue = false;
    },

    cancelarSuc() {
      this.dialogSuc = false;
      this.editadoSuc = Object.assign({}, this.defaultItemSuc);
      this.editedIndexSuc = -1;
    },

    cancelarDep() {
      this.dialogDep = false;
      this.editadoDep = Object.assign({}, this.defaultItemDep);
      this.editedIndexDep = -1;
    },

    guardar() {
      this.editado.suc = this.suc;
      this.editado.users = this.usr;
      this.editado.vin = this.vin;
      this.editado.tarjetasCobros = this.tarjetasCobros;
      this.editado.json = this.JSONArt;
      let aux = [];
      for(let i=0; i<=this.rubValue.length-1; i++ ) {
        for(let j=0; j<=this.rubObj.length-1; j++) {
          if(this.rubValue[i]===this.rubObj[j].nombre) {
            aux.push(this.rubObj[j])
            break
          }
        }
      }
      this.editado.rubros = aux;
      this.editarHTTP(this.editado);
      this.dialog = false;
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },

    editarHTTP:function(data) {
      for (let i=0; i<=data.suc.length-1; i++) {
        if (data.suc[i].id == this.sucursal) {
          this.$store.commit('setTemas', data.suc[i].tema, { root: true })
          break
        }
      }
      debugger
      let porRev = []
      porRev.push(data.porrev1)
      porRev.push(data.porrev2)
      porRev.push(data.porrev3)
      this.$store.commit('setTimeoutRefresh',           data.timeout_refresh, { root: true })
      this.$store.commit('setSucursales',               data.suc, { root: true })
      this.$store.commit('setTipo',                     data.tipo, { root: true })
      this.$store.commit('setPublicarPreciosConIVA',    data.preciosconiva, { root: true })
      this.$store.commit('setAvatar',                   this.logotipo1.name, { root: true })
      this.$store.commit('setAnclarCostos',             data.anclarcostos, { root: true })
      this.$store.commit('setDesanclarAutomaticamente', data.desanclarautomaticamente, { root: true })
      this.$store.commit('setTurnos',                   data.turnos, { root: true })
      this.$store.commit('setTurnoslv',                 data.turnoslv, { root: true })
      this.$store.commit('setTurnossd',                 data.turnossd, { root: true })
      this.$store.commit('setSoloArtComprados',         data.soloartcomprados, { root: true })
      this.$store.commit('setCodigoOID',                data.codigooid, { root: true })
      this.$store.commit('setPorRev',                   porRev, { root: true })
      debugger
      this.$store.commit('setCttLoadReg',               data.cttloadreg, { root: true })
      let profile = data
      profile.avatar   = this.logotipo1.name
      profile.logotipo = this.logotipo2.name
      debugger
      if (!this.accesoCEO) {
        return HTTP().patch(`user/${profile.id}`, {profile: profile, operarioEsVendedor: true}).then((data) => {
          debugger
          if (data==false) {
            this.mensaje('¡Opss, se ha producido un error al intentar actualizar su perfil', this.temas.snack_error_bg, 2500) 
          } else {
            this.mensaje('¡Perfil actualizado con éxito!', this.temas.forms_titulo_bg, 1500) 
          }
          this.dialog = false;
        })
      } else {
        return HTTP().patch(`user/${profile.id}`, {profile: profile, operarioEsVendedor: false}).then((data) => {
          debugger
          if (data.data==false) {
            this.mensaje('¡Opss, se ha producido un error al intentar actualizar su perfil', this.temas.snack_error_bg, 2500) 
          } else {
            this.mensaje('¡Perfil actualizado con éxito!', this.temas.forms_titulo_bg, 1500) 
          }
        })
      }
    },

    editarUsr (item) {
      this.editadoUsr = Object.assign({}, item);
      this.editedIndexUsr = this.usr.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogUsr = true;
    },

    editarCpr (item) {
      this.editadoCpr = Object.assign({}, item);
      this.editedIndexCpr = this.cprs.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogCpr = true;
    },

    editarJSONArt (item) {
      this.editadoJSONArt = Object.assign({}, item);
      this.editedIndexJSONArt = this.JSONArt.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogJSONArt = true;
    },

    editarTarjetaCobro (item) {
      this.editadoTarjetaCobro = Object.assign([], item);
      this.editedIndexTarjetaCobro = this.tarjetasCobros.indexOf(item);
      this.dialogTarjetaCobro = true;
    },

    editarSuc (item) {
      // ACA DEBO CARGAR EL ARREGLO DEP QUE ESTA DENTRO DE SUCURSALES.
      this.editadoSuc = Object.assign({}, item);
      this.dep = this.editadoSuc.depositos;
      this.editedIndexSuc = this.suc.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogSuc = true;
    },

    activarDesactivarSuc(item) {
      item.activo = item.activo ? 0 : 1;
    },

    activarDesactivarUsr(item) {
      item.activo = item.activo ? 0 : 1;
    },

    activarDesactivarTarjetaCobro(item) {
      item.activo = item.activo ? 0 : 1;
    },

    activarDesactivarTip(item) {
      item.activo = item.activo ? 0 : 1;
    },

    activarDesactivarDep(item) {
      item.activo = item.activo ? 0 : 1;
    },

    activarDesactivarVin(item) {
      item.vinculado = item.vinculado ? 0 : 1
    },

    activarDesactivar(item) {
      item.activo = item.activo ? 0 : 1
    },

    editarDep (item) {
      this.editadoDep = Object.assign({}, item);
      this.editedIndexDep = this.dep.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogDep = true;
    },

    nuevoUsr() {
      this.dialogUsr = true;
      this.editadoUsr = Object.assign({}, this.defaultItemUsr);
    },

    nuevoTarjetaCobro() {
      this.dialogTarjetaCobro = true;
      this.editadoTarjetaCobro = Object.assign({}, this.defaultItemTarjetaCobro);
      this.editedIndexTarjetaCobro = -1;
    },

    nuevoUsuario() {
      this.dialogUsr = true;
      this.editadoUsr = Object.assign({}, this.defaultItemUsr);
    },

    nuevoCpr() {
      this.editadoCpr = Object.assign({}, this.defaultItemCpr);
      this.editadoCpr.tipo = 'D'
      this.dialogCpr = true;
      this.cprsError = true
      this.editedIndexCpr = -1
    },

    nuevoJSONArt() {
      this.editadoJSONArt = Object.assign({}, this.defaultJSONArt);
      this.dialogJSONArt = true;
      this.editedIndexJSONArt = -1
    },

    clickMensajeTipo() {
      this.seleccionaPorcentaje = false
      if (this.editadoCpr.tipo=='M') {
        this.editadoCpr.porcentaje = 0
      } else {
        this.seleccionaPorcentaje = true
      }
    },

    controloCprs() {
      let hayDupli = false
      for (let i=0; i<=this.cprs.length-1; i++) {
        let c = this.editadoCpr.cpr
        if (this.editadoCpr.tipo=='M') {
          let dupli = this.cprs.filter(function(e){
            return (e.tipo=='M' && e.cpr==c)
          })
          if (dupli.length>=1) {
            hayDupli = true
            break
          }
        }
      }
      this.cprsError = false
      if (hayDupli) {
        this.msg.msgTitle = '¡Error!'
        let m = 'Ya ha definido un mensaje de pie para este tipo de comprobante<br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'nada'
        this.msg.msgButtons = ['Aceptar']
        this.cprsError = true
      }
    },

    nuevaSucursal() {
      this.dialogSuc = true;
      this.editadoSuc = Object.assign({}, this.defaultItemSuc);
      this.dep = []
    },

    nuevoDeposito() {
      this.dialogDep = true;
      this.editadoDep = Object.assign({}, this.defaultItemDep);
    },

    guardarUsr(item) {
      if (this.editedIndexUsr > -1) { // esta modificando
        this.usr[this.editedIndexUsr].username = this.editadoUsr.username;
        this.usr[this.editedIndexUsr].password = this.editadoUsr.password;
        this.usr[this.editedIndexUsr].email = this.editadoUsr.email;
        this.usr[this.editedIndexUsr].activo = this.editadoUsr.activo;
        this.usr[this.editedIndexUsr].level = this.editadoUsr.level.level;
        this.usr[this.editedIndexUsr].user_id = this.userId;
      } else {
        this.usr.push({ 
          activo: 1,
          username: this.editadoUsr.username,
          password: this.editadoUsr.password,
          email: this.editadoUsr.email,
          activo: 1,
          level: this.editadoUsr.level,
          user_id: this.userId,
          id: 0
        })
      }
      this.dialogUsr = false;
    },

    guardarCpr(item) {
      if (this.editedIndexCpr > -1) { // esta modificando
        this.cprs[this.editedIndexCprs].id = this.editadoCpr.id
        this.cprs[this.editedIndexCprs].cpr = this.editadoCpr.cpr
        this.cprs[this.editedIndexCprs].tipo = this.editadoCpr.tipo
        this.cprs[this.editedIndexCprs].tipoNombre = this.editadoCpr.tipo=='M' ? 'Mensaje al pie del Comprobante' : 'Mensaje sobre Descuentos'
        this.cprs[this.editedIndexCprs].observ = this.editadoCpr.observ
        this.cprs[this.editedIndexCprs].porcentaje = this.editadoUsr.porcentaje
        this.cprs[this.editedIndexCprs].activo = this.activo
      } else {
        this.cprs.push({ 
          cpr: this.editadoCpr.cpr,
          tipo: this.editadoCpr.tipo,
          observ: this.editadoCpr.observ,
          tipoNombre: this.editadoCpr.tipo=='M' ? 'Mensaje al pie del Comprobante' : 'Mensaje sobre Descuentos',
          activo: 1,
          id: 0
        })
      }
      this.dialogCpr = false;
    },

    guardarJSONArt(item) {
      if (this.editedIndexJSONArt > -1) { // esta modificando
        this.JSONArt[this.editedIndexJSONArt].comienza = this.editadoJSONArt.comienza
        this.JSONArt[this.editedIndexJSONArt].codigo   = this.editadoJSONArt.codigo
        this.JSONArt[this.editedIndexJSONArt].nombre   = this.editadoJSONArt.nombre
        this.JSONArt[this.editedIndexJSONArt].precio   = this.editadoJSONArt.precio
        this.JSONArt[this.editedIndexJSONArt].tasaiva  = this.editadoJSONArt.tasaiva
        this.JSONArt[this.editedIndexJSONArt].marca    = this.editadoJSONArt.marca
        this.JSONArt[this.editedIndexJSONArt].grupo    = this.editadoJSONArt.grupo
        this.JSONArt[this.editedIndexJSONArt].moneda   = this.editadoJSONArt.moneda
        this.JSONArt[this.editedIndexJSONArt].coniva   = this.editadoJSONArt.coniva
      } else {
        this.JSONArt.push({ 
          comienza: this.editadoJSONArt.comienza,
          codigo:   this.editadoJSONArt.codigo,
          nombre:   this.editadoJSONArt.nombre,
          precio:   this.editadoJSONArt.precio,
          tasaiva:  this.editadoJSONArt.tasaiva,
          marca:    this.editadoJSONArt.marca,
          grupo:    this.editadoJSONArt.grupo,
          moneda:   this.editadoJSONArt.moneda,
          coniva:   this.editadoJSONArt.coniva,
        })
      }
      this.dialogJSONArt = false;
    },

    guardarTarjetaCobro(item) {
      debugger
      let postar = null
      let tarjetanombre = ''
      let banconombre = ''
      if (typeof this.editadoTarjetaCobro.tarjeta_id === 'object' && this.editadoTarjetaCobro.tarjeta_id != null) {
        this.editadoTarjetaCobro.tarjeta_id = this.editadoTarjetaCobro.tarjeta_id.id
      }
      if (typeof this.editadoTarjetaCobro.banco_id === 'object' && this.editadoTarjetaCobro.banco_id != null ) {
        this.editadoTarjetaCobro.banco_id = this.editadoTarjetaCobro.banco_id.id
      }
      if (typeof this.editadoTarjetaCobro.cuenta_id === 'object' && this.editadoTarjetaCobro.cuenta_id != null ) {
        this.editadoTarjetaCobro.cuenta_id = this.editadoTarjetaCobro.cuenta_id.id
        let pos = this.cueItems.findIndex(x=>x.id==this.editadoTarjetaCobro.cuenta_id)
        banconombre = this.cueItems[pos].banco.nombre
      }
      postar = this.tarjetas.findIndex(x=>x.id == this.editadoTarjetaCobro.tarjeta_id)
      if (postar!=-1) {
        tarjetanombre = this.tarjetas[postar].nombre
      }
      if (this.editedIndexTarjetaCobro > -1) { // esta modificando
        this.tarjetasCobros[this.editedIndexTarjetaCobro].activo        = this.editadoTarjetaCobro.activo;
        this.tarjetasCobros[this.editedIndexTarjetaCobro].banconombre   = banconombre;
        this.tarjetasCobros[this.editedIndexTarjetaCobro].cuenta_id     = this.editadoTarjetaCobro.cuenta_id;
        this.tarjetasCobros[this.editedIndexTarjetaCobro].cuotas        = this.editadoTarjetaCobro.cuotas;
        this.tarjetasCobros[this.editedIndexTarjetaCobro].debito        = this.editadoTarjetaCobro.debito
        this.tarjetasCobros[this.editedIndexTarjetaCobro].id            = this.editadoTarjetaCobro.id
        this.tarjetasCobros[this.editedIndexTarjetaCobro].interes       = this.editadoTarjetaCobro.interes;
        this.tarjetasCobros[this.editedIndexTarjetaCobro].recargo       = this.editadoTarjetaCobro.recargo;
        this.tarjetasCobros[this.editedIndexTarjetaCobro].user_id       = this.editadoTarjetaCobro.user_id;
        this.tarjetasCobros[this.editedIndexTarjetaCobro].tarjeta_id    = this.editadoTarjetaCobro.tarjeta_id;
        this.tarjetasCobros[this.editedIndexTarjetaCobro].tarjetanombre = tarjetanombre
      } else {
        this.tarjetasCobros.push({ 
          activo: Number(this.editadoTarjetaCobro.activo),
          banconombre: banconombre,
          cuenta_id: Number(this.editadoTarjetaCobro.cuenta_id),
          cuotas: Number(this.editadoTarjetaCobro.cuotas),
          debito: Number(this.editadoTarjetaCobro.debito),
          id: 0,
          interes: Number(this.editadoTarjetaCobro.interes),
          recargo: Number(this.editadoTarjetaCobro.recargo),
          user_id: this.userId,
          tarjeta_id: this.editadoTarjetaCobro.tarjeta_id,
          tarjetanombre: tarjetanombre,
        })
      }
      this.dialogTarjetaCobro = false;
    },

    guardarSuc(item) {
      if (this.editedIndexSuc > -1) { // esta modificando
        this.suc[this.editedIndexSuc].nombre       = this.editadoSuc.nombre;
        this.suc[this.editedIndexSuc].color        = this.editadoSuc.color;
        this.suc[this.editedIndexSuc].abreviado    = this.editadoSuc.abreviado;
        this.suc[this.editedIndexSuc].fiscal       = this.editadoSuc.fiscal;
        this.suc[this.editedIndexSuc].manual       = this.editadoSuc.manual;
        this.suc[this.editedIndexSuc].electronica  = this.editadoSuc.electronica
        this.suc[this.editedIndexSuc].sucursaldemo = this.editadoSuc.sucursaldemo
        this.suc[this.editedIndexSuc].tema         = this.editadoSuc.tema
      } else {
        this.suc.push({ 
          activo:       1,
          abreviado:    this.editadoSuc.abreviado,
          color:        null, //this.editadoSuc.color.hexa,
          depositos:    this.dep,
          electronica:  this.editadoSuc.electronica,
          fiscal:       this.editadoSuc.fiscal,
          manual:       this.editadoSuc.manual,
          id:           0,
          nombre:       this.editadoSuc.nombre,
          sucursaldemo: this.editadoSuc.sucursaldemo,
          user_id:      this.userId,
          logotipo:     this.logotipo2.name ? this.logotipo2.name : this.logotipo2,
          tema:         this.editadoSuc.tema
        })
      }
      this.dialogSuc = false;
    },

    guardarDep(item) {
      if (this.editedIndexDep > -1) { // esta modificando
        this.editadoSuc.depositos[this.editedIndexDep].nombre = this.editadoDep.nombre;
      } else {
        this.dep.push({
          activo: 1,
          id: 0,
          nombre: this.editadoDep.nombre,
          sucursal_id: this.editadoSuc.id
        })
      }
      this.dialogDep = false;
    },

    preguntoBorrarUsr (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.editedIndexUsr = this.Usr.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.usr[this.editedIndexUsr].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar usuario'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    preguntoBorrarDep (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.editedIndexDep = this.dep.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.dep[this.editedIndexDep].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar deposito'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    setDebitoCredito() {
      if (this.editadoTarjetaCobro.debito) {
        this.editadoTarjetaCobro.cuotas = 1
        this.editadoTarjetaCobro.interes = 0
      } else {
        this.editadoTarjetaCobro.recargo = 0
      }
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar deposito') {
          this.borrarDeposito(this.itemActual)
        } else if (this.msg.msgAccion=='Articulos Vinculados con Exito') {
          this.msg.msgVisible = false
        } else if (this.msg.msgAccion=='actualizar perfil') {
          this.editado.suc    = this.suc;
          this.editado.users  = this.usr;
          this.editado.vin    = this.vin;
          let aux = [];
          for(let i=0; i<=this.rubValue.length-1; i++ ) {
            for(let j=0; j<=this.rubObj.length-1; j++) {
              if(this.rubValue[i]===this.rubObj[j].nombre) {
                aux.push(this.rubObj[j])
                break
              }
            }
          }
          this.editado.rubros = aux;
          this.editarHTTP(this.editado);
          this.dialog = false;
          window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
        }
      }
      this.msg.msgVisible = false;
    },

    borrarDeposito (item) {
      const index = this.dep.indexOf(item);
      this.dep.splice(index, 1)
    },

    chequearAfip() {
      return HTTP().post('chequearafip', {
        cuit: this.datosEmpresa.cuit,
        produccion: this.editado.faeproduccion=='P' ? true : false,
      }, { timeout: 3000} )
      .then((res) => {
        this.msg.msgTitle = 'Servicio de AFIP'
        let msg = ''
        if (res.data=='error') {
          msg = 'El servicio de AFIP esta INACTIVO' 
          msg += '<br>Deberá esperar a que se reestablezca o en su defecto realizar '
          msg += 'comprobantes manuales.'
        } else {
          msg += '<br>Los servidores de AFIP estan ACTIVOS y respondieron correctamente.<br><br>'
          msg += 'Si aún así, la emisión o consulta de comprobantes electrónicos presentan problemas, '
          msg += 'espere y vuelva a intentar<br>'
        }
        this.msg.msgBody    = msg
        this.msg.msgVisible = true
        this.msg.msgAccion  = 'Servicio de AFIP'
        this.msg.msgButtons = ['Aceptar']
      })
    },

    actCertificado() {
      this.dialogActCertificado = true
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    sucFiscal() {
      this.editadoSuc.fiscal = this.editadoSuc.fiscal.padStart(4,'0')
    },

    removeTurnosLV(item) {
      this.editado.turnoslv.splice(this.editado.turnoslv.indexOf(item), 1);
      this.editado.turnoslv = [...this.editado.turnoslv];
    },

    removeTurnosSD(item) {
      this.editado.turnossd.splice(this.editado.turnossd.indexOf(item), 1);
      this.editado.turnossd = [...this.editado.turnossd];
    },

    checkHora(cual) {
      let turTmp = []
      let aux = cual=='sd' ? this.editado.turnossd : this.editado.turnoslv
      for (let i=0; i<=aux.length-1; i++) {
        let hr = aux[i]
        let dp = hr.indexOf(':')
        if (dp>-1) {
          let hh = hr.substring(0,dp)
          hh = hh.padStart(2, "00"); // "abc123"
          let mm = hr.substring(dp+1)
          if (Number(hh)>=0 && Number(hh)<24) {
            mm = mm == '' ? '00' : mm
            mm = mm.padEnd(2,'00')
            if (Number(mm)>=0 && Number(mm)<60) {
              turTmp.push(hh+':'+mm)
            }
          }
        } else {
          let hh = hr.padEnd(2,'00')
          if (Number(hh)>=0 && Number(hh)<24) {
            turTmp.push(hh+':00')
          }
        }
      }
      if (cual=='sd') {
        this.editado.turnossd = turTmp
      } else {
        this.editado.turnoslv = turTmp
      }
    },

    sucManual() {
      this.editadoSuc.manual = this.editadoSuc.manual.padStart(4,'0')
    },

  },
};
</script>

<style scoped lang="scss">
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg115 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 115%;
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
</style> 
//3678
