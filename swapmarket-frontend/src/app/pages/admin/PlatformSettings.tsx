import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Settings, Mail, Shield, Database, Globe, Bell } from "lucide-react";
import { toast } from "sonner";

export function PlatformSettings() {
  const [settings, setSettings] = useState({
    siteName: "TrocPlateforme",
    siteDescription: "Plateforme d'échange d'objets entre particuliers",
    contactEmail: "contact@trocplateforme.com",
    maxPhotosPerItem: "5",
    autoApproveItems: false,
    emailNotifications: true,
    maintenanceMode: false,
    registrationOpen: true,
  });

  const handleSave = (section: string) => {
    toast.success(`Paramètres ${section} sauvegardés`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Paramètres de la plateforme</h1>
        <p className="text-neutral-600">Configurez les paramètres généraux</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Informations générales</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nom de la plateforme</Label>
                <Input
                  id="site-name"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-desc">Description</Label>
                <Textarea
                  id="site-desc"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email de contact</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>
              <Button onClick={() => handleSave("généraux")}>Enregistrer</Button>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Paramètres des annonces</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-photos">Nombre maximum de photos par annonce</Label>
                <Input
                  id="max-photos"
                  type="number"
                  value={settings.maxPhotosPerItem}
                  onChange={(e) => setSettings({ ...settings, maxPhotosPerItem: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Approbation automatique</p>
                  <p className="text-sm text-neutral-600">
                    Les nouvelles annonces sont publiées sans modération
                  </p>
                </div>
                <Switch
                  checked={settings.autoApproveItems}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoApproveItems: checked })
                  }
                />
              </div>
              <Button onClick={() => handleSave("des annonces")}>Enregistrer</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Configuration SMTP</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Hôte SMTP</Label>
                <Input id="smtp-host" placeholder="smtp.example.com" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input id="smtp-port" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Utilisateur</Label>
                  <Input id="smtp-user" placeholder="noreply@trocplateforme.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Mot de passe</Label>
                <Input id="smtp-password" type="password" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSave("SMTP")}>Enregistrer</Button>
                <Button variant="outline">Tester la connexion</Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Modèles d'email</h2>
            <div className="space-y-3">
              {[
                "Email de bienvenue",
                "Confirmation d'échange",
                "Notification de message",
                "Rappel d'évaluation",
              ].map((template, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border p-4">
                  <span className="font-medium">{template}</span>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Paramètres de sécurité</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Mode maintenance</p>
                  <p className="text-sm text-neutral-600">
                    Rendre la plateforme inaccessible temporairement
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Inscriptions ouvertes</p>
                  <p className="text-sm text-neutral-600">
                    Autoriser les nouvelles inscriptions
                  </p>
                </div>
                <Switch
                  checked={settings.registrationOpen}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, registrationOpen: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Durée de session (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-login">Tentatives de connexion max</Label>
                <Input id="max-login" type="number" defaultValue="5" />
              </div>
              <Button onClick={() => handleSave("de sécurité")}>Enregistrer</Button>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Journalisation</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Logs d'activité admin</p>
                  <p className="text-sm text-neutral-600">
                    Enregistrer toutes les actions administratives
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Logs de connexion</p>
                  <p className="text-sm text-neutral-600">
                    Enregistrer toutes les tentatives de connexion
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="log-retention">Durée de rétention des logs (jours)</Label>
                <Input id="log-retention" type="number" defaultValue="90" />
              </div>
              <Button onClick={() => handleSave("de journalisation")}>Enregistrer</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Notifications système</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-neutral-600">
                    Activer les notifications par email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Alertes admin</p>
                  <p className="text-sm text-neutral-600">
                    Recevoir les alertes importantes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rapports hebdomadaires</p>
                  <p className="text-sm text-neutral-600">
                    Rapport d'activité chaque lundi
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={() => handleSave("de notification")}>Enregistrer</Button>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Types de notifications utilisateur</h2>
            <div className="space-y-3">
              {[
                { label: "Nouveau message", enabled: true },
                { label: "Proposition d'échange", enabled: true },
                { label: "Échange accepté", enabled: true },
                { label: "Rappel d'évaluation", enabled: true },
                { label: "Annonce favori disponible", enabled: false },
              ].map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{notif.label}</span>
                  <Switch defaultChecked={notif.enabled} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
