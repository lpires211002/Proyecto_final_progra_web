'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminGuard from '@/components/AdminGuard';
import AdminNav from '@/components/AdminNav';

const SIZES = ['xs', 's', 'm', 'l'];
const EMPTY = {
  name: '', price: '', category: '', color: '', description: '', image_url: '',
  stock_xs: 0, stock_s: 0, stock_m: 0, stock_l: 0,
};

function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = new, product = edit
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error:', error);
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setImageFile(null);
    setFormOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name ?? '',
      price: p.price ?? '',
      category: p.category ?? '',
      color: p.color ?? '',
      description: p.description ?? '',
      image_url: p.image_url ?? '',
      stock_xs: p.stock_xs ?? 0,
      stock_s: p.stock_s ?? 0,
      stock_m: p.stock_m ?? 0,
      stock_l: p.stock_l ?? 0,
    });
    setImageFile(null);
    setFormOpen(true);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `product-images/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false });
    setUploading(false);
    if (error) {
      alert('Error subiendo imagen: ' + error.message + '\n(Creá el bucket "product-images" en Supabase Storage o usá una URL.)');
      return null;
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('El nombre es obligatorio');
    if (form.price === '' || isNaN(parseFloat(form.price))) return alert('El precio es obligatorio y debe ser un número');

    setSaving(true);
    let finalImageUrl = form.image_url;
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (!url) { setSaving(false); return; }
      finalImageUrl = url;
    }

    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category.trim() || null,
      color: form.color.trim() || null,
      description: form.description.trim() || null,
      image_url: finalImageUrl.trim() || null,
      stock_xs: parseInt(form.stock_xs) || 0,
      stock_s: parseInt(form.stock_s) || 0,
      stock_m: parseInt(form.stock_m) || 0,
      stock_l: parseInt(form.stock_l) || 0,
    };

    try {
      if (editing) {
        const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
      setFormOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Save error:', err);
      alert('Error guardando: ' + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (p) => {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) alert('Error eliminando: ' + error.message);
    else fetchProducts();
  };

  const totalStock = (p) => SIZES.reduce((acc, s) => acc + (p[`stock_${s}`] || 0), 0);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-surface">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10 border-b border-zinc-200 pb-8">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">Admin Panel</p>
          <h1 className="serif-headline text-4xl md:text-5xl italic tracking-tighter text-zinc-950">Productos y stock</h1>
        </div>

        <AdminNav />

        <div className="flex justify-between items-center mb-8">
          <p className="text-zinc-500 text-sm">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 font-label text-[11px] uppercase tracking-[0.15em] hover:bg-zinc-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo producto
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-zinc-400 text-4xl">progress_activity</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-zinc-200 mb-4 block">inventory_2</span>
            <p className="text-zinc-400 text-sm">No hay productos todavía. Creá el primero.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-100 bg-white">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left font-label text-[10px] uppercase tracking-[0.15em] text-zinc-400 border-b border-zinc-100">
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium">Categoría</th>
                  <th className="p-4 font-medium text-right">Precio</th>
                  <th className="p-4 font-medium">Stock (xs/s/m/l)</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 bg-zinc-100 overflow-hidden shrink-0">
                          {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-zinc-900 truncate">{p.name}</p>
                          {p.color && <p className="text-[11px] text-zinc-400">{p.color}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-500">{p.category || '—'}</td>
                    <td className="p-4 text-right font-medium text-zinc-900">${p.price}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {SIZES.map((s) => (
                          <span key={s} className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded ${(p[`stock_${s}`] || 0) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-400'}`}>
                            {p[`stock_${s}`] || 0}
                          </span>
                        ))}
                        <span className="text-[11px] text-zinc-400 ml-1">= {totalStock(p)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-2 hover:bg-zinc-100 rounded transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-zinc-500 text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(p)} className="p-2 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                          <span className="material-symbols-outlined text-red-400 text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Drawer */}
      {formOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={() => setFormOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[560px] bg-white z-[101] shadow-2xl overflow-y-auto">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <h2 className="serif-headline text-2xl italic text-zinc-950">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
                <button onClick={() => setFormOpen(false)} className="text-zinc-400 hover:text-black transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <Field label="Nombre">
                <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Ej: Architectural Wool Blazer" className={inputCls} />
              </Field>

              <div className="flex gap-6">
                <Field label="Precio (ARS)" className="flex-1">
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setField('price', e.target.value)} placeholder="450.00" className={inputCls} />
                </Field>
                <Field label="Categoría" className="flex-1">
                  <input type="text" value={form.category} onChange={(e) => setField('category', e.target.value)} placeholder="Outerwear" className={inputCls} />
                </Field>
              </div>

              <Field label="Color">
                <input type="text" value={form.color} onChange={(e) => setField('color', e.target.value)} placeholder="Charcoal" className={inputCls} />
              </Field>

              <Field label="Descripción">
                <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={3} placeholder="Descripción del producto" className={`${inputCls} resize-none`} />
              </Field>

              <Field label="Imagen (URL o subí un archivo)">
                <input type="text" value={form.image_url} onChange={(e) => setField('image_url', e.target.value)} placeholder="https://..." className={`${inputCls} mb-4`} />
                <div className="border border-dashed border-zinc-300 p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setField('image_url', ''); } }}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label htmlFor="product-image-upload" className="cursor-pointer">
                    <span className="material-symbols-outlined text-zinc-300 text-3xl mb-2 block">cloud_upload</span>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-widest">{imageFile ? imageFile.name : 'Subir imagen'}</span>
                  </label>
                </div>
                {(form.image_url || imageFile) && (
                  <div className="mt-4 w-28 h-36 bg-zinc-100 overflow-hidden">
                    <img src={imageFile ? URL.createObjectURL(imageFile) : form.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </Field>

              <Field label="Stock por talle">
                <div className="grid grid-cols-4 gap-3">
                  {SIZES.map((s) => (
                    <div key={s}>
                      <span className="block text-center font-label text-[10px] uppercase tracking-widest text-zinc-400 mb-1">{s}</span>
                      <input
                        type="number"
                        min="0"
                        value={form[`stock_${s}`]}
                        onChange={(e) => setField(`stock_${s}`, e.target.value)}
                        className="w-full border border-zinc-200 py-2 text-center text-sm font-medium focus:border-black outline-none"
                      />
                    </div>
                  ))}
                </div>
              </Field>

              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="w-full bg-zinc-950 text-white py-4 mt-4 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(saving || uploading) && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                {uploading ? 'Subiendo imagen...' : saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const inputCls = 'w-full border-b border-zinc-300 py-3 bg-transparent text-sm font-medium focus:ring-0 focus:border-black placeholder:font-light outline-none';

function Field({ label, children, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      <label className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-3">{label}</label>
      {children}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <ProductsManager />
    </AdminGuard>
  );
}
