

// ------------------------- SCHEMA ------------------------------------------
model User {
  id          Int          @id @default(autoincrement())
  user_name   String?
  email       String?
  wallet      String       @unique
  created_at  DateTime     @default(now())


  collections Collection[]
  nfts        Nft[]
  sold        Sold[]
}

model Collection {
  id        Int      @id @default(autoincrement())
  user_id   Int
  address   String?
  col_uri   String
  createdAt DateTime @default(now())


  user      User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  nfts      Nft[]
}

model Nft {
  id            Int        @id @unique @default(autoincrement())
  token_id      Int
  col_id        Int
  uri           String
  owner_id      Int
  base_price    String?
  current_price String?
  status        String     @default("unlisted")
  createdAt     DateTime   @default(now())


  collection    Collection @relation(fields: [col_id], references: [id], onDelete: Cascade)
  owner         User       @relation(fields: [owner_id], references: [id], onDelete: Cascade)
}


model Sold {
  id       Int      @id @unique @default(autoincrement())
  token_id Int
  from     String
  to       String
  price    Decimal
  soldAt   DateTime @default(now())

  
  buyer    User     @relation(fields: [from], references: [wallet], onDelete: Cascade)
}
