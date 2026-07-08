'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/context/AppContext';
import AdminNav from '@/components/AdminNav';

export default function AdminOutfits() {
  const { user, userRole, authLoading } = useAppContext();
  const isSuperadmin = userRole === 'superadmin';
  const router = useRouter();

  const [outfits, setOutfits] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [editing, setEditing] = useState(null); // null = creating new, outfit object = editing
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch outfits with their product relations
  const fetchOutfits = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('outfits')
      .select('*, outfit_products(product_id)')
      .order('sort_order');

    if (data) setOutfits(data);
    if (error) console.error('Error:', error);
    setLoading(false);
  };

  // Fetch all products for the selector
  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('id, name, category, image_url');
    if (data) setAllProducts(data);
  };

  useEffect(() => {
    if (!authLoading && user && isSuperadmin) {
      fetchOutfits();
      fetchProducts();
    }
  }, [authLoading, user, isSuperadmin]);

  // Open form for creating a new outfit
  const handleNew = () => {
    setEditing(null);
    setTitle('');
    setVideoUrl('');
    setActive(true);
    setSortOrder(outfits.length + 1);
    setSelectedProductIds([]);
    setVideoFile(null);
    setFormOpen(true);
  };

  // Open form for editing an existing outfit
  const handleEdit = (outfit) => {
    setEditing(outfit);
    setTitle(outfit.title);
    setVideoUrl(outfit.video_url);
    setActive(outfit.active);
    setSortOrder(outfit.sort_order);
    setSelectedProductIds(outfit.outfit_products?.map(op => op.product_id) || []);
    setVideoFile(null);
    setFormOpen(true);
  };

  // Toggle product selection
  const toggleProduct = (productId) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Upload video to Supabase Storage
  const uploadVideo = async (file) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `outfit-videos/${fileName}`;

    const { data, error } = await supabase.storage
      .from('outfit-videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    setUploading(false);

    if (error) {
      console.error('Upload error:', error);
      alert('Error subiendo video: ' + error.message);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('outfit-videos')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!title.trim()) return alert('El título es obligatorio');

    setSaving(true);

    let finalVideoUrl = videoUrl;

    // If there's a video file to upload, upload it first
    if (videoFile) {
      const uploadedUrl = await uploadVideo(videoFile);
      if (!uploadedUrl) {
        setSaving(false);
        return;
      }
      finalVideoUrl = uploadedUrl;
    }

    if (!finalVideoUrl.trim()) {
      setSaving(false);
      return alert('Se necesita un video (URL o archivo)');
    }

    try {
      let outfitId;

      if (editing) {
        // Update existing outfit
        const { error } = await supabase
          .from('outfits')
          .update({ title, video_url: finalVideoUrl, active, sort_order: sortOrder })
          .eq('id', editing.id);

        if (error) throw error;
        outfitId = editing.id;

        // Delete existing product links and re-create them
        await supabase.from('outfit_products').delete().eq('outfit_id', outfitId);
      } else {
        // Create new outfit
        const { data, error } = await supabase
          .from('outfits')
          .insert({ title, video_url: finalVideoUrl, active, sort_order: sortOrder })
          .select()
          .single();

        if (error) throw error;
        outfitId = data.id;
      }

      // Insert product links
      if (selectedProductIds.length > 0) {
        const links = selectedProductIds.map(pid => ({
          outfit_id: outfitId,
          product_id: pid,
        }));
        const { error: linkError } = await supabase.from('outfit_products').insert(links);
        if (linkError) throw linkError;
      }

      setFormOpen(false);
      fetchOutfits();
    } catch (err) {
      console.error('Save error:', err);
      alert('Error guardando: ' + err.message);
    }

    setSaving(false);
  };

  // Delete outfit
  const handleDelete = async (outfitId) => {
    if (!confirm('¿Estás seguro que querés eliminar este outfit?')) return;

    const { error } = await supabase.from('outfits').delete().eq('id', outfitId);
    if (error) {
      alert('Error eliminando: ' + error.message);
    } else {
      fetchOutfits();
    }
  };

  // Auth loading or role loading
  if (authLoading || (user && userRole === null)) {
    return (
      <div className="min-h-screen pt-48 flex items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-spin text-zinc-400 text-4xl">progress_activity</span>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen pt-48 text-center bg-surface">
        <span className="material-symbols-outlined text-6xl text-zinc-300 mb-6 block">lock</span>
        <h2 className="serif-headline text-3xl italic text-zinc-950 mb-4">Admin Access Required</h2>
        <p className="text-zinc-500 text-sm">Inicia sesión para acceder al panel de administración.</p>
      </div>
    );
  }

  // Not superadmin
  if (!isSuperadmin) {
    return (
      <div className="min-h-screen pt-48 text-center bg-surface">
        <span className="material-symbols-outlined text-6xl text-zinc-300 mb-6 block">shield</span>
        <h2 className="serif-headline text-3xl italic text-zinc-950 mb-4">Acceso Denegado</h2>
        <p className="text-zinc-500 text-sm">No tenés permisos de superadmin para acceder a esta sección.</p>
        <p className="text-zinc-400 text-xs mt-2">Sesión: {user.email}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-surface">
      <div className="max-w-[1200px] mx-auto">
        <AdminNav />
        {/* Header */}
        <div className="flex justify-between items-end mb-12 border-b border-zinc-200 pb-8">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">Admin Panel</p>
            <h1 className="serif-headline text-4xl md:text-5xl italic tracking-tighter text-zinc-950">Outfits Manager</h1>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 font-label text-[11px] uppercase tracking-[0.15em] hover:bg-zinc-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo Outfit
          </button>
        </div>

        {/* Outfits List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-zinc-400 text-4xl">progress_activity</span>
          </div>
        ) : outfits.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-zinc-200 mb-4 block">styler</span>
            <p className="text-zinc-400 text-sm">No hay outfits todavía. Creá el primero.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {outfits.map((outfit) => (
              <div key={outfit.id} className="flex items-center gap-6 bg-white border border-zinc-100 p-4 group hover:border-zinc-300 transition-colors">
                {/* Video thumbnail */}
                <div className="w-20 h-28 bg-zinc-100 overflow-hidden shrink-0">
                  <video
                    src={outfit.video_url}
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-zinc-900 truncate">{outfit.title}</h3>
                    <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${outfit.active ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                    {outfit.outfit_products?.length || 0} producto{(outfit.outfit_products?.length || 0) !== 1 ? 's' : ''} · Orden: {outfit.sort_order}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(outfit)}
                    className="p-2 hover:bg-zinc-100 rounded transition-colors"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined text-zinc-500 text-[20px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(outfit.id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-red-400 text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {formOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={() => setFormOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[560px] bg-white z-[101] shadow-2xl overflow-y-auto">
            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="flex justify-between items-center mb-10">
                <h2 className="serif-headline text-2xl italic text-zinc-950">
                  {editing ? 'Editar Outfit' : 'Nuevo Outfit'}
                </h2>
                <button onClick={() => setFormOpen(false)} className="text-zinc-400 hover:text-black transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Title */}
              <div className="mb-8">
                <label className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-3">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Blusa Greta"
                  className="w-full border-b border-zinc-300 py-3 bg-transparent text-sm font-medium focus:ring-0 focus:border-black placeholder:font-light outline-none"
                />
              </div>

              {/* Video URL or Upload */}
              <div className="mb-8">
                <label className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-3">Video</label>
                
                {/* URL input */}
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="URL del video o subí un archivo abajo"
                  className="w-full border-b border-zinc-300 py-3 bg-transparent text-sm font-medium focus:ring-0 focus:border-black placeholder:font-light outline-none mb-4"
                />
                
                {/* File upload */}
                <div className="border border-dashed border-zinc-300 p-4 text-center">
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setVideoFile(file);
                        setVideoUrl(''); // Clear URL when uploading file
                      }
                    }}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <span className="material-symbols-outlined text-zinc-300 text-3xl mb-2 block">cloud_upload</span>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-widest">
                      {videoFile ? videoFile.name : 'Subir video .mp4 / .webm'}
                    </span>
                  </label>
                </div>

                {/* Preview */}
                {(videoUrl || videoFile) && (
                  <div className="mt-4 aspect-[3/4] max-h-48 bg-zinc-100 overflow-hidden">
                    <video
                      src={videoFile ? URL.createObjectURL(videoFile) : videoUrl}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Active & Sort */}
              <div className="flex gap-8 mb-8">
                <div className="flex-1">
                  <label className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-3">Estado</label>
                  <button
                    onClick={() => setActive(!active)}
                    className={`flex items-center gap-2 px-4 py-2 border text-[11px] uppercase tracking-widest transition-colors
                      ${active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-zinc-200 text-zinc-400'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                    {active ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
                <div className="flex-1">
                  <label className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-3">Orden</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-20 border-b border-zinc-300 py-2 bg-transparent text-sm font-medium focus:ring-0 focus:border-black outline-none"
                  />
                </div>
              </div>

              {/* Product Selector */}
              <div className="mb-10">
                <label className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-3">
                  Productos del Look ({selectedProductIds.length} seleccionados)
                </label>
                <div className="max-h-64 overflow-y-auto border border-zinc-100 divide-y divide-zinc-50">
                  {allProducts.map((product) => {
                    const isSelected = selectedProductIds.includes(product.id);
                    return (
                      <button
                        key={product.id}
                        onClick={() => toggleProduct(product.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors
                          ${isSelected ? 'bg-zinc-950 text-white' : 'hover:bg-zinc-50'}`}
                      >
                        <div className="w-10 h-12 bg-zinc-100 overflow-hidden shrink-0">
                          {product.image_url && (
                            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-zinc-900'}`}>{product.name}</p>
                          <p className={`text-[10px] uppercase tracking-widest ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>{product.category || 'Product'}</p>
                        </div>
                        <span className="material-symbols-outlined text-[18px]">
                          {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="w-full bg-zinc-950 text-white py-4 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(saving || uploading) && (
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                )}
                {uploading ? 'Subiendo video...' : saving ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear Outfit'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
