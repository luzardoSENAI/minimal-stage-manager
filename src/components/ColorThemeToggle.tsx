
import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ColorThemeToggle: React.FC = () => {
  const { colorTheme, setColorTheme } = useTheme();
  
  const handleSetTheme = (color: 'blue' | 'green' | 'orange') => {
    setColorTheme(color);
    toast.success(`Tema ${getColorName(color)} ativado`);
  };

  const getColorName = (color: string) => {
    switch(color) {
      case 'blue': return 'Azul';
      case 'green': return 'Verde';
      case 'orange': return 'Laranja';
      default: return color;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          title="Mudar cor do tema"
        >
          <Palette className="h-5 w-5" />
          <span className="sr-only">Alternar cor do tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSetTheme('blue')}>
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span>Azul {colorTheme === 'blue' && '✓'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme('green')}>
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span>Verde {colorTheme === 'green' && '✓'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme('orange')}>
          <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
          <span>Laranja {colorTheme === 'orange' && '✓'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorThemeToggle;
