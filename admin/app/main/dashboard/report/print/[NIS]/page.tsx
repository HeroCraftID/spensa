'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface PresenceRecap {
  Hadir: number;
  Sakit: number;
  Izin: number;
  Alfa: number;
  Terlambat: number;
  Total: number;
  Percentage: number;
}

interface StudentData {
  _id: string;
  NIS: string;
  Name: string;
  Class: string;
  PreNum: number;
  presenceRecap: PresenceRecap;
}

export default function PrintPage() {
  const { NIS } = useParams();
  const [student, setStudent] = useState<StudentData | null>(null);
  const router = useRouter()
  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      const response = await fetch(`https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/presence/get-presence-report-single?NIS=${NIS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudent(data.data);
        router.prefetch('/dashboard/report')
        window.print();
        router.replace('/main/dashboard/report')
      }
    };

    fetchData();
  }, [NIS]);

  if (!student) return <div className="p-8 text-black">Loading...</div>;

  const { Name, Class: kelas,  PreNum: nomorAbsen, presenceRecap } = student;

  return (
    <div className='print-background'>
      <div className="print-wrapper bg-white text-black p-8 font-sans text-sm leading-normal print:w-full print:h-auto">
      {/* KOP SURAT */}
      <div className="flex justify-between items-center border-b-2 pb-2 mb-4">
        <img src="/main/logo-kiri.png" alt="Logo Kiri" className="h-16 w-auto" />
        <div className="text-center flex-1">
          <p className="text-xs">PEMERINTAH KOTA MADIUN</p>
          <h1 className="text-lg font-bold">SMP NEGERI 1 MADIUN</h1>
          <p className="text-xs">
            Jalan R.A. Kartini Nomor 4, Kota Madiun, Jawa Timur 63122<br />
            Telepon (0351) 462859, Email: smpn1_madiun@yahoo.com<br />
            Laman: https://www.smp1madiun.sch.id
          </p>
        </div>
        <img src="/main/logo-kanan.png" alt="Logo Kanan" className="h-16 w-auto" />
      </div>

      <br />
      <h5 className='text-center text-lg'><strong>LAPORAN KEHADIRAN SISWA</strong></h5>
      <br></br>
      {/* Identitas Siswa */}
      <div className="mb-4">
        <p><strong>Nomor Induk Siswa:</strong> {NIS}</p>
        <p><strong>Nama:</strong> {Name}</p>
        <p><strong>Kelas:</strong> {kelas}</p>
        <p><strong>Nomor Presensi: </strong> {nomorAbsen}</p>
      </div>

      <br />

      {/* Grafik Kehadiran */}
      <div className="flex justify-center my-6">
        <div className="relative w-[120px] h-[120px]">
          <svg className="w-full h-full">
            <circle
              cx="60"
              cy="60"
              r="48"
              stroke="#e2e8f0"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              stroke="#22c55e"
              strokeWidth="10"
              strokeDasharray={`${(2 * Math.PI * 48) * (presenceRecap.Percentage / 100)} ${(2 * Math.PI * 48)}`}
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-green-500">{presenceRecap.Percentage}%</p>
            <span className="text-sm text-slate-500">Kehadiran</span>
          </div>
        </div>
      </div>

      <br />

      {/* Rekap Presensi */}
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        <div className="border p-4 rounded-md">
          <p className="text-gray-600">Hadir</p>
          <p className="text-lg font-bold text-green-600">{presenceRecap.Hadir}</p>
        </div>
        <div className="border p-4 rounded-md">
          <p className="text-gray-600">Sakit</p>
          <p className="text-lg font-bold">{presenceRecap.Sakit}</p>
        </div>
        <div className="border p-4 rounded-md">
          <p className="text-gray-600">Izin</p>
          <p className="text-lg font-bold text-blue-600">{presenceRecap.Izin}</p>
        </div>
        <div className="border p-4 rounded-md">
          <p className="text-gray-600">Alfa</p>
          <p className="text-lg font-bold text-red-600">{presenceRecap.Alfa}</p>
        </div>
        <div className="border p-4 rounded-md col-span-2">
          <p className="text-gray-600">Terlambat</p>
          <p className="text-lg font-bold text-yellow-600">{presenceRecap.Terlambat}</p>
        </div>
      </div>
    </div>
    </div>
  );
}
