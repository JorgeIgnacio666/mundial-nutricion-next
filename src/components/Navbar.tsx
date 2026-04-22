export function Navbar() {
  return (
    <nav className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start h-20 items-center">
          {/* Logo only */}
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="CELAN Logo" className="h-10 w-auto" />
            <span className="text-2xl font-black tracking-tighter text-secondary flex items-center">
              CELAN
              <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground hidden sm:block leading-none border-l pl-2 border-border">
                Centro Latinoamericano<br/>de Nutrición
              </span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
