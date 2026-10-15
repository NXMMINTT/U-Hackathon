import type { components } from "@/types/api.gen";

type Schemas = components["schemas"];

export type Overview = Schemas["OverviewOut"];

export type TaxMeter = Schemas["TaxMeterOut"];

export type TransactionItem = Schemas["TransactionOut"];

export type ProductItem = Schemas["ProductOut"];

export type TransactionUpdate = Schemas["TransactionUpdateIn"];
