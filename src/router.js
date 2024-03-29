import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Profile from './views/Profile.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Articulos from './views/Articulos.vue';
import Marcas from './views/Tablas/Marcas.vue';
import Rubros from './views/Tablas/Rubros.vue';
import Grupos from './views/Grupos.vue';
import Unidades from './views/Unidades.vue';
import ContactosTipos from './views/ContactosTipos.vue';
import MediosDePagos from './views/Tablas/MediosDePagos.vue';
import Paises from './views/Tablas/Paises.vue';
import Provincias from './views/Tablas/Provincias.vue';
import Zonas from './views/Tablas/Zonas.vue';
import Bancos from './views/Tablas/Bancos.vue';
import BancosMovimientos from './views/Bancos/BancosMovimientos.vue';
import posIVA from './views/IVA/posIVA.vue';
import Tarjetas from './views/Tablas/Tarjetas.vue';
import Postales from './views/Tablas/Postales.vue';
import Terceros from './views/Terceros.vue';
import AfipIVA from './views/Tablas/AfipIva.vue';
import AfipComprobantes from './views/Tablas/AfipComprobantes.vue';
import AfipMonedas from './views/Tablas/AfipMonedas.vue';
import AfipDocumentos from './views/Tablas/AfipDocumentos.vue';
import AfipResponsables from './views/Tablas/AfipResponsables.vue';
import Migraciones from './views/Migraciones.vue';
import CotizacionMonedas from './views/CotizacionMonedas.vue';
import PreciosCambios from './views/PreciosCambios.vue';
import CambiosMasivosDeArticulos from './views/CambiosMasivosDeArticulos.vue';
import CodigosDeBarra from './views/CodigosDeBarra.vue';
import PreciosConsultas from './views/PreciosConsultas.vue';
import PreciosActualizaciones from './views/PreciosActualizaciones.vue';
import Ventas from './views/Ventas.vue';
import Comisiones from './views/Comisiones.vue';
import Viajes from './views/Viajes.vue';
import Estadisticas from './views/Estadisticas.vue';
import Maletines from './views/Maletines.vue';
import Licencias from './views/Licencias.vue';
import InformesDeCompras from './views/InformesDeCompras.vue';
import InformesDeVentas from './views/InformesDeVentas.vue';
import InformesDeArticulos from './views/InformesDeArticulos.vue';
import InformesDeStocks from './views/InformesDeStocks.vue';
import InformesDeTesoreria from './views/Tesoreria/InformesDeTesoreria.vue';
import Compras from './views/Compras.vue';
import Stocks from './views/Stocks.vue';
import TesoreriaCaja from './views/Tesoreria/TesoreriaCaja.vue';
import Cheques from './views/Tesoreria/Cheques.vue';
import Listas from './views/Listas.vue';
import SaldosIniciales from './views/SaldosIniciales.vue';
import Resumenes from './views/Resumenes.vue';
import Ayuda from './views/Ayuda.vue';
import Turnos from './views/Turnos.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL, // base: 'http://127.0.0.1:3333',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/articulos',
      name: 'articulos',
      component: Articulos,
    },
    {
      path: '/informesdearticulos',
      name: 'informesdearticulos',
      component: InformesDeArticulos,
    },
    {
      path: '/rubros',
      name: 'rubros',
      component: Rubros,
    },
    {
      path: '/tablas/marcas',
      name: 'marcas',
      component: Marcas,
    },
    {
      path: '/grupos',
      name: 'grupos',
      component: Grupos,
    },
    {
      path: '/contactostipos',
      name: 'contactostipos',
      component: ContactosTipos,
    },
    {
      path: '/mediosdepagos',
      name: 'mediosdepagos',
      component: MediosDePagos,
    },
    {
      path: '/unidades',
      name: 'unidades',
      component: Unidades,
    },
    {
      path: '/paises',
      name: 'paises',
      component: Paises,
    },
    {
      path: '/provincias',
      name: 'provincias',
      component: Provincias,
    },
    {
      path: '/postales',
      name: 'postales',
      component: Postales,
    },
    {
      path: '/zonas',
      name: 'zonas',
      component: Zonas,
    },
    {
      path: '/bancos',
      name: 'bancos',
      component: Bancos,
    },
    {
      path: '/bancos/bancosmovimientos',
      name: 'bancosmovimientos',
      component: BancosMovimientos,
    },
    {
      path: '/tarjetas',
      name: 'tarjetas',
      component: Tarjetas,
    },
    {
      path: '/usersclientes',
      name: 'usersclientes',
      component: Terceros,
    },
    {
      path: '/usersequipo',
      name: 'usersequipo',
      component: Terceros,
    },
    {
      path: '/userspuntosderetiros',
      name: 'userspuntosderetiros',
      component: Terceros,
    },
    {
      path: '/userstransportistas',
      name: 'userstransportistas',
      component: Terceros,
    },
    {
      path: '/usersproveedores',
      name: 'usersproveedores',
      component: Terceros,
    },
    {
      path: '/userstercerosgastos',
      name: 'userstercerosgastos',
      component: Terceros,
    },
    {
      path: '/afipiva',
      name: 'afipiva',
      component: AfipIVA,
    },
    {
      path: '/afipcomprobantes',
      name: 'afipcomprobantes',
      component: AfipComprobantes,
    },
    {
      path: '/afipdocumentos',
      name: 'afipdocumentos',
      component: AfipDocumentos,
    },
    {
      path: '/afipmonedas',
      name: 'afipmonedas',
      component: AfipMonedas,
    },
    {
      path: '/afipresponsables',
      name: 'afipresponsables',
      component: AfipResponsables,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/migraciones',
      name: 'migraciones',
      component: Migraciones,
    },
    {
      path: '/precioscambios',
      name: 'precioscambios',
      component: PreciosCambios,
    },
    {
      path: '/cambiosmasivosdearticulos',
      name: 'cambiosmasivosdearticulos',
      component: CambiosMasivosDeArticulos,
    },
    {
      path: '/codigosdebarra',
      name: 'codigosdebarra',
      component: CodigosDeBarra,
    },
    {
      path: '/preciosconsultas',
      name: 'preciosconsultas',
      component: PreciosConsultas,
    },
    {
      path: '/preciosactualiaciones',
      name: 'preciosactualizaciones',
      component: PreciosActualizaciones,
    },
    {
      path: '/listas',
      name: 'listas',
      component: Listas,
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: Ventas,
    },
    {
      path: '/comisiones',
      name: 'comisiones',
      component: Comisiones,
    },
    {
      path: '/viajes',
      name: 'viajes',
      component: Viajes,
    },
    {
      path: '/maletines',
      name: 'maletines',
      component: Maletines,
    },
    {
      path: '/licencias',
      name: 'licencias',
      component: Licencias,
    },
    {
      path: '/estadisticas',
      name: 'estadisticas',
      component: Estadisticas,
    },
    {
      path: '/informesdeventas',
      name: 'informesdeventas',
      component: InformesDeVentas,
    },
    {
      path: '/informesdecompras',
      name: 'informesdecompras',
      component: InformesDeCompras,
    },
    {
      path: '/informesdestocks',
      name: 'informesdestocks',
      component: InformesDeStocks,
    },
    {
      path: '/saldosinicialesclientes',
      name: 'saldosinicialesclientes',
      component: SaldosIniciales,
    },
    {
      path: '/saldosinicialesproveedores',
      name: 'saldosinicialesproveedores',
      component: SaldosIniciales,
    },
    {
      path: '/resumenesclientes',
      name: 'resumenesclientes',
      component: Resumenes,
    },
    {
      path: '/resumenesproveedores',
      name: 'resumenesproveedores',
      component: Resumenes,
    },
    {
      path: '/turnos',
      name: 'turnos',
      component: Turnos,
    },
    {
      path: '/compras',
      name: 'compras',
      component: Compras,
    },
    {
      path: '/cotizacionmonedas',
      name: 'cotizacionmonedas',
      component: CotizacionMonedas,
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: Stocks,
    },
    {
      path: '/tesoreriacaja',
      name: 'tesoreriacaja',
      component: TesoreriaCaja,
    },
    {
      path: '/cheques',
      name: 'cheques',
      component: Cheques,
    },
    {
      path: '/informesdetesoreria',
      name: 'informesdetesoreria',
      component: InformesDeTesoreria,
    },
    {
      path: '/posIVA',
      name: 'posIVA',
      component: posIVA,
    },
    {
      path: '/ayuda/:id',
      name: 'ayuda',
      component: Ayuda,
    },
  ],
});
