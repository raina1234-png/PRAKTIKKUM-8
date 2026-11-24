## Perbedaan Local State, Global Redux State, dan Persistent Database

1. **Local State (`useState`)**
   - **Cakupan**: Hanya hidup di dalam satu komponen tertentu (misalnya input form `title`, `body`, `mood`, atau pesan validasi di `create.tsx` dan `edit/[id].tsx`).
   - **Siklus hidup**: Akan terhapus atau ter-reset saat komponen di-*unmount* atau berpindah layar secara penuh.
   - **Cocok untuk**: UI state jangka pendek yang tidak perlu dibagi ke banyak layar.

2. **Global Redux State (Redux Toolkit Store)**
   - **Cakupan**: Terpusat di `store` dan dapat diakses lintas *screen* / komponen (misalnya `entries`, `filter`, serta selector `selectTotalDiary` dan `selectTotalFavorite`).
   - **Siklus hidup**: Bertahan selama aplikasi berjalan di memori (*in-memory*), namun akan kembali ke `initialState` jika aplikasi di-*reload* penuh atau ditutup.
   - **Cocok untuk**: State aplikasi yang dibagikan antar-halaman dan diperbarui melalui *action* & *reducer* yang terprediksi.

3. **Persistent Database (misalnya SQLite, AsyncStorage, atau backend/database eksternal)**
   - **Cakupan**: Menyimpan data secara permanen di penyimpanan perangkat atau server.
   - **Siklus hidup**: Data tetap ada meskipun aplikasi ditutup total, perangkat di-restart, atau sesi browser di-refresh.
   - **Cocok untuk**: Data pengguna yang harus bertahan jangka panjang lintas sesi.
