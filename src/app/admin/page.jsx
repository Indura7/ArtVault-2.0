'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Palette, 
  CheckSquare, 
  DollarSign, 
  Send, 
  Calendar 
} from 'lucide-react';

// Supabase Connection
import { supabase } from '@/lib/supabase';

// UI Components
import Toast from '@/components/toast';
import Sidebar from '@/components/sidebar';
import LoginView from '@/components/loginview';
import Modals from '@/components/modals';

// Tab Components
import DashboardTab from '@/components/tabs/dashboardtab';
import ManageArtistsTab from '@/components/tabs/manageartiststab';
import ManageArtworksTab from '@/components/tabs/manageartworkstab';
import ManageWorkshopsTab from '@/components/tabs/manageworkshopstab';
import ModerationTab from '@/components/tabs/moderationtab';
import FinancialsTab from '@/components/tabs/financialstab';
import BroadcastTab from '@/components/tabs/broadcasttab';
import SettingsTab from '@/components/tabs/settingtab';

export default function AdminDashboardPage() {
  // Auth & UI States
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // App Navigation States
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Modal View States
  const [selectedArtistView, setSelectedArtistView] = useState(null);
  const [selectedArtworkView, setSelectedArtworkView] = useState(null);
  const [selectedModerationItem, setSelectedModerationItem] = useState(null);
  const [isAddWorkshopOpen, setIsAddWorkshopOpen] = useState(false);

  // Broadcast Message State
  const [broadcastText, setBroadcastText] = useState('');

  // New Workshop Form State
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    description: '',
    date: '',
    price: '',
    capacity: '',
    status: 'Upcoming'
  });
  
  // Table Interactivity & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedArtists, setSelectedArtists] = useState([]);

  // Database Dynamic Data States
  const [artists, setArtists] = useState([]);
  const [pendingModerations, setPendingModerations] = useState([]);
  const [allArtworks, setAllArtworks] = useState([]);
  const [financialOrders, setFinancialOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: '$0',
    activeArtists: 0,
    artworksSold: 0,
    pendingModerationsCount: 0
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [
        artistsRes,
        pendingRes,
        ordersRes,
        salesRes,
        allArtworksRes,
        messagesRes,
        workshopsRes
      ] = await Promise.all([
        supabase.from('artist').select(`
          artist_id,
          first_name,
          last_name,
          email,
          date_joined,
          artwork ( count )
        `),
        
        supabase.from('artwork').select(`
          art_id,
          title,
          price,  
          status,
          image_path,
          date_added,
          artist:artist_id ( first_name, last_name, email )
        `).ilike('status', 'pending'),

        supabase.from('orders').select(`
          order_id,
          total_amount,
          status,
          created_at,
          customer:customer_id ( first_name, last_name )
        `),

        supabase.from('sales').select('amount, created_at'),

        supabase.from('artwork').select(`
          art_id,
          title,
          price,
          status,
          image_path,
          date_added,
          artist:artist_id ( first_name, last_name, email )
        `),

        supabase.from('comment').select(`
          comment_id,
          content,
          created_at,
          artist:artist_id ( first_name, last_name )
        `),

        supabase.from('workshop').select('*').order('date', { ascending: true })
      ]);

      const formattedArtists = (artistsRes.data || []).map(a => ({
        id: a.artist_id,
        name: `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'Unknown Artist',
        email: a.email || 'N/A',
        artworks: a.artwork?.[0]?.count || 0,
        joinedDate: a.date_joined ? new Date(a.date_joined).toLocaleDateString() : 'N/A',
        sales: '$0',
        status: 'Active'
      }));
      setArtists(formattedArtists);

      const formattedPending = (pendingRes.data || []).map(item => ({
        id: item.art_id,
        title: item.title,
        artist: item.artist ? `${item.artist.first_name || ''} ${item.artist.last_name || ''}` : 'Unknown Artist',
        artistEmail: item.artist?.email || 'N/A',
        price: `$${item.price}`,
        img: item.image_path,
        date: item.date_added ? new Date(item.date_added).toLocaleDateString() : 'Recent'
      }));
      setPendingModerations(formattedPending);

      const formattedAllArtworks = (allArtworksRes.data || []).map(item => ({
        id: item.art_id,
        title: item.title,
        artist: item.artist ? `${item.artist.first_name || ''} ${item.artist.last_name || ''}` : 'Unknown Artist',
        artistEmail: item.artist?.email || 'N/A',
        price: item.price,
        status: item.status || 'Active',
        img: item.image_path,
        date: item.date_added ? new Date(item.date_added).toLocaleDateString() : 'N/A'
      }));
      setAllArtworks(formattedAllArtworks);

      const formattedOrders = (ordersRes.data || []).map(o => ({
        id: o.order_id,
        customer: o.customer ? `${o.customer.first_name || ''} ${o.customer.last_name || ''}` : 'Guest',
        amount: o.total_amount,
        status: o.status || 'Completed',
        date: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'
      }));
      setFinancialOrders(formattedOrders);

      const formattedMessages = (messagesRes.data || []).map(m => ({
        id: m.comment_id,
        sender: m.artist ? `${m.artist.first_name || ''} ${m.artist.last_name || ''}` : 'Anonymous Artist',
        content: m.content,
        date: m.created_at ? new Date(m.created_at).toLocaleString() : 'Recent'
      }));
      setMessages(formattedMessages);

      const formattedWorkshops = (workshopsRes.data || []).map(w => ({
        id: w.workshop_id,
        title: w.title || 'Untitled Workshop',
        description: w.description || '',
        date: w.date ? new Date(w.date).toLocaleDateString() : 'TBD',
        price: w.price || 0,
        capacity: w.capacity || 0,
        status: w.status || 'Upcoming'
      }));
      setWorkshops(formattedWorkshops);

      const totalRev = (ordersRes.data || []).reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
      const totalSold = ordersRes.data ? ordersRes.data.length : 0;

      setStats({
        totalRevenue: `$${totalRev.toLocaleString()}`,
        activeArtists: formattedArtists.length,
        artworksSold: totalSold,
        pendingModerationsCount: formattedPending.length
      });

      const combinedTransactionData = [
        ...(salesRes.data || []).map(s => ({ amount: Number(s.amount || 0), created_at: s.created_at })),
        ...(ordersRes.data || []).map(o => ({ amount: Number(o.total_amount || 0), created_at: o.created_at }))
      ];

      if (combinedTransactionData.length > 0) {
        const monthlyAggregation = {};

        combinedTransactionData.forEach(tx => {
          if (tx.created_at) {
            const txDate = new Date(tx.created_at);
            if (!isNaN(txDate.getTime())) {
              const monthYearKey = txDate.toLocaleString('en-US', { month: 'short' });
              monthlyAggregation[monthYearKey] = (monthlyAggregation[monthYearKey] || 0) + tx.amount;
            }
          }
        });

        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedGraphData = Object.keys(monthlyAggregation)
          .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
          .map(month => ({
            month: month,
            revenue: monthlyAggregation[month]
          }));

        setChartData(formattedGraphData);
      } else {
        setChartData([]);
      }

    } catch (error) {
      console.error('Error fetching database data:', error);
      showToast('Error loading data from database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkshop = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('workshop').insert([
        {
          title: newWorkshop.title,
          description: newWorkshop.description,
          date: newWorkshop.date,
          price: parseFloat(newWorkshop.price || 0),
          capacity: parseInt(newWorkshop.capacity || 0),
          status: newWorkshop.status
        }
      ]);

      if (error) throw error;

      showToast('Workshop created successfully!');
      setIsAddWorkshopOpen(false);
      setNewWorkshop({ title: '', description: '', date: '', price: '', capacity: '', status: 'Upcoming' });
      fetchDashboardData();
    } catch (err) {
      console.error('Error creating workshop:', err);
      showToast(`Workshop creation failed: ${err.message}`, 'error');
    }
  };

  const handleDeleteWorkshop = async (id) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    try {
      const { error } = await supabase.from('workshop').delete().eq('workshop_id', id);
      if (error) throw error;

      showToast('Workshop removed successfully!');
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting workshop:', err);
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  const handleApprove = async (id, title) => {
    try {
      const { error } = await supabase
        .from('artwork')
        .update({ status: 'Approved' })
        .eq('art_id', id);

      if (error) throw error;

      setPendingModerations(prev => prev.filter(item => item.id !== id));
      setSelectedModerationItem(null);
      showToast(`Approved "${title}" successfully!`);
      fetchDashboardData();
    } catch (err) {
      console.error('Approve Error:', err);
      showToast(`Approval failed: ${err.message}`, 'error');
    }
  };

  const handleReject = async (id, title) => {
    try {
      const { error } = await supabase
        .from('artwork')
        .update({ status: 'Rejected' })
        .eq('art_id', id);

      if (error) throw error;

      setPendingModerations(prev => prev.filter(item => item.id !== id));
      setSelectedModerationItem(null);
      showToast(`Rejected "${title}"`, 'error');
      fetchDashboardData();
    } catch (err) {
      console.error('Reject Error:', err);
      showToast(`Rejection failed: ${err.message}`, 'error');
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      showToast('No data available to export', 'error');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    showToast('Exported data successfully to CSV!');
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    showToast('Broadcast message transmitted successfully!');
    setBroadcastText('');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Manage Artist', icon: Users },
    { name: 'Manage Artworks', icon: Palette },
    { name: 'Manage Workshops', icon: Calendar },
    { name: 'Artwork Moderation', icon: CheckSquare },
    { name: 'Financial & Payouts', icon: DollarSign },
    { name: 'Broadcast & Messages', icon: Send },
    { name: 'Settings', icon: Settings },
  ];

  const toggleSelectAll = () => {
    if (selectedArtists.length === artists.length) setSelectedArtists([]);
    else setSelectedArtists(artists.map(a => a.id));
  };

  const toggleSelectArtist = (id) => {
    if (selectedArtists.includes(id)) setSelectedArtists(selectedArtists.filter(i => i !== id));
    else setSelectedArtists([...selectedArtists, id]);
  };

  const filteredArtists = artists.filter(a => {
    const matchesSearch = a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredArtworks = allArtworks.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.artist?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWorkshops = workshops.filter(w =>
    w.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return <LoginView setIsAuthenticated={setIsAuthenticated} showToast={showToast} />;
  }

  return (
    <div className={`flex h-screen font-sans transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
      <Toast toast={toast} />

      <Sidebar 
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchTerm={setSearchTerm}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setIsAuthenticated={setIsAuthenticated}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className={`h-24 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>)}
            </div>
            <div className={`h-80 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          </div>
        ) : (
          <>
            {activeTab === 'Dashboard' && (
              <DashboardTab 
                stats={stats}
                chartData={chartData}
                darkMode={darkMode}
                pendingModerations={pendingModerations}
                setSelectedModerationItem={setSelectedModerationItem}
              />
            )}

            {activeTab === 'Manage Artist' && (
              <ManageArtistsTab 
                darkMode={darkMode}
                selectedArtists={selectedArtists}
                filteredArtists={filteredArtists}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                exportToCSV={exportToCSV}
                toggleSelectAll={toggleSelectAll}
                toggleSelectArtist={toggleSelectArtist}
                setSelectedArtistView={setSelectedArtistView}
              />
            )}

            {activeTab === 'Manage Artworks' && (
              <ManageArtworksTab 
                darkMode={darkMode}
                filteredArtworks={filteredArtworks}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                exportToCSV={exportToCSV}
                setSelectedArtworkView={setSelectedArtworkView}
              />
            )}

            {activeTab === 'Manage Workshops' && (
              <ManageWorkshopsTab 
                darkMode={darkMode}
                filteredWorkshops={filteredWorkshops}
                setIsAddWorkshopOpen={setIsAddWorkshopOpen}
                handleDeleteWorkshop={handleDeleteWorkshop}
              />
            )}

            {activeTab === 'Artwork Moderation' && (
              <ModerationTab 
                darkMode={darkMode}
                pendingModerations={pendingModerations}
                handleApprove={handleApprove}
                handleReject={handleReject}
                setSelectedModerationItem={setSelectedModerationItem}
              />
            )}

            {activeTab === 'Financial & Payouts' && (
              <FinancialsTab 
                darkMode={darkMode}
                financialOrders={financialOrders}
                exportToCSV={exportToCSV}
              />
            )}

            {activeTab === 'Broadcast & Messages' && (
              <BroadcastTab 
                darkMode={darkMode}
                broadcastText={broadcastText}
                setBroadcastText={setBroadcastText}
                handleSendBroadcast={handleSendBroadcast}
                messages={messages}
              />
            )}

            {activeTab === 'Settings' && (
              <SettingsTab 
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            )}
          </>
        )}
      </main>

      <Modals 
        darkMode={darkMode}
        isAddWorkshopOpen={isAddWorkshopOpen}
        setIsAddWorkshopOpen={setIsAddWorkshopOpen}
        newWorkshop={newWorkshop}
        setNewWorkshop={setNewWorkshop}
        handleCreateWorkshop={handleCreateWorkshop}
        selectedArtistView={selectedArtistView}
        setSelectedArtistView={setSelectedArtistView}
        selectedArtworkView={selectedArtworkView}
        setSelectedArtworkView={setSelectedArtworkView}
        selectedModerationItem={selectedModerationItem}
        setSelectedModerationItem={setSelectedModerationItem}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </div>
  );
}