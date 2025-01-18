import mongoose, { Document, Schema } from "mongoose";

// Interface para TypeScript
export interface IItem extends Document {
  id?: number; // Añadido para coincidir con los tests
  name: string;
  price: number;
}

// Schema de Mongoose
const ItemSchema: Schema = new Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: [true, 'Field "name" is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Field "price" is required'],
      validate: {
        validator: function (value: number) {
          return value >= 0;
        },
        message: 'Field "price" cannot be negative',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        return {
          id: ret.id,
          name: ret.name,
          price: ret.price,
        };
      },
    },
  }
);

// Middleware para auto-incrementar el ID
ItemSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastItem = await mongoose
      .model("Item")
      .findOne({}, {}, { sort: { id: -1 } });
    this.id = lastItem ? lastItem.id + 1 : 1;
  }
  next();
});

// Exportamos el modelo
export default mongoose.model<IItem>("Item", ItemSchema);
