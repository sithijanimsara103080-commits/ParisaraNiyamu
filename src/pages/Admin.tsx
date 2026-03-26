import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      navigate("/");
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <iframe
        src="https://vital-leaf-network.lovable.app/admin-login"
        title="Admin Dashboard"
        className="w-full h-screen border-none"
        allow="fullscreen"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
      />
    </div>
  );
}

/* ─── Events Manager ─── */
function EventsManager({ userId }: { userId: string }) {
  const [events, setEvents] = useState<Database['public']['Tables']['events'][]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", title_si: "", category: "Awareness", date: "", description: "", description_si: "" });
  const { toast } = useToast();

  const categories = ["Tree Planting", "Recycling", "Awareness"];

  const load = async () => {
    try {
      const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      console.log("✅ Events loaded:", data?.length || 0);
      setEvents((data as Database['public']['Tables']['events'][]) || []);
    } catch (err: any) {
      console.error("❌ Load error:", err);
      toast({ title: "❌ Failed to load events", description: err.message, variant: "destructive" });
    }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.date || !form.description) {
      toast({ title: "⚠️ Fill all required fields", description: "Title, date, and description are required", variant: "destructive" }); 
      return;
    }
    try {
      if (editId) {
        // @ts-ignore - Supabase type inference limitation
        const { error } = await supabase.from("events").update(form).eq("id", editId);
        if (error) throw error;
        toast({ title: "✅ Event updated successfully" });
      } else {
        // @ts-ignore - Supabase type inference limitation
        const { error } = await supabase.from("events").insert({ ...form, created_by: userId });
        if (error) throw error;
        toast({ title: "✅ Event created successfully" });
      }
      setForm({ title: "", title_si: "", category: "Awareness", date: "", description: "", description_si: "" });
      setEditId(null);
      await load();
    } catch (err: any) {
      console.error("Save error:", err);
      toast({ title: "❌ Save failed", description: err.message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "✅ Event deleted successfully" });
      load();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast({ title: "❌ Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (e: any) => {
    setEditId(e.id);
    setForm({
      title: e.title || "",
      title_si: e.title_si || "",
      category: e.category || "Awareness",
      date: e.date || "",
      description: e.description || "",
      description_si: e.description_si || ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-foreground font-semibold flex items-center gap-2">
          <CalendarPlus className="w-4 h-4 text-primary" />
          {editId ? "Edit Event" : "Add Event"}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Title (English)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-muted border-border" />
          <Input placeholder="Title (Sinhala)" value={form.title_si} onChange={e => setForm(f => ({ ...f, title_si: e.target.value }))} className="bg-muted border-border font-si" />
        </div>
        <div className="flex gap-2">
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground flex-1"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="bg-muted border-border flex-1" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Textarea placeholder="Description (English)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-muted border-border" />
          <Textarea placeholder="Description (Sinhala)" value={form.description_si} onChange={e => setForm(f => ({ ...f, description_si: e.target.value }))} className="bg-muted border-border font-si" />
        </div>
        <div className="flex gap-2">
          <Button onClick={save} size="sm"><Save className="w-4 h-4 mr-1" />{editId ? "Update" : "Create"}</Button>
          {editId && <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setForm({ title: "", title_si: "", category: "Awareness", date: "", description: "", description_si: "" }); }}><X className="w-4 h-4" /></Button>}
        </div>
      </div>

      <div className="space-y-2">
        {events.map(e => (
          <div key={e.id} className="glass-card p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium text-sm">{e.title}</p>
              {e.title_si && <p className="text-muted-foreground text-xs font-si">{e.title_si}</p>}
              <p className="text-muted-foreground text-[10px] mt-1 uppercase tracking-widest">{e.date} · {e.category}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => startEdit(e)}><Pencil className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => remove(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
        {events.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No events yet.</p>}
      </div>
    </div>
  );
}

/* ─── Gallery Manager ─── */
function GalleryManager({ userId }: { userId: string }) {
  const [items, setItems] = useState<Database['public']['Tables']['gallery_items'][]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", title_si: "", description: "", description_si: "", image_url: "" });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      const { data, error } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      console.log("✅ Gallery loaded:", data?.length || 0);
      setItems((data as Database['public']['Tables']['gallery_items'][]) || []);
    } catch (err: any) {
      console.error("❌ Load error:", err);
      toast({ title: "❌ Failed to load gallery", description: err.message, variant: "destructive" });
    }
  };
  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pioneers-gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pioneers-gallery')
        .getPublicUrl(filePath);

      setForm(f => ({ ...f, image_url: publicUrl }));
      toast({ title: "Image uploaded successfully" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.title || !form.image_url) {
      toast({ title: "⚠️ Title and image required", variant: "destructive" }); 
      return;
    }
    if (form.title.startsWith("data:image")) {
      toast({ title: "⚠️ Please enter a proper title, not image data", variant: "destructive" }); 
      return;
    }
    try {
      if (editId) {
        // @ts-ignore - Supabase type inference limitation
        const { error } = await supabase.from("gallery_items").update(form).eq("id", editId);
        if (error) throw error;
        toast({ title: "✅ Gallery item updated successfully" });
      } else {
        // @ts-ignore - Supabase type inference limitation
        const { error } = await supabase.from("gallery_items").insert({ ...form, created_by: userId });
        if (error) throw error;
        toast({ title: "✅ Gallery item added successfully" });
      }
      setForm({ title: "", title_si: "", description: "", description_si: "", image_url: "" });
      setEditId(null);
      await load();
    } catch (err: any) {
      console.error("Save error:", err);
      toast({ title: "❌ Save failed", description: err.message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "✅ Gallery item deleted successfully" });
      await load();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast({ title: "❌ Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      title: item.title || "",
      title_si: item.title_si || "",
      description: item.description || "",
      description_si: item.description_si || "",
      image_url: item.image_url || ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-foreground font-semibold flex items-center gap-2">
          <ImagePlus className="w-4 h-4 text-primary" />
          {editId ? "Edit Gallery Item" : "Add Gallery Item"}
        </h3>

        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Title (English)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-muted border-border" />
          <Input placeholder="Title (Sinhala)" value={form.title_si} onChange={e => setForm(f => ({ ...f, title_si: e.target.value }))} className="bg-muted border-border font-si" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Image Attachment</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input placeholder="Image URL (or upload)" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="bg-muted border-border" />
            </div>
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="gallery-upload" disabled={uploading} />
              <label htmlFor="gallery-upload">
                <Button asChild variant="outline" size="sm" className="cursor-pointer gap-2" disabled={uploading}>
                  <span>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Uploading..." : "Upload"}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Textarea placeholder="Description (English)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-muted border-border" />
          <Textarea placeholder="Description (Sinhala)" value={form.description_si} onChange={e => setForm(f => ({ ...f, description_si: e.target.value }))} className="bg-muted border-border font-si" />
        </div>

        {form.image_url && (
          <div className="relative w-full aspect-video max-h-48 rounded-xl overflow-hidden border border-border bg-black/5">
            <img src={form.image_url} alt="Preview" className="w-full h-full object-contain" />
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={save} size="sm" className="rounded-lg"><Save className="w-4 h-4 mr-1" />{editId ? "Update" : "Add to Gallery"}</Button>
          {editId && <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setForm({ title: "", title_si: "", description: "", description_si: "", image_url: "" }); }}><X className="w-4 h-4" /></Button>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="glass-card overflow-hidden group">
            <div className="relative aspect-video">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={() => startEdit(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={() => remove(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-foreground text-sm font-bold truncate">{item.title}</p>
              {item.title_si && <p className="text-muted-foreground text-[11px] font-si truncate">{item.title_si}</p>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-8 col-span-full font-light">Your gallery is empty.</p>}
      </div>
    </div>
  );
}

/* ─── About Manager ─── */
function AboutManager({ userId }: { userId: string }) {
  const [items, setItems] = useState<Database['public']['Tables']['about_items'][]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", title_si: "", content: "", content_si: "", icon: "Leaf" });
  const { toast } = useToast();

  const load = async () => {
    try {
      const { data, error } = await supabase.from("about_items").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      console.log("✅ About items loaded:", data?.length || 0);
      setItems((data as Database['public']['Tables']['about_items'][]) || []);
    } catch (err: any) {
      console.error("❌ Load error:", err);
      toast({ title: "❌ Failed to load about items", description: err.message, variant: "destructive" });
    }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.content) {
      toast({ title: "⚠️ Title and content required", variant: "destructive" }); 
      return;
    }
    try {
      if (editId) {
        // @ts-ignore - Supabase type inference limitation
        const { error } = await supabase.from("about_items").update(form).eq("id", editId);
        if (error) throw error;
        toast({ title: "✅ About item updated successfully" });
      } else {
        // @ts-ignore - Supabase type inference limitation
        const { error } = await supabase.from("about_items").insert({ ...form, created_by: userId });
        if (error) throw error;
        toast({ title: "✅ About item created successfully" });
      }
      setForm({ title: "", title_si: "", content: "", content_si: "", icon: "Leaf" });
      setEditId(null);
      await load();
    } catch (err: any) {
      console.error("Save error:", err);
      toast({ title: "❌ Save failed", description: err.message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase.from("about_items").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "✅ About item deleted successfully" });
      await load();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast({ title: "❌ Delete failed", description: err.message, variant: "destructive" });
    }
  };  return (
    <div className="space-y-6">
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-foreground font-semibold flex items-center gap-2">
          <Leaf className="w-4 h-4 text-primary" />
          {editId ? "Edit About Item" : "Add About Item"}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Title (EN)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-muted" />
          <Input placeholder="Title (SI)" value={form.title_si} onChange={e => setForm(f => ({ ...f, title_si: e.target.value }))} className="bg-muted font-si" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Textarea placeholder="Content (EN)" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="bg-muted" />
          <Textarea placeholder="Content (SI)" value={form.content_si} onChange={e => setForm(f => ({ ...f, content_si: e.target.value }))} className="bg-muted font-si" />
        </div>
        <Button onClick={save} size="sm"><Save className="w-4 h-4 mr-1" />{editId ? "Update" : "Create"}</Button>
        {editId && <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setForm({ title: "", title_si: "", content: "", content_si: "", icon: "Leaf" }); }}><X className="w-4 h-4" /></Button>}
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="glass-card p-4 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-foreground text-sm font-bold">{item.title}</p>
              <p className="text-muted-foreground text-xs">{item.content.substring(0, 50)}...</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { setEditId(item.id); setForm({ title: item.title, title_si: item.title_si || "", content: item.content, content_si: item.content_si || "", icon: item.icon || "Leaf" }); }}><Pencil className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Executive Board Manager ─── */
function BoardManager({ userId }: { userId: string }) {
  const [members, setMembers] = useState<Database['public']['Tables']['board_members'][]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", name_si: "", position: "", position_si: "", image_url: "" });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      const { data, error } = await supabase.from("board_members").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      console.log("✅ Board members loaded:", data?.length || 0);
      setMembers((data as Database['public']['Tables']['board_members'][]) || []);
    } catch (err: any) {
      console.error("❌ Load error:", err);
      toast({ title: "❌ Failed to load board members", description: err.message, variant: "destructive" });
    }
  };
  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('pioneers-members').upload(`members/${fileName}`, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('pioneers-members').getPublicUrl(`members/${fileName}`);
      setForm(f => ({ ...f, image_url: publicUrl }));
      toast({ title: "Photo uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.name || !form.position) {
      toast({ title: "⚠️ Name and position required", variant: "destructive" }); 
      return;
    }
    try {
      if (editId) {
        // @ts-ignore - Supabase type inference limitation
        const { error } = await supabase.from("board_members").update(form).eq("id", editId);
        if (error) throw error;
        toast({ title: "✅ Member updated successfully" });
      } else {
        // @ts-ignore - Supabase type inference limitation
        const { error } = await supabase.from("board_members").insert({ ...form, created_by: userId });
        if (error) throw error;
        toast({ title: "✅ Member added successfully" });
      }
      setForm({ name: "", name_si: "", position: "", position_si: "", image_url: "" });
      setEditId(null);
      await load();
    } catch (err: any) {
      console.error("Save error:", err);
      toast({ title: "❌ Save failed", description: err.message, variant: "destructive" });
    }
  };  return (
    <div className="space-y-6">
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-foreground font-semibold flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          {editId ? "Edit Member" : "Add Board Member"}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Name (EN)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-muted" />
          <Input placeholder="Name (SI)" value={form.name_si} onChange={e => setForm(f => ({ ...f, name_si: e.target.value }))} className="bg-muted font-si" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Position (EN)" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className="bg-muted" />
          <Input placeholder="Position (SI)" value={form.position_si} onChange={e => setForm(f => ({ ...f, position_si: e.target.value }))} className="bg-muted font-si" />
        </div>
        <div className="flex items-center gap-4">
          <Input placeholder="Photo URL" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="bg-muted flex-1" />
          <input type="file" onChange={handleUpload} className="hidden" id="board-upload" />
          <label htmlFor="board-upload"><Button asChild variant="outline" size="sm" className="cursor-pointer">{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Upload</span>}</Button></label>
        </div>
        <Button onClick={save} size="sm"><Save className="w-4 h-4 mr-1" />Save Member</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {members.map(m => (
          <div key={m.id} className="glass-card p-4 relative group">
            <div className="aspect-square rounded-full overflow-hidden mb-3 border-2 border-primary/20">
              <img src={m.image_url || "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/default-avatar.png"} alt={m.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-foreground text-sm font-bold text-center">{m.name}</p>
            <p className="text-primary text-[10px] uppercase font-bold text-center">{m.position}</p>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditId(m.id); setForm({ name: m.name || "", name_si: m.name_si || "", position: m.position || "", position_si: m.position_si || "", image_url: m.image_url || "" }); }}><Pencil className="w-3.5 h-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={async () => {
                try {
                  const { error } = await supabase.from("board_members").delete().eq("id", m.id);
                  if (error) throw error;
                  toast({ title: "✅ Member deleted successfully" });
                  await load();
                } catch (err: any) {
                  console.error("Delete error:", err);
                  toast({ title: "❌ Delete failed", description: err.message, variant: "destructive" });
                }
              }}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Admins Manager (Super Admin only) ─── */
function AdminsManager() {
  const [admins, setAdmins] = useState<Database['public']['Tables']['user_roles'][]>([]);
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("user_roles").select("*, profiles:user_id(username)");
    setAdmins(data || []);
  };
  useEffect(() => { load(); }, []);

  const createAdmin = async () => {
    if (!form.email || !form.password || !form.username) {
      toast({ title: "Fill all fields", variant: "destructive" }); return;
    }
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("create-admin", {
      body: { email: form.email, password: form.password, username: form.username, role: "admin", requester_id: user?.id },
    });
    setCreating(false);

    if (error || data?.error) {
      toast({ title: "Error", description: data?.error || error?.message, variant: "destructive" });
    } else {
      toast({ title: "Admin created successfully" });
      setForm({ email: "", password: "", username: "" });
      load();
    }
  };

  const removeAdmin = async (roleId: string) => {
    await supabase.from("user_roles").delete().eq("id", roleId);
    toast({ title: "Admin removed" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-foreground font-semibold flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          Create New Admin
        </h3>
        <Input placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="bg-muted border-border" />
        <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-muted border-border" />
        <Input type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="bg-muted border-border" />
        <Button onClick={createAdmin} size="sm" disabled={creating}>
          <UserPlus className="w-4 h-4 mr-1" />{creating ? "Creating..." : "Create Admin"}
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-foreground font-semibold text-sm">Current Admins</h3>
        {admins.map(a => (
          <div key={a.id} className="glass-card p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              {/* @ts-ignore - Related profile join type inference */}
              <p className="text-foreground font-medium text-sm">{a.profiles?.username || "Unknown"}</p>
              <p className="text-muted-foreground text-xs">{a.role}</p>
            </div>
            {a.role !== "super_admin" && (
              <Button variant="ghost" size="icon" onClick={() => removeAdmin(a.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
