import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

type ServerStatus = 'running' | 'stopped' | 'starting' | 'stopping' | 'rebooting';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified?: string;
  children?: FileItem[];
}

interface ConsoleMessage {
  text: string;
  type: 'command' | 'output' | 'success' | 'error';
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [serverStatus, setServerStatus] = useState<ServerStatus>('running');
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(3.2);
  const [networkUsage, setNetworkUsage] = useState(124);
  const [startupProgress, setStartupProgress] = useState(0);
  const [currentPath, setCurrentPath] = useState('/home/minecraft');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([
    { text: 'root@minecraft-server:~$', type: 'command' },
    { text: '[Server thread/INFO]: Starting Minecraft server on *:25565', type: 'output' },
    { text: '[Server thread/INFO]: Done! For help, type "help"', type: 'output' },
    { text: '[Server thread/INFO]: Steve joined the game', type: 'success' },
    { text: '[Server thread/INFO]: Alex joined the game', type: 'success' },
  ]);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [fileSystem] = useState<FileItem[]>([
    { name: 'server.jar', type: 'file', size: '45.2 MB', modified: '2026-01-09' },
    { 
      name: 'world', 
      type: 'folder', 
      modified: '2026-01-09',
      children: [
        { name: 'level.dat', type: 'file', size: '2.1 KB', modified: '2026-01-09' },
        { name: 'region', type: 'folder', modified: '2026-01-09', children: [] },
        { name: 'data', type: 'folder', modified: '2026-01-09', children: [] },
      ]
    },
    { 
      name: 'plugins', 
      type: 'folder', 
      modified: '2026-01-08',
      children: [
        { name: 'EssentialsX.jar', type: 'file', size: '512 KB', modified: '2026-01-08' },
        { name: 'WorldEdit.jar', type: 'file', size: '1.2 MB', modified: '2026-01-08' },
        { name: 'LuckPerms.jar', type: 'file', size: '3.4 MB', modified: '2026-01-08' },
      ]
    },
    { name: 'server.properties', type: 'file', size: '1.2 KB', modified: '2026-01-09' },
    { name: 'eula.txt', type: 'file', size: '128 B', modified: '2026-01-05' },
    { 
      name: 'logs', 
      type: 'folder', 
      modified: '2026-01-09',
      children: [
        { name: 'latest.log', type: 'file', size: '45 KB', modified: '2026-01-09' },
        { name: '2026-01-08.log.gz', type: 'file', size: '12 KB', modified: '2026-01-08' },
      ]
    }
  ]);

  const [currentFolder, setCurrentFolder] = useState<FileItem[]>(fileSystem);
  const [pathHistory, setPathHistory] = useState<FileItem[][]>([fileSystem]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (serverStatus === 'running') {
        setCpuUsage(prev => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 10)));
        setRamUsage(prev => Math.max(2, Math.min(7, prev + (Math.random() - 0.5) * 0.5)));
        setNetworkUsage(prev => Math.max(50, Math.min(500, prev + (Math.random() - 0.5) * 50)));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [serverStatus]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleMessages]);

  const handleConsoleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const command = consoleInput.trim();
    setConsoleMessages(prev => [...prev, { text: `> ${command}`, type: 'command' }]);

    const executeCommand = (cmd: string) => {
      const parts = cmd.toLowerCase().split(' ');
      const mainCmd = parts[0];

      switch (mainCmd) {
        case 'start':
          if (serverStatus === 'stopped') {
            handleServerStart();
            return { text: '[Server] Starting server...', type: 'success' };
          }
          return { text: '[Server] Server is already running', type: 'error' };

        case 'stop':
          if (serverStatus === 'running') {
            handleServerStop();
            return { text: '[Server] Stopping server...', type: 'success' };
          }
          return { text: '[Server] Server is not running', type: 'error' };

        case 'restart':
          handleServerReboot();
          return { text: '[Server] Restarting server...', type: 'success' };

        case 'op':
          if (parts[1]) {
            return { text: `[Server] Made ${parts[1]} a server operator`, type: 'success' };
          }
          return { text: '[Server] Usage: op <player>', type: 'error' };

        case 'gm':
          const mode = parts[1] || 'survival';
          const player = parts[2] || 'Steve';
          return { text: `[Server] Set ${player}'s game mode to ${mode}`, type: 'success' };

        case 'tps':
          const tps = (19.8 + Math.random() * 0.4).toFixed(2);
          return { text: `[Server] TPS from last 1m, 5m, 15m: ${tps}, ${tps}, ${tps}`, type: 'output' };

        case 'plugman':
          if (parts[1] === 'list') {
            return { text: '[PlugMan] Plugins (3): EssentialsX, WorldEdit, LuckPerms', type: 'output' };
          }
          return { text: '[PlugMan] Usage: plugman list', type: 'error' };

        case 'list':
          return { text: '[Server] There are 2 of a max of 20 players online: Steve, Alex', type: 'output' };

        case 'hub':
          return { text: '[Server] Teleporting all players to hub...', type: 'success' };

        case 'help':
          return { text: 'Available: start, stop, restart, op, gm, tps, plugman, list, hub', type: 'output' };

        default:
          return { text: `[Server] Unknown command: ${mainCmd}. Type 'help' for help.`, type: 'error' };
      }
    };

    const result = executeCommand(command);
    setConsoleMessages(prev => [...prev, result]);
    setConsoleInput('');
  };

  const handleServerStart = () => {
    setServerStatus('starting');
    setStartupProgress(0);
    toast({
      title: "Запуск сервера",
      description: "Сервер запускается...",
    });

    const interval = setInterval(() => {
      setStartupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setServerStatus('running');
          toast({
            title: "Сервер запущен",
            description: "Сервер успешно запущен и готов к работе",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 1000);
  };

  const handleServerStop = () => {
    setServerStatus('stopping');
    toast({
      title: "Остановка сервера",
      description: "Сервер останавливается...",
    });

    setTimeout(() => {
      setServerStatus('stopped');
      setCpuUsage(0);
      setRamUsage(0);
      setNetworkUsage(0);
      toast({
        title: "Сервер остановлен",
        description: "Сервер успешно остановлен",
      });
    }, 3000);
  };

  const handleServerReboot = () => {
    setServerStatus('rebooting');
    toast({
      title: "Перезагрузка сервера",
      description: "Сервер перезагружается...",
    });

    setTimeout(() => {
      handleServerStart();
    }, 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile: FileItem = {
        name: file.name,
        type: 'file',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        modified: new Date().toISOString().split('T')[0]
      };
      setCurrentFolder(prev => [...prev, newFile]);
      toast({
        title: "Файл загружен",
        description: `${file.name} успешно загружен`,
      });
    }
  };

  const handleFileRename = (oldName: string) => {
    const newName = prompt('Введите новое имя файла:', oldName);
    if (newName && newName !== oldName) {
      setCurrentFolder(prev => prev.map(f => f.name === oldName ? { ...f, name: newName } : f));
      toast({
        title: "Файл переименован",
        description: `${oldName} → ${newName}`,
      });
    }
  };

  const handleFileDelete = (name: string) => {
    if (confirm(`Удалить ${name}?`)) {
      setCurrentFolder(prev => prev.filter(f => f.name !== name));
      toast({
        title: "Файл удален",
        description: `${name} был удален`,
      });
    }
  };

  const openFolder = (folder: FileItem) => {
    if (folder.children) {
      setCurrentFolder(folder.children);
      setPathHistory(prev => [...prev, folder.children!]);
      const newPath = currentPath + '/' + folder.name;
      setCurrentPath(newPath);
    }
  };

  const goBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = pathHistory.slice(0, -1);
      setPathHistory(newHistory);
      setCurrentFolder(newHistory[newHistory.length - 1]);
      const pathParts = currentPath.split('/');
      setCurrentPath(pathParts.slice(0, -1).join('/'));
    }
  };

  const handleOrderServer = (plan: any) => {
    setSelectedPlan(plan);
    if (!isLoggedIn) {
      setAuthDialogOpen(true);
    } else {
      setOrderDialogOpen(true);
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    
    toast({
      title: "Добро пожаловать!",
      description: `Вы вошли как ${email}`,
    });
    setIsLoggedIn(true);
    setAuthDialogOpen(false);
    setOrderDialogOpen(true);
  };

  const handleGoogleAuth = () => {
    toast({
      title: "Вход через Google",
      description: "Перенаправление на Google OAuth...",
    });
    setTimeout(() => {
      setIsLoggedIn(true);
      setAuthDialogOpen(false);
      setOrderDialogOpen(true);
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли через Google",
      });
    }, 1500);
  };

  const proceedToPayment = () => {
    setOrderDialogOpen(false);
    setPaymentDialogOpen(true);
  };

  const confirmPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Оплата прошла успешно!",
      description: `Сервер ${selectedPlan.name} будет развернут в течение 5 минут. Домен: ser12.cybervds.net`,
    });
    setPaymentDialogOpen(false);
  };

  const plans = [
    {
      name: 'Starter',
      price: '500',
      cpu: '2 vCPU',
      ram: '4 GB RAM',
      storage: '80 GB NVMe',
      bandwidth: '2 TB',
      features: ['Root доступ', 'DDoS защита', '24/7 поддержка', 'Snapshots'],
      color: 'cyan'
    },
    {
      name: 'Professional',
      price: '1200',
      cpu: '4 vCPU',
      ram: '8 GB RAM',
      storage: '160 GB NVMe',
      bandwidth: '4 TB',
      features: ['Root доступ', 'DDoS защита', '24/7 поддержка', 'Snapshots', 'Backup', 'IPv6'],
      color: 'purple',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '2500',
      cpu: '8 vCPU',
      ram: '16 GB RAM',
      storage: '320 GB NVMe',
      bandwidth: '8 TB',
      features: ['Root доступ', 'DDoS защита', '24/7 поддержка', 'Snapshots', 'Backup', 'IPv6', 'Private Network', 'Dedicated CPU'],
      color: 'magenta'
    }
  ];

  const renderHome = () => (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>
        
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-glow">
              CYBER VDS
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Виртуальные серверы нового поколения
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 neon-border text-lg px-8 py-6"
                onClick={() => setActiveSection('pricing')}
              >
                <Icon name="Zap" className="mr-2" />
                Выбрать тариф
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
                onClick={() => setActiveSection('control')}
              >
                <Icon name="Terminal" className="mr-2" />
                Панель управления
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: 'Cpu', title: 'Высокая производительность', desc: 'Последнее поколение процессоров Intel Xeon' },
              { icon: 'Shield', title: 'Максимальная защита', desc: 'DDoS защита и мониторинг 24/7' },
              { icon: 'Gauge', title: 'Мгновенное развертывание', desc: 'Сервер готов к работе за 60 секунд' }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-card/50 backdrop-blur-sm border-primary/30 hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon name={feature.icon} className="text-primary" size={24} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 neon-purple-glow">Тарифы VDS</h2>
          <p className="text-xl text-muted-foreground">Выберите оптимальную конфигурацию для ваших задач</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <Card 
              key={idx} 
              className={`bg-card/50 backdrop-blur-sm border-2 transition-all hover:scale-105 animate-fade-in relative ${
                plan.color === 'cyan' ? 'border-primary/50 hover:border-primary hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]' :
                plan.color === 'purple' ? 'border-secondary/50 hover:border-secondary hover:shadow-[0_0_30px_rgba(155,135,245,0.4)]' :
                'border-accent/50 hover:border-accent hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]'
              }`}
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-secondary text-secondary-foreground neon-purple-glow">Популярный</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className={`text-5xl font-bold ${
                    plan.color === 'cyan' ? 'text-primary neon-glow' :
                    plan.color === 'purple' ? 'text-secondary neon-purple-glow' :
                    'text-accent neon-magenta-glow'
                  }`}>
                    {plan.price}₽
                  </span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Icon name="Cpu" size={18} className="text-primary" />
                    <span className="font-medium">{plan.cpu}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="MemoryStick" size={18} className="text-primary" />
                    <span className="font-medium">{plan.ram}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="HardDrive" size={18} className="text-primary" />
                    <span className="font-medium">{plan.storage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Wifi" size={18} className="text-primary" />
                    <span className="font-medium">{plan.bandwidth}</span>
                  </div>
                </div>
                
                <div className="border-t border-primary/20 pt-4 space-y-2">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full mt-6 ${
                    plan.color === 'cyan' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' :
                    plan.color === 'purple' ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' :
                    'bg-accent hover:bg-accent/90 text-accent-foreground'
                  }`}
                  onClick={() => handleOrderServer(plan)}
                >
                  Заказать сервер
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderControl = () => (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 neon-glow">Панель управления</h2>
          <p className="text-muted-foreground">ser12.cybervds.net • Minecraft Server</p>
        </div>

        <Tabs defaultValue="console" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="console">Консоль</TabsTrigger>
            <TabsTrigger value="files">Файлы</TabsTrigger>
          </TabsList>

          <TabsContent value="console" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary neon-glow">{cpuUsage.toFixed(0)}%</div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-pulse-glow transition-all" style={{ width: `${cpuUsage}%` }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-secondary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">RAM Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary neon-purple-glow">{ramUsage.toFixed(1)} GB</div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary animate-pulse-glow transition-all" style={{ width: `${(ramUsage / 8) * 100}%` }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-accent/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent neon-magenta-glow">{networkUsage.toFixed(0)} MB/s</div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent animate-pulse-glow transition-all" style={{ width: `${Math.min((networkUsage / 500) * 100, 100)}%` }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Monitor" className="text-primary" />
                      VNC Console
                    </CardTitle>
                    <Badge variant="outline" className={`${
                      serverStatus === 'running' ? 'border-primary text-primary' :
                      serverStatus === 'stopped' ? 'border-destructive text-destructive' :
                      'border-secondary text-secondary'
                    }`}>
                      <Icon name="Activity" size={12} className="mr-1" />
                      {serverStatus === 'running' ? 'Онлайн' :
                       serverStatus === 'stopped' ? 'Остановлен' :
                       serverStatus === 'starting' ? 'Запуск...' :
                       serverStatus === 'stopping' ? 'Остановка...' :
                       'Перезагрузка...'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {serverStatus === 'starting' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Запуск сервера...</span>
                        <span className="text-sm font-medium text-primary">{startupProgress}%</span>
                      </div>
                      <Progress value={startupProgress} className="h-2" />
                    </div>
                  )}
                  <div className="bg-black rounded-lg p-4 font-mono text-sm h-[350px] overflow-auto border border-primary/30 shadow-[inset_0_0_20px_rgba(0,240,255,0.2)]">
                    {consoleMessages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`${
                          msg.type === 'command' ? 'text-primary' :
                          msg.type === 'success' ? 'text-green-400' :
                          msg.type === 'error' ? 'text-red-400' :
                          'text-foreground/80'
                        } mb-1`}
                      >
                        {msg.text}
                      </div>
                    ))}
                    <div ref={consoleEndRef} />
                  </div>
                  <form onSubmit={handleConsoleCommand} className="mt-3">
                    <div className="flex gap-2">
                      <Input 
                        value={consoleInput}
                        onChange={(e) => setConsoleInput(e.target.value)}
                        placeholder="Введите команду (help для справки)..."
                        className="font-mono bg-black border-primary/30 text-primary"
                        disabled={serverStatus !== 'running'}
                      />
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90"
                        disabled={serverStatus !== 'running'}
                      >
                        <Icon name="Send" size={16} />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Управление сервером</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                      onClick={handleServerStart}
                      disabled={serverStatus !== 'stopped'}
                    >
                      <Icon name="Play" size={16} className="mr-2" />
                      Запустить
                    </Button>
                    <Button 
                      className="w-full bg-secondary/10 border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50"
                      onClick={handleServerReboot}
                      disabled={serverStatus !== 'running'}
                    >
                      <Icon name="RotateCcw" size={16} className="mr-2" />
                      Перезагрузить
                    </Button>
                    <Button 
                      className="w-full bg-accent/10 border border-accent text-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                      onClick={handleServerStop}
                      disabled={serverStatus === 'stopped'}
                    >
                      <Icon name="Power" size={16} className="mr-2" />
                      Выключить
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Домен:</span>
                      <span className="font-medium text-primary">ser12.cybervds.net</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP:</span>
                      <span className="font-medium">192.168.1.100:25565</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Версия:</span>
                      <span className="font-medium">Minecraft 1.20.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Игроки:</span>
                      <span className="font-medium text-secondary">2/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Статус:</span>
                      <Badge className={`${
                        serverStatus === 'running' ? 'bg-primary/20 text-primary border-primary' :
                        serverStatus === 'stopped' ? 'bg-destructive/20 text-destructive border-destructive' :
                        'bg-secondary/20 text-secondary border-secondary'
                      }`}>
                        {serverStatus === 'running' ? 'Активен' :
                         serverStatus === 'stopped' ? 'Остановлен' :
                         'Загрузка...'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Icon name="Folder" className="text-primary" />
                      Файловый менеджер
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {pathHistory.length > 1 && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={goBack}
                          className="h-7 px-2"
                        >
                          <Icon name="ArrowLeft" size={14} className="mr-1" />
                          Назад
                        </Button>
                      )}
                      <span>{currentPath}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <label htmlFor="file-upload">
                      <Button asChild>
                        <span>
                          <Icon name="Upload" size={16} className="mr-2" />
                          Загрузить
                        </span>
                      </Button>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentFolder.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-primary/10 cursor-pointer"
                      onClick={() => file.type === 'folder' && openFolder(file)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon 
                          name={file.type === 'folder' ? 'Folder' : 'File'} 
                          className={file.type === 'folder' ? 'text-secondary' : 'text-primary'} 
                          size={20} 
                        />
                        <div>
                          <div className="font-medium">{file.name}</div>
                          {file.size && (
                            <div className="text-xs text-muted-foreground">{file.size} • {file.modified}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleFileRename(file.name)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleFileDelete(file.name)}
                        >
                          <Icon name="Trash" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4 neon-magenta-glow">О компании</h2>
          <p className="text-xl text-muted-foreground">Лидер в области облачных технологий</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/30 hover:border-primary transition-all animate-fade-in">
            <CardHeader>
              <Icon name="Rocket" className="text-primary w-12 h-12 mb-4" />
              <CardTitle className="text-2xl">Наша миссия</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Предоставлять самые современные и надежные VDS решения для бизнеса любого масштаба. 
                Мы используем передовые технологии для обеспечения максимальной производительности и безопасности.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-secondary/30 hover:border-secondary transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <Icon name="Target" className="text-secondary w-12 h-12 mb-4" />
              <CardTitle className="text-2xl">Наши ценности</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Инновации, надежность и клиентоориентированность - основа нашей работы. 
                Каждый сервер оборудован новейшим оборудованием и защищен от любых угроз.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-accent/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-2xl">Преимущества работы с нами</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: 'Shield', title: 'DDoS защита', desc: 'Защита от атак до 1 Tbps' },
                { icon: 'Clock', title: 'Uptime 99.99%', desc: 'Гарантированная доступность' },
                { icon: 'Headphones', title: '24/7 Поддержка', desc: 'Техподдержка в любое время' },
                { icon: 'Zap', title: 'NVMe диски', desc: 'Сверхбыстрая скорость работы' },
                { icon: 'Globe', title: '10+ дата-центров', desc: 'По всему миру' },
                { icon: 'Lock', title: 'SSL сертификаты', desc: 'Бесплатно для всех клиентов' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold neon-glow cursor-pointer" onClick={() => setActiveSection('home')}>
              CYBER VDS
            </h1>
            <div className="flex gap-6 items-center">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'pricing', label: 'Тарифы', icon: 'DollarSign' },
                { id: 'control', label: 'Управление', icon: 'Settings' },
                { id: 'about', label: 'О компании', icon: 'Info' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 transition-all hover:text-primary ${
                    activeSection === item.id ? 'text-primary neon-glow' : 'text-muted-foreground'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
              {!isLoggedIn && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                  className="border-primary text-primary"
                >
                  <Icon name="User" size={16} className="mr-2" />
                  Войти
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        {activeSection === 'home' && renderHome()}
        {activeSection === 'pricing' && renderPricing()}
        {activeSection === 'control' && renderControl()}
        {activeSection === 'about' && renderAbout()}
      </div>

      <footer className="border-t border-primary/20 bg-background/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2026 CYBER VDS. Все права защищены.
            </div>
            <div className="flex gap-6">
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Mail" size={20} />
              </button>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="MessageCircle" size={20} />
              </button>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Phone" size={20} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl neon-glow">Вход в систему</DialogTitle>
            <DialogDescription>
              Войдите в аккаунт или зарегистрируйтесь
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="example@mail.com" 
                required
                className="border-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="••••••••" 
                required
                className="border-primary/30"
              />
            </div>
            <div className="space-y-3">
              <Button type="submit" className="w-full bg-primary text-primary-foreground">
                Войти
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className="w-full border-secondary text-secondary"
                onClick={handleGoogleAuth}
              >
                <Icon name="Chrome" size={16} className="mr-2" />
                Войти через Google
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl neon-glow">Заказ сервера</DialogTitle>
            <DialogDescription>
              Подтвердите заказ тарифа {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Тариф:</span>
              <span className="font-bold text-primary">{selectedPlan?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Цена:</span>
              <span className="font-bold text-secondary">{selectedPlan?.price}₽/месяц</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Конфигурация:</span>
              <span className="font-medium">{selectedPlan?.cpu}, {selectedPlan?.ram}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Домен:</span>
              <span className="font-medium text-accent">ser12.cybervds.net</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={proceedToPayment} className="bg-primary text-primary-foreground">
              Перейти к оплате
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl neon-glow">Оплата</DialogTitle>
            <DialogDescription>
              Введите данные для оплаты тарифа {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={confirmPayment} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Номер карты</Label>
              <Input 
                id="cardNumber" 
                name="cardNumber"
                placeholder="1234 5678 9012 3456" 
                required
                className="border-primary/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Срок действия</Label>
                <Input 
                  id="expiry" 
                  name="expiry"
                  placeholder="MM/YY" 
                  required
                  className="border-primary/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  name="cvv"
                  placeholder="123" 
                  required
                  className="border-primary/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input 
                id="phone" 
                name="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67" 
                required
                className="border-primary/30"
              />
            </div>
            <div className="pt-4 border-t border-primary/20">
              <div className="flex justify-between text-lg font-bold">
                <span>К оплате:</span>
                <span className="text-primary">{selectedPlan?.price}₽</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Оплатить
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
