# n8n-nodes-prestashopadvanced

![PrestaShop + n8n](https://raw.githubusercontent.com/Xococode/n8n-nodes-prestashopadvanced/main/prestashop-n8n-automatiza-tu-tienda.webp)


Este es un nodo de la comunidad de **n8n**. Te permite integrar el [Webservice/API de PrestaShop](https://www.prestashop.com/) en tus flujos de trabajo de n8n.

Es compatible tanto con **acciones** (gestionar los recursos principales) como con **disparadores** (escuchar nuevas entidades creadas en PrestaShop).

[n8n](https://n8n.io/) es una plataforma de automatización de flujos de trabajo con [licencia fair-code](https://docs.n8n.io/reference/license/).

[Instalación](#instalación)  
[Operaciones](#operaciones)  
[Credenciales](#credenciales)  
[Compatibilidad](#compatibilidad)  
[Uso](#uso)  
[Recursos](#recursos)  

---

## Instalación

Sigue la [guía de instalación](https://docs.n8n.io/integrations/community-nodes/installation/) en la documentación de nodos comunitarios de n8n.

Nombre del paquete npm: **n8n-nodes-prestashopadvanced**

---

## Operaciones

#### Reglas de carrito (Voucher)
- Crear una regla de carrito
- Eliminar una regla de carrito
- Obtener una regla de carrito
- Obtener todos los precios específicos (permitiendo filtrar y ordenar por múltiples campos)

#### Clientes
- Crear un cliente
- Actualizar un cliente (solo los atributos especificados)
- Eliminar un cliente
- Obtener un cliente
- Obtener todos los clientes (permitiendo filtrar y ordenar por múltiples campos)

#### Pedidos
- Obtener un pedido
- Obtener todos los pedidos (permitiendo filtrar y ordenar por múltiples campos)
- Eliminar un pedido
- Cambiar el estado de un pedido
- Establecer una nota interna en un pedido
- Establecer el número de envío de un pedido

#### Productos
- Crear un producto
- Actualizar un producto (solo los atributos especificados)
- Actualizar el stock de un producto (establecer cantidad)
- Eliminar un producto
- Obtener un producto
- Obtener todos los productos (permitiendo filtrar y ordenar por múltiples campos)

#### Precios específicos
- Crear un precio específico
- Actualizar un precio específico (solo los atributos especificados)
- Eliminar un precio específico
- Obtener un precio específico
- Obtener todos los precios específicos (permitiendo filtrar y ordenar por múltiples campos)

---

### Eventos de disparo (Triggers)
- Dirección creada  
- Transportista creado  
- Regla de carrito creada  
- Carrito creado  
- Categoría creada  
- Combinación creada  
- Mensaje de cliente creado  
- Hilo de cliente creado  
- Cliente creado  
- Empleado creado  
- Fabricante creado  
- Mensaje creado  
- Transportista de pedido creado  
- Detalle de pedido creado  
- Historial de pedido creado  
- Pago de pedido creado  
- Pedido creado  
- Producto creado  
- Regla de precio específico creada  
- Precio específico creado  
- Stock disponible creado  
- Tienda creada  
- Proveedor creado  
- Etiqueta creada  

---

## Credenciales

Necesitas una **Clave API de PrestaShop** y la **URL base** de tu tienda.

1. En el back office de PrestaShop, ve a **Parámetros avanzados → Webservice**.  
2. Activa el webservice y genera una clave.  
3. Usa esta clave y la URL de tu tienda en las credenciales del nodo en n8n.  

---

## Compatibilidad

- Versión mínima de n8n: **1.0.0**  
- Probado con:  
  - PrestaShop **1.7.x**  
  - PrestaShop **8.x**  
  - PrestaShop **9.x**  

---

## Uso

1. Añade el nodo **PrestaShop** a tu flujo de trabajo.  
2. Configura las credenciales.  
3. Elige un recurso y operación:  
   - `Cliente`, `Pedido`, `Producto`, `Reglas de carrito`, `Precios específicos`  
   - Para disparadores, selecciona uno de los eventos disponibles.  
4. Conecta el nodo con otros nodos en tu automatización.  

**Para ejemplos de flujos listos para usar, [REVISA ESTA CARPETA](/examples/).**

---

## Recursos

* [Ejemplos de flujos PrestaShop + n8n](/examples/)  
* [Documentación de nodos comunitarios de n8n](https://docs.n8n.io/integrations/#community-nodes)  
* [Documentación del webservice de PrestaShop](https://devdocs.prestashop-project.org/9/webservice/)  
