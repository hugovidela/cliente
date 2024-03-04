<template>
  <v-layout align-start>
    <v-flex>
      <v-btn
        icon @click="closeForm">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
      <v-row class="fg pb-3">
        <v-col cols="12" sm="2">
          <template>
            <v-treeview
              return-object
              item-key="id"
              hoverable activatable dense
              :color="temas.forms_titulo_bg"
              :item-color="temas.forms_titulo_bg"
              :items="items">
              <template slot="label" slot-scope="{ item }">
                <span @click="openDialog(item)"
                  color="red">
                  {{ item.name }}
                </span>
              </template>
            </v-treeview>
          </template>
        </v-col>
        <v-col cols="10" class="fg">

          <div v-if="idSel==1"><b><h2>ASPECTOS GENERALES</h2></b><br><br>
            <b>gohu</b> es un sistema de Administración Comercial o también llamado <i>ERP</i>
            , que corre en WEB.<br>
            Es decir que para poder ser utilizado es necesaria una computadora una tablet o un
            celular conectados a internet y que tengan un navegador web instalado<br><br>
            El sistema permite realizar todas las operaciones que una pyme requiere para lograr
            una óptima administración y operación.<br>
            Los módulos disponibles son:<br>
            <li>Ventas</li>
            <li>Compras</li>
            <li>Stocks</li>
            <li>Clientes, Proveedores, Cuentas Corrientes</li>
            <li>Tesoreria</li>
            <li>Bancos</li>
            <li>Impuestos</li><br>

            Pusimos énfasis en intentar lograr un sistema que sea ágil, fiable y fácil de
            utilizar.<br>
            <b>gohu</b> es simple, intentamos construir un sistema que no requiera demasiada
            curva de aprendizaje y que cualquier persona lo pueda utilizar sin problemas,<br>
            pero que al mismo tiempo cubra las alternativas más importantes con las que tenga
            que lidiar una empresa.<br><br>
            <b>gohu</b> tiene un fuerte enfoque en el <i>e-commerce</i>, donde cualquier
            persona puede realizar compras sobre tus artículos publicados.<br>
            EL sistema está integrado con AFIP, lo que permite realizar comprobantes electrónicos
            e importar datos de contribuyentes desde ese organismo al momento de cargar
            Clientes, Proveedores, etc.
            <br><br>
            <b>NUESTRA POLITICA SOBRE EL USO DE gohu</b>.<br>
            Afrontamos importantes costos de nuestros proveedores de Hosting, no
            obstante, nos volcamos por la opción de licencias económicas.<br>
            El objetivo es llegar a la mayor cantidad de usuarios posibles, porque justamente
            este es el aspecto más importante en <b>gohu</b>,<br>maximizar la cantidad de usuarios
            para aprovechar nuestro diseño de <i><b>vinculaciones</b></i>. (ver Vinculaciones)
            <br><br>
            <b>RECOMIENDA gohu A TUS CONTACTOS COMERCIALES Y SE PARTE DE NUESTRO ECOSISTEMA</b><br>
            Por cada usuario que se registre en el sistema y especifique tu casilla de correo en
            <i>¿Quién te recomendo? </i>, se te aplicará un descuento en tu cuota mensual
            correspondiente al 10% del costo de la licencia del nuevo usuario.<br>
            Es decir, que si recomiendas a 10 usuarios con el mismo tipo de licencia
            que utilizas, no solo tu costo mensual será cero, sino que si superas ese
            cantidad te depositaremos el 10% por cada usuario excedente.<br><br>

            Esta politica no solo apunta a que <b>gohu</b> sea masivo, sino que también busca
            que sus usuarios se sientan parte de nuestro ecosistema.
            <br><br>
            <b>gohu</b> está en constante desarrollo, arreglos e innovaciones.<br>
            Tomamos notas de las sugerencias de nuestros usuarios para intentar
            mejorarlo día a día.<br><br>
            Usamos <b>Amazon Cloud</b>.<br>

            Toda la información generada por los usuarios esta almacenada en servidores de
            Amazon, de las más o la más importante a nivel mundial.<br>
            Ellos nos dan la seguridad y la tranquilidad de saber que los datos jamás se van a
            perder, por los standares que siguen y por la seriedad con la que trabajan.<br>

          </div>
          <div v-else-if="idSel==2"><b><h2>LICENCIAS</h2></b><br><br>
            Hay dos formas de usar <b>gohu</b><br><br>
            <li>Modo ERP</li>

            ERP (<i>Planificacion de Recursos Empresariales</i>), es lo que se denomina
            comunmente a aquellos sistemas destinados a la Gestión Comercial.<br>
            Este modo se divide as su vez en cuatro, esto para poder adecuarse a cuanta información
            necesitas gestionar por mes.<br><br>

            <li>Modo PP</li>
            Este modo te habilita consultar precios y realizar pedidos.<br>
            A su vez se divide en dos, <i>exlusivos <b>PPx</b></i> y
            <i>no exclusivos <b>PP</b></i>.
            <br><br>

            <b>Detalles de Licencias</b><br>
            <v-simple-table dense style="width:85%">
              <template v-slot:default>
                <thead class="fg">
                  <tr class="fg">
                    <th style="width:15px" class="text-left">Licencia</th>
                    <th style="width:25px" class="text-left">Observaciones</th>
                    <th style="width:15px" class="text-end">Operaciones/u12m</th>
                    <th style="width:15px" class="text-end">Artículos</th>
                    <th style="width:15px" class="text-end">Fotos por Artículo</th>
                    <th style="width:15px" class="text-end">Vinculaciones</th>
                    <th style="width:15px" class="text-end">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in licencias" :key="item.id">
                      <td style="width:15px">{{ item.id }}</td>
                      <td style="width:25px">{{ item.obsv }}</td>
                      <td style="text-align:right; width:15px">
                        {{ item.oper }}
                      </td>
                      <td style="text-align:right; width:15px">
                        {{ item.arts }}
                      </td>
                      <td style="text-align:right; width:15px">
                        {{ item.fotos }}
                      </td>
                      <td style="text-align:right; width:15px">
                        {{ item.vin }}
                      </td>
                      <td style="text-align:right; width:15px">
                        ${{ formatoImporte(item.precio) }}
                      </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <br><br>

            <li><b>gohu Profesionales (PR)</b></li>
            Pensada para todos aquellos profesionales que necesitan realizar comprobantes
            por sus servicios.<br>
            Estas cuentas no se podrán vincular y se les presentará una versión
            reducida del ERP.<br>
            Podrán cargar sus servicios, sus proveedores, emitir los comprobantes correspondientes
            y llevar una administración de los mismos.
            <br><br>

            <li><b>gohu ERP Completo (CO)</b><br>
            Esta licencia permite utilizar el sistema en forma completa y sin limites en cuanto a la
            cantidad de operaciones y vinculaciones.</li>
            Los módulos que contiene son Ventas, Compras, Cuentas Corrientes, Stocks, Tesorería
            , Bancos e Impuestos.<br><br>

            <li><b>gohu ERP Medio (ME)</b></li>
            Igual a la anterior pero con la restricción especificadas en la tabla.<br><br>

            <li><b>gohu ERP Básico (BA)</b></li>
            Igual a la anterior pero con la restricción especificadas en la tabla.<br><br>

            El motivo por el cual implementamos estas restricciónes son los costos de
            internet que se miden por volúmen y tráfico de información.<br>
            Revisa cuantas operaciones generas por mes para saber cual de las versiones
            se adecúa más a tus necesidades.<br><br>
            <li><b>gohu Precios y Pedidos (PP)</b></li>
            En esta versión podrás realizar todas las tareas referentes a Precios y Pedidos.<br>
            Podrás vincularte con otros usuarios y exponer tus Artículos y Precios a tus Clientes
            , como también leer los de tus Proveedores.<br>
            También podrás emitir y recibir Pedidos.<br>
            <br>
            <li><b>gohu Precios y Pedidos *Exclusivo (PPx)</b></li>
            Los usuarios con licencias <b>ERP</b> podrán generar cuentas
            <i>gratuitas</i> para sus Clientes.<br>
            Una de las restricciones para estas licencias es que<i> solo podrán ser Clientes del
            usuario que las generó</i>, <br>
            es decir, serán <i>Clientes Exclusivos</i> del usuario que los creó y
            <i>no se podrán vincular con otros usuarios.</i><br>
            Esto rompe con el objetivo esencial de <b>gohu</b>, que es que los usuarios
            se puedan vincular entre sí y así obtener el beneficio de las vinculaciones.<br>
            Entendimos que debíamos dar esta posibilidad para que los usuarios puedan armar
            su <i>Granja Comercial</i> y evitar que sus Clientes puedan vincularse con otros
            usuarios y posibles competidores. No obstante, sabemos que la competencia siempre
            es buena, compitiendo es cuando una empresa mas crece, optimizando procesos y
            brindando mejor atención.<br>
            <i>Estas cuentas serán totalmente independientes al usuario que los creó y solo
            ellos tendrán la postestad de cambiar sus licencias cuando lo crean conveniente.</i><br>
            Y repetimos, las licencias exclusivas <b>PPx</b> no tienen costo.<br><br>

            <b>Importante</b>
            Nuestros costos se miden por el tráfico que genera <b>gohu</b> en los servidores.
            Por la cantidad de información que puedas generar y consultar en ellos.<br>
            Por ello es que decidimos particionar las licencias ERP.
            <br><br>

            <b>Cambiar de Licencia</b><br>
            Podrás cambiar de Licencia las veces que quieras.<br>
            Solo cabe detallar un aspecto:
            Si bajas de ERP tus artículos definidos permanecerán, pero no podrás agregar más
            si el tope esta excedido.<br>
            Otro aspecto es que aquellos usuarios que sean <b>PPx</b> y migren a otra licencia,
            no podrán volver a ser <b>PPx</b><br>
            <br>

            <b>Desactivar Licencia</b><br>
            Podrás desactivar tu licencia cuando lo creas necesario.<br>
            Toda la información que hayas generado quedará en <b>gohu</b> por el lapso
            de 1 año.<br>
            Luego de superado ese período será eliminada en forma definitiva de nuestros
            servidores.<br>
            No obstante, antes de realizar el borrado, realizaremos un backup de tu información
            y te los enviaremos dónde nos informes.<br>Nunca perderás tu valiosa información.
            <br>
          </div>
          <div v-else-if="idSel==3"><b><h2>VINCULACIONES</h2></b><br><br>
            La principal característica de <b>gohu</b> es que permite generar vínculos entre
            sus usuarios.<br><br>
            ¿Que significa esto?.
            <br>
            <b>La vinculación genera una conexión entre los usuarios del sistema
            permitiedo transferir datos y operaciones entre ellos.</b>
            <br>
            Esto permite sacar un enorme provecho en un montón de aspectos.<br>Veamos...<br><br>
            <li><b>Idea Original</b><br>
              Imaginamos a una empresa vendiendo con la tranquilidad de saber que todos los precios
              de sus proveedores están actualizados en tiempo real.<br>Sin tener que bajar listas de
              precios, sin realizar consultas por teléfono, sin hacer nada, solo saber que sus
              precios están siempre ahí, en un solo lugar y siempre actualizados.<br>
              También imaginamos a una empresa obteniendo en forma automática y por sistema una
              factura de compra, siempre tediosas de cargar, o un pago, y que todos los
              datos de su sistema se actualicen al momento de descargar el comprobante, al dar un
              click.<br>
              Incluso hay operaciones, como las NDC y NDD que cuando se emiten, imputan
              tanto en tu sistema como el en sistema del usuario vinculado, quedando los
              datos de estos comprobantes y todo lo que involucran espejados entre
              ambos usuarios.
              <br><br>
              Veamos un ejemplo típico:<br><br>
              <b>1)</b> Realizas un pedido a un Proveedor y se lo envías.<br>
              <b>2)</b> En ese momento se activa la campana de notificaciones en tu Proveedor
              informando que ha llegado un nuevo pedido.<br>
              <b>3)</b> El Proveedor lo baja, lo procesa y realiza la factura correspondiente.<br>
              <b>4)</b> Cuando esta Factura es emitida, el sistema activa tu campana de
              notificaciones avisando que ha llegado un nuevo comprobante.<br>
              <b>5)</b> Vas a notificaciones, la descargas, y en ese instante se actualiza toda
              la información que involucra a dicha factura, en este caso IVA, Stock y Cuentas
              Corrientes o Caja según corresponda.<br>
              <b>6)</b> Luego realizas el pago y pasa lo mismo, la operación
              es enviada a tu Proveedor, este es notificado y cuando lo descarga toda la
              información entre ambos sistemas queda espejada.
              <br><br>
              Todas las operaciones entre usuarios vinculados en <b>gohu</b> van por sistema,
              esto permite ahorrar mucho tiempo de carga, evitar errores y también dar la seguridad
              de lo que generó un usuario, lo tiene el otro, exactamente igual.<br><br>

              <b><i>Operaciones que se Vinculan</i></b><br><br>
              <v-simple-table dense style="width:85%">
                <template v-slot:default>
                  <thead class="fg">
                    <tr class="fg">
                      <th style="width:25px" class="text-left">Operación</th>
                      <th style="width:25px" class="text-left">Usuario Emisor</th>
                      <th style="width:25px" class="text-left">Usuario Receptor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="width:25px">Facturas de Venta</td>
                      <td style="width:25px">
                        El usuario vendedor emite una Factura de Venta, en ese momento una
                        notificación es enviada al usuario Cliente para que realice la
                        descarga.
                      </td>
                      <td style="width:25px">
                        El usuario cliente recibe la notificación, la descarga y
                        el comprobante es enviado a su módulo de Compras,
                        impactando en Cuentas Corrientes, Stock e IVA Compras.
                      </td>
                    </tr>
                    <tr>
                      <td style="width:25px">Notas de Crédito</td>
                      <td style="width:25px">
                        El usuario vendedor emite una NDC sobre una Factura,
                        en ese momento impacta en su sistema y en el sistema del
                        cliente, y una notificación es enviada al usuario Cliente
                        para avisar de este impacto.
                      </td>
                      <td style="width:25px">
                        El usuario cliente recibe la notificación avisando
                        que una NDC ya ha impactado en su sistema.
                      </td>
                    </tr>
                    <tr>
                      <td style="width:25px">Notas de Débito</td>
                      <td style="width:25px">
                        Lo mismo que en NDC's.
                      </td>
                      <td style="width:25px">
                        Lo mismo que en NDC's.
                      </td>
                    </tr>
                    <tr>
                      <td style="width:25px">Pedidos</td>
                      <td style="width:25px">
                        El cliente emite un Pedido al usuario Proveedor
                      </td>
                      <td style="width:25px">
                        El Proveedor recibe el Pedido, lo baja y quedando
                        el mismo disponible para ser Facturado.
                      </td>
                    </tr>
                    <tr>
                      <td style="width:25px">Pagos</td>
                      <td style="width:25px">
                        El cliente emite un Pago al usuario Proveedor.
                        En proceso se cancelan facturas adeudadas
                        y se incluyen valores para compensar las mismas.
                        En ese momento se envia una notificacion al Proveedor.
                      </td>
                      <td style="width:25px">
                        El Proveedor es notificado. Cuando descarga el pago
                        todos los datos involucrados en el mismo
                        son actualizados.
                      </td>
                    </tr>
                    <tr>
                      <td style="width:25px">Recibos</td>
                      <td style="width:25px">
                        Lo mismo que en Pagos.
                      </td>
                      <td style="width:25px">
                        Lo mismo que en Pagos.
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <br><br>

              <b><i>Anulación de Operaciones Vinculadas</i></b><br>
              Podrás anular un comprobante vinculado sin problemas.<br>
              La transferencia de comprobantes entre usuarios vinculados permite
              que datos del comprobante del usuario emisor sean transferidos al usuario receptor.
              <br>
              En el caso de Facturas, Notas de Débito y Notas de Crédito la transferencia
              es en espejo, es decir, exactamente igual. En el caso de Pagos cambia, un pago
              de un usuario es representado por un recibo en el otro usuario, no obstante sus
              valores sí se espejan.<br>
              Ahora, cuando alguno de estos usuarios anule un comprobante espejado
              el sistema enviará una notificación al otro usuario informando que determianda
              operación ha sido anulada. El usuario receptor deberá realizar las acciones
              que crea necesaria, seguramente anulará la operación espejo o generará otra
              para que los datos queden consolidados entre ambas cuentas.
              <br><br>

              <i>IMPORTANTE</i><br>
              <i>Cada usuario en el sistema solo podrá ver sus datos y sus operaciones.<br>
              Nunca podrá acceder a los datos de otros usuarios, por más que estén vinculados.<br>
              Lo que si tendrá un usuario, es la certeza de que todas las operaciones propias
              y que fueron transferidas, las tiene el otro usuario exactamente igual.</i><br>
              <br>
              Por ejemplo, los saldos de cuentas corrientes de un <b>Usuario Cliente</b>
              siempre serán los mismos que los de su <b>Usuario Proveedor</b>.<br>
            </li><br>
            <li>
              <b>Salvaguardado de Datos</b><br>
              Tus datos en el sistema están totalmente seguros y ocultos al resto de los usuarios.
              <br>
              Al vincularte, solo vas a compartir tus Artículos, Precios y Promociones con aquellos
              usuarios con los que decidas vincularte.<br>
              El resto de la información permanecerá totalmente oculta al resto de los usuarios
              del sistema y solo tú podrás verla y administrarla.<br>
            </li><br>
            <li><b>Validación de usuarios ERP</b><br>
              Somos totalmente concientes de lo importante y sensible que es la información
              que pertenece y genera una empresa.<br>Por ello realizamos una rigurosa verificación
              de usuarios al momento del registro en el sistema.<br>
              Validamos, bajo diferentes mecanismos, que todos los usuarios que se
              registran en el sistema sean reales.<br>Esto nos da la tranquilidad de que cuando
              te quieras vincular con un usuario, éste sea realmente una Empresa, como tú.<br>
              No obstante, al momento de enviar o aceptar una solicitud de vínculo, te recomendamos
              que realices una inspección sobre el usuario en cuestión, y si tienes dudas, que te
              contactes con nostros para aclarlas.<br>
              También puedes consultar en el panel de vinculaciones presionando el botón
              <v-icon>mdi-information-outline</v-icon> sobre el usuario correspondiente.<br>
              Ahí podrás ver mas información al respecto.
            </li><br>
            <li><b>¿Quien se puede vincular con quien?</b><br>
              Cualquier usuario se puede vincular con cualquier otro usuario.<br>
              No obstante, existen reglas que buscan guardar algunos intereses obvios.
              <br>
              Veamos<br>
              <b>1)</b> No te podrás vincular con un Proveedor que está vinculado como Proveedor
              de un Proveedor tuyo.<br>
              <b>2)</b> Tampoco te podrás vicular con un Cliente que está vinculado como Cliente
              de un Cliente tuyo.<br>
              <b>El sistema filtra estos casos, por lo tanto no te aparecerán como posibles
                vinculaciones.</b>
            </li><br>
            <li><b>¿Como se realizan las vinculaciones?</b><br>
              El proceso de vinculación es muy simple.<br>
              Ingresas al módulo de vinculaciones, icono <v-icon>mdi-share-variant</v-icon> ubicado
              en la barra principal del sistema, buscas al usuario, si esta en <i>Descartados</i>
              deberás primero moverlo al grupo <i>A Vincular</i>.<br>
              Una vez ubicado el usuario le envías una solicitud de vinculación, y cuando él acepte,
              el vículo quedará activo.<br><br>
              <b>IMPORTANTE</b><br>
              <i>
                Siempre el usuario emisor debe esperar a que el usuario receptor acepte el vínculo.
              </i>
              <br><br>
              Cuando el pedido de vinculación es emitido, el usuario receptor podrá aceptarlo o
              rechazarlo. Estas desiciones son enviadas a notificaciones, para que puedas
              estar visualmente al tanto de cada acción.<br>
              El usuario que envía el pedido es el que decide como será ese vínculo:
              <br>
              <b>Como Cliente</b>, <b>Como Proveedor</b> o <b>Ambos</b><br>
            </li><br>
            <li><b>Espejado de Artículos y Precios</b><br>
              Al momento de producirse la vinculación, el <b>Usuario Cliente</b> podrá visualizar
              todos los Artículos y Precios del <b>Usuario Proveedor</b>,<br>
              y cualquier modificación que éste último realice, se reflejarán en forma instantánea
              en el <b>Usuario Cliente</b>.<br>
            </li><br>
            <li><b>Panel de Vinculaciones</b><br>
              Desde aquí podrás adminisrar las vinculaciones.
              El panel presenta una sección izquierda con la botonera de comandos, y una sección
              derecha con la información de los usuarios.
              Los primeros dos botones superiores son para seleccionar Clientes o Proveedores.<br>
              Tanto los botones inferiores como el panel derecho reaccionarán a estos botones
              filtrando la información correspondiente.<br>
              Mas abajo se presenta cuatro botones que permiten seguir filtrando los vínculos según
              su estado.
              <br><br>
              <b>A Vincular</b>{{'\xa0'}}<v-icon>mdi-account-plus</v-icon><br>
                Visualiza todos los usuarios que no estan descartados y listos para ser
                vinculados.<br>
                Aquí podrás iniciar un vínculo o enviarlo a descartados.<br><br>
              <b>Vinculados</b>{{'\xa0'}}<v-icon>mdi-share-variant</v-icon><br>
                Visualiza los usuarios con los que estás vinculados.<br>
                Aquí podrás pausar un vinculo, cancelarlo.<br><br>
              <b>Descartados</b>{{'\xa0'}}<v-icon>mdi-pin-off</v-icon><br>
                Presenta todos los vículos que has descartado.<br><br>
              <b>Solicitudes</b>{{'\xa0'}}<v-icon>mdi-human-greeting</v-icon><br>
                Aquí es dónde aparecen las solicitudes de vículo que has recibido.<br>
                Podrás confirmarlas o rechazarlas.
            </li><br>
          </div>
          <div v-else-if="idSel==4"><b><h2>LOS PRECIOS EN GOHU</h2></b><br><br>
            Las formas de comercializar un bien de cambio o un servicio son practicamente infinitas.
            <br>
            Como dijimos en vinculaciones, los <b>Usuarios Proveedores</b> brindan sus precios a
            sus <b>Usuarios Clientes</b>.<br>
            Inicialmente los <b>Usuarios Clientes</b> solo podrán visualizar precios de sus
            proveedores vinculados.<br>
            A medida que va realizando pedidos y bajando Facturas de Compras,
            los Artículos involucrados se <i>Activarán</i> en el <b>Usuario Cliente</b> quedando
            finalmente disponibles para ser configurados, indicarles una Marca, un Grupo, su
            existencia mínima, etc, y también, el porcentaje de Remarcación, que determinará
            finalmente el precio.<br><br>
            Resumiendo podemos decir que un <b>Usuario Cliente</b> podrá visualizar todos los
            Artíulos del <b>Usuario Proveedor</b>, y podrá especificar una remarcación
            solo sobre los Artículos comprados, sobre el resto se aplicará un porcentaje de
            remarcacion sugerido por el <b>Usuario Proveedor</b>, porcentaje que el usuario
            Cliente podrá modificar según lo crea necesario.<br><br>

            <b>Artículos con más de un Precio</b><br>
            Como dijimos, salvo las restricciones explicadas en el apartado <i>Vinculaciones</i>,
            cualquier usuario se puede vincular con cualquier otro usuario.<br>
            Entonces, se puede dar el caso en el que un Cliente esté vinculado con más de un
            Proveedor, y que a su véz, estos Proveedores estén vinculados al mismo Proveedor.<br>
            Aquí se da el caso en el cual un mísmo artículo puede tener más de un precio.<br>
            El Proveedor principal le transferirá todos sus precios a sus Clientes, y que en
            este caso son Proveedores del Cliente en cuestión, entonces el Cliente verá más de un
            precio para el mismo Artículo, un precio por cada proveedor vinculado.<br><br>

            Veamos un ejemplo<br>
            El <b>Usuario 1</b> tiene como clientes al <b>Usuario 2</b> y al
            <b>Usuario 3</b>. A Ambos les transfiere todos sus Artículos y Precios.<br>
            A su véz, estos dos usuarios son Proveedores del <b>Usuario 4</b>.
            <br>
            Entonces el <b>Usuario 4</b> verá los precios de los usuarios <b>2 y 3</b>, que
            en realidad pertenecen al <b>Usuario 1</b>.<br><br>

            <i>Precios Automáticos o Precios Preferidos.</i><br>
            Como dijimos en estos casos, el sistema mostrará más de un precio para el mismo
            artículo. Pero a la hora de realizar operaciones, Facturas, Pedidos, Etc, siempre
            deberá tomar solo uno de ellos.<br>
            Por defecto siempre tomará el <i>precio mayor calculado</i><br>
            El usuario podrá cambiar este comportamiento realizando algunas configuraciones,
            que podrán ser a nivel global, seleccionando el <i>Proveedor Preferido</i> u optando
            por las siguientes reglas.<br>
            <li>Siempre le Precio Mayor ( por defecto )</li>
            <li>Ultimo Comprado</li>

            <b>Proveedor Preferido</b>
            <br><br>
            El <b>usuario 4</b> deberá seleccionar su <b>Proveedor Preferido</b>
            <br><br>

            <b>Precios Sugeridos</b><br>
            El <b>Usuario Proveedor</b> podrá asignar precios sugeridos a sus
            <b>Usuarios Clientes</b> vinculados.<br>
            El sistema prevee hasta tres posibles, estos se definen por un porcentaje sobre el
            precio de venta sin IVA.<br>
            Se definen en el <i>Perfil de Usuario</i> y se asignan en la <i>Ficha de Clientes</i>
            a cada uno de ellos.<br><br>

            <b>Remarcaciones de Precios</b><br>
            Desde la opción <i>Artículos</i> / <i>Cambios de Precios</i>, los usuarios podrán
            realizar modificaciones de precios sobre...<br>
            <b>a) Artículos Propios</b>, se podrá modificar costos y porcentajes de
            remarcación.<br>
            <b>b) Artículos <i>COMPRADOS</i> a Usuarios Proveedores</b>, solo podrá modificar
            porcentajes de remarcacion, ya que los costos siempre los dictan los Proveedores.<br>
            Se podrán especificar distintas remarcaciones de precios por Marcas de Artículos,
            por Grupos e inclusive por cada Articulo.<br><br>

            <b>Listas de Precios</b><br>
            Los Usuarios podrán definir tantas listas de precios como lo requiera su planificación
            comercial.<br>
            En ellas podrás definir dos descuentos que se acumulan y el Medio de Pago
            que debera utilizar el Cliente al momento de recibir la mercadería y realizar el pago.
            <br><br>

            Cuando defines una lista y la asignas a un Cliente, el trabajara con los
            descuentos que le has asignado en la misma.<br>
            Cuando tu cliente consulte un precio, cuando venda un artículo y cuando te realice
            pedidos, siempre trabajará con estos descuentos.<br>
            Pero cuando te realice un pedido y luego lo factures,<b> los precios en tu factura no
            incluirán estos descuentos, estos solo se cristalizarán<br>al momento del pago de dicha
            factura.</b><br><br>

            Entonces, cuando recibas un pago, el mismo vendrá por el total de la factura
            junto con una orden de NDC para que imputes el descuento corespondiente.<br>
            <br>

            Podrás administrar estas listas desde le menú <b>Artículos</b> y sub menú
            <b>Listas de Precios</b>.<br>
            Luego desde la <i>Ficha de Clientes</i> podrás asignarlas a tus Clientes.<br>

            <!--
            Al igual que los precios sugeridos, estas también se definen en el
            <i>Perfil de Usuario</i> y también se asignan en la <i>Ficha de Clientes</i>.<br><br>
            <b>Importante</b> Estos descuentos asignados impactarán en el <b>Usuario Cliente</b>,
            es lo que ellos verán, y con lo que ellos trabajarán, pero al momento de realizar
            pedidos, el precio que tomará el sistema es el de lista, es decir, sin estos descuentos.
            Luego el <b>Usuario Proveedor</b> deberá realizar el descuento correspondiente en la
            Factura o por Nota de Crédito.<br>
            El sistema le informa al <b>Usuario Proveedor</b> si corresponde o no realizar
            descuentos en las Facturas Emitidas a sus clientes.<br>
            Cada Empresa tiene su método. Por ello es que hemos implementado una serie de reglas a
            seguir:<br>
            <b>1)</b> Cada Artículo tendrá un solo Precio.<br>
            <b>2)</b> Todas la variaciones del mismo son manejadas por porcentajes de descuentos.
            -->
            <br>
          </div>
          <div v-else-if="idSel==5"><h2><b>ARTICULOS</b></h2><br>
            <b>¿Que tipos de Artículos soporta el sistema?</b><br><br>
            En gohu se pueden configurar los siguientes tipos de Artículos:<br><br>
            <li><i>Comúnes</i></li>
            Los típicos artículos de todo sistema, con un código, un nombre, un precio, etc.<br><br>
            <li><i>Presentaciones</i></li>
            Artículos que son una presentación de otros Artículos.<br>
            Es muy común que al revender un Artículo este venga en distintas presentaciones:
            Ej. cajas, blisters, etc..<br>
            Entonces vas a necesitar generar una presentación para estos artículos, para que al<br>
            momento de facturarlos no tengas que indicar porciones sino unidades.<br>
            Ej: Si compras una caja de aceites que contiene 6 unidades, cuando los vendas<br>
            podrás ingresar <b>0,1666</b> sino generas una presentación o <b>1</b> si generas la
            presentación correspondiente.<br><br>
            <li><i>Combos</i></li>
            Artículos que en realidad no son Artículos físicos, sino que son compuestos por
            otros Artículos, que si son físicos.<br>
            <br>

            El sistema presenta un formulario para poder trabajar con Artículos.<br>
            Este se encuentra en el menú lateal ingresando a las opciones
            <i>Artículos</i>/<i>Artículos</i>.<br><br>

            <h2><b>El formulario de Artículos</b></h2>
            El sistema presenta un formulario standar que permite trabajar con Artículos
            fácilmente.<br>Cuatro botones en la parte superior:
            <i>Nuevo</i>, <i>Nuevo Combo</i>,<i>Enviar a Excel</i> y <i>Enviar a PDF</i>.
            <br>Luego abajo la sección de selección de Proveedor y búsqueda.<br>
            Y finalmente la grilla con los datos de los Artículos.<br><br>

            <b><i>Buscar Artículos</i></b><br>
            El sistema muestra en la parte superior izquierda de la grilla un
            seleccionador de Proveedores.<br>
            Esto sirve para poder filtrar los Artículos de un determinado Proveedor.<br><br>

            <b><i>¿Como buscar Artículos?</i></b><br>
            En el texto de búsqueda puedes ingresar un texto a buscar.<br>
            Este texto puede ser un Código, un Nombre o un Código de Barra.<br>
            No es necesario que ingreses estos datos completos, el sistema
            búsca por parecidos.<br><br>

            <b><i>Buscar parecidos con el comodín %</i></b><br>
            El comodin <b>%</b> es muy útil, permite buscar más de una combinación
            de palabras o partes de ella.<br>
            Por ejemplo si quiero buscar latas de pinturas marca Alba de color Rojo
            puedes escribir: ALBA%ROJO.<br>
            El sistema buscará todos los Artículos cuyo nombre encuentre
            el texto ALBA y luego el texto ROJO.<br>
            Ojo, aquellos Artículos en los cuales ROJO este antes que ALBA, no serán
            encontrados, tendra que ingresar ROJO%ALBA
            <br><br>

            <b><i>Grilla de Artículos</i></b><br>
            Las columnas que componen esta grilla son:
            Código, Nombre, Pr.Públio, Stock, Activo y Acciones
            <br><br>

            <b>La columna <i>Pr.Público</i></b><br>
            Esta columna se compone de varios datos:<br><br>
            <b><i>El Prefijo</i></b><br>
            A la izquierda del Precio se muestra el Prefijo del Proveedor del Artículo,
            dato que cada usuario asigna en su Perfil de Usuario.<br>
            Este prefijo no se informa si el Artículo es propio.
            <br><br>

            <b><i>Precio Sugerido o %Rev</i></b><br>
            Es el % de Remarcación que te sugiere tu Proveedor. Solo para Artículos de
            tus Proveedores y que aún no has comprado.<br><br>

            <b><i>% Desc.</i></b><br>
            Es el % de descuento que te ha asignado tu Proveedor, este ya está aplicado
            en el precio que se muestra.<br>
            Solo para Artículos de tus Proveedores y que ya has Comprado.<br><br>

            <b><i>Fecha de última actualización del Precio</i></b><br>
            Se muestra cuando fue la ultia vez que se modifico el precio.<br><br>

            <b><i>El Precio</i></b><br>
            El precio que se informa es siempre con IVA incluido.<br><br>

            <b><i>El color del Precio</i></b><br>
            - El color <span :style="{ color: 'green' }">
            verde</span> indica que es un Artículo propio o que
              es de un Proveedor,
            y lo has comprado.<br>
            - El color <span :style="{ color: 'red'}">rojo</span> indica que es un Artículo de
            un Proveedor y que aún no lo has comprado.<br>
            Tendrás la posibilidad de editar y modificar datos sobre aquellos de color verde,
            y solo consular los de color rojo.<br><br>

            <b><i>Acciones</i></b><br>
            Esta columna solo es visible cuando el Artículo es propio o ha sido comprado, es decir
            si el color del precio es verde.<br>
            <i>Fotos</i> permite ver las fotos del Artículo, y agregar solo si el Artículo es
            propio.<br>
            <i>El menú de acciones</i> permite realizar distintas operaciones dependiendo del
            estado del Artículo.
            <br><br>
            Si el Artículo es propio o ha sido comprado<br>
            <li>Editar</li>
            <li>Crear Presentación</li>
            <li>Asignar/Editar Código Propio</li>
            <li>Stock</li>
            <br>
            Si el Artículo no es propio y no ha sido comprado<br>
            <li>Crear Presentacion</li>
            <li>Stock</li><br>

            <h2><b>Formulario de Carga y Modificación de Artículos</b></h2><br>

            <b><i>Código</i></b><br>
            Los códigos se componen del código propiamente dicho, más el caracter '<b>@</b>' y
            un número. Este último número indica el ID que le asigno el sistema al usuario dueño
            del artículo.<br>
            También se pueden encontrar códigos con el caracter '<b>.</b>' que indica que es una
            presetación de otro artículo. Vea más abajo <i>Presentaciones</i><br>
            <br><br>
            <b><i>Nombre</i></b><br>
            Nombre del Artículo. Hasta 100 caracteres como máximo.<br><br>
            <b><i>Rubro, Grupo y Marca</i></b><br>
            Para indicar a que Rubro, Grupo y Marca pertenece el Artículo.<br><br>
            <b><i>Código de Barra</i></b><br>
            Aqui se indica el Código de Barra del Artículo. Este dato es importante ya que,
            de implementar un lector de códigos, puede agilizar enormemente la búsqueda de
            Artículos en los distintos formularios.<br>
            Los códigos de barra pueden ser los originales del artículo, o generados por el
            usuario ( para presentaciones de Artículos ).<br><br>
            <b><i>Descripción del Artículo</i></b><br>
            Aquí se permite ingresar un texto para detallar la particularidades del Artículo.
            <br><br>
            <b><i>Moneda</i></b><br>
            Para indicar en que Moneda se transaccionará el Artículo.
            <br><br>
            <b><i>¿Anclado?</i></b><br>
            Puedes <i>Anclar</i> el precio de un Artículo al valor del Dolar.<br>
            Al momento de confirmar un Ancla, el sistema toma el costo actual del Artículo
            y lo divide por el precio del Dolar de ese momento.<br>
            Entonces cuando se opera con un Artículo Anclado, <i>el costo va variando según el valor
            de la cotización del Dolar del momento de realizar la consulta u operación.</i>.<br>
            El sistema toma el valor <i>Blue Comprador</i>, es decir, el valor más alto.<br><br>
            <b>IMPORTANTE</b><br>
            Puede que el valor del dolar en un determiando momento baje, entonces si el resultado
            de este anclaje da un valor menor al costo del Artículo, el sistema tomará el costo
            original<br>
            Esto lo configuras desde tu perfil.<br>
            <i>Ultima cotización</i>, <i>Precio En Dolares</i> y <i>Costo Anclado</i> son los
            valores que se mostrarán si el Artículo está Anclado.
            <br><br>
            <b><i>Costo</i></b><br>
            El costo del Artículo, originado por la última compra.
            <br><br>
            <b><i>Decimales</i></b><br>
            Permite especificar con cuantos decimales trabajará el Artículo.
            El Sistema permite detallar precios con hasta 4 decimales como máximo.
            <br><br>

            <b><i>Precios a Revendedores y Precios al Público</i></b><br>
            En tu perfil puedes definir si tu politica de comercialización es mayorista<br>
            o minorista.<br>
            Si es minorista defines un costo, un portecentaje de remarcación y listo.<br>
            Pero si es mayorista, estos datos serán los que leerán tus clientes revendedores,
            <br>
            y se agregará una opción para que definas un porcentaje de remarcación<br>
            adicional, por si quieres vender al público en general.<br><br>

            <b><i>Precios Sugeridos para la Reventa</i></b><br>
            Si tu forma de comercializacion es generalmente mayorista
            Si tienes Clientes Revendedores, aquí puedes especificar que porcentaje de Reventa,
            o precio sugerido, es el más adecuado para el Artículo.<br>
            Luego en la ficha de Clientes puedes ir asignado el correspondiente a cada uno.
            <br><br>
            <b><i>% de Remarcación</i></b><br>
            El porcentaje con el cual se va a remarcar el costo del Artículo.
            <br><br>
            <b><i>Precio Neto</i></b><br>
            El resultado del Costo multiplicado por el Porcentaje de Remarcación
            <br><br>
            <b><i>IVA</i></b><br>
            Alícuota de IVA que corresponde al Artículo.
            <br><br>
            <b><i>Precio al Publico</i></b><br>
            Precio Neto mas alícuota del Artículo
            <br><br>
            <b><i>Se Compra</i></b><br>
            Aquí se especifica si el Artículo es un bien de cambio o un servicio.
            <br><br>
            <b><i>Unidad de Medida en Compras</i></b><br>
            En que Unidad de Medida se Compra el Artículo.
            <br><br>
            <b><i>Unidades a Stock</i></b><br>
            Por cada unidad ingresada en Compras, cuantas undades almacenar en Stock,
            por lo general es 1.
            <br><br>
            <b><i>Viene en Envase</i></b><br>
            Si el Artículo comprado esta compuesto por unidades.
            <br><br>
            <b><i>Unidades en el Envase</i></b><br>
            Cantidad de unidades que componen el Envase de Compras.<br>
            Este dato es importante por si después es necesario generar <i>Presentaciones</i>
            de este Artículo.
            <br><br>
            <b><i>Se Vende</i></b><br>
            Aquí se especifica si el Artículo esta para la Venta, o si es componente
            de otro Artículo y no se vende. Vea <i>Combos de Artículos</i>
            <br><br>
            <b><i>Administra Stock</i></b><br>
            Si se quiere llevar el Stock del Artículo. Solo para los que se <i>Compran</i>
            <br><br>
            <b><i>Existencia Mínima</i></b><br>
            Existencia mínima del Artículo, para ser informados aquellos necesarios a Comprar
            según su Stock
            <br><br>
            <b><i>Cuando no hay stock...</i></b><br>
            Acción a realizar cuando no hay stock.
            <br><br>
            <b><i>Es Perecedero</i></b><br>
            Permite llevar un control de aquellos Artículos que tienen fecha de vencimiento.
            <br><br>

            <b>Recomendaciones</b><br><br>
            Es muy importante que definas un patrón o un criterio al momento de cargar los
            códigos y nombres o descripciones de tus artículos. Esto va a permitir encontrarlos más
            rapidamente.<br>
            Tener tus artículos ordenados va a simplificar tus tareas diarias.<br>
            Por ello también es muy importante que les asignes la Marca correspondiente
            y su grupo al cual pertenece.<br>
            <b>gohu</b> brinda plantillas tanto de marcas como de grupos. Puedes importarlas
            a tu sistema.
          </div>
          <div v-else-if="idSel==6"><b><h2>CLIENTES Y PROVEEDORES</h2></b><br><br>
            Aquí es donde se almacenan tus Clientes y tus Proveedores.
            Los datos en ambos casos son muy parecidos
            Clientes, Proveedores, Equipos de Trabajo y Transportistas se almacenan
            en una misma table en el sistema.<br>
            Pero a medida que los usuarios van ingresando a las distintas opciones el sistema
            los filtra y presenta un comportamiento distino para cada caso.<br>
            Se redujeron al máximo los datos para centrarnos solo en lo elemental y necesario.<br>
            <br>
          </div>
          <div v-else-if="idSel==7"><b><h2>CENTRAL DE VENTAS</h2></b><br><br>
            Desde <b>Central de Ventas</b> se podrán realizar todas las operaciones referentes a
            Ventas.<br><br>
            El formulario presenta en al parte superior una serie de paneles referentes a cada
            tipo de operación,<br>y que sirven para filtrar y mostrar información sobre cada una de
            ellas.<br>
            El panel <i>activo</i> será el que tenga un color distinto al resto.<br>
            En cada uno de ellos se muestran el importe total, la cantidad de operaciones
            realizadas y una serie de botones que permiten realizar operaciones, que dependerán del
            panel y de los derechos del usuario que esta logueado.<br><br>
            Abajo de estos paneles se presentan los filtros por Año y Mes, permitiendo tener la
            información agrupada por períodos fiscales.<br><br>
            Finalmente en la parte inferior del formulario se muestra la grilla con los movimientos
            corespondientes al filtro seleccionado.<br><br>
            Cada renglón de esta grilla presenta en el comienzo una flecha hacia abajo que permite
            realizar una apertura del mismo y mostrar los items del comprobante seleccioando.
            <br>
            En la cabecera de esta grilla se presentan más filtros, que son variables ya que
            se generan según los distintos <i>estados</i> de los comprobantes.<br>
            Y como último elemento de cada renglón se presenta un selector de opciones, que
            cuando se abre, muestra las distintas opciones que se pueden realizar con cada
            comprobante. Estas dependen también del tipo de comprobante que se este seleccionado.
            <br>
          </div>
          <div v-else-if="idSel==8"><b><h2>CENTRAL DE VENTAS -> DETALLES</h2></b><br><br>
            Explicaremos en este apartado como esta estructurado el módulo de ventas en
            <b>gohu</b>.<br><br>
            El sistema permite realizar operaciones solo a Clientes cargados, si necesitas
            realizar un Comprobante a un Cliente nuevo previamente tendrás que cargarlo.
            <br>
            Si la venta es a un Consumidor Final, deberás ingresar el código número 2 (dos) que
            es el que esta configurado para tal fin.<br>
            Las NDD's, NDC's y Remitos, estan siempre ligadas a una Factura, y esta
            puede estar ligada a un Pedido, si es que tienes <i>Clientes Viculados</i> que te
            realizan pedidos.<br>
            <br>
            Hay dos formas de realizar facturas en <b>gohu</b><br><br>
            <li><i>A Clientes Vinculados</i></li>
            Las ventas se realizan exlusivamente vía Pedidos, es decir que no vas
            a poder realizar facturas a clientes vinculados, solo vía pedidos.<br><br>
            <li><i>A Clientes NO Vinculados</i></li>
            Aquí las ventas son directas, no necesitan de un Pedido previo.<br>
            <br>
            <b>Cientes Exclusivos</b><br>
            <b><i>gohu</i></b> te permite armar tu granja de Clientes, es decir, te da la
            posibilidad de cargar a todos tus Clientes y generarles un acceso en el sistema.<br>
            Estos Clientes solo tendrán acceso a un solo proveedor, que serás tú, es decir que no
            podrán vincularse con otros usuarios <b>gohu</b>.
            <br><br>
            ¿Que tareas podrán realizar tus <b><i>Clientes Exclusivos</i></b>?<br>
            Si bien <b><i>gohu</i></b> ya deja estas cuentas preconfiguradas y listas para ser
            usadas, cada
            <i>Cliente Exclusivo</i> podrá realizar configuraciones adicionales.
            <br><br>
            1) Definir sus datos bancarios: Cuentas, Tarjetas y Chequeras.<br>
            2) Visualizar en todo momento tus precios y promociones.<br>
            3) Interactuar contigo vía mensajes de sistema.<br>
            4) Realizarte Pedidos.<br>
            5) Realizarte Pagos.<br><br>

            <b>Zonas, Vendedores y Maletines</b><br>
            Si tu logística de ventas es zonal, es decir, si tienes clientes esparcidos por un
            determinado territorio y tienes una estructura de repartos, tanto sea propia, como
            de terceros, podrás definir tus <i>Zonas</i> y <i>Vendedores</i>.<br><br>

            <b><i>Zonas</i></b><br>
            Las Zonas se definen desde la opción <i>Zonas</i> dentro del menú.<br><br>

            <b><i>Vendedores</i></b><br>
            A tus vendedores los podrás definir ingresando a la opción <i>Configuración</i> /
            <i>Mi Equipo</i><br>
            que es desde donde defines a todas las personas que utilizarán el sistema.<br>
            Desde la solapa <i>Zonas</i> de esta ficha podrás asignar que zonas serán
            atendidas por él.<br><br>

            Al definir vendedores y zonas deberás respetar las siguientes reglas:<br>
            <i>Un Vendedor podrá tener más de una Zona asignada y cada Zona solo podrá pertenecer
            a un solo Vendedor.</i><br><br>

            <i>Asignación de Zonas a Clientes</i><br>
            Las Zonas se asignan a cada dirección del Cliente.<br>
            Dentro de la ficha de Clientes, en la solapa <i>Direcciones</i>, es desde donde
            podrás especificar a que Zona corresponde cada dirección.<br>
            Cabe aclarar que un Cliente podrá tener mas de una dirección y estas pertenecer
            distintas zonas.<br>

            Al definir Zonas y Vendedores, podrás aprovechar el módulo Viajes:<br><br>

            <b>Viajes</b><br>
            Este módulo te va a permitir administrar más eficientemente tus
            pedidos, facturas y recaudación de valores.<br>
            Cada Viaje tendrá un ciclo de vida que contiene ocho etapas:<br><br>
            <li>1) Creación del Viaje de Ventas.</li>
            <p style="padding-left: 42px">
              Un nuevo viaje es creado asignandole una zona determinada.<br>
              El mismo queda en estado de espera hasta que se de inicio al mismo.<br>
            </p>
            <li>2) Inicio del Viaje de Ventas *Maletín.</li>
            <p style="padding-left: 42px">
              Se da inicio al Viaje. Todos los Clientes que pertenecen a la zona son
              notificados<br>
              Si Clientes de dicha zona ya habían realizado pedidos, estos son incorporados
              al nuevo viaje, quedando disponibles para que el vendedor los revise.<br>
            </p>
            <li>3) Carga de Pedidos.</li>
            <p style="padding-left: 42px">
              El vendedor ira cargando pedidos a medida que vaya visitando Clientes.<br>
              A medida que los vaya finalizando los podrá ir enviando a Administración
              para que los vayan procesando.
            </p>
            <li>4) Finalización del Viaje de Ventas y envío a Administración.</li>
            <p style="padding-left: 42px">
              Cuando el vendedor ya haya visitado a todos los clientes y cargado todos los pedidos
              podra dar por finalizado el Viaje de Ventas.<br>
              Serán enviados a Administración todos los pedidos cargados y aún no enviados.
            </p>
            <li>5) Facturación de Pedidos.</li>
              <p style="padding-left: 42px">
                En esta estapa se realizan todas las operaciones referentes a Pedidos.
                Partición, Facturación, Notas de Débito, de Crédito y Remitos.
              </p>
            <li>6) Envío del Viaje a Reparto.</li>
              <p style="padding-left: 42px">
                Una vez que todas las operaciones del punto 5 estan realizadas, controladas y
                finalizadas, se puede dejar el Viaje listo para Reparto.
              </p>
            <li>7) Inicio del Viaje de Reparto *Maletín.</li>
              <p style="padding-left: 42px">
                El usuario inicia el Viaje de Reparto.<br>
                Nuevamente todos los Clientes que realizaron pedidos serán notificados,
                indicando, en dicha notificación, los importes totales que deberan abonar
                al momento de la entrega de la mercadería.
              </p>
            <li>8) Finalización del Viaje de Reparto.</li>
              <p style="padding-left: 42px">
                Finalmente el repartidor podrá dar por finalizado el Viaje de Reparto,<br>
                una vez que visito y descargo la respectiva mercedería a todos los Clientes.
              </p><br>

            <b>Maletines</b><br>
            <i>Los maletines tienen el propósito de ir almacenando en ellos los valores que
            se van recaudando por cobranzas.</i><br>
            Esto permite identificar los valores más facilmente y poder controlarlos
            ante cualquier diferencia o problema con ellos.<br><br>
            <b><i>¿Quienes pueden generar Maletines?</i></b><br>
            Cualquier integrante del equipo de la empresa podrá generar Maletines, incluso el CEO.
            <br><br>

            <b><i>Detalles</i></b><br>
            En las operatorias por Zonas, generalmente una empresa posee un proceso de ventas
            y un proceso de entregas.<br>
            En cada etapa, el personal correspondiente podrá generar su Maletín si prevee
            realizar alguna cobranza.<br>
            La cobranza generalmente se realiza en etapa de Entregas o Repartos, que es cuando
            la mercadería es entregada,<br>pero sabemos que esto puede ser muy
            flexible, por lo tanto y como dijimos anteriormente, cualquier integrante del equipo
            <br>
            podrá generar sus Maletines y realizar cobranzas.<br><br>

            <b><i>¿Que deberá ingresar el operador en los Maletines?</i></b><br>
            Todos los datos de los valores fisicos y comprobrobantes de los valores digitales.<br>
            Efectivo, cheques, echeqs, boletas de depósitos y transferencias bancarias.<br><br>

            <b><i>Recibos automáticos y Recibos por Maletines.</i></b><br>
            Tenemos dos tipos de Clientes, los que usan el sistema (<b>us</b>),
            y los que no usan el sistema (<b>nus</b>).<br>

            a) Clientes <b>us</b><br>
            Realizarán sus pagos por sistema.<br>
            Este pago debera ser descargado por nuestra administración, en ese momento todos
            los valores incluidos en el mismo se almacenarán en nuestra tesorería y se emitirán
            automaticamente el recibo correspondiente cancelando la deuda del cliente.<br>
            Estos valores, una vez en nuestra tesorería quedarán disponibles para ser ingresados
            al Maletin.<br>
            Para estos casos el creador del Maletín solo deberá seleccionar los valores que
            el Cliente ingreso en su Pago.<br><br>
            b) Clientes <b>nus</b><br>
            El Cliente no realiza el pago por sistema, por lo tanto el Vendedor o Repartidor
            se deberá limitar a retirar los valores y cargarlos en el Maletín.<br>
            Luego en Administración se emitirán los recibos correspondientes basándose
            en estos Maletines. Para más detalles ve a <i>Recibos</i> para ver como funciona esta
            operatoria.
          </div>
          <div v-else-if="idSel==9"><b><h2>CENTRAL DE VENTAS -> FACTURAS</h2></b><br><br>
            Permite emitir Facturas de Ventas.<br><br>
            El botón <v-icon>mdi-plus</v-icon> presenta el formulario de Facturación.<br>
            Como primera opción se presenta la posibilidad de que el comprobante sea o no Manual.
            <br>Esto es para indicar que el comprobante no será Electrónico, para los casos
            en que el serivicio de Internet está caído.<br>
            Luego el sistema pide el Cliente, presentando un <i>Combo de Selección</i> en el cual
            el usuario podra buscar por nombre.<br>
            Una vez seleccionado el cliente, el sistema carga todos los datos extraídos del mísmo
            y los presenta en el formulario.<br><br>
            En la parte central del formulario se presenta la grilla de artículos, y en la parte
            inferior los totales de los importes.<br>

            <b>Grilla de Artículos</b>
            En

            IMPORTANTE: <b>No se podrán realizar Facturas a Clientes Vinculados</b>.<br>
            El sistema administra estas ventas vía <b>Pedidos</b>, es decir que los clientes
            vinculados deberán realizar pedidos para que luego,<br> en base a estos, se generen las
            facturas correspondientes.<br>
          </div>
          <div v-else-if="idSel==10"><b><h2>CENTRAL DE VENTAS -> DEBITOS</h2></b><br><br>
            Muestra las Notas de Débito (NDD) emitidas.<br>
            Las NDD no son operaciones <i>iniciadoras</i> de movimientos sino que van siempre
            asociadas a otra operación que sí fue inicial, en este caso una Factura.<br>
            Por lo tanto no se pueden agregar en forma aislada, sino que siempre imputando a
            una Factura.
          </div>
          <div v-else-if="idSel==11"><b><h2>CENTRAL DE VENTAS -> CREDITOS</h2></b><br><br>
            Muestra las Notas de Crédito (NDC) emitidas.<br>
            Las NDC se comportan exactamente igual que las NDD salvo que se pueden imputar
            a una Factura o a una Nota de Débito,<br>pero solo cuando dispongan de
            saldo pendiente.
            <br>
            Asegúrate de que al momento de realizar NDC's, el débito a imputar tenga saldo
            de Cuenta Corriente suficiente.<br>
            De ser esto negativo, podrás imputar el Crédito a otro Débito que si tenga saldo
            disponible.
          </div>
          <div v-else-if="idSel==12"><b><h2>CENTRAL DE VENTAS -> PRESUPUESTOS</h2></b><br><br>
            Permite realizar Presupuestos a tus Clientes.<br>
            Estos no tienen valor fiscal y tampoco se involucran con otros módulos, Stock, Cuentas
            Corrientes, Tesoreria, etc.<br>
            Una vez confeccionados podrás realizar Facturas basadas en ellos.
          </div>
          <div v-else-if="idSel==13"><b><h2>CENTRAL DE VENTAS -> REMITOS</h2></b><br><br>
            Permite realizar Remitos a tus Clientes.<br>
            Trabajan exactamente igual que los Presupuestos, con la diferencia de que estos
            comprobantes son necesarios para mover tu mercadería geofráficamente.
            Al igual que los Presupuestos, tambián podrás Facturarlos.
          </div>
          <div v-else-if="idSel==14"><b><h2>CENTRAL DE VENTAS -> PEDIDOS</h2></b><br><br>
            Los Pedidos necesitan un apartado especial ya que son vitales en el ciclo de vida de
            Ventas, sobretodo si el usuario tiene una estructura Mayorista y posee Vendedores.<br>
          </div>
          <div v-else-if="idSel==15"><b><h2>CENTRAL DE VENTAS -> RECIBOS</h2></b><br><br>
            Los Recibos permiten registrar el pago que realiza un Cliente.<br>
          </div>
          <div v-else-if="idSel==16"><b><h2>CENTRAL DE VENTAS -> RETIROS DE MERCADERIA</h2></b>
            <br><br>
            Para todos aquellos casos en los que tienes clientes que te retiran mercadería
            periodicamente<br> y no quieres realizar una factura por cada retiro.<br>
            Podrás ir registrando estos retiros y facturarlos cuando lo creas conveniente.<br>
            En los retiros no se ingresan los precios, solo el articulo y la cantidad retirada.<br>
            Luego en facturación, cuando ingreses un código de cliente que tenga retiros pendientes
            de facturar,<br>se te abrirá una ventana para los selecciones.
            Quedando estos cancelados luego del finalizar la factura.<br><br>
          </div>
          <div v-else-if="idSel==26"><b>PERFIL Y CONFIGURACION</b><br><br>
            Aqui podrás configurar tu Perfil.<br>
            Las configuraciones habilitadas dependen del tipo de licencia.<br>
            Para las licencias <b>PP</b> la configuración es mas concisa ya que se habilita solo
            una parte del sitema.<br>
            Y en las licencias <b>CO</b> o <b>BA</b> se habilitan el total de configuraciones
            disponibles.<br>
            Veamos una por una.<br><br>
            <li>General</li>
            <li>Sucursales</li>
            <li>Equipo</li>
            <li>Recargos en Tarjeta</li>
            <li>Descuentos</li>
            <li>Contraseña</li>
            <li>Comprobantes</li>
            <li>Importanciones</li>
            <li>Impuestos</li>
          </div>

        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>
<script>

/* eslint-disable */
import { mapGetters, mapMutations, mapState } from 'vuex';
import HTTP from '../http';
import router from '../router';
import moment from 'moment';

export default {
  components: {
  },
  data: () => ({
    licencias: [
      {id: 'PR',    obsv: 'ERP Profesionales',           oper: '3600',      arts: 'Infinitos', fotos: 0, vin: '0',         precio: 0},
      {id: 'CO',    obsv: 'ERP Completo',                oper: 'Infinitas', arts: 'Infinitos', fotos: 7, vin: 'Infinitas', precio: 0},
      {id: 'ME',    obsv: 'ERP Medio',                   oper: '7200',      arts: '1000',      fotos: 3, vin: '50',        precio: 0},
      {id: 'BA',    obsv: 'ERP Básico',                  oper: '3600',      arts: '500',       fotos: 1, vin: '10',        precio: 0},
      {id: 'PP',    obsv: 'Precios y Pedidos',           oper: 'Infinitas', arts: 'Infinitos', fotos: 3, vin: 'Infinitas', precio: 0},
      {id: 'PPx',   obsv: 'Precios y Pedidos Exclusivo', oper: '3600',      arts: 'No tiene',  fotos: 0, vin: 'Un solo Proveedor', precio: 0},
    ],
    preciosLicencias: [],
    idSel: 1,
    items: [
      { id: 1, name: 'Aspectos Generales' },
      { id: 2, name: 'Licencias' } ,
      { id: 3, name: 'Vinculaciones' },
      { id: 4, name: 'Los Precios en gohu' },
      { id: 5, name: 'Artículos' },
      { id: 6, name: 'Clientes y Proveedores' },
      { id: 7, name: 'Central de Ventas',
        children: [
            { id: 8, name: 'Detalles' },
            { id: 9, name: 'Facturas' },
            { id:10, name: 'Débitos' },
            { id:11, name: 'Créditos' },
            { id:12, name: 'Presupuestos' },
            { id:13, name: 'Remitos' },
            { id:14, name: 'Pedidos' },
            { id:15, name: 'Recibos' },
            { id:16, name: 'Retiros' },
        ],
      },
      {id: 17, name: 'Central de Compras',
        children: [
            { id:18, name: 'Facturas' },
            { id:19, name: 'Créditos' },
            { id:20, name: 'Débitos' },
            { id:21, name: 'Presupuestos' },
            { id:22, name: 'Remitos' },
            { id:23, name: 'Pedidos' },
            { id:24, name: 'Gastos' },
            { id:25, name: 'Pagos' },
        ],
      },
      { id: 26, name: 'Perfil y Configuración' },

    ],
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState(['tema','temas','dolar']),
  },

  watch: {
  },

  mounted () {
    //if (!this.isLoggedIn) {
    //  return router.push('/login');
    //}
    if (this.$route.params.id == 1) {
      this.idSel = 1
    } else if (this.$route.params.id == 2) {
      this.idSel = 2
    }
  },

  created () {
    this.preciosLicencias = []
    return HTTP().get('/precioslicencias').then(({ data }) => {
      for (let i=0; i<=data.length-1; i++) {
        if (data[i].id==16) {
          this.licencias[0].precio = data[i].usd*data[i].cotDolar
        } else if (data[i].id==17) {
          this.licencias[1].precio = data[i].usd*data[i].cotDolar
        } else if (data[i].id==18) {
          this.licencias[2].precio = data[i].usd*data[i].cotDolar
        } else if (data[i].id==19) {
          this.licencias[3].precio = data[i].usd*data[i].cotDolar
        } else if (data[i].id==20) {
          this.licencias[4].precio = data[i].usd*data[i].cotDolar
        }
        data[i].precio = data[i].usd*this.$store.state.dolar
      }
      this.preciosLicencias = data
    })

  },

  methods: {
    ...mapMutations(['setTema','setTemas',]),

    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////
    closeForm(){
      router.go(-1)
      //router.push('/')
    },

    openDialog(item) {
      this.idSel = item.id
    },

    //////////////////////////////
    // METODOS FUNCIONES VARIAS //
    //////////////////////////////
    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
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
