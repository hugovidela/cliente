<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex>
        <v-img
          height="100"
          width="200"
          src="/images/logoGoHu.jpg">
        </v-img>
        <v-row>
          <v-col cols="4" sm="4" md="4">
            <v-card class="fg">
              <v-card-title>
                <b>Registro</b>
              </v-card-title>
              <v-card-text class="pl-4 pt-4 pb-4"
                :color="$store.state.temas.notif_cprs_btn_bg"
                :dark="$store.state.temas.notif_cprs_btn_dark==true">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-select
                        :value="registerTipo"
                        @input="setRegisterTipo"
                        :items="tipoUsuarioItems"
                        autofocus label="Tipo de Licencia">
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-text-field
                        label="Nombre de Usuario"
                        :rules="usernameRules"
                        :value="registerUsername"
                        @input="setRegisterUsername"
                        clearable counter maxlength="40" required>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-text-field
                        ref="mailreg"
                        label="E-mail"
                        :rules="emailRules"
                        :value="registerEmail"
                        @input="setRegisterEmail"
                        required counter
                        @change="revisoSiEstaElMail(1)">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-text-field
                        :append-icon="show ? 'visibility' : 'visibility_off'"
                        :rules="[passRules.required, passRules.min]"
                        :type="show ? 'text' : 'password'"
                        label="Password"
                        hint="Hasta 15 caracteres"
                        counter required
                        @click:append="show = !show"
                        :value="registerPassword"
                        @input="setRegisterPassword">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-text-field
                        ref="mailrecomendo"
                        label="¿Quien te recomendo?, ingresa su email"
                        :rules="emailRecomendo"
                        :value="registerEmailRecomendo"
                        @input="setRegisterEmailRecomendo"
                        @change="revisoSiEstaElMail(2)"
                        @blur="revisoSiEstaElMail(2)">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-6 pb-0">
<!--
                      <v-btn
                        v-show="validado()"
                        :color="$store.state.temas.forms_titulo_bg"
                        :dark="$store.state.temas.forms_titulo_dark==true"
                        @click="register"
                        :disabled="!valid">
                        <v-icon class="mr-2">account_circle</v-icon>
                        Registrarse
                      </v-btn>
-->
                      <v-btn class="text-capitalize"
                        v-show="validado()"
                        :color="$store.state.temas.forms_titulo_bg"
                        :dark="$store.state.temas.forms_titulo_dark==true"
                        @click="registrar">
                        <v-icon class="mr-2">account_circle</v-icon>
                        Registrarse
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0">
                      <v-alert type="error" :value="registerError"
                        v-show="registerError">
                        {{registerError}}
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="8" sm="8" md="8" class="fg pt-0">
            <v-row v-if="registerTipo=='ERP Completo'||registerTipo=='ERP Medio'
              ||registerTipo=='ERP Básico'">
              <v-col cols="12" sm="12" md="12">
                <b>gohu ERP</b> es un completo Sistema de Administración Comercial.<br><br>
                Pusimos especial énfasis en la sencilléz, y que al mismo
                tiempo abarcara todas las necesidades de un negocio <i>tipo</i>.<br>
                Los módulos que se incluyen en el sistema son:
                Compras, Ventas, Stock's, Ctas.Ctes, Bancos, Testoreria e Impuestos.<br><br>
                El sistema se integra con AFIP, permitiendo realizar comprobantes
                electrónicos y también obtener datos del padrón del organismo al
                momento de cargar Clientes, Proveedores, Transportistas, etc.

                <br><br>
                La licencia <b>gohu ERP</b> se divide en tres,
                <i><b>Completa</b></i>,
                <i><b>Medio</b></i>
                y <i><b>Básica</b></i><br>
                El motivo por el cual implementamos esta restricción es porque los costos de
                internet se miden por volúmen y tráfico de información que el usuario genera.<br>
                Revisa cuantas operaciones generas por mes para saber cual de las dos versiones
                se adecúa mas a tus necesidades.<br><br>
                <b>IMPORTANTE</b>
                Aclaramos que la funcionalidad de la aplicación en las tres versiones es exactamente
                la misma, solo se aplica una traba en el volumen para poder solventar los costos de
                nuestro proveedor de Hosting.
                <br><br>
                <b>Detalle de las licencias</b><br><br>
                <i><b>Completa</b></i> Sin límites en el volúmen de información.<br><br>
                <i><b>Media</b></i> Permite administrar hasta 1000 artículos propios y realizar
                hasta 400 operaciones por mes, esto incluye a Facturas, Notas de Débito,
                Notas de Crédito, Recibos, Pagos, Remitos, Presupuestos y Pedidos.<br><br>
                <i><b>Básica</b></i> Permite administrar hasta 500 artículos propios y realizar
                hasta 200 operaciones por mes, esto incluye a Facturas, Notas de Débito,
                Notas de Crédito, Recibos, Pagos, Remitos, Presupuestos y Pedidos.<br><br>

                <b>VINCULATE</b><br>
                La principal característica de gohu es que <b>¡los usuarios se pueden vincular!</b>.
                <br>
                <b>¿Que es vincularse en gohu?</b>
                Vincularse es generar una <i>conexión</i> con tus Clientes y Proveedores favoritos.
                <br>
                Podrás brindarles todos tus Artículos, Precios y Promociones
                a tus Clientes y también, leer todos los Artículos, Precios y Promociones de tus
                Proveedores.
                <br>
                Es decir que, <b>todas las modificaciones que un usuario realice en sus
                artículos se reflejarán automaticamente en todos sus usuarios vinculados.</b>
                <br>
                En cuanto a las Operaciones, Pedidos, Facturas, NDD's, NDC's,
                Pagos, etc entre usuarios vinculados van por dentro del sistema.
                Esto permite ahorrar mucho tiempo y evitar errores, <b>los comprobantes son
                transferidos de un usuario a otro quedando estos espejados</b>.<br><br>

                <span><b>Costos de licencias:</b></span><br>
                <table class="fg85">
                  <tr>
                    <td>Licencia <b>ERP Completo</b></td><td></td>
                    <td class="text-lg-right">
                      ${{ formatoImporte(preciosLicencias[1].precio)}}/mes +IVA
                    </td>
                  </tr>
                  <tr>
                    <td>Licencia <b>ERP Medio</b></td><td></td>
                    <td class="text-lg-right">
                      ${{ formatoImporte(preciosLicencias[2].precio)}}/mes +IVA
                    </td>
                  </tr>
                  <tr>
                    <td>Licencia <b>ERP Básico</b></td><td></td>
                    <td class="text-lg-right">
                      ${{ formatoImporte(preciosLicencias[3].precio)}}/mes +IVA
                    </td>
                  </tr>
                </table>
                <p></p>
                <!-- <p class="fg"><b>IMPORTANTE</b><br>
                Estos precios no incluyen IVA y se actualizan mensualmente por el índice de
                inflación que informa el gobierno.</p><br> -->
              </v-col>
            </v-row>
            <v-row v-else-if="registerTipo=='Profesionales'">
              <v-col cols="12" sm="12" md="12">
                <b>gohu</b> Profesionales.<br><br>
                Para todos aquellos profesionales que necesitan cumplir con las obligaciones
                fiscales.<br>
                Podrás cargar todos los servicios que prestas, cargar tus proveedores y emitir
                los comprobantes que necesites.
                <br><br>
                <span><b>Costo de esta Licencia</b></span><br>
                <table class="fg85">
                  <tr>
                    <td>Licencia <b>Precios y Pedidos</b></td><td></td>
                    <td class="text-lg-right">
                      ${{ formatoImporte(preciosLicencias[0].precio)}}/mes +IVA
                    </td>
                  </tr>
                </table>
                <br><br>

                <p></p>
                <!-- <p class="fg85">Estos precios se actualizan mensualmente por el indice de
                  inflación que informa el gobierno y no incluyen IVA.
                </p> -->
                <br>
              </v-col>
            </v-row>
            <v-row v-else-if="registerTipo=='Precios y Pedidos'">
              <v-col cols="12" sm="12" md="12">
                <b>gohu</b> Precios y Pedidos.<br><br>
                Podrás acceder a los artículos, precios y promociones de tus proveedores
                y también exponer los tuyos, para que tus clientes estén al tanto en todo momento.
                <br>
                Todos estos datos se actualizan en tiempo real, lo que te va a dar la tranquilidad
                de que los precios siempre son los actuales.
                También podrás recibir y emitir pedidos de tus Clientes y Proveedores
                respectivamente.
                <br><br>

                <span><b>Costo de esta Licencia</b></span><br>
                <table class="fg85">
                  <tr>
                    <td>Licencia <b>Precios y Pedidos</b></td><td></td>
                    <td class="text-lg-right">
                      ${{ formatoImporte(preciosLicencias[4].precio)}}/mes +IVA
                    </td>
                  </tr>
                </table>

                <br><b>gohu</b> Precios y Pedidos (Exclusivos).<br>
                Podrás ser cliente exclusivo de tu proveedor preferido.
                Revisa la Ayuda en el apartado <i>Licencias</i> y lee sobre
                las licencias tipo <b>PPx</b> para obtener mas información.
                <br>
                ¡Estas licencias no tienen costo!.
                <br><br>

                <p></p>
                <!-- <p class="fg85">Estos precios se actualizan mensualmente por el indice de
                  inflación que informa el gobierno y no incluyen IVA.
                </p> -->
                <br>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12" sm="12" md="12">
                <b>Tienda gohu</b><br><br>
                Podrás acceder a los <b>3.218.253</b> artículos publicados corespondientes a
                <b>512</b> empresas que estan utilizando <b>gohu</b> actualmente.<br>
                Esta licencia no tiene costo y no te cobramos comisiones por comprar ni por vender.
                <br>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-flex>
      <SBar></SBar>
      <Confirmacion v-model='msg.msgAccion'
        :title=this.msg.msgTitle
        :body=this.msg.msgBody
        :visible=this.msg.msgVisible
        :buttons=this.msg.msgButtons
        @click="msgRespuesta">
      </Confirmacion>
    </v-layout>
  </v-container>

</template>

<script>
/* eslint-disable */
import HTTP from '../http';
import { mapState, mapMutations, mapActions } from 'vuex';
import router from '../router';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue";

export default {
  components: {
    SBar,
    Confirmacion,
  },
  /* eslint-disable */
  data: () => ({
    preciosLicencias: [],
    valid: true,
    show: false,
    tipoUsuario: '',
    tipoUsuarioItems: ['ERP Completo','ERP Medio','ERP Básico','Precios y Pedidos', 'Profesionales', 'Tienda'],
    itemsResponsables: [],
    itemsDocumentos: [],
    documento_id: '',
    documentoNumero: '',
    responsable_id: '',
    nombreEmpresa: '',
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    elMailExiste: false,
    elRecomendoExiste: true,
    usernameRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 40) || 'Hasta 40 caraceres',
    ],
    passRules: {
      required: value => !!value || 'Requerido',
      min: v => v.length >= 3 || 'Míninmo 3 caracters',
    },
    emailRules: [
      v => !!v || 'E-mail es requerido',
      v => /.+@.+\..+/.test(v) || 'E-mail debe ser válido',
    ],
    emailRecomendo: [
      v => /.+@.+\..+/.test(v) || 'El E-mail del recomendado puede ir vacío',
    ],
  }),

  computed: {
    ...mapState('authentication', [
      'registerUsername',
      'registerEmail',
      'registerEmailRecomendo',
      'registerPassword',
      'registerTipo',
      'registerUserId',
      'registerError',
    ],['temas','dolar']),
  },

  mounted() {
    this.preciosLicencias = [{precio: 0},{precio: 0},{precio: 0},{precio: 0},{precio: 0}]
    return HTTP().get('/precioslicencias').then(({ data }) => {
      for (let i=0; i<=data.length-1; i++) {
        this.preciosLicencias[i].precio = data[i].usd*data[i].cotDolar
      }
    })
  },

  methods: {
    ...mapMutations('authentication', [
      'setRegisterUsername',
      'setRegisterEmail',
      'setRegisterEmailRecomendo',
      'setRegisterPassword',
      'setRegisterTipo',
      'setRegisterUserId',
    ]),
    ...mapActions('authentication', [
      'register',
    ]),

    registrar() {
      this.register()
      if (this.$store.state.authentication.registerError==null) {
        this.msg.msgTitle = '¡El registro ha sido exitoso!'
        this.msg.msgBody = 'Vuelve a ingresar para completar tus datos!<br>'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'registro Ok'
        this.msg.msgButtons = ['Aceptar']
      }
    },

    validado() {
      let a1 = this.elRecomendoExiste
      let a2 = this.$store.state.authentication.registerUsername
      let a3 = this.$store.state.authentication.registerEmail
      let a4 = this.$store.state.authentication.registerPassword
      let a5 = this.$store.state.authentication.registerTipo
      let a6 = this.$store.state.authentication.registerEmailRecomendo
      let a7 = this.elMailExiste

      /*
      if (this.$store.state.authentication.registerUsername!=null) {
        if (this.$store.state.authentication.registerEmail!=null) {
          if (this.$store.state.authentication.registerPassword!=null) {
            if (this.$store.state.authentication.registerTipo!=null) {
              if (!this.elMailExiste) {
                if (this.$store.state.authentication.registerEmailRecomendo!='') {
                  if (this.elRecomendoExiste) {
                    return true
                  } else {
                    return false
                  }
                }
              }
            }
          }
        }
      }
      */
      
      if (this.$store.state.authentication.registerUsername!=null &&
          this.$store.state.authentication.registerEmail!=null &&
          this.$store.state.authentication.registerPassword!=null && 
          this.$store.state.authentication.registerTipo!=null &&
          !this.elMailExiste&&
          (this.$store.state.authentication.registerEmailRecomendo!=''&&this.elRecomendoExiste))
        { return true } 
      else 
        { return false }

    },

    revisoSiEstaElMail(cual) {
      let aBuscar = cual==1 ? this.$store.state.authentication.registerEmail : this.$store.state.authentication.registerEmailRecomendo
      this.elMailExiste = false
      this.elRecomendoExiste = true
      return HTTP().post('/existeelmail', {mail:aBuscar, donde:'users'}).then(({ data }) => {
        if (data && cual==1) {
          //this.msg.msgTitle = 'Existe el Mail'
          //this.msg.msgBody = 'El mail ingresado ya existe en gohu!<br>'
          //this.msg.msgVisible = true
          //this.msg.msgAccion = 'existe el mail'
          //this.msg.msgButtons = ['Aceptar']
          this.mensaje('¡Este mail ya existe en gohu!', 'red', 2500)
          this.elMailExiste = true
          this.$refs.mailreg.focus()
        } else if ( !data && cual==2 && this.$store.state.authentication.registerEmailRecomendo) {
          //this.msg.msgTitle = 'No existe el Mail'
          //this.msg.msgBody = 'El mail ingresado no existe en gohu!<br>'
          //this.msg.msgVisible = true
          //this.msg.msgAccion = 'no existe el mail'
          //this.msg.msgButtons = ['Aceptar']
          this.elRecomendoExiste = false
          this.mensaje('¡Este mail no existe en gohu!', 'red', 2500)
          this.$refs.mailrecomendo.focus()
        }
      })
      .catch(err => {
        console.log(err)
      })
    },

    msgRespuesta(op) {
      this.msg.msgVisible = false;
      router.push('/Login');
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

  }

};

</script>

<style scoped>
  .fg {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg85 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
</style>