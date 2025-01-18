import { Request, ResponseToolkit } from "@hapi/hapi";
import Item from "../../models/Item";

export const getItems = async (requet: Request, h: ResponseToolkit) => {
  try {
    const items = await Item.find();
    return h.response(items.map((item) => item.toJSON())).code(200);
  } catch (error) {
    console.log(error);
    return h.response().code(500);
  }
};

export const getItemById = async (request: Request, h: ResponseToolkit) => {
  try {
    const id = request.params.id!;
    const item = await Item.findOne({ id });

    if (!item) {
      return h.response().code(404);
    }

    return h.response(item.toJSON()).code(200);
  } catch (error) {
    console.log(error);
    return h.response().code(500);
  }
};

export const createItem = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload;
    const newItem = new Item(payload);
    await newItem.save();
    return h.response(newItem.toJSON()).code(201);
  } catch (error) {
    console.log(error);
    return h.response().code(500);
  }
};

export const updateItem = async (request: Request, h: ResponseToolkit) => {
  try {
    const id = request.params.id!;
    const payload = request.payload as { name: string; price: number };

    const item = await Item.findOneAndUpdate({ id }, payload, {
      new: true,
    });

    if (!item) {
      return h.response().code(404);
    }

    return h.response(item.toJSON()).code(200);
  } catch (error) {
    console.log(error);
    return h.response().code(500);
  }
};

export const deleteItem = async (request: Request, h: ResponseToolkit) => {
  try {
    const id = request.params.id;
    const item = await Item.findOneAndDelete({ id });

    if (!item) {
      return h.response().code(404);
    }

    return h.response().code(204);
  } catch (error) {
    console.log(error);
    return h.response().code(500);
  }
};

/* added this function to delete all items, if items exists on database
the test named "should be able to list all items" will fail because it validate an empty array */
export const deleteAllItems = async (request: Request, h: ResponseToolkit) => {
  try {
    await Item.deleteMany({});
    return h.response().code(204);
  } catch (error) {
    console.log(error);
    return h.response().code(500);
  }
};
