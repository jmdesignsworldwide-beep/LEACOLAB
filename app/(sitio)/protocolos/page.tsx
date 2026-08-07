import { redirect } from "next/navigation";

// "Protocolos" se reemplazó por "Servicios". Se conserva la ruta para no
// romper enlaces viejos.
export default function ProtocolosRedirect() {
  redirect("/servicios");
}
