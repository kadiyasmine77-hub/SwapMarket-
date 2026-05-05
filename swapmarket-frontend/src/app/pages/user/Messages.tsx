import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Send, MessageSquare, Paperclip, ChevronLeft } from "lucide-react";
import { API_BASE_URL, getStorageUrl } from "../../config";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { ArrowRightLeft } from "lucide-react";
import { useLanguage } from "../../LanguageContext";

export function Messages() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const echangeIdFromUrl = searchParams.get("echange_id");

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id_echange);
    }
  }, [selectedChat]);

  // Handle initial selection from URL
  useEffect(() => {
    if (echangeIdFromUrl && conversations.length > 0) {
      const chat = conversations.find(c => c.id_echange.toString() === echangeIdFromUrl);
      if (chat) setSelectedChat(chat);
    }
  }, [echangeIdFromUrl, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/echanges`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error(t('auth.error_server'));
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (echangeId: number) => {
    setLoadingMessages(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/echanges/${echangeId}/messages`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !selectedChat || isSending) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/echanges/${selectedChat.id_echange}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ contenu: messageText })
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages([...messages, newMessage]);
        setMessageText("");
      } else {
        const errorData = await response.json();
        if (selectedChat.statut === 'refuse') {
          toast.error(t('messages_page.input_disabled'));
        } else {
          toast.error(errorData.message || t('auth.error_server'));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t('auth.error_server'));
    } finally {
      setIsSending(false);
    }
  };

  const getOtherUser = (conv: any) => {
    return conv.id_demandeur === currentUser?.id_user ? conv.destinataire : conv.demandeur;
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="mb-2 text-3xl font-bold">{t('messages_page.title')}</h1>
        <p className="text-neutral-600">{t('messages_page.desc')}</p>
      </div>

      <div className="flex-1 flex overflow-hidden rounded-xl border bg-white shadow-sm relative">
        {/* Conversations List */}
        <div className={`w-full md:w-[320px] lg:w-[350px] shrink-0 border-r flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="border-b p-4 bg-neutral-50/50">
            <Input placeholder={t('messages_page.search')} className="bg-white" />
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <p className="p-8 text-center text-sm text-neutral-500 italic">{t('common.loading')}</p>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => {
                const other = getOtherUser(conv);
                const isActive = selectedChat?.id_echange === conv.id_echange;
                return (
                  <button
                    key={conv.id_echange}
                    onClick={() => setSelectedChat(conv)}
                    className={`flex w-full items-start gap-3 border-b p-4 text-left transition-colors hover:bg-neutral-50 ${
                      isActive ? "bg-olive/10 border-l-4 border-l-olive" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={getStorageUrl(other?.photo_profil) || undefined} />
                      <AvatarFallback>{other?.nom_complet?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">{other?.nom_complet || t('common.user')}</p>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(conv.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="truncate text-xs text-neutral-600 mt-0.5">
                        {conv.objet1?.titre} ↔ {conv.objet2?.titre}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
                <p className="text-sm text-neutral-500">{t('messages_page.no_conv')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col bg-neutral-50/20 w-full ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b p-4 bg-white shadow-sm z-10">
                <Button variant="ghost" size="icon" className="md:hidden shrink-0 -ml-2" onClick={() => setSelectedChat(null)}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Avatar className="border">
                <AvatarImage src={getStorageUrl(getOtherUser(selectedChat)?.photo_profil) || undefined} />
                <AvatarFallback>{getOtherUser(selectedChat)?.nom_complet?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-bold">{getOtherUser(selectedChat)?.nom_complet || t('common.user')}</p>
                <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${
                      selectedChat.statut === 'refuse' ? 'bg-red-500' : 
                      selectedChat.statut === 'en_attente' ? 'bg-yellow-500' : 
                      selectedChat.statut === 'termine' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}></span>
                    <p className="text-xs font-medium text-neutral-500">
                      {selectedChat.statut === 'refuse' ? t('messages_page.status_refused') : 
                       selectedChat.statut === 'en_attente' ? t('messages_page.status_pending') : 
                       selectedChat.statut === 'termine' ? t('messages_page.status_completed') :
                       t('messages_page.status_ongoing')}
                    </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => setShowDetailsDialog(true)}>
                    {t('messages_page.details')}
                </Button>
              </div>
            </div>

            {/* Exchange Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{t('messages_page.details_title')}</DialogTitle>
                  <DialogDescription>
                    {t('messages_page.details_desc')}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-6">
                  {/* Item 1 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl border bg-neutral-50/50">
                    <div className="h-20 w-20 rounded-lg border overflow-hidden bg-white shrink-0">
                      {selectedChat.objet1?.image ? (
                        <img src={getStorageUrl(selectedChat.objet1.image)!} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300"><MessageSquare className="h-8 w-8" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base truncate">{selectedChat.objet1?.titre}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {selectedChat.id_demandeur === currentUser?.id_user ? t('messages_page.your_item') : t('messages_page.their_item')}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-white p-2 rounded-full border shadow-sm">
                      <ArrowRightLeft className="h-5 w-5 text-neutral-400" />
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl border bg-neutral-50/50">
                    <div className="h-20 w-20 rounded-lg border overflow-hidden bg-white shrink-0">
                      {selectedChat.objet2?.image ? (
                        <img src={getStorageUrl(selectedChat.objet2.image)!} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300"><MessageSquare className="h-8 w-8" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base truncate">{selectedChat.objet2?.titre}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {selectedChat.id_destinataire === currentUser?.id_user ? t('messages_page.your_item') : t('messages_page.their_item')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg text-sm space-y-2">
                   <div className="flex justify-between">
                     <span className="text-neutral-500">{t('admin.status')}:</span>
                     <span className="font-medium capitalize">{selectedChat.statut.replace('_', ' ')}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-neutral-500">{t('messages_page.request_date')}:</span>
                     <span className="font-medium">{new Date(selectedChat.created_at).toLocaleDateString()}</span>
                   </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 flex flex-col">
              {loadingMessages ? (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-neutral-400">{t('messages_page.loading_msg')}</p>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.id_expediteur === currentUser?.id_user;
                  return (
                    <div
                      key={msg.id_message}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                          isMe
                            ? "bg-black text-white rounded-br-none"
                            : "bg-white text-neutral-900 border rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.contenu}</p>
                        <span
                          className={`mt-1 block text-[10px] ${
                            isMe ? "text-white/70" : "text-neutral-500"
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="bg-neutral-100 p-4 rounded-full mb-3">
                        <MessageSquare className="h-8 w-8 text-neutral-400" />
                    </div>
                    <p className="text-neutral-500 text-sm">{t('messages_page.first_msg')}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-white">
              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-600">
                    <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder={selectedChat.statut === 'refuse' ? t('messages_page.input_disabled') : t('messages_page.input_placeholder')}
                  className="bg-neutral-50 border-none focus-visible:ring-1 focus-visible:ring-neutral-200"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  disabled={isSending || selectedChat.statut === 'refuse' || selectedChat.statut === 'termine'}
                />
                <Button 
                    onClick={handleSend} 
                    size="icon" 
                    className="bg-black text-white hover:bg-black/90 shrink-0"
                    disabled={!messageText.trim() || isSending || selectedChat.statut === 'refuse' || selectedChat.statut === 'termine'}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                  <MessageSquare className="h-12 w-12 text-neutral-200" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{t('messages_page.select_conv_title')}</h3>
              <p className="text-neutral-500 max-w-xs mx-auto">
                {t('messages_page.select_conv_desc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
