import { customAlphabet } from "nanoid";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const generate = customAlphabet(ALPHABET, 21);

export function newId(prefix: string): string {
  return `${prefix}_${generate()}`;
}

export const ids = {
  tenant: () => newId("ten"),
  location: () => newId("loc"),
  user: () => newId("usr"),
  customer: () => newId("cus"),
  category: () => newId("cat"),
  menuItem: () => newId("itm"),
  modifierGroup: () => newId("mgrp"),
  modifier: () => newId("mod"),
  order: () => newId("ord"),
  orderItem: () => newId("oitm"),
  contentPage: () => newId("page"),
  localSeoPage: () => newId("place"),
  tag: () => newId("tag"),
  review: () => newId("rev"),
  openingHours: () => newId("oh"),
};
