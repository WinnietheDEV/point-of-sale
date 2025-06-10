# Point of Sale

โปรเจค POS พัฒนาโดยใช้

1. Angular (Frontend)
2. NestJS (Backend)
3. MongoDB (Database)

---

## ขั้นตอนการใช้งาน

### 1. Clone โปรเจกต์จาก GitHub

```bash
git clone https://github.com/your-username/your-project.git
```

### 2. ตรวจสอบว่าเครื่องมี Docker Desktop หรือไม่

```bash
docker --version
```

หากยังไม่มี Docker Desktop:

- ดาวน์โหลดได้ที่: https://www.docker.com/products/docker-desktop หลังติดตั้งเสร็จอาจต้องรีสตาร์ทคอมพิวเตอร์

### 3. เปิด Docker Desktop

- เปิดโปรแกรม Docker Desktop ขึ้นมา
- รอจนขึ้นสถานะว่า Docker is running (หรือไอคอนขึ้นสีเขียว)

### 4. รันโปรเจกต์ด้วย Docker Compose

เข้าไปที่ root folder ของโปรเจคและให้รันคำสั่งนี้:

```bash
docker-compose up -d --build
```

### 5. การเข้าถึงแอพพลิเคชั่น

- Frontend: http://localhost:4201
- Backend: http://localhost:3001

### 6. ปิดระบบทั้งหมด

หากต้องการหยุดและลบ container ให้รัน:

```bash
docker-compose down
```
