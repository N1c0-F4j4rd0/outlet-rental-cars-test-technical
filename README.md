# Outlet Rental Cars - Prueba Técnica Front-End

## Descripción general

Este proyecto corresponde a una prueba técnica para el rol de **Desarrollador Front-End**, cuyo objetivo es construir un flujo reducido de búsqueda y selección de vehículos para **Outlet Rental Cars**, aplicando buenas prácticas de desarrollo con **Next.js**, **TypeScript**, **Redux + Thunk**, renderizado del lado del servidor (**SSR**) y una estructura clara por capas.

La solución implementa un flujo mínimo compuesto por:

- **Búsqueda de vehículos**
  - Ciudad o aeropuerto
  - Fecha de recogida
  - Fecha de devolución
- **Resultados**
  - Consumo de un mock de API
  - Visualización de vehículos disponibles
  - Selección de vehículo
- **Resumen**
  - Vehículo seleccionado
  - Precio final estimado
  - Visualización en distintas monedas

---

## Tecnologías utilizadas

- **Next.js**
- **TypeScript**
- **Redux Toolkit**
- **Redux Thunk**
- **CSS personalizado**
- **SSR con `getServerSideProps`**

---

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd outlet-rental-cars-test-technical
### 2. Instalar dependencias
npm install

### 3. Ejecutar en modo desarrollo
npm run dev

### 4. Abrir en el navegador
http://localhost:3000


—


### Decisiones técnicas
### 1. Uso de Next.js

Se eligió Next.js porque la prueba solicita explícitamente este framework y además requiere SSR para los resultados de búsqueda. Para hacer esta implementación más clara y fácil de auditar, se utilizó el enfoque basado en pages/ con getServerSideProps.

### 2. Uso de TypeScript

Se utilizó TypeScript para aportar mayor seguridad en el tipado, mejorar la mantenibilidad del código y reducir errores relacionados con estructuras de datos y props de componentes.

### 3. Arquitectura por capas

El proyecto se organizó con una separación básica entre:

- UI: páginas, componentes y presentación visual
- Lógica de negocio: cálculos y reglas del flujo
- Datos: mock API y acceso a datos

Esta separación permite que el código sea más claro, escalable y fácil de mantener.

### 4. Manejo de estado con Redux + Thunk

Se utilizó Redux Toolkit con Thunk para centralizar el estado relacionado con:

- Resultados de la búsqueda
- Vehículo seleccionado
- Estados de loading
- Estados de error

Aunque el flujo es pequeño, esta decisión permite demostrar una estructura preparada para escalar a un flujo más completo de reserva.

### 5. SSR en resultados

La página de resultados obtiene la información del lado del servidor para cumplir con el requerimiento técnico. Esto deja claro que la información se procesa antes de renderizar la vista, en lugar de depender únicamente de renderizado en cliente.

### 6. Mock API interna

Para mantener la prueba autocontenida y fácil de ejecutar, se implementó un endpoint mock dentro del mismo proyecto usando pages/api/vehicles.ts. Esto evita dependencias externas y hace que el proyecto sea reproducible localmente.

### 7. Conversión de moneda

Se agregó la opción de visualizar precios en USD, COP y EUR. Para esta prueba se utilizaron tasas de conversión mock con fines demostrativos. En un entorno real, estas tasas deberían consumirse desde un servicio externo confiable o ser provistas por backend.

### 8. UI y experiencia de usuario

Se buscó una interfaz visualmente consistente con el estilo general de Outlet Rental Cars, utilizando:

- Paleta de color alineada con la marca
- Diseño responsive
- Jerarquía visual clara
- Animaciones suaves
- Accesibilidad básica en formularios y navegación

—


### Cómo integraría la aplicación con una pasarela de pago

Para integrar esta aplicación con una pasarela de pago en un entorno real, propondría un flujo donde el Front-End y el Back-End tengan responsabilidades claramente separadas.

### Flujo propuesto
1. El usuario realiza la búsqueda, selecciona un vehículo y confirma los datos de su reserva.
2. El Front-End envía al backend la información necesaria de la reserva:
- vehículo seleccionado
- fechas
- ubicación
- moneda
- precio calculado
3. El backend valida la información, recalcula el monto final para evitar manipulaciones desde cliente y crea una intención de pago o sesión de checkout con la pasarela elegida.
4. La pasarela devuelve un identificador seguro o una URL de pago que el Front-End utiliza para continuar el proceso.
5. Una vez completado el pago, el backend recibe la confirmación final por medio de un webhook o notificación segura.
6. Finalmente, el estado de la reserva se actualiza a pagada y el usuario recibe la confirmación correspondiente.

### Consideraciones importantes
- El Front-End no debería manejar directamente datos sensibles de tarjeta.
- El backend debe ser el responsable de:
  - validar montos
  - crear la intención de pago
  - verificar el resultado del pago
  - registrar el estado final de la reserva
- Se debe contemplar manejo de errores, pagos rechazados, expiración de sesión y reintentos.
- Para una implementación real, sería recomendable integrar una pasarela reconocida como Stripe, Adyen o Mercado Pago, según la región y necesidades del negocio.

### Enfoque de seguridad

Para proteger la integridad del proceso:

- el precio final debe validarse en backend
- los identificadores de reserva deben ser seguros
- la confirmación del pago debe validarse mediante webhook
- nunca se deben confiar montos calculados únicamente desde el cliente

### Mejoras futuras

Como evolución natural del proyecto, se podrían incorporar:

- integración real con API externa de disponibilidad
- filtros avanzados por tipo de vehículo
- imágenes reales de autos
- autenticación de usuario
- proceso completo de checkout
- integración real con pasarela de pago
- persistencia de reserva
- testing unitario e integración
