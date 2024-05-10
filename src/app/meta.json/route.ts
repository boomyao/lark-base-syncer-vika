import { NextResponse } from "next/server";

const a = {
  "schemaVersion": 1,
  "version": "1.0.0",
  "type": "data_connector",
  "extraData": {
    "disabledPeriodicSync": false,
    "dataSourceConfigUiUri": "/"
  },
  "protocol": {
    "type": "http",
    "httpProtocol": {
      "uris": [
          {
            "type": "tableMeta",
            "uri": "/api/table_meta"
          },
          {
            "type": "records",
            "uri": "/api/records"
          }
      ]
    }
  }
}

export async function GET() {
  return new NextResponse(JSON.stringify(a), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    }
  });
}