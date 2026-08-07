import { redirect } from "next/navigation";

// La sección se renombró a "Galería". Se conserva la ruta antigua para no
// romper enlaces viejos (Instagram, Setmore).
export default function TransformacionesRedirect() {
  redirect("/galeria");
}
