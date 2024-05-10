import { Vika } from "@vikadata/vika";
import type { Datasheet } from "@vikadata/vika/es/datasheet";

const enum BaseFieldType {
  Text = 1,
  Number = 2,
  SingleSelect = 3,
  MultiSelect = 4,
  Date = 5,
  Code = 6,
  Checkbox = 7,
  Currency = 8,
  Phone = 9,
  Bookmark = 10,
  Percent = 11,
  Rating = 12,
  Location = 13,
}

const VikaFieldTypeMap = {
  SingleText: BaseFieldType.Text,
  Text: BaseFieldType.Text,
  SingleSelect: BaseFieldType.SingleSelect,
  MultiSelect: BaseFieldType.MultiSelect,
  Number: BaseFieldType.Number,
  Currency: BaseFieldType.Currency,
  DateTime: BaseFieldType.Date,
  Percent: BaseFieldType.Percent,
  Checkbox: BaseFieldType.Checkbox,
  Phone: BaseFieldType.Phone,
  Rating: BaseFieldType.Rating,
  URL: BaseFieldType.Bookmark,
} as Record<string, BaseFieldType>;

export async function getFields(token: string, datasheetId: string) {
  const vika = new Vika({ token });
  const table = vika.datasheet(datasheetId);
  return getTableFields(table);
}

export async function getRecords(token: string, datasheetId: string) {
  const vika = new Vika({ token });
  const table = vika.datasheet(datasheetId);
  const fields = await getTableFields(table);
  const views = (await table.views.list()).data?.views || [];
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const chunks = await table.records.queryAll({ viewId: views[0].id });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const result: any[] = [];
  for await (const records of chunks) {
    records.forEach((record) => {
      result.push({
        primaryID: record.recordId,
        data: fields.reduce((acc, field) => {
          if (!field) return acc;
          acc[field.fieldID] = record.fields[field.fieldName];
          return acc;
        }, {} as Record<string, any>)
      })
    });
    // sleep 1s to avoid rate limit
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return result;
}

async function getTableFields(table: Datasheet) {
  const res = await table.fields.list();
  const tableFields = res.data!.fields.map((field) => {
    const type = VikaFieldTypeMap[field.type];
    if (!type) return null;
    return {
      fieldID: field.id,
      fieldName: field.name,
      fieldType: type,
      description: field.desc,
      isPrimary: field.isPrimary,
    }
  }
  ).filter(Boolean);

  return tableFields;
}