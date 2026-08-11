# Auditoría del flujo de Escenarios Presupuestales

Fecha de revisión: 10 de agosto de 2026

## Flujo canónico

1. `Escenarios_Index.html`: guía funcional del submódulo.
2. `P2_EscenariosPresupuestales.html`: listado y control administrativo.
3. `P2_Esc_NuevoEscenario.html`: alta o edición de un escenario.
4. `Esc_DetalleEscenario.html`: seguimiento, validación y tratamiento de bolsas.
5. `Liberaciones.html`: liberación de la versión cerrada.

`Escenarios_Casos.html` se conserva como catálogo demostrativo de tipos y estados.

## Errores encontrados y corrección aplicada

- El acceso del submódulo apuntaba a `P2_EscenariosPresupuestales1.html`, una copia antigua del formulario de alta. El menú ahora muestra un solo acceso y abre el listado canónico.
- `AjustesPresupuestales2027.html` y `P2_EscenariosPresupuestales1.html` contenían vistas duplicadas. Se conservaron como accesos heredados, pero redirigen al listado canónico para no romper marcadores anteriores.
- Los folios y el botón “Ver seguimiento” regresaban al formulario. Ahora abren `Esc_DetalleEscenario.html` con el tipo, estado e identificador del escenario.
- Algunos cierres intentaban abrir `P2_Esc_Liberaciones.html`, archivo inexistente en la raíz. Ahora abren `Liberaciones.html`.
- El formulario permitía registrar más de una ventana. Ahora cada escenario contiene una sola ventana, que sólo entra en operación al aplicar el escenario; el borrador no notifica ni modifica solicitudes.
- El alcance no seguía la delimitación jerárquica completa. Ahora solicita nivel, elemento concreto, negocios incluidos y cuentas presupuestales exentas.
- Faltaba la modalidad semestral y no era visible el acumulado capturado. Se agregó “Por semestre” y un contador dinámico por periodo para porcentaje o importe.
- El resumen era únicamente textual y podía mostrar un alcance distinto al seleccionado. Ahora se sincroniza con la selección y contiene una tabla jerárquica expandible/contraíble.
- La validación administrativa usaba el término “conciliar”. La interfaz ahora distingue “Pendiente de validación”, “Remanente por resolver” y “Excedente por validar”.
- El listado no presentaba claramente el control de bolsas. Se agregó la sección “Remanentes y excedentes” con tratamiento administrativo separado.
- El índice y la matriz de casos tenían redacción fragmentada y nombres inconsistentes. Se simplificó el recorrido y se homologaron tipos y estados.

## Validaciones realizadas

- 15 destinos relevantes del flujo revisados; 0 enlaces rotos dentro del alcance de Escenarios Presupuestales.
- Accesos heredados probados: ambos terminan en el listado canónico.
- Menú probado: un único enlace visible a Ajustes Presupuestales.
- Alcance probado por grupo y país, con actualización de negocios, CeCos, importes y resumen.
- Semestre probado con 100% capturado; el contador muestra 100% distribuido.
- Ventana única comprobada y botón de agregar ventana oculto.
- Resumen jerárquico probado en estados expandido y contraído.
- Casos de remanente y excedente comprobados en el detalle.

## Alcance y pendientes funcionales

La maqueta representa el comportamiento visual y de navegación. La integración real con SIPRES, permisos por rol, persistencia en servidor, notificaciones y reglas contables de destino de las bolsas requieren definición e implementación del servicio correspondiente. Los enlaces genéricos heredados de otros módulos de la maqueta no forman parte de esta corrección.

## Ajustes de la segunda revisión

- Se eliminó el acceso a Escenarios Presupuestales que aparecía incorrectamente bajo Liberaciones.
- Se retiró la alerta heredada “Cambio solicitado y confirmado por Administración”.
- Centro de Costos ahora presenta directamente el catálogo completo de CeCos del ejercicio, sin solicitar negocio, grupo o división.
- Cuenta presupuestal ahora utiliza únicamente una selección múltiple de cuentas y no solicita negocios ni CeCos.
- La selección de cuentas exentas se compactó y sólo aparece cuando corresponde.
- El motivo pasó al paso 2. Responsable, aprobación y ventana permanecen ocultos hasta elegir “Aplicar escenario”.
- Se mantiene una sola ventana de ajustes por ejercicio.
- El modo semestral usa “Q1–Q2 · Ene–Jun” y “Q3–Q4 · Jul–Dic”.
- El resumen se agrupó en Alcance, Ajuste y Aplicación, eliminando la tarjeta independiente por cada dato.
- La tabla jerárquica ahora usa las columnas de Liberaciones: Línea de negocio + CECOS, Campañas, Cuentas, Nuevo Importe y Anterior.
