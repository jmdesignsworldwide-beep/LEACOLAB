import { redirect } from "next/navigation";

// "Protocolos" se reemplazó por "Servicios". Cualquier slug antiguo redirige
// al menú de servicios.
export default function ProtocoloSlugRedirect() {
  redirect("/servicios");
}
