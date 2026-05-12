import { useState, useEffect } from "react";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ArrowRightLeft, Search, Eye, Calendar } from "lucide-react";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useLanguage } from "../../LanguageContext";

export function AdminExchanges() {
  const { t } = useLanguage();
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSwap, setSelectedSwap] = useState<any>(null);

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/echanges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSwaps(data.data || []);
    } catch (error) {
      console.error("Error fetching swaps:", error);
      toast.error(t('common.error_loading'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t('common.pending', { defaultValue: 'En attente' })}</Badge>;
      case "valide": return <Badge className="bg-green-600">{t('common.validated', { defaultValue: 'Validé' })}</Badge>;
      case "termine": return <Badge variant="secondary" className="bg-blue-600 text-white">{t('common.finished', { defaultValue: 'Terminé' })}</Badge>;
      case "refuse": return <Badge variant="destructive">{t('common.refused', { defaultValue: 'Refusé' })}</Badge>;
      case "annule": return <Badge variant="outline" className="text-neutral-400">{t('common.cancelled', { defaultValue: 'Annulé' })}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSwaps = swaps.filter(swap => 
    swap.demandeur?.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    swap.destinataire?.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    swap.objet1?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    swap.objet2?.titre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('admin_exchanges.title')}</h1>
          <p className="text-neutral-600">{t('admin_exchanges.subtitle')}</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input 
            placeholder={t('admin_exchanges.search_placeholder')} 
            className="pl-10 h-11 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-neutral-50/50">
                <th className="px-6 py-4 text-left font-semibold text-neutral-600">{t('admin_exchanges.table_id')}</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600">{t('admin_exchanges.table_participants')}</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600">{t('admin_exchanges.table_items')}</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600">{t('admin_exchanges.table_status')}</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-600">{t('admin_exchanges.table_date')}</th>
                <th className="px-6 py-4 text-center font-semibold text-neutral-600">{t('admin_exchanges.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400 italic">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : filteredSwaps.length > 0 ? (
                filteredSwaps.map((swap) => (
                  <tr key={swap.id_echange} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-neutral-400">#{swap.id_echange}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                          <Avatar className="h-8 w-8 border-2 border-white ring-2 ring-neutral-100">
                            <AvatarImage src={getStorageUrl(swap.demandeur?.photo_profil)} />
                            <AvatarFallback>{swap.demandeur?.nom_complet?.[0]}</AvatarFallback>
                          </Avatar>
                          <Avatar className="h-8 w-8 border-2 border-white ring-2 ring-neutral-100">
                            <AvatarImage src={getStorageUrl(swap.destinataire?.photo_profil)} />
                            <AvatarFallback>{swap.destinataire?.nom_complet?.[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex flex-col text-[11px] leading-tight max-w-[120px]">
                          <span className="font-bold text-neutral-800 truncate">{swap.demandeur?.nom_complet}</span>
                          <span className="text-neutral-400 font-medium">et {swap.destinataire?.nom_complet}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-olive font-medium truncate max-w-[120px]">{swap.objet1?.titre}</span>
                        <ArrowRightLeft className="h-3 w-3 text-neutral-300" />
                        <span className="font-medium truncate max-w-[120px]">{swap.objet2?.titre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(swap.statut)}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {new Date(swap.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 border-olive/20 text-olive hover:bg-olive/10 hover:border-olive/40 active:scale-95 transition-all duration-200"
                        onClick={() => setSelectedSwap(swap)}
                      >
                        <Eye className="h-4 w-4" />
                        {t('common.details', { defaultValue: 'Détails' })}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    {t('admin_exchanges.no_results')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedSwap} onOpenChange={() => setSelectedSwap(null)}>
        <DialogContent className="sm:max-w-xl overflow-hidden p-0 border-none [&>button]:text-white">
          <DialogHeader className="p-4 bg-neutral-900 text-white">
            <DialogTitle className="flex items-center gap-2 text-lg font-medium">
              <ArrowRightLeft className="h-5 w-5 text-olive" />
              {t('admin_exchanges.modal_title')} #{selectedSwap?.id_echange}
            </DialogTitle>
          </DialogHeader>

          <div className="p-5 space-y-6">
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-neutral-100 shadow-md">
                <ArrowRightLeft className="h-4 w-4 text-olive" />
              </div>

              <div className="space-y-2">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-neutral-100">
                  <img 
                    src={getStorageUrl(selectedSwap?.objet1?.image)} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-sm truncate">{selectedSwap?.objet1?.titre}</h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">{t('admin_exchanges.sender')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-neutral-100">
                  <img 
                    src={getStorageUrl(selectedSwap?.objet2?.image)} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-sm truncate">{selectedSwap?.objet2?.titre}</h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">{t('admin_exchanges.receiver')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-4 border border-neutral-100">
               <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-white shadow-sm">
                    <AvatarImage src={getStorageUrl(selectedSwap?.demandeur?.photo_profil)} />
                    <AvatarFallback>{selectedSwap?.demandeur?.nom_complet?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{t('admin_exchanges.sender')}</p>
                    <p className="font-bold text-xs">{selectedSwap?.demandeur?.nom_complet}</p>
                    <p className="text-[10px] text-neutral-400">{selectedSwap?.demandeur?.email}</p>
                  </div>
               </div>

               <div className="flex items-center gap-3 text-right">
                  <div className="leading-tight">
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{t('admin_exchanges.receiver')}</p>
                    <p className="font-bold text-xs">{selectedSwap?.destinataire?.nom_complet}</p>
                    <p className="text-[10px] text-neutral-400">{selectedSwap?.destinataire?.email}</p>
                  </div>
                  <Avatar className="h-9 w-9 border border-white shadow-sm">
                    <AvatarImage src={getStorageUrl(selectedSwap?.destinataire?.photo_profil)} />
                    <AvatarFallback>{selectedSwap?.destinataire?.nom_complet?.[0]}</AvatarFallback>
                  </Avatar>
               </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4 text-[11px]">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-neutral-500">{new Date(selectedSwap?.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getStatusBadge(selectedSwap?.statut)}
                  </div>
               </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
