<template>
  <v-app>

    <!-- MENU LATERAL -->
    <v-navigation-drawer
      class="fg"
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-show="isLoggedIn && activo"
      :dark="temas.barra_lateral_dark==true"
      :color="temas.barra_lateral_bg"
      temporary
      width="310"
      overflow>
      <v-layout mt-4 column align-left>
        <v-flex>
          <v-list dense>
            <v-list-group v-show="ophab(2)"
              no-action prepend-icon="mdi-airplane-takeoff"
              :color="temas.barra_lateral_font">
              <template v-slot:activator>
                <v-list-item-title>Ventas</v-list-item-title>
              </template>
              <v-list-item v-show="userId==1"
                link :to="{name: 'licencias'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-sale</v-icon>
                  Licencias
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="userId==1"
                link :to="{name: 'estadisticas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-chart-bar</v-icon>
                  Estadísticas
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(4)"
                link :to="{name: 'ventas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-airplane-takeoff</v-icon>
                  Central de Ventas
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(3)"
                link :to="{name: 'usersclientes', key: 'C'}"
                @click="setTercero('C')"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-account-multiple</v-icon>
                  Clientes
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(12)"
                link :to="{name: 'resumenesclientes'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-format-align-right</v-icon>
                  Resumen de Cuentas
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(13)"
                link :to="{name: 'saldosinicialesclientes'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-spellcheck</v-icon>
                  Saldos Iniciales
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(14)"
                link :to="{name: 'usersequipo', key: 'V'}"
                @click="setTercero('V')"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-account-multiple</v-icon>
                  Mi Equipo
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(92)"
                link :to="{name: 'userstransportistas', key: 'T'}"
                @click="setTercero('T')"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-truck</v-icon>
                  Transportistas
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(93)"
                link :to="{name: 'userspuntosderetiros', key: 'R'}"
                @click="setTercero('R')"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-clipboard-account</v-icon>
                  Puntos de Retiros
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(103) && userId!=1)"
                link :to="{name: 'viajes'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-road</v-icon>
                  Viajes
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(108)&&userId!=1)"
                link :to="{name: 'maletines'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-wallet-travel</v-icon>
                  Maletines
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(96)"
                link :to="{name: 'comisiones'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-margin</v-icon>
                  Comisiones
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(15)"
                link :to="{name: 'informesdeventas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-format-align-right</v-icon>
                  Informes de Ventas
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-item v-show="tipo=='PP'"
              link :to="{name:'compras'}"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-qrcode</v-icon>
                Compras
              </v-list-item-title>
            </v-list-item>
          <!--
            <v-list-item v-show="tipo=='PP'"
              link :to="{name:'ventas'}"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-qrcode</v-icon>
                Ventas
              </v-list-item-title>
            </v-list-item>
          -->
            <v-list-item v-show="tipo=='PP'"
              link :to="{name: 'usersclientes', key: 'C'}"
              @click="setTercero('C')"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-account-multiple</v-icon>
                Mis Clientes
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-show="tipo=='PP'"
              link :to="{name: 'usersproveedores', key: 'P'}"
              @click="setTercero('P')"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-account-multiple</v-icon>
                Mis Proveedores
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-show="tipo=='PP'"
              link :to="{name: 'articulos'}"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-barcode</v-icon>
                Articulos
              </v-list-item-title>
            </v-list-item>
            <v-list-group  v-show="ophab(26)"
              no-action prepend-icon="mdi-airplane-landing"
              :color="temas.barra_lateral_font">
              <template v-slot:activator>
                <v-list-item-title>Compras</v-list-item-title>
              </template>
              <v-list-item v-show="ophab(28)"
                link :to="{name:'compras'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-airplane-landing</v-icon>
                  Central de Compras
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(27)"
                link :to="{name: 'usersproveedores', key: 'P'}"
                :color="temas.barra_lateral_font"
                @click="setTercero('P')">
                <v-list-item-title>
                  <v-icon>mdi-account-multiple</v-icon>
                  Proveedores Mercaderías
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(27)"
                link :to="{name: 'userstercerosgastos', key: 'G'}"
                :color="temas.barra_lateral_font"
                @click="setTercero('G')">
                <v-list-item-title>
                  <v-icon>mdi-account-multiple</v-icon>
                  Estado/Servicios/Otros
                </v-list-item-title>
              </v-list-item>
              <v-list-item  v-show="ophab(37)"
                link :to="{name: 'resumenesproveedores'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-format-align-right</v-icon>
                  Resumen de Cuentas
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(38)"
                link :to="{name: 'saldosinicialesproveedores'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-spellcheck</v-icon>
                  Saldos Iniciales
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(39)"
                link :to="{name: 'informesdecompras'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-format-align-right</v-icon>
                  Informes de Compras
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <!--<v-list-group v-show="ophab(45)"-->
            <v-list-group v-show="ophab(45) || (tipo=='PP'&&exclusivoDe.id==null)"
              no-action prepend-icon="mdi-barcode"
              :color="temas.barra_lateral_font">
              <template v-slot:activator>
                <v-list-item-title>Artículos</v-list-item-title>
              </template>
              <v-list-item v-show="ophab(46) || (tipo=='PP')" link :to="{name: 'articulos'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-barcode</v-icon>
                  Articulos
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(102) || (tipo=='PP' ))&&userId!=1"
                link :to="{name: 'codigosdebarra'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-stocking</v-icon>
                  Códigos de Barra
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(47) || (tipo=='PP'))&&userId!=1"
                link :to="{name: 'precioscambios'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-marker</v-icon>
                  Cambios de Precios
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(48) || (tipo=='PP'))&&userId!=1"
                link :to="{name: 'cambiosmasivosdearticulos'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-drawing</v-icon>
                  Cambios Masivos
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(49) || tipo=='PP')&&userId!=1"
                link :to="{name: 'preciosconsultas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-glasses</v-icon>
                  Consultas de Precios
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="userId==1"
                link :to="{name: 'preciosactualizaciones'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-glasses</v-icon>
                  Actualización de Precios
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(94)||tipo=='PP')&&userId!=1"
                link :to="{name: 'listas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-square-root</v-icon>
                  Listas de Precios
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(52)&&tipo!='PP')&&userId!=1"
                link :to="{name: 'unidades'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-backburger</v-icon>
                  Unidades de Medida
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(54)||tipo=='PP')"
                link :to="{name: 'marcas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-apple</v-icon>
                  Marcas
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(55)||tipo=='PP')"
                link :to="{name: 'grupos'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-code-parentheses</v-icon>
                  Grupos
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="(ophab(57)||tipo=='PP')&& userId!=1"
                link :to="{name: 'informesdearticulos'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-file-pdf-box</v-icon>
                  Informes
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-group v-show="(ophab(59) && tipo!='PP')&&userId!=1"
              no-action prepend-icon="mdi-stocking"
              :color="temas.barra_lateral_font">
              <template v-slot:activator>
                <v-list-item-title>Stocks</v-list-item-title>
              </template>
              <v-list-item v-show="ophab(60)"
                link :to="{name: 'stocks'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-table-column</v-icon>
                  Central de Stocks
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(63)" link :to="{name: 'informesdestocks'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-file-pdf-box</v-icon>
                  Informes
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-group v-show="ophab(67)&&tipo!='PP'"
              no-action prepend-icon="mdi-currency-usd"
              :color="temas.barra_lateral_font">
              <template v-slot:activator>
                <v-list-item-title>Tesoreria</v-list-item-title>
              </template>
              <v-list-item v-show="ophab(68) && activo" link :to="{name: 'tesoreriacaja'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-currency-usd</v-icon>
                  Cajas
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(69) && activo" link :to="{name: 'cheques'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-calendar</v-icon>
                  Cheques
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(105)&&activo&&tipo!='PP'&&operario=='CEO'"
                @click="setEstadoFinanciero"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-newspaper</v-icon>
                  Estado Financiero
                </v-list-item-title>
              </v-list-item>
              <v-list-item  v-show="ophab(70) && activo" link :to="{name: 'informesdetesoreria'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-file-pdf-box</v-icon>
                  Informes de Tesorería
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-group
              v-show="ophab(73) && tipo!='PP'&&!sucursalDemo"
              no-action prepend-icon="mdi-bank"
              :color="temas.barra_lateral_font">
              <template v-slot:activator>
                <v-list-item-title>Bancos</v-list-item-title>
              </template>
              <v-list-item  v-show="ophab(74) && activo" link :to="{name: 'bancosmovimientos'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-tab-plus</v-icon>
                  Central de Bancos
                </v-list-item-title>
              </v-list-item>
              <v-list-item  v-show="ophab(92) && activo" link :to="{name: 'cotizacionmonedas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-currency-usd</v-icon>
                  Cotización de Monedas
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-group v-show="ophab(75)&&tipo!='PP'"
              no-action prepend-icon="mdi-home-account"
              :color="temas.barra_lateral_font">
              <template v-slot:activator>
                <v-list-item-title>AFIP</v-list-item-title>
              </template>
              <v-list-item v-show="ophab(95)" link :to="{name:'posIVA'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-emoticon-devil</v-icon>
                  IVA
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(76)" link :to="{name:'afipiva'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-percent</v-icon>
                  Tasas de IVA
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(78)" link :to="{name:'afipcomprobantes'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-note-outline</v-icon>
                  Comprobantes
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(79)" link :to="{name:'afipmonedas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-currency-jpy</v-icon>
                  Monedas
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(80)" link :to="{name:'afipdocumentos'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-note-multiple</v-icon>
                  Documentos
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(81)" link :to="{name:'afipresponsables'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-pencil-lock</v-icon>
                  Tipo de Responsables
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <!--<v-list-group v-show="ophab(82) || (tipo=='PP'&&exclusivoDe.id==null)"-->
            <v-list-group v-show="ophab(82)"
              no-action prepend-icon="mdi-dice-multiple"
              :color="temas.barra_lateral_font">
              <template v-slot:activator>
                <v-list-item-title>Configuracion</v-list-item-title>
              </template>
              <v-list-item v-show="ophab(98) || (tipo=='PP')"
                link :to="{name:'migraciones'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-jira</v-icon>
                  Migración de Datos
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(83)&&tipo!='PP'" link :to="{name:'contactostipos'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-contacts</v-icon>
                  Contactos
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(84)&&tipo!='PP'" link :to="{name:'mediosdepagos'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-credit-card</v-icon>
                  Medios de Pagos
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(85)&&tipo!='PP'" link :to="{name:'paises'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-earth</v-icon>
                  Paises
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(86)&&tipo!='PP'" link :to="{name:'provincias'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-church</v-icon>
                  Provincias
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(87)&&tipo!='PP'" link :to="{name:'postales'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-city</v-icon>
                  Códigos Postales
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(88)&&tipo!='PP'" link :to="{name:'bancos'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-bank</v-icon>
                  Bancos
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="ophab(89)&&tipo!='PP'" link :to="{name:'tarjetas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-credit-card-plus</v-icon>
                  Tarjetas
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-show="userId==1" link :to="{name:'rubros'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-jira</v-icon>
                  Rubros
                </v-list-item-title>
              </v-list-item>
              <!--
              <v-list-item v-show="ophab(90) && tipo!='PP' && userId==1" link :to="{name:'rubros'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-jira</v-icon>
                  Rubros
                </v-list-item-title>
              </v-list-item>
              -->
              <v-list-item v-show="ophab(91) && tipo!='PP'" link :to="{name:'zonas'}"
                :color="temas.barra_lateral_font">
                <v-list-item-title>
                  <v-icon>mdi-jira</v-icon>
                  Zonas
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-item v-if="operarioArea==null"
              @click="cambiarLicencia"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-account-star</v-icon>
                Cambiar de Licencia
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="exclusivoDe.id==null&&operarioArea==null"
              @click="showUsuariosNuevos"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-share-variant</v-icon>
                Vinculaciones
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="showNuevoMensaje"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-format-float-left</v-icon>
                Mensajes
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="verCotizaciones(true)"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-currency-usd</v-icon>
                Dolar
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              link to="/profile"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-account-settings</v-icon>
                Perfil
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!operarioEsVendedor"
              link :to="{name:'ayuda', params: { id: 0}}"
              :color="temas.barra_lateral_font">
              <v-list-item-title>
                <v-icon>mdi-help-circle-outline</v-icon>
                Ayuda y Tutoriales
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>

    <!--
      ////// BARRA PRINCIPAL //////
    -->
    <v-app-bar class="fg"
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app flat
      v-bind:style="{'background-color': temas.barra_principal_bg ?
      temas.barra_principal_bg : temas.barra_principal_bg}" dark>
      <v-app-bar-nav-icon class="fg85"
        v-show="isLoggedIn && activo && tipo!='UE' && !enCarrito"
        @click.stop="drawer=!drawer"
        :color="temas.barra_principal_botonapp_bg"
        :dark="temas.barra_principal_botonapp_dark==true"
        v-bind:style="{'background-color': temas.barra_principal_bg
        ? temas.barra_principal_bg : temas.barra_principal_bg}">
      </v-app-bar-nav-icon>

      <v-toolbar-title style="width: 700px" class="ml-0 pl-0" v-show="isLoggedIn">
        <span class="fg70">
          <v-list-item-avatar color="grey">
            <v-img height="40" width="40" :src="`/images/${avatar}`"></v-img>
          </v-list-item-avatar>
          <v-chip v-if="!externo"
            class="fg ml-0 ma-1 hidden-sm-and-down"
            :color="temas.barra_lateral_bg">
            {{ empresa }} / {{ operario }} / {{ sayOperarioArea }} / {{ tipo }} /  {{ level }}
          </v-chip>
          <v-chip v-else
            class="fg ml-0 ma-1 hidden-sm-and-down"
            :color="temas.barra_lateral_bg">
            {{ empresa }}
          </v-chip>
          <v-chip v-if="exclusivoDe.username"
            class="fg ml-0 ma-1 hidden-sm-and-down"
            :color="temas.barra_lateral_bg">
            Exclusivo de {{ exclusivoDe.username }}
          </v-chip>
          <v-chip v-if="tipo=='BA'||tipo=='ME'"
            class="fg ml-0 ma-1 hidden-sm-and-down"
            :color="temas.barra_lateral_bg">
            opres {{ $store.state.topeOperaciones-$store.state.operaciones }}
          </v-chip>
          <v-chip v-if="administraGOHU"
            class="fg ml-0 ma-1 hidden-sm-and-down"
            :color="temas.barra_lateral_bg">
            Precios Administrados por GOHU
          </v-chip>
<!--
          {{operarioUserId}}/{{$store.state.proveedores.length}}
          c:{{ contador }} cg:{{ contadorGohu }} cp:{{ contadorPub }}
          {{$store.state.dolar}} / {{ $store.state.turnos }}
          {{empresa}}/{{operario}}/{{tipo}}/{{activo ? 'si' : 'no'}}/{{operarioUserId}}
          /{{externo}}/{{$store.state.proveedores.length}}
-->

        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- VENTAS -->
      <v-tooltip bottom
        v-if="isLoggedIn && activo && !enCarrito && tipo!='PP' && !externo && level!=3">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="ml-1 mr-1 hidden-sm-and-down"
            link :to="{name: 'ventas'}"
            v-on="on">
            <v-icon medium  :color="temas.barra_principal_bell_bg">
              mdi-airplane-takeoff
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">Ventas</span>
      </v-tooltip>
      <!-- FINAL VENTAS -->

      <!-- VIAJES -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-show="isLoggedIn && activo && !enCarrito && !externo && level==3"
            fab small outlined class="ml-1 mr-1 hidden-sm-and-down"
            link :to="{name: 'viajes'}"
            v-on="on">
            <v-icon>mdi-road</v-icon>
          </v-btn>
        </template>
        <span class="fg">Viajes</span>
      </v-tooltip>
      <!-- FINAL VIAJES -->

      <!-- MALETINES -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-show="isLoggedIn && activo && !enCarrito && !externo && level==3"
            fab small outlined class="ml-1 mr-1 hidden-sm-and-down"
            link :to="{name: 'maletines'}"
            v-on="on">
            <v-icon>mdi-wallet-travel</v-icon>
          </v-btn>
        </template>
        <span class="fg">Maletines</span>
      </v-tooltip>
      <!-- FINAL MALETINES -->

      <!-- TURNOS -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="ml-1 mr-1 hidden-sm-and-down"
            v-show="isLoggedIn&&activo&&!enCarrito&&turnos&&!externo" dense
            link :to="{name: 'turnos'}"
            v-on="on">
            <v-icon medium  :color="temas.barra_principal_bell_bg">
              mdi-calendar-clock
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">Turnos</span>
      </v-tooltip>
      <!-- FINAL TURNOS -->

      <!-- OFERTAS -->
      <v-tooltip bottom
        v-if="userId!=1&&isLoggedIn&&activo&&!enCarrito">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="ml-1 mr-1"
            @click="ofertasOnOff()" v-on="on">
            <v-icon medium :color="temas.barra_principal_bell_bg">
              {{!$store.state.ofertas ? 'mdi-cart-outline' : 'mdi-cart-off'}}
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">{{$store.state.ofertas?'Ocultar Ofertas':'Ver Ofertas'}}</span>
      </v-tooltip>

      <!--  ESTE NO VA
      <v-tooltip bottom
        v-if="userId!=1&&$store.state.operario=='CEO'&&vinculosPadres.length>0&&!externo">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="mr-2"
            v-show="isLoggedIn&&activo&&!enCarrito"
            dense
            @click="ofertasOnOff()" v-on="on">
            <v-icon medium :color="temas.barra_principal_bell_bg">
              {{!$store.state.ofertas ? 'mdi-cart-outline' : 'mdi-cart-off'}}
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">{{$store.state.ofertas?'Ocultar Ofertas':'Ver Ofertas'}}</span>
      </v-tooltip>
      -->

      <!-- FINAL OFERTAS -->

      <!-- CONSULTA DE PRECIOS -->
      <v-tooltip bottom
        v-if="userId!=1&&!externo">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="ml-1 mr-1"
            v-show="(ophab(49) || tipo=='PP') && isLoggedIn && activo && !enCarrito"
            link to="/preciosconsultas" v-on="on">
            <v-icon medium :color="temas.barra_principal_bell_bg">mdi-barcode</v-icon>
          </v-btn>
        </template>
        <span class="fg">Precios</span>
      </v-tooltip>
      <!-- FINAL CONSULTA DE PRECIOS -->

      <!-- VINCULOS -->
      <v-tooltip bottom
        v-if="userId!=1&&operario=='CEO'&&exclusivoDe.id==null&&!externo">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="ml-1 mr-1 hidden-sm-and-down"
            v-show="isLoggedIn && usuariosBkp && activo && !enCarrito && !operarioEsVendedor"
            @click="showUsuariosNuevos" v-on="on">
            <v-badge
              :content="vinculosPanel[3].ctt+vinculosPanel[0].ctt"
              :value="vinculosPanel[3].ctt+vinculosPanel[0].ctt"
              :color="temas.forms_btn_add_bg"
              :dark="temas.forms_btn_add_bg==true" overlap>
              <v-icon medium :color="temas.barra_principal_bell_bg">
                mdi-share-variant
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span class="fg">Usuarios Vínculados ({{vinculosPanel[1].ctt}})</span>
      </v-tooltip>
      <!-- FINAL DE VINCULOS -->

      <!-- MENSAJES ENTRE USUARIOS -->
      <v-tooltip bottom
        v-if="(vinculosPadres.length+vinculosHijos.length>0)&&exclusivoDe.id==null&&!externo">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="ml-1 mr-1 hidden-sm-and-down"
            v-show="isLoggedIn&&usuariosBkp&&activo&&!enCarrito&&!operarioEsVendedor"
            @click="showNuevoMensaje" v-on="on">
            <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
              mdi-format-float-left
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">Mensajes</span>
      </v-tooltip>
      <!-- MENSAJES ENTRE USUARIOS -->

      <!-- VINCULOS ACEPTADOS -->
      <v-tooltip bottom
        v-if="userId!=1 && operario=='CEO'&&notVinOk.length>0&&!externo">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="ml-1 mr-1 hidden-sm-and-down"
            v-show="isLoggedIn&&activo&&!enCarrito&&!operarioEsVendedor"
            @click="showNueVinOk" v-on="on">
            <v-badge
              :content="notVinOk.length"
              :value="notVinOk.length"
              :color="temas.forms_btn_add_bg"
              :dark="temas.forms_btn_add_bg==true" overlap>
              <v-icon medium class="mr-1" :color="temas.barra_principal_bell_bg">
                mdi-account-check
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span class="fg">Vínculados Aceptados</span>
      </v-tooltip>
      <!-- FINAL DE VINCULOS ACEPTADOS -->

      <!-- VINCULOS RECHAZADOS -->
      <v-tooltip bottom
        v-if="userId!=1&&operario=='CEO'&&notVinRech.length>0&&!externo">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="ml-1 mr-1 hidden-sm-and-down"
            v-show="isLoggedIn&&activo&&!enCarrito&&!operarioEsVendedor"
            @click="showNueVinRechazados" v-on="on">
            <v-badge
              :content="notVinRech.length"
              :value="notVinRech.length"
              :color="temas.forms_btn_add_bg"
              :dark="temas.forms_btn_add_bg==true" overlap>
              <v-icon medium :color="temas.barra_principal_bell_bg">
                mdi-account-minus
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span class="fg">Vínculos no aceptados</span>
      </v-tooltip>
      <!-- FINAL DE VINCULOS RECHAZADOS -->

      <!-- BOTON COTIZACIONES -->
      <v-tooltip bottom v-if="!externo">
        <template v-slot:activator="{ on }">
          <v-btn class="ml-1 mr-1 hidden-sm-and-down"
            fab small outlined
            v-show="isLoggedIn&&activo&&!enCarrito"
            @click="verCotizaciones(true)" v-on="on">
            <v-icon medium :color="temas.barra_principal_bell_bg">
              mdi-currency-usd
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">Dolar ${{formatoImporte(dolar)}}</span>
      </v-tooltip>
      <!-- FINAL BOTON COTIZACIONES -->

      <!-- BOTON GRAFICOS ESTE NO VA -->
      <!--
      <v-tooltip bottom v-if="tipo!='PP'&&operario=='CEO'">
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2" fab small outlined
            v-show="isLoggedIn && activo && !enCarrito && !operarioEsVendedor"
            dense
            @click="setGraficos" v-on="on">
            <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
              mdi-chart-bar
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">Estadísticas</span>
      </v-tooltip>
      -->
      <!-- FINAL BOTON GRAFICOS -->

      <!-- BOTON ESTADO FINANCIERO ESTE NO VA -->
      <!--
      <v-tooltip bottom v-if="tipo!='PP'&&operario=='CEO'">
        <template v-slot:activator="{ on }">
          <v-btn class="mr-2 ml-2" fab small outlined
            v-show="isLoggedIn && activo && !enCarrito && !operarioEsVendedor"
            @click="setEstadoFinanciero" v-on="on">
            <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
              mdi-newspaper
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">Estado Financiero</span>
      </v-tooltip>
      -->
      <!-- FINAL BOTON ESTADO FINANCIERO -->

      <!-- BOTON REFRESH -->
      <v-tooltip bottom v-if="!externo">
        <template v-slot:activator="{ on }">
          <v-btn class="ml-1 mr-1"
            fab small outlined
            v-show="isLoggedIn&&activo&&!enCarrito"
            @click="setContadores" v-on="on">
            <v-icon medium :color="temas.barra_principal_bell_bg">
              mdi-refresh
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">Refrescar</span>
      </v-tooltip>
      <!-- FINAL BOTON REFRESH -->

      <!-- BOTON DE GOHU -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="ml-1 mr-1 hidden-sm-and-down"
            fab small outlined
            v-show="isLoggedIn&&$store.state.novedadesGohu>0&&
            activo&&!enCarrito&&!externo&&userId==1"
            @click="showNotGohu" v-on="on">
            <v-badge
              :content="novedadesGohu"
              :value="novedadesGohu"
              :color="temas.forms_btn_add_bg"
              :dark="temas.forms_btn_add_bg==true" overlap>
              <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
                mdi-google-plus
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span class="fg">gohu</span>
      </v-tooltip>
      <!-- FINAL BOTON DE GOHU -->

      <!-- BOTON DE NOTIFICACIONES DE CPRS -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="ml-1 mr-1 hidden-sm-and-down"
            fab
            small
            :outlined="novedadesCprs==0"
            :color="novedadesCprs>0?'green':temas.forms_btn_add_bg"
            v-show="isLoggedIn&&$store.state.novedadesCprs>0&&activo&&!enCarrito&&!externo"
            dense
            @click="showNotCprs" v-on="on">
            <v-badge
              :content="novedadesCprs"
              :value="novedadesCprs"
              color="red"
              :dark="temas.forms_btn_add_bg==true" overlap>
              <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
                mdi-bell-ring
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span class="fg">Notificaciones de Comprobantes</span>
      </v-tooltip>
      <!-- FINAL BOTON DE NOTIFICACIONES DE CPRS-->

      <!-- BOTON DE NOTIFICACIONES DE USUARIOS -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="ml-1 mr-1 hidden-sm-and-down"
            fab small outlined
            v-show="isLoggedIn&&
            $store.state.novedadesUsrs>0&&activo&&!enCarrito&&!operarioEsVendedor&&!externo"
            dense @click="showNotUsrs" v-on="on">
            <v-badge
              :content="novedadesUsrs"
              :value="novedadesUsrs"
              :color="temas.forms_btn_add_bg"
              :dark="temas.forms_btn_add_bg==true" overlap>
              <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
                mdi-account-edit
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span class="fg">Notificaciones de Usuarios</span>
      </v-tooltip>
      <!-- FINAL BOTON DE NOTIFICACIONES DE USUARIOS -->

      <!-- SELECCION DE LA SUCURSAL -->
      <v-toolbar-items class="overflow-hidden hidden-sm-and-down">
        <v-select v-if="isLoggedIn&&activo&&userId!==1&&!enCarrito&&!externo"
          class="mt-3 fg70"
          :color="temas.barra_principal_sucursal_bg"
          :dark="temas.barra_principal_sucursal_dark==true"
          :item-color="temas.barra_principal_sucursal_bg"
          :value="$store.state.sucursal"
          dense label="Sucursal" outlined
          @change="cambioSucursal"
          :items="sucursales" item-value="id" item-text="nombre" return-object>
        </v-select>
      </v-toolbar-items>

      <!-- BOTON PERFIL -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="ml-1 mr-1"
            fab small outlined
            v-show="isLoggedIn&&!enCarrito"
            link to="/profile" v-on="on">
            <v-icon :color="temas.barra_principal_profile_bg">
              mdi-account-settings
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">Perfil</span>
      </v-tooltip>
      <!-- FIN BOTON PERFIL -->

      <!-- BOTON SALIR -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="ml-1 mr-1"
            fab small
            color="black"
            v-show="isLoggedIn"
            @click="logout" v-on="on">
            <v-icon :color="temas.barra_principal_salir_bg">
              exit_to_app
            </v-icon>
          </v-btn>
        </template>
        <span class="fg">Salir</span>
      </v-tooltip>
      <!-- FIN BOTON SALIR -->

      <!--
        //////////////////////////
        /// BOTONES DE INGRESO ///
        //////////////////////////
      -->

      <!-- BOTON HOME -->
      <v-btn class="text-capitalize mr-2"
        @click="estoyEnLogin=false"
        to="/"
        color="red"
        v-if="!isLoggedIn">
        <v-icon :color="temas.barra_principal_salir_bg">
          home
        </v-icon>
        Home
      </v-btn>
      <!-- FIN BOTON HOME -->

      <!-- BOTON REGISTRARSE -->
      <v-btn class="text-capitalize mr-2"
        to="/register"
        color="blue"
        v-if="!isLoggedIn"
        @click="estoyEnLogin=true">
        <v-icon :color="temas.barra_principal_salir_bg">
          account_box
        </v-icon>
        Ser parte
      </v-btn>
      <!-- FIN BOTON REGISTRARSE -->

      <!-- BOTON INGRESAR -->
      <v-btn class="text-capitalize mr-2"
        to="/login"
        color="green"
        v-if="!isLoggedIn"
        @click="estoyEnLogin=true">
        <v-icon :color="temas.barra_principal_salir_bg">
          fingerprint
        </v-icon>
        Ingresar
      </v-btn>
      <!-- FIN BOTON INGRESAR -->

      <!-- BOTON AYUDA -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="ml-1 mr-1 hidden-sm-and-down"
            fab small outlined
            link :to="{name:'ayuda', params: { id: 0}}" v-on="on">
            <v-icon :color="temas.barra_principal_salir_bg">help</v-icon>
          </v-btn>
        </template>
        <span class="fg">Ayuda</span>
      </v-tooltip>
      <!-- FIN BOTON AYUDA -->

    </v-app-bar>

    <!--
      ////////////////
      /// DIALOGOS ///
      ////////////////
    -->

    <!--
      //////////////////////////////////
      /// DIALOGOS DE NOTIFICACIONES ///
      //////////////////////////////////
    -->

    <!-- NOTIFICACIONES DE COMPROBANTES -->
    <v-dialog v-model="dialogNotCprs" max-width="1300px"
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-card tile>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeNotCprs"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg text--right">Notificaciones</span>
        </v-toolbar>

        <v-container fluid>
          <v-row v-if="cttPedidosGlobales>1">
          <!--
            <v-col>
              <v-btn outlined class="fg mr-1 ml-4 text-capitalize"
                @click="impPedAll()">
                Descargar los {{ cttPedidosGlobales }} Pedidos pendientes
                <v-icon class="ml-2">mdi-arrow-down-bold-circle-outline</v-icon>
              </v-btn>
            </v-col>
          -->
            <v-col>
              <v-btn outlined class="fg mr-1 ml-4 text-capitalize"
                @click="impPedAll()">
                Descargar los {{ cttPedidosGlobales }} Pedidos pendientes
                <v-icon class="ml-2">mdi-arrow-down-bold-circle-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row justify="start">
            <v-col v-for="(nota, idx) in notCprs" v-bind:key="idx">
              <v-card outlined class="mx-auto my-0 ml-2 pl-3 pt-3" max-width="1240"
                color="transparent"
                open-delay="500">
                <v-img height="90" width="90" v-if="nota.novedades[0].userdesde!=undefined"
                  :src="nota.novedades[0].userdesde.logotipo!=null?
                  `/images/${nota.novedades[0].userdesde.logotipo}`
                  :`/images/sin avatar.jpg`">
                </v-img>
                <v-card-title class="pt-1 pb-0 pl-0 fg100b">
                  {{ nota.usuario.substring(0,18) }}
                  <v-badge v-if="nota.novedades.length&&nota.novedades[0].userdesde.tipo=='PP'"
                    content="pp"
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_bg==true">
                  </v-badge>
                  <v-tooltip bottom v-if="nota.cttPedidos>1">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-show="tipo!='PP'"
                        fab x-small outlined
                        class="mr-1 ml-4"
                        @click="impCprAll(nota)" v-on="on">
                        <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                        <v-badge
                          :content="nota.cttPedidos"
                          :value="nota.cttPedidos"
                          :color="temas.forms_btn_add_bg"
                          :dark="temas.forms_btn_add_bg==true">
                        </v-badge>
                      </v-btn>
                    </template>
                    <span class="fg">Descargar todos los Pedidos</span>
                  </v-tooltip>

                  <v-tooltip bottom v-if="nota.cttPedFac>1">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-show="tipo!='PP'"
                        fab x-small outlined
                        class="mr-1 ml-4"
                        @click="impCprAll(nota)" v-on="on">
                        <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                        <v-badge
                          :content="nota.cttPedFac"
                          :value="nota.cttPedFac"
                          :color="temas.forms_btn_add_bg"
                          :dark="temas.forms_btn_add_bg==true">
                        </v-badge>
                      </v-btn>
                    </template>
                    <span>Descargar todas las Facturas</span>
                  </v-tooltip>

                  <v-tooltip bottom v-if="nota.cttLeidos>1">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab x-small outlined
                        class="mr-1 ml-4"
                        @click="leidosAll(nota, nov)" v-on="on">
                        <v-icon>mdi-thumb-up</v-icon>
                        <v-badge
                          :content="nota.cttLeidos"
                          :value="nota.cttLeidos"
                          :color="temas.forms_btn_add_bg"
                          :dark="temas.forms_btn_add_bg==true">
                        </v-badge>
                      </v-btn>
                    </template>
                    <span>Marcar a todos como leidos</span>
                  </v-tooltip>
                </v-card-title>
                <v-card-text class="pl-0">
                  <v-container class="pl-0">
                    <v-row>
                      <div v-for="(nov, idx2) in nota.novedades" v-bind:key="idx2">
                        <v-col v-if="nov.comprobante!=null" cols="12" class="pl-3">
                          <v-card outlined :max-width="225" :min-width="225"
                            class="text--center">
                            <v-card-title>
                              <v-icon left>mdi-file</v-icon>
                              <span class="fg70b">
                                {{ cprOrigen( nov )}}<br>
                              </span>
                            </v-card-title>
                            <v-card-text class="fg85 pt-0 pb-2 pl-4 text--primary"
                              v-if="nov.comprobante!=null">
                              <div class="pt-2 pl-0"
                                v-if="nov.comprobante.vinculoHijo.length>0">
                                Origen: {{nov.comprobante.vinculoHijo[0].padre.cpr}}
                              </div>
                              <div>
                                <v-chip class="mb-0"
                                  x-small>
                                    {{ nov.comprobante.quienpidio=='V' ? 'vendedor' : 'cliente' }}
                                </v-chip>
                              </div>
                              <div class="pt-2 pl-0" v-if="nov.tipo=='R'" color="red">
                                <v-chip class="mb-0"
                                  x-small color="red" dark>
                                    Operación Rechazada
                                </v-chip>
                              </div>
                              <div class="pt-2 pl-0">
                                Total:$
                                <b>{{formatoImporte(nov.comprobante.total)}}<br></b>
                              </div>
                              <!--
                              <div class="pt-0 pl-0" v-if="nov.tipo=='M'">
                                Pendiente:
                                ${{formatoImporte(nov.comprobante.pendientes[0].pendiente)}}
                                <br>
                                {{diasVencido(nov.comprobante.pendientes[0].vencimiento)}}
                                días Vencido (
                                {{formatoFecha(nov.comprobante.pendientes[0].vencimiento)}} )
                              </div>
                              -->
                              <v-row v-for="(not, idx3) in nov.notas" v-bind:key="idx3"
                                v-show="not.borrada==false">
                                <div class="pt-2 pl-3 pb-1"
                                  v-if="not.nota=='Solicitud de Pago'">
                                  <v-chip class="mb-0" color='red' dark x-small>
                                    {{not.nota}}
                                  </v-chip>
                                </div>
                                <div class="pt-2 pl-3 pb-1"
                                  v-else-if="not.nota=='Descargar Pago'">
                                  <v-chip class="mb-0" color='green' dark x-small>
                                    <b>{{not.nota}}</b>
                                  </v-chip>
                                </div>
                                <div class="pt-2 pl-3 pb-1"
                                  v-else-if="nov.tipo=='M'">
                                  <b>{{not.nota}}</b>
                                </div>
                                <div class="pt-3 pl-3 pb-1"
                                  v-else-if="nov.tipo=='P'">
                                  {{fechaTimeLine(not.fecha)}}<br>
                                  <v-chip class="mb-0" color='blue' dark x-small>
                                      <b>¡{{not.nota}}!</b>
                                  </v-chip>
                                </div>
                                <div v-else class="pt-2 pl-3 pb-1">
                                  {{fechaTimeLine(not.fecha)}}<br>
                                  <b>{{not.nota}}</b>
                                  <br>
                                </div>
                              </v-row>
                            </v-card-text>

                            <v-card-actions class="text--center">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="(nov.tipo=='P'||nov.tipo=='F'||nov.tipo=='I')"
                                    fab x-small outlined
                                    class="mr-0 ml-2"
                                    @click="impCpr(nota, nov)" v-on="on">
                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Descargar</span>
                              </v-tooltip>
<!--
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show=
                                    "(nov.tipo=='P'||nov.tipo=='F'||nov.tipo=='I')&&tipo=='PP'"
                                    fab x-small outlined
                                    class="mr-0 ml-2"
                                    @click="uneteAGohu()" v-on="on">
                                    <v-icon>mdi-account-multiple</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Unete a Gohu</span>
                              </v-tooltip>
-->
<!--
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="nov.tipo=='F'&&tipo=='PP'"
                                    fab x-small outlined
                                    class="mr-0 ml-0"
                                    @click="informarPago()" v-on="on">
                                    <v-icon>mdi-information-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Informar Pago</span>
                              </v-tooltip>
-->
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show=
                                    "nov.tipo=='B'||nov.tipo=='K'||nov.tipo=='D'||nov.tipo=='R'"
                                    fab x-small outlined
                                    class="mr-0 ml-0"
                                    @click="leido(nov,1)" v-on="on">
                                    <v-icon>mdi-thumb-up</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Quitar Notificación</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="(nov.tipo=='P'||nov.tipo=='F'||nov.tipo=='I')
                                    &&nov.comprobante.cpr.substr(0,3)=='PED'&&tipo!='PP'"
                                    fab x-small outlined
                                    class="mr-0 ml-0"
                                    @click="anular(nov,1)" v-on="on">
                                    <v-icon>mdi-thumb-down-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Rechazar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="nov.comprobante.items.length>0 "
                                    fab x-small outlined
                                    class="mr-0 ml-0"
                                    @click="verArt(nov)" v-on="on">
                                    <v-icon>mdi-barcode</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Artículos</span>
                              </v-tooltip>

                              <!-- CANCELACIONES Y VALORES -->
                              <!--
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show=
                                    "(nov.comprobante.pendientes ||
                                    nov.comprobante.cancelaciones)
                                    && nov.comprobante.cpr.substr(0,3)!='PED'
                                    && tipo!='PP'"
                                    fab x-small outlined
                                    class="mr-0 ml-0"
                                    @click="verPend(nov)" v-on="on">
                                    <v-icon>mdi-playlist-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">
                                  {{nov.comprobante.cancelaciones ?
                                  'Cancelaciones y Valores' : 'Pendientes'}}
                                </span>
                              </v-tooltip>
                              -->
                              <!-- FIN CANCELACIONES Y VALORES -->

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="(nov.comprobante.valoresEgresos)
                                    && nov.comprobante.cpr.substr(0,3)=='PAG'
                                    && tipo!='PP'"
                                    fab x-small outlined
                                    class="mr-0 ml-0"
                                    @click="verValores(nov)" v-on="on">
                                    <v-icon>mdi-playlist-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Valores</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="(nov.tipo=='I'||nov.tipo=='F')
                                    && nov.comprobante.cpr.substr(0,3)=='PAG'"
                                    fab x-small outlined
                                    class="mr-0 ml-1"
                                    @click="rechazarCpr(nov)" v-on="on">
                                    <v-icon>mdi-thumb-down-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Rechazar Operación</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="nov.tipo=='F'"
                                    fab x-small outlined
                                    class="mr-0 ml-0"
                                    @click="verCpr(nov)" v-on="on">
                                    <v-icon>mdi-printer</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Imprimir</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show=
                                    "(nov.tipo=='P'||nov.tipo=='F'||nov.tipo=='I')&&tipo=='PP'"
                                    fab x-small outlined
                                    class="mr-0 ml-0"
                                    @click="enviarAExcel(nov)" v-on="on">
                                    <v-icon>mdi-file-excel</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Enviar a Excel</span>
                              </v-tooltip>

                              <!--
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="nov.comprobante.items[0].valor_id!=null"
                                    fab x-small outlined
                                    color="red"
                                    class="mr-0 ml-0"
                                    @click="verChequeRechazado(nov)" v-on="on">
                                    <v-icon>mdi-file</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Ver Cheque Rechazado</span>
                              </v-tooltip>
                              -->

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="showChequeRechazado(nov)"
                                    fab x-small outlined
                                    color="red"
                                    class="mr-0 ml-0"
                                    @click="verChequeRechazado(nov)" v-on="on">
                                    <v-icon>mdi-file</v-icon>
                                  </v-btn>
                                </template>
                                <span class="fg">Ver Cheque Rechazado</span>
                              </v-tooltip>

                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </div>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- CIERRE DE NOTIFICACIONES DE COMPROBANTES -->

    <!-- NOTIFICACIONES DE USUARIOS -->
    <v-dialog v-model="dialogNotUsrs" max-width="700px"
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeNotUsrs"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg">Notificaciones de Usuarios</span>
        </v-toolbar>
        <v-container fluid class="fg">
          <v-alert v-for="(nota, idx) in notUsrs" v-bind:key="idx"
            dense border="left"
            colored-border
            :color="temas.forms_titulo_bg"
            elevation="1"
            close-text="Ok">
            <v-row>
              <v-col cols="1" class="text-center">
                <v-avatar size="50px" class="mt-0 ml-2 mr-2">
                  <v-img alt="Avatar" :src="`/images/${nota.userdesde.avatar}`"></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="9" class="fg85 pr-6 pl-6">
                <div v-html="sayMessage(nota)"></div>
              </v-col>
              <v-col cols="2" class="text-center">

                <v-card flat>
                  <template slot="progress"></template>
                  <v-card-text class="pt-0 pb-0 pr-0 pl-0">
                    <div class="fg120" :color="temas.forms_btn_xls_bg">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            fab x-small outlined
                            class="mr-0 ml-0"
                            @click="leido(nota,5)" v-on="on">
                            <v-icon>mdi-thumb-up</v-icon>
                          </v-btn>
                        </template>
                        <span class="fg">Ok</span>
                      </v-tooltip>
                    </div>
                    <div class="fg60">
                      <span style="margin-right: 5px;">
                        <b>hace {{fechadelmensaje(nota.created_at)}}</b>
                      </span>
                    </div>
                  </v-card-text>
                </v-card>

              </v-col>
            </v-row>
          </v-alert>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- CIERRE DEL DIALOG NOTIFICACIONES DE USUARIOS -->

    <!-- NOTIFICACIONES DE GOHU -->
    <v-dialog v-model="dialogNotGohu" max-width="1300px"
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeNotGohu"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Notificaciones</span>
        </v-toolbar>
        <v-container fluid>
          <v-row justify="start">
            <v-col v-for="(nota, idx) in notGohu" v-bind:key="idx" cols="4">
              <v-card tile outlined max-width="350" min-width="350" class="pt-0 pb-0">
                <v-card-title class="pt-1 pb-0 subtitle-2">
                  {{nota.usuario.userdesde.username}}
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-card tile outlined>
                      <v-card-title>
                        <span class="text-h6 font-weight-light">
                          <b>¡Solicitud de Licencia!</b>
                        </span>
                      </v-card-title>
                      <v-card-text class="pt-0 pb-0 caption white text--primary">
                        <span>
                          Tipo: <b>{{ licenciaActual(nota.usuario.userdesde.tipo) }}</b><br>
                          Usuario: <b>{{ nota.usuario.userdesde.email }}</b><br>
                          Nombre: <b>{{ nota.usuario.userdesde.tercero!=null ?
                              nota.usuario.userdesde.nombre:'' }}</b><br>
                          Dirección:
                          <b>{{ nota.usuario.userdesde.tercero!=null ?
                              nota.usuario.userdesde.tercero.direcciones[0].direccion: '' }}</b><br>
                          Localidad:
                          <b> {{ nota.usuario.userdesde.tercero!=null?
                                nota.usuario.userdesde.tercero.
                                direcciones[0].postal.nombre+' '+
                                nota.usuario.userdesde.tercero.
                                direcciones[0].postal.provincia.nombre+' '+
                                (nota.usuario.userdesde.tercero.direcciones[0].postal.codigo)
                              :''
                              }}
                          </b>
                          <br>
                          Recomendo: <b>{{
                            nota.usuario.userdesde.recomendo!=null?
                            nota.usuario.userdesde.recomendo.tercero.nombre:''
                          }}</b>
                          <br>
                        </span>
                      </v-card-text>
                      <v-card-actions>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              fab x-small outlined
                              class="mt-6 mr-2 ml-2"
                              @click="aceptarRechazarPlan(nota, true)" v-on="on">
                              <v-icon>mdi-thumb-up</v-icon>
                            </v-btn>
                          </template>
                          <span>Aceptar Solicitud</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              fab x-small outlined
                              class="mt-6 mr-2"
                              @click="aceptarRechazarPlan(nota, false)" v-on="on">
                              <v-icon>mdi-thumb-down</v-icon>
                            </v-btn>
                          </template>
                          <span>Rechazar Solicitud</span>
                        </v-tooltip>
                      </v-card-actions>
                    </v-card>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- CIERRE DEL DIALOG NOTIFICACIONES GOHU -->

    <!-- DIALOGO VER ARTICULOS -->
    <v-dialog v-model="dialogVerArticulos" max-width="1100px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon
          @click="verArt()"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg text--right">Artículos del Comprobante</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile class="fg">
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="headersArt"
              :items="articulos"
              :class="temas.forms_titulo_bg" dense
              :footer-props="{
                itemsPerPageOptions: [6],
                showFirstLastPage: true,
                showCurrentPage: true,
                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                prevIcon: 'mdi-arrow-left-drop-circle-outline',
              }">
              <template v-slot:item.precio="{ item }">
                $ {{ formatoImporte(item.precio) }}
              </template>
              <template v-slot:item.cantidad="{ item }">
                {{ formatoImporte(item.cantidad) }}
              </template>
              <template v-slot:item.total="{ item }">
                $ {{ formatoImporte(item.total) }}
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO VER ARTICULOS -->

    <!-- DIALOGO VER CHEQUE RECHAZADO -->
    <v-dialog v-model="dialogVerChequeRechazado" max-width="650px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon
          @click="dialogVerChequeRechazado=false"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg text--right">Cheque Rechazado</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile class="fg">
        <v-card-text>
          <v-container>
            <span>
              <b>Observ.</b> {{ chqRzdo.observ }}
            </span>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO VER CHEQUE RECHAZADO -->

    <!-- DIALOGO VER PENDIENTES -->
    <v-dialog v-model="dialogVerPendientes" max-width="500px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon class="fg85"
          @click="verPend()"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg text--right">Pendientes</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card class="fg">
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="headersPend"
              :items="pendientes"
              dense
              :hide-default-footer="true">
              <template v-slot:item.vencimiento="{ item }">
                {{ formatoFecha(item.vencimiento) }}
              </template>
              <template v-slot:item.importe="{ item }">
                $ {{ formatoImporte(item.importe) }}
              </template>
              <template v-slot:item.pendiente="{ item }">
                $ {{ formatoImporte(item.pendiente) }}
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO VER PENDIENTES -->

    <!-- DIALOGO VER CANCELACIONES -->
    <v-dialog v-model="dialogVerCancelaciones" max-width="1100px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon
          @click="verPend()"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg text--right">Cancelaciones y Valores</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile>
        <v-card-text>
          <v-container>
            <span class="fg ml-4"><b>Cancelaciones</b></span>
            <v-data-table
              :headers="headersCan"
              :items="cancelaciones"
              dense
              :hide-default-footer="true">
              <template v-slot:item.cancelado.comprobante.fecha="{ item }">
                {{ formatoFecha(item.cancelado.comprobante.fecha) }}
              </template>
              <template v-slot:item.importe="{ item }">
                $ {{ formatoImporte(item.importe) }}
              </template>
              <template v-slot:item.cancelado.importe="{ item }">
                $ {{ formatoImporte(item.cancelado.importe) }}
              </template>
              <template v-slot:item.cancelado.pendiente="{ item }">
                $ {{ formatoImporte(item.cancelado.pendiente) }}
              </template>
            </v-data-table>
            <br>
            <span class="fg ml-4"><b>Valores</b></span>
            <v-data-table
              :headers="headersMed"
              :items="valoresEgresos"
              dense
              :footer-props="{
                itemsPerPageOptions: [6],
                showFirstLastPage: true,
                showCurrentPage: true,
                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                prevIcon: 'mdi-arrow-left-drop-circle-outline',
              }">
              <template v-slot:item.cancelado.comprobante.fecha="{ item }">
                {{ formatoFecha(item.cancelado.comprobante.fecha) }}
              </template>
              <template v-slot:item.fecha="{ item }">
                {{ formatoFecha(item.fecha) }}
              </template>
              <template v-slot:item.importe="{ item }">
                $ {{ formatoImporte(item.importe) }}
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO VER CANCELACIONES -->

    <!-- DIALOGO VER VALORES -->
    <v-dialog v-model="dialogVerValores" max-width="1100px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon
          @click="verValores()"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg text--right">Valores</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile>
        <v-card-text>
          <v-container>
            <span class="fg ml-4"><b>Valores</b></span>
            <v-data-table
              :headers="headersMed"
              :items="valoresEgresos"
              dense
              :footer-props="{
                itemsPerPageOptions: [6],
                showFirstLastPage: true,
                showCurrentPage: true,
                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                prevIcon: 'mdi-arrow-left-drop-circle-outline',
              }">
              <template v-slot:item.cancelado.comprobante.fecha="{ item }">
                {{ formatoFecha(item.cancelado.comprobante.fecha) }}
              </template>
              <template v-slot:item.fecha="{ item }">
                {{ formatoFecha(item.fecha) }}
              </template>
              <template v-slot:item.importe="{ item }">
                $ {{ formatoImporte(item.importe) }}
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO VER VALORES -->

    <!-- DIALOGO RECHAZAR CPR -->
    <v-dialog v-model="dialogRechazarCpr" max-width="400px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="dialogRechazarCpr=false">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg">Motivo del Rechazo</span>
        <v-spacer></v-spacer>
        <v-btn v-show="detRechazo!=''"
          :color="temas.cen_btns_bg"
          :dark="temas.cen_btns_dark==true"
          class="fg 85ma-2 white--text" @click="confirmarRechazoCpr">
          Confrmar
        </v-btn>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-container>
            <v-textarea
              class="fg pt-6"
              v-model="detRechazo"
              autofocus
              outlined
              :color="$store.state.temas.forms_titulo_bg"
              rows="5">
            </v-textarea>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO RECHAZAR CPR -->

    <!-- MENSAJES -->
    <v-dialog
      v-model="dialogMensajes" max-width="800px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="dialogMensajes=false">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg">
          Mensajes
        </span>
        <v-spacer></v-spacer>
        <v-btn v-if="mensajeTexto!=''&&mensajeUsersSel.length>0"
          :color="temas.cen_btns_bg"
          :dark="temas.cen_btns_dark==true"
          class="fg85 ma-2 white--text"
          @click="confirmarEnviarMensaje">
          Enviar
        </v-btn>
      </v-toolbar>
      <v-card tile class="fg">
        <v-card-text>
          <v-container>
            <v-data-table
              v-model="mensajeUsersSel"
              :headers="headersUsers"
              :search="searchUsersMensaje"
              :items="mensajeUsers"
              :single-select="false"
              item-key="nombre"
              show-select dense
              class="elevation-1"
              @toggle-select-all="selectAll"
              :footer-props="{
                itemsPerPageOptions: [6],
                showFirstLastPage: true,
                showCurrentPage: true,
                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                prevIcon: 'mdi-arrow-left-drop-circle-outline',
              }">
              <template v-slot:top>
                <v-text-field class="pl-5 pt-5 pb-5"
                  v-model="searchUsersMensaje"
                  append-icon="search"
                  :color="temas.forms_titulo_bg"
                  label="Buscar"
                  clearable
                  single-line hide-details>
                </v-text-field>
              </template>
            </v-data-table>

            <p class="fg120"><br>
              <v-textarea
                v-model="mensajeTexto"
                :color="temas.forms_titulo_bg"
                label="Mensaje (Max.255 caractéres)"
                auto-grow
                outlined
                rows="5"
                row-height="25"
                shaped>
              </v-textarea>
            </p>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN MENSAJES -->

    <!-- UNETE A GOHU -->
    <!--
    <v-dialog v-model="dialogUneteAGohu" max-width="600px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="dialogUneteAGohu=false">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg">
          ¿Que esperas para unirte a gohu?
        </span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile class="fg">
        <v-card-text>
          <v-container>
            <p>
              <br>
              <b>Unete a Gohu y podrás descargar este comprobante a tu sistema.
              </b><br><br>
              En <b>gohu</b> los comprobantes entre usuarios vinculados se transfieren por sistema.
              Pedidos, Facturas, NDC's, NDD's, Pagos, etc.<br>
              <br>
              Solo tienes que descargarlos y listo.<br>
              Cada comprobante descargado actualizará tu sistema automaticamente
              dejando la información <i>espejada</i> entre ambos usuarios.
              <br><br>
              Esto te va a permitir ahorrar tiempo y evitar errores.
            </p>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    -->
    <!-- FIN DIALOGO UNETE A GOHU -->

    <!-- INFORMAR PAGO -->
    <!--
    <v-dialog v-model="dialogInformarPago" max-width="600px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="dialogInformarPago=false">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg">
          ¿Quieres informar el pago de este comprobante?
        </span>
        <v-spacer></v-spacer>
        <v-btn
          :color="temas.cen_btns_bg"
          :dark="temas.cen_btns_dark==true"
          class="fg85 ma-2 white--text"
          @click="confirmarInformeDePago">
          Pagado
        </v-btn>
      </v-toolbar>
      <v-card tile class="fg">
        <v-card-text>
          <v-container>
            <p>
              <br>
              <b>Presiona en PAGADO para infomar el pago de este comprobante.</b><br>
              <b>Si quieres ingresar algún detalle decríbelo abajo.</b>
            </p>
            <v-container>
              <v-textarea
                class="fg pt-6"
                v-model="detInformeDePago"
                autofocus
                outlined
                :color="$store.state.temas.forms_titulo_bg"
                rows="5">
              </v-textarea>
            </v-container>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    -->
    <!-- FIN DIALOGO INFORMAR PAGO -->

    <!-- CAMBIAR DE LICENCIA -->
    <v-dialog
      v-model="dialogCambiarLicencia" max-width="600px" persistent
        :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="dialogCambiarLicencia=false">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg">
          Cambio de Licencia <b>gohu</b>
        </span>
        <v-spacer></v-spacer>
        <v-btn
          :color="temas.cen_btns_bg"
          :dark="temas.cen_btns_dark==true"
          class="fg85 ma-2 white--text"
          @click="confirmarCuentaAGohu">
          Confirmar
        </v-btn>
      </v-toolbar>
      <v-card tile class="fg">
        <v-card-text>
          <v-container>
            <p>
              <br>
              Tu licencia actual es <b>{{ licenciaActual(this.$store.state.tipo) }}</b>
              <span v-if="exclusivoDe.id!=null">
                  y eres Cliente exclusivo de <b>{{ exclusivoDe.username }}</b>
              </span>
              <br><br>
              Revisa el apartado <b>Ayuda</b> / <b>Licencias</b>
              para ver las especificaciones de cada una.
              <br><br>
              Cambiar a...
              <v-radio-group
                v-model="licenciaACambiar">
                <v-radio
                  :disabled="tipo=='CO'"
                  :color="temas.forms_titulo_bg"
                  label="gohu ERP Completo (CO)"
                  value="CO">
                </v-radio>
                <v-radio
                  :disabled="tipo=='ME'"
                  :color="temas.forms_titulo_bg"
                  label="gohu ERP Medio (ME)"
                  value="ME">
                </v-radio>
                <v-radio
                  :disabled="tipo=='BA'"
                  :color="temas.forms_titulo_bg"
                  label="gohu ERP Básico (BA)"
                  value="BA">
                </v-radio>
                <v-radio
                  :disabled="tipo=='PP'&&exclusivoDe.id==null"
                  :color="temas.forms_titulo_bg"
                  label="Precios y Pedidos (PP)"
                  value="PP">
                </v-radio>
                <v-radio
                  :color="temas.forms_titulo_bg"
                  label="Desactivar Licencia"
                  value="DL">
                </v-radio>
              </v-radio-group>
              <br><br>
            </p>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN CAMBIAR A GOHU -->

    <!-- COTIZACIONES DEL DOLAR -->
    <v-dialog v-model="dialogCotizaciones" max-width="450px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="dialogCotizaciones=false">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg">
          Cotización del Dolar
        </span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card class="fg">
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="headersCot"
              :items="cotDolar"
              dense
              :hide-default-footer="true">
            </v-data-table>
          </v-container>
        </v-card-text>
        <v-card-text>

          <v-row>
            <v-col cols="12">
              <v-select class="fg pl-2" outlined
                label="Ventas por..."
                v-model="filtroVenta_id"
                :items="filtrosVentas"
                :color="$store.state.temas.forms_titulo_bg"
                @change="filtroPorVentas()">
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headersStatics"
                :items="ventasFil"
                dense
                :hide-default-footer="true">
                <template v-slot:item.cpr="{ item }">
                  {{ item.cpr.substring(0,5) }}
                </template>
                <template v-slot:item.ctt="{ item }">
                  {{ formatoImporte(item.ctt) }}
                </template>
                <template v-slot:item.total="{ item }">
                  ${{ formatoImporte(item.total) }}
                </template>
              </v-data-table>
            </v-col>
          </v-row>

        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN COTIZACIONES DEL DOLAR -->

    <!-- ADMINISTRACION DE VINCULOS CON USUARIOS -->
    <v-dialog v-model="dialogUsuarios" :fullscreen="true" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeUsuarios"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg text--right">Vínculos {{empresa}}</span>
        </v-toolbar>
        <v-row>
          <v-col cols="3" sm="3" md="3">
            <v-card flat class="fg ml-0 mt-0 text-center">
              <v-card-text class="pt-2 pb-0 pl-0 text--primary">
                <div>
                  <v-tooltip v-for="(vp, i) in vinculosTipo" v-bind:key="i" bottom>
                    <template v-slot:activator="{ on }">
                      <v-chip
                        class="ml-3 ma-2"
                        :color="vinculosAVerCualTipo==i+1 ? 'red' : temas.forms_titulo_bg"
                        dark
                        @click="vinculosVerTipo(i+1)" v-on="on">
                        {{ i==0?'Clientes':'Proveedores' }}
                      </v-chip>
<!--
                      <v-btn
                        fab small class="ml-10 mt-2"
                        :color="vinculosAVerCualTipo==i+1 ? 'red' : temas.forms_titulo_bg"
                        :dark="temas.forms_titulo_dark==true"
                        @click="vinculosVerTipo(i+1)" v-on="on">
                        <v-icon medium class="mr-0">
                          {{vinculosTipo[i].icono}}
                        </v-icon>
                      </v-btn>
-->
                    </template>
                    <span>{{vinculosTipo[i].toolTip}}</span>
                  </v-tooltip>
                </div>
              </v-card-text>
              <v-card-text class="pt-2 pb-4 pl-0 caption text--primary">
                <div class="text-left">
                  <v-tooltip v-for="(vp, i) in vinculosPanel" v-bind:key="i" bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab small class="ml-10 mt-2"
                        :color="vinculosAVerCual==i+1 ? 'red' : temas.forms_titulo_bg"
                        :dark="temas.forms_titulo_dark==true"
                        @click="vinculosVer(i+1)" v-on="on">
                        <v-badge
                          :content="vinculosPanel[i].ctt"
                          :value="vinculosPanel[i].ctt"
                          :color="temas.forms_btn_add_bg"
                          :dark="temas.forms_btn_add_bg==true">
                          <v-icon medium class="mr-0">
                            {{vinculosPanel[i].icono}}
                          </v-icon>
                        </v-badge>
                      </v-btn>
                    </template>
                    <span>{{vinculosPanel[i].toolTip}}</span>
                  </v-tooltip>
                </div>
              </v-card-text>
              <v-divider class="mx-1"></v-divider>
              <v-card-subtitle>
                <span class="fg120 font-weight-light ml-2">Filtrar por Rubros</span>
              </v-card-subtitle>
              <v-card-text class="pt-0 pb-0 pl-0 text--primary">
                <div class="text-left" v-if="rubros.length>0">
                  <v-chip-group column multiple>
                    <v-chip v-for="(rub, i) in rubros" :key="i"
                      class="ml-3 ma-1 fg85" outlined multiple
                      @click="filtrarPorRubro(rub)">
                      {{ rub.nombre }}
                      <v-avatar v-if="rub.sel">
                        <v-icon>mdi-checkbox-marked-circle</v-icon>
                      </v-avatar>
                    </v-chip>
                  </v-chip-group>
                </div>
              </v-card-text>
              <v-card-subtitle>
                <span class="fg120 font-weight-light ml-2">Filtrar por Ubicación</span>
              </v-card-subtitle>
              <v-card-text class="pt-0 pb-0 pl-0 text--primary">
                <div class="text-left" v-if="ubicaciones.length>0">
                  <v-chip-group column multiple>
                    <v-chip v-for="(ubi, i) in ubicaciones" :key="i"
                      class="ml-3 ma-1 fg85" outlined multiple
                      @click="filtrarPorUbicacion(ubi)">
                      {{ ubi.nombre }}
                      <v-avatar v-if="ubi.sel">
                        <v-icon>mdi-checkbox-marked-circle</v-icon>
                      </v-avatar>
                    </v-chip>
                  </v-chip-group>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="9" sm="9" md="9">
            <v-card flat class="pt-2">
              <v-row>
                <v-col cols="4" class="fg120 pl-9 font-weight-light">
                  <span>
                    {{vinculosTipo[vinculosAVerCualTipo-1].toolTip}}
                    {{vinculosPanel[vinculosAVerCual-1].toolTip}}
                  </span>
                </v-col>
                <v-col cols="3" class="pt-2">
<!--
                  <v-chip v-if="vinculosAVerCual==1&&usuarios.length>1"
                    class="ml-3 ma-2" outlined
                    @click="usuariosDejarDeVer">
                    Pasar a {{'\xa0'}}<b>Descartados</b>{{'\xa0'}} a {{ usuarios.length}} usuario/s
                  </v-chip>
-->
                  <v-text-field
                    v-model="searchUsr" clearable
                    append-icon="search"
                    label="Buscar Usuario"
                    :color="temas.forms_titulo_bg"
                    class="fg pt-0"
                    single-line hide-details
                    @keyup="buscarUsuario"
                    @click:clear="clearBuscarUsuario">
                  </v-text-field>
                </v-col>
                <v-col cols="3" class="pt-2">
                  <v-chip v-if="vinculosAVerCual==1&&usuarios.length>1"
                    class="ml-0 ma-2 fg" outlined
                    @click="usuariosDejarDeVer">
                    Pasar {{ usuarios.length}} usuario/s a{{'\xa0'}}<b>Descartados</b>
                  </v-chip>
                  <v-chip v-else-if="vinculosAVerCual==3&&usuarios.length>1"
                    class="ml-0 ma-2 fg" outlined
                    @click="usuariosVerDeNuevo">
                    Pasar {{ usuarios.length }} usuarios a{{'\xa0'}}<b>a Vincular</b>
                    <!--
                    {{'\xa0'}}<b>a Vincular</b>{{'\xa0'}} a {{ usuarios.length }} usuarios
                    -->
                  </v-chip>
                </v-col>
              </v-row>

              <v-row v-if="usuarios.length>0">
                <v-col cols="6">
                  <template>
                    <div class="mt-0 text-left">
                      <v-row>
                        <v-col cols="12">
                          <v-pagination
                            v-model="pagina"
                            :length="Math.ceil(usuarios.length / perPage)"
                            :color="temas.barra_principal_bg"
                            :total-visible="10">
                          </v-pagination>
                        </v-col>
                      </v-row>
                    </div>
                  </template>
                </v-col>
              </v-row>

              <v-row>
                <v-col v-for="(us, i) in visiblePages" v-bind:key="i" class="ml-0 mr-0">

                  <div class="contenedor-galeria">
                    <v-hover v-slot="{ hover}">
                      <v-card class="mx-auto my-0 ml-2" max-width="160"
                        :elevation="hover ? 12 : 1"
                        open-delay="200"
                        :class="{ 'on-hover': hover }">

                          <v-img height="90" width="160"
                            :src="`/images/${us.logotipo}`">
                          </v-img>
                          <div class="ml-4 pt-3 mt-3">
                            <span class="fg">
                              {{us.username}}
                              <v-badge class="pb-1" v-if="us.ctt>0"
                                :content="us.ctt"
                                :value="us.ctt"
                                color='green'
                                rigth>
                              </v-badge>
                            </span>
                          </div>

                        <!--
                        <v-toolbar
                          :color="us.pausado?'black':temas.barra_principal_bg"
                          dark
                          height="50">
                          <v-toolbar-title>
                            {{us.username}}
                          </v-toolbar-title>
                          <v-badge class="pb-1" v-if="us.ctt>0"
                            :content="us.ctt"
                            :value="us.ctt"
                            color='green'
                            rigth>
                          </v-badge>
                        </v-toolbar>
                        -->

                        <template slot="progress"></template>
                        <v-card-text class="pt-3 pb-0 pl-4 fg70 text--primary">

                          <!--
                          <div>
                            <span v-for="(rub, r) in us.usersrubros" v-bind:key="r"
                              class="pt-1 pb-2">
                              <v-chip small>{{ rub.nombre }}</v-chip>
                            </span>
                          </div>
                          -->

                          <div class="pt-0 pb-0">
                            <span class="pl-0">
                              <b>{{ getEstadoDelVinculo(us) }} </b><br>
                            </span>
                          </div>

                          <div class="pt-0 pb-0">
                            <b>
                              {{ us.distribuidor==1?'Mayorista':'Minorista' }} -
                              {{ us.tipo }}
                              {{ us.administragohu ? '(g)' : '' }}
                            </b>
                            <br>
                          </div>

                          <div class="pt-0 pb-0" v-if="us.exclusivo">
                            <span class="pl-0">
                              <b>
                                <v-icon small color="yellow">
                                  mdi-star
                                </v-icon>
                                <v-chip
                                  :color='temas.barra_principal_bg'
                                  dark
                                  x-small>
                                  Exclusivo
                                </v-chip>
                              </b>
                            </span>
                          </div>

                          <div>
                            <span v-if="us.solicitud==1"
                              color='red'>
                              {{ us.mensaje }}{{us.esElQue}}
                            </span>
                          </div>
                        </v-card-text>
                        <v-card-actions>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioMasInformacion(us)" v-on="on">
                                <v-icon>mdi-information-outline</v-icon>
                              </v-btn>
                            </template>
                            <span class="fg">Mas información</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show="us.ver==1 && us.solicitud==0 && us.vinculado==0"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioSolicitarVinculo(us)" v-on="on">
                                <v-icon>
                                  {{'mdi-share-variant'}}
                                </v-icon>
                              </v-btn>
                            </template>
                            <span class="fg">
                              {{'Solicitar vínculo'}}
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom v-if=
                            "us.esElQue=='Recibe' && us.vinculado==0 && us.solicitud==1">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioAceptarVinculo(us)" v-on="on">
                                <v-icon>mdi-share-variant</v-icon>
                              </v-btn>
                            </template>
                            <span class="fg">Aceptar Vínculo</span>
                          </v-tooltip>
                          <v-tooltip bottom v-if=
                            "us.esElQue=='Recibe' && us.vinculado==0 && us.solicitud==1">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioRechazarVinculo(us)" v-on="on">
                                <v-icon>mdi-cancel</v-icon>
                              </v-btn>
                            </template>
                            <span class="fg">Rechazar Vínculo</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show="us.vinculado==1 && us.ver==1"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioCancelarVinculo(us)" v-on="on">
                                <v-icon>mdi-cancel</v-icon>
                              </v-btn>
                            </template>
                            <span class="fg">Cancelar vínculo</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show="us.ver==1 && us.vinculado==0 && us.solicitud==0"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioDejarDeVer(us)" v-on="on">
                                <v-icon>mdi-pin-off</v-icon>
                              </v-btn>
                            </template>
                            <span class="fg">Descartar</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show="us.ver==0"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioVerDeNuevo(us)" v-on="on">
                                <v-icon>mdi-account-plus</v-icon>
                              </v-btn>
                            </template>
                            <span class="fg">Ver de nuevo</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show=
                                "us.vinculado==1&&us.activo==1&&us.pausado==0"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioPausarVinculo(us)" v-on="on">
                                <v-icon>mdi-pause</v-icon>
                              </v-btn>
                            </template>
                            <span class="fg">Pausar Vínculo
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show=
                                "us.vinculado==1&&us.activo==1&&us.pausado==1"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioReanudarVinculo(us)" v-on="on">
                                <v-icon>mdi-play</v-icon>
                              </v-btn>
                            </template>
                            <span class="fg">Reanudar Vínculo
                            </span>
                          </v-tooltip>
                        </v-card-actions>
                      </v-card>
                    </v-hover>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <!-- FIN DE ADMINISTRACION DE VINCULOS CON USUARIOS -->

    <!-- SOLICITAR NUEVO VINCULO -->
    <v-dialog v-model="dialogSolicitarVinculo" max-width="600px" persistent
      :transition="transition==null?'false':transition">
      <v-card class="fg">
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeSolicitarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">
            {{'Vincularse'}}
            con {{nuevoVinculo.username}}</span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text"
            @click="enviarSolicitudVinculo">
            {{'Enviar Solicitud'}}
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-4">
                  <div class="pt-3">
                    ¿Que quieres que <b>{{nuevoVinculo.username}}</b> sea?<br>
                    <v-radio-group v-model="vincularComo" row>
                      <v-radio
                        label="Cliente" value="C" :color="temas.forms_titulo_bg">
                      </v-radio>
                      <v-radio
                        label="Proveedor" value="P" :color="temas.forms_titulo_bg">
                      </v-radio>
                      <!--
                      <v-radio
                        label="Ambos" value="A" :color="temas.forms_titulo_bg">
                      </v-radio>
                      -->
                    </v-radio-group>
                    <span v-if="vincularComo=='C'">
                      <b>{{nuevoVinculo.username}}</b> podrá acceder a tus Artículos,
                      Precios y Promociones, también te podrá realizar Pedidos.<br><br>
                    </span>
                    <span v-if="vincularComo=='P'">
                      Podrás acceder a los Artículos, Precios y Promociones de
                      <b>{{nuevoVinculo.username}}</b>, y también podrás realizarle
                      Pedidos.<br><br>
                    </span>
                    <span v-if="nuevoVinculo.tipo!='PP'&&tipo!='PP'">
                      Además se activará <b>intrapyme</b>, dónde
                      todas las operaciones de Ventas, Compras, Pagos, Cobranzas,
                      etc, irán por sistema.<br><br>
                    </span>
                    <!--
                      <span v-if="vincularComo=='A'">
                        Incluye a las dos opciones anteriores.
                      </span>
                    -->
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN SOLICITAR NUEVO VINCULO -->

    <!-- ACEPTAR NUEVO VINCULO -->
    <v-dialog v-model="dialogAceptarVinculo" max-width="500px" persistent
      :transition="transition==null?'false':transition">
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeAceptarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">
            Aceptar Vínculo con {{nuevoVinculo.username}}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text"
            @click="aceptarSolicitudDeVinculoHTTP">
            Aceptar Vínculo
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined class="fg">
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-3">
                  <p class="pt-3">
                    Confirma si quieres a <b>{{nuevoVinculo.username}}</b>
                    como un nuevo
                    <b>{{nuevoVinculo.rol=='P' ? 'Proveedor': 'Cliente'}}</b>
                  </p>
                  <div v-if="nuevoVinculo.rol=='P'">
                    <p v-if="tipo=='PP' && nuevoVinculo.tipo=='PP'">
                      Ambos son usuarios Precios y Pedidos.<br>
                      Podrás consultar sus artículos y realizarle pedidos.
                    </p>
                    <p v-else-if="tipo!='PP' && nuevoVinculo.tipo=='PP'">
                      <b>{{nuevoVinculo.username}}</b> ha seleccionado la licencia
                      <i>Precios y Pedidos</i>, no obstante podrás consultar sus artículos
                      y realizarle pedidos.
                    </p>
                    <p v-else-if="tipo=='PP' && !nuevoVinculo.tipo=='PP'">
                      Tu eres usuario <b>Precios y Pedidos</b> y {{nuevoVinculo.username}}
                      <b>gohu ERP</b><br>
                      Podrás consultar sus artículos y realizarle pedidos.
                    </p>
                    <p v-else-if="tipo!='PP' && !nuevoVinculo.tipo=='PP'">
                      Ambos son usuarios <b>gohu ERP</b><br>
                      Además de compartir artículos vas a activar
                      la versión <b>Intrapyme</b>,
                      dónde todas las operaciones entre ambos van por sistema.
                      Estas se sincronizan permitiendo ahorrar tiempo y evitar errores.
                    </p>
                  </div>
                  <div v-else>
                    <p v-if="tipo=='PP' && nuevoVinculo.tipo=='PP'">
                      <b>{{nuevoVinculo.username}}</b> es usuario <b>Precios y Pedidos</b><br>
                      podrá ver tu carrito, tus precios, tus promociones, realizarte
                      pedidos y recibir la listas de precios que quieras aplicarle.
                    </p>
                    <p v-else-if="tipo!='PP' && nuevoVinculo.tipo=='PP'">
                      <b>{{nuevoVinculo.username}}</b> ha seleccionado la licencia
                      <i>Precios y Pedidos</i>, no obstante podrá ver tu carrito, tus precios,
                      tus promociones, realizarte pedidos y recibir las listas de
                      precios que quieras aplicarle.
                    </p>
                    <p v-else-if="tipo=='PP' && !nuevoVinculo.tipo=='PP'">
                      <b>{{nuevoVinculo.username}}</b> es usuario <b>gohu ERP</b><br>
                      podrá ver tu carrito, tus precios, tus promociones, realizarte
                      pedidos y recibir las listas de precios que quieras aplicarle.
                    </p>
                    <p v-else-if="tipo!='PP' && nuevoVinculo.tipo!='PP'">
                      Ambos son usuarios <b>ERP</b><br>
                      Además de compartir tus artículos, vas a activar
                      la versión <b>Intrapyme</b>,
                      donde todas las operaciones entre ambos van por sistema.
                      Estas se sincronizan permitiendo ahorrar tiempo y evitar
                      errores.
                    </p>
                  </div>
                  <p v-if="nuevoVinculo.rol=='H'">
                    IMPORTANTE: El sistema va a asignar a este cliente el primero de tus tres
                    precios sugeridos, que podrás modificar luego en la ficha de Clientes,
                    si así lo crees necesario.<br>
                  </p>
                  <p v-else-if="transferirArticulosCtt>0">
                    Si confirmas, tendrás acceso a sus {{transferirArticulosCtt}} artículos.
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN ACEPTAR NUEVO VINCULO -->

    <!-- RECHAZAR VINCULO -->
    <v-dialog v-model="dialogRechazarVinculo" max-width="500px" persistent
      :transition="transition==null?'false':transition">
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeRechazarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">
            Rechazar Vínculo con {{nuevoVinculo.username}}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="detRechazo.length>255"
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text"
            @click="rechazarSolicitudDeVinculoHTTP">
            Rechazar
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <span class="fg pt-4">Puedes informar el motivo del rechazo.</span>
          <v-card outlined flat class="fg">
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-3">
                  <v-textarea
                    class="fg pt-6"
                    v-model="detRechazo"
                    autofocus
                    outlined
                    :color="$store.state.temas.forms_titulo_bg"
                    rows="5"
                    :rules="max255"
                    counter>
                  </v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN RECHAZAR VINCULO -->

    <!-- AVISO PARA USUARIOS EXCLUSIVOS -->
    <v-dialog v-model="dialogAvisoAExclusivos" max-width="450px" persistent
      :transition="transition==null?'false':transition">
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="dialogAvisoAExclusivos=false"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">
            ¡Ser exclusivo a veces, tiene sus desventajas!
          </span>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <span class="fg pt-4">
            <br>Ser <i>usuario exclusivo</i> deshabilita la característica
            <b>Vinculaciones</b>.<br><br>
            Cambia de Licencia y aprovecha esta potente herramienta
            que te facilitará sustancialmente tu operatoria comercial.<br><br>
            Te invitamos que leas nuestra documentación<br>
            en <i>Ayuda y Tutoriales</i> del menú principal.<br><br>
            <v-btn outlined class="text-none" @click="noVerMasElMensajeInicial()">
              ¡Cerrar y no ver mas este mensaje!
            </v-btn>
            <br><br>
          </span>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN RECHAZAR VINCULO -->

    <!-- NUEVOS VICULOS ACEPTADOS -->
    <v-dialog v-model="dialogVinOk" width="500"
      :transition="transition==null?'false':transition">
      <!--
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red lighten-2" dark v-bind="attrs" v-on="on">
          Click Me
        </v-btn>
      </template>
      -->
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeNueVinOk"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg text--right">Nuevos Vínculos Aceptados</span>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col v-for="(us, i) in notVinOk" v-bind:key="i" class="ml-4 mr-4">
              <div class="contenedor-galeria">
                <v-hover v-slot="{ hover}">
                  <v-card tile class="mx-auto my-6 ml-2" max-width="200"
                    :elevation="hover ? 12 : 1"
                    open-delay="200"
                    :class="{ 'on-hover': hover }">
                    <v-img height="90" width="200"
                      :src="`/images/${us.userdesde.logotipo}`">
                    </v-img>
                    <template slot="progress"></template>
                    <v-card-subtitle>
                      <b>¡{{us.userdesde.username}}</b> ha aceptado tu solicitud de vínculo!
                    </v-card-subtitle>
                    <v-divider class="fg70"></v-divider>
                    <v-card-actions>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            fab x-small outlined
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true"
                            class="mr-1 ml-1 mt-0"
                            @click="leido(us,3)" v-on="on">
                            <v-icon>mdi-thumb-up</v-icon>
                          </v-btn>
                        </template>
                        <span class="fg">Ok</span>
                      </v-tooltip>
                    </v-card-actions>
                  </v-card>
                </v-hover>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
    <!-- FIN NUEVOS VINCULOS ACEPTADOS -->

    <!-- NUEVOS VICULOS RECHAZADOS -->
    <v-dialog v-model="dialogVinRech" width="500"
      :transition="transition==null?'false':transition">
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeNueVinculoRechazados"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg text--right">Vínculos no aceptados</span>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col v-for="(us, i) in notVinRech" v-bind:key="i" class="ml-4 mr-4">
              <div class="contenedor-galeria">
                <v-hover v-slot="{ hover}">
                  <v-card tile class="mx-auto my-6 ml-2" max-width="200"
                    :elevation="hover ? 12 : 1"
                    open-delay="200"
                    :class="{ 'on-hover': hover }">
                    <v-img height="90" width="200"
                      :src="`/images/${us.userdesde.logotipo}`">
                    </v-img>
                    <template slot="progress"></template>
                    <v-card-subtitle>
                      {{us.detalles}}
                    </v-card-subtitle>
                    <v-divider class="fg70"></v-divider>
                    <v-card-actions>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            fab x-small outlined
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true"
                            class="mr-1 ml-1 mt-0"
                            @click="leido(us,4)" v-on="on">
                            <v-icon>mdi-thumb-up</v-icon>
                          </v-btn>
                        </template>
                        <span class="fg">Ok</span>
                      </v-tooltip>
                    </v-card-actions>
                  </v-card>
                </v-hover>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
    <!-- FIN VINCULOS RECHAZADOS -->

    <!-- CANCELAR VINCULO -->
    <v-dialog v-model="dialogCancelarVinculo" max-width="500px" persistent
      :transition="transition==null?'false':transition">
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeCancelarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="fg">Cancelar Vínculo con {{nuevoVinculo.username}}</span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 fg" @click="cancelarVinculo">
            Cancelar Vínculo
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0 fg">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0">
                  <p class="pt-3">
                    <br>Vas a cancelar el vínculo comercial con
                    <b>{{nuevoVinculo.username}}</b>.<br>
                  </p>
                  <p>
                    Los Artículos, precios y promociones dejarán de ser visibles,<br>
                    y las operaciones <b>Intrapyme</b> que existan permanecerán
                    activas.<br><br>
                    Podrás retomar este vínculo en cualquier momento cuando lo creas necesario.
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN CANCELAR VINCULO -->

    <!-- ACEPTAR PAUSAR VINCULO -->
    <v-dialog v-model="dialogPausarVinculo" max-width="650px" persistent
      :transition="transition==null?'false':transition">
      <v-card class="fg">
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closePausarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Pausar Vínculo</span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text" @click="aceptarPausarVinculo">
            Aceptar Pausar Vínculo
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0">
                  <p class="pt-3">
                    <br>Vas a pausar el vínculo con
                    <b>{{nuevoVinculo.username}}</b>.<br>
                  </p>
                  <div v-if="nuevoVinculo.rol=='P'">
                    <p>
                      Dejarás de ver sus artículos y promociones y tampoco podrás realizarle
                      más pedidos.<br>
                    </p>
                  </div>
                  <div v-else>
                    <p>
                      No podrá ver más tus Artículos ni realizarte pedidos.<br>
                    </p>
                  </div>
                  <p>No obstante, podrás retomar este vínculo cuando lo creas necesario.</p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN PAUSAR VINCULO -->

    <!-- ACEPTAR REANUDAR VINCULO -->
    <v-dialog v-model="dialogReanudarVinculo" max-width="650px" persistent
      :transition="transition==null?'false':transition">
      <v-card class="fg">
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeReanudarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Reanudar Vínculo</span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text" @click="aceptarReanudarVinculo">
            Aceptar Reanudar Vínculo
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0">
                  <p class="pt-3">
                    <br>Vas a reanudar el vínculo con
                    <b>{{nuevoVinculo.username}}</b>.<br>
                  </p>
                  <div v-if="nuevoVinculo.rol=='P'">
                    <p>
                      Podrás volver a ver y utilizar sus Artículos y promociones.<br>
                      Y también volver a hacerle pedidos.<br>
                    </p>
                  </div>
                  <div v-else>
                    <p>
                      <b>{{nuevoVinculo.username}}</b> podrá volver a ver tus Artículos
                      y a realizarte pedidos.<br>
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN REANUDAR VINCULO -->

    <!-- MAS INFORMACION -->
    <v-dialog v-model="dialogMasInformacion" max-width="700px" persistent
      :transition="transition==null?'false':transition">
      <v-card class="fg">
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeMasInformacion"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Información sobre {{nuevoVinculo.username}}</span>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0 pb-2">
                  <p class="mt-2 pb-2 pt-3">
                    Razón Social: <b>{{masInfo.razonSocial}}</b><br>
                    Dirección: <b>{{masInfo.direccion}}</b><br>
                    Localidad: <b>{{masInfo.localidad}}</b><br>
                    Provincia: <b>{{masInfo.provincia}}</b><br>
                    Tipo de Responsable: <b>{{masInfo.tipoDeResponsable}}</b><br>
                    CUIT: <b>{{masInfo.cuit}}</b><br>
                    Tipo de Licencia: <b>{{licenciaActual(masInfo.tipoDeLicencia)}}</b>
                    <br><br>
                    <b>Contactos</b>
                    <table>
                      <tr v-for="(contacto, idd) in masInfo.contactos" v-bind:key="idd">
                        <td><v-icon>{{contacto.contactoTipo.icono}}</v-icon></td>
                        <td>{{contacto.observaciones}}</td>
                      </tr>
                    </table>
                    <br>
<!--
                    <b>Descuentos por Medios de Pago</b>
                    <table>
                      <tr v-for="(medio, idd) in masInfo.mediosdecobro" v-bind:key="idd">
                        <td>{{medio.observ}}</td>
                      </tr>
                    </table>
                    <br>
-->
                    En gohu desde el:
                    <b>{{desdeEnGohu()}}</b> ({{diasEnGohu()}} días)<br>
                    Usuarios Vinculados: <b>{{masInfo.cttUsrsVinculados}}</b><br>
                    Artículos: <b>{{masInfo.cttArticulos}}</b><br>
                    <br>
                    Pedidos Procesados: <b>{{masInfo.cttPedidos}}</b><br>
                    Calificación: <b>{{roundTo(masInfo.calificacion,1)}}</b><br>
                    Comercializa mayormente como:
                    <b>{{ masInfo.distribuidor?'Mayorista':'Minorista' }}</b><br>
                    Observaciones: <b>{{masInfo.observ}}</b><br>
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN MAS INFORMACION -->

    <!-- ESTADO FINANCIERO -->
    <v-dialog v-model="dialogEstadoFinanciero" max-width="900px" persistent
      :transition="transition==null?'false':transition">
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon
          @click="dialogEstadoFinanciero=false"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="fg">Estado Financiero</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile class="fg">
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="headersEstadoFinanciero"
              :items="estFinDia"
              dense
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              show-expand
              item-key="vencimiento"
              :hide-default-footer="false"
              :footer-props="{
                itemsPerPageOptions: [13],
                showFirstLastPage: true,
                showCurrentPage: true,
                nextIcon: 'mdi-arrow-right-drop-circle-outline',
                prevIcon: 'mdi-arrow-left-drop-circle-outline',
              }">
              <template v-slot:item.debe="{ item }">
                $ {{ formatoImporte(item.debe) }}
              </template>
              <template v-slot:item.haber="{ item }">
                $ {{ formatoImporte(item.haber) }}
              </template>
              <template v-slot:item.saldo="{ item }">
                $ {{ formatoImporte(item.saldo) }}
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-data-table
                    :headers="headersEstadoFinancieroDet"
                    :items="item.items"
                    dense
                    hide-default-footer>
                    <template v-slot:item.importe="{ item }">
                      $ {{ formatoImporte(item.importe) }}
                    </template>
                    <template v-slot:item.acumulado="{ item }">
                      $ {{ formatoImporte(item.acumulado) }}
                    </template>
                    <template v-slot:item.vencimiento="{ item }">
                      {{ formatoFechaCorta(item.vencimiento) }}
                    </template>
                    <template v-slot:item.tercero="{ item }">
                      {{ item.tercero.substring(0,25) }}
                    </template>
                    <template v-slot:item.descripcion="{ item }">
                      <v-badge class="pb-1"
                        dot
                        :color="item.importe>0?'green':'red'"
                        :dark="item.importe<0?
                        temas.cen_card_activo_dark:
                        temas.barra_principal_dark"
                        rigth>
                      </v-badge>
                      <span class="pl-3">{{item.descripcion}}</span>
                    </template>
                  </v-data-table>
                </td>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN ESTADO FINANCIERO -->

    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>

    <!-- USUARIOS GOHU -->
    <v-card v-if="!isLoggedIn&&!estoyEnLogin" flat>
      <v-container fluid class="pt-0">
        <v-row class="pt-0">
          <v-col cols="4"></v-col>
          <v-col cols="4">
            <v-img class="pt-0 mx-auto"
              height="125"
              width="200"
              src="/images/logoGoHu.jpg">
            </v-img>
          </v-col>
          <v-col cols="4"></v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <p class="bigfont text-md-center">
              <v-icon>mdi-share-variant</v-icon>
              Comparte, unifica y ahorra tiempo con <b>gohu</b>.<br><br>
              <b>gohu</b> es un sistema de gestión comercial
              <i>que trabaja en modo Red Social.</i><br>
              Te podrás <b><i>vincular</i></b> con tus Clientes y Proveedores.<br>
              ¡Ver artículos, precios y promociones de tus Proveedores...<br>
              y tus Clientes ver los tuyos!<br>
              Las operaciones también se comparten,<br>
              se sincronizan y quedan espejadas.<br>
              <b>¡y todo en tiempo real!</b><br><br>
              <b>¡Vincúlate!</b> y has que comience la magia.<br>

              <!--
              Share, unify and save time in your business.<br><br>
              gohu is a business management system that works in Social Network mode.<br>
              You can connect with your Customers and Suppliers.<br>
              See articles, prices and promotions from your Suppliers<br>
              and your Clients see yours!<br>
              Operations are also shared.<br>
              Orders, Invoices, Remittances, Payments and Receipts<br>
              They are synchronized between users, leaving them mirrored.<br>
              and all in real time!<br>
              -->

              <!--Un ERP que te va a permitir agilizar tus procesos de negocios.<br>-->
<!--          <a href="https://www.youtube.com">Revisa nuestros videos aquí,</a>
              quizás <b>gohu</b> pueda ser de tu utilidad.    -->
            </p>
          </v-col>
          <v-col cols="3"></v-col>
        </v-row>
      </v-container>
    </v-card>
    <impresiones ref="impresion"></impresiones>
    <SBar></SBar>
    <confirmacion v-model='msg.msgAccion'
      :title=this.msg.msgTitle
      :body=this.msg.msgBody
      :visible=this.msg.msgVisible
      :buttons=this.msg.msgButtons
      @click="msgRespuesta">
    </confirmacion>

  </v-app>
</template>

<script>
  /* eslint-disable */
  import HTTP from './http';
  import axios from 'axios';
  import SBar from './views/Forms/snackbar.vue';
  import confirmacion from "./views/Forms/confirmacion.vue";
  import impresiones from "./views/Forms/impresiones.vue";
  import moment from 'moment';
  import XLSX from 'xlsx';
  import jsPDF from 'jspdf';
  import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
  import router from './router';

  export default {
    components: {
      SBar,
      confirmacion,
      impresiones,
    },
    props: {
      source: String,
      },
    data: () => ({

      statics: [],
      filtrosVentas: ['Hoy','Semana','Semana Anterior','Mes','Mes Anterior','Bimestre','Trimestre','Cuatrimestre','Semestre','Año','Total'],
      filtroVenta_id: 0,
      ventasFil: [],

      message: '<b>HELLO</b>asdasd',
      pagina: 1,
      perPage: 10,
      searchUsr: null,
      searchUsrsMensajes: '',
      vincularComo: 'C',
      licenciaACambiar: 'CO',
      alqDol: 0,
      msg: {
        msgAccion: null,
        msgVisible: false,
        msgTitle: '',
        msgBody: '',
        msgButtons: ['']
      },
      estoyEnLogin: false,
      //menuNotUsrsNot: [ 
      //  {icon: 'mdi-qrcode', say: 'artículos', nov: 0 },
      //  {icon: 'mdi-share-variant', say: 'vínculos', nov: 0 },
      //  {icon: 'mdi-message-text-outline', say: 'mensajes', nov: 0 },
      //],
      mensajeTexto: '',
      mensajeUsers: [],
      mensajeUsersSel: [],
      searchUsers: '',
      searchUsersMensaje: '',

      chqRzdo: {
        observ: '',
      },

      usuarios: [],
      usuariosBkp: [],
      rubros: [],
      ubicaciones: [],
      selectedItem: 0,
      footerProps: {'items-per-page-options': [10]},
      footerProps13: {'items-per-page-options': [13]},
      vinculosPanel: [
        {ctt: 0, toolTip: 'a Vincular',  icono: 'mdi-account-plus' },
        {ctt: 0, toolTip: 'Vinculados',  icono: 'mdi-share-variant' },
        {ctt: 0, toolTip: 'Descartados', icono: 'mdi-pin-off' },
        {ctt: 0, toolTip: 'Solicitudes', icono: 'mdi-human-greeting' },
      ],
      vinculosTipo: [
        {ctt: 0, toolTip: 'Clientes', icono: 'mdi-airplane-takeoff'},
        {ctt: 0, toolTip: 'Proveedores', icono: 'mdi-airplane-landing'}
      ],
      vinculosPadresLoc: [],
      vinculosHijosLoc: [],
      vinculosAVerCual: 1,
      vinculosAVerCualTipo: 1,

      itemActual: null,
      itemActualPago: null,
      cotDolar: [],
      yaLeyoElDolar: false,
      notUsrs: [],
      cttPedidosGlobales: 0,
      notPed: [],
      notCprs: [],
      notGohu: [],
      notVinOk: [],
      notVinRech: [],
      articulos: [],
      pendientes: [],
      cancelaciones: [],
      valoresEgresos: [],
      gohu: [],
      estFin: [],
      estFinDia: [],
      expanded: [],
      singleExpand: false,
      detRechazo: '',
      detInformeDePago: '',
      compartiendo: 0,
      drawer: false,
      dialogNotCprs: false,
      dialogNotUsrs: false,
      dialogNotGohu: false,
      dialogUsuarios: false,
      dialogVerValores: false,
      dialogVerArticulos: false,
      dialogVerPendientes: false,
      dialogVerCancelaciones: false,
      dialogRechazarCpr: false,
    //dialogUneteAGohu: false,
      dialogInformarPago: false,
      dialogCotizaciones: false,
      dialogCambiarLicencia: false,
      dialogMensajes: false,
      dialogSolicitarVinculo: false,
      dialogAceptarVinculo: false,
      dialogRechazarVinculo: false,
      dialogCancelarVinculo: false,
      dialogVinOk: false,
      dialogVinRech: false,
      dialogPausarVinculo: false,
      dialogReanudarVinculo: false,
      dialogMasInformacion: false,
      dialogEstadoFinanciero: false,
      dialogAvisoAExclusivos: false,
      dialogVerChequeRechazado: false,
      transferirArticulosCtt: 0,

      barra_principal_bg: '',
      barra_principal_color: '',
      barra_principal_dark: '',
      barra_lateral_bg: '',
      barra_lateral_color: '',
      barra_lateral_dark: '',
      sucursalId: '',
      sucursalNombre: '',
      sucItems: [],
      contador: 0,
      contadorPub: 0,
      contadorGohu: 0,
      resMeses: [],

      nuevoVinculo: {
        vinculo_id: null,
        user_id: null,
        username: null,
        logotipo: null,
        ver: null,
        articulos: null,
        reventa: null,
        vinculado: null,
        solicitud: null,
        externo: null,
        activo: null,
        tipo: null,
        esElQue: null,
        notificacion_id: null,
        usersrubros: null,
        administragohu: null,
        rol: null,
      },
      masInfo: {
        razonSocial: '',
        direccion: '',
        localidad: '',
        provincia: '',
        tipoDeResponsable: '',
        tipoDeLicencia: '',
        cuit: '',
        calificacion: '',
        observ: '',
        enGohuDesdeEl: '',
        cttUsrsVinculados: '',
        cttArticulos: '',
        cttPedidos: '',
        contactos: [],
        mediosdecobro: [],
        distribuidor: false,
      },
      headersCot: [
        { text: 'Moneda', value: 'nombre', align: 'left', width: 100 },
        { text: 'Compra', value: 'compra', align: 'end', width: 80},
        { text: 'Venta', value: 'venta', align: 'end', width: 80},
      ],
      headersStatics: [
        { text: 'Comprobante', value: 'cpr', align: 'left', width: 100 },
        { text: 'Cantidad', value: 'ctt', align: 'end', width: 80},
        { text: 'Total', value: 'total', align: 'end', width: 80},
      ],
      headersArt: [
        { text: 'CODIGO', value: 'articulo.codigo', align: 'left', width: 120 },
        { text: 'DESCRIPCION', value: 'articulo.nombre', align: 'left', width: 420},
        { text: 'PRECIO', value: 'precio', align: 'end', width: 120},
        { text: 'CANTIDAD', value: 'cantidad', align: 'end', width: 120},
        { text: 'TOTAL', value:'total', align: 'end', width: 120},
      ],
      headersPend: [
        { text: 'FECHA', value: 'vencimiento', align: 'left', width: 120 },
        { text: 'IMPORTE', value: 'importe', align: 'end', width: 120},
        { text: 'PENDIENTE', value:'pendiente', align: 'end', width: 120},
      ],
      headersCan: [
        { text: 'FECHA', value: 'cancelado.comprobante.fecha', align: 'left', width: 120 },
        { text: 'COMPROBANTE', value: 'cancelado.comprobante.cpr', align: 'left', width: 420},
        { text: 'TOTAL', value: 'cancelado.importe', align: 'end', width: 120},
        { text: 'CANCELADO', value: 'importe', align: 'end', width: 120},
        { text: 'PENDIENTE', value: 'cancelado.pendiente', align: 'end', width: 120},
      ],
      headersEstadoFinanciero: [
        { text: 'FECHA', value: 'vencimiento', align: 'left', width: 89 },
        { text: 'DEBE', value: 'debe', align: 'end', width: 170},
        { text: 'HABER', value: 'haber', align: 'end', width: 170},
        { text: 'SALDO', value: 'saldo', align: 'end', width: 170},
      ],
      headersEstadoFinancieroDet: [
        //{ text: 'VENCIM.', value: 'vencimiento', align: 'left', width: 89 },
        { text: 'DESCRIPCION', value: 'descripcion', align: 'left', width: 140 },
        { text: 'COMPROBANTE', value: 'cpr', align: 'left', width: 210},
        { text: 'TERCERO', value: 'tercero', align: 'left', width: 250},
        { text: 'IMPORTE', value: 'importe', align: 'end', width: 170},
//      { text: 'ACUMULADO', value: 'acumulado', align: 'end', width: 170},
      ],
      headersMed: [
        { text: 'MED', value:'medio.abrev', align: 'left', width: 80},
        { text: 'OBSERVACIONES', value:'observ', align: 'left', width: 580},
        { text: 'FECHA', value: 'fecha',  align: 'left', width: 120 },
        { text: 'TOTAL', value:'importe', align: 'end',  width: 120},
      ],
      headersUsers: [
        { text: 'NOMBRE', value:'nombre', width: 250},
        { text: 'ZONA', value:'zona', width: 150},
      ],
      max255: [
        v => (v || '' ).length <= 255 || '255 caracteres como máximo'
      ],

    }),

    watch: {
      '$store.state.sucursal' () {
        //this.contador = 1
        this.contador  = 1
        this.contadorPub = 1
        this.contadorGohu = 1
        //this.actualizarContador()
      },
      '$store.state.proveedor' () {
        //this.cambioProveedor(this.$store.state.proveedor)
      },
      '$store.state.codigooid' () {
        this.headersArt[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
        this.headersArt[0].value = this.$store.state.codigooid == 'C'?'articulo.codigo':'articulo_id'
      }
    },

    mounted() {
      this.$store.commit('closeAlert', { root: true })
      this.$store.commit('setEnCarrito', false, { root: true });

      debugger
      this.headersArt[0].text = this.$store.state.codigooid == 'C'?'Código':'ID'
      this.headersArt[0].value = this.$store.state.codigooid == 'C'?'articulo.codigo':'articulo_id'

      debugger
      this.$vuetify.theme.dark = this.$store.state.dark;

      if (this.isLoggedIn) {
        debugger
        this.cambioSucursal(this.sucursales[this.sucursal])
      }
    },

    created() {
      //this.$store.commit('setOfertas', false, { root: true });
      var self=this;
      this.contador = 1
      setInterval(function(){ self.actualizarContador() },1000)
      var self=this;
      this.contadorGohu = 1;
      setInterval(function(){ self.actualizarContadorGohu() },1000)
      var self=this;
      setInterval(function(){ self.actualizoMoneda() },900000) // 15 minutos
      //this.$store.commit('setTemas', 'Invierno', { root: true });
    },

    computed: {
      ...mapGetters('authentication', [
        'isLoggedIn', 'userName', 'userId',
      ]),
      ...mapState([
        'dolar',
        'externo',
        'exclusivoDe',
        'operaciones',
        'inicial',
        'porrev',
        'novedadesCprs',
        'novedadesUsrs',
        'novedadesGohu',
        'datosEmpresa',
        'timeoutRefresh',
        'sucursal',
        'sucursales',
        'proveedor',
        'proveedores',
        'sucursalDemo',
        'sucursalFiscal',
        'tema',
        'temas',
        'logotipo',
        'notificaciones',
        'notificacionesgohu',
        'caja',
        'tipo',
        'articulosViculados',
        'empresa',
        'operario',
        'operarioUserId',
        'operarioEsVendedor',
        'operarioTerceroId',
        'operarioArea',
        'level',
        'porRem',
        'activo',
        'datosPanel',
        'vinculosPadres',
        'vinculosHijos',
        'roles',
        'contadorBloqueado',
        'enCarrito',
        'grupoCarrito',
        'avatar',
        'graficos',
        'graficosDatos',
        'turnos',
        'administraGOHU',
        'transition',
        'topeOperaciones',
        'topeArticulos',
        'topeVinculaciones',
        'dark',
      ]),
      visiblePages () {
        return this.usuarios.slice((this.pagina - 1)* this.perPage, this.pagina* this.perPage)
      },
      sayOperarioArea() {
        if (this.operarioArea=='V') {
          return 'Vendedor'
        } else if (this.operarioArea=='R') {
          return 'Repartidor'
        } else if (this.operarioArea=='X') {
          return 'Vendedor y Repartidor'
        } else if (this.operarioArea=='A') {
          return 'Admininistración'
        } else {
          return 'Supervisor'
        }
      },
    },

    methods: {
      ...mapActions('authentication', ['logout']),
      ...mapMutations
      ([
        'setDolar',
        'setNovedadesCprs',
        'setNovedadesUsrs',
        'setNovedadesGohu',
        'setSucursal',
        'setSucursales',
        'setProveedor',
        'setProveedores',
        'setSucursalFiscal',
        'setTimeoutRefresh',
        'setTema',
        'setTemas',
        'setLogotipo',
        'setNotificaciones',
        'setNotificacionesgohu',
        'setCaja',
        'setTipo',
        'setVinculosPadres',
        'setVinculosHijos',
        'setEmpresa',
        'setOperario',
        'setOperarioUserId',
        'setLevel',
        'setPorRem',
        'setActivo',
        'setDatosPanel',
        'setPublicaciones',
        'setContadorBloqueado',
        'setGraficos',
        'setGraficosDatos',
        'setInicial',

        'setVinculosPadresAll',
        'setVinculosPadresLic',
        'setDescuentos',

      ]),

      sayMessage(nota) {
        return nota.detalles
      },

      clearBuscarUsuario() {
        this.searchUsr = null
        this.vinculosVer(this.vinculosAVerCual)
        this.pagina = 1
      },

      clearSearchUsrsMensajes() {
        this.searchUsrsMensajes = null
      },

      buscarUsuario() {
        this.vinculosVer(this.vinculosAVerCual)
        this.pagina = 1
      },

//      buscarUsrsMensajes() {
//        this.mensajeUsersSel = this.mensajeUsers.filter(x=>x.nombre==this.searchUsrsMensajes)
//      },

      selectAll(event) {
        if (event.value) {
          this.mensajeUsersSel = this.mensajeUsers
        } else {
          this.mensajeUsersSel = []
        }
      },

      licenciaActual(cual) {
        if (cual=='CO') {
          return 'ERP Completo'
        } else if (cual=='ME') {
          return 'ERP Medio'
        } else if (cual=='BA') {
          return 'ERP Básico'
        } else if (cual=='PP') {
          return 'Precios y Pedidos'
        }
      },

/*
      actualizarContadorAlqDol() {
        if (moment().isoWeekday()>=6 && moment().isoWeekday()<=7) {
          this.alqDol = 0
        } else {
          let toDay = moment();
          let iniSem = moment().startOf('week');
          let dif = toDay.diff(iniSem, 'seconds');
          this.alqDol = this.formatoImporte(dif*0.06944445)
        }
      },
*/

      actualizarContador() {
        if (!this.isLoggedIn || this.$store.state.contadorBloqueado) { return }
        this.contador --
        let novCprs = 0
        let novUsrs = 0
        let novGohu = 0
        let compart = 0

        /*
          TODO VIENE POR NOTIFICACIONES 
          ESTAS SE DIVIDEN EN
          C -> NOTIFICACIONES DE COMPROBANTES
               objeto -> notCprs
               icono  -> campanita

          G -> NOTIFICACIONES PARA GOHU ( NUEVO USUARIO )
               objeto -> notGohu
               icono  -> gohu

          U -> NOTIFICACIONES DE NOVEDADES DE USUARIOS, NUEVOS ARTICULOS, MENSAJES, ETC.
               objeto -> notUsrs
               icono  -> mensajes

          VOK -> NOTIFICACIONES SOBRE VINCULOS ( ACEPTACION )
               objeto -> notVinOk
               icono  -> user+

          VRECH -> NOTIFICACIONES SOBRE VINCULOS ( RECHAZO )
               objeto -> notVinRech
               icono  -> user-
        */

        if (this.contador == 0) {

          if (this.exclusivoDe.id!=null&&this.$store.state.inicial) {
            this.dialogAvisoAExclusivos = true
          }

          this.contador = this.timeoutRefresh
          let n = []
          if (this.activo) { // && !this.operarioEsVendedor) { // && !this.operarioEsVendedor {

            return HTTP().post('/notificaciones', {id: this.userId, sucursal: this.sucursal}, {timeout: 20000} ).then(({ data }) => {
              let cttPed = 0
              let mismoTipoDeSucursal = false
              let agrego = false
              let cprvin = false
              this.notUsrs = []
              this.notCprs = []
              this.notGohu = []
              this.notVinOk = []
              this.notVinRech = []
              this.cttPedidosGlobales = 0

              if (data[0]!=undefined) {

                debugger
                data[0].respuesta.setVinculosPadres = data[0].respuesta.setVinculosPadres.filter(x=>x!=this.userId)
                data[0].respuesta.setVinculosHijos = data[0].respuesta.setVinculosHijos.filter(x=>x!=this.userId)
                this.$store.commit('setVinculosHijos', data[0].respuesta.setVinculosHijos, { root: true });
                this.$store.commit('setVinculosPadres', data[0].respuesta.setVinculosPadres, { root: true });
                this.$store.commit('setVinculosPadresAll', data[0].respuesta.setVinculosPadresAll, { root: true });
                this.$store.commit('setVinculosPadresLic', data[0].respuesta.setVinculosPadresLic, { root: true });
                this.$store.commit('setDescuentos', data[0].respuesta.setDescuentos, { root: true });

                for (let i=0; i<=data[0].not.length-1; i++) {
                  agrego = false    // solo los del mismo tipo de sucursal (fiscal / demo )
                  cprvin = false    // si tiene comprobante vinculado
                  mismoTipoDeSucursal = false
                  if (data[0].not[i].comprobante!=null) {
                    if (this.sucursalDemo === data[0].not[i].comprobante.sucursal.sucursaldemo) {
                      mismoTipoDeSucursal = true
                      agrego = true
                      cprvin = true
                    }
                  } else {
                    agrego = true
                  }
  
                  switch (data[0].not[i].tipo) {
                    case '?': // Mensaje
                      this.notUsrs.push(data[0].not[i])
                      novUsrs ++
                      break
                    case '*': // solicitud de vinculo aceptada (sin comprobante )
                      this.notVinOk.push(data[0].not[i])
                      break
                    case '/': // solicitud de vinculo rechazada (sin comprobante )
                      this.notVinRech.push(data[0].not[i])
                      break
                    case '+': // nuevo usuario ( sin comprobante )
                      novGohu ++
                      this.notGohu.push({ usuario: data[0].not[i], borrada: false })
                      break
                    case 'A': // artículos nuevos ( sin comprobante )
                      this.notUsrs.push(data[0].not[i])
                      novUsrs ++
                      break
                    case 'B': // Novedades de Pedidos ( viene con comprobante )
                      if (mismoTipoDeSucursal) {
                        novCprs ++
                      }
                      break
                    case 'C': break // Sin uso
                    case 'D': // Descargado por el proveedor ( viene con comprobante )
                      if (mismoTipoDeSucursal) {
                        novCprs ++
                      }
                      break
                    case 'E': break // Sin uso
                    case 'F': // Pedido Facturado ( viene con comprobante )
                      if (mismoTipoDeSucursal) {
                        novCprs ++
                      }
                      break
                    case 'G': break // Factura Gohu ( viene con comprobatne ) - aun no implementada!.
                    case 'H': // Importar Cheques comprados ( viene con comprobante )
                      if (mismoTipoDeSucursal) {
                        novCprs ++
                      }
                      break
                    case 'I': // pago para importar ( viene con comprobante )
                      if (mismoTipoDeSucursal) {
                        novCprs ++
                      }
                      break
                    case 'J': 
                      break 
                    case 'K': // Recibimos Stock ( viene con comprobante )
                      novUsrs ++
                      this.notUsrs.push(data[0].not[i])
                      break
                    case 'L': break // Sin uso
                    case 'M': // Solicitud de Pago ( viene con comprobante )
                      if (mismoTipoDeSucursal) {
                        novCprs ++
                      }
                      break
                    case 'N': break // Sin uso
                    case 'O': break // Sin uso
                    case 'P': // Pedidos ( viene con comprobante asignado )
                      if (mismoTipoDeSucursal) {
                        cttPed ++
                        novCprs ++
                      }
                      break
                    case 'Q': break // Sin uso
                    case 'R': // Pago rechazado ( viene con comprobante asignado )
                      if (mismoTipoDeSucursal) {
                        novCprs ++
                      }
                      break
                    case 'S': break // Sin uso
                    case 'T': break // Sin uso
                    case 'U': break // Sin uso
                    case 'V': // Solicitud de Vinculo Comercial
                      this.notUsrs.push(data[0].not[i])
                      let pos = this.notUsrs.length-1
                      let como = this.notUsrs[pos].detalles
                      let m = '<b>'+this.notUsrs[pos].userdesde.username+'</b>'
                      m += ' te ha enviado una Solicitud de Vínculo Comercial como futuro '
                      m += como=='P'?'Proveedor.':'Cliente.'
                      m += ' Ve al panel de Vinculaciones para aceptarla o rechazarla.<br>'
                      this.notUsrs[pos].detalles = m
                      novUsrs ++
                      //this.menuNotUsrsNot[1].nov ++
                      break
                    case 'W': break // Sin uso
                    case 'X': break // NOTIFICACION SOBRE ANULACION FORZADA DE OPERACIONES VINCULADAS, PAGOS Y RECIBOS
                    case 'Y': break // Sin uso
                    case 'Z': break // Sin uso
                  }
  
                  if (cprvin && agrego ) {  // Notificacion con comprobante vinculado, agrego en notCprs
  
                    debugger
                    let u = this.notCprs.findIndex(x=>x.usuario==data[0].not[i].userdesde.username)
                    if (u==-1) {
                      this.notCprs.push({
                        usuario: data[0].not[i].userdesde.username,
                        user_id: data[0].not[i].userdesde.id,
                        cttPedidos: 0,
                        cttPedFac: 0,
                        cttLeidos: 0,
                        novedades: [{
                          comprobante: data[0].not[i].comprobante,
                          comprobante_id: data[0].not[i].comprobante_id,
                          created_at: data[0].not[i].created_at,
                          detalles: data[0].not[i].detalles,
                          estado: data[0].not[i].estado,
                          id: data[0].not[i].id,
                          tipo: data[0].not[i].tipo,
                          updated_at: data[0].not[i].updated_at,
                          user_id_desde: data[0].not[i].user_id_desde,
                          user_id_hasta: data[0].not[i].user_id_hasta,
                          userdesde: data[0].not[i].userdesde,
                          verarticulos: false,
                          verpendientes: false,
                          vercancelaciones: false,
                          vervalingresos: false,
                          vervalegresos: false,
                          //paraprocesar: false,
                          notas: [{
                            fecha: data[0].not[i].created_at,
                            nota: data[0].not[i].detalles,
                            tipo: data[0].not[i].tipo,
                            borrada: false,
                            id: data[0].not[i].id,
                          }],
                        }]
                      })
  
                    } else {
                      
                      let q = this.notCprs[u].novedades.findIndex(x=>x.comprobante.cpr==data[0].not[i].comprobante.cpr)
                      if (q==-1) {
                        this.notCprs[u].novedades.push({
                          comprobante: data[0].not[i].comprobante,
                          comprobante_id: data[0].not[i].comprobante_id,
                          created_at: data[0].not[i].created_at,
                          detalles: data[0].not[i].detalles,
                          estado: data[0].not[i].estado,
                          id: data[0].not[i].id,
                          tipo: data[0].not[i].tipo,
                          updated_at: data[0].not[i].updated_at,
                          user_id_desde: data[0].not[i].user_id_desde,
                          user_id_hasta: data[0].not[i].user_id_hasta,
                          userdesde: data[0].not[i].userdesde,
                          verarticulos: false,
                          verpendientes: false,
                          vercancelaciones: false,
                          vervalingresos: false,
                          vervalegresos: false,
                          //paraprocesar: false,
                          notas: [{
                            fecha: data[0].not[i].created_at,
                            nota: data[0].not[i].detalles,
                            tipo: data[0].not[i].tipo,
                            borrada: false,
                            id: data[0].not[i].id,
                          }],
                        })
                      } else {
                        this.notCprs[u].novedades[q].notas.push({
                          fecha: data[0].not[i].created_at,
                          nota: data[0].not[i].detalles,
                          tipo: data[0].not[i].tipo,
                          borrada: false,
                          id: data[0].not[i].id,
                        })
                      }
                    }
                  }
  
                  this.compartiendo = compart
                  if (agrego) {
  //                this.notUsrs.push({ usuario: data[0].not[i], borrada: false })
                    let p = -1
                    if (cprvin) {
                      p = n.findIndex(x=>x.comprobante_id==data[0].not[i].comprobante_id)
                    }
  
                    if (p>=0) {
                      n[p].notas.push({
                        nota: data[0].not[i].detalles,
                        tipo: data[0].not[i].tipo,
                        id: data[0].not[i].id,
                      })
                    } else {
                      n.push( { 
                        comprobante: data[0].not[i].comprobante,
                        comprobante_id: data[0].not[i].comprobante_id,
                        created_at: data[0].not[i].created_at,
                        detalles: data[0].not[i].detalles,
                        estado: data[0].not[i].estado,
                        id: data[0].not[i].id,
                        tipo: data[0].not[i].tipo,
                        updated_at: data[0].not[i].updated_at,
                        user_id_desde: data[0].not[i].user_id_desde,
                        user_id_hasta: data[0].not[i].user_id_hasta,
                        userdesde: data[0].not[i].userdesde,
                        notas: [{
                          nota: data[0].not[i].detalles,
                          tipo: data[0].not[i].tipo,
                          id: data[0].not[i].id
                        }],
                        //paraprocesar: false,
                      })
                    }
                  }
                }
              }

              // calculo los pedidos por usuarios
              for (let i=0; i<=this.notCprs.length-1; i++) {
                for (let j=0; j<=this.notCprs[i].novedades.length-1; j++) {
                  if (this.notCprs[i].novedades[j].tipo=='P') {
                    this.notCprs[i].cttPedidos ++
                    this.cttPedidosGlobales ++
                  } else if (this.notCprs[i].novedades[j].tipo=='F') {
                    this.notCprs[i].cttPedFac ++
                  } else if (this.notCprs[i].novedades[j].tipo=='B' ||
                              this.notCprs[i].novedades[j].tipo=='K' ||
                              this.notCprs[i].novedades[j].tipo=='R' ||
                              this.notCprs[i].novedades[j].tipo=='D' || this.$store.state.tipo=='PP') {
                    this.notCprs[i].cttLeidos ++
                  }
                }
              }
              if (cttPed>0) {
                this.$store.commit('setHayPedidos', cttPed, { root: true });
              } else {
                this.$store.commit('setHayPedidos', 0, { root: true });
              }
              /*
              for (let i=0; i<=n.length-1; i++) {
                for (let j=0; j<=n[i].notas.length-1; j++) {
                  if (n[i].notas[j].tipo == 'K' ||
                      n[i].notas[j].tipo == 'A' || 
                      n[i].notas[j].tipo == '?' || 
                      n[i].notas[j].tipo == 'F' || 
                      n[i].notas[j].tipo == 'V' ||
                      n[i].notas[j].tipo == 'H')
                      {
                        n[i].paraprocesar = true;
                      }
                  }
              }
              */
              if (novUsrs+novGohu+novCprs>0) {
/*
                let noti = this.$store.state.notificaciones==null?0:this.$store.state.notificaciones.length
                let novG = this.$store.state.novedadesGohu
                let novC = this.$store.state.novedadesCprs
                if ((noti+novG+novC)<(n.length+novGohu+novCprs)) {
                  var data = { soundurl : 'sounds/sound1.wav'}
                  var audio = new Audio(data.soundurl);
                  audio.play();
                }
*/
                this.$store.commit('setNotificaciones', n, { root: true });
                this.$store.commit('setNovedadesGohu', novGohu, { root: true });
                this.$store.commit('setNovedadesCprs', novCprs, { root: true });
                this.$store.commit('setNovedadesUsrs', novUsrs, { root: true });
              } else {
                this.$store.commit('setNotificaciones', [], { root: true });
                this.$store.commit('setNovedadesGohu', 0, { root: true });
                this.$store.commit('setNovedadesCprs', 0, { root: true });
                this.$store.commit('setNovedadesUsrs', 0, { root: true });
                this.dialogNotCprs = false
              }

              return HTTP().get('/vinculos/true', {timeout: 10000} ).then(({ data }) => {

                this.setVinculos(data.vi, data.nt, data.exProv, data.exClie)
                if (this.$store.state.level==3) {   // VENDEDOR
//              if (this.$store.state.level!=1) {   // VENDEDOR
                  let aux = []
                  let ter = this.$store.state.operarioUserId
                  let suc = this.$store.state.sucursal
                  return HTTP().post('/roles',{ user: ter, sucursal: suc }).then(({ data }) => {
                    for (let i=0; i<=data.length-1; i++) {
                      aux.push ({
                        id:         data[i].id,
                        nombre:     data[i].opcion.nombre,
                        tipo:       data[i].opcion.tipo,
                        activo:     data[i].opcion.activo,
                        opcion_id:  data[i].opcion.id,
                        acceder:    i==0 ? true : data[i].acceder,
                        agregar:    i==0 ? true : data[i].agregar,
                        editar:     i==0 ? true : data[i].editar,
                        desactivar: i==0 ? true : data[i].desactivar,
                      })
                    }
                    this.$store.commit('setRoles', aux, { root: true });

                    //this.cargoPanelDeVinculaciones(1) // clientes

                  })

                } else {

                  // SOLO PARA LOS NO VENDEDORES
                  // CARGO EL usuarios PARA PODERLOS ADMINISTRAR
                  this.cargoPanelDeVinculaciones(1) // clientes

                }

                if (this.tipo=='BA'||this.tipo=='ME') {
                  return HTTP().get('/cantidaddeoperaciones').then(({ data }) => {
                    this.$store.commit('setOperaciones', data[0].meta.ctt|0, { root: true });
                  })
                }
              })
            })
          
          } else {

            this.$store.commit('setNotificaciones', [], { root: true });
          
          }

        }
      },

      cargoPanelDeVinculaciones (cual) {
        if (cual===1) {
          this.usuarios = this.vinculosHijosLoc
        } else {
          this.usuarios = this.vinculosPadresLoc
        }
        this.usuariosBkp = this.usuarios

        this.vinculosPanel[0].ctt = 0  // nuevos
        this.vinculosPanel[1].ctt = 0  // vinculados
        this.vinculosPanel[2].ctt = 0  // descartados
        this.vinculosPanel[3].ctt = 0  // solicitudes

        // armo el array de rubros
        this.rubros = []
        for (let i=0; i<=this.usuarios.length-1; i++) {
          // veo si el 'ver' esta en true
          if (this.usuarios[i].ver==1 && this.usuarios[i].solicitud==0 && this.usuarios[i].vinculado==0) {
            // nuevos
            this.vinculosPanel[0].ctt+=1
          } else if (this.usuarios[i].vinculado==1) {
            // vinculados
            this.vinculosPanel[1].ctt+=1
          } else if (this.usuarios[i].ver==0) {
            // descartados
            this.vinculosPanel[2].ctt+=1
          } else if (this.usuarios[i].solicitud==1) {
            // solicitados
            this.vinculosPanel[3].ctt+=1
          }
          for (let j=0; j<=this.usuarios[i].usersrubros.length-1; j++) {
            let pos = this.rubros.findIndex(x=>x.id===this.usuarios[i].usersrubros[j].id)
            if (pos==-1) {
              this.rubros.push({
                id: this.usuarios[i].usersrubros[j].id,
                nombre: this.usuarios[i].usersrubros[j].nombre,
                sel: false,
              })
            }
          }
        }
/*
        if (this.vinculosPanel[0].ctt>0) {
          var data = { soundurl : 'sounds/4.mp3'}
          var audio = new Audio(data.soundurl);
          audio.play();
        } else if (this.vinculosPanel[3].ctt>0) {
          var data = { soundurl : 'sounds/2.wav'}
          var audio = new Audio(data.soundurl);
          audio.play();
        }
*/

//      this.usuariosBkp = this.usuarios
        this.vinculosVer(1)
      },

      vinculosVerTipo(cual) {
        this.vinculosAVerCualTipo = cual
        this.cargoPanelDeVinculaciones(cual) // clientes
      },

      vinculosVer(cual) {
        this.usuarios = []
        let rubsel = []
        let ubisel = []
        let aux = []
        for (let i=0; i<=this.rubros.length-1; i++) {
          if (this.rubros[i].sel) {
            rubsel.push(this.rubros[i].id)
          }
        }
        for (let i=0; i<=this.ubicaciones.length-1; i++) {
          if (this.ubicaciones[i].sel) {
            ubisel.push(this.ubicaciones[i].nombre)
          }
        }
        this.vinculosAVerCual = cual
        if (cual==1) {          // nuevos
          aux = this.usuariosBkp.filter(function(u){
            return (u.ver==1 && u.solicitud==0 && u.vinculado==0)
          })
        } else if (cual==2) {   // vinculados
          aux = this.usuariosBkp.filter(function(u){
            return (u.vinculado==1)
          })
        } else if (cual==3) {   // descartados
          aux = this.usuariosBkp.filter(function(u){
            return (u.ver==0)
          })
        } else if (cual==4) {   // solicitudes
          aux = this.usuariosBkp.filter(function(u){
            return u.solicitud==1 && u.ver==1
          })
        }
        if (this.searchUsr!=null) {
          aux = aux.filter(p=>p.username.toUpperCase().indexOf(this.searchUsr.toUpperCase())!=-1)
        }
        // ver como optimizar esto!
        if (rubsel.length>0||ubisel.length>0) {
          // recorro todos los usuarios filtrados por estado
          for (let i=0; i<=aux.length-1; i++) {
            let posubi = ubisel.findIndex(x=>x===aux[i].ciudad)
            let posrub = 0
            for (let j=0; j<=aux[i].usersrubros.length-1; j++) {
              //pos2 = rubsel.findIndex(x=>x.id == aux[i].usersrubros[j].id)
              posrub = rubsel.indexOf(aux[i].usersrubros[j].id)
              if (posrub!=-1) {
                break
              }
            }
            if ((rubsel.length>0&&ubisel.length>0) && (posrub!=-1&&posubi!=-1)) {
              this.usuarios.push(aux[i])
            } else if ((rubsel.length>0&&ubisel.length==0) && (posrub!=-1&&posubi==-1)) {
              this.usuarios.push(aux[i])
            } else if ((rubsel.length==0&&ubisel.length>0) && (posrub==-1&&posubi!=-1)) {
              this.usuarios.push(aux[i])
            }
          }
        } else {
          this.usuarios = aux
        }
      },

      actualizarContadorGohu() {
        if (!this.isLoggedIn) { return }
        this.contadorGohu --
        if (this.contadorGohu == 0) {
          this.contadorGohu = this.timeoutRefresh;
          let n = []
          if (this.isLoggedIn && this.userId==1) {
            return HTTP().get('/notificacionesgohu').then(({ data }) => {
              if (data.length>0) {
                for (let i=0; i<=data.length-1; i++) {
                  let p = -1
                  for (let j=0; j<=n.length-1; j++) {
                    if (data[i].comprobante_id == n[j].comprobante_id && n[j].tipo!='V') {
                      p = j
                      break
                    }
                  }
                  if (p>=0) {
                    n[p].notas.push( { nota: data[i].detalles, tipo: data[i].tipo } )
                  } else {
                    n.push( { 
                      comprobante: data[i].comprobante,
                      comprobante_id: data[i].comprobante_id,
                      created_at: data[i].created_at,
                      detalles: data[i].detalles,
                      estado: data[i].estado,
                      id: data[i].id,
                      tipo: data[i].tipo,
                      updated_at: data[i].updated_at,
                      user_id_desde: data[i].user_id_desde,
                      user_id_hasta: data[i].user_id_hasta,
                      userdesde: data[i].userdesde,
                      notas: [ { nota: data[i].detalles, tipo: data[i].tipo } ],
                      //paraprocesar: false
                    })
                  }
                }
                // reviso cuales notifiaciones estan listas para procesar asi Home.vue 
                // puede prender los botones de ver e importar.
                /*
                for (let i=0; i<=n.length-1; i++) {
                  for (let j=0; j<=n[i].notas.length-1; j++) {
                    if (n[i].notas[j].tipo == 'K' ||
                        n[i].notas[j].tipo == 'A' ||
                        n[i].notas[j].tipo == 'F' ||
                        n[i].notas[j].tipo == 'V' || 
                        n[i].notas[j].tipo == 'H') {
                      n[i].paraprocesar = true;
                    }
                  }
                }
                */
                this.$store.commit('setNotificacionesgohu', n, { root: true });
                this.mosNotGohu = true;
              } else  {
                this.$store.commit('setNotificacionesgohu', [], { root: true });
                this.mosNotGohu = false;
              }
            })
          } else {
            this.$store.commit('setNotificacionesgohu', [], { root: true });
          }
        }
      },

      async actualizoMoneda() {
        let hora = moment().format('HH:mm')
        if (hora>='08:00' && hora<='17:00') {
          this.yaLeyoElDolar = true
          this.cotDolar = []

//        https://dolarapi.com/v1/dolares
//        return axios.get('https://www.dolarsi.com/api/api.php?type=valoresprincipales').then(({ data }) => {
          return axios.get('https://dolarapi.com/v1/dolares').then(({ data }) => {
            return HTTP().post('/cotizaciondolar', { dolar: data }).then(({ data }) => {
              if (data.error!=undefined) {  //hev021
                this.mensaje('¡Error al intentar actualizar el valor del Dolar!', this.$store.state.temas.snack_error_bg, 2000) 
              } else {
                this.$store.commit('setDolar', data[0][0].nooficialventa||0, { root: true });
              }
            })
          })
          .catch(e => {
            console.log(e)
          })          
        }
      },

      filtroPorVentas() {
        if (this.filtroVenta_id=='Hoy') {
          this.ventasFil = this.statics.hoy
        } else if (this.filtroVenta_id=='Semana') {
          this.ventasFil = this.statics.semana
        } else if (this.filtroVenta_id=='Semana Anterior') {
          this.ventasFil = this.statics.semanaAnterior
        } else if (this.filtroVenta_id=='Mes') {
          this.ventasFil = this.statics.mes
        } else if (this.filtroVenta_id=='Mes Anterior') {
          this.ventasFil = this.statics.mesAnterior
        } else if (this.filtroVenta_id=='Bimestre') {
          this.ventasFil = this.statics.bimestre
        } else if (this.filtroVenta_id=='Trimestre') {
          this.ventasFil = this.statics.trimestre
        } else if (this.filtroVenta_id=='Cuatrimestre') {
          this.ventasFil = this.statics.cuatrimestre
        } else if (this.filtroVenta_id=='Semestre') {
          this.ventasFil = this.statics.semestre
        } else if (this.filtroVenta_id=='Año') {
          this.ventasFil = this.statics.anio
        } else if (this.filtroVenta_id=='Total') {
          this.ventasFil = this.statics.total
        }
      },

      setTercero(cual) {
        this.$store.commit('setTerceros', cual, { root: true });
      },

      ophab(cual) {
        if (this.$store.state.tipo=='PP') return false  // Si el usuario es Precios y Pedidos no tiene roles.

        if (this.$store.state.roles.length>0) {
          const op = this.$store.state.roles.map(el => el.opcion_id);
          const po = op.indexOf(cual);
          if (po==-1) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      },

      cprOrigen( nov ) {
        if (nov.comprobante.vinculoHijo.length>0) {
          if (nov.comprobante.cpr != nov.comprobante.vinculoHijo[0].padre.cpr) {
            return nov.comprobante.cpr //+' de '+nov.comprobante.vinculoHijo[0].padre.cpr
          } else {
            return nov.comprobante.cpr 
          }
        } else {
          return nov.comprobante.cpr
        }
      },

      showNotCprs() {
        this.dialogNotCprs = true
      },

      showNotUsrs() {
        this.dialogNotUsrs = true
      },

      cambiarLicencia() {
        if (this.licenciaACambiar=='PP'||this.licenciaACambiar=='BA'||this.licenciaACambiar=='ME') {
          this.licenciaACambiar = 'CO'
        } else {
          this.licenciaACambiar = 'ME'
        }
        this.dialogCambiarLicencia = true
      },

      showNotGohu() {
        this.dialogNotGohu = true
      },

      showUsuariosNuevos() {
        if (this.usuariosBkp.length) {
          this.$store.commit('setContadorBloqueado', true, { root: true })
          this.dialogUsuarios = true
        }
      },

      showNueVinOk() {
        if (this.notVinOk.length) {
          this.$store.commit('setContadorBloqueado', true, { root: true })
          this.dialogVinOk = true
        }
      },

      showNueVinRechazados() {
        if (this.notVinRech.length) {
          this.$store.commit('setContadorBloqueado', true, { root: true })
          this.dialogVinRech = true
        }
      },

      setContadores() {
        this.contador = 1;
        this.contadorGohu = 1;
        this.contadorPub = 1;
        this.mensaje('¡Datos refrescados!', this.$store.state.temas.forms_titulo_bg, 500);
      },

      /*
      setGraficos() {
        if (!this.$store.state.graficos) {
          return HTTP().post('/resumenesdeventas/', {suc: this.$store.state.sucursal } ).then(({ data }) => {
            this.$store.commit('setGraficos', !this.$store.state.graficos, { root: true });
            if (data[0]!=undefined) {
              for (let i=0; i<=data[0].length-1; i++) {
                data[0][i].fecha = moment(data[0][i].fecha).format('YYYY-MM-DD')
              }
              let primerDia = moment(data[0][0].fecha).format('YYYY-MM-DD')
              let ultimoDia = moment().format('YYYY-MM-DD')
              let actual = primerDia
              let dias = []
              this.resMeses = []
              let semanas = moment().weeks()
              let otro = moment().add(0, 'month').startOf('month').weeks() + 1
              while (actual<=ultimoDia) {
                let pos = data[0].findIndex(x=>x.fecha == actual)
                if (pos==-1) {
                  dias.push({ fecha: actual, total: 0 })
                } else {
                  dias.push({ fecha: actual, total: data[0][pos].total })
                }
                actual = moment(actual).add(1, 'days').format('YYYY-MM-DD')
              }
              this.$store.commit('setGraficosDatos', dias, { root: true })
            }
          })
        } else {
          this.$store.commit('setGraficos', !this.$store.state.graficos, { root: true });        
          this.$store.commit('setGraficosDatos', [], { root: true })
        }
      },
      */

      setEstadoFinanciero() {
        return HTTP().post('/estadofinanciero/', {suc: this.$store.state.sucursal } ).then(({ data }) => {
          this.estFin = []
          for (let i=0; i<=data.length-1; i++) {
            this.estFin.push({
              vencimiento: data[i].vencimiento,
              descripcion: data[i].descripcion,
              cpr: data[i].cpr,
              tercero: data[i].tercero,
              importe: data[i].importe,
              acumulado: 0,
            })
          }
          this.estFin.sort(function (a, b) {
            if (a.vencimiento < b.vencimiento) { return -1; }
            if (a.vencimiento > b.vencimiento) { return 1; }
            return 0;
          });

          // VAMOS A AGRUPAR POR FECHA FINANCIERA
          this.estFinDia = []
          let acu = 0
          for (let i=0; i<=this.estFin.length-1; i++) {
            
            //let pos = tmp.findIndex(x=>x.vencimiento == this.estFin[i].vecimiento)
            let pos = -1
            for (let j=0; j<=this.estFinDia.length-1; j++) {
              if (this.estFinDia[j].vencimiento==this.estFin[i].vencimiento) {
                pos = j
                break
              }
            }
            acu += this.roundTo(this.estFin[i].importe,2)
            if (pos==-1) {
              this.estFinDia.push({
                vencimiento: this.estFin[i].vencimiento,
                debe: this.estFin[i].importe<0?this.roundTo(this.estFin[i].importe,2):0,
                haber: this.estFin[i].importe>0?this.roundTo(this.estFin[i].importe,2):0,
                saldo: 0,
                items: []
              })
              this.estFinDia[this.estFinDia.length-1].items.push(this.estFin[i])
              this.estFinDia[this.estFinDia.length-1].saldo = acu
            } else {
              this.estFinDia[pos].debe += this.estFin[i].importe<0?this.roundTo(this.estFin[i].importe,2):0
              this.estFinDia[pos].haber += this.estFin[i].importe>0?this.roundTo(this.estFin[i].importe,2):0
              this.estFinDia[pos].saldo = acu
              this.estFinDia[pos].items.push(this.estFin[i])
            }
          }

          this.estFinDia.sort(function (a, b) {
            if (a.vencimiento < b.vencimiento) { return 1; }
            if (a.vencimiento > b.vencimiento) { return -1; }
            return 0;
          });
//          acu = 0
//          for (let i=this.estFin.length-1; i>=0; i--) {
//            acu += this.estFin[i].importe
//            this.estFin[i].acumulado = acu
//          }
          this.dialogEstadoFinanciero = true
        })
      },

      async verCotizaciones(ver) {
        let x = this.$store.state.transition
        this.dialogCotizaciones = ver
        this.cotDolar = []
        return axios.get('https://dolarapi.com/v1/dolares').then(({ data }) => {
          this.cotDolar.push({ nombre: 'Oficial', compra: data[0].compra, venta: data[0].venta, })
          this.cotDolar.push({ nombre: 'Blue', compra: data[1].compra, venta: data[1].venta, })
          return HTTP().post('/resumenesdeventas/', {suc: this.$store.state.sucursal } ).then(({ data }) => {
            this.statics = data
            this.ventasFil = data.hoy
            this.filtroVenta_id = 'Hoy'
          })
        })
      },

      closeNotCprs() {
        this.$store.commit('setContadorBloqueado', false, { root: true })
        this.dialogNotCprs = false
      },

      closeNotUsrs() {
        this.$store.commit('setContadorBloqueado', false, { root: true })
        this.dialogNotUsrs = false
      },

      closeNotGohu() {
        this.$store.commit('setContadorBloqueado', false, { root: true })
        this.dialogNotGohu = false
      },

      closeUsuarios() {
        this.$store.commit('setContadorBloqueado', false, { root: true })
        this.dialogUsuarios = false
      },

      closeNueVinculoOk() {
        this.dialogVinOk = false
      },

      closeNueVinculoRechazados() {
        this.dialogVinRech = false
      },

      leidosAll(nota) {
        let aBorrar = []
        let pos = this.notCprs.findIndex(x=>x.user_id===nota.user_id)
        for (let i=0; i<=this.notCprs[pos].novedades.length-1; i++) {
          if (this.notCprs[pos].novedades[i].tipo=='B' ||
              this.notCprs[pos].novedades[i].tipo=='K' ||
              this.notCprs[pos].novedades[i].tipo=='R' ||
              this.notCprs[pos].novedades[i].tipo=='D' ||
              this.$store.state.tipo=='PP') {
            aBorrar.push(this.notCprs[pos].novedades[i])
          }
        }
        if (aBorrar.length>0) {
          return HTTP().post('/borrarnotificaciones', { aborrar: aBorrar } ).then(({ data }) => {
            if (data=='ok') {
              this.mensaje('¡Notificaciones borradas!', this.$store.state.temas.forms_titulo_bg, 2000)
              this.contador = 1
              this.actualizarContador()
            } else if (data=='error') {
              this.mensaje('¡Se ha producido un error al intentar borrar estas notificaciones!', this.$store.state.temas.forms_titulo_bg, 2000)
            }
          }).catch((err) => {
            //console.log(e)
            this.mensaje('¡No se ha podido borrar la Notificación!, reintente, y si el error persiste consutle con gohu.'+err,
            this.$store.state.temas.forms_titulo_bg, 2000) 
          })
        }
      },

      leido(not,queArray) {
        if (queArray===3||queArray===4) {
          let aux = not.id
          not = { usuario: { id: aux }, notas: [], }
          let x = []
          if (queArray===3) {
            x = this.notVinOk.filter(function(u){
              return (u.id!=aux)
            })
          } else {
            x = this.notVinRech.filter(function(u){
              return (u.id!=aux)
            })
          }
          if (x.length==0) {
            if (queArray===3) {
              this.notVinOk = []
              this.dialogVinOk = false
            } else {
              this.notVinRech = []
              this.dialogVinRech = false
            }
          }
        }
        return HTTP().post('/borrarnotificacion', { nota: not } ).then(({ data }) => {
          this.mensaje('¡Notificacion borrada!', this.$store.state.temas.forms_titulo_bg, 2000) 
          this.borroNotificacion(not,queArray)
        }).catch((e) => {
          //console.log(e)
          this.mensaje('¡No se ha podido borrar la Notificación!, reintente, y si el error persiste consulte con gohu.'+e,
          this.$store.state.temas.forms_titulo_bg, 2000) 
        })
      },

      anular(not, queArray) {
        return HTTP().post('/anularpedido', {
          itemActual: not,
          motivo: 'Lementamos informarles que nos quedamos sin Stock.',
          yadescargo: false,
          }).then(({ data })=>{
          if (data) {
            this.mensaje('¡Pedido anulado correctamente!', this.temas.forms_titulo_bg, 2000)
          } else {
            this.mensaje('¡Opps, se ha producido un error al anular el pedido!', this.$store.state.temas.snack_error_bg, 2000)
          }
          this.borroNotificacion(not,queArray)
        });
      },

      actualizoProveedores() {
        return HTTP().get('/vinculos/true').then(({ data }) => {
          this.setVinculos(data.vi, data.nt, data.exProv, data.exClie)
        })
      },

      verArt(nov) {
        if (nov) {
          nov.verarticulos = !nov.verarticulos
          this.dialogVerArticulos = true
          this.$store.commit('setContadorBloqueado', false, { root: true })
          for (let i=0; i<=this.notCprs.length-1; i++) {
            for (let j=0; j<=this.notCprs[i].novedades.length-1; j++) {
              if (this.notCprs[i].novedades[j].verarticulos) {
                this.$store.commit('setContadorBloqueado', true, { root: true })
                break
              }
            }
          }
          this.articulos = nov.comprobante.items
          return nov.verarticulos
        } else {
          this.dialogVerArticulos = false
          this.$store.commit('setContadorBloqueado', false, { root: true })
        }
      },

      verPend(nov) {
        if (nov) {

          if (nov.comprobante.cancelaciones.length>0) {
            nov.vercancelaciones = !nov.vercancelaciones
            this.cancelaciones = nov.comprobante.cancelaciones
            this.valoresEgresos = nov.comprobante.valoresEgresos
            this.dialogVerCancelaciones = true
          } else if (nov.comprobante.pendientes.length>0) {
            nov.verpendientes = !nov.verpendientes
            this.pendientes = nov.comprobante.pendientes
            this.dialogVerPendientes = true
          }

          this.$store.commit('setContadorBloqueado', false, { root: true })
          for (let i=0; i<=this.notCprs.length-1; i++) {
            for (let j=0; j<=this.notCprs[i].novedades.length-1; j++) {
              if (nov.comprobante.pendientes.length>0) {
                if (this.notCprs[i].novedades[j].verpendientes) {
                  this.$store.commit('setContadorBloqueado', true, { root: true })
                  break
                }
              } else {
                if (this.notCprs[i].novedades[j].vercancelaciones) {
                  this.$store.commit('setContadorBloqueado', true, { root: true })
                  break
                }
              }
            }
          }
          if (nov.comprobante.pendientes.length>0) {
            return nov.verpendientes
          } else {
            return nov.vercancelaciones
          }
        } else {
          this.dialogVerPendientes = false
          this.dialogVerCancelaciones = false
          this.$store.commit('setContadorBloqueado', false, { root: true })
        }
      },

      verValores(nov) {
        if (nov) {
          if (nov.comprobante.valoresEgresos.length>0) {
            this.dialogVerValores = true
            this.valoresEgresos = nov.comprobante.valoresEgresos
            this.$store.commit('setContadorBloqueado', false, { root: true })
          }
        } else {
          this.dialogVerValores = false
          this.$store.commit('setContadorBloqueado', false, { root: true })
        }
      },

      formatoFecha(value) {
        return moment(String(value)).format('L')
      },

      diasVencido(value) {
        var dateOne = moment();
        var dateTwo = moment(value);
        return dateOne.diff(dateTwo, 'days');
      },

      totalNota(nota) {
        /*
        if (nota.comprobante.pendientes.length) {
          if (nota.comprobante.pendientes[0].pendiente==0) {
            return this.formatoImporte(nota.comprobante.pendientes[0].importe)
          } else {
            return this.formatoImporte(nota.comprobante.pendientes[0].pendiente)
          }
        } else {
        */
        return this.formatoImporte(nota.comprobante.total)
        //}
      },

      aceptarRechazarPlan(nota, aceptar) {
        this.$store.commit('actNotificacion', nota.usuario.id, { root: true });
        nota.borrada = true
        let pos = -1
        for (let i=0; i<=this.notUsrs.length-1; i++) {
          if (this.notUsrs[i].usuario.id == nota.usuario.id) {
            pos = i
            break
          }
        }
        if (pos!=-1) {
          this.notUsrs.splice(pos, 1);
        }
        this.$store.commit('setNovedadesGohu', this.$store.state.novedadesGohu-1, { root: true });
        if (this.notUsrs.length == 0) {
          this.dialogNotGohu = false
        }
        return HTTP().patch('activarrechazarusuario/'+nota.usuario.user_id_desde, {activo: aceptar}).then(({ data }) => {
          this.mensaje('¡Activación exitosa!', this.$store.state.temas.forms_titulo_bg, 2500) 
        })
        .catch((e) => {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500) 
        });
      },

/*
      uneteAGohu() {
        this.dialogUneteAGohu = true
      },
*/

      showNuevoMensaje() {
        return HTTP().get('indexter/false/ALL/'+this.operarioEsVendedor+'/'+this.operarioTerceroId+'/'+this.operarioUserId+'/%%')
          .then(({data})=>{
          this.mensajeUsers = []
          this.mensajeUsersSel = []
          for (let i=0; i<=data.length-1; i++) {
            if (data[i].tercero.user!=null) {
              if (data[i].tercero.user.id!=this.userId) {
                if (data[i].tercero.direcciones.length>=0) {
                  let zona = ''
                  if (data[i].tercero.direcciones[0].zona!=null) {
                    if (data[i].tercero.direcciones[0].zona.length>0) {
                      if (data[i].tercero.direcciones[0].zona[0].zonas!=null) {
                        zona = data[i].tercero.direcciones[0].zona[0].zonas.nombre
                      }
                    }
                  }
                  this.mensajeUsers.push({
                    tercero_id: data[i].tercero.id,
                    user_id: data[i].tercero.user.id,
                    nombre: data[i].tercero.nombre,
                    zona: zona,
                  })
                }
              }
            }
          }
          this.dialogMensajes = true
        });
      },

      confirmarEnviarMensaje() {
        this.msg.msgTitle = '¡Enviar Mensaje!'
        let m = '¿Confirmas enviar este mensaje '
        m += this.mensajeUsersSel.length>1?'a los ':'al '
        m += this.mensajeUsersSel.length>1?'usuarios ':'usuario '
        m += this.mensajeUsersSel.length>1?'seleccionados? ':'seleccionado? '
        this.msg.msgBody = m
        this.msg.msgAccion = 'Enviar Mensaje'
        this.msg.msgButtons = ['Aceptar','Cancelar']
        this.msg.msgVisible = true
      },

      informarPago() {
        this.dialogInformarPago = true
      },

      impPedAll() {
        // descarga todos los pedidos pendientes
        let ped = []
        let nots = []
        let vjes = []
        debugger
        for (let i=0; i<=this.notCprs.length-1; i++) {
          if (this.notCprs[i].novedades.length>0) {
            for (let j=0; j<=this.notCprs[i].novedades.length-1; j++) {
              if (this.notCprs[i].novedades[j].comprobante.comprobante_id==126) {
                ped.push({
                  ped: this.notCprs[i].novedades[j].comprobante.id,
                  not: this.notCprs[i].novedades[j].id
                })
                nots.push( this.notCprs[i].novedades[j].id )
                vjes.push ( this.notCprs[i].novedades[j].comprobante.viaje_id )
              }
            }
          }
        }
        if (ped.length>0) {
          let suc = this.sucursales.findIndex(x=>x.sucursaldemo==0)
          let dep = this.sucursales[suc].depositos[0].id
          return HTTP().post('/importartodoslospedidos', {

            pedidos: ped,
            sucursales: this.sucursales,
            depositos: this.depositos,
            nots: nots,
            vjes: vjes,

            }).then(({data})=>{
            if (data.estado=='error') {
              this.msg.msgTitle = '¡Error!'
              let m = 'Se ha producido un error en la descarga de estos pedidos.</b><br>'
              m += 'Reintenta, si el error persiste comunícate con <b>gohu</b>'
              this.msg.msgBody = m
              this.msg.msgAccion = 'Error en Descarga'
              this.msg.msgButtons = ['Aceptar']
            } else {
              this.msg.msgTitle = '¡Descarga Correcta!'
              this.msg.msgBody = 'Pedidos descargados correctamente.</b><br><br>'
              this.msg.msgAccion = 'Descarga Correcta'
              this.msg.msgButtons = ['Aceptar']
            }
            this.msg.msgVisible = true
            this.borroNotificacion(ped,1)
          })
        }
      },

      impCprAll(nota) {
        debugger
        let pos = this.notCprs.findIndex(x=>x.user_id===nota.user_id)
        for (let i=0; i<=this.notCprs[pos].novedades.length-1; i++) {
          if (this.notCprs[pos].novedades[i].tipo=='P' || this.notCprs[pos].novedades[i].tipo=='F') {
            this.impCpr(this.notCprs[pos], this.notCprs[pos].novedades[i])
          }
        }
      },

      impCpr(not, it) {

        /*
          se descargan:
            a) Facturas emitidas por Proveedores, que pasan a ser compras -> it.comprobante.tipo=='VE' 'nuevacompra'
            b) Pedidos emitidos por clientes                              -> it.comprobante.tipo=='CO' 'descargarpedido'
            c) Pagos emitidos por clientes                                -> it.comprobante.tipo=='PG' 'descargarpago'
        */

        debugger
        let articulos = []
        let valores = []
        for (let i=0; i<=it.comprobante.items.length-1; i++) {
          articulos.push({
            articulo: it.comprobante.items[i].articulo,
            valor_id: it.comprobante.items[i].valor_id,
            articulo_id: it.comprobante.items[i].articulo_id,
            cantidad: it.comprobante.items[i].cantidad,
            cantidadoriginal: it.comprobante.items[i].cantidadoriginal,
            comprobante_id: it.comprobante.items[i].comprobante_id,
            costo: it.comprobante.items[i].costo,
            costoanterior: it.comprobante.items[i].costoanterior,
            created_at: it.comprobante.items[i].created_at,
            deposito_id: null,
            faltante: it.comprobante.items[i].faltante,
            id: it.comprobante.items[i].id,
            importedescuento: it.comprobante.items[i].importedescuento,
            iva_id: it.comprobante.items[i].iva_id,
            moneda_id: it.comprobante.items[i].moneda_id,
            precio: it.comprobante.items[i].precio,
            preciooriginal: it.comprobante.items[i].preciooriginal,
            stock: it.comprobante.items[i].stock,
            tasadescuento: it.comprobante.items[i].tasadescuento,
            texto: it.comprobante.items[i].texto,
            total: it.comprobante.items[i].total,
            unidad_id: it.comprobante.items[i].unidad_id,
            updated_at: it.comprobante.items[i].updated_at,
            vencimiento: it.comprobante.items[i].vencimiento,
            desc1: it.comprobante.items[i].desc1,
            desc2: it.comprobante.items[i].desc2,
          })
        }

        let idProv = it.user_id_desde
        let idTercero = it.userdesde.tercero_id
        this.$store.commit('actNotificacion', it.id, { root: true });

        debugger
        if (it.comprobante.tipo=='CO') {    // descarga un pedido

          let novedad = {
            cpr_id: it.comprobante.id,
            novedad: 'Recepción del pedido',
            rel_id: null,
            estado: 'N',
            accion: 'ACTUALIZA',
          }

          return HTTP().post('/descargarpedido', { 
            comprobante: it.comprobante,
            sucursales: this.sucursales,
            depositos: this.depositos,
            notificacion: it.id,
            viaje_id: it.comprobante.viaje_id,
            }).then(({ data }) => {

            if (data=='error') {
              this.mensaje('¡Se ha producido un error al intentar descargar este pedido!', this.temas.snack_error_bg, 2500) 
            } else {
              this.borroNotificacion(it,1)
              if (data=='ya descargado') {
                this.mensaje('¡Este comprobante ya fue descargado por otro usuario!', this.temas.snack_error_bg, 2500) 
              } else {
                this.mensaje('¡Comprobante descargado correctamente!', this.$store.state.temas.forms_titulo_bg, 1500) 
              }
            }

          });

        } else if (it.comprobante.tipo=='VE') {   // descarga una fac de un proveedor

          if (it.comprobante.observaciones=='VENTA DE CHEQUES') {

            valores = []
            articulos = []
            pendientes = []
            for (let i=0; i<=it.comprobante.valoresEgresos.length-1; i++) {
              it.comprobante.valoresEgresos[i].fechafinanciera = moment(it.comprobante.valoresEgresos[i].fechafinanciera).format('YYYY-MM-DD')
              it.comprobante.valoresEgresos[i].fechasalida = null
            }

            return HTTP().post('/nuevacompra', {
              fecha: it.comprobante.fecha.substring(0,10),
              perfiscal: it.comprobante.perfiscal.substr(0,4)+'-'+it.comprobante.perfiscal.substr(4,2),
              ctacte: it.comprobante.ctacte,
              vencimiento: moment(it.comprobante.vencimiento).format('YYYY-MM-DD'),
              tipo: 'CO',
              cpr: 'CIN-X '+this.$store.state.sucursalFiscal+'-00000000',
              user_id: this.userId,
              sucursal_id: this.$store.state.sucursal,
              tercero_id: idTercero,
              comprobante_id: it.comprobante.comprobante_id,
              direccion_id: it.comprobante.direccion_id,
              documento_id: it.comprobante.tercero.documento_id,
              mediodepago_id: 1,
              deposito_id: null,   // mando como null, luego la api vera a que deposito de la sucursal imputa.
              vendedor_id: null,
              moneda_id: it.comprobante.moneda_id,
              tasadescuento: 0,
              importedescuento: 0,
              retiva: 0,
              retgan: 0,
              retib: 0,
              gravado: 0,
              exento: 0,
              iva: 0,
              impint: 0,
              nogravado: 0,
              flete: 0,
              poradcosto: 0,
              total: it.comprobante.total,
              regstk: false,
              estado: 'F',
              activo: true,
              articulos: [],
              observaciones: 'COMPRA DE CHEQUES',
              valores: it.comprobante.valoresEgresos,                 // ESTO ESTA MAL, PUEDE VENIR EN EFECTIVO U OTROS VALORES
              notificacion: it.id,
              gasto: null,
              tasasIVA: it.comprobante.afipiva,
              idProv: idProv,
            }).then(({ data }) => {
              this.mensaje('¡Comprobante descargado correctamente!', this.$store.state.temas.forms_titulo_bg, 2000)
              this.borroNotificacion(it,1)
            });

          } else {    // NO ES VENTA DE CHEQUES

            // CHEQUES RECHAZADOS
            // CUANDO ES UNA FACTURA X CHEQUE RECHAZADO, EL USUARIO DEBERA GENERAR EL RECHAZO DESDE TESORERIA.

            let obsv = ''
            // ACA TENGO QUE AGREGAR PENDIENTES SI HAY Y/O VALORES SI TAMBIEN HAY
            // ESTAN EL IT.COMPROBANTE.PENDIENTES Y IT.COMPROBANTE.VALORESINGRESOS
            if (it.comprobante.cpr.substr(0,3)!='PED') {
              obsv = 'COMPRA DESCARGADA'
              if (it.comprobante.valoresIngresos.length>0) {
                valores.push(it.comprobante.valoresIngresos)
              }
            } else {
              obsv = 'PEDIDO'
            }

            // INVIERTO EL SINGNO ( VER SI CUANDO VIENE NDC VIENEN POSITIVOS )
            let coef = 1
            if (it.comprobante.cpr.substr(0,3)=='NDC') {
              coef = -1
            }
            for (let i=0; i<=articulos.length-1; i++) {
              if (articulos[i].articulo_id==8) {  // rechazo por cheques
                articulos[i].stock = 0
              } else {
                articulos[i].stock = Math.abs(articulos[i].stock) * coef
              }
            }

            // tengo que ver si es una compra o un gasto
            let pos = it.userdesde.tercero.usersterceros.findIndex(x => x.tercero_id==idTercero)
            let regstk = true
            let cogs = 'CO'
            if (it.userdesde.tercero.usersterceros[pos].tipo_id==7) {
              cogs = 'GS'
              regstk = false
            } 
            return HTTP().post('/nuevacompra', {
              fecha: it.comprobante.fecha.substring(0,10),
              perfiscal: it.comprobante.perfiscal.substr(0,4)+'-'+it.comprobante.perfiscal.substr(4,2),
              ctacte: it.comprobante.ctacte,
              vencimiento: moment(it.comprobante.vencimiento).format('YYYY-MM-DD'),
              tipo: cogs,
              cpr: it.comprobante.cpr,
              user_id: this.userId,
              sucursal_id: this.$store.state.sucursal,
              tercero_id: idTercero,
              comprobante_id: it.comprobante.comprobante_id,
              direccion_id: it.comprobante.direccion_id,
              documento_id: it.comprobante.tercero.documento_id,
              mediodepago_id: it.comprobante.mediodepago_id,
              deposito_id: null,   // mando como null, luego la api vera a que deposito de la sucursal imputa.
              vendedor_id: null,
              moneda_id: it.comprobante.moneda_id,
              tasadescuento: it.comprobante.tasadescuento,
              importedescuento: it.comprobante.importedescuento,
              retiva: it.comprobante.retiva,
              retgan: it.comprobante.retgan,
              retib: it.comprobante.retib,
              gravado: it.comprobante.gravado,
              exento: it.comprobante.exento,
              iva: it.comprobante.iva,
              impint: it.comprobante.impint,
              nogravado: it.comprobante.nogravado,
              flete: it.comprobante.flete,         
              poradcosto: it.comprobante.poradcosto,
              total: it.comprobante.total,
              regstk: regstk,
              estado: 'F',
              activo: true,
              articulos: articulos,
              observaciones: obsv,
              valores: valores,                 // ESTO ESTA MAL, PUEDE VENIR EN EFECTIVO U OTROS VALORES
              notificacion: it.id,
              gasto: cogs=='GS'?true:false,
              tasasIVA: it.comprobante.afipiva,
              idProv: idProv,
              }).then(({ data }) => {
  
              debugger
              if (data.estado=='error') {
                this.msg.msgTitle = '¡Error!'
                let m = 'Se ha producido un error en la descarga de este comprobante.</b><br>'
                m += 'Reintenta, si el error persistema comunícate con <b>gohu</b>'
                this.msg.msgBody = m
                this.msg.msgVisible = true
                this.msg.msgAccion = 'Error en Descarga'
                this.msg.msgButtons = ['Aceptar']
              } else {
                this.msg.msgTitle = '¡Descarga Correcta!'
                let m = 'Comprobante descargado correctamente.</b><br><br>'
                if (data.articulos>0) {
                  if ( data.articulos == 1) {
                    m += '¡Se agregó '+data.articulos+' artículo a tu sistema!.<br>'
                    m += 'Podrás configurarlo asignandole grupo, marca, remarcación, etc.'
                  } else {
                    m += '¡Se agregaron '+data.articulos+' artículos a tu sistema!.<br>'
                    m += 'Podrás configurarlos y asignarles grupos, marcas, remarcaciones, etc.'
                  }
                  this.msg.msgBody = m
                  this.msg.msgVisible = true
                  this.msg.msgAccion = 'Descarga Correcta'
                  this.msg.msgButtons = ['Aceptar']
                } else {
                  this.mensaje('¡Comprobante descargado correctamente!', this.$store.state.temas.forms_titulo_bg, 2000) 
                }
              }
              this.borroNotificacion(it,1)
            });
          }

        } else if (it.comprobante.tipo=='PG') {   // descarga un pago

          it.sucursalFiscal = this.$store.state.sucursalFiscal
          it.sucursal       = this.$store.state.sucursal
          it.caja           = this.$store.state.caja
          let notificacion  = 0
          if (this.$store.state.notificaciones.length>0) {
            let pos = this.$store.state.notificaciones.findIndex(x=>x.id==it.id)
            notificacion = this.$store.state.notificaciones[pos].id
          }

          debugger
          return HTTP().post('/descargarpago', { it, notificacion }).then(({ data }) => {
            if (data.errno!=undefined) {
              this.mensaje('¡Se ha producido un error en la descarga de este comprobante! '+data.sqlMessage, this.$store.state.temas.snack_error_bg, 5000, true) 
            } else if (data=='notificacion inexsistente') {
              this.mensaje('¡Notificacion inexistente, es probable que el remitente la haya eliminado! ', this.$store.state.temas.snack_error_bg, 3000, true) 
            } else if (data=='notificacion ya descargada') {
              this.mensaje('¡Otro usuario ya descargo este comprobante! VERIFIQUE ', this.$store.state.temas.snack_error_bg, 3000, true) 
            } else {
              this.msg.msgTitle = '¡Descarga Correcta!'
              let m = '<br>¡El Pago ha sido descargado correctamente!.<br>'
              m += '<br>Los valores incluidos en el mismo ya están disponibles en tu sistema!<br>'
              m += '<br>Se generó el Recibo '+data.cpr+' cancelando la Cuenta Corriente!<br>'
              this.msg.msgBody = m
              this.msg.msgVisible = true
              this.msg.msgAccion = 'generacion de recibo correcta'
              this.msg.msgButtons = ['Aceptar']
              this.borroNotificacion(it,1)
            }
          });
        }
      },

      rechazarCpr(nov) {
        this.detRechazo = ''
        this.itemActual = nov
        this.dialogRechazarCpr = true
      },

      confirmarRechazoCpr() {
        this.dialogRechazarCpr = false
        return HTTP().post('/rechazarcpr', { nota: this.itemActual, motivo: this.detRechazo }).then(({ data }) => {
          if (data=='ok') {
            this.mensaje('¡La operación se ha rechazado correctamente y el remitente ha sido notificado!', this.$store.state.temas.forms_titulo_bg, 3000) 
            this.borroNotificacion(this.itemActual,1)
          } else {
            this.mensaje('¡Se ha producido un error en intentar rechazar esta notificacion. Reintente!', this.$store.state.temas.snack_error_bg, 3000) 
          }
        });
      },

      borroNotificacion(not,queArray) {
        if (queArray==1) {  //borra del this.notCprs
          this.contador = 1
          this.actualizarContador()
        } else if (queArray==5) {
          this.notUsrs = this.notUsrs.filter(x=>x.id!=not.id)
          this.novUsrs = this.notUsrs.length
          this.$store.commit('setNovedadesUsrs', this.novUsrs, { root: true });
          if (this.notUsrs.length==0) {
            this.dialogNotUsrs = false
          }
        } else {
          this.contador = 1
          this.actualizarContador()
        }
      },

      verCpr(it) {
        this.$refs.impresion.ventasPrint(it, 'el');
      },

      showChequeRechazado(nov) {
        let show = false
        if (nov.comprobante!=undefined) {
          if (nov.comprobante.items!=undefined && nov.comprobante.items.length>0) {
            show = nov.comprobante.items[0].valor_id!=null
          }
        }
        return show
      },

      verChequeRechazado(nov) {
        return HTTP().post('/verchequerechazado/', { valor_id: nov.comprobante.items[0].valor_id }).then(({ data })=>{
          if (data=='error') {
            this.mensaje('¡Opps, no se ha podido encontrar el valor a Rechazar, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500)
          } else {
            this.chqRzdo.observ = data[0].observ;
            this.msg.msgTitle = 'Cheque Rechazado'
            let msg = '<br>¡Te han rechazado este cheque!<br><br>'
            if (data[0].cpringreso_id==null) {
              msg += 'Entrego:\xa0<b>CHEQUE PROPIO</b><br><br>'
            } else {
              msg += 'Te lo entrego:\xa0<b>'+data[0].cliente+'</b><br><br>'
            }
            msg += 'Id del Movimiento:\xa0<b>'+data[0].id+'</b><br>'
            msg += 'Fecha Financiera:\xa0<b>'+moment(data[0].fechafinanciera).format('DD/MM/YY')+'</b><br>'
            msg += 'Número del Cheque:\xa0<b>'+data[0].nrovalor+'</b><br>'
            msg += 'Banco:\xa0<b>'+data[0].banco+'</b><br>'
            msg += 'Importe:\xa0<b>$'+this.formatoImporte(data[0].importe)+'</b><br><br>'

            if (data[0].cpringreso_id==null) {
              msg += 'Cuando bajes esta factura se anulará el movimiento '
              msg += 'bancario correspondinte a este cheque.'
            } else {
              msg += 'Si deseas rechazar este cheque deberás hacerlo desde Tesorería. '
              msg += 'Desde ahí podrás emitir una factura a <b>'+data[0].cliente+'</b> para compensar este rechazo.'
            }

            this.msg.msgBody = msg
            this.msg.msgVisible = true
            this.msg.msgAccion  = 'Cheque a Rechazar'
            this.msg.msgButtons = ['Aceptar']
//          this.dialogVerChequeRechazado = true
          }
        })
      },

      enviarAExcel(nov) {
        // preparo
        let enviar = []
        enviar.push({
          enviadopor: nov.userdesde.username,
          comprobante: nov.comprobante.cpr,
        })
        for (let i=0; i<=nov.comprobante.items.length-1; i++) {
          enviar.push({
            articulo: nov.comprobante.items[i].articulo.codigo,
            nombre: nov.comprobante.items[i].articulo.nombre,
            unidades: nov.comprobante.items[i].cantidad,
            precio: nov.comprobante.items[i].precio,
            total: nov.comprobante.items[i].total,
          })
        }
        let d = XLSX.utils.json_to_sheet(enviar)
        const workbook = XLSX.utils.book_new()
        const filename = nov.comprobante.cpr
        XLSX.utils.book_append_sheet(workbook, d, filename)
        XLSX.writeFile(workbook, `${filename}.xlsx`)
      },

      fechaTimeLine(value) {
        return moment(String(value)).format('D MMM-YY h:mm a')
      },

      formatoImporte(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },

      cambioProveedor(cual) {
        if (cual) {
          if (cual.id == 0) {
            this.$store.commit('setProveedor', 0, { root: true });
          } else {
            // HEV aca debo actualizar el proveedor actual por si cambio el preciosconiva
            //operarioEsVendedor: this.$store.state.operarioEsVendedor,
            return HTTP().post('/releoproveedorparaelstate/', { proveedor: cual.id }).then(({ data })=>{
              this.$store.commit('setProveedor', data[0], { root: true });
              this.$store.commit('setGrupoCarrito', 9999999, { root: true });
            })
          }
        }
      },

      cambioSucursal(cual) {
        if (cual==undefined) return 
        if (cual.id==undefined) return
        for (let i=0; i<=this.sucursales.length-1; i++) {
          if (this.sucursales[i].id == cual.id) {
            this.$store.commit('setSucursalFiscal',this.sucursales[i].fiscal, { root: true })
            this.$store.commit('setTemas',this.sucursales[i].tema, { root: true })
            this.$store.commit('setSucursalDemo',this.sucursales[i].sucursaldemo, { root: true })
            this.$store.commit('setSucursalManual',this.sucursales[i].manual, { root: true })
            break
          }
        }
        this.$store.commit('setSucursal', cual.id, { root: true });

        return HTTP().get('/userscaja/'+this.sucursal).then(({data}) => {
          this.$store.commit('setCaja',data[0].id, { root: true })

//          return HTTP().post('/datosparaelpanel', { sucursal: this.sucursal } ).then(({ data }) => {
//            if (data.length>0) {
//              this.$store.commit('setDatosPanel', {
//                ventasDelDia:         data[0].ventasDelDia,
//                ventasCttCbtesDelDia: data[0].ventasCttCbtesDelDia,
//                ventasDelMes:         data[0].ventasDelMes,
//                ventasCttCbtesDelMes: data[0].ventasCttCbtesDelMes,
//                comprasDelMes:        data[0].comprasDelMes,
//                gastosDelmes:         data[0].gastosDelmes,
//                debAVencer:           data[0].debAVencer,
//                debVencidos:          data[0].debVencidos,
//                creAVencer:           data[0].creAVencer,
//                creVencidos:          data[0].creVencidos,
//                anotador:             data[0].anotador,
//                pedCantidad:          data[0].pedCantidad,
//                pedTotal:             data[0].pedTotal,
//              }, { root: true });
//            }

            if (this.$store.state.level==3) { // VENDEDOR
              let aux = []
              for (let i=0; i<=this.roles.length-1; i++) {
                aux.push ( {
                  id:         this.roles[i].id,
                  nombre:     this.roles[i].nombre,
                  tipo:       this.roles[i].tipo,
                  activo:     this.roles[i].activo,
                  opcion_id:  this.roles[i].opcion_id,
                  acceder:    i==0 ? true : false,
                  agregar:    i==0 ? true : false,
                  editar:     i==0 ? true : false,
                  desactivar: i==0 ? true : false,
                  state:      this.roles[i].state, 
                })
              }
              return HTTP().post('/roles',{ tercero: this.$store.state.operarioUserId, sucursal: cual.id }).then(({ data }) => {
                for (let i=0; i<=data.length-1; i++) {
                  for (let j=0; j<=aux.length-1; j++) {
                    if (data[i].opcion_id == aux[j].opcion_id) {
                      aux[j].acceder = data[i].acceder
                      aux[j].agregar = data[i].agregar
                      aux[j].editar = data[i].editar
                      aux[j].desactivar = data[i].desactivar
                      break
                    }
                  }
                }
                this.$store.commit('setRoles', aux, { root: true });
              })
            }
//          })
        })
      },

      async actualizoRoles(cual) {
        let aux = []
        for (let i=0; i<=this.roles.length-1; i++) {
          aux.push ( {
            id:         this.roles[i].id,
            nombre:     this.roles[i].nombre,
            tipo:       this.roles[i].tipo,
            activo:     this.roles[i].activo,
            opcion_id:  this.roles[i].opcion_id,
            acceder:    i==0 ? true : false,
            agregar:    i==0 ? true : false,
            editar:     i==0 ? true : false,
            desactivar: i==0 ? true : false,
            state:      this.roles[i].state, 
          })
        }
        return HTTP().post('/roles',{ 
          tercero: this.$store.state.operarioUserId,
          sucursal: this.sucursales[this.sucursal].id }).then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            for (let j=0; j<=aux.length-1; j++) {
              if (data[i].opcion_id == aux[j].opcion_id) {
                aux[j].acceder = data[i].acceder
                aux[j].agregar = data[i].agregar
                aux[j].editar = data[i].editar
                aux[j].desactivar = data[i].desactivar
                break
              }
            }
          }
          this.$store.commit('setRoles', aux, { root: true });
        })
      },

      getEstadoDelVinculo(us) {
        let ret = ''
        if (us.vinculado==1) {
          ret = us.pausado ? 'Pausado' : 'Activo'
          return ret
        }
        if (us.solicitud==1) {
          return us.esElQue == 'Envía' ? 'Esperando aprobación 1' : 'Esperando aprobación 2'
        } else if (us.ver==0) {
          return 'Descartado'
        } else if (us.activo) {
          return 'Activo'
        } else {
          return 'No vinculado'
        }
      },

      usuarioDejarDeVer(usuario) {
        return HTTP().post('/vinculodejardever', { vinculo: usuario.vinculo_id }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500)
          } else {
            this.mensaje('¡El usuario ha sido descartado!', this.$store.state.temas.forms_titulo_bg, 2500)
            let pos = this.usuarios.findIndex(x=>x.vinculo_id===usuario.vinculo_id)
            if (pos!=-1) {
              this.usuarios[pos].ver = 0
            }
            this.vinculosPanel[this.vinculosAVerCual-1].ctt --
            this.vinculosPanel[2].ctt ++  // descartados
            this.vinculosVer(1)
            if (this.usuarios.length==0) {
              this.vinculosVer(3)
            }
          }
        }).catch((e) => {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500)
        });
      },

      usuariosDejarDeVer() {
        return HTTP().post('/vinculosdejardevertodos', { usuarios: this.usuarios }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500)
          } else {
            this.mensaje('¡'+this.usuarios.length+' usuarios han sido descartados!', this.$store.state.temas.forms_titulo_bg, 2500)
            for (let i=0; i<=this.usuarios.length-1; i++) {
              this.usuarios[i].ver = 0
              this.vinculosPanel[this.vinculosAVerCual-1].ctt --
              this.vinculosPanel[2].ctt ++  // descartados
            }
            this.vinculosVer(1)
            if (this.usuarios.length==0) {
              this.vinculosVer(3)
            }
          }
        }).catch((e) => {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500)
        });
      },

      usuarioVerDeNuevo(usuario) {
        return HTTP().post('/vinculoverdenuevo', { vinculo: usuario.vinculo_id }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500)
          } else {
            this.mensaje('El usuario se ha vuelto a activar!', this.$store.state.temas.forms_titulo_bg, 2500)
            let pos = this.usuarios.findIndex(x=>x.vinculo_id===usuario.vinculo_id)
            if (pos!=-1) {
              this.usuarios[pos].ver = 1
            }
            this.vinculosPanel[0].ctt ++  // nuevos
            this.vinculosPanel[2].ctt --  // descartados
            this.vinculosVer(3)
            if (this.usuarios.length==0) {
              this.vinculosVer(1)
            }
          }
        }).catch((e) => {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500)
        });
      },

      usuariosVerDeNuevo(usuario) {
        return HTTP().post('/vinculosverdenuevotodos', { usuarios: this.usuarios }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2500)
          } else {
            this.mensaje('¡'+this.usuarios.length + ' usuarios han pasado de verse de nuevo!', this.$store.state.temas.forms_titulo_bg, 2500)
            for (let i=0; i<=this.usuarios.length-1; i++) {
              this.usuarios[i].ver = 1
              this.vinculosPanel[0].ctt ++  // nuevos
              this.vinculosPanel[2].ctt --  // descartados
            }
            this.vinculosVer(3)
            if (this.usuarios.length==0) {
              this.vinculosVer(1)
            }
          }
        }).catch((e) => {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500)
        });
      },

      enviarSolicitudVinculo() {
        this.dialogSolicitarVinculo = false
        return HTTP().post('/vinculosolicitar', { 
          usuario: this.nuevoVinculo.user_id, como: this.vincularComo }).then(({ data }) => {
          if (data=='ok') {
            this.mensaje('¡La solicitud se ha enviado con éxito!', this.$store.state.temas.forms_titulo_bg, 2000)
            this.vinculosPanel[0].ctt --  // nuevos
            this.vinculosPanel[3].ctt ++  // solicitudes
            let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
            this.usuarios[pos].solicitud = true
            this.vinculosVer(4)
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2000)
          }
        })
      },

      aceptarSolicitudDeVinculoHTTP() {
        this.dialogAceptarVinculo = false
        return HTTP().post('/vinculoaceptar', { 
          usuario: this.nuevoVinculo.user_id,
          vinculo: this.nuevoVinculo.vinculo_id,
          notificacion: this.nuevoVinculo.notificacion_id,
          rol: this.nuevoVinculo.rol
          }).then(({ data }) => {
          if (data=='ok') {
            return HTTP().get('/vinculos/true').then(({ data }) => {
              this.setVinculos(data.vi, data.nt, data.exProv, data.exClie)
              this.mensaje('¡El vículo se ha generado con éxito!', this.$store.state.temas.forms_titulo_bg, 2000)
              this.vinculosPanel[3].ctt --  // solicitudes
              this.vinculosPanel[1].ctt ++  // solicitudes
              let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
              this.usuarios[pos].solicitud = 0
              this.usuarios[pos].vinculado = 1
              this.vinculosVer(2)
            })
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2000)
          }
        })
      },

      rechazarSolicitudDeVinculoHTTP() {
        this.dialogRechazarVinculo = false
        return HTTP().post('/vinculorechazar', { 
          vinculo: this.nuevoVinculo.vinculo_id,
          notificacion: this.nuevoVinculo.notificacion_id,
          motivo: this.detRechazo,
          }).then(({ data }) => {
          if (data=='ok') {
            return HTTP().get('/vinculos/true').then(({ data }) => {
              this.setVinculos(data.vi, data.nt, data.exProv, data.exClie)
              this.mensaje('¡El vículo ha sido procesado con éxito!', this.$store.state.temas.forms_titulo_bg, 2000)
              this.vinculosPanel[3].ctt --  // solicitudes
              this.vinculosPanel[2].ctt ++  // solicitudes
              let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
              this.usuarios[pos].solicitud = 0
              this.usuarios[pos].vinculado = 0
              this.usuarios[pos].ver = 0
              this.vinculosVer(2)
            })
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2000)
          }
        })
      },

      aceptarPausarVinculo() {
        this.dialogPausarVinculo = false
        return HTTP().post('/vinculopausar', { usuario: this.nuevoVinculo.vinculo_id }).then(({ data }) => {
          if (data=='ok') {
            this.mensaje('¡El vínculo ha sido pausado!', this.$store.state.temas.forms_titulo_bg, 2000)
            let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
            this.usuarios[pos].pausado = 1
            this.actualizoProveedores()
            this.vinculosVer(2)
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2000)
          }
        })
      },

      aceptarReanudarVinculo() {
        this.dialogReanudarVinculo = false
        return HTTP().post('/vinculoreanudar', { usuario: this.nuevoVinculo.vinculo_id }).then(({ data }) => {
          if (data=='ok') {
            this.mensaje('¡El vínculo ha sido reanudado!', this.$store.state.temas.forms_titulo_bg, 2000)
            let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
            this.usuarios[pos].pausado = 0
            this.actualizoProveedores()
            this.vinculosVer(2)
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2000)
          }
        })
      },

      cancelarVinculo() {
        this.dialogCancelarVinculo = false
        return HTTP().post('/vinculocancelar', { vinculo: this.nuevoVinculo.vinculo_id }).then(({ data }) => {
          if (data=='ok') {
            return HTTP().get('/vinculos/true').then(({ data }) => {
              this.setVinculos(data.vi, data.nt, data.exProv, data.exClie)
              this.mensaje('¡El vículo se ha cancelado con éxito!', this.$store.state.temas.forms_titulo_bg, 2000)
              this.vinculosPanel[0].ctt ++  // nuevos
              this.vinculosPanel[1].ctt --  // vinculados
              let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
              this.usuarios[pos].solicitud = 0
              this.usuarios[pos].vinculado = 0
              this.vinculosVer(1)
            })
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.snack_error_bg, 2000)
          }
        })
      },

      usuarioSolicitarVinculo(usuario) {
        this.dialogSolicitarVinculo = true
        this.nuevoVinculo = usuario
        this.vincularComo = this.vinculosAVerCualTipo==1?'C':'P'
      },

      usuarioAceptarVinculo(usuario) {
        this.dialogAceptarVinculo = true
        this.nuevoVinculo = usuario
        let uid = usuario.rol=='P' ? usuario.user_id : this.userId
        return HTTP().get('/vinculoarticulosatransferir/'+uid).then(({ data }) => {
          if (data!=null) {
            this.transferirArticulosCtt = data
          }
        })

      },

      usuarioRechazarVinculo(usuario) {
        this.dialogRechazarVinculo = true
        this.nuevoVinculo = usuario
      },

      usuarioMasInformacion(usuario) {
        this.nuevoVinculo = usuario
        this.dialogMasInformacion = true
        return HTTP().post('/vinculomasinformacion/', {id: usuario.user_id}).then(({data})=>{
          this.masInfo.razonSocial = data[0].tercero.razon_social
          this.masInfo.direccion = data[0].tercero.direcciones[0].direccion
          this.masInfo.localidad = data[0].tercero.direcciones[0].postal.nombre
          this.masInfo.provincia = data[0].tercero.direcciones[0].postal.provincia.nombre
          this.masInfo.tipoDeResponsable = data[0].tercero.responsable.nombre
          this.masInfo.tipoDeLicencia = data[0].tipo
          this.masInfo.cuit = data[0].tercero.cuit
          this.masInfo.calificacion = data[0].meta.promedio
          this.masInfo.observ = data[0].observ
          this.masInfo.enGohuDesdeEl = data[0].created_at
          this.masInfo.contactos = data[0].tercero.contactos
          this.masInfo.cttUsrsVinculados = data[0].meta.vinculos_count
          this.masInfo.cttArticulos = data[0].meta.precios_count
          this.masInfo.cttPedidos = data[0].meta.comprobantes_count
          this.masInfo.mediosdecobro = data[0].medios
          this.masInfo.distribuidor = data[0].distribuidor
        })
      },

      usuarioCancelarVinculo(usuario) {
        // tengo que ver si entre estos dos usuarios hay deuda, 
        // si es asi no se puede cancelar el vínculo

        // gilgamesh
        debugger
        return HTTP().post('/deudaentreusuarios', { vinculo: usuario }).then(({ data }) => {

          debugger
          if (data!=0) {
            this.msg.msgTitle = '¡Error!'
            let m = '¡No se puede cancelar este vínculo!, <br>Tienes saldos pendientes en Cuentas Corrientes '
            m += 'por $'+this.formatoImporte(data)+'<br>'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'No se puede cancelar el vínculo.'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.dialogCancelarVinculo = true
            this.nuevoVinculo = usuario
          }
        });
      },

      usuarioPausarVinculo(usuario)  {
        this.dialogPausarVinculo = true
        this.nuevoVinculo = usuario
        // aca debo buscar la catidad de articulos a transferir
      },

      usuarioReanudarVinculo(usuario)  {
        this.dialogReanudarVinculo = true
        this.nuevoVinculo = usuario
        // aca debo buscar la catidad de articulos a transferir
      },

      closeSolicitarVinculo() {
        this.dialogSolicitarVinculo = false
      },

      closeAceptarVinculo() {
        this.dialogAceptarVinculo = false
      },

      closeRechazarVinculo() {
        this.dialogRechazarVinculo = false
      },

      closeNueVinOk() {
        this.dialogVinOk = false
      },

      closePausarVinculo() {
        this.dialogPausarVinculo = false
      },

      closeReanudarVinculo() {
        this.dialogReanudarVinculo = false
      },

      closeCancelarVinculo() {
        this.dialogCancelarVinculo = false
      },

      closeMasInformacion() {
        this.dialogMasInformacion = false
      },

      mensaje(mensaje, color, tiempo, boton=false) {
        this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:boton});
        setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
      },

      ofertasOnOff() {
        this.$store.commit('setOfertas', !this.$store.state.ofertas, { root: true });
      },

      setVinculos(vi, nt, exProv, exClie) {
        let pad = []
        let hij = []
        let pos = -1

        // AGREGO E INICIALIZO
        for (let i=0; i<=vi.length-1; i++) {
          vi[i].not = 0
          vi[i].tipo = ''
        }

        for (let i=0; i<=nt.length-1; i++) {
          pos = vi.findIndex(x=>x.user_id_desde == nt[i].user_id)
          if (pos!=-1) {
            vi[pos].not = nt[i].id
            vi[pos].tipo = nt[i].tipo
            if (nt[i].como=='cliente') {
              vi[pos].como='C'
            } else if (nt[i].como=='proveedor') {
              vi[pos].como='P'
            }
          } else {
            pos = vi.findIndex(x=>x.user_id_hasta == nt[i].user_id)
            if (pos!=-1) {
              vi[pos].not = nt[i].id
              vi[pos].tipo = nt[i].tipo
              if (nt[i].como=='cliente') {
                vi[pos].como='P'
              } else if (nt[i].como=='proveedor') {
                vi[pos].como='C'
              }
            }
          }
        }

        let excl = 0
        for (let i=0; i<=vi.length-1; i++) {

          if (vi[i].como == 'P') {

            // el desde es proveedor del hasta
            if (vi[i].user_id_desde == this.userId) {

              // el usuario actual esta en DESDE (uid1), agrego en hijos el hasta
              excl = exClie.findIndex(x=>x==vi[i].user_id_desde)
              if (excl==-1) {
                let esElQue =  vi[i].tipo!=undefined?vi[i].tipo:''
                this.agregoVinculo(hij, vi[i], esElQue, 'H', 2)
              }

            } else { // el usuario actual esta en HASTA uid2

              // el usuario actual esta en HASTA (uid2), agrego en padres el desde
              excl = exProv.findIndex(x=>x==vi[i].user_id_desde)
              if (excl==-1) {
                let esElQue =  vi[i].tipo!=undefined?vi[i].tipo:''
                this.agregoVinculo(pad, vi[i], esElQue, 'P', 1)
              }

            }

          } else if (vi[i].como == 'C') {

            // el desde es cliente del hasta
            if (vi[i].user_id_desde == this.userId) {
              // el usuario actual esta en DESDE (uid1), agrego en padres el hasta
              excl = exProv.findIndex(x=>x==vi[i].user_id_hasta)
              if (excl==-1) {
                let esElQue =  vi[i].tipo!=undefined?vi[i].tipo:''              
                this.agregoVinculo(pad, vi[i], esElQue, 'P', 2)
              }
            } else {
              // el usuario actual esta en HASTA (uid2), agrego en hijos el desde
              excl = exClie.findIndex(x=>x==vi[i].user_id_hasta)
              if (excl==-1) {
                let esElQue =  vi[i].tipo!=undefined?vi[i].tipo:''              
                this.agregoVinculo(hij, vi[i], esElQue, 'H', 1)
              }
            }

          } else {

            if (vi[i].user_id_desde == this.userId) {
              // el usuario actual esta en DESDE (uid1), agrego en hijos el hasta
              excl = exClie.findIndex(x=>x==vi[i].user_id_hasta||x==vi[i].user_id_desde)
              if (excl==-1) {
                this.agregoVinculo(hij, vi[i], '', 'H', 2)
              }

              excl = exProv.findIndex(x=>x==vi[i].user_id_hasta||x==vi[i].user_id_desde)
              if (excl==-1) {
                this.agregoVinculo(pad, vi[i], '', 'P', 2)
              }

            } else {                                                
              // el usuario actual esta en HASTA (uid2), agrego en padres el desde

              excl = exProv.findIndex(x=>x==vi[i].user_id_hasta||x==vi[i].user_id_desde)
              if (excl==-1) {
                this.agregoVinculo(pad, vi[i], '', 'P', 1)
              }

              excl = exClie.findIndex(x=>x==vi[i].user_id_desde||x==vi[i].user_id_hasta)
              if (excl==-1) {
                this.agregoVinculo(hij, vi[i], '', 'H', 1)
              }
            }
          }
        }

        this.vinculosHijosLoc = hij
        this.vinculosPadresLoc = pad
        let padres = []
        let hijos = []
        for (let i=0; i<=pad.length-1; i++) {
          if (pad[i].vinculado==1 && pad[i].pausado==0) {
            padres.push(pad[i].user_id)
          }
        }
        for (let i=0; i<=hij.length-1; i++) {
          if (hij[i].vinculado==1 && hij[i].pausado==0) {
            hijos.push(hij[i].user_id)
          }
        }

        debugger
        this.$store.commit('setVinculosPadres', padres, { root: true });
        this.$store.commit('setVinculosHijos', hijos, { root: true });
        let losProv = []
        if (this.operarioEsVendedor==false) {
          losProv.push({
            avatar:'Sin Avatar.jpg',id:0,nombre:'SIN SELECCIONAR',preciosconiva:0,tercero_id:null,administragohu:false
          })
        }
        for (let i=0; i<= pad.length-1; i++) {
          if (pad[i].vinculado && !pad[i].pausado) {
            losProv.push({
              avatar:         pad[i].avatar,
              id:             pad[i].user_id,
              nombre:         pad[i].nombre,
              preciosconiva:  pad[i].preciosconiva,
              tercero_id:     pad[i].tercero_id,
              administragohu: pad[i].administragohu,
            })
          }
        }

        // agrego las ciudades de los usuarios
        this.ubicaciones = []
        for (let i=0; i<=vi.length-1; i++) {
          pos = this.ubicaciones.findIndex(x=>x.nombre===vi[i].userDesde.tercero.direcciones[0].postal.nombre)
          if (pos==-1) {
            this.ubicaciones.push({ nombre: vi[i].userDesde.tercero.direcciones[0].postal.nombre, sel: false, })
          }
          pos = this.ubicaciones.findIndex(x=>x.nombre===vi[i].user.tercero.direcciones[0].postal.nombre)
          if (pos==-1) {
            this.ubicaciones.push({ nombre: vi[i].user.tercero.direcciones[0].postal.nombre, sel: false, })
          }
        }

        if (!this.$store.state.proveedor.id) {
          this.$store.commit('setProveedor', losProv[0] , { root: true})
        }
        this.$store.commit('setProveedores', losProv , { root: true})
      },

/*
      setVinculos2(vi, nt, exProv, exClie) {
        let pad = []
        let hij = []
        let pos = -1
        // AGREGO E INICIALIZO
        for (let i=0; i<=vi.length-1; i++) {
          vi[i].not = 0
          vi[i].tipo = ''
        }

        for (let i=0; i<=nt.length-1; i++) {
          pos = vi.findIndex(x=>x.uid1 == nt[i].user_id)
          if (pos!=-1) {
            vi[pos].not = nt[i].id
            vi[pos].tipo = nt[i].tipo
            if (nt[i].como=='cliente') {
              vi[pos].como='C'
            } else if (nt[i].como=='proveedor') {
              vi[pos].como='P'
            }
          } else {
            pos = vi.findIndex(x=>x.uid2 == nt[i].user_id)
            if (pos!=-1) {
              vi[pos].not = nt[i].id
              vi[pos].tipo = nt[i].tipo
              if (nt[i].como=='cliente') {
                vi[pos].como='P'
              } else if (nt[i].como=='proveedor') {
                vi[pos].como='C'
              }
            }
          }
        }

        let excl = 0
        for (let i=0; i<=vi.length-1; i++) {
          if (vi[i].como == 'P') {
            // el desde es proveedor del hasta
            if (vi[i].uid1 == this.userId) {
              // el usuario actual esta en DESDE (uid1), agrego en hijos el hasta

              excl = exClie.findIndex(x=>x==vi[i].uid1)
              if (excl==-1) {
                let esElQue =  vi[i].tipo!=undefined?vi[i].tipo:''
                this.agregoVinculo(hij, vi[i], esElQue, 'H', 2)
              }

            } else { // el usuario actual esta en HASTA uid2
              
              // el usuario actual esta en HASTA (uid2), agrego en padres el desde
              excl = exProv.findIndex(x=>x==vi[i].uid1)
              if (excl==-1) {
                let esElQue =  vi[i].tipo!=undefined?vi[i].tipo:''
                this.agregoVinculo(pad, vi[i], esElQue, 'P', 1)
              }
            
            }
          
          } else if (vi[i].como == 'C') {
            // el desde es cliente del hasta
            if (vi[i].uid1 == this.userId) {
              // el usuario actual esta en DESDE (uid1), agrego en padres el hasta
              excl = exProv.findIndex(x=>x==vi[i].uid2)
              if (excl==-1) {
                let esElQue =  vi[i].tipo!=undefined?vi[i].tipo:''              
                this.agregoVinculo(pad, vi[i], esElQue, 'P', 2)
              }
            } else {
              // el usuario actual esta en HASTA (uid2), agrego en hijos el desde
              excl = exClie.findIndex(x=>x==vi[i].uid2)
              if (excl==-1) {
                let esElQue =  vi[i].tipo!=undefined?vi[i].tipo:''              
                this.agregoVinculo(hij, vi[i], esElQue, 'H', 1)
              }
            }
          } else {
            if (vi[i].uid1 == this.userId) {
              // el usuario actual esta en DESDE (uid1), agrego en hijos el hasta
              excl = exClie.findIndex(x=>x==vi[i].uid2)
              if (excl==-1) {
                this.agregoVinculo(hij, vi[i], '', 'H', 2)
              }

              excl = exProv.findIndex(x=>x==vi[i].uid2)
              if (excl==-1) {
                this.agregoVinculo(pad, vi[i], '', 'P', 2)
              }

            } else {                                                // el usuario actual esta en HASTA uid2
              // el usuario actual esta en HASTA (uid2), agrego en padres el desde

              excl = exProv.findIndex(x=>x==vi[i].uid1)
              if (excl==-1) {
                this.agregoVinculo(pad, vi[i], '', 'P', 1)
              }

              excl = exClie.findIndex(x=>x==vi[i].uid1)
              if (excl==-1) {
                this.agregoVinculo(hij, vi[i], '', 'H', 1)
              }
            }
          }
        }

        this.vinculosHijosLoc = hij
        this.vinculosPadresLoc = pad
        let padres = []
        let hijos = []
        for (let i=0; i<=pad.length-1; i++) {
          if (pad[i].vinculado==1 && pad[i].pausado==0) {
            padres.push(pad[i].user_id)
          }
        }
        for (let i=0; i<=hij.length-1; i++) {
          if (hij[i].vinculado==1 && hij[i].pausado==0) {
            hijos.push(hij[i].user_id)
          }
        }
        this.$store.commit('setVinculosPadres', padres, { root: true });
        this.$store.commit('setVinculosHijos', hijos, { root: true });
        let losProv = []
        if (this.operarioEsVendedor==false) {
          losProv.push({
            avatar:'Sin Avatar.jpg',id:0,nombre:'SIN SELECCIONAR',preciosconiva:0,tercero_id:null,administragohu:false
          })
        }
        for (let i=0; i<= pad.length-1; i++) {
          if (pad[i].vinculado && !pad[i].pausado) {
            losProv.push({
              avatar:         pad[i].avatar,
              id:             pad[i].user_id,
              nombre:         pad[i].nombre,
              preciosconiva:  pad[i].preciosconiva,
              tercero_id:     pad[i].tercero_id,
              administragohu: pad[i].administragohu,
            })
          }
        }

        // agrego las ciudades de los usuarios
        this.ubicaciones = []
        for (let i=0; i<=vi.length-1; i++) {
          pos = this.ubicaciones.findIndex(x=>x.nombre===vi[i].ciudad1)
          if (pos==-1) {
            this.ubicaciones.push({ nombre: vi[i].ciudad1, sel: false, })
          }
          pos = this.ubicaciones.findIndex(x=>x.nombre===vi[i].ciudad2)
          if (pos==-1) {
            this.ubicaciones.push({ nombre: vi[i].ciudad2, sel: false, })
          }
        }

        if (!this.$store.state.proveedor.id) {
          this.$store.commit('setProveedor', losProv[0] , { root: true})
        }
        this.$store.commit('setProveedores', losProv , { root: true})
      },
*/
      agregoVinculo(aux, vinculo, esElQue, rol, p) {

        let ciudad = ''
        if (vinculo.userDesde.tercero==null||vinculo.userDesde.tercero.direcciones.length==0) {
          ciudad = 'SIN CIUDAD'
        } else {
          ciudad = vinculo.userDesde.tercero.direcciones[0].postal.nombre
        }

        if (p==1) {
          aux.push({
            vinculo_id: vinculo.id,
            user_id: vinculo.userDesde.id,
            username: vinculo.userDesde.username,
            logotipo: vinculo.userDesde.logotipo,
            ver: vinculo.ver,
            vinculado: vinculo.vinculado,
            pausado: vinculo.pausado,
            activo: vinculo.activo,
            solicitud: esElQue==''?0:1,
            externo: vinculo.userDesde.externo,
            tipo: vinculo.userDesde.tipo,
            esElQue: esElQue,
            notificacion_id: vinculo.not,
            usersrubros: vinculo.usersrubros,
            nombre: vinculo.userDesde.username,
            avatar: vinculo.userDesde.avatar,
            preciosconiva: vinculo.userDesde.preciosconiva,
            tercero_id: vinculo.userDesde.tercero.id,
            administragohu: vinculo.userDesde.administragohu,
            rol: rol,
            ciudad: ciudad,
            exclusivo: vinculo.userDesde.userexclusivo_id,
            ctt: vinculo.ctt,
            distribuidor: vinculo.userDesde.distribuidor,
          })
        } else {
          aux.push({
            vinculo_id: vinculo.id,
            user_id: vinculo.user.id,
            username: vinculo.user.username,
            logotipo: vinculo.user.logotipo,
            ver: vinculo.ver,
            vinculado: vinculo.vinculado,
            pausado: vinculo.pausado,
            activo: vinculo.activo,
            solicitud: esElQue==''?0:1,
            externo: vinculo.user.externo,
            tipo: vinculo.user.tipo,
            esElQue: esElQue,
            notificacion_id: vinculo.not,
            usersrubros: vinculo.usersrubros,
            nombre: vinculo.user.username,
            avatar: vinculo.user.avatar,
            preciosconiva: vinculo.user.preciosconiva,
            tercero_id: vinculo.user.tercero.id,
            administragohu: vinculo.user.administragohu,
            rol: rol,
            ciudad: vinculo.user.tercero.direcciones[0].postal.nombre,
            exclusivo: vinculo.user.userexclusivo_id,
            distribuidor: vinculo.userDesde.distribuidor,
          })
        }
      },
/*
      agregoVinculo2(aux, vinculo, esElQue, rol, p) {
        if (p==1) {
          aux.push({
            vinculo_id: vinculo.id, user_id: vinculo.uid1, username: vinculo.username1, logotipo: vinculo.logotipo1,
            ver: vinculo.ver, vinculado: vinculo.vinculado, pausado: vinculo.pausado, activo: vinculo.activo,
            solicitud: esElQue==''?0:1, externo: vinculo.externo1, tipo: vinculo.tipo1, esElQue: esElQue,
            notificacion_id: vinculo.not, usersrubros: vinculo.usersrubros, nombre: vinculo.nombre1, avatar: vinculo.avatar1,
            preciosconiva: vinculo.preciosconiva1, tercero_id: vinculo.tercero_id1,
            administragohu: vinculo.administragohu1, rol: rol, ciudad: vinculo.ciudad1
          })
        } else {
          aux.push({
            vinculo_id: vinculo.id, user_id: vinculo.uid2, username: vinculo.username2, logotipo: vinculo.logotipo2,
            ver: vinculo.ver, vinculado: vinculo.vinculado, pausado: vinculo.pausado, activo: vinculo.activo,
            solicitud: esElQue==''?0:1, externo: vinculo.externo2, tipo: vinculo.tipo2, esElQue: esElQue,
            notificacion_id: vinculo.not, usersrubros: vinculo.usersrubros, nombre: vinculo.nombre2, avatar: vinculo.avatar2,
            preciosconiva: vinculo.preciosconiva2, tercero_id: vinculo.tercero_id2,
            administragohu: vinculo.administragohu2, rol: rol, ciudad: vinculo.ciudad2
          })
        }
      },
*/

/*
      setVinculos2(padres, hijos) {
        let pad = []
        let hij = []
        for (let i=0; i<=padres.length-1; i++) {
          if (padres[i].vinculado && !padres[i].pausado) {
            pad.push(padres[i].user_id)
          }
        }
        for (let i=0; i<=hijos.length-1; i++) {
          if (hijos[i].vinculado && !hijos[i].pausado) {
            hij.push(hijos[i].user_id)
          }
        }
        this.vinculosPadresLoc = padres
        this.vinculosHijosLoc = hijos
        this.$store.commit('setVinculosPadres', pad, { root: true });
        this.$store.commit('setVinculosHijos', hij, { root: true });

        let losProv = []
        if (this.operarioEsVendedor==false) {
          losProv.push({
            avatar:'Sin Avatar.jpg',id:0,nombre:'SIN SELECCIONAR',preciosconiva:0,tercero_id:null,administragohu:false
          })
        }
        for (let i=0; i<= padres.length-1; i++) {
          if (padres[i].vinculado && !padres[i].pausado) {
            losProv.push({
              avatar:         padres[i].avatar,
              id:             padres[i].user_id,
              nombre:         padres[i].nombre,
              preciosconiva:  padres[i].preciosconiva,
              tercero_id:     padres[i].tercero_id,
              administragohu: padres[i].administragohu,
            })
          }
        }
        if (!this.$store.state.proveedor.id) {
          this.$store.commit('setProveedor', losProv[0] , { root: true})
        }
        this.$store.commit('setProveedores', losProv , { root: true})
      },
*/
      filtrarPorRubro(rub) {
        let pos = this.rubros.map(function(e) { return e.id; }).indexOf(rub.id);
        this.rubros[pos].sel = !this.rubros[pos].sel
        this.vinculosVer(this.vinculosAVerCual)
      },

      filtrarPorUbicacion(ubi) {
        let pos = this.ubicaciones.map(function(e) { return e.nombre; }).indexOf(ubi.nombre);
        this.ubicaciones[pos].sel = !this.ubicaciones[pos].sel
        this.vinculosVer(this.vinculosAVerCual)
      },
/*
      confirmarInformeDePago() {
        this.dialogInformarPago = false
      },
*/
      confirmarCuentaAGohu() {
        this.dialogCambiarLicencia = false
        return HTTP().post('/cambiarlicencia', {acual: this.licenciaACambiar}).then(({ data }) => {
          if (data==='ok') {
            this.msg.msgTitle = '¡Se ha cambiado la Licencia!'
            let m = 'El sistema se cerrará para preparar tu cuenta.<br>'
            m += 'Solo vuelve a ingresar y listo.<br>'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'activacion correcta'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.msg.msgTitle = '¡Activación incorrecta!'
            let m = 'Se ha producido un error en la activación de tu cuenta.</b><br>'
            m += 'Reintenta, si el error persistema comunícate con <b>gohu</b>'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'activacion incorrecta'
            this.msg.msgButtons = ['Aceptar']
          }
        })
      },

      noVerMasElMensajeInicial() {
        return HTTP().post('/novermaselmensajeinicial',{timeout: 5000}).then(({ data }) => {
          if (data=='ok') {
            this.dialogAvisoAExclusivos = false
            this.mensaje('¡Mensaje inicial desactivado!', this.$store.state.temas.forms_titulo_bg, 2500)
            this.$store.commit('setInicial', 0, { root: true });  
          } else {
            this.mensaje('¡Opps, el mensaje inicial no se ha podido desactivar!', this.$store.state.temas.snack_error_bg, 2500)
          }
        })
      },

      msgRespuesta(op) {
        this.msg.msgVisible = false;
        if (op==='Aceptar'||op==='Anular') {
          if (this.msg.msgAccion=='activacion correcta') {
            this.logout()
          } else if (this.msg.msgAccion==='Enviar Mensaje') {
            this.dialogMensajes = false
            return HTTP().post('/enviarmensaje', {mensaje: this.mensajeTexto, usuarios:this.mensajeUsersSel}).then(({ data }) => {
              if (data==='ok') {
                this.mensaje('¡Mensaje enviado con éxito!', this.$store.state.temas.forms_titulo_bg, 2000)
              } else {
                this.msg.msgTitle = '¡Error!'
                let m = 'Se ha producido un error al enviar este mensaje.</b><br>'
                m += 'Reintenta, si el error persistema comunícate con <b>gohu</b>'
                this.msg.msgBody = m
                this.msg.msgVisible = true
                this.msg.msgAccion = 'mensaje error'
                this.msg.msgButtons = ['Aceptar']
              }
            })
          }
        }
      },

      desdeEnGohu(){
        return moment(this.masInfo.enGohuDesdeEl).format('DD/MM/YYYY')
      },

      diasEnGohu(){
        let f1 =  moment().format('YYYY-MM-DD')
        let f2 =  this.masInfo.enGohuDesdeEl
        let hoy = moment(f1)
        let ven = moment(f2)
        let d = hoy.diff(ven, 'days')
        return d
      },

      formatoFechaCorta(value) {
        return moment(String(value)).format('DD-MM-YY')
      },

      fechadelmensaje (fecha) {
        let fff = fecha
        let xxx = moment(fecha).fromNow(true);
        return moment(fecha).fromNow(true);
      },

      roundTo(value, places){
       var power = Math.pow(10, places);
       return Math.round(value * power) / power;
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
  .minifont {
    /*font-family: Verdana, Arial, Helvetica, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 84%;
  }
  .cpr {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-display: green;
    font-size: 75%;
  }
  .bigfont {
    font-family: Graphik,sans-serif;
    font-size: 1.375rem;
    line-height: 2.1rem;
    color: gray;
  }
  .v-btn::before {
    background-color: transparent;
  }
  .v-btn i:hover{
    transform: scale(1.25);
  }
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg60 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 60%;
  }
  .fg70 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 70%;
  }
  .fg70b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 70%;
    font-weight: 200%;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .fg100b {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    font-weight: 200%;
  }
  .fg110 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 110%;
  }
  .fg120 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 120%;
  }
  .fg135 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 135%;
  }
  .fg150 {
   font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 150%;
  }
  .mapa {
    height: 425px;
  }
  /*
  .v-card {
    transition: opacity .2s ease-in-out;
  }
  .v-card:not(.on-hover) {
    opacity: .6;
  }
  .show-btns {
    color: rgba(255, 255, 255, 1) !important;
  }
  */
</style>
