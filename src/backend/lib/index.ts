import { userCollectionRef } from "@backend/db";
import {
  addDoc as addDocFB,
  query,
  getDocs,
  QueryConstraint,
} from "firebase/firestore";

type AddDocProps = {
  collection: "user" | "admin";
  values: {};
};

export const addDoc = async (
  collection: AddDocProps["collection"] = "user",
  values: AddDocProps["values"]
) => {
  const getCollection =
    collection === "user" ? userCollectionRef : userCollectionRef;

  return await addDocFB(getCollection, values);
};

type FilterDocProps = {
  collection: "user" | "admin";
  where: QueryConstraint;
};

export const filterDoc = async (
  collection: FilterDocProps["collection"] = "user",
  where: FilterDocProps["where"]
) => {
  const getCollection =
    collection === "user" ? userCollectionRef : userCollectionRef;

  const res = query(getCollection, where);
  const querySnapshot = await getDocs(res);

  const data = [] as any;

  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};
