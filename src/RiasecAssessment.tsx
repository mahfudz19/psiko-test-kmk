import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  Compass,
  RotateCcw,
  Sparkles,
} from "lucide-react"

type Dimension = {
  code: string
  name: string
  subtitle: string
  description: string
  subjects: string
  programs: string
  color: string
  light: string
  items: [number, string][]
}

const dimensions: Dimension[] = [
  {
    code: "R",
    name: "Realistic",
    subtitle: "Praktis & teknis",
    description:
      "Senang bekerja dengan alat, benda nyata, dan kegiatan di luar ruangan.",
    subjects: "Fisika, Prakarya, PJOK",
    programs: "Teknik, Pertanian, Konstruksi, Pariwisata",
    color: "bg-teal-600",
    light: "bg-teal-50 text-teal-700",
    items: [
      [1, "Aku suka mengulik peralatan"],
      [3, "Aku suka bekerja mandiri (dengan tangan/alat)"],
      [7, "Aku suka menyusun balok / LEGO"],
      [14, "Aku suka memelihara binatang"],
      [21, "Aku suka mencari tahu cara kerja sebuah alat"],
      [22, "Aku suka merangkaikan atau merakit benda"],
      [37, "Aku suka berkegiatan di luar ruangan"],
    ],
  },
  {
    code: "I",
    name: "Investigative",
    subtitle: "Analitis & ingin tahu",
    description: "Senang mengamati, meneliti, dan memecahkan persoalan.",
    subjects: "Biologi, Kimia, Matematika, Fisika",
    programs: "Kedokteran, Biologi, Kimia, Psikologi",
    color: "bg-blue-600",
    light: "bg-blue-50 text-blue-700",
    items: [
      [2, "Aku suka mengerjakan puzzle"],
      [11, "Aku suka melakukan percobaan / eksperimen"],
      [18, "Aku suka sains"],
      [19, "Aku suka mendapatkan tantangan baru"],
      [26, "Aku suka mencari tahu penyebab suatu kejadian"],
      [32, "Aku suka mempraktikkan hal-hal yang aku pelajari"],
      [33, "Aku suka mengerjakan soal matematika atau grafik"],
    ],
  },
  {
    code: "A",
    name: "Artistic",
    subtitle: "Kreatif & ekspresif",
    description: "Senang mencipta, berimajinasi, dan mengekspresikan ide.",
    subjects: "Seni Budaya, Bahasa Indonesia, Bahasa Inggris",
    programs: "Desain Komunikasi Visual, Seni, Sastra, Arsitektur",
    color: "bg-violet-600",
    light: "bg-violet-50 text-violet-700",
    items: [
      [8, "Aku suka membaca buku tentang seni dan musik"],
      [17, "Aku suka membuat karya berbentuk tulisan"],
      [20, "Aku suka menghibur teman"],
      [23, "Aku adalah orang yang kreatif"],
      [27, "Aku suka memainkan alat musik atau bernyanyi"],
      [31, "Aku suka bermain peran / drama"],
      [41, "Aku suka menggambar"],
    ],
  },
  {
    code: "S",
    name: "Social",
    subtitle: "Peduli & kolaboratif",
    description: "Senang berinteraksi, membantu, dan mengajar orang lain.",
    subjects: "Sosiologi, Antropologi, PPKn, Sejarah",
    programs: "Konseling, Keperawatan, Pendidikan, Public Relation",
    color: "bg-rose-500",
    light: "bg-rose-50 text-rose-700",
    items: [
      [4, "Aku suka bekerja dalam kelompok"],
      [12, "Aku suka menjelaskan sesuatu kepada teman"],
      [13, "Aku suka membantu orang lain memecahkan persoalan"],
      [28, "Aku suka mempelajari budaya berbagai daerah"],
      [34, "Aku suka mendiskusikan hal-hal yang terjadi di sekitarku"],
      [38, "Aku suka berkegiatan di dalam ruangan dengan meja-kursi"],
      [40, "Aku suka menolong orang"],
    ],
  },
  {
    code: "E",
    name: "Enterprising",
    subtitle: "Pemimpin & penggerak",
    description: "Senang memimpin, meyakinkan orang lain, dan membangun usaha.",
    subjects: "Ekonomi, Geografi, Sosiologi",
    programs: "Bisnis, Pemasaran, Hukum, Perbankan",
    color: "bg-amber-500",
    light: "bg-amber-50 text-amber-800",
    items: [
      [5, "Aku suka membuat target untuk diriku sendiri"],
      [10, "Aku suka meyakinkan teman untuk mengikuti caraku"],
      [15, "Aku tidak berkeberatan bekerja melebihi waktu yang ditentukan"],
      [16, "Aku suka menjual sesuatu"],
      [29, "Aku ingin membuka usaha sendiri suatu saat nanti"],
      [36, "Aku suka memimpin kelompok atau kelas"],
      [42, "Aku suka berbicara di depan umum"],
    ],
  },
  {
    code: "C",
    name: "Conventional",
    subtitle: "Rapi & terstruktur",
    description:
      "Senang mengatur, memperhatikan detail, dan bekerja dengan data.",
    subjects: "Matematika, Ekonomi, Informatika",
    programs: "Akuntansi, Administrasi, Asuransi, Pengolahan Data",
    color: "bg-slate-600",
    light: "bg-slate-100 text-slate-700",
    items: [
      [6, "Aku suka merapikan barang-barang (buku, alat tulis, kamar)"],
      [9, "Aku suka mengerjakan hal-hal dengan instruksi yang jelas"],
      [24, "Aku suka memperhatikan detail"],
      [25, "Aku suka merapikan catatan atau LKS"],
      [35, "Aku suka merapikan kamarku"],
      [38, "Aku suka berkegiatan di dalam ruangan dengan meja-kursi"],
      [39, "Aku suka menghitung"],
    ],
  },
]

const choices = [
  { value: 1, short: "STS", label: "Sangat tidak suka" },
  { value: 2, short: "TS", label: "Tidak suka" },
  { value: 3, short: "S", label: "Suka" },
  { value: 4, short: "SS", label: "Sangat suka" },
]

function category(score: number) {
  if (score >= 25) return "Sangat tinggi"
  if (score >= 19) return "Tinggi"
  if (score >= 13) return "Sedang"
  return "Rendah"
}

export default function RiasecAssessment({
  mentors,
}: {
  mentors: { id: number name: string school: string }[]
}) {
  const [stage, setStage] = useState<"intro" | "questions" | "results">("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [identity, setIdentity] = useState({
    name: "Andi Pratama",
    school: "SMAN 1 Jakarta",
    className: "",
    attendance: "",
    mentor: "",
  })
  const current = dimensions[step]
  const completed = dimensions.reduce(
    (total, dimension) =>
      total +
      dimension.items.filter(
        ([number]) => answers[`${dimension.code}-${number}`] !== undefined,
      ).length,
    0,
  )
  const currentCompleted = current.items.filter(
    ([number]) => answers[`${current.code}-${number}`] !== undefined,
  ).length
  const ranked = dimensions
    .map((dimension) => ({
      ...dimension,
      score: dimension.items.reduce(
        (sum, [number]) => sum + (answers[`${dimension.code}-${number}`] ?? 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score)

  function reset() {
    setAnswers({})
    setStep(0)
    setStage("intro")
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 text-slate-900">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 px-7 py-8 text-white shadow-xl sm:px-10 sm:py-10">
        <div
          className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/10"
          aria-hidden="true"
        />
        <div
          className="absolute -right-24 -top-8 h-72 w-72 rounded-full border border-white/10"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-100">
            <Compass size={14} /> PORTAL SISWA / ASESMEN
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Kenali arah potensimu.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-indigo-100 sm:text-base">
            Instrumen minat dan bakat RIASEC membantu kamu memahami
            kecenderungan diri dan mengeksplorasi pilihan studi yang sesuai.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-xs font-medium text-indigo-100">
            <span className="rounded-full bg-white/10 px-3 py-2">
              42 pernyataan
            </span>
            <span className="rounded-full bg-white/10 px-3 py-2">
              6 dimensi minat
            </span>
            <span className="rounded-full bg-white/10 px-3 py-2">
              Tidak ada jawaban salah
            </span>
          </div>
        </div>
      </div>

      {stage === "intro" && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setStage("questions")
            }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-7 flex items-start gap-3">
              <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                <ClipboardList size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Sebelum memulai</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi identitas untuk lembar hasil asesmenmu.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Nama siswa
                <input
                  required
                  value={identity.name}
                  onChange={(event) =>
                    setIdentity({ ...identity, name: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Kelas
                <input
                  required
                  placeholder="Contoh: XI IPA 2"
                  value={identity.className}
                  onChange={(event) =>
                    setIdentity({ ...identity, className: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Sekolah
                <input
                  required
                  value={identity.school}
                  onChange={(event) =>
                    setIdentity({ ...identity, school: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                No. absen
                <input
                  required
                  type="number"
                  min="1"
                  placeholder="Contoh: 12"
                  value={identity.attendance}
                  onChange={(event) =>
                    setIdentity({ ...identity, attendance: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                Guru BK / mentor
                <select
                  required
                  value={identity.mentor}
                  onChange={(event) =>
                    setIdentity({ ...identity, mentor: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">Pilih guru BK / mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.name}>
                      {mentor.name} — {mentor.school}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="submit"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Mulai asesmen <ArrowRight size={18} />
            </button>
          </form>
          <aside className="rounded-2xl border border-violet-100 bg-violet-50 p-6 sm:p-8">
            <div className="mb-5 inline-flex rounded-xl bg-white p-3 text-violet-700 shadow-sm">
              <Sparkles size={22} />
            </div>
            <h2 className="text-xl font-bold">Cara mengerjakan</h2>
            <ol className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
              <li>
                <span className="mr-2 font-bold text-violet-700">01.</span>Baca
                setiap pernyataan dengan saksama.
              </li>
              <li>
                <span className="mr-2 font-bold text-violet-700">02.</span>Pilih
                respons yang paling sesuai dengan dirimu: STS, TS, S, atau SS.
              </li>
              <li>
                <span className="mr-2 font-bold text-violet-700">03.</span>Jawab
                semua pernyataan dengan jujur. Tidak ada jawaban benar atau
                salah.
              </li>
            </ol>
            <div className="mt-7 border-t border-violet-200 pt-5 text-xs leading-relaxed text-slate-500">
              Diadaptasi dari instrumen asesmen minat dan bakat RIASEC yang
              dilampirkan. Butir nomor 38 muncul di dua dimensi dalam dokumen
              sumber dan ditampilkan sesuai aslinya. Hasil ini adalah bahan
              refleksi bersama Guru BK, bukan diagnosis psikologis.
            </div>
          </aside>
        </div>
      )}

      {stage === "questions" && (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Perjalananmu
            </p>
            <p className="mt-2 text-2xl font-bold">
              {completed}
              <span className="text-base font-medium text-slate-400">
                {" "}
                / 42 dijawab
              </span>
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{ width: `${(completed / 42) * 100}%` }}
              />
            </div>
            <div className="mt-6 grid grid-cols-6 gap-2 lg:grid-cols-1">
              {dimensions.map((dimension, index) => {
                const done = dimension.items.every(
                  ([number]) =>
                    answers[`${dimension.code}-${number}`] !== undefined,
                )
                return (
                  <button
                    key={dimension.code}
                    type="button"
                    onClick={() => setStep(index)}
                    aria-label={`Bagian ${dimension.name}${
                      done ? ", selesai" : ""
                    }`}
                    aria-current={index === step ? "step" : undefined}
                    className={`flex items-center gap-3 rounded-xl p-2 text-left transition-colors ${
                      index === step
                        ? "bg-violet-50 text-violet-800"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                        done
                          ? "bg-emerald-100 text-emerald-700"
                          : index === step
                            ? "bg-violet-600 text-white"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {done ? <Check size={17} /> : dimension.code}
                    </span>
                    <span className="hidden text-sm font-semibold lg:block">
                      {dimension.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-700">
                  Bagian {step + 1} dari 6
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {currentCompleted} dari 7 dijawab
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white ${current.color}`}
                >
                  {current.code}
                </span>
                <div>
                  <h2 className="text-2xl font-bold">{current.name}</h2>
                  <p className="text-sm text-slate-500">
                    {current.subtitle} · Pilih satu jawaban untuk setiap
                    pernyataan.
                  </p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-100 px-5 sm:px-8">
              {current.items.map(([number, text], index) => (
                <fieldset key={`${current.code}-${number}`} className="py-5">
                  <legend className="w-full text-sm font-semibold leading-relaxed text-slate-800">
                    <span className="mr-2 text-violet-600">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    {text}
                  </legend>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {choices.map((choice) => {
                      const selected =
                        answers[`${current.code}-${number}`] === choice.value
                      return (
                        <label
                          key={choice.value}
                          className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs font-semibold transition-all ${
                            selected
                              ? "border-violet-500 bg-violet-50 text-violet-800 ring-1 ring-violet-500"
                              : "border-slate-200 text-slate-500 hover:border-violet-300 hover:bg-violet-50/40"
                          }`}
                        >
                          <input
                            className="sr-only"
                            type="radio"
                            name={`${current.code}-${number}`}
                            value={choice.value}
                            checked={selected}
                            onChange={() =>
                              setAnswers((previous) => ({
                                ...previous,
                                [`${current.code}-${number}`]: choice.value,
                              }))
                            }
                          />
                          <span className="block text-sm font-bold">
                            {choice.short}
                          </span>
                          <span className="mt-0.5 block font-normal">
                            {choice.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:px-8">
              <button
                type="button"
                onClick={() => setStep((previous) => Math.max(0, previous - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={17} /> Sebelumnya
              </button>
              <button
                type="button"
                disabled={
                  currentCompleted < 7 || (step === 5 && completed < 42)
                }
                onClick={() => {
                  if (step === 5) setStage("results")
                  else setStep((previous) => previous + 1)
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {step === 5 ? "Lihat hasil" : "Bagian berikutnya"}{" "}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === "results" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-700">
                Profil minatmu
              </span>
              <h2 className="mt-3 text-5xl font-extrabold tracking-tight text-indigo-950">
                {ranked
                  .slice(0, 3)
                  .map((d) => d.code)
                  .join("")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Kode Holland berdasarkan tiga dimensi dengan skor tertinggi.
                Dimensi teratasmu adalah <strong>{ranked[0].name}</strong>.
              </p>
              <div className="mt-7 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-500">
                <p>
                  {identity.name} · {identity.className} · {identity.school}
                </p>
                <p>
                  No. absen {identity.attendance} ·{" "}
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>Guru BK / mentor: {identity.mentor}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-bold">Peta enam dimensi</h2>
              <p className="mt-1 text-xs text-slate-500">
                Jumlah skor dari 7 pernyataan per dimensi (maksimum 28).
              </p>
              <div className="mt-6 space-y-4">
                {ranked.map((d) => (
                  <div
                    key={d.code}
                    className="grid grid-cols-[32px_1fr_55px] items-center gap-3"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${d.color}`}
                    >
                      {d.code}
                    </span>
                    <div>
                      <div className="mb-1.5 flex justify-between gap-2 text-xs font-semibold">
                        <span>{d.name}</span>
                        <span className="text-slate-500">
                          {category(d.score)}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${d.color}`}
                          style={{ width: `${(d.score / 28) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-right text-sm font-bold text-slate-700">
                      {d.score}/28
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-violet-700">
              <Sparkles size={19} />
              <h2 className="text-lg font-bold text-slate-900">
                Ide eksplorasi untukmu
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {ranked.slice(0, 3).map((d, index) => (
                <div
                  key={d.code}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                >
                  <span
                    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${d.light}`}
                  >
                    #{index + 1} · {d.name}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {d.description}
                  </p>
                  <p className="mt-4 text-xs font-bold text-slate-700">
                    Mata pelajaran terkait
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {d.subjects}
                  </p>
                  <p className="mt-3 text-xs font-bold text-slate-700">
                    Contoh bidang studi
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {d.programs}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-sm leading-relaxed text-indigo-900">
              Hasil ini bukan keputusan akhir peminatan. Diskusikan bersama Guru
              BK dan pertimbangkan nilai akademik, rencana karier, serta
              pengalamanmu. Jika skor beberapa dimensi sama, mintalah
              klarifikasi melalui konseling.
            </p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
            >
              <RotateCcw size={16} /> Ulangi asesmen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
