import { ponder } from "ponder:registry";
import { sql } from "ponder";
import { nftToken, nftPurchase, nftOwner, nftTransfer } from "../ponder.schema";

ponder.on("ERC721Contract:Transfer", async ({ event, context }) => {
  const { from, to, tokenId } = event.args;
  const { block, transaction } = event;

  // Handle minting (from zero address)
  if (from === "0x0000000000000000000000000000000000000000") {
    await context.db.insert(nftToken).values({
      id: tokenId.toString(),
      tokenId,
      owner: to,
      mintedAt: block.timestamp,
      transactionHash: transaction.hash,
    });

    // Update or create owner record
    await context.db
      .insert(nftOwner)
      .values({
        id: to,
        address: to,
        tokenCount: 1,
        totalSpent: 0n,
      })
      .onConflictDoUpdate({
        target: "id",
        update: {
          tokenCount: sql`token_count + 1`,
        },
      });
  } else {
    // Handle regular transfers
    await context.db
      .update(nftToken, { id: tokenId.toString() })
      .set({ owner: to });

    // Update from owner
    await context.db
      .update(nftOwner, { id: from })
      .set({
        tokenCount: sql`token_count - 1`,
      });

    // Update to owner
    await context.db
      .insert(nftOwner)
      .values({
        id: to,
        address: to,
        tokenCount: 1,
        totalSpent: 0n,
      })
      .onConflictDoUpdate({
        target: "id",
        update: {
          tokenCount: sql`token_count + 1`,
        },
      });
  }

  // Record transfer
  await context.db.insert(nftTransfer).values({
    id: `${transaction.hash}-${event.logIndex}`,
    from,
    to,
    tokenId,
    blockNumber: block.number,
    timestamp: block.timestamp,
    transactionHash: transaction.hash,
  });
});

ponder.on("ERC721Contract:NFTPurchased", async ({ event, context }) => {
  const { buyer, tokenId, price } = event.args;
  const { block, transaction } = event;

  await context.db.insert(nftPurchase).values({
    id: `${transaction.hash}-${event.logIndex}`,
    buyer,
    tokenId,
    price,
    blockNumber: block.number,
    timestamp: block.timestamp,
    transactionHash: transaction.hash,
  });

  // Update buyer's total spent
  await context.db
    .update(nftOwner, { id: buyer })
    .set({
      totalSpent: sql`total_spent + ${price}`,
    });
});