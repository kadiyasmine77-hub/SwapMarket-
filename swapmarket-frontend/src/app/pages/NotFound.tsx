import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-neutral-200">404</h1>
        <h2 className="mb-2 text-2xl font-bold">Page non trouvée</h2>
        <p className="mb-8 text-neutral-600">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
