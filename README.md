# Rotula — Afiches de ofertas en minutos

**Universidad Don Bosco · DPS941 Diseño y Programación de Software Multiplataforma**
**Etapa 2 — Desarrollo base del proyecto (Web)** · Ciclo 02-2026 · Docente: Ing. Alexander Alberto Siguenza Campos

| | |
|---|---|
| **Repositorio** | https://github.com/Slincker5/rotula |
| **Despliegue en Vercel** | https://rotula.vercel.app |
| **Fecha de entrega** | Domingo 20 de septiembre de 2026 |

---

## 1. Integrantes

| # | Nombre completo | Carnet | Usuario de GitHub | Rama de trabajo | Aporte principal |
|---|---|---|---|---|---|
| 1 | Gerson Vladimir Borja Álvarez | BA251704 | @Slincker5 | `vladi-parte`, `dev` | Backend: API REST, autenticación JWT, generación de PDF |
| 2 | Ariel Alexander Hernández Merino | HM251962 | @Hernan-byte | `ariel-parte`, `feature/rol-admin-ariel` | Frontend: landing, componentes, módulo de administración |


Todos los integrantes están agregados como colaboradores del repositorio. Cada integrante trabaja en su propia rama y la integración se hace por Pull Request hacia `dev` y luego a `main` (ver sección 12).

---

## 2. Descripción del proyecto

**Rotula** es una aplicación web para dueños y encargados de tiendas, minisúper y supermercados. Permite registrar **rótulos de oferta** (afiches de precio) y generar un **PDF listo para imprimir** con cuatro rótulos por hoja A4, con marcas de corte.

Cada rótulo lleva la descripción del producto, el precio de oferta en grande, el precio unitario tachado con el ahorro calculado, la vigencia (fecha de inicio y fin) y el código de barras EAN. El usuario los va agregando a una lista, elige cuántas copias necesita de cada uno y con un clic genera el documento. El dashboard muestra las ofertas activas, las que vencen esta semana, la cuota mensual usada y los últimos documentos generados; el historial permite volver a descargar cualquier PDF.

### Problema que resuelve

En los comercios pequeños los rótulos de precio se hacen a mano o en Word: sin formato uniforme, sin control de vigencia y sin registro de lo que se imprimió. Rotula centraliza esa información, estandariza el diseño y deja historial.

### Alcance de la Etapa 2

Versión web con la lógica de negocio principal y API REST propia. La Etapa 3 reutilizará esta misma API para la versión móvil en React Native.

---

## 3. Stack tecnológico

| Capa | Tecnología | Versión | Uso en el proyecto |
|---|---|---|---|
| Framework | **Next.js** (App Router) + **React** | 16.3.4 / 19.2.8 | Frontend y backend (Route Handlers) en un solo proyecto. JavaScript, sin TypeScript |
| Estilos | **Tailwind CSS** | 4.x | Interfaz responsiva (móvil, tablet, escritorio) |
| Iconos | **Font Awesome** (kit por CDN) | 6 | Iconografía de toda la interfaz |
| Cliente HTTP | **Axios** | 1.20 | Consumo de la API REST desde el navegador |
| Notificaciones | **Sonner** | 2.0 | Toasts de éxito y error en la UI |
| Autenticación | **JWT** con **jose** + cookie `httpOnly` | jose 6.2 | Sesión firmada con HS256, emitida y verificada en el servidor |
| Hash de contraseñas | **bcryptjs** / **bcrypt** | 3.0 / 6.0 | Las contraseñas se guardan con hash (12 rondas) |
| Base de datos | **MySQL** + **mysql2** | mysql2 3.24 | Pool de conexiones; persistencia de usuarios, rótulos, documentos y productos |
| Generación de PDF | **pdf-lib** | 1.17 | Pinta los rótulos sobre una plantilla PDF (A4, 4 rótulos A6 por hoja) |
| Compilador | **React Compiler** | 1.0 | Optimización automática de re-renders |
| Despliegue | **Vercel** | — | Hosting del frontend y de la API (runtime Node.js) |
| Control de versiones | **Git + GitHub** | — | Ramas por integrante, integración por Pull Request |

---

## 4. Arquitectura

### 4.1 Separación de capas

```
┌──────────────────────────────────────────────────────────────────────┐
│  CAPA DE PRESENTACIÓN (UI)                                           │
│  app/**/page.jsx · app/**/layout.jsx · components/                   │
│  Componentes de React ("use client"). Renderizan, capturan eventos   │
│  y llaman a la API con Axios. Nunca tocan la base de datos.          │
├──────────────────────────────────────────────────────────────────────┤
│  CAPA DE LÓGICA DE NEGOCIO                                           │
│  lib/validarRotuloInput.js · lib/validarProductoInput.js             │
│  lib/generarRotulos.js · lib/pintarRotulo.js                         │
│  lib/auth.js · lib/admin.js · proxy.js                               │
│  Reglas de validación, generación del PDF, sesión y permisos.        │
│  Funciones puras: no saben de HTTP ni de la UI.                      │
├──────────────────────────────────────────────────────────────────────┤
│  CAPA DE DATOS                                                       │
│  app/api/**/route.js · lib/db.js (pool MySQL)                        │
│  Endpoints REST: reciben la petición, validan con la capa de lógica, │
│  consultan MySQL y responden JSON. Único acceso a la base de datos.  │
└──────────────────────────────────────────────────────────────────────┘
```

- **UI**: cada página mantiene su estado local con `useState`/`useEffect` y consume la API con Axios. Los componentes compartidos (`Menu`, `Footer`, `Cargando`) viven en `components/`.
- **Lógica**: las validaciones y la generación del PDF están aisladas en `lib/`, de modo que los mismos validadores se reutilizan en crear y editar, y el mismo generador se usa al crear un documento y al volver a descargarlo.
- **Datos**: los Route Handlers de `app/api/` son el único lugar que ejecuta SQL, siempre con consultas parametrizadas (`?`) para evitar inyección SQL.

### 4.2 Estructura de carpetas

```
rotula/
├── app/
│   ├── layout.js                     # Layout raíz: Menu, Footer, Toaster, Font Awesome
│   ├── page.js                       # Landing pública
│   ├── login/page.jsx                # Inicio de sesión
│   ├── registro/page.jsx             # Registro de usuario
│   ├── home/                         # Zona privada (requiere sesión)
│   │   ├── page.jsx                  # Dashboard
│   │   ├── crear-afiches/page.jsx    # CRUD de rótulos + generar PDF
│   │   ├── historial/page.jsx        # Documentos generados
│   │   └── admin/                    # Zona de administrador (requiere rol admin)
│   │       ├── layout.jsx            # Verifica el rol antes de mostrar
│   │       ├── page.jsx              # Rótulos de todos los usuarios
│   │       └── productos/page.jsx    # CRUD del catálogo de productos
│   └── api/                          # API REST
│       ├── registro/route.js
│       ├── login/route.js
│       ├── logout/route.js
│       ├── usuario/route.js
│       ├── rotulos/route.js          # GET listar · POST crear
│       ├── rotulos/[id]/route.js     # GET · PUT · DELETE
│       ├── rotulos/pdf/route.js      # POST generar documento
│       ├── documentos/route.js       # GET historial
│       ├── documentos/[uuid]/pdf/route.js   # GET descargar PDF
│       └── admin/
│           ├── route.js              # GET verificar rol admin
│           ├── rotulos/route.js      # GET rótulos de todos los usuarios
│           ├── productos/route.js    # GET · POST
│           └── productos/[id]/route.js      # PUT · DELETE
├── components/
│   ├── Menu.jsx                      # Navegación; muestra "Admin" solo si el rol lo permite
│   ├── Footer.jsx
│   └── loading.jsx                   # Indicador de carga
├── lib/
│   ├── db.js                         # Pool de conexiones MySQL (mysql2/promise)
│   ├── auth.js                       # getSession() / getUser() a partir de la cookie
│   ├── admin.js                      # getAdmin(): usuario solo si rol === 'admin'
│   ├── validarRotuloInput.js         # Reglas de validación de rótulos
│   ├── validarProductoInput.js       # Reglas de validación de productos
│   ├── generarRotulos.js             # Arma el PDF: hojas, celdas, marcas de corte
│   └── pintarRotulo.js               # Dibuja un rótulo (textos, precios, EAN)
├── plantillas/
│   ├── plantilla-rotulo.pdf          # Plantilla base del rótulo
│   └── plantilla-rotulo.svg
├── proxy.js                          # Middleware de rutas (en Next 16 se llama proxy)
├── next.config.mjs                   # reactCompiler + inclusión de plantillas en Vercel
├── .env.local                        # Variables de entorno (no se sube al repo)
└── package.json
```

---

## 5. Autenticación y roles

### 5.1 Flujo de sesión (JWT en cookie httpOnly)

1. `POST /api/registro`: valida los campos, hace hash de la contraseña con bcrypt (12 rondas) y crea el usuario con rol `user`.
2. `POST /api/login`: busca el usuario por correo, compara la contraseña con `bcrypt.compare` y, si es válida, firma un **JWT (HS256)** con `jose` que lleva el `id` del usuario en `sub`, con vigencia de 7 días.
3. El token viaja en la cookie **`sesion`** con `httpOnly: true`, `secure` en producción, `sameSite: lax` y `path: /`. **El token nunca es accesible desde JavaScript del navegador**, lo que evita su robo por XSS.
4. En cada petición el navegador envía la cookie automáticamente. Los endpoints protegidos llaman a `getSession()` / `getUser()` (`lib/auth.js`), que verifican la firma y la expiración; si falla responden `401`.
5. `proxy.js` (middleware) revisa la cookie antes de servir las páginas: sin sesión, `/home/*` redirige a `/login`; con sesión, `/login` y `/registro` redirigen a `/home`.
6. `POST /api/logout` elimina la cookie.

### 5.2 Roles y permisos

Existen dos roles guardados en `usuarios.rol`: **`user`** (por defecto al registrarse) y **`admin`**.

| Acción | `user` | `admin` |
|---|---|---|
| Registrarse, iniciar y cerrar sesión | Sí | Sí |
| Ver dashboard e historial propios | Sí | Sí |
| Crear, listar, editar y borrar **sus propios** rótulos | Sí | Sí |
| Generar y volver a descargar **sus propios** PDF | Sí | Sí |
| Ver los rótulos de **todos** los usuarios (`/home/admin`) | No | Sí |
| Administrar el catálogo de productos: crear, listar, editar, borrar (`/home/admin/productos`) | No | Sí |
| Consumir `/api/admin/**` | No (`403`) | Sí |

- **Backend**: `lib/admin.js` → `getAdmin()` devuelve el usuario solo si `rol === 'admin'`; todos los endpoints de `/api/admin/**` lo usan y responden `403 Forbidden` a cualquier otro rol.
- **Frontend**: `components/Menu.jsx` muestra el enlace "Admin" solo si `GET /api/admin` responde `ok`; `app/home/admin/layout.jsx` vuelve a verificar y, si no es admin, regresa a `/home` con un aviso. **La validación real siempre ocurre en el servidor**; lo del cliente es solo experiencia de usuario.
- Un usuario nunca puede leer, editar ni borrar rótulos o documentos de otro: todas las consultas filtran por `usuario_id` de la sesión.

---

## 6. API REST

Base URL local: `http://localhost:3000/api` · Producción: `https://[COMPLETAR].vercel.app/api`

Todas las respuestas son JSON. Los endpoints con **Sesión = Sí** requieren la cookie `sesion`; los de **Admin** requieren además rol `admin`.

### 6.1 Autenticación y usuario

| Método | Endpoint | Sesión | Descripción | Body |
|---|---|---|---|---|
| `POST` | `/api/registro` | No | Crea un usuario con rol `user` | `{ nombre, apellido, email, nombre_negocio, password_hash }` |
| `POST` | `/api/login` | No | Valida credenciales y envía la cookie `sesion` | `{ email, password }` |
| `POST` | `/api/logout` | Sí | Elimina la cookie | — |
| `GET` | `/api/usuario` | Sí | Datos del usuario autenticado | — |

### 6.2 Rótulos (módulo de gestión principal — CRUD)

| Método | Endpoint | Sesión | Descripción |
|---|---|---|---|
| `GET` | `/api/rotulos` | Sí | Lista los rótulos del usuario, más recientes primero |
| `POST` | `/api/rotulos` | Sí | Crea un rótulo (`201`) |
| `GET` | `/api/rotulos/:id` | Sí | Obtiene un rótulo propio |
| `PUT` | `/api/rotulos/:id` | Sí | Actualiza un rótulo propio |
| `DELETE` | `/api/rotulos/:id` | Sí | Elimina un rótulo propio |

Body de creación / edición:

```json
{
  "ean": "7401005904011",
  "descripcion": "Arroz blanco 5 lb",
  "precio_oferta": "1.99",
  "precio_unitario": "2.50",
  "copias": "4",
  "fecha_inicio": "2026-09-21",
  "fecha_fin": "2026-09-28"
}
```

### 6.3 Documentos (lógica de negocio central)

| Método | Endpoint | Sesión | Descripción |
|---|---|---|---|
| `POST` | `/api/rotulos/pdf` | Sí | Toma todos los rótulos **pendientes** del usuario (`documento_id IS NULL`), genera el PDF, registra el documento y marca esos rótulos como impresos. Responde `{ url, uuid, documento_id, titulo, rotulos, hojas }` |
| `GET` | `/api/documentos` | Sí | Historial de documentos del usuario |
| `GET` | `/api/documentos/:uuid/pdf` | Sí | Devuelve el PDF (`application/pdf`). Se vuelve a pintar con los mismos rótulos, así no se guarda ningún archivo en disco (Vercel es de solo lectura) |

### 6.4 Administración

| Método | Endpoint | Admin | Descripción |
|---|---|---|---|
| `GET` | `/api/admin` | Sí | Confirma que la sesión es de administrador (`403` si no) |
| `GET` | `/api/admin/rotulos` | Sí | Rótulos de todos los usuarios con nombre, correo y negocio de quien los creó |
| `GET` | `/api/admin/productos` | Sí | Catálogo de productos |
| `POST` | `/api/admin/productos` | Sí | Crea un producto |
| `PUT` | `/api/admin/productos/:id` | Sí | Actualiza un producto |
| `DELETE` | `/api/admin/productos/:id` | Sí | Elimina un producto |

Body de producto: `{ ean, descripcion, precio, imagen }` (`ean` e `imagen` opcionales).

### 6.5 Códigos de respuesta y formato de error

| Código | Cuándo |
|---|---|
| `200` / `201` | Operación correcta / recurso creado |
| `400` | Body inválido o falla de validación: `{ ok: false, error: "mensaje" }` |
| `401` | Sin sesión o token inválido/vencido |
| `403` | Sesión válida pero sin rol `admin` |
| `404` | El rótulo, documento o producto no existe o no pertenece al usuario |
| `409` | Correo ya registrado |
| `500` | Error interno; se registra en el servidor y se responde un mensaje genérico |

Todos los endpoints envuelven el acceso a datos en `try/catch`. En el frontend, Axios lanza excepción en cualquier `4xx/5xx` y la página muestra el mensaje con un toast.

---

## 7. Validación de entradas

**Backend** (`lib/validarRotuloInput.js`, `lib/validarProductoInput.js`, `api/registro`, `api/login`):

- Campos requeridos: EAN, descripción, precio de oferta, precio unitario, copias, fecha inicio y fecha fin.
- EAN y copias: solo dígitos; EAN máximo 14 dígitos.
- Precios: formato `123` o `123.45`, mayores que 0.
- Copias: mayor que 0.
- Fecha fin no puede ser anterior a fecha inicio.
- Descripción máximo 120 caracteres; se normaliza a mayúsculas.
- Correo con formato válido; contraseña mínimo 8 caracteres; correo único (`409`).
- Toda consulta SQL es parametrizada.

**Frontend**: campos `required` y tipos (`number`, `date`, `email`) en los formularios, confirmación de contraseña en el registro, y mensajes de error de la API mostrados con Sonner.

---

## 8. Generación del PDF (lógica de negocio)

1. `POST /api/rotulos/pdf` consulta los rótulos pendientes del usuario.
2. `lib/generarRotulos.js` **expande** cada rótulo según sus `copias` (8 copias = 8 rótulos = 2 hojas), abre `plantillas/plantilla-rotulo.pdf` con **pdf-lib** y coloca 4 rótulos A6 por hoja A4 (2 × 2) con marcas de corte.
3. `lib/pintarRotulo.js` dibuja cada rótulo: descripción (ajusta el tamaño de letra para que quepa), precio de oferta en grande, precio anterior tachado y ahorro calculado, vigencia y código EAN.
4. Se registra el documento en la tabla `documentos` con un `uuid`, se marcan los rótulos con `documento_id` y se responde el enlace `/api/documentos/{uuid}/pdf`.
5. El PDF no se guarda en disco: al descargarlo se vuelve a generar con los mismos rótulos. Esto permite funcionar en Vercel, donde el sistema de archivos es de solo lectura. `next.config.mjs` incluye la carpeta `plantillas/` en las funciones serverless (`outputFileTracingIncludes`).

---

## 9. Modelo de datos (MySQL)

```
usuarios                          rotulos                              documentos
────────────────────────          ─────────────────────────────        ─────────────────────────
id            INT PK AI           id              INT PK AI            id               INT PK AI
nombre        VARCHAR             usuario_id      INT FK → usuarios    uuid             CHAR(36) UNIQUE
apellido      VARCHAR             documento_id    INT FK → documentos  usuario_id       INT FK → usuarios
email         VARCHAR UNIQUE                      (NULL = pendiente)   titulo           VARCHAR
password_hash VARCHAR             ean             VARCHAR(14)          rotulos_por_hoja INT
nombre_negocio VARCHAR            descripcion     VARCHAR(120)         total_rotulos    INT
rol           ENUM('admin','user') precio_oferta  DECIMAL(10,2)        url_pdf          VARCHAR
                                  precio_unitario DECIMAL(10,2)        fecha_creacion   DATETIME
productos                         copias          INT
────────────────────────          fecha_inicio    DATE
id            INT PK AI           fecha_fin       DATE
usuario_id    INT FK → usuarios   fecha_creacion  DATETIME
ean           VARCHAR(14) NULL
descripcion   VARCHAR(120)
precio        DECIMAL(10,2)
imagen        VARCHAR(255) NULL
fecha_creacion DATETIME
```

Relaciones:

- Un **usuario** tiene muchos **rótulos**, muchos **documentos** y (si es admin) muchos **productos**.
- Un **documento** agrupa muchos **rótulos**. Un rótulo con `documento_id = NULL` está pendiente de imprimir; al generar el PDF se vincula al documento.
- **productos** es el catálogo que administra el rol admin.

Script de creación:

```sql
CREATE TABLE usuarios (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(60)  NOT NULL,
  apellido       VARCHAR(60),
  email          VARCHAR(120) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  nombre_negocio VARCHAR(120),
  rol            ENUM('admin','user') NOT NULL DEFAULT 'user',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documentos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  uuid             CHAR(36) NOT NULL UNIQUE,
  usuario_id       INT NOT NULL,
  titulo           VARCHAR(120),
  rotulos_por_hoja INT NOT NULL DEFAULT 4,
  total_rotulos    INT NOT NULL,
  url_pdf          VARCHAR(255),
  fecha_creacion   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE rotulos (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT NOT NULL,
  documento_id    INT NULL,
  ean             VARCHAR(14)  NOT NULL,
  descripcion     VARCHAR(120) NOT NULL,
  precio_oferta   DECIMAL(10,2) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  copias          INT NOT NULL DEFAULT 1,
  fecha_inicio    DATE NOT NULL,
  fecha_fin       DATE NOT NULL,
  fecha_creacion  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id)   REFERENCES usuarios(id),
  FOREIGN KEY (documento_id) REFERENCES documentos(id)
);

CREATE TABLE productos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT NOT NULL,
  ean            VARCHAR(14),
  descripcion    VARCHAR(120) NOT NULL,
  precio         DECIMAL(10,2) NOT NULL,
  imagen         VARCHAR(255),
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

> **[VERIFICAR]** Este script está reconstruido a partir de las consultas del código. Para dejar el esquema exacto: `mysqldump -h HOST -u USUARIO -p --no-data rotula > database/schema.sql` y reemplazar este bloque.

---

## 10. Cumplimiento de los requerimientos

### Requerimientos funcionales mínimos

| # | Requerimiento | Implementación | Dónde verlo |
|---|---|---|---|
| 1 | Autenticación (registro, login, rutas protegidas por rol) | Registro y login con JWT en cookie httpOnly; `proxy.js` protege `/home/*`; zona `/home/admin` y `/api/admin/**` solo para rol `admin` | `/registro`, `/login`, `proxy.js`, `lib/auth.js`, `lib/admin.js` |
| 2 | Gestión principal (crear, listar, actualizar, eliminar) | CRUD de rótulos por usuario y CRUD de productos por admin | `/home/crear-afiches`, `/home/admin/productos`, `app/api/rotulos/**`, `app/api/admin/productos/**` |
| 3 | Lógica de negocio central | Generación del PDF con pdf-lib: expansión por copias, 4 por hoja, marcas de corte, cálculo de ahorro, registro del documento y vinculación de rótulos | `lib/generarRotulos.js`, `lib/pintarRotulo.js`, `app/api/rotulos/pdf/route.js` |
| 4 | Dashboard / vista resumen | Ofertas activas, ofertas que vencen esta semana, rótulos usados del mes, últimos 3 documentos | `/home` |
| 5 | Actualización dinámica de datos | Tras crear, editar, borrar o generar el PDF, la lista se vuelve a cargar desde la API y la UI se actualiza sin recargar la página | `app/home/crear-afiches/page.jsx` (`cargarRotulos()`) |

### Requerimientos técnicos

| Requerimiento | Cumplimiento |
|---|---|
| React + Next.js | Next.js 16 App Router + React 19 |
| Separación de capas UI / lógica / datos | UI en `app/` y `components/`, lógica en `lib/`, datos en `app/api/` + `lib/db.js` (sección 4) |
| Módulos de la propuesta de Etapa 1 | Autenticación, rótulos, generación de documentos, historial, dashboard, administración |
| Integración con API REST | Backend propio con Route Handlers de Next.js y MySQL |
| Interfaz responsiva | Tailwind CSS 4 con breakpoints `sm / lg` en todas las vistas |
| Autenticación con registro, login y rutas protegidas | JWT + cookie httpOnly + `proxy.js` |
| Mínimo 2 roles con permisos diferenciados | `user` y `admin` (sección 5.2) |
| Validación de entradas y manejo de errores | Sección 7 y 6.5 |
| Repositorio GitHub, rama por alumno, colaboradores | Sección 1 y 12 |
| Despliegue en Vercel con enlace público | Encabezado |

---

## 11. Instalación y ejecución local

### Requisitos

- Node.js 20 o superior (desarrollado con Node 22)
- MySQL 8 (local o remoto)
- Git

### Pasos

```bash
# 1. Clonar
git clone https://github.com/Slincker5/rotula.git
cd rotula

# 2. Dependencias
npm install

# 3. Base de datos: ejecutar el script de la sección 9 en MySQL
#    y crear al menos un usuario con rol 'admin' (o cambiarlo con UPDATE)

# 4. Variables de entorno
#    Crear .env.local en la raíz con el contenido de abajo

# 5. Correr
npm run dev
# http://localhost:3000
```

### Variables de entorno (`.env.local`)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=rotula
DB_PASSWORD=tu_password
DB_NAME=rotula
JWT_SECRET=una_cadena_larga_y_aleatoria_de_al_menos_32_caracteres
```

| Variable | Descripción |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión a MySQL (pool de 10 conexiones) |
| `JWT_SECRET` | Clave con la que se firman y verifican los tokens |

### Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | **[COMPLETAR]** | **[COMPLETAR]** |
| Usuario | **[COMPLETAR]** | **[COMPLETAR]** |

Para convertir un usuario en administrador: `UPDATE usuarios SET rol = 'admin' WHERE email = 'correo@ejemplo.com';`

### Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm start` | Servir la compilación |
| `npm run lint` | ESLint |

---

## 12. Despliegue en Vercel

1. Importar el repositorio en https://vercel.com/new (detecta Next.js automáticamente).
2. En **Settings → Environment Variables** cargar las mismas variables de `.env.local`, apuntando a una base de datos MySQL accesible desde internet.
3. Deploy. Cada push a `main` genera un despliegue automático.
4. Las rutas que generan PDF declaran `runtime = "nodejs"` y `next.config.mjs` incluye `plantillas/**` en el empaquetado de las funciones para que la plantilla exista en el servidor.

URL pública: https://**[COMPLETAR]**.vercel.app

---

## 13. Flujo de trabajo con Git

- `main`: rama estable; es la que despliega Vercel.
- `dev`: rama de integración donde se prueban los cambios de todos antes de pasar a `main`.
- Ramas por integrante: `vladi-parte`, `ariel-parte`, `feature/home`, `feature/rol-admin-ariel`, **[COMPLETAR otras]**.
- Integración por **Pull Request** (13 PR al momento de la entrega), revisado por otro integrante.
- Convención de commits: `frontend: ...` / `backend: ...` seguido de la descripción.

```bash
git checkout -b feature/tu-nombre
git add .
git commit -m "frontend: se agrega validacion al formulario de rotulos"
git push -u origin feature/tu-nombre
# Abrir Pull Request hacia dev
```


## 14. Próximos pasos (Etapa 3)

- Versión móvil en **React Native** reutilizando esta misma API REST.
- Escáner de código de barras con la cámara para armar el lote de rótulos.
- Búsqueda de producto por EAN en el catálogo para autocompletar el rótulo.

---

Proyecto académico desarrollado para la asignatura DPS941 de la Universidad Don Bosco. Uso educativo.
