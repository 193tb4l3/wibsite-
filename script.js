document.addEventListener('DOMContentLoaded', function() {
  // Variabel untuk menyimpan data hasil pemilihan
  let electionData = [];

  // Mengambil elemen form dan tabel
  const inputForm = document.getElementById('inputForm');
  const realCountTable = document.getElementById('realCountTable');
  const realCountBody = document.getElementById('realCountBody');
  const quickCountData = document.getElementById('quickCountData');
  const deleteButton = document.getElementById('deleteButton');
  const exportButton = document.getElementById('exportButton');

  // Fungsi untuk menambahkan data hasil pemilihan ke dalam tabel real count
  function addResultToTable(tps, namaKandidat, jumlahPemilih, suaraSah, suaraBatal) {
    const newRow = realCountTable.insertRow();
    const tpsCell = newRow.insertCell(0);
    const namaKandidatCell = newRow.insertCell(1);
    const jumlahPemilihCell = newRow.insertCell(2);
    const suaraSahCell = newRow.insertCell(3);
    const suaraBatalCell = newRow.insertCell(4);

    tpsCell.textContent = tps;
    namaKandidatCell.textContent = namaKandidat;
    jumlahPemilihCell.textContent = jumlahPemilih;
    suaraSahCell.textContent = suaraSah;
    suaraBatalCell.textContent = suaraBatal;

    // Menyimpan data hasil pemilihan ke dalam array
    electionData.push({
      tps,
      namaKandidat,
      jumlahPemilih,
      suaraSah,
      suaraBatal
    });

    // Menghitung hasil quick count
    calculateQuickCount();
  }

  // Fungsi untuk menghitung hasil quick count
  function calculateQuickCount() {
    const totalPemilih = electionData.reduce((total, data) => total + data.jumlahPemilih, 0);
    const totalSuaraSah = electionData.reduce((total, data) => total + data.suaraSah, 0);
    const totalSuaraBatal = electionData.reduce((total, data) => total + data.suaraBatal, 0);

    const quickCountText = `
      Total Pemilih Terdaftar: ${totalPemilih}
      Total Suara Sah: ${totalSuaraSah}
      Total Suara Batal: ${totalSuaraBatal}
    `;

    quickCountData.textContent = quickCountText;
  }

  // Fungsi untuk menghapus semua data dari tabel real count
  function deleteAllData() {
    // Hapus data dari array
    electionData = [];

    // Hapus baris dari tabel real count
    while (realCountBody.firstChild) {
      realCountBody.removeChild(realCountBody.firstChild);
    }

    // Reset quick count
    quickCountData.textContent = 'Loading...';
  }

  // Fungsi untuk mengekspor data ke dalam format Excel
  function exportToExcel() {
    const wb = XLSX.utils.book_new();
    const wsData = [['Nomor TPS', 'Nama Kandidat', 'Jumlah Pemilih Terdaftar', 'Suara Sah', 'Suara Batal']];

    // Ambil data dari array electionData
    electionData.forEach(data => {
      wsData.push([data.tps, data.namaKandidat, data.jumlahPemilih, data.suaraSah, data.suaraBatal]);
    });

    // Tambahkan data ke dalam worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    wb.Sheets['Data Pemilihan'] = ws;

    // Simpan file Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Data_Pemilihan_Desa.xlsx');
  }

  // Event listener untuk form input
  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const tps = document.getElementById('tps').value;
    const namaKandidat = document.getElementById('namaKandidat').value;
    const jumlahPemilih = parseInt(document.getElementById('jumlahPemilih').value);
    const suaraSah = parseInt(document.getElementById('suaraSah').value);
    const suaraBatal = parseInt(document.getElementById('suaraBatal').value);

    addResultToTable(tps, namaKandidat, jumlahPemilih, suaraSah, suaraBatal);

    // Mereset nilai input form setelah data disimpan
    inputForm.reset();
  });

  // Event listener untuk tombol hapus
  deleteButton.addEventListener('click', () => {
    deleteAllData();
  });

  // Event listener untuk tombol ekspor ke Excel
  exportButton.addEventListener('click', () => {
    exportToExcel();
  });
});