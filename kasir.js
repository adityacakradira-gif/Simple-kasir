var daftarAkun = [
	{ username: "admin", password: "admin123" }
];

var userAktif = "";

function cekLogin() {
	var u = document.getElementById("usernameLogin").value;
	var p = document.getElementById("passwordLogin").value;

	var valid = false;
	for (var i = 0; i < daftarAkun.length; i++) {
		if (daftarAkun[i].username == u && daftarAkun[i].password == p) {
			valid = true;
		}
	}

	if (valid) {
		userAktif = u;
		document.getElementById("labelUserAktif").innerHTML = "Login sebagai: " + u;

		muatData(u);

		document.getElementById("kotakLogin").style.display = "none";
		document.getElementById("appKasir").style.display = "block";
	} else {
		alert("Username atau password salah!");
	}
}

function keluarKasir() {
	if (confirm("Yakin mau keluar? Data bakal disimpan otomatis.")) {
		simpanData();

		userAktif = "";
		document.getElementById("appKasir").style.display = "none";
		document.getElementById("kotakLogin").style.display = "block";
		document.getElementById("usernameLogin").value = "";
		document.getElementById("passwordLogin").value = "";
	}
}

function daftarAkunBaru() {
	var u = document.getElementById("usernameBaru").value;
	var p = document.getElementById("passwordBaru").value;

	if (u == "" || p == "") {
		alert("Username dan password baru harus diisi!");
		return;
	}

	for (var i = 0; i < daftarAkun.length; i++) {
		if (daftarAkun[i].username == u) {
			alert("Username " + u + " sudah dipakai, coba nama lain!");
			return;
		}
	}

	daftarAkun.push({ username: u, password: p });

	alert("Akun " + u + " berhasil didaftarkan! Sekarang bisa langsung login.");

	document.getElementById("usernameBaru").value = "";
	document.getElementById("passwordBaru").value = "";
}

function tampilkanListAkun() {
	var div = document.getElementById("listAkunDropdown");
	div.innerHTML = "";

	for (var i = 0; i < daftarAkun.length; i++) {
		var akun = daftarAkun[i];

		var baris = document.createElement("div");
		baris.innerHTML = akun.username;
		baris.style.padding = "5px";
		baris.style.cursor = "pointer";
		baris.style.borderBottom = "1px solid #ccc";

		baris.onclick = function() {
			var namaDipilih = this.innerHTML;
			for (var j = 0; j < daftarAkun.length; j++) {
				if (daftarAkun[j].username == namaDipilih) {
					document.getElementById("usernameLogin").value = daftarAkun[j].username;
					document.getElementById("passwordLogin").value = daftarAkun[j].password;
				}
			}
			document.getElementById("listAkunDropdown").style.display = "none";
		};

		div.appendChild(baris);
	}

	div.style.display = "block";
}

var keranjang = [];
var nomor = 1;
var stokMaksimal = 100;

var stokBarang = {
	"Indomie": 100,
	"Beras 1kg": 100,
	"Minyak Goreng": 100,
	"Telur 1kg": 100,
	"Gula 1kg": 100,
	"Air Mineral": 100
};

var kategoriBarang = {
	"Indomie": "Makanan",
	"Beras 1kg": "Makanan",
	"Minyak Goreng": "Makanan",
	"Telur 1kg": "Makanan",
	"Gula 1kg": "Makanan",
	"Air Mineral": "Minuman"
};

var hargaBarang = {
	"Indomie": 3500,
	"Beras 1kg": 13000,
	"Minyak Goreng": 18000,
	"Telur 1kg": 27000,
	"Gula 1kg": 15000,
	"Air Mineral": 4000
};

function simpanData() {
	if (userAktif == "") {
		return;
	}

	var data = {
		stokBarang: stokBarang,
		kategoriBarang: kategoriBarang,
		hargaBarang: hargaBarang
	};

	localStorage.setItem("kasirData_" + userAktif, JSON.stringify(data));

	alert("Data berhasil disimpan untuk akun " + userAktif + "!");
}

function muatData(username) {
	var simpanan = localStorage.getItem("kasirData_" + username);

	if (simpanan == null) {
		return;
	}

	var data = JSON.parse(simpanan);

	stokBarang = data.stokBarang;
	kategoriBarang = data.kategoriBarang;
	hargaBarang = data.hargaBarang;

	renderDropdownBarang();
	tampilkanStok();
}

function renderDropdownBarang() {
	var select = document.getElementById("pilihBarang");

	select.innerHTML = "";

	for (var nama in hargaBarang) {
		var opt = document.createElement("option");
		opt.value = nama + "|" + hargaBarang[nama];
		opt.text = nama + " - " + hargaBarang[nama];
		select.appendChild(opt);
	}

	var optBaru = document.createElement("option");
	optBaru.value = "baru";
	optBaru.text = "+ Barang Baru";
	select.appendChild(optBaru);
}

function toggleStok() {
	var isi = document.getElementById("isiStok");
	var tombol = document.getElementById("tombolToggleStok");

	if (isi.style.display == "none") {
		isi.style.display = "block";
		tombol.innerHTML = "-";
	} else {
		isi.style.display = "none";
		tombol.innerHTML = "+";
	}
}

function cekBarangBaru() {
	var pilih = document.getElementById("pilihBarang").value;
	if (pilih == "baru") {
		document.getElementById("formBarangBaruJual").style.display = "inline";
	} else {
		document.getElementById("formBarangBaruJual").style.display = "none";
	}
}

function daftarkanBarangBaru(nama, harga, stokAwal, kategori) {
	if (stokAwal > stokMaksimal) {
		stokAwal = stokMaksimal;
	}

	stokBarang[nama] = stokAwal;
	kategoriBarang[nama] = kategori;
	hargaBarang[nama] = harga;

	var optBarang = document.createElement("option");
	optBarang.value = nama + "|" + harga;
	optBarang.text = nama + " - " + harga;
	document.getElementById("pilihBarang").insertBefore(optBarang, document.getElementById("pilihBarang").lastChild);
}

function tambahBarang() {
	var pilih = document.getElementById("pilihBarang").value;
	var nama, harga;

	if (pilih == "baru") {
		nama = document.getElementById("namaBarangBaruJual").value;
		harga = parseInt(document.getElementById("hargaBarangBaruJual").value);

		if (nama == "") {
			alert("Nama barang baru belum diisi!");
			return;
		}

		if (isNaN(harga) || harga < 1) {
			alert("Harga barang baru tidak valid!");
			return;
		}

		if (stokBarang[nama] === undefined) {
			var kategori = document.getElementById("kategoriBarangBaruJual").value;
			daftarkanBarangBaru(nama, harga, stokMaksimal, kategori);
		}
	} else {
		var pecah = pilih.split("|");
		nama = pecah[0];
		harga = parseInt(pecah[1]);
	}

	var jumlah = parseInt(document.getElementById("jumlahBarang").value);

	if (jumlah < 1) {
		alert("Jumlah tidak boleh kosong!");
		return;
	}

	if (stokBarang[nama] <= 0) {
		alert("Stok " + nama + " habis! Silahkan tambah stok dulu.");
		return;
	}

	if (jumlah > stokBarang[nama]) {
		alert("Stok " + nama + " tidak cukup! Sisa stok cuma " + stokBarang[nama]);
		return;
	}

	stokBarang[nama] = stokBarang[nama] - jumlah;

	var subtotal = harga * jumlah;

	var item = {
		id: nomor,
		nama: nama,
		harga: harga,
		jumlah: jumlah,
		subtotal: subtotal
	};

	keranjang.push(item);
	nomor = nomor + 1;

	if (pilih == "baru") {
		document.getElementById("namaBarangBaruJual").value = "";
		document.getElementById("hargaBarangBaruJual").value = "";
		document.getElementById("pilihBarang").value = nama + "|" + harga;
		cekBarangBaru();
	}

	tampilkanKeranjang();
	tampilkanStok();
}

function tambahStokBaris(btn, nama) {
	var input = btn.parentElement.querySelector("input");
	var jumlahTambah = parseInt(input.value);

	if (isNaN(jumlahTambah) || jumlahTambah < 1) {
		alert("Jumlah tidak valid!");
		return;
	}

	stokBarang[nama] = stokBarang[nama] + jumlahTambah;

	if (stokBarang[nama] > stokMaksimal) {
		stokBarang[nama] = stokMaksimal;
		alert("Stok " + nama + " sudah mentok di maksimal " + stokMaksimal + ", kelebihan nggak dihitung.");
	}

	tampilkanStok();
}

function kurangiStokBaris(btn, nama) {
	var input = btn.parentElement.querySelector("input");
	var jumlahKurang = parseInt(input.value);

	if (isNaN(jumlahKurang) || jumlahKurang < 1) {
		alert("Jumlah tidak valid!");
		return;
	}

	if (jumlahKurang > stokBarang[nama]) {
		alert("Stok " + nama + " cuma sisa " + stokBarang[nama] + ", nggak bisa dikurangin segitu!");
		return;
	}

	stokBarang[nama] = stokBarang[nama] - jumlahKurang;

	tampilkanStok();
}

function tampilkanStok() {
	var tabel = document.getElementById("tabelStok");

	tabel.innerHTML = `
	<tr>
		<th>Nama Barang</th>
		<th>Kategori</th>
		<th>Sisa Stok</th>
		<th>Atur Stok</th>
	</tr>
	`;

	var filter = document.getElementById("filterKategori").value;

	var namaBarang = [];
	for (var nama in stokBarang) {
		namaBarang.push(nama);
	}

	if (filter == "az") {
		namaBarang.sort();
	}

	for (var i = 0; i < namaBarang.length; i++) {
		var nama = namaBarang[i];
		var kategori = kategoriBarang[nama] || "Lainnya";

		// kalau lagi filter kategori tertentu, skip yang beda kategori
		if (filter != "semua" && filter != "az" && kategori != filter) {
			continue;
		}

		var row = document.createElement("tr");
		var sisa = stokBarang[nama];
		var kolomSisa = (sisa == 0) ? "<span style='color:red;font-weight:bold;'>HABIS</span>" : sisa;

		row.innerHTML = "<td>" + nama + "</td>" +
			"<td>" + kategori + "</td>" +
			"<td>" + kolomSisa + "</td>" +
			"<td><input type='number' value='1' min='1' style='width:60px;'> " +
			"<button class='btn' onclick='tambahStokBaris(this, \"" + nama + "\")'>Tambah</button> " +
			"<button class='btn-hapus' onclick='kurangiStokBaris(this, \"" + nama + "\")'>Hapus</button></td>";

		tabel.appendChild(row);
	}
}

tampilkanStok();

function tampilkanKeranjang() {
	var tabel = document.getElementById("tabelKeranjang");

	tabel.innerHTML = `
	<tr>
		<th>No</th>
		<th>Nama Barang</th>
		<th>Harga</th>
		<th>Jumlah</th>
		<th>Subtotal</th>
		<th>Aksi</th>
	</tr>
	`;

	var total = 0;

	for (var i = 0; i < keranjang.length; i++) {
		var row = document.createElement("tr");
		row.innerHTML = "<td>" + (i+1) + "</td>" +
			"<td>" + keranjang[i].nama + "</td>" +
			"<td>" + keranjang[i].harga + "</td>" +
			"<td>" + keranjang[i].jumlah + "</td>" +
			"<td>" + keranjang[i].subtotal + "</td>" +
			"<td><button class='btn-hapus' onclick='hapusBarang(" + keranjang[i].id + ")'>Buang</button></td>";
		tabel.appendChild(row);

		total = total + keranjang[i].subtotal;
	}

	var diskonPersen = parseInt(document.getElementById("diskonPersen").value);
	if (isNaN(diskonPersen) || diskonPersen < 0) {
		diskonPersen = 0;
	}

	var potongan = Math.round(total * diskonPersen / 100);
	var totalAkhir = total - potongan;

	document.getElementById("subtotal").innerHTML = total;
	document.getElementById("potongan").innerHTML = potongan;
	document.getElementById("total").innerHTML = totalAkhir;
}

function hapusBarang(id) {
	var barangBaru = [];
	for (var i = 0; i < keranjang.length; i++) {
		if (keranjang[i].id != id) {
			barangBaru.push(keranjang[i]);
		}
	}
	keranjang = barangBaru;
	tampilkanKeranjang();
}

function resetKeranjang() {
	if (confirm("Yakin mau reset semua keranjang?")) {
		keranjang = [];
		tampilkanKeranjang();
	}
}

var metodeSementara = "";
var totalSementara = 0;

function bayar() {
	if (keranjang.length == 0) {
		alert("Keranjang masih kosong!");
		return;
	}

	var totalBayar = parseInt(document.getElementById("total").innerHTML);
	var metode = document.getElementById("metodeBayar").value;

	if (metode == "cash") {
		var uang = prompt("Total belanja Rp " + totalBayar + "\nMasukkan jumlah uang customer:");

		if (uang == null) {
			return;
		}

		uang = parseInt(uang);

		if (isNaN(uang)) {
			alert("Input uang tidak valid!");
			return;
		}

		if (uang < totalBayar) {
			alert("Uang kurang! Kurang Rp " + (totalBayar - uang));
			return;
		}

		var kembalian = uang - totalBayar;
		selesaikanTransaksi("cash", totalBayar, kembalian, uang);

	} else {
		metodeSementara = metode;
		totalSementara = totalBayar;

		document.getElementById("judulMetodeBarcode").innerHTML = (metode == "ewallet") ? "E-WALLET" : "VIRTUAL ACCOUNT";
		document.getElementById("totalBarcode").innerHTML = totalBayar;
		buatQR(metode, totalBayar);
		document.getElementById("modalBarcode").style.display = "block";
	}
}

function buatQR(metode, totalBayar) {
	var kotak = document.getElementById("qrcode");
	kotak.innerHTML = "";

	var isiQR = "BAYAR|" + metode.toUpperCase() + "|Rp" + totalBayar + "|" + Date.now();

	new QRCode(kotak, {
		text: isiQR,
		width: 200,
		height: 200
	});
}

function batalBarcode() {
	document.getElementById("modalBarcode").style.display = "none";
}

function konfirmasiBarcode() {
	document.getElementById("modalBarcode").style.display = "none";
	selesaikanTransaksi(metodeSementara, totalSementara, 0, totalSementara);
}

function selesaikanTransaksi(metode, totalBayar, kembalian, uangDibayar) {
	buatStruk(metode, totalBayar, kembalian, uangDibayar);

	keranjang = [];
	tampilkanKeranjang();
}

function labelMetode(metode) {
	if (metode == "cash") return "Cash";
	if (metode == "ewallet") return "E-Wallet";
	if (metode == "va") return "Virtual Account";
	return metode;
}

function buatStruk(metode, totalBayar, kembalian, uangDibayar) {
	var subtotal = parseInt(document.getElementById("subtotal").innerHTML);
	var potongan = parseInt(document.getElementById("potongan").innerHTML);

	var html = "";
	html += "<h3>STRUK TRANSAKSI</h3>";
	html += "<p>" + new Date().toLocaleString() + "</p>";
	html += "<table id='tabelStrukModal'>";
	html += "<tr><th>Barang</th><th>Jml</th><th>Subtotal</th></tr>";

	for (var i = 0; i < keranjang.length; i++) {
		html += "<tr><td>" + keranjang[i].nama + "</td><td>" + keranjang[i].jumlah + "</td><td>" + keranjang[i].subtotal + "</td></tr>";
	}

	html += "</table>";
	html += "<p style='text-align:left;'>Subtotal : Rp " + subtotal + "</p>";
	html += "<p style='text-align:left;'>Diskon : Rp " + potongan + "</p>";
	html += "<p style='text-align:left;'><b>Total : Rp " + totalBayar + "</b></p>";
	html += "<p style='text-align:left;'>Metode : " + labelMetode(metode) + "</p>";

	if (metode == "cash") {
		html += "<p style='text-align:left;'>Uang Customer : Rp " + uangDibayar + "</p>";
		html += "<p style='text-align:left;'>Kembalian : Rp " + kembalian + "</p>";
	}

	html += "<p><b>TERIMA KASIH!</b></p>";

	document.getElementById("isiStruk").innerHTML = html;
	document.getElementById("modalStruk").style.display = "block";
}

function tutupStruk() {
	document.getElementById("modalStruk").style.display = "none";
}
