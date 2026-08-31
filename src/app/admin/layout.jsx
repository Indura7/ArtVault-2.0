export const metadata = {
  title: 'ArtVault Admin Portal',
  description: 'Management dashboard for ArtVault',
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Root site components like Header/Footer are excluded here */}
      {children}
    </div>
  );
}