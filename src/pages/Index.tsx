import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

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
          <p className="text-muted-foreground">VDS-SERVER-001 • 192.168.1.100</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary neon-glow">45%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[45%] animate-pulse-glow"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-secondary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">RAM Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary neon-purple-glow">3.2 GB</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[62%] animate-pulse-glow"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent neon-magenta-glow">124 MB/s</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[78%] animate-pulse-glow"></div>
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
                <Badge variant="outline" className="border-primary text-primary">
                  <Icon name="Activity" size={12} className="mr-1" />
                  Онлайн
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black rounded-lg p-6 font-mono text-sm h-[400px] overflow-auto border border-primary/30 shadow-[inset_0_0_20px_rgba(0,240,255,0.2)]">
                <div className="text-primary">root@vds-server:~$<span className="animate-pulse">_</span></div>
                <div className="text-green-400 mt-2">$ systemctl status nginx</div>
                <div className="text-foreground/80 mt-1">● nginx.service - A high performance web server</div>
                <div className="text-foreground/80">   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)</div>
                <div className="text-foreground/80">   Active: <span className="text-primary">active (running)</span> since Thu 2026-01-09 14:23:15 UTC</div>
                <div className="text-foreground/80 mt-2">$ uptime</div>
                <div className="text-foreground/80"> 14:25:32 up 15 days,  3:42,  1 user,  load average: 0.45, 0.38, 0.42</div>
                <div className="text-primary mt-4">root@vds-server:~$<span className="animate-pulse">_</span></div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg">Управление сервером</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Icon name="Play" size={16} className="mr-2" />
                  Запустить
                </Button>
                <Button className="w-full bg-secondary/10 border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  <Icon name="RotateCcw" size={16} className="mr-2" />
                  Перезагрузить
                </Button>
                <Button className="w-full bg-accent/10 border border-accent text-accent hover:bg-accent hover:text-accent-foreground">
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
                  <span className="text-muted-foreground">OS:</span>
                  <span className="font-medium">Ubuntu 22.04</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP:</span>
                  <span className="font-medium">192.168.1.100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-medium text-primary">15 дней</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Статус:</span>
                  <Badge className="bg-primary/20 text-primary border-primary">Активен</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
            <div className="flex gap-6">
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
    </div>
  );
};

export default Index;
