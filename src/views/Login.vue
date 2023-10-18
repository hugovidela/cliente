<template>
  <v-container>
    <v-layout wrap>
      <v-flex sm12 md6 offset-md3>
        <v-card elevation="4" light tag="section" tile class="fg">
          <v-card-title>
            <v-layout align-center justify-space-between>
              <v-flex>
                <v-img height="50" width="70" src="/images/logoGoHu.jpg">
                </v-img>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <p class="fg">Ingrese su usuario y contraseña</p>
            <v-form>
              <v-text-field
                outline
                autofocus
                label="correo electrónico"
                type="text"
                :value="loginEmail"
                @input="setLoginEmail">
              </v-text-field>
              <v-text-field
                outline
                hide-details
                :value="loginPassword"
                @input="setLoginPassword"
                label="Contraseña"
                type="password">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-alert type="error" :value="loginError">
            {{loginError}}
          </v-alert>
          <v-divider></v-divider>
          <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
            <v-btn @click="login" color="info" dark large class="ml-0 mb-0 text-none">
              <v-icon class="mr-2">fingerprint</v-icon>
              Ingresar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('authentication', ['loginEmail', 'loginPassword', 'loginUserId', 'loginError'],
      [
        'sucursal',
        'sucursales',
        'sucursalFiscal',
        'notificaciones',
        'caja',
        'temas',
        'empresa',
        'tercero',
        'operario',
        'level',
      ]),
  },
  methods: {
    ...mapMutations('authentication', [
      'setLoginEmail',
      'setLoginPassword',
      'setLoginUserId'],
      [
        'setSucursal',
        'setSucursales',
        'setNotificaciones',
        'setCaja',
        'setTemas',
        'setEmpresa',
        'setTercero',
        'setOperario',
        'setLevel',
      ]),
    ...mapActions('authentication', [
      'login',
    ]),
  },
};
</script>

<style scoped>
  .fg {
    font-family: Monserrat, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .fg1 {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
</style>
