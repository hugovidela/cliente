<template>
  <v-row>
    <div></div>
  </v-row>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
import moment from 'moment';
import jsPDF from 'jspdf';
import { data } from 'vue-barcode';
export default {
  props: {
    title: String,
    body: String,
    visible: Boolean,
    buttons: Array,
  },
  computed: {
    ...mapState(['sucursal','sucursales','datosEmpresa','codigooid',]),
  },
  methods: {

    ventasPrint(item, quien) {

      // veo que tipo de comprobante es:
      let tipcpr = ''
      var doc = new jsPDF();
      var img = new Image();

      let datos = {
        cpr: null,
        tipcpr: null,
        fecha: null,
        recargo: null,
        sucursal: null,
        sucursales: null,
        emiRazonSocial: null,
        emiDireccion: null,
        emiResponsable: null,
        emiCUIT: null,
        recRazonSocial: null,
        recDireccion: null,
        recResponsable: null,
        recCUIT: null,
        items: null,
        totales: {
          recargo: 0,
          gravado: 0,
          tasadescuento: 0,
          importedescuento: 0,
          excento: 0,
          iva: 0,
          total: 0,
        },
        cancelaciones: [],
        valoresIngresos: [],
        valoresEgresos: [],
        logotipo: null,
      }

      if (quien=='yo') {

        datos.cpr                      = item.cpr,
        datos.tipcpr                   = item.cpr.substr(0,3),
        datos.fecha                    = item.fecha,
        datos.recargo                  = item.recargo,
        datos.sucursal                 = this.sucursal
        datos.sucursales               = this.sucursales
        datos.emiRazonSocial           = this.datosEmpresa.nombre
        datos.emiDireccion             = this.datosEmpresa.direccionNombre
        datos.emiResponsable           = this.datosEmpresa.responsableNombre
        datos.emiCUIT                  = this.datosEmpresa.cuit
        datos.recRazonSocial           = item.tercero.razon_social
        datos.recDireccion             = item.tercero.direcciones[0].direccion+' ('+
                                         item.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.tercero.direcciones[0].postal.provincia.pais.nombre
        datos.recResponsable           = item.tercero.responsable.nombre
        datos.recCUIT                  = item.tercero.cuit
        datos.items                    = item.items
        datos.totales.gravado          = item.gravado,
        datos.totales.tasadescuento    = item.tasadescuento,
        datos.totales.importedescuento = item.importedescuento,
        datos.totales.exento           = item.exento,
        datos.totales.iva              = item.iva,
        datos.totales.total            = item.total

        datos.cancelaciones            = item.cancelaciones
        datos.valoresIngresos          = item.valoresIngresos
        datos.valoresEgresos           = item.valoresEgresos
        datos.logotipo                 = item.user.logotipo

      } else {

        datos.cpr                      = item.comprobante.cpr,
        datos.tipcpr                   = item.comprobante.cpr.substr(0,3),
        datos.fecha                    = item.comprobante.fecha,
        datos.recargo                  = item.comprobante.recargo,
        datos.sucursal                 = item.comprobante.sucursal_id
        datos.sucursales               = item.userdesde.sucursales
        datos.emiRazonSocial           = item.userdesde.tercero.razon_social

        datos.emiDireccion             = item.userdesde.tercero.direcciones[0].direccion+' ('+
                                         item.userdesde.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.userdesde.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.userdesde.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.userdesde.tercero.direcciones[0].postal.provincia.pais.nombre

        datos.emiResponsable           = item.userdesde.tercero.responsable.nombre
        datos.emiCUIT                  = item.userdesde.tercero.cuit
        datos.recRazonSocial           = item.comprobante.tercero.razon_social

        datos.recDireccion             = item.comprobante.tercero.direcciones[0].direccion+' ('+
                                         item.comprobante.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.comprobante.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.comprobante.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.comprobante.tercero.direcciones[0].postal.provincia.pais.nombre
        
        datos.recResponsable           = item.comprobante.tercero.responsable.nombre
        datos.recCUIT                  = item.comprobante.tercero.cuit
        datos.items                    = item.comprobante.items
        datos.totales.gravado          = item.comprobante.gravado,
        datos.totales.tasadescuento    = item.comprobante.tasadescuento,
        datos.totales.importedescuento = item.comprobante.importedescuento,
        datos.totales.exento           = item.comprobante.exento,
        datos.totales.iva              = item.comprobante.iva,
        datos.totales.total            = item.comprobante.total

        datos.cancelaciones            = item.cancelaciones
        datos.valoresIngresos          = item.valoresIngresos
        datos.valoresEgresos           = item.valoresEgresos
//      datos.logotipo                 = item.comprobante.tercero.user ? item.comprobante.tercero.user.logotipo : 'SinImagen.jpg'
        datos.logotipo                 = item.userdesde.logotipo

      }

      let rangos = []
      let paginas = 0         // lineas por pagina 39, lineas ultima pagina 28
      let des = 0
      let has = 0
      if (datos.items.length<27) {
        rangos.push({desde: 1, hasta: datos.items.length})
      } else {
        paginas = Math.round(datos.items.length/39)
        for (let i=0; i<=paginas-1; i++) {
          des = has + 1;
          if (i==paginas-1) {
            has = datos.items.length
          } else {
            has += 38
          }
          rangos.push({ desde: des, hasta: has })
        }
        // NO ALCANZA A ENTRAR EL PIE, FUERZO A UNA PAGINA NUEVA
        if (rangos[rangos.length-1].hasta-rangos[rangos.length-1].desde>=27) {
          rangos.push({ desde: 0, hasta: 0 }) 
        }
      }

      for (let i=0; i<=rangos.length-1; i++) {
        this.esqueleto(datos, img, doc, quien, rangos, i)
        this.cabecera(datos, doc, rangos, i)
        this.detalles(datos, doc, rangos, i)
      }

      doc.output ('dataurlnewwindow');

    },



    ventasPrintDetalles(item) {

      let tipcpr = item.cpr.substr(0,3)
      var doc = new jsPDF();

      debugger
      if (tipcpr=='FAC' || tipcpr=='NDD' || tipcpr == 'NDC' || tipcpr == 'PRE'|| tipcpr == 'RTV') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )

        doc.line( 10, 22, 93, 22);
        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Stock?                           Depósito', 10, f ); f +=  10

        doc.text ( 'Total Comprob.                                            TRN', 10, f ); f += 5
        doc.text ( 'Descuento                                                   % Descuento                                  %Recargo', 10, f ); f += 5

        if ([127].indexOf(item.comprobante_id)!=-1) {
          doc.text ( 'Ret.IVA', 10, f ); f += 5
          doc.text ( 'Ret.GAN', 10, f ); f += 5
          doc.text ( 'Ret.IB', 10, f ); f += 5
        }

        doc.text ( 'Gravado                                                       Exento                                            IVA', 10, f );
        f+=10

        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Items', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Código          Descripción                                                                            Ctt.            Precio  %Des.    $Des.        TOTAL', 10, f ); f += 5
        doc.setFont(undefined,"bold");

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5

        if (item.tercero.direcciones.length>0) {
          doc.text ( item.tercero.direcciones[0].direccion+' ('+
                     item.tercero.direcciones[0].postal.codigo+ '-' +
                     item.tercero.direcciones[0].postal.nombre+ ')-' +
                     item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                     item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        } else {
          doc.text ( 'Sin dirección', 40, f ); f += 5
        }

        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        if (item.regstk==1) {
          doc.text ( 'Sí', 40, f );
        } else {
          doc.text ( 'No', 40, f );
        }
        if (item.deposito_id!=null) {
          doc.text ( item.deposito_id.toString(), 65, f ); f += 10
        }
        doc.text ( '$'+this.formatMoney(item.total), 40, f );
        doc.text ( '$'+this.formatMoney(item.rentabilidad), 105, f ); f += 5
        doc.text ( '$'+this.formatMoney(item.descuento), 40, f );
        doc.text ( '%'+this.formatMoney(item.tasadescuento), 105, f )
        doc.text ( '$'+this.formatMoney(item.recargo), 160, f ); f += 5

        if ([127].indexOf(item.comprobante_id)!=-1) {
          doc.text ( '$'+this.formatMoney(item.retiva), 40, f ); f += 5
          doc.text ( '$'+this.formatMoney(item.retgan), 40, f ); f += 5
          doc.text ( '$'+this.formatMoney(item.retib), 40, f ); f += 5
        }

        doc.text ( '$'+this.formatMoney(item.gravado), 40, f );
        doc.text ( '$'+this.formatMoney(item.exento), 105, f );
        doc.text ( '$'+this.formatMoney(item.iva), 160, f ); f += 5

        doc.setFont(undefined,"normal");
        doc.setFontSize(8);
        f += 10
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6
        for (let i = 0; i<=item.items.length-1; i++) {
          if (item.items[i].articulo.id===1) {
            doc.text (item.items[i].texto.substring(0,65), 10, f )
          } else {
            if (this.codigooid=='C') {
              doc.text (item.items[i].articulo.codigo, 10, f )
            } else {
              doc.text (item.items[i].articulo_id.toString(), 10, f )
            }
            doc.text (item.items[i].articulo.nombre.substring(0,55), 31, f )
          }
          doc.text (this.formatMoney(item.items[i].cantidad), 130, f, 'right')
          doc.text (this.formatMoney(item.items[i].precio), 151, f, 'right')
          doc.text (this.formatMoney(item.items[i].tasadescuento), 162, f, 'right')
          doc.text (this.formatMoney(item.items[i].importedescuento), 176, f, 'right')
          doc.text (this.formatMoney(item.items[i].total), 196, f, 'right')
          f += 5

          if (f>280) {
            doc.addPage()
            f = 10
          }

        }
        doc.setFontSize(10);
        f += 5
        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Valores', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'FP        NroValor  Cuenta      Fecha Financiera        Importe ', 10, f );
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6
        doc.setFontSize(8);
        for (let i = 0; i<=item.valoresIngresos.length-1; i++) {
          doc.text (item.valoresIngresos[i].medio_id.toString(), 10, f )
          doc.text (this.formatMoney(item.valoresIngresos[i].importe), 196, f, 'right')
          f += 5
        }

        /*
        f += 15
        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Pendiente en Cta.Cte.                                        Cancelaciones', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Fecha Vencimiento     Importe                   Pendiente         Fecha      Cpr.Cancelador      Observaciones              Importe', 10, f );
        doc.line( 10, f+2, 93,  f+2);     // linea vertical 1
        doc.line( 100, f+2, 196,  f+2);     // linea vertical 1
        doc.setFontSize(8);
        f += 6
        for (let i = 0; i<=item.pendientes.length-1; i++) {
          fec = moment(item.pendientes[i].vencimiento).format('DD/MM/YYYY')
          doc.text (fec, 10, f )
          doc.text (this.formatMoney(item.pendientes[i].importe), 57, f, 'right')
          doc.text (this.formatMoney(item.pendientes[i].pendiente), 91, f, 'right')
          let totCancelado = 0
          for (let j = 0; j<= item.pendientes[i].cancelaciones.length-1; j++) {
            fec = moment(item.pendientes[i].cancelaciones[j].cancelador.fecha).format('DD/MM/YYYY')
            doc.text (fec, 100, f )
            doc.text (item.pendientes[i].cancelaciones[j].cancelador.cpr, 116, f)
            doc.text (item.pendientes[i].cancelaciones[j].concepto, 147, f)
            doc.text (this.formatMoney(item.pendientes[i].cancelaciones[j].importe), 196, f, 'right')
            totCancelado += item.pendientes[i].cancelaciones[j].importe
            f += 5
          }
          f -= 2
          doc.line( 100, f, 196,  f); f += 5
          doc.text (this.formatMoney(totCancelado), 196, f, 'right')
        }
        */

      } else if (tipcpr=='PED') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )
        doc.line( 10, 22, 93, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Dirección', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Total Pedido', 10, f ); f += 5
        doc.text ( 'Estado', 10, f ); f += 5
        f+=10

        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Items', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Código          Descripción                                                                            Ctt.            Precio  %Des.    $Des.        TOTAL', 10, f ); f += 5
        doc.setFont(undefined,"bold");

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5

        if (item.tercero.direcciones.length>0) {
          doc.text ( item.tercero.direcciones[0].direccion+' ('+
                     item.tercero.direcciones[0].postal.codigo+ '-' +
                     item.tercero.direcciones[0].postal.nombre+ ')-' +
                     item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                     item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        } else {
          doc.text ( 'Sin dirección', 40, f ); f += 5
        }

        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        doc.text ( '$'+this.formatMoney(item.total), 40, f ); f += 5
        if (item.estado=='F') {
          doc.text ( 'Fnalizado', 40, f ); f += 5
        } else if (item.estado=='P') {
          doc.text ( 'Pendiente', 40, f ); f += 5
        } else if (item.estado=='L') {
          doc.text ( 'Facturado Parcialmente', 40, f ); f += 5
        } else if (item.estado=='R') {
          doc.text ( 'Para Procesar', 40, f ); f += 5
        }
        f += 5

        doc.setFont(undefined,"normal");
        doc.setFontSize(8);
        f += 10
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6
        for (let i = 0; i<=item.items.length-1; i++) {
          if (this.codigooid=='C') {
            doc.text (item.items[i].articulo.codigo, 10, f )
          } else {
            doc.text (item.items[i].articulo_id.toString(), 10, f )
          }
          doc.text (item.items[i].articulo.nombre.substring(0,55), 31, f )
          doc.text (this.formatMoney(item.items[i].cantidad), 130, f, 'right')
          doc.text (this.formatMoney(item.items[i].precio, item.items[i].articulo.precios[0].decimales), 151, f, 'right')
          doc.text (this.formatMoney(item.items[i].tasadescuento), 162, f, 'right')
          doc.text (this.formatMoney(item.items[i].importedescuento), 176, f, 'right')
          doc.text (this.formatMoney(item.items[i].total), 196, f, 'right')
          f += 5
        }
        doc.setFontSize(10);

      } else if (tipcpr=='REC') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )
        doc.line( 10, 22, 93, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Total Recibo', 10, f ); f += 5

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5

        if (item.tercero.direcciones.length>0) {
          doc.text ( item.tercero.direcciones[0].direccion+' ('+
                     item.tercero.direcciones[0].postal.codigo+ '-' +
                     item.tercero.direcciones[0].postal.nombre+ ')-' +
                     item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                     item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        } else {
          doc.text ( 'Sin dirección', 40, f ); f += 5
        }

        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5

        doc.text ( '$'+this.formatMoney(item.total), 40, f ); f += 5
        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        f += 5
        doc.text ( 'Valores', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'FP     NroValor     Detalles                                                                                                                                        Importe ', 10, f );
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6
        doc.setFontSize(8);
        for (let i = 0; i<=item.valoresIngresos.length-1; i++) {
          doc.text (item.valoresIngresos[i].medio.abrev, 10, f )
          if (item.valoresIngresos[i].nrovalor!=null) {
            doc.text (item.valoresIngresos[i].nrovalor.toString(), 27, f )
          }
          doc.text (item.valoresIngresos[i].observ, 38, f )
          doc.text (this.formatMoney(item.valoresIngresos[i].importe), 196, f, 'right')
          f += 5
        }

        /*
        f += 15
        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Cancelaciones', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Fecha      Cpr.Cancelado       Observaciones              Importe', 10, f );
        doc.line( 10, f+2, 105.5,  f+2);     // linea vertical 1
        doc.setFontSize(8);
        f += 6
        let totCancelado = 0
        for (let i = 0; i<=item.cancelaciones.length-1; i++) {
          fec = moment(item.cancelaciones[i].cancelado.comprobante.fecha).format('DD/MM/YYYY')
          doc.text (fec, 10, f )
          doc.text (item.cancelaciones[i].cancelado.comprobante.cpr, 26, f, 'left')
          doc.text (this.formatMoney(item.cancelaciones[i].importe), 80, f, 'right')
          doc.text (this.formatMoney(item.cancelaciones[i].cancelado.importe), 105, f, 'right')
          totCancelado += item.cancelaciones[i].cancelado.importe
          f += 4
        }
        doc.line( 10, f, 105.5,  f); f += 4
        doc.text (this.formatMoney(totCancelado), 105, f, 'right')
        */

      }

      doc.output ('dataurlnewwindow');

    },


    comprasPrint(item, quien) {

      // veo que tipo de comprobante es:
      let tipcpr = ''
      var doc = new jsPDF();
      var img = new Image();
     
      let datos = {
        cpr: null,
        tipcpr: null,
        fecha: null,
        recargo: null,
        sucursal: null,
        sucursales: null,
        emiRazonSocial: null,
        emiDireccion: null,
        emiResponsable: null,
        emiCUIT: null,
        recRazonSocial: null,
        recDireccion: null,
        recResponsable: null,
        recCUIT: null,
        items: null,
        totales: {
          recargo: 0,
          gravado: 0,
          tasadescuento: 0,
          importedescuento: 0,
          excento: 0,
          iva: 0,
          total: 0,
        },
        cancelaciones: [],
        valoresIngresos: [],
        valoresEgresos: [],
        logotipo: null,

      }

      if (quien=='yo') {

        datos.cpr                      = item.cpr,
        datos.tipcpr                   = item.cpr.substr(0,3),
        datos.fecha                    = item.fecha,
        datos.recargo                  = item.recargo,
        datos.sucursal                 = this.sucursal
        datos.sucursales               = this.sucursales
        datos.emiRazonSocial           = this.datosEmpresa.nombre
        datos.emiDireccion             = this.datosEmpresa.direccionNombre
        datos.emiResponsable           = this.datosEmpresa.responsableNombre
        datos.emiCUIT                  = this.datosEmpresa.cuit
        datos.recRazonSocial           = item.tercero.razon_social
        datos.recDireccion             = item.tercero.direcciones[0].direccion+' ('+
                                         item.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.tercero.direcciones[0].postal.provincia.pais.nombre
        datos.recResponsable           = item.tercero.responsable.nombre
        datos.recCUIT                  = item.tercero.cuit
        datos.items                    = item.items
        datos.totales.gravado          = item.gravado,
        datos.totales.tasadescuento    = item.tasadescuento,
        datos.totales.importedescuento = item.importedescuento,
        datos.totales.exento           = item.exento,
        datos.totales.iva              = item.iva,
        datos.totales.total            = item.total

        datos.cancelaciones            = item.cancelaciones
        datos.valoresIngresos          = item.valoresIngresos
        datos.valoresEgresos           = item.valoresEgresos
        datos.logotipo                 = item.user.logotipo

      } else if (quien=='desdeCompras') {

        datos.cpr                      = item.cpr,
        datos.tipcpr                   = item.cpr.substr(0,3),
        datos.fecha                    = item.fecha,
        datos.recargo                  = item.recargo,
        datos.sucursal                 = this.sucursal
        datos.sucursales               = this.sucursales

        datos.recRazonSocial           = this.datosEmpresa.nombre
        datos.recDireccion             = this.datosEmpresa.direccionNombre
        datos.recResponsable           = this.datosEmpresa.responsableNombre
        datos.recCUIT                  = this.datosEmpresa.cuit
        datos.emiRazonSocial           = item.tercero.razon_social
        datos.emiDireccion             = item.tercero.direcciones[0].direccion+' ('+
                                         item.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.tercero.direcciones[0].postal.provincia.pais.nombre
        datos.emiResponsable           = item.tercero.responsable.nombre
        datos.emiCUIT                  = item.tercero.cuit
/*
        datos.emiRazonSocial           = this.datosEmpresa.nombre
        datos.emiDireccion             = this.datosEmpresa.direccionNombre
        datos.emiResponsable           = this.datosEmpresa.responsableNombre
        datos.emiCUIT                  = this.datosEmpresa.cuit
        datos.recRazonSocial           = item.tercero.razon_social
        datos.recDireccion             = item.tercero.direcciones[0].direccion+' ('+
                                         item.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.tercero.direcciones[0].postal.provincia.pais.nombre
        datos.recResponsable           = item.tercero.responsable.nombre
        datos.recCUIT                  = item.tercero.cuit
*/
        datos.items                    = item.items
        datos.totales.gravado          = item.gravado,
        datos.totales.tasadescuento    = item.tasadescuento,
        datos.totales.importedescuento = item.importedescuento,
        datos.totales.exento           = item.exento,
        datos.totales.iva              = item.iva,
        datos.totales.total            = item.total

        datos.cancelaciones            = item.cancelaciones
        datos.valoresIngresos          = item.valoresIngresos
        datos.valoresEgresos           = item.valoresEgresos
        datos.logotipo                 = item.tercero.user ? item.tercero.user.logotipo : 'SinImagen.jpg'

      } else {

        datos.cpr                      = item.comprobante.cpr,
        datos.tipcpr                   = item.comprobante.cpr.substr(0,3),
        datos.fecha                    = item.comprobante.fecha,
        datos.recargo                  = item.comprobante.recargo,
        datos.sucursal                 = item.comprobante.sucursal_id
        datos.sucursales               = item.userdesde.sucursales
        datos.emiRazonSocial           = item.userdesde.tercero.razon_social

        datos.emiDireccion             = item.userdesde.tercero.direcciones[0].direccion+' ('+
                                         item.userdesde.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.userdesde.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.userdesde.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.userdesde.tercero.direcciones[0].postal.provincia.pais.nombre

        datos.emiResponsable           = item.userdesde.tercero.responsable.nombre
        datos.emiCUIT                  = item.userdesde.tercero.cuit
        datos.recRazonSocial           = item.comprobante.tercero.razon_social

        datos.recDireccion             = item.comprobante.tercero.direcciones[0].direccion+' ('+
                                         item.comprobante.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.comprobante.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.comprobante.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.comprobante.tercero.direcciones[0].postal.provincia.pais.nombre
        
        datos.recResponsable           = item.comprobante.tercero.responsable.nombre
        datos.recCUIT                  = item.comprobante.tercero.cuit
        datos.items                    = item.comprobante.items
        datos.totales.gravado          = item.comprobante.gravado,
        datos.totales.tasadescuento    = item.comprobante.tasadescuento,
        datos.totales.importedescuento = item.comprobante.importedescuento,
        datos.totales.exento           = item.comprobante.exento,
        datos.totales.iva              = item.comprobante.iva,
        datos.totales.total            = item.comprobante.total

        datos.cancelaciones            = item.cancelaciones
        datos.valoresIngresos          = item.valoresIngresos
        datos.valoresEgresos           = item.valoresEgresos
        datos.logotipo                 = item.comprobante.tercero.user ? item.comprobante.tercero.user.logotipo : 'SinImagen.jpg'        

      }

      let rangos = []
      let paginas = 0         // lineas por pagina 39, lineas ultima pagina 28
      let des = 0
      let has = 0
      if (datos.items.length<27) {
        rangos.push({desde: 1, hasta: datos.items.length})
      } else {
        paginas = Math.round(datos.items.length/39)
        for (let i=0; i<=paginas-1; i++) {
          des = has + 1;
          if (i==paginas-1) {
            has = datos.items.length
          } else {
            has += 38
          }
          rangos.push({ desde: des, hasta: has })
        }
        // NO ALCANZA A ENTRAR EL PIE, FUERZO A UNA PAGINA NUEVA
        if (rangos[rangos.length-1].hasta-rangos[rangos.length-1].desde>=27) {
          rangos.push({ desde: 0, hasta: 0 }) 
        }
      }

      for (let i=0; i<=rangos.length-1; i++) {
        this.esqueleto(datos, img, doc, quien, rangos, i)
        this.cabecera(datos, doc, rangos, i)
        this.detalles(datos, doc, rangos, i)
      }

      doc.output ('dataurlnewwindow');

    },


    comprasPrintDetalles(item) {

      let tipcpr = item.cpr.substr(0,3)
      var doc = new jsPDF();

      if (tipcpr=='FAC' || tipcpr=='NDD' || tipcpr == 'NDC' || tipcpr == 'CIN' || tipcpr == 'PRE') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )
        doc.line( 10, 22, 93, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Stock?                           Depósito', 10, f ); f +=  5
        doc.text ( 'Observ', 10, f ); f +=  10
        doc.text ( 'Total Comprob.', 10, f ); f += 5
        doc.text ( 'Descuento                                                             % Descuento', 10, f ); f += 5

        if (tipcpr!='PAG') {
          doc.text ( 'Ret.IVA                                                                  Ret.GAN                                                 Ret.IB', 10, f ); f += 5
        }

        doc.text ( 'Tasas de IVA', 10, f ); f += 5
        doc.text ( 'Cuenta Corriente:', 10, f );
        if (item.ctacte) {
          doc.text ( 'Vencimiento:', 50, f );
          doc.setFont(undefined,"bold");
          doc.text ( moment(item.vencimiento).format('DD-MM-YYYY'), 72, f );
        }
        doc.setFont(undefined,"bold");
        doc.text ( item.ctacte?'Sí':'No', 40, f ); f += 5

        f+=5
        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Items', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Código          Descripción                                                                            Ctt.            Precio  %Des.    $Des.        TOTAL', 10, f ); f += 5
        doc.setFont(undefined,"bold");

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5

        if (item.tercero.direcciones.length>0) {
          doc.text ( item.tercero.direcciones[0].direccion+' ('+
                     item.tercero.direcciones[0].postal.codigo+ '-' +
                     item.tercero.direcciones[0].postal.nombre+ ')-' +
                     item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                     item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        } else {
          doc.text ( 'Sin dirección', 40, f ); f += 5
        }

        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        if (item.regstk==1) {
          doc.text ( 'Sí', 40, f );
        } else {
          doc.text ( 'No', 40, f );
        }
        if (item.deposito_id!=null) {
          doc.text ( item.deposito_id.toString(), 65, f ); 
        }
        f += 5;
        if (item.observaciones!=null) {
          doc.text ( item.observaciones , 40, f ); f += 5
        } else {
          doc.text ( '' , 40, f ); f += 5
        }
        f += 5
        doc.text ( '$'+this.formatMoney(item.total), 40, f ); f += 5
        doc.text ( '$'+this.formatMoney(item.descuento), 40, f );
        doc.text ( '%'+this.formatMoney(item.tasadescuento), 119, f ); f += 5

        if (tipcpr!='PAG') {
          doc.text ( '$'+this.formatMoney(item.retiva), 40, f ); //f += 5
          doc.text ( '$'+this.formatMoney(item.retgan), 119, f ); //f += 5
          doc.text ( '$'+this.formatMoney(item.retib), 170, f ); f += 5
        }

        if (item.afipiva!=null) {
          for (let j=0; j<=item.afipiva.length-1; j++) {
            doc.setFont(undefined,"bold");
            doc.text ( item.afipiva[j].afipiva.nombre, 40, f );
            doc.setFont(undefined,"normal");
            doc.text ( 'Gravado', 87, f );
            doc.setFont(undefined,"bold");
            doc.text ( '$'+this.formatMoney(item.afipiva[j].base), 119, f );
            doc.setFont(undefined,"normal");
            doc.text ( 'IVA', 149, f );
            doc.setFont(undefined,"bold");
            doc.text ( '$'+this.formatMoney(item.afipiva[j].iva), 170, f );
            f+=5
          }
        }

        doc.setFont(undefined,"normal");
        doc.setFontSize(8);
        f += 12
        doc.line( 10, f+10, 196,  f+10);     // linea vertical 1
        f += 14
        for (let i = 0; i<=item.items.length-1; i++) {

          //doc.text (item.items[i].articulo.codigo, 10, f )

          if (this.codigooid=='C') {
            doc.text (item.items[i].articulo.codigo, 10, f )
          } else {
            doc.text (item.items[i].articulo_id.toString(), 10, f )
          }

          let dec = item.items[i].articulo.precios.length>0?item.items[i].articulo.precios[0].decimales:2

          doc.text (item.items[i].articulo.nombre.substring(0,55), 31, f )
          doc.text (this.formatMoney(item.items[i].cantidad), 130, f, 'right')
          doc.text (this.formatMoney(item.items[i].precio, dec), 151, f, 'right')
          doc.text (this.formatMoney(item.items[i].tasadescuento), 162, f, 'right')
          doc.text (this.formatMoney(item.items[i].importedescuento), 176, f, 'right')
          doc.text (this.formatMoney(item.items[i].total), 196, f, 'right')
          f += 5
        }
        doc.setFontSize(10); f += 5
        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Valores', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'FP        NroValor  Cuenta      Fecha Financiera        Importe ', 10, f );
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6

        doc.setFontSize(8);
        if (item.valoresEgresos!=null) {
          for (let i = 0; i<=item.valoresEgresos.length-1; i++) {
            fec = moment(item.valoresEgresos[i].fechasalida).format('DD/MM/YYYY')
            doc.text (item.valoresEgresos[i].medio.abrev, 10, f )
            doc.text (item.valoresEgresos[i].nrovalor.toString(), 29, f, 'right' )
            doc.text (fec, 38, f )
            doc.text (item.valoresEgresos[i].observ, 68, f )
            doc.text (this.formatMoney(item.valoresEgresos[i].importe), 196, f, 'right')
            f += 5
          }
        }

        /*
        f += 15
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Fecha Vencimiento     Importe                   Pendiente         Fecha      Cpr.Cancelador      Observaciones              Importe', 10, f );
        doc.line( 10, f+2, 93,  f+2);     // linea vertical 1
        doc.line( 100, f+2, 196,  f+2);     // linea vertical 1
        doc.setFontSize(8);
        f += 6
        for (let i = 0; i<=item.pendientes.length-1; i++) {
          fec = moment(item.pendientes[i].vencimiento).format('DD/MM/YYYY')
          doc.text (fec, 10, f )
          doc.text (this.formatMoney(item.pendientes[i].importe), 57, f, 'right')
          doc.text (this.formatMoney(item.pendientes[i].pendiente), 91, f, 'right')
          let totCancelado = 0
          for (let j = 0; j<= item.pendientes[i].cancelaciones.length-1; j++) {
            fec = moment(item.pendientes[i].cancelaciones[j].cancelador.fecha).format('DD/MM/YYYY')
            doc.text (fec, 100, f )
            doc.text (item.pendientes[i].cancelaciones[j].cancelador.cpr, 116, f)
            doc.text (item.pendientes[i].cancelaciones[j].concepto, 147, f)
            doc.text (this.formatMoney(item.pendientes[i].cancelaciones[j].importe), 196, f, 'right')
            totCancelado += item.pendientes[i].cancelaciones[j].importe
            f += 5
          }
          f -= 2
          doc.line( 100, f, 196,  f); f += 5
          doc.text (this.formatMoney(totCancelado), 196, f, 'right')
        }
        */
      
      } else if (tipcpr=='PAG') {

        doc.setFontSize(20);
        doc.text ( 'PAGO', 10, 20 )
        doc.line( 10, 22, 30, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Receptor', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Observ', 10, f ); f +=  5
        doc.text ( 'Total Pago', 10, f ); f += 5
        doc.text ( 'Estado', 10, f ); f += 5

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        
        doc.setFont(undefined,"bold");
        doc.text ( item.cpr, 40, f ); f += 5
        doc.setFont(undefined,"normal");        

        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5

        if (item.tercero.direcciones.length>0) {
          doc.text ( item.tercero.direcciones[0].direccion+' ('+
                     item.tercero.direcciones[0].postal.codigo+ '-' +
                     item.tercero.direcciones[0].postal.nombre+ ')-' +
                     item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                     item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        } else {
          doc.text ( 'Sin dirección', 40, f ); f += 5
        }

        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        if (item.observaciones!=null) {
          doc.text ( item.observaciones , 40, f ); f += 5
        } else {
          doc.text ( '' , 40, f ); f += 5
        }
        doc.text ( '$'+this.formatMoney(item.total), 40, f ); f += 5;
        if (item.estado=='P') {
          doc.text ( 'PROCESADO', 40, f );
        } else if (item.estado=='A') {
          doc.text ( 'ANULADO', 40, f );
        }

        doc.setFontSize(12); f += 15
        doc.setFont(undefined,"bold");
        doc.text ( 'Valores', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'FP    Nr.Val.   Fec.Finan.    Observaciones                                                                                                              Importe ', 10, f );
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6

        doc.setFontSize(8);
        for (let i = 0; i<=item.valoresEgresos.length-1; i++) {
          fec = moment(item.valoresEgresos[i].fechasalida).format('DD/MM/YYYY')
          doc.text (item.valoresEgresos[i].medio.abrev, 10, f )
          if (item.valoresEgresos[i].nrovalor!=null) {
            doc.text (item.valoresEgresos[i].nrovalor.toString(), 25, f, 'right' )
          }
          doc.text (fec, 32, f )
          doc.text (item.valoresEgresos[i].observ, 53, f )
          doc.text (this.formatMoney(item.valoresEgresos[i].importe), 196, f, 'right')
          f += 5
        }

        /*
        f += 15
        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Cancelaciones', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Comprobante           Fecha Vencimiento           Importe                   Pendiente', 10, f );
        doc.line( 10, f+2, 130,  f+2);     // linea vertical 1
        doc.setFontSize(8);
        f += 6
        for (let i = 0; i<=item.cancelaciones.length-1; i++) {
          fec = moment(item.cancelaciones[i].cancelado.vencimiento).format('DD/MM/YYYY')
          doc.text (item.cancelaciones[i].cancelado.comprobante.cpr, 10, f )
          doc.text (fec, 42, f )
          doc.text (this.formatMoney(item.cancelaciones[i].cancelado.importe), 95, f, 'right')
          doc.text (this.formatMoney(item.cancelaciones[i].cancelado.pendiente), 130, f, 'right')
          f += 5
        }
        */

      } else if (tipcpr=='PED') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )
        doc.line( 10, 22, 93, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Total Pedido', 10, f ); f += 5
        doc.text ( 'Estado', 10, f ); f += 5
        f+=10

        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Items', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Código          Descripción                                                                            Ctt.            Precio  %Des.    $Des.        TOTAL', 10, f ); f += 5
        doc.setFont(undefined,"bold");

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5
        doc.text ( item.tercero.direcciones[0].direccion+' ('+
                   item.tercero.direcciones[0].postal.codigo+ '-' +
                   item.tercero.direcciones[0].postal.nombre+ ')-' +
                   item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                   item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        doc.text ( '$'+this.formatMoney(item.total), 40, f ); f += 5
        if (item.estado=='F') {
          doc.text ( 'Fnalizado', 40, f ); f += 5
        } else if (item.estado=='P') {
          doc.text ( 'Pendiente', 40, f ); f += 5
        } else if (item.estado=='L') {
          doc.text ( 'Facturado Parcialmente', 40, f ); f += 5
        }
        f += 5

        doc.setFont(undefined,"normal");
        doc.setFontSize(8);
        f += 17
        doc.line( 10, f, 196,  f);     // linea vertical 1
        f += 5
        for (let i = 0; i<=item.items.length-1; i++) {

          if (this.codigooid=='C') {
            doc.text (item.items[i].articulo.codigo, 10, f )
          } else {
            doc.text (item.items[i].articulo_id.toString(), 10, f )
          }

          doc.text (item.items[i].articulo.nombre.substring(0,55), 31, f )
          doc.text (this.formatMoney(item.items[i].cantidad), 130, f, 'right')

          if (item.items[i].articulo.precios.length>0) {
            doc.text (this.formatMoney(item.items[i].precio, item.items[i].articulo.precios[0].decimales), 151, f, 'right')
          } else {
            doc.text (this.formatMoney(item.items[i].precio, 4), 151, f, 'right')
          }

          doc.text (this.formatMoney(item.items[i].tasadescuento), 162, f, 'right')
          doc.text (this.formatMoney(item.items[i].importedescuento), 176, f, 'right')
          doc.text (this.formatMoney(item.items[i].total), 196, f, 'right')
          f += 5
        }
        doc.setFontSize(10);
      }
      doc.output ('dataurlnewwindow');
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        const negativeSign = amount < 0 ? "-" : "";
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
      } catch (e) {
        console.log(e)
      }
    },

    esqueleto(datos, img, doc, quien, rangos, pagina) {

      if (pagina>0) {
        doc.addPage()
      }
      var qr = new Image();
      if (datos.tipcpr == 'FAC' || datos.tipcpr == 'NDD' || datos.tipcpr == 'NDC' || datos.tipcpr == 'PED' ||
          datos.tipcpr == 'PRE' || datos.tipcpr == 'REC' || datos.tipcpr == 'REM' || datos.tipcpr == 'PAG') {

        let possuc = 0
        for (let i=0; i<=datos.sucursales.length-1; i++) {
          if (datos.sucursales[i].id == datos.sucursal) {
            possuc = i
            break
          }
        }
        let path = 'images/'
        let file = 'Sin Imagen.jpg'
        if (possuc>=0 && datos.sucursales[possuc].logotipo!= null) {
          file = datos.sucursales[possuc].logotipo
        }
        if (datos.logotipo) {
          img.src = path + datos.logotipo // file
          doc.addImage(img, 'jpg', 10, 20, 52, 25)
        }

        // CODIGO QR, SOLO PARA COMPROBANTES FISCALES
        if (datos.tipcpr == 'FAC' || datos.tipcpr == 'NDD' || datos.tipcpr == 'NDC') {
          if (pagina==rangos.length-1) {
            let d = "ver:1,fecha:2020-10-13,cuit:30000000007,ptoVta:10,tipoCmp:1,nroCmp:94,importe:12100,moneda:DOL,ctz:65,tipoDocRec:80,nroDocRec:20000000001,tipoCodAut:E,codAut:70417054367476"
            let imgSrc = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+d;
            qr.src = imgSrc
            doc.addImage(qr, 'jpg', 15, 250, 30,  30)
          }
        }

        doc.setFontSize(8);
        doc.text ( 'gohu', 192, 14 )

        doc.setFontSize(9);
        doc.text ( 'Razón Social:', 15, 50 )
        doc.text ( 'Domicilio:', 15, 55 )
        doc.text ( 'Condicion frente al IVA:', 15, 60 )

        doc.setFontSize(14);
        doc.text ( 'ORIGINAL', 93, 16 )

        if (rangos.length>1) {
          doc.setFontSize(8);
          doc.text ( 'Página      de', 150, 15 )
          let p = pagina+1
          doc.text ( p.toString(), 161, 15)
          doc.text ( rangos.length.toString(), 169, 15)
        }

        doc.setFontSize(16);
        if (datos.tipcpr=='FAC') {
          doc.text ( 'FACTURA', 120, 27 )
        } else if (datos.tipcpr=='NDD') {
          doc.text ( 'NOTA DE DEBITO', 120, 27 )
        } else if (datos.tipcpr=='NDC') {
          doc.text ( 'NOTA DE CREDITO', 120, 27 )
        } else if (datos.tipcpr=='PED') {
          doc.text ( 'PEDIDO', 120, 27 )
        } else if (datos.tipcpr=='PRE') {
          doc.text ( 'PRESUPUESTO', 120, 27 )
        } else if (datos.tipcpr=='REC') {
          doc.text ( 'RECIBO', 120, 27 )
        } else if (datos.tipcpr=='PAG') {
          doc.text ( 'NOTA DE PAGO', 120, 27 )
        } else if (datos.tipcpr=='REM') {
          doc.text ( 'REMITO', 120, 27 )
        }

        doc.setFontSize(9);
        doc.text ( 'Punto de Venta', 120, 35 )
        doc.text ( 'Comp. Nro', 157, 35 )
        doc.text ( 'Fecha de Emisión:', 120, 41 )
        doc.text ( 'CUIT', 120, 47 )
        doc.text ( 'Ingresos Brutos', 120, 53 )
        doc.text ( 'Fecha de Inicio de Actividades', 120, 59 )

        doc.setFont(undefined,"bold");
        doc.text ( 'NO', 144, 53 )
        doc.text ( '01/01/2000', 166, 59 )

        doc.setFont(undefined,"normal");
        doc.text ( 'Vencimiento del Comprobante', 15, 72 )
        doc.text ( 'CUIT', 15, 83 )
        doc.text ( 'Condicion de IVA', 15, 89 )
        doc.text ( 'Condicion de Venta', 15, 95 )
        doc.text ( 'Nombre / Razón Social', 90, 83 )
        doc.text ( 'Domicilio', 90, 89 )

        doc.rect(  10,  10, 190,  10);     // segundo rectangulo
        doc.rect(  10,  20, 190,  45);     // primer rectangulo
        doc.rect(  97,  20,  16,  20);     // rectangulo de la letra
        doc.line( 105,40.1, 105,  65);     // linea vertical 1
        doc.rect(  10,  66, 190,  10);     // segundo rectangulo
        doc.rect(  10,  77, 190,  25);     // segundo rectangulo
        if (datos.tipcpr == 'FAC' || datos.tipcpr == 'NDD' || datos.tipcpr == 'NDC' ||
            datos.tipcpr == 'PED' || datos.tipcpr == 'REM' || datos.tipcpr == 'PRE') {
          doc.setFontSize(8);
          doc.setDrawColor(0);
          doc.setFillColor(234, 234, 234);
          doc.rect( 10, 103, 20, 7, 'FD');  //codigo
          doc.rect( 31, 103, 86, 7, 'FD');  //descripcion
          doc.rect(118, 103, 20, 7, 'FD');  //cantidad
          doc.rect(139, 103, 20, 7, 'FD');  //precio
          doc.rect(160, 103, 11, 7, 'FD');  // % Bonif
          doc.rect(172, 103, 28, 7, 'FD');  //TOTAL

          doc.text ( 'Codigo', 12.5, 107.5 )
          doc.text ( 'Descripción', 33.5, 107.5 )
          doc.text ( 'Cantidad', 125.5, 107.5 )
          doc.text ( 'Precio Unit.', 143.5, 107.5 )
          doc.text ( '%Bonif', 160.5, 107.5 )
          doc.text ( 'TOTAL', 189.5, 107.5 )

          // pie
          if (pagina==rangos.length-1) {
            doc.rect(  10, 240, 190,  45);     // rectangulo
            doc.text ( 'Observaciones', 13, 245 )
            if (datos.recargo!=0) {
              doc.text ( 'Recargo', 155, 245 )
            }
            doc.text ( 'Subtotal', 155, 250 )
            doc.text ( '%Descuento', 155, 255 )
            doc.text ( 'Descuento', 155, 260 )
            doc.text ( 'Gravado', 155, 265 )
            doc.text ( 'Exento', 155, 270 )
            doc.text ( 'IVA', 155, 275 )
            doc.text ( 'TOTAL', 155, 282 )
          }

        } else if ( datos.tipcpr == 'REC' ) {

//        doc.setFontSize(12);
//        doc.text ( 'TOTAL RECIBO', 135, 282 )

        } else if ( datos.tipcpr == 'PAG' ) {

//        doc.setFontSize(12);
//        doc.text ( 'TOTAL PAGO', 135, 282 )

        }
      }
    },

    cabecera(datos, doc, rangos, pagina) {
      doc.setFont(undefined,"bold");
      doc.setFontSize(36);
      doc.text ( datos.cpr.substring(4,5), 100.5, 32 )
      doc.setFontSize(9);

      doc.text ( datos.emiRazonSocial, 37, 50 )
      doc.setFontSize(6);
      if (datos.tipcpr=='FAC' && datos.recargo>0) {
        doc.text ( 'Este comprobante posee recargo por la forma de pago utilizada', 13, 238 )  
      }
      doc.text ( datos.emiDireccion, 31, 55 )
      doc.text ( datos.emiResponsable, 51, 60 )
      doc.setFontSize(9);

      doc.text ( moment(String(datos.fecha)).format('L'), 148, 41 )
      doc.text ( datos.cpr.substring(6,10), 144, 35 )
      doc.text ( datos.cpr.substring(11,19), 174, 35 )
      doc.text ( datos.emiCUIT, 129, 47 )

      doc.text ( datos.recCUIT, 24, 83 )
      doc.text ( datos.recRazonSocial, 125, 83 )
      doc.text ( datos.recResponsable, 42, 89 )
      doc.text ( 'CONTADO', 45, 95 )
      
      doc.setFontSize(7);
      doc.text ( datos.recDireccion, 105, 89 )

    },



    detalles(datos, doc, rangos, pagina) {

      let h = 280
      if (datos.tipcpr == 'FAC' || datos.tipcpr == 'NDD' || datos.tipcpr == 'NDC' ||
          datos.tipcpr == 'PED' || datos.tipcpr == 'REM' || datos.tipcpr == 'PRE') {

        doc.setFont(undefined,"normal");
        doc.setLineWidth(0.1);
        let f = 114;
        doc.setFontSize(7);

        if (rangos[pagina].desde!=0 && rangos[pagina].hasta!=0) {
          for (let i = rangos[pagina].desde-1; i<=rangos[pagina].hasta-1; i++) {
            if (datos.items[i].articulo.id===1) {
              doc.text (datos.items[i].texto.substring(0,65), 10, f )
            } else {
              if (this.codigooid=='C') {
                doc.text (datos.items[i].articulo.codigo, 10, f )
              } else {
                doc.text (datos.items[i].articulo.id.toString(), 10, f )
              }
              doc.text (datos.items[i].articulo.nombre.substring(0,55), 31, f )
            }
            doc.text (this.formatMoney(datos.items[i].cantidad), 137, f, 'right')
//          doc.text (this.formatMoney(datos.items[i].precio, datos.items[i].articulo.precios[0].decimales), 158, f, 'right')
            doc.text (this.formatMoney(datos.items[i].precio), 158, f, 'right')
            doc.text (this.formatMoney(datos.items[i].tasadescuento), 170, f, 'right')
            doc.text (this.formatMoney(datos.items[i].total), 198, f, 'right')
            f += 4.5
          }
        }
        // pie
        if (pagina==rangos.length-1) {
          doc.setFontSize(8);
          if (datos.recargo!=0) {
            doc.text (this.formatMoney(datos.recargo), 198, 245, 'right')
          }
          doc.text (this.formatMoney(datos.totales.gravado), 198, 250, 'right')  
          if (datos.totales.tasadescuento!=0) {
            doc.text (this.formatMoney(datos.totales.tasadescuento), 198, 255, 'right')
            doc.text (this.formatMoney(datos.totales.importedescuento), 198, 260, 'right')
          } else {
            doc.text (this.formatMoney(0), 198, 255, 'right')
            doc.text (this.formatMoney(0), 198, 260, 'right')
          }
          doc.text (this.formatMoney(datos.totales.gravado), 198, 265, 'right')
          doc.text (this.formatMoney(datos.totales.exento), 198, 270, 'right')
          doc.text (this.formatMoney(datos.totales.iva), 198, 275, 'right')

          doc.setFontSize(12);
          doc.setFont(undefined,"bold");
          doc.text (this.formatMoney(datos.totales.total), 198, 282, 'right')
        }

      } else if (datos.tipcpr=='REC') {

        let cancelaciones = []
        let valores = []
        /*
        for (let i=0; i<=datos.cancelaciones.length-1; i++) {
          cancelaciones.push({ 
            fec: datos.cancelaciones[i].cancelado.vencimiento,
            cpr: datos.cancelaciones[i].cancelado.comprobante.cpr,
            importe: datos.cancelaciones[i].cancelado.importe,
            pendiente: datos.cancelaciones[i].cancelado.pendiente,
            cancelado: datos.cancelaciones[i].importe,
          })
        }
        */

        for (let i=0; i<=datos.valoresIngresos.length-1; i++) {
          valores.push({ 
            medio: datos.valoresIngresos[i].medio.abrev,
            fechafinanciera: datos.valoresIngresos[i].fechafinanciera,
            observ: datos.valoresIngresos[i].observ,
            importe: datos.valoresIngresos[i].importe
          })
        }
          
        let f = 115
        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Cancelaciones', 10, f );
        
        f = this.cp(f, 5, 10, h, doc)

        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Fecha      Cpr.Cancelado                                Importe                 Pendiente              Cancelado', 10, f );
        doc.line( 10, f+2, 156,  f+2);     // linea vertical 1
        doc.setFontSize(8);

        f = this.cp(f, 6, 10, h, doc)

        /*
        let totCancelado = 0
        for (let i = 0; i<=cancelaciones.length-1; i++) {
          let fec = moment(cancelaciones[i].fec).format('DD/MM/YYYY')
          doc.text (fec, 10, f )
          doc.text (cancelaciones[i].cpr, 26, f, 'left')
          doc.text (this.formatMoney(cancelaciones[i].importe), 92.5, f, 'right')
          doc.text (this.formatMoney(cancelaciones[i].pendiente), 125, f, 'right')
          doc.text (this.formatMoney(cancelaciones[i].cancelado), 155, f, 'right')
          totCancelado += cancelaciones[i].cancelado
          f = this.cp(f, 4, 10, h, doc)
        }
        doc.line( 10, f, 156,  f); f += 4
        doc.text (this.formatMoney(totCancelado), 155, f, 'right')
        */

        f = this.cp(f, 5, 10, h, doc)

        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Valores', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Medio      Observaciones                                                                                                                    Importe', 10, f );
        doc.line( 10, f+2, 176,  f+2);     // linea vertical 1
        doc.setFontSize(8);

        f = this.cp(f, 6, 10, h, doc)

        let totValores = 0
        for (let i = 0; i<=valores.length-1; i++) {
          let fec = moment(valores[i].fechafinanciera).format('DD/MM/YYYY')
          //doc.text (fec, 10, f )
          doc.text (valores[i].medio, 10, f )
          doc.text (valores[i].observ, 26, f, 'left')
          doc.text (this.formatMoney(valores[i].importe), 175, f, 'right')
          totValores += valores[i].importe
          f = this.cp(f, 4, 10, h, doc)
        }
        doc.line( 10, f, 176,  f);

        f = this.cp(f, 4, 10, h, doc)
        doc.text (this.formatMoney(totValores), 175, f, 'right')

        f = 280
        doc.setFontSize(12);
        doc.text ( 'TOTAL RECIBO', 110, f )
        doc.text ('$'+this.formatMoney(totValores), 175, f, 'right')

      } else if (datos.tipcpr=='PAG') {

        let valores = []
        /*
        let cancelaciones = []
        for (let i=0; i<=datos.cancelaciones.length-1; i++) {
          cancelaciones.push({ 
            fec: datos.cancelaciones[i].cancelado.vencimiento,
            cpr: datos.cancelaciones[i].cancelado.comprobante.cpr,
            importe: datos.cancelaciones[i].cancelado.importe,
            pendiente: datos.cancelaciones[i].cancelado.pendiente,
            cancelado: datos.cancelaciones[i].importe,
          })
        }
        */

        for (let i=0; i<=datos.valoresEgresos.length-1; i++) {
          valores.push({ 
            medio: datos.valoresEgresos[i].medio.abrev,
            fechafinanciera: datos.valoresEgresos[i].fechafinanciera,
            observ: datos.valoresEgresos[i].observ,
            importe: datos.valoresEgresos[i].importe
          })
        }
          
        /*
        let f = 115
        doc.setFontSize(12);
        doc.setFont(undefined,"bold");
        doc.text ( 'Cancelaciones', 10, f ); f += 5
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Fecha      Cpr.Cancelado                                Importe                 Pendiente              Cancelado', 10, f );
        doc.line( 10, f+2, 156,  f+2);     // linea vertical 1
        doc.setFontSize(8);

        let totCancelado = 0
        f = this.cp(f, 6, 10, h, doc)
        for (let i = 0; i<=cancelaciones.length-1; i++) {
          let fec = moment(cancelaciones[i].fec).format('DD/MM/YYYY')
          doc.text (fec, 10, f )
          doc.text (cancelaciones[i].cpr, 26, f, 'left')
          doc.text (this.formatMoney(cancelaciones[i].importe), 92.5, f, 'right')
          doc.text (this.formatMoney(cancelaciones[i].pendiente), 125, f, 'right')
          doc.text (this.formatMoney(cancelaciones[i].cancelado), 155, f, 'right')
          totCancelado += cancelaciones[i].cancelado
          f = this.cp(f, 4, 10, h, doc)
        }
        doc.line( 10, f, 156,  f);
        f = this.cp(f, 4, 10, h, doc)
        doc.text (this.formatMoney(totCancelado), 155, f, 'right')
        f = this.cp(f, 5, 10, h, doc)
        doc.setFontSize(12);
        */
        doc.setFont(undefined,"bold");
        doc.text ( 'Valores', 10, f );
        f = this.cp(f, 5, 10, h, doc)
        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Medio      Observaciones                                                                                                                    Importe', 10, f );
        doc.line( 10, f+2, 176,  f+2);     // linea vertical 1
        doc.setFontSize(8);
        f = this.cp(f, 6, 10, h, doc)

        let totValores = 0
        for (let i = 0; i<=valores.length-1; i++) {
          doc.text (valores[i].medio, 10, f )
          doc.text (valores[i].observ, 26, f, 'left')
          doc.text (this.formatMoney(valores[i].importe), 175, f, 'right')
          totValores += valores[i].importe
          f = this.cp(f, 4, 10, h, doc)
        }
        doc.line( 10, f, 176,  f);
        f = this.cp(f, 4, 10, h, doc)
        doc.text (this.formatMoney(totValores), 175, f, 'right')

        f = 280
        doc.setFontSize(12);
        doc.text ( 'TOTAL PAGO', 110, f )
        doc.text ('$'+this.formatMoney(totValores), 175, f, 'right')

      }

    },

    /*
    planillaDeRendicionesDeMaletin(items, detalles, viaje ) {
      var doc = new jsPDF();
      doc.setFontSize(20);
      doc.text ( 'Rendición de Valores', 10, 20 )
      doc.line( 10, 22, 78, 22);
      doc.setFontSize(8);
      doc.text ( 'gohu', 195 , 5 )
      let f = 30
      let t = 0
      doc.setFont(undefined,"normal");
      doc.setFontSize(10);
      doc.text ( 'Viaje: '+viaje.id, 10, f ); f += 5;
      doc.text ( 'Zona: '+viaje.zona.nombre, 10, f ); f += 5;
      doc.text ( 'Fecha: '+moment(viaje.fecha).format('LLLL'), 10, f ); f += 8;
      doc.setFontSize(10);
      doc.text ( 'Recibo                     Rend   Equipo               Cliente                                           Medio              Numero                        Importe', 10, f );
      doc.line( 10, f+2, 204,  f+2);     // linea vertical 1
      f = 55
      doc.setFontSize(9);
      for (let i = 0; i<=items.length-1; i++) {
        items[i].numero = items[i].numero||0
        doc.text (items[i].cpr, 10, f )
        doc.text (items[i].rendido?'Si':'No', 42, f )
        doc.text (items[i].username, 53, f )
        doc.text (items[i].cliente, 79, f )
        doc.text (items[i].medio, 132, f )
        doc.text (items[i].numero.toString(), 167, f, 'right')
        doc.text ('$'+this.formatMoney(items[i].importe), 204, f, 'right')
        t += items[i].importe
        f += 5
        if (f>280) {
          doc.addPage()
          f = 10
        }
      }
      doc.setFontSize(10);
      doc.line( 10, f-2, 204,  f-2);     // linea vertical 1
      doc.text ('$'+this.formatMoney(t), 204, f+2, 'right'); f+=5;

      f += 10
      if (f>280) {
        doc.addPage()
        f = 10
      }

      doc.setFont(undefined,"bold");
      doc.setFontSize(10);
      doc.text ( 'TOTALES POR EQUIPO Y VALORES', 10, f ); f += 5;
      doc.setFont(undefined,"normal");

      doc.setFontSize(9);
      for (let i = 0; i<=detalles.length-1; i++) {
        doc.setFont(undefined,"bold");
        doc.text (detalles[i].user, 10, f );
        doc.setFont(undefined,"normal");
        doc.line( 10, f+2, 73,  f+2 );f+=7     // linea vertical 1
        for (let j = 0; j<=detalles[i].valores.length-1; j++) {
          doc.text (detalles[i].valores[j].medio, 15, f );
          doc.text ('$'+this.formatoImporte(detalles[i].valores[j].total), 73, f, 'right'); f+=5;
        }
      }
      doc.setFontSize(10);
      doc.output ('dataurlnewwindow');
    },
    */

    viaje(viaje ) {

      var doc = new jsPDF('l', 'pt')  // 'p' normal 'l' horizontal ( landscape )
      doc.setFontSize(20);
      doc.text ( 'Planilla de Viaje', 15, 30 )
      doc.line( 15, 35, 160, 35);
      doc.setFontSize(8);
      doc.text ( 'gohu', 495 , 10 )
      let f = 50
      let t = 0
      doc.setFont(undefined,"normal");
      doc.setFontSize(10);
      doc.text ( 'Viaje: '+viaje.id, 15, f ); f += 15;
      doc.text ( 'Zona: '+viaje.zona.nombre, 15, f ); f += 15;
      doc.text ( 'Fecha: '+moment(viaje.fecha).format('LLLL'), 15, f ); f += 20;
      doc.setFontSize(10);

      doc.text ( 'Cliente', 15, f );
      doc.line( 15, f+8, 820,  f+8);     // linea vertical 1
      f += 25

      doc.text ( 'Pedido                                             Factura/s                                           Ndds/Ndcs                                            Recibos                                        Maletín', 45, f );
      doc.line( 45, f+8, 820,  f+8);     // linea vertical 1

      let mat = []
      f = 153
      doc.setFontSize(9);
      for (let i = 0; i<=viaje.recorrido.length-1; i++) {
        let cprs = {
          ped: { cpr: '', tot: 0},
          rem: { cpr: '', tot: 0},
          facA: { cpr: '', tot: 0},
          facB: { cpr: '', tot: 0},
          nddA: { cpr: '', tot: 0},
          nddB: { cpr: '', tot: 0},
          ndcA: { cpr: '', tot: 0},
          ndcB: { cpr: '', tot: 0},
          recA: [],
          recB: [],
        }

        if (viaje.recorrido[i].pedido) {
          cprs.ped.cpr = this.kit.cpr(viaje.recorrido[i].pedido.cpr)
          cprs.ped.tot = viaje.recorrido[i].pedido.total
          if (viaje.recorrido[i].pedido.vinculoPadre!=null) {
            for (let j=0; j<=viaje.recorrido[i].pedido.vinculoPadre.length-1; j++) {
              if (viaje.recorrido[i].pedido.vinculoPadre[j].hijo) {
                cprs.facA.cpr = this.kit.cpr(viaje.recorrido[i].pedido.vinculoPadre[j].hijo.cpr)
                cprs.facA.tot = viaje.recorrido[i].pedido.vinculoPadre[j].hijo.total
                if (viaje.recorrido[i].pedido.vinculoPadre[j].hijos) {
                  for (let k=0; k<=viaje.recorrido[i].pedido.vinculoPadre[j].hijos.length-1; k++) {
                    let cprid = viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.comprobante_id
                    if (cprid==125) {
                      cprs.rem.cpr = this.kit.cpr(viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.cpr)
                    } else if (cprid==2||cprid==7||cprid==12||cprid==52) {
                      cprs.nddA.cpr = this.kit.cpr(viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.cpr)
                      cprs.nddA.tot = viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.total
                    } else if (cprid==3||cprid==8||cprid==13||cprid==53) {
                      cprs.ndcA.cpr = this.kit.cpr(viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.cpr)
                      cprs.ndcA.tot = viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.total
                    } else if (cprid==4||cprid==9||cprid==15||cprid==54) {
                      cprs.recA.push({
                        cpr: this.kit.cpr(viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.cpr),
                        tot: viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.total,
                        val: [],
                      })
                      if (viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos.length>0) {
                        let p = cprs.recA.length-1
                        for (let l=0; l<=viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos.length-1; l++) {

                          let maletin = null
                          if (viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos.length>0) {
                            if (viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].maletinitem!=undefined) {
                              maletin = viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].maletinitem.maletin.cobrador.username
                            }
                          }
                          cprs.recA[p].val.push({
                            id: viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].id,
                            medio: viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].medio.nombre,
                            fecha: moment(viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].fechafinanciera).format('DD/MM/YYYY'),
                            nrovalor: viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].nrovalor,
                            importe: viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].importe,
                            chequeado: viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].chequeado,
                            user: maletin,
                          })
                          
                          let med = viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].medio.id
                          let imp = viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].importe

                          if (maletin!=null) {
                            let pos = mat.findIndex(x=>x.user==viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].maletinitem.maletin.cobrador.username)
                            if (pos==-1) {
                              mat.push({
                                user: viaje.recorrido[i].pedido.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].maletinitem.maletin.cobrador.username,
                                efectivo: 0, tarjetas: 0, cheques: 0, transferencias: 0, otros: 0,
                              })
                              pos = mat.length-1
                            }
                            if (med==1) {
                              mat[pos].efectivo += imp
                            } else if (med==2||med==3) {
                              mat[pos].tarjetas += imp
                            } else if (med==5) {
                              mat[pos].transferencias += imp
                            } else if (med==6) {
                              mat[pos].cheques += imp
                            } else if (med==7||med==8) {
                              mat[pos].otros += imp
                            }
                          }

                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (viaje.recorrido[i].pedidob) {
          cprs.ped.tot += viaje.recorrido[i].pedidob.total
          if (viaje.recorrido[i].pedido.vinculoPadre!=null) {
            for (let j=0; j<=viaje.recorrido[i].pedidob.vinculoPadre.length-1; j++) {
              if (viaje.recorrido[i].pedidob.vinculoPadre[j].hijo) {
                cprs.facB.cpr = this.kit.cpr(viaje.recorrido[i].pedidob.vinculoPadre[j].hijo.cpr)
                cprs.facB.tot = viaje.recorrido[i].pedidob.vinculoPadre[j].hijo.total
                if (viaje.recorrido[i].pedidob.vinculoPadre[j].hijos) {
                  for (let k=0; k<=viaje.recorrido[i].pedidob.vinculoPadre[j].hijos.length-1; k++) {
                    let cprid = viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.comprobante_id
                    if (cprid==125) {
                      cprs.rem.cpr = this.kit.cpr(viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.cpr)
                    } else if (cprid==2||cprid==7||cprid==12||cprid==52) {
                      cprs.nddB.cpr = this.kit.cpr(viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.cpr)
                      cprs.nddB.tot = viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.total
                    } else if (cprid==3||cprid==8||cprid==13||cprid==53) {
                      cprs.ndcB.cpr = this.kit.cpr(viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.cpr)
                      cprs.ndcB.tot = viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.total
                    } else if (cprid==4||cprid==9||cprid==15||cprid==54) {
                      cprs.recB.push({
                        cpr: this.kit.cpr(viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.cpr),
                        tot: viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.total,
                        val: []
                      })
                      if (viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos.length>0) {
                        let p = cprs.recB.length-1
                        for (let l=0; l<=viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos.length-1; l++) {

                          let maletin = null
                          if (viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos.length>0) {
                            if (viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].maletinitem!=undefined) {
                              maletin = viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].maletinitem.maletin.cobrador.username
                            }
                          }
                         
                          cprs.recB[p].val.push({
                            id: viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].id,
                            medio: viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].medio.nombre,
                            fecha: moment(viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].fechafinanciera).format('DD/MM/YYYY'),
                            nrovalor: viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].nrovalor,
                            importe: viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].importe,
                            chequeado: viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].chequeado,
                            user: maletin,
                          })

                          let med = viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].medio.id
                          let imp = viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].importe

                          if (maletin!=null) {
                            let pos = mat.findIndex(x=>x.user==viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].maletinitem.maletin.cobrador.username,)
                            if (pos==-1) {
                              mat.push({
                                user: viaje.recorrido[i].pedidob.vinculoPadre[j].hijos[k].hijo.valoresIngresos[l].maletinitem.maletin.cobrador.username,
                                efectivo: 0, tarjetas: 0, cheques: 0, transferencias: 0, otros: 0,
                              })
                              pos = mat.length-1
                            }
                            if (med==1) {
                              mat[pos].efectivo += imp
                            } else if (med==2||med==3) {
                              mat[pos].tarjetas += imp
                            } else if (med==5) {
                              mat[pos].transferencias += imp
                            } else if (med==6) {
                              mat[pos].cheques += imp
                            } else if (med==7||med==8) {
                              mat[pos].otros += imp
                            }
                          }

                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        let totRec = 0
        let totFac = 0
        let totDC = 0
        let sumaB = 0

        if (cprs.facA.tot!=0||cprs.facB.tot!=0) {

          doc.text (viaje.recorrido[i].cliente.id.toString(), 15, f )
          doc.text (viaje.recorrido[i].cliente.nombre.substring(0,25), 38, f )
  
          f = this.cp(f, 17, 53, 500, doc)
  
          doc.text (cprs.ped.cpr, 45, f )
          doc.text ('$'+this.formatMoney(cprs.ped.tot), 190, f, 'right');
  
          if (cprs.facA.cpr!='') {
            doc.text (cprs.facA.cpr, 200, f )
            doc.text ('$'+this.formatMoney(cprs.facA.tot), 345, f, 'right');
            totFac += cprs.facA.tot
          }
  
          if (cprs.facB.cpr!='') {
            doc.text (cprs.facB.cpr, 200, f+15 )
            doc.text ('$'+this.formatMoney(cprs.facB.tot), 345, f+15, 'right');
            totFac += cprs.facB.tot
            sumaB = 15
          }
  
          if (cprs.nddA.cpr!='') {
            doc.text (cprs.nddA.cpr, 365, f )
            doc.text ('$'+this.formatMoney(cprs.nddA.tot), 510, f, 'right');
            totDC += cprs.nddA.tot
          }
  
          if (cprs.nddB.cpr!='') {
            doc.text (cprs.nddB.cpr, 365, f+15 )
            doc.text ('$'+this.formatMoney(cprs.nddB.tot), 510, f+15, 'right');
            totDC += cprs.nddB.tot
            sumaB = 15
          }

          if (cprs.ndcA.cpr!='') {
            doc.text (cprs.ndcA.cpr, 365, f )
            doc.text ('$'+this.formatMoney(cprs.ndcA.tot), 510, f, 'right');
            totDC += cprs.ndcA.tot
          }
  
          if (cprs.ndcB.cpr!='') {
            doc.text (cprs.ndcB.cpr, 365, f+15 )
            doc.text ('$'+this.formatMoney(cprs.ndcB.tot), 510, f+15, 'right');
            totDC += cprs.ndcB.tot
            sumaB = 15
          }
  
          for (let x=0; x<=cprs.recA.length-1; x++) {
            doc.text (cprs.recA[x].cpr, 535, f )
            doc.text ('$'+this.formatMoney(cprs.recA[x].tot), 680, f, 'right');
            totRec += cprs.recA[x].tot
          }
  
          for (let x=0; x<=cprs.recB.length-1; x++) {
            doc.text (cprs.recB[x].cpr, 535, f )
            doc.text ('$'+this.formatMoney(cprs.recB[x].tot), 680, f+15, 'right');
            totRec += cprs.recB[x].tot
            sumaB = 15
          }
  
          f += sumaB+15;

          doc.setFont(undefined,"bold");
          doc.text ('$'+this.formatMoney(totFac), 345, f, 'right');
          doc.text ('$'+this.formatMoney(totDC), 510, f, 'right');
          doc.text ('$'+this.formatMoney(totRec), 680, f, 'right');
          doc.setFont(undefined,"normal");

          f += 18;
  
          doc.text ( 'Medio                          Fecha                    Nro                       Importe        Chequeado  Equipo', 80, f );
          doc.line( 80, f+8, 660,  f+8);     // linea vertical 1
  
          f = this.cp(f, 23, 53, 500, doc)
  
          let totVal = 0
          if (cprs.recA!=undefined) {
            for (let x=0; x<=cprs.recA.length-1; x++) {
              for (let y=0; y<=cprs.recA[x].val.length-1; y++) {
                doc.text (cprs.recA[x].val[y].medio, 80, f )
                doc.text (cprs.recA[x].val[y].fecha, 150, f )
                if (cprs.recA[x].val[y].nrovalor!=null) {
                  doc.text (cprs.recA[x].val[y].nrovalor.toString(), 260, f, 'right' )
                }
                doc.text ('$'+this.formatMoney(cprs.recA[x].val[y].importe), 345, f, 'right')
                totVal += cprs.recA[x].val[y].importe
                doc.text (cprs.recA[x].val[y].chequeado?'Sí':'No', 378, f, 'right')
                if (cprs.recA[x].val[y].user!=null) {
                  doc.text (cprs.recA[x].val[y].user, 444, f, 'right' )
                }
                f = this.cp(f, 15, 53, 500, doc)
              }
            }
          }
          if (cprs.recB!=undefined) {
            for (let x=0; x<=cprs.recB.length-1; x++) {
              for (let y=0; y<=cprs.recB[x].val.length-1; y++) {
                doc.text (cprs.recB[x].val[y].medio, 80, f )
                doc.text (cprs.recB[x].val[y].fecha, 150, f )
                if (cprs.recB[x].val[y].nrovalor!=null) {
                  doc.text (cprs.recB[x].val[y].nrovalor.toString(), 260, f, 'right' )
                }
                doc.text ('$'+this.formatMoney(cprs.recB[x].val[y].importe), 345, f, 'right')
                totVal += cprs.recB[x].val[y].importe
                doc.text (cprs.recB[x].val[y].chequeado?'Sí':'No', 378, f, 'right')
                if (cprs.recB[x].val[y].user!=null) {
                  doc.text (cprs.recB[x].val[y].user, 444, f, 'right' )
                }
                f = this.cp(f, 15, 53, 500, doc)
              }
            }
          }
          doc.setFont(undefined,"bold");
          doc.text ('$'+this.formatMoney(totVal), 345, f, 'right')
          doc.setFont(undefined,"normal");
          doc.line( 15, f+8, 820,  f+8);     // linea vertical 1
          f += 8
          f = this.cp(f, 15, 53, 500, doc)

        }
      }

      f += 15
      doc.setFont(undefined,"bold");
      doc.setFontSize(10);
      doc.text ( 'TOTALES POR EQUIPO Y VALORES', 15, f );
      f += 20
      doc.text ( 'Equipo', 15, f );
      doc.text ( 'Efectivo', 192, f );
      doc.text ( 'Tarjetas', 307, f );
      doc.text ( 'Cheques', 418, f );
      doc.text ( 'Transferencias', 503, f );
      doc.text ( 'Otros', 663, f );
      doc.text ( 'TOTAL', 770, f );
      doc.line( 15, f+8, 820,  f+8);     // linea vertical 1
      f += 20
      doc.setFont(undefined,"normal");
      doc.setFontSize(9);
      let totEfe = 0, totTar = 0, totChe = 0, totTra = 0, totOtr = 0
      for (let i = 0; i<=mat.length-1; i++) {
        doc.text (mat[i].user, 15, f );
        doc.text ('$'+this.formatoImporte(mat[i].efectivo), 230, f, 'right');
        doc.text ('$'+this.formatoImporte(mat[i].tarjetas), 345, f, 'right');
        doc.text ('$'+this.formatoImporte(mat[i].cheques), 460, f, 'right');
        doc.text ('$'+this.formatoImporte(mat[i].transferencias), 575, f, 'right');
        doc.text ('$'+this.formatoImporte(mat[i].otros), 690, f, 'right');
        doc.text ('$'+this.formatoImporte(mat[i].efectivo+mat[i].tarjetas+mat[i].cheques+mat[i].transferencias+mat[i].otros), 805, f, 'right');
        totEfe += mat[i].efectivo
        totTar += mat[i].tarjetas
        totChe += mat[i].cheques
        totTra += mat[i].transferencias
        totOtr += mat[i].otros
        f += 15;
      }
      doc.line( 15, f-5, 820,  f-5);     // linea vertical 1
      f += 8;
      doc.setFont(undefined,"bold");
      doc.text ('$'+this.formatoImporte(totEfe), 230, f, 'right');
      doc.text ('$'+this.formatoImporte(totTar), 345, f, 'right');
      doc.text ('$'+this.formatoImporte(totChe), 460, f, 'right');
      doc.text ('$'+this.formatoImporte(totTra), 575, f, 'right');
      doc.text ('$'+this.formatoImporte(totOtr), 690, f, 'right');
      doc.text ('$'+this.formatoImporte(totEfe+totTar+totChe+totTra+totOtr), 805, f, 'right');
      doc.setFont(undefined,"normal");

      //doc.setFontSize(10);
      //doc.line( 10, f-2, 204,  f-2);     // linea vertical 1
      //doc.text ('$'+this.formatMoney(t), 204, f+2, 'right'); f+=5;

      /*
      doc.setFont(undefined,"bold");
      doc.setFontSize(10);
      doc.text ( 'TOTALES POR EQUIPO Y VALORES', 10, f ); f += 5;
      doc.setFont(undefined,"normal");

      doc.setFontSize(9);
      for (let i = 0; i<=detalles.length-1; i++) {
        doc.setFont(undefined,"bold");
        doc.text (detalles[i].user, 10, f );
        doc.setFont(undefined,"normal");
        doc.line( 10, f+2, 73,  f+2 );f+=7     // linea vertical 1
        for (let j = 0; j<=detalles[i].valores.length-1; j++) {
          doc.text (detalles[i].valores[j].medio, 15, f );
          doc.text ('$'+this.formatoImporte(detalles[i].valores[j].total), 73, f, 'right'); f+=5;
        }
      }

      */
      doc.output ('dataurlnewwindow');
    },


    viajestock(viaje,dat,ctt) {
      var doc = new jsPDF('l', 'pt')  // 'p' normal 'l' horizontal ( landscape )
      doc.setFontSize(20);
      doc.text ( 'Planilla de Stock Pedidos', 15, 30 )
      doc.line( 15, 35, 240, 35);
      doc.setFontSize(8);
      doc.text ( 'gohu', 495 , 10 )
      let f = 50
      let t = 0
      doc.setFont(undefined,"normal");
      doc.setFontSize(10);
      doc.text ( 'Viaje: '+viaje.id, 15, f ); f += 15;
      doc.text ( 'Zona: '+viaje.zona.nombre, 15, f ); f += 15;
      doc.text ( 'Fecha: '+moment(viaje.fecha).format('LLLL'), 15, f ); f += 20;
      doc.setFontSize(10);

//      doc.text ( 'Cliente', 15, f );
//      doc.line( 15, f+8, 820,  f+8);
//      f += 25

//      doc.text ( 'Pedido                                             Factura/s                                           Ndds/Ndcs                                            Recibos                                        Maletín', 45, f );
//      doc.line( 45, f+8, 820,  f+8);

      f = 93
      doc.setFontSize(9);
      f += 15
      doc.setFont(undefined,"bold");
      doc.setFontSize(10);
      doc.text ( 'STOCKS Y OFERTAS DISPONIBLES', 15, f );
      f += 20
      doc.text ( 'ID', 15, f );
      doc.text ( 'Código', 90, f );
      doc.text ( 'Descripción', 135, f );
      doc.text ( 'Stock', 592, f );
      doc.text ( 'Ofertas', 685, f );
      doc.text ( 'Pedidos', 780, f );
      doc.line( 15, f+8, 820,  f+8);     // linea vertical 1
      f += 20
      doc.setFont(undefined,"normal");
      doc.setFontSize(9);
      for (let i = 0; i<=ctt.length-1; i++) {
        doc.text (ctt[i].articulo_id.toString(), 15, f );
        doc.text (ctt[i].codigo, 88, f );
        doc.text (ctt[i].nombre, 135, f );
        doc.text (this.formatoImporte(ctt[i].stk), 620, f, 'right');
        doc.text (this.formatoImporte(ctt[i].ofe), 720, f, 'right');
        doc.text (this.formatoImporte(ctt[i].ctt), 820, f, 'right');
        f += 15;
      }
      doc.line( 15, f-5, 820,  f-5);     // linea vertical 1
      f += 8;
      doc.setFont(undefined,"normal");
      doc.output ('dataurlnewwindow');
    },


    planillaDeRecaudacion(item,tipo) {
      var doc = new jsPDF('l')  // 'p' normal 'l' horizontal ( landscape )

      if (tipo=='M') {

        // PLANILLA DE UN MALETIN
        doc.setFontSize(20);
        doc.text ( 'Detalle de Maletín', 10, 20 )
        doc.line( 10, 22, 67, 22);
        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        let t = 0
        let h = 190

        doc.setFont(undefined,"normal");
        doc.setFontSize(10);
        doc.text ( 'Número: '+item.id, 10, f ); f += 5;
        doc.text ( 'Equipo: '+item.cobrador.username, 10, f ); f += 5;
        //doc.text ( 'Zona: '+viaje.zona.nombre, 10, f ); f += 5;
        doc.text ( 'Fecha: '+moment(item.fecha).format('LLLL'), 10, f ); f += 8;
        doc.setFontSize(10);
        doc.text ( 'Cliente                                                              Sucursal        Recibo                  Medio  Detalles                                                                                                                  Importe', 10, f );
        doc.line( 10, f+2, 280, f+2);     // linea vertical 1
        f = 55
        let valores = []
        doc.setFontSize(9);

        debugger
        for (let i = 0; i<=item.clientes.length-1; i++) {
          doc.text ( item.clientes[i].cliente.nombre, 10, f )
          doc.text ( item.clientes[i].sucursal.id.toString(), 82, f )
          
          if (item.clientes[i].valor!=null) {
            doc.text ( this.kit.cpr(item.clientes[i].valor.ingresados.cpr), 103, f )
            doc.setFontSize(7);
            doc.text ( item.clientes[i].valor.observ, 144, f )
            doc.setFontSize(9);
            doc.text ('$'+this.formatMoney(item.clientes[i].valor.importe), 280, f, 'right')
          } else {
            doc.text ( 'PENDIENTE', 103, f )
            doc.text ( item.clientes[i].medio.nombre+' '+item.clientes[i].observ, 144, f )
            doc.text ('$'+this.formatMoney(item.clientes[i].importe), 280, f, 'right')
          }
          doc.text ( item.clientes[i].medio.abrev, 132, f )
          let pos = valores.findIndex(x=>x.id == item.clientes[i].medio.id)
          let importe = item.clientes[i].valor!=null?item.clientes[i].valor.importe:item.clientes[i].importe
          if (pos==-1) {
            valores.push({
              id: item.clientes[i].medio.id,
              fp: item.clientes[i].medio.abrev,
              total: importe
            })
          } else {
            valores[pos].total += importe
          }
          t += importe
          f = this.cp(f, 5, 10, h, doc)
        }
        doc.setFontSize(10);
        doc.line( 10, f-2, 280, f-2);
        doc.text ('$'+this.formatMoney(t), 280, f+2, 'right');

        f = this.cp(f, 15, 10, h, doc)

        doc.setFontSize(10);
        doc.text ( 'Tipo de Valor                                                              Total', 10, f );
        doc.line( 10, f+2, 100, f+2);     // linea vertical 1
        doc.setFontSize(9);

        f = this.cp(f, 7, 10, h, doc)

        for (let i = 0; i<=valores.length-1; i++) {
          doc.text ( valores[i].fp, 10, f )
          doc.text ('$'+this.formatMoney(valores[i].total), 100, f, 'right')
          f = this.cp(f, 5, 10, h, doc)          
        }
        doc.setFontSize(10);
        doc.line( 10, f-2, 100, f-2);

        f = this.cp(f, 10, 10, h, doc)
        
      } else if (tipo=='P') {

        // PLANILLA DE UN PERIODO
        doc.setFontSize(20);

        let periodo = item[0].fecha.substring(6,7)+'-'+item[0].fecha.substring(0,4)
        doc.text ( 'Detalle de Maletines correspondientes a '+periodo, 10, 20 )
        doc.line( 10, 22, 165, 22);
        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )
        let f = 0
        let t = 0
        let h = 190
        doc.setFont(undefined,"normal");
        f = 30
        let equipo = []
        let valores = []

        for (let i=0; i<=item.length-1; i++) {

          doc.setFontSize(10);
          doc.text ( 'Maletin   Fecha          Cobrador                                                  Total', 10, f );
          f = this.cp(f, 2, 30, h, doc)
          doc.line( 10, f, 116, f);     // linea vertical 1

          f = this.cp(f, 5, 30, h, doc)
          doc.setFontSize(9);
          doc.text ( item[i].id.toString(), 18, f )
          doc.text ( moment(item[i].fecha).format('DD-MM-YYYY'), 24, f )
          doc.text (item[i].cobrador.username, 44, f, 'left')
          doc.text ('$'+this.formatMoney(item[i].importe), 115, f, 'right')

          f = this.cp(f, 10, 30, h, doc)
          doc.setFontSize(10);
          doc.text ( 'Cliente                                                              Sucursal        Recibo                  Medio  Detalles                                                                                                                  Importe', 10, f );
          f = this.cp(f, 2, 30, h, doc)
          doc.line( 10, f, 280, f);     // linea vertical 1
          f = this.cp(f, 5, 30, h, doc)
          doc.setFontSize(9);

          for (let j=0; j<=item[i].clientes.length-1; j++) {

            doc.text ( item[i].clientes[j].cliente.nombre, 10, f )
            doc.text ( item[i].clientes[j].sucursal.id.toString(), 82, f )
            
            if (item[i].clientes[j].valor!=null) {
              doc.text ( this.kit.cpr(item[i].clientes[j].valor.ingresados.cpr), 103, f )
              doc.setFontSize(7);
              doc.text ( item[i].clientes[j].valor.observ, 144, f )
              doc.setFontSize(9);
              doc.text ('$'+this.formatMoney(item[i].clientes[j].valor.importe), 280, f, 'right')
            } else {
              doc.text ( 'PENDIENTE', 103, f )
              doc.text ('$'+this.formatMoney(item[i].clientes[j].importe), 280, f, 'right')
            }
            doc.text ( item[i].clientes[j].medio.abrev, 132, f )

            let pos = valores.findIndex(x=>x.id == item[i].clientes[j].medio.id)
            let importe = item[i].clientes[j].valor!=null?item[i].clientes[j].valor.importe:item[i].clientes[j].importe
            if (pos==-1) {
              valores.push({
                id: item[i].clientes[j].medio.id,
                fp: item[i].clientes[j].medio.abrev,
                total: importe
              })
            } else {
              valores[pos].total += importe
            }

            pos = equipo.findIndex(x=>x.id == item[i].cobrador.id)
            if (pos==-1) {
              equipo.push({
                id: item[i].cobrador.id,
                nombre: item[i].cobrador.username,
                total: importe
              })
            } else {
              equipo[pos].total += importe
            }

            t += importe
            f = this.cp(f, 5, 10, h, doc)
          }

          f = this.cp(f, 10, 10, h, doc)

        }

        doc.setFontSize(10);
        doc.line( 10, f-2, 280, f-2);
        doc.text ('TOTAL', 230, f+2, 'left');
        doc.text ('$'+this.formatMoney(t), 280, f+2, 'right'); f+=5;

        f = this.cp(f, 10, 10, h, doc)

        doc.setFontSize(10);
        doc.text ( 'Tipo de Valor                                                              Total', 10, f );
        doc.line( 10, f+2, 100, f+2);     // linea vertical 1
        doc.setFontSize(9);
        f += 7
        for (let i = 0; i<=valores.length-1; i++) {
          doc.text ( valores[i].fp, 10, f )
          doc.text ('$'+this.formatMoney(valores[i].total), 100, f, 'right')
          f = this.cp(f, 5, 10, h, doc)
        }

        f = this.cp(f, 10, 30, h, doc)

        doc.setFontSize(10);
        doc.text ( 'Equipo                                                                        Total', 10, f );
        doc.line( 10, f+2, 100, f+2);     // linea vertical 1
        doc.setFontSize(9);
        f += 7
        for (let i = 0; i<=equipo.length-1; i++) {
          doc.text ( equipo[i].nombre, 10, f )
          doc.text ('$'+this.formatMoney(equipo[i].total), 100, f, 'right')
          f = this.cp(f, 5, 10, h, doc)
        }

        doc.setFontSize(10);
        doc.line( 10, f-2, 100, f-2);
        f = this.cp(f, 10, 10, h, doc)

      }
      doc.output ('dataurlnewwindow');
    },

    cp(f, s, i, t, d) {
      if (f>t) {
        d.addPage()
        f = i
        return f
      }
      f += s
      return f
    },
    
  }

};
</script>
