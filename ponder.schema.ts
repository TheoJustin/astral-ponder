import { onchainTable } from "ponder";

export const worldPurchase = onchainTable("world_purchase", (t) => ({
  id: t.text().primaryKey(),
  buyer: t.hex().notNull(),
  worldName: t.text().notNull(),
  price: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const world = onchainTable("world", (t) => ({
  id: t.text().primaryKey(), // worldName
  name: t.text().notNull(),
  owner: t.hex().notNull(),
  purchasePrice: t.bigint().notNull(),
  purchasedAt: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const worldOwner = onchainTable("world_owner", (t) => ({
  id: t.hex().primaryKey(), // owner address
  address: t.hex().notNull(),
  worldCount: t.integer().notNull().default(0),
  totalSpent: t.bigint().notNull().default(0n),
}));

// ERC721 Tables
export const nftToken = onchainTable("nft_token", (t) => ({
  id: t.text().primaryKey(), // tokenId
  tokenId: t.bigint().notNull(),
  owner: t.hex().notNull(),
  uri: t.text(),
  mintedAt: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const nftPurchase = onchainTable("nft_purchase", (t) => ({
  id: t.text().primaryKey(),
  buyer: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  price: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const nftOwner = onchainTable("nft_owner", (t) => ({
  id: t.hex().primaryKey(), // owner address
  address: t.hex().notNull(),
  tokenCount: t.integer().notNull().default(0),
  totalSpent: t.bigint().notNull().default(0n),
}));

export const nftTransfer = onchainTable("nft_transfer", (t) => ({
  id: t.text().primaryKey(),
  from: t.hex().notNull(),
  to: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
