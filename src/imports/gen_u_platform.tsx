import React, { useEffect, useState } from 'react';
import RiasecAssessment from '../RiasecAssessment';
import landingPersonOne from './landing-person-1.png';
import landingPersonTwo from './landing-person-2.png';
import landingPersonThree from './landing-person-3.png';
import landingAboutCampus from './landing-about-campus.jpg';
import { 
  Home, Info, LayoutDashboard, User, BookOpen, Compass, 
  FileText, Calendar, Users, Settings, Lock, LogOut, 
  ChevronRight, CheckSquare, GraduationCap, Clock, 
  Menu, X, Shield, PlusCircle, Database, CheckCircle,
  Briefcase
} from 'lucide-react';


// --- DUMMY DATA ---
const dummyMajors = [
  { id: 1, name: 'Teknik Informatika', category: 'Saintek', description: 'Mempelajari komputasi, perangkat lunak, dan sistem informasi.' },
  { id: 2, name: 'Kedokteran', category: 'Saintek', description: 'Mempelajari ilmu medis, anatomi, dan kesehatan manusia.' },
  { id: 3, name: 'Ilmu Hukum', category: 'Soshum', description: 'Mempelajari perundang-undangan, tata negara, dan hukum pidana/perdata.' },
  { id: 4, name: 'Manajemen Bisnis', category: 'Soshum', description: 'Mempelajari pengelolaan organisasi, pemasaran, dan keuangan.' },
  { id: 5, name: 'Desain Komunikasi Visual', category: 'Seni', description: 'Mempelajari desain grafis, tipografi, dan media visual.' }
];

const landingSlides = [
  { title: <>KENALI PASSIONMU<br />TENTUKAN MASA DEPANMU</>, image: landingPersonOne, alt: 'Beragam profesional muda menyatukan tangan' },
  { title: <>MASIH BINGUNG<br />DENGAN BAKAT<br />&amp; MINATMU?</>, image: landingPersonTwo, alt: 'Siswa sedang memikirkan bakat dan minatnya' },
  { title: <>YUK.....!<br />KENALI LEBIH<br />DALAM PASSIONMU</>, image: landingPersonThree, alt: 'Siswa antusias menjelajahi minatnya' },
];

const universitasPrograms = [
  { id:"d3-farmasi", group:"kesehatan", jenjang:"D3", title:"D3 Farmasi", teaser:"Belajar dasar-dasar meracik obat, pelayanan farmasi, dan teknik laboratorium dasar.", apa:"Program Diploma 3 Farmasi fokus pada penciptaan Tenaga Teknis Kefarmasian (TTK) yang terampil. Kamu akan banyak menghabiskan waktu di laboratorium, mempelajari cara membuat sediaan obat yang tepat dan aman.", kuliah:["Praktikum resep obat dan sediaan farmasi (tablet, sirup, salep).","Simulasi pelayanan di apotek dan instalasi farmasi rumah sakit.","Mempelajari bahan alam untuk pengobatan tradisional."], karir:["Asisten Apoteker di Apotek, Klinik, atau Rumah Sakit.","Teknisi di industri farmasi dan kosmetik.","Staf QC (Quality Control) di pabrik obat."] },
  { id:"s1-farmasi", group:"kesehatan", jenjang:"S1", title:"S1 Farmasi", teaser:"Mendalami ilmu kimia medisinal, farmakologi, dan desain sediaan obat yang lebih kompleks.", apa:"S1 Farmasi mempelajari ilmu kefarmasian secara mendalam, tidak hanya meracik tapi juga menganalisis dan mendesain obat. Lulusan sarjana (S.Farm) dibekali pemahaman sains yang kuat sebagai pondasi menjadi ahli farmasi atau peneliti.", kuliah:["Mempelajari nasib obat dalam tubuh (Farmakokinetika).","Uji efektivitas dan keamanan obat (Farmakologi & Toksikologi).","Manajemen farmasi klinis dan kesehatan masyarakat.","Riset mandiri melalui penyusunan skripsi."], karir:["Research & Development (R&D) di industri farmasi.","Regulator di BPOM atau instansi kesehatan.","*Syarat wajib untuk lanjut mengambil Program Profesi Apoteker."] },
  { id:"profesi-apoteker", group:"kesehatan", jenjang:"PROFESI", title:"Profesi Apoteker", teaser:"Program lanjutan wajib untuk mendapatkan izin praktik (SIPA) sebagai penanggung jawab.", apa:"Program Profesi Apoteker (Apt.) adalah pendidikan pascasarjana singkat (sekitar 1 tahun) yang wajib diambil lulusan S1 Farmasi jika ingin memiliki kewenangan penuh sebagai Apoteker Praktik.", kuliah:["Kuliah Kerja Praktik (PKPA) langsung di Apotek, Rumah Sakit, dan Industri.","Simulasi kasus klinis pasien nyata.","Ujian Kompetensi Apoteker Indonesia (UKAI)."], karir:["Apoteker Penanggung Jawab Apotek (APA).","Apoteker Klinis di Rumah Sakit.","Manajer Produksi/QC/QA di Industri Farmasi."] },
  { id:"d3-kebidanan", group:"kesehatan", jenjang:"D3", title:"D3 Kebidanan", teaser:"Fokus pada keterampilan praktis menolong persalinan normal dan asuhan kebidanan esensial.", apa:"D3 Kebidanan mencetak bidan pelaksana yang sangat terampil secara teknis. Fokusnya adalah pada tindakan klinis asuhan kehamilan, persalinan normal, nifas, dan perawatan bayi baru lahir.", kuliah:["Praktikum skill lab menolong persalinan (dengan manekin/phantom).","Praktik klinik langsung di Bidan Praktik Mandiri (BPM) atau Puskesmas.","Mata kuliah anatomi, fisiologi reproduksi, dan KIA."], karir:["Bidan Pelaksana di Rumah Sakit, Puskesmas, atau Klinik Bersalin.","Asisten bidan senior di Bidan Praktik Mandiri."] },
  { id:"s1-kebidanan", group:"kesehatan", jenjang:"S1", title:"S1 Kebidanan", teaser:"Mempelajari asuhan kebidanan yang berbasis bukti (evidence-based) dan penanganan komplikasi awal.", apa:"S1 Kebidanan (S.Keb) membekali mahasiswa dengan kemampuan analitis, pemahaman komplikasi kebidanan, serta pendekatan asuhan berbasis bukti ilmiah. S1 merupakan syarat dasar untuk lanjut profesi bidan.", kuliah:["Pendalaman asuhan kebidanan komprehensif.","Deteksi dini komplikasi pada kehamilan dan persalinan.","Riset dan penyusunan skripsi terkait kesehatan ibu dan anak."], karir:["Pendidik/Instruktur klinis kebidanan (dengan pendidikan tambahan).","Peneliti kesehatan ibu dan anak.","*Syarat wajib untuk lanjut mengambil Program Profesi Bidan."] },
  { id:"profesi-bidan", group:"kesehatan", jenjang:"PROFESI", title:"Profesi Bidan", teaser:"Syarat mutlak untuk membuka Bidan Praktik Mandiri (BPM) dan memberikan asuhan secara mandiri.", apa:"Program Profesi Bidan (Bd.) memberikan kewenangan legal penuh kepada lulusan S1 Kebidanan untuk melakukan praktik kebidanan mandiri. Mahasiswa akan dilepas untuk menangani kasus nyata di bawah supervisi.", kuliah:["Rotasi stase praktik klinik di Rumah Sakit rujukan dan Puskesmas.","Stase komunitas (terjun langsung ke desa/masyarakat).","Ujian Kompetensi Bidan (UKB)."], karir:["Membuka Bidan Praktik Mandiri (BPM) atau Klinik Bersalin.","Bidan Penanggung Jawab di fasilitas layanan kesehatan.","Koordinator KIA di Dinas Kesehatan."] },
  { id:"s1-manajemen", group:"tech", jenjang:"S1", title:"S1 Manajemen", teaser:"Ilmu tentang bagaimana merencanakan, mengorganisasi, dan memimpin perusahaan mencapai tujuan bisnis.", apa:"Program studi Manajemen mengajarkan seni dan ilmu dalam mengelola sumber daya—baik manusia, keuangan, maupun operasional—untuk mencapai tujuan organisasi/perusahaan secara efektif dan efisien.", kuliah:["Studi kasus perusahaan nyata, dari startup hingga multinasional.","Simulasi bisnis dan strategi pemasaran.","Mempelajari analisis keuangan dan investasi dasar."], karir:["Manajer Operasional atau Pemasaran (Marketing).","Human Resources (HR) Officer.","Wirausahawan (Entrepreneur) / Business Owner."] },
  { id:"s1-akuntansi", group:"tech", jenjang:"S1", title:"S1 Akuntansi", teaser:"Bahasa bisnis. Belajar mencatat, melaporkan, dan menganalisis kondisi keuangan suatu entitas.", apa:"Akuntansi adalah tulang punggung setiap organisasi. Jurusan ini melatih ketelitian dalam mengelola laporan keuangan, audit, serta perpajakan sesuai standar akuntansi yang berlaku.", kuliah:["Praktikum menyusun laporan keuangan (Jurnal, Buku Besar, Neraca).","Belajar aplikasi software akuntansi dan ERP.","Mempelajari hukum pajak dan teknik audit laporan."], karir:["Auditor di Kantor Akuntan Publik (KAP).","Konsultan Pajak atau Analis Keuangan.","Akuntan Perusahaan (Corporate Accountant)."] },
  { id:"s1-hukum", group:"tech", jenjang:"S1", title:"S1 Hukum Bisnis", teaser:"Memahami perundang-undangan dan instrumen legal yang mengatur jalannya bisnis dan korporasi.", apa:"Hukum Bisnis (Corporate Law) berfokus pada regulasi perdagangan, kontrak bisnis, hak kekayaan intelektual (HKI), hingga penyelesaian sengketa perusahaan. Menggabungkan nalar hukum dan insting bisnis.", kuliah:["Analisis kasus kontrak bisnis dan sengketa perdata.","Simulasi peradilan (Moot Court) kasus komersial.","Drafting dokumen legal (perjanjian kerja, akta perusahaan)."], karir:["Legal Officer / In-house Counsel perusahaan.","Konsultan Hukum Kekayaan Intelektual.","Pengacara Bisnis (dengan syarat lanjut PKPA)."] },
  { id:"s1-if", group:"tech", jenjang:"S1", title:"S1 Informatika", teaser:"Mempelajari komputasi murni, algoritma kompleks, dan rekayasa perangkat lunak (Software Engineering).", apa:"Teknik Informatika (Computer Science) mendalami bagaimana komputer memproses data. Jurusan ini sangat teknis, sarat dengan logika matematika, coding, dan penciptaan algoritma untuk memecahkan masalah.", kuliah:["Menulis kode program (coding) menggunakan berbagai bahasa (Python, Java, C++).","Membangun aplikasi mobile, web, hingga kecerdasan buatan (AI).","Mempelajari struktur data dan keamanan siber."], karir:["Software Engineer / Web & Mobile Developer.","Machine Learning / AI Engineer.","Cybersecurity Analyst."] },
  { id:"s1-si", group:"tech", jenjang:"S1", title:"S1 Sistem Informasi", teaser:"Jembatan antara teknologi IT dan kebutuhan bisnis. Fokus pada perancangan sistem berbasis data.", apa:"Sistem Informasi menggabungkan ilmu komputer dengan manajemen bisnis. Lulusannya bertugas menerjemahkan 'apa yang dibutuhkan perusahaan' menjadi 'sistem aplikasi yang efisien'.", kuliah:["Analisis proses bisnis perusahaan.","Merancang basis data (Database Design) dan arsitektur sistem.","Belajar UI/UX Design dan Manajemen Proyek IT."], karir:["System Analyst atau Business Analyst.","IT Project Manager.","UI/UX Researcher & Designer."] },
  { id:"s1-komunikasi", group:"tech", jenjang:"S1", title:"S1 Ilmu Komunikasi", teaser:"Seni menyampaikan pesan secara efektif melalui media massa, digital, dan relasi publik.", apa:"Ilmu Komunikasi mempelajari bagaimana pesan diproduksi, disebarkan, dan diterima. Berfokus pada dinamika media modern, jurnalistik, hingga strategi membangun citra positif perusahaan (Public Relations).", kuliah:["Praktikum penulisan naskah (copywriting), rilis berita, dan artikel.","Simulasi public speaking dan negosiasi.","Produksi konten kreatif (podcast, video, kampanye media sosial)."], karir:["Public Relations (PR) / Hubungan Masyarakat.","Digital Content Creator / Social Media Specialist.","Jurnalis atau Broadcaster."] },
];

const MiniCard = ({ p, isProfesi, onClick }) => (
  <div onClick={onClick} className={`flex-1 border rounded-[10px] p-[13px] px-[15px] cursor-pointer transition-all hover:-translate-y-[3px] hover:shadow-[0_10px_16px_-12px_rgba(21,44,42,0.35)] bg-[#EEF3EF] ${isProfesi ? 'border-dashed border-[#CBD5CC] hover:border-[#8A5A18]' : 'border-[#CBD5CC] hover:border-[#2F6F62]'}`}>
    <div className="flex justify-between items-center mb-[7px] gap-2">
      <span className="font-bold text-[14px] text-[#152C2A]">{p?.title}</span>
      <span className={`text-[10px] font-bold px-[7px] py-[2px] rounded shrink-0 border ${isProfesi ? 'text-[#8A5A18] bg-[#F2E3C6] border-[#8A5A18]' : 'text-[#2F6F62] bg-[#DEEDE7] border-[#2F6F62]'} font-mono tracking-widest`}>
        {p?.jenjang}
      </span>
    </div>
    <p className="text-[12.5px] text-[#3E5551] leading-relaxed m-0">{p?.teaser}</p>
    {isProfesi && <span className="block mt-2 text-[9.5px] text-[#8A5A18] uppercase tracking-widest font-mono">Jenjang pendidikan lanjutan</span>}
  </div>
);

const JurusanView = () => {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('apa');

  const showKesehatan = filter === 'all' || filter === 'kesehatan';
  const showTech = filter === 'all' || filter === 'tech';

  const tracks = [
    { name:"Jalur Farmasi", blurb:"Meracik, menguji, dan mengelola obat, dari bangku kuliah hingga praktik profesional.", vokasi:"d3-farmasi", sarjana:"s1-farmasi", profesi:"profesi-apoteker" },
    { name:"Jalur Kebidanan", blurb:"Mendampingi ibu dan bayi sejak kehamilan hingga masa nifas dengan asuhan yang aman.", vokasi:"d3-kebidanan", sarjana:"s1-kebidanan", profesi:"profesi-bidan" },
  ];

  const techPrograms = universitasPrograms.filter(p => p.group === 'tech');

  return (
    <div className="font-serif bg-[#EEF3EF] -m-4 md:-m-8 p-4 md:p-8 min-h-screen bg-[linear-gradient(#DEE5DE_1px,transparent_1px),linear-gradient(90deg,#DEE5DE_1px,transparent_1px)] bg-[size:32px_32px]">
      
      {/* Hero Section */}
      <header className="max-w-5xl mx-auto py-8 md:py-12 relative z-10">
        <div className="inline-flex items-center gap-2 text-[12.5px] uppercase tracking-[0.12em] text-[#3E5551] mb-6">
          <div className="w-5 h-[1px] bg-[#3E5551]"></div>
          Panduan untuk siswa SMA / SMK / MA
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.02] mb-5 tracking-tight text-[#152C2A] font-sans">
              Jelajah <em className="not-italic text-[#1D473D] underline decoration-[#C0812A] decoration-4 underline-offset-[6px]">jurusan</em>,<br/>temukan jalanmu.
            </h1>
            <p className="text-lg text-[#3E5551] mb-7 max-w-prose">
              Sebelum menentukan pilihan, kenali dulu isi sebenarnya dari 12 program studi — apa yang dipelajari, seperti apa kuliahnya sehari-hari, dan ke mana jalur kariernya bisa membawamu.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => setFilter('kesehatan')} className="px-5 py-2.5 rounded-full font-bold text-sm bg-[#152C2A] text-[#FBFAF4] hover:bg-[#1D473D] transition-all hover:-translate-y-0.5 font-sans">Rumpun Kesehatan</button>
              <button onClick={() => setFilter('tech')} className="px-5 py-2.5 rounded-full font-bold text-sm border-2 border-[#152C2A] text-[#152C2A] bg-transparent hover:bg-[#152C2A]/5 transition-all font-sans hover:-translate-y-0.5">Bisnis, Teknologi & Sosial</button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <svg className="w-full max-w-[240px] h-auto" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="130" cy="130" r="110" stroke="#CBD5CC" strokeWidth="1.5"/>
              <circle cx="130" cy="130" r="80" stroke="#CBD5CC" strokeWidth="1"/>
              <path d="M130 20 L130 240 M20 130 L240 130" stroke="#CBD5CC" strokeWidth="1"/>
              <path d="M130 130 L188 66" stroke="#2F6F62" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M130 130 L182 176" stroke="#38507C" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="130" cy="130" r="7" fill="#152C2A"/>
              <circle cx="188" cy="66" r="5" fill="#2F6F62"/>
              <circle cx="182" cy="176" r="5" fill="#38507C"/>
              <text x="196" y="58" fontFamily="monospace" fontSize="9" fill="#1D473D">KESEHATAN</text>
              <text x="150" y="196" fontFamily="monospace" fontSize="9" fill="#233458">BISNIS/TEK/SOSIAL</text>
            </svg>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-5xl mx-auto mb-10 grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[#CBD5CC] border border-[#CBD5CC] rounded-xl overflow-hidden relative z-10 shadow-sm">
        {[
          { num: '12', lbl: 'program studi' },
          { num: '3', lbl: 'jenjang: D3, S1, Profesi' },
          { num: '2', lbl: 'rumpun keilmuan' },
          { num: '2026', lbl: 'terkoneksi industri' },
        ].map((s,i) => (
          <div key={i} className="bg-[#FBFAF4] p-5">
            <div className="text-3xl font-bold text-[#152C2A] mb-1 font-sans">{s.num}</div>
            <div className="text-xs text-[#3E5551] font-sans">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-[#EEF3EF]/90 border-b border-[#CBD5CC] py-3 -mx-4 px-4 md:-mx-8 md:px-8 mb-10">
        <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap">
          <span className="text-[11.5px] text-[#3E5551] uppercase tracking-widest mr-2 font-bold font-sans">Tampilkan</span>
          <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all border font-sans ${filter === 'all' ? 'bg-[#152C2A] text-white border-[#152C2A]' : 'bg-[#FBFAF4] text-[#3E5551] border-[#CBD5CC] hover:border-[#152C2A] hover:text-[#152C2A]'}`}>Semua program</button>
          <button onClick={() => setFilter('kesehatan')} className={`px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all border font-sans ${filter === 'kesehatan' ? 'bg-[#2F6F62] text-white border-[#2F6F62]' : 'bg-[#FBFAF4] text-[#3E5551] border-[#CBD5CC] hover:border-[#152C2A] hover:text-[#152C2A]'}`}>Kesehatan</button>
          <button onClick={() => setFilter('tech')} className={`px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all border font-sans ${filter === 'tech' ? 'bg-[#38507C] text-white border-[#38507C]' : 'bg-[#FBFAF4] text-[#3E5551] border-[#CBD5CC] hover:border-[#152C2A] hover:text-[#152C2A]'}`}>Bisnis, Teknologi & Sosial</button>
        </div>
      </div>

      {/* Rumpun Kesehatan (Tracks) */}
      {showKesehatan && (
        <section className="max-w-5xl mx-auto mb-16 animate-in fade-in duration-500 relative z-10">
          <div className="flex items-baseline gap-3 mb-6">
            <div className="w-3 h-3 rounded-[3px] bg-[#2F6F62]"></div>
            <h2 className="text-2xl font-bold text-[#152C2A] m-0 font-sans">Rumpun Kesehatan</h2>
            <span className="text-sm text-[#3E5551] font-sans">6 Program Studi</span>
          </div>
          <p className="text-[14.5px] text-[#3E5551] max-w-[70ch] mb-6">Jalur keilmuan untuk kamu yang ingin terjun langsung menyelamatkan dan merawat nyawa manusia. Kesehatan memiliki hierarki jenjang yang jelas dari <b>Vokasi (D3)</b>, <b>Sarjana (S1)</b>, hingga program kewenangan klinis yaitu <b>Profesi</b>.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {tracks.map(t => {
               const vokasi = universitasPrograms.find(p => p.id === t.vokasi);
               const sarjana = universitasPrograms.find(p => p.id === t.sarjana);
               const profesi = universitasPrograms.find(p => p.id === t.profesi);
               return (
                 <div key={t.name} className="bg-[#FBFAF4] border border-[#CBD5CC] rounded-[14px] p-6 shadow-[0_1px_0_rgba(21,44,42,0.06)]">
                   <h3 className="text-xl font-bold text-[#152C2A] mb-1 font-sans">{t.name}</h3>
                   <p className="text-[13.5px] text-[#3E5551] mb-6">{t.blurb}</p>

                   <div className="mb-6">
                     <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#3E5551] font-mono mb-3">
                       <span>Kuliah dasar &middot; vokasi mandiri</span>
                       <div className="flex-1 h-[1px] bg-[#CBD5CC]"></div>
                     </div>
                     <div className="flex">
                        <MiniCard p={vokasi} isProfesi={false} onClick={() => { setSelected(vokasi); setTab('apa'); }} />
                     </div>
                   </div>

                   <div>
                     <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#3E5551] font-mono mb-3">
                       <span>Kuliah dasar &middot; berlanjut ke profesi</span>
                       <div className="flex-1 h-[1px] bg-[#CBD5CC]"></div>
                     </div>
                     <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
                        <MiniCard p={sarjana} isProfesi={false} onClick={() => { setSelected(sarjana); setTab('apa'); }} />
                        <div className="flex items-center justify-center text-[#CBD5CC] py-1 sm:py-0 rotate-90 sm:rotate-0 shrink-0">
                          <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5"><path d="M2 8H14M14 8L9.5 3.5M14 8L9.5 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                        </div>
                        <MiniCard p={profesi} isProfesi={true} onClick={() => { setSelected(profesi); setTab('apa'); }} />
                     </div>
                   </div>
                 </div>
               )
            })}
          </div>
        </section>
      )}

      {/* Rumpun Bisnis, Tech, Sosial (Cards) */}
      {showTech && (
        <section className="max-w-5xl mx-auto mb-16 animate-in fade-in duration-500 relative z-10">
          <div className="flex items-baseline gap-3 mb-6">
            <div className="w-3 h-3 rounded-[3px] bg-[#38507C]"></div>
            <h2 className="text-2xl font-bold text-[#152C2A] m-0 font-sans">Bisnis, Teknologi & Sosial</h2>
            <span className="text-sm text-[#3E5551] font-sans">6 Program Studi</span>
          </div>
          <p className="text-[14.5px] text-[#3E5551] max-w-[70ch] mb-6">Fokus pada pengelolaan organisasi, penciptaan sistem digital, dan dinamika komunikasi masyarakat. Seluruh program di rumpun ini berjenjang <b>Sarjana (S1)</b> murni, di mana kamu bisa langsung berkarier begitu lulus.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {techPrograms.map((p, i) => (
               <div key={p.id} onClick={() => { setSelected(p); setTab('apa'); }} className="relative bg-[#FBFAF4] border border-[#CBD5CC] rounded-[14px] p-[22px] px-[20px] pb-[20px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_18px_-14px_rgba(21,44,42,0.35)] hover:border-[#3E5551] group">
                  <div className="absolute top-0 left-[18px] right-[18px] h-px bg-[radial-gradient(circle,#CBD5CC_1.4px,transparent_1.4px)] bg-[size:10px_1px] bg-top -mt-px"></div>
                  <div className="flex justify-between items-start mb-[14px]">
                    <span className="text-[10px] font-bold px-[8px] py-[3px] rounded-[5px] border -rotate-3 text-[#38507C] bg-[#E1E7F2] border-[#38507C] font-mono tracking-widest">{p.jenjang}</span>
                    <span className="text-[11px] text-[#3E5551] font-mono opacity-70">N&deg;{String(i+1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-[19px] font-bold text-[#152C2A] mb-2 font-sans leading-tight">{p.title}</h3>
                  <p className="text-[14px] text-[#3E5551] mb-[18px] leading-relaxed line-clamp-3">{p.teaser}</p>
                  <span className="text-[12.5px] font-bold text-[#38507C] flex items-center gap-[6px] font-sans">
                    Buka profil rinci
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-transform group-hover:translate-x-[3px]"><path d="M2 6H10M10 6L6.5 2.5M10 6L6.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </span>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* Tips Section */}
      <section className="max-w-5xl mx-auto py-10 border-t border-[#CBD5CC]/50 relative z-10">
         <h2 className="text-2xl font-bold text-[#152C2A] mb-6 font-sans">Sebelum memutuskan</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             "<b>Kenali dirimu dulu.</b> Suka menghitung dan menganalisis, suka bergaul dan bicara di depan umum, atau suka praktik langsung membantu orang?",
             "<b>Cocokkan dengan mapel favorit.</b> Biologi & Kimia dekat dengan Farmasi dan Kebidanan. Matematika dekat dengan Informatika dan Akuntansi.",
             "<b>Perhatikan ritme kuliahnya.</b> Sebagian jurusan berat di praktik lab dan klinik, sebagian lain lebih ke studi kasus, proyek, dan riset.",
             "<b>Lihat jenjang lanjutannya.</b> Beberapa jurusan (Farmasi, Kebidanan, Hukum, Akuntansi) punya jalur profesi lanjutan yang membuka peran tertentu secara resmi."
           ].map((note, i) => (
             <div key={i} className="bg-[#FBFAF4] border border-[#CBD5CC] border-l-[3px] border-l-[#C0812A] rounded-lg p-5 text-[14.5px] text-[#3E5551] leading-relaxed shadow-sm" dangerouslySetInnerHTML={{__html: note}}></div>
           ))}
         </div>
      </section>

      {/* Modal Dossier */}
      {selected && (
        <div className="fixed inset-0 bg-[#152C2A]/50 flex items-center justify-center p-4 md:p-12 z-50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-[#FBFAF4] w-full max-w-2xl max-h-full rounded-2xl border border-[#CBD5CC] shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col font-sans" onClick={e => e.stopPropagation()}>
             {/* Header */}
             <div className="p-6 md:p-8 border-b border-[#CBD5CC] shrink-0">
               <div className="flex justify-between items-start mb-4">
                 <span className={`text-[10px] font-bold px-[8px] py-[3px] rounded-[5px] border -rotate-3 font-mono tracking-widest ${selected.group === 'kesehatan' ? 'text-[#2F6F62] bg-[#DEEDE7] border-[#2F6F62]' : 'text-[#38507C] bg-[#E1E7F2] border-[#38507C]'}`}>
                   {selected.jenjang}
                 </span>
                 <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full border border-[#CBD5CC] flex items-center justify-center text-[#3E5551] hover:bg-[#152C2A] hover:text-[#FBFAF4] transition-colors"><X size={16}/></button>
               </div>
               <h2 className="text-3xl font-bold text-[#152C2A]">{selected.title}</h2>
             </div>
             
             {/* Tabs Container */}
             <div className="flex gap-1.5 px-6 md:px-8 pt-5 border-b border-[#CBD5CC] bg-[#EEF3EF] shrink-0 overflow-x-auto no-scrollbar">
               {['apa', 'kuliah', 'karir'].map(t => (
                 <button key={t} onClick={() => setTab(t)} className={`px-[16px] py-[10px] text-[13.5px] font-bold rounded-t-[10px] border transition-colors whitespace-nowrap ${tab === t ? 'bg-[#FBFAF4] border-[#CBD5CC] text-[#152C2A] border-b-[#FBFAF4] translate-y-[1px]' : 'border-transparent text-[#3E5551] hover:bg-[#CBD5CC]/30'}`}>
                   {t === 'apa' ? 'Apa itu?' : t === 'kuliah' ? 'Kegiatan kuliah' : 'Jenjang karier'}
                 </button>
               ))}
             </div>
             
             {/* Content Area */}
             <div className="p-6 md:p-8 overflow-y-auto text-[#152C2A] font-serif flex-1">
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 {tab === 'apa' && <p className="leading-[1.8] text-[15.5px]">{selected.apa}</p>}
                 {tab === 'kuliah' && (
                    <ul className="space-y-3">
                      {selected.kuliah.map((k,i) => (
                        <li key={i} className="flex items-start gap-3 text-[15.5px] leading-[1.6]">
                          <span className="mt-[6px] w-[5px] h-[5px] shrink-0 rounded-full bg-[#C0812A]"></span>
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                 )}
                 {tab === 'karir' && (
                    <ul className="space-y-3">
                      {selected.karir.map((k,i) => (
                        <li key={i} className="flex items-start gap-3 text-[15.5px] leading-[1.6]">
                          <span className="mt-[6px] w-[5px] h-[5px] shrink-0 rounded-full bg-[#38507C]"></span>
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                 )}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const dummyMentors = [
  { id: 1, name: 'Bpk. Budi Santoso, M.Psi', school: 'SMAN 1 Jakarta', expertise: 'Konseling Karir' },
  { id: 2, name: 'Ibu Siti Aminah, S.Pd', school: 'SMAN 3 Bandung', expertise: 'Tes Minat Bakat' },
  { id: 3, name: 'Bpk. Ahmad Riza, M.Pd', school: 'SMAN 5 Surabaya', expertise: 'Perencanaan Studi' }
];

const dummyStudents = [
  { id: 1, name: 'Andi Pratama', npsn: '20101111', testStatus: 'Selesai', pmbScore: 85 },
  { id: 2, name: 'Rina Melati', npsn: '20101112', testStatus: 'Belum', pmbScore: '-' },
  { id: 3, name: 'Bagas Kusuma', npsn: '20101113', testStatus: 'Selesai', pmbScore: 92 },
  { id: 4, name: 'Diana Putri', npsn: '20101114', testStatus: 'Proses', pmbScore: '-' }
];

export default function GenUApp() {
  const [currentView, setCurrentView] = useState('landing'); // landing, login, register, student, guru, admin
  const [registrationRole, setRegistrationRole] = useState<'siswa' | 'guru'>('siswa');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [simulasiStarted, setSimulasiStarted] = useState(false);
  const [landingSlide, setLandingSlide] = useState(0);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const visibleLandingSlide = landingSlide % landingSlides.length;

  useEffect(() => {
    if (currentView !== 'landing' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setLandingSlide(previous => (previous % landingSlides.length + 1) % landingSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [currentView]);

  // Helper to switch views
  const navigateTo = (view, defaultTab = 'dashboard') => {
    setCurrentView(view);
    setActiveTab(defaultTab);
    setSidebarOpen(false);
    setSimulasiStarted(false);
    window.scrollTo(0, 0);
  };


  const PortalLayout = ({ children, role, menuItems }) => (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 ${role === 'admin' ? 'bg-slate-900 text-white' : 'bg-white border-r border-gray-200'} transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className={`p-4 lg:p-6 flex items-center justify-between ${role === 'admin' ? 'border-b border-slate-700' : 'border-b border-gray-100'}`}>
          <div className="flex items-center gap-2">
            {role !== 'admin' ? (
              <button type="button" onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }} className="flex items-center gap-2 rounded-lg text-left transition-colors hover:bg-blue-50" aria-label={`${role === 'siswa' ? 'Profil Saya, Andi Pratama' : 'Profil Guru, Budi Santoso'}`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{role === 'siswa' ? 'S' : 'G'}</span>
                <span className="flex flex-col leading-tight"><span className="text-sm font-bold text-gray-800">{role === 'siswa' ? 'Andi Pratama' : 'Budi Santoso'}</span><span className="text-xs text-gray-500">{role === 'siswa' ? 'Profil Saya' : 'Profil Guru'}</span></span>
              </button>
            ) : (
              <div className="p-2 rounded-lg bg-indigo-500 text-white">
                <Shield size={20} />
              </div>
            )}
            {role === 'admin' && <span className="text-xl font-bold text-white">Gen-U <span className="text-sm font-normal opacity-75">ADMIN</span></span>}
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} className={role === 'admin' ? 'text-gray-300' : 'text-gray-500'} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); setSimulasiStarted(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? (role === 'admin' ? 'bg-slate-800 text-indigo-400' : 'bg-blue-50 text-blue-700 font-medium')
                      : (role === 'admin' ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm text-left flex-1">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`p-4 ${role === 'admin' ? 'border-t border-slate-700' : 'border-t border-gray-100'}`}>
          <button 
            onClick={() => navigateTo('landing')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              role === 'admin' ? 'text-red-400 hover:bg-red-400/10' : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10 p-4 flex items-center justify-between lg:justify-end">
          <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <span className={`${role !== 'admin' ? 'hidden sm:inline' : ''} text-sm text-gray-500 font-medium`}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {role !== 'admin' ? (
              <button type="button" onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} className="rounded-lg px-2 py-1 text-lg font-bold text-blue-900 transition-colors hover:bg-blue-50" aria-label={`Gen-U ${role === 'siswa' ? 'Siswa' : 'Guru'}, kembali ke beranda`}>Gen-U <span className="text-xs font-medium">{role.toUpperCase()}</span></button>
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">A</div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );


  const RenderStudentPortal = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-2">Halo, Andi Pratama!</h1>
              <p className="text-blue-100 text-lg">Selamat datang kembali di Portal Siswa Gen-U. Mari lanjutkan penjelajahan karirmu!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('minat_bakat')}>
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Compass size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">Tes Minat Bakat</h3>
                <p className="text-gray-500 text-sm mt-1">Selesaikan tes untuk mengetahui potensi dan kecenderungan karirmu.</p>
                <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">Mulai Tes <ChevronRight size={16} className="ml-1" /></div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('jurusan')}>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">Jelajahi Jurusan</h3>
                <p className="text-gray-500 text-sm mt-1">Temukan informasi lengkap 50+ program studi di berbagai universitas.</p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">Eksplorasi <ChevronRight size={16} className="ml-1" /></div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('booking')}>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Users size={24} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">Sesi Mentoring</h3>
                <p className="text-gray-500 text-sm mt-1">Jadwalkan konsultasi 1-on-1 dengan Guru BK atau Mentor pilihanmu.</p>
                <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">Booking <ChevronRight size={16} className="ml-1" /></div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="px-8 pb-8 relative">
              <div className="pt-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Andi Pratama</h2>
                  <p className="text-gray-500 font-medium">Siswa SMAN 1 Jakarta</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Email Akun</label>
                    <p className="text-gray-800 font-medium">andi.pratama@example.com</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">NPSN Sekolah</label>
                    <p className="text-gray-800 font-medium">20101111</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">No. HP/WA</label>
                    <p className="text-gray-800 font-medium">0812-3456-7890</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Status Akun</label>
                    <p className="text-green-600 font-medium flex items-center gap-1"><CheckCircle size={14}/> Terverifikasi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'minat_bakat':
        return <RiasecAssessment mentors={dummyMentors} />;

      case 'jurusan':
        return <JurusanView />;

      case 'simulasi_pmb':
        if (!simulasiStarted) {
          return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <CheckSquare size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simulasi Penerimaan Mahasiswa Baru (PMB)</h2>
              <div className="prose prose-blue text-gray-600 mb-8 space-y-4">
                <p>
                  <strong>Apa itu PMB?</strong> PMB atau Penerimaan Mahasiswa Baru adalah proses seleksi resmi yang dilakukan oleh Perguruan Tinggi (Negeri maupun Swasta) untuk menyaring calon mahasiswa yang memenuhi kualifikasi akademik. 
                </p>
                <p>
                  Di Indonesia, jalur seleksi Perguruan Tinggi Negeri (PTN) secara umum terbagi menjadi tiga:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>SNBP (Seleksi Nasional Berdasarkan Prestasi):</strong> Jalur undangan yang menggunakan nilai rapor dan portofolio prestasi (tanpa tes).</li>
                  <li><strong>SNBT (Seleksi Nasional Berdasarkan Tes):</strong> Jalur tes tertulis berbasis komputer (UTBK) yang menguji Tes Potensi Skolastik (TPS), Literasi Bahasa (Indonesia & Inggris), dan Penalaran Matematika.</li>
                  <li><strong>Seleksi Mandiri:</strong> Jalur ujian yang diselenggarakan dan dikelola secara mandiri oleh masing-masing kampus.</li>
                </ul>
                <p className="pt-2">
                  Setelah mengikuti seleksi calon mahasiswa baru, selanjutnya calon mahasiswa baru akan registrasi portal penerimaan mahasiswa baru di Perguruan Tinggi.
                </p>
              </div>
              <button 
                onClick={() => setSimulasiStarted(true)} 
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-orange-200"
              >
                Mulai Coba Sekarang <ChevronRight size={20} />
              </button>
            </div>
          );
        }

        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Try Out SNBT: Literasi Bahasa Indonesia</h2>
              <div className="flex items-center gap-2 text-orange-600 font-bold bg-orange-50 px-4 py-2 rounded-lg">
                <Clock size={18} /> 14:59
              </div>
            </div>
            
            <div className="mb-8">
              <span className="text-sm text-gray-500 font-medium">Pertanyaan 1 dari 20</span>
              <p className="text-lg text-gray-800 mt-3 leading-relaxed">
                Bacalah paragraf berikut: <br/>
                "Kemajuan teknologi kecerdasan buatan (AI) telah mengubah paradigma berbagai sektor industri. Namun, tantangan terkait etika dan hilangnya lapangan kerja tradisional masih menjadi perdebatan hangat di kalangan pakar ekonomi."<br/><br/>
                Gagasan utama dari paragraf di atas adalah...
              </p>
              
              <div className="mt-6 space-y-3">
                {['Perubahan paradigma industri akibat AI.', 'AI menghapus banyak lapangan pekerjaan.', 'Dampak kemajuan AI beserta tantangan etika dan ekonominya.', 'Pakar ekonomi menolak kemajuan AI.'].map((opt, idx) => (
                  <label key={idx} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                    <input type="radio" name="soal1" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span className="ml-3 text-gray-700">{String.fromCharCode(65+idx)}. {opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button 
                onClick={() => setSimulasiStarted(false)}
                className="px-6 py-2 border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-50"
              >
                Batal / Keluar
              </button>
              <div className="flex gap-2">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50">Sebelumnya</button>
                <button className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700">Selanjutnya</button>
              </div>
            </div>
          </div>
        );

      case 'simulasi_kuliah':
        return (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Simulasi Kehidupan Kampus</h2>
            <p className="text-gray-500 mb-8">Pahami alur kegiatan mahasiswa dari awal masuk hingga lulus.</p>

            <div className="relative border-l-2 border-blue-200 ml-4 space-y-12 pb-8">
              
              <div className="relative pl-8">
                <div className="absolute -left-3.5 top-1 bg-blue-600 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-white">
                  1
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900">PKKMB & Orientasi</h3>
                  <p className="text-gray-600 text-sm mt-2">Pengenalan Kehidupan Kampus bagi Mahasiswa Baru. Momen pengenalan lingkungan kampus, fakultas, dan organisasi kemahasiswaan.</p>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute -left-3.5 top-1 bg-white border-2 border-blue-400 w-7 h-7 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  2
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900">Pengisian KRS (Kartu Rencana Studi)</h3>
                  <p className="text-gray-600 text-sm mt-2">Setiap awal semester, mahasiswa memilih mata kuliah yang akan diambil berdasarkan Indeks Prestasi (IP) semester sebelumnya.</p>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute -left-3.5 top-1 bg-white border-2 border-blue-400 w-7 h-7 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  3
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900">UTS & UAS</h3>
                  <p className="text-gray-600 text-sm mt-2">Ujian Tengah Semester dan Ujian Akhir Semester adalah evaluasi utama untuk menentukan nilai huruf (A, B, C, D, E) pada mata kuliah.</p>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute -left-3.5 top-1 bg-white border-2 border-gray-300 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs">
                  4
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
                  <h3 className="text-lg font-bold text-gray-900">KKN / Magang (PKL)</h3>
                  <p className="text-gray-600 text-sm mt-2">Kuliah Kerja Nyata atau Praktik Kerja Lapangan. Mengaplikasikan ilmu langsung di masyarakat atau industri.</p>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute -left-3.5 top-1 bg-white border-2 border-gray-300 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs">
                  5
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
                  <h3 className="text-lg font-bold text-gray-900">Skripsi / Tugas Akhir</h3>
                  <p className="text-gray-600 text-sm mt-2">Karya ilmiah akhir sebagai syarat kelulusan untuk mendapatkan gelar sarjana.</p>
                </div>
              </div>

              <div className="pl-8">
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                  <h3 className="text-lg font-bold text-blue-900">Coba simulasi kuliah online</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">Fitur simulasi kuliah online dapat diakses melalui aplikasi Learning Management System (LMS). Di sana kamu dapat mengenal pengalaman belajar daring seperti mengakses materi, mengerjakan tugas, dan mengikuti aktivitas perkuliahan.</p>
                </div>
              </div>

            </div>
          </div>
        );

      case 'booking':
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Booking Sesi Mentoring</h2>
                <p className="mt-1 text-sm text-gray-500">Atur jadwal konsultasi bersama guru atau mentor pilihanmu.</p>
              </div>
              <button type="button" onClick={() => { setSelectedMentorId(''); setBookingFormOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700">
                <PlusCircle size={18} /> Booking Baru
              </button>
            </div>

            {bookingFormOpen && (
              <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Buat Booking Baru</h3>
                    <p className="mt-1 text-sm text-gray-500">Lengkapi seluruh informasi untuk mengajukan sesi mentoring.</p>
                  </div>
                  <button type="button" onClick={() => setBookingFormOpen(false)} aria-label="Tutup formulir booking" className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>
                <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={event => {
                  event.preventDefault();
                  alert('Booking mentoring berhasil diajukan.');
                  setBookingFormOpen(false);
                  setSelectedMentorId('');
                  event.currentTarget.reset();
                }}>
                  <div className="md:col-span-2">
                    <label htmlFor="booking-mentor" className="mb-1.5 block text-sm font-semibold text-gray-700">Pilih Guru / Mentor</label>
                    <select id="booking-mentor" required value={selectedMentorId} onChange={event => setSelectedMentorId(event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                      <option value="">Pilih guru atau mentor</option>
                      {dummyMentors.map(mentor => <option key={mentor.id} value={mentor.id}>{mentor.name} — {mentor.expertise}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="booking-date" className="mb-1.5 block text-sm font-semibold text-gray-700">Tanggal</label>
                    <input id="booking-date" name="date" type="date" min={new Date().toISOString().split('T')[0]} required className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                  </div>
                  <div>
                    <label htmlFor="booking-time" className="mb-1.5 block text-sm font-semibold text-gray-700">Waktu</label>
                    <input id="booking-time" name="time" type="time" required className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="booking-topic" className="mb-1.5 block text-sm font-semibold text-gray-700">Topik Konsultasi</label>
                    <textarea id="booking-topic" name="topic" rows={4} required placeholder="Contoh: Konsultasi pemilihan jurusan dan persiapan masuk kuliah" className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-800 outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                  </div>
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end md:col-span-2">
                    <button type="button" onClick={() => setBookingFormOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50">Batal</button>
                    <button type="submit" className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700">Ajukan Booking</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dummyMentors.map(mentor => (
                <div key={mentor.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{mentor.name}</h3>
                      <p className="text-xs text-gray-500">{mentor.school}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{mentor.expertise}</span>
                  </div>
                  <button type="button" onClick={() => { setSelectedMentorId(String(mentor.id)); setBookingFormOpen(true); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Calendar size={18} /> Booking Sesi
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default: return <div>Pilih Menu</div>;
    }
  };


  const RenderGuruPortal = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru BK</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-blue-500">
                <p className="text-gray-500 text-sm font-medium">Siswa Terdaftar</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">124</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-purple-500">
                <p className="text-gray-500 text-sm font-medium">Tes Selesai</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">86</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
                <p className="text-gray-500 text-sm font-medium">Sesi Menunggu</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">5</h3>
              </div>
            </div>
          </div>
        );
      
      case 'monitoring':
      case 'hasil_pmb':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {activeTab === 'monitoring' ? 'Monitoring Tes Minat Bakat' : 'Hasil Simulasi PMB'}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b">
                  <tr>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4">NPSN</th>
                    {activeTab === 'monitoring' && <th className="px-6 py-4">Status Tes</th>}
                    {activeTab === 'hasil_pmb' && <th className="px-6 py-4">Skor SNBT</th>}
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyStudents.map((student, idx) => (
                    <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4">{student.npsn}</td>
                      
                      {activeTab === 'monitoring' && (
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            student.testStatus === 'Selesai' ? 'bg-green-100 text-green-700' : 
                            student.testStatus === 'Proses' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {student.testStatus}
                          </span>
                        </td>
                      )}
                      
                      {activeTab === 'hasil_pmb' && (
                        <td className="px-6 py-4 font-bold text-gray-700">{student.pmbScore}</td>
                      )}
                      
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:underline">Lihat Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'sesi':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Jadwal Sesi Mentoring</h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Andi Pratama</h4>
                      <p className="text-sm text-gray-500">Konsultasi Pemilihan Jurusan Kedokteran</p>
                      <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-600">
                        <Clock size={14} /> Besok, 14:00 WIB
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Terima</button>
                    <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">Tolak</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500" />
            <div className="px-8 pb-8 pt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{dummyMentors[0].name}</h2>
                <p className="text-gray-500 font-medium">Guru / Mentor</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Asal Sekolah / Instansi</span>
                  <p className="text-gray-800 font-medium">{dummyMentors[0].school}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Bidang Keahlian</span>
                  <p className="text-gray-800 font-medium">{dummyMentors[0].expertise}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };


  const RenderAdminPortal = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Admin Control Panel</h1>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm">Total Pengguna</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">1,204</h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm">Registrasi Baru</p>
                <h3 className="text-2xl font-bold text-indigo-600 mt-1">+45</h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm">Total Sekolah</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">32</h3>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm">Sistem Status</p>
                <h3 className="text-2xl font-bold text-emerald-500 mt-1">Sehat</h3>
              </div>
            </div>
          </div>
        );

      case 'users':
      case 'registrasi':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                {activeTab === 'users' ? 'Monitoring Pengguna' : 'Antrean Registrasi'}
              </h2>
              {activeTab === 'registrasi' && (
                <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md font-medium hover:bg-indigo-700">Setujui Semua</button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Nama</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Asal Sekolah</th>
                    <th className="px-6 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">User Dummy {i}</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">{i === 1 ? 'Guru BK' : 'Siswa'}</span></td>
                      <td className="px-6 py-4">SMAN {i} Jakarta</td>
                      <td className="px-6 py-4">
                        {activeTab === 'registrasi' ? (
                          <button className="text-emerald-600 font-medium hover:underline">Approve</button>
                        ) : (
                          <button className="text-red-600 font-medium hover:underline">Banned</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'input_test':
      case 'input_jurusan':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {activeTab === 'input_test' ? 'Input Data Soal Tes Minat Bakat' : 'Input Data Program Studi'}
            </h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {activeTab === 'input_test' ? 'Pertanyaan' : 'Nama Jurusan'}
                </label>
                {activeTab === 'input_test' ? (
                  <textarea rows="3" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                ) : (
                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                )}
              </div>
              
              {activeTab === 'input_jurusan' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option>Saintek</option>
                    <option>Soshum</option>
                  </select>
                </div>
              )}

              <button className="bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-indigo-700 flex items-center gap-2 mt-4">
                <Database size={18} /> Simpan Data
              </button>
            </form>
          </div>
        );

      default: return null;
    }
  };


  const renderView = () => {
    switch(currentView) {
      case 'landing':
        return (
          <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Navbar */}
            <nav className="absolute top-0 z-20 flex w-full items-center justify-between px-6 py-6 text-white md:px-12 lg:px-16">
              <div className="flex items-center gap-2">
                <div className="rounded-lg p-2 text-white">
                  <GraduationCap size={24} />
                </div>
                <span className="text-2xl font-extrabold tracking-tight">Gen-U</span>
              </div>
              <div className="hidden items-center gap-8 font-medium md:flex">
                <a href="#home" className="hover:text-yellow-200 transition-colors">Home</a>
                <a href="#about" className="hover:text-yellow-200 transition-colors">Tentang Kami</a>
                <a href="#features" className="hover:text-yellow-200 transition-colors">Fitur</a>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCurrentView('login')} className="rounded-lg px-3 py-2 font-semibold transition-colors hover:bg-white/10 sm:px-5">Masuk</button>
                <button onClick={() => setCurrentView('register')} className="rounded-lg border-2 border-white px-3 py-2 font-semibold transition-colors hover:bg-white hover:text-blue-900 sm:px-5">Daftar</button>
              </div>
            </nav>

            {/* Hero Section */}
            <section id="home" aria-label="Sorotan Gen-U" className="relative flex min-h-screen items-center overflow-hidden bg-[#11518e] px-6 pt-28 text-white md:px-12 lg:px-16">
              <div className="pointer-events-none absolute -bottom-36 -left-36 h-80 w-80 rounded-full border border-white/20" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full border border-white/20" aria-hidden="true" />
              <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-3 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[56%_44%]">
                <div className="relative z-10 pb-5 pt-8 lg:py-16">
                  <div key={visibleLandingSlide} className="animate-in fade-in duration-500">
                    <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:w-[75vw] lg:max-w-none lg:text-6xl xl:w-[850px] xl:text-7xl">{landingSlides[visibleLandingSlide].title}</h1>
                    <p className="mt-7 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">Generasi Univeral akan membantu kamu menemukan jurusan, mengenal bakat dan minat, serta memperoleh informasi kampus secara lengkap dalam satu platform.</p>
                  </div>
                  <div className="mt-10 flex flex-col items-start gap-3 sm:mt-14">
                    <button onClick={() => navigateTo('student', 'jurusan')} className="min-w-64 rounded-xl border-[3px] border-white px-5 py-2.5 text-center text-lg font-extrabold transition-colors hover:bg-white hover:text-blue-900">JELAJAHI JURUSAN</button>
                    <button onClick={() => navigateTo('student', 'minat_bakat')} className="min-w-64 rounded-xl border-[3px] border-white px-5 py-2.5 text-center text-lg font-extrabold transition-colors hover:bg-white hover:text-blue-900">KENALI BAKAT MINATMU</button>
                  </div>
                  <div className="mt-10 flex items-center gap-3" role="group" aria-label="Pilih slide landing page">
                    {landingSlides.map((slide, index) => <button key={index} type="button" onClick={() => setLandingSlide(index)} aria-label={`Tampilkan slide ${index + 1}`} aria-current={visibleLandingSlide === index ? 'true' : undefined} className={`h-3.5 w-3.5 rounded-full transition-colors ${visibleLandingSlide === index ? 'bg-white' : 'bg-blue-950/40 hover:bg-white/60'}`} />)}
                  </div>
                </div>
                <div className="relative min-h-72 self-stretch sm:min-h-96 lg:min-h-[38rem]" aria-live="off">
                  <div className="absolute bottom-[-18%] right-[-28%] aspect-square w-[125%] rounded-full bg-[#ffe45c] sm:right-[-15%] lg:bottom-[-36%] lg:right-[-35%] lg:w-[140%]" aria-hidden="true" />
                  <div className="absolute right-0 top-5 h-14 w-14 rounded-full bg-[#ffe45c] lg:right-[-8%] lg:top-[15%] lg:h-20 lg:w-20" aria-hidden="true" />
                  {landingSlides.map((slide, index) => <img key={index} src={slide.image} alt={slide.alt} className={`absolute bottom-0 right-[-12%] w-[120%] object-contain object-bottom transition-opacity duration-500 sm:right-[-5%] sm:w-full lg:right-[-28%] lg:w-[155%] lg:max-w-none ${visibleLandingSlide === index ? 'opacity-100' : 'opacity-0'}`} aria-hidden={visibleLandingSlide !== index} />)}
                </div>
              </div>
            </section>

            {/* About Gen-U */}
            <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-blue-50 px-6 py-20 md:px-12 lg:py-28">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-200" aria-hidden="true" />
              <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="relative order-2 pb-5 lg:order-1">
                  <div className="absolute -bottom-3 -left-5 h-4/5 w-4/5 rounded-[3rem] bg-yellow-300" aria-hidden="true" />
                  <div className="relative -rotate-2 overflow-hidden rounded-3xl border-8 border-white shadow-xl">
                    <img src={landingAboutCampus} alt="Mahasiswa berbincang bersama di lingkungan kampus" className="aspect-[4/3] w-full object-cover" />
                  </div>
                  <span className="absolute -bottom-2 right-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-900 shadow-lg sm:right-6">Mengenal diri. Menemukan arah.</span>
                </div>
                <div className="order-1 lg:order-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-800"><span className="h-2 w-2 rounded-full bg-yellow-400" />Tentang Kami</span>
                  <h2 id="about-title" className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-blue-950 sm:text-5xl">Gen-U, temanmu menuju kampus.</h2>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">Gen-U adalah platform interaktif yang dirancang untuk membantu siswa mengenali minat dan bakat, sekaligus menjelajahi kehidupan kampus. Temukan jurusan yang cocok, kenali dunia perkuliahan, dan melangkah menuju masa depan dengan lebih percaya diri.</p>
                  <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-blue-900">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2"><Compass size={16} /> Kenali potensimu</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2"><GraduationCap size={16} /> Jelajahi dunia kampus</span>
                  </div>
                  <a href="#features" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-900">Lihat fitur Gen-U <ChevronRight size={18} /></a>
                </div>
              </div>
            </section>

            {/* Features Preview */}
            <section id="features" className="py-20 bg-white px-6 md:px-12">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan Gen-U</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">Satu portal terintegrasi untuk segala kebutuhan persiapan kuliahmu.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: Compass, title: 'Tes Minat Bakat', desc: 'Ketahui kecenderungan karir menggunakan metode asesmen terpercaya.', color: 'purple' },
                    { icon: BookOpen, title: 'Eksplorasi Jurusan', desc: 'Database lengkap info jurusan, kegiatan perkuliahan dan prospek kerja.', color: 'blue' },
                    { icon: CheckSquare, title: 'Simulasi PMB', desc: 'Latihan mengisi form penerimaan Mahasiswa Baru dan memahami proses registrasi.', color: 'orange' }
                  ].map((f, i) => (
                    <div key={i} className="p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl transition-all group">
                      <div className={`w-14 h-14 rounded-xl bg-${f.color}-100 text-${f.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <f.icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer with Secret Admin Access */}
            <footer className="bg-slate-900 py-8 px-6 text-center text-slate-400 relative">
              <p>&copy; 2026 Gen-U Platform Edukasi. All rights reserved.</p>
              {/* SECRET ADMIN LINK */}
              <button 
                onClick={() => navigateTo('admin')} 
                className="absolute bottom-4 right-4 text-slate-800 hover:text-slate-600 transition-colors"
                title="Admin Access"
              >
                <Lock size={12} />
              </button>
            </footer>
          </div>
        );

      case 'login':
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans relative">
            <button onClick={() => setCurrentView('landing')} className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2">
               <ChevronRight className="rotate-180" size={20}/> Kembali ke Beranda
            </button>
            
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="bg-blue-600 w-12 h-12 rounded-lg text-white flex items-center justify-center mx-auto mb-4">
                  <Lock size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Masuk ke Gen-U</h2>
                <p className="text-gray-500 mt-2">Silakan masukkan email dan password.</p>
              </div>

              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="contoh@sekolah.id" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  Login
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-center text-gray-400 font-semibold mb-4 uppercase tracking-wider">Simulasi Cepat (Demo Mode)</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => navigateTo('student')} className="py-2.5 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 border border-blue-200">Demo Portal Siswa</button>
                  <button onClick={() => navigateTo('guru')} className="py-2.5 bg-emerald-50 text-emerald-700 font-medium rounded-lg hover:bg-emerald-100 border border-emerald-200">Demo Portal Guru BK</button>
                  <button onClick={() => navigateTo('admin')} className="py-2.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 border border-slate-700 flex items-center justify-center gap-2"><Shield size={16}/> Demo Portal Admin</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'register':
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans relative py-12">
             <button onClick={() => setCurrentView('landing')} className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2">
               <ChevronRight className="rotate-180" size={20}/> Kembali ke Beranda
            </button>

            <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Daftar Akun Gen-U</h2>
                <p className="text-gray-500 mt-2">Bergabunglah untuk memulai persiapan masa depanmu.</p>
              </div>

              <div className="flex mb-6 p-1 bg-gray-100 rounded-lg">
                <button type="button" onClick={() => setRegistrationRole('siswa')} aria-pressed={registrationRole === 'siswa'} className={`flex-1 py-2 text-sm rounded-md ${registrationRole === 'siswa' ? 'font-bold bg-white shadow-sm text-blue-600' : 'font-medium text-gray-500 hover:text-gray-700'}`}>Siswa</button>
                <button type="button" onClick={() => setRegistrationRole('guru')} aria-pressed={registrationRole === 'guru'} className={`flex-1 py-2 text-sm rounded-md ${registrationRole === 'guru' ? 'font-bold bg-white shadow-sm text-blue-600' : 'font-medium text-gray-500 hover:text-gray-700'}`}>Guru/ Mentor</button>
              </div>

              <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert(`Pendaftaran ${registrationRole === 'guru' ? 'Guru/ Mentor' : 'Siswa'} berhasil! Menunggu persetujuan Admin.`); setCurrentView('login'); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{registrationRole === 'guru' ? 'Asal Sekolah / Instansi' : 'Asal Sekolah'}</label>
                  <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No HP / WA</label>
                    <input type="tel" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  Daftar Sekarang
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-6">
                Sudah punya akun? <button onClick={() => setCurrentView('login')} className="text-blue-600 font-bold hover:underline">Masuk di sini</button>
              </p>
            </div>
          </div>
        );

      case 'student':
        return (
          <PortalLayout 
            role="siswa"
            menuItems={[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'minat_bakat', label: 'Tes Minat Bakat', icon: Compass },
              { id: 'jurusan', label: 'Jelajahi Jurusan', icon: BookOpen },
              { id: 'simulasi_pmb', label: 'Simulasi PMB', icon: CheckSquare },
              { id: 'simulasi_kuliah', label: 'Simulasi Kuliah', icon: GraduationCap },
              { id: 'booking', label: 'Booking Mentor', icon: Calendar },
            ]}
          >
            <RenderStudentPortal />
          </PortalLayout>
        );

      case 'guru':
        return (
          <PortalLayout 
            role="guru"
            menuItems={[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'monitoring', label: 'Monitoring Minat Bakat', icon: Compass },
              { id: 'hasil_pmb', label: 'Hasil PMB Siswa', icon: FileText },
              { id: 'sesi', label: 'Sesi Mentoring', icon: Users },
            ]}
          >
            <RenderGuruPortal />
          </PortalLayout>
        );

      case 'admin':
        return (
          <PortalLayout 
            role="admin"
            menuItems={[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'users', label: 'Monitoring Pengguna', icon: Users },
              { id: 'registrasi', label: 'Permintaan Registrasi', icon: User },
              { id: 'input_test', label: 'Input Tes Minat Bakat', icon: PlusCircle },
              { id: 'input_jurusan', label: 'Input Jelajahi Jurusan', icon: Database },
            ]}
          >
            <RenderAdminPortal />
          </PortalLayout>
        );

      default:
        return <div>Halaman Tidak Ditemukan</div>;
    }
  };


  return (
    <div className="antialiased text-gray-900 min-h-screen">
      {renderView()}
    </div>
  );
}
