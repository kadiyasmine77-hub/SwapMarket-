import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { API_BASE_URL, getStorageUrl } from '../config';


import { ItemCard } from '../components/ItemCard';

function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/objets?per_page=3`)
      .then((res) => res.json())
      .then((data) => {
        const items = data.data || data;
        const mappedItems = items.map((obj) => {
          const conditionMap = {
            neuf: 'Neuf',
            bon: 'Comme neuf',
            moyen: 'Bon état',
            mauvais: 'État correct',
          };
          return {
            id: String(obj.id_objet),
            title: obj.titre,
            category: obj.categorie?.nom || 'Autre',
            condition: conditionMap[obj.etat] || 'Bon état',
            location: obj.user?.ville || 'Casablanca',
            postedDate: new Date(obj.created_at).toLocaleDateString(),
            imageUrl: getStorageUrl(obj.image) || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
            ownerName: obj.user?.nom_complet || 'Utilisateur',
            ownerTrustScore: obj.user?.avg_rating || 0,
            isVerified: obj.user?.is_verifie === 1,
            disponibilite: obj.disponibilite,
          };
        });
        setFeaturedItems(mappedItems.slice(0, 3));
      })
      .catch((err) => console.error('Error fetching items:', err));
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />

      <main>
        <section className="relative overflow-hidden border-b border-border bg-primary text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(181,166,66,0.22),transparent_28%)]" />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 sm:px-6 lg:items-center lg:px-8 lg:py-28">
            <div className="max-w-3xl flex-1 text-center mx-auto">
              <h1
                className="mb-6 text-5xl font-semibold leading-tight sm:text-6xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Échangez des objets utiles sans perdre de valeur
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-white/85 sm:text-xl">
                SwapMarket aide les gens à échanger des objets localement, à réduire l'encombrement et à instaurer la confiance grâce à des échanges transparents.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-primary transition hover:bg-white/90"
                >
                  Créer un compte
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-3 text-base font-medium text-white transition hover:bg-white/10"
                >
                  Se connecter
                </Link>
              </div>
            </div>


          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Annonces à la une
              </p>
              <h2
                className="mt-2 text-3xl font-semibold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Découvrez ce que la communauté échange
              </h2>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-olive transition hover:text-olive/80"
            >
              Explorer après connexion
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
        </section>

        <section className="bg-accent">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-3xl font-semibold">50K+</p>
              <p className="mt-2 text-sm text-muted-foreground">Membres de la communauté sur la plateforme</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-3xl font-semibold">120K+</p>
              <p className="mt-2 text-sm text-muted-foreground">Objets échangés via des trocs de confiance</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-3xl font-semibold">4.9/5</p>
              <p className="mt-2 text-sm text-muted-foreground">Satisfaction moyenne des troqueurs actifs</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
