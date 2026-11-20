"use client";
// Sesion con Firebase Authentication: guarda el usuario que inicio sesion
// y lo comparte con todas las paginas (Menu, login, registro, /home).
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { conErrores } from "@/lib/errores";
import { guardarPerfil, obtenerPerfil } from "@/lib/usuarios";

const SesionContexto = createContext(null);

export function ProveedorSesion({ children }) {
  const [usuario, setUsuario] = useState(null);
  // mientras Firebase revisa si ya habia una sesion abierta no se redirige a ningun lado
  const [revisando, setRevisando] = useState(true);
  // datos del formulario de registro, para crear el perfil apenas exista la cuenta
  const datosRegistro = useRef(null);

  // Firebase avisa aqui cada vez que cambia la sesion, tambien al abrir la pagina
  useEffect(
    () =>
      onAuthStateChanged(auth, async (usuarioAuth) => {
        if (!usuarioAuth) {
          setUsuario(null);
          setRevisando(false);
          return;
        }

        let perfil;
        try {
          perfil = await obtenerPerfil(usuarioAuth, datosRegistro.current);
          datosRegistro.current = null;
        } catch (error) {
          // sin perfil igual se puede entrar: cada pagina avisara si Firestore no responde
          console.warn("[perfil]", error?.code ?? error);
          perfil = {
            id: usuarioAuth.uid,
            nombre: usuarioAuth.displayName ?? "",
            apellido: "",
            nombre_negocio: "",
            email: usuarioAuth.email,
          };
        }

        if (auth.currentUser?.uid === usuarioAuth.uid) setUsuario(perfil);
        setRevisando(false);
      }),
    [],
  );

  const iniciarSesion = (correo, clave) =>
    conErrores(() => signInWithEmailAndPassword(auth, correo.trim().toLowerCase(), clave));

  const registrar = ({ nombre, apellido, negocio, correo, clave }) => {
    datosRegistro.current = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      nombre_negocio: negocio.trim(),
    };
    return conErrores(() =>
      createUserWithEmailAndPassword(auth, correo.trim().toLowerCase(), clave),
    ).catch((error) => {
      datosRegistro.current = null;
      throw error;
    });
  };

  // En la web Google abre una ventana emergente; si el usuario la cierra no se hace nada
  const entrarConGoogle = () =>
    conErrores(async () => {
      const proveedor = new GoogleAuthProvider();
      proveedor.setCustomParameters({ prompt: "select_account" });
      try {
        await signInWithPopup(auth, proveedor);
      } catch (error) {
        if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") return;
        throw error;
      }
    });

  const actualizarPerfil = async ({ nombre, apellido, negocio }) => {
    const cambios = { nombre: nombre.trim(), apellido: apellido.trim(), nombre_negocio: negocio.trim() };
    await conErrores(() => guardarPerfil(usuario.id, cambios));
    setUsuario((actual) => ({ ...actual, ...cambios }));
  };

  const cerrarSesion = () => conErrores(() => signOut(auth));

  return (
    <SesionContexto.Provider
      value={{ usuario, revisando, iniciarSesion, registrar, entrarConGoogle, actualizarPerfil, cerrarSesion }}
    >
      {children}
    </SesionContexto.Provider>
  );
}

export const useSesion = () => useContext(SesionContexto);
