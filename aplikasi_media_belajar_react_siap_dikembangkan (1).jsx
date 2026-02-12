import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen,
  Play,
  CheckCircle2,
  HelpCircle,
  Shuffle,
  Edit3,
  Sparkles,
} from "lucide-react";

/**
 * Aplikasi Media Belajar – Single-file React Component
 * Fitur utama:
 * - Daftar modul + pencarian & filter tingkat
 * - Tab Materi / Kuis / Kartu / Video / Catatan
 * - Penilaian kuis & progres tersimpan (localStorage)
 * - Mode belajar (fokus) & mode guru (edit cepat konten)
 * - Desain Tailwind + shadcn/ui
 *
 * Catatan:
 * - Ganti konstanta DEFAULT_MODULES dengan materi Anda sendiri.
 * - Komponen siap dipakai di proyek Vite/Next.js yang sudah terpasang Tailwind + shadcn/ui.
 */

const DEFAULT_MODULES = [
  {
    id: "termokimia",
    judul: "Termokimia Dasar",
    tingkat: "SMA",
    deskripsi: "Konsep sistem, lingkungan, entalpi (ΔH), dan hukum Hess.",
    materi: `# Ringkasan
- **Sistem**: bagian yang dikaji; **lingkungan**: di luar sistem.
- **Proses eksoterm**: melepas kalor (ΔH < 0); **endoterm**: menyerap kalor (ΔH > 0).
- **Hukum Hess**: ΔH total reaksi = jumlah ΔH tahapannya.

## Contoh Simbol
- ΔH: perubahan entalpi
- q: kalor
- Σ: penjumlahan
- n: mol

## Contoh Soal Singkat
Reaksi A→B memiliki ΔH1, B→C memiliki ΔH2. Maka ΔH A→C = ΣΔH = ΔH1 + ΔH2.
`,
    videoUrl: "https://www.youtube.com/embed/0H79C4QeL8Q",
    flashcards: [
      { front: "Eksoterm", back: "Reaksi yang melepas kalor (ΔH negatif)." },
      { front: "Endoterm", back: "Reaksi yang menyerap kalor (ΔH positif)." },
      { front: "Hukum Hess", back: "ΔH total = jumlah ΔH tahapan reaksi." },
      { front: "Σ (Sigma)", back: "Simbol penjumlahan." },
    ],
    quiz: [
      {
        q: "Manakah pernyataan yang benar tentang reaksi eksoterm?",
        choices: [
          "Suhu sistem turun dan ΔH > 0",
          "Suhu lingkungan naik dan ΔH < 0",
          "Energi diserap dari lingkungan, ΔH > 0",
          "Tidak ada perubahan kalor",
        ],
        answer: 1,
        explain:
          "Eksoterm melepas kalor ke lingkungan sehingga lingkungan lebih hangat dan ΔH bernilai negatif.",
      },
      {
        q: "Menurut Hukum Hess, ΔH reaksi keseluruhan adalah…",
        choices: [
          "Rata-rata ΔH tiap tahap",
          "Perkalian ΔH tiap tahap",
          "Jumlah ΔH tiap tahap",
          "Selisih ΔH tahap terbesar dan terkecil",
        ],
        answer: 2,
        explain:
          "Hukum Hess menyatakan ΔH total adalah jumlah aljabar ΔH tahapan.",
      },
    ],
  },
  {
    id: "statistika",
    judul: "Statistika Ringkas",
    tingkat: "SMP",
    deskripsi: "Rata-rata, median, modus, dan sebaran sederhana.",
    materi: `# Ringkasan
- **Rata-rata (mean)**: jumlah data ÷ banyaknya data.
- **Median**: nilai tengah data terurut.
- **Modus**: nilai yang paling sering muncul.
`,
    videoUrl: "https://www.youtube.com/embed/O2w1fU2j4HY",
    flashcards: [
      { front: "Mean", back: "Jumlah seluruh data dibagi banyak data." },
      { front: "Median", back: "Nilai tengah dari data terurut." },
      { front: "Modus", back: "Nilai yang paling sering muncul." },
    ],
    quiz: [
      {
        q: "Data: 2, 3, 3, 5. Modusnya adalah…",
        choices: ["2", "3", "4", "5"],
        answer: 1,
        explain: "Angka 3 muncul dua kali, paling sering.",
      },
    ],
  },
];

const STORAGE_KEY = "media-belajar-state-v1";

function usePersistentState(defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { progres: {}, catatan: {} };
    } catch {
      return { progres: {}, catatan: {} };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const setProgres = (moduleId, value) =>
    setState((s) => ({ ...s, progres: { ...s.progres, [moduleId]: value } }));
  const setCatatan = (moduleId, value) =>
    setState((s) => ({ ...s, catatan: { ...s.catatan, [moduleId]: value } }));

  return { state, setProgres, setCatatan };
}

function ModulCard({ modul, onOpen }) {
  return (
    <Card className="hover:shadow-xl transition-all rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {modul.judul}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{modul.deskripsi}</p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{modul.tingkat}</Badge>
        </div>
        <Button className="w-full" onClick={() => onOpen(modul.id)}>
          Mulai Belajar
        </Button>
      </CardContent>
    </Card>
  );
}

function Markdown({ text }) {
  // Renderer markdown yang sangat sederhana (bold, italic, heading, list)
  const html = useMemo(() => {
    let h = text
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mt-4">$1</h3>'
      )
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6">$1</h2>')
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-extrabold mt-6">$1</h1>'
      )
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/\n\n/g, "<br/><br/>");
    // bungkus list item jadi <ul>
    h = h.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc ml-6">$1</ul>');
    return { __html: h };
  }, [text]);
  return <div className="prose max-w-none" dangerouslySetInnerHTML={html} />;
}

function Quiz({ items = [], onScore }) {
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const correctCount = useMemo(
    () =>
      items.reduce(
        (acc, it, idx) => acc + ((answers[idx] ?? -1) === it.answer ? 1 : 0),
        0
      ),
    [answers, items]
  );

  useEffect(() => {
    if (done) onScore(correctCount, items.length);
  }, [done]);

  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <Card key={i} className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Soal {i + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">{it.q}</p>
            <div className="grid md:grid-cols-2 gap-2">
              {it.choices.map((c, idx) => (
                <Button
                  key={idx}
                  variant={answers[i] === idx ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setAnswers((a) => ({ ...a, [i]: idx }))}
                >
                  {String.fromCharCode(65 + idx)}. {c}
                </Button>
              ))}
            </div>
            {done && (
              <p className="text-sm text-muted-foreground">
                {answers[i] === it.answer ? (
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Benar.
                  </span>
                ) : (
                  <span>
                    Kurang tepat. Kunci: {String.fromCharCode(65 + it.answer)}.{" "}
                    {it.explain}
                  </span>
                )}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
      <div className="flex items-center gap-3">
        <Button onClick={() => setDone(true)}>Periksa Jawaban</Button>
        {done && (
          <Badge variant="secondary">
            Skor: {correctCount}/{items.length}
          </Badge>
        )}
      </div>
    </div>
  );
}

function Flashcards({ cards = [] }) {
  const [index, setIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const ordered = useMemo(
    () => (shuffle ? [...cards].sort(() => Math.random() - 0.5) : cards),
    [cards, shuffle]
  );
  const item = ordered[index] ?? {};
  const [flip, setFlip] = useState(false);

  const next = () => {
    setFlip(false);
    setIndex((i) => (i + 1) % ordered.length);
  };

  if (!cards.length) return <p>Tidak ada kartu.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shuffle className="w-4 h-4" />
          <span className="text-sm">Acak</span>
          <Switch checked={shuffle} onCheckedChange={setShuffle} />
        </div>
        <Badge>
          {index + 1} / {ordered.length}
        </Badge>
      </div>
      <div
        className={`p-6 rounded-2xl border cursor-pointer text-center min-h-[140px] flex items-center justify-center transition-transform ${
          flip ? "rotate-y-180" : ""
        }`}
        onClick={() => setFlip(!flip)}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="text-lg font-semibold">
          {flip ? item.back : item.front}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setFlip((f) => !f)} variant="outline">
          Balik
        </Button>
        <Button onClick={next}>Berikutnya</Button>
      </div>
    </div>
  );
}

function EditorDialog({ modul, onSave }) {
  const [draft, setDraft] = useState(() => ({
    ...modul,
    materi: modul.materi ?? "",
    flashcards: modul.flashcards
      ? JSON.stringify(modul.flashcards, null, 2)
      : "[]",
    quiz: modul.quiz ? JSON.stringify(modul.quiz, null, 2) : "[]",
  }));

  const handleSave = () => {
    try {
      const updated = {
        ...draft,
        flashcards: JSON.parse(draft.flashcards || "[]"),
        quiz: JSON.parse(draft.quiz || "[]"),
      };
      onSave(updated);
    } catch (e) {
      alert("Format JSON pada flashcards/quiz tidak valid.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit3 className="w-4 h-4" />
          Edit Modul
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit: {modul.judul}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Input
            value={draft.judul}
            onChange={(e) => setDraft({ ...draft, judul: e.target.value })}
            placeholder="Judul"
          />
          <Input
            value={draft.tingkat}
            onChange={(e) => setDraft({ ...draft, tingkat: e.target.value })}
            placeholder="Tingkat"
          />
          <Input
            value={draft.deskripsi}
            onChange={(e) => setDraft({ ...draft, deskripsi: e.target.value })}
            placeholder="Deskripsi"
          />
          <Input
            value={draft.videoUrl ?? ""}
            onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })}
            placeholder="URL YouTube (opsional)"
          />
          <div>
            <label className="text-sm font-medium">
              Materi (Markdown ringkas)
            </label>
            <Textarea
              className="mt-1 h-48"
              value={draft.materi}
              onChange={(e) => setDraft({ ...draft, materi: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Flashcards (JSON)</label>
            <Textarea
              className="mt-1 h-40 font-mono"
              value={draft.flashcards}
              onChange={(e) =>
                setDraft({ ...draft, flashcards: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Quiz (JSON)</label>
            <Textarea
              className="mt-1 h-40 font-mono"
              value={draft.quiz}
              onChange={(e) => setDraft({ ...draft, quiz: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Simpan Perubahan</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LearningMediaApp() {
  const [modules, setModules] = useState(DEFAULT_MODULES);
  const [aktif, setAktif] = useState(null);
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("Semua");
  const [modeFokus, setModeFokus] = useState(false);
  const [modeGuru, setModeGuru] = useState(false);
  const { state, setProgres, setCatatan } = usePersistentState();

  const terbuka = useMemo(
    () => modules.find((m) => m.id === aktif) ?? null,
    [aktif, modules]
  );

  const hasilCari = useMemo(() => {
    return modules.filter((m) => {
      const cocokQ = (m.judul + " " + m.deskripsi)
        .toLowerCase()
        .includes(query.toLowerCase());
      const cocokLevel = levelFilter === "Semua" || m.tingkat === levelFilter;
      return cocokQ && cocokLevel;
    });
  }, [modules, query, levelFilter]);

  const progressVal = useMemo(() => state.progres[aktif] ?? 0, [state, aktif]);
  const catatanVal = useMemo(() => state.catatan[aktif] ?? "", [state, aktif]);

  const onScore = (correct, total) => {
    const newProgress = Math.max(
      progressVal,
      Math.round((correct / total) * 100)
    );
    setProgres(aktif, newProgress);
  };

  const saveEditedModule = (updated) => {
    setModules((arr) => arr.map((m) => (m.id === updated.id ? updated : m)));
  };

  return (
    <div
      className={`min-h-screen ${
        modeFokus ? "bg-white" : "bg-gradient-to-b from-white to-slate-50"
      }`}
    >
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-xl font-bold">Media Belajar</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span>Mode Fokus</span>
              <Switch checked={modeFokus} onCheckedChange={setModeFokus} />
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span>Mode Guru</span>
              <Switch checked={modeGuru} onCheckedChange={setModeGuru} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {!terbuka && (
          <section className="space-y-6">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Input
                  placeholder="Cari materi…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select
                className="border rounded-xl p-2"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option>Semua</option>
                <option>SMP</option>
                <option>SMA</option>
                <option>SMK</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hasilCari.map((m) => (
                <ModulCard key={m.id} modul={m} onOpen={setAktif} />
              ))}
            </div>
          </section>
        )}

        {terbuka && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setAktif(null)}>
                Kembali
              </Button>
              <h2 className="text-xl font-bold">{terbuka.judul}</h2>
              <Badge variant="secondary">{terbuka.tingkat}</Badge>
              <div className="ml-auto flex items-center gap-3">
                <Progress className="w-40" value={progressVal} />
                <span className="text-sm text-muted-foreground">
                  Progres {progressVal}%
                </span>
                {modeGuru && (
                  <EditorDialog modul={terbuka} onSave={saveEditedModule} />
                )}
              </div>
            </div>

            <Tabs defaultValue="materi" className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="materi">Materi</TabsTrigger>
                <TabsTrigger value="kuis">Kuis</TabsTrigger>
                <TabsTrigger value="kartu">Kartu</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="catatan">Catatan</TabsTrigger>
              </TabsList>

              <TabsContent value="materi" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="prose max-w-none p-6">
                    <Markdown text={terbuka.materi ?? "Belum ada materi."} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kuis" className="mt-4">
                <Quiz items={terbuka.quiz ?? []} onScore={onScore} />
              </TabsContent>

              <TabsContent value="kartu" className="mt-4">
                <Flashcards cards={terbuka.flashcards ?? []} />
              </TabsContent>

              <TabsContent value="video" className="mt-4">
                {terbuka.videoUrl ? (
                  <div className="rounded-2xl overflow-hidden aspect-video border">
                    <iframe
                      className="w-full h-full"
                      src={terbuka.videoUrl}
                      title="Video pembelajaran"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <Card className="rounded-2xl">
                    <CardContent className="p-6 text-sm text-muted-foreground">
                      Belum ada video.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="catatan" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-6 space-y-3">
                    <Textarea
                      className="h-48"
                      placeholder="Tulis catatanmu di sini…"
                      value={catatanVal}
                      onChange={(e) => setCatatan(aktif, e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground">
                      Catatan tersimpan otomatis di perangkat ini.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        )}
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Dibuat untuk pengembangan media belajar. Anda bebas menyalin &
        memodifikasi.
      </footer>
    </div>
  );
}
