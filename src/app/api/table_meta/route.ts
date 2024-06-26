import { NextRequest } from "next/server";
import { getFields } from "../vika";

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    const params = JSON.parse(body.params);
    const datasourceConfig = JSON.parse(params.datasourceConfig);

    const tableFields = await getFields(datasourceConfig.vikaToken, datasourceConfig.datasheetId);
    const message = {
      code: 0,
      data: {
        tableName: datasourceConfig.datasheetName,
        fields: tableFields,
      }
    }
    return new Response(JSON.stringify(message));
  } catch {
    const message = {
      code: 1254403,
    }
    return new Response(JSON.stringify(message));
  }

}