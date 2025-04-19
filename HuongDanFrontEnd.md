# ⚙️ Cache file 3D trên frontend sử dụng LRU + Signed URL từ Supabase

## ✅ Frontend xử lý như thế nào?

Gồm 3 bước:

---

### 🧱 (1) Cấu trúc cache IndexedDB đơn giản

Lưu từng item như sau:

```js
{
  fileName: "spaceship.glb",
  blob: Blob,
  lastAccessed: Date.now(),
  expiresAt: Date.now() + ttl * 1000,
  size: blob.size
}
```

## ⚙️ (2) Logic cache LRU + TTL bằng idb-keyval

```js
import { get, set, del, keys } from 'idb-keyval';

const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB

async function loadModelWithLRU(fileName, signedUrl, ttl) {
  const existing = await get(fileName);
  const now = Date.now();

  // Nếu có trong cache và chưa hết hạn
  if (existing && existing.expiresAt > now) {
    existing.lastAccessed = now;
    await set(fileName, existing);
    return URL.createObjectURL(existing.blob);
  }

  // Tải từ signed URL
  const res = await fetch(signedUrl);
  const blob = await res.blob();

  // Cập nhật cache
  const cacheItem = {
    blob,
    lastAccessed: now,
    expiresAt: now + ttl * 1000,
    size: blob.size
  };
  await set(fileName, cacheItem);

  // Cleanup LRU nếu vượt giới hạn
  await cleanupLRU();

  return URL.createObjectURL(blob);
}

async function cleanupLRU() {
  let total = 0;
  const items = [];

  for (const key of await keys()) {
    const item = await get(key);
    if (!item) continue;

    total += item.size;
    items.push({ key, ...item });
  }

  // Nếu chưa vượt giới hạn thì thôi
  if (total < MAX_TOTAL_SIZE) return;

  // Sắp xếp theo thời gian truy cập cũ nhất
  items.sort((a, b) => a.lastAccessed - b.lastAccessed);

  for (const item of items) {
    if (total < MAX_TOTAL_SIZE) break;
    await del(item.key);
    total -= item.size;
  }
}


📦 (3) Dùng blob cache trong Three.js

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function renderModel() {
  // chỗ này là lấy signedURL (chẳng hạn)
  const { url, fileName, ttl } = await fetch('/api/get-signed-url?model=spaceship')
    .then(res => res.json());

  const blobUrl = await loadModelWithLRU(fileName, url, ttl);

  const loader = new GLTFLoader();
  loader.load(blobUrl, (gltf) => {
    scene.add(gltf.scene);
  });
}
```

## ✅ Tóm lại:

| Thành phần   | Nhiệm vụ                                                             |
| ------------ | -------------------------------------------------------------------- |
| **Backend**  | Trả signed URL + TTL từ Supabase                                     |
| **Frontend** | Tải file 3D nếu chưa có, lưu cache vào IndexedDB + quản lý LRU & TTL |
| **Three.js** | Load model từ Blob URL trả về để render                              |

## Frontend sử dụng Signed URL để upload file

Sau khi backend tạo được signed URL, bạn có thể gửi signed URL đó về frontend, và frontend sẽ sử dụng fetch hoặc XMLHttpRequest để upload file lên Supabase.

Mã frontend để upload file qua Signed URL:

```js
async function uploadFileToSupabase(signedUrl: string, file: File) {
  const res = await fetch(signedUrl, {
    method: 'PUT',  // Phương thức PUT để upload
    headers: {
      'Content-Type': 'model/gltf-binary',
    },
    body: file,  // Gửi file lên (trong thẻ input, file = fileinput.files[0] chẳng hạn)
  });

  if (!res.ok) {
    console.error('Error uploading file:', res.statusText);
    return;

  console.log('File uploaded successfully!');
}
```

### ✅ **Tóm tắt**:

| Thành phần   | Nhiệm vụ                                                             |
| ------------ | -------------------------------------------------------------------- |
| **Backend**  | Tạo **signed URL (getSighnURL - fetch . get)** cho việc upload file  |
| **Frontend** | Sử dụng **signed URL (backend trả về)** này để gửi file lên Supabase |
