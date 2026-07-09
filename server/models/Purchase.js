import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true,
  },
}, { timestamps: true });

// ✅ POST-SAVE MIDDLEWARE to log or notify
PurchaseSchema.post('save', async function (doc) {
  const purchaseId = doc._id;
  const buyerId = doc.buyer.toString();
  const templateId = doc.template.toString();

  console.log(`✅ Purchase saved to DB → ID: ${purchaseId}, Buyer: ${buyerId}, Template: ${templateId}`);

  // Optional: trigger server-side events here like WebSocket or email
  // e.g. io.to(buyerId).emit('purchase-success', { templateId });
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);
export default Purchase;
