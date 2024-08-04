export interface siswa {
  id?: number;
  nisn: number;
  nama: string;
  kelas: string;
}

export interface kehadiran {
  id?: number;
  tanggal: string;
  wktdatang: Date;
  wktpulang: Date;
  siswaId: number;
}

enum Level {
  GURU,
  SISWA,
}

export interface user {
  id?: number;
  nama: Date;
  password: string;
  level: Level;
}
