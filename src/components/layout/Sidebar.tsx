
import { Home, CreditCard, Target, ShoppingCart, TrendingUp, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'transactions', label: 'Lançamentos', icon: TrendingUp },
  { id: 'cards', label: 'Cartões', icon: CreditCard },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'purchases', label: 'Compras', icon: ShoppingCart },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          FinanceApp
        </h1>
        <p className="text-slate-400 text-sm mt-1">Controle Financeiro</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left p-3 h-auto transition-all duration-200",
                currentPage === item.id
                  ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border border-green-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              )}
              onClick={() => {
                onPageChange(item.id);
                setIsOpen(false);
              }}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-3 rounded-lg">
          <p className="text-xs text-slate-400">Versão</p>
          <p className="text-sm font-medium">1.0.0</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
