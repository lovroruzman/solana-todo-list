# 🚀 Solana Decentralizirana To-Do Aplikacija (dApp)

[cite_start]Ovaj projekt predstavlja funkcionalnu Web3 aplikaciju za upravljanje zadacima izgrađenu na **Solana** blockchainu[cite: 3]. [cite_start]Za razliku od tradicionalnih Web2 rješenja koja pohranjuju podatke na centraliziranim serverima, ovaj sustav osigurava korisniku potpuno vlasništvo nad podacima i otpornost na cenzuru[cite: 8, 9, 14].

## 📋 Pregled Projekta
[cite_start]Tradicionalne aplikacije ovise o pružatelju usluge koji podatke može obrisati ili izgubiti[cite: 10]. Moje rješenje koristi:
* [cite_start]**Nepromjenjivost:** Logika aplikacije (Smart Contract) je javno vidljiva i nepromjenjiva nakon postavljanja na mrežu[cite: 16].
* [cite_start]**Vlasništvo:** Svaki zadatak je kriptografski povezan isključivo s novčanikom (Walletom) korisnika[cite: 14].
* [cite_start]**Skalabilnost:** Zahvaljujući **Proof of History (PoH)** mehanizmu, transakcije su gotovo trenutne uz minimalne naknade (cca $0.00025)[cite: 32, 35, 36].

## 🛠️ Tehnologije (Tech Stack)
* [cite_start]**Backend:** Rust & Anchor Framework za pisanje sigurnih pametnih ugovora[cite: 21, 22].
* [cite_start]**Frontend:** Next.js (React) okvir za izradu modernog korisničkog sučelja[cite: 23].
* [cite_start]**Blockchain Integracija:** Solana Web3.js & Wallet Adapter biblioteke[cite: 24].
* [cite_start]**Autentifikacija:** Phantom Wallet za identifikaciju korisnika i potpisivanje transakcija[cite: 25, 92].

## 🏗️ Arhitektura (Solana Account Model)
[cite_start]U ovom projektu primijenjen je specifičan model gdje je logika strogo odvojena od pohrane podataka[cite: 39]:
1. [cite_start]**Program (Stateless):** Pametni ugovor napisan u Rustu koji služi isključivo kao izvršni kod[cite: 40].
2. [cite_start]**Data Accounts (Stateful):** Svaki zadatak je zaseban "Account" na blockchainu koji pohranjuje opis, status (`is_done`) i vlasnika[cite: 42, 46].
3. [cite_start]**Rent:** Mala količina SOL-a potrebna da bi račun s podacima ostao aktivan na mreži[cite: 43].



## 🚀 Kako pokrenuti projekt lokalno?

### 1. Pokretanje validatora
Pokrenite lokalni Solana čvor u zasebnom terminalu:
```bash
solana-test-validator
```

### 2. Build i Deploy programa
Kompajlirajte Rust kod i pošaljite ga na lokalnu mrežu:
```bash
anchor build
anchor deploy
```

### 3. Pokretanje sučelja
Uđite u app direktorij, instalirajte zavisnosti i pokrenite razvojni server:
```bash
cd app
yarn install
yarn dev
```

