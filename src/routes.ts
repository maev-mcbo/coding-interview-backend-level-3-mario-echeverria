import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import {
  createItem,
  deleteAllItems,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from "./controllers/items";

// Joi schema for item validation at request level
const itemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required().min(0).messages({
    "number.min": 'Field "price" cannot be negative',
    "any.required": 'Field "price" is required',
  }),
});

export const routes: ServerRoute[] = [
  // Health check
  {
    method: "GET",
    path: "/ping",
    handler: () => {
      return { ok: true };
    },
  },
  // Get all items
  {
    method: "GET",
    path: "/items",
    handler: getItems,
  },
  // Get item by id
  {
    method: "GET",
    path: "/items/{id}",
    handler: getItemById,
  },
  // Create item
  {
    method: "POST",
    path: "/items",
    options: {
      validate: {
        payload: itemSchema,
        failAction: async (
          request: Request,
          h: ResponseToolkit,
          err?: Error
        ) => {
          if (err) {
            const joiError = err as Joi.ValidationError;
            const error = joiError.details[0];
            return h
              .response({
                errors: [
                  {
                    field: error.path[0],
                    message: error.message,
                  },
                ],
              })
              .code(400)
              .takeover();
          }
          return h.continue;
        },
      },
    },
    handler: createItem,
  },
  // Update item
  {
    method: "PUT",
    path: "/items/{id}",
    options: {
      validate: {
        payload: itemSchema,
        failAction: async (
          request: Request,
          h: ResponseToolkit,
          err?: Error
        ) => {
          if (err) {
            const joiError = err as Joi.ValidationError;
            const error = joiError.details[0];
            return h
              .response({
                errors: [
                  {
                    field: error.path[0],
                    message: error.message,
                  },
                ],
              })
              .code(400)
              .takeover();
          }
          return h.continue;
        },
      },
    },
    handler: updateItem,
  },
  // Delete item
  {
    method: "DELETE",
    path: "/items/{id}",
    handler: deleteItem,
  },
  // Delete all items
  {
    method: "DELETE",
    path: "/items/delete-all",
    handler: deleteAllItems,
  },
];
