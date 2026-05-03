import logoImage from './logo.png';

export function Footer() {
  return (
    <footer className="border-t border-border bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="SwapMarket" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Échangez en toute confiance. Échangez des objets directement avec votre communauté.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Marché</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Explorer les objets</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Catégories</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Confiance et Sécurité</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Communauté</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">À propos de nous</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Témoignages</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Centre d'aide</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Règles de la communauté</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 SwapMarket. Bâti sur la confiance, propulsé par la communauté.
          </p>
        </div>
      </div>
    </footer>
  );
}
