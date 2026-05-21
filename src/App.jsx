import React, { useState } from 'react';
import { Sparkles, FileText, Settings, Heart, ArrowRight, Quote, Plus, Share, Trash2, Search } from 'lucide-react';

const initialQuotes = [
  { id: 1, text: "El único modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs", category: "Trabajo", isFavorite: false },
  { id: 2, text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali", category: "Vida", isFavorite: true },
  { id: 3, text: "La inspiración existe, pero tiene que encontrarte trabajando.", author: "Pablo Picasso", category: "Creatividad", isFavorite: false },
  { id: 4, text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", author: "Robert Collier", category: "Éxito", isFavorite: false },
  { id: 5, text: "Tu tiempo es limitado, no lo malgastes viviendo la vida de otro.", author: "Steve Jobs", category: "Inspiración", isFavorite: true }
];

export default function App() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [activeTab, setActiveTab] = useState('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Estados de la pestaña Inicio (Home)
  const [currentQuote, setCurrentQuote] = useState(initialQuotes[0]);
  const [animateCard, setAnimateCard] = useState(true);

  // Estados de la pestaña Lista de frases
  const [searchQuery, setSearchQuery] = useState("");

  const showNextRandomQuote = () => {
    if (quotes.length === 0) return;
    
    setAnimateCard(false);
    setTimeout(() => {
      let nextQuote;
      if (quotes.length === 1) {
        nextQuote = quotes[0];
      } else {
        do {
          nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
        } while (nextQuote.id === currentQuote?.id);
      }
      setCurrentQuote(nextQuote);
      setAnimateCard(true);
    }, 200);
  };

  const handleAddQuote = (newQuote) => {
    const quote = {
      ...newQuote,
      id: Date.now(),
      isFavorite: false
    };
    const updatedQuotes = [quote, ...quotes];
    setQuotes(updatedQuotes);
    setIsAddModalOpen(false);
    
    if (quotes.length === 0) {
      setCurrentQuote(quote);
    }
  };

  const toggleFavorite = (id) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));
    if (currentQuote?.id === id) {
      setCurrentQuote({ ...currentQuote, isFavorite: !currentQuote.isFavorite });
    }
  };

  const deleteQuote = (id) => {
    const updatedQuotes = quotes.filter(q => q.id !== id);
    setQuotes(updatedQuotes);
    if (currentQuote?.id === id) {
      setCurrentQuote(updatedQuotes.length > 0 ? updatedQuotes[0] : null);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-[#F5F5F7] flex flex-col font-sans overflow-hidden">
      
      {/* Zona de protección superior para el Notch / Dynamic Island en iOS */}
      <div className="w-full pt-[env(safe-area-inset-top)] bg-[#F5F5F7]"></div>

      {/* Contenedor de las pestañas */}
      <div className="flex-1 overflow-y-auto pb-24 relative hide-scrollbar">
        {activeTab === 'home' && (
          <HomeTab 
            quote={currentQuote} 
            onNext={showNextRandomQuote} 
            animateCard={animateCard}
            onToggleFavorite={() => currentQuote && toggleFavorite(currentQuote.id)}
          />
        )}
        {activeTab === 'list' && (
          <ListTab 
            quotes={quotes} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteQuote}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        )}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      {/* Barra de Navegación Inferior Estilo iOS */}
      <div className="absolute bottom-0 w-full pb-[env(safe-area-inset-bottom)] bg-white/80 backdrop-blur-md border-t border-gray-200 z-40">
        <div className="flex justify-around items-start pt-3 pb-2 px-6 h-16">
          <NavItem icon={<Sparkles />} label="Inspiración" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<FileText />} label="Mis Frases" active={activeTab === 'list'} onClick={() => setActiveTab('list')} />
          <NavItem icon={<Settings />} label="Ajustes" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </div>

      {/* Formulario Modal Emergente (.sheet de SwiftUI) */}
      {isAddModalOpen && (
        <AddModal onClose={() => setIsAddModalOpen(false)} onSave={handleAddQuote} />
      )}
    </div>
  );
}

// --- VISTA: INICIO / INSPIRACIÓN ---
function HomeTab({ quote, onNext, animateCard, onToggleFavorite }) {
  return (
    <div className="min-h-full flex flex-col pt-4 px-6 pb-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Frase del Día</h1>
        {quote && (
          <button className="p-2 text-orange-500 bg-orange-100 rounded-full hover:bg-orange-200 transition active:scale-90">
            <Share size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center relative">
        {quote ? (
          <div 
            className={`bg-white rounded-[32px] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out transform ${animateCard ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
          >
            <Quote className="text-orange-200 w-10 h-10 mb-4" />
            <p className="text-2xl sm:text-3xl font-serif font-semibold text-gray-800 leading-snug mb-8">
              "{quote.text}"
            </p>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-gray-500 font-medium">{quote.author || "Anónimo"}</p>
                {quote.category && (
                  <span className="inline-block mt-2 px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {quote.category}
                  </span>
                )}
              </div>
              <button 
                onClick={onToggleFavorite}
                className={`p-3 rounded-full transition-colors active:scale-90 ${quote.isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-400'}`}
              >
                <Heart size={24} className={quote.isFavorite ? "fill-current" : ""} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 h-64">
            <Sparkles size={48} className="opacity-50 mb-4" />
            <p>No hay frases disponibles.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center pb-6">
        <button 
          onClick={onNext}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 px-8 py-4 rounded-full shadow-lg text-gray-800 font-semibold active:scale-95 transition-all"
        >
          <span>Siguiente Frase</span>
          <ArrowRight size={20} className="text-orange-500" />
        </button>
      </div>
    </div>
  );
}

// --- VISTA: LISTADO / GESTIÓN ---
function ListTab({ quotes, searchQuery, setSearchQuery, onToggleFavorite, onDelete, onAddClick }) {
  const filteredQuotes = quotes.filter(q => 
    q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (q.author && q.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-full flex flex-col pt-4 bg-[#F5F5F7]">
      <div className="px-6 flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mis Frases</h1>
        <button onClick={onAddClick} className="p-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 active:scale-95 transition">
          <Plus size={24} />
        </button>
      </div>

      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar frase o autor..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-200/80 rounded-xl py-2.5 pl-10 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 px-6 pb-12 flex flex-col gap-4">
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map(quote => (
            <div key={quote.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <p className="text-gray-800 font-serif leading-relaxed">"{quote.text}"</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-500 font-medium">{quote.author || "Anónimo"}</span>
                <div className="flex items-center gap-4">
                  {quote.isFavorite && <Heart size={16} className="fill-red-500 text-red-500" />}
                  <button onClick={() => onDelete(quote.id)} className="text-gray-300 hover:text-red-500 active:scale-90 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center px-8">
             <Quote size={40} className="opacity-30 mb-4" />
             <p className="text-sm">No se encontraron frases.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- VISTA: AJUSTES ---
function SettingsTab() {
  return (
    <div className="min-h-full flex flex-col pt-4 px-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Ajustes</h1>
      
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <span className="text-gray-800 font-medium">Notificaciones Diarias</span>
          <div className="w-12 h-7 bg-green-500 rounded-full relative shadow-inner">
             <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow"></div>
          </div>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-gray-800 font-medium">Modo Oscuro</span>
          <span className="text-gray-400 text-sm">Automático</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="px-4 py-3 border-b border-gray-100">
          <span className="text-gray-800 font-medium">Sobre la App</span>
        </div>
        <div className="px-4 py-6 flex flex-col items-center justify-center text-center gap-2">
           <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg mb-2">
              <Sparkles size={32} className="text-white" />
           </div>
           <p className="font-semibold text-gray-800">Motivación Diaria</p>
           <p className="text-xs text-gray-500">Versión 1.0.0<br/>App PWA para iOS</p>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE: ELEMENTO BOTÓN DE NAVEGACIÓN ---
function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 w-16 transition-colors duration-200 ${active ? 'text-orange-500' : 'text-gray-400'}`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
        {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

// --- COMPONENTE: MODAL PARA CREAR FRASES ---
function AddModal({ onClose, onSave }) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  
  const categories = ["Trabajo", "Vida", "Creatividad", "Amor", "Éxito", "Inspiración", "Otro"];

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-[#F5F5F7] w-full h-[90vh] rounded-t-3xl flex flex-col shadow-2xl animate-slide-up">
        
        {/* Encabezado del modal */}
        <div className="flex justify-between items-center px-4 py-4 bg-white rounded-t-3xl border-b border-gray-200 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <button onClick={onClose} className="text-orange-500 text-[17px] px-2 active:opacity-70">Cancelar</button>
          <span className="font-bold text-[17px] text-gray-900">Nueva Frase</span>
          <button 
            onClick={() => onSave({ text, author, category })}
            disabled={!text.trim()} 
            className="text-orange-500 font-bold text-[17px] px-2 disabled:text-gray-300 active:opacity-70"
          >
            Guardar
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 hide-scrollbar pb-[env(safe-area-inset-bottom)]">
          
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
            <div className="px-4 py-2 text-[13px] text-gray-500 bg-gray-50/50">LA FRASE</div>
            <textarea 
              autoFocus
              placeholder="Escribe la frase motivacional aquí..."
              className="w-full p-4 h-32 resize-none focus:outline-none text-gray-800 font-serif leading-relaxed text-[17px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
             <div className="px-4 py-2 text-[13px] text-gray-500 bg-gray-50/50 border-b border-gray-100">DETALLES OPCIONALES</div>
             
             <div className="flex items-center px-4 py-3 border-b border-gray-100">
               <span className="w-24 text-gray-900 text-[17px]">Autor</span>
               <input 
                 type="text" 
                 placeholder="Ej. Steve Jobs"
                 className="flex-1 focus:outline-none text-gray-500 text-[17px] text-right"
                 value={author}
                 onChange={(e) => setAuthor(e.target.value)}
               />
             </div>

             <div className="flex items-center px-4 py-3">
               <span className="w-24 text-gray-900 text-[17px]">Categoría</span>
               <select 
                 className="flex-1 focus:outline-none text-gray-500 text-[17px] bg-transparent appearance-none text-right"
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
                 style={{ direction: 'rtl' }}
               >
                 <option value="" className="text-gray-300">Ninguna</option>
                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}