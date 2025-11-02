# 🤖 Escenarios de Demo - Validación IA

## Objetivo
Demostrar el poder de la IA para detectar **contradicciones e incoherencias** que un humano podría pasar por alto.

---

## 📋 Escenarios de "Efecto WOW"

### ✨ Escenario 1: Contradicción Impresora (RECOMENDADO PARA DEMO)

**Setup:**
1. Rellenar el formulario de mantenimiento normalmente
2. En **Secció 4: Verificació Funcional**:
   - ✅ Marcar "Impressora de pupitre" como **OK** (checked)
3. En **Secció 5: Observacions**:
   - Escribir: "La impresora no saca papel correctamente" o "Impressora bloquejada"

**Resultado esperado:**
```
🤖 IA: Contradicció detectada
⚠️ CONTRADICCIÓ: Has marcat la impressora com a OK, però les observacions 
indiquen que 'La impresora no saca papel correctamente'. Revisa l'estat 
de la impressora.
```

**Impacto:** ⭐⭐⭐⭐⭐ Muy visual y fácil de entender

---

### ✨ Escenario 2: Contradicción Validación de Títulos

**Setup:**
1. En **Secció 4: Verificació Funcional**:
   - ✅ Marcar "Validació de títols" como **OK**
2. En **Secció 5: Observacions**:
   - Escribir: "El validador no lee las tarjetas T-Mobilitat"

**Resultado esperado:**
```
🤖 IA: Contradicció detectada
⚠️ CONTRADICCIÓ: La validació està marcada com a OK, però les observacions 
mencionen 'El validador no lee las tarjetas T-Mobilitat'. Marca la validació 
com a incorrecta o elimina la nota del problema.
```

**Impacto:** ⭐⭐⭐⭐⭐

---

### ✨ Escenario 3: Contradicción Pantalla

**Setup:**
1. En **Secció 4: Verificació Funcional**:
   - ✅ Marcar "Pantalla del pupitre" como **OK**
2. En **Secció 5: Observacions**:
   - Escribir: "Pantalla con píxeles muertos en esquina superior derecha"

**Resultado esperado:**
```
🤖 IA: Contradicció detectada
⚠️ CONTRADICCIÓ: Has marcat la pantalla com a OK, però les observacions 
indiquen 'Pantalla con píxeles muertos'. Revisa l'estat de la pantalla.
```

**Impacto:** ⭐⭐⭐⭐

---

### ✨ Escenario 4: Contradicción Comunicación

**Setup:**
1. En **Secció 4: Verificació Funcional**:
   - ✅ Marcar "Comunicació amb el centre" como **OK**
2. En **Secció 5: Observacions**:
   - Escribir: "Sin conexión al centro de control"

**Resultado esperado:**
```
🤖 IA: Contradicció detectada
⚠️ CONTRADICCIÓ: La comunicació està marcada com a OK, però les observacions 
mencionen problemes de connexió. Revisa l'estat de la comunicació.
```

**Impacto:** ⭐⭐⭐⭐

---

### ✨ Escenario 5: Incoherencia Temporal

**Setup:**
1. En **Secció 5: Observacions**:
   - **Hora Inici:** 14:30
   - **Hora Fi:** 13:00 (anterior a la hora de inicio)

**Resultado esperado:**
```
🤖 IA: Contradicció detectada
⚠️ INCOHERÈNCIA TEMPORAL: L'hora de fi (13:00) és anterior a l'hora d'inici 
(14:30). Revisa les hores de treball.
```

**Impacto:** ⭐⭐⭐⭐

---

### ✨ Escenario 6: Múltiples Contradicciones (IMPRESIONANTE)

**Setup:**
1. Marcar **TODAS** las verificaciones como OK
2. En observaciones escribir:
   ```
   Problemas detectados: impresora atascada, validador no funciona, 
   pantalla con líneas verticales, sin conexión a red
   ```

**Resultado esperado:**
```
🤖 IA: Contradicció detectada (1/4)
⚠️ printerOk: Contradicció amb observacions sobre 'impresora atascada'

🤖 IA: Contradicció detectada (2/4)
⚠️ validationOk: Contradicció amb observacions sobre 'validador no funciona'

🤖 IA: Contradicció detectada (3/4)
⚠️ screenOk: Contradicció amb observacions sobre 'pantalla con líneas'

⚠️ Més contradiccions detectades
L'IA ha trobat 1 contradiccions addicionals...
```

**Impacto:** ⭐⭐⭐⭐⭐ ¡ESPECTACULAR!

---

## 🎬 Script de Demo Recomendado

### Paso 1: Introducción (30 segundos)
> "Ahora voy a mostrarles una característica única: **validación inteligente con IA**. 
> La IA puede detectar **contradicciones** que un humano podría pasar por alto."

### Paso 2: Setup (1 minuto)
1. Navegar a una tarea de mantenimiento
2. Rellenar rápidamente las primeras secciones
3. Llegar a **Secció 4: Verificació**

### Paso 3: Crear la Contradicción (30 segundos)
> "Imaginemos que el técnico está cansado y comete un error..."

1. Marcar "Impressora de pupitre" como ✅ OK
2. Avanzar a Observaciones
3. Escribir: "La impresora no funciona correctamente"

### Paso 4: Validar con IA (30 segundos)
> "Ahora, en lugar de enviar directamente, vamos a usar la **validación con IA**..."

1. Click en botón **"🤖 Validar amb IA"**
2. Esperar 2-3 segundos (mostrar el loading)
3. **BOOM!** Toast de error aparece

### Paso 5: Impacto (30 segundos)
> "¡Miren esto! La IA ha detectado la contradicción entre los campos. 
> Ha analizado todo el formulario y ha encontrado que marcamos la impresora 
> como OK pero luego reportamos un problema. Esto **previene errores** y 
> **mejora la calidad** de los datos."

**Tiempo total:** ~3 minutos
**Impacto:** ⭐⭐⭐⭐⭐

---

## 💡 Consejos para la Demo

### ✅ DO's:
- Usar el **Escenario 1** (impresora) - es el más visual
- Dejar que el cliente escriba las observaciones
- Mostrar la consola del navegador (F12) para ver los logs detallados
- Explicar que esto funciona **offline** también
- Mencionar que se puede extender para detectar más casos

### ❌ DON'Ts:
- No usar palabras técnicas excesivas
- No apresurarse - dejar que el efecto se aprecie
- No explicar cómo funciona la IA (enfocarse en el resultado)

---

## 🚀 Extensiones Futuras

Ideas para impresionar aún más:

1. **Detección de Patrones**: "Este autobús ha tenido 3 problemas de impresora en 2 meses"
2. **Predicción de Fallos**: "Basándome en el historial, el switch puede fallar pronto"
3. **Sugerencias Automáticas**: "Recomiendo cambiar la impresora por el modelo X"
4. **Análisis de Imágenes**: "He detectado óxido en las fotos subidas"

---

## 📊 Métricas de Éxito

- ✅ Cliente dice "Wow" o equivalente
- ✅ Cliente pregunta "¿Cómo lo hace?"
- ✅ Cliente pide probar con sus propios ejemplos
- ✅ Cliente menciona casos de uso en su operación

---

**Última actualización:** 2 de noviembre de 2025
