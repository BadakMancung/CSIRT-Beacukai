# 🔐 ENCRYPTION KEY DOCUMENTATION

## Cara Generate FILE_ENCRYPTION_KEY

### Method yang digunakan:
```bash
php -r "echo md5('beacukai_secure');"
```

### Hasil:
```
FILE_ENCRYPTION_KEY=7fd221711e148c242c51c14609aca57e
```

### Alternative Methods (jika perlu variasi):
```bash
# Option 1: beacukai basic
php -r "echo md5('beacukai');"
# Result: d547d58e4f302490dae6b550dbca150a

# Option 2: BEACUKAI uppercase  
php -r "echo md5('BEACUKAI');"
# Result: d932e2bd77d9853b0a175bea62d3f762

# Option 3: beacukai dengan tahun
php -r "echo md5('beacukai2024');"
# Result: 059de85d7af2e6b66c72501770c13ed2

# Option 4: csirt_beacukai
php -r "echo md5('csirt_beacukai');"
# Result: 3ff9bc08369f1f68f8c9fce1bf312ca5

# Option 5: beacukai_secure (RECOMMENDED)
php -r "echo md5('beacukai_secure');"
# Result: 7fd221711e148c242c51c14609aca57e
```

## 🚨 PENTING:
- Simpan command untuk generate, bukan hasil hash-nya
- Jika lupa, tinggal jalankan command di atas
- Konsisten gunakan kata yang sama untuk environment yang sama
- Backup dokumentasi ini di tempat aman

## 🔒 Security Notes:
- Hash MD5 dari kata sederhana cukup untuk encryption key
- Yang penting adalah consistency dan reproducibility
- Tidak perlu random key yang sulit diingat
- Mudah di-regenerate kapan saja dibutuhkan
