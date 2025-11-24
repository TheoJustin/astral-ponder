import { ponder } from "ponder:registry";
import { worldPurchase, world, worldOwner } from "ponder:schema";

ponder.on("WorldList:WorldPurchased", async ({ event, context }) => {
  const { buyer, worldName, price } = event.args;
  const { block, transaction } = event;

  // Create world purchase record
  await context.db.insert(worldPurchase).values({
    id: `${transaction.hash}-${event.logIndex}`,
    buyer,
    worldName,
    price,
    blockNumber: block.number,
    timestamp: block.timestamp,
    transactionHash: transaction.hash,
  });

  // Create or update world record
  await context.db.insert(world).values({
    id: worldName,
    name: worldName,
    owner: buyer,
    purchasePrice: price,
    purchasedAt: block.timestamp,
    transactionHash: transaction.hash,
  }).onConflictDoUpdate({
    target: "id",
    update: {
      owner: buyer,
      purchasePrice: price,
      purchasedAt: block.timestamp,
      transactionHash: transaction.hash,
    },
  });

  // Update owner stats
  const existingOwner = await context.db.find(worldOwner, { id: buyer });
  
  if (existingOwner) {
    await context.db.update(worldOwner, { id: buyer }).set({
      worldCount: existingOwner.worldCount + 1,
      totalSpent: existingOwner.totalSpent + price,
    });
  } else {
    await context.db.insert(worldOwner).values({
      id: buyer,
      address: buyer,
      worldCount: 1,
      totalSpent: price,
    });
  }
});
